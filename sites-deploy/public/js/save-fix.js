(() => {
  const STORAGE_KEY = 'frontend-architect:save-state';

  const storage = (() => {
    try {
      const testKey = '__frontend_architect_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch (error) {
      return null;
    }
  })();

  const collectState = () => ({
    savedAt: new Date().toISOString(),
    hash: window.location.hash,
    fields: [...document.querySelectorAll('input, select, textarea')].map((element, index) => ({
      key: element.name || element.id || `${element.tagName.toLowerCase()}-${index}`,
      value: element.value,
      checked: Boolean(element.checked)
    }))
  });

  const showToast = (message, isError = false) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '99999',
      padding: '10px 18px',
      borderRadius: '6px',
      color: '#fff',
      background: isError ? '#e55353' : '#1f7a55',
      boxShadow: '0 8px 24px rgba(26, 49, 87, .18)',
      fontSize: '14px'
    });
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1800);
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button, [role="button"], a');
    if (!button || !(button.textContent || '').replace(/\s+/g, '').includes('保存')) return;

    try {
      const payload = collectState();
      if (!storage) throw new Error('localStorage is unavailable');
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent('frontend-architect:saved', { detail: payload }));
      showToast('保存成功');
    } catch (error) {
      console.error('[frontend-architect] save failed', error);
      showToast('保存失败，请检查浏览器存储权限', true);
    }
  }, true);
})();
