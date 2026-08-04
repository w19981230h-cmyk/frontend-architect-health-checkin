(function () {
  if (window.__transactionRecordPageV13) return;
  window.__transactionRecordPageV13 = true;

  const rows = Array.from({ length: 9 }, () => ({
    serial: '12114114',
    external: '124114410',
    channel: '微信支付',
    type: '收入',
    amount: '1124.00',
    orderTime: '2026/02/05 13:30:15',
    orderNo: '1551812111',
    service: '冠心病出院健康服务...'
  }));

  const sidebarItems = [
    ['工作台', 'monitor'],
    ['任务管理', 'clipboard'],
    ['患者管理', 'user'],
    ['方案管理', 'file'],
    ['运营管理', 'chart'],
    ['AI 客服', 'spark'],
    ['系统设置', 'gear']
  ];

  function icon(type) {
    const common = 'width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    const map = {
      monitor: `<svg ${common}><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8M12 16v4"></path></svg>`,
      clipboard: `<svg ${common}><path d="M9 3h6l1 2h3v16H5V5h3l1-2z"></path><path d="M9 9h6M9 13h6M9 17h4"></path></svg>`,
      user: `<svg ${common}><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
      file: `<svg ${common}><path d="M6 3h9l3 3v15H6z"></path><path d="M14 3v4h4M9 12h6M9 16h6"></path></svg>`,
      chart: `<svg ${common}><path d="M4 19V5"></path><path d="M4 19h16"></path><rect x="7" y="10" width="3" height="6"></rect><rect x="12" y="7" width="3" height="9"></rect><rect x="17" y="12" width="3" height="4"></rect></svg>`,
      spark: `<svg ${common}><path d="M12 2l2.2 6.1L20 10l-5.8 1.9L12 18l-2.2-6.1L4 10l5.8-1.9z"></path></svg>`,
      gear: `<svg ${common}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2 2 0 1 1-2.83 2.83l-.04-.04A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 1.8 1.8 0 0 0-.5 1.3V21a2 2 0 1 1-4 0v-.06A1.8 1.8 0 0 0 8 19.4a1.8 1.8 0 0 0-1.98.36l-.04.04a2 2 0 1 1-2.83-2.83l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 1.8 1.8 0 0 0-1.3-.5H2.6a2 2 0 1 1 0-4h.06A1.8 1.8 0 0 0 4.6 8a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2 2 0 0 1 2.83-2.83l.04.04A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 1.8 1.8 0 0 0 .5-1.3V2.6a2 2 0 1 1 4 0v.06A1.8 1.8 0 0 0 15 4.6a1.8 1.8 0 0 0 1.98-.36l.04-.04a2 2 0 1 1 2.83 2.83l-.04.04A1.8 1.8 0 0 0 19.4 9c.32.21.56.53.6 1h.4a2 2 0 1 1 0 4h-.06a1.8 1.8 0 0 0-.94 1z"></path></svg>`,
      service: `<svg ${common}><rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M8 8h8M8 12h8M8 16h5"></path></svg>`,
      bell: `<svg ${common}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg>`,
      back: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>`,
      calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>`
    };
    return map[type] || '';
  }

  function renderRows() {
    return rows.map((row) => `
      <tr>
        <td>${row.serial}</td>
        <td>${row.external}</td>
        <td>${row.channel}</td>
        <td>${row.type}</td>
        <td>${row.amount}</td>
        <td>${row.orderTime}</td>
        <td>${row.orderNo}</td>
        <td class="tr13-service">${row.service}</td>
      </tr>
    `).join('');
  }

  function renderPage() {
    return `
      <div class="tr13-page">
        <aside class="tr13-sidebar">
          <div class="tr13-logo">
            <span class="tr13-logo-mark"><span></span></span>
            <strong>全病程管理平台</strong>
          </div>
          <nav class="tr13-nav">
            ${sidebarItems.map(([label, type]) => `
              <div class="tr13-nav-item">
                <span>${icon(type)}</span>
                <b>${label}</b>
                <i>⌄</i>
              </div>
            `).join('')}
            <div class="tr13-nav-item tr13-service-root">
              <span>${icon('service')}</span>
              <b>服务管理</b>
              <i>⌄</i>
            </div>
            <div class="tr13-sub-nav">
              <button class="tr13-sub-active">服务包管理</button>
              <button>订单管理</button>
              <button class="tr13-trade-entry">交易记录</button>
            </div>
          </nav>
          <div class="tr13-sidebar-footer">
            <div class="tr13-message">
              <span>${icon('bell')}</span>
              <b>消息通知</b>
              <em>99+</em>
            </div>
            <div class="tr13-user-card">
              <div class="tr13-doctor"></div>
              <b>张富强</b>
              <i>⌄</i>
            </div>
            <div class="tr13-collapse">☰　收起面板</div>
          </div>
        </aside>
        <main class="tr13-main">
          <header class="tr13-title">
            <button class="tr13-back" aria-label="返回">${icon('back')}</button>
            <h1>交易记录</h1>
          </header>
          <section class="tr13-card">
            <div class="tr13-filter">
              <div class="tr13-search">
                <button>⌄　就诊人姓名</button>
                <input placeholder="请输入" />
              </div>
              <label>交易日期：</label>
              <div class="tr13-date-range">
                <span>选择时间</span>
                <i>→</i>
                <span>选择时间</span>
                ${icon('calendar')}
              </div>
            </div>
            <div class="tr13-summary">
              <span>共30条记录</span>
              <span>收入合计： <b>24,000.00</b></span>
              <span>退款合计： <b>4,000.00</b></span>
            </div>
            <table class="tr13-table">
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
            <div class="tr13-pagination">
              <button class="tr13-page-arrow">‹</button>
              <button>1</button>
              <span>...</span>
              <button class="tr13-current">2</button>
              <button>3</button>
              <button>4</button>
              <button>5</button>
              <span>...</span>
              <button>50</button>
              <button class="tr13-page-arrow">›</button>
              <select><option>20 / page</option></select>
              <span>Go to</span>
              <input />
            </div>
          </section>
        </main>
      </div>
    `;
  }

  function mount() {
    if (document.getElementById('transaction-record-root-v13')) return;
    const root = document.createElement('div');
    root.id = 'transaction-record-root-v13';
    root.innerHTML = renderPage();
    document.body.appendChild(root);
    root.addEventListener('click', (event) => {
      if (event.target.closest('.tr13-back')) {
        history.pushState(null, '', location.pathname);
        sync();
      }
    });
  }

  function sync() {
    const active = /transaction-record|trade-record/.test(location.hash);
    const root = document.getElementById('transaction-record-root-v13');
    if (active) {
      mount();
      document.body.classList.add('tr13-mode');
    } else {
      document.body.classList.remove('tr13-mode');
      if (root) root.remove();
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('a, button, div, span');
    if (!target) return;
    if ((target.textContent || '').trim() === '交易记录') {
      event.preventDefault();
      history.pushState(null, '', '#transaction-records');
      sync();
    }
  }, true);

  window.addEventListener('hashchange', sync);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync);
  } else {
    sync();
  }
})();
