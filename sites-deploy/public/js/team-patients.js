(function () {
  const patients = [
    { id: '9935669', name: '钟云文', gender: '男', age: 49, phone: '138****4378', source: '智能分组', date: '2026/09/16', tags: ['正在接受降压治疗', '高血压病史', '频发室性早搏'], state: 'pending', suggestion: '患者为中年男性，因频发室性早搏伴T波改变及肺动脉瓣轻度返流就诊，提示存在心律失常及潜在心血管风险；从门诊病历中识别到患者正在接受奥美沙坦酯片20mg每日一次的降压治疗，符合高血压管理团队中“正在接受降压药物治疗”的入组条件；结合当前主要监测血压控制情况及评估其对心脏影响的干预目标，建议分配至高血压管理团队进行持续管理。' },
    { id: '9922269', name: '潘淑玲', gender: '女', age: 58, phone: '137****6962', source: '智能分组', date: '2026/09/16', tags: ['降压药物治疗'], state: 'pending', suggestion: '患者为58岁女性，有长期服用降压药物史，提示存在高血压病史并伴潜在靶器官损害风险；从病历中识别到患者自述“高血压服药中”，符合当前随访组中“正在接受降压药物治疗”的纳入条件；结合当前主要监测血压控制情况与评估心血管风险的目标，建议分配至高血压管理团队进行持续管理。' },
    { id: '9800536', name: '罗朋英', gender: '女', age: 76, phone: '135****8080', source: '智能分组', date: '2026/09/15', tags: ['高龄', '既往高血压病史'], state: 'pending', suggestion: '患者为76岁老年女性，有明确高血压病史，当前因眩晕复诊并伴口干、腰酸、舌脉异常等表现，提示血压控制可能不稳定且存在脑血管事件风险；从病历记录中识别到患者既往有高血压病史，符合高血压管理团队中“既往有高血压病史记录”的入组条件；结合当前主要监测血压变化、评估眩晕与血压关联性及预防心脑血管并发症的干预目标，建议分配至高血压管理团队进行持续管理。' },
    { id: '9934110', name: '李信良', gender: '男', age: 82, phone: '138****2888', source: '智能分组', date: '2026/09/15', tags: ['高血压病史', '冠心病', '高龄'], state: 'pending', suggestion: '患者为82岁高龄男性，合并冠心病、糖尿病等多重慢性疾病，提示心血管风险显著升高；从门诊病历中明确识别到高血压与冠心病病史，符合高血压管理团队中既往有高血压病史且合并动脉粥样硬化性心血管疾病的入组条件；结合当前主要的血压监测与心血管事件预防目标，建议分配至高血压管理团队，并推荐高血压合并ASCVD或心衰管理进行持续管理。' },
    { id: '9893038', name: '王勇珍', gender: '女', age: 41, phone: '139****7184', source: '智能分组', date: '2026/09/15', tags: ['正在接受降压治疗', '高血压', '心衰'], state: 'pending', suggestion: '患者为41岁女性，确诊原发性高血压并伴有心衰病史，提示存在显著的心血管复合风险；从门诊病历中识别到明确的原发性高血压诊断记录及正在服用苯磺酸左氨氯地平片与厄贝沙坦片的降压治疗方案，已满足高血压管理团队中“已确诊高血压并正在接受降压药物治疗”的入组条件，同时既往心衰病史进一步支持其符合合并心衰的管理需求；结合当前主要的血压控制与心衰风险监测目标，建议分配至高血压管理团队，并推荐高血压合并ASCVD或心衰管理进行持续管理。' },
    { id: '9798301', name: '张新春', gender: '男', age: 49, phone: '188****5028', source: '智能分组', date: '2026/09/15', tags: ['正在接受降压治疗', '原发性高血压'], state: 'pending', suggestion: '患者为49岁男性，确诊原发性高血压，同时启动三种降压药物联合治疗并加用他汀类药物，提示存在较高心血管风险；从门诊病历中识别到明确的高血压诊断记录及当前正在服用奥美沙坦酯、苯磺酸左氨氯地平和吲达帕胺等降压药物，符合高血压管理团队中“正在接受降压药物治疗”的入组条件；结合当前主要的血压控制监测与药物安全评估目标，建议分配至高血压管理团队进行持续管理。' },
    { id: '9706218', name: '陈惠芳', gender: '女', age: 63, phone: '136****0916', source: '医生转入', date: '2026/09/14', tags: ['高血压', '血脂异常'], state: 'pending', suggestion: '患者近期血压波动并合并血脂异常，需要连续记录家庭血压、复核用药依从性并评估整体心血管风险。现有资料符合高血压管理团队的接收标准，建议纳入管理。' },
    { id: '9691534', name: '赵明山', gender: '男', age: 55, phone: '137****8125', source: '患者申请', date: '2026/09/14', tags: ['高血压病史', '肥胖'], state: 'pending', suggestion: '患者主动申请健康管理，既往有高血压病史且体重超标，存在进一步心血管风险。建议纳入团队，重点开展血压、体重和生活方式联合干预。' },
    { id: '9668402', name: '周桂兰', gender: '女', age: 68, phone: '159****4206', source: '智能分组', date: '2026/09/13', tags: ['高龄', '高血压', '糖尿病'], state: 'pending', suggestion: '患者合并高血压与糖尿病，属于心血管高风险人群。建议入组后持续监测血压、血糖及用药安全，并建立异常指标预警。' },
    { id: '9653127', name: '黄建国', gender: '男', age: 60, phone: '135****7319', source: '医生转入', date: '2026/09/13', tags: ['原发性高血压'], state: 'pending', suggestion: '患者原发性高血压诊断明确，近期门诊调整降压方案，需要观察疗效及不良反应。建议进入团队完成短期强化随访。' },
    { id: '9629841', name: '刘秋月', gender: '女', age: 52, phone: '138****2064', source: '智能分组', date: '2026/09/12', tags: ['正在接受降压治疗'], state: 'pending', suggestion: '患者正在规律接受降压治疗，最近家庭血压记录存在波动。符合团队药物治疗人群接收条件，建议入组后完善用药评估。' },
    { id: '9587210', name: '吴志强', gender: '男', age: 45, phone: '186****1480', source: '患者申请', date: '2026/09/12', tags: ['高血压', '吸烟'], state: 'pending', suggestion: '患者高血压并有吸烟史，心血管危险因素叠加。建议纳入团队开展血压管理、戒烟支持和风险教育。' },
    { id: '9564308', name: '何玉珍', gender: '女', age: 71, phone: '152****8693', source: '智能分组', date: '2026/09/11', tags: ['高龄', '高血压病史'], state: 'pending', suggestion: '患者年龄较高且有长期高血压病史，需要加强体位性低血压、跌倒风险及用药安全监测，建议纳入持续管理。' },
    { id: '9481206', name: '孙文华', gender: '男', age: 66, phone: '133****5217', source: '医生转入', date: '2026/09/08', tags: ['血压控制达标'], state: 'exited', suggestion: '患者阶段性管理目标已完成，近期血压稳定、用药方案明确，已按计划出组并转为常规复诊。' }
  ];

  const state = { tab: 'pending', keyword: '', source: '', page: 1, pageSize: 20 };
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

  function filteredPatients() {
    const keyword = state.keyword.trim().toLowerCase();
    return patients.filter(patient => patient.state === state.tab
      && (!keyword || [patient.id, patient.name, patient.phone].some(value => value.toLowerCase().includes(keyword)))
      && (!state.source || patient.source === state.source));
  }

  function counts() {
    return patients.reduce((result, patient) => {
      result[patient.state] += 1;
      return result;
    }, { pending: 0, managing: 0, exited: 0 });
  }

  function renderRow(patient) {
    const pendingActions = patient.state === 'pending' ? `<div class="team-patient-actions"><button type="button" class="team-patient-action" data-team-patient-reject="${escapeHtml(patient.id)}">拒绝入组</button><button type="button" class="team-patient-action primary" data-team-patient-accept="${escapeHtml(patient.id)}">接收入组</button></div>` : '';
    const statusTag = patient.state === 'managing' ? '<span class="team-patient-chip">管理中</span>' : patient.state === 'exited' ? '<span class="team-patient-chip muted">已出组</span>' : '';
    return `<article class="team-patient-row" data-team-patient-id="${escapeHtml(patient.id)}">
      <div class="team-patient-main"><input class="team-patient-check" type="checkbox" aria-label="选择${escapeHtml(patient.name)}"><div class="team-patient-identity">
        <div class="team-patient-line"><span class="team-patient-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span><strong>${escapeHtml(patient.name)}</strong><b>${escapeHtml(patient.gender)}</b><b>${patient.age}岁</b>${patient.tags.map(tag => `<span class="team-patient-chip">${escapeHtml(tag)}</span>`).join('')}${statusTag}</div>
        <div class="team-patient-meta"><span>患者来源： <b>${escapeHtml(patient.source)}</b></span><span>${escapeHtml(patient.date)}</span></div>
        <div class="team-patient-detail"><span>就诊号： ${escapeHtml(patient.id)}</span></div>
        <div class="team-patient-detail"><span>手机号： ${escapeHtml(patient.phone)}</span></div>
      </div></div>
      <div class="team-patient-ai"><strong>AI评估建议</strong><p>${escapeHtml(patient.suggestion)}</p></div>${pendingActions}
    </article>`;
  }

  function render() {
    const list = document.getElementById('teamPatientList');
    const pagination = document.getElementById('teamPatientPagination');
    if (!list || !pagination) return;
    const summary = counts();
    Object.keys(summary).forEach(key => {
      const node = document.querySelector(`[data-team-patient-count="${key}"]`);
      if (node) node.textContent = summary[key];
    });
    document.querySelectorAll('[data-team-patient-tab]').forEach(button => button.classList.toggle('active', button.dataset.teamPatientTab === state.tab));
    const rows = filteredPatients();
    const totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    state.page = Math.min(state.page, totalPages);
    const visible = rows.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    list.innerHTML = visible.length ? visible.map(renderRow).join('') : '<div class="team-patient-empty"><span class="team-patient-empty-icon" aria-hidden="true"></span><span>暂无符合条件的患者</span></div>';
    pagination.innerHTML = `<span>共 ${rows.length} 条</span><button type="button" class="team-patient-page" data-team-patient-page="prev" ${state.page === 1 ? 'disabled' : ''} aria-label="上一页">‹</button><button type="button" class="team-patient-page active" aria-current="page">${state.page}</button><button type="button" class="team-patient-page" data-team-patient-page="next" ${state.page === totalPages ? 'disabled' : ''} aria-label="下一页">›</button><select class="team-patient-page-size" data-team-patient-page-size aria-label="每页条数"><option value="20" ${state.pageSize === 20 ? 'selected' : ''}>20 条/页</option><option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10 条/页</option></select>`;
  }

  function toast(message) {
    document.querySelector('.team-patient-toast')?.remove();
    const node = document.createElement('div');
    node.className = 'team-patient-toast';
    node.setAttribute('role', 'status');
    node.textContent = message;
    document.body.append(node);
    requestAnimationFrame(() => node.classList.add('show'));
    window.setTimeout(() => {
      node.classList.remove('show');
      window.setTimeout(() => node.remove(), 180);
    }, 1800);
  }

  function changePatientState(id, nextState, message) {
    const patient = patients.find(item => item.id === id);
    if (!patient) return;
    patient.state = nextState;
    state.page = 1;
    render();
    toast(message.replace('{name}', patient.name));
  }

  document.addEventListener('input', event => {
    if (event.target.id !== 'teamPatientSearch') return;
    state.keyword = event.target.value;
    state.page = 1;
    render();
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'teamPatientSource') {
      state.source = event.target.value;
      state.page = 1;
      render();
    }
    if (event.target.matches('[data-team-patient-page-size]')) {
      state.pageSize = Number(event.target.value) || 20;
      state.page = 1;
      render();
    }
  });

  document.addEventListener('click', event => {
    const tab = event.target.closest('[data-team-patient-tab]');
    if (tab) {
      state.tab = tab.dataset.teamPatientTab;
      state.page = 1;
      render();
      return;
    }
    const accept = event.target.closest('[data-team-patient-accept]');
    if (accept) {
      changePatientState(accept.dataset.teamPatientAccept, 'managing', '已接收{name}入组');
      return;
    }
    const reject = event.target.closest('[data-team-patient-reject]');
    if (reject) {
      changePatientState(reject.dataset.teamPatientReject, 'exited', '已拒绝{name}入组');
      return;
    }
    const page = event.target.closest('[data-team-patient-page]');
    if (page && !page.disabled) {
      const totalPages = Math.max(1, Math.ceil(filteredPatients().length / state.pageSize));
      state.page = page.dataset.teamPatientPage === 'prev' ? Math.max(1, state.page - 1) : Math.min(totalPages, state.page + 1);
      render();
      return;
    }
    if (event.target.closest('[data-team-patient-add]')) toast('添加患者入口已打开');
    else if (event.target.closest('[data-team-patient-qr]')) toast('团队二维码已生成');
    else if (event.target.closest('[data-team-patient-switch]')) toast('团队切换器已打开');
    else if (event.target.closest('[data-team-patient-audit]')) toast('入组审核记录已打开');
  });

  window.renderTeamPatientList = render;
  render();
})();
