#!/usr/bin/env node
import {readFileSync,writeFileSync,mkdirSync,unlinkSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {connect} from './chrome-api.mjs';
import {verify as checkOwnership} from './ownership.mjs';
const dir=new URL('./tasks/',import.meta.url);mkdirSync(dir,{recursive:true,mode:0o700});
const [command,id,arg]=process.argv.slice(2);
if(!['open','info','eval','cdp','screenshot','close'].includes(command))throw new Error('Use open, info, eval, cdp, screenshot, or close');
if(command!=='open'&&!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id??''))throw new Error('An owned task UUID is required');
const c=await connect();
const save=(task)=>writeFileSync(new URL(task.id+'.json',dir),JSON.stringify(task),{mode:0o600});
const check=(task)=>checkOwnership(c,task);
try {
 if(command==='open'){
  if(!id?.trim())throw new Error('Usage: browser.mjs open "Task title"');
  const windows=await c.call('windows','getAll',{populate:false});
  const window=windows.find(w=>w.type==='normal'&&w.focused)||windows.find(w=>w.type==='normal');
  if(!window)throw new Error('No existing Chrome window; refusing to launch');
  const before=(await c.call('tabs','query',{})).map(t=>({id:t.id,groupId:t.groupId,windowId:t.windowId}));
  const task={id:randomUUID(),windowId:window.id};
  const tab=await c.call('tabs','create',{windowId:window.id,url:'about:blank#ai-desk-task-'+task.id,active:false});task.tabId=tab.id;
  try{
   task.groupId=await c.call('tabs','group',{tabIds:[tab.id],createProperties:{windowId:window.id}});
   await c.call('tabGroups','update',task.groupId,{title:id,color:'blue',collapsed:false});
   await c.call('debugger','attach',{tabId:tab.id},'1.3');
   await c.call('debugger','sendCommand',{tabId:tab.id},'Page.enable',{});
   const after=await c.call('tabs','query',{});
   for(const prev of before){const now=after.find(t=>t.id===prev.id);if(!now||now.groupId!==prev.groupId||now.windowId!==prev.windowId)throw new Error('Existing tab changed during creation');}
   save(task);console.log(JSON.stringify(task));
  }catch(e){await c.call('tabs','remove',tab.id);throw e;}
 }else{
  if(!/^[a-f0-9-]{36}$/.test(id??''))throw new Error('An owned task UUID is required');
  const task=JSON.parse(readFileSync(new URL(id+'.json',dir),'utf8'));
  if(task.id!==id)throw new Error('Task UUID does not match ownership record');
  const tab=await check(task);
  if(command==='info')console.log(JSON.stringify({task,url:tab.url,group:await c.call('tabGroups','get',task.groupId)}));
  else if(command==='eval'){
   const expression=readFileSync(arg,'utf8');
   const result=await c.call('debugger','sendCommand',{tabId:task.tabId},'Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
   if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
   console.log(JSON.stringify(result.result.value));
  }else if(command==='cdp'){
   const {method,params}=JSON.parse(readFileSync(arg,'utf8'));
   if(!/^(Page|Runtime|Input|Network|DOM|Emulation)\./.test(method))throw new Error('Only commands scoped to this page are supported');
   console.log(JSON.stringify(await c.call('debugger','sendCommand',{tabId:task.tabId},method,params??{})));
  }else if(command==='screenshot'){
   const r=await c.call('debugger','sendCommand',{tabId:task.tabId},'Page.captureScreenshot',{format:'png'});
   writeFileSync(arg,Buffer.from(r.data,'base64'),{flag:'wx',mode:0o600});console.log(arg);
  }else if(command==='close'){
   await c.call('debugger','detach',{tabId:task.tabId});await c.call('tabs','remove',task.tabId);unlinkSync(new URL(id+'.json',dir));
  }else throw new Error('Use open, info, eval, cdp, screenshot, or close');
 }
}finally{c.close()}
