(function () {
  if (window.__transactionRecordPageV4Loaded) return;
  window.__transactionRecordPageV4Loaded = true;

  var rows = Array.from({ length: 9 }).map(function (_, index) {
    return {
      serial: '12114114',
      external: '124114410',
      channel: '微信支付',
      type: '收入',
      amount: '1124.00',
      time: '2026/02/05 13:30:15',
      order: '1551812111',
      service: '冠心病出院健康服务...'
    };
  });

  function injectStyle() {
    if (document.getElementById('transaction-record-page-v4-style')) return;
    var style = document.createElement('style');
    style.id = 'transaction-record-page-v4-style';
    style.textContent = `
      body.transaction-record-page-v4-active > *:not(#transaction-record-page-v4) {
        display: none !important;
      }
      #transaction-record-page-v4 {
        min-height: 100vh;
        background: #f4f7ff;
        color: #17233f;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
      }
      .tr-v4-shell {
        display: flex;
        min-height: 100vh;
      }
      .tr-v4-sidebar {
        width: 230px;
        flex: 0 0 230px;
        background: #fff;
        border-right: 1px solid #eef2f8;
        box-shadow: 10px 0 34px rgba(35, 65, 122, .04);
        display: flex;
        flex-direction: column;
      }
      .tr-v4-brand {
        height: 72px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 28px;
        border-bottom: 1px solid #eef2f8;
        font-size: 18px;
        font-weight: 800;
        color: #0d2b63;
      }
      .tr-v4-logo {
        width: 28px;
        height: 22px;
        border-radius: 12px;
        background: linear-gradient(135deg, #7437ef 0%, #2668ff 46%, #ff5b8d 100%);
        position: relative;
      }
      .tr-v4-logo:after {
        content: "";
        position: absolute;
        right: 4px;
        top: 5px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #fff;
      }
      .tr-v4-menu {
        padding: 18px 12px;
        flex: 1;
      }
      .tr-v4-menu-item,
      .tr-v4-sub-item {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 20px;
        border-radius: 8px;
        color: #0d2b63;
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 6px;
      }
      .tr-v4-menu-icon {
        width: 16px;
        height: 16px;
        border: 1.8px solid #173e86;
        border-radius: 4px;
      }
      .tr-v4-menu-caret {
        margin-left: auto;
        color: #99a8bf;
      }
      .tr-v4-sub {
        margin: 2px 0 12px;
      }
      .tr-v4-sub-item {
        margin-left: 0;
        padding-left: 60px;
        color: #5e6d86;
        font-weight: 500;
      }
      .tr-v4-sub-item.active {
        color: #2864ff;
        background: #edf3ff;
        border-left: 3px solid #2864ff;
        padding-left: 57px;
      }
      .tr-v4-sidebar-bottom {
        border-top: 1px solid #eef2f8;
        padding: 18px 12px 22px;
      }
      .tr-v4-badge {
        margin-left: auto;
        min-width: 28px;
        height: 16px;
        padding: 0 5px;
        border-radius: 10px;
        background: #ff5b74;
        color: #fff;
        font-size: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .tr-v4-user {
        height: 54px;
        border-radius: 10px;
        background: #f5f8ff;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 16px;
        margin-top: 12px;
        color: #0d2b63;
        font-weight: 700;
      }
      .tr-v4-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 34%, #ffe0c8 0 28%, transparent 29%), linear-gradient(#2f65ff 0 0) bottom/100% 40% no-repeat, #eaf1ff;
        border: 1px solid #d7e4ff;
      }
      .tr-v4-main {
        flex: 1;
        min-width: 0;
        padding: 22px 24px 30px;
      }
      .tr-v4-title {
        display: flex;
        align-items: center;
        gap: 12px;
        height: 36px;
        font-size: 22px;
        font-weight: 800;
        color: #17233f;
        margin-bottom: 20px;
      }
      .tr-v4-back {
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 50%;
        background: #fff;
        color: #7b8aa3;
        font-size: 22px;
        line-height: 20px;
        cursor: pointer;
      }
      .tr-v4-card {
        background: #fff;
        border-radius: 14px;
        padding: 24px 24px 28px;
        box-shadow: 0 12px 34px rgba(31, 62, 120, .05);
      }
      .tr-v4-filter {
        height: 72px;
        border-radius: 8px;
        background: #f7f8fb;
        display: flex;
        align-items: center;
        gap: 32px;
        padding: 0 16px;
        margin-bottom: 30px;
      }
      .tr-v4-input-group {
        display: flex;
        height: 40px;
        border: 1px solid #d9dee9;
        border-radius: 7px;
        overflow: hidden;
        background: #fff;
      }
      .tr-v4-select-like {
        min-width: 132px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #17233f;
        border-right: 1px solid #e6eaf1;
        font-size: 15px;
      }
      .tr-v4-placeholder {
        width: 220px;
        display: flex;
        align-items: center;
        padding: 0 14px;
        color: #b3bdcc;
      }
      .tr-v4-date-label {
        font-size: 15px;
        font-weight: 700;
        color: #17233f;
      }
      .tr-v4-date {
        width: 300px;
        height: 40px;
        border: 1px solid #e1e6ef;
        border-radius: 7px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        color: #b3bdcc;
      }
      .tr-v4-summary {
        display: flex;
        gap: 26px;
        color: #6d7b92;
        font-size: 14px;
        margin-bottom: 30px;
      }
      .tr-v4-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 14px;
      }
      .tr-v4-table th {
        height: 52px;
        background: #fafafa;
        color: #17233f;
        font-weight: 800;
        text-align: left;
        padding: 0 16px;
        border-right: 1px solid #f0f1f5;
      }
      .tr-v4-table th:last-child {
        border-right: 0;
      }
      .tr-v4-table td {
        height: 52px;
        padding: 0 16px;
        border-bottom: 1px solid #edf0f5;
        color: #17233f;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tr-v4-pager {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        color: #17233f;
        font-size: 14px;
      }
      .tr-v4-page,
      .tr-v4-page-arrow {
        min-width: 30px;
        height: 30px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .tr-v4-page.active {
        border: 1px solid #1f55ff;
        color: #1f55ff;
      }
      .tr-v4-page-size,
      .tr-v4-jump {
        height: 32px;
        border: 1px solid #d9dee9;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #fff;
      }
      .tr-v4-page-size {
        width: 108px;
      }
      .tr-v4-jump {
        width: 48px;
      }
    `;
    document.head.appendChild(style);
  }

  function renderRows() {
    return rows.map(function (row) {
      return [
        '<tr>',
        '<td>' + row.serial + '</td>',
        '<td>' + row.external + '</td>',
        '<td>' + row.channel + '</td>',
        '<td>' + row.type + '</td>',
        '<td>' + row.amount + '</td>',
        '<td>' + row.time + '</td>',
        '<td>' + row.order + '</td>',
        '<td title="冠心病出院健康服务包">' + row.service + '</td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function getPageHtml() {
    return [
      '<div class="tr-v4-shell">',
      '<aside class="tr-v4-sidebar">',
      '<div class="tr-v4-brand"><span class="tr-v4-logo"></span><span>全病程管理平台</span></div>',
      '<nav class="tr-v4-menu">',
      menuItem('工作台'),
      menuItem('任务管理'),
      menuItem('患者管理'),
      menuItem('方案管理'),
      menuItem('运营管理'),
      menuItem('AI 客服'),
      menuItem('系统设置'),
      menuItem('服务管理'),
      '<div class="tr-v4-sub">',
      '<div class="tr-v4-sub-item">服务包管理</div>',
      '<div class="tr-v4-sub-item">订单管理</div>',
      '<div class="tr-v4-sub-item active">交易记录</div>',
      '</div>',
      '</nav>',
      '<div class="tr-v4-sidebar-bottom">',
      '<div class="tr-v4-menu-item"><span class="tr-v4-menu-icon"></span><span>消息通知</span><span class="tr-v4-badge">99+</span></div>',
      '<div class="tr-v4-user"><span class="tr-v4-avatar"></span><span>张蓉强</span><span class="tr-v4-menu-caret">⌄</span></div>',
      '<div class="tr-v4-menu-item" style="margin-top:18px;color:#5e6d86;"><span class="tr-v4-menu-icon"></span><span>收起面板</span></div>',
      '</div>',
      '</aside>',
      '<main class="tr-v4-main">',
      '<div class="tr-v4-title"><button class="tr-v4-back" data-tr-v4-back>‹</button><span>交易记录</span></div>',
      '<section class="tr-v4-card">',
      '<div class="tr-v4-filter">',
      '<div class="tr-v4-input-group"><div class="tr-v4-select-like">就诊人姓名 <span>⌄</span></div><div class="tr-v4-placeholder">请输入</div></div>',
      '<div style="display:flex;align-items:center;gap:14px;"><span class="tr-v4-date-label">交易日期：</span><div class="tr-v4-date"><span>选择时间</span><span>→</span><span>选择时间</span><span>□</span></div></div>',
      '</div>',
      '<div class="tr-v4-summary"><span>共30条记录</span><span>收入合计： 24,000.00</span><span>退款合计： 4,000.00</span></div>',
      '<table class="tr-v4-table">',
      '<colgroup><col style="width:10%"><col style="width:10%"><col style="width:13%"><col style="width:13%"><col style="width:14%"><col style="width:16%"><col style="width:10%"><col style="width:14%"></colgroup>',
      '<thead><tr>',
      '<th>交易流水号</th><th>外部流水号</th><th>支付渠道</th><th>交易类型</th><th>交易金额（元）</th><th>下单时间</th><th>订单编号</th><th>服务包名称</th>',
      '</tr></thead>',
      '<tbody>' + renderRows() + '</tbody>',
      '</table>',
      '<div class="tr-v4-pager"><span class="tr-v4-page-arrow">‹</span><span>1</span><span>...</span><span class="tr-v4-page active">2</span><span>3</span><span>4</span><span>5</span><span>...</span><span>50</span><span class="tr-v4-page-arrow">›</span><span class="tr-v4-page-size">20 / page⌄</span><span>Go to</span><span class="tr-v4-jump"></span></div>',
      '</section>',
      '</main>',
      '</div>'
    ].join('');
  }

  function menuItem(label) {
    return '<div class="tr-v4-menu-item"><span class="tr-v4-menu-icon"></span><span>' + label + '</span><span class="tr-v4-menu-caret">⌄</span></div>';
  }

  function show() {
    injectStyle();
    document.querySelectorAll('#transaction-record-page-v2,#transaction-record-page-v3').forEach(function (node) {
      node.remove();
    });
    document.body.classList.remove('transaction-record-page-v2-active', 'transaction-record-page-v3-active');
    var page = document.getElementById('transaction-record-page-v4');
    if (!page) {
      page = document.createElement('div');
      page.id = 'transaction-record-page-v4';
      page.innerHTML = getPageHtml();
      document.body.appendChild(page);
    }
    document.body.classList.add('transaction-record-page-v4-active');
    if (location.hash !== '#transaction-records') {
      history.pushState(null, document.title, location.pathname + location.search + '#transaction-records');
    }
  }

  function hide() {
    document.body.classList.remove('transaction-record-page-v4-active');
    if (location.hash === '#transaction-records') {
      history.pushState(null, document.title, location.pathname + location.search);
    }
  }

  document.addEventListener('click', function (event) {
    var backButton = event.target.closest('[data-tr-v4-back]');
    if (backButton) {
      event.preventDefault();
      hide();
      return;
    }
    if (event.target.closest('#transaction-record-page-v4')) return;
    var target = event.target.closest('a,button,li,div,span');
    if (!target) return;
    var text = (target.textContent || '').replace(/\s+/g, '');
    if (text === '交易记录' || (text.indexOf('交易记录') >= 0 && text.length <= 12)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      show();
    }
  }, true);

  window.addEventListener('hashchange', function () {
    if (location.hash === '#transaction-records') {
      show();
    } else {
      document.body.classList.remove('transaction-record-page-v4-active');
    }
  });

  if (location.hash === '#transaction-records') {
    show();
  }
})();
