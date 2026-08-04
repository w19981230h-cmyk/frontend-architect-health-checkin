(function () {
  if (window.__medicalUploadModalV11Fix) return;
  window.__medicalUploadModalV11Fix = true;

  const STYLE_ID = "medical-upload-modal-v11-style";
  const GALLERY_CLASS = "medical-upload-gallery-v11";
  const HIDE_CLASS = "medical-upload-v11-hide";
  const removedSrcs = new Set();
  const cachedSources = new WeakMap();

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${GALLERY_CLASS}{
        display:grid;
        grid-template-columns:repeat(5,72px);
        gap:12px;
        align-items:start;
        width:max-content;
        max-width:408px;
        margin:14px 0 18px;
      }
      .medical-upload-v11-thumb,
      .medical-upload-v11-add{
        width:72px;
        height:72px;
        border-radius:6px;
        box-sizing:border-box;
      }
      .medical-upload-v11-thumb{
        position:relative;
        overflow:hidden;
        border:1px solid #dbe6f5;
        background:#f8fbff;
      }
      .medical-upload-v11-thumb img{
        display:block;
        width:100%;
        height:100%;
        object-fit:cover;
      }
      .medical-upload-v11-remove{
        position:absolute;
        top:4px;
        right:4px;
        width:18px;
        height:18px;
        padding:0;
        border:0;
        border-radius:50%;
        background:rgba(15,23,42,.72);
        color:#fff;
        font-size:12px;
        line-height:18px;
        cursor:pointer;
      }
      .medical-upload-v11-add{
        display:flex;
        align-items:center;
        justify-content:center;
        border:1px dashed #2f63ff;
        background:#f7fbff;
        color:#1f4dff;
        font-size:28px;
        line-height:1;
        cursor:pointer;
      }
      .medical-upload-v11-add:hover{background:#eef5ff;}
      .${HIDE_CLASS}{display:none!important;}
    `;
    document.head.appendChild(style);
  }

  function textOf(el) {
    return (el && el.textContent || "").replace(/\s+/g, " ").trim();
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
      return rect.width >= 480 && rect.width <= 1000 && rect.height >= 260 && rect.height <= 780;
    });
    return panels.sort((a, b) => area(a) - area(b))[0] || null;
  }

  function findMergeRow(panel) {
    const hit = Array.from(panel.querySelectorAll("label,div,span")).find((el) =>
      textOf(el).includes("以上内容属于同一份报告")
    );
    return hit ? (hit.closest("label") || hit.closest("div") || hit) : null;
  }

  function closestTile(el, panel) {
    let current = el;
    while (current && current !== panel) {
      const rect = current.getBoundingClientRect();
      if (rect.width >= 44 && rect.width <= 150 && rect.height >= 44 && rect.height <= 150) {
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
      .replace(/</g, "&lt;");
  }

  function collectSources(panel, gallery) {
    const sources = [];
    const cached = cachedSources.get(panel) || [];
    Array.from(panel.querySelectorAll("img")).forEach((img) => {
      if (gallery && gallery.contains(img)) return;
      const src = img.currentSrc || img.src;
      if (!src || removedSrcs.has(src)) return;
      const rect = img.getBoundingClientRect();
      const looksLikeUpload = rect.width >= 24 && rect.height >= 24 && rect.width <= 220 && rect.height <= 220;
      if (!looksLikeUpload && !cached.includes(src)) return;
      if (!sources.includes(src)) sources.push(src);
    });
    cached.forEach((src) => {
      if (!removedSrcs.has(src) && !sources.includes(src)) sources.push(src);
    });
    const next = sources.slice(0, 20);
    cachedSources.set(panel, next);
    return next;
  }

  function hideOriginalUploadNodes(panel, gallery) {
    Array.from(panel.querySelectorAll(".medical-upload-gallery-v8,.medical-upload-gallery-v9,.medical-upload-gallery-v10")).forEach((el) => {
      if (!gallery.contains(el)) el.classList.add(HIDE_CLASS);
    });
    Array.from(panel.querySelectorAll("img")).forEach((img) => {
      if (gallery.contains(img)) return;
      closestTile(img, panel).classList.add(HIDE_CLASS);
    });
    Array.from(panel.querySelectorAll("button,div,span,label")).forEach((el) => {
      if (gallery.contains(el)) return;
      if (textOf(el) === "+") closestTile(el, panel).classList.add(HIDE_CLASS);
    });
  }

  function render(panel) {
    ensureStyle();
    const mergeRow = findMergeRow(panel);
    if (!mergeRow) return;
    let gallery = panel.querySelector("." + GALLERY_CLASS);
    if (!gallery) {
      gallery = document.createElement("div");
      gallery.className = GALLERY_CLASS;
      mergeRow.insertAdjacentElement("afterend", gallery);
    }
    const sources = collectSources(panel, gallery);
    gallery.innerHTML = sources.map((src) => (
      `<div class="medical-upload-v11-thumb">` +
        `<img src="${escapeAttr(src)}" alt="上传图片">` +
        `<button class="medical-upload-v11-remove" type="button" data-src="${escapeAttr(src)}">×</button>` +
      `</div>`
    )).join("") + (sources.length < 20
      ? `<button class="medical-upload-v11-add" type="button" aria-label="添加图片">+</button>`
      : "");

    gallery.onclick = function (event) {
      const remove = event.target.closest(".medical-upload-v11-remove");
      if (remove) {
        removedSrcs.add(remove.getAttribute("data-src"));
        render(panel);
        return;
      }
      if (event.target.closest(".medical-upload-v11-add")) {
        const input = panel.querySelector('input[type="file"]');
        if (input) input.click();
      }
    };
    hideOriginalUploadNodes(panel, gallery);
  }

  function sync() {
    const panel = findUploadPanel();
    if (panel) render(panel);
  }

  const observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setInterval(sync, 600);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sync);
  } else {
    sync();
  }
})();
