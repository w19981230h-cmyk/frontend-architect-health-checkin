function formatBirthDate(value) {
  if (!value) return '--';
  const [year, month] = value.split('-');
  return `${year}年${month}月`;
}

function patientDisplayValue(key, value) {
  if (key === 'birthDate') return formatBirthDate(value);
  if (key === 'age') return value ? `${value}岁` : '--';
  if (key === 'phone') return value || '--';
  return value || '--';
}

function renderPatientDetail() {
  document.querySelectorAll('[data-patient-text]').forEach(node => {
    const key = node.dataset.patientText;
    node.textContent = patientDisplayValue(key, patientRecord[key]);
  });
  const groups = { diagnosis: [], abnormal: [], risk: [] };
  patientRecord.portraits.forEach(item => groups[item.type]?.push(item));
  [['diagnosis','diagnosisSummary','diagnosisCount'],['abnormal','abnormalSummary','abnormalCount'],['risk','riskSummary','riskCount']].forEach(([type, summaryId, countId]) => {
    const items = groups[type];
    document.getElementById(summaryId).textContent = items.length ? items.map(item => item.name).join('、') : '--';
    document.getElementById(countId).textContent = `共 ${items.length} 条`;
  });
}

function renderPatientArchive() {
  if (!archiveCurrentPatient) return;
  const patient = archiveCurrentPatient;
  const archiveValues = {
    ...patient,
    birthDate: `${2026 - Number(patient.age) - 1}年07月`,
    ethnicity: '汉族',
    occupation: Number(patient.age) >= 60 ? '退休' : '--',
    region: '--'
  };
  document.querySelectorAll('[data-archive-text]').forEach(node => {
    const value = archiveValues[node.dataset.archiveText];
    node.textContent = value || '--';
  });
}

function archiveMetricData(metric) {
  const metricMap = {
    '体重': { value: '68.4', unit: 'kg', labels: ['85', '75', '65', '55'], a: '35,62 125,70 215,82 305,95 395,107 485,119 575,128', b: '' },
    '身高': { value: '172', unit: 'cm', labels: ['180', '175', '170', '165'], a: '35,105 125,104 215,104 305,103 395,104 485,103 575,103', b: '' },
    '血压': { value: '128/82', unit: 'mmHg', labels: ['200', '155', '110', '65'], a: '35,90 125,82 215,101 305,68 395,86 485,63 575,76', b: '35,145 125,137 215,153 305,126 395,141 485,119 575,132' },
    '血糖': { value: '6.2', unit: 'mmol/L', labels: ['12', '8', '4', '0'], a: '35,150 125,132 215,146 305,103 395,126 485,84 575,116', b: '35,178 125,169 215,162 305,155 395,146 485,137 575,142' },
    'BMI': { value: '23.1', unit: 'kg/m²', labels: ['30', '25', '20', '15'], a: '35,76 125,84 215,93 305,103 395,112 485,120 575,126', b: '' },
    '心率': { value: '76', unit: '次/分', labels: ['120', '90', '60', '30'], a: '35,127 125,103 215,139 305,89 395,122 485,96 575,113', b: '' },
    '体脂': { value: '24.6', unit: '%', labels: ['35', '28', '21', '14'], a: '35,72 125,79 215,91 305,100 395,111 485,119 575,129', b: '' },
    '肾小球过滤率': { value: '68', unit: 'mL/min/1.73m²', labels: ['120', '90', '60', '30'], a: '35,84 125,91 215,98 305,105 395,112 485,118 575,125', b: '' },
    '肾脏大小': { value: '10.8/10.5', unit: 'cm', labels: ['12', '11', '10', '9'], a: '35,82 125,79 215,84 305,81 395,86 485,83 575,85', b: '35,108 125,105 215,110 305,106 395,111 485,108 575,110' },
    '肌酐': { value: '112', unit: 'μmol/L', labels: ['160', '120', '80', '40'], a: '35,103 125,96 215,112 305,91 395,106 485,88 575,99', b: '' },
    '血肌酐': { value: '108', unit: 'μmol/L', labels: ['160', '120', '80', '40'], a: '35,112 125,104 215,116 305,98 395,109 485,94 575,103', b: '' },
    '尿酸': { value: '428', unit: 'μmol/L', labels: ['600', '450', '300', '150'], a: '35,118 125,102 215,111 305,89 395,98 485,76 575,92', b: '' }
  };
  return metricMap[metric] || { value: '--', unit: '', labels: ['100', '75', '50', '25'], a: '35,120 125,110 215,115 305,96 395,104 485,88 575,98', b: '' };
}

function renderArchiveMetricCards(metrics) {
  document.getElementById('archiveMetricCards').innerHTML = metrics.map(metric => {
    const data = archiveMetricData(metric);
    return `<article class="archive-mini-card"><div class="archive-mini-title">${metric}</div><div class="archive-mini-value">${data.value}<small>${data.unit}</small></div><div class="archive-mini-update">更新时间：2026-06-12 08:30</div></article>`;
  }).join('');
}

