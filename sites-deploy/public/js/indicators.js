function openIndicatorModal(id = null) {
  const item = id ? indicatorTemplates.find(row => row.id === id) : null;
  indicatorState.editingId = item?.id || null;
  document.getElementById('indicatorModalTitle').textContent = item ? '编辑指标看板' : '新建指标看板';
  document.getElementById('indicatorName').value = item?.name || '';
  document.getElementById('indicatorApplicableProfile').value = item?.applicableProfile || '';
  document.getElementById('indicatorStatus').value = item?.published ? '发布' : '未发布';
  const modal = document.getElementById('indicatorModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => document.getElementById('indicatorName').focus());
}

function closeIndicatorModal() {
  const modal = document.getElementById('indicatorModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  indicatorState.editingId = null;
}

function saveIndicatorTemplate() {
  const name = document.getElementById('indicatorName').value.trim();
  const applicableProfile = document.getElementById('indicatorApplicableProfile').value.trim();
  if (!name || !applicableProfile) return showToast('请填写看板名称和适用画像');
  const duplicate = indicatorTemplates.find(item => item.name.toLowerCase() === name.toLowerCase() && item.id !== indicatorState.editingId);
  if (duplicate) return showToast('指标看板名称已存在');
  const values = {
    name,
    applicableProfile,
    published: document.getElementById('indicatorStatus').value === '发布'
  };
  const wasEditing = !!indicatorState.editingId;
  if (wasEditing) {
    const item = indicatorTemplates.find(row => row.id === indicatorState.editingId);
    Object.assign(item, values);
  } else {
    indicatorTemplates.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), ...values });
  }
  closeIndicatorModal();
  renderIndicatorList();
  showToast(wasEditing ? '指标看板已更新' : '指标看板已创建');
}

function normalizeIndicatorMetric(metric = {}) {
  const knownSource = ['居家打卡','检验数据','检查数据','设备上传'].includes(metric.source) ? metric.source : '居家打卡';
  const display = ['趋势图','多趋势图','柱状图'].includes(metric.display) ? '趋势图' : '结果卡';
  return {
    name: metric.name || '',
    display,
    source: knownSource,
    period: metric.period || '按日'
  };
}

function indicatorTypeClass(display) {
  return { '趋势图': 'trend', '多趋势图': 'trend', '柱状图': 'trend', '指标卡': 'metric', '结果卡': 'result' }[display] || 'metric';
}

function recommendedIndicatorDisplay(name) {
  if (['血压','血糖'].includes(name)) return '趋势图';
  return '结果卡';
}

function indicatorDisplayWarning(metric) {
  const visualDisplays = ['趋势图', '多趋势图', '柱状图'];
  if (!visualDisplays.includes(metric.display)) return '';
  const resultOnlyIndicators = ['尿蛋白', '尿酮体', '复诊事件', '用药调整', '报告上传'];
  if (!resultOnlyIndicators.some(name => metric.name.includes(name))) return '';
  return metric.display === '柱状图' ? '该指标不支持柱状图展示。' : '该指标不支持趋势图展示。';
}

