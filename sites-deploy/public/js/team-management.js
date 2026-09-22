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
  const institutions = ['南宁市第二人民医院', '南宁市第五人民医院', '南宁市妇幼保健院', '南宁中医医院', '南宁第一人民医院', '柳州市人民医院', '桂林市人民医院'];
  const teamRows = seedTeams.map((item, index) => ({ id: index + 1, name: item[0], institution: institutions[index % institutions.length], department: item[1], description: item[2], administrator: item[3], members: item[4], patients: item[5] }));
  for (let i = teamRows.length; i < 64; i += 1) {
    const topic = topics[(i - 10) % topics.length];
    const department = departments[(i - 10) % departments.length];
    teamRows.push({
      id: i + 1,
      name: `${topic}团队${String(i - 9).padStart(2, '0')}`,
      institution: institutions[i % institutions.length],
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
    warningRuleCount: 2,
    dates: ['2026/08/06', '2026/08/07', '2026/08/08', '2026/08/09', '2026/08/10', '2026/08/11', '2026/08/12'],
    growth: [0, 1, 1, 2, 3, 4, 5],
    plans: [
      { id: 'team-plan-1', name: '呼吸系统疾病出院后30天随访方案', profile: '呼吸系统疾病出院患者', tasks: 12, enabledVersion: 2, versions: [{ number: 2, name: '呼吸系统疾病出院后30天随访方案', profile: '呼吸系统疾病出院患者', tasks: 12 }, { number: 1, name: '呼吸系统疾病出院后30天随访方案', profile: '呼吸系统疾病出院患者', tasks: 10 }] },
      { id: 'team-plan-2', name: '慢阻肺稳定期健康管理方案', profile: '慢阻肺稳定期患者', tasks: 18, enabledVersion: 1, versions: [{ number: 1, name: '慢阻肺稳定期健康管理方案', profile: '慢阻肺稳定期患者', tasks: 18 }] },
      { id: 'team-plan-3', name: '肺炎康复期健康指导方案', profile: '肺炎康复期患者', tasks: 8, enabledVersion: 1, versions: [{ number: 1, name: '肺炎康复期健康指导方案', profile: '肺炎康复期患者', tasks: 8 }] }
    ]
  };
  const teamPlanStorageKey = 'frontend-architect:team-plans:v1';
  const defaultTeamPlans = { 1: primaryTeamProfile.plans };
  let teamPlans;
  try {
    const saved = JSON.parse(localStorage.getItem(teamPlanStorageKey) || 'null');
    teamPlans = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : structuredClone(defaultTeamPlans);
  } catch { teamPlans = structuredClone(defaultTeamPlans); }
  const plansForTeam = teamId => teamPlans[teamId] || [];
  const saveTeamPlans = () => {
    try { localStorage.setItem(teamPlanStorageKey, JSON.stringify(teamPlans)); return true; }
    catch { window.showToast?.('保存失败，请检查浏览器存储空间'); return false; }
  };
  const versionLabel = number => number < 10 ? `第${'零一二三四五六七八九'[number]}版` : `第${number}版`;
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
      tableWrap.innerHTML = `<table class="team-table"><thead><tr><th class="team-col-index">序号</th><th class="team-col-name">团队名称</th><th class="team-col-institution">所属机构</th><th class="team-col-dept">关联科室</th><th class="team-col-desc">团队介绍</th><th class="team-col-admin">团队管理员</th><th class="team-col-count">团队成员数</th><th class="team-col-patient">在组患者数</th><th class="team-col-action">操作</th></tr></thead><tbody id="teamTableBody">${visibleRows.map(row => `<tr><td>${row.id}</td><td title="${escapeHtml(row.name)}">${escapeHtml(row.name)}</td><td title="${escapeHtml(row.institution)}">${escapeHtml(row.institution)}</td><td title="${escapeHtml(row.department)}">${escapeHtml(row.department)}</td><td title="${escapeHtml(row.description)}">${escapeHtml(row.description)}</td><td>${escapeHtml(row.administrator)}</td><td>${row.members}</td><td>${row.patients}</td><td><button type="button" class="team-home-link" data-team-home="${row.id}">团队主页</button></td></tr>`).join('')}</tbody></table>${visibleRows.length ? '' : '<div class="team-empty"><span class="team-empty-icon"></span><span>暂无符合条件的团队</span></div>'}`;
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

  let openPlanMenu = null;
  let planDialog = null;
  const planForAction = id => plansForTeam(homeState.team?.id).find(plan => plan.id === id);
  const displayPlan = plan => plan.versions?.find(version => version.number === plan.enabledVersion) || plan.versions?.[0] || plan;

  function renderPlanContent() {
    const container = document.getElementById('teamPlanContent');
    if (!container) return;
    const plans = plansForTeam(homeState.team?.id);
    setText('teamPlanTotal', plans.length);
    setText('teamMetricPlans', `${plans.filter(plan => plan.enabledVersion != null).length}个`);
    if (!plans.length) {
      container.innerHTML = '<div class="team-plan-empty"><div class="team-empty-box"><span class="team-box-lid"></span><i></i><i></i></div><span>暂无已配置方案</span></div>';
      return;
    }
    container.innerHTML = `<div class="team-plan-grid">${plans.map(plan => {
      const data = displayPlan(plan);
      const status = plan.enabledVersion != null ? '已启用' : plan.paused ? '已停用' : '待发布';
      return `<article class="team-home-plan-card"><div class="team-home-plan-head"><span class="team-home-plan-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M8 6h11M8 12h11M8 18h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.5" fill="currentColor"/><circle cx="4.5" cy="12" r="1.5" fill="currentColor"/><circle cx="4.5" cy="18" r="1.5" fill="currentColor"/></svg></span><strong title="${escapeHtml(data.name)}">${escapeHtml(data.name)}</strong><span class="team-home-plan-status ${status === '已启用' ? '' : 'inactive'}">${status}</span></div><div class="team-home-plan-body"><p><span>适用画像：</span><b>${escapeHtml(data.profile || '未设置')}</b></p><p><span>版本号：</span><b>${versionLabel(data.number || 1)}</b></p></div><div class="team-home-plan-foot"><span class="team-home-plan-task">任务: ${Number(data.tasks) || 0}</span><div class="team-home-plan-menu-wrap"><button type="button" class="team-home-plan-more" data-team-plan-more="${escapeHtml(plan.id)}" aria-expanded="${openPlanMenu === plan.id}" aria-haspopup="menu">更多<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 6 5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="team-home-plan-menu" role="menu" ${openPlanMenu === plan.id ? '' : 'hidden'}><button type="button" role="menuitem" data-team-plan-action="toggle" data-plan-id="${escapeHtml(plan.id)}">${plan.enabledVersion != null ? '停用' : '启用'}</button><button type="button" role="menuitem" data-team-plan-action="edit" data-plan-id="${escapeHtml(plan.id)}">编辑</button><button type="button" role="menuitem" data-team-plan-action="copy" data-plan-id="${escapeHtml(plan.id)}">复制新增</button><button type="button" role="menuitem" data-team-plan-action="versions" data-plan-id="${escapeHtml(plan.id)}">版本管理</button><button type="button" role="menuitem" class="danger" data-team-plan-action="delete" data-plan-id="${escapeHtml(plan.id)}">删除</button></div></div></div></article>`;
    }).join('')}</div>`;
  }

  function closePlanDialog() {
    planDialog?.remove();
    planDialog = null;
  }

  function showPlanDialog(type, plan = null) {
    closePlanDialog();
    openPlanMenu = null;
    renderPlanContent();
    planDialog = document.createElement('div');
    planDialog.className = 'team-plan-modal-mask';
    if (type === 'delete' && plan) {
      planDialog.innerHTML = `<section class="team-plan-dialog" role="alertdialog" aria-modal="true" aria-labelledby="teamPlanDialogTitle"><header><h2 id="teamPlanDialogTitle">删除方案</h2><button type="button" data-team-plan-dialog-close aria-label="关闭">×</button></header><p class="team-plan-delete-message">确定删除“${escapeHtml(plan.name)}”及其全部版本吗？删除后将无法在团队主页找回。</p><footer><button type="button" data-team-plan-dialog-close>取消</button><button type="button" class="danger" data-team-plan-delete-confirm="${escapeHtml(plan.id)}">删除</button></footer></section>`;
    } else if (type === 'versions' && plan) {
      planDialog.innerHTML = `<section class="team-plan-dialog" role="dialog" aria-modal="true" aria-labelledby="teamPlanDialogTitle"><header><h2 id="teamPlanDialogTitle">版本管理</h2><button type="button" data-team-plan-dialog-close aria-label="关闭">×</button></header><p class="team-plan-dialog-subtitle">${escapeHtml(plan.name)}</p><div class="team-plan-version-list">${(plan.versions || []).map(version => `<div class="team-plan-version-item"><div><strong>${versionLabel(version.number)}${plan.enabledVersion === version.number ? ' · 当前启用' : ''}</strong><span>${escapeHtml(version.profile || '未设置画像')} · ${Number(version.tasks) || 0} 个任务</span></div><button type="button" data-team-enable-version="${version.number}" data-plan-id="${escapeHtml(plan.id)}" ${plan.enabledVersion === version.number ? 'disabled' : ''}>启用此版本</button></div>`).join('')}</div><footer><button type="button" data-team-plan-dialog-close>关闭</button></footer></section>`;
    } else {
      const data = plan ? displayPlan(plan) : { name: '', profile: '', tasks: 0 };
      planDialog.innerHTML = `<section class="team-plan-dialog" role="dialog" aria-modal="true" aria-labelledby="teamPlanDialogTitle"><header><h2 id="teamPlanDialogTitle">${plan ? '编辑方案' : '新建方案模板'}</h2><button type="button" data-team-plan-dialog-close aria-label="关闭">×</button></header><form id="teamPlanForm" data-plan-id="${escapeHtml(plan?.id || '')}"><label>方案名称<input name="name" maxlength="100" required value="${escapeHtml(data.name)}"></label><label>适用画像<input name="profile" maxlength="100" required value="${escapeHtml(data.profile)}"></label><label>任务数量<input name="tasks" type="number" min="0" max="999" required value="${Number(data.tasks) || 0}"></label><footer><button type="button" data-team-plan-dialog-close>取消</button><button type="submit" class="primary">保存</button></footer></form></section>`;
    }
    document.body.append(planDialog);
    planDialog.querySelector('input, [data-team-plan-dialog-close]')?.focus();
  }

  function renderTeamHome(team) {
    const isPrimaryTeam = team.id === 1;
    const profile = isPrimaryTeam ? primaryTeamProfile : { receivedCriteria: '符合该团队专病管理范围并已完成知情同意。', warningRuleCount: 1 };
    setText('teamHomeName', team.name);
    setText('teamHomeAdmin', team.administrator || '--');
    setText('teamHomeInstitution', team.institution || '--');
    setText('teamHomeDepartment', team.department || '--');
    setText('teamHomeDescription', team.description || '--');
    setText('teamHomeReceived', profile.receivedCriteria);
    setText('teamMetricPatients', `${team.patients}人`);
    setText('teamMetricGrowth', `+${Math.max(0, team.patients - (profile.growth?.[0] || 0))}`);
    setText('teamMetricMembers', `${team.members}人`);
    setText('teamMetricWarnings', `${profile.warningRuleCount}条`);
    setText('teamChartDateRange', `${(profile.dates || ['2026/08/06'])[0]} - ${(profile.dates || ['2026/08/12']).at(-1)}`);
    setText('teamMemberTabCount', team.members);
    setText('teamPatientTabCount', team.patients);
    homeState.tab = 'members';
    homeState.keyword = '';
    const peopleSearch = document.getElementById('teamPeopleSearch');
    if (peopleSearch) peopleSearch.value = '';
    document.querySelectorAll('[data-team-home-tab]').forEach(button => button.classList.toggle('active', button.dataset.teamHomeTab === 'members'));
    setText('teamAddPersonLabel', '添加成员');
    openPlanMenu = null;
    renderPlanContent();
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

  function availableOrganizations() {
    try {
      const saved = JSON.parse(localStorage.getItem('organization-management-v2'));
      if (Array.isArray(saved?.orgs) && saved.orgs.length) return saved.orgs.filter(org => org.enabled !== false);
    } catch {}
    return institutions.map((name, index) => ({ id: `team-org-${index}`, name, departments: [] }));
  }

  function departmentOptions(organizationName) {
    if (!organizationName) return [];
    const organization = availableOrganizations().find(item => item.name === organizationName);
    const organizationDepartments = (organization?.departments || []).filter(item => item.enabled !== false).map(item => item.name);
    return organizationDepartments.length ? organizationDepartments : departments;
  }

  function renderDepartmentOptions(organizationName) {
    const select = document.getElementById('teamCreateDepartment');
    if (!select) return;
    select.innerHTML = `<option value="">${organizationName ? '请选择' : '请先选择所属机构'}</option>${departmentOptions(organizationName).map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}`;
    select.value = '';
  }

  function ensureTeamCreatePage() {
    let page = document.getElementById('teamCreatePage');
    if (page) return page;
    page = document.createElement('section');
    page.id = 'teamCreatePage';
    page.className = 'team-create-page';
    page.hidden = true;
    page.innerHTML = `
      <header class="team-create-header">
        <button type="button" class="team-create-exit" data-team-create-close aria-label="退出新建团队">× <span>退出</span></button>
        <strong>新建团队</strong>
        <button type="button" class="team-create-save" data-team-create-save>保存</button>
      </header>
      <main class="team-create-canvas">
        <form class="team-create-form" id="teamCreateForm" novalidate>
          <label class="team-create-field required"><span>团队名称</span><span class="team-create-control"><input id="teamCreateName" maxlength="20" placeholder="请输入" autocomplete="off" required><em><b data-team-count-for="teamCreateName">0</b> / 20</em></span><small class="team-create-error">请输入团队名称</small></label>
          <label class="team-create-field"><span>团队简介</span><span class="team-create-control"><textarea id="teamCreateDescription" maxlength="200" rows="4" placeholder="请输入"></textarea><em><b data-team-count-for="teamCreateDescription">0</b> / 200</em></span></label>
          <label class="team-create-field required"><span>所属机构</span><select id="teamCreateInstitution" required><option value="">请选择</option></select><small class="team-create-error">请选择所属机构</small></label>
          <label class="team-create-field required"><span>关联科室</span><select id="teamCreateDepartment" required><option value="">请先选择所属机构</option></select><small class="team-create-error">请选择关联科室</small></label>
          <div class="team-create-field"><span>团队成员 <i title="可在团队主页继续维护成员">ⓘ</i></span><button type="button" class="team-create-add-member" data-team-add-member>＋ 添加成员</button></div>
          <label class="team-create-field required"><span class="team-create-label-row">分组规则 <i title="用于定义患者加入团队的条件">ⓘ</i><button type="button" data-team-rule-optimize>✦ 一键优化</button></span><span class="team-create-control"><textarea id="teamCreateRule" maxlength="300" rows="4" placeholder="例如：分配到本团队的患者需要满足出院天数、年龄范围、科室、主诊断等条件"></textarea><em><b data-team-count-for="teamCreateRule">0</b> / 300</em></span><small class="team-create-error">请输入分组规则</small></label>
          <fieldset class="team-create-field required"><legend>患者入组审核 <i title="开启后患者需审核才能进入团队">ⓘ</i></legend><div class="team-create-radio-group"><label><input type="radio" name="teamCreateAudit" value="是" checked>是</label><label><input type="radio" name="teamCreateAudit" value="否">否</label></div></fieldset>
          <label class="team-create-field required"><span>默认健康负责人 <i title="可在团队主页调整">ⓘ</i></span><select id="teamCreateOwner"><option value="">暂不指定</option><option>张明远</option><option>陈慧敏</option><option>赵文博</option><option>王建华</option></select></label>
          <fieldset class="team-create-field required"><legend>是否启用智能外呼 <i title="启用后按设置时段执行智能外呼">ⓘ</i></legend><div class="team-create-radio-group"><label><input type="radio" name="teamCreateCall" value="是" checked>是</label><label><input type="radio" name="teamCreateCall" value="否">否</label></div></fieldset>
          <div class="team-create-field required"><span>外呼时间段 <small>医院智能外呼建议设置在 09:30–12:00、14:00–22:15</small></span><div class="team-create-time"><input id="teamCreateStartTime" type="time" value="09:30" aria-label="外呼开始时间"><span>→</span><input id="teamCreateEndTime" type="time" value="22:15" aria-label="外呼结束时间"></div></div>
        </form>
      </main>`;
    document.body.appendChild(page);
    return page;
  }

  function openTeamCreate() {
    const page = ensureTeamCreatePage();
    const form = document.getElementById('teamCreateForm');
    form?.reset();
    page.querySelectorAll('.invalid').forEach(element => element.classList.remove('invalid'));
    page.querySelectorAll('[data-team-count-for]').forEach(counter => { counter.textContent = '0'; });
    const institutionSelect = document.getElementById('teamCreateInstitution');
    institutionSelect.innerHTML = `<option value="">请选择</option>${availableOrganizations().map(org => `<option value="${escapeHtml(org.name)}">${escapeHtml(org.name)}</option>`).join('')}`;
    renderDepartmentOptions('');
    page.hidden = false;
    document.body.classList.add('team-create-open');
    document.getElementById('teamCreateName')?.focus();
  }

  function closeTeamCreate() {
    const page = document.getElementById('teamCreatePage');
    if (page) page.hidden = true;
    document.body.classList.remove('team-create-open');
  }

  function saveTeamCreate() {
    const requiredIds = ['teamCreateName', 'teamCreateInstitution', 'teamCreateDepartment', 'teamCreateRule'];
    let firstInvalid = null;
    requiredIds.forEach(id => {
      const field = document.getElementById(id);
      const invalid = !field?.value.trim();
      field?.closest('.team-create-field')?.classList.toggle('invalid', invalid);
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }
    const row = {
      id: Math.max(0, ...teamRows.map(item => item.id)) + 1,
      name: document.getElementById('teamCreateName').value.trim(),
      institution: document.getElementById('teamCreateInstitution').value,
      department: document.getElementById('teamCreateDepartment').value,
      description: document.getElementById('teamCreateDescription').value.trim() || '--',
      administrator: document.getElementById('teamCreateOwner').value || '--',
      members: 0,
      patients: 0
    };
    teamRows.unshift(row);
    state.page = 1;
    state.keyword = '';
    const search = document.getElementById('teamSearchInput');
    if (search) search.value = '';
    renderTeamList();
    closeTeamCreate();
    window.showToast?.('团队创建成功');
  }

  document.addEventListener('input', event => {
    if (event.target.id === 'teamSearchInput') setKeyword(event.target.value);
    if (event.target.id === 'teamPeopleSearch') {
      homeState.keyword = event.target.value;
      renderPeopleTable();
    }
    const counter = document.querySelector(`[data-team-count-for="${event.target.id}"]`);
    if (counter) counter.textContent = String(event.target.value.length);
    if (event.target.closest('.team-create-field')) event.target.closest('.team-create-field').classList.remove('invalid');
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'teamPageSize') {
      state.pageSize = Number(event.target.value) || 10;
      state.page = 1;
      renderTeamList();
    }
    if (event.target.id === 'teamCreateInstitution') {
      event.target.closest('.team-create-field')?.classList.remove('invalid');
      renderDepartmentOptions(event.target.value);
    }
    if (event.target.id === 'teamCreateDepartment') event.target.closest('.team-create-field')?.classList.remove('invalid');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (planDialog) closePlanDialog();
      if (openPlanMenu) { openPlanMenu = null; renderPlanContent(); }
    }
    if (event.target.id === 'teamPageJump' && event.key === 'Enter') {
      const totalPages = Math.max(1, Math.ceil(filteredRows().length / state.pageSize));
      const page = Number(event.target.value);
      if (Number.isInteger(page) && page >= 1 && page <= totalPages) { state.page = page; renderTeamList(); }
    }
  });
  document.addEventListener('submit', event => {
    if (event.target.id !== 'teamPlanForm') return;
    event.preventDefault();
    const form = event.target;
    const name = form.elements.name.value.trim();
    const profile = form.elements.profile.value.trim();
    const tasks = Number(form.elements.tasks.value);
    if (!name || !profile || !Number.isInteger(tasks) || tasks < 0 || tasks > 999) return;
    const teamId = homeState.team?.id;
    if (!teamId) return;
    teamPlans[teamId] ||= [];
    const previous = structuredClone(teamPlans[teamId]);
    const plan = form.dataset.planId ? planForAction(form.dataset.planId) : null;
    if (plan) {
      const number = Math.max(0, ...plan.versions.map(version => version.number)) + 1;
      plan.versions.unshift({ number, name, profile, tasks });
      plan.name = name; plan.profile = profile; plan.tasks = tasks;
      if (plan.enabledVersion != null) plan.enabledVersion = number;
    } else {
      const id = `team-plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      teamPlans[teamId].unshift({ id, name, profile, tasks, enabledVersion: null, paused: false, versions: [{ number: 1, name, profile, tasks }] });
    }
    if (!saveTeamPlans()) { teamPlans[teamId] = previous; return; }
    closePlanDialog(); renderPlanContent();
    window.showToast?.(plan ? '方案已保存为新版本' : '方案模板已创建，启用后对团队生效');
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-team-plan-dialog-close]') || event.target === planDialog) { closePlanDialog(); return; }
    const deleteConfirm = event.target.closest('[data-team-plan-delete-confirm]');
    if (deleteConfirm) {
      const teamId = homeState.team?.id;
      const previous = structuredClone(teamPlans[teamId] || []);
      teamPlans[teamId] = previous.filter(plan => plan.id !== deleteConfirm.dataset.teamPlanDeleteConfirm);
      if (!saveTeamPlans()) { teamPlans[teamId] = previous; return; }
      closePlanDialog(); renderPlanContent(); window.showToast?.('方案已删除'); return;
    }
    const enableVersion = event.target.closest('[data-team-enable-version]');
    if (enableVersion) {
      const plan = planForAction(enableVersion.dataset.planId);
      if (plan) {
        plan.enabledVersion = Number(enableVersion.dataset.teamEnableVersion);
        plan.paused = false;
        if (saveTeamPlans()) { closePlanDialog(); renderPlanContent(); window.showToast?.('启用版本已更新'); }
      }
      return;
    }
    if (event.target.closest('#teamHomeView .team-plan-panel .team-primary-action')) { showPlanDialog('edit'); return; }
    const more = event.target.closest('[data-team-plan-more]');
    if (more) { openPlanMenu = openPlanMenu === more.dataset.teamPlanMore ? null : more.dataset.teamPlanMore; renderPlanContent(); return; }
    const planAction = event.target.closest('[data-team-plan-action]');
    if (planAction) {
      const plan = planForAction(planAction.dataset.planId);
      if (!plan) return;
      const action = planAction.dataset.teamPlanAction;
      if (action === 'edit') { showPlanDialog('edit', plan); return; }
      if (action === 'versions') { showPlanDialog('versions', plan); return; }
      if (action === 'delete') { showPlanDialog('delete', plan); return; }
      const teamId = homeState.team.id;
      const previous = structuredClone(teamPlans[teamId]);
      if (action === 'toggle') {
        if (plan.enabledVersion != null) { plan.lastEnabledVersion = plan.enabledVersion; plan.enabledVersion = null; plan.paused = true; }
        else { plan.enabledVersion = plan.versions.some(version => version.number === plan.lastEnabledVersion) ? plan.lastEnabledVersion : plan.versions[0]?.number || 1; plan.paused = false; }
      } else if (action === 'copy') {
        const data = displayPlan(plan);
        const id = `team-plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        teamPlans[teamId].unshift({ id, name: `${data.name}（副本）`, profile: data.profile, tasks: data.tasks, enabledVersion: null, paused: false, versions: [{ number: 1, name: `${data.name}（副本）`, profile: data.profile, tasks: data.tasks }] });
      }
      if (!saveTeamPlans()) teamPlans[teamId] = previous;
      openPlanMenu = null; renderPlanContent();
      return;
    }
    if (openPlanMenu && !event.target.closest('.team-home-plan-menu')) { openPlanMenu = null; renderPlanContent(); }
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
    if (event.target.closest('[data-team-create]')) { openTeamCreate(); return; }
    if (event.target.closest('[data-team-create-close]')) { closeTeamCreate(); return; }
    if (event.target.closest('[data-team-create-save]')) { saveTeamCreate(); return; }
    if (event.target.closest('[data-team-add-member]')) window.showToast?.('可在团队创建后进入团队主页添加成员');
    if (event.target.closest('[data-team-rule-optimize]')) {
      const rule = document.getElementById('teamCreateRule');
      if (rule && !rule.value.trim()) {
        rule.value = '面向符合当前机构及关联科室管理范围、已完成知情同意且需要持续健康管理的患者。';
        rule.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });

  window.renderTeamList = renderTeamList;
  window.teamManagementRows = teamRows;
  renderTeamList();
})();
