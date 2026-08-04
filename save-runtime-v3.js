(() => {
  if (window.__frontendArchitectSaveRuntimeV3) return;
  window.__frontendArchitectSaveRuntimeV3 = true;

  const storageKey = 'frontend-architect:page-state:v3';

  function collect() {
    return Array.from(document.querySelectorAll('input, select, textarea')).map((element) => ({
      value: element.value,
      checked: Boolean(element.checked),
      type: element.type || ''
    }));
  }

  function save() {
    const state = JSON.stringify({ hash: location.hash, controls: collect(), savedAt: Date.now() });
    try { localStorage.setItem(storageKey, state); } catch (_) {}
    try { sessionStorage.setItem(storageKey, state); } catch (_) {}
    try { window.name = 'frontend-architect:' + state; } catch (_) {}
  }

  function restore() {
    let state = '';
    try { state = localStorage.getItem(storageKey) || ''; } catch (_) {}
    if (!state) {
      try { state = sessionStorage.getItem(storageKey) || ''; } catch (_) {}
    }
    if (!state) {
      try {
        if (window.name.indexOf('frontend-architect:') === 0) state = window.name.slice(19);
      } catch (_) {}
    }
    if (!state) return;
    try {
      const controls = JSON.parse(state).controls || [];
      document.querySelectorAll('input, select, textarea').forEach((element, index) => {
        const saved = controls[index];
        if (!saved) return;
        if (element.type === 'checkbox' || element.type === 'radio') element.checked = saved.checked;
        else element.value = saved.value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch (_) {}
  }

  function notice(text, error) {
    const old = document.getElementById('frontend-architect-save-notice');
    if (old) old.remove();
    const node = document.createElement('div');
    node.id = 'frontend-architect-save-notice';
    node.textContent = text;
    Object.assign(node.style, {
      position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
      zIndex: '2147483647', padding: '8px 16px', borderRadius: '6px', color: '#fff',
      background: error ? '#d9534f' : '#198754', fontSize: '14px',
      boxShadow: '0 4px 16px rgba(0,0,0,.18)'
    });
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 1800);
  }

  document.addEventListener('input', save, true);
  document.addEventListener('change', save, true);
  document.addEventListener('click', (event) => {
    const element = event.target instanceof Element
      ? event.target.closest('button, a, [role="button"]')
      : null;
    if (!element) return;
    const label = ((element.textContent || '') + ' ' + (element.getAttribute('aria-label') || '')).replace(/\s/g, '');
    if (!label.includes('保存')) return;
    setTimeout(() => {
      try { save(); notice('保存成功，刷新后仍会保留', false); }
      catch (_) { notice('保存失败，请检查浏览器权限', true); }
    }, 100);
  }, true);
  window.addEventListener('beforeunload', save);
  window.addEventListener('pagehide', save);
  window.addEventListener('load', () => setTimeout(restore, 500));
})();
