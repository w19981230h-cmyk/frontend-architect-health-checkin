const interactionRuleBindings = [
  { selector: '[data-list-view]', ruleId: 'IR-001' },
  { selector: '[data-open-editor]', ruleId: 'IR-002' },
  { selector: '[data-new-indicator]', ruleId: 'IR-003' },
  { selector: '[data-new-plan], [data-generate-plan], [data-skip-plan-ai]', ruleId: 'IR-003' },
  { selector: '[data-preview-indicator]', ruleId: 'IR-004' },
  { selector: '[data-edit-indicator]', ruleId: 'IR-005' },
  { selector: '[data-dashboard-more]', ruleId: 'IR-006' },
  { selector: '[data-toggle-indicator-status]', ruleId: 'IR-007' },
  { selector: '[data-delete-indicator]', ruleId: 'IR-008' },
  { selector: '[data-toggle-patient-filter], [data-reset-patient-filter], [data-apply-patient-filter]', ruleId: 'IR-009' },
  { selector: '[data-open-patient-record]', ruleId: 'IR-010' },
  { selector: '[data-preview-patient]', ruleId: 'IR-011' },
  { selector: '[data-save-patient-detail]', ruleId: 'IR-012' },
  { selector: '[data-publish-patient]', ruleId: 'IR-013' },
  { selector: '[data-add-indicator-metric], [data-open-patient-indicator], [data-remove-indicator-metric], [data-drag-indicator-metric]', ruleId: 'IR-014' },
  { selector: '#patientTemplateType, #patientTemplateValueControl', ruleId: 'IR-015' },
  { selector: '[data-template-card-range], [data-template-card-date-start], [data-template-card-date-end]', ruleId: 'IR-017' },
  { selector: '[data-close-template-preview], [data-edit-template-preview]', ruleId: 'IR-018' },
  { selector: '[data-archive-tab], [data-archive-more]', ruleId: 'IR-019' },
  { selector: '[data-confirm-patient-publish], [data-cancel-patient-publish], [data-confirm-patient-save], [data-cancel-patient-save], [data-close-indicator-modal], [data-save-indicator], [data-close-patient-indicator], [data-save-patient-indicator]', ruleId: 'IR-020' },
  { selector: '.rail-tab, [data-prop-tab], [data-add-type], [data-add-matrix-row], [data-add-matrix-column], [data-add-value-option], [data-delete-value-option], [data-toggle-required], [data-toggle-add-row], [data-delete]', ruleId: 'IR-021' },
  { selector: '[data-edit-patient], [data-save-patient], [data-cancel-patient-edit], [data-add-portrait], [data-remove-portrait], [data-section-toggle]', ruleId: 'IR-022' }
];
const interactionRuleLocatorEnabled = false;
const reviewMode = interactionRuleLocatorEnabled && new URLSearchParams(window.location.search).get('reviewMode') === 'true';
const interactionRuleState = { rules: new Map(), loaded: false, error: '' };
let interactionRuleRenderQueued = false;

function interactionRuleIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z"/><path d="M8 4v16M11 9h5M11 13h5"/></svg>';
}

function ruleMarkerHost(target) {
  if (target.matches('input, select, textarea')) return target.closest('.patient-template-field, .modal-field, .metric-field, .archive-date-box') || target.parentElement;
  if (target.matches('tr')) return target.querySelector('td') || target;
  return target;
}

