(function () {
  if (window.__medicalUploadModalSingleGridFixV1) return;
  window.__medicalUploadModalSingleGridFixV1 = true;

  const MAX_FILES = 20;
  const STYLE_ID = 'medical-upload-modal-single-grid-fix-style';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .medical-upload-single-grid {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
        gap: 12px !important;
        width: 408px !important;
        max-width: 408px !important;
        margin: 14px 0 0 !important;
      }
      .medical-upload-single-grid > * {
        flex: 0 0 72px !important;
        width: 72px !important;
        height: 72px !important;
        min-width: 72px !important;
        min-height: 72px !important;
        max-width: 72px !important;
        max-height: 72px !important;
        margin: 0 !important;
        position: relative !important;
      }
      .medical-upload-single-grid img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        border-radius: 6px !important;
      }
      .medical-upload-single-grid .medical-upload-thumb-item {
        order: 1 !important;
      }
      .medical-upload-single-grid .medical-upload-add-item {
        order: 2 !important;
      }
      .medical-upload-single-hidden {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function getDialog() {
    const title = Array.from(document.querySelectorAll('body *')).find((el) => {
      return isVisible(el) && (el.textContent || '').trim() === '上传病历资料';
    });
    if (!title) return null;

    let node = title;
    while (node && node !== document.body) {
      const rect = node.getBoundingClientRect();
      const text = node.textContent || '';
      if (rect.width >= 520 && rect.height >= 260 && text.includes('取消') && text.includes('确定')) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function findTile(node, root) {
    let current = node;
    while (current && current !== root) {
      const rect = current.getBoundingClientRect();
      if (rect.width >= 52 && rect.width <= 120 && rect.height >= 52 && rect.height <= 120) {
        return current;
      }
      current = current.parentElement;
    }
    return node;
  }

  function findCheckboxRow(dialog) {
    const checkboxText = Array.from(dialog.querySelectorAll('*')).find((el) => {
      return isVisible(el) && (el.textContent || '').includes('以上内容属于同一份报告');
    });
    return checkboxText ? checkboxText.closest('label, div, section') || checkboxText : null;
  }

  function ensureGrid(dialog) {
    let grid = dialog.querySelector('.medical-upload-single-grid');
    if (grid) return grid;

    grid = document.createElement('div');
    grid.className = 'medical-upload-single-grid';

    const checkboxRow = findCheckboxRow(dialog);
    if (checkboxRow && checkboxRow.parentNode) {
      checkboxRow.parentNode.insertBefore(grid, checkboxRow.nextSibling);
      return grid;
    }

    const content = Array.from(dialog.children).find((child) => {
      const rect = child.getBoundingClientRect();
      return rect.height > 160;
    }) || dialog;
    content.appendChild(grid);
    return grid;
  }

  function unique(items) {
    return Array.from(new Set(items)).filter(Boolean);
  }

  function sortByPosition(items) {
    return items.slice().sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return Math.abs(ar.top - br.top) < 2 ? ar.left - br.left : ar.top - br.top;
    });
  }

  function normalizeUploadModal() {
    injectStyle();
    const dialog = getDialog();
    if (!dialog) return;

    const grid = ensureGrid(dialog);

    const thumbTiles = sortByPosition(unique(
      Array.from(dialog.querySelectorAll('img'))
        .filter(isVisible)
        .map((img) => findTile(img, dialog))
    ));

    const plusTiles = unique(
      Array.from(dialog.querySelectorAll('*'))
        .filter((el) => isVisible(el) && (el.textContent || '').trim() === '+')
        .map((el) => findTile(el, dialog))
    ).filter((tile) => !thumbTiles.includes(tile));

    const addTile = plusTiles.find((tile) => tile.querySelector('input[type="file"]')) || plusTiles[0];

    thumbTiles.forEach((tile) => {
      tile.classList.add('medical-upload-thumb-item');
      tile.classList.remove('medical-upload-add-item', 'medical-upload-single-hidden');
      if (tile.parentElement !== grid) grid.appendChild(tile);
    });

    plusTiles.forEach((tile) => {
      if (tile === addTile && thumbTiles.length < MAX_FILES) {
        tile.classList.add('medical-upload-add-item');
        tile.classList.remove('medical-upload-thumb-item', 'medical-upload-single-hidden');
        if (tile.parentElement !== grid) grid.appendChild(tile);
      } else {
        tile.classList.add('medical-upload-single-hidden');
      }
    });
  }

  document.addEventListener('click', () => setTimeout(normalizeUploadModal, 0), true);
  document.addEventListener('change', () => setTimeout(normalizeUploadModal, 0), true);
  window.addEventListener('load', normalizeUploadModal);

  new MutationObserver(normalizeUploadModal).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setInterval(normalizeUploadModal, 300);
})();