function indicatorSample(metric, index) {
  const name = metric.name || `未命名指标 ${index + 1}`;
  const lower = name.toLowerCase();
  if (name.includes('腰围')) return { value: '82', unit: 'cm', status: '正常', statusClass: '', legend: [] };
  if (name.includes('腰臀比')) return { value: '0.86', unit: '', status: '正常', statusClass: '', legend: [] };
  if (name.includes('血压')) return { value: '128/82', unit: 'mmHg', status: '正常', statusClass: '', legend: ['收缩压','舒张压'] };
  if (name.includes('血糖')) return { value: '6.2', unit: 'mmol/L', status: '偏高', statusClass: 'high', legend: ['空腹','餐后 2 小时'] };
  if (lower.includes('bmi') || name.includes('体重')) return { value: lower.includes('bmi') ? '21.6' : '52.8', unit: lower.includes('bmi') ? 'kg/m²' : 'kg', status: '正常', statusClass: '', legend: [] };
  if (name.includes('身高')) return { value: '172', unit: 'cm', status: '正常', statusClass: '', legend: [] };
  if (name.includes('心率')) return { value: '76', unit: '次/分', status: '正常', statusClass: '', legend: [] };
  if (name.includes('体脂')) return { value: '24.6', unit: '%', status: '偏高', statusClass: 'high', legend: [] };
  if (name.includes('肾小球')) return { value: '68', unit: 'mL/min/1.73m²', status: '偏低', statusClass: 'low', legend: [] };
  if (name.includes('总胆固醇')) return { value: '4.8', unit: 'mmol/L', status: '正常', statusClass: '', legend: [] };
  if (name.includes('高密度脂蛋白')) return { value: '1.3', unit: 'mmol/L', status: '正常', statusClass: '', legend: [] };
  if (name.includes('低密度脂蛋白')) return { value: '3.6', unit: 'mmol/L', status: '偏高', statusClass: 'high', legend: [] };
  if (name.includes('TgAb')) return { value: '32', unit: 'IU/mL', status: '正常', statusClass: '', legend: [] };
  if (name.includes('TPOAb')) return { value: '28', unit: 'IU/mL', status: '正常', statusClass: '', legend: [] };
  if (name.includes('EB病毒')) return { value: '阳性', unit: '', status: '正常', statusClass: '', legend: [] };
  if (name.includes('β2糖蛋白')) return { value: '12', unit: 'RU/mL', status: '正常', statusClass: '', legend: [] };
  if (name.includes('尿蛋白') || name.includes('尿酮')) return { value: '阴性', unit: '', status: '正常', statusClass: '', legend: [] };
  if (name.includes('尿酸')) return { value: '368', unit: 'μmol/L', status: '正常', statusClass: '', legend: [] };
  if (lower.includes('hba1c')) return { value: '6.8', unit: '%', status: '偏高', statusClass: 'high', legend: [] };
  if (lower.includes('egfr')) return { value: '92', unit: 'mL/min', status: '正常', statusClass: '', legend: [] };
  return { value: '--', unit: '', status: '暂无数据', statusClass: 'none', legend: ['测量值','参考值'] };
}

