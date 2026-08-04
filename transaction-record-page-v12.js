(() => {
  if (window.__transactionRecordPageV12) return;
  window.__transactionRecordPageV12 = true;

  const rows = Array.from({ length: 9 }, () => ({
    serial: "12114114",
    external: "124114410",
    channel: "微信支付",
    type: "收入",
    amount: "1124.00",
    time: "2026/02/05 13:30:15",
    order: "1551812111",
    service: "冠心病出院健康服务..."
  }));

  const menu = [
    ["▣", "工作台"],
    ["▤", "任务管理"],
    ["♙", "患者管理"],
    ["▤", "方案管理"],
    ["◴", "运营管理"],
    ["✾", "AI 客服"],
    ["⚙", "系统设置"],
    ["▣", "服务管理", ["服务包管理", "订单管理", "交易记录"]]
  ];

  function ensureStyle() {
    if (document.getElementById("tr12-style")) return;
    const style = document.createElement("style");
    style.id = "tr12-style";
    style.textContent = `
      body.tr12-on{margin:0;background:#f4f7ff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;color:#152744}
      body.tr12-on>*:not(#tr12-root):not(script):not(style){display:none!important}
      #tr12-root{min-height:100vh;display:grid;grid-template-columns:230px 1fr;background:#f5f7ff}
      #tr12-root .side{background:#fff;box-shadow:1px 0 0 #edf1f7;display:flex;flex-direction:column;min-height:100vh}
      #tr12-root .brand{height:72px;display:flex;align-items:center;gap:12px;padding:0 28px;border-bottom:1px solid #edf1f7;font-size:18px;font-weight:800;color:#10356d}
      #tr12-root .logo{width:26px;height:26px;border-radius:50%;background:conic-gradient(from 220deg,#7b42f6,#ff4a93,#2a71ff,#7b42f6);box-shadow:inset 0 0 0 7px #fff}
      #tr12-root .nav{padding:18px 12px;flex:1}
      #tr12-root .nav-item{height:44px;display:flex;align-items:center;gap:12px;padding:0 18px;border-radius:8px;color:#243b63;font-weight:600;margin:2px 0}
      #tr12-root .nav-item .arrow{margin-left:auto;color:#9aa8bd}
      #tr12-root .sub{margin:4px 0 10px;padding-left:48px;color:#51627d}
      #tr12-root .sub div{height:36px;line-height:36px;border-radius:8px;padding-left:12px}
      #tr12-root .sub .active{background:#edf3ff;color:#245bff;border-left:3px solid #2f63ff;font-weight:700}
      #tr12-root .side-foot{border-top:1px solid #edf1f7;padding:16px 12px 22px}
      #tr12-root .notify{display:flex;justify-content:space-between;align-items:center;height:42px;padding:0 18px;color:#243b63}
      #tr12-root .badge{background:#ff5770;color:#fff;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700}
      #tr12-root .user{height:56px;border-radius:10px;background:#f3f7ff;display:flex;align-items:center;gap:10px;padding:0 14px;font-weight:700}
      #tr12-root .avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(#fff1e7 0 48%,#2f63ff 49%);box-shadow:inset 0 0 0 3px #d8e5ff}
      #tr12-root .main{padding:22px 24px 28px;overflow:auto}
      #tr12-root .title{display:flex;align-items:center;gap:12px;font-size:21px;font-weight:800;margin:0 0 22px}
      #tr12-root .back{width:22px;height:22px;border-radius:50%;background:#fff;display:grid;place-items:center;color:#7d8ca3;font-size:18px;cursor:pointer}
      #tr12-root .card{background:#fff;border-radius:14px;padding:24px;box-shadow:0 10px 30px rgba(29,58,117,.05)}
      #tr12-root .filter{height:72px;background:#f7f8fb;border-radius:6px;display:flex;align-items:center;gap:34px;padding:0 16px;margin-bottom:34px}
      #tr12-root .search{height:40px;width:360px;border:1px solid #d6dce8;border-radius:7px;background:#fff;display:flex;align-items:center;overflow:hidden}
      #tr12-root .select{width:136px;height:100%;display:flex;align-items:center;gap:10px;padding:0 12px;border-right:1px solid #e5e9f0;font-weight:700}
      #tr12-root .input{color:#a9b3c3;padding-left:12px}
      #tr12-root .date{display:flex;align-items:center;gap:14px;color:#172a48;font-weight:700}
      #tr12-root .datebox{height:40px;width:278px;border:1px solid #e0e5ef;border-radius:7px;background:#fff;color:#aab4c5;display:flex;align-items:center;justify-content:space-around;font-weight:400}
      #tr12-root .summary{display:flex;gap:28px;color:#697892;margin-bottom:28px;font-size:14px}
      #tr12-root table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:14px}
      #tr12-root th{height:52px;background:#fafafa;text-align:left;padding:0 16px;font-weight:800;color:#1d2d48;border-right:1px solid #eef1f5}
      #tr12-root th:last-child{border-right:none}
      #tr12-root td{height:54px;padding:0 16px;border-bottom:1px solid #edf0f5;color:#142743;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #tr12-root .pager{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:30px;color:#142743}
      #tr12-root .pg{min-width:30px;height:30px;border-radius:6px;display:grid;place-items:center}
      #tr12-root .pg.on{border:1px solid #245bff;color:#245bff}
      #tr12-root .page-size{height:32px;border:1px solid #dbe2ec;border-radius:7px;padding:0 14px;display:flex;align-items:center;gap:8px}
      #tr12-root .goto{width:48px;height:30px;border:1px solid #dbe2ec;border-radius:6px;background:#fff}
    `;
    document.head.appendChild(style);
  }

  function renderMenu() {
    return menu.map(([icon, text, children]) => {
      const childHtml = children ? `<div class="sub">${children.map(item => `<div class="${item === "交易记录" ? "active" : ""}">${item}</div>`).join("")}</div>` : "";
      return `<div class="nav-item"><span>${icon}</span><span>${text}</span><span class="arrow">⌄</span></div>${childHtml}`;
    }).join("");
  }

  function renderRows() {
    return rows.map(row => `<tr>
      <td>${row.serial}</td><td>${row.external}</td><td>${row.channel}</td><td>${row.type}</td>
      <td>${row.amount}</td><td>${row.time}</td><td>${row.order}</td><td>${row.service}</td>
    </tr>`).join("");
  }

  function openPage() {
    ensureStyle();
    document.body.classList.add("tr12-on");
    let root = document.getElementById("tr12-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "tr12-root";
      document.body.appendChild(root);
    }
    root.innerHTML = `
      <aside class="side">
        <div class="brand"><span class="logo"></span><span>全病程管理平台</span></div>
        <div class="nav">${renderMenu()}</div>
        <div class="side-foot">
          <div class="notify"><span>♧ 消息通知</span><span class="badge">99+</span></div>
          <div class="user"><span class="avatar"></span><span>张蓓强</span><span style="margin-left:auto">⌄</span></div>
          <div class="notify">☰ 收起面板</div>
        </div>
      </aside>
      <main class="main">
        <div class="title"><span class="back" id="tr12-back">‹</span><span>交易记录</span></div>
        <section class="card">
          <div class="filter">
            <div class="search"><div class="select">⌄ 就诊人姓名</div><div class="input">请输入</div></div>
            <div class="date"><span>交易日期：</span><div class="datebox"><span>选择时间</span><span>→</span><span>选择时间</span><span>▢</span></div></div>
          </div>
          <div class="summary"><span>共30条记录</span><span>收入合计：24,000.00</span><span>退款合计：4,000.00</span></div>
          <table>
            <thead><tr><th>交易流水号</th><th>外部流水号</th><th>支付渠道</th><th>交易类型</th><th>交易金额（元）</th><th>下单时间</th><th>订单编号</th><th>服务包名称</th></tr></thead>
            <tbody>${renderRows()}</tbody>
          </table>
          <div class="pager"><span>‹</span><span class="pg">1</span><span>...</span><span class="pg on">2</span><span class="pg">3</span><span class="pg">4</span><span class="pg">5</span><span>...</span><span class="pg">50</span><span>›</span><span class="page-size">20 / page⌄</span><span>Go to</span><input class="goto"></div>
        </section>
      </main>
    `;
    document.getElementById("tr12-back").onclick = closePage;
  }

  function closePage() {
    document.body.classList.remove("tr12-on");
    if (location.hash === "#transaction-records") history.replaceState(null, "", location.pathname + location.search);
  }

  document.addEventListener("click", event => {
    const node = event.target.closest("a,button,li,div,span");
    if (!node) return;
    if (node.textContent.trim().replace(/\s+/g, "") === "交易记录") {
      event.preventDefault();
      location.hash = "transaction-records";
      openPage();
    }
  }, true);
  window.addEventListener("hashchange", () => {
    if (location.hash === "#transaction-records") openPage();
  });
  window.openTransactionRecordPage = openPage;
  if (location.hash === "#transaction-records") openPage();
})();
