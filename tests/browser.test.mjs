import test from 'node:test';
import assert from 'node:assert/strict';
import {verify} from '../browser/ownership.mjs';
const task={tabId:3,groupId:4,windowId:5};
const mock=(tab,tabs)=>({call:async(_ns,method)=>method==='get'?tab:tabs});
test('자기 탭만 있는 원래 그룹만 허용한다',async()=>assert.equal((await verify(mock({...task,id:3},[{id:3}]),task)).id,3));
test('다른 창/그룹으로 옮긴 탭은 거부한다',async()=>{
 await assert.rejects(()=>verify(mock({...task,groupId:9},[{id:3}]),task));
 await assert.rejects(()=>verify(mock({...task,windowId:9},[{id:3}]),task));
});
test('다른 탭이 합쳐진 그룹·위조 소유권 기록은 거부한다',async()=>{
 await assert.rejects(()=>verify(mock(task,[{id:3},{id:8}]),task));
 await assert.rejects(()=>verify(mock(task,[{id:8}]),task));
 await assert.rejects(()=>verify(mock(task,[{id:3}]),{...task,tabId:'3'}));
});
