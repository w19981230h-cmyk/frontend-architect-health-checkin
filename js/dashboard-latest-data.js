/* Deterministic synthetic operational records. No real patient or clinical data. */
(function(scope){
  const sum=(rows,key)=>rows.reduce((s,r)=>s+(r[key]||0),0);
  const percent=(n,d)=>d?(n/d*100).toFixed(1):'—';
  const specs=[
    {name:'A机构',due:40000,screened:26000,abnormal:6500,eligible:5200,enrolled:4680,cohortActive:4446,managedDue:11000,active:9900},
    {name:'B机构',due:35000,screened:21000,abnormal:4620,eligible:3800,enrolled:3230,cohortActive:3000,managedDue:8000,active:7000},
    {name:'C机构',due:25000,screened:13000,abnormal:2600,eligible:2100,enrolled:1680,cohortActive:1512,managedDue:5000,active:4100}
  ];
  const patients=[];
  specs.forEach((o,oi)=>{for(let j=0;j<o.due;j++){
    const historical=j>=o.screened&&j<o.screened+o.managedDue-o.eligible;
    const enrolled=j<o.enrolled;
    const cohortActive=j<o.cohortActive;
    const active=cohortActive||(historical&&j<o.screened+o.active-o.cohortActive);
    patients.push({id:`SIM-${oi+1}-${String(j+1).padStart(5,'0')}`,org:o.name,screened:j<o.screened,abnormal:j<o.abnormal,eligible:j<o.eligible,enrolled,overdueEnrollment:j>=o.enrolled&&j<o.enrolled+Math.round((o.eligible-o.enrolled)*.3),managedDue:j<o.eligible||historical,active,source:historical?'历史及其他来源':'本期筛查',level:null,evaluable:false,standard:false});
  }});
  // Reproducible mixing keeps tier populations distributed across institutions.
  function shuffled(items){let seed=7312026;const a=[...items];for(let i=a.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
  const active=shuffled(patients.filter(p=>p.active)),inactive=shuffled(patients.filter(p=>p.managedDue&&!p.active));
  const levelSpecs=[['红色','#ff506b',1600,1400,1280,1126],['黄色','#ffd647',6400,5600,5200,4420],['绿色','#14c8ad',15400,13500,12400,11408],['未分级','#99abc3',600,500,0,0]];
  let ai=0,ii=0;
  levelSpecs.forEach(([name,color,due,inCare,evaluable,standard])=>{active.slice(ai,ai+inCare).forEach((p,i)=>Object.assign(p,{level:name,evaluable:i<evaluable,standard:i<standard}));inactive.slice(ii,ii+due-inCare).forEach(p=>p.level=name);ai+=inCare;ii+=due-inCare;});
  const cases=[];
  [['CKD','eGFR稳定',4200,3600,2520],['高血压','血压达标',9500,8550,6412],['糖尿病','HbA1c达标',7200,6300,4284]].forEach(([disease,metric,due,evaluable,achieved],di)=>{for(let i=0;i<due;i++)cases.push({id:`CASE-${di}-${i}`,patientId:active[(i+di*3500)%active.length].id,disease,metric,due:true,evaluable:i<evaluable,achieved:i<achieved});});
  const cycles=active.slice(0,15000).map((p,i)=>({id:`CYCLE-${i}`,patientId:p.id,due:true,completed:i<13680}));
  // Synthetic, mutually exclusive outcomes; pending cases have no result.
  const patientById=new Map(patients.map(p=>[p.id,p]));
  cases.forEach((c,i)=>{c.org=patientById.get(c.patientId).org;c.result=!c.evaluable?null:c.achieved?'achieved':(i%10<4?'improved':i%10<9?'stable':'worsened');});
  const alerts=[];
  // Per org: unique high-risk people, closed, handled-open, unhandled, overdue-unhandled, due-event denominator.
  [[180,360,55,85,24,420],[130,245,40,65,18,290],[90,175,25,45,12,210]].forEach(([high,closed,open,unhandled,overdue,due],oi)=>{
    const pool=active.filter(p=>p.org===specs[oi].name&&p.level==='红色').slice(0,high);
    for(let i=0;i<closed+open+unhandled;i++){
      const status=i<closed?'closed':i<closed+open?'handledOpen':'unhandled';
      const isOverdue=status==='unhandled'&&i-closed-open<overdue;
      const isDue=status==='closed'||(status==='handledOpen'&&i-closed<due-closed-overdue)||isOverdue;
      alerts.push({id:`ALERT-${oi}-${i}`,patientId:pool[i%pool.length].id,org:specs[oi].name,highRisk:true,status,overdue:isOverdue,due:isDue,timely:isDue&&status!=='unhandled'});
    }
  });
  const referrals=[];
  // Demonstration-only operational details, not clinical recommendations.
  alerts.forEach((a,i)=>Object.assign(a,{
    riskType:['指标异常预警','随访异常预警','管理中断预警'][i%3],
    durationHours:a.overdue?36+i%24:2+i%18,
    responsibleTeam:a.org+'风险管理团队',
    progress:a.status==='closed'?'结果已确认':a.status==='handledOpen'?'已处置，待结果确认':'待处置',
    openReason:a.status==='closed'?'—':a.status==='handledOpen'?['等待复查结果','等待随访反馈','等待结果审核'][i%3]:['尚未完成首次联系','等待责任团队承接','等待处置安排'][i%3],
    acceptance:a.status==='unhandled'&&i%3===1?'待承接':'已承接'
  }));
  const referralPlan=[{up:[720,684,642,610],down:[540,510,474,450]},{up:[510,474,435,408],down:[390,354,322,300]},{up:[320,296,264,246],down:[260,234,208,192]}];
  referralPlan.forEach((plan,oi)=>{const pool=active.filter(p=>p.org===specs[oi].name);['up','down'].forEach(direction=>{const counts=plan[direction];for(let i=0;i<counts[0];i++)referrals.push({id:`REF-${oi}-${direction}-${i}`,patientId:pool[i%pool.length].id,org:specs[oi].name,direction,accepted:i<counts[1],progressed:i<counts[2],closed:i<counts[3]});});});
  // All transfer timestamps fall in the reporting month and follow stage order.
  referrals.forEach((r,i)=>{
    const applied=Date.UTC(2026,6,1+i%24,8+i%8);
    r.appliedAt=new Date(applied).toISOString();
    r.acceptedAt=r.accepted?new Date(applied+(1+i%4)*3600000).toISOString():null;
    r.progressedAt=r.progressed?new Date(Date.parse(r.acceptedAt)+(12+i%24)*3600000).toISOString():null;
    r.closedAt=r.closed?new Date(Date.parse(r.progressedAt)+(6+i%18)*3600000).toISOString():null;
  });
  const organizations=specs.map(o=>{const rows=patients.filter(p=>p.org===o.name);return {name:o.name,due:rows.length,...Object.fromEntries(['screened','abnormal','eligible','enrolled','managedDue','active'].map(k=>[k,rows.filter(p=>p[k]).length]))};});
  organizations.forEach(o=>{const rows=patients.filter(p=>p.org===o.name);o.levels=levelSpecs.map(([name,color])=>({name,color,due:rows.filter(p=>p.managedDue&&p.level===name).length}));o.evaluable=rows.filter(p=>p.evaluable).length;o.standard=rows.filter(p=>p.standard).length;o.overdueEnrollment=rows.filter(p=>p.overdueEnrollment).length;});
  organizations.forEach(o=>{
    const enrolled=patients.filter(p=>p.org===o.name&&p.enrolled);
    o.enrolledLevels=levelSpecs.map(([name,color])=>({name,color,count:enrolled.filter(p=>(p.level||'未分级')===name).length}));
  });
  const totals=Object.fromEntries(['due','screened','abnormal','eligible','enrolled','managedDue','active'].map(k=>[k,sum(organizations,k)]));
  const levels=levelSpecs.map(([name,color])=>{const rows=patients.filter(p=>p.managedDue&&p.level===name);return {name,color,due:rows.length,active:rows.filter(p=>p.active).length,evaluable:name==='未分级'?null:rows.filter(p=>p.evaluable).length,standard:name==='未分级'?null:rows.filter(p=>p.standard).length};});
  const riskSummary=rows=>({high:new Set(rows.filter(r=>r.highRisk).map(r=>r.patientId)).size,unhandled:rows.filter(r=>r.status==='unhandled').length,overdue:rows.filter(r=>r.overdue).length,handledOpen:rows.filter(r=>r.status==='handledOpen').length,events:rows.length,due:rows.filter(r=>r.due).length,timelyCount:rows.filter(r=>r.due&&r.timely).length,closedCount:rows.filter(r=>r.due&&r.status==='closed').length,timely:Number(percent(rows.filter(r=>r.due&&r.timely).length,rows.filter(r=>r.due).length)),closed:Number(percent(rows.filter(r=>r.due&&r.status==='closed').length,rows.filter(r=>r.due).length))});
  const data={population:patients.length,start:'2026-07-01',end:'2026-07-31',pendingAssessment:0,ineligible:patients.filter(p=>p.abnormal&&!p.eligible).length,overdueEnrollment:patients.filter(p=>p.overdueEnrollment).length,cohortActive:patients.filter(p=>p.enrolled&&p.active).length,organizations,levels,cycles:{due:cycles.length,completed:cycles.filter(c=>c.completed).length},outcomes:['CKD','高血压','糖尿病'].map(name=>{const rows=cases.filter(c=>c.disease===name);return {name,metric:rows[0].metric,evaluable:rows.filter(c=>c.evaluable).length,achieved:rows.filter(c=>c.achieved).length};}),evaluationDue:cases.length,risks:specs.map(o=>({name:o.name,...riskSummary(alerts.filter(a=>a.org===o.name))})),riskTotals:riskSummary(alerts),referrals:specs.map(o=>{const rows=referrals.filter(r=>r.org===o.name);return {name:o.name,up:rows.filter(r=>r.direction==='up').length,upClosed:rows.filter(r=>r.direction==='up'&&r.closed).length,down:rows.filter(r=>r.direction==='down').length,downClosed:rows.filter(r=>r.direction==='down'&&r.closed).length};}),referralStages:Object.fromEntries(['up','down'].map(direction=>{const rows=referrals.filter(r=>r.direction===direction);return [direction,[rows.length,...['accepted','progressed','closed'].map(k=>rows.filter(r=>r[k]).length)]];}))};
  const cohortExited=shuffled(patients.filter(p=>p.enrolled&&!p.active));
  const riskOverview=rows=>({
    high: new Set(rows.filter(a=>a.highRisk).map(a=>a.patientId)).size,
    highOpen: new Set(rows.filter(a=>a.highRisk&&a.status!=='closed').map(a=>a.patientId)).size,
    highOverdue: new Set(rows.filter(a=>a.highRisk&&a.overdue).map(a=>a.patientId)).size,
    pending:rows.filter(a=>a.status==='unhandled').length,
    affected:new Set(rows.filter(a=>a.status==='unhandled').map(a=>a.patientId)).size,
    overdue:rows.filter(a=>a.overdue).length,
    open:rows.filter(a=>a.status!=='closed').length,
    dueOpen:rows.filter(a=>a.due&&a.status!=='closed').length
  });
  data.riskOverview=riskOverview(alerts);
  data.riskAttention=specs.map(o=>({name:o.name,...riskOverview(alerts.filter(a=>a.org===o.name))})).filter(o=>o.open>0).sort((a,b)=>b.overdue-a.overdue);
  data.organizationOutcomes=specs.map(o=>{
    const rows=cases.filter(c=>c.org===o.name),evaluated=rows.filter(c=>c.evaluable);
    return {name:o.name,due:rows.length,evaluable:evaluated.length,...Object.fromEntries(['achieved','improved','stable','worsened'].map(key=>[key,evaluated.filter(c=>c.result===key).length]))};
  });
  cohortExited.forEach((p,i)=>p.exitReason=i<Math.round(cohortExited.length*.5)?'正常完成':i<Math.round(cohortExited.length*.8)?'管理中断':'其他退出');
  data.cohortExits=['正常完成','管理中断','其他退出'].map(name=>({name,count:cohortExited.filter(p=>p.exitReason===name).length}));
  data.managementSources={
    cohortActive:patients.filter(p=>p.enrolled&&p.active).length,
    otherActive:patients.filter(p=>!p.enrolled&&p.active).length,
    inactive:patients.filter(p=>p.managedDue&&!p.active).length
  };
  data.referralMetrics=Object.fromEntries(['up','down'].map(direction=>{
    const rows=referrals.filter(r=>r.direction===direction);
    const count=predicate=>new Set(rows.filter(predicate).map(r=>r.patientId)).size;
    const stages=[count(()=>true),...['accepted','progressed','closed'].map(k=>count(r=>r[k]))];
    const accepted=rows.filter(r=>r.acceptedAt);
    return [direction,{stages,transitionRates:stages.slice(1).map((n,i)=>percent(n,stages[i])),closureRate:percent(stages[3],stages[0]),
      averageAcceptanceHours:accepted.length?(accepted.reduce((n,r)=>n+(Date.parse(r.acceptedAt)-Date.parse(r.appliedAt))/3600000,0)/accepted.length).toFixed(1):'—',
      awaitingProgress:count(r=>r.accepted&&!r.progressed),awaitingAcceptance:count(r=>!r.accepted),awaitingClosure:count(r=>!r.closed)}];
  }));
  data.provenance={population:'用户确认：区域总人数100000人',flows:'基于业务流转规则生成，尚未接入真实业务明细',scenario:'regional-100k-v1'};
  const records={patients,cases,cycles,alerts,referrals};
  const api={data,totals,sum,percent,records};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else scope.DashboardLatestData=api;
})(typeof window!=='undefined'?window:globalThis);
