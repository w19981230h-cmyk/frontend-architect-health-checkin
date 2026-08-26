(function () {
  if (window.__knowledgeBaseInitialized) return;
  window.__knowledgeBaseInitialized = true;

  const rows = [
    { name: '医保卡知识', intro: '医保政策、报销范围及办理流程相关知识', tag: '医保政策', count: '12 份', updated: '2025-08-21 16:30' },
    { name: '健康饮食知识库', intro: '健康饮食、营养搭配及注意事项相关知识', tag: '健康宣教', count: '28 份', updated: '2025-08-20 15:10' },
    { name: 'CKD疾病知识库', intro: 'CKD疾病诊疗、护理及管理相关知识', tag: '疾病知识', count: '26 份', updated: '2025-08-19 09:45' },
    { name: '医院管理制度', intro: '医院各类管理制度及规范流程相关知识', tag: '医院制度', count: '18 份', updated: '2025-08-18 11:20' },
    { name: '就诊流程指引', intro: '患者就诊全流程指引及注意事项', tag: '就诊指引', count: '15 份', updated: '2025-08-17 17:05' }
  ];
  const knowledgeFiles = {
    '医保卡知识': [
      { name: '医保报销政策.pdf', type: 'PDF', size: '2.4MB', updated: '2026-08-25 15:20' },
      { name: '异地医保办理指南.docx', type: 'DOCX', size: '1.8MB', updated: '2026-08-23 10:12' },
      { name: '门诊医保流程.pdf', type: 'PDF', size: '860KB', updated: '2026-08-20 09:30' },
      { name: '医保常见问题.txt', type: 'TXT', size: '120KB', updated: '2026-08-18 16:40' }
    ]
  };

  const style = document.createElement('style');
  style.id = 'knowledgeBaseStyles';
  style.textContent = `
    .knowledge-base-view { padding: 14px; }
    .knowledge-base-view .knowledge-toolbar { flex: 0 0 48px; }
    .knowledge-base-view .knowledge-search { width: 230px; }
    .knowledge-tag-filter { position: relative; height: 36px; }
    .knowledge-tag-filter::after { content: ''; position: absolute; right: 13px; top: 12px; width: 7px; height: 7px; border-right: 1.5px solid #657188; border-bottom: 1.5px solid #657188; transform: rotate(45deg); pointer-events: none; }
    .knowledge-tag-filter select { width: 164px; height: 36px; padding: 0 34px 0 11px; border: 1px solid #e6eaf1; border-radius: 4px; color: #526078; background: #fff; appearance: none; transition: border-color .2s, box-shadow .2s; }
    .knowledge-tag-filter select:hover { border-color: #4096ff; }
    .knowledge-tag-filter select:focus-visible { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
    .knowledge-base-view .knowledge-create { margin-left: auto; }
    .knowledge-table-wrap { flex: 1; min-height: 0; overflow: hidden; }
    .knowledge-table th, .knowledge-table td { padding-inline: 12px; }
    .knowledge-name-cell { min-width: 0; color: #25324a; font-weight: 600; }
    .knowledge-content-tag { min-height: 22px; padding: 2px 9px; display: inline-flex; align-items: center; border-radius: 5px; font-size: 13px; line-height: 18px; }
    .knowledge-content-tag.blue { color: #2b6ae2; background: #eaf2ff; }
    .knowledge-content-tag.green { color: #15945b; background: #e9f8f0; }
    .knowledge-content-tag.purple { color: #7050d8; background: #f0edff; }
    .knowledge-content-tag.orange { color: #e58c16; background: #fff5e6; }
    .knowledge-content-tag.cyan { color: #159897; background: #e9f8f8; }
    .knowledge-row-actions { display: inline-flex; align-items: center; gap: 12px; white-space: nowrap; }
    .knowledge-row-action { color: #3154ff; font-size: 14px; font-weight: 500; }
    .knowledge-row-action:hover { color: #173ee6; }
    .knowledge-row-action.danger { color: #ff4d4f; }
    .knowledge-row-action.danger:hover { color: #d9363e; }
    .knowledge-row-action:focus-visible { outline: 2px solid rgba(49,84,255,.25); outline-offset: 2px; border-radius: 2px; }
    .knowledge-empty { height: 220px; text-align: center; color: #9aa5b4; }
    .knowledge-pager { flex: 0 0 58px; }
    .list-main.knowledge-detail-main { padding: 0; background: #f4f7fc; }
    .list-main.knowledge-detail-main > .page-title { display: none; }
    .knowledge-detail-view { padding: 0; gap: 20px; overflow: auto; border-radius: 0; background: transparent; box-shadow: none; }
    .knowledge-detail-summary { min-height: 222px; padding: 36px 30px 28px; flex: 0 0 auto; border: 1px solid #e0e8f4; border-top: 0; border-radius: 0 0 10px 10px; background: #fff; }
    .knowledge-detail-hero { display: flex; align-items: flex-start; gap: 26px; }
    .knowledge-detail-icon { position: relative; width: 74px; height: 74px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 13px; color: #fff; background: linear-gradient(145deg, #2769ed, #438dff); box-shadow: 0 9px 20px rgba(42,107,238,.18); }
    .knowledge-detail-icon::after { content: ''; position: absolute; right: -4px; bottom: -5px; width: 30px; height: 30px; border-radius: 8px; background: rgba(58,132,255,.55); filter: blur(9px); }
    .knowledge-detail-icon svg { position: relative; z-index: 1; width: 38px; height: 38px; }
    .knowledge-detail-heading { min-width: 0; flex: 1; }
    .knowledge-detail-heading h1 { margin: 0; color: #111d32; font-size: 29px; line-height: 38px; font-weight: 700; }
    .knowledge-detail-heading p { margin: 8px 0 0; color: #1d2b43; font-size: 17px; line-height: 26px; }
    .knowledge-detail-edit { height: 48px; padding: 0 18px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid #1763ff; border-radius: 8px; color: #175cf3; background: #fff; font-size: 16px; font-weight: 500; transition: color .2s, background .2s, border-color .2s; }
    .knowledge-detail-edit:hover { color: #0f49cc; border-color: #0f49cc; background: #f5f8ff; }
    .knowledge-detail-edit svg { width: 20px; height: 20px; }
    .knowledge-detail-meta { margin-top: 37px; display: flex; align-items: center; gap: 0; color: #17243a; font-size: 17px; }
    .knowledge-detail-meta-item { min-height: 30px; padding: 0 31px; display: inline-flex; align-items: center; gap: 12px; border-left: 1px solid #dfe6f0; }
    .knowledge-detail-meta-item:first-child { padding-left: 0; border-left: 0; }
    .knowledge-detail-meta-label { font-weight: 500; }
    .knowledge-detail-tag { padding: 4px 12px; border-radius: 8px; color: #1762e8; background: #edf4ff; font-size: 15px; }
    .knowledge-detail-content { min-height: 520px; padding: 30px; flex: 1 0 auto; display: flex; flex-direction: column; border: 1px solid #e0e8f4; border-radius: 10px 10px 0 0; background: #fff; }
    .knowledge-detail-section-title { margin: 0 0 28px; color: #111d32; font-size: 21px; line-height: 28px; font-weight: 700; }
    .knowledge-file-toolbar { min-height: 48px; display: flex; align-items: flex-start; gap: 18px; }
    .knowledge-file-search { width: 312px; height: 48px; padding: 0 16px; display: flex; align-items: center; gap: 10px; border: 1px solid #d8e0eb; border-radius: 7px; background: #fff; transition: border-color .2s, box-shadow .2s; }
    .knowledge-file-search:hover { border-color: #4096ff; }
    .knowledge-file-search:focus-within { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
    .knowledge-file-search input { width: 100%; min-width: 0; border: 0; background: transparent; font-size: 16px; }
    .knowledge-file-search input::placeholder { color: #a3adbd; }
    .knowledge-file-search svg { width: 21px; height: 21px; flex: 0 0 auto; color: #122c58; }
    .knowledge-file-type { position: relative; height: 48px; }
    .knowledge-file-type::after { content: ''; position: absolute; right: 18px; top: 18px; width: 8px; height: 8px; border-right: 1.5px solid #263c61; border-bottom: 1.5px solid #263c61; transform: rotate(45deg); pointer-events: none; }
    .knowledge-file-type select { width: 236px; height: 48px; padding: 0 42px 0 18px; border: 1px solid #d8e0eb; border-radius: 7px; color: #1a2a43; background: #fff; appearance: none; font-size: 16px; }
    .knowledge-file-upload { margin-left: auto; height: 48px; padding: 0 20px; display: inline-flex; align-items: center; gap: 10px; border-radius: 7px; color: #fff; background: #1762f1; font-size: 16px; font-weight: 500; box-shadow: 0 5px 12px rgba(23,98,241,.18); }
    .knowledge-file-upload:hover { background: #0f4fd0; }
    .knowledge-file-upload svg { width: 21px; height: 21px; }
    .knowledge-file-table-wrap { margin-top: 28px; overflow: hidden; }
    .knowledge-file-table { width: 100%; table-layout: fixed; border-collapse: collapse; color: #1b2a42; }
    .knowledge-file-table thead tr { height: 60px; background: #f6f8fb; }
    .knowledge-file-table th { padding: 0 22px; color: #1d2b43; font-size: 16px; font-weight: 500; }
    .knowledge-file-table tbody tr { height: 84px; border-bottom: 1px solid #e4e9f1; }
    .knowledge-file-table td { padding: 0 22px; color: #1e2d46; font-size: 16px; }
    .knowledge-file-name { display: flex; align-items: center; gap: 22px; font-weight: 500; }
    .knowledge-file-icon { position: relative; width: 32px; height: 38px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 4px; color: #fff; font-size: 17px; line-height: 1; box-shadow: 0 4px 8px rgba(30,64,120,.12); }
    .knowledge-file-icon::after { content: ''; position: absolute; right: 0; top: 0; border-top: 8px solid rgba(255,255,255,.82); border-left: 8px solid transparent; }
    .knowledge-file-icon.pdf { background: linear-gradient(145deg, #ed4c43, #cf271e); }
    .knowledge-file-icon.docx { background: linear-gradient(145deg, #4286f4, #1858c8); }
    .knowledge-file-icon.txt { background: linear-gradient(145deg, #55a1f7, #2184e8); }
    .knowledge-file-more { width: 32px; height: 32px; display: inline-grid; place-items: center; border-radius: 5px; color: #203b65; font-size: 20px; letter-spacing: 2px; }
    .knowledge-file-more:hover { color: #175cf3; background: #eef4ff; }
    .knowledge-file-empty { height: 220px; text-align: center; color: #8e9aab; }
    .knowledge-file-footer { min-height: 78px; margin-top: auto; padding-top: 30px; display: flex; align-items: center; color: #263650; font-size: 16px; }
    .knowledge-file-pagination { margin-left: auto; display: flex; align-items: center; gap: 12px; }
    .knowledge-file-page { width: 44px; height: 46px; display: inline-grid; place-items: center; border: 1px solid #d8e0eb; border-radius: 7px; color: #9eacbe; background: #fff; font-size: 22px; }
    .knowledge-file-page.active { color: #fff; border-color: #1762f1; background: #1762f1; font-size: 16px; }
    .knowledge-file-size { width: 170px; height: 46px; padding: 0 16px; border: 1px solid #d8e0eb; border-radius: 7px; color: #263650; background: #fff; font-size: 16px; }
    .knowledge-detail-edit:focus-visible, .knowledge-file-upload:focus-visible, .knowledge-file-more:focus-visible, .knowledge-file-page:focus-visible { outline: 2px solid rgba(23,98,241,.3); outline-offset: 2px; }
    .list-main.knowledge-detail-main { padding: 14px; background: #f2f5ff; }
    .knowledge-detail-view { gap: 14px; font-size: 14px; }
    .knowledge-detail-view button, .knowledge-detail-view input, .knowledge-detail-view select, .knowledge-detail-view table { font-size: 14px; }
    .knowledge-detail-page-header { min-height: 30px; flex: 0 0 30px; display: flex; align-items: center; gap: 8px; color: #263752; font-size: 14px; font-weight: 700; }
    .knowledge-detail-back { width: 30px; height: 30px; display: inline-grid; place-items: center; border-radius: 4px; color: #526078; background: #fff; transition: color .2s, background .2s; }
    .knowledge-detail-back:hover { color: #3154ff; background: #eaf1ff; }
    .knowledge-detail-back:focus-visible { outline: 2px solid rgba(49,84,255,.25); outline-offset: 2px; }
    .knowledge-detail-back svg { width: 16px; height: 16px; }
    .knowledge-detail-summary { min-height: 136px; padding: 14px; border: 0; border-radius: 8px; }
    .knowledge-detail-hero { gap: 14px; }
    .knowledge-detail-icon { width: 48px; height: 48px; border-radius: 8px; }
    .knowledge-detail-icon svg { width: 26px; height: 26px; }
    .knowledge-detail-heading h1 { font-size: 14px; line-height: 22px; }
    .knowledge-detail-heading p { margin-top: 4px; font-size: 14px; line-height: 22px; }
    .knowledge-detail-edit { height: 36px; padding: 0 14px; gap: 8px; border-radius: 4px; font-size: 14px; }
    .knowledge-detail-edit svg { width: 16px; height: 16px; }
    .knowledge-detail-meta { margin-top: 14px; font-size: 14px; }
    .knowledge-detail-meta-item { min-height: 28px; padding: 0 14px; gap: 8px; }
    .knowledge-detail-tag { padding: 2px 8px; border-radius: 5px; font-size: 14px; }
    .knowledge-detail-content { min-height: 420px; padding: 14px; border: 0; border-radius: 8px; }
    .knowledge-detail-section-title { margin-bottom: 14px; font-size: 14px; line-height: 22px; }
    .knowledge-file-toolbar { min-height: 48px; gap: 14px; }
    .knowledge-file-search { width: 230px; height: 36px; padding: 0 11px; gap: 8px; border-radius: 4px; }
    .knowledge-file-search input { font-size: 14px; }
    .knowledge-file-search svg { width: 16px; height: 16px; }
    .knowledge-file-type { height: 36px; }
    .knowledge-file-type::after { right: 13px; top: 12px; width: 7px; height: 7px; }
    .knowledge-file-type select { width: 164px; height: 36px; padding: 0 34px 0 11px; border-radius: 4px; font-size: 14px; }
    .knowledge-file-upload { height: 36px; padding: 0 14px; gap: 8px; border-radius: 4px; font-size: 14px; }
    .knowledge-file-upload svg { width: 16px; height: 16px; }
    .knowledge-file-table-wrap { margin-top: 0; }
    .knowledge-file-table thead tr { height: 48px; }
    .knowledge-file-table th, .knowledge-file-table td { padding: 0 12px; font-size: 14px; }
    .knowledge-file-table tbody tr { height: 51px; }
    .knowledge-file-name { gap: 14px; }
    .knowledge-file-icon { width: 28px; height: 32px; font-size: 14px; }
    .knowledge-file-more { width: 30px; height: 30px; font-size: 18px; }
    .knowledge-file-footer { min-height: 58px; padding-top: 14px; font-size: 14px; }
    .knowledge-file-pagination { gap: 8px; }
    .knowledge-file-page { width: 30px; height: 30px; border-radius: 4px; font-size: 14px; }
    .knowledge-file-page.active { font-size: 14px; }
    .knowledge-file-size { width: 96px; height: 30px; padding: 0 10px; border-radius: 4px; font-size: 14px; }
    .knowledge-toast { position: fixed; left: 50%; top: 24px; z-index: 12000; padding: 10px 16px; border: 1px solid #dce5f5; border-radius: 7px; color: #233650; background: #fff; box-shadow: 0 8px 24px rgba(32,52,85,.16); transform: translate(-50%, -16px); opacity: 0; pointer-events: none; transition: opacity .2s, transform .2s; }
    .knowledge-toast.show { opacity: 1; transform: translate(-50%, 0); }
    @media (max-width: 1180px) { .knowledge-base-view .knowledge-search { width: 200px; } .knowledge-tag-filter select { width: 148px; } .knowledge-detail-summary, .knowledge-detail-content { padding-inline: 14px; } .knowledge-file-search { width: 200px; } .knowledge-file-type select { width: 148px; } }
    @media (prefers-reduced-motion: reduce) { .knowledge-base-view * { transition: none !important; } }
  `;
  document.head.appendChild(style);

  const tagOptions = [...new Set(rows.map(row => row.tag))].map(tag => `<option value="${tag}">${tag}</option>`).join('');
  const view = document.createElement('section');
  view.className = 'list-panel list-view knowledge-base-view';
  view.id = 'knowledgeBaseView';
  view.setAttribute('aria-label', '知识库');
  view.setAttribute('data-persistence-ignore', '');
  view.innerHTML = `
    <div class="toolbar knowledge-toolbar">
      <label class="search knowledge-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input id="knowledgeSearch" data-persistence-ignore autocomplete="off" placeholder="搜索知识库名称" aria-label="搜索知识库名称"></label>
      <label class="knowledge-tag-filter"><select id="knowledgeTagFilter" data-persistence-ignore aria-label="内容标签"><option value="">全部内容标签</option>${tagOptions}</select></label>
      <button class="primary knowledge-create" type="button" data-create-knowledge><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg><span>创建知识库</span></button>
    </div>
    <div class="table-wrap knowledge-table-wrap">
      <table class="knowledge-table">
        <colgroup><col style="width:18%"><col style="width:29%"><col style="width:11%"><col style="width:8%"><col style="width:12%"><col style="width:22%"></colgroup>
        <thead><tr><th>知识库名称</th><th>知识库简介</th><th>内容标签</th><th>内容数量</th><th>最近更新时间</th><th>操作</th></tr></thead>
        <tbody id="knowledgeRows"></tbody>
      </table>
    </div>
    <div class="pager knowledge-pager"><span id="knowledgeTotal">共 5 条</span><button class="page-btn disabled" type="button" aria-label="上一页">‹</button><button class="page-btn active" type="button">1</button><button class="page-btn disabled" type="button" aria-label="下一页">›</button><button class="page-select" type="button">10 条/页⌄</button></div>
    <div class="knowledge-toast" id="knowledgeToast" role="status" aria-live="polite"></div>`;
  document.querySelector('#listPage .list-main')?.appendChild(view);

  const detailView = document.createElement('section');
  detailView.className = 'list-panel list-view knowledge-detail-view';
  detailView.id = 'knowledgeDetailView';
  detailView.setAttribute('aria-label', '知识库详情');
  detailView.setAttribute('data-persistence-ignore', '');
  detailView.innerHTML = `
    <header class="knowledge-detail-page-header"><button class="knowledge-detail-back" type="button" data-back-knowledge-list aria-label="返回知识库首页" title="返回知识库首页"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m15 18-6-6 6-6"/></svg></button><span>知识库详情</span></header>
    <section class="knowledge-detail-summary">
      <div class="knowledge-detail-hero">
        <span class="knowledge-detail-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><rect x="8" y="14" width="32" height="25" rx="4" fill="white"/><path d="M13 14V11a4 4 0 0 1 4-4h7l4 4h7a4 4 0 0 1 4 4" fill="white" opacity=".9"/><rect x="19" y="23" width="10" height="3" rx="1.5" fill="#367bf5"/></svg></span>
        <div class="knowledge-detail-heading"><h1 id="knowledgeDetailName">医保卡知识</h1><p id="knowledgeDetailIntro">医保政策及办理流程相关知识</p></div>
        <button class="knowledge-detail-edit" type="button" data-edit-current-knowledge><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m4 16-1 5 5-1L19 9l-4-4Z"/><path d="m13 7 4 4M10 21h11"/></svg>编辑知识库</button>
      </div>
      <div class="knowledge-detail-meta">
        <span class="knowledge-detail-meta-item"><span class="knowledge-detail-meta-label">内容标签：</span><span class="knowledge-detail-tag" id="knowledgeDetailTag">医保政策</span></span>
        <span class="knowledge-detail-meta-item"><span class="knowledge-detail-meta-label">内容数量：</span><span id="knowledgeDetailCount">12 份</span></span>
        <span class="knowledge-detail-meta-item"><span class="knowledge-detail-meta-label">最近更新：</span><span id="knowledgeDetailUpdated">2026-08-25 16:30</span></span>
      </div>
    </section>
    <section class="knowledge-detail-content">
      <h2 class="knowledge-detail-section-title">知识内容</h2>
      <div class="knowledge-file-toolbar">
        <label class="knowledge-file-search"><input id="knowledgeFileSearch" data-persistence-ignore autocomplete="off" placeholder="搜索文件名称" aria-label="搜索文件名称"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg></label>
        <label class="knowledge-file-type"><select id="knowledgeFileType" data-persistence-ignore aria-label="文件类型"><option value="">文件类型：全部</option><option value="PDF">文件类型：PDF</option><option value="DOCX">文件类型：DOCX</option><option value="TXT">文件类型：TXT</option></select></label>
        <button class="knowledge-file-upload" type="button" data-upload-knowledge-file><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 16V4M7 9l5-5 5 5M5 15v5h14v-5"/></svg>上传文件</button>
      </div>
      <div class="knowledge-file-table-wrap">
        <table class="knowledge-file-table"><colgroup><col style="width:33%"><col style="width:15%"><col style="width:18%"><col style="width:24%"><col style="width:10%"></colgroup><thead><tr><th>文件名称</th><th>类型</th><th>大小</th><th>最近更新时间</th><th>操作</th></tr></thead><tbody id="knowledgeFileRows"></tbody></table>
      </div>
      <div class="knowledge-file-footer"><span id="knowledgeFileTotal">共 4 条</span><div class="knowledge-file-pagination"><button class="knowledge-file-page" type="button" disabled aria-label="上一页">‹</button><button class="knowledge-file-page active" type="button">1</button><button class="knowledge-file-page" type="button" disabled aria-label="下一页">›</button><select class="knowledge-file-size" aria-label="每页文件数"><option>20 条/页</option><option>50 条/页</option></select></div></div>
    </section>`;
  document.querySelector('#listPage .list-main')?.appendChild(detailView);
  document.querySelector('#listPage .list-main')?.appendChild(document.getElementById('knowledgeToast'));

  function tagClass(tag) {
    if (tag === '健康宣教') return 'purple';
    if (tag === '医院制度') return 'orange';
    if (tag === '就诊指引') return 'cyan';
    if (tag === '医保政策') return 'green';
    return 'blue';
  }

  function filesForKnowledge(row) {
    return knowledgeFiles[row.name] || [
      { name: `${row.name}说明.pdf`, type: 'PDF', size: '1.6MB', updated: row.updated },
      { name: `${row.tag}工作指引.docx`, type: 'DOCX', size: '980KB', updated: row.updated },
      { name: `${row.name}常见问题.txt`, type: 'TXT', size: '86KB', updated: row.updated }
    ];
  }

  function fileIcon(file) {
    const label = file.type === 'DOCX' ? 'W' : file.type === 'TXT' ? 'T' : '⌁';
    return `<span class="knowledge-file-icon ${file.type.toLowerCase()}">${label}</span>`;
  }

  function renderKnowledgeFiles() {
    const row = rows.find(item => item.name === detailView.dataset.knowledgeName) || rows[0];
    const keyword = document.getElementById('knowledgeFileSearch')?.value.trim().toLowerCase() || '';
    const type = document.getElementById('knowledgeFileType')?.value || '';
    const filtered = filesForKnowledge(row).filter(file => (!keyword || file.name.toLowerCase().includes(keyword)) && (!type || file.type === type));
    document.getElementById('knowledgeFileTotal').textContent = `共 ${filtered.length} 条`;
    document.getElementById('knowledgeFileRows').innerHTML = filtered.length ? filtered.map(file => `<tr><td><div class="knowledge-file-name">${fileIcon(file)}<span title="${file.name}">${file.name}</span></div></td><td>${file.type}</td><td>${file.size}</td><td>${file.updated}</td><td><button class="knowledge-file-more" type="button" data-knowledge-file-more="${file.name}" aria-label="${file.name}更多操作">···</button></td></tr>`).join('') : '<tr><td class="knowledge-file-empty" colspan="5">暂无符合条件的文件，请调整文件名称或类型</td></tr>';
  }

  function openKnowledgeDetail(name) {
    const row = rows.find(item => item.name === name);
    if (!row) return;
    detailView.dataset.knowledgeName = row.name;
    document.getElementById('knowledgeDetailName').textContent = row.name;
    document.getElementById('knowledgeDetailIntro').textContent = row.name === '医保卡知识' ? '医保政策及办理流程相关知识' : row.intro;
    document.getElementById('knowledgeDetailTag').textContent = row.tag;
    document.getElementById('knowledgeDetailCount').textContent = row.count;
    document.getElementById('knowledgeDetailUpdated').textContent = row.name === '医保卡知识' ? '2026-08-25 16:30' : row.updated;
    document.getElementById('knowledgeFileSearch').value = '';
    document.getElementById('knowledgeFileType').value = '';
    document.querySelectorAll('#listPage .list-main > .list-view').forEach(panel => panel.classList.toggle('active', panel === detailView));
    document.querySelector('#listPage .list-main')?.classList.add('knowledge-detail-main');
    document.getElementById('listPageTitle').textContent = '知识库详情';
    renderKnowledgeFiles();
    detailView.scrollTop = 0;
  }

  function returnToKnowledgeList() {
    document.querySelectorAll('#listPage .list-main > .list-view').forEach(panel => panel.classList.toggle('active', panel === view));
    document.querySelector('#listPage .list-main')?.classList.remove('knowledge-detail-main');
    document.getElementById('listPageTitle').textContent = '知识库';
    view.scrollTop = 0;
  }

  function render() {
    const keyword = document.getElementById('knowledgeSearch')?.value.trim().toLowerCase() || '';
    const tag = document.getElementById('knowledgeTagFilter')?.value || '';
    const filtered = rows.filter(row => (!keyword || row.name.toLowerCase().includes(keyword)) && (!tag || row.tag === tag));
    document.getElementById('knowledgeTotal').textContent = `共 ${filtered.length} 条`;
    document.getElementById('knowledgeRows').innerHTML = filtered.length ? filtered.map(row => `
      <tr><td><div class="knowledge-name-cell"><span title="${row.name}">${row.name}</span></div></td>
      <td title="${row.intro}">${row.intro}</td><td><span class="knowledge-content-tag ${tagClass(row.tag)}">${row.tag}</span></td>
      <td>${row.count}</td><td>${row.updated}</td><td><span class="knowledge-row-actions"><button class="knowledge-row-action" type="button" data-edit-knowledge="${row.name}">编辑</button><button class="knowledge-row-action" type="button" data-view-knowledge="${row.name}">详情</button><button class="knowledge-row-action danger" type="button" data-delete-knowledge="${row.name}">删除</button></span></td></tr>`).join('') : '<tr><td class="knowledge-empty" colspan="6">暂无符合条件的知识库，请调整搜索或内容标签</td></tr>';
  }

  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('knowledgeToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  view.addEventListener('input', event => {
    if (event.target.matches('#knowledgeSearch')) render();
  });
  view.addEventListener('change', event => {
    if (event.target.matches('#knowledgeTagFilter')) render();
  });
  view.addEventListener('click', event => {
    if (event.target.closest('[data-create-knowledge]')) return showToast('已进入创建知识库流程');
    const editAction = event.target.closest('[data-edit-knowledge]');
    if (editAction) return showToast(`正在编辑“${editAction.dataset.editKnowledge}”`);
    const viewAction = event.target.closest('[data-view-knowledge]');
    if (viewAction) return openKnowledgeDetail(viewAction.dataset.viewKnowledge);
    const deleteAction = event.target.closest('[data-delete-knowledge]');
    if (deleteAction) {
      const name = deleteAction.dataset.deleteKnowledge;
      if (!window.confirm(`确认删除知识库“${name}”吗？删除后不可恢复。`)) return;
      const index = rows.findIndex(row => row.name === name);
      if (index >= 0) rows.splice(index, 1);
      render();
      showToast(`已删除“${name}”`);
    }
  });

  detailView.addEventListener('input', event => {
    if (event.target.matches('#knowledgeFileSearch')) renderKnowledgeFiles();
  });
  detailView.addEventListener('change', event => {
    if (event.target.matches('#knowledgeFileType')) renderKnowledgeFiles();
  });
  detailView.addEventListener('click', event => {
    const currentName = detailView.dataset.knowledgeName || '知识库';
    if (event.target.closest('[data-back-knowledge-list]')) return returnToKnowledgeList();
    if (event.target.closest('[data-edit-current-knowledge]')) return showToast(`正在编辑“${currentName}”`);
    if (event.target.closest('[data-upload-knowledge-file]')) return showToast(`正在为“${currentName}”上传文件`);
    const fileMore = event.target.closest('[data-knowledge-file-more]');
    if (fileMore) return showToast(`可预览、下载或删除“${fileMore.dataset.knowledgeFileMore}”`);
  });

  document.addEventListener('click', event => {
    const menuEntry = event.target.closest('#listPage .menu [data-list-view], #listPage .menu [data-service-view], #listPage .menu [data-patient-team-list]');
    if (!menuEntry) return;
    detailView.classList.remove('active');
    document.querySelector('#listPage .list-main')?.classList.remove('knowledge-detail-main');
  });

  render();
})();
