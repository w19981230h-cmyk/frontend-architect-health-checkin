(function () {
  if (window.__medicalUploadModalV13Fix) return;
  window.__medicalUploadModalV13Fix = true;

  const STYLE_ID = "medical-upload-modal-v13-style";
  const GALLERY_CLASS = "medical-upload-gallery-v13";
  const HIDE_CLASS = "medical-upload-v13-hide";
  const removedSources = new Set();
  const sourceCache = new WeakMap();

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${GALLERY_CLASS} {
        display: grid;
        grid-template-columns: repeat(5, 72px);
        gap: 12px;
        align-items: start;
        width: max-content;
        max-width: 408px;
        margin: 14px 0 18px;
      }
      .medical-upload-v13-thumb,
      .medical-upload-v13-add {
        width: 72px;
        height: 72px;
        border-radius: 6px;
        box-sizing: border-box;
      }
      .medical-upload-v13-thumb {
        position: relative;
        overflow: hidden;
        border: 1px solid #dbe6f5;
        background: #f8fbff;
      }
      .medical-upload-v13-thumb img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .medical-upload-v13-remove {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 18px;
        height: 18px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: rgba(15, 23, 42, 0.72);
        color: #fff;
        font-size: 12px;
        line-height: 18px;
        cursor: pointer;
      }
      .medical-upload-v13-add {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #2f63ff;
        background: #f7fbff;
        color: #1f4dff;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
      }
      .medical-upload-v13-add:hover {
        background: #eef5ff;
      }
      .${HIDE_CLASS} {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function textOf(el) {
    return ((el && el.textContent) || "").replace(/\s+/g, " ").trim();
  }

  function area(el) {
    const rect = el.getBoundingClientRect();
    return rect.width * rect.height;
  }

  function findUploadPanel() {
    const panels = Array.from(document.querySelectorAll("div")).filter((el) => {
      const text = textOf(el);
      if (!text.includes("上传病历资料") || !text.includes("取消") || !text.includes("确定")) return false;
      const rect = el.getBoundingClientRect();
      return rect.width >= 480 && rect.width <= 1000 && rect.height >= 260 && rect.height <= 820;
    });
    return panels.sort((a, b) => area(a) - area(b))[0] || null;
  }

  function findMergeRow(panel) {
    const node = Array.from(panel.querySelectorAll("label, div, span")).find((el) =>
      textOf(el).includes("以上内容属于同一份报告")
    );
    return node ? node.closest("label") || node.closest("div") || node : null;
  }

  function closestTile(el, panel) {
    let current = el;
    while (current && current !== panel) {
      const rect = current.getBoundingClientRect();
      if (rect.width >= 40 && rect.width <= 190 && rect.height >= 40 && rect.height <= 190) {
        return current;
      }
      current = current.parentElement;
    }
    return el;
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function collectSources(panel, gallery) {
    const sources = [];
    const cached = sourceCache.get(panel) || [];

    Array.from(panel.querySelectorAll("img")).forEach((img) => {
      if (gallery && gallery.contains(img)) return;
      const src = img.currentSrc || img.src;
      if (!src || removedSources.has(src)) return;
      if (!sources.includes(src)) sources.push(src);
    });

    cached.forEach((src) => {
      if (!removedSources.has(src) && !sources.includes(src)) sources.push(src);
    });

    const limited = sources.slice(0, 20);
    sourceCache.set(panel, limited);
    return limited;
  }

  function hideOriginalUploadNodes(panel, gallery) {
    Array.from(
      panel.querySelectorAll(
        ".medical-upload-gallery-v8, .medical-upload-gallery-v9, .medical-upload-gallery-v10, .medical-upload-gallery-v11, .medical-upload-gallery-v12"
      )
    ).forEach((el) => {
      if (!gallery.contains(el)) el.classList.add(HIDE_CLASS);
    });

    Array.from(panel.querySelectorAll("img")).forEach((img) => {
      if (gallery.contains(img)) return;
      closestTile(img, panel).classList.add(HIDE_CLASS);
    });

    Array.from(panel.querySelectorAll("button, div, span, label")).forEach((el) => {
      if (gallery.contains(el)) return;
      if (textOf(el) === "+") closestTile(el, panel).classList.add(HIDE_CLASS);
    });
  }

  function triggerFileInput(panel) {
    const input = panel.querySelector('input[type="file"]');
    if (input) {
      input.click();
      return;
    }
    const originalUpload = Array.from(panel.querySelectorAll(`.${HIDE_CLASS}`)).find((el) =>
      textOf(el).includes("+")
    );
    if (originalUpload) originalUpload.click();
  }

  function render(panel) {
    ensureStyle();
    const mergeRow = findMergeRow(panel);
    if (!mergeRow) return;

    let gallery = panel.querySelector(`.${GALLERY_CLASS}`);
    if (!gallery) {
      gallery = document.createElement("div");
      gallery.className = GALLERY_CLASS;
      mergeRow.insertAdjacentElement("afterend", gallery);
    }

    const sources = collectSources(panel, gallery);
    gallery.innerHTML = sources
      .map(
        (src) => `
          <div class="medical-upload-v13-thumb">
            <img src="${escapeAttr(src)}" alt="上传图片">
            <button class="medical-upload-v13-remove" type="button" data-src="${escapeAttr(src)}">×</button>
          </div>
        `
      )
      .join("");

    if (sources.length < 20) {
      const addTile = document.createElement("button");
      addTile.className = "medical-upload-v13-add";
      addTile.type = "button";
      addTile.textContent = "+";
      addTile.addEventListener("click", () => triggerFileInput(panel));
      gallery.appendChild(addTile);
    }

    gallery.querySelectorAll(".medical-upload-v13-remove").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        removedSources.add(btn.getAttribute("data-src"));
        render(panel);
      });
    });

    hideOriginalUploadNodes(panel, gallery);
  }

  function sync() {
    const panel = findUploadPanel();
    if (panel) render(panel);
  }

  new MutationObserver(sync).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class", "src"]
  });

  document.addEventListener("DOMContentLoaded", sync);
  window.addEventListener("load", sync);
  setInterval(sync, 500);
})();
