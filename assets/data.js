
"use strict";
const XR=window.XR={version:"3.0.0",state:{data:null,source:"seed",page:"home",query:"",signal:"all",group:"all",dialog:null,theme:"dark",archiveStats:null},stopwords:new Set(("che come quando della delle degli sono anche alle nella nelle fatto dopo prima della vorrei questa quello sempre tutto tutti tu lei con per nel nei dei uno una dalle alla agli essere non sto cosa questo questa poi altro ancora dove posso più meno senza della mio mia mie tuoi vuoi siamo nostra vostre nostro tra fra molto ora ora mi il lo la i gli le di da su e ed o a ad in al ai si no se un uno una ma ho hai ha abbiamo avete hanno che qui dal sul nei alla era essere fare posso puoi deve però solo anche si sono loro tua sua tuo suo").split(/\s+/))};
XR.esc=function(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))};
XR.text=function(s){return String(s??"").replace(/\s+/g," ").trim()};
XR.today=function(){return new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date())};
XR.dateFromEpoch=function(t){const d=new Date((Number(t)>1e11?Number(t):Number(t)*1000));return !Number.isFinite(d.getTime())?"":new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"}).format(d)};
XR.backDate=function(iso,delta){let x=new Date(iso+"T12:00:00Z");x.setUTCDate(x.getUTCDate()+delta);return x.toISOString().slice(0,10)};
XR.windowDates=function(){const end=XR.today();return {start:XR.backDate(end,-6),end}};
XR.short=function(date){if(!/^\d{4}-\d{2}-\d{2}$/.test(date||""))return "—";const d=new Date(date+"T12:00:00Z");return new Intl.DateTimeFormat("it-IT",{day:"2-digit",month:"short",timeZone:"UTC"}).format(d).toUpperCase()};
XR.fmt=n=>Intl.NumberFormat("it-IT").format(n||0);
XR.classify=function(str){const t=XR.text(str).toLowerCase();const has=q=>q.test(t);if(has(/design|icona|asset|layout|font|typograph|copertin|interfaccia|ux|sfondo/))return"Design";if(has(/app|pwa|html|javascript|github|cloudflare|deploy|codice|repo|script|software|sito/))return"App e codice";if(has(/pdf|word|excel|report|document|dashboard|tabell|foglio/))return"Documenti";if(has(/lezion|corso|docent|student|formazion|workshop|copilot/))return"Formazione";if(has(/video|audio|social|youtube|instagram|post|thumbnail|stream|musica/))return"Contenuti";if(has(/mail|teams|firma|calend|contatt|incaric|cliente/))return"Operatività";return"Altro"};
XR.signal=function(str){const t=XR.text(str).toLowerCase();if(/rifa|rifai|non ci siamo|non mi piace|corregg|non funziona|miglior|rived|revision|errore|cambia|modifica/.test(t))return"revisione";if(/procedi|approvat|ok fallo|conferm|scelgo|decis|va bene così/.test(t))return"decisione";if(/problema|errore|fallito|non riesco|blocc|bug/.test(t))return"ostacolo";if(/crea|voglio|vorrei|progett|idea|pensavo|possibile/.test(t))return"idea";return"altro"};
XR.getText=function(msg){const c=msg?.content||{};if(Array.isArray(c.parts))return c.parts.filter(p=>typeof p==="string").join(" ");if(typeof c.text==="string")return c.text;return""};
XR.importArchive=async function(file){
  if(!file)return;const loaded=file.name||"file";
  if(!/\.json$/i.test(loaded))throw Error("Usa conversations.json o un export JSON BDC X-RAY. Per uno ZIP, estrai prima il JSON.");
  if(file.size>150*1024*1024)throw Error("File oltre 150 MB: suddividi l'archivio prima dell'importazione.");
  const raw=JSON.parse(await file.text());
  if(raw&&Array.isArray(raw.records)){const data=XR.normalize(raw);XR.state={...XR.state,data,source:"imported-data",page:"home",query:"",signal:"all",group:"all",archiveStats:null};return data;}
  if(!Array.isArray(raw))throw Error("Formato non riconosciuto. Serve conversations.json (array di conversazioni) o week.json.");
  const period=XR.windowDates();let chats=0,userMessages=0,assistantMessages=0,skipped=0;const records=[];
  for(const conv of raw){if(!conv||typeof conv!=="object")continue;const title=XR.text(conv.title||"Conversazione senza titolo");const maps=Object.values(conv.mapping||{});let inWindow=false;
    for(const node of maps){const m=node?.message;if(!m)continue;const role=m.author?.role; if(role!=="user"&&role!=="assistant")continue;const date=XR.dateFromEpoch(m.create_time||node?.create_time||0);if(date<period.start||date>period.end)continue;const txt=XR.text(XR.getText(m));if(!txt){skipped++;continue;}inWindow=true;
      if(role==="assistant"){assistantMessages++;continue;} userMessages++;
      const id="M"+String(records.length+1).padStart(5,"0");const description=txt.slice(0,250);
      records.push({id,date,topic:title,title:title.slice(0,100),summary:description,group:XR.classify(title+" "+description),signal:XR.signal(description),tags:[],source:"archive",time:m.create_time||null});
    }if(inWindow)chats++;
  }
  const data=XR.normalize({schema:"bdc-xray/parsed-chatgpt",period,status:"local-private",records,insights:[],quotes:[],links:[]});
  XR.state={...XR.state,data,source:"archive",page:"home",query:"",signal:"all",group:"all",archiveStats:{chats,userMessages,assistantMessages,skipped,filename:loaded}};
  return data;
};
XR.normalize=function(raw){const d=raw||{};const period=d.period||XR.windowDates();const records=Array.isArray(d.records)?d.records.filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date||"")).map((x,i)=>({...x,id:String(x.id||"T"+i),topic:String(x.topic||"Progetto"),title:String(x.title||"Senza titolo"),summary:String(x.summary||""),group:String(x.group||"Altro"),signal:String(x.signal||"altro"),tags:Array.isArray(x.tags)?x.tags:[]})):[];
  return {schema:d.schema||"bdc-xray-v3",period:{start:period.start||records[0]?.date||XR.today(),end:period.end||records[records.length-1]?.date||XR.today()},status:d.status||"partial",note:d.note||"",updated:d.updated||"",records,insights:Array.isArray(d.insights)?d.insights:[],quotes:Array.isArray(d.quotes)?d.quotes:[],links:Array.isArray(d.links)?d.links:[]};
};
XR.rows=function(){const s=XR.state;const d=s.data;if(!d)return[];let items=d.records.filter(x=>x.date>=d.period.start&&x.date<=d.period.end);if(s.query){const q=s.query.toLocaleLowerCase("it");items=items.filter(x=>[x.title,x.topic,x.summary,...x.tags,x.group,x.id].join(" ").toLocaleLowerCase("it").includes(q));}if(s.signal!=="all")items=items.filter(x=>x.signal===s.signal);if(s.group!=="all")items=items.filter(x=>x.group===s.group);return items};
XR.stats=function(records=XR.state.data?.records||[]){const d=XR.state.data;const days=[];if(d){let current=d.period.start;for(let j=0;j<31&&current<=d.period.end;j++,current=XR.backDate(current,1))days.push({date:current,count:records.filter(x=>x.date===current).length});}
 const counts=(key)=>Object.entries(records.reduce((a,x)=>(a[x[key]||"Altro"]=(a[x[key]||"Altro"]||0)+1,a),{})).sort((a,b)=>b[1]-a[1]);
 const category=counts("group"),signals=counts("signal"),projects=counts("topic");const peak=days.length?days.reduce((a,b)=>b.count>a.count?b:a):{date:"",count:0};
 return {n:records.length,days,active:days.filter(x=>x.count>0).length,peak,category,signals,projects,projectsCount:projects.length,revisions:records.filter(x=>x.signal==="revisione").length,ideas:records.filter(x=>x.signal==="idea").length,decisions:records.filter(x=>x.signal==="decisione").length,coverage:days.length}};
XR.words=function(rows=XR.state.data?.records||[]){const f={};rows.forEach(x=>{const s=[x.topic,...x.tags].join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");s.match(/[a-z]{4,}/g)?.forEach(w=>{if(!XR.stopwords.has(w))f[w]=(f[w]||0)+1})});return Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,15)};
XR.serializeCSV=function(rows){const cols=["date","id","title","topic","group","signal","summary"];const q=x=>'"'+String(x??"").replaceAll('"','""')+'"';return [cols.join(","),...rows.map(r=>cols.map(k=>q(r[k])).join(","))].join("\r\n")};
XR.download=function(name,type,content){const b=new Blob([content],{type}),url=URL.createObjectURL(b),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)};
