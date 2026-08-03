(function () {
  if (window.__transactionRecordPageV19) return;
  window.__transactionRecordPageV19 = true;

  const rows = Array.from({ length: 9 }, () => ({
    tradeNo: "12114114",
    externalNo: "124114410",
    channel: "微信支付",
    type: "收入",
    amount: "1124.00",
    time: "2026/02/05 13:30:15",
    orderNo: "1551812111",
    service: "冠心病出院健康服务..."
  }));

  const icon = {
    work: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M9 20h6M12 17v3"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M9 12h6M9 16h5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.8-4 14.2-4 16 0"/></svg>',
    plan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    ops: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18V8l8-4 8 4v10"/><path d="M8 18v-6h8v6"/></svg>',
    ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 2.2 5 5 .8-3.6 3.7.8 5.2L12 15.2l-4.4 2.5.8-5.2L4.8 8.8l5-.8z"/></svg>',
    sys: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a8 8 0 0 0 .1-6l2-1.2-2-3.4-2.2 1.3a8 8 0 0 0-5.2-3v-2.5h-4v2.5a8 8 0 0 0-5.2 3L.7 4.4l-2 3.4 2 1.2a8 8 0 0 0 .1 6l-2 1.2 2 3.4 2.2-1.3a8 8 0 0 0 5.1 3v2.5h4v-2.5a8 8 0 0 0 5.1-3l2.2 1.3 2-3.4z"/></svg>',
    service: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
    notice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>'
  };

  function menuItem(name, svg, expanded) {
    return `<div class="tr19-menu-item">${svg}<span>${name}</span><span class="tr19-caret">${expanded ? "⌄" : "›"}</span></div>`;
  }

  function render() {
    let root = document.getElementById("transaction-record-root-v19");
    if (!root) {
      root = document.createElement("div");
      root.id = "transaction-record-root-v19";
      document.body.appendChild(root);
    }

    root.innerHTML = `
      <div class="tr19-shell">
        <aside class="tr19-sidebar">
          <div class="tr19-logo"><span class="tr19-logo-mark"></span><span>全病程管理平台</span></div>
          <nav class="tr19-menu">
            ${menuItem("工作台", icon.work, false)}
            ${menuItem("任务管理", icon.file, true)}
            ${menuItem("患者管理", icon.user, true)}
            ${menuItem("方案管理", icon.plan, true)}
            ${menuItem("运营管理", icon.ops, true)}
            ${menuItem("AI 客服", icon.ai, true)}
            ${menuItem("系统设置", icon.sys, true)}
            ${menuItem("服务管理", icon.service, true)}
            <div class="tr19-sub">
              <div class="tr19-sub-item">服务包管理</div>
              <div class="tr19-sub-item">订单管理</div>
              <div class="tr19-sub-item active">交易记录</div>
            </div>
          </nav>
          <div class="tr19-sidebar-footer">
            <div class="tr19-notice">${icon.notice}<span>消息通知</span><span class="tr19-badge">99+</span></div>
            <div class="tr19-user"><span class="tr19-avatar"></span><span>张富强</span><span class="tr19-caret">⌄</span></div>
            <div class="tr19-notice" style="margin-top:12px;">☰<span>收起面板</span></div>
          </div>
        </aside>
        <main class="tr19-main">
          <div class="tr19-title"><button class="tr19-back" type="button">‹</button><span>交易记录</span></div>
          <section class="tr19-card">
            <div class="tr19-filter">
              <div class="tr19-search">
                <div class="tr19-select">⌄ <span>就诊人姓名</span></div>
                <div class="tr19-input">请输入</div>
              </div>
              <div class="tr19-date">
                <span>交易日期：</span>
                <div class="tr19-date-box"><span>选择时间</span><span>→</span><span>选择时间</span><span>▣</span></div>
              </div>
            </div>
            <div class="tr19-summary">
              <b>共30条记录</b>
              <span>收入合计：24,000.00</span>
              <span>退款合计：4,000.00</span>
            </div>
            <table class="tr19-table">
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
              <tbody>
                ${rows.map(row => `
                  <tr>
                    <td>${row.tradeNo}</td>
                    <td>${row.externalNo}</td>
                    <td>${row.channel}</td>
                    <td>${row.type}</td>
                    <td>${row.amount}</td>
                    <td>${row.time}</td>
                    <td>${row.orderNo}</td>
                    <td title="冠心病出院健康服务包">${row.service}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            <div class="tr19-pagination">
              <span class="tr19-page-arrow">‹</span>
              <span class="tr19-page">1</span>
              <span>...</span>
              <span class="tr19-page active">2</span>
              <span class="tr19-page">3</span>
              <span class="tr19-page">4</span>
              <span class="tr19-page">5</span>
              <span>...</span>
              <span class="tr19-page">50</span>
              <span class="tr19-page-arrow">›</span>
              <span class="tr19-page-size">20 / page <span>⌄</span></span>
              <span class="tr19-goto">Go to <input aria-label="Go to page" /></span>
            </div>
          </section>
        </main>
      </div>
    `;

    root.querySelector(".tr19-back").addEventListener("click", () => {
      if (history.length > 1) history.back();
      else location.hash = "";
    });
  }

  function isRoute() {
    return ["#transaction-records", "#trade-records"].includes(location.hash);
  }

  function applyRoute() {
    if (isRoute()) {
      document.body.classList.remove("tr18-mode", "tr17-mode");
      document.body.classList.add("tr19-mode");
      render();
    } else {
      document.body.classList.remove("tr19-mode");
    }
  }

  document.addEventListener("click", event => {
    const target = event.target && event.target.closest ? event.target.closest("a,button,div,span,li") : null;
    if (!target) return;
    const text = (target.textContent || "").replace(/\s+/g, "");
    if (text === "交易记录") {
      event.preventDefault();
      location.hash = "transaction-records";
      applyRoute();
    }
  }, true);

  window.addEventListener("hashchange", applyRoute);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyRoute);
  } else {
    applyRoute();
  }
})();
