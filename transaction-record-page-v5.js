(function () {
  if (window.__transactionRecordPageV5) return;
  window.__transactionRecordPageV5 = true;

  var pageId = 'transaction-record-page-v5';
  var rows = Array.from({ length: 9 }, function () {
    return ['12114114', '124114410', '微信支付', '收入', '1124.00', '2026/02/05 13:30:15', '1551812111', '冠心病出院健康服务...'];
  });

  function injectStyle() {
    if (document.getElementById(pageId + '-style')) return;
    var style = document.createElement('style');
    style.id = pageId + '-style';
    style.textContent = `
      body.tr5-active{margin:0;background:#f4f7ff;overflow:hidden}
      body.tr5-active>*:not(#transaction-record-page-v5){display:none!important}
      #transaction-record-page-v5{position:fixed;inset:0;z-index:2147483000;background:#f4f7ff;color:#17233d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',Arial,sans-serif}
      .tr5{display:flex;height:100vh}
      .tr5-side{width:230px;background:#fbfcff;border-right:1px solid #edf1f7;display:flex;flex-direction:column}
      .tr5-logo{height:72px;display:flex;align-items:center;gap:12px;padding:0 28px;border-bottom:1px solid #edf1f7;font-size:20px;font-weight:800;color:#123b82}
      .tr5-logo-mark{width:26px;height:26px;border-radius:10px;background:linear-gradient(135deg,#7048ff,#fb4a9b);position:relative}
      .tr5-logo-mark:after{content:'';position:absolute;inset:7px;border:4px solid #fff;border-left-color:transparent;border-radius:50%}
      .tr5-menu{padding:18px 12px;flex:1}
      .tr5-menu-item,.tr5-group-title{height:44px;display:flex;align-items:center;gap:12px;padding:0 18px;margin:6px 0;border-radius:10px;color:#18325f;font-size:15px;font-weight:700}
      .tr5-menu-item svg,.tr5-group-title svg{width:17px;height:17px;color:#163e7d}
      .tr5-chevron{margin-left:auto;color:#9aa8bd}
      .tr5-sub{height:42px;margin:4px 0 4px 48px;padding-left:14px;display:flex;align-items:center;border-radius:9px;color:#64738c;font-size:15px}
      .tr5-sub.on{background:#eef4ff;color:#2861ff;font-weight:700;position:relative}
      .tr5-sub.on:before{content:'';position:absolute;left:-48px;top:9px;width:3px;height:24px;border-radius:4px;background:#2861ff}
      .tr5-bottom{border-top:1px solid #edf1f7;padding:18px 12px}
      .tr5-notice{display:flex;align-items:center;gap:10px;height:38px;color:#1d3764;font-weight:600}
      .tr5-badge{margin-left:auto;background:#ff4d66;color:#fff;border-radius:999px;padding:1px 7px;font-size:11px}
      .tr5-user{height:52px;margin-top:12px;border-radius:12px;background:#f2f6ff;display:flex;align-items:center;gap:10px;padding:0 12px;font-weight:700}
      .tr5-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(#fff0e7 0 45%,#194cae 46% 58%,#4f7dff 59%);box-shadow:inset 0 0 0 2px #d8e4ff}
      .tr5-collapse{height:36px;display:flex;align-items:center;gap:10px;color:#5b6b84;margin-top:12px;padding-left:18px}
      .tr5-main{flex:1;overflow:auto;padding:24px 24px 32px;background:#f4f7ff}
      .tr5-title{display:flex;align-items:center;gap:12px;font-size:22px;font-weight:800;margin-bottom:22px}
      .tr5-back{width:28px;height:28px;border:0;border-radius:50%;background:#fff;color:#748399;font-size:24px;line-height:26px;cursor:pointer}
      .tr5-card{background:#fff;border-radius:16px;padding:24px;box-shadow:0 18px 45px rgba(31,62,109,.05)}
      .tr5-filter{height:72px;background:#f7f8fb;border-radius:8px;display:flex;align-items:center;padding:0 16px;margin-bottom:32px;gap:34px}
      .tr5-combo{width:360px;height:40px;border:1px solid #d5dbe6;border-radius:7px;background:#fff;display:flex;align-items:center}
      .tr5-select{width:132px;height:100%;display:flex;align-items:center;gap:8px;padding-left:16px;border-right:1px solid #e8ecf3;color:#17233d}
      .tr5-input{flex:1;padding-left:16px;color:#a9b3c3}
      .tr5-date{display:flex;align-items:center;gap:14px;font-weight:700}
      .tr5-range{width:292px;height:40px;border:1px solid #e0e5ee;border-radius:7px;background:#fff;display:flex;align-items:center;justify-content:space-around;color:#b2bdcc;font-weight:400}
      .tr5-summary{display:flex;gap:24px;color:#6d7c92;font-size:15px;margin-bottom:30px}
      .tr5-summary b{font-weight:500;color:#65748b}
      .tr5-table{width:100%;border-collapse:collapse;table-layout:fixed}
      .tr5-table thead{background:#fafafa}
      .tr5-table th{height:52px;text-align:left;padding:0 16px;font-size:15px;color:#17233d;font-weight:800;border-right:1px solid #f0f0f0}
      .tr5-table th:last-child{border-right:0}
      .tr5-table td{height:53px;padding:0 16px;border-bottom:1px solid #f0f1f4;font-size:14px;color:#17233d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .tr5-pkg{max-width:170px}
      .tr5-pager{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:30px;color:#17233d}
      .tr5-page{min-width:31px;height:31px;border:1px solid transparent;border-radius:6px;background:#fff;display:flex;align-items:center;justify-content:center}
      .tr5-page.on{border-color:#2457ff;color:#2457ff}
      .tr5-size{height:32px;border:1px solid #d9dee8;border-radius:6px;padding:0 14px;background:#fff}
      .tr5-goto{width:48px;height:31px;border:1px solid #d9dee8;border-radius:6px}
    `;
    document.head.appendChild(style);
  }

  function icon(name) {
    var map = {
      work: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M9 20h6M12 17v3"/></svg>',
      doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4h7l4 4v12H8z"/><path d="M14 4v5h5M10 13h6M10 17h5"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.6-4 14.4-4 16 0"/></svg>',
      bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="7" width="14" height="13" rx="2"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9a6 6 0 0 1 12 0v5l2 3H4l2-3z"/><path d="M10 20h4"/></svg>'
    };
    return map[name] || map.doc;
  }

  function sidebar() {
    return [
      '<aside class="tr5-side">',
      '<div class="tr5-logo"><span class="tr5-logo-mark"></span><span>全病程管理平台</span></div>',
      '<div class="tr5-menu">',
      '<div class="tr5-menu-item">' + icon('work') + '<span>工作台</span></div>',
      '<div class="tr5-group-title">' + icon('doc') + '<span>任务管理</span><span class="tr5-chevron">⌄</span></div>',
      '<div class="tr5-group-title">' + icon('user') + '<span>患者管理</span><span class="tr5-chevron">⌄</span></div>',
      '<div class="tr5-group-title">' + icon('doc') + '<span>方案管理</span><span class="tr5-chevron">⌄</span></div>',
      '<div class="tr5-group-title">' + icon('bag') + '<span>运营管理</span><span class="tr5-chevron">⌄</span></div>',
      '<div class="tr5-group-title">' + icon('doc') + '<span>AI 客服</span><span class="tr5-chevron">⌄</span></div>',
      '<div class="tr5-group-title">' + icon('doc') + '<span>系统设置</span><span class="tr5-chevron">⌄</span></div>',
      '<div class="tr5-group-title">' + icon('bag') + '<span>服务管理</span><span class="tr5-chevron">⌄</span></div>',
      '<div class="tr5-sub">服务包管理</div><div class="tr5-sub">订单管理</div><div class="tr5-sub on">交易记录</div>',
      '</div>',
      '<div class="tr5-bottom"><div class="tr5-notice">' + icon('bell') + '消息通知 <span class="tr5-badge">99+</span></div><div class="tr5-user"><span class="tr5-avatar"></span><span>张睿强</span><span class="tr5-chevron">⌄</span></div><div class="tr5-collapse">' + icon('doc') + '收起面板</div></div>',
      '</aside>'
    ].join('');
  }

  function tableRows() {
    return rows.map(function (row) {
      return '<tr>' + row.map(function (cell, index) {
        return '<td class="' + (index === 7 ? 'tr5-pkg' : '') + '">' + cell + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  function show() {
    injectStyle();
    var old = document.getElementById(pageId);
    if (old) old.remove();
    document.body.classList.add('tr5-active');
    document.body.insertAdjacentHTML('beforeend',
      '<div id="' + pageId + '" class="tr5">' +
      sidebar() +
      '<main class="tr5-main">' +
      '<div class="tr5-title"><button class="tr5-back" data-tr5-back>‹</button><span>交易记录</span></div>' +
      '<section class="tr5-card">' +
      '<div class="tr5-filter">' +
      '<div class="tr5-combo"><div class="tr5-select">⌄ <span>就诊人姓名</span></div><div class="tr5-input">请输入</div></div>' +
      '<div class="tr5-date"><span>交易日期：</span><div class="tr5-range"><span>选择时间</span><span>→</span><span>选择时间</span><span>▣</span></div></div>' +
      '</div>' +
      '<div class="tr5-summary"><span>共30条记录</span><span>收入合计： <b>24,000.00</b></span><span>退款合计： <b>4,000.00</b></span></div>' +
      '<table class="tr5-table"><thead><tr><th>交易流水号</th><th>外部流水号</th><th>支付渠道</th><th>交易类型</th><th>交易金额（元）</th><th>下单时间</th><th>订单编号</th><th>服务包名称</th></tr></thead><tbody>' + tableRows() + '</tbody></table>' +
      '<div class="tr5-pager"><span>‹</span><span class="tr5-page">1</span><span>...</span><span class="tr5-page on">2</span><span class="tr5-page">3</span><span class="tr5-page">4</span><span class="tr5-page">5</span><span>...</span><span class="tr5-page">50</span><span>›</span><button class="tr5-size">20 / page⌄</button><span>Go to</span><input class="tr5-goto"></div>' +
      '</section>' +
      '</main></div>'
    );
  }

  function hide() {
    var page = document.getElementById(pageId);
    if (page) page.remove();
    document.body.classList.remove('tr5-active');
    if (location.hash === '#transaction-records') {
      history.pushState('', document.title, location.pathname + location.search);
    }
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-tr5-back]')) {
      event.preventDefault();
      hide();
      return;
    }
    var node = event.target.closest('a,button,li,div,span');
    if (!node || node.closest('#' + pageId)) return;
    var text = (node.textContent || '').replace(/\s+/g, '').trim();
    if (text === '交易记录' || (text.length < 20 && text.indexOf('交易记录') !== -1)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (location.hash !== '#transaction-records') {
        history.pushState('', document.title, '#transaction-records');
      }
      show();
    }
  }, true);

  window.addEventListener('hashchange', function () {
    if (location.hash === '#transaction-records') show();
  });

  if (location.hash === '#transaction-records') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', show);
    } else {
      show();
    }
  }
})();
