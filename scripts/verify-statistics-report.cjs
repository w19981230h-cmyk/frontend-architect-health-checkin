const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');

const source = fs.readFileSync('js/statistics-report.js', 'utf8');
const filterSource = fs.readFileSync('sites-deploy/ui/statistics-filters.jsx', 'utf8');

assert.doesNotThrow(() => new vm.Script(source), '统计看板脚本应能正常解析');
assert.ok(!source.includes('<<<<<<<'), '统计看板脚本不能包含合并冲突标记');
assert.ok(!filterSource.includes('<<<<<<<'), '统计查询组件不能包含合并冲突标记');
assert.match(source, /srFilterHost/);
assert.match(source, /filterState/);
assert.match(source, /window\.StatisticsFilters\.mount/);
assert.match(filterSource, /DatePicker\.RangePicker/);
assert.match(filterSource, /时间范围/);
assert.match(filterSource, /集团/);
assert.match(filterSource, /科室/);
assert.match(filterSource, /个人/);
assert.match(filterSource, /病种/);
assert.match(filterSource, /重置/);
assert.match(source, /患者管理流转/);
assert.match(source, /向上转诊/);
assert.match(source, /向下转诊/);
assert.match(source, /通用管理成效/);
assert.match(source, /风险与安全/);
assert.match(source, /管理执行质量/);
assert.match(source, /AI应用情况/);
assert.match(source, /机构排名/);
assert.match(source, /type:'funnel'/);
assert.match(source, /graphic:graphics/);
assert.match(source, /window\.renderStatisticsReport = refresh/);

console.log('PASS: Ant Design statistics filters, reset, funnels, quality, disease, safety, resources, ranking, and refresh hook');
