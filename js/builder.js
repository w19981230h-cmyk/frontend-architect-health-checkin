function renderPalette() {
  const groups = ['选择', '文本输入', '高级题型', '矩阵'];
  document.getElementById('palette').innerHTML = groups.map(group => {
    const buttons = Object.entries(typeMeta).filter(([, m]) => m.section === group).map(([type, m]) => (
      `<button class="type-btn ${type === selected()?.type ? 'active' : ''}" data-add-type="${type}">${m.icon}<span>${m.label}</span></button>`
    )).join('');
    return `<div class="type-group"><h3 class="group-title">${group}</h3><div class="type-grid">${buttons}</div></div>`;
  }).join('');
}

function renderCanvas() {
  const html = state.questions.map((item, idx) => {
    item.index = idx + 1;
    const active = item.id === state.selectedId;
    return `<article class="q-card ${active ? 'selected' : ''}" data-qid="${item.id}">
      ${active ? `<div class="float-tools"><button data-duplicate="${item.id}">${copyIcon()}复制</button><button data-delete="${item.id}">${trashIcon()}删除</button></div>` : ''}
      <div class="q-head"><span class="q-chip">${typeMeta[item.type].label}</span><span class="required-inline"><span class="mini-switch ${item.required ? 'on' : ''}" data-toggle-required="${item.id}"></span>必填</span></div>
      <div class="q-title-row"><span class="req-mark">*</span><span class="q-no">${String(item.index).padStart(2, '0')}</span><input class="q-title" data-title="${item.id}" value="${esc(item.title)}"></div>
      <textarea class="q-desc" data-desc="${item.id}">${esc(item.desc)}</textarea>
      ${renderQuestionBody(item)}
    </article>`;
  }).join('');
  document.getElementById('canvas').innerHTML = html;
}

function renderQuestionBody(item) {
  if (item.type === 'single' || item.type === 'multiple') {
    const marker = item.type === 'single' ? 'fake-radio' : 'fake-check';
    syncOptionSettings(item);
    return `${item.options.map((o, index) => `<div class="option-row ${isSelectedOption(item, index) ? 'selected' : ''}" data-qid="${item.id}" data-option-index="${index}"><span class="${marker}"></span><span>${esc(o)}</span></div>`).join('')}
      <div class="option-actions"><button class="small-link">${plusIcon()}添加选项</button><span>|</span><button class="small-link">${plusCircleIcon()}添加其他</button></div>`;
  }
  if (item.type === 'text') return `<div class="text-answer">请输入</div>`;
  if (item.type === 'date') return `<div class="date-answer"><span>请选择年月日</span>${calendarIcon()}</div>`;
  if (item.type === 'rating') {
    return `<p class="rating-note">5分表示非常满意，1分表示非常不满意，分值越低表示满意度越低</p>
      <div class="rating-labels"><span class="rating-label">非常不满意</span><span class="rating-label">非常满意</span></div><div class="stars">★★★★★</div>`;
  }
  return renderMatrix(item);
}

function renderMatrix(item) {
  syncMatrixOptionSettings(item);
  const columns = matrixColumnsForRender(item);
  const head = columns.map((c, index) => `<th class="matrix-option ${isSelectedMatrixOption(item, index) ? 'selected' : ''}" data-qid="${item.id}" data-matrix-option-index="${index}"><input class="matrix-title-input" data-matrix-column-title="${index}" value="${esc(c.title)}"></th>`).join('');
  const rows = item.rows.map((row, rowIndex) => `<tr><td><input class="matrix-title-input" data-matrix-row-title="${rowIndex}" value="${esc(row)}"></td>${columns.map(c => `<td>${renderMatrixCell(c)}</td>`).join('')}</tr>`).join('');
  return `<table class="matrix-table"><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table>
    <div class="matrix-actions"><button class="small-link" data-add-matrix-row="${item.id}">${plusIcon()}添加行</button><button class="small-link" data-add-matrix-column="${item.id}">${plusCircleIcon()}添加选项</button></div>`;
}

