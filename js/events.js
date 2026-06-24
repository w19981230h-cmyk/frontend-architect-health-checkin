document.addEventListener('click', e => {
  const archiveCardRange = e.target.closest('[data-archive-card-range]');
  if (archiveCardRange) {
    const state = metricRangeState(archiveDashboardState, archiveCardRange.dataset.rangeMetric);
    applyMetricRange(state, archiveCardRange.dataset.archiveCardRange);
    renderArchiveDetails(archiveBoardMetrics[archiveDashboardState.board]);
    return;
  }
  const templateCardRange = e.target.closest('[data-template-card-range]');
  if (templateCardRange) {
    const state = metricRangeState(templatePreviewState, templateCardRange.dataset.rangeMetric);
    applyMetricRange(state, templateCardRange.dataset.templateCardRange);
    renderTemplatePreviewMetrics();
    return;
  }
  if (e.target.closest('[data-close-indicator-editor]')) {
    closeIndicatorEditor();
    return;
  }
  if (e.target.closest('[data-save-indicator-editor]')) {
    saveIndicatorEditor();
    return;
  }
  if (e.target.closest('[data-publish-indicator-editor]')) {
    publishIndicatorEditor();
    return;
  }
  if (e.target.closest('[data-add-indicator-metric]')) {
    indicatorEditorState.draft.metrics.push({ name: '', display: '结果卡', source: '居家打卡', period: '按日' });
    indicatorEditorState.dirty = true;
    patientPageState.dirty = true;
    renderIndicatorMetricEditor();
    requestAnimationFrame(() => document.querySelector(`[data-indicator-metric-index="${indicatorEditorState.draft.metrics.length - 1}"][data-indicator-metric-field="name"]`)?.focus());
    return;
  }
  const toggleMetricMenu = e.target.closest('[data-toggle-metric-menu]');
  if (toggleMetricMenu) {
    const card = toggleMetricMenu.closest('.indicator-metric-card');
    document.querySelectorAll('.indicator-metric-card.menu-open').forEach(node => { if (node !== card) node.classList.remove('menu-open'); });
    card.classList.toggle('menu-open');
    return;
  }
  const focusIndicatorMetric = e.target.closest('[data-focus-indicator-metric]');
  if (focusIndicatorMetric) {
    const index = Number(focusIndicatorMetric.dataset.focusIndicatorMetric);
    focusIndicatorMetric.closest('.indicator-metric-card').classList.remove('menu-open');
    document.querySelector(`[data-indicator-metric-index="${index}"][data-indicator-metric-field="name"]`)?.focus();
    return;
  }
  const removeIndicatorMetric = e.target.closest('[data-remove-indicator-metric]');
  if (removeIndicatorMetric) {
    const index = Number(removeIndicatorMetric.dataset.removeIndicatorMetric);
    const metric = indicatorEditorState.draft.metrics[index];
    if (!window.confirm(`确定删除指标“${metric?.name || '未命名指标'}”吗？`)) return;
    indicatorEditorState.draft.metrics.splice(index, 1);
    indicatorEditorState.dirty = true;
    patientPageState.dirty = true;
    renderIndicatorMetricEditor();
    return;
  }
  const granularityButton = e.target.closest('[data-granularity]');
  if (granularityButton) {
    indicatorEditorState.granularity = granularityButton.dataset.granularity;
    document.querySelectorAll('[data-granularity]').forEach(button => button.classList.toggle('active', button === granularityButton));
    renderIndicatorPreview();
    return;
  }
  const openPatientRecord = e.target.closest('[data-open-patient-record]');
  if (openPatientRecord) {
    const patient = allPatients.find(item => item.visitNo === openPatientRecord.dataset.openPatientRecord);
    if (patient) openPatientArchive(patient);
    return;
  }
  const selectPatientGroup = e.target.closest('[data-select-patient-group]');
  if (selectPatientGroup) {
    const patient = allPatients.find(item => item.visitNo === selectPatientGroup.dataset.selectPatientGroup);
    showToast(`${patient?.name || '患者'}：分组选择已打开`);
    return;
  }
  const patientRow = e.target.closest('[data-patient-row]');
  if (patientRow && !e.target.closest('button')) {
    patientRow.querySelector('[data-open-patient-record]')?.click();
    return;
  }
  if (e.target.closest('[data-toggle-patient-filter]')) {
    document.getElementById('patientAdvancedPanel').classList.toggle('open');
    return;
  }
  if (e.target.closest('[data-reset-patient-filter]')) {
    document.querySelectorAll('#patientAdvancedPanel select').forEach(select => select.selectedIndex = 0);
    showToast('筛选条件已重置');
    return;
  }
  if (e.target.closest('[data-apply-patient-filter]')) {
    document.getElementById('patientAdvancedPanel').classList.remove('open');
    showToast('筛选条件已应用');
    return;
  }
  if (e.target.closest('[data-patient-column-setting]')) {
    showToast('字段设置已打开');
    return;
  }
  if (e.target.closest('[data-patient-team-list]')) {
    showListView('patients');
    document.getElementById('patientTeamFilter').selectedIndex = 1;
    patientListState.team = document.getElementById('patientTeamFilter').value;
    renderPatientList();
    return;
  }
  if (e.target.closest('[data-archive-back]')) {
    closePatientArchive();
    return;
  }
  const checkinMonthButton = e.target.closest('[data-checkin-month]');
  if (checkinMonthButton) {
    const nextMonth = new Date(checkinState.calendarMonth);
    nextMonth.setMonth(nextMonth.getMonth() + Number(checkinMonthButton.dataset.checkinMonth));
    const selectedDay = checkinState.selectedDate.getDate();
    const maxDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
    checkinState.calendarMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    checkinState.selectedDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(selectedDay, maxDay));
    renderCheckinPanel();
    return;
  }
  if (e.target.closest('[data-checkin-today]')) {
    const today = new Date();
    checkinState.calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    checkinState.selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    renderCheckinPanel();
    return;
  }
  const checkinDay = e.target.closest('[data-checkin-date]');
  if (checkinDay) {
    const [year, month, day] = checkinDay.dataset.checkinDate.split('-').map(Number);
    checkinState.selectedDate = new Date(year, month - 1, day);
    checkinState.calendarMonth = new Date(year, month - 1, 1);
    renderCheckinPanel();
    return;
  }
  const checkinRecord = e.target.closest('[data-checkin-record]');
  if (checkinRecord) {
    checkinState.activeRecordId = checkinRecord.dataset.checkinRecord;
    renderCheckinRecords();
    renderCheckinDetail();
    return;
  }
  const archiveTab = e.target.closest('[data-archive-tab]');
  if (archiveTab) {
    document.querySelectorAll('[data-archive-tab]').forEach(button => button.classList.toggle('active', button === archiveTab));
    const targetPanel = document.querySelector(`[data-archive-panel="${archiveTab.dataset.archiveTab}"]`);
    document.querySelectorAll('[data-archive-panel]').forEach(panel => {
      panel.hidden = targetPanel ? panel !== targetPanel : panel.dataset.archivePanel !== 'basic';
    });
    if (archiveTab.dataset.archiveTab !== 'basic') showToast(`${archiveTab.textContent.trim()}模块已切换`);
    return;
  }
  const archiveMore = e.target.closest('[data-archive-more]');
  if (archiveMore) {
    showToast(archiveMore.dataset.archiveMore === 'basic' ? '更多基本信息已打开' : '更多健康史信息已打开');
    return;
  }
  const patientPageButton = e.target.closest('[data-patient-page]');
  if (patientPageButton) {
    document.querySelectorAll('[data-patient-page]').forEach(button => button.classList.remove('active'));
    patientPageButton.classList.add('active');
    patientListState.page = patientPageButton.dataset.patientPage;
    showToast(`已切换至第 ${patientListState.page === 'next' ? 2 : patientListState.page} 页`);
    return;
  }
  if (e.target.closest('[data-open-patient]')) {
    patientPageState.returnView = 'indicator';
    showPatientPage();
    return;
  }
  if (e.target.closest('[data-patient-back]')) {
    exitPatientPage();
    return;
  }
  const removePatientTemplateValue = e.target.closest('[data-remove-patient-template-value]');
  if (removePatientTemplateValue) {
    setPatientTemplateValue(removePatientTemplateValue.dataset.removePatientTemplateValue, true);
    return;
  }
  const patientTemplateValueOption = e.target.closest('[data-patient-template-value-option]');
  if (patientTemplateValueOption) {
    setPatientTemplateValue(patientTemplateValueOption.dataset.patientTemplateValueOption);
    return;
  }
  if (e.target.closest('[data-toggle-patient-template-values]')) {
    togglePatientTemplateValueDropdown();
    return;
  }
  if (!e.target.closest('#patientTemplateValueSelect')) closePatientTemplateValueDropdown();
  if (e.target.closest('[data-preview-patient]')) {
    openTemplatePreview();
    return;
  }
  if (e.target.closest('[data-close-template-preview]')) {
    closeTemplatePreview();
    return;
  }
  if (e.target.closest('[data-edit-template-preview]')) {
    editTemplateFromPreview();
    return;
  }
  if (e.target.closest('[data-save-patient-detail]')) {
    openPatientSaveModal();
    return;
  }
  if (e.target.closest('[data-cancel-patient-save]') || e.target.id === 'patientSaveModal') {
    closePatientSaveModal();
    return;
  }
  if (e.target.closest('[data-confirm-patient-save]')) {
    savePatientDetail();
    return;
  }
  if (e.target.closest('[data-publish-patient]')) {
    openPatientPublishModal();
    return;
  }
  if (e.target.closest('[data-cancel-patient-publish]') || e.target.id === 'patientPublishModal') {
    closePatientPublishModal();
    return;
  }
  if (e.target.closest('[data-confirm-patient-publish]')) {
    publishPatientDetail();
    return;
  }
  if (e.target.closest('[data-open-patient-indicator]')) {
    openPatientIndicatorModal();
    return;
  }
  if (e.target.closest('[data-close-patient-indicator]') || e.target.id === 'patientIndicatorModal') {
    closePatientIndicatorModal();
    return;
  }
  if (e.target.closest('[data-save-patient-indicator]')) {
    savePatientIndicator();
    return;
  }
  const removePatientIndicator = e.target.closest('[data-remove-patient-indicator]');
  if (removePatientIndicator) {
    const index = patientIndicatorState.items.findIndex(item => item.id === removePatientIndicator.dataset.removePatientIndicator);
    if (index >= 0) patientIndicatorState.items.splice(index, 1);
    patientPageState.dirty = true;
    renderPatientIndicators();
    showToast('指标已移除');
    return;
  }
  const patientHeroToggle = e.target.closest('[data-toggle-patient-hero]');
  if (patientHeroToggle) {
    const hero = patientHeroToggle.closest('.patient-hero');
    const collapsed = hero.classList.toggle('collapsed');
    patientHeroToggle.setAttribute('aria-expanded', String(!collapsed));
    patientHeroToggle.querySelector('span').textContent = collapsed ? '展开' : '收起';
    return;
  }
  if (e.target.closest('[data-edit-patient]')) {
    openPatientEditor();
    return;
  }
  if (e.target.closest('[data-cancel-patient-edit]')) {
    closePatientEditor();
    return;
  }
  if (e.target.closest('[data-save-patient]')) {
    savePatientRecord();
    return;
  }
  const sectionToggle = e.target.closest('[data-section-toggle]');
  if (sectionToggle) {
    sectionToggle.closest('.editor-section').classList.toggle('collapsed');
    return;
  }
  const habitValue = e.target.closest('[data-habit-value]');
  if (habitValue) {
    const group = habitValue.closest('[data-habit]');
    patientEditState.draft[group.dataset.habit] = habitValue.dataset.habitValue;
    group.querySelectorAll('[data-habit-value]').forEach(button => button.classList.toggle('active', button === habitValue));
    patientEditState.dirty = true;
    return;
  }
  if (e.target.closest('[data-add-portrait]')) {
    patientEditState.draft.portraits.push({ type: 'diagnosis', name: '', note: '' });
    patientEditState.dirty = true;
    renderPortraitEditor();
    return;
  }
  const removePortrait = e.target.closest('[data-remove-portrait]');
  if (removePortrait) {
    patientEditState.draft.portraits.splice(Number(removePortrait.dataset.removePortrait), 1);
    patientEditState.dirty = true;
    renderPortraitEditor();
    return;
  }
  const dashboardMore = e.target.closest('[data-dashboard-more]');
  if (dashboardMore) {
    const container = dashboardMore.closest('.dashboard-more');
    const willOpen = !container.classList.contains('open');
    document.querySelectorAll('.dashboard-more.open').forEach(menu => {
      menu.classList.remove('open');
      menu.querySelector('[data-dashboard-more]')?.setAttribute('aria-expanded', 'false');
    });
    container.classList.toggle('open', willOpen);
    dashboardMore.setAttribute('aria-expanded', String(willOpen));
    return;
  }
  if (!e.target.closest('.dashboard-more')) {
    document.querySelectorAll('.dashboard-more.open').forEach(menu => {
      menu.classList.remove('open');
      menu.querySelector('[data-dashboard-more]')?.setAttribute('aria-expanded', 'false');
    });
  }
  const listView = e.target.closest('[data-list-view]');
  if (listView) {
    showListView(listView.dataset.listView);
    return;
  }
  if (e.target.closest('[data-new-plan]')) {
    openPlanAiPage();
    return;
  }
  if (e.target.closest('[data-exit-plan]')) {
    exitPlanEditor();
    return;
  }
  if (e.target.closest('[data-clear-plan-prompt]')) {
    document.getElementById('planAiPrompt').value = '';
    document.querySelector('[data-generate-plan]')?.classList.remove('ready');
    return;
  }
  if (e.target.closest('[data-generate-plan]') || e.target.closest('[data-skip-plan-ai]')) {
    buildPlanFromPrompt();
    return;
  }
  if (e.target.closest('[data-save-plan]')) {
    showToast('方案已保存');
    return;
  }
  if (e.target.closest('[data-close-plan-assistant]')) {
    e.target.closest('.plan-ai-side')?.remove();
    return;
  }
  if (e.target.closest('[data-add-checkin]')) {
    document.getElementById('planCheckinModal')?.classList.add('open');
    return;
  }
  if (e.target.closest('[data-close-checkin-modal]') || e.target.closest('[data-cancel-checkin]') || e.target.closest('[data-confirm-checkin]') || e.target.id === 'planCheckinModal') {
    document.getElementById('planCheckinModal')?.classList.remove('open');
    if (e.target.closest('[data-confirm-checkin]')) showToast('打卡已添加');
    return;
  }
  const planTab = e.target.closest('[data-plan-tab]');
  if (planTab) {
    const tab = planTab.dataset.planTab;
    document.querySelectorAll('[data-plan-tab]').forEach(button => button.classList.toggle('active', button === planTab));
    document.querySelectorAll('[data-plan-tab-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.planTabPanel === tab));
    return;
  }
  if (e.target.closest('[data-new-indicator]')) {
    patientPageState.returnView = 'indicator';
    showPatientPage(null, true);
    return;
  }
  const editIndicator = e.target.closest('[data-edit-indicator]');
  if (editIndicator) {
    showPatientPage(editIndicator.dataset.editIndicator);
    return;
  }
  const previewIndicator = e.target.closest('[data-preview-indicator]');
  if (previewIndicator && !e.target.closest('button')) {
    openTemplatePreviewFromList(previewIndicator.dataset.previewIndicator);
    return;
  }
  const toggleIndicator = e.target.closest('[data-toggle-indicator-status]');
  if (toggleIndicator) {
    const item = indicatorTemplates.find(row => row.id === toggleIndicator.dataset.toggleIndicatorStatus);
    if (!item) return;
    item.published = !item.published;
    renderIndicatorList();
    showToast(item.published ? '指标看板已发布' : '指标看板已撤销发布');
    return;
  }
  const deleteIndicator = e.target.closest('[data-delete-indicator]');
  if (deleteIndicator) {
    const item = indicatorTemplates.find(row => row.id === deleteIndicator.dataset.deleteIndicator);
    if (window.confirm(`确认删除指标看板“${item.name}”吗？`)) {
      indicatorTemplates = indicatorTemplates.filter(row => row.id !== item.id);
      renderIndicatorList();
      showToast('指标看板已删除');
    }
    return;
  }
  if (e.target.closest('[data-save-indicator]')) {
    saveIndicatorTemplate();
    return;
  }
  if (e.target.closest('[data-close-indicator-modal]') || e.target.id === 'indicatorModal') {
    closeIndicatorModal();
    return;
  }
  if (e.target.closest('[data-open-editor]')) openBuilder('测试');
  if (e.target.closest('#exitBuilder')) showList();
  const add = e.target.closest('[data-add-type]');
  if (add) addQuestion(add.dataset.addType);
  const optionRow = e.target.closest('[data-option-index]');
  if (optionRow) {
    state.selectedId = optionRow.dataset.qid;
    state.selectedOption = { source: 'choice', questionId: optionRow.dataset.qid, index: Number(optionRow.dataset.optionIndex) };
    state.activePropTab = 'option';
    renderAll();
    return;
  }
  if (e.target.closest('[data-matrix-row-title], [data-matrix-column-title]')) return;
  const matrixOption = e.target.closest('[data-matrix-option-index]');
  if (matrixOption) {
    state.selectedId = matrixOption.dataset.qid;
    state.selectedOption = { source: 'matrix', questionId: matrixOption.dataset.qid, index: Number(matrixOption.dataset.matrixOptionIndex) };
    state.activePropTab = 'option';
    renderAll();
    return;
  }
  const propTab = e.target.closest('[data-prop-tab]');
  if (propTab) {
    state.activePropTab = propTab.dataset.propTab;
    renderProps();
    return;
  }
  const card = e.target.closest('.q-card');
  if (card && !e.target.closest('input, textarea, select, button')) { state.selectedId = card.dataset.qid; state.selectedOption = null; state.activePropTab = 'question'; renderAll(); }
  const req = e.target.closest('[data-toggle-required]');
  if (req) { const item = state.questions.find(q => q.id === req.dataset.toggleRequired); item.required = !item.required; renderAll(); }
  const addRow = e.target.closest('[data-toggle-add-row]');
  if (addRow) { const item = state.questions.find(q => q.id === addRow.dataset.toggleAddRow); item.allowPatientAddRow = !item.allowPatientAddRow; renderAll(); }
  const dup = e.target.closest('[data-duplicate]');
  if (dup) duplicateQuestion(dup.dataset.duplicate);
  const del = e.target.closest('[data-delete]');
  if (del) deleteQuestion(del.dataset.delete);
  const display = e.target.closest('[data-display]');
  if (display) { selected().display = display.dataset.display; renderAll(); }
  const optionRatingDisplay = e.target.closest('[data-option-rating-display]');
  if (optionRatingDisplay) { currentOption(selected()).ratingDisplay = optionRatingDisplay.dataset.optionRatingDisplay; renderAll(); }
  const addMatrixRow = e.target.closest('[data-add-matrix-row]');
  if (addMatrixRow) {
    const item = state.questions.find(q => q.id === addMatrixRow.dataset.addMatrixRow);
    item.rows.push(`行标题${item.rows.length + 1}`);
    renderAll();
    return;
  }
  const addMatrixColumn = e.target.closest('[data-add-matrix-column]');
  if (addMatrixColumn) {
    const item = state.questions.find(q => q.id === addMatrixColumn.dataset.addMatrixColumn);
    if (item.type === 'matrixCustom') item.columns.push({ title: `选项${item.columns.length + 1}`, dataType: 'fill', options: ['选项1', '选项2'] });
    else item.columns.push(`选项${item.columns.length + 1}`);
    syncMatrixOptionSettings(item);
    renderAll();
    return;
  }
  const addValueOption = e.target.closest('[data-add-value-option]');
  if (addValueOption && !addValueOption.disabled) {
    const item = selected();
    const option = currentOption(selected());
    const values = optionValueItems(option);
    values.push(`选项${values.length + 1}`);
    setOptionValueItems(option, values);
    syncSelectedMatrixColumnFromOption(item);
    renderAll();
    return;
  }
  const deleteValueOption = e.target.closest('[data-delete-value-option]');
  if (deleteValueOption && !deleteValueOption.disabled) {
    const item = selected();
    const option = currentOption(selected());
    const values = optionValueItems(option);
    values.splice(Number(deleteValueOption.dataset.deleteValueOption), 1);
    setOptionValueItems(option, values);
    syncSelectedMatrixColumnFromOption(item);
    renderAll();
    return;
  }
  const toastBtn = e.target.closest('[data-toast]');
  if (toastBtn) showToast(toastBtn.dataset.toast);
});

