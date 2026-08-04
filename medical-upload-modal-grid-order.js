(function () {
  if (window.__medicalUploadGridOrderV3) return;
  window.__medicalUploadGridOrderV3 = true;

  const STYLE_ID = 'medical-upload-grid-order-style';
  const GRID_CLASS = 'medical-upload-grid-order';
  const HIDDEN_CLASS = 'medical-upload-order-hidden';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${GRID_CLASS} {
        display: grid !important;
        grid-template-columns: repeat(5, 72px) !important;
        gap: 12px !important;
        align-items: start !important;
        justify-content: start !important;
        width: max-content !important;
        max-width: 408px !important;
        margin: 14px 0 0 !important;
      }
      .${GRID_CLASS} > * {
        width: 72px !important;
        height: 72px !important;
        margin: 0 !important;
        flex: none !important;
        box-sizing: border-box !important;
      }
      .${GRID_CLASS} img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        border-radius: 6px !important;
        display: block !important;
      }
      .${GRID_CLASS} .medical-upload-thumb {
        order: 1 !important;
      }
      .${GRID_CLASS} .medical-upload-add {
        order: 2 !important;
      }
      .${HIDDEN_CLASS} {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function isVisible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function findUploadDialog() {
    const candidates = Array.from(document.querySelectorAll('[role="dialog"], .modal, .ant-modal, .el-dialog, div'))
      .filter((el) => {
        if (!isVisible(el)) return false;
        const text = el.textContent || '';
        if (!text.includes('上传病历资料') || !text.includes('确定') || !text.includes('取消')) return false;
        const rect = el.getBoundingClientRect();
        return rect.width >= 420 && rect.width <= 1100 && rect.height >= 260 && rect.height <= 900;
      });

    return candidates.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return ar.width * ar.height - br.width * br.height;
    })[0] || null;
  }

  function unique(items) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function findCompactTile(el, root) {
    let node = el;
    let best = el;
    while (node && node !== root && node !== document.body) {
      const rect = node.getBoundingClientRect();
      if (rect.width >= 42 && rect.width <= 120 && rect.height >= 42 && rect.height <= 120) {
        best = node;
      }
      node = node.parentElement;
    }
    return best;
  }

  function findCheckboxAnchor(dialog) {
    return Array.from(dialog.querySelectorAll('label, div, span'))
      .filter(isVisible)
      .find((el) => (el.textContent || '').includes('以上内容属于同一份报告')) || null;
  }

  function ensureGrid(dialog, anchor) {
    let grid = dialog.querySelector(`.${GRID_CLASS}`);
    if (!grid) {
      grid = document.createElement('div');
      grid.className = GRID_CLASS;
    }
    if (anchor) {
      const row = anchor.closest('label') || anchor;
      if (row.nextElementSibling !== grid) {
        row.insertAdjacentElement('afterend', grid);
      }
    }
    return grid;
  }

  function isPlusNode(el) {
    return (el.textContent || '').trim() === '+';
  }

  function normalizeUploadList() {
    injectStyle();
    const dialog = findUploadDialog();
    if (!dialog) return;

    const anchor = findCheckboxAnchor(dialog);
    const grid = ensureGrid(dialog, anchor);

    const thumbs = unique(
      Array.from(dialog.querySelectorAll('img'))
        .filter(isVisible)
        .map((img) => findCompactTile(img, dialog))
    ).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return ar.top === br.top ? ar.left - br.left : ar.top - br.top;
    });

    const plusTiles = unique(
      Array.from(dialog.querySelectorAll('*'))
        .filter((el) => isVisible(el) && isPlusNode(el))
        .map((el) => findCompactTile(el, dialog))
    ).filter((tile) => !thumbs.includes(tile));

    const activePlus = plusTiles[0] || null;

    thumbs.forEach((tile) => {
      tile.classList.add('medical-upload-thumb');
      tile.classList.remove(HIDDEN_CLASS);
      grid.appendChild(tile);
    });

    if (activePlus) {
      activePlus.classList.add('medical-upload-add');
      activePlus.classList.remove(HIDDEN_CLASS);
      grid.appendChild(activePlus);
    }

    plusTiles.forEach((tile) => {
      if (tile !== activePlus) tile.classList.add(HIDDEN_CLASS);
    });

    if (activePlus && thumbs.length >= 20) {
      activePlus.classList.add(HIDDEN_CLASS);
    }
  }

  document.addEventListener('click', () => setTimeout(normalizeUploadList, 30), true);
  document.addEventListener('change', () => setTimeout(normalizeUploadList, 30), true);
  document.addEventListener('input', () => setTimeout(normalizeUploadList, 30), true);

  new MutationObserver(() => normalizeUploadList()).observe(document.body, {
    childList: true,
    subtree: true,
  });

  setInterval(normalizeUploadList, 300);
  normalizeUploadList();
})();
