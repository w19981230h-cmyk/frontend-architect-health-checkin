(function () {
  const modal = document.getElementById('healthPortraitModal');
  if (!modal) return;

  const profiles = {
    overview: { title: '综合健康评估', status: '日常关注', state: 'attention', summary: '当前主要关注心脏与血管健康、血液免疫与感染及内分泌代谢健康，建议结合持续监测数据进行管理。', focus: '健康风险综合管理', focusCopy: '建议围绕重点分类补充监测数据并持续随访。', daily: '保持规律作息、均衡饮食和适量运动。', positive: '当前主要健康信息已完成分类整理。', advice: ['优先补齐重点指标记录', '按计划完成健康随访', '出现明显不适时及时就医。'] },
    mind: { title: '神经、心理与睡眠健康', status: '正常', state: 'normal', summary: '当前暂无明确神经、心理或睡眠异常记录，整体状态平稳。', focus: '暂无重点异常', focusCopy: '继续观察睡眠质量与情绪变化。', daily: '建议保持稳定作息，避免长期熬夜。', positive: '当前无相关疾病及异常症状记录。', advice: ['保持规律睡眠', '适量进行户外活动', '如持续失眠或情绪低落，及时咨询专业人员。'] },
    vision: { title: '眼与视觉健康', status: '正常', state: 'normal', summary: '现有档案中未发现明确眼部疾病或视力异常风险。', focus: '暂无重点异常', focusCopy: '按需完善视力和眼底检查记录。', daily: '减少长时间近距离用眼。', positive: '当前无明确眼科异常记录。', advice: ['控制连续用眼时长', '定期检查视力', '出现视物模糊及时就诊。'] },
    oral: { title: '耳鼻咽与口腔健康', status: '日常关注', state: 'attention', summary: '当前信息较少，建议在日常管理中关注听力、鼻咽和口腔状态。', focus: '基础信息待完善', focusCopy: '建议补充近期口腔及耳鼻咽检查情况。', daily: '保持口腔清洁，关注牙龈出血等变化。', positive: '暂无明确严重异常记录。', advice: ['保持早晚刷牙', '定期进行口腔检查', '出现持续疼痛及时就医。'] },
    heart: { title: '心脏与血管健康', status: '重点关注', state: 'critical', summary: '既往有高血压病史，当前缺少连续血压监测数据，建议结合后续测量结果持续评估。', focus: '高血压病史', focusCopy: '建议补充近期血压记录，关注血压变化。', daily: '偶尔吸烟，建议减少吸烟并保持规律作息。', positive: '当前暂无明确心血管急性异常记录。', advice: ['定期监测血压', '按医嘱进行复查', '出现胸痛、呼吸困难等不适时及时就医。'] },
    breath: { title: '呼吸系统健康', status: '正常', state: 'normal', summary: '当前未发现明确呼吸系统持续异常，建议结合既往就诊记录继续观察。', focus: '暂无重点异常', focusCopy: '近期如有咳嗽、气促等症状需及时记录。', daily: '避免吸烟及刺激性环境暴露。', positive: '当前暂无持续呼吸困难记录。', advice: ['保持室内通风', '适度进行呼吸锻炼', '症状加重时及时就医。'] },
    blood: { title: '血液、免疫与感染', status: '日常关注', state: 'attention', summary: '存在药物及食物过敏记录，诊疗与用药前需加强信息核对。', focus: '过敏信息核对', focusCopy: '就诊和用药时主动告知医护人员过敏史。', daily: '关注发热、皮疹和异常疲劳等变化。', positive: '当前无明确急性感染表现。', advice: ['完善过敏原记录', '避免自行使用不熟悉药物', '出现严重过敏反应立即就医。'] },
    digest: { title: '消化系统健康', status: '正常', state: 'normal', summary: '现有记录未提示持续消化系统异常，整体状态平稳。', focus: '暂无重点异常', focusCopy: '继续关注食欲和排便变化。', daily: '保持规律饮食，避免暴饮暴食。', positive: '当前无明确消化道警示症状。', advice: ['定时定量进餐', '减少高油高盐饮食', '持续腹痛或便血时及时就医。'] },
    metabolism: { title: '内分泌、代谢与营养', status: '日常关注', state: 'attention', summary: '当前血糖处于临界关注范围，建议结合家族史持续观察代谢变化。', focus: '血糖变化趋势', focusCopy: '建议补充空腹血糖及糖化血红蛋白记录。', daily: '控制精制糖摄入，保持适量运动。', positive: '当前体重和BMI处于可持续管理范围。', advice: ['定期复查血糖', '保持均衡饮食', '结合医生建议制定运动计划。'] },
    kidney: { title: '肾脏与泌尿健康', status: '正常', state: 'normal', summary: '现有信息未提示明确肾脏与泌尿系统异常。', focus: '暂无重点异常', focusCopy: '建议结合既往检查继续观察肾功能。', daily: '合理饮水，避免长期憋尿。', positive: '当前无明确泌尿系统警示症状。', advice: ['合理补充水分', '定期检查肾功能', '出现血尿或腰痛及时就医。'] },
    reproductive: { title: '生殖、乳腺与孕产健康', status: '暂无结论', state: 'empty', summary: '当前相关健康数据不足，暂无法形成明确画像结论。', focus: '数据待补充', focusCopy: '建议根据患者实际情况补充相关健康信息。', daily: '关注身体变化并按需进行专科筛查。', positive: '暂无明确异常记录。', advice: ['补充相关病史', '按年龄和风险进行筛查', '发现异常及时咨询专科医生。'] },
    bone: { title: '骨骼、肌肉与运动健康', status: '正常', state: 'normal', summary: '当前无明确骨骼、肌肉和运动功能异常记录。', focus: '暂无重点异常', focusCopy: '继续观察关节疼痛和活动能力变化。', daily: '保持适量运动，避免久坐。', positive: '目前活动能力无明显受限记录。', advice: ['每周安排规律运动', '运动前充分热身', '持续疼痛时及时就医。'] },
    skin: { title: '皮肤与体表健康', status: '暂无结论', state: 'empty', summary: '当前皮肤与体表健康数据不足，暂无法形成明确结论。', focus: '数据待补充', focusCopy: '建议记录皮疹、破损或异常肿物等情况。', daily: '保持皮肤清洁，避免过度抓挠。', positive: '暂无明确严重异常记录。', advice: ['关注皮肤颜色和形态变化', '做好日常防晒', '异常持续时咨询皮肤科。'] }
  };

  const secondaryTaxonomy = {
    mind: ['脑与中枢神经', '周围神经', '认知功能', '心理健康', '睡眠与昼夜节律', '意识与神经安全'],
    vision: ['眼表与眼前节', '眼底与视神经', '视觉功能'],
    oral: ['耳与听觉功能', '前庭与平衡功能', '鼻与鼻窦', '嗅觉功能', '咽喉、语音与吞咽', '口腔、牙齿与颌面'],
    heart: ['心脏结构与功能', '心律与传导', '冠状动脉', '主动脉与大血管', '颈脑与外周血管', '血压与循环状态', '心血管10年风险评分', '动脉粥样硬化脂质风险', '心血管健康行为综合评估'],
    breath: ['气道与肺部', '胸膜与纵隔', '肺功能', '氧合与呼吸状态'],
    blood: ['血细胞与造血', '凝血与血栓倾向', '免疫与自身免疫', '过敏状态', '炎症状态', '感染与微生物', '脾脏与淋巴系统'],
    digest: ['食管', '胃与十二指肠', '肠道与肛门', '肝脏', '胆囊与胆道', '胰腺', '消化与吸收功能'],
    metabolism: ['糖代谢与胰岛素抵抗', '脂质代谢', '尿酸与嘌呤代谢', '甲状腺与甲状旁腺', '垂体与肾上腺', '其他内分泌与激素', '营养状态', '体重与身体成分', '代谢综合征', '肥胖·体脂分布', '基础能量代谢'],
    kidney: ['肾脏结构', '肾脏功能', '尿液检查与蛋白排泄', '泌尿道健康', '水、电解质与酸碱平衡'],
    reproductive: ['女性生殖健康（女性）', '男性生殖健康（男性）', '生育与性健康', '乳腺健康', '妊娠健康（女性）', '产后健康（女性）'],
    bone: ['骨骼与骨密度', '脊柱健康', '关节健康', '肌肉与软组织', '结缔组织健康', '运动与身体功能', '疼痛状态'],
    skin: ['皮肤与黏膜', '毛发、指甲与皮肤附属器', '伤口与组织完整性']
  };

  const secondaryDetails = {
    heart: {
      '血压与循环状态': { status: '重点关注', state: 'critical', summary: '既往有高血压病史，当前缺少连续血压监测数据。', metrics: ['收缩压 140 mmHg', '舒张压 90 mmHg'], advice: '补充近期连续血压记录并关注变化。' },
      '动脉粥样硬化脂质风险': { status: '日常关注', state: 'attention', summary: '现有信息提示需要持续关注血脂及动脉粥样硬化相关风险。', metrics: ['总胆固醇 5.2 mmol/L', '低密度脂蛋白胆固醇 3.1 mmol/L'], advice: '按健康管理计划复查血脂相关指标。' },
      '心血管健康行为综合评估': { status: '日常关注', state: 'attention', summary: '现有记录提示需要持续关注吸烟等心血管健康行为。', metrics: ['吸烟状态 偶尔吸烟'], advice: '减少吸烟并保持规律作息和适量运动。' }
    },
    blood: {
      '过敏状态': { status: '日常关注', state: 'attention', summary: '存在药物及食物过敏记录，诊疗与用药前需要核对。', metrics: ['药物过敏 已记录', '食物过敏 已记录'], advice: '就诊和用药时主动告知医护人员过敏史。' }
    },
    metabolism: {
      '糖代谢与胰岛素抵抗': { status: '日常关注', state: 'attention', summary: '当前血糖处于临界关注范围，需要持续观察糖代谢变化。', metrics: ['空腹血糖 5.8 mmol/L'], advice: '按计划补充空腹血糖等相关记录。' },
      '体重与身体成分': { status: '正常', state: 'normal', summary: '当前体重和身体成分数据处于可持续管理范围。', metrics: ['体重 68.4 kg', 'BMI 23.1 kg/m²', '体脂 24.6%'], advice: '保持均衡饮食和适量运动。' }
    }
  };

  const query = selector => modal.querySelector(selector);
  let returnFocus = null;
  let activeProfileKey = 'overview';
  let activeDetailTab = 'summary';

  function setText(selector, value) {
    const node = query(selector);
    if (node) node.textContent = value;
  }

  function renderSummary(profile) {
    return `
      <article class="health-detail-summary"><h4><i>▤</i>总结</h4><p>${profile.summary}</p></article>
      <article class="health-detail-card critical"><h4><i>!</i>优先关注</h4><div><strong>${profile.focus}</strong><p>${profile.focusCopy}</p></div></article>
      <article class="health-detail-card attention"><h4><i>−</i>日常关注</h4><p>${profile.daily}</p></article>
      <article class="health-detail-card positive"><h4><i>✓</i>积极情况</h4><p>${profile.positive}</p></article>
      <article class="health-detail-card advice"><h4><i>◇</i>健康建议</h4><ol>${profile.advice.map(item => `<li>${item}</li>`).join('')}</ol></article>`;
  }

  function renderSecondary(key, profile) {
    const secondary = secondaryTaxonomy[key] || [];
    if (!secondary.length) return '<div class="health-secondary-empty">暂无二级分类数据</div>';
    return `
      <div class="health-secondary-classification-note">已按规则表归入 ${secondary.length} 个二级分类</div>
      <div class="health-secondary-category-list">
        ${secondary.map(name => {
          const detail = secondaryDetails[key]?.[name] || {
            status: '暂无结论',
            state: 'empty',
            summary: `当前暂无可用于判断“${name}”的有效数据。`,
            metrics: [],
            advice: '补充相关健康记录后再进行评估。'
          };
          return `<section class="health-secondary-category-card">
            <header><strong>${name}</strong><em class="${detail.state}">${detail.status}</em></header>
            <div class="health-secondary-category-grid">
              <article><h4>总结</h4><p>${detail.summary}</p></article>
              <article><h4>健康数据</h4><div class="health-secondary-data${detail.metrics.length ? '' : ' is-empty'}">${detail.metrics.length ? detail.metrics.map(item => `<span>${item}</span>`).join('') : '<span>暂无提取指标</span>'}</div></article>
              <article><h4>健康建议</h4><p>${detail.advice}</p></article>
            </div>
          </section>`;
        }).join('')}
      </div>
    `;
  }

  function renderDetail() {
    const profile = profiles[activeProfileKey] || profiles.overview;
    const isOverview = activeProfileKey === 'overview';
    setText('[data-health-detail-title]', isOverview ? '综合分析' : profile.title);
    const status = query('[data-health-detail-status]');
    status.hidden = isOverview;
    status.textContent = isOverview ? '' : profile.status;
    status.className = isOverview ? '' : profile.state;

    const tabs = query('[data-health-detail-tabs]');
    tabs.hidden = isOverview;
    tabs.innerHTML = isOverview ? '' : `
      <button type="button" role="tab" aria-selected="${activeDetailTab === 'summary'}" class="${activeDetailTab === 'summary' ? 'active' : ''}" data-health-detail-tab="summary">综合</button>
      <button type="button" role="tab" aria-selected="${activeDetailTab === 'secondary'}" class="${activeDetailTab === 'secondary' ? 'active' : ''}" data-health-detail-tab="secondary">二级分类</button>`;

    query('[data-health-detail-content]').innerHTML = activeDetailTab === 'secondary' && !isOverview
      ? renderSecondary(activeProfileKey, profile)
      : renderSummary(profile);
    setText('[data-health-hotspot-label]', isOverview ? '综合健康分析' : `${profile.title}｜${profile.status}`);
  }

  function showProfile(key) {
    activeProfileKey = profiles[key] ? key : 'overview';
    activeDetailTab = 'summary';
    modal.querySelectorAll('[data-health-system]').forEach(button => button.classList.toggle('active', button.dataset.healthSystem === key));
    modal.classList.toggle('is-overview', key === 'overview');
    renderDetail();
  }

  function copyPatientInfo() {
    const archive = document.getElementById('patientArchivePage');
    const read = field => archive?.querySelector(`[data-archive-text="${field}"]`)?.textContent?.trim();
    setText('[data-health-patient-name]', read('name') || '黄尚忠');
    setText('[data-health-patient-gender]', read('gender') || '男');
    const age = read('age') || '73';
    setText('[data-health-patient-age]', age.endsWith('岁') ? age : `${age}岁`);
  }

  function openModal(button) {
    returnFocus = button;
    copyPatientInfo();
    showProfile('overview');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('health-portrait-open');
    query('[data-health-portrait-close]')?.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('health-portrait-open');
    returnFocus?.focus?.();
  }

  document.addEventListener('click', event => {
    const openButton = event.target.closest('[data-health-portrait-open]');
    if (openButton) {
      event.preventDefault();
      openModal(openButton);
      return;
    }
    if (event.target.closest('[data-health-portrait-close]') || event.target === modal) closeModal();
    const systemButton = event.target.closest('[data-health-system]');
    if (systemButton) {
      showProfile(systemButton.dataset.healthSystem);
      return;
    }
    const detailTab = event.target.closest('[data-health-detail-tab]');
    if (detailTab) {
      activeDetailTab = detailTab.dataset.healthDetailTab;
      renderDetail();
      return;
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();
