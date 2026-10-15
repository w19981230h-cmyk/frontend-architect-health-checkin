(() => {
  const STORAGE_KEY = 'patient-customer-service-reminders-v1';
  const TAGS_KEY = 'patient-customer-service-tags-v1';
  const TODAY = new Date('2026-10-14T00:00:00');
  const reminderSeed = [
    { id: 'r-01', dueAt: '2026-10-16T09:00', content: '邀请专家进行报告解读', type: 'standard', source: '基因检测服务', relation: '基因检测服务', status: 'upcoming', createdAt: '2026-10-01', note: '提醒客户准备近期检查报告。' },
    { id: 'r-02', dueAt: '2026-10-20T09:00', content: '向客户反馈专家建议', type: 'standard', source: '基因检测服务', relation: '基因检测服务', status: 'upcoming', createdAt: '2026-10-01', note: '同步专家解读结果与后续建议。' },
    { id: 'r-03', dueAt: '2026-10-25T10:00', content: '提醒客户按时服药', type: 'expert', source: '专家建议', relation: '专家建议 · 2026-10-10', status: 'upcoming', createdAt: '2026-10-10', note: '确认用药依从性和不适反应。' },
    { id: 'r-04', dueAt: '2026-11-01T09:00', content: '安排复查血压指标', type: 'expert', source: '专家建议', relation: '专家建议 · 2026-10-10', status: 'upcoming', createdAt: '2026-10-10', note: '连续记录七天晨起血压。' },
    { id: 'r-05', dueAt: '2026-11-10T09:00', content: '发送生日祝福', type: 'custom', source: '客户关怀', relation: '客户关怀', status: 'upcoming', createdAt: '2026-10-12', note: '发送生日祝福和健康关怀。' },
    { id: 'r-06', dueAt: '2026-11-15T09:00', content: '联系客户安排复查', type: 'expert', source: '专家建议', relation: '专家建议 · 2026-10-12', status: 'upcoming', createdAt: '2026-10-12', note: '协调复查日期与院区。' },
    { id: 'r-07', dueAt: '2026-12-01T09:00', content: '跟进体检报告回传', type: 'standard', source: '年度体检服务', relation: '年度体检服务', status: 'upcoming', createdAt: '2026-09-01', note: '确认报告已完成并回传系统。' },
    { id: 'r-08', dueAt: '2026-12-10T09:00', content: '提醒客户调整饮食', type: 'custom', source: '生活方式管理', relation: '生活方式管理', status: 'upcoming', createdAt: '2026-10-14', note: '减少高盐、高糖和油炸食物。' },
    { id: 'r-09', dueAt: '2026-12-15T09:00', content: '评估用药效果', type: 'standard', source: '慢病管理服务', relation: '慢病管理服务', status: 'completed', completedAt: '2026-10-14T15:20', createdAt: '2026-09-01', note: '已完成阶段性用药效果评估。' },
    { id: 'r-10', dueAt: '2026-12-20T09:00', content: '发送节日问候', type: 'custom', source: '客户关怀', relation: '客户关怀', status: 'completed', completedAt: '2026-10-14T16:45', createdAt: '2026-10-14', note: '已发送节日关怀消息。' },
    { id: 'r-11', dueAt: '2026-09-20T10:00', content: '确认检测样本已送检', type: 'standard', source: '基因检测服务', relation: '基因检测服务', status: 'completed', completedAt: '2026-09-20T11:30', createdAt: '2026-09-15', note: '样本状态已确认。' },
    { id: 'r-12', dueAt: '2026-09-15T09:00', content: '联系客户，确认检测安排', type: 'standard', source: '基因检测服务', relation: '基因检测服务', status: 'completed', completedAt: '2026-09-15T10:10', createdAt: '2026-09-15', note: '检测时间和注意事项已确认。' }
  ];
  const tagOptions = ['高血压', '糖尿病', '基因检测', '体重管理', '中老年健康', '重点关注', '复查随访'];

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
    tags: loadJson(TAGS_KEY, ['高血压', '糖尿病', '基因检测', '体重管理', '中老年健康']),
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

  function normalizeReminders(items) {
    const normalized = items.map(item => {
      const status = item.status === 'completed' ? 'completed' : 'upcoming';
      const normalizedItem = { ...item, status };
      if (status === 'completed') normalizedItem.completedAt = item.completedAt || `${item.createdAt || dateParts(item.dueAt).date}T09:00`;
      else delete normalizedItem.completedAt;
      return normalizedItem;
    });
    if (items.some(item => (item.status !== 'completed' && item.status !== 'upcoming') || (item.status === 'completed' && !item.completedAt))) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
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

  function sourceOptions() { return [...new Set(state.reminders.map(item => item.source))].sort((a, b) => a.localeCompare(b, 'zh-CN')); }
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
    const sources = sourceOptions();
    return `<section class="archive-panel customer-service-panel" data-archive-panel="customer-service" data-persistence-ignore hidden>
      <article class="customer-service-card">
        <header class="customer-service-heading">
          <div class="customer-service-title"><h2>客户服务</h2><p>基于客户标签和服务需求生成个性化提醒任务，统一展示所有类型的服务提醒，帮助持续跟进客户健康管理。</p></div>
          <div class="customer-service-heading-actions">
            <div class="customer-service-more-wrap"><button type="button" class="customer-service-more-button" data-customer-header-menu aria-expanded="false">更多操作 <span aria-hidden="true">⌄</span></button><div class="customer-service-heading-menu" data-customer-heading-menu hidden><button type="button" data-customer-bulk-complete>批量完成</button><button type="button" data-customer-export>导出当前结果</button><button type="button" data-customer-reset>重置筛选条件</button></div></div>
          </div>
        </header>
        <section class="customer-service-overview">
          <div class="customer-service-stats" aria-label="提醒任务概览">
            ${statMarkup('all', '全部提醒', count.all)}${statMarkup('upcoming', '待提醒', count.upcoming)}${statMarkup('completed', '已完成', count.completed)}
          </div>
          <div class="customer-service-tags"><div class="customer-service-tags-head"><strong>客户标签</strong><button type="button" class="customer-service-link-button" data-customer-edit-tags>编辑</button></div><div class="customer-service-tag-list" data-customer-tags>${state.tags.map(tag => `<span class="customer-service-tag">${escapeHtml(tag)}</span>`).join('')}</div></div>
        </section>
        <section data-customer-view-controls></section>
        <div class="customer-service-selection-bar" data-customer-selection><strong>已选择 <span>0</span> 项</strong><button type="button" data-customer-selected-complete>标记完成</button><button type="button" data-customer-clear-selection>取消选择</button></div>
        <div data-customer-results></div>
      </article>
    </section>`;
  }

  function statMarkup(status, label, number) {
    return `<button type="button" class="customer-service-stat" data-status="${status}" data-customer-stat="${status}"><span class="customer-service-stat-icon">${icon(status)}</span><span class="customer-service-stat-copy"><strong>${number}</strong><span>${label}</span></span></button>`;
  }
  function selectMarkup(name, options, value) {
    return `<select class="customer-service-filter" data-customer-filter="${name}" aria-label="${name}">${options.map(([optionValue, label]) => `<option value="${escapeHtml(optionValue)}" ${optionValue === value ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('')}</select>`;
  }

  function commonFilters({ time = true, status = true } = {}) {
    const sources = sourceOptions();
    return `${time ? selectMarkup('time', [['all','全部时间'],['week','未来7天'],['month','本月'],['overdue','已逾期']], state.time) : ''}
      ${selectMarkup('type', [['all','全部类型'],['standard','标准SKU'],['expert','专家建议'],['custom','自定义']], state.type)}
      ${selectMarkup('source', [['all','全部来源'], ...sources.map(value => [value, value])], state.source)}
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
    return `<div class="customer-service-table-wrap"><table class="customer-service-table"><thead><tr><th><input type="checkbox" data-customer-select-all aria-label="选择当前页全部提醒" ${allChecked ? 'checked' : ''}></th><th>提醒时间</th><th>提醒内容</th><th>来源类型</th><th>关联服务/依据</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead><tbody>${items.map(rowMarkup).join('')}</tbody></table></div>`;
  }

  function rowMarkup(item) {
    const date = dateParts(item.dueAt);
    const type = typeMeta[item.type];
    const status = statusMeta[item.status];
    const completed = item.status === 'completed';
    return `<tr class="${state.selected.has(item.id) ? 'selected' : ''}" data-customer-row="${item.id}">
      <td><input type="checkbox" data-customer-select="${item.id}" aria-label="选择提醒：${escapeHtml(item.content)}" ${state.selected.has(item.id) ? 'checked' : ''}></td>
      <td><div class="customer-service-time"><span>${date.date}</span><span>${date.time}</span></div></td>
      <td class="customer-service-content-cell" title="${escapeHtml(item.content)}">${escapeHtml(item.content)}</td>
      <td><span class="customer-service-pill ${type.className}">${type.label}</span></td>
      <td class="customer-service-muted" title="${escapeHtml(item.relation)}">${escapeHtml(item.relation)}</td>
      <td><span class="customer-service-pill ${status.className}"><i></i>${status.label}</span></td>
      <td class="customer-service-muted">${escapeHtml(item.createdAt)}</td>
      <td><div class="customer-service-actions">${completed ? `<button type="button" class="customer-service-link-button" data-customer-view-detail="${item.id}">查看</button>` : `<button type="button" class="customer-service-link-button" data-customer-complete="${item.id}">完成</button><button type="button" class="customer-service-link-button" data-customer-edit="${item.id}">编辑</button>`}<button type="button" class="customer-service-row-more" data-customer-row-menu="${item.id}" aria-label="更多操作" aria-expanded="${state.rowMenuId === item.id}">•••</button><div class="customer-service-row-menu" data-customer-row-menu-popover="${item.id}" ${state.rowMenuId === item.id ? '' : 'hidden'}><button type="button" data-customer-copy="${item.id}">复制提醒</button><button type="button" class="danger" data-customer-delete="${item.id}">删除</button></div></div></td>
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
    return `<div class="customer-service-timeline">${[...groups].map(([month, records]) => `<section class="customer-service-timeline-group"><h3><span aria-hidden="true">›</span>${month}</h3>${records.map(item => { const date = dateParts(item.dueAt); const status = statusMeta[item.status]; const type = typeMeta[item.type]; const completed = item.status === 'completed'; const completedDate = completed ? dateParts(item.completedAt) : null; return `<article class="customer-service-timeline-item ${item.status}" data-customer-timeline-item="${item.id}"><button type="button" class="customer-service-quick-complete ${completed ? 'completed' : ''}" data-customer-quick-complete="${item.id}" aria-label="${completed ? '已完成：' : '标记完成：'}${escapeHtml(item.content)}" title="${completed ? '已完成，不可取消' : '快捷标记完成'}" ${completed ? 'disabled' : ''}><span aria-hidden="true">${completed ? '✓' : ''}</span></button><time><strong>${date.date.slice(5).replace('-', '月')}日</strong><span>${date.time}</span></time><div class="customer-service-timeline-rail"><span class="customer-service-timeline-dot">${completed ? '✓' : ''}</span></div><div class="customer-service-timeline-content"><strong>${escapeHtml(item.content)}</strong><p>${escapeHtml(item.note || '暂无备注')}</p></div><div class="customer-service-timeline-tags"><span class="customer-service-pill ${type.className}">${type.label}</span><span class="customer-service-tag">${escapeHtml(item.source)}</span></div><div class="customer-service-timeline-status"><span class="customer-service-pill ${status.className}"><i></i>${status.label}</span>${completedDate ? `<time>完成于 ${completedDate.date} ${completedDate.time}</time>` : ''}</div><button type="button" class="customer-service-row-more" data-customer-view-detail="${item.id}" aria-label="查看提醒详情">•••</button></article>`; }).join('')}</section>`).join('')}</div>`;
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
    const type = typeMeta[item.type];
    return `<article class="customer-service-calendar-detail-item"><span class="customer-service-calendar-detail-dot ${item.status}"></span><div><strong>${escapeHtml(item.content)}</strong><time>${date.time}</time><div><span class="customer-service-pill ${type.className}">${type.label}</span><span class="customer-service-tag">${escapeHtml(item.source)}</span></div><p>${escapeHtml(item.note || '暂无备注')}</p><footer><button type="button" class="customer-service-secondary" data-customer-view-detail="${item.id}">查看详情</button>${item.status !== 'completed' ? `<button type="button" class="customer-service-primary" data-customer-edit="${item.id}">编辑</button>` : ''}</footer></div></article>`;
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
  }

  function openDialog(title, body, foot) {
    ensureDialog();
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

  function reminderForm(item = {}) {
    const due = item.dueAt || '2026-10-15T09:00';
    return `<form id="customerServiceReminderForm" class="customer-service-form-grid">
      <div class="customer-service-field full"><label class="required" for="customerReminderContent">提醒内容</label><input id="customerReminderContent" name="content" maxlength="60" required value="${escapeHtml(item.content || '')}" placeholder="请输入需要跟进的服务事项"></div>
      <div class="customer-service-field"><label class="required" for="customerReminderDue">提醒时间</label><input id="customerReminderDue" name="dueAt" type="datetime-local" required value="${escapeHtml(due)}"></div>
      <div class="customer-service-field"><label class="required" for="customerReminderType">来源类型</label><select id="customerReminderType" name="type" required>${Object.entries(typeMeta).map(([value, meta]) => `<option value="${value}" ${item.type === value ? 'selected' : ''}>${meta.label}</option>`).join('')}</select></div>
      <div class="customer-service-field"><label class="required" for="customerReminderSource">服务来源</label><input id="customerReminderSource" name="source" required value="${escapeHtml(item.source || '')}" placeholder="如：年度体检服务"></div>
      <div class="customer-service-field"><label for="customerReminderRelation">关联服务/依据</label><input id="customerReminderRelation" name="relation" value="${escapeHtml(item.relation || '')}" placeholder="可填写方案或专家建议"></div>
      <div class="customer-service-field full"><label for="customerReminderNote">备注</label><textarea id="customerReminderNote" name="note" maxlength="200" placeholder="补充执行要求或客户注意事项">${escapeHtml(item.note || '')}</textarea></div>
    </form>`;
  }

  function openReminder(itemId) {
    const item = state.reminders.find(record => record.id === itemId);
    state.dialogAction = { type: item ? 'edit' : 'add', id: itemId || '' };
    openDialog(item ? '编辑提醒' : '新增提醒', reminderForm(item), `<button type="button" class="customer-service-dialog-secondary" data-customer-dialog-close>取消</button><button type="submit" form="customerServiceReminderForm" class="customer-service-dialog-primary">${item ? '保存更改' : '新增提醒'}</button>`);
  }

  function openDetail(itemId) {
    const item = state.reminders.find(record => record.id === itemId);
    if (!item) return;
    const due = dateParts(item.dueAt);
    const completed = item.status === 'completed' ? dateParts(item.completedAt) : null;
    openDialog('提醒详情', `<div class="customer-service-form-grid"><div class="customer-service-field full"><label>提醒内容</label><strong>${escapeHtml(item.content)}</strong></div><div class="customer-service-field"><label>提醒时间</label><span>${due.date} ${due.time}</span></div><div class="customer-service-field"><label>状态</label><span>${statusMeta[item.status].label}</span></div>${completed ? `<div class="customer-service-field"><label>完成时间</label><span>${completed.date} ${completed.time}</span></div>` : ''}<div class="customer-service-field"><label>来源类型</label><span>${typeMeta[item.type].label}</span></div><div class="customer-service-field"><label>服务来源</label><span>${escapeHtml(item.source)}</span></div><div class="customer-service-field full"><label>备注</label><span>${escapeHtml(item.note || '暂无备注')}</span></div></div>`, `<button type="button" class="customer-service-dialog-primary" data-customer-dialog-close>关闭</button>`);
  }

  function openTags() {
    state.dialogAction = { type: 'tags' };
    openDialog('编辑客户标签', `<div class="customer-service-field"><label>选择适用于当前客户的标签</label><div class="customer-service-tag-options">${tagOptions.map(tag => `<button type="button" class="customer-service-tag-option ${state.tags.includes(tag) ? 'selected' : ''}" data-customer-tag-option="${escapeHtml(tag)}" aria-pressed="${state.tags.includes(tag)}">${escapeHtml(tag)}</button>`).join('')}</div></div>`, `<button type="button" class="customer-service-dialog-secondary" data-customer-dialog-close>取消</button><button type="button" class="customer-service-dialog-primary" data-customer-save-tags>保存标签</button>`);
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
    if (edit) { openReminder(edit.dataset.customerEdit); return; }
    const detail = target.closest('[data-customer-view-detail]');
    if (detail) { openDetail(detail.dataset.customerViewDetail); return; }
    const menu = target.closest('[data-customer-row-menu]');
    if (menu) { state.rowMenuId = state.rowMenuId === menu.dataset.customerRowMenu ? '' : menu.dataset.customerRowMenu; renderResults(); return; }
    const copy = target.closest('[data-customer-copy]');
    if (copy) { const item = state.reminders.find(record => record.id === copy.dataset.customerCopy); if (item) { state.reminders.push({ ...item, id: `r-${Date.now()}`, content: `${item.content}（副本）`, status: 'upcoming', createdAt: '2026-10-14' }); saveReminders(); refreshOverview(); renderResults(); showToast('提醒已复制'); } return; }
    const remove = target.closest('[data-customer-delete]');
    if (remove) { const item = state.reminders.find(record => record.id === remove.dataset.customerDelete); openConfirm('删除提醒', `确定删除“${item?.content || '该提醒'}”吗？删除后无法恢复。`, () => { state.reminders = state.reminders.filter(record => record.id !== remove.dataset.customerDelete); state.selected.delete(remove.dataset.customerDelete); saveReminders(); refreshOverview(); renderResults(); showToast('提醒已删除'); }); return; }
  }

  function syncHeaderMenu() {
    const trigger = panel.querySelector('[data-customer-header-menu]');
    const menu = panel.querySelector('[data-customer-heading-menu]');
    if (!trigger || !menu) return;
    trigger.setAttribute('aria-expanded', String(state.headerMenuOpen));
    menu.hidden = !state.headerMenuOpen;
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
    const tag = target.closest('[data-customer-tag-option]');
    if (tag) { tag.classList.toggle('selected'); tag.setAttribute('aria-pressed', String(tag.classList.contains('selected'))); return; }
    if (target.closest('[data-customer-save-tags]')) {
      state.tags = [...dialog.querySelectorAll('[data-customer-tag-option].selected')].map(button => button.dataset.customerTagOption);
      saveTags();
      panel.querySelector('[data-customer-tags]').innerHTML = state.tags.map(value => `<span class="customer-service-tag">${escapeHtml(value)}</span>`).join('');
      closeDialog(); showToast('客户标签已更新'); return;
    }
    if (target.closest('[data-customer-confirm]') && state.dialogAction?.type === 'confirm') { const action = state.dialogAction.onConfirm; closeDialog(); action?.(); }
  }

  function onDialogSubmit(event) {
    if (event.target.id !== 'customerServiceReminderForm') return;
    event.preventDefault();
    const form = new FormData(event.target);
    const payload = Object.fromEntries(form.entries());
    if (!payload.content.trim() || !payload.dueAt || !payload.source.trim()) return;
    if (state.dialogAction?.type === 'edit') {
      const item = state.reminders.find(record => record.id === state.dialogAction.id);
      if (item) Object.assign(item, payload);
    } else {
      state.reminders.unshift({ ...payload, id: `r-${Date.now()}`, relation: payload.relation || payload.source, status: 'upcoming', createdAt: '2026-10-14' });
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
    ensureDialog();
    renderViewControls();
    renderResults();
    panel.addEventListener('click', onPanelClick);
    panel.addEventListener('change', onPanelChange);
    panel.addEventListener('input', onPanelInput);
    document.addEventListener('click', event => {
      if (state.headerMenuOpen && !event.target.closest('.customer-service-more-wrap')) { state.headerMenuOpen = false; syncHeaderMenu(); }
      if (state.rowMenuId && !event.target.closest('.customer-service-actions')) { state.rowMenuId = ''; renderResults(); }
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { if (dialog && !dialog.hidden) closeDialog(); state.headerMenuOpen = false; state.rowMenuId = ''; syncHeaderMenu(); } });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
