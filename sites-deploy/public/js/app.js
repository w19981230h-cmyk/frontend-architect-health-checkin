renderList();
renderIndicatorList();
renderPatientList();
renderPatientDetail();
renderCheckinPanel();
const initialParams = new URLSearchParams(window.location.search);
const initialPreviewTemplate = initialParams.get('previewTemplate');
if (initialPreviewTemplate && indicatorTemplates.some(item => item.id === initialPreviewTemplate)) {
  openTemplatePreviewFromList(initialPreviewTemplate);
} else if (initialParams.get('preview') === '1') {
  showPatientPage();
  openTemplatePreview();
  const initialPatientIndex = Number(initialParams.get('patient'));
  if (Number.isInteger(initialPatientIndex) && initialPatientIndex >= 0 && initialPatientIndex < getTemplatePreviewPatients().length) {
    templatePreviewState.patientIndex = initialPatientIndex;
    renderTemplatePreview();
  }
}
initInteractionRuleLocator();
