const scaleRows = [
  ['测试', 0, 0, '第1版', 1, '张媛丽', '2026/06/02 18:23:37', '未发布', false],
  ['测试', '', 0, '第1版', '--', '张媛丽', '2026/06/02 18:23:37', '未发布', false, true],
  ['12334', 0, 0, '第1版', 1, '平台技术人员', '2026/05/25 22:48:09', '未发布', false],
  ['12334', '', 0, '第1版', '--', '平台技术人员', '2026/05/25 22:48:09', '未发布', false, true],
  ['营养风险筛查2002（NRS-2002）', 1, 0, '第1版', 1, '--', '2026/05/21 15:45:09', '已发布', true],
  ['胃癌慢病管理随访路径', 1, 0, '第1版', 1, '--', '2026/05/21 15:44:46', '已发布', true],
  ['营养风险筛查2002', 1, 0, '第1版', 1, '--', '2026/05/21 15:43:20', '已发布', true],
  ['胃癌慢病管理随访路径', 1, 0, '第1版', 1, '--', '2026/05/21 15:42:57', '已发布', true],
  ['客户信息收集表', 0, 0, '第1版', 1, '平台技术人员', '2026/05/21 13:57:14', '未发布', false],
  ['测试量表2', 3, 6, '第1版', 1, '--', '2026/05/15 15:57:25', '已发布', true]
];

let indicatorTemplates = [
  { id: 'board-1', name: '患者基础信息看板', applicableType: '方案', applicableProfile: '全部患者', published: true, metrics: [
    { name: '血压', display: '趋势图', source: '居家打卡', period: '按日' },
    { name: '血糖', display: '趋势图', source: '检验数据', period: '按日' },
    { name: 'BMI', display: '结果卡', source: '设备上传', period: '按周' },
    { name: '尿蛋白', display: '结果卡', source: '检验数据', period: '按月' }
  ] },
  { id: 'board-2', name: '糖尿病健康指标看板', applicableProfile: '糖尿病患者', published: true, metrics: [{ name: '空腹血糖', type: '数值', source: 'lab.fbg' }, { name: '糖化血红蛋白', type: '数值', source: 'lab.hba1c' }] },
  { id: 'board-3', name: '肿瘤患者随访看板', applicableProfile: '肿瘤患者', published: false, metrics: [{ name: '随访日期', type: '日期', source: 'followup.date' }] },
  { id: 'board-4', name: '营养风险指标看板', applicableProfile: '住院患者', published: true, metrics: [{ name: 'NRS-2002总分', type: '数值', source: 'nrs2002.totalScore' }] },
  { id: 'board-5', name: '心血管风险看板', applicableProfile: '高血压患者', published: false, metrics: [{ name: '收缩压', type: '数值', source: 'vital.sbp' }, { name: '舒张压', type: '数值', source: 'vital.dbp' }] },
  { id: 'board-6', name: '患者运营数据看板', applicableProfile: '全部患者', published: true, metrics: [{ name: '患者总数', type: '数值', source: 'operation.patientCount' }] }
];

const indicatorState = { keyword: '', editingId: null };
const indicatorEditorState = { editingId: null, dirty: false, draft: null, granularity: '日', startDate: '2026-06-01', endDate: '2026-06-13', range: '2026-06-01 至 2026-06-13' };
const indicatorApplicableOptions = {
  '全部患者': ['全部患者'],
  '方案': ['全部患者管理方案', '糖尿病管理方案', '高血压管理方案', '肿瘤患者随访方案', '营养风险管理方案'],
  '科室': ['全部科室', '消化内科', '呼吸内科', '心血管内科', '内分泌科', '肿瘤科', '营养科'],
  '主诊断': ['全部诊断', '2型糖尿病', '原发性高血压', '慢性阻塞性肺疾病', '肺癌', '营养不良'],
  '团队': ['全院患者管理团队', '糖尿病管理团队', '心血管管理团队', '肿瘤随访团队', '营养管理团队', '患者运营团队']
};

