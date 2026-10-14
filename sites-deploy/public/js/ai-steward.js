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
    currentCustomer: null,
    pendingIntent: '',
    conversations: read('aiStewardConversations', []),
    reminders: read('aiServiceReminders', [
      {id:'R001',taskId:'T001',customer:'张三',title:'完成基因检测报告解读跟进',time:'10:00',description:'确认专家解读安排，并向客户同步报告处理进度。',detail:'report',completed:false},
      {id:'R002',taskId:'T002',customer:'李四',title:'联系客户确认复查安排',time:'14:30',description:'根据专家建议，与客户确认7天后复查时间。',detail:'expert-detail',completed:false},
      {id:'R003',taskId:'T003',customer:'王五',title:'跟进健康档案资料补充',time:'16:00',description:'联系客户补充近期检查资料，完善健康档案。',detail:'profile',completed:false}
    ]),
    tasks: read('aiStewardTasks', [
      {id:'T001',customer:'张三',name:'安排专家解读',type:'报告跟进',time:'2026-10-14 10:00',assignee:'张老师（当前）',note:'联系专家完成基因检测报告解读',status:'待处理',overdue:true},
      {id:'T002',customer:'李四',name:'健康服务复查',type:'复诊提醒',time:'2026-10-14 14:30',assignee:'张老师（当前）',note:'根据专家建议安排7天复查',status:'待处理'},
      {id:'T003',customer:'王五',name:'确认用药情况',type:'用药随访',time:'2026-10-14 16:00',assignee:'张老师（当前）',note:'电话确认今日用药情况',status:'待处理'}
    ])
  };
  let historyRange = 'today';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const body = () => document.getElementById('workbenchChatBody');
  const assistantName = () => window.getGlobalAssistantName?.() || 'AI智能主理人';
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
    row.innerHTML=`${avatar()}<div class="ai-rich-message"><div class="workbench-message ai live-message"><strong>${esc(title)}</strong><div>${html}</div></div>${actions?`<div class="ai-card-actions">${actions}</div>`:''}</div>`;
    body()?.append(row); scrollEnd(); return row;
  };
  const action = (label, type, customer='', primary=false) => `<button type="button" class="${primary?'primary':''}" data-ai-action="${type}" ${customer?`data-customer="${esc(customer)}"`:''}>${label}</button>`;
  const todayText = () => new Date().toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'short'});
  const tomorrow = (hour=15) => { const d=new Date(); d.setDate(d.getDate()+1); d.setHours(hour,0,0,0); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:00`; };
  const currentPending = () => store.tasks.filter(t => t.status === '待处理');
  const renderBrief = () => {
    const host=body(); if(!host)return;
    const todayAdded=store.tasks.filter(t=>t.status==='待处理' && /^T\d{10,}$/.test(t.id) && t.time.startsWith(new Date().toISOString().slice(0,10))).length;
    const completedReminders=store.reminders.filter(item=>item.completed).length;
    const reminderCards=store.reminders.map(item=>`<article class="ai-brief-item ai-service-reminder ${item.completed?'completed':''}" data-reminder-row="${esc(item.id)}"><button type="button" class="ai-reminder-check ${item.completed?'checked':''}" data-ai-reminder-check="${esc(item.id)}" aria-pressed="${item.completed}" aria-label="${item.completed?'取消完成':'标记完成'}：${esc(item.title)}"><span>✓</span></button><div class="ai-reminder-content"><div class="ai-brief-item-head"><strong>${esc(item.customer)}｜${esc(item.title)}</strong><time>${esc(item.time)}</time></div><p>${esc(item.description)}</p><div class="ai-card-actions">${action(item.detail==='profile'?'查看档案':item.detail==='report'?'查看报告':'查看服务计划',item.detail,item.customer)}</div></div></article>`).join('');
    host.innerHTML=`<div class="ai-steward-brief">
      <section class="ai-steward-welcome"><h3>上午好，我是你的${esc(assistantName())} 👋</h3><p>今天有一些客户服务事项需要你关注。以下数据来自本地模拟业务数据，用于交互演示。</p></section>
      <div class="ai-brief-stats"><button class="ai-brief-stat" data-ai-action="list-today"><span>今日待办</span><strong data-ai-today-count>${Math.max(0,12+todayAdded-completedReminders)}</strong></button><button class="ai-brief-stat danger" data-ai-action="list-overdue"><span>逾期任务</span><strong>3</strong></button><button class="ai-brief-stat" data-ai-action="suggestions"><span>待处理建议</span><strong>2</strong></button></div>
      <div><div class="ai-brief-section-title"><span>今日服务提醒</span><small>完成后直接勾选 · ${esc(todayText())}</small></div>${reminderCards}</div>
      <div class="ai-card-actions">${action('查看全部任务','task-list','',true)}${action('模拟专家报告回传','simulate-expert')}</div>
    </div>`;
    scrollEnd();
  };
  const toggleReminder = target => {
    const item=store.reminders.find(reminder=>reminder.id===target.dataset.aiReminderCheck); if(!item)return;
    item.completed=!item.completed; save('aiServiceReminders',store.reminders);
    const task=store.tasks.find(current=>current.id===item.taskId); if(task){task.status=item.completed?'已完成':'待处理';save('aiStewardTasks',store.tasks);}
    const row=target.closest('[data-reminder-row]'); row?.classList.toggle('completed',item.completed); target.classList.toggle('checked',item.completed); target.setAttribute('aria-pressed',String(item.completed)); target.setAttribute('aria-label',`${item.completed?'取消完成':'标记完成'}：${item.title}`);
    const todayAdded=store.tasks.filter(current=>current.status==='待处理'&&/^T\d{10,}$/.test(current.id)&&current.time.startsWith(new Date().toISOString().slice(0,10))).length;
    const count=document.querySelector('[data-ai-today-count]'); if(count)count.textContent=String(Math.max(0,12+todayAdded-store.reminders.filter(reminder=>reminder.completed).length));
    toast(item.completed?'服务任务已完成':'已恢复为待处理');
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
    return customers.find(c=>c.name===name)||{id:`PAGE-${name}`,name,gender:value('gender')||'待补充',age:Number((value('age')||'0').replace(/\D/g,''))||'待补充',phone:value('phone')||'待补充',diseases:'请在患者健康档案中查看',allergy:'请在患者健康档案中查看',lastCheck:'暂无相关记录',summary:'当前为患者专属权限，仅可查询或新增这位患者的任务。',sku:'暂无相关记录',meds:[],glucose:[],report:'暂无相关记录'};
  };
  const profileCard = customer => `<section class="ai-business-card"><div class="ai-profile-head"><span class="ai-profile-avatar">${esc(customer.name.slice(-1))}</span><div><strong>${esc(customer.name)}</strong><small>${customer.gender} · ${customer.age}岁 · ${esc(customer.phone)}</small></div></div><dl class="ai-detail-grid"><dt>既往疾病</dt><dd>${esc(customer.diseases||'暂无相关记录')}</dd><dt>过敏史</dt><dd>${esc(customer.allergy||'暂无相关记录')}</dd><dt>最近检查</dt><dd>${esc(customer.lastCheck)}</dd><dt>服务SKU</dt><dd>${esc(customer.sku)}</dd><dt>档案摘要</dt><dd>${esc(customer.summary)}</dd></dl></section>`;
  const showProfile = customer => appendAI('客户健康档案',profileCard(customer),action('查看完整档案','profile-detail',customer.name)+action('查询检查报告','report',customer.name)+action('创建跟进任务','task-form',customer.name,true));
  const showMedication = customer => {
    const rows=customer.meds.length?customer.meds.map(m=>`<tr><td>${esc(m[0])}</td><td>${esc(m[1])}</td><td>${esc(m[2])}</td></tr>`).join(''):'<tr><td colspan="3">暂无相关记录</td></tr>';
    appendAI(`${customer.name}最近一次用药医嘱`,`<section class="ai-business-card"><h4>门诊处方 · ${esc(customer.lastCheck)}</h4><table class="ai-med-table"><thead><tr><th>药品名称</th><th>剂量</th><th>频率</th></tr></thead><tbody>${rows}</tbody></table><p class="ai-source-note">来源：模拟门诊处方。历史医嘱不代表当前正在用药，AI不会调整剂量、频率或疗程。</p></section>`,action('查看原始医嘱','original-order',customer.name)+action('创建用药跟进任务','task-form',customer.name,true));
  };
  const showReport = customer => appendAI(`${customer.name}最近检查报告`,`<section class="ai-business-card"><h4>${esc(customer.report)}</h4><dl class="ai-detail-grid"><dt>报告类型</dt><dd>检查检验报告</dd><dt>检查日期</dt><dd>${esc(customer.lastCheck)}</dd><dt>上传日期</dt><dd>${esc(customer.lastCheck)} 16:20</dd><dt>上传来源</dt><dd>主理人手动上传（模拟）</dd><dt>报告摘要</dt><dd>${esc(customer.summary)}</dd></dl></section>`,action('查看报告详情','report-detail',customer.name)+action('查看指标','trend',customer.name,true));
  const showTrend = customer => {
    if(!customer.glucose?.length){appendAI(`${customer.name}健康指标`,'暂无相关记录。当前患者档案中尚未录入可用于趋势分析的历史指标数据。');return;}
    const id=`aiTrend${Date.now()}`; const rows=customer.glucose.slice().reverse().map(v=>`<tr><td>${v[0]}</td><td>${v[1]}</td><td>3.9–6.1</td></tr>`).join('');
    appendAI(`${customer.name}空腹血糖趋势`,`<section class="ai-business-card"><h4>最近3次空腹血糖 <small>单位：mmol/L</small></h4><div class="ai-trend-chart" id="${id}" role="img" aria-label="${esc(customer.name)}最近三次空腹血糖折线图"></div><table class="ai-trend-table"><thead><tr><th>检查日期</th><th>结果</th><th>参考范围</th></tr></thead><tbody>${rows}</tbody></table><div class="ai-analysis">AI分析：${customer.glucose[2][1]>6.1?'指标仍高于参考范围，建议结合既往病史按计划复查。':'近期结果处于参考范围，建议继续保持健康管理计划。'}</div></section>`,action('查看原始报告','report-detail',customer.name)+action('创建复查提醒','task-form',customer.name,true));
    setTimeout(()=>{ const el=document.getElementById(id); if(!el||!window.echarts)return; const chart=window.echarts.init(el); chart.setOption({animationDuration:500,tooltip:{trigger:'axis'},grid:{left:36,right:14,top:18,bottom:28},xAxis:{type:'category',data:customer.glucose.map(v=>v[0].slice(5)),axisLabel:{fontSize:10}},yAxis:{type:'value',min:3,max:10,axisLabel:{fontSize:10}},series:[{type:'line',smooth:true,data:customer.glucose.map(v=>v[1]),symbolSize:7,lineStyle:{color:'#1677ff',width:3},itemStyle:{color:'#1677ff'},areaStyle:{color:'rgba(22,119,255,.08)'},markLine:{silent:true,symbol:'none',data:[{yAxis:6.1}],lineStyle:{color:'#ff7875',type:'dashed'}}}]}); },30);
  };
  const taskForm = (customer, preset={}) => {
    const id=`taskForm${Date.now()}`; const name=preset.name||`联系${customer.name}安排复查`; const time=preset.time||tomorrow(15);
    appendAI(preset.id?'修改任务':'已解析任务信息，请确认',`<section class="ai-business-card" id="${id}" data-edit-task="${esc(preset.id||'')}"><div class="ai-task-form"><label>客户<input data-field="customer" value="${esc(customer.name)}"></label><label>任务名称<input data-field="name" value="${esc(name)}"></label><label>任务类型<select data-field="type"><option>复诊提醒</option><option>报告跟进</option><option>用药随访</option><option>健康关怀</option></select></label><label>执行时间<input data-field="time" type="datetime-local" value="${esc(time.replace(' ','T'))}"></label><label>提醒时间<select data-field="remind"><option>执行时提醒</option><option>提前1小时</option><option>提前1天</option></select></label><label>重复周期<select data-field="repeat"><option>不重复</option><option>每周</option><option>每月</option></select></label><label>执行人员<select data-field="assignee"><option>张老师（当前）</option><option>李老师</option></select></label><label class="full">任务说明<textarea data-field="note">${esc(preset.note||'联系客户确认复查安排')}</textarea></label></div><div class="ai-card-actions" style="margin-top:12px"><button data-ai-action="cancel-card">取消</button><button class="primary" data-ai-action="confirm-task" data-form="${id}">${preset.id?'确认修改':'确认创建'}</button></div></section>`);
  };
  const renderTasks = (filter='all') => {
    const list=store.tasks.filter(t=>filter==='overdue'?t.overdue&&t.status==='待处理':filter==='today'?t.status==='待处理':true);
    const rows=list.length?list.map(t=>`<article class="ai-task-row" data-task-id="${esc(t.id)}"><div class="ai-task-row-head"><span>${esc(t.customer)} · ${esc(t.name)}</span><em class="ai-task-status ${t.status==='已完成'?'done':t.status==='已取消'?'cancelled':''}">${esc(t.status)}</em></div><p>${esc(t.time)} · ${esc(t.type)} · ${esc(t.assignee)}</p><div class="ai-card-actions">${t.status==='待处理'?`<button data-ai-action="complete-task" data-task="${esc(t.id)}">标记完成</button><button data-ai-action="edit-task" data-task="${esc(t.id)}">修改</button><button class="danger" data-ai-action="cancel-task" data-task="${esc(t.id)}">取消任务</button>`:''}</div></article>`).join(''):'<p>暂无相关任务</p>';
    appendAI(filter==='overdue'?'逾期任务':'任务列表',`<section class="ai-business-card"><div class="ai-task-list">${rows}</div></section>`);
  };
  const thinking = () => { const row=appendAI('正在查询','<span class="ai-thinking">正在分析本地模拟数据 <i></i><i></i><i></i></span>'); row.dataset.thinking='true'; return row; };
  const route = text => {
    const scopedPatient=activePatientScope();
    if(scopedPatient && (/(全局|全部客户|所有客户|机构|运营)/.test(text) || customers.some(c=>c.name!==scopedPatient.name&&text.includes(c.name)))){
      appendAI('患者权限限制',`当前处于${esc(scopedPatient.name)}患者档案，仅可查询这位患者的数据，或查看、新增这位患者的任务。退出患者档案后可恢复全局查询。`);return;
    }
    const match=findCustomer(text);
    if(Array.isArray(match)){appendAI('查询到同名客户，请选择',`<div class="ai-customer-picker">${match.map(c=>`<button class="ai-customer-choice" data-ai-action="choose-customer" data-customer-id="${esc(c.id)}">${esc(c.name)} · ${esc(c.phone)} · ${esc(c.diseases)}</button>`).join('')}</div>`);return;}
    let customer=scopedPatient||match||store.currentCustomer;
    if(scopedPatient)store.currentCustomer=scopedPatient;
    if(store.pendingIntent && !customer){ const byName=customers.find(c=>text.trim()===c.name); if(byName){customer=byName;store.currentCustomer=byName;} }
    if(/档案|既往疾病|过敏史|健康异常/.test(text)){ if(!customer){store.pendingIntent='profile';appendAI('查询客户档案','请告诉我需要查询哪位客户的健康档案？');return;} store.pendingIntent='';showProfile(customer);return; }
    if(/用药|医嘱|吃什么药/.test(text)){ if(!customer){store.pendingIntent='medication';appendAI('查询医嘱与用药','请告诉我需要查询哪位客户的医嘱记录？');return;} store.pendingIntent='';showMedication(customer);return; }
    if(/血糖|尿酸|指标|变化|趋势/.test(text)){ if(!customer){store.pendingIntent='trend';appendAI('查询健康指标','请告诉我需要查询哪位客户及哪项指标？');return;} store.pendingIntent='';showTrend(customer);return; }
    if(/报告|体检/.test(text)){ if(!customer){store.pendingIntent='report';appendAI('查询报告','请告诉我需要查询哪位客户的报告？');return;} store.pendingIntent='';showReport(customer);return; }
    if(/提醒|创建任务|新增任务|定任务|联系.*复查|每周|每个月|下周/.test(text)){
      if(!customer){store.pendingIntent='task';appendAI('创建任务','请先告诉我任务关联哪位客户？');return;}
      if(!/(明天|后天|下周|每周|每个月|\d{1,2}[点号]|\d{1,2}:\d{2})/.test(text)){store.pendingIntent='task-time';appendAI('还需要任务时间',`已识别客户为${esc(customer.name)}，请补充明确的执行时间，例如“明天下午3点”。`);return;}
      const hour=/下午\s*(\d{1,2})/.test(text)?Number(RegExp.$1)+12:/上午\s*(\d{1,2})/.test(text)?Number(RegExp.$1):15;
      taskForm(customer,{time:tomorrow(Math.min(hour,23)),name:`联系${customer.name}安排复查`}); store.pendingIntent='';return;
    }
    if(store.pendingIntent && customer){ const intent=store.pendingIntent;store.pendingIntent=''; if(intent==='profile')showProfile(customer);else if(intent==='medication')showMedication(customer);else if(intent==='trend')showTrend(customer);else if(intent==='report')showReport(customer);else taskForm(customer);return; }
    if(/今日|待办/.test(text)){renderTasks('today');return;} if(/逾期/.test(text)){renderTasks('overdue');return;} if(/任务列表|所有任务/.test(text)){renderTasks();return;}
    appendAI('我还需要更明确的信息','你可以查询客户档案、用药医嘱、报告指标，或用自然语言创建任务。当前演示使用固定规则和本地模拟数据，不会编造未识别的结果。');
  };
  const send = text => { appendUser(text); const wait=thinking(); setTimeout(()=>{wait.remove();route(text);},420); };
  const confirmTask = form => {
    const get=name=>form.querySelector(`[data-field="${name}"]`)?.value.trim()||''; const time=get('time');
    if(!get('customer')||!get('name')||!time){toast('请补全客户、任务名称和执行时间');return;}
    const values={customer:get('customer'),name:get('name'),type:get('type'),time:time.replace('T',' '),assignee:get('assignee'),note:get('note'),repeat:get('repeat'),remind:get('remind')};
    const editId=form.dataset.editTask; const existing=store.tasks.find(t=>t.id===editId);
    if(existing)Object.assign(existing,values);else store.tasks.unshift({id:`T${Date.now()}`,...values,status:'待处理'}); save('aiStewardTasks',store.tasks);
    form.innerHTML=`<h4>任务${existing?'修改':'创建'}成功</h4><p>${esc(get('name'))}</p><div class="ai-demo-note">已写入本地模拟任务列表，刷新页面后仍会保留。</div><div class="ai-card-actions" style="margin-top:12px">${action('进入任务详情','task-list','',true)}</div>`; toast(`任务${existing?'修改':'创建'}成功`);
  };
  const simulateExpert = () => {
    appendAI('专家报告上传成功','正在分析专家建议：“建议客户30天后进行复查，并在14天后了解近期健康状况。”');
    setTimeout(()=>appendAI('发现新的专家建议',`<section class="ai-business-card"><p>建议创建2项后续服务任务，创建前可修改或删除：</p><div class="ai-task-list" data-proposals><div class="ai-proposal-row"><input value="14天后联系张三了解健康状况"><button data-ai-action="delete-proposal">删除</button></div><div class="ai-proposal-row"><input value="30天后提醒张三安排复查"><button data-ai-action="delete-proposal">删除</button></div></div><div class="ai-demo-note" style="margin-top:10px">AI不会修改标准SKU服务路径，也不会未经确认新增任务。</div><div class="ai-card-actions" style="margin-top:12px"><button data-ai-action="expert-detail" data-customer="张三">查看建议</button><button class="primary" data-ai-action="confirm-proposals">生成任务</button></div></section>`),500);
  };
  const firstQuestion = conversation => {
    if(conversation.question?.trim())return conversation.question.trim();
    const template=document.createElement('template'); template.innerHTML=conversation.html||'';
    return template.content.querySelector('.global-chat-row.user .workbench-message, .workbench-message.user')?.textContent?.trim()||conversation.title||'未命名对话';
  };
  const conversationDate = conversation => {
    const timestamp=Number(conversation.createdAt||conversation.id);
    if(Number.isFinite(timestamp)&&timestamp>0)return new Date(timestamp);
    const parsed=new Date(String(conversation.time||'').replace(/\//g,'-'));
    return Number.isNaN(parsed.getTime())?new Date(0):parsed;
  };
  const startOfDay = date => new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const isConversationInRange = (conversation,range) => {
    const date=conversationDate(conversation); if(!date.getTime())return false;
    const now=new Date(), day=Math.floor((startOfDay(now)-startOfDay(date))/86400000);
    if(range==='today')return day===0;
    if(range==='yesterday')return day===1;
    if(range.startsWith('days-'))return day>=0&&day<Number(range.split('-')[1]);
    return date.getFullYear()===Number(range.replace('year-',''));
  };
  const formatConversationTime = conversation => {
    const date=conversationDate(conversation), now=new Date();
    const pad=value=>String(value).padStart(2,'0');
    if(startOfDay(date).getTime()===startOfDay(now).getTime())return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${date.getFullYear()}/${pad(date.getMonth()+1)}/${pad(date.getDate())}`;
  };
  const historyRanges = [
    ['today','今天'],['yesterday','昨天'],['days-3','最近3天'],['days-7','最近7天'],['days-30','最近30天'],['year-2026','2026年'],['year-2025','2025年']
  ];
  const renderHistoryPanel = panel => {
    const conversations=store.conversations.filter(item=>isConversationInRange(item,historyRange));
    panel.innerHTML=`<div class="ai-history-head"><strong>历史对话</strong><div><button data-ai-clear>清空当前对话</button><button data-ai-history-close>关闭</button></div></div><nav class="ai-history-ranges" aria-label="按时间筛选历史对话">${historyRanges.map(([key,label])=>`<button type="button" class="${historyRange===key?'active':''}" data-ai-history-range="${key}" aria-pressed="${historyRange===key}">${label}</button>`).join('')}</nav><div class="ai-history-list">${conversations.length?conversations.map(c=>`<button class="ai-history-item" data-ai-history-open="${c.id}" title="${esc(firstQuestion(c))}"><strong>${esc(firstQuestion(c))}</strong><small>${esc(formatConversationTime(c))}</small></button>`).join(''):'<div class="ai-history-empty">该时间范围暂无历史对话</div>'}</div>`;
  };
  const saveConversation = () => { const host=body(); if(!host||!host.children.length)return; const question=host.querySelector('.global-chat-row.user .workbench-message, .workbench-message.user')?.textContent?.trim()||''; const createdAt=Date.now(); store.conversations.unshift({id:createdAt,createdAt,question,title:question||'工作简报',time:new Date(createdAt).toISOString(),html:host.innerHTML}); store.conversations=store.conversations.slice(0,100); save('aiStewardConversations',store.conversations); };
  const showHistory = () => { let panel=document.querySelector('.ai-history-panel'); if(!panel){panel=document.createElement('section');panel.className='ai-history-panel';document.getElementById('globalAiPanel')?.append(panel);} panel.hidden=false; renderHistoryPanel(panel); };
  const handleAction = target => {
    const type=target.dataset.aiAction, customer=customers.find(c=>c.id===target.dataset.customerId)||customers.find(c=>c.name===target.dataset.customer)||store.currentCustomer||customers[0];
    if(type==='profile'||type==='profile-detail')showProfile(customer); else if(type==='report'||type==='report-detail')showReport(customer); else if(type==='trend')showTrend(customer); else if(type==='task-form')taskForm(customer); else if(type==='task-list'||type==='list-today')renderTasks('today'); else if(type==='list-overdue')renderTasks('overdue'); else if(type==='suggestions')appendAI('待处理建议','发现2项尚未转为任务的专家建议。你可以模拟报告回传并确认生成任务。',action('模拟专家报告回传','simulate-expert','',true)); else if(type==='expert-detail')appendAI(`${customer.name}专家建议`,'建议客户30天后进行复查，并在14天后了解近期健康状况。',action('安排提醒','task-form',customer.name,true)); else if(type==='original-order')appendAI('原始医嘱详情',`<section class="ai-business-card"><h4>${customer.name} · 门诊处方</h4><p>记录日期：${customer.lastCheck}</p><p>来源：模拟门诊处方影像录入</p><div class="ai-demo-note">该内容仅用于原型演示，不构成医疗建议。</div></section>`); else if(type==='simulate-expert')simulateExpert(); else if(type==='cancel-card')target.closest('.global-chat-row')?.remove(); else if(type==='confirm-task')confirmTask(document.getElementById(target.dataset.form)); else if(type==='delete-proposal')target.closest('.ai-proposal-row')?.remove(); else if(type==='confirm-proposals'){ const inputs=[...target.closest('.ai-business-card').querySelectorAll('[data-proposals] input')]; inputs.forEach((input,i)=>store.tasks.unshift({id:`TP${Date.now()}${i}`,customer:'张三',name:input.value,type:'专家建议跟进',time:i?tomorrow(15):tomorrow(10),assignee:'张老师（当前）',note:'由专家建议生成，经主理人确认',status:'待处理'})); save('aiStewardTasks',store.tasks); target.closest('.ai-business-card').innerHTML='<h4>任务已生成</h4><p>已确认创建后续服务任务，可在任务列表中继续修改、完成或取消。</p>';toast('建议任务创建成功'); }
    else if(['complete-task','cancel-task'].includes(type)){ const task=store.tasks.find(t=>t.id===target.dataset.task);if(task){task.status=type==='complete-task'?'已完成':'已取消';save('aiStewardTasks',store.tasks);target.closest('.global-chat-row')?.remove();renderTasks();toast(`任务已${task.status==='已完成'?'完成':'取消'}`);} }
    else if(type==='edit-task'){const task=store.tasks.find(t=>t.id===target.dataset.task);const c=customers.find(x=>x.name===task?.customer)||customer;if(task)taskForm(c,{id:task.id,name:task.name,time:task.time,note:task.note});}
    else if(type==='choose-customer'){store.currentCustomer=customer;target.closest('.global-chat-row')?.remove();const intent=store.pendingIntent;store.pendingIntent='';if(intent==='medication')showMedication(customer);else if(intent==='trend')showTrend(customer);else if(intent==='report')showReport(customer);else showProfile(customer);}
  };
  const init = () => {
    const panel=document.getElementById('globalAiPanel'); if(!panel)return;
    document.getElementById('globalAiQuickRow').innerHTML=['查档案','查医嘱','定任务','查报告'].map(x=>`<button type="button" data-workbench-quick="${x}">${x}</button>`).join('');
    renderBrief(); window.aiStewardSend=send;
    panel.addEventListener('click',event=>{
      const reminderCheck=event.target.closest('[data-ai-reminder-check]'); if(reminderCheck){toggleReminder(reminderCheck);return;}
      const actionTarget=event.target.closest('[data-ai-action]');if(actionTarget){handleAction(actionTarget);return;}
      if(event.target.closest('[data-ai-expand]')){panel.classList.toggle('is-wide');event.target.closest('button').textContent=panel.classList.contains('is-wide')?'↙':'↗';return;}
      if(event.target.closest('[data-ai-new]')){saveConversation();store.currentCustomer=null;store.pendingIntent='';renderBrief();toast('已新建对话');return;}
      if(event.target.closest('[data-ai-history]')){showHistory();return;}
      if(event.target.closest('[data-ai-history-close]')){event.target.closest('.ai-history-panel').hidden=true;return;}
      const historyRangeButton=event.target.closest('[data-ai-history-range]');if(historyRangeButton){historyRange=historyRangeButton.dataset.aiHistoryRange;renderHistoryPanel(historyRangeButton.closest('.ai-history-panel'));return;}
      if(event.target.closest('[data-ai-clear]')){renderBrief();event.target.closest('.ai-history-panel').hidden=true;toast('当前对话已清空');return;}
      const history=event.target.closest('[data-ai-history-open]');if(history){const item=store.conversations.find(c=>c.id===Number(history.dataset.aiHistoryOpen));if(item){body().innerHTML=item.html;history.closest('.ai-history-panel').hidden=true;scrollEnd();}}
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
