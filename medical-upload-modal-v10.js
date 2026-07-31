(function () {
  if (window.__medicalUploadModalV10Fix) return;
  window.__medicalUploadModalV10Fix = true;

  const STYLE_ID = 'medical-upload-modal-v10-style';
  const GALLERY_CLASS = 'medical-upload-gallery-v10';
  const HIDDEN_CLASS = 'medical-upload-hidden-v10';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${GALLERY_CLASS} {
        display: grid !important;
        grid-template-columns: repeat(5, 72px);
        grid-auto-rows: 72px;
        gap: 12px;
        align-content: start;
        justify-content: start;
        width: max-content;
        max-width: 408px;
        min-height: 72px;
        margin-top: 14px;
      }
      .${GALLERY_CLASS} > * {
        width: 72px !important;
        height: 72px !important;
        min-width: 72px !important;
        min-height: 72px !important;
        max-width: 72px !important;
        max-height: 72px !important;
        margin: 0 !important;
        flex: 0 0 72px !important;
        box-sizing: border-box;
      }
      .${GALLERY_CLASS} img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      .${GALLERY_CLASS} .medical-upload-add-v10 {
        display: flex !important;
        align-items: center;
        justify-content: center;
        border: 1px dashed #2f63ff;
        background: #f7fbff;
        color: #1f55ff;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
      }
      .${HIDDEN_CLASS} {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function textOf(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, '');
  }

  function findUploadModal() {
    return Array.from(document.querySelectorAll('body *')).find((el) => {
      const text = textOf(el);
      return text.includes('上传病历资料') && el.querySelector && el.querySelector('input[type="checkbox"]');
    });
  }

  function findModalPanel(root) {
    let node = root;
    while (node && node !== document.body) {
      if (node.querySelector && textOf(node).includes('上传病历资料')) {
        const rect = node.getBoundingClientRect();
        if (rect.width >= 500 && rect.height >= 300) return node;
      }
      node = node.parentElement;
    }
    return root;
  }

  function findMergeRow(panel) {
    return Array.from(panel.querySelectorAll('label, div, p, span')).find((el) =>
      textOf(el).includes('以上内容属于同一份报告')
    );
  }

  function closestTile(el, panel) {
    let node = el;
    while (node && node !== panel && node.parentElement) {
      const rect = node.getBoundingClientRect();
      const parentRect = node.parentElement.getBoundingClientRect();
      const hasImage = !!node.querySelector?.('img');
      const hasFileInput = !!node.querySelector?.('input[type="file"]');
      const isPlus = textOf(node) === '+';
      const sizedLikeTile = rect.width >= 44 && rect.width <= 130 && rect.height >= 44 && rect.height <= 130;
      const parentIsLarge = parentRect.width > 160 || parentRect.height > 160;
      if ((hasImage || hasFileInput || isPlus) && sizedLikeTile && parentIsLarge) return node;
      node = node.parentElement;
    }
    return el;
  }

  function isFooterOrButtonArea(el, panel) {
    const t = textOf(el);
    if (t.includes('取消') || t.includes('确定')) return true;
    const rect = el.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    return rect.top > panelRect.bottom - 110;
  }

  function collectTiles(panel) {
    const found = new Set();

    panel.querySelectorAll('img, input[type="file"]').forEach((el) => {
      const tile = closestTile(el, panel);
      if (!isFooterOrButtonArea(tile, panel)) found.add(tile);
    });

    Array.from(panel.querySelectorAll('button, div, span, label')).forEach((el) => {
      if (textOf(el) !== '+') return;
      const tile = closestTile(el, panel);
      if (!isFooterOrButtonArea(tile, panel)) found.add(tile);
    });

    const tiles = Array.from(found).filter((el) => el.isConnected);
    const images = tiles.filter((el) => el.querySelector?.('img'));
    const adds = tiles.filter((el) => !el.querySelector?.('img'));
    images.sort((a, b) => {
      const pos = a.compareDocumentPosition(b);
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    return { images, adds };
  }

  function ensureSyntheticAdd(panel, hiddenInput) {
    let add = panel.querySelector('.medical-upload-add-v10');
    if (!add) {
      add = document.createElement('button');
      add.type = 'button';
      add.className = 'medical-upload-add-v10';
      add.textContent = '+';
      add.setAttribute('aria-label', '添加图片');
      add.addEventListener('click', () => {
        const input = hiddenInput || panel.querySelector('input[type="file"]');
        if (input) input.click();
      });
    }
    return add;
  }

  function normalizeUploadArea() {
    injectStyle();
    const root = findUploadModal();
    if (!root) return;
    const panel = findModalPanel(root);
    const mergeRow = findMergeRow(panel);
    if (!mergeRow) return;

    let gallery = panel.querySelector(`.${GALLERY_CLASS}`);
    if (!gallery) {
      gallery = document.createElement('div');
      gallery.className = GALLERY_CLASS;
      mergeRow.insertAdjacentElement('afterend', gallery);
    }

    panel.querySelectorAll('.medical-upload-gallery-v9').forEach((oldGallery) => {
      if (oldGallery === gallery) return;
      Array.from(oldGallery.children).forEach((child) => gallery.appendChild(child));
      oldGallery.classList.add(HIDDEN_CLASS);
    });

    const { images, adds } = collectTiles(panel);
    const existingAdd = adds.find((el) => !el.classList.contains('medical-upload-add-v10'));
    const fileInput = panel.querySelector('input[type="file"]');
    const addTile = existingAdd || ensureSyntheticAdd(panel, fileInput);

    images.forEach((tile) => {
      tile.classList.remove(HIDDEN_CLASS);
      gallery.appendChild(tile);
    });

    addTile.classList.remove(HIDDEN_CLASS);
    gallery.appendChild(addTile);

    adds.forEach((tile) => {
      if (tile !== addTile) tile.classList.add(HIDDEN_CLASS);
    });

    Array.from(panel.querySelectorAll('button, div, span, label')).forEach((el) => {
      if (gallery.contains(el)) return;
      if (textOf(el) !== '+') return;
      const tile = closestTile(el, panel);
      if (!gallery.contains(tile) && !isFooterOrButtonArea(tile, panel)) {
        tile.classList.add(HIDDEN_CLASS);
      }
    });
  }

  let raf = 0;
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      normalizeUploadArea();
    });
  }

  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  document.addEventListener('click', () => setTimeout(schedule, 30), true);
  document.addEventListener('change', () => setTimeout(schedule, 30), true);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(schedule, 800);
})();
