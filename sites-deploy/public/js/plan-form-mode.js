(() => {
  const page = document.querySelector('#planCanvasPage .plan-canvas-page');
  const header = page?.querySelector('.plan-editor-top');
  const canvas = page?.querySelector('.plan-canvas-body');
  const modeButtons = page?.querySelectorAll('.plan-mode-switch button');
  if (!page || !header || !canvas || !modeButtons?.length) return;

  modeButtons[0].dataset.planMode = 'canvas';
  modeButtons[1].dataset.planMode = 'form';
  const status = document.createElement('span');
  status.className = 'plan-form-status';
  status.textContent = '已启用';
  header.querySelector('.plan-title-text')?.before(status);
  const stepper = document.createElement('div');
  stepper.className = 'plan-form-stepper';
  stepper.innerHTML = '<button type="button" class="plan-form-step active" data-plan-form-step="basic"><i>1</i><span>基础配置</span></button><span class="plan-form-step-line"></span><button type="button" class="plan-form-step" data-plan-form-step="path"><i>2</i><span>路径设置</span></button>';
  header.append(stepper);

  const workspace = document.createElement('main');
  workspace.className = 'plan-form-workspace';
  workspace.hidden = true;
  workspace.innerHTML = `
    <section class="plan-form-panel" data-plan-form-panel="basic">
      <div class="plan-form-card">
        <div class="plan-form-field"><label class="required" for="formPlanName">方案名称</label><input id="formPlanName" maxlength="40"><span class="plan-form-counter" data-count-for="formPlanName">0 / 40</span><div class="plan-form-error" data-form-error="formPlanName"></div></div>
        <div class="plan-form-field"><label class="required" for="formPlanAlias">方案别名</label><div class="plan-form-help">在患者端显示该名称</div><input id="formPlanAlias" maxlength="40" value="泌尿系结石术后康复管理"><span class="plan-form-counter" data-count-for="formPlanAlias">10 / 40</span><div class="plan-form-error" data-form-error="formPlanAlias"></div></div>
        <div class="plan-form-field"><label for="formPlanDescription">方案描述</label><textarea id="formPlanDescription" maxlength="100"></textarea><span class="plan-form-counter" data-count-for="formPlanDescription">0 / 100</span></div>
        <div class="plan-form-field"><label class="required" for="formPlanTeam">所属团队</label><select id="formPlanTeam"><option value="">请选择团队</option><option selected>团队控糖管理团队</option><option>团队体验测试团队</option><option>团队妇产专班</option></select><div class="plan-form-error" data-form-error="formPlanTeam"></div></div>
        <div class="plan-form-field"><label class="required" for="formPlanProfile">患者画像</label><textarea id="formPlanProfile" maxlength="200">糖尿病合并高血压患者</textarea><span class="plan-form-counter" data-count-for="formPlanProfile">11 / 200</span><div class="plan-form-error" data-form-error="formPlanProfile"></div></div>
        <div class="plan-form-field"><label for="formPlanCourse">宣教课程</label><select id="formPlanCourse"><option>请选择</option><option selected>糖尿病与高血压联合管理课程</option><option>合理饮食与运动课程</option></select></div>
        <div class="plan-form-duration-fields">
          <div class="plan-form-field"><label class="required" for="formManagementPeriod">管理周期</label><div class="plan-form-duration"><input id="formManagementPeriod" type="number" min="1" max="999" value="30" aria-label="管理周期"><select id="formManagementPeriodUnit" aria-label="管理周期单位"><option selected>天</option><option>周</option><option>月</option><option>年</option></select></div><div class="plan-form-error" data-form-error="formManagementPeriod"></div></div>
        </div>
        <section class="plan-summary-block"><div class="plan-summary-head"><span>阶段总结</span><button type="button" class="plan-form-switch on" data-form-switch="summary" role="switch" aria-checked="true"><i></i></button></div><div class="plan-summary-list" data-summary-list><div class="plan-summary-item"><span class="plan-summary-icon">日</span><span class="plan-summary-copy"><strong>日报</strong><small>次日生成</small></span><button type="button" class="plan-form-switch on" data-form-switch="daily" role="switch" aria-checked="true"><i></i></button></div><div class="plan-summary-item"><span class="plan-summary-icon">周</span><span class="plan-summary-copy"><strong>周报</strong><small>次周一生成</small></span><button type="button" class="plan-form-switch on" data-form-switch="weekly" role="switch" aria-checked="true"><i></i></button></div><div class="plan-summary-item"><span class="plan-summary-icon">月</span><span class="plan-summary-copy"><strong>月报</strong><small>次月1号生成</small></span><button type="button" class="plan-form-switch on" data-form-switch="monthly" role="switch" aria-checked="true"><i></i></button></div></div></section>
      </div>
    </section>
    <section class="plan-path-panel" data-plan-form-panel="path" hidden>
      <div class="plan-path-baseline"><span>各任务开始时间以患者</span><select id="formPlanBaseline"><option selected>最近入组时间</option><option>出院时间</option><option>手术时间</option></select><span>作为基准时间</span></div>
      <div class="plan-path-list" id="planPathList"></div>
      <button type="button" class="plan-path-add" data-add-path-task>＋ 添加任务</button>
    </section>`;
  page.append(workspace);

  const tasks = [
    { type: '随访量表', name: '术后恢复评估量表', content: '术后高血压控制评估量表（患者端）', start: 1, unit: '天', end: 1, repeat: false },
    { type: '健康宣教', name: '饮水与饮食指导手册', content: '饮水与饮食指导手册', start: 1, unit: '天', end: 12, repeat: false }
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function renderTasks() {
    const list = document.getElementById('planPathList');
    list.innerHTML = tasks.map((task, index) => `<article class="plan-path-card" data-path-task="${index}"><span class="plan-path-index">${index + 1}</span><select class="plan-path-type" data-task-key="type"><option ${task.type === '随访量表' ? 'selected' : ''}>随访量表</option><option ${task.type === '健康宣教' ? 'selected' : ''}>健康宣教</option><option ${task.type === '健康提醒' ? 'selected' : ''}>健康提醒</option></select><div class="plan-path-field"><label>任务名称</label><div class="plan-path-name-wrap"><input maxlength="40" data-task-key="name" value="${esc(task.name)}"><span>${task.name.length} / 40</span></div></div><div class="plan-path-field"><label>任务内容</label><select data-task-key="content"><option>${esc(task.content)}</option><option>请选择任务内容</option><option>血糖血压联合随访量表</option><option>合理饮食与运动宣教</option></select></div><div class="plan-path-field"><label>任务周期</label><div class="plan-path-period"><span>计划启动后第</span><input type="number" min="0" max="999" data-task-key="start" value="${task.start}"><select data-task-key="unit"><option ${task.unit === '天' ? 'selected' : ''}>天</option><option ${task.unit === '周' ? 'selected' : ''}>周</option><option ${task.unit === '月' ? 'selected' : ''}>月</option></select><span>任务开始</span><input type="number" min="1" max="999" data-task-key="end" value="${task.end}"><span>天后任务结束</span></div></div><div class="plan-path-repeat"><span>重复执行：</span><button type="button" class="plan-form-switch ${task.repeat ? 'on' : ''}" data-task-repeat role="switch" aria-checked="${task.repeat}"><i></i></button><button type="button" class="plan-path-delete" data-delete-path-task ${tasks.length === 1 ? 'disabled' : ''}>删除任务</button></div></article>`).join('');
  }
  renderTasks();

  function syncFromCanvas() {
    const name = document.getElementById('planNameInput')?.value || document.getElementById('generatedPlanTitle')?.textContent || '';
    const description = document.getElementById('planDescInput')?.value || '';
    document.getElementById('formPlanName').value = name;
    document.getElementById('formPlanDescription').value = description.slice(0, 100);
    document.getElementById('formManagementPeriod').value = document.getElementById('planManagementPeriod')?.value || '';
    document.getElementById('formManagementPeriodUnit').value = document.getElementById('planManagementPeriodUnit')?.value || '天';
    workspace.querySelectorAll('[maxlength]').forEach(input => updateCounter(input));
  }

  function syncToCanvas() {
    const pairs = [['formPlanName', 'planNameInput'], ['formPlanDescription', 'planDescInput'], ['formManagementPeriod', 'planManagementPeriod'], ['formManagementPeriodUnit', 'planManagementPeriodUnit']];
    pairs.forEach(([from, to]) => { const source = document.getElementById(from); const target = document.getElementById(to); if (source && target) target.value = source.value; });
    const title = document.getElementById('generatedPlanTitle');
    if (title) title.textContent = document.getElementById('formPlanName').value.trim() || '方案名称';
  }

  function updateCounter(input) {
    const counter = workspace.querySelector(`[data-count-for="${input.id}"]`);
    if (counter) counter.textContent = `${input.value.length} / ${input.maxLength}`;
  }

  function setMode(mode) {
    const formMode = mode === 'form';
    page.classList.toggle('form-mode', formMode);
    workspace.hidden = !formMode;
    canvas.hidden = formMode;
    modeButtons.forEach(button => button.classList.toggle('active', button.dataset.planMode === mode));
    if (formMode) syncFromCanvas(); else syncToCanvas();
  }

  function setStep(step) {
    workspace.querySelectorAll('[data-plan-form-panel]').forEach(panel => { panel.hidden = panel.dataset.planFormPanel !== step; });
    stepper.querySelectorAll('[data-plan-form-step]').forEach(button => {
      const active = button.dataset.planFormStep === step;
      button.classList.toggle('active', active);
      button.classList.toggle('done', step === 'path' && button.dataset.planFormStep === 'basic');
      button.querySelector('i').textContent = button.classList.contains('done') ? '✓' : (button.dataset.planFormStep === 'basic' ? '1' : '2');
    });
  }

  function validateFormMode() {
    const required = ['formPlanName', 'formPlanAlias', 'formPlanTeam', 'formPlanProfile'];
    let firstInvalid = null;
    required.forEach(id => {
      const input = document.getElementById(id);
      const valid = Boolean(input.value.trim());
      input.setAttribute('aria-invalid', String(!valid));
      const error = workspace.querySelector(`[data-form-error="${id}"]`);
      if (error) error.textContent = valid ? '' : '此项为必填项';
      if (!valid && !firstInvalid) firstInvalid = input;
    });
    const periodInputs = [
      [document.getElementById('formManagementPeriod'), '请输入管理周期']
    ];
    periodInputs.forEach(([input, message]) => {
      const valid = /^\d{1,3}$/.test(input.value) && Number(input.value) >= 1;
      input.setAttribute('aria-invalid', String(!valid));
      workspace.querySelector(`[data-form-error="${input.id}"]`).textContent = valid ? '' : `${message}（1至999）`;
      if (!valid && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) { setStep('basic'); firstInvalid.focus(); window.showToast?.('请完善基础配置中的必填项'); return false; }
    const invalidTask = tasks.findIndex(task => !task.name.trim() || !task.content.trim() || task.content.startsWith('请选择'));
    if (invalidTask >= 0) { setStep('path'); document.querySelector(`[data-path-task="${invalidTask}"] input`)?.focus(); window.showToast?.('请完善路径任务信息'); return false; }
    syncToCanvas();
    return true;
  }

  window.validatePlanFormMode = validateFormMode;

  const legacyValidate = window.validatePlanDurationFields;
  window.validatePlanDurationFields = () => workspace.hidden ? (legacyValidate?.() ?? true) : validateFormMode();

  document.addEventListener('click', event => {
    if (workspace.hidden || !event.target.closest('[data-save-plan]')) return;
    if (validateFormMode()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener('click', event => {
    const mode = event.target.closest('[data-plan-mode]');
    if (mode) { setMode(mode.dataset.planMode); return; }
    const step = event.target.closest('[data-plan-form-step]');
    if (step) { setStep(step.dataset.planFormStep); return; }
    const toggle = event.target.closest('.plan-form-switch');
    if (toggle) {
      const on = !toggle.classList.contains('on');
      toggle.classList.toggle('on', on); toggle.setAttribute('aria-checked', String(on));
      if (toggle.dataset.formSwitch === 'summary') workspace.querySelector('[data-summary-list]').hidden = !on;
      const card = toggle.closest('[data-path-task]'); if (card && toggle.hasAttribute('data-task-repeat')) tasks[Number(card.dataset.pathTask)].repeat = on;
      return;
    }
    if (event.target.closest('[data-add-path-task]')) { tasks.push({ type: '随访量表', name: '', content: '请选择任务内容', start: 1, unit: '天', end: 1, repeat: false }); renderTasks(); return; }
    const remove = event.target.closest('[data-delete-path-task]');
    if (remove && tasks.length > 1) { tasks.splice(Number(remove.closest('[data-path-task]').dataset.pathTask), 1); renderTasks(); }
  });

  workspace.addEventListener('input', event => {
    const input = event.target;
    if (input.matches('[maxlength]')) updateCounter(input);
    if (input.matches('#formManagementPeriod')) {
      input.value = input.value.replace(/\D/g, '').slice(0, 3);
      const error = workspace.querySelector(`[data-form-error="${input.id}"]`);
      if (error) error.textContent = '';
    }
    input.removeAttribute('aria-invalid');
    const card = input.closest('[data-path-task]');
    if (card && input.dataset.taskKey) { tasks[Number(card.dataset.pathTask)][input.dataset.taskKey] = input.type === 'number' ? Number(input.value) : input.value; const count = input.parentElement.querySelector('span'); if (input.dataset.taskKey === 'name' && count) count.textContent = `${input.value.length} / 40`; }
  });
  workspace.addEventListener('change', event => {
    const control = event.target; const card = control.closest('[data-path-task]');
    if (card && control.dataset.taskKey) tasks[Number(card.dataset.pathTask)][control.dataset.taskKey] = control.value;
  });
})();
