import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {ConfigProvider,App,Tree,Input,Button,Descriptions,Badge,Drawer,Card,Avatar,Radio,Table,Tag,Select,Switch,Space,Form,Modal,Empty,Upload,Alert} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import {memberProfiles} from './organization-member-data.mjs';
import {departmentMembers,departmentTypes,normalizeDepartmentType,validDepartmentOwner} from './organization-department.mjs';
import {parseCsv,validateImport} from './organization-import.mjs';
import {sourceRegions,sourceOrganizations} from './organization-source-data.mjs';
function EditorSurface({kind,title,open,onCancel,onOk,confirmLoading,children}) {
 if(kind==='dept')return <Drawer rootClassName="organization-editor organization-department-drawer" title={title} open={open} onClose={onCancel} size={680} destroyOnHidden footer={<Space style={{display:'flex',justifyContent:'flex-end'}}><Button onClick={onCancel}>取消</Button><Button type="primary" loading={confirmLoading} onClick={onOk}>保存</Button></Space>}>{children}</Drawer>;
 return <Modal rootClassName="organization-editor" width={560} title={title} open={open} onCancel={onCancel} onOk={onOk} confirmLoading={confirmLoading} okText="保存" cancelText="取消" destroyOnHidden>{children}</Modal>;
}
const ALL_SCOPE='__all__';
function readOrganizationScopeState(){
 try{
  const saved=JSON.parse(window.localStorage?.getItem('global-organization-scope-v1'));
  return window.organizationScope||saved||{consortiums:[ALL_SCOPE],institutions:[ALL_SCOPE],allConsortiums:true,allInstitutions:true};
 }catch{return {consortiums:[ALL_SCOPE],institutions:[ALL_SCOPE],allConsortiums:true,allInstitutions:true};}
}
function GlobalOrganizationScope(){
 const readSaved=()=>{try{const value=JSON.parse(window.localStorage?.getItem('global-organization-scope-v1'));return {consortiums:Array.isArray(value?.consortiums)?value.consortiums:[],institutions:Array.isArray(value?.institutions)?value.institutions:[]};}catch{return {consortiums:[],institutions:[]};}};
 const saved=readSaved(),initial={...saved,institutions:saved.consortiums.length&&!saved.institutions.length?[ALL_SCOPE]:saved.institutions},[consortiums,setConsortiums]=useState(initial.consortiums),[institutions,setInstitutions]=useState(initial.institutions);
 const consortiumAll=!consortiums.length||consortiums.includes(ALL_SCOPE);
 const availableOrganizations=sourceOrganizations.filter(item=>consortiumAll||consortiums.includes(sourceRegions.find(region=>region.name===item.region)?.code));
 const normalizeAll=(values,current)=>values.includes(ALL_SCOPE)?(current.includes(ALL_SCOPE)?values.filter(value=>value!==ALL_SCOPE):[ALL_SCOPE]):values;
 const publish=(nextConsortiums,nextInstitutions)=>{const allConsortiums=!nextConsortiums.length||nextConsortiums.includes(ALL_SCOPE),allInstitutions=!nextInstitutions.length||nextInstitutions.includes(ALL_SCOPE);const matchingOrganizations=sourceOrganizations.filter(item=>allConsortiums||nextConsortiums.includes(sourceRegions.find(region=>region.name===item.region)?.code));const detail={consortiums:nextConsortiums,institutions:nextInstitutions,allConsortiums,allInstitutions,consortiumNames:(allConsortiums?sourceRegions:sourceRegions.filter(item=>nextConsortiums.includes(item.code))).map(item=>item.name),institutionNames:(allInstitutions?matchingOrganizations:matchingOrganizations.filter(item=>nextInstitutions.includes(item.code))).map(item=>item.name)};window.organizationScope=detail;try{window.localStorage?.setItem('global-organization-scope-v1',JSON.stringify(detail));}catch{}window.dispatchEvent(new CustomEvent('organizationScopeChange',{detail}));};
 useEffect(()=>{publish(consortiums,institutions);},[]);
 useEffect(()=>{const handleScopeRequest=event=>{const institution=sourceOrganizations.find(item=>item.name===event.detail?.institutionName);if(!institution)return;const consortium=sourceRegions.find(item=>item.name===institution.region);const nextConsortiums=consortium?[consortium.code]:[],nextInstitutions=[institution.code];setConsortiums(nextConsortiums);setInstitutions(nextInstitutions);publish(nextConsortiums,nextInstitutions);};window.addEventListener('setOrganizationScope',handleScopeRequest);return()=>window.removeEventListener('setOrganizationScope',handleScopeRequest);},[]);
 const changeConsortiums=values=>{const nextConsortiums=normalizeAll(values,consortiums),nextInstitutions=[ALL_SCOPE];setConsortiums(nextConsortiums);setInstitutions(nextInstitutions);publish(nextConsortiums,nextInstitutions);};
 const changeInstitutions=values=>{const nextInstitutions=normalizeAll(values,institutions);setInstitutions(nextInstitutions);publish(consortiums,nextInstitutions);};
 const consortiumOptions=[{value:ALL_SCOPE,label:'全部医共体'},...sourceRegions.map(item=>({value:item.code,label:item.name}))];
 const institutionOptions=[{value:ALL_SCOPE,label:'全部机构'},...availableOrganizations.map(item=>({value:item.code,label:item.name}))];
 return <ConfigProvider locale={zhCN} theme={{token:{motion:false,colorPrimary:'#1d4dff',borderRadius:6,controlHeight:34,fontSize:14}}}><div className="global-organization-scope" aria-label="医共体和机构筛选"><label><span>医共体</span><Select mode="multiple" allowClear showSearch optionFilterProp="label" maxTagCount={1} maxTagPlaceholder={omitted=>`+${omitted.length}`} placeholder="全部医共体" value={consortiums} onChange={changeConsortiums} options={consortiumOptions}/></label><label><span>机构</span><Select mode="multiple" allowClear showSearch optionFilterProp="label" maxTagCount={1} maxTagPlaceholder={omitted=>`+${omitted.length}`} placeholder="全部机构" value={institutions} onChange={changeInstitutions} options={institutionOptions}/></label></div></ConfigProvider>;
}
const hierarchyDepartmentCounts={上佳市:2,小黄圃:2,马冈:2,桂洲:2,花溪:3,大福基:2,扁滘:3,细滘:2,华口:2};
function buildOrganizationSeed(){
 const organizations=sourceOrganizations.map(item=>({...item,parentId:item.parentId||null,departments:(item.departments||[]).map(department=>({...department}))}));
 const center=organizations.find(item=>item.name==='容桂社区卫生服务中心');
 if(!center)return organizations;
 const makeNode=(id,name,code,parentId,departments=[])=>({id,name,code,region:'容桂健共体',parentId,level:'基层',type:'社区卫生服务机构',address:'',enabled:true,remarks:'',showDepartmentsInTree:true,departments});
 const technical=center.departments.filter(item=>normalizeDepartmentType(item.type)==='医技').slice(0,3);
 const categories=[
  makeNode('org-RG-TECH','医技科室','RG-TECH',center.id,technical),
  makeNode('org-RG-COMMUNITY','社区服务中心','RG-COMMUNITY',center.id,[])
 ];
 const stations=Object.entries(hierarchyDepartmentCounts).map(([prefix,count],index)=>makeNode(`org-RG-STATION-${index+1}`,`${prefix}社区卫生服务站`,`RG-ST${String(index+1).padStart(2,'0')}`,'org-RG-COMMUNITY',center.departments.filter(item=>item.name.startsWith(prefix)).slice(0,count)));
 return [...organizations,...categories,...stations];
}
const seed=buildOrganizationSeed();
const regionSeeds=sourceRegions;
const demoDepartmentPeople=Object.keys(memberProfiles).filter(name=>name!=='李院长');
function addDemoDepartmentMembers(payload){
 return {...payload,orgs:(payload.orgs||[]).map((organization,organizationIndex)=>({...organization,departments:(organization.departments||[]).map((department,departmentIndex)=>{
  const currentMembers=departmentMembers(department);
  if(currentMembers.length)return {...department,members:currentMembers,owner:department.owner||currentMembers[0]};
  const start=(organizationIndex+departmentIndex)%demoDepartmentPeople.length;
  const members=[0,1,2].map(offset=>demoDepartmentPeople[(start+offset)%demoDepartmentPeople.length]);
  return {...department,members,owner:members[0]};
 })}))};
}
function formatCreatedAt(value){const date=new Date(typeof value==='string'?value.replace(/-/g,'/'):value);if(Number.isNaN(date.getTime()))return formatCreatedAt(new Date());const pad=n=>String(n).padStart(2,'0');return date.getFullYear()+'-'+pad(date.getMonth()+1)+'-'+pad(date.getDate())+' '+pad(date.getHours())+':'+pad(date.getMinutes())+':'+pad(date.getSeconds());}
function rowCreatedAt(row){return /^dept-\d+$/.test(row.id)&&Number(row.id.slice(5))<8?'2025-09-04 17:57:58':new Date(Number(row.id.split('-').pop())||Date.now());}
function Building(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 21h18M5 21V7h8v14M13 11h6v10M7 7V3h8v8M8 10v2m0 2v2m3-6v2m0 2v2m5-1v2M8 19v2"/></svg>}
function Page(){
 const {message}=App.useApp();
 const [data,setData]=useState(()=>{try{const saved=JSON.parse(localStorage.getItem('organization-management-v4'));if(saved&&Array.isArray(saved.orgs)&&saved.orgs.length&&Array.isArray(saved.regions)&&saved.regions.length)return addDemoDepartmentMembers(saved);return addDemoDepartmentMembers({orgs:seed,regions:regionSeeds});}catch{return addDemoDepartmentMembers({orgs:seed,regions:regionSeeds});}});
 const orgs=data.orgs,regionRows=data.regions;
 const [scope,setScope]=useState(readOrganizationScopeState);
 const consortiumValues=scope?.consortiums||[],institutionValues=scope?.institutions||[];
 const allConsortiums=scope?.allConsortiums??(!consortiumValues.length||consortiumValues.includes(ALL_SCOPE));
 const allInstitutions=scope?.allInstitutions??(!institutionValues.length||institutionValues.includes(ALL_SCOPE));
 const scopedRegionRows=regionRows.filter(region=>allConsortiums||consortiumValues.includes(region.code)||consortiumValues.includes(region.id)||consortiumValues.includes(region.name));
 const scopedRegionNames=new Set(scopedRegionRows.map(region=>region.name));
 const regionOrganizations=orgs.filter(item=>scopedRegionNames.has(item.region));
 const visibleOrganizationIds=(()=>{
  if(allInstitutions)return new Set(regionOrganizations.map(item=>item.id));
  const visible=new Set(regionOrganizations.filter(item=>institutionValues.includes(item.code)||institutionValues.includes(item.id)||institutionValues.includes(item.name)).map(item=>item.id));
  let changed=true;
  while(changed){changed=false;regionOrganizations.forEach(item=>{if(visible.has(item.parentId)&&!visible.has(item.id)){visible.add(item.id);changed=true;}});}
  changed=true;
  while(changed){changed=false;regionOrganizations.forEach(item=>{if(visible.has(item.id)&&item.parentId&&!visible.has(item.parentId)){visible.add(item.parentId);changed=true;}});}
  return visible;
 })();
 const scopedOrgs=regionOrganizations.filter(item=>visibleOrganizationIds.has(item.id));
 const visibleRegions=scopedRegionRows.filter(region=>scopedOrgs.some(item=>item.region===region.name));
 const scopeKey=[...consortiumValues,...institutionValues,allConsortiums,allInstitutions].join('|');
 const [selected,setSelected]=useState(()=>orgs[0]?.id),[selectedTreeKey,setSelectedTreeKey]=useState(()=>orgs[0]?.id),[keyword,setKeyword]=useState(''),[deptKeyword,setDeptKeyword]=useState(''),[deptType,setDeptType]=useState(''),[page,setPage]=useState(1),[size,setSize]=useState(10),[editor,setEditor]=useState(null),[saving,setSaving]=useState(false);const [form]=Form.useForm();
 useEffect(()=>{const sync=event=>setScope(event.detail||readOrganizationScopeState());window.addEventListener('organizationScopeChange',sync);return()=>window.removeEventListener('organizationScopeChange',sync);},[]);
 useEffect(()=>{const selectedVisible=scopedOrgs.some(item=>item.id===selected)||visibleRegions.some(item=>item.id===selected);if(selectedVisible)return;const next=scopedOrgs[0]?.id||visibleRegions[0]?.id||'';setSelected(next);setSelectedTreeKey(next);setKeyword('');setDeptKeyword('');setDeptType('');setPage(1);setEditor(null);},[scopeKey,data]);
 useEffect(()=>{window.resetOrganizationPage=()=>{const next=scopedOrgs[0]?.id||visibleRegions[0]?.id||'';setSelected(next);setSelectedTreeKey(next);setKeyword('');setDeptKeyword('');setDeptType('');setPage(1);setEditor(null);};return ()=>{delete window.resetOrganizationPage;};},[scopeKey,data]);
 const org=scopedOrgs.find(o=>o.id===selected)||scopedOrgs[0]||orgs[0];
 const [importState,setImportState]=useState(null),[reading,setReading]=useState(false);
 const selectedDepartmentOrgId=Form.useWatch('orgId',form);
 const selectedMembers=Form.useWatch('members',form)||[];
 const selectedOwner=Form.useWatch('owner',form);
 const update=(next,nextRegions=regionRows)=>{try{const nextData={orgs:next,regions:nextRegions};localStorage.setItem('organization-management-v4',JSON.stringify(nextData));setData(nextData);return true;}catch{message.error('保存失败，请检查浏览器存储空间后重试');return false;}};
 const activeRegion=visibleRegions.find(r=>r.id===selected);
 const people=[...new Set([...orgs.flatMap(o=>[o.owner,...o.departments.map(d=>d.owner)]),...(window.StatisticsData?.people||[]).map(p=>p.name),...(window.teamManagementRows||[]).map(t=>t.administrator)])].filter(n=>n&&n!=='--');
 const orgPeople=[...new Set([org.owner,...org.departments.flatMap(d=>departmentMembers(d)),...(window.StatisticsData?.people||[]).filter(p=>p.org===org.name).map(p=>p.name)])].filter(Boolean);
 const departmentOrg=orgs.find(item=>item.id===selectedDepartmentOrgId)||org;
 const departmentOrgPeople=[...new Set([departmentOrg.owner,...departmentOrg.departments.flatMap(d=>departmentMembers(d)),...(window.StatisticsData?.people||[]).filter(p=>p.org===departmentOrg.name).map(p=>p.name)])].filter(Boolean);
 const readImport=async file=>{
  setReading(true);
  setImportState({orgId:org.id,rows:[],departments:[],errors:[],name:file.name});
  try{
   if(!/\.csv$/i.test(file.name))throw new Error('请选择 CSV 文件，可用 Excel 填写模板并保存为 CSV UTF-8');
   if(file.size>2*1024*1024)throw new Error('文件大小不能超过 2MB');
   const buffer=await file.arrayBuffer();let text;
   try{text=new TextDecoder('utf-8',{fatal:true}).decode(buffer);}catch{text=new TextDecoder('gb18030').decode(buffer);}
   const rows=parseCsv(text),result=validateImport(rows,org.name,orgPeople,org.departments);
   setImportState({orgId:org.id,rows,...result,name:file.name,formatError:false});
  }catch(e){
   setImportState({orgId:org.id,rows:[],departments:[],errors:[e.message],name:file.name,formatError:true});
   message.error('上传失败，表格格式不符合导入规范，请按标准模板调整后重新上传。');
  }finally{setReading(false);}
  return Upload.LIST_IGNORE;
 };
 const confirmImport=()=>{
  if(importState.orgId!==org.id){message.error('机构已切换，请重新选择导入文件');return;}
  if(importState.formatError){message.error('上传失败，表格格式不符合导入规范，请按标准模板调整后重新上传。');return;}
  try{
   const result=validateImport(importState.rows,org.name,orgPeople,org.departments),successCount=result.departments.length,failedCount=result.errors.length,totalCount=successCount+failedCount;
   setImportState({...importState,...result});
   if(!successCount){message.error(`导入失败，共 ${totalCount} 条数据导入失败。请检查表格内容是否符合导入规范，修改后重新导入。`);return;}
   const stamp=Date.now(),createdAt=formatCreatedAt(new Date(stamp));
   const added=result.departments.map((d,i)=>({...d,id:'dept-import-'+stamp+'-'+i,code:'KS'+stamp+'-'+i,createdAt}));
   if(update(orgs.map(o=>o.id===org.id?{...o,departments:[...o.departments,...added]}:o))){
    setDeptType('');setDeptKeyword('');setPage(1);setImportState(null);
    if(failedCount)message.warning(`导入完成，成功 ${successCount} 条，失败 ${failedCount} 条。请检查表格中的失败数据，修改后重新导入。`);
    else message.success(`导入成功，共成功导入 ${successCount} 条数据。`);
   }
  }catch(e){
   setImportState({...importState,departments:[],errors:[e.message],formatError:true});
   message.error('上传失败，表格格式不符合导入规范，请按标准模板调整后重新上传。');
  }
 };
 const edit=(kind,item,context={})=>{setEditor({kind,item,...context});form.resetFields();form.setFieldsValue({...item,region:item?.region||context.region||activeRegion?.name||org.region,orgId:org.id,type:kind==='dept'?normalizeDepartmentType(item?.type):(item?.type||(kind==='org'?'医疗机构':undefined)),enabled:item?.enabled??true,members:kind==='dept'?departmentMembers(item||{}):undefined});};
 const save=async()=>{let values;try{values=await form.validateFields();}catch{return;}const kind=editor.kind;
 if(kind==='rename-org'){
  const name=values.name.trim();
  if(orgs.some(item=>item.id!==editor.item.id&&item.name===name)){form.setFields([{name:'name',errors:['机构名称已存在']}]);return;}
  if(name===editor.item.name){setEditor(null);return;}
  setSaving(true);
  if(update(orgs.map(item=>item.id===editor.item.id?{...item,name}:item))){message.success('机构名称已更新');setEditor(null);}
  setSaving(false);
  return;
 }
 if(kind==='dept'){values.type=normalizeDepartmentType(values.type);values.members=[...new Set(values.members||[])];if(!validDepartmentOwner(values.members,values.owner)){message.error('管理员只能从已添加的科室成员中选择一人');return;}}
 values.name=values.name.trim();values.code=kind==='dept'?(editor.item?.code||'KS'+Date.now()):values.code.trim();const targetOrg=kind==='dept'?(orgs.find(item=>item.id===values.orgId)||org):org;const list=kind==='region'?regionRows:kind==='org'?orgs:targetOrg.departments;if(list.some(x=>x.code===values.code&&x.id!==editor.item?.id)){form.setFields([{name:'code',errors:['编码已存在，请使用其他编码']}]);return;}if(kind==='region'&&regionRows.some(r=>r.name===values.name&&r.id!==editor.item?.id)){form.setFields([{name:'name',errors:['医共体名称已存在']}]);return;}setSaving(true);const item={...editor.item,...values,id:editor.item?.id||`${kind}-${Date.now()}`,...(kind==='org'?{parentId:editor.item?.parentId??editor.parentId??null,departments:editor.item?.departments||[]}:{createdAt:editor.item?editor.item.createdAt:formatCreatedAt(new Date())})};const rows=editor.item?list.map(x=>x.id===item.id?item:x):[...list,item];const next=kind==='region'?orgs.map(o=>o.region===editor.item?.name?{...o,region:item.name}:o):kind==='org'?rows:orgs.map(x=>x.id===targetOrg.id?{...x,departments:rows}:x);if(update(next,kind==='region'?rows:regionRows)){message.success('保存成功');setEditor(null);if(kind==='org'||kind==='dept'&&targetOrg.id!==org.id){setSelected(item.id&&kind==='org'?item.id:targetOrg.id);setSelectedTreeKey(item.id&&kind==='org'?item.id:targetOrg.id);setDeptKeyword('');setDeptType('');setPage(1);}}setSaving(false);};
 const departmentRows=org.departments.map(d=>({...d,type:normalizeDepartmentType(d.type),enabled:d.enabled!==false}));
 const filtered=departmentRows.filter(d=>(!deptType||d.type===deptType)&&d.name.includes(deptKeyword.trim()));
 const status=enabled=><Badge status={enabled?'success':'default'} text={enabled?'启用':'停用'}/>;
 const details=<Descriptions className="organization-responsive-details" column={3} colon={false} items={[['机构编码',org.code],['所属医共体',org.region],['医共体编码',regionRows.find(r=>r.name===org.region)?.code||'—'],['所属级别',org.level||'—'],['机构类型',org.type||'—'],['状态',status(org.enabled)],['备注',org.remarks||'—']].map(([label,children])=>({key:label,label:<span className={label==='备注'?'organization-remark-text':undefined}>{label}</span>,children:<span className={label==='备注'?'organization-remark-text':undefined}>{children}</span>}))}/>;
 const typeColors={'门诊':'blue','住院':'green','医技':'purple','其他':'default'};
 const columns=[{title:'序号',width:62,align:'center',render:(_,r,i)=>(page-1)*size+i+1},{title:'科室名称',dataIndex:'name',width:180},{title:'科室类型',dataIndex:'type',width:130,render:v=><Tag color={typeColors[v]||'default'}>{v}</Tag>},{title:'科室编码',dataIndex:'code',width:140},{title:'科室负责人',dataIndex:'owner',width:125,render:v=>v||'—'},{title:'医护人员',width:100,render:(_,row)=>departmentMembers(row).length},
 {title:'团队数',width:90,render:(_,row)=>row.teamCount??(window.teamManagementRows||[]).filter(t=>t.department?.split(/[、，,]/).includes(row.name)).length},
 {title:'状态',dataIndex:'enabled',width:100,render:enabled=>status(enabled)},{title:'创建时间',dataIndex:'createdAt',width:180,render:(v,row)=>formatCreatedAt(v||rowCreatedAt(row))},{title:'操作',width:80,render:(_,row)=><Button type="link" size="small" onClick={()=>edit('dept',row)}>编辑</Button>}];
 const buildOrgNodes=(region,parentId=null,depth=2)=>scopedOrgs.filter(item=>item.region===region.name&&(item.parentId||null)===parentId).map(item=>{
  const nested=buildOrgNodes(region,item.id,depth+1);
  const children=nested;
  const matchesSelf=item.name.includes(keyword.trim());
  if(keyword.trim()&&!matchesSelf&&!children.length)return null;
  return {key:item.id,treeLevel:depth,title:<div className="organization-region-title organization-node-title"><span className="organization-tree-label"><span>{item.name}</span></span></div>,icon:<Building/>,...(children.length?{children}: {})};
 }).filter(Boolean);
 const tree=visibleRegions.map(region=>{const children=buildOrgNodes(region);return {key:region.id,searchText:region.name,treeLevel:1,selectable:false,title:<div className="organization-region-title"><span className="organization-tree-label"><span>{region.name}</span></span></div>,icon:<Building/>,children};}).filter(region=>!keyword.trim()||region.searchText.includes(keyword.trim())||region.children.length);
 const collectExpanded=(nodes,include)=>nodes.flatMap(node=>[...(node.children?.length&&include(node)?[node.key]:[]),...(node.children?collectExpanded(node.children,include):[])]);
 const defaultExpandedKeys=keyword.trim()?collectExpanded(tree,()=>true):(tree[0]?collectExpanded([tree[0]],node=>node.treeLevel<4):[]);

 return <div className="organization-shell"><div className="organization-layout"><aside className="organization-tree-card"><div className="organization-tree-toolbar"><Input.Search aria-label="医共体或机构名称" placeholder="请输入医共体或机构名称" allowClear value={keyword} onChange={e=>setKeyword(e.target.value)}/></div>{tree.length?<Tree key={`${keyword?'search':'normal'}-${scopeKey}-${scopedOrgs.length}`} showLine={{showLeafIcon:false}} switcherIcon={({expanded})=><svg className="organization-tree-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={expanded?"M4 10l4-4 4 4":"M4 6l4 4 4-4"}/></svg>} showIcon blockNode defaultExpandedKeys={defaultExpandedKeys} selectedKeys={[selectedTreeKey]} treeData={tree} onSelect={(keys,info)=>{if(!keys.length)return;const key=keys[0];if(info.node.isDepartment){setSelected(info.node.orgId);setSelectedTreeKey(key);setDeptKeyword(info.node.departmentName);setDeptType('');}else{setSelected(key);setSelectedTreeKey(key);setDeptKeyword('');setDeptType('');}setPage(1);}}/>:<Empty description="当前筛选范围暂无医共体或机构" image={Empty.PRESENTED_IMAGE_SIMPLE}/>}</aside>{activeRegion?<section className="organization-detail-card organization-info"><div className="organization-profile-title"><h2>{activeRegion.name}</h2><Space><Button onClick={()=>edit('region',activeRegion)}>编辑医共体</Button><Button type="primary" onClick={()=>edit('org',null,{region:activeRegion.name,parentId:null})}>＋ 新建机构</Button></Space></div><Descriptions column={1} colon={false} items={[['医共体名称',activeRegion.name],['医共体编码',activeRegion.code],['状态',status(activeRegion.enabled)],['备注',activeRegion.remarks||'—'],['成员机构',scopedOrgs.filter(o=>o.region===activeRegion.name).length+' 个']].map(([label,children])=>({key:label,label:<span className={label==='备注'?'organization-remark-text':undefined}>{label}</span>,children:<span className={label==='备注'?'organization-remark-text':undefined}>{children}</span>}))}/></section>:<section className="organization-detail-card"><div className="organization-profile"><div className="organization-icon" role="img" aria-label="机构"><Building/></div><div className="organization-profile-content"><div className="organization-profile-title"><div className="organization-profile-name"><h2>{org.name}</h2><Button type="text" size="small" aria-label="编辑机构名称" onClick={()=>edit('rename-org',org)}>✎ 编辑</Button></div></div>{details}</div></div><div className="organization-departments"><div className="organization-section-title"><h3>科室列表</h3><Space><Button icon={<UploadOutlined/>} onClick={()=>setImportState({orgId:org.id,rows:[],errors:[]})}>导入</Button><Button type="primary" onClick={()=>edit('dept')}>＋ 新增科室</Button></Space></div><div className="organization-filters organization-department-tabs"><Space className="organization-type-cards" size={8}>{['全部',...departmentTypes].map(label=><Button key={label} type={(deptType||'全部')===label?'primary':'default'} aria-pressed={(deptType||'全部')===label} onClick={()=>{setDeptType(label==='全部'?'':label);setPage(1);}}>{label}</Button>)}</Space><Input.Search placeholder="请输入科室名称" aria-label="科室名称" allowClear value={deptKeyword} onChange={e=>{setDeptKeyword(e.target.value);setPage(1);}} style={{width:240,maxWidth:'100%'}}/></div><Table size="small" rowKey="id" columns={columns} dataSource={filtered} scroll={{x:960}} locale={{emptyText:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无符合条件的科室"/>}} pagination={{current:page,pageSize:size,total:filtered.length,showSizeChanger:true,pageSizeOptions:[10,20,50],showTotal:t=>`共 ${t} 条`,onChange:(p,s)=>{setPage(p);setSize(s);}}}/></div></section>}</div><EditorSurface kind={editor?.kind} title={editor?.kind==='rename-org'?'编辑机构名称':`${editor?.item?'编辑':editor?.kind==='dept'?'新增':'新建'}${{region:'医共体',org:'机构',dept:'科室'}[editor?.kind]||''}`} open={!!editor} onCancel={()=>setEditor(null)} onOk={save} confirmLoading={saving} okText="保存" cancelText="取消" destroyOnHidden><Form key={editor?.kind} name="organizationEditor" form={form} layout="vertical" preserve={false}>
 <Form.Item name="name" label={`${{region:'医共体',org:'机构','rename-org':'机构',dept:'科室'}[editor?.kind]||''}名称`} rules={[{required:true,whitespace:true,message:'请输入名称'}]}><Input maxLength={80} placeholder={editor?.kind==='region'?'如：南宁医共体':'请输入名称'}/></Form.Item>

 {editor?.kind==='rename-org'?null:editor?.kind==='dept'?<>
 <Form.Item name="description" label="科室简介"><Input.TextArea rows={3} maxLength={500} placeholder="请输入科室简介"/></Form.Item>
 <Form.Item name="orgId" label="所属机构" rules={[{required:true,message:'请选择所属机构'}]}><Select showSearch optionFilterProp="label" disabled={!!editor?.item} placeholder="请选择所属机构" options={orgs.map(item=>({value:item.id,label:item.name}))} onChange={()=>{form.setFieldValue('members',[]);form.setFieldValue('owner',undefined);}}/></Form.Item>
 <Form.Item name="type" label="科室类型" rules={[{required:true,message:'请选择科室类型'}]}><Select options={departmentTypes.map(value=>({value,label:value}))}/></Form.Item>
 <Form.Item name="enabled" label="科室状态" valuePropName="checked"><Switch aria-label="科室状态"/></Form.Item>
 <Form.Item name="remarks" label="科室备注" className="organization-remark-field"><Input.TextArea rows={3} maxLength={500} showCount placeholder="请输入科室备注"/></Form.Item>
 <section className="organization-members-section" aria-label="科室成员">
 <div className="organization-member-heading"><strong>科室成员</strong><Tag>{selectedMembers.length} 人</Tag></div>
 <Form.Item name="members" extra="支持添加多名成员，管理员只能设置一位"><Select mode="multiple" showSearch allowClear placeholder="请选择科室成员" aria-label="添加科室成员" options={departmentOrgPeople.map(name=>({value:name,label:name}))} onChange={members=>{if(!members.includes(form.getFieldValue('owner')))form.setFieldValue('owner',undefined);}}/></Form.Item>
 <Form.Item name="owner" hidden><Input/></Form.Item>
 <div className="organization-member-cards">{selectedMembers.length?selectedMembers.map(name=>{const person={...memberProfiles[name],...((window.StatisticsData?.people||[]).find(p=>p.name===name)||{})};return <Card key={name} size="small" className="organization-member-card"><Space align="start"><Avatar size={40} src={person.avatar}>{name.slice(0,1)}</Avatar><div><Space><strong>{name}</strong>{selectedOwner===name&&<Tag color="blue">管理员</Tag>}</Space><div className="organization-member-detail">职称：{person.professionalTitle||person.jobTitle||person.title||'未填写'}</div><div className="organization-member-detail">联系电话：{person.phone||person.mobile||'未填写'}</div></div></Space><div className="organization-member-actions"><Button type="link" size="small" onClick={()=>form.setFieldValue('owner',selectedOwner===name?undefined:name)}>{selectedOwner===name?'取消管理员':'设为管理员'}</Button><Button type="link" danger size="small" onClick={()=>{form.setFieldValue('members',selectedMembers.filter(member=>member!==name));if(selectedOwner===name)form.setFieldValue('owner',undefined);}}>移除</Button></div></Card>}):<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="请添加科室成员"/>}</div>
 </section>
 </>:<>
 {editor?.kind!=='dept'&&<Form.Item name="code" label={editor?.kind==='region'?'医共体编码':'机构编码'} extra="平台内唯一，用于数据关联" rules={[{required:true,whitespace:true,message:'请输入编码'}]}><Input maxLength={30} placeholder="请输入编码"/></Form.Item>}
 {editor?.kind==='org'&&<Form.Item name="region" label="所属医共体" rules={[{required:true,message:'请选择所属医共体'}]}><Select options={regionRows.map(r=>({value:r.name,label:r.name}))}/></Form.Item>}
 {editor?.kind==='dept'&&<Form.Item name="orgId" label="所属机构" rules={[{required:true}]} extra="自动继承当前机构"><Select disabled options={[{value:org.id,label:org.name}]}/></Form.Item>}
 {editor?.kind!=='region'&&<Form.Item name="type" label={editor?.kind==='org'?'机构类型':'科室类型'} rules={[{required:true,message:'请选择类型'}]}><Select options={(editor?.kind==='org'?['综合医院','专科医院','社区卫生服务机构','妇幼保健院','中医医院']:departmentTypes).map(v=>({value:v,label:v}))}/></Form.Item>}
 {editor?.kind==='org'&&<Form.Item name="level" label="机构等级"><Select allowClear placeholder="请选择机构等级（选填）" options={['三甲','三乙','二甲','二乙','一级','未定级'].map(v=>({value:v,label:v}))}/></Form.Item>}
 {editor?.kind==='rename-org'?null:editor?.kind==='dept'?<>
 <Form.Item name="members" label="科室人员" extra="支持添加多名人员，并从已添加人员中选择一位科室负责人"><Select mode="multiple" showSearch allowClear placeholder="请选择科室人员" options={orgPeople.map(name=>({value:name,label:name}))} onChange={members=>{if(!members.includes(form.getFieldValue('owner')))form.setFieldValue('owner',undefined);}}/></Form.Item>
 <Form.Item name="owner" hidden><Input/></Form.Item>
 <div className="organization-member-heading"><span>已添加人员（{selectedMembers.length} 人）</span>{selectedOwner&&<Button type="link" size="small" onClick={()=>form.setFieldValue('owner',undefined)}>清除负责人</Button>}</div>
 <Table className="organization-members-table" size="small" rowKey="name" pagination={false} dataSource={selectedMembers.map(name=>({name}))} locale={{emptyText:'请先添加科室人员'}} columns={[{title:'人员姓名',dataIndex:'name'},{title:'科室负责人',width:160,render:(_,person)=><Radio aria-label={`设置${person.name}为科室负责人`} checked={selectedOwner===person.name} onChange={()=>form.setFieldValue('owner',person.name)}>设为负责人</Radio>},{title:'操作',width:90,render:(_,person)=><Button type="link" onClick={()=>{form.setFieldValue('members',selectedMembers.filter(name=>name!==person.name));if(selectedOwner===person.name)form.setFieldValue('owner',undefined);}}>移除</Button>}]}/>
 </>:null}
 {editor?.kind==='org'&&<Form.Item name="address" label="机构地址"><Input maxLength={200} placeholder="请输入机构地址（选填）"/></Form.Item>}
 <Form.Item name="enabled" label="状态" rules={[{required:true,message:'请选择状态'}]}><Select options={[{value:true,label:'启用'},{value:false,label:'停用'}]}/></Form.Item>
 <Form.Item name="remarks" label="备注" className="organization-remark-field"><Input.TextArea maxLength={500} showCount rows={3} placeholder={editor?.kind==='region'?'请输入医共体说明（选填）':'请输入备注（选填）'}/></Form.Item>
</>}
 </Form></EditorSurface><Modal rootClassName="organization-editor organization-import-modal" title="导入资料" open={!!importState} onCancel={()=>{if(!reading)setImportState(null);}} width={800} centered destroyOnHidden footer={<><Button onClick={()=>setImportState(null)} disabled={reading}>取消</Button><Button type="primary" loading={reading} disabled={reading||!importState?.name||!!importState?.formatError} onClick={confirmImport}>确定</Button></>}><div className="organization-import-content"><Upload.Dragger className="organization-import-dragger" accept=".csv" showUploadList={false} beforeUpload={readImport} disabled={reading}><div className="organization-import-file-icon" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="M14 10h24l12 12v32H14z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><path d="M38 10v13h12M22 33h20M22 41h20M22 49h12" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></div><Button className="organization-import-select" loading={reading}>选择文件</Button><p className="organization-import-hint">{importState?.name?`已选择：${importState.name}`:'点击 选择文件 或 拖拽文件至虚线内'}</p></Upload.Dragger><ul className="organization-import-notes"><li>支持 CSV 文件，最多1,000条、2MB。科室类型统一归为门诊、住院、医技、其他，无法匹配的类型自动归入其他；状态默认启用。成员用分号分隔，管理员只能填写一位已有成员。</li><li>上传表格需包含科室编码、科室名称、科室类型字段及对应数据，缺少必填字段或数据将无法导入。</li></ul>{!!importState?.errors?.length&&<Alert type={importState?.departments?.length?'warning':'error'} showIcon title={importState?.formatError?'上传失败，表格格式不符合导入规范，请按标准模板调整后重新上传。':importState?.departments?.length?`校验完成：成功 ${importState.departments.length} 条，失败 ${importState.errors.length} 条`:`校验完成：${importState.errors.length} 条数据全部失败`} description={<div style={{maxHeight:120,overflow:'auto'}}>{importState.errors.map((error,i)=><div key={i}>{error}</div>)}</div>}/>} {!!importState?.departments?.length&&!importState?.errors?.length&&<Alert type="success" showIcon title={'校验通过，共 '+importState.departments.length+' 个科室'}/>}</div></Modal></div>;
}
let globalScopeMounted=false;window.mountGlobalOrganizationScope=()=>{const host=document.getElementById('globalOrganizationScope');if(!host||globalScopeMounted)return;globalScopeMounted=true;createRoot(host).render(<GlobalOrganizationScope/>);};window.mountGlobalOrganizationScope();
let mounted=false;window.mountOrganizationPage=()=>{const host=document.getElementById('organizationManagementView');if(!host)return;if(mounted){window.resetOrganizationPage?.();return;}mounted=true;createRoot(host).render(<ConfigProvider locale={zhCN} theme={{token:{motion:false,colorPrimary:'#1d4dff',borderRadius:6,controlHeight:36,fontSize:14,fontSizeSM:14,fontSizeLG:14,colorText:'#25324a'},components:{Tree:{titleHeight:28,indentSize:18},Table:{cellPaddingBlockSM:12,headerBg:'#f5f7fa'}}}}><App><Page/></App></ConfigProvider>);};