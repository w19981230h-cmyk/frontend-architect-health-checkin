(() => {
  const STORAGE_KEY = 'patient-customer-service-reminders-v1';
  const TAGS_KEY = 'patient-customer-service-tags-v1';
  const EXAMPLE_CONTENT_VERSION_KEY = 'patient-customer-service-reminder-examples-v3';
  const TAG_CONTENT_VERSION_KEY = 'patient-customer-service-tags-v2';
  const EXAMPLE_CONTENT_VERSION = '2026-10-20-v3';
  const defaultCustomerTags = ['基因/分子检测', '营养健康产品'];
  const allowedCustomerTags = ['基因/分子检测', '就医协同', '体检/健康检查', '营养健康产品', '专项检测/影像'];
  const TODAY = new Date('2026-10-14T00:00:00');
  const reminderSeed = [
    { id: 'r-01', dueAt: '2026-10-16T09:00', content: '联系客户确认检测目的及资料', type: 'custom', source: '客户标签', relation: '基因/分子检测标签生成', customerTags: ['基因/分子检测'], status: 'upcoming', createdAt: '2026-10-01', note: '确认检测目的，并提醒客户准备所需资料。' },
    { id: 'r-02', dueAt: '2026-10-20T09:00', content: '提醒主理人核对采样安排', type: 'custom', source: '客户标签', relation: '基因/分子检测标签生成', customerTags: ['基因/分子检测'], status: 'upcoming', createdAt: '2026-10-01', note: '核对采样时间、地点及负责人。' },
    { id: 'r-03', dueAt: '2026-10-25T10:00', content: '联系客户确认采样情况', type: 'custom', source: '客户标签', relation: '基因/分子检测标签生成', customerTags: ['基因/分子检测'], status: 'upcoming', createdAt: '2026-10-10', note: '确认客户是否已完成采样及样本状态。' },
    { id: 'r-04', dueAt: '2026-11-01T09:00', content: '跟进机构检测报告', type: 'custom', source: '客户标签', relation: '基因/分子检测标签生成', customerTags: ['基因/分子检测'], status: 'upcoming', createdAt: '2026-10-10', note: '向检测机构确认报告进度及预计出具时间。' },
    { id: 'r-05', dueAt: '2026-11-10T09:00', content: '联系专家安排报告解读', type: 'expert', source: '专家建议', relation: '专家报告生成', customerTags: ['专家建议'], status: 'upcoming', createdAt: '2026-10-12', note: '协调专家解读时间，并准备检测报告。' },
    { id: 'r-06', dueAt: '2026-11-15T09:00', content: '联系客户反馈专家建议', type: 'expert', source: '专家建议', relation: '专家报告生成', customerTags: ['专家建议'], status: 'upcoming', createdAt: '2026-10-12', note: '向客户同步专家解读结论与健康建议。' },
    { id: 'r-07', dueAt: '2026-12-01T09:00', content: '提醒客户完成专家建议中的后续事项', type: 'expert', source: '专家建议', relation: '专家报告生成', customerTags: ['专家建议'], status: 'upcoming', createdAt: '2026-09-01', note: '跟进客户完成专家建议中的复查或干预事项。' },
    { id: 'r-08', dueAt: '2026-12-10T09:00', content: '提醒客户调整饮食', type: 'custom', source: '生活方式管理', relation: '生活方式管理', status: 'upcoming', createdAt: '2026-10-14', note: '减少高盐、高糖和油炸食物。' },
    { id: 'r-09', dueAt: '2026-12-15T09:00', content: '评估用药效果', type: 'standard', source: '慢病管理服务', relation: '慢病管理服务', status: 'completed', completedAt: '2026-10-14T15:20', createdAt: '2026-09-01', note: '已完成阶段性用药效果评估。' },
    { id: 'r-10', dueAt: '2026-12-20T09:00', content: '发送节日问候', type: 'custom', source: '客户关怀', relation: '客户关怀', status: 'completed', completedAt: '2026-10-14T16:45', createdAt: '2026-10-14', note: '已发送节日关怀消息。' },
    { id: 'r-11', dueAt: '2026-09-20T10:00', content: '确认检测样本已送检', type: 'standard', source: '基因检测服务', relation: '基因检测服务', status: 'completed', completedAt: '2026-09-20T11:30', createdAt: '2026-09-15', note: '样本状态已确认。' },
    { id: 'r-12', dueAt: '2026-09-15T09:00', content: '联系客户，确认检测安排', type: 'standard', source: '基因检测服务', relation: '基因检测服务', status: 'completed', completedAt: '2026-09-15T10:10', createdAt: '2026-09-15', note: '检测时间和注意事项已确认。' },
    { id: 'r-13', dueAt: '2026-10-16T10:00', content: '联系客户，确认产品签收及使用情况', type: 'custom', source: '客户标签', relation: '营养健康产品标签生成', customerTags: ['营养健康产品'], status: 'upcoming', createdAt: '2026-10-16', note: '签收当天确认产品是否顺利签收，并说明使用注意事项。' },
    { id: 'r-14', dueAt: '2026-10-19T10:00', content: '了解使用情况', type: 'custom', source: '客户标签', relation: '营养健康产品标签生成', customerTags: ['营养健康产品'], status: 'upcoming', createdAt: '2026-10-16', note: '签收后第3天了解客户的实际使用情况。' },
    { id: 'r-15', dueAt: '2026-10-23T10:00', content: '跟进使用反馈', type: 'custom', source: '客户标签', relation: '营养健康产品标签生成', customerTags: ['营养健康产品'], status: 'upcoming', createdAt: '2026-10-16', note: '签收后第7天跟进使用感受及问题反馈。' },
    { id: 'r-16', dueAt: '2026-11-15T10:00', content: '进行阶段性回访', type: 'custom', source: '客户标签', relation: '营养健康产品标签生成', customerTags: ['营养健康产品'], status: 'upcoming', createdAt: '2026-10-16', note: '签收后第30天进行阶段性使用回访。' },
    { id: 'r-17', dueAt: '2027-01-14T10:00', content: '进行长期跟进', type: 'custom', source: '客户标签', relation: '营养健康产品标签生成', customerTags: ['营养健康产品'], status: 'upcoming', createdAt: '2026-10-16', note: '签收后第90天进行长期效果跟进。' }
  ];
  const reminderExampleIds = new Set(['r-01', 'r-02', 'r-03', 'r-04', 'r-05', 'r-06', 'r-07', 'r-13', 'r-14', 'r-15', 'r-16', 'r-17']);
  const reminderExampleUpdates = Object.fromEntries(reminderSeed.filter(item => reminderExampleIds.has(item.id)).map(item => [item.id, item]));

  const typeMeta = {
    standard: { label: '标准SKU', className: 'type-standard' },
    expert: { label: '专家建议', className: 'type-expert' },
    custom: { label: '自定义', className: 'type-custom' }
  };
  const statusMeta = {
    upcoming: { label: '待提醒', className: 'status-upcoming' },
    completed: { label: '已完成', className: 'status-completed' }
  };

  const state = {
    reminders: normalizeReminders(loadJson(STORAGE_KEY, reminderSeed)),
    tags: loadCustomerTags(),
    section: 'reminders',
    tab: 'all',
    time: 'all',
    type: 'all',
    source: 'all',
    status: 'all',
    query: '',
    sort: 'asc',
    page: 1,
    pageSize: 10,
    calendarMonth: '2026-10',
    selectedDate: '2026-10-16',
    selected: new Set(),
    rowMenuId: '',
    headerMenuOpen: false,
    dialogAction: null
  };

  let panel;
  let dialog;
  let toastTimer;

  function loadJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return Array.isArray(value) ? value : fallback.map(item => typeof item === 'object' ? { ...item } : item);
    } catch (_) {
      return fallback.map(item => typeof item === 'object' ? { ...item } : item);
    }
  }

  function loadCustomerTags() {
    if (localStorage.getItem(TAG_CONTENT_VERSION_KEY) !== '2026-10-16-v1') {
      localStorage.setItem(TAGS_KEY, JSON.stringify(defaultCustomerTags));
      localStorage.setItem(TAG_CONTENT_VERSION_KEY, '2026-10-16-v1');
      return [...defaultCustomerTags];
    }
    const storedTags = loadJson(TAGS_KEY, defaultCustomerTags);
    return allowedCustomerTags.filter(tag => storedTags.includes(tag));
  }

  function normalizeReminders(items) {
    const shouldUpgradeExamples = localStorage.getItem(EXAMPLE_CONTENT_VERSION_KEY) !== EXAMPLE_CONTENT_VERSION;
    const normalized = items.map(item => {
      const status = item.status === 'completed' ? 'completed' : 'upcoming';
      const exampleUpdate = shouldUpgradeExamples ? reminderExampleUpdates[item.id] : null;
      const normalizedItem = { ...item, ...(exampleUpdate || {}), status };
      if (status === 'completed') normalizedItem.completedAt = item.completedAt || `${item.createdAt || dateParts(item.dueAt).date}T09:00`;
      else delete normalizedItem.completedAt;
      return normalizedItem;
    });
    if (shouldUpgradeExamples) {
      const existingIds = new Set(normalized.map(item => item.id));
      Object.values(reminderExampleUpdates).forEach(item => {
        if (!existingIds.has(item.id)) normalized.push({ ...item });
      });
    }
    if (shouldUpgradeExamples || items.some(item => (item.status !== 'completed' && item.status !== 'upcoming') || (item.status === 'completed' && !item.completedAt))) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    if (shouldUpgradeExamples) localStorage.setItem(EXAMPLE_CONTENT_VERSION_KEY, EXAMPLE_CONTENT_VERSION);
    return normalized;
  }

  function saveReminders() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.reminders)); }
  function saveTags() { localStorage.setItem(TAGS_KEY, JSON.stringify(state.tags)); }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
  function pad(value) { return String(value).padStart(2, '0'); }
  function dateParts(value) {
    const date = new Date(value);
    return { date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`, time: `${pad(date.getHours())}:${pad(date.getMinutes())}` };
  }
  function currentDateTimeValue() {
    const date = new Date();
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  function dueTimestamp(item) { return new Date(item.dueAt).getTime(); }
  function counts() {
    return state.reminders.reduce((result, item) => {
      result.all += 1;
      result[item.status] += 1;
      return result;
    }, { all: 0, upcoming: 0, completed: 0 });
  }

  function withinTime(item) {
    const due = new Date(item.dueAt);
    if (state.time === 'overdue') return item.status !== 'completed' && due < TODAY;
    if (state.time === 'week') {
      const end = new Date(TODAY); end.setDate(end.getDate() + 7);
      return due >= TODAY && due < end;
    }
    if (state.time === 'month') return due.getFullYear() === TODAY.getFullYear() && due.getMonth() === TODAY.getMonth();
    return true;
  }
  function filteredReminders() {
    const query = state.query.trim().toLowerCase();
    return state.reminders.filter(item => {
      if (state.tab !== 'all' && item.status !== state.tab) return false;
      if (state.status !== 'all' && item.status !== state.status) return false;
      if (state.type !== 'all' && item.type !== state.type) return false;
      if (state.source !== 'all' && item.source !== state.source) return false;
      if (!withinTime(item)) return false;
      if (query && ![item.content, item.source, item.relation, item.note].some(value => String(value).toLowerCase().includes(query))) return false;
      return true;
    }).sort((a, b) => (dueTimestamp(a) - dueTimestamp(b)) * (state.sort === 'asc' ? 1 : -1));
  }

  function icon(name) {
    const icons = {
      service: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 12H2v5h4v-5H4Zm16 0h2v5h-4v-5h2ZM18 18c-1 2-3 3-6 3"/><circle cx="11" cy="21" r="1" fill="currentColor" stroke="none"/></svg>',
      all: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="6" height="8" rx="1"/><rect x="14" y="3" width="6" height="5" rx="1"/><rect x="4" y="15" width="6" height="6" rx="1"/><rect x="14" y="12" width="6" height="9" rx="1"/></svg>',
      upcoming: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16m-8 3v4m-2-2h4"/></svg>',
      completed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
      reminder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
      expert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M18 4l.7 1.4L20 6l-1.3.6L18 8l-.7-1.4L16 6l1.3-.6L18 4Z"/></svg>',
      search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>',
      list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>',
      timeline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 4v16M7 7h11M7 17h11"/><circle cx="7" cy="7" r="2" fill="white"/><circle cx="7" cy="17" r="2" fill="white"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18M8 14h2m4 0h2m-8 4h2"/></svg>',
      plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 2.5v11M2.5 8h11"/></svg>',
      sort: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 3v10m0 0-2-2m2 2 2-2M12 13V3m0 0-2 2m2-2 2 2"/></svg>'
    };
    return icons[name] || '';
  }

  function navMarkup() {
    return `<button class="archive-nav-item" data-archive-tab="customer-service">` +
      `<span class="customer-service-nav-icon" aria-hidden="true">${icon('service')}</span>客户服务</button>`;
  }

  function buildPanel() {
    const count = counts();
    return `<section class="archive-panel customer-service-panel" data-archive-panel="customer-service" data-persistence-ignore hidden>
      <nav class="customer-service-section-tabs" role="tablist" aria-label="客户服务内容">
        <button type="button" class="active" role="tab" aria-selected="true" data-customer-section="reminders"><span class="customer-service-section-tab-icon">${icon('reminder')}</span><span>客户提醒</span></button>
        <button type="button" role="tab" aria-selected="false" data-customer-section="expert"><span class="customer-service-section-tab-icon">${icon('expert')}</span><span>专家建议</span></button>
      </nav>
      <div class="customer-service-section-view" data-customer-section-view="reminders">
      <article class="customer-service-card">
        <section class="customer-service-overview">
          <div class="customer-service-stats" aria-label="提醒任务概览">
            <div class="customer-service-tags" aria-label="客户标签"><div class="customer-service-tags-head"><strong>客户标签</strong><button type="button" class="customer-service-link-button" data-customer-edit-tags>管理标签</button></div><div class="customer-service-tag-list" data-customer-tags>${state.tags.map(tag => `<span class="customer-service-tag">${escapeHtml(tag)}</span>`).join('')}</div></div>
            ${statMarkup('all', '全部提醒', count.all)}${statMarkup('upcoming', '待提醒', count.upcoming)}${statMarkup('completed', '已完成', count.completed)}
          </div>
        </section>
        <section data-customer-view-controls></section>
        <div class="customer-service-selection-bar" data-customer-selection><strong>已选择 <span>0</span> 项</strong><button type="button" data-customer-selected-complete>标记完成</button><button type="button" data-customer-clear-selection>取消选择</button></div>
        <div data-customer-results></div>
      </article>
      </div>
      <div class="customer-service-section-view customer-service-expert-view" data-customer-section-view="expert" hidden></div>
    </section>`;
  }

  function selectCustomerSection(section) {
    state.section = section === 'expert' ? 'expert' : 'reminders';
    panel?.querySelectorAll('[data-customer-section]').forEach(button => {
      const active = button.dataset.customerSection === state.section;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    panel?.querySelectorAll('[data-customer-section-view]').forEach(view => {
      view.hidden = view.dataset.customerSectionView !== state.section;
    });
    panel?.classList.toggle('showing-expert-section', state.section === 'expert');
  }

  function statMarkup(status, label, number) {
    return `<button type="button" class="customer-service-stat" data-status="${status}" data-customer-stat="${status}"><span class="customer-service-stat-icon">${icon(status)}</span><span class="customer-service-stat-copy"><strong>${number}</strong><span>${label}</span></span></button>`;
  }
  function selectMarkup(name, options, value) {
    return `<select class="customer-service-filter" data-customer-filter="${name}" aria-label="${name}">${options.map(([optionValue, label]) => `<option value="${escapeHtml(optionValue)}" ${optionValue === value ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('')}</select>`;
  }

  function commonFilters({ time = true, status = true } = {}) {
    return `${time ? selectMarkup('time', [['all','全部时间'],['week','未来7天'],['month','本月'],['overdue','已逾期']], state.time) : ''}
      ${selectMarkup('type', [['all','全部类型'],['standard','标准SKU'],['expert','专家建议'],['custom','自定义']], state.type)}
      ${status ? selectMarkup('status', [['all','全部状态'],['upcoming','待提醒'],['completed','已完成']], state.status) : ''}`;
  }

  function renderViewControls() {
    const container = panel?.querySelector('[data-customer-view-controls]');
    if (!container) return;
    container.innerHTML = `<section class="customer-service-toolbar" aria-label="时间轴筛选">${commonFilters()}<button type="button" class="customer-service-secondary" data-customer-sort aria-label="切换时间排序">按时间${state.sort === 'asc' ? '升序' : '降序'} ${icon('sort')}</button><button type="button" class="customer-service-primary customer-service-toolbar-add" data-customer-add>${icon('plus')}新增提醒</button></section>`;
  }

  function pagedItems(items) {
    const pageCount = Math.max(1, Math.ceil(items.length / state.pageSize));
    state.page = Math.min(state.page, pageCount);
    return { pageCount, items: items.slice((state.page - 1) * state.pageSize, state.page * state.pageSize) };
  }

  function renderResults() {
    if (!panel) return;
    const result = panel.querySelector('[data-customer-results]');
    const items = filteredReminders();
    if (!items.length) {
      result.innerHTML = `<div class="customer-service-empty"><div><div class="customer-service-empty-art" aria-hidden="true"></div><p>暂无符合条件的提醒</p><button type="button" class="customer-service-primary" data-customer-reset>重置筛选</button></div></div>`;
      updateSelectionBar();
      return;
    }
    result.innerHTML = timelineMarkup(items);
    updateSelectionBar();
  }

  function tableMarkup(items) {
    const allChecked = items.length > 0 && items.every(item => state.selected.has(item.id));
    return `<div class="customer-service-table-wrap"><table class="customer-service-table"><thead><tr><th><input type="checkbox" data-customer-select-all aria-label="选择当前页全部提醒" ${allChecked ? 'checked' : ''}></th><th>提醒时间</th><th>提醒内容</th><th colspan="2">客户标签</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead><tbody>${items.map(rowMarkup).join('')}</tbody></table></div>`;
  }

  function reminderCustomerTags(item) {
    if (item.source === '客户标签' && item.relation === '客户标签生成') return ['自定义'];
    if (Array.isArray(item.customerTags) && item.customerTags.length) return [item.customerTags[0]];
    const text = `${item.content || ''} ${item.source || ''} ${item.relation || ''} ${item.note || ''}`;
    const matched = state.tags.filter(tag => {
      if (text.includes(tag)) return true;
      if (tag === '基因/分子检测') return /基因|分子|检测|采样/.test(text);
      if (tag === '营养健康产品') return /产品|签收|营养|用药|使用|反馈|回访/.test(text);
      if (tag === '高血压') return /血压|降压/.test(text);
      if (tag === '糖尿病') return /血糖|糖尿病/.test(text);
      if (tag === '体重管理') return /体重|饮食|运动/.test(text);
      if (tag === '中老年健康') return /生日|节日|复查|体检/.test(text);
      return false;
    });
    return (matched.length ? matched : state.tags).slice(0, 1);
  }

  function reminderCustomerTagsMarkup(item) {
    return reminderCustomerTags(item).map(tag => `<span class="customer-service-tag customer-service-task-tag">${escapeHtml(tag)}</span>`).join('');
  }

  function rowMarkup(item) {
    const date = dateParts(item.dueAt);
    const status = statusMeta[item.status];
    const completed = item.status === 'completed';
    return `<tr class="${state.selected.has(item.id) ? 'selected' : ''}" data-customer-row="${item.id}">
      <td><input type="checkbox" data-customer-select="${item.id}" aria-label="选择提醒：${escapeHtml(item.content)}" ${state.selected.has(item.id) ? 'checked' : ''}></td>
      <td><div class="customer-service-time"><span>${date.date}</span><span>${date.time}</span></div></td>
      <td class="customer-service-content-cell" title="${escapeHtml(item.content)}">${escapeHtml(item.content)}</td>
      <td colspan="2"><div class="customer-service-timeline-tags">${reminderCustomerTagsMarkup(item)}</div></td>
      <td><span class="customer-service-pill ${status.className}"><i></i>${status.label}</span></td>
      <td class="customer-service-muted">${escapeHtml(item.createdAt)}</td>
      <td><div class="customer-service-actions">${completed ? `<button type="button" class="customer-service-link-button" data-customer-view-detail="${item.id}">查看</button>` : `<button type="button" class="customer-service-link-button" data-customer-complete="${item.id}">完成</button><button type="button" class="customer-service-row-more" data-customer-row-menu="${item.id}" aria-label="更多操作" aria-expanded="${state.rowMenuId === item.id}">•••</button><div class="customer-service-row-menu" data-customer-row-menu-popover="${item.id}" ${state.rowMenuId === item.id ? '' : 'hidden'}><button type="button" data-customer-edit="${item.id}">编辑</button><button type="button" class="danger" data-customer-delete="${item.id}">删除</button></div>`}</div></td>
    </tr>`;
  }

  function timelineMarkup(items) {
    const groups = new Map();
    items.forEach(item => {
      const date = new Date(item.dueAt);
      const key = `${date.getFullYear()}年${pad(date.getMonth() + 1)}月`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    return `<div class="customer-service-timeline">${[...groups].map(([month, records]) => `<section class="customer-service-timeline-group"><h3><span aria-hidden="true">›</span>${month}</h3>${records.map(item => { const date = dateParts(item.dueAt); const status = statusMeta[item.status]; const completed = item.status === 'completed'; const completedDate = completed ? dateParts(item.completedAt) : null; const actionMarkup = completed ? `<span class="customer-service-action-placeholder" aria-hidden="true"></span>` : `<div class="customer-service-actions customer-service-timeline-actions"><button type="button" class="customer-service-row-more" data-customer-row-menu="${item.id}" aria-label="更多操作" aria-expanded="${state.rowMenuId === item.id}">•••</button><div class="customer-service-row-menu" data-customer-row-menu-popover="${item.id}" ${state.rowMenuId === item.id ? '' : 'hidden'}><button type="button" data-customer-edit="${item.id}">编辑</button><button type="button" class="danger" data-customer-delete="${item.id}">删除</button></div></div>`; return `<article class="customer-service-timeline-item ${item.status}" data-customer-timeline-item="${item.id}"><button type="button" class="customer-service-quick-complete ${completed ? 'completed' : ''}" data-customer-quick-complete="${item.id}" aria-label="${completed ? '已完成：' : '标记完成：'}${escapeHtml(item.content)}" title="${completed ? '已完成，不可取消' : '快捷标记完成'}" ${completed ? 'disabled' : ''}><span aria-hidden="true">${completed ? '✓' : ''}</span></button><time><strong>${date.date.slice(5).replace('-', '月')}日</strong><span>${date.time}</span></time><div class="customer-service-timeline-rail"><span class="customer-service-timeline-dot">${completed ? '✓' : ''}</span></div><div class="customer-service-timeline-content"><strong>${escapeHtml(item.content)}</strong><p>${escapeHtml(item.note || '暂无备注')}</p></div><div class="customer-service-timeline-tags">${reminderCustomerTagsMarkup(item)}</div><div class="customer-service-timeline-status"><span class="customer-service-pill ${status.className}"><i></i>${status.label}</span>${completedDate ? `<time>完成时间：${completedDate.date.replace(/-/g, '/')}&nbsp;&nbsp;${completedDate.time}</time>` : ''}</div>${actionMarkup}</article>`; }).join('')}</section>`).join('')}</div>`;
  }

  function calendarMarkup(items) {
    const [year, month] = state.calendarMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(year, month - 1, 1 - offset);
    const selectedItems = items.filter(item => dateParts(item.dueAt).date === state.selectedDate);
    const days = Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart); date.setDate(gridStart.getDate() + index);
      const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      const dayItems = items.filter(item => dateParts(item.dueAt).date === key);
      const outside = date.getMonth() !== month - 1;
      return `<button type="button" class="customer-service-calendar-day ${outside ? 'outside' : ''} ${key === state.selectedDate ? 'selected' : ''}" data-customer-calendar-date="${key}" aria-label="${key}，${dayItems.length}项提醒"><span>${date.getDate()}</span><div>${dayItems.slice(0,2).map(item => `<i class="${item.status}">${escapeHtml(item.content)}</i>`).join('')}${dayItems.length > 2 ? `<em>+${dayItems.length - 2}</em>` : ''}</div></button>`;
    }).join('');
    return `<div class="customer-service-calendar-layout"><section class="customer-service-calendar"><div class="customer-service-calendar-week"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span></div><div class="customer-service-calendar-grid">${days}</div></section><aside class="customer-service-calendar-detail"><header><strong>${state.selectedDate.slice(5).replace('-', '月')}日</strong><span>${selectedItems.length} 项提醒</span></header>${selectedItems.length ? selectedItems.map(calendarDetailItemMarkup).join('') : `<div class="customer-service-calendar-empty"><span>当天暂无提醒</span><button type="button" class="customer-service-link-button" data-customer-add>新增提醒</button></div>`}</aside></div>`;
  }

  function calendarDetailItemMarkup(item) {
    const date = dateParts(item.dueAt);
    return `<article class="customer-service-calendar-detail-item"><span class="customer-service-calendar-detail-dot ${item.status}"></span><div><strong>${escapeHtml(item.content)}</strong><time>${date.time}</time><div class="customer-service-timeline-tags">${reminderCustomerTagsMarkup(item)}</div><p>${escapeHtml(item.note || '暂无备注')}</p><footer><button type="button" class="customer-service-secondary" data-customer-view-detail="${item.id}">查看详情</button>${item.status !== 'completed' ? `<button type="button" class="customer-service-primary" data-customer-edit="${item.id}">编辑</button>` : ''}</footer></div></article>`;
  }

  function footerMarkup(total, pageCount) {
    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
    return `<footer class="customer-service-footer"><span>共 ${total} 条</span><div class="customer-service-pagination"><button type="button" class="customer-service-page-button" data-customer-page="${state.page - 1}" ${state.page <= 1 ? 'disabled' : ''} aria-label="上一页">‹</button>${pages.map(pageNumber => `<button type="button" class="customer-service-page-button ${pageNumber === state.page ? 'active' : ''}" data-customer-page="${pageNumber}">${pageNumber}</button>`).join('')}<button type="button" class="customer-service-page-button" data-customer-page="${state.page + 1}" ${state.page >= pageCount ? 'disabled' : ''} aria-label="下一页">›</button><select class="customer-service-page-size" data-customer-page-size aria-label="每页条数"><option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10 条/页</option><option value="20" ${state.pageSize === 20 ? 'selected' : ''}>20 条/页</option></select></div></footer>`;
  }

  function updateSelectionBar() {
    const bar = panel?.querySelector('[data-customer-selection]');
    if (!bar) return;
    bar.classList.toggle('visible', state.selected.size > 0);
    const number = bar.querySelector('span');
    if (number) number.textContent = String(state.selected.size);
  }

  function refreshOverview() {
    const count = counts();
    panel.querySelectorAll('[data-customer-stat]').forEach(button => {
      const value = button.dataset.customerStat;
      const number = button.querySelector('strong');
      if (number) number.textContent = String(count[value]);
    });
  }

  function resetFilters() {
    Object.assign(state, { tab: 'all', time: 'all', type: 'all', source: 'all', status: 'all', query: '', page: 1 });
    panel.querySelectorAll('[data-customer-filter]').forEach(select => { select.value = state[select.dataset.customerFilter]; });
    const query = panel.querySelector('[data-customer-query]');
    if (query) query.value = '';
    refreshOverview();
    renderViewControls();
    renderResults();
  }

  function ensureDialog() {
    if (dialog) return;
    document.body.insertAdjacentHTML('beforeend', `<div id="customerServiceDialog" hidden><div class="customer-service-dialog-mask" data-customer-dialog-close></div><section class="customer-service-dialog" role="dialog" aria-modal="true" aria-labelledby="customerServiceDialogTitle"><header class="customer-service-dialog-head"><h2 id="customerServiceDialogTitle"></h2><button type="button" class="customer-service-dialog-close" data-customer-dialog-close aria-label="关闭">×</button></header><div class="customer-service-dialog-body" data-customer-dialog-body></div><footer class="customer-service-dialog-foot" data-customer-dialog-foot></footer></section></div><div id="customerServiceToast" role="status" aria-live="polite"></div>`);
    dialog = document.getElementById('customerServiceDialog');
    dialog.addEventListener('click', onDialogClick);
    dialog.addEventListener('submit', onDialogSubmit);
    dialog.addEventListener('change', onReminderScheduleChange);
    dialog.addEventListener('input', onReminderScheduleChange);
  }

  function openDialog(title, body, foot, mode = 'modal') {
    ensureDialog();
    dialog.classList.toggle('drawer-mode', mode === 'drawer');
    dialog.querySelector('#customerServiceDialogTitle').textContent = title;
    dialog.querySelector('[data-customer-dialog-body]').innerHTML = body;
    dialog.querySelector('[data-customer-dialog-foot]').innerHTML = foot;
    dialog.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => dialog.querySelector('input, select, textarea, button')?.focus());
  }
  function closeDialog() {
    if (!dialog) return;
    dialog.hidden = true;
    state.dialogAction = null;
    document.body.style.overflow = '';
  }

  function reminderScheduleDefaults(item = {}) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const intervalUnit = ['day', 'week', 'month'].includes(item.intervalUnit) ? item.intervalUnit : 'day';
    return {
      dueAt: item.dueAt ? currentDateTimeFromDate(new Date(item.dueAt)) : currentDateTimeFromDate(tomorrow),
      repeatEnabled: typeof item.repeatEnabled === 'boolean' ? item.repeatEnabled : item.id ? Boolean(item.frequency && item.frequency !== 'once') : true,
      intervalValue: Math.max(1, Math.min(intervalUnit === 'day' ? 365 : intervalUnit === 'week' ? 52 : 36, Number(item.intervalValue || item.intervalDays || 3))),
      intervalUnit,
      repeatCount: Math.max(1, Math.min(99, Number(item.repeatCount || item.scheduleCount || 4)))
    };
  }

  function reminderForm(item = {}) {
    const schedule = reminderScheduleDefaults(item);
    return `<form id="customerServiceReminderForm" class="customer-service-form-grid">
      <div class="customer-service-field full"><label class="required" for="customerReminderContent">提醒内容</label><input id="customerReminderContent" name="content" maxlength="60" required value="${escapeHtml(item.content || '')}" placeholder="请输入需要跟进的服务事项"></div>
      <div class="customer-service-field full"><label class="required">提醒设置</label><div class="customer-service-reminder-schedule">
        <div class="customer-service-schedule-field"><label for="customerReminderFirstTime">提醒时间</label><input id="customerReminderFirstTime" name="dueAt" type="datetime-local" required value="${escapeHtml(schedule.dueAt)}" data-customer-first-time></div>
        <label class="customer-service-repeat-switch"><span>重复提醒</span><input type="checkbox" role="switch" data-customer-repeat ${schedule.repeatEnabled ? 'checked' : ''}><i aria-hidden="true"></i></label>
        <div class="customer-service-repeat-config" data-customer-repeat-config ${schedule.repeatEnabled ? '' : 'hidden'}>每隔 <input type="number" min="1" max="${schedule.intervalUnit === 'day' ? 365 : schedule.intervalUnit === 'week' ? 52 : 36}" value="${schedule.intervalValue}" aria-label="重复间隔数值" data-customer-interval-value><select aria-label="重复间隔单位" data-customer-interval-unit><option value="day" ${schedule.intervalUnit === 'day' ? 'selected' : ''}>天</option><option value="week" ${schedule.intervalUnit === 'week' ? 'selected' : ''}>周</option><option value="month" ${schedule.intervalUnit === 'month' ? 'selected' : ''}>月</option></select>，共提醒 <input type="number" min="1" max="99" value="${schedule.repeatCount}" aria-label="提醒次数" data-customer-repeat-count> 次</div>
        <div class="customer-service-schedule-summary"><span aria-hidden="true">i</span><p data-customer-schedule-summary></p></div>
      </div></div>
      <div class="customer-service-field full"><label for="customerReminderNote">备注</label><textarea id="customerReminderNote" name="note" maxlength="200" placeholder="补充执行要求或客户注意事项">${escapeHtml(item.note || '')}</textarea></div>
    </form>`;
  }

  function openReminder(itemId) {
    const item = state.reminders.find(record => record.id === itemId);
    state.dialogAction = { type: item ? 'edit' : 'add', id: itemId || '' };
    openDialog(item ? '编辑提醒' : '新增提醒', reminderForm(item), `<button type="button" class="customer-service-dialog-secondary" data-customer-dialog-close>取消</button><button type="submit" form="customerServiceReminderForm" class="customer-service-dialog-primary">确定</button>`, 'drawer');
    updateReminderSchedule();
  }

  function openDetail(itemId) {
    const item = state.reminders.find(record => record.id === itemId);
    if (!item) return;
    const due = dateParts(item.dueAt);
    const completed = item.status === 'completed' ? dateParts(item.completedAt) : null;
    openDialog('提醒详情', `<div class="customer-service-form-grid"><div class="customer-service-field full"><label>提醒内容</label><strong>${escapeHtml(item.content)}</strong></div><div class="customer-service-field"><label>提醒时间</label><span>${due.date} ${due.time}</span></div><div class="customer-service-field"><label>状态</label><span>${statusMeta[item.status].label}</span></div>${completed ? `<div class="customer-service-field"><label>完成时间</label><span>${completed.date} ${completed.time}</span></div>` : ''}<div class="customer-service-field full"><label>客户标签</label><div class="customer-service-timeline-tags">${reminderCustomerTagsMarkup(item)}</div></div><div class="customer-service-field full"><label>提醒频次</label><span>${escapeHtml(item.scheduleSummary || '单次提醒')}</span></div><div class="customer-service-field full"><label>备注</label><span>${escapeHtml(item.note || '暂无备注')}</span></div></div>`, `<button type="button" class="customer-service-dialog-primary" data-customer-dialog-close>关闭</button>`);
  }

  function openTags() {
    state.dialogAction = { type: 'tags' };
    openDialog('添加客户标签', `<div class="customer-service-field"><label>选择标签（已选标签不可重复点击）</label><div class="customer-service-tag-options" data-customer-tag-options>${allowedCustomerTags.map(tag => state.tags.includes(tag) ? `<span class="customer-service-tag-option selected locked" data-customer-existing-tag="${escapeHtml(tag)}" aria-disabled="true" title="已选中，不能重复点击">${escapeHtml(tag)}</span>` : `<button type="button" class="customer-service-tag-option" data-customer-available-tag="${escapeHtml(tag)}" aria-pressed="false">${escapeHtml(tag)}</button>`).join('')}</div><span class="customer-service-tag-domain-help">灰色标签表示已选中，不能重复点击</span></div>`, `<button type="button" class="customer-service-dialog-secondary" data-customer-dialog-close>取消</button><button type="button" class="customer-service-dialog-primary" data-customer-save-tags>保存标签</button>`);
  }

  function openConfirm(title, message, onConfirm) {
    state.dialogAction = { type: 'confirm', onConfirm };
    openDialog(title, `<p style="margin:0;color:#4b5a70;line-height:1.7">${escapeHtml(message)}</p>`, `<button type="button" class="customer-service-dialog-secondary" data-customer-dialog-close>取消</button><button type="button" class="customer-service-dialog-primary" data-customer-confirm>确认</button>`);
  }

  function showToast(message) {
    ensureDialog();
    const toast = document.getElementById('customerServiceToast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
  }

  function completeItems(ids) {
    let changed = 0;
    state.reminders.forEach(item => {
      if (ids.includes(item.id) && item.status !== 'completed') { item.status = 'completed'; item.completedAt = currentDateTimeValue(); changed += 1; }
    });
    saveReminders();
    state.selected.clear();
    refreshOverview();
    renderResults();
    showToast(changed ? `已完成 ${changed} 项提醒` : '所选提醒均已完成');
  }

  function onPanelClick(event) {
    const target = event.target;
    const sectionTab = target.closest('[data-customer-section]');
    if (sectionTab) { selectCustomerSection(sectionTab.dataset.customerSection); return; }
    const stat = target.closest('[data-customer-stat]');
    const pageButton = target.closest('[data-customer-page]');
    const quickComplete = target.closest('[data-customer-quick-complete]');
    if (stat) { state.status = stat.dataset.customerStat; state.page = 1; renderViewControls(); refreshOverview(); renderResults(); return; }
    if (pageButton && !pageButton.disabled) { state.page = Number(pageButton.dataset.customerPage); renderResults(); return; }
    if (quickComplete && !quickComplete.disabled) { completeItems([quickComplete.dataset.customerQuickComplete]); return; }
    if (target.closest('[data-customer-add]')) { openReminder(); return; }
    if (target.closest('[data-customer-edit-tags]')) { openTags(); return; }
    if (target.closest('[data-customer-sort]')) { state.sort = state.sort === 'asc' ? 'desc' : 'asc'; const button = target.closest('[data-customer-sort]'); button.innerHTML = `按时间${state.sort === 'asc' ? '升序' : '降序'} ${icon('sort')}`; renderResults(); return; }
    const calendarMove = target.closest('[data-customer-calendar-move]');
    if (calendarMove) { const [year, month] = state.calendarMonth.split('-').map(Number); const date = new Date(year, month - 1 + Number(calendarMove.dataset.customerCalendarMove), 1); state.calendarMonth = `${date.getFullYear()}-${pad(date.getMonth() + 1)}`; state.selectedDate = `${state.calendarMonth}-01`; renderViewControls(); renderResults(); return; }
    if (target.closest('[data-customer-calendar-today]')) { state.calendarMonth = '2026-10'; state.selectedDate = '2026-10-14'; renderViewControls(); renderResults(); return; }
    const calendarDate = target.closest('[data-customer-calendar-date]');
    if (calendarDate) { state.selectedDate = calendarDate.dataset.customerCalendarDate; state.calendarMonth = state.selectedDate.slice(0,7); renderViewControls(); renderResults(); return; }
    if (target.closest('[data-customer-reset]')) { state.headerMenuOpen = false; syncHeaderMenu(); resetFilters(); return; }
    if (target.closest('[data-customer-clear-selection]')) { state.selected.clear(); renderResults(); return; }
    if (target.closest('[data-customer-selected-complete], [data-customer-bulk-complete]')) {
      state.headerMenuOpen = false; syncHeaderMenu();
      if (!state.selected.size) { showToast('请先选择需要完成的提醒'); return; }
      completeItems([...state.selected]); return;
    }
    if (target.closest('[data-customer-export]')) { state.headerMenuOpen = false; syncHeaderMenu(); showToast(`已导出当前 ${filteredReminders().length} 条提醒`); return; }
    const headerMenu = target.closest('[data-customer-header-menu]');
    if (headerMenu) { state.headerMenuOpen = !state.headerMenuOpen; syncHeaderMenu(); return; }
    const complete = target.closest('[data-customer-complete]');
    if (complete) { completeItems([complete.dataset.customerComplete]); return; }
    const edit = target.closest('[data-customer-edit]');
    if (edit) {
      const item = state.reminders.find(record => record.id === edit.dataset.customerEdit);
      if (!item || item.status === 'completed') { showToast('已完成的提醒不可编辑'); return; }
      state.rowMenuId = '';
      openReminder(edit.dataset.customerEdit);
      return;
    }
    const detail = target.closest('[data-customer-view-detail]');
    if (detail) { openDetail(detail.dataset.customerViewDetail); return; }
    const menu = target.closest('[data-customer-row-menu]');
    if (menu) { state.rowMenuId = state.rowMenuId === menu.dataset.customerRowMenu ? '' : menu.dataset.customerRowMenu; renderResults(); return; }
    const remove = target.closest('[data-customer-delete]');
    if (remove) {
      const item = state.reminders.find(record => record.id === remove.dataset.customerDelete);
      if (!item || item.status === 'completed') { showToast('已完成的提醒不可删除'); return; }
      state.rowMenuId = '';
      openConfirm('删除提醒', `确定删除“${item.content}”吗？删除后无法恢复。`, () => { state.reminders = state.reminders.filter(record => record.id !== remove.dataset.customerDelete); state.selected.delete(remove.dataset.customerDelete); saveReminders(); refreshOverview(); renderResults(); showToast('提醒已删除'); });
      return;
    }
  }

  function syncHeaderMenu() {
    const trigger = panel.querySelector('[data-customer-header-menu]');
    const menu = panel.querySelector('[data-customer-heading-menu]');
    if (!trigger || !menu) return;
    trigger.setAttribute('aria-expanded', String(state.headerMenuOpen));
    menu.hidden = !state.headerMenuOpen;
  }

  function updateReminderSchedule(changedTarget = null) {
    const form = dialog?.querySelector('#customerServiceReminderForm');
    if (!form) return;
    const repeatInput = form.querySelector('[data-customer-repeat]');
    const repeatEnabled = Boolean(repeatInput?.checked);
    const intervalInput = form.querySelector('[data-customer-interval-value]');
    const intervalUnitInput = form.querySelector('[data-customer-interval-unit]');
    const countInput = form.querySelector('[data-customer-repeat-count]');
    const intervalUnit = ['day', 'week', 'month'].includes(intervalUnitInput?.value) ? intervalUnitInput.value : 'day';
    const intervalMax = intervalUnit === 'day' ? 365 : intervalUnit === 'week' ? 52 : 36;
    const intervalValue = Math.max(1, Math.min(intervalMax, Number(intervalInput?.value || 3)));
    const repeatCount = Math.max(1, Math.min(99, Number(countInput?.value || 4)));
    if (intervalInput) {
      intervalInput.max = String(intervalMax);
      intervalInput.value = String(intervalValue);
    }
    if (countInput) countInput.value = String(repeatCount);
    const repeatConfig = form.querySelector('[data-customer-repeat-config]');
    if (repeatConfig) repeatConfig.hidden = !repeatEnabled;
    const dueAt = form.querySelector('[data-customer-first-time]')?.value;
    const firstDate = dueAt ? new Date(dueAt) : null;
    const firstLabel = firstDate && !Number.isNaN(firstDate.getTime()) ? `${firstDate.getMonth() + 1}月${firstDate.getDate()}日${pad(firstDate.getHours())}:${pad(firstDate.getMinutes())}` : '未设置时间';
    const intervalUnitLabel = { day: '天', week: '周', month: '月' }[intervalUnit];
    const sentence = repeatEnabled ? `${firstLabel}首次提醒，此后每隔${intervalValue}${intervalUnitLabel}提醒一次，共${repeatCount}次。` : `${firstLabel}提醒，仅提醒一次。`;
    const summary = form.querySelector('[data-customer-schedule-summary]');
    if (summary) summary.textContent = sentence;
  }

  function collectReminderSchedule(form) {
    const dueAt = form.querySelector('[data-customer-first-time]')?.value || '';
    const repeatEnabled = Boolean(form.querySelector('[data-customer-repeat]')?.checked);
    const intervalUnitInput = form.querySelector('[data-customer-interval-unit]');
    const intervalUnit = ['day', 'week', 'month'].includes(intervalUnitInput?.value) ? intervalUnitInput.value : 'day';
    const intervalMax = intervalUnit === 'day' ? 365 : intervalUnit === 'week' ? 52 : 36;
    const intervalValue = Math.max(1, Math.min(intervalMax, Number(form.querySelector('[data-customer-interval-value]')?.value || 3)));
    const repeatCount = repeatEnabled ? Math.max(1, Math.min(99, Number(form.querySelector('[data-customer-repeat-count]')?.value || 4))) : 1;
    return {
      dueAt,
      repeatEnabled,
      intervalValue,
      intervalUnit,
      intervalDays: intervalUnit === 'day' ? intervalValue : undefined,
      repeatCount,
      frequency: repeatEnabled ? 'interval' : 'once',
      scheduleCount: repeatCount,
      times: dueAt ? [dateParts(dueAt).time] : [],
      weekdays: [],
      monthdays: [],
      scheduleSummary: form.querySelector('[data-customer-schedule-summary]')?.textContent || ''
    };
  }

  function currentDateTimeFromDate(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function onReminderScheduleChange(event) {
    if (!event.target.closest('#customerServiceReminderForm')) return;
    if (event.target.matches('[data-customer-first-time], [data-customer-repeat], [data-customer-interval-value], [data-customer-interval-unit], [data-customer-repeat-count]')) updateReminderSchedule(event.target);
  }

  function onPanelChange(event) {
    const filter = event.target.closest('[data-customer-filter]');
    if (filter) { state[filter.dataset.customerFilter] = filter.value; state.page = 1; renderResults(); return; }
    if (event.target.matches('[data-customer-page-size]')) { state.pageSize = Number(event.target.value); state.page = 1; renderResults(); return; }
    const checkbox = event.target.closest('[data-customer-select]');
    if (checkbox) { checkbox.checked ? state.selected.add(checkbox.dataset.customerSelect) : state.selected.delete(checkbox.dataset.customerSelect); renderResults(); return; }
    if (event.target.matches('[data-customer-select-all]')) {
      const currentItems = pagedItems(filteredReminders()).items;
      currentItems.forEach(item => event.target.checked ? state.selected.add(item.id) : state.selected.delete(item.id));
      renderResults();
    }
  }

  function onPanelInput(event) {
    if (!event.target.matches('[data-customer-query]')) return;
    state.query = event.target.value;
    state.page = 1;
    renderResults();
  }

  function onDialogClick(event) {
    const target = event.target;
    if (target.closest('[data-customer-dialog-close]')) { closeDialog(); return; }
    const availableTag = target.closest('[data-customer-available-tag]');
    if (availableTag) {
      availableTag.classList.add('selected', 'locked');
      availableTag.setAttribute('aria-pressed', 'true');
      availableTag.setAttribute('aria-disabled', 'true');
      availableTag.disabled = true;
      availableTag.title = '已选中，不能重复点击';
      showToast('已选中，该标签不能重复点击');
      return;
    }
    if (target.closest('[data-customer-save-tags]')) {
      const selectedTags = new Set([
        ...[...dialog.querySelectorAll('[data-customer-existing-tag]')].map(tag => tag.dataset.customerExistingTag),
        ...[...dialog.querySelectorAll('[data-customer-available-tag].selected')].map(tag => tag.dataset.customerAvailableTag)
      ]);
      state.tags = allowedCustomerTags.filter(tag => selectedTags.has(tag));
      saveTags();
      panel.querySelector('[data-customer-tags]').innerHTML = state.tags.map(value => `<span class="customer-service-tag">${escapeHtml(value)}</span>`).join('');
      renderResults();
      closeDialog(); showToast('客户标签已添加'); return;
    }
    if (target.closest('[data-customer-confirm]') && state.dialogAction?.type === 'confirm') { const action = state.dialogAction.onConfirm; closeDialog(); action?.(); }
  }

  function onDialogSubmit(event) {
    if (event.target.id !== 'customerServiceReminderForm') return;
    event.preventDefault();
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    const schedule = collectReminderSchedule(event.target);
    if (!payload.content.trim() || !schedule.dueAt) return;
    Object.assign(payload, schedule);
    if (state.dialogAction?.type === 'edit') {
      const item = state.reminders.find(record => record.id === state.dialogAction.id);
      if (item) Object.assign(item, payload);
    } else {
      state.reminders.unshift({ ...payload, id: `r-${Date.now()}`, type: 'custom', source: '客户标签', relation: '客户标签生成', customerTags: ['自定义'], status: 'upcoming', createdAt: currentDateTimeValue().slice(0, 10) });
    }
    const wasEdit = state.dialogAction?.type === 'edit';
    saveReminders();
    closeDialog();
    refreshOverview();
    renderResults();
    showToast(wasEdit ? '提醒已更新' : '提醒已新增');
  }

  function initialize() {
    const archivePage = document.getElementById('patientArchivePage');
    const nav = archivePage?.querySelector('.archive-side-nav');
    const main = archivePage?.querySelector('.archive-main');
    if (!archivePage || !nav || !main || nav.querySelector('[data-archive-tab="customer-service"]')) return;
    const basicTab = nav.querySelector('[data-archive-tab="basic"]');
    basicTab?.insertAdjacentHTML('afterend', navMarkup());
    const checkinPanel = main.querySelector('[data-archive-panel="checkin"]');
    if (checkinPanel) checkinPanel.insertAdjacentHTML('beforebegin', buildPanel());
    else main.insertAdjacentHTML('beforeend', buildPanel());
    panel = main.querySelector('[data-archive-panel="customer-service"]');
    const expertNav = nav.querySelector('[data-archive-tab="expert-reports"]');
    const expertPanel = main.querySelector('[data-archive-panel="expert-reports"]');
    expertNav?.remove();
    if (expertPanel) {
      expertPanel.removeAttribute('data-archive-panel');
      expertPanel.classList.add('customer-service-expert-content');
      expertPanel.hidden = false;
      panel.querySelector('[data-customer-section-view="expert"]')?.appendChild(expertPanel);
    }
    ensureDialog();
    selectCustomerSection(state.section);
    renderViewControls();
    renderResults();
    panel.addEventListener('click', onPanelClick);
    panel.addEventListener('change', onPanelChange);
    panel.addEventListener('input', onPanelInput);
    window.addEventListener('customerServiceSectionOpen', () => selectCustomerSection('reminders'));
    document.addEventListener('click', event => {
      if (state.headerMenuOpen && !event.target.closest('.customer-service-more-wrap')) { state.headerMenuOpen = false; syncHeaderMenu(); }
      if (state.rowMenuId && !event.target.closest('.customer-service-actions')) { state.rowMenuId = ''; renderResults(); }
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { if (dialog && !dialog.hidden) closeDialog(); state.headerMenuOpen = false; state.rowMenuId = ''; syncHeaderMenu(); } });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
