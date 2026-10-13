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
  let assistantName = 'AI主理人';
  let assistantContextKey = 'global';
  let patientTaskStore = {};
  try { assistantName = localStorage.getItem('aiAssistantName')?.trim() || assistantName; } catch (_) {}
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
  const applyAssistantName = (name, persist = false) => {
    assistantName = name.trim().slice(0, 12) || 'AI主理人';
    document.querySelectorAll('[data-assistant-name]').forEach(node => { node.textContent = assistantName; });
    document.querySelector('[data-global-ai-close]')?.setAttribute('aria-label', `关闭${assistantName}`);
    const trigger = document.querySelector('[data-global-ai-toggle]');
    if (trigger) trigger.setAttribute('aria-label', trigger.getAttribute('aria-expanded') === 'true' ? `收起${assistantName}` : `打开${assistantName}`);
    if (persist) { try { localStorage.setItem('aiAssistantName', assistantName); } catch (_) {} }
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
      if (quickRow) quickRow.innerHTML = ['查看患者任务', '如何添加患者任务', '查询患者基本信息', '查看指标趋势'].map(quickPromptButton).join('');
      if (input) input.placeholder = `仅查询或新增${patient.name}患者的任务...`;
    } else {
      if (subtitle) subtitle.textContent = '可查询全局患者、任务与运营数据';
      if (scopeBadge) scopeBadge.textContent = '全局权限';
      if (quickRow) quickRow.innerHTML = ['汇总今日待办', '查看高优任务', '查询外呼情况', '生成随访建议'].map(quickPromptButton).join('');
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
    const completed = Math.round((sumByKey(groups, 'checkin') + sumByKey(groups, 'evaluation')) * .68);
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
    if (/能做什么|帮助|怎么用|功能/.test(text)) return { title: '可查询内容', content: '你可以询问今日待办、高优任务、患者入组、随访、预警、AI 外呼、完成情况、当前机构和所在功能页面。' };
    if (/机构|医共体|范围/.test(text)) return { title: '当前查询范围', content: `当前覆盖 ${groups.length} 家机构：${institutions}。后续回答会随顶部机构范围联动更新。` };
    if (/审核|入组/.test(text)) return { title: '患者入组查询', content: `当前共有 ${sumByKey(groups, 'review')} 位患者待审核入组，建议优先处理，避免预分组患者积压。` };
    if (/外呼|未接|触达/.test(text)) return { title: 'AI 外呼查询', content: `当前有 ${sumByKey(groups, 'call')} 次外呼失败、${sumByKey(groups, 'confirm')} 条外呼结果待确认。建议先补齐联系方式，再安排二次外呼。` };
    if (/预警|风险/.test(text)) return { title: '预警任务查询', content: `当前共有 ${sumByKey(groups, 'warning')} 条预警任务待处理，建议结合高优患者和逾期随访顺序处理。` };
    if (/完成|完成率/.test(text)) return { title: '今日完成情况', content: `今日已完成约 ${completed} 项，当前展示完成率为 68%。可继续询问待办或高优任务查看下一步。` };
    if (/高优|优先|先处理/.test(text)) return { title: '高优任务识别', content: `当前高优任务集中在患者入组审核 ${sumByKey(groups, 'review')} 项、外呼失败 ${sumByKey(groups, 'call')} 项和外呼结果确认 ${sumByKey(groups, 'confirm')} 项，建议按此顺序处理。` };
    if (/随访/.test(text)) return { title: '随访建议', content: `当前有 ${sumByKey(groups, 'followup')} 项随访待办。优先联系逾期与未触达患者，对外呼失败患者补齐手机号后安排二次外呼。` };
    if (/页面|模块|在哪/.test(text)) return { title: '当前位置', content: `你当前位于“${activeMenu}”。AI主理人会悬浮在系统右下角，切换其他菜单后仍可继续对话。` };
    if (/汇总|待办|今日/.test(text)) return { title: '今日待办汇总', content: `当前 ${groups.length} 家机构共有 ${total} 项待办，其中待审核入组 ${sumByKey(groups, 'review')} 项、待随访 ${sumByKey(groups, 'followup')} 项、预警 ${sumByKey(groups, 'warning')} 项、外呼相关 ${sumByKey(groups, 'call') + sumByKey(groups, 'confirm')} 项。` };
    return { title: '查询建议', content: `我已关联当前 ${groups.length} 家机构的数据。你可以继续询问今日待办、高优任务、患者入组、随访、预警、外呼或完成情况。` };
  };
  const setAssistantOpen = open => {
    const assistant = document.getElementById('globalAiAssistant');
    const panel = document.getElementById('globalAiPanel');
    const trigger = assistant?.querySelector('[data-global-ai-toggle]');
    if (!assistant || !panel || !trigger) return;
    panel.hidden = !open;
    assistant.classList.toggle('open', open);
    if (!open) {
      const editor = document.querySelector('[data-global-ai-name-editor]');
      if (editor) editor.hidden = true;
    }
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? `收起${assistantName}` : `打开${assistantName}`);
    if (open) {
      syncAssistantMode();
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
      const editor = document.querySelector('[data-global-ai-name-editor]');
      const input = document.querySelector('[data-assistant-name-input]');
      if (editor && input) {
        editor.hidden = false;
        input.value = assistantName;
        window.setTimeout(() => { input.focus(); input.select(); }, 0);
      }
      return;
    }
    if (event.target.closest('[data-assistant-name-cancel]')) {
      const editor = document.querySelector('[data-global-ai-name-editor]');
      if (editor) editor.hidden = true;
      document.querySelector('[data-global-ai-rename]')?.focus();
      return;
    }
    if (event.target.closest('[data-assistant-name-save]')) {
      const editor = document.querySelector('[data-global-ai-name-editor]');
      const input = document.querySelector('[data-assistant-name-input]');
      const value = input?.value.trim() || '';
      if (!value) { input?.setCustomValidity('请输入助手名称'); input?.reportValidity(); return; }
      input.setCustomValidity('');
      applyAssistantName(value, true);
      editor.hidden = true;
      document.querySelector('[data-global-ai-rename]')?.focus();
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
    if (event.key === 'Enter' && event.target?.matches?.('[data-assistant-name-input]')) {
      event.preventDefault();
      document.querySelector('[data-assistant-name-save]')?.click();
      return;
    }
    if (event.key === 'Escape' && !document.getElementById('globalAiPanel')?.hidden) {
      const editor = document.querySelector('[data-global-ai-name-editor]');
      if (editor && !editor.hidden) {
        editor.hidden = true;
        document.querySelector('[data-global-ai-rename]')?.focus();
        return;
      }
      setAssistantOpen(false);
      document.querySelector('[data-global-ai-toggle]')?.focus();
    }
  });
  window.addEventListener('organizationScopeChange', event => render(event.detail));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => render(window.organizationScope));
  else render(window.organizationScope);
})();
