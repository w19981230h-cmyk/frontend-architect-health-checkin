(() => {
  const key = 'frontend-architect:save-state:v6';
  const getStores = () => ['localStorage', 'sessionStorage'].map((name) => {
    try { return window[name]; } catch { return null; }
  }).filter(Boolean);
  const snapshot = () => JSON.stringify({
    hash: location.hash,
    controls: [...document.querySelectorAll('input, select, textarea')].map((el) => ({
      value: el.value,
      checked: !!el.checked,
      type: el.type || ''
    })),
    savedAt: Date.now()
  });
  const save = () => {
    const value = snapshot();
    let ok = false;
    getStores().forEach((store) => { try { store.setItem(key, value); ok = true; } catch {} });
    try { window.name = `frontend-architect:${value}`; ok = true; } catch {}
    return ok;
  };
  const restore = () => {
    let raw = '';
    for (const store of getStores()) { try { raw = store.getItem(key) || ''; } catch {} if (raw) break; }
    if (!raw) { try { raw = window.name.startsWith('frontend-architect:') ? window.name.slice(21) : ''; } catch {} }
    if (!raw) return;
    try {
      const controls = JSON.parse(raw).controls || [];
      [...document.querySelectorAll('input, select, textarea')].forEach((el, index) => {
        const value = controls[index];
        if (!value) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = value.checked;
        else el.value = value.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch {}
  };
  const toast = (message, error) => {
    document.getElementById('save-persistence-toast')?.remove();
    const node = document.createElement('div');
    node.id = 'save-persistence-toast';
    node.textContent = message;
    Object.assign(node.style, { position: 'fixed', top: '18px', left: '50%', transform: 'translateX(-50%)', zIndex: 999999, padding: '9px 16px', borderRadius: '6px', color: '#fff', background: error ? '#d9534f' : '#198754', fontSize: '14px', boxShadow: '0 6px 20px rgba(0,0,0,.16)' });
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 1800);
  };
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('button, [role="button"], a') : null;
    if (!target) return;
    const label = `${target.textContent || ''}${target.getAttribute('aria-label') || ''}`.replace(/\s/g, '');
    if (!label.includes('保存')) return;
    setTimeout(() => { const ok = save(); toast(ok ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器权限', !ok); }, 0);
  }, true);
  window.addEventListener('beforeunload', save);
  window.addEventListener('load', () => setTimeout(restore, 500));
})();
