(function () {
  if (window.__transactionRecordPageV9) return;
  window.__transactionRecordPageV9 = true;

  const rows = Array.from({ length: 9 }, () => ({
    tradeNo: '12114114',
    outerNo: '124114410',
    channel: '微信支付',
    type: '收入',
    amount: '1124.00',
    orderTime: '2026/02/05 13:30:15',
    orderNo: '1551812111',
    service: '冠心病出院健康服务包'
  }));

  function injectStyle() {
    if (document.getElementById('transaction-record-page-v9-style')) return;
    const style = document.createElement('style');
    style.id = 'transaction-record-page-v9-style';
    style.textContent = `
      body.tr9-active { margin: 0; overflow: hidden; background: #f3f6ff; }
      body.tr9-active > *:not(#transaction-record-page-v9):not(script):not(style) { display: none !important; }
      #transaction-record-page-v9 { position: fixed; inset: 0; z-index: 999999; display: flex; min-width: 1180px; height: 100vh; background: #f4f7ff; color: #16243d; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; }
      .tr9-sidebar { width: 230px; background: #fff; border-right: 1px solid #edf1f7; display: flex; flex-direction: column; padding: 24px 12px 18px; box-sizing: border-box; }
      .tr9-logo { display: flex; align-items: center; gap: 12px; padding: 0 18px 24px; border-bottom: 1px solid #eef2f8; font-size: 18px; font-weight: 800; color: #12306a; }
      .tr9-logo-mark { width: 28px; height: 28px; border-radius: 12px; background: conic-gradient(from 210deg, #426bff, #9c3fe7, #ff5a80, #426bff); position: relative; box-shadow: 0 8px 20px rgba(66,107,255,.18); }
      .tr9-logo-mark:after { content: ""; position: absolute; left: 8px; top: 8px; width: 12px; height: 12px; border-radius: 50%; background: #fff; }
      .tr9-menu { padding-top: 20px; flex: 1; }
      .tr9-menu-item, .tr9-sub-item { height: 46px; display: flex; align-items: center; gap: 12px; padding: 0 16px; border-radius: 8px; color: #21345c; font-size: 15px; box-sizing: border-box; }
      .tr9-menu-item { font-weight: 700; }
      .tr9-menu-icon { width: 18px; text-align: center; color: #254a83; font-size: 17px; }
      .tr9-menu-arrow { margin-left: auto; color: #9aa8bc; font-size: 18px; }
      .tr9-sub { margin: 4px 0 14px; }
      .tr9-sub-item { margin-left: 28px; color: #60708c; cursor: default; }
      .tr9-sub-item.active { background: #edf3ff; color: #2559ff; font-weight: 700; }
      .tr9-sidebar-bottom { border-top: 1px solid #eef2f8; padding-top: 16px; }
      .tr9-notice { display: flex; align-items: center; gap: 10px; padding: 10px 16px; color: #21345c; font-weight: 600; }
      .tr9-badge { margin-left: auto; min-width: 32px; height: 18px; border-radius: 9px; background: #ff5b73; color: #fff; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
      .tr9-user { display: flex; align-items: center; gap: 12px; padding: 12px; margin-top: 10px; border-radius: 10px; background: #f4f7ff; font-weight: 700; }
      .tr9-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(#ffe4d6 0 46%, #2d64f6 47%); border: 3px solid #dce7ff; box-sizing: border-box; }
      .tr9-collapse { display: flex; align-items: center; gap: 10px; padding: 14px 18px 0; color: #61708b; }
      .tr9-main { flex: 1; min-width: 0; padding: 24px; box-sizing: border-box; overflow: auto; }
      .tr9-head { display: flex; align-items: center; gap: 12px; height: 36px; margin-bottom: 18px; }
      .tr9-back { width: 28px; height: 28px; border: 0; border-radius: 50%; background: #fff; color: #52647d; font-size: 22px; line-height: 28px; cursor: pointer; box-shadow: 0 4px 12px rgba(33,52,92,.05); }
      .tr9-title { font-size: 22px; font-weight: 800; color: #172642; }
      .tr9-card { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(35,61,120,.04); }
      .tr9-filter { height: 72px; border-radius: 10px; background: #f7f8fb; display: flex; align-items: center; padding: 0 16px; gap: 32px; box-sizing: border-box; }
      .tr9-searchbox { width: 360px; height: 40px; border: 1px solid #d8deea; border-radius: 8px; background: #fff; display: flex; overflow: hidden; }
      .tr9-search-select { width: 130px; padding: 0 12px; border-right: 1px solid #edf1f7; display: flex; align-items: center; gap: 8px; font-weight: 700; color: #172642; }
      .tr9-search-select:before { content: "⌄"; font-size: 20px; color: #172642; transform: translateY(-1px); }
      .tr9-search-input { flex: 1; display: flex; align-items: center; color: #b0bbca; padding-left: 14px; }
      .tr9-date { display: flex; align-items: center; gap: 12px; color: #172642; font-weight: 700; }
      .tr9-date-range { width: 300px; height: 40px; border: 1px solid #dfe5ef; border-radius: 8px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; box-sizing: border-box; color: #aab5c4; font-weight: 500; }
      .tr9-date-mid { color: #9aa8bc; }
      .tr9-summary { margin: 34px 0 24px; color: #667792; font-size: 14px; display: flex; gap: 20px; }
      .tr9-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
      .tr9-table thead th { height: 52px; background: #f7f7f8; color: #1a2944; font-size: 14px; font-weight: 800; text-align: left; padding: 0 16px; border-right: 1px solid #eef1f6; }
      .tr9-table thead th:last-child { border-right: 0; }
      .tr9-table tbody td { height: 54px; padding: 0 16px; border-bottom: 1px solid #edf0f5; color: #172642; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tr9-table .tr9-service { max-width: 150px; }
      .tr9-pagination { display: flex; justify-content: center; align-items: center; gap: 18px; margin-top: 28px; color: #172642; }
      .tr9-page-nav, .tr9-page-num { min-width: 28px; height: 32px; border: 0; background: transparent; color: #172642; border-radius: 7px; font-size: 15px; cursor: default; }
      .tr9-page-num.active { border: 1px solid #2858ff; color: #2858ff; background: #fff; }
      .tr9-page-size { width: 108px; height: 32px; border: 1px solid #dce3ef; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: #172642; background: #fff; }
      .tr9-go { display: flex; align-items: center; gap: 8px; }
      .tr9-go input { width: 48px; height: 30px; border: 1px solid #dce3ef; border-radius: 7px; outline: none; }
    `;
    document.head.appendChild(style);
  }

  function menuItem(icon, label, hasArrow = true) {
    return `<div class="tr9-menu-item"><span class="tr9-menu-icon">${icon}</span><span>${label}</span>${hasArrow ? '<span class="tr9-menu-arrow">⌄</span>' : ''}</div>`;
  }

  function renderRows() {
    return rows.map(row => `
      <tr>
        <td>${row.tradeNo}</td>
        <td>${row.outerNo}</td>
        <td>${row.channel}</td>
        <td>${row.type}</td>
        <td>${row.amount}</td>
        <td>${row.orderTime}</td>
        <td>${row.orderNo}</td>
        <td class="tr9-service">${row.service}...</td>
      </tr>
    `).join('');
  }

  function renderSidebar() {
    return `
      <aside class="tr9-sidebar">
        <div class="tr9-logo"><span class="tr9-logo-mark"></span><span>全病程管理平台</span></div>
        <div class="tr9-menu">
          ${menuItem('▣', '工作台', false)}
          ${menuItem('▤', '任务管理')}
          ${menuItem('☻', '患者管理')}
          ${menuItem('▤', '方案管理')}
          ${menuItem('◔', '运营管理')}
          ${menuItem('✤', 'AI 客服')}
          ${menuItem('⚙', '系统设置')}
          ${menuItem('▣', '服务管理')}
          <div class="tr9-sub">
            <div class="tr9-sub-item">服务包管理</div>
            <div class="tr9-sub-item">订单管理</div>
            <div class="tr9-sub-item active">交易记录</div>
          </div>
        </div>
        <div class="tr9-sidebar-bottom">
          <div class="tr9-notice"><span>♧</span><span>消息通知</span><span class="tr9-badge">99+</span></div>
          <div class="tr9-user"><span class="tr9-avatar"></span><span>张蓓强</span><span class="tr9-menu-arrow">⌄</span></div>
          <div class="tr9-collapse"><span>≡</span><span>收起面板</span></div>
        </div>
      </aside>
    `;
  }

  function renderPage() {
    injectStyle();
    document.querySelectorAll('#transaction-record-page-v6,#transaction-record-page-v7,#transaction-record-page-v8,#transaction-record-page-v9').forEach(el => el.remove());
    document.body.classList.remove('tr6-active', 'tr7-active', 'tr8-active');
    document.body.classList.add('tr9-active');

    const root = document.createElement('div');
    root.id = 'transaction-record-page-v9';
    root.innerHTML = `
      ${renderSidebar()}
      <main class="tr9-main">
        <div class="tr9-head">
          <button class="tr9-back" type="button">‹</button>
          <div class="tr9-title">交易记录</div>
        </div>
        <section class="tr9-card">
          <div class="tr9-filter">
            <div class="tr9-searchbox">
              <div class="tr9-search-select">就诊人姓名</div>
              <div class="tr9-search-input">请输入</div>
            </div>
            <div class="tr9-date">
              <span>交易日期：</span>
              <div class="tr9-date-range">
                <span>选择时间</span>
                <span class="tr9-date-mid">→</span>
                <span>选择时间</span>
                <span>▣</span>
              </div>
            </div>
          </div>
          <div class="tr9-summary">
            <span>共30条记录</span>
            <span>收入合计：24,000.00</span>
            <span>退款合计：4,000.00</span>
          </div>
          <table class="tr9-table">
            <thead>
              <tr>
                <th style="width: 10%;">交易流水号</th>
                <th style="width: 10%;">外部流水号</th>
                <th style="width: 14%;">支付渠道</th>
                <th style="width: 12%;">交易类型</th>
                <th style="width: 13%;">交易金额（元）</th>
                <th style="width: 16%;">下单时间</th>
                <th style="width: 10%;">订单编号</th>
                <th style="width: 15%;">服务包名称</th>
              </tr>
            </thead>
            <tbody>${renderRows()}</tbody>
          </table>
          <div class="tr9-pagination">
            <button class="tr9-page-nav" type="button">‹</button>
            <button class="tr9-page-num" type="button">1</button>
            <span>...</span>
            <button class="tr9-page-num active" type="button">2</button>
            <button class="tr9-page-num" type="button">3</button>
            <button class="tr9-page-num" type="button">4</button>
            <button class="tr9-page-num" type="button">5</button>
            <span>...</span>
            <button class="tr9-page-num" type="button">50</button>
            <button class="tr9-page-nav" type="button">›</button>
            <div class="tr9-page-size">20 / page⌄</div>
            <div class="tr9-go"><span>Go to</span><input /></div>
          </div>
        </section>
      </main>
    `;
    document.body.appendChild(root);
  }

  function closePage() {
    document.getElementById('transaction-record-page-v9')?.remove();
    document.body.classList.remove('tr9-active');
    if (location.hash === '#transaction-records') history.replaceState(null, '', location.pathname + location.search);
  }

  document.addEventListener('click', event => {
    const back = event.target.closest('.tr9-back');
    if (back) {
      event.preventDefault();
      closePage();
      return;
    }

    const target = event.target.closest('a,button,div,span,li');
    const text = target ? (target.textContent || '').trim() : '';
    if (text === '交易记录') {
      event.preventDefault();
      renderPage();
      if (location.hash !== '#transaction-records') history.replaceState(null, '', '#transaction-records');
    }
  }, true);

  if (location.hash === '#transaction-records') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', renderPage, { once: true });
    } else {
      renderPage();
    }
  }
})();
