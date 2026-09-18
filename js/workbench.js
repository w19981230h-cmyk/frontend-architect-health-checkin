(() => {
  const fallbackInstitutions = ['暨南大学附属顺德医院', '容桂社区卫生服务中心', '佛山市顺德区第三人民医院'];
  const tasks = [
    { key: 'review', symbol: '审', title: '待审核患者入组', base: 20, unit: '个', high: true, action: '前往审核', target: 'patients', description: count => `共${count}个预分组患者待审核` },
    { key: 'call', symbol: '呼', title: 'AI外呼失败处理', base: 2, unit: '个', high: true, action: '查看清单', target: 'healthTasks', description: count => `共${count}个AI外呼患者未接听，建议人工处理` },
    { key: 'confirm', symbol: '确', title: 'AI外呼结果确认', base: 3, unit: '个', high: true, action: '前往确认', target: 'healthTasks', description: count => `共${count}个AI外呼已完成随访，请检查并确认回填结果` },
    { key: 'followup', symbol: '随', title: '待办随访任务', base: 17, unit: '个', action: '前往处理', target: 'healthTasks', description: count => `共${count}个随访任务待处理，其中部分已逾期` },
    { key: 'warning', symbol: '预', title: '待办预警任务', base: 11, unit: '个', action: '前往处理', target: 'healthTasks', description: count => `共${count}个待处理预警任务，请及时处理` },
    { key: 'checkin', symbol: '评', title: '待办打卡评价', base: 8, unit: '个', action: '前往处理', target: 'checkinEvaluation', description: count => `共${count}个打卡评价待处理` },
    { key: 'evaluation', symbol: '估', title: '待办评价评估', base: 6, unit: '个', action: '前往处理', target: 'checkinEvaluation', description: count => `共${count}个评价评估待处理` }
  ];
  let scope = null;

  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  const unique = values => [...new Set((values || []).filter(Boolean))];
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
  const sumByKey = (groups, key) => groups.reduce((sum, group) => sum + (group.tasks.find(task => task.key === key)?.count || 0), 0);
  const renderStats = groups => {
    const host = document.getElementById('workbenchStats');
    if (!host) return;
    const stats = [
      ['待审核入组', sumByKey(groups, 'review'), '人', `${groups.length}家机构待处理`],
      ['今日待随访', sumByKey(groups, 'followup'), '项', `${groups.length}家机构进行中`],
      ['外呼失败', sumByKey(groups, 'call'), '次', '建议优先处理'],
      ['今日已完成', Math.round((sumByKey(groups, 'checkin') + sumByKey(groups, 'evaluation')) * .68), '项', '完成率 68%']
    ];
    host.innerHTML = stats.map(([label, value, unit, hint]) => `<div class="workbench-stat"><span>${label}</span><strong>${value}</strong><b>${unit}</b><small>${escapeHtml(hint)}</small></div>`).join('');
  };
  const renderTasks = groups => {
    const host = document.getElementById('workbenchTodos');
    if (!host) return;
    host.innerHTML = groups.map(group => {
      const total = group.tasks.reduce((sum, task) => sum + task.count, 0);
      const rows = group.tasks.map(task => `<button type="button" class="workbench-institution-task" data-workbench-institution="${escapeHtml(group.institution)}" data-workbench-target="${task.target}" aria-label="${escapeHtml(group.institution)} ${task.title} ${task.count}${task.unit}，${task.action}"><span class="workbench-task-symbol">${task.symbol}</span><span class="workbench-institution-task-main"><strong>${task.title}${task.high ? '<em class="workbench-priority">高优</em>' : ''}</strong><small>${escapeHtml(task.description(task.count))}</small></span><span class="workbench-institution-action">${task.action} ›</span></button>`).join('');
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
    [tasks.length * groups.length, tasks.filter(task => task.high).length * groups.length, sumByKey(groups, 'followup')].forEach((value, index) => { if (metrics[index]) metrics[index].textContent = value; });
    const risk = document.querySelector('.workbench-risk-card');
    if (risk) risk.innerHTML = `<strong>AI 风险提醒</strong>${groups.length}家机构共有${sumByKey(groups, 'review')}个患者待审核入组，另有${sumByKey(groups, 'call')}次外呼失败，建议优先处理高优任务。`;
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

  document.addEventListener('click', event => {
    const row = event.target.closest('[data-workbench-institution]');
    if (row) openInstitutionTask(row.dataset.workbenchInstitution, row.dataset.workbenchTarget);
  });
  window.addEventListener('organizationScopeChange', event => render(event.detail));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => render(window.organizationScope));
  else render(window.organizationScope);
})();
