(function () {
  const report = document.getElementById('statisticsReportView');
  if (!report) return;
  report.setAttribute('data-persistence-ignore', '');
  const diseases = [['CKD',5620,92.4,86.1,102],['高血压',4860,88.1,81.3,96],['糖尿病',4320,85.6,79.8,86],['乳腺结节',3620,90.3,84.5,44]];
  const ranks = [['第一附属医院',4860,92.1,88.3,96.4,3.1,95.6],['第二附属医院',3920,88.4,83.6,92.1,4.8,89.3],['东院区',2860,85.6,79.8,89.3,6.2,84.7],['社区中心',1040,78.3,72.6,85.1,8.6,78.5]];
  const orgs = {'第一附属医院':['肾内科','内分泌科','心内科','乳甲外科'],'第二附属医院':['肾内科','内分泌科'],'东院区':['全科医学科','心内科'],'社区中心':['全科医学科']};
  // Synthetic cohort: enrolled = active + closed + withdrawn; overdue is a subset of pending.
  const demo = { enrolled: 3970, active: 3660, closed: 218, withdrawn: 92, taskTotal: 12460, taskDone: 11226, taskOnTime: 10778, overdue: 286, lost: 171, followupTotal: 6240, followupDone: 5784, revisitTotal: 2480, revisitDone: 2182, revisitOnTime: 2063 };
  const count = value => value.toLocaleString('en-US');
  const kpis = [
    { title: '新增入组人数', icon: 'user', items: [['新增入组人数', '1,286', '人']] },
    { title: '管理中', icon: 'users', items: [['在管人数', count(demo.active), '人'], ['有效在管率', (demo.active / demo.enrolled * 100).toFixed(1), '%']] },
    { title: '任务执行', icon: 'file', items: [['待完成任务数', count(demo.taskTotal - demo.taskDone), '项'], ['逾期任务数', count(demo.overdue), '项'], ['已完成任务数', count(demo.taskDone), '项']] },
    { title: '预警人数', icon: 'alert', items: [['三级预警', '186', '人'], ['二级预警', '98', '人'], ['一级预警', '44', '人']] },
    { title: '结案人数', icon: 'check', items: [['结案人数', count(demo.closed), '人']] },
    { title: '失访情况', icon: 'users', items: [['失访人数', count(demo.lost), '人'], ['失访率', (demo.lost / demo.enrolled * 100).toFixed(1), '%']] }
  ];
  const percent = (value,total) => total ? (value / total * 100).toFixed(1) : "0.0";
  const processGroups = [
    [['健康任务数', count(demo.taskTotal), '项'], ['任务完成率', percent(demo.taskDone,demo.taskTotal), '%'], ['按时完成率', percent(demo.taskOnTime,demo.taskTotal), '%']],
    [['逾期任务数', count(demo.overdue), '项'], ['逾期率', percent(demo.overdue,demo.taskTotal), '%']],
    [['复诊任务数', count(demo.revisitTotal), '项'], ['复诊率', percent(demo.revisitDone,demo.revisitTotal), '%'], ['按时复诊率', percent(demo.revisitOnTime,demo.revisitTotal), '%']]
  ];
  const paths = {users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',user:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M20 8v6M17 11h6',file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8',pie:'M21 12a9 9 0 1 1-9-9v9zM15 3v6h6',shield:'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6zM8 12l3 3 5-6',chart:'M4 20v-6M10 20V9M16 20V4M3 10l6-5 5 1 6-5',alert:'M12 3 2 21h20zM12 9v5M12 17v1',check:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M7 12l3 3 7-7',up:'M12 21V3M5 10l7-7 7 7',down:'M12 3v18M5 14l7 7 7-7',chip:'M6 6h12v12H6zM9 9h6v6H9zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4',clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 6v6l4 2'};
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]}"/></svg>`;
  const delta = (value,bad=false,down=false) => `<span class="sr-delta">环比 <b class="${bad?'bad':'good'}">${down?'↓':'↑'} ${value}%</b></span>`;
  const metric = (label,value,change,type,tone='',down=false) => `<div class="sr-metric ${tone}"><span class="sr-icon">${icon(type)}</span><div><span>${label}</span><strong>${value}</strong>${delta(change,tone==='red',down)}</div></div>`;
  const options = (all,items) => `<option value="">${all}</option>${items.map(x=>`<option>${x}</option>`).join('')}`;
  const title = text => `<h2>${text}</h2>`;
  report.innerHTML = `<div class="sr-dashboard"><header class="sr-hero"><h1>数据看板</h1><span>数据更新：2026-09-05 20:00</span></header>
  <form class="sr-filters" aria-label="数据看板筛选"><div class="sr-filter-row"><label class="sr-date">时间范围：<span><input aria-label="开始日期" name="start" type="date" value="2026-01-01" required>至<input aria-label="结束日期" name="end" type="date" value="2026-09-05" required></span></label><label>机构：<select name="org">${options('全部机构',Object.keys(orgs))}</select></label><label>科室：<select name="dept">${options('全部科室',[...new Set(Object.values(orgs).flat())])}</select></label><label>个人：<select name="person">${options('全部人员',[])}</select></label><label>病种：<select name="disease">${options('全部病种',diseases.map(d=>d[0])).replace('<option>CKD</option>','<option value="CKD">慢性肾病（CKD）</option>')}</select></label><button class="sr-query" type="submit">查询</button><button type="reset">重置</button></div></form>
  <div class="sr-scope" aria-live="polite">全部机构 / 全部科室 / 全部人员 / 全部病种</div>
  <div class="sr-result"><section class="sr-kpis sr-kpi-groups" aria-label="核心指标">${kpis.map(k=>`<article class="sr-kpi sr-kpi-group ${k.icon==='alert'?'red':''}"><header><span class="sr-icon">${icon(k.icon)}</span><h2>${k.title}</h2></header><div class="sr-group-values ${k.items.length>1?'multiple':''}">${k.items.map(([label,value,unit])=>`<div>${k.items.length>1?`<span class="sr-kpi-label">${label}</span>`:''}<strong ${value===null?'aria-label="暂无数据" title="暂无数据"':''}>${value===null?'—':value}<small>${value===null?'':unit}</small></strong></div>`).join('')}</div></article>`).join('')}</section>
  <div class="sr-top"><article class="sr-card">${title('患者管理流转')}<div id="srFlowChart" class="sr-flow-chart" role="img" aria-label="患者流转竖向漏斗图：筛查35620人，异常6780人，符合入组4860人，成功入组3970人，有效在管3660人；相邻阶段转化率19.0%、71.7%、81.7%、92.2%。"></div></article>
  <article class="sr-card sr-referral-panel">${title('双向转诊')}<div class="sr-referral-funnels">${[['Up','向上转诊','94.4','88.1'],['Down','向下转诊','96.9','91.3']].map(([id,label,success,closed])=>`<section><h3>${label}</h3><div id="srReferral${id}" class="sr-referral-chart" role="img" aria-label="${label}：转出人数、接收人数、到院就诊、确认入组"></div><div class="sr-referral-summary"><span>转诊成功率<strong>${success}%</strong></span><span>转诊闭环率<strong>${closed}%</strong></span></div></section>`).join('')}</div></article></div>
  <article class="sr-card sr-process-quality">${title('管理过程质量')}<div class="sr-process-grid">${processGroups.map(group=>`<div class="sr-process-group">${group.map(([label,value,unit])=>`<div class="sr-process-metric"><span>${label}</span><strong>${value}<small>${unit}</small></strong></div>`).join('')}</div>`).join('')}</div></article>
  <div class="sr-outcome-safety-row"><article class="sr-card sr-target-outcomes">${title('疾病管理成效 · 目标达成')}<div class="sr-table-wrap"><table class="sr-table sr-disease"><thead></thead><tbody></tbody></table></div></article><article class="sr-card sr-safety">${title('风险与安全')}<div class="sr-safety-grid"></div></article></div>
  <article class="sr-card sr-service-resources">${title('服务资源应用情况')}<div class="sr-resource-grid"></div></article>
  <article class="sr-card sr-ranking">${title('机构/科室绩效排名')}<div class="sr-table-wrap"><table class="sr-table"><thead><tr>${['排名','机构/科室','在管人数','规范管理率','目标达成率','预警闭环率','失访率','综合得分','操作'].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${ranks.map((r,i)=>`<tr><td><span class="sr-rank r${i}">${i+1}</span></td><td>${r[0]}</td><td>${r[1].toLocaleString()}</td>${r.slice(2).map((v,j)=>`<td><span class="sr-score ${(j===3?v>7:v<80)?'low':(j===3?v>4:v<85)?'mid':''}">${v.toFixed(1)}${j<4?'%':''}</span></td>`).join('')}<td><button class="sr-link" data-detail="${i}">查看</button></td></tr>`).join('')}</tbody></table></div></article></div>
  <div class="sr-empty" hidden>暂无符合筛选条件的统计数据<button type="button" data-clear>重置筛选</button></div>
  <dialog class="sr-dialog"><header><h2></h2><button aria-label="关闭详情" data-close>×</button></header><div class="sr-detail-content"></div></dialog></div>`;
  const form = report.querySelector('form');
  const table = report.querySelector('.sr-disease tbody');
  let flowChart;
  const referralCharts = [];
  function renderFlowChart() {
    flowChart ||= window.echarts.init(document.getElementById('srFlowChart'));
    const stages = ['筛查','异常','符合入组','成功入组','有效在管'].map((name,i)=>({name,value:currentFlow[i]}));
    document.getElementById('srFlowChart').setAttribute('aria-label',stages.map(s=>s.name+s.value+'人').join('，'));
    flowChart.setOption({
      animationDuration: 300,
      color: ['#2878e3','#519afa','#79b6ee','#59bcc4','#37ae92'],
      tooltip: { trigger: 'item', formatter: p => p.name + '：' + p.value.toLocaleString('zh-CN') + ' 人' },
      series: [{ type: 'funnel', orient: 'vertical', sort: 'descending', left: '12%', width: '76%', top: 8, bottom: 8,
        min: 0, max: Math.max(1,currentFlow[0]), minSize: '36%', maxSize: '100%', gap: 26, funnelAlign: 'center',
        label: { show: true, position: 'inside', color: '#fff', fontSize: 13, formatter: p => p.name + '  ' + p.value.toLocaleString('zh-CN') + ' 人' },
        labelLine: { show: false }, itemStyle: { borderColor: '#fff', borderWidth: 1 },
        emphasis: { label: { fontSize: 13, fontWeight: 'bold' } }, data: stages }],
      graphic: stages.slice(1).map((stage,i) => ({type:'text',left:'center',top:54 + i * 66,silent:true,
        style:{text:'↓ 转化率 ' + percent(stage.value,stages[i].value) + '%',fill:'#536b8b',font:'12px Microsoft YaHei',align:'center'}}))
    });
    flowChart.resize();
  }

  function renderReferralCharts() {
    const names = ['转出人数','接收人数','到院就诊','确认入组'];
    const cohorts = currentReferrals;
    ['Up','Down'].forEach((direction,index) => {
      const values = cohorts[index];
      const ref = referralCharts[index] ||= window.echarts.init(document.getElementById('srReferral' + direction));
      ref.setOption({ animationDuration:300,
        color:index ? ['#389cba','#51b0c2','#68bcb3','#37ae92'] : ['#2878e3','#519afa','#79b6ee','#4ba6ce'],
        tooltip:{trigger:'item',formatter:p=>p.name+'：'+p.value+' 人'},
        series:[{type:'funnel',orient:'vertical',sort:'descending',left:'4%',width:'92%',top:8,bottom:8,
          min:0,max:Math.max(1,values[0]),minSize:'65%',maxSize:'100%',gap:22,funnelAlign:'center',
          label:{show:true,position:'inside',fontSize:12,color:'#fff',formatter:p=>p.name+'  '+p.value+' 人'},
          labelLine:{show:false},itemStyle:{borderColor:'#fff',borderWidth:1},
          data:values.map((value,i)=>({name:names[i],value}))}],
        graphic:values.slice(1).map((v,i)=>({type:'text',left:'center',top:51.5+i*60.5,silent:true,
          style:{text:'↓ '+percent(v,values[i])+'%',fill:'#536b8b',font:'12px Microsoft YaHei'}}))
      });
      ref.resize();
    });
  }
  function renderChart(){
    if(!report.classList.contains('active'))return;
    if(!window.echarts){document.getElementById('srFlowChart').textContent='图表加载失败，请刷新页面重试';return;}
    renderFlowChart();renderReferralCharts();
  }
  window.renderStatisticsReport=()=>requestAnimationFrame(renderChart);
  new ResizeObserver(()=>{flowChart?.resize();referralCharts.forEach(ref=>ref.resize());}).observe(report);

  let applied={org:'',dept:'',person:'',disease:'',start:'2026-01-01',end:'2026-09-05'};
  let currentFlow=[35620,6780,4860,3970,3660], currentReferrals=[[286,270,260,252],[196,190,184,179]];

  const engine=window.StatisticsData;
  let result;
  function setValues(selector,values){report.querySelectorAll(selector).forEach((el,i)=>{const unit=el.querySelector('small')?.textContent||'';el.innerHTML=values[i]+'<small>'+unit+'</small>';});}
  function renderMetrics(selector,metrics,cls){report.querySelector(selector).innerHTML=metrics.map(([label,n,unit])=>'<div class="'+cls+'"><span>'+label+'</span><strong>'+n+'<small>'+unit+'</small></strong></div>').join('');}
  function updateDashboard(){
    result=engine.query(applied);const r=result;
    setValues('.sr-group-values strong',[count(r.enrolled),count(r.active),r.activeRate.toFixed(1),count(r.pending),count(r.overdue),count(r.done),...r.levels.map(count),count(r.closed),count(r.lost),r.lostRate.toFixed(1)]);
    setValues('.sr-process-metric strong',[count(r.total),r.doneRate.toFixed(1),r.onTimeRate.toFixed(1),count(r.overdue),r.overdueRate.toFixed(1),count(r.revisit),percent(r.revisited,r.revisit),percent(r.revisitOnTime,r.revisit)]);
    currentFlow=[r.screened,r.abnormal,r.eligible,r.enrolled,r.active];currentReferrals=r.referrals;
    setValues('.sr-referral-summary strong',currentReferrals.flatMap(v=>[percent(v[1],v[0])+'%',percent(v[3],v[0])+'%']));
    renderMetrics('.sr-safety-grid',[['三级预警人数',count(r.levels[0]),'人'],['二级预警人数',count(r.levels[1]),'人'],['一级预警人数',count(r.levels[2]),'人'],['预警按时处置率',percent(r.handledOnTime,r.alertEvents),'%'],['超时未处置率',percent(r.unhandledOverdue,r.alertEvents),'%'],['重复预警人数',count(r.repeated),'人']],'sr-safety-metric');
    renderMetrics('.sr-resource-grid',[['消息发送次数',count(r.sent),'次'],['消息触达次数',count(r.reached),'次'],['消息触达率',percent(r.reached,r.sent),'%'],['AI健康任务数',count(r.aiTasks),'项'],['AI外呼次数',count(r.aiCalls),'次'],['AI任务完成率',percent(r.aiDone,r.aiTasks),'%'],['AI消息触达次数',count(r.aiMessages),'次'],['AI生成报告数',count(r.aiReports),'份'],['AI识别预警次数',count(r.aiAlerts),'次']],'sr-resource-metric');
    const header=labels=>'<tr>'+labels.map(t=>'<th>'+t+'</th>').join('')+'</tr>';
    const progress=(n,d)=>'<div class="sr-progress"><span><i style="width:'+percent(n,d)+'%;background:#35af87"></i></span>'+percent(n,d)+'%</div>';
    report.querySelector('.sr-disease thead').innerHTML=header(applied.disease?['指标','参与评估人数','目标达成数','目标达成率']:['病种','管理病例','目标达成数','目标达成率','风险患者']);
    table.innerHTML=applied.disease?engine.indicators[applied.disease].map(name=>{const v=r.assessments[name]||{total:0,achieved:0};return '<tr><td>'+name+'</td><td>'+count(v.total)+' 人</td><td>'+count(v.achieved)+' 人</td><td>'+progress(v.achieved,v.total)+'</td></tr>';}).join(''):r.diseases.map(d=>'<tr><td>'+(d.name==='CKD'?'慢性肾病（CKD）':d.name)+'</td><td>'+count(d.enrolled)+' 人</td><td>'+count(d.achieved)+' 人</td><td>'+progress(d.achieved,d.enrolled)+'</td><td>'+count(d.risk)+' 人</td></tr>').join('');
    report.querySelector('.sr-ranking h2').textContent=applied.dept?'人员绩效排名':applied.org?'科室绩效排名':'机构绩效排名';
    report.querySelector('.sr-ranking tbody').innerHTML=r.ranks.map((v,i)=>'<tr><td>'+(i+1)+'</td><td>'+v.name+'</td><td>'+count(v.active)+'</td>'+[v.standardRate,v.targetRate,v.closedAlertRate,v.lostRate,v.score].map((n,j)=>'<td>'+n.toFixed(1)+(j<4?'%':'')+'</td>').join('')+'<td><button class="sr-link" data-detail="'+i+'">查看</button></td></tr>').join('');
    report.querySelector('.sr-result').hidden=!r.screened;report.querySelector('.sr-empty').hidden=!!r.screened;
    if(r.screened)renderChart();
  }
  function updatePeople(){const f=form.elements,previous=f.person.value;const names=[...new Set(engine.people.filter(p=>(!f.org.value||p.org===f.org.value)&&(!f.dept.value||p.dept===f.dept.value)).map(p=>p.name))];f.person.innerHTML=options('全部人员',names);if(names.includes(previous))f.person.value=previous;}
  form.elements.org.addEventListener('change',()=>{form.elements.dept.innerHTML=options('全部科室',form.elements.org.value?orgs[form.elements.org.value]:[...new Set(Object.values(orgs).flat())]);form.elements.person.value='';updatePeople();});
  form.elements.dept.addEventListener('change',()=>{form.elements.person.value='';updatePeople();});
  function applyFilters(){const f=form.elements;f.end.setCustomValidity('');if(!f.start.value||!f.end.value)return;if(f.start.value>f.end.value){f.end.setCustomValidity('结束日期不能早于开始日期');f.end.reportValidity();return;}applied=Object.fromEntries(['org','dept','person','disease','start','end'].map(k=>[k,f[k].value]));report.querySelector('.sr-scope').textContent=[f.org.selectedOptions[0].text,f.dept.selectedOptions[0].text,f.person.selectedOptions[0].text,f.disease.selectedOptions[0].text].join(' / ');updateDashboard();}
  form.addEventListener('submit',event=>{event.preventDefault();applyFilters();});
  form.addEventListener('change',applyFilters);
  form.addEventListener('reset',()=>{form.elements.dept.innerHTML=options('全部科室',[...new Set(Object.values(orgs).flat())]);form.elements.person.innerHTML=options('全部人员',[...new Set(engine.people.map(p=>p.name))]);form.elements.end.setCustomValidity('');requestAnimationFrame(applyFilters);});
  updatePeople();updateDashboard();
  if(window.StatisticsFilters){
    const host=document.createElement("div");host.className="sr-filter-mount";form.before(host);form.hidden=true;
    window.StatisticsFilters.mount(host,values=>{
      form.elements.org.value=values.org;
      form.elements.dept.innerHTML=options("全部科室",values.org?orgs[values.org]:[...new Set(Object.values(orgs).flat())]);
      form.elements.dept.value=values.dept;updatePeople();
      for(const key of ["person","disease","start","end"])form.elements[key].value=values[key];
      applyFilters();
    },engine);
  }
  const dialog=report.querySelector('dialog');report.addEventListener('click',event=>{if(event.target.closest('[data-clear]'))form.reset();if(event.target.closest('[data-close]'))dialog.close();const detail=event.target.closest('[data-detail]');if(detail){const r=result.ranks[Number(detail.dataset.detail)];dialog.querySelector('h2').textContent=r.name+' · 绩效详情';dialog.querySelector('.sr-detail-content').innerHTML=['在管人数','规范管理率','目标达成率','预警闭环率','失访率','综合得分'].map((label,i)=>'<div><span>'+label+'</span><strong>'+[count(r.active),r.standardRate.toFixed(1)+'%',r.targetRate.toFixed(1)+'%',r.closedAlertRate.toFixed(1)+'%',r.lostRate.toFixed(1)+'%',r.score.toFixed(1)][i]+'</strong></div>').join('');dialog.showModal();}});
})();
