(function () {
  if (window.__medicalUploadModalV6) return;
  window.__medicalUploadModalV6 = true;

  var GRID = 'medical-upload-flow-grid-v6';
  var HIDE = 'medical-upload-flow-hidden-v6';
  var THUMB = 'medical-upload-flow-thumb-v6';
  var ADD = 'medical-upload-flow-add-v6';
  var MAX_COUNT = 20;

  function textOf(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, '').trim();
  }

  function isVisible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var rect = el.getBoundingClientRect();
    var style = window.getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }

  function installStyle() {
    if (document.getElementById('medical-upload-flow-style-v6')) return;
    var style = document.createElement('style');
    style.id = 'medical-upload-flow-style-v6';
    style.textContent = [
      '.' + GRID + '{display:flex!important;flex-wrap:wrap!important;align-items:flex-start!important;gap:12px!important;max-width:408px!important;margin:14px 0 0!important;}',
      '.' + GRID + ' .' + THUMB + ',.' + GRID + ' .' + ADD + '{width:72px!important;height:72px!important;min-width:72px!important;flex:0 0 72px!important;border-radius:4px!important;box-sizing:border-box!important;overflow:hidden!important;position:relative!important;margin:0!important;}',
      '.' + GRID + ' .' + THUMB + '{order:1!important;border:1px solid #dbe6f6!important;background:#f8fbff!important;}',
      '.' + GRID + ' .' + THUMB + ' img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;}',
      '.' + GRID + ' .' + ADD + '{order:2!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px dashed #c8d8ef!important;background:#f7fbff!important;color:#1f3b5d!important;font-size:28px!important;cursor:pointer!important;}',
      '.' + HIDE + '{display:none!important;}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function closestWithin(el, root, predicate) {
    var node = el;
    while (node && node !== root && node.nodeType === 1) {
      if (predicate(node)) return node;
      node = node.parentElement;
    }
    return el;
  }

  function isSquareTile(el) {
    var rect = el.getBoundingClientRect();
    return rect.width >= 48 && rect.width <= 140 && rect.height >= 48 && rect.height <= 140;
  }

  function findDialog() {
    var titles = Array.prototype.filter.call(document.querySelectorAll('*'), function (el) {
      return textOf(el) === '上传病历资料';
    });
    var best = null;
    var bestArea = 0;
    titles.forEach(function (title) {
      var node = title;
      while (node && node !== document.body) {
        var text = textOf(node);
        var rect = node.getBoundingClientRect();
        if (text.indexOf('上传病历资料') >= 0 && text.indexOf('取消') >= 0 && text.indexOf('确定') >= 0 && rect.width > 420 && rect.height > 260) {
          var area = rect.width * rect.height;
          if (area > bestArea) {
            best = node;
            bestArea = area;
          }
        }
        node = node.parentElement;
      }
    });
    return best;
  }

  function findCheckboxRow(dialog) {
    var matches = Array.prototype.filter.call(dialog.querySelectorAll('*'), function (el) {
      return isVisible(el) && textOf(el).indexOf('以上内容属于同一份报告') >= 0;
    });
    if (!matches.length) return null;
    return closestWithin(matches[0], dialog, function (node) {
      var rect = node.getBoundingClientRect();
      return rect.width > 250 && rect.height < 90 && textOf(node).indexOf('上传病历资料') < 0;
    });
  }

  function ensureGrid(dialog) {
    var grid = dialog.querySelector('.' + GRID);
    if (grid) return grid;
    grid = document.createElement('div');
    grid.className = GRID;
    grid.setAttribute('data-upload-rule', '图片在前，上传入口跟随最后一张图片；一行最多5个，最多20个文件');
    var row = findCheckboxRow(dialog);
    if (row && row.parentElement) {
      row.insertAdjacentElement('afterend', grid);
    } else {
      dialog.appendChild(grid);
    }
    return grid;
  }

  function imageTileFor(img, dialog) {
    return closestWithin(img, dialog, function (node) {
      var rect = node.getBoundingClientRect();
      return rect.width >= 48 && rect.width <= 120 && rect.height >= 48 && rect.height <= 120;
    });
  }

  function collectImageTiles(dialog, grid) {
    var seen = new Set();
    var tiles = [];
    Array.prototype.forEach.call(dialog.querySelectorAll('img'), function (img) {
      var rect = img.getBoundingClientRect();
      if (!grid.contains(img) && (!isVisible(img) || rect.width < 32 || rect.height < 32 || img.closest('button'))) return;
      var tile = imageTileFor(img, dialog);
      if (!tile || tile.classList.contains(ADD) || seen.has(tile)) return;
      seen.add(tile);
      tiles.push(tile);
    });
    return tiles;
  }

  function plusTileFor(el, dialog) {
    return closestWithin(el, dialog, function (node) {
      if (node.querySelector && node.querySelector('img')) return false;
      return isSquareTile(node);
    });
  }

  function collectPlusTiles(dialog) {
    var seen = new Set();
    var tiles = [];
    Array.prototype.forEach.call(dialog.querySelectorAll('*'), function (el) {
      if (el.classList && el.classList.contains(THUMB)) return;
      var text = textOf(el);
      var isPlus = text === '+' || text === '＋';
      var hasFile = el.matches && (el.matches('input[type="file"]') || el.querySelector('input[type="file"]'));
      if (!isPlus && !hasFile) return;
      if (el.querySelector && el.querySelector('img')) return;
      var tile = plusTileFor(el, dialog);
      if (tile && !seen.has(tile)) {
        seen.add(tile);
        tiles.push(tile);
      }
    });
    return tiles;
  }

  function normalizeUploadQueue() {
    installStyle();
    var dialog = findDialog();
    if (!dialog) return;

    var grid = ensureGrid(dialog);
    var imageTiles = collectImageTiles(dialog, grid);
    imageTiles.forEach(function (tile) {
      tile.classList.remove(HIDE, ADD);
      tile.classList.add(THUMB);
      grid.appendChild(tile);
    });

    var plusTiles = collectPlusTiles(dialog).filter(function (tile) {
      return !tile.querySelector('img');
    });
    var uploadTile = plusTiles.find(function (tile) {
      return !tile.classList.contains(HIDE);
    }) || plusTiles[0];

    plusTiles.forEach(function (tile) {
      if (tile !== uploadTile) tile.classList.add(HIDE);
    });

    if (uploadTile) {
      uploadTile.classList.remove(THUMB);
      uploadTile.classList.add(ADD);
      if (imageTiles.length >= MAX_COUNT) {
        uploadTile.classList.add(HIDE);
      } else {
        uploadTile.classList.remove(HIDE);
        grid.appendChild(uploadTile);
      }
    }
  }

  function scheduleNormalize() {
    window.requestAnimationFrame(function () {
      window.setTimeout(normalizeUploadQueue, 0);
    });
  }

  ['click', 'change', 'input'].forEach(function (eventName) {
    document.addEventListener(eventName, scheduleNormalize, true);
  });
  new MutationObserver(scheduleNormalize).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true
  });
  window.setInterval(normalizeUploadQueue, 600);
  normalizeUploadQueue();
})();
