(function () {
  if (window.__transactionRecordPageV16) return;
  window.__transactionRecordPageV16 = true;

  const rows = Array.from({ length: 9 }, () => ({
    tradeNo: "12114114",
    outNo: "124114410",
    channel: "微信支付",
    type: "收入",
    amount: "1124.00",
    time: "2026/02/05 13:30:15",
    orderNo: "1551812111",
    service: "冠心病出院健康服务..."
  }));

  function ensureRoot() {
    let root = document.getElementById("transaction-record-root-v16");
    if (!root) {
      root = document.createElement("div");
      root.id = "transaction-record-root-v16";
      document.body.appendChild(root);
    }
    return root;
  }

  function isTransactionRoute() {
    return /transaction-records|trade-records/.test(window.location.hash || "");
  }

  function render() {
    const root = ensureRoot();
    if (!isTransactionRoute()) {
      document.body.classList.remove("tr16-mode");
      return;
    }

    document.body.classList.add("tr16-mode");
    root.innerHTML = `
      <div class="tr16-shell">
        <aside class="tr16-sidebar">
          <div class="tr16-brand"><span class="tr16-logo"><span></span></span>全病程管理平台</div>
          <nav class="tr16-nav">
            ${navItem("▣", "工作台")}
            ${navGroup("▤", "任务管理")}
            ${navGroup("♙", "患者管理")}
            ${navGroup("▤", "方案管理")}
            ${navGroup("◴", "运营管理")}
            ${navGroup("⌘", "AI 客服")}
            ${navGroup("⚙", "系统设置")}
            <div class="tr16-nav-title"><span class="tr16-nav-icon">▣</span>服务管理<span class="tr16-nav-arrow">⌄</span></div>
            <div class="tr16-sub">
              <div class="tr16-sub-item active">服务包管理</div>
              <div class="tr16-sub-item">订单管理</div>
              <div class="tr16-sub-item active tr16-transaction-entry">交易记录</div>
            </div>
          </nav>
          <div class="tr16-sidebar-bottom">
            <div class="tr16-nav-item"><span class="tr16-nav-icon">♧</span>消息通知<span class="tr16-badge">99+</span></div>
            <div class="tr16-user-card"><span class="tr16-doctor"></span><span>张富强</span><span class="tr16-nav-arrow">⌄</span></div>
            <div class="tr16-nav-item"><span class="tr16-nav-icon">☰</span>收起面板</div>
          </div>
        </aside>
        <main class="tr16-main">
          <div class="tr16-page-title">
            <button class="tr16-back" type="button">‹</button>
            <span>交易记录</span>
          </div>
          <section class="tr16-card">
            <div class="tr16-filter">
              <div class="tr16-search">
                <div class="tr16-select-face">⌄ 就诊人姓名</div>
                <input placeholder="请输入" />
              </div>
              <div class="tr16-date-wrap">
                <span>交易日期：</span>
                <div class="tr16-date-box"><span>选择时间</span><b>→</b><span>选择时间</span><i>□</i></div>
              </div>
            </div>
            <div class="tr16-summary">
              <span>共30条记录</span>
              <span>收入合计： 24,000.00</span>
              <span>退款合计： 4,000.00</span>
            </div>
            <table class="tr16-table">
              <thead>
                <tr>
                  <th style="width:10%">交易流水号</th>
                  <th style="width:10%">外部流水号</th>
                  <th style="width:13%">支付渠道</th>
                  <th style="width:13%">交易类型</th>
                  <th style="width:13%">交易金额（元）</th>
                  <th style="width:16%">下单时间</th>
                  <th style="width:10%">订单编号</th>
                  <th style="width:15%">服务包名称</th>
                </tr>
              </thead>
              <tbody>${rows.map(rowTemplate).join("")}</tbody>
            </table>
            <div class="tr16-pagination">
              <button class="tr16-page">‹</button>
              <button class="tr16-page">1</button>
              <span>...</span>
              <button class="tr16-page active">2</button>
              <button class="tr16-page">3</button>
              <button class="tr16-page">4</button>
              <button class="tr16-page">5</button>
              <span>...</span>
              <button class="tr16-page">50</button>
              <button class="tr16-page">›</button>
              <select class="tr16-page-select"><option>20 / page</option></select>
              <span>Go to</span>
              <input class="tr16-page-input" />
            </div>
          </section>
        </main>
      </div>
    `;

    root.querySelector(".tr16-back").addEventListener("click", () => {
      if (history.length > 1) {
        history.back();
      } else {
        location.hash = "";
        render();
      }
    });
  }

  function navItem(icon, label) {
    return `<div class="tr16-nav-item"><span class="tr16-nav-icon">${icon}</span>${label}</div>`;
  }

  function navGroup(icon, label) {
    return `<div class="tr16-nav-title"><span class="tr16-nav-icon">${icon}</span>${label}<span class="tr16-nav-arrow">⌄</span></div>`;
  }

  function rowTemplate(row) {
    return `
      <tr>
        <td>${row.tradeNo}</td>
        <td>${row.outNo}</td>
        <td>${row.channel}</td>
        <td>${row.type}</td>
        <td>${row.amount}</td>
        <td>${row.time}</td>
        <td>${row.orderNo}</td>
        <td title="${row.service}">${row.service}</td>
      </tr>
    `;
  }

  function clickLooksLikeTransactionRecord(target) {
    const el = target.closest("a,button,li,div,span");
    if (!el) return false;
    const text = (el.textContent || "").replace(/\s+/g, "");
    return text === "交易记录" || text.includes("交易记录");
  }

  document.addEventListener("click", (event) => {
    if (clickLooksLikeTransactionRecord(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      if (!isTransactionRoute()) {
        location.hash = "transaction-records";
      }
      render();
    }
  }, true);

  window.addEventListener("hashchange", render);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
