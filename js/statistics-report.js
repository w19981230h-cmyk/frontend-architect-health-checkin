(function () {
  const $ = id => document.getElementById(id);
  const report = $('statisticsReportView');
  const charts = [];
  if (!report) return;
  const kpis = [
    ['管理患者数','12,680','人','较上期 +8.4%','good','#e7f1ff'], ['病种管理病例','18,420','例','多病共管 4,260 人','','#e8f8f3'],
    ['筛查异常率','18.6','%','较上期 +1.2%','warn','#fff4e4'], ['入组转化率','81.7','%','较上期 +3.1%','good','#e8f8fb'],
    ['规范管理率','86.4','%','目标值 ≥85%','good','#edf1ff'], ['综合绩效','88.6','分','4 个病种进入优秀','good','#f3eaff']
  ];
  const progress = rows => `<div class="sr-progress-list">${rows.map(x=>`<div class="sr-progress-row"><span>${x[0]}</span><div class="sr-progress-track"><div class="sr-progress-bar ${x[2]||''}" style="width:${x[1]}%"></div></div><strong>${x[3]||x[1]+'%'}</strong></div>`).join('')}</div>`;
  report.innerHTML = `
  <div class="sr-dashboard">
    <header class="sr-hero"><div><h1>数据看板</h1><p>全院 · 全部病种运营总览｜从筛查发现、纳入管理到服务成效，统一观察专病管理质量</p></div><span class="sr-health">数据运行正常</span></header>
    <div class="sr-filters" role="search" aria-label="数据看板筛选条件">
      <label class="sr-filter"><span>组织</span><select data-sr-filter><option>全院</option><option>总院</option><option>城南院区</option></select></label>
      <label class="sr-filter"><span>病种</span><select data-sr-filter><option>全部病种</option><option>高血压</option><option>糖尿病</option></select></label>
      <label class="sr-filter"><span>时间</span><select data-sr-filter><option>本年度</option><option>本季度</option><option>本月</option></select></label>
      <label class="sr-filter"><span>患者来源</span><select data-sr-filter><option>全部来源</option><option>门诊</option><option>住院</option></select></label>
      <button class="sr-reset" type="button" data-sr-reset>重置筛选</button>
    </div>
    <section class="sr-kpis" aria-label="核心运营指标">${kpis.map(k=>`<article class="sr-kpi" style="--wash:${k[5]}"><div class="sr-kpi-label">${k[0]}</div><div class="sr-kpi-value">${k[1]}<small>${k[2]}</small></div><div class="sr-kpi-note ${k[4]}">${k[3]}</div></article>`).join('')}</section>

    <section class="sr-section"><h2 class="sr-section-title"><span>患者流转</span><span class="sr-section-hint">主链路追踪转化，转诊作为医疗协同支线单独统计</span></h2><div class="sr-grid-2">
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">筛查与入组转化</div><div class="sr-card-sub">筛查 → 异常 → 符合入组 → 入组 → 在管 → 结案</div></div><button class="sr-link">查看明细 ›</button></div>
        <div class="sr-funnel">${[['12,680','筛查人数','#eaf3fe'],['2,358','异常人数','#ddecff'],['1,680','符合入组','#d3e7ff'],['1,373','成功入组','#c8e0ff'],['1,298','有效在管','#b9d7ff']].map(x=>`<div class="sr-funnel-step" style="--step-bg:${x[2]}"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</div>
        <div class="sr-rates"><div><strong>18.6%</strong><span>筛查人数 → 异常人数</span></div><div><strong>71.2%</strong><span>异常人数 → 符合入组</span></div><div><strong>81.7%</strong><span>符合入组 → 成功入组</span></div><div><strong>94.5%</strong><span>成功入组 → 有效在管</span></div></div>
        <div class="sr-alert">本期主要流失发生在“异常 → 符合入组”，建议下钻查看病种诊断确认及入组条件超限情况。</div>
      </article>
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">双向转诊</div><div class="sr-card-sub">看接收、到院与后续管理是否真正闭环</div></div><div class="sr-segment"><button>向上转诊</button><button class="active">向下转诊</button></div></div>
        <div class="sr-call-flow">${[['196人','发起下转'],['182人','基层接收'],['169人','纳入管理'],['158人','首次随访']].map((x,i)=>`${i?'<span class="sr-arrow">›</span>':''}<div class="sr-call-node"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</div>
        <div class="sr-call-rates"><div><strong>92.9%</strong><span>接收率</span></div><div><strong>86.2%</strong><span>管理完整率</span></div><div><strong>93.5%</strong><span>首次随访率</span></div></div><div class="sr-alert">13 人已接收但未纳入基层管理，需关注管理方案与责任团队交接。</div>
      </article>
    </div></section>

    <section class="sr-section"><h2 class="sr-section-title"><span>管理规模</span><span class="sr-section-hint">患者数与服务投入按同一组织维度对照</span></h2><div class="sr-grid-2 sr-grid-equal">
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">管理患者规模</div><div class="sr-card-sub">在管人数与本期新增</div></div><div class="sr-segment"><button class="active">科室</button><button>团队</button><button>医护</button><button>方案</button></div></div><div id="srScaleChart" class="sr-chart tall" aria-label="管理患者规模柱状图"></div></article>
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">管理规模趋势</div><div class="sr-card-sub">近 6 个月入组与在管变化</div></div><span class="sr-health">同比 +12.6%</span></div><div id="srTrendChart" class="sr-chart tall" aria-label="管理规模趋势折线图"></div></article>
    </div></section>

    <section class="sr-section"><h2 class="sr-section-title"><span>服务执行</span><span class="sr-section-hint">拆清“未下发、未触达、未完成”责任环节</span></h2><div class="sr-grid-2 sr-grid-equal">
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">任务执行漏斗</div><div class="sr-card-sub">本期应执行任务的实际完成链路</div></div><span class="sr-health">总体完成率 71.4%</span></div><div class="sr-task-flow">${[['12,460','应执行','100%'],['12,108','已下发','97.2%'],['10,684','已触达','88.2%'],['9,426','已响应','88.2%'],['8,896','已完成','94.4%']].map(x=>`<div class="sr-task-step"><strong>${x[0]}</strong><span>${x[1]}</span><small>${x[2]}</small></div>`).join('')}</div><div class="sr-alert">主要损耗在“下发 → 触达”环节，未触达 1,424 项，建议关注失联联系方式与应急人群覆盖。</div></article>
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">各类任务完成率</div><div class="sr-card-sub">任务类型可继续下钻至团队和医护</div></div><button class="sr-link">任务明细 ›</button></div>${progress([['健康随访',91,'green'],['复诊提醒',86],['健康打卡',78],['健康宣教',74],['AI 外呼',68,'orange']])}</article>
    </div></section>

    <section class="sr-section"><h2 class="sr-section-title"><span>疾病管理成效</span><span class="sr-section-hint">全部病种仅展示可统一解释的通用指标</span></h2><div class="sr-grid-2">
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">病种指标用成效</div><div class="sr-card-sub">指标与量性结果不做简单平均</div></div><button class="sr-link">指标口径 ›</button></div><div class="sr-outcomes"><div><div id="srOutcome1" class="sr-outcome-chart"></div><div class="sr-outcome-label">有效达标率</div></div><div><div id="srOutcome2" class="sr-outcome-chart"></div><div class="sr-outcome-label">指标改善率</div></div><div><div id="srOutcome3" class="sr-outcome-chart"></div><div class="sr-outcome-label">异常下降率</div></div></div><div class="sr-mini-progress">${progress([['持续监测患者',88,'','10,651 人'],['指标改善患者',76,'','9,130 人'],['持续恶化患者',7,'','862 人']])}</div></article>
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">人群结构</div><div class="sr-card-sub">按风险等级观察在管人群构成</div></div><div class="sr-segment"><button class="active">风险</button><button>来源</button><button>年龄</button></div></div><div style="display:grid;grid-template-columns:160px 1fr;align-items:center"><div id="srRiskChart" class="sr-chart small"></div>${progress([['低风险',46,'green'],['中风险',34],['高风险',20,'orange']])}</div></article>
    </div></section>

    <section class="sr-section"><h2 class="sr-section-title"><span>风险预警</span><span class="sr-section-hint">不只看报警数量，更看响应、处置和重复发生</span></h2><div class="sr-grid-2 sr-grid-equal">
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">预警事件构成</div><div class="sr-card-sub">本期累计预警 386 次，涉及 268 人</div></div><span class="sr-health" style="color:#ec646c;background:#fff1f2;border-color:#ffd7da">未处置 27</span></div><div class="sr-risk-list">${[['高','高危预警','需医护优先跟进','58','15.0%','high'],['中','中危预警','需 24 小时内处理','142','36.8%','mid'],['低','一般提醒','纳入常规随访','186','48.2%','low']].map(x=>`<div class="sr-risk-row"><span class="sr-risk-tag ${x[5]}">${x[0]}</span><div class="sr-risk-copy"><strong>${x[1]}</strong><span>${x[2]}</span></div><div class="sr-risk-number"><strong>${x[3]}</strong><span>${x[4]}</span></div></div>`).join('')}</div></article>
      <article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">预警闭环质量</div><div class="sr-card-sub">处置效率与复发情况</div></div><button class="sr-link">预警明细 ›</button></div><div class="sr-risk-env"><div class="sr-risk-stat"><strong class="good">93.0%</strong><span>预警处置率</span></div><div class="sr-risk-stat"><strong>2.6 小时</strong><span>平均响应时长</span></div><div class="sr-risk-stat"><strong style="color:#e99b20">34 人</strong><span>重复报警患者</span></div><div class="sr-risk-stat"><strong class="bad">27 次</strong><span>超时未处置</span></div></div><div class="sr-alert red">高危预警中仍有 8 次未闭环，主要集中在基层协作机构，建议直接下钻责任团队。</div></article>
    </div></section>

    <section class="sr-section"><h2 class="sr-section-title"><span>质量绩效</span><span class="sr-section-hint">先比较组织结果，再下钻问题指标；转换量不直接计分</span></h2><article class="sr-card"><div class="sr-card-head"><div><div class="sr-card-title">组织综合绩效排名</div><div class="sr-card-sub">绩效以规范管理、任务执行、风险闭环和结果质量构成</div></div><div class="sr-segment"><button class="active">机构</button><button>科室</button><button>团队</button><button>个人</button></div></div><div class="sr-table-wrap"><table class="sr-table"><thead><tr><th>排名 / 组织</th><th>管理患者</th><th>规范管理率</th><th>复诊率</th><th>路径执行率</th><th>任务完成率</th><th>失访率</th><th>预警处置率</th><th>综合得分</th></tr></thead><tbody>${[['总院','4,620','92.4%','90.1%','93.2%','91.5%','2.1%','97.0%','94.2'],['城南院区','3,168','88.6%','86.4%','89.0%','87.2%','3.8%','94.3%','89.1'],['基层协作A院','1,286','84.8%','81.2%','86.3%','83.4%','5.2%','91.8%','84.6'],['基层协作B院','986','79.3%','75.8%','78.9%','80.1%','7.6%','87.2%','78.8']].map((r,i)=>`<tr><td><span class="sr-rank ${i<2?'top':''}">${i+1}</span>　${r[0]}</td>${r.slice(1,-1).map(c=>`<td>${c}</td>`).join('')}<td><span class="sr-score ${i>1?'mid':''}">${r[8]}</span></td></tr>`).join('')}</tbody></table></div></article></section>
    <footer class="sr-footer">展示数据为原型示例 · 所有统计口径支持在指标配置中统一维护</footer>
  </div>`;

  function addChart(el, option) { if (!el || !window.echarts) return; const chart = window.echarts.getInstanceByDom(el) || window.echarts.init(el); chart.setOption(option, true); if (!charts.includes(chart)) charts.push(chart); }
  function ring(id, value, color) { addChart($(id), { animationDuration:500, series:[{type:'pie',radius:['66%','82%'],center:['50%','50%'],silent:true,label:{show:true,position:'center',formatter:value+'%',fontSize:16,fontWeight:800,color:'#2b3a50'},data:[{value,itemStyle:{color}},{value:100-value,itemStyle:{color:'#edf2f7'}}]}] }); }
  function initCharts() {
    if (!report.classList.contains('active') || !window.echarts) return;
    addChart($('srScaleChart'), {animationDuration:600,color:['#2f76dd','#23b493'],tooltip:{trigger:'axis'},legend:{bottom:0,left:0,textStyle:{fontSize:10,color:'#748199'}},grid:{left:36,right:16,top:12,bottom:38},xAxis:{type:'category',data:['肾内科','内分泌科','心内科','乳甲外科','全科医学'],axisLine:{lineStyle:{color:'#e7edf5'}},axisTick:{show:false},axisLabel:{color:'#7b889b',fontSize:10}},yAxis:{type:'value',axisLabel:{show:false},splitLine:{lineStyle:{color:'#eef2f7'}}},series:[{name:'在管人数',type:'bar',barWidth:42,data:[2860,3180,2650,1980,2280],itemStyle:{borderRadius:[4,4,0,0]}},{name:'本期新增',type:'bar',barWidth:42,data:[820,960,730,570,770],itemStyle:{borderRadius:[4,4,0,0]}}]});
    addChart($('srTrendChart'), {animationDuration:650,tooltip:{trigger:'axis'},grid:{left:36,right:22,top:25,bottom:30},xAxis:{type:'category',boundaryGap:false,data:['4月','5月','6月','7月','8月','9月'],axisLine:{lineStyle:{color:'#e8edf5'}},axisTick:{show:false},axisLabel:{color:'#8794a6',fontSize:10}},yAxis:{type:'value',axisLabel:{show:false},splitLine:{lineStyle:{color:'#eef2f7'}}},series:[{type:'line',smooth:.35,symbol:'circle',symbolSize:6,data:[760,920,1080,1290,1450,1680],lineStyle:{color:'#2e73dc',width:3},itemStyle:{color:'#fff',borderColor:'#2e73dc',borderWidth:2},areaStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'rgba(46,115,220,.22)'},{offset:1,color:'rgba(46,115,220,.02)'}]}}}]});
    ring('srOutcome1',84,'#2e73dc'); ring('srOutcome2',72,'#18aa78'); ring('srOutcome3',68,'#ef9f1c');
    addChart($('srRiskChart'), {animationDuration:500,series:[{type:'pie',radius:['55%','80%'],center:['50%','50%'],label:{show:true,position:'center',formatter:'12,680\n{small|管理患者}',fontSize:16,fontWeight:800,color:'#273750',rich:{small:{fontSize:9,color:'#8a97a8',lineHeight:20,fontWeight:400}}},data:[{value:46,itemStyle:{color:'#2e73dc'}},{value:34,itemStyle:{color:'#dce8f7'}},{value:20,itemStyle:{color:'#eef3f8'}}]}]});
  }
  window.renderStatisticsReport = () => requestAnimationFrame(initCharts);
  window.addEventListener('resize', () => charts.forEach(chart => chart.resize()));
  report.addEventListener('click', event => { const reset=event.target.closest('[data-sr-reset]'); if(reset) report.querySelectorAll('[data-sr-filter]').forEach(select=>select.selectedIndex=0); const segment=event.target.closest('.sr-segment button'); if(segment){segment.parentElement.querySelectorAll('button').forEach(button=>button.classList.remove('active'));segment.classList.add('active');} });
})();
