(function () {
  var STYLE_ID = "medical-upload-inline-fix-v2-style";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".medical-upload-inline-row{display:flex!important;flex-wrap:wrap!important;align-items:flex-start!important;gap:12px!important;}",
      ".medical-upload-inline-row>*{flex:0 0 auto!important;}",
      ".medical-upload-inline-row .medical-upload-inline-add{margin:0!important;}"
    ].join("");
    document.head.appendChild(style);
  }

  function isVisible(el) {
    if (!el || !(el instanceof HTMLElement)) return false;
    var rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function compactText(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, "").trim();
  }

  function closestTile(el) {
    var current = el;
    for (var i = 0; current && i < 8; i += 1, current = current.parentElement) {
      var rect = current.getBoundingClientRect();
      if (rect.width >= 52 && rect.width <= 150 && rect.height >= 52 && rect.height <= 150) {
        return current;
      }
    }
    return el;
  }

  function findUploadDialog() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("body *"));
    var titles = nodes.filter(function (node) {
      return isVisible(node) && compactText(node).indexOf("上传病历资料") !== -1;
    });

    for (var t = 0; t < titles.length; t += 1) {
      var current = titles[t];
      for (var i = 0; current && i < 12; i += 1, current = current.parentElement) {
        var rect = current.getBoundingClientRect();
        var text = compactText(current);
        if (
          rect.width >= 480 &&
          rect.height >= 320 &&
          text.indexOf("上传病历资料") !== -1 &&
          text.indexOf("确定") !== -1 &&
          (current.querySelector("img") || text.indexOf("+") !== -1)
        ) {
          return current;
        }
      }
    }

    return null;
  }

  function findCommonParent(tiles) {
    if (!tiles.length) return null;
    var sameParent = tiles[0].parentElement;
    if (tiles.every(function (tile) { return tile.parentElement === sameParent; })) {
      return sameParent;
    }

    var parent = tiles[0].parentElement;
    while (parent) {
      if (tiles.every(function (tile) { return parent.contains(tile); })) {
        return parent;
      }
      parent = parent.parentElement;
    }

    return sameParent;
  }

  function findAddTile(dialog) {
    var nodes = Array.prototype.slice.call(dialog.querySelectorAll("button,div"));
    var plusNodes = nodes.filter(function (node) {
      if (!isVisible(node)) return false;
      if (node.closest("[aria-label='close'],.close,.modal-close")) return false;
      if (compactText(node) !== "+") return false;

      var rect = node.getBoundingClientRect();
      return rect.width >= 40 && rect.width <= 170 && rect.height >= 40 && rect.height <= 170;
    });

    if (!plusNodes.length) return null;
    return closestTile(plusNodes[plusNodes.length - 1]);
  }

  function fixUploadLayout() {
    injectStyle();

    var dialog = findUploadDialog();
    if (!dialog) return;

    var imageTiles = Array.prototype.slice.call(dialog.querySelectorAll("img"))
      .filter(isVisible)
      .map(closestTile)
      .filter(function (tile, index, list) {
        return tile && list.indexOf(tile) === index;
      });

    var addTile = findAddTile(dialog);
    if (!imageTiles.length || !addTile) return;

    var parent = findCommonParent(imageTiles);
    if (!parent || parent === addTile || addTile.contains(parent)) return;

    parent.classList.add("medical-upload-inline-row");
    addTile.classList.add("medical-upload-inline-add");

    if (addTile.parentElement !== parent || addTile.previousElementSibling !== imageTiles[imageTiles.length - 1]) {
      parent.appendChild(addTile);
    }
  }

  function scheduleFix() {
    window.requestAnimationFrame(fixUploadLayout);
  }

  document.addEventListener("click", function () {
    window.setTimeout(scheduleFix, 0);
  }, true);

  new MutationObserver(scheduleFix).observe(document.body, {
    childList: true,
    subtree: true
  });

  scheduleFix();
})();