function applyInteractionRuleBindings(root = document) {
  interactionRuleBindings.forEach(binding => {
    const targets = [];
    if (root instanceof Element && root.matches(binding.selector)) targets.push(root);
    if (root.querySelectorAll) targets.push(...root.querySelectorAll(binding.selector));
    targets.forEach(target => target.setAttribute('data-rule-id', binding.ruleId));
  });
  if (!reviewMode || !interactionRuleState.loaded) return;
  const targets = [];
  if (root instanceof Element && root.hasAttribute('data-rule-id')) targets.push(root);
  if (root.querySelectorAll) targets.push(...root.querySelectorAll('[data-rule-id]'));
  targets.forEach(target => {
    const ruleId = target.dataset.ruleId;
    if (!interactionRuleState.rules.has(ruleId)) return;
    const host = ruleMarkerHost(target);
    if (!host || host.querySelector(`:scope > .rule-marker[data-rule-marker-for="${ruleId}"]`)) return;
    host.classList.add('rule-marker-host');
    const marker = document.createElement('span');
    marker.className = 'rule-marker';
    marker.dataset.ruleMarkerFor = ruleId;
    marker.setAttribute('role', 'button');
    marker.setAttribute('tabindex', '0');
    marker.setAttribute('title', `查看规则 ${ruleId}`);
    marker.setAttribute('aria-label', `查看交互规则 ${ruleId}`);
    marker.innerHTML = interactionRuleIcon();
    host.appendChild(marker);
  });
}

function scheduleInteractionRuleBindings() {
  if (interactionRuleRenderQueued) return;
  interactionRuleRenderQueued = true;
  requestAnimationFrame(() => {
    interactionRuleRenderQueued = false;
    applyInteractionRuleBindings(document);
  });
}

function renderInteractionRuleDrawer(ruleId) {
  const body = document.getElementById('interactionRuleDrawerBody');
  const rule = interactionRuleState.rules.get(ruleId);
  if (!rule) {
    body.innerHTML = `<div class="rule-load-error">${interactionRuleState.error || `未找到规则 ${esc(ruleId)}`}</div>`;
    return;
  }
  const exceptions = Array.isArray(rule.exceptions) ? rule.exceptions : [rule.exceptions].filter(Boolean);
  body.innerHTML = `<span class="rule-number">${esc(rule.id)}</span><h3 class="rule-title">${esc(rule.title)}</h3><div class="rule-module">所属模块：${esc(rule.module)}</div><section class="rule-section"><h3>交互说明</h3><p>${esc(rule.description)}</p></section><section class="rule-section"><h3>异常规则</h3>${exceptions.length ? `<ul>${exceptions.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : '<p>无</p>'}</section><section class="rule-section"><h3>对应 PRD 锚点</h3><a class="rule-prd-link" href="#${encodeURIComponent(rule.prdAnchor)}">${esc(rule.prdAnchor)}</a></section>`;
}

function openInteractionRuleDrawer(ruleId) {
  renderInteractionRuleDrawer(ruleId);
  const drawer = document.getElementById('interactionRuleDrawer');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeInteractionRuleDrawer() {
  const drawer = document.getElementById('interactionRuleDrawer');
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

async function initInteractionRuleLocator() {
  document.body.classList.toggle('review-mode', reviewMode);
  applyInteractionRuleBindings(document);
  const observer = new MutationObserver(scheduleInteractionRuleBindings);
  observer.observe(document.body, { childList: true, subtree: true });
  if (!reviewMode) return;
  try {
    const response = await fetch('./interaction-rules.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    interactionRuleState.rules = new Map((payload.rules || []).map(rule => [rule.id, rule]));
    interactionRuleState.loaded = true;
    scheduleInteractionRuleBindings();
  } catch (error) {
    interactionRuleState.error = 'interaction-rules.json 加载失败，请检查规则文件是否可访问。';
    document.getElementById('interactionRuleDrawerBody').innerHTML = `<div class="rule-load-error">${interactionRuleState.error}</div>`;
  }
}

document.addEventListener('click', event => {
  const marker = event.target.closest('[data-rule-marker-for]');
  if (marker) {
    event.preventDefault();
    event.stopPropagation();
    openInteractionRuleDrawer(marker.dataset.ruleMarkerFor);
    return;
  }
  if (event.target.closest('[data-close-rule-drawer]')) {
    event.preventDefault();
    event.stopPropagation();
    closeInteractionRuleDrawer();
  }
}, true);

document.addEventListener('keydown', event => {
  const marker = event.target.closest?.('[data-rule-marker-for]');
  if (marker && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    event.stopPropagation();
    openInteractionRuleDrawer(marker.dataset.ruleMarkerFor);
  } else if (event.key === 'Escape') {
    closeInteractionRuleDrawer();
  }
}, true);