function matrixColumnsForRender(item) {
  if (item.type !== 'matrixCustom') {
    return item.columns.map(c => ({ title: c, dataType: item.type === 'matrixSingle' ? 'single' : item.type === 'matrixMultiple' ? 'multiple' : 'rating', options: ['选项1', '选项2'] }));
  }
  return item.columns.map((column, index) => {
    const setting = item.matrixOptionSettings[index] || defaultOptionSetting();
    return {
      title: column.title,
      dataType: columnDataTypeFromFieldType(setting.fieldType),
      options: optionValueItems(setting)
    };
  });
}

function renderMatrixCell(column) {
  const type = typeof column === 'string' ? column : column.dataType;
  const options = Array.isArray(column.options) ? column.options : ['选项1', '选项2'];
  if (['select', 'single', 'multiple'].includes(type)) return `<span class="matrix-select-cell"><select class="matrix-input"><option>请选择</option>${options.map(option => `<option>${esc(option)}</option>`).join('')}</select></span>`;
  if (type === 'fill') return `<input class="matrix-input" placeholder="请输入">`;
  if (type === 'rating') return `<span style="color:#e8ecf2;font-size:18px">★</span>`;
  if (type === 'date') return `<input class="matrix-input matrix-date-input" type="date">`;
  return `<span class="fake-radio"></span>`;
}

function renderProps() {
  const item = selected();
  if (!item) return;
  const option = currentOption(item);
  const showOptionTab = !!option;
  const activeTab = showOptionTab ? state.activePropTab : 'question';
  document.getElementById('propsTabs').innerHTML = showOptionTab
    ? `<button class="prop-tab ${activeTab === 'question' ? 'active' : ''}" data-prop-tab="question">题目设置</button><button class="prop-tab ${activeTab === 'option' ? 'active' : ''}" data-prop-tab="option">选项设置</button>`
    : `<button class="prop-tab active" data-prop-tab="question">题目设置</button>`;
  let html = '';
  if (activeTab === 'option') {
    html += optionProps(item, option);
    document.getElementById('props').innerHTML = html;
    return;
  }
  html += `<div class="field"><label>题目</label><select class="select" data-prop="type">${Object.entries(typeMeta).map(([k, m]) => `<option value="${k}" ${item.type === k ? 'selected' : ''}>${m.label}</option>`).join('')}</select></div>
    <div class="required-prop"><span>是否必填:</span><span class="mini-switch ${item.required ? 'on' : ''}" data-toggle-required="${item.id}"></span></div>`;
  if (item.type === 'single' || item.type === 'multiple') html += choiceProps(item);
  if (item.type === 'text') html += textProps(item);
  if (item.type === 'date') html += dateProps(item);
  if (item.type === 'rating') html += ratingProps(item, false);
  if (item.type === 'matrixSingle' || item.type === 'matrixMultiple') html += matrixChoiceProps(item);
  if (item.type === 'matrixRating') html += ratingProps(item, true) + matrixChoiceProps(item, false);
  if (item.type === 'matrixCustom') html += matrixCustomProps(item);
  document.getElementById('props').innerHTML = html;
}

function optionProps(item, option) {
  const isMatrixOption = state.selectedOption?.source === 'matrix';
  const disabled = hasMetricBinding(option) ? ' disabled' : '';
  return `<div class="field"><label>当前选项</label><input class="input" value="${esc(selectedOptionLabel(item))}" data-option-label></div>
    <div class="field"><label>指标绑定</label><div class="search-bind"><input class="input" list="metricFieldList" data-option-metric value="${esc(option.metric)}" placeholder="搜索或选择数据库字段"></div><datalist id="metricFieldList">${metricFields.map(field => `<option value="${esc(field)}"></option>`).join('')}</datalist></div>
    ${isMatrixOption ? `<div class="field"><label>字段类型</label><select class="select" data-option-prop="fieldType"${disabled}>${['下拉选择','单选','多选','填空','评分','日期'].map(type => `<option ${option.fieldType === type ? 'selected' : ''}>${type}</option>`).join('')}</select></div>${optionTypeSettings(option)}` : ''}`;
}

function hasMetricBinding(option) {
  return !!String(option.metric || '').trim();
}

