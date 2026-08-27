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
    '健康饮食与营养管理': [
      { name: '慢病患者膳食营养指导原则.pdf', type: 'PDF', size: '3.2MB', updated: '2026-08-25 14:20' },
      { name: '糖尿病患者一周食谱模板.docx', type: 'DOCX', size: '1.1MB', updated: '2026-08-24 10:15' },
      { name: '高血压低盐饮食宣教手册.pdf', type: 'PDF', size: '2.4MB', updated: '2026-08-22 16:30' },
      { name: '营养风险筛查问题清单.txt', type: 'TXT', size: '96KB', updated: '2026-08-20 09:18' },
      { name: '特殊人群饮食注意事项.docx', type: 'DOCX', size: '840KB', updated: '2026-08-18 15:42' }
    ],
    'CKD全程管理知识库': [
      { name: '慢性肾脏病分期与诊疗路径.pdf', type: 'PDF', size: '3.6MB', updated: '2026-08-24 09:45' },
      { name: 'CKD患者肾功能监测项目清单.docx', type: 'DOCX', size: '980KB', updated: '2026-08-23 14:12' },
      { name: '肾病患者低盐优质低蛋白饮食手册.pdf', type: 'PDF', size: '2.7MB', updated: '2026-08-22 10:30' },
      { name: 'CKD随访分层与预警规则.docx', type: 'DOCX', size: '1.4MB', updated: '2026-08-20 16:40' },
      { name: '肾功能异常患者用药注意事项.txt', type: 'TXT', size: '188KB', updated: '2026-08-19 08:50' }
    ],
    '糖尿病患者教育中心': [
      { name: '2型糖尿病患者健康教育手册.pdf', type: 'PDF', size: '4.1MB', updated: '2026-08-23 17:40' },
      { name: '胰岛素注射操作规范.docx', type: 'DOCX', size: '1.3MB', updated: '2026-08-22 13:26' },
      { name: '低血糖识别与应急处置流程.pdf', type: 'PDF', size: '1.9MB', updated: '2026-08-21 10:08' },
      { name: '居家血糖监测记录说明.txt', type: 'TXT', size: '72KB', updated: '2026-08-19 16:12' },
      { name: '糖尿病足日常护理要点.docx', type: 'DOCX', size: '980KB', updated: '2026-08-17 11:35' }
    ],
    '高血压规范管理': [
      { name: '中国高血压防治指导要点.pdf', type: 'PDF', size: '3.8MB', updated: '2026-08-22 15:15' },
      { name: '家庭血压测量标准操作.docx', type: 'DOCX', size: '760KB', updated: '2026-08-21 09:42' },
      { name: '降压药物服用注意事项.txt', type: 'TXT', size: '84KB', updated: '2026-08-19 14:18' },
      { name: '高血压患者复诊评估表.docx', type: 'DOCX', size: '620KB', updated: '2026-08-17 10:30' }
    ],
    '医院核心制度与质量安全': [
      { name: '医疗质量安全核心制度汇编.pdf', type: 'PDF', size: '5.6MB', updated: '2026-08-21 11:20' },
      { name: '患者安全目标实施细则.docx', type: 'DOCX', size: '1.5MB', updated: '2026-08-20 15:10' },
      { name: '医疗不良事件上报流程.pdf', type: 'PDF', size: '1.2MB', updated: '2026-08-19 09:28' },
      { name: '危急值报告与处置规范.docx', type: 'DOCX', size: '920KB', updated: '2026-08-17 14:36' },
      { name: '质量安全检查常见问题.txt', type: 'TXT', size: '112KB', updated: '2026-08-15 17:05' }
    ],
    '门诊与住院就诊流程': [
      { name: '门诊预约挂号与报到指南.pdf', type: 'PDF', size: '2.2MB', updated: '2026-08-20 17:05' },
      { name: '住院患者入出院办理流程.docx', type: 'DOCX', size: '1.1MB', updated: '2026-08-19 13:42' },
      { name: '转诊转院办理须知.pdf', type: 'PDF', size: '1.4MB', updated: '2026-08-17 10:20' },
      { name: '检查检验服务常见问题.txt', type: 'TXT', size: '104KB', updated: '2026-08-15 16:18' }
    ],
    '临床护理操作规范': [
      { name: '临床基础护理技术操作规范.pdf', type: 'PDF', size: '6.2MB', updated: '2026-08-19 10:50' },
      { name: '静脉管路维护操作流程.docx', type: 'DOCX', size: '1.4MB', updated: '2026-08-18 15:22' },
      { name: '压力性损伤预防护理规范.pdf', type: 'PDF', size: '2.7MB', updated: '2026-08-17 09:16' },
      { name: '住院患者跌倒风险处置流程.docx', type: 'DOCX', size: '860KB', updated: '2026-08-15 14:08' },
      { name: '护理记录书写常见问题.txt', type: 'TXT', size: '132KB', updated: '2026-08-13 11:40' }
    ],
    '常用药物安全手册': [
      { name: '常用药物临床使用手册.pdf', type: 'PDF', size: '4.9MB', updated: '2026-08-18 13:36' },
      { name: '高警示药品管理目录.docx', type: 'DOCX', size: '780KB', updated: '2026-08-17 10:24' },
      { name: '药物相互作用查询要点.pdf', type: 'PDF', size: '2.1MB', updated: '2026-08-15 15:12' },
      { name: '患者用药教育标准话术.txt', type: 'TXT', size: '118KB', updated: '2026-08-13 09:46' }
    ],
    '患者随访服务标准': [
      { name: '出院患者随访服务规范.pdf', type: 'PDF', size: '2.8MB', updated: '2026-08-17 16:10' },
      { name: '慢病患者随访记录模板.docx', type: 'DOCX', size: '640KB', updated: '2026-08-16 11:32' },
      { name: '失访患者处置流程.docx', type: 'DOCX', size: '720KB', updated: '2026-08-14 14:25' },
      { name: '随访沟通标准话术.txt', type: 'TXT', size: '146KB', updated: '2026-08-12 10:18' }
    ],
    '肿瘤康复与症状管理': [
      { name: '肿瘤患者康复管理指南.pdf', type: 'PDF', size: '4.6MB', updated: '2026-08-16 09:25' },
      { name: '癌痛评估与分级处置规范.docx', type: 'DOCX', size: '1.2MB', updated: '2026-08-15 13:48' },
      { name: '化疗常见症状居家管理手册.pdf', type: 'PDF', size: '3.1MB', updated: '2026-08-14 10:36' },
      { name: '肿瘤患者营养支持建议.docx', type: 'DOCX', size: '960KB', updated: '2026-08-12 15:20' },
      { name: '康复随访重点问题.txt', type: 'TXT', size: '108KB', updated: '2026-08-10 11:08' }
    ],
    '互联网医院运营规范': [
      { name: '互联网诊疗服务管理规范.pdf', type: 'PDF', size: '3.4MB', updated: '2026-08-15 18:00' },
      { name: '线上问诊服务操作流程.docx', type: 'DOCX', size: '1.1MB', updated: '2026-08-14 14:42' },
      { name: '电子处方审核与流转规则.pdf', type: 'PDF', size: '2.3MB', updated: '2026-08-12 09:35' },
      { name: '线上服务隐私保护要点.txt', type: 'TXT', size: '126KB', updated: '2026-08-10 16:24' }
    ]
  };
  rows.forEach(row => { row.count = `${(knowledgeFiles[row.name] || []).length} 份`; });

  const style = document.createElement('style');
  style.id = 'knowledgeBaseStyles';
  style.textContent = `
    .knowledge-base-view { padding: 14px; }
    .knowledge-base-view .knowledge-toolbar { flex: 0 0 48px; }
    .knowledge-base-view .knowledge-search { width: 230px; }
    .knowledge-tag-filter { position: relative; height: 36px; }
    .knowledge-tag-filter-trigger { width: 176px; height: 36px; padding: 0 11px; display: flex; align-items: center; gap: 8px; border: 1px solid #e6eaf1; border-radius: 4px; color: #526078; background: #fff; font-size: 14px; text-align: left; transition: border-color .2s, box-shadow .2s; }
    .knowledge-tag-filter-trigger:hover, .knowledge-tag-filter-trigger[aria-expanded="true"] { border-color: #4096ff; }
    .knowledge-tag-filter-trigger:focus-visible { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(5,145,255,.1); outline: 0; }
    .knowledge-tag-filter-trigger span { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .knowledge-tag-filter-trigger svg { width: 14px; height: 14px; flex: 0 0 auto; transition: transform .16s cubic-bezier(.16,1,.3,1); }
    .knowledge-tag-filter-trigger[aria-expanded="true"] svg { transform: rotate(180deg); }
    .knowledge-tag-filter-panel { position: absolute; z-index: 40; top: 42px; left: 0; width: 210px; padding: 8px; border: 1px solid #e6eaf1; border-radius: 6px; background: #fff; box-shadow: 0 8px 24px rgba(32,52,85,.14); }
    .knowledge-tag-filter-panel[hidden] { display: none; }
    .knowledge-tag-filter-options { max-height: 264px; overflow: auto; }
    .knowledge-tag-filter-option { min-height: 34px; padding: 0 8px; display: flex; align-items: center; gap: 8px; border-radius: 4px; color: #263752; cursor: pointer; }
    .knowledge-tag-filter-option:hover { background: #f5f8ff; }
    .knowledge-tag-filter-option input { width: 16px; height: 16px; accent-color: #1677ff; }
    .knowledge-tag-filter-clear { width: 100%; height: 32px; margin-top: 6px; border-top: 1px solid #f0f0f0; color: #1677ff; font-size: 14px; }
    .knowledge-tag-filter-clear:hover { background: #f5f8ff; }
    .knowledge-base-view .knowledge-create { margin-left: auto; }
    .knowledge-table-wrap { flex: 1; min-height: 0; overflow: hidden; }
    .knowledge-table th, .knowledge-table td { padding-inline: 12px; }
    .knowledge-table td:last-child { overflow: visible; }
    .knowledge-table tbody tr[data-open-knowledge] { cursor: pointer; }
    .knowledge-table tbody tr[data-open-knowledge]:focus-visible { outline: 2px solid #91caff; outline-offset: -2px; background: #f5f8ff; }
    .knowledge-table tbody tr.knowledge-row-menu-open { position: relative; z-index: 6; }
    .knowledge-name-cell { min-width: 0; color: #25324a; font-weight: 600; }
    .knowledge-tags { position: relative; display: flex; align-items: center; flex-wrap: nowrap; gap: 5px; white-space: nowrap; }
    .knowledge-content-tag { min-height: 22px; padding: 2px 9px; display: inline-flex; align-items: center; border-radius: 5px; font-size: 13px; line-height: 18px; }
    .knowledge-content-tag.blue { color: #2b6ae2; background: #eaf2ff; }
    .knowledge-content-tag.green { color: #15945b; background: #e9f8f0; }
    .knowledge-content-tag.purple { color: #7050d8; background: #f0edff; }
    .knowledge-content-tag.orange { color: #e58c16; background: #fff5e6; }
    .knowledge-content-tag.cyan { color: #159897; background: #e9f8f8; }
    .knowledge-tag-more { min-height: 22px; padding: 2px 8px; display: inline-flex; align-items: center; border: 0; border-radius: 5px; color: #526078; background: #f0f3f8; font-size: 13px; line-height: 18px; cursor: pointer; transition: color .15s, background .15s; }
    .knowledge-tag-more:hover, .knowledge-tag-more[aria-expanded="true"] { color: #1677ff; background: #e6f4ff; }
    .knowledge-tag-more:focus-visible { outline: 2px solid rgba(49,84,255,.25); outline-offset: 2px; }
    .knowledge-tag-popover { position: fixed; z-index: 12030; min-width: 96px; max-width: 280px; padding: 8px; display: flex; flex-wrap: wrap; gap: 6px; border: 1px solid #d9e2f0; border-radius: 6px; background: #fff; box-shadow: 0 8px 24px rgba(32,52,85,.18); }
    .knowledge-tag-popover[hidden] { display: none; }
    .knowledge-row-action-wrap { position: relative; display: inline-block; }
    .knowledge-row-more { width: 30px; height: 30px; display: inline-grid; place-items: center; border-radius: 4px; color: #526078; font-size: 18px; letter-spacing: 1px; }
    .knowledge-row-more:hover, .knowledge-row-more[aria-expanded="true"] { color: #1677ff; background: #eaf2ff; }
    .knowledge-row-menu { position: absolute; z-index: 45; top: 34px; right: 0; width: 96px; padding: 4px; display: grid; border: 1px solid #e6eaf1; border-radius: 6px; background: #fff; box-shadow: 0 8px 24px rgba(32,52,85,.16); }
    .knowledge-row-menu[hidden] { display: none; }
    .knowledge-row-action { height: 32px; padding: 0 10px; border-radius: 4px; color: #263752; font-size: 14px; text-align: left; }
    .knowledge-row-action:hover { color: #1677ff; background: #f5f8ff; }
    .knowledge-row-action.danger { color: #ff4d4f; }
    .knowledge-row-action.danger:hover { color: #d9363e; background: #fff1f0; }
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
    .knowledge-file-table-wrap { margin-top: 28px; overflow: visible; }
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
    .knowledge-file-table th:last-child, .knowledge-file-table td:last-child { overflow: visible; text-align: center; }
    .knowledge-file-table tbody tr.knowledge-file-menu-open { position: relative; z-index: 8; }
    .knowledge-file-action-wrap { position: relative; display: inline-block; }
    .knowledge-file-more { width: 30px; height: 30px; display: inline-grid; place-items: center; border-radius: 4px; color: #526078; background: transparent; font-size: 18px; line-height: 1; letter-spacing: 1px; transition: color .2s, background .2s; }
    .knowledge-file-more:hover, .knowledge-file-more[aria-expanded="true"] { color: #1677ff; background: #eaf2ff; }
    .knowledge-file-menu { position: absolute; z-index: 60; top: 34px; right: 0; width: 96px; padding: 4px; display: grid; border: 1px solid #e6eaf1; border-radius: 6px; background: #fff; box-shadow: 0 8px 24px rgba(32,52,85,.16); }
    .knowledge-file-menu[hidden] { display: none; }
    .knowledge-file-action { height: 32px; padding: 0 10px; border-radius: 4px; color: #263752; background: transparent; font-size: 14px; text-align: left; white-space: nowrap; }
    .knowledge-file-action:hover { color: #1677ff; background: #f5f8ff; }
    .knowledge-file-action.danger { color: #ff4d4f; }
    .knowledge-file-action.danger:hover { color: #d9363e; background: #fff1f0; }
    .knowledge-file-empty { height: 220px; text-align: center; color: #8e9aab; }
    .knowledge-file-footer { min-height: 78px; margin-top: auto; padding-top: 30px; display: flex; align-items: center; color: #263650; font-size: 16px; }
    .knowledge-file-pagination { margin-left: auto; display: flex; align-items: center; gap: 12px; }
    .knowledge-file-page { width: 44px; height: 46px; display: inline-grid; place-items: center; border: 1px solid #d8e0eb; border-radius: 7px; color: #9eacbe; background: #fff; font-size: 22px; }
    .knowledge-file-page.active { color: #fff; border-color: #1762f1; background: #1762f1; font-size: 16px; }
    .knowledge-file-size { width: 170px; height: 46px; padding: 0 16px; border: 1px solid #d8e0eb; border-radius: 7px; color: #263650; background: #fff; font-size: 16px; }
    .knowledge-detail-edit:focus-visible, .knowledge-file-upload:focus-visible, .knowledge-file-more:focus-visible, .knowledge-file-action:focus-visible, .knowledge-file-page:focus-visible { outline: 2px solid rgba(23,98,241,.3); outline-offset: 2px; }
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
    .knowledge-create-file-input { display: none; }
    .knowledge-create-file-area { width: 100%; }
    .knowledge-create-file-area.has-files { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
    .knowledge-create-upload { width: 100%; min-height: 76px; padding: 14px 18px; display: flex; align-items: center; justify-content: center; gap: 12px; border: 1px dashed #d9d9d9; border-radius: 6px; color: #595959; background: #fafafa; text-align: left; transition: border-color .2s, background .2s; }
    .knowledge-create-upload:hover, .knowledge-create-upload.is-dragover { color: #1677ff; border-color: #1677ff; background: #f0f7ff; }
    .knowledge-create-upload:disabled { color: #bfbfbf; border-color: #d9d9d9; background: #f5f5f5; cursor: not-allowed; }
    .knowledge-create-upload:focus-visible { outline: 2px solid rgba(22,119,255,.22); outline-offset: 2px; }
    .knowledge-create-upload svg { width: 24px; height: 24px; flex: 0 0 auto; }
    .knowledge-create-upload-copy { display: grid; gap: 3px; }
    .knowledge-create-upload-copy strong { color: #262626; font-size: 14px; font-weight: 500; }
    .knowledge-create-upload-copy small { color: #8c8c8c; font-size: 12px; font-weight: 400; }
    .knowledge-create-upload-plus { display: none; font-size: 24px; font-weight: 300; line-height: 1; }
    .knowledge-create-file-list { display: grid; gap: 8px; margin-top: 10px; }
    .knowledge-create-file-list:empty { display: none; }
    .knowledge-create-file-area.has-files .knowledge-create-file-list { display: contents; }
    .knowledge-create-file-area.has-files .knowledge-create-upload { width: 38px; min-height: 38px; height: 38px; padding: 0; flex: 0 0 38px; gap: 0; }
    .knowledge-create-file-area.has-files .knowledge-create-upload > svg, .knowledge-create-file-area.has-files .knowledge-create-upload-copy { display: none; }
    .knowledge-create-file-area.has-files .knowledge-create-upload-plus { display: inline; }
    .knowledge-create-file-item { min-width: 220px; min-height: 38px; padding: 6px 8px; flex: 1 1 280px; display: flex; align-items: center; gap: 9px; border: 1px solid #f0f0f0; border-radius: 6px; background: #fff; }
    .knowledge-create-file-type { min-width: 38px; height: 24px; padding: 0 6px; display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; color: #1677ff; background: #e6f4ff; font-size: 11px; font-weight: 600; }
    .knowledge-create-file-name { min-width: 0; flex: 1; overflow: hidden; color: #262626; text-overflow: ellipsis; white-space: nowrap; }
    .knowledge-create-file-size { color: #8c8c8c; font-size: 12px; white-space: nowrap; }
    .knowledge-create-file-remove { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 4px; color: #8c8c8c; font-size: 18px; }
    .knowledge-create-file-remove:hover { color: #ff4d4f; background: #fff1f0; }
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
    .knowledge-preview-drawer { position: fixed; z-index: 12040; top: 0; right: 0; width: min(760px, calc(100vw - 32px)); height: 100vh; display: flex; flex-direction: column; background: #525659; border-left: 1px solid #3f4248; box-shadow: -16px 0 40px rgba(15,28,51,.2); transform: translateX(102%); transition: transform .22s ease; }
    .knowledge-preview-drawer.open { transform: translateX(0); }
    .knowledge-preview-close { position: absolute; z-index: 3; top: 12px; right: 12px; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 6px; color: #fff; background: rgba(20,24,30,.72); font-size: 22px; box-shadow: 0 4px 12px rgba(0,0,0,.2); }
    .knowledge-preview-close:hover { color: #fff; background: rgba(20,24,30,.92); }
    .knowledge-preview-close:focus-visible { outline: 2px solid #91caff; outline-offset: 2px; }
    .knowledge-preview-body { min-height: 0; padding: 0; flex: 1; overflow: auto; background: #525659; }
    .knowledge-preview-body.is-text, .knowledge-preview-body.is-document { padding: 32px; }
    .knowledge-preview-frame { width: 100%; height: 100%; display: block; border: 0; background: #fff; }
    .knowledge-preview-image { max-width: 100%; display: block; margin: 0 auto; border-radius: 6px; box-shadow: 0 3px 16px rgba(0,0,0,.08); }
    .knowledge-preview-document { width: min(100%, 680px); min-height: calc(100vh - 64px); margin: 0 auto; padding: 56px 64px; color: #263752; background: #fff; box-shadow: 0 4px 18px rgba(0,0,0,.24); }
    .knowledge-preview-document h1 { margin: 0 0 32px; color: #17243a; font-size: 22px; line-height: 1.5; text-align: center; }
    .knowledge-preview-document h2 { margin: 28px 0 12px; color: #263752; font-size: 16px; }
    .knowledge-preview-document p { margin: 0 0 14px; color: #4d5c74; font-size: 14px; line-height: 1.9; text-indent: 2em; }
    .knowledge-preview-text { min-height: calc(100vh - 64px); margin: 0; padding: 28px; border-radius: 6px; color: #262626; background: #fff; font: 14px/1.8 ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre-wrap; }
    .knowledge-replace-input, .knowledge-upload-input { display: none; }
    @media (max-width: 1180px) { .knowledge-base-view .knowledge-search { width: 200px; } .knowledge-tag-filter-trigger { width: 156px; } .knowledge-detail-summary, .knowledge-detail-content { padding-inline: 14px; } .knowledge-file-search { width: 200px; } .knowledge-file-type select { width: 148px; } }
    @media (max-width: 720px) { .knowledge-modal-mask, .knowledge-upload-mask { padding: 12px; } .knowledge-modal, .knowledge-upload-dialog { width: calc(100vw - 24px); max-height: calc(100vh - 24px); } .knowledge-upload-grid { grid-template-columns: repeat(3,minmax(76px,1fr)); } .knowledge-preview-body.is-text, .knowledge-preview-body.is-document { padding: 16px; } .knowledge-preview-document { padding: 48px 24px; } }
    @media (prefers-reduced-motion: reduce) { .knowledge-base-view * { transition: none !important; } }
  `;
  document.head.appendChild(style);

  const availableTags = ['疾病知识', '慢病管理', '用药指导', '护理规范', '随访管理', '健康宣教', '医保政策', '就诊指引', '患者服务', '医院制度', '质量安全'];
  const filterTagOptions = availableTags.map(tag => `<label class="knowledge-tag-filter-option"><input type="checkbox" name="knowledgeTagFilters" value="${tag}"><span>${tag}</span></label>`).join('');
  const view = document.createElement('section');
  view.className = 'list-panel list-view knowledge-base-view';
  view.id = 'knowledgeBaseView';
  view.setAttribute('aria-label', '知识库');
  view.setAttribute('data-persistence-ignore', '');
  view.innerHTML = `
    <div class="toolbar knowledge-toolbar">
      <label class="search knowledge-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg><input id="knowledgeSearch" data-persistence-ignore autocomplete="off" placeholder="搜索知识库名称" aria-label="搜索知识库名称"></label>
      <div class="knowledge-tag-filter"><button class="knowledge-tag-filter-trigger" id="knowledgeTagFilterButton" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="knowledgeTagFilterPanel"><span id="knowledgeTagFilterSummary">全部内容标签</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></button><div class="knowledge-tag-filter-panel" id="knowledgeTagFilterPanel" role="group" aria-label="内容标签多选" hidden><div class="knowledge-tag-filter-options">${filterTagOptions}</div><button class="knowledge-tag-filter-clear" type="button" data-clear-knowledge-tag-filter>清空筛选</button></div></div>
      <button class="primary knowledge-create" type="button" data-create-knowledge><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg><span>创建知识库</span></button>
    </div>
    <div class="table-wrap knowledge-table-wrap">
      <table class="knowledge-table">
        <colgroup><col style="width:20%"><col style="width:35%"><col style="width:13%"><col style="width:8%"><col style="width:16%"><col style="width:8%"></colgroup>
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
        <label class="knowledge-file-type"><select id="knowledgeFileType" data-persistence-ignore aria-label="文件类型"><option value="">文件类型：全部</option><option value="PDF">文件类型：PDF</option><option value="DOCX">文件类型：DOCX</option><option value="TXT">文件类型：TXT</option></select></label>
        <button class="knowledge-file-upload" type="button" data-upload-knowledge-file><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 16V4M7 9l5-5 5 5M5 15v5h14v-5"/></svg>上传文件</button>
      </div>
      <div class="knowledge-file-table-wrap">
        <table class="knowledge-file-table"><colgroup><col style="width:40%"><col style="width:12%"><col style="width:12%"><col style="width:28%"><col style="width:8%"></colgroup><thead><tr><th>文件名称</th><th>类型</th><th>大小</th><th>最近更新时间</th><th>操作</th></tr></thead><tbody id="knowledgeFileRows"></tbody></table>
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
          <div class="knowledge-field"><span class="knowledge-field-label">添加文件</span><input class="knowledge-create-file-input" id="knowledgeCreateFileInput" type="file" accept=".pdf,.docx,.txt" multiple><div class="knowledge-create-file-area" id="knowledgeCreateFileArea"><div class="knowledge-create-file-list" id="knowledgeCreateFileList" aria-live="polite"></div><button class="knowledge-create-upload" id="knowledgeCreateUpload" type="button" data-trigger-knowledge-create-files aria-label="添加文件"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 16V4M7 9l5-5 5 5M5 15v5h14v-5"/></svg><span class="knowledge-create-upload-copy"><strong>点击或拖拽文件到此处添加</strong><small>支持 PDF、DOCX、TXT，单个文件不超过 50MB，最多 20 个</small></span><span class="knowledge-create-upload-plus" aria-hidden="true">＋</span></button></div></div>
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
        <p class="knowledge-upload-tip">支持拖拽或点击批量上传，最多 20 个文件；支持 PDF、DOCX、TXT 格式，单个文件不超过 50MB。</p>
        <input class="knowledge-upload-input" id="knowledgeUploadInput" type="file" accept=".pdf,.docx,.txt" multiple>
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
  previewDrawer.setAttribute('aria-label', '文件内容查看');
  previewDrawer.innerHTML = `
    <button class="knowledge-preview-close" type="button" data-close-knowledge-preview aria-label="关闭文件查看">×</button>
    <div class="knowledge-preview-body" id="knowledgePreviewBody"></div>`;
  document.body.append(previewBackdrop, previewDrawer);

  const replaceInput = document.createElement('input');
  replaceInput.className = 'knowledge-replace-input';
  replaceInput.id = 'knowledgeReplaceInput';
  replaceInput.type = 'file';
  replaceInput.accept = '.pdf,.docx,.txt';
  document.body.appendChild(replaceInput);

  const tagPopover = document.createElement('div');
  tagPopover.className = 'knowledge-tag-popover';
  tagPopover.id = 'knowledgeTagPopover';
  tagPopover.setAttribute('role', 'tooltip');
  tagPopover.hidden = true;
  document.body.appendChild(tagPopover);
  let activeTagMoreButton = null;

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

  function renderTableTags(tags) {
    if (!tags.length) return '<span class="knowledge-content-tag blue">未分类</span>';
    const first = `<span class="knowledge-content-tag ${tagClass(tags[0])}">${escapeHtml(tags[0])}</span>`;
    if (tags.length === 1) return first;
    const hiddenTags = tags.slice(1);
    const encodedTags = encodeURIComponent(JSON.stringify(hiddenTags));
    return `${first}<button class="knowledge-tag-more" type="button" data-show-more-tags="${encodedTags}" aria-haspopup="true" aria-expanded="false" aria-controls="knowledgeTagPopover" aria-label="查看其余 ${hiddenTags.length} 个标签：${escapeHtml(hiddenTags.join('、'))}">+${hiddenTags.length}</button>`;
  }

  function closeTagPopover() {
    if (activeTagMoreButton) activeTagMoreButton.setAttribute('aria-expanded', 'false');
    activeTagMoreButton = null;
    tagPopover.hidden = true;
    tagPopover.innerHTML = '';
  }

  function toggleTagPopover(button) {
    const wasOpen = activeTagMoreButton === button && !tagPopover.hidden;
    closeTagPopover();
    if (wasOpen) return;
    let tags = [];
    try { tags = JSON.parse(decodeURIComponent(button.dataset.showMoreTags || '[]')); } catch { tags = []; }
    if (!tags.length) return;
    tagPopover.innerHTML = tags.map(tag => `<span class="knowledge-content-tag ${tagClass(tag)}">${escapeHtml(tag)}</span>`).join('');
    tagPopover.hidden = false;
    activeTagMoreButton = button;
    button.setAttribute('aria-expanded', 'true');
    const triggerRect = button.getBoundingClientRect();
    const panelRect = tagPopover.getBoundingClientRect();
    const gap = 8;
    const edge = 12;
    const left = Math.max(edge, Math.min(triggerRect.left, window.innerWidth - panelRect.width - edge));
    const canOpenBelow = triggerRect.bottom + gap + panelRect.height <= window.innerHeight - edge;
    const top = canOpenBelow ? triggerRect.bottom + gap : Math.max(edge, triggerRect.top - panelRect.height - gap);
    tagPopover.style.left = `${Math.round(left)}px`;
    tagPopover.style.top = `${Math.round(top)}px`;
  }

  function selectedFilterTags() {
    return [...view.querySelectorAll('input[name="knowledgeTagFilters"]:checked')].map(input => input.value);
  }

  function updateFilterSummary() {
    const selected = selectedFilterTags();
    document.getElementById('knowledgeTagFilterSummary').textContent = selected.length ? `已选 ${selected.length} 个标签` : '全部内容标签';
  }

  function closeTagFilter() {
    document.getElementById('knowledgeTagFilterPanel').hidden = true;
    document.getElementById('knowledgeTagFilterButton').setAttribute('aria-expanded', 'false');
  }

  function closeRowMenus(except) {
    view.querySelectorAll('.knowledge-row-menu').forEach(menu => {
      if (menu === except) return;
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
      menu.closest('tr')?.classList.remove('knowledge-row-menu-open');
    });
  }

  function closeFileMenus(except) {
    detailView.querySelectorAll('.knowledge-file-menu').forEach(menu => {
      if (menu === except) return;
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
      menu.closest('tr')?.classList.remove('knowledge-file-menu-open');
    });
  }

  function filesForKnowledge(row) {
    if (!knowledgeFiles[row.name]) {
      knowledgeFiles[row.name] = [];
    }
    return knowledgeFiles[row.name];
  }

  function countTextFor(row) {
    return `${filesForKnowledge(row).length} 份`;
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
    if (['PDF', 'DOCX', 'TXT'].includes(extension)) return extension;
    return 'FILE';
  }

  function fileSize(size) {
    const bytes = Number(size) || 0;
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)}MB`;
    return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  }

  function isAcceptedKnowledgeFile(file) {
    return /\.(pdf|docx|txt)$/i.test(file.name || '') && Number(file.size || 0) <= 50 * 1024 * 1024;
  }

  function createKnowledgeFile(file) {
    return { name: file.name, type: fileType(file), size: fileSize(file.size), updated: currentTimeText(), sourceFile: file };
  }

  function adjustKnowledgeCount(row) {
    row.count = countTextFor(row);
    row.updated = currentTimeText();
    document.getElementById('knowledgeDetailCount').textContent = row.count;
    document.getElementById('knowledgeDetailUpdated').textContent = row.updated;
  }

  function fileIcon(file) {
    const label = file.type === 'DOCX' ? 'W' : file.type === 'TXT' ? 'T' : '⌁';
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
      return `<tr><td><div class="knowledge-file-name">${fileIcon(file)}<span title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span></div></td><td>${file.type}</td><td>${file.size}</td><td>${file.updated}</td><td><span class="knowledge-file-action-wrap"><button class="knowledge-file-more" type="button" data-toggle-knowledge-file-actions aria-haspopup="menu" aria-expanded="false" aria-label="${escapeHtml(file.name)}的更多操作">•••</button><span class="knowledge-file-menu" role="menu" hidden><button class="knowledge-file-action" role="menuitem" type="button" data-view-knowledge-file="${index}">查看</button><button class="knowledge-file-action" role="menuitem" type="button" data-replace-knowledge-file="${index}">替换</button><button class="knowledge-file-action danger" role="menuitem" type="button" data-delete-knowledge-file="${index}">删除</button></span></span></td></tr>`;
    }).join('') : '<tr><td class="knowledge-file-empty" colspan="5">暂无符合条件的文件，请调整文件名称或类型</td></tr>';
  }

  const uploadState = { files: [] };
  const createFileState = { files: [] };
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
    if (accepted.length !== incoming.length) showToast('仅支持 PDF、DOCX、TXT，且单个文件不超过 50MB');
    if (accepted.length > available) showToast('单次最多上传 20 个文件');
    renderUploadFiles();
  }

  function renderCreateFiles() {
    const list = document.getElementById('knowledgeCreateFileList');
    if (!list) return;
    list.innerHTML = createFileState.files.map((file, index) => {
      const isExisting = typeof file.size === 'string';
      const type = isExisting ? file.type : fileType(file);
      const size = isExisting ? file.size : fileSize(file.size);
      return `<div class="knowledge-create-file-item"><span class="knowledge-create-file-type">${escapeHtml(type)}</span><span class="knowledge-create-file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span><span class="knowledge-create-file-size">${escapeHtml(size)}</span><button class="knowledge-create-file-remove" type="button" data-remove-knowledge-create-file="${index}" aria-label="移除${escapeHtml(file.name)}">×</button></div>`;
    }).join('');
    document.getElementById('knowledgeCreateFileArea')?.classList.toggle('has-files', createFileState.files.length > 0);
    const uploadButton = document.getElementById('knowledgeCreateUpload');
    if (uploadButton) {
      uploadButton.disabled = createFileState.files.length >= 20;
      uploadButton.setAttribute('aria-label', createFileState.files.length ? '继续添加文件' : '添加文件');
      uploadButton.title = createFileState.files.length >= 20 ? '最多添加 20 个文件' : createFileState.files.length ? '继续添加文件' : '';
    }
  }

  function addCreateFiles(fileList) {
    const incoming = Array.from(fileList || []);
    const accepted = incoming.filter(isAcceptedKnowledgeFile);
    const available = Math.max(0, 20 - createFileState.files.length);
    createFileState.files.push(...accepted.slice(0, available));
    if (accepted.length !== incoming.length) showToast('仅支持 PDF、DOCX、TXT，且单个文件不超过 50MB');
    if (accepted.length > available) showToast('最多添加 20 个文件');
    renderCreateFiles();
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

  function demoDocumentContent(file) {
    const title = escapeHtml(String(file.name || '知识库文件').replace(/\.[^.]+$/, ''));
    const topic = title.includes('医保') ? '医保政策适用范围、办理流程、结算规则及常见问题' : title.includes('CKD') || title.includes('肾') ? '诊疗路径、监测指标、护理要求及随访管理要点' : '业务背景、适用范围、执行流程及注意事项';
    return `<article class="knowledge-preview-document"><h1>${title}</h1><h2>一、文件说明</h2><p>本文件用于统一相关知识内容与执行口径，覆盖${topic}，为医护人员和患者服务人员提供工作参考。</p><h2>二、主要内容</h2><p>使用时应结合当前业务场景核对适用条件，按照规定流程完成信息确认、材料准备、业务办理和结果反馈。</p><p>涉及政策、诊疗或服务标准更新时，应以知识库内最新版本为准，并及时同步相关人员。</p><h2>三、注意事项</h2><p>对于信息不完整、适用条件不明确或存在特殊情况的事项，应先完成补充核验，再进入后续处理流程。</p></article>`;
  }

  function openKnowledgePreview(file) {
    if (!file) return;
    closeKnowledgePreview();
    const body = document.getElementById('knowledgePreviewBody');
    body.className = 'knowledge-preview-body';
    body.innerHTML = '';
    if (file.sourceFile && file.type === 'PDF') {
      activePreviewUrl = URL.createObjectURL(file.sourceFile);
      body.innerHTML = `<iframe class="knowledge-preview-frame" src="${activePreviewUrl}#toolbar=1&navpanes=0&view=FitH" title="${escapeHtml(file.name)}预览"></iframe>`;
    } else if (file.sourceFile && file.type === 'TXT') {
      body.classList.add('is-text');
      const text = document.createElement('pre');
      text.className = 'knowledge-preview-text';
      text.textContent = '文件内容加载中...';
      body.appendChild(text);
      const reader = new FileReader();
      reader.onload = () => { text.textContent = String(reader.result || '文件内容为空'); };
      reader.onerror = () => { text.textContent = '文件内容读取失败，请重新选择文件。'; };
      reader.readAsText(file.sourceFile);
    } else {
      body.classList.add('is-document');
      body.innerHTML = demoDocumentContent(file);
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
    row.count = countTextFor(row);
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
    closeTagPopover();
    rows.forEach(row => { row.count = countTextFor(row); });
    const keyword = document.getElementById('knowledgeSearch')?.value.trim().toLowerCase() || '';
    const selectedTags = selectedFilterTags();
    const filtered = rows.filter(row => (!keyword || `${row.name} ${row.intro} ${row.department || ''}`.toLowerCase().includes(keyword)) && (!selectedTags.length || selectedTags.some(tag => row.tags.includes(tag))));
    document.getElementById('knowledgeTotal').textContent = `共 ${filtered.length} 条`;
    document.getElementById('knowledgeRows').innerHTML = filtered.length ? filtered.map(row => `
      <tr data-open-knowledge="${escapeHtml(row.name)}" tabindex="0" aria-label="查看${escapeHtml(row.name)}详情"><td><div class="knowledge-name-cell"><span title="${escapeHtml(row.name)}">${escapeHtml(row.name)}</span></div></td>
      <td title="${escapeHtml(row.intro)}">${escapeHtml(row.intro)}</td><td><div class="knowledge-tags">${renderTableTags(row.tags)}</div></td>
      <td>${row.count}</td><td>${row.updated}</td><td><span class="knowledge-row-action-wrap"><button class="knowledge-row-more" type="button" data-toggle-knowledge-actions aria-haspopup="menu" aria-expanded="false" aria-label="${escapeHtml(row.name)}的更多操作">•••</button><span class="knowledge-row-menu" role="menu" hidden><button class="knowledge-row-action" role="menuitem" type="button" data-edit-knowledge="${escapeHtml(row.name)}">编辑</button><button class="knowledge-row-action" role="menuitem" type="button" data-view-knowledge="${escapeHtml(row.name)}">详情</button><button class="knowledge-row-action danger" role="menuitem" type="button" data-delete-knowledge="${escapeHtml(row.name)}">删除</button></span></span></td></tr>`).join('') : '<tr><td class="knowledge-empty" colspan="6">暂无符合条件的知识库，请调整搜索或内容标签</td></tr>';
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
    createFileState.files = row ? filesForKnowledge(row).map(file => ({ ...file })) : [];
    document.getElementById('knowledgeCreateFileInput').value = '';
    renderCreateFiles();
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
    createFileState.files = [];
    document.getElementById('knowledgeCreateFileInput').value = '';
    renderCreateFiles();
  }

  function validateKnowledgeForm() {
    const name = document.getElementById('knowledgeNameInput').value.trim();
    const intro = document.getElementById('knowledgeIntroInput').value.trim();
    const tags = selectedModalTags();
    const duplicate = rows.some(row => row.name === name && row.name !== editingKnowledgeName);
    document.getElementById('knowledgeNameError').textContent = !name ? '请输入知识库名称' : duplicate ? '知识库名称已存在，请更换名称' : '';
    document.getElementById('knowledgeIntroError').textContent = !intro ? '请输入知识库简介' : '';
    document.getElementById('knowledgeTagsError').textContent = !tags.length ? '请至少选择一个内容标签' : '';
    return { valid: Boolean(name && intro && tags.length && !duplicate), name, intro, tags };
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
    if (event.target.matches('input[name="knowledgeTagFilters"]')) {
      updateFilterSummary();
      render();
    }
  });
  view.addEventListener('click', event => {
    const moreTags = event.target.closest('[data-show-more-tags]');
    if (moreTags) {
      event.stopPropagation();
      closeTagFilter();
      closeRowMenus();
      toggleTagPopover(moreTags);
      return;
    }
    const filterToggle = event.target.closest('#knowledgeTagFilterButton');
    if (filterToggle) {
      const panel = document.getElementById('knowledgeTagFilterPanel');
      const willOpen = panel.hidden;
      closeRowMenus();
      panel.hidden = !willOpen;
      filterToggle.setAttribute('aria-expanded', String(willOpen));
      return;
    }
    if (event.target.closest('[data-clear-knowledge-tag-filter]')) {
      view.querySelectorAll('input[name="knowledgeTagFilters"]').forEach(input => { input.checked = false; });
      updateFilterSummary();
      render();
      return;
    }
    const actionToggle = event.target.closest('[data-toggle-knowledge-actions]');
    if (actionToggle) {
      const menu = actionToggle.nextElementSibling;
      const willOpen = menu.hidden;
      closeTagFilter();
      closeRowMenus(menu);
      menu.hidden = !willOpen;
      actionToggle.setAttribute('aria-expanded', String(willOpen));
      actionToggle.closest('tr')?.classList.toggle('knowledge-row-menu-open', willOpen);
      return;
    }
    if (event.target.closest('[data-create-knowledge]')) return openKnowledgeModal();
    const editAction = event.target.closest('[data-edit-knowledge]');
    if (editAction) {
      closeRowMenus();
      return openKnowledgeModal(editAction.dataset.editKnowledge);
    }
    const viewAction = event.target.closest('[data-view-knowledge]');
    if (viewAction) {
      closeRowMenus();
      return openKnowledgeDetail(viewAction.dataset.viewKnowledge);
    }
    const deleteAction = event.target.closest('[data-delete-knowledge]');
    if (deleteAction) {
      closeRowMenus();
      const name = deleteAction.dataset.deleteKnowledge;
      if (!window.confirm(`确认删除知识库“${name}”吗？删除后不可恢复。`)) return;
      const index = rows.findIndex(row => row.name === name);
      if (index >= 0) rows.splice(index, 1);
      render();
      showToast(`已删除“${name}”`);
      return;
    }
    const knowledgeRow = event.target.closest('[data-open-knowledge]');
    if (knowledgeRow) openKnowledgeDetail(knowledgeRow.dataset.openKnowledge);
  });

  view.addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key) || event.target !== event.target.closest('[data-open-knowledge]')) return;
    event.preventDefault();
    openKnowledgeDetail(event.target.dataset.openKnowledge);
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
    const fileActionToggle = event.target.closest('[data-toggle-knowledge-file-actions]');
    if (fileActionToggle) {
      event.stopPropagation();
      const menu = fileActionToggle.nextElementSibling;
      const willOpen = menu.hidden;
      closeFileMenus(menu);
      menu.hidden = !willOpen;
      fileActionToggle.setAttribute('aria-expanded', String(willOpen));
      fileActionToggle.closest('tr')?.classList.toggle('knowledge-file-menu-open', willOpen);
      return;
    }
    const files = filesForKnowledge(currentKnowledgeRow());
    const viewFile = event.target.closest('[data-view-knowledge-file]');
    if (viewFile) {
      closeFileMenus();
      return openKnowledgePreview(files[Number(viewFile.dataset.viewKnowledgeFile)]);
    }
    const replaceFile = event.target.closest('[data-replace-knowledge-file]');
    if (replaceFile) {
      closeFileMenus();
      replaceTargetIndex = Number(replaceFile.dataset.replaceKnowledgeFile);
      replaceInput.value = '';
      replaceInput.click();
      return;
    }
    const deleteFile = event.target.closest('[data-delete-knowledge-file]');
    if (deleteFile) {
      closeFileMenus();
      const index = Number(deleteFile.dataset.deleteKnowledgeFile);
      const file = files[index];
      if (!file || !window.confirm(`确认删除文件“${file.name}”吗？删除后不可恢复。`)) return;
      files.splice(index, 1);
      adjustKnowledgeCount(currentKnowledgeRow());
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
      adjustKnowledgeCount(row);
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
      showToast('仅支持 PDF、DOCX、TXT，且单个文件不超过 50MB');
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
    if (event.target === modalMask || event.target.closest('[data-close-knowledge-modal]')) return closeKnowledgeModal();
    if (event.target.closest('[data-trigger-knowledge-create-files]')) return document.getElementById('knowledgeCreateFileInput').click();
    const removeFile = event.target.closest('[data-remove-knowledge-create-file]');
    if (removeFile) {
      createFileState.files.splice(Number(removeFile.dataset.removeKnowledgeCreateFile), 1);
      renderCreateFiles();
    }
  });
  modalMask.addEventListener('change', event => {
    if (event.target.matches('input[name="knowledgeTags"]')) updateSelectedTagText();
    if (event.target.matches('#knowledgeCreateFileInput')) {
      addCreateFiles(event.target.files);
      event.target.value = '';
    }
  });
  document.getElementById('knowledgeCreateUpload').addEventListener('dragover', event => {
    event.preventDefault();
    event.currentTarget.classList.add('is-dragover');
  });
  document.getElementById('knowledgeCreateUpload').addEventListener('dragleave', event => {
    event.currentTarget.classList.remove('is-dragover');
  });
  document.getElementById('knowledgeCreateUpload').addEventListener('drop', event => {
    event.preventDefault();
    event.currentTarget.classList.remove('is-dragover');
    addCreateFiles(event.dataTransfer?.files);
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
    const editedFiles = createFileState.files.map(file => typeof file.size === 'string' ? { ...file } : createKnowledgeFile(file));
    if (existing) {
      const oldName = existing.name;
      existing.name = result.name;
      existing.intro = result.intro;
      existing.tags = result.tags;
      existing.updated = updated;
      if (oldName !== result.name) delete knowledgeFiles[oldName];
      knowledgeFiles[result.name] = editedFiles;
      adjustKnowledgeCount(existing);
      if (detailView.dataset.knowledgeName === oldName) detailView.dataset.knowledgeName = result.name;
      closeKnowledgeModal();
      render();
      if (detailView.classList.contains('active')) openKnowledgeDetail(result.name);
      showToast(`已保存“${result.name}”`);
      return;
    }
    rows.unshift({ name: result.name, intro: result.intro, tags: result.tags, count: `${editedFiles.length} 份`, updated });
    knowledgeFiles[result.name] = editedFiles;
    closeKnowledgeModal();
    document.getElementById('knowledgeSearch').value = '';
    view.querySelectorAll('input[name="knowledgeTagFilters"]').forEach(input => { input.checked = false; });
    updateFilterSummary();
    render();
    showToast(`知识库“${result.name}”创建成功`);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (previewDrawer.classList.contains('open')) return closeKnowledgePreview();
    if (uploadMask.classList.contains('open')) return closeKnowledgeUpload();
    if (modalMask.classList.contains('open')) return closeKnowledgeModal();
    closeTagFilter();
    closeRowMenus();
    closeFileMenus();
    closeTagPopover();
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.knowledge-tag-filter')) closeTagFilter();
    if (!event.target.closest('.knowledge-row-action-wrap')) closeRowMenus();
    if (!event.target.closest('.knowledge-file-action-wrap')) closeFileMenus();
    if (!event.target.closest('.knowledge-tag-more') && !event.target.closest('#knowledgeTagPopover')) closeTagPopover();
    const menuEntry = event.target.closest('#listPage .menu [data-list-view], #listPage .menu [data-service-view], #listPage .menu [data-patient-team-list]');
    if (!menuEntry) return;
    detailView.classList.remove('active');
    document.querySelector('#listPage .list-main')?.classList.remove('knowledge-detail-main');
  });

  window.addEventListener('resize', closeTagPopover);
  document.addEventListener('scroll', closeTagPopover, true);

  render();
})();
