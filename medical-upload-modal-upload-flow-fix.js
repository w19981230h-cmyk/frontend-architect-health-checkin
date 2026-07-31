(() => {
  if (window.__medicalUploadModalUploadFlowFixV5) return;
  window.__medicalUploadModalUploadFlowFixV5 = true;

  const MAX_UPLOADS = 20;
  const STYLE_ID = 'medical-upload-modal-upload-flow-fix-style-v5';
  const GRID_CLASS = 'medical-upload-flow-grid';
  const THUMB_CLASS = 'medical-upload-flow-thumb';
  const ADD_CLASS = 'medical-upload-flow-add';
  const HIDDEN_CLASS = 'medical-upload-flow-hidden';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${GRID_CLASS} {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: flex-start !important;
        gap: 12px !important;
        max-width: 408px !important;
        margin-top: 14px !important;
      }
      .${GRID_CLASS} > .${THUMB_CLASS},
      .${GRID_CLASS} > .${ADD_CLASS} {
        flex: 0 0 72px !important;
        width: 72px !important;
        height: 72px !important;
        margin: 0 !important;
        box-sizing: border-box !important;
      }
      .${GRID_CLASS} > .${THUMB_CLASS} {
        order: 1 !important;
      }
      .${GRID_CLASS} > .${THUMB_CLASS} img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        border-radius: 4px !important;
        display: block !important;
      }
      .${GRID_CLASS} > .${ADD_CLASS} {
        order: 2 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px dashed #b8c7dc !important;
        border-radius: 4px !important;
        background: #f8fbff !important;
        color: #183153 !important;
        font-size: 30px !important;
        line-height: 1 !important;
        cursor: pointer !important;
      }
      .${HIDDEN_CLASS} {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function compactText(node) {
    return (node?.textContent || '').replace(/\s+/g, '').trim();
  }

  function isVisible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
  }

  function findUploadDialog() {
    const title = Array.from(document.querySelectorAll('h1,h2,h3,h4,div,span'))
      .find((el) => compactText(el) === '上传病历资料');
    if (!title) return null;

    let node = title;
    for (let depth = 0; node && depth < 10; depth += 1, node = node.parentElement) {
      const text = compactText(node);
      const rect = node.getBoundingClientRect();
      if (text.includes('取消') && text.includes('确定') && rect.width > 420 && rect.height > 260) {
        return node;
      }
    }
    return title.closest('[role="dialog"]') || title.parentElement;
  }

  function findCheckboxRow(dialog) {
    return Array.from(dialog.querySelectorAll('label,div,span,p'))
      .find((el) => compactText(el).includes('以上内容属于同一份报告'));
  }

  function getOrCreateGrid(dialog) {
    let grid = dialog.querySelector(`.${GRID_CLASS}`);
    if (grid) return grid;

    grid = document.createElement('div');
    grid.className = GRID_CLASS;
    const checkboxRow = findCheckboxRow(dialog);
    if (checkboxRow) {
      checkboxRow.insertAdjacentElement('afterend', grid);
    } else {
      const body = Array.from(dialog.children).find((el) => el.getBoundingClientRect().height > 120) || dialog;
      body.appendChild(grid);
    }
    return grid;
  }

  function tileFrom(el, dialog) {
    let node = el.closest?.('label,button,div,span') || el;
    for (let depth = 0; node && node !== dialog && depth < 9; depth += 1, node = node.parentElement) {
      const rect = node.getBoundingClientRect();
      if (rect.width >= 48 && rect.width <= 132 && rect.height >= 48 && rect.height <= 132) {
        return node;
      }
    }
    return el.parentElement && dialog.contains(el.parentElement) ? el.parentElement : null;
  }

  function unique(list) {
    return list.filter((item, index) => item && list.indexOf(item) === index);
  }

  function sortByDom(list) {
    return unique(list).sort((a, b) => {
      if (a === b) return 0;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
  }

  function collectThumbTiles(dialog) {
    return sortByDom(
      Array.from(dialog.querySelectorAll('img'))
        .map((img) => tileFrom(img, dialog))
        .filter(Boolean)
    );
  }

  function collectPlusTiles(dialog, thumbTiles) {
    const plusTiles = [];
    dialog.querySelectorAll('*').forEach((el) => {
      if (compactText(el) === '+') {
        const tile = tileFrom(el, dialog);
        if (tile) plusTiles.push(tile);
      }
    });
    dialog.querySelectorAll('input[type="file"]').forEach((input) => {
      const tile = tileFrom(input, dialog);
      if (tile) plusTiles.push(tile);
    });
    return unique(plusTiles).filter((tile) => !thumbTiles.includes(tile));
  }

  function normalizeUploadArea() {
    const dialog = findUploadDialog();
    if (!dialog) return;

    const grid = getOrCreateGrid(dialog);
    const thumbs = collectThumbTiles(dialog);
    const plusTiles = collectPlusTiles(dialog, thumbs);
    const addTile = plusTiles.find(isVisible) || plusTiles[0];

    thumbs.forEach((tile) => {
      tile.classList.remove(HIDDEN_CLASS, ADD_CLASS);
      tile.classList.add(THUMB_CLASS);
      grid.appendChild(tile);
    });

    plusTiles.forEach((tile) => {
      if (tile !== addTile) tile.classList.add(HIDDEN_CLASS);
    });

    if (addTile) {
      if (thumbs.length >= MAX_UPLOADS) {
        addTile.classList.add(HIDDEN_CLASS);
      } else {
        addTile.classList.remove(HIDDEN_CLASS, THUMB_CLASS);
        addTile.classList.add(ADD_CLASS);
        addTile.setAttribute('aria-label', '继续上传');
        grid.appendChild(addTile);
      }
    }
  }

  injectStyle();
  const schedule = () => requestAnimationFrame(normalizeUploadArea);
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  ['DOMContentLoaded', 'load', 'resize'].forEach((eventName) => window.addEventListener(eventName, schedule, true));
  ['click', 'change'].forEach((eventName) => document.addEventListener(eventName, () => setTimeout(schedule, 0), true));

  let attempts = 0;
  const timer = setInterval(() => {
    normalizeUploadArea();
    attempts += 1;
    if (attempts > 80) clearInterval(timer);
  }, 250);
})();
