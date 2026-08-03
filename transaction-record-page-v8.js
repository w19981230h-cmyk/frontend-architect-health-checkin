(function () {
  if (window.__transactionRecordPageV8) return;
  window.__transactionRecordPageV8 = true;

  const rows = Array.from({ length: 9 }).map(() => ({
    tradeNo: '12114114',
    outsideNo: '124114410',
    channel: '微信支付',
    type: '收入',
    amount: '1124.00',
    orderedAt: '2026/02/05 13:30:15',
    orderNo: '1551812111',
    service: '冠心病出院健康服务...'
  }));

  function ensureStyle() {
    if (document.getElementById('transaction-record-style-v8')) return;
    const style = document.createElement('style');
    style.id = 'transaction-record-style-v8';
    style.textContent = `
      body.tr8-active { margin: 0; background: #f4f7ff; color: #182b49; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif; }
      body.tr8-active > *:not(#transaction-record-page-v8) { display: none !important; }
      .tr8-page { min-height: 100vh; display: flex; background: #f4f7ff; }
      .tr8-sidebar { width: 230px; flex: 0 0 230px; background: #fff; border-right: 1px solid #edf1f8; display: flex; flex-direction: column; }
      .tr8-logo { height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 28px 0 32px; border-bottom: 1px solid #edf1f8; font-size: 18px; font-weight: 800; color: #0a2d64; }
      .tr8-logo-mark { width: 26px; height: 26px; border-radius: 9px; background: linear-gradient(135deg, #6b35ff, #ff4d88); position: relative; box-shadow: 11px 0 0 #2f6dff; }
      .tr8-nav { padding: 16px 12px; flex: 1; }
      .tr8-nav-item, .tr8-sub-item { height: 44px; display: flex; align-items: center; gap: 12px; border-radius: 9px; color: #18345d; font-size: 15px; cursor: pointer; }
      .tr8-nav-item { padding: 0 18px; font-weight: 600; }
      .tr8-sub-item { padding-left: 48px; margin: 2px 0; color: #526782; }
      .tr8-nav-icon { width: 16px; height: 16px; border: 1.8px solid #264a83; border-radius: 4px; box-sizing: border-box; }
      .tr8-nav-caret { margin-left: auto; color: #8b9ab1; }
      .tr8-sub-item.active { background: #eef4ff; color: #1d5cff; font-weight: 700; }
      .tr8-sidebar-bottom { padding: 18px 12px 20px; border-top: 1px solid #edf1f8; }
      .tr8-message { height: 44px; display: flex; align-items: center; gap: 12px; padding: 0 18px; color: #18345d; font-size: 14px; }
      .tr8-badge { margin-left: auto; padding: 2px 8px; border-radius: 999px; background: #ff5b70; color: #fff; font-size: 11px; font-weight: 800; }
      .tr8-user { height: 54px; border-radius: 10px; background: #f5f8ff; display: flex; align-items: center; gap: 12px; padding: 0 12px; font-weight: 700; color: #193861; }
      .tr8-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(#fff 0 26%, #ffd9c7 27% 54%, #3d76ff 55%); border: 3px solid #e7efff; box-sizing: border-box; }
      .tr8-main { flex: 1; min-width: 0; padding: 22px 24px; }
      .tr8-title { display: flex; align-items: center; gap: 12px; height: 36px; margin-bottom: 18px; font-size: 22px; font-weight: 800; color: #162846; }
      .tr8-back { width: 28px; height: 28px; border: 0; border-radius: 50%; background: #fff; color: #7888a2; font-size: 24px; line-height: 26px; cursor: pointer; }
      .tr8-card { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 16px 40px rgba(36, 65, 113, .06); }
      .tr8-filter { height: 72px; border-radius: 8px; background: #f7f8fb; display: flex; align-items: center; padding: 0 16px; gap: 32px; }
      .tr8-search { width: 360px; height: 40px; display: flex; align-items: center; border: 1px solid #d6dce8; border-radius: 7px; background: #fff; overflow: hidden; }
      .tr8-select-label { width: 128px; height: 100%; display: flex; align-items: center; gap: 8px; justify-content: center; border-right: 1px solid #edf1f6; font-weight: 700; color: #172b49; }
      .tr8-select-label:before { content: ""; width: 9px; height: 9px; border-right: 2px solid #172b49; border-bottom: 2px solid #172b49; transform: rotate(45deg) translateY(-3px); }
      .tr8-search input { flex: 1; border: 0; outline: 0; font-size: 14px; padding: 0 12px; color: #7d8ba2; }
      .tr8-date { display: flex; align-items: center; gap: 14px; font-size: 15px; color: #142946; }
      .tr8-date-box { width: 285px; height: 40px; border: 1px solid #d6dce8; border-radius: 7px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; color: #a8b2c2; box-sizing: border-box; }
      .tr8-date-box span:nth-child(2) { color: #9ba8ba; }
      .tr8-calendar { width: 15px; height: 15px; border: 1.8px solid #a8b2c2; border-radius: 3px; position: relative; box-sizing: border-box; }
      .tr8-calendar:before { content: ""; position: absolute; left: 2px; right: 2px; top: 4px; border-top: 1.8px solid #a8b2c2; }
      .tr8-summary { margin: 32px 0 26px; color: #66748b; font-size: 15px; display: flex; gap: 22px; }
      .tr8-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 15px; }
      .tr8-table thead { background: #fafafa; }
      .tr8-table th { height: 54px; text-align: left; padding: 0 16px; color: #1c2d48; font-weight: 800; border-right: 1px solid #f0f1f4; white-space: nowrap; }
      .tr8-table th:last-child { border-right: 0; }
      .tr8-table td { height: 54px; padding: 0 16px; color: #1c2d48; border-bottom: 1px solid #eeeeef; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
      .tr8-table th:nth-child(1), .tr8-table td:nth-child(1) { width: 92px; }
      .tr8-table th:nth-child(2), .tr8-table td:nth-child(2) { width: 106px; }
      .tr8-table th:nth-child(3), .tr8-table td:nth-child(3) { width: 116px; }
      .tr8-table th:nth-child(4), .tr8-table td:nth-child(4) { width: 110px; }
      .tr8-table th:nth-child(5), .tr8-table td:nth-child(5) { width: 136px; }
      .tr8-table th:nth-child(6), .tr8-table td:nth-child(6) { width: 180px; }
      .tr8-table th:nth-child(7), .tr8-table td:nth-child(7) { width: 110px; }
      .tr8-pagination { height: 78px; display: flex; align-items: center; justify-content: center; gap: 15px; color: #1e2d48; }
      .tr8-page-btn, .tr8-page-num { min-width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; color: #203049; }
      .tr8-page-btn { font-size: 23px; color: #263957; }
      .tr8-page-num.active { border: 1px solid #1d5cff; color: #1d5cff; background: #fff; }
      .tr8-page-size { height: 32px; min-width: 110px; border: 1px solid #d7ddea; border-radius: 7px; display: flex; align-items: center; justify-content: center; gap: 10px; background: #fff; }
      .tr8-page-size:after { content: ""; width: 7px; height: 7px; border-right: 1.8px solid #728098; border-bottom: 1.8px solid #728098; transform: rotate(45deg) translateY(-2px); }
      .tr8-goto { width: 48px; height: 32px; border: 1px solid #d7ddea; border-radius: 7px; background: #fff; }
    `;
    document.head.appendChild(style);
  }

  function renderRows() {
    return rows.map(row => `
      <tr>
        <td>${row.tradeNo}</td>
        <td>${row.outsideNo}</td>
        <td>${row.channel}</td>
        <td>${row.type}</td>
        <td>${row.amount}</td>
        <td>${row.orderedAt}</td>
        <td>${row.orderNo}</td>
        <td title="冠心病出院健康服务包">${row.service}</td>
      </tr>
    `).join('');
  }

  function renderSidebar() {
    const items = ['工作台', '任务管理', '患者管理', '方案管理', '运营管理', 'AI 客服', '系统设置'];
    return `
      <aside class="tr8-sidebar">
        <div class="tr8-logo"><span class="tr8-logo-mark"></span><span>全病程管理平台</span></div>
        <nav class="tr8-nav">
          ${items.map(text => `<div class="tr8-nav-item"><span class="tr8-nav-icon"></span><span>${text}</span><span class="tr8-nav-caret">⌄</span></div>`).join('')}
          <div class="tr8-nav-item"><span class="tr8-nav-icon"></span><span>服务管理</span><span class="tr8-nav-caret">⌄</span></div>
          <div class="tr8-sub-item">服务包管理</div>
          <div class="tr8-sub-item">订单管理</div>
          <div class="tr8-sub-item active">交易记录</div>
        </nav>
        <div class="tr8-sidebar-bottom">
          <div class="tr8-message"><span class="tr8-nav-icon"></span><span>消息通知</span><span class="tr8-badge">99+</span></div>
          <div class="tr8-user"><span class="tr8-avatar"></span><span>张蕾强</span><span class="tr8-nav-caret">⌄</span></div>
          <div class="tr8-message"><span class="tr8-nav-icon"></span><span>收起面板</span></div>
        </div>
      </aside>
    `;
  }

  function renderPage() {
    return `
      <div id="transaction-record-page-v8" class="tr8-page">
        ${renderSidebar()}
        <main class="tr8-main">
          <div class="tr8-title"><button class="tr8-back" type="button">‹</button><span>交易记录</span></div>
          <section class="tr8-card">
            <div class="tr8-filter">
              <div class="tr8-search">
                <div class="tr8-select-label">就诊人姓名</div>
                <input value="" placeholder="请输入" />
              </div>
              <div class="tr8-date">
                <strong>交易日期：</strong>
                <div class="tr8-date-box"><span>选择时间</span><span>→</span><span>选择时间</span><i class="tr8-calendar"></i></div>
              </div>
            </div>
            <div class="tr8-summary">
              <span>共30条记录</span>
              <span>收入合计： 24,000.00</span>
              <span>退款合计： 4,000.00</span>
            </div>
            <table class="tr8-table">
              <thead>
                <tr>
                  <th>交易流水号</th>
                  <th>外部流水号</th>
                  <th>支付渠道</th>
                  <th>交易类型</th>
                  <th>交易金额（元）</th>
                  <th>下单时间</th>
                  <th>订单编号</th>
                  <th>服务包名称</th>
                </tr>
              </thead>
              <tbody>${renderRows()}</tbody>
            </table>
            <div class="tr8-pagination">
              <span class="tr8-page-btn">‹</span>
              <span class="tr8-page-num">1</span>
              <span>...</span>
              <span class="tr8-page-num active">2</span>
              <span class="tr8-page-num">3</span>
              <span class="tr8-page-num">4</span>
              <span class="tr8-page-num">5</span>
              <span>...</span>
              <span class="tr8-page-num">50</span>
              <span class="tr8-page-btn">›</span>
              <span class="tr8-page-size">20 / page</span>
              <span>Go to</span>
              <input class="tr8-goto" />
            </div>
          </section>
        </main>
      </div>
    `;
  }

  function openTransactionPage() {
    ensureStyle();
    ['transaction-record-page-v6', 'transaction-record-page-v7', 'transaction-record-page-v8'].forEach(id => {
      const node = document.getElementById(id);
      if (node) node.remove();
    });
    document.body.classList.remove('tr6-active', 'tr7-active');
    document.body.classList.add('tr8-active');
    document.body.insertAdjacentHTML('beforeend', renderPage());
  }

  function closeTransactionPage() {
    const node = document.getElementById('transaction-record-page-v8');
    if (node) node.remove();
    document.body.classList.remove('tr8-active');
    if (location.hash === '#transaction-records') {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('a, button, .tr8-sub-item, .tr8-back');
    if (!trigger) return;
    const text = (trigger.textContent || '').trim();
    if (text === '交易记录') {
      event.preventDefault();
      if (location.hash !== '#transaction-records') {
        history.replaceState(null, '', '#transaction-records');
      }
      openTransactionPage();
    }
    if (trigger.classList.contains('tr8-back')) {
      event.preventDefault();
      closeTransactionPage();
    }
  });

  if (location.hash === '#transaction-records') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', openTransactionPage);
    } else {
      openTransactionPage();
    }
  }
})();
