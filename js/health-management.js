(() => {
  const page = document.getElementById('patientArchivePage');
  if (!page) return;

  const toast = (message) => {
    if (typeof window.showToast === 'function') return window.showToast(message);
    const node = document.getElementById('toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('show'), 1800);
  };

  const closeMenus = (except) => {
    page.querySelectorAll('[data-hm-more-menu],[data-hm-filter-menu]').forEach(menu => {
      if (menu !== except) menu.hidden = true;
    });
    page.querySelectorAll('[data-hm-more],[data-hm-filter]').forEach(button => {
      const controlled = button.matches('[data-hm-more]') ? page.querySelector('[data-hm-more-menu]') : page.querySelector('[data-hm-filter-menu]');
      if (controlled !== except) button.setAttribute('aria-expanded', 'false');
    });
  };

  const openDialog = ({ title, body, confirm = '保存', onConfirm }) => {
    document.querySelector('.hm-dialog-mask')?.remove();
    const mask = document.createElement('div');
    mask.className = 'hm-dialog-mask';
    mask.innerHTML = `<section class="hm-dialog" role="dialog" aria-modal="true" aria-label="${title}"><header><h2>${title}</h2><button type="button" class="hm-dialog-close" aria-label="关闭">×</button></header><div class="hm-dialog-body">${body}</div><footer><button type="button" data-hm-dialog-cancel>取消</button><button type="button" class="primary" data-hm-dialog-confirm>${confirm}</button></footer></section>`;
    document.body.appendChild(mask);
    const close = () => mask.remove();
    mask.querySelector('.hm-dialog-close').addEventListener('click', close);
    mask.querySelector('[data-hm-dialog-cancel]').addEventListener('click', close);
    mask.addEventListener('click', event => { if (event.target === mask) close(); });
    mask.querySelector('[data-hm-dialog-confirm]').addEventListener('click', () => {
      onConfirm?.(mask);
      close();
    });
    mask.querySelector('input,textarea,select')?.focus();
  };

  const plans = {
    weight: {
      title: '28天减重管理计划', status: '进行中', statusClass: 'running', team: '心血管健康管理组',
      copy: '通过饮食调整、规律运动、生活习惯优化三大维度，4 周循序渐进实现体重下降、体脂减少，同时养成可持续的健康生活方式。',
      summary: '通过饮食调整、规律运动、生活习惯优化三大维度，4 周循序渐进实现体重下降、体脂减少，同时养成可持续的健康生活方式。',
      progress: '1/4',
      goals: [
        { name: '收缩压/舒张压', type: '血压', badge: '偏高', tone: 'warn', unit: 'mmHg', baseline: '138/88', target: '128/80', updatedAt: '2025年03月02日 07时42分' },
        { name: '空腹血糖 (FPG)', type: '空腹血糖', badge: '改善', tone: 'success', unit: 'mmol/L', baseline: '6.8', target: '6.1', updatedAt: '2025年03月02日 07时45分' },
        { name: '体重', type: '体重', badge: '下降中', tone: 'success', unit: 'kg', baseline: '76.8', target: '72.4', updatedAt: '2025年03月02日 07时48分' },
        { name: '体脂率', type: '体脂率', badge: '改善', tone: 'success', unit: '%', baseline: '28.6', target: '26.9', updatedAt: '2025年03月02日 07时50分' }
      ],
      checkins: [
        { title: '饮食打卡', detail: '三餐饮食打卡', state: '执行中', tone: 'running', copy: '记录每日三餐及加餐内容', frequency: '每日三次' },
        { title: '血压打卡', detail: '早晚血压打卡', state: '执行中', tone: 'running', copy: '静息状态下完成血压测量', frequency: '每日早晚各一次' },
        { title: '体重打卡', detail: '晨起体重打卡', state: '执行中', tone: 'running', copy: '晨起空腹排空后记录体重', frequency: '每日早晨一次' },
        { title: '运动打卡', detail: '每日运动打卡', state: '未开始', tone: '', copy: '记录运动类型、时长和强度', frequency: '每周五次' }
      ],
      tasks: [
        { type: '随访量表', title: '每日空腹体重打卡', range: '2025/03/01 至 2025/03/02', state: '已完成', tone: 'done', detail: '已完成 2 次记录，最近一次体重 68.6 kg。点击“查看打卡记录”可查看完整数据。', open: true },
        { type: '随访量表', title: '每日空腹体重打卡', range: '2025/03/01 至 2025/03/02', state: '已终止', tone: 'stopped', detail: '该阶段任务已终止。如需恢复，请在“编辑当前计划”中重新启用。' },
        { type: '随访量表', title: '每日空腹体重打卡', range: '2025/03/03 至 2025/03/28', state: '进行中', tone: 'running', detail: '当前任务持续进行中，下一次打卡提醒将在明早 07:30 发送。' },
        { type: '运动任务', title: '每日步行 6000 步', range: '2025/03/03 至 2025/03/28', state: '未开始', tone: '', detail: '任务尚未开始，将在计划进入第 2 阶段后自动开启。' }
      ]
    },
    pressure: {
      title: '12周血压稳态管理计划', status: '已完成', statusClass: 'completed', team: '慢病随访管理组',
      copy: '通过规范测压、低盐饮食、规律用药与阶段复诊，完成 12 周血压稳定管理，近期血压已达到阶段目标。',
      summary: '家庭血压记录完整，平均血压较入组时下降，计划目标已达成；后续进入常规复诊与自我监测阶段。',
      progress: '4/4',
      goals: [
        { name: '家庭平均血压', type: '血压', badge: '达标', tone: 'success', unit: 'mmHg', baseline: '148/92', target: '128/78', updatedAt: '2024年11月24日 09时20分' },
        { name: '用药依从率', type: '用药依从率', badge: '达标', tone: 'success', unit: '%', baseline: '76', target: '96', updatedAt: '2024年11月24日 09时18分' },
        { name: '低盐饮食达标率', type: '饮食', badge: '达标', tone: 'success', unit: '%', baseline: '65', target: '91', updatedAt: '2024年11月24日 09时16分' },
        { name: '晨间血压达标率', type: '晨间血压', badge: '达标', tone: 'success', unit: '%', baseline: '52', target: '88', updatedAt: '2024年11月24日 09时14分' }
      ],
      checkins: [
        { title: '早晚血压打卡', detail: '血压监测记录', state: '已完成', tone: 'completed', copy: '计划期内每日早晚各完成一次血压记录', frequency: '累计完成 162 次' },
        { title: '用药打卡', detail: '降压药用药记录', state: '已完成', tone: 'completed', copy: '按医嘱完成降压药服用与异常反馈', frequency: '累计完成 84 天' },
        { title: '饮食打卡', detail: '低盐饮食记录', state: '已完成', tone: 'completed', copy: '记录每日盐分与加工食品摄入', frequency: '累计完成 78 天' },
        { title: '运动打卡', detail: '有氧运动记录', state: '已完成', tone: 'completed', copy: '记录步行及有氧运动完成情况', frequency: '累计完成 56 次' }
      ],
      tasks: [
        { type: '阶段评估', title: '第 1 周血压基线评估', range: '2024/09/02 至 2024/09/08', state: '已完成', tone: 'done', detail: '已建立家庭血压基线，并确认目标区间。', open: true },
        { type: '生活指导', title: '低盐饮食执行评估', range: '2024/09/09 至 2024/10/06', state: '已完成', tone: 'done', detail: '饮食执行率达到 91%，完成阶段目标。' },
        { type: '随访任务', title: '第 8 周医生随访', range: '2024/10/21 至 2024/10/27', state: '已完成', tone: 'done', detail: '医生确认用药方案继续维持，无需调整剂量。' },
        { type: '结项评估', title: '12 周管理结项', range: '2024/11/18 至 2024/11/24', state: '已完成', tone: 'done', detail: '计划目标达成，转入常规慢病随访。' }
      ]
    },
    glucose: {
      title: '糖代谢改善观察计划', status: '已终止', statusClass: 'terminated', team: '内分泌健康管理组',
      copy: '原计划通过饮食记录、空腹及餐后血糖监测观察代谢改善情况，因患者转院后续管理终止。',
      summary: '计划已于第 3 周终止，终止前完成基础血糖评估与饮食记录；历史数据保留，可供后续诊疗参考。',
      progress: '2/4',
      goals: [
        { name: '空腹血糖 (FPG)', type: '空腹血糖', badge: '未完成', tone: 'warn', unit: 'mmol/L', baseline: '7.4', target: '<6.1', updatedAt: '2024年05月20日 08时16分' },
        { name: '餐后 2 小时血糖', type: '餐后血糖', badge: '未完成', tone: 'warn', unit: 'mmol/L', baseline: '10.8', target: '<7.8', updatedAt: '2024年05月19日 20时42分' },
        { name: '糖化血红蛋白', type: '糖化血红蛋白', badge: '未完成', tone: 'warn', unit: '%', baseline: '8.2', target: '<7.0', updatedAt: '2024年05月18日 10时30分' },
        { name: '体重', type: '体重', badge: '观察中', tone: 'warn', unit: 'kg', baseline: '74.0', target: '72.6', updatedAt: '2024年05月20日 07时52分' }
      ],
      checkins: [
        { title: '血糖打卡', detail: '空腹血糖打卡', state: '已终止', tone: 'stopped', copy: '原定每日早餐前完成空腹血糖记录', frequency: '累计完成 13 次' },
        { title: '饮食打卡', detail: '三餐饮食打卡', state: '已终止', tone: 'stopped', copy: '原定每日记录三餐及加餐内容', frequency: '累计完成 9 天' },
        { title: '体重打卡', detail: '晨起体重打卡', state: '已终止', tone: 'stopped', copy: '原定晨起空腹记录体重变化', frequency: '累计完成 11 次' },
        { title: '运动打卡', detail: '餐后运动打卡', state: '已终止', tone: 'stopped', copy: '原定记录餐后步行与运动时长', frequency: '累计完成 7 次' }
      ],
      tasks: [
        { type: '基础评估', title: '糖代谢风险评估', range: '2024/05/06 至 2024/05/08', state: '已完成', tone: 'done', detail: '已完成空腹及餐后血糖基线评估。', open: true },
        { type: '饮食指导', title: '控糖饮食学习', range: '2024/05/09 至 2024/05/15', state: '已完成', tone: 'done', detail: '患者已完成控糖饮食内容学习。' },
        { type: '随访任务', title: '第 3 周血糖复盘', range: '2024/05/20 至 2024/05/26', state: '已终止', tone: 'stopped', detail: '患者转院，本次随访及后续任务终止。' },
        { type: '结项评估', title: '代谢改善结项评估', range: '2024/06/03 至 2024/06/09', state: '已终止', tone: 'stopped', detail: '计划提前终止，未进入结项评估阶段。' }
      ]
    }
  };

  let activePlanId = 'weight';
  let activeTaskFilter = 'all';
  let tasksPendingOnly = false;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

  const taskCategory = (task) => ({ '进行中': 'current', '已完成': 'completed', '未开始': 'pending', '已逾期': 'overdue', '已终止': 'overdue' }[task.state] || 'pending');
  const taskTone = (task) => ({ '进行中': 'running', '已完成': 'done', '未开始': 'pending', '已逾期': 'overdue', '已终止': 'stopped' }[task.state] || 'pending');
  const taskTypeTone = (type) => type.includes('健康') || type.includes('指导') ? 'health' : type.includes('运动') ? 'exercise' : '';
  const taskActions = (task) => {
    if (task.state === '已完成') return ['查看记录', '再次填写'];
    if (task.state === '已逾期' || task.state === '已终止') return ['代填', '催办', '查看详情'];
    if (task.state === '进行中') return ['填写', '代填', '查看详情'];
    return ['查看详情'];
  };
  const taskDateMeta = (task) => {
    const start = task.range.split(' 至 ')[0];
    const [year, month, day] = start.split('/').map(Number);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return { monthKey: `${year}-${String(month).padStart(2, '0')}`, monthLabel: `${year}年${month}月`, dateLabel: `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`, weekday: weekdays[new Date(year, month - 1, day).getDay()] };
  };
  const taskStateHint = (task) => {
    const end = task.range.split(' 至 ')[1] || task.range.split(' 至 ')[0];
    if (task.state === '已完成') return `完成时间：${end}`;
    if (task.state === '已逾期' || task.state === '已终止') return `应完成：${end}`;
    if (task.state === '进行中') return task.hint || '当前可执行';
    return '';
  };
  const renderTaskSection = (plan) => {
    const filters = [
      ['all', '全部'], ['current', '当前可执行'], ['overdue', '已逾期/终止'], ['completed', '已完成'], ['pending', '未开始']
    ];
    const counts = plan.tasks.reduce((result, task) => {
      const category = taskCategory(task);
      result.all += 1;
      result[category] += 1;
      return result;
    }, { all: 0, current: 0, overdue: 0, completed: 0, pending: 0 });
    page.querySelector('[data-hm-task-filters]').innerHTML = `${filters.map(([value, label]) => `<button type="button" class="hm-task-filter${activeTaskFilter === value ? ' active' : ''}" data-hm-task-filter="${value}" aria-pressed="${activeTaskFilter === value}">${label}<span>${counts[value]}</span></button>`).join('')}<label class="hm-task-pending-only"><input type="checkbox" data-hm-task-pending-only${tasksPendingOnly ? ' checked' : ''}>仅显示待处理</label>`;
    const visibleTasks = plan.tasks.map((task, index) => ({ task, index, meta: taskDateMeta(task) })).filter(({ task }) => {
      const category = taskCategory(task);
      if (tasksPendingOnly && category === 'completed') return false;
      return activeTaskFilter === 'all' || activeTaskFilter === category;
    });
    const groups = visibleTasks.reduce((result, item) => {
      if (!result[item.meta.monthKey]) result[item.meta.monthKey] = { label: item.meta.monthLabel, items: [] };
      result[item.meta.monthKey].items.push(item);
      return result;
    }, {});
    const list = page.querySelector('[data-hm-task-list]');
    if (!visibleTasks.length) {
      list.innerHTML = '<div class="hm-task-empty">当前筛选条件下暂无健康任务</div>';
      return;
    }
    list.innerHTML = Object.values(groups).map(group => `<section class="hm-task-month-group"><h4 class="hm-task-month-title"><span>◷</span>${escapeHtml(group.label)}</h4><div class="hm-task-month-items">${group.items.map(({ task, index, meta }) => {
      const tone = taskTone(task);
      const marker = tone === 'done' ? '✓' : tone === 'overdue' || tone === 'stopped' ? '!' : '';
      return `<article class="hm-task-row ${tone}" data-hm-task><div class="hm-task-date"><i class="hm-task-node">${marker}</i><strong>${escapeHtml(meta.dateLabel)}</strong><small>${escapeHtml(meta.weekday)}</small></div><div class="hm-task-card"><div class="hm-task-card-main"><div class="hm-task-card-head"><span class="hm-task-type ${taskTypeTone(task.type)}">${escapeHtml(task.type)}</span><strong>${escapeHtml(task.title)}</strong></div><p><b>执行周期：</b>${escapeHtml(task.range)}</p><p><b>任务内容：</b>${escapeHtml(task.detail)}</p></div><aside class="hm-task-state"><strong>● ${escapeHtml(task.state)}</strong><small>${escapeHtml(taskStateHint(task))}</small></aside><div class="hm-task-actions">${taskActions(task).map(action => `<button type="button" data-hm-task-action="${escapeHtml(action)}" data-hm-task-index="${index}">${escapeHtml(action)}</button>`).join('')}</div></div></article>`;
    }).join('')}</div></section>`).join('');
  };

  const renderPlan = (planId, announce = false) => {
    const plan = plans[planId];
    if (!plan) return;
    if (activePlanId !== planId) {
      activeTaskFilter = 'all';
      tasksPendingOnly = false;
    }
    activePlanId = planId;
    page.querySelectorAll('[data-hm-plan-tab]').forEach(tab => {
      const active = tab.dataset.hmPlanTab === planId;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    page.querySelector('[data-hm-plan-title]').textContent = plan.title;
    const status = page.querySelector('[data-hm-plan-status]');
    status.textContent = plan.status;
    status.className = `hm-status-tag ${plan.statusClass}`;
    page.querySelector('[data-hm-plan-team]').textContent = plan.team;
    page.querySelector('[data-hm-plan-copy]').textContent = plan.copy;
    page.querySelector('[data-hm-goal-summary]').textContent = plan.summary;
    page.querySelector('[data-hm-goal-grid]').innerHTML = plan.goals.map(goal => `<button type="button" class="hm-goal-card" data-hm-goal-card="${escapeHtml(goal.type)}"><span class="hm-goal-card-head"><strong>${escapeHtml(goal.name)}</strong><em class="${escapeHtml(goal.tone)}">${escapeHtml(goal.badge)}</em></span><span class="hm-goal-updated">更新时间：${escapeHtml(goal.updatedAt)}</span><span class="hm-goal-labels"><small>初始基线${goal.unit ? `（${escapeHtml(goal.unit)}）` : ''}</small><small>当前结果${goal.unit ? `（${escapeHtml(goal.unit)}）` : ''}</small></span><span class="hm-goal-values"><b>${escapeHtml(goal.baseline)}</b><b class="${escapeHtml(goal.tone)}">${escapeHtml(goal.target)}</b></span></button>`).join('');
    page.querySelector('[data-hm-checkin-grid]').innerHTML = plan.checkins.map(item => `<button type="button" class="hm-checkin-card" data-hm-checkin-card="${escapeHtml(item.detail)}"><span class="hm-checkin-head"><strong><i aria-hidden="true">▣</i>${escapeHtml(item.title)}</strong><em class="${escapeHtml(item.tone)}">● ${escapeHtml(item.state)}</em></span><span class="hm-checkin-copy">${escapeHtml(item.copy)}</span><span class="hm-checkin-frequency">◷&nbsp; ${escapeHtml(item.frequency)}</span></button>`).join('');
    renderTaskSection(plan);
    const editButton = page.querySelector('[data-hm-edit-plan]');
    editButton.lastChild.textContent = plan.status === '进行中' ? '编辑当前计划' : '查看方案详情';
    if (announce) toast(`已切换至：${plan.title}`);
  };

  page.addEventListener('click', (event) => {
    const planTab = event.target.closest('[data-hm-plan-tab]');
    if (planTab) {
      renderPlan(planTab.dataset.hmPlanTab, true);
      return;
    }
    const more = event.target.closest('[data-hm-more]');
    if (more) {
      const menu = page.querySelector('[data-hm-more-menu]');
      const next = menu.hidden;
      closeMenus(menu);
      menu.hidden = !next;
      more.setAttribute('aria-expanded', String(next));
      return;
    }
    const filter = event.target.closest('[data-hm-filter]');
    if (filter) {
      const menu = page.querySelector('[data-hm-filter-menu]');
      const next = menu.hidden;
      closeMenus(menu);
      menu.hidden = !next;
      filter.setAttribute('aria-expanded', String(next));
      return;
    }
    const filterValue = event.target.closest('[data-hm-filter-value]');
    if (filterValue) {
      page.querySelectorAll('[data-hm-filter-value]').forEach(item => item.classList.toggle('active', item === filterValue));
      page.querySelector('[data-hm-filter]').firstChild.textContent = filterValue.dataset.hmFilterValue === '全部' ? '显示全部 ' : `${filterValue.textContent.trim()} `;
      closeMenus();
      toast(`已切换为：${filterValue.textContent.trim()}`);
      return;
    }
    const action = event.target.closest('[data-hm-action]');
    if (action) {
      closeMenus();
      if (action.dataset.hmAction === 'summary') openDialog({ title: '健康管理摘要', confirm: '知道了', body: '<p>当前计划已执行 9 天，完成 1/4 项阶段任务；血压与空腹血糖仍需持续关注。</p>' });
      if (action.dataset.hmAction === 'export') toast('健康管理计划已生成，正在准备下载');
      if (action.dataset.hmAction === 'pause') openDialog({ title: '暂停当前计划', confirm: '确认暂停', body: '<p>暂停后将不再发送打卡和任务提醒，已有记录会保留。</p>', onConfirm: () => toast('当前计划已暂停') });
      return;
    }
    if (event.target.closest('[data-hm-alerts]')) {
      openDialog({ title: '预警任务', confirm: '标记为已查看', body: '<p><strong>2 条待关注预警</strong></p><p>1. 连续 2 次晨间血压高于目标值。<br>2. 今日空腹体重尚未打卡。</p>', onConfirm: () => toast('预警任务已标记为已查看') });
      return;
    }
    if (event.target.closest('[data-hm-edit-plan]')) {
      const plan = plans[activePlanId];
      if (plan.status !== '进行中') {
        openDialog({ title: '方案详情', confirm: '知道了', body: `<p><strong>${escapeHtml(plan.title)}</strong></p><p>方案状态：${escapeHtml(plan.status)}<br>管理团队：${escapeHtml(plan.team)}<br>任务进度：${escapeHtml(plan.progress)}</p><p>${escapeHtml(plan.copy)}</p>` });
        return;
      }
      openDialog({ title: '编辑当前计划', body: `<label>计划名称<input value="${escapeHtml(plan.title)}"></label><label>计划说明<textarea>${escapeHtml(plan.copy)}</textarea></label><label>计划状态<select><option>进行中</option><option>暂停</option><option>已完成</option></select></label>`, onConfirm: () => toast('健康管理计划已更新') });
      return;
    }
    if (event.target.closest('[data-hm-goals]')) {
      openDialog({ title: '设置健康目标', body: '<label>收缩压目标<input value="120" type="number"></label><label>舒张压目标<input value="80" type="number"></label><label>空腹血糖目标<input value="6.1" type="number" step="0.1"></label>', onConfirm: () => toast('健康目标已保存') });
      return;
    }
    const goal = event.target.closest('[data-hm-goal-card]');
    if (goal) {
      openDialog({ title: `${goal.dataset.hmGoalCard}目标详情`, confirm: '知道了', body: `<p>当前指标状态为偏高。目标值已纳入每日监测，异常数据将自动生成预警任务。</p>` });
      return;
    }
    if (event.target.closest('[data-hm-view-checkins]')) {
      page.querySelector('[data-archive-tab="checkin"]')?.click();
      toast('已进入健康打卡记录');
      return;
    }
    const checkin = event.target.closest('[data-hm-checkin-card]');
    if (checkin) {
      openDialog({ title: checkin.dataset.hmCheckinCard, confirm: '立即打卡', body: '<p>打卡要求：每日早晨空腹状态下完成测量并记录。最近一次记录为 68.6 kg。</p>', onConfirm: () => { page.querySelector('[data-archive-tab="checkin"]')?.click(); toast('已打开打卡页面'); } });
      return;
    }
    const taskFilter = event.target.closest('[data-hm-task-filter]');
    if (taskFilter) {
      activeTaskFilter = taskFilter.dataset.hmTaskFilter;
      renderTaskSection(plans[activePlanId]);
      return;
    }
    const pendingOnly = event.target.closest('[data-hm-task-pending-only]');
    if (pendingOnly) {
      tasksPendingOnly = pendingOnly.checked;
      renderTaskSection(plans[activePlanId]);
      return;
    }
    const taskAction = event.target.closest('[data-hm-task-action]');
    if (taskAction) {
      const task = plans[activePlanId].tasks[Number(taskAction.dataset.hmTaskIndex)];
      const action = taskAction.dataset.hmTaskAction;
      if (!task) return;
      if (action === '催办') {
        toast(`已向患者发送“${task.title}”催办提醒`);
        return;
      }
      if (action === '查看详情' || action === '查看记录') {
        openDialog({ title: action === '查看记录' ? '任务记录' : '任务详情', confirm: '知道了', body: `<p><strong>${escapeHtml(task.title)}</strong></p><p>任务类型：${escapeHtml(task.type)}<br>执行周期：${escapeHtml(task.range)}<br>当前状态：${escapeHtml(task.state)}</p><p>${escapeHtml(task.detail)}</p>` });
        return;
      }
      openDialog({ title: `${action}：${escapeHtml(task.title)}`, confirm: '保存记录', body: `<p>执行周期：${escapeHtml(task.range)}</p><label>任务记录<textarea placeholder="请输入本次任务记录"></textarea></label>`, onConfirm: () => toast(`${action}记录已保存`) });
      return;
    }
    if (!event.target.closest('.hm-more-wrap,.hm-filter-wrap')) closeMenus();
  });

  page.querySelector('.hm-plan-tags')?.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const tabs = [...page.querySelectorAll('[data-hm-plan-tab]')];
    const currentIndex = tabs.findIndex(tab => tab.dataset.hmPlanTab === activePlanId);
    const nextIndex = event.key === 'ArrowRight' ? (currentIndex + 1) % tabs.length : (currentIndex - 1 + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    renderPlan(tabs[nextIndex].dataset.hmPlanTab, true);
    event.preventDefault();
  });

  renderPlan(activePlanId);
})();
