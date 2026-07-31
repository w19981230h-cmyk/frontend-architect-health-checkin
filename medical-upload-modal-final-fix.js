(function () {
  var VERSION = "20260731-medical-upload-modal-final-fix";
  if (window.__medicalUploadModalFinalFix === VERSION) return;
  window.__medicalUploadModalFinalFix = VERSION;

  var STYLE_ID = "medical-upload-modal-final-fix-style";

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".medical-upload-final-grid{display:grid!important;grid-template-columns:repeat(5,72px)!important;gap:12px!important;align-items:start!important;margin:14px 0 0!important;width:max-content!important;max-width:408px!important;}",
      ".medical-upload-final-grid>*{box-sizing:border-box!important;}",
      ".medical-upload-final-thumb,.medical-upload-final-add{width:72px!important;height:72px!important;min-width:72px!important;min-height:72px!important;margin:0!important;position:relative!important;}",
      ".medical-upload-final-thumb img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:4px!important;display:block!important;}",
      ".medical-upload-final-add{display:flex!important;align-items:center!important;justify-content:center!important;border:1px dashed #d8e2f3!important;background:#f8fbff!important;color:#1f2d44!important;font-size:30px!important;line-height:1!important;cursor:pointer!important;border-radius:4px!important;}",
      ".medical-upload-final-hidden{display:none!important;visibility:hidden!important;pointer-events:none!important;}",
      ".medical-upload-final-grid+.medical-upload-final-grid{display:none!important;}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function visible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var rect = el.getBoundingClientRect();
    var style = window.getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  }

  function normalizedText(el) {
    return ((el && (el.innerText || el.textContent)) || "").replace(/\s+/g, " ").trim();
  }

  function unique(items) {
    var seen = new Set();
    return items.filter(function (item) {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
  }

  function findUploadDialog() {
    var titleNodes = Array.prototype.slice.call(document.querySelectorAll("body *")).filter(function (el) {
      return visible(el) && normalizedText(el) === "上传病历资料";
    });
    for (var i = 0; i < titleNodes.length; i += 1) {
      var node = titleNodes[i];
      var current = node;
      for (var depth = 0; current && depth < 10; depth += 1) {
        var rect = current.getBoundingClientRect();
        var t = normalizedText(current);
        if (rect.width >= 520 && rect.height >= 260 && t.indexOf("确定") !== -1 && t.indexOf("取消") !== -1) {
          return current;
        }
        current = current.parentElement;
      }
    }
    return null;
  }

  function findCheckboxRow(dialog) {
    var nodes = Array.prototype.slice.call(dialog.querySelectorAll("*"));
    var row = nodes.find(function (el) {
      return visible(el) && normalizedText(el).indexOf("以上内容属于同一份报告") !== -1;
    });
    if (!row) return null;
    var current = row;
    while (current && current.parentElement && current.parentElement !== dialog) {
      var rect = current.getBoundingClientRect();
      if (rect.width > 220 && rect.height <= 50) return current;
      current = current.parentElement;
    }
    return row;
  }

  function closestSmallTile(el, dialog) {
    var current = el;
    var best = el;
    while (current && current !== dialog) {
      var rect = current.getBoundingClientRect();
      if (rect.width >= 44 && rect.width <= 110 && rect.height >= 44 && rect.height <= 110) {
        best = current;
      }
      current = current.parentElement;
    }
    return best;
  }

  function collectThumbTiles(dialog) {
    var imgs = Array.prototype.slice.call(dialog.querySelectorAll("img")).filter(function (img) {
      return visible(img) && !img.closest(".medical-upload-final-add");
    });
    return unique(imgs.map(function (img) {
      return closestSmallTile(img, dialog);
    })).filter(function (tile) {
      return !tile.classList.contains("medical-upload-final-add");
    });
  }

  function isPlusNode(el) {
    if (!el || !visible(el)) return false;
    var text = normalizedText(el);
    if (text !== "+") return false;
    var rect = el.getBoundingClientRect();
    return rect.width >= 20 && rect.width <= 130 && rect.height >= 20 && rect.height <= 130;
  }

  function collectPlusTiles(dialog) {
    var nodes = Array.prototype.slice.call(dialog.querySelectorAll("*")).filter(isPlusNode);
    return unique(nodes.map(function (node) {
      return closestSmallTile(node, dialog);
    })).filter(function (tile) {
      return !tile.querySelector("img");
    });
  }

  function createAddTile(dialog) {
    var tile = document.createElement("button");
    tile.type = "button";
    tile.textContent = "+";
    tile.className = "medical-upload-final-add";
    tile.addEventListener("click", function () {
      var input = dialog.querySelector('input[type="file"]');
      if (input) input.click();
    });
    return tile;
  }

  function ensureGrid(dialog) {
    var anchor = findCheckboxRow(dialog);
    var grid = dialog.querySelector(".medical-upload-final-grid");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "medical-upload-final-grid";
    }
    if (anchor && anchor.parentElement && grid.previousElementSibling !== anchor) {
      anchor.parentElement.insertBefore(grid, anchor.nextSibling);
    }
    return grid;
  }

  function normalizeUploadGrid() {
    installStyle();
    var dialog = findUploadDialog();
    if (!dialog) return;

    var grid = ensureGrid(dialog);
    var thumbs = collectThumbTiles(dialog);

    thumbs.forEach(function (tile) {
      tile.classList.add("medical-upload-final-thumb");
      tile.classList.remove("medical-upload-final-hidden");
      grid.appendChild(tile);
    });

    var plusTiles = collectPlusTiles(dialog).filter(function (tile) {
      return thumbs.indexOf(tile) === -1;
    });
    var plus = plusTiles.find(function (tile) {
      return tile.closest(".medical-upload-final-grid");
    }) || plusTiles[0] || createAddTile(dialog);

    plus.classList.add("medical-upload-final-add");
    plus.classList.remove("medical-upload-final-hidden");

    plusTiles.forEach(function (tile) {
      if (tile !== plus) tile.classList.add("medical-upload-final-hidden");
    });

    if (thumbs.length >= 20) {
      plus.classList.add("medical-upload-final-hidden");
    } else {
      grid.appendChild(plus);
    }
  }

  var timer = null;
  function scheduleNormalize() {
    window.clearTimeout(timer);
    timer = window.setTimeout(normalizeUploadGrid, 60);
  }

  document.addEventListener("click", scheduleNormalize, true);
  document.addEventListener("change", scheduleNormalize, true);
  new MutationObserver(scheduleNormalize).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.setInterval(normalizeUploadGrid, 600);
  scheduleNormalize();
})();
