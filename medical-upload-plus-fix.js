(function () {
  if (window.__medicalUploadPlusFixV4) return;
  window.__medicalUploadPlusFixV4 = true;

  const MAX_FILES = 20;
  const GRID_CLASS = 'medical-upload-photo-grid-fix';
  const THUMB_CLASS = 'medical-upload-thumb-fix';
  const ADD_CLASS = 'medical-upload-add-fix';
  const HIDE_CLASS = 'medical-upload-native-add-hidden-fix';
  const STYLE_ID = 'medical-upload-plus-fix-style';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${GRID_CLASS} {
        display: grid !important;
        grid-template-columns: repeat(5, 72px);
        gap: 12px;
        align-items: start;
        justify-content: start;
        width: 100%;
        max-width: 408px;
        margin-top: 16px;
      }
      .${THUMB_CLASS} {
        width: 72px !important;
        height: 72px !important;
        border: 1px solid #dbe6f6 !important;
        border-radius: 4px !important;
        overflow: hidden !important;
        position: relative !important;
        background: #f8fbff !important;
        flex: 0 0 72px !important;
      }
      .${THUMB_CLASS} img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
      }
      .${ADD_CLASS} {
        width: 72px !important;
        height: 72px !important;
        border: 1px dashed #8fb4ff !important;
        border-radius: 4px !important;
        background: #f7fbff !important;
        color: #17345d !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 30px !important;
        line-height: 1 !important;
        cursor: pointer !important;
      }
      .${HIDE_CLASS} {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function visible(el) {
    if (!el || !(el instanceof HTMLElement)) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 8 && rect.height > 8;
  }

  function getUploadDialog() {
    const title = Array.from(document.querySelectorAll('h1,h2,h3,div,span'))
      .find((el) => visible(el) && (el.textContent || '').trim() === '上传病历资料');
    if (!title) return null;

    let node = title;
    for (let i = 0; node && i < 8; i += 1, node = node.parentElement) {
      const text = node.innerText || '';
      if (text.includes('上传病历资料') && text.includes('支持拖拽或点击上传')) return node;
    }

    return title.closest('[role="dialog"], .ant-modal, .el-dialog') || title.parentElement;
  }

  function unique(list) {
    return Array.from(new Set(list.filter(Boolean)));
  }

  function findCheckboxRow(dialog) {
    const node = Array.from(dialog.querySelectorAll('label,div,span'))
      .find((el) => (el.innerText || '').includes('以上内容属于同一份报告'));
    return node ? (node.closest('label') || node) : null;
  }

  function findFooter(dialog) {
    return Array.from(dialog.querySelectorAll('div,span,p'))
      .find((el) => (el.innerText || '').includes('支持拖拽或点击上传'));
  }

  function imageTile(img, dialog) {
    let tile = img;
    let cursor = img;
    for (let i = 0; cursor.parentElement && cursor.parentElement !== dialog && i < 6; i += 1) {
      const parent = cursor.parentElement;
      const rect = parent.getBoundingClientRect();
      if (rect.width >= 48 && rect.width <= 130 && rect.height >= 48 && rect.height <= 130) {
        tile = parent;
        cursor = parent;
        continue;
      }
      break;
    }
    return tile;
  }

  function isNativeAdd(el) {
    if (!visible(el) || el.classList.contains(ADD_CLASS) || el.closest(`.${THUMB_CLASS}`)) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < 36 || rect.width > 130 || rect.height < 36 || rect.height > 130) return false;
    const text = (el.innerText || el.textContent || '').trim();
    return text === '+' || text === '＋';
  }

  function ensureGrid(dialog) {
    let grid = dialog.querySelector(`.${GRID_CLASS}`);
    if (grid) return grid;

    grid = document.createElement('div');
    grid.className = GRID_CLASS;
    const checkboxRow = findCheckboxRow(dialog);
    const footer = findFooter(dialog);

    if (checkboxRow && checkboxRow.parentElement) {
      checkboxRow.insertAdjacentElement('afterend', grid);
    } else if (footer && footer.parentElement) {
      footer.parentElement.insertBefore(grid, footer);
    } else {
      dialog.appendChild(grid);
    }

    return grid;
  }

  function normalizeUploadGrid() {
    injectStyle();
    const dialog = getUploadDialog();
    if (!dialog) return;

    dialog.querySelectorAll(`.${ADD_CLASS}`).forEach((node) => node.remove());

    const grid = ensureGrid(dialog);
    const nativeAdds = Array.from(dialog.querySelectorAll('button,label,div,span')).filter(isNativeAdd);
    const imageTiles = unique(
      Array.from(dialog.querySelectorAll('img'))
        .filter((img) => visible(img))
        .map((img) => imageTile(img, dialog))
    );

    imageTiles.forEach((tile) => {
      tile.classList.remove(HIDE_CLASS);
      tile.classList.add(THUMB_CLASS);
    });

    grid.replaceChildren(...imageTiles);

    nativeAdds.forEach((node) => {
      if (!node.classList.contains(ADD_CLASS)) node.classList.add(HIDE_CLASS);
    });

    if (imageTiles.length >= MAX_FILES) return;

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = ADD_CLASS;
    addButton.textContent = '+';
    addButton.setAttribute('aria-label', '上传病历资料');
    addButton.addEventListener('click', () => {
      const fileInput = dialog.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.click();
      } else if (nativeAdds[0]) {
        nativeAdds[0].classList.remove(HIDE_CLASS);
        nativeAdds[0].click();
        nativeAdds[0].classList.add(HIDE_CLASS);
      }
      window.setTimeout(normalizeUploadGrid, 120);
    });
    grid.appendChild(addButton);
  }

  const observer = new MutationObserver(() => window.requestAnimationFrame(normalizeUploadGrid));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', normalizeUploadGrid);
  window.setInterval(normalizeUploadGrid, 800);
  normalizeUploadGrid();
})();
