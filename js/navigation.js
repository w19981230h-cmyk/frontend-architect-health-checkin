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
