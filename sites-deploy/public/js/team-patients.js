(function () {
  const hypertensionPending = [
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

  const weightManaging = [
    ['陈梦强', '女', 35, '2026/08/18', 64, '182****2136', '勿动 28天血糖管理领跑营', '开营-问卷建档', '2026/08/18', true, false],
    ['测试一号', '女', 29, '2026/08/20', 62, '139****5678', '暂无', '--', '--', false, false],
    ['王星星', '女', 29, '2026/09/09', 42, '182****2136', '勿动 28天血糖管理领跑营', '开营-问卷建档', '2026/09/09', true, false],
    ['杨明星', '男', 29, '2026/09/10', 41, '182****2136', '勿动 28天血糖管理领跑营', '开营-饮食运动方案', '2026/09/10', true, false],
    ['王一博', '男', 28, '2026/09/10', 41, '156****7517', '勿动 28天血糖管理领跑营', '开营-问卷建档', '2026/09/10', true, false],
    ['汪丹', '男', 30, '2026/09/10', 41, '182****2136', '勿动 28天血糖管理领跑营', '开营-问卷建档', '2026/09/10', true, false],
    ['李佳宁', '女', 31, '2026/09/12', 39, '186****3208', '勿动 28天血糖管理领跑营', '开营-饮食运动方案', '2026/09/12', true, false],
    ['周凯', '男', 33, '2026/09/13', 38, '137****9076', '勿动 28天血糖管理领跑营', '开营-问卷建档', '2026/09/13', false, true],
    ['赵可欣', '女', 27, '2026/09/14', 37, '159****6742', '勿动 28天血糖管理领跑营', '开营-问卷建档', '2026/09/14', false, false]
  ].map((item, index) => ({ id: `team-m-${String(index + 1).padStart(3, '0')}`, displayVisitNo: '--', name: item[0], gender: item[1], age: item[2], joinedAt: item[3], joinedDays: item[4], phone: item[5], manager: '暂无', plan: item[6], node: item[7], nodeDate: item[8], overdue: item[9], warning: item[10], state: 'managing' }));

  const teamProfiles = {
    hypertension: { name: '高血压管理团队', department: '心血管内科一病区、生殖中心专区、测试科室', defaultTab: 'pending', patients: hypertensionPending },
    weight: { name: '28天体重血糖管理领跑营', department: '生殖中心专区、测试科室', defaultTab: 'managing', patients: [
      { id: 'team-p-001', name: '林可欣', gender: '女', age: 32, phone: '138****5201', source: '患者申请', date: '2026/10/18', tags: ['体重管理'], state: 'pending', suggestion: '患者主动申请参与体重与血糖管理，基础资料完整，建议审核后入组。' },
      { id: 'team-p-002', name: '方敏', gender: '女', age: 36, phone: '186****7318', source: '医生转入', date: '2026/10/18', tags: ['血糖偏高'], state: 'pending', suggestion: '患者近期血糖偏高并有体重管理需求，符合团队接收范围，建议纳入持续干预。' },
      { id: 'team-p-003', name: '张杰', gender: '男', age: 34, phone: '137****1569', source: '智能分组', date: '2026/10/17', tags: ['超重'], state: 'pending', suggestion: '患者BMI偏高，存在代谢风险，建议进入28天体重血糖管理领跑营。' },
      ...weightManaging,
      { id: 'team-e-001', name: '刘子涵', gender: '女', age: 38, phone: '136****2017', source: '医生转入', date: '2026/09/01', tags: ['已完成计划'], state: 'exited', suggestion: '患者已完成28天管理计划并达到阶段目标，已结案出组。' }
    ] }
  };

  const state = { team: 'hypertension', tab: 'pending', keyword: '', source: '', warningOnly: false, overdueOnly: false, page: 1, pageSize: 20, actionMenuId: '', selectedPatientId: '' };
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const currentProfile = () => teamProfiles[state.team];

  weightManaging.forEach(patient => {
    if (typeof allPatients === 'undefined' || allPatients.some(item => item.visitNo === patient.id)) return;
    allPatients.push({ name: patient.name, visitNo: patient.id, age: String(patient.age), gender: patient.gender, phone: patient.phone, department: '生殖中心专区', diagnosis: '体重与血糖健康管理', tags: patient.overdue ? ['任务已逾期'] : [], visitDate: patient.joinedAt, team: teamProfiles.weight.name, managementInstitution: '暨南大学附属顺德医院' });
  });

  function counts() {
    return currentProfile().patients.reduce((result, patient) => { result[patient.state] += 1; return result; }, { pending: 0, managing: 0, exited: 0 });
  }

  function filteredPatients() {
    const keyword = state.keyword.trim().toLowerCase();
    return currentProfile().patients.filter(patient => patient.state === state.tab
      && (!keyword || [patient.id, patient.displayVisitNo, patient.name, patient.phone, patient.plan, patient.node].some(value => String(value || '').toLowerCase().includes(keyword)))
      && (!state.source || patient.source === state.source)
      && (!state.warningOnly || patient.warning)
      && (!state.overdueOnly || patient.overdue));
  }

  function renderTeamMenu() {
    const menu = document.getElementById('teamPatientTeamMenu');
    if (!menu) return;
    menu.innerHTML = Object.entries(teamProfiles).map(([key, profile]) => `<button type="button" role="option" aria-selected="${key === state.team}" class="${key === state.team ? 'selected' : ''}" data-team-patient-select-team="${key}"><strong>${escapeHtml(profile.name)}</strong><span>${escapeHtml(profile.department)}</span></button>`).join('');
  }

  function renderFilters() {
    const filters = document.querySelector('.team-patient-filters');
    if (!filters) return;
    const placeholder = state.tab === 'managing' ? '就诊号/姓名/手机/当前执行计划' : '就诊号/姓名/手机';
    filters.innerHTML = `<label class="team-patient-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input id="teamPatientSearch" value="${escapeHtml(state.keyword)}" placeholder="${placeholder}" autocomplete="off"></label>${state.tab === 'managing' ? `<label class="team-patient-filter-check"><input id="teamPatientWarningOnly" type="checkbox" ${state.warningOnly ? 'checked' : ''}>预警待处理</label><label class="team-patient-filter-check"><input id="teamPatientOverdueOnly" type="checkbox" ${state.overdueOnly ? 'checked' : ''}>任务已逾期</label>` : `<label class="team-patient-source"><span class="sr-only">患者来源</span><select id="teamPatientSource"><option value="">患者来源 请选择</option><option value="智能分组" ${state.source === '智能分组' ? 'selected' : ''}>智能分组</option><option value="医生转入" ${state.source === '医生转入' ? 'selected' : ''}>医生转入</option><option value="患者申请" ${state.source === '患者申请' ? 'selected' : ''}>患者申请</option></select></label>`}`;
  }

  function renderPendingRow(patient) {
    const pendingActions = patient.state === 'pending' ? `<div class="team-patient-actions"><button type="button" class="team-patient-action" data-team-patient-reject="${escapeHtml(patient.id)}">拒绝入组</button><button type="button" class="team-patient-action primary" data-team-patient-accept="${escapeHtml(patient.id)}">接收入组</button></div>` : '';
    const statusTag = patient.state === 'exited' ? '<span class="team-patient-chip muted">已出组</span>' : '';
    return `<article class="team-patient-row${state.selectedPatientId === patient.id ? ' selected' : ''}" data-team-patient-id="${escapeHtml(patient.id)}" tabindex="0" aria-label="查看${escapeHtml(patient.name)}的档案要点"><div class="team-patient-main"><input class="team-patient-check" type="checkbox" aria-label="选择${escapeHtml(patient.name)}"><div class="team-patient-identity"><div class="team-patient-line"><span class="team-patient-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span><strong>${escapeHtml(patient.name)}</strong><b>${escapeHtml(patient.gender)}</b><b>${patient.age}岁</b>${patient.tags.map(tag => `<span class="team-patient-chip">${escapeHtml(tag)}</span>`).join('')}${statusTag}</div><div class="team-patient-meta"><span>患者来源： <b>${escapeHtml(patient.source)}</b></span><span>${escapeHtml(patient.date)}</span></div><div class="team-patient-detail"><span>就诊号： ${escapeHtml(patient.displayVisitNo || patient.id)}</span></div><div class="team-patient-detail"><span>手机号： ${escapeHtml(patient.phone)}</span></div></div></div><div class="team-patient-ai"><strong>AI评估建议</strong><p>${escapeHtml(patient.suggestion)}</p></div>${pendingActions}</article>`;
  }

  const sourceLink = label => `<button type="button" class="team-insight-source" data-team-insight-source="${escapeHtml(label)}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><rect x="2.5" y="1.5" width="11" height="13" rx="2"/><path d="M5 5h6M5 8h6M5 11h4"/></svg>${escapeHtml(label)}</button>`;

  function renderInsightPanel() {
    const panel = document.getElementById('teamPatientInsight');
    if (!panel) return;
    const patient = currentProfile().patients.find(item => item.id === state.selectedPatientId && item.state === 'pending');
    if (!patient || state.tab !== 'pending') {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      panel.innerHTML = '';
      return;
    }
    const source = sourceLink('2026-03-10 | 肾内科门诊 | 检验报告');
    panel.innerHTML = `<div class="team-insight-hero"><div class="team-insight-robot" aria-hidden="true"><img src="./assets/ai-steward-mascot.png" alt=""></div><section class="team-insight-summary" aria-label="患者智能解析报告"><div class="team-insight-patient-row"><div class="team-insight-basics"><span>姓名：${escapeHtml(patient.name)}</span><span>性别：${escapeHtml(patient.gender)}</span><span>年龄：${escapeHtml(patient.age)}岁</span></div><button type="button" class="team-insight-profile" data-team-insight-profile><span class="team-insight-profile-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span>患者档案</button></div><div class="team-insight-contact"><span>身份证号码：440482320214515493</span><span>手机号码：16626678484 <button type="button" class="team-insight-edit" data-team-insight-edit aria-label="编辑手机号"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M9.5 3.5 12.5.5l3 3-3 3M12 1l2 2-7.5 7.5L4 11l.5-2.5L12 1Z"/><path d="M13.5 9.5v4h-11v-11h4"/></svg></button></span></div><div class="team-insight-tags"><span>eGFR ≥60</span><span>CKD3期</span><span>CKD3期</span></div><div class="team-insight-divider"></div><div class="team-insight-report"><div class="team-insight-report-title"><i aria-hidden="true"></i><strong>智能解析报告</strong></div><ul><li>患者为 <b>高龄高血压 CKD5期</b> 患者，存在 eGFR 重度下降、血肌酐升高及血尿异常，提示肾功能 严重受损并伴较高心肾并发症风险;若合并高钾、低白蛋白或血磷异常，建议纳入重点管理。</li><li>基于当前画像结果，推荐分配至 XXX 健康管理团队，并匹配 XXX 健康管理方案。</li></ul></div></section></div><section class="team-insight-body" aria-label="档案要点"><h2>档案要点</h2><article class="team-insight-card"><h3>重点关注 (3)</h3><div class="team-insight-card-content"><p>•&nbsp; eGFR:12 ml/min/1.73m，重度下降。&nbsp;&nbsp; 来源：${source}</p><p>•&nbsp; 血肌酐:486 umol/L，明显升高，提示肾功能减退明显。&nbsp;&nbsp; 来源：${source}</p><p>•&nbsp; 血红蛋白:86 g/L，明显下降，提示肾性贫血风险。&nbsp;&nbsp; 来源：${source}</p></div></article><article class="team-insight-card team-insight-card-secondary"><h3>其他异常 (1)</h3><div class="team-insight-card-content"><p>•&nbsp; eGFR:12 ml/min/1.73m，重度下降。&nbsp;&nbsp; 来源：${source}</p></div></article><p class="team-insight-disclaimer">*采用AI模型智能辅助采集量表内容，仅供参考，请核对确认。</p></section>`;
    panel.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => panel.classList.add('open'));
  }

  function renderManagingRow(patient) {
    const menuOpen = state.actionMenuId === patient.id;
    return `<article class="team-patient-row team-patient-managing-row" data-team-patient-id="${escapeHtml(patient.id)}"><div class="team-patient-main"><input class="team-patient-check" type="checkbox" aria-label="选择${escapeHtml(patient.name)}"><div class="team-patient-identity"><div class="team-patient-line"><span class="team-patient-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span><strong>${escapeHtml(patient.name)}</strong><b>${escapeHtml(patient.gender)}</b><b>${patient.age}岁</b>${patient.overdue ? '<span class="team-patient-overdue">任务已逾期</span>' : ''}</div><div class="team-patient-meta"><span>入组时间： <b>${patient.joinedAt}</b></span><span>已在组${patient.joinedDays}天</span></div><div class="team-patient-detail"><span>就诊号： ${escapeHtml(patient.displayVisitNo)}</span></div><div class="team-patient-detail"><span>手机号： ${escapeHtml(patient.phone)}</span></div></div></div><div class="team-patient-plan-info"><p><span>健康负责人：</span><b>${escapeHtml(patient.manager)}</b></p><p><span>当前管理方案：</span><b>${escapeHtml(patient.plan)}</b></p><p><span>当前任务节点：</span><b>${escapeHtml(patient.node)}</b><em>|</em><b>${escapeHtml(patient.nodeDate)}</b></p></div><div class="team-patient-managing-actions"><button type="button" class="team-patient-action" data-mark-patient="${escapeHtml(patient.id)}">标记</button><button type="button" class="team-patient-action" data-team-view-task="${escapeHtml(patient.id)}">查看任务</button><button type="button" class="team-patient-action" data-team-adjust-plan="${escapeHtml(patient.id)}">调整方案</button><div class="team-patient-more-wrap"><button type="button" class="team-patient-action team-patient-more" data-team-patient-more="${escapeHtml(patient.id)}" aria-haspopup="menu" aria-expanded="${menuOpen}">···</button><div class="team-patient-row-menu" role="menu" ${menuOpen ? '' : 'hidden'}><button type="button" role="menuitem" data-team-adjust-manager="${escapeHtml(patient.id)}">调整健康负责人</button><button type="button" role="menuitem" data-team-close-case="${escapeHtml(patient.id)}">结案出组</button></div></div></div></article>`;
  }

  function render() {
    const profile = currentProfile();
    const list = document.getElementById('teamPatientList');
    const pagination = document.getElementById('teamPatientPagination');
    if (!list || !pagination) return;
    document.getElementById('teamPatientTeamName').textContent = profile.name;
    document.getElementById('teamPatientDepartment').textContent = profile.department;
    const summary = counts();
    Object.keys(summary).forEach(key => { const node = document.querySelector(`[data-team-patient-count="${key}"]`); if (node) node.textContent = summary[key]; });
    document.querySelectorAll('[data-team-patient-tab]').forEach(button => button.classList.toggle('active', button.dataset.teamPatientTab === state.tab));
    renderTeamMenu();
    renderFilters();
    const rows = filteredPatients();
    const totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    state.page = Math.min(state.page, totalPages);
    const visible = rows.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    list.innerHTML = visible.length ? visible.map(patient => state.tab === 'managing' ? renderManagingRow(patient) : renderPendingRow(patient)).join('') : '<div class="team-patient-empty"><span class="team-patient-empty-icon" aria-hidden="true"></span><span>暂无符合条件的患者</span></div>';
    pagination.innerHTML = `<span>共 ${rows.length} 条</span><button type="button" class="team-patient-page" data-team-patient-page="prev" ${state.page === 1 ? 'disabled' : ''} aria-label="上一页">‹</button><button type="button" class="team-patient-page active" aria-current="page">${state.page}</button><button type="button" class="team-patient-page" data-team-patient-page="next" ${state.page === totalPages ? 'disabled' : ''} aria-label="下一页">›</button><select class="team-patient-page-size" data-team-patient-page-size aria-label="每页条数"><option value="20" ${state.pageSize === 20 ? 'selected' : ''}>20 条/页</option><option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10 条/页</option></select>`;
    renderInsightPanel();
  }

  function toast(message) {
    document.querySelector('.team-patient-toast')?.remove();
    const node = document.createElement('div');
    node.className = 'team-patient-toast';
    node.setAttribute('role', 'status');
    node.textContent = message;
    document.body.append(node);
    requestAnimationFrame(() => node.classList.add('show'));
    window.setTimeout(() => { node.classList.remove('show'); window.setTimeout(() => node.remove(), 180); }, 1800);
  }

  function closeTeamMenu() {
    document.getElementById('teamPatientTeamMenu')?.setAttribute('hidden', '');
    document.querySelector('[data-team-patient-switch]')?.setAttribute('aria-expanded', 'false');
  }

  function switchTeam(key) {
    if (!teamProfiles[key]) return;
    state.team = key;
    state.tab = teamProfiles[key].defaultTab;
    state.keyword = '';
    state.source = '';
    state.warningOnly = false;
    state.overdueOnly = false;
    state.page = 1;
    state.actionMenuId = '';
    state.selectedPatientId = '';
    closeTeamMenu();
    render();
    toast(`已切换至${teamProfiles[key].name}`);
  }

  function changePatientState(id, nextState, message) {
    const patient = currentProfile().patients.find(item => item.id === id);
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
    requestAnimationFrame(() => { const input = document.getElementById('teamPatientSearch'); input?.focus(); input?.setSelectionRange(state.keyword.length, state.keyword.length); });
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'teamPatientSource') state.source = event.target.value;
    else if (event.target.id === 'teamPatientWarningOnly') state.warningOnly = event.target.checked;
    else if (event.target.id === 'teamPatientOverdueOnly') state.overdueOnly = event.target.checked;
    else if (event.target.matches('[data-team-patient-page-size]')) state.pageSize = Number(event.target.value) || 20;
    else return;
    state.page = 1;
    render();
  });

  document.addEventListener('click', event => {
    const switchButton = event.target.closest('[data-team-patient-switch]');
    if (switchButton) {
      const menu = document.getElementById('teamPatientTeamMenu');
      const willOpen = menu.hidden;
      menu.hidden = !willOpen;
      switchButton.setAttribute('aria-expanded', String(willOpen));
      return;
    }
    const teamOption = event.target.closest('[data-team-patient-select-team]');
    if (teamOption) { switchTeam(teamOption.dataset.teamPatientSelectTeam); return; }
    if (!event.target.closest('.team-patient-switch-wrap')) closeTeamMenu();
    const tab = event.target.closest('[data-team-patient-tab]');
    if (tab) { state.tab = tab.dataset.teamPatientTab; state.page = 1; state.keyword = ''; state.warningOnly = false; state.overdueOnly = false; state.actionMenuId = ''; state.selectedPatientId = ''; render(); return; }
    const accept = event.target.closest('[data-team-patient-accept]');
    if (accept) { changePatientState(accept.dataset.teamPatientAccept, 'managing', '已接收{name}入组'); return; }
    const reject = event.target.closest('[data-team-patient-reject]');
    if (reject) { changePatientState(reject.dataset.teamPatientReject, 'exited', '已拒绝{name}入组'); return; }
    const more = event.target.closest('[data-team-patient-more]');
    if (more) { state.actionMenuId = state.actionMenuId === more.dataset.teamPatientMore ? '' : more.dataset.teamPatientMore; render(); return; }
    if (!event.target.closest('.team-patient-more-wrap') && state.actionMenuId) { state.actionMenuId = ''; render(); }
    const closeCase = event.target.closest('[data-team-close-case]');
    if (closeCase) { changePatientState(closeCase.dataset.teamCloseCase, 'exited', '已将{name}结案出组'); return; }
    if (event.target.closest('[data-team-view-task]')) { toast('患者任务列表已打开'); return; }
    if (event.target.closest('[data-team-adjust-plan]')) { toast('管理方案调整已打开'); return; }
    if (event.target.closest('[data-team-adjust-manager]')) { toast('健康负责人调整已打开'); return; }
    const page = event.target.closest('[data-team-patient-page]');
    if (page && !page.disabled) {
      const totalPages = Math.max(1, Math.ceil(filteredPatients().length / state.pageSize));
      state.page = page.dataset.teamPatientPage === 'prev' ? Math.max(1, state.page - 1) : Math.min(totalPages, state.page + 1);
      render();
      return;
    }
    if (event.target.closest('[data-team-patient-add]')) { toast('添加患者入口已打开'); return; }
    if (event.target.closest('[data-team-patient-qr]')) { toast('团队二维码已生成'); return; }
    if (event.target.closest('[data-team-patient-audit]')) { toast('入组审核记录已打开'); return; }
    const source = event.target.closest('[data-team-insight-source]');
    if (source) { toast(`已定位来源：${source.dataset.teamInsightSource}`); return; }
    if (event.target.closest('[data-team-insight-edit]')) { toast('手机号编辑入口已打开'); return; }
    if (event.target.closest('[data-team-insight-profile]')) {
      const patient = currentProfile().patients.find(item => item.id === state.selectedPatientId);
      if (patient) window.openPatientArchiveFromAssistant?.({ name: patient.name, gender: patient.gender, age: patient.age, tab: 'basic' });
      return;
    }
    const patientRow = event.target.closest('.team-patient-row[data-team-patient-id]');
    if (patientRow && state.tab === 'pending' && !event.target.closest('button,input,select,a')) {
      state.selectedPatientId = patientRow.dataset.teamPatientId;
      render();
    }
  });

  document.addEventListener('keydown', event => {
    const patientRow = event.target.closest('.team-patient-row[data-team-patient-id]');
    if (!patientRow || state.tab !== 'pending' || !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    state.selectedPatientId = patientRow.dataset.teamPatientId;
    render();
  });

  window.renderTeamPatientList = render;
  render();
})();
