(() => {
  if (window.__frontendArchitectSaveBridge) return;
  window.__frontendArchitectSaveBridge = true;

  const key = 'frontend-architect:save-state:v4';
  const stores = () => {
    const result = [];
    for (const name of ['localStorage', 'sessionStorage']) {
      try {
        if (window[name]) result.push(window[name]);
      } catch (error) {
        console.warn(`[save] ${name} unavailable`, error);
      }
    }
    return result;
  };

  const controls = () => [...document.querySelectorAll('input, select, textarea')];
  const save = () => {
    const state = {
      savedAt: new Date().toISOString(),
      hash: location.hash,
      values: controls().map((control, index) => ({
        index,
        value: control.value,
        checked: Boolean(control.checked),
        name: control.name || '',
        id: control.id || ''
      }))
    };
    const raw = JSON.stringify(state);
    let ok = false;
    stores().forEach((store) => {
      try {
        store.setItem(key, raw);
        ok = true;
      } catch (error) {
        console.warn('[save] write failed', error);
      }
    });
    window.__frontendArchitectSavedState = state;
    return ok;
  };

  const toast = (message, failed) => {
    document.getElementById('frontend-architect-save-toast')?.remove();
    const node = document.createElement('div');
    node.id = 'frontend-architect-save-toast';
    node.textContent = message;
    Object.assign(node.style, {
      position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 999999,
      padding: '10px 18px', borderRadius: '6px', color: '#fff',
      background: failed ? '#d9534f' : '#1f7a55', fontSize: '14px'
    });
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 1800);
  };

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const button = target?.closest('button, [role="button"], a');
    if (!button) return;
    const label = `${button.textContent || ''} ${button.getAttribute('aria-label') || ''}`.replace(/\s/g, '');
    if (!label.includes('保存')) return;
    const ok = save();
    setTimeout(() => toast(ok ? '保存成功' : '保存失败，请检查浏览器存储权限', !ok), 0);
  }, true);

  window.addEventListener('beforeunload', save);
})();
