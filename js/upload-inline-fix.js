(function () {
  var STYLE_ID = "medical-upload-inline-fix-style";

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
    for (var i = 0; current && i < 6; i += 1, current = current.parentElement) {
      var rect = current.getBoundingClientRect();
      if (rect.width >= 52 && rect.width <= 140 && rect.height >= 52 && rect.height <= 140) {
        return current;
      }
    }
    return el;
  }

  function findUploadDialog() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("body *"));
    var candidates = nodes.filter(function (node) {
      return isVisible(node) && compactText(node).indexOf("上传病历资料") !== -1;
    });

    return candidates.sort(function (a, b) {
      return a.getBoundingClientRect().width - b.getBoundingClientRect().width;
    })[0] || null;
  }

  function findCommonParent(tiles) {
    if (!tiles.length) return null;
    var parent = tiles[0].parentElement;
    while (parent) {
      var containsAll = tiles.every(function (tile) {
        return parent.contains(tile);
      });
      if (containsAll) return parent;
      parent = parent.parentElement;
    }
    return tiles[0].parentElement;
  }

  function findAddTile(dialog) {
    var nodes = Array.prototype.slice.call(dialog.querySelectorAll("button,div"));
    var plusNodes = nodes.filter(function (node) {
      if (!isVisible(node)) return false;
      if (node.closest("[aria-label='close'],.close,.modal-close")) return false;
      if (compactText(node) !== "+") return false;

      var rect = node.getBoundingClientRect();
      return rect.width >= 40 && rect.width <= 150 && rect.height >= 40 && rect.height <= 150;
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

  var scheduleFix = function () {
    window.requestAnimationFrame(fixUploadLayout);
  };

  document.addEventListener("click", function () {
    window.setTimeout(scheduleFix, 0);
  }, true);

  new MutationObserver(scheduleFix).observe(document.body, {
    childList: true,
    subtree: true
  });

  scheduleFix();
})();