function trendChartSvg(index, metric, mode = '趋势图') {
  const granularity = indicatorEditorState.granularity;
  const start = new Date(`${indicatorEditorState.startDate}T00:00:00`);
  const end = new Date(`${indicatorEditorState.endDate}T00:00:00`);
  const xLabels = granularity === '日'
    ? ['08:00','10:00','12:00','14:00','16:00','18:00','20:00']
    : Array.from({ length: 7 }, (_, pointIndex) => {
        const ratio = pointIndex / 6;
        const date = new Date(start.getTime() + (end.getTime() - start.getTime()) * ratio);
        return granularity === '年' ? `${date.getMonth() + 1}月` : `${date.getMonth() + 1}月${date.getDate()}日`;
      });
  const isBloodPressure = metric.name.includes('血压');
  const isBloodSugar = metric.name.includes('血糖');
  const yLabels = isBloodPressure ? ['160','120','80'] : isBloodSugar ? ['12','6','0'] : ['100','50','0'];
  const unit = isBloodPressure ? 'mmHg' : isBloodSugar ? 'mmol/L' : '数值';
  const shift = (granularity.charCodeAt(0) + index * 7) % 10;
  const xs = [38,82,126,170,214,258,302];
  const aYs = [64-shift,52+shift/2,58-shift/3,38+shift/2,47-shift/2,31+shift/3,42-shift/4];
  const bYs = [84-shift/2,77+shift/3,81-shift/4,68+shift/3,73-shift/5,59+shift/4,66-shift/3];
  const a = xs.map((x, i) => `${x},${aYs[i]}`).join(' ');
  const b = xs.map((x, i) => `${x},${bYs[i]}`).join(' ');
  const xText = xs.map((x, i) => `<text class="chart-axis-label" x="${x}" y="119" text-anchor="middle">${xLabels[i]}</text>`).join('');
  const yText = [18,55,92].map((y, i) => `<text class="chart-axis-label" x="28" y="${y + 3}" text-anchor="end">${yLabels[i]}</text>`).join('');
  const lineA = `<polyline class="chart-line-a" points="${a}"/>${a.split(' ').map(point => { const [x,y] = point.split(','); return `<circle class="chart-dot-a" cx="${x}" cy="${y}" r="2.7"/>`; }).join('')}`;
  const lineB = `<polyline class="chart-line-b" points="${b}"/>${b.split(' ').map(point => { const [x,y] = point.split(','); return `<circle class="chart-dot-b" cx="${x}" cy="${y}" r="2.7"/>`; }).join('')}`;
  const bars = xs.map((x, i) => `<rect class="chart-bar-a" x="${x - 8}" y="${aYs[i]}" width="16" height="${96 - aYs[i]}" rx="2"/>`).join('');
  const plot = mode === '柱状图' ? bars : mode === '多趋势图' ? lineA + lineB : lineA;
  return `<svg viewBox="0 0 320 128" aria-label="${esc(metric.name)}${mode}"><text class="chart-axis-unit" x="36" y="9">${unit}</text><path class="chart-axis" d="M34 14V96H308"/><path class="chart-grid" d="M34 18H308M34 55H308M34 92H308"/>${yText}${xText}${plot}</svg>`;
}

function renderIndicatorPreview() {
  const root = document.getElementById('indicatorPreviewGrid');
  if (!root) return;
  const metrics = indicatorEditorState.draft?.metrics || [];
  if (!metrics.length) {
    root.innerHTML = `<div class="preview-empty"><div class="preview-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V9M10 19V5M16 19v-7M3 19h18"/><path d="M18 5v6M15 8h6"/></svg></div><strong>暂无展示指标</strong><p>请先在上方添加指标，系统将根据配置生成看板预览</p></div>`;
    return;
  }
  root.innerHTML = metrics.map((metric, index) => {
    const sample = indicatorSample(metric, index);
    const displayWarning = indicatorDisplayWarning(metric);
    const header = `<div class="preview-card-head"><div><h3>${esc(metric.name || '未命名指标')}</h3><span class="preview-update">更新时间：2026-06-12 08:30</span></div></div>`;
    const latest = `<div class="preview-latest"><strong>${sample.value}</strong><span>${sample.unit}</span></div>`;
    if (['趋势图','多趋势图','柱状图'].includes(metric.display)) {
      if (displayWarning) return `<article class="preview-card trend">${header}${latest}<div class="preview-unsupported">${esc(displayWarning)}</div></article>`;
      const legend = metric.display === '多趋势图' ? sample.legend : [];
      return `<article class="preview-card trend">${header}${latest}<div class="mini-chart">${trendChartSvg(index, metric, metric.display)}</div>${legend.length ? `<div class="chart-legend">${legend.map(item => `<span><i></i>${item}</span>`).join('')}</div>` : ''}</article>`;
    }
    if (metric.display === '结果卡') return `<article class="preview-card preview-compact">${header}${latest}</article>`;
    return `<article class="preview-card preview-compact metric-value-card">${header}<div>${latest}<div class="metric-gauge"><i></i></div></div></article>`;
  }).join('');
}