let draggedIndicatorMetricIndex = null;

document.addEventListener('dragstart', e => {
  const handle = e.target.closest('[data-drag-indicator-metric]');
  if (!handle || !indicatorEditorState.draft) return;
  draggedIndicatorMetricIndex = Number(handle.dataset.dragIndicatorMetric);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(draggedIndicatorMetricIndex));
  requestAnimationFrame(() => handle.closest('.indicator-metric-card')?.classList.add('dragging'));
});

document.addEventListener('dragover', e => {
  const card = e.target.closest('[data-metric-card-index]');
  if (!card || draggedIndicatorMetricIndex === null) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.indicator-metric-card').forEach(node => node.classList.remove('drag-before', 'drag-after'));
  const rect = card.getBoundingClientRect();
  const after = e.clientX > rect.left + rect.width / 2;
  card.classList.add(after ? 'drag-after' : 'drag-before');
});

document.addEventListener('drop', e => {
  const card = e.target.closest('[data-metric-card-index]');
  if (!card || draggedIndicatorMetricIndex === null || !indicatorEditorState.draft) return;
  e.preventDefault();
  const sourceIndex = draggedIndicatorMetricIndex;
  const targetIndex = Number(card.dataset.metricCardIndex);
  const rect = card.getBoundingClientRect();
  let insertIndex = targetIndex + (e.clientX > rect.left + rect.width / 2 ? 1 : 0);
  const [movedMetric] = indicatorEditorState.draft.metrics.splice(sourceIndex, 1);
  if (sourceIndex < insertIndex) insertIndex -= 1;
  indicatorEditorState.draft.metrics.splice(Math.max(0, Math.min(insertIndex, indicatorEditorState.draft.metrics.length)), 0, movedMetric);
  draggedIndicatorMetricIndex = null;
  indicatorEditorState.dirty = true;
  patientPageState.dirty = true;
  renderIndicatorMetricEditor();
  showToast('指标顺序已调整');
});

