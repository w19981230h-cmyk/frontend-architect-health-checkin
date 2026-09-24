/* Plan list and version history for the static preview. */
(() => {
  const view = document.getElementById('planManagementView');
  const oldGrid = view?.querySelector('.plan-grid');
  if (!oldGrid) return;

  const storageKey = 'frontend-architect:plans:v1';
  const profiles = [
    '泌尿系结石术后患者', '糖尿病合并高血压患者', '高血糖人群', '脂肪肝患者',
    '0—6岁儿童', '孕产妇及高危妊娠人群', '辅助生殖治疗患者', '超重与肥胖人群',
    '产后女性', '脊柱侧弯患者'
  ];
  // Plausible, deterministic audit details for the built-in demonstration plans.
  const demoAudit = [
    { creator: '张明远', createdAt: '2026-03-12T09:18:00+08:00' },
    { creator: '陈慧敏', createdAt: '2026-04-08T14:32:00+08:00' },
    { creator: '陈慧敏', createdAt: '2026-05-16T10:05:00+08:00' },
    { creator: '刘佳宁', createdAt: '2026-04-21T11:24:00+08:00' },
    { creator: '李静', createdAt: '2026-05-09T09:47:00+08:00' },
    { creator: '王晓雯', createdAt: '2026-06-03T15:16:00+08:00' },
    { creator: '王晓雯', createdAt: '2026-06-19T13:08:00+08:00' },
    { creator: '许静怡', createdAt: '2026-07-07T10:36:00+08:00' },
    { creator: '李静', createdAt: '2026-07-22T16:12:00+08:00' },
    { creator: '张明远', createdAt: '2026-08-11T09:53:00+08:00' }
  ];
  const inferProfile = name => {
    if (/糖尿病.*高血压/.test(name)) return '糖尿病合并高血压患者';
    if (/结石/.test(name)) return '泌尿系结石术后患者';
    if (/高血糖/.test(name)) return '高血糖人群';
    if (/脂肪肝/.test(name)) return '脂肪肝患者';
    if (/儿童/.test(name)) return '0—6岁儿童';
    if (/孕产/.test(name)) return '孕产妇及高危妊娠人群';
    if (/辅助生殖/.test(name)) return '辅助生殖治疗患者';
    if (/体重/.test(name)) return '超重与肥胖人群';
    if (/产后/.test(name)) return '产后女性';
    if (/脊柱侧弯/.test(name)) return '脊柱侧弯患者';
    return '';
  };
  const seed = [...oldGrid.querySelectorAll('.plan-card')].map((card, index) => ({
    id: `seed-${index + 1}`,
    name: card.querySelector('.plan-name')?.textContent.trim() || '未命名方案',
    description: card.querySelector('.plan-desc')?.textContent.trim() || '',
    profile: profiles[index] || '',
    team: card.querySelector('.plan-team')?.textContent.trim() || '',
    tasks: Number(card.querySelector('.plan-task')?.textContent.match(/\d+/)?.[0]) || 0,
    published: true,
    enabled: true,
    activationModel: 2,
    enabledVersion: 1,
    details: {},
    versions: []
  }));
  const infoFields = () => [...document.querySelectorAll('#planCanvasPage [data-plan-tab-panel="info"] input, #planCanvasPage [data-plan-tab-panel="info"] textarea, #planCanvasPage [data-plan-tab-panel="info"] select')];
  const defaultInfo = infoFields().map(field => field.value);
  const durationFieldIds = ['planManagementPeriod', 'planTaskExtensionPeriod'];
  const limitDuration = value => String(value ?? '').replace(/\D/g, '').slice(0, 3);
  durationFieldIds.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
      const limited = limitDuration(input.value);
      if (input.value !== limited) input.value = limited;
    });
  });
  const defaultCheckin = document.querySelector('#planCanvasPage .plan-checkin-list')?.innerHTML || '';
  const defaultFlow = [...document.querySelectorAll('#planCanvasPage .plan-flow input')].map(field => field.value);
  const strategyReports = [
    { key: 'daily', name: '日报', schedule: '次日生成', icon: '日', tone: 'teal', template: '体重日报' },
    { key: 'weekly', name: '周报', schedule: '次周一生成', icon: '周', tone: 'blue', template: '体重周报' },
    { key: 'monthly', name: '月报', schedule: '次月 1 号生成', icon: '月', tone: 'indigo', template: '体重月报' }
  ];
  const strategyDefaults = () => ({
    enabled: true,
    warningEnabled: false,
    reports: Object.fromEntries(strategyReports.map(report => [report.key, {
      enabled: true, template: report.template, review: true, doctor: '欧舒朗', pushTime: 'after-review'
    }]))
  });
  const strategyPanel = document.createElement('div');
  strategyPanel.className = 'plan-config-panel-body plan-strategy-panel';
  strategyPanel.dataset.planTabPanel = 'strategy';
  strategyPanel.setAttribute('data-persistence-ignore', '');
  strategyPanel.innerHTML = `<div class="plan-strategy-shell">
    <div class="plan-strategy-heading"><strong>阶段总结</strong><label class="plan-strategy-switch"><input type="checkbox" role="switch" data-strategy-master aria-label="启用阶段总结" checked><span aria-hidden="true"></span></label></div>
    <div class="plan-strategy-warning"><strong>预警规则</strong><label class="plan-strategy-switch"><input type="checkbox" role="switch" data-strategy-warning aria-label="启用预警规则"><span aria-hidden="true"></span></label></div>
    <div class="plan-strategy-reports">${strategyReports.map(report => `<article class="plan-strategy-card" data-strategy-report="${report.key}">
      <div class="plan-strategy-card-head"><span class="plan-strategy-icon ${report.tone}" aria-hidden="true">${report.icon}</span><div class="plan-strategy-card-title"><strong>${report.name}</strong><small>${report.schedule}</small></div><label class="plan-strategy-switch"><input type="checkbox" role="switch" data-strategy-enabled aria-label="启用${report.name}" checked><span aria-hidden="true"></span></label></div>
      <div class="plan-strategy-field"><label for="planStrategyTemplate-${report.key}">报告模板：</label><div class="plan-strategy-template"><span class="plan-strategy-word" aria-hidden="true">W</span><select id="planStrategyTemplate-${report.key}" data-strategy-template aria-label="${report.name}报告模板"><option value="">请选择报告模板</option><option value="体重${report.name}" selected>体重${report.name}</option><option value="健康${report.name}">健康${report.name}</option><option value="随访${report.name}">随访${report.name}</option></select><button type="button" data-strategy-clear-template aria-label="移除${report.name}报告模板">×</button></div></div>
      <div class="plan-strategy-review"><span>医生审核：</span><label class="plan-strategy-switch"><input type="checkbox" role="switch" data-strategy-review aria-label="${report.name}医生审核" checked><span aria-hidden="true"></span></label></div>
      <div class="plan-strategy-field"><label for="planStrategyDoctor-${report.key}">审核医生：</label><select id="planStrategyDoctor-${report.key}" class="plan-strategy-select" data-strategy-doctor><option>欧舒朗</option><option>张明远</option><option>陈慧敏</option><option>刘佳宁</option></select></div>
      <div class="plan-strategy-field"><label for="planStrategyPush-${report.key}">推送时间：</label><select id="planStrategyPush-${report.key}" class="plan-strategy-select plan-strategy-push" data-strategy-push><option value="after-review">医生审核后自动下发</option><option value="immediate">生成后立即下发</option><option value="next-day">次日 08:00 下发</option></select></div>
    </article>`).join('')}</div></div>`;
  document.querySelector('#planCanvasPage [data-plan-tab-panel="info"]').after(strategyPanel);
  const syncStrategy = () => {
    const active = strategyPanel.querySelector('[data-strategy-master]').checked;
    strategyPanel.querySelector('.plan-strategy-reports').hidden = !active;
    strategyPanel.querySelectorAll('[data-strategy-report]').forEach(card => {
      const enabled = card.querySelector('[data-strategy-enabled]').checked;
      const review = card.querySelector('[data-strategy-review]').checked;
      const template = card.querySelector('[data-strategy-template]');
      const working = active && enabled;
      card.classList.toggle('is-inactive', !working);
      card.querySelector('[data-strategy-enabled]').disabled = !active;
      card.querySelector('[data-strategy-review]').disabled = !working;
      template.disabled = !working;
      card.querySelector('[data-strategy-clear-template]').disabled = !working || !template.value;
      card.querySelector('[data-strategy-doctor]').disabled = !working || !review;
      const push = card.querySelector('[data-strategy-push]');
      push.disabled = !working || review;
      if (review) push.value = 'after-review';
    });
  };
  const fillStrategy = saved => {
    const value = saved || strategyDefaults();
    strategyPanel.querySelector('[data-strategy-master]').checked = value.enabled !== false;
    strategyPanel.querySelector('[data-strategy-warning]').checked = value.warningEnabled === true;
    strategyReports.forEach(report => {
      const card = strategyPanel.querySelector(`[data-strategy-report="${report.key}"]`);
      const reportValue = value.reports?.[report.key] || strategyDefaults().reports[report.key];
      card.querySelector('[data-strategy-enabled]').checked = reportValue.enabled !== false;
      card.querySelector('[data-strategy-template]').value = reportValue.template ?? report.template;
      card.querySelector('[data-strategy-review]').checked = reportValue.review !== false;
      card.querySelector('[data-strategy-doctor]').value = reportValue.doctor || '欧舒朗';
      card.querySelector('[data-strategy-push]').value = reportValue.pushTime || 'after-review';
    });
    syncStrategy();
  };
  const readStrategy = () => ({
    enabled: strategyPanel.querySelector('[data-strategy-master]').checked,
    warningEnabled: strategyPanel.querySelector('[data-strategy-warning]').checked,
    reports: Object.fromEntries(strategyReports.map(report => {
      const card = strategyPanel.querySelector(`[data-strategy-report="${report.key}"]`);
      return [report.key, {
        enabled: card.querySelector('[data-strategy-enabled]').checked,
        template: card.querySelector('[data-strategy-template]').value,
        review: card.querySelector('[data-strategy-review]').checked,
        doctor: card.querySelector('[data-strategy-doctor]').value,
        pushTime: card.querySelector('[data-strategy-push]').value
      }];
    }))
  });
  strategyPanel.addEventListener('change', syncStrategy);
  strategyPanel.addEventListener('click', event => {
    const clear = event.target.closest('[data-strategy-clear-template]');
    if (!clear) return;
    clear.closest('[data-strategy-report]').querySelector('[data-strategy-template]').value = '';
    syncStrategy();
  });
  fillStrategy();
  const read = () => {
    try { const value = JSON.parse(localStorage.getItem(storageKey) || 'null'); return Array.isArray(value) ? value : null; }
    catch { return null; }
  };
  let plans = read() || seed;
  let activeId = null;
  let versionPlanId = null;
  let page = 1;
  let pageSize = 10;
  const expanded = new Set();
  const currentCreator = document.querySelector('.sidebar-bottom .user-card strong')?.textContent.trim() || '平台技术人员';
  const query = { name: '', team: '', status: '' };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const toast = message => window.showToast ? window.showToast(message, 'top') : alert(message);
  const persist = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(plans)); return true; }
    catch { toast('保存失败，请检查浏览器存储空间'); return false; }
  };
  const find = id => plans.find(plan => plan.id === id);
  const latest = plan => plan.versions?.[0]?.number || 1;
  const versionLabel = value => {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < 1) return '—';
    const digits = '零一二三四五六七八九';
    if (number < 10) return `第${digits[number]}版`;
    if (number < 100) return `第${number < 20 ? '' : digits[Math.floor(number / 10)]}十${number % 10 ? digits[number % 10] : ''}版`;
    return `第${number}版`;
  };
  const activeVersion = plan => plan.versions?.find(version => version.number === plan.enabledVersion) || plan.versions?.[0];
  const displayData = plan => activeVersion(plan)?.data || plan;
  const status = plan => activeVersion(plan)?.published ? '已发布' : '待发布';
  const formatTime = value => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '—';
  const snapshot = plan => ({
    name: plan.name, description: plan.description, profile: plan.profile,
    team: plan.team, tasks: plan.tasks, details: structuredClone(plan.details || {})
  });
  const addVersion = (plan, note) => {
    plan.versions ||= [];
    const number = Math.max(plan.nextVersionNumber || 1, ...plan.versions.map(version => version.number + 1));
    plan.nextVersionNumber = number + 1;
    plan.versions.unshift({ number, at: new Date().toISOString(), creator: currentCreator, published: false, note, data: snapshot(plan) });
  };
  const demoVersionCounts = [3, 4, 3, 2, 2, 3, 2, 2, 3, 2];
  const demoVersionNotes = ['初始版本', '优化随访任务与执行周期', '补充健康宣教和阶段总结', '调整患者画像与预警规则'];
  const demoVersionCreators = ['平台技术人员', '陈慧敏', '刘佳宁', '张明远'];
  plans.forEach(plan => {
    const seedMatch = /^seed-(\d+)$/.exec(plan.id || '');
    const sample = seedMatch ? demoAudit[Number(seedMatch[1]) - 1] : null;
    plan.profile ||= profiles[Number(plan.id?.replace('seed-', '')) - 1] || plan.details?.values?.[4] || inferProfile(plan.name);
    if (!plan.versions?.length) addVersion(plan, '初始版本');
    if (seedMatch && plan.versions.length === 1 && !plan.demoVersionsSeeded) {
      const seedIndex = Number(seedMatch[1]) - 1;
      const count = demoVersionCounts[seedIndex] || 2;
      const baseData = structuredClone(plan.versions[0].data || snapshot(plan));
      const baseTime = new Date(sample?.createdAt || plan.createdAt || '2026-03-01T09:00:00+08:00').getTime();
      const latestIsPending = [1, 4, 7].includes(seedIndex);
      plan.versions = Array.from({ length: count }, (_, offset) => {
        const number = offset + 1;
        const data = structuredClone(baseData);
        data.tasks = Math.max(1, (Number(baseData.tasks) || Number(plan.tasks) || 1) + offset);
        return {
          number,
          at: new Date(baseTime + offset * 14 * 24 * 60 * 60 * 1000).toISOString(),
          creator: offset === 0 && sample ? sample.creator : demoVersionCreators[(seedIndex + offset) % demoVersionCreators.length],
          published: !(latestIsPending && number === count),
          note: demoVersionNotes[Math.min(offset, demoVersionNotes.length - 1)],
          data
        };
      }).reverse();
      const enabledNumber = latestIsPending ? Math.max(1, count - 1) : count;
      plan.enabledVersion = enabledNumber;
      plan.lastEnabledVersion = enabledNumber;
      plan.enabled = ![1, 4, 7].includes(seedIndex);
      plan.published = true;
      plan.nextVersionNumber = count + 1;
      plan.demoVersionsSeeded = true;
    }
    plan.versions.forEach(version => {
      if (version.data) version.data.profile ||= inferProfile(version.data.name || '') || plan.profile;
      if (sample && version.note === '初始版本') {
        version.at = sample.createdAt;
        version.creator = sample.creator;
      } else if (!version.creator && version.at) {
        version.creator = currentCreator;
      }
    });
    if (plan.activationModel !== 2) {
      plan.enabled = plan.enabledVersion != null;
      plan.activationModel = 2;
    }
    if (plan.enabledVersion == null) plan.enabledVersion = plan.versions.some(version => version.number === plan.lastEnabledVersion) ? plan.lastEnabledVersion : latest(plan);
    if (plan.published === undefined) plan.published = plan.enabled;
    if (plan.lastEnabledVersion == null && plan.enabledVersion != null) plan.lastEnabledVersion = plan.enabledVersion;
    if (sample) {
      plan.creator ||= sample.creator;
      plan.createdAt ||= sample.createdAt;
    } else if (!plan.creator) {
      plan.creator = currentCreator;
    }
    const enabled = plan.versions.find(version => version.number === plan.enabledVersion);
    if (enabled && !enabled.published) plan.enabled = false;
    if (!plan.id?.startsWith('seed-') && !plan.createdAt) plan.createdAt = [...plan.versions].at(-1)?.at || null;
  });
  persist();

  // Reuse the project's existing search, select and pager hierarchy with a standard table surface.
  const topbar = view.querySelector('.plan-topbar');
  topbar.setAttribute('data-persistence-ignore', '');
  const nameInput = topbar.querySelector('.plan-search input');
  nameInput.value = '';
  nameInput.name = 'planNameQuery';
  nameInput.autocomplete = 'off';
  nameInput.setAttribute('aria-label', '方案名称');
  const teamSelect = topbar.querySelector('.plan-team-select');
  teamSelect.innerHTML = '<option value="">全部团队</option>';
  const statusSelect = document.createElement('select');
  statusSelect.className = 'plan-status-select';
  statusSelect.setAttribute('aria-label', '状态');
  statusSelect.innerHTML = '<option value="">请选择状态</option><option value="已发布">已发布</option><option value="待发布">待发布</option>';
  const queryButton = document.createElement('button');
  queryButton.type = 'button'; queryButton.className = 'plan-query-button'; queryButton.textContent = '查询';
  const resetButton = document.createElement('button');
  resetButton.type = 'button'; resetButton.className = 'plan-reset-button'; resetButton.textContent = '重置';
  topbar.insertBefore(statusSelect, topbar.querySelector('[data-new-plan]'));
  topbar.insertBefore(queryButton, topbar.querySelector('[data-new-plan]'));
  topbar.insertBefore(resetButton, topbar.querySelector('[data-new-plan]'));
  const columnStorageKey = 'frontend-architect:plan-columns:v1';
  const columnDefinitions = [
    { key: 'name', label: '方案名称', fixed: true, width: 230 },
    { key: 'description', label: '方案描述', width: 280 },
    { key: 'profile', label: '适用画像', width: 170 },
    { key: 'team', label: '适用团队', width: 180 },
    { key: 'version', label: '版本号', width: 90 },
    { key: 'versionCount', label: '版本数量', width: 90 },
    { key: 'tasks', label: '任务数量', width: 90 },
    { key: 'status', label: '状态', width: 100 },
    { key: 'enabled', label: '启用版本', width: 100 },
    { key: 'creator', label: '创建人员', width: 110 },
    { key: 'createdAt', label: '创建时间', width: 170 },
    { key: 'actions', label: '操作', fixed: true, width: 190 }
  ];
  const optionalColumns = columnDefinitions.filter(column => !column.fixed);
  const readVisibleColumns = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(columnStorageKey) || 'null');
      if (Array.isArray(saved)) return new Set(saved.filter(key => optionalColumns.some(column => column.key === key)));
    } catch (_) {}
    return new Set(optionalColumns.map(column => column.key));
  };
  let visibleColumns = readVisibleColumns();
  const columnSettings = document.createElement('div');
  columnSettings.className = 'plan-column-settings';
  columnSettings.innerHTML = `<button type="button" class="plan-column-button" data-plan-columns aria-haspopup="dialog" aria-expanded="false"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h11M5 2v3M10.5 6.5v3M7 11v3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg><span>自定义列</span></button>
    <section class="plan-column-panel" role="dialog" aria-label="自定义列表字段" hidden>
      <header><strong>自定义列</strong><span>已选 <b data-plan-column-count></b> 项</span></header>
      <div class="plan-column-options">${optionalColumns.map(column => `<label><input type="checkbox" data-plan-column-toggle="${column.key}"><span>${column.label}</span></label>`).join('')}</div>
      <footer><span>方案名称、操作为固定列</span><button type="button" data-plan-column-reset>恢复默认</button></footer>
    </section>`;
  topbar.insertBefore(columnSettings, topbar.querySelector('[data-new-plan]'));
  const columnButton = columnSettings.querySelector('[data-plan-columns]');
  const columnPanel = columnSettings.querySelector('.plan-column-panel');
  const syncColumnPanel = () => {
    columnSettings.querySelectorAll('[data-plan-column-toggle]').forEach(input => { input.checked = visibleColumns.has(input.dataset.planColumnToggle); });
    columnSettings.querySelector('[data-plan-column-count]').textContent = String(visibleColumns.size);
  };
  const closeColumnPanel = () => { columnPanel.hidden = true; columnButton.setAttribute('aria-expanded', 'false'); };
  const makeSearchableSelect = (native, label) => {
    const control = document.createElement('div');
    control.className = 'plan-filter-combobox';
    native.before(control);
    control.append(native);
    native.classList.add('plan-filter-native');
    const input = document.createElement('input');
    input.type = 'text'; input.autocomplete = 'off'; input.setAttribute('role', 'combobox');
    input.setAttribute('aria-label', label); input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    const list = document.createElement('div');
    list.className = 'plan-filter-options'; list.id = `plan-${label === '团队' ? 'team' : 'status'}-options`;
    list.setAttribute('role', 'listbox'); list.hidden = true;
    input.setAttribute('aria-controls', list.id);
    const toggle = document.createElement('button');
    toggle.type = 'button'; toggle.className = 'plan-filter-toggle'; toggle.setAttribute('aria-label', `展开${label}选项`);
    toggle.innerHTML = '<span aria-hidden="true">⌄</span>';
    control.append(input, toggle, list);
    let matches = [];
    let active = 0;
    const options = () => [...native.options].map(option => ({ value: option.value, label: option.textContent.trim() }));
    const sync = () => {
      input.value = native.value ? (options().find(option => option.value === native.value)?.label || '') : '';
      input.placeholder = options()[0]?.label || `请选择${label}`;
    };
    const paint = search => {
      const term = search.trim().toLocaleLowerCase();
      matches = options().filter(option => !term || (option.value && option.label.toLocaleLowerCase().includes(term)));
      active = 0;
      list.innerHTML = matches.length ? matches.map((option, index) => `<div id="${list.id}-${index}" class="plan-filter-option${index === 0 ? ' active' : ''}" role="option" data-value="${esc(option.value)}" aria-selected="${option.value === native.value}">${esc(option.label)}</div>`).join('') : '<div class="plan-filter-empty">暂无匹配数据</div>';
      input.setAttribute('aria-activedescendant', matches.length ? `${list.id}-0` : '');
    };
    const open = () => { paint(input.value === (options().find(option => option.value === native.value)?.label || '') ? '' : input.value); list.hidden = false; input.setAttribute('aria-expanded', 'true'); };
    const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); };
    const select = value => { native.value = value; sync(); close(); native.dispatchEvent(new Event('change', { bubbles: true })); };
    input.addEventListener('focus', () => { open(); input.select(); });
    input.addEventListener('input', () => { native.value = ''; open(); paint(input.value); });
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') { close(); sync(); return; }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); if (!matches.length) return;
        active = (active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
        list.querySelectorAll('.plan-filter-option').forEach((item, index) => item.classList.toggle('active', index === active));
        input.setAttribute('aria-activedescendant', `${list.id}-${active}`);
        list.children[active]?.scrollIntoView({ block: 'nearest' });
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        if (!list.hidden && matches[active]) select(matches[active].value);
        else queryButton.click();
      }
    });
    toggle.addEventListener('click', () => { const wasOpen = !list.hidden; if (wasOpen) { close(); sync(); } else { input.focus(); open(); } });
    list.addEventListener('mousedown', event => event.preventDefault());
    list.addEventListener('click', event => { const option = event.target.closest('[data-value]'); if (option) select(option.dataset.value); });
    document.addEventListener('click', event => { if (!control.contains(event.target)) { close(); sync(); } });
    sync();
    return {
      refresh: () => { sync(); if (!list.hidden) open(); },
      clear: () => select(''),
      commit: () => {
        if (native.value || !input.value.trim()) { close(); sync(); return true; }
        const term = input.value.trim().toLocaleLowerCase();
        const found = options().filter(option => option.value && option.label.toLocaleLowerCase().includes(term));
        if (found.length === 1) { select(found[0].value); return true; }
        toast(found.length ? `请选择具体${label}` : `未找到匹配的${label}`);
        input.focus(); return false;
      }
    };
  };
  const teamControl = makeSearchableSelect(teamSelect, '团队');
  const statusControl = makeSearchableSelect(statusSelect, '状态');
  const content = view.querySelector('.plan-content');
  content.innerHTML = `<div class="plan-table-wrap"><table class="plan-list-table">
    <thead><tr>${columnDefinitions.map(column => `<th data-plan-column="${column.key}">${column.label}</th>`).join('')}</tr></thead>
    <tbody id="planListRows"></tbody></table></div>`;
  const rows = content.querySelector('#planListRows');
  const table = content.querySelector('.plan-list-table');
  const applyColumnVisibility = () => {
    columnDefinitions.forEach(column => {
      const shown = column.fixed || visibleColumns.has(column.key);
      content.querySelectorAll(`[data-plan-column="${column.key}"]`).forEach(cell => { cell.hidden = !shown; });
    });
    table.style.minWidth = `${columnDefinitions.filter(column => column.fixed || visibleColumns.has(column.key)).reduce((total, column) => total + column.width, 0)}px`;
    syncColumnPanel();
  };
  const pager = view.querySelector('.plan-pager');
  pager.setAttribute('data-persistence-ignore', '');

  const refreshTeams = () => {
    const selected = teamSelect.value;
    const teams = [...new Set(plans.map(plan => displayData(plan).team).filter(Boolean))];
    teamSelect.innerHTML = '<option value="">全部团队</option>' + teams.map(team => `<option value="${esc(team)}">${esc(team)}</option>`).join('');
    teamSelect.value = selected;
    teamControl.refresh();
  };
  const filtered = () => plans.filter(plan =>
    (!query.name || String(displayData(plan).name || '').toLowerCase().includes(query.name)) &&
    (!query.team || displayData(plan).team === query.team) &&
    (!query.status || status(plan) === query.status)
  );
  const textCell = (value, className = '') => `<span class="plan-cell-ellipsis ${className}" title="${esc(value || '')}">${esc(value || '—')}</span>`;
  const switchCell = (plan, version) => {
    const isChild = version != null;
    const blocked = isChild ? !version.published : status(plan) === '待发布';
    const checked = Boolean(!blocked && plan.enabled && (!isChild || plan.enabledVersion === version.number));
    const label = isChild ? `${checked ? '停用' : '启用'}${esc(plan.name)}的${versionLabel(version.number)}` : `${checked ? '停用' : '启用'}${esc(plan.name)}`;
    const blockedLabel = isChild ? `${versionLabel(version.number)}待发布，不可启用` : `${esc(plan.name)}待发布，不可启用`;
    return `<label class="checkin-eval-switch-row plan-version-switch" title="${blocked ? '待发布状态不可启用版本' : label}"><input type="checkbox" role="switch" data-plan-switch="${esc(plan.id)}" ${isChild ? `data-version-number="${version.number}"` : ''} aria-label="${blocked ? blockedLabel : label}" ${checked ? 'checked' : ''} ${blocked ? 'disabled' : ''}><span class="checkin-eval-switch" aria-hidden="true"></span></label>`;
  };
  const actionMenu = document.createElement('div');
  actionMenu.className = 'plan-actions-menu';
  actionMenu.setAttribute('role', 'menu');
  actionMenu.hidden = true;
  document.body.append(actionMenu);
  let actionMenuTrigger = null;
  const closeActionMenu = () => {
    actionMenu.hidden = true;
    actionMenu.innerHTML = '';
    if (actionMenuTrigger) actionMenuTrigger.setAttribute('aria-expanded', 'false');
    actionMenuTrigger = null;
  };
  const rowActions = (plan, version) => {
    const child = version != null;
    const versionAttribute = child ? ` data-version-number="${version.number}"` : '';
    return `<div class="plan-row-actions"><button type="button" ${child ? `data-plan-edit-version="${esc(plan.id)}"${versionAttribute}` : `data-plan-edit="${esc(plan.id)}"`}>编辑</button><button type="button" class="plan-actions-more" data-plan-more="${esc(plan.id)}"${versionAttribute} aria-haspopup="menu" aria-expanded="false">更多<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`;
  };
  const openActionMenu = trigger => {
    if (actionMenuTrigger === trigger) { closeActionMenu(); return; }
    closeActionMenu();
    const plan = find(trigger.dataset.planMore);
    if (!plan) return;
    const versionNumber = trigger.dataset.versionNumber;
    const version = versionNumber == null ? null : plan.versions.find(item => item.number === Number(versionNumber));
    const publicationVersion = version || activeVersion(plan);
    const cannotDelete = version && (plan.enabledVersion === version.number || plan.versions.length <= 1);
    const versionAttribute = version ? ` data-version-number="${version.number}"` : '';
    const publicationAttribute = publicationVersion ? ` data-version-number="${publicationVersion.number}"` : '';
    const publicationAction = publicationVersion?.published
      ? `<button type="button" role="menuitem" data-plan-unpublish="${esc(plan.id)}"${publicationAttribute}>取消发布</button>`
      : `<button type="button" role="menuitem" data-plan-publish="${esc(plan.id)}"${publicationAttribute}>发布</button>`;
    actionMenu.innerHTML = `${publicationAction}<button type="button" role="menuitem" data-plan-copy="${esc(plan.id)}"${versionAttribute}>复制新增</button><button type="button" role="menuitem" class="danger" data-plan-delete="${esc(plan.id)}"${versionAttribute} ${cannotDelete ? `disabled title="${plan.enabledVersion === version.number ? '请先停用或切换启用版本' : '最后一个版本请删除方案主体'}"` : ''}>删除</button>`;
    actionMenu.hidden = false;
    actionMenuTrigger = trigger;
    trigger.setAttribute('aria-expanded', 'true');
    const rect = trigger.getBoundingClientRect();
    actionMenu.style.left = `${Math.max(8, Math.min(rect.right - actionMenu.offsetWidth, window.innerWidth - actionMenu.offsetWidth - 8))}px`;
    actionMenu.style.top = `${Math.max(8, Math.min(rect.bottom + 4, window.innerHeight - actionMenu.offsetHeight - 8))}px`;
  };
  const renderVersion = (plan, version) => {
    const data = version.data || plan;
    return `<tr class="plan-version-child" data-plan-id="${esc(plan.id)}" data-version="${version.number}">
      <td data-plan-column="name"><span class="plan-child-indent" aria-hidden="true"></span><span class="plan-cell-name" title="${esc(data.name)}">${esc(data.name || '未命名方案')}</span></td>
      <td data-plan-column="description">${textCell(data.description)}</td><td data-plan-column="profile">${textCell(data.profile, 'plan-profile-value')}</td><td data-plan-column="team">${textCell(data.team)}</td>
      <td data-plan-column="version">${versionLabel(version.number)}</td><td data-plan-column="versionCount">—</td><td data-plan-column="tasks">${Number(data.tasks) || 0}</td>
      <td data-plan-column="status"><span class="plan-list-status ${version.published ? 'published' : 'pending'}">${version.published ? '已发布' : '待发布'}</span></td>
      <td data-plan-column="enabled">${switchCell(plan, version)}</td>
      <td data-plan-column="creator">${esc(version.creator || '—')}</td><td data-plan-column="createdAt">${esc(formatTime(version.at))}</td>
      <td data-plan-column="actions">${rowActions(plan, version)}</td>
    </tr>`;
  };
  const renderPlan = plan => {
    const data = displayData(plan);
    const shownVersion = activeVersion(plan)?.number || latest(plan);
    const isExpanded = expanded.has(plan.id);
    return `<tr class="plan-parent-row" data-plan-id="${esc(plan.id)}">
      <td data-plan-column="name"><div class="plan-name-with-expand"><button type="button" class="plan-expand-button" data-plan-expand="${esc(plan.id)}" aria-expanded="${isExpanded}" aria-label="${isExpanded ? '收起' : '展开'}${esc(plan.name)}的版本"><svg class="plan-expand-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span class="plan-cell-name" title="${esc(data.name)}">${esc(data.name || '未命名方案')}</span></div></td>
      <td data-plan-column="description">${textCell(data.description)}</td><td data-plan-column="profile">${textCell(data.profile, 'plan-profile-value')}</td><td data-plan-column="team">${textCell(data.team)}</td>
      <td data-plan-column="version">${versionLabel(shownVersion)}</td>
      <td data-plan-column="versionCount"><button type="button" class="plan-table-link" data-plan-versions="${esc(plan.id)}" aria-label="管理${esc(plan.name)}的${plan.versions?.length || 0}个版本">${plan.versions?.length || 0}</button></td>
      <td data-plan-column="tasks">${Number(data.tasks) || 0}</td>
      <td data-plan-column="status"><span class="plan-list-status ${status(plan) === '已发布' ? 'published' : 'pending'}">${status(plan)}</span></td>
      <td data-plan-column="enabled">${switchCell(plan)}</td>
      <td data-plan-column="creator">${esc(plan.creator || '—')}</td><td data-plan-column="createdAt">${esc(formatTime(plan.createdAt))}</td>
      <td data-plan-column="actions">${rowActions(plan)}</td>
    </tr>${isExpanded ? (plan.versions || []).map(version => renderVersion(plan, version)).join('') : ''}`;
  };
  const render = () => {
    closeActionMenu();
    refreshTeams();
    const matches = filtered();
    const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, totalPages);
    const visible = matches.slice((page - 1) * pageSize, page * pageSize);
    rows.innerHTML = visible.length ? visible.map(renderPlan).join('') : `<tr><td class="plan-list-empty" colspan="${columnDefinitions.filter(column => column.fixed || visibleColumns.has(column.key)).length}">暂无符合条件的方案</td></tr>`;
    applyColumnVisibility();
    pager.innerHTML = `<span>共 ${matches.length} 条</span>
      <button type="button" class="page-btn" data-plan-page="prev" ${page === 1 ? 'disabled' : ''} aria-label="上一页">‹</button>
      ${Array.from({ length: totalPages }, (_, index) => `<button type="button" class="page-btn ${page === index + 1 ? 'active' : ''}" data-plan-page="${index + 1}" ${page === index + 1 ? 'aria-current="page"' : ''}>${index + 1}</button>`).join('')}
      <button type="button" class="page-btn" data-plan-page="next" ${page === totalPages ? 'disabled' : ''} aria-label="下一页">›</button>
      <select class="plan-page-size" aria-label="每页条数"><option value="10" ${pageSize === 10 ? 'selected' : ''}>10 条/页</option><option value="20" ${pageSize === 20 ? 'selected' : ''}>20 条/页</option><option value="50" ${pageSize === 50 ? 'selected' : ''}>50 条/页</option></select>`;
  };

  const modal = document.createElement('div');
  modal.className = 'plan-version-mask'; modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `<section class="plan-version-dialog" role="dialog" aria-modal="true" aria-labelledby="planVersionTitle">
    <header><h2 id="planVersionTitle">版本管理</h2><button type="button" data-close-plan-versions aria-label="关闭">×</button></header>
    <p class="plan-version-subtitle"></p><div class="plan-version-list"></div>
    <footer><button type="button" data-close-plan-versions>关闭</button></footer></section>`;
  document.body.append(modal);
  const closeVersions = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); versionPlanId = null; };
  const showVersions = id => {
    const plan = find(id);
    if (!plan) return;
    versionPlanId = id;
    modal.querySelector('.plan-version-subtitle').textContent = plan.name;
    modal.querySelector('.plan-version-list').innerHTML = plan.versions.map((version, index) => `<article class="plan-version-row">
      <div><strong>${versionLabel(version.number)}${plan.enabledVersion === version.number ? (plan.enabled ? ' · 启用中' : ' · 当前版本') : ''}${index === 0 ? ' · 最新' : ''}</strong>
      <span>${esc(formatTime(version.at))} · ${esc(String(version.note || '').replace(/V(\d+)/g, (_, number) => versionLabel(number)))}</span></div>
      <div class="plan-version-actions"><button type="button" data-enable-plan-version="${version.number}" ${plan.enabledVersion === version.number && plan.enabled ? 'disabled title="当前启用版本"' : !version.published ? 'disabled title="待发布版本不可启用"' : ''}>启用此版本</button>
      <button type="button" data-restore-plan-version="${version.number}" ${index === 0 ? 'disabled' : ''}>恢复此版本</button></div></article>`).join('');
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('[data-close-plan-versions]').focus();
  };
  const deleteMask = document.createElement('div');
  deleteMask.className = 'plan-version-mask plan-delete-mask';
  deleteMask.setAttribute('aria-hidden', 'true');
  deleteMask.innerHTML = `<section class="plan-version-dialog" role="alertdialog" aria-modal="true" aria-labelledby="planDeleteTitle"><header><h2 id="planDeleteTitle">删除方案</h2><button type="button" data-close-plan-delete aria-label="关闭">×</button></header><p class="plan-delete-message"></p><footer><button type="button" data-close-plan-delete>取消</button><button type="button" class="plan-delete-confirm" data-confirm-plan-delete>删除</button></footer></section>`;
  document.body.append(deleteMask);
  const publishMask = document.createElement('div');
  publishMask.className = 'plan-version-mask plan-publish-mask';
  publishMask.setAttribute('aria-hidden', 'true');
  publishMask.innerHTML = `<section class="plan-version-dialog" role="alertdialog" aria-modal="true" aria-labelledby="planPublishTitle"><header><h2 id="planPublishTitle">发布成功</h2><button type="button" data-close-plan-publish aria-label="关闭">×</button></header><p class="plan-delete-message">当前版本已发布，是否立即启用该方案？</p><p class="plan-publish-tip">启用后，团队可按当前版本执行方案；暂不启用不会影响已经启用的其他版本。</p><footer><button type="button" data-close-plan-publish>暂不启用</button><button type="button" class="plan-publish-confirm" data-confirm-plan-publish>立即启用</button></footer></section>`;
  document.body.append(publishMask);
  let publishTarget = null;
  const closePublish = () => { publishMask.classList.remove('open'); publishMask.setAttribute('aria-hidden', 'true'); publishTarget = null; };
  const showPublishConfirm = (plan, version) => {
    publishTarget = { planId: plan.id, versionNumber: version.number };
    publishMask.classList.add('open');
    publishMask.setAttribute('aria-hidden', 'false');
    publishMask.querySelector('[data-confirm-plan-publish]')?.focus();
  };
  let deleteTarget = null;
  const closeDelete = () => { deleteMask.classList.remove('open'); deleteMask.setAttribute('aria-hidden', 'true'); deleteTarget = null; };
  const showDelete = (plan, version) => {
    if (!plan) return;
    if (version && (plan.enabledVersion === version.number || plan.versions.length <= 1)) return;
    deleteTarget = { planId: plan.id, versionNumber: version?.number ?? null };
    deleteMask.querySelector('#planDeleteTitle').textContent = version ? '删除方案版本' : '删除方案';
    deleteMask.querySelector('.plan-delete-message').textContent = version
      ? `确定删除“${plan.name}”的${versionLabel(version.number)}吗？删除后无法恢复。`
      : `确定删除“${plan.name}”及其全部版本吗？删除后无法恢复。`;
    deleteMask.classList.add('open'); deleteMask.setAttribute('aria-hidden', 'false');
    deleteMask.querySelector('[data-close-plan-delete]').focus();
  };
  const confirmDelete = () => {
    const plan = find(deleteTarget?.planId);
    if (!plan) { closeDelete(); return; }
    const before = structuredClone(plans);
    if (deleteTarget.versionNumber == null) {
      plans = plans.filter(item => item.id !== plan.id);
      expanded.delete(plan.id);
      if (activeId === plan.id) activeId = null;
    } else {
      const number = deleteTarget.versionNumber;
      if (plan.enabledVersion === number || plan.versions.length <= 1) { closeDelete(); return; }
      plan.nextVersionNumber = Math.max(plan.nextVersionNumber || 1, ...plan.versions.map(version => version.number + 1));
      plan.versions = plan.versions.filter(version => version.number !== number);
      if (plan.lastEnabledVersion === number) plan.lastEnabledVersion = plan.enabledVersion ?? plan.versions[0]?.number ?? null;
    }
    if (!persist()) { plans = before; render(); return; }
    closeDelete(); render(); toast('已删除');
  };
  const fillEditor = (plan, source = displayData(plan)) => {
    const fields = infoFields();
    fields[0].value = source.name;
    fields[2].value = source.description;
    fields.forEach((field, index) => { if (index !== 0 && index !== 2) field.value = source.details?.values?.[index] ?? defaultInfo[index] ?? ''; });
    durationFieldIds.forEach(id => { const input = document.getElementById(id); input.value = limitDuration(input.value); });
    if (!source.details?.values?.length) {
      if (fields[3] && source.team) {
        const team = source.team.replace(/^团队/, '');
        if (![...fields[3].options].some(option => option.value === team)) fields[3].add(new Option(team, team));
        fields[3].value = team;
      }
      if (fields[4]) fields[4].value = source.profile;
    }
    const checkin = document.querySelector('#planCanvasPage .plan-checkin-list');
    if (checkin) { checkin.innerHTML = source.details?.checkinHtml ?? defaultCheckin; checkin.dataset.hasCheckin = source.details?.hasCheckin ?? 'true'; }
    document.querySelectorAll('#planCanvasPage .plan-flow input').forEach((field, index) => { field.value = source.details?.flowValues?.[index] ?? defaultFlow[index] ?? ''; });
    fillStrategy(source.details?.strategy);
    document.getElementById('generatedPlanTitle').textContent = source.name;
  };
  const openEditor = (plan, source) => {
    if (!plan) return;
    activeId = plan.id;
    fillEditor(plan, source);
    document.querySelectorAll('.page.active').forEach(element => element.classList.remove('active'));
    document.getElementById('planCanvasPage').classList.add('active');
  };

  render();
  columnButton.addEventListener('click', event => {
    event.stopPropagation();
    const opening = columnPanel.hidden;
    columnPanel.hidden = !opening;
    columnButton.setAttribute('aria-expanded', String(opening));
    if (opening) syncColumnPanel();
  });
  columnPanel.addEventListener('click', event => {
    event.stopPropagation();
    const reset = event.target.closest('[data-plan-column-reset]');
    if (reset) {
      visibleColumns = new Set(optionalColumns.map(column => column.key));
      localStorage.removeItem(columnStorageKey);
      applyColumnVisibility();
      return;
    }
    const input = event.target.closest('[data-plan-column-toggle]');
    if (!input) return;
    input.checked ? visibleColumns.add(input.dataset.planColumnToggle) : visibleColumns.delete(input.dataset.planColumnToggle);
    localStorage.setItem(columnStorageKey, JSON.stringify([...visibleColumns]));
    applyColumnVisibility();
  });
  document.addEventListener('click', event => { if (!columnSettings.contains(event.target)) closeColumnPanel(); });
  queryButton.addEventListener('click', event => {
    if (!teamControl.commit() || !statusControl.commit()) { event.stopPropagation(); return; }
    query.name = nameInput.value.trim().toLowerCase();
    query.team = teamSelect.value;
    query.status = statusSelect.value;
    page = 1; render();
  });
  resetButton.addEventListener('click', () => {
    nameInput.value = ''; teamControl.clear(); statusControl.clear();
    query.name = ''; query.team = ''; query.status = '';
    page = 1; render();
  });
  nameInput.addEventListener('keydown', event => { if (event.key === 'Enter') queryButton.click(); });
  pager.addEventListener('click', event => {
    const button = event.target.closest('[data-plan-page]');
    if (!button) return;
    page = button.dataset.planPage === 'prev' ? page - 1 : button.dataset.planPage === 'next' ? page + 1 : Number(button.dataset.planPage);
    render();
  });
  pager.addEventListener('change', event => {
    if (event.target.matches('.plan-page-size')) {
      const nextSize = Number(event.target.value);
      if (![10, 20, 50].includes(nextSize)) return;
      pageSize = nextSize; page = 1; render();
    }
  });
  window.addEventListener('load', () => {
    // Other page modules restore unrelated form values during startup.
    nameInput.value = ''; teamControl.clear(); statusControl.clear();
    pageSize = 10; page = 1; render();
  }, { once: true });

  document.addEventListener('change', event => {
    const control = event.target.closest('[data-plan-switch]');
    if (!control) return;
    const plan = find(control.dataset.planSwitch);
    if (!plan) return;
    const previousVersion = plan.enabledVersion;
    const previousEnabled = plan.enabled;
    const previousLast = plan.lastEnabledVersion;
    const requestedVersion = control.dataset.versionNumber == null
      ? (plan.versions.some(version => version.number === plan.lastEnabledVersion) ? plan.lastEnabledVersion : latest(plan))
      : Number(control.dataset.versionNumber);
    if (control.checked && !plan.versions.some(version => version.number === requestedVersion)) { render(); return; }
    const requestedRecord = plan.versions.find(version => version.number === requestedVersion);
    if (control.checked && !requestedRecord?.published) {
      render(); toast('待发布版本不可启用'); return;
    }
    plan.enabled = control.checked;
    if (plan.enabled) {
      plan.enabledVersion = requestedVersion;
      plan.lastEnabledVersion = requestedVersion;
    }
    if (!persist()) {
      plan.enabled = previousEnabled; plan.enabledVersion = previousVersion; plan.lastEnabledVersion = previousLast;
      render(); return;
    }
    render();
    toast(plan.enabled ? `已启用${versionLabel(plan.enabledVersion)}` : '方案已停用');
  }, true);

  document.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('[data-close-plan-delete]') || target === deleteMask) { closeDelete(); return; }
    if (target.closest('[data-confirm-plan-delete]')) { confirmDelete(); return; }
    const more = target.closest('[data-plan-more]');
    if (more) { event.preventDefault(); event.stopImmediatePropagation(); openActionMenu(more); return; }
    const publicationAction = target.closest('[data-plan-publish], [data-plan-unpublish]');
    if (publicationAction) {
      event.preventDefault(); event.stopImmediatePropagation();
      const plan = find(publicationAction.dataset.planPublish || publicationAction.dataset.planUnpublish);
      const version = plan?.versions.find(item => item.number === Number(publicationAction.dataset.versionNumber));
      if (!plan || !version) { closeActionMenu(); return; }
      const publishing = publicationAction.hasAttribute('data-plan-publish');
      const previous = { published: version.published, planPublished: plan.published, enabled: plan.enabled };
      version.published = publishing;
      plan.published = plan.versions.some(item => item.published);
      if (!publishing && plan.enabledVersion === version.number) plan.enabled = false;
      closeActionMenu();
      if (!persist()) {
        version.published = previous.published; plan.published = previous.planPublished; plan.enabled = previous.enabled;
        render(); return;
      }
      render();
      if (publishing) showPublishConfirm(plan, version);
      else toast(`${versionLabel(version.number)}已取消发布${previous.enabled && plan.enabledVersion === version.number ? '，方案已同步停用' : ''}`);
      return;
    }
    const deleteAction = target.closest('[data-plan-delete]');
    if (deleteAction) {
      event.preventDefault(); event.stopImmediatePropagation();
      const plan = find(deleteAction.dataset.planDelete);
      const version = deleteAction.dataset.versionNumber == null ? null : plan?.versions.find(item => item.number === Number(deleteAction.dataset.versionNumber));
      closeActionMenu();
      if (deleteAction.dataset.versionNumber != null && !version) return;
      showDelete(plan, version); return;
    }
    if (actionMenuTrigger && !target.closest('.plan-actions-menu')) closeActionMenu();
    const expand = target.closest('[data-plan-expand]');
    if (expand) { const id = expand.dataset.planExpand; expanded.has(id) ? expanded.delete(id) : expanded.add(id); render(); return; }
    const editVersion = target.closest('[data-plan-edit-version]');
    if (editVersion) {
      const plan = find(editVersion.dataset.planEditVersion);
      const version = plan?.versions.find(item => item.number === Number(editVersion.dataset.versionNumber));
      if (version) openEditor(plan, version.data);
      return;
    }
    const edit = target.closest('[data-plan-edit]');
    if (edit) { event.preventDefault(); event.stopImmediatePropagation(); openEditor(find(edit.dataset.planEdit)); return; }
    const copy = target.closest('[data-plan-copy]');
    if (copy) {
      event.preventDefault(); event.stopImmediatePropagation();
      const source = find(copy.dataset.planCopy);
      if (!source) return;
      const version = copy.dataset.versionNumber == null ? null : source.versions.find(item => item.number === Number(copy.dataset.versionNumber));
      if (copy.dataset.versionNumber != null && !version) return;
      const data = version?.data || displayData(source);
      closeActionMenu();
      const plan = { ...structuredClone(data), id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: `${data.name}（副本）`, creator: currentCreator, createdAt: new Date().toISOString(), published: false, enabled: false, activationModel: 2, enabledVersion: null, versions: [] };
      addVersion(plan, '复制创建'); plans.unshift(plan);
      if (!persist()) { plans.shift(); render(); return; }
      page = 1; render(); toast('已复制为待发布方案'); return;
    }
    const versions = target.closest('[data-plan-versions]');
    if (versions) { event.preventDefault(); event.stopImmediatePropagation(); showVersions(versions.dataset.planVersions); return; }
    if (target.closest('[data-new-plan]')) {
      activeId = null;
      fillStrategy();
      document.getElementById('planManagementPeriod').value = '';
      document.getElementById('planManagementPeriodUnit').value = '天';
      document.getElementById('planTaskExtensionPeriod').value = '';
      document.getElementById('planTaskExtensionPeriodUnit').value = '天';
    }
    const savePlan = target.closest('[data-save-plan]');
    const publishPlan = target.closest('[data-publish-plan]');
    if (savePlan || publishPlan) {
      event.preventDefault(); event.stopImmediatePropagation();
      const formWorkspace = document.querySelector('.plan-form-workspace');
      if (window.validatePlanFormMode && formWorkspace && !formWorkspace.hidden && !window.validatePlanFormMode()) return;
      const fields = infoFields();
      const name = fields[0]?.value.trim();
      if (!name) { toast('请填写方案名称'); fields[0]?.focus(); return; }
      for (const [id, label] of [['planManagementPeriod', '管理周期'], ['planTaskExtensionPeriod', '任务延续期']]) {
        const input = document.getElementById(id);
        const value = input.value.trim();
        if (!value) { toast(`请输入${label}`); input.focus(); return; }
        if (value.length > 3) { toast(`${label}最多输入 3 位数字`); input.focus(); return; }
        if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) {
          toast(`${label}请输入大于 0 的整数`); input.focus(); return;
        }
      }
      let plan = find(activeId);
      if (!plan) { plan = { id: `plan-${Date.now()}`, name, description: '', profile: '', team: '', tasks: 0, creator: currentCreator, createdAt: new Date().toISOString(), published: false, enabled: false, activationModel: 2, enabledVersion: null, details: {}, versions: [] }; plans.unshift(plan); activeId = plan.id; }
      plan.name = name;
      plan.description = fields[2]?.value.trim() || '';
      plan.profile = fields[4]?.value.trim() || '';
      plan.team = `团队${fields[3]?.value || '体验测试团队'}`;
      const checkin = document.querySelector('#planCanvasPage .plan-checkin-list');
      plan.details = { values: fields.map(field => field.value), checkinHtml: checkin?.innerHTML || '', hasCheckin: checkin?.dataset.hasCheckin || 'false',
        flowValues: [...document.querySelectorAll('#planCanvasPage .plan-flow input')].map(field => field.value), strategy: readStrategy() };
      addVersion(plan, publishPlan ? '发布方案' : '保存方案');
      const createdVersion = plan.versions[0];
      if (publishPlan) { createdVersion.published = true; plan.published = true; }
      if (persist()) {
        render();
        document.getElementById('generatedPlanTitle').textContent = name;
        if (publishPlan) showPublishConfirm(plan, createdVersion);
        else toast('方案已保存为待发布版本');
      }
      return;
    }
    if (target.closest('[data-close-plan-publish]') || target === publishMask) { closePublish(); toast('方案已发布，暂未启用'); return; }
    if (target.closest('[data-confirm-plan-publish]') && publishTarget) {
      const plan = find(publishTarget.planId);
      const version = plan?.versions.find(item => item.number === publishTarget.versionNumber);
      if (!plan || !version?.published) { closePublish(); return; }
      const previous = { enabled: plan.enabled, enabledVersion: plan.enabledVersion, lastEnabledVersion: plan.lastEnabledVersion };
      plan.enabled = true;
      plan.enabledVersion = version.number;
      plan.lastEnabledVersion = version.number;
      if (!persist()) { Object.assign(plan, previous); render(); return; }
      closePublish(); render(); toast(`${versionLabel(version.number)}已发布并启用`); return;
    }
    if (target.closest('[data-close-plan-versions]') || target === modal) { closeVersions(); return; }
    const enable = target.closest('[data-enable-plan-version]');
    if (enable && versionPlanId) {
      const plan = find(versionPlanId);
      const nextVersion = plan.versions.find(item => item.number === Number(enable.dataset.enablePlanVersion));
      if (!nextVersion || !nextVersion.published) { toast('待发布版本不可启用'); return; }
      const previousVersion = plan.enabledVersion;
      const previousLast = plan.lastEnabledVersion;
      const previousPublishedPlan = plan.published;
      plan.enabledVersion = nextVersion.number;
      plan.lastEnabledVersion = plan.enabledVersion;
      nextVersion.published = true;
      if (!persist()) {
        plan.enabledVersion = previousVersion; plan.lastEnabledVersion = previousLast;
        plan.published = previousPublishedPlan; nextVersion.published = false;
        render(); showVersions(plan.id); return;
      }
      render(); showVersions(plan.id); toast('当前版本已更新，方案启停状态保持不变'); return;
    }
    const restore = target.closest('[data-restore-plan-version]');
    if (restore && versionPlanId) {
      const plan = find(versionPlanId);
      const version = plan.versions.find(item => item.number === Number(restore.dataset.restorePlanVersion));
      if (!version || !confirm(`确定将“${plan.name}”恢复为${versionLabel(version.number)}吗？当前版本会保留在历史记录中。`)) return;
      Object.assign(plan, structuredClone(version.data));
      addVersion(plan, `恢复${versionLabel(version.number)}`);
      persist(); render(); showVersions(plan.id); toast('已恢复为待发布版本');
    }
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!columnPanel.hidden) { closeColumnPanel(); columnButton.focus(); }
    else if (publishMask.classList.contains('open')) closePublish();
    else if (deleteMask.classList.contains('open')) closeDelete();
    else if (!actionMenu.hidden) closeActionMenu();
    else if (modal.classList.contains('open')) closeVersions();
  });
  view.querySelector('.plan-table-wrap')?.addEventListener('scroll', closeActionMenu);
  window.addEventListener('resize', closeActionMenu);
})();
