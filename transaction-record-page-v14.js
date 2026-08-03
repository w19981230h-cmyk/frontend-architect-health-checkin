(function () {
  if (window.__transactionRecordPageV14) return;
  window.__transactionRecordPageV14 = true;

  const ROOT_ID = "transaction-record-root-v14";
  const rows = Array.from({ length: 9 }, () => ({
    tradeNo: "12114114",
    externalNo: "124114410",
    channel: "微信支付",
    type: "收入",
    amount: "1124.00",
    orderTime: "2026/02/05 13:30:15",
    orderNo: "1551812111",
    service: "冠心病出院健康服务..."
  }));

  function icon(name) {
    const common = 'width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    const paths = {
      desktop: '<rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8M12 16v4"></path>',
      task: '<path d="M8 6h11M8 12h11M8 18h11"></path><rect x="3" y="5" width="2" height="2"></rect><rect x="3" y="11" width="2" height="2"></rect><rect x="3" y="17" width="2" height="2"></rect>',
      user: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6"></path>',
      plan: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M8 9h8M8 13h8M8 17h4"></path>',
      operate: '<path d="M5 12a7 7 0 1 0 14 0 7 7 0 0 0-14 0"></path><path d="M12 5v14M5 12h14"></path>',
      ai: '<path d="M12 3l2.2 5.2L20 10.5l-5.8 2.3L12 18l-2.2-5.2L4 10.5l5.8-2.3L12 3z"></path>',
      setting: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"></path><path d="M19.4 15a8 8 0 0 0 .1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L15 6.5h-4l-.4 2.6a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a8 8 0 0 0 .1 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2.2-1.5z"></path>',
      service: '<rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 9h8M8 13h5"></path>',
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>',
      collapse: '<path d="M4 6h16M4 12h12M4 18h16"></path>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 11h18"></path>',
      chevron: '<path d="M9 18l6-6-6-6"></path>',
      down: '<path d="M6 9l6 6 6-6"></path>'
    };
    return `<svg ${common}>${paths[name] || ""}</svg>`;
  }

  function navItem(name, iconName, expanded) {
    return `<div class="tr14-nav-item">${icon(iconName)}<span>${name}</span><span class="tr14-caret">${expanded ? "⌄" : "›"}</span></div>`;
  }

  function subItem(name, active) {
    return `<div class="tr14-nav-sub${active ? " tr14-active" : ""}">${name}</div>`;
  }

  function tableRows() {
    return rows.map(row => `
      <tr>
        <td>${row.tradeNo}</td>
        <td>${row.externalNo}</td>
        <td>${row.channel}</td>
        <td>${row.type}</td>
        <td>${row.amount}</td>
        <td>${row.orderTime}</td>
        <td>${row.orderNo}</td>
        <td title="${row.service}">${row.service}</td>
      </tr>
    `).join("");
  }

  function renderPage() {
    return `
      <div class="tr14-page">
        <aside class="tr14-sidebar">
          <div class="tr14-logo"><span class="tr14-logo-mark"></span><span>全病程管理平台</span></div>
          <nav class="tr14-nav">
            ${navItem("工作台", "desktop", false)}
            ${navItem("任务管理", "task", false)}
            ${navItem("患者管理", "user", false)}
            ${navItem("方案管理", "plan", false)}
            ${navItem("运营管理", "operate", false)}
            ${navItem("AI 客服", "ai", false)}
            ${navItem("系统设置", "setting", false)}
            ${navItem("服务管理", "service", true)}
            ${subItem("服务包管理", true)}
            ${subItem("订单管理", false)}
            ${subItem("交易记录", false)}
          </nav>
          <div class="tr14-sidebar-footer">
            <div class="tr14-message">${icon("bell")}<span>消息通知</span><span class="tr14-badge">99+</span></div>
            <div class="tr14-user"><span class="tr14-avatar"></span><span>张富强</span><span class="tr14-caret">⌄</span></div>
            <div class="tr14-collapse">${icon("collapse")}<span>收起面板</span></div>
          </div>
        </aside>
        <main class="tr14-main">
          <div class="tr14-title"><button class="tr14-back" type="button">‹</button><span>交易记录</span></div>
          <section class="tr14-card">
            <div class="tr14-filter">
              <div class="tr14-combo">
                <div class="tr14-combo-label">${icon("down")}<span>就诊人姓名</span></div>
                <input aria-label="就诊人姓名" placeholder="请输入" />
              </div>
              <div class="tr14-date">
                <span>交易日期：</span>
                <div class="tr14-date-box"><span>选择时间</span><span>→</span><span>选择时间</span>${icon("calendar")}</div>
              </div>
            </div>
            <div class="tr14-summary">
              <span>共30条记录</span>
              <span>收入合计：24,000.00</span>
              <span>退款合计：4,000.00</span>
            </div>
            <table class="tr14-table">
              <thead>
                <tr>
                  <th style="width: 100px;">交易流水号</th>
                  <th style="width: 100px;">外部流水号</th>
                  <th style="width: 110px;">支付渠道</th>
                  <th style="width: 110px;">交易类型</th>
                  <th style="width: 130px;">交易金额（元）</th>
                  <th style="width: 170px;">下单时间</th>
                  <th style="width: 110px;">订单编号</th>
                  <th>服务包名称</th>
                </tr>
              </thead>
              <tbody>${tableRows()}</tbody>
            </table>
            <div class="tr14-pagination">
              <button class="tr14-arrow" type="button">‹</button>
              <button class="tr14-page-no" type="button">1</button>
              <span>...</span>
              <button class="tr14-page-no tr14-current" type="button">2</button>
              <button class="tr14-page-no" type="button">3</button>
              <button class="tr14-page-no" type="button">4</button>
              <button class="tr14-page-no" type="button">5</button>
              <span>...</span>
              <button class="tr14-page-no" type="button">50</button>
              <button class="tr14-arrow" type="button">›</button>
              <select class="tr14-page-size" aria-label="每页条数"><option>20 / page</option></select>
              <span>Go to</span>
              <input class="tr14-jump" aria-label="跳转页码" />
            </div>
          </section>
        </main>
      </div>
    `;
  }

  function isTradeRoute() {
    return /transaction-records|trade-records/.test(window.location.hash || "");
  }

  function removeRoots() {
    ["transaction-record-root-v13", ROOT_ID].forEach(id => {
      const node = document.getElementById(id);
      if (node) node.remove();
    });
  }

  function mount() {
    document.body.classList.add("tr14-mode");
    removeRoots();
    const root = document.createElement("div");
    root.id = ROOT_ID;
    root.innerHTML = renderPage();
    document.body.appendChild(root);
  }

  function unmount() {
    document.body.classList.remove("tr14-mode");
    removeRoots();
  }

  function sync() {
    if (isTradeRoute()) mount();
    else unmount();
  }

  document.addEventListener("click", event => {
    const target = event.target.closest("a,button,li,div,span");
    if (!target) return;
    const text = (target.textContent || "").replace(/\s+/g, "");
    if (text === "交易记录") {
      event.preventDefault();
      window.location.hash = "transaction-records";
      sync();
    }
  }, true);

  window.addEventListener("hashchange", sync);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sync);
  } else {
    sync();
  }
  setTimeout(sync, 200);
})();
