(function () {
  const initialReports = [
    { id: 1, name: '2型糖尿病风险评估', tag: '慢病', scales: 3, output: 'AI 生成', status: '已发布', self: true },
    { id: 2, name: '高血压心血管风险评估', tag: '慢病', scales: 2, output: 'AI 生成', status: '已发布', self: true },
    { id: 3, name: '老年人跌倒风险评估', tag: '老年', common: true, scales: 2, output: 'AI 生成', status: '已发布', self: true },
    { id: 4, name: '肿瘤患者营养风险评估', tag: '营养', scales: 3, output: 'AI 生成', status: '已发布', self: false },
    { id: 5, name: '焦虑抑郁筛查评估', tag: '心理', common: true, scales: 2, output: '仅归档', status: '未发布', self: false }
  ];

  const state = {
    reports: initialReports.map(item => ({ ...item })),
    keyword: '',
    output: '',
    status: '',
    editingId: null,
    menuId: null
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function getView() {
    return document.getElementById('evaluationReportView');
  }

  function mountEvaluationReports() {
    const view = getView();
    if (!view || view.dataset.mounted === 'true') return;
    view.dataset.mounted = 'true';
    view.innerHTML = `
      <div class="evaluation-report-shell">
        <div class="evaluation-report-toolbar" role="search" aria-label="评估报告筛选">
          <label class="evaluation-report-control">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
            <input type="search" data-evaluation-filter="keyword" placeholder="评估标题" aria-label="搜索评估标题">
          </label>
          <label class="evaluation-report-control select">
            <select data-evaluation-filter="output" aria-label="筛选输出报告" required>
              <option value="" selected>输出报告  请选择</option><option value="AI 生成">AI 生成</option><option value="仅归档">仅归档</option>
            </select>
          </label>
          <label class="evaluation-report-control select">
            <select data-evaluation-filter="status" aria-label="筛选状态" required>
              <option value="" selected>状态  请选择</option><option value="已发布">已发布</option><option value="未发布">未发布</option>
            </select>
          </label>
          <button type="button" class="evaluation-report-add" data-evaluation-add><span aria-hidden="true">＋</span>添加评估</button>
        </div>
        <div class="evaluation-report-table-wrap">
          <table class="evaluation-report-table">
            <thead><tr><th class="col-name">评估名称</th><th class="col-scale">关联量表</th><th class="col-output">输出报告</th><th class="col-status">状态</th><th class="col-self">开放自主评估<span class="evaluation-report-help" title="开启后，患者可自主发起该评估">?</span></th><th class="col-actions">操作</th></tr></thead>
            <tbody data-evaluation-report-body></tbody>
          </table>
          <div class="evaluation-report-empty" data-evaluation-empty hidden><div><strong>暂无符合条件的评估</strong><span>可调整筛选条件，或添加新的评估。</span></div></div>
        </div>
        <div class="evaluation-report-pager" aria-label="评估报告分页"><span data-evaluation-total>共 5 条</span><button type="button" class="evaluation-report-page" disabled aria-label="上一页">‹</button><button type="button" class="evaluation-report-page current" aria-current="page">1</button><button type="button" class="evaluation-report-page" disabled aria-label="下一页">›</button><select class="evaluation-report-page-size" aria-label="每页条数"><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select></div>
      </div>`;
    renderRows();
  }

  function filteredReports() {
    const keyword = state.keyword.trim().toLowerCase();
    return state.reports.filter(item => (!keyword || item.name.toLowerCase().includes(keyword)) && (!state.output || item.output === state.output) && (!state.status || item.status === state.status));
  }

  function renderRows() {
    const view = getView();
    if (!view) return;
    const body = view.querySelector('[data-evaluation-report-body]');
    if (!body) return;
    const reports = filteredReports();
    body.innerHTML = reports.map(item => `
      <tr data-evaluation-row="${item.id}">
        <td><span class="evaluation-report-name"><span>${escapeHtml(item.name)}</span>${item.common ? '<span class="evaluation-report-tag">通用</span>' : ''}${item.tag ? `<span class="evaluation-report-tag">${escapeHtml(item.tag)}</span>` : ''}</span></td>
        <td>${item.scales} 张量表</td>
        <td>${escapeHtml(item.output)}</td>
        <td><span class="evaluation-report-status${item.status === '未发布' ? ' is-draft' : ''}">${escapeHtml(item.status)}</span></td>
        <td><button type="button" class="evaluation-report-switch" role="switch" aria-checked="${item.self}" aria-label="${escapeHtml(item.name)}开放自主评估"></button></td>
        <td><span class="evaluation-report-row-actions"><button type="button" class="evaluation-report-link" data-evaluation-edit="${item.id}">编辑</button><button type="button" class="evaluation-report-link evaluation-report-more" data-evaluation-more="${item.id}" aria-haspopup="menu">更多</button></span></td>
      </tr>`).join('');
    view.querySelector('[data-evaluation-empty]').hidden = reports.length > 0;
    view.querySelector('[data-evaluation-total]').textContent = `共 ${reports.length} 条`;
  }

  function closeMenu() {
    document.getElementById('evaluationReportMenu')?.remove();
    state.menuId = null;
  }

  function openMenu(button, id) {
    closeMenu();
    const rect = button.getBoundingClientRect();
    const menu = document.createElement('div');
    menu.id = 'evaluationReportMenu';
    menu.className = 'evaluation-report-menu';
    menu.role = 'menu';
    menu.style.left = `${Math.max(8, rect.right - 112)}px`;
    menu.style.top = `${rect.bottom + 4}px`;
    menu.innerHTML = `<button type="button" role="menuitem" data-evaluation-menu-action="copy">复制评估</button><button type="button" role="menuitem" data-evaluation-menu-action="archive">设为未发布</button><button type="button" role="menuitem" class="danger" data-evaluation-menu-action="delete">删除评估</button>`;
    state.menuId = id;
    document.body.appendChild(menu);
  }

  function openDialog(id) {
    const current = state.reports.find(item => item.id === id);
    state.editingId = current?.id || null;
    const mask = document.createElement('div');
    mask.className = 'evaluation-report-dialog-mask';
    mask.id = 'evaluationReportDialog';
    mask.innerHTML = `
      <form class="evaluation-report-dialog" aria-modal="true" role="dialog" aria-labelledby="evaluationReportDialogTitle">
        <header><strong id="evaluationReportDialogTitle">${current ? '编辑评估' : '添加评估'}</strong><button type="button" class="evaluation-report-dialog-close" data-evaluation-dialog-close aria-label="关闭">×</button></header>
        <div class="evaluation-report-dialog-body">
          <label class="evaluation-report-field"><span>评估名称</span><input name="name" maxlength="30" required placeholder="请输入评估名称" value="${escapeHtml(current?.name || '')}"></label>
          <label class="evaluation-report-field"><span>输出报告</span><select name="output"><option ${current?.output === '仅归档' ? '' : 'selected'}>AI 生成</option><option ${current?.output === '仅归档' ? 'selected' : ''}>仅归档</option></select></label>
        </div>
        <footer><button type="button" class="evaluation-report-dialog-btn" data-evaluation-dialog-close>取消</button><button type="submit" class="evaluation-report-dialog-btn primary">保存</button></footer>
      </form>`;
    document.body.appendChild(mask);
    requestAnimationFrame(() => mask.querySelector('input')?.focus());
  }

  function openCreatePage() {
    document.getElementById('evaluationReportCreatePage')?.remove();
    const page = document.createElement('section');
    page.id = 'evaluationReportCreatePage';
    page.className = 'evaluation-report-create-page';
    page.dataset.persistenceIgnore = 'true';
    page.setAttribute('aria-label', '新建健康评估');
    page.innerHTML = `
      <header class="er-create-header">
        <h1>新建健康评估</h1>
      </header>
      <main class="er-create-canvas">
        <form class="er-create-form" novalidate>
          <div class="er-create-field required" data-create-field="name">
            <label for="evaluationCreateName">评估名称</label>
            <div class="er-create-input-wrap"><input id="evaluationCreateName" name="name" maxlength="20" placeholder="请输入" autocomplete="off" required><span><b data-count-for="name">0</b> / 20</span></div>
            <p class="er-create-error" data-create-error="name"></p>
          </div>

          <div class="er-create-field" data-create-field="description">
            <div class="er-create-label-row"><label for="evaluationCreateDescription">评估简介</label><button type="button" class="er-ai-generate" data-evaluation-generate-description><span aria-hidden="true">✦</span> 一键生成</button></div>
            <div class="er-create-textarea-wrap"><textarea id="evaluationCreateDescription" name="description" maxlength="200" placeholder="请输入"></textarea><span><b data-count-for="description">0</b> / 200</span></div>
          </div>

          <fieldset class="er-create-field required er-create-scope" data-create-field="scope">
            <legend>适用范围</legend>
            <div class="er-create-scope-area">
              <input type="hidden" name="scope" value="">
              <button type="button" class="er-create-outline-btn muted er-create-select-btn" data-evaluation-select-scope aria-haspopup="listbox" aria-expanded="false"><span>＋</span><b data-evaluation-scope-label>选择适用范围</b><i aria-hidden="true">⌄</i></button>
              <div class="er-create-scale-picker er-create-scope-picker" data-evaluation-scope-picker role="listbox" hidden>
                <button type="button" data-scope-value="hospital" role="option">全院通用</button>
                <button type="button" data-scope-value="institution" role="option">机构信息</button>
              </div>
            </div>
            <p class="er-create-error" data-create-error="scope"></p>
          </fieldset>

          <div class="er-create-field" data-create-field="population">
            <label for="evaluationCreatePopulation">适用人群</label>
            <div class="er-create-textarea-wrap compact"><textarea id="evaluationCreatePopulation" name="population" maxlength="200" placeholder="请输入"></textarea><span><b data-count-for="population">0</b> / 200</span></div>
          </div>

          <div class="er-create-field er-duration-field">
            <label for="evaluationCreateDuration">预计用时</label>
            <div class="er-create-duration"><input id="evaluationCreateDuration" name="duration" type="number" min="1" max="180" placeholder="请输入"><span>分钟</span></div>
          </div>

          <div class="er-create-field required" data-create-field="keywords">
            <label>关键词标签</label>
            <div class="er-create-chip-row" data-evaluation-keywords>
              <button type="button" class="er-create-outline-btn" data-evaluation-add-keyword><span>＋</span> 自定义</button>
              <input class="er-create-inline-input" data-evaluation-keyword-input maxlength="8" placeholder="输入标签后回车" hidden>
            </div>
            <p class="er-create-error" data-create-error="keywords"></p>
          </div>

          <div class="er-create-field required" data-create-field="scales">
            <label>关联量表</label>
            <div class="er-create-scale-area">
              <div class="er-create-chip-row" data-evaluation-scales></div>
              <button type="button" class="er-create-outline-btn muted" data-evaluation-add-scale><span>＋</span> 添加量表</button>
              <div class="er-create-scale-picker" data-evaluation-scale-picker hidden>
                <button type="button" data-scale-name="健康状况基础问卷">健康状况基础问卷</button>
                <button type="button" data-scale-name="慢性病自我管理量表">慢性病自我管理量表</button>
                <button type="button" data-scale-name="生活质量评估量表">生活质量评估量表</button>
                <button type="button" data-scale-name="心理健康筛查量表">心理健康筛查量表</button>
              </div>
            </div>
            <p class="er-create-error" data-create-error="scales"></p>
          </div>

          <fieldset class="er-create-field required er-output-field" data-create-field="output">
            <legend>报告输出方式</legend>
            <div class="er-output-grid">
              <label class="er-output-card"><input type="radio" name="output" value="仅归档" checked><span class="er-output-check">✓</span><span class="er-output-title"><i>▣</i>仅归档</span><small>结果仅存入档案，不生成报告</small></label>
              <label class="er-output-card"><input type="radio" name="output" value="AI 生成"><span class="er-output-check">✓</span><span class="er-output-title"><i>AI</i>AI 生成</span><small>基于量表结果自动生成评估报告</small></label>
              <label class="er-output-card"><input type="radio" name="output" value="医生出具"><span class="er-output-check">✓</span><span class="er-output-title"><i>♟</i>医生出具</span><small>需由医护人员人工确认后出具</small></label>
            </div>
          </fieldset>

          <footer class="er-create-actions">
            <button type="button" class="er-create-cancel" data-evaluation-create-close>取消</button>
            <button type="submit" class="er-create-submit">保存评估</button>
          </footer>
        </form>
      </main>`;
    document.body.appendChild(page);
    requestAnimationFrame(() => page.querySelector('[name="name"]')?.focus());
  }

  function closeCreatePage() {
    document.getElementById('evaluationReportCreatePage')?.remove();
  }

  function updateCreateCount(input) {
    const form = input.closest('.er-create-form');
    const counter = form?.querySelector(`[data-count-for="${input.name}"]`);
    if (counter) counter.textContent = input.value.length;
  }

  function addCreateChip(container, text, type) {
    if (!container || !text) return;
    const exists = Array.from(container.querySelectorAll(`[data-${type}-value]`)).some(item => item.dataset[`${type}Value`] === text);
    if (exists) return;
    const chip = document.createElement('span');
    chip.className = 'er-create-chip';
    chip.dataset[`${type}Value`] = text;
    chip.innerHTML = `${escapeHtml(text)}<button type="button" aria-label="移除${escapeHtml(text)}" data-remove-create-chip>×</button>`;
    const insertBefore = container.querySelector('.er-create-outline-btn,.er-create-inline-input');
    container.insertBefore(chip, insertBefore || null);
  }

  function clearCreateErrors(form) {
    form.querySelectorAll('.has-error').forEach(field => field.classList.remove('has-error'));
    form.querySelectorAll('.er-create-error').forEach(error => { error.textContent = ''; });
  }

  function setCreateError(form, field, message) {
    form.querySelector(`[data-create-field="${field}"]`)?.classList.add('has-error');
    const error = form.querySelector(`[data-create-error="${field}"]`);
    if (error) error.textContent = message;
  }

  function submitCreateForm(form) {
    clearCreateErrors(form);
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const scope = String(data.get('scope') || '');
    const keywords = Array.from(form.querySelectorAll('[data-keyword-value]')).map(item => item.dataset.keywordValue);
    const scales = Array.from(form.querySelectorAll('[data-scale-value]')).map(item => item.dataset.scaleValue);
    let firstInvalid = null;
    if (!name) { setCreateError(form, 'name', '请输入评估名称'); firstInvalid ||= form.querySelector('[name="name"]'); }
    if (!scope) { setCreateError(form, 'scope', '请选择适用范围'); firstInvalid ||= form.querySelector('[data-evaluation-select-scope]'); }
    if (!keywords.length) { setCreateError(form, 'keywords', '请至少添加一个关键词标签'); firstInvalid ||= form.querySelector('[data-evaluation-add-keyword]'); }
    if (!scales.length) { setCreateError(form, 'scales', '请至少关联一张量表'); firstInvalid ||= form.querySelector('[data-evaluation-add-scale]'); }
    if (firstInvalid) { firstInvalid.focus(); firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    state.reports.unshift({ id: Date.now(), name, tag: keywords[0], common: scope === 'hospital', scales: scales.length, output: String(data.get('output') || '仅归档'), status: '未发布', self: false, scope: scope === 'hospital' ? '全院通用' : '机构信息' });
    closeCreatePage();
    renderRows();
    toast('健康评估已保存');
  }

  function closeDialog() {
    document.getElementById('evaluationReportDialog')?.remove();
    state.editingId = null;
  }

  let toastTimer = null;
  function toast(message) {
    document.getElementById('evaluationReportToast')?.remove();
    clearTimeout(toastTimer);
    const node = document.createElement('div');
    node.id = 'evaluationReportToast';
    node.className = 'evaluation-report-toast';
    node.role = 'status';
    node.textContent = message;
    document.body.appendChild(node);
    toastTimer = setTimeout(() => node.remove(), 1800);
  }

  document.addEventListener('input', event => {
    if (event.target.closest('.er-create-form')) {
      updateCreateCount(event.target);
      event.target.closest('.er-create-field')?.classList.remove('has-error');
      return;
    }
    if (!event.target.matches('[data-evaluation-filter="keyword"]')) return;
    state.keyword = event.target.value;
    renderRows();
  });

  document.addEventListener('change', event => {
    const filter = event.target.closest('[data-evaluation-filter]');
    if (!filter) return;
    state[filter.dataset.evaluationFilter] = filter.value;
    renderRows();
  });

  document.addEventListener('submit', event => {
    if (event.target.matches('.er-create-form')) {
      event.preventDefault();
      submitCreateForm(event.target);
      return;
    }
    if (!event.target.closest('.evaluation-report-dialog')) return;
    event.preventDefault();
    const data = new FormData(event.target);
    const name = String(data.get('name') || '').trim();
    if (!name) return;
    const current = state.reports.find(item => item.id === state.editingId);
    if (current) {
      current.name = name;
      current.output = String(data.get('output') || 'AI 生成');
    } else {
      state.reports.unshift({ id: Date.now(), name, tag: '', scales: 1, output: String(data.get('output') || 'AI 生成'), status: '未发布', self: false });
    }
    closeDialog();
    renderRows();
    toast(current ? '评估已更新' : '评估已添加');
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.evaluation-report-menu') && !event.target.closest('[data-evaluation-more]')) closeMenu();

    const add = event.target.closest('[data-evaluation-add]');
    if (add) { openCreatePage(); return; }

    if (event.target.closest('[data-evaluation-create-close]')) { closeCreatePage(); return; }

    const generateDescription = event.target.closest('[data-evaluation-generate-description]');
    if (generateDescription) {
      const form = generateDescription.closest('.er-create-form');
      const name = form.querySelector('[name="name"]').value.trim() || '健康风险';
      const description = form.querySelector('[name="description"]');
      description.value = `围绕${name}开展标准化信息采集与风险分层，结合相关量表结果形成评估结论，为后续健康管理和随访计划提供参考。`;
      updateCreateCount(description);
      toast('评估简介已生成');
      return;
    }

    const addKeyword = event.target.closest('[data-evaluation-add-keyword]');
    if (addKeyword) {
      const input = addKeyword.parentElement.querySelector('[data-evaluation-keyword-input]');
      input.hidden = false;
      addKeyword.hidden = true;
      input.focus();
      return;
    }

    const addScale = event.target.closest('[data-evaluation-add-scale]');
    if (addScale) {
      const picker = addScale.parentElement.querySelector('[data-evaluation-scale-picker]');
      picker.hidden = !picker.hidden;
      return;
    }

    const selectScope = event.target.closest('[data-evaluation-select-scope]');
    if (selectScope) {
      const picker = selectScope.parentElement.querySelector('[data-evaluation-scope-picker]');
      picker.hidden = !picker.hidden;
      selectScope.setAttribute('aria-expanded', String(!picker.hidden));
      return;
    }

    const scopeOption = event.target.closest('[data-scope-value]');
    if (scopeOption) {
      const form = scopeOption.closest('.er-create-form');
      const picker = scopeOption.closest('[data-evaluation-scope-picker]');
      const trigger = form.querySelector('[data-evaluation-select-scope]');
      form.querySelector('[name="scope"]').value = scopeOption.dataset.scopeValue;
      form.querySelector('[data-evaluation-scope-label]').textContent = scopeOption.textContent.trim();
      trigger.classList.remove('muted');
      trigger.setAttribute('aria-expanded', 'false');
      picker.hidden = true;
      form.querySelectorAll('[data-scope-value]').forEach(option => option.setAttribute('aria-selected', String(option === scopeOption)));
      form.querySelector('[data-create-field="scope"]')?.classList.remove('has-error');
      form.querySelector('[data-create-error="scope"]').textContent = '';
      return;
    }

    const scaleOption = event.target.closest('[data-scale-name]');
    if (scaleOption) {
      const form = scaleOption.closest('.er-create-form');
      addCreateChip(form.querySelector('[data-evaluation-scales]'), scaleOption.dataset.scaleName, 'scale');
      scaleOption.closest('[data-evaluation-scale-picker]').hidden = true;
      form.querySelector('[data-create-field="scales"]')?.classList.remove('has-error');
      form.querySelector('[data-create-error="scales"]').textContent = '';
      return;
    }

    const removeChip = event.target.closest('[data-remove-create-chip]');
    if (removeChip) { removeChip.parentElement.remove(); return; }

    const edit = event.target.closest('[data-evaluation-edit]');
    if (edit) { openDialog(Number(edit.dataset.evaluationEdit)); return; }

    const more = event.target.closest('[data-evaluation-more]');
    if (more) { openMenu(more, Number(more.dataset.evaluationMore)); return; }

    const switchButton = event.target.closest('.evaluation-report-switch');
    if (switchButton) {
      const row = switchButton.closest('[data-evaluation-row]');
      const report = state.reports.find(item => item.id === Number(row?.dataset.evaluationRow));
      if (!report) return;
      report.self = !report.self;
      switchButton.setAttribute('aria-checked', String(report.self));
      toast(report.self ? '已开放自主评估' : '已关闭自主评估');
      return;
    }

    if (event.target.closest('[data-evaluation-dialog-close]') || event.target.matches('.evaluation-report-dialog-mask')) { closeDialog(); return; }

    const menuAction = event.target.closest('[data-evaluation-menu-action]')?.dataset.evaluationMenuAction;
    if (!menuAction || state.menuId == null) return;
    const report = state.reports.find(item => item.id === state.menuId);
    if (!report) return;
    if (menuAction === 'copy') {
      state.reports.push({ ...report, id: Date.now(), name: `${report.name} 副本`, status: '未发布', self: false });
      toast('评估已复制');
    } else if (menuAction === 'archive') {
      report.status = '未发布';
      report.self = false;
      toast('评估已设为未发布');
    } else if (menuAction === 'delete') {
      state.reports = state.reports.filter(item => item.id !== report.id);
      toast('评估已删除');
    }
    closeMenu();
    renderRows();
  });

  document.addEventListener('keydown', event => {
    const keywordInput = event.target.closest('[data-evaluation-keyword-input]');
    if (keywordInput && (event.key === 'Enter' || event.key === ',')) {
      event.preventDefault();
      const value = keywordInput.value.trim().replace(/,$/, '');
      if (value) addCreateChip(keywordInput.parentElement, value, 'keyword');
      keywordInput.value = '';
      keywordInput.hidden = true;
      keywordInput.parentElement.querySelector('[data-evaluation-add-keyword]').hidden = false;
      const form = keywordInput.closest('.er-create-form');
      form.querySelector('[data-create-field="keywords"]')?.classList.remove('has-error');
      form.querySelector('[data-create-error="keywords"]').textContent = '';
      return;
    }
    if (event.key === 'Escape' && document.getElementById('evaluationReportCreatePage')) closeCreatePage();
  });

  window.mountEvaluationReports = mountEvaluationReports;
})();
