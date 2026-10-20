(() => {
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (_) { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const customers = [
    { id:'C001', name:'张三', gender:'男', age:56, phone:'138****1234', diseases:'高血压、2型糖尿病', allergy:'青霉素过敏', lastCheck:'2026-10-10', summary:'血糖近期缓慢下降，仍高于参考范围；基因检测报告待专家解读。', sku:'基因检测服务', meds:[['氨氯地平','5mg','每日一次'],['二甲双胍','500mg','每日两次'],['阿托伐他汀','20mg','每日一次']], glucose:[['2026-08-10',8.5],['2026-09-15',8.2],['2026-10-10',7.8]], report:'2026年度健康体检报告' },
    { id:'C002', name:'李四', gender:'女', age:48, phone:'139****5688', diseases:'高尿酸血症', allergy:'暂无相关记录', lastCheck:'2026-10-08', summary:'尿酸较上次下降，专家建议7天后复查并保持饮食管理。', sku:'健康管理服务', meds:[['非布司他','20mg','每日一次']], glucose:[['2026-08-12',5.8],['2026-09-12',5.6],['2026-10-08',5.5]], report:'代谢指标复查报告' },
    { id:'C003', name:'王五', gender:'男', age:62, phone:'136****9071', diseases:'冠心病', allergy:'磺胺类药物过敏', lastCheck:'2026-09-28', summary:'近期检查资料不完整，需补充心电图和血脂检查。', sku:'慢病随访服务', meds:[['阿司匹林','100mg','每日一次']], glucose:[['2026-07-28',6.5],['2026-08-28',6.3],['2026-09-28',6.6]], report:'心血管专项检查报告' },
    { id:'C004', name:'赵六', gender:'女', age:41, phone:'158****3312', diseases:'甲状腺结节', allergy:'暂无相关记录', lastCheck:'2026-10-06', summary:'甲状腺指标稳定，建议按年度复查计划跟进。', sku:'女性健康管理服务', meds:[], glucose:[['2026-08-06',5.2],['2026-09-06',5.1],['2026-10-06',5.3]], report:'甲状腺功能检查报告' },
    { id:'C005', name:'陈晨', gender:'男', age:35, phone:'186****7720', diseases:'暂无相关记录', allergy:'海鲜过敏', lastCheck:'2026-09-30', summary:'体检整体正常，BMI轻度偏高，建议加强运动。', sku:'年度体检服务', meds:[], glucose:[['2026-07-30',5.4],['2026-08-30',5.5],['2026-09-30',5.4]], report:'年度健康体检报告' },
    { id:'C006', name:'陈晨', gender:'女', age:44, phone:'137****2106', diseases:'偏头痛', allergy:'暂无相关记录', lastCheck:'2026-10-02', summary:'近期睡眠质量欠佳，建议继续观察头痛频率。', sku:'职场健康服务', meds:[['布洛芬','200mg','必要时使用']], glucose:[['2026-08-02',5.7],['2026-09-02',5.8],['2026-10-02',5.6]], report:'职场健康体检报告' }
  ];
  const store = {
    mode: 'steward',
    currentCustomer: null,
    pendingIntent: '',
    conversations: read('aiStewardConversations', []),
    reminders: read('aiServiceReminders', [
      {id:'R001',taskId:'T001',customer:'张三',title:'完成基因检测报告解读跟进',time:'10:00',description:'确认专家解读安排，并向客户同步报告处理进度。',detail:'report',completed:false},
      {id:'R002',taskId:'T002',customer:'李四',title:'联系客户确认复查安排',time:'14:30',description:'根据专家建议，与客户确认7天后复查时间。',detail:'expert-detail',completed:false},
      {id:'R003',taskId:'T003',customer:'王五',title:'跟进健康档案资料补充',time:'16:00',description:'联系客户补充近期检查资料，完善健康档案。',detail:'profile',completed:false}
    ]),
    tasks: read('aiStewardTasks', [
      {id:'T001',customer:'张三',name:'安排专家解读',type:'报告跟进',time:'2026-10-14 10:00',assignee:'张老师（当前）',note:'联系专家完成基因检测报告解读',status:'待提醒',overdue:true},
      {id:'T002',customer:'李四',name:'健康服务复查',type:'复诊提醒',time:'2026-10-14 14:30',assignee:'张老师（当前）',note:'根据专家建议安排7天复查',status:'待提醒'},
      {id:'T003',customer:'王五',name:'确认用药情况',type:'用药随访',time:'2026-10-14 16:00',assignee:'张老师（当前）',note:'电话确认今日用药情况',status:'待提醒'}
    ])
  };
  if(!Array.isArray(store.conversations))store.conversations=[];
  if(!Array.isArray(store.reminders))store.reminders=[];
  if(!Array.isArray(store.tasks))store.tasks=[];
  store.tasks.forEach(task=>{task.status=task.status==='已完成'?'已完成':'待提醒';});
  save('aiStewardTasks',store.tasks);
  const homePrioritySeed = [
    {id:'R001',taskId:'T001',theme:'blue',customer:'张三',service:'基因检测服务',title:'联系客户确认检测目的及资料',time:'今天 09:00',detail:'task-list',completed:false},
    {id:'R002',taskId:'T002',theme:'green',customer:'李四',service:'采样安排',title:'提醒主理人核对采样安排',time:'今天 10:30',detail:'task-list',completed:false},
    {id:'R003',taskId:'T003',theme:'purple',customer:'王五',service:'采样跟进',title:'联系客户确认采样情况',time:'今天 14:00',detail:'task-list',completed:false},
    {id:'R004',theme:'orange',customer:'陈晨',service:'报告跟进',title:'跟进机构检测报告',time:'今天 15:30',detail:'report',completed:false},
    {id:'R005',theme:'cyan',customer:'赵六',service:'报告解读',title:'联系专家安排报告解读',time:'今天 17:30',detail:'suggestions',completed:false}
  ];
  homePrioritySeed.forEach(seed=>{const current=store.reminders.find(item=>item.id===seed.id);if(current)Object.assign(current,seed,{completed:current.completed});else store.reminders.push({...seed});});
  const contactExtraSeed = [
    {id:'R008',theme:'purple',customer:'周明',service:'健康随访',title:'确认下周随访时间',time:'今天 18:00',detail:'profile',completed:false},
    {id:'R009',theme:'orange',customer:'孙七',service:'复查回访',title:'联系客户确认复查结果',time:'昨天 16:20',detail:'profile',completed:false}
  ];
  contactExtraSeed.forEach(seed=>{const current=store.reminders.find(item=>item.id===seed.id);if(current)Object.assign(current,seed,{completed:current.completed});else store.reminders.push({...seed});});
  const resetPriorityExamples = () => {
    homePrioritySeed.forEach((seed,index)=>{
      const reminder=store.reminders.find(item=>item.id===seed.id);if(reminder)reminder.completed=index===0;
      const task=store.tasks.find(item=>item.id===seed.taskId);if(task)task.status=index===0?'已完成':'待提醒';
    });
    save('aiServiceReminders',store.reminders);
    save('aiStewardTasks',store.tasks);
  };
  if(homePrioritySeed.every(seed=>store.reminders.find(item=>item.id===seed.id)?.completed))resetPriorityExamples();
  save('aiServiceReminders',store.reminders);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const body = () => document.getElementById('workbenchChatBody');
  const assistantName = () => window.getGlobalAssistantName?.() || 'AI主理人';
  const avatar = () => '<span class="global-ai-avatar global-chat-avatar" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M20 6.5 23 14l7.5 3-7.5 3-3 7.5-3-7.5-7.5-3 7.5-3 3-7.5Z" fill="currentColor"/><circle cx="30.5" cy="9.5" r="3.5" fill="currentColor" opacity=".72"/><path d="M8 25v9M3.5 29.5h9" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span>';
  const scrollEnd = () => { const host = body(); if (host) host.scrollTop = host.scrollHeight; };
  const toast = text => { const panel=document.getElementById('globalAiPanel'); if(!panel)return; const node=document.createElement('div'); node.className='ai-toast'; node.textContent=text; panel.append(node); setTimeout(()=>node.remove(),1800); };
  const appendUser = text => {
    const row=document.createElement('div'); row.className='global-chat-row user';
    row.innerHTML=`<div class="workbench-message user live-message">${esc(text)}</div><span class="global-chat-user-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg></span>`;
    body()?.append(row); scrollEnd();
  };
  const appendAI = (title, html, actions='') => {
    const row=document.createElement('div'); row.className='global-chat-row ai';
    row.innerHTML=`${avatar()}<div class="ai-rich-message"><div class="workbench-message ai live-message">${title?`<strong>${esc(title)}</strong>`:''}<div>${html}</div></div>${actions?`<div class="ai-card-actions">${actions}</div>`:''}</div>`;
    body()?.append(row); scrollEnd(); return row;
  };
  const action = (label, type, customer='', primary=false) => `<button type="button" class="${primary?'primary':''}" data-ai-action="${type}" ${customer?`data-customer="${esc(customer)}"`:''}>${label}</button>`;
  const todayText = () => new Date().toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'short'});
  const homeDateText = () => todayText().replace('日','日 ');
  const homeIcon = name => {
    const icons={
      calendar:'<svg viewBox="0 0 24 24"><path d="M6 3v3M18 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"/><path d="M8 12h3v3H8z"/></svg>',
      report:'<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 12h7M9 16h7"/></svg>',
      expert:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>',
      customer:'<svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="3"/><circle cx="17" cy="9" r="3"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0M11 20a6 6 0 0 1 11 0"/></svg>',
      chat:'<svg viewBox="0 0 24 24"><path d="M4 5h16v12H9l-5 4z"/><circle cx="9" cy="11" r="1"/><circle cx="12" cy="11" r="1"/><circle cx="15" cy="11" r="1"/></svg>',
      clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>'
    };
    return icons[name]||icons.report;
  };
  const tomorrow = (hour=15) => { const d=new Date(); d.setDate(d.getDate()+1); d.setHours(hour,0,0,0); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:00`; };
  const currentPending = () => store.tasks.filter(t => t.status === '待提醒');
  const briefMarkup = () => {
    const stats=[['今日提醒','12'],['今日建档','5'],['客户待跟进','8'],['待确认专家建议','2']];
    const matters=[['张三','联系客户确认基因检测安排','查看提醒','task-list'],['李四','提醒客户预约复查','查看客户','profile'],['王五','专家报告已上传，建议新增两条提醒','查看专家建议','suggestions']];
    return `<section class="ai-business-card ai-brief-card"><span class="ai-intent-tag">已识别业务意图 · 工作简报与提醒聚合</span><h4>每日工作简报 <small>${esc(todayText())}</small></h4><div class="ai-brief-stats">${stats.map(([label,value])=>`<button data-ai-action="${label==='待确认专家建议'?'suggestions':'task-list'}"><span>${label}</span><strong>${value}</strong></button>`).join('')}</div><div class="ai-brief-matters">${matters.map(([name,text,label,type])=>`<article><div><strong>${name} · ${text}</strong><small>待提醒</small></div><button data-ai-action="${type}" data-customer="${name}">${label}</button></article>`).join('')}</div><div class="ai-card-actions">${action('查看更多','more-task','',true)}${action('模拟专家报告回传','simulate-expert')}</div></section>`;
  };
  const homeMarkup = () => {
    const questions=[['chat','今天有哪些客户需要联系？','查看今日及历史未完成的提醒'],['customer','今天新增了哪些客户？','查看今天新建的客户档案'],['customer','哪些客户的健康档案还没有完善？','查看需要补充资料的客户'],['report','哪些客户的报告还没有出具？','查看待出具报告的客户']];
    const priorities=homePrioritySeed.map(seed=>({...seed,completed:store.reminders.find(item=>item.id===seed.id)?.completed||false}));
    return `<section class="ai-steward-home"><header class="ai-home-hero"><time>${esc(homeDateText())}</time><div class="ai-home-greeting"><h2>上午好，王医生！ <span>👋</span></h2><p>今天有 <strong>18</strong> 项客户服务事项需要关注，我已为你整理了重点内容。</p></div><blockquote>让健康服务更简单<br>用AI助力专业服务</blockquote></header><section class="ai-home-panel ai-home-priority"><div class="ai-home-panel-head"><h3><i class="green">●</i>需要优先关注的事项</h3><button type="button" class="ai-batch-complete" data-ai-confirm-reminders="home" disabled>确认完成</button></div><div class="ai-home-priority-list">${priorities.map((item,index)=>`<article class="ai-home-priority-row ${item.theme} ${item.completed?'completed':''} ${index>2?'is-extra':''}" data-reminder-row="${item.id}" ${index>2?'hidden':''}><button type="button" class="ai-reminder-check ${item.completed?'checked':''}" data-ai-reminder-check="${item.id}" aria-pressed="${item.completed}" aria-label="${item.completed?'已完成':'选择完成'}：${item.title}" ${item.completed?'disabled aria-disabled="true"':''}><span>✓</span></button><div class="ai-home-priority-main"><span class="ai-home-priority-copy"><strong>${item.customer}<b>｜</b>${item.service}</strong><small>${item.title}</small></span><time>${item.time}</time><em>${item.completed?'已完成':'待提醒'}</em></div></article>`).join('')}</div><button type="button" class="ai-home-more" data-ai-priority-toggle aria-expanded="false"><span>查看更多</span><b>⌄</b></button></section><section class="ai-home-panel ai-home-questions"><h3><i class="orange">●</i>你可以这样问我</h3><div class="ai-home-question-grid">${questions.map(([icon,title,desc])=>`<button type="button" data-workbench-quick="${title}"><span class="ai-home-question-icon">${homeIcon(icon)}</span><span><strong>${title}</strong><small>${desc}</small></span><b>›</b></button>`).join('')}</div></section></section>`;
  };
  const caseManagerMarkup = (patient=customers[0]) => {
    const patientName=patient.name||'当前患者', patientGender=patient.gender||'待补充', patientAge=patient.age||'待补充', patientPhone=patient.phone||'待补充';
    const historyFields=[
      ['疾病史',patient.pastHistory||patient.diseases||'暂无记录'],
      ['手术史',patient.surgeryHistory||'暂无记录'],
      ['过敏史',patient.allergyHistory||patient.allergy||'暂无记录'],
      ['家族史',patient.familyHistory||'暂无记录']
    ];
    const questions=[
      ['report','这个客户最近一次医嘱是什么？'],
      ['clock','这个客户最近三次血糖有什么变化？'],
      ['medical','这个客户最近有哪些异常指标？'],
      ['calendar','这个客户还有哪些提醒没有完成？']
    ];
    return `<section class="case-manager-home">
      <section class="case-current-card"><h3><i>▣</i>当前客户</h3><div class="case-current-main"><img src="./assets/patient-archive-portrait.png" alt="${esc(patientName)}头像"><div class="case-current-info"><strong>${esc(patientName)} <b>${esc(patientGender)}</b><b>${esc(patientAge)}岁</b></strong><small>${esc(patientPhone)}</small><span><em>高血压</em><em>慢性肾病</em><em>基因检测</em></span></div><blockquote>用专业的陪伴<br>守护每一位客户的健康</blockquote></div></section>
      <section class="case-summary-card"><div class="case-section-head"><h3><i>♟</i>客户基础健康信息</h3><time>数据更新时间：2026-10-14</time></div><div class="case-summary-grid"><dl>${historyFields.map(([label,value])=>`<div><dt>${label}</dt><dd title="${esc(value)}">${esc(value)}</dd></div>`).join('')}</dl><div class="case-summary-actions"><button type="button" data-ai-open-archive data-ai-archive-tab="basic" data-customer="${esc(patientName)}" data-gender="${esc(patientGender)}" data-age="${esc(patientAge)}">查看档案 <b>→</b></button></div></div></section>
      <section class="case-question-card"><h3><i>●</i>你可以这样问我</h3><div>${questions.map(([icon,title])=>`<button type="button" data-workbench-quick="${title}"><span class="case-question-icon">${homeIcon(icon==='medical'?'report':icon)}</span><strong>${title}</strong><b>›</b></button>`).join('')}</div></section>
    </section>`;
  };
  const renderCaseManagerHome = (patient=store.currentCustomer||activePatientScope()||customers[0]) => { const host=body(); if(host){host.innerHTML=caseManagerMarkup(patient);host.scrollTop=0;} };
  const setCaseManagerChrome = active => {
    const panel=document.getElementById('globalAiPanel'), assistant=document.getElementById('globalAiAssistant'), title=document.getElementById('globalAiTitle'), subtitle=panel?.querySelector('[data-assistant-subtitle]'), input=document.getElementById('workbenchChatInput'), history=panel?.querySelector('[data-ai-history]'), refresh=panel?.querySelector('[data-ai-new]'), triggerLabel=assistant?.querySelector('.global-ai-trigger-label');
    panel?.classList.toggle('case-manager-mode',active);
    if(title)title.textContent=assistantName();
    if(subtitle)subtitle.textContent=active?'仅可查询当前患者的档案、医学资料、服务与任务':'可查询患者档案、医学资料、服务与提醒';
    if(input)input.placeholder=active?'输入关于该客户的问题...':'输入你想查询的数据或问题...';
    if(history){history.title='历史记录';history.setAttribute('aria-label','历史记录');}
    if(refresh){refresh.title='新建会话';refresh.setAttribute('aria-label','新建会话');}
    if(triggerLabel)triggerLabel.textContent=assistantName();
  };
  window.openPatientCaseManagerHome = () => {
    const patient=activePatientScope();
    if(!patient)return false;
    store.mode='case-manager';
    store.currentCustomer=patient;
    setCaseManagerChrome(true);
    renderCaseManagerHome(patient);
    return true;
  };
  const showBrief = () => appendAI('今日工作简报',briefMarkup());
  const renderBrief = () => {
    const host=body(); if(!host)return;
    if(store.mode==='case-manager'){renderCaseManagerHome();return;}
    host.innerHTML=homeMarkup();
    scrollEnd();
  };
  const completeReminder = target => {
    const item=store.reminders.find(reminder=>reminder.id===target.dataset.aiReminderCheck); if(!item)return;
    if(item.completed){toast('已完成的提醒不能修改');return;}
    item.completed=true; save('aiServiceReminders',store.reminders);
    const task=store.tasks.find(current=>current.id===item.taskId); if(task){task.status='已完成';save('aiStewardTasks',store.tasks);}
    const row=target.closest('[data-reminder-row]'); row?.classList.remove('is-selected');row?.classList.add('completed'); const status=row?.querySelector('em');if(status)status.textContent='已完成';target.classList.remove('is-selected');target.classList.add('checked'); target.setAttribute('aria-pressed','true'); target.setAttribute('aria-label',`已完成：${item.title}`);target.disabled=true;target.setAttribute('aria-disabled','true');
    document.querySelectorAll(`[data-ai-contact-check="${item.id}"]`).forEach(check=>{const queryRow=check.closest('tr,.ai-query-list-row'),queryStatus=queryRow?.querySelector('.ai-query-status');queryRow?.classList.add('completed');check.classList.add('checked');check.setAttribute('aria-pressed','true');check.setAttribute('aria-label',`已完成：${item.customer||''}${item.title}`);check.disabled=true;check.setAttribute('aria-disabled','true');if(queryStatus){queryStatus.textContent='已完成';queryStatus.className='ai-query-status muted';}});
    const todayAdded=store.tasks.filter(current=>current.status==='待提醒'&&/^T\d{10,}$/.test(current.id)&&current.time.startsWith(new Date().toISOString().slice(0,10))).length;
    const count=document.querySelector('[data-ai-today-count]'); if(count)count.textContent=String(Math.max(0,12+todayAdded-store.reminders.filter(reminder=>reminder.completed).length));
  };
  const updateBatchAction = scope => {
    const button=scope?.querySelector('[data-ai-confirm-reminders]'); if(!button)return;
    const count=scope.querySelectorAll('.ai-reminder-check.is-selected,.ai-query-check.is-selected').length;
    button.disabled=count===0;
    button.textContent=count?`确认完成（${count}）`:'确认完成';
  };
  const toggleReminderSelection = check => {
    if(check.disabled)return;
    const selected=!check.classList.contains('is-selected');
    check.classList.toggle('is-selected',selected);
    check.classList.toggle('checked',selected);
    check.setAttribute('aria-pressed',String(selected));
    check.setAttribute('aria-label',`${selected?'取消选择':'选择完成'}：${check.closest('[data-reminder-row],.ai-query-list-row')?.querySelector('strong')?.textContent||'提醒任务'}`);
    check.closest('[data-reminder-row],.ai-query-list-row')?.classList.toggle('is-selected',selected);
    updateBatchAction(check.closest('.ai-home-priority,.ai-query-card,.case-reminder-answer'));
  };
  const completeContactReminder = check => {
    const item=store.reminders.find(reminder=>reminder.id===check.dataset.aiContactCheck);if(!item||item.completed)return;
    item.completed=true;save('aiServiceReminders',store.reminders);
    const task=store.tasks.find(current=>current.id===item.taskId);if(task){task.status='已完成';save('aiStewardTasks',store.tasks);}
    const row=check.closest('tr,.ai-query-list-row'),status=row?.querySelector('.ai-query-status');row?.classList.remove('is-selected');row?.classList.add('completed');check.classList.remove('is-selected');check.classList.add('checked');check.setAttribute('aria-pressed','true');check.setAttribute('aria-label',`已完成：${item.customer||''}${item.title}`);check.disabled=true;check.setAttribute('aria-disabled','true');if(status){status.textContent='已完成';status.className='ai-query-status muted';}
    const homeRow=document.querySelector(`[data-reminder-row="${item.id}"]`),homeCheck=homeRow?.querySelector('[data-ai-reminder-check]'),homeStatus=homeRow?.querySelector('em');homeRow?.classList.add('completed');homeCheck?.classList.remove('is-selected');homeCheck?.classList.add('checked');homeCheck?.setAttribute('aria-pressed','true');if(homeCheck){homeCheck.disabled=true;homeCheck.setAttribute('aria-disabled','true');homeCheck.setAttribute('aria-label',`已完成：${item.title}`);}if(homeStatus)homeStatus.textContent='已完成';
  };
  const completePatientReminder = check => {
    const id=check.dataset.aiPatientReminderCheck,customerName=check.dataset.customer||store.currentCustomer?.name||'当前患者',completion=read('aiPatientReminderCompletion',{}),key=`${customerName}:${id}`;if(completion[key])return;
    completion[key]=true;save('aiPatientReminderCompletion',completion);
    const row=check.closest('.ai-query-list-row'),status=row?.querySelector('.ai-query-status'),card=check.closest('.case-reminder-answer'),title=row?.querySelector('.ai-query-row-copy strong')?.textContent||'提醒任务';row?.classList.remove('is-selected');row?.classList.add('completed');check.classList.remove('is-selected');check.classList.add('checked');check.setAttribute('aria-pressed','true');check.setAttribute('aria-label',`已完成：${title}`);check.disabled=true;check.setAttribute('aria-disabled','true');if(status){status.textContent='已完成';status.className='ai-query-status muted';}const count=card?.querySelector('[data-patient-reminder-count]');if(count&&card)count.textContent=String(card.querySelectorAll('.ai-query-list-row:not(.completed)').length);
  };
  const findCustomer = text => {
    const matches=customers.filter(c=>text.includes(c.name));
    if(matches.length===1){store.currentCustomer=matches[0];return matches[0];}
    if(!matches.length && /(他|她|该客户|这个客户)/.test(text)) return store.currentCustomer;
    return matches.length>1?matches:null;
  };
  const activePatientScope = () => {
    const archive=document.getElementById('patientArchivePage');
    const patient=document.getElementById('patientPage');
    const root=archive?.classList.contains('active')&&archive.getAttribute('aria-hidden')!=='true'?archive:patient?.classList.contains('active')?patient:null;
    if(!root)return null;
    const value=key=>root.querySelector(`[data-archive-text="${key}"], [data-patient-text="${key}"]`)?.textContent?.trim()||'';
    const name=value('name'); if(!name)return null;
    const known=customers.find(c=>c.name===name)||{};
    return {...known,id:known.id||`PAGE-${name}`,name,gender:value('gender')||known.gender||'待补充',age:Number((value('age')||String(known.age||'0')).replace(/\D/g,''))||'待补充',phone:value('phone')||known.phone||'待补充',pastHistory:value('pastHistory')||known.diseases||'暂无记录',surgeryHistory:value('surgeryHistory')||'暂无记录',allergyHistory:value('allergyHistory')||known.allergy||'暂无记录',familyHistory:value('familyHistory')||'暂无记录',diseases:known.diseases||value('pastHistory')||'暂无记录',allergy:known.allergy||value('allergyHistory')||'暂无记录',lastCheck:known.lastCheck||'暂无相关记录',summary:known.summary||'当前为患者专属权限，仅可查询或新增这位患者的任务。',sku:known.sku||'暂无相关记录',meds:known.meds||[],glucose:known.glucose||[],report:known.report||'暂无相关记录'};
  };
  const profileCard = customer => `<section class="ai-business-card"><span class="ai-intent-tag">已识别业务意图 · 客户档案查询</span><div class="ai-profile-head"><span class="ai-profile-avatar">${esc(customer.name.slice(-1))}</span><div><strong>${esc(customer.name)}</strong><small>${customer.gender} · ${customer.age}岁 · ${esc(customer.phone)}</small></div></div><dl class="ai-detail-grid"><dt>健康史</dt><dd>${esc(customer.summary)}</dd><dt>既往疾病</dt><dd>${esc(customer.diseases||'暂无相关记录')}</dd><dt>过敏史</dt><dd>${esc(customer.allergy||'暂无相关记录')}</dd><dt>客户标签</dt><dd>重点随访 · 慢病管理</dd><dt>最近检查</dt><dd>${esc(customer.lastCheck)}</dd><dt>进行中服务</dt><dd>${esc(customer.sku)}</dd><dt>档案来源</dt><dd>主理人录入 · 最近更新 ${esc(customer.lastCheck)}</dd></dl></section>`;
  const showProfile = customer => appendAI('客户健康档案',profileCard(customer),action('完整档案','profile-detail',customer.name)+action('查看报告','report',customer.name)+action('查看服务','service',customer.name,true));
  const statusTag = (label,tone='orange') => `<span class="ai-query-status ${tone}">${label}</span>`;
  const listView = (rows,visible=rows.length,extraClass='') => `<div class="ai-query-list ${extraClass}">${rows.map((row,rowIndex)=>`<article class="ai-query-list-row ${row.completed?'completed':''} ${row.action!==undefined?'has-action':''} ${row.actionOnly?'action-only':''} ${rowIndex>=visible?'ai-query-extra':''}" ${rowIndex>=visible?'hidden':''} ${row.id?`data-query-reminder="${row.id}"`:''}><span class="ai-query-row-rail"></span>${row.marker||`<span class="ai-query-row-marker">${rowIndex+1}</span>`}<span class="ai-query-row-copy"><strong>${row.customer}${row.primary?`<b>｜</b>${row.primary}`:''}</strong><small>${row.secondary}</small></span><time>${row.meta||''}</time>${row.status||''}${row.action!==undefined?(row.action||'<span class="ai-query-row-action-spacer" aria-hidden="true"></span>'):''}</article>`).join('')}</div>`;
  const showMedication = customer => {
    const medicines=customer.meds?.length?customer.meds:[['暂无用药记录','--','--']];
    const rows=medicines.map(([name,dose,frequency])=>({customer:esc(name),primary:'门诊处方',secondary:`剂量：${esc(dose)}`,meta:'09-15',status:statusTag(esc(frequency),'blue')}));
    appendAI('',`<section class="case-answer-card case-order-answer"><header class="case-answer-head"><span class="case-answer-icon orange">${homeIcon('report')}</span><div><strong>最近一次医嘱</strong><small>2024-09-15　门诊处方</small></div></header><h4>医嘱内容</h4>${listView(rows,rows.length,'case-answer-list')}<p class="case-answer-note"><i>◆</i>以上为历史处方记录，具体用药请结合实际情况确认。</p><div class="case-answer-actions">${action('查看原始医嘱','original-order',customer.name)}${action('创建提醒','task-form',customer.name)}</div></section>`);
  };
  const showMedicationList = customer => {
    const medicines=customer.meds?.length?customer.meds:[['暂无长期用药记录','--','--']];
    const rows=medicines.map(([name,dose,frequency])=>({customer:esc(name),primary:'当前用药',secondary:`剂量：${esc(dose)}`,meta:esc(frequency),status:statusTag(name.includes('暂无')?'待补充':'服用中',name.includes('暂无')?'orange':'green')}));
    appendAI('',`<section class="case-answer-card case-order-answer"><header class="case-answer-head"><span class="case-answer-icon blue">${homeIcon('report')}</span><div><strong>${esc(customer.name)}当前用药</strong><small>数据更新：${esc(customer.lastCheck)}</small></div></header>${listView(rows,rows.length,'case-answer-list')}<p class="case-answer-note"><i>◆</i>用药信息来自当前患者档案，请结合最新医嘱核对。</p><div class="case-answer-actions">${action('查看最近医嘱','original-order',customer.name)}${action('创建提醒','task-form',customer.name)}</div></section>`);
  };
  const showReport = customer => appendAI(`${customer.name}最近检查报告`,`<section class="ai-business-card"><h4>${esc(customer.report)}</h4><dl class="ai-detail-grid"><dt>报告类型</dt><dd>检查检验报告</dd><dt>检查日期</dt><dd>${esc(customer.lastCheck)}</dd><dt>上传日期</dt><dd>${esc(customer.lastCheck)} 16:20</dd><dt>上传来源</dt><dd>主理人手动上传（模拟）</dd><dt>报告摘要</dt><dd>${esc(customer.summary)}</dd></dl></section>`,action('查看报告详情','report-detail',customer.name,true));
  const openReportArchive = customer => {
    const latestGlucose=customer.glucose?.at(-1);
    window.openPatientArchiveFromAssistant?.({name:customer.name,gender:customer.gender,age:customer.age,tab:'history',report:{name:customer.report,title:customer.report,reportType:'报告单',checkDate:customer.lastCheck,date:`${customer.lastCheck} 16:20`,uploadedAt:`${customer.lastCheck} 16:20`,source:'医护上传',hospital:'健康管理中心',summary:customer.summary,note:'*本资料由AI主理人归档',originalFiles:[{name:`${customer.report}.pdf`,type:'pdf'}],keyData:latestGlucose?[{category:'报告单',type:'检验报告',name:'空腹血糖',result:`${latestGlucose[1]} mmol/L`,status:Number(latestGlucose[1])>6.1?'需关注':'正常',referenceRange:'3.9–6.1 mmol/L',extra:'参考范围：3.9–6.1 mmol/L',date:latestGlucose[0]}]:[],interpretation:{abnormal:customer.summary,analysis:'该报告已归档至患者病历档案，可结合原始资料和连续健康指标进行综合判断。',suggestion:'建议结合患者近期健康趋势和随访计划继续观察，必要时安排复查。'}}});
  };
  const showService = customer => {
    const steps=[['确认检测安排','已完成','标准SKU','2026-09-18'],['提醒客户完成检测','已完成','标准SKU','2026-09-24'],['跟进检测报告','已完成','自定义','2026-10-08'],['邀请专家解读','待提醒','专家建议','2026-10-16'],['反馈专家建议','待提醒','专家建议','2026-10-20']];
    appendAI(`${customer.name}服务进度`,`<section class="ai-business-card"><h4>${esc(customer.sku)}</h4><dl class="ai-detail-grid"><dt>开始时间</dt><dd>2026-09-18</dd><dt>服务状态</dt><dd>进行中</dd><dt>关联提醒</dt><dd>5条（待提醒2条，已完成3条）</dd></dl><div class="ai-service-timeline">${steps.map(step=>`<div class="ai-service-step ${step[1]==='已完成'?'done':''}"><i></i><div><strong>${esc(step[0])}</strong><small>${esc(step[3])} · <span>${esc(step[2])}</span> · ${esc(step[1])}</small></div></div>`).join('')}</div><div class="ai-demo-note">服务状态独立于提醒状态，不会仅依据提醒数量自动判定服务完成。</div></section>`,action('查看服务详情','service-detail',customer.name)+action('创建提醒','task-form',customer.name,true));
  };
  const queryCard = ({index,title,query,theme,icon,cardTitle,summary,rows,visible=rows.length,footer='',topAction=''}) => `<section class="ai-query-result ${theme}"><header class="ai-query-heading"><span>${index}.</span><strong>${title}</strong><em>${query}</em></header><div class="ai-query-card"><div class="ai-query-card-title"><i>${homeIcon(icon)}</i><div><strong>${cardTitle}</strong><small>${summary}</small></div>${topAction}</div>${listView(rows,visible)}${footer?`<footer>${footer}</footer>`:''}</div></section>`;
  const expandButton = label => `<button type="button" class="ai-query-more" data-ai-query-toggle data-expanded="false" data-label="${label}" aria-expanded="false"><span>${label}</span><b>⌄</b></button>`;
  const batchCompleteButton = type => `<button type="button" class="ai-batch-complete" data-ai-confirm-reminders="${type}" disabled>确认完成</button>`;
  const showContactList = () => {
    const ids=['R009','R001','R002','R003','R004','R005','R008'];
    const items=ids.map(id=>store.reminders.find(item=>item.id===id)).filter(item=>item&&(item.time.startsWith('今天')||!item.completed));
    const rows=items.map(item=>{const {id,customer,service:primary,title:secondary,time:meta,completed}=item;return {id,customer,primary,secondary,meta,completed,marker:`<button type="button" class="ai-query-check ${completed?'checked':''}" data-ai-contact-check="${id}" aria-pressed="${completed}" aria-label="${completed?'已完成':'选择完成'}：${customer}${secondary}" ${completed?'disabled aria-disabled="true"':''}><span>✓</span></button>`,status:statusTag(completed?'已完成':'待提醒',completed?'muted':'orange')};});
    const todayCount=items.filter(item=>item.time.startsWith('今天')).length,historyPendingCount=items.length-todayCount,customerCount=new Set(items.map(item=>item.customer)).size;
    const summary=`今日${todayCount}条 · 历史未完成${historyPendingCount}条 · 涉及${customerCount}名客户`;
    appendAI('',queryCard({index:2,title:'客户提醒查询',query:'今天有哪些客户需要联系？',theme:'purple',icon:'chat',cardTitle:'今日客户联系清单',summary,rows,visible:5,topAction:batchCompleteButton('contact'),footer:rows.length>5?expandButton('查看更多'):''}));
  };
  const showPendingReports = () => {
    const rows=[['张三','健康综合评估','10-10'],['李四','心血管风险评估','10-12'],['王五','营养健康评估','10-12'],['陈晨','年度体检报告','10-13'],['赵六','甲状腺检查报告','10-14'],['孙七','基因检测解读','10-14']].map(([customer,primary,date])=>({customer,primary,secondary:`资料更新：${date}`,meta:date,status:'',actionOnly:true,action:`<button type="button" class="ai-query-row-action pending" data-ai-open-archive data-ai-archive-tab="reports" data-customer="${esc(customer)}">去出具&nbsp;&gt;</button>`}));
    appendAI('',queryCard({index:6,title:'报告管理查询',query:'哪些客户的报告还没有出具？',theme:'orange',icon:'report',cardTitle:'待出具报告客户',summary:'共6份报告待出具',rows,visible:3,footer:expandButton('查看更多')}));
  };
  const showTodayNewCustomers = () => {
    const rows=[['周一','男','45','09:10',true],['吴梅','女','38','10:20',true],['陈亮','男','52','11:05',false],['林晓','女','34','13:20',true],['赵宁','男','41','15:00',false]].map(([customer,gender,age,time,completed])=>({customer,primary:'',secondary:`${gender} · ${age}岁`,meta:time,status:statusTag(completed?'已完善':'待完善',completed?'green':'orange'),action:`<button type="button" class="ai-query-row-action ${completed?'complete':'pending'}" data-ai-open-archive data-customer="${esc(customer)}" data-gender="${gender}" data-age="${age}">${completed?'查看':'去完善'}&nbsp;&gt;</button>`}));
    appendAI('',queryCard({index:5,title:'客户建档查询',query:'今天新增了哪些客户？',theme:'green',icon:'customer',cardTitle:'今日新增客户',summary:'共5名新客户',rows,visible:3,footer:expandButton('查看全部新客户')}));
  };
  const showIncompleteArchives = () => {
    const rows=[['张三','近期体检报告','10-01'],['李四','跟进用药记录','10-03'],['王五','专家解读报告','10-05'],['赵六','基础信息','10-10'],['陈晨','过敏史','10-12'],['孙七','家族健康史','10-14']].map(([customer,missing,date])=>({customer,primary:'',secondary:`缺少：${missing}`,meta:date,status:'',actionOnly:true,action:`<button type="button" class="ai-query-row-action pending" data-ai-open-archive data-customer="${esc(customer)}">去完善&nbsp;&gt;</button>`}));
    appendAI('',queryCard({index:4,title:'客户档案查询',query:'哪些客户的健康档案还没有完善？',theme:'violet',icon:'calendar',cardTitle:'发现6名客户档案待完善',summary:'',rows,visible:4,footer:expandButton('查看全部6名客户')}));
  };
  const showTrend = customer => {
    const values=[['2024-08-10',8.5],['2024-09-15',8.2],['2024-10-10',7.8]];
    const id=`aiTrend${Date.now()}`;
    appendAI('',`<section class="case-answer-card case-trend-answer"><header class="case-answer-head split"><div><span class="case-answer-icon blue">${homeIcon('trend')}</span><strong>空腹血糖变化趋势</strong></div><small>单位：mmol/L</small></header><div class="case-answer-chart" id="${id}" role="img" aria-label="${esc(customer.name)}最近三次空腹血糖折线图：8.5、8.2、7.8"></div><div class="case-answer-analysis"><strong><i>●</i>AI分析</strong><p>最近三次空腹血糖呈逐步下降趋势，建议持续监测并结合生活方式干预。</p></div><div class="case-answer-actions">${action('查看原始报告','report-detail',customer.name)}${action('创建提醒','task-form',customer.name)}</div></section>`);
    setTimeout(()=>{ const el=document.getElementById(id); if(!el||!window.echarts)return; const chart=window.echarts.init(el); chart.setOption({animation:!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,animationDuration:450,tooltip:{trigger:'axis',valueFormatter:value=>`${value} mmol/L`},grid:{left:34,right:14,top:34,bottom:32},xAxis:{type:'category',boundaryGap:false,data:values.map(v=>v[0]),axisTick:{show:false},axisLine:{lineStyle:{color:'#dce7f3'}},axisLabel:{color:'#7186a2',fontSize:11,margin:12}},yAxis:{type:'value',min:0,max:10,interval:5,axisTick:{show:false},axisLine:{show:false},axisLabel:{color:'#8799ae',fontSize:10},splitLine:{lineStyle:{color:'#edf2f8'}}},series:[{type:'line',data:values.map(v=>v[1]),symbol:'circle',symbolSize:8,label:{show:true,position:'top',distance:8,color:'#173f77',fontSize:12,fontWeight:700},lineStyle:{color:'#2787f5',width:3},itemStyle:{color:'#2787f5',borderColor:'#fff',borderWidth:2}}]}); if(window.ResizeObserver)new ResizeObserver(()=>chart.resize()).observe(el); },30);
  };
  const showBloodPressure = customer => {
    const seed={C001:[["2026-08-10",146,92],["2026-09-15",140,88],["2026-10-10",134,84]],C002:[["2026-08-12",132,84],["2026-09-12",128,82],["2026-10-08",126,80]],C003:[["2026-07-28",142,90],["2026-08-28",138,88],["2026-09-28",136,86]]};
    const values=seed[customer.id]||[["2026-08-06",130,82],["2026-09-06",128,80],["2026-10-06",126,79]];
    const id=`aiPressure${Date.now()}`;
    appendAI('',`<section class="case-answer-card case-trend-answer"><header class="case-answer-head split"><div><span class="case-answer-icon blue">${homeIcon('clock')}</span><strong>${esc(customer.name)}近期血压趋势</strong></div><small>单位：mmHg</small></header><div class="case-answer-chart" id="${id}" role="img" aria-label="${esc(customer.name)}最近三次血压趋势"></div><div class="case-answer-analysis"><strong><i>●</i>趋势分析</strong><p>最近三次血压整体呈下降趋势，最新一次为 ${values.at(-1)[1]}/${values.at(-1)[2]} mmHg，建议继续按计划监测。</p></div><div class="case-answer-actions">${action('查看健康档案','profile-detail',customer.name)}${action('创建提醒','task-form',customer.name)}</div></section>`);
    setTimeout(()=>{const el=document.getElementById(id);if(!el||!window.echarts)return;const chart=window.echarts.init(el);chart.setOption({animation:!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,animationDuration:450,tooltip:{trigger:'axis',valueFormatter:value=>`${value} mmHg`},legend:{top:0,right:4,itemWidth:12,itemHeight:6,textStyle:{color:'#6f83a1',fontSize:10}},grid:{left:34,right:14,top:38,bottom:32},xAxis:{type:'category',boundaryGap:false,data:values.map(value=>value[0].slice(5)),axisTick:{show:false},axisLine:{lineStyle:{color:'#dce7f3'}},axisLabel:{color:'#7186a2',fontSize:10,margin:12}},yAxis:{type:'value',min:60,max:160,interval:20,axisTick:{show:false},axisLine:{show:false},axisLabel:{color:'#8799ae',fontSize:10},splitLine:{lineStyle:{color:'#edf2f8'}}},series:[{name:'收缩压',type:'line',data:values.map(value=>value[1]),symbol:'circle',symbolSize:7,lineStyle:{color:'#2787f5',width:3},itemStyle:{color:'#2787f5'}},{name:'舒张压',type:'line',data:values.map(value=>value[2]),symbol:'circle',symbolSize:7,lineStyle:{color:'#20b882',width:3},itemStyle:{color:'#20b882'}}]});if(window.ResizeObserver)new ResizeObserver(()=>chart.resize()).observe(el);},30);
  };
  const showAbnormalIndicators = customer => {
    const rows=[['空腹血糖','7.8 ↑','3.9-6.1','2024-10-10'],['总胆固醇','5.2 ↑','0-5.2','2024-10-10'],['甘油三酯','2.1 ↑','0-1.7','2024-10-10']];
    const items=rows.map(([name,result,reference,date])=>({customer:esc(name),secondary:`参考范围：${esc(reference)}`,meta:esc(date.slice(5)),status:statusTag(esc(result),'red')}));
    appendAI('',`<section class="case-answer-card case-abnormal-answer"><header class="case-answer-head"><span class="case-answer-icon orange">${homeIcon('report')}</span><div><strong>异常指标汇总 <em>（3项）</em></strong></div></header>${listView(items,items.length,'case-answer-list')}</section>`);
  };
  const showPendingPatientReminders = customer => {
    const rows=[
      ['PR001','联系客户确认检测目的及资料','2024-10-14','检测资料'],
      ['PR002','提醒主理人核对采样安排','2024-10-16','采样安排'],
      ['PR003','联系客户确认采样情况','2024-10-18','采样跟进'],
      ['PR004','跟进机构检测报告','2024-10-20','报告跟进'],
      ['PR005','联系专家安排报告解读','2024-10-22','专家解读'],
      ['PR006','联系客户反馈专家建议','2024-10-24','专家建议'],
      ['PR007','提醒客户完成专家建议中的后续事项','2024-10-28','后续事项']
    ];
    const completion=read('aiPatientReminderCompletion',{});
    const items=rows.map(([id,title,date,source])=>{const completed=Boolean(completion[`${customer.name}:${id}`]);return {id,completed,customer:esc(title),secondary:`来源：${esc(source)}`,meta:esc(date.slice(5)),marker:`<button type="button" class="ai-query-check case-patient-reminder-check ${completed?'checked':''}" data-ai-patient-reminder-check="${id}" data-customer="${esc(customer.name)}" aria-pressed="${completed}" aria-label="${completed?'已完成':'选择完成'}：${esc(title)}" ${completed?'disabled aria-disabled="true"':''}><span>✓</span></button>`,status:statusTag(completed?'已完成':'待完成',completed?'muted':'orange')};});
    const pendingCount=items.filter(item=>!item.completed).length;
    appendAI('',`<section class="case-answer-card case-reminder-answer"><header class="case-answer-head case-reminder-card-head"><span class="case-answer-icon orange">${homeIcon('calendar')}</span><div><strong>待完成提醒 <em data-patient-reminder-count>${pendingCount}</em> 项</strong></div><span class="case-reminder-head-actions">${batchCompleteButton('patient')}<button type="button" class="case-reminder-add" data-ai-action="task-form" data-customer="${esc(customer.name)}">创建提醒</button></span></header>${listView(items,items.length,'case-answer-list')}</section>`);
  };
  const runPatientQuickQuery = (intent,customer) => {
    store.currentCustomer=customer;
    if(intent==='medical-order')showMedication(customer);
    else if(intent==='blood-pressure')showBloodPressure(customer);
    else if(intent==='blood-sugar')showTrend(customer);
    else if(intent==='medication-list')showMedicationList(customer);
    else if(intent==='abnormal')showAbnormalIndicators(customer);
  };
  const renderCustomerPicker = list => `<p class="ai-customer-picker-hint"><span aria-hidden="true">✓</span>选择后将展示该患者的查询结果</p><div class="ai-customer-picker" role="list">${list.map((customer,index)=>`<button type="button" class="ai-customer-choice tone-${['blue','green','purple','orange'][index%4]}" data-ai-action="choose-customer" data-customer-id="${esc(customer.id)}" aria-label="选择${esc(customer.name)}，${esc(customer.gender)}，${esc(customer.age)}岁，${esc(customer.diseases)}"><span class="ai-customer-choice-avatar" aria-hidden="true">${esc(customer.name.slice(-1))}</span><span class="ai-customer-choice-main"><span class="ai-customer-choice-head"><strong>${esc(customer.name)}</strong><em>${esc(customer.gender)} · ${esc(customer.age)}岁</em></span><small>${esc(customer.phone)}</small><span class="ai-customer-choice-tag">${esc(customer.diseases)}</span></span><b aria-hidden="true">›</b></button>`).join('')}</div>`;
  const startPatientQuickQuery = (intent,label) => {
    appendUser(label);
    const scoped=store.mode==='case-manager'?(store.currentCustomer||activePatientScope()):null;
    if(scoped){runPatientQuickQuery(intent,scoped);return;}
    store.currentCustomer=null;
    store.pendingIntent=intent;
    appendAI('请选择要查询的患者',renderCustomerPicker(customers));
  };
  const taskForm = (customer, preset={}) => {
    const id=`taskForm${Date.now()}`;
    const reminderTime=preset.time||tomorrow(9);
    const repeatEnabled=preset.repeatEnabled!==false&&preset.repeat!=='不重复';
    const repeatInterval=Math.max(1,Number(preset.repeatInterval)||3);
    const repeatUnit=['天','周','月'].includes(preset.repeatUnit)?preset.repeatUnit:'天';
    const repeatCount=Math.min(99,Math.max(2,Number(preset.repeatCount)||4));
    appendAI('',`<section class="ai-business-card case-reminder-form-card" id="${id}" data-edit-task="${esc(preset.id||'')}" data-customer="${esc(customer.name)}"><header class="case-reminder-form-head"><strong>${preset.id?'修改提醒':'新增提醒'}</strong></header><div class="case-reminder-form"><label class="case-reminder-field required"><span>提醒内容</span><input data-field="content" value="${esc(preset.name||'')}" placeholder="请输入需要跟进的服务事项" maxlength="100"></label><fieldset class="case-reminder-settings"><legend>提醒设置</legend><label class="case-reminder-field"><span>提醒时间</span><input data-field="time" type="datetime-local" value="${esc(reminderTime.replace(' ','T'))}"></label><div class="case-repeat-toggle-row"><span>重复提醒</span><label class="case-repeat-switch"><input type="checkbox" data-field="repeatEnabled" ${repeatEnabled?'checked':''} aria-label="重复提醒"><i aria-hidden="true"></i></label></div><div class="case-repeat-controls" data-repeat-settings><span>每隔</span><input data-field="repeatInterval" type="number" min="1" max="365" value="${repeatInterval}" aria-label="重复间隔"><select data-field="repeatUnit" aria-label="重复单位"><option value="天" ${repeatUnit==='天'?'selected':''}>天</option><option value="周" ${repeatUnit==='周'?'selected':''}>周</option><option value="月" ${repeatUnit==='月'?'selected':''}>月</option></select><span>，共提醒</span><input data-field="repeatCount" type="number" min="2" max="99" value="${repeatCount}" aria-label="提醒次数"><span>次</span></div><p class="case-repeat-summary" data-repeat-summary><i aria-hidden="true">i</i><span></span></p></fieldset><label class="case-reminder-field"><span>备注</span><textarea data-field="note" placeholder="补充执行要求或客户注意事项" maxlength="500">${esc(preset.note||'')}</textarea></label></div><div class="ai-card-actions case-reminder-actions"><button data-ai-action="cancel-card">取消</button><button class="primary" data-ai-action="confirm-task" data-form="${id}">${preset.id?'确认修改':'确认创建'}</button></div></section>`);
    const form=document.getElementById(id); if(form)updateCaseReminderSummary(form);
  };
  const renderTasks = (filter='all') => {
    const list=store.tasks.filter(t=>filter==='overdue'?t.overdue&&t.status==='待提醒':filter==='today'?t.status==='待提醒':true);
    const rows=list.length?list.map(t=>`<article class="ai-task-row" data-task-id="${esc(t.id)}"><div class="ai-task-row-head"><span>${esc(t.customer)} · ${esc(t.name)}</span><em class="ai-task-status ${t.status==='已完成'?'done':''}">${esc(t.status)}</em></div><p>${esc(t.time)} · ${esc(t.type)} · ${esc(t.assignee)}</p><div class="ai-card-actions">${t.status==='待提醒'?`<button data-ai-action="complete-task" data-task="${esc(t.id)}">标记完成</button><button data-ai-action="edit-task" data-task="${esc(t.id)}">修改</button>`:''}</div></article>`).join(''):'<p>暂无相关任务</p>';
    appendAI(filter==='overdue'?'逾期任务':'任务列表',`<section class="ai-business-card"><div class="ai-task-list">${rows}</div></section>`);
  };
  const renderMoreTask = () => {
    const task={customer:'赵六',name:'确认年度复查计划',type:'复诊提醒',time:'2026-10-14 17:30',assignee:'张老师（当前）',note:'联系客户确认甲状腺年度复查时间，并同步服务计划。'};
    appendAI('更多任务',`<section class="ai-business-card"><article class="ai-task-row"><div class="ai-task-row-head"><span>${esc(task.customer)} · ${esc(task.name)}</span><em class="ai-task-status">待提醒</em></div><p>${esc(task.time)} · ${esc(task.type)} · ${esc(task.assignee)}</p><p>${esc(task.note)}</p><div class="ai-card-actions">${action('查看客户档案','profile',task.customer,true)}</div></article></section>`);
  };
  const thinking = () => { const row=appendAI('正在查询','<span class="ai-thinking">正在分析本地模拟数据 <i></i><i></i><i></i></span>'); row.dataset.thinking='true'; return row; };
  const route = text => {
    if(store.mode==='case-manager'){
      const customer=store.currentCustomer||activePatientScope()||customers[0]; store.currentCustomer=customer;
      if(/总结.*健康|健康情况/.test(text)){appendAI(`${customer.name}的健康情况`,`<section class="ai-business-card"><p>${esc(customer.name)}目前有高血压与糖尿病病史，近期已完成基因检测。当前建议重点关注血糖控制，并按专家建议完成报告解读和复查安排。</p></section>`,action('查看完整健康档案','profile',customer.name,true));return;}
      if(/异常指标/.test(text)){showAbnormalIndicators(customer);return;}
      if(/还有哪些提醒|提醒.*没有完成|未完成.*提醒/.test(text)){showPendingPatientReminders(customer);return;}
      if(/最近三次.*血糖|血糖.*变化|最近三次|指标.*变化|趋势/.test(text)){showTrend(customer);return;}
      if(/最近一次.*医嘱|医嘱|用药/.test(text)){showMedication(customer);return;}
      if(/专家建议|后续提醒|生成复查提醒/.test(text)){simulateExpert(customer);return;}
      if(/服务/.test(text)){showService(customer);return;}
    }
    const scopedPatient=activePatientScope();
    if(scopedPatient && (/(全局|全部客户|所有客户|机构|运营)/.test(text) || customers.some(c=>c.name!==scopedPatient.name&&text.includes(c.name)))){
      appendAI('患者权限限制',`当前处于${esc(scopedPatient.name)}患者档案，仅可查询这位患者的数据，或查看、新增这位患者的任务。退出患者档案后可恢复全局查询。`);return;
    }
    if(/今天有哪些客户需要联系/.test(text)){showContactList();return;}
    if(/今天新增了哪些客户|今天.*新增.*客户/.test(text)){showTodayNewCustomers();return;}
    if(/哪些客户的报告还没出具|哪些客户的报告还没有出具|哪些客户.*报告.*没出具/.test(text)){showPendingReports();return;}
    if(/待完善档案|哪些客户.*档案.*(完善|补充)|档案待补充/.test(text)){showIncompleteArchives();return;}
    if(/所有未完成提醒/.test(text)){renderTasks();return;}
    if(/最近7天新增客户/.test(text)){appendAI('最近新增客户','近7天新增客户5人：陈晨、赵六、李敏、周宁、刘芳。',action('查看客户档案','profile','陈晨',true));return;}
    if(/基因检测服务客户/.test(text)){showService(customers[0]);return;}
    if(/服务即将结束/.test(text)){appendAI('未来7天即将结束的服务','共有3项服务计划在未来7天结束：张三·基因检测服务、李四·健康管理服务、赵六·女性健康管理服务。');return;}
    if(/生成工作日报/.test(text)){showBrief();return;}
    if(/每日工作简报|今天有哪些客户提醒/.test(text)){showBrief();return;}
    const match=findCustomer(text);
    if(Array.isArray(match)){appendAI('查询到同名客户，请选择',renderCustomerPicker(match));return;}
    let customer=scopedPatient||match||store.currentCustomer;
    if(scopedPatient)store.currentCustomer=scopedPatient;
    if(store.pendingIntent && !customer){ const byName=customers.find(c=>text.trim()===c.name); if(byName){customer=byName;store.currentCustomer=byName;} }
    if(/档案|既往疾病|过敏史|健康异常/.test(text)){ if(!customer){store.pendingIntent='profile';appendAI('查询客户档案','请告诉我需要查询哪位客户的健康档案？');return;} store.pendingIntent='';showProfile(customer);return; }
    if(/用药|医嘱|吃什么药/.test(text)){ if(!customer){store.pendingIntent='medication';appendAI('查询医嘱与用药','请告诉我需要查询哪位客户的医嘱记录？');return;} store.pendingIntent='';showMedication(customer);return; }
    if(/血糖|尿酸|指标|变化|趋势/.test(text)){ if(!customer){store.pendingIntent='trend';appendAI('查询健康指标','请告诉我需要查询哪位客户及哪项指标？');return;} store.pendingIntent='';showTrend(customer);return; }
    if(/服务进度|服务进展|基因检测.*(进展|到哪|哪一步)/.test(text)){ if(!customer){store.pendingIntent='service';appendAI('查询服务进度','请告诉我需要查询哪位客户的服务进度？');return;} store.pendingIntent='';showService(customer);return; }
    if(/专家建议/.test(text)){ simulateExpert(customer||customers[0]);return; }
    if(/报告|体检/.test(text)){ if(!customer){store.pendingIntent='report';appendAI('查询报告','请告诉我需要查询哪位客户的报告？');return;} store.pendingIntent='';showReport(customer);return; }
    if(/提醒|创建任务|新增任务|定任务|联系.*复查|每周|每个月|下周/.test(text)){
      if(!customer){store.pendingIntent='task';appendAI('创建任务','请先告诉我任务关联哪位客户？');return;}
      if(!/(明天|后天|下周|每周|每个月|\d{1,2}[点号]|\d{1,2}:\d{2})/.test(text)){store.pendingIntent='task-time';appendAI('还需要任务时间',`已识别客户为${esc(customer.name)}，请补充明确的执行时间，例如“明天下午3点”。`);return;}
      const hour=/下午\s*(\d{1,2})/.test(text)?Number(RegExp.$1)+12:/上午\s*(\d{1,2})/.test(text)?Number(RegExp.$1):15;
      taskForm(customer,{time:tomorrow(Math.min(hour,23)),name:`联系${customer.name}安排复查`}); store.pendingIntent='';return;
    }
    if(store.pendingIntent && customer){ const intent=store.pendingIntent;store.pendingIntent=''; if(intent==='profile')showProfile(customer);else if(intent==='medication')showMedication(customer);else if(intent==='trend')showTrend(customer);else if(intent==='report')showReport(customer);else if(intent==='service')showService(customer);else taskForm(customer);return; }
    if(/查看更多任务/.test(text)){renderMoreTask();return;} if(/今日|待办/.test(text)){showBrief();return;} if(/逾期/.test(text)){renderTasks('overdue');return;} if(/任务列表|所有任务/.test(text)){renderTasks();return;}
    appendAI('我还需要更明确的信息','你可以查询客户档案、用药医嘱、报告指标，或用自然语言创建任务。当前演示使用固定规则和本地模拟数据，不会编造未识别的结果。');
  };
  const send = text => { appendUser(text); const wait=thinking(); setTimeout(()=>{wait.remove();route(text);},420); };
  const updateCaseReminderSummary = form => {
    const field=name=>form.querySelector(`[data-field="${name}"]`); const enabled=field('repeatEnabled')?.checked!==false;
    const settings=form.querySelector('[data-repeat-settings]'); if(settings)settings.hidden=!enabled;
    const date=new Date(field('time')?.value||''); const valid=!Number.isNaN(date.getTime());
    const dateText=valid?`${date.getMonth()+1}月${date.getDate()}日${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`:'所选时间';
    const interval=Math.max(1,Number(field('repeatInterval')?.value)||1),unit=field('repeatUnit')?.value||'天',count=Math.max(2,Number(field('repeatCount')?.value)||2);
    const copy=enabled?`${dateText}首次提醒，此后每隔${interval}${unit}提醒一次，共${count}次。`:`${dateText}提醒一次。`;
    const target=form.querySelector('[data-repeat-summary] span'); if(target)target.textContent=copy;
  };
  const confirmTask = form => {
    const get=name=>form.querySelector(`[data-field="${name}"]`)?.value.trim()||''; const time=get('time');
    if(form.classList.contains('case-reminder-form-card')){
      const customer=form.dataset.customer||store.currentCustomer?.name||'',name=get('content');
      if(!name||!time){toast('请填写提醒内容和提醒时间');return;}
      const repeatEnabled=form.querySelector('[data-field="repeatEnabled"]')?.checked!==false;
      const interval=Math.max(1,Number(get('repeatInterval'))||1),unit=get('repeatUnit')||'天',count=Math.max(2,Number(get('repeatCount'))||2);
      const values={customer,name,type:'个案提醒',time:time.replace('T',' '),assignee:'当前个案管理师',note:get('note'),repeat:repeatEnabled?`每${interval}${unit}，共${count}次`:'不重复',remind:'执行时提醒',repeatEnabled,repeatInterval:interval,repeatUnit:unit,repeatCount:count};
      const editId=form.dataset.editTask,existing=store.tasks.find(task=>task.id===editId);
      if(existing)Object.assign(existing,values);else store.tasks.unshift({id:`T${Date.now()}`,...values,status:'待提醒'}); save('aiStewardTasks',store.tasks);
      form.innerHTML=`<div class="case-reminder-success"><strong>提醒${existing?'修改':'创建'}成功</strong><p>${esc(name)}</p><small>${esc(values.time)} · ${esc(values.repeat)}</small></div>`; toast(`提醒${existing?'修改':'创建'}成功`); return;
    }
    if(!get('customer')||!get('name')||!time){toast('请补全客户、任务名称和执行时间');return;}
    const values={customer:get('customer'),name:get('name'),type:get('type'),time:time.replace('T',' '),assignee:get('assignee'),note:get('note'),repeat:get('repeat'),remind:get('remind')};
    const editId=form.dataset.editTask; const existing=store.tasks.find(t=>t.id===editId);
    if(existing)Object.assign(existing,values);else store.tasks.unshift({id:`T${Date.now()}`,...values,status:'待提醒'}); save('aiStewardTasks',store.tasks);
    form.innerHTML=`<h4>任务${existing?'修改':'创建'}成功</h4><p>${esc(get('name'))}</p><div class="ai-demo-note">已写入本地模拟任务列表，刷新页面后仍会保留。</div><div class="ai-card-actions" style="margin-top:12px">${action('进入任务详情','task-list','',true)}</div>`; toast(`任务${existing?'修改':'创建'}成功`);
  };
  const simulateExpert = (customer=customers[0]) => {
    appendAI(`${customer.name}专家建议分析`,'正在分析专家原文：“建议客户14天后跟进近期健康情况，30天后安排相关指标复查。”');
    setTimeout(()=>appendAI('发现2条后续提醒',`<section class="ai-business-card"><dl class="ai-detail-grid"><dt>报告名称</dt><dd>${esc(customer.report)}</dd><dt>报告日期</dt><dd>${esc(customer.lastCheck)}</dd><dt>相似提醒</dt><dd>未发现</dd></dl><div class="ai-task-list" data-proposals><div class="ai-proposal-row"><input value="14天后联系${esc(customer.name)}了解健康状况"><button data-ai-action="delete-proposal">移除</button></div><div class="ai-proposal-row"><input value="30天后提醒${esc(customer.name)}安排复查"><button data-ai-action="delete-proposal">移除</button></div></div><div class="ai-demo-note" style="margin-top:10px">只有人工确认后才会创建提醒；AI不会修改标准SKU模板，也不会补充原文中没有的诊疗决定。</div><div class="ai-card-actions" style="margin-top:12px"><button data-ai-action="expert-detail" data-customer="${esc(customer.name)}">查看原文</button><button class="primary" data-ai-action="confirm-proposals" data-customer="${esc(customer.name)}">确认创建</button></div></section>`),500);
  };
  const questionFromConversation = conversation => {
    if(conversation.question?.trim())return conversation.question.trim();
    const template=document.createElement('template'); template.innerHTML=conversation.html||'';
    return template.content.querySelector('.global-chat-row.user .workbench-message, .workbench-message.user')?.textContent?.trim()||'';
  };
  const firstQuestion = conversation => questionFromConversation(conversation)||conversation.title||'未命名对话';
  const conversationDate = conversation => {
    const timestamp=Number(conversation.createdAt||conversation.id);
    if(Number.isFinite(timestamp)&&timestamp>0)return new Date(timestamp);
    const parsed=new Date(String(conversation.time||'').replace(/\//g,'-'));
    return Number.isNaN(parsed.getTime())?new Date(0):parsed;
  };
  const startOfDay = date => new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const conversationBucket = conversation => {
    const date=conversationDate(conversation); if(!date.getTime())return false;
    const now=new Date(), day=Math.floor((startOfDay(now)-startOfDay(date))/86400000);
    if(day===0)return 'today';
    if(day===1)return 'yesterday';
    if(day>=2&&day<=3)return 'days-3';
    if(day>=4&&day<=7)return 'days-7';
    if(day>=8&&day<=30)return 'days-30';
    if(date.getFullYear()===2026)return 'year-2026';
    if(date.getFullYear()===2025)return 'year-2025';
    return '';
  };
  const formatConversationTime = conversation => {
    const date=conversationDate(conversation), now=new Date();
    const pad=value=>String(value).padStart(2,'0');
    if(startOfDay(date).getTime()===startOfDay(now).getTime())return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${date.getFullYear()}/${pad(date.getMonth()+1)}/${pad(date.getDate())}`;
  };
  const historyGroups = [
    ['today','今天'],['yesterday','昨天'],['days-3','最近3天'],['days-7','最近7天'],['days-30','最近30天'],['year-2026','2026年'],['year-2025','2025年']
  ];
  const relativeHistoryDate = (days,hour,minute=0) => { const date=new Date(); date.setDate(date.getDate()-days); date.setHours(hour,minute,0,0); return date.getTime(); };
  const fixedHistoryDate = (year,month,day,hour,minute=0) => new Date(year,month-1,day,hour,minute,0,0).getTime();
  const demoHistoryItem = (id,createdAt,question,answer) => ({
    id,createdAt,question,title:question,time:new Date(createdAt).toISOString(),
    html:`<div class="global-chat-row user"><div class="workbench-message user live-message">${esc(question)}</div><span class="global-chat-user-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg></span></div><div class="global-chat-row ai">${avatar()}<div class="ai-rich-message"><div class="workbench-message ai live-message"><strong>查询结果</strong><div>${esc(answer)}</div></div></div></div>`
  });
  const demoHistoryConversations = () => [
    demoHistoryItem(-101,relativeHistoryDate(0,15,28),'今天有哪些客户提醒需要处理？','今天共有12项客户提醒，建议优先处理临近执行时间的服务事项。'),
    demoHistoryItem(-102,relativeHistoryDate(0,11,6),'哪些客户的健康档案还需要补充？','当前共有7位客户的健康档案待补充。'),
    demoHistoryItem(-103,relativeHistoryDate(0,9,18),'汇总今天需要出具的健康评估报告','今天共有5份客户健康评估报告待生成。'),
    demoHistoryItem(-111,relativeHistoryDate(1,16,42),'昨天完成了多少位客户的服务？','昨天共有16位客户完成服务路径。'),
    demoHistoryItem(-112,relativeHistoryDate(1,10,15),'查看昨天新增的客户档案','昨天新增4位客户档案。'),
    demoHistoryItem(-121,relativeHistoryDate(2,14,35),'张三最近的血糖指标是多少？','已找到张三最近三次空腹血糖记录。'),
    demoHistoryItem(-122,relativeHistoryDate(3,9,50),'李四的复查提醒安排在什么时候？','李四的复查提醒已安排在下午14:30。'),
    demoHistoryItem(-131,relativeHistoryDate(5,13,20),'查询王五的健康档案补充进度','王五的近期检查资料仍需补充。'),
    demoHistoryItem(-132,relativeHistoryDate(7,10,5),'最近有哪些报告等待专家解读？','已汇总待专家解读的检查报告清单。'),
    demoHistoryItem(-141,relativeHistoryDate(12,17,12),'汇总本月的客户提醒完成情况','本月客户提醒整体完成情况稳定。'),
    demoHistoryItem(-142,relativeHistoryDate(24,8,46),'查看陈晨最近一次用药医嘱','已找到陈晨最近一次门诊用药记录。'),
    demoHistoryItem(-151,fixedHistoryDate(2026,6,22,14,10),'查看2026年上半年在管客户变化','已汇总2026年上半年在管客户变化情况。'),
    demoHistoryItem(-152,fixedHistoryDate(2026,3,6,10,26),'查询一季度服务完成客户数量','已汇总2026年第一季度服务完成客户数量。'),
    demoHistoryItem(-153,fixedHistoryDate(2026,1,18,16,8),'查看年度健康服务计划','已找到2026年度健康服务计划。'),
    demoHistoryItem(-161,fixedHistoryDate(2025,11,12,11,34),'查看2025年客户服务总结','已汇总2025年度客户服务情况。'),
    demoHistoryItem(-162,fixedHistoryDate(2025,7,21,15,16),'查询2025年重点客户随访记录','已找到2025年重点客户随访记录。'),
    demoHistoryItem(-163,fixedHistoryDate(2025,2,14,9,42),'查看2025年健康评估报告归档','已找到2025年健康评估报告归档记录。')
  ];
  const allHistoryConversations = () => [...store.conversations.filter(questionFromConversation),...demoHistoryConversations()].sort((a,b)=>conversationDate(b)-conversationDate(a));
  const renderHistoryPanel = panel => {
    const conversations=allHistoryConversations();
    const groups=historyGroups.map(([key,label])=>[key,label,conversations.filter(item=>conversationBucket(item)===key)]);
    panel.innerHTML=`<div class="ai-history-head"><strong>历史对话</strong></div><div class="ai-history-list ai-history-timeline">${groups.map(([key,label,items])=>`<section class="ai-history-group" data-history-group="${key}"><div class="ai-history-timepoint"><i aria-hidden="true"></i><strong>${label}</strong><small>${items.length}条</small></div><div class="ai-history-group-items">${items.map(c=>`<button class="ai-history-item" data-ai-history-open="${c.id}" title="${esc(firstQuestion(c))}"><strong>${esc(firstQuestion(c))}</strong><small>${esc(formatConversationTime(c))}</small></button>`).join('')}</div></section>`).join('')}</div>`;
  };
  const saveConversation = () => { const host=body(); if(!host||!host.children.length)return; const question=host.querySelector('.global-chat-row.user .workbench-message, .workbench-message.user')?.textContent?.trim()||''; if(!question)return; const createdAt=Date.now(); store.conversations.unshift({id:createdAt,createdAt,question,title:question,time:new Date(createdAt).toISOString(),html:host.innerHTML}); store.conversations=store.conversations.slice(0,100); save('aiStewardConversations',store.conversations); };
  const showHistory = () => { let panel=document.querySelector('.ai-history-panel'); if(!panel){panel=document.createElement('section');panel.className='ai-history-panel';document.getElementById('globalAiPanel')?.append(panel);} panel.hidden=false; renderHistoryPanel(panel); };
  const closeHistory = () => document.querySelector('.ai-history-panel')?.remove();
  const handleAction = target => {
    const type=target.dataset.aiAction, customer=customers.find(c=>c.id===target.dataset.customerId)||customers.find(c=>c.name===target.dataset.customer)||store.currentCustomer||customers[0];
    if(type==='pending-reports'){showPendingReports();return;}
    if(type==='incomplete-archives'){showIncompleteArchives();return;}
    if(type==='recent-customers'){appendAI('最近新增客户','近7天新增客户5人：陈晨、赵六、李敏、周宁、刘芳。',action('查看客户档案','profile','陈晨',true));return;}
    if(type==='profile'||type==='profile-detail')showProfile(customer); else if(type==='report')showReport(customer); else if(type==='report-detail')openReportArchive(customer); else if(type==='trend')showTrend(customer); else if(type==='service'||type==='service-detail')showService(customer); else if(type==='task-form')taskForm(customer); else if(type==='more-task')send('查看更多任务'); else if(type==='task-list'||type==='list-today')renderTasks('today'); else if(type==='list-overdue')renderTasks('overdue'); else if(type==='suggestions')appendAI('待确认建议','发现2项尚未转为任务的专家建议。你可以模拟报告回传并确认生成任务。',action('模拟专家报告回传','simulate-expert','',true)); else if(type==='expert-detail')appendAI(`${customer.name}专家建议原文`,'“建议客户14天后跟进近期健康情况，30天后安排相关指标复查。”',action('创建提醒','task-form',customer.name,true)); else if(type==='original-order')appendAI('原始医嘱详情',`<section class="ai-business-card"><h4>${customer.name} · 门诊处方</h4><p>记录日期：${customer.lastCheck}</p><p>来源：模拟门诊处方影像录入</p><div class="ai-demo-note">该内容仅用于原型演示，不构成医疗建议。</div></section>`); else if(type==='simulate-expert')simulateExpert(customer); else if(type==='cancel-card')target.closest('.global-chat-row')?.remove(); else if(type==='confirm-task')confirmTask(document.getElementById(target.dataset.form)); else if(type==='delete-proposal')target.closest('.ai-proposal-row')?.remove(); else if(type==='confirm-proposals'){ const inputs=[...target.closest('.ai-business-card').querySelectorAll('[data-proposals] input')]; inputs.forEach((input,i)=>store.tasks.unshift({id:`TP${Date.now()}${i}`,customer:customer.name,name:input.value,type:'专家建议跟进',time:i?tomorrow(15):tomorrow(10),assignee:'张老师（当前）',note:'由专家建议生成，经主理人确认',status:'待提醒'})); save('aiStewardTasks',store.tasks); target.closest('.ai-business-card').innerHTML='<h4>提醒创建成功</h4><p>已加入该客户的统一提醒时间轴，可继续查看或标记完成。</p>';toast('建议提醒创建成功'); }
    else if(type==='complete-task'){ const task=store.tasks.find(t=>t.id===target.dataset.task);if(!task)return;if(task.status==='已完成'){toast('已完成的提醒不能修改');return;}task.status='已完成';save('aiStewardTasks',store.tasks);target.closest('.global-chat-row')?.remove();renderTasks();toast('提醒已完成，状态已锁定'); }
    else if(type==='edit-task'){const task=store.tasks.find(t=>t.id===target.dataset.task);const c=customers.find(x=>x.name===task?.customer)||customer;if(task)taskForm(c,{id:task.id,name:task.name,time:task.time,note:task.note});}
    else if(type==='choose-customer'){store.currentCustomer=customer;target.closest('.global-chat-row')?.remove();const intent=store.pendingIntent;store.pendingIntent='';if(['medical-order','blood-pressure','blood-sugar','medication-list','abnormal'].includes(intent))runPatientQuickQuery(intent,customer);else if(intent==='medication')showMedication(customer);else if(intent==='trend')showTrend(customer);else if(intent==='report')showReport(customer);else showProfile(customer);}
  };
  const init = () => {
    const panel=document.getElementById('globalAiPanel'); if(!panel)return;
    const assistant=document.getElementById('globalAiAssistant'), toggle=assistant?.querySelector('[data-global-ai-toggle]'), close=panel.querySelector('[data-global-ai-close]');
    const modelSelect=document.getElementById('workbenchModelSelect'), modelLabels={smart:'智能模型',medical:'医学模型',general:'通用模型'};
    const savedModel=read('aiStewardModel','smart'); if(modelSelect&&modelLabels[savedModel])modelSelect.value=savedModel;
    modelSelect?.addEventListener('change',()=>{save('aiStewardModel',modelSelect.value);toast(`已切换至${modelLabels[modelSelect.value]}`);});
    const setOpen=open=>{panel.hidden=!open;assistant?.classList.toggle('open',open);toggle?.setAttribute('aria-expanded',String(open));toggle?.setAttribute('aria-label',open?`收起${assistantName()}`:`打开${assistantName()}`);if(open)setTimeout(()=>document.getElementById('workbenchChatInput')?.focus(),60);};
    let activePageId=document.querySelector('.page.active')?.id||'';
    const collapseForPageChange=()=>{
      const nextPageId=document.querySelector('.page.active')?.id||'';
      if(nextPageId===activePageId)return;
      activePageId=nextPageId;
      setOpen(false);
    };
    const pageObserver=new MutationObserver(records=>{
      if(records.some(record=>record.type==='attributes'&&record.attributeName==='class'))queueMicrotask(collapseForPageChange);
    });
    document.querySelectorAll('.page').forEach(page=>pageObserver.observe(page,{attributes:true,attributeFilter:['class']}));
    window.addEventListener('applicationViewChange',()=>setOpen(false));
    window.addEventListener('hashchange',()=>setOpen(false));
    window.addEventListener('popstate',()=>setOpen(false));
    setOpen(false);
    document.addEventListener('click',event=>{const trigger=event.target.closest('[data-global-ai-toggle]');if(!trigger)return;event.preventDefault();event.stopImmediatePropagation();const opening=panel.hidden;if(opening){const patient=activePatientScope();if(patient){store.mode='case-manager';store.currentCustomer=patient;setCaseManagerChrome(true);renderCaseManagerHome(patient);}else{store.mode='steward';store.currentCustomer=null;setCaseManagerChrome(false);renderBrief();}}setOpen(opening);},true);
    close?.addEventListener('click',event=>{event.stopPropagation();setOpen(false);toggle?.focus();});
    renderBrief(); window.aiStewardSend=send;
    panel.addEventListener('click',event=>{
      const archiveEntry=event.target.closest('[data-ai-open-archive]');if(archiveEntry){window.openPatientArchiveFromAssistant?.({name:archiveEntry.dataset.customer,gender:archiveEntry.dataset.gender,age:archiveEntry.dataset.age,tab:archiveEntry.dataset.aiArchiveTab});return;}
      const patientReminderCheck=event.target.closest('[data-ai-patient-reminder-check]');if(patientReminderCheck){toggleReminderSelection(patientReminderCheck);return;}
      const contactCheck=event.target.closest('[data-ai-contact-check]');if(contactCheck){toggleReminderSelection(contactCheck);return;}
      const batchConfirm=event.target.closest('[data-ai-confirm-reminders]');if(batchConfirm){const scope=batchConfirm.closest('.ai-home-priority,.ai-query-card,.case-reminder-answer'),selected=[...(scope?.querySelectorAll('.ai-reminder-check.is-selected,.ai-query-check.is-selected')||[])];if(!selected.length)return;selected.forEach(check=>{if(batchConfirm.dataset.aiConfirmReminders==='home')completeReminder(check);else if(batchConfirm.dataset.aiConfirmReminders==='contact')completeContactReminder(check);else completePatientReminder(check);});updateBatchAction(scope);toast(`已统一完成 ${selected.length} 项提醒，状态已锁定`);return;}
      const queryToggle=event.target.closest('[data-ai-query-toggle]');if(queryToggle){const expanded=queryToggle.dataset.expanded==='true',card=queryToggle.closest('.ai-query-card'),list=card?.querySelector('.ai-query-list'),label=queryToggle.querySelector('span'),arrow=queryToggle.querySelector('b');card?.querySelectorAll('.ai-query-extra').forEach(row=>row.hidden=expanded);queryToggle.dataset.expanded=String(!expanded);queryToggle.setAttribute('aria-expanded',String(!expanded));if(label)label.textContent=expanded?queryToggle.dataset.label:'收起';else queryToggle.textContent=expanded?queryToggle.dataset.label:'收起';if(arrow)arrow.textContent=expanded?'⌄':'⌃';list?.classList.toggle('expanded',!expanded);if(expanded&&list)list.scrollTop=0;return;}
      const generateAll=event.target.closest('[data-ai-generate-all]');if(generateAll){generateAll.closest('.ai-query-card')?.querySelectorAll('.ai-query-status').forEach(status=>{status.textContent='已生成';status.className='ai-query-status blue';});generateAll.textContent='已生成';generateAll.disabled=true;toast('报告生成任务已提交');return;}
      const generateReport=event.target.closest('[data-ai-generate-report]');if(generateReport){const row=generateReport.closest('tr');const status=row?.querySelector('.ai-list-status');if(status)status.textContent='已生成';generateReport.textContent='已生成';generateReport.disabled=true;toast(`${generateReport.dataset.customer}的报告已生成`);return;}
      const priorityToggle=event.target.closest('[data-ai-priority-toggle]');if(priorityToggle){const expanded=priorityToggle.getAttribute('aria-expanded')==='true',section=priorityToggle.closest('.ai-home-priority'),list=section?.querySelector('.ai-home-priority-list');priorityToggle.setAttribute('aria-expanded',String(!expanded));priorityToggle.querySelector('span').textContent=expanded?'查看更多':'收起';section?.querySelectorAll('.ai-home-priority-row.is-extra').forEach(row=>row.hidden=expanded);list?.classList.toggle('expanded',!expanded);if(expanded&&list)list.scrollTop=0;return;}
      const reminderCheck=event.target.closest('[data-ai-reminder-check]'); if(reminderCheck){toggleReminderSelection(reminderCheck);return;}
      const queryTag=event.target.closest('[data-ai-query-tag]');if(queryTag){startPatientQuickQuery(queryTag.dataset.aiQueryTag,queryTag.textContent.trim());return;}
      const actionTarget=event.target.closest('[data-ai-action]');if(actionTarget){handleAction(actionTarget);return;}
      if(event.target.closest('[data-ai-new]')){saveConversation();closeHistory();store.pendingIntent='';if(store.mode==='case-manager')renderCaseManagerHome();else{resetPriorityExamples();store.currentCustomer=null;renderBrief();}document.getElementById('workbenchChatInput')?.focus();toast('已新建会话，已载入今日待处理事项');return;}
      if(event.target.closest('[data-ai-history]')){showHistory();return;}
      const history=event.target.closest('[data-ai-history-open]');if(history){const item=allHistoryConversations().find(c=>c.id===Number(history.dataset.aiHistoryOpen));if(item){body().innerHTML=item.html;history.closest('.ai-history-panel').hidden=true;scrollEnd();}}
    });
    const syncReminderForm=event=>{const field=event.target.closest('.case-reminder-form [data-field]');if(field)updateCaseReminderSummary(field.closest('.case-reminder-form-card'));};
    panel.addEventListener('input',syncReminderForm);
    panel.addEventListener('change',syncReminderForm);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
