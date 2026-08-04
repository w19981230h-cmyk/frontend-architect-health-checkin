(function () {
  if (window.__transactionRecordPageV6) return;
  window.__transactionRecordPageV6 = true;

  const records = Array.from({ length: 9 }).map((_, index) => ({
    tradeNo: '12114114',
    outerNo: '124114410',
    channel: '微信支付',
    type: '收入',
    amount: '1124.00',
    orderTime: '2026/02/05 13:30:15',
    orderNo: '1551812111',
    service: '冠心病出院健康服务...',
    key: `record-${index}`,
  }));

  const menuGroups = [
    ['工作台'],
    ['任务管理'],
    ['患者管理'],
    ['方案管理'],
    ['运营管理'],
    ['AI 客服'],
    ['系统设置'],
    ['服务管理', '服务包管理', '订单管理', '交易记录'],
  ];

  function ensureStyle() {
    if (document.getElementById('transaction-record-page-v6-style')) return;
    const style = document.createElement('style');
    style.id = 'transaction-record-page-v6-style';
    style.textContent = `
      body.tr6-active > *:not(#transaction-record-page-v6) { display: none !important; }
      #transaction-record-page-v6 { min-height: 100vh; display: flex; background: #f4f7ff; color: #172947; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif; }
      .tr6-sidebar { width: 230px; background: #fff; border-right: 1px solid #e7edf7; display: flex; flex-direction: column; flex-shrink: 0; }
      .tr6-logo { height: 72px; padding: 0 24px; display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 18px; color: #0b2f6b; border-bottom: 1px solid #edf1f7; }
      .tr6-logo-mark { width: 28px; height: 28px; border-radius: 10px; background: linear-gradient(135deg,#7a35ff,#ff4b7d); position: relative; }
      .tr6-logo-mark::after { content: ""; position: absolute; inset: 7px 5px; border: 4px solid #fff; border-left-color: transparent; border-radius: 50%; }
      .tr6-menu { padding: 18px 12px; flex: 1; }
      .tr6-menu-title { height: 38px; display: flex; align-items: center; gap: 10px; padding: 0 20px; color: #18345f; font-weight: 700; border-radius: 8px; margin-top: 8px; }
      .tr6-menu-title::before { content: ""; width: 16px; height: 16px; border: 1.8px solid #2b4b7c; border-radius: 3px; box-sizing: border-box; }
      .tr6-sub { margin: 4px 0 4px 48px; height: 38px; line-height: 38px; color: #5b6b83; font-size: 15px; }
      .tr6-sub.active { margin-left: 0; padding-left: 48px; color: #245cff; background: #edf3ff; border-left: 3px solid #245cff; border-radius: 0 8px 8px 0; font-weight: 700; }
      .tr6-sidebar-bottom { border-top: 1px solid #edf1f7; padding: 16px 14px 20px; }
      .tr6-notice { display: flex; align-items: center; justify-content: space-between; color: #344767; font-size: 14px; margin-bottom: 14px; }
      .tr6-badge { background: #ff5b6c; color: #fff; border-radius: 999px; padding: 2px 8px; font-size: 12px; font-weight: 700; }
      .tr6-user { height: 52px; border-radius: 10px; background: #f3f7ff; display: flex; align-items: center; gap: 12px; padding: 0 12px; font-weight: 700; }
      .tr6-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(#fff2eb 0 44%, #1f52ff 45% 100%); border: 3px solid #dbe7ff; box-sizing: border-box; display: inline-block; }
      .tr6-main { flex: 1; min-width: 0; padding: 22px 24px 30px; }
      .tr6-title { height: 36px; display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 800; margin-bottom: 18px; }
      .tr6-back { width: 24px; height: 24px; border: 0; border-radius: 50%; background: #fff; color: #6f7c90; cursor: pointer; font-size: 20px; line-height: 22px; }
      .tr6-card { background: #fff; border-radius: 14px; padding: 24px; box-shadow: 0 8px 28px rgba(29, 55, 97, .05); }
      .tr6-filter { height: 72px; background: #f7f8fc; border-radius: 8px; display: flex; align-items: center; padding: 0 16px; gap: 32px; margin-bottom: 34px; }
      .tr6-search { width: 358px; height: 40px; display: flex; border: 1px solid #d8dee9; border-radius: 7px; overflow: hidden; background: #fff; }
      .tr6-select { width: 128px; border-right: 1px solid #edf1f7; display: flex; align-items: center; justify-content: center; gap: 8px; color: #172947; }
      .tr6-input { flex: 1; display: flex; align-items: center; padding-left: 12px; color: #a2adbd; }
      .tr6-date-label { font-weight: 700; margin-right: 8px; }
      .tr6-date { width: 285px; height: 40px; border: 1px solid #e2e7f0; background: #fff; border-radius: 7px; display: flex; align-items: center; justify-content: space-around; color: #a2adbd; }
      .tr6-summary { color: #63718a; font-size: 14px; margin-bottom: 28px; }
      .tr6-summary span { margin-right: 20px; }
      .tr6-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
      .tr6-table th { height: 52px; background: #fafafa; text-align: left; color: #172947; font-size: 14px; font-weight: 800; padding: 0 16px; border-bottom: 1px solid #f0f2f6; }
      .tr6-table td { height: 54px; color: #172947; font-size: 14px; padding: 0 16px; border-bottom: 1px solid #eef1f5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tr6-table th + th, .tr6-table td + td { border-left: 1px solid transparent; }
      .tr6-pager { margin-top: 28px; display: flex; align-items: center; justify-content: center; gap: 18px; color: #1c2940; font-size: 14px; }
      .tr6-page { min-width: 30px; height: 30px; border: 1px solid transparent; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; }
      .tr6-page.active { color: #245cff; border-color: #245cff; }
      .tr6-page-select, .tr6-go { height: 32px; border: 1px solid #d9e0ea; border-radius: 6px; background: #fff; padding: 0 12px; color: #1c2940; }
      .tr6-go { width: 48px; padding: 0; }
    `;
    document.head.appendChild(style);
  }

  function renderRows() {
    return records.map((item) => `
      <tr>
        <td>${item.tradeNo}</td>
        <td>${item.outerNo}</td>
        <td>${item.channel}</td>
        <td>${item.type}</td>
        <td>${item.amount}</td>
        <td>${item.orderTime}</td>
        <td>${item.orderNo}</td>
        <td title="冠心病出院健康服务包">${item.service}</td>
      </tr>
    `).join('');
  }

  function renderSidebar() {
    return menuGroups.map((group) => {
      if (group.length === 1) return `<div class="tr6-menu-title">${group[0]}</div>`;
      const [, ...children] = group;
      return `
        <div class="tr6-menu-title">${group[0]}</div>
        ${children.map((child) => `<div class="tr6-sub ${child === '交易记录' ? 'active' : ''}">${child}</div>`).join('')}
      `;
    }).join('');
  }

  function closePage() {
    document.body.classList.remove('tr6-active');
    document.getElementById('transaction-record-page-v6')?.remove();
    if (location.hash === '#transaction-records') {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function openPage() {
    ensureStyle();
    let root = document.getElementById('transaction-record-page-v6');
    if (!root) {
      root = document.createElement('div');
      root.id = 'transaction-record-page-v6';
      document.body.appendChild(root);
    }
    root.innerHTML = `
      <aside class="tr6-sidebar">
        <div class="tr6-logo"><span class="tr6-logo-mark"></span><span>全病程管理平台</span></div>
        <nav class="tr6-menu">${renderSidebar()}</nav>
        <div class="tr6-sidebar-bottom">
          <div class="tr6-notice"><span>消息通知</span><span class="tr6-badge">99+</span></div>
          <div class="tr6-user"><span class="tr6-avatar"></span><span>张富强</span><span style="margin-left:auto">⌄</span></div>
          <div style="margin-top:18px;color:#5b6b83;font-size:14px;">☰　收起面板</div>
        </div>
      </aside>
      <main class="tr6-main">
        <div class="tr6-title"><button class="tr6-back" type="button">‹</button><span>交易记录</span></div>
        <section class="tr6-card">
          <div class="tr6-filter">
            <div class="tr6-search">
              <div class="tr6-select">⌄ 就诊人姓名</div>
              <div class="tr6-input">请输入</div>
            </div>
            <div style="display:flex;align-items:center;">
              <span class="tr6-date-label">交易日期：</span>
              <div class="tr6-date"><span>选择时间</span><span>→</span><span>选择时间</span><span>▣</span></div>
            </div>
          </div>
          <div class="tr6-summary">
            <span>共30条记录</span>
            <span>收入合计：24,000.00</span>
            <span>退款合计：4,000.00</span>
          </div>
          <table class="tr6-table">
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
          <div class="tr6-pager">
            <span>‹</span><span class="tr6-page">1</span><span>...</span><span class="tr6-page active">2</span>
            <span class="tr6-page">3</span><span class="tr6-page">4</span><span class="tr6-page">5</span><span>...</span>
            <span class="tr6-page">50</span><span>›</span>
            <button class="tr6-page-select" type="button">20 / page⌄</button><span>Go to</span><input class="tr6-go" />
          </div>
        </section>
      </main>
    `;
    root.querySelector('.tr6-back')?.addEventListener('click', closePage);
    document.body.classList.add('tr6-active');
    if (location.hash !== '#transaction-records') history.replaceState(null, '', '#transaction-records');
  }

  document.addEventListener('click', function (event) {
    const target = event.target.closest('a,button,li,div,span');
    if (!target) return;
    const text = (target.textContent || '').replace(/\s+/g, '');
    if (text.includes('交易记录') && text.length <= 20) {
      event.preventDefault();
      event.stopPropagation();
      openPage();
    }
  }, true);

  window.addEventListener('hashchange', function () {
    if (location.hash === '#transaction-records') openPage();
  });

  if (location.hash === '#transaction-records') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', openPage, { once: true });
    } else {
      openPage();
    }
  }
})();
