export function departmentMembers(department) {
  return [...new Set([...(Array.isArray(department.members) ? department.members : []), department.owner].filter(Boolean))];
}
export function validDepartmentOwner(members, owner) {
  return !owner || (typeof owner === 'string' && Array.isArray(members) && members.includes(owner));
}
