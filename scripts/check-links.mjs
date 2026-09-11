import fs from 'node:fs';
import path from 'node:path';
import {filesUnder,kit} from './lib.mjs';
const problems=[];
for(const source of filesUnder(kit).filter(p=>p.endsWith('.md')&&!p.includes(`${path.sep}.git${path.sep}`))) {
  const content=fs.readFileSync(source,'utf8').replace(/```[\s\S]*?```/g,'').replace(/`[^`]*`/g,'');
  for(const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const link=match[1].split('#')[0];
    if(!link||/^[a-z]+:/.test(link))continue;
    const dest=path.resolve(path.dirname(source),link);
    if(fs.existsSync(dest))continue;
    // The template is assembled with manual and empty inbox at installation.
    if(source.includes('/templates/desk/')&&(link.startsWith('manual/')||link==='00_inbox'))continue;
    problems.push(`${path.relative(kit,source)} -> ${link}`);
  }
}
if(problems.length){console.error(problems.join('\n'));process.exitCode=1;}else console.log('Local Markdown links: PASS');
