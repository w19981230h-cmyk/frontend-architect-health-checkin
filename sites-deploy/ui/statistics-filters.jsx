import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ConfigProvider,Form,DatePicker,Select,Button,Space} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
const initial={org:'',dept:'',person:'',disease:'',start:'2026-01-01',end:'2026-09-05'};
export function mount(host,onApply,engine){
 function Filters(){
  const [values,setValues]=useState(initial);
  const change=(key,value)=>{const next={...values,[key]:value};if(key==='org'){next.dept='';next.person='';}if(key==='dept')next.person='';setValues(next);onApply(next);};
  const options=(label,items)=>[{value:'',label},...items.map(x=>({value:x,label:x==='CKD'?'慢性肾病（CKD）':x}))];
  const departments=values.org?engine.orgs[values.org]:[...new Set(Object.values(engine.orgs).flat())];
  const people=[...new Set(engine.people.filter(p=>(!values.org||p.org===values.org)&&(!values.dept||p.dept===values.dept)).map(p=>p.name))];
  return <ConfigProvider locale={zhCN} theme={{token:{colorPrimary:'#1677ff',borderRadius:6,controlHeight:32,fontSize:14}}}>
   <Form layout="inline" className="sr-ant-filters" aria-label="数据看板查询" onFinish={()=>onApply(values)}>
    <Form.Item label="时间范围" className="sr-ant-date"><DatePicker.RangePicker aria-label="时间范围" allowClear={false} value={[dayjs(values.start),dayjs(values.end)]} format="YYYY-MM-DD" style={{width:268}} onChange={dates=>{if(!dates)return;const next={...values,start:dates[0].format('YYYY-MM-DD'),end:dates[1].format('YYYY-MM-DD')};setValues(next);onApply(next);}} /></Form.Item>
    <Form.Item label="机构"><Select aria-label="机构" value={values.org} options={options('全部机构',Object.keys(engine.orgs))} onChange={v=>change('org',v)} style={{width:160}} /></Form.Item>
    <Form.Item label="科室"><Select aria-label="科室" value={values.dept} options={options('全部科室',departments)} onChange={v=>change('dept',v)} style={{width:144}} /></Form.Item>
    <Form.Item label="病种"><Select aria-label="病种" value={values.disease} options={options('全部病种',engine.diseases)} onChange={v=>change('disease',v)} style={{width:168}} /></Form.Item>
    <Form.Item label="人员"><Select aria-label="人员" value={values.person} options={options('全部人员',people)} onChange={v=>change('person',v)} style={{width:160}} /></Form.Item>
    <Form.Item className="sr-ant-actions"><Space size={8}><Button type="primary" htmlType="submit">查询</Button><Button onClick={()=>{setValues(initial);onApply(initial);}}>重置</Button></Space></Form.Item>
   </Form>
  </ConfigProvider>;
 }
 createRoot(host).render(<Filters/>);
}
