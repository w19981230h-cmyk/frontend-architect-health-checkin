/* Plan card actions and local version history for the static preview. */
(() => {
  const grid = document.querySelector('#planManagementView .plan-grid');
  if (!grid) return;

  const storageKey = 'frontend-architect:plans:v1';
  const originalCards = [...grid.querySelectorAll('.plan-card')];
  const originalInfoValues = [...document.querySelectorAll('#planCanvasPage [data-plan-tab-panel="info"] input, #planCanvasPage [data-plan-tab-panel="info"] textarea, #planCanvasPage [data-plan-tab-panel="info"] select')].map(field => field.value);
  const originalCheckinList = document.querySelector('#planCanvasPage .plan-checkin-list')?.innerHTML || '';
  const originalFlowValues = [...document.querySelectorAll('#planCanvasPage .plan-flow input')].map(field => field.value);
  const readStorage = () => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
      return Array.isArray(value) ? value : null;
    } catch { return null; }
  };
  const initial = originalCards.map((card, index) => ({
    id: `seed-${index + 1}`,
    name: card.querySelector('.plan-name')?.textContent.trim() || '未命名方案',
    description: card.querySelector('.plan-desc')?.textContent.trim() || '',
    team: card.querySelector('.plan-team')?.textContent.trim() || '',
    tasks: Number(card.querySelector('.plan-task')?.textContent.match(/\d+/)?.[0]) || 0,
    enabled: true,
    details: {},
    versions: []
  }));
  let plans = readStorage() || initial;
  let activeId = null;
  let versionPlanId = null;
  let menuId = null;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(plans)); return true; }
    catch { window.showToast?.('保存失败，请检查浏览器存储空间', 'top'); return false; }
  };
  const notice = message => window.showToast ? window.showToast(message, 'top') : alert(message);
  const find = id => plans.find(plan => plan.id === id);
  const snapshot = plan => ({
    name: plan.name, description: plan.description, team: plan.team,
    tasks: plan.tasks, enabled: plan.enabled, details: { ...plan.details }
  });
  const addVersion = (plan, note) => {
    plan.versions ||= [];
    plan.versions.unshift({ number: (plan.versions[0]?.number || 0) + 1, at: new Date().toISOString(), note, data: snapshot(plan) });
  };
  // Preserve an original version so the first edit can be undone.
  plans.forEach(plan => { if (!plan.versions?.length) addVersion(plan, '初始版本'); });
  save();
  const render = () => {
    grid.innerHTML = plans.map(plan => `<article class="plan-card" data-plan-id="${escapeHtml(plan.id)}" tabindex="0" aria-label="编辑${escapeHtml(plan.name)}">
      <div class="plan-card-head"><span class="plan-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 5h8M8 12h8M8 19h8"/><path d="M5 5h.01M5 12h.01M5 19h.01"/></svg></span><h3 class="plan-name" title="${escapeHtml(plan.name)}">${escapeHtml(plan.name)}</h3><span class="plan-state ${plan.enabled ? '' : 'is-disabled'}">${plan.enabled ? '已启用' : '已停用'}</span></div>
      <p class="plan-desc">${escapeHtml(plan.description)}</p><div class="plan-team">${escapeHtml(plan.team)}</div>
      <div class="plan-card-foot"><span class="plan-task">任务: ${Number(plan.tasks) || 0}</span><div class="plan-more-wrap">
        <button type="button" class="plan-more" aria-haspopup="menu" aria-expanded="${menuId === plan.id}" aria-label="${escapeHtml(plan.name)}更多操作">更多<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 9 6 6 6-6"/></svg></button>
        ${menuId === plan.id ? `<div class="plan-action-menu" role="menu" aria-label="方案操作">
          <button type="button" role="menuitem" data-plan-action="toggle">${plan.enabled ? '停用' : '启用'}</button>
          <button type="button" role="menuitem" data-plan-action="edit">编辑</button>
          <button type="button" role="menuitem" data-plan-action="copy">复制并新增</button>
          <button type="button" role="menuitem" data-plan-action="versions">版本管理</button>
          <button type="button" role="menuitem" class="danger" data-plan-action="delete">删除</button>
        </div>` : ''}</div></div></article>`).join('') || '<div class="plan-empty">暂无方案</div>';
    const count = document.querySelector('#planManagementView .plan-pager > span');
    if (count) count.textContent = `共 ${Math.max(0, 80 + plans.length - initial.length)} 条`;
  };

  const modal = document.createElement('div');
  modal.className = 'plan-version-mask';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `<section class="plan-version-dialog" role="dialog" aria-modal="true" aria-labelledby="planVersionTitle">
    <header><h2 id="planVersionTitle">版本管理</h2><button type="button" data-close-plan-versions aria-label="关闭">×</button></header>
    <p class="plan-version-subtitle"></p><div class="plan-version-list"></div>
    <footer><button type="button" data-close-plan-versions>关闭</button></footer>
  </section>`;
  document.body.append(modal);
  const closeVersions = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); versionPlanId = null; };
  const showVersions = id => {
    const plan = find(id);
    if (!plan) return;
    versionPlanId = id;
    modal.querySelector('.plan-version-subtitle').textContent = plan.name;
    modal.querySelector('.plan-version-list').innerHTML = plan.versions?.length
      ? plan.versions.map((version, index) => `<article class="plan-version-row"><div><strong>版本 ${version.number}${index === 0 ? ' · 当前' : ''}</strong><span>${escapeHtml(new Date(version.at).toLocaleString('zh-CN'))} · ${escapeHtml(version.note)}</span></div><button type="button" data-restore-plan-version="${version.number}" ${index === 0 ? 'disabled' : ''}>恢复此版本</button></article>`).join('')
      : '<div class="plan-version-empty">暂无保存记录。编辑并保存方案后，这里会显示历史版本。</div>';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('[data-close-plan-versions]').focus();
  };

  const detailFields = () => [...document.querySelectorAll('#planCanvasPage [data-plan-tab-panel="info"] input, #planCanvasPage [data-plan-tab-panel="info"] textarea, #planCanvasPage [data-plan-tab-panel="info"] select')];
  const fillDetails = plan => {
    const fields = detailFields();
    fields.forEach((field, index) => { if (index > 0) field.value = plan.details?.values?.[index] ?? originalInfoValues[index] ?? ''; });
    if (!plan.details?.values?.length && fields[3] && plan.team) {
      const team = plan.team.replace(/^团队/, '');
      if (![...fields[3].options].some(option => option.value === team)) fields[3].add(new Option(team, team));
      fields[3].value = team;
    }
    const checkinList = document.querySelector('#planCanvasPage .plan-checkin-list');
    if (checkinList) {
      checkinList.innerHTML = plan.details?.checkinHtml ?? originalCheckinList;
      checkinList.dataset.hasCheckin = plan.details?.hasCheckin ?? 'true';
    }
    document.querySelectorAll('#planCanvasPage .plan-flow input').forEach((field, index) => {
      field.value = plan.details?.flowValues?.[index] ?? originalFlowValues[index] ?? '';
    });
  };
  const openEditor = card => {
    activeId = card.dataset.planId;
    card.click();
    fillDetails(find(activeId));
  };

  render();
  document.addEventListener('click', event => {
    const target = event.target;
    const card = target.closest('#planManagementView .plan-card');
    const action = target.closest('[data-plan-action]');
    if (action && card) {
      event.preventDefault(); event.stopImmediatePropagation();
      const plan = find(card.dataset.planId);
      const kind = action.dataset.planAction;
      menuId = null;
      if (!plan) return;
      if (kind === 'toggle') {
        plan.enabled = !plan.enabled; addVersion(plan, plan.enabled ? '启用方案' : '停用方案'); save(); render(); notice(plan.enabled ? '方案已启用' : '方案已停用');
      } else if (kind === 'edit') {
        render(); openEditor(grid.querySelector(`[data-plan-id="${plan.id}"]`));
      } else if (kind === 'copy') {
        const copy = { ...snapshot(plan), id: `plan-${Date.now()}`, name: `${plan.name}（副本）`, enabled: false, versions: [] };
        addVersion(copy, '复制创建'); plans.unshift(copy); save(); render(); notice('已复制为新方案，可继续编辑');
      } else if (kind === 'versions') {
        render(); showVersions(plan.id);
      } else if (kind === 'delete') {
        if (!confirm(`确定删除“${plan.name}”吗？删除后无法恢复。`)) { render(); return; }
        plans = plans.filter(item => item.id !== plan.id); save(); render(); notice('方案已删除');
      }
      return;
    }
    if (target.closest('#planManagementView .plan-more') && card) {
      event.preventDefault(); event.stopImmediatePropagation();
      menuId = menuId === card.dataset.planId ? null : card.dataset.planId;
      render();
      grid.querySelector(`[data-plan-id="${card.dataset.planId}"] .plan-more`)?.focus();
      return;
    }
    if (card) {
      activeId = card.dataset.planId;
      queueMicrotask(() => fillDetails(find(activeId)));
    } else if (menuId && !target.closest('.plan-action-menu')) { menuId = null; render(); }
    if (target.closest('[data-new-plan]')) activeId = null;
    if (target.closest('[data-save-plan]')) {
      event.preventDefault(); event.stopImmediatePropagation();
      const name = document.getElementById('planNameInput')?.value.trim();
      if (!name) { notice('请填写方案名称'); document.getElementById('planNameInput')?.focus(); return; }
      let plan = find(activeId);
      if (!plan) {
        plan = { id: `plan-${Date.now()}`, name, description: '', team: '体验测试团队', tasks: 0, enabled: false, details: {}, versions: [] };
        plans.unshift(plan); activeId = plan.id;
      }
      const fields = detailFields();
      plan.name = name;
      plan.description = document.getElementById('planDescInput')?.value.trim() || '';
      plan.team = `团队${fields[3]?.value || '体验测试团队'}`;
      const checkinList = document.querySelector('#planCanvasPage .plan-checkin-list');
      plan.details = {
        values: fields.map(field => field.value),
        checkinHtml: checkinList?.innerHTML || '',
        hasCheckin: checkinList?.dataset.hasCheckin || 'false',
        flowValues: [...document.querySelectorAll('#planCanvasPage .plan-flow input')].map(field => field.value)
      };
      addVersion(plan, '保存方案');
      if (save()) { render(); document.getElementById('generatedPlanTitle').textContent = name; notice('方案已保存，版本记录已更新'); }
    }
    if (target.closest('[data-close-plan-versions]') || target === modal) closeVersions();
    const restore = target.closest('[data-restore-plan-version]');
    if (restore && versionPlanId) {
      const plan = find(versionPlanId);
      const version = plan?.versions.find(item => item.number === Number(restore.dataset.restorePlanVersion));
      if (!version || !confirm(`确定将“${plan.name}”恢复为版本 ${version.number} 吗？当前版本会保留在历史记录中。`)) return;
      Object.assign(plan, structuredClone(version.data));
      addVersion(plan, `恢复版本 ${version.number}`);
      save(); render(); showVersions(plan.id); notice('方案已恢复');
    }
  }, true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { if (modal.classList.contains('open')) closeVersions(); else if (menuId) { menuId = null; render(); } }
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('#planManagementView .plan-card') && !event.target.matches('button')) {
      event.preventDefault(); openEditor(event.target);
    }
  });
})();
