(function(){
  const root=document.getElementById('operationsStatisticsView');
  if(!root)return;
  const charts=[];
  const base={active:322,enrolled:86,coverage:91.2,standard:92.0,risk:1,ai:83.7};
  const fmt=(value,digits=0)=>Number(value).toLocaleString('zh-CN',{minimumFractionDigits:digits,maximumFractionDigits:digits});

  root.innerHTML=`<div class="os-dashboard">
    <header class="os-header">
      <div><h1>AI患者运营管理看板</h1><p>院领导视图&nbsp;&nbsp;|&nbsp;&nbsp;全院运营与管理成效</p></div>
      <div class="os-header-meta"><span class="os-demo-tag">演示数据</span><span>更新于&nbsp; 2026-09-01 08:00</span><button type="button" class="os-outline-button" id="osMetricButton">指标口径</button></div>
    </header>
    <div id="osFilterHost" class="os-filter-host" role="search" aria-label="统计报表查询条件"></div>
    <section class="os-kpi-grid" aria-label="核心运营指标">
      <article class="os-kpi"><h2>期末在管患者数</h2><strong id="osActive">322<small>人</small></strong><p class="blue">较上月增加 26 人</p><em>在管病种病例 345 例</em></article>
      <article class="os-kpi"><h2>本期新增入组</h2><strong id="osEnrolled">86<small>人</small></strong><p class="blue">较上月增加 12 人</p></article>
      <article class="os-kpi"><h2>重点患者管理覆盖率</h2><strong id="osCoverage">91.2<small>%</small></strong><p class="orange">目标 95% · 差 3.8 个百分点</p></article>
      <article class="os-kpi"><h2>规范管理率</h2><strong id="osStandard">92.0<small>%</small></strong><p class="orange">目标 95% · 差 3.0 个百分点</p></article>
      <article class="os-kpi danger"><h2>高危超时未处置患者</h2><strong id="osRisk">1<small>人</small></strong><em>涉及内分泌科</em></article>
      <article class="os-kpi"><h2>AI独立有效完成率</h2><strong id="osAi">83.7<small>%</small></strong><em>限允许AI独立完成的任务</em></article>
    </section>

    <section class="os-main-grid">
      <article class="os-card os-scale-card"><h2 class="os-title">管理规模与患者覆盖</h2><h3>期末在管人数趋势</h3><div id="osTrendChart" class="os-chart os-trend-chart" aria-label="期末在管人数趋势折线图"></div><h3>本期筛查入组队列</h3><div id="osCohortChart" class="os-chart os-cohort-chart" aria-label="本期筛查入组队列条形图"></div><div class="os-band">入组转化率 81.9%　|　符合条件未入组 <b>19 人</b></div></article>
      <article class="os-card os-quality-card"><div class="os-title-row"><div><h2 class="os-title">科室管理质量对比</h2><p>先看科室差距，再下钻原因</p></div><div class="os-quality-actions"><span>当前维度：科室 ›</span><select id="osQualitySort" aria-label="科室管理质量排序"><option value="standard">按规范管理率排序</option><option value="coverage">按重点覆盖率排序</option><option value="lost">按患者失管率排序</option></select></div></div><div class="os-legend"><i class="green"></i>绿色：达到目标　 <i class="orange"></i>橙色：未达目标</div><div class="os-table-wrap"><table class="os-table"><thead><tr><th>科室</th><th>在管人数</th><th>重点覆盖率</th><th>规范管理率</th><th>患者失管率</th><th>高危超时</th></tr></thead><tbody id="osQualityBody"></tbody></table></div><p class="os-note">规范管理率目标 95% · 点击科室查看病种与团队差异</p><div class="os-warning-band"><b>!</b><span>2 个科室规范管理率未达目标：内分泌科、全科医学科</span></div></article>
    </section>

    <section class="os-bottom-grid">
      <article class="os-card os-disease-card"><div class="os-title-row"><div><h2 class="os-title">分病种管理成效</h2><p>按病种分别评价，不合并临床达标率</p></div><button type="button" class="os-pill-button">病种详情 ›</button></div><table class="os-table os-disease-table"><thead><tr><th>病种</th><th>核心结果</th><th>本期</th><th>较上期</th><th>可评价病例</th></tr></thead><tbody><tr><td>慢性肾病（CKD）</td><td>eGFR稳定率</td><td><span class="os-progress"><i style="width:80%"></i></span>80.0%</td><td class="good">+2.0 个百分点</td><td>100 例</td></tr><tr><td>高血压</td><td>血压达标率</td><td><span class="os-progress"><i style="width:75%"></i></span>75.0%</td><td class="good">+5.0 个百分点</td><td>140 例</td></tr><tr><td>糖尿病</td><td>HbA1c达标率</td><td><span class="os-progress"><i style="width:63%"></i></span>63.0%</td><td class="bad">−5.0 个百分点</td><td>100 例</td></tr></tbody></table><div class="os-table-foot"><span>按各病种既定规则与评价窗口计算；不同病种不直接排名</span><a href="#" onclick="return false">可评价覆盖率见详情 ›</a></div></article>
      <article class="os-card os-ai-card"><h2 class="os-title">AI应用价值</h2><div class="os-ai-stats"><div><span>适用任务覆盖率</span><strong>86.0<small>%</small></strong></div><div><span>独立有效完成率</span><strong>83.7<small>%</small></strong></div></div><h3>已到期AI任务的验收结果</h3><div id="osAiChart" class="os-chart os-ai-chart" aria-label="AI任务验收结果堆叠条形图"></div><div class="os-ai-legend"><span><i class="blue"></i>独立有效完成&nbsp; 83.7%</span><span><i class="cyan"></i>人工参与完成&nbsp; 12.8%</span><span><i class="orange"></i>尚未有效完成&nbsp; 3.5%</span></div><div class="os-ai-result"><b>净节省医护工时：<strong>待核验</strong></b><span>需结合人工审核及复核、接管、返工工时</span></div></article>
      <article class="os-card os-referral-card"><div class="os-title-row"><h2 class="os-title">双向转诊协同</h2><span>本院发起转诊</span></div><div class="os-referral-funnels"><section><header><b>向上转诊</b><strong>闭环率 83.3%</strong></header><div id="osUpReferralChart" class="os-chart os-referral-chart" aria-label="向上转诊漏斗图"></div><p>待接收 2 例　|　已接收未到院 2 例</p></section><section class="down"><header><b>向下转诊</b><strong>闭环率 83.3%</strong></header><div id="osDownReferralChart" class="os-chart os-referral-chart" aria-label="向下转诊漏斗图"></div><p>待接收 1 例　|　已交接待首项服务 1 例</p></section></div></article>
    </section>
    <footer class="os-footer">数据仅用于界面演示，非真实医院统计　|　全院 → 院区/机构 → 科室 → 团队 → 个人</footer>
    <div class="os-metric-popover" id="osMetricPopover" hidden>指标均按筛选范围和院级统一口径计算；比例类指标保留 1 位小数。</div>
  </div>`;

  const departments=[
    {name:'心内科',active:80,coverage:93.8,standard:95.7,lost:2.1,risk:0},
    {name:'肾内科',active:110,coverage:97.1,standard:95.0,lost:2.6,risk:0},
    {name:'内分泌科',active:92,coverage:84.8,standard:87.8,lost:4.2,risk:1},
    {name:'全科医学科',active:40,coverage:85.7,standard:87.5,lost:3.8,risk:0}
  ];
  const renderTable=(sort='standard')=>{
    const rows=[...departments].sort((a,b)=>sort==='lost'?a.lost-b.lost:b[sort]-a[sort]);
    document.getElementById('osQualityBody').innerHTML=rows.map(row=>`<tr><td>${row.name}</td><td>${row.active}</td><td>${row.coverage.toFixed(1)}%</td><td class="${row.standard>=95?'target':'miss'}">${row.standard.toFixed(1)}%</td><td>${row.lost.toFixed(1)}%</td><td class="${row.risk?'bad':''}">${row.risk} 人</td></tr>`).join('');
  };

  function chart(id,option){
    const element=document.getElementById(id);if(!element||!window.echarts)return;
    const instance=window.echarts.getInstanceByDom(element)||window.echarts.init(element);instance.setOption(option,true);if(!charts.includes(instance))charts.push(instance);
  }
  function renderCharts(){
    chart('osTrendChart',{animationDuration:400,grid:{left:48,right:18,top:8,bottom:28},tooltip:{trigger:'axis',confine:true},xAxis:{type:'category',boundaryGap:false,data:['3月','4月','5月','6月','7月','8月'],axisTick:{show:false},axisLine:{lineStyle:{color:'#cdd9e8'}},axisLabel:{color:'#5d7597'}},yAxis:{type:'value',min:0,max:400,interval:100,axisLine:{show:false},axisTick:{show:false},splitLine:{lineStyle:{color:'#e8eef6'}},axisLabel:{color:'#5d7597'}},series:[{type:'line',smooth:.18,data:[248,266,282,297,296,322],symbol:'circle',symbolSize:7,label:{show:true,position:'top',color:'#315b8f',fontSize:11},lineStyle:{color:'#1677ff',width:2},itemStyle:{color:'#1677ff'},areaStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'rgba(22,119,255,.24)'},{offset:1,color:'rgba(22,119,255,.03)'}]}}}]});
    chart('osCohortChart',{animationDuration:400,grid:{left:88,right:44,top:3,bottom:4},tooltip:{trigger:'axis',axisPointer:{type:'shadow'},confine:true},xAxis:{type:'value',show:false,max:760},yAxis:{type:'category',inverse:true,data:['筛查','异常','符合入组','实际入组'],axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#2c4c74',fontSize:12}},series:[{type:'bar',barWidth:11,showBackground:true,backgroundStyle:{color:'#e8eef6',borderRadius:6},itemStyle:{color:'#3f91ee',borderRadius:6},label:{show:true,position:'right',color:'#315b8f',formatter:'{c} 人'},data:[720,160,105,86]}]});
    chart('osAiChart',{animationDuration:400,grid:{left:0,right:0,top:0,bottom:0},xAxis:{type:'value',max:100,show:false},yAxis:{type:'category',data:['任务'],show:false},series:[{type:'bar',stack:'total',barWidth:24,itemStyle:{color:'#297ff2',borderRadius:[4,0,0,4]},label:{show:true,position:'inside',formatter:'83.7%',color:'#fff',fontWeight:700},data:[83.7]},{type:'bar',stack:'total',barWidth:24,itemStyle:{color:'#34b7bf'},label:{show:true,position:'inside',formatter:'12.8%',color:'#fff',fontSize:11,fontWeight:700},data:[12.8]},{type:'bar',stack:'total',barWidth:24,itemStyle:{color:'#f59b23',borderRadius:[0,4,4,0]},label:{show:true,position:'inside',formatter:'3.5%',color:'#fff',fontSize:10},data:[3.5]}]});
    chart('osUpReferralChart',referralFunnelOption([24,22,20,20],['申请','接收','到院','诊疗反馈'],['#2f80ed','#4c96ea','#68a9e2','#39a6b9']));
    chart('osDownReferralChart',referralFunnelOption([12,11,11,10],['申请','接收','交接','首面服务'],['#29a7b2','#43b5b1','#62bfa9','#36aa86']));
  }
  function referralFunnelOption(values,names,colors){
    return {animationDuration:450,tooltip:{trigger:'item',confine:true,formatter:item=>`${item.name}<br><b>${item.value} 人</b>`},series:[{type:'funnel',left:'5%',top:8,width:'90%',height:'90%',minSize:'46%',maxSize:'100%',sort:'descending',gap:5,label:{show:true,position:'inside',color:'#fff',fontSize:11,fontWeight:700,formatter:item=>`${item.name}  ${item.value}`},labelLine:{show:false},itemStyle:{borderColor:'#fff',borderWidth:1},emphasis:{label:{fontSize:12}},data:values.map((value,index)=>({value,name:names[index],itemStyle:{color:colors[index]}}))}]};
  }
  function applyFilters(values){
    const factor=(values.org||values.dept||values.team||values.person||values.disease)?.86:1;
    document.getElementById('osActive').innerHTML=`${fmt(base.active*factor)}<small>人</small>`;
    document.getElementById('osEnrolled').innerHTML=`${fmt(base.enrolled*factor)}<small>人</small>`;
    document.querySelector('.os-header-meta>span:nth-child(2)').textContent='更新于  2026-09-01 08:00';
  }
  function mountFilters(){
    if(!window.StatisticsFilters||!window.StatisticsData)return;
    window.StatisticsFilters.mount(document.getElementById('osFilterHost'),applyFilters,window.StatisticsData,{start:'2026-08-01',end:'2026-08-31'},{variant:'operations',applyOnChange:false,teams:['全部团队','心内科随访团队','肾病管理团队','糖尿病共管团队']});
  }
  document.getElementById('osQualitySort').addEventListener('change',event=>renderTable(event.target.value));
  document.getElementById('osMetricButton').addEventListener('click',()=>{const pop=document.getElementById('osMetricPopover');pop.hidden=!pop.hidden;});
  window.renderOperationsStatistics=function(){requestAnimationFrame(()=>{charts.forEach(item=>item.resize());renderCharts();});};
  window.addEventListener('resize',()=>charts.forEach(item=>item.resize()));
  renderTable();mountFilters();renderCharts();
})();
