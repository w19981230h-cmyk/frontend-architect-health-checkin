(function () {
  if (window.__transactionRecordPageV7) return;
  window.__transactionRecordPageV7 = true;

  var rows = Array.from({ length: 9 }, function () {
    return {
      flow: '12114114',
      external: '124114410',
      channel: '微信支付',
      type: '收入',
      amount: '1124.00',
      time: '2026/02/05 13:30:15',
      order: '1551812111',
      service: '冠心病出院健康服务...'
    };
  });

  function addStyle() {
    if (document.getElementById('transaction-record-page-v7-style')) return;
    var style = document.createElement('style');
    style.id = 'transaction-record-page-v7-style';
    style.textContent = [
      'body.tr7-active{margin:0;overflow:hidden;background:#f4f7ff;}',
      'body.tr7-active>body,body.tr7-active>*:not(#transaction-record-page-v7){display:none!important;}',
      '#transaction-record-page-v7{min-height:100vh;display:flex;background:#f4f7ff;color:#17233d;font:14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",Arial,sans-serif;}',
      '.tr7-sidebar{width:230px;background:#fff;border-right:1px solid #e8edf7;display:flex;flex-direction:column;box-sizing:border-box;}',
      '.tr7-logo{height:72px;display:flex;align-items:center;gap:12px;padding:0 24px;border-bottom:1px solid #eef2f8;font-size:18px;font-weight:800;color:#0e2d66;}',
      '.tr7-mark{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6f37d9,#ff4d7d);position:relative;box-shadow:inset 0 0 0 6px #fff;}',
      '.tr7-mark:after{content:"";position:absolute;right:-6px;bottom:1px;width:11px;height:18px;border-radius:8px;background:#4d7cff;}',
      '.tr7-nav{padding:14px 12px;flex:1;}',
      '.tr7-nav-item,.tr7-sub-item{height:44px;display:flex;align-items:center;gap:12px;padding:0 18px;border-radius:8px;color:#152c58;font-weight:600;box-sizing:border-box;}',
      '.tr7-nav-item svg{width:18px;height:18px;color:#284574}.tr7-nav-item .arrow{margin-left:auto;color:#9aa8bd;}',
      '.tr7-sub{margin:8px 0 14px 0;padding-left:34px;}',
      '.tr7-sub-item{height:42px;color:#5d6d85;font-weight:500;padding-left:14px;}',
      '.tr7-sub-item.active{background:#edf3ff;color:#245bff;position:relative;}',
      '.tr7-sub-item.active:before{content:"";position:absolute;left:0;top:11px;width:3px;height:20px;background:#2f63ff;border-radius:4px;}',
      '.tr7-bottom{border-top:1px solid #eef2f8;padding:16px 12px 18px;}',
      '.tr7-notice{display:flex;align-items:center;gap:12px;padding:10px 18px;color:#152c58;font-weight:600}.tr7-badge{margin-left:auto;background:#ff5a68;color:#fff;border-radius:12px;padding:1px 7px;font-size:11px;}',
      '.tr7-user{margin-top:10px;height:54px;border-radius:10px;background:#f4f7ff;display:flex;align-items:center;gap:10px;padding:0 12px;font-weight:700;color:#152c58}.tr7-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(#fff1e6 0 48%,#4778ff 48%);border:3px solid #dce6ff;}',
      '.tr7-main{flex:1;min-width:0;padding:20px 24px 24px;background:#f4f7ff;box-sizing:border-box;}',
      '.tr7-title{height:34px;display:flex;align-items:center;gap:12px;margin:0 0 14px;color:#1b2b48;font-size:20px;font-weight:800}.tr7-back{width:24px;height:24px;border-radius:50%;background:#fff;border:0;color:#637085;font-size:22px;line-height:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;}',
      '.tr7-card{background:#fff;border-radius:14px;padding:24px 24px 20px;box-shadow:0 18px 45px rgba(35,61,118,.06);min-height:calc(100vh - 102px);box-sizing:border-box;}',
      '.tr7-filter{height:72px;border-radius:8px;background:#f7f8fb;display:flex;align-items:center;padding:0 16px;gap:32px;box-sizing:border-box;}',
      '.tr7-input-group{height:40px;display:flex;border:1px solid #d7dde8;border-radius:7px;background:#fff;overflow:hidden}.tr7-select{min-width:128px;display:flex;align-items:center;gap:10px;padding:0 12px;border-right:1px solid #e6ebf3;color:#182844}.tr7-field{width:214px;display:flex;align-items:center;padding:0 12px;color:#a3adbe}.tr7-label{font-weight:700;color:#1c2c49}.tr7-date{width:288px;height:40px;border:1px solid #d7dde8;border-radius:7px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 12px;color:#a3adbe;box-sizing:border-box}.tr7-date span{color:#a3adbe}.tr7-icon{width:16px;height:16px;color:#98a4b5}.tr7-down{border:solid #17233d;border-width:0 1.5px 1.5px 0;display:inline-block;padding:4px;transform:rotate(45deg);margin-top:-4px;}',
      '.tr7-summary{display:flex;gap:22px;margin:34px 0 26px;color:#66758c;font-size:15px}.tr7-summary b{font-weight:500;color:#66758c;}',
      '.tr7-table{width:100%;border-collapse:collapse;table-layout:fixed}.tr7-table th{height:52px;background:#fafafa;color:#1e2b45;font-weight:800;text-align:left;padding:0 16px;border-right:1px solid #eef1f6}.tr7-table th:last-child{border-right:0}.tr7-table td{height:54px;padding:0 16px;border-bottom:1px solid #eef1f6;color:#14223d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tr7-table th:nth-child(1),.tr7-table td:nth-child(1){width:100px}.tr7-table th:nth-child(2),.tr7-table td:nth-child(2){width:100px}.tr7-table th:nth-child(3),.tr7-table td:nth-child(3){width:120px}.tr7-table th:nth-child(4),.tr7-table td:nth-child(4){width:120px}.tr7-table th:nth-child(5),.tr7-table td:nth-child(5){width:140px}.tr7-table th:nth-child(6),.tr7-table td:nth-child(6){width:170px}.tr7-table th:nth-child(7),.tr7-table td:nth-child(7){width:120px}.tr7-table th:nth-child(8),.tr7-table td:nth-child(8){width:auto;}',
      '.tr7-pager{height:72px;display:flex;align-items:center;justify-content:center;gap:18px;color:#17233d}.tr7-page,.tr7-page-btn{min-width:30px;height:30px;border-radius:6px;display:flex;align-items:center;justify-content:center}.tr7-page.active{border:1px solid #245bff;color:#245bff}.tr7-page-muted{color:#17233d}.tr7-page-btn{font-size:24px}.tr7-size{height:32px;border:1px solid #d7dde8;border-radius:6px;padding:0 12px;display:flex;align-items:center;gap:10px;background:#fff}.tr7-go{display:flex;align-items:center;gap:8px}.tr7-go input{width:50px;height:30px;border:1px solid #d7dde8;border-radius:6px;}',
      '@media(max-width:1100px){.tr7-sidebar{width:210px}.tr7-card{padding:18px}.tr7-filter{gap:16px}.tr7-date{width:240px}.tr7-table{min-width:1000px}.tr7-table-wrap{overflow:auto}}'
    ].join('');
    document.head.appendChild(style);
  }

  function icon(name) {
    var map = {
      work: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="6" width="16" height="11" rx="1.8"/><path d="M9 20h6M12 17v3"/></svg>',
      file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-4 12.5-4 14 0"/></svg>',
      bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l-1 12H7z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9a6 6 0 1 1 12 0v5l2 3H4l2-3z"/><path d="M10 20h4"/></svg>',
      fold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h12M4 17h16"/></svg>',
      gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.3 3a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .3 0 .7.1 1l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.3 3h5l.3-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1z"/></svg>',
      ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.2 5.5L20 11l-5.8 2.5L12 19l-2.2-5.5L4 11l5.8-2.5z"/></svg>',
      service: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>'
    };
    return map[name] || map.file;
  }

  function navItem(label, name, open) {
    return '<div class="tr7-nav-item">' + icon(name) + '<span>' + label + '</span><span class="arrow">' + (open ? '⌄' : '›') + '</span></div>';
  }

  function renderRows() {
    return rows.map(function (r) {
      return '<tr><td>' + r.flow + '</td><td>' + r.external + '</td><td>' + r.channel + '</td><td>' + r.type + '</td><td>' + r.amount + '</td><td>' + r.time + '</td><td>' + r.order + '</td><td>' + r.service + '</td></tr>';
    }).join('');
  }

  function openPage() {
    addStyle();
    var old = document.getElementById('transaction-record-page-v7');
    if (old) old.remove();
    document.body.classList.add('tr7-active');
    var root = document.createElement('div');
    root.id = 'transaction-record-page-v7';
    root.innerHTML =
      '<aside class="tr7-sidebar">' +
        '<div class="tr7-logo"><span class="tr7-mark"></span><span>全病程管理平台</span></div>' +
        '<nav class="tr7-nav">' +
          navItem('工作台', 'work') +
          navItem('任务管理', 'file', true) +
          navItem('患者管理', 'user', true) +
          navItem('方案管理', 'file', true) +
          navItem('运营管理', 'bag', true) +
          navItem('AI 客服', 'ai', true) +
          navItem('系统设置', 'gear', true) +
          navItem('服务管理', 'service', true) +
          '<div class="tr7-sub"><div class="tr7-sub-item">服务包管理</div><div class="tr7-sub-item">订单管理</div><div class="tr7-sub-item active">交易记录</div></div>' +
        '</nav>' +
        '<div class="tr7-bottom"><div class="tr7-notice">' + icon('bell') + '<span>消息通知</span><span class="tr7-badge">99+</span></div><div class="tr7-user"><span class="tr7-avatar"></span><span>张富强</span><span style="margin-left:auto">⌄</span></div><div class="tr7-notice">' + icon('fold') + '<span>收起面板</span></div></div>' +
      '</aside>' +
      '<main class="tr7-main">' +
        '<h1 class="tr7-title"><button class="tr7-back" type="button" aria-label="返回">‹</button><span>交易记录</span></h1>' +
        '<section class="tr7-card">' +
          '<div class="tr7-filter">' +
            '<div class="tr7-input-group"><div class="tr7-select"><i class="tr7-down"></i><span>就诊人姓名</span></div><div class="tr7-field">请输入</div></div>' +
            '<div style="display:flex;align-items:center;gap:14px"><span class="tr7-label">交易日期：</span><div class="tr7-date"><span>选择时间</span><span>→</span><span>选择时间</span>' + icon('calendar').replace('<svg', '<svg class="tr7-icon"') + '</div></div>' +
          '</div>' +
          '<div class="tr7-summary"><span>共30条记录</span><span>收入合计： <b>24,000.00</b></span><span>退款合计： <b>4,000.00</b></span></div>' +
          '<div class="tr7-table-wrap"><table class="tr7-table"><thead><tr><th>交易流水号</th><th>外部流水号</th><th>支付渠道</th><th>交易类型</th><th>交易金额（元）</th><th>下单时间</th><th>订单编号</th><th>服务包名称</th></tr></thead><tbody>' + renderRows() + '</tbody></table></div>' +
          '<div class="tr7-pager"><span class="tr7-page-btn">‹</span><span class="tr7-page">1</span><span class="tr7-page-muted">...</span><span class="tr7-page active">2</span><span class="tr7-page">3</span><span class="tr7-page">4</span><span class="tr7-page">5</span><span class="tr7-page-muted">...</span><span class="tr7-page">50</span><span class="tr7-page-btn">›</span><span class="tr7-size">20 / page <i class="tr7-down"></i></span><span class="tr7-go">Go to <input /></span></div>' +
        '</section>' +
      '</main>';
    document.body.appendChild(root);
    root.querySelector('.tr7-back').addEventListener('click', closePage);
  }

  function closePage() {
    var root = document.getElementById('transaction-record-page-v7');
    if (root) root.remove();
    document.body.classList.remove('tr7-active');
    if (location.hash === '#transaction-records') history.replaceState(null, '', location.pathname + location.search);
  }

  document.addEventListener('click', function (event) {
    if (document.body.classList.contains('tr7-active')) return;
    var target = event.target.closest('a,button,li,div,span');
    if (!target) return;
    var text = (target.textContent || '').trim();
    if (text === '交易记录') {
      event.preventDefault();
      if (location.hash !== '#transaction-records') history.pushState(null, '', '#transaction-records');
      openPage();
    }
  });

  window.addEventListener('hashchange', function () {
    if (location.hash === '#transaction-records') openPage();
  });

  if (location.hash === '#transaction-records') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', openPage);
    else openPage();
  }
})();
