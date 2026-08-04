(function () {
  if (window.__transactionRecordPageV2Loaded) return;
  window.__transactionRecordPageV2Loaded = true;

  const PAGE_ID = 'transaction-record-page-v2';
  const STYLE_ID = 'transaction-record-page-v2-style';
  const HASH = '#transaction-records';

  const rows = Array.from({ length: 9 }, (_, index) => ({
    transactionNo: '12114114',
    externalNo: '124114410',
    channel: '微信支付',
    type: '收入',
    amount: '1124.00',
    orderTime: '2026/02/05 13:30:15',
    orderNo: '1551812111',
    serviceName: '冠心病出院健康服务...'
  }));

  const navGroups = [
    { icon: 'monitor', label: '工作台' },
    { icon: 'task', label: '任务管理', arrow: true },
    { icon: 'patient', label: '患者管理', arrow: true },
    { icon: 'plan', label: '方案管理', arrow: true },
    { icon: 'operate', label: '运营管理', arrow: true },
    { icon: 'ai', label: 'AI 客服', arrow: true },
    { icon: 'setting', label: '系统设置', arrow: true },
    {
      icon: 'service',
      label: '服务管理',
      arrow: true,
      children: ['服务包管理', '订单管理', '交易记录']
    }
  ];

  function icon(name) {
    const common = 'width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    const paths = {
      monitor: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M9 20h6M12 16v4"/>',
      task: '<path d="M8 5h10v14H6V7a2 2 0 0 1 2-2z"/><path d="M9 9h6M9 13h5"/>',
      patient: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
      plan: '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
      operate: '<path d="M5 17a7 7 0 1 1 14 0"/><path d="M7 17h10M12 10v7"/>',
      ai: '<path d="M12 3l2.2 5 5.3.5-4 3.6 1.2 5.2L12 14.6 7.3 17.3l1.2-5.2-4-3.6 5.3-.5L12 3z"/>',
      setting: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.8 1.8 0 0 0-2 .1 1.7 1.7 0 0 0-.8 1.6V22H9.2v-.1a1.7 1.7 0 0 0-.8-1.6 1.8 1.8 0 0 0-2-.1l-.2.1-2-3.4.1-.1a1.7 1.7 0 0 0 .3-1.9 1.8 1.8 0 0 0-1.5-1H3V10h.1a1.8 1.8 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.8 1.8 0 0 0 2-.1A1.7 1.7 0 0 0 9.2 2V2h5.6v.1a1.7 1.7 0 0 0 .8 1.6 1.8 1.8 0 0 0 2 .1l.2-.1 2 3.4-.1.1a1.7 1.7 0 0 0-.3 1.9 1.8 1.8 0 0 0 1.5 1h.1v4h-.1a1.8 1.8 0 0 0-1.5 1z"/>',
      service: '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 8h8M8 12h8M10 16h4"/>',
      bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M10 20a2 2 0 0 0 4 0"/>',
      menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
      chevron: '<path d="M9 18l6-6-6-6"/>'
    };
    return `<svg ${common}>${paths[name] || paths.task}</svg>`;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      body.transaction-record-v2-active {
        margin: 0;
        overflow: hidden;
        background: #f4f7ff;
      }
      body.transaction-record-v2-active > *:not(#${PAGE_ID}):not(script):not(style) {
        display: none !important;
      }
      #${PAGE_ID} {
        position: fixed;
        inset: 0;
        z-index: 2147483000;
        display: flex;
        min-width: 1200px;
        color: #14233f;
        background: #f4f7ff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", Arial, sans-serif;
      }
      #${PAGE_ID} * {
        box-sizing: border-box;
      }
      .tr-sidebar {
        width: 230px;
        height: 100vh;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        background: #fff;
        border-right: 1px solid #e6edf8;
      }
      .tr-logo {
        height: 72px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 30px;
        border-bottom: 1px solid #eef2f8;
        color: #0d2a63;
        font-size: 18px;
        font-weight: 800;
        letter-spacing: .2px;
      }
      .tr-logo-mark {
        width: 32px;
        height: 24px;
        position: relative;
        display: inline-block;
      }
      .tr-logo-mark::before,
      .tr-logo-mark::after {
        content: "";
        position: absolute;
        border-radius: 14px;
      }
      .tr-logo-mark::before {
        left: 0;
        top: 2px;
        width: 22px;
        height: 18px;
        border: 6px solid #7254f4;
        border-right-color: transparent;
      }
      .tr-logo-mark::after {
        right: 0;
        top: 4px;
        width: 12px;
        height: 22px;
        background: linear-gradient(180deg, #1f73ff, #ff4b88);
      }
      .tr-nav {
        padding: 16px 12px;
        flex: 1;
        overflow: hidden;
      }
      .tr-nav-item,
      .tr-sub-item {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 18px;
        color: #22365c;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
      }
      .tr-nav-item svg {
        color: #17376e;
      }
      .tr-nav-arrow {
        margin-left: auto;
        color: #9aa8bd;
      }
      .tr-sub {
        margin: 3px 0 10px;
      }
      .tr-sub-item {
        height: 46px;
        padding-left: 60px;
        color: #61718c;
        font-weight: 500;
      }
      .tr-sub-item.active {
        position: relative;
        color: #2459ff;
        background: #eff5ff;
      }
      .tr-sub-item.active::before {
        content: "";
        position: absolute;
        left: 0;
        top: 12px;
        width: 3px;
        height: 22px;
        border-radius: 3px;
        background: #2459ff;
      }
      .tr-sidebar-footer {
        padding: 14px 12px 16px;
        border-top: 1px solid #edf1f7;
      }
      .tr-notice,
      .tr-user,
      .tr-collapse {
        height: 42px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 18px;
        color: #263b61;
        font-size: 14px;
      }
      .tr-badge {
        margin-left: auto;
        min-width: 28px;
        padding: 2px 8px;
        border-radius: 12px;
        color: #fff;
        background: #ff5a6f;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
      }
      .tr-user {
        height: 54px;
        margin-top: 8px;
        border-radius: 8px;
        background: #f5f8ff;
        font-weight: 700;
      }
      .tr-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(#f9dbc8 0 45%, #2f67ff 45% 100%);
        border: 3px solid #eaf1ff;
      }
      .tr-collapse {
        color: #465977;
      }
      .tr-main {
        flex: 1;
        min-width: 0;
        padding: 24px 24px 22px;
        overflow: auto;
      }
      .tr-title {
        height: 34px;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
        color: #17233f;
        font-size: 20px;
        font-weight: 800;
      }
      .tr-back {
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #5a6a83;
        background: #fff;
        cursor: pointer;
      }
      .tr-card {
        width: 100%;
        min-height: calc(100vh - 92px);
        padding: 24px;
        border-radius: 14px;
        background: #fff;
        box-shadow: 0 10px 28px rgba(31, 50, 88, .05);
      }
      .tr-filter {
        height: 72px;
        display: flex;
        align-items: center;
        gap: 32px;
        padding: 0 16px;
        border-radius: 7px;
        background: #f7f8fb;
      }
      .tr-search-combo {
        height: 40px;
        width: 358px;
        display: flex;
        overflow: hidden;
        border: 1px solid #d9dee8;
        border-radius: 7px;
        background: #fff;
      }
      .tr-select-like {
        width: 128px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 14px;
        border-right: 1px solid #edf1f6;
        color: #12233f;
        font-size: 15px;
        font-weight: 500;
      }
      .tr-search-combo input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: none;
        padding: 0 12px;
        color: #8a97aa;
        font-size: 14px;
      }
      .tr-date-filter {
        display: flex;
        align-items: center;
        gap: 16px;
        color: #162947;
        font-size: 15px;
        font-weight: 600;
      }
      .tr-date-box {
        width: 288px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        color: #a6b0c1;
        border: 1px solid #e1e6ef;
        border-radius: 7px;
        background: #fff;
        font-weight: 400;
      }
      .tr-summary {
        margin: 34px 0 26px;
        color: #6c7a92;
        font-size: 14px;
      }
      .tr-summary span {
        margin-right: 24px;
      }
      .tr-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        color: #162947;
        font-size: 14px;
      }
      .tr-table thead tr {
        height: 52px;
        background: #fafafa;
      }
      .tr-table th {
        padding: 0 16px;
        color: #182947;
        font-weight: 800;
        text-align: left;
        border-right: 1px solid #eef1f5;
      }
      .tr-table th:last-child {
        border-right: 0;
      }
      .tr-table tbody tr {
        height: 54px;
        border-bottom: 1px solid #edf0f5;
      }
      .tr-table td {
        padding: 0 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tr-col-no { width: 110px; }
      .tr-col-ext { width: 110px; }
      .tr-col-pay { width: 145px; }
      .tr-col-type { width: 150px; }
      .tr-col-amount { width: 150px; }
      .tr-col-time { width: 180px; }
      .tr-col-order { width: 125px; }
      .tr-pagination {
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        color: #152844;
        font-size: 14px;
      }
      .tr-page-btn,
      .tr-page-current {
        min-width: 32px;
        height: 32px;
        border: 1px solid transparent;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #fff;
      }
      .tr-page-current {
        color: #2459ff;
        border-color: #2459ff;
      }
      .tr-page-muted {
        color: #7b8799;
      }
      .tr-page-select {
        height: 32px;
        min-width: 110px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 0 12px;
        border: 1px solid #d9e0ea;
        border-radius: 6px;
        background: #fff;
      }
      .tr-goto {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .tr-goto input {
        width: 50px;
        height: 32px;
        border: 1px solid #d9e0ea;
        border-radius: 6px;
        outline: none;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }

  function renderSidebar() {
    const nav = navGroups.map((item) => {
      const itemHtml = `
        <div class="tr-nav-item">
          ${icon(item.icon)}
          <span>${item.label}</span>
          ${item.arrow ? '<span class="tr-nav-arrow">⌄</span>' : ''}
        </div>`;
      if (!item.children) return itemHtml;
      return `${itemHtml}<div class="tr-sub">${item.children.map((child) => (
        `<div class="tr-sub-item ${child === '服务包管理' ? 'active' : ''}">${child}</div>`
      )).join('')}</div>`;
    }).join('');

    return `
      <aside class="tr-sidebar">
        <div class="tr-logo"><span class="tr-logo-mark"></span><span>全病程管理平台</span></div>
        <nav class="tr-nav">${nav}</nav>
        <div class="tr-sidebar-footer">
          <div class="tr-notice">${icon('bell')}<span>消息通知</span><span class="tr-badge">99+</span></div>
          <div class="tr-user"><span class="tr-avatar"></span><span>张蓉强</span><span class="tr-nav-arrow">⌄</span></div>
          <div class="tr-collapse">${icon('menu')}<span>收起面板</span></div>
        </div>
      </aside>`;
  }

  function renderRows() {
    return rows.map((row) => `
      <tr>
        <td>${row.transactionNo}</td>
        <td>${row.externalNo}</td>
        <td>${row.channel}</td>
        <td>${row.type}</td>
        <td>${row.amount}</td>
        <td>${row.orderTime}</td>
        <td>${row.orderNo}</td>
        <td title="${row.serviceName}">${row.serviceName}</td>
      </tr>
    `).join('');
  }

  function renderPage() {
    return `
      ${renderSidebar()}
      <main class="tr-main">
        <div class="tr-title">
          <button class="tr-back" type="button" data-tr-back>‹</button>
          <span>交易记录</span>
        </div>
        <section class="tr-card">
          <div class="tr-filter">
            <div class="tr-search-combo">
              <div class="tr-select-like"><span>⌄</span><span>就诊人姓名</span></div>
              <input type="text" value="" placeholder="请输入" />
            </div>
            <div class="tr-date-filter">
              <span>交易日期：</span>
              <div class="tr-date-box">
                <span>选择时间</span>
                <span>→</span>
                <span>选择时间</span>
                ${icon('calendar')}
              </div>
            </div>
          </div>
          <div class="tr-summary">
            <span>共30条记录</span>
            <span>收入合计： 24,000.00</span>
            <span>退款合计： 4,000.00</span>
          </div>
          <table class="tr-table" aria-label="交易记录列表">
            <thead>
              <tr>
                <th class="tr-col-no">交易流水号</th>
                <th class="tr-col-ext">外部流水号</th>
                <th class="tr-col-pay">支付渠道</th>
                <th class="tr-col-type">交易类型</th>
                <th class="tr-col-amount">交易金额（元）</th>
                <th class="tr-col-time">下单时间</th>
                <th class="tr-col-order">订单编号</th>
                <th>服务包名称</th>
              </tr>
            </thead>
            <tbody>${renderRows()}</tbody>
          </table>
          <div class="tr-pagination">
            <span class="tr-page-btn">‹</span>
            <span class="tr-page-btn">1</span>
            <span class="tr-page-muted">...</span>
            <span class="tr-page-current">2</span>
            <span class="tr-page-btn">3</span>
            <span class="tr-page-btn">4</span>
            <span class="tr-page-btn">5</span>
            <span class="tr-page-muted">...</span>
            <span class="tr-page-btn">50</span>
            <span class="tr-page-btn">›</span>
            <span class="tr-page-select">20 / page <span>⌄</span></span>
            <span class="tr-goto">Go to <input type="text" aria-label="页码" /></span>
          </div>
        </section>
      </main>`;
  }

  function ensurePage() {
    injectStyles();
    let page = document.getElementById(PAGE_ID);
    if (!page) {
      page = document.createElement('div');
      page.id = PAGE_ID;
      page.innerHTML = renderPage();
      page.hidden = true;
      document.body.appendChild(page);
    }
    return page;
  }

  function showPage(pushHash) {
    const page = ensurePage();
    document.body.classList.add('transaction-record-v2-active');
    page.hidden = false;
    if (pushHash && window.location.hash !== HASH) {
      history.pushState(null, '', HASH);
    }
  }

  function hidePage(updateHash) {
    const page = document.getElementById(PAGE_ID);
    if (page) page.hidden = true;
    document.body.classList.remove('transaction-record-v2-active');
    if (updateHash && window.location.hash === HASH) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  function findTransactionTrigger(target) {
    let current = target instanceof Element ? target : target && target.parentElement;
    for (let depth = 0; current && current !== document.body && depth < 8; depth += 1) {
      const text = (current.textContent || '').replace(/\s+/g, '');
      if (text === '交易记录') return current;
      current = current.parentElement;
    }
    return null;
  }

  document.addEventListener('click', function (event) {
    const page = document.getElementById(PAGE_ID);
    if (page && page.contains(event.target)) {
      if (event.target.closest('[data-tr-back]')) {
        event.preventDefault();
        hidePage(true);
      }
      return;
    }
    const trigger = findTransactionTrigger(event.target);
    if (trigger) {
      event.preventDefault();
      showPage(true);
    }
  });

  window.addEventListener('popstate', function () {
    if (window.location.hash === HASH) {
      showPage(false);
    } else {
      hidePage(false);
    }
  });

  function init() {
    if (window.location.hash === HASH) showPage(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.showTransactionRecordsPage = function () {
    showPage(true);
  };
})();
