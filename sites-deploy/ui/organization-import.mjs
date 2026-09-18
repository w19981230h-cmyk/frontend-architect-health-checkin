import {normalizeDepartmentType} from './organization-department.mjs';

export const importHeaders=['科室名称','科室简介','所属机构','科室类型','科室状态','科室备注','科室成员','管理员'];
export function parseCsv(text){
 const rows=[];let row=[],cell='',quoted=false;
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw new Error('文件中存在未闭合的引号');row.push(cell);if(row.some(v=>v.trim()))rows.push(row);return rows;
}
export function validateImport(rows,org,people,existing=[]){
 const [headers,...body]=rows;if(!headers||!['科室名称','科室类型'].every(h=>headers.includes(h)))throw new Error('请使用导入模板，至少包含科室名称和科室类型列');
 if(new Set(headers).size!==headers.length)throw new Error('表头存在重复字段');
 if(!body.length)throw new Error('文件中没有科室信息');if(body.length>1000)throw new Error('每次最多导入 1000 个科室');
 const names=new Set(existing.map(d=>d.name));const errors=[],departments=[];
 body.forEach((cells,index)=>{const values=Object.fromEntries(headers.map((h,i)=>[h,(cells[i]||'').trim()]));const name=values['科室名称'],type=normalizeDepartmentType(values['科室类型']),state=values['科室状态']||'启用';const members=[...new Set((values['科室成员']||'').split(/[;；、]/).map(n=>n.trim()).filter(Boolean))],owner=values['管理员']||'';const problems=[];
 if(!name||name.length>100)problems.push('科室名称必填且不超过100字');if(names.has(name))problems.push('科室名称重复');names.add(name);
 if(!['启用','停用'].includes(state))problems.push('科室状态须为启用或停用');if(values['所属机构']&&values['所属机构']!==org)problems.push('所属机构须为当前机构');
 if((values['科室简介']||'').length>500||(values['科室备注']||'').length>500)problems.push('简介或备注不超过500字');if(members.some(n=>!people.includes(n)))problems.push('成员必须是当前机构已有人员');if(owner&&!members.includes(owner))problems.push('管理员须为科室成员中的一人');
 if(problems.length)errors.push('第'+(index+2)+'行：'+problems.join('；'));else departments.push({name,type,description:values['科室简介']||'',remarks:values['科室备注']||'',enabled:state==='启用',members,owner});
 });return {departments,errors};
}
export function templateCsv(org){return '\uFEFF'+[importHeaders,['示例科室（请修改）','填写科室简介',org,'门诊','启用','填写科室备注','','']].map(r=>r.map(v=>'"'+v.replace(/"/g,'""')+'"').join(',')).join('\r\n');}
