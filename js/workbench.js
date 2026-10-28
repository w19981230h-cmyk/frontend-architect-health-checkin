(() => {
  const fallbackInstitutions = ['暨南大学附属顺德医院', '容桂社区卫生服务中心', '佛山市顺德区第三人民医院'];
  const tasks = [
    { key: 'archive', symbol: '档', title: '档案待补充', base: 7, unit: '人', action: '前往补充', target: 'patients', description: count => `共${count}位客户的健康档案需要主理人补充` },
    { key: 'report', symbol: '报', title: '报告待出具', base: 5, unit: '份', action: '生成报告', target: 'evaluationReports', description: count => `共${count}份客户健康评估报告待生成` },
    { key: 'reminder', symbol: '醒', title: '客户待提醒', base: 12, unit: '项', action: '查看提醒', target: 'healthTasks', description: count => `当前存在${count}条待提醒的任务事项，需主理人完成客户提醒` },
    { key: 'enrollment-review', symbol: '入', title: '待审核患者入组', base: 5, unit: '人', action: '前往审核', target: 'patients', high: true, description: count => `共${count}个预分组患者待审核` },
    { key: 'phone-completion', symbol: '号', title: '补充患者手机号', base: 5, unit: '人', action: '再次外呼　｜　前往补充', target: 'patients', high: true, description: count => `共${count}位患者缺少有效手机号` },
    { key: 'ai-call-failed', symbol: '呼', title: 'AI外呼失败处理', base: 5, unit: '项', action: '前往审核', target: 'healthTasks', high: true, description: count => `共${count}条外呼失败记录待处理` },
    { key: 'followup-call', symbol: '访', title: '今日待办随访任务', base: 5, unit: '项', action: '前往审核', target: 'healthTasks', description: count => `共${count}位患者待完成电话随访` },
    { key: 'followup-result', symbol: '访', title: '今日待办随访任务', base: 5, unit: '项', action: '前往审核', target: 'healthTasks', description: count => `共${count}份随访结果待审核` },
    { key: 'followup-record', symbol: '访', title: '今日待办随访任务', base: 5, unit: '项', action: '前往审核', target: 'healthTasks', description: count => `共${count}份随访记录待补充` },
    { key: 'followup-due', symbol: '访', title: '今日待办随访任务', base: 5, unit: '项', action: '前往审核', target: 'healthTasks', description: count => `共${count}项随访任务今日到期` }
  ];
  let scope = null;
  let assistantName = 'AI主理人';
  let assistantContextKey = 'global';
  let patientTaskStore = {};
  try {
    const savedAssistantName = localStorage.getItem('aiAssistantName')?.trim();
    assistantName = !savedAssistantName || ['AI智能主理人', 'AI个案管理助手'].includes(savedAssistantName) ? 'AI主理人' : savedAssistantName;
  } catch (_) {}
  try { patientTaskStore = JSON.parse(localStorage.getItem('aiPatientTasks') || '{}') || {}; } catch (_) { patientTaskStore = {}; }

  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  const unique = values => [...new Set((values || []).filter(Boolean))];
  const taskProcessorPatients = [
    { name: '张惠春', gender: '男', age: 57, phone: '133****0000', idCard: '440482320214515493', tags: ['eGFR ≥60', 'CKD3期', '高血压'], risk: '高风险' },
    { name: '李桂芳', gender: '女', age: 63, phone: '138****2216', idCard: '440682196302183028', tags: ['糖尿病', 'CKD2期', '重点随访'], risk: '重点关注' },
    { name: '陈建国', gender: '男', age: 52, phone: '156****8921', idCard: '440681197407123613', tags: ['高血压', '冠心病', '用药管理'], risk: '中风险' },
    { name: '吴秀兰', gender: '女', age: 68, phone: '189****5704', idCard: '440683195806284526', tags: ['慢性肾病', '低盐饮食', '复诊提醒'], risk: '重点关注' },
    { name: '周明远', gender: '男', age: 46, phone: '137****3048', idCard: '440684198003174117', tags: ['肥胖', '血脂异常', '运动干预'], risk: '一般' }
  ];
  const processorTypes = [
    { key: 'enrollment-review', title: '入组审核', base: 5, unit: '人' },
    { key: 'health-task', title: '健康任务', base: 6, unit: '项' },
    { key: 'alert-disposal', title: '预警处置', base: 4, unit: '项' },
    { key: 'evaluation-review', title: '评价审核', base: 3, unit: '项' },
    { key: 'health-assessment', title: '健康评估', base: 5, unit: '份' }
  ];
  const processorTypeAliases = {
    archive: 'health-task', reminder: 'health-task', 'phone-completion': 'health-task', 'followup-call': 'health-task', 'followup-record': 'health-task', 'followup-due': 'health-task',
    'ai-call-failed': 'alert-disposal', 'followup-result': 'evaluation-review', report: 'health-assessment'
  };
  const taskProcessorPatientsByType = {
    'enrollment-review': taskProcessorPatients,
    'health-task': [
      { name: '梁慧敏', gender: '女', age: 61, phone: '135****3186', idCard: '440681196503082041', tags: ['血压随访', '今日到期', '电话任务'], risk: '高优先级' },
      { name: '何志强', gender: '男', age: 55, phone: '136****6722', idCard: '440682197101195517', tags: ['用药提醒', '短信任务', '14:30前'], risk: '待执行' },
      { name: '唐月华', gender: '女', age: 70, phone: '188****0935', idCard: '440683195601240824', tags: ['复诊提醒', '肾功能复查', '明日到期'], risk: '重点任务' },
      { name: '刘国良', gender: '男', age: 49, phone: '159****4018', idCard: '440684197704090036', tags: ['运动随访', '未完成', 'App任务'], risk: '待执行' },
      { name: '郑淑珍', gender: '女', age: 66, phone: '137****8524', idCard: '440681196001131528', tags: ['饮食记录', '已逾期1天', '人工随访'], risk: '已逾期' },
      { name: '罗文彬', gender: '男', age: 58, phone: '180****2357', idCard: '440682196807172513', tags: ['血糖监测', '待回访', '电话任务'], risk: '待执行' }
    ],
    'alert-disposal': [
      { name: '蔡美玲', gender: '女', age: 72, phone: '139****1168', idCard: '440683195402065020', tags: ['血压 182/108', '连续2次', '刚刚'], risk: '紧急预警' },
      { name: '黄建华', gender: '男', age: 64, phone: '158****7740', idCard: '440681196202184537', tags: ['空腹血糖 15.8', '超阈值', '12分钟前'], risk: '高风险' },
      { name: '彭小燕', gender: '女', age: 59, phone: '134****9261', idCard: '440682196711224826', tags: ['体重突增', '3天+2.6kg', '待核实'], risk: '中风险' },
      { name: '林伟东', gender: '男', age: 47, phone: '181****5083', idCard: '440684197903113019', tags: ['心率 118', '持续偏快', '设备上报'], risk: '中风险' }
    ],
    'evaluation-review': [
      { name: '郭丽萍', gender: '女', age: 62, phone: '132****6845', idCard: '440681196408273040', tags: ['阶段评价', 'AI已生成', '待审核'], risk: '待审核' },
      { name: '曾国庆', gender: '男', age: 56, phone: '150****3379', idCard: '440682197006153539', tags: ['方案评价', '目标未达成', '需复核'], risk: '重点关注' },
      { name: '邓雅琴', gender: '女', age: 45, phone: '186****7920', idCard: '440683198108091525', tags: ['月度评价', '数据完整', '待确认'], risk: '待审核' }
    ],
    'health-assessment': [
      { name: '苏志明', gender: '男', age: 65, phone: '133****2471', idCard: '440681196104125514', tags: ['综合评估', '数据已齐', '待出具'], risk: '高风险' },
      { name: '冯玉兰', gender: '女', age: 58, phone: '189****6304', idCard: '440682196812203027', tags: ['心血管评估', '检验18项', '待生成'], risk: '中风险' },
      { name: '马振宇', gender: '男', age: 51, phone: '157****4082', idCard: '440683197509163518', tags: ['糖尿病评估', '随访6次', '待生成'], risk: '重点关注' },
      { name: '谢晓梅', gender: '女', age: 69, phone: '138****5196', idCard: '440684195708242528', tags: ['老年综合评估', '量表已完成', '待出具'], risk: '高风险' },
      { name: '袁绍辉', gender: '男', age: 43, phone: '182****9653', idCard: '440681198305077514', tags: ['体重评估', '周期结束', '待确认'], risk: '一般' }
    ]
  };
  const taskProcessorProfiles = {
    archive: { queueTitle: '档案待补充', hint: '核对缺失字段并完善患者主档', assistant: 'AI 已识别档案缺失项，并按影响健康管理的程度完成排序。', analysisTitle: '档案完整性分析', analysis: '患者既往疾病记录与近期检验结果存在关联，但用药史、过敏史和紧急联系人仍不完整，建议补齐后再开展后续服务。', highlights: [['缺失字段', '用药情况、过敏史、紧急联系人'], ['最近来源', '2026-10-26 肾内科门诊病历'], ['完整度', '72% · 需补充']], sectionTitle: '补充档案信息', sectionHint: '保存后同步更新患者主档', fields: [['现用药物', '氨氯地平片 5mg，每日一次', 'text'], ['药物过敏史', '青霉素', 'text'], ['紧急联系人', '请输入姓名和联系电话', 'text']], actions: [['暂不处理', 'default'], ['保存档案', 'primary']] },
    report: { queueTitle: '报告待出具', hint: '确认数据范围并生成健康评估报告', assistant: 'AI 已汇总最近 90 天健康数据，可直接生成报告，也可先调整报告范围。', analysisTitle: '报告生成建议', analysis: '近 30 天血压波动较大，eGFR 呈下降趋势。建议在报告中突出肾功能与心血管风险，并给出复诊和用药依从性建议。', highlights: [['报告类型', '综合健康评估报告'], ['数据范围', '最近 90 天'], ['可用数据', '检验 18 项、随访 6 次']], sectionTitle: '报告配置', sectionHint: '生成前确认报告模板与数据范围', fields: [['报告模板', '慢病综合评估模板', 'select'], ['数据范围', '最近90天', 'select'], ['报告备注', '重点说明肾功能变化及复诊建议', 'textarea']], actions: [['保存草稿', 'default'], ['生成报告', 'primary']] },
    reminder: { queueTitle: '客户待提醒', hint: '选择触达方式并完成客户提醒', assistant: 'AI 已根据服务节点整理提醒内容，建议优先电话联系高风险患者。', analysisTitle: '提醒策略建议', analysis: '患者明日需要复查肾功能，且最近一次电话未接通。建议先电话联系，未接通时自动补发短信提醒。', highlights: [['提醒事项', '肾功能复查与用药确认'], ['计划时间', '今天 15:30 前'], ['最近触达', '10月26日电话未接通']], sectionTitle: '执行客户提醒', sectionHint: '确认提醒渠道和发送内容', fields: [['提醒渠道', '电话 + 短信', 'select'], ['计划联系时间', '2026-10-27 14:30', 'text'], ['提醒内容', '请按预约时间完成肾功能复查，并携带近期用药清单。', 'textarea']], actions: [['稍后处理', 'default'], ['完成提醒', 'primary']] },
    'enrollment-review': { queueTitle: '待审核患者入组', hint: '审核 AI 推荐分组与健康管理方案', assistant: 'AI 已为您整理待审核患者，并生成入组依据和推荐团队。', analysisTitle: '智能入组分析', analysis: '患者为高龄高血压合并 CKD3 期人群，eGFR 持续下降，符合肾病慢病管理团队入组标准，建议纳入重点管理。', highlights: [['推荐团队', '肾内科慢病管理团队'], ['推荐方案', 'CKD 分级随访管理方案'], ['匹配程度', '92% · 高匹配']], sectionTitle: '入组审核', sectionHint: '确认团队、方案并填写审核意见', fields: [['入组团队', '肾内科慢病管理团队', 'select'], ['健康管理方案', 'CKD 分级随访管理方案', 'select'], ['审核意见', '符合入组条件，建议重点关注肾功能及血压变化。', 'textarea']], actions: [['拒绝入组', 'danger'], ['确认入组', 'primary']] },
    'phone-completion': { queueTitle: '补充患者手机号', hint: '核对患者身份并补录有效联系电话', assistant: 'AI 已从就诊登记信息中发现一个候选号码，请人工核对后保存。', analysisTitle: '联系方式核验', analysis: '当前主档手机号缺失，门诊登记中存在候选号码 133****0000。最近一次外呼由家属接听，需要确认号码归属。', highlights: [['候选号码', '133****0000'], ['号码来源', '2026-10-26 门诊登记'], ['核验状态', '待人工确认']], sectionTitle: '补充联系方式', sectionHint: '保存前请确认号码归属和授权情况', fields: [['患者手机号', '13326678484', 'text'], ['号码归属', '患者本人', 'select'], ['核验备注', '已通过就诊登记信息核对', 'textarea']], actions: [['再次外呼', 'default'], ['保存手机号', 'primary']] },
    'ai-call-failed': { queueTitle: 'AI外呼失败处理', hint: '查看失败原因并选择后续处理方式', assistant: 'AI 已汇总外呼失败原因，建议对连续未接通患者转为人工联系。', analysisTitle: '外呼失败分析', analysis: '过去 24 小时已尝试外呼 3 次，其中 2 次无人接听、1 次忙线。继续自动重呼的成功率较低，建议人工联系或补发短信。', highlights: [['失败原因', '无人接听 / 忙线'], ['尝试次数', '3 次'], ['最后外呼', '今天 11:24']], sectionTitle: '失败处理', sectionHint: '选择后续触达方式并记录处理结果', fields: [['处理方式', '转人工联系', 'select'], ['下次联系时间', '2026-10-27 16:00', 'text'], ['处理备注', '若仍未接通，发送复诊提醒短信。', 'textarea']], actions: [['再次外呼', 'default'], ['标记已处理', 'primary']] },
    'followup-call': { queueTitle: '电话随访任务', hint: '按随访提纲完成电话沟通', assistant: 'AI 已根据患者近期指标生成本次电话随访提纲。', analysisTitle: '随访前摘要', analysis: '患者近一周家庭血压均值 148/92mmHg，高于目标范围；用药依从性一般，建议本次重点确认漏服原因与不良反应。', highlights: [['随访主题', '血压与用药依从性'], ['上次随访', '2026-10-20'], ['需关注', '连续 3 天血压偏高']], sectionTitle: '电话随访记录', sectionHint: '勾选已确认事项并填写患者反馈', fields: [['接听情况', '患者本人接听', 'select'], ['随访结果', '已确认用药情况，患者无明显不良反应。', 'textarea'], ['下次随访', '2026-11-03', 'text']], actions: [['保存草稿', 'default'], ['完成随访', 'primary']] },
    'followup-result': { queueTitle: '随访结果待审核', hint: '审核随访结论与异常处置建议', assistant: 'AI 已标记随访记录中的异常指标和需要复核的结论。', analysisTitle: '审核风险提示', analysis: '随访结论提到患者出现轻度头晕，但未记录发生频次和与用药的关系。建议补充后再确认本次随访结果。', highlights: [['记录人员', '李敏 健康管理师'], ['提交时间', '今天 10:18'], ['异常项', '头晕、血压偏高']], sectionTitle: '审核随访结果', sectionHint: '确认结论、异常等级与后续动作', fields: [['审核结论', '建议通过并补充观察', 'select'], ['异常等级', '中风险', 'select'], ['审核意见', '补充头晕发生频次，并持续监测未来 3 天血压。', 'textarea']], actions: [['退回修改', 'danger'], ['通过审核', 'primary']] },
    'followup-record': { queueTitle: '随访记录待补充', hint: '补齐随访过程与后续安排', assistant: 'AI 已从通话摘要中提取关键信息，可在确认后写入正式随访记录。', analysisTitle: '通话内容提取', analysis: '患者自述血压近期有所升高，存在两次漏服；无胸痛、气促等不适。计划继续当前方案并加强提醒。', highlights: [['通话时长', '6 分 24 秒'], ['信息来源', '人工电话随访'], ['待补字段', '患者反馈、后续计划']], sectionTitle: '补充随访记录', sectionHint: '确认 AI 提取内容并完善记录', fields: [['患者反馈', '近期工作较忙，发生两次漏服。', 'textarea'], ['干预措施', '设置每日用药提醒，继续监测血压。', 'textarea'], ['复查安排', '一周后复查血压记录', 'text']], actions: [['保存草稿', 'default'], ['保存记录', 'primary']] },
    'followup-due': { queueTitle: '今日到期随访', hint: '处理今日到期或即将逾期的任务', assistant: 'AI 已按到期时间和患者风险排序，建议优先处理当前高风险患者。', analysisTitle: '到期任务分析', analysis: '该任务今天 17:00 到期，关联患者为重点管理对象。若无法按时完成，应调整日期并填写原因，避免任务无说明逾期。', highlights: [['截止时间', '今天 17:00'], ['任务状态', '剩余 2 小时 18 分'], ['任务优先级', '高优']], sectionTitle: '到期任务处理', sectionHint: '完成任务或调整计划时间', fields: [['处理状态', '计划今日完成', 'select'], ['计划完成时间', '2026-10-27 16:30', 'text'], ['处理说明', '已联系患者，等待回电确认。', 'textarea']], actions: [['调整日期', 'default'], ['完成任务', 'primary']] },
    'health-task': { queueTitle: '待执行健康任务', hint: '集中处理随访、提醒与监测任务', assistant: 'AI 已按到期时间、患者风险和触达难度排列健康任务。', analysisTitle: '任务执行建议', analysis: '该患者今日需完成血压随访，近 3 天家庭血压高于目标范围。建议优先电话确认用药情况，并同步安排后续复测。', highlights: [['任务类型', '电话随访'], ['截止时间', '今天 17:00'], ['执行优先级', '高优']], sectionTitle: '健康任务处理', sectionHint: '记录执行结果并安排下一步计划', fields: [['执行状态', '患者本人已接听', 'select'], ['完成时间', '2026-10-27 15:30', 'text'], ['执行记录', '已确认近期血压与用药情况，安排 3 天后复测。', 'textarea']], actions: [['暂缓处理', 'default'], ['完成任务', 'primary']] },
    'alert-disposal': { queueTitle: '待处置健康预警', hint: '核实异常指标并完成分级处置', assistant: 'AI 已按预警等级与持续时间排序，紧急预警请优先联系患者。', analysisTitle: '预警风险分析', analysis: '患者连续两次血压达到 182/108mmHg，已超过紧急预警阈值。建议立即电话核实症状，必要时指导就医并通知责任医生。', highlights: [['异常指标', '血压 182/108mmHg'], ['预警等级', '紧急'], ['首次触发', '今天 14:08']], sectionTitle: '预警处置', sectionHint: '记录核实结果、处置方式和后续跟踪', fields: [['核实结果', '患者自述轻度头晕', 'select'], ['处置方式', '通知责任医生并建议立即就医', 'select'], ['处置记录', '已电话联系患者及家属，责任医生已接收预警。', 'textarea']], actions: [['标记误报', 'default'], ['完成处置', 'primary']] },
    'evaluation-review': { queueTitle: '待审核健康评价', hint: '复核阶段评价结论与方案调整建议', assistant: 'AI 已标记评价结论中的异常项和证据不足项，供审核时重点确认。', analysisTitle: '评价审核提示', analysis: '本周期血压达标率由 62% 提升至 78%，但运动任务完成度仅 45%。建议保留当前用药管理目标，并加强运动干预。', highlights: [['评价周期', '2026-09-27 至 2026-10-27'], ['目标达成', '3 / 5 项'], ['建议调整', '加强运动干预']], sectionTitle: '评价审核', sectionHint: '确认评价结论并决定是否调整管理方案', fields: [['审核结论', '评价结论基本准确', 'select'], ['方案调整', '增加每周运动指导任务', 'select'], ['审核意见', '通过评价，下一周期重点提升运动任务完成率。', 'textarea']], actions: [['退回修改', 'danger'], ['通过审核', 'primary']] },
    'health-assessment': { queueTitle: '待出具健康评估', hint: '核对评估数据并生成正式报告', assistant: 'AI 已汇总患者近期档案、检验、监测和随访数据，可辅助生成健康评估。', analysisTitle: '健康评估摘要', analysis: '患者近 90 天血压控制不稳定，eGFR 较上周期下降 6%。综合评估提示心肾风险升高，建议强化复诊和用药依从性管理。', highlights: [['评估类型', '综合健康评估'], ['数据范围', '最近 90 天'], ['风险等级', '高风险']], sectionTitle: '健康评估', sectionHint: '确认评估模板、数据范围与报告结论', fields: [['评估模板', '慢病综合健康评估模板', 'select'], ['数据范围', '最近 90 天', 'select'], ['评估结论', '心肾风险较上周期升高，建议加强复诊与指标监测。', 'textarea']], actions: [['保存草稿', 'default'], ['生成评估报告', 'primary']] }
  };
  let taskProcessorState = { key: 'enrollment-review', patientIndex: 0, institution: fallbackInstitutions[0], completed: new Set() };
  const currentInstitutions = () => {
    const names = unique(scope?.institutionNames);
    return names.length ? names : fallbackInstitutions;
  };
  const taskCount = (task, institution, index) => {
    if (index === 0) return task.base;
    const seed = [...`${task.key}${institution}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const spread = Math.max(1, Math.round(task.base * .18));
    return Math.max(1, task.base + seed % (spread * 2 + 1) - spread);
  };
  const buildInstitutionTasks = institutions => institutions.map((institution, institutionIndex) => ({ institution, tasks: tasks.map(task => ({ ...task, count: taskCount(task, institution, institutionIndex) })) }));
  const processorTask = key => processorTypes.find(task => task.key === (processorTypeAliases[key] || key)) || processorTypes[0];
  const processorProfile = key => taskProcessorProfiles[key] || taskProcessorProfiles.archive;
  const processorPatients = () => taskProcessorPatientsByType[taskProcessorState.key] || taskProcessorPatients;
  const processorField = ([label, value, kind], index) => {
    const id = `taskProcessorField${index}`;
    if (kind === 'textarea') return `<label class="task-processor-field task-processor-field-wide" for="${id}"><span>${escapeHtml(label)}</span><textarea id="${id}" rows="3">${escapeHtml(value)}</textarea></label>`;
    if (kind === 'select') return `<label class="task-processor-field" for="${id}"><span>${escapeHtml(label)}</span><select id="${id}"><option>${escapeHtml(value)}</option><option>待进一步确认</option><option>转人工处理</option></select></label>`;
    return `<label class="task-processor-field" for="${id}"><span>${escapeHtml(label)}</span><input id="${id}" value="${escapeHtml(value)}"></label>`;
  };
  const renderTaskProcessorActions = profile => {
    const host = document.getElementById('taskProcessorActions');
    if (!host) return;
    host.innerHTML = profile.actions.map(([label, tone]) => `<button type="button" class="task-action-btn ${tone}" data-task-processor-action="${escapeHtml(label)}">${tone === 'primary' ? '<span aria-hidden="true">✓</span>' : tone === 'danger' ? '<span aria-hidden="true">×</span>' : ''}${escapeHtml(label)}</button>`).join('');
  };
  const renderTaskProcessorQueue = (task, profile) => {
    const title = document.getElementById('taskProcessorQueueTitle');
    const progress = document.getElementById('taskProcessorQueueProgress');
    const assistantTrigger = document.getElementById('taskProcessorAssistantTrigger');
    const host = document.getElementById('taskProcessorPatientList');
    if (title) title.textContent = '待办事项';
    const patients = processorPatients();
    const done = patients.filter((_, index) => taskProcessorState.completed.has(`${task.key}:${index}`)).length;
    const pending = patients.length - done;
    if (progress) progress.textContent = `共 ${pending}${task.unit}`;
    if (assistantTrigger) {
      assistantTrigger.dataset.taskProcessorAssistantMessage = profile.assistant;
      assistantTrigger.setAttribute('aria-label', `打开AI主理人：${profile.assistant}`);
    }
    if (!host) return;
    const visiblePatients = patients.map((patient, index) => ({ patient, index })).filter(({ index }) => !taskProcessorState.completed.has(`${task.key}:${index}`));
    if (visiblePatients.length && !visiblePatients.some(({ index }) => index === taskProcessorState.patientIndex)) taskProcessorState.patientIndex = visiblePatients[0].index;
    if (!visiblePatients.length) {
      host.innerHTML = '<p class="task-processor-empty">暂无待处理任务</p>';
      return;
    }
    host.innerHTML = visiblePatients.map(({ patient, index }) => {
      const selected = index === taskProcessorState.patientIndex;
      return `<button type="button" class="task-patient-card${selected ? ' selected' : ''}" data-task-processor-patient="${index}" aria-pressed="${selected}"><span class="task-patient-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span><span class="task-patient-copy"><strong>${escapeHtml(patient.name)}<em>${escapeHtml(patient.risk)}</em></strong><small>${escapeHtml(patient.phone)} · ${patient.gender} · ${patient.age}岁</small><span>${patient.tags.map(tag => `<i>${escapeHtml(tag)}</i>`).join('')}</span></span><b>待处理</b></button>`;
    }).join('');
  };
  const renderTaskProcessorContent = (task, profile) => {
    const patients = processorPatients();
    const patient = patients[taskProcessorState.patientIndex] || patients[0];
    const host = document.getElementById('taskProcessorContent');
    if (!host) return;
    const patientCompleted = taskProcessorState.completed.has(`${task.key}:${taskProcessorState.patientIndex}`);
    if (!patient || patientCompleted) {
      const actions = document.getElementById('taskProcessorActions');
      if (actions) actions.innerHTML = '';
      host.innerHTML = '<section class="task-processor-content-empty"><strong>暂无待处理任务</strong><span>切换其他待办类型继续查看。</span></section>';
      return;
    }
    host.innerHTML = `<section class="task-patient-hero"><div class="task-patient-identity"><span class="task-patient-large-avatar" aria-hidden="true">${escapeHtml(patient.name.slice(-1))}</span><div><p><strong>${escapeHtml(patient.name)}</strong><em>${escapeHtml(patient.risk)}</em></p><span>${patient.gender} · ${patient.age}岁　手机号：${escapeHtml(patient.phone)}</span><small>身份证号：${escapeHtml(patient.idCard)}</small><div>${patient.tags.map(tag => `<i>${escapeHtml(tag)}</i>`).join('')}</div></div></div><button type="button" class="task-archive-button" data-task-processor-archive>查看患者档案</button></section><section class="task-analysis-card"><header><span aria-hidden="true">✦</span><div><strong>${escapeHtml(profile.analysisTitle)}</strong><small>由 AI 根据患者档案与任务数据生成</small></div></header><p>${escapeHtml(profile.analysis)}</p><div class="task-analysis-highlights">${profile.highlights.map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join('')}</div></section><section class="task-handling-card"><header><div><strong>${escapeHtml(profile.sectionTitle)}</strong><small>${escapeHtml(profile.sectionHint)}</small></div><span>${escapeHtml(task.title)}</span></header><div class="task-processor-fields">${profile.fields.map(processorField).join('')}</div></section><p class="task-ai-disclaimer">AI 辅助整理内容仅供参考，请结合患者实际情况核对确认。</p>`;
  };
  const renderTaskProcessor = () => {
    const task = processorTask(taskProcessorState.key);
    const profile = processorProfile(task.key);
    const tabs = document.getElementById('taskProcessorTabs');
    if (tabs) tabs.innerHTML = processorTypes.map(item => `<button type="button" class="task-processor-tab${item.key === task.key ? ' active' : ''}" role="tab" aria-selected="${item.key === task.key}" tabindex="${item.key === task.key ? '0' : '-1'}" data-task-processor-tab="${item.key}">${escapeHtml(item.title)}</button>`).join('');
    const hint = document.getElementById('taskProcessorTypeHint');
    if (hint) hint.textContent = `${taskProcessorState.institution} · ${profile.hint}`;
    renderTaskProcessorActions(profile);
    renderTaskProcessorQueue(task, profile);
    renderTaskProcessorContent(task, profile);
  };
  const openTaskProcessor = (taskKey, institutionName) => {
    taskProcessorState.key = processorTask(taskKey).key;
    taskProcessorState.patientIndex = 0;
    taskProcessorState.institution = institutionName || currentInstitutions()[0];
    window.showListView?.('workbenchTasks');
    renderTaskProcessor();
    document.getElementById('workbenchTaskProcessorView')?.scrollTo({ top: 0 });
  };
  let processorToastTimer;
  const showTaskProcessorToast = message => {
    const toast = document.getElementById('taskProcessorToast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(processorToastTimer);
    processorToastTimer = window.setTimeout(() => { toast.hidden = true; }, 2400);
  };
  const sumByKey = (groups, key) => groups.reduce((sum, group) => sum + (group.tasks.find(task => task.key === key)?.count || 0), 0);
  const sumScopeMetric = (groups, key, base) => groups.reduce((sum, group, index) => sum + taskCount({ key, base }, group.institution, index), 0);
  const renderStats = groups => {
    const host = document.getElementById('workbenchStats');
    if (!host) return;
    const stats = [
      ['今日提醒', sumByKey(groups, 'reminder'), '项', `${groups.length}家机构今日需处理`],
      ['今日建档', sumScopeMetric(groups, 'created', 5), '人', '今日新增客户档案'],
      ['在管客户', sumScopeMetric(groups, 'managed', 86), '人', `${groups.length}家机构服务中`],
      ['服务完成客户', sumScopeMetric(groups, 'completedClients', 18), '人', '已完成服务路径']
    ];
    const tones = ['reminder', 'archive', 'managed', 'completed'];
    host.innerHTML = stats.map(([label, value, unit, hint], index) => `<div class="workbench-stat" data-tone="${tones[index]}"><span>${label}</span><strong>${value}</strong><b>${unit}</b><small>${escapeHtml(hint)}</small></div>`).join('');
  };
  const renderTasks = groups => {
    const host = document.getElementById('workbenchTodos');
    if (!host) return;
    host.innerHTML = groups.map(group => {
      const total = group.tasks.reduce((sum, task) => sum + task.count, 0);
      const rows = group.tasks.map(task => `<button type="button" class="workbench-institution-task" data-task-tone="${task.key}" data-workbench-task-key="${task.key}" data-workbench-institution="${escapeHtml(group.institution)}" data-workbench-target="${task.target}" aria-label="${escapeHtml(group.institution)} ${task.title} ${task.count}${task.unit}，${task.action}"><span class="workbench-task-symbol">${task.symbol}</span><span class="workbench-institution-task-main"><strong>${task.title}${task.high ? '<em class="workbench-priority">高优</em>' : ''}</strong><small>${escapeHtml(task.description(task.count))}</small></span><span class="workbench-institution-action">${task.action} ›</span></button>`).join('');
      return `<article class="workbench-institution-panel"><header class="workbench-institution-panel-head"><div><strong>${escapeHtml(group.institution)}</strong><small>当前机构待办事项</small></div><span>共${total}项</span></header><div class="workbench-institution-tasks">${rows}</div></article>`;
    }).join('');
  };
  const renderAssistant = groups => {
    const summary = document.getElementById('workbenchScopeSummary');
    if (summary) summary.textContent = groups.length === 1 ? `当前机构：${groups[0].institution}` : `已选择 ${groups.length} 家机构，下方展示 ${groups.length} 个机构待办面板`;
    const insightTitle = document.querySelector('.workbench-ai-insight-title');
    if (insightTitle) {
      let badge = insightTitle.querySelector('.workbench-ai-scope');
      if (!badge) { badge = document.createElement('em'); badge.className = 'workbench-ai-scope'; insightTitle.appendChild(badge); }
      badge.textContent = `${groups.length}家机构`;
    }
    const metrics = document.querySelectorAll('.workbench-ai-metric b');
    [tasks.length * groups.length, sumByKey(groups, 'archive') + sumByKey(groups, 'report'), sumByKey(groups, 'reminder')].forEach((value, index) => { if (metrics[index]) metrics[index].textContent = value; });
    const risk = document.querySelector('.workbench-risk-card');
    if (risk) risk.innerHTML = `<strong>今日服务提醒</strong>${groups.length}家机构共有${sumByKey(groups, 'archive')}位客户档案待补充、${sumByKey(groups, 'report')}份评估报告待出具，以及${sumByKey(groups, 'reminder')}项客户提醒待处理。`;
  };
  const render = detail => {
    if (detail) scope = detail;
    const groups = buildInstitutionTasks(currentInstitutions());
    renderStats(groups);
    renderTasks(groups);
    renderAssistant(groups);
  };
  const openInstitutionTask = (institutionName, target) => {
    window.dispatchEvent(new CustomEvent('setOrganizationScope', { detail: { institutionName } }));
    window.setTimeout(() => document.querySelector(`[data-list-view="${target}"]`)?.click(), 80);
  };
  const applyAssistantName = (name, persist = false) => {
    assistantName = name.trim().slice(0, 12) || 'AI主理人';
    document.querySelectorAll('[data-assistant-name]').forEach(node => { node.textContent = assistantName; });
    document.querySelector('[data-global-ai-close]')?.setAttribute('aria-label', `关闭${assistantName}`);
    const trigger = document.querySelector('[data-global-ai-toggle]');
    if (trigger) trigger.setAttribute('aria-label', trigger.getAttribute('aria-expanded') === 'true' ? `收起${assistantName}` : `打开${assistantName}`);
    if (persist) { try { localStorage.setItem('aiAssistantName', assistantName); } catch (_) {} }
  };
  const finishAssistantNameEdit = (save, refocus = false) => {
    const title = document.getElementById('globalAiTitle');
    if (!title?.classList.contains('editing')) return;
    const originalName = title.dataset.originalName || assistantName;
    const nextName = title.textContent.replace(/\s+/g, ' ').trim().slice(0, 12);
    title.removeAttribute('contenteditable');
    title.removeAttribute('role');
    title.removeAttribute('spellcheck');
    title.removeAttribute('aria-label');
    title.classList.remove('editing');
    delete title.dataset.originalName;
    applyAssistantName(save && nextName ? nextName : originalName, save && Boolean(nextName));
    if (refocus) document.querySelector('[data-global-ai-rename]')?.focus();
  };
  const startAssistantNameEdit = () => {
    const title = document.getElementById('globalAiTitle');
    if (!title || title.classList.contains('editing')) return;
    title.dataset.originalName = assistantName;
    title.textContent = assistantName;
    title.setAttribute('contenteditable', 'true');
    title.setAttribute('role', 'textbox');
    title.setAttribute('spellcheck', 'false');
    title.setAttribute('aria-label', '编辑助手名称，最多12个字符');
    title.classList.add('editing');
    title.focus();
    const range = document.createRange();
    range.selectNodeContents(title);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };
  const assistantAvatar = () => {
    const avatar = document.createElement('span');
    avatar.className = 'global-ai-avatar global-chat-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.innerHTML = '<svg viewBox="0 0 40 40" fill="none"><path d="M20 6.5 23 14l7.5 3-7.5 3-3 7.5-3-7.5-7.5-3 7.5-3 3-7.5Z" fill="currentColor"/><circle cx="30.5" cy="9.5" r="3.5" fill="currentColor" opacity=".72"/><path d="M8 25v9M3.5 29.5h9" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
    return avatar;
  };
  const appendAssistantMessage = (role, title, content, options = {}) => {
    const body = document.getElementById('workbenchChatBody');
    if (!body) return null;
    if (options.replaceWelcome) document.getElementById('globalAiWelcomeRow')?.remove();
    const row = document.createElement('div');
    row.className = `global-chat-row ${role}`;
    const message = document.createElement('div');
    message.className = `workbench-message ${role} live-message`;
    if (role === 'ai') {
      const heading = document.createElement('strong');
      if (options.titleUsesName) {
        heading.append(document.createTextNode('你好，我是'));
        const name = document.createElement('span');
        name.dataset.assistantName = '';
        name.textContent = assistantName;
        heading.append(name);
      } else if (title) heading.textContent = title;
      if (heading.childNodes.length) message.append(heading);
      message.append(document.createTextNode(content));
      row.append(assistantAvatar(), message);
    } else {
      message.textContent = content;
      const avatar = document.createElement('span');
      avatar.className = 'global-chat-user-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>';
      row.append(message, avatar);
    }
    body.append(row);
    body.scrollTop = body.scrollHeight;
    return row;
  };
  const currentPatientContext = () => {
    const archivePage = document.getElementById('patientArchivePage');
    if (archivePage?.classList.contains('active') && archivePage.getAttribute('aria-hidden') !== 'true') {
      const name = archivePage.querySelector('[data-archive-text="name"]')?.textContent?.trim();
      if (name) return { key: `archive:${name}`, name };
    }
    const patientPage = document.getElementById('patientPage');
    if (patientPage?.classList.contains('active')) {
      const name = patientPage.querySelector('[data-patient-text="name"]')?.textContent?.trim();
      if (name) return { key: `patient:${name}`, name };
    }
    return null;
  };
  const patientTasksFor = patientName => Array.isArray(patientTaskStore[patientName]) ? patientTaskStore[patientName] : [];
  const persistPatientTasks = () => { try { localStorage.setItem('aiPatientTasks', JSON.stringify(patientTaskStore)); } catch (_) {} };
  const addPatientTask = (patientName, title) => {
    const task = { id: Date.now(), title: title.slice(0, 40), createdAt: new Date().toLocaleString('zh-CN', { hour12: false }) };
    patientTaskStore[patientName] = [...patientTasksFor(patientName), task];
    persistPatientTasks();
    window.dispatchEvent(new CustomEvent('patientAssistantTaskCreated', { detail: { patientName, task } }));
    return task;
  };
  const quickPromptButton = prompt => `<button type="button" data-workbench-quick="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`;
  const syncAssistantMode = () => {
    const patient = currentPatientContext();
    const assistant = document.getElementById('globalAiAssistant');
    const subtitle = document.querySelector('[data-assistant-subtitle]');
    const scopeBadge = document.querySelector('[data-assistant-scope]');
    const quickRow = document.getElementById('globalAiQuickRow');
    const input = document.getElementById('workbenchChatInput');
    const nextContextKey = patient?.key || 'global';
    assistant?.classList.toggle('patient-scope', Boolean(patient));
    if (patient) {
      if (subtitle) subtitle.textContent = '仅可查询与新增当前患者任务';
      if (scopeBadge) scopeBadge.textContent = `患者权限 · ${patient.name}`;
      if (quickRow) quickRow.innerHTML = ['查档案', '查医嘱', '定任务', '查报告'].map(quickPromptButton).join('');
      if (input) input.placeholder = `仅查询或新增${patient.name}患者的任务...`;
    } else {
      if (subtitle) subtitle.textContent = '可查询患者档案、医学资料、服务与提醒';
      if (scopeBadge) scopeBadge.textContent = '';
      if (quickRow) quickRow.innerHTML = ['今天有哪些客户需要联系？', '哪些客户的报告还没出具？'].map(quickPromptButton).join('');
      if (input) input.placeholder = '输入你想查询的数据或问题...';
    }
    if (nextContextKey !== assistantContextKey) {
      document.getElementById('workbenchChatBody')?.replaceChildren();
      if (patient) appendAssistantMessage('ai', '', `当前已切换到${patient.name}患者的专属权限。只可查询这位患者的数据，或查看、新增这位患者的任务。`, { titleUsesName: true });
      else appendAssistantMessage('ai', '', '当前已切换为全局权限，可以查询机构范围内的患者、任务、随访、预警、外呼与运营数据。', { titleUsesName: true });
      assistantContextKey = nextContextKey;
    }
    return patient;
  };
  const assistantResponse = text => {
    const groups = buildInstitutionTasks(currentInstitutions());
    const total = groups.reduce((sum, group) => sum + group.tasks.reduce((taskSum, task) => taskSum + task.count, 0), 0);
    const completed = sumScopeMetric(groups, 'completedClients', 18);
    const institutions = groups.map(group => group.institution).join('、');
    const activeMenu = document.querySelector('#listPage .submenu-item.active, #listPage .menu-item.active span')?.textContent?.trim() || '当前页面';
    const patient = currentPatientContext();
    if (patient) {
      const root = document.getElementById('patientArchivePage')?.classList.contains('active') ? document.getElementById('patientArchivePage') : document.getElementById('patientPage');
      const value = key => root?.querySelector(`[data-archive-text="${key}"], [data-patient-text="${key}"]`)?.textContent?.trim() || '待补充';
      const addMatch = text.match(/^(?:请)?(?:添加|新增|创建)(?:一条|一个)?任务\s*[：:，,\-]?\s*(.+)$/);
      if (addMatch?.[1]) {
        const task = addPatientTask(patient.name, addMatch[1].trim());
        return { title: '患者任务已添加', content: `已为${patient.name}新增任务“${task.title}”。该任务仅归属于当前患者，不会写入其他患者或全局待办。` };
      }
      if (/如何添加|怎么添加|新增患者任务|添加患者任务/.test(text)) return { title: '添加患者任务', content: `请按“添加任务：任务内容”的格式输入，例如“添加任务：明日上午复查血压”。任务只会归属于${patient.name}。` };
      if (/任务|待办/.test(text)) {
        const patientTasks = patientTasksFor(patient.name);
        return patientTasks.length
          ? { title: `${patient.name}患者任务`, content: `当前共 ${patientTasks.length} 条：${patientTasks.map((task, index) => `${index + 1}. ${task.title}`).join('；')}` }
          : { title: `${patient.name}患者任务`, content: '当前暂无通过助手新增的患者任务。你可以输入“添加任务：任务内容”进行创建。' };
      }
      if (/基本|姓名|年龄|性别|手机|档案/.test(text)) return { title: `${patient.name}患者基本信息`, content: `性别：${value('gender')}；年龄：${value('age').replace(/岁$/, '')}岁；出生年月：${value('birthDate')}；手机号：${value('phone')}。` };
      if (/健康画像|指标|病历|报告|随访|什么数据|能查/.test(text)) return { title: `${patient.name}患者数据查询`, content: '当前患者权限可查询基本信息、健康画像、体重/血压/血糖等指标趋势、病历档案、报告文档和随访记录，并可新增这位患者的任务。' };
      if (/全局|全部|所有|机构|医共体|运营|入组|外呼|高优/.test(text)) return { title: '患者权限限制', content: `当前处于${patient.name}患者的专属权限，只能查询或新增这位患者的任务，不能查看全局汇总、其他患者或机构运营数据。请退出患者档案后使用全局权限。` };
      return { title: `${patient.name}患者专属助手`, content: '当前仅支持查询这位患者的数据，以及查看或新增这位患者的任务。输入“能查什么”或“如何添加患者任务”可查看使用方式。' };
    }
    if (/能做什么|帮助|怎么用|功能/.test(text)) return { title: '可查询内容', content: '你可以询问今日提醒、今日建档、在管客户、服务完成客户，以及档案待补充、报告待出具和客户提醒。' };
    if (/机构|医共体|范围/.test(text)) return { title: '当前查询范围', content: `当前覆盖 ${groups.length} 家机构：${institutions}。后续回答会随顶部机构范围联动更新。` };
    if (/档案|补充/.test(text)) return { title: '档案待补充', content: `当前共有 ${sumByKey(groups, 'archive')} 位客户的健康档案需要主理人补充。` };
    if (/报告|出具/.test(text)) return { title: '报告待出具', content: `当前共有 ${sumByKey(groups, 'report')} 份客户健康评估报告待生成。` };
    if (/提醒|SKU|专家建议|自定义/.test(text)) return { title: '客户提醒', content: `当前共有 ${sumByKey(groups, 'reminder')} 项客户提醒，来源包含SKU服务路径、专家建议和自定义设置。` };
    if (/完成|完成客户/.test(text)) return { title: '服务完成客户', content: `当前机构范围内共有 ${completed} 位客户已完成服务路径。` };
    if (/高优|优先|先处理/.test(text)) return { title: '待办处理建议', content: `建议先补充 ${sumByKey(groups, 'archive')} 位客户的健康档案，再出具 ${sumByKey(groups, 'report')} 份评估报告，并按提醒时间处理 ${sumByKey(groups, 'reminder')} 项客户提醒。` };
    if (/页面|模块|在哪/.test(text)) return { title: '当前位置', content: `你当前位于“${activeMenu}”。AI主理人会悬浮在系统右下角，切换其他菜单后仍可继续对话。` };
    if (/汇总|待办|今日/.test(text)) return { title: '今日待办汇总', content: `当前 ${groups.length} 家机构共有 ${total} 项待办，其中档案待补充 ${sumByKey(groups, 'archive')} 人、报告待出具 ${sumByKey(groups, 'report')} 份、客户提醒 ${sumByKey(groups, 'reminder')} 项。` };
    return { title: '查询建议', content: `我已关联当前 ${groups.length} 家机构的数据。你可以继续询问今日提醒、今日建档、在管客户、服务完成客户或三类今日待办。` };
  };
  const setAssistantOpen = open => {
    const assistant = document.getElementById('globalAiAssistant');
    const panel = document.getElementById('globalAiPanel');
    const trigger = assistant?.querySelector('[data-global-ai-toggle]');
    if (!assistant || !panel || !trigger) return;
    panel.hidden = !open;
    assistant.classList.toggle('open', open);
    if (!open) finishAssistantNameEdit(true);
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? `收起${assistantName}` : `打开${assistantName}`);
    if (open) {
      const patient = syncAssistantMode();
      if (patient) window.openPatientCaseManagerHome?.();
      window.setTimeout(() => document.getElementById('workbenchChatInput')?.focus(), 60);
    }
  };
  window.getGlobalAssistantResponse = assistantResponse;
  window.appendGlobalAssistantMessage = appendAssistantMessage;
  window.getGlobalAssistantName = () => assistantName;
  applyAssistantName(assistantName);
  if (typeof MutationObserver !== 'undefined') {
    const pageObserver = new MutationObserver(() => syncAssistantMode());
    ['patientArchivePage', 'patientPage'].forEach(id => {
      const page = document.getElementById(id);
      if (page) pageObserver.observe(page, { attributes: true, attributeFilter: ['class', 'aria-hidden'] });
    });
  }
  syncAssistantMode();

  document.addEventListener('click', event => {
    if (event.target.closest('[data-global-ai-rename]')) {
      startAssistantNameEdit();
      return;
    }
    const assistantToggle = event.target.closest('[data-global-ai-toggle]');
    if (assistantToggle) {
      setAssistantOpen(assistantToggle.getAttribute('aria-expanded') !== 'true');
      return;
    }
    if (event.target.closest('[data-global-ai-close]')) {
      setAssistantOpen(false);
      document.querySelector('[data-global-ai-toggle]')?.focus();
      return;
    }
    const back = event.target.closest('[data-task-processor-back]');
    if (back) {
      window.showListView?.('workbench');
      return;
    }
    const patientCard = event.target.closest('[data-task-processor-patient]');
    if (patientCard) {
      taskProcessorState.patientIndex = Number(patientCard.dataset.taskProcessorPatient) || 0;
      renderTaskProcessor();
      return;
    }
    const taskTab = event.target.closest('[data-task-processor-tab]');
    if (taskTab) {
      taskProcessorState.key = processorTask(taskTab.dataset.taskProcessorTab).key;
      taskProcessorState.patientIndex = 0;
      renderTaskProcessor();
      return;
    }
    if (event.target.closest('[data-task-processor-archive]')) {
      showTaskProcessorToast(`已打开${processorPatients()[taskProcessorState.patientIndex].name}的患者档案预览`);
      return;
    }
    const taskAction = event.target.closest('[data-task-processor-action]');
    if (taskAction) {
      const patients = processorPatients();
      const patient = patients[taskProcessorState.patientIndex];
      const action = taskAction.dataset.taskProcessorAction;
      if (taskAction.classList.contains('primary') || taskAction.classList.contains('danger')) {
        taskProcessorState.completed.add(`${taskProcessorState.key}:${taskProcessorState.patientIndex}`);
        const next = patients.findIndex((_, index) => !taskProcessorState.completed.has(`${taskProcessorState.key}:${index}`));
        if (next >= 0) taskProcessorState.patientIndex = next;
        renderTaskProcessor();
      }
      showTaskProcessorToast(`${patient.name}：${action}操作已记录`);
      return;
    }
    const row = event.target.closest('[data-workbench-institution]');
    if (row) openTaskProcessor(row.dataset.workbenchTaskKey, row.dataset.workbenchInstitution);
  });
  document.addEventListener('keydown', event => {
    if (event.target?.id === 'globalAiTitle' && event.target.classList.contains('editing')) {
      if (event.key === 'Enter') {
        event.preventDefault();
        finishAssistantNameEdit(true, true);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        finishAssistantNameEdit(false, true);
      }
      return;
    }
    if (event.key === 'Escape' && !document.getElementById('globalAiPanel')?.hidden) {
      setAssistantOpen(false);
      document.querySelector('[data-global-ai-toggle]')?.focus();
    }
  });
  document.addEventListener('input', event => {
    if (event.target?.id !== 'globalAiTitle' || !event.target.classList.contains('editing')) return;
    const normalized = event.target.textContent.replace(/[\r\n]+/g, '').slice(0, 12);
    if (event.target.textContent === normalized) return;
    event.target.textContent = normalized;
    const range = document.createRange();
    range.selectNodeContents(event.target);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
  document.addEventListener('focusout', event => {
    if (event.target?.id === 'globalAiTitle' && event.target.classList.contains('editing')) finishAssistantNameEdit(true);
  });
  window.addEventListener('organizationScopeChange', event => render(event.detail));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => render(window.organizationScope));
  else render(window.organizationScope);
})();
