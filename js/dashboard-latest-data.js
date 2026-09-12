/* Reference image 2026-07-31. Person, case, alert and cycle units stay separate. */
(function (scope) {
  const data = {
    population:12000, start:'2026-07-01', end:'2026-07-31',
    pendingAssessment:80, ineligible:120, overdueEnrollment:60, cohortActive:720,
    organizations:[
      {name:'A机构',due:4000,screened:3000,abnormal:600,eligible:500,enrolled:400,managedDue:1160,active:1000},
      {name:'B机构',due:3500,screened:2000,abnormal:400,eligible:300,enrolled:240,managedDue:820,active:700},
      {name:'C机构',due:2500,screened:1000,abnormal:200,eligible:200,enrolled:160,managedDue:580,active:500}
    ],
    levels:[
      {name:'红色',color:'#ff506b',due:160,active:132,evaluable:120,standard:108},
      {name:'黄色',color:'#ffd647',due:640,active:528,evaluable:480,standard:408},
      {name:'绿色',color:'#14c8ad',due:1700,active:1496,evaluable:1360,standard:1224},
      {name:'未分级',color:'#99abc3',due:60,active:44,evaluable:null,standard:null}
    ],
    cycles:{due:300,completed:262},
    outcomes:[{name:'CKD',metric:'eGFR稳定',evaluable:400,achieved:320},{name:'高血压',metric:'血压达标',evaluable:700,achieved:525},{name:'糖尿病',metric:'HbA1c达标',evaluable:600,achieved:420}],
    evaluationDue:2000,
    risks:[{name:'A机构',high:8,unhandled:14,overdue:4,timely:90,closed:90},{name:'B机构',high:6,unhandled:10,overdue:3,timely:85,closed:75},{name:'C机构',high:4,unhandled:6,overdue:1,timely:95,closed:85}],
    riskTotals:{timely:90,closed:85,handledOpen:16},
    referrals:[{name:'A机构',up:120,upClosed:108,down:80,downClosed:68},{name:'B机构',up:80,upClosed:64,down:60,downClosed:42},{name:'C机构',up:40,upClosed:32,down:40,downClosed:34}],
    referralStages:{up:[240,228,216,204],down:[180,168,152,144]}
  };
  const sum=(rows,key)=>rows.reduce((s,r)=>s+(r[key]||0),0);
  const percent=(n,d)=>d?(n/d*100).toFixed(1):'—';
  const totals=Object.fromEntries(['due','screened','abnormal','eligible','enrolled','managedDue','active'].map(k=>[k,sum(data.organizations,k)]));
  const api={data,totals,sum,percent};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else scope.DashboardLatestData=api;
})(typeof window!=='undefined'?window:globalThis);
