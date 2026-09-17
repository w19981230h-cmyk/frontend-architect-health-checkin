(function () {
  const institutions = [
    '南宁市第二人民医院',
    '南宁市第五人民医院',
    '南宁市妇幼保健院',
    '南宁中医医院',
    '南宁市第一人民医院',
    '柳州市人民医院',
    '桂林市人民医院'
  ];

  const initialRows = [
    { id: 1, name: '哮喘用药指导手册', sourceType: '本地创建', sourceName: '--', sourceLink: '--', plans: 1, author: '李铭锐', createdAt: '2026/09/16 18:01:23' },
    { id: 2, name: '踝骨术后康复运动指南', sourceType: '本地创建', sourceName: '--', sourceLink: '--', plans: 5, author: '王医生', createdAt: '2026/09/16 16:46:18' },
    { id: 3, name: '脊柱侧弯康复运动指南：坚持锻炼，让脊柱挺拔', sourceType: '本地创建', sourceName: '--', sourceLink: '--', plans: 1, author: '王医生', createdAt: '2026/09/16 16:07:34' },
    { id: 4, name: '产后营养恢复指南｜吃好养好，安心迎接新生命', sourceType: '本地创建', sourceName: '--', sourceLink: '--', plans: 1, author: '李铭锐', createdAt: '2026/09/16 14:26:03' },
    { id: 5, name: '低盐饮食指南——高血压患者的一月控盐要点', sourceType: '本地创建', sourceName: '--', sourceLink: '--', plans: 1, author: '李铭锐', createdAt: '2026/09/16 10:52:42' },
    { id: 6, name: '血压突然飙升，怎么办？——高血压急症应对指南', sourceType: '本地创建', sourceName: '--', sourceLink: '--', plans: 4, author: '王医生', createdAt: '2026/09/15 14:02:32' },
    { id: 7, name: '高血压用药指导手册：养成好习惯，血压稳稳的', sourceType: '本地创建', sourceName: '--', sourceLink: '--', plans: 4, author: '王医生', createdAt: '2026/09/15 14:01:54' },
    { id: 8, name: '慢性咽炎自我管理手册：稳住嗓子，远离反复', sourceType: '本地创建', sourceName: '--', sourceLink: '--', plans: 3, author: '李铭锐', createdAt: '2026/09/11 17:52:39', selected: true },
    { id: 9, name: '糖尿病饮食控制指南', sourceType: '本地创建', sourceName: '--', sourceLink: '--', plans: 4, author: '欧舒朗', createdAt: '2026/09/07 10:38:04' },
    { id: 10, name: '行稳致智：敏行业数字生产力的引领者', sourceType: '微信同步', sourceName: '行稳数智服务号', sourceLink: 'http://mp.weixin.qq.com/s/…', plans: 0, author: '李铭锐', createdAt: '2026/08/27 11:43:32' }
  ];

  const state = { rows: initialRows.slice(), keyword: '', page: 1, pageSize: 10, total: 127 };
  let toastTimer = 0;
  let createModal = null;
  let createForm = null;
  let createNameInput = null;
  let createScopeSelect = null;
  let createNameError = null;
  let createScopeError = null;
  let createNameCount = null;
  let createReturnFocus = null;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  }

  function toast(message) {
    const node = document.getElementById('articleToast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove('show'), 1800);
  }

  function visibleRows() {
    const keyword = state.keyword.trim().toLowerCase();
    return state.rows.filter(row => !keyword || [row.name, row.sourceType, row.sourceName, row.author].some(value => String(value).toLowerCase().includes(keyword)));
  }

  function renderRows() {
    const body = document.getElementById('articleTableBody');
    const empty = document.getElementById('articleEmpty');
    if (!body || !empty) return;
    const rows = visibleRows();
    body.innerHTML = rows.map((row, index) => `
      <tr data-article-id="${row.id}" class="${row.selected ? 'is-selected' : ''}">
        <td>${index + 1}</td>
        <td class="article-name" title="${escapeHtml(row.name)}">${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.sourceType)}</td>
        <td>${escapeHtml(row.sourceName)}</td>
        <td title="${escapeHtml(row.sourceLink)}">${row.sourceLink.startsWith('http') ? `<a class="article-source-link" href="#" data-article-link>${escapeHtml(row.sourceLink)}</a>` : escapeHtml(row.sourceLink)}</td>
        <td>${row.plans}</td>
        <td><span class="article-status ${row.offline ? 'offline' : ''}">${row.offline ? '已下架' : '已发布'}</span></td>
        <td>${escapeHtml(row.author)}</td>
        <td>${escapeHtml(row.createdAt)}</td>
        <td><span class="article-actions"><button class="article-action" data-article-action="preview">预览</button><button class="article-action" data-article-action="edit">编辑</button><button class="article-action" data-article-action="offline">${row.offline ? '发布' : '下架'}</button><button class="article-action danger" data-article-action="delete">删除</button></span></td>
      </tr>`).join('');
    empty.hidden = rows.length > 0;
  }

  function renderPagination() {
    const total = document.getElementById('articleTotal');
    if (total) total.textContent = `共 ${state.total} 条`;
    document.querySelectorAll('[data-article-page]').forEach(button => {
      const value = button.dataset.articlePage;
      button.classList.toggle('current', Number(value) === state.page);
      if (value === 'prev') button.disabled = state.page === 1;
    });
  }

  function clearCreateErrors() {
    createNameError.textContent = '';
    createScopeError.textContent = '';
    createNameInput.removeAttribute('aria-invalid');
    createScopeSelect.removeAttribute('aria-invalid');
  }

  function openCreateModal(trigger) {
    if (!createModal) return;
    createReturnFocus = trigger || document.activeElement;
    createForm.reset();
    createNameCount.textContent = '0 / 100';
    clearCreateErrors();
    createModal.classList.add('open');
    createModal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => createNameInput.focus());
  }

  function closeCreateModal() {
    if (!createModal) return;
    createModal.classList.remove('open');
    createModal.setAttribute('aria-hidden', 'true');
    createReturnFocus?.focus?.();
  }

  function validateCreateForm() {
    clearCreateErrors();
    const name = createNameInput.value.trim();
    const scope = createScopeSelect.value;
    if (!name) {
      createNameError.textContent = '请输入文章名称';
      createNameInput.setAttribute('aria-invalid', 'true');
    }
    if (!scope) {
      createScopeError.textContent = '请选择适用范围';
      createScopeSelect.setAttribute('aria-invalid', 'true');
    }
    if (!name) createNameInput.focus();
    else if (!scope) createScopeSelect.focus();
    return Boolean(name && scope);
  }

  function setupCreateModal() {
    if (document.getElementById('articleCreateModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="scale-create-mask" id="articleCreateModal" aria-hidden="true">
        <section class="scale-create-dialog" role="dialog" aria-modal="true" aria-labelledby="articleCreateTitle">
          <header class="scale-create-head">
            <h2 id="articleCreateTitle">新建文章</h2>
            <button type="button" class="scale-create-close" data-article-create-close aria-label="关闭">×</button>
          </header>
          <form id="articleCreateForm" novalidate>
            <div class="scale-create-body">
              <div class="scale-create-field">
                <label class="scale-create-label required" for="articleCreateName">文章名称</label>
                <div class="scale-create-input-wrap">
                  <input class="scale-create-input" id="articleCreateName" maxlength="100" placeholder="请输入" autocomplete="off" aria-describedby="articleCreateNameError">
                  <span class="scale-create-count" id="articleCreateNameCount">0 / 100</span>
                </div>
                <div class="scale-create-error" id="articleCreateNameError" aria-live="polite"></div>
              </div>
              <div class="scale-create-field">
                <label class="scale-create-label required" for="articleCreateScope">适用范围</label>
                <select class="scale-create-select" id="articleCreateScope" aria-describedby="articleCreateScopeError">
                  <option value="" selected disabled>请选择适用范围</option>
                  <option value="hospital">全院通用</option>
                  ${institutions.map(name => `<option value="institution:${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
                </select>
                <div class="scale-create-error" id="articleCreateScopeError" aria-live="polite"></div>
              </div>
            </div>
            <footer class="scale-create-foot">
              <button type="button" class="scale-create-btn" data-article-create-close>取消</button>
              <button type="submit" class="scale-create-btn primary">确定</button>
            </footer>
          </form>
        </section>
      </div>`);

    createModal = document.getElementById('articleCreateModal');
    createForm = document.getElementById('articleCreateForm');
    createNameInput = document.getElementById('articleCreateName');
    createScopeSelect = document.getElementById('articleCreateScope');
    createNameError = document.getElementById('articleCreateNameError');
    createScopeError = document.getElementById('articleCreateScopeError');
    createNameCount = document.getElementById('articleCreateNameCount');

    createModal.addEventListener('mousedown', event => {
      if (event.target === createModal) closeCreateModal();
    });
    createModal.addEventListener('click', event => {
      if (event.target.closest('[data-article-create-close]')) closeCreateModal();
    });
    createNameInput.addEventListener('input', () => {
      createNameCount.textContent = `${createNameInput.value.length} / 100`;
      if (createNameInput.value.trim()) {
        createNameError.textContent = '';
        createNameInput.removeAttribute('aria-invalid');
      }
    });
    createScopeSelect.addEventListener('change', () => {
      createScopeError.textContent = '';
      createScopeSelect.removeAttribute('aria-invalid');
    });
    createForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateCreateForm()) return;
      const selectedScopeLabel = createScopeSelect.selectedOptions[0]?.textContent || '';
      state.rows.unshift({
        id: Math.max(0, ...state.rows.map(row => Number(row.id) || 0)) + 1,
        name: createNameInput.value.trim(),
        sourceType: '本地创建',
        sourceName: '--',
        sourceLink: '--',
        plans: 0,
        author: '平台技术人员',
        createdAt: '2026/09/16 18:30:00',
        scopeType: createScopeSelect.value === 'hospital' ? 'hospital' : 'institution',
        scopeLabel: selectedScopeLabel,
        selected: true
      });
      state.rows.slice(1).forEach(row => { row.selected = false; });
      state.total += 1;
      state.keyword = '';
      const search = document.getElementById('articleSearchInput');
      if (search) search.value = '';
      renderRows();
      renderPagination();
      closeCreateModal();
      toast(`文章已创建，适用范围：${selectedScopeLabel}`);
    });
  }

  function mount() {
    const view = document.getElementById('articleManagementView');
    if (!view || view.dataset.mounted) return;
    view.dataset.mounted = 'true';
    view.innerHTML = `
      <div class="article-management-shell">
        <div class="article-management-toolbar">
          <label class="article-search" aria-label="搜索文章"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input id="articleSearchInput" placeholder="请输入文章名称" autocomplete="off"></label>
          <button type="button" class="article-toolbar-button" data-article-refresh aria-label="刷新文章列表" title="刷新文章列表"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 11a8 8 0 1 0-2.34 5.66"/><path d="M20 5v6h-6"/></svg></button>
          <button type="button" class="article-toolbar-button" aria-label="导入文章" title="导入文章" data-article-import><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg></button>
          <button type="button" class="article-toolbar-button article-create" data-article-create><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg><span>新增文章</span></button>
        </div>
        <div class="article-table-region">
          <table class="article-table" aria-label="文章管理列表">
            <colgroup><col style="width:4%"><col style="width:14%"><col style="width:7.5%"><col style="width:14%"><col style="width:8.5%"><col style="width:8%"><col style="width:8.5%"><col style="width:10%"><col style="width:10%"><col style="width:14.5%"></colgroup>
            <thead><tr><th>序号</th><th>文章名称</th><th>来源类型</th><th>来源名称</th><th>来源链接</th><th>绑定方案</th><th>状态</th><th>创建人员</th><th>创建时间</th><th>操作</th></tr></thead>
            <tbody id="articleTableBody"></tbody>
          </table>
          <div class="article-empty" id="articleEmpty" hidden>暂无符合条件的文章</div>
        </div>
        <div class="article-pagination" aria-label="文章列表分页">
          <span id="articleTotal">共 127 条</span><button type="button" class="article-page-button" data-article-page="prev" aria-label="上一页">‹</button><button type="button" class="article-page-button current" data-article-page="1">1</button><button type="button" class="article-page-button" data-article-page="2">2</button><button type="button" class="article-page-button" data-article-page="3">3</button><button type="button" class="article-page-button" data-article-page="4">4</button><button type="button" class="article-page-button" data-article-page="5">5</button><span class="article-page-ellipsis">…</span><button type="button" class="article-page-button" data-article-page="13">13</button><button type="button" class="article-page-button" data-article-page="next" aria-label="下一页">›</button><select class="article-page-size" aria-label="每页条数"><option value="10">10 条/页</option><option value="20">20 条/页</option><option value="50">50 条/页</option></select><span>跳至</span><input class="article-jump" inputmode="numeric" aria-label="跳转页码"><span>页</span>
        </div>
      </div><div class="article-toast" id="articleToast" role="status" aria-live="polite"></div>`;
    setupCreateModal();
    renderRows();
    renderPagination();
  }

  document.addEventListener('input', event => {
    if (event.target.id !== 'articleSearchInput') return;
    state.keyword = event.target.value;
    renderRows();
  });

  document.addEventListener('change', event => {
    if (!event.target.matches('.article-page-size')) return;
    state.pageSize = Number(event.target.value);
    toast(`已切换为每页 ${state.pageSize} 条`);
  });

  document.addEventListener('keydown', event => {
    if (!event.target.matches('.article-jump') || event.key !== 'Enter') return;
    const page = Math.max(1, Math.min(13, Number(event.target.value) || 1));
    state.page = page;
    renderPagination();
    toast(`已跳转至第 ${page} 页`);
  });

  document.addEventListener('click', event => {
    const row = event.target.closest('[data-article-id]');
    if (row && !event.target.closest('button, a')) {
      state.rows.forEach(item => { item.selected = item.id === Number(row.dataset.articleId); });
      renderRows();
      return;
    }
    if (event.target.closest('[data-article-refresh]')) { renderRows(); toast('文章列表已刷新'); return; }
    if (event.target.closest('[data-article-import]')) { toast('文章导入入口已打开'); return; }
    const createButton = event.target.closest('[data-article-create]');
    if (createButton) { openCreateModal(createButton); return; }
    if (event.target.closest('[data-article-link]')) { event.preventDefault(); toast('来源链接已加载'); return; }
    const pageButton = event.target.closest('[data-article-page]');
    if (pageButton) {
      const target = pageButton.dataset.articlePage;
      state.page = target === 'prev' ? Math.max(1, state.page - 1) : target === 'next' ? Math.min(13, state.page + 1) : Number(target);
      renderPagination();
      toast(`已切换至第 ${state.page} 页`);
      return;
    }
    const actionButton = event.target.closest('[data-article-action]');
    if (!actionButton) return;
    const targetRow = actionButton.closest('[data-article-id]');
    const article = state.rows.find(item => item.id === Number(targetRow?.dataset.articleId));
    if (!article) return;
    const action = actionButton.dataset.articleAction;
    if (action === 'delete') {
      state.rows = state.rows.filter(item => item.id !== article.id);
      state.total -= 1;
      renderRows();
      renderPagination();
      toast('文章已删除');
      return;
    }
    if (action === 'offline') {
      article.offline = !article.offline;
      renderRows();
      toast(article.offline ? '文章已下架' : '文章已发布');
      return;
    }
    toast(`${article.name} · ${action === 'preview' ? '预览' : '编辑'}已打开`);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && createModal?.classList.contains('open')) closeCreateModal();
  });

  window.mountArticleManagement = mount;
})();
