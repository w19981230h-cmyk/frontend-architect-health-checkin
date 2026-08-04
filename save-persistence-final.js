(() => {
  if (window.__frontendArchitectSavePersistence) return;
  window.__frontendArchitectSavePersistence = true;

  const KEY = 'frontend-architect:save-state:v10';
  const getControls = () => Array.from(document.querySelectorAll('input, select, textarea')).map((el) => ({
    value: el.value,
    checked: Boolean(el.checked),
    type: el.type || ''
  }));
  const stores = () => {
    const result = [];
    for (const name of ['localStorage', 'sessionStorage']) {
      try { if (window[name]) result.push(window[name]); } catch (_) {}
    }
    return result;
  };
  const save = () => {
    const payload = JSON.stringify({ controls: getControls(), hash: location.hash, savedAt: Date.now() });
    let saved = false;
    for (const store of stores()) {
      try { store.setItem(KEY, payload); saved = true; } catch (_) {}
    }
    try { window.name = `frontend-architect:${payload}`; saved = true; } catch (_) {}
    return saved;
  };
  const load = () => {
    for (const store of stores()) {
      try { const value = store.getItem(KEY); if (value) return value; } catch (_) {}
    }
    try { return window.name.startsWith('frontend-architect:') ? window.name.slice(21) : ''; } catch (_) { return ''; }
  };
  const restore = () => {
    const raw = load();
    if (!raw) return;
    try {
      const saved = JSON.parse(raw).controls || [];
      document.querySelectorAll('input, select, textarea').forEach((el, index) => {
        if (el.closest('[data-persistence-ignore]')) return;
        const item = saved[index];
        if (!item) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = item.checked;
        else el.value = item.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch (_) {}
  };
  const notice = (message, error) => {
    document.getElementById('frontend-architect-save-notice')?.remove();
    const el = document.createElement('div');
    el.id = 'frontend-architect-save-notice';
    el.textContent = message;
    Object.assign(el.style, { position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: '2147483647', padding: '8px 14px', borderRadius: '6px', color: '#fff', background: error ? '#d9534f' : '#198754', fontSize: '14px', boxShadow: '0 4px 16px rgba(0,0,0,.18)' });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  };
  document.addEventListener('click', (event) => {
    const source = event.target instanceof Element ? event.target.closest('button, a, [role="button"]') : null;
    if (!source) return;
    if (source.closest('#interfaceNoteEditor')) return;
    const label = `${source.textContent || ''} ${source.getAttribute('aria-label') || ''}`.replace(/\s/g, '');
    if (!label.includes('保存')) return;
    setTimeout(() => notice(save() ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器权限', false), 100);
  }, true);
  window.addEventListener('beforeunload', save);
  window.addEventListener('load', () => setTimeout(restore, 600));
})();
