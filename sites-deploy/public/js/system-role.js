(function () {
  const STORAGE_KEY = 'frontend-architect-system-roles-v1';
  const permissionGroups = [
    { key: 'patients', label: '患者管理', children: ['全部患者', '团队患者', '患者档案'] },
    { key: 'dashboard', label: '数据看板', children: [] },
    { key: 'content', label: '方案与内容', children: ['方案管理', '量表管理', '评估报告', '文章管理', '知识库'] },
    { key: 'services', label: '服务管理', children: ['服务包管理', '订单管理', '交易记录'] },
    { key: 'operations', label: '运营管理', children: ['数据报表', '统计报表', '数据看板'] },
    { key: 'ai', label: 'AI医助', children: [] },
    { key: 'system', label: '系统管理', children: ['组织管理', '团队管理', '人员管理', '系统角色', '设备管理', '看板配置'] }
  ];
  const allPermissions = permissionGroups.flatMap(group => [group.key, ...group.children.map((_, index) => `${group.key}:${index}`)]);
  const seedRoles = [
    { id: 101, name: '平台级管理员', description: '拥有全部功能权限，数据范围为全部平台数据', users: '平台技术人员', dataScope: 'platform', permissions: allPermissions, protected: true, createdAt: '2026/09/29 09:00:00' },
    { id: 102, name: '医共体管理员', description: '拥有全部功能权限，数据范围为所属医共体数据', users: '王医生、李医生', dataScope: 'medicalConsortium', permissions: allPermissions, protected: true, createdAt: '2026/09/29 09:00:00' },
    { id: 103, name: '系统管理员', description: '拥有全部功能权限，数据范围为所属机构数据', users: '张医生、陈医生', dataScope: 'all', permissions: allPermissions, protected: true, createdAt: '2026/09/29 09:00:00' },
    { id: 104, name: '科室管理员', description: '拥有全部功能权限，数据范围为所属科室数据', users: '科室负责人、赵医生', dataScope: 'department', permissions: allPermissions, protected: true, createdAt: '2026/09/29 09:00:00' }
  ];
  const protectedRoleNames = new Set(seedRoles.map(role => role.name));
  const legacyRoleNames = new Set(['管理员', '运营者', '系统管理员', '科室管理员']);

  const state = { roles: loadRoles(), editingId: null, menuId: null, readonly: false };
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

  function loadRoles() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const customRoles = Array.isArray(saved) ? saved.filter(role => !role.protected && !legacyRoleNames.has(role.name) && !protectedRoleNames.has(role.name)) : [];
      const roles = [...seedRoles.map(role => ({ ...role, permissions: [...allPermissions] })), ...customRoles];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
      return roles;
    } catch (_) {
      return seedRoles.map(role => ({ ...role, permissions: [...allPermissions] }));
    }
  }

  function saveRoles() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.roles)); } catch (_) {}
  }

  function render() {
    const body = document.getElementById('systemRoleTableBody');
    const total = document.getElementById('systemRoleTotal');
    if (!body || !total) return;
    total.textContent = `总数：${state.roles.length}`;
    body.innerHTML = state.roles.map((role, index) => `
      <tr>
        <td>${index + 1}</td>
        <td title="${escapeHtml(role.name)}">${escapeHtml(role.name)}</td>
        <td title="${escapeHtml(role.description || '')}">${escapeHtml(role.description || '')}</td>
        <td title="${escapeHtml(role.users || '--')}">${escapeHtml(role.users || '--')}</td>
        <td>${escapeHtml(role.createdAt)}</td>
        <td><span class="system-role-actions">${role.protected ? `<button type="button" class="system-role-edit" data-role-view="${role.id}">查看</button>` : `<button type="button" class="system-role-edit" data-role-edit="${role.id}">编辑</button><button type="button" class="system-role-more" data-role-more="${role.id}" aria-label="更多操作" aria-expanded="false">···</button>`}</span></td>
      </tr>`).join('');
    document.getElementById('systemRoleEmpty')?.toggleAttribute('hidden', state.roles.length > 0);
    document.getElementById('systemRolePageTotal').textContent = `共 ${state.roles.length} 条`;
  }

  function nowText() {
    const date = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function renderPermissionTree(selected = []) {
    const tree = document.getElementById('systemRolePermissionTree');
    if (!tree) return;
    tree.innerHTML = permissionGroups.map(group => {
      const checked = selected.includes(group.key);
      const children = group.children.map((label, index) => {
        const value = `${group.key}:${index}`;
        return `<label><input type="checkbox" data-role-permission-child="${group.key}" value="${value}" ${selected.includes(value) ? 'checked' : ''}><span>${escapeHtml(label)}</span></label>`;
      }).join('');
      return `<div class="system-role-permission-row" data-role-permission-row="${group.key}"><div class="system-role-permission-parent">${group.children.length ? '<button type="button" class="system-role-permission-toggle" data-role-permission-toggle aria-label="展开权限">›</button>' : '<span class="system-role-permission-toggle" aria-hidden="true"></span>'}<label><input type="checkbox" data-role-permission-parent="${group.key}" value="${group.key}" ${checked ? 'checked' : ''}><span>${escapeHtml(group.label)}</span></label></div>${group.children.length ? `<div class="system-role-permission-children">${children}</div>` : ''}</div>`;
    }).join('');
  }

  function selectedPermissions() {
    return Array.from(document.querySelectorAll('#systemRolePermissionTree input:checked')).map(input => input.value);
  }

  function setEditorTab(tab) {
    document.querySelectorAll('[data-role-editor-tab]').forEach(button => {
      const active = button.dataset.roleEditorTab === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-role-editor-panel]').forEach(panel => {
      const active = panel.dataset.roleEditorPanel === tab;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  }

  function ensureExtendedDataScopes() {
    const section = document.querySelector('.data-scope-section');
    if (!section) return;
    if (!section.querySelector('input[value="platform"]')) {
      section.querySelector('h3')?.insertAdjacentHTML('afterend', '<label><input type="radio" name="systemRoleDataScope" value="platform"><span>全部平台数据</span></label>');
    }
    const platformOption = section.querySelector('input[value="platform"]')?.closest('label');
    if (!section.querySelector('input[value="medicalConsortium"]')) {
      platformOption?.insertAdjacentHTML('afterend', '<label><input type="radio" name="systemRoleDataScope" value="medicalConsortium"><span>所属医共体数据</span></label>');
    }
  }

  function openDialog(role, readonly = false) {
    state.editingId = role?.id ?? null;
    state.readonly = readonly;
    const dialog = document.getElementById('systemRoleDialog');
    document.getElementById('systemRoleDialogTitle').textContent = readonly ? '查看角色' : role ? '编辑角色' : '添加角色';
    document.getElementById('systemRoleEditorHeading').textContent = readonly ? '系统内置角色' : role ? '编辑系统角色' : '添加系统角色';
    const nameInput = document.getElementById('systemRoleName');
    const descriptionInput = document.getElementById('systemRoleDescription');
    nameInput.value = role?.name || '';
    descriptionInput.value = role?.description || '';
    nameInput.readOnly = readonly;
    descriptionInput.readOnly = readonly;
    document.getElementById('systemRoleUsers').value = role?.users === '--' ? '' : role?.users || '';
    document.getElementById('systemRoleDescriptionCount').textContent = String((role?.description || '').length);
    document.getElementById('systemRoleNameError').textContent = '';
    renderPermissionTree(role?.permissions || []);
    ensureExtendedDataScopes();
    const scope = role?.dataScope || 'all';
    const scopeInput = document.querySelector(`input[name="systemRoleDataScope"][value="${scope}"]`);
    if (scopeInput) scopeInput.checked = true;
    dialog.querySelectorAll('#systemRolePermissionTree input, input[name="systemRoleDataScope"]').forEach(input => { input.disabled = readonly; });
    document.querySelector('[data-role-dialog-submit]').hidden = readonly;
    setEditorTab('permissions');
    dialog.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!readonly) requestAnimationFrame(() => document.getElementById('systemRoleName').focus());
  }

  function closeDialog() {
    document.getElementById('systemRoleDialog').hidden = true;
    document.body.style.overflow = '';
    state.editingId = null;
    state.readonly = false;
  }

  function showToast(message) {
    const toast = document.getElementById('systemRoleToast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 1800);
  }

  function submitDialog() {
    if (state.readonly) return;
    const nameInput = document.getElementById('systemRoleName');
    const name = nameInput.value.trim();
    if (!name) {
      document.getElementById('systemRoleNameError').textContent = '请输入角色名称';
      nameInput.focus();
      return;
    }
    const description = document.getElementById('systemRoleDescription').value.trim();
    const users = document.getElementById('systemRoleUsers').value.trim() || '--';
    const permissions = selectedPermissions();
    const dataScope = document.querySelector('input[name="systemRoleDataScope"]:checked')?.value || 'all';
    if (state.editingId == null) {
      const nextId = Math.max(0, ...state.roles.map(item => Number(item.id) || 0)) + 1;
      state.roles.push({ id: nextId, name, description, users, permissions, dataScope, createdAt: nowText() });
      showToast('角色添加成功');
    } else {
      const role = state.roles.find(item => item.id === state.editingId);
      if (role) Object.assign(role, { name, description, users, permissions, dataScope });
      showToast('角色信息已保存');
    }
    saveRoles();
    render();
    closeDialog();
  }

  function closeMenu() {
    const menu = document.getElementById('systemRoleMenu');
    if (menu) menu.hidden = true;
    document.querySelectorAll('[data-role-more][aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    state.menuId = null;
  }

  function openMenu(button, id) {
    const menu = document.getElementById('systemRoleMenu');
    const rect = button.getBoundingClientRect();
    state.menuId = id;
    menu.style.left = `${Math.min(window.innerWidth - 124, rect.right - 112)}px`;
    menu.style.top = `${Math.min(window.innerHeight - 82, rect.bottom + 5)}px`;
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
  }

  function duplicateRole(id) {
    const source = state.roles.find(role => role.id === id);
    if (!source || source.protected) return;
    const nextId = Math.max(0, ...state.roles.map(item => Number(item.id) || 0)) + 1;
    state.roles.push({ ...source, id: nextId, name: `${source.name}副本`, createdAt: nowText() });
    saveRoles();
    render();
    showToast('角色已复制');
  }

  function deleteRole(id) {
    const source = state.roles.find(role => role.id === id);
    if (!source || source.protected || !window.confirm(`确认删除角色“${source.name}”吗？`)) return;
    state.roles = state.roles.filter(role => role.id !== id);
    saveRoles();
    render();
    showToast('角色已删除');
  }

  document.addEventListener('click', event => {
    const add = event.target.closest('[data-role-add]');
    if (add) { openDialog(); return; }
    const edit = event.target.closest('[data-role-edit]');
    if (edit) { openDialog(state.roles.find(role => role.id === Number(edit.dataset.roleEdit))); return; }
    const view = event.target.closest('[data-role-view]');
    if (view) { openDialog(state.roles.find(role => role.id === Number(view.dataset.roleView)), true); return; }
    const more = event.target.closest('[data-role-more]');
    if (more) {
      event.stopPropagation();
      const id = Number(more.dataset.roleMore);
      if (state.menuId === id) closeMenu(); else { closeMenu(); openMenu(more, id); }
      return;
    }
    const menuAction = event.target.closest('[data-role-menu-action]');
    if (menuAction) {
      const id = state.menuId;
      const action = menuAction.dataset.roleMenuAction;
      closeMenu();
      if (action === 'duplicate') duplicateRole(id);
      if (action === 'delete') deleteRole(id);
      return;
    }
    if (!event.target.closest('#systemRoleMenu')) closeMenu();
    const editorTab = event.target.closest('[data-role-editor-tab]');
    if (editorTab) { setEditorTab(editorTab.dataset.roleEditorTab); return; }
    const permissionToggle = event.target.closest('[data-role-permission-toggle]');
    if (permissionToggle) {
      const row = permissionToggle.closest('[data-role-permission-row]');
      const expanded = row.classList.toggle('expanded');
      permissionToggle.setAttribute('aria-label', expanded ? '收起权限' : '展开权限');
      return;
    }
    if (event.target.closest('[data-role-dialog-close]')) { closeDialog(); return; }
    if (event.target.closest('[data-role-dialog-submit]')) { submitDialog(); return; }
    if (event.target === document.getElementById('systemRoleDialog')) closeDialog();
    if (event.target.closest('[data-role-refresh]')) { render(); showToast('角色数据已刷新'); }
  });

  document.addEventListener('change', event => {
    const parent = event.target.closest('[data-role-permission-parent]');
    if (parent) {
      const group = parent.dataset.rolePermissionParent;
      document.querySelectorAll(`[data-role-permission-child="${group}"]`).forEach(child => { child.checked = parent.checked; });
      return;
    }
    const child = event.target.closest('[data-role-permission-child]');
    if (child) {
      const group = child.dataset.rolePermissionChild;
      const children = Array.from(document.querySelectorAll(`[data-role-permission-child="${group}"]`));
      const parentInput = document.querySelector(`[data-role-permission-parent="${group}"]`);
      if (parentInput) {
        parentInput.checked = children.every(input => input.checked);
        parentInput.indeterminate = children.some(input => input.checked) && !parentInput.checked;
      }
    }
  });

  document.addEventListener('input', event => {
    if (event.target?.id === 'systemRoleDescription') document.getElementById('systemRoleDescriptionCount').textContent = String(event.target.value.length);
    if (event.target?.id === 'systemRoleName' && event.target.value.trim()) document.getElementById('systemRoleNameError').textContent = '';
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeMenu(); if (!document.getElementById('systemRoleDialog')?.hidden) closeDialog(); }
    if (event.key === 'Enter' && event.target?.id === 'systemRoleName') submitDialog();
  });

  window.renderSystemRoles = render;
  render();
})();
