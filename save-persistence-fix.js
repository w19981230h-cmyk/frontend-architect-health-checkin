(() => {
  const KEY = 'frontend-architect-save-state-v7';

  const getStores = () => ['localStorage', 'sessionStorage']
    .map((name) => {
      try { return window[name]; } catch (_) { return null; }
    })
    .filter(Boolean);

  const getControls = () => Array.from(document.querySelectorAll('input, select, textarea')).map((el) => ({
    value: el.value,
    checked: el.checked,
    type: el.type || ''
  }));

  const saveState = () => {
    const payload = JSON.stringify({ controls: getControls(), hash: location.hash, savedAt: Date.now() });
    let saved = false;
    getStores().forEach((store) => {
      try { store.setItem(KEY, payload); saved = true; } catch (_) {}
    });
    try { window.name = `frontend-architect:${payload}`; saved = true; } catch (_) {}
    return saved;
  };

  const restoreState = () => {
    let payload = '';
    for (const store of getStores()) {
      try { payload = store.getItem(KEY) || ''; } catch (_) {}
      if (payload) break;
    }
    if (!payload) {
      try {
        if (window.name.startsWith('frontend-architect:')) payload = window.name.slice('frontend-architect:'.length);
      } catch (_) {}
    }
    if (!payload) return;

    try {
      const controls = JSON.parse(payload).controls || [];
      Array.from(document.querySelectorAll('input, select, textarea')).forEach((el, index) => {
        const saved = controls[index];
        if (!saved) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!saved.checked;
        else el.value = saved.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch (_) {}
  };

  const showToast = (message, failed) => {
    document.getElementById('save-persistence-fix-toast')?.remove();
    const toast = document.createElement('div');
    toast.id = 'save-persistence-fix-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed', top: '18px', left: '50%', transform: 'translateX(-50%)', zIndex: '999999',
      padding: '9px 16px', borderRadius: '6px', color: '#fff', fontSize: '14px',
      background: failed ? '#d9534f' : '#198754', boxShadow: '0 6px 20px rgba(0,0,0,.16)'
    });
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1800);
  };

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('button, a, [role="button"]')
      : null;
    if (!target) return;
    const label = `${target.textContent || ''} ${target.getAttribute('aria-label') || ''}`.replace(/\s/g, '');
    if (!label.includes('保存')) return;
    window.setTimeout(() => {
      const saved = saveState();
      showToast(saved ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器权限', !saved);
    }, 0);
  }, true);

  window.addEventListener('beforeunload', saveState);
  window.addEventListener('load', () => window.setTimeout(restoreState, 600));
})();
