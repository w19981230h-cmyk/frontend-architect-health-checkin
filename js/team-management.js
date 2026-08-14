(function () {
  const seedTeams = [
    ['呼吸内科出院随访团队', '呼吸与危重症医学科', '面向慢阻肺、肺炎及呼吸系统疾病出院患者，提供症状监测、用药指导、康复训练与复诊提醒。', '张明远', 4, 5],
    ['糖尿病慢病管理团队', '内分泌科', '面向糖尿病及糖尿病前期患者，开展血糖监测、用药管理、饮食运动指导和并发症筛查。', '陈慧敏', 6, 18],
    ['胃癌全周期管理团队', '胃肠外科、肿瘤科、临床营养科', '面向胃癌患者提供围手术期评估、治疗随访、营养支持和康复管理。', '赵文博', 8, 32],
    ['肝癌多学科管理团队', '肝胆外科、肿瘤科、医学影像科', '整合肝胆外科、肿瘤科和影像科资源，为肝癌患者提供多学科诊疗与长期随访。', '王建华', 7, 24],
    ['高血压随访管理团队', '心血管内科', '面向原发性高血压患者开展血压监测、用药依从性管理和心血管风险评估。', '周晓峰', 5, 41],
    ['结直肠癌康复管理团队', '胃肠外科、肿瘤科、临床营养科', '围绕结直肠癌手术、放化疗和营养康复，为患者提供连续健康管理。', '林志强', 6, 27],
    ['肺癌全程健康管理团队', '胸外科、呼吸与危重症医学科、肿瘤科', '面向肺癌患者提供治疗决策支持、症状监测、用药指导和康复随访。', '高俊杰', 9, 36],
    ['糖尿病合并高血压共管团队', '内分泌科、心血管内科', '针对糖尿病合并高血压患者开展血糖、血压、用药和生活方式的联合管理。', '陈慧敏', 8, 53],
    ['医学减重管理团队', '内分泌科、临床营养科、康复医学科', '面向超重和肥胖人群，通过医学评估、饮食、运动及行为干预实施体重管理。', '许静怡', 6, 29],
    ['血脂异常管理团队', '心血管内科、健康管理中心', '面向血脂异常及动脉粥样硬化高风险人群开展血脂监测和危险因素干预。', '周晓峰', 5, 34]
  ];
  const topics = ['高血压随访', '糖尿病专病', '慢性肾病管理', '术后康复', '孕产全周期', '儿童保健', '心脑血管风险', '肿瘤营养', '睡眠健康'];
  const departments = ['全科医学科', '内分泌科', '心血管内科', '肿瘤科', '呼吸与危重症医学科', '健康管理中心'];
  const teamRows = seedTeams.map((item, index) => ({ id: index + 1, name: item[0], department: item[1], description: item[2], administrator: item[3], members: item[4], patients: item[5] }));
  for (let i = teamRows.length; i < 64; i += 1) {
    const topic = topics[(i - 10) % topics.length];
    const department = departments[(i - 10) % departments.length];
    teamRows.push({
      id: i + 1,
      name: `${topic}团队${String(i - 9).padStart(2, '0')}`,
      department,
      description: `由${department}负责，为目标患者提供评估、干预、随访和健康教育服务。`,
      administrator: i % 4 === 0 ? '王医生' : '--',
      members: (i % 8) + 2,
      patients: (i * 7) % 43
    });
  }

  const state = { keyword: '', page: 1, pageSize: 10, loading: false };
  const homeState = { team: null, tab: 'members', keyword: '', chart: null, chartObserver: null };
  const primaryTeamProfile = {
    receivedCriteria: '呼吸系统疾病出院后需持续随访，且患者本人已完成知情同意。',
    planCount: 3,
    warningRuleCount: 2,
    dates: ['2026/08/06', '2026/08/07', '2026/08/08', '2026/08/09', '2026/08/10', '2026/08/11', '2026/08/12'],
    growth: [0, 1, 1, 2, 3, 4, 5],
    plans: [
      { name: '呼吸系统疾病出院后30天随访方案', cycle: '30天', tasks: 12, status: '已启用' },
      { name: '慢阻肺稳定期健康管理方案', cycle: '90天', tasks: 18, status: '已启用' },
      { name: '肺炎康复期健康指导方案', cycle: '14天', tasks: 8, status: '已启用' }
    ]
  };
  const teamMembers = [
    { name: '张明远', department: '呼吸与危重症医学科', identity: '医生', title: '主任医师', administrator: true, status: '正常' },
    { name: '李铭锐', department: '呼吸与危重症医学科', identity: '医生', title: '副主任医师', administrator: false, status: '正常' },
    { name: '刘晓静', department: '呼吸与危重症医学科', identity: '护士', title: '主管护师', administrator: false, status: '正常' },
    { name: '周雨晴', department: '临床营养科', identity: '营养师', title: '主管营养师', administrator: false, status: '正常' }
  ];
  const teamPatients = [
    { name: '黄尚忠', gender: '男', age: 73, phone: '166****5580', joinedAt: '2026/08/12', status: '管理中' },
    { name: '韦望林', gender: '女', age: 62, phone: '138****1977', joinedAt: '2026/08/11', status: '管理中' },
    { name: '陈建国', gender: '男', age: 58, phone: '136****3208', joinedAt: '2026/08/09', status: '管理中' },
    { name: '吴秀兰', gender: '女', age: 69, phone: '159****6742', joinedAt: '2026/08/07', status: '管理中' },
    { name: '周明远', gender: '男', age: 51, phone: '135****9076', joinedAt: '2026/08/06', status: '管理中' }
  ];
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

  function filteredRows() {
    const keyword = state.keyword.trim().toLowerCase();
    return keyword ? teamRows.filter(row => row.name.toLowerCase().includes(keyword)) : teamRows;
  }

  function pageItems(totalPages) {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    const items = [1];
    if (state.page > 4) items.push('left-ellipsis');
    const start = Math.max(2, state.page - 2);
    const end = Math.min(totalPages - 1, state.page + 2);
    for (let page = start; page <= end; page += 1) items.push(page);
    if (state.page < totalPages - 3) items.push('right-ellipsis');
    items.push(totalPages);
    return items;
  }

  function renderTeamList() {
    const body = document.getElementById('teamTableBody');
    const tableWrap = document.getElementById('teamTableWrap');
    const pagination = document.getElementById('teamPagination');
    if (!body || !tableWrap || !pagination) return;
    const rows = filteredRows();
    const totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    state.page = Math.min(state.page, totalPages);
    const visibleRows = rows.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
    if (state.loading) {
      tableWrap.innerHTML = '<div class="team-loading-state"><span class="team-loading-dot"></span><span>正在加载团队数据...</span></div>';
    } else {
      tableWrap.innerHTML = `<table class="team-table"><thead><tr><th class="team-col-index">序号</th><th class="team-col-name">团队名称</th><th class="team-col-dept">关联科室</th><th class="team-col-desc">团队介绍</th><th class="team-col-admin">团队管理员</th><th class="team-col-count">团队成员数</th><th class="team-col-patient">在组患者数</th><th class="team-col-action">操作</th></tr></thead><tbody id="teamTableBody">${visibleRows.map(row => `<tr><td>${row.id}</td><td title="${escapeHtml(row.name)}">${escapeHtml(row.name)}</td><td title="${escapeHtml(row.department)}">${escapeHtml(row.department)}</td><td title="${escapeHtml(row.description)}">${escapeHtml(row.description)}</td><td>${escapeHtml(row.administrator)}</td><td>${row.members}</td><td>${row.patients}</td><td><button type="button" class="team-home-link" data-team-home="${row.id}">团队主页</button></td></tr>`).join('')}</tbody></table>${visibleRows.length ? '' : '<div class="team-empty"><span class="team-empty-icon"></span><span>暂无符合条件的团队</span></div>'}`;
    }
    pagination.innerHTML = `<span class="team-total">共 ${rows.length} 条</span><button type="button" class="team-page-btn" data-team-page="prev" ${state.page === 1 ? 'disabled' : ''} aria-label="上一页">‹</button>${pageItems(totalPages).map(item => typeof item === 'number' ? `<button type="button" class="team-page-btn${item === state.page ? ' active' : ''}" data-team-page="${item}">${item}</button>` : '<span>•••</span>').join('')}<button type="button" class="team-page-btn" data-team-page="next" ${state.page === totalPages ? 'disabled' : ''} aria-label="下一页">›</button><select class="team-page-size" id="teamPageSize" aria-label="每页条数"><option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10 条/页</option><option value="20" ${state.pageSize === 20 ? 'selected' : ''}>20 条/页</option><option value="50" ${state.pageSize === 50 ? 'selected' : ''}>50 条/页</option></select><span>跳至</span><input class="team-page-jump" id="teamPageJump" inputmode="numeric" aria-label="跳转页码"><span>页</span>`;
  }

  function setKeyword(value) {
    state.keyword = value;
    state.page = 1;
    document.querySelector('.team-search-clear')?.classList.toggle('visible', Boolean(value));
    renderTeamList();
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function renderGrowthChart() {
    const chartElement = document.getElementById('teamGrowthChart');
    if (!chartElement || !window.echarts) return;
    if (homeState.chart) homeState.chart.dispose();
    homeState.chartObserver?.disconnect();
    const chart = window.echarts.init(chartElement, null, { renderer: 'canvas' });
    const profile = homeState.team?.id === 1 ? primaryTeamProfile : null;
    const values = profile?.growth || [0, 0, 1, 1, 2, Math.max(2, (homeState.team?.patients || 2) - 1), homeState.team?.patients || 2];
    const dates = profile?.dates || ['2026/08/06', '2026/08/07', '2026/08/08', '2026/08/09', '2026/08/10', '2026/08/11', '2026/08/12'];
    const maxValue = Math.max(5, Math.ceil(Math.max(...values) / 5) * 5);
    chart.setOption({
      animationDuration: 500,
      grid: { left: 40, right: 24, top: 18, bottom: 28 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,.96)',
        borderWidth: 0,
        padding: [10, 12],
        textStyle: { color: '#6f7d91', fontSize: 12 },
        extraCssText: 'box-shadow:0 6px 20px rgba(31,51,82,.15);border-radius:6px;',
        formatter(params) {
          const point = params[0];
          const previous = Math.max(0, point.dataIndex ? values[point.dataIndex - 1] : 0);
          const change = point.value - previous;
          return `<strong style="display:block;margin-bottom:8px;color:#5a6880">${point.axisValue}</strong><span>总人数： <b>${point.value}</b> 人</span><br><span>较前日： <b style="color:#4dc88a">${change >= 0 ? '+' : ''}${change}</b> 人</span>`;
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#7f8b9e', fontSize: 11, margin: 13 }
      },
      yAxis: {
        type: 'value', min: 0, max: maxValue, interval: Math.max(1, maxValue / 5),
        axisLine: { show: true, lineStyle: { color: '#bcd1ff' } },
        axisTick: { show: false },
        axisLabel: { color: '#8994a6', fontSize: 11 },
        splitLine: { lineStyle: { color: '#edf1f7', type: 'dashed' } }
      },
      series: [{
        name: '在组患者累计数', type: 'line', smooth: 0.35, data: values,
        symbol: 'circle', symbolSize: 5, showSymbol: true,
        lineStyle: { color: '#6f99ff', width: 2 },
        itemStyle: { color: '#fff', borderColor: '#5f8eff', borderWidth: 2 },
        areaStyle: { color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(105,153,255,.34)' }, { offset: 1, color: 'rgba(105,153,255,.03)' }]) },
        emphasis: { focus: 'series' }
      }]
    });
    homeState.chart = chart;
    homeState.chartObserver = new ResizeObserver(() => chart.resize());
    homeState.chartObserver.observe(chartElement);
    requestAnimationFrame(() => chart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: values.length - 1 }));
  }

  function renderPeopleTable() {
    const wrap = document.getElementById('teamPeopleTableWrap');
    if (!wrap) return;
    const keyword = homeState.keyword.trim().toLowerCase();
    if (homeState.tab === 'members') {
      const members = teamMembers.filter(item => item.name.toLowerCase().includes(keyword));
      wrap.innerHTML = members.length ? `<table class="team-people-table"><thead><tr><th style="width:9%">序号</th><th style="width:15%">姓名</th><th style="width:22%">科室</th><th style="width:11%">身份</th><th style="width:13%">职称</th><th style="width:11%">团队管理员</th><th style="width:10%">状态</th><th style="width:9%">操作</th></tr></thead><tbody>${members.map((member, index) => `<tr><td>${index + 1}</td><td><span class="team-member-name"><i class="team-member-avatar"></i>${escapeHtml(member.name)}</span></td><td>${escapeHtml(member.department)}</td><td>${escapeHtml(member.identity)}</td><td>${escapeHtml(member.title)}</td><td><button type="button" class="team-admin-switch${member.administrator ? ' on' : ''}" data-team-admin-toggle aria-label="切换团队管理员"></button></td><td><span class="team-normal-status">${escapeHtml(member.status)}</span></td><td><button type="button" class="team-detail-action">详情</button><button type="button" class="team-remove-action">移除</button></td></tr>`).join('')}</tbody></table>` : '<div class="team-people-empty">暂无符合条件的团队成员</div>';
    } else {
      const patients = teamPatients.filter(item => item.name.toLowerCase().includes(keyword));
      wrap.innerHTML = patients.length ? `<table class="team-people-table"><thead><tr><th style="width:9%">序号</th><th style="width:18%">姓名</th><th style="width:10%">性别</th><th style="width:10%">年龄</th><th style="width:20%">手机号码</th><th style="width:18%">入组时间</th><th style="width:10%">状态</th><th style="width:9%">操作</th></tr></thead><tbody>${patients.map((patient, index) => `<tr><td>${index + 1}</td><td><span class="team-member-name"><i class="team-member-avatar"></i>${escapeHtml(patient.name)}</span></td><td>${patient.gender}</td><td>${patient.age}</td><td>${patient.phone}</td><td>${patient.joinedAt}</td><td><span class="team-normal-status">${patient.status}</span></td><td><button type="button" class="team-detail-action">详情</button></td></tr>`).join('')}</tbody></table>` : '<div class="team-people-empty">暂无符合条件的在组患者</div>';
    }
  }

  function renderPlanContent(plans) {
    const container = document.getElementById('teamPlanContent');
    if (!container) return;
    if (!plans?.length) {
      container.innerHTML = '<div class="team-plan-empty"><div class="team-empty-box"><span class="team-box-lid"></span><i></i><i></i></div><span>暂无已配置方案</span></div>';
      return;
    }
    container.innerHTML = `<div class="team-plan-grid">${plans.map(plan => `<article class="team-home-plan-card"><div class="team-home-plan-head"><span class="team-home-plan-icon">▣</span><strong>${escapeHtml(plan.name)}</strong><span class="team-home-plan-status">${escapeHtml(plan.status)}</span></div><div class="team-home-plan-meta"><span>管理周期：<b>${escapeHtml(plan.cycle)}</b></span><span>任务数：<b>${plan.tasks}</b></span></div><button type="button" class="team-home-plan-action">查看方案 ›</button></article>`).join('')}</div>`;
  }

  function renderTeamHome(team) {
    const isPrimaryTeam = team.id === 1;
    const profile = isPrimaryTeam ? primaryTeamProfile : { receivedCriteria: '符合该团队专病管理范围并已完成知情同意。', planCount: 0, warningRuleCount: 1, plans: [] };
    setText('teamHomeName', team.name);
    setText('teamHomeAdmin', team.administrator || '--');
    setText('teamHomeDepartment', team.department || '--');
    setText('teamHomeDescription', team.description || '--');
    setText('teamHomeReceived', profile.receivedCriteria);
    setText('teamMetricPatients', `${team.patients}人`);
    setText('teamMetricGrowth', `+${Math.max(0, team.patients - (profile.growth?.[0] || 0))}`);
    setText('teamMetricPlans', `${profile.planCount}个`);
    setText('teamMetricMembers', `${team.members}人`);
    setText('teamMetricWarnings', `${profile.warningRuleCount}条`);
    setText('teamPlanTotal', profile.planCount);
    setText('teamChartDateRange', `${(profile.dates || ['2026/08/06'])[0]} - ${(profile.dates || ['2026/08/12']).at(-1)}`);
    setText('teamMemberTabCount', team.members);
    setText('teamPatientTabCount', team.patients);
    homeState.tab = 'members';
    homeState.keyword = '';
    const peopleSearch = document.getElementById('teamPeopleSearch');
    if (peopleSearch) peopleSearch.value = '';
    document.querySelectorAll('[data-team-home-tab]').forEach(button => button.classList.toggle('active', button.dataset.teamHomeTab === 'members'));
    setText('teamAddPersonLabel', '添加成员');
    renderPlanContent(profile.plans);
    renderPeopleTable();
    requestAnimationFrame(renderGrowthChart);
  }

  function openTeamHome(team) {
    if (!team) return;
    homeState.team = team;
    document.querySelectorAll('#listPage .list-view.active').forEach(view => view.classList.remove('active'));
    const homeView = document.getElementById('teamHomeView');
    homeView?.classList.add('active');
    if (homeView) homeView.scrollTop = 0;
    const pageTitle = document.getElementById('listPageTitle');
    if (pageTitle) pageTitle.innerHTML = '<button type="button" class="team-home-back" data-team-home-back aria-label="返回团队管理">‹</button>团队主页';
    document.querySelector('.list-main')?.scrollTo?.(0, 0);
    renderTeamHome(team);
  }

  function closeTeamHome() {
    homeState.chart?.dispose();
    homeState.chartObserver?.disconnect();
    homeState.chart = null;
    homeState.chartObserver = null;
    if (typeof window.showListView === 'function') window.showListView('teams');
    else {
      document.getElementById('teamHomeView')?.classList.remove('active');
      document.getElementById('teamManagementView')?.classList.add('active');
      setText('listPageTitle', '团队管理');
    }
  }

  document.addEventListener('input', event => {
    if (event.target.id === 'teamSearchInput') setKeyword(event.target.value);
    if (event.target.id === 'teamPeopleSearch') {
      homeState.keyword = event.target.value;
      renderPeopleTable();
    }
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'teamPageSize') {
      state.pageSize = Number(event.target.value) || 10;
      state.page = 1;
      renderTeamList();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.target.id === 'teamPageJump' && event.key === 'Enter') {
      const totalPages = Math.max(1, Math.ceil(filteredRows().length / state.pageSize));
      const page = Number(event.target.value);
      if (Number.isInteger(page) && page >= 1 && page <= totalPages) { state.page = page; renderTeamList(); }
    }
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-team-search-clear]')) {
      const input = document.getElementById('teamSearchInput');
      if (input) input.value = '';
      setKeyword('');
      input?.focus();
      return;
    }
    const reload = event.target.closest('[data-team-reload]');
    if (reload && !state.loading) {
      state.loading = true;
      reload.classList.add('loading');
      renderTeamList();
      window.setTimeout(() => { state.loading = false; reload.classList.remove('loading'); renderTeamList(); }, 500);
      return;
    }
    const pageButton = event.target.closest('[data-team-page]');
    if (pageButton && !pageButton.disabled) {
      const totalPages = Math.max(1, Math.ceil(filteredRows().length / state.pageSize));
      const target = pageButton.dataset.teamPage;
      state.page = target === 'prev' ? Math.max(1, state.page - 1) : target === 'next' ? Math.min(totalPages, state.page + 1) : Number(target);
      renderTeamList();
      return;
    }
    const home = event.target.closest('[data-team-home]');
    if (home) {
      const team = teamRows.find(row => row.id === Number(home.dataset.teamHome));
      openTeamHome(team);
      return;
    }
    if (event.target.closest('[data-team-home-back]')) {
      closeTeamHome();
      return;
    }
    const peopleTab = event.target.closest('[data-team-home-tab]');
    if (peopleTab) {
      homeState.tab = peopleTab.dataset.teamHomeTab;
      homeState.keyword = '';
      const peopleSearch = document.getElementById('teamPeopleSearch');
      if (peopleSearch) peopleSearch.value = '';
      document.querySelectorAll('[data-team-home-tab]').forEach(button => button.classList.toggle('active', button === peopleTab));
      setText('teamAddPersonLabel', homeState.tab === 'members' ? '添加成员' : '添加患者');
      renderPeopleTable();
      return;
    }
    const adminSwitch = event.target.closest('[data-team-admin-toggle]');
    if (adminSwitch) {
      adminSwitch.classList.toggle('on');
      return;
    }
    if (event.target.closest('[data-team-create]')) window.showToast?.('新建团队功能已就绪');
  });

  window.renderTeamList = renderTeamList;
  window.teamManagementRows = teamRows;
  renderTeamList();
})();
