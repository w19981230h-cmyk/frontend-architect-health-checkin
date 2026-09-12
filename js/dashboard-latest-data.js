/* Deterministic synthetic operational records. No real patient or clinical data. */
(function(scope){
  const sum=(rows,key)=>rows.reduce((s,r)=>s+(r[key]||0),0);
  const percent=(n,d)=>d?(n/d*100).toFixed(1):'—';
  const specs=[
    {name:'A机构',due:4800,screened:3000,abnormal:600,eligible:500,enrolled:400,managedDue:1160,active:1000},
    {name:'B机构',due:4200,screened:2000,abnormal:400,eligible:300,enrolled:240,managedDue:820,active:700},
    {name:'C机构',due:3000,screened:1000,abnormal:200,eligible:200,enrolled:160,managedDue:580,active:500}
  ];
  const patients=[];
  specs.forEach((o,oi)=>{for(let j=0;j<o.due;j++){
    const historical=j>=o.screened&&j<o.screened+o.managedDue-o.eligible;
    const enrolled=j<o.enrolled;
    const cohortActive=j<o.enrolled*.9;
    const active=cohortActive||(historical&&j<o.screened+o.active-o.enrolled*.9);
    patients.push({id:`SIM-${oi+1}-${String(j+1).padStart(5,'0')}`,org:o.name,screened:j<o.screened,abnormal:j<o.abnormal,eligible:j<o.eligible,enrolled,overdueEnrollment:j>=o.enrolled&&j<o.enrolled+Math.round((o.eligible-o.enrolled)*.3),managedDue:j<o.eligible||historical,active,source:historical?'历史及其他来源':'本期筛查',level:null,evaluable:false,standard:false});
  }});
  // Reproducible mixing keeps tier populations distributed across institutions.
  function shuffled(items){let seed=7312026;const a=[...items];for(let i=a.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
  const active=shuffled(patients.filter(p=>p.active)),inactive=shuffled(patients.filter(p=>p.managedDue&&!p.active));
  const levelSpecs=[['红色','#ff506b',160,132,120,108],['黄色','#ffd647',640,528,480,408],['绿色','#14c8ad',1700,1496,1360,1224],['未分级','#99abc3',60,44,0,0]];
  let ai=0,ii=0;
  levelSpecs.forEach(([name,color,due,inCare,evaluable,standard])=>{active.slice(ai,ai+inCare).forEach((p,i)=>Object.assign(p,{level:name,evaluable:i<evaluable,standard:i<standard}));inactive.slice(ii,ii+due-inCare).forEach(p=>p.level=name);ai+=inCare;ii+=due-inCare;});
  const cases=[];
  [['CKD','eGFR稳定',480,400,320],['高血压','血压达标',820,700,525],['糖尿病','HbA1c达标',700,600,420]].forEach(([disease,metric,due,evaluable,achieved],di)=>{for(let i=0;i<due;i++)cases.push({id:`CASE-${di}-${i}`,patientId:active[(i+di*350)%active.length].id,disease,metric,due:true,evaluable:i<evaluable,achieved:i<achieved});});
  const cycles=active.slice(0,300).map((p,i)=>({id:`CYCLE-${i}`,patientId:p.id,due:true,completed:i<262}));
  const alerts=[];
  // Per org: unique high-risk people, closed, handled-open, unhandled, overdue-unhandled, due-event denominator.
  [[8,36,4,14,4,40],[6,15,4,10,3,20],[4,17,8,6,1,20]].forEach(([high,closed,open,unhandled,overdue,due],oi)=>{
    const pool=active.filter(p=>p.org===specs[oi].name).slice(0,high);
    for(let i=0;i<closed+open+unhandled;i++){
      const status=i<closed?'closed':i<closed+open?'handledOpen':'unhandled';
      const isOverdue=status==='unhandled'&&i-closed-open<overdue;
      const isDue=status==='closed'||(status==='handledOpen'&&i-closed<due-closed-overdue)||isOverdue;
      alerts.push({id:`ALERT-${oi}-${i}`,patientId:pool[i%pool.length].id,org:specs[oi].name,highRisk:true,status,overdue:isOverdue,due:isDue,timely:isDue&&status!=='unhandled'});
    }
  });
  const referrals=[];
  const referralPlan=[{up:[120,116,112,108],down:[80,76,72,68]},{up:[80,74,68,64],down:[60,56,46,42]},{up:[40,38,36,32],down:[40,36,34,34]}];
  referralPlan.forEach((plan,oi)=>{const pool=active.filter(p=>p.org===specs[oi].name);['up','down'].forEach(direction=>{const counts=plan[direction];for(let i=0;i<counts[0];i++)referrals.push({id:`REF-${oi}-${direction}-${i}`,patientId:pool[i%pool.length].id,org:specs[oi].name,direction,accepted:i<counts[1],progressed:i<counts[2],closed:i<counts[3]});});});
  const organizations=specs.map(o=>{const rows=patients.filter(p=>p.org===o.name);return {name:o.name,due:rows.length,...Object.fromEntries(['screened','abnormal','eligible','enrolled','managedDue','active'].map(k=>[k,rows.filter(p=>p[k]).length]))};});
  const totals=Object.fromEntries(['due','screened','abnormal','eligible','enrolled','managedDue','active'].map(k=>[k,sum(organizations,k)]));
  const levels=levelSpecs.map(([name,color])=>{const rows=patients.filter(p=>p.managedDue&&p.level===name);return {name,color,due:rows.length,active:rows.filter(p=>p.active).length,evaluable:name==='未分级'?null:rows.filter(p=>p.evaluable).length,standard:name==='未分级'?null:rows.filter(p=>p.standard).length};});
  const riskSummary=rows=>({high:new Set(rows.filter(r=>r.highRisk).map(r=>r.patientId)).size,unhandled:rows.filter(r=>r.status==='unhandled').length,overdue:rows.filter(r=>r.overdue).length,handledOpen:rows.filter(r=>r.status==='handledOpen').length,events:rows.length,due:rows.filter(r=>r.due).length,timelyCount:rows.filter(r=>r.due&&r.timely).length,closedCount:rows.filter(r=>r.due&&r.status==='closed').length,timely:Number(percent(rows.filter(r=>r.due&&r.timely).length,rows.filter(r=>r.due).length)),closed:Number(percent(rows.filter(r=>r.due&&r.status==='closed').length,rows.filter(r=>r.due).length))});
  const data={population:patients.length,start:'2026-07-01',end:'2026-07-31',pendingAssessment:0,ineligible:patients.filter(p=>p.abnormal&&!p.eligible).length,overdueEnrollment:patients.filter(p=>p.overdueEnrollment).length,cohortActive:patients.filter(p=>p.enrolled&&p.active).length,organizations,levels,cycles:{due:cycles.length,completed:cycles.filter(c=>c.completed).length},outcomes:['CKD','高血压','糖尿病'].map(name=>{const rows=cases.filter(c=>c.disease===name);return {name,metric:rows[0].metric,evaluable:rows.filter(c=>c.evaluable).length,achieved:rows.filter(c=>c.achieved).length};}),evaluationDue:cases.length,risks:specs.map(o=>({name:o.name,...riskSummary(alerts.filter(a=>a.org===o.name))})),riskTotals:riskSummary(alerts),referrals:specs.map(o=>{const rows=referrals.filter(r=>r.org===o.name);return {name:o.name,up:rows.filter(r=>r.direction==='up').length,upClosed:rows.filter(r=>r.direction==='up'&&r.closed).length,down:rows.filter(r=>r.direction==='down').length,downClosed:rows.filter(r=>r.direction==='down'&&r.closed).length};}),referralStages:Object.fromEntries(['up','down'].map(direction=>{const rows=referrals.filter(r=>r.direction===direction);return [direction,[rows.length,...['accepted','progressed','closed'].map(k=>rows.filter(r=>r[k]).length)]];}))};
  const records={patients,cases,cycles,alerts,referrals};
  const api={data,totals,sum,percent,records};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else scope.DashboardLatestData=api;
})(typeof window!=='undefined'?window:globalThis);
