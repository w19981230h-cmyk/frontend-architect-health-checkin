export const personnelImportHeaders=['姓名','账号','手机号','所属机构','科室类型','科室','身份','职称','状态','简介','擅长'];

export function parseCsv(text){
 const rows=[];let row=[],cell='',quoted=false;
 text=String(text||'').replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){
   if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;
  }else if(c===','&&!quoted){row.push(cell);cell='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';}
  else cell+=c;
 }
 if(quoted)throw new Error('文件中存在未闭合的引号');
 row.push(cell);if(row.some(v=>v.trim()))rows.push(row);return rows;
}

const typeMap={门诊:'outpatient',住院:'inpatient',医技:'medical',其他:'other'};
const roles=['医生','护士','医技人员'];
const states=['正常','禁用'];

export function validatePersonnelImport(csvRows,{organization,departments=[],existing=[],titles=[]}){
 const [headers,...body]=csvRows;
 if(!headers||!personnelImportHeaders.every(name=>headers.includes(name)))throw new Error('请使用人员导入模板，模板中的列不可删除');
 if(new Set(headers).size!==headers.length)throw new Error('表头存在重复字段');
 if(!body.length)throw new Error('文件中没有人员信息');
 if(body.length>1000)throw new Error('每次最多导入 1000 位人员');
 const accounts=new Set(existing.map(row=>String(row.account||'').toLowerCase()).filter(Boolean));
 const phones=new Set(existing.map(row=>String(row.phone||'')).filter(Boolean));
 const errors=[],staff=[];
 body.forEach((cells,index)=>{
  const values=Object.fromEntries(headers.map((name,i)=>[name,String(cells[i]||'').trim()]));
  const name=values['姓名'],account=values['账号'],phone=values['手机号'],organizationName=values['所属机构'];
  const typeLabel=values['科室类型'],type=typeMap[typeLabel],department=values['科室'],role=values['身份'],title=values['职称'];
  const state=values['状态']||'正常',problems=[];
  if(!name||name.length>30)problems.push('姓名必填且不超过30字');
  if(account&&!/^[A-Za-z0-9._-]{4,30}$/.test(account))problems.push('账号须为4至30位字母、数字、点、下划线或短横线');
  else if(account&&accounts.has(account.toLowerCase()))problems.push('账号重复');
  if(account)accounts.add(account.toLowerCase());
  if(!/^1[3-9]\d{9}$/.test(phone))problems.push('手机号须为正确的11位号码');
  else if(phones.has(phone))problems.push('手机号重复');
  phones.add(phone);
  if(organizationName!==organization.name)problems.push('所属机构须为当前机构“'+organization.name+'”');
  if(!type)problems.push('科室类型须为门诊、住院、医技或其他');
  if(!department||!departments.some(item=>item.name===department&&item.type===type))problems.push('科室与科室类型不匹配或不存在');
  if(!roles.includes(role))problems.push('身份须为医生、护士或医技人员');
  if(!titles.includes(title))problems.push('职称不在可选范围内');
  if(!states.includes(state))problems.push('状态须为正常或禁用');
  if(values['简介'].length>1000||values['擅长'].length>1000)problems.push('简介或擅长不能超过1000字');
  if(problems.length)errors.push('第'+(index+2)+'行：'+problems.join('；'));
  else staff.push({name,account,phone,organization:organization.id,departments:[type+'|'+department],type,department,role,title,enabled:state==='正常',introduction:values['简介'],specialties:values['擅长']});
 });
 return {staff,errors};
}

function csvCell(value){return '"'+String(value??'').replace(/"/g,'""')+'"'}
export function personnelTemplateCsv(organization,department){
 const example=department||{name:'示例科室（请修改）',type:'outpatient',label:'门诊'};
 const typeLabel=example.label||Object.keys(typeMap).find(label=>typeMap[label]===example.type)||'门诊';
 const sample=['张医生','zhang.doctor','13800000000',organization.name,typeLabel,example.name,'医生','主治医师','正常','填写人员简介','填写擅长领域'];
 return '\uFEFF'+[personnelImportHeaders,sample].map(row=>row.map(csvCell).join(',')).join('\r\n');
}