document.addEventListener('dragend', () => {
  draggedIndicatorMetricIndex = null;
  document.querySelectorAll('.indicator-metric-card').forEach(node => node.classList.remove('dragging', 'drag-before', 'drag-after'));
});

document.addEventListener('input', e => {
  if (e.target.id === 'planAiPrompt') {
    document.querySelector('[data-generate-plan]')?.classList.toggle('ready', Boolean(e.target.value.trim()));
    return;
  }
  if (e.target.id === 'patientListSearch') {
    patientListState.keyword = e.target.value;
    renderPatientList();
    return;
  }
  if (e.target.id === 'patientTemplateName') {
    patientPageState.dirty = true;
    return;
  }
  if (e.target.matches('#indicatorEditorName') && indicatorEditorState.draft) {
    indicatorEditorState.dirty = true;
    return;
  }
  if (e.target.matches('[data-indicator-metric-field]') && indicatorEditorState.draft) {
    const metric = indicatorEditorState.draft.metrics[Number(e.target.dataset.indicatorMetricIndex)];
    metric[e.target.dataset.indicatorMetricField] = e.target.value;
    if (e.target.dataset.indicatorMetricField === 'name' && e.target.value) metric.display = recommendedIndicatorDisplay(e.target.value);
    if (e.target.dataset.indicatorMetricField === 'display' && indicatorDisplayWarning(metric)) showToast(indicatorDisplayWarning(metric));
    indicatorEditorState.dirty = true;
    patientPageState.dirty = true;
    renderIndicatorPreview();
    return;
  }
  if (e.target.matches('[data-patient-field]') && patientEditState.draft) {
    const field = e.target.dataset.patientField;
    patientEditState.draft[field] = e.target.value;
    patientEditState.dirty = true;
    e.target.closest('.archive-field')?.classList.add('changed');
    document.querySelector(`[data-error-for="${field}"]`)?.replaceChildren();
    updateEditorMeta();
    return;
  }
  if (e.target.matches('[data-portrait-field]') && patientEditState.draft) {
    const item = patientEditState.draft.portraits[Number(e.target.dataset.portraitIndex)];
    item[e.target.dataset.portraitField] = e.target.value;
    patientEditState.dirty = true;
    return;
  }
  if (e.target.id === 'indicatorSearch') {
    indicatorState.keyword = e.target.value;
    renderIndicatorList();
    return;
  }
  const item = selected();
  if (!item) return;
  if (e.target.matches('[data-title]')) { const q = state.questions.find(q => q.id === e.target.dataset.title); q.title = e.target.value; }
  if (e.target.matches('[data-desc]')) { const q = state.questions.find(q => q.id === e.target.dataset.desc); q.desc = e.target.value; }
  if (e.target.matches('[data-prop]')) { item[e.target.dataset.prop] = e.target.value; renderAll(); }
  if (e.target.matches('[data-options]')) { item.options = lines(e.target.value); syncOptionSettings(item); if (state.selectedOption && state.selectedOption.index >= item.options.length) state.selectedOption = null; renderAll(); }
  if (e.target.matches('[data-option-label]')) { setSelectedOptionLabel(item, e.target.value); renderAll(); }
  if (e.target.matches('[data-option-metric]')) { currentOption(item).metric = e.target.value; }
  if (e.target.matches('[data-option-prop]')) {
    currentOption(item)[e.target.dataset.optionProp] = e.target.value;
    syncSelectedMatrixColumnFromOption(item);
  }
  if (e.target.matches('[data-value-option-index]')) {
    const option = currentOption(item);
    const values = optionValueItems(option);
    values[Number(e.target.dataset.valueOptionIndex)] = e.target.value;
    setOptionValueItems(option, values);
    syncSelectedMatrixColumnFromOption(item);
  }
  if (e.target.matches('[data-matrix-row-title]')) {
    item.rows[Number(e.target.dataset.matrixRowTitle)] = e.target.value;
  }
  if (e.target.matches('[data-matrix-column-title]')) {
    const index = Number(e.target.dataset.matrixColumnTitle);
    if (item.type === 'matrixCustom') item.columns[index].title = e.target.value;
    else item.columns[index] = e.target.value;
    syncMatrixOptionSettings(item);
  }
  if (e.target.matches('[data-rows]')) { item.rows = lines(e.target.value); renderAll(); }
  if (e.target.matches('[data-columns]')) { item.columns = lines(e.target.value); syncMatrixOptionSettings(item); if (state.selectedOption?.source === 'matrix' && state.selectedOption.index >= item.columns.length) state.selectedOption = null; renderAll(); }
  if (e.target.matches('[data-custom-columns]')) {
    const next = lines(e.target.value);
    item.columns = next.map((title, index) => ({ title, dataType: item.columns[index]?.dataType || 'fill', options: item.columns[index]?.options || ['选项', '选项'] }));
    syncMatrixOptionSettings(item);
    if (state.selectedOption?.source === 'matrix' && state.selectedOption.index >= item.columns.length) state.selectedOption = null;
    renderAll();
  }
});

