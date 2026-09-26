/* ============================== ABSOLUT COACH — LE MATCH ==============================
   Moteur de match partagé par les deux modes : composition (onze, banc, capitaine), fraîcheur
   physique, suspensions, styles adverses, approche du match, mi-temps, événements minute par
   minute (buts, penaltys, cartons, blessures, remplacements), notes individuelles et récit.
   Un match est un objet sérialisable (identifiants de joueurs seulement) rangé dans state.match. */

/* ---------- Styles : familles et duels ---------- */
const STYLE_FAMILY={possession:'controle',positionnel:'controle',total:'controle',fantaisie:'controle',formation:'controle',pressing:'pression',physique:'pression',rock:'pression',verticalite:'pression',contre:'contre',blocbas:'contre',catenaccio:'contre',direct:'direct',ailes:'direct'};
const FAMILY_INFO={controle:{icon:'🧠',label:"Contrôle",beats:'pression',how:"fait courir le pressing jusqu'à l'épuiser"},pression:{icon:'🔥',label:"Pression",beats:'contre',how:"ne laisse aucun temps pour lancer les contres"},contre:{icon:'🧱',label:"Contre",beats:'controle',how:"punit l'espace laissé derrière la ligne haute"},direct:{icon:'🚀',label:"Direct",beats:null,how:"ne craint personne, mais ouvre le match"}};
function styleFamily(id){ return STYLE_FAMILY[id]||'controle'; }
/* +1 : notre style prend le dessus, −1 : le leur, 0 : neutre */
function styleMatchup(ours,theirs){ const a=styleFamily(ours), b=styleFamily(theirs); if(FAMILY_INFO[a].beats===b) return 1; if(FAMILY_INFO[b].beats===a) return -1; return 0; }
function matchupText(ours,theirs){ const m=styleMatchup(ours,theirs), o=styleById(ours), t=styleById(theirs); if(m>0) return `Ton ${o.name.toLowerCase()} ${FAMILY_INFO[styleFamily(ours)].how} : avantage pour toi`; if(m<0) return `Leur ${t.name.toLowerCase()} ${FAMILY_INFO[styleFamily(theirs)].how} : avantage pour eux`; return `Les deux styles se neutralisent`; }
function eraStylePool(year){ return STYLES.filter(s=>s.id!=='formation'&&!(year<1972&&s.id==='total')&&!(year<1988&&(s.id==='pressing'||s.id==='positionnel'))); }

/* ---------- Approche, entraînement, décisions de mi-temps ---------- */
const APPROACHES={
  offensif:{icon:'⚔️',label:"Tout devant",desc:"Plus d'occasions pour toi, encore plus pour eux.",atk:1.18,def:1.24},
  equilibre:{icon:'⚖️',label:"Équilibré",desc:"Le plan de jeu, sans excès.",atk:1,def:1},
  defensif:{icon:'🛡️',label:"Fermer le jeu",desc:"Moins d'occasions des deux côtés, surtout les leurs.",atk:.8,def:.76},
};
const TRAINING={
  tactique:{icon:'📐',label:"Tactique",desc:"Automatismes : +0,08 de force en match.",strength:.8,recovery:0,injury:1},
  physique:{icon:'💪',label:"Physique",desc:"Fraîcheur +3 par semaine, blessures −15 %, force −0,03.",strength:-.3,recovery:3,injury:.85},
  jeunes:{icon:'🌱',label:"Jeunes",desc:"Les moins de 23 ans progressent plus vite. Force −0,05.",strength:-.5,recovery:0,injury:1,youth:true},
  recuperation:{icon:'🛌',label:"Récupération",desc:"Fraîcheur +6 par semaine, blessures −25 %, force −0,08.",strength:-.8,recovery:6,injury:.75},
};
const HALFTIME_CHOICES=[
  {id:'keep',icon:'🤝',label:"Garder le plan",sub:"Tu fais confiance à ce que tu as préparé."},
  {id:'offensif',icon:'⚔️',label:"Tout devant",sub:"Deux attaquants de plus dans la surface, moins de monde derrière."},
  {id:'defensif',icon:'🛡️',label:"Fermer le jeu",sub:"Bloc bas, temps qui passe, un point c'est déjà ça."},
  {id:'talk',icon:'📣',label:"Recadrer le vestiaire",sub:"Un coup de gueule. Ça marche si ton management et ton vestiaire tiennent, sinon ça casse."},
];

