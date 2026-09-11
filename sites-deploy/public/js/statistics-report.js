(function () {
  const $ = id => document.getElementById(id);
  const report = $('statisticsReportView');
  if (!report) return;

  const charts = [];
  const organizationOptions = {
    '全部集团': ['全部科室', '肾内科', '内分泌科', '心血管内科', '全科医学科'],
    '区域医疗集团': ['全部科室', '肾内科', '内分泌科', '心血管内科'],
    '基层医联体': ['全部科室', '全科医学科', '康复医学科', '慢病管理科']
  };
  const doctorOptions = {
    '全部科室': ['全部人员'],
    '肾内科': ['全部人员', '张明远', '林志强', '王雨桐'],
    '内分泌科': ['全部人员', '陈慧敏', '许静怡', '孙雅雯'],
    '心血管内科': ['全部人员', '周晓峰', '王建华', '郑凯文'],
    '全科医学科': ['全部人员', '李文清', '赵文博', '何思源'],
    '康复医学科': ['全部人员', '高俊杰', '徐安琪'],
    '慢病管理科': ['全部人员', '刘思敏', '顾晓彤']
  };
  const diseaseOptions = ['全部病种', '慢性肾病（CKD）', '高血压', '糖尿病', '乳腺结节'];
  const dateValue = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const today = new Date();
  const defaultStartDate = dateValue(today);
  const defaultEndDate = dateValue(today);
  let filterState = { org:'', dept:'', person:'', disease:'', start:defaultStartDate, end:defaultEndDate };
  const n = value => Math.max(0, Math.round(value)).toLocaleString('zh-CN');
  const percent = (part, total) => total ? +(part * 100 / total).toFixed(1) : 0;
  const scaled = (value, factor) => Math.max(0, Math.round(value * factor));
  const seed = value => [...value].reduce((total, char) => total + char.charCodeAt(0), 0);
  const icon = type => `<span class="sr-summary-icon sr-icon-${type}" aria-hidden="true"></span>`;

  report.innerHTML = `
    <div class="sr-dashboard">
      <header class="sr-hero">
        <div><h1>数据报表</h1><p data-sr-summary>全部集团 · 全部科室 · 全部人员 · 全部病种｜${defaultStartDate} 至 ${defaultEndDate}</p></div>
        <span class="sr-health">数据运行正常</span>
      </header>
      <div id="srFilterHost" class="sr-filter-host" role="search" aria-label="数据报表筛选条件"></div>

      <section class="sr-overview" aria-label="运营概览">
        <article class="sr-overview-metric" title="截至结束日期，管理状态为管理中的患者ID去重数"><span>期末在管患者数</span><strong id="srPeriodEndActive">4,021<small>人</small></strong><div class="sr-overview-compare" data-sr-compare="0"></div></article>
        <article class="sr-overview-metric" title="按患者ID＋标准病种编码去重；同一患者有CKD和糖尿病算2例"><span>病种管理病例数</span><strong id="srDiseaseCases">18,420<small>例</small></strong><div class="sr-overview-compare" data-sr-compare="1"></div></article>
        <article class="sr-overview-metric" title="入组时间在查询范围内的患者ID去重数"><span>本期新增入组患者数</span><strong id="srPeriodEnrolled">4,310<small>人</small></strong><div class="sr-overview-compare" data-sr-compare="2"></div></article>
        <article class="sr-overview-metric" title="本期入组后截至期末仍在管人数÷本期成功入组人数×100%"><span>入组留存率</span><strong id="srRetentionRate">93.3<small>%</small></strong><div class="sr-overview-compare" data-sr-compare="3"></div></article>
        <article class="sr-overview-metric" title="规定时间内完成全部到期必做节点的患者数÷可评价患者数×100%"><span>规范管理率</span><strong id="srStandardRate">92.4<small>%</small></strong><div class="sr-overview-compare" data-sr-compare="4"></div></article>
        <article class="sr-overview-metric" title="达到本病种管理目标的病例数÷具有有效评价数据的病例数×100%"><span>核心目标达成率</span><strong id="srCoreTargetRate">58.2<small>%</small></strong><div class="sr-overview-compare" data-sr-compare="5"></div></article>
        <article class="sr-overview-metric is-danger" title="截至结束日期，存在高危预警且预警状态未关闭的患者ID去重数"><span>高危未闭环患者数</span><strong id="srHighRiskOpen">8<small>人</small></strong><div class="sr-overview-compare" data-sr-compare="6"></div></article>
        <article class="sr-overview-metric" title="AI独立闭环任务数÷已完成AI任务数×100%"><span>AI独立闭环率</span><strong id="srAiClosedRate">83.6<small>%</small></strong><div class="sr-overview-compare" data-sr-compare="7"></div></article>
      </section>

      <section class="sr-flow-row">
        <article class="sr-panel"><h2 class="sr-panel-title">患者管理流转</h2><div id="srPatientFunnel" class="sr-chart sr-patient-chart" aria-label="患者管理流转漏斗图"></div></article>
        <article class="sr-panel"><h2 class="sr-panel-title">双向转诊</h2><div class="sr-referral-grid">
          <section><h3>向上转诊</h3><div id="srUpFunnel" class="sr-chart sr-referral-chart" aria-label="向上转诊漏斗图"></div><div class="sr-referral-result"><div><span>转诊闭环率</span><strong id="srUpClosed">80.9%</strong></div><div><span>平均接收时长</span><strong id="srUpAverageHours">2.4小时</strong></div><div><span>未到院人数</span><strong id="srUpNotArrived">17人</strong></div></div></section>
          <section><h3>向下转诊</h3><div id="srDownFunnel" class="sr-chart sr-referral-chart" aria-label="向下转诊漏斗图"></div><div class="sr-referral-result"><div><span>转诊闭环率</span><strong id="srDownClosed">88.4%</strong></div><div><span>未接续管理人数</span><strong id="srDownNotContinued">4人</strong></div></div></section>
        </div></article>
      </section>

      <section class="sr-content-row">
        <article class="sr-panel"><h2 id="srEffectTitle" class="sr-panel-title">通用管理成效 · 病种对比</h2><div class="sr-table-wrap"><table class="sr-table sr-disease-table"><thead id="srDiseaseHead"><tr><th>病种</th><th>管理病例</th><th>目标达成数</th><th>目标达成率</th><th>风险患者</th></tr></thead><tbody id="srDiseaseBody"></tbody></table></div></article>
        <article class="sr-panel"><h2 class="sr-panel-title">风险与安全</h2><div id="srSafetyMetrics" class="sr-metric-grid safety"></div></article>
      </section>

      <section class="sr-panel sr-section-panel"><h2 class="sr-panel-title">管理执行质量</h2><div id="srQualityChart" class="sr-chart sr-quality-chart" aria-label="管理执行质量目标对比图"></div></section>

      <section class="sr-panel sr-section-panel" hidden aria-hidden="true">
        <h2 class="sr-panel-title">AI应用情况</h2>
        <div class="sr-ai-layout">
          <article class="sr-ai-block sr-ai-flow-block">
            <h3>AI执行漏斗</h3>
            <div id="srAiFunnel" class="sr-chart sr-ai-funnel" aria-label="AI执行漏斗图"></div>
            <div class="sr-ai-inline-values">
              <h3>AI价值指标</h3>
              <div id="srAiValueMetrics" class="sr-ai-card-grid"></div>
            </div>
          </article>
        </div>
      </section>

      <section id="srRankingPanel" class="sr-panel sr-section-panel"><div class="sr-panel-heading"><h2 id="srRankingTitle" class="sr-panel-title">机构排名</h2><span id="srRankingDimension" class="sr-dimension-tag">当前维度：机构</span></div><div id="srRankingTableWrap" class="sr-table-wrap"><table class="sr-table sr-ranking-table"><thead><tr><th>排名</th><th id="srRankingNameHead">机构</th><th>在管人数</th><th>规范管理率</th><th>目标达成率</th><th>预警闭环率</th><th>失访率</th><th>操作</th></tr></thead><tbody id="srRankingBody"></tbody></table></div><div id="srPersonalDetail" class="sr-person-detail" hidden></div></section>
      <footer class="sr-footer">当前为业务原型模拟数据 · 数量与比例按筛选范围和统一统计口径联动计算</footer>
    </div>`;

  function factorForFilters() {
    const institution = filterState.org || '全部集团';
    const department = filterState.dept || '全部科室';
    const doctor = filterState.person || '全部人员';
    const disease = filterState.disease ? (filterState.disease === 'CKD' ? '慢性肾病（CKD）' : filterState.disease) : '全部病种';
    let factor = institution === '全部集团' ? 1 : institution === '区域医疗集团' ? 0.63 : 0.37;
    if (department !== '全部科室') factor *= { '肾内科':.28, '内分泌科':.25, '心血管内科':.23, '全科医学科':.2, '康复医学科':.16, '慢病管理科':.14 }[department] || .2;
    if (doctor !== '全部人员') factor *= .36 + (seed(doctor) % 12) / 100;
    if (disease !== '全部病种') factor *= { '慢性肾病（CKD）':.28, '高血压':.25, '糖尿病':.29, '乳腺结节':.18 }[disease] || .24;
    const start = new Date(filterState.start || defaultStartDate);
    const end = new Date(filterState.end || defaultEndDate);
    const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
    const defaultDays = Math.max(1, Math.round((today - new Date(today.getFullYear(), 0, 1)) / 86400000) + 1);
    factor *= Math.min(1, Math.max(.08, days / defaultDays));
    return factor;
  }

  function buildData() {
    const factor = factorForFilters();
    const contextSeed = seed([filterState.org, filterState.dept, filterState.person, filterState.disease].join(''));
    const ratioShift = factor === 1 ? 0 : ((contextSeed % 9) - 4) / 10;
    const patient = [35620, 7276, 5275, 4310, 4021].map(value => scaled(value, factor));
    const task = { total: scaled(18306, factor), pending: scaled(3055, factor), overdue: scaled(2540, factor), done: scaled(15251, factor), revisit: scaled(3732, factor) };
    const warnings = [218, 126, 55].map(value => scaled(value, factor));
    const lost = scaled(143, factor);
    const aiExpected = scaled(13943, factor);
    const aiStarted = scaled(12088, factor);
    const aiReached = scaled(11121, factor);
    const aiCompleted = scaled(9264, factor);
    const aiIndependentClosed = scaled(7745, factor);
    const manualTakeoverTasks = scaled(1784, factor);
    const aiClosedRate = percent(aiIndependentClosed, aiCompleted);
    const onTimeTasks = Math.round(task.done * (76.1 + ratioShift) / 100);
    const managementCycles = task.revisit;
    const completedCycles = Math.round(managementCycles * (82.9 + ratioShift) / 100);
    const onTimeCycles = Math.round(completedCycles * (75.8 + ratioShift) / 100);
    return {
      factor, ratioShift, patient, task, warnings,
      comparisons: [[8.4,2.1],[10.2,3.4],[12.6,4.8],[1.7,.6],[2.4,.8],[3.6,1.2],[-18.5,-6.7],[9.8,3.1]],
      closed: scaled(215, factor), lost, exited: scaled(92, factor), diseaseCases:scaled(18420,factor),
      standardRate:92.4 + ratioShift, coreTargetRate:58.2 + ratioShift, highRiskOpen:scaled(8,factor), aiClosedRate,
      up: [304,273,256,246].map(value => scaled(value, factor)),
      down: [146,142,138,129].map(value => scaled(value, factor)),
      quality: [
        { name:'任务完成率', actual:percent(task.done, task.total), target:90, numeratorLabel:'已完成任务数', numerator:task.done, denominatorLabel:'任务总数', denominator:task.total, unit:'项' },
        { name:'按时完成率', actual:percent(onTimeTasks, task.done), target:85, numeratorLabel:'按时完成任务数', numerator:onTimeTasks, denominatorLabel:'已完成任务数', denominator:task.done, unit:'项' },
        { name:'管理周期完成率', actual:percent(completedCycles, managementCycles), target:90, numeratorLabel:'已完成管理周期数', numerator:completedCycles, denominatorLabel:'应完成管理周期数', denominator:managementCycles, unit:'次' },
        { name:'周期按期完成率', actual:percent(onTimeCycles, completedCycles), target:85, numeratorLabel:'按期完成周期数', numerator:onTimeCycles, denominatorLabel:'已完成管理周期数', denominator:completedCycles, unit:'次' },
        { name:'患者失管率', actual:percent(lost, patient[3]), target:5, lowerBetter:true, numeratorLabel:'失管患者数', numerator:lost, denominatorLabel:'成功入组患者数', denominator:patient[3], unit:'人' }
      ],
      disease: [
        ['慢性肾病（CKD）',1184,639,96], ['高血压',1089,652,101], ['糖尿病',1267,737,126], ['乳腺结节',770,425,76]
      ].map(row => [row[0], scaled(row[1], factor), scaled(row[2], factor), scaled(row[3], factor)]),
      safety: [
        ['高危预警患者数', warnings[2], '人'], ['未处置预警数', scaled(84, factor), '次'], ['超时未处置数', scaled(27, factor), '次'],
        ['预警及时处置率', 90.5 + ratioShift, '%'], ['预警闭环率', 93.0 + ratioShift, '%'], ['重复预警患者数', scaled(61, factor), '人'], ['持续恶化患者数', scaled(34, factor), '人']
      ],
      aiFlow: [aiExpected, aiStarted, aiReached, aiCompleted, aiIndependentClosed],
      aiValue: [
        ['AI管理覆盖率', percent(aiStarted, aiExpected), '%', `AI发起任务 ${n(aiStarted)} 项`],
        ['AI有效触达率', percent(aiReached, aiStarted), '%', `有效触达 ${n(aiReached)} 项`],
        ['AI独立闭环率', aiClosedRate, '%', `AI独立闭环 ${n(aiIndependentClosed)} 项`],
        ['人工接管率', percent(manualTakeoverTasks, aiExpected), '%', `人工接管任务 ${n(manualTakeoverTasks)} 项`]
      ]
    };
  }

  function renderMetricCards(targetId, items) {
    $(targetId).innerHTML = items.map(([label,value,unit]) => `<article class="sr-metric-card" title="${label}"><span>${label}</span><strong>${unit === '%' ? Number(value).toFixed(1) : n(value)}<small>${unit}</small></strong></article>`).join('');
  }

  function renderOverview(data) {
    const set = (id, value, unit) => { $(id).innerHTML = `${unit === '%' ? Number(value).toFixed(1) : n(value)}<small>${unit}</small>`; };
    set('srPeriodEndActive', data.patient[4], '人');
    set('srDiseaseCases', data.diseaseCases, '例');
    set('srPeriodEnrolled', data.patient[3], '人');
    set('srRetentionRate', percent(data.patient[4], data.patient[3]), '%');
    set('srStandardRate', data.standardRate, '%');
    set('srCoreTargetRate', data.coreTargetRate, '%');
    set('srHighRiskOpen', data.highRiskOpen, '人');
    set('srAiClosedRate', data.aiClosedRate, '%');
    report.querySelectorAll('[data-sr-compare]').forEach((element,index) => {
      const [yearOnYear,monthOnMonth] = data.comparisons[index];
      const favorableDown = index === 6;
      const item = (label,value,type) => `<span class="compare-${type} ${(value >= 0) !== favorableDown ? 'is-up' : 'is-down'}">${label} ${value >= 0 ? '↑' : '↓'}${Math.abs(value).toFixed(1)}%</span>`;
      element.innerHTML = item('同比',yearOnYear,'yoy') + item('环比',monthOnMonth,'mom');
    });
  }

  function renderAiCards(targetId, items, risk = false) {
    $(targetId).innerHTML = items.map(([label,value,unit,meta]) => `<article class="sr-ai-metric-card${risk ? ' is-risk' : ''}" title="${label}"><span>${label}</span><strong>${unit === '%' ? Number(value).toFixed(1) : n(value)}<small>${unit}</small></strong><em>${meta}</em></article>`).join('');
  }

  function renderAiApplications(data) {
    addChart('srAiFunnel', funnelOption(data.aiFlow, ['应执行任务','AI发起任务','有效触达','完成任务','AI独立闭环'], ['#2f79df','#4f91e9','#6fa7e7','#54b5c0','#34aa89'], data.aiFlow.map(value => `${n(value)} 项`)));
    addRates('srAiFunnel', data.aiFlow, ['AI覆盖率','有效触达率','任务完成率','独立闭环率']);
    renderAiCards('srAiValueMetrics', data.aiValue);
  }

  function renderQuality(data) {
    const items = data.quality.map(item => ({ ...item, actual:+Number(item.actual).toFixed(1) }));
    const statusText = item => {
      const reached = item.lowerBetter ? item.actual <= item.target : item.actual >= item.target;
      if (reached) return item.lowerBetter ? `目标≤${item.target}%  已达标` : `目标${item.target}%  已达标`;
      const gap = Math.abs(item.target - item.actual).toFixed(1);
      return item.lowerBetter ? `目标≤${item.target}%  超出${gap}%` : `目标${item.target}%  差${gap}%`;
    };
    addChart('srQualityChart', {
      animationDuration:500,
      aria:{enabled:true,description:'展示五项管理执行质量指标的实际值、目标值和达标状态'},
      grid:{left:150,right:90,top:8,bottom:8,containLabel:false},
      tooltip:{trigger:'item',triggerOn:'mousemove|click',confine:true,formatter:params => {
        const item = params.data?.item;
        return item ? `${item.name}<br>${item.numeratorLabel} <b>${n(item.numerator)} ${item.unit}</b><br>${item.denominatorLabel} <b>${n(item.denominator)} ${item.unit}</b><br>${item.name} <b>${item.actual.toFixed(1)}%</b>` : '';
      }},
      xAxis:{type:'value',min:0,max:100,show:false},
      yAxis:{type:'category',inverse:true,data:items.map(item => item.name),axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#29476d',fontSize:14,fontWeight:600,margin:18}},
      series:[
        {name:'实际值',type:'bar',barWidth:16,showBackground:true,backgroundStyle:{color:'#e9eef5',borderRadius:8},itemStyle:{color:'#397fdc',borderRadius:8},data:items.map(item => ({value:item.actual,item})),z:2},
        {name:'结果',type:'scatter',symbolSize:0,silent:true,clip:false,data:items.map((item,index) => {
          const reached = item.lowerBetter ? item.actual <= item.target : item.actual >= item.target;
          return {value:[100,index],item,label:{color:reached ? '#15956f' : '#d94d5b'}};
        }),label:{show:true,position:'right',distance:16,fontSize:13,fontWeight:700,formatter:params => `${params.data.item.actual.toFixed(1)}%`},z:5}
      ]
    });
  }

  function addChart(id, option) {
    const element = $(id);
    if (!element || !window.echarts) return;
    const chart = window.echarts.getInstanceByDom(element) || window.echarts.init(element);
    chart.setOption(option, true);
    if (!charts.includes(chart)) charts.push(chart);
  }

  function funnelOption(values, names, colors, displayValues = []) {
    return {
      animationDuration: 550,
      tooltip:{ trigger:'item', formatter: p => `${p.name}<br><b>${p.data.display}</b>` },
      series:[{
        type:'funnel', left:'6%', top:12, width:'88%', height:'88%', minSize:'42%', maxSize:'100%', sort:'descending', gap:32,
        label:{ show:true, position:'inside', color:'#fff', fontSize:15, fontWeight:700, formatter:p => `{name|${p.name}}  {value|${p.data.display}}`, rich:{ name:{fontSize:14,color:'#fff'}, value:{fontSize:15,fontWeight:800,color:'#fff'} } },
        labelLine:{show:false}, data:values.map((value,index) => ({ value, name:names[index], display:displayValues[index] || `${n(value)} 人`, itemStyle:{ color:colors[index] } }))
      }]
    };
  }

  function addRates(id, values, rateLabels = [], totalLabel = '') {
    const element = $(id);
    const chart = window.echarts.getInstanceByDom(element);
    if (!chart) return;
    const chartHeight = element.clientHeight || (values.length === 5 ? 400 : 330);
    const seriesTop = 12;
    const seriesHeight = chartHeight * .88;
    const gap = 32;
    const stageHeight = (seriesHeight - gap * (values.length - 1)) / values.length;
    const graphics = values.slice(1).map((value,index) => {
      const gapCenter = seriesTop + stageHeight * (index + 1) + gap * index + gap / 2;
      const rateText = `${rateLabels[index] ? `${rateLabels[index]} ` : '↓ '}${percent(value,values[index]).toFixed(1)}%`;
      return {
        id:`${id}-rate-${index}`,
        type:'group', left:'center', top:gapCenter - 12, z:100, zlevel:10, silent:true, children:[
          {type:'rect',shape:{x:-90,y:0,width:180,height:24,r:4},style:{fill:'#fff'}},
          {type:'text',style:{x:0,y:12,text:rateText,fill:'#536f95',font:'600 13px Microsoft YaHei',textAlign:'center',textVerticalAlign:'middle'}}
        ]
      };
    });
    if (totalLabel) {
      graphics.push({
        id:`${id}-total-rate`,
        type:'group', left:'center', top:chartHeight - 28, z:100, zlevel:10, silent:true, children:[
          {type:'rect',shape:{x:-110,y:0,width:220,height:24,r:4},style:{fill:'#f4f8fd'}},
          {type:'text',style:{x:0,y:12,text:`${totalLabel} ${percent(values[values.length - 1],values[0]).toFixed(1)}%`,fill:'#234f88',font:'700 13px Microsoft YaHei',textAlign:'center',textVerticalAlign:'middle'}}
        ]
      });
    }
    chart.setOption({ graphic:graphics }, {replaceMerge:['graphic']});
  }

  function renderFunnels(data) {
    addChart('srPatientFunnel', funnelOption(data.patient, ['筛查人数','筛查异常人数','符合入组人数','成功入组人数','有效在管人数'], ['#2f79df','#4f91e9','#6fa7e7','#54b5c0','#34aa89']));
    addRates('srPatientFunnel', data.patient, ['筛查异常率','入组适配率','入组转化率','有效在管率'], '全链路转化率');
    addChart('srUpFunnel', funnelOption(data.up, ['转出人数','上级机构接收人数','实际到院人数','确定入组人数'], ['#2f79df','#4e91ec','#71ace4','#48a5c9']));
    addRates('srUpFunnel', data.up, ['上级机构接收率','实际到院率','诊疗完成率']);
    addChart('srDownFunnel', funnelOption(data.down, ['转出人数','基层接收人数','管理交接人数','确定入组人数'], ['#389bb5','#51afbd','#6cbbb0','#35a889']));
    addRates('srDownFunnel', data.down, ['基层接收率','管理交接率','首次随访完成率']);
    $('srUpClosed').textContent = `${percent(data.up[3],data.up[0]).toFixed(1)}%`;
    $('srUpAverageHours').textContent = `${(2.4 + (data.factor < 1 ? .1 : 0)).toFixed(1)}小时`;
    $('srUpNotArrived').textContent = `${n(Math.max(0,data.up[1] - data.up[2]))}人`;
    $('srDownClosed').textContent = `${percent(data.down[3],data.down[0]).toFixed(1)}%`;
    $('srDownNotContinued').textContent = `${n(Math.max(0,data.down[1] - data.down[2]))}人`;
  }

  function renderDisease(data) {
    const institution = filterState.org || '全部集团';
    const department = filterState.dept || '全部科室';
    const doctor = filterState.person || '全部人员';
    const selected = filterState.disease ? (filterState.disease === 'CKD' ? '慢性肾病（CKD）' : filterState.disease) : '全部病种';
    if (selected === '全部病种') {
      $('srEffectTitle').textContent = doctor !== '全部人员' ? `${doctor}个人管理病种情况` : department !== '全部科室' ? `${department}各病种情况` : institution !== '全部集团' ? `${institution}管理成效 · 病种对比` : '通用管理成效 · 病种对比';
      $('srDiseaseHead').innerHTML = '<tr><th>病种</th><th>管理病例</th><th>目标达成数</th><th>目标达成率</th><th>风险患者</th></tr>';
      $('srDiseaseBody').innerHTML = data.disease.map(row => `<tr><td>${row[0]}</td><td>${n(row[1])} 人</td><td>${n(row[2])} 人</td><td><div class="sr-target-rate"><i style="width:${percent(row[2],row[1])}%"></i></div>${percent(row[2],row[1]).toFixed(1)}%</td><td>${n(row[3])} 人</td></tr>`).join('');
      return;
    }
    const clinicalMetrics = {
      '慢性肾病（CKD）': [['eGFR稳定率',68.3,65,860],['血压达标率',71.8,70,812],['尿蛋白改善率',54.6,60,638],['肾功能复查完成率',82.4,80,904]],
      '高血压': [['血压达标率',72.6,70,920],['规范测压率',88.4,85,1012],['用药依从率',81.7,80,875],['心血管风险改善率',57.3,60,566]],
      '糖尿病': [['糖化血红蛋白达标率',61.8,60,986],['血糖监测达标率',84.2,80,1104],['低血糖事件控制率',92.6,90,802],['并发症筛查完成率',78.5,80,931]],
      '乳腺结节': [['规范复查率',86.7,85,642],['影像稳定率',91.2,90,598],['高风险复诊率',88.4,90,126],['随访及时率',82.9,80,615]]
    };
    $('srEffectTitle').textContent = doctor !== '全部人员' ? `${doctor} · ${selected}管理成效` : department !== '全部科室' ? `${department} · ${selected}成效` : institution !== '全部集团' ? `${institution} · ${selected}成效` : `${selected}专属临床指标`;
    $('srDiseaseHead').innerHTML = '<tr><th>临床指标</th><th>本期值</th><th>目标值</th><th>达标情况</th><th>有效样本数</th></tr>';
    $('srDiseaseBody').innerHTML = (clinicalMetrics[selected] || []).map(row => {
      const current = +(row[1] + data.ratioShift).toFixed(1);
      const status = current >= row[2] ? '已达标' : '改善中';
      return `<tr><td>${row[0]}</td><td>${current}%</td><td>${row[2].toFixed(1)}%</td><td><div class="sr-target-rate"><i style="width:${Math.min(100,current)}%"></i></div>${status}</td><td>${n(scaled(row[3],data.factor))} 人</td></tr>`;
    }).join('') || '<tr><td colspan="5" class="sr-empty">当前筛选暂无临床指标数据</td></tr>';
  }

  function rankingContext(data) {
    const institution = filterState.org || '全部集团';
    const department = filterState.dept || '全部科室';
    const doctor = filterState.person || '全部人员';
    const disease = filterState.disease ? (filterState.disease === 'CKD' ? '慢性肾病（CKD）' : filterState.disease) : '全部病种';
    if (doctor !== '全部人员') return {mode:'personal',dimension:'个人',title:`${doctor}个人工作明细`,doctor,rows:[]};
    let dimension = '机构';
    let title = disease === '全部病种' ? '机构排名' : `${disease}机构病种排名`;
    let names = ['第一附属医院','第二附属医院','东院区','社区中心'];
    if (institution !== '全部集团') { dimension = '科室'; title = disease === '全部病种' ? `${institution}科室排名` : `${institution} · ${disease}科室病种排名`; names = organizationOptions[institution].filter(item => item !== '全部科室'); }
    if (department !== '全部科室') { dimension = '团队/个人'; title = disease === '全部病种' ? `${department}团队/个人排名` : `${department} · ${disease}团队/个人排名`; names = (doctorOptions[department] || ['全部人员']).filter(item => item !== '全部人员'); }
    if (!names.length) names = ['张明远','陈慧敏','周晓峰','李文清'];
    const bases = [1543,1292,898,288];
    const defaultInstitutionRows = [
      {standard:94.7,target:64.0,closed:97.4,lost:3.0},
      {standard:92.1,target:56.6,closed:97.3,lost:3.8},
      {standard:87.8,target:51.9,closed:92.6,lost:3.4},
      {standard:81.9,target:35.8,closed:97.9,lost:2.6}
    ];
    const rows = names.slice(0,4).map((name,index) => {
      const localSeed = seed(name);
      const active = dimension === '机构' && data.factor === 1 ? bases[index] : Math.max(1, scaled(bases[index] || 260, Math.min(1,data.factor * (dimension === '团队/个人' ? 2.2 : 1.35))));
      if (dimension === '机构' && data.factor === 1) return {name,active,...defaultInstitutionRows[index]};
      return { name, active, standard:+(94.7-index*3.2+(localSeed%3)/10).toFixed(1), target:+(64-index*5.1+(localSeed%5)/10).toFixed(1), closed:+(97.4-index*1.6+(localSeed%4)/10).toFixed(1), lost:+(3+index*.2+(localSeed%3)/10).toFixed(1) };
    });
    return {mode:'ranking',dimension,title,rows};
  }

  function renderRanking(data) {
    const ranking = rankingContext(data);
    const tableWrap = $('srRankingTableWrap');
    const personalDetail = $('srPersonalDetail');
    $('srRankingTitle').textContent = ranking.title;
    $('srRankingDimension').textContent = `当前维度：${ranking.dimension}`;
    if (ranking.mode === 'personal') {
      tableWrap.hidden = true;
      personalDetail.hidden = false;
      const groups = [
        ['任务明细',[['健康任务数',`${n(data.task.total)} 项`],['已完成任务',`${n(data.task.done)} 项`],['逾期任务',`${n(data.task.overdue)} 项`]]],
        ['管理患者',[['在管患者',`${n(data.patient[4])} 人`],['新增入组',`${n(data.patient[3])} 人`],['失访患者',`${n(data.lost)} 人`]]],
        ['质量明细',[['任务完成率',`${percent(data.task.done,data.task.total).toFixed(1)}%`],['规范管理率',`${data.standardRate.toFixed(1)}%`],['目标达成率',`${data.coreTargetRate.toFixed(1)}%`]]],
        ['风险明细',[['高危未闭环',`${n(data.highRiskOpen)} 人`],['预警闭环率',`${Number(data.safety[4][1]).toFixed(1)}%`],['持续恶化患者',`${n(data.safety[6][1])} 人`]]]
      ];
      personalDetail.innerHTML = groups.map(([name,items]) => `<article class="sr-person-card"><h3>${name}</h3><dl>${items.map(([label,value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl></article>`).join('');
      return;
    }
    tableWrap.hidden = false;
    personalDetail.hidden = true;
    personalDetail.innerHTML = '';
    $('srRankingNameHead').textContent = ranking.dimension;
    $('srRankingBody').innerHTML = ranking.rows.map((row,index) => `<tr><td><span class="sr-rank ${index < 3 ? 'top' : ''}">${index+1}</span></td><td>${row.name}</td><td>${n(row.active)}</td><td>${row.standard}%</td><td>${row.target}%</td><td>${row.closed}%</td><td>${row.lost}%</td><td><button class="sr-table-link" type="button" data-sr-detail>查看</button></td></tr>`).join('');
  }

  function markDetailTriggers() {
    report.querySelectorAll('.sr-overview-metric,.sr-flow-row .sr-chart,.sr-referral-result>div,.sr-disease-table tbody tr,.sr-metric-grid.safety .sr-metric-card,.sr-quality-chart,.sr-ai-layout .sr-chart,.sr-ai-metric-card,[data-sr-detail]').forEach(element => {
      element.dataset.srDetail = '';
      element.classList.add('sr-detail-trigger');
      if (!element.matches('button')) element.setAttribute('role','button');
      if (!element.hasAttribute('tabindex')) element.tabIndex = 0;
      if (!element.hasAttribute('aria-label')) element.setAttribute('aria-label','查看具体明细');
    });
  }

  function showDetailNotice() {
    if (typeof window.showToast === 'function') {
      window.showToast('具体明细功能建设中');
      return;
    }
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = '具体明细功能建设中';
    toast.classList.add('show');
    clearTimeout(showDetailNotice.timer);
    showDetailNotice.timer = setTimeout(() => toast.classList.remove('show'), 1500);
  }

  report.addEventListener('click', event => {
    if (event.target.closest('[data-sr-detail]')) showDetailNotice();
  });
  report.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-sr-detail]')) {
      event.preventDefault();
      showDetailNotice();
    }
  });

  function refresh() {
    const data = buildData();
    report.querySelector('[data-sr-summary]').textContent = `${filterState.org || '全部集团'} · ${filterState.dept || '全部科室'} · ${filterState.person || '全部人员'} · ${filterState.disease ? (filterState.disease === 'CKD' ? '慢性肾病（CKD）' : filterState.disease) : '全部病种'}｜${filterState.start} 至 ${filterState.end}`;
    renderOverview(data); renderFunnels(data); renderQuality(data); renderDisease(data); renderMetricCards('srSafetyMetrics', data.safety); renderAiApplications(data); renderRanking(data); markDetailTriggers();
    requestAnimationFrame(() => {
      charts.forEach(chart => chart.resize());
      requestAnimationFrame(() => charts.forEach(chart => chart.resize()));
    });
  }

  const filterEngine = {
    orgs: Object.fromEntries(Object.entries(organizationOptions).filter(([name]) => name !== '全部集团').map(([name,depts]) => [name,depts.filter(item => item !== '全部科室')])),
    diseases: ['CKD','高血压','糖尿病','乳腺结节'],
    people: Object.entries(organizationOptions).filter(([org]) => org !== '全部集团').flatMap(([org,depts]) => depts.filter(dept => dept !== '全部科室').flatMap(dept => (doctorOptions[dept] || []).filter(name => name !== '全部人员').map(name => ({org,dept,name}))))
  };
  if (window.StatisticsFilters) {
    window.StatisticsFilters.mount($('srFilterHost'), values => { filterState = values; refresh(); }, filterEngine, filterState);
  }
  window.addEventListener('resize', () => charts.forEach(chart => chart.resize()));
  if ('ResizeObserver' in window) {
    const reportResizeObserver = new ResizeObserver(() => charts.forEach(chart => chart.resize()));
    reportResizeObserver.observe(report);
  }
  window.renderStatisticsReport = refresh;
  refresh();
})();
