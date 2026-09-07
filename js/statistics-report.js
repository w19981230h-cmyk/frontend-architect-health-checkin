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
  const n = value => Math.max(0, Math.round(value)).toLocaleString('zh-CN');
  const percent = (part, total) => total ? +(part * 100 / total).toFixed(1) : 0;
  const scaled = (value, factor) => Math.max(0, Math.round(value * factor));
  const seed = value => [...value].reduce((total, char) => total + char.charCodeAt(0), 0);
  const icon = type => `<span class="sr-summary-icon sr-icon-${type}" aria-hidden="true"></span>`;

  report.innerHTML = `
    <div class="sr-dashboard">
      <header class="sr-hero">
        <div><h1>数据看板</h1><p data-sr-summary>全部集团 · 全部科室 · 全部人员 · 全部病种｜${defaultStartDate} 至 ${defaultEndDate}</p></div>
        <span class="sr-health">数据运行正常</span>
      </header>
      <div class="sr-filters" role="search" aria-label="数据看板筛选条件">
        <label class="sr-filter sr-date-filter"><span>时间范围</span><span class="sr-date-range"><input id="srStartDate" data-sr-filter type="date" value="${defaultStartDate}" aria-label="开始日期"><i>至</i><input id="srEndDate" data-sr-filter type="date" value="${defaultEndDate}" aria-label="结束日期"></span></label>
        <label class="sr-filter"><span>集团</span><select id="srInstitution" data-sr-filter aria-label="选择集团">${Object.keys(organizationOptions).map(item => `<option>${item}</option>`).join('')}</select></label>
        <label class="sr-filter"><span>科室</span><select id="srDepartment" data-sr-filter aria-label="选择科室"></select></label>
        <label class="sr-filter"><span>个人</span><select id="srDoctor" data-sr-filter aria-label="选择个人"></select></label>
        <label class="sr-filter"><span>病种</span><select id="srDisease" data-sr-filter aria-label="选择病种">${diseaseOptions.map(item => `<option>${item}</option>`).join('')}</select></label>
        <button class="sr-reset" type="button" data-sr-reset>重置筛选</button>
      </div>

      <section class="sr-overview" aria-label="运营概览">
        <article class="sr-summary-card sr-summary-managed">${icon('people')}<h2>管理中</h2><div class="sr-summary-pairs three"><div><span>新增入组人数</span><strong id="srNewEnrolled">4,310<small>人</small></strong></div><div><span>在管人数</span><strong id="srInCare">4,021<small>人</small></strong></div><div><span>有效在管率</span><strong id="srActiveRate">93.3<small>%</small></strong></div></div></article>
        <article class="sr-summary-card sr-summary-tasks">${icon('task')}<h2>任务情况</h2><div class="sr-summary-pairs three"><div><span>待完成任务数</span><strong id="srTaskPending">3,055<small>项</small></strong></div><div><span>逾期任务数</span><strong id="srTaskOverdue">2,540<small>项</small></strong></div><div><span>已完成任务数</span><strong id="srTaskDone">15,251<small>项</small></strong></div></div></article>
        <article class="sr-summary-card sr-summary-warning">${icon('warning')}<h2>预警情况</h2><div class="sr-summary-pairs three"><div><span>三级预警</span><strong id="srWarn3">218<small>人</small></strong></div><div><span>二级预警</span><strong id="srWarn2">126<small>人</small></strong></div><div><span>一级预警</span><strong id="srWarn1">55<small>人</small></strong></div></div></article>
        <article class="sr-summary-card sr-summary-patient">${icon('people')}<h2>患者情况</h2><div class="sr-summary-pairs three"><div><span>结案人数</span><strong id="srClosed">215<small>人</small></strong></div><div><span>失访人数</span><strong id="srLost">143<small>人</small></strong></div><div><span>退出人数</span><strong id="srExited">92<small>人</small></strong></div></div></article>
      </section>

      <section class="sr-flow-row">
        <article class="sr-panel"><h2 class="sr-panel-title">患者管理流转</h2><div id="srPatientFunnel" class="sr-chart sr-patient-chart" aria-label="患者管理流转漏斗图"></div></article>
        <article class="sr-panel"><h2 class="sr-panel-title">双向转诊</h2><div class="sr-referral-grid">
          <section><h3>向上转诊</h3><div id="srUpFunnel" class="sr-chart sr-referral-chart" aria-label="向上转诊漏斗图"></div><div class="sr-referral-result"><div><span>转诊成功率</span><strong id="srUpSuccess">89.8%</strong></div><div><span>转诊闭环率</span><strong id="srUpClosed">80.9%</strong></div></div></section>
          <section><h3>向下转诊</h3><div id="srDownFunnel" class="sr-chart sr-referral-chart" aria-label="向下转诊漏斗图"></div><div class="sr-referral-result"><div><span>转诊成功率</span><strong id="srDownSuccess">97.3%</strong></div><div><span>转诊闭环率</span><strong id="srDownClosed">88.4%</strong></div></div></section>
        </div></article>
      </section>

      <section class="sr-panel sr-section-panel"><h2 class="sr-panel-title">管理过程质量</h2><div id="srQualityMetrics" class="sr-metric-grid quality"></div></section>

      <section class="sr-content-row">
        <article class="sr-panel"><h2 class="sr-panel-title">疾病管理成效 · 目标达成</h2><div class="sr-table-wrap"><table class="sr-table sr-disease-table"><thead><tr><th>病种</th><th>管理病例</th><th>目标达成数</th><th>目标达成率</th><th>风险患者</th></tr></thead><tbody id="srDiseaseBody"></tbody></table></div></article>
        <article class="sr-panel"><h2 class="sr-panel-title">风险与安全</h2><div id="srSafetyMetrics" class="sr-metric-grid safety"></div></article>
      </section>

      <section class="sr-panel sr-section-panel"><h2 class="sr-panel-title">服务资源应用情况</h2><div id="srResourceMetrics" class="sr-metric-grid resources"></div></section>

      <section class="sr-panel sr-section-panel"><div class="sr-panel-heading"><h2 id="srRankingTitle" class="sr-panel-title">机构绩效排名</h2><span id="srRankingDimension" class="sr-dimension-tag">当前维度：机构</span></div><div class="sr-table-wrap"><table class="sr-table sr-ranking-table"><thead><tr><th>排名</th><th id="srRankingNameHead">机构/科室</th><th>在管人数</th><th>规范管理率</th><th>目标达成率</th><th>预警闭环率</th><th>失访率</th><th>综合得分</th><th>操作</th></tr></thead><tbody id="srRankingBody"></tbody></table></div></section>
      <footer class="sr-footer">当前为业务原型模拟数据 · 数量与比例按筛选范围和统一统计口径联动计算</footer>
    </div>`;

  function setSelectOptions(select, values, preferred) {
    select.innerHTML = values.map(item => `<option${item === preferred ? ' selected' : ''}>${item}</option>`).join('');
  }

  function factorForFilters() {
    const institution = $('srInstitution').value;
    const department = $('srDepartment').value;
    const doctor = $('srDoctor').value;
    const disease = $('srDisease').value;
    let factor = institution === '全部集团' ? 1 : institution === '区域医疗集团' ? 0.63 : 0.37;
    if (department !== '全部科室') factor *= { '肾内科':.28, '内分泌科':.25, '心血管内科':.23, '全科医学科':.2, '康复医学科':.16, '慢病管理科':.14 }[department] || .2;
    if (doctor !== '全部人员') factor *= .36 + (seed(doctor) % 12) / 100;
    if (disease !== '全部病种') factor *= { '慢性肾病（CKD）':.28, '高血压':.25, '糖尿病':.29, '乳腺结节':.18 }[disease] || .24;
    const start = new Date($('srStartDate').value || defaultStartDate);
    const end = new Date($('srEndDate').value || defaultEndDate);
    const days = Math.max(1, Math.round((end - start) / 86400000) + 1);
    const defaultDays = Math.max(1, Math.round((today - new Date(today.getFullYear(), 0, 1)) / 86400000) + 1);
    factor *= Math.min(1, Math.max(.08, days / defaultDays));
    return factor;
  }

  function buildData() {
    const factor = factorForFilters();
    const contextSeed = seed([$('srInstitution').value, $('srDepartment').value, $('srDoctor').value, $('srDisease').value].join(''));
    const ratioShift = factor === 1 ? 0 : ((contextSeed % 9) - 4) / 10;
    const patient = [35620, 7276, 5275, 4310, 4021].map(value => scaled(value, factor));
    const task = { total: scaled(18306, factor), pending: scaled(3055, factor), overdue: scaled(2540, factor), done: scaled(15251, factor), revisit: scaled(3732, factor) };
    const warnings = [218, 126, 55].map(value => scaled(value, factor));
    return {
      factor, patient, task, warnings,
      closed: scaled(215, factor), lost: scaled(143, factor), exited: scaled(92, factor),
      up: [304,273,256,246].map(value => scaled(value, factor)),
      down: [146,142,138,129].map(value => scaled(value, factor)),
      quality: [
        ['健康任务数', task.total, '项'], ['任务完成率', 83.3 + ratioShift, '%'], ['按时完成率', 76.1 + ratioShift, '%'], ['逾期任务数', task.overdue, '项'],
        ['逾期率', 13.9 - ratioShift, '%'], ['复诊任务数', task.revisit, '项'], ['复诊率', 82.9 + ratioShift, '%'], ['按时复诊率', 75.8 + ratioShift, '%']
      ],
      disease: [
        ['慢性肾病（CKD）',1184,639,96], ['高血压',1089,652,101], ['糖尿病',1267,737,126], ['乳腺结节',770,425,76]
      ].map(row => [row[0], scaled(row[1], factor), scaled(row[2], factor), scaled(row[3], factor)]),
      safety: [
        ['三级预警人数', warnings[0], '人'], ['二级预警人数', warnings[1], '人'], ['一级预警人数', warnings[2], '人'],
        ['预警按时处置率', 90.5 + ratioShift, '%'], ['超时未处置率', 3.9 - ratioShift / 2, '%'], ['重复预警人数', scaled(61, factor), '人']
      ],
      resources: [
        ['消息发送次数',scaled(12787,factor),'次'], ['消息触达次数',scaled(11721,factor),'次'], ['消息触达率',91.7 + ratioShift,'%'], ['AI健康任务数',scaled(13943,factor),'项'], ['AI外呼次数',scaled(4795,factor),'次'],
        ['AI任务完成率',83.3 + ratioShift,'%'], ['AI消息触达次数',scaled(8886,factor),'次'], ['AI生成报告数',scaled(2663,factor),'份'], ['AI识别预警次数',scaled(410,factor),'次']
      ]
    };
  }

  function renderMetricCards(targetId, items) {
    $(targetId).innerHTML = items.map(([label,value,unit]) => `<article class="sr-metric-card"><span>${label}</span><strong>${unit === '%' ? Number(value).toFixed(1) : n(value)}<small>${unit}</small></strong></article>`).join('');
  }

  function renderOverview(data) {
    const set = (id, value, unit) => { $(id).innerHTML = `${unit === '%' ? Number(value).toFixed(1) : n(value)}<small>${unit}</small>`; };
    set('srNewEnrolled', data.patient[3], '人');
    set('srInCare', data.patient[4], '人');
    set('srActiveRate', percent(data.patient[4], data.patient[3]), '%');
    set('srTaskPending', data.task.pending, '项'); set('srTaskOverdue', data.task.overdue, '项'); set('srTaskDone', data.task.done, '项');
    set('srWarn3', data.warnings[0], '人'); set('srWarn2', data.warnings[1], '人'); set('srWarn1', data.warnings[2], '人');
    set('srClosed', data.closed, '人'); set('srLost', data.lost, '人'); set('srExited', data.exited, '人');
  }

  function addChart(id, option) {
    const element = $(id);
    if (!element || !window.echarts) return;
    const chart = window.echarts.getInstanceByDom(element) || window.echarts.init(element);
    chart.setOption(option, true);
    if (!charts.includes(chart)) charts.push(chart);
  }

  function funnelOption(values, names, colors) {
    return {
      animationDuration: 550,
      tooltip:{ trigger:'item', formatter: p => `${p.name}<br><b>${n(p.value)} 人</b>` },
      series:[{
        type:'funnel', left:'6%', top:12, width:'88%', height:'88%', minSize:'42%', maxSize:'100%', sort:'descending', gap:32,
        label:{ show:true, position:'inside', color:'#fff', fontSize:15, fontWeight:700, formatter:p => `{name|${p.name}}  {value|${n(p.value)} 人}`, rich:{ name:{fontSize:14,color:'#fff'}, value:{fontSize:15,fontWeight:800,color:'#fff'} } },
        labelLine:{show:false}, data:values.map((value,index) => ({ value, name:names[index], itemStyle:{ color:colors[index] } }))
      }]
    };
  }

  function addRates(id, values) {
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
      return {
        id:`${id}-rate-${index}`,
        type:'group', left:'center', top:gapCenter - 12, z:100, zlevel:10, silent:true, children:[
          {type:'rect',shape:{x:-62,y:0,width:124,height:24,r:4},style:{fill:'#fff'}},
          {type:'text',style:{x:0,y:12,text:`↓ ${percent(value,values[index]).toFixed(1)}%`,fill:'#536f95',font:'600 13px Microsoft YaHei',textAlign:'center',textVerticalAlign:'middle'}}
        ]
      };
    });
    chart.setOption({ graphic:graphics }, {replaceMerge:['graphic']});
  }

  function renderFunnels(data) {
    addChart('srPatientFunnel', funnelOption(data.patient, ['筛查','异常','符合入组','成功入组','有效在管'], ['#2f79df','#4f91e9','#6fa7e7','#54b5c0','#34aa89']));
    addRates('srPatientFunnel', data.patient);
    addChart('srUpFunnel', funnelOption(data.up, ['转出人数','接收人数','到院就诊','确认入组'], ['#2f79df','#4e91ec','#71ace4','#48a5c9']));
    addRates('srUpFunnel', data.up);
    addChart('srDownFunnel', funnelOption(data.down, ['转出人数','接收人数','到院就诊','确认入组'], ['#389bb5','#51afbd','#6cbbb0','#35a889']));
    addRates('srDownFunnel', data.down);
    $('srUpSuccess').textContent = `${percent(data.up[1],data.up[0]).toFixed(1)}%`;
    $('srUpClosed').textContent = `${percent(data.up[3],data.up[0]).toFixed(1)}%`;
    $('srDownSuccess').textContent = `${percent(data.down[1],data.down[0]).toFixed(1)}%`;
    $('srDownClosed').textContent = `${percent(data.down[3],data.down[0]).toFixed(1)}%`;
  }

  function renderDisease(data) {
    const selected = $('srDisease').value;
    const rows = selected === '全部病种' ? data.disease : data.disease.filter(row => row[0] === selected);
    $('srDiseaseBody').innerHTML = rows.map(row => `<tr><td>${row[0]}</td><td>${n(row[1])} 人</td><td>${n(row[2])} 人</td><td><div class="sr-target-rate"><i style="width:${percent(row[2],row[1])}%"></i></div>${percent(row[2],row[1]).toFixed(1)}%</td><td>${n(row[3])} 人</td></tr>`).join('') || `<tr><td colspan="5" class="sr-empty">当前筛选暂无病种数据</td></tr>`;
  }

  function rankingContext(data) {
    const institution = $('srInstitution').value;
    const department = $('srDepartment').value;
    const doctor = $('srDoctor').value;
    let dimension = '机构';
    let names = ['第一附属医院','第二附属医院','东院区','社区中心'];
    if (institution !== '全部集团') { dimension = '科室'; names = organizationOptions[institution].filter(item => item !== '全部科室'); }
    if (department !== '全部科室' || doctor !== '全部人员') { dimension = '个人'; names = (doctorOptions[department] || ['全部人员']).filter(item => item !== '全部人员'); }
    if (!names.length) names = ['张明远','陈慧敏','周晓峰','李文清'];
    const bases = [1543,1292,898,288];
    const defaultInstitutionRows = [
      {standard:94.7,target:64.0,closed:97.4,lost:3.0,score:83.8},
      {standard:92.1,target:56.6,closed:97.3,lost:3.8,score:80.0},
      {standard:87.8,target:51.9,closed:92.6,lost:3.4,score:76.3},
      {standard:81.9,target:35.8,closed:97.9,lost:2.6,score:70.7}
    ];
    const rows = names.slice(0,4).map((name,index) => {
      const localSeed = seed(name);
      const active = dimension === '机构' && data.factor === 1 ? bases[index] : Math.max(1, scaled(bases[index] || 260, Math.min(1,data.factor * (dimension === '个人' ? 2.2 : 1.35))));
      if (dimension === '机构' && data.factor === 1) return {name,active,...defaultInstitutionRows[index]};
      return { name, active, standard:+(94.7-index*3.2+(localSeed%3)/10).toFixed(1), target:+(64-index*5.1+(localSeed%5)/10).toFixed(1), closed:+(97.4-index*1.6+(localSeed%4)/10).toFixed(1), lost:+(3+index*.2+(localSeed%3)/10).toFixed(1), score:+(83.8-index*3.7+(localSeed%4)/10).toFixed(1) };
    });
    return {dimension,rows};
  }

  function renderRanking(data) {
    const ranking = rankingContext(data);
    $('srRankingTitle').textContent = `${ranking.dimension}绩效排名`;
    $('srRankingDimension').textContent = `当前维度：${ranking.dimension}`;
    $('srRankingNameHead').textContent = ranking.dimension === '机构' ? '机构/科室' : ranking.dimension;
    $('srRankingBody').innerHTML = ranking.rows.map((row,index) => `<tr><td><span class="sr-rank ${index < 3 ? 'top' : ''}">${index+1}</span></td><td>${row.name}</td><td>${n(row.active)}</td><td>${row.standard}%</td><td>${row.target}%</td><td>${row.closed}%</td><td>${row.lost}%</td><td><strong class="sr-score">${row.score}</strong></td><td><button class="sr-table-link" type="button">查看</button></td></tr>`).join('');
  }

  function refresh() {
    const data = buildData();
    report.querySelector('[data-sr-summary]').textContent = `${$('srInstitution').value} · ${$('srDepartment').value} · ${$('srDoctor').value} · ${$('srDisease').value}｜${$('srStartDate').value || '不限'} 至 ${$('srEndDate').value || '不限'}`;
    renderOverview(data); renderFunnels(data); renderMetricCards('srQualityMetrics', data.quality); renderDisease(data); renderMetricCards('srSafetyMetrics', data.safety); renderMetricCards('srResourceMetrics', data.resources); renderRanking(data);
    requestAnimationFrame(() => {
      charts.forEach(chart => chart.resize());
      requestAnimationFrame(() => charts.forEach(chart => chart.resize()));
    });
  }

  function syncDepartments(preferred) { setSelectOptions($('srDepartment'), organizationOptions[$('srInstitution').value], preferred || '全部科室'); syncDoctors(); }
  function syncDoctors(preferred) { setSelectOptions($('srDoctor'), doctorOptions[$('srDepartment').value] || ['全部人员'], preferred || '全部人员'); }
  function applyDefaultFilters() {
    $('srInstitution').value = '全部集团';
    syncDepartments('全部科室');
    $('srDoctor').value = '全部人员';
    $('srDisease').value = '全部病种';
    $('srStartDate').value = defaultStartDate;
    $('srEndDate').value = defaultEndDate;
  }

  report.addEventListener('change', event => {
    if (!event.target.matches('[data-sr-filter]')) return;
    if (event.target.id === 'srInstitution') syncDepartments();
    if (event.target.id === 'srDepartment') syncDoctors();
    refresh();
  });
  report.addEventListener('click', event => {
    if (!event.target.closest('[data-sr-reset]')) return;
    applyDefaultFilters();
    refresh();
  });
  window.addEventListener('resize', () => charts.forEach(chart => chart.resize()));
  if ('ResizeObserver' in window) {
    const reportResizeObserver = new ResizeObserver(() => charts.forEach(chart => chart.resize()));
    reportResizeObserver.observe(report);
  }
  window.renderStatisticsReport = refresh;
  applyDefaultFilters();
  refresh();
})();
