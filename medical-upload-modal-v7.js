(function () {
  if (window.__medicalUploadModalV7Fix) return;
  window.__medicalUploadModalV7Fix = true;

  var STYLE_ID = "medical-upload-modal-v7-style";
  var GRID_CLASS = "medical-upload-flow-grid-v7";
  var HIDDEN_CLASS = "medical-upload-flow-hidden-v7";
  var THUMB_CLASS = "medical-upload-flow-thumb-v7";
  var ADD_CLASS = "medical-upload-flow-add-v7";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "." + GRID_CLASS + " {",
      "  display: grid !important;",
      "  grid-template-columns: repeat(5, 72px) !important;",
      "  gap: 12px !important;",
      "  width: max-content !important;",
      "  max-width: 408px !important;",
      "  min-height: 72px !important;",
      "  margin: 14px 0 0 !important;",
      "  align-items: start !important;",
      "}",
      "." + GRID_CLASS + " > * {",
      "  width: 72px !important;",
      "  height: 72px !important;",
      "  margin: 0 !important;",
      "  position: relative !important;",
      "  inset: auto !important;",
      "  float: none !important;",
      "  box-sizing: border-box !important;",
      "}",
      "." + GRID_CLASS + " ." + THUMB_CLASS + " { order: 1 !important; }",
      "." + GRID_CLASS + " ." + ADD_CLASS + " { order: 99 !important; }",
      "." + GRID_CLASS + " img {",
      "  width: 100% !important;",
      "  height: 100% !important;",
      "  object-fit: cover !important;",
      "}",
      "." + HIDDEN_CLASS + " {",
      "  display: none !important;",
      "  visibility: hidden !important;",
      "  pointer-events: none !important;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function cleanText(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, "");
  }

  function findDialog() {
    return Array.from(document.querySelectorAll("div"))
      .filter(function (node) {
        return cleanText(node).indexOf("上传病历资料") !== -1;
      })
      .filter(function (node) {
        var rect = node.getBoundingClientRect();
        return rect.width >= 500 && rect.width <= 1000 && rect.height >= 300;
      })
      .sort(function (a, b) {
        return a.getBoundingClientRect().width - b.getBoundingClientRect().width;
      })[0] || null;
  }

  function findMergeRow(dialog) {
    return Array.from(dialog.querySelectorAll("label, div, p, span"))
      .find(function (el) {
        return cleanText(el).indexOf("以上内容属于同一份报告") !== -1;
      });
  }

  function getFooterTop(dialog) {
    var tops = Array.from(dialog.querySelectorAll("button, div, span"))
      .filter(function (el) {
        var text = cleanText(el);
        return text === "取消" || text === "确定";
      })
      .map(function (el) {
        return el.getBoundingClientRect().top;
      })
      .filter(function (top) {
        return top > 0;
      });
    return tops.length ? Math.min.apply(null, tops) : Infinity;
  }

  function inUploadZone(tile, mergeRow, footerTop) {
    var rect = tile.getBoundingClientRect();
    var mergeRect = mergeRow.getBoundingClientRect();
    return rect.top >= mergeRect.bottom - 10 && rect.top <= footerTop - 8;
  }

  function isStaticDialogControl(el) {
    var text = cleanText(el);
    return text === "取消" || text === "确定" || text === "上传病历资料" || text === "×";
  }

  function getTile(el) {
    var cur = el;
    while (cur && cur.parentElement) {
      if (isStaticDialogControl(cur)) return null;
      var rect = cur.getBoundingClientRect();
      var parentRect = cur.parentElement.getBoundingClientRect();
      if (
        cur.tagName !== "IMG" &&
        rect.width >= 48 &&
        rect.width <= 120 &&
        rect.height >= 48 &&
        rect.height <= 120 &&
        parentRect.width > rect.width + 12 &&
        !cur.classList.contains(GRID_CLASS)
      ) {
        return cur;
      }
      cur = cur.parentElement;
    }
    return null;
  }

  function unique(list) {
    var seen = new Set();
    return list.filter(function (item) {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
  }

  function collectImageTiles(dialog) {
    return unique(Array.from(dialog.querySelectorAll("img")).map(getTile))
      .filter(function (tile) {
        if (!tile || tile.querySelector("input[type='file']")) return false;
        var rect = tile.getBoundingClientRect();
        return rect.width >= 40 && rect.width <= 125 && rect.height >= 40 && rect.height <= 125;
      });
  }

  function collectPlusTiles(dialog) {
    var nodes = Array.from(dialog.querySelectorAll("button, div, label"));
    var plusByText = nodes.filter(function (el) {
      var rect = el.getBoundingClientRect();
      return cleanText(el) === "+" &&
        rect.width >= 40 &&
        rect.width <= 125 &&
        rect.height >= 40 &&
        rect.height <= 125;
    });
    var plusByInput = Array.from(dialog.querySelectorAll("input[type='file']")).map(getTile);
    return unique(plusByInput.concat(plusByText.map(getTile).filter(Boolean)));
  }

  function normalize() {
    injectStyle();
    var dialog = findDialog();
    if (!dialog) return;

    var mergeRow = findMergeRow(dialog);
    if (!mergeRow) return;

    var footerTop = getFooterTop(dialog);
    var grid = dialog.querySelector("." + GRID_CLASS);
    if (!grid) {
      grid = document.createElement("div");
      grid.className = GRID_CLASS;
      mergeRow.insertAdjacentElement("afterend", grid);
    }

    var imageTiles = collectImageTiles(dialog).filter(function (tile) {
      return tile !== grid && inUploadZone(tile, mergeRow, footerTop);
    });

    imageTiles.forEach(function (tile) {
      tile.classList.remove(HIDDEN_CLASS, ADD_CLASS);
      tile.classList.add(THUMB_CLASS);
      grid.appendChild(tile);
    });

    var plusTiles = collectPlusTiles(dialog).filter(function (tile) {
      return tile !== grid &&
        imageTiles.indexOf(tile) === -1 &&
        inUploadZone(tile, mergeRow, footerTop);
    });

    var uploadTile = plusTiles.find(function (tile) {
      return tile.querySelector("input[type='file']");
    }) || plusTiles[0];

    plusTiles.forEach(function (tile) {
      if (tile !== uploadTile) tile.classList.add(HIDDEN_CLASS);
    });

    if (uploadTile) {
      uploadTile.classList.remove(HIDDEN_CLASS, THUMB_CLASS);
      uploadTile.classList.add(ADD_CLASS);
      grid.appendChild(uploadTile);
      uploadTile.style.display = imageTiles.length >= 20 ? "none" : "";
    }
  }

  document.addEventListener("click", function () {
    setTimeout(normalize, 0);
    setTimeout(normalize, 160);
  }, true);
  document.addEventListener("change", function () {
    setTimeout(normalize, 0);
    setTimeout(normalize, 240);
  }, true);

  new MutationObserver(normalize).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  setInterval(normalize, 800);
  normalize();
})();
