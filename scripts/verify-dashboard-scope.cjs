const assert=require('node:assert/strict');
const api=require('../js/dashboard-latest-scope.js');
const regional=api.select();
for(const [key,value] of Object.entries(api.totals))if(key in regional.totals)assert.equal(regional.totals[key],value,key);
assert.deepEqual(regional.data.referralMetrics,api.data.referralMetrics);
for(const key of ['highOpen','overdue'])assert.equal(regional.data.riskOverview[key],api.data.riskOverview[key]);
let visited=0;
function verify(view){
  visited++;
  const ids=new Set(view.records.patients.map(p=>p.id));
  for(const key of ['alerts','cases','cycles','referrals'])assert(view.records[key].every(r=>ids.has(r.patientId)),key);
  assert.equal(view.data.levels.reduce((n,l)=>n+l.due,0),view.totals.managedDue);
  if(view.personal){
    for(const kind of ['等级','状态'])assert.equal(view.breakdowns[kind].reduce((n,r)=>n+r.count,0),view.totals.due);
    return;
  }
  for(const key of Object.keys(view.totals))assert.equal(view.groups.reduce((n,g)=>n+g[key],0),view.totals[key],key);
  for(const group of view.groups){
    assert.equal(group.enrolledLevels.reduce((n,l)=>n+l.count,0),group.enrolled);
    const child=api.select(group.child);assert.equal(child.totals.due,group.due);verify(child);
  }
}
verify(regional);
const owner=api.filterEngine.people[0];
const personal=api.select({org:owner.org,dept:owner.dept,team:owner.team,person:owner.name,disease:'CKD'});
assert(personal.records.patients.every(p=>p.person===owner.name&&p.diseases.includes('CKD')));
assert(personal.records.cases.every(c=>c.disease==='CKD'));
for(const filters of [{org:'不存在'},{start:'2026-08-01',end:'2026-08-31'}]){
  const empty=api.select(filters);assert.equal(empty.totals.due,0);assert.equal(empty.records.alerts.length,0);assert(empty.message);
}
assert.deepEqual(api.select().totals,regional.totals);
console.log(`PASS: ${visited} hierarchy scopes reconcile; disease intersections, record ownership, empty scopes and reset verified.`);
