import assert from 'node:assert/strict';
import {departmentMembers,validDepartmentOwner} from '../sites-deploy/ui/organization-department.mjs';
assert.deepEqual(departmentMembers({owner:'张医生'}),['张医生']);
assert.deepEqual(departmentMembers({members:['张医生','李医生','张医生'],owner:'张医生'}),['张医生','李医生']);
assert.equal(validDepartmentOwner(['张医生','李医生'],'李医生'),true);
assert.equal(validDepartmentOwner(['张医生'],'李医生'),false);
assert.equal(validDepartmentOwner(['张医生','李医生'],['张医生','李医生']),false);
assert.equal(validDepartmentOwner([],undefined),true);
console.log('科室人员兼容、去重和唯一负责人校验通过');