function archiveDateList(start, end) {
  const dates = [];
  const cursor = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(last.getTime()) || cursor > last) return [];
  while (cursor <= last && dates.length < 120) {
    dates.push(`${String(cursor.getMonth() + 1).padStart(2, '0')}月${String(cursor.getDate()).padStart(2, '0')}日`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function metricRangeState(store, metric) {
  if (!store.metricRanges[metric]) store.metricRanges[metric] = { range: '最近7天', start: '2026-06-06', end: '2026-06-12' };
  return store.metricRanges[metric];
}

function metricRangeLabels(state) {
  if (state.range === '今天' || state.range === '昨天') {
    return Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);
  }
  if (state.range === '最近30天') return archiveDateList('2026-05-14', '2026-06-12');
  if (state.range === '自定义') return archiveDateList(state.start, state.end);
  return archiveDateList('2026-06-06', '2026-06-12');
}

function metricRangeTools(metric, state, scope) {
  const ranges = ['今天', '昨天', '最近7天', '最近30天'];
  return `<div class="archive-card-range-tools" data-range-tools="${esc(metric)}">${ranges.map(range => `<button class="archive-range-btn ${state.range === range ? 'active' : ''}" data-${scope}-card-range="${range}" data-range-metric="${esc(metric)}">${range}</button>`).join('')}<div class="archive-date-box"><input class="archive-date-input" data-${scope}-card-date-start="${esc(metric)}" type="date" value="${state.start}" aria-label="${esc(metric)}开始日期"><span>至</span><input class="archive-date-input" data-${scope}-card-date-end="${esc(metric)}" type="date" value="${state.end}" aria-label="${esc(metric)}结束日期"></div></div>`;
}

function applyMetricRange(state, range) {
  const ranges = { '今天': ['2026-06-12', '2026-06-12'], '昨天': ['2026-06-11', '2026-06-11'], '最近7天': ['2026-06-06', '2026-06-12'], '最近30天': ['2026-05-14', '2026-06-12'] };
  state.range = range;
  [state.start, state.end] = ranges[range];
}

function archiveSeriesPoints(source, count, width, patientShift = 0) {
  const base = source.split(' ').map(point => Number(point.split(',')[1]));
  const left = 42;
  const right = 20;
  const step = count > 1 ? (width - left - right) / (count - 1) : 0;
  return Array.from({ length: count }, (_, index) => {
    const baseline = base[index % base.length];
    const variation = ((Math.floor(index / base.length) % 3) - 1) * 4;
    return `${Math.round(left + index * step)},${Math.max(28, Math.min(178, baseline + variation + patientShift))}`;
  }).join(' ');
}

function archiveDetailChart(metric, patientShift = 0, customLabels = null, mode = '多趋势图') {
  const data = archiveMetricData(metric);
  const labels = customLabels || archiveDateList('2026-06-06', '2026-06-12');
  const width = Math.max(620, labels.length * 54);
  const labelStep = labels.length > 14 ? 1 : 1;
  const xLabels = labels.map((label, index) => {
    if (index % labelStep) return '';
    const x = labels.length > 1 ? 42 + index * ((width - 62) / (labels.length - 1)) : 42;
    return `<text x="${Math.round(x)}" y="218" text-anchor="middle">${label}</text>`;
  }).join('');
  const lineA = archiveSeriesPoints(data.a, labels.length, width, patientShift);
  const lineB = data.b ? archiveSeriesPoints(data.b, labels.length, width, patientShift) : '';
  const primaryLine = `<polyline class="line-a" points="${lineA}"/>`;
  const secondaryLine = lineB ? `<polyline class="line-b" points="${lineB}"/>` : '';
  const barWidth = Math.max(12, Math.min(30, (width - 62) / Math.max(labels.length, 1) * .48));
  const bars = lineA.split(' ').map(point => { const [x, y] = point.split(',').map(Number); return `<rect class="bar-a" x="${x - barWidth / 2}" y="${y}" width="${barWidth}" height="${182 - y}" rx="2"/>`; }).join('');
  const plot = mode === '柱状图' ? bars : mode === '多趋势图' ? primaryLine + secondaryLine : primaryLine;
  return `<div class="archive-chart-scroll"><svg class="archive-monitor-chart" style="width:${width}px" viewBox="0 0 ${width} 230" aria-label="${metric}${mode}"><g class="grid"><path d="M32 26H${width - 10}M32 78H${width - 10}M32 130H${width - 10}M32 182H${width - 10}"/></g><g><text x="0" y="30">${data.labels[0]}</text><text x="0" y="82">${data.labels[1]}</text><text x="0" y="134">${data.labels[2]}</text><text x="4" y="186">${data.labels[3]}</text>${xLabels}</g>${plot}</svg></div>`;
}

function renderArchiveDetails(metrics) {
  document.getElementById('archiveDetailBoards').innerHTML = metrics.map((metric, index) => {
    const data = archiveMetricData(metric);
    const status = indicatorSample({ name: metric }, index);
    const isMetricCard = metric === '体重' || metric === '身高';
    const title = isMetricCard ? metric : `${metric}监测数据`;
    const rangeState = metricRangeState(archiveDashboardState, metric);
    const rangeTools = isMetricCard ? '' : metricRangeTools(metric, rangeState, 'archive');
    const chart = isMetricCard ? '' : archiveDetailChart(metric, 0, metricRangeLabels(rangeState));
    return `<article class="archive-detail-card ${isMetricCard ? 'metric-compact' : 'metric-visual'}"><div class="archive-detail-card-head"><div><h3>${title}</h3><span class="archive-detail-update">更新时间：2026-06-12 08:30</span></div></div>${rangeTools}<div class="archive-detail-value"><strong>${data.value}</strong><span>${data.unit}</span></div>${chart}</article>`;
  }).join('');
}

function renderArchiveBoard(board) {
  archiveDashboardState.board = board;
  const visibleMetrics = archiveBoardMetrics[board] || archiveBoardMetrics['90天减肥计划'];
  document.getElementById('archiveBoardSelect').value = board;
  document.getElementById('archiveBoardCount').textContent = `当前命中 ${Object.keys(archiveBoardMetrics).length} 个看板`;
  renderArchiveMetricCards(visibleMetrics);
  renderArchiveDetails(visibleMetrics);
}

const checkinTypeOrder = ['饮食', '用药', '运动', '血压', '血糖', '腰围', '体重', '心率', '血脂', '尿酸'];
const checkinRecords = [
  { id: 'food-202606121230', type: '饮食', content: '鸡胸肉沙拉，468 Kcal', time: '2026/06/12 12:30', icon: 'food', detailName: '鸡胸肉沙拉', nutrition: [['468', 'Kcal', '热量', '#ff4d5f'], ['38', 'g', '蛋白质', '#3154ff'], ['14', 'g', '脂肪', '#ff8a1d'], ['42', 'g', '碳水', '#20bf55']] },
  { id: 'glucose-202606121805', type: '血糖', content: '5.8 mmol/L，餐后', time: '2026/06/12 18:05', icon: 'glucose' },
  { id: 'medicine-202606121900', type: '用药', content: '二甲双胍 0.5g，晚餐后', time: '2026/06/12 19:00', icon: 'medicine' },
  { id: 'food-202606241215', type: '饮食', content: '杂粮饭套餐，620 Kcal', time: '2026/06/24 12:15', icon: 'food', detailName: '杂粮饭套餐', nutrition: [['620', 'Kcal', '热量', '#ff4d5f'], ['31', 'g', '蛋白质', '#3154ff'], ['18', 'g', '脂肪', '#ff8a1d'], ['86', 'g', '碳水', '#20bf55']] },
  { id: 'bp-202606240820', type: '血压', content: '124/76 mmHg', time: '2026/06/24 08:20', icon: 'vital' },
  { id: 'heart-202606240821', type: '心率', content: '72 次/分', time: '2026/06/24 08:21', icon: 'vital' },
  { id: 'weight-202606240818', type: '体重', content: '68.1 kg', time: '2026/06/24 08:18', icon: 'body' },
  { id: 'sport-202606242030', type: '运动', content: '慢跑 18分钟，144千卡', time: '2026/06/24 20:30', icon: 'sport' },
  { id: 'glucose-202606240600', type: '血糖', content: '5 mmol/L', time: '2026/06/24 06:00', icon: 'glucose' },
  { id: 'lipid-202606241807', type: '血脂', content: 'TC 5.2 / TG 1.8 / HDL-C 1.2 / LDL-C 3.1', time: '2026/06/24 18:07', icon: 'lipid' },
  { id: 'lipid-202606240830', type: '血脂', content: 'TC 4.8 / TG 1.6 / HDL-C 1.3 / LDL-C 2.8', time: '2026/06/24 08:30', icon: 'lipid' },
  { id: 'uric-202606240830', type: '尿酸', content: '362 umol/L', time: '2026/06/24 08:30', icon: 'uric' },
  { id: 'uric-202606241600', type: '尿酸', content: '355 umol/L', time: '2026/06/24 16:00', icon: 'uric' },
  { id: 'uric-202606240900', type: '尿酸', content: '378 umol/L', time: '2026/06/24 09:00', icon: 'uric' },
  { id: 'food-202605121853', type: '饮食', content: '小笼包，805 Kcal', time: '2026/05/12 18:53', icon: 'food', detailName: '小笼包', nutrition: [['805', 'Kcal', '热量', '#ff4d5f'], ['53', 'g', '蛋白质', '#3154ff'], ['26', 'g', '脂肪', '#ff8a1d'], ['122', 'g', '碳水', '#20bf55']] },
  { id: 'food-202605121257', type: '饮食', content: '燕麦粥，312 Kcal', time: '2026/05/12 12:57', icon: 'food', detailName: '燕麦粥' },
  { id: 'medicine-202605121855', type: '用药', content: '二甲双胍 0.5g，餐后服用', time: '2026/05/12 18:55', icon: 'medicine' },
  { id: 'sport-202605131033', type: '运动', content: '快走 30 分钟，约 2.4 km', time: '2026/05/13 10:33', icon: 'sport' },
  { id: 'sport-202605121854', type: '运动', content: '拉伸 15 分钟', time: '2026/05/12 18:54', icon: 'sport' },
  { id: 'bp-202605121820', type: '血压', content: '128/78 mmHg', time: '2026/05/12 18:20', icon: 'vital' },
  { id: 'glucose-202605121805', type: '血糖', content: '6.2 mmol/L，餐后', time: '2026/05/12 18:05', icon: 'glucose' },
  { id: 'waist-202605120830', type: '腰围', content: '82 cm', time: '2026/05/12 08:30', icon: 'body' },
  { id: 'weight-202605120828', type: '体重', content: '68.4 kg', time: '2026/05/12 08:28', icon: 'body' },
  { id: 'heart-202605121806', type: '心率', content: '76 次/分', time: '2026/05/12 18:06', icon: 'vital' },
  { id: 'lipid-202605100900', type: '血脂', content: '总胆固醇 4.8 mmol/L', time: '2026/05/10 09:00', icon: 'lipid' },
  { id: 'uric-202605100905', type: '尿酸', content: '360 umol/L', time: '2026/05/10 09:05', icon: 'uric' }
];
const checkinState = {
  calendarMonth: new Date(2026, 5, 1),
  selectedDate: new Date(2026, 5, 12),
  activeRecordId: 'food-202605121853'
};

const checkinDetailData = {
  food: {
    total: ['1416', 'kcal', '今日总热量'],
    nutrition: [['72', 'g', '蛋白质', '21%'], ['38', 'g', '脂肪', '30%'], ['188', 'g', '碳水', '49%']],
    uploads: ['meal-rice', 'meal-salad', 'food-rice'],
    meals: [
      { name: '早餐', time: '20:45', items: [['鸡蛋', '1个（50g）', '70 kcal', 'food-egg'], ['牛奶', '250 ml', '150 kcal', 'food-milk'], ['全麦面包', '1片（60g）', '160 kcal', 'food-bread'], ['苹果', '90g', '48 kcal', 'food-apple']] },
      { name: '晚餐', time: '12:47', items: [['煎鸡胸肉', '100g', '180 kcal', 'food-chicken'], ['番茄豆腐汤', '1碗（260g）', '120 kcal', 'food-soup'], ['蔬菜沙拉', '1份（120g）', '80 kcal', 'food-salad']] },
      { name: '午餐', time: '10:17', items: [['香煎三文鱼配轻食沙拉', '100g', '155 kcal', 'food-fish'], ['水煮西兰花', '100g', '64 kcal', 'food-broccoli'], ['糙米饭', '120g', '170 kcal', 'food-rice'], ['香煎三文鱼配轻食沙拉', '100g', '155 kcal', 'food-fish'], ['水煮西兰花', '100g', '64 kcal', 'food-broccoli']] }
    ]
  },
  sport: {
    summary: [['569', 'kcal', '累计消耗'], ['108', '分钟', '累计时长']],
    rows: [['慢跑', '18分钟 · 20:30', '144 千卡', '高强度'], ['瑜伽', '15分钟 · 19:20', '45 千卡', '低强度'], ['骑行', '25分钟 · 16:40', '150 千卡', '中强度'], ['力量训练', '20分钟 · 10:15', '140 千卡', '高强度'], ['快走', '30分钟 · 08:30', '90 千卡', '中强度']]
  },
  weight: {
    current: ['69', 'kg', '体脂 25.6% · 最近记录 20:10'],
    rows: [['69', 'kg', '体脂率 25.6%', '20:10'], ['68.8', 'kg', '体脂率 25.1%', '14:30'], ['68.5', 'kg', '体脂率 24.5%', '10:07'], ['68.5', 'kg', '体脂率 28.4%', '08:20'], ['68.7', 'kg', '体脂率 24.8%', '07:20']]
  },
  glucose: {
    current: ['5', 'mmol/L', '2026年06月24日'],
    stats: [['最高血糖', '5'], ['最低血糖', '5'], ['平均血糖', '5']],
    points: [['06:00', '5']]
  },
  lipid: {
    count: '2',
    rows: [
      { time: '18:07', base: [['TC', '5.2'], ['TG', '1.8'], ['HDL-C', '1.2'], ['LDL-C', '3.1']], extra: [['sdLDL-C', '0.85'], ['oxLDL-C', '0.45']] },
      { time: '08:30', base: [['TC', '4.8'], ['TG', '1.6'], ['HDL-C', '1.3'], ['LDL-C', '2.8']], extra: [] }
    ]
  },
  uric: {
    current: ['362', 'umol/L', '08:30'],
    rows: [['362', 'umol/L', '08:30'], ['355', 'umol/L', '16:00'], ['378', 'umol/L', '09:00']]
  }
};

function formatCalendarTitle(date) {
  return `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function dateKeyFromCheckin(record) {
  const match = String(record.time || '').match(/^(\d{4})\/(\d{2})\/(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
}

function timeOnlyFromCheckin(record) {
  const match = String(record.time || '').match(/\s(\d{2}:\d{2})$/);
  return match ? match[1] : record.time;
}

function checkinDateCounts() {
  return checkinRecords.reduce((counts, record) => {
    if (!record.content || !record.time) return counts;
    const key = dateKeyFromCheckin(record);
    if (!key) return counts;
    counts.set(key, (counts.get(key) || 0) + 1);
    return counts;
  }, new Map());
}

function renderCheckinCalendar() {
  const monthNode = document.getElementById('checkinMonth');
  const daysNode = document.getElementById('checkinDays');
  if (!monthNode || !daysNode) return;
  const year = checkinState.calendarMonth.getFullYear();
  const month = checkinState.calendarMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);
  const selectedKey = formatDateKey(checkinState.selectedDate);
  const counts = checkinDateCounts();
  monthNode.textContent = formatCalendarTitle(checkinState.calendarMonth);
  daysNode.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const dateKey = formatDateKey(date);
    const count = counts.get(dateKey) || 0;
    const muted = date.getMonth() !== month ? ' muted' : '';
    const active = dateKey === selectedKey ? ' active' : '';
    return `<button class="checkin-day${muted}${active}" data-checkin-date="${dateKey}"><span>${date.getDate()}</span>${count ? `<span class="checkin-day-count">${count}</span>` : ''}</button>`;
  }).join('');
}

function latestCheckinRecords() {
  const latestByType = checkinRecords.filter(record => record.type && record.content && record.time).reduce((map, record) => {
    const current = map.get(record.type);
    if (!current || record.time > current.time) map.set(record.type, record);
    return map;
  }, new Map());
  return checkinTypeOrder.map(type => latestByType.get(type)).filter(Boolean);
}

function selectedDateCheckinRecords() {
  const selectedKey = formatDateKey(checkinState.selectedDate);
  return checkinRecords
    .filter(record => record.type && record.content && record.time && dateKeyFromCheckin(record) === selectedKey)
    .sort((a, b) => String(b.time).localeCompare(String(a.time)));
}

function checkinIcon(type) {
  const icons = {
    food: '<path d="M5 10h14v9H5zM8 7h8M9 13h6M9 16h4"/>',
    medicine: '<path d="M9 4h6v4H9zM7 8h10v11H7zM10 14h4M12 12v4"/>',
    sport: '<path d="M7 7v10M17 7v10M5 9h14v6H5z"/>',
    vital: '<path d="M4 13h4l2-6 4 11 2-5h4"/>',
    glucose: '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11Z"/>',
    body: '<path d="M8 4h8l2 6-3 10H9L6 10zM9 10h6"/>',
    lipid: '<path d="M6 17c5-8 7-8 12 0M6 17h12M8 12h8"/>',
    uric: '<path d="M7 4h10M9 4v6l-3 6a3 3 0 0 0 3 4h6a3 3 0 0 0 3-4l-3-6V4"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">${icons[type] || icons.food}</svg>`;
}

function renderCheckinRecords() {
  const list = document.getElementById('checkinRecordList');
  if (!list) return;
  const records = selectedDateCheckinRecords();
  if (!records.some(record => record.id === checkinState.activeRecordId)) checkinState.activeRecordId = records[0]?.id || '';
  list.innerHTML = records.map(record => (
    `<button class="checkin-record ${record.id === checkinState.activeRecordId ? 'active' : ''}" data-checkin-record="${esc(record.id)}">
      <span class="checkin-record-thumb ${esc(checkinRecordImageClass(record))}" aria-hidden="true"></span>
      <span class="checkin-record-body"><strong>${esc(record.type)}</strong><span class="checkin-record-content">${esc(record.content)}</span><span class="checkin-record-time">${esc(timeOnlyFromCheckin(record))}</span></span>
    </button>`
  )).join('');
}

function checkinKind(record) {
  return String(record.id || '').split('-')[0] || record.icon || 'generic';
}

function checkinRecordImageClass(record) {
  const kind = checkinKind(record);
  if (kind === 'food') return record.time?.includes('06/12') ? 'meal-salad' : record.time?.includes('05/12') ? 'meal-rice' : 'meal-rice';
  if (kind === 'sport') return 'sport-run';
  if (kind === 'medicine') return 'medication';
  if (kind === 'glucose') return 'glucose-photo';
  if (kind === 'lipid') return 'lipid-photo';
  if (kind === 'uric') return 'uric-photo';
  if (kind === 'weight' || kind === 'waist') return 'body-photo';
  return 'vital-photo';
}

function renderStatGrid(items) {
  return `<div class="checkin-stat-grid">${items.map(([value, unit, label]) => `<div class="checkin-stat-cell"><strong>${esc(value)}${unit ? `<small>${esc(unit)}</small>` : ''}</strong><span>${esc(label)}</span></div>`).join('')}</div>`;
}

function renderCheckinDetailBody(record) {
  const kind = checkinKind(record);
  if (kind === 'food') {
    const data = checkinDetailData.food;
    return `<section class="checkin-food-overview"><div class="checkin-food-overview-head"><span class="checkin-food-ai">AI分析</span><strong>${esc(data.total[0])}</strong><small>${esc(data.total[1])} · ${esc(data.total[2])}</small></div><div class="checkin-food-macro-grid">${data.nutrition.map(([value, unit, label, percent]) => `<div class="checkin-food-macro"><span>${esc(label)}</span><strong>${esc(value)}<small>${esc(unit)}</small></strong><small>${esc(percent)}</small></div>`).join('')}</div></section>
      <div class="checkin-upload-gallery">${data.uploads.map(photo => `<span class="checkin-upload-image ${esc(photo)}" aria-hidden="true"></span>`).join('')}</div>
      <h3 class="checkin-subtitle">餐次明细</h3>
      ${data.meals.map(meal => `<section class="checkin-detail-group"><div class="checkin-detail-group-head">${esc(meal.name)}<span>${esc(meal.time)} 上传解析</span></div>${meal.items.map(([name, amount, kcal, photo]) => `<div class="checkin-detail-row food-row"><span class="checkin-food-thumb ${esc(photo)}" aria-hidden="true"></span><div><strong>${esc(name)}</strong><span>${esc(amount)}</span></div><em>${esc(kcal)}</em></div>`).join('')}</section>`).join('')}`;
  }
  if (kind === 'sport') {
    const data = checkinDetailData.sport;
    return `${renderStatGrid(data.summary)}
      <h3 class="checkin-subtitle">运动记录</h3>
      <section class="checkin-detail-group">${data.rows.map(([name, meta, kcal, intensity]) => `<div class="checkin-detail-row"><div><strong>${esc(name)}</strong><span>${esc(meta)}</span></div><div><em>${esc(kcal)}</em><span class="checkin-intensity">${esc(intensity)}</span></div></div>`).join('')}</section>`;
  }
  if (kind === 'weight') {
    const data = checkinDetailData.weight;
    return `<div class="checkin-detail-summary"><strong>${esc(data.current[0])}</strong><small>${esc(data.current[1])}</small><span>${esc(data.current[2])}</span></div>
      <h3 class="checkin-subtitle">体重记录</h3>
      <section class="checkin-detail-group">${data.rows.map(([value, unit, fat, time]) => `<div class="checkin-detail-row"><div><strong>${esc(value)} <small>${esc(unit)}</small></strong><span>${esc(fat)}</span></div><em>${esc(time)}</em></div>`).join('')}</section>`;
  }
  if (kind === 'glucose') {
    const data = checkinDetailData.glucose;
    return `<div class="checkin-detail-summary"><strong>${esc(data.current[0])}</strong><small>${esc(data.current[1])}</small><span>${esc(data.current[2])}</span></div>
      <div class="checkin-trend-box"><div class="checkin-trend-line"><span class="checkin-trend-point"></span></div><span class="checkin-empty-note">血糖值：${esc(data.points[0][1])} mmol/L · ${esc(data.points[0][0])}</span></div>
      ${renderStatGrid(data.stats.map(([label, value]) => [value, '', label]))}`;
  }
  if (kind === 'lipid') {
    const data = checkinDetailData.lipid;
    return `<div class="checkin-detail-summary"><strong>${esc(data.count)}</strong><small>次</small><span>记录次数</span></div>
      <h3 class="checkin-subtitle">血脂记录</h3>
      ${data.rows.map(row => `<section class="checkin-detail-group"><div class="checkin-detail-group-head">${esc(row.time)}<span>血脂明细</span></div><div class="checkin-lab-grid">${row.base.map(([label, value]) => `<div class="checkin-lab-cell"><span>${esc(label)}</span><strong>${esc(value)}<small>mmol/L</small></strong></div>`).join('')}</div>${row.extra.length ? `<div class="checkin-lab-grid">${row.extra.map(([label, value]) => `<div class="checkin-lab-cell"><span>${esc(label)}</span><strong>${esc(value)}<small>mmol/L</small></strong></div>`).join('')}</div>` : ''}</section>`).join('')}`;
  }
  if (kind === 'uric') {
    const data = checkinDetailData.uric;
    return `<div class="checkin-detail-summary"><strong>${esc(data.current[0])}</strong><small>${esc(data.current[1])}</small><span>${esc(data.current[2])}</span></div>
      <h3 class="checkin-subtitle">尿酸记录</h3>
      <section class="checkin-detail-group">${data.rows.map(([value, unit, time]) => `<div class="checkin-detail-row"><div><strong>${esc(value)} <small>${esc(unit)}</small></strong><span>${esc(time)}</span></div><em>›</em></div>`).join('')}</section>`;
  }
  return `<div class="checkin-food-name">${esc(record.content)}</div>`;
}

function renderCheckinDetail() {
  const detail = document.getElementById('checkinDetail');
  if (!detail) return;
  const selectedRecords = selectedDateCheckinRecords();
  const record = selectedRecords.find(item => item.id === checkinState.activeRecordId) || selectedRecords[0];
  if (!record) {
    detail.innerHTML = '<div class="checkin-empty-note">暂无打卡数据</div>';
    return;
  }
  detail.innerHTML = `<div class="checkin-detail-head"><div class="checkin-detail-title"><span class="checkin-record-icon ${esc(record.icon)}">${checkinIcon(record.icon)}</span>${esc(record.type)}打卡</div><span class="checkin-time">${esc(timeOnlyFromCheckin(record))}</span></div>
    ${renderCheckinDetailBody(record)}`;
}

function renderCheckinPanel() {
  renderCheckinCalendar();
  renderCheckinRecords();
  renderCheckinDetail();
}

function openPatientArchive(patient) {
  archiveCurrentPatient = patient || allPatients[0];
  renderPatientArchive();
  renderArchiveBoard('90天减肥计划');
  document.querySelectorAll('[data-archive-tab]').forEach(button => button.classList.toggle('active', button.dataset.archiveTab === 'basic'));
  document.querySelectorAll('[data-archive-panel]').forEach(panel => { panel.hidden = panel.dataset.archivePanel !== 'basic'; });
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('patientArchivePage').classList.add('active');
  document.querySelector('.archive-page').scrollTop = 0;
}

function closePatientArchive() {
  document.getElementById('patientArchivePage').classList.remove('active');
  document.getElementById('listPage').classList.add('active');
  showListView('patients');
}

function getTemplatePreviewPatients() {
  return [patientRecord, ...allPatients.slice(0, 5)];
}

function templatePreviewMetricData(metric, metricIndex) {
  const base = archiveMetricData(metric.name);
  const sample = indicatorSample(metric, metricIndex);
  const data = { ...base, value: base.value === '--' ? sample.value : base.value, unit: base.value === '--' ? sample.unit : base.unit };
  const seed = templatePreviewState.patientIndex;
  if (!seed) return data;
  if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(data.value)) {
    const [first, second] = data.value.split('/').map(Number);
    data.value = `${Math.round(first + seed * 2 + metricIndex)}/${Math.round(second + seed + metricIndex / 2)}`;
  } else if (/^-?\d+(\.\d+)?$/.test(data.value)) {
    const original = Number(data.value);
    const decimal = data.value.includes('.');
    const adjusted = original + seed * (decimal ? 0.3 + metricIndex * 0.08 : 2 + metricIndex);
    data.value = decimal ? adjusted.toFixed(1) : String(Math.round(adjusted));
  } else if (['阴性', '±', '1+', '2+'].includes(data.value)) {
    data.value = ['阴性', '±', '1+', '2+'][seed % 4];
  }
  return data;
}

