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
    { name: '张惠春', gender: '男', age: 57, phone: '133****0000', phoneFull: '13348230000', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80', idCard: '440482320214515493', tags: ['eGFR ≥60', 'CKD3期', '高血压'], risk: '高风险' },
    { name: '李桂芳', gender: '女', age: 63, phone: '138****2216', phoneFull: '13868232216', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80', idCard: '440682196302183028', tags: ['糖尿病', 'CKD2期', '重点随访'], risk: '重点关注' },
    { name: '陈建国', gender: '男', age: 52, phone: '156****8921', phoneFull: '15668198921', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80', idCard: '440681197407123613', tags: ['高血压', '冠心病', '用药管理'], risk: '中风险' },
    { name: '吴秀兰', gender: '女', age: 68, phone: '189****5704', phoneFull: '18968355704', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80', idCard: '440683195806284526', tags: ['慢性肾病', '低盐饮食', '复诊提醒'], risk: '重点关注' },
    { name: '周明远', gender: '男', age: 46, phone: '137****3048', phoneFull: '13768433048', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80', idCard: '440684198003174117', tags: ['肥胖', '血脂异常', '运动干预'], risk: '一般' },
    { name: '赵雅琴', gender: '女', age: 59, phone: '136****7812', phoneFull: '13668247812', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80', idCard: '440681196708124528', tags: ['糖化血红蛋白 8.2%', '糖尿病', '饮食干预'], risk: '重点关注' },
    { name: '黄志诚', gender: '男', age: 61, phone: '159****4357', phoneFull: '15968414357', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80', idCard: '440682196503174913', tags: ['血压偏高', '冠心病', '用药调整'], risk: '高风险' },
    { name: '梁国兴', gender: '男', age: 54, phone: '181****6209', phoneFull: '18168276209', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=160&q=80', idCard: '440683197201082715', tags: ['eGFR 48', 'CKD3期', '蛋白尿'], risk: '高风险' },
    { name: '何淑仪', gender: '女', age: 65, phone: '134****9826', phoneFull: '13468159826', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=160&q=80', idCard: '440684196105264628', tags: ['骨质疏松', '跌倒风险', '营养干预'], risk: '中风险' },
    { name: '郑文浩', gender: '男', age: 48, phone: '185****3164', phoneFull: '18568233164', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80', idCard: '440681197802154517', tags: ['BMI 30.2', '脂肪肝', '运动处方'], risk: '重点关注' },
    { name: '谭晓梅', gender: '女', age: 56, phone: '137****5641', phoneFull: '13768325641', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=80', idCard: '440682197007233024', tags: ['甲状腺结节', '定期复查', '检验异常'], risk: '一般' },
    { name: '冯玉珍', gender: '女', age: 70, phone: '188****1475', phoneFull: '18868421475', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80', idCard: '440683195601042527', tags: ['高血压', '房颤', '抗凝管理'], risk: '高风险' }
  ];
  const processorTypes = [
    { key: 'enrollment-review', title: '入组审核', base: 12, unit: '人' },
    { key: 'health-task', title: '健康任务', base: 10, unit: '项' },
    { key: 'alert-disposal', title: '预警处置', base: 8, unit: '项' },
    { key: 'evaluation-review', title: '评价审核', base: 8, unit: '项' },
    { key: 'health-assessment', title: '健康评估', base: 10, unit: '份' }
  ];
  const processorTypeAliases = {
    archive: 'health-task', reminder: 'health-task', 'phone-completion': 'health-task', 'followup-call': 'health-task', 'followup-record': 'health-task', 'followup-due': 'health-task',
    'ai-call-failed': 'alert-disposal', 'followup-result': 'evaluation-review', report: 'health-assessment'
  };
  const taskProcessorPatientsByType = {
    'enrollment-review': taskProcessorPatients,
    'health-task': [
      { name: '梁慧敏', gender: '女', age: 61, phone: '135****3186', phoneFull: '13568243186', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80', idCard: '440681196503082041', tags: ['血压随访', '今日到期', '电话任务'], risk: '高优先级', callCount: 3, callStatus: '外呼成功', callTone: 'success' },
      { name: '何志强', gender: '男', age: 55, phone: '136****6722', phoneFull: '13668126722', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80', idCard: '440682197101195517', tags: ['用药提醒', '短信任务', '14:30前'], risk: '待执行', callCount: 3, callStatus: '外呼失败', callTone: 'failed' },
      { name: '唐月华', gender: '女', age: 70, phone: '188****0935', phoneFull: '18868240935', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80', idCard: '440683195601240824', tags: ['复诊提醒', '肾功能复查', '明日到期'], risk: '重点任务', callCount: 2, callStatus: '待外呼', callTone: 'pending' },
      { name: '刘国良', gender: '男', age: 49, phone: '159****4018', phoneFull: '15968124018', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80', idCard: '440684197704090036', tags: ['运动随访', '未完成', 'App任务'], risk: '待执行', callCount: 0, callStatus: '未入队', callTone: 'inactive' },
      { name: '郑淑珍', gender: '女', age: 66, phone: '137****8524', phoneFull: '13768148524', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=80', idCard: '440681196001131528', tags: ['饮食记录', '已逾期1天', '人工随访'], risk: '已逾期', callCount: 3, callStatus: '外呼成功', callTone: 'success' },
      { name: '罗文彬', gender: '男', age: 58, phone: '180****2357', phoneFull: '18068142357', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80', idCard: '440682196807172513', tags: ['血糖监测', '待回访', '电话任务'], risk: '待执行', callCount: 2, callStatus: '外呼失败', callTone: 'failed' },
      { name: '卢秀英', gender: '女', age: 63, phone: '156****1948', phoneFull: '15668121948', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80', idCard: '440683196302182526', tags: ['体重打卡', '连续漏卡', 'App任务'], risk: '需催办', callCount: 1, callStatus: '待外呼', callTone: 'pending' },
      { name: '邓永强', gender: '男', age: 52, phone: '133****7604', phoneFull: '13368127604', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=160&q=80', idCard: '440684197409203614', tags: ['复诊预约', '明天上午', '电话确认'], risk: '高优先级', callCount: 3, callStatus: '外呼成功', callTone: 'success' },
      { name: '苏丽华', gender: '女', age: 57, phone: '189****4283', phoneFull: '18968124283', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=160&q=80', idCard: '440681196905143029', tags: ['用药随访', '依从性一般', '人工随访'], risk: '待执行', callCount: 2, callStatus: '待外呼', callTone: 'pending' },
      { name: '钟伟民', gender: '男', age: 60, phone: '135****8369', phoneFull: '13568128369', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80', idCard: '440682196604162517', tags: ['饮食打卡', '本周完成5次', 'App任务'], risk: '待确认', callCount: 3, callStatus: '外呼成功', callTone: 'success' }
    ],
    'alert-disposal': [
      { name: '蔡美玲', gender: '女', age: 72, phone: '139****1168', idCard: '440683195402065020', tags: ['血压 182/108', '连续2次', '刚刚'], risk: '紧急预警' },
      { name: '黄建华', gender: '男', age: 64, phone: '158****7740', idCard: '440681196202184537', tags: ['空腹血糖 15.8', '超阈值', '12分钟前'], risk: '高风险' },
      { name: '彭小燕', gender: '女', age: 59, phone: '134****9261', idCard: '440682196711224826', tags: ['体重突增', '3天+2.6kg', '待核实'], risk: '中风险' },
      { name: '林伟东', gender: '男', age: 47, phone: '181****5083', idCard: '440684197903113019', tags: ['心率 118', '持续偏快', '设备上报'], risk: '中风险' },
      { name: '叶淑芬', gender: '女', age: 67, phone: '137****2846', idCard: '440681195903214026', tags: ['血氧 89%', '连续3次', '5分钟前'], risk: '紧急预警' },
      { name: '方国栋', gender: '男', age: 55, phone: '186****6132', idCard: '440682197105162518', tags: ['舒张压 105', '连续偏高', '家庭上报'], risk: '高风险' },
      { name: '莫春兰', gender: '女', age: 62, phone: '150****9471', idCard: '440683196402132527', tags: ['空腹血糖 3.1', '低于阈值', '刚刚'], risk: '高风险' },
      { name: '欧阳杰', gender: '男', age: 49, phone: '159****3768', idCard: '440684197708194513', tags: ['心率 42', '持续偏低', '设备上报'], risk: '中风险' }
    ],
    'evaluation-review': [
      { name: '郭丽萍', gender: '女', age: 62, phone: '132****6845', idCard: '440681196408273040', tags: ['阶段评价', 'AI已生成', '待审核'], risk: '待审核' },
      { name: '曾国庆', gender: '男', age: 56, phone: '150****3379', idCard: '440682197006153539', tags: ['方案评价', '目标未达成', '需复核'], risk: '重点关注' },
      { name: '邓雅琴', gender: '女', age: 45, phone: '186****7920', idCard: '440683198108091525', tags: ['月度评价', '数据完整', '待确认'], risk: '待审核' },
      { name: '潘美华', gender: '女', age: 53, phone: '135****4098', idCard: '440684197303082528', tags: ['饮食评价', '照片12张', 'AI已生成'], risk: '待审核' },
      { name: '高俊峰', gender: '男', age: 50, phone: '138****7516', idCard: '440681197609171514', tags: ['运动评价', '目标达成68%', '需复核'], risk: '重点关注' },
      { name: '罗小玲', gender: '女', age: 58, phone: '188****2639', idCard: '440682196807122526', tags: ['周度评价', '数据完整', '待确认'], risk: '待审核' },
      { name: '许志明', gender: '男', age: 64, phone: '133****9142', idCard: '440683196203142513', tags: ['用药评价', '漏服2次', 'AI已生成'], risk: '重点关注' },
      { name: '马秋月', gender: '女', age: 47, phone: '181****5827', idCard: '440684197910202524', tags: ['月度评价', '饮食偏油', '待审核'], risk: '待审核' }
    ],
    'health-assessment': [
      { name: '苏志明', gender: '男', age: 65, phone: '133****2471', idCard: '440681196104125514', tags: ['综合评估', '数据已齐', '待出具'], risk: '高风险' },
      { name: '冯玉兰', gender: '女', age: 58, phone: '189****6304', idCard: '440682196812203027', tags: ['心血管评估', '检验18项', '待生成'], risk: '中风险' },
      { name: '马振宇', gender: '男', age: 51, phone: '157****4082', idCard: '440683197509163518', tags: ['糖尿病评估', '随访6次', '待生成'], risk: '重点关注' },
      { name: '谢晓梅', gender: '女', age: 69, phone: '138****5196', idCard: '440684195708242528', tags: ['老年综合评估', '量表已完成', '待出具'], risk: '高风险' },
      { name: '袁绍辉', gender: '男', age: 43, phone: '182****9653', idCard: '440681198305077514', tags: ['体重评估', '周期结束', '待确认'], risk: '一般' },
      { name: '杜海燕', gender: '女', age: 60, phone: '136****2754', idCard: '440682196607153026', tags: ['肾功能评估', '检验22项', '待出具'], risk: '高风险' },
      { name: '蒋文涛', gender: '男', age: 57, phone: '159****8421', idCard: '440683196904182519', tags: ['心血管评估', '随访8次', '待生成'], risk: '中风险' },
      { name: '林桂香', gender: '女', age: 66, phone: '137****3916', idCard: '440684196001262528', tags: ['营养评估', '饮食记录完整', '待出具'], risk: '重点关注' },
      { name: '何启明', gender: '男', age: 54, phone: '180****6275', idCard: '440681197208102513', tags: ['睡眠评估', '量表已完成', '待确认'], risk: '一般' },
      { name: '温彩霞', gender: '女', age: 49, phone: '189****5183', idCard: '440682197711193025', tags: ['代谢评估', '检验16项', '待生成'], risk: '中风险' }
    ]
  };
  const taskProcessorProfiles = {
    archive: { queueTitle: '档案待补充', hint: '核对缺失字段并完善患者主档', assistant: 'AI 已识别档案缺失项，并按影响健康管理的程度完成排序。', analysisTitle: '档案完整性分析', analysis: '患者既往疾病记录与近期检验结果存在关联，但用药史、过敏史和紧急联系人仍不完整，建议补齐后再开展后续服务。', highlights: [['缺失字段', '用药情况、过敏史、紧急联系人'], ['最近来源', '2026-10-26 肾内科门诊病历'], ['完整度', '72% · 需补充']], sectionTitle: '补充档案信息', sectionHint: '保存后同步更新患者主档', fields: [['现用药物', '氨氯地平片 5mg，每日一次', 'text'], ['药物过敏史', '青霉素', 'text'], ['紧急联系人', '请输入姓名和联系电话', 'text']], actions: [['暂不处理', 'default'], ['保存档案', 'primary']] },
    report: { queueTitle: '报告待出具', hint: '确认数据范围并生成健康评估报告', assistant: 'AI 已汇总最近 90 天健康数据，可直接生成报告，也可先调整报告范围。', analysisTitle: '报告生成建议', analysis: '近 30 天血压波动较大，eGFR 呈下降趋势。建议在报告中突出肾功能与心血管风险，并给出复诊和用药依从性建议。', highlights: [['报告类型', '综合健康评估报告'], ['数据范围', '最近 90 天'], ['可用数据', '检验 18 项、随访 6 次']], sectionTitle: '报告配置', sectionHint: '生成前确认报告模板与数据范围', fields: [['报告模板', '慢病综合评估模板', 'select'], ['数据范围', '最近90天', 'select'], ['报告备注', '重点说明肾功能变化及复诊建议', 'textarea']], actions: [['保存草稿', 'default'], ['生成报告', 'primary']] },
    reminder: { queueTitle: '客户待提醒', hint: '选择触达方式并完成客户提醒', assistant: 'AI 已根据服务节点整理提醒内容，建议优先电话联系高风险患者。', analysisTitle: '提醒策略建议', analysis: '患者明日需要复查肾功能，且最近一次电话未接通。建议先电话联系，未接通时自动补发短信提醒。', highlights: [['提醒事项', '肾功能复查与用药确认'], ['计划时间', '今天 15:30 前'], ['最近触达', '10月26日电话未接通']], sectionTitle: '执行客户提醒', sectionHint: '确认提醒渠道和发送内容', fields: [['提醒渠道', '电话 + 短信', 'select'], ['计划联系时间', '2026-10-27 14:30', 'text'], ['提醒内容', '请按预约时间完成肾功能复查，并携带近期用药清单。', 'textarea']], actions: [['稍后处理', 'default'], ['完成提醒', 'primary']] },
    'enrollment-review': { queueTitle: '待审核患者入组', assistant: 'AI 已为您整理待审核患者，并生成入组依据和推荐团队。', analysisTitle: 'AI 入组总结', analysis: '患者存在高血压、CKD3 期及 eGFR 持续下降，肾功能与血压异常均与肾内科慢病管理团队的入组标准直接相关，因此被推荐进入该团队重点管理。', highlights: [['推荐团队', '肾内科慢病管理团队'], ['推荐方案', 'CKD 分级随访管理方案'], ['匹配程度', '92% · 高匹配']], fields: [['入组团队', '肾内科慢病管理团队', 'select'], ['健康管理方案', 'CKD 分级随访管理方案', 'select'], ['审核意见', '符合入组条件，建议重点关注肾功能及血压变化。', 'textarea']], actions: [['拒绝入组', 'danger'], ['确认入组', 'primary']] },
    'phone-completion': { queueTitle: '补充患者手机号', hint: '核对患者身份并补录有效联系电话', assistant: 'AI 已从就诊登记信息中发现一个候选号码，请人工核对后保存。', analysisTitle: '联系方式核验', analysis: '当前主档手机号缺失，门诊登记中存在候选号码 133****0000。最近一次外呼由家属接听，需要确认号码归属。', highlights: [['候选号码', '133****0000'], ['号码来源', '2026-10-26 门诊登记'], ['核验状态', '待人工确认']], sectionTitle: '补充联系方式', sectionHint: '保存前请确认号码归属和授权情况', fields: [['患者手机号', '13326678484', 'text'], ['号码归属', '患者本人', 'select'], ['核验备注', '已通过就诊登记信息核对', 'textarea']], actions: [['再次外呼', 'default'], ['保存手机号', 'primary']] },
    'ai-call-failed': { queueTitle: 'AI外呼失败处理', hint: '查看失败原因并选择后续处理方式', assistant: 'AI 已汇总外呼失败原因，建议对连续未接通患者转为人工联系。', analysisTitle: '外呼失败分析', analysis: '过去 24 小时已尝试外呼 3 次，其中 2 次无人接听、1 次忙线。继续自动重呼的成功率较低，建议人工联系或补发短信。', highlights: [['失败原因', '无人接听 / 忙线'], ['尝试次数', '3 次'], ['最后外呼', '今天 11:24']], sectionTitle: '失败处理', sectionHint: '选择后续触达方式并记录处理结果', fields: [['处理方式', '转人工联系', 'select'], ['下次联系时间', '2026-10-27 16:00', 'text'], ['处理备注', '若仍未接通，发送复诊提醒短信。', 'textarea']], actions: [['再次外呼', 'default'], ['标记已处理', 'primary']] },
    'followup-call': { queueTitle: '电话随访任务', hint: '按随访提纲完成电话沟通', assistant: 'AI 已根据患者近期指标生成本次电话随访提纲。', analysisTitle: '随访前摘要', analysis: '患者近一周家庭血压均值 148/92mmHg，高于目标范围；用药依从性一般，建议本次重点确认漏服原因与不良反应。', highlights: [['随访主题', '血压与用药依从性'], ['上次随访', '2026-10-20'], ['需关注', '连续 3 天血压偏高']], sectionTitle: '电话随访记录', sectionHint: '勾选已确认事项并填写患者反馈', fields: [['接听情况', '患者本人接听', 'select'], ['随访结果', '已确认用药情况，患者无明显不良反应。', 'textarea'], ['下次随访', '2026-11-03', 'text']], actions: [['保存草稿', 'default'], ['完成随访', 'primary']] },
    'followup-result': { queueTitle: '随访结果待审核', hint: '审核随访结论与异常处置建议', assistant: 'AI 已标记随访记录中的异常指标和需要复核的结论。', analysisTitle: '审核风险提示', analysis: '随访结论提到患者出现轻度头晕，但未记录发生频次和与用药的关系。建议补充后再确认本次随访结果。', highlights: [['记录人员', '李敏 健康管理师'], ['提交时间', '今天 10:18'], ['异常项', '头晕、血压偏高']], sectionTitle: '审核随访结果', sectionHint: '确认结论、异常等级与后续动作', fields: [['审核结论', '建议通过并补充观察', 'select'], ['异常等级', '中风险', 'select'], ['审核意见', '补充头晕发生频次，并持续监测未来 3 天血压。', 'textarea']], actions: [['退回修改', 'danger'], ['通过审核', 'primary']] },
    'followup-record': { queueTitle: '随访记录待补充', hint: '补齐随访过程与后续安排', assistant: 'AI 已从通话摘要中提取关键信息，可在确认后写入正式随访记录。', analysisTitle: '通话内容提取', analysis: '患者自述血压近期有所升高，存在两次漏服；无胸痛、气促等不适。计划继续当前方案并加强提醒。', highlights: [['通话时长', '6 分 24 秒'], ['信息来源', '人工电话随访'], ['待补字段', '患者反馈、后续计划']], sectionTitle: '补充随访记录', sectionHint: '确认 AI 提取内容并完善记录', fields: [['患者反馈', '近期工作较忙，发生两次漏服。', 'textarea'], ['干预措施', '设置每日用药提醒，继续监测血压。', 'textarea'], ['复查安排', '一周后复查血压记录', 'text']], actions: [['保存草稿', 'default'], ['保存记录', 'primary']] },
    'followup-due': { queueTitle: '今日到期随访', hint: '处理今日到期或即将逾期的任务', assistant: 'AI 已按到期时间和患者风险排序，建议优先处理当前高风险患者。', analysisTitle: '到期任务分析', analysis: '该任务今天 17:00 到期，关联患者为重点管理对象。若无法按时完成，应调整日期并填写原因，避免任务无说明逾期。', highlights: [['截止时间', '今天 17:00'], ['任务状态', '剩余 2 小时 18 分'], ['任务优先级', '高优']], sectionTitle: '到期任务处理', sectionHint: '完成任务或调整计划时间', fields: [['处理状态', '计划今日完成', 'select'], ['计划完成时间', '2026-10-27 16:30', 'text'], ['处理说明', '已联系患者，等待回电确认。', 'textarea']], actions: [['调整日期', 'default'], ['完成任务', 'primary']] },
    'health-task': { queueTitle: '待执行健康任务', assistant: 'AI 已按到期时间、患者风险和触达难度排列健康任务。', analysisTitle: 'AI 任务执行总结', analysis: '本周期共安排 23 项健康任务，已完成 18 项、未完成 3 项、逾期 2 项。最近一次电话随访录音已生成文字摘要，量表结果提示用药依从性仍需提升。', highlights: [['任务完成率', '78%'], ['随访录音', '1 份 · 08:42'], ['量表数据', '3 份已完成']], fields: [['执行状态', '患者本人已接听', 'select'], ['完成时间', '2026-10-27 15:30', 'text'], ['执行记录', '已确认近期血压与用药情况，安排 3 天后复测。', 'textarea']], actions: [['暂缓处理', 'default'], ['完成任务', 'primary']] },
    'alert-disposal': { queueTitle: '待处置健康预警', assistant: 'AI 已按预警等级与持续时间排序，紧急预警请优先联系患者。', analysisTitle: 'AI 预警触发分析', analysis: '患者连续两次血压达到 182/108mmHg，且伴随轻度头晕，已同时满足数值超阈值和连续异常两项规则，因此触发紧急预警。', highlights: [['异常指标', '血压 182/108mmHg'], ['触发规则', '连续 2 次超阈值'], ['预警等级', '紧急']], fields: [['核实结果', '患者自述轻度头晕', 'select'], ['处置方式', '通知责任医生并建议立即就医', 'select'], ['处置记录', '已电话联系患者及家属，责任医生已接收预警。', 'textarea']], actions: [['标记误报', 'default'], ['完成处置', 'primary']] },
    'evaluation-review': { queueTitle: '待审核健康评价', assistant: 'AI 已标记评价结论中的异常项和证据不足项，供审核时重点确认。', analysisTitle: 'AI 食物成分总结', analysis: '近 7 天饮食记录显示碳水化合物和脂肪供能比偏高，蛋白质摄入基本合理，蔬菜摄入不足。晚餐热量占全天 42%，是当前体重控制效果不佳的主要影响因素。', highlights: [['碳水供能比', '52% · 偏高'], ['蛋白质供能比', '16% · 合理'], ['脂肪供能比', '32% · 偏高']], fields: [['审核结论', '评价结论基本准确', 'select'], ['方案调整', '增加晚餐控量与蔬菜摄入指导', 'select'], ['审核意见', '通过评价，下周期重点改善晚餐结构。', 'textarea']], actions: [['退回修改', 'danger'], ['通过审核', 'primary']] },
    'health-assessment': { queueTitle: '待出具健康评估', assistant: 'AI 已汇总患者近期档案、检验、监测和随访数据，可辅助生成健康评估。', analysisTitle: 'AI 营养与健康总结', analysis: '患者近期饮食中精制碳水与饱和脂肪占比偏高，蛋白质摄入基本达标。结合血压与肾功能变化，日报应提示当日异常，周报关注趋势，月报形成综合干预建议。', highlights: [['饮食记录', '28 天'], ['异常指标', '4 项'], ['报告周期', '日报 / 周报 / 月报']], fields: [['评估模板', '慢病综合评估模板', 'select'], ['数据范围', '最近 90 天', 'select'], ['评估结论', '心肾风险较上周期升高，建议加强复诊与指标监测。', 'textarea']], actions: [['保存草稿', 'default'], ['生成评估报告', 'primary']] }
  };
  let taskProcessorState = { key: 'enrollment-review', patientIndex: 0, institution: fallbackInstitutions[0], completed: new Set(), phoneVisible: new Set(), queueCollapsed: false, menuPatientIndex: null };
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
  const patientAvatar = (patient, large = false) => `<span class="${large ? 'task-patient-large-avatar' : 'task-patient-avatar'}" aria-hidden="true">${patient.avatar ? `<img src="${escapeHtml(patient.avatar)}" alt="">` : escapeHtml(patient.name.slice(-1))}</span>`;
  const patientPhone = (patient, index, iconOnly = false) => {
    const phoneKey = `${taskProcessorState.key}:${index}`;
    const visible = taskProcessorState.phoneVisible.has(phoneKey);
    const value = visible ? (patient.phoneFull || patient.phone) : patient.phone;
    const eyeIcon = visible
      ? '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="M2 2l16 16M8.6 5.2A8.8 8.8 0 0 1 10 5c5.2 0 8.2 5 8.2 5a12.1 12.1 0 0 1-2.3 2.8M11.8 14.8A8.8 8.8 0 0 1 10 15c-5.2 0-8.2-5-8.2-5a12 12 0 0 1 2.5-2.9M7.7 7.7A3.2 3.2 0 0 0 12.3 12.3"/></svg>'
      : '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="M1.8 10s2.9-5 8.2-5 8.2 5 8.2 5-2.9 5-8.2 5-8.2-5-8.2-5Z"/><circle cx="10" cy="10" r="2.4"/></svg>';
    return `<span class="task-patient-phone"><span>${escapeHtml(value)}</span><button type="button" class="${iconOnly ? 'task-phone-icon-button' : ''}" data-task-phone-toggle="${escapeHtml(phoneKey)}" aria-pressed="${visible}" aria-label="${visible ? '隐藏' : '查看'}${escapeHtml(patient.name)}的完整手机号" title="${visible ? '隐藏手机号' : '查看完整手机号'}">${iconOnly ? eyeIcon : (visible ? '隐藏' : '查看')}</button></span>`;
  };
  const taskRecordingUrls = new Map();
  const taskRecordingUrl = fileName => {
    if (taskRecordingUrls.has(fileName)) return taskRecordingUrls.get(fileName);
    const sampleRate = 8000;
    const seconds = 4;
    const sampleCount = sampleRate * seconds;
    const buffer = new ArrayBuffer(44 + sampleCount * 2);
    const view = new DataView(buffer);
    const writeText = (offset, value) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
    writeText(0, 'RIFF'); view.setUint32(4, 36 + sampleCount * 2, true); writeText(8, 'WAVE'); writeText(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeText(36, 'data'); view.setUint32(40, sampleCount * 2, true);
    for (let index = 0; index < sampleCount; index += 1) {
      const time = index / sampleRate;
      const envelope = Math.min(1, index / 500, (sampleCount - index) / 700);
      const modulation = Math.sin(2 * Math.PI * 3.2 * time) * 18;
      const sample = Math.sin(2 * Math.PI * (210 + modulation) * time) * envelope * 0.08;
      view.setInt16(44 + index * 2, sample * 0x7fff, true);
    }
    const url = URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
    taskRecordingUrls.set(fileName, url);
    return url;
  };
  const healthTaskExecutionData = (patient, index) => {
    const planned = 10 + (index % 4) * 2;
    const overdue = patient.risk === '已逾期' ? 2 : (index % 4 === 0 ? 1 : 0);
    const executed = Math.max(1, planned - overdue - (index % 3));
    const aiCalls = Number(patient.callCount) || 0;
    const hasRecording = patient.callStatus === '外呼成功';
    return {
      planned,
      executed,
      aiCalls,
      overdue,
      completion: Math.round(executed / planned * 100),
      recordingName: hasRecording ? `${patient.name}_AI外呼随访_20261028_${String(14 + index).padStart(2, '0')}36.wav` : '',
      recordingDuration: '00:04'
    };
  };
  const renderTaskAiAnalysis = (task, profile, patient, index) => {
    if (task.key !== 'health-task') {
      const insightSummary = profile.highlights.map(([label, value]) => `${label}为${value}`).join('，');
      return `<ul><li>${escapeHtml(profile.analysis)}</li><li>基于当前患者画像与任务规则，${escapeHtml(insightSummary)}。</li></ul>`;
    }
    const data = healthTaskExecutionData(patient, index);
    const recording = data.recordingName
      ? `<section class="task-ai-recording" aria-label="外呼录音文件"><div class="task-ai-recording-file"><span aria-hidden="true">▶</span><div><strong>${escapeHtml(data.recordingName)}</strong><small>AI 外呼录音 · ${escapeHtml(data.recordingDuration)}</small></div></div><audio controls preload="metadata" src="${escapeHtml(taskRecordingUrl(data.recordingName))}" aria-label="播放${escapeHtml(data.recordingName)}"></audio></section>`
      : '';
    return `<div class="task-ai-execution-summary"><p>本周期计划执行 ${data.planned} 次，已执行 ${data.executed} 次，完成率 ${data.completion}%。AI 已完成 ${data.aiCalls} 次外呼，当前逾期 ${data.overdue} 次。</p><div class="task-ai-execution-metrics"><article><span>计划任务</span><strong>${data.planned}<small>次</small></strong></article><article><span>已执行</span><strong>${data.executed}<small>次</small></strong></article><article><span>AI 外呼</span><strong>${data.aiCalls}<small>次</small></strong></article><article class="${data.overdue ? 'danger' : 'success'}"><span>逾期任务</span><strong>${data.overdue}<small>次</small></strong></article></div>${recording}</div>`;
  };
  const processorField = ([label, value, kind], index) => {
    const id = `taskProcessorField${index}`;
    if (kind === 'textarea') return `<label class="task-processor-field task-processor-field-wide" for="${id}"><span>${escapeHtml(label)}</span><textarea id="${id}" rows="3">${escapeHtml(value)}</textarea></label>`;
    if (kind === 'select') return `<label class="task-processor-field" for="${id}"><span>${escapeHtml(label)}</span><select id="${id}"><option>${escapeHtml(value)}</option><option>待进一步确认</option><option>转人工处理</option></select></label>`;
    return `<label class="task-processor-field" for="${id}"><span>${escapeHtml(label)}</span><input id="${id}" value="${escapeHtml(value)}"></label>`;
  };
  const renderTaskMetricCards = items => `<div class="task-business-metrics">${items.map(([label, value, note, tone = '']) => `<article class="${escapeHtml(tone)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`).join('')}</div>`;
  const renderTaskProcessorBusiness = (task, profile, patient) => {
    if (task.key === 'enrollment-review') {
      const source = '<span class="task-archive-source"><span aria-hidden="true">▣</span><button type="button" data-task-record-source>2026-03-10 | 肾内科门诊 | 检验报告</button></span>';
      return `<section class="task-archive-overview" aria-label="档案要点"><header><strong>档案要点</strong></header><article class="task-archive-group"><h3>重点关注 (3)</h3><ul><li><span>eGFR:12 ml/min/1.73m，重度下降。</span>${source}</li><li><span>血肌酐:486 umol/L，明显升高，提示肾功能减退明显。</span>${source}</li><li><span>血红蛋白:86 g/，明显下降，提示肾性贫血风险。</span>${source}</li></ul></article><article class="task-archive-group"><h3>其他异常 (1)</h3><ul><li><span>eGFR:12 ml/min/1.73m，重度下降。</span>${source}</li></ul></article><p class="task-archive-note">*采用AI模型智能辅助采集量表内容，仅供参考，请核对确认。</p></section>`;
    }
    if (task.key === 'health-task') {
      return `<section class="task-scale-form" aria-labelledby="taskHealthScaleTitle"><header><h2 id="taskHealthScaleTitle">高血压随访量表</h2><p>请结合患者本周期的任务执行记录完成量表。AI 已预填可确认内容，提交前请人工核对。</p></header><div class="task-scale-question"><div class="task-scale-question-title"><span>*</span><strong>01</strong><p>患者近 7 天是否按计划完成家庭血压监测？</p></div><div class="task-scale-options"><label><input type="radio" name="healthScaleMonitor" value="yes" checked><span>是</span></label><label><input type="radio" name="healthScaleMonitor" value="no"><span>否</span></label></div></div><div class="task-scale-question"><div class="task-scale-question-title"><em>多选</em><strong>02</strong><p>患者近期是否出现以下不适症状？</p></div><p class="task-scale-question-note">可根据人工外呼结果补充，未出现症状时请选择“无明显不适”。</p><div class="task-scale-options grid"><label><input type="checkbox" name="healthScaleSymptoms" value="dizzy"><span>头晕或头痛</span></label><label><input type="checkbox" name="healthScaleSymptoms" value="chest"><span>胸闷或心悸</span></label><label><input type="checkbox" name="healthScaleSymptoms" value="fatigue"><span>乏力或睡眠不佳</span></label><label><input type="checkbox" name="healthScaleSymptoms" value="none" checked><span>无明显不适</span></label></div></div><div class="task-scale-question"><div class="task-scale-question-title"><strong>03</strong><p>最近一次家庭血压测量结果</p></div><div class="task-scale-inline-fields"><label><span>收缩压</span><span><input type="number" value="138" min="60" max="260"> mmHg</span></label><label><span>舒张压</span><span><input type="number" value="88" min="30" max="180"> mmHg</span></label></div></div><div class="task-scale-question"><div class="task-scale-question-title"><strong>04</strong><p>最近一次复诊日期</p></div><input class="task-scale-date" type="date" value="2026-10-26" aria-label="最近一次复诊日期"></div><p class="task-scale-ai-note">（采用 AI 模型智能辅助采集量表内容，仅供参考，请核对确认。）</p></section>`;
    }
    if (task.key === 'alert-disposal') {
      return `<section class="task-business-card"><header><div><strong>预警内容</strong><small>触发指标、规则与核实结果</small></div><span class="danger">紧急预警</span></header><div class="task-alert-banner"><strong>血压连续异常，需要立即核实</strong><span>${escapeHtml(patient.name)}连续两次血压达到 182/108mmHg，并反馈轻度头晕。</span></div>${renderTaskMetricCards([['当前血压','182/108 mmHg','今天 14:08','danger'],['连续次数','2 次','间隔 30 分钟','warning'],['伴随症状','轻度头晕','患者主动反馈','warning'],['触发来源','家庭血压计','设备自动上报']])}<div class="task-processor-fields">${profile.fields.map(processorField).join('')}</div></section>`;
    }
    if (task.key === 'evaluation-review') {
      return `<section class="task-business-card"><header><div><strong>评价总结</strong><small>饮食成分结构与本周期评价结论</small></div><span>评价审核</span></header><div class="task-composition-grid"><article><div><span>碳水化合物</span><strong>52%</strong></div><i><b style="width:52%"></b></i><small>建议范围 45%–50%</small></article><article><div><span>蛋白质</span><strong>16%</strong></div><i><b class="success" style="width:16%"></b></i><small>处于合理范围</small></article><article><div><span>脂肪</span><strong>32%</strong></div><i><b class="warning" style="width:32%"></b></i><small>建议控制在 30% 以下</small></article></div><div class="task-review-summary"><strong>综合评价</strong><p>本周期饮食记录完整度 91%。精制碳水和晚餐热量偏高，蔬菜摄入不足；建议下一周期重点调整晚餐结构，并持续记录三餐照片。</p></div><div class="task-processor-fields">${profile.fields.map(processorField).join('')}</div></section>`;
    }
    return `<section class="task-business-card"><header><div><strong>修改评估报告明细</strong><small>分别调整日报、周报和月报的展示内容</small></div><span>健康评估</span></header><div class="task-report-grid"><label><span>日报明细</span><small>2026-10-27</small><textarea rows="5">今日晚餐碳水与脂肪占比偏高；家庭血压 148/92mmHg，建议晚餐后适量步行并按计划复测。</textarea></label><label><span>周报明细</span><small>2026-10-21 至 2026-10-27</small><textarea rows="5">本周饮食记录完成率 93%，晚餐热量持续偏高；血压平均值较上周下降 4/2mmHg，仍需继续监测。</textarea></label><label><span>月报明细</span><small>2026-10 月</small><textarea rows="5">本月精制碳水摄入下降，但饱和脂肪仍偏高。结合血压与肾功能趋势，建议强化复诊和用药依从性管理。</textarea></label></div></section>`;
  };
  const renderTaskProcessorActions = (task, profile) => {
    const host = document.getElementById('taskProcessorActions');
    if (!host) return;
    if (task.key === 'health-task') {
      const actions = [['标记', 'default'], ['人工外呼', 'default'], ['保存', 'default'], ['提交', 'primary']];
      host.innerHTML = actions.map(([label, tone]) => `<button type="button" class="task-action-btn ${tone}" data-task-processor-action="${label}">${tone === 'primary' ? '<span aria-hidden="true">✓</span>' : ''}${label}</button>`).join('');
      return;
    }
    if (task.key !== 'enrollment-review') {
      host.innerHTML = '';
      return;
    }
    host.innerHTML = profile.actions.map(([label, tone]) => `<button type="button" class="task-action-btn ${tone}" data-task-processor-action="${escapeHtml(label)}">${tone === 'primary' ? '<span aria-hidden="true">✓</span>' : tone === 'danger' ? '<span aria-hidden="true">×</span>' : ''}${escapeHtml(label)}</button>`).join('');
  };
  const syncTaskProcessorQueueState = () => {
    const layout = document.querySelector('.task-processor-layout');
    const heading = document.querySelector('.task-processor-queue-heading');
    if (!layout || !heading) return;
    let toggle = heading.querySelector('[data-task-processor-queue-toggle]');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'task-processor-queue-toggle';
      toggle.dataset.taskProcessorQueueToggle = '';
      toggle.innerHTML = '<span aria-hidden="true">‹</span>';
      heading.append(toggle);
    }
    layout.classList.toggle('queue-collapsed', taskProcessorState.queueCollapsed);
    toggle.setAttribute('aria-expanded', String(!taskProcessorState.queueCollapsed));
    toggle.setAttribute('aria-label', taskProcessorState.queueCollapsed ? '展开待办明细' : '收起待办明细');
    toggle.title = taskProcessorState.queueCollapsed ? '展开待办明细' : '收起待办明细';
  };
  const renderTaskProcessorQueue = (task, profile) => {
    const title = document.getElementById('taskProcessorQueueTitle');
    const progress = document.getElementById('taskProcessorQueueProgress');
    const assistantBubble = document.getElementById('globalAiReminderBubble');
    const host = document.getElementById('taskProcessorPatientList');
    if (title) title.textContent = '待办明细';
    const patients = processorPatients();
    const done = patients.filter((_, index) => taskProcessorState.completed.has(`${task.key}:${index}`)).length;
    const pending = patients.length - done;
    if (progress) progress.textContent = `共 ${pending}${task.unit}`;
    if (assistantBubble) {
      assistantBubble.textContent = profile.assistant;
      assistantBubble.hidden = false;
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
      const enrollment = task.key === 'enrollment-review';
      const healthTask = task.key === 'health-task';
      const menuOpen = taskProcessorState.menuPatientIndex === index;
      const tags = patient.tags.slice(0, 3);
      if (healthTask) {
        return `<article class="task-patient-card health-task-card${selected ? ' selected' : ''}" data-task-processor-patient="${index}" role="button" tabindex="0" aria-pressed="${selected}"><div class="health-task-card-main">${patientAvatar(patient)}<strong>${escapeHtml(patient.name)}</strong>${patientPhone(patient, index, true)}</div><div class="health-task-card-meta"><span class="health-task-call-count" aria-label="外呼 ${patient.callCount || 0} 次"><span aria-hidden="true">☎</span>${patient.callCount || 0}</span><span class="health-task-call-status ${escapeHtml(patient.callTone || 'inactive')}"><i aria-hidden="true"></i>${escapeHtml(patient.callStatus || '未入队')}</span><button type="button" class="health-task-record" data-task-patient-record="${index}">执行记录<span aria-hidden="true">›</span></button></div></article>`;
      }
      return `<article class="task-patient-card${selected ? ' selected' : ''}" data-task-processor-patient="${index}" role="button" tabindex="0" aria-pressed="${selected}">${patientAvatar(patient)}<span class="task-patient-copy"><strong><span>${escapeHtml(patient.name)}</span>${enrollment ? patientPhone(patient, index, true) : `<em>${escapeHtml(patient.risk)}</em>`}</strong>${enrollment ? '' : `<small>${patient.gender} · ${patient.age}岁</small>`}<span>${tags.map(tag => `<i>${escapeHtml(tag)}</i>`).join('')}</span></span>${enrollment ? '' : '<b>待处理</b>'}<span class="task-patient-more-wrap"><button type="button" class="task-patient-more" data-task-patient-more="${index}" aria-expanded="${menuOpen}" aria-label="更多操作" title="更多操作"><span aria-hidden="true">•••</span></button><span class="task-patient-more-menu" ${menuOpen ? '' : 'hidden'}><button type="button" data-task-patient-record="${index}">执行记录</button></span></span></article>`;
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
    const enrollment = task.key === 'enrollment-review';
    const analysisSource = task.key === 'health-task' ? '由 AI 根据任务执行记录生成' : '由 AI 根据患者档案与任务数据生成';
    host.innerHTML = `<section class="task-ai-profile-card" aria-label="患者信息与 AI 智能解析"><header class="task-ai-profile-header"><div class="task-ai-profile-strip"><strong class="task-ai-profile-name">${escapeHtml(patient.name)}</strong><span class="task-ai-demographic">${escapeHtml(patient.gender)} · ${escapeHtml(patient.age)}岁</span><span class="task-ai-profile-tags">${patient.tags.map(tag => `<i>${escapeHtml(tag)}</i>`).join('')}</span><span class="task-ai-profile-meta">身份证号 <strong>${escapeHtml(patient.idCard)}</strong></span><span class="task-ai-profile-meta">手机号 ${enrollment ? patientPhone(patient, taskProcessorState.patientIndex, true) : `<strong>${escapeHtml(patient.phone || '--')}</strong>`}</span></div><button type="button" class="task-ai-profile-archive" data-task-processor-archive>${patientAvatar(patient)}<span>患者档案</span></button></header><div class="task-ai-scan-line" aria-hidden="true"></div><section class="task-ai-report"><header><span class="task-ai-orb" aria-hidden="true">✦</span><div><strong>智能解析报告</strong><small>${escapeHtml(profile.analysisTitle)} · ${escapeHtml(analysisSource)}</small></div></header>${renderTaskAiAnalysis(task, profile, patient, taskProcessorState.patientIndex)}</section></section>${renderTaskProcessorBusiness(task, profile, patient)}${enrollment ? '' : '<p class="task-ai-disclaimer">AI 辅助整理内容仅供参考，请结合患者实际情况核对确认。</p>'}`;
  };
  const renderTaskProcessor = () => {
    const task = processorTask(taskProcessorState.key);
    const profile = processorProfile(task.key);
    const tabs = document.getElementById('taskProcessorTabs');
    if (tabs) tabs.innerHTML = processorTypes.map(item => `<button type="button" class="task-processor-tab${item.key === task.key ? ' active' : ''}" role="tab" aria-selected="${item.key === task.key}" tabindex="${item.key === task.key ? '0' : '-1'}" data-task-processor-tab="${item.key}">${escapeHtml(item.title)}</button>`).join('');
    syncTaskProcessorQueueState();
    renderTaskProcessorActions(task, profile);
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
    if (event.target.closest('[data-task-processor-queue-toggle]')) {
      taskProcessorState.queueCollapsed = !taskProcessorState.queueCollapsed;
      syncTaskProcessorQueueState();
      return;
    }
    const phoneToggle = event.target.closest('[data-task-phone-toggle]');
    if (phoneToggle) {
      const phoneKey = phoneToggle.dataset.taskPhoneToggle;
      if (taskProcessorState.phoneVisible.has(phoneKey)) taskProcessorState.phoneVisible.delete(phoneKey);
      else taskProcessorState.phoneVisible.add(phoneKey);
      renderTaskProcessor();
      return;
    }
    const patientMore = event.target.closest('[data-task-patient-more]');
    if (patientMore) {
      const index = Number(patientMore.dataset.taskPatientMore) || 0;
      taskProcessorState.menuPatientIndex = taskProcessorState.menuPatientIndex === index ? null : index;
      renderTaskProcessorQueue(processorTask(taskProcessorState.key), processorProfile(taskProcessorState.key));
      return;
    }
    const patientRecord = event.target.closest('[data-task-patient-record]');
    if (patientRecord) {
      const index = Number(patientRecord.dataset.taskPatientRecord) || 0;
      taskProcessorState.patientIndex = index;
      taskProcessorState.menuPatientIndex = null;
      renderTaskProcessor();
      showTaskProcessorToast(`已打开${processorPatients()[index].name}的执行记录`);
      return;
    }
    const patientCard = event.target.closest('[data-task-processor-patient]');
    if (patientCard) {
      taskProcessorState.patientIndex = Number(patientCard.dataset.taskProcessorPatient) || 0;
      taskProcessorState.menuPatientIndex = null;
      renderTaskProcessor();
      return;
    }
    const taskTab = event.target.closest('[data-task-processor-tab]');
    if (taskTab) {
      taskProcessorState.key = processorTask(taskTab.dataset.taskProcessorTab).key;
      taskProcessorState.patientIndex = 0;
      taskProcessorState.menuPatientIndex = null;
      renderTaskProcessor();
      return;
    }
    if (event.target.closest('[data-task-processor-archive]')) {
      showTaskProcessorToast(`已打开${processorPatients()[taskProcessorState.patientIndex].name}的患者档案预览`);
      return;
    }
    if (event.target.closest('[data-task-audio]')) {
      showTaskProcessorToast('已打开最近一次电话随访录音文件');
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
    const patientCard = event.target.closest?.('[data-task-processor-patient]');
    if (patientCard && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      taskProcessorState.patientIndex = Number(patientCard.dataset.taskProcessorPatient) || 0;
      renderTaskProcessor();
      return;
    }
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
