const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');

const source = fs.readFileSync('js/statistics-report.js', 'utf8');

assert.doesNotThrow(() => new vm.Script(source), '统计看板脚本应能正常解析');
assert.ok(!source.includes('<<<<<<<'), '统计看板脚本不能包含合并冲突标记');
assert.match(source, /srStartDate/);
assert.match(source, /srEndDate/);
assert.match(source, /srInstitution/);
assert.match(source, /srDepartment/);
assert.match(source, /srDoctor/);
assert.match(source, /srDisease/);
assert.match(source, /data-sr-reset/);
assert.match(source, /患者管理流转/);
assert.match(source, /向上转诊/);
assert.match(source, /向下转诊/);
assert.match(source, /疾病管理成效/);
assert.match(source, /风险与安全/);
assert.match(source, /服务资源应用情况/);
assert.match(source, /机构绩效排名/);
assert.match(source, /type:'funnel'/);
assert.match(source, /graphic:graphics/);
assert.match(source, /window\.renderStatisticsReport = refresh/);

console.log('PASS: statistics report filters, reset, funnels, quality, disease, safety, resources, ranking, and refresh hook');