const patientRecord = {
  name: '林嘉慧', gender: '女', birthDate: '2007-06', age: '19', ethnicity: '汉族', occupation: '学生',
  region: '浙江省杭州市', phone: '13812345628', visitNo: '22071523287', pastHistory: '', personalHistory: '',
  allergyHistory: '', familyHistory: '', drinking: '否', smoking: '否',
  portraits: []
};
const allPatients = [
  { name: '黄尚忠', visitNo: '22071025959', age: '73', gender: '男', phone: '166****5580', department: '呼吸与危重症医学科', diagnosis: '1.重症肺炎 2.脓毒症 脓毒性休克 3.急性肾功...', visitDate: '2026/06/12', team: '呼吸内科随访团队' },
  { name: '黄可睿', visitNo: '25052234005', age: '2', gender: '男', phone: '191****2319', department: '小儿科', diagnosis: '出院诊断：', visitDate: '2026/06/12', team: '小儿科随访团队' },
  { name: '冯金柳', visitNo: '11338105', age: '38', gender: '女', phone: '137****8802', department: '妇科', diagnosis: '未获取', visitDate: '2026/06/12', team: '妇科随访团队' },
  { name: '农业宝', visitNo: '452126195009101818', age: '75', gender: '男', phone: '188****6540', department: '泌尿外科', diagnosis: '未获取', visitDate: '2026/06/12', team: '泌尿外科随访团队' },
  { name: '余玉梅', visitNo: '26060418002', age: '62', gender: '女', phone: '156****1238', department: '肿瘤科', diagnosis: '出院诊断：', visitDate: '2026/06/12', team: '肿瘤科随访团队' },
  { name: '梁禹兴', visitNo: '11338047', age: '32', gender: '男', phone: '173****8884', department: '泌尿外科', diagnosis: '未获取', visitDate: '2026/06/12', team: '泌尿外科随访团队' },
  { name: '韦望林', visitNo: '22070815354', age: '62', gender: '女', phone: '138****1977', department: '心血管内科一病区', diagnosis: '1.冠状动脉粥样硬化性心脏病 不稳定型心绞...', visitDate: '2026/06/12', team: '心内科随访团队' },
  { name: '刘五妹', visitNo: '22071515705', age: '65', gender: '女', phone: '187****6519', department: '肿瘤科', diagnosis: '1.胰腺低分化腺癌T4N2M1、IV期 2.肝脏多发...', visitDate: '2026/06/12', team: '肿瘤科随访团队' },
  { name: '滕晓霞', visitNo: '50245326', age: '39', gender: '女', phone: '134****5416', department: '乳腺甲状腺外科', diagnosis: '未获取', visitDate: '2026/06/12', team: '乳腺甲状腺外科' },
  { name: '黄灿芳', visitNo: '441282198102054523', age: '45', gender: '女', phone: '152****1012', department: '妇科', diagnosis: '未获取', visitDate: '2026/06/12', team: '妇科随访团队、行风办满意... (2)' }
];
const patientListState = { keyword: '', team: '', page: 1 };
const patientEditState = { dirty: false, draft: null };
const patientPageState = { dirty: false, saving: false, publishing: false, editingId: null, creating: false, returnView: 'indicator' };
const patientIndicatorState = { items: [] };
let archiveCurrentPatient = allPatients[0];
const archiveDashboardState = { board: '90天减肥计划', metricRanges: {} };
const templatePreviewState = { patientIndex: 0, metricRanges: {}, returnPage: 'patientPage' };
const archiveBoardMetrics = {
  '90天减肥计划': ['体重', '身高', 'BMI', '心率', '体脂'],
  '慢性肾病看板': ['血压', '血糖', '肾小球过滤率', '肾脏大小', '肌酐', '血肌酐', '尿酸'],
  '心血管风险看板': ['血压', '血糖', '心率'],
  '糖尿病模板看板': ['血压', '血糖']
};

const typeMeta = {
  single: { label: '单选', icon: radioIcon(), section: '选择' },
  multiple: { label: '多选', icon: checkIcon(), section: '选择' },
  text: { label: '单行文本', icon: textIcon(), section: '文本输入' },
  rating: { label: '评分打分', icon: starIcon(), section: '高级题型' },
  date: { label: '日期', icon: calendarIcon(), section: '高级题型' },
  matrixSingle: { label: '矩阵单选', icon: matrixIcon(), section: '矩阵' },
  matrixMultiple: { label: '矩阵多选', icon: matrixIcon(), section: '矩阵' },
  matrixRating: { label: '矩阵打分', icon: starIcon(), section: '矩阵' },
  matrixCustom: { label: '矩阵题', icon: matrixIcon(), section: '矩阵' }
};

const state = {
  selectedId: 11,
  selectedOption: null,
  activePropTab: 'question',
  questions: [
    q('single', 1), q('multiple', 2), q('single', 3), q('single', 4), q('multiple', 5),
    q('text', 6), q('rating', 7), q('date', 8), q('matrixSingle', 9), q('matrixMultiple', 10), q('matrixRating', 11)
  ]
};

function q(type, index) {
  const base = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type, index, title: '请输入题目的标题', desc: '请输入题目描述', required: true,
    options: ['选项', '选项'], rows: ['行标题', '行标题'], min: '', max: '', textFormat: '无限制',
    optionSettings: [defaultOptionSetting(), defaultOptionSetting()], matrixOptionSettings: [defaultOptionSetting(), defaultOptionSetting()],
    dateFormat: '年/月/日', ratingTemplate: '满意度', display: 'star', allowPatientAddRow: false
  };
  if (type === 'matrixCustom') {
    base.matrixMode = 'fill';
    base.columns = [
      { title: '选项', dataType: 'fill', options: ['选项', '选项'] },
      { title: '选项', dataType: 'fill', options: ['选项', '选项'] }
    ];
  } else {
    base.columns = ['选项', '选项'];
  }
  return base;
}

function defaultOptionSetting() {
  return {
    fieldType: '下拉选择',
    metric: '',
    valueDomain: '选项1\n选项2',
    textType: '无限制',
    ratingTemplate: '满意度',
    ratingDisplay: 'star',
    dateFormat: '年/月/日'
  };
}

const metricFields = [
  'patient.name 患者姓名',
  'patient.gender 性别',
  'patient.age 年龄',
  'patient.phone 手机号',
  'assessment.score 评估总分',
  'assessment.riskLevel 风险等级',
  'scale.optionValue 选项值',
  'scale.optionLabel 选项文本',
  'nrs2002.totalScore NRS-2002总分',
  'followup.gastricPath 胃癌随访路径'
];

state.selectedId = state.questions[state.questions.length - 1].id;
