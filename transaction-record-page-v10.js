(function () {
  if (window.__transactionRecordPageV10) return;
  window.__transactionRecordPageV10 = true;

  const rows = Array.from({ length: 9 }, () => ({
    tradeNo: '12114114',
    externalNo: '124114410',
    channel: '微信支付',
    type: '收入',
    amount: '1124.00',
    orderTime: '2026/02/05 13:30:15',
    orderNo: '1551812111',
    service: '冠心病出院健康服务...'
  }));

  function ensureStyle() {
    if (document.getElementById('transaction-record-page-v10-style')) return;
    const style = document.createElement('style');
    style.id = 'transaction-record-page-v10-style';
    style.textContent = `
      body.tr10-active {
        margin: 0;
        overflow: hidden;
        background: #f3f6fc;
        color: #17233d;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", Arial, sans-serif;
      }
      body.tr10-active > *:not(#transaction-record-page-v10):not(script):not(style) {
        display: none !important;
      }
      #transaction-record-page-v10 {
        width: 100vw;
        height: 100vh;
      }
      .tr10-shell {
        display: flex;
        width: 100%;
        height: 100%;
        background: #f3f6fc;
      }
      .tr10-sidebar {
        width: 230px;
        background: #fff;
        border-right: 1px solid #edf1f7;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
      }
      .tr10-logo {
        height: 72px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 30px;
        color: #0a2a66;
        font-size: 18px;
        font-weight: 800;
        border-bottom: 1px solid #edf1f7;
        letter-spacing: 0;
      }
      .tr10-logo-mark {
        width: 30px;
        height: 30px;
        border-radius: 10px 10px 10px 14px;
        background: conic-gradient(from 140deg, #7c3aed, #1769ff, #f35b7f, #7c3aed);
        position: relative;
      }
      .tr10-logo-mark::after {
        content: "";
        position: absolute;
        left: 7px;
        top: 8px;
        width: 12px;
        height: 10px;
        border: 4px solid #fff;
        border-radius: 10px;
      }
      .tr10-menu {
        padding: 18px 12px;
        flex: 1;
        min-height: 0;
      }
      .tr10-menu-item {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 20px;
        border-radius: 8px;
        color: #1a3360;
        font-size: 15px;
        font-weight: 700;
      }
      .tr10-menu-ico {
        width: 18px;
        text-align: center;
        color: #1f4a92;
      }
      .tr10-menu-arrow {
        margin-left: auto;
        color: #9aa9bd;
      }
      .tr10-sub {
        margin: 4px 0 10px 44px;
        display: grid;
        gap: 2px;
      }
      .tr10-side-sub {
        height: 36px;
        display: flex;
        align-items: center;
        padding-left: 12px;
        border-radius: 8px;
        color: #65758f;
        font-size: 14px;
        cursor: pointer;
        position: relative;
      }
      .tr10-side-sub.active {
        background: #eef4ff;
        color: #1d55ff;
        font-weight: 700;
      }
      .tr10-side-sub.active::before {
        content: "";
        position: absolute;
        left: -44px;
        top: 7px;
        width: 3px;
        height: 22px;
        border-radius: 2px;
        background: #2f63ff;
      }
      .tr10-bottom {
        border-top: 1px solid #edf1f7;
        padding: 16px 14px 18px;
      }
      .tr10-notice,
      .tr10-profile,
      .tr10-collapse {
        height: 42px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #243b63;
        font-size: 14px;
      }
      .tr10-badge {
        margin-left: auto;
        min-width: 30px;
        height: 18px;
        padding: 0 7px;
        border-radius: 10px;
        background: #ff5d6c;
        color: #fff;
        font-size: 11px;
        line-height: 18px;
        text-align: center;
        font-weight: 700;
      }
      .tr10-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: linear-gradient(#fff1e8 0 45%, #2f64ff 46% 100%);
        border: 3px solid #e8f0ff;
      }
      .tr10-main {
        flex: 1;
        min-width: 0;
        padding: 24px 24px 28px;
        overflow: auto;
      }
      .tr10-titlebar {
        display: flex;
        align-items: center;
        gap: 12px;
        height: 38px;
        margin-bottom: 18px;
      }
      .tr10-back {
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 50%;
        background: #fff;
        color: #6b7890;
        font-size: 20px;
        line-height: 24px;
        cursor: pointer;
      }
      .tr10-title {
        font-size: 20px;
        font-weight: 800;
        color: #17233d;
      }
      .tr10-card {
        background: #fff;
        border-radius: 14px;
        padding: 24px;
        box-shadow: 0 12px 34px rgba(40, 74, 130, 0.06);
      }
      .tr10-filter {
        height: 72px;
        border-radius: 8px;
        background: #f6f8fc;
        display: flex;
        align-items: center;
        gap: 32px;
        padding: 0 16px;
      }
      .tr10-field-combo {
        width: 358px;
        height: 40px;
        display: flex;
        align-items: center;
        overflow: hidden;
        border: 1px solid #d7deea;
        border-radius: 7px;
        background: #fff;
      }
      .tr10-select-label {
        height: 100%;
        min-width: 126px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 14px;
        border-right: 1px solid #edf1f7;
        color: #17233d;
        font-weight: 600;
      }
      .tr10-input {
        flex: 1;
        color: #b1bbca;
        padding: 0 12px;
      }
      .tr10-date {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #17233d;
        font-weight: 700;
      }
      .tr10-date-box {
        width: 278px;
        height: 40px;
        border: 1px solid #dfe5f0;
        border-radius: 7px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        color: #b1bbca;
        font-weight: 400;
      }
      .tr10-date-arrow {
        color: #a6b1c2;
        margin: 0 8px;
      }
      .tr10-summary {
        display: flex;
        gap: 22px;
        margin: 30px 0 28px;
        color: #66758e;
        font-size: 14px;
      }
      .tr10-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        color: #17233d;
      }
      .tr10-table thead th {
        height: 52px;
        background: #fafafa;
        padding: 0 16px;
        text-align: left;
        font-size: 14px;
        font-weight: 800;
        color: #17233d;
        border-right: 1px solid #edf1f7;
      }
      .tr10-table thead th:last-child {
        border-right: 0;
      }
      .tr10-table tbody td {
        height: 54px;
        padding: 0 16px;
        border-bottom: 1px solid #edf1f7;
        font-size: 14px;
        color: #17233d;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tr10-pagination {
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        color: #17233d;
        font-size: 14px;
      }
      .tr10-page {
        min-width: 28px;
        height: 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        color: #17233d;
      }
      .tr10-page.active {
        border: 1px solid #2458ff;
        color: #2458ff;
        background: #fff;
      }
      .tr10-page-muted {
        color: #7d89a0;
      }
      .tr10-page-select {
        height: 32px;
        min-width: 108px;
        padding: 0 12px;
        border: 1px solid #dfe5f0;
        border-radius: 6px;
        background: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
      }
      .tr10-page-input {
        width: 48px;
        height: 30px;
        border: 1px solid #dfe5f0;
        border-radius: 6px;
        background: #fff;
      }
      @media (max-width: 980px) {
        .tr10-sidebar { width: 210px; }
        .tr10-main { padding: 18px; }
        .tr10-filter { flex-wrap: wrap; height: auto; padding: 16px; }
      }
    `;
    document.head.appendChild(style);
  }

  function renderRows() {
    return rows.map(row => `
      <tr>
        <td>${row.tradeNo}</td>
        <td>${row.externalNo}</td>
        <td>${row.channel}</td>
        <td>${row.type}</td>
        <td>${row.amount}</td>
        <td>${row.orderTime}</td>
        <td>${row.orderNo}</td>
        <td title="${row.service}">${row.service}</td>
      </tr>
    `).join('');
  }

  function renderSidebar() {
    const groups = [
      { icon: '▣', label: '工作台' },
      { icon: '▤', label: '任务管理' },
      { icon: '♙', label: '患者管理' },
      { icon: '▧', label: '方案管理' },
      { icon: '◴', label: '运营管理' },
      { icon: '◎', label: 'AI 客服' },
      { icon: '⚙', label: '系统设置' },
      {
        icon: '▣',
        label: '服务管理',
        children: ['服务包管理', '订单管理', '交易记录']
      }
    ];
    return `
      <aside class="tr10-sidebar">
        <div class="tr10-logo"><span class="tr10-logo-mark"></span><span>全病程管理平台</span></div>
        <div class="tr10-menu">
          ${groups.map(group => `
            <div class="tr10-menu-item">
              <span class="tr10-menu-ico">${group.icon}</span>
              <span>${group.label}</span>
              <span class="tr10-menu-arrow">⌄</span>
            </div>
            ${group.children ? `<div class="tr10-sub">${group.children.map(item => `<div class="tr10-side-sub ${item === '交易记录' ? 'active' : ''}">${item}</div>`).join('')}</div>` : ''}
          `).join('')}
        </div>
        <div class="tr10-bottom">
          <div class="tr10-notice">♧ <span>消息通知</span><span class="tr10-badge">99+</span></div>
          <div class="tr10-profile"><span class="tr10-avatar"></span><strong>张蓓强</strong><span style="margin-left:auto">⌄</span></div>
          <div class="tr10-collapse">☰ <span>收起面板</span></div>
        </div>
      </aside>
    `;
  }

  function openPage() {
    ensureStyle();
    document.body.classList.add('tr10-active');
    let root = document.getElementById('transaction-record-page-v10');
    if (!root) {
      root = document.createElement('div');
      root.id = 'transaction-record-page-v10';
      document.body.appendChild(root);
    }
    root.innerHTML = `
      <div class="tr10-shell">
        ${renderSidebar()}
        <main class="tr10-main">
          <div class="tr10-titlebar">
            <button class="tr10-back" type="button" aria-label="返回">‹</button>
            <div class="tr10-title">交易记录</div>
          </div>
          <section class="tr10-card">
            <div class="tr10-filter">
              <div class="tr10-field-combo">
                <div class="tr10-select-label"><span>⌄</span><span>就诊人姓名</span></div>
                <div class="tr10-input">请输入</div>
              </div>
              <div class="tr10-date">
                <span>交易日期：</span>
                <div class="tr10-date-box">
                  <span>选择时间 <span class="tr10-date-arrow">→</span> 选择时间</span>
                  <span>▢</span>
                </div>
              </div>
            </div>
            <div class="tr10-summary">
              <span>共30条记录</span>
              <span>收入合计： 24,000.00</span>
              <span>退款合计： 4,000.00</span>
            </div>
            <table class="tr10-table">
              <thead>
                <tr>
                  <th style="width: 9%;">交易流水号</th>
                  <th style="width: 9%;">外部流水号</th>
                  <th style="width: 12%;">支付渠道</th>
                  <th style="width: 12%;">交易类型</th>
                  <th style="width: 13%;">交易金额（元）</th>
                  <th style="width: 15%;">下单时间</th>
                  <th style="width: 10%;">订单编号</th>
                  <th>服务包名称</th>
                </tr>
              </thead>
              <tbody>${renderRows()}</tbody>
            </table>
            <div class="tr10-pagination">
              <span class="tr10-page">‹</span>
              <span class="tr10-page">1</span>
              <span class="tr10-page-muted">...</span>
              <span class="tr10-page active">2</span>
              <span class="tr10-page">3</span>
              <span class="tr10-page">4</span>
              <span class="tr10-page">5</span>
              <span class="tr10-page-muted">...</span>
              <span class="tr10-page">50</span>
              <span class="tr10-page">›</span>
              <span class="tr10-page-select">20 / page <span>⌄</span></span>
              <span>Go to</span>
              <span class="tr10-page-input"></span>
            </div>
          </section>
        </main>
      </div>
    `;

    const back = root.querySelector('.tr10-back');
    if (back) back.addEventListener('click', closePage);
  }

  function closePage() {
    document.body.classList.remove('tr10-active');
    const root = document.getElementById('transaction-record-page-v10');
    if (root) root.remove();
    if (location.hash === '#transaction-records') {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  document.addEventListener('click', function (event) {
    const target = event.target.closest('a,button,li,div,span');
    if (!target) return;
    const text = (target.textContent || '').replace(/\s+/g, '').trim();
    if (text === '交易记录') {
      event.preventDefault();
      event.stopPropagation();
      if (location.hash !== '#transaction-records') {
        location.hash = 'transaction-records';
      }
      openPage();
    }
  }, true);

  window.addEventListener('hashchange', function () {
    if (location.hash === '#transaction-records') openPage();
  });

  window.openTransactionRecordPage = openPage;
  if (location.hash === '#transaction-records') openPage();
})();
