(() => {
  if (window.__frontendArchitectSaveGuardFinal) return;
  window.__frontendArchitectSaveGuardFinal = true;

  const STORAGE_KEY = 'frontend-architect:save-state:v1';
  const getControls = () => [...document.querySelectorAll('input, select, textarea')];

  const collectState = () => ({
    savedAt: new Date().toISOString(),
    hash: window.location.hash,
    values: getControls().map((element, index) => ({
      index,
      name: element.name || '',
      id: element.id || '',
      value: element.value,
      checked: Boolean(element.checked)
    }))
  });

  const persist = () => {
    const state = collectState();
    const serialized = JSON.stringify(state);
    let persisted = false;
    for (const storage of [window.localStorage, window.sessionStorage]) {
      try {
        storage.setItem(STORAGE_KEY, serialized);
        persisted = true;
      } catch (error) {
        console.warn('[save-guard] storage unavailable', error);
      }
    }
    window.__frontendArchitectSavedState = state;
    return persisted;
  };

  const restore = () => {
    let serialized = null;
    for (const storage of [window.localStorage, window.sessionStorage]) {
      try {
        serialized = storage.getItem(STORAGE_KEY);
      } catch (error) {
        console.warn('[save-guard] storage unavailable', error);
      }
      if (serialized) break;
    }
    if (!serialized) return;
    try {
      const state = JSON.parse(serialized);
      getControls().forEach((element, index) => {
        const saved = state.values?.[index];
        if (!saved) return;
        if (element.type === 'checkbox' || element.type === 'radio') {
          element.checked = saved.checked;
        } else if (element.value !== saved.value) {
          element.value = saved.value;
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } catch (error) {
      console.warn('[save-guard] invalid saved state', error);
    }
  };

  const showToast = (message, failed = false) => {
    document.getElementById('frontend-architect-save-toast')?.remove();
    const node = document.createElement('div');
    node.id = 'frontend-architect-save-toast';
    node.textContent = message;
    Object.assign(node.style, {
      position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
      zIndex: '999999', padding: '10px 18px', borderRadius: '6px', color: '#fff',
      background: failed ? '#d9534f' : '#1f7a55',
      boxShadow: '0 8px 24px rgba(26,49,87,.18)', fontSize: '14px'
    });
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 1800);
  };

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const button = target?.closest('button, [role="button"], a');
    if (!button || !(button.textContent || '').replace(/\s+/g, '').includes('保存')) return;
    const ok = persist();
    setTimeout(() => showToast(ok ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器存储权限', !ok), 0);
  }, true);

  window.addEventListener('beforeunload', persist);
  window.addEventListener('load', () => setTimeout(restore, 0));
})();