/* ---------- Fraîcheur, disponibilité, force d'un onze ---------- */
function fit(p){ if(p.fitness==null) p.fitness=100; return p.fitness; }
function fitnessMalus(p){ return Math.max(0,75-fit(p))*.15; }
function availableForMatch(p){ return !(p.injury>0)&&!(p.suspended>0); }
function effRating(p,year){ return playerRating(p,year)-fitnessMalus(p); }
function fatigueCost(p,year){ const a=playerAge(p,year); return a<=23?10:a<=30?12:a<=33?14:16; }
function benchSize(year){ const s=eraSubs(year); return s?s+2:0; }
/* Une semaine passe : récupération, guérison, petit risque de blessure à l'entraînement */
function recoverSquad(squad,year,ctx={}){
  const tr=TRAINING[ctx.training]||TRAINING.tactique; const era=eraForYear(year); const notes=[];
  const base=9+((ctx.staff||50)-50)*.06+tr.recovery;
  squad.forEach(p=>{
    p.fitness=clamp(fit(p)+base+(playerProfil(p).recovery||0),0,100);
    if(p.injury>0){ p.injury=Math.max(0,p.injury-1); return; }
    const chance=.004*era.injuryMult*tr.injury*(playerProfil(p).injury||1)*(fit(p)<60?1.5:1);
    if(Math.random()<chance){ p.injury=randInt(1,4); notes.push(`${p.name} se blesse à l'entraînement (${p.injury} sem.)`); }
  });
  return notes;
}
function slotPenalty(slot,pos){ if(slot===pos) return 0; if(slot==='G') return 20; if(pos==='G') return 15; if((slot==='D'&&pos==='A')||(slot==='A'&&pos==='D')) return 8; return 4; }
/* Répartit un groupe de joueurs dans les cases de la formation ; renvoie [{p,slot,pen}] */
function assignSlots(players,formation){
  const need=[['G',1],['D',formation[0]],['M',formation[1]],['A',formation[2]]]; const left=[...players]; const out=[];
  need.forEach(([slot,n])=>{ for(let i=0;i<n;i++){ let idx=left.findIndex(p=>p.pos===slot); if(idx<0){ let best=-1,bp=99; left.forEach((p,j)=>{ const pen=slotPenalty(slot,p.pos); if(pen<bp){ bp=pen; best=j; } }); idx=best; } if(idx>=0){ const p=left.splice(idx,1)[0]; out.push({p,slot,pen:slotPenalty(slot,p.pos)}); } } });
  left.forEach(p=>out.push({p,slot:p.pos,pen:0}));
  return out;
}
/* Onze et banc automatiques : disponibles, triés par niveau effectif (fraîcheur comprise) */
function autoLineup(squad,formation,year,opts={}){
  const score=p=>effRating(p,year)+(opts.scoreBonus?opts.scoreBonus(p):0);
  const avail=squad.filter(availableForMatch); const need={G:1,D:formation[0],M:formation[1],A:formation[2]}; const xi=[];
  ['G','D','M','A'].forEach(pos=>{ const c=avail.filter(p=>p.pos===pos&&!xi.includes(p)).sort((a,b)=>score(b)-score(a)); for(let i=0;i<need[pos];i++) if(c[i]) xi.push(c[i]); });
  while(xi.length<11){ const alt=avail.filter(p=>!xi.includes(p)).sort((a,b)=>score(b)-score(a))[0]; if(!alt) break; xi.push(alt); }
  const n=opts.benchSize!=null?opts.benchSize:benchSize(year); const rest=avail.filter(p=>!xi.includes(p)).sort((a,b)=>score(b)-score(a)); const bench=[];
  if(n>0){ const g=rest.find(p=>p.pos==='G'); if(g) bench.push(g); rest.forEach(p=>{ if(bench.length<n&&!bench.includes(p)) bench.push(p); }); }
  return {xi,bench};
}
/* Le brassard va à celui qui tient le jeu, puis à l'ancienneté. */
function defaultCaptain(xi){ return [...xi].sort((a,b)=>((playerProfil(b).lead||0)-(playerProfil(a).lead||0))||(b.seasonsAtClub-a.seasonsAtClub))[0]||null; }
function captainBonus(c){ if(!c) return 0; return .2+(playerProfil(c).lead||0)*.75; }
/* Force d'un onze réellement aligné (cases, fraîcheur, banc, moral, capitaine, bonus externes) */
function lineupStrength(xi,bench,formation,year,opts={}){
  if(!xi.length) return 40;
  const slots=assignSlots(xi,formation); let sum=0,w=0; slots.forEach(s=>{ const wt=s.slot==='G'?1.2:1; sum+=(effRating(s.p,year)-s.pen)*wt; w+=wt; });
  let avg=sum/w; if(xi.length<11) avg-=(11-xi.length)*4;
  const benchAvg=bench.length?bench.reduce((n,p)=>n+effRating(p,year),0)/bench.length:avg-15;
  const morale=xi.reduce((n,p)=>n+(p.morale==null?65:p.morale),0)/xi.length;
  return avg+(benchAvg-avg+12)*.06+(morale-60)*.04+captainBonus(opts.captain)+(opts.bonus||0);
}

