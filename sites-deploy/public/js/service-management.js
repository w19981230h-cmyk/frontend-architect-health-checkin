(function () {
  if (window.__serviceManagementRestored) return;
  window.__serviceManagementRestored = true;

  const defaultPackageCover = './assets/service-package/weight-management-clean.png';

  const orderRows = [
    ['SO202407030001', '糖尿病随访管理服务包', '王购买', '--', '30天', '绑定后计算', 188, '2024/07/03 09:20', '待使用'],
    ['SO202407020018', '心脑血管健康服务包', '李购买', '李患者', '90天', '2024/07/02-2024/09/30', 268, '2024/07/02 15:34', '生效中'],
    ['SO202407020006', '术后康复随访服务包', '陈购买', '--', '30天', '绑定后计算', 98, '2024/07/02 11:05', '待审核'],
    ['SO202407010021', '肾脏健康随访服务包', '何购买', '--', '30天', '绑定后计算', 158, '2024/07/01 10:22', '待审核'],
    ['SO202406300019', '体重管理服务包', '许购买', '--', '90天', '绑定后计算', 299, '2024/06/30 14:05', '待审核'],
    ['SO202406290017', '睡眠改善服务包', '林购买', '--', '30天', '绑定后计算', 199, '2024/06/29 19:36', '待审核'],
    ['SO202406280023', '孕产全周期管理服务包', '赵购买', '赵患者', '180天', '2024/01/01-2024/06/28', 560, '2024/01/01 08:30', '已完成'],
    ['SO202406250015', '高血压强化管理服务包', '孙购买', '--', '30天', '2024/06/25-2024/07/24', 128, '2024/06/25 18:12', '退款中'],
    ['SO202406220009', '用药提醒服务包', '周购买', '--', '30天', '2024/06/22-2024/07/21', 88, '2024/06/22 10:46', '已退款'],
    ['SO202406200031', '饮食营养干预服务包', '钱购买', '钱患者', '90天', '2024/06/20-2024/09/17', 198, '2024/06/20 13:22', '生效中'],
    ['SO202406180027', '儿童保健随访服务包', '吴购买', '吴患者', '90天', '2024/03/20-2024/06/18', 298, '2024/03/20 16:40', '已完成'],
    ['SO202406150012', '慢病复诊随访服务包', '郑购买', '郑患者', '60天', '2024/06/15-2024/08/13', 168, '2024/06/15 09:15', '生效中']
  ];
  const orderRefundReviewResults = new Map();
  const orderOverallCount = orderRows.length;
  const orderOverallPayTotal = orderRows.reduce((sum, row) => sum + row[6], 0);
  let orderCurrentPage = 1;
  let orderPageSize = 10;

  const transactionRows = [
    { no: 'TN202608050001', type: '支付', orderNo: 'SP202608050001', packageName: '血糖管理服务包', buyer: '张三', channel: '微信支付', amount: 299, status: '成功', time: '2026-08-05 10:00', merchantNo: 'MCH202608050001', channelNo: '420000274920260805100001', channelTime: '2026-08-05 10:00:18', channelResult: 'SUCCESS · 支付成功' },
    { no: 'TN202608050002', type: '退款', orderNo: 'SP202608050001', packageName: '血糖管理服务包', buyer: '张三', channel: '微信支付', amount: 299, status: '处理中', time: '2026-08-05 10:10', refundNo: 'RF202608050001', originalPaymentNo: '420000274920260805100001', channelRefundNo: '503020082220260805100001', reason: '用户购买后未绑定就诊人，申请退款', requestedAt: '2026-08-05 10:10:08', completedAt: '--', lastQueriedAt: '2026-08-05 10:18:36', progress: '支付渠道已受理，等待渠道最终结果', failureReason: '--', retryCount: 0, lastRetryAt: '--', note: '预计 1–3 个工作日原路退回' },
    { no: 'TN202608050003', type: '支付', orderNo: 'SP202608050002', packageName: '体重管理服务包', buyer: '李四', channel: '微信支付', amount: 199, status: '成功', time: '2026-08-05 10:42', merchantNo: 'MCH202608050002', channelNo: '420000274920260805100002', channelTime: '2026-08-05 10:42:11', channelResult: 'SUCCESS · 支付成功' },
    { no: 'TN202608050004', type: '退款', orderNo: 'SP202608050002', packageName: '体重管理服务包', buyer: '李四', channel: '微信支付', amount: 199, status: '成功', time: '2026-08-05 11:20', refundNo: 'RF202608050002', originalPaymentNo: '420000274920260805100002', channelRefundNo: '503020082220260805100002', reason: '用户主动申请退款', requestedAt: '2026-08-05 11:20:06', completedAt: '2026-08-05 11:26:42', lastQueriedAt: '2026-08-05 11:27:03', progress: '退款已原路退回', failureReason: '--', retryCount: 0, lastRetryAt: '--', note: '渠道退款成功' },
    { no: 'TN202608050005', type: '支付', orderNo: 'SP202608050003', packageName: '高血压管理服务包', buyer: '王芳', channel: '支付宝', amount: 329, status: '成功', time: '2026-08-05 12:05', merchantNo: 'MCH202608050003', channelNo: '202608052200149301100003', channelTime: '2026-08-05 12:05:27', channelResult: 'TRADE_SUCCESS · 支付成功' },
    { no: 'TN202608050007', type: '支付', orderNo: 'SP202608050005', packageName: '术后康复随访服务包', buyer: '陈涛', channel: '微信支付', amount: 239, status: '成功', time: '2026-08-05 14:08', merchantNo: 'MCH202608050005', channelNo: '420000274920260805100005', channelTime: '2026-08-05 14:08:39', channelResult: 'SUCCESS · 支付成功' },
    { no: 'TN202608050008', type: '退款', orderNo: 'SP202608050005', packageName: '术后康复随访服务包', buyer: '陈涛', channel: '微信支付', amount: 239, status: '失败', time: '2026-08-05 14:30', refundNo: 'RF202608050003', originalPaymentNo: '420000274920260805100005', channelRefundNo: '--', reason: '服务计划变更', requestedAt: '2026-08-05 14:30:12', completedAt: '--', lastQueriedAt: '2026-08-05 15:02:21', progress: '退款提交失败，等待运营处理', failureReason: '渠道返回：原支付订单状态异常', retryCount: 2, lastRetryAt: '2026-08-05 15:00:08', note: '已通知支付运营核对原支付订单' },
    { no: 'TN202608050009', type: '支付', orderNo: 'SP202608050006', packageName: '营养膳食管理服务包', buyer: '周宁', channel: '支付宝', amount: 159, status: '成功', time: '2026-08-05 16:12', merchantNo: 'MCH202608050006', channelNo: '202608052200149301100006', channelTime: '2026-08-05 16:12:44', channelResult: 'TRADE_SUCCESS · 支付成功' }
  ];
  let transactionCurrentPage = 1;
  let transactionPageSize = 10;

  const servicePackageRows = [
    ['120101', 'weight', '轻盈减重管理服务包', '营养师陪伴，科学减脂不反弹', '90天', '299.00', '90天健康减重管理方案', '128', '已上架'],
    ['120102', 'glucose', '控糖管理服务包', '血糖监测、饮食指导与用药提醒', '90天', '399.00', '糖尿病全周期管理方案', '86', '已上架'],
    ['120103', 'pressure', '高血压管理服务包', '血压监测与生活方式改善指导', '90天', '329.00', '高血压强化管理方案', '64', '已上架'],
    ['120104', 'lipid', '血脂改善服务包', '血脂指标跟踪及心血管风险管理', '90天', '269.00', '心血管健康管理方案', '42', '已上架'],
    ['120105', 'sleep', '睡眠改善服务包', '睡眠评估、作息调整与持续随访', '30天', '199.00', '30天科学睡眠改善方案', '57', '待上架'],
    ['120106', 'nutrition', '营养膳食管理服务包', '个性化膳食评估与营养搭配指导', '30天', '159.00', '家庭营养管理方案', '73', '已上架'],
    ['120107', 'recovery', '术后康复随访服务包', '康复计划、复诊提醒与恢复评估', '30天', '239.00', '术后康复随访方案', '35', '待上架']
  ];

  const serviceRecordPeople = [
    ['李可', 'LK', '女', 30], ['张熙', 'ZX', '女', 38], ['王晨', 'WC', '男', 45], ['周宁', 'ZN', '女', 34],
    ['陈宇', 'CY', '男', 42], ['赵敏', 'ZM', '女', 29], ['孙浩', 'SH', '男', 51], ['刘芳', 'LF', '女', 47],
    ['黄杰', 'HJ', '男', 36], ['吴悦', 'WY', '女', 33], ['徐宁', 'XN', '男', 40], ['郑妍', 'ZY', '女', 28]
  ];
  let currentPackageServiceRecords = [];
  let packageRecordState = { code: '', keyword: '', status: '全部', page: 1, pageSize: 10 };

  function formatServiceRecordDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  function buildPackageServiceRecords(item) {
    const total = Number(item?.[7]) || 0;
    const periodDays = Math.max(1, parseInt(item?.[4], 10) || 90);
    const activeTotal = item?.[0] === '120101' ? 24 : Math.max(1, Math.round(total * .2));
    let activeUsed = 0;
    let completedUsed = 0;
    return Array.from({ length: total }, (_, index) => {
      const remainingActive = activeTotal - activeUsed;
      const remainingCompleted = total - activeTotal - completedUsed;
      const isActive = remainingActive > 0 && (index % 5 === 0 || remainingCompleted <= 0);
      if (isActive) activeUsed += 1;
      else completedUsed += 1;
      const [name, initials, gender, baseAge] = serviceRecordPeople[index % serviceRecordPeople.length];
      const cycle = Math.floor(index / serviceRecordPeople.length);
      const status = isActive ? '生效中' : '已完成';
      const end = isActive
        ? new Date(Date.UTC(2026, 9, 27 - (activeUsed - 1) % 18))
        : new Date(Date.UTC(2026, 6, 20 - (completedUsed - 1) % 90));
      const start = new Date(end.getTime() - (periodDays - 1) * 86400000);
      const remaining = isActive ? Math.max(1, Math.ceil((end.getTime() - Date.UTC(2026, 7, 5)) / 86400000)) : 0;
      const idSuffix = `44010119900101${String(index).padStart(4, '0')}`;
      const mobile = `13${String(800000000 + index * 7919).slice(-9)}`;
      return {
        id: `${item[0]}-${String(index + 1).padStart(4, '0')}`,
        name,
        initials,
        gender,
        age: baseAge + (cycle % 3),
        idCard: idSuffix,
        mobile,
        status,
        start: formatServiceRecordDate(start),
        end: formatServiceRecordDate(end),
        remaining,
        boundAt: index === 0 ? `${formatServiceRecordDate(start)} 10:20` : `${formatServiceRecordDate(start)} ${String(9 + index % 9).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
        completedAt: status === '已完成' ? formatServiceRecordDate(end) : '',
        purchaseSequence: cycle + 1
      };
    });
  }

  function injectStyle() {
    const style = document.createElement('style');
    style.id = 'serviceManagementStyle';
    style.textContent = `
      [data-service-view] { cursor: pointer; }
      .service-page { width: 100%; min-height: calc(100vh - 96px); padding: 20px 22px 18px; flex-direction: column; border-radius: 12px; background: #fff; box-shadow: 0 10px 28px rgba(55,75,120,.06); }
      .service-filter { min-height: 64px; padding: 16px 24px; display: flex; align-items: center; gap: 24px; border: 1px solid #f0f0f0; border-radius: 8px; background: #fafafa; }
      .service-query-bar { flex-wrap: wrap; gap: 16px 24px; }
      .service-query-bar .service-query-keyword input { width: 320px; }
      .service-query-bar .service-filter-actions { margin-left: 0; }
      .service-field { display: flex; align-items: center; gap: 8px; color: rgba(0,0,0,.88); font-size: 14px; font-weight: 400; white-space: nowrap; }
      .service-field input { width: 260px; height: 32px; box-sizing: border-box; padding: 0 11px; border: 1px solid #d9d9d9; border-radius: 6px; color: rgba(0,0,0,.88); background: #fff; outline: none; transition: border-color .2s, box-shadow .2s; }
      .service-field select { height: 32px; min-width: 112px; box-sizing: border-box; padding: 0 28px 0 11px; border: 1px solid #d9d9d9; border-radius: 6px; color: rgba(0,0,0,.88); background: #fff; outline: none; transition: border-color .2s, box-shadow .2s; }
      .service-field input::placeholder { color: rgba(0,0,0,.25); }
      .service-field input:hover, .service-field select:hover, .service-date:hover { border-color: #4096ff; }
      .service-field input:focus-visible, .service-field select:focus-visible, .service-date:focus-visible, .ant-query-btn:focus-visible, .order-tab:focus-visible, .service-link:focus-visible { border-color: #1677ff; outline: 0; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .service-date { height: 32px; min-width: 260px; padding: 0 7px 0 11px; display: inline-flex; align-items: center; justify-content: space-between; gap: 6px; border: 1px solid #d9d9d9; border-radius: 6px; color: rgba(0,0,0,.25); background: #fff; font-weight: 400; transition: border-color .2s, box-shadow .2s; }
      .service-date:focus-within { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .service-date input { width: 112px; height: 30px; padding: 0; border: 0; border-radius: 0; color: rgba(0,0,0,.88); background: transparent; box-shadow: none; font: inherit; }
      .service-date input:hover { border-color: transparent; }
      .service-date input:focus-visible { border: 0; outline: 0; box-shadow: none; }
      .service-date input::-webkit-calendar-picker-indicator { cursor: pointer; opacity: .55; }
      .service-date-separator { color: rgba(0,0,0,.45); }
      .service-filter-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
      .ant-query-btn { height: 32px; padding: 0 15px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #d9d9d9; border-radius: 6px; color: rgba(0,0,0,.88); background: #fff; box-shadow: 0 2px 0 rgba(0,0,0,.02); font-size: 14px; cursor: pointer; transition: color .2s, border-color .2s, background .2s, box-shadow .2s; }
      .ant-query-btn:hover { color: #4096ff; border-color: #4096ff; }
      .ant-query-btn.primary { color: #fff; border-color: #1677ff; background: #1677ff; box-shadow: 0 2px 0 rgba(5,145,255,.1); }
      .ant-query-btn.primary:hover { color: #fff; border-color: #4096ff; background: #4096ff; }
      .ant-query-btn:active { color: #0958d9; border-color: #0958d9; }
      .ant-query-btn.primary:active { color: #fff; border-color: #0958d9; background: #0958d9; }
      .service-summary { min-height: 64px; display: flex; align-items: center; gap: 24px; color: rgba(0,0,0,.88); font-size: 14px; border-bottom: 1px solid #f0f0f0; }
      .order-tabs { flex: 0 1 auto; display: flex; align-items: center; gap: 2px; padding: 4px; border-radius: 8px; background: rgba(0,0,0,.04); }
      .order-tab { height: 32px; padding: 0 12px; border: 0; border-radius: 6px; color: rgba(0,0,0,.65); background: transparent; font-size: 14px; cursor: pointer; transition: color .2s, background .2s, box-shadow .2s; }
      .order-tab:hover { color: rgba(0,0,0,.88); }
      .order-tab.active { color: rgba(0,0,0,.88); background: #fff; box-shadow: 0 2px 8px -2px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.04); font-weight: 500; }
      .order-tab-count { margin-left: 2px; color: rgba(0,0,0,.45); font-weight: 400; }
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
      .order-badge.review { color: #531dab; background: #f9f0ff; }
      .order-badge.refunding { color: #e07b00; background: #fff1df; }
      .order-badge.refunded { color: #59687f; background: #eef3fb; }
      .service-link { border: 0; color: #174dff; background: transparent; cursor: pointer; }
      .transaction-filter { flex-wrap: wrap; gap: 16px 24px; }
      .transaction-summary { min-height: 64px; gap: 32px; }
      .transaction-summary strong { color: rgba(0,0,0,.88); font-weight: 600; }
      .transaction-summary span { color: rgba(0,0,0,.65); }
      .transaction-summary b { color: rgba(0,0,0,.88); font-weight: 600; }
      .transaction-table { table-layout: fixed; font-size: 13px; }
      .transaction-table th, .transaction-table td { padding: 0 8px; }
      .transaction-table th:nth-child(7), .transaction-table td:nth-child(7) { text-align: right; }
      .transaction-table th:nth-child(8), .transaction-table td:nth-child(8), .transaction-table th:last-child, .transaction-table td:last-child { text-align: center; }
      .transaction-table tbody tr[data-transaction-row] { cursor: pointer; transition: background-color .2s; }
      .transaction-table tbody tr[data-transaction-row]:hover { background: #fafafa; }
      .transaction-table tbody tr[data-transaction-row]:focus-visible { outline: 2px solid #1677ff; outline-offset: -2px; background: #e6f4ff; }
      .transaction-type { height: 22px; padding: 0 8px; display: inline-flex; align-items: center; border-radius: 999px; font-size: 12px; font-weight: 500; }
      .transaction-type.payment { color: #0958d9; background: #e6f4ff; }
      .transaction-type.refund { color: #531dab; background: #f9f0ff; }
      .transaction-status { height: 22px; padding: 0 8px; display: inline-flex; align-items: center; gap: 5px; border-radius: 999px; font-size: 12px; font-weight: 500; }
      .transaction-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
      .transaction-status.success { color: #389e0d; background: #f6ffed; }
      .transaction-status.processing { color: #d48806; background: #fffbe6; }
      .transaction-status.failed { color: #cf1322; background: #fff1f0; }
      .transaction-amount { font-variant-numeric: tabular-nums; font-weight: 600; }
      .transaction-amount.payment { color: #1677ff; }
      .transaction-amount.refund { color: #cf1322; }
      .transaction-empty-cell { height: 180px; color: rgba(0,0,0,.45); text-align: center !important; }
      .transaction-detail-alert { margin-bottom: 16px; padding: 12px 16px; border: 1px solid #91caff; border-radius: 8px; color: #0958d9; background: #e6f4ff; font-size: 14px; line-height: 1.6; }
      .transaction-detail-alert.success { border-color: #b7eb8f; color: #237804; background: #f6ffed; }
      .transaction-detail-alert.processing { border-color: #91caff; color: #0958d9; background: #e6f4ff; }
      .transaction-detail-alert.failed { border-color: #ffa39e; color: #a8071a; background: #fff1f0; }
      .service-pager { min-height: 66px; display: flex; align-items: center; justify-content: center; gap: 12px; color: #253450; }
      .service-pager button, .service-pager span.box { height: 32px; min-width: 32px; padding: 0 10px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #d8e0ef; border-radius: 5px; background: #fff; }
      .service-pager .active { border-color: #1f49ff; color: #fff; background: #1f49ff; }
      .order-pagination { min-height: 64px; justify-content: flex-end; gap: 8px; color: rgba(0,0,0,.65); font-size: 14px; }
      .order-pagination-total { margin-right: 8px; }
      .order-pagination button { height: 32px; min-width: 32px; padding: 0 6px; border: 1px solid transparent; border-radius: 6px; color: rgba(0,0,0,.88); background: #fff; cursor: pointer; transition: color .2s, border-color .2s, background .2s; }
      .order-pagination button:hover:not(:disabled):not(.active) { color: #1677ff; }
      .order-pagination button.active { color: #1677ff; border-color: #1677ff; background: #fff; font-weight: 500; }
      .order-pagination button:disabled { color: rgba(0,0,0,.25); cursor: not-allowed; }
      .order-pagination-ellipsis { width: 32px; text-align: center; color: rgba(0,0,0,.25); }
      .order-page-size { height: 32px; margin-left: 8px; padding: 0 28px 0 11px; border: 1px solid #d9d9d9; border-radius: 6px; color: rgba(0,0,0,.88); background: #fff; outline: none; }
      .order-page-jump { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
      .order-page-jump input { width: 48px; height: 32px; box-sizing: border-box; padding: 0 8px; border: 1px solid #d9d9d9; border-radius: 6px; color: rgba(0,0,0,.88); text-align: center; outline: none; }
      .order-page-size:hover, .order-page-jump input:hover { border-color: #4096ff; }
      .order-page-size:focus-visible, .order-page-jump input:focus-visible { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .order-empty-cell { height: 160px; color: rgba(0,0,0,.45); text-align: center !important; }
      .order-detail-mask { position: fixed; inset: 0; z-index: 1000; background: rgba(20,32,54,.42); }
      .order-detail-mask[hidden] { display: none; }
      .order-detail-drawer { position: fixed; top: 0; right: 0; z-index: 1001; width: min(760px, calc(100vw - 40px)); height: 100vh; display: flex; flex-direction: column; background: #fff; box-shadow: -18px 0 42px rgba(25,40,78,.18); transform: translateX(100%); transition: transform .18s ease; }
      .order-detail-drawer.active { transform: translateX(0); }
      .order-detail-head { min-height: 64px; padding: 0 22px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8edf5; }
      .order-detail-head strong { display: block; color: #1f2d46; font-size: 18px; }
      .order-detail-close { width: 32px; height: 32px; border: 0; border-radius: 50%; color: #53627a; background: #f3f6fb; font-size: 20px; cursor: pointer; }
      .order-detail-content { flex: 1; overflow: auto; padding: 20px 24px 32px; background: #f5f7fa; }
      .order-detail-intro { margin-bottom: 16px; padding: 12px 16px; border: 1px solid #91caff; border-radius: 8px; color: #0958d9; background: #e6f4ff; font-size: 14px; line-height: 1.6; }
      .order-detail-section { margin-bottom: 16px; overflow: hidden; border: 1px solid #f0f0f0; border-radius: 8px; background: #fff; }
      .order-detail-section h3 { margin: 0; padding: 10px 16px; min-height: 52px; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: rgba(0,0,0,.88); font-size: 15px; border-bottom: 1px solid #f0f0f0; background: #fafafa; }
      .order-detail-section h3 .ant-query-btn { flex: none; font-weight: 400; }
      .order-detail-subsection + .order-detail-subsection { border-top: 1px solid #f0f0f0; }
      .order-detail-subsection h4 { margin: 0; padding: 12px 16px; color: rgba(0,0,0,.65); background: #fff; font-size: 13px; font-weight: 600; }
      .order-detail-grid { display: grid; grid-template-columns: 1fr 1fr; }
      .order-detail-item { min-height: 58px; padding: 12px 16px; box-sizing: border-box; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; background: #fff; }
      .order-detail-item:nth-child(even) { border-right: 0; }
      .order-detail-item span { display: block; margin-bottom: 5px; color: rgba(0,0,0,.45); font-size: 12px; }
      .order-detail-item strong { display: block; color: rgba(0,0,0,.88); font-size: 14px; font-weight: 500; line-height: 1.5; word-break: break-word; }
      .order-detail-item .order-badge { display: inline-flex; margin-bottom: 0; }
      .order-detail-item .transaction-status, .order-detail-item .transaction-type { display: inline-flex; margin-bottom: 0; }
      .order-detail-item .transaction-amount { display: inline; margin-bottom: 0; }
      .order-detail-item .transaction-status.success { color: #389e0d; }
      .order-detail-item .transaction-status.processing { color: #d48806; }
      .order-detail-item .transaction-status.failed, .order-detail-item .transaction-amount.refund { color: #cf1322; }
      .order-detail-item .transaction-type.payment, .order-detail-item .transaction-amount.payment { color: #0958d9; }
      .order-detail-item .transaction-type.refund { color: #531dab; }
      .order-detail-item.wide { grid-column: 1 / -1; border-right: 0; }
      .order-sensitive-value { display: inline-flex !important; align-items: center; gap: 6px; margin: 0 !important; color: inherit !important; font-size: inherit !important; }
      .order-sensitive-value .order-sensitive-text { display: inline; margin: 0; color: inherit; font-size: inherit; font-variant-numeric: tabular-nums; }
      .order-sensitive-toggle { width: 24px; height: 24px; padding: 0; display: inline-grid; place-items: center; border: 0; border-radius: 4px; color: rgba(0,0,0,.45); background: transparent; cursor: pointer; transition: color .2s, background .2s; }
      .order-sensitive-toggle:hover { color: #1677ff; background: #e6f4ff; }
      .order-sensitive-toggle:focus-visible { outline: 2px solid #1677ff; outline-offset: 1px; }
      .order-sensitive-toggle svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
      .order-detail-list { margin: 0; padding: 14px 18px 16px 36px; color: rgba(0,0,0,.65); line-height: 1.8; }
      .order-detail-list li + li { margin-top: 4px; }
      .order-detail-timeline { margin: 0; padding: 18px 20px 18px 32px; list-style: none; }
      .order-detail-timeline li { position: relative; min-height: 50px; padding: 0 0 16px 20px; border-left: 1px solid #d9d9d9; }
      .order-detail-timeline li:last-child { min-height: 0; padding-bottom: 0; border-left-color: transparent; }
      .order-detail-timeline li::before { content: ''; position: absolute; top: 4px; left: -5px; width: 8px; height: 8px; border: 1px solid #1677ff; border-radius: 50%; background: #fff; }
      .order-detail-timeline li.failed::before { border-color: #ff4d4f; background: #fff1f0; }
      .order-detail-timeline strong { display: block; color: rgba(0,0,0,.88); font-size: 14px; font-weight: 500; }
      .order-detail-timeline li.failed > strong { color: #cf1322; }
      .order-detail-timeline time, .order-detail-timeline span { display: block; margin-top: 4px; color: rgba(0,0,0,.45); font-size: 12px; line-height: 1.7; }
      .order-detail-timeline .transaction-audit-result { display: inline; margin: 0; color: #389e0d; font-weight: 600; }
      .order-detail-timeline .transaction-audit-result.failed { color: #cf1322; }
      .order-refund-steps { padding: 24px 16px 22px; display: flex; align-items: flex-start; overflow-x: auto; }
      .order-refund-step { position: relative; min-width: 130px; flex: 1 1 0; padding: 42px 8px 0; text-align: center; }
      .order-refund-step::after { content: ''; position: absolute; top: 14px; left: calc(50% + 14px); width: calc(100% - 28px); height: 1px; background: #d9d9d9; }
      .order-refund-step.finished::after { background: #1677ff; }
      .order-refund-step:last-child::after { display: none; }
      .order-refund-step i { position: absolute; top: 0; left: 50%; width: 28px; height: 28px; display: grid; place-items: center; border: 1px solid #d9d9d9; border-radius: 50%; color: rgba(0,0,0,.45); background: #fff; font-style: normal; font-size: 12px; transform: translateX(-50%); }
      .order-refund-step.finished i { border-color: #1677ff; color: #fff; background: #1677ff; }
      .order-refund-step.current i { border-color: #1677ff; color: #fff; background: #1677ff; box-shadow: 0 0 0 4px rgba(22,119,255,.12); }
      .order-refund-step strong { display: block; color: rgba(0,0,0,.88); font-size: 14px; font-weight: 500; line-height: 1.45; }
      .order-refund-step.current strong { color: #1677ff; }
      .order-refund-step.waiting strong { color: rgba(0,0,0,.45); }
      .order-refund-step span { display: block; margin-top: 5px; color: rgba(0,0,0,.45); font-size: 12px; line-height: 1.45; }
      .order-refund-step.waiting span { color: rgba(0,0,0,.25); }
      .order-record-list { padding: 4px 16px; }
      .order-record-row { min-height: 48px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f0f0; color: rgba(0,0,0,.88); }
      .order-record-row:last-child { border-bottom: 0; }
      .order-record-row span { color: rgba(0,0,0,.45); }
      .order-refund-note { padding: 0 16px 16px; }
      .order-refund-note label { display: block; margin-bottom: 8px; color: rgba(0,0,0,.65); }
      .order-refund-note textarea { width: 100%; min-height: 72px; padding: 8px 11px; box-sizing: border-box; border: 1px solid #d9d9d9; border-radius: 6px; resize: vertical; outline: none; }
      .order-refund-note textarea:focus { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .order-permission-note { margin: 0 16px 16px; padding: 10px 12px; border-radius: 6px; color: rgba(0,0,0,.65); background: #fafafa; font-size: 12px; }
      .order-review-panel { margin: 0 16px 16px; padding: 16px; border: 1px solid #f0f0f0; border-radius: 8px; background: #fff; }
      .order-review-label { display: block; margin-bottom: 12px; color: rgba(0,0,0,.88); font-size: 14px; font-weight: 600; }
      .order-review-label::before { content: '*'; margin-right: 4px; color: #ff4d4f; }
      .order-review-options { display: flex; align-items: center; gap: 24px; }
      .order-review-option { display: inline-flex; align-items: center; gap: 8px; color: rgba(0,0,0,.88); font-size: 14px; cursor: pointer; }
      .order-review-option input { width: 16px; height: 16px; margin: 0; accent-color: #1677ff; }
      .order-review-next { display: inline-flex; align-items: center; gap: 8px; color: rgba(0,0,0,.65); font-size: 13px; cursor: pointer; }
      .order-review-next input { width: 16px; height: 16px; margin: 0; accent-color: #1677ff; }
      .order-review-buttons { margin-top: 16px; display: flex; justify-content: flex-end; gap: 8px; }
      .order-review-footer { margin-top: 16px; padding-top: 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; border-top: 1px solid #f0f0f0; }
      .order-review-footer .order-review-buttons { margin-top: 0; }
      .order-review-button { height: 32px; padding: 0 15px; border: 1px solid #d9d9d9; border-radius: 6px; color: rgba(0,0,0,.88); background: #fff; box-shadow: 0 2px 0 rgba(0,0,0,.02); font-size: 14px; cursor: pointer; }
      .order-review-button:hover { color: #4096ff; border-color: #4096ff; }
      .order-review-button.primary { color: #fff; border-color: #1677ff; background: #1677ff; box-shadow: 0 2px 0 rgba(5,145,255,.1); }
      .order-review-button.primary:hover { border-color: #4096ff; background: #4096ff; }
      .order-review-button.danger { color: #ff4d4f; border-color: #ff4d4f; }
      .order-review-button.danger:hover { color: #ff7875; border-color: #ff7875; }
      .order-review-reject-form { margin-top: 16px; }
      .order-review-reject-form[hidden] { display: none; }
      .order-review-reject-form label { display: block; margin-bottom: 8px; color: rgba(0,0,0,.88); font-size: 14px; }
      .order-review-reject-form label::before { content: '*'; margin-right: 4px; color: #ff4d4f; }
      .order-review-reject-form textarea { width: 100%; min-height: 76px; padding: 8px 11px; box-sizing: border-box; border: 1px solid #d9d9d9; border-radius: 6px; resize: vertical; outline: none; font: inherit; }
      .order-review-reject-form textarea:focus { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .order-review-reject-form textarea[aria-invalid="true"] { border-color: #ff4d4f; }
      .order-review-error { display: block; margin-top: 6px; color: #ff4d4f; font-size: 12px; }
      .order-review-error[hidden] { display: none; }
      .transaction-summary strong { color: #1f2d46; }
      .package-page { padding: 16px; }
      .package-toolbar { padding: 0 0 16px; display: flex; align-items: center; gap: 16px; box-sizing: border-box; }
      .package-filter { min-width: 0; flex: 1; }
      .package-search { width: 228px; height: 34px; padding: 0 12px; display: flex; align-items: center; gap: 8px; border: 1px solid #dfe5ee; border-radius: 4px; background: #fff; }
      .package-search svg { width: 16px; height: 16px; color: #9ba7b7; }
      .package-search input { min-width: 0; flex: 1; border: 0; outline: 0; color: #263750; background: transparent; }
      .package-search input::placeholder { color: #b1bac8; }
      .package-column-btn { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #dfe5ee; border-radius: 4px; color: #4f5f75; background: #fff; cursor: pointer; }
      .package-column-btn svg { width: 18px; height: 18px; }
      .package-create-btn { height: 32px; margin-left: auto; padding: 0 15px; display: inline-flex; align-items: center; gap: 7px; border: 1px solid #1677ff; border-radius: 6px; color: #fff; background: #1677ff; box-shadow: 0 2px 0 rgba(5,145,255,.1); font-size: 14px; font-weight: 400; cursor: pointer; }
      .package-create-btn:hover { border-color: #4096ff; background: #4096ff; }
      .package-create-btn svg { width: 16px; height: 16px; }
      .package-table { font-size: 13px; }
      .package-table thead tr, .package-table tbody tr { height: 54px; }
      .package-table th, .package-table td { height: 54px; padding: 0 8px; vertical-align: middle; line-height: 1.35; }
      .package-table td { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .package-table tbody tr[data-package-row] { cursor: pointer; transition: background-color .2s; }
      .package-table tbody tr[data-package-row]:hover td { background: #f5f9ff; }
      .package-table tbody tr[data-package-row]:focus-visible { outline: 2px solid #1677ff; outline-offset: -2px; }
      .package-cover { position: relative; width: 46px; height: 34px; display: grid; place-items: center; box-sizing: border-box; border: 1px solid rgba(255,255,255,.72); border-radius: 5px; overflow: hidden; color: #fff; background: linear-gradient(135deg, #4d78ff, #7ba9ff); box-shadow: 0 3px 9px rgba(52,82,145,.16); }
      .package-cover::after { content: ''; position: absolute; right: -7px; bottom: -10px; width: 30px; height: 30px; border: 6px solid rgba(255,255,255,.2); border-radius: 50%; }
      .package-cover svg { position: relative; z-index: 1; width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
      .package-cover.glucose { background: linear-gradient(135deg, #21a3dc, #39cfb4); }
      .package-cover.pressure { background: linear-gradient(135deg, #ff6a7b, #ff9b73); }
      .package-cover.lipid { background: linear-gradient(135deg, #7b67e8, #a78bfa); }
      .package-cover.sleep { background: linear-gradient(135deg, #5767c8, #8294ec); }
      .package-cover.nutrition { background: linear-gradient(135deg, #f5a623, #f6cf55); }
      .package-cover.recovery { background: linear-gradient(135deg, #16a77a, #5bc79d); }
      .package-cover.photo { background: #eef2f7; }
      .package-cover.photo::after { display: none; }
      .package-cover.photo img { width: 100%; height: 100%; display: block; object-fit: cover; }
      .package-status { color: #24ba72; font-weight: 700; }
      .package-status::before { content: '•'; margin-right: 5px; }
      .package-status.offline { color: #8a96a8; }
      .package-status.pending { color: #d48806; }
      .package-actions { display: flex; align-items: center; gap: 12px; }
      .package-actions button { padding: 0; border: 0; color: #174dff; background: transparent; cursor: pointer; }
      .package-more-menu { position: fixed; z-index: 2450; width: 108px; padding: 6px; border: 1px solid #e5eaf2; border-radius: 6px; background: #fff; box-shadow: 0 10px 28px rgba(39,55,84,.16); }
      .package-more-menu[hidden] { display: none; }
      .package-more-menu button { width: 100%; height: 34px; padding: 0 10px; display: flex; align-items: center; border: 0; border-radius: 4px; color: #53627a; background: transparent; cursor: pointer; }
      .package-more-menu button:hover { color: #174dff; background: #f3f6ff; }
      .package-more-menu button.danger { color: #ef4f5f; }
      .package-record-mask, .package-dialog-mask { position: fixed; inset: 0; z-index: 2400; background: rgba(24,34,51,.38); }
      .package-record-mask[hidden], .package-dialog-mask[hidden] { display: none; }
      .package-record-drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 2410; width: min(520px, 96vw); display: flex; flex-direction: column; color: #263650; background: #fff; box-shadow: -12px 0 36px rgba(29,45,72,.18); transform: translateX(102%); transition: transform 220ms cubic-bezier(.16,1,.3,1); }
      .package-record-drawer.active { transform: translateX(0); }
      .package-record-head { height: 54px; flex: 0 0 54px; padding: 0 18px 0 22px; display: flex; align-items: center; border-bottom: 1px solid #edf1f6; }
      .package-record-head strong { font-size: 16px; }
      .package-record-close { width: 32px; height: 32px; margin-left: auto; border: 0; border-radius: 50%; color: #263650; background: #f4f6f9; font-size: 21px; cursor: pointer; }
      .package-record-content { min-height: 0; flex: 1; overflow: auto; padding: 24px; }
      .package-record-summary { position: relative; padding: 16px 18px 16px 20px; overflow: hidden; border: 1px solid #e2e8f1; border-radius: 8px; background: #f8faff; box-shadow: 0 2px 8px rgba(31,45,72,.04); }
      .package-record-summary::before { position: absolute; top: 0; bottom: 0; left: 0; width: 4px; background: #1677ff; content: ''; }
      .package-record-summary h3 { margin: 0; color: #24344e; font-size: 17px; }
      .package-record-code { margin-top: 8px; color: #7d899b; font-size: 13px; }
      .package-record-search { height: 40px; margin-top: 16px; padding: 0 12px; display: flex; align-items: center; gap: 8px; border: 1px solid #d9d9d9; border-radius: 6px; transition: border-color .2s, box-shadow .2s; }
      .package-record-search:hover { border-color: #4096ff; }
      .package-record-search:focus-within { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .package-record-search svg { width: 16px; color: #98a4b6; fill: none; stroke: currentColor; }
      .package-record-search input { min-width: 0; flex: 1; border: 0; outline: 0; color: #263650; }
      .package-record-tabs { margin: 16px 0 4px; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
      .package-record-tab { min-width: 0; min-height: 64px; padding: 10px 12px; display: grid; align-content: center; gap: 4px; border: 1px solid #e2e8f1; border-radius: 8px; color: #66758a; background: #fff; box-shadow: 0 2px 8px rgba(31,45,72,.03); text-align: left; cursor: pointer; transition: color .2s, border-color .2s, background .2s, box-shadow .2s; }
      .package-record-tab:hover { color: #1677ff; border-color: #91caff; }
      .package-record-tab.active { color: #1677ff; border-color: #69b1ff; background: #f0f7ff; box-shadow: 0 0 0 2px rgba(5,145,255,.08); }
      .package-record-tab span { color: inherit; font-size: 12px; }
      .package-record-tab strong { color: inherit; font-size: 18px; line-height: 1; }
      .package-record-list { min-height: 240px; padding: 12px 0 4px; display: grid; gap: 12px; }
      .package-service-record { position: relative; padding: 14px 16px; border: 1px solid #e2e8f1; border-radius: 10px; background: #fff; box-shadow: 0 2px 8px rgba(31,45,72,.04); overflow: hidden; transition: border-color .2s, box-shadow .2s, transform .2s; }
      .package-service-record::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 3px; background: #36cfc9; }
      .package-service-record.completed::before { background: #c6d0dc; }
      .package-service-record:hover { border-color: #91caff; box-shadow: 0 6px 18px rgba(31,45,72,.08); transform: translateY(-1px); }
      .package-service-record-top { display: flex; align-items: center; gap: 10px; }
      .package-avatar { width: 36px; height: 36px; flex: 0 0 36px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: linear-gradient(135deg, #5275df, #83a5ff); font-size: 14px; font-weight: 700; }
      .package-service-person { min-width: 0; flex: 1; }
      .package-service-name { color: #263650; font-size: 14px; font-weight: 700; }
      .package-service-name span { margin-left: 8px; color: #78869a; font-size: 14px; font-weight: 400; }
      .package-service-status { padding: 3px 8px; border-radius: 10px; color: #08979c; background: #e6fffb; font-size: 14px; line-height: 20px; white-space: nowrap; }
      .package-service-status.completed { color: #607087; background: #f0f2f5; }
      .package-service-meta { margin: 8px 88px 0 46px; display: grid; gap: 3px; color: #69778b; font-size: 14px; line-height: 1.55; }
      .package-service-meta strong { color: #435169; font-weight: 500; }
      .package-service-action { position: absolute; right: 14px; bottom: 12px; display: flex; justify-content: flex-end; }
      .package-profile-link { height: 28px; padding: 0 4px; border: 0; color: #1677ff; background: transparent; cursor: pointer; font-size: 14px; white-space: nowrap; }
      .package-profile-link:hover { color: #4096ff; }
      .package-record-footer { min-height: 56px; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: #68768a; font-size: 13px; }
      .package-record-pagination { display: flex; align-items: center; gap: 8px; }
      .package-record-pagination button { width: 30px; height: 30px; border: 1px solid #d9d9d9; border-radius: 6px; color: #4c5b70; background: #fff; cursor: pointer; }
      .package-record-pagination button:hover:not(:disabled) { color: #1677ff; border-color: #4096ff; }
      .package-record-pagination button:disabled { color: rgba(0,0,0,.25); background: #f5f5f5; cursor: not-allowed; }
      .package-record-page { color: #42516a; white-space: nowrap; }
      .package-record-empty { padding: 64px 0; text-align: center; color: #9aa5b5; }
      .package-record-empty strong { display: block; margin-bottom: 8px; color: #657389; font-size: 14px; }
      .service-detail-sections { display: grid; gap: 12px; }
      .service-detail-section { padding: 12px; border: 1px solid #e5eaf2; border-radius: 8px; background: #f8faff; }
      .service-detail-section span { display: block; margin-bottom: 5px; color: #8793a5; font-size: 12px; }
      .service-detail-section strong { color: #2c3b54; font-size: 13px; line-height: 1.5; }
      .package-dialog { position: fixed; top: 50%; left: 50%; z-index: 2510; width: min(420px, calc(100vw - 40px)); padding: 24px; box-sizing: border-box; border-radius: 10px; color: #263650; background: #fff; box-shadow: 0 20px 60px rgba(24,39,64,.24); transform: translate(-50%,-50%); }
      .package-dialog[hidden] { display: none; }
      .package-dialog h3 { margin: 0 0 10px; font-size: 18px; }
      .package-dialog p { margin: 0; color: #6f7d91; line-height: 1.65; }
      .package-dialog-body { margin-top: 18px; }
      .package-share-card { padding: 14px; border: 1px solid #e5ebf4; border-radius: 8px; background: #f7f9fd; }
      .package-share-card strong { display: block; margin-bottom: 7px; }
      .package-share-link { overflow: hidden; color: #567; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
      .package-profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .package-profile-grid div { padding: 10px; border-radius: 6px; background: #f7f9fd; }
      .package-profile-grid span { display: block; margin-bottom: 4px; color: #8a96a8; font-size: 12px; }
      .package-dialog-actions { margin-top: 22px; display: flex; justify-content: flex-end; gap: 10px; }
      .package-dialog-actions button { height: 36px; padding: 0 18px; border: 1px solid #dfe5ee; border-radius: 5px; color: #53627a; background: #fff; cursor: pointer; }
      .package-dialog-actions button.primary { border-color: #174dff; color: #fff; background: #174dff; }
      .package-dialog-actions button.danger { border-color: #ef4f5f; color: #fff; background: #ef4f5f; }
      .package-share-dialog { position: fixed; top: 50%; left: 50%; z-index: 2520; width: min(520px, calc(100vw - 32px)); box-sizing: border-box; border-radius: 10px; color: #263650; background: #fff; box-shadow: 0 20px 60px rgba(24,39,64,.24); transform: translate(-50%,-50%); overflow: hidden; }
      .package-share-dialog[hidden] { display: none; }
      .package-share-head { height: 56px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #edf1f6; }
      .package-share-head strong { font-size: 16px; }
      .package-share-close { width: 32px; height: 32px; display: grid; place-items: center; border: 0; border-radius: 50%; color: #263650; background: #f5f6f8; font-size: 20px; cursor: pointer; }
      .package-share-close:hover { background: #e9edf3; }
      .package-share-content { padding: 22px 20px 24px; }
      .package-share-name { margin: 0; color: #263650; font-size: 16px; font-weight: 700; }
      .package-share-tip { margin: 8px 0 22px; color: #8490a2; font-size: 13px; line-height: 1.6; }
      .package-share-label { display: block; margin: 0 0 8px; color: #435169; font-size: 14px; font-weight: 500; }
      .package-share-input-group { height: 38px; margin-bottom: 22px; display: flex; }
      .package-share-input-group input { min-width: 0; flex: 1; padding: 0 12px; border: 1px solid #1677ff; border-radius: 5px 0 0 5px; color: #53627a; outline: 0; font-size: 14px; }
      .package-share-input-group button { width: 118px; border: 1px solid #d9d9d9; border-left: 0; border-radius: 0 5px 5px 0; color: #435169; background: #fafafa; font-size: 14px; cursor: pointer; }
      .package-share-input-group button:hover { color: #1677ff; background: #f5f9ff; }
      .package-qr-card { width: 184px; padding: 14px; box-sizing: border-box; border: 1px solid #e2e8f1; border-radius: 6px; background: #fff; }
      .package-qr-card canvas { width: 154px; height: 154px; display: block; image-rendering: pixelated; }
      .package-qr-actions { margin-top: 12px; display: flex; gap: 8px; }
      .package-qr-actions button { height: 30px; padding: 0 10px; display: inline-flex; align-items: center; gap: 5px; border: 1px solid #d9d9d9; border-radius: 5px; color: #435169; background: #fff; font-size: 13px; cursor: pointer; }
      .package-qr-actions button:hover { color: #1677ff; border-color: #4096ff; }
      .package-footer { margin-top: auto; min-height: 58px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #53627a; }
      .package-footer button { width: 30px; height: 30px; border: 1px solid #dfe5ee; border-radius: 4px; color: #607087; background: #fff; }
      .package-footer button.active { border-color: #174dff; color: #fff; background: #174dff; }
      .package-page-size { width: 88px; height: 30px; padding: 0 10px; display: inline-flex; align-items: center; justify-content: space-between; border: 1px solid #dfe5ee; border-radius: 4px; background: #fff; }
      .package-empty-cell { height: 168px !important; color: #a3adbb; text-align: center; background: #fff; }

      .package-editor-overlay { position: fixed; inset: 0; z-index: 2200; display: flex; flex-direction: column; color: #25344d; background: #eaf2fc; font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif; font-size: 14px; line-height: 1.5; }
      .package-editor-overlay button, .package-editor-overlay input, .package-editor-overlay textarea, .package-editor-overlay select { font: inherit; }
      .package-editor-overlay[hidden] { display: none; }
      .package-editor-top { height: 56px; flex: 0 0 56px; padding: 0 24px; display: flex; align-items: center; border-bottom: 1px solid #e4e9f1; background: #fff; }
      .package-editor-exit { display: inline-flex; align-items: center; gap: 5px; border: 0; color: #627086; background: transparent; cursor: pointer; }
      .package-editor-title { margin-left: 32px; color: #1f2d46; font-size: 16px; font-weight: 800; }
      .package-editor-save { height: 36px; margin-left: auto; padding: 0 20px; border: 0; border-radius: 4px; color: #fff; background: #174dff; font-weight: 700; cursor: pointer; }
      .package-editor-scroll { min-height: 0; flex: 1; overflow: auto; padding: 24px 0 48px; scrollbar-gutter: stable; background:
        linear-gradient(115deg, rgba(255,255,255,.76), rgba(236,244,255,.68) 34%, rgba(255,255,255,.42) 65%, rgba(229,239,252,.84)),
        repeating-linear-gradient(165deg, transparent 0 112px, rgba(180,199,225,.16) 113px 116px, transparent 117px 238px),
        #e8f1fb;
      }
      .package-editor-layout { width: min(1220px, calc(100vw - 48px)); margin: 0 auto; padding: 24px; display: grid; grid-template-columns: 384px minmax(0, 1fr); gap: 0; align-items: start; box-sizing: border-box; border: 1px solid #dfe7f2; border-radius: 14px; background: #f7f9fd; box-shadow: 0 18px 48px rgba(57,78,113,.1); }
      .package-editor-card { width: auto; max-width: none; min-height: 1520px; margin: 0; padding: 0 0 0 24px; border-radius: 0; background: transparent; box-shadow: none; }
      .package-live-preview { position: sticky; top: 0; height: calc(100vh - 152px); height: calc(100dvh - 152px); min-height: 600px; padding-right: 24px; display: flex; flex-direction: column; align-self: start; box-sizing: border-box; border-right: 1px solid #e2e8f1; }
      .package-preview-heading { margin: 0 0 12px 4px; display: flex; align-items: center; justify-content: space-between; color: #263650; font-size: 14px; font-weight: 800; }
      .package-preview-heading span { color: #7f8ca0; font-size: 12px; font-weight: 500; }
      .package-phone { width: 360px; min-height: 0; flex: 1; box-sizing: border-box; padding: 10px; border: 1px solid #dbe3ef; border-radius: 34px; background: #fff; box-shadow: 0 20px 48px rgba(56,78,116,.16); }
      .package-phone-screen { position: relative; height: 100%; overflow: hidden; border-radius: 26px; background: #f0f3fb; }
      .package-phone-status { height: 28px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; color: #263650; font-size: 11px; font-weight: 700; background: rgba(255,255,255,.86); }
      .package-phone-status i { width: 54px; height: 16px; border-radius: 999px; background: #1c2435; }
      .package-phone-header { height: 46px; padding: 0 16px; display: flex; align-items: center; gap: 10px; color: #20314d; background: rgba(255,255,255,.92); border-bottom: 1px solid #e8edf5; }
      .package-phone-header b { font-size: 14px; }
      .package-phone-body { position: absolute; inset: 74px 0 64px; padding: 16px; overflow: hidden; background: linear-gradient(180deg, #e3e8f8 0 34%, #f3f6fc 34%); }
      .package-c-user-bubble { max-width: 86%; margin-left: auto; padding: 12px 14px; border-radius: 15px 15px 3px 15px; color: #fff; background: linear-gradient(135deg, #1940ff, #2631ec); font-size: 13px; line-height: 1.55; box-shadow: 0 10px 24px rgba(31,56,239,.18); }
      .package-c-status { width: fit-content; margin-top: 14px; padding: 9px 12px; display: flex; align-items: center; gap: 6px; border-radius: 13px 13px 13px 3px; color: #293a55; background: #fff; font-size: 12px; box-shadow: 0 7px 18px rgba(67,82,115,.08); }
      .package-c-status::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #4a78ff; box-shadow: 9px 0 0 #8aa8ff; margin-right: 9px; }
      .package-c-card { margin-top: 76px; padding: 18px; border: 1px solid rgba(255,255,255,.9); border-radius: 16px; background: rgba(255,255,255,.94); box-shadow: 0 18px 38px rgba(77,94,132,.12); }
      .package-c-card-top { display: flex; align-items: flex-start; gap: 12px; }
      .package-c-icon { width: 44px; height: 44px; flex: 0 0 44px; display: grid; place-items: center; border-radius: 12px; color: #fff; background: linear-gradient(135deg, #3154ff, #6e7cff); font-size: 22px; font-weight: 800; box-shadow: 0 9px 20px rgba(49,84,255,.22); }
      .package-c-title { min-width: 0; flex: 1; }
      .package-c-title strong { display: block; overflow: hidden; color: #1f304c; font-size: 17px; text-overflow: ellipsis; white-space: nowrap; }
      .package-c-title span { display: block; margin-top: 4px; color: #7a879b; font-size: 11px; }
      .package-c-price { color: #ff5a61; font-size: 17px; font-weight: 800; }
      .package-c-desc { min-height: 44px; margin: 14px 0 12px; overflow: hidden; color: #516078; font-size: 12px; line-height: 1.65; }
      .package-c-tags { display: flex; gap: 6px; overflow: hidden; }
      .package-c-tags span { max-width: 92px; padding: 4px 8px; overflow: hidden; border-radius: 999px; color: #3154ff; background: #eef2ff; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
      .package-c-plan { margin-top: 14px; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #edf1f6; color: #7a879b; font-size: 11px; }
      .package-c-buy { height: 34px; margin-top: 14px; display: flex; align-items: center; justify-content: center; border-radius: 9px; color: #fff; background: #3154ff; font-size: 13px; font-weight: 700; }
      .package-phone-input { position: absolute; left: 16px; right: 16px; bottom: 14px; height: 38px; display: flex; align-items: center; gap: 10px; }
      .package-phone-input span { height: 38px; flex: 1; padding: 0 14px; display: flex; align-items: center; border-radius: 14px; color: #b0b8c7; background: #fff; font-size: 11px; }
      .package-phone-send { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: #9ea4b2; font-size: 17px; transform: rotate(-20deg); }
      .package-detail-preview { height: 100%; box-sizing: border-box; overflow-y: auto; color: #1d2b45; background: #f3f6fb; font-size: 12px; scrollbar-width: none; }
      .package-detail-preview::-webkit-scrollbar { display: none; }
      .package-detail-hero { position: relative; width: 100%; aspect-ratio: 375 / 216; overflow: hidden; background: #eaf4ff; }
      .package-detail-hero img { width: 100%; height: 100%; display: block; object-fit: cover; object-position: center top; }
      .package-detail-hero img.is-default { width: 152%; max-width: none; transform: translateX(-17.1%); }
      .package-detail-main { position: relative; margin-top: -1px; padding: 0 0 28px; background: #f3f6fb; }
      .package-detail-overview { padding: 18px 15px 16px; background: #fff; }
      .package-detail-name { margin: 0; overflow: hidden; color: #172640; font-size: 14px; font-weight: 800; line-height: 1.5; text-overflow: ellipsis; white-space: nowrap; }
      .package-detail-tags { min-height: 20px; margin-top: 7px; display: flex; align-items: center; gap: 9px; overflow: hidden; color: #5685f7; font-size: 12px; white-space: nowrap; }
      .package-detail-tags span::before { content: '✓'; margin-right: 3px; color: #74a0ff; }
      .package-detail-price-row { margin-top: 12px; display: flex; align-items: flex-end; }
      .package-detail-price { color: #f15a00; font-size: 31px; font-weight: 800; line-height: 1; }
      .package-detail-price::first-letter { font-size: 16px; font-weight: 500; }
      .package-detail-price-unit { margin-left: 5px; color: #f15a00; font-size: 15px; line-height: 1.2; }
      .package-detail-sold { margin-left: auto; color: #a5acb9; font-size: 12px; }
      .package-detail-summary { margin: 15px 0 0; color: #8b94a5; font-size: 12px; line-height: 1.65; }
      .package-recommendation { margin-top: 16px; padding: 13px; border: 1px solid #b9d1ff; border-radius: 15px; background: #f7f9ff; }
      .package-recommendation-head { display: flex; align-items: center; color: #123b87; font-size: 14px; font-weight: 800; }
      .package-recommendation-bot { width: 30px; height: 30px; margin-right: 8px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: linear-gradient(135deg, #2549d9, #70b8ff); box-shadow: inset 0 0 0 3px #d7e9ff; font-size: 11px; }
      .package-recommendation-more { margin-left: auto; color: #4a79ee; font-size: 12px; font-weight: 500; }
      .package-recommendation p { max-height: 42px; margin: 10px 0 0; overflow: hidden; color: #34528d; font-size: 12px; line-height: 1.65; }
      .package-detail-section { margin-top: 0; padding: 20px 15px 0; }
      .package-detail-section-head { margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
      .package-detail-section-title { position: relative; margin: 0; padding-left: 9px; color: #172640; font-size: 14px; font-weight: 800; }
      .package-detail-section-title::before { content: ''; position: absolute; left: 0; top: 3px; bottom: 3px; width: 4px; border-radius: 4px; background: #2468ff; }
      .package-detail-section-note { margin-left: auto; color: #8895aa; font-size: 12px; }
      .package-intro-list { display: grid; gap: 10px; }
      .package-intro-card { padding: 14px; display: grid; grid-template-columns: 34px minmax(0,1fr); gap: 10px; border: 1px solid #e3eaf5; border-radius: 13px; background: #fff; }
      .package-intro-index { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; color: #2f66ed; background: #eff4ff; font-size: 12px; font-weight: 800; }
      .package-intro-card strong { display: block; color: #1c2d4a; font-size: 14px; font-weight: 800; }
      .package-intro-card p { margin: 6px 0 0; color: #52627b; font-size: 12px; line-height: 1.7; }
      .package-intro-summary p { margin-top: 0; }
      .package-benefit-table { overflow: hidden; border: 1px solid #d9e5ff; border-radius: 9px; background: #fff; font-size: 12px; }
      .package-benefit-row { display: grid; grid-template-columns: 76px minmax(0,1fr) 58px; min-height: 48px; }
      .package-benefit-row + .package-benefit-row { border-top: 1px solid #d9e5ff; }
      .package-preview-benefit-rows .package-benefit-row { border-top: 1px solid #d9e5ff; }
      .package-benefit-row > span { padding: 9px 8px; display: flex; align-items: center; color: #516078; line-height: 1.5; }
      .package-benefit-row > span + span { border-left: 1px solid #d9e5ff; }
      .package-benefit-row.head { min-height: 36px; background: #eef3ff; }
      .package-benefit-row.head > span { color: #244e9e; font-size: 12px; font-weight: 700; }
      .package-benefit-row > span:last-child { justify-content: center; color: #0aa64f; font-weight: 700; }
      .package-benefit-name { align-items: flex-start !important; color: #24344e !important; font-weight: 700; }
      .package-benefit-group { display: grid; grid-template-columns: 76px minmax(0,1fr) 58px; border-top: 1px solid #d9e5ff; }
      .package-benefit-group > span { min-height: 48px; padding: 9px 8px; display: flex; align-items: center; box-sizing: border-box; color: #516078; line-height: 1.5; }
      .package-benefit-group .package-benefit-name { grid-column: 1; align-items: flex-start !important; justify-content: center; flex-direction: column; gap: 5px; border-right: 1px solid #d9e5ff; }
      .package-benefit-name strong { color: #24344e; font-size: 12px; line-height: 1.45; }
      .package-benefit-name small { color: #8290a6; font-size: 11px; font-weight: 400; line-height: 1.45; }
      .package-benefit-detail { grid-column: 2; border-right: 1px solid #d9e5ff; }
      .package-benefit-frequency { grid-column: 3; justify-content: center; color: #0aa64f !important; font-weight: 700; }
      .package-benefit-detail.divider, .package-benefit-frequency.divider { border-top: 1px solid #d9e5ff; }
      .package-detail-rules { overflow: hidden; border: 1px solid #e4eaf3; border-radius: 13px; background: #fff; }
      .package-rule-item { min-height: 48px; padding: 10px 12px; display: grid; grid-template-columns: 24px minmax(0,1fr); align-items: center; gap: 10px; color: #64728a; font-size: 12px; line-height: 1.65; }
      .package-rule-item + .package-rule-item { border-top: 1px solid #edf1f6; }
      .package-rule-index { width: 22px; height: 22px; display: grid; place-items: center; border-radius: 7px; color: #3971ef; background: #eff4ff; font-size: 12px; font-weight: 700; }
      .package-detail-footer { position: absolute; left: 0; right: 0; bottom: 0; z-index: 5; height: 66px; padding: 10px 14px; display: flex; align-items: center; box-sizing: border-box; border-top: 1px solid #e8edf4; background: rgba(255,255,255,.96); backdrop-filter: blur(8px); }
      .package-detail-footer-price { color: #f15a00; font-size: 25px; font-weight: 800; }
      .package-detail-footer-price small { color: #5b6678; font-size: 14px; font-weight: 500; }
      .package-detail-buy { width: 146px; height: 42px; margin-left: auto; display: grid; place-items: center; border-radius: 10px; color: #744316; background: linear-gradient(90deg, #ffe09c, #ffc67b); font-size: 15px; font-weight: 800; }
      .package-form-group { margin-bottom: 28px; }
      .package-config-section { padding: 30px 32px 34px; margin-bottom: 24px; box-sizing: border-box; border: 1px solid #e4eaf3; border-radius: 10px; background: #fff; box-shadow: 0 10px 30px rgba(63,84,119,.07); }
      .package-config-section:last-child { margin-bottom: 0; }
      .package-config-head { margin-bottom: 28px; padding-bottom: 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #edf1f6; }
      .package-config-index { width: 30px; height: 30px; flex: 0 0 30px; display: grid; place-items: center; border-radius: 8px; color: #174dff; background: #edf2ff; font-size: 14px; font-weight: 800; }
      .package-config-title { color: #1e2e49; font-size: 18px; font-weight: 800; }
      .package-config-subtitle { margin-top: 2px; color: #97a2b2; font-size: 12px; }
      .package-config-count { margin-left: auto; color: #7d899b; font-size: 13px; }
      .package-field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
      .package-field-grid .package-form-group.full { grid-column: 1 / -1; }
      .package-form-label { margin-bottom: 10px; display: flex; align-items: center; gap: 6px; color: #283750; font-size: 14px; font-weight: 800; }
      .package-required { color: #ff4d4f; }
      .package-optional { color: #98a2b3; font-size: 12px; font-weight: 400; }
      .package-radio-group { min-height: 42px; display: flex; align-items: center; gap: 28px; }
      .package-radio-option { display: inline-flex; align-items: center; gap: 8px; color: rgba(0,0,0,.88); font-size: 14px; font-weight: 400; cursor: pointer; }
      .package-radio-option input { width: 16px; height: 16px; margin: 0; appearance: none; border: 1px solid #d9d9d9; border-radius: 50%; background: #fff; cursor: pointer; transition: border-color .2s, box-shadow .2s; }
      .package-radio-option input:hover { border-color: #1677ff; }
      .package-radio-option input:checked { border: 5px solid #1677ff; }
      .package-radio-option input:focus-visible { outline: 0; box-shadow: 0 0 0 3px rgba(22,119,255,.15); }
      .package-input-wrap { position: relative; }
      .package-form-input, .package-form-select, .package-form-textarea { width: 100%; box-sizing: border-box; border: 1px solid #dfe5ee; border-radius: 3px; color: #2b3b53; background: #fff; outline: none; }
      .package-form-input, .package-form-select { height: 42px; padding: 0 14px; }
      .package-form-textarea { min-height: 80px; padding: 12px 14px; resize: vertical; }
      .package-form-input:focus, .package-form-select:focus, .package-form-textarea:focus { border-color: #174dff; box-shadow: 0 0 0 2px rgba(23,77,255,.1); }
      .package-form-input::placeholder, .package-form-textarea::placeholder { color: #b0bac8; }
      .package-ant-select { position: relative; width: 100%; min-width: 0; }
      .package-ant-select-native { position: absolute !important; width: 1px !important; height: 1px !important; margin: -1px !important; padding: 0 !important; overflow: hidden !important; clip: rect(0 0 0 0) !important; border: 0 !important; opacity: 0 !important; pointer-events: none !important; }
      .package-ant-select-selector { width: 100%; height: 42px; padding: 0 11px; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-sizing: border-box; border: 1px solid #d9d9d9; border-radius: 6px; color: rgba(0,0,0,.88); background: #fff; box-shadow: 0 2px 0 rgba(0,0,0,.02); font-size: 14px; text-align: left; cursor: pointer; transition: border-color .2s, box-shadow .2s; }
      .package-ant-select-selector:hover { border-color: #4096ff; }
      .package-ant-select-selector:focus-visible, .package-ant-select.open .package-ant-select-selector { border-color: #1677ff; outline: 0; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .package-ant-select-selector[disabled] { color: rgba(0,0,0,.25); border-color: #d9d9d9; background: rgba(0,0,0,.04); cursor: not-allowed; }
      .package-ant-select-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .package-ant-select.placeholder .package-ant-select-value { color: rgba(0,0,0,.25); }
      .package-ant-select-arrow { width: 12px; height: 12px; flex: 0 0 12px; color: rgba(0,0,0,.45); transition: transform .2s; }
      .package-ant-select.open .package-ant-select-arrow { transform: rotate(180deg); }
      .package-ant-select-dropdown { position: absolute; top: calc(100% + 4px); right: 0; left: 0; z-index: 60; max-height: 240px; padding: 4px; overflow: auto; box-sizing: border-box; border-radius: 8px; background: #fff; box-shadow: 0 6px 16px 0 rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05); }
      .package-ant-select-dropdown[hidden] { display: none; }
      .package-ant-select-option { width: 100%; min-height: 32px; padding: 5px 12px; display: flex; align-items: center; border: 0; border-radius: 4px; color: rgba(0,0,0,.88); background: transparent; font-size: 14px; text-align: left; cursor: pointer; transition: background .2s; }
      .package-ant-select-option:hover, .package-ant-select-option:focus-visible { outline: 0; background: rgba(0,0,0,.04); }
      .package-ant-select-option.selected { background: #e6f4ff; font-weight: 600; }
      .package-ant-select-option:disabled { color: rgba(0,0,0,.25); background: transparent; cursor: not-allowed; }
      .package-counter { position: absolute; right: 12px; bottom: 11px; color: #a7b1c0; font-size: 12px; }
      .package-upload { position: relative; width: 144px; height: 88px; display: grid; place-items: center; align-content: center; gap: 8px; box-sizing: border-box; border: 1px dashed #d8e0eb; border-radius: 6px; overflow: hidden; color: #98a5b7; background: #fbfcfe; cursor: pointer; }
      .package-upload:hover { border-color: #174dff; color: #174dff; }
      .package-upload strong { color: #7f8ca0; font-size: 22px; font-weight: 400; }
      .package-upload-empty { display: grid; place-items: center; gap: 5px; }
      .package-upload-preview { width: 100%; height: 100%; display: block; object-fit: cover; }
      .package-upload-preview[hidden], .package-upload-empty[hidden], .package-upload-replace[hidden] { display: none; }
      .package-upload-replace { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; background: rgba(22,34,54,.54); font-weight: 700; opacity: 0; transition: opacity 160ms ease; }
      .package-upload:hover .package-upload-replace { opacity: 1; }
      .package-upload-meta { min-height: 24px; margin-top: 8px; display: flex; align-items: center; gap: 12px; color: #9aa6b6; font-size: 12px; }
      .package-upload-meta button { padding: 0; border: 0; color: #ef4f5f; background: transparent; cursor: pointer; }
      .package-upload-meta button[hidden] { display: none; }
      .package-price-input { width: 144px; position: relative; }
      .package-price-input span { position: absolute; left: 12px; top: 11px; color: #7f8ca0; }
      .package-price-input input { padding-left: 30px; }
      .package-tags, .package-duration { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
      .package-tag, .package-duration button { height: 36px; padding: 0 14px; border: 1px solid #e5eaf1; border-radius: 4px; color: #53627a; background: #f8fafc; cursor: pointer; }
      .package-tag { display: inline-flex; align-items: center; gap: 8px; }
      .package-tag.active, .package-duration button.active { border-color: #bfd0ff; color: #174dff; background: #f3f6ff; }
      .package-tag.add { background: #fff; }
      .package-tag-remove { width: 16px; height: 16px; display: inline-grid; place-items: center; border-radius: 50%; color: #8b97a8; font-style: normal; font-size: 14px; line-height: 1; }
      .package-tag-remove:hover { color: #ff4d4f; background: #fff1f0; }
      .package-tag-editor { height: 36px; display: inline-flex; align-items: center; overflow: hidden; border: 1px solid #1677ff; border-radius: 4px; background: #fff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .package-tag-editor[hidden], .package-tag.add[hidden] { display: none; }
      .package-tag-editor input { width: 132px; height: 34px; padding: 0 10px; box-sizing: border-box; border: 0; color: #263650; outline: 0; font-size: 14px; }
      .package-tag-editor button { width: 32px; height: 34px; padding: 0; border: 0; border-left: 1px solid #edf0f5; color: #1677ff; background: #fff; cursor: pointer; }
      .package-tag-editor button[data-cancel-package-tag] { color: #8b97a8; }
      .package-tag-status { color: #8b97a8; font-size: 12px; white-space: nowrap; }
      .package-duration-note { color: #9aa6b6; font-size: 12px; font-weight: 400; }
      .package-manual-period { height: 36px; display: inline-flex; align-items: center; overflow: hidden; border: 1px solid #e5eaf1; border-radius: 4px; background: #fff; }
      .package-manual-period.active, .package-manual-period:focus-within { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .package-manual-period > span { height: 34px; padding: 0 10px; display: inline-flex; align-items: center; color: #68768d; background: #f8fafc; border-right: 1px solid #edf0f5; font-size: 12px; }
      .package-manual-period input { width: 72px; height: 34px; padding: 0 10px; box-sizing: border-box; border: 0; color: #263650; outline: 0; font-size: 14px; }
      .package-manual-period .package-ant-select { width: 76px; flex: 0 0 76px; }
      .package-manual-period .package-ant-select-selector { height: 34px; padding: 0 8px; border: 0; border-left: 1px solid #edf0f5; border-radius: 0 5px 5px 0; box-shadow: none; color: #53627a; font-size: 13px; }
      .package-manual-period .package-ant-select-selector:hover, .package-manual-period .package-ant-select-selector:focus-visible, .package-manual-period .package-ant-select.open .package-ant-select-selector { border-color: #edf0f5; box-shadow: none; }
      .package-manual-period .package-ant-select-dropdown { left: auto; min-width: 88px; }
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
      .package-benefit-editor { margin-bottom: 16px; overflow: hidden; border: 1px solid #dfe5ee; border-radius: 8px; background: #fff; }
      .package-benefit-editor-head { min-height: 68px; padding: 14px 16px; display: grid; grid-template-columns: minmax(180px,.8fr) minmax(260px,1.35fr) auto; align-items: center; gap: 14px; background: #f8fafc; }
      .package-benefit-field { min-width: 0; display: grid; gap: 8px; color: #65738a; font-size: 12px; }
      .package-benefit-field > span { font-weight: 700; }
      .package-benefit-field .package-required { font-style: normal; }
      .package-benefit-cover-upload { position: relative; width: 96px; height: 58px; display: grid; place-items: center; overflow: hidden; box-sizing: border-box; border: 1px dashed #ccd7e7; border-radius: 7px; color: #3154ff; background: #fff; cursor: pointer; }
      .package-benefit-cover-upload:hover { border-color: #174dff; }
      .package-benefit-cover-control { display: grid; gap: 5px; }
      .package-benefit-cover-empty { display: flex; align-items: center; gap: 6px; font-size: 18px; }
      .package-benefit-cover-empty b { font-weight: 700; }
      .package-benefit-cover-empty small { color: #7f8ca0; font-size: 11px; }
      .package-benefit-cover-preview { width: 100%; height: 100%; display: block; object-fit: cover; }
      .package-benefit-cover-preview[hidden], .package-benefit-cover-empty[hidden], .package-benefit-cover-replace[hidden] { display: none; }
      .package-benefit-cover-replace { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; background: rgba(22,34,54,.52); font-size: 12px; opacity: 0; transition: opacity 160ms ease; }
      .package-benefit-cover-upload:hover .package-benefit-cover-replace { opacity: 1; }
      .package-benefit-cover-remove { width: 96px; padding: 0; border: 0; color: #ef4f5f; background: transparent; font-size: 11px; text-align: left; cursor: pointer; }
      .package-benefit-cover-remove[hidden] { display: none; }
      .package-benefit-field input, .package-benefit-content input { width: 100%; height: 38px; box-sizing: border-box; border: 1px solid #dfe5ee; border-radius: 5px; color: #2b3b53; background: #fff; outline: none; }
      .package-benefit-field input, .package-benefit-content input { padding: 0 12px; }
      .package-benefit-field input:focus, .package-benefit-content input:focus { border-color: #174dff; box-shadow: 0 0 0 2px rgba(23,77,255,.1); }
      .package-benefit-delete { width: 38px; height: 38px; padding: 0; display: grid; place-items: center; border: 0; border-radius: 6px; color: #ef4f5f; background: transparent; cursor: pointer; }
      .package-benefit-delete:hover { background: #fff1f0; }
      .package-benefit-delete svg { width: 17px; height: 17px; }
      .package-benefit-content { min-height: 58px; padding: 10px 14px; display: grid; grid-template-columns: 22px minmax(0,1fr) 142px 28px; align-items: center; gap: 10px; border-top: 1px solid #edf1f6; }
      .package-frequency-control { position: relative; min-width: 0; }
      .package-frequency-control input { padding: 0 36px 0 12px; border-color: #d9d9d9; border-radius: 6px; }
      .package-frequency-trigger { position: absolute; top: 1px; right: 1px; z-index: 2; width: 34px; height: 36px; padding: 0; display: grid; place-items: center; border: 0; border-radius: 0 6px 6px 0; color: rgba(0,0,0,.45); background: #fff; cursor: pointer; }
      .package-frequency-trigger svg { width: 12px; height: 12px; transition: transform .2s; }
      .package-frequency-control.open .package-frequency-trigger svg { transform: rotate(180deg); }
      .package-frequency-control.open input { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
      .package-frequency-dropdown { top: 42px; min-width: 180px; }
      .package-frequency-dropdown-title { height: 28px; padding: 0 12px; display: flex; align-items: center; color: rgba(0,0,0,.45); font-size: 12px; }
      .package-benefit-drag { color: #aeb8c5; cursor: grab; }
      .package-benefit-remove { width: 28px; height: 28px; border: 0; color: #ef4f5f; background: transparent; font-size: 18px; cursor: pointer; }
      .package-benefit-add-content { height: 42px; padding: 0 16px; display: flex; align-items: center; border: 0; border-top: 1px solid #edf1f6; color: #174dff; background: #fff; cursor: pointer; }
      .package-benefit-add { width: 100%; height: 44px; border: 1px dashed #b8c8e5; border-radius: 6px; color: #174dff; background: #f8faff; cursor: pointer; }
      .package-agreement-list { display: grid; gap: 12px; }
      .package-agreement-item { padding: 14px 16px; display: grid; grid-template-columns: 180px minmax(0,1fr) auto; align-items: center; gap: 14px; border: 1px solid #e2e8f1; border-radius: 7px; background: #fbfcfe; }
      .package-agreement-item strong { color: #283750; }
      .package-agreement-item .package-ant-select-selector { height: 38px; }
      .package-agreement-item button { border: 0; color: #174dff; background: transparent; cursor: pointer; }
      .package-rules { min-height: 168px; line-height: 1.75; }
      .package-editor-toast { position: fixed; top: 64px; left: 50%; z-index: 2300; padding: 9px 16px; border-radius: 4px; color: #fff; background: #20a66a; box-shadow: 0 8px 24px rgba(32,166,106,.2); transform: translateX(-50%); }
      @media (max-width: 1280px) {
        .service-filter { gap: 14px; }
        .service-field input { width: 220px; }
        .service-date { min-width: 230px; }
        .service-query-bar .service-query-keyword input { width: 260px; }
        .transaction-table { font-size: 12px; }
        .transaction-table th, .transaction-table td { padding: 0 6px; }
        .order-tab { padding: 0 9px; }
        .package-editor-layout { width: min(1100px, calc(100vw - 32px)); grid-template-columns: 344px minmax(0, 1fr); }
        .package-phone { width: 320px; }
        .package-editor-card { padding: 0 0 0 24px; }
        .package-c-card { margin-top: 44px; }
      }
      @media (max-width: 900px) {
        .package-editor-layout { width: min(760px, calc(100vw - 24px)); padding: 20px; grid-template-columns: 1fr; gap: 24px; }
        .package-live-preview { position: relative; width: 360px; max-width: 100%; height: auto; min-height: 0; margin: 0 auto; padding: 0 0 24px; border-right: 0; border-bottom: 1px solid #e2e8f1; }
        .package-editor-card { padding-left: 0; }
        .package-phone { width: 100%; height: 640px; flex: none; box-sizing: border-box; }
      }
      @media (max-width: 600px) {
        .service-query-bar { align-items: stretch; }
        .service-query-bar .service-field { width: 100%; flex-wrap: wrap; }
        .service-query-bar .service-query-keyword input, .service-query-bar .service-field select, .service-query-bar .service-date { width: 100%; min-width: 0; }
        .service-query-bar .service-filter-actions { width: 100%; }
        .package-toolbar { align-items: stretch; flex-direction: column; }
        .package-create-btn { align-self: flex-end; margin-left: 0; }
        .transaction-summary { align-items: flex-start; flex-direction: column; justify-content: center; gap: 8px; padding: 12px 0; }
        .order-detail-drawer { width: 100vw; }
        .order-detail-content { padding: 16px; }
        .package-editor-card { padding: 0; }
        .package-config-section { padding: 24px 20px 28px; }
        .package-field-grid, .package-benefit-meta { grid-template-columns: 1fr; }
        .package-benefit-editor-head { grid-template-columns: minmax(0,1fr) auto; }
        .package-benefit-field.description { grid-column: 1 / -1; }
        .package-benefit-content { grid-template-columns: 18px minmax(0,1fr) 28px; }
        .package-frequency-control { grid-column: 2; }
        .package-agreement-item { grid-template-columns: 1fr; }
      }
      @media (prefers-reduced-motion: reduce) {
        .order-detail-drawer, .package-record-drawer { transition: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function badgeClass(status) {
    return { 待使用: 'waiting', 生效中: 'active', 已完成: 'done', 待审核: 'review', 退款中: 'refunding', 已退款: 'refunded' }[status] || 'done';
  }

  function renderOrderRow(row) {
    const [orderNo, packageName, buyer, patient, period, term, pay, time, status] = row;
    const detailLabel = { 待使用: '订单详情', 生效中: '服务详情', 已完成: '服务记录', 待审核: '审核退款', 退款中: '退款进度', 已退款: '退款详情' }[status] || '订单详情';
    return `<tr data-order-row data-order-status="${status}" data-order-search="${row.join(' ')}">
      <td>${orderNo}</td><td title="${packageName}">${packageName}</td><td>${buyer}</td><td>${patient}</td>
      <td>${period}</td><td>${pay.toFixed(2)}</td><td>${time}</td>
      <td><span class="order-badge ${badgeClass(status)}">${status}</span></td>
      <td><button class="service-link" type="button" data-order-detail="${orderNo}">${detailLabel}</button></td>
    </tr>`;
  }

  function transactionStatusClass(status) {
    return { 成功: 'success', 处理中: 'processing', 失败: 'failed' }[status] || 'processing';
  }

  function renderTransactionRow(row) {
    const typeClass = row.type === '支付' ? 'payment' : 'refund';
    const amountSign = row.type === '支付' ? '+' : '-';
    return `<tr data-transaction-row data-transaction-no="${row.no}" data-transaction-type="${row.type}" data-transaction-status="${row.status}" data-transaction-date="${row.time.slice(0, 10)}" data-transaction-search="${row.no} ${row.orderNo} ${row.refundNo || ''} ${row.buyer} ${row.packageName}" tabindex="0" aria-label="查看${row.type}交易 ${row.no}">
      <td title="${row.no}">${row.no}</td>
      <td><span class="transaction-type ${typeClass}">${row.type}</span></td>
      <td title="${row.orderNo}">${row.orderNo}</td>
      <td title="${row.packageName}">${row.packageName}</td>
      <td>${row.buyer}</td><td>${row.channel}</td>
      <td><span class="transaction-amount ${typeClass}">${amountSign}¥${row.amount.toFixed(2)}</span></td>
      <td><span class="transaction-status ${transactionStatusClass(row.status)}">${row.status}</span></td>
      <td title="${row.time}">${row.time}</td>
      <td><button class="service-link" type="button" data-transaction-detail="${row.no}">交易详情</button></td>
    </tr>`;
  }

  function packageCoverIcon(type, imageSource = '') {
    if (imageSource) return `<span class="package-cover photo" aria-hidden="true"><img src="${imageSource}" alt=""></span>`;
    const icons = {
      weight: '<path d="M12 4v7m0 0-3-3m3 3 3-3"/><path d="M5 14c1.8-1.2 4.1-1.8 7-1.8s5.2.6 7 1.8l-1.2 5H6.2L5 14Z"/>',
      glucose: '<path d="M12 3s5 5.7 5 10a5 5 0 0 1-10 0c0-4.3 5-10 5-10Z"/><path d="M9.5 14.5c.8 1 1.8 1.5 3 1.5"/>',
      pressure: '<path d="M4 12h3l2-4 3.2 8 2.1-4H20"/><path d="M12 21C6.8 18.2 4 15.1 4 10.8A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 8 3.8c0 4.3-2.8 7.4-8 10.2Z"/>',
      lipid: '<path d="M12 3 5.5 6v5c0 4.4 2.5 7.6 6.5 10 4-2.4 6.5-5.6 6.5-10V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
      sleep: '<path d="M18.5 15.5A7 7 0 0 1 9 6a7 7 0 1 0 9.5 9.5Z"/><path d="M17 5h3m-1.5-1.5v3"/>',
      nutrition: '<path d="M12 7c-2.5-3-7-1.8-7 2.7C5 15 8.4 20 12 20s7-5 7-10.3C19 5.2 14.5 4 12 7Z"/><path d="M12 7c0-2.2 1.2-3.5 3.5-4"/>',
      recovery: '<path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5V4Z"/>'
    };
    return `<span class="package-cover ${type}" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[type] || icons.weight}</svg></span>`;
  }

  function renderServicePackageRow(row) {
    const [code, coverType, name, description, period, price, plan, subscriptions, status] = row;
    return `<tr data-package-row data-package-code="${code}" data-package-status="${status}" data-package-search="${code} ${name} ${description} ${plan}" tabindex="0" aria-label="编辑服务包：${name}">
      <td>${code}</td><td>${packageCoverIcon(coverType, row[9] || '')}</td>
      <td title="${name}">${name}</td><td title="${description}">${description}</td><td>${period}</td><td>${price}</td><td title="${plan}">${plan}</td><td>${subscriptions}</td>
      <td><span class="package-status${status === '已上架' ? '' : ' pending'}">${status}</span></td><td><span class="package-actions"><button type="button" data-package-subscriptions="${code}">服务记录</button><button type="button" data-package-more="${code}" aria-haspopup="menu" aria-expanded="false">更多</button></span></td>
    </tr>`;
  }

  function renderPackageProject(label, title, rows) {
    return `<section class="package-project"><div class="package-project-head"><span class="package-drag">⠿</span><strong>${label}</strong><button type="button">♙ 删除</button></div><div class="package-project-title">${title}</div>${rows.map(row => `<div class="package-content-row"><span>${row[0]}</span><span>${row[1]}</span><span>${row[2]}</span></div>`).join('')}<button class="package-add-content" type="button">＋ 添加服务内容</button></section>`;
  }

  function renderBenefitContent(content = '', frequency = '服务期内1次') {
    return `<div class="package-benefit-content" data-benefit-content><span class="package-benefit-drag">⠿</span><input data-benefit-content-name value="${content}" placeholder="请输入服务内容"><div class="package-frequency-control" data-package-frequency-combobox><input data-benefit-frequency value="${frequency}" placeholder="选择或输入频次" aria-label="服务频次" role="combobox" aria-autocomplete="list" aria-expanded="false"><button class="package-frequency-trigger" data-package-frequency-trigger type="button" aria-label="展开历史频次"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.2 4.2 3.8 3.6 3.8-3.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="package-ant-select-dropdown package-frequency-dropdown" data-package-frequency-dropdown role="listbox" aria-label="历史频次" hidden></div></div><button class="package-benefit-remove" data-remove-benefit-content type="button" aria-label="删除服务内容">×</button></div>`;
  }

  function renderBenefitEditor(title = '', description = '', contents = []) {
    return `<section class="package-benefit-editor" data-benefit-editor><div class="package-benefit-editor-head"><label class="package-benefit-field"><input data-benefit-title value="${title}" placeholder="请输入权益名称" aria-label="权益名称"></label><label class="package-benefit-field description"><input data-benefit-description value="${description}" placeholder="请输入权益说明" aria-label="权益说明"></label><button class="package-benefit-delete" data-remove-benefit type="button" aria-label="删除权益" title="删除权益"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div data-benefit-content-list>${contents.map(([content, frequency]) => renderBenefitContent(content, frequency)).join('')}</div><button class="package-benefit-add-content" data-add-benefit-content type="button">＋ 添加服务内容</button></section>`;
  }

  function injectViews() {
    const main = document.querySelector('.list-main');
    if (!main) return false;
    main.insertAdjacentHTML('beforeend', `
      <section class="list-panel list-view service-page package-page" id="servicePackageView">
        <div class="package-toolbar">
          <div class="service-filter service-query-bar package-filter" data-persistence-ignore>
            <label class="service-field service-query-keyword"><input id="packageKeywordFilter" aria-label="服务包编号或名称" autocomplete="off" placeholder="请输入服务包编号或名称"></label>
            <label class="service-field"><span>状态</span><select id="packageStatusFilter"><option value="">全部状态</option><option value="待上架">待上架</option><option value="已上架">已上架</option></select></label>
            <div class="service-filter-actions"><button class="ant-query-btn primary" data-package-query type="button">查询</button><button class="ant-query-btn" data-package-reset type="button">重置</button></div>
          </div>
          <button class="package-create-btn" data-create-service-package type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 19h14V8l-3-3H5z"/><path d="M9 13l2 2 4-5"/></svg>新建服务包</button>
        </div>
        <div class="service-table-wrap"><table class="service-table package-table"><colgroup><col style="width:8%"><col style="width:6%"><col style="width:12%"><col style="width:16%"><col style="width:8%"><col style="width:8%"><col style="width:13%"><col style="width:8%"><col style="width:8%"><col style="width:13%"></colgroup><thead><tr>
          <th>服务包编号</th><th>封面</th><th>服务包名称</th><th>服务包描述</th><th>服务周期</th><th>价格(元)</th><th>关联方案</th><th>服务记录</th><th>状态</th><th>操作</th>
        </tr></thead><tbody id="servicePackageRows">${servicePackageRows.map(renderServicePackageRow).join('')}<tr id="packageEmptyRow" hidden><td class="package-empty-cell" colspan="10">暂无符合查询条件的服务包</td></tr></tbody></table></div>
        <div class="package-footer"><span>共 7 条</span><button type="button">‹</button><button class="active" type="button">1</button><button type="button">›</button><span class="package-page-size">10 条/页 <span>⌄</span></span></div>
      </section>
      <section class="list-panel list-view service-page" id="orderManagementView" data-persistence-ignore>
        <div class="service-filter service-query-bar">
          <label class="service-field service-query-keyword"><input id="orderSearchInput" value="" autocomplete="off" data-persistence-ignore aria-label="模糊查询订单" placeholder="订单编号 / 服务包 / 购买人 / 就诊人"></label>
          <div class="service-field"><span>下单时间</span><div class="service-date" role="group" aria-label="选择下单时间范围"><input id="orderStartDate" type="date" value="" autocomplete="off" data-persistence-ignore aria-label="开始日期"><span class="service-date-separator">→</span><input id="orderEndDate" type="date" value="" autocomplete="off" data-persistence-ignore aria-label="结束日期"></div></div>
          <div class="service-filter-actions"><button class="ant-query-btn primary" data-order-query type="button">查询</button><button class="ant-query-btn" data-order-reset type="button">重置</button></div>
        </div>
        <div class="service-summary">
          <div class="order-tabs">
            ${['all:全部', '待审核:待审核', '待使用:待使用', '生效中:生效中', '已完成:已完成', '退款中:退款中', '已退款:已退款'].map((item, index) => { const [value, label] = item.split(':'); return `<button class="order-tab${index === 0 ? ' active' : ''}" data-order-tab="${value}" data-label="${label}" type="button">${label}<span class="order-tab-count">（0）</span></button>`; }).join('')}
          </div>
          <div class="order-summary-metrics"><span id="orderTotalText"><strong>${orderOverallCount}</strong> 个订单</span><span id="orderPayTotalText">实付款合计：<strong>${orderOverallPayTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> 元</span></div>
        </div>
        <div class="service-table-wrap"><table class="service-table order-list-table"><colgroup><col style="width:13%"><col style="width:22%"><col style="width:9%"><col style="width:9%"><col style="width:8%"><col style="width:10%"><col style="width:14%"><col style="width:8%"><col style="width:7%"></colgroup><thead><tr>
          <th>订单编号</th><th>服务包</th><th>购买人</th><th>就诊人</th><th>服务周期</th><th>实付金额</th><th>下单时间</th><th>订单状态</th><th>操作</th>
        </tr></thead><tbody id="orderRows">${orderRows.map(renderOrderRow).join('')}<tr id="orderEmptyRow" hidden><td class="order-empty-cell" colspan="9">暂无符合查询条件的订单</td></tr></tbody></table></div>
        <div class="service-pager order-pagination" id="orderPagination" aria-label="订单分页"></div>
      </section>
      <section class="list-panel list-view service-page" id="transactionRecordView" data-persistence-ignore>
        <div class="service-filter service-query-bar transaction-filter">
          <label class="service-field service-query-keyword"><input id="transactionSearchInput" value="" autocomplete="off" aria-label="搜索交易记录" placeholder="交易流水号 / 订单编号 / 退款单号 / 购买人 / 服务包"></label>
          <label class="service-field"><span>交易类型</span><select id="transactionTypeFilter" aria-label="交易类型"><option value="">全部</option><option value="支付">支付</option><option value="退款">退款</option></select></label>
          <label class="service-field"><span>交易状态</span><select id="transactionStatusFilter" aria-label="交易状态"><option value="">全部</option><option value="处理中">处理中</option><option value="成功">成功</option><option value="失败">失败</option></select></label>
          <div class="service-field"><span>交易日期</span><div class="service-date" role="group" aria-label="选择交易日期范围"><input id="transactionStartDate" type="date" value="" autocomplete="off" aria-label="交易开始日期"><span class="service-date-separator">→</span><input id="transactionEndDate" type="date" value="" autocomplete="off" aria-label="交易结束日期"></div></div>
          <div class="service-filter-actions"><button class="ant-query-btn primary" data-transaction-query type="button">查询</button><button class="ant-query-btn" data-transaction-reset type="button">重置</button></div>
        </div>
        <div class="service-summary transaction-summary"><strong id="transactionTotalText">共${transactionRows.length}条记录</strong><span>支付成功金额：<b id="transactionPaymentTotal">¥0.00</b></span><span>退款成功金额：<b id="transactionRefundTotal">¥0.00</b></span></div>
        <div class="service-table-wrap"><table class="service-table transaction-table"><colgroup><col style="width:13%"><col style="width:6%"><col style="width:13%"><col style="width:16%"><col style="width:7%"><col style="width:8%"><col style="width:9%"><col style="width:8%"><col style="width:13%"><col style="width:7%"></colgroup><thead><tr>
          <th>交易流水号</th><th>类型</th><th>订单编号</th><th>服务包</th><th>购买人</th><th>渠道</th><th>金额</th><th>状态</th><th>交易时间</th><th>操作</th>
        </tr></thead><tbody id="transactionRows">${transactionRows.map(renderTransactionRow).join('')}<tr id="transactionEmptyRow" hidden><td class="transaction-empty-cell" colspan="10">暂无符合查询条件的交易记录</td></tr></tbody></table></div>
        <div class="service-pager order-pagination" id="transactionPagination" aria-label="交易记录分页"></div>
      </section>
    `);
    document.body.insertAdjacentHTML('beforeend', `
      <div class="order-detail-mask" id="restoredOrderMask" hidden></div>
      <aside class="order-detail-drawer" id="restoredOrderDrawer" data-note-scope="order-detail" data-note-entity="" role="dialog" aria-modal="true" aria-labelledby="restoredOrderTitle" aria-hidden="true">
        <div class="order-detail-head"><strong id="restoredOrderTitle">订单详情</strong><button class="order-detail-close" data-close-restored-order type="button" aria-label="关闭详情">×</button></div>
        <div class="order-detail-content" id="restoredOrderContent"></div>
      </aside>
      <div class="package-more-menu" id="packageMoreMenu" role="menu" hidden></div>
      <div class="package-record-mask" id="packageRecordMask" hidden></div>
      <aside class="package-record-drawer" id="packageRecordDrawer" aria-hidden="true" aria-label="服务记录">
        <div class="package-record-head"><strong>服务记录</strong><button class="package-record-close" data-close-package-record type="button" aria-label="关闭">×</button></div>
        <div class="package-record-content" id="packageRecordContent"></div>
      </aside>
      <div class="package-dialog-mask" id="packageDialogMask" hidden></div>
      <section class="package-dialog" id="packageActionDialog" role="dialog" aria-modal="true" hidden>
        <h3 id="packageDialogTitle"></h3><p id="packageDialogText"></p><div class="package-dialog-body" id="packageDialogBody"></div>
        <div class="package-dialog-actions"><button data-close-package-dialog type="button">取消</button><button class="primary" id="packageDialogConfirm" type="button">确认</button></div>
      </section>
      <div class="package-dialog-mask" id="packageShareMask" hidden></div>
      <section class="package-share-dialog" id="packageShareDialog" role="dialog" aria-modal="true" aria-labelledby="packageShareTitle" hidden>
        <header class="package-share-head"><strong id="packageShareTitle">分享服务包</strong><button class="package-share-close" data-close-package-share type="button" aria-label="关闭分享弹窗">×</button></header>
        <div class="package-share-content"><h3 class="package-share-name" id="packageShareName"></h3><p class="package-share-tip">患者可通过链接或扫码直接打开服务详情页，并可订阅购买</p>
          <label class="package-share-label" for="packageShareLink">分享链接</label><div class="package-share-input-group"><input id="packageShareLink" readonly><button data-copy-package-link type="button">复制</button></div>
          <span class="package-share-label">分享二维码</span><div class="package-qr-card"><canvas id="packageShareQr" width="308" height="308" aria-label="服务包分享二维码"></canvas><div class="package-qr-actions"><button data-copy-package-qr type="button">▣ 复制</button><button data-download-package-qr type="button">⇩ 下载</button></div></div>
        </div>
      </section>
      <section class="package-editor-overlay" id="packageEditorOverlay" data-note-scope="service-package-editor" data-note-mode="create" hidden aria-label="新建服务包">
        <header class="package-editor-top"><button class="package-editor-exit" data-close-package-editor type="button">× <span>退出</span></button><strong class="package-editor-title">新建服务包</strong><button class="package-editor-save" data-save-service-package type="button">保存</button></header>
        <div class="package-editor-scroll">
          <div class="package-editor-layout">
          <aside class="package-live-preview" aria-label="C端实时预览">
            <div class="package-preview-heading">C端实时预览 <span>配置内容实时同步</span></div>
            <div class="package-phone">
              <div class="package-phone-screen">
                <div class="package-detail-preview">
                  <div class="package-detail-hero"><img class="is-default" id="packagePreviewCover" src="./assets/service-package/weight-management-clean.png" alt="减重健康管理服务封面"></div>
                  <main class="package-detail-main">
                    <section class="package-detail-overview"><h2 class="package-detail-name" id="packagePreviewName">90天减重管理服务包</h2>
                    <div class="package-detail-tags" id="packagePreviewTags"><span>科学减重</span><span>饮食管理</span><span>运动指导</span></div>
                    <div class="package-detail-price-row"><strong class="package-detail-price" id="packagePreviewPrice">¥299</strong><span class="package-detail-price-unit" id="packagePreviewPriceUnit">/ 90天</span><span class="package-detail-sold">已售：9,860+</span></div>
                    <p class="package-detail-summary" id="packagePreviewDescription">通过个性化饮食和运动方案，帮助您健康减重，塑造理想体型。</p></section>
                    <section class="package-detail-section"><div class="package-detail-section-head"><h3 class="package-detail-section-title">服务介绍</h3><span class="package-detail-section-note">服务内容实时同步</span></div><article class="package-intro-card package-intro-summary"><span class="package-intro-index">01</span><div><p id="packagePreviewIntro">填写服务介绍后，将在这里展示服务内容、服务方式及用户能够获得的健康价值。</p></div></article></section>
                    <section class="package-detail-section"><div class="package-detail-section-head"><h3 class="package-detail-section-title">服务权益</h3><span class="package-detail-section-note" id="packagePreviewPeriodNote">服务包有效期90天</span></div><div class="package-benefit-table">
                      <div class="package-benefit-row head"><span>服务权益</span><span>权益说明</span><span>次数</span></div>
                      <div class="package-preview-benefit-rows" id="packagePreviewBenefitRows"></div>
                    </div></section>
                    <section class="package-detail-section"><div class="package-detail-section-head"><h3 class="package-detail-section-title">服务规则</h3><span class="package-detail-section-note">购买及使用前请仔细阅读</span></div><div class="package-detail-rules" id="packagePreviewRules"><div class="package-rule-item"><span class="package-rule-index">1</span><span>服务有效期自购买之日计算。</span></div><div class="package-rule-item"><span class="package-rule-index">2</span><span>有效期内可按配置频次使用服务权益。</span></div><div class="package-rule-item"><span class="package-rule-index">3</span><span>一个订单仅限绑定一名就诊人。</span></div></div></section>
                  </main>
                </div>
              </div>
            </div>
          </aside>
          <form class="package-editor-card" id="packageEditorForm">
            <section class="package-config-section" data-config-section="basic"><div class="package-config-head"><span class="package-config-index">1</span><div><div class="package-config-title">基本信息</div><div class="package-config-subtitle">配置服务包在 C 端展示的基础内容</div></div></div><div class="package-field-grid">
              <div class="package-form-group full"><label class="package-form-label"><span class="package-required">*</span>服务包名称</label><div class="package-input-wrap"><input class="package-form-input" id="packageNameInput" data-package-form-input maxlength="20" placeholder="请输入服务包名称"><span class="package-counter">0 / 20</span></div></div>
              <div class="package-form-group full"><label class="package-form-label"><span class="package-required">*</span>服务包描述</label><div class="package-input-wrap"><input class="package-form-input" id="packageDescriptionInput" data-package-form-input maxlength="20" placeholder="一句话简介 / 核心价值"><span class="package-counter">0 / 20</span></div></div>
              <div class="package-form-group full"><label class="package-form-label"><span class="package-required">*</span>服务包封面</label><label class="package-upload" for="packageCoverInput"><input id="packageCoverInput" type="file" accept="image/jpeg,image/png,image/webp" hidden><span class="package-upload-empty" id="packageUploadEmpty"><strong>＋</strong><span>上传封面</span></span><img class="package-upload-preview" id="packageCoverThumb" alt="服务包封面预览" hidden><span class="package-upload-replace" id="packageUploadReplace" hidden>重新上传</span></label><div class="package-upload-meta"><span id="packageCoverMeta">建议 750×420px，JPG/PNG/WebP，5MB以内</span><button data-remove-package-cover type="button" hidden>移除</button></div></div>
              <div class="package-form-group full"><label class="package-form-label"><span class="package-required">*</span>关键词标签 <span class="package-tag-status" id="packageTagStatus">已选 1/3 · 共 5/10</span></label><div class="package-tags" id="packageTagList"><button class="package-tag active" data-package-tag type="button"><span data-package-tag-label>三甲专家</span><i class="package-tag-remove" data-remove-package-tag title="删除标签">×</i></button><button class="package-tag" data-package-tag type="button"><span data-package-tag-label>个性化方案</span><i class="package-tag-remove" data-remove-package-tag title="删除标签">×</i></button><button class="package-tag" data-package-tag type="button"><span data-package-tag-label>全周期管理</span><i class="package-tag-remove" data-remove-package-tag title="删除标签">×</i></button><button class="package-tag" data-package-tag type="button"><span data-package-tag-label>专业健康评估</span><i class="package-tag-remove" data-remove-package-tag title="删除标签">×</i></button><button class="package-tag" data-package-tag type="button"><span data-package-tag-label>7×24h服务</span><i class="package-tag-remove" data-remove-package-tag title="删除标签">×</i></button><span class="package-tag-editor" data-package-tag-editor hidden><input id="packageCustomTagInput" maxlength="10" placeholder="输入标签内容" aria-label="自定义关键词标签"><button data-confirm-package-tag type="button" aria-label="添加标签">✓</button><button data-cancel-package-tag type="button" aria-label="取消添加">×</button></span><button class="package-tag add" data-add-package-tag type="button">＋ 自定义</button></div></div>
              <div class="package-form-group full package-service-intro"><label class="package-form-label"><span class="package-required">*</span>服务介绍</label><div class="package-input-wrap"><textarea class="package-form-textarea" id="packageIntroInput" data-package-form-input maxlength="500" placeholder="请输入服务内容、服务方式及用户价值"></textarea><span class="package-counter">0 / 500</span></div></div>
              <div class="package-form-group full"><label class="package-form-label" id="packageVerificationModeLabel"><span class="package-required">*</span>核销操作</label><div class="package-radio-group" id="packageVerificationModeGroup" role="radiogroup" aria-labelledby="packageVerificationModeLabel"><label class="package-radio-option"><input type="radio" name="packageVerificationMode" value="本平台完成" checked><span>本平台完成</span></label><label class="package-radio-option"><input type="radio" name="packageVerificationMode" value="外部系统完成"><span>外部系统完成</span></label></div></div>
            </div></section>
            <section class="package-config-section" data-config-section="price"><div class="package-config-head"><span class="package-config-index">2</span><div><div class="package-config-title">价格与周期</div><div class="package-config-subtitle">设置销售价格和服务有效周期</div></div></div><div class="package-field-grid">
              <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>服务包价格</label><div class="package-price-input"><span>¥</span><input class="package-form-input" id="packagePriceInput" data-package-form-input inputmode="decimal" placeholder="请输入价格"></div></div>
              <div class="package-form-group full"><label class="package-form-label"><span class="package-required">*</span>服务包周期 <span class="package-duration-note">1个月=30天，1年=365天</span></label><div class="package-duration"><button class="active" data-package-duration type="button">1个月</button><button data-package-duration type="button">3个月</button><button data-package-duration type="button">6个月</button><button data-package-duration type="button">1年</button><label class="package-manual-period" data-manual-period><span>自定义</span><input id="packageCustomDurationValue" data-package-form-input type="number" min="1" max="3650" inputmode="numeric" placeholder="数值" aria-label="自定义服务周期"><select id="packageCustomDurationUnit" data-package-form-input aria-label="自定义周期单位"><option value="天">天</option><option value="月">月</option><option value="年">年</option></select></label></div></div>
            </div></section>
            <section class="package-config-section" data-config-section="benefits"><div class="package-config-head"><span class="package-config-index">3</span><div><div class="package-config-title">服务权益</div><div class="package-config-subtitle">配置用户能够获得的具体服务内容和频次</div></div><span class="package-config-count" id="packageBenefitCount">3个服务权益</span></div><div id="packageBenefitEditors">
              ${renderBenefitEditor('健康档案', '建立专属健康档案，持续沉淀健康数据', [['建立健康档案，整合就诊记录、检查结果和日常健康信息', '服务期内1次']], '▰')}
              ${renderBenefitEditor('个性化健康管理计划', '根据健康评估结果制定并动态调整管理计划', [['初始健康评估并制定健康管理计划', '服务期内1次'], ['根据回访及复诊结果动态调整健康管理计划', '服务期内持续'], ['线上健康回访', '每月1次']], '▤')}
              ${renderBenefitEditor('全程健康守护', '持续监测健康指标并提供专业健康支持', [['关键健康指标持续监测与异常提醒', '全年持续'], ['日常健康咨询与用药提醒', '全年持续']], '✚')}
            </div><button class="package-benefit-add" data-add-benefit type="button">＋ 添加服务权益</button></section>
            <section class="package-config-section" data-config-section="plan"><div class="package-config-head"><span class="package-config-index">4</span><div><div class="package-config-title">关联方案</div><div class="package-config-subtitle">选择服务执行所使用的方案内容和服务团队</div></div></div><div class="package-field-grid">
              <div class="package-form-group"><label class="package-form-label">方案内容 <span class="package-optional">选填</span></label><select class="package-form-select" id="packagePlanInput" data-package-form-input><option value="">请选择方案内容</option><option>90天健康减重管理方案</option><option>糖尿病全周期管理方案</option><option>高血压强化管理方案</option><option>心血管健康管理方案</option></select></div>
              <div class="package-form-group"><label class="package-form-label">服务团队 <span class="package-optional">选填</span></label><select class="package-form-select" id="packageTeamInput" data-package-form-input><option value="">请选择服务团队</option><option>慢病健康管理团队</option><option>营养与体重管理团队</option><option>心血管专病服务团队</option><option>术后康复随访团队</option></select></div>
            </div></section>
            <section class="package-config-section" data-config-section="rules"><div class="package-config-head"><span class="package-config-index">5</span><div><div class="package-config-title">服务规则与协议</div><div class="package-config-subtitle">明确服务边界，并配置用户订阅前需要确认的协议</div></div></div>
              <div class="package-form-group"><label class="package-form-label"><span class="package-required">*</span>服务规则</label><div class="package-input-wrap"><textarea class="package-form-textarea package-rules" id="packageRulesInput" data-package-form-input maxlength="500">1. 服务有效期自购买之日计算。&#10;2. 有效期内可按配置频次使用服务权益，超出有效期或次数用完后按正常服务价格收费。&#10;3. 一个订单仅限绑定一名就诊人，服务启用后不可更改。&#10;4. 服务包费用不包含检查、药品、手术及住院等医疗费用。&#10;5. 购买后7天内未启用服务，可联系客服申请退款。&#10;6. 客服电话：020-00000000</textarea><span class="package-counter">218 / 500</span></div></div>
              <div class="package-agreement-list"><div class="package-agreement-item"><strong>健康管理服务协议</strong><select id="packageServiceAgreement" data-package-form-input><option>请选择协议模板</option><option selected>健康管理服务协议 V2.1</option></select><button data-preview-agreement="service" type="button">预览协议</button></div></div>
            </section>
          </form>
          </div>
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
      applyPackageFilter();
    }
    if (view === 'orders') resetOrderFilters();
    if (view === 'transactions') resetTransactionFilters();
  }

  function applyPackageFilter() {
    const keyword = (document.getElementById('packageKeywordFilter')?.value || '').trim().toLowerCase();
    const status = document.getElementById('packageStatusFilter')?.value || '';
    let visible = 0;
    document.querySelectorAll('[data-package-row]').forEach(row => {
      const cells = row.children;
      const keywordHit = !keyword || `${row.dataset.packageCode || ''} ${cells[2]?.textContent || ''}`.toLowerCase().includes(keyword);
      const statusHit = !status || row.dataset.packageStatus === status;
      const hit = keywordHit && statusHit;
      row.hidden = !hit;
      if (hit) visible += 1;
    });
    const empty = document.getElementById('packageEmptyRow');
    if (empty) empty.hidden = visible > 0;
    const total = document.querySelector('.package-footer > span:first-child');
    if (total) total.textContent = `共 ${visible} 条`;
  }

  function resetPackageFilters() {
    const keyword = document.getElementById('packageKeywordFilter');
    const status = document.getElementById('packageStatusFilter');
    if (keyword) keyword.value = '';
    if (status) status.value = '';
    applyPackageFilter();
  }

  function resetOrderFilters() {
    const orderSearch = document.getElementById('orderSearchInput');
    const startDate = document.getElementById('orderStartDate');
    const endDate = document.getElementById('orderEndDate');
    if (orderSearch) orderSearch.value = '';
    if (startDate) {
      startDate.value = '';
      startDate.removeAttribute('max');
    }
    if (endDate) {
      endDate.value = '';
      endDate.removeAttribute('min');
    }
    document.querySelectorAll('.order-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.orderTab === 'all');
    });
    orderCurrentPage = 1;
    applyOrderFilter(false);
  }

  function renderOrderPagination(totalItems) {
    const pagination = document.getElementById('orderPagination');
    if (!pagination) return;
    const totalPages = Math.max(1, Math.ceil(totalItems / orderPageSize));
    const pageItems = [];
    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page += 1) pageItems.push(page);
    } else {
      pageItems.push(1);
      if (orderCurrentPage > 4) pageItems.push('start-ellipsis');
      const start = Math.max(2, orderCurrentPage - 1);
      const end = Math.min(totalPages - 1, orderCurrentPage + 1);
      for (let page = start; page <= end; page += 1) pageItems.push(page);
      if (orderCurrentPage < totalPages - 3) pageItems.push('end-ellipsis');
      pageItems.push(totalPages);
    }
    pagination.innerHTML = `
      <span class="order-pagination-total">共 ${totalItems} 条</span>
      <button data-order-page="${orderCurrentPage - 1}" type="button" aria-label="上一页"${orderCurrentPage <= 1 ? ' disabled' : ''}>‹</button>
      ${pageItems.map(item => typeof item === 'number'
        ? `<button class="${item === orderCurrentPage ? 'active' : ''}" data-order-page="${item}" type="button"${item === orderCurrentPage ? ' aria-current="page"' : ''}>${item}</button>`
        : '<span class="order-pagination-ellipsis">•••</span>').join('')}
      <button data-order-page="${orderCurrentPage + 1}" type="button" aria-label="下一页"${orderCurrentPage >= totalPages ? ' disabled' : ''}>›</button>
      <select class="order-page-size" id="orderPageSize" aria-label="每页条数">
        ${[10, 20, 50].map(size => `<option value="${size}"${size === orderPageSize ? ' selected' : ''}>${size} 条/页</option>`).join('')}
      </select>
      <label class="order-page-jump">跳至 <input id="orderPageJump" inputmode="numeric" aria-label="跳转页码"> 页</label>`;
  }

  function applyOrderFilter(resetPage = true) {
    const keyword = (document.getElementById('orderSearchInput')?.value || '').trim().toLowerCase();
    const keywordTerms = keyword.split(/\s+/).filter(Boolean);
    const startDate = document.getElementById('orderStartDate')?.value || '';
    const endDate = document.getElementById('orderEndDate')?.value || '';
    const status = document.querySelector('.order-tab.active')?.dataset.orderTab || 'all';
    const statusCounts = { all: 0, 待使用: 0, 生效中: 0, 已完成: 0, 待审核: 0, 退款中: 0, 已退款: 0 };
    const matchedRows = [];
    if (resetPage) orderCurrentPage = 1;
    document.querySelectorAll('#orderRows [data-order-row]').forEach(row => {
      const searchText = row.dataset.orderSearch.toLowerCase();
      const keywordHit = keywordTerms.length === 0 || keywordTerms.every(term => searchText.includes(term));
      const orderDate = (row.children[6]?.textContent || '').trim().slice(0, 10).replaceAll('/', '-');
      const dateHit = (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
      const conditionHit = keywordHit && dateHit;
      if (conditionHit) {
        statusCounts.all += 1;
        statusCounts[row.dataset.orderStatus] = (statusCounts[row.dataset.orderStatus] || 0) + 1;
      }
      const hit = conditionHit && (status === 'all' || row.dataset.orderStatus === status);
      if (hit) {
        matchedRows.push(row);
      }
    });
    const totalPages = Math.max(1, Math.ceil(matchedRows.length / orderPageSize));
    orderCurrentPage = Math.min(Math.max(orderCurrentPage, 1), totalPages);
    const pageStart = (orderCurrentPage - 1) * orderPageSize;
    const pageRows = new Set(matchedRows.slice(pageStart, pageStart + orderPageSize));
    document.querySelectorAll('#orderRows [data-order-row]').forEach(row => { row.hidden = !pageRows.has(row); });
    const emptyRow = document.getElementById('orderEmptyRow');
    if (emptyRow) emptyRow.hidden = matchedRows.length > 0;
    document.querySelectorAll('[data-order-tab]').forEach(tab => {
      const value = tab.dataset.orderTab || 'all';
      const label = tab.dataset.label || value;
      tab.innerHTML = `${label}<span class="order-tab-count">（${statusCounts[value] || 0}）</span>`;
    });
    document.getElementById('orderTotalText').innerHTML = `<strong>${orderOverallCount}</strong> 个订单`;
    document.getElementById('orderPayTotalText').innerHTML = `实付款合计：<strong>${orderOverallPayTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> 元`;
    renderOrderPagination(matchedRows.length);
  }

  function resetTransactionFilters() {
    const search = document.getElementById('transactionSearchInput');
    const type = document.getElementById('transactionTypeFilter');
    const status = document.getElementById('transactionStatusFilter');
    const startDate = document.getElementById('transactionStartDate');
    const endDate = document.getElementById('transactionEndDate');
    if (search) search.value = '';
    if (type) type.value = '';
    if (status) status.value = '';
    if (startDate) {
      startDate.value = '';
      startDate.removeAttribute('max');
    }
    if (endDate) {
      endDate.value = '';
      endDate.removeAttribute('min');
    }
    transactionCurrentPage = 1;
    applyTransactionFilter(false);
  }

  function renderTransactionPagination(totalItems) {
    const pagination = document.getElementById('transactionPagination');
    if (!pagination) return;
    const totalPages = Math.max(1, Math.ceil(totalItems / transactionPageSize));
    pagination.innerHTML = `
      <span class="order-pagination-total">共 ${totalItems} 条</span>
      <button data-transaction-page="${transactionCurrentPage - 1}" type="button" aria-label="上一页"${transactionCurrentPage <= 1 ? ' disabled' : ''}>‹</button>
      ${Array.from({ length: totalPages }, (_, index) => index + 1).map(page => `<button class="${page === transactionCurrentPage ? 'active' : ''}" data-transaction-page="${page}" type="button"${page === transactionCurrentPage ? ' aria-current="page"' : ''}>${page}</button>`).join('')}
      <button data-transaction-page="${transactionCurrentPage + 1}" type="button" aria-label="下一页"${transactionCurrentPage >= totalPages ? ' disabled' : ''}>›</button>
      <select class="order-page-size" id="transactionPageSize" aria-label="交易记录每页条数">
        ${[10, 20, 50].map(size => `<option value="${size}"${size === transactionPageSize ? ' selected' : ''}>${size} 条/页</option>`).join('')}
      </select>`;
  }

  function applyTransactionFilter(resetPage = true) {
    const keyword = (document.getElementById('transactionSearchInput')?.value || '').trim().toLowerCase();
    const keywordTerms = keyword.split(/\s+/).filter(Boolean);
    const type = document.getElementById('transactionTypeFilter')?.value || '';
    const status = document.getElementById('transactionStatusFilter')?.value || '';
    const startDate = document.getElementById('transactionStartDate')?.value || '';
    const endDate = document.getElementById('transactionEndDate')?.value || '';
    const matchedRows = [];
    let paymentTotal = 0;
    let refundTotal = 0;
    if (resetPage) transactionCurrentPage = 1;
    document.querySelectorAll('#transactionRows [data-transaction-row]').forEach(row => {
      const searchText = row.dataset.transactionSearch.toLowerCase();
      const keywordHit = keywordTerms.length === 0 || keywordTerms.every(term => searchText.includes(term));
      const typeHit = !type || row.dataset.transactionType === type;
      const statusHit = !status || row.dataset.transactionStatus === status;
      const date = row.dataset.transactionDate || '';
      const dateHit = (!startDate || date >= startDate) && (!endDate || date <= endDate);
      if (!(keywordHit && typeHit && statusHit && dateHit)) return;
      matchedRows.push(row);
      const transaction = transactionRows.find(item => item.no === row.dataset.transactionNo);
      if (transaction?.type === '支付' && transaction.status === '成功') paymentTotal += transaction.amount;
      if (transaction?.type === '退款' && transaction.status === '成功') refundTotal += transaction.amount;
    });
    const totalPages = Math.max(1, Math.ceil(matchedRows.length / transactionPageSize));
    transactionCurrentPage = Math.min(Math.max(transactionCurrentPage, 1), totalPages);
    const pageStart = (transactionCurrentPage - 1) * transactionPageSize;
    const visibleRows = new Set(matchedRows.slice(pageStart, pageStart + transactionPageSize));
    document.querySelectorAll('#transactionRows [data-transaction-row]').forEach(row => { row.hidden = !visibleRows.has(row); });
    const empty = document.getElementById('transactionEmptyRow');
    if (empty) empty.hidden = matchedRows.length > 0;
    document.getElementById('transactionTotalText').textContent = `共${matchedRows.length}条记录`;
    document.getElementById('transactionPaymentTotal').textContent = `¥${paymentTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('transactionRefundTotal').textContent = `¥${refundTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    renderTransactionPagination(matchedRows.length);
  }

  function sensitiveEyeIcon(hidden = true) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.5"/>${hidden ? '' : '<path d="m4 4 16 16"/>'}</svg>`;
  }

  function renderSensitiveValue(masked, full, label) {
    return `<span class="order-sensitive-value"><span class="order-sensitive-text" data-sensitive-text>${masked}</span><button class="order-sensitive-toggle" data-sensitive-toggle data-masked="${masked}" data-full="${full}" data-sensitive-label="${label}" type="button" aria-label="查看${label}" aria-pressed="false" title="查看${label}">${sensitiveEyeIcon(true)}</button></span>`;
  }

  function renderOrderDetailSection(title, fields = [], body = '', headerAction = '') {
    const fieldMarkup = renderOrderDetailFields(fields);
    return `<section class="order-detail-section"><h3><span>${title}</span>${headerAction}</h3>${fieldMarkup}${body}</section>`;
  }

  function renderOrderDetailFields(fields = []) {
    return fields.length ? `<div class="order-detail-grid">${fields.map(([label, value, wide = false]) => `<div class="order-detail-item${wide ? ' wide' : ''}"><span>${label}</span><strong>${value}</strong></div>`).join('')}</div>` : '';
  }

  function renderOrderInformation(groups = []) {
    const content = groups.filter(([, fields]) => fields?.length).map(([title, fields]) => `<div class="order-detail-subsection"><h4>${title}</h4>${renderOrderDetailFields(fields)}</div>`).join('');
    return `<section class="order-detail-section"><h3>订单信息</h3>${content}</section>`;
  }

  function renderOrderTimeline(items) {
    return `<ol class="order-detail-timeline">${items.map(([time, title, note = '', state = '']) => `<li${state ? ` class="${state}"` : ''}><strong>${title}</strong><time>${time}</time>${note ? `<span>${note}</span>` : ''}</li>`).join('')}</ol>`;
  }

  function addOrderTimelineMinutes(value, minutes) {
    const parsed = new Date(String(value).replaceAll('/', '-').replace(' ', 'T'));
    if (Number.isNaN(parsed.getTime())) return value;
    parsed.setMinutes(parsed.getMinutes() + minutes);
    const pad = number => String(number).padStart(2, '0');
    return `${parsed.getFullYear()}/${pad(parsed.getMonth() + 1)}/${pad(parsed.getDate())} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
  }

  function renderOrderRecords(items) {
    return `<div class="order-record-list">${items.map(([label, value]) => `<div class="order-record-row"><strong>${label}</strong><span>${value}</span></div>`).join('')}</div>`;
  }

  function normalizeTransactionDateTime(value) {
    if (!value || value === '--' || value === '—') return '—';
    return value.length === 16 ? `${value}:00` : value;
  }

  function addTransactionSeconds(value, seconds) {
    const normalized = normalizeTransactionDateTime(value);
    if (normalized === '—') return normalized;
    const parsed = new Date(normalized.replace(' ', 'T'));
    if (Number.isNaN(parsed.getTime())) return normalized;
    parsed.setSeconds(parsed.getSeconds() + seconds);
    const pad = number => String(number).padStart(2, '0');
    return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`;
  }

  function transactionTimeOnly(value) {
    const normalized = normalizeTransactionDateTime(value);
    return normalized === '—' ? normalized : normalized.slice(11);
  }

  function transactionMoney(value) {
    return `¥${Number(value).toFixed(2)}`;
  }

  function renderTransactionAuditData({ result = '通过', auditor, auditedAt, opinion, amount = '' }) {
    return [
      `审核结果：<b class="transaction-audit-result${result === '通过' ? '' : ' failed'}">${result}</b>`,
      `审核人：${auditor}`,
      `审核时间：${normalizeTransactionDateTime(auditedAt)}`,
      result !== '通过' && opinion ? `审核意见：${opinion}` : '',
      amount ? `核定金额：${amount}` : ''
    ].filter(Boolean).join('<br>');
  }

  function transactionOrderStatus(transaction) {
    if (transaction.type === '支付') return '待使用';
    return transaction.status === '成功' ? '已退款' : '退款中';
  }

  function renderTransactionOrderSection(transaction) {
    const status = transactionOrderStatus(transaction);
    const fields = [
      ['订单编号', transaction.orderNo], ['服务包名称', transaction.packageName], ['购买人', transaction.buyer],
      ['订单金额', transactionMoney(transaction.amount)], ['实付金额', transactionMoney(transaction.amount)],
      ['下单时间', normalizeTransactionDateTime(transaction.time)], ['当前订单状态', `<span class="order-badge ${badgeClass(status)}">${status}</span>`]
    ];
    if (transaction.type === '退款') fields.push(
      ['原订单实付金额', transactionMoney(transaction.amount)], ['本次退款金额', transactionMoney(transaction.amount)]
    );
    const viewOrderButton = `<button class="ant-query-btn" type="button" data-transaction-locate-order="${transaction.no}">查看订单</button>`;
    return renderOrderDetailSection('关联订单', fields, '', viewOrderButton);
  }

  function ensureTransactionOrderInList(transaction) {
    const status = transactionOrderStatus(transaction);
    const paymentTransaction = transactionRows.find(item => item.orderNo === transaction.orderNo && item.type === '支付') || transaction;
    const orderRow = [
      transaction.orderNo,
      transaction.packageName,
      transaction.buyer,
      '--',
      '30天',
      '绑定后计算',
      transaction.amount,
      paymentTransaction.time.replaceAll('-', '/'),
      status
    ];
    const orderIndex = orderRows.findIndex(item => item[0] === transaction.orderNo);
    if (orderIndex >= 0) orderRows.splice(orderIndex, 1, orderRow);
    else orderRows.unshift(orderRow);

    const existingRow = document.querySelector(`[data-order-detail="${transaction.orderNo}"]`)?.closest('[data-order-row]');
    if (existingRow) existingRow.outerHTML = renderOrderRow(orderRow);
    else document.getElementById('orderEmptyRow')?.insertAdjacentHTML('beforebegin', renderOrderRow(orderRow));
  }

  function locateTransactionOrder(transactionNo) {
    const transaction = transactionRows.find(item => item.no === transactionNo);
    if (!transaction) return;
    ensureTransactionOrderInList(transaction);
    closeOrderDetail();
    setServiceActive('orders');
    const searchInput = document.getElementById('orderSearchInput');
    if (searchInput) searchInput.value = transaction.orderNo;
    document.querySelectorAll('.order-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.orderTab === 'all');
    });
    orderCurrentPage = 1;
    applyOrderFilter(false);
    searchInput?.focus();
  }

  function openTransactionDetail(transactionNo) {
    const transaction = transactionRows.find(item => item.no === transactionNo);
    if (!transaction) return;
    const noteDrawer = document.getElementById('restoredOrderDrawer');
    noteDrawer.dataset.noteScope = 'transaction-detail';
    noteDrawer.dataset.noteEntity = transaction.no;
    const statusMarkup = `<span class="transaction-status ${transactionStatusClass(transaction.status)}">${transaction.status}</span>`;
    const typeClass = transaction.type === '支付' ? 'payment' : 'refund';
    const amountMarkup = `<span class="transaction-amount ${typeClass}">${transaction.type === '支付' ? '+' : '-'}${transactionMoney(transaction.amount)}</span>`;
    let detailContent = '';

    if (transaction.type === '支付') {
      const createdAt = normalizeTransactionDateTime(transaction.time);
      const completedAt = normalizeTransactionDateTime(transaction.channelTime);
      const paymentAuditAt = completedAt;
      const timeline = [
        [transactionTimeOnly(createdAt), '创建支付交易'],
        [transactionTimeOnly(addTransactionSeconds(createdAt, 2)), '提交渠道支付'],
        [transactionTimeOnly(completedAt), '渠道确认支付成功'],
        [transactionTimeOnly(paymentAuditAt), '支付结果审核通过', renderTransactionAuditData({
          auditor: '张医生',
          auditedAt: paymentAuditAt
        })],
        [transactionTimeOnly(addTransactionSeconds(completedAt, 1)), '生成正式订单']
      ];
      detailContent = [
        '<div class="transaction-detail-alert success" role="status">支付成功，已生成正式订单。</div>',
        renderOrderDetailSection('交易信息', [
          ['交易类型', `<span class="transaction-type payment">支付</span>`], ['交易状态', statusMarkup],
          ['交易流水号', transaction.no], ['交易金额', amountMarkup], ['支付渠道', transaction.channel],
          ['支付时间', completedAt], ['渠道支付流水号', transaction.channelNo], ['渠道处理结果', '支付成功']
        ]),
        renderTransactionOrderSection(transaction),
        renderOrderDetailSection('处理记录', [], renderOrderTimeline(timeline))
      ].join('');
    } else {
      const requestedAt = normalizeTransactionDateTime(transaction.requestedAt);
      const refundAuditAt = addTransactionSeconds(requestedAt, 2);
      const submittedAt = addTransactionSeconds(requestedAt, 3);
      const originalPayment = transactionRows.find(item => item.type === '支付' && item.orderNo === transaction.orderNo);
      const originalPaymentNo = originalPayment?.no || '—';
      const channelRefundNo = !transaction.channelRefundNo || transaction.channelRefundNo === '--' ? '—' : transaction.channelRefundNo;
      const alertText = transaction.status === '处理中'
        ? '退款申请已提交支付渠道，正在等待处理结果。'
        : transaction.status === '成功'
          ? '退款成功，款项已按原支付路径退回。'
          : '退款暂未成功，请查询支付渠道处理结果。';
      const transactionFields = [
        ['交易类型', '<span class="transaction-type refund">退款</span>'], ['交易状态', statusMarkup],
        ['退款交易流水号', transaction.no], ['退款单号', transaction.refundNo], ['退款金额', amountMarkup]
      ];
      if (transaction.status === '处理中') transactionFields.push(
        ['退款原因', transaction.reason, true], ['申请时间', requestedAt], ['退款方式', '原支付路径退回'],
        ['原支付流水号', originalPaymentNo], ['原渠道支付流水号', transaction.originalPaymentNo],
        ['渠道退款流水号', channelRefundNo], ['最近查询时间', normalizeTransactionDateTime(transaction.lastQueriedAt)],
        ['渠道处理结果', '处理中']
      );
      if (transaction.status === '成功') transactionFields.push(
        ['退款原因', transaction.reason, true], ['申请时间', requestedAt], ['退款完成时间', normalizeTransactionDateTime(transaction.completedAt)],
        ['退款方式', '原支付路径退回'], ['退款去向', `${transaction.channel}账户`],
        ['原支付流水号', originalPaymentNo], ['渠道退款流水号', channelRefundNo], ['渠道处理结果', '退款成功']
      );
      if (transaction.status === '失败') transactionFields.push(
        ['申请时间', requestedAt], ['失败时间', addTransactionSeconds(requestedAt, 5)], ['原支付流水号', originalPaymentNo],
        ['渠道退款流水号', channelRefundNo], ['失败原因', transaction.failureReason.replace(/^渠道返回：/, ''), true],
        ['渠道错误信息', transaction.failureReason, true], ['最近查询时间', normalizeTransactionDateTime(transaction.lastQueriedAt)],
        ['重试次数', `${transaction.retryCount}次`]
      );

      const refundTimeline = [
        [transactionTimeOnly(requestedAt), '用户申请退款'],
        [transactionTimeOnly(addTransactionSeconds(requestedAt, 1)), '生成退款单'],
        [transactionTimeOnly(refundAuditAt), '退款申请审核通过', renderTransactionAuditData({
          auditor: '李医生',
          auditedAt: refundAuditAt,
          amount: transactionMoney(transaction.amount)
        })],
        [transactionTimeOnly(submittedAt), '提交渠道退款']
      ];
      if (transaction.status === '处理中') refundTimeline.push(
        [transactionTimeOnly(addTransactionSeconds(requestedAt, 5)), '渠道处理中']
      );
      if (transaction.status === '成功') refundTimeline.push(
        [transactionTimeOnly(addTransactionSeconds(submittedAt, 2)), '渠道处理中'],
        [transactionTimeOnly(transaction.completedAt), '渠道退款成功']
      );
      if (transaction.status === '失败') refundTimeline.push(
        [transactionTimeOnly(addTransactionSeconds(requestedAt, 5)), '渠道退款失败', transaction.failureReason, 'failed'],
        [transactionTimeOnly(addTransactionSeconds(requestedAt, 6)), '退款结果审核失败', renderTransactionAuditData({
          result: '失败',
          auditor: '李医生',
          auditedAt: addTransactionSeconds(requestedAt, 6),
          opinion: transaction.failureReason.replace(/^渠道返回：/, '')
        }), 'failed']
      );
      detailContent = [
        `<div class="transaction-detail-alert ${transactionStatusClass(transaction.status)}" role="status">${alertText}</div>`,
        renderOrderDetailSection('交易信息', transactionFields),
        renderTransactionOrderSection(transaction),
        renderOrderDetailSection('处理记录', [], renderOrderTimeline(refundTimeline))
      ].join('');
    }

    document.getElementById('restoredOrderTitle').textContent = transaction.type === '支付' ? '支付交易详情' : '退款交易详情';
    document.getElementById('restoredOrderContent').innerHTML = detailContent;
    document.getElementById('restoredOrderContent').scrollTop = 0;
    document.getElementById('restoredOrderMask').hidden = false;
    document.getElementById('restoredOrderDrawer').classList.add('active');
    document.getElementById('restoredOrderDrawer').setAttribute('aria-hidden', 'false');
  }

  function openOrderDetail(orderNo) {
    const row = orderRows.find(item => item[0] === orderNo);
    if (!row) return;
    const [number, packageName, buyer, patient, period, term, pay, time, status] = row;
    const noteDrawer = document.getElementById('restoredOrderDrawer');
    noteDrawer.dataset.noteScope = 'order-detail';
    noteDrawer.dataset.noteEntity = number;
    const titleMap = { 待使用: '订单详情', 生效中: '服务详情', 已完成: '服务记录', 待审核: '退款详情', 退款中: '退款进度', 已退款: '退款详情' };
    const patientName = ['待使用', '待审核', '退款中', '已退款'].includes(status) || patient === '--' ? '未绑定' : patient;
    const statusMarkup = `<span class="order-badge ${badgeClass(status)}">${status}</span>`;
    const serviceDates = term.includes('-') ? term.split('-') : ['绑定成功后开始', '绑定成功后计算'];
    const transactionNumber = `PAY${number.slice(2)}`;
    const channelPaymentNumber = `42000027492024${number.slice(2)}`;
    const fullContactNumber = `1380013${number.slice(-4)}`;
    const contactNumber = renderSensitiveValue(`${fullContactNumber.slice(0, 3)}****${fullContactNumber.slice(-4)}`, fullContactNumber, '联系电话');
    const isRefundOrder = ['待审核', '退款中', '已退款'].includes(status);
    const orderRefundNumber = `REF${number.slice(2)}`;
    const orderRefundAppliedAt = '2026/08/06 10:30';
    const orderRefundReviewedAt = '2026/08/06 10:31';
    const orderRefundSubmittedAt = '2026/08/06 10:31';
    const orderRefundProcessingAt = '2026/08/06 10:35';
    const orderRefundCompletedAt = status === '已退款' ? '2026/08/06 10:40' : '—';
    const orderRefundReason = {
      SO202407020006: '服务计划变更',
      SO202407010021: '误操作重复购买',
      SO202406300019: '暂时不需要',
      SO202406290017: '购买服务包有误'
    }[number] || '暂时不需要';
    const orderInformationGroups = [
      ['基础信息', [
        ['订单编号', number], ['订单状态', statusMarkup], ['服务包名称', packageName], ['服务周期', period],
        ['购买人', buyer], ['联系电话', contactNumber], ['下单时间', time]
      ]],
      ['支付信息', [
        ['订单金额', `${pay.toFixed(2)} 元`], ['实付金额', `${pay.toFixed(2)} 元`], ['支付渠道', '微信支付'],
        ['支付流水号', transactionNumber], ['渠道支付流水号', channelPaymentNumber, true], ['支付时间', addOrderTimelineMinutes(time, 1)]
      ]]
    ];
    if (isRefundOrder) orderInformationGroups.push(['退款信息', [
      ['退款状态', `<span class="order-badge ${badgeClass(status)}">${status}</span>`], ['退款单号', orderRefundNumber],
      ['原支付流水号', transactionNumber], ['渠道退款流水号', status === '已退款' ? '503000********' : '—'],
      ['退款金额', `${pay.toFixed(2)} 元`], ['退款原因', orderRefundReason], ['退款申请时间', orderRefundAppliedAt],
      ['退款完成时间', orderRefundCompletedAt], ['退款方式', '原支付路径退回'],
      ['退款去向', status === '已退款' ? '微信支付账户' : status === '待审核' ? '审核通过后原路退回' : '等待渠道处理'],
      ['渠道处理结果', status === '已退款' ? '退款成功' : status === '待审核' ? '尚未提交支付渠道' : '处理中']
    ]]);
    const introMap = {
      待使用: '用户已支付，但尚未绑定就诊人，服务未开始。',
      生效中: '已绑定就诊人，服务已经开始执行。',
      已完成: '服务周期结束或服务权益已经全部履行。',
      待审核: '用户已发起退款申请，等待医护人员审核。',
      退款中: '用户已经申请退款，退款请求正在支付渠道处理中。',
      已退款: '支付渠道已经确认退款成功，服务权益已失效。'
    };
    const purchaseQuantity = 1;
    const paidAt = addOrderTimelineMinutes(time, 1);
    const baseOperationRecords = [
      [time, '用户提交购买', `服务包：${packageName}<br>购买数量：${purchaseQuantity}份`],
      [paidAt, '支付成功', `支付金额：${(pay * purchaseQuantity).toFixed(2)}元<br>支付方式：微信支付`],
      [paidAt, '生成正式订单', `订单编号：${number}<br>实付金额：${pay.toFixed(2)}元`],
      [paidAt, '生成待使用权益', '权益状态：待使用']
    ];
    const refundReviewResult = orderRefundReviewResults.get(number);
    const waitingOperationRecords = refundReviewResult?.approved === false ? [
      ...baseOperationRecords,
      [orderRefundAppliedAt, '用户申请退款', `退款原因：${orderRefundReason}<br>退款金额：${pay.toFixed(2)}元`],
      [orderRefundAppliedAt, '退款申请待审核', '状态变化：待使用 → 待审核<br>待使用权益：已锁定<br>审核角色：医护人员'],
      [refundReviewResult.reviewedAt, '退款审核不通过', `审核人员：医护人员<br>审核结果：不通过<br>不通过原因：${refundReviewResult.reason}<br>状态变化：待审核 → 待使用`],
      [refundReviewResult.reviewedAt, '待使用权益解除锁定', '权益状态：待使用<br>服务包可继续绑定使用']
    ] : baseOperationRecords;
    let stateContent = '';

    if (status === '待使用') {
      stateContent = [
        renderOrderDetailSection('服务信息', [
          ['就诊人姓名', '--'], ['联系电话', '--'], ['绑定时间', '--'],
          ['服务状态', '未开始'], ['服务周期', period], ['生效规则', '绑定就诊人后立即生效'],
          ['服务开始时间', '--'], ['服务结束时间', '--'], ['健康管理团队', '--'], ['健康方案', '--'],
          ['健康负责人', '--', true]
        ]),
        renderOrderDetailSection('操作记录', [], renderOrderTimeline(waitingOperationRecords)),
        '<div class="order-permission-note">该服务包尚未绑定就诊人，绑定后立即生效并开始计算服务周期。</div>'
      ].join('');
    }

    if (status === '生效中') {
      const durationDays = Number.parseInt(period, 10) || 90;
      const boundAt = `${serviceDates[0]} 15:40`;
      const contentCreatedAt = addOrderTimelineMinutes(boundAt, 2);
      stateContent = [
        renderOrderDetailSection('服务信息', [
          ['就诊人姓名', patientName], ['联系电话', contactNumber], ['绑定时间', `${serviceDates[0]} 15:40`],
          ['服务状态', '<span class="order-badge active">生效中</span>'],
          ['服务周期', period], ['服务开始时间', serviceDates[0]], ['服务结束时间', serviceDates[1]], ['剩余服务天数', `${Math.max(1, durationDays - 19)}天`],
          ['健康管理团队', '慢病健康管理团队'], ['健康方案', `${packageName.replace('服务包', '')}方案`], ['健康负责人', '李敏']
        ]),
        renderOrderDetailSection('操作记录', [], renderOrderTimeline([
          ...baseOperationRecords,
          [boundAt, '用户绑定就诊人', `就诊人：${patientName}`],
          [boundAt, '服务正式生效', `状态变化：待使用 → 生效中<br>服务周期：${serviceDates[0]}—${serviceDates[1]}`],
          [contentCreatedAt, '服务内容创建完成', `健康方案：${packageName.replace('服务包', '')}方案<br>健康任务：已生成12项<br>服务团队：慢病健康管理团队`],
          [`最近更新：${serviceDates[0]} 17:30`, '服务执行中', '已完成任务：8/12<br>已完成随访：3次']
        ])),
        '<div class="order-permission-note">服务已经生效，当前版本不支持用户自行退款，如有特殊情况请联系客服处理。</div>'
      ].join('');
    }

    if (status === '已完成') {
      const boundAt = `${serviceDates[0]} 09:00`;
      const contentCreatedAt = addOrderTimelineMinutes(boundAt, 2);
      stateContent = [
        renderOrderDetailSection('服务信息', [
          ['就诊人姓名', patientName], ['联系电话', contactNumber], ['绑定时间', `${serviceDates[0]} 09:00`],
          ['服务状态', '<span class="order-badge done">已完成</span>'], ['服务周期', period], ['服务开始时间', serviceDates[0]],
          ['服务结束时间', serviceDates[1]], ['实际完成时间', `${serviceDates[1]} 18:00`], ['完成方式', '服务到期'],
          ['健康管理团队', '慢病健康管理团队'], ['健康方案', `${packageName.replace('服务包', '')}方案`], ['健康负责人', '李敏'],
          ['服务权益完成情况', '全部权益已履行']
        ]),
        renderOrderDetailSection('操作记录', [], renderOrderTimeline([
          ...baseOperationRecords,
          [boundAt, '用户绑定就诊人', `就诊人：${patientName}`],
          [boundAt, '服务正式生效', `状态变化：待使用 → 生效中<br>服务周期：${serviceDates[0]}—${serviceDates[1]}`],
          [contentCreatedAt, '服务内容创建完成', `健康方案：${packageName.replace('服务包', '')}方案<br>健康任务：已生成12项<br>服务团队：慢病健康管理团队`],
          [`最近更新：${serviceDates[1]} 18:00`, '服务执行中', '已完成任务：12/12<br>已完成随访：3次'],
          [`${serviceDates[1]} 23:59`, '服务完成', '操作主体：系统<br>状态变化：生效中 → 已完成<br>完成方式：服务周期结束']
        ])),
        '<div class="order-permission-note">服务已完成，相关健康档案、任务记录和服务记录继续保留。</div>'
      ].join('');
    }

    if (status === '待审核') {
      stateContent = [
        renderOrderDetailSection('服务信息', [
          ['就诊人姓名', '--'], ['联系电话', '--'], ['绑定时间', '--'],
          ['服务状态', '退款待审核，权益已锁定'], ['服务周期', period], ['服务开始时间', '--'], ['服务结束时间', '--'],
          ['健康管理团队', '--'], ['健康方案', '--'], ['健康负责人', '--', true]
        ]),
        renderOrderDetailSection('操作记录', [], renderOrderTimeline([
          ...baseOperationRecords,
          [orderRefundAppliedAt, '用户申请退款', `退款原因：${orderRefundReason}<br>退款金额：${pay.toFixed(2)}元`],
          [orderRefundAppliedAt, '退款申请待审核', `状态变化：待使用 → 待审核<br>待使用权益：已锁定<br>审核角色：医护人员`]
        ])),
        '<div class="order-permission-note">用户已发起退款申请，需医护人员审核；审核通过后才会提交支付渠道退款。</div>',
        `<div class="order-review-panel" data-order-review-panel data-order-no="${number}">
          <span class="order-review-label">审核结果</span>
          <div class="order-review-options" role="radiogroup" aria-label="审核结果">
            <label class="order-review-option"><input data-order-review-decision type="radio" name="orderReviewDecision" value="approve">审核通过</label>
            <label class="order-review-option"><input data-order-review-decision type="radio" name="orderReviewDecision" value="reject">审核不通过</label>
          </div>
          <span class="order-review-error" data-order-review-decision-error hidden>请选择审核结果</span>
          <div class="order-review-reject-form" data-order-review-reject-form hidden>
            <label for="orderReviewRejectReason">不通过原因</label><textarea id="orderReviewRejectReason" data-order-review-reject-reason maxlength="200" placeholder="请输入审核不通过原因"></textarea><span class="order-review-error" data-order-review-error hidden>请填写审核不通过原因</span>
          </div>
          <div class="order-review-footer">
            <label class="order-review-next"><input data-order-review-next type="checkbox">审核完成后自动打开下一条待审核订单</label>
            <div class="order-review-buttons"><button class="order-review-button" data-order-review-action="cancel" type="button">取消</button><button class="order-review-button primary" data-order-review-action="confirm" type="button">确定</button></div>
          </div>
        </div>`
      ].join('');
    }

    if (status === '退款中') {
      stateContent = [
        renderOrderDetailSection('服务信息', [
          ['就诊人姓名', '--'], ['联系电话', '--'], ['绑定时间', '--'],
          ['服务状态', '退款处理中，权益已锁定'], ['服务周期', period], ['服务开始时间', '--'], ['服务结束时间', '--'],
          ['健康管理团队', '--'], ['健康方案', '--'], ['健康负责人', '--', true]
        ]),
        renderOrderDetailSection('操作记录', [], renderOrderTimeline([
          ...baseOperationRecords,
          [orderRefundAppliedAt, '用户申请退款', `退款原因：${orderRefundReason}<br>退款金额：${pay.toFixed(2)}元`],
          [orderRefundAppliedAt, '退款申请待审核', '状态变化：待使用 → 待审核<br>待使用权益：已锁定<br>审核角色：医护人员'],
          [orderRefundReviewedAt, '退款审核通过', '审核人员：医护人员<br>审核结果：通过<br>状态变化：待审核 → 退款中'],
          [orderRefundReviewedAt, '退款申请已受理', `退款单号：${orderRefundNumber}<br>待使用权益：已锁定`],
          [orderRefundSubmittedAt, '提交渠道退款', '退款方式：原支付路径退回'],
          [`最近更新：${orderRefundProcessingAt}`, '渠道退款处理中', '处理结果：等待支付渠道确认']
        ])),
                    '<div class="order-permission-note">退款正在处理中，退款完成前该服务包暂不可绑定或使用。</div>'
      ].join('');
    }

    if (status === '已退款') {
      stateContent = [
        renderOrderDetailSection('服务信息', [
          ['就诊人姓名', '--'], ['联系电话', '--'], ['绑定时间', '--'],
          ['服务状态', '已失效'], ['服务周期', period], ['服务开始时间', '--'], ['服务结束时间', '--'],
          ['健康管理团队', '--'], ['健康方案', '--'], ['健康负责人', '--'], ['服务权益状态', '已作废']
        ]),
        renderOrderDetailSection('操作记录', [], renderOrderTimeline([
          ...baseOperationRecords,
          [orderRefundAppliedAt, '用户申请退款', `退款原因：${orderRefundReason}<br>退款金额：${pay.toFixed(2)}元`],
          [orderRefundAppliedAt, '退款申请待审核', '状态变化：待使用 → 待审核<br>待使用权益：已锁定<br>审核角色：医护人员'],
          [orderRefundReviewedAt, '退款审核通过', '审核人员：医护人员<br>审核结果：通过<br>状态变化：待审核 → 退款中'],
          [orderRefundReviewedAt, '退款申请已受理', `退款单号：${orderRefundNumber}<br>待使用权益：已锁定`],
          [orderRefundSubmittedAt, '提交渠道退款', '退款方式：原支付路径退回'],
          [`最近更新：${orderRefundProcessingAt}`, '渠道退款处理中', '处理结果：等待支付渠道确认'],
          [orderRefundCompletedAt, '渠道退款成功', `退款金额：${pay.toFixed(2)}元<br>渠道退款流水号：503000********`],
          [orderRefundCompletedAt, '待使用权益作废', '权益状态：已失效'],
          [orderRefundCompletedAt, '订单退款完成', '状态变化：退款中 → 已退款<br>退款方式：原支付路径退回']
        ])),
        '<div class="order-permission-note">退款已按原支付路径退回，具体到账时间以支付渠道为准。</div>'
      ].join('');
    }

    document.getElementById('restoredOrderTitle').textContent = titleMap[status] || '订单详情';
    document.getElementById('restoredOrderContent').innerHTML = `<div class="order-detail-intro">${introMap[status] || ''}</div>${renderOrderInformation(orderInformationGroups)}${stateContent}`;
    document.getElementById('restoredOrderContent').scrollTop = 0;
    document.getElementById('restoredOrderMask').hidden = false;
    document.getElementById('restoredOrderDrawer').classList.add('active');
    document.getElementById('restoredOrderDrawer').setAttribute('aria-hidden', 'false');
  }

  function completeOrderRefundReview(orderNo, approved, reason, openNext) {
    const order = orderRows.find(item => item[0] === orderNo);
    if (!order || order[8] !== '待审核') return;
    orderRefundReviewResults.set(orderNo, { approved, reason, reviewedAt: '2026/08/06 10:31' });
    const nextStatus = approved ? '退款中' : '待使用';
    order[8] = nextStatus;
    const detailButton = document.querySelector(`[data-order-detail="${orderNo}"]`);
    const tableRow = detailButton?.closest('[data-order-row]');
    if (tableRow) {
      tableRow.dataset.orderStatus = nextStatus;
      tableRow.dataset.orderSearch = order.join(' ');
      const badge = tableRow.querySelector('.order-badge');
      if (badge) {
        badge.className = `order-badge ${badgeClass(nextStatus)}`;
        badge.textContent = nextStatus;
      }
      if (detailButton) detailButton.textContent = approved ? '退款进度' : '订单详情';
    }
    if (!approved) tableRow?.setAttribute('data-review-reject-reason', reason);
    applyOrderFilter(false);
    const nextOrder = openNext ? orderRows.find(item => item[8] === '待审核') : null;
    if (nextOrder) openOrderDetail(nextOrder[0]);
    else closeOrderDetail();
    showPackageToast(approved ? '审核已通过，退款申请进入渠道处理' : '审核不通过，待使用权益已解除锁定');
  }

  function closeOrderDetail() {
    document.getElementById('restoredOrderMask').hidden = true;
    document.getElementById('restoredOrderDrawer').classList.remove('active');
    document.getElementById('restoredOrderDrawer').setAttribute('aria-hidden', 'true');
  }

  let pendingPackageDialogAction = null;

  function getPackageData(code) {
    return servicePackageRows.find(item => item[0] === code);
  }

  function showPackageToast(text) {
    document.querySelector('.package-editor-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'package-editor-toast';
    toast.textContent = text;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1800);
  }

  let packageAntSelectId = 0;

  function closePackageAntSelects(except = null) {
    document.querySelectorAll('.package-ant-select.open').forEach(wrapper => {
      if (wrapper === except) return;
      wrapper.classList.remove('open');
      const trigger = wrapper.querySelector('[data-package-ant-select-trigger]');
      const dropdown = wrapper.querySelector('[data-package-ant-select-dropdown]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (dropdown) dropdown.hidden = true;
    });
  }

  function syncPackageAntSelect(select) {
    const wrapper = select?.closest('.package-ant-select');
    if (!wrapper) return;
    const trigger = wrapper.querySelector('[data-package-ant-select-trigger]');
    const value = wrapper.querySelector('.package-ant-select-value');
    const selected = select.options[select.selectedIndex];
    wrapper.classList.toggle('placeholder', /^请选择/.test(selected?.textContent || ''));
    if (value) value.textContent = selected?.textContent || '';
    if (trigger) trigger.disabled = select.disabled;
    wrapper.querySelectorAll('[data-package-ant-option]').forEach(option => {
      const isSelected = Number(option.dataset.packageAntOption) === select.selectedIndex;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-selected', String(isSelected));
    });
  }

  function rebuildPackageAntSelect(select) {
    const wrapper = select?.closest('.package-ant-select');
    const dropdown = wrapper?.querySelector('[data-package-ant-select-dropdown]');
    if (!dropdown) return;
    dropdown.replaceChildren();
    Array.from(select.options).forEach((option, index) => {
      const item = document.createElement('button');
      item.className = 'package-ant-select-option';
      item.type = 'button';
      item.setAttribute('role', 'option');
      item.dataset.packageAntOption = String(index);
      item.textContent = option.textContent;
      item.disabled = option.disabled;
      dropdown.appendChild(item);
    });
    syncPackageAntSelect(select);
  }

  function enhancePackageSelects() {
    document.querySelectorAll('#packageEditorOverlay select').forEach(select => {
      if (select.closest('.package-ant-select')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'package-ant-select';
      const listboxId = `packageAntSelectList${++packageAntSelectId}`;
      const label = select.getAttribute('aria-label') || select.closest('.package-form-group')?.querySelector('.package-form-label')?.textContent.trim() || select.closest('.package-agreement-item')?.querySelector('strong')?.textContent.trim() || '请选择';
      const trigger = document.createElement('button');
      trigger.className = 'package-ant-select-selector';
      trigger.type = 'button';
      trigger.dataset.packageAntSelectTrigger = '';
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-label', label);
      trigger.setAttribute('aria-controls', listboxId);
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = '<span class="package-ant-select-value"></span><svg class="package-ant-select-arrow" viewBox="0 0 12 12" aria-hidden="true"><path d="m2.2 4.2 3.8 3.6 3.8-3.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const dropdown = document.createElement('div');
      dropdown.className = 'package-ant-select-dropdown';
      dropdown.id = listboxId;
      dropdown.dataset.packageAntSelectDropdown = '';
      dropdown.setAttribute('role', 'listbox');
      dropdown.setAttribute('aria-label', label);
      dropdown.hidden = true;
      select.parentNode.insertBefore(wrapper, select);
      select.classList.add('package-ant-select-native');
      select.tabIndex = -1;
      select.setAttribute('aria-hidden', 'true');
      wrapper.append(select, trigger, dropdown);
      rebuildPackageAntSelect(select);
    });
  }

  const defaultPackageFrequencyHistory = ['服务期内1次', '服务期内持续', '每月1次', '每周1次', '12次/年', '全年持续'];

  function getPackageFrequencyHistory() {
    try {
      const stored = JSON.parse(window.localStorage.getItem('servicePackageFrequencyHistory') || '[]');
      return Array.from(new Set([...stored.filter(value => typeof value === 'string' && value.trim()), ...defaultPackageFrequencyHistory])).slice(0, 8);
    } catch {
      return [...defaultPackageFrequencyHistory];
    }
  }

  function rememberPackageFrequency(value) {
    const normalized = String(value || '').trim();
    if (!normalized) return;
    const history = [normalized, ...getPackageFrequencyHistory().filter(item => item !== normalized)].slice(0, 8);
    try { window.localStorage.setItem('servicePackageFrequencyHistory', JSON.stringify(history)); } catch {}
    refreshPackageFrequencyOptions();
  }

  function refreshPackageFrequencyOptions() {
    document.querySelectorAll('[data-package-frequency-dropdown]').forEach(dropdown => {
      const current = dropdown.closest('[data-package-frequency-combobox]')?.querySelector('[data-benefit-frequency]')?.value || '';
      dropdown.replaceChildren();
      const title = document.createElement('div');
      title.className = 'package-frequency-dropdown-title';
      title.textContent = '历史记录';
      dropdown.appendChild(title);
      getPackageFrequencyHistory().forEach(value => {
        const option = document.createElement('button');
        option.className = `package-ant-select-option${value === current ? ' selected' : ''}`;
        option.type = 'button';
        option.dataset.packageFrequencyOption = value;
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', String(value === current));
        option.textContent = value;
        dropdown.appendChild(option);
      });
    });
  }

  function closePackageFrequencyDropdowns(except = null) {
    document.querySelectorAll('[data-package-frequency-combobox].open').forEach(control => {
      if (control === except) return;
      control.classList.remove('open');
      const input = control.querySelector('[data-benefit-frequency]');
      const dropdown = control.querySelector('[data-package-frequency-dropdown]');
      if (input) input.setAttribute('aria-expanded', 'false');
      if (dropdown) dropdown.hidden = true;
    });
  }

  function openPackageFrequencyDropdown(control) {
    if (!control) return;
    closePackageFrequencyDropdowns(control);
    refreshPackageFrequencyOptions();
    control.classList.add('open');
    const input = control.querySelector('[data-benefit-frequency]');
    const dropdown = control.querySelector('[data-package-frequency-dropdown]');
    if (input) input.setAttribute('aria-expanded', 'true');
    if (dropdown) dropdown.hidden = false;
  }

  function getPackageTags() {
    return Array.from(document.querySelectorAll('[data-package-tag]'));
  }

  function refreshPackageTagState() {
    const tags = getPackageTags();
    const selected = tags.filter(tag => tag.classList.contains('active')).length;
    const addButton = document.querySelector('[data-add-package-tag]');
    const editor = document.querySelector('[data-package-tag-editor]');
    const status = document.getElementById('packageTagStatus');
    if (status) status.textContent = `已选 ${selected}/3 · 共 ${tags.length}/10`;
    if (addButton) addButton.hidden = tags.length >= 10;
    if (tags.length >= 10 && editor) editor.hidden = true;
  }

  function closePackageTagEditor() {
    const editor = document.querySelector('[data-package-tag-editor]');
    const input = document.getElementById('packageCustomTagInput');
    if (editor) editor.hidden = true;
    if (input) input.value = '';
  }

  function openPackageTagEditor() {
    if (getPackageTags().length >= 10) return;
    const editor = document.querySelector('[data-package-tag-editor]');
    const input = document.getElementById('packageCustomTagInput');
    if (!editor || !input) return;
    editor.hidden = false;
    input.focus();
  }

  function addCustomPackageTag() {
    const input = document.getElementById('packageCustomTagInput');
    const list = document.getElementById('packageTagList');
    const addButton = document.querySelector('[data-add-package-tag]');
    const value = (input?.value || '').trim();
    const tags = getPackageTags();
    if (!value) {
      showPackageToast('请输入标签内容');
      input?.focus();
      return;
    }
    if (tags.some(tag => tag.querySelector('[data-package-tag-label]')?.textContent.trim().toLowerCase() === value.toLowerCase())) {
      showPackageToast('该关键词标签已存在');
      input?.focus();
      return;
    }
    if (tags.length >= 10 || !list || !addButton) {
      showPackageToast('关键词标签最多添加 10 个');
      refreshPackageTagState();
      return;
    }
    const tag = document.createElement('button');
    tag.className = 'package-tag';
    tag.dataset.packageTag = '';
    tag.type = 'button';
    const label = document.createElement('span');
    label.dataset.packageTagLabel = '';
    label.textContent = value;
    const remove = document.createElement('i');
    remove.className = 'package-tag-remove';
    remove.dataset.removePackageTag = '';
    remove.title = '删除标签';
    remove.textContent = '×';
    tag.append(label, remove);
    if (tags.filter(item => item.classList.contains('active')).length < 3) tag.classList.add('active');
    else showPackageToast('标签已添加；最多同时选中 3 个');
    list.insertBefore(tag, document.querySelector('[data-package-tag-editor]'));
    closePackageTagEditor();
    refreshPackageTagState();
    updatePackagePreview();
  }

  function closePackageMoreMenu() {
    const menu = document.getElementById('packageMoreMenu');
    if (!menu) return;
    menu.hidden = true;
    document.querySelectorAll('[data-package-more][aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
  }

  function openPackageMoreMenu(button) {
    const menu = document.getElementById('packageMoreMenu');
    const code = button.dataset.packageMore;
    const row = document.querySelector(`[data-package-row][data-package-code="${code}"]`);
    const pending = row?.dataset.packageStatus !== '已上架';
    menu.innerHTML = `
      <button type="button" role="menuitem" data-package-action="share" data-package-code="${code}">分享</button>
      <button type="button" role="menuitem" data-package-action="shelf" data-package-code="${code}">${pending ? '上架' : '下架'}</button>
      <button type="button" role="menuitem" data-package-action="edit" data-package-code="${code}">编辑</button>
      <button class="danger" type="button" role="menuitem" data-package-action="delete" data-package-code="${code}">删除</button>`;
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    const rect = button.getBoundingClientRect();
    const width = 108;
    menu.style.left = `${Math.min(window.innerWidth - width - 12, Math.max(12, rect.right - width))}px`;
    menu.style.top = `${Math.min(window.innerHeight - 154, rect.bottom + 8)}px`;
  }

  function renderPackageSubscribers(keyword = packageRecordState.keyword) {
    const content = document.getElementById('packageRecordContent');
    const list = content?.querySelector('[data-package-service-record-list]');
    const footer = content?.querySelector('[data-package-record-footer]');
    if (!list || !footer) return;
    packageRecordState.keyword = String(keyword || '').trim();
    const normalized = packageRecordState.keyword.toLowerCase();
    const statusRecords = currentPackageServiceRecords.filter(record => packageRecordState.status === '全部' || record.status === packageRecordState.status);
    const filtered = statusRecords
      .filter(record => !normalized || record.name.toLowerCase().includes(normalized))
      .sort((a, b) => {
        const statusOrder = { '生效中': 0, '已完成': 1 };
        const statusDifference = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
        if (statusDifference !== 0) return statusDifference;
        return b.boundAt.localeCompare(a.boundAt, 'zh-CN');
      });
    const totalPages = Math.max(1, Math.ceil(filtered.length / packageRecordState.pageSize));
    packageRecordState.page = Math.min(Math.max(1, packageRecordState.page), totalPages);
    const start = (packageRecordState.page - 1) * packageRecordState.pageSize;
    const pageRecords = filtered.slice(start, start + packageRecordState.pageSize);
    list.innerHTML = pageRecords.map(record => {
      const completed = record.status === '已完成';
      return `<article class="package-service-record${completed ? ' completed' : ' active'}">
        <div class="package-service-record-top"><span class="package-avatar">${record.initials}</span><div class="package-service-person"><div class="package-service-name">${record.name}<span>${record.gender}｜${record.age}岁</span></div></div><span class="package-service-status${completed ? ' completed' : ''}">${record.status}</span></div>
        <div class="package-service-meta"><div><strong>服务周期：</strong>${record.start}－${record.end}</div>${completed ? `<div><strong>完成时间：</strong>${record.completedAt}</div>` : `<div><strong>剩余${record.remaining}天</strong>｜绑定时间：${record.boundAt}</div>`}</div>
        <div class="package-service-action"><button class="package-profile-link" data-package-profile="${record.id}" data-package-code="${packageRecordState.code}" type="button">查看档案 &gt;</button></div>
      </article>`;
    }).join('');
    if (!pageRecords.length) list.innerHTML = `<div class="package-record-empty"><strong>暂无符合条件的服务记录</strong><span>请调整就诊人信息或服务状态后重新查询</span></div>`;
    footer.innerHTML = `<span>共 ${filtered.length} 条</span><div class="package-record-pagination"><button data-package-record-page="prev" type="button" aria-label="上一页" ${packageRecordState.page <= 1 ? 'disabled' : ''}>‹</button><span class="package-record-page">${packageRecordState.page} / ${totalPages}页</span><button data-package-record-page="next" type="button" aria-label="下一页" ${packageRecordState.page >= totalPages ? 'disabled' : ''}>›</button></div>`;
    content.querySelectorAll('[data-package-record-status]').forEach(button => {
      const active = button.dataset.packageRecordStatus === packageRecordState.status;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-selected', String(active));
    });
  }

  function openPackageSubscriptions(code) {
    const item = getPackageData(code);
    if (!item) return;
    const [, , name, , period] = item;
    currentPackageServiceRecords = buildPackageServiceRecords(item);
    packageRecordState = { code, keyword: '', status: '全部', page: 1, pageSize: 10 };
    const activeCount = currentPackageServiceRecords.filter(record => record.status === '生效中').length;
    const completedCount = currentPackageServiceRecords.length - activeCount;
    document.getElementById('packageRecordContent').innerHTML = `
      <section class="package-record-summary"><h3>${name}</h3><div class="package-record-code">服务包编号：${code}｜服务周期：${period}</div></section>
      <label class="package-record-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input id="packageSubscriberSearch" autocomplete="off" aria-label="按就诊人姓名搜索服务记录" placeholder="请输入就诊人姓名"></label>
      <div class="package-record-tabs" role="tablist" aria-label="服务状态"><button class="package-record-tab active" data-package-record-status="全部" type="button" role="tab"><span>全部</span><strong>${currentPackageServiceRecords.length}</strong></button><button class="package-record-tab" data-package-record-status="生效中" type="button" role="tab"><span>生效中</span><strong>${activeCount}</strong></button><button class="package-record-tab" data-package-record-status="已完成" type="button" role="tab"><span>已完成</span><strong>${completedCount}</strong></button></div>
      <div class="package-record-list" data-package-service-record-list></div><div class="package-record-footer" data-package-record-footer></div>`;
    renderPackageSubscribers();
    document.getElementById('packageRecordMask').hidden = false;
    const drawer = document.getElementById('packageRecordDrawer');
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePackageSubscriptions() {
    document.getElementById('packageRecordMask').hidden = true;
    const drawer = document.getElementById('packageRecordDrawer');
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    if (document.getElementById('packageEditorOverlay')?.hidden !== false) document.body.style.overflow = '';
  }

  function closePackageDialog() {
    document.getElementById('packageDialogMask').hidden = true;
    document.getElementById('packageActionDialog').hidden = true;
    pendingPackageDialogAction = null;
  }

  function openPackageDialog({ title, text = '', body = '', confirmLabel = '确认', danger = false, onConfirm = null }) {
    document.getElementById('packageDialogTitle').textContent = title;
    document.getElementById('packageDialogText').textContent = text;
    document.getElementById('packageDialogBody').innerHTML = body;
    const confirm = document.getElementById('packageDialogConfirm');
    confirm.textContent = confirmLabel;
    confirm.classList.toggle('danger', danger);
    confirm.classList.toggle('primary', !danger);
    pendingPackageDialogAction = onConfirm;
    document.getElementById('packageDialogMask').hidden = false;
    document.getElementById('packageActionDialog').hidden = false;
  }

  function drawPackageShareQr(value) {
    const canvas = document.getElementById('packageShareQr');
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const size = 29;
    const quiet = 2;
    const moduleSize = Math.floor(canvas.width / (size + quiet * 2));
    const offset = Math.floor((canvas.width - moduleSize * (size + quiet * 2)) / 2) + quiet * moduleSize;
    let seed = Array.from(value).reduce((total, character, index) => (total + character.charCodeAt(0) * (index + 17)) >>> 0, 2166136261);
    const nextBit = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return seed & 1;
    };
    const modules = Array.from({ length: size }, () => Array(size).fill(false));
    const reserved = Array.from({ length: size }, () => Array(size).fill(false));
    const addFinder = (startX, startY) => {
      for (let y = -1; y <= 7; y += 1) for (let x = -1; x <= 7; x += 1) {
        const px = startX + x;
        const py = startY + y;
        if (px < 0 || py < 0 || px >= size || py >= size) continue;
        reserved[py][px] = true;
        modules[py][px] = x >= 0 && x <= 6 && y >= 0 && y <= 6 && (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4));
      }
    };
    addFinder(0, 0);
    addFinder(size - 7, 0);
    addFinder(0, size - 7);
    for (let index = 8; index < size - 8; index += 1) {
      reserved[6][index] = true;
      reserved[index][6] = true;
      modules[6][index] = index % 2 === 0;
      modules[index][6] = index % 2 === 0;
    }
    for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) if (!reserved[y][x]) modules[y][x] = Boolean(nextBit());
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#050505';
    modules.forEach((row, y) => row.forEach((filled, x) => { if (filled) context.fillRect(offset + x * moduleSize, offset + y * moduleSize, moduleSize, moduleSize); }));
  }

  function openPackageShareDialog(item) {
    const shareUrl = `${location.origin}${location.pathname}#service-package-${item[0]}`;
    document.getElementById('packageShareName').textContent = item[2];
    document.getElementById('packageShareLink').value = shareUrl;
    document.getElementById('packageShareDialog').dataset.packageCode = item[0];
    drawPackageShareQr(shareUrl);
    document.getElementById('packageShareMask').hidden = false;
    document.getElementById('packageShareDialog').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closePackageShareDialog() {
    document.getElementById('packageShareMask').hidden = true;
    document.getElementById('packageShareDialog').hidden = true;
    if (document.getElementById('packageEditorOverlay')?.hidden === false || document.getElementById('packageRecordDrawer')?.getAttribute('aria-hidden') === 'false') return;
    document.body.style.overflow = '';
  }

  async function copyPackageShareLink() {
    const input = document.getElementById('packageShareLink');
    try {
      await navigator.clipboard.writeText(input.value);
      showPackageToast('分享链接已复制');
    } catch (error) {
      input.select();
      document.execCommand('copy');
      showPackageToast('分享链接已复制');
    }
  }

  function downloadPackageShareQr() {
    const canvas = document.getElementById('packageShareQr');
    const code = document.getElementById('packageShareDialog').dataset.packageCode || 'service-package';
    const link = document.createElement('a');
    link.download = `服务包-${code}-二维码.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showPackageToast('二维码已下载');
  }

  function copyPackageShareQr() {
    const canvas = document.getElementById('packageShareQr');
    canvas.toBlob(async blob => {
      try {
        if (!blob || !navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('unsupported');
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showPackageToast('二维码图片已复制');
      } catch (error) {
        showPackageToast('当前环境无法复制图片，请使用下载');
      }
    }, 'image/png');
  }

  function openSubscriberProfile(recordId, code) {
    const record = currentPackageServiceRecords.find(item => item.id === recordId);
    const item = getPackageData(code);
    if (!record || !item) return;
    const active = record.status === '生效中';
    const sections = active ? [
      ['服务权益', '健康档案、个性化健康管理计划、全程健康守护'],
      ['健康方案', item[6]],
      ['健康任务', '体重记录、饮食打卡、运动任务与阶段评估'],
      ['服务执行情况', `已执行 18 项，待执行 6 项，当前完成率 75%`],
      ['服务时间', `${record.start}－${record.end}`]
    ] : [
      ['历史健康方案', item[6]],
      ['历史健康任务', '累计完成 36 项健康任务，全部按计划结束'],
      ['权益执行汇总', '健康档案 1 次、健康评估 2 次、线上随访 6 次'],
      ['随访和评估记录', '已完成阶段随访、结项评估及健康指标复盘'],
      ['服务总结', `服务于 ${record.completedAt} 完成，目标达成情况良好`]
    ];
    openPackageDialog({
      title: `${record.name}的服务档案`,
      text: `${item[2]}｜${record.gender}｜${record.age}岁｜${record.status}`,
      body: `<div class="service-detail-sections">${sections.map(([label, value]) => `<div class="service-detail-section"><span>${label}</span><strong>${value}</strong></div>`).join('')}</div>`,
      confirmLabel: '关闭',
      onConfirm: closePackageDialog
    });
  }

  function updatePackageFooterCount() {
    applyPackageFilter();
  }

  function handlePackageAction(action, code) {
    const item = getPackageData(code);
    const row = document.querySelector(`[data-package-row][data-package-code="${code}"]`);
    if (!item || !row) return;
    closePackageMoreMenu();
    if (action === 'share') {
      openPackageShareDialog(item);
    }
    if (action === 'shelf') {
      const isPending = item[8] !== '已上架';
      openPackageDialog({ title: isPending ? '确认上架服务包' : '确认下架服务包', text: isPending ? '上架后，C端用户可以查看并订阅该服务包。' : '下架后，服务包将变为待上架状态，C端停止展示和新订阅。', confirmLabel: isPending ? '确认上架' : '确认下架', danger: !isPending, onConfirm: () => {
        item[8] = isPending ? '已上架' : '待上架';
        const status = row.querySelector('.package-status');
        status.textContent = item[8];
        status.classList.toggle('pending', !isPending);
        row.dataset.packageStatus = item[8];
        closePackageDialog();
        applyPackageFilter();
        showPackageToast(`服务包已${isPending ? '上架' : '转为待上架'}`);
      } });
    }
    if (action === 'edit') openPackageEditor(item);
    if (action === 'delete') {
      openPackageDialog({ title: '删除服务包', text: `删除“${item[2]}”后将无法恢复，历史订单与服务记录仍会保留。`, confirmLabel: '确认删除', danger: true, onConfirm: () => {
        row.remove();
        const index = servicePackageRows.indexOf(item);
        if (index >= 0) servicePackageRows.splice(index, 1);
        updatePackageFooterCount();
        closePackageDialog();
        showPackageToast('服务包已删除');
      } });
    }
  }

  function setPackageCover(source = '', fileName = '') {
    const overlay = document.getElementById('packageEditorOverlay');
    const preview = document.getElementById('packagePreviewCover');
    const thumb = document.getElementById('packageCoverThumb');
    const empty = document.getElementById('packageUploadEmpty');
    const replace = document.getElementById('packageUploadReplace');
    const remove = document.querySelector('[data-remove-package-cover]');
    const meta = document.getElementById('packageCoverMeta');
    if (!overlay || !preview || !thumb || !empty || !replace || !remove || !meta) return;
    overlay.dataset.coverSource = source;
    overlay.dataset.coverName = fileName;
    preview.src = source || defaultPackageCover;
    preview.classList.toggle('is-default', !source);
    thumb.src = source || '';
    thumb.hidden = !source;
    empty.hidden = !!source;
    replace.hidden = !source;
    remove.hidden = !source;
    meta.textContent = source ? `${fileName || '已上传封面'} · 已同步到C端预览` : '建议 750×420px，JPG/PNG/WebP，5MB以内';
  }

  function handlePackageCoverFile(file) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showPackageToast('请选择 JPG、PNG 或 WebP 图片');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showPackageToast('封面图片不能超过 5MB');
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => setPackageCover(String(reader.result || ''), file.name));
    reader.addEventListener('error', () => showPackageToast('封面读取失败，请重新选择'));
    reader.readAsDataURL(file);
  }

  function readPackagePeriod() {
    const manual = document.querySelector('[data-manual-period]');
    if (manual?.classList.contains('active')) {
      const rawValue = Number(document.getElementById('packageCustomDurationValue')?.value);
      const value = Math.min(3650, Math.max(1, Number.isFinite(rawValue) && rawValue > 0 ? Math.round(rawValue) : 30));
      const unit = document.getElementById('packageCustomDurationUnit')?.value || '天';
      return `${value}${unit === '月' ? '个月' : unit}`;
    }
    const active = document.querySelector('.package-duration [data-package-duration].active');
    return active?.textContent.trim() || '1个月';
  }

  function activateManualPackagePeriod() {
    document.querySelectorAll('.package-duration [data-package-duration]').forEach(button => button.classList.remove('active'));
    document.querySelector('[data-manual-period]')?.classList.add('active');
  }

  function updateBenefitCount() {
    const count = document.querySelectorAll('[data-benefit-editor]').length;
    const countText = document.getElementById('packageBenefitCount');
    if (countText) countText.textContent = `${count}个服务权益`;
  }

  function updatePackageBenefitsPreview() {
    const container = document.getElementById('packagePreviewBenefitRows');
    if (!container) return;
    container.replaceChildren();
    const groups = new Map();
    document.querySelectorAll('[data-benefit-editor]').forEach(editor => {
      const title = editor.querySelector('[data-benefit-title]')?.value.trim() || '未命名权益';
      const description = editor.querySelector('[data-benefit-description]')?.value.trim() || '暂无权益说明';
      if (!groups.has(title)) groups.set(title, { description, items: [] });
      else if (description && description !== '暂无权益说明') groups.get(title).description = description;
      editor.querySelectorAll('[data-benefit-content]').forEach(contentRow => {
        const content = contentRow.querySelector('[data-benefit-content-name]')?.value.trim() || description || '请配置服务内容';
        const frequency = contentRow.querySelector('[data-benefit-frequency]')?.value || '--';
        groups.get(title).items.push({ content, frequency });
      });
    });
    groups.forEach((groupData, title) => {
      const { description, items } = groupData;
      if (!items.length) items.push({ content: '请配置服务内容', frequency: '--' });
      const group = document.createElement('div');
      group.className = 'package-benefit-group';
      const name = document.createElement('span');
      name.className = 'package-benefit-name';
      name.style.gridRow = `1 / span ${items.length}`;
      const nameTitle = document.createElement('strong');
      nameTitle.textContent = title;
      const nameDescription = document.createElement('small');
      nameDescription.textContent = description || '暂无权益说明';
      name.append(nameTitle, nameDescription);
      group.appendChild(name);
      items.forEach((item, index) => {
        const detail = document.createElement('span');
        detail.className = `package-benefit-detail${index ? ' divider' : ''}`;
        detail.style.gridRow = String(index + 1);
        detail.textContent = item.content;
        const frequency = document.createElement('span');
        frequency.className = `package-benefit-frequency${index ? ' divider' : ''}`;
        frequency.style.gridRow = String(index + 1);
        frequency.textContent = item.frequency;
        group.append(detail, frequency);
      });
      container.appendChild(group);
    });
    if (!container.children.length) {
      const row = document.createElement('div');
      row.className = 'package-benefit-row';
      ['暂无权益', '请在右侧添加服务权益', '--'].forEach(value => {
        const cell = document.createElement('span');
        cell.textContent = value;
        row.appendChild(cell);
      });
      container.appendChild(row);
    }
    updateBenefitCount();
  }

  function updatePackageRulesPreview() {
    const source = document.getElementById('packageRulesInput')?.value || '';
    const preview = document.getElementById('packagePreviewRules');
    if (!preview) return;
    const rules = source.split(/\r?\n/).map(rule => rule.replace(/^\s*\d+[.、]\s*/, '').trim()).filter(Boolean);
    preview.replaceChildren();
    (rules.length ? rules : ['请配置服务规则']).forEach((rule, index) => {
      const item = document.createElement('div');
      item.className = 'package-rule-item';
      const number = document.createElement('span');
      number.className = 'package-rule-index';
      number.textContent = String(index + 1);
      const text = document.createElement('span');
      text.textContent = rule;
      item.append(number, text);
      preview.appendChild(item);
    });
  }

  function updatePackagePreview() {
    const name = (document.getElementById('packageNameInput')?.value || '').trim();
    const description = (document.getElementById('packageDescriptionInput')?.value || '').trim();
    const intro = (document.getElementById('packageIntroInput')?.value || '').trim();
    const price = (document.getElementById('packagePriceInput')?.value || '').trim();
    const planSelect = document.getElementById('packagePlanInput');
    const plan = planSelect && planSelect.selectedIndex > 0 ? planSelect.value : '暂未关联';
    const period = readPackagePeriod();
    const activeTags = getPackageTags().filter(tag => tag.classList.contains('active')).map(tag => tag.querySelector('[data-package-tag-label]')?.textContent.trim()).filter(Boolean).slice(0, 3);
    const previewName = document.getElementById('packagePreviewName');
    const previewPrice = document.getElementById('packagePreviewPrice');
    const previewPriceUnit = document.getElementById('packagePreviewPriceUnit');
    const previewPeriodNote = document.getElementById('packagePreviewPeriodNote');
    const previewFooterPrice = document.getElementById('packagePreviewFooterPrice');
    const previewDescription = document.getElementById('packagePreviewDescription');
    const previewIntro = document.getElementById('packagePreviewIntro');
    const previewPlan = document.getElementById('packagePreviewPlan');
    const previewTeam = document.getElementById('packagePreviewTeam');
    const previewTags = document.getElementById('packagePreviewTags');
    const numericPrice = Number(price);
    const displayPrice = price && Number.isFinite(numericPrice) ? numericPrice.toLocaleString('zh-CN', { maximumFractionDigits: 2 }) : '--';
    if (previewName) previewName.textContent = name || '服务包名称';
    if (previewPrice) previewPrice.textContent = `¥${displayPrice}`;
    if (previewPriceUnit) previewPriceUnit.textContent = `/ ${period}`;
    if (previewPeriodNote) previewPeriodNote.textContent = `服务包有效期${period}`;
    if (previewFooterPrice) previewFooterPrice.innerHTML = `¥${displayPrice}<small> / ${period}</small>`;
    if (previewDescription) previewDescription.textContent = description || '填写服务包描述后，将在这里实时展示给 C 端用户。';
    if (previewIntro) previewIntro.textContent = intro || '填写服务介绍后，将在这里展示服务内容、服务方式及用户能够获得的健康价值。';
    if (previewPlan) previewPlan.textContent = plan;
    const teamSelect = document.getElementById('packageTeamInput');
    if (previewTeam) previewTeam.textContent = teamSelect && teamSelect.selectedIndex > 0 ? teamSelect.value : '暂未配置';
    if (previewTags) {
      previewTags.replaceChildren();
      [...(activeTags.length ? activeTags : ['健康服务']), period].forEach(text => {
        const tag = document.createElement('span');
        tag.textContent = text;
        previewTags.appendChild(tag);
      });
    }
    updatePackageBenefitsPreview();
    updatePackageRulesPreview();
  }

  function openPackageEditor(item = null) {
    const overlay = document.getElementById('packageEditorOverlay');
    if (!overlay) return;
    const fields = {
      name: document.getElementById('packageNameInput'),
      description: document.getElementById('packageDescriptionInput'),
      price: document.getElementById('packagePriceInput'),
      plan: document.getElementById('packagePlanInput'),
      team: document.getElementById('packageTeamInput'),
      intro: document.getElementById('packageIntroInput')
    };
    overlay.dataset.editCode = item?.[0] || '';
    overlay.dataset.noteMode = item ? 'edit' : 'create';
    overlay.querySelector('.package-editor-title').textContent = item ? '编辑服务包' : '新建服务包';
    overlay.querySelector('.package-editor-save').textContent = item ? '保存修改' : '保存';
    if (item) {
      const [, , name, description, period, price, plan] = item;
      fields.name.value = name;
      fields.description.value = description;
      fields.price.value = price;
      fields.intro.value = item[11] || '';
      document.querySelectorAll('input[name="packageVerificationMode"]').forEach(input => { input.checked = input.value === (item[12] || '本平台完成'); });
      if (!Array.from(fields.plan.options).some(option => option.value === plan)) fields.plan.add(new Option(plan, plan));
      fields.plan.value = plan;
      const durationLabel = { '30天': '1个月', '90天': '3个月', '180天': '6个月', '365天': '1年' }[period] || '';
      const manualPeriod = document.querySelector('[data-manual-period]');
      const customValue = document.getElementById('packageCustomDurationValue');
      const customUnit = document.getElementById('packageCustomDurationUnit');
      document.querySelectorAll('.package-duration [data-package-duration]').forEach(button => button.classList.toggle('active', button.textContent.trim() === durationLabel));
      manualPeriod?.classList.toggle('active', !durationLabel);
      const customMatch = String(period || '').match(/(\d+)\s*(天|个月|月|年)/);
      customValue.value = durationLabel ? '' : String(customMatch?.[1] || parseInt(period, 10) || 30);
      customUnit.value = durationLabel ? '天' : (customMatch?.[2] === '个月' ? '月' : customMatch?.[2] || '天');
      fields.team.selectedIndex = 0;
    } else {
      [fields.name, fields.description, fields.price, fields.intro].forEach(field => { field.value = ''; });
      fields.plan.selectedIndex = 0;
      fields.team.selectedIndex = 0;
      document.querySelectorAll('.package-duration [data-package-duration]').forEach((button, index) => button.classList.toggle('active', index === 0));
      document.querySelector('[data-manual-period]')?.classList.remove('active');
      document.getElementById('packageCustomDurationValue').value = '';
      document.getElementById('packageCustomDurationUnit').value = '天';
      document.getElementById('packageServiceAgreement').selectedIndex = 1;
      document.querySelectorAll('input[name="packageVerificationMode"]').forEach(input => { input.checked = input.value === '本平台完成'; });
    }
    document.querySelectorAll('#packageEditorOverlay select').forEach(rebuildPackageAntSelect);
    [fields.name, fields.description, fields.intro].forEach(field => {
      const counter = field.closest('.package-input-wrap')?.querySelector('.package-counter');
      if (counter) counter.textContent = `${field.value.length} / ${field.maxLength}`;
    });
    const coverInput = document.getElementById('packageCoverInput');
    if (coverInput) coverInput.value = '';
    setPackageCover(item?.[9] || '', item?.[10] || '');
    overlay.hidden = false;
    overlay.querySelector('.package-editor-scroll').scrollTop = 0;
    document.body.style.overflow = 'hidden';
    updatePackagePreview();
  }

  function closePackageEditor() {
    const overlay = document.getElementById('packageEditorOverlay');
    if (!overlay) return;
    closePackageAntSelects();
    closePackageFrequencyDropdowns();
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  function savePackageDraft() {
    const overlay = document.getElementById('packageEditorOverlay');
    const code = overlay?.dataset.editCode;
    if (!code) {
      showPackageToast('服务包草稿已保存');
      return;
    }
    const item = getPackageData(code);
    const row = document.querySelector(`[data-package-row][data-package-code="${code}"]`);
    if (!item || !row) return;
    const name = document.getElementById('packageNameInput').value.trim() || item[2];
    const description = document.getElementById('packageDescriptionInput').value.trim() || item[3];
    const price = document.getElementById('packagePriceInput').value.trim() || item[5];
    const planSelect = document.getElementById('packagePlanInput');
    const plan = planSelect.selectedIndex > 0 ? planSelect.value : '';
    const duration = readPackagePeriod();
    const period = { '1个月': '30天', '3个月': '90天', '6个月': '180天', '1年': '365天' }[duration] || duration || item[4];
    item[2] = name;
    item[3] = description;
    item[4] = period;
    item[5] = price;
    item[6] = plan;
    item[9] = overlay.dataset.coverSource || '';
    item[10] = overlay.dataset.coverName || '';
    item[11] = document.getElementById('packageIntroInput').value.trim();
    item[12] = document.querySelector('input[name="packageVerificationMode"]:checked')?.value || '本平台完成';
    row.children[1].innerHTML = packageCoverIcon(item[1], item[9]);
    row.children[2].textContent = name;
    row.children[2].title = name;
    row.children[3].textContent = description;
    row.children[3].title = description;
    row.children[4].textContent = period;
    row.children[5].textContent = price;
    row.children[6].textContent = plan || '--';
    row.children[6].title = plan || '--';
    row.dataset.packageSearch = `${code} ${name} ${description} ${plan}`;
    closePackageEditor();
    showPackageToast('服务包修改已保存');
  }

  injectStyle();
  if (!injectViews()) return;
  enhancePackageSelects();
  refreshPackageFrequencyOptions();

  document.addEventListener('click', event => {
    const packageFrequencyOption = event.target.closest('[data-package-frequency-option]');
    if (packageFrequencyOption) {
      event.preventDefault();
      closePackageAntSelects();
      const control = packageFrequencyOption.closest('[data-package-frequency-combobox]');
      const input = control?.querySelector('[data-benefit-frequency]');
      if (input) input.value = packageFrequencyOption.dataset.packageFrequencyOption || '';
      rememberPackageFrequency(input?.value);
      closePackageFrequencyDropdowns();
      updatePackagePreview();
      input?.focus();
      return;
    }
    const packageFrequencyTrigger = event.target.closest('[data-package-frequency-trigger]');
    if (packageFrequencyTrigger) {
      event.preventDefault();
      closePackageAntSelects();
      const control = packageFrequencyTrigger.closest('[data-package-frequency-combobox]');
      if (control?.classList.contains('open')) closePackageFrequencyDropdowns();
      else openPackageFrequencyDropdown(control);
      return;
    }
    const packageFrequencyInput = event.target.closest('[data-benefit-frequency]');
    if (packageFrequencyInput) {
      closePackageAntSelects();
      openPackageFrequencyDropdown(packageFrequencyInput.closest('[data-package-frequency-combobox]'));
    }
    else if (!event.target.closest('[data-package-frequency-combobox]')) closePackageFrequencyDropdowns();
    const packageSelectOption = event.target.closest('[data-package-ant-option]');
    if (packageSelectOption) {
      event.preventDefault();
      const wrapper = packageSelectOption.closest('.package-ant-select');
      const select = wrapper?.querySelector('select');
      if (!select || packageSelectOption.disabled) return;
      select.selectedIndex = Number(packageSelectOption.dataset.packageAntOption);
      syncPackageAntSelect(select);
      closePackageAntSelects();
      select.dispatchEvent(new Event('change', { bubbles: true }));
      wrapper.querySelector('[data-package-ant-select-trigger]')?.focus();
      return;
    }
    const packageSelectTrigger = event.target.closest('[data-package-ant-select-trigger]');
    if (packageSelectTrigger) {
      event.preventDefault();
      closePackageFrequencyDropdowns();
      if (packageSelectTrigger.disabled) return;
      const wrapper = packageSelectTrigger.closest('.package-ant-select');
      const dropdown = wrapper?.querySelector('[data-package-ant-select-dropdown]');
      const willOpen = !wrapper?.classList.contains('open');
      closePackageAntSelects(wrapper);
      wrapper?.classList.toggle('open', willOpen);
      packageSelectTrigger.setAttribute('aria-expanded', String(willOpen));
      if (dropdown) dropdown.hidden = !willOpen;
      return;
    }
    if (!event.target.closest('.package-ant-select')) closePackageAntSelects();
    const sensitiveToggle = event.target.closest('[data-sensitive-toggle]');
    if (sensitiveToggle) {
      const isRevealed = sensitiveToggle.getAttribute('aria-pressed') === 'true';
      const sensitiveText = sensitiveToggle.closest('.order-sensitive-value')?.querySelector('[data-sensitive-text]');
      const nextRevealed = !isRevealed;
      if (sensitiveText) sensitiveText.textContent = nextRevealed ? sensitiveToggle.dataset.full : sensitiveToggle.dataset.masked;
      sensitiveToggle.setAttribute('aria-pressed', String(nextRevealed));
      sensitiveToggle.setAttribute('aria-label', `${nextRevealed ? '隐藏' : '查看'}${sensitiveToggle.dataset.sensitiveLabel}`);
      sensitiveToggle.title = `${nextRevealed ? '隐藏' : '查看'}${sensitiveToggle.dataset.sensitiveLabel}`;
      sensitiveToggle.innerHTML = sensitiveEyeIcon(!nextRevealed);
      return;
    }
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
    const moreButton = event.target.closest('[data-package-more]');
    if (moreButton) {
      const menu = document.getElementById('packageMoreMenu');
      const alreadyOpen = !menu.hidden && moreButton.getAttribute('aria-expanded') === 'true';
      closePackageMoreMenu();
      if (!alreadyOpen) openPackageMoreMenu(moreButton);
      return;
    }
    const packageAction = event.target.closest('[data-package-action]');
    if (packageAction) {
      handlePackageAction(packageAction.dataset.packageAction, packageAction.dataset.packageCode);
      return;
    }
    const subscriptionButton = event.target.closest('[data-package-subscriptions]');
    if (subscriptionButton) {
      openPackageSubscriptions(subscriptionButton.dataset.packageSubscriptions);
      return;
    }
    const packageRow = event.target.closest('[data-package-row]');
    if (packageRow) {
      openPackageEditor(getPackageData(packageRow.dataset.packageCode));
      return;
    }
    const recordStatus = event.target.closest('[data-package-record-status]');
    if (recordStatus) {
      packageRecordState.status = recordStatus.dataset.packageRecordStatus;
      packageRecordState.page = 1;
      renderPackageSubscribers();
      return;
    }
    const recordPage = event.target.closest('[data-package-record-page]');
    if (recordPage && !recordPage.disabled) {
      packageRecordState.page += recordPage.dataset.packageRecordPage === 'next' ? 1 : -1;
      renderPackageSubscribers();
      document.getElementById('packageRecordContent')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const profileButton = event.target.closest('[data-package-profile]');
    if (profileButton) {
      openSubscriberProfile(profileButton.dataset.packageProfile, profileButton.dataset.packageCode);
      return;
    }
    if (event.target.closest('[data-close-package-record]') || event.target.id === 'packageRecordMask') {
      closePackageSubscriptions();
      return;
    }
    if (event.target.closest('[data-close-package-share]') || event.target.id === 'packageShareMask') {
      closePackageShareDialog();
      return;
    }
    if (event.target.closest('[data-copy-package-link]')) {
      copyPackageShareLink();
      return;
    }
    if (event.target.closest('[data-copy-package-qr]')) {
      copyPackageShareQr();
      return;
    }
    if (event.target.closest('[data-download-package-qr]')) {
      downloadPackageShareQr();
      return;
    }
    if (event.target.id === 'packageDialogConfirm') {
      const action = pendingPackageDialogAction;
      if (typeof action === 'function') action();
      return;
    }
    if (event.target.closest('[data-close-package-dialog]') || event.target.id === 'packageDialogMask') {
      closePackageDialog();
      return;
    }
    if (!event.target.closest('#packageMoreMenu')) closePackageMoreMenu();
    if (event.target.closest('[data-package-query]')) {
      applyPackageFilter();
      return;
    }
    if (event.target.closest('[data-package-reset]')) {
      resetPackageFilters();
      return;
    }
    const orderPageButton = event.target.closest('[data-order-page]');
    if (orderPageButton && !orderPageButton.disabled) {
      orderCurrentPage = Number(orderPageButton.dataset.orderPage) || 1;
      applyOrderFilter(false);
      return;
    }
    const transactionPageButton = event.target.closest('[data-transaction-page]');
    if (transactionPageButton && !transactionPageButton.disabled) {
      transactionCurrentPage = Number(transactionPageButton.dataset.transactionPage) || 1;
      applyTransactionFilter(false);
      return;
    }
    if (event.target.closest('[data-order-query]')) applyOrderFilter();
    if (event.target.closest('[data-order-reset]')) {
      resetOrderFilters();
    }
    if (event.target.closest('[data-transaction-query]')) {
      applyTransactionFilter();
      return;
    }
    if (event.target.closest('[data-transaction-reset]')) {
      resetTransactionFilters();
      return;
    }
    const orderTab = event.target.closest('[data-order-tab]');
    if (orderTab) {
      document.querySelectorAll('.order-tab').forEach(tab => tab.classList.toggle('active', tab === orderTab));
      applyOrderFilter();
    }
    const reviewAction = event.target.closest('[data-order-review-action]');
    if (reviewAction) {
      const panel = reviewAction.closest('[data-order-review-panel]');
      const form = panel?.querySelector('[data-order-review-reject-form]');
      const reasonInput = panel?.querySelector('[data-order-review-reject-reason]');
      const error = panel?.querySelector('[data-order-review-error]');
      const decisionError = panel?.querySelector('[data-order-review-decision-error]');
      const action = reviewAction.dataset.orderReviewAction;
      if (action === 'cancel') {
        closeOrderDetail();
      }
      if (action === 'confirm') {
        const decision = panel?.querySelector('[data-order-review-decision]:checked')?.value || '';
        if (!decision) {
          if (decisionError) decisionError.hidden = false;
          panel?.querySelector('[data-order-review-decision]')?.focus();
          return;
        }
        const reason = reasonInput?.value.trim() || '';
        if (decision === 'reject' && !reason) {
          reasonInput?.setAttribute('aria-invalid', 'true');
          if (error) error.hidden = false;
          reasonInput?.focus();
        } else {
          completeOrderRefundReview(panel?.dataset.orderNo || '', decision === 'approve', reason, Boolean(panel?.querySelector('[data-order-review-next]')?.checked));
        }
      }
      return;
    }
    const refundAction = event.target.closest('[data-refund-action]');
    if (refundAction) {
      if (refundAction.dataset.refundAction === 'note') {
        const note = document.getElementById('orderRefundNote');
        if (!note?.value.trim()) {
          note?.focus();
          showPackageToast('请先填写处理备注');
        } else showPackageToast('处理备注已保存');
      }
      if (refundAction.dataset.refundAction === 'retry') showPackageToast('已重新提交退款处理');
      if (refundAction.dataset.refundAction === 'refresh') showPackageToast('已获取最新退款结果：渠道处理中');
      return;
    }
    const detail = event.target.closest('[data-order-detail]');
    if (detail) openOrderDetail(detail.dataset.orderDetail);
    const transactionDetail = event.target.closest('[data-transaction-detail]');
    if (transactionDetail) {
      openTransactionDetail(transactionDetail.dataset.transactionDetail);
      return;
    }
    const transactionLocateOrder = event.target.closest('[data-transaction-locate-order]');
    if (transactionLocateOrder) {
      locateTransactionOrder(transactionLocateOrder.dataset.transactionLocateOrder);
      return;
    }
    const transactionRow = event.target.closest('[data-transaction-row]');
    if (transactionRow) {
      openTransactionDetail(transactionRow.dataset.transactionNo);
      return;
    }
    if (event.target.closest('[data-close-restored-order]') || event.target.id === 'restoredOrderMask') closeOrderDetail();
    if (event.target.closest('[data-remove-package-cover]')) {
      setPackageCover('', '');
      const coverInput = document.getElementById('packageCoverInput');
      if (coverInput) coverInput.value = '';
      showPackageToast('封面已移除，保存后生效');
      return;
    }
    if (event.target.closest('[data-create-service-package]')) openPackageEditor();
    if (event.target.closest('[data-close-package-editor]')) closePackageEditor();
    if (event.target.closest('[data-save-service-package]')) savePackageDraft();
    if (event.target.closest('[data-add-benefit]')) {
      document.getElementById('packageBenefitEditors').insertAdjacentHTML('beforeend', renderBenefitEditor('新服务权益', '请填写该权益为用户提供的价值', [['', '服务期内1次']], '▣'));
      updatePackagePreview();
      return;
    }
    const addBenefitContent = event.target.closest('[data-add-benefit-content]');
    if (addBenefitContent) {
      addBenefitContent.closest('[data-benefit-editor]').querySelector('[data-benefit-content-list]').insertAdjacentHTML('beforeend', renderBenefitContent('', '服务期内1次'));
      updatePackagePreview();
      return;
    }
    const removeBenefitContent = event.target.closest('[data-remove-benefit-content]');
    if (removeBenefitContent) {
      const editor = removeBenefitContent.closest('[data-benefit-editor]');
      const contents = editor.querySelectorAll('[data-benefit-content]');
      if (contents.length <= 1) showPackageToast('每项服务权益至少保留一条服务内容');
      else removeBenefitContent.closest('[data-benefit-content]').remove();
      updatePackagePreview();
      return;
    }
    const removeBenefit = event.target.closest('[data-remove-benefit]');
    if (removeBenefit) {
      const benefits = document.querySelectorAll('[data-benefit-editor]');
      if (benefits.length <= 1) showPackageToast('服务包至少保留一项服务权益');
      else removeBenefit.closest('[data-benefit-editor]').remove();
      updatePackagePreview();
      return;
    }
    const agreementPreview = event.target.closest('[data-preview-agreement]');
    if (agreementPreview) {
      openPackageDialog({ title: '健康管理服务协议', text: '说明服务内容、服务周期、双方权利义务、退款规则及争议处理方式。', body: '<div class="package-share-card"><strong>健康管理服务协议 V2.1</strong><div class="package-share-link">当前已选择的协议模板将在用户订阅服务包前展示并确认。</div></div>', confirmLabel: '关闭', onConfirm: closePackageDialog });
      return;
    }
    if (event.target.closest('[data-add-package-tag]')) {
      openPackageTagEditor();
      return;
    }
    if (event.target.closest('[data-confirm-package-tag]')) {
      addCustomPackageTag();
      return;
    }
    if (event.target.closest('[data-cancel-package-tag]')) {
      closePackageTagEditor();
      return;
    }
    const removePackageTag = event.target.closest('[data-remove-package-tag]');
    if (removePackageTag) {
      removePackageTag.closest('[data-package-tag]')?.remove();
      refreshPackageTagState();
      updatePackagePreview();
      return;
    }
    const duration = event.target.closest('.package-duration [data-package-duration]');
    if (duration) {
      duration.parentElement.querySelectorAll('[data-package-duration]').forEach(button => button.classList.toggle('active', button === duration));
      document.querySelector('[data-manual-period]')?.classList.remove('active');
      updatePackagePreview();
      return;
    }
    const tag = event.target.closest('[data-package-tag]');
    if (tag) {
      const willSelect = !tag.classList.contains('active');
      const selectedCount = getPackageTags().filter(item => item.classList.contains('active')).length;
      if (willSelect && selectedCount >= 3) {
        showPackageToast('最多同时选中 3 个关键词标签');
        return;
      }
      tag.classList.toggle('active', willSelect);
      refreshPackageTagState();
      updatePackagePreview();
    }
  }, true);

  document.addEventListener('input', event => {
    if (event.target.id === 'orderSearchInput') applyOrderFilter();
    if (event.target.matches('[data-order-review-reject-reason]')) {
      event.target.removeAttribute('aria-invalid');
      const error = event.target.closest('[data-order-review-panel]')?.querySelector('[data-order-review-error]');
      if (error) error.hidden = true;
    }
    if (event.target.id === 'packageSubscriberSearch') {
      packageRecordState.page = 1;
      renderPackageSubscribers(event.target.value);
    }
    if (event.target.matches('[maxlength]')) {
      const counter = event.target.closest('.package-input-wrap')?.querySelector('.package-counter');
      if (counter) counter.textContent = `${event.target.value.length} / ${event.target.maxLength}`;
    }
    if (event.target.id === 'packageCustomDurationValue' || event.target.id === 'packageCustomDurationUnit') activateManualPackagePeriod();
    if (event.target.closest('#packageEditorForm')) updatePackagePreview();
  });

  document.addEventListener('change', event => {
    if (event.target.matches('[data-order-review-decision]')) {
      const panel = event.target.closest('[data-order-review-panel]');
      const form = panel?.querySelector('[data-order-review-reject-form]');
      const reasonInput = panel?.querySelector('[data-order-review-reject-reason]');
      const error = panel?.querySelector('[data-order-review-error]');
      const decisionError = panel?.querySelector('[data-order-review-decision-error]');
      if (decisionError) decisionError.hidden = true;
      if (form) form.hidden = event.target.value !== 'reject';
      if (event.target.value !== 'reject' && reasonInput) {
        reasonInput.value = '';
        reasonInput.removeAttribute('aria-invalid');
        if (error) error.hidden = true;
      }
      if (event.target.value === 'reject') reasonInput?.focus();
      return;
    }
    if (event.target.id === 'orderStartDate' || event.target.id === 'orderEndDate') {
      const startDate = document.getElementById('orderStartDate');
      const endDate = document.getElementById('orderEndDate');
      if (startDate && endDate) {
        endDate.min = startDate.value || '';
        startDate.max = endDate.value || '';
        if (startDate.value && endDate.value && startDate.value > endDate.value) {
          if (event.target === startDate) endDate.value = startDate.value;
          else startDate.value = endDate.value;
        }
        endDate.min = startDate.value || '';
        startDate.max = endDate.value || '';
      }
      applyOrderFilter();
      return;
    }
    if (event.target.id === 'transactionStartDate' || event.target.id === 'transactionEndDate') {
      const startDate = document.getElementById('transactionStartDate');
      const endDate = document.getElementById('transactionEndDate');
      if (startDate && endDate) {
        endDate.min = startDate.value || '';
        startDate.max = endDate.value || '';
        if (startDate.value && endDate.value && startDate.value > endDate.value) {
          if (event.target === startDate) endDate.value = startDate.value;
          else startDate.value = endDate.value;
        }
        endDate.min = startDate.value || '';
        startDate.max = endDate.value || '';
      }
      return;
    }
    if (event.target.id === 'orderPageSize') {
      orderPageSize = Number(event.target.value) || 10;
      orderCurrentPage = 1;
      applyOrderFilter(false);
      return;
    }
    if (event.target.id === 'transactionPageSize') {
      transactionPageSize = Number(event.target.value) || 10;
      transactionCurrentPage = 1;
      applyTransactionFilter(false);
      return;
    }
    if (event.target.id === 'packageCoverInput') handlePackageCoverFile(event.target.files?.[0]);
    if (event.target.matches('[data-benefit-frequency]')) rememberPackageFrequency(event.target.value);
    if (event.target.id === 'packageCustomDurationUnit') activateManualPackagePeriod();
    if (event.target.closest('#packageEditorForm')) updatePackagePreview();
  });

  document.addEventListener('keydown', event => {
    if (event.target.matches('[data-package-row]') && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      openPackageEditor(getPackageData(event.target.dataset.packageCode));
      return;
    }
    if (event.target.matches('[data-benefit-frequency]') && event.key === 'ArrowDown') {
      event.preventDefault();
      const control = event.target.closest('[data-package-frequency-combobox]');
      openPackageFrequencyDropdown(control);
      window.setTimeout(() => (control.querySelector('.package-ant-select-option.selected') || control.querySelector('.package-ant-select-option'))?.focus(), 0);
      return;
    }
    const frequencyOption = event.target.closest('[data-package-frequency-option]');
    if (frequencyOption && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      const options = Array.from(frequencyOption.parentElement.querySelectorAll('[data-package-frequency-option]'));
      const current = options.indexOf(frequencyOption);
      options[(current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length]?.focus();
      return;
    }
    if (frequencyOption && event.key === 'Enter') {
      event.preventDefault();
      frequencyOption.click();
      return;
    }
    const antSelectTrigger = event.target.closest('[data-package-ant-select-trigger]');
    if (antSelectTrigger && ['Enter', ' ', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const wrapper = antSelectTrigger.closest('.package-ant-select');
      if (!wrapper.classList.contains('open')) antSelectTrigger.click();
      window.setTimeout(() => (wrapper.querySelector('.package-ant-select-option.selected') || wrapper.querySelector('.package-ant-select-option'))?.focus(), 0);
      return;
    }
    const antSelectOption = event.target.closest('[data-package-ant-option]');
    if (antSelectOption && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      const options = Array.from(antSelectOption.parentElement.querySelectorAll('[data-package-ant-option]:not(:disabled)'));
      const current = options.indexOf(antSelectOption);
      options[(current + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length]?.focus();
      return;
    }
    if (antSelectOption && event.key === 'Enter') {
      event.preventDefault();
      antSelectOption.click();
      return;
    }
    if (event.target.matches('[data-benefit-frequency]') && event.key === 'Enter') {
      event.preventDefault();
      rememberPackageFrequency(event.target.value);
      closePackageFrequencyDropdowns();
      updatePackagePreview();
      return;
    }
    if (event.target.id === 'packageCustomTagInput' && event.key === 'Enter') {
      event.preventDefault();
      addCustomPackageTag();
      return;
    }
    if (event.target.id === 'packageCustomTagInput' && event.key === 'Escape') {
      event.preventDefault();
      closePackageTagEditor();
      return;
    }
    if (event.key === 'Enter' && event.target.id === 'orderPageJump') {
      event.preventDefault();
      orderCurrentPage = Math.max(1, Number(event.target.value) || 1);
      applyOrderFilter(false);
      return;
    }
    if (event.key === 'Enter' && event.target.id === 'orderSearchInput') {
      event.preventDefault();
      applyOrderFilter();
      return;
    }
    if (event.key === 'Enter' && event.target.id === 'transactionSearchInput') {
      event.preventDefault();
      applyTransactionFilter();
      return;
    }
    if (event.key === 'Enter' && event.target.matches('[data-transaction-row]')) {
      event.preventDefault();
      openTransactionDetail(event.target.dataset.transactionNo);
      return;
    }
    if (event.key === 'Enter' && event.target.closest('.package-filter')) {
      event.preventDefault();
      applyPackageFilter();
      return;
    }
    if (event.key === 'Escape') {
      if (document.querySelector('[data-package-frequency-combobox].open')) {
        const input = document.querySelector('[data-package-frequency-combobox].open [data-benefit-frequency]');
        closePackageFrequencyDropdowns();
        input?.focus();
        return;
      }
      if (document.querySelector('.package-ant-select.open')) {
        const trigger = document.querySelector('.package-ant-select.open [data-package-ant-select-trigger]');
        closePackageAntSelects();
        trigger?.focus();
        return;
      }
      closePackageMoreMenu();
      closePackageShareDialog();
      closePackageDialog();
      closePackageSubscriptions();
      closeOrderDetail();
    }
  });

  // These views are mounted after the original program. Clear any legacy
  // positional form-state values that may otherwise be applied to the new inputs.
  window.setTimeout(() => {
    resetPackageFilters();
    resetOrderFilters();
    resetTransactionFilters();
    document.querySelectorAll('[data-package-form-input]').forEach(input => {
      if (input.tagName === 'SELECT') input.selectedIndex = input.id === 'packageServiceAgreement' ? 1 : 0;
      else if (!input.classList.contains('package-rules')) input.value = '';
    });
    document.querySelectorAll('#packageEditorOverlay select').forEach(syncPackageAntSelect);
    applyPackageFilter();
    refreshPackageTagState();
    updatePackagePreview();
  }, 80);
})();
