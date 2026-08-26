(function () {
  if (window.__knowledgeBaseInitialized) return;
  window.__knowledgeBaseInitialized = true;

  const rows = [
    { name: '医保政策与结算知识库', intro: '覆盖职工医保、居民医保、门诊统筹、异地就医备案与报销结算规则', tags: ['医保政策', '就诊指引'], count: '32 份', updated: '2026-08-25 16:30', department: '医保办公室' },
    { name: '健康饮食与营养管理', intro: '面向慢病患者的膳食结构、营养评估、食谱模板及特殊人群饮食建议', tags: ['健康宣教', '慢病管理'], count: '46 份', updated: '2026-08-25 14:20', department: '营养科' },
    { name: 'CKD全程管理知识库', intro: 'CKD分期诊疗、肾功能监测、用药安全、营养护理和随访管理标准', tags: ['疾病知识', '护理规范', '随访管理'], count: '38 份', updated: '2026-08-24 09:45', department: '肾内科' },
    { name: '糖尿病患者教育中心', intro: '糖尿病筛查、血糖监测、胰岛素使用、低血糖处置及足部护理知识', tags: ['疾病知识', '用药指导', '健康宣教'], count: '54 份', updated: '2026-08-23 17:40', department: '内分泌科' },
    { name: '高血压规范管理', intro: '高血压分级、家庭血压测量、危险因素干预、用药依从性和复诊策略', tags: ['慢病管理', '用药指导', '随访管理'], count: '41 份', updated: '2026-08-22 15:15', department: '心血管内科' },
    { name: '医院核心制度与质量安全', intro: '医疗质量安全核心制度、患者安全目标、不良事件上报及应急预案', tags: ['医院制度', '质量安全'], count: '29 份', updated: '2026-08-21 11:20', department: '医务部' },
    { name: '门诊与住院就诊流程', intro: '预约挂号、检查检验、入出院办理、转诊转院和便民服务全流程指引', tags: ['就诊指引', '患者服务'], count: '24 份', updated: '2026-08-20 17:05', department: '门诊部' },
    { name: '临床护理操作规范', intro: '基础护理、管路护理、压疮预防、跌倒风险管理和护理记录规范', tags: ['护理规范', '质量安全'], count: '63 份', updated: '2026-08-19 10:50', department: '护理部' },
    { name: '常用药物安全手册', intro: '常用药物适应证、禁忌证、相互作用、不良反应监测与患者用药教育', tags: ['用药指导', '质量安全'], count: '57 份', updated: '2026-08-18 13:36', department: '药学部' },
    { name: '患者随访服务标准', intro: '出院随访、慢病随访、失访处置、风险升级及标准沟通话术模板', tags: ['随访管理', '患者服务'], count: '35 份', updated: '2026-08-17 16:10', department: '患者服务中心' },
    { name: '肿瘤康复与症状管理', intro: '治疗期症状观察、疼痛管理、营养支持、心理关怀及康复随访知识', tags: ['疾病知识', '健康宣教', '随访管理'], count: '44 份', updated: '2026-08-16 09:25', department: '肿瘤科' },
    { name: '互联网医院运营规范', intro: '线上问诊、电子处方、药品配送、隐私保护和运营质量监测规则', tags: ['医院制度', '患者服务', '质量安全'], count: '21 份', updated: '2026-08-15 18:00', department: '互联网医院' }
  ];
  const knowledgeFiles = {
    '医保政策与结算知识库': [
      { name: '2026年度基本医疗保险政策汇编.pdf', type: 'PDF', size: '4.8MB', updated: '2026-08-25 15:20' },
      { name: '异地就医备案与直接结算指南.docx', type: 'DOCX', size: '1.8MB', updated: '2026-08-23 10:12' },
      { name: '门诊慢特病认定与报销流程.pdf', type: 'PDF', size: '2.1MB', updated: '2026-08-22 09:30' },
      { name: '医保电子凭证使用说明.pdf', type: 'PDF', size: '860KB', updated: '2026-08-20 09:30' },
      { name: '医保咨询高频问题与标准答复.txt', type: 'TXT', size: '156KB', updated: '2026-08-18 16:40' },
      { name: '住院费用结算审核要点.docx', type: 'DOCX', size: '1.2MB', updated: '2026-08-16 11:05' }
    ],
    'CKD全程管理知识库': [
      { name: '慢性肾脏病分期与诊疗路径.pdf', type: 'PDF', size: '3.6MB', updated: '2026-08-24 09:45' },
      { name: 'CKD患者肾功能监测项目清单.docx', type: 'DOCX', size: '980KB', updated: '2026-08-23 14:12' },
      { name: '肾病患者低盐优质低蛋白饮食手册.pdf', type: 'PDF', size: '2.7MB', updated: '2026-08-22 10:30' },
      { name: 'CKD随访分层与预警规则.docx', type: 'DOCX', size: '1.4MB', updated: '2026-08-20 16:40' },
      { name: '肾功能异常患者用药注意事项.txt', type: 'TXT', size: '188KB', updated: '2026-08-19 08:50' }
    ]
  };

  const style = document.createElement('style');
  style.id = 'knowledgeBaseStyles';
  style.textContent = `
    .knowledge-base-view { padding: 14px; }
    .knowledge-base-view .knowledge-toolbar { flex: 0 0 48px; }
    .knowledge-base-view .knowledge-search { width: 230px; }
    .knowledge-tag-filter { position: relative; height: 36px; }
    .knowledge-tag-filter::after { content: ''; position: absolute; right: 13px; top: 12px; width: 7px; height: 7px; border-right: 1.5px solid #657188; border-bottom: 1.5px solid #657188; transform: rotate(45deg); pointer-events: none; }
    .knowledge-tag-filter select { width: 164px; height: 36px; padding: 0 34px 0 11px; border: 1px solid #e6eaf1; border-radius: 4px; color: #526078; background: #fff; appearance: none; transition: border-color .2s, box-shadow .2s; }
    .knowledge-tag-filter select:hover { border-color: #4096ff; }
    .knowledge-tag-filter select:focus-visible { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
    .knowledge-base-view .knowledge-create { margin-left: auto; }
    .knowledge-table-wrap { flex: 1; min-height: 0; overflow: hidden; }
    .knowledge-table th, .knowledge-table td { padding-inline: 12px; }
    .knowledge-name-cell { min-width: 0; color: #25324a; font-weight: 600; }
    .knowledge-tags { display: flex; flex-wrap: wrap; gap: 5px; }
    .knowledge-content-tag { min-height: 22px; padding: 2px 9px; display: inline-flex; align-items: center; border-radius: 5px; font-size: 13px; line-height: 18px; }
    .knowledge-content-tag.blue { color: #2b6ae2; background: #eaf2ff; }
    .knowledge-content-tag.green { color: #15945b; background: #e9f8f0; }
    .knowledge-content-tag.purple { color: #7050d8; background: #f0edff; }
    .knowledge-content-tag.orange { color: #e58c16; background: #fff5e6; }
    .knowledge-content-tag.cyan { color: #159897; background: #e9f8f8; }
    .knowledge-row-actions { display: inline-flex; align-items: center; gap: 12px; white-space: nowrap; }
    .knowledge-row-action { color: #3154ff; font-size: 14px; font-weight: 500; }
    .knowledge-row-action:hover { color: #173ee6; }
    .knowledge-row-action.danger { color: #ff4d4f; }
    .knowledge-row-action.danger:hover { color: #d9363e; }
    .knowledge-row-action:focus-visible { outline: 2px solid rgba(49,84,255,.25); outline-offset: 2px; border-radius: 2px; }
    .knowledge-empty { height: 220px; text-align: center; color: #9aa5b4; }
    .knowledge-pager { flex: 0 0 58px; }
    .list-main.knowledge-detail-main { padding: 0; background: #f4f7fc; }
    .list-main.knowledge-detail-main > .page-title { display: none; }
    .knowledge-detail-view { padding: 0; gap: 20px; overflow: auto; border-radius: 0; background: transparent; box-shadow: none; }
    .knowledge-detail-summary { min-height: 222px; padding: 36px 30px 28px; flex: 0 0 auto; border: 1px solid #e0e8f4; border-top: 0; border-radius: 0 0 10px 10px; background: #fff; }
    .knowledge-detail-hero { display: flex; align-items: flex-start; gap: 26px; }
    .knowledge-detail-icon { position: relative; width: 74px; height: 74px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 13px; color: #fff; background: linear-gradient(145deg, #2769ed, #438dff); box-shadow: 0 9px 20px rgba(42,107,238,.18); }
    .knowledge-detail-icon::after { content: ''; position: absolute; right: -4px; bottom: -5px; width: 30px; height: 30px; border-radius: 8px; background: rgba(58,132,255,.55); filter: blur(9px); }
    .knowledge-detail-icon svg { position: relative; z-index: 1; width: 38px; height: 38px; }
    .knowledge-detail-heading { min-width: 0; flex: 1; }
    .knowledge-detail-heading h1 { margin: 0; color: #111d32; font-size: 29px; line-height: 38px; font-weight: 700; }
    .knowledge-detail-heading p { margin: 8px 0 0; color: #1d2b43; font-size: 17px; line-height: 26px; }
    .knowledge-detail-edit { height: 48px; padding: 0 18px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid #1763ff; border-radius: 8px; color: #175cf3; background: #fff; font-size: 16px; font-weight: 500; transition: color .2s, background .2s, border-color .2s; }
    .knowledge-detail-edit:hover { color: #0f49cc; border-color: #0f49cc; background: #f5f8ff; }
    .knowledge-detail-edit svg { width: 20px; height: 20px; }
    .knowledge-detail-meta { margin-top: 37px; display: flex; align-items: center; gap: 0; color: #17243a; font-size: 17px; }
    .knowledge-detail-meta-item { min-height: 30px; padding: 0 31px; display: inline-flex; align-items: center; gap: 12px; border-left: 1px solid #dfe6f0; }
    .knowledge-detail-meta-item:first-child { padding-left: 0; border-left: 0; }
    .knowledge-detail-meta-label { font-weight: 500; }
    .knowledge-detail-tag { padding: 4px 12px; border-radius: 8px; color: #1762e8; background: #edf4ff; font-size: 15px; }
    .knowledge-detail-tags { display: inline-flex; flex-wrap: wrap; gap: 6px; }
    .knowledge-detail-content { min-height: 520px; padding: 30px; flex: 1 0 auto; display: flex; flex-direction: column; border: 1px solid #e0e8f4; border-radius: 10px 10px 0 0; background: #fff; }
    .knowledge-detail-section-title { margin: 0 0 28px; color: #111d32; font-size: 21px; line-height: 28px; font-weight: 700; }
    .knowledge-file-toolbar { min-height: 48px; display: flex; align-items: flex-start; gap: 18px; }
    .knowledge-file-search { width: 312px; height: 48px; padding: 0 16px; display: flex; align-items: center; gap: 10px; border: 1px solid #d8e0eb; border-radius: 7px; background: #fff; transition: border-color .2s, box-shadow .2s; }
    .knowledge-file-search:hover { border-color: #4096ff; }
    .knowledge-file-search:focus-within { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); }
    .knowledge-file-search input { width: 100%; min-width: 0; border: 0; background: transparent; font-size: 16px; }
    .knowledge-file-search input::placeholder { color: #a3adbd; }
    .knowledge-file-search svg { width: 21px; height: 21px; flex: 0 0 auto; color: #122c58; }
    .knowledge-file-type { position: relative; height: 48px; }
    .knowledge-file-type::after { content: ''; position: absolute; right: 18px; top: 18px; width: 8px; height: 8px; border-right: 1.5px solid #263c61; border-bottom: 1.5px solid #263c61; transform: rotate(45deg); pointer-events: none; }
    .knowledge-file-type select { width: 236px; height: 48px; padding: 0 42px 0 18px; border: 1px solid #d8e0eb; border-radius: 7px; color: #1a2a43; background: #fff; appearance: none; font-size: 16px; }
    .knowledge-file-upload { margin-left: auto; height: 48px; padding: 0 20px; display: inline-flex; align-items: center; gap: 10px; border-radius: 7px; color: #fff; background: #1762f1; font-size: 16px; font-weight: 500; box-shadow: 0 5px 12px rgba(23,98,241,.18); }
    .knowledge-file-upload:hover { background: #0f4fd0; }
    .knowledge-file-upload svg { width: 21px; height: 21px; }
    .knowledge-file-table-wrap { margin-top: 28px; overflow: hidden; }
    .knowledge-file-table { width: 100%; table-layout: fixed; border-collapse: collapse; color: #1b2a42; }
    .knowledge-file-table thead tr { height: 60px; background: #f6f8fb; }
    .knowledge-file-table th { padding: 0 22px; color: #1d2b43; font-size: 16px; font-weight: 500; }
    .knowledge-file-table tbody tr { height: 84px; border-bottom: 1px solid #e4e9f1; }
    .knowledge-file-table td { padding: 0 22px; color: #1e2d46; font-size: 16px; }
    .knowledge-file-name { display: flex; align-items: center; gap: 22px; font-weight: 500; }
    .knowledge-file-icon { position: relative; width: 32px; height: 38px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 4px; color: #fff; font-size: 17px; line-height: 1; box-shadow: 0 4px 8px rgba(30,64,120,.12); }
    .knowledge-file-icon::after { content: ''; position: absolute; right: 0; top: 0; border-top: 8px solid rgba(255,255,255,.82); border-left: 8px solid transparent; }
    .knowledge-file-icon.pdf { background: linear-gradient(145deg, #ed4c43, #cf271e); }
    .knowledge-file-icon.docx { background: linear-gradient(145deg, #4286f4, #1858c8); }
    .knowledge-file-icon.txt { background: linear-gradient(145deg, #55a1f7, #2184e8); }
    .knowledge-file-icon.png, .knowledge-file-icon.jpg { background: linear-gradient(145deg, #34b27b, #16895a); }
    .knowledge-file-actions { display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; }
    .knowledge-file-action { padding: 3px 0; color: #1677ff; font-size: 14px; font-weight: 500; background: transparent; }
    .knowledge-file-action:hover { color: #0958d9; }
    .knowledge-file-action.danger { color: #ff4d4f; }
    .knowledge-file-action.danger:hover { color: #cf1322; }
    .knowledge-file-empty { height: 220px; text-align: center; color: #8e9aab; }
    .knowledge-file-footer { min-height: 78px; margin-top: auto; padding-top: 30px; display: flex; align-items: center; color: #263650; font-size: 16px; }
    .knowledge-file-pagination { margin-left: auto; display: flex; align-items: center; gap: 12px; }
    .knowledge-file-page { width: 44px; height: 46px; display: inline-grid; place-items: center; border: 1px solid #d8e0eb; border-radius: 7px; color: #9eacbe; background: #fff; font-size: 22px; }
    .knowledge-file-page.active { color: #fff; border-color: #1762f1; background: #1762f1; font-size: 16px; }
    .knowledge-file-size { width: 170px; height: 46px; padding: 0 16px; border: 1px solid #d8e0eb; border-radius: 7px; color: #263650; background: #fff; font-size: 16px; }
    .knowledge-detail-edit:focus-visible, .knowledge-file-upload:focus-visible, .knowledge-file-action:focus-visible, .knowledge-file-page:focus-visible { outline: 2px solid rgba(23,98,241,.3); outline-offset: 2px; }
    .list-main.knowledge-detail-main { padding: 14px; background: #f2f5ff; }
    .knowledge-detail-view { gap: 14px; font-size: 14px; }
    .knowledge-detail-view button, .knowledge-detail-view input, .knowledge-detail-view select, .knowledge-detail-view table { font-size: 14px; }
    .knowledge-detail-page-header { min-height: 30px; flex: 0 0 30px; display: flex; align-items: center; gap: 8px; color: #263752; font-size: 14px; font-weight: 700; }
    .knowledge-detail-back { width: 30px; height: 30px; display: inline-grid; place-items: center; border-radius: 4px; color: #526078; background: #fff; transition: color .2s, background .2s; }
    .knowledge-detail-back:hover { color: #3154ff; background: #eaf1ff; }
    .knowledge-detail-back:focus-visible { outline: 2px solid rgba(49,84,255,.25); outline-offset: 2px; }
    .knowledge-detail-back svg { width: 16px; height: 16px; }
    .knowledge-detail-summary { min-height: 136px; padding: 14px; border: 0; border-radius: 8px; }
    .knowledge-detail-hero { gap: 14px; }
    .knowledge-detail-icon { width: 48px; height: 48px; border-radius: 8px; }
    .knowledge-detail-icon svg { width: 26px; height: 26px; }
    .knowledge-detail-heading h1 { font-size: 14px; line-height: 22px; }
    .knowledge-detail-heading p { margin-top: 4px; font-size: 14px; line-height: 22px; }
    .knowledge-detail-edit { height: 36px; padding: 0 14px; gap: 8px; border-radius: 4px; font-size: 14px; }
    .knowledge-detail-edit svg { width: 16px; height: 16px; }
    .knowledge-detail-meta { margin-top: 14px; font-size: 14px; }
    .knowledge-detail-meta-item { min-height: 28px; padding: 0 14px; gap: 8px; }
    .knowledge-detail-tag { padding: 2px 8px; border-radius: 5px; font-size: 14px; }
    .knowledge-detail-content { min-height: 420px; padding: 14px; border: 0; border-radius: 8px; }
    .knowledge-detail-section-title { margin-bottom: 14px; font-size: 14px; line-height: 22px; }
    .knowledge-file-toolbar { min-height: 48px; gap: 14px; }
    .knowledge-file-search { width: 230px; height: 36px; padding: 0 11px; gap: 8px; border-radius: 4px; }
    .knowledge-file-search input { font-size: 14px; }
    .knowledge-file-search svg { width: 16px; height: 16px; }
    .knowledge-file-type { height: 36px; }
    .knowledge-file-type::after { right: 13px; top: 12px; width: 7px; height: 7px; }
    .knowledge-file-type select { width: 164px; height: 36px; padding: 0 34px 0 11px; border-radius: 4px; font-size: 14px; }
    .knowledge-file-upload { height: 36px; padding: 0 14px; gap: 8px; border-radius: 4px; font-size: 14px; }
    .knowledge-file-upload svg { width: 16px; height: 16px; }
    .knowledge-file-table-wrap { margin-top: 0; }
    .knowledge-file-table thead tr { height: 48px; }
    .knowledge-file-table th, .knowledge-file-table td { padding: 0 12px; font-size: 14px; }
    .knowledge-file-table tbody tr { height: 51px; }
    .knowledge-file-name { gap: 14px; }
    .knowledge-file-icon { width: 28px; height: 32px; font-size: 14px; }
    .knowledge-file-actions { gap: 12px; }
    .knowledge-file-footer { min-height: 58px; padding-top: 14px; font-size: 14px; }
    .knowledge-file-pagination { gap: 8px; }
    .knowledge-file-page { width: 30px; height: 30px; border-radius: 4px; font-size: 14px; }
    .knowledge-file-page.active { font-size: 14px; }
    .knowledge-file-size { width: 96px; height: 30px; padding: 0 10px; border-radius: 4px; font-size: 14px; }
    .knowledge-toast { position: fixed; left: 50%; top: 24px; z-index: 12000; padding: 10px 16px; border: 1px solid #dce5f5; border-radius: 7px; color: #233650; background: #fff; box-shadow: 0 8px 24px rgba(32,52,85,.16); transform: translate(-50%, -16px); opacity: 0; pointer-events: none; transition: opacity .2s, transform .2s; }
    .knowledge-toast.show { opacity: 1; transform: translate(-50%, 0); }
    .knowledge-modal-mask { position: fixed; inset: 0; z-index: 11900; display: none; align-items: center; justify-content: center; padding: 24px; background: rgba(15,28,51,.45); }
    .knowledge-modal-mask.open { display: flex; }
    .knowledge-modal { width: min(680px, calc(100vw - 48px)); max-height: calc(100vh - 48px); overflow: auto; border-radius: 8px; background: #fff; box-shadow: 0 18px 48px rgba(20,38,70,.22); }
    .knowledge-modal-header { height: 58px; padding: 0 22px; display: flex; align-items: center; border-bottom: 1px solid #f0f0f0; }
    .knowledge-modal-header h2 { margin: 0; color: #1f1f1f; font-size: 17px; font-weight: 600; }
    .knowledge-modal-close { margin-left: auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 4px; color: #8c8c8c; font-size: 22px; }
    .knowledge-modal-close:hover { color: #1f1f1f; background: #f5f5f5; }
    .knowledge-form { padding: 22px; }
    .knowledge-field { margin-bottom: 18px; }
    .knowledge-field-label { margin-bottom: 8px; display: block; color: #262626; font-size: 14px; font-weight: 500; }
    .knowledge-field-label.required::before { content: '*'; margin-right: 4px; color: #ff4d4f; }
    .knowledge-field input, .knowledge-field textarea, .knowledge-field select { width: 100%; border: 1px solid #d9d9d9; border-radius: 6px; color: #262626; background: #fff; font: inherit; transition: border-color .2s, box-shadow .2s; }
    .knowledge-field input, .knowledge-field select { height: 36px; padding: 0 11px; }
    .knowledge-field textarea { min-height: 82px; padding: 8px 11px; resize: vertical; line-height: 1.6; }
    .knowledge-field input:hover, .knowledge-field textarea:hover, .knowledge-field select:hover { border-color: #4096ff; }
    .knowledge-field input:focus, .knowledge-field textarea:focus, .knowledge-field select:focus { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); outline: 0; }
    .knowledge-field-help { margin-top: 5px; color: #8c8c8c; font-size: 12px; }
    .knowledge-field-error { min-height: 18px; margin-top: 3px; color: #ff4d4f; font-size: 12px; }
    .knowledge-tag-selector { min-height: 84px; padding: 10px; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 8px; border: 1px solid #d9d9d9; border-radius: 6px; }
    .knowledge-tag-option { position: relative; }
    .knowledge-tag-option input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
    .knowledge-tag-option span { min-height: 28px; padding: 3px 10px; display: inline-flex; align-items: center; border: 1px solid #d9d9d9; border-radius: 6px; color: #595959; background: #fff; cursor: pointer; user-select: none; transition: all .2s; }
    .knowledge-tag-option span:hover { color: #1677ff; border-color: #4096ff; }
    .knowledge-tag-option input:checked + span { color: #1677ff; border-color: #91caff; background: #e6f4ff; }
    .knowledge-tag-option input:focus-visible + span { outline: 2px solid rgba(22,119,255,.22); outline-offset: 2px; }
    .knowledge-selected-tags { min-height: 24px; margin-top: 8px; color: #595959; font-size: 13px; }
    .knowledge-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .knowledge-modal-footer { padding: 12px 22px; display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid #f0f0f0; }
    .knowledge-modal-footer button { height: 36px; padding: 0 15px; border-radius: 6px; font-size: 14px; }
    .knowledge-modal-cancel { border: 1px solid #d9d9d9; color: #262626; background: #fff; }
    .knowledge-modal-cancel:hover { color: #4096ff; border-color: #4096ff; }
    .knowledge-modal-submit { border: 1px solid #1677ff; color: #fff; background: #1677ff; box-shadow: 0 2px 0 rgba(5,145,255,.1); }
    .knowledge-modal-submit:hover { border-color: #4096ff; background: #4096ff; }
    .knowledge-modal-close:focus-visible, .knowledge-modal-footer button:focus-visible { outline: 2px solid rgba(22,119,255,.25); outline-offset: 2px; }
    .knowledge-upload-mask { position: fixed; inset: 0; z-index: 12020; display: none; align-items: center; justify-content: center; padding: 24px; background: rgba(15,28,51,.45); }
    .knowledge-upload-mask.open { display: flex; }
    .knowledge-upload-dialog { width: min(780px, calc(100vw - 48px)); max-height: min(620px, calc(100vh - 48px)); display: grid; grid-template-rows: 58px minmax(260px,1fr) 64px; overflow: hidden; border-radius: 8px; background: #fff; box-shadow: 0 18px 48px rgba(20,38,70,.24); }
    .knowledge-upload-head { padding: 0 22px; display: flex; align-items: center; border-bottom: 1px solid #f0f0f0; }
    .knowledge-upload-head h2 { margin: 0; color: #1f1f1f; font-size: 17px; font-weight: 600; }
    .knowledge-upload-close { margin-left: auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 4px; color: #8c8c8c; font-size: 22px; }
    .knowledge-upload-close:hover { color: #1f1f1f; background: #f5f5f5; }
    .knowledge-upload-body { min-height: 0; padding: 22px; overflow: auto; }
    .knowledge-upload-tip { margin: 0 0 14px; color: #8c8c8c; font-size: 13px; }
    .knowledge-upload-grid { min-height: 212px; padding: 18px; display: grid; grid-template-columns: repeat(5, minmax(86px,1fr)); align-content: start; gap: 12px; border: 1px dashed #d9d9d9; border-radius: 8px; background: #fafafa; transition: border-color .2s, background .2s; }
    .knowledge-upload-grid.is-dragover { border-color: #1677ff; background: #f0f7ff; }
    .knowledge-upload-card, .knowledge-upload-add { position: relative; min-width: 0; height: 92px; border: 1px solid #d9d9d9; border-radius: 6px; background: #fff; }
    .knowledge-upload-card { padding: 12px 8px 8px; display: grid; align-content: center; justify-items: center; gap: 7px; }
    .knowledge-upload-card-icon { min-width: 38px; height: 24px; padding: 0 7px; display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; color: #1677ff; background: #e6f4ff; font-size: 11px; font-weight: 700; }
    .knowledge-upload-card-name { width: 100%; overflow: hidden; color: #595959; font-size: 12px; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
    .knowledge-upload-remove { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; display: grid; place-items: center; border-radius: 4px; color: #fff; background: rgba(0,0,0,.55); font-size: 15px; }
    .knowledge-upload-add { display: grid; place-items: center; border-style: dashed; color: #8c8c8c; font-size: 32px; font-weight: 300; }
    .knowledge-upload-add:hover { color: #1677ff; border-color: #1677ff; background: #f0f7ff; }
    .knowledge-upload-foot { padding: 0 22px; display: flex; align-items: center; border-top: 1px solid #f0f0f0; }
    .knowledge-upload-count { color: #8c8c8c; font-size: 13px; }
    .knowledge-upload-actions { margin-left: auto; display: flex; gap: 8px; }
    .knowledge-upload-actions button { height: 36px; padding: 0 15px; border-radius: 6px; font-size: 14px; }
    .knowledge-upload-cancel { border: 1px solid #d9d9d9; color: #262626; background: #fff; }
    .knowledge-upload-confirm { border: 1px solid #1677ff; color: #fff; background: #1677ff; }
    .knowledge-upload-confirm:disabled { color: rgba(0,0,0,.25); border-color: #d9d9d9; background: rgba(0,0,0,.04); cursor: not-allowed; }
    .knowledge-preview-backdrop { position: fixed; inset: 0; z-index: 12030; visibility: hidden; background: rgba(15,28,51,.38); opacity: 0; transition: opacity .2s, visibility .2s; }
    .knowledge-preview-backdrop.open { visibility: visible; opacity: 1; }
    .knowledge-preview-drawer { position: fixed; z-index: 12040; top: 0; right: 0; width: min(620px, calc(100vw - 32px)); height: 100vh; display: flex; flex-direction: column; background: #fff; border-left: 1px solid #e7ebf0; box-shadow: -16px 0 40px rgba(15,28,51,.2); transform: translateX(102%); transition: transform .22s ease; }
    .knowledge-preview-drawer.open { transform: translateX(0); }
    .knowledge-preview-head { min-height: 64px; padding: 0 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f0f0f0; }
    .knowledge-preview-head h2 { min-width: 0; margin: 0; overflow: hidden; color: #1f1f1f; font-size: 17px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
    .knowledge-preview-close { margin-left: auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 4px; color: #8c8c8c; font-size: 22px; }
    .knowledge-preview-close:hover { color: #1f1f1f; background: #f5f5f5; }
    .knowledge-preview-meta { padding: 14px 20px; display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; border-bottom: 1px solid #f0f0f0; background: #fafafa; }
    .knowledge-preview-meta span { display: grid; gap: 4px; color: #8c8c8c; font-size: 12px; }
    .knowledge-preview-meta strong { color: #262626; font-size: 14px; font-weight: 500; }
    .knowledge-preview-body { min-height: 0; padding: 20px; flex: 1; overflow: auto; background: #f5f7fa; }
    .knowledge-preview-frame { width: 100%; min-height: 100%; border: 0; border-radius: 6px; background: #fff; }
    .knowledge-preview-image { max-width: 100%; display: block; margin: 0 auto; border-radius: 6px; box-shadow: 0 3px 16px rgba(0,0,0,.08); }
    .knowledge-preview-placeholder { min-height: 480px; padding: 48px; display: grid; place-content: center; gap: 16px; border: 1px solid #e8e8e8; border-radius: 6px; color: #595959; background: #fff; text-align: center; }
    .knowledge-preview-placeholder .knowledge-file-icon { margin: 0 auto; }
    .knowledge-preview-placeholder p { max-width: 390px; margin: 0; color: #8c8c8c; line-height: 1.7; }
    .knowledge-preview-text { min-height: 480px; margin: 0; padding: 28px; border-radius: 6px; color: #262626; background: #fff; font: 14px/1.8 ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre-wrap; }
    .knowledge-replace-input, .knowledge-upload-input { display: none; }
    @media (max-width: 1180px) { .knowledge-base-view .knowledge-search { width: 200px; } .knowledge-tag-filter select { width: 148px; } .knowledge-detail-summary, .knowledge-detail-content { padding-inline: 14px; } .knowledge-file-search { width: 200px; } .knowledge-file-type select { width: 148px; } }
    @media (max-width: 720px) { .knowledge-form-grid { grid-template-columns: 1fr; gap: 0; } .knowledge-modal-mask, .knowledge-upload-mask { padding: 12px; } .knowledge-modal, .knowledge-upload-dialog { width: calc(100vw - 24px); max-height: calc(100vh - 24px); } .knowledge-upload-grid { grid-template-columns: repeat(3,minmax(76px,1fr)); } .knowledge-preview-meta { grid-template-columns: 1fr; } }
    @media (prefers-reduced-motion: reduce) { .knowledge-base-view * { transition: none !important; } }
  `;
  document.head.appendChild(style);

  const availableTags = ['疾病知识', '慢病管理', '用药指导', '护理规范', '随访管理', '健康宣教', '医保政策', '就诊指引', '患者服务', '医院制度', '质量安全'];
  const tagOptions = availableTags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
  const view = document.createElement('section');
  view.className = 'list-panel list-view knowledge-base-view';
  view.id = 'knowledgeBaseView';
  view.setAttribute('aria-label', '知识库');
  view.setAttribute('data-persistence-ignore', '');
  view.innerHTML = `
    <div class="toolbar knowledge-toolbar">
      <label class="search knowledge-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input id="knowledgeSearch" data-persistence-ignore autocomplete="off" placeholder="搜索知识库名称" aria-label="搜索知识库名称"></label>
      <label class="knowledge-tag-filter"><select id="knowledgeTagFilter" data-persistence-ignore aria-label="内容标签"><option value="">全部内容标签</option>${tagOptions}</select></label>
      <button class="primary knowledge-create" type="button" data-create-knowledge><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg><span>创建知识库</span></button>
    </div>
    <div class="table-wrap knowledge-table-wrap">
      <table class="knowledge-table">
        <colgroup><col style="width:18%"><col style="width:29%"><col style="width:11%"><col style="width:8%"><col style="width:12%"><col style="width:22%"></colgroup>
        <thead><tr><th>知识库名称</th><th>知识库简介</th><th>内容标签</th><th>内容数量</th><th>最近更新时间</th><th>操作</th></tr></thead>
        <tbody id="knowledgeRows"></tbody>
      </table>
    </div>
    <div class="pager knowledge-pager"><span id="knowledgeTotal">共 12 条</span><button class="page-btn disabled" type="button" aria-label="上一页">‹</button><button class="page-btn active" type="button">1</button><button class="page-btn" type="button">2</button><button class="page-btn" type="button" aria-label="下一页">›</button><button class="page-select" type="button">20 条/页⌄</button></div>
    <div class="knowledge-toast" id="knowledgeToast" role="status" aria-live="polite"></div>`;
  document.querySelector('#listPage .list-main')?.appendChild(view);

  const detailView = document.createElement('section');
  detailView.className = 'list-panel list-view knowledge-detail-view';
  detailView.id = 'knowledgeDetailView';
  detailView.setAttribute('aria-label', '知识库详情');
  detailView.setAttribute('data-persistence-ignore', '');
  detailView.innerHTML = `
    <header class="knowledge-detail-page-header"><button class="knowledge-detail-back" type="button" data-back-knowledge-list aria-label="返回知识库首页" title="返回知识库首页"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m15 18-6-6 6-6"/></svg></button><span>知识库详情</span></header>
    <section class="knowledge-detail-summary">
      <div class="knowledge-detail-hero">
        <span class="knowledge-detail-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><rect x="8" y="14" width="32" height="25" rx="4" fill="white"/><path d="M13 14V11a4 4 0 0 1 4-4h7l4 4h7a4 4 0 0 1 4 4" fill="white" opacity=".9"/><rect x="19" y="23" width="10" height="3" rx="1.5" fill="#367bf5"/></svg></span>
        <div class="knowledge-detail-heading"><h1 id="knowledgeDetailName">医保政策与结算知识库</h1><p id="knowledgeDetailIntro">覆盖职工医保、居民医保、门诊统筹、异地就医备案与报销结算规则</p></div>
        <button class="knowledge-detail-edit" type="button" data-edit-current-knowledge><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m4 16-1 5 5-1L19 9l-4-4Z"/><path d="m13 7 4 4M10 21h11"/></svg>编辑知识库</button>
      </div>
      <div class="knowledge-detail-meta">
        <span class="knowledge-detail-meta-item"><span class="knowledge-detail-meta-label">内容标签：</span><span class="knowledge-detail-tags" id="knowledgeDetailTags"></span></span>
        <span class="knowledge-detail-meta-item"><span class="knowledge-detail-meta-label">内容数量：</span><span id="knowledgeDetailCount">12 份</span></span>
        <span class="knowledge-detail-meta-item"><span class="knowledge-detail-meta-label">最近更新：</span><span id="knowledgeDetailUpdated">2026-08-25 16:30</span></span>
      </div>
    </section>
    <section class="knowledge-detail-content">
      <h2 class="knowledge-detail-section-title">知识内容</h2>
      <div class="knowledge-file-toolbar">
        <label class="knowledge-file-search"><input id="knowledgeFileSearch" data-persistence-ignore autocomplete="off" placeholder="搜索文件名称" aria-label="搜索文件名称"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg></label>
        <label class="knowledge-file-type"><select id="knowledgeFileType" data-persistence-ignore aria-label="文件类型"><option value="">文件类型：全部</option><option value="PDF">文件类型：PDF</option><option value="DOCX">文件类型：DOCX</option><option value="TXT">文件类型：TXT</option><option value="PNG">文件类型：PNG</option><option value="JPG">文件类型：JPG</option></select></label>
        <button class="knowledge-file-upload" type="button" data-upload-knowledge-file><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 16V4M7 9l5-5 5 5M5 15v5h14v-5"/></svg>上传文件</button>
      </div>
      <div class="knowledge-file-table-wrap">
        <table class="knowledge-file-table"><colgroup><col style="width:34%"><col style="width:12%"><col style="width:12%"><col style="width:20%"><col style="width:22%"></colgroup><thead><tr><th>文件名称</th><th>类型</th><th>大小</th><th>最近更新时间</th><th>操作</th></tr></thead><tbody id="knowledgeFileRows"></tbody></table>
      </div>
      <div class="knowledge-file-footer"><span id="knowledgeFileTotal">共 4 条</span><div class="knowledge-file-pagination"><button class="knowledge-file-page" type="button" disabled aria-label="上一页">‹</button><button class="knowledge-file-page active" type="button">1</button><button class="knowledge-file-page" type="button" disabled aria-label="下一页">›</button><select class="knowledge-file-size" aria-label="每页文件数"><option>20 条/页</option><option>50 条/页</option></select></div></div>
    </section>`;
  document.querySelector('#listPage .list-main')?.appendChild(detailView);
  document.querySelector('#listPage .list-main')?.appendChild(document.getElementById('knowledgeToast'));

  const modalMask = document.createElement('div');
  modalMask.className = 'knowledge-modal-mask';
  modalMask.id = 'knowledgeModalMask';
  modalMask.setAttribute('aria-hidden', 'true');
  modalMask.innerHTML = `
    <section class="knowledge-modal" role="dialog" aria-modal="true" aria-labelledby="knowledgeModalTitle">
      <header class="knowledge-modal-header"><h2 id="knowledgeModalTitle">创建知识库</h2><button class="knowledge-modal-close" type="button" data-close-knowledge-modal aria-label="关闭">×</button></header>
      <form id="knowledgeForm" novalidate>
        <div class="knowledge-form">
          <div class="knowledge-field"><label class="knowledge-field-label required" for="knowledgeNameInput">知识库名称</label><input id="knowledgeNameInput" maxlength="30" placeholder="请输入清晰、便于识别的知识库名称" autocomplete="off"><div class="knowledge-field-error" id="knowledgeNameError"></div></div>
          <div class="knowledge-field"><label class="knowledge-field-label required" for="knowledgeIntroInput">知识库简介</label><textarea id="knowledgeIntroInput" maxlength="120" placeholder="说明知识库的适用人群、内容范围和使用场景"></textarea><div class="knowledge-field-help"><span id="knowledgeIntroCount">0</span>/120</div><div class="knowledge-field-error" id="knowledgeIntroError"></div></div>
          <div class="knowledge-field"><span class="knowledge-field-label required">内容标签（可多选）</span><div class="knowledge-tag-selector" role="group" aria-label="内容标签">${availableTags.map(tag => `<label class="knowledge-tag-option"><input type="checkbox" name="knowledgeTags" value="${tag}"><span>${tag}</span></label>`).join('')}</div><div class="knowledge-selected-tags" id="knowledgeSelectedTags">暂未选择标签</div><div class="knowledge-field-error" id="knowledgeTagsError"></div></div>
          <div class="knowledge-form-grid">
            <div class="knowledge-field"><label class="knowledge-field-label required" for="knowledgeDepartmentInput">所属部门</label><select id="knowledgeDepartmentInput"><option value="">请选择所属部门</option><option>医务部</option><option>护理部</option><option>药学部</option><option>患者服务中心</option><option>专科科室</option><option>互联网医院</option></select><div class="knowledge-field-error" id="knowledgeDepartmentError"></div></div>
            <div class="knowledge-field"><label class="knowledge-field-label" for="knowledgeVisibilityInput">使用范围</label><select id="knowledgeVisibilityInput"><option>全院可见</option><option>本科室可见</option><option>指定团队可见</option></select><div class="knowledge-field-help">创建后可在权限设置中调整</div></div>
          </div>
        </div>
        <footer class="knowledge-modal-footer"><button class="knowledge-modal-cancel" type="button" data-close-knowledge-modal>取消</button><button class="knowledge-modal-submit" type="submit">确认创建</button></footer>
      </form>
    </section>`;
  document.body.appendChild(modalMask);

  const uploadMask = document.createElement('div');
  uploadMask.className = 'knowledge-upload-mask';
  uploadMask.id = 'knowledgeUploadMask';
  uploadMask.setAttribute('aria-hidden', 'true');
  uploadMask.innerHTML = `
    <section class="knowledge-upload-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledgeUploadTitle">
      <header class="knowledge-upload-head"><h2 id="knowledgeUploadTitle">上传知识库文件</h2><button class="knowledge-upload-close" type="button" data-close-knowledge-upload aria-label="关闭">×</button></header>
      <div class="knowledge-upload-body">
        <p class="knowledge-upload-tip">支持拖拽或点击批量上传，最多 20 个文件；支持 PDF、DOC、DOCX、TXT、PNG、JPG 格式，单个文件不超过 50MB。</p>
        <input class="knowledge-upload-input" id="knowledgeUploadInput" type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" multiple>
        <div class="knowledge-upload-grid" id="knowledgeUploadGrid" aria-label="待上传文件列表">
          <button class="knowledge-upload-add" type="button" data-trigger-knowledge-upload aria-label="选择文件">＋</button>
        </div>
      </div>
      <footer class="knowledge-upload-foot"><span class="knowledge-upload-count" id="knowledgeUploadCount">已选择 0/20 个文件</span><div class="knowledge-upload-actions"><button class="knowledge-upload-cancel" type="button" data-close-knowledge-upload>取消</button><button class="knowledge-upload-confirm" type="button" data-confirm-knowledge-upload disabled>确认上传</button></div></footer>
    </section>`;
  document.body.appendChild(uploadMask);

  const previewBackdrop = document.createElement('div');
  previewBackdrop.className = 'knowledge-preview-backdrop';
  previewBackdrop.id = 'knowledgePreviewBackdrop';
  previewBackdrop.setAttribute('aria-hidden', 'true');
  const previewDrawer = document.createElement('aside');
  previewDrawer.className = 'knowledge-preview-drawer';
  previewDrawer.id = 'knowledgePreviewDrawer';
  previewDrawer.setAttribute('aria-hidden', 'true');
  previewDrawer.setAttribute('aria-labelledby', 'knowledgePreviewTitle');
  previewDrawer.innerHTML = `
    <header class="knowledge-preview-head"><h2 id="knowledgePreviewTitle">文件查看</h2><button class="knowledge-preview-close" type="button" data-close-knowledge-preview aria-label="关闭">×</button></header>
    <div class="knowledge-preview-meta"><span>文件类型<strong id="knowledgePreviewType">--</strong></span><span>文件大小<strong id="knowledgePreviewSize">--</strong></span><span>更新时间<strong id="knowledgePreviewUpdated">--</strong></span></div>
    <div class="knowledge-preview-body" id="knowledgePreviewBody"></div>`;
  document.body.append(previewBackdrop, previewDrawer);

  const replaceInput = document.createElement('input');
  replaceInput.className = 'knowledge-replace-input';
  replaceInput.id = 'knowledgeReplaceInput';
  replaceInput.type = 'file';
  replaceInput.accept = '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg';
  document.body.appendChild(replaceInput);

  function tagClass(tag) {
    if (tag === '健康宣教') return 'purple';
    if (tag === '医院制度') return 'orange';
    if (tag === '就诊指引') return 'cyan';
    if (tag === '医保政策') return 'green';
    return 'blue';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  }

  function renderTags(tags, detail = false) {
    return tags.map(tag => `<span class="${detail ? 'knowledge-detail-tag' : `knowledge-content-tag ${tagClass(tag)}`}">${escapeHtml(tag)}</span>`).join('');
  }

  function filesForKnowledge(row) {
    if (!knowledgeFiles[row.name]) {
      knowledgeFiles[row.name] = [
        { name: `${row.name}说明.pdf`, type: 'PDF', size: '1.6MB', updated: row.updated },
        { name: `${row.tags[0]}工作指引.docx`, type: 'DOCX', size: '980KB', updated: row.updated },
        { name: `${row.name}常见问题.txt`, type: 'TXT', size: '86KB', updated: row.updated }
      ];
    }
    return knowledgeFiles[row.name];
  }

  function currentKnowledgeRow() {
    return rows.find(item => item.name === detailView.dataset.knowledgeName) || rows[0];
  }

  function currentTimeText() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  function fileType(file) {
    const extension = String(file.name || '').split('.').pop().toUpperCase();
    if (extension === 'DOC') return 'DOCX';
    if (['PDF', 'DOCX', 'TXT', 'PNG', 'JPG', 'JPEG'].includes(extension)) return extension === 'JPEG' ? 'JPG' : extension;
    return 'FILE';
  }

  function fileSize(size) {
    const bytes = Number(size) || 0;
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)}MB`;
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  }

  function isAcceptedKnowledgeFile(file) {
    return /\.(pdf|docx?|txt|png|jpe?g)$/i.test(file.name || '') && Number(file.size || 0) <= 50 * 1024 * 1024;
  }

  function createKnowledgeFile(file) {
    return { name: file.name, type: fileType(file), size: fileSize(file.size), updated: currentTimeText(), sourceFile: file };
  }

  function adjustKnowledgeCount(row, delta) {
    const next = Math.max(0, (parseInt(row.count, 10) || 0) + delta);
    row.count = `${next} 份`;
    row.updated = currentTimeText();
    document.getElementById('knowledgeDetailCount').textContent = row.count;
    document.getElementById('knowledgeDetailUpdated').textContent = row.updated;
  }

  function fileIcon(file) {
    const label = file.type === 'DOCX' ? 'W' : file.type === 'TXT' ? 'T' : ['PNG', 'JPG'].includes(file.type) ? '图' : '⌁';
    return `<span class="knowledge-file-icon ${file.type.toLowerCase()}">${label}</span>`;
  }

  function renderKnowledgeFiles() {
    const row = currentKnowledgeRow();
    const keyword = document.getElementById('knowledgeFileSearch')?.value.trim().toLowerCase() || '';
    const type = document.getElementById('knowledgeFileType')?.value || '';
    const files = filesForKnowledge(row);
    const filtered = files.filter(file => (!keyword || file.name.toLowerCase().includes(keyword)) && (!type || file.type === type));
    document.getElementById('knowledgeFileTotal').textContent = `共 ${filtered.length} 条`;
    document.getElementById('knowledgeFileRows').innerHTML = filtered.length ? filtered.map(file => {
      const index = files.indexOf(file);
      return `<tr><td><div class="knowledge-file-name">${fileIcon(file)}<span title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span></div></td><td>${file.type}</td><td>${file.size}</td><td>${file.updated}</td><td><span class="knowledge-file-actions"><button class="knowledge-file-action" type="button" data-view-knowledge-file="${index}">查看</button><button class="knowledge-file-action" type="button" data-replace-knowledge-file="${index}">替换</button><button class="knowledge-file-action danger" type="button" data-delete-knowledge-file="${index}">删除</button></span></td></tr>`;
    }).join('') : '<tr><td class="knowledge-file-empty" colspan="5">暂无符合条件的文件，请调整文件名称或类型</td></tr>';
  }

  const uploadState = { files: [] };
  let replaceTargetIndex = -1;
  let activePreviewUrl = '';

  function renderUploadFiles() {
    const grid = document.getElementById('knowledgeUploadGrid');
    const add = grid?.querySelector('[data-trigger-knowledge-upload]');
    if (!grid || !add) return;
    grid.querySelectorAll('.knowledge-upload-card').forEach(card => card.remove());
    uploadState.files.forEach((file, index) => {
      const card = document.createElement('div');
      card.className = 'knowledge-upload-card';
      card.innerHTML = `<span class="knowledge-upload-card-icon">${fileType(file)}</span><span class="knowledge-upload-card-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span><button class="knowledge-upload-remove" type="button" data-remove-knowledge-upload="${index}" aria-label="移除${escapeHtml(file.name)}">×</button>`;
      grid.insertBefore(card, add);
    });
    add.hidden = uploadState.files.length >= 20;
    document.getElementById('knowledgeUploadCount').textContent = `已选择 ${uploadState.files.length}/20 个文件`;
    uploadMask.querySelector('[data-confirm-knowledge-upload]').disabled = uploadState.files.length === 0;
  }

  function addUploadFiles(fileList) {
    const incoming = Array.from(fileList || []);
    const accepted = incoming.filter(isAcceptedKnowledgeFile);
    const available = Math.max(0, 20 - uploadState.files.length);
    uploadState.files.push(...accepted.slice(0, available));
    if (accepted.length !== incoming.length) showToast('仅支持指定格式且单个文件不超过 50MB');
    if (accepted.length > available) showToast('单次最多上传 20 个文件');
    renderUploadFiles();
  }

  function openKnowledgeUpload() {
    uploadState.files = [];
    document.getElementById('knowledgeUploadInput').value = '';
    document.getElementById('knowledgeUploadTitle').textContent = `上传文件到“${currentKnowledgeRow().name}”`;
    renderUploadFiles();
    uploadMask.classList.add('open');
    uploadMask.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeKnowledgeUpload() {
    uploadMask.classList.remove('open');
    uploadMask.setAttribute('aria-hidden', 'true');
    uploadState.files = [];
    document.getElementById('knowledgeUploadInput').value = '';
    document.body.style.overflow = '';
  }

  function closeKnowledgePreview() {
    previewBackdrop.classList.remove('open');
    previewDrawer.classList.remove('open');
    previewBackdrop.setAttribute('aria-hidden', 'true');
    previewDrawer.setAttribute('aria-hidden', 'true');
    if (activePreviewUrl) URL.revokeObjectURL(activePreviewUrl);
    activePreviewUrl = '';
  }

  function openKnowledgePreview(file) {
    if (!file) return;
    closeKnowledgePreview();
    document.getElementById('knowledgePreviewTitle').textContent = file.name;
    document.getElementById('knowledgePreviewType').textContent = file.type;
    document.getElementById('knowledgePreviewSize').textContent = file.size;
    document.getElementById('knowledgePreviewUpdated').textContent = file.updated;
    const body = document.getElementById('knowledgePreviewBody');
    body.innerHTML = '';
    if (file.sourceFile && ['PNG', 'JPG'].includes(file.type)) {
      activePreviewUrl = URL.createObjectURL(file.sourceFile);
      body.innerHTML = `<img class="knowledge-preview-image" src="${activePreviewUrl}" alt="${escapeHtml(file.name)}预览">`;
    } else if (file.sourceFile && file.type === 'PDF') {
      activePreviewUrl = URL.createObjectURL(file.sourceFile);
      body.innerHTML = `<iframe class="knowledge-preview-frame" src="${activePreviewUrl}" title="${escapeHtml(file.name)}预览"></iframe>`;
    } else if (file.sourceFile && file.type === 'TXT') {
      const text = document.createElement('pre');
      text.className = 'knowledge-preview-text';
      text.textContent = '文件内容加载中...';
      body.appendChild(text);
      const reader = new FileReader();
      reader.onload = () => { text.textContent = String(reader.result || '文件内容为空'); };
      reader.onerror = () => { text.textContent = '文件内容读取失败，请重新选择文件。'; };
      reader.readAsText(file.sourceFile);
    } else {
      body.innerHTML = `<div class="knowledge-preview-placeholder">${fileIcon(file)}<strong>${escapeHtml(file.name)}</strong><p>${file.type === 'DOCX' ? '当前为 Word 文档，在线查看区域展示文件信息；正式接入文档服务后可呈现完整正文和分页。' : '当前为演示资料，已展示文件名称、类型、大小和更新时间。上传本地 PDF、图片或 TXT 文件后可查看实际内容。'}</p></div>`;
    }
    previewBackdrop.classList.add('open');
    previewDrawer.classList.add('open');
    previewBackdrop.setAttribute('aria-hidden', 'false');
    previewDrawer.setAttribute('aria-hidden', 'false');
  }

  function openKnowledgeDetail(name) {
    const row = rows.find(item => item.name === name);
    if (!row) return;
    detailView.dataset.knowledgeName = row.name;
    document.getElementById('knowledgeDetailName').textContent = row.name;
    document.getElementById('knowledgeDetailIntro').textContent = row.intro;
    document.getElementById('knowledgeDetailTags').innerHTML = renderTags(row.tags, true);
    document.getElementById('knowledgeDetailCount').textContent = row.count;
    document.getElementById('knowledgeDetailUpdated').textContent = row.updated;
    document.getElementById('knowledgeFileSearch').value = '';
    document.getElementById('knowledgeFileType').value = '';
    document.querySelectorAll('#listPage .list-main > .list-view').forEach(panel => panel.classList.toggle('active', panel === detailView));
    document.querySelector('#listPage .list-main')?.classList.add('knowledge-detail-main');
    document.getElementById('listPageTitle').textContent = '知识库详情';
    renderKnowledgeFiles();
    detailView.scrollTop = 0;
  }

  function returnToKnowledgeList() {
    document.querySelectorAll('#listPage .list-main > .list-view').forEach(panel => panel.classList.toggle('active', panel === view));
    document.querySelector('#listPage .list-main')?.classList.remove('knowledge-detail-main');
    document.getElementById('listPageTitle').textContent = '知识库';
    view.scrollTop = 0;
  }

  function render() {
    const keyword = document.getElementById('knowledgeSearch')?.value.trim().toLowerCase() || '';
    const tag = document.getElementById('knowledgeTagFilter')?.value || '';
    const filtered = rows.filter(row => (!keyword || `${row.name} ${row.intro} ${row.department}`.toLowerCase().includes(keyword)) && (!tag || row.tags.includes(tag)));
    document.getElementById('knowledgeTotal').textContent = `共 ${filtered.length} 条`;
    document.getElementById('knowledgeRows').innerHTML = filtered.length ? filtered.map(row => `
      <tr><td><div class="knowledge-name-cell"><span title="${escapeHtml(row.name)}">${escapeHtml(row.name)}</span></div></td>
      <td title="${escapeHtml(row.intro)}">${escapeHtml(row.intro)}</td><td><div class="knowledge-tags">${renderTags(row.tags)}</div></td>
      <td>${row.count}</td><td>${row.updated}</td><td><span class="knowledge-row-actions"><button class="knowledge-row-action" type="button" data-edit-knowledge="${escapeHtml(row.name)}">编辑</button><button class="knowledge-row-action" type="button" data-view-knowledge="${escapeHtml(row.name)}">详情</button><button class="knowledge-row-action danger" type="button" data-delete-knowledge="${escapeHtml(row.name)}">删除</button></span></td></tr>`).join('') : '<tr><td class="knowledge-empty" colspan="6">暂无符合条件的知识库，请调整搜索或内容标签</td></tr>';
  }

  let editingKnowledgeName = '';

  function selectedModalTags() {
    return [...modalMask.querySelectorAll('input[name="knowledgeTags"]:checked')].map(input => input.value);
  }

  function updateSelectedTagText() {
    const selected = selectedModalTags();
    document.getElementById('knowledgeSelectedTags').textContent = selected.length ? `已选择 ${selected.length} 个：${selected.join('、')}` : '暂未选择标签';
    if (selected.length) document.getElementById('knowledgeTagsError').textContent = '';
  }

  function openKnowledgeModal(name = '') {
    const row = rows.find(item => item.name === name);
    editingKnowledgeName = row?.name || '';
    document.getElementById('knowledgeModalTitle').textContent = row ? '编辑知识库' : '创建知识库';
    modalMask.querySelector('.knowledge-modal-submit').textContent = row ? '保存修改' : '确认创建';
    document.getElementById('knowledgeNameInput').value = row?.name || '';
    document.getElementById('knowledgeIntroInput').value = row?.intro || '';
    document.getElementById('knowledgeDepartmentInput').value = row?.department || '';
    document.getElementById('knowledgeVisibilityInput').value = '全院可见';
    modalMask.querySelectorAll('input[name="knowledgeTags"]').forEach(input => { input.checked = Boolean(row?.tags.includes(input.value)); });
    modalMask.querySelectorAll('.knowledge-field-error').forEach(error => { error.textContent = ''; });
    document.getElementById('knowledgeIntroCount').textContent = String((row?.intro || '').length);
    updateSelectedTagText();
    modalMask.classList.add('open');
    modalMask.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('knowledgeNameInput').focus(), 0);
  }

  function closeKnowledgeModal() {
    modalMask.classList.remove('open');
    modalMask.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    editingKnowledgeName = '';
  }

  function validateKnowledgeForm() {
    const name = document.getElementById('knowledgeNameInput').value.trim();
    const intro = document.getElementById('knowledgeIntroInput').value.trim();
    const department = document.getElementById('knowledgeDepartmentInput').value;
    const tags = selectedModalTags();
    const duplicate = rows.some(row => row.name === name && row.name !== editingKnowledgeName);
    document.getElementById('knowledgeNameError').textContent = !name ? '请输入知识库名称' : duplicate ? '知识库名称已存在，请更换名称' : '';
    document.getElementById('knowledgeIntroError').textContent = !intro ? '请输入知识库简介' : '';
    document.getElementById('knowledgeTagsError').textContent = !tags.length ? '请至少选择一个内容标签' : '';
    document.getElementById('knowledgeDepartmentError').textContent = !department ? '请选择所属部门' : '';
    return { valid: Boolean(name && intro && tags.length && department && !duplicate), name, intro, tags, department };
  }

  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('knowledgeToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  view.addEventListener('input', event => {
    if (event.target.matches('#knowledgeSearch')) render();
  });
  view.addEventListener('change', event => {
    if (event.target.matches('#knowledgeTagFilter')) render();
  });
  view.addEventListener('click', event => {
    if (event.target.closest('[data-create-knowledge]')) return openKnowledgeModal();
    const editAction = event.target.closest('[data-edit-knowledge]');
    if (editAction) return openKnowledgeModal(editAction.dataset.editKnowledge);
    const viewAction = event.target.closest('[data-view-knowledge]');
    if (viewAction) return openKnowledgeDetail(viewAction.dataset.viewKnowledge);
    const deleteAction = event.target.closest('[data-delete-knowledge]');
    if (deleteAction) {
      const name = deleteAction.dataset.deleteKnowledge;
      if (!window.confirm(`确认删除知识库“${name}”吗？删除后不可恢复。`)) return;
      const index = rows.findIndex(row => row.name === name);
      if (index >= 0) rows.splice(index, 1);
      render();
      showToast(`已删除“${name}”`);
    }
  });

  detailView.addEventListener('input', event => {
    if (event.target.matches('#knowledgeFileSearch')) renderKnowledgeFiles();
  });
  detailView.addEventListener('change', event => {
    if (event.target.matches('#knowledgeFileType')) renderKnowledgeFiles();
  });
  detailView.addEventListener('click', event => {
    const currentName = detailView.dataset.knowledgeName || '知识库';
    if (event.target.closest('[data-back-knowledge-list]')) return returnToKnowledgeList();
    if (event.target.closest('[data-edit-current-knowledge]')) return openKnowledgeModal(currentName);
    if (event.target.closest('[data-upload-knowledge-file]')) return openKnowledgeUpload();
    const files = filesForKnowledge(currentKnowledgeRow());
    const viewFile = event.target.closest('[data-view-knowledge-file]');
    if (viewFile) return openKnowledgePreview(files[Number(viewFile.dataset.viewKnowledgeFile)]);
    const replaceFile = event.target.closest('[data-replace-knowledge-file]');
    if (replaceFile) {
      replaceTargetIndex = Number(replaceFile.dataset.replaceKnowledgeFile);
      replaceInput.value = '';
      replaceInput.click();
      return;
    }
    const deleteFile = event.target.closest('[data-delete-knowledge-file]');
    if (deleteFile) {
      const index = Number(deleteFile.dataset.deleteKnowledgeFile);
      const file = files[index];
      if (!file || !window.confirm(`确认删除文件“${file.name}”吗？删除后不可恢复。`)) return;
      files.splice(index, 1);
      adjustKnowledgeCount(currentKnowledgeRow(), -1);
      renderKnowledgeFiles();
      render();
      showToast(`已删除“${file.name}”`);
    }
  });

  document.getElementById('knowledgeUploadInput').addEventListener('change', event => {
    addUploadFiles(event.target.files);
    event.target.value = '';
  });
  document.getElementById('knowledgeUploadGrid').addEventListener('dragover', event => {
    event.preventDefault();
    event.currentTarget.classList.add('is-dragover');
  });
  document.getElementById('knowledgeUploadGrid').addEventListener('dragleave', event => {
    if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.classList.remove('is-dragover');
  });
  document.getElementById('knowledgeUploadGrid').addEventListener('drop', event => {
    event.preventDefault();
    event.currentTarget.classList.remove('is-dragover');
    addUploadFiles(event.dataTransfer?.files);
  });
  uploadMask.addEventListener('click', event => {
    if (event.target === uploadMask || event.target.closest('[data-close-knowledge-upload]')) return closeKnowledgeUpload();
    if (event.target.closest('[data-trigger-knowledge-upload]')) return document.getElementById('knowledgeUploadInput').click();
    const remove = event.target.closest('[data-remove-knowledge-upload]');
    if (remove) {
      uploadState.files.splice(Number(remove.dataset.removeKnowledgeUpload), 1);
      renderUploadFiles();
      return;
    }
    if (event.target.closest('[data-confirm-knowledge-upload]')) {
      const row = currentKnowledgeRow();
      const records = uploadState.files.map(createKnowledgeFile);
      filesForKnowledge(row).unshift(...records);
      adjustKnowledgeCount(row, records.length);
      closeKnowledgeUpload();
      renderKnowledgeFiles();
      render();
      showToast(`已成功上传 ${records.length} 个文件`);
    }
  });
  previewBackdrop.addEventListener('click', closeKnowledgePreview);
  previewDrawer.addEventListener('click', event => {
    if (event.target.closest('[data-close-knowledge-preview]')) closeKnowledgePreview();
  });
  replaceInput.addEventListener('change', event => {
    const file = event.target.files?.[0];
    const files = filesForKnowledge(currentKnowledgeRow());
    const previous = files[replaceTargetIndex];
    if (!file) return;
    if (!isAcceptedKnowledgeFile(file)) {
      showToast('替换文件格式不支持或文件超过 50MB');
      event.target.value = '';
      return;
    }
    if (!previous) return;
    files[replaceTargetIndex] = createKnowledgeFile(file);
    const row = currentKnowledgeRow();
    row.updated = currentTimeText();
    document.getElementById('knowledgeDetailUpdated').textContent = row.updated;
    renderKnowledgeFiles();
    render();
    showToast(`已用“${file.name}”替换“${previous.name}”`);
    event.target.value = '';
    replaceTargetIndex = -1;
  });

  modalMask.addEventListener('click', event => {
    if (event.target === modalMask || event.target.closest('[data-close-knowledge-modal]')) closeKnowledgeModal();
  });
  modalMask.addEventListener('change', event => {
    if (event.target.matches('input[name="knowledgeTags"]')) updateSelectedTagText();
    if (event.target.matches('#knowledgeDepartmentInput') && event.target.value) document.getElementById('knowledgeDepartmentError').textContent = '';
  });
  modalMask.addEventListener('input', event => {
    if (event.target.matches('#knowledgeIntroInput')) {
      document.getElementById('knowledgeIntroCount').textContent = String(event.target.value.length);
      if (event.target.value.trim()) document.getElementById('knowledgeIntroError').textContent = '';
    }
    if (event.target.matches('#knowledgeNameInput') && event.target.value.trim()) document.getElementById('knowledgeNameError').textContent = '';
  });
  document.getElementById('knowledgeForm').addEventListener('submit', event => {
    event.preventDefault();
    const result = validateKnowledgeForm();
    if (!result.valid) {
      modalMask.querySelector('.knowledge-field-error:not(:empty)')?.previousElementSibling?.focus?.();
      return;
    }
    const now = new Date();
    const updated = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const existing = rows.find(row => row.name === editingKnowledgeName);
    if (existing) {
      const oldName = existing.name;
      existing.name = result.name;
      existing.intro = result.intro;
      existing.tags = result.tags;
      existing.department = result.department;
      existing.updated = updated;
      if (oldName !== result.name && knowledgeFiles[oldName]) {
        knowledgeFiles[result.name] = knowledgeFiles[oldName];
        delete knowledgeFiles[oldName];
      }
      if (detailView.dataset.knowledgeName === oldName) detailView.dataset.knowledgeName = result.name;
      closeKnowledgeModal();
      render();
      if (detailView.classList.contains('active')) openKnowledgeDetail(result.name);
      showToast(`已保存“${result.name}”`);
      return;
    }
    rows.unshift({ name: result.name, intro: result.intro, tags: result.tags, count: '0 份', updated, department: result.department });
    knowledgeFiles[result.name] = [];
    closeKnowledgeModal();
    document.getElementById('knowledgeSearch').value = '';
    document.getElementById('knowledgeTagFilter').value = '';
    render();
    showToast(`知识库“${result.name}”创建成功`);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (previewDrawer.classList.contains('open')) return closeKnowledgePreview();
    if (uploadMask.classList.contains('open')) return closeKnowledgeUpload();
    if (modalMask.classList.contains('open')) closeKnowledgeModal();
  });

  document.addEventListener('click', event => {
    const menuEntry = event.target.closest('#listPage .menu [data-list-view], #listPage .menu [data-service-view], #listPage .menu [data-patient-team-list]');
    if (!menuEntry) return;
    detailView.classList.remove('active');
    document.querySelector('#listPage .list-main')?.classList.remove('knowledge-detail-main');
  });

  render();
})();
