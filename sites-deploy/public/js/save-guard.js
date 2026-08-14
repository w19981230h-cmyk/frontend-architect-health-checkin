(() => {
  if (window.__frontendArchitectSaveGuardBound) return;
  window.__frontendArchitectSaveGuardBound = true;

  const KEY = 'frontend-architect:latest-save:v5';

  const collect = () => ({
    savedAt: new Date().toISOString(),
    hash: window.location.hash,
    controls: [...document.querySelectorAll('input, select, textarea')].map((el, index) => ({
      key: el.name || el.id || `${el.tagName.toLowerCase()}-${index}`,
      value: el.value,
      checked: Boolean(el.checked)
    }))
  });

  const persist = (state) => {
    const serialized = JSON.stringify(state);
    let stored = false;

    try {
      localStorage.setItem(KEY, serialized);
      stored = true;
    } catch (error) {
      console.warn('[save] localStorage unavailable', error);
    }

    try {
      sessionStorage.setItem(KEY, serialized);
      stored = true;
    } catch (error) {
      console.warn('[save] sessionStorage unavailable', error);
    }

    window.__frontendArchitectSavedState = state;
    return stored;
  };

  const toast = (message, failed = false) => {
    document.getElementById('frontend-architect-save-toast')?.remove();
    const node = document.createElement('div');
    node.id = 'frontend-architect-save-toast';
    node.textContent = message;
    Object.assign(node.style, {
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
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 1800);
  };

  const isSaveButton = (target) => {
    const element = target instanceof Element ? target : target?.parentElement;
    const button = element?.closest('button, [role="button"], a');
    return button && /保存/.test((button.textContent || '').replace(/\s+/g, ''));
  };

  document.addEventListener('click', (event) => {
    if (!isSaveButton(event.target)) return;
    const state = collect();
    const stored = persist(state);
    toast(stored ? '保存成功' : '已记录当前配置，但浏览器未开放持久化存储', !stored);
    window.dispatchEvent(new CustomEvent('frontend-architect:saved', { detail: state }));
  }, true);

  window.addEventListener('beforeunload', () => persist(collect()));
})();
