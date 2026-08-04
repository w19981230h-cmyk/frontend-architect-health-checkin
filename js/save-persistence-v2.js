(() => {
  if (window.__frontendArchitectSavePersistenceV2) return;
  window.__frontendArchitectSavePersistenceV2 = true;

  const storageKey = 'frontend-architect:page-state:v2';

  function getStores() {
    return ['localStorage', 'sessionStorage']
      .map((name) => {
        try { return window[name]; } catch { return null; }
      })
      .filter(Boolean);
  }

  function controls() {
    return Array.from(document.querySelectorAll('input, select, textarea')).map((el, index) => ({
      index,
      value: el.value,
      checked: Boolean(el.checked),
      type: el.type || ''
    }));
  }

  function saveState() {
    const payload = JSON.stringify({
      hash: window.location.hash,
      controls: controls(),
      savedAt: new Date().toISOString()
    });

    let saved = false;
    getStores().forEach((store) => {
      try {
        store.setItem(storageKey, payload);
        saved = true;
      } catch {}
    });

    try {
      window.name = `frontend-architect-state:${payload}`;
      saved = true;
    } catch {}

    return saved;
  }

  function readState() {
    for (const store of getStores()) {
      try {
        const value = store.getItem(storageKey);
        if (value) return value;
      } catch {}
    }

    try {
      if (window.name.startsWith('frontend-architect-state:')) {
        return window.name.slice('frontend-architect-state:'.length);
      }
    } catch {}

    return null;
  }

  function restoreState() {
    const raw = readState();
    if (!raw) return;

    try {
      const state = JSON.parse(raw);
      const pageControls = document.querySelectorAll('input, select, textarea');
      state.controls?.forEach((saved) => {
        const el = pageControls[saved.index];
        if (!el) return;
        if (saved.type === 'checkbox' || saved.type === 'radio') el.checked = saved.checked;
        else el.value = saved.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch {}
  }

  function showToast(message, failed = false) {
    document.getElementById('frontend-architect-save-toast')?.remove();
    const toast = document.createElement('div');
    toast.id = 'frontend-architect-save-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '2147483647',
      padding: '10px 18px',
      borderRadius: '6px',
      color: '#fff',
      background: failed ? '#d9534f' : '#198754',
      fontSize: '14px',
      boxShadow: '0 8px 24px rgba(26,49,87,.18)'
    });
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1800);
  }

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const button = target?.closest('button, [role="button"], a');
    if (!button) return;

    const text = `${button.textContent || ''} ${button.getAttribute('aria-label') || ''}`.replace(/\s/g, '');
    if (!text.includes('保存')) return;

    const saved = saveState();
    window.setTimeout(() => showToast(saved ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器存储权限', !saved), 0);
  }, true);

  window.addEventListener('beforeunload', saveState);
  window.addEventListener('load', () => window.setTimeout(restoreState, 600));
})();
