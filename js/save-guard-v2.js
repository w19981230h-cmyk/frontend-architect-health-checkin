(() => {
  if (window.__frontendArchitectSaveGuardV2) return;
  window.__frontendArchitectSaveGuardV2 = true;

  const STORAGE_KEY = 'frontend-architect:page-state:v2';

  const getKey = (element, index) =>
    element.name || element.id || `${element.tagName.toLowerCase()}-${index}`;

  const collect = () => ({
    savedAt: new Date().toISOString(),
    hash: window.location.hash,
    controls: [...document.querySelectorAll('input, select, textarea')].map((element, index) => ({
      key: getKey(element, index),
      value: element.value,
      checked: Boolean(element.checked)
    }))
  });

  const write = (state) => {
    const serialized = JSON.stringify(state);
    let written = false;
    for (const storage of [window.localStorage, window.sessionStorage]) {
      try {
        storage.setItem(STORAGE_KEY, serialized);
        written = true;
      } catch (error) {
        console.warn('[save-guard] browser storage unavailable', error);
      }
    }
    window.__frontendArchitectSavedState = state;
    return written;
  };

  const read = () => {
    for (const storage of [window.localStorage, window.sessionStorage]) {
      try {
        const value = storage.getItem(STORAGE_KEY);
        if (value) return JSON.parse(value);
      } catch (error) {
        console.warn('[save-guard] saved state unavailable', error);
      }
    }
    return null;
  };

  const restore = () => {
    const state = read();
    if (!state?.controls?.length) return;
    const controls = [...document.querySelectorAll('input, select, textarea')];
    state.controls.forEach((saved, index) => {
      const element = controls.find((candidate, candidateIndex) =>
        getKey(candidate, candidateIndex) === saved.key
      ) || controls[index];
      if (!element) return;
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = saved.checked;
      } else if (saved.value !== undefined) {
        element.value = saved.value;
      }
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
    const saved = write(collect());
    showToast(saved ? '保存成功，刷新后仍会保留' : '保存失败，请检查浏览器存储权限', !saved);
  }, true);

  window.addEventListener('beforeunload', () => write(collect()));
  window.setTimeout(restore, 300);
})();