function optionTypeSettings(option) {
  const disabled = hasMetricBinding(option) ? ' disabled' : '';
  if (option.fieldType === '下拉选择') {
    const label = '下拉值域';
    return `<div class="field"><label>${label}</label><div class="hint">每行一个可选值</div><textarea class="textarea" data-option-prop="valueDomain"${disabled}>${esc(option.valueDomain)}</textarea></div>`;
  }
  if (['单选', '多选'].includes(option.fieldType)) {
    return valueOptionProps(option, disabled);
  }
  if (option.fieldType === '填空') {
    return `<div class="field"><label>文本类型</label><select class="select" data-option-prop="textType"${disabled}>${['无限制','数字','手机号','邮箱','身份证','小数'].map(type => `<option ${option.textType === type ? 'selected' : ''}>${type}</option>`).join('')}</select></div>`;
  }
  if (option.fieldType === '评分') {
    return `<div class="field"><label>评分模板</label><select class="select" data-option-prop="ratingTemplate"${disabled}>${['满意度','同意度','重要性','疼痛程度','自定义'].map(type => `<option ${option.ratingTemplate === type ? 'selected' : ''}>${type}</option>`).join('')}</select></div>
      <div class="field"><label>评分样式</label><button class="radio-card ${option.ratingDisplay === 'data' ? 'active' : ''}" data-option-rating-display="data"${disabled}><span class="radio-dot"></span>显示数据</button><button class="radio-card ${option.ratingDisplay === 'star' ? 'active' : ''}" data-option-rating-display="star"${disabled}><span class="radio-dot"></span>显示星形</button><button class="radio-card ${option.ratingDisplay === 'emoji' ? 'active' : ''}" data-option-rating-display="emoji"${disabled}><span class="radio-dot"></span>显示表情</button></div>`;
  }
  if (option.fieldType === '日期') {
    return `<div class="field"><label>日期格式</label><select class="select" data-option-prop="dateFormat"${disabled}>${['年/月/日','年/月','年','年-月-日','年月日 时:分'].map(type => `<option ${option.dateFormat === type ? 'selected' : ''}>${type}</option>`).join('')}</select></div>`;
  }
  return '';
}

function optionValueItems(option) {
  const values = lines(option.valueDomain || '选项1\n选项2');
  return values.length ? values : ['选项1', '选项2'];
}

function setOptionValueItems(option, values) {
  option.valueDomain = (values.length ? values : ['选项1']).join('\n');
}

function valueOptionProps(option, disabled) {
  const values = optionValueItems(option);
  const marker = option.fieldType === '单选' ? 'fake-radio' : 'fake-check';
  const disabledClass = disabled ? ' disabled' : '';
  const cards = values.map((value, index) => `<div class="value-option-card${disabledClass}">
    <span class="${marker}"></span>
    <input class="value-option-input" data-value-option-index="${index}" value="${esc(value)}"${disabled}>
    <button class="value-option-delete" data-delete-value-option="${index}"${disabled} title="删除">×</button>
  </div>`).join('');
  return `<div class="field"><label>选项</label><div class="hint">每个选项单独编辑，支持添加和删除</div><div class="value-option-list">${cards}</div><button class="add-btn" data-add-value-option${disabled}>添加选项</button></div>`;
}

function columnDataTypeFromFieldType(fieldType) {
  if (fieldType === '下拉选择') return 'select';
  if (fieldType === '单选') return 'single';
  if (fieldType === '多选') return 'multiple';
  if (fieldType === '填空') return 'fill';
  if (fieldType === '评分') return 'rating';
  if (fieldType === '日期') return 'date';
  return 'fill';
}

function syncSelectedMatrixColumnFromOption(item) {
  if (!item || item.type !== 'matrixCustom' || state.selectedOption?.source !== 'matrix') return;
  const index = state.selectedOption.index;
  const option = currentOption(item);
  if (!item.columns[index]) return;
  item.columns[index] = {
    ...item.columns[index],
    dataType: columnDataTypeFromFieldType(option.fieldType),
    options: optionValueItems(option)
  };
}

function choiceProps(item) {
  return `<div class="field"><label>最多可选:</label><input class="input" data-prop="max" value="${esc(item.max)}" placeholder="请输入数字"></div>
    <div class="field"><label>最少可选:</label><input class="input" data-prop="min" value="${esc(item.min || (item.type === 'multiple' ? '1' : ''))}" placeholder="请输入数字"></div>
    <div class="field"><label>批量编辑</label><div class="hint">每行代表一个选项，回车键换行</div><textarea class="textarea" data-options>${esc(item.options.join('\\n'))}</textarea></div>`;
}

