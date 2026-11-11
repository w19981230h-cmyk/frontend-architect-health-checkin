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

  const hypertensionManaging = [
    ['9518072', '梁志强', '男', 62, '2026/08/12', 86, '136****2187', '陈医生', '高血压标准随访方案', '家庭血压周评估', '2026/11/06', false, true],
    ['9531648', '冯丽华', '女', 57, '2026/08/20', 78, '138****6043', '刘护士', '高血压合并糖尿病管理方案', '空腹血糖与血压复测', '2026/11/06', false, false],
    ['9552091', '何国庆', '男', 69, '2026/08/28', 70, '159****3275', '陈医生', '老年高血压管理方案', '体位性血压评估', '2026/11/05', true, true],
    ['9574316', '罗美珍', '女', 54, '2026/09/03', 64, '137****9152', '张医生', '高血压生活方式干预方案', '低盐饮食打卡', '2026/11/06', false, false],
    ['9601853', '周建明', '男', 48, '2026/09/10', 57, '188****4631', '王护士', '原发性高血压强化管理方案', '用药依从性随访', '2026/11/04', true, false],
    ['9637204', '黄秀芳', '女', 73, '2026/09/16', 51, '135****8026', '陈医生', '高血压合并冠心病管理方案', '心率与血压联合监测', '2026/11/06', false, true],
    ['9658437', '郑伟东', '男', 51, '2026/09/22', 45, '186****7314', '张医生', '高血压标准随访方案', '月度健康问卷', '2026/11/07', false, false],
    ['9682175', '李月琴', '女', 65, '2026/09/29', 38, '139****2468', '刘护士', '高血压合并血脂异常方案', '血脂复查提醒', '2026/11/08', false, false],
    ['9715062', '吴德新', '男', 59, '2026/10/05', 32, '133****5789', '陈医生', '难治性高血压管理方案', '晨起血压连续监测', '2026/11/05', true, true],
    ['9741389', '杨淑芬', '女', 46, '2026/10/12', 25, '152****3947', '王护士', '高血压生活方式干预方案', '运动处方执行反馈', '2026/11/07', false, false],
    ['9764208', '赵国安', '男', 71, '2026/10/18', 19, '181****6502', '张医生', '老年高血压管理方案', '居家跌倒风险评估', '2026/11/06', false, false],
    ['9791643', '许慧敏', '女', 52, '2026/10/26', 11, '136****8429', '刘护士', '高血压标准随访方案', '首次入组电话随访', '2026/11/06', false, false]
  ].map(item => ({ id: item[0], displayVisitNo: item[0], name: item[1], gender: item[2], age: item[3], joinedAt: item[4], joinedDays: item[5], phone: item[6], manager: item[7], plan: item[8], node: item[9], nodeDate: item[10], overdue: item[11], warning: item[12], state: 'managing' }));

  const hypertensionExited = [
    { id: '9468315', name: '谢国华', gender: '男', age: 64, phone: '138****1746', source: '智能分组', date: '2026/08/30', tags: ['连续达标', '规范用药'], state: 'exited', suggestion: '患者连续三个月家庭血压保持达标，用药依从性良好，已完成阶段管理目标并转入常规复诊。' },
    { id: '9442067', name: '林玉珍', gender: '女', age: 58, phone: '159****6204', source: '患者申请', date: '2026/08/22', tags: ['血压稳定', '生活方式改善'], state: 'exited', suggestion: '患者通过饮食、运动与规律用药后血压持续稳定，已完成本周期健康管理计划。' },
    { id: '9417358', name: '郭明远', gender: '男', age: 72, phone: '137****3851', source: '医生转入', date: '2026/08/15', tags: ['转专科管理', '冠心病'], state: 'exited', suggestion: '患者因冠心病进一步诊疗需要转入心血管专科团队，原高血压管理方案已完成交接。' },
    { id: '9386142', name: '邓丽娟', gender: '女', age: 49, phone: '186****5038', source: '智能分组', date: '2026/08/06', tags: ['阶段目标完成', '风险降低'], state: 'exited', suggestion: '患者血压控制与生活方式干预目标均已完成，综合心血管风险较入组时明显下降。' },
    { id: '9354209', name: '陈福安', gender: '男', age: 67, phone: '133****9462', source: '医生转入', date: '2026/07/28', tags: ['转社区随访', '血压达标'], state: 'exited', suggestion: '患者病情稳定，已转至社区卫生服务中心继续开展常规血压监测和处方续配。' },
    { id: '9321584', name: '彭秀兰', gender: '女', age: 61, phone: '152****7315', source: '患者申请', date: '2026/07/20', tags: ['主动出组', '资料已归档'], state: 'exited', suggestion: '患者因个人安排申请结束团队管理，既往随访数据和阶段管理总结已完成归档。' },
    { id: '9297036', name: '苏建平', gender: '男', age: 56, phone: '181****2649', source: '智能分组', date: '2026/07/12', tags: ['管理期满', '复诊计划明确'], state: 'exited', suggestion: '患者完成六个月强化管理，血压趋势稳定，后续复诊与复查计划已明确。' }
  ];

  hypertensionPending.push(...hypertensionManaging, ...hypertensionExited);
  const hypertensionExitDates = ['2026/10/08', '2026/10/25', '2026/10/18', '2026/10/12', '2026/10/06', '2026/09/28', '2026/09/20', '2026/09/12'];
  hypertensionPending.filter(patient => patient.state === 'exited').forEach((patient, index) => { patient.exitedAt = hypertensionExitDates[index]; });

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

  const patientSourceMap = {
    '智能分组': '智能分组',
    '患者申请': '扫码申请',
    '医生转入': '手动入组'
  };
  const executionExamples = {
    '9481206': ['2026/09/23', '陈医生', '高血压标准随访方案', '完成家庭血压记录核对，血压趋势平稳，继续维持当前用药与低盐饮食。'],
    '9468315': ['2026/09/19', '陈医生', '高血压标准随访方案', '核对近阶段家庭血压和服药记录，连续达标，未报告明显用药不适。'],
    '9442067': ['2026/09/16', '刘护士', '高血压生活方式干预方案', '完成饮食、运动和居家测压随访，患者可持续执行既定生活方式计划。'],
    '9417358': ['2026/09/20', '陈医生', '高血压合并冠心病管理方案', '复核心血管专科就诊情况，确认后续由专科团队接续管理。'],
    '9386142': ['2026/09/04', '张医生', '高血压生活方式干预方案', '复核家庭血压记录及生活方式打卡，阶段目标完成情况良好。'],
    '9354209': ['2026/08/26', '陈医生', '高血压标准随访方案', '完成复诊与用药情况回访，血压总体稳定，已说明社区接续随访安排。'],
    '9321584': ['2026/08/18', '刘护士', '高血压标准随访方案', '电话确认近期血压、服药和随访意愿，记录患者提出的出组申请。'],
    '9297036': ['2026/08/17', '陈医生', '原发性高血压强化管理方案', '完成强化管理阶段复核，家庭血压趋势平稳，后续复诊计划已明确。'],
    'team-e-001': ['2026/09/15', '王护士', '28天体重血糖管理方案', '完成中期体重、饮食和血糖记录回访，继续执行既定管理计划。']
  };
  Object.values(teamProfiles).forEach(profile => profile.patients.forEach(patient => {
    if (patient.source) patient.source = patientSourceMap[patient.source] || '手动入组';
    if (patient.state === 'exited') {
      patient.exitedAt ||= patient.id === 'team-e-001' ? '2026/09/29' : patient.date;
      const example = executionExamples[patient.id];
      patient.executionRecords ||= example ? [
        { date: patient.exitedAt, title: '出组结案', result: patient.tags?.[0] || '管理期满', summary: patient.suggestion, manager: example[1], plan: example[2] },
        { date: example[0], title: '阶段随访', result: '已完成', summary: example[3], manager: example[1], plan: example[2] },
        { date: patient.joinedAt || patient.date, title: '入组建档', result: '已完成', summary: `核对${patient.name}的基础资料与健康标签，建立${example[2]}并安排阶段随访。`, manager: example[1], plan: example[2] }
      ] : [{ date: patient.exitedAt, title: '出组结案', result: patient.tags?.[0] || '管理期满', summary: patient.suggestion, manager: patient.manager, plan: patient.plan }];
    }
  }));
  const additionalExecutionExamples = {
    '9481206': { date: '2026/09/30', title: '方案调整', result: '已完成', summary: '根据近期家庭血压记录复核随访频次，继续执行原降压方案，并增加每周一次的用药情况确认。', manager: '陈医生', plan: '高血压标准随访方案' },
    '9468315': { date: '2026/10/10', title: '用药复核', result: '已完成', summary: '核对当前降压药物与服药时间，患者反馈服药规律，继续观察家庭血压。', manager: '陈医生', plan: '高血压标准随访方案' },
    '9442067': { date: '2026/10/03', title: '生活方式回访', result: '已完成', summary: '电话确认低盐饮食和每周运动执行情况，患者表示可以继续维持当前计划。', manager: '刘护士', plan: '高血压生活方式干预方案' }
  };
  teamProfiles.hypertension.patients.forEach(patient => {
    const example = additionalExecutionExamples[patient.id];
    if (example && patient.executionRecords) patient.executionRecords.splice(1, 0, example);
  });

  const state = { team: 'hypertension', tab: 'pending', keyword: '', source: '', warningOnly: false, overdueOnly: false, page: 1, pageSize: 20, actionMenuId: '', selectedPatientId: '', workspaceOpen: false, workspaceCategory: 'audit', workspaceSidebarCollapsed: false, workspacePhoneVisible: false, resumeWorkspaceAfterArchive: false };
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const currentProfile = () => teamProfiles[state.team];

  [...weightManaging, ...hypertensionManaging].forEach(patient => {
    if (typeof allPatients === 'undefined' || allPatients.some(item => item.visitNo === patient.id)) return;
    const isHypertension = hypertensionManaging.includes(patient);
    allPatients.push({ name: patient.name, visitNo: patient.id, age: String(patient.age), gender: patient.gender, phone: patient.phone, department: isHypertension ? '心血管内科一病区' : '生殖中心专区', diagnosis: isHypertension ? '高血压健康管理' : '体重与血糖健康管理', tags: patient.overdue ? ['任务已逾期'] : [], visitDate: patient.joinedAt, team: isHypertension ? teamProfiles.hypertension.name : teamProfiles.weight.name, managementInstitution: '暨南大学附属顺德医院' });
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
    filters.innerHTML = `<label class="team-patient-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input id="teamPatientSearch" value="${escapeHtml(state.keyword)}" placeholder="${placeholder}" autocomplete="off"></label>${state.tab === 'managing' ? `<label class="team-patient-filter-check"><input id="teamPatientWarningOnly" type="checkbox" ${state.warningOnly ? 'checked' : ''}>预警待处理</label><label class="team-patient-filter-check"><input id="teamPatientOverdueOnly" type="checkbox" ${state.overdueOnly ? 'checked' : ''}>任务已逾期</label>` : `<label class="team-patient-source"><span class="sr-only">患者来源</span><select id="teamPatientSource"><option value="">患者来源 请选择</option><option value="智能分组" ${state.source === '智能分组' ? 'selected' : ''}>智能分组</option><option value="扫码申请" ${state.source === '扫码申请' ? 'selected' : ''}>扫码申请</option><option value="手动入组" ${state.source === '手动入组' ? 'selected' : ''}>手动入组</option></select></label>`}`;
  }

  function renderPendingRow(patient) {
    const pendingActions = patient.state === 'pending' ? `<div class="team-patient-actions"><button type="button" class="team-patient-action" data-team-patient-reject="${escapeHtml(patient.id)}">拒绝入组</button><button type="button" class="team-patient-action" data-team-patient-accept="${escapeHtml(patient.id)}">接收入组</button></div>` : '';
    const statusTag = patient.state === 'exited' ? '<span class="team-patient-chip muted">已出组</span>' : '';
    const exitedAction = patient.state === 'exited' ? '<div class="team-patient-actions"><span class="team-patient-list-status">已完成出组</span></div>' : '';
    return `<article class="team-patient-row team-patient-pending-row${state.selectedPatientId === patient.id ? ' selected' : ''}" role="row" data-team-patient-id="${escapeHtml(patient.id)}" tabindex="0" aria-label="查看${escapeHtml(patient.name)}的档案要点"><div class="team-patient-selection team-patient-cell" role="cell"><input class="team-patient-check" type="checkbox" aria-label="选择${escapeHtml(patient.name)}"></div><div class="team-patient-name-cell team-patient-cell" role="cell"><span class="team-patient-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span><strong>${escapeHtml(patient.name)}</strong><span class="team-patient-inline-tags">${patient.tags.map(tag => `<span class="team-patient-chip">${escapeHtml(tag)}</span>`).join('')}</span>${statusTag}</div><div class="team-patient-text-cell team-patient-cell" role="cell">${escapeHtml(patient.gender)}</div><div class="team-patient-text-cell team-patient-cell" role="cell">${patient.age}岁</div><div class="team-patient-code-cell team-patient-cell" role="cell">${escapeHtml(patient.displayVisitNo || patient.id)}</div><div class="team-patient-code-cell team-patient-cell" role="cell">${escapeHtml(patient.phone)}</div><div class="team-patient-text-cell team-patient-cell" role="cell">${escapeHtml(patient.source)}</div><div class="team-patient-date-cell team-patient-cell" role="cell">${escapeHtml(patient.date)}</div><div class="team-patient-ai team-patient-cell" role="cell"><strong>AI评估建议</strong><p title="${escapeHtml(patient.suggestion)}">${escapeHtml(patient.suggestion)}</p></div><div class="team-patient-operation team-patient-cell" role="cell">${pendingActions || exitedAction}</div></article>`;
  }

  function renderExitedRow(patient) {
    return `<article class="team-patient-row team-patient-exited-row" role="row" data-team-patient-id="${escapeHtml(patient.id)}"><div class="team-patient-selection team-patient-cell" role="cell"><input class="team-patient-check" type="checkbox" aria-label="选择${escapeHtml(patient.name)}"></div><div class="team-patient-name-cell team-patient-cell" role="cell"><span class="team-patient-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span><strong>${escapeHtml(patient.name)}</strong><span class="team-patient-inline-tags">${patient.tags.map(tag => `<span class="team-patient-chip">${escapeHtml(tag)}</span>`).join('')}</span></div><div class="team-patient-text-cell team-patient-cell" role="cell">${escapeHtml(patient.gender)}</div><div class="team-patient-text-cell team-patient-cell" role="cell">${patient.age}岁</div><div class="team-patient-code-cell team-patient-cell" role="cell">${escapeHtml(patient.displayVisitNo || patient.id)}</div><div class="team-patient-code-cell team-patient-cell" role="cell">${escapeHtml(patient.phone)}</div><div class="team-patient-text-cell team-patient-cell" role="cell">${escapeHtml(patient.source)}</div><div class="team-patient-date-cell team-patient-cell" role="cell">${escapeHtml(patient.exitedAt || patient.date || '--')}</div><div class="team-patient-operation team-patient-cell" role="cell"><button type="button" class="team-patient-action team-patient-rejoin" data-team-patient-rejoin="${escapeHtml(patient.id)}">重新入组</button><button type="button" class="team-patient-action team-patient-execution" data-team-patient-execution="${escapeHtml(patient.id)}">执行记录</button></div></article>`;
  }

  const sourceLink = label => `<button type="button" class="team-insight-source" data-team-insight-source="${escapeHtml(label)}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><rect x="2.5" y="1.5" width="11" height="13" rx="2"/><path d="M5 5h6M5 8h6M5 11h4"/></svg>${escapeHtml(label)}</button>`;

  const reviewCategories = [
    ['audit', '入组审核'],
    ['tasks', '健康任务'],
    ['warnings', '预警处置'],
    ['evaluation', '评价任务'],
    ['assessment', '健康评估']
  ];

  function workspacePatients() {
    return currentProfile().patients.filter(patient => patient.state === 'pending');
  }

  function openReviewWorkspace(patientId = '') {
    const patients = workspacePatients();
    const patient = patients.find(item => item.id === patientId) || patients.find(item => item.id === state.selectedPatientId) || patients[0];
    state.selectedPatientId = patient?.id || '';
    state.workspaceOpen = true;
    state.workspacePhoneVisible = false;
    document.body.classList.add('team-review-workspace-active');
    render();
  }

  function closeReviewWorkspace() {
    state.workspaceOpen = false;
    state.selectedPatientId = '';
    state.actionMenuId = '';
    state.workspacePhoneVisible = false;
    document.body.classList.remove('team-review-workspace-active');
    render();
  }

  function renderWorkspaceCategory(patient) {
    if (state.workspaceCategory === 'audit') {
      const source = sourceLink('2026-03-10 | 肾内科门诊 | 检验报告');
      return `<section class="team-review-report"><div class="team-review-report-title"><span class="team-review-ai-icon" aria-hidden="true">✦</span><div><h2>智能解析报告</h2><p>AI 入组总结 · 由 AI 根据患者档案与任务数据生成</p></div></div><ul><li>患者存在高血压、CKD3 期及 eGFR 持续下降，肾功能与血压异常均与慢病管理团队的入组标准直接相关，因此被推荐进入该团队重点管理。</li><li>基于当前患者画像与任务规则，推荐方案为 CKD 分级随访管理方案，匹配程度为 92% · 高匹配。</li></ul></section><h2 class="team-review-section-title">档案要点</h2><section class="team-review-detail-card"><h3>重点关注 (3)</h3><div><p>eGFR:12 ml/min/1.73m，重度下降。　来源：${source}</p><p>血肌酐:486 umol/L，明显升高，提示肾功能减退明显。　来源：${source}</p><p>血红蛋白:86 g/L，明显下降，提示肾性贫血风险。　来源：${source}</p></div></section><section class="team-review-detail-card"><h3>其他异常 (1)</h3><div><p>eGFR:12 ml/min/1.73m，重度下降。　来源：${source}</p></div></section><p class="team-review-disclaimer">* 采用AI模型智能辅助采集量表内容，仅供参考，请核对确认。</p>`;
    }
    const category = reviewCategories.find(item => item[0] === state.workspaceCategory)?.[1] || '待办事项';
    const descriptions = {
      tasks: '当前患者暂无待执行健康任务，可在患者档案中创建随访计划。',
      warnings: '当前患者暂无未处理预警，异常指标会自动进入此处。',
      evaluation: '当前患者暂无待评价任务，新的评价结果会同步展示。',
      assessment: '当前患者已完成基础健康评估，可进入患者档案查看完整报告。'
    };
    return `<section class="team-review-empty-category"><span aria-hidden="true">✓</span><h2>${escapeHtml(category)}</h2><p>${escapeHtml(descriptions[state.workspaceCategory] || '')}</p><button type="button" data-team-insight-profile>查看患者档案</button></section>`;
  }

  function renderWorkspacePanel(panel) {
    const patients = workspacePatients();
    let patient = patients.find(item => item.id === state.selectedPatientId);
    if (!patient) {
      patient = patients[0];
      state.selectedPatientId = patient?.id || '';
    }
    panel.classList.add('team-review-workspace');
    const patientCards = patients.map(item => `<button type="button" class="team-review-patient-card${item.id === patient?.id ? ' active' : ''}" data-team-review-select="${escapeHtml(item.id)}"><span class="team-review-list-avatar" aria-hidden="true">${escapeHtml(item.name.slice(-1))}</span><span class="team-review-list-info"><span><strong>${escapeHtml(item.name)}</strong><em>${escapeHtml(item.phone)}</em><i aria-hidden="true">◉</i></span><small>${item.tags.slice(0, 3).map(tag => `<b>${escapeHtml(tag)}</b>`).join('')}</small></span><span class="team-review-card-more" data-team-review-more="${escapeHtml(item.id)}" aria-label="更多操作">•••</span></button>`).join('');
    const categoryTabs = reviewCategories.map(([key, label]) => `<button type="button" class="${state.workspaceCategory === key ? 'active' : ''}" data-team-review-category="${key}">${label}</button>`).join('');
    const phone = patient ? (state.workspacePhoneVisible ? `1380000${String(patient.id).slice(-4)}` : patient.phone) : '--';
    const content = patient ? `<div class="team-review-patient-head"><div class="team-review-patient-basics"><strong>${escapeHtml(patient.name)}</strong><span>${escapeHtml(patient.gender)}</span><span>${patient.age}岁</span>${patient.tags.slice(0, 3).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}<i></i><small>身份证号 440482320214515493</small><i></i><small>手机号 ${escapeHtml(phone)}</small><button type="button" data-team-review-phone aria-label="${state.workspacePhoneVisible ? '隐藏手机号' : '查看手机号'}">${state.workspacePhoneVisible ? '◌' : '◉'}</button></div><button type="button" class="team-review-profile" data-team-insight-profile><span class="team-review-profile-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span>患者档案</button></div><div class="team-review-stripe" aria-hidden="true"></div>${renderWorkspaceCategory(patient)}` : '<section class="team-review-empty-category"><span aria-hidden="true">✓</span><h2>待办已处理完成</h2><p>当前团队没有待审核患者，可返回列表查看管理中与已出组患者。</p></section>';
    panel.innerHTML = `<header class="team-review-topbar"><button type="button" data-team-review-exit>‹ 返回</button></header><div class="team-review-layout${state.workspaceSidebarCollapsed ? ' sidebar-collapsed' : ''}"><aside class="team-review-sidebar"><div class="team-review-sidebar-head"><strong>待办明细 <small>共 ${patients.length} 人</small></strong><button type="button" data-team-review-collapse aria-label="${state.workspaceSidebarCollapsed ? '展开待办列表' : '收起待办列表'}">${state.workspaceSidebarCollapsed ? '›' : '‹'}</button></div><nav class="team-review-categories" aria-label="待办类型">${categoryTabs}</nav><div class="team-review-patient-list">${patientCards || '<p class="team-review-no-patients">暂无待审核患者</p>'}</div></aside><main class="team-review-main">${content}</main></div>${patient ? `<footer class="team-review-actions"><button type="button" class="reject" data-team-review-reject="${escapeHtml(patient.id)}">× 拒绝入组</button><button type="button" class="accept" data-team-review-accept="${escapeHtml(patient.id)}">✓ 确认入组</button></footer><div class="team-review-assistant">AI 已为您整理待审核患者，并生成入组依据和推荐团队。</div>` : ''}`;
    panel.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => panel.classList.add('open'));
  }

  function renderInsightPanel() {
    const panel = document.getElementById('teamPatientInsight');
    if (!panel) return;
    if (state.workspaceOpen) {
      renderWorkspacePanel(panel);
      return;
    }
    panel.classList.remove('team-review-workspace');
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
    return `<article class="team-patient-row team-patient-managing-row${menuOpen ? ' menu-open' : ''}" role="row" data-team-patient-id="${escapeHtml(patient.id)}"><div class="team-patient-selection team-patient-cell" role="cell"><input class="team-patient-check" type="checkbox" aria-label="选择${escapeHtml(patient.name)}"></div><div class="team-patient-name-cell team-patient-cell" role="cell"><span class="team-patient-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span><strong>${escapeHtml(patient.name)}</strong></div><div class="team-patient-text-cell team-patient-cell" role="cell">${escapeHtml(patient.gender)}</div><div class="team-patient-text-cell team-patient-cell" role="cell">${patient.age}岁</div><div class="team-patient-code-cell team-patient-cell" role="cell">${escapeHtml(patient.displayVisitNo)}</div><div class="team-patient-code-cell team-patient-cell" role="cell">${escapeHtml(patient.phone)}</div><div class="team-patient-date-cell team-patient-cell" role="cell">${escapeHtml(patient.joinedAt)}</div><div class="team-patient-text-cell team-patient-cell" role="cell">${patient.joinedDays}天</div><div class="team-patient-text-cell team-patient-cell" role="cell">${escapeHtml(patient.manager)}</div><div class="team-patient-plan-cell team-patient-cell" role="cell" title="${escapeHtml(patient.plan)}">${escapeHtml(patient.plan)}</div><div class="team-patient-plan-cell team-patient-cell" role="cell" title="${escapeHtml(patient.node)}">${escapeHtml(patient.node)}</div><div class="team-patient-date-cell team-patient-cell" role="cell">${escapeHtml(patient.nodeDate)}</div><div class="team-patient-status-cell team-patient-cell" role="cell">${patient.overdue ? '<span class="team-patient-overdue">任务已逾期</span>' : '<span class="team-patient-normal">正常</span>'}</div><div class="team-patient-operation team-patient-cell" role="cell"><div class="team-patient-managing-actions"><div class="team-patient-more-wrap"><button type="button" class="team-patient-action team-patient-more" data-team-patient-more="${escapeHtml(patient.id)}" aria-haspopup="menu" aria-expanded="${menuOpen}">更多</button><div class="team-patient-row-menu" role="menu" ${menuOpen ? '' : 'hidden'}><button type="button" role="menuitem" data-mark-patient="${escapeHtml(patient.id)}">标记</button><button type="button" role="menuitem" data-team-view-task="${escapeHtml(patient.id)}">查看任务</button><button type="button" role="menuitem" data-team-adjust-plan="${escapeHtml(patient.id)}">调整方案</button><button type="button" role="menuitem" data-team-adjust-manager="${escapeHtml(patient.id)}">调整健康负责人</button><button type="button" role="menuitem" data-team-close-case="${escapeHtml(patient.id)}">结案出组</button></div></div></div></div></article>`;
  }

  function renderListHeader() {
    if (state.tab === 'managing') {
      return '<div class="team-patient-table-header team-patient-managing-header" role="row"><span role="columnheader" aria-label="选择"></span><span role="columnheader">姓名</span><span role="columnheader">性别</span><span role="columnheader">年龄</span><span role="columnheader">就诊号</span><span role="columnheader">手机号</span><span role="columnheader">入组时间</span><span role="columnheader">在组天数</span><span role="columnheader">健康负责人</span><span role="columnheader">管理方案</span><span role="columnheader">当前任务</span><span role="columnheader">任务日期</span><span role="columnheader">任务状态</span><span role="columnheader">操作</span></div>';
    }
    if (state.tab === 'exited') {
      return '<div class="team-patient-table-header team-patient-exited-header" role="row"><span role="columnheader" aria-label="选择"></span><span role="columnheader">姓名 / 健康标签</span><span role="columnheader">性别</span><span role="columnheader">年龄</span><span role="columnheader">就诊号</span><span role="columnheader">手机号</span><span role="columnheader">患者来源</span><span role="columnheader">出组时间</span><span role="columnheader">操作</span></div>';
    }
    return '<div class="team-patient-table-header team-patient-pending-header" role="row"><span role="columnheader" aria-label="选择"></span><span role="columnheader">姓名 / 健康标签</span><span role="columnheader">性别</span><span role="columnheader">年龄</span><span role="columnheader">就诊号</span><span role="columnheader">手机号</span><span role="columnheader">患者来源</span><span role="columnheader">申请时间</span><span role="columnheader">入组评估</span><span role="columnheader">操作</span></div>';
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
    list.setAttribute('role', 'table');
    list.setAttribute('aria-rowcount', String(visible.length + 1));
    const listScrollLeft = list.scrollLeft;
    const listScrollTop = list.scrollTop;
    list.innerHTML = renderListHeader() + (visible.length ? visible.map(patient => state.tab === 'managing' ? renderManagingRow(patient) : state.tab === 'exited' ? renderExitedRow(patient) : renderPendingRow(patient)).join('') : '<div class="team-patient-empty"><span class="team-patient-empty-icon" aria-hidden="true"></span><strong>暂无符合条件的患者</strong><span>调整搜索或筛选条件后再试</span></div>');
    list.scrollLeft = listScrollLeft;
    list.scrollTop = listScrollTop;
    const openMenu = list.querySelector('.team-patient-managing-row.menu-open .team-patient-row-menu');
    if (openMenu) {
      const trigger = openMenu.parentElement.querySelector('[data-team-patient-more]');
      const spaceBelow = list.getBoundingClientRect().bottom - trigger.getBoundingClientRect().bottom;
      openMenu.classList.toggle('opens-up', spaceBelow < openMenu.offsetHeight + 8);
    }
    pagination.innerHTML = `<span>共 ${rows.length} 条</span><button type="button" class="team-patient-page" data-team-patient-page="prev" ${state.page === 1 ? 'disabled' : ''} aria-label="上一页">‹</button><button type="button" class="team-patient-page active" aria-current="page">${state.page}</button><button type="button" class="team-patient-page" data-team-patient-page="next" ${state.page === totalPages ? 'disabled' : ''} aria-label="下一页">›</button><select class="team-patient-page-size" data-team-patient-page-size aria-label="每页条数"><option value="20" ${state.pageSize === 20 ? 'selected' : ''}>20 条/页</option><option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10 条/页</option></select>`;
    renderInsightPanel();
  }

  let executionReturnFocus = null;

  function closeExecutionRecord() {
    document.getElementById('teamPatientExecutionRecord')?.remove();
    document.body.classList.remove('team-execution-open');
    executionReturnFocus?.focus?.();
    executionReturnFocus = null;
  }

  function openExecutionRecord(id) {
    const patient = currentProfile().patients.find(item => item.id === id);
    if (!patient) return;
    const records = patient.executionRecords || [];
    executionReturnFocus = document.activeElement;
    document.getElementById('teamPatientExecutionRecord')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'teamPatientExecutionRecord';
    overlay.className = 'team-execution-overlay';
    const recordCards = records.map(record => `<article class="team-execution-card"><h3>${escapeHtml(record.title || (record.reason === '入组申请未通过' ? '入组审核' : '管理记录'))}</h3><p><span>执行时间</span><strong>${escapeHtml(record.date || record.endedAt || record.startedAt || '--')}</strong></p><p><span>执行结果</span><strong>${escapeHtml(record.result || record.reason || '--')}</strong></p>${record.manager ? `<p><span>健康负责人</span><strong>${escapeHtml(record.manager)}</strong></p>` : ''}${record.plan ? `<p><span>管理方案</span><strong>${escapeHtml(record.plan)}</strong></p>` : ''}<div class="team-execution-summary">${escapeHtml(record.summary || '暂无管理说明')}</div></article>`).join('');
    overlay.innerHTML = `<div class="team-execution-backdrop" data-team-execution-close></div><aside class="team-execution-drawer" role="dialog" aria-modal="true" aria-labelledby="teamExecutionTitle"><header><div><h2 id="teamExecutionTitle">管理记录</h2><p>${escapeHtml(patient.name)} · ${escapeHtml(patient.gender)} · ${patient.age}岁</p></div><button type="button" data-team-execution-close aria-label="关闭管理记录">×</button></header><div class="team-execution-body"><p class="team-execution-count">共 ${records.length} 条记录</p>${recordCards || '<div class="team-execution-empty">暂无管理记录</div>'}</div></aside>`;
    document.body.append(overlay);
    document.body.classList.add('team-execution-open');
    overlay.querySelector('.team-execution-drawer [data-team-execution-close]')?.focus();
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
    const previousState = patient.state;
    if (nextState === 'managing') {
      patient.displayVisitNo ||= patient.id;
      patient.joinedAt = previousState === 'exited' ? '2026/11/06' : patient.joinedAt || '2026/11/06';
      patient.joinedDays = previousState === 'exited' ? 1 : patient.joinedDays || 1;
      patient.manager ||= '待分配';
      patient.plan ||= state.team === 'hypertension' ? '高血压标准随访方案' : '28天体重血糖管理方案';
      patient.node ||= '首次入组评估';
      patient.nodeDate = previousState === 'exited' ? '2026/11/06' : patient.nodeDate || '2026/11/06';
      patient.overdue = Boolean(patient.overdue);
      patient.warning = Boolean(patient.warning);
      if (previousState === 'exited') {
        patient.executionRecords ||= [];
        patient.executionRecords.unshift({ date: patient.joinedAt, title: '重新入组', result: '已入组', summary: '完成重新入组，沿用既往管理记录并开启新一轮健康管理。', manager: patient.manager, plan: patient.plan });
      }
      if (typeof allPatients !== 'undefined' && !allPatients.some(item => String(item.visitNo) === String(patient.id))) {
        allPatients.push({ name: patient.name, visitNo: patient.id, age: String(patient.age), gender: patient.gender, phone: patient.phone, department: state.team === 'hypertension' ? '心血管内科一病区' : '生殖中心专区', diagnosis: state.team === 'hypertension' ? '高血压健康管理' : '体重与血糖健康管理', tags: patient.tags || [], visitDate: patient.joinedAt, team: currentProfile().name, managementInstitution: '暨南大学附属顺德医院' });
      }
    }
    if (nextState === 'exited') {
      patient.source ||= '手动入组';
      patient.date ||= patient.joinedAt || '2026/11/06';
      patient.exitedAt = '2026/11/06';
      patient.tags = Array.isArray(patient.tags) && patient.tags.length ? patient.tags : ['已完成管理'];
      patient.suggestion ||= '患者已完成当前阶段管理，相关随访记录与管理总结已归档。';
      if (previousState !== 'exited') {
        patient.executionRecords ||= [];
        patient.executionRecords.unshift({ date: patient.exitedAt, title: previousState === 'pending' ? '入组审核' : '出组结案', result: previousState === 'pending' ? '入组申请未通过' : '结案出组', summary: previousState === 'pending' ? '本次入组审核未通过，申请与评估记录已归档。' : '本阶段健康管理已结束，随访记录与管理总结已归档。', manager: patient.manager, plan: patient.plan });
      }
    }
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
    if (event.target.closest('[data-team-execution-close]')) { closeExecutionRecord(); return; }
    if (event.target.closest('[data-team-review-exit]')) {
      closeReviewWorkspace();
      return;
    }
    if (event.target.closest('[data-team-review-collapse]')) {
      state.workspaceSidebarCollapsed = !state.workspaceSidebarCollapsed;
      render();
      return;
    }
    const reviewCategory = event.target.closest('[data-team-review-category]');
    if (reviewCategory) {
      state.workspaceCategory = reviewCategory.dataset.teamReviewCategory;
      render();
      return;
    }
    const reviewMore = event.target.closest('[data-team-review-more]');
    if (reviewMore) {
      toast('患者快捷操作已打开');
      return;
    }
    const reviewPatient = event.target.closest('[data-team-review-select]');
    if (reviewPatient) {
      state.selectedPatientId = reviewPatient.dataset.teamReviewSelect;
      state.workspacePhoneVisible = false;
      render();
      return;
    }
    if (event.target.closest('[data-team-review-phone]')) {
      state.workspacePhoneVisible = !state.workspacePhoneVisible;
      render();
      return;
    }
    const reviewAccept = event.target.closest('[data-team-review-accept]');
    if (reviewAccept) {
      changePatientState(reviewAccept.dataset.teamReviewAccept, 'managing', '已确认{name}入组');
      return;
    }
    const reviewReject = event.target.closest('[data-team-review-reject]');
    if (reviewReject) {
      changePatientState(reviewReject.dataset.teamReviewReject, 'exited', '已拒绝{name}入组');
      return;
    }
    if (event.target.closest('[data-archive-back]') && state.resumeWorkspaceAfterArchive) {
      state.resumeWorkspaceAfterArchive = false;
      setTimeout(() => document.querySelector('[data-patient-team-list]')?.click(), 0);
      return;
    }
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
    const rejoin = event.target.closest('[data-team-patient-rejoin]');
    if (rejoin) { changePatientState(rejoin.dataset.teamPatientRejoin, 'managing', '已将{name}重新入组'); return; }
    const execution = event.target.closest('[data-team-patient-execution]');
    if (execution) { openExecutionRecord(execution.dataset.teamPatientExecution); return; }
    const accept = event.target.closest('[data-team-patient-accept]');
    if (accept) { changePatientState(accept.dataset.teamPatientAccept, 'managing', '已接收{name}入组'); return; }
    const reject = event.target.closest('[data-team-patient-reject]');
    if (reject) { changePatientState(reject.dataset.teamPatientReject, 'exited', '已拒绝{name}入组'); return; }
    const more = event.target.closest('[data-team-patient-more]');
    if (more) { state.actionMenuId = state.actionMenuId === more.dataset.teamPatientMore ? '' : more.dataset.teamPatientMore; render(); return; }
    if (event.target.closest('.team-patient-managing-row [data-mark-patient]')) { state.actionMenuId = ''; render(); return; }
    if (!event.target.closest('.team-patient-more-wrap') && state.actionMenuId) { state.actionMenuId = ''; render(); }
    const closeCase = event.target.closest('[data-team-close-case]');
    if (closeCase) { state.actionMenuId = ''; changePatientState(closeCase.dataset.teamCloseCase, 'exited', '已将{name}结案出组'); return; }
    if (event.target.closest('[data-team-view-task]')) { state.actionMenuId = ''; render(); toast('患者任务列表已打开'); return; }
    if (event.target.closest('[data-team-adjust-plan]')) { state.actionMenuId = ''; render(); toast('管理方案调整已打开'); return; }
    if (event.target.closest('[data-team-adjust-manager]')) { state.actionMenuId = ''; render(); toast('健康负责人调整已打开'); return; }
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
      if (patient) {
        if (state.workspaceOpen) {
          state.resumeWorkspaceAfterArchive = true;
          state.workspaceOpen = false;
          document.body.classList.remove('team-review-workspace-active');
          renderInsightPanel();
        }
        window.openPatientArchiveFromAssistant?.({ name: patient.name, gender: patient.gender, age: patient.age, tab: 'basic' });
      }
      return;
    }
    const patientRow = event.target.closest('.team-patient-row[data-team-patient-id]');
    if (patientRow && state.tab === 'pending' && !event.target.closest('button,input,select,a')) {
      if (typeof window.openTaskProcessor === 'function') {
        state.selectedPatientId = '';
        renderInsightPanel();
        window.openTaskProcessor('enrollment-review', '', 'teamPatients');
      } else {
        state.selectedPatientId = patientRow.dataset.teamPatientId;
        render();
      }
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.getElementById('teamPatientExecutionRecord')) { closeExecutionRecord(); return; }
    const patientRow = event.target.closest('.team-patient-row[data-team-patient-id]');
    if (!patientRow || !['Enter', ' '].includes(event.key)) return;
    if (event.target.closest('button,input,select,a')) return;
    event.preventDefault();
    if (state.tab === 'exited') return;
    if (state.tab !== 'pending') return;
    if (typeof window.openTaskProcessor === 'function') {
      state.selectedPatientId = '';
      renderInsightPanel();
      window.openTaskProcessor('enrollment-review', '', 'teamPatients');
    } else {
      state.selectedPatientId = patientRow.dataset.teamPatientId;
      render();
    }
  });

  window.renderTeamPatientList = render;
  render();
})();
