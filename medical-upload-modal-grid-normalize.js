(function () {
  if (window.__medicalUploadModalGridNormalizeV2) return;
  window.__medicalUploadModalGridNormalizeV2 = true;

  const MAX_FILES = 20;
  const STYLE_ID = 'medical-upload-modal-grid-normalize-style';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .medical-upload-normalized-grid {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: flex-start !important;
        justify-content: flex-start !important;
        gap: 12px !important;
        width: 408px !important;
        max-width: 408px !important;
        min-height: 72px !important;
        margin: 14px 0 0 !important;
      }

      .medical-upload-normalized-grid > * {
        flex: 0 0 72px !important;
        width: 72px !important;
        height: 72px !important;
        min-width: 72px !important;
        min-height: 72px !important;
        max-width: 72px !important;
        max-height: 72px !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        position: relative !important;
      }

      .medical-upload-normalized-grid img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        border-radius: 6px !important;
        display: block !important;
      }

      .medical-upload-normalized-grid .medical-upload-normalized-thumb {
        order: 1 !important;
      }

      .medical-upload-normalized-grid .medical-upload-normalized-add {
        order: 2 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px dashed #d8e2f3 !important;
        border-radius: 6px !important;
        background: #f8fbff !important;
        color: #1f4fff !important;
        font-size: 28px !important;
        cursor: pointer !important;
      }

      .medical-upload-normalized-hidden {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    const rect = el.getBoundingClientRect();
    const styles = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && styles.display !== 'none' && styles.visibility !== 'hidden';
  }

  function findDialog() {
    const title = Array.from(document.querySelectorAll('body *')).find((el) => {
      const text = (el.textContent || '').trim();
      return isVisible(el) && text === '上传病历资料';
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
      if (rect.width >= 48 && rect.width <= 120 && rect.height >= 48 && rect.height <= 120) {
        return current;
      }
      current = current.parentElement;
    }
    return node;
  }

  function findCheckboxAnchor(dialog) {
    return Array.from(dialog.querySelectorAll('*')).find((el) => {
      return isVisible(el) && (el.textContent || '').includes('以上内容属于同一份报告');
    });
  }

  function ensureGrid(dialog) {
    let grid = dialog.querySelector('.medical-upload-normalized-grid');
    if (grid) return grid;

    grid = document.createElement('div');
    grid.className = 'medical-upload-normalized-grid';

    const anchor = findCheckboxAnchor(dialog);
    const row = anchor && (anchor.closest('label') || anchor.parentElement);
    if (row && row.parentElement) {
      row.parentElement.insertBefore(grid, row.nextSibling);
      return grid;
    }

    const body = Array.from(dialog.children).find((child) => child.getBoundingClientRect().height > 160) || dialog;
    body.insertBefore(grid, body.firstChild || null);
    return grid;
  }

  function unique(items) {
    return Array.from(new Set(items)).filter(Boolean);
  }

  function byVisualOrder(items) {
    return items.slice().sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      if (Math.abs(ar.top - br.top) < 4) return ar.left - br.left;
      return ar.top - br.top;
    });
  }

  function normalizeUploadDialog() {
    injectStyle();
    const dialog = findDialog();
    if (!dialog) return;

    const grid = ensureGrid(dialog);
    const thumbs = byVisualOrder(unique(
      Array.from(dialog.querySelectorAll('img'))
        .filter(isVisible)
        .map((img) => findTile(img, dialog))
    ));

    const plusTiles = unique(
      Array.from(dialog.querySelectorAll('*'))
        .filter((el) => isVisible(el) && (el.textContent || '').trim() === '+')
        .map((el) => findTile(el, dialog))
    ).filter((tile) => !thumbs.includes(tile));

    const existingAdd = plusTiles.find((tile) => tile.querySelector('input[type="file"]')) || plusTiles[0];

    thumbs.forEach((tile) => {
      tile.classList.add('medical-upload-normalized-thumb');
      tile.classList.remove('medical-upload-normalized-add', 'medical-upload-normalized-hidden');
      if (tile.parentElement !== grid) grid.appendChild(tile);
    });

    plusTiles.forEach((tile) => {
      if (tile === existingAdd && thumbs.length < MAX_FILES) {
        tile.classList.add('medical-upload-normalized-add');
        tile.classList.remove('medical-upload-normalized-thumb', 'medical-upload-normalized-hidden');
        if (tile.parentElement !== grid) grid.appendChild(tile);
      } else {
        tile.classList.add('medical-upload-normalized-hidden');
      }
    });
  }

  document.addEventListener('click', () => setTimeout(normalizeUploadDialog, 0), true);
  document.addEventListener('change', () => setTimeout(normalizeUploadDialog, 0), true);
  window.addEventListener('load', normalizeUploadDialog);

  new MutationObserver(normalizeUploadDialog).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setInterval(normalizeUploadDialog, 300);
})();
