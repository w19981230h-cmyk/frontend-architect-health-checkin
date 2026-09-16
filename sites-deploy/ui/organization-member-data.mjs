// Prototype-only member details. These are demonstration contacts, not a staff directory.
const entries=[
 ['李院长','主任医师','0771-5550100'],
 ['张医生','主任医师','0771-5550101'],
 ['李医生','副主任医师','0771-5550102'],
 ['王医生','主治医师','0771-5550103'],
 ['赵医生','副主任医师','0771-5550104'],
 ['陈营养师','主管营养师','0771-5550105'],
 ['刘药师','主管药师','0771-5550106'],
 ['孙医生','主治医师','0771-5550107'],
 ['周医生','主任医师','0771-5550108'],
];
const avatar='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#e8efff"/><circle cx="40" cy="29" r="13" fill="#6c8ce8"/><path d="M16 70c0-17 10-26 24-26s24 9 24 26" fill="#6c8ce8"/></svg>');
export const memberProfiles=Object.fromEntries(entries.map(([name,title,phone])=>[name,{name,title,phone,avatar}]));
export const departmentDescriptions=[
 '开展慢性肾脏病、肾炎及蛋白尿等疾病的门诊诊疗与长期随访。',
 '承担肾脏疾病住院诊疗、病情监测、治疗护理及出院随访。',
 '开展糖尿病、甲状腺疾病等内分泌疾病的门诊诊疗与健康管理。',
 '承担内分泌疾病住院诊疗、血糖监测及并发症管理。',
 '提供营养评估、膳食指导及个体化营养干预。',
 '提供处方审核、临床药学服务及安全用药指导。',
 '开展乳腺、甲状腺疾病的门诊诊疗与术后随访。',
 '开展心血管疾病诊疗、住院管理及康复指导。',
];
