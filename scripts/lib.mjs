import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
export const kit = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function requireNode() {
  if (Number(process.versions.node.split('.')[0]) < 22) throw new Error('Node.js 22 이상이 필요합니다.');
}
export function options(argv) {
  const result = {target:path.join(os.homedir(),'AI Desk'), areas:[], timezone:Intl.DateTimeFormat().resolvedOptions().timeZone, apply:false};
  const seen = new Set();
  for (let i=0; i<argv.length; i++) {
    const flag=argv[i];
    if (seen.has(flag)) throw new Error(`옵션 중복: ${flag}`);
    seen.add(flag);
    if (flag==='--apply') {result.apply=true;continue;}
    if (flag==='--help') {result.help=true;continue;}
    if (!['--target','--areas','--timezone'].includes(flag) || !argv[i+1] || argv[i+1].startsWith('--')) throw new Error(`잘못된 옵션: ${flag}`);
    const value=argv[++i];
    if (flag==='--target') result.target=path.resolve(value);
    if (flag==='--timezone') result.timezone=value;
    if (flag==='--areas') {
      result.areas=[...new Set(value.split(','))];
      if (result.areas.some(a=>!['personal','business','work'].includes(a))) throw new Error('영역은 personal,business,work 중 선택하세요.');
    }
  }
  new Intl.DateTimeFormat('en-CA',{timeZone:result.timezone}).format();
  return result;
}
export function noSymlinks(file) {
  const abs=path.resolve(file), parts=abs.split(path.sep).filter(Boolean);
  let current=path.parse(abs).root;
  for (const part of parts) {
    current=path.join(current,part);
    try { if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`심볼릭 링크에는 설치하지 않습니다: ${current}`); }
    catch(e) { if(e.code==='ENOENT') break; throw e; }
  }
}
export function safeTarget(target) {
  if (target===path.parse(target).root || target===os.homedir() || target===kit || target.startsWith(kit+path.sep) || kit.startsWith(target+path.sep)) throw new Error('홈 전체·설치 키트·키트 상위 폴더는 대상이 될 수 없습니다. 별도 업무 폴더를 선택하세요.');
  noSymlinks(target);
  if (fs.existsSync(target) && !fs.statSync(target).isDirectory()) throw new Error('대상이 폴더가 아닙니다.');
  let parent=target;
  while(true) {
    if (fs.existsSync(path.join(parent,'.git'))) throw new Error('업무 폴더는 Git 저장소 밖에 만들어 주세요.');
    if(parent===path.parse(parent).root) break;
    parent=path.dirname(parent);
  }
}
export function filesUnder(dir) {
  return fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(entry=>{
    const p=path.join(dir,entry.name);
    if(entry.isSymbolicLink()) throw new Error(`템플릿 링크는 지원하지 않습니다: ${p}`);
    return entry.isDirectory()?filesUnder(p):[p];
  });
}
export function dailyName(timezone, now=new Date()) {
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',weekday:'short'}).formatToParts(now).map(v=>[v.type,v.value]));
  return `${p.year}-${p.month}-${p.day}-${p.weekday}.md`;
}
export function plan(opts) {
  const entries=new Map();
  for (const [source,prefix] of [[path.join(kit,'templates/desk'),''],[path.join(kit,'manual'),'manual'],[path.join(kit,'browser'),'.tools/browser']]) {
    for(const file of filesUnder(source)) {
      if(prefix==='.tools/browser' && !['browser.mjs','chrome-api.mjs','ownership.mjs','README.md'].includes(path.relative(source,file))) continue;
      const relative=path.join(prefix,path.relative(source,file));
      let content=fs.readFileSync(file,'utf8');
      content=content.replaceAll('{{TIMEZONE}}',opts.timezone).replaceAll('{{AREAS}}',opts.areas.length?opts.areas.join(', '):'필요할 때 추가');
      entries.set(relative,content);
    }
  }
  const name=dailyName(opts.timezone);
  entries.set(`00_TODO/${name}`,`# ${name.replace('.md','')}\n\n## 오늘 할 일\n\n- [ ] AI와 함께 작은 업무 하나 해 보기\n`);
  const dirs=['00_inbox','00_TODO/Archived',...opts.areas.map(a=>({personal:'Personal',business:'Business',work:'Work'}[a]))];
  // Validate every destination before writing anything.
  for(const relative of [...dirs,...entries.keys()]) {
    const dest=path.join(opts.target,relative); noSymlinks(dest);
    let parent=path.dirname(dest);
    while(parent.startsWith(opts.target)) {
      if(fs.existsSync(parent)&&!fs.statSync(parent).isDirectory()) throw new Error(`상위 경로가 폴더가 아닙니다: ${parent}`);
      if(parent===opts.target) break;
      parent=path.dirname(parent);
    }
    if(fs.existsSync(dest)&&dirs.includes(relative)&&!fs.statSync(dest).isDirectory()) throw new Error(`폴더 위치에 파일이 있습니다: ${dest}`);
    if(fs.existsSync(dest)&&entries.has(relative)&&!fs.statSync(dest).isFile()) throw new Error(`파일 위치에 폴더가 있습니다: ${dest}`);
  }
  const rows=[...entries].map(([relative,content])=>{
    const dest=path.join(opts.target,relative);
    return {relative,content,state:!fs.existsSync(dest)?'create':fs.readFileSync(dest,'utf8')===content?'same':'conflict'};
  });
  return {dirs,rows};
}