document.addEventListener('change', e => {
  const archiveDateMetric = e.target.dataset.archiveCardDateStart || e.target.dataset.archiveCardDateEnd;
  if (archiveDateMetric) {
    const state = metricRangeState(archiveDashboardState, archiveDateMetric);
    const tools = e.target.closest('.archive-card-range-tools');
    state.start = tools.querySelector('[data-archive-card-date-start]').value;
    state.end = tools.querySelector('[data-archive-card-date-end]').value;
    if (state.start > state.end) return showToast('开始日期不能晚于结束日期');
    state.range = '自定义';
    renderArchiveDetails(archiveBoardMetrics[archiveDashboardState.board]);
    return;
  }
  const templateDateMetric = e.target.dataset.templateCardDateStart || e.target.dataset.templateCardDateEnd;
  if (templateDateMetric) {
    const state = metricRangeState(templatePreviewState, templateDateMetric);
    const tools = e.target.closest('.archive-card-range-tools');
    state.start = tools.querySelector('[data-template-card-date-start]').value;
    state.end = tools.querySelector('[data-template-card-date-end]').value;
    if (state.start > state.end) return showToast('开始日期不能晚于结束日期');
    state.range = '自定义';
    renderTemplatePreviewMetrics();
    return;
  }
  if (e.target.id === 'archiveBoardSelect') {
    renderArchiveBoard(e.target.value);
    return;
  }
  if (e.target.id === 'patientTeamFilter') {
    patientListState.team = e.target.value;
    renderPatientList();
    return;
  }
  if (e.target.id === 'patientTemplateType') {
    updatePatientTemplateOptions(e.target.value);
    patientPageState.dirty = true;
    return;
  }
  if (e.target.id === 'indicatorEditorApplicableType' && indicatorEditorState.draft) {
    updateIndicatorApplicableOptions(e.target.value);
    indicatorEditorState.dirty = true;
    return;
  }
  if (e.target.id === 'indicatorEditorApplicableValue' && indicatorEditorState.draft) {
    normalizeAllApplicableSelection(e.target, document.getElementById('indicatorEditorApplicableType').value);
    indicatorEditorState.dirty = true;
    return;
  }
  if (e.target.matches('[data-indicator-metric-field]') && indicatorEditorState.draft) {
    const metric = indicatorEditorState.draft.metrics[Number(e.target.dataset.indicatorMetricIndex)];
    metric[e.target.dataset.indicatorMetricField] = e.target.value;
    if (e.target.dataset.indicatorMetricField === 'name' && e.target.value) metric.display = recommendedIndicatorDisplay(e.target.value);
    indicatorEditorState.dirty = true;
    patientPageState.dirty = true;
    renderIndicatorMetricEditor();
    return;
  }
  if (e.target.matches('[data-patient-field]') && patientEditState.draft) {
    const field = e.target.dataset.patientField;
    patientEditState.draft[field] = e.target.value;
    patientEditState.dirty = true;
    e.target.closest('.archive-field')?.classList.add('changed');
    updateEditorMeta();
    return;
  }
  if (e.target.matches('[data-portrait-field]') && patientEditState.draft) {
    patientEditState.draft.portraits[Number(e.target.dataset.portraitIndex)][e.target.dataset.portraitField] = e.target.value;
    patientEditState.dirty = true;
    return;
  }
  const item = selected();
  if (!item) return;
  if (e.target.matches('[data-prop="type"]')) return convertType(item, e.target.value);
  if (e.target.matches('[data-prop]')) { item[e.target.dataset.prop] = e.target.value; renderAll(); }
  if (e.target.matches('[data-option-metric]')) { currentOption(item).metric = e.target.value; renderAll(); }
  if (e.target.matches('[data-option-prop]')) {
    currentOption(item)[e.target.dataset.optionProp] = e.target.value;
    syncSelectedMatrixColumnFromOption(item);
    renderAll();
  }
});

document.addEventListener('keydown', e => {
  const previewIndicator = e.target.closest('[data-preview-indicator]');
  if (previewIndicator && !e.target.closest('button') && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    openTemplatePreviewFromList(previewIndicator.dataset.previewIndicator);
  }
});
