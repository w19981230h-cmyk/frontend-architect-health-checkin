(() => {
  if (window.__frontendArchitectSavePersistenceBound) return;
  window.__frontendArchitectSavePersistenceBound = true;

  const key = 'frontend-architect:latest-save:v1';

  const collect = () => ({
    savedAt: new Date().toISOString(),
    hash: window.location.hash,
    controls: [...document.querySelectorAll('input, select, textarea')].map((el, index) => ({
      key: el.name || el.id || `${el.tagName.toLowerCase()}-${index}`,
      value: el.value,
      checked: Boolean(el.checked)
    })),
    cards: [...document.querySelectorAll('[data-card-id], [data-card-type], [data-indicator]')].map((el) => ({
      id: el.dataset.cardId || '',
      type: el.dataset.cardType || '',
      indicator: el.dataset.indicator || '',
      text: (el.textContent || '').replace(/\s+/g, ' ').trim()
    }))
  });

  const persist = (state) => {
    const serialized = JSON.stringify(state);
    let saved = false;
    try { localStorage.setItem(key, serialized); saved = true; } catch (error) { console.warn(error); }
    try { sessionStorage.setItem(key, serialized); saved = true; } catch (error) { console.warn(error); }
    window.__frontendArchitectSavedState = state;
    return saved;
  };

  const toast = (message) => {
    document.getElementById('frontend-architect-save-toast')?.remove();
    const el = document.createElement('div');
    el.id = 'frontend-architect-save-toast';
    el.textContent = message;
    Object.assign(el.style, {
      position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 100000,
      padding: '10px 18px', borderRadius: '6px', color: '#fff', background: '#1f7a55',
      boxShadow: '0 8px 24px rgba(26, 49, 87, .18)', fontSize: '14px'
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  };

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const button = target?.closest('button, [role="button"], a');
    if (!button || !(button.textContent || '').replace(/\s+/g, '').includes('保存')) return;
    const state = collect();
    toast(persist(state) ? '保存成功' : '已保存到当前页面');
    window.dispatchEvent(new CustomEvent('frontend-architect:saved', { detail: state }));
  }, true);
})();
