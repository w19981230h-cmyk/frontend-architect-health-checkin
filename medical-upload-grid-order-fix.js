(function () {
  var VERSION = 'upload-grid-order-20260731-1';
  if (window.__medicalUploadGridOrderFixVersion === VERSION) return;
  window.__medicalUploadGridOrderFixVersion = VERSION;

  var MAX_FILES = 20;
  var GRID_CLASS = 'medical-upload-grid-order-fix';
  var THUMB_CLASS = 'medical-upload-thumb-order-fix';
  var ADD_CLASS = 'medical-upload-add-order-fix';
  var HIDDEN_CLASS = 'medical-upload-hidden-order-fix';
  var STYLE_ID = 'medical-upload-grid-order-style';
  var pending = false;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.' + GRID_CLASS + '{display:grid!important;grid-template-columns:repeat(5,72px)!important;grid-auto-rows:72px!important;gap:12px!important;align-items:start!important;justify-content:start!important;width:408px!important;max-width:100%!important;margin:14px 0 12px!important;}',
      '.' + GRID_CLASS + ' > *{width:72px!important;height:72px!important;margin:0!important;position:relative!important;box-sizing:border-box!important;flex:0 0 72px!important;}',
      '.' + GRID_CLASS + ' img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:4px!important;display:block!important;}',
      '.' + THUMB_CLASS + '{overflow:hidden!important;border-radius:4px!important;border:1px solid #dbe6f5!important;background:#f7faff!important;}',
      '.' + ADD_CLASS + '{display:flex!important;align-items:center!important;justify-content:center!important;border:1px dashed #8fb7ff!important;background:#f7fbff!important;color:#1f4d7a!important;font-size:32px!important;line-height:1!important;border-radius:4px!important;cursor:pointer!important;}',
      '.' + HIDDEN_CLASS + '{display:none!important;opacity:0!important;pointer-events:none!important;}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function rect(el) {
    try {
      return el.getBoundingClientRect();
    } catch (e) {
      return { width: 0, height: 0 };
    }
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    var r = rect(el);
    var style = window.getComputedStyle(el);
    return r.width > 0 && r.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function cleanText(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, '').trim();
  }

  function closestSizedTile(el) {
    var cur = el;
    for (var i = 0; cur && i < 6; i += 1) {
      var r = rect(cur);
      if (r.width >= 48 && r.width <= 132 && r.height >= 48 && r.height <= 132) {
        return cur;
      }
      cur = cur.parentElement;
    }
    return el;
  }

  function unique(list) {
    var seen = [];
    var out = [];
    list.forEach(function (item) {
      if (!item || seen.indexOf(item) !== -1) return;
      seen.push(item);
      out.push(item);
    });
    return out;
  }

  function findDialog() {
    var titles = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,div,span'));
    for (var i = titles.length - 1; i >= 0; i -= 1) {
      var title = titles[i];
      if (!isVisible(title) || cleanText(title).indexOf('上传病历资料') === -1) continue;
      var cur = title;
      for (var j = 0; cur && j < 10; j += 1) {
        var r = rect(cur);
        if (r.width >= 520 && r.width <= 980 && r.height >= 320 && r.height <= 760) {
          return cur;
        }
        cur = cur.parentElement;
      }
    }
    return null;
  }

  function findCheckboxAnchor(dialog) {
    var nodes = Array.prototype.slice.call(dialog.querySelectorAll('label,div,span,p'));
    for (var i = 0; i < nodes.length; i += 1) {
      if (isVisible(nodes[i]) && cleanText(nodes[i]).indexOf('以上内容属于同一份报告') !== -1) {
        return nodes[i].closest('label') || nodes[i];
      }
    }
    return null;
  }

  function getThumbTiles(dialog) {
    var imgs = Array.prototype.slice.call(dialog.querySelectorAll('img'));
    return unique(imgs.map(function (img) {
      if (!isVisible(img)) return null;
      var r = rect(img);
      if (r.width > 150 || r.height > 150 || r.width < 24 || r.height < 24) return null;
      return closestSizedTile(img);
    }).filter(function (tile) {
      return tile && !tile.classList.contains(HIDDEN_CLASS);
    }));
  }

  function getNativeAddTiles(dialog) {
    var nodes = Array.prototype.slice.call(dialog.querySelectorAll('button,label,div,span'));
    return unique(nodes.map(function (node) {
      if (!isVisible(node) || node.closest('.' + GRID_CLASS)) return null;
      var t = cleanText(node);
      if (t !== '+' && t !== '＋') return null;
      var tile = closestSizedTile(node);
      var r = rect(tile);
      if (r.width < 48 || r.width > 132 || r.height < 48 || r.height > 132) return null;
      return tile;
    }).filter(Boolean));
  }

  function clickUpload(dialog) {
    var nativeAdd = dialog.querySelector('.' + HIDDEN_CLASS);
    if (nativeAdd && typeof nativeAdd.click === 'function') {
      nativeAdd.click();
      return;
    }
    var input = dialog.querySelector('input[type="file"]');
    if (input && typeof input.click === 'function') input.click();
  }

  function ensureGrid(dialog) {
    var grid = dialog.querySelector('.' + GRID_CLASS);
    if (grid) return grid;

    grid = document.createElement('div');
    grid.className = GRID_CLASS;
    var anchor = findCheckboxAnchor(dialog);
    if (anchor && anchor.parentElement) {
      anchor.parentElement.insertBefore(grid, anchor.nextSibling);
      return grid;
    }

    var firstAdd = getNativeAddTiles(dialog)[0];
    if (firstAdd && firstAdd.parentElement) {
      firstAdd.parentElement.insertBefore(grid, firstAdd);
      return grid;
    }

    dialog.appendChild(grid);
    return grid;
  }

  function makeSyntheticAdd(dialog) {
    var add = document.createElement('button');
    add.type = 'button';
    add.className = ADD_CLASS;
    add.textContent = '+';
    add.setAttribute('aria-label', '上传病历资料');
    add.addEventListener('click', function () {
      clickUpload(dialog);
    });
    return add;
  }

  function normalizeUploadGrid() {
    injectStyle();
    var dialog = findDialog();
    if (!dialog) return;

    var grid = ensureGrid(dialog);
    var thumbs = getThumbTiles(dialog);
    var nativeAdds = getNativeAddTiles(dialog);
    var addTile = grid.querySelector('.' + ADD_CLASS) || nativeAdds[0] || makeSyntheticAdd(dialog);

    thumbs.forEach(function (tile) {
      tile.classList.add(THUMB_CLASS);
      tile.classList.remove(HIDDEN_CLASS);
      grid.appendChild(tile);
    });

    nativeAdds.forEach(function (tile) {
      if (tile !== addTile) tile.classList.add(HIDDEN_CLASS);
    });

    addTile.classList.add(ADD_CLASS);
    addTile.classList.remove(HIDDEN_CLASS);
    if (thumbs.length >= MAX_FILES) {
      addTile.classList.add(HIDDEN_CLASS);
    }
    grid.appendChild(addTile);
  }

  function scheduleNormalize() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(function () {
      pending = false;
      normalizeUploadGrid();
    });
  }

  document.addEventListener('click', function () {
    window.setTimeout(scheduleNormalize, 0);
    window.setTimeout(scheduleNormalize, 120);
  }, true);
  document.addEventListener('change', function () {
    window.setTimeout(scheduleNormalize, 0);
    window.setTimeout(scheduleNormalize, 120);
  }, true);
  new MutationObserver(scheduleNormalize).observe(document.documentElement, { childList: true, subtree: true });
  scheduleNormalize();
})();
