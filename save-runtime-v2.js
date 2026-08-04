(() => {
  if (window.__frontendArchitectSaveRuntime) return;
  window.__frontendArchitectSaveRuntime = true;

  const key = 'frontend-architect:page-state:v2';
  let timer = 0;

  const readControls = () => Array.from(document.querySelectorAll('input, select, textarea')).map((el) => ({
    value: el.value,
    checked: Boolean(el.checked),
    type: el.type || ''
  }));

  const write = () => {
    const data = JSON.stringify({ hash: location.hash, controls: readControls(), savedAt: Date.now() });
    let ok = false;
    try {
      localStorage.setItem(key, data);
      ok = true;
    } catch (_) {}
    try {
      window.name = 'frontend-architect:' + data;
      ok = true;
    } catch (_) {}
    return ok;
  };

  const read = () => {
    try {
      const data = localStorage.getItem(key);
      if (data) return data;
    } catch (_) {}
    try {
      return window.name.indexOf('frontend-architect:') === 0
        ? window.name.slice('frontend-architect:'.length)
        : '';
    } catch (_) {
      return '';
    }
  };

  const restore = () => {
    const raw = read();
    if (!raw) return;
    try {
      const controls = JSON.parse(raw).controls || [];
      document.querySelectorAll('input, select, textarea').forEach((el, index) => {
        const saved = controls[index];
        if (!saved) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = saved.checked;
        else el.value = saved.value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch (_) {}
  };

  const notify = (text, error) => {
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
  };

  const queueWrite = () => {
    clearTimeout(timer);
    timer = setTimeout(write, 150);
  };

  document.addEventListener('input', queueWrite, true);
  document.addEventListener('change', queueWrite, true);
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('button, a, [role="button"]')
      : null;
    if (!target) return;
    const label = (target.textContent || '') + ' ' + (target.getAttribute('aria-label') || '');
    if (label.replace(/\s/g, '').indexOf('保存') === -1) return;
    setTimeout(() => {
      const ok = write();
      notify(ok ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器权限', !ok);
    }, 120);
  }, true);
  window.addEventListener('beforeunload', write);
  window.addEventListener('pagehide', write);
  window.addEventListener('load', () => setTimeout(restore, 600));
})();
