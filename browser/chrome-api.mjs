import {randomUUID} from 'node:crypto';
// Installed Playwriter extension's existing Chrome-API dispatcher; no direct CDP connection.
export async function connect() {
 const ws=new WebSocket('ws://127.0.0.1:19988/cdp/ai-desk-task-'+randomUUID());
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{ws.close();reject(new Error('Playwriter relay connection timeout; no retry performed'))},8000);ws.onopen=()=>{clearTimeout(timer);resolve()};ws.onerror=()=>{clearTimeout(timer);reject(new Error('Playwriter relay connection failed'))}});
 let next=0;const pending=new Map();
 ws.onmessage=({data})=>{const m=JSON.parse(data);const p=pending.get(m.id);if(!p)return;pending.delete(m.id);clearTimeout(p.timer);if(m.error)p.reject(new Error(m.error.message||m.error));else if(!m.result?.success)p.reject(new Error(m.result?.error||'Chrome API failed'));else p.resolve(m.result.result)};
 ws.onclose=()=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(new Error('Playwriter relay disconnected'))}pending.clear()};
 return {call:(namespace,method,...args)=>new Promise((resolve,reject)=>{const id=++next;const timer=setTimeout(()=>{pending.delete(id);reject(new Error(`${namespace}.${method} timeout; do not retry permission prompts`))},15000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method:'ghost-browser',params:{namespace,method,args}}))}),close:()=>ws.close()};
}
