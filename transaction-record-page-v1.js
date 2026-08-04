(function () {
  const PAGE_ID = 'transactionRecordPageV1';
  const MODE_CLASS = 'transaction-record-mode';
  const STYLE_ID = 'transaction-record-page-v1-style';

  const transactions = Array.from({ length: 9 }).map(() => ({
    serial: '12114114',
    external: '124114410',
    channel: '微信支付',
    type: '收入',
    amount: '1124.00',
    orderTime: '2026/02/05 13:30:15',
    orderNo: '1551812111',
    serviceName: '冠心病出院健康服务...'
  }));

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      body.${MODE_CLASS} > :not(#${PAGE_ID}):not(script):not(style) {
        display: none !important;
      }
      #${PAGE_ID} {
        position: fixed;
        inset: 0;
        z-index: 99990;
        display: none;
        background: #f4f7ff;
        color: #172945;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", Arial, sans-serif;
      }
      body.${MODE_CLASS} #${PAGE_ID} {
        display: flex;
      }
      #${PAGE_ID} * {
        box-sizing: border-box;
      }
      .tr-sidebar {
        width: 230px;
        flex: 0 0 230px;
        display: flex;
        flex-direction: column;
        background: #fff;
        border-right: 1px solid #e8edf7;
      }
      .tr-brand {
        height: 72px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 28px;
        border-bottom: 1px solid #edf1f8;
        font-size: 18px;
        font-weight: 800;
        color: #0e3473;
      }
      .tr-brand-mark {
        width: 30px;
        height: 22px;
        position: relative;
        border-radius: 16px;
        background: linear-gradient(135deg, #6a37e8 0%, #2c69f5 52%, #ff4f80 100%);
      }
      .tr-brand-mark::after {
        content: "";
        position: absolute;
        left: 6px;
        top: 5px;
        width: 10px;
        height: 10px;
        border: 4px solid #fff;
        border-radius: 50%;
      }
      .tr-nav {
        flex: 1;
        padding: 18px 12px;
        overflow: auto;
      }
      .tr-nav-row,
      .tr-nav-child {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 18px;
        color: #24385a;
        font-size: 15px;
        border-radius: 8px;
        white-space: nowrap;
      }
      .tr-nav-row {
        margin-top: 8px;
        font-weight: 600;
      }
      .tr-nav-row .tr-arrow {
        margin-left: auto;
        color: #9aa8bd;
      }
      .tr-nav-child {
        padding-left: 60px;
        color: #5d6f8f;
      }
      .tr-nav-child.active {
        color: #2b5cff;
        background: #eef4ff;
        border-left: 3px solid #2b5cff;
        padding-left: 57px;
      }
      .tr-nav-icon {
        width: 18px;
        height: 18px;
        border: 1.7px solid #31527f;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        color: #31527f;
      }
      .tr-sidebar-bottom {
        padding: 16px 12px 18px;
        border-top: 1px solid #edf1f8;
      }
      .tr-notice {
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 22px;
        color: #24385a;
      }
      .tr-badge {
        min-width: 28px;
        height: 18px;
        padding: 0 7px;
        border-radius: 12px;
        background: #ff5870;
        color: #fff;
        font-size: 11px;
        line-height: 18px;
        text-align: center;
      }
      .tr-user {
        height: 54px;
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 14px;
        background: #f4f8ff;
        border-radius: 10px;
        color: #1b3152;
        font-weight: 700;
      }
      .tr-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background:
          radial-gradient(circle at 50% 38%, #f8d9c5 0 30%, transparent 31%),
          radial-gradient(circle at 50% 75%, #2f65ff 0 38%, transparent 39%),
          #eef4ff;
        border: 1px solid #d8e4ff;
      }
      .tr-collapse {
        height: 38px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 22px;
        color: #60728e;
        font-size: 14px;
      }
      .tr-main {
        flex: 1;
        min-width: 0;
        padding: 24px;
        overflow: auto;
      }
      .tr-page-title {
        display: flex;
        align-items: center;
        gap: 12px;
        height: 34px;
        margin-bottom: 10px;
        font-size: 20px;
        font-weight: 800;
        color: #172945;
      }
      .tr-back {
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 50%;
        background: #fff;
        color: #63758e;
        font-size: 24px;
        line-height: 20px;
        cursor: pointer;
      }
      .tr-card {
        margin-top: 10px;
        min-height: calc(100vh - 92px);
        padding: 24px;
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 18px 40px rgba(40, 66, 124, 0.05);
      }
      .tr-filter {
        height: 72px;
        display: flex;
        align-items: center;
        gap: 32px;
        padding: 0 16px;
        background: #f7f8fb;
        border-radius: 8px;
      }
      .tr-combo {
        width: 360px;
        height: 40px;
        display: flex;
        align-items: center;
        border: 1px solid #d6deeb;
        border-radius: 7px;
        background: #fff;
        overflow: hidden;
      }
      .tr-combo-label {
        width: 130px;
        display: flex;
        align-items: center;
        gap: 9px;
        padding-left: 13px;
        color: #172945;
        border-right: 1px solid #eef2f7;
      }
      .tr-down {
        width: 9px;
        height: 9px;
        border-right: 2px solid #172945;
        border-bottom: 2px solid #172945;
        transform: rotate(45deg);
        margin-top: -4px;
      }
      .tr-input {
        flex: 1;
        border: 0;
        outline: 0;
        padding: 0 14px;
        color: #a2adbf;
        font-size: 14px;
      }
      .tr-date-wrap {
        display: flex;
        align-items: center;
        gap: 13px;
        color: #172945;
        font-weight: 600;
      }
      .tr-date {
        width: 286px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 13px;
        border: 1px solid #dfe5ef;
        border-radius: 7px;
        background: #fff;
        color: #a4afc0;
        font-weight: 400;
      }
      .tr-summary {
        margin: 34px 0 26px;
        color: #62718b;
        font-size: 14px;
      }
      .tr-summary span {
        margin-right: 22px;
      }
      .tr-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }
      .tr-table thead {
        background: #fafafa;
      }
      .tr-table th {
        height: 52px;
        padding: 0 16px;
        color: #172945;
        font-size: 14px;
        font-weight: 800;
        text-align: left;
        border-right: 1px solid #eef1f6;
      }
      .tr-table th:last-child {
        border-right: 0;
      }
      .tr-table td {
        height: 54px;
        padding: 0 16px;
        color: #172945;
        font-size: 14px;
        border-bottom: 1px solid #edf0f6;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tr-pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        margin-top: 30px;
        color: #172945;
      }
      .tr-page-items {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .tr-page {
        min-width: 24px;
        height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        color: #172945;
      }
      .tr-page.active {
        min-width: 32px;
        border: 1px solid #2b5cff;
        color: #1f50ff;
        background: #fff;
      }
      .tr-page-select {
        width: 108px;
        height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border: 1px solid #dfe5ef;
        border-radius: 6px;
        background: #fff;
      }
      .tr-goto {
        width: 50px;
        height: 32px;
        border: 1px solid #dfe5ef;
        border-radius: 6px;
      }
    `;
    document.head.appendChild(style);
  }

  function tableRows() {
    return transactions.map((item) => `
      <tr>
        <td>${item.serial}</td>
        <td>${item.external}</td>
        <td>${item.channel}</td>
        <td>${item.type}</td>
        <td>${item.amount}</td>
        <td>${item.orderTime}</td>
        <td>${item.orderNo}</td>
        <td title="冠心病出院健康服务包">${item.serviceName}</td>
      </tr>
    `).join('');
  }

  function renderPage() {
    let page = document.getElementById(PAGE_ID);
    if (page) return page;
    page = document.createElement('div');
    page.id = PAGE_ID;
    page.innerHTML = `
      <aside class="tr-sidebar">
        <div class="tr-brand">
          <span class="tr-brand-mark"></span>
          <span>全病程管理平台</span>
        </div>
        <nav class="tr-nav">
          <div class="tr-nav-row"><span class="tr-nav-icon"></span><span>工作台</span></div>
          <div class="tr-nav-row"><span class="tr-nav-icon"></span><span>任务管理</span><span class="tr-arrow">⌄</span></div>
          <div class="tr-nav-row"><span class="tr-nav-icon"></span><span>患者管理</span><span class="tr-arrow">⌄</span></div>
          <div class="tr-nav-row"><span class="tr-nav-icon"></span><span>方案管理</span><span class="tr-arrow">⌄</span></div>
          <div class="tr-nav-row"><span class="tr-nav-icon"></span><span>运营管理</span><span class="tr-arrow">⌄</span></div>
          <div class="tr-nav-row"><span class="tr-nav-icon"></span><span>AI 客服</span><span class="tr-arrow">⌄</span></div>
          <div class="tr-nav-row"><span class="tr-nav-icon"></span><span>系统设置</span><span class="tr-arrow">⌄</span></div>
          <div class="tr-nav-row"><span class="tr-nav-icon"></span><span>服务管理</span><span class="tr-arrow">⌄</span></div>
          <div class="tr-nav-child active">服务包管理</div>
          <div class="tr-nav-child">订单管理</div>
          <div class="tr-nav-child">交易记录</div>
        </nav>
        <div class="tr-sidebar-bottom">
          <div class="tr-notice"><span>消息通知</span><span class="tr-badge">99+</span></div>
          <div class="tr-user"><span class="tr-avatar"></span><span>张蓉强</span><span class="tr-arrow">⌄</span></div>
          <div class="tr-collapse"><span>≡</span><span>收起面板</span></div>
        </div>
      </aside>
      <main class="tr-main">
        <div class="tr-page-title">
          <button type="button" class="tr-back" data-tr-close>‹</button>
          <span>交易记录</span>
        </div>
        <section class="tr-card">
          <div class="tr-filter">
            <div class="tr-combo">
              <div class="tr-combo-label"><span class="tr-down"></span><span>就诊人姓名</span></div>
              <input class="tr-input" placeholder="请输入" />
            </div>
            <div class="tr-date-wrap">
              <span>交易日期：</span>
              <div class="tr-date"><span>选择时间</span><span>→</span><span>选择时间</span><span>□</span></div>
            </div>
          </div>
          <div class="tr-summary">
            <span>共30条记录</span>
            <span>收入合计： 24,000.00</span>
            <span>退款合计： 4,000.00</span>
          </div>
          <table class="tr-table">
            <thead>
              <tr>
                <th style="width:10%">交易流水号</th>
                <th style="width:10%">外部流水号</th>
                <th style="width:13%">支付渠道</th>
                <th style="width:12%">交易类型</th>
                <th style="width:13%">交易金额（元）</th>
                <th style="width:16%">下单时间</th>
                <th style="width:10%">订单编号</th>
                <th style="width:16%">服务包名称</th>
              </tr>
            </thead>
            <tbody>${tableRows()}</tbody>
          </table>
          <div class="tr-pagination">
            <span>‹</span>
            <div class="tr-page-items">
              <span class="tr-page">1</span>
              <span>...</span>
              <span class="tr-page active">2</span>
              <span class="tr-page">3</span>
              <span class="tr-page">4</span>
              <span class="tr-page">5</span>
              <span>...</span>
              <span class="tr-page">50</span>
            </div>
            <span>›</span>
            <div class="tr-page-select">20 / page <span class="tr-down"></span></div>
            <span>Go to</span>
            <input class="tr-goto" />
          </div>
        </section>
      </main>
    `;
    document.body.appendChild(page);
    page.querySelector('[data-tr-close]').addEventListener('click', hidePage);
    return page;
  }

  function showPage() {
    injectStyle();
    renderPage();
    document.body.classList.add(MODE_CLASS);
    if (location.hash !== '#transaction-records') {
      history.replaceState(null, '', '#transaction-records');
    }
  }

  function hidePage() {
    document.body.classList.remove(MODE_CLASS);
    if (location.hash === '#transaction-records') {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function normalizedText(node) {
    return (node && node.textContent ? node.textContent : '').replace(/\s+/g, '').trim();
  }

  document.addEventListener('click', function (event) {
    const page = document.getElementById(PAGE_ID);
    if (page && page.contains(event.target)) return;
    const candidate = event.target.closest('a,button,li,div,span');
    if (!candidate) return;
    if (normalizedText(candidate) === '交易记录') {
      event.preventDefault();
      event.stopPropagation();
      showPage();
    }
  }, true);

  window.addEventListener('hashchange', function () {
    if (location.hash === '#transaction-records') showPage();
  });

  window.showTransactionRecordsPage = showPage;
  if (location.hash === '#transaction-records') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showPage);
    } else {
      showPage();
    }
  }
})();
