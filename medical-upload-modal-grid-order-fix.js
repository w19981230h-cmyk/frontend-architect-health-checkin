(function () {
  if (window.__medicalUploadGridOrderFixV1) return;
  window.__medicalUploadGridOrderFixV1 = true;

  const MAX_FILES = 20;
  const STYLE_ID = 'medical-upload-grid-order-fix-style';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .medical-upload-grid-order {
        display: grid !important;
        grid-template-columns: repeat(5, 72px) !important;
        gap: 12px !important;
        align-items: start !important;
        justify-content: start !important;
        width: max-content !important;
        max-width: 408px !important;
        margin: 14px 0 0 !important;
      }
      .medical-upload-grid-order > * {
        width: 72px !important;
        height: 72px !important;
        min-width: 72px !important;
        min-height: 72px !important;
        max-width: 72px !important;
        max-height: 72px !important;
        margin: 0 !important;
        position: relative !important;
      }
      .medical-upload-grid-order img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        border-radius: 6px !important;
      }
      .medical-upload-grid-order .medical-upload-thumb {
        order: 1 !important;
      }
      .medical-upload-grid-order .medical-upload-add {
        order: 2 !important;
      }
      .medical-upload-order-hidden {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function visible(el) {
    if (!el || !el.isConnected) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function findDialog() {
    const title = Array.from(document.querySelectorAll('body *')).find((el) => {
      return visible(el) && (el.textContent || '').trim() === '上传病历资料';
    });
    if (!title) return null;

    let node = title;
    while (node && node !== document.body) {
      const rect = node.getBoundingClientRect();
      const text = node.textContent || '';
      if (rect.width >= 520 && rect.width <= 980 && rect.height >= 280 && text.includes('确定') && text.includes('取消')) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function findTile(el, root) {
    let node = el;
    while (node && node !== root) {
      const rect = node.getBoundingClientRect();
      if (rect.width >= 42 && rect.width <= 120 && rect.height >= 42 && rect.height <= 120) {
        return node;
      }
      node = node.parentElement;
    }
    return el;
  }

  function findCheckbox(dialog) {
    return Array.from(dialog.querySelectorAll('*')).find((el) => {
      return visible(el) && (el.textContent || '').includes('以上内容属于同一份报告');
    });
  }

  function ensureGrid(dialog) {
    let grid = dialog.querySelector('.medical-upload-grid-order');
    if (grid) return grid;

    grid = document.createElement('div');
    grid.className = 'medical-upload-grid-order';

    const checkbox = findCheckbox(dialog);
    const anchor = checkbox ? checkbox.closest('label, div, section') || checkbox : null;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(grid, anchor.nextSibling);
    } else {
      const content = Array.from(dialog.children).find((child) => child.getBoundingClientRect().height > 140) || dialog;
      content.appendChild(grid);
    }
    return grid;
  }

  function normalizeUploadGrid() {
    injectStyle();
    const dialog = findDialog();
    if (!dialog) return;

    const grid = ensureGrid(dialog);
    const thumbs = Array.from(new Set(
      Array.from(dialog.querySelectorAll('img'))
        .filter(visible)
        .map((img) => findTile(img, dialog))
    )).sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return ar.top === br.top ? ar.left - br.left : ar.top - br.top;
    });

    const plusTiles = Array.from(new Set(
      Array.from(dialog.querySelectorAll('*'))
        .filter((el) => visible(el) && (el.textContent || '').trim() === '+')
        .map((el) => findTile(el, dialog))
    ));

    thumbs.forEach((tile) => {
      tile.classList.add('medical-upload-thumb');
      tile.classList.remove('medical-upload-add', 'medical-upload-order-hidden');
      if (tile.parentElement !== grid) grid.appendChild(tile);
    });

    const candidatePlusTiles = plusTiles.filter((tile) => !thumbs.includes(tile));
    const mainPlus = candidatePlusTiles.find((tile) => tile.querySelector('input[type="file"]')) || candidatePlusTiles[0];

    plusTiles.forEach((tile) => {
      if (tile === mainPlus && thumbs.length < MAX_FILES) {
        tile.classList.add('medical-upload-add');
        tile.classList.remove('medical-upload-thumb', 'medical-upload-order-hidden');
        if (tile.parentElement !== grid) grid.appendChild(tile);
      } else {
        tile.classList.add('medical-upload-order-hidden');
      }
    });
  }

  document.addEventListener('click', () => setTimeout(normalizeUploadGrid, 0), true);
  document.addEventListener('change', () => setTimeout(normalizeUploadGrid, 0), true);
  new MutationObserver(normalizeUploadGrid).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', normalizeUploadGrid);
  setInterval(normalizeUploadGrid, 300);
})();