function renderTemplatePreviewPatient() {
  const patients = getTemplatePreviewPatients();
  const patient = patients[templatePreviewState.patientIndex] || patients[0];
  const birthDate = patient.birthDate ? `${String(patient.birthDate).replace('-', '年')}月` : `${2026 - Number(patient.age || 0) - 1}年7月`;
  const values = {
    ...patient,
    birthDate,
    ethnicity: patient.ethnicity || '汉族',
    occupation: patient.occupation || (Number(patient.age) >= 60 ? '退休' : '--'),
    region: patient.region || '--',
    pastHistory: patient.pastHistory || '--',
    personalHistory: patient.personalHistory || '--',
    allergyHistory: patient.allergyHistory || '--',
    familyHistory: patient.familyHistory || '--',
    drinking: patient.drinking || '--',
    smoking: patient.smoking || '--'
  };
  document.querySelectorAll('[data-template-preview-text]').forEach(node => { node.textContent = values[node.dataset.templatePreviewText] || '--'; });
  const diagnosis = patient.diagnosis && !patient.diagnosis.includes('未获取') ? patient.diagnosis.replace(/^\d+\./, '').slice(0, 24) : '--';
  const metrics = (indicatorEditorState.draft?.metrics || []).filter(item => item.name);
  const abnormalMetrics = metrics.filter((metric, index) => templatePreviewState.patientIndex && (index + templatePreviewState.patientIndex) % 3 === 1).map(item => item.name);
  document.getElementById('templatePreviewDiagnosis').textContent = diagnosis;
  document.getElementById('templatePreviewDiagnosisCount').textContent = `共 ${diagnosis === '--' ? 0 : 1} 条`;
  document.getElementById('templatePreviewAbnormal').textContent = abnormalMetrics.length ? abnormalMetrics.join('、') : '--';
  document.getElementById('templatePreviewAbnormalCount').textContent = `共 ${abnormalMetrics.length} 条`;
  document.getElementById('templatePreviewRisk').textContent = abnormalMetrics.length >= 2 ? '建议重点随访' : '--';
  const personArt = document.getElementById('templatePreviewPersonArt');
  if (templatePreviewState.patientIndex === 0) {
    personArt.style.backgroundImage = "url('patient-hero-reference.png')";
    personArt.style.backgroundSize = '1030px 490px';
    personArt.style.backgroundPosition = 'left -48px';
  } else {
    personArt.style.backgroundImage = "url('patient-archive-reference.png')";
    personArt.style.backgroundSize = '2048px 1263px';
    personArt.style.backgroundPosition = '-348px -58px';
  }
}

