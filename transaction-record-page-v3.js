(function () {
  if (window.__transactionRecordPageV3Loaded) return;
  window.__transactionRecordPageV3Loaded = true;

  var rows = Array.from({ length: 9 }).map(function (_, index) {
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

  function injectStyle() {
    if (document.getElementById("transaction-record-page-v3-style")) return;
    var style = document.createElement("style");
    style.id = "transaction-record-page-v3-style";
    style.textContent = [
      "body.transaction-record-page-v3-active{margin:0!important;background:#f4f7ff!important;overflow:auto!important;}",
      "body.transaction-record-page-v3-active>*:not(#transaction-record-page-v3):not(script):not(style){display:none!important;}",
      "#transaction-record-page-v3{display:none;min-height:100vh;background:#f4f7ff;color:#1b2b4a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',Arial,sans-serif;}",
      "body.transaction-record-page-v3-active #transaction-record-page-v3{display:flex;}",
      ".trp-side{width:230px;min-height:100vh;background:#fff;border-right:1px solid #edf1f8;box-sizing:border-box;display:flex;flex-direction:column;}",
      ".trp-logo{height:72px;display:flex;align-items:center;gap:12px;padding:0 24px;border-bottom:1px solid #edf1f8;font-weight:800;font-size:18px;color:#0e2a61;}",
      ".trp-mark{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#7c3df0,#ff4f75);position:relative;box-shadow:0 8px 18px rgba(69,99,255,.18);}",
      ".trp-mark:after{content:'';position:absolute;right:2px;bottom:4px;width:12px;height:12px;border-radius:50%;background:#fff;opacity:.95;}",
      ".trp-nav{padding:18px 12px;flex:1;}",
      ".trp-nav-item{height:44px;display:flex;align-items:center;gap:12px;padding:0 18px;border-radius:8px;color:#263a63;font-size:15px;font-weight:600;margin-bottom:7px;box-sizing:border-box;}",
      ".trp-nav-icon{width:18px;text-align:center;color:#183f7e;font-size:16px;}",
      ".trp-nav-arrow{margin-left:auto;color:#a9b5c9;font-size:16px;}",
      ".trp-sub{margin:0 0 14px 48px;color:#52617a;font-size:14px;line-height:2.7;}",
      ".trp-sub div{padding-left:12px;border-radius:8px;width:146px;box-sizing:border-box;}",
      ".trp-sub .active{background:#eef4ff;color:#1f5cff;border-left:3px solid #2f66ff;font-weight:700;}",
      ".trp-side-bottom{border-top:1px solid #edf1f8;padding:16px 12px 18px;}",
      ".trp-badge{margin-left:auto;background:#ff5571;color:#fff;border-radius:10px;padding:1px 7px;font-size:11px;}",
      ".trp-user{height:54px;background:#f5f8ff;border-radius:10px;display:flex;align-items:center;gap:10px;padding:0 14px;font-weight:700;color:#243b63;}",
      ".trp-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(#ffe8d4 0 45%,#265fff 46% 100%);box-shadow:inset 0 0 0 3px #d9e6ff;}",
      ".trp-main{flex:1;padding:22px 24px 26px;box-sizing:border-box;min-width:0;}",
      ".trp-title{height:34px;display:flex;align-items:center;gap:12px;font-size:22px;font-weight:800;color:#1c2f52;margin-bottom:22px;}",
      ".trp-back{width:26px;height:26px;border-radius:50%;background:#fff;display:inline-flex;align-items:center;justify-content:center;color:#68809e;border:1px solid #edf1f8;cursor:pointer;font-size:18px;}",
      ".trp-card{background:#fff;border-radius:16px;padding:24px 24px 22px;box-sizing:border-box;box-shadow:0 12px 32px rgba(32,55,102,.04);min-height:calc(100vh - 116px);}",
      ".trp-filter{background:#f7f8fb;border-radius:8px;padding:16px;display:flex;align-items:center;gap:32px;margin-bottom:34px;}",
      ".trp-search{display:flex;height:40px;border:1px solid #d4dbe8;border-radius:7px;background:#fff;overflow:hidden;}",
      ".trp-search-left{width:128px;display:flex;align-items:center;gap:8px;padding:0 12px;border-right:1px solid #edf1f8;color:#182b4a;font-weight:600;box-sizing:border-box;}",
      ".trp-search input{width:230px;border:0;outline:none;padding:0 14px;color:#8794a8;font-size:14px;}",
      ".trp-date{display:flex;align-items:center;gap:12px;color:#172849;font-weight:700;}",
      ".trp-date-box{width:300px;height:40px;border:1px solid #e0e5ef;border-radius:7px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 14px;box-sizing:border-box;color:#a5afbf;font-weight:400;}",
      ".trp-summary{display:flex;gap:28px;color:#687893;font-size:14px;margin:0 0 28px;}",
      ".trp-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:14px;color:#142541;}",
      ".trp-table thead{background:#fafafa;}",
      ".trp-table th{height:52px;text-align:left;font-weight:800;color:#1d2b49;padding:0 16px;border-right:1px solid #eef1f6;white-space:nowrap;}",
      ".trp-table th:last-child{border-right:0;}",
      ".trp-table td{height:54px;padding:0 16px;border-bottom:1px solid #edf0f5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      ".trp-table col:nth-child(1){width:112px}.trp-table col:nth-child(2){width:112px}.trp-table col:nth-child(3){width:150px}.trp-table col:nth-child(4){width:150px}.trp-table col:nth-child(5){width:150px}.trp-table col:nth-child(6){width:180px}.trp-table col:nth-child(7){width:110px}.trp-table col:nth-child(8){width:auto}",
      ".trp-pagination{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:30px;color:#1a2a47;font-size:14px;}",
      ".trp-page-list{display:flex;align-items:center;gap:8px;}",
      ".trp-page{min-width:30px;height:30px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;box-sizing:border-box;}",
      ".trp-page.active{border-color:#245bff;color:#245bff;background:#fff;font-weight:700;}",
      ".trp-page.ghost{color:#8b98ad;}",
      ".trp-size{height:32px;border:1px solid #dbe2ef;border-radius:7px;padding:0 12px;background:#fff;color:#1c2f52;display:inline-flex;align-items:center;gap:8px;}",
      ".trp-go{display:flex;align-items:center;gap:8px;}",
      ".trp-go input{width:48px;height:30px;border:1px solid #dbe2ef;border-radius:7px;outline:none;text-align:center;}",
      "@media(max-width:1100px){.trp-side{width:210px}.trp-main{padding:18px}.trp-card{overflow:auto}.trp-filter{min-width:900px}.trp-table{min-width:1060px}}"
    ].join("");
    document.head.appendChild(style);
  }

  function render() {
    var existing = document.getElementById("transaction-record-page-v3");
    if (existing) return existing;

    var rowHtml = rows.map(function (row) {
      return [
        "<tr>",
        "<td>" + row.tradeNo + "</td>",
        "<td>" + row.outNo + "</td>",
        "<td>" + row.channel + "</td>",
        "<td>" + row.type + "</td>",
        "<td>" + row.amount + "</td>",
        "<td>" + row.time + "</td>",
        "<td>" + row.orderNo + "</td>",
        "<td title='" + row.service + "'>" + row.service + "</td>",
        "</tr>"
      ].join("");
    }).join("");

    var page = document.createElement("div");
    page.id = "transaction-record-page-v3";
    page.innerHTML = [
      "<aside class='trp-side'>",
      "  <div class='trp-logo'><span class='trp-mark'></span><span>全病程管理平台</span></div>",
      "  <nav class='trp-nav'>",
      "    <div class='trp-nav-item'><span class='trp-nav-icon'>▣</span><span>工作台</span></div>",
      "    <div class='trp-nav-item'><span class='trp-nav-icon'>▤</span><span>任务管理</span><span class='trp-nav-arrow'>⌄</span></div>",
      "    <div class='trp-nav-item'><span class='trp-nav-icon'>☻</span><span>患者管理</span><span class='trp-nav-arrow'>⌄</span></div>",
      "    <div class='trp-nav-item'><span class='trp-nav-icon'>▤</span><span>方案管理</span><span class='trp-nav-arrow'>⌄</span></div>",
      "    <div class='trp-nav-item'><span class='trp-nav-icon'>◴</span><span>运营管理</span><span class='trp-nav-arrow'>⌄</span></div>",
      "    <div class='trp-nav-item'><span class='trp-nav-icon'>⌘</span><span>AI 客服</span><span class='trp-nav-arrow'>⌄</span></div>",
      "    <div class='trp-nav-item'><span class='trp-nav-icon'>⚙</span><span>系统设置</span><span class='trp-nav-arrow'>⌄</span></div>",
      "    <div class='trp-nav-item'><span class='trp-nav-icon'>▣</span><span>服务管理</span><span class='trp-nav-arrow'>⌄</span></div>",
      "    <div class='trp-sub'><div class='active'>服务包管理</div><div>订单管理</div><div>交易记录</div></div>",
      "  </nav>",
      "  <div class='trp-side-bottom'>",
      "    <div class='trp-nav-item' style='padding:0 10px'><span class='trp-nav-icon'>♧</span><span>消息通知</span><span class='trp-badge'>99+</span></div>",
      "    <div class='trp-user'><span class='trp-avatar'></span><span>张蓉强</span><span class='trp-nav-arrow'>⌄</span></div>",
      "    <div class='trp-nav-item' style='padding:0 10px;margin-top:12px'><span class='trp-nav-icon'>☰</span><span>收起面板</span></div>",
      "  </div>",
      "</aside>",
      "<main class='trp-main'>",
      "  <div class='trp-title'><button class='trp-back' type='button' aria-label='返回'>‹</button><span>交易记录</span></div>",
      "  <section class='trp-card'>",
      "    <div class='trp-filter'>",
      "      <div class='trp-search'><div class='trp-search-left'><span>⌄</span><span>就诊人姓名</span></div><input placeholder='请输入' /></div>",
      "      <div class='trp-date'><span>交易日期：</span><div class='trp-date-box'><span>选择时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择时间</span><span>▣</span></div></div>",
      "    </div>",
      "    <div class='trp-summary'><span>共30条记录</span><span>收入合计： 24,000.00</span><span>退款合计： 4,000.00</span></div>",
      "    <table class='trp-table'>",
      "      <colgroup><col/><col/><col/><col/><col/><col/><col/><col/></colgroup>",
      "      <thead><tr><th>交易流水号</th><th>外部流水号</th><th>支付渠道</th><th>交易类型</th><th>交易金额（元）</th><th>下单时间</th><th>订单编号</th><th>服务包名称</th></tr></thead>",
      "      <tbody>" + rowHtml + "</tbody>",
      "    </table>",
      "    <div class='trp-pagination'>",
      "      <span class='trp-page ghost'>‹</span>",
      "      <div class='trp-page-list'><span class='trp-page'>1</span><span>...</span><span class='trp-page active'>2</span><span class='trp-page'>3</span><span class='trp-page'>4</span><span class='trp-page'>5</span><span>...</span><span class='trp-page'>50</span></div>",
      "      <span class='trp-page'>›</span>",
      "      <span class='trp-size'>20 / page⌄</span>",
      "      <label class='trp-go'>Go to <input /></label>",
      "    </div>",
      "  </section>",
      "</main>"
    ].join("");
    document.body.appendChild(page);
    page.querySelector(".trp-back").addEventListener("click", function () {
      document.body.classList.remove("transaction-record-page-v3-active");
      if (location.hash === "#transaction-records") history.replaceState(null, "", location.pathname + location.search);
    });
    return page;
  }

  function show() {
    injectStyle();
    render();
    document.body.classList.add("transaction-record-page-v3-active");
    if (location.hash !== "#transaction-records") {
      history.replaceState(null, "", location.pathname + location.search + "#transaction-records");
    }
  }

  function isTransactionRecordTrigger(target) {
    for (var el = target; el && el !== document.body; el = el.parentElement) {
      var text = (el.textContent || "").replace(/\s+/g, "");
      if (text === "交易记录") return true;
      if (text.length > 24) return false;
    }
    return false;
  }

  document.addEventListener("click", function (event) {
    if (!document.body.classList.contains("transaction-record-page-v3-active") && isTransactionRecordTrigger(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      show();
    }
  }, true);

  window.addEventListener("hashchange", function () {
    if (location.hash === "#transaction-records") show();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (location.hash === "#transaction-records") show();
    });
  } else if (location.hash === "#transaction-records") {
    show();
  }
})();
