function renderList() {
  document.getElementById('scaleRows').innerHTML = scaleRows.map((r, i) => {
    const statusClass = r[7] === '已发布' ? 'published' : 'unpublished';
    return `<tr data-open-editor class="${r[9] ? 'child' : ''}">
      <td><span class="name-cell"><i class="triangle ${r[9] ? 'right' : (i < 4 ? 'down' : 'right')}"></i><span>${r[0]}</span></span></td>
      <td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td>
      <td><span class="status ${statusClass}"><i class="dot"></i>${r[7]}</span></td><td><span class="switch ${r[8] ? 'on' : ''}"></span></td>
      <td><span class="actions"><span class="link">编辑</span><span class="more">...</span></span></td>
    </tr>`;
  }).join('');
}

function renderIndicatorList() {
  const keyword = indicatorState.keyword.trim().toLowerCase();
  const rows = indicatorTemplates.filter(item => !keyword || item.name.toLowerCase().includes(keyword));
  document.getElementById('indicatorCards').innerHTML = rows.length ? rows.map(item => `<article class="dashboard-card" data-preview-indicator="${item.id}" tabindex="0" role="button" aria-label="预览${esc(item.name)}">
    <div class="dashboard-card-head">
      <span class="dashboard-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 19V9M12 19V5M19 19v-7"/><path d="M3 19h18"/></svg></span>
      <h3 class="dashboard-name" title="${esc(item.name)}">${esc(item.name)}</h3>
      <span class="dashboard-status ${item.published ? 'published' : 'draft'}">${item.published ? '发布' : '未发布'}</span>
    </div>
    <dl class="dashboard-info"><dt>适用条件：</dt><dd>${esc(item.applicableProfile)}</dd></dl>
    <div class="dashboard-card-foot">
      <button class="dashboard-action" data-edit-indicator="${item.id}">编辑</button>
      <div class="dashboard-more">
        <button class="dashboard-more-trigger" data-dashboard-more aria-expanded="false">更多<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></button>
        <div class="dashboard-menu">
          <button data-toggle-indicator-status="${item.id}">${item.published ? '撤销发布' : '发布'}</button>
          <button class="danger" data-delete-indicator="${item.id}">删除</button>
        </div>
      </div>
    </div>
  </article>`).join('') : '<div class="dashboard-empty">暂无符合条件的指标看板</div>';
}

function renderPatientList() {
  const keyword = patientListState.keyword.trim().toLowerCase();
  const rows = allPatients.filter(patient => {
    const matchesKeyword = !keyword || [patient.name, patient.visitNo, patient.phone].some(value => value.toLowerCase().includes(keyword));
    const matchesTeam = !patientListState.team || patient.team === patientListState.team;
    return matchesKeyword && matchesTeam;
  });
  document.getElementById('patientListRows').innerHTML = rows.length ? rows.map(patient => `<tr data-patient-row="${esc(patient.visitNo)}">
    <td class="patient-name-col">${esc(patient.name)}</td><td>${esc(patient.visitNo)}</td><td>${esc(patient.age)}岁</td><td>${esc(patient.gender)}</td>
    <td><span class="patient-phone-mask">${esc(patient.phone)} <span class="patient-phone-eye">⌁</span></span></td><td>${esc(patient.department)}</td>
    <td class="patient-diagnosis" title="${esc(patient.diagnosis)}">${esc(patient.diagnosis)}</td><td>${esc(patient.visitDate)}</td><td title="${esc(patient.team)}">${esc(patient.team)}</td>
    <td><span class="patient-row-actions"><button data-open-patient-record="${esc(patient.visitNo)}">档案</button><button data-select-patient-group="${esc(patient.visitNo)}">选择分组</button></span></td>
  </tr>`).join('') : `<tr><td colspan="10" style="height:220px;text-align:center;color:#9aa5b4">暂无符合条件的患者</td></tr>`;
}

function showListView(view) {
  const isPlans = view === 'plans';
  const isScale = view === 'scale';
  const isIndicator = view === 'indicator';
  const isPatients = view === 'patients';
  document.getElementById('planManagementView').classList.toggle('active', isPlans);
  document.getElementById('scaleManagementView').classList.toggle('active', isScale);
  document.getElementById('indicatorTemplateView').classList.toggle('active', isIndicator);
  document.getElementById('patientListView').classList.toggle('active', isPatients);
  document.getElementById('listPageTitle').textContent = isPatients ? '全部患者' : isIndicator ? '指标模板' : isScale ? '量表管理' : '方案管理';
  document.querySelectorAll('[data-list-view]').forEach(item => item.classList.toggle('active', item.dataset.listView === view));
  if (isIndicator) renderIndicatorList();
  if (isPatients) renderPatientList();
}