function renderTemplatePreviewMetrics() {
  const metrics = (indicatorEditorState.draft?.metrics || []).filter(item => item.name);
  const cards = document.getElementById('templatePreviewMetricCards');
  const details = document.getElementById('templatePreviewDetailBoards');
  document.getElementById('templatePreviewMetricCount').textContent = `当前配置 ${metrics.length} 个指标`;
  if (!metrics.length) {
    cards.innerHTML = '<div class="template-preview-empty">当前模板尚未配置指标</div>';
    details.innerHTML = '';
    return;
  }
  cards.innerHTML = metrics.map((metric, index) => {
    const data = templatePreviewMetricData(metric, index);
    return `<article class="archive-mini-card"><div class="archive-mini-title">${esc(metric.name)}</div><div class="archive-mini-value">${esc(data.value)}<small>${esc(data.unit)}</small></div><div class="archive-mini-update">更新时间：2026-06-12 08:30</div></article>`;
  }).join('');
  details.innerHTML = metrics.map((metric, index) => {
    const data = templatePreviewMetricData(metric, index);
    const status = indicatorSample(metric, index);
    const isCompact = metric.display === '指标卡' || metric.display === '结果卡';
    const displayWarning = indicatorDisplayWarning(metric);
    const rangeState = metricRangeState(templatePreviewState, metric.name);
    const rangeTools = isCompact ? '' : metricRangeTools(metric.name, rangeState, 'template');
    const body = isCompact ? '' : displayWarning ? `<div class="archive-display-unsupported">${esc(displayWarning)}</div>` : archiveDetailChart(metric.name, templatePreviewState.patientIndex * 4 + index, metricRangeLabels(rangeState), metric.display);
    return `<article class="archive-detail-card ${isCompact ? 'preview-compact' : 'preview-visual'}"><div class="archive-detail-card-head"><div><h3>${esc(metric.name)}监测数据</h3><span class="archive-detail-update">更新时间：2026-06-12 08:30</span></div></div>${rangeTools}<div class="archive-detail-value"><strong>${esc(data.value)}</strong><span>${esc(data.unit)}</span></div>${body}</article>`;
  }).join('');
}