function textProps(item) {
  return `<div class="field"><label>文本格式:</label><select class="select" data-prop="textFormat">${['无限制','数字','手机号','邮箱','身份证'].map(x => `<option ${item.textFormat === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    <div class="field"><label>最多填写:</label><input class="input" data-prop="max" value="${esc(item.max)}" placeholder="请输入数字"></div>
    <div class="field"><label>提示文案:</label><input class="input" data-prop="desc" value="${esc(item.desc)}" placeholder="请输入提示文案"></div>`;
}

function dateProps(item) {
  return `<div class="field"><label>格式</label><select class="select" data-prop="dateFormat">${['年/月/日','年/月','年','年-月-日'].map(x => `<option ${item.dateFormat === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>`;
}

function ratingProps(item, compact) {
  return `<div class="field"><label>文案模板</label><select class="select" data-prop="ratingTemplate">${['满意度','同意度','重要性','自定义'].map(x => `<option ${item.ratingTemplate === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    <div class="field"><label>显示样式</label>
      <button class="radio-card ${item.display === 'data' ? 'active' : ''}" data-display="data"><span class="radio-dot"></span>显示数据</button>
      <button class="radio-card ${item.display === 'star' ? 'active' : ''}" data-display="star"><span class="radio-dot"></span>显示星形</button>
      <button class="radio-card ${item.display === 'emoji' ? 'active' : ''}" data-display="emoji"><span class="radio-dot"></span>显示表情</button>
    </div>${compact ? '' : '<div class="muted-note">5分表示非常满意，1分表示非常不满意。</div>'}`;
}

function matrixChoiceProps(item, showSelectionLimits = true) {
  const selectionLimits = showSelectionLimits ? `<div class="field"><label>每行最多可选:</label><input class="input" data-prop="max" value="${esc(item.max)}" placeholder="请输入数字"></div>
    <div class="field"><label>每行最少可选:</label><input class="input" data-prop="min" value="${esc(item.min)}" placeholder="请输入数字"></div>` : '';
  return `${selectionLimits}
    ${allowAddRowProp(item)}
    <div class="field"><label>批量编辑行</label><div class="hint">每行代表一个选项，回车键换行</div><textarea class="textarea" data-rows>${esc(item.rows.join('\\n'))}</textarea></div>
    <div class="field"><label>批量编辑列</label><div class="hint">每行代表一个选项，回车键换行</div><textarea class="textarea" data-columns>${esc(item.columns.join('\\n'))}</textarea></div>`;
}

function matrixCustomProps(item) {
  return `${allowAddRowProp(item)}
    <div class="field"><label>批量编辑行</label><div class="hint">每行代表一个选项，回车键换行</div><textarea class="textarea" data-rows>${esc(item.rows.join('\\n'))}</textarea></div>
    <div class="field"><label>批量编辑列</label><div class="hint">每行代表一个选项，回车键换行</div><textarea class="textarea" data-custom-columns>${esc(item.columns.map(col => col.title).join('\\n'))}</textarea></div>`;
}

function allowAddRowProp(item) {
  return `<div class="required-prop"><span>允许患者新增行:</span><span class="mini-switch ${item.allowPatientAddRow ? 'on' : ''}" data-toggle-add-row="${item.id}"></span></div>`;
}

function selected() { return state.questions.find(q => q.id === state.selectedId); }
function isSelectedOption(item, index) { return state.selectedOption && state.selectedOption.source === 'choice' && state.selectedOption.questionId === item.id && state.selectedOption.index === index; }
function isSelectedMatrixOption(item, index) { return state.selectedOption && state.selectedOption.source === 'matrix' && state.selectedOption.questionId === item.id && state.selectedOption.index === index; }
function currentOption(item) {
  if (!state.selectedOption || state.selectedOption.questionId !== item.id) return null;
  if (state.selectedOption.source === 'matrix') {
    syncMatrixOptionSettings(item);
    return item.matrixOptionSettings[state.selectedOption.index] || null;
  }
  syncOptionSettings(item);
  return item.optionSettings[state.selectedOption.index] || null;
}
function syncOptionSettings(item) {
  if (!Array.isArray(item.optionSettings)) item.optionSettings = [];
  item.optionSettings = item.options.map((_, index) => item.optionSettings[index] || defaultOptionSetting());
}
function matrixTitles(item) {
  return item.type === 'matrixCustom' ? item.columns.map(col => col.title) : item.columns;
}
function syncMatrixOptionSettings(item) {
  if (!Array.isArray(item.matrixOptionSettings)) item.matrixOptionSettings = [];
  item.matrixOptionSettings = matrixTitles(item).map((_, index) => item.matrixOptionSettings[index] || defaultOptionSetting());
  if (item.type === 'matrixCustom') {
    item.columns = item.columns.map((column, index) => {
      const setting = item.matrixOptionSettings[index] || defaultOptionSetting();
      return {
        ...column,
        dataType: columnDataTypeFromFieldType(setting.fieldType),
        options: optionValueItems(setting)
      };
    });
  }
}
function selectedOptionLabel(item) {
  if (!state.selectedOption) return '';
  if (state.selectedOption.source === 'matrix') return matrixTitles(item)[state.selectedOption.index] || '';
  return item.options[state.selectedOption.index] || '';
}
function setSelectedOptionLabel(item, value) {
  if (!state.selectedOption) return;
  const index = state.selectedOption.index;
  if (state.selectedOption.source === 'matrix') {
    if (item.type === 'matrixCustom') item.columns[index].title = value;
    else item.columns[index] = value;
    return;
  }
  item.options[index] = value;
}
function renderAll() { renderPalette(); renderCanvas(); renderProps(); }

function openBuilder(name) {
  document.getElementById('builderName').textContent = name || '测试';
  document.getElementById('listPage').classList.remove('active');
  document.getElementById('builderPage').classList.add('active');
  renderAll();
}

function showList() {
  document.getElementById('builderPage').classList.remove('active');
  document.getElementById('patientPage').classList.remove('active');
  document.getElementById('patientEditor').classList.remove('active');
  document.getElementById('indicatorEditorPage')?.classList.remove('active');
  document.getElementById('listPage').classList.add('active');
  showListView('plans');
}

function addQuestion(type) {
  const item = q(type, state.questions.length + 1);
  state.questions.push(item);
  state.selectedId = item.id;
  renderAll();
  requestAnimationFrame(() => document.querySelector(`[data-qid="${item.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
}

function duplicateQuestion(id) {
  const index = state.questions.findIndex(q => q.id === id);
  const copy = JSON.parse(JSON.stringify(state.questions[index]));
  copy.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
  state.questions.splice(index + 1, 0, copy);
  state.selectedId = copy.id;
  renderAll();
}

function deleteQuestion(id) {
  if (state.questions.length <= 1) return showToast('至少保留一道题');
  const index = state.questions.findIndex(q => q.id === id);
  state.questions.splice(index, 1);
  state.selectedId = state.questions[Math.max(0, index - 1)].id;
  renderAll();
}

function convertType(item, type) {
  item.type = type;
  state.selectedOption = null;
  state.activePropTab = 'question';
  if (type === 'single' || type === 'multiple') item.options = item.options?.length ? item.options : ['选项', '选项'];
  if (type === 'single' || type === 'multiple') syncOptionSettings(item);
  if (type.startsWith('matrix') && type !== 'matrixCustom') {
    item.rows = item.rows?.length ? item.rows : ['行标题', '行标题'];
    item.columns = Array.isArray(item.columns) && typeof item.columns[0] === 'string' ? item.columns : ['选项', '选项'];
    syncMatrixOptionSettings(item);
  }
  if (type === 'matrixCustom') {
    item.rows = item.rows?.length ? item.rows : ['行标题', '行标题'];
    item.columns = [
      { title: '选项', dataType: 'fill', options: ['选项', '选项'] },
      { title: '选项', dataType: 'fill', options: ['选项', '选项'] }
    ];
    item.matrixMode = 'fill';
    syncMatrixOptionSettings(item);
  }
  renderAll();
}
