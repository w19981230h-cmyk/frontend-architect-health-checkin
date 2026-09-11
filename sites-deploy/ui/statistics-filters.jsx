import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ConfigProvider,Form,DatePicker,Select,Button} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
const today=dayjs();
const initial={org:'',dept:'',team:'',person:'',disease:'',start:today.format('YYYY-MM-DD'),end:today.format('YYYY-MM-DD')};
const quarterStart=today.month(Math.floor(today.month()/3)*3).startOf('month');
const presets=[
 {label:'今日',value:[today.startOf('day'),today.endOf('day')]},
 {label:'本月',value:[today.startOf('month'),today.endOf('month')]},
 {label:'本季度',value:[quarterStart,quarterStart.add(2,'month').endOf('month')]},
 {label:'本年度',value:[today.startOf('year'),today.endOf('year')]}
];
export function mount(host,onApply,engine,initialValues={},config={}){
 const defaults={...initial,...initialValues};
 function Filters(){
  const [values,setValues]=useState(defaults);
  const change=(key,value)=>{const next={...values,[key]:value};if(key==='org'){next.dept='';next.team='';next.person='';}if(key==='dept'){next.team='';next.person='';}if(key==='team')next.person='';setValues(next);if(config.applyOnChange!==false)onApply(next);};
  const options=(label,items)=>[{value:'',label},...items.map(x=>({value:x,label:x==='CKD'?'慢性肾病（CKD）':x}))];
  const departments=values.org?engine.orgs[values.org]:[...new Set(Object.values(engine.orgs).flat())];
  const people=[...new Set(engine.people.filter(p=>(!values.org||p.org===values.org)&&(!values.dept||p.dept===values.dept)).map(p=>p.name))];
  const teams=config.teams||['全部团队','心内科随访团队','肾病管理团队','糖尿病共管团队'];
  const isOperations=config.variant==='operations';
  return <ConfigProvider locale={zhCN} theme={{token:{colorPrimary:'#1677ff',borderRadius:6,controlHeight:40,fontSize:14}}}>
   <Form layout="inline" colon={false} className={`sr-ant-filters${isOperations?' os-ant-filters':''}`} aria-label={isOperations?'统计报表查询':'数据报表查询'} onFinish={()=>onApply(values)}>
    <Form.Item label={isOperations?'时间':'时间范围'} className="sr-ant-date"><DatePicker.RangePicker aria-label="时间范围" allowClear={false} presets={presets} value={[dayjs(values.start),dayjs(values.end)]} format="YYYY/MM/DD" style={{width:'100%'}} onChange={dates=>{if(!dates)return;const next={...values,start:dates[0].format('YYYY-MM-DD'),end:dates[1].format('YYYY-MM-DD')};setValues(next);if(config.applyOnChange!==false)onApply(next);}} /></Form.Item>
    <Form.Item label={isOperations?'机构':'集团'}><Select aria-label={isOperations?'机构':'集团'} value={values.org} options={options(isOperations?'本院':'全部集团',Object.keys(engine.orgs))} onChange={v=>change('org',v)} style={{width:'100%'}} /></Form.Item>
    <Form.Item label="科室"><Select aria-label="科室" value={values.dept} options={options('全部科室',departments)} onChange={v=>change('dept',v)} style={{width:144}} /></Form.Item>
    {isOperations&&<Form.Item label="团队"><Select aria-label="团队" value={values.team} options={teams.map((x,index)=>({value:index?x:'',label:x}))} onChange={v=>change('team',v)} style={{width:'100%'}} /></Form.Item>}
    <Form.Item label="个人"><Select aria-label="个人" value={values.person} options={options('全部人员',people)} onChange={v=>change('person',v)} style={{width:'100%'}} /></Form.Item>
    <Form.Item label="病种"><Select aria-label="病种" value={values.disease} options={options('全部病种',engine.diseases)} onChange={v=>change('disease',v)} style={{width:'100%'}} /></Form.Item>
    <Form.Item className="sr-ant-actions">{isOperations&&<Button type="primary" htmlType="submit">查询</Button>}<Button color="primary" variant="filled" onClick={()=>{setValues(defaults);onApply(defaults);}}>重置</Button></Form.Item>
   </Form>
  </ConfigProvider>;
 }
 createRoot(host).render(<Filters/>);
}