function renderTemplatePreview() {
  const templateName = document.getElementById('patientTemplateName').value.trim() || '未命名指标看板';
  if (indicatorEditorState.draft) indicatorEditorState.draft.name = templateName;
  renderTemplatePreviewPatient();
  renderTemplatePreviewMetrics();
}

function openTemplatePreview() {
  templatePreviewState.returnPage = 'patientPage';
  templatePreviewState.patientIndex = 0;
  templatePreviewState.metricRanges = {};
  renderTemplatePreview();
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('patientTemplatePreviewPage').classList.add('active');
  document.querySelector('.template-preview-page').scrollTop = 0;
}

function openTemplatePreviewFromList(id) {
  const item = indicatorTemplates.find(row => row.id === id);
  if (!item) return;
  indicatorEditorState.editingId = item.id;
  indicatorEditorState.draft = JSON.parse(JSON.stringify({ ...item, metrics: (item.metrics || []).map(normalizeIndicatorMetric) }));
  templatePreviewState.returnPage = 'listPage';
  templatePreviewState.patientIndex = 0;
  templatePreviewState.metricRanges = {};
  document.getElementById('patientTemplateName').value = item.name;
  renderTemplatePreview();
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('patientTemplatePreviewPage').classList.add('active');
  document.querySelector('.template-preview-page').scrollTop = 0;
}

