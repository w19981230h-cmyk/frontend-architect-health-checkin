(() => {
  const KEY = 'frontend-architect-save-state-v8';
  const stores = () => ['localStorage', 'sessionStorage'].flatMap((name) => {
    try { return window[name] ? [window[name]] : []; } catch (_) { return []; }
  });

  const controls = () => Array.from(document.querySelectorAll('input, select, textarea')).map((el) => ({
    value: el.value,
    checked: Boolean(el.checked),
    type: el.type || ''
  }));

  const write = () => {
    const payload = JSON.stringify({ controls: controls(), hash: location.hash, time: Date.now() });
    let ok = false;
    stores().forEach((store) => {
      try { store.setItem(KEY, payload); ok = true; } catch (_) {}
    });
    try { window.name = `frontend-architect-save:${payload}`; ok = true; } catch (_) {}
    return ok;
  };

  const read = () => {
    let payload = '';
    for (const store of stores()) {
      try { payload = store.getItem(KEY) || ''; } catch (_) {}
      if (payload) break;
    }
    if (!payload) {
      try {
        if (window.name.startsWith('frontend-architect-save:')) payload = window.name.slice(24);
      } catch (_) {}
    }
    if (!payload) return;
    try {
      const saved = JSON.parse(payload).controls || [];
      Array.from(document.querySelectorAll('input, select, textarea')).forEach((el, index) => {
        const item = saved[index];
        if (!item) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = item.checked;
        else el.value = item.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch (_) {}
  };

  const toast = (message, error) => {
    document.getElementById('save-fix-toast-v2')?.remove();
    const node = document.createElement('div');
    node.id = 'save-fix-toast-v2';
    node.textContent = message;
    Object.assign(node.style, {
      position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 2147483647,
      padding: '8px 14px', borderRadius: '6px', color: '#fff', background: error ? '#d9534f' : '#198754',
      fontSize: '14px', boxShadow: '0 4px 16px rgba(0,0,0,.18)'
    });
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 1800);
  };

  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button, a, [role="button"]') : null;
    if (!button) return;
    const text = `${button.textContent || ''} ${button.getAttribute('aria-label') || ''}`.replace(/\s/g, '');
    if (!text.includes('保存')) return;
    setTimeout(() => toast(write() ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器权限', false), 50);
  }, true);

  window.addEventListener('beforeunload', write);
  window.addEventListener('load', () => setTimeout(read, 800));
})();
