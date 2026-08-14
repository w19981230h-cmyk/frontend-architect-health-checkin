(function () {
  const STYLE_ID = 'medical-upload-plus-inline-fix-style';
  const MAX_FILES = 20;

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .medical-upload-photo-grid {
        display: grid !important;
        grid-template-columns: repeat(5, 72px) !important;
        gap: 12px !important;
        align-items: start !important;
        justify-content: start !important;
        margin-top: 14px !important;
        max-width: 408px !important;
      }
      .medical-upload-photo-grid > * {
        width: 72px !important;
        height: 72px !important;
        margin: 0 !important;
      }
      .medical-upload-photo-grid img {
        width: 72px !important;
        height: 72px !important;
        object-fit: cover !important;
        border-radius: 4px !important;
        display: block !important;
      }
      .medical-upload-add-tile {
        width: 72px !important;
        height: 72px !important;
        border: 1px dashed #d6e1f2 !important;
        border-radius: 4px !important;
        background: #f8fbff !important;
        color: #1f2f46 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        font-size: 30px !important;
        line-height: 1 !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      .medical-upload-add-tile:hover {
        border-color: #2f5bff !important;
        color: #2f5bff !important;
        background: #f2f6ff !important;
      }
      .medical-upload-add-tile[hidden] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function visible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function findUploadModal() {
    const titles = Array.from(document.querySelectorAll('div, span, h1, h2, h3'))
      .filter((el) => visible(el) && el.textContent.trim() === '上传病历资料');
    for (const title of titles) {
      let node = title.parentElement;
      while (node && node !== document.body) {
        const rect = node.getBoundingClientRect();
        if (rect.width >= 480 && rect.width <= 980 && rect.height >= 260 && rect.height <= 760) {
          return node;
        }
        node = node.parentElement;
      }
    }
    return null;
  }

  function getThumbNodes(modal) {
    const images = Array.from(modal.querySelectorAll('img')).filter((img) => {
      const rect = img.getBoundingClientRect();
      return rect.width >= 36 && rect.width <= 120 && rect.height >= 36 && rect.height <= 120;
    });
    const nodes = images.map((img) => {
      return img.closest('.medical-upload-thumb, .upload-thumb, .file-thumb, .ant-upload-list-item, li') || img.parentElement;
    }).filter(Boolean);
    return Array.from(new Set(nodes));
  }

  function findInsertAnchor(modal) {
    const sameReportText = Array.from(modal.querySelectorAll('label, div, span'))
      .find((el) => visible(el) && el.textContent.includes('同一份报告'));
    if (sameReportText) {
      return sameReportText.closest('label, div') || sameReportText;
    }
    const body = Array.from(modal.children).find((child) => {
      const text = child.textContent || '';
      return !text.includes('上传病历资料') && !text.includes('取消') && !text.includes('确定');
    });
    return body || modal;
  }

  function buildGrid(modal) {
    let grid = modal.querySelector('.medical-upload-photo-grid');
    const thumbs = getThumbNodes(modal).filter((node) => !node.classList.contains('medical-upload-add-tile'));

    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'medical-upload-photo-grid';
      if (thumbs.length > 0) {
        thumbs[0].parentElement.insertBefore(grid, thumbs[0]);
      } else {
        findInsertAnchor(modal).insertAdjacentElement('afterend', grid);
      }
    }

    thumbs.forEach((thumb) => {
      thumb.classList.add('medical-upload-thumb');
      grid.appendChild(thumb);
    });

    let addTile = grid.querySelector('.medical-upload-add-tile');
    if (!addTile) {
      addTile = document.createElement('button');
      addTile.type = 'button';
      addTile.className = 'medical-upload-add-tile';
      addTile.setAttribute('aria-label', '添加图片');
      addTile.textContent = '+';
      addTile.addEventListener('click', () => {
        const input = modal.querySelector('input[type="file"]');
        if (input) input.click();
      });
    }

    const count = getThumbNodes(modal).filter((node) => !node.classList.contains('medical-upload-add-tile')).length;
    addTile.hidden = count >= MAX_FILES;
    grid.appendChild(addTile);
  }

  function apply() {
    ensureStyle();
    const modal = findUploadModal();
    if (!modal) return;
    buildGrid(modal);
  }

  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', apply);
  setInterval(apply, 800);
})();
