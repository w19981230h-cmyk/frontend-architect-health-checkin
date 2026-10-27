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
      const rows = group.tasks.map(task => `<button type="button" class="workbench-institution-task" data-task-tone="${task.key}" data-workbench-institution="${escapeHtml(group.institution)}" data-workbench-target="${task.target}" aria-label="${escapeHtml(group.institution)} ${task.title} ${task.count}${task.unit}，${task.action}"><span class="workbench-task-symbol">${task.symbol}</span><span class="workbench-institution-task-main"><strong>${task.title}${task.high ? '<em class="workbench-priority">高优</em>' : ''}</strong><small>${escapeHtml(task.description(task.count))}</small></span><span class="workbench-institution-action">${task.action} ›</span></button>`).join('');
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
    const row = event.target.closest('[data-workbench-institution]');
    if (row) openInstitutionTask(row.dataset.workbenchInstitution, row.dataset.workbenchTarget);
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
