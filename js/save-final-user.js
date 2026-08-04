(() => {
  if (window.__frontendArchitectSaveFinalUser) return;
  window.__frontendArchitectSaveFinalUser = true;

  const key = 'frontend-architect:save-state:v3';
  const getStores = () => {
    const stores = [];
    try { stores.push(window.localStorage); } catch (error) { console.warn('[save] localStorage unavailable', error); }
    try { stores.push(window.sessionStorage); } catch (error) { console.warn('[save] sessionStorage unavailable', error); }
    return stores;
  };
  const fields = () => [...document.querySelectorAll('input, select, textarea')];

  const save = () => {
    const state = {
      savedAt: new Date().toISOString(),
      hash: window.location.hash,
      values: fields().map((field, index) => ({
        index,
        name: field.name || '',
        id: field.id || '',
        value: field.value,
        checked: Boolean(field.checked)
      }))
    };
    const serialized = JSON.stringify(state);
    let saved = false;
    getStores().forEach((storage) => {
      try {
        storage.setItem(key, serialized);
        saved = true;
      } catch (error) {
        console.warn('[save] storage write failed', error);
      }
    });
    window.__frontendArchitectSavedState = state;
    return saved;
  };

  const restore = () => {
    let raw = null;
    for (const storage of getStores()) {
      try { raw = storage.getItem(key); } catch (error) { console.warn('[save] storage read failed', error); }
      if (raw) break;
    }
    if (!raw) return;
    try {
      const state = JSON.parse(raw);
      fields().forEach((field, index) => {
        const saved = state.values?.[index];
        if (!saved) return;
        if (field.type === 'checkbox' || field.type === 'radio') field.checked = saved.checked;
        else field.value = saved.value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch (error) {
      console.warn('[save] invalid saved state', error);
    }
  };

  const toast = (message, failed = false) => {
    document.getElementById('frontend-architect-save-toast')?.remove();
    const node = document.createElement('div');
    node.id = 'frontend-architect-save-toast';
    node.textContent = message;
    Object.assign(node.style, {
      position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: '999999',
      padding: '10px 18px', borderRadius: '6px', color: '#fff',
      background: failed ? '#d9534f' : '#1f7a55', boxShadow: '0 8px 24px rgba(26,49,87,.18)', fontSize: '14px'
    });
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 1800);
  };

  document.addEventListener('click', (event) => {
    const element = event.target instanceof Element ? event.target : event.target?.parentElement;
    const button = element?.closest('button, [role="button"], a');
    if (!button) return;
    const label = `${button.textContent || ''} ${button.getAttribute('aria-label') || ''} ${button.dataset.action || ''}`.replace(/\s/g, '');
    if (!label.includes('保存')) return;
    const saved = save();
    window.setTimeout(() => toast(saved ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器存储权限', !saved), 0);
  }, true);

  window.addEventListener('beforeunload', save);
  window.addEventListener('load', () => {
    window.setTimeout(restore, 500);
    window.setTimeout(restore, 1500);
  });
})();