function closeTemplatePreview() {
  document.getElementById('patientTemplatePreviewPage').classList.remove('active');
  if (templatePreviewState.returnPage === 'listPage') {
    document.getElementById('listPage').classList.add('active');
    showListView('indicator');
  } else {
    document.getElementById('patientPage').classList.add('active');
  }
}

function editTemplateFromPreview() {
  document.getElementById('patientTemplatePreviewPage').classList.remove('active');
  if (templatePreviewState.returnPage === 'patientPage') {
    document.getElementById('patientPage').classList.add('active');
    return;
  }
  const templateId = indicatorEditorState.editingId;
  if (templateId) showPatientPage(templateId);
}

function patientIndicatorDisplayLabel(type) {
  return type === 'trend' ? '趋势图' : '结果卡';
}

function renderPatientIndicators() {
  const root = document.getElementById('patientIndicatorContent');
  if (!root) return;
  if (!patientIndicatorState.items.length) {
    root.innerHTML = `<div class="patient-indicator-empty">
      <div class="patient-indicator-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V9M10 19V5M16 19v-7M3 19h18"/><path d="M18 5v6M15 8h6"/></svg></div>
      <strong>暂未添加展示指标</strong>
      <p>添加指标后，可选择结果卡或趋势图。</p>
      <button class="patient-indicator-add" data-open-patient-indicator><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>添加指标</button>
    </div>`;
    return;
  }
  root.innerHTML = `<div class="patient-widget-grid">${patientIndicatorState.items.map(item => {
    const header = `<div class="patient-widget-head"><div><strong>${esc(item.name)}</strong><span>${patientIndicatorDisplayLabel(item.display)}</span></div><button class="patient-widget-remove" data-remove-patient-indicator="${item.id}" title="删除指标" aria-label="删除${esc(item.name)}">×</button></div>`;
    if (item.display === 'trend') return `<article class="patient-widget trend">${header}<div class="patient-widget-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="patient-widget-note">暂无趋势数据</span></article>`;
    if (item.display === 'result') return `<article class="patient-widget">${header}<div class="patient-widget-result"><span>当前结果</span><strong>暂无结果</strong></div></article>`;
    return `<article class="patient-widget">${header}<strong class="patient-widget-value">--</strong><span class="patient-widget-note">暂无指标数据</span></article>`;
  }).join('')}</div>`;
}

function openPatientIndicatorModal() {
  document.getElementById('patientIndicatorName').value = '';
  document.getElementById('patientIndicatorDisplay').value = '';
  const modal = document.getElementById('patientIndicatorModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => document.getElementById('patientIndicatorName').focus());
}

function closePatientIndicatorModal() {
  const modal = document.getElementById('patientIndicatorModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function savePatientIndicator() {
  const name = document.getElementById('patientIndicatorName').value;
  const display = document.getElementById('patientIndicatorDisplay').value;
  if (!name || !display) return showToast('请选择指标名称和展示方式');
  if (patientIndicatorState.items.some(item => item.name === name)) return showToast('该指标已添加');
  patientIndicatorState.items.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    display
  });
  patientPageState.dirty = true;
  closePatientIndicatorModal();
  renderPatientIndicators();
  showToast('指标已添加');
}

function updatePatientTemplateOptions(type, selectedValue = '') {
  const select = document.getElementById('patientTemplateValue');
  const isAllPatients = type === '全部患者';
  const options = [...(indicatorApplicableOptions[type] || [])];
  const selectedValues = applicableValues(selectedValue);
  const allValue = allApplicableOption(type);
  const selectedAll = Boolean(allValue && (selectedValues.includes(allValue) || (!isAllPatients && selectedValues.includes('全部患者'))));
  selectedValues.filter(value => value !== '全部患者' && value !== allValue && !options.includes(value)).reverse().forEach(value => options.unshift(value));
  select.multiple = !isAllPatients;
  select.size = isAllPatients ? 1 : Math.min(5, Math.max(2, options.length));
  select.innerHTML = options.map(value => `<option value="${esc(value)}" ${(selectedAll || selectedValues.includes(value)) ? 'selected' : ''}>${esc(value)}</option>`).join('');
  if (isAllPatients) [...select.options].forEach(option => { option.selected = true; });
  select.disabled = isAllPatients;
  document.getElementById('patientTemplateValueHelp').textContent = isAllPatients ? '匹配全部患者，无需选择其他值' : `支持多选，请选择具体${type}`;
  renderPatientTemplateValueControl();
}

function renderPatientTemplateValueControl() {
  const select = document.getElementById('patientTemplateValue');
  const wrapper = document.getElementById('patientTemplateValueSelect');
  const control = document.getElementById('patientTemplateValueControl');
  const tags = document.getElementById('patientTemplateValueTags');
  const dropdown = document.getElementById('patientTemplateValueDropdown');
  if (!select || !wrapper || !control || !tags || !dropdown) return;
  const type = document.getElementById('patientTemplateType')?.value || '';
  const allValue = allApplicableOption(type);
  const selected = [...select.selectedOptions].map(option => option.value).filter(Boolean);
  const allSelected = Boolean(allValue && [...select.options].some(option => option.value === allValue && option.selected) && [...select.options].every(option => option.selected));
  tags.innerHTML = allSelected
    ? `<span class="patient-value-tag"><span>全部</span>${select.disabled ? '' : `<button type="button" data-remove-patient-template-value="${esc(allValue)}" aria-label="取消全部">×</button>`}</span>`
    : selected.length
    ? selected.map(value => `<span class="patient-value-tag"><span>${esc(value)}</span>${select.disabled ? '' : `<button type="button" data-remove-patient-template-value="${esc(value)}" aria-label="删除${esc(value)}">×</button>`}</span>`).join('')
    : '<span class="patient-value-placeholder">请选择匹配值</span>';
  dropdown.innerHTML = [...select.options].map(option => `<label class="patient-value-option ${option.selected ? 'selected' : ''}" data-patient-template-value-option="${esc(option.value)}"><input type="checkbox" ${option.selected ? 'checked' : ''}><span>${esc(option.textContent)}</span></label>`).join('');
  control.classList.toggle('disabled', select.disabled);
  control.setAttribute('aria-disabled', String(select.disabled));
  if (select.disabled) closePatientTemplateValueDropdown();
}

function closePatientTemplateValueDropdown() {
  const wrapper = document.getElementById('patientTemplateValueSelect');
  const control = document.getElementById('patientTemplateValueControl');
  const dropdown = document.getElementById('patientTemplateValueDropdown');
  if (!wrapper || !control || !dropdown) return;
  wrapper.classList.remove('open');
  dropdown.hidden = true;
  control.setAttribute('aria-expanded', 'false');
}

function togglePatientTemplateValueDropdown() {
  const select = document.getElementById('patientTemplateValue');
  const wrapper = document.getElementById('patientTemplateValueSelect');
  const control = document.getElementById('patientTemplateValueControl');
  const dropdown = document.getElementById('patientTemplateValueDropdown');
  if (!select || select.disabled || !wrapper || !control || !dropdown) return;
  const willOpen = dropdown.hidden;
  dropdown.hidden = !willOpen;
  wrapper.classList.toggle('open', willOpen);
  control.setAttribute('aria-expanded', String(willOpen));
}

function setPatientTemplateValue(value, remove = false) {
  const select = document.getElementById('patientTemplateValue');
  const type = document.getElementById('patientTemplateType').value;
  const option = [...select.options].find(item => item.value === value);
  if (!option || select.disabled) return;
  const allValue = allApplicableOption(type);
  const allOption = [...select.options].find(item => item.value === allValue);
  if (value === allValue) {
    const shouldSelect = remove ? false : !option.selected;
    [...select.options].forEach(item => { item.selected = shouldSelect; });
  } else if (remove) {
    option.selected = false;
    if (allOption) allOption.selected = false;
  }
  else {
    option.selected = !option.selected;
    if (allOption) allOption.selected = false;
  }
  patientPageState.dirty = true;
  renderPatientTemplateValueControl();
}

function renderPatientTemplateConfig() {
  const item = indicatorTemplates.find(row => row.id === patientPageState.editingId) || indicatorTemplates[0];
  if (!item) return;
  patientPageState.editingId = item.id;
  const applicableType = item.applicableProfile === '全部患者' ? '全部患者' : (item.applicableType || inferApplicableType(item.applicableProfile));
  document.getElementById('patientTemplateName').value = item.name;
  document.getElementById('patientTemplateType').value = applicableType;
  updatePatientTemplateOptions(applicableType, item.applicableProfile);
}

function showPatientPage(id = null, createNew = false) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('patientPage').classList.add('active');
  patientPageState.creating = createNew;
  patientPageState.editingId = createNew ? null : (id || patientPageState.editingId || indicatorTemplates[0]?.id || null);
  patientPageState.dirty = false;
  const item = createNew ? null : (indicatorTemplates.find(row => row.id === patientPageState.editingId) || indicatorTemplates[0]);
  indicatorEditorState.editingId = item?.id || null;
  indicatorEditorState.dirty = false;
  indicatorEditorState.draft = item
    ? JSON.parse(JSON.stringify({ ...item, metrics: (item.metrics || []).map(normalizeIndicatorMetric) }))
    : { id: null, name: '', applicableType: '方案', applicableProfile: '全部患者', published: false, metrics: [] };
  indicatorEditorState.granularity = '日';
  indicatorEditorState.range = `${indicatorEditorState.startDate} 至 ${indicatorEditorState.endDate}`;
  if (createNew) {
    document.getElementById('patientTemplateName').value = '';
    document.getElementById('patientTemplateType').value = '全部患者';
    updatePatientTemplateOptions('全部患者', '全部患者');
  } else {
    renderPatientTemplateConfig();
  }
  renderPatientDetail();
  document.querySelectorAll('[data-granularity]').forEach(button => button.classList.toggle('active', button.dataset.granularity === '日'));
  renderIndicatorMetricEditor();
}

function exitPatientPage() {
  if (patientPageState.dirty && !window.confirm('当前内容尚未保存，确定退出吗？')) return;
  document.getElementById('patientPage').classList.remove('active');
  document.getElementById('listPage').classList.add('active');
  showListView(patientPageState.returnView || 'indicator');
}

function openPatientSaveModal() {
  if (patientPageState.saving) return;
  const modal = document.getElementById('patientSaveModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closePatientSaveModal() {
  const modal = document.getElementById('patientSaveModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function savePatientDetail() {
  if (patientPageState.saving) return;
  const item = indicatorTemplates.find(row => row.id === patientPageState.editingId);
  const name = document.getElementById('patientTemplateName').value.trim();
  const applicableType = document.getElementById('patientTemplateType').value;
  const applicableProfile = selectedApplicableValue('patientTemplateValue');
  if (!name || !applicableType || !applicableProfile) { closePatientSaveModal(); return showToast('请填写模板名称、匹配维度和匹配值'); }
  const metrics = indicatorEditorState.draft?.metrics || [];
  if (metrics.some(metric => !metric.name.trim() || !metric.display)) { closePatientSaveModal(); return showToast('请完善指标名称和展示方式'); }
  patientPageState.saving = true;
  const button = document.querySelector('[data-save-patient-detail]');
  const confirmButton = document.querySelector('[data-confirm-patient-save]');
  button.classList.add('loading');
  button.textContent = '保存中...';
  confirmButton.disabled = true;
  confirmButton.textContent = '保存中...';
  setTimeout(() => {
    const savedValues = { name, applicableType, applicableProfile, metrics: JSON.parse(JSON.stringify(metrics)), published: item?.published || false };
    if (item) {
      Object.assign(item, savedValues);
    } else {
      const createdItem = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), ...savedValues };
      indicatorTemplates.unshift(createdItem);
      patientPageState.editingId = createdItem.id;
      patientPageState.creating = false;
      indicatorEditorState.editingId = createdItem.id;
      indicatorEditorState.draft.id = createdItem.id;
    }
    patientPageState.saving = false;
    patientPageState.dirty = false;
    button.classList.remove('loading');
    button.textContent = '保存';
    confirmButton.disabled = false;
    confirmButton.textContent = '确定';
    closePatientSaveModal();
    renderIndicatorList();
    showToast('保存成功');
  }, 500);
}

function openPatientPublishModal() {
  if (patientPageState.publishing) return;
  const name = document.getElementById('patientTemplateName').value.trim();
  const applicableType = document.getElementById('patientTemplateType').value;
  const applicableProfile = selectedApplicableValue('patientTemplateValue');
  if (!name || !applicableType || !applicableProfile) return showToast('请先填写模板名称、匹配维度和匹配值');
  if (!(indicatorEditorState.draft?.metrics || []).length) return showToast('发布前请至少添加一个指标');
  if (indicatorEditorState.draft.metrics.some(metric => !metric.name.trim() || !metric.display)) return showToast('请先完善所有指标配置');
  const modal = document.getElementById('patientPublishModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closePatientPublishModal() {
  const modal = document.getElementById('patientPublishModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function publishPatientDetail() {
  if (patientPageState.publishing) return;
  patientPageState.publishing = true;
  const headerButton = document.querySelector('[data-publish-patient]');
  const confirmButton = document.querySelector('[data-confirm-patient-publish]');
  headerButton.classList.add('loading');
  headerButton.textContent = '发布中...';
  confirmButton.disabled = true;
  confirmButton.textContent = '发布中...';
  setTimeout(() => {
    const item = indicatorTemplates.find(row => row.id === patientPageState.editingId);
    const publishedValues = {
      name: document.getElementById('patientTemplateName').value.trim(),
      applicableType: document.getElementById('patientTemplateType').value,
      applicableProfile: selectedApplicableValue('patientTemplateValue'),
      metrics: JSON.parse(JSON.stringify(indicatorEditorState.draft.metrics)),
      published: true
    };
    if (item) Object.assign(item, publishedValues);
    else indicatorTemplates.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), ...publishedValues });
    patientPageState.publishing = false;
    patientPageState.dirty = false;
    headerButton.classList.remove('loading');
    headerButton.textContent = '发布';
    confirmButton.disabled = false;
    confirmButton.textContent = '确认发布';
    closePatientPublishModal();
    renderIndicatorList();
    exitPatientPage();
    showToast('发布成功');
  }, 600);
}

function portraitTypeLabel(type) {
  return { diagnosis: '疾病诊断', abnormal: '异常指标', risk: '风险提示' }[type] || '疾病诊断';
}

function renderPortraitEditor() {
  const rows = patientEditState.draft?.portraits || [];
  document.getElementById('portraitEditorRows').innerHTML = rows.length ? rows.map((item, index) => `<div class="portrait-editor-row">
    <select class="archive-select" data-portrait-field="type" data-portrait-index="${index}"><option value="diagnosis" ${item.type === 'diagnosis' ? 'selected' : ''}>疾病诊断</option><option value="abnormal" ${item.type === 'abnormal' ? 'selected' : ''}>异常指标</option><option value="risk" ${item.type === 'risk' ? 'selected' : ''}>风险提示</option></select>
    <input class="archive-input" data-portrait-field="name" data-portrait-index="${index}" value="${esc(item.name)}" placeholder="请输入名称">
    <input class="archive-input" data-portrait-field="note" data-portrait-index="${index}" value="${esc(item.note)}" placeholder="请输入来源、备注或说明">
    <button class="portrait-remove" data-remove-portrait="${index}" title="删除">×</button>
  </div>`).join('') : '<div class="muted-note">暂无健康画像条目，可点击下方按钮新增。</div>';
}

function updateEditorMeta() {
  const draft = patientEditState.draft;
  document.getElementById('editorPatientMeta').textContent = `${draft.name || '未填写姓名'} · ${draft.gender || '未选择性别'} · ${draft.age ? `${draft.age}岁` : '年龄未知'} · 就诊号 ${draft.visitNo}`;
}

function openPatientEditor() {
  patientEditState.draft = JSON.parse(JSON.stringify(patientRecord));
  patientEditState.dirty = false;
  document.querySelectorAll('[data-patient-field]').forEach(input => {
    input.value = patientEditState.draft[input.dataset.patientField] || '';
    input.closest('.archive-field')?.classList.remove('changed');
  });
  document.querySelectorAll('[data-error-for]').forEach(node => node.textContent = '');
  document.getElementById('patientEditorError').classList.remove('show');
  document.querySelectorAll('[data-habit]').forEach(group => {
    group.querySelectorAll('[data-habit-value]').forEach(button => button.classList.toggle('active', button.dataset.habitValue === patientEditState.draft[group.dataset.habit]));
  });
  document.querySelectorAll('.editor-section').forEach(section => section.classList.remove('collapsed'));
  renderPortraitEditor();
  updateEditorMeta();
  const editor = document.getElementById('patientEditor');
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  editor.classList.add('active');
  editor.setAttribute('aria-hidden', 'false');
}

function closePatientEditor(force = false) {
  if (!force && patientEditState.dirty && !window.confirm('当前内容尚未保存，确定退出吗？')) return;
  const editor = document.getElementById('patientEditor');
  editor.classList.remove('active');
  editor.setAttribute('aria-hidden', 'true');
  patientEditState.dirty = false;
  patientEditState.draft = null;
  document.getElementById('patientPage').classList.add('active');
  renderPatientDetail();
}

function validatePatientDraft() {
  const draft = patientEditState.draft;
  const errors = {};
  if (!draft.name.trim()) errors.name = '请输入姓名';
  if (!draft.gender) errors.gender = '请选择性别';
  if (!draft.birthDate) errors.birthDate = '请选择出生年月';
  if (!/^1\d{10}$/.test(draft.phone)) errors.phone = '请输入正确的 11 位手机号码';
  document.querySelectorAll('[data-error-for]').forEach(node => node.textContent = errors[node.dataset.errorFor] || '');
  return Object.keys(errors).length === 0;
}

function savePatientRecord() {
  if (!validatePatientDraft()) {
    document.getElementById('patientEditorError').classList.add('show');
    document.querySelector('[data-error-for]:not(:empty)')?.closest('.archive-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  document.getElementById('patientEditorError').classList.remove('show');
  const button = document.querySelector('[data-save-patient]');
  button.classList.add('loading');
  button.textContent = '保存中...';
  setTimeout(() => {
    Object.assign(patientRecord, JSON.parse(JSON.stringify(patientEditState.draft)));
    renderPatientDetail();
    button.classList.remove('loading');
    button.textContent = '保存';
    closePatientEditor(true);
    showToast('保存成功');
  }, 450);
}
