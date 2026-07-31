(function () {
  if (window.__medicalUploadModalV9Fix) return;
  window.__medicalUploadModalV9Fix = true;

  const STYLE_ID = 'medical-upload-modal-v9-style';
  const GALLERY_CLASS = 'medical-upload-gallery-v9';
  const HIDDEN_CLASS = 'medical-upload-hidden-v9';

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${GALLERY_CLASS} {
        display: grid !important;
        grid-template-columns: repeat(5, 72px) !important;
        grid-auto-rows: 72px !important;
        gap: 12px !important;
        align-items: start !important;
        justify-content: start !important;
        width: max-content !important;
        max-width: 408px !important;
        margin: 14px 0 0 !important;
        padding: 0 !important;
      }
      .${GALLERY_CLASS} > * {
        width: 72px !important;
        height: 72px !important;
        min-width: 72px !important;
        min-height: 72px !important;
        max-width: 72px !important;
        max-height: 72px !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        position: relative !important;
        flex: none !important;
      }
      .${GALLERY_CLASS} img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        border-radius: 4px !important;
        display: block !important;
      }
      .${GALLERY_CLASS} [data-medical-add-v9="true"] {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px dashed #d8e2f3 !important;
        border-radius: 4px !important;
        background: #f8fbff !important;
        color: #172b4d !important;
        font-size: 28px !important;
        line-height: 1 !important;
        cursor: pointer !important;
      }
      .${HIDDEN_CLASS} {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function isVisible(el) {
    if (!el || !(el instanceof HTMLElement)) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function textOf(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, '');
  }

  function findUploadModal() {
    const nodes = Array.from(document.querySelectorAll('div, section, article'));
    const candidates = nodes.filter((node) => {
      const text = textOf(node);
      if (!text.includes('上传病历资料')) return false;
      const rect = node.getBoundingClientRect();
      return rect.width >= 420 && rect.height >= 260 && isVisible(node);
    });
    return candidates.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return (ar.width * ar.height) - (br.width * br.height);
    })[0] || null;
  }

  function findCheckboxRow(modal) {
    const nodes = Array.from(modal.querySelectorAll('label, div, p, span'));
    return nodes.find((node) => textOf(node).includes('以上内容属于同一份报告')) || null;
  }

  function findFooterNote(modal) {
    const nodes = Array.from(modal.querySelectorAll('div, p, span'));
    return nodes.find((node) => textOf(node).includes('支持拖拽或点击上传')) || null;
  }

  function looksLikeTile(el, modal) {
    if (!el || el === modal || !(el instanceof HTMLElement)) return false;
    const rect = el.getBoundingClientRect();
    const hasImage = !!el.querySelector('img');
    const hasInput = !!el.querySelector('input[type="file"]');
    const isPlus = textOf(el) === '+';
    const sizeOk = rect.width >= 40 && rect.width <= 130 && rect.height >= 40 && rect.height <= 130;
    const classHint = /upload|file|thumb|image|pic|avatar|photo/i.test(el.className || '');
    return sizeOk && (hasImage || hasInput || isPlus || classHint);
  }

  function closestTile(el, modal) {
    let current = el;
    while (current && current !== modal) {
      if (looksLikeTile(current, modal)) return current;
      current = current.parentElement;
    }
    return el instanceof HTMLElement ? el : null;
  }

  function uniqueByNode(nodes) {
    return Array.from(new Set(nodes.filter(Boolean)));
  }

  function collectTiles(modal) {
    const footer = findFooterNote(modal);
    const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
    const all = [];

    modal.querySelectorAll('img').forEach((img) => {
      const tile = closestTile(img, modal);
      if (!tile) return;
      const rect = tile.getBoundingClientRect();
      if (rect.top < footerTop) all.push(tile);
    });

    modal.querySelectorAll('input[type="file"]').forEach((input) => {
      const tile = closestTile(input, modal);
      if (tile) all.push(tile);
    });

    modal.querySelectorAll('button, div, span, label').forEach((node) => {
      if (textOf(node) !== '+') return;
      const tile = closestTile(node, modal);
      if (tile) all.push(tile);
    });

    const tiles = uniqueByNode(all);
    const imageTiles = tiles
      .filter((tile) => !!tile.querySelector('img') && !tile.querySelector('input[type="file"]'))
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return ar.top === br.top ? ar.left - br.left : ar.top - br.top;
      });

    const addTiles = tiles.filter((tile) => {
      const hasInput = !!tile.querySelector('input[type="file"]');
      const isPlus = textOf(tile) === '+' || !!tile.querySelector('input[type="file"]');
      return !tile.querySelector('img') && (hasInput || isPlus);
    });

    return { imageTiles, addTiles, allTiles: tiles };
  }

  function normalizeAddTile(addTile) {
    if (!addTile) {
      addTile = document.createElement('button');
      addTile.type = 'button';
      addTile.textContent = '+';
    }
    addTile.dataset.medicalAddV9 = 'true';
    addTile.classList.remove(HIDDEN_CLASS);
    addTile.style.removeProperty('display');
    return addTile;
  }

  function applyUploadLayout() {
    ensureStyle();
    const modal = findUploadModal();
    if (!modal) return;

    const checkboxRow = findCheckboxRow(modal);
    if (!checkboxRow) return;

    let gallery = modal.querySelector(`.${GALLERY_CLASS}`);
    if (!gallery) {
      gallery = document.createElement('div');
      gallery.className = GALLERY_CLASS;
      checkboxRow.insertAdjacentElement('afterend', gallery);
    }

    const { imageTiles, addTiles, allTiles } = collectTiles(modal);
    const addTile = normalizeAddTile(addTiles.find(isVisible) || addTiles[0]);
    const expected = new Set([...imageTiles, addTile, gallery]);

    allTiles.forEach((tile) => {
      if (expected.has(tile)) {
        tile.classList.remove(HIDDEN_CLASS);
        tile.style.removeProperty('display');
      } else if (!tile.closest(`.${GALLERY_CLASS}`)) {
        tile.classList.add(HIDDEN_CLASS);
        tile.style.setProperty('display', 'none', 'important');
      }
    });

    imageTiles.forEach((tile) => {
      tile.classList.remove(HIDDEN_CLASS);
      tile.style.removeProperty('display');
      gallery.appendChild(tile);
    });

    if (imageTiles.length < 20) {
      gallery.appendChild(addTile);
      addTile.classList.remove(HIDDEN_CLASS);
      addTile.style.removeProperty('display');
    } else {
      addTile.classList.add(HIDDEN_CLASS);
      addTile.style.setProperty('display', 'none', 'important');
    }
  }

  const schedule = (() => {
    let timer = 0;
    return function scheduleApply() {
      clearTimeout(timer);
      timer = setTimeout(applyUploadLayout, 40);
    };
  })();

  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  document.addEventListener('click', schedule, true);
  document.addEventListener('change', schedule, true);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  setInterval(schedule, 1200);
  schedule();
})();
