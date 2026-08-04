(function () {
  if (window.__transactionRecordPageV11) return;
  window.__transactionRecordPageV11 = true;

  const rows = Array.from({ length: 9 }, () => ({
    serial: "12114114",
    external: "124114410",
    channel: "微信支付",
    type: "收入",
    amount: "1124.00",
    time: "2026/02/05 13:30:15",
    order: "1551812111",
    service: "冠心病出院健康服务...",
  }));

  function ensureStyle() {
    if (document.getElementById("transaction-record-style-v11")) return;
    const style = document.createElement("style");
    style.id = "transaction-record-style-v11";
    style.textContent = `
      body.transaction-record-v11-on { margin: 0; overflow: hidden; background: #f3f6fc; }
      body.transaction-record-v11-on > *:not(#transaction-record-page-v11):not(script):not(style) { display: none !important; }
      #transaction-record-page-v11 { position: fixed; inset: 0; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; color: #17233d; background: #f3f6fc; }
      .tr11-shell { display: flex; width: 100%; height: 100%; }
      .tr11-side { width: 230px; flex: 0 0 230px; background: #fff; border-right: 1px solid #e8edf6; display: flex; flex-direction: column; }
      .tr11-brand { height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 28px; border-bottom: 1px solid #eef2f8; font-size: 18px; font-weight: 700; color: #0f2a56; }
      .tr11-logo { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg,#7b2ff7,#ff4d7d); position: relative; }
      .tr11-logo::after { content: ""; position: absolute; left: 8px; top: 8px; width: 12px; height: 12px; border: 4px solid #fff; border-radius: 50%; border-right-color: transparent; }
      .tr11-menu { flex: 1; padding: 18px 12px; overflow: hidden; }
      .tr11-menu-item, .tr11-menu-head { height: 44px; display: flex; align-items: center; gap: 12px; padding: 0 18px; color: #18325a; font-size: 15px; border-radius: 8px; box-sizing: border-box; }
      .tr11-menu-head { margin-top: 4px; font-weight: 600; }
      .tr11-menu-icon { width: 18px; color: #244676; text-align: center; }
      .tr11-menu-arrow { margin-left: auto; color: #9aa8bc; }
      .tr11-sub { padding: 0 0 8px 42px; }
      .tr11-sub div { height: 38px; line-height: 38px; color: #56657a; font-size: 14px; }
      .tr11-sub .active { margin-left: -30px; padding-left: 30px; color: #2563ff; background: #eef4ff; border-left: 3px solid #2563ff; border-radius: 7px; }
      .tr11-side-bottom { padding: 16px 12px 20px; border-top: 1px solid #edf1f7; }
      .tr11-notice { display: flex; align-items: center; gap: 10px; height: 40px; color: #233955; font-size: 14px; }
      .tr11-badge { margin-left: auto; padding: 2px 7px; border-radius: 10px; color: #fff; background: #ff5b6b; font-size: 11px; }
      .tr11-user { display: flex; align-items: center; gap: 10px; height: 54px; padding: 0 12px; border-radius: 10px; background: #f5f8ff; font-weight: 600; }
      .tr11-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(#fff 0 42%, #5b82ff 42% 100%); border: 1px solid #e1e8f5; box-shadow: inset 0 0 0 8px #f3d4bd; }
      .tr11-collapse { height: 42px; display: flex; align-items: center; gap: 10px; padding: 0 18px; color: #58677c; font-size: 14px; }
      .tr11-main { flex: 1; min-width: 0; padding: 22px 24px; overflow: auto; }
      .tr11-title { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; font-size: 20px; font-weight: 700; }
      .tr11-back { width: 26px; height: 26px; border: 0; border-radius: 50%; background: #fff; color: #7d8ca3; font-size: 20px; cursor: pointer; line-height: 26px; }
      .tr11-card { background: #fff; border-radius: 14px; padding: 24px; box-shadow: 0 10px 28px rgba(28, 64, 128, .04); }
      .tr11-filter { height: 72px; display: flex; align-items: center; gap: 32px; padding: 0 16px; border-radius: 6px; background: #f7f7f9; box-sizing: border-box; }
      .tr11-search { display: flex; width: 360px; height: 40px; border: 1px solid #d9dee8; border-radius: 6px; background: #fff; overflow: hidden; }
      .tr11-select { width: 128px; display: flex; align-items: center; gap: 8px; padding-left: 12px; border-right: 1px solid #eef1f5; color: #13223a; }
      .tr11-input { flex: 1; display: flex; align-items: center; padding-left: 14px; color: #a8b0bf; }
      .tr11-date { display: flex; align-items: center; gap: 12px; color: #17233d; }
      .tr11-range { width: 280px; height: 40px; display: flex; align-items: center; justify-content: space-around; border: 1px solid #e0e5ef; border-radius: 6px; background: #fff; color: #a7afbf; }
      .tr11-summary { display: flex; gap: 22px; margin: 34px 0 28px; color: #63718a; font-size: 14px; }
      .tr11-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 14px; }
      .tr11-table th { height: 52px; padding: 0 16px; background: #fafafa; color: #17233d; font-weight: 700; text-align: left; border-right: 1px solid #edf0f5; white-space: nowrap; }
      .tr11-table th:last-child { border-right: 0; }
      .tr11-table td { height: 54px; padding: 0 16px; color: #14243d; border-bottom: 1px solid #edf0f5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .tr11-pager { height: 72px; display: flex; align-items: center; justify-content: center; gap: 18px; color: #17233d; font-size: 14px; }
      .tr11-page { min-width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; color: #17233d; }
      .tr11-page.active { border: 1px solid #2f5bff; color: #1d49ff; }
      .tr11-page-select, .tr11-jump { height: 32px; border: 1px solid #dbe1eb; border-radius: 6px; background: #fff; }
      .tr11-page-select { width: 110px; padding: 0 12px; }
      .tr11-jump { width: 52px; }
    `;
    document.head.appendChild(style);
  }

  function makeRows() {
    return rows.map((row) => `
      <tr>
        <td>${row.serial}</td>
        <td>${row.external}</td>
        <td>${row.channel}</td>
        <td>${row.type}</td>
        <td>${row.amount}</td>
        <td>${row.time}</td>
        <td>${row.order}</td>
        <td title="${row.service}">${row.service}</td>
      </tr>
    `).join("");
  }

  function openPage() {
    ensureStyle();
    document.body.classList.remove("tr10-active");
    document.getElementById("transaction-record-page-v10")?.remove();
    document.body.classList.add("transaction-record-v11-on");
    let root = document.getElementById("transaction-record-page-v11");
    if (!root) {
      root = document.createElement("div");
      root.id = "transaction-record-page-v11";
      document.body.appendChild(root);
    }
    root.innerHTML = `
      <div class="tr11-shell">
        <aside class="tr11-side">
          <div class="tr11-brand"><span class="tr11-logo"></span><span>全病程管理平台</span></div>
          <nav class="tr11-menu">
            <div class="tr11-menu-item"><span class="tr11-menu-icon">▣</span>工作台</div>
            <div class="tr11-menu-head"><span class="tr11-menu-icon">▤</span>任务管理<span class="tr11-menu-arrow">⌄</span></div>
            <div class="tr11-menu-head"><span class="tr11-menu-icon">♙</span>患者管理<span class="tr11-menu-arrow">⌄</span></div>
            <div class="tr11-menu-head"><span class="tr11-menu-icon">▤</span>方案管理<span class="tr11-menu-arrow">⌄</span></div>
            <div class="tr11-menu-head"><span class="tr11-menu-icon">◴</span>运营管理<span class="tr11-menu-arrow">⌄</span></div>
            <div class="tr11-menu-head"><span class="tr11-menu-icon">✾</span>AI 客服<span class="tr11-menu-arrow">⌄</span></div>
            <div class="tr11-menu-head"><span class="tr11-menu-icon">⚙</span>系统设置<span class="tr11-menu-arrow">⌄</span></div>
            <div class="tr11-menu-head"><span class="tr11-menu-icon">▣</span>服务管理<span class="tr11-menu-arrow">⌄</span></div>
            <div class="tr11-sub">
              <div>服务包管理</div>
              <div>订单管理</div>
              <div class="active">交易记录</div>
            </div>
          </nav>
          <div class="tr11-side-bottom">
            <div class="tr11-notice">♧ 消息通知 <span class="tr11-badge">99+</span></div>
            <div class="tr11-user"><span class="tr11-avatar"></span><span>张蓓强</span><span class="tr11-menu-arrow">⌄</span></div>
            <div class="tr11-collapse">☰ 收起面板</div>
          </div>
        </aside>
        <main class="tr11-main">
          <div class="tr11-title"><button class="tr11-back" type="button">‹</button><span>交易记录</span></div>
          <section class="tr11-card">
            <div class="tr11-filter">
              <div class="tr11-search">
                <div class="tr11-select">⌄ 就诊人姓名</div>
                <div class="tr11-input">请输入</div>
              </div>
              <div class="tr11-date">
                <strong>交易日期：</strong>
                <div class="tr11-range"><span>选择时间</span><span>→</span><span>选择时间</span><span>□</span></div>
              </div>
            </div>
            <div class="tr11-summary">
              <span>共30条记录</span>
              <span>收入合计： 24,000.00</span>
              <span>退款合计： 4,000.00</span>
            </div>
            <table class="tr11-table">
              <thead>
                <tr>
                  <th>交易流水号</th><th>外部流水号</th><th>支付渠道</th><th>交易类型</th>
                  <th>交易金额（元）</th><th>下单时间</th><th>订单编号</th><th>服务包名称</th>
                </tr>
              </thead>
              <tbody>${makeRows()}</tbody>
            </table>
            <div class="tr11-pager">
              <span>‹</span><span class="tr11-page">1</span><span>...</span><span class="tr11-page active">2</span>
              <span class="tr11-page">3</span><span class="tr11-page">4</span><span class="tr11-page">5</span><span>...</span>
              <span class="tr11-page">50</span><span>›</span>
              <select class="tr11-page-select"><option>20 / page</option></select>
              <span>Go to</span><input class="tr11-jump" />
            </div>
          </section>
        </main>
      </div>
    `;
    root.querySelector(".tr11-back").addEventListener("click", closePage);
  }

  function closePage() {
    document.body.classList.remove("transaction-record-v11-on");
    document.getElementById("transaction-record-page-v11")?.remove();
    if (location.hash === "#transaction-records") history.replaceState(null, "", location.pathname + location.search);
  }

  document.addEventListener("click", function (event) {
    const target = event.target.closest("a,button,li,div,span");
    if (!target) return;
    const text = (target.textContent || "").replace(/\s+/g, "");
    if (text === "交易记录") {
      event.preventDefault();
      location.hash = "transaction-records";
      openPage();
    }
  }, true);

  window.addEventListener("hashchange", function () {
    if (location.hash === "#transaction-records") openPage();
  });
  if (location.hash === "#transaction-records") openPage();
  window.openTransactionRecordPage = openPage;
})();
