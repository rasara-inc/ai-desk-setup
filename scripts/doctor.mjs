#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {requireNode,options,safeTarget,filesUnder,kit,noSymlinks} from './lib.mjs';
try {
  requireNode(); const opts=options(process.argv.slice(2));safeTarget(opts.target);
  if(opts.help){console.log('node scripts/doctor.mjs [--target PATH]');process.exit(0);}
  let failures=0;
  function check(label,fn){try{if(!fn())throw new Error('조건 불충족');console.log(`PASS: ${label}`);}catch(e){failures++;console.log(`FAIL: ${label} — ${e.message}`);}}
  for(const [source,prefix] of [[path.join(kit,'templates/desk'),''],[path.join(kit,'manual'),'manual'],[path.join(kit,'browser'),'.tools/browser']]) {
    for(const f of filesUnder(source)) {
      if(prefix==='.tools/browser' && !['browser.mjs','chrome-api.mjs','ownership.mjs','README.md'].includes(path.relative(source,f))) continue;
      const rel=path.join(prefix,path.relative(source,f)),dest=path.join(opts.target,rel);
      check(rel,()=>{noSymlinks(dest);return fs.statSync(dest).isFile()&&fs.statSync(dest).size>0;});
    }
  }
  for(const d of ['00_inbox','00_TODO/Archived'])check(d,()=>fs.statSync(path.join(opts.target,d)).isDirectory());
  for(const f of ['.vscode/settings.json','.vscode/extensions.json','AI Desk.code-workspace'])check(`JSON ${f}`,()=>!!JSON.parse(fs.readFileSync(path.join(opts.target,f),'utf8')));
  check('Sol medium + Full Access 설정',()=>{
    const text=fs.readFileSync(path.join(opts.target,'.codex/config.toml'),'utf8');
    return /^model\s*=\s*"gpt-5\.6-sol"\s*$/m.test(text)&&/^model_reasoning_effort\s*=\s*"medium"\s*$/m.test(text)&&/^sandbox_mode\s*=\s*"danger-full-access"\s*$/m.test(text)&&/^approval_policy\s*=\s*"never"\s*$/m.test(text);
  });
  check('Git 없음',()=>!fs.existsSync(path.join(opts.target,'.git')));
  check('날짜 TODO 존재',()=>fs.readdirSync(path.join(opts.target,'00_TODO')).some(f=>/^\d{4}-\d{2}-\d{2}-(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\.md$/.test(f)));
  console.log('이 검사는 파일 설치만 확인합니다. 실행 중 모델/권한·계정·MCP·브라우저·Computer Use·백업은 현장에서 확인하세요.');
  process.exitCode=failures?1:0;
}catch(e){console.error(e.message);process.exitCode=1;}
