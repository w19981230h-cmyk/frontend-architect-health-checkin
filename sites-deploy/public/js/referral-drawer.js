(function () {
  let activePatient = null;
  let lastTrigger = null;

  const institutionConfig = {
    '南宁市第二人民医院': { direction: 'up', departments: ['心血管内科', '内分泌科', '肾内科', '呼吸与危重症医学科'] },
    '广西医科大学第一附属医院': { direction: 'up', departments: ['心血管内科', '神经内科', '肿瘤科', '全科医学科'] },
    '南宁市青秀区人民医院': { direction: 'up', departments: ['心血管内科', '内分泌科', '康复医学科'] },
    '青秀区建政社区卫生服务中心': { direction: 'down', departments: ['全科医学科', '慢病管理门诊', '康复医学科'] },
    '青秀区南湖社区卫生服务中心': { direction: 'down', departments: ['全科医学科', '慢病管理门诊', '预防保健科'] }
  };

  const reasonOptions = {
    up: ['持续管理无明显改善', '病情/症状明显加重', '关键指标持续异常', '需要进一步专科诊疗', '需要进一步检查或治疗', '当前机构服务能力有限', '其他'],
    down: ['病情稳定，适合基层继续管理', '阶段性治疗已完成', '转长期随访管理', '转康复管理', '转属地机构继续管理', '其他']
  };

  const patientMaterialOptions = [
    { id: 'outpatient-0825', icon: '诊', title: '2026-08-25 心血管内科门诊记录', meta: '门诊记录 · 南宁市第二人民医院' },
    { id: 'discharge-0818', icon: '出', title: '2026-08-18 高血压住院出院记录', meta: '出院记录 · 心血管内科' },
    { id: 'blood-0828', icon: '检', title: '2026-08-28 血常规检验报告', meta: '检验报告 · 异常项 2 项' },
    { id: 'kidney-0828', icon: '检', title: '2026-08-28 肝肾功能检验报告', meta: '检验报告 · 异常项 1 项' },
    { id: 'ultrasound-0829', icon: '查', title: '2026-08-29 心脏彩超检查报告', meta: '检查报告 · 超声医学科' },
    { id: 'ct-0829', icon: '影', title: '2026-08-29 胸部CT影像报告', meta: '影像报告 · 放射科' },
    { id: 'blood-pressure-0830', icon: '管', title: '2026-08-30 血压管理记录', meta: '健康管理记录 · 最近30天' }
  ];

  function notify(message) {
    if (typeof window.showToast === 'function') {
      window.showToast(message);
      return;
    }
    const toast = document.createElement('div');
    toast.className = 'referral-inline-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 1800);
  }

  function createDrawer() {
    if (document.getElementById('patientReferralDrawer')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="referral-drawer-mask" id="patientReferralDrawer" aria-hidden="true">
        <aside class="referral-drawer" role="dialog" aria-modal="true" aria-labelledby="referralDrawerTitle">
          <header class="referral-head">
            <div class="referral-head-main">
              <span class="referral-head-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h12M13 7l5 5-5 5"/><path d="M5 5v14"/></svg></span>
              <div class="referral-title"><h2 id="referralDrawerTitle">发起转诊申请</h2></div>
              <span class="referral-head-meta">转诊申请</span>
              <button type="button" class="referral-close" data-close-referral aria-label="关闭转诊申请">×</button>
            </div>
          </header>

          <div class="referral-body">
            <form class="referral-form" id="referralForm" novalidate>
              <section class="referral-card">
                <div class="referral-card-head"><h3>患者信息</h3><small>系统自动带出，不可编辑</small></div>
                <div class="referral-card-body">
                  <div class="referral-patient">
                    <span class="referral-avatar" id="referralAvatar">患</span>
                    <div class="referral-patient-main">
                      <div class="referral-patient-name"><strong id="referralPatientName">--</strong><i class="referral-gender" id="referralPatientGender">--</i><em id="referralPatientAge">--岁</em></div>
                      <span id="referralPatientPhone">联系电话：--</span>
                    </div>
                    <div class="referral-patient-detail"><span id="referralPatientDisease">当前管理病种：--</span><span id="referralPatientInstitution">当前管理机构：--</span></div>
                    <div class="referral-patient-detail"><span id="referralPatientIdCard">身份证号：--</span><span id="referralPatientTeam">当前管理团队：--</span></div>
                  </div>
                </div>
              </section>

              <section class="referral-card">
                <div class="referral-card-head"><h3>转诊信息</h3><small><span class="referral-required-mark">*</span> 为必填项</small></div>
                <div class="referral-card-body">
                  <div class="referral-form-grid">
                    <div class="referral-field"><label class="required" for="referralInstitution">转入机构</label><input class="referral-control" id="referralInstitution" list="referralInstitutionOptions" placeholder="请输入机构名称搜索" autocomplete="off" required><datalist id="referralInstitutionOptions"><option value="南宁市第二人民医院"></option><option value="广西医科大学第一附属医院"></option><option value="南宁市青秀区人民医院"></option><option value="青秀区建政社区卫生服务中心"></option><option value="青秀区南湖社区卫生服务中心"></option></datalist><div class="referral-field-hint">仅展示与当前机构存在转诊关系的医疗机构</div><div class="referral-error" data-error-for="referralInstitution"></div></div>
                    <div class="referral-field"><label class="required" for="referralDepartment">转入科室</label><select class="referral-control" id="referralDepartment" required disabled><option value="">请先选择转入机构</option></select><div class="referral-field-hint">科室范围随转入机构自动更新</div><div class="referral-error" data-error-for="referralDepartment"></div></div>
                    <div class="referral-field"><label for="referralDirection">转诊方向</label><input class="referral-control referral-control-derived" id="referralDirection" data-direction="" value="选择转入机构后自动带入" readonly><div class="referral-field-hint">系统根据机构上下级关系自动判断，不可修改</div></div>
                    <div class="referral-field"><label class="required" for="referralType">转诊类型</label><select class="referral-control" id="referralType" required><option value="普通">普通</option><option value="加急">加急</option></select><div class="referral-error" data-error-for="referralType"></div></div>
                    <div class="referral-field"><label class="required" for="referralReason">转诊原因</label><div class="referral-combo"><textarea class="referral-control referral-reason-input" id="referralReason" rows="2" maxlength="300" required placeholder="请输入转诊原因，或展开下拉快捷添加"></textarea><button type="button" class="referral-combo-trigger" data-toggle-reason-shortcuts aria-label="展开转诊原因快捷文本" aria-expanded="false">⌄</button><div class="referral-combo-popup referral-reason-shortcuts" id="referralReasonShortcuts" hidden></div></div><div class="referral-field-hint">无需先选择机构，可手动输入或多选快捷文本</div><div class="referral-error" data-error-for="referralReason"></div></div>
                    <div class="referral-field"><span class="referral-field-label required">转诊目的</span><div class="referral-combo"><button type="button" class="referral-control referral-multi-control" id="referralPurposeControl" data-toggle-purpose aria-expanded="false"><span id="referralPurposeSummary">请选择转诊目的（可多选）</span><i>⌄</i></button><div class="referral-combo-popup referral-purpose-popup" id="referralPurposeDropdown" hidden><div class="referral-purpose-tags" id="referralPurposeTags">
                      <label><input type="checkbox" name="referralPurpose" value="进一步专科评估"><span>进一步专科评估</span></label>
                      <label><input type="checkbox" name="referralPurpose" value="进一步检查"><span>进一步检查</span></label>
                      <label><input type="checkbox" name="referralPurpose" value="进一步治疗"><span>进一步治疗</span></label>
                      <label><input type="checkbox" name="referralPurpose" value="住院评估"><span>住院评估</span></label>
                      <label><input type="checkbox" name="referralPurpose" value="定期复查"><span>定期复查</span></label>
                      <label><input type="checkbox" name="referralPurpose" value="康复管理"><span>康复管理</span></label>
                      <label><input type="checkbox" name="referralPurpose" value="长期随访"><span>长期随访</span></label>
                      <label><input type="checkbox" name="referralPurpose" value="指标监测"><span>指标监测</span></label>
                      <label><input type="checkbox" name="referralPurpose" value="健康管理"><span>健康管理</span></label>
                      <label><input type="checkbox" name="referralPurpose" value="其他"><span>其他</span></label>
                    </div></div></div><div class="referral-error" data-error-for="referralPurpose"></div></div>
                    <div class="referral-field full referral-date-field"><label for="referralExpectedDate">期望转诊日期</label><input class="referral-control" id="referralExpectedDate" type="date"><div class="referral-field-hint">仅作为期望就诊时间，不代表预约成功。</div></div>
                  </div>
                </div>
              </section>

              <section class="referral-card">
                <div class="referral-card-head"><h3>当前情况</h3><small>优先从患者档案自动带出</small></div>
                <div class="referral-card-body">
                  <div class="referral-diagnosis-row">
                    <label>诊断信息</label><strong id="referralCurrentDiagnosis">--</strong><button type="button" class="referral-text-action" data-view-all-diagnoses>查看全部诊断</button>
                  </div>
                  <div class="referral-field">
                    <label class="required" for="referralSituation">情况说明</label>
                    <div class="referral-textarea-wrap"><textarea class="referral-control referral-situation" id="referralSituation" maxlength="500" required placeholder="请简要说明患者近期情况、健康管理效果及主要变化，例如持续管理时间、指标控制情况、症状变化等。"></textarea><span class="referral-count"><b id="referralSituationCount">0</b>/500</span></div>
                    <div class="referral-error" data-error-for="referralSituation"></div>
                  </div>
                  <div class="referral-data-section">
                    <div class="referral-data-head"><div><h4>关键异常</h4><p>来自患者近期健康数据和异常记录</p></div><button type="button" class="referral-secondary-btn" data-link-metric>关联更多异常</button></div>
                    <div class="referral-abnormal-grid" id="referralAbnormalList">
                      <article class="referral-abnormal-card"><div><span>血压异常</span><strong id="referralAbnormalBloodPressure">168/102 mmHg</strong><small>最近7天最高值 · 异常5次</small></div><div class="referral-linked-actions"><button type="button" data-view-metric>查看趋势</button><button type="button" data-remove-metric>移除</button></div></article>
                      <article class="referral-abnormal-card"><div><span>空腹血糖偏高</span><strong>7.2 mmol/L</strong><small>2026-08-30 · 高于目标范围</small></div><div class="referral-linked-actions"><button type="button" data-view-metric>查看记录</button><button type="button" data-remove-metric>移除</button></div></article>
                      <article class="referral-abnormal-card"><div><span>静息心率偏快</span><strong>108 次/分</strong><small>近3天出现2次</small></div><div class="referral-linked-actions"><button type="button" data-view-metric>查看记录</button><button type="button" data-remove-metric>移除</button></div></article>
                      <article class="referral-abnormal-card"><div><span>BMI超重</span><strong>28.6 kg/m²</strong><small>近30天体重上升1.8kg</small></div><div class="referral-linked-actions"><button type="button" data-view-metric>查看趋势</button><button type="button" data-remove-metric>移除</button></div></article>
                    </div>
                  </div>
                  <div class="referral-field">
                    <label for="referralSymptoms">其他异常</label>
                    <textarea class="referral-control" id="referralSymptoms" maxlength="300" placeholder="如近期出现头晕、胸闷、水肿、疼痛加重等情况，可在此补充。"></textarea>
                  </div>
                </div>
              </section>

              <section class="referral-card">
                <div class="referral-card-head"><div><h3>相关医疗资料</h3><small>可关联患者现有医疗资料，便于接收机构了解患者情况。</small></div></div>
                <div class="referral-card-body">
                  <div class="referral-data-head referral-doc-toolbar"><div class="referral-doc-types">门诊记录 · 住院记录 · 出院记录 · 检查报告 · 检验报告 · 影像报告 · 病理报告 · 健康管理记录</div><div class="referral-toolbar-actions"><button type="button" class="referral-secondary-btn" data-select-docs>选择患者资料</button><button type="button" class="referral-secondary-btn" data-upload-other>上传其他附件</button><input type="file" id="referralAttachmentInput" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" hidden></div></div>
                  <div class="referral-doc-list" id="referralDocumentList">
                    <div class="referral-doc-item" data-doc-id="outpatient-0825"><span class="referral-doc-icon">诊</span><div><strong>2026-08-25 心血管内科门诊记录</strong><small>门诊记录 · 南宁市第二人民医院</small></div><div><button type="button" data-doc-view>查看</button><button type="button" data-doc-remove>移除</button></div></div>
                    <div class="referral-doc-item" data-doc-id="blood-0828"><span class="referral-doc-icon">检</span><div><strong>2026-08-28 血常规检验报告</strong><small>检验报告 · 异常项 2 项</small></div><div><button type="button" data-doc-view>查看</button><button type="button" data-doc-remove>移除</button></div></div>
                    <div class="referral-doc-item" data-doc-id="blood-pressure-0830"><span class="referral-doc-icon">管</span><div><strong>2026-08-30 血压管理记录</strong><small>健康管理记录 · 最近30天</small></div><div><button type="button" data-doc-view>查看</button><button type="button" data-doc-remove>移除</button></div></div>
                  </div>
                  <div class="referral-upload-help">附件支持 PDF、Word、JPG、PNG 格式</div>
                </div>
              </section>
            </form>
          </div>

          <footer class="referral-foot"><span><b>*</b> 为必填项</span><div class="referral-foot-actions"><button type="button" class="referral-cancel" data-close-referral>取消</button><button type="button" class="referral-confirm" data-confirm-referral>提交转诊申请</button></div></footer>
        </aside>
        <div class="referral-material-mask" id="referralMaterialModal" hidden>
          <section class="referral-material-modal" role="dialog" aria-modal="true" aria-labelledby="referralMaterialTitle">
            <header><div><h3 id="referralMaterialTitle">选择患者资料</h3><p>支持多选，添加后将在转诊申请中随单提交</p></div><button type="button" data-close-material aria-label="关闭资料选择弹窗">×</button></header>
            <div class="referral-material-list">${patientMaterialOptions.map(item => `<div class="referral-material-item"><label><input type="checkbox" value="${item.id}" data-material-title="${item.title}" data-material-meta="${item.meta}" data-material-icon="${item.icon}"><span class="referral-material-check">✓</span><span class="referral-doc-icon">${item.icon}</span><span><strong>${item.title}</strong><small>${item.meta}</small></span></label><button type="button" data-doc-view>查看</button></div>`).join('')}</div>
            <footer><span id="referralMaterialCount">已选择 0 项</span><div><button type="button" class="referral-cancel" data-close-material>取消</button><button type="button" class="referral-confirm" data-add-materials>添加所选资料</button></div></footer>
          </section>
        </div>
      </div>`);
  }

  function findPatient(visitNo) {
    if (typeof allPatients !== 'undefined') return allPatients.find(item => String(item.visitNo) === String(visitNo));
    return null;
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function updateCount(inputId, countId) {
    setText(countId, document.getElementById(inputId)?.value.length || 0);
  }

  function managementDuration(patient) {
    const days = Number(patient.managementDays);
    return `已管理 ${Number.isFinite(days) && days > 0 ? days : 62} 天`;
  }

  function maskedIdCard(patient) {
    if (patient.idCard && String(patient.idCard).includes('*')) return patient.idCard;
    const source = String(patient.idCard || patient.visitNo || '0001');
    return `320***********${source.slice(-4).padStart(4, '0')}`;
  }

  function renderReasonOptions(direction) {
    const input = document.getElementById('referralReason');
    const trigger = document.querySelector('[data-toggle-reason-shortcuts]');
    const popup = document.getElementById('referralReasonShortcuts');
    const options = direction ? reasonOptions[direction] : [...new Set([...reasonOptions.up, ...reasonOptions.down])];
    popup.innerHTML = options.map(item => `<button type="button" data-reason-shortcut="${item}"><span>✓</span>${item}</button>`).join('');
    input.disabled = false;
    input.placeholder = '请输入转诊原因，或展开下拉快捷添加';
    trigger.disabled = false;
  }

  function updateReasonShortcutState() {
    const value = document.getElementById('referralReason')?.value || '';
    document.querySelectorAll('[data-reason-shortcut]').forEach(button => {
      button.classList.toggle('selected', value.includes(button.dataset.reasonShortcut));
    });
  }

  function updatePurposeSummary() {
    const selected = [...document.querySelectorAll('input[name="referralPurpose"]:checked')].map(input => input.value);
    const summary = document.getElementById('referralPurposeSummary');
    const control = document.getElementById('referralPurposeControl');
    if (summary) summary.textContent = selected.length ? selected.join('、') : '请选择转诊目的（可多选）';
    control?.classList.toggle('has-value', Boolean(selected.length));
  }

  function closeComboPopups(exceptId) {
    [['referralReasonShortcuts', '[data-toggle-reason-shortcuts]'], ['referralPurposeDropdown', '[data-toggle-purpose]']].forEach(([id, selector]) => {
      if (id === exceptId) return;
      const popup = document.getElementById(id);
      const trigger = document.querySelector(selector);
      if (popup) popup.hidden = true;
      trigger?.setAttribute('aria-expanded', 'false');
    });
  }

  function syncInstitution() {
    const institution = document.getElementById('referralInstitution');
    const department = document.getElementById('referralDepartment');
    const directionNode = document.getElementById('referralDirection');
    const selected = institutionConfig[institution.value];
    const previousDirection = directionNode.dataset.direction;
    const nextDirection = selected?.direction || '';

    department.innerHTML = `<option value="">${selected ? '请选择转入科室' : '请先选择转入机构'}</option>${(selected?.departments || []).map(item => `<option>${item}</option>`).join('')}`;
    department.disabled = !selected;
    department.value = '';

    directionNode.dataset.direction = nextDirection;
    directionNode.classList.toggle('active', Boolean(nextDirection));
    directionNode.value = nextDirection ? `向${nextDirection === 'up' ? '上' : '下'}转诊` : '选择转入机构后自动带入';

    if (previousDirection !== nextDirection) {
      renderReasonOptions(nextDirection);
      if (previousDirection && nextDirection) {
        document.getElementById('referralReason').value = '';
        notify('转诊方向已变化，请重新选择转诊原因');
      }
      updateReasonShortcutState();
    }

    ['referralInstitution', 'referralDepartment', 'referralReason'].forEach(id => {
      document.getElementById(id)?.classList.remove('invalid');
      const error = document.querySelector(`[data-error-for="${id}"]`);
      if (error) error.textContent = '';
    });
  }

  function openDrawer(visitNo, trigger) {
    createDrawer();
    activePatient = findPatient(visitNo);
    if (!activePatient) return;
    lastTrigger = trigger;

    setText('referralAvatar', activePatient.name.slice(-1));
    setText('referralPatientName', activePatient.name);
    setText('referralPatientGender', activePatient.gender);
    setText('referralPatientAge', `${activePatient.age}岁`);
    setText('referralPatientPhone', `联系电话：${activePatient.phone}`);
    setText('referralPatientDisease', `当前管理病种：${activePatient.disease || activePatient.tags?.[0] || '慢病管理'}`);
    setText('referralPatientInstitution', `当前管理机构：${activePatient.managementInstitution || '青秀区XX社区卫生服务中心'}`);
    setText('referralPatientIdCard', `身份证号：${maskedIdCard(activePatient)}`);
    setText('referralPatientTeam', `当前管理团队：${activePatient.team || '健康管理团队'}`);
    setText('referralCurrentDiagnosis', (activePatient.diagnosis || activePatient.disease || '原发性高血压').replace(/\.\.\.$/, ''));
    setText('referralAbnormalBloodPressure', `${Math.max(Number(activePatient.systolicBP) || 168, 168)}/${Math.max(Number(activePatient.diastolicBP) || 102, 102)} mmHg`);

    const form = document.getElementById('referralForm');
    form.reset();
    document.getElementById('referralDepartment').innerHTML = '<option value="">请先选择转入机构</option>';
    document.getElementById('referralDepartment').disabled = true;
    document.getElementById('referralDirection').dataset.direction = '';
    document.getElementById('referralDirection').classList.remove('active');
    document.getElementById('referralDirection').value = '选择转入机构后自动带入';
    renderReasonOptions('');
    updatePurposeSummary();
    closeComboPopups();
    const duration = managementDuration(activePatient).replace('已管理 ', '').replace(' 天', '');
    document.getElementById('referralSituation').value = `患者已纳入${activePatient.disease || '慢病'}健康管理${duration}天，持续开展指标监测、用药提醒及生活方式管理，近期关键指标仍多次高于目标范围，整体控制效果有待改善。`;
    document.getElementById('referralSymptoms').value = '';
    document.querySelectorAll('#referralForm .invalid').forEach(node => node.classList.remove('invalid'));
    document.querySelectorAll('#referralForm .referral-error').forEach(node => { node.textContent = ''; });
    document.getElementById('referralMaterialModal').hidden = true;
    updateCount('referralSituation', 'referralSituationCount');

    const drawer = document.getElementById('patientReferralDrawer');
    drawer.querySelector('.referral-body').scrollTop = 0;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => drawer.querySelector('.referral-close')?.focus(), 40);
  }

  function closeDrawer() {
    const drawer = document.getElementById('patientReferralDrawer');
    if (!drawer?.classList.contains('open')) return;
    drawer.classList.remove('open');
    document.getElementById('referralMaterialModal').hidden = true;
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.setTimeout(() => lastTrigger?.focus(), 20);
  }

  function validateForm() {
    const requirements = [
      ['referralInstitution', '请选择转入机构'],
      ['referralDepartment', '请选择该机构下的转入科室'],
      ['referralType', '请选择转诊类型'],
      ['referralReason', '请填写转诊原因'],
      ['referralSituation', '请填写情况说明']
    ];
    let firstInvalid = null;
    requirements.forEach(([id, message]) => {
      const control = document.getElementById(id);
      const valid = Boolean(control.value.trim());
      control.classList.toggle('invalid', !valid);
      const error = document.querySelector(`[data-error-for="${id}"]`);
      if (error) error.textContent = valid ? '' : message;
      if (!valid && !firstInvalid) firstInvalid = control;
    });

    const purposes = [...document.querySelectorAll('input[name="referralPurpose"]')];
    const purposeValid = purposes.some(input => input.checked);
    const purposeControl = document.getElementById('referralPurposeControl');
    purposeControl.classList.toggle('invalid', !purposeValid);
    const purposeError = document.querySelector('[data-error-for="referralPurpose"]');
    if (purposeError) purposeError.textContent = purposeValid ? '' : '请至少选择一个转诊目的';
    if (!purposeValid && !firstInvalid) firstInvalid = purposeControl;

    firstInvalid?.focus();
    firstInvalid?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return !firstInvalid;
  }

  function addUploadedDocument(file) {
    const item = document.createElement('div');
    item.className = 'referral-doc-item';
    item.innerHTML = '<span class="referral-doc-icon">附</span><div><strong></strong><small>其他附件</small></div><div><button type="button" data-doc-view>查看</button><button type="button" data-doc-remove>移除</button></div>';
    item.querySelector('strong').textContent = file.name;
    document.getElementById('referralDocumentList').appendChild(item);
  }

  function updateMaterialCount() {
    const count = document.querySelectorAll('#referralMaterialModal input[type="checkbox"]:checked:not(:disabled)').length;
    setText('referralMaterialCount', `已选择 ${count} 项`);
  }

  function openMaterialModal() {
    const modal = document.getElementById('referralMaterialModal');
    modal.querySelectorAll('input[type="checkbox"]').forEach(input => {
      const exists = Boolean(document.querySelector(`#referralDocumentList [data-doc-id="${input.value}"]`));
      input.checked = exists;
      input.disabled = exists;
      input.closest('.referral-material-item')?.classList.toggle('already-added', exists);
    });
    updateMaterialCount();
    modal.hidden = false;
    window.setTimeout(() => modal.querySelector('input:not(:disabled)')?.focus(), 30);
  }

  function closeMaterialModal() {
    const modal = document.getElementById('referralMaterialModal');
    if (modal) modal.hidden = true;
  }

  function appendMaterialDocument(input) {
    if (document.querySelector(`#referralDocumentList [data-doc-id="${input.value}"]`)) return false;
    const item = document.createElement('div');
    item.className = 'referral-doc-item';
    item.dataset.docId = input.value;
    item.innerHTML = '<span class="referral-doc-icon"></span><div><strong></strong><small></small></div><div><button type="button" data-doc-view>查看</button><button type="button" data-doc-remove>移除</button></div>';
    item.querySelector('.referral-doc-icon').textContent = input.dataset.materialIcon;
    item.querySelector('strong').textContent = input.dataset.materialTitle;
    item.querySelector('small').textContent = input.dataset.materialMeta;
    document.getElementById('referralDocumentList').appendChild(item);
    return true;
  }

  function addSelectedMaterials() {
    let added = 0;
    document.querySelectorAll('#referralMaterialModal input[type="checkbox"]:checked:not(:disabled)').forEach(input => {
      if (appendMaterialDocument(input)) added += 1;
    });
    closeMaterialModal();
    notify(added ? `已添加 ${added} 项患者资料` : '请选择需要添加的患者资料');
  }

  document.addEventListener('click', event => {
    const openButton = event.target.closest('[data-open-referral]');
    if (openButton) {
      event.preventDefault();
      event.stopPropagation();
      openDrawer(openButton.dataset.openReferral, openButton);
      return;
    }
    if (event.target.closest('[data-close-referral]')) {
      closeDrawer();
      return;
    }
    if (event.target.closest('[data-close-material]')) {
      closeMaterialModal();
      return;
    }
    const materialMask = event.target.closest('#referralMaterialModal');
    if (materialMask && event.target === materialMask) {
      closeMaterialModal();
      return;
    }
    if (event.target.closest('[data-add-materials]')) {
      addSelectedMaterials();
      return;
    }
    const mask = event.target.closest('#patientReferralDrawer');
    if (mask && event.target === mask) {
      closeDrawer();
      return;
    }
    if (event.target.closest('[data-view-all-diagnoses]')) {
      notify('已打开患者全部诊断');
      return;
    }
    if (event.target.closest('[data-link-metric]')) {
      notify('已打开患者异常数据选择');
      return;
    }
    const removeMetric = event.target.closest('[data-remove-metric]');
    if (removeMetric) {
      removeMetric.closest('.referral-abnormal-card')?.remove();
      return;
    }
    if (event.target.closest('[data-view-metric]')) {
      notify('已打开血压趋势');
      return;
    }
    if (event.target.closest('[data-doc-view]')) {
      notify('已打开医疗资料预览');
      return;
    }
    const removeDoc = event.target.closest('[data-doc-remove]');
    if (removeDoc) {
      removeDoc.closest('.referral-doc-item')?.remove();
      return;
    }
    if (event.target.closest('[data-select-docs]')) {
      openMaterialModal();
      return;
    }
    if (event.target.closest('[data-upload-other]')) {
      document.getElementById('referralAttachmentInput')?.click();
      return;
    }
    const reasonToggle = event.target.closest('[data-toggle-reason-shortcuts]');
    if (reasonToggle) {
      const popup = document.getElementById('referralReasonShortcuts');
      const willOpen = popup.hidden;
      closeComboPopups(willOpen ? 'referralReasonShortcuts' : '');
      popup.hidden = !willOpen;
      reasonToggle.setAttribute('aria-expanded', String(willOpen));
      return;
    }
    const reasonShortcut = event.target.closest('[data-reason-shortcut]');
    if (reasonShortcut) {
      const input = document.getElementById('referralReason');
      const phrase = reasonShortcut.dataset.reasonShortcut;
      const values = input.value.split(/[；;]/).map(item => item.trim()).filter(Boolean);
      const existingIndex = values.indexOf(phrase);
      if (existingIndex >= 0) values.splice(existingIndex, 1);
      else values.push(phrase);
      input.value = values.join('；');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
    const purposeToggle = event.target.closest('[data-toggle-purpose]');
    if (purposeToggle) {
      const popup = document.getElementById('referralPurposeDropdown');
      const willOpen = popup.hidden;
      closeComboPopups(willOpen ? 'referralPurposeDropdown' : '');
      popup.hidden = !willOpen;
      purposeToggle.setAttribute('aria-expanded', String(willOpen));
      return;
    }
    if (!event.target.closest('.referral-combo')) closeComboPopups();
    const confirmButton = event.target.closest('[data-confirm-referral]');
    if (confirmButton) {
      if (!validateForm()) return;
      confirmButton.classList.add('loading');
      confirmButton.disabled = true;
      confirmButton.textContent = '正在提交申请';
      window.setTimeout(() => {
        confirmButton.classList.remove('loading');
        confirmButton.disabled = false;
        confirmButton.textContent = '提交转诊申请';
        notify(`${activePatient?.name || '患者'}的转诊申请已提交`);
        closeDrawer();
      }, 450);
    }
  }, true);

  document.addEventListener('change', event => {
    if (event.target.id === 'referralInstitution') syncInstitution();
    if (event.target.id === 'referralAttachmentInput' && event.target.files?.[0]) {
      addUploadedDocument(event.target.files[0]);
      event.target.value = '';
    }
    if (event.target.name === 'referralPurpose') {
      const control = document.getElementById('referralPurposeControl');
      control.classList.remove('invalid');
      const error = document.querySelector('[data-error-for="referralPurpose"]');
      if (error) error.textContent = '';
      updatePurposeSummary();
    }
    if (event.target.closest('#referralMaterialModal') && event.target.type === 'checkbox') updateMaterialCount();
    if (event.target.matches('#referralForm .referral-control') && event.target.value) {
      event.target.classList.remove('invalid');
      const error = document.querySelector(`[data-error-for="${event.target.id}"]`);
      if (error) error.textContent = '';
    }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'referralReason') updateReasonShortcutState();
    if (event.target.id === 'referralSituation') updateCount('referralSituation', 'referralSituationCount');
    if (event.target.matches('#referralForm .referral-control') && event.target.value) {
      event.target.classList.remove('invalid');
      const error = document.querySelector(`[data-error-for="${event.target.id}"]`);
      if (error) error.textContent = '';
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.getElementById('referralMaterialModal')?.hidden) {
      closeMaterialModal();
      return;
    }
    if (event.key === 'Escape' && document.querySelector('.referral-combo-popup:not([hidden])')) {
      closeComboPopups();
      return;
    }
    if (event.key === 'Escape' && document.getElementById('patientReferralDrawer')?.classList.contains('open')) closeDrawer();
  });

  createDrawer();
})();
