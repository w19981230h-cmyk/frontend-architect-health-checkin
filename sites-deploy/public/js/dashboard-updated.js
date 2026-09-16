/* Latest dashboard: screenshot-aligned demonstration, isolated from existing reports. */
(() => {
  const root = document.getElementById('dashboardUpdatedView');
  if (!root) return;
  const dot = (color) => `<i class="dl-dot" style="background:${color}"></i>`;
  const colors = ['#ff506b','#ffd647','#14c8ad','#9bb4ce'];
  const table = (heads, rows) => `<div class="dl-table-wrap"><table class="os-table dl-table"><thead><tr>${heads.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const title = (n,t,note='') => `<h2>${n}. ${t}<small>${note}</small></h2>`;
  const note = t => `<p class="dl-note">${t}</p>`;
  const icon = (name, color='#168cff') => {
    const paths={person:'<circle cx="12" cy="6" r="4"/><path d="M4 23v-4a8 8 0 0 1 16 0v4z"/>',group:'<circle cx="12" cy="5" r="3"/><circle cx="4" cy="8" r="2.5"/><circle cx="20" cy="8" r="2.5"/><path d="M7 22v-8a5 5 0 0 1 10 0v8zM1 21v-7a3 3 0 0 1 5-2v9zM18 21v-9a3 3 0 0 1 5 2v7z"/>',alert:'<path d="M10 3a2 2 0 0 1 4 0l10 18H0z"/><path d="M12 8v6m0 3v1" stroke="white" stroke-width="2"/>',bell:'<path d="M4 17V9a8 8 0 0 1 16 0v8l3 3H1zM9 22h6a3 3 0 0 1-6 0"/>',clock:'<circle cx="12" cy="12" r="11"/><path d="M12 5v8l5 3" fill="none" stroke="white" stroke-width="2"/>',building:'<path d="M2 22V7h6v15M9 22V2h7v20M17 22V10h5v12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 10h2m-2 4h2m5-8h3m-3 4h3m-3 4h3m5 0h2" stroke="currentColor" stroke-width="2"/>',robot:'<path d="M3 7h18v15H3zM11 2h2v5H11zM0 11h2v8H0zM22 11h2v8h-2z"/><path d="M7 12h3m4 0h3M8 18h8" stroke="white" stroke-width="2"/>',up:'<path d="M12 1 2 11h6v12h8V11h6z"/>'};
    Object.assign(paths,{
      clipboard:'<rect x="4" y="4" width="16" height="19" rx="2"/><rect x="8" y="1" width="8" height="5" rx="2" stroke="white"/><path d="M8 10h8M8 14h6M8 18h5" stroke="white" fill="none"/>',
      shield:'<path d="M12 1 2 5v7c0 6 10 11 10 11s10-5 10-11V5z"/><path d="m6 11 4 4 8-8" fill="none" stroke="white" stroke-width="2"/>',
      link:'<circle cx="12" cy="12" r="11"/><path d="m10 8 3-3a4 4 0 0 1 6 6l-3 3m-2 2-3 3a4 4 0 0 1-6-6l3-3m1 5 6-6" fill="none" stroke="white" stroke-width="1.7"/>',
      check:'<circle cx="12" cy="12" r="11"/><path d="m6 12 4 4 8-8" fill="none" stroke="white" stroke-width="2"/>',
      fileAlert:'<rect x="4" y="4" width="16" height="19" rx="3"/><rect x="9" y="1" width="6" height="6" rx="2" stroke="white"/><path d="M12 10v6m0 2v2" stroke="white" stroke-width="2"/>'
    });
    return `<svg class="dl-icon" viewBox="0 0 24 24" aria-hidden="true" style="color:${color};fill:${color}">${paths[name]||paths.building}</svg>`;
  };
  const api=window.DashboardLatestData;
  const defaults={org:'',dept:'',team:'',person:'',disease:'',start:api.data.start,end:api.data.end};
  let filterHost,controls,cleanup;
  function apply(filters){controls?.setValues(filters);draw(api.select(filters));}
  function draw(view){
  cleanup?.();filterHost?.remove();
  const {data:d,totals:t,sum,percent}=view;
  const f=n=>Number(n).toLocaleString('en-US');
  const rate=(n,total)=>total?percent(n,total)+'%':'—';
  const bar=(n,total)=>`<div class="dv-rate"><div class="dv-chart" data-value="${percent(n,total)}" role="img" aria-label="${rate(n,total)}"></div><span>${rate(n,total)}</span></div>`;
  const step=(index,label,value,symbol,lower,green=false)=>`<div class="dv-stage"><div class="dv-step ${green?'green':''}"><i>${index}</i>${icon(symbol,green?'#13c7ae':'#168cff')}<h3>${label}</h3><b>${f(value)}<small> 人</small></b></div><div class="dv-stem"></div>${lower}</div>`;
  const branch=(label,value,symbol,color='orange',extra='')=>`<div class="dv-branch ${color}">${icon(symbol,color==='orange'?'#ff7900':color==='green'?'#13c7ae':'#8699b7')}<div>${label}</div><b>${f(value)} <small>人</small></b>${extra}</div>`;
  const arrow=(label,n,total)=>`<div class="dv-arrow"><span>${label}</span><b>${rate(n,total)}</b><i></i></div>`;
  const levelRows=d.levels.map(r=>[dot(r.color)+r.name,f(r.due),f(r.active),`<span class="dl-red">${f(r.due-r.active)}</span>`,rate(r.active,r.due),r.evaluable===null?'—':f(r.evaluable),r.standard===null?'—':f(r.standard),r.standard===null?'—':rate(r.standard,r.evaluable)]);
  levelRows.push(['合计',f(t.managedDue),f(t.active),`<span class="dl-red">${f(t.managedDue-t.active)}</span>`,rate(t.active,t.managedDue),f(sum(d.levels,'evaluable')),f(sum(d.levels,'standard')),rate(sum(d.levels,'standard'),sum(d.levels,'evaluable'))]);
  const orgMetrics=r=>({
    enrollment:{title:'筛查入组',total:r.eligible,parts:[['已入组',r.enrolled,'#58aa98'],['未入组',r.eligible-r.enrolled,'#e8edf5']],details:[['符合入组',r.eligible],['其中超期未入组',r.overdueEnrollment]]},
    management:{title:'全部来源 · 期末管理',total:r.managedDue,parts:[['在管',r.active,'#487cf6'],['未在管',r.managedDue-r.active,'#f0c69f']],details:[['应管理',r.managedDue]]},
    tiers:{title:'三色分层 · 应管理人群',total:r.managedDue,parts:r.levels.map(l=>[l.name,l.due,l.color]),details:[['该对象应管理',r.managedDue]]},
    standard:{title:'规范管理',total:r.evaluable,parts:[['规范管理',r.standard,'#58aa98'],['未达规范',r.evaluable-r.standard,'#e8edf5']],details:[['可评价',r.evaluable]]},
    gaps:{title:'筛查与入组缺口',total:r.due,parts:[['已筛查',r.screened,'#9bb4ce'],['未筛查',r.due-r.screened,'#e99a4d']],details:[['应筛查',r.due],['符合条件未入组',r.eligible-r.enrolled],['其中超期未入组',r.overdueEnrollment]]}
  });
  const orgChart=(r,key)=>{
    const m=orgMetrics(r)[key];
    const description=r.name+' · '+m.title+'；'+m.parts.map(([label,n])=>label+' '+f(n)+' 人，占比 '+rate(n,m.total)).concat(m.details.map(([label,n])=>label+' '+f(n)+' 人')).join('；');
    return '<div class="dv-org-metric" data-metric-org="'+r.name+'" data-metric="'+key+'" tabindex="0" role="img" aria-label="'+description+'"></div>';
  };
  const institutionDistribution='<div class="dv-institution-distribution" aria-label="下级对象分布">'+table([view.comparison,'筛查入组','规范管理','三色分层'],d.organizations.map(r=>[
    '<button class="dl-org-link" data-org="'+r.name+'">'+(r.label||r.name)+' ›</button>',
    ...['enrollment','standard','tiers'].map(key=>orgChart(r,key))
  ]))+note('图条显示占比，悬停或点按查看人数；键盘聚焦也可查看。三色分层与上方饼图均按全部应管理人群统计，下级人数合计与当前范围一致。入组率＝本期已入组／符合入组；规范管理率＝规范管理／可评价管理人数。汇总比例按人数加权计算，不直接平均下级比例。')+'</div>';
  const personalDistribution='<div class="dv-person-breakdowns">'+Object.entries(view.breakdowns).map(([kind,items])=>'<section><h3>'+kind+'</h3>'+items.map(item=>'<button type="button" class="dl-org-link" data-breakdown="'+kind+'" data-value="'+item.name+'">'+item.name+' '+f(item.count)+' 人 ›</button>').join('')+'</section>').join('')+note('点击人数查看对应患者明细；同一患者可能涉及多个病种，病种人数不可直接相加。')+'</div>';
  const referralDisplay=Object.fromEntries(['up','down'].map(key=>{
    const up=key==='up',r=d.referralMetrics[key];
    const labels=up?['转出人数','上级机构接收人数','实际到院人数','诊疗反馈完成人数']:['转出人数','基层接收人数','管理交接人数','首次随访完成人数'];
    const transitions=up?['上级机构接收率','实际到院率','诊疗反馈完成率']:['基层接收率','管理交接率','首次随访完成率'];
    return [key,{title:up?'向上转诊':'向下转诊',stages:labels.map((name,i)=>[name,r.stages[i]]),rates:transitions.map((name,i)=>name+' '+(r.transitionRates[i]==='—'?'—':r.transitionRates[i]+'%')),
      colors:up?['#4479da','#5b8fe5','#7faadd','#60a5bf']:['#539bb2','#69adbb','#80b8b0','#59a78f'],
      stats:[['转诊闭环率',r.closureRate==='—'?'—':r.closureRate+'%'],...(up?[['平均接收时长',r.averageAcceptanceHours==='—'?'—':r.averageAcceptanceHours+'小时']]:[]),[up?'已接收未到院':'已接收未交接',r.awaitingProgress+'人']]}];
  }));
  const referralPanel=key=>{const r=referralDisplay[key];return '<article class="dv-referral-panel"><h3>'+r.title+'</h3><div id="updated-dvReferral-'+key+'" class="dv-referral-funnel" role="img" aria-label="'+r.title+'，'+(key==='up'?'从下往上阅读，':'从上往下阅读，')+r.stages.map(([label,n])=>label+' '+n+' 人').join('，')+'"></div><div class="dv-referral-metrics">'+r.stats.map(([label,value])=>'<div><span>'+label+'</span><strong>'+value+'</strong></div>').join('')+'</div></article>';};
  const riskPanel=`<aside class="dl-card dv-risk-panel dv-risk-updated"><h3>预警风险与安全</h3><p>统计截至 ${d.end} · 模拟数据</p>
    <div class="dv-risk-kpi-scroll"><div class="dv-risk-kpi-row dv-risk-two-cards">
      <div><div class="dv-risk-card-icon">${icon('person','#487cf6')}</div><div class="dv-risk-card-body"><span>高危预警未闭环</span><strong>${f(d.riskOverview.highOpen)} <em>人</em></strong><small>仍有预警事项待完成闭环</small></div></div>
      <div><div class="dv-risk-card-icon danger">${icon('alert','#e4553b')}</div><div class="dv-risk-card-body"><span>超时未处置预警</span><strong class="dv-risk-overdue-count">${f(d.riskOverview.overdue)} <em>项</em></strong><small>已超过规定处置时限</small></div></div>
    </div></div>
    <h3 class="dv-risk-attention-title">需关注${view.comparison}</h3>
    ${d.riskAttention.length?'<div class="dv-risk-attention-text">'+d.riskAttention.map(o=>`<p><button type="button" class="dl-org-link" data-risk-detail="${o.name}">${o.label||o.name}：高危未闭环 ${o.highOpen} 人 · 超时未处置 ${o.overdue} 项 ›</button></p>`).join('')+'</div>':'<p>暂无需关注${view.comparison}</p>'}
    ${note('高危未闭环按患者去重，包含待处置和已处置待结果确认；超时未处置按预警事项计数。')}
  </aside>`;
  root.innerHTML=`<div class="dl-dashboard dv-dashboard">
    <header class="dl-header"><h1>AI患者运营管理驾驶舱</h1><span class="dl-subtitle">${view.scopeName} · 人群覆盖 · ${view.comparison}分布</span><span class="dl-badge">模拟数据</span><span>统计截至 ${d.end}</span></header>
    <div id="updated-dlFilters" class="dl-filters"></div><div class="dl-scope"><span>当前范围： ${view.scopeName}${view.filters.disease?" / "+view.filters.disease:""} · 下方对比：${view.personal?"病种、等级、状态":view.comparison}</span>${view.filters.org?'<button type="button" class="dl-org-link" id="updated-dlScopeBack">返回上一级</button>':''}</div><div id="updated-dlMessage" role="status" ${view.message?'':'hidden'}>${view.message}</div>
    <div class="dv-overview-pair"><section class="dl-card dv-overview">${title(1,'人群与管理总览')}<span class="dl-included">纳入统计人群 <b>${f(d.population)}</b> 人</span>
    <div class="dv-funnel-risk-grid"><div class="dv-funnel-main"><p class="dv-overview-caption">本期筛查人群 · 向下转化</p><div id="updated-dvCombinedFunnel" role="img" aria-label="总体人数${t.due}，已筛查${t.screened}，筛查异常${t.abnormal}，符合入组${t.eligible}，已入组${t.enrolled}，当前在管${d.cohortActive}（本期入组人群），入组后管理率${rate(d.cohortActive,t.enrolled)}"></div><div class="dv-funnel-notes"><span>未筛查 ${f(t.due-t.screened)} 人</span><span>未见异常 ${f(t.screened-t.abnormal)} 人</span><span>不符合入组 ${d.ineligible} 人</span><span>未入组 ${t.eligible-t.enrolled} 人（超期 ${d.overdueEnrollment} 人）</span></div>${''}</div></div></section>${riskPanel}</div>
    <section class="dl-card dv-levels dv-levels-compact"><div class="dv-levels-heading">${title(2,'三色管理')}<span>${d.organizations.length} 个${view.comparison} · 模拟数据</span></div><div class="dv-levels-strip"><div class="dv-levels-population"><h3>当前应管理人群 · 三色覆盖</h3><div class="dv-levels-population-body"><div id="updated-dlPie" class="dl-pie" role="img" aria-label="应管理人群 ${f(t.managedDue)} 人的等级分布"></div><div><strong>应管理 ${f(t.managedDue)} 人</strong><p>红 ${f(d.levels[0].due)} / 黄 ${f(d.levels[1].due)}</p><p>绿 ${f(d.levels[2].due)} / 未分级 ${f(d.levels[3].due)}</p></div></div></div>${d.levels.slice(0,3).map((r,i)=>`<article class="dv-level-mini dv-level-visual"><header><span style="color:${['#eb6371','#b69931','#4dac9c'][i]}">${r.name}管理人群</span></header><div class="dv-level-rings" data-level-index="${i}" tabindex="0" role="img" aria-label="${r.name}覆盖率${rate(r.active,r.due)}，规范管理率${rate(r.standard,r.evaluable)}；聚焦查看人数，左右方向键切换指标"></div></article>`).join('')}</div>${view.personal?personalDistribution:institutionDistribution}${note('全部来源在管 '+f(t.active)+' 人 = 本期入组在管 '+f(d.managementSources.cohortActive)+' 人 + 历史及其他来源在管 '+f(d.managementSources.otherActive)+' 人；应管理 '+f(t.managedDue)+' 人 = 在管 '+f(t.active)+' 人 + 未在管 '+f(d.managementSources.inactive)+' 人。')}</section>
    <section class="dl-card dv-outcomes">${title(3,'健康管理成效','按'+view.comparison+'查看')}<div id="updated-dvOutcomeChart" tabindex="0" role="img" aria-label="各${view.comparison}健康管理成效：目标达成数、改善数、稳定数、恶化数。左右方向键切换对比对象查看数量和比例。"></div>${note('悬停或点按柱状图查看数量与比例，点击图例可切换显示。比例＝该类病例数 / 对应比较对象的可评价病例数；待评价病例不计入分母。同一患者不同病种按病例计数。模拟数据中四类结果互斥，先判断目标达成，未达成再分为改善、稳定、恶化。')}</section>
    <section class="dl-card dv-referrals">${title(4,'双向转诊')}<div class="dv-referral-panels">${referralPanel('up')}${referralPanel('down')}</div>${note('按本期发起转诊人群跟踪至统计截止日，各方向内按患者去重。接收、到院／交接、反馈／随访逐级计算比例；闭环率以转出人数为分母。上转反馈完成不等同于本期筛查入组。')}</section>
    <footer class="dl-footer">科室、团队、人员归属为模拟分配 · 模拟数据 · 按患者、病例、周期、预警及转诊明细统一汇总 · 不含真实患者信息</footer>
    <dialog id="updated-dlDialog"><h2>机构管理概览</h2><p id="updated-dlDialogText"></p><button id="updated-dlClose" type="button">关闭</button></dialog>
  </div>`;
  const placeholder=document.getElementById('updated-dlFilters');
  if(filterHost)placeholder.replaceWith(filterHost);else filterHost=placeholder;
  const instances=[];let disposed=false;
  function chart(el,option){if(!window.echarts)return;const c=echarts.getInstanceByDom(el)||echarts.init(el);c.setOption({animation:false,textStyle:{fontFamily:'Microsoft YaHei',fontSize:14},...option},true);if(!instances.includes(c))instances.push(c);}
  // Same local ECharts runtime and standard pie/bar options as statistics-report.js.
  function render(){if(!root.classList.contains('active'))return;requestAnimationFrame(()=>{if(disposed)return;
    const outcomeRows=d.organizationOutcomes;
    const outcomeSeries=[['achieved','目标达成数'],['improved','改善数'],['stable','稳定数'],['worsened','恶化数']];
    const outcomeEl=document.getElementById('updated-dvOutcomeChart');
    chart(outcomeEl,{
      color:['#5470c6','#91cc75','#fac858','#ee6666'],
      legend:{top:0,type:'scroll'},
      grid:{left:16,right:20,top:62,bottom:16,containLabel:true},
      tooltip:{trigger:'axis',triggerOn:'mousemove|click',confine:true,axisPointer:{type:'shadow'},formatter:params=>{
        const r=outcomeRows[params[0]?.dataIndex];if(!r)return '';
        return '<strong>'+r.name+'</strong><br>可评价病例：'+f(r.evaluable)+' 例<br>'+params.map(p=>p.marker+p.seriesName+'：'+f(p.value)+' 例（'+rate(p.value,r.evaluable)+'）').join('<br>');
      }},
      xAxis:{type:'category',data:outcomeRows.map(r=>r.name),axisTick:{alignWithLabel:true},axisLabel:{interval:0,width:100,overflow:'break'}},
      yAxis:{type:'value',name:'病例数（例）',minInterval:1},
      series:outcomeSeries.map(([key,name])=>({name,type:'bar',barMaxWidth:44,barGap:'20%',label:{show:true,position:'top',fontSize:12},emphasis:{focus:'series'},data:outcomeRows.map(r=>r[key])})),
      graphic:outcomeRows.some(r=>r.evaluable)?[]:[{type:'text',left:'center',top:'middle',style:{text:'暂无可评价病例',fill:'#8c9bb1'}}]
    });
    let outcomeIndex=0;
    const showOutcome=()=>window.echarts?.getInstanceByDom(outcomeEl)?.dispatchAction({type:'showTip',seriesIndex:0,dataIndex:outcomeIndex});
    outcomeEl.onfocus=showOutcome;
    outcomeEl.onblur=()=>window.echarts?.getInstanceByDom(outcomeEl)?.dispatchAction({type:'hideTip'});
    outcomeEl.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)&&outcomeRows.length){e.preventDefault();outcomeIndex=(outcomeIndex+(e.key==='ArrowRight'?1:-1)+outcomeRows.length)%outcomeRows.length;showOutcome();}if(e.key==='Escape')outcomeEl.onblur();};
    const funnelData=[['总体人数',t.due,'#487ae8'],['已筛查',t.screened,'#6494e5'],['筛查异常',t.abnormal,'#7aaad8'],['符合入组',t.eligible,'#6cabb8'],['已入组',t.enrolled,'#59aa96'],['当前在管（本期入组）',d.cohortActive,'#28ab91']];
    const transitionNames=['筛查覆盖率','异常率','入组适配率','入组转化率','入组后管理率'];
    const funnelEl=document.getElementById('updated-dvCombinedFunnel');
    const funnelGap=Math.min(28,Math.max(22,funnelEl.clientHeight*.055));
    const funnelStageHeight=(funnelEl.clientHeight-16-5*funnelGap)/6;
    chart(document.getElementById('updated-dvCombinedFunnel'),{tooltip:{trigger:'item',confine:true,formatter:p=>p.name+'：'+f(p.value)+' 人<br>占总体人数 '+rate(p.value,t.due)},graphic:transitionNames.map((name,i)=>({type:'text',x:document.getElementById('updated-dvCombinedFunnel').clientWidth*.375,top:8+(i+1)*funnelStageHeight+i*funnelGap+(funnelGap-22)/2,z:100,style:{text:name+' '+rate(funnelData[i+1][1],funnelData[i][1]),align:'center',fill:'#4285ef',font:'12px Microsoft YaHei',backgroundColor:'#f2f7ff',padding:[4,12],borderRadius:8}})),series:[{type:'funnel',left:'5%',top:8,bottom:8,width:'65%',min:0,max:Math.max(t.due,1),minSize:'0%',maxSize:'100%',sort:'none',gap:funnelGap,label:{show:true,position:'right',color:'#405777',fontSize:12,formatter:p=>p.name+' '+f(p.value)+' 人'},labelLine:{length:14,lineStyle:{color:'#bdcce0'}},itemStyle:{borderColor:'#fff',borderWidth:1},data:funnelData.map(([name,value,color])=>({name,value,itemStyle:{color}}))}]});
    ['up','down'].forEach(key=>{
      const r=referralDisplay[key],up=key==='up';
      const data=r.stages.map(([name,value],i)=>({name,value,itemStyle:{color:r.colors[i]}}));
      const rates=up?[...r.rates].reverse():r.rates;
      chart(document.getElementById('updated-dvReferral-'+key),{
        tooltip:{trigger:'item',confine:true,textStyle:{fontSize:14},formatter:p=>p.name+'：'+p.value+' 人'},
        graphic:rates.map((text,i)=>({type:'text',left:'center',top:(23+i*27)+'%',style:{text,fill:'#587197',fontSize:14,fontWeight:600}})),
        series:[{type:'funnel',left:'6%',width:'88%',top:12,bottom:12,min:0,max:Math.max(r.stages[0][1],1),minSize:'42%',maxSize:'100%',sort:up?'ascending':'descending',gap:42,funnelAlign:'center',label:{show:true,position:'inside',fontSize:14,fontWeight:600,color:'#fff',formatter:p=>p.name+'  '+p.value+' 人'},labelLine:{show:false},itemStyle:{borderWidth:0},data:up?data.reverse():data}]
      });
    });
    root.querySelectorAll('[data-metric-org]').forEach(el=>{
      const r=d.organizations.find(o=>o.name===el.dataset.metricOrg),m=orgMetrics(r)[el.dataset.metric];
      const formatter=()=>'<strong>'+r.name+' · '+m.title+'</strong><br>'+m.parts.map(([label,n,color])=>'<span style="color:'+color+'">●</span> '+label+'：'+f(n)+' 人（'+rate(n,m.total)+'）').concat(m.details.map(([label,n])=>label+'：'+f(n)+' 人')).join('<br>');
      chart(el,{grid:{left:0,right:0,top:0,bottom:0},tooltip:{trigger:'axis',triggerOn:'mousemove|click',appendToBody:true,confine:false,axisPointer:{type:'none'},formatter},xAxis:{type:'value',max:Math.max(m.total,1),show:false},yAxis:{type:'category',data:[''],show:false},series:m.parts.map(([name,n,color],i)=>{const narrow=n/Math.max(m.total,1)*el.clientWidth<46;return {name,type:'bar',stack:'population',barWidth:24,label:{show:n>0,position:narrow?(i%2?'bottom':'top'):'inside',align:narrow?(i===0?'left':i===m.parts.length-1?'right':'center'):'center',distance:4,fontSize:11,color:'#263f60',formatter:()=>rate(n,m.total)},data:[n],itemStyle:{color}};})});
      const show=()=>echarts.getInstanceByDom(el)?.dispatchAction({type:'showTip',seriesIndex:0,dataIndex:0});
      const hide=()=>echarts.getInstanceByDom(el)?.dispatchAction({type:'hideTip'});
      el.onfocus=show;el.onblur=hide;el.onclick=show;el.onkeydown=e=>{if(e.key==='Escape')hide();if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}};
    });
    root.querySelectorAll('[data-level-index]').forEach(el=>{
      const r=d.levels[Number(el.dataset.levelIndex)];
      const metrics=[{name:'覆盖率',n:r.active,total:r.due,color:'#487cf6',done:'在管',rest:'未在管',base:'应管理'}, {name:'规范管理率',n:r.standard,total:r.evaluable,color:'#58aa98',done:'规范管理',rest:'未达规范',base:'可评价'}];
      chart(el,{
        tooltip:{trigger:'item',triggerOn:'mousemove|click',appendToBody:true,formatter:p=>{const m=metrics[p.seriesIndex];return '<strong>'+r.name+' · '+m.name+'</strong><br>'+m.base+'：'+f(m.total)+' 人<br>'+m.done+'：'+f(m.n)+' 人<br>'+m.rest+'：'+f(m.total-m.n)+' 人<br>'+m.name+'：'+rate(m.n,m.total);}},
        title:metrics.map((m,i)=>({text:rate(m.n,m.total),subtext:m.name,left:(i?75:25)+'%',top:62,textAlign:'center',itemGap:38,textStyle:{fontSize:16,fontWeight:600,color:'#344e70'},subtextStyle:{fontSize:13,color:'#61758e'}})),
        series:metrics.map((m,i)=>({type:'pie',radius:[31,43],center:[(i?75:25)+'%','44%'],label:{show:false},labelLine:{show:false},avoidLabelOverlap:true,data:[{name:m.done,value:m.n,itemStyle:{color:m.color}},{name:m.rest,value:Math.max(0,m.total-m.n),itemStyle:{color:'#e5ebf3'}}]}))
      });
      let metricIndex=0;
      const show=()=>echarts.getInstanceByDom(el)?.dispatchAction({type:'showTip',seriesIndex:metricIndex,dataIndex:0});
      el.onfocus=show;el.onblur=()=>echarts.getInstanceByDom(el)?.dispatchAction({type:'hideTip'});
      el.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();metricIndex=1-metricIndex;show();}if(e.key==='Escape')el.onblur();};
    });
    chart(document.getElementById('updated-dlPie'),{tooltip:{trigger:'item',confine:true,formatter:p=>p.name+'<br>'+f(p.value)+' 人（'+rate(p.value,t.managedDue)+'）'},series:[{type:'pie',radius:'94%',center:['50%','50%'],startAngle:90,itemStyle:{borderWidth:1,borderColor:'#fff'},label:{show:false},labelLine:{show:false},data:d.levels.map(r=>({name:r.name,value:r.due,itemStyle:{color:r.color}}))}]});
    root.querySelectorAll('.dv-chart').forEach(el=>chart(el,{grid:{left:0,right:0,top:0,bottom:0},tooltip:{trigger:'item',confine:true,formatter:()=>el.dataset.value+'%'},xAxis:{type:'value',max:100,show:false},yAxis:{type:'category',show:false},series:[{type:'bar',data:[Number(el.dataset.value)],barWidth:el.dataset.compact?4:12,showBackground:true,backgroundStyle:{color:el.dataset.background||'#dbe3eb',borderRadius:2},itemStyle:{borderRadius:2,color:el.dataset.color||new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#52b4fa'},{offset:1,color:'#258ffc'}])}}]}));instances.forEach(c=>c.resize());});}
  window.renderDashboardUpdated=render;
  const funnelObserver=new ResizeObserver(()=>render());funnelObserver.observe(document.getElementById('updated-dvCombinedFunnel'));
  const rootObserver=new ResizeObserver(()=>{if(root.classList.contains('active'))instances.forEach(c=>c.resize());});rootObserver.observe(root);
  cleanup=()=>{disposed=true;funnelObserver.disconnect();rootObserver.disconnect();instances.forEach(c=>c.dispose());};
  const dialog=document.getElementById('updated-dlDialog');document.getElementById('updated-dlClose').onclick=()=>dialog.close();
  const riskDialog=document.createElement('dialog');
  riskDialog.id='updated-dvRiskDialog';riskDialog.setAttribute('aria-labelledby','updated-dvRiskDialogTitle');root.querySelector('.dl-dashboard').appendChild(riskDialog);
  root.querySelectorAll('[data-risk-detail]').forEach(button=>button.onclick=()=>{
    const scope=button.dataset.riskDetail,regional=scope==='due';
    const rows=view.records.alerts.filter(a=>a.status!=='closed'&&(regional?a.due:view.groups.find(g=>g.name===scope)?.patientIds.has(a.patientId)));
    riskDialog.innerHTML='<h2 id="updated-dvRiskDialogTitle">'+(regional?'到期预警 · 未闭环原因':scope+' · 风险处置详情')+'</h2>'+note(regional?`到期预警 ${d.riskTotals.due} 项，已闭环 ${d.riskTotals.closedCount} 项，未闭环 ${rows.length} 项。以下为模拟明细。`:'以下为全部未闭环预警的模拟明细，含未到期预警；时长、责任团队和原因均为演示数据。')+
      (rows.length?table(['预警 / 患者编号','机构 / 风险类型','持续时间','责任团队','当前进展 / 承接情况','未闭环原因'],rows.map(a=>[a.id+'<br>'+a.patientId,a.org+'<br>'+a.riskType,a.durationHours+' 小时'+(a.overdue?' · 已超时':''),a.responsibleTeam,a.progress+'<br>'+a.acceptance,a.openReason])):'<p>暂无未闭环预警</p>')+'<button type="button" data-risk-close>关闭</button>';
    riskDialog.querySelector('[data-risk-close]').onclick=()=>riskDialog.close();riskDialog.showModal();
  });
  function showPatients(kind,value){
    const rows=view.records.patients.filter(p=>kind==='病种'?p.diseases.includes(value):kind==='等级'?(p.level||'未分级')===value:view.status(p)===value);let page=0;
    function update(){riskDialog.innerHTML='<h2 id="updated-dvRiskDialogTitle">'+value+' · 患者明细</h2>'+note('共 '+rows.length+' 人 · 模拟患者编号')+table(['患者编号','病种','等级','状态'],rows.slice(page*20,(page+1)*20).map(p=>[p.id,p.diseases.join('、'),p.level||'未分级',view.status(p)]))+'<div class="dv-detail-actions"><button data-prev '+(!page?'disabled':'')+'>上一页</button><span>第 '+(page+1)+' / '+Math.max(1,Math.ceil(rows.length/20))+' 页</span><button data-next '+((page+1)*20>=rows.length?'disabled':'')+'>下一页</button><button data-close>关闭</button></div>';riskDialog.querySelector('[data-prev]').onclick=()=>{page--;update();};riskDialog.querySelector('[data-next]').onclick=()=>{page++;update();};riskDialog.querySelector('[data-close]').onclick=()=>riskDialog.close();}
    update();riskDialog.showModal();
  }
  root.querySelectorAll('[data-breakdown]').forEach(b=>b.onclick=()=>showPatients(b.dataset.breakdown,b.dataset.value));
  root.querySelectorAll('[data-org]').forEach(btn=>btn.onclick=()=>{const group=view.groups.find(g=>g.name===btn.dataset.org);if(group?.child)apply(group.child);});
  const back=root.querySelector('#updated-dlScopeBack');if(back)back.onclick=()=>{const next={...view.filters},keys=['org','dept','team','person'];const last=keys.findLastIndex(k=>next[k]);keys.slice(last).forEach(k=>next[k]='');apply(next);};
  if(!controls)controls=StatisticsFilters.mount(filterHost,apply,api.filterEngine,defaults,{variant:'operations',orgLabel:'全部机构',applyOnChange:false,hierarchical:true});
  render();
  }
  apply(defaults);
  if(new URLSearchParams(location.search).get('view')==='dashboardUpdated')showListView('dashboardUpdated');
})();
