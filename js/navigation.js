function activatePage(pageId) {
  document.querySelectorAll('.page.active').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId)?.classList.add('active');
}

function openPlanAiPage() {
  const prompt = document.getElementById('planAiPrompt');
  if (prompt) prompt.value = '';
  document.querySelector('[data-generate-plan]')?.classList.remove('ready');
  activatePage('planAiPage');
}

function buildPlanFromPrompt() {
  const prompt = document.getElementById('planAiPrompt')?.value.trim() || '';
  const title = prompt.includes('糖尿病') ? '糖尿病合并高血压综合健康管理方案' : '泌尿系结石术后随访健康管理方案';
  const desc = prompt || '针对泌尿系结石术后患者设计的标准化随访方案，聚焦尿量、尿液性状、腰腹疼痛、血尿等关键恢复指标，提供科学饮水、饮食调整、运动指导与定期影像复查建议。';
  document.getElementById('generatedPlanTitle').textContent = title;
  document.getElementById('planNameInput').value = title;
  document.getElementById('planDescInput').value = desc;
  activatePage('planCanvasPage');
}

function exitPlanEditor() {
  activatePage('listPage');
  showListView('plans');
}

function validatePlanDurationFields() {
  const fields = [
    ['planManagementPeriod', 'planManagementPeriodError', '请输入管理周期'],
    ['planTaskExtensionPeriod', 'planTaskExtensionPeriodError', '请输入任务延续期']
  ];
  let firstInvalid = null;
  fields.forEach(([inputId, errorId, emptyMessage]) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const value = input?.value.trim() || '';
    const valid = /^\d{1,3}$/.test(value) && Number(value) >= 1 && Number(value) <= 999;
    input?.setAttribute('aria-invalid', String(!valid));
    if (error) error.textContent = valid ? '' : (value ? '请输入1至999之间的整数' : emptyMessage);
    if (!valid && !firstInvalid) firstInvalid = input;
  });
  if (!firstInvalid) return true;
  const infoTab = document.querySelector('[data-plan-tab="info"]');
  document.querySelectorAll('[data-plan-tab]').forEach(button => button.classList.toggle('active', button === infoTab));
  document.querySelectorAll('[data-plan-tab-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.planTabPanel === 'info'));
  firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
  firstInvalid.focus();
  showToast('请完善管理周期和任务延续期');
  return false;
}

document.addEventListener('input', event => {
  const input = event.target.closest('#planManagementPeriod, #planTaskExtensionPeriod');
  if (!input) return;
  input.value = input.value.replace(/\D/g, '').slice(0, 3);
  input.removeAttribute('aria-invalid');
  const errorId = input.getAttribute('aria-describedby');
  if (errorId) document.getElementById(errorId)?.replaceChildren();
});
