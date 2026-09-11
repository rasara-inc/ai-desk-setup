import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {kit,dailyName} from '../scripts/lib.mjs';
function fixture(t){const p=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'ai-desk-test-'));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));return p;}
function run(script,...args){return spawnSync(process.execPath,[path.join(kit,'scripts',script),...args],{encoding:'utf8'});}
test('미리보기는 아무것도 생성하지 않고 설치는 키트 독립 복사본을 만든다',t=>{
 const tmp=fixture(t),dest=path.join(tmp,'AI Desk');
 assert.equal(run('setup.mjs','--target',dest,'--areas','personal,business').status,0);
 assert.equal(fs.existsSync(dest),false);
 const r=run('setup.mjs','--target',dest,'--areas','personal,business','--apply');assert.equal(r.status,0,r.stderr);
 assert.ok(fs.existsSync(path.join(dest,'Personal')));assert.ok(fs.existsSync(path.join(dest,'Business')));assert.equal(fs.existsSync(path.join(dest,'Work')),false);
 assert.equal(fs.existsSync(path.join(dest,'.git')),false);
 assert.equal(run('doctor.mjs','--target',dest).status,0);
 const moved=path.join(tmp,'Moved Desk');fs.renameSync(dest,moved);
 assert.equal(run('doctor.mjs','--target',moved).status,0);
 for(const f of ['browser.mjs','chrome-api.mjs','ownership.mjs'])assert.equal(spawnSync(process.execPath,['--check',path.join(moved,'.tools/browser',f)]).status,0);
 const second=run('setup.mjs','--target',moved,'--areas','personal,business','--apply');assert.equal(second.status,0,second.stdout);assert.match(second.stdout,/생성 0/);
});
test('사용자 파일·설정 충돌을 보존하고 충돌 상태를 반환한다',t=>{
 const dest=path.join(fixture(t),'Desk');run('setup.mjs','--target',dest,'--apply');
 const profile=path.join(dest,'Memory/profile.md');fs.writeFileSync(profile,'사용자가 수정한 기억\n');
 const r=run('setup.mjs','--target',dest,'--apply');assert.equal(r.status,2);assert.match(r.stdout,/conflict: Memory\/profile.md/);assert.equal(fs.readFileSync(profile,'utf8'),'사용자가 수정한 기억\n');
});
test('symlink와 파일/폴더 충돌을 쓰기 전에 거부한다',t=>{
 const tmp=fixture(t),dest=path.join(tmp,'Desk'),outside=path.join(tmp,'Outside');fs.mkdirSync(dest);fs.mkdirSync(outside);fs.symlinkSync(outside,path.join(dest,'Memory'));
 assert.equal(run('setup.mjs','--target',dest,'--apply').status,1);assert.deepEqual(fs.readdirSync(outside),[]);assert.equal(fs.existsSync(path.join(dest,'START-HERE.md')),false);
 const other=path.join(tmp,'Other');fs.mkdirSync(other);fs.writeFileSync(path.join(other,'manual'),'existing');
 assert.equal(run('setup.mjs','--target',other,'--apply').status,1);assert.equal(fs.existsSync(path.join(other,'00_inbox')),false);
});
test('잘못된 옵션·시간대·영역 및 Git 대상은 거부한다',t=>{
 const dest=path.join(fixture(t),'Desk');
 for(const args of [['--areas','../escape'],['--timezone','Bad/Zone'],['--force'],['--target']])assert.equal(run('setup.mjs',...args).status,1);
 fs.mkdirSync(dest);fs.mkdirSync(path.join(dest,'.git'));assert.equal(run('setup.mjs','--target',dest,'--apply').status,1);
 assert.equal(run('setup.mjs','--target',path.join(dest,'Nested Desk'),'--apply').status,1);
});
test('현지 날짜·요일은 자정과 DST 경계에서도 맞는다',()=>{
 assert.equal(dailyName('America/Toronto',new Date('2026-09-14T03:30:00Z')),'2026-09-13-Sun.md');
 assert.equal(dailyName('America/Vancouver',new Date('2026-09-14T06:30:00Z')),'2026-09-13-Sun.md');
 assert.equal(dailyName('America/Toronto',new Date('2026-11-01T06:30:00Z')),'2026-11-01-Sun.md');
});
test('doctor는 파일 누락과 Full Access 설정 누락을 검출한다',t=>{
 const dest=path.join(fixture(t),'Desk');run('setup.mjs','--target',dest,'--apply');
 fs.unlinkSync(path.join(dest,'manual/02-basics.md'));
 assert.equal(run('doctor.mjs','--target',dest).status,1);
 run('setup.mjs','--target',dest,'--apply');
 fs.writeFileSync(path.join(dest,'.codex/config.toml'),'model = "gpt-5.6-sol"\n');
 assert.equal(run('doctor.mjs','--target',dest).status,1);
});
