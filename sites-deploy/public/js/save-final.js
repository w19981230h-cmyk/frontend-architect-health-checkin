(() => {
  if (window.__frontendArchitectSaveFinalBound) return;
  window.__frontendArchitectSaveFinalBound = true;

  const STORAGE_KEY = 'frontend-architect:save-state:v4';

  const getKey = (element, index) => element.name || element.id || `${element.tagName.toLowerCase()}-${index}`;

  const collectState = () => ({
    savedAt: new Date().toISOString(),
    hash: window.location.hash,
    controls: [...document.querySelectorAll('input, select, textarea')].map((element, index) => ({
      key: getKey(element, index),
      value: element.value,
      checked: Boolean(element.checked)
    }))
  });

  const saveState = () => {
    const state = collectState();
    const serialized = JSON.stringify(state);
    let saved = false;
    try {
      window.localStorage.setItem(STORAGE_KEY, serialized);
      saved = true;
    } catch (error) {
      console.warn('[save] localStorage unavailable', error);
    }
    try {
      window.sessionStorage.setItem(STORAGE_KEY, serialized);
      saved = true;
    } catch (error) {
      console.warn('[save] sessionStorage unavailable', error);
    }
    try {
      window.name = `frontend-architect:${serialized}`;
      saved = true;
    } catch (error) {
      console.warn('[save] window.name unavailable', error);
    }
    window.__frontendArchitectSavedState = state;
    return saved;
  };

  const readState = () => {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY) || window.sessionStorage.getItem(STORAGE_KEY);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  };

  const restoreState = () => {
    const state = readState();
    if (!state?.controls?.length) return;
    const controls = [...document.querySelectorAll('input, select, textarea')];
    state.controls.forEach((saved, index) => {
      const element = controls.find((candidate, candidateIndex) => getKey(candidate, candidateIndex) === saved.key) || controls[index];
      if (!element) return;
      if (element.type === 'checkbox' || element.type === 'radio') element.checked = saved.checked;
      else if (saved.value !== undefined) element.value = saved.value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    });
  };

  const showToast = (message, failed = false) => {
    document.getElementById('frontend-architect-save-toast')?.remove();
    const toast = document.createElement('div');
    toast.id = 'frontend-architect-save-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '100000',
      padding: '10px 18px',
      borderRadius: '6px',
      color: '#fff',
      background: failed ? '#d9534f' : '#1f7a55',
      boxShadow: '0 8px 24px rgba(26, 49, 87, .18)',
      fontSize: '14px'
    });
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1800);
  };

  const isSaveButton = (target) => {
    const element = target instanceof Element ? target : target?.parentElement;
    const button = element?.closest('button, [role="button"], a');
    return button && (button.textContent || '').replace(/\s+/g, '').includes('保存');
  };

  document.addEventListener('click', (event) => {
    if (!isSaveButton(event.target)) return;
    const saved = saveState();
    showToast(saved ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器存储权限', !saved);
    window.dispatchEvent(new CustomEvent('frontend-architect:saved', { detail: window.__frontendArchitectSavedState }));
  }, true);

  window.addEventListener('beforeunload', saveState);
  window.setTimeout(restoreState, 0);
})();
