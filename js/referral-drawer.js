(function () {
  let activePatient = null;
  let lastTrigger = null;

  function escHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

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
              <div class="referral-title"><h2 id="referralDrawerTitle">转诊申请</h2></div>
              <button type="button" class="referral-close" data-close-referral aria-label="关闭转诊申请">×</button>
            </div>
          </header>
          <div class="referral-body">
            <div class="referral-layout">
              <div class="referral-column">
                <section class="referral-card">
                  <div class="referral-card-head"><h3>患者基本信息</h3><small>转诊对象</small></div>
                  <div class="referral-card-body"><div class="referral-patient">
                    <span class="referral-avatar" id="referralAvatar">患</span>
                    <div class="referral-patient-main">
                      <div class="referral-patient-name"><strong id="referralPatientName">--</strong><i class="referral-gender" id="referralPatientGender">--</i><em id="referralPatientAge">--岁</em></div>
                      <span id="referralPatientPhone">联系电话：--</span>
                    </div>
                    <div class="referral-patient-detail"><span id="referralPatientIdentity">证件号码：--</span><span id="referralPatientTeam">当前管理团队：--</span></div>
                    <div class="referral-patient-detail"><span id="referralPatientInstitution">当前管理机构：--</span></div>
                  </div></div>
                </section>
                <section class="referral-card">
                  <div class="referral-card-head"><h3>健康管理数据摘要</h3><small>用于辅助转诊评估</small></div>
                  <div class="referral-card-body"><div class="referral-metrics">
                    <div class="referral-metric danger"><label>近期血压</label><strong id="referralMetricBp">--</strong></div>
                    <div class="referral-metric"><label>空腹血糖</label><strong id="referralMetricGlucose">--</strong></div>
                    <div class="referral-metric"><label>BMI</label><strong id="referralMetricBmi">--</strong></div>
                    <div class="referral-metric"><label>最近就诊</label><strong id="referralMetricVisit">--</strong></div>
                  </div></div>
                </section>
                <section class="referral-card">
                  <div class="referral-card-head"><h3>转诊信息</h3><small><span style="color:#ff4d4f">*</span> 为必填项</small></div>
                  <div class="referral-card-body">
                    <form class="referral-form-grid" id="referralForm" novalidate>
                      <div class="referral-field full"><label class="required" for="referralReason">转诊原因</label><input class="referral-control" id="referralReason" type="text" maxlength="100" required placeholder="请填写转诊原因"><div class="referral-error" data-error-for="referralReason"></div></div>
                      <div class="referral-field full"><label class="required" for="referralPurpose">转诊目的</label><input class="referral-control" id="referralPurpose" type="text" maxlength="100" required placeholder="请填写转诊目的"><div class="referral-error" data-error-for="referralPurpose"></div></div>
                      <div class="referral-field full"><label class="required" for="referralType">转诊类型</label><select class="referral-control" id="referralType" required><option value="">请选择转诊类型</option><option>普通</option><option>加急</option></select><div class="referral-error" data-error-for="referralType"></div></div>
                      <div class="referral-field"><label class="required" for="referralInstitution">转入机构</label><select class="referral-control" id="referralInstitution" required><option value="">请选择接收机构</option><option data-direction="平级">杭州市第一人民医院</option><option data-direction="上转">浙江大学医学院附属第二医院</option><option data-direction="上转">浙江省人民医院</option><option data-direction="下转">杭州市社区卫生服务中心</option></select><div class="referral-error" data-error-for="referralInstitution"></div></div>
                      <div class="referral-field"><label class="required" for="referralDepartment">转入科室</label><select class="referral-control" id="referralDepartment" required><option value="">请选择接收科室</option><option>心血管内科</option><option>内分泌科</option><option>肾内科</option><option>呼吸与危重症医学科</option><option>肿瘤科</option><option>全科医学科</option></select><div class="referral-error" data-error-for="referralDepartment"></div></div>
                      <div class="referral-field"><label class="required" for="referralDirection">转诊方向</label><select class="referral-control referral-control-derived" id="referralDirection" required aria-describedby="referralDirectionHint"><option value="">选择转入机构后自动匹配</option><option>上转</option><option>下转</option><option>平级</option></select><small class="referral-field-hint" id="referralDirectionHint">根据转入机构级别自动匹配</small><div class="referral-error" data-error-for="referralDirection"></div></div>
                      <div class="referral-field full"><label class="required" for="referralSummary">临床情况摘要</label><div class="referral-textarea-wrap"><textarea class="referral-control" id="referralSummary" maxlength="300" required placeholder="系统生成后请医生确认或修改"></textarea><span class="referral-count"><b id="referralSummaryCount">0</b>/300</span></div><div class="referral-error" data-error-for="referralSummary"></div></div>
                      <div class="referral-field full"><label for="referralNotes">特殊注意事项 <span class="referral-conditional">条件必填</span></label><div class="referral-textarea-wrap"><textarea class="referral-control" id="referralNotes" maxlength="200" placeholder="如高龄、跌倒风险、药物过敏或行动不便等"></textarea><span class="referral-count"><b id="referralNotesCount">0</b>/200</span></div><div class="referral-error" data-error-for="referralNotes"></div></div>
                    </form>
                  </div>
                </section>
              </div>
              <div class="referral-column">
                <section class="referral-card">
                  <div class="referral-card-head"><h3>近期重要检查</h3><small>最近90天</small></div>
                  <div class="referral-card-body"><div class="referral-records">
                    <div class="referral-record"><span>血常规</span><time>2026-08-20</time></div><div class="referral-record"><span>肝肾功能</span><time>2026-08-20</time></div><div class="referral-record"><span>心电图</span><time>2026-08-15</time></div><div class="referral-record"><span>尿常规</span><time>2026-08-02</time></div>
                  </div></div>
                </section>
                <section class="referral-card">
                  <div class="referral-card-head"><h3>关联医疗资料</h3><label class="referral-check-item"><input type="checkbox" id="referralSelectAllDocs" checked>全选</label></div>
                  <div class="referral-card-body"><div class="referral-check-list" id="referralDocumentList">
                    <label class="referral-check-item"><input type="checkbox" checked><span>最近30天血压数据</span><a href="#" data-referral-view>查看</a></label>
                    <label class="referral-check-item"><input type="checkbox" checked><span>近期门诊病历</span><a href="#" data-referral-view>查看</a></label>
                    <label class="referral-check-item"><input type="checkbox" checked><span>当前用药记录</span><a href="#" data-referral-view>查看</a></label>
                    <label class="referral-check-item"><input type="checkbox" checked><span>肝肾功能检查</span><a href="#" data-referral-view>查看</a></label>
                    <label class="referral-check-item"><input type="checkbox" checked><span>心电图检查</span><a href="#" data-referral-view>查看</a></label>
                    <label class="referral-check-item"><input type="checkbox" checked><span>最近随访记录</span><a href="#" data-referral-view>查看</a></label>
                    <label class="referral-check-item"><input type="checkbox" checked><span>过敏史</span><a href="#" data-referral-view>查看</a></label>
                  </div></div>
                </section>
              </div>
            </div>
          </div>
          <footer class="referral-foot"><button type="button" class="referral-cancel" data-close-referral>取消</button><div class="referral-foot-actions"><button type="button" class="referral-draft" data-save-referral-draft>保存草稿</button><button type="button" class="referral-confirm" data-confirm-referral>确定转诊</button></div></footer>
        </aside>
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

  function maskedIdentity(patient) {
    const digits = String(patient.visitNo || '').replace(/\D/g, '');
    return `320***********${digits.slice(-4).padStart(4, '0')}`;
  }

  function syncReferralDirection() {
    const institution = document.getElementById('referralInstitution');
    const direction = document.getElementById('referralDirection');
    if (!institution || !direction) return;
    direction.value = institution.selectedOptions[0]?.dataset.direction || '';
    direction.classList.remove('invalid');
    const error = document.querySelector('[data-error-for="referralDirection"]');
    if (error) error.textContent = '';
  }

  function openDrawer(visitNo, trigger) {
    createDrawer();
    activePatient = findPatient(visitNo);
    if (!activePatient) return;
    lastTrigger = trigger;
    const drawer = document.getElementById('patientReferralDrawer');
    setText('referralAvatar', activePatient.name.slice(-1));
    setText('referralPatientName', activePatient.name);
    setText('referralPatientGender', activePatient.gender);
    setText('referralPatientAge', `${activePatient.age}岁`);
    setText('referralPatientPhone', `联系电话：${activePatient.phone}`);
    setText('referralPatientIdentity', `证件号码：${maskedIdentity(activePatient)}`);
    setText('referralPatientTeam', `当前管理团队：${activePatient.team || '健康管理团队'}`);
    setText('referralPatientInstitution', `当前管理机构：${activePatient.managementInstitution || '杭州市第一人民医院'}`);
    setText('referralMetricBp', `${activePatient.systolicBP}/${activePatient.diastolicBP} mmHg`);
    setText('referralMetricGlucose', `${activePatient.fastingGlucose} mmol/L`);
    setText('referralMetricBmi', activePatient.bmi);
    setText('referralMetricVisit', activePatient.visitDate);
    document.getElementById('referralReason').value = '';
    document.getElementById('referralPurpose').value = '';
    document.getElementById('referralType').value = '普通';
    document.getElementById('referralDirection').value = '';
    document.getElementById('referralDepartment').value = [...document.getElementById('referralDepartment').options].some(option => option.value === activePatient.department) ? activePatient.department : '';
    document.getElementById('referralInstitution').value = '';
    document.getElementById('referralSummary').value = `患者${activePatient.name}，${activePatient.age}岁，近期诊断：${activePatient.diagnosis.replace(/\.\.\.$/, '')}。当前健康管理重点为${activePatient.standardFeature || '病情监测'}，建议转至专科进一步评估并优化诊疗方案。`;
    document.getElementById('referralNotes').value = '';
    document.querySelectorAll('#referralForm .referral-control').forEach(control => control.classList.remove('invalid'));
    document.querySelectorAll('#referralForm .referral-error').forEach(error => { error.textContent = ''; });
    updateCount('referralSummary', 'referralSummaryCount');
    updateCount('referralNotes', 'referralNotesCount');
    const drawerBody = drawer.querySelector('.referral-body');
    if (drawerBody) drawerBody.scrollTop = 0;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => drawer.querySelector('.referral-close')?.focus(), 40);
  }

  function closeDrawer() {
    const drawer = document.getElementById('patientReferralDrawer');
    if (!drawer?.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.setTimeout(() => lastTrigger?.focus(), 20);
  }

  function updateCount(inputId, countId) {
    setText(countId, document.getElementById(inputId)?.value.length || 0);
  }

  function validateForm() {
    const requirements = [
      ['referralReason', '请填写转诊原因'],
      ['referralPurpose', '请填写转诊目的'],
      ['referralType', '请选择转诊类型'],
      ['referralDirection', '请选择转诊方向'],
      ['referralInstitution', '请选择接收机构'],
      ['referralDepartment', '请选择接收科室'],
      ['referralSummary', '请确认临床情况摘要']
    ];
    let firstInvalid = null;
    requirements.forEach(([id, message]) => {
      const control = document.getElementById(id);
      const valid = Boolean(control.value);
      control.classList.toggle('invalid', !valid);
      const error = document.querySelector(`[data-error-for="${id}"]`);
      if (error) error.textContent = valid ? '' : message;
      if (!valid && !firstInvalid) firstInvalid = control;
    });
    const referralType = document.getElementById('referralType').value;
    const notes = document.getElementById('referralNotes');
    const notesRequired = referralType === '加急';
    const notesValid = !notesRequired || Boolean(notes.value.trim());
    notes.classList.toggle('invalid', !notesValid);
    const notesError = document.querySelector('[data-error-for="referralNotes"]');
    if (notesError) notesError.textContent = notesValid ? '' : '加急转诊请填写特殊注意事项';
    if (!notesValid && !firstInvalid) firstInvalid = notes;
    firstInvalid?.focus();
    return !firstInvalid;
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
    const mask = event.target.closest('#patientReferralDrawer');
    if (mask && event.target === mask) {
      closeDrawer();
      return;
    }
    if (event.target.closest('[data-referral-view]')) {
      event.preventDefault();
      notify('已打开资料预览');
      return;
    }
    if (event.target.closest('[data-save-referral-draft]')) {
      notify(`已保存${activePatient ? ` ${activePatient.name}` : ''}的转诊申请草稿`);
      return;
    }
    const confirmButton = event.target.closest('[data-confirm-referral]');
    if (confirmButton) {
      if (!validateForm()) return;
      confirmButton.classList.add('loading');
      confirmButton.disabled = true;
      confirmButton.textContent = '正在提交转诊';
      window.setTimeout(() => {
        confirmButton.classList.remove('loading');
        confirmButton.disabled = false;
        confirmButton.textContent = '确定转诊';
        notify(`${activePatient?.name || '患者'}的转诊申请已提交`);
        closeDrawer();
      }, 450);
    }
  }, true);

  document.addEventListener('input', event => {
    if (event.target.id === 'referralSummary') updateCount('referralSummary', 'referralSummaryCount');
    if (event.target.id === 'referralNotes') updateCount('referralNotes', 'referralNotesCount');
    if (event.target.matches('#referralForm .referral-control') && event.target.value) {
      event.target.classList.remove('invalid');
      const error = document.querySelector(`[data-error-for="${event.target.id}"]`);
      if (error) error.textContent = '';
    }
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'referralInstitution') syncReferralDirection();
    if (event.target.id === 'referralType' && event.target.value === '普通') {
      document.getElementById('referralNotes')?.classList.remove('invalid');
      const notesError = document.querySelector('[data-error-for="referralNotes"]');
      if (notesError) notesError.textContent = '';
    }
    if (event.target.id === 'referralSelectAllDocs') {
      document.querySelectorAll('#referralDocumentList input[type="checkbox"]').forEach(input => { input.checked = event.target.checked; });
    }
    if (event.target.matches('#referralDocumentList input[type="checkbox"]')) {
      const inputs = [...document.querySelectorAll('#referralDocumentList input[type="checkbox"]')];
      const selectAll = document.getElementById('referralSelectAllDocs');
      selectAll.checked = inputs.every(input => input.checked);
      selectAll.indeterminate = !selectAll.checked && inputs.some(input => input.checked);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.getElementById('patientReferralDrawer')?.classList.contains('open')) closeDrawer();
  });

  createDrawer();
})();
