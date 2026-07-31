(function () {
  if (window.__medicalUploadModalV8Fix) return;
  window.__medicalUploadModalV8Fix = true;

  const MAX_FILES = 20;
  const STYLE_ID = "medical-upload-modal-v8-style";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .medical-upload-list-v8 {
        display: grid !important;
        grid-template-columns: repeat(5, 72px) !important;
        grid-auto-rows: 72px !important;
        gap: 12px !important;
        align-items: start !important;
        justify-content: start !important;
        width: max-content !important;
        max-width: 408px !important;
        min-height: 72px !important;
        margin: 16px 0 0 !important;
      }

      .medical-upload-list-v8 > * {
        width: 72px !important;
        height: 72px !important;
        margin: 0 !important;
        position: relative !important;
        flex: 0 0 72px !important;
      }

      .medical-upload-list-v8 img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        border-radius: 6px !important;
        display: block !important;
      }

      .medical-upload-list-v8 [data-upload-add-tile-v8="true"] {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px dashed #d8e4f8 !important;
        background: #f8fbff !important;
        color: #1b2b4a !important;
      }

      .medical-upload-extra-add-v8 {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function textOf(el) {
    return (el && (el.innerText || el.textContent) || "").replace(/\s+/g, " ").trim();
  }

  function rectOf(el) {
    try {
      return el.getBoundingClientRect();
    } catch (error) {
      return null;
    }
  }

  function isVisible(el) {
    const rect = rectOf(el);
    return !!rect && rect.width > 0 && rect.height > 0;
  }

  function findDialog() {
    const matches = Array.from(document.querySelectorAll("div"))
      .filter((el) => textOf(el).includes("上传病历资料"))
      .map((el) => ({ el, rect: rectOf(el) }))
      .filter(({ rect }) => rect && rect.width >= 520 && rect.width <= 980 && rect.height >= 300);

    matches.sort((a, b) => (a.rect.width * a.rect.height) - (b.rect.width * b.rect.height));
    return matches[0] && matches[0].el;
  }

  function findMergeRow(dialog) {
    return Array.from(dialog.querySelectorAll("*"))
      .find((el) => textOf(el).includes("以上内容属于同一份报告"));
  }

  function findFooter(dialog) {
    return Array.from(dialog.querySelectorAll("*"))
      .find((el) => {
        const text = textOf(el);
        return text.includes("支持拖拽或点击上传") && text.includes("最多可上传");
      });
  }

  function tileOf(node, dialog) {
    let el = node;
    while (el && el !== dialog) {
      const rect = rectOf(el);
      if (rect && rect.width >= 48 && rect.width <= 150 && rect.height >= 48 && rect.height <= 150) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  function isInsideGrid(el, dialog) {
    const grid = dialog.querySelector(".medical-upload-list-v8, .medical-upload-flow-grid-v7");
    return !!grid && grid.contains(el);
  }

  function inUploadArea(tile, dialog, mergeRow, footer) {
    const rect = rectOf(tile);
    const dialogRect = rectOf(dialog);
    const mergeRect = rectOf(mergeRow);
    const footerRect = rectOf(footer);
    if (!rect || !dialogRect) return false;

    const topLimit = mergeRect ? mergeRect.bottom - 8 : dialogRect.top + 80;
    const bottomLimit = footerRect ? footerRect.top - 8 : dialogRect.bottom - 84;

    return (rect.top >= topLimit && rect.top < bottomLimit) || isInsideGrid(tile, dialog);
  }

  function collectImageTiles(dialog, mergeRow, footer) {
    const tiles = Array.from(dialog.querySelectorAll("img"))
      .map((img) => tileOf(img, dialog))
      .filter(Boolean)
      .filter((tile) => inUploadArea(tile, dialog, mergeRow, footer))
      .filter((tile) => !tile.querySelector('input[type="file"]'));

    return Array.from(new Set(tiles)).sort((a, b) => {
      const ar = rectOf(a);
      const br = rectOf(b);
      return (ar.top - br.top) || (ar.left - br.left);
    });
  }

  function collectAddTiles(dialog, mergeRow, footer) {
    const nodes = Array.from(dialog.querySelectorAll("*")).filter((el) => {
      if (!isVisible(el)) return false;
      if (el.tagName === "IMG") return false;
      if (el.tagName === "BUTTON") return false;
      if (el.querySelector("img")) return false;
      if (el.querySelector('input[type="file"]')) return true;
      return textOf(el) === "+";
    });

    const tiles = nodes
      .map((node) => tileOf(node, dialog))
      .filter(Boolean)
      .filter((tile) => inUploadArea(tile, dialog, mergeRow, footer));

    return Array.from(new Set(tiles)).sort((a, b) => {
      const ar = rectOf(a);
      const br = rectOf(b);
      return (ar.top - br.top) || (ar.left - br.left);
    });
  }

  function ensureGrid(dialog, mergeRow) {
    const existing = dialog.querySelector(".medical-upload-list-v8, .medical-upload-flow-grid-v7");
    if (existing) {
      existing.classList.add("medical-upload-list-v8");
      existing.classList.remove("medical-upload-extra-add-v8");
      return existing;
    }

    const grid = document.createElement("div");
    grid.className = "medical-upload-list-v8";

    if (mergeRow && mergeRow.parentElement) {
      mergeRow.parentElement.insertAdjacentElement("afterend", grid);
    } else {
      const title = Array.from(dialog.querySelectorAll("*")).find((el) => textOf(el) === "上传病历资料");
      (title || dialog).insertAdjacentElement("afterend", grid);
    }

    return grid;
  }

  function normalizeUploadDialog() {
    const dialog = findDialog();
    if (!dialog) return;

    const mergeRow = findMergeRow(dialog);
    const footer = findFooter(dialog);
    const grid = ensureGrid(dialog, mergeRow);
    const imageTiles = collectImageTiles(dialog, mergeRow, footer);
    const addTiles = collectAddTiles(dialog, mergeRow, footer);
    const addTile = addTiles[0];

    imageTiles.forEach((tile) => {
      tile.removeAttribute("data-upload-add-tile-v8");
      tile.classList.remove("medical-upload-extra-add-v8");
      grid.appendChild(tile);
    });

    addTiles.forEach((tile) => {
      if (tile !== addTile) {
        tile.classList.add("medical-upload-extra-add-v8");
        tile.style.setProperty("display", "none", "important");
      }
    });

    if (addTile) {
      addTile.setAttribute("data-upload-add-tile-v8", "true");
      addTile.classList.remove("medical-upload-extra-add-v8");
      addTile.style.removeProperty("display");
      grid.appendChild(addTile);

      if (imageTiles.length >= MAX_FILES) {
        addTile.style.setProperty("display", "none", "important");
      }
    }
  }

  document.addEventListener("click", () => setTimeout(normalizeUploadDialog, 0), true);
  document.addEventListener("change", () => setTimeout(normalizeUploadDialog, 0), true);
  new MutationObserver(() => normalizeUploadDialog()).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
  setInterval(normalizeUploadDialog, 800);
  normalizeUploadDialog();
})();
