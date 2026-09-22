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
  const defaultCheckin = document.querySelector('#planCanvasPage .plan-checkin-list')?.innerHTML || '';
  const defaultFlow = [...document.querySelectorAll('#planCanvasPage .plan-flow input')].map(field => field.value);
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
  plans.forEach(plan => {
    const seedMatch = /^seed-(\d+)$/.exec(plan.id || '');
    const sample = seedMatch ? demoAudit[Number(seedMatch[1]) - 1] : null;
    plan.profile ||= profiles[Number(plan.id?.replace('seed-', '')) - 1] || plan.details?.values?.[4] || inferProfile(plan.name);
    if (!plan.versions?.length) addVersion(plan, '初始版本');
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
    if (enabled && plan.enabled) enabled.published = true;
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
    <thead><tr><th>方案名称</th><th>方案描述</th><th>适用画像</th><th>适用团队</th><th>版本号</th><th>版本数量</th><th>任务数量</th><th>状态</th><th>启用版本</th><th>创建人员</th><th>创建时间</th><th>操作</th></tr></thead>
    <tbody id="planListRows"></tbody></table></div>`;
  const rows = content.querySelector('#planListRows');
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
    const checked = Boolean(plan.enabled && (!isChild || plan.enabledVersion === version.number));
    const blocked = isChild && !checked && version.published;
    const label = isChild ? `${checked ? '停用' : '启用'}${esc(plan.name)}的${versionLabel(version.number)}` : `${checked ? '停用' : '启用'}${esc(plan.name)}`;
    return `<label class="checkin-eval-switch-row plan-version-switch" title="${blocked ? '仅待发布版本可开启' : label}"><input type="checkbox" role="switch" data-plan-switch="${esc(plan.id)}" ${isChild ? `data-version-number="${version.number}"` : ''} aria-label="${blocked ? `${versionLabel(version.number)}已发布，不可开启` : label}" ${checked ? 'checked' : ''} ${blocked ? 'disabled' : ''}><span class="checkin-eval-switch" aria-hidden="true"></span></label>`;
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
    const cannotDelete = version && (plan.enabledVersion === version.number || plan.versions.length <= 1);
    const versionAttribute = version ? ` data-version-number="${version.number}"` : '';
    actionMenu.innerHTML = `<button type="button" role="menuitem" data-plan-copy="${esc(plan.id)}"${versionAttribute}>复制新增</button><button type="button" role="menuitem" class="danger" data-plan-delete="${esc(plan.id)}"${versionAttribute} ${cannotDelete ? `disabled title="${plan.enabledVersion === version.number ? '请先停用或切换启用版本' : '最后一个版本请删除方案主体'}"` : ''}>删除</button>`;
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
      <td><span class="plan-child-indent" aria-hidden="true"></span><span class="plan-cell-name" title="${esc(data.name)}">${esc(data.name || '未命名方案')}</span></td>
      <td>${textCell(data.description)}</td><td>${textCell(data.profile, 'plan-profile-value')}</td><td>${textCell(data.team)}</td>
      <td>${versionLabel(version.number)}</td><td>—</td><td>${Number(data.tasks) || 0}</td>
      <td><span class="plan-list-status ${version.published ? 'published' : 'pending'}">${version.published ? '已发布' : '待发布'}</span></td>
      <td>${switchCell(plan, version)}</td>
      <td>${esc(version.creator || '—')}</td><td>${esc(formatTime(version.at))}</td>
      <td>${rowActions(plan, version)}</td>
    </tr>`;
  };
  const renderPlan = plan => {
    const data = displayData(plan);
    const shownVersion = activeVersion(plan)?.number || latest(plan);
    const isExpanded = expanded.has(plan.id);
    return `<tr class="plan-parent-row" data-plan-id="${esc(plan.id)}">
      <td><div class="plan-name-with-expand"><button type="button" class="plan-expand-button" data-plan-expand="${esc(plan.id)}" aria-expanded="${isExpanded}" aria-label="${isExpanded ? '收起' : '展开'}${esc(plan.name)}的版本"><svg class="plan-expand-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span class="plan-cell-name" title="${esc(data.name)}">${esc(data.name || '未命名方案')}</span></div></td>
      <td>${textCell(data.description)}</td><td>${textCell(data.profile, 'plan-profile-value')}</td><td>${textCell(data.team)}</td>
      <td>${versionLabel(shownVersion)}</td>
      <td><button type="button" class="plan-table-link" data-plan-versions="${esc(plan.id)}" aria-label="管理${esc(plan.name)}的${plan.versions?.length || 0}个版本">${plan.versions?.length || 0}</button></td>
      <td>${Number(data.tasks) || 0}</td>
      <td><span class="plan-list-status ${status(plan) === '已发布' ? 'published' : 'pending'}">${status(plan)}</span></td>
      <td>${switchCell(plan)}</td>
      <td>${esc(plan.creator || '—')}</td><td>${esc(formatTime(plan.createdAt))}</td>
      <td>${rowActions(plan)}</td>
    </tr>${isExpanded ? (plan.versions || []).map(version => renderVersion(plan, version)).join('') : ''}`;
  };
  const render = () => {
    closeActionMenu();
    refreshTeams();
    const matches = filtered();
    const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, totalPages);
    const visible = matches.slice((page - 1) * pageSize, page * pageSize);
    rows.innerHTML = visible.length ? visible.map(renderPlan).join('') : '<tr><td class="plan-list-empty" colspan="12">暂无符合条件的方案</td></tr>';
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
      <div class="plan-version-actions"><button type="button" data-enable-plan-version="${version.number}" ${plan.enabledVersion === version.number ? 'disabled title="当前启用版本"' : version.published ? 'disabled title="仅待发布版本可开启"' : ''}>启用此版本</button>
      <button type="button" data-restore-plan-version="${version.number}" ${index === 0 ? 'disabled' : ''}>恢复此版本</button></div></article>`).join('');
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('[data-close-plan-versions]').focus();
  };
  const deleteMask = document.createElement('div');
  deleteMask.className = 'plan-version-mask plan-delete-mask';
  deleteMask.setAttribute('aria-hidden', 'true');
  deleteMask.innerHTML = `<section class="plan-version-dialog" role="alertdialog" aria-modal="true" aria-labelledby="planDeleteTitle"><header><h2 id="planDeleteTitle">删除方案</h2><button type="button" data-close-plan-delete aria-label="关闭">×</button></header><p class="plan-delete-message"></p><footer><button type="button" data-close-plan-delete>取消</button><button type="button" class="plan-delete-confirm" data-confirm-plan-delete>删除</button></footer></section>`;
  document.body.append(deleteMask);
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
    if (control.checked && control.dataset.versionNumber != null && requestedRecord?.published && previousVersion !== requestedVersion) {
      render(); toast('仅待发布版本可开启'); return;
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
      document.getElementById('planManagementPeriod').value = '';
      document.getElementById('planManagementPeriodUnit').value = '天';
      document.getElementById('planTaskExtensionPeriod').value = '';
      document.getElementById('planTaskExtensionPeriodUnit').value = '天';
    }
    if (target.closest('[data-save-plan]')) {
      event.preventDefault(); event.stopImmediatePropagation();
      const fields = infoFields();
      const name = fields[0]?.value.trim();
      if (!name) { toast('请填写方案名称'); fields[0]?.focus(); return; }
      for (const [id, label] of [['planManagementPeriod', '管理周期'], ['planTaskExtensionPeriod', '任务延续期']]) {
        const input = document.getElementById(id);
        const value = input.value.trim();
        if (value && (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1)) {
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
        flowValues: [...document.querySelectorAll('#planCanvasPage .plan-flow input')].map(field => field.value) };
      addVersion(plan, '保存方案');
      if (persist()) { render(); document.getElementById('generatedPlanTitle').textContent = name; toast('方案已保存为待发布版本'); }
      return;
    }
    if (target.closest('[data-close-plan-versions]') || target === modal) { closeVersions(); return; }
    const enable = target.closest('[data-enable-plan-version]');
    if (enable && versionPlanId) {
      const plan = find(versionPlanId);
      const nextVersion = plan.versions.find(item => item.number === Number(enable.dataset.enablePlanVersion));
      if (!nextVersion || nextVersion.published) { toast('仅待发布版本可开启'); return; }
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
    if (deleteMask.classList.contains('open')) closeDelete();
    else if (!actionMenu.hidden) closeActionMenu();
    else if (modal.classList.contains('open')) closeVersions();
  });
  view.querySelector('.plan-table-wrap')?.addEventListener('scroll', closeActionMenu);
  window.addEventListener('resize', closeActionMenu);
})();
