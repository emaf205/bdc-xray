
"use strict";
const A=window.XA={};
A.app=document.getElementById("app");A.nav=document.getElementById("main-nav");A.dialog=document.getElementById("dialog");
A.seed=null;
A.error=function(message){const zone=document.getElementById("message-zone");if(zone){zone.textContent=message;zone.classList.remove("hide")}};
A.render=function(){const d=XR.state.data;if(!d){A.app.innerHTML=XV.empty();return;}A.nav.innerHTML=XV.navigation();
 const views={home:XV.summary,discover:XV.discover,atlas:XV.projectAtlas,timeline:XV.timeline,data:XV.dataPage};const v=views[XR.state.page]||views.home;
 A.app.innerHTML=v()+XV.footer();document.title="BDC X-RAY / "+(XR.state.page==="home"?"CRUSCOTTO":XR.state.page.toUpperCase());
 document.querySelectorAll("[data-nav]").forEach(x=>{if(x.dataset.nav===XR.state.page)x.setAttribute("aria-current","page")});};
A.goto=function(id){if(!XV.navItems.some(x=>x[0]===id))return;XR.state.page=id;XR.state.dialog=null;history.replaceState(null,"","#"+id);A.render();document.documentElement.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})};
A.close=function(){A.dialog.classList.remove("open");A.dialog.setAttribute("aria-hidden","true");A.dialog.innerHTML="";XR.state.dialog=null};
A.proof=function(index){const i=Number(index),ins=XV.currentInsights()[i];if(!ins)return;
 const ev=String(ins.evidence||"");const ids=[...new Set(ev.match(/\b[T|M]\d{3,6}\b/g)||[])];const rows=XR.state.data.records.filter(x=>ids.includes(x.id));
 const body='<span class="mono">SCOPERTA '+String(i+1).padStart(2,"0")+' / '+XR.esc(ins.kind)+'</span><h2>'+XR.esc(ins.title)+'</h2><p>'+XR.esc(ins.short||"")+'</p><div style="margin-top:25px;border-top:3px solid currentColor;padding-top:18px"><span class="mono">EVIDENZE E LIMITI</span><p style="font-size:16px;margin-top:10px">'+XR.esc(ev||"Classificazione analitica")+'</p></div>'+(rows.length?'<div class="evidence">'+rows.map(r=>'<button data-goto-trace="'+XR.esc(r.id)+'">'+XR.esc(r.id)+' ↗</button>').join("")+'</div>':'')+'<footer>Riferimenti alle tracce ricostruite o al dataset importato, non link alle conversazioni originali. L’interpretazione non prova causalità.</footer>';
 A.dialog.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="close" type="button" data-close aria-label="Chiudi">×</button><div id="modal-title">'+body+'</div></div>';A.dialog.classList.add("open");A.dialog.setAttribute("aria-hidden","false");A.dialog.querySelector(".close")?.focus();XR.state.dialog=i;
};
A.exportSVG=function(){const s=XR.stats(),arr=s.days,max=Math.max(1,...arr.map(x=>x.count));const W=1200,H=600,pad=75,bottom=120,plot=H-bottom-55;const barW=(W-pad*2)/Math.max(1,arr.length);
const rects=arr.map((it,i)=>{const h=Math.max(3,Math.round(it.count/max*plot)),x=pad+i*barW+10,y=H-bottom-h;return '<rect x="'+x+'" y="'+y+'" width="'+Math.max(4,barW-20)+'" height="'+h+'" fill="'+(it.count===max?"#efff3c":"#71756b")+'"/><text x="'+(x+(barW-20)/2)+'" y="'+(y-12)+'" text-anchor="middle" font-size="26" font-weight="900" fill="#efff3c">'+it.count+'</text><text x="'+(x+(barW-20)/2)+'" y="'+(H-77)+'" text-anchor="middle" font-size="23" font-family="monospace" fill="#ffffff">'+XR.esc(it.date.slice(-2))+'</text>'}).join("");
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'"><rect width="100%" height="100%" fill="#141510"/><text x="'+pad+'" y="65" font-family="Arial,sans-serif" font-weight="900" font-size="44" fill="#efff3c">BDC X-RAY / RITMO SETTIMANALE</text><text x="'+pad+'" y="98" font-family="monospace" font-size="20" fill="#ffffff">'+XR.esc(XV.period())+' / TRACCE DOCUMENTATE</text><line x1="'+pad+'" y1="'+(H-bottom)+'" x2="'+(W-pad)+'" y2="'+(H-bottom)+'" stroke="#ffffff"/>'+rects+'</svg>';XR.download("bdc-xray-ritmo.svg","image/svg+xml;charset=utf-8",svg)};
A.exportData=function(kind){const data=XR.state.data,files="bdc-xray-"+data.period.start+"-"+data.period.end;
if(kind==="json"){const safe={...data,meta:{unit:XR.state.source==="archive"?"messaggio utente":"traccia ricostruita",scope:XR.state.source,archiveStats:XR.state.archiveStats||null}};XR.download(files+".json","application/json;charset=utf-8",JSON.stringify(safe,null,2));}
if(kind==="csv")XR.download(files+".csv","text/csv;charset=utf-8","\ufeff"+XR.serializeCSV(XR.rows()));
if(kind==="svg")A.exportSVG();if(kind==="pdf"){const previous=XR.state.page;XR.state.page="home";A.render();window.addEventListener("afterprint",()=>{XR.state.page=previous;A.render()},{once:true});setTimeout(()=>window.print(),80)}};
A.import=function(file){const el=document.getElementById("import-status");if(el)el.textContent="ANALISI LOCALE IN CORSO…";XR.importArchive(file).then(()=>{A.render();let l=XR.state.archiveStats;let msg=l?"ARCHIVIO CARICATO: "+l.chats+" CHAT / "+l.userMessages+" MESSAGGI UTENTE":XR.stats().n+" TRACCE IMPORTATE";A.error(msg);document.getElementById("message-zone")?.scrollIntoView({behavior:"smooth",block:"start"});}).catch(err=>{const e=document.getElementById("import-status");if(e)e.textContent="ERRORE: "+err.message;A.error("IMPORTAZIONE FALLITA: "+err.message)})};
A.reset=function(){XR.state.query="";XR.state.signal="all";XR.state.group="all";A.render()};
A.resetSample=function(){if(!A.seed)return;XR.state={...XR.state,data:A.seed,source:"seed",page:"home",query:"",signal:"all",group:"all",archiveStats:null};A.goto("home")};
A.bind=function(){
 document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-nav]");if(nav){A.goto(nav.dataset.nav);return}
 const ex=e.target.closest("[data-export]");if(ex){A.exportData(ex.dataset.export);return}
 const proof=e.target.closest("[data-proof]");if(proof){A.proof(proof.dataset.proof);return}
 const close=e.target.closest("[data-close]");if(close){A.close();return}
 const gt=e.target.closest("[data-goto-trace]");if(gt){const id=gt.dataset.gotoTrace;A.close();A.goto("timeline");const element=document.getElementById("trace-"+id);if(element){element.scrollIntoView({block:"center"});element.style.background="#27311b";setTimeout(()=>element.style.background="",2000)}return}
 const project=e.target.closest("[data-project]");if(project){XR.state.query=project.dataset.project;XR.state.signal="all";XR.state.group="all";A.goto("timeline");return}
 const reset=e.target.closest("[data-reset]");if(reset){if(reset.dataset.reset==="dataset")A.resetSample();else A.reset();return}
 if(e.target===A.dialog)A.close()
 });
 document.addEventListener("input",e=>{if(e.target?.id==="trace-search"){XR.state.query=e.target.value;document.getElementById("trace-results").innerHTML=XV.renderTraces(XR.rows());document.querySelector(".sect strong")?.replaceChildren(document.createTextNode(XR.rows().length+" RISULTATI"))}});
 document.addEventListener("change",e=>{if(e.target?.id==="trace-group"){XR.state.group=e.target.value;A.render()}if(e.target?.id==="trace-signal"){XR.state.signal=e.target.value;A.render()}if(e.target?.id==="file-import")A.import(e.target.files?.[0])});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&XR.state.dialog!==null)A.close()});
 document.getElementById("top-export")?.addEventListener("click",()=>A.goto("data"));
 window.addEventListener("hashchange",()=>{const id=location.hash.slice(1);if(id&&id!==XR.state.page)A.goto(id)});
};
A.init=async function(){A.bind();const hash=location.hash.slice(1);if(XV.navItems.some(x=>x[0]===hash))XR.state.page=hash;
 try{const res=await fetch("./data/week.json",{cache:"no-store"});if(!res.ok)throw Error("HTTP "+res.status);A.seed=XR.normalize(await res.json());XR.state.data=A.seed;A.render()}catch(err){A.app.innerHTML='<div class="empty"><h2>DATI NON CARICATI.</h2><p>'+XR.esc(err.message)+'</p><button class="btn" onclick="location.reload()">RIPROVA ↗</button></div>'}
 if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol)){navigator.serviceWorker.register("./sw.js").catch(()=>{})}};
A.init();
