const assert=require('node:assert/strict');
const {data:d,totals:t,records:r,sum,percent}=require('../js/dashboard-latest-data.js');
const people=new Map(r.patients.map(p=>[p.id,p]));
assert.equal(people.size,100000);assert.equal(d.population,100000);
assert.deepEqual(t,{due:100000,screened:60000,abnormal:13720,eligible:11100,enrolled:9590,managedDue:24000,active:21000});
for(const rows of Object.values(r)){assert.equal(new Set(rows.map(x=>x.id)).size,rows.length);}
for(const p of r.patients){
 assert.ok(!p.abnormal||p.screened);assert.ok(!p.eligible||p.abnormal);assert.ok(!p.enrolled||p.eligible);
 assert.ok(!p.active||p.managedDue);assert.ok(!p.standard||p.evaluable);assert.ok(!p.evaluable||(p.active&&p.level!=='未分级'));
 assert.ok(!p.managedDue||d.levels.some(l=>l.name===p.level));
 assert.ok(!p.overdueEnrollment||(p.eligible&&!p.enrolled));
 assert.equal(Boolean(p.exitReason),p.enrolled&&!p.active);
}
for(const o of d.organizations){
 const ps=r.patients.filter(p=>p.org===o.name);
 assert.equal(o.due,ps.length);
 for(const k of ['screened','abnormal','eligible','enrolled','managedDue','active','evaluable','standard','overdueEnrollment'])assert.equal(o[k],ps.filter(p=>p[k]).length);
 assert.equal(sum(o.levels,'due'),o.managedDue);assert.equal(sum(o.enrolledLevels,'count'),o.enrolled);
}
for(const k of Object.keys(t))assert.equal(sum(d.organizations,k),t[k]);
for(const l of d.levels){
 const ps=r.patients.filter(p=>p.managedDue&&p.level===l.name);
 assert.equal(l.due,ps.length);assert.equal(l.active,ps.filter(p=>p.active).length);
 for(const k of ['evaluable','standard'])assert.equal(l[k]||0,ps.filter(p=>p[k]).length);
 assert.equal(d.organizations.reduce((n,o)=>n+o.levels.find(x=>x.name===l.name).due,0),l.due);
}
assert.equal(sum(d.levels,'due'),t.managedDue);assert.equal(sum(d.levels,'active'),t.active);
assert.equal(sum(d.levels,'standard'),sum(d.organizations,'standard'));
assert.equal(sum(d.levels,'evaluable'),sum(d.organizations,'evaluable'));
assert.equal(t.abnormal,t.eligible+d.ineligible+d.pendingAssessment);
assert.equal(d.cohortActive,r.patients.filter(p=>p.enrolled&&p.active).length);
assert.equal(d.managementSources.cohortActive+d.managementSources.otherActive,t.active);
assert.equal(d.managementSources.inactive+t.active,t.managedDue);
assert.equal(d.cohortActive+sum(d.cohortExits,'count'),t.enrolled);
for(const key of ['cases','cycles','alerts','referrals'])for(const row of r[key])assert.ok(people.has(row.patientId));
assert.equal(new Set(r.cases.map(c=>c.patientId+'|'+c.disease)).size,r.cases.length);
for(const c of r.cases){assert.ok(people.get(c.patientId).active);assert.equal(c.org,people.get(c.patientId).org);assert.equal(c.evaluable,c.result!==null);assert.equal(c.achieved,c.result==='achieved');}
for(const o of d.organizationOutcomes){
 const cs=r.cases.filter(c=>c.org===o.name);assert.equal(o.due,cs.length);assert.equal(o.evaluable,cs.filter(c=>c.evaluable).length);
 assert.equal(o.achieved+o.improved+o.stable+o.worsened,o.evaluable);
 for(const k of ['achieved','improved','stable','worsened'])assert.equal(o[k],cs.filter(c=>c.result===k).length);
}
for(const o of d.outcomes){const cs=r.cases.filter(c=>c.disease===o.name);for(const k of ['evaluable','achieved'])assert.equal(o[k],cs.filter(c=>c[k]).length);}
assert.equal(d.evaluationDue,r.cases.length);assert.equal(sum(d.organizationOutcomes,'due'),d.evaluationDue);
for(const k of ['evaluable','achieved'])assert.equal(sum(d.organizationOutcomes,k),sum(d.outcomes,k));
assert.equal(d.cycles.due,r.cycles.length);assert.equal(d.cycles.completed,r.cycles.filter(c=>c.completed).length);
for(const a of r.alerts){assert.equal(people.get(a.patientId).org,a.org);assert.equal(people.get(a.patientId).level,'红色');assert.ok(!a.overdue||(a.due&&a.status==='unhandled'));assert.ok(!a.timely||(a.due&&a.status!=='unhandled'));}
for(const o of [...d.risks,{...d.riskTotals,name:null}]){
 const rows=r.alerts.filter(a=>!o.name||a.org===o.name),count=fn=>rows.filter(fn).length;
 assert.equal(o.events,rows.length);assert.equal(o.events,o.closedCount+o.handledOpen+o.unhandled);
 assert.equal(o.due,count(a=>a.due));assert.equal(o.closedCount,count(a=>a.due&&a.status==='closed'));
 assert.equal(o.timelyCount,count(a=>a.due&&a.timely));assert.equal(o.unhandled,count(a=>a.status==='unhandled'));
 assert.equal(o.timely,Number(percent(o.timelyCount,o.due)));assert.equal(o.closed,Number(percent(o.closedCount,o.due)));
}
for(const o of [...d.riskAttention,{...d.riskOverview,name:null}]){
 const rows=r.alerts.filter(a=>!o.name||a.org===o.name),count=fn=>rows.filter(fn).length,persons=fn=>new Set(rows.filter(fn).map(a=>a.patientId)).size;
 assert.equal(o.high,persons(a=>a.highRisk));assert.equal(o.highOpen,persons(a=>a.highRisk&&a.status!=='closed'));
 assert.equal(o.highOverdue,persons(a=>a.highRisk&&a.overdue));assert.equal(o.pending,count(a=>a.status==='unhandled'));
 assert.equal(o.affected,persons(a=>a.status==='unhandled'));assert.equal(o.overdue,count(a=>a.overdue));assert.equal(o.dueOpen,count(a=>a.due&&a.status!=='closed'));
}
for(const dir of ['up','down']){
 const rows=r.referrals.filter(x=>x.direction===dir),m=d.referralMetrics[dir];
 assert.equal(new Set(rows.map(x=>x.patientId)).size,rows.length);
 const stages=[rows.length,...['accepted','progressed','closed'].map(k=>rows.filter(x=>x[k]).length)];
 assert.deepEqual(m.stages,stages);assert.deepEqual(d.referralStages[dir],stages);
 assert.deepEqual(m.transitionRates,stages.slice(1).map((n,i)=>percent(n,stages[i])));assert.equal(m.closureRate,percent(stages[3],stages[0]));
 assert.equal(m.awaitingProgress,stages[1]-stages[2]);assert.equal(m.awaitingAcceptance,stages[0]-stages[1]);assert.equal(m.awaitingClosure,stages[0]-stages[3]);
 const accepted=rows.filter(x=>x.accepted);assert.equal(m.averageAcceptanceHours,(accepted.reduce((n,x)=>n+(Date.parse(x.acceptedAt)-Date.parse(x.appliedAt))/3600000,0)/accepted.length).toFixed(1));
 for(const x of rows){
  assert.equal(people.get(x.patientId).org,x.org);assert.ok(!x.closed||x.progressed);assert.ok(!x.progressed||x.accepted);
  let last=Date.parse(x.appliedAt);assert.ok(last>=Date.parse(d.start));
  for(const [k,time] of [['accepted','acceptedAt'],['progressed','progressedAt'],['closed','closedAt']]){assert.equal(Boolean(x[time]),x[k]);if(x[time]){const next=Date.parse(x[time]);assert.ok(next>=last&&next<Date.parse(d.end)+86400000);last=next;}}
 }
 assert.equal(sum(d.referrals,dir),stages[0]);assert.equal(sum(d.referrals,dir+'Closed'),stages[3]);
}
assert.equal(percent(1,0),'—');assert.equal(percent(0,100),'0.0');assert.equal(percent(100,100),'100.0');
console.log('PASS: 100,000 unique people; screening flow, organization/tier/source totals, case outcomes, risk summaries/detail counts, referral timelines/rates and weighted durations reconcile.');
