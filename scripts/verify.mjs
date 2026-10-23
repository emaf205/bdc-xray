import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const load=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const d=JSON.parse(load('data/week.json'));
assert.ok(d.period&&Array.isArray(d.records),'JSON: period and records required');
assert.match(d.period.start,/^\d{4}-\d{2}-\d{2}$/);
assert.match(d.period.end,/^\d{4}-\d{2}-\d{2}$/);
const diff=(Date.parse(d.period.end)-Date.parse(d.period.start))/86400000;
assert.ok(diff>=0&&diff<=6,'Window exceeds seven days');
assert.ok(d.records.length>0,'Empty dataset');
const ids=new Set();
for(const [i,r] of d.records.entries()){
 assert.ok(r.id&&!ids.has(r.id),'Duplicate or absent record ID '+i);ids.add(r.id);
 assert.ok(r.date>=d.period.start&&r.date<=d.period.end,'Record date outside period: '+r.id);
 for(const key of ['topic','title','summary','group','signal'])assert.equal(typeof r[key],'string','Missing field '+key+' in '+r.id);
}
const raw=JSON.stringify(d);
for(const [name,regex] of [['Email',/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i],['Access token',/(?:ghp_|sk-proj-|BEGIN PRIVATE KEY|api_key\s*[:=])/i]]){
 assert.ok(!regex.test(raw),'Potential private information: '+name);
}
assert.ok(d.status==='partial'||d.status==='local-private'||d.status==='verified','Coverage status is missing');
for(const path of ['index.html','assets/main.css','assets/responsive.css','assets/data.js','assets/views.js','assets/app.js','app.webmanifest','sw.js','icons/icon.svg'])assert.ok(existsSync(new URL('../'+path,import.meta.url)),path+' is missing');
const html=load('index.html');assert.ok(html.includes('assets/data.js')&&html.includes('assets/views.js')&&html.includes('assets/app.js'),'Missing scripts in shell');
for(const path of ['assets/data.js','assets/views.js','assets/app.js','sw.js']){new vm.Script(load(path),{filename:path})}
const win={};const sandbox={window:win,Intl,Date,Number,Array,Object,Set,String,Math,JSON,RegExp};vm.createContext(sandbox);
vm.runInContext(load('assets/data.js')+'\n'+load('assets/views.js'),sandbox);
const XR=win.XR,V=win.XV;XR.state.data=XR.normalize(d);
const k=XR.stats();assert.equal(k.n,d.records.length);assert.equal(k.coverage,diff+1);
for(const [name,renderer] of [['home',V.summary],['discover',V.discover],['atlas',V.projectAtlas],['timeline',V.timeline],['data',V.dataPage]]){
 let out=renderer();assert.ok(typeof out==='string'&&out.length>200,name+' failed render');assert.ok(!out.includes('undefined'),'Undefined in '+name);
}
console.log('BDC X-RAY VERIFY: PASS | '+k.n+' records | '+k.projectsCount+' topics | '+(diff+1)+' days | 5 views | JS syntax OK');
