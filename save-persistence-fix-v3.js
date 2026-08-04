(() => {
  const KEY = 'frontend-architect-save-state-v3';

  function storageList() {
    return ['localStorage', 'sessionStorage'].flatMap((name) => {
      try { return window[name] ? [window[name]] : []; } catch (_) { return []; }
    });
  }

  function snapshot() {
    return Array.from(document.querySelectorAll('input, select, textarea')).map((el) => ({
      value: el.value,
      checked: Boolean(el.checked),
      type: el.type || ''
    }));
  }

  function save() {
    const payload = JSON.stringify({ controls: snapshot(), hash: location.hash, savedAt: Date.now() });
    let saved = false;
    storageList().forEach((store) => {
      try { store.setItem(KEY, payload); saved = true; } catch (_) {}
    });
    try { window.name = `frontend-architect:${payload}`; saved = true; } catch (_) {}
    return saved;
  }

  function restore() {
    let raw = '';
    for (const store of storageList()) {
      try { raw = store.getItem(KEY) || ''; } catch (_) {}
      if (raw) break;
    }
    if (!raw) {
      try {
        if (window.name.startsWith('frontend-architect:')) raw = window.name.slice('frontend-architect:'.length);
      } catch (_) {}
    }
    if (!raw) return;
    try {
      const controls = JSON.parse(raw).controls || [];
      document.querySelectorAll('input, select, textarea').forEach((el, index) => {
        const item = controls[index];
        if (!item) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = item.checked;
        else el.value = item.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch (_) {}
  }

  function notice(message, failed) {
    document.getElementById('frontend-architect-save-notice')?.remove();
    const el = document.createElement('div');
    el.id = 'frontend-architect-save-notice';
    el.textContent = message;
    Object.assign(el.style, {
      position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: '2147483647',
      padding: '8px 14px', borderRadius: '6px', color: '#fff', background: failed ? '#d9534f' : '#198754',
      fontSize: '14px', boxShadow: '0 4px 16px rgba(0,0,0,.18)'
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('button, a, [role="button"]') : null;
    if (!target) return;
    const label = `${target.textContent || ''} ${target.getAttribute('aria-label') || ''}`.replace(/\s/g, '');
    if (!label.includes('保存')) return;
    setTimeout(() => notice(save() ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器权限', false), 80);
  }, true);

  window.addEventListener('beforeunload', save);
  window.addEventListener('load', () => setTimeout(restore, 600));
})();
