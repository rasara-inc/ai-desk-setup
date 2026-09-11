#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {requireNode,options,safeTarget,plan,noSymlinks} from './lib.mjs';
try {
  requireNode(); const opts=options(process.argv.slice(2));
  if(opts.help) {console.log('node scripts/setup.mjs [--target PATH] [--areas personal,business,work] [--timezone America/Toronto] [--apply]\n기본은 미리보기입니다. 기존 파일은 덮어쓰지 않습니다.');process.exit(0);}
  safeTarget(opts.target);
  const {dirs,rows}=plan(opts);
  console.log(`${opts.apply?'설치':'미리보기'}: ${opts.target}\n시간대: ${opts.timezone}`);
  for(const row of rows) console.log(`${row.state}: ${row.relative}`);
  if(opts.apply) {
    for(const dir of dirs) {noSymlinks(path.join(opts.target,dir));fs.mkdirSync(path.join(opts.target,dir),{recursive:true,mode:0o700});}
    for(const row of rows.filter(r=>r.state==='create')) {
      const dest=path.join(opts.target,row.relative);noSymlinks(dest);
      fs.mkdirSync(path.dirname(dest),{recursive:true,mode:0o700});
      fs.writeFileSync(dest,row.content,{flag:'wx',mode:0o600});
    }
  }
  const conflicts=rows.filter(r=>r.state==='conflict');
  console.log(`생성 ${rows.filter(r=>r.state==='create').length}, 동일 ${rows.filter(r=>r.state==='same').length}, 충돌 ${conflicts.length}`);
  if(conflicts.length) {console.log('기존 파일을 보존했습니다. 충돌은 비교·병합 후 검증하세요.');process.exitCode=2;}
  else console.log(opts.apply?'폴더 설치 완료. 로그인·화면·도구 실습은 SETUP.md에 따라 별도 검증하세요.':'실제 설치는 같은 명령에 --apply를 추가하세요.');
} catch(e) {console.error(e.message);process.exitCode=1;}