function renderIndicatorMetricEditor() {
  const metrics = indicatorEditorState.draft?.metrics || [];
  const displayOptions = ['结果卡','趋势图'];
  const indicatorOptions = ['腰围','腰臀比','体重指数 BMI','身高','体重','心率','总胆固醇','高密度脂蛋白胆固醇','低密度脂蛋白胆固醇（LDL-C）','糖化血红蛋白 HbA1c','抗甲状腺球蛋白抗体 TgAb','抗甲状腺过氧化物酶抗体 TPOAb','EB病毒核抗原IgG','抗β2糖蛋白I抗体','血压','血糖','血尿酸'];
  document.getElementById('indicatorMetricRows').innerHTML = metrics.map((metric, index) => `<article class="indicator-metric-card" data-metric-card-index="${index}">
    <div class="metric-card-head"><div class="metric-card-actions"><button class="metric-drag" draggable="true" data-drag-indicator-metric="${index}" title="拖动排序" aria-label="拖动${esc(metric.name || '指标')}排序">⋮⋮</button><button class="metric-delete" data-remove-indicator-metric="${index}" title="删除指标" aria-label="删除${esc(metric.name || '指标')}">${trashIcon()}</button></div></div>
    <div class="metric-field"><label>指标</label><select class="indicator-edit-select" data-indicator-metric-field="name" data-indicator-metric-index="${index}"><option value="">请选择指标</option>${metric.name && !indicatorOptions.includes(metric.name) ? `<option selected>${esc(metric.name)}</option>` : ''}${indicatorOptions.map(value => `<option ${metric.name === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
    <div class="metric-field"><label>展示方式</label><select class="indicator-edit-select" data-indicator-metric-field="display" data-indicator-metric-index="${index}">${displayOptions.map(value => `<option ${metric.display === value ? 'selected' : ''}>${value}</option>`).join('')}</select>${indicatorDisplayWarning(metric) ? `<div class="metric-display-warning">${esc(indicatorDisplayWarning(metric))}</div>` : ''}</div>
  </article>`).join('') + `<button class="indicator-add-card" data-add-indicator-metric><span class="indicator-add-icon">+</span><strong>添加指标</strong><p>从指标库选择指标，系统将推荐展示方式</p></button>`;
  renderIndicatorPreview();
}

function inferApplicableType(value) {
  if (value === '全部患者') return '全部患者';
  if (/科|内科/.test(value)) return '科室';
  if (/团队/.test(value)) return '团队';
  if (/糖尿病|高血压|肿瘤|肺癌|诊断/.test(value)) return '主诊断';
  return '方案';
}

function applicableValues(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || '').split(/[、,，]/).map(item => item.trim()).filter(Boolean);
}

function allApplicableOption(type) {
  return {
    '全部患者': '全部患者',
    '方案': '全部患者管理方案',
    '科室': '全部科室',
    '主诊断': '全部诊断',
    '团队': '全院患者管理团队'
  }[type] || '';
}

function selectedApplicableValue(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return '';
  const typeSelectId = selectId === 'patientTemplateValue' ? 'patientTemplateType' : 'indicatorEditorApplicableType';
  const type = document.getElementById(typeSelectId)?.value || '';
  const allValue = allApplicableOption(type);
  if (allValue && [...select.options].some(option => option.value === allValue && option.selected)) return allValue;
  return [...select.selectedOptions].map(option => option.value).filter(Boolean).join('、');
}

function normalizeAllApplicableSelection(select, type) {
  const allValue = allApplicableOption(type);
  if (!allValue || ![...select.selectedOptions].some(option => option.value === allValue)) return;
  [...select.options].forEach(option => { option.selected = true; });
}

function updateIndicatorApplicableOptions(type, selectedValue = '') {
  const select = document.getElementById('indicatorEditorApplicableValue');
  const isAllPatients = type === '全部患者';
  const options = [...(indicatorApplicableOptions[type] || [])];
  const selectedValues = applicableValues(selectedValue);
  selectedValues.filter(value => value !== '全部患者' && !options.includes(value)).reverse().forEach(value => options.unshift(value));
  select.multiple = !isAllPatients;
  select.size = isAllPatients ? 1 : Math.min(5, Math.max(2, options.length));
  select.innerHTML = options.map(value => `<option value="${esc(value)}" ${selectedValues.includes(value) ? 'selected' : ''}>${esc(value)}</option>`).join('');
  if (isAllPatients) select.value = '全部患者';
  else if (!selectedValues.length && options[0]) select.options[0].selected = true;
  select.disabled = isAllPatients;
  document.getElementById('indicatorApplicableHelp').textContent = isAllPatients ? '匹配全部患者，无需选择其他值' : `支持多选，请选择具体${type}`;
}

function openIndicatorEditor(id) {
  const item = indicatorTemplates.find(row => row.id === id);
  if (!item) return;
  indicatorEditorState.editingId = id;
  indicatorEditorState.dirty = false;
  indicatorEditorState.draft = JSON.parse(JSON.stringify({ ...item, metrics: (item.metrics || []).map(normalizeIndicatorMetric) }));
  indicatorEditorState.granularity = '日';
  indicatorEditorState.range = `${indicatorEditorState.startDate} 至 ${indicatorEditorState.endDate}`;
  document.getElementById('indicatorEditorName').value = item.name;
  const applicableType = item.applicableProfile === '全部患者' ? '全部患者' : (item.applicableType || inferApplicableType(item.applicableProfile));
  document.getElementById('indicatorEditorApplicableType').value = applicableType;
  updateIndicatorApplicableOptions(applicableType, item.applicableProfile);
  document.querySelectorAll('[data-granularity]').forEach(button => button.classList.toggle('active', button.dataset.granularity === '日'));
  renderIndicatorMetricEditor();
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById('indicatorEditorPage')?.classList.add('active');
}

function closeIndicatorEditor(force = false) {
  if (!force && indicatorEditorState.dirty && !window.confirm('当前内容尚未保存，确定退出吗？')) return;
  indicatorEditorState.editingId = null;
  indicatorEditorState.dirty = false;
  indicatorEditorState.draft = null;
  document.getElementById('indicatorEditorPage')?.classList.remove('active');
  document.getElementById('listPage').classList.add('active');
  showListView('indicator');
}

function saveIndicatorEditor() {
  const draft = indicatorEditorState.draft;
  draft.name = document.getElementById('indicatorEditorName').value.trim();
  draft.applicableType = document.getElementById('indicatorEditorApplicableType').value;
  draft.applicableProfile = selectedApplicableValue('indicatorEditorApplicableValue');
  if (!draft.name || !draft.applicableType || !draft.applicableProfile) return showToast('请填写模板名称和适用对象');
  if (draft.metrics.some(metric => !metric.name.trim() || !metric.display)) return showToast('请完善指标名称和展示方式');
  const item = indicatorTemplates.find(row => row.id === indicatorEditorState.editingId);
  Object.assign(item, JSON.parse(JSON.stringify(draft)));
  indicatorEditorState.dirty = false;
  closeIndicatorEditor(true);
  renderIndicatorList();
  showToast('指标模板已保存');
}

function publishIndicatorEditor() {
  const draft = indicatorEditorState.draft;
  if (!draft) return;
  draft.name = document.getElementById('indicatorEditorName').value.trim();
  draft.applicableType = document.getElementById('indicatorEditorApplicableType').value;
  draft.applicableProfile = selectedApplicableValue('indicatorEditorApplicableValue');
  if (!draft.name || !draft.applicableType || !draft.applicableProfile) return showToast('请先完善模板名称、适用维度和适用对象');
  if (!draft.metrics.length) return showToast('发布前请至少添加一个指标');
  if (draft.metrics.some(metric => !metric.name.trim() || !metric.display)) return showToast('请先完善所有指标配置');
  const item = indicatorTemplates.find(row => row.id === indicatorEditorState.editingId);
  Object.assign(item, JSON.parse(JSON.stringify({ ...draft, published: true })));
  indicatorEditorState.dirty = false;
  renderIndicatorList();
  showToast('指标模板已发布');
}
