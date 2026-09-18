export const departmentTypes = ['门诊', '住院', '医技', '其他'];

export function normalizeDepartmentType(value) {
  const type = typeof value === 'string' ? value.trim() : '';
  if (type.includes('门诊')) return '门诊';
  if (type.includes('住院')) return '住院';
  if (type.includes('医技')) return '医技';
  return '其他';
}

export function departmentMembers(department) {
  return [...new Set([...(Array.isArray(department.members) ? department.members : []), department.owner].filter(Boolean))];
}
export function validDepartmentOwner(members, owner) {
  return !owner || (typeof owner === 'string' && Array.isArray(members) && members.includes(owner));
}
