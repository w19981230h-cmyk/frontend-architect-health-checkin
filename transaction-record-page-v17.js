(function () {
  if (window.__transactionRecordPageV17) return;
  window.__transactionRecordPageV17 = true;

  var rows = Array.from({ length: 9 }, function () {
    return {
      tradeNo: "12114114",
      outNo: "124114410",
      channel: "微信支付",
      type: "收入",
      amount: "1124.00",
      time: "2026/02/05 13:30:15",
      orderNo: "1551812111",
      service: "冠心病出院健康服务..."
    };
  });

  function icon(name) {
    var common = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    var paths = {
      desktop: '<rect x="3" y="4" width="18" height="12" rx="2" ' + common + '/><path d="M8 20h8M12 16v4" ' + common + '/>',
      task: '<path d="M8 4h9l3 3v13H8z" ' + common + '/><path d="M17 4v4h4M4 7h2M4 12h2M4 17h2" ' + common + '/>',
      patient: '<circle cx="12" cy="8" r="4" ' + common + '/><path d="M4 21c1.6-4.2 14.4-4.2 16 0" ' + common + '/>',
      plan: '<rect x="4" y="4" width="16" height="16" rx="2" ' + common + '/><path d="M8 9h8M8 13h8M8 17h5" ' + common + '/>',
      service: '<rect x="4" y="5" width="16" height="14" rx="2" ' + common + '/><path d="M8 5V3h8v2M8 10h8M10 14h4" ' + common + '/>',
      notice: '<path d="M6 9a6 6 0 0 1 12 0v5l2 3H4l2-3zM10 20h4" ' + common + '/>'
    };
    return '<svg class="tr17-nav-icon" viewBox="0 0 24 24">' + (paths[name] || paths.plan) + '</svg>';
  }

  function isTransactionRoute() {
    var hash = (location.hash || "").replace(/^#/, "");
    return hash === "transaction-records" || hash === "trade-records";
  }

  function ensureRoot() {
    var root = document.getElementById("transaction-record-root-v17");
    if (!root) {
      root = document.createElement("div");
      root.id = "transaction-record-root-v17";
      document.body.appendChild(root);
    }
    return root;
  }

  function renderSidebar() {
    var mainItems = [
      ["desktop", "工作台"],
      ["task", "任务管理"],
      ["patient", "患者管理"],
      ["plan", "方案管理"],
      ["service", "运营管理"],
      ["plan", "AI 客服"],
      ["plan", "系统设置"],
      ["service", "服务管理"]
    ];
    var html = '<aside class="tr17-sidebar">';
    html += '<div class="tr17-logo"><span class="tr17-logo-mark"></span><span>全病程管理平台</span></div>';
    html += '<nav class="tr17-nav">';
    mainItems.forEach(function (item) {
      html += '<div class="tr17-nav-item">' + icon(item[0]) + '<span>' + item[1] + '</span><span class="tr17-nav-arrow">⌄</span></div>';
      if (item[1] === "服务管理") {
        html += '<div class="tr17-nav-sub active">服务包管理</div>';
        html += '<div class="tr17-nav-sub">订单管理</div>';
        html += '<div class="tr17-nav-sub active-trade">交易记录</div>';
      }
    });
    html += '</nav>';
    html += '<div class="tr17-sidebar-footer">';
    html += '<div class="tr17-notice">' + icon("notice") + '<span>消息通知</span><span class="tr17-badge">99+</span></div>';
    html += '<div class="tr17-user"><span class="tr17-avatar"></span><span>张蓉强</span><span class="tr17-nav-arrow">⌄</span></div>';
    html += '<div class="tr17-collapse">☰ 收起面板</div>';
    html += '</div></aside>';
    return html;
  }

  function renderTable() {
    var html = '<table class="tr17-table"><colgroup>';
    [110, 110, 150, 150, 150, 180, 120, 180].forEach(function (w) {
      html += '<col style="width:' + w + 'px">';
    });
    html += '</colgroup><thead><tr>';
    ["交易流水号", "外部流水号", "支付渠道", "交易类型", "交易金额（元）", "下单时间", "订单编号", "服务包名称"].forEach(function (head) {
      html += '<th>' + head + '</th>';
    });
    html += '</tr></thead><tbody>';
    rows.forEach(function (row) {
      html += '<tr>';
      html += '<td>' + row.tradeNo + '</td>';
      html += '<td>' + row.outNo + '</td>';
      html += '<td>' + row.channel + '</td>';
      html += '<td>' + row.type + '</td>';
      html += '<td>' + row.amount + '</td>';
      html += '<td>' + row.time + '</td>';
      html += '<td>' + row.orderNo + '</td>';
      html += '<td class="service">' + row.service + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  function renderPage() {
    if (!isTransactionRoute()) {
      document.body.classList.remove("tr17-mode");
      return;
    }
    var root = ensureRoot();
    document.body.classList.add("tr17-mode");
    root.innerHTML = [
      '<div class="tr17-app">',
      renderSidebar(),
      '<main class="tr17-main">',
      '<div class="tr17-title"><button class="tr17-back" type="button">‹</button><span>交易记录</span></div>',
      '<section class="tr17-card">',
      '<div class="tr17-filter">',
      '<div class="tr17-search"><div class="tr17-search-select">⌄<span>就诊人姓名</span></div><div class="tr17-search-input">请输入</div></div>',
      '<div class="tr17-date"><strong>交易日期：</strong><div class="tr17-date-range"><span>选择时间</span><span>→</span><span>选择时间</span><span>▣</span></div></div>',
      '</div>',
      '<div class="tr17-summary"><span>共30条记录</span><span>收入合计： 24,000.00</span><span>退款合计： 4,000.00</span></div>',
      renderTable(),
      '<div class="tr17-pagination"><span class="tr17-page-btn">‹</span><span>1</span><span>...</span><span class="tr17-page-current">2</span><span>3</span><span>4</span><span>5</span><span>...</span><span>50</span><span class="tr17-page-btn">›</span><span class="tr17-page-size">20 / page⌄</span><span>Go to</span><span class="tr17-page-input"></span></div>',
      '</section>',
      '</main>',
      '</div>'
    ].join("");
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("a,button,li,div,span");
    if (!target) return;
    var text = (target.textContent || "").replace(/\s+/g, "").trim();
    if (text === "交易记录") {
      event.preventDefault();
      location.hash = "transaction-records";
      renderPage();
    }
    if (target.classList && target.classList.contains("tr17-back")) {
      event.preventDefault();
      history.back();
    }
  }, true);

  window.addEventListener("hashchange", renderPage);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderPage);
  } else {
    renderPage();
  }
})();