/* ---------- Construction d'un match ---------- */
/* o : {year,home,usName,themName,themStrength,themStyle,themNat,ourStyle,xi,bench,captain,approach,bonus,decider,matchday,label} */
function newMatch(o){
  const first=45+randInt(0,2), second=90+randInt(1,5);
  const m={ year:o.year, home:!!o.home, usName:o.usName, themName:o.themName, themStrength:o.themStrength, themStyle:o.themStyle, ourStyle:o.ourStyle, approach:o.approach||'equilibre', bonus:o.bonus||0, decider:o.decider||null, matchday:o.matchday||0, label:o.label||'',
    formation:o.formation||'4-4-2', xi:o.xi.map(p=>p.id), bench:o.bench.map(p=>p.id), captain:o.captain?o.captain.id:null, onPitch:o.xi.map(p=>p.id), subsLeft:eraSubs(o.year), redUs:0, redThem:0, shortUs:0, yellowsThem:{},
    gu:0, gt:0, half:0, minute:0, htEnd:first, ftEnd:second, events:[], played:{}, ht:null, pending:null, done:false, strengthUs:0, factors:[], ratings:{}, motm:null, story:'',
    oppNames:Array.from({length:5},()=>fakeName(natForClub(o.themNat||'FR'))), oppPen:0 };
  o.xi.forEach(p=>{ m.played[p.id]={min:0,start:true,goals:0,assists:0,yellow:0,red:0,inj:0,sub:false}; });
  return m;
}
function matchScore(m){ return m.home?`${m.gu}–${m.gt}`:`${m.gt}–${m.gu}`; }
function matchResult(m){ return m.gu>m.gt?'W':m.gu<m.gt?'L':'D'; }
function matchHomeAway(m){ return m.home?{home:m.usName,away:m.themName,gh:m.gu,ga:m.gt}:{home:m.themName,away:m.usName,gh:m.gt,ga:m.gu}; }
/* Force effective de notre onze en cours de match (recalculée après chaque changement) */
function matchRecompute(m,P){
  const xi=m.onPitch.map(id=>P[id]).filter(Boolean), bench=m.bench.map(id=>P[id]).filter(Boolean);
  m.strengthUs=lineupStrength(xi,bench,FORMATIONS[m.formation]||[4,4,2],m.year,{captain:m.captain!=null?P[m.captain]:null,bonus:m.bonus})-m.shortUs*4;
}
function matchLambdas(m){
  const sU=m.strengthUs+(m.home?2:0)-m.redUs*3.5, sT=m.themStrength+(m.home?0:2)-m.redThem*3.5;
  const mu=styleMatchup(m.ourStyle,m.themStyle)*2.2; const a=APPROACHES[m.approach]||APPROACHES.equilibre;
  const open=(styleFamily(m.ourStyle)==='direct'?1.06:1)*(styleFamily(m.themStyle)==='direct'?1.06:1)*(m.talkBoost||1);
  const xU=tameXG((m.home?1.35:1.05)*Math.exp((sU+mu-sT)/19)*a.atk*open), xT=tameXG((m.home?1.05:1.35)*Math.exp((sT-sU-mu)/19)*a.def*open);
  return [xU/90,xT/90];
}
function pickWeighted(list,wfn){ const ws=list.map(wfn); const tot=ws.reduce((n,x)=>n+x,0); if(tot<=0) return list[0]; let r=Math.random()*tot; for(let i=0;i<list.length;i++){ r-=ws[i]; if(r<=0) return list[i]; } return list[list.length-1]; }
function mEvent(m,min,icon,text,kind,side,pid){ m.events.push({min,icon,text,kind,side,pid:pid==null?null:pid}); }
function minLabel(min,m){ const base=m.half===0?45:90; return min>base?`${base}+${min-base}'`:`${min}'`; }
function penaltyTaker(m,P){ const cands=m.onPitch.map(id=>P[id]).filter(p=>p&&p.pos!=='G'); return pickWeighted(cands,p=>(p.pos==='A'?4:p.pos==='M'?2:.3)*(p.traitId==='glace'?1.5:1)*(playerProfil(p).loves.includes('verticalite')||playerProfil(p).fans?1.3:1)*Math.pow(playerRating(p,m.year)/70,3)); }
function goalFor(m,P,min,opts={}){
  const cands=m.onPitch.map(id=>P[id]).filter(Boolean); if(!cands.length) return;
  const scorer=opts.scorer||pickWeighted(cands,p=>(p.pos==='A'?6:p.pos==='M'?2.5:p.pos==='D'?.6:.03)*Math.pow(playerRating(p,m.year)/70,2));
  let assist=null; if(!opts.pen&&Math.random()<.62){ const others=cands.filter(p=>p!==scorer); if(others.length) assist=pickWeighted(others,p=>(p.pos==='M'?4:p.pos==='A'?3:p.pos==='D'?1.5:.2)*playerRating(p,m.year)/70); }
  m.gu++; const s=m.played[scorer.id]; if(s) s.goals++; if(assist&&m.played[assist.id]) m.played[assist.id].assists++;
  mEvent(m,min,'⚽',`${minLabel(min,m)} <b>${escapeHtml(scorer.name)}</b>${opts.pen?' sur penalty':''}${assist?` (passe de ${escapeHtml(assist.name)})`:''} — ${matchScore(m)}`,'goal','us',scorer.id);
}
function goalAgainst(m,min,opts={}){ m.gt++; const who=pick(m.oppNames); mEvent(m,min,'🥅',`${minLabel(min,m)} ${escapeHtml(who)} pour ${escapeHtml(m.themName)}${opts.pen?' sur penalty':''} — ${matchScore(m)}`,'goal','them'); }
function forceSubOrShort(m,P,min,outId,reason){
  const outP=P[outId]; m.onPitch=m.onPitch.filter(id=>id!==outId);
  if(m.subsLeft>0&&m.bench.length){ const pool=m.bench.map(id=>P[id]).filter(Boolean); const same=pool.filter(p=>p.pos===outP.pos); const inP=(same.length?same:pool).sort((a,b)=>effRating(b,m.year)-effRating(a,m.year))[0]; m.bench=m.bench.filter(id=>id!==inP.id); m.onPitch.push(inP.id); m.subsLeft--; m.played[inP.id]={min:0,start:false,goals:0,assists:0,yellow:0,red:0,inj:0,sub:true,inAt:min}; mEvent(m,min,'🔁',`${minLabel(min,m)} ${escapeHtml(inP.name)} remplace ${escapeHtml(outP.name)}${reason?' ('+reason+')':''}`,'sub','us',inP.id); }
  else { m.shortUs++; mEvent(m,min,'⚠️',`${minLabel(min,m)} ${escapeHtml(m.usName)} termine à ${m.onPitch.length}${m.subsLeft>0?' (banc vide)':' (plus de remplacement possible)'}`,'short','us'); }
  matchRecompute(m,P);
}
function autoSubs(m,P,min){
  if(m.subsLeft<=0||!m.bench.length) return;
  const windows=[62,71,80]; if(!windows.includes(min)) return;
  const field=m.onPitch.map(id=>P[id]).filter(p=>p&&p.pos!=='G');
  const losing=m.gu<m.gt, winning=m.gu>m.gt;
  const tired=field.filter(p=>fit(p)<58).sort((a,b)=>fit(a)-fit(b))[0];
  let out=tired||null;
  if(!out&&losing&&min>=71){ out=field.filter(p=>p.pos==='D').sort((a,b)=>effRating(a,m.year)-effRating(b,m.year))[0]||null; }
  if(!out&&winning&&min>=80){ out=field.filter(p=>p.pos==='A').sort((a,b)=>effRating(a,m.year)-effRating(b,m.year))[0]||null; }
  if(!out&&m.decider){ const me=P[m.decider]; if(me&&m.bench.includes(me.id)&&min>=62){ const rival=field.filter(p=>p.pos===me.pos).sort((a,b)=>effRating(a,m.year)-effRating(b,m.year))[0]; const decided=Math.abs(m.gu-m.gt)>=2; if(rival&&(effRating(me,m.year)+(me.selBonus||0)>=effRating(rival,m.year)-5||(min>=71&&!losing&&Math.random()<.35)||(min>=71&&decided&&playerAge(me,m.year)<=21&&Math.random()<.6))) out=rival; } }
  if(!out) return;
  const pool=m.bench.map(id=>P[id]).filter(Boolean); let inP=null;
  if(losing) inP=pool.filter(p=>p.pos==='A'||p.pos==='M').sort((a,b)=>effRating(b,m.year)-effRating(a,m.year))[0];
  else if(winning) inP=pool.filter(p=>p.pos==='D'||p.pos==='M').sort((a,b)=>effRating(b,m.year)-effRating(a,m.year))[0];
  if(!inP){ const same=pool.filter(p=>p.pos===out.pos); inP=(same.length?same:pool.filter(p=>p.pos!=='G')).sort((a,b)=>effRating(b,m.year)-effRating(a,m.year))[0]; }
  if(!inP) return;
  if(m.decider&&pool.some(p=>p.id===m.decider)&&(inP.pos===P[m.decider].pos||losing)&&effRating(P[m.decider],m.year)+(P[m.decider].selBonus||0)>=effRating(inP,m.year)-2) inP=P[m.decider];
  m.onPitch=m.onPitch.filter(id=>id!==out.id); m.onPitch.push(inP.id); m.bench=m.bench.filter(id=>id!==inP.id); m.subsLeft--;
  m.played[inP.id]={min:0,start:false,goals:0,assists:0,yellow:0,red:0,inj:0,sub:true,inAt:min};
  mEvent(m,min,'🔁',`${minLabel(min,m)} ${escapeHtml(inP.name)} remplace ${escapeHtml(out.name)}`,'sub','us',inP.id);
  matchRecompute(m,P);
}
/* Une minute de jeu */
function matchMinute(m,P,ctx){
  const min=m.minute; const era=eraForYear(m.year); const cards=m.year>=1970;
  m.onPitch.forEach(id=>{ if(m.played[id]) m.played[id].min++; });
  const [xU,xT]=matchLambdas(m);
  // penalty
  const penRate=(m.year>=2018?.12:.09)/90;
  if(Math.random()<penRate){ if(m.decider&&m.onPitch.includes(m.decider)&&P[m.decider].pos!=='G'){ m.pending={type:'penalty',min}; return; } const taker=penaltyTaker(m,P); if(taker){ const ok=Math.random()<(.76+(taker.traitId==='glace'?.09:0)); if(ok) goalFor(m,P,min,{pen:true,scorer:taker}); else mEvent(m,min,'❌',`${minLabel(min,m)} Penalty manqué par ${escapeHtml(taker.name)}`,'penmiss','us',taker.id); } return; }
  if(Math.random()<penRate){ const ok=Math.random()<.76; if(ok) goalAgainst(m,min,{pen:true}); else mEvent(m,min,'🧤',`${minLabel(min,m)} Penalty arrêté ! ${escapeHtml(m.themName)} le manque`,'save','us'); return; }
  if(Math.random()<xU){ goalFor(m,P,min); return; }
  if(Math.random()<xT){ goalAgainst(m,min); return; }
  if(cards){
    const aggr=styleFamily(m.ourStyle)==='pression'?1.3:1;
    if(Math.random()<1.6*aggr/90){ const cands=m.onPitch.map(id=>P[id]).filter(Boolean); const p=pickWeighted(cands,x=>(x.pos==='D'?1.3:x.pos==='M'?1.1:x.pos==='A'?.8:.25)*(playerProfil(x).aggr||1)*(m.played[x.id]&&m.played[x.id].yellow?.22:1)); const s=m.played[p.id]; if(s){ s.yellow++; if(s.yellow>=2){ s.red=1; m.redUs++; mEvent(m,min,'🟥',`${minLabel(min,m)} ${escapeHtml(p.name)} expulsé·e (deuxième avertissement)`,'red','us',p.id); m.onPitch=m.onPitch.filter(id=>id!==p.id); matchRecompute(m,P); } else mEvent(m,min,'🟨',`${minLabel(min,m)} ${escapeHtml(p.name)} averti·e`,'yellow','us',p.id); } return; }
    if(Math.random()<.02/90){ const cands=m.onPitch.map(id=>P[id]).filter(Boolean); const p=pickWeighted(cands,x=>(x.pos==='D'?1.4:1)*(playerProfil(x).aggr||1)); const s=m.played[p.id]; if(s){ s.red=1; m.redUs++; mEvent(m,min,'🟥',`${minLabel(min,m)} ${escapeHtml(p.name)} expulsé·e — carton rouge direct`,'red','us',p.id); m.onPitch=m.onPitch.filter(id=>id!==p.id); matchRecompute(m,P); } return; }
    if(Math.random()<.045/90){ m.redThem++; mEvent(m,min,'🟥',`${minLabel(min,m)} ${escapeHtml(pick(m.oppNames))} (${escapeHtml(m.themName)}) expulsé`,'red','them'); return; }
  }
  // blessure
  const injF=(ctx.injuryMult||1);
  for(const id of m.onPitch){ const p=P[id]; if(!p) continue; const chance=(.015+(p.injuryMod||0))*era.injuryMult*injF*(playerProfil(p).injury||1)*(fit(p)<60?1.8:fit(p)<75?1.25:1)/90; if(Math.random()<chance){ const weeks=Math.random()<.6?randInt(1,3):randInt(3,9); p.injury=weeks; if(m.played[id]) m.played[id].inj=weeks; mEvent(m,min,'🩼',`${minLabel(min,m)} ${escapeHtml(p.name)} sort sur blessure (${weeks} sem.)`,'injury','us',p.id); forceSubOrShort(m,P,min,id,'blessure'); return; } }
  autoSubs(m,P,min);
}
/* Joue la mi-temps en cours jusqu'à son terme ; s'arrête si une décision est attendue (m.pending) */
function matchPlayHalf(m,P,ctx={}){
  if(m.done) return; if(m.half===0&&m.minute===0) matchRecompute(m,P);
  const end=m.half===0?m.htEnd:m.ftEnd;
  while(m.minute<end){ if(m.pending) return; m.minute++; matchMinute(m,P,ctx); if(m.pending) return; }
  if(m.half===0){ m.half=1; m.ht=[m.gu,m.gt]; mEvent(m,45,'⏸️',`Mi-temps : ${matchScore(m)}`,'ht','none'); m.minute=45; m.talkBoost=1; }
  else { m.half=2; matchFinish(m,P); }
}
/* Résout un penalty en attente (mode joueur·euse) : takeIt = le tirer soi-même */
function matchResolvePenalty(m,P,takeIt,successChance){
  const pen=m.pending; m.pending=null; if(!pen||pen.type!=='penalty') return null;
  const me=P[m.decider]; let taker=me, chance=successChance;
  if(!takeIt){ const others=m.onPitch.filter(id=>id!==m.decider).map(id=>P[id]).filter(p=>p&&p.pos!=='G'); if(others.length){ m.onPitch=m.onPitch.filter(id=>id!==m.decider); taker=penaltyTaker(m,P); m.onPitch.push(m.decider); } chance=.76; }
  const ok=Math.random()<chance;
  if(ok) goalFor(m,P,pen.min,{pen:true,scorer:taker}); else mEvent(m,pen.min,'❌',`${minLabel(pen.min,m)} Penalty manqué par ${escapeHtml(taker.name)}`,'penmiss','us',taker.id);
  return {ok,taker,mine:taker===me};
}
function matchApplyHalftime(m,P,choiceId,ctx={}){
  const ch=HALFTIME_CHOICES.find(c=>c.id===choiceId)||HALFTIME_CHOICES[0]; m.pending=null; m.htChoice=ch.id; let note='';
  if(ch.id==='offensif'||ch.id==='defensif'){ m.approach=ch.id; note=`Seconde période : ${APPROACHES[ch.id].label.toLowerCase()}.`; }
  else if(ch.id==='talk'){ const skill=(ctx.management||50), vest=(ctx.vestiaire||50); const p=clamp(.35+(skill-50)*.006+(vest-50)*.005,.15,.85); if(Math.random()<p){ m.bonus+=2.5; note="Le vestiaire ressort transformé : +2,5 de force en seconde période."; m.talkResult='ok'; } else { m.bonus-=1.5; note="Le coup de gueule tombe à plat, deux cadres te regardent de travers : −1,5 de force."; m.talkResult='ko'; } matchRecompute(m,P); }
  else note="Le plan ne change pas.";
  mEvent(m,45,ch.icon,`Mi-temps : ${ch.label}. ${note}`,'choice','none'); m.htNote=note;
  return note;
}
/* Notes individuelles et récit */
function matchFinish(m,P){
  m.done=true; const res=matchResult(m); const rv=res==='W'?.4:res==='L'?-.4:0; const out={};
  Object.entries(m.played).forEach(([id,s])=>{ const p=P[id]; if(!p||!s.min) return;
    let r=6.3+rv+(s.min<30?-.3:0)+s.goals*(p.pos==='A'?.9:p.pos==='M'?1:1.2)+s.assists*.5;
    if(p.pos==='G'||p.pos==='D') r+=m.gt===0?.6:-Math.min(1.2,Math.max(0,m.gt-1)*.25);
    if(p.pos==='A'&&!s.goals&&s.min>=60) r-=.3;
    r+=(effRating(p,m.year)-m.themStrength)/25-s.yellow*.3-s.red*1.5+rand(-.5,.5);
    out[id]=clamp(Math.round(r*10)/10,3,10); });
  m.ratings=out; const best=Object.entries(out).sort((a,b)=>b[1]-a[1])[0]; m.motm=best?best[0]:null;
  m.story=matchStory(m);
  // fatigue
  Object.entries(m.played).forEach(([id,s])=>{ const p=P[id]; if(!p||!s.min) return; p.fitness=clamp(fit(p)-fatigueCost(p,m.year)*s.min/90,0,100); });
}
function matchStory(m){
  const goals=m.events.filter(e=>e.kind==='goal'); const last=goals[goals.length-1]; const W=m.gu>m.gt, L=m.gu<m.gt;
  if(m.redUs&&W) return "Réduits à dix, tes joueurs ont tenu bon.";
  if(W&&last&&last.side==='us'&&last.min>=85&&m.gu-m.gt===1) return "Une victoire arrachée dans les dernières minutes.";
  if(L&&last&&last.side==='them'&&last.min>=85&&m.gt-m.gu===1) return "Un but dans les derniers instants, et tout s'écroule.";
  if(m.ht){ const [hu,ht]=m.ht; if(hu-ht>=2&&W) return "Un match plié avant la mi-temps."; if(hu<ht&&W) return "Menés à la pause, tes joueurs ont renversé le match."; if(hu>ht&&L) return "Devant à la pause, l'équipe a craqué en seconde période."; if(hu<ht&&!L) return "Un point sauvé après une première période ratée."; }
  if(m.gu===0&&m.gt===0) return "Un 0-0 fermé, sans grande occasion.";
  if(m.gu+m.gt>=5) return "Un match fou, ouvert des deux côtés.";
  if(W&&m.gu-m.gt>=3) return "Une démonstration."; if(L&&m.gt-m.gu>=3) return "Une correction.";
  if(m.events.some(e=>e.kind==='penmiss')&&!W) return "Le penalty manqué a coûté cher.";
  return W?"Une victoire sérieuse.":L?"Une défaite sans appel.":"Un partage des points logique.";
}
/* Buteurs de notre équipe, pour les résumés : « Nom ×2, Autre » */
function matchScorersText(m,P){ return Object.entries(m.played).filter(([id,s])=>s.goals).map(([id,s])=>`${P[id]?P[id].name:'?'}${s.goals>1?' ×'+s.goals:''}`).join(', '); }
/* Effets d'après-match sur l'effectif : apparitions, buts, cartons cumulés, suspensions */
function matchApplyToSquad(m,P,year){
  const susp=[];
  Object.entries(m.played).forEach(([id,s])=>{ const p=P[id]; if(!p||!s.min) return;
    p.apps=(p.apps||0)+1; p.goals=(p.goals||0)+s.goals; p.assists=(p.assists||0)+s.assists; p.sumRating=(p.sumRating||0)+(m.ratings[id]||6); p.rated=(p.rated||0)+1;
    if(s.red){ p.suspended=(p.suspended||0)+(s.yellow>=2?1:2); susp.push(`${p.name} (${p.suspended} match${p.suspended>1?'s':''})`); }
    else if(s.yellow){ p.yellows=(p.yellows||0)+s.yellow; if(p.yellows>=3){ p.yellows=0; p.suspended=(p.suspended||0)+1; susp.push(`${p.name} (3 avertissements : 1 match)`); } }
  });
  return susp;
}
/* Décrémente les suspensions de ceux qui n'ont pas joué ce match */
function serveSuspensions(squad,m){ squad.forEach(p=>{ if(p.suspended>0&&!(m.played[p.id]&&m.played[p.id].min)) p.suspended--; }); }
/* Facteurs explicables avant le coup d'envoi */
function matchFactors(m,P,ctx={}){
  const f=[]; const xi=m.xi.map(id=>P[id]).filter(Boolean); const avg=xi.length?xi.reduce((n,p)=>n+effRating(p,m.year),0)/xi.length:0;
  f.push({t:`Onze aligné à ${avg.toFixed(1)} contre ${m.themName} à ${Math.round(m.themStrength)}`,d:avg-m.themStrength});
  f.push({t:m.home?'À domicile, le public pousse (+2)':'À l\'extérieur (−2)',d:m.home?2:-2});
  const mu=styleMatchup(m.ourStyle,m.themStyle); f.push({t:matchupText(m.ourStyle,m.themStyle),d:mu*2.2});
  const a=APPROACHES[m.approach]; if(a&&m.approach!=='equilibre') f.push({t:`${a.icon} ${a.label} : ${a.desc}`,d:m.approach==='offensif'?.5:-.5});
  const slots=assignSlots(xi,FORMATIONS[m.formation]||[4,4,2]); const off=slots.filter(s=>s.pen>0); if(off.length) f.push({t:`Hors poste : ${off.map(s=>`${s.p.name} en ${POS_LABEL[s.slot].toLowerCase()}`).join(', ')}`,d:-off.reduce((n,s)=>n+s.pen,0)/11});
  const tired=xi.filter(p=>fit(p)<70); if(tired.length) f.push({t:`Fatigue : ${tired.map(p=>`${p.name} (${Math.round(fit(p))}%)`).join(', ')}`,d:-tired.reduce((n,p)=>n+fitnessMalus(p),0)/11});
  if(xi.length<11) f.push({t:`Seulement ${xi.length} joueurs disponibles`,d:-(11-xi.length)*4});
  const cap=m.captain!=null?P[m.captain]:null; if(cap){ const b=captainBonus(cap); f.push({t:`Capitaine ${cap.name} (${playerProfil(cap).label})`,d:b}); }
  (ctx.extra||[]).forEach(x=>f.push(x));
  m.factors=f; return f;
}
