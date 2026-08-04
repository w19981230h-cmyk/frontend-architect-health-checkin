(() => {
  if (window.__frontendArchitectSaveRecoveryBound) return;
  window.__frontendArchitectSaveRecoveryBound = true;

  const STORAGE_KEY = 'frontend-architect:save-state:v2';
  const WINDOW_PREFIX = 'frontend-architect-saved:';

  const getControls = () => [...document.querySelectorAll('input, select, textarea')].map((element, index) => ({
    key: element.name || element.id || `${element.tagName.toLowerCase()}-${index}`,
    value: element.value,
    checked: Boolean(element.checked)
  }));

  const collectState = () => ({
    savedAt: new Date().toISOString(),
    url: window.location.href,
    hash: window.location.hash,
    controls: getControls(),
    cards: [...document.querySelectorAll('[data-card-id], [data-card-type], [data-indicator]')].map((element) => ({
      id: element.dataset.cardId || '',
      type: element.dataset.cardType || '',
      indicator: element.dataset.indicator || '',
      text: (element.textContent || '').replace(/\s+/g, ' ').trim()
    }))
  });

  const persist = (payload) => {
    let persisted = false;
    const serialized = JSON.stringify(payload);

    try {
      window.localStorage.setItem(STORAGE_KEY, serialized);
      persisted = true;
    } catch (error) {
      console.warn('[frontend-architect] localStorage unavailable', error);
    }

    try {
      window.sessionStorage.setItem(STORAGE_KEY, serialized);
      persisted = true;
    } catch (error) {
      console.warn('[frontend-architect] sessionStorage unavailable', error);
    }

    try {
      window.name = `${WINDOW_PREFIX}${serialized}`;
      persisted = true;
    } catch (error) {
      console.warn('[frontend-architect] window.name unavailable', error);
    }

    window.__frontendArchitectSavedState = payload;
    return persisted;
  };

  const showToast = (message, failed = false) => {
    const oldToast = document.getElementById('frontend-architect-save-toast');
    if (oldToast) oldToast.remove();

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
      background: failed ? '#e55353' : '#1f7a55',
      boxShadow: '0 8px 24px rgba(26, 49, 87, .18)',
      fontSize: '14px'
    });
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1800);
  };

  const isSaveTarget = (target) => {
    const button = target.closest('button, [role="button"], a');
    return button && (button.textContent || '').replace(/\s+/g, '').includes('保存');
  };

  document.addEventListener('click', (event) => {
    if (!isSaveTarget(event.target)) return;

    const payload = collectState();
    const persisted = persist(payload);
    showToast(persisted ? '保存成功' : '已保存到当前页面');
    window.dispatchEvent(new CustomEvent('frontend-architect:saved', { detail: payload }));
  }, true);
})();
