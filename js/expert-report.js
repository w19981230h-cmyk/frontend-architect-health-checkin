(function () {
  'use strict';

  const suggestions = [
    { title: '高血压健康管理专家建议', date: '2024-10-15', doctor: '李教授', status: '已生成任务', tone: 'blue' },
    { title: '血脂异常调整建议', date: '2024-09-10', doctor: '王医生', status: '已处理', tone: 'green', relatedReports: [] },
    { title: '糖尿病饮食管理建议', date: '2024-08-21', doctor: '张主任', status: '待解析', tone: 'orange' },
    { title: '心血管复查建议', date: '2024-07-15', doctor: '陈教授', status: '未生成任务', tone: 'gray' }
  ];

  const reminders = [
    ['blue', '血压监测提醒', '建议每日早晚监测血压，连续记录2周。', '每日 08:00、20:00', '待提醒', 'pending'],
    ['indigo', '复查提醒', '2周后携带血压记录复诊。', '2024-10-29 09:00', '待提醒', 'pending'],
    ['purple', '低盐饮食提醒', '建议低盐饮食，控制每日盐摄入量。', '每隔 3 天，共 4 次', '已完成', 'completed'],
    ['green', '用药依从性提醒', '按医嘱规律服用降压药物。', '每日 09:00', '已完成', 'completed'],
    ['violet', '症状关注提醒', '如出现头晕、头痛等症状及时就医。', '每隔 7 天，共 4 次', '已删除', 'deleted']
  ];

  const sourceFiles = [
    ['pdf', '专家建议原文.pdf', '2.3MB'],
    ['pdf', '血压监测记录.pdf', '1.6MB'],
    ['image', '用药方案.jpg', '860KB'],
    ['doc', '复诊计划.docx', '420KB'],
    ['image', '饮食建议.png', '1.1MB']
  ];

  const relatedReports = [
    ['血常规检查报告', '2024-10-01'],
    ['心电图检查报告', '2024-10-08'],
    ['血压监测记录', '2024-10-10'],
    ['肝肾功能检查报告', '2024-09-28'],
    ['眼底检查报告', '2024-09-20']
  ];

  const defaultNote = '针对近期血压波动情况给出的管理建议';

  const expertParseItems = [
    { status: 'running', title: 'image1', time: '', text: 'AI正在识别资料名称、报告时间和关联报告。', related: [] },
    { status: 'pending', title: 'image2', time: '', related: [] },
    { status: 'pending', title: 'image4', time: '', related: ['血常规检查报告'] },
    { status: 'done', title: '高血压健康管理专家建议', time: '2024-10-15', related: ['血常规检查报告', '心电图检查报告'] },
    { status: 'done', title: '家庭血压管理建议', time: '2024-10-08', related: ['血压监测记录'] },
    { status: 'failed', title: 'image3', time: '', reason: '文件清晰度较低，名称和报告时间未识别完整。', related: [] }
  ];

  const expertParseStatusText = { running: '解析中', pending: '待补充', done: '已完成', failed: '已失败' };

  const svg = (body) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  const icons = {
    search: svg('<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>'),
    calendar: svg('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>'),
    down: svg('<path d="m7 10 5 5 5-5"/>'),
    edit: svg('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    trash: svg('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>'),
    more: svg('<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>')
  };

  function listMarkup(items, activeTitle) {
    return items.map((item) => '<button type="button" class="expert-ref-item' + (item.title === activeTitle ? ' active' : '') + '" data-expert-title="' + item.title + '"><strong>' + item.title + '</strong><span><time>' + item.date + '</time></span></button>').join('');
  }

  function reminderMarkup() {
    return reminders.map((item) => '<tr><td><span class="expert-ref-reminder"><i class="' + item[0] + '">▦</i><strong>' + item[1] + '</strong></span></td><td>' + item[2] + '</td><td>' + item[3] + '</td><td><span class="expert-ref-task-status ' + item[5] + '"><i></i>' + item[4] + '</span></td></tr>').join('');
  }

  function sourceFileMarkup(item) {
    return sourceFiles.map((file, index) => {
      const name = index === 0 ? item.title + '.pdf' : file[1];
      const label = file[0] === 'image' ? 'IMG' : file[0].toUpperCase();
      return '<button class="expert-ref-file-card" type="button" data-expert-file data-file-name="' + name + '" data-file-type="' + file[0] + '" data-preview-label="原始文件预览" aria-label="查看原始文件：' + name + '"><span class="file-icon ' + file[0] + '">' + label + '</span><span class="file-copy"><strong>' + name + '</strong><small>' + file[2] + '</small></span></button>';
    }).join('');
  }

  function detailMarkup(item) {
    const selectedReports = item.relatedReports || relatedReports.slice(0, 3).map((report) => report[0]);
    const visibleReports = relatedReports.filter((report) => selectedReports.includes(report[0]));
    const relatedSection = visibleReports.length
      ? '<section class="expert-ref-related"><header><h3>关联报告 <span>（' + visibleReports.length + '）</span></h3></header><div>' + visibleReports.map((r, i) => '<button class="expert-ref-related-card" type="button" data-expert-related-preview data-file-name="' + r[0] + '" data-file-type="report" data-preview-label="关联报告预览" aria-label="查看关联报告：' + r[0] + '"><span class="doc tone-' + i + '">▤</span><span><strong>' + r[0] + '</strong><time>' + r[1] + '</time></span></button>').join('') + '</div></section>'
      : '';
    return '<header class="expert-ref-header"><div><h2>' + item.title + '</h2></div><nav><button class="archive-parse-btn" data-expert-parse>解析报告<span class="archive-parse-badge show">5</span></button><button class="archive-upload-btn" data-expert-upload>' + icons.plus + '上传资料</button></nav></header>' +
      '<section class="expert-ref-basic"><header><h3>基本信息</h3><nav><button data-expert-edit>' + icons.edit + '编辑</button><button data-expert-delete>' + icons.trash + '删除</button></nav></header><dl><div><dt>名称</dt><dd>' + item.title + '</dd></div><div><dt>报告时间</dt><dd>' + item.date + '</dd></div><div><dt>备注</dt><dd>' + (item.note || defaultNote) + '</dd></div></dl></section>' +
      '<section class="expert-ref-files"><header><h3>原始文件</h3><span>共 5 个文件</span></header><div class="expert-ref-file-grid">' + sourceFileMarkup(item) + '</div></section>' +
      relatedSection +
      '<section class="expert-ref-ai"><header><div><span class="ai-badge">AI</span><h3>AI服务提醒</h3></div><p>提醒任务已自动生成，状态与任务中心同步</p></header><div class="expert-ref-table"><table><thead><tr><th>提醒事项</th><th>建议内容摘要</th><th>推荐提醒规则</th><th>任务状态</th></tr></thead><tbody>' + reminderMarkup() + '</tbody></table></div></section>' +
      '<p class="expert-ref-note">' + icons.info + '<span>提醒事项由系统根据专家资料自动生成，本页面仅展示任务内容及同步状态。</span></p>';
  }

  function init() {
    const panel = document.querySelector('[data-archive-panel="expert-reports"]');
    if (!panel) return;
    const archiveMain = document.querySelector('#patientArchivePage .archive-main');
    if (archiveMain) {
      ['reports', 'expert-reports', 'history'].forEach((name) => {
        const archivePanel = document.querySelector('[data-archive-panel="' + name + '"]');
        if (archivePanel && archivePanel.parentElement !== archiveMain) archiveMain.appendChild(archivePanel);
      });
    }
    panel.className = 'archive-panel expert-reference-panel';
    panel.innerHTML = '<div class="expert-reference" data-persistence-ignore><aside><label class="expert-ref-search"><input id="expertReferenceSearch" data-persistence-ignore type="search" autocomplete="off" placeholder="请输入专家资料名称" aria-label="搜索专家资料"><span>' + icons.search + '</span></label><div class="expert-ref-filters"><label><select id="expertReferenceTime" data-persistence-ignore aria-label="按报告时间筛选"><option value="all">全部时间</option><option value="3">近三个月</option><option value="1">近一个月</option></select><span>' + icons.down + '</span></label></div><div class="expert-ref-list"></div><div class="expert-ref-empty" hidden>暂无匹配的专家资料</div></aside><main class="expert-ref-detail"></main></div>';
    const list = panel.querySelector('.expert-ref-list');
    const detail = panel.querySelector('.expert-ref-detail');
    const search = panel.querySelector('.expert-ref-search input');
    const timeFilter = panel.querySelector('#expertReferenceTime');
    let active = suggestions[0];

    function render() {
      const keyword = search.value.trim();
      const months = Number(timeFilter.value);
      const latestDate = suggestions.reduce((latest, item) => item.date > latest ? item.date : latest, '');
      const cutoff = latestDate && months ? new Date(latestDate + 'T00:00:00') : null;
      if (cutoff) cutoff.setMonth(cutoff.getMonth() - months);
      const visible = suggestions.filter((item) => {
        const matchesKeyword = !keyword || item.title.includes(keyword);
        const matchesTime = !cutoff || new Date(item.date + 'T00:00:00') >= cutoff;
        return matchesKeyword && matchesTime;
      });
      if (!visible.includes(active)) active = visible[0] || suggestions[0];
      list.innerHTML = listMarkup(visible, active?.title || '');
      const empty = panel.querySelector('.expert-ref-empty');
      empty.textContent = keyword ? '暂无匹配的专家资料' : '该时间范围内暂无专家资料';
      empty.hidden = visible.length > 0;
      detail.innerHTML = visible.length ? detailMarkup(active) : '<div class="expert-ref-no-detail">调整左侧筛选条件后查看详情</div>';
    }

    function toast(text) {
      const node = document.getElementById('toast');
      if (!node) return;
      node.textContent = text;
      node.classList.add('show');
      clearTimeout(node.expertTimer);
      node.expertTimer = setTimeout(() => node.classList.remove('show'), 1600);
    }

    function expertParseRelatedMarkup(selected) {
      return relatedReports.map((report, index) => '<label><input type="checkbox" value="' + report[0] + '"' + (selected.includes(report[0]) ? ' checked' : '') + '><span>' + report[0] + '</span></label>').join('');
    }

    function expertParseItemMarkup(item, index) {
      const displayTime = item.time || '未识别';
      let body = '';
      if (item.status === 'running') {
        body = '<div class="archive-parse-loading"><span class="archive-parse-spinner"></span><span>' + item.text + '</span></div><div class="archive-parse-progress"><i></i></div>';
      } else if (item.status === 'pending') {
        body = '<div class="archive-parse-form expert-parse-form"><label class="archive-parse-field required"><span>名称</span><input data-expert-parse-name type="text" value="' + item.title + '" placeholder="请输入名称"></label><label class="archive-parse-field required"><span>报告时间</span><input data-expert-parse-time type="date" value="' + item.time + '" aria-label="选择报告时间"></label><fieldset class="expert-parse-related-field"><legend>关联报告 <em>非必填，可多选</em></legend><div>' + expertParseRelatedMarkup(item.related || []) + '</div></fieldset></div><div class="archive-parse-actions"><button class="archive-parse-primary" data-expert-parse-save="' + index + '">保存并归档</button></div>';
      } else if (item.status === 'done') {
        body = '<div class="expert-parse-complete-summary"><span>关联报告</span><strong>' + (item.related?.length ? item.related.join('、') : '未关联') + '</strong></div>';
      } else {
        body = '<div class="archive-parse-field"><span>失败原因</span><strong>' + item.reason + '</strong></div><div class="archive-parse-actions"><button class="archive-parse-primary" data-expert-parse-retry="' + index + '">重新解析</button></div>';
      }
      return '<article class="archive-parse-card" data-expert-parse-card="' + index + '"><div class="archive-parse-card-head"><div class="archive-parse-title"><strong>' + (item.title || '待补充资料') + '</strong>' + (item.status === 'running' ? '' : '<span>报告时间：' + displayTime + '</span>') + '</div><span class="archive-parse-status ' + item.status + '">' + expertParseStatusText[item.status] + '</span></div><div class="archive-parse-card-body">' + body + '</div></article>';
    }

    function renderExpertParseDrawer(tab) {
      const drawer = document.getElementById('archiveParseDrawer');
      const body = document.getElementById('archiveParseBody');
      if (!drawer || !body) return;
      drawer.classList.add('expert-parse-mode');
      drawer.querySelectorAll('[data-archive-parse-tab], [data-expert-parse-tab]').forEach((button) => {
        const value = button.dataset.expertParseTab || button.dataset.archiveParseTab;
        button.removeAttribute('data-archive-parse-tab');
        button.dataset.expertParseTab = value;
        button.classList.toggle('active', value === tab);
      });
      const rows = expertParseItems.map((item, index) => ({ item, index })).filter(({ item }) => tab === 'all' || item.status === tab);
      body.innerHTML = rows.length ? rows.map(({ item, index }) => expertParseItemMarkup(item, index)).join('') : '<div class="archive-parse-empty">暂无解析资料</div>';
    }

    function openFilePreview(trigger) {
      panel.querySelector('.expert-file-preview-mask')?.remove();
      const name = trigger.dataset.fileName || '原始文件';
      const type = trigger.dataset.fileType || 'pdf';
      const previewLabel = trigger.dataset.previewLabel || '资料预览';
      const previewBody = type === 'image'
        ? '<div class="expert-file-image-preview"><span>健康资料图片预览</span><i></i><i></i><i></i></div>'
        : '<div class="expert-file-paper-preview"><strong>' + name.replace(/\.[^.]+$/, '') + '</strong><span></span><span></span><span></span><span></span><span></span></div>';
      panel.insertAdjacentHTML('beforeend', '<div class="expert-file-preview-mask" data-expert-preview-close><section class="expert-file-preview-dialog" role="dialog" aria-modal="true" aria-label="资料预览"><header><div><span class="preview-type ' + type + '">' + (type === 'image' ? 'IMG' : type === 'report' ? 'RPT' : type.toUpperCase()) + '</span><div><h3>' + name + '</h3><p>' + previewLabel + '</p></div></div><button type="button" data-expert-preview-close aria-label="关闭资料预览">×</button></header><main>' + previewBody + '</main></section></div>');
    }

    function openEditDialog() {
      panel.querySelector('.expert-manage-mask')?.remove();
      const selectedReports = active.relatedReports || relatedReports.slice(0, 3).map((report) => report[0]);
      const reportOptions = relatedReports.map((report, index) => '<label><input type="checkbox" data-persistence-ignore data-expert-related-index="' + index + '"' + (selectedReports.includes(report[0]) ? ' checked' : '') + '><span>' + report[0] + '<small>' + report[1] + '</small></span></label>').join('');
      panel.insertAdjacentHTML('beforeend', '<div class="expert-manage-mask" data-persistence-ignore data-expert-manage-close><section class="expert-manage-dialog expert-edit-drawer" role="dialog" aria-modal="true" aria-labelledby="expertEditTitle"><header><h3 id="expertEditTitle">编辑专家资料</h3><button type="button" data-expert-manage-close aria-label="关闭编辑抽屉">×</button></header><div class="expert-manage-body"><div class="expert-edit-grid"><label><span><i>*</i>名称</span><input type="text" data-persistence-ignore data-expert-edit-name value="' + active.title + '" placeholder="请输入专家资料名称"></label><label><span><i>*</i>报告日期</span><input data-persistence-ignore data-expert-edit-date type="date" value="' + active.date + '"></label></div><fieldset><legend>关联报告 <small>支持多选，勾选添加，取消勾选删除</small></legend><div class="expert-edit-related">' + reportOptions + '</div></fieldset><label class="expert-edit-note"><span>备注说明</span><textarea data-persistence-ignore data-expert-edit-note rows="4" placeholder="请输入备注说明">' + (active.note || defaultNote) + '</textarea></label></div><footer><button type="button" data-expert-manage-close>取消</button><button class="primary" type="button" data-expert-edit-save>保存修改</button></footer></section></div>');
    }

    function openDeleteDialog() {
      panel.querySelector('.expert-manage-mask')?.remove();
      panel.insertAdjacentHTML('beforeend', '<div class="expert-manage-mask" data-expert-manage-close><section class="expert-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="expertDeleteTitle"><span class="expert-confirm-icon">!</span><h3 id="expertDeleteTitle">删除专家资料</h3><p>删除后将无法恢复，是否删除“' + active.title + '”？</p><footer><button type="button" data-expert-manage-close>取消</button><button class="danger" type="button" data-expert-delete-confirm>删除资料</button></footer></section></div>');
    }

    document.addEventListener('click', (event) => {
      const uploadTrigger = event.target.closest('[data-open-archive-upload]');
      if (uploadTrigger) {
        document.getElementById('archiveUploadModal')?.classList.remove('expert-upload-mode');
        const uploadTitle = document.getElementById('archiveUploadTitle');
        if (uploadTitle) uploadTitle.textContent = uploadTrigger.hasAttribute('data-expert-upload') ? '上传专家资料' : '上传病历资料';
      }
      const parseTrigger = event.target.closest('[data-archive-parse-report]');
      if (parseTrigger) {
        const parseTitle = document.getElementById('archiveParseTitle');
        if (parseTitle) parseTitle.textContent = parseTrigger.hasAttribute('data-expert-parse') ? '专家资料解析' : '报告解析';
      }
      const expertParseTab = event.target.closest('[data-expert-parse-tab]');
      if (expertParseTab) {
        renderExpertParseDrawer(expertParseTab.dataset.expertParseTab || 'all');
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const expertParseSave = event.target.closest('[data-expert-parse-save]');
      if (expertParseSave) {
        const card = expertParseSave.closest('[data-expert-parse-card]');
        const nameInput = card?.querySelector('[data-expert-parse-name]');
        const timeInput = card?.querySelector('[data-expert-parse-time]');
        if (!nameInput?.value.trim() || !timeInput?.value) {
          const missingInput = !nameInput?.value.trim() ? nameInput : timeInput;
          missingInput?.focus();
          missingInput?.closest('.archive-parse-field')?.classList.add('has-error');
          toast('请补充名称和报告时间');
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
        const item = expertParseItems[Number(expertParseSave.dataset.expertParseSave)];
        item.title = nameInput.value.trim();
        item.time = timeInput.value;
        item.related = Array.from(card.querySelectorAll('.expert-parse-related-field input:checked')).map((input) => input.value);
        item.status = 'done';
        renderExpertParseDrawer('done');
        toast('必填信息已补充，专家资料已归档');
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      const expertParseRetry = event.target.closest('[data-expert-parse-retry]');
      if (expertParseRetry) {
        expertParseItems[Number(expertParseRetry.dataset.expertParseRetry)].status = 'running';
        renderExpertParseDrawer('all');
        toast('已重新发起专家资料解析');
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    panel.addEventListener('click', (event) => {
      const closeManage = event.target.closest('[data-expert-manage-close]');
      if (closeManage && (event.target === closeManage || closeManage.tagName === 'BUTTON')) { panel.querySelector('.expert-manage-mask')?.remove(); return; }
      if (event.target.closest('[data-expert-edit-save]')) {
        const nameInput = panel.querySelector('[data-expert-edit-name]');
        const dateInput = panel.querySelector('[data-expert-edit-date]');
        const name = nameInput?.value.trim();
        if (!name) { nameInput?.focus(); toast('请输入专家资料名称'); return; }
        active.title = name;
        if (dateInput?.value) active.date = dateInput.value;
        active.note = panel.querySelector('[data-expert-edit-note]')?.value.trim() || '';
        active.relatedReports = Array.from(panel.querySelectorAll('[data-expert-related-index]:checked')).map((checkbox) => relatedReports[Number(checkbox.dataset.expertRelatedIndex)][0]);
        panel.querySelector('.expert-manage-mask')?.remove();
        render();
        toast('专家资料已更新');
        return;
      }
      if (event.target.closest('[data-expert-delete-confirm]')) {
        const index = suggestions.indexOf(active);
        if (index >= 0) suggestions.splice(index, 1);
        active = suggestions[Math.min(index, suggestions.length - 1)] || suggestions[0];
        panel.querySelector('.expert-manage-mask')?.remove();
        render();
        toast('专家资料已删除');
        return;
      }
      const closePreview = event.target.closest('[data-expert-preview-close]');
      if (closePreview && (event.target === closePreview || closePreview.tagName === 'BUTTON')) { panel.querySelector('.expert-file-preview-mask')?.remove(); return; }
      const sourceFile = event.target.closest('[data-expert-file]');
      if (sourceFile) { openFilePreview(sourceFile); return; }
      const relatedReport = event.target.closest('[data-expert-related-preview]');
      if (relatedReport) { openFilePreview(relatedReport); return; }
      const item = event.target.closest('[data-expert-title]');
      if (item) { active = suggestions.find((entry) => entry.title === item.dataset.expertTitle) || active; render(); return; }
      if (event.target.closest('[data-expert-upload]')) {
        const uploadModal = document.getElementById('archiveUploadModal');
        const uploadTitle = document.getElementById('archiveUploadTitle');
        if (uploadTitle) uploadTitle.textContent = '上传专家资料';
        uploadModal?.classList.add('expert-upload-mode');
        uploadModal?.classList.add('open');
        uploadModal?.setAttribute('aria-hidden', 'false');
        return;
      }
      if (event.target.closest('[data-expert-parse]')) {
        const archiveParseTrigger = document.querySelector('[data-archive-parse-report]');
        if (archiveParseTrigger) {
          archiveParseTrigger.click();
          window.setTimeout(() => {
            const parseTitle = document.getElementById('archiveParseTitle');
            if (parseTitle) parseTitle.textContent = '专家资料解析';
            renderExpertParseDrawer('all');
          }, 0);
        }
        return;
      }
      if (event.target.closest('[data-expert-edit]')) openEditDialog();
      else if (event.target.closest('[data-expert-delete]')) openDeleteDialog();
    });
    search.addEventListener('input', render);
    timeFilter.addEventListener('change', render);
    render();

    if (window.location.hash === '#expert-report') {
      window.setTimeout(() => {
        document.querySelector('.submenu-item[data-list-view="patients"]')?.click();
        window.setTimeout(() => {
          const patientEntry = document.querySelector('[data-open-patient-record="1313"]') || document.querySelector('[data-open-patient-record]');
          patientEntry?.click();
          window.setTimeout(() => {
            search.value = '';
            render();
            document.querySelector('[data-archive-tab="customer-service"]')?.click();
            document.querySelector('[data-customer-section="expert"]')?.click();
          }, 80);
        }, 0);
      }, 0);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

