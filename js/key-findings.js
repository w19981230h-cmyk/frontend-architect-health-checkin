(function () {
  'use strict';

  var findings = [
    {
      category: '报告单',
      type: '检验报告',
      name: '空腹血糖',
      result: '7.2 mmol/L',
      status: '需关注',
      extra: '参考范围：3.9-6.1 mmol/L',
      date: '2026-08-04'
    },
    {
      category: '报告单',
      type: 'CT报告',
      name: '肺结节',
      result: '约6mm',
      status: '需关注',
      extra: '检查部位：右肺上叶',
      date: '2026-08-04'
    },
    {
      category: '就诊记录',
      type: '出院记录',
      name: '出院诊断',
      result: '急性胆囊炎',
      status: '正常',
      extra: '补充信息：已完成出院随访',
      date: '2026-08-04'
    },
    {
      category: '处方记录',
      type: '处方记录',
      name: '阿托伐他汀',
      result: '20mg',
      status: '正常',
      extra: '剂量用法：每晚一次',
      date: '2026-08-04'
    }
  ];

  function addStyles() {
    if (document.getElementById('codex-key-findings-styles')) return;
    var style = document.createElement('style');
    style.id = 'codex-key-findings-styles';
    style.textContent = [
      '.codex-key-findings{margin:16px 0;padding:18px 20px 14px;border:1px solid #dce7f6;border-radius:10px;background:#f8fbff;color:#243653;}',
      '.codex-key-findings__head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px;}',
      '.codex-key-findings__title{margin:0;border-left:3px solid #315eff;padding-left:10px;font-size:16px;line-height:22px;font-weight:700;}',
      '.codex-key-findings__desc{margin:4px 0 0 13px;color:#8a98ae;font-size:12px;}',
      '.codex-key-findings__count{color:#8a98ae;font-size:12px;white-space:nowrap;padding-top:3px;}',
      '.codex-key-findings__list{display:grid;gap:10px;}',
      '.codex-key-finding{display:grid;grid-template-columns:1fr 1fr 1.2fr 1.15fr 1fr;gap:14px;align-items:center;padding:13px 14px;border:1px solid #e2eaf5;border-radius:8px;background:#fff;}',
      '.codex-key-finding__cell{min-width:0;}',
      '.codex-key-finding__label{display:block;margin-bottom:5px;color:#8a98ae;font-size:11px;}',
      '.codex-key-finding__value{display:block;overflow:hidden;color:#2a3d5d;font-size:13px;font-weight:600;text-overflow:ellipsis;white-space:nowrap;}',
      '.codex-key-finding__result{color:#183b78;font-size:14px;}',
      '.codex-key-finding__status{display:inline-flex;padding:3px 8px;border-radius:999px;font-size:12px;font-weight:600;}',
      '.codex-key-finding__status--normal{color:#19875b;background:#eaf8f1;}',
      '.codex-key-finding__status--attention{color:#c77716;background:#fff4dc;}',
      '.codex-key-finding__source{color:#315eff;text-decoration:none;cursor:pointer;}',
      '.codex-key-findings__item:nth-child(n+4){display:none;}',
      '.codex-key-findings.is-expanded .codex-key-findings__item:nth-child(n+4){display:grid;}',
      '.codex-key-findings__toggle{display:block;margin:12px auto 0;border:0;background:transparent;color:#315eff;font-size:13px;cursor:pointer;}',
      '@media (max-width:900px){.codex-key-finding{grid-template-columns:repeat(2,minmax(0,1fr));}.codex-key-findings.is-expanded .codex-key-findings__item:nth-child(n+4){display:grid;}}',
      '@media (max-width:560px){.codex-key-finding{grid-template-columns:1fr;gap:9px;}.codex-key-findings{padding:14px;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function replaceUploadLabel() {
    document.querySelectorAll('button, a').forEach(function (element) {
      if (element.textContent.trim() === '上传资料') element.textContent = '原件资料';
    });
  }

  function isMedicalRecordsPage() {
    var text = document.body ? document.body.innerText : '';
    return text.indexOf('病历档案') !== -1 && (text.indexOf('AI智能分析') !== -1 || text.indexOf('上传资料') !== -1 || text.indexOf('原件资料') !== -1);
  }

  function findAiSection() {
    var candidates = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,h4,h5,.section-title,.panel-title,.card-title'));
    return candidates.find(function (element) {
      var title = element.textContent.trim();
      return title === 'AI智能分析' || title === 'AI解读摘要';
    });
  }

  function createFindings() {
    if (!isMedicalRecordsPage() || document.querySelector('[data-codex-key-findings]')) return;
    var aiTitle = findAiSection();
    if (!aiTitle || !aiTitle.parentElement) return;

    var section = document.createElement('section');
    section.className = 'codex-key-findings';
    section.setAttribute('data-codex-key-findings', 'true');
    section.innerHTML = [
      '<div class="codex-key-findings__head">',
      '<div><h3 class="codex-key-findings__title">关键发现</h3><p class="codex-key-findings__desc">从原件资料中提取的重点信息</p></div>',
      '<span class="codex-key-findings__count">共 ' + findings.length + ' 条</span>',
      '</div>',
      '<div class="codex-key-findings__list">',
      findings.map(function (item) {
        var statusClass = item.status === '需关注' ? 'codex-key-finding__status--attention' : 'codex-key-finding__status--normal';
        return '<article class="codex-key-finding codex-key-findings__item">' +
          '<div class="codex-key-finding__cell"><span class="codex-key-finding__label">分类 / 类型</span><strong class="codex-key-finding__value">' + item.category + ' · ' + item.type + '</strong></div>' +
          '<div class="codex-key-finding__cell"><span class="codex-key-finding__label">名称</span><strong class="codex-key-finding__value">' + item.name + '</strong></div>' +
          '<div class="codex-key-finding__cell"><span class="codex-key-finding__label">结果</span><strong class="codex-key-finding__value codex-key-finding__result">' + item.result + '</strong></div>' +
          '<div class="codex-key-finding__cell"><span class="codex-key-finding__label">状态 / 补充信息</span><span class="codex-key-finding__status ' + statusClass + '">' + item.status + '</span><span class="codex-key-finding__value">' + item.extra + '</span></div>' +
          '<div class="codex-key-finding__cell"><span class="codex-key-finding__label">日期 / 原文依据</span><strong class="codex-key-finding__value">' + item.date + '</strong><a class="codex-key-finding__source" href="#" data-codex-source>查看原文</a></div>' +
          '</article>';
      }).join(''),
      '</div>',
      '<button class="codex-key-findings__toggle" type="button" aria-expanded="false">展开更多</button>'
    ].join('');

    var anchor = aiTitle.closest('section, .card, .panel, .content-section') || aiTitle.parentElement;
    if (anchor && anchor.parentElement) anchor.parentElement.insertBefore(section, anchor);
  }

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('.codex-key-findings__toggle');
    if (toggle) {
      var section = toggle.closest('[data-codex-key-findings]');
      var expanded = section.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? '收起' : '展开更多';
      return;
    }
    if (event.target.closest('[data-codex-source]')) event.preventDefault();
  });

  function refresh() {
    if (!isMedicalRecordsPage()) return;
    addStyles();
    replaceUploadLabel();
    createFindings();
  }

  refresh();
  new MutationObserver(refresh).observe(document.documentElement, { childList: true, subtree: true });
})();
