(function () {
  if (window.__transactionRecordPageV18) return;
  window.__transactionRecordPageV18 = true;

  var rows = Array.from({ length: 9 }, function () {
    return {
      tradeNo: "12114114",
      outsideNo: "124114410",
      channel: "微信支付",
      type: "收入",
      amount: "1124.00",
      orderTime: "2026/02/05 13:30:15",
      orderNo: "1551812111",
      service: "冠心病出院健康服务..."
    };
  });

  function isTransactionRoute() {
    var hash = (location.hash || "").replace(/^#/, "");
    return hash === "transaction-records" || hash === "trade-records";
  }

  function ensureRoot() {
    var root = document.getElementById("transaction-record-root-v18");
    if (!root) {
      root = document.createElement("div");
      root.id = "transaction-record-root-v18";
      document.body.appendChild(root);
    }
    return root;
  }

  function icon(path) {
    return '<svg class="tr18-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + path + "</svg>";
  }

  function renderSidebar() {
    var navItems = [
      ["工作台", icon('<rect x="4" y="5" width="16" height="12" rx="1.5"></rect><path d="M8 21h8M12 17v4"></path>')],
      ["任务管理", icon('<path d="M8 6h10M8 12h10M8 18h10"></path><rect x="4" y="4" width="2" height="2"></rect><rect x="4" y="10" width="2" height="2"></rect><rect x="4" y="16" width="2" height="2"></rect>')],
      ["患者管理", icon('<circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c1.5-4 12.5-4 14 0"></path>')],
      ["方案管理", icon('<rect x="5" y="4" width="14" height="16" rx="2"></rect><path d="M8 8h8M8 12h8M8 16h5"></path>')],
      ["运营管理", icon('<path d="M4 19V9l8-4 8 4v10"></path><path d="M9 19v-6h6v6"></path>')],
      ["AI 客服", icon('<path d="M12 3l2.4 5 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8z"></path>')],
      ["系统设置", icon('<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4v-3h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v3h-.1a1.7 1.7 0 0 0-1.5 1z"></path>')]
    ];
    var html = '<aside class="tr18-sidebar"><div class="tr18-logo"><span class="tr18-logo-mark"></span><span>全病程管理平台</span></div><nav class="tr18-menu">';
    navItems.forEach(function (item) {
      html += '<div class="tr18-nav-item">' + item[1] + "<span>" + item[0] + '</span><span class="tr18-caret">⌄</span></div>';
    });
    html += '<div class="tr18-nav-item">' + icon('<rect x="4" y="4" width="16" height="14" rx="2"></rect><path d="M8 8h8M8 12h8M8 16h5"></path>') + '<span>服务管理</span><span class="tr18-caret">⌄</span></div>';
    html += '<div class="tr18-sub"><div class="tr18-sub-item active">服务包管理</div><div class="tr18-sub-item">订单管理</div><div class="tr18-sub-item">交易记录</div></div>';
    html += '</nav><div class="tr18-sidebar-bottom"><div class="tr18-notice">' + icon('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>') + '<span>消息通知</span><span class="tr18-badge">99+</span></div><div class="tr18-user"><span class="tr18-avatar"></span><span>张蓉强</span><span class="tr18-caret">⌄</span></div><div class="tr18-notice">' + icon('<path d="M4 6h16M4 12h16M4 18h16"></path>') + "<span>收起面板</span></div></div></aside>";
    return html;
  }

  function renderRows() {
    return rows.map(function (row) {
      return "<tr><td>" + row.tradeNo + "</td><td>" + row.outsideNo + "</td><td>" + row.channel + "</td><td>" + row.type + "</td><td>" + row.amount + "</td><td>" + row.orderTime + "</td><td>" + row.orderNo + '</td><td title="' + row.service + '">' + row.service + "</td></tr>";
    }).join("");
  }

  function renderPage() {
    if (!isTransactionRoute()) {
      document.body.classList.remove("tr18-mode");
      return;
    }

    document.body.classList.remove("tr17-mode");
    var legacyRoot = document.getElementById("transaction-record-root-v17");
    if (legacyRoot) legacyRoot.style.display = "none";

    var root = ensureRoot();
    document.body.classList.add("tr18-mode");
    root.innerHTML = '<div class="tr18-app">' + renderSidebar() + '<main class="tr18-main"><div class="tr18-title"><button class="tr18-back" type="button">‹</button><span>交易记录</span></div><section class="tr18-panel"><div class="tr18-filter"><div class="tr18-searchbox"><div class="tr18-select"><span>⌄</span><span>就诊人姓名</span></div><span class="tr18-input-text">请输入</span></div><div class="tr18-date"><strong>交易日期：</strong><div class="tr18-range"><span>选择时间</span><span>→</span><span>选择时间</span><span>▣</span></div></div></div><div class="tr18-summary"><span>共30条记录</span><span>收入合计： 24,000.00</span><span>退款合计： 4,000.00</span></div><div class="tr18-table-wrap"><table class="tr18-table"><colgroup><col style="width:10%"><col style="width:10%"><col style="width:14%"><col style="width:14%"><col style="width:13%"><col style="width:16%"><col style="width:10%"><col style="width:13%"></colgroup><thead><tr><th>交易流水号</th><th>外部流水号</th><th>支付渠道</th><th>交易类型</th><th>交易金额（元）</th><th>下单时间</th><th>订单编号</th><th>服务包名称</th></tr></thead><tbody>' + renderRows() + '</tbody></table></div><div class="tr18-pagination"><span>‹</span><div class="tr18-page-list"><button class="tr18-page-btn">1</button><span>...</span><button class="tr18-page-btn active">2</button><button class="tr18-page-btn">3</button><button class="tr18-page-btn">4</button><button class="tr18-page-btn">5</button><span>...</span><button class="tr18-page-btn">50</button></div><span>›</span><div class="tr18-page-size">20 / page <span>⌄</span></div><span>Go to</span><input class="tr18-goto" /></div></section></main></div>';
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("a,button,li,div,span");
    if (!target) return;
    var text = (target.textContent || "").replace(/\s+/g, "");
    if (text === "交易记录") {
      event.preventDefault();
      location.hash = "transaction-records";
      renderPage();
      return;
    }
    if (target.classList && target.classList.contains("tr18-back")) {
      event.preventDefault();
      if (history.length > 1) history.back();
      else location.hash = "";
    }
  }, true);

  window.addEventListener("hashchange", renderPage);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderPage);
  } else {
    renderPage();
  }
})();
