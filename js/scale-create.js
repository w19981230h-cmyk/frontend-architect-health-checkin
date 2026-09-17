(function () {
  const institutions = [
    '南宁市第二人民医院',
    '南宁市第五人民医院',
    '南宁市妇幼保健院',
    '南宁中医医院',
    '南宁市第一人民医院',
    '柳州市人民医院',
    '桂林市人民医院'
  ];

  const markup = `
    <div class="scale-create-mask" id="scaleCreateModal" aria-hidden="true">
      <section class="scale-create-dialog" role="dialog" aria-modal="true" aria-labelledby="scaleCreateTitle">
        <header class="scale-create-head">
          <h2 id="scaleCreateTitle">新建量表</h2>
          <button type="button" class="scale-create-close" data-scale-create-close aria-label="关闭">×</button>
        </header>
        <form id="scaleCreateForm" novalidate>
          <div class="scale-create-body">
            <div class="scale-create-field">
              <label class="scale-create-label required" for="scaleCreateName">量表名称</label>
              <div class="scale-create-input-wrap">
                <input class="scale-create-input" id="scaleCreateName" maxlength="100" placeholder="请输入" autocomplete="off" aria-describedby="scaleCreateNameError">
                <span class="scale-create-count" id="scaleCreateCount">0 / 100</span>
              </div>
              <div class="scale-create-error" id="scaleCreateNameError" aria-live="polite"></div>
            </div>
            <div class="scale-create-field">
              <label class="scale-create-label required" for="scaleCreateScope">适用范围</label>
              <select class="scale-create-select" id="scaleCreateScope" aria-describedby="scaleCreateScopeError">
                <option value="" selected disabled>请选择适用范围</option>
                <option value="hospital">全院通用</option>
                ${institutions.map(name => `<option value="institution:${name}">${name}</option>`).join('')}
              </select>
              <div class="scale-create-error" id="scaleCreateScopeError" aria-live="polite"></div>
            </div>
          </div>
          <footer class="scale-create-foot">
            <button type="button" class="scale-create-btn" data-scale-create-close>取消</button>
            <button type="submit" class="scale-create-btn primary">确定</button>
          </footer>
        </form>
      </section>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', markup);

  const modal = document.getElementById('scaleCreateModal');
  const form = document.getElementById('scaleCreateForm');
  const nameInput = document.getElementById('scaleCreateName');
  const count = document.getElementById('scaleCreateCount');
  const nameError = document.getElementById('scaleCreateNameError');
  const scopeError = document.getElementById('scaleCreateScopeError');
  const scopeSelect = document.getElementById('scaleCreateScope');
  let returnFocus = null;

  function selectedScope() {
    return scopeSelect.value;
  }

  function clearErrors() {
    nameError.textContent = '';
    scopeError.textContent = '';
    nameInput.removeAttribute('aria-invalid');
    scopeSelect.removeAttribute('aria-invalid');
  }

  function openModal(trigger) {
    returnFocus = trigger || document.activeElement;
    form.reset();
    count.textContent = '0 / 100';
    clearErrors();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => nameInput.focus());
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    returnFocus?.focus?.();
  }

  function validate() {
    clearErrors();
    const name = nameInput.value.trim();
    const scope = selectedScope();
    if (!name) {
      nameError.textContent = '请输入量表名称';
      nameInput.setAttribute('aria-invalid', 'true');
    }
    if (!scope) {
      scopeError.textContent = '请选择适用范围';
      scopeSelect.setAttribute('aria-invalid', 'true');
    }
    if (!name) nameInput.focus();
    else if (!scope) scopeSelect.focus();
    return Boolean(name && scope);
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-create-scale]');
    if (trigger) {
      event.preventDefault();
      openModal(trigger);
      return;
    }
    if (event.target.closest('[data-scale-create-close]')) closeModal();
  });

  modal.addEventListener('mousedown', event => {
    if (event.target === modal) closeModal();
  });

  form.addEventListener('change', event => {
    if (event.target !== scopeSelect) return;
    scopeError.textContent = '';
    scopeSelect.removeAttribute('aria-invalid');
  });

  nameInput.addEventListener('input', () => {
    count.textContent = `${nameInput.value.length} / 100`;
    if (nameInput.value.trim()) {
      nameError.textContent = '';
      nameInput.removeAttribute('aria-invalid');
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate()) return;
    const isHospitalWide = selectedScope() === 'hospital';
    const selectedLabel = scopeSelect.selectedOptions[0]?.textContent || '';
    const draft = {
      name: nameInput.value.trim(),
      scopeType: isHospitalWide ? 'hospital' : 'institution',
      scopeLabel: selectedLabel,
      organization: isHospitalWide ? '' : selectedLabel
    };
    window.currentScaleDraft = draft;
    try { sessionStorage.setItem('scale-create-draft', JSON.stringify(draft)); } catch (_) {}
    closeModal();
    if (typeof window.openBuilder === 'function') window.openBuilder(draft.name);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
