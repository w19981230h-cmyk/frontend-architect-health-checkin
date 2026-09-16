/* Scope aggregation over the same synthetic records; no proportional scaling. */
(function(api){
  const {records,data:base,sum,percent}=api;
  const fields=['org','dept','team','person'],labels=['机构','科室','团队','人员'];
  const people=[];
  base.organizations.forEach(o=>['全科医学科','慢病管理科'].forEach(dept=>['一组','二组'].forEach(team=>['负责人甲','负责人乙'].forEach(person=>{
    people.push({org:o.name,dept,team:o.name+'·'+dept+'·'+team,name:o.name+'·'+dept+'·'+team+'·'+person});
  }))));
  const diagnosis=new Map();
  records.cases.forEach(c=>{if(!diagnosis.has(c.patientId))diagnosis.set(c.patientId,new Set());diagnosis.get(c.patientId).add(c.disease);});
  records.patients.forEach((p,i)=>{
    const owners=people.filter(o=>o.org===p.org),owner=owners[i%owners.length];
    Object.assign(p,{dept:owner.dept,team:owner.team,person:owner.name,diseases:[...(diagnosis.get(p.id)||new Set([base.outcomes[i%base.outcomes.length].name]))]});
  });
  const byId=new Map(records.patients.map(p=>[p.id,p]));
  const unique=(rows,fn)=>new Set(rows.filter(fn).map(r=>r.patientId)).size;
  const count=(rows,key)=>rows.filter(r=>r[key]).length;
  const management=rows=>Object.fromEntries(['screened','abnormal','eligible','enrolled','managedDue','active','evaluable','standard','overdueEnrollment'].map(k=>[k,count(rows,k)]));
  const levels=rows=>base.levels.map(l=>({name:l.name,color:l.color,due:rows.filter(p=>p.managedDue&&p.level===l.name).length,active:rows.filter(p=>p.active&&p.level===l.name).length,evaluable:l.name==='未分级'?null:rows.filter(p=>p.evaluable&&p.level===l.name).length,standard:l.name==='未分级'?null:rows.filter(p=>p.standard&&p.level===l.name).length}));
  const outcome=rows=>({due:rows.length,evaluable:count(rows,'evaluable'),...Object.fromEntries(['achieved','improved','stable','worsened'].map(k=>[k,rows.filter(c=>c.evaluable&&c.result===k).length]))});
  const risk=rows=>({high:unique(rows,a=>a.highRisk),highOpen:unique(rows,a=>a.highRisk&&a.status!=='closed'),highOverdue:unique(rows,a=>a.highRisk&&a.overdue),pending:rows.filter(a=>a.status==='unhandled').length,affected:unique(rows,a=>a.status==='unhandled'),overdue:count(rows,'overdue'),open:rows.filter(a=>a.status!=='closed').length,dueOpen:rows.filter(a=>a.due&&a.status!=='closed').length});
  const riskTotals=rows=>{
    const due=count(rows,'due'),timelyCount=rows.filter(a=>a.due&&a.timely).length,closedCount=rows.filter(a=>a.due&&a.status==='closed').length;
    return {...risk(rows),unhandled:rows.filter(a=>a.status==='unhandled').length,handledOpen:rows.filter(a=>a.status==='handledOpen').length,events:rows.length,due,timelyCount,closedCount,timely:due?Number(percent(timelyCount,due)):null,closed:due?Number(percent(closedCount,due)):null};
  };
  const status=p=>p.active?'在管':p.enrolled?'已入组未在管':p.eligible?'符合条件待入组':p.screened?'已筛查未入组':'未筛查';
  api.filterEngine={orgs:Object.fromEntries(base.organizations.map(o=>[o.name,[...new Set(people.filter(p=>p.org===o.name).map(p=>p.dept))]])),people,diseases:base.outcomes.map(r=>r.name),hierarchical:true};
  api.select=function(filters={}){
    const f={org:'',dept:'',team:'',person:'',disease:'',start:base.start,end:base.end,...filters};
    const index=f.person?4:f.team?3:f.dept?2:f.org?1:0;
    const comparison=labels[index]||'病种';
    const available=f.start===base.start&&f.end===base.end;
    const patients=available?records.patients.filter(p=>fields.every(k=>!f[k]||p[k]===f[k])&&(!f.disease||p.diseases.includes(f.disease))):[];
    const ids=new Set(patients.map(p=>p.id));
    const selected={patients,...Object.fromEntries(['cases','cycles','alerts','referrals'].map(k=>[k,records[k].filter(r=>ids.has(r.patientId)&&(k!=='cases'||!f.disease||r.disease===f.disease))]))};
    const bucketNames=index===4?(f.disease?[f.disease]:api.filterEngine.diseases):[...new Set(people.filter(p=>(!f.org||p.org===f.org)&&(!f.dept||p.dept===f.dept)&&(!f.team||p.team===f.team)).map(p=>index===3?p.name:p[fields[index]]))];
    const groups=bucketNames.map(name=>{
      const members=patients.filter(p=>index===4?p.diseases.includes(name):p[fields[index]]===name),memberIds=new Set(members.map(p=>p.id));
      const matches=r=>memberIds.has(r.patientId);
      const child=index===4?null:{...f,[fields[index]]:name};
      if(child)fields.slice(index+1).forEach(k=>child[k]='');
      const ls=levels(members);
      return {name,label:name.split('·').at(-1),child,patientIds:memberIds,due:members.length,...management(members),levels:ls,enrolledLevels:ls.map(l=>({name:l.name,color:l.color,count:members.filter(p=>p.enrolled&&(p.level||'未分级')===l.name).length})),outcome:outcome(selected.cases.filter(c=>matches(c)&&(index!==4||c.disease===name))),risk:risk(selected.alerts.filter(matches))};
    });
    const totals={due:patients.length,...management(patients)};
    const d={...base,start:f.start,end:f.end,population:patients.length,organizations:groups,levels:levels(patients),pendingAssessment:0,ineligible:patients.filter(p=>p.abnormal&&!p.eligible).length,overdueEnrollment:count(patients,'overdueEnrollment'),cohortActive:patients.filter(p=>p.enrolled&&p.active).length,
      managementSources:{cohortActive:patients.filter(p=>p.enrolled&&p.active).length,otherActive:patients.filter(p=>!p.enrolled&&p.active).length,inactive:patients.filter(p=>p.managedDue&&!p.active).length},
      outcomes:base.outcomes.filter(o=>!f.disease||o.name===f.disease).map(o=>({...o,...outcome(selected.cases.filter(c=>c.disease===o.name))})),evaluationDue:selected.cases.length,organizationOutcomes:groups.map(g=>({name:g.label,...g.outcome})),
      riskOverview:risk(selected.alerts),riskTotals:riskTotals(selected.alerts),riskAttention:groups.filter(g=>g.risk.open).map(g=>({name:g.name,label:g.label,...g.risk})).sort((a,b)=>b.overdue-a.overdue)};
    d.referralMetrics=Object.fromEntries(['up','down'].map(direction=>{
      const rows=selected.referrals.filter(r=>r.direction===direction),stages=[unique(rows,()=>true),...['accepted','progressed','closed'].map(k=>unique(rows,r=>r[k]))],accepted=rows.filter(r=>r.acceptedAt);
      return [direction,{stages,transitionRates:stages.slice(1).map((n,i)=>percent(n,stages[i])),closureRate:percent(stages[3],stages[0]),averageAcceptanceHours:accepted.length?(accepted.reduce((n,r)=>n+(Date.parse(r.acceptedAt)-Date.parse(r.appliedAt))/3600000,0)/accepted.length).toFixed(1):'—',awaitingProgress:unique(rows,r=>r.accepted&&!r.progressed),awaitingAcceptance:unique(rows,r=>!r.accepted),awaitingClosure:unique(rows,r=>!r.closed)}];
    }));
    const breakdowns={病种:api.filterEngine.diseases.map(name=>({name,count:patients.filter(p=>p.diseases.includes(name)).length})),等级:base.levels.map(l=>({name:l.name,count:patients.filter(p=>(p.level||'未分级')===l.name).length})),状态:['在管','已入组未在管','符合条件待入组','已筛查未入组','未筛查'].map(name=>({name,count:patients.filter(p=>status(p)===name).length}))};
    return {data:d,totals,sum,percent,records:selected,groups,filters:f,comparison,personal:index===4,breakdowns,status,scopeName:index?fields.filter(k=>f[k]).map(k=>f[k].split('·').at(-1)).join(' / '):'整个区域',message:!available?'当前仅提供 2026 年 7 月整月模拟快照，所选日期范围暂无数据。':!patients.length?'当前筛选范围暂无数据。':'',byId};
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof module!=='undefined'&&module.exports?require('./dashboard-latest-data.js'):window.DashboardLatestData);
