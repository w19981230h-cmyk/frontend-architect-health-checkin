(function () {
  if (window.__serviceManagementRestored) return;
  window.__serviceManagementRestored = true;

  const orderRows = [
    ['SO202407030001', '糖尿病随访管理服务包', '王购买', '张患者', '30天', '绑定后计算', 188, '2024/07/03 09:20', '待使用'],
    ['SO202407020018', '心脑血管健康服务包', '李购买', '李患者', '90天', '2024/07/02-2024/09/30', 268, '2024/07/02 15:34', '生效中'],
    ['SO202407020006', '术后康复随访服务包', '陈购买', '--', '30天', '绑定后计算', 98, '2024/07/02 11:05', '待使用'],
    ['SO202406280023', '孕产全周期管理服务包', '赵购买', '赵患者', '180天', '2024/01/01-2024/06/28', 560, '2024/01/01 08:30', '已完成'],
    ['SO202406250015', '高血压强化管理服务包', '孙购买', '孙患者', '30天', '2024/06/25-2024/07/24', 128, '2024/06/25 18:12', '退款中'],
    ['SO202406220009', '用药提醒服务包', '周购买', '周患者', '30天', '2024/06/22-2024/07/21', 88, '2024/06/22 10:46', '已退款'],
    ['SO202406200031', '饮食营养干预服务包', '钱购买', '钱患者', '90天', '2024/06/20-2024/09/17', 198, '2024/06/20 13:22', '生效中'],
    ['SO202406180027', '儿童保健随访服务包', '吴购买', '吴患者', '90天', '2024/03/20-2024/06/18', 298, '2024/03/20 16:40', '已完成'],
    ['SO202406150012', '慢病复诊随访服务包', '郑购买', '郑患者', '60天', '2024/06/15-2024/08/13', 168, '2024/06/15 09:15', '生效中']
  ];

  const transactionRows = Array.from({ length: 9 }, (_, index) => [
    `1211411${index + 1}`,
    `12411441${index}`,
    index % 3 === 2 ? '支付宝' : '微信支付',
    index === 4 ? '退款' : '收入',
    index === 4 ? '128.00' : '1124.00',
    `2026/02/0${Math.min(index + 1, 9)} 13:30:15`,
    `15518121${index + 1}`,
    index % 2 ? '糖尿病随访管理服务包' : '冠心病出院健康服务包'
  ]);

  const servicePackageRows = [
    ['120017', true, '测试血脂', '测试血脂', '1月', '0.01', '测试血脂', '2', '已上架'],
    ['120016', false, '血脂管理', '血脂管理', '1月', '0.01', '血脂管理3', '4', '已上架'],
    ['120015', false, '血糖管理', '血糖管理', '1月', '0.01', '血糖管理3', '3', '已上架'],
    ['120014', false, '体重管理', '体重管理', '1月', '0.01', '体重管理3', '4', '已上架'],
    ['120012', false, '健康计划', '每日监督你的健康', '1月', '0.01', '90天健康减重管理方案', '2', '已上架'],
    ['120007', false, '测试一下服务包2', '测试一下服务包2', '1月', '0.01', '泽杰方案', '12', '已上架'],
    ['120006', false, '测试一下服务包支付', '测试一下服务包支付', '1月', '0.10', '-', '6', '已上架']
  ];

  function injectStyle() {
    const style = document.createElement('style');
    style.id = 'serviceManagementStyle';
    style.textContent = `
      [data-service-view] { cursor: pointer; }
      .service-page { width: 100%; min-height: calc(100vh - 96px); padding: 20px 22px 18px; flex-direction: column; border-radius: 12px; background: #fff; box-shadow: 0 10px 28px rgba(55,75,120,.06); }
      .service-filter { min-height: 70px; padding: 14px 16px; display: flex; align-items: center; gap: 28px; border-radius: 8px; background: #f7f9fc; }
      .service-field { display: flex; align-items: center; gap: 10px; color: #1f2d46; font-size: 14px; font-weight: 700; white-space: nowrap; }
      .service-field input { width: 250px; height: 36px; padding: 0 13px; border: 1px solid #d8e0ef; border-radius: 5px; color: #253450; background: #fff; outline: none; }
      .service-field input::placeholder { color: #aeb8c8; }
      .service-date { height: 36px; min-width: 286px; padding: 0 13px; display: inline-flex; align-items: center; justify-content: space-between; border: 1px solid #d8e0ef; border-radius: 5px; color: #a7b2c3; background: #fff; font-weight: 400; }
      .service-summary { min-height: 62px; display: flex; align-items: center; gap: 24px; color: #253450; font-size: 14px; border-bottom: 1px solid #e8edf5; }
      .order-tabs { flex: 1; align-self: stretch; display: flex; align-items: center; gap: 4px; }
      .order-tab { height: 62px; padding: 0 15px; border: 0; border-bottom: 2px solid transparent; color: #728098; background: transparent; cursor: pointer; }
      .order-tab.active { color: #174dff; border-bottom-color: #174dff; font-weight: 700; }
      .order-tab-count { margin-left: 4px; color: inherit; font-weight: 700; }
      .order-summary-metrics { margin-left: auto; display: flex; align-items: center; gap: 22px; white-space: nowrap; color: #53627a; }
      .order-summary-metrics strong { color: #1f2d46; font-weight: 700; }
      .service-table-wrap { flex: 1; overflow: auto; }
      .service-table { width: 100%; border-collapse: collapse; table-layout: fixed; color: #253450; font-size: 14px; }
      .service-table thead tr { height: 52px; background: #f4f6f9; }
      .service-table th { padding: 0 10px; color: #1f2d46; font-weight: 700; text-align: left; border-right: 1px solid #edf1f6; }
      .service-table th:last-child { border-right: 0; }
      .service-table tbody tr { height: 54px; border-bottom: 1px solid #edf1f6; }
      .service-table td { padding: 0 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .order-list-table th:nth-child(n+3), .order-list-table td:nth-child(n+3) { text-align: center; }
      .order-badge { height: 22px; padding: 0 8px; display: inline-flex; align-items: center; border-radius: 999px; font-size: 12px; font-weight: 700; }
      .order-badge.waiting { color: #c17800; background: #fff3d6; }
      .order-badge.active { color: #10a36f; background: #e8fbf2; }
      .order-badge.done { color: #627086; background: #edf2f8; }
      .order-badge.refunding { color: #e07b00; background: #fff1df; }
      .order-badge.refunded { color: #59687f; background: #eef3fb; }
      .service-link { border: 0; color: #174dff; background: transparent; cursor: pointer; }
      .service-pager { min-height: 66px; display: flex; align-items: center; justify-content: center; gap: 12px; color: #253450; }
      .service-pager button, .service-pager span.box { height: 32px; min-width: 32px; padding: 0 10px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #d8e0ef; border-radius: 5px; background: #fff; }
      .service-pager .active { border-color: #1f49ff; color: #fff; background: #1f49ff; }
      .order-detail-mask { position: fixed; inset: 0; z-index: 1000; background: rgba(20,32,54,.42); }
      .order-detail-mask[hidden] { display: none; }
      .order-detail-drawer { position: fixed; top: 0; right: 0; z-index: 1001; width: 560px; height: 100vh; display: flex; flex-direction: column; background: #fff; box-shadow: -18px 0 42px rgba(25,40,78,.18); transform: translateX(100%); transition: transform .18s ease; }
      .order-detail-drawer.active { transform: translateX(0); }
      .order-detail-head { min-height: 64px; padding: 0 22px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8edf5; }
      .order-detail-head strong { display: block; color: #1f2d46; font-size: 18px; }
      .order-detail-head span { display: block; margin-top: 4px; color: #7b879a; font-size: 12px; }
      .order-detail-close { width: 32px; height: 32px; border: 0; border-radius: 50%; color: #53627a; background: #f3f6fb; font-size: 20px; cursor: pointer; }
      .order-detail-content { flex: 1; overflow: auto; padding: 18px 22px 28px; background: #f7faff; }
      .order-detail-section { margin-bottom: 14px; overflow: hidden; border: 1px solid #dde6f3; border-radius: 10px; background: #fff; }
      .order-detail-section h3 { margin: 0; padding: 12px 14px; color: #1d3150; font-size: 15px; border-bottom: 1px solid #edf1f6; background: #f8fbff; }
      .order-detail-grid { padding: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .order-detail-item { min-height: 66px; padding: 11px; border: 1px solid #e5ebf5; border-radius: 8px; background: #fbfdff; }
      .order-detail-item span { display: block; margin-bottom: 6px; color: #7a8799; font-size: 12px; }
      .order-detail-item strong { color: #172846; font-size: 14px; line-height: 1.45; }
      .transaction-summary strong { color: #1f2d46; }
      .package-page { padding: 16px; }
      .package-toolbar { min-height: 48px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
      .package-toolbar-left { display: flex; align-items: center; gap: 8px; }
      .package-search { width: 228px; height: 34px; padding: 0 12px; display: flex; align-items: center; gap: 8px; border: 1px solid #dfe5ee; border-radius: 4px; background: #fff; }
      .package-search svg { width: 16px; height: 16px; color: #9ba7b7; }
      .package-search input { min-width: 0; flex: 1; border: 0; outline: 0; color: #263750; background: transparent; }
      .package-search input::placeholder { color: #b1bac8; }
      .package-column-btn { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #dfe5ee; border-radius: 4px; color: #4f5f75; background: #fff; cursor: pointer; }
      .package-column-btn svg { width: 18px; height: 18px; }
      .package-create-btn { height: 34px; padding: 0 14px; display: inline-flex; align-items: center; gap: 7px; border: 0; border-radius: 4px; color: #fff; background: #174dff; font-weight: 700; cursor: pointer; }
      .package-create-btn svg { width: 16px; height: 16px; }
      .package-table { font-size: 13px; }
      .package-table thead tr { height: 46px; }
      .package-table tbody tr { height: 50px; }
      .package-table th, .package-table td { padding: 0 8px; }
      .package-cover { width: 46px; height: 30px; display: grid; place-items: center; border: 1px solid #dfe5ee; border-radius: 3px; overflow: hidden; color: #a2adbc; background: #fff; }
      .package-cover.preview { position: relative; background: linear-gradient(#fff 0 72%, #f2f5f9 72%); }
      .package-cover.preview::before { content: ''; width: 34px; height: 2px; background: #d8e0eb; box-shadow: 0 5px 0 #e2e7ef, 0 10px 0 #e2e7ef; }
      .package-cover.preview::after { content: ''; position: absolute; right: 3px; top: 3px; width: 9px; height: 4px; border-radius: 1px; background: #31c777; }
      .package-status { color: #24ba72; font-weight: 700; }
      .package-status::before { content: '•'; margin-right: 5px; }
      .package-actions { display: flex; align-items: center; gap: 12px; }
      .package-actions button { padding: 0; border: 0; color: #174dff; background: transparent; cursor: pointer; }
      .package-footer { margin-top: auto; min-height: 58px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #53627a; }
      .package-footer button { width: 30px; height: 30px; border: 1px solid #dfe5ee; border-radius: 4px; color: #607087; background: #fff; }
      .package-footer button.active { border-color: #174dff; color: #fff; background: #174dff; }
      .package-page-size { width: 88px; height: 30px; padding: 0 10px; display: inline-flex; align-items: center; justify-content: space-between; border: 1px solid #dfe5ee; border-radius: 4px; background: #fff; }

      .package-editor-overlay { position: fixed; inset: 0; z-index: 2200; display: flex; flex-direction: column; color: #25344d; background: #eaf2fc; font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif; font-size: 14px; line-height: 1.5; }
      .package-editor-overlay button, .package-editor-overlay input, .package-editor-overlay textarea, .package-editor-overlay select { font: inherit; }
      .package-editor-overlay[hidden] { display: none; }
      .package-editor-top { height: 56px; flex: 0 0 56px; padding: 0 24px; display: flex; align-items: center; border-bottom: 1px solid #e4e9f1; background: #fff; }
      .package-editor-exit { display: inline-flex; align-items: center; gap: 5px; border: 0; color: #627086; background: transparent; cursor: pointer; }
      .package-editor-title { margin-left: 32px; color: #1f2d46; font-size: 16px; font-weight: 800; }
      .package-editor-save { height: 36px; margin-left: auto; padding: 0 20px; border: 0; border-radius: 4px; color: #fff; background: #174dff; font-weight: 700; cursor: pointer; }
      .package-editor-scroll { flex: 1; overflow: auto; padding: 24px 0 48px; background:
        linear-gradient(115deg, rgba(255,255,255,.76), rgba(236,244,255,.68) 34%, rgba(255,255,255,.42) 65%, rgba(229,239,252,.84)),
        repeating-linear-gradient(165deg, transparent 0 112px, rgba(180,199,225,.16) 113px 116px, transparent 117px 238px),
        #e8f1fb;
      }
      .package-editor-card { width: 720px; max-width: calc(100vw - 64px); min-height: 1520px; margin: 0 auto; padding: 40px; border-radius: 8px; background: #fff; box-shadow: 0 16px 40px rgba(62,83,116,.1); }
      .package-form-group { margin-bottom: 28px; }
      .package-form-label { margin-bottom: 10px; display: flex; align-items: center; gap: 6px; color: #283750; font-size: 14px; font-weight: 800; }
      .package-required { color: #ff4d4f; }
      .package-input-wrap { position: relative; }
      .package-form-input, .package-form-select, .package-form-textarea { width: 100%; box-sizing: border-box; border: 1px solid #dfe5ee; border-radius: 3px; color: #2b3b53; background: #fff; outline: none; }
      .package-form-input, .package-form-select { height: 42px; padding: 0 14px; }
      .package-form-textarea { min-height: 80px; padding: 12px 14px; resize: vertical; }
      .package-form-input:focus, .package-form-select:focus, .package-form-textarea:focus { border-color: #174dff; box-shadow: 0 0 0 2px rgba(23,77,255,.1); }
      .package-form-input::placeholder, .package-form-textarea::placeholder { color: #b0bac8; }
      .package-counter { position: absolute; right: 12px; bottom: 11px; color: #a7b1c0; font-size: 12px; }
      .package-upload { width: 88px; height: 88px; display: grid; place-items: center; align-content: center; gap: 8px; border: 1px dashed #d8e0eb; border-radius: 4px; color: #98a5b7; background: #fbfcfe; cursor: pointer; }
      .package-upload strong { color: #7f8ca0; font-size: 22px; font-weight: 400; }
      .package-price-input { width: 144px; position: relative; }
      .package-price-input span { position: absolute; left: 12px; top: 11px; color: #7f8ca0; }
      .package-price-input input { padding-left: 30px; }
      .package-tags, .package-duration { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
      .package-tag, .package-duration button { height: 36px; padding: 0 14px; border: 1px solid #e5eaf1; border-radius: 4px; color: #53627a; background: #f8fafc; cursor: pointer; }
      .package-tag.active, .package-duration button.active { border-color: #bfd0ff; color: #174dff; background: #f3f6ff; }
      .package-tag.add { background: #fff; }
      .package-duration-note { color: #9aa6b6; font-size: 12px; font-weight: 400; }
      .package-service-intro { margin-bottom: 24px; }
      .package-project { margin-top: 24px; }
      .package-project-head { min-height: 40px; display: flex; align-items: center; gap: 8px; font-size: 14px; }
      .package-drag { color: #aeb8c5; letter-spacing: -2px; }
      .package-project-head strong { color: #53627a; }
      .package-project-head button { margin-left: auto; border: 0; color: #ff5a61; background: transparent; cursor: pointer; }
      .package-project-title { height: 40px; padding: 0 12px; display: flex; align-items: center; color: #2d3d55; background: #f4f6f9; font-weight: 700; }
      .package-content-row { min-height: 48px; display: grid; grid-template-columns: 92px minmax(0,1fr) 104px; align-items: center; border: 1px solid #edf1f6; border-top: 0; font-size: 13px; line-height: 1.55; }
      .package-content-row > span { padding: 8px 12px; }
      .package-content-row > span + span { border-left: 1px solid #edf1f6; }
      .package-add-content { height: 40px; padding: 0 14px; display: flex; align-items: center; gap: 8px; border: 1px solid #edf1f6; border-top: 0; color: #6c7990; background: #fff; cursor: pointer; }
      .package-add-service { height: 40px; padding: 0 14px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid #dfe5ee; border-radius: 4px; color: #53627a; background: #fff; cursor: pointer; }
      .package-rules { min-height: 168px; line-height: 1.75; }
      .package-editor-toast { position: fixed; top: 64px; left: 50%; z-index: 2300; padding: 9px 16px; border-radius: 4px; color: #fff; background: #20a66a; box-shadow: 0 8px 24px rgba(32,166,106,.2); transform: translateX(-50%); }
      @media (max-width: 1280px) {
        .service-filter { gap: 14px; }
        .service-field input { width: 210px; }
        .order-tab { padding: 0 9px; }
        .package-editor-card { width: 680px; max-width: calc(100vw - 48px); padding: 32px; }
      }
    `;
    document.head.appendChild(style);
  }

  function badgeClass(status) {
    return { 待使用: 'waiting', 生效中: 'active', 已完成: 'done', 退款中: 'refunding', 已退款: 'refunded' }[status] || 'done';
  }

  function renderOrderRow(row) {
    const [orderNo, packageName, buyer, patient, period, term, pay, time, status] = row;
    return `<tr data-order-status="${status}" data-order-search="${row.join(' ')}">
      <td>${orderNo}</td><td title="${packageName}">${packageName}</td><td>${buyer}</td><td>${patient}</td>
      <td>${period}</td><td>${pay.toFixed(2)}</td><td>${time}</td>
      <td><span class="order-badge ${badgeClass(status)}">${status}</span></td>
      <td><button class="service-link" type="button" data-order-detail="${orderNo}">${status === '生效中' ? '服务详情' : status.includes('退款') ? '退款详情' : '订单详情'}</button></td>
    </tr>`;
  }

  function renderTransactionRow(row) {
    return `<tr>${row.map((cell, index) => `<td${index === 7 ? ` title="${cell}"` : ''}>${cell}</td>`).join('')}</tr>`;
  }

  function renderServicePackageRow(row) {
    const [code, hasCover, name, description, period, price, plan, subscriptions, status] = row;
    return `<tr data-package-row data-package-search="${code} ${name} ${description} ${plan}">
      <td>${code}</td><td><span class="package-cover${hasCover ? ' preview' : ''}">${hasCover ? '' : '-'}</span></td>
      <td>${name}</td><td>${description}</td><td>${period}</td><td>${price}</td><td>${plan}</td><td>${subscriptions}</td>
      <td><span class="package-status">${status}</span></td><td><span class="package-actions"><button type="button">订阅记录</button><button type="button">更多</button></span></td>
    </tr>`;
  }

  function renderPackageProject(label, title, rows) {
    return `<section class="package-project"><div class="package-project-head"><span class="package-drag">⠿</span><strong>${label}</strong><button type="button">♙ 删除</button></div><div class="package-project-title">${title}</div>${rows.map(row => `<div class="package-content-row"><span>${row[0]}</span><span>${row[1]}</span><span>${row[2]}</span></div>`).join('')}<button class="package-add-content" type="button">＋ 添加服务内容</button></section>`;
  }

  function injectViews() {
    const main = document.querySelector('.list-main');
    if (!main) return false;
    main.insertAdjacentHTML('beforeend', `
      <section class="list-panel list-view service-page package-page" id="servicePackageView">
        <div class="package-toolbar">
          <div class="package-toolbar-left">
            <label class="package-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input id="packageSearchInput" placeholder="搜索编号/名称"></label>
            <button class="package-column-btn" type="button" aria-label="字段设置"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="13" height="16" rx="2"/><path d="M8 8v8M12 8v8"/><circle cx="17" cy="17" r="3"/></svg></button>
          </div>
          <button class="package-create-btn" data-create-service-package type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 19h14V8l-3-3H5z"/><path d="M9 13l2 2 4-5"/></svg>新建服务包</button>
        </div>
        <div class="service-table-wrap"><table class="service-table package-table"><colgroup><col style="width:8%"><col style="width:6%"><col style="width:12%"><col style="width:16%"><col style="width:8%"><col style="width:8%"><col style="width:13%"><col style="width:8%"><col style="width:8%"><col style="width:13%"></colgroup><thead><tr>
          <th>服务包编号</th><th>封面</th><th>服务包名称</th><th>服务包描述</th><th>服务周期</th><th>价格(元)</th><th>关联方案</th><th>累计订阅</th><th>状态</th><th>操作</th>
        </tr></thead><tbody id="servicePackageRows">${servicePackageRows.map(renderServicePackageRow).join('')}</tbody></table></div>
        <div class="package-footer"><span>共 7 条</span><button type="button">‹</button><button class="active" type="button">1</button><button type="button">›</button><span class="package-page-size">10 条/页 <span>⌄</span></span></div>
      </section>
      <section class="list-panel list-view service-page" id="orderManagementView">
        <div class="service-filter">
          <label class="service-field"><span>搜索：</span><input id="orderSearchInput" placeholder="订单编号 / 服务包 / 购买人 / 就诊人"></label>
          <div class="service-field"><span>下单时间：</span><button class="service-date" type="button"><span>开始日期</span><span>—</span><span>结束日期</span><span>▣</span></button></div>
        </div>
        <div class="service-summary">
          <div class="order-tabs">
            ${['all:全部', '待使用:待使用', '生效中:生效中', '已完成:已完成', '退款中:退款中', '已退款:已退款'].map((item, index) => { const [value, label] = item.split(':'); return `<button class="order-tab${index === 0 ? ' active' : ''}" data-order-tab="${value}" data-label="${label}" type="button">${label}<span class="order-tab-count">（0）</span></button>`; }).join('')}
          </div>
          <div class="order-summary-metrics"><span id="orderTotalText"><strong>9</strong> 个订单</span><span id="orderPayTotalText">实付款合计：<strong>1,994.00</strong> 元</span></div>
        </div>
        <div class="service-table-wrap"><table class="service-table order-list-table"><colgroup><col style="width:13%"><col style="width:22%"><col style="width:9%"><col style="width:9%"><col style="width:8%"><col style="width:10%"><col style="width:14%"><col style="width:8%"><col style="width:7%"></colgroup><thead><tr>
          <th>订单编号</th><th>服务包</th><th>购买人</th><th>就诊人</th><th>服务周期</th><th>实付金额</th><th>下单时间</th><th>订单状态</th><th>操作</th>
        </tr></thead><tbody id="orderRows">${orderRows.map(renderOrderRow).join('')}</tbody></table></div>
        <div class="service-pager"><button>‹</button><button>1</button><span>...</span><button class="active">2</button><button>3</button><button>4</button><button>5</button><span>...</span><button>50</button><button>›</button><span class="box">20 / page⌄</span><span>Go to</span><span class="box"></span></div>
      </section>
      <section class="list-panel list-view service-page" id="transactionRecordView">
        <div class="service-filter">
          <label class="service-field"><span>搜索：</span><input id="transactionSearchInput" placeholder="交易流水号 / 订单编号 / 服务包"></label>
          <div class="service-field"><span>交易日期：</span><button class="service-date" type="button"><span>选择时间</span><span>→</span><span>选择时间</span><span>▣</span></button></div>
        </div>
        <div class="service-summary transaction-summary"><strong id="transactionTotalText">共9条记录</strong><span>收入合计：8,992.00元</span><span>退款合计：128.00元</span></div>
        <div class="service-table-wrap"><table class="service-table"><thead><tr>
          <th>交易流水号</th><th>外部流水号</th><th>支付渠道</th><th>交易类型</th><th>交易金额（元）</th><th style="width:165px">下单时间</th><th>订单编号</th><th style="width:190px">服务包名称</th>
        </tr></thead><tbody id="transactionRows">${transactionRows.map(renderTransactionRow).join('')}</tbody></table></div>
        <div class="service-pager"><button>‹</button><button>1</button><span>...</span><button class="active">2</button><button>3</button><button>4</button><button>5</button><span>...</span><button>50</button><button>›</button><span class="box">20 / page⌄</span><span>Go to</span><span class="box"></span></div>
      </section>
    `);
    document.body.insertAdjacentHTML('beforeend', `
      <div class="order-detail-mask" id="restoredOrderMask" hidden></div>
      <aside class="order-detail-drawer" id="restoredOrderDrawer" aria-hidden="true">
        <div class="order-detail-head"><div><strong id="restoredOrderTitle">订单详情</strong><span id="restoredOrderSub"></span></div><button class="order-detail-close" data-close-restored-order type="button">×</button></div>
        <div class="order-detail-content" id="restoredOrderContent"></div>
      </aside>
      <section class="package-editor-overlay" id="packageEditorOverlay" hidden aria-label="新建服务包">
        <header class="package-editor-top"><button class="package-editor-exit" data-close-package-editor type="button">× <span>退出</span></button><strong class="package-editor-title">新建服务包</strong><button class="package-editor-save" data-save-service-package type="button">保存</button></header>
        <div class="package-editor-scroll">
          <form class="package-editor-card" id="packageEditorForm">
            <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>服务包名称</label><div class="package-input-wrap"><input class="package-form-input" data-package-form-input maxlength="20" placeholder="请输入"><span class="package-counter">0 / 20</span></div></div>
            <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>服务包描述</label><div class="package-input-wrap"><input class="package-form-input" data-package-form-input maxlength="20" placeholder="一句话简介/核心价值"><span class="package-counter">0 / 20</span></div></div>
            <div class="package-form-group"><label class="package-form-label">服务包封面</label><button class="package-upload" type="button"><strong>＋</strong><span>上传封面</span></button></div>
            <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>服务包价格</label><div class="package-price-input"><span>¥</span><input class="package-form-input" data-package-form-input placeholder="请输入价格"></div></div>
            <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>关键词标签</label><div class="package-tags"><button class="package-tag active" type="button">三甲专家</button><button class="package-tag" type="button">个性化方案</button><button class="package-tag" type="button">全周期管理</button><button class="package-tag" type="button">专业健康评估</button><button class="package-tag" type="button">7×24h服务</button><button class="package-tag add" type="button">＋ 自定义</button></div></div>
            <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>服务有效期 <span class="package-duration-note">1个月~30天、1年~365天</span></label><div class="package-duration"><button class="active" type="button">1个月</button><button type="button">3个月</button><button type="button">6个月</button><button type="button">1年</button><button type="button">自定义</button></div></div>
            <div class="package-form-group"><label class="package-form-label">关联方案</label><select class="package-form-select" data-package-form-input><option>请选择关联方案</option><option>90天健康减重管理方案</option><option>糖尿病随访管理方案</option></select></div>
            <div class="package-form-group package-service-intro"><label class="package-form-label"><span class="package-required">*</span>服务简介</label><div class="package-input-wrap"><textarea class="package-form-textarea" data-package-form-input maxlength="500" placeholder="请输入服务简介"></textarea><span class="package-counter">0 / 500</span></div></div>
            <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>服务项目 <span class="package-duration-note">至少设置一项服务项目与内容</span></label>
              ${renderPackageProject('服务项目1', '健康档案', [['服务内容1', '建立慢病健康档案，整合就诊记录、检查结果和日常健康信息', '1次/年']])}
              ${renderPackageProject('服务项目2', '个性化健康管理计划', [['服务内容1', '纳入管理后提供全面的健康评估，根据评估结果制定健康管理计划', '1次/年'], ['服务内容2', '根据管理期间的回访情况、复诊结果等动态调整健康管理计划', '全年持续'], ['服务内容3', '定期线上健康回访服务', '12次/年'], ['服务内容4', '定期推送线下复诊提醒，线下门诊复诊签约医生关注号', '12次/年'], ['服务内容5', '提供线下门诊专家解答服务以及医院就医服务能力介绍', '12次/年']])}
              ${renderPackageProject('服务项目3', '全程健康守护', [['服务内容1', '持续记录并分析关键健康指标，形成长期健康趋势', '全年持续'], ['服务内容2', '监控指标变化，异常指标实时预警并推送至签约医生团队', '全年持续'], ['服务内容3', '提供阶段性健康评估，回顾整体健康情况，扫描健康风险', '全年持续'], ['服务内容4', '线上慢病相关健康咨询，辅助理解病情与管理建议', '全年持续'], ['服务内容5', '日常用药提醒与打卡', '全年持续'], ['服务内容6', '定期发布健康宣教', '全年持续']])}
              ${renderPackageProject('服务项目4', '家庭安心包', [['服务内容1', '授权后，家属可查看健康档案', '全年持续'], ['服务内容2', '健康回访结果、复诊结果、健康预警实时推送家属', '全年持续'], ['服务内容3', '出现长期未监测、未回访等情况时，及时提醒家属关注', '全年持续']])}
              <button class="package-add-service" type="button">＋ 添加服务</button>
            </div>
            <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>服务规则</label><textarea class="package-form-textarea package-rules" data-package-form-input>1. 服务有效期为365天自购买之日计算。&#10;2. 有效期内，可以使用套餐项目次数超过有效期或者有效期内次数用完后，按正常服务价格收费。&#10;3. 绑定就诊人：一个订单仅限一个就诊人使用，购买服务发起使用成功后无法更改就诊人。&#10;4. 使用说明：该服务需在服务内容中的服务项目，不包含其他医院行动产生的费用。&#10;5. 退款费：手术费、住院费、超出限定次数的挂号费等。&#10;6. 客服电话：000-00000000</textarea><div class="package-counter" style="position:static;text-align:right;margin-top:4px">283 / 500</div></div>
            <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>服务协议</label><select class="package-form-select" data-package-form-input><option>请选择服务协议</option><option>健康管理服务协议</option></select></div>
          </form>
        </div>
      </section>
    `);
    return true;
  }

  function setServiceActive(view) {
    const targetId = view === 'packages' ? 'servicePackageView' : view === 'orders' ? 'orderManagementView' : 'transactionRecordView';
    document.querySelectorAll('.list-main > .list-view').forEach(panel => panel.classList.toggle('active', panel.id === targetId));
    document.getElementById('listPageTitle').textContent = view === 'packages' ? '服务包管理' : view === 'orders' ? '订单管理' : '交易记录';
    document.querySelector('.list-main')?.classList.remove('workbench-main');
    document.querySelectorAll('.menu .submenu-item').forEach(item => item.classList.toggle('active', item.dataset.serviceView === view));
    document.querySelectorAll('.menu-section > .menu-item').forEach(item => item.classList.remove('active'));
    if (view === 'packages') {
      const packageSearch = document.getElementById('packageSearchInput');
      if (packageSearch && packageSearch.dataset.userEdited !== 'true') packageSearch.value = '';
      applyPackageFilter();
    }
    if (view === 'orders') applyOrderFilter();
    if (view === 'transactions') applyTransactionFilter();
  }

  function applyPackageFilter() {
    const keyword = (document.getElementById('packageSearchInput')?.value || '').trim().toLowerCase();
    document.querySelectorAll('[data-package-row]').forEach(row => {
      row.hidden = !!keyword && !row.dataset.packageSearch.toLowerCase().includes(keyword);
    });
  }

  function applyOrderFilter() {
    const keyword = (document.getElementById('orderSearchInput')?.value || '').trim().toLowerCase();
    const status = document.querySelector('.order-tab.active')?.dataset.orderTab || 'all';
    const statusCounts = { all: 0, 待使用: 0, 生效中: 0, 已完成: 0, 退款中: 0, 已退款: 0 };
    let visible = 0;
    let total = 0;
    document.querySelectorAll('#orderRows tr').forEach(row => {
      const keywordHit = !keyword || row.dataset.orderSearch.toLowerCase().includes(keyword);
      if (keywordHit) {
        statusCounts.all += 1;
        statusCounts[row.dataset.orderStatus] = (statusCounts[row.dataset.orderStatus] || 0) + 1;
      }
      const hit = keywordHit && (status === 'all' || row.dataset.orderStatus === status);
      row.hidden = !hit;
      if (hit) {
        visible += 1;
        total += Number(row.children[5].textContent || 0);
      }
    });
    document.querySelectorAll('[data-order-tab]').forEach(tab => {
      const value = tab.dataset.orderTab || 'all';
      const label = tab.dataset.label || value;
      tab.innerHTML = `${label}<span class="order-tab-count">（${statusCounts[value] || 0}）</span>`;
    });
    document.getElementById('orderTotalText').innerHTML = `<strong>${visible}</strong> 个订单`;
    document.getElementById('orderPayTotalText').innerHTML = `实付款合计：<strong>${total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> 元`;
  }

  function applyTransactionFilter() {
    const keyword = (document.getElementById('transactionSearchInput')?.value || '').trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll('#transactionRows tr').forEach(row => {
      const hit = !keyword || row.textContent.toLowerCase().includes(keyword);
      row.hidden = !hit;
      if (hit) visible += 1;
    });
    document.getElementById('transactionTotalText').textContent = `共${visible}条记录`;
  }

  function openOrderDetail(orderNo) {
    const row = orderRows.find(item => item[0] === orderNo);
    if (!row) return;
    const [number, packageName, buyer, patient, period, term, pay, time, status] = row;
    const fields = [
      ['订单编号', number], ['服务包', packageName], ['购买人', buyer], ['就诊人', patient],
      ['服务周期', period], ['服务期限', term], ['实付金额', `${pay.toFixed(2)} 元`], ['下单时间', time],
      ['当前状态', status], ['支付渠道', '微信支付'], ['权益状态', status === '待使用' ? '等待绑定后生效' : status.includes('退款') ? '权益已锁定' : '权益正常']
    ];
    document.getElementById('restoredOrderTitle').textContent = status === '生效中' ? '服务详情' : status.includes('退款') ? '退款详情' : '订单详情';
    document.getElementById('restoredOrderSub').textContent = `${number} · ${status}`;
    document.getElementById('restoredOrderContent').innerHTML = `
      <section class="order-detail-section"><h3>订单基础信息</h3><div class="order-detail-grid">${fields.map(([label, value]) => `<div class="order-detail-item"><span>${label}</span><strong>${value}</strong></div>`).join('')}</div></section>
      <section class="order-detail-section"><h3>服务说明</h3><div class="order-detail-grid"><div class="order-detail-item"><span>履约说明</span><strong>${status === '待使用' ? '绑定就诊人后生成服务实例并开始计算服务周期。' : '服务权益、健康方案和随访任务按订单状态同步执行。'}</strong></div><div class="order-detail-item"><span>操作记录</span><strong>支付确认、权益初始化和状态变更记录均已保留。</strong></div></div></section>`;
    document.getElementById('restoredOrderMask').hidden = false;
    document.getElementById('restoredOrderDrawer').classList.add('active');
    document.getElementById('restoredOrderDrawer').setAttribute('aria-hidden', 'false');
  }

  function closeOrderDetail() {
    document.getElementById('restoredOrderMask').hidden = true;
    document.getElementById('restoredOrderDrawer').classList.remove('active');
    document.getElementById('restoredOrderDrawer').setAttribute('aria-hidden', 'true');
  }

  function openPackageEditor() {
    const overlay = document.getElementById('packageEditorOverlay');
    if (!overlay) return;
    overlay.hidden = false;
    overlay.querySelector('.package-editor-scroll').scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closePackageEditor() {
    const overlay = document.getElementById('packageEditorOverlay');
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  function savePackageDraft() {
    document.querySelector('.package-editor-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'package-editor-toast';
    toast.textContent = '服务包草稿已保存';
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1600);
  }

  injectStyle();
  if (!injectViews()) return;

  document.addEventListener('click', event => {
    const serviceEntry = event.target.closest('[data-service-view]');
    if (serviceEntry) {
      event.preventDefault();
      setServiceActive(serviceEntry.dataset.serviceView);
      return;
    }
    const regularEntry = event.target.closest('[data-list-view]');
    if (regularEntry) {
      document.getElementById('servicePackageView')?.classList.remove('active');
      document.getElementById('orderManagementView')?.classList.remove('active');
      document.getElementById('transactionRecordView')?.classList.remove('active');
    }
    const orderTab = event.target.closest('[data-order-tab]');
    if (orderTab) {
      document.querySelectorAll('.order-tab').forEach(tab => tab.classList.toggle('active', tab === orderTab));
      applyOrderFilter();
    }
    const detail = event.target.closest('[data-order-detail]');
    if (detail) openOrderDetail(detail.dataset.orderDetail);
    if (event.target.closest('[data-close-restored-order]') || event.target.id === 'restoredOrderMask') closeOrderDetail();
    if (event.target.closest('[data-create-service-package]')) openPackageEditor();
    if (event.target.closest('[data-close-package-editor]')) closePackageEditor();
    if (event.target.closest('[data-save-service-package]')) savePackageDraft();
    const duration = event.target.closest('.package-duration button');
    if (duration) duration.parentElement.querySelectorAll('button').forEach(button => button.classList.toggle('active', button === duration));
    const tag = event.target.closest('.package-tag:not(.add)');
    if (tag) tag.classList.toggle('active');
  }, true);

  document.addEventListener('input', event => {
    if (event.target.id === 'orderSearchInput') applyOrderFilter();
    if (event.target.id === 'transactionSearchInput') applyTransactionFilter();
    if (event.target.id === 'packageSearchInput') {
      if (event.isTrusted) {
        event.target.dataset.userEdited = 'true';
      } else if (event.target.dataset.userEdited !== 'true') {
        event.target.value = '';
      }
      applyPackageFilter();
    }
    if (event.target.matches('[maxlength]')) {
      const counter = event.target.closest('.package-input-wrap')?.querySelector('.package-counter');
      if (counter) counter.textContent = `${event.target.value.length} / ${event.target.maxLength}`;
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeOrderDetail();
  });

  // These views are mounted after the original program. Clear any legacy
  // positional form-state values that may otherwise be applied to the new inputs.
  window.setTimeout(() => {
    const orderSearch = document.getElementById('orderSearchInput');
    const transactionSearch = document.getElementById('transactionSearchInput');
    const packageSearch = document.getElementById('packageSearchInput');
    if (orderSearch) orderSearch.value = '';
    if (transactionSearch) transactionSearch.value = '';
    if (packageSearch) packageSearch.value = '';
    if (packageSearch) packageSearch.dataset.userEdited = 'false';
    document.querySelectorAll('[data-package-form-input]').forEach(input => {
      if (input.tagName === 'SELECT') input.selectedIndex = 0;
      else if (!input.classList.contains('package-rules')) input.value = '';
    });
    applyPackageFilter();
    applyOrderFilter();
    applyTransactionFilter();
  }, 80);
})();
