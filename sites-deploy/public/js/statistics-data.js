/* Deterministic synthetic event records. No production patient data is used.
   Every count is aggregated from records; rates are numerator / denominator.
   The date range selects screening cohorts and their events through the end date. */
(function(root){
  const orgs={'第一附属医院':['肾内科','内分泌科','心内科','乳甲外科'],'第二附属医院':['肾内科','内分泌科'],'东院区':['全科医学科','心内科'],'社区中心':['全科医学科']};
  const diseases=['CKD','高血压','糖尿病','乳腺结节'];
  const indicators={CKD:['eGFR稳定','尿白蛋白/肌酐比值（UACR）改善','24小时尿蛋白改善','血钾控制'],高血压:['诊室血压达标','家庭血压监测完成','用药依从性达标'],糖尿病:['糖化血红蛋白（HbA1c）达标','空腹血糖达标','UACR年度筛查完成'],乳腺结节:['超声复查完成','专科评估完成','异常结果处置完成']};
  const epoch=Date.parse('2026-01-01'),day=s=>Math.floor((Date.parse(s)-epoch)/86400000);
  let seed=9062026;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const integer=n=>Math.floor(random()*n),pick=xs=>xs[integer(xs.length)];
  const people=Object.entries(orgs).flatMap(([org,ds],oi)=>ds.flatMap((dept,di)=>[0,1].map(j=>({org,dept,name:['王','李','张','刘','陈','赵','周','吴'][(oi*3+di+j)%8]+['明','芳','伟','敏','宁','华','静','强'][(oi+di*2+j)%8]+'医生'}))));
  const records=[];
  for(let id=1;id<=35620;id++){
    const roll=random(),oi=roll<.39?0:roll<.70?1:roll<.92?2:3,org=Object.keys(orgs)[oi],dept=pick(orgs[org]),person=pick(people.filter(p=>p.org===org&&p.dept===dept)).name;
    const preferred={'肾内科':'CKD','心内科':'高血压','内分泌科':'糖尿病','乳甲外科':'乳腺结节'}[dept],disease=preferred&&random()<.80?preferred:pick(diseases),di=diseases.indexOf(disease);
    const date=integer(248),quality=.96-oi*.035-di*.012+(date>=150?.02:0);
    const abnormal=random()<.19+di*.009,eligible=abnormal&&random()<.73,enrolled=eligible&&random()<.83;
    const enrolDate=enrolled?date+integer(5):null,exitRoll=random(),exitDate=enrolled&&exitRoll<.095?enrolDate+30+integer(100):null;
    const p={id,org,dept,person,disease,date,abnormal,eligible,enrolDate,exitDate,exitStatus:exitRoll<.066?'closed':'withdrawn',lostDate:enrolled&&random()<.045?enrolDate+20+integer(100):null,standard:random()<quality,tasks:[],alerts:[],assessments:[],referrals:[]};
    if(enrolled){
      for(let t=0,n=3+integer(5);t<n;t++){
        const created=enrolDate+t*14+integer(8),due=created+3+integer(8),isDone=random()<quality-.055,completed=isDone?due-(random()<.91?integer(4):-1-integer(5)):null,ai=random()<.76;
        if(p.exitDate!==null&&created>p.exitDate)continue;
        p.tasks.push({created,due,completed,ai,revisit:random()<.20,message:random()<.70,reached:random()<quality,call:ai&&random()<.34,report:ai&&isDone&&random()<.22});
      }
      if(random()<.083+oi*.015){for(let j=0,n=random()<.16?2+integer(2):1;j<n;j++){const at=enrolDate+integer(75),level=pick([3,3,3,2,2,1]),due=at+1,handled=random()<quality?at:random()<.65?at+3:null;p.alerts.push({at,level,due,handled,ai:random()<.82});}}
      p.assessments=indicators[disease].map((name,j)=>({name,at:enrolDate+7+integer(30),eligible:random()<.95-j*.055,passed:random()<quality-.055-j*.022}));
      if(random()<.12){const at=enrolDate+integer(30),up=oi<2?random()<.55:true,received=random()<quality?at+1:null,visited=received!==null&&random()<.96?received+2+integer(4):null,confirmed=visited!==null&&random()<.96?visited+1:null;p.referrals.push({up,at,received,visited,confirmed});}
    }
    records.push(p);
  }
  const ratio=(n,d)=>d?Number((n/d*100).toFixed(1)):0;
  function aggregate(rows,end){
    const r={screened:rows.length,abnormal:0,eligible:0,enrolled:0,active:0,closed:0,withdrawn:0,lost:0,standard:0,achieved:0,risk:0,pending:0,done:0,onTime:0,overdue:0,revisit:0,revisited:0,revisitOnTime:0,levels:[0,0,0],alertEvents:0,handled:0,handledOnTime:0,unhandledOverdue:0,repeated:0,sent:0,reached:0,aiTasks:0,aiDone:0,aiCalls:0,aiMessages:0,aiReports:0,aiAlerts:0,referrals:[[0,0,0,0],[0,0,0,0]],assessments:{}};
    rows.forEach(p=>{
      r.abnormal+=+p.abnormal;r.eligible+=+p.eligible;
      if(p.enrolDate===null||p.enrolDate>end)return;
      r.enrolled++;if(p.exitDate!==null&&p.exitDate<=end)r[p.exitStatus]++;else r.active++;
      r.lost+=+(p.lostDate!==null&&p.lostDate<=end);r.standard+=+p.standard;
      const tests=p.assessments.filter(a=>a.eligible&&a.at<=end);r.achieved+=+(tests.length>0&&tests.every(a=>a.passed));
      tests.forEach(a=>{const v=r.assessments[a.name]||=( {total:0,achieved:0} );v.total++;v.achieved+=+a.passed;});
      p.tasks.filter(t=>t.created<=end).forEach(t=>{const done=t.completed!==null&&t.completed<=end,onTime=done&&t.completed<=t.due;r.done+=+done;r.pending+=+!done;r.onTime+=+onTime;r.overdue+=+(!done&&t.due<end);if(t.revisit){r.revisit++;r.revisited+=+done;r.revisitOnTime+=+onTime;}if(t.message){r.sent++;r.reached+=+t.reached;r.aiMessages+=+(t.ai&&t.reached);}r.aiTasks+=+t.ai;r.aiDone+=+(t.ai&&done);r.aiCalls+=+t.call;r.aiReports+=+(t.report&&done);});
      const alerts=p.alerts.filter(a=>a.at<=end);if(alerts.length){r.levels[3-Math.max(...alerts.map(a=>a.level))]++;r.risk++;r.repeated+=+(alerts.length>1);}
      alerts.forEach(a=>{const handled=a.handled!==null&&a.handled<=end;r.alertEvents++;r.handled+=+handled;r.handledOnTime+=+(handled&&a.handled<=a.due);r.unhandledOverdue+=+(!handled&&a.due<end);r.aiAlerts+=+a.ai;});
      p.referrals.filter(t=>t.at<=end).forEach(t=>{const v=r.referrals[t.up?0:1];v[0]++;v[1]+=+(t.received!==null&&t.received<=end);v[2]+=+(t.visited!==null&&t.visited<=end);v[3]+=+(t.confirmed!==null&&t.confirmed<=end);});
    });
    r.total=r.done+r.pending;r.activeRate=ratio(r.active,r.enrolled);r.doneRate=ratio(r.done,r.total);r.onTimeRate=ratio(r.onTime,r.total);r.overdueRate=ratio(r.overdue,r.total);r.lostRate=ratio(r.lost,r.enrolled);r.standardRate=ratio(r.standard,r.enrolled);r.targetRate=ratio(r.achieved,r.enrolled);r.closedAlertRate=ratio(r.handled,r.alertEvents);r.score=Number((r.standardRate*.3+r.targetRate*.3+r.doneRate*.25+(100-r.lostRate)*.15).toFixed(1));
    return r;
  }
  function query(f={}){
    const start=day(f.start||'2026-01-01'),end=Math.min(247,day(f.end||'2026-09-05'));
    const rows=records.filter(p=>p.date>=start&&p.date<=end&&(!f.org||p.org===f.org)&&(!f.dept||p.dept===f.dept)&&(!f.person||p.person===f.person)&&(!f.disease||p.disease===f.disease));
    const result=aggregate(rows,end);
    result.diseases=diseases.map(name=>({name,...aggregate(rows.filter(p=>p.disease===name),end)}));
    const group=f.dept?'person':f.org?'dept':'org';
    result.ranks=[...new Set(rows.map(p=>p[group]))].map(name=>({name,...aggregate(rows.filter(p=>p[group]===name),end)})).sort((a,b)=>b.score-a.score);
    return result;
  }
  const api={query,orgs,diseases,indicators,people,ratio,recordCount:records.length};
  if(typeof module!=='undefined')module.exports=api;else root.StatisticsData=api;
})(typeof window==='undefined'?globalThis:window);

