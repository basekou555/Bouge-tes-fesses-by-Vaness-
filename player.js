/* ============================== ABSOLUT PLAYER — CARRIÈRE DE JOUEUR·EUSE ============================== */
const PLAYER_POS=[{id:'G',name:"Gardien·ne",icon:'🧤'},{id:'D',name:"Défenseur·euse",icon:'🛡️'},{id:'M',name:"Milieu de terrain",icon:'🎯'},{id:'A',name:"Attaquant·e",icon:'⚽'}];
const PLAYER_ORIGINS=[
 {id:'centre',name:"Centre de formation d'élite",desc:"Formé·e dans une grande académie : technique soignée, agent déjà en place.",bonus:{technique:6,mental:2},gauges:{entourage:10}},
 {id:'quartier',name:"Terrain du quartier",desc:"Repéré·e tard sur un city-stade. Physique et mental d'acier, technique brute.",bonus:{physique:7,mental:5,technique:-3},gauges:{supporters:8,entourage:-5}},
 {id:'etranger',name:"Arrivé·e de l'étranger",desc:"Un pari d'un recruteur, une langue nouvelle, une famille loin.",bonus:{technique:4,physique:3,mental:-2},gauges:{vestiaire:-5},nat:'AF'},
 {id:'tardif',name:"Amateur jusqu'à 20 ans",desc:"Un boulot le jour, le foot le soir. Un mental hors norme, un corps à préparer.",bonus:{mental:8,physique:-2},age:20,gauges:{corps:-5}},
 {id:'fils',name:"Enfant d'ancien·ne pro",desc:"Le nom ouvre les portes, et les comparaisons commencent à 8 ans.",bonus:{technique:3,mental:-4},gauges:{entourage:12,supporters:-3}},
];
const PLAYER_TRAITS=[
 {id:'bosseur',name:"Bosseur·euse",desc:"Premier·ère arrivé·e, dernier·ère parti·e. Moins de fantaisie.",bonus:{physique:3,mental:2,technique:-2},growth:.2},{id:'genie',name:"Génie instinctif",desc:"Des gestes que personne n'apprend.",bonus:{technique:7,mental:-2},growth:0},{id:'leader',name:"Leader naturel",desc:"Le vestiaire t'écoute déjà à 18 ans. Tu parles plus que tu ne dribbles.",bonus:{mental:5,technique:-2},gauges:{vestiaire:10}},{id:'fragile',name:"Corps fragile",desc:"Talent immense, ischios en papier.",bonus:{technique:5,physique:-3},injury:.1},{id:'fetard',name:"Fêtard·e",desc:"La nuit, tu marques aussi beaucoup.",bonus:{technique:2,mental:-3},gauges:{supporters:5,entourage:-5},scandal:true},{id:'glace',name:"Sang froid",desc:"Un penalty à la 90e ne te fait rien. Le sprint de la 89e, si.",bonus:{mental:7,physique:-3}},
];
const PGAUGE={corps:{icon:'🩻',label:"Corps",help:"Santé : blessures, récupération, longévité. À zéro, la carrière s'arrête."},vestiaire:{icon:'✊',label:"Vestiaire",help:"Place dans le groupe : temps de jeu et soutien en cas de crise."},supporters:{icon:'📣',label:"Supporters",help:"Amour du public : pression et récompenses."},entourage:{icon:'👪',label:"Entourage",help:"Agent, famille, amis : qualité des offres et stabilité."}};
const PSTAT={technique:"Technique",physique:"Physique",mental:"Mental"};
const ROLES={titulaire:{name:"Titulaire",share:.9},rotation:{name:"Rotation",share:.55},remplacant:{name:"Remplaçant·e",share:.25}};

function playerFreshState(c){
  const st={technique:36,physique:36,mental:36}; [c.origin,c.trait].forEach(o=>Object.entries(o.bonus||{}).forEach(([k,v])=>st[k]=clamp(st[k]+v)));
  const g={corps:75,vestiaire:50,supporters:45,entourage:50}; [c.origin,c.trait].forEach(o=>Object.entries(o.gauges||{}).forEach(([k,v])=>g[k]=clamp(g[k]+v)));
  const nat=c.origin.nat==='AF'?pick(['SN','CI','ML','CM','DZ','MA']):'FR';
  return { kind:'player', name:c.name, year:c.era.start, startEra:c.era.id, age:c.origin.age||17, born:c.era.start-(c.origin.age||17), pos:c.pos.id, posName:c.pos.name, posIcon:c.pos.icon, nat, originName:c.origin.name, traitName:c.trait.name, traitId:c.trait.id, injuryMod:c.trait.injury||0, growth:1+(c.trait.growth||0), potential:randInt(78,96),
    stats:st, gauges:g, pressure:8, coachTrust:50, forme:70, injury:0, fitness:100, yellows:0, suspended:0, tempo:'temps_forts', skipped:[], sinceLast:[], alerts:[], lastStatus:null, club:null, squad:[], usedNames:[], comp:null, phase:0, matchday:0, match:null, phaseMatches:[], seasonStats:null, history:[], totals:{apps:0,goals:0,assists:0,titles:0,cups:0,euros:0,caps:0,capGoals:0,ballons:0,boots:0,earned:0}, clubs:[], selected:false, selectionBoost:0, bigOfferNext:false, log:[], pendingChoice:null, currentEvent:null, currentRoulette:null, pendingResult:null, currentOffers:[], newBadges:[], lastRouletteSeason:-99, rouletteCount:0, noOfferYears:0, consecutiveBad:0, ended:false, endingText:'', endingCause:null };
}
function pRating(){ const s=state.stats; const w=state.pos==='G'?{technique:.3,physique:.3,mental:.4}:state.pos==='D'?{technique:.3,physique:.4,mental:.3}:state.pos==='M'?{technique:.4,physique:.25,mental:.35}:{technique:.45,physique:.3,mental:.25}; return s.technique*w.technique+s.physique*w.physique+s.mental*w.mental; }
function pAge(){ return state.year-state.born; }
function pSnapshot(){ const s=state.stats,g=state.gauges; return {technique:s.technique,physique:s.physique,mental:s.mental,note:pRating(),coachTrust:state.coachTrust,forme:state.forme,pressure:state.pressure,corps:g.corps,vestiaire:g.vestiaire,supporters:g.supporters,entourage:g.entourage}; }
function playerApplyEffects(e,ctx={}){
  const s=state.stats,g=state.gauges,out=[];
  Object.entries(e||{}).forEach(([k,v])=>{
    if(k in s) s[k]=clamp(s[k]+v); else if(k in g) g[k]=clamp(g[k]+v);
    else if(k==='reputation') state.gauges.supporters=clamp(g.supporters+v*.5);
    else if(k==='coachTrust') state.coachTrust=clamp(state.coachTrust+v); else if(k==='pressure') state.pressure=clamp(state.pressure+v); else if(k==='forme') state.forme=clamp(state.forme+v);
    else if(k==='money'){ const amt=v*Math.max(.2,state.club?state.club.salary*2:.2); state.totals.earned+=amt; out.push(`${amt>=0?'+':''}${money(amt,state.year)}`); }
    else if(k==='injure'){ state.injury=Math.max(state.injury,v); out.push(`${v} semaines d'absence`); }
    else if(k==='minutes'){ state.minutesBonus=(state.minutesBonus||0)+v; }
    else if(k==='selectionBoost') state.selectionBoost+=v; else if(k==='bigOfferNext') state.bigOfferNext=true;
    else if(k==='penaltyRoll'){ if(Math.random()<.72){ out.push("Penalty transformé : héros du derby"); g.supporters=clamp(g.supporters+10); s.mental=clamp(s.mental+3); state.coachTrust=clamp(state.coachTrust+6); } else { out.push("Penalty manqué : le stade te siffle"); g.supporters=clamp(g.supporters-8); s.mental=clamp(s.mental-2); state.pressure=clamp(state.pressure+6); } }
  });
  return out;
}
/* ---------- Offres : autour du niveau que ton agent peut vendre ---------- */
/* Niveau de club visé : ta note, ta dernière saison, la sélection, l'âge */
function playerTargetStrength(){
  const r=pRating(); const last=state.history[state.history.length-1]; let t=r+2;
  if(last){ if(last.note>=7) t+=3; else if(last.note<5.8) t-=3; if(last.share<.3) t-=2; if(last.champion) t+=1; if(last.ballon) t+=4; }
  if(state.selected) t+=2; if(pAge()>=32) t-=3; if(pAge()<=19) t-=2;
  return t;
}
function playerTiers(){ const t=['amateur','ligue2','ligue1']; if(state.gauges.entourage>=45) t.push('etranger'); t.push('europe'); if(state.selected||state.gauges.supporters>=60||pRating()>=76) t.push('superclub'); return t; }
function playerBuildOffer(tier,forced){
  const o=buildCoachOffer(tier,forced); const r=pRating();
  const gap=r-o.strength; const role=gap>=4?'titulaire':gap>=-4?pick(['titulaire','rotation']):gap>=-10?pick(['rotation','remplacant']):'remplacant';
  const salary=Math.max(.005,playerWage(playerMe(),state.year,o.tier)*(role==='titulaire'?1:role==='rotation'?.8:.6)*rand(.9,1.15));
  o.role=role; o.salary=salary; o.duration=randInt(1,3);
  const coaches=COACHES_BY_ERA[eraForYear(state.year).id]; o.coach=Math.random()<.35?pick(coaches).name:fakeName(o.nat==='FR'?'FR':(FAKE_FIRST[o.nat]?o.nat:'FR'));
  return o;
}
function playerGenerateOffers(opts={}){
  const offers=[]; const c=state.club; const target=playerTargetStrength(); const last=state.history[state.history.length-1];
  const clubKeeps=!!(c&&state.coachTrust>=30&&state.consecutiveBad<2); const underContract=!!(c&&c.contractEnd>state.year&&!opts.broke);
  if(c&&clubKeeps&&!opts.noStay){ const o=playerBuildOffer(c.tier,{name:c.name,nat:c.nat,league:c.league,s:c.s}); o.stay=true; o.coach=c.coach; o.underContract=underContract; if(underContract){ o.role=c.role; o.salary=c.salary; o.duration=c.contractEnd-state.year; } else { o.salary=Math.max(o.salary,c.salary*rand(1,1.3)); } o.gap=o.strength-target; offers.push(o); }
  const tiers=playerTiers(); const pool=[]; let tries=0;
  while(pool.length<18&&tries<50){ tries++; const o=playerBuildOffer(pick(tiers)); if((c&&o.club===c.name)||pool.some(x=>x.club===o.club)) continue; o.gap=o.strength-target; pool.push(o); }
  if(underContract&&clubKeeps){
    // Sous contrat : un club plus ambitieux peut venir te chercher, surtout après une grosse saison
    const pr=clamp(.1+(last&&last.note>=7?.35:0)+(last&&last.goals>=15?.15:0)+(state.bigOfferNext?.4:0),.05,.75); let count=Math.random()<pr?1:0; if(count&&Math.random()<.35) count++;
    pool.filter(o=>o.gap>=-1&&o.gap<=7&&o.role!=='remplacant').sort((a,b)=>b.strength-a.strength).slice(0,count).forEach(o=>{ o.poach=true; offers.push(o); });
  } else {
    let count=2+(state.history.length>=2?1:0)+(state.gauges.entourage>=60?1:0)+(state.bigOfferNext?1:0); count=Math.min(4,count);
    if(pAge()>=33&&pRating()<60) count--; if(pAge()>=35&&pRating()<66) count--;
    let fit=pool.filter(o=>o.gap>=-8&&o.gap<=5); if(fit.length<2) fit=pool.filter(o=>o.gap>=-12&&o.gap<=8); if(fit.length<2) fit=[...pool].sort((a,b)=>Math.abs(a.gap)-Math.abs(b.gap)).slice(0,count+1);
    const picked=[]; if(state.bigOfferNext){ const big=fit.filter(o=>o.gap>=2).sort((a,b)=>b.strength-a.strength)[0]; if(big) picked.push(big); }
    shuffledCopy(fit.filter(o=>!picked.includes(o))).forEach(o=>{ if(picked.length<count) picked.push(o); });
    picked.forEach(o=>offers.push(o));
  }
  state.bigOfferNext=false; return offers;
}
/* Demander son transfert en cours de contrat : le public et l'entourage n'aiment pas ça */
function playerBreakContract(){
  const c=state.club; if(!c) return;
  state.gauges.supporters=clamp(state.gauges.supporters-6); state.gauges.entourage=clamp(state.gauges.entourage-3);
  log(`✂️ Tu demandes ton transfert de ${c.name}. Les supporters s'en souviendront.`);
  state.currentOffers=playerGenerateOffers({broke:true,noStay:true}); if(!state.currentOffers.length) state.noOfferYears++; saveGame(); render();
}
function playerOpenOffers(){ state.currentOffers=playerGenerateOffers(); state.noOfferYears=state.currentOffers.length?0:state.noOfferYears+1; state.pendingChoice='offers'; playerCheckEnd(); saveGame(); }
function playerAcceptOffer(i){
  const o=state.currentOffers[i]; if(!o) return;
  if(o.stay){ state.club.salary=o.salary; state.club.role=o.role; state.club.since++; if(!o.underContract) state.club.contractEnd=state.year+o.duration; }
  else {
    const used=new Set(state.usedNames); const squad=generateSquad(o,state.year,used); squad.forEach(p=>{ if(p.real&&!state.usedNames.includes(p.name)) state.usedNames.push(p.name); });
    state.squad=squad; state.club={name:o.club,tier:o.tier,nat:o.nat,league:o.league,s:o.s,strength:o.strength,leagueName:o.leagueName,coach:o.coach,role:o.role,salary:o.salary,since:1,contractEnd:state.year+o.duration};
    state.coachTrust=o.role==='titulaire'?62:o.role==='rotation'?50:40; state.gauges.vestiaire=clamp(state.gauges.vestiaire*.6+25); state.gauges.supporters=clamp(state.gauges.supporters*.5+22);
    if(!state.clubs.includes(o.club)) state.clubs.push(o.club); if(o.tier==='superclub') unlockTrophy('p-superclub');
  }
  state.currentOffers=[]; log(`🖊️ ${o.stay?(o.underContract?'Tu poursuis à':'Tu prolonges à'):o.poach?'Transfert ! Tu signes à':'Tu signes à'} <b>${o.club}</b> (${o.leagueName}) : ${ROLES[o.role].name.toLowerCase()} promis·e, ${money(o.salary,state.year)} par saison, coach ${o.coach}${o.stay&&o.underContract?'':`, jusqu'en ${state.club.contractEnd}`}.`);
  playerStartSeason();
}
/* ---------- Saison ---------- */
function playerMe(){ const corps=state.gauges.corps; return {id:'me',name:state.name,pos:state.pos,born:state.born,peak:pRating()/ageCurve(pAge()),dev:1,morale:70,form:0,injury:state.injury,real:true,isMe:true,trait:state.traitId==='leader'?'leader':state.traitId==='fetard'?'fetard':state.traitId==='fragile'?'fragile':'pro',traitId:state.traitId,fitness:state.fitness==null?100:state.fitness,yellows:state.yellows||0,suspended:state.suspended||0,injuryMod:(state.injuryMod||0)*.2+Math.max(0,50-corps)*.0004+(pAge()>=31?.006:0),selBonus:playerSelBonus()}; }
/* Ce que le coach ajoute (ou retire) à ta note quand il compose : confiance, rôle promis, forme, jeunesse */
function playerSelBonus(){ const c=state.club; return (state.coachTrust-50)*.12+(c&&c.role==='titulaire'?6:c&&c.role==='rotation'?2.5:0)+(state.forme-60)*.05+(state.minutesBonus||0)*10+(pAge()<=18?-1:0); }
function playerFullSquad(){ return [...state.squad.filter(p=>!p.isMe),playerMe()]; }
function playerSquadMap(){ return Object.fromEntries(playerFullSquad().map(p=>[p.id,p])); }
function playerSyncMe(me){ state.injury=me.injury; state.fitness=me.fitness; state.yellows=me.yellows||0; state.suspended=me.suspended||0; }
function playerClubStrength(){
  const me=playerMe(); const full=[...state.squad.filter(p=>!p.isMe),me]; const f=FORMATIONS['4-4-2'];
  const rating=playerRating(me,state.year);
  const share=playerShare(); const xi=bestXI(full,f,state.year);
  const inXI=xi.some(p=>p.isMe);
  const base=teamStrength(full,f,state.year,{bonus:(state.gauges.vestiaire-50)*.03});
  return base+(inXI?0:-(rating-state.club.strength)*.15*share)+rand(-1,1);
}
function playerShare(){
  const r=pRating(); const rivals=state.squad.filter(p=>p.pos===state.pos&&!p.injury).map(p=>playerRating(p,state.year)).sort((a,b)=>b-a);
  const slots=state.pos==='G'?1:state.pos==='A'?2:4; const nth=rivals[slots-1]||0; const gap=r-nth;
  let share=clamp(.5+gap*.05+(state.coachTrust-50)*.006+(state.forme-60)*.003+(state.minutesBonus||0),0,1);
  if(pAge()<=18) share=Math.min(share,.6); if(state.injury>0) share*=clamp(1-state.injury/20,0,1);
  return share;
}
function playerStartSeason(){
  const c=state.club; const lg=buildLeagueTeams(c,state.year); c.leagueName=lg.name;
  state.comp=createCompetition(lg,c.name,state.year); state.phase=0; state.matchday=0; state.match=null; state.seasonStats={apps:0,goals:0,assists:0,notes:[],phases:[],shares:[],starts:0,motm:0}; state.minutesBonus=0;
  if(!c.formation) c.formation=pick(Object.keys(FORMATIONS)); if(!c.styleId) c.styleId=pick(eraStylePool(state.year)).id;
  state.fitness=100; state.yellows=0; state.suspended=0; state.squad.forEach(p=>{ p.apps=0; p.goals=0; p.assists=0; p.sumRating=0; p.rated=0; p.yellows=0; p.suspended=0; p.fitness=100; });
  log(`📅 Saison ${state.year}-${state.year+1} avec ${c.name} en ${c.leagueName}.`);
  playerPlayPhase();
}
function playerPlayPhase(){
  const chance=.6; if(Math.random()<chance){ const y=state.year, low=Object.keys(state.gauges).filter(k=>state.gauges[k]<35); const pool=PLAYER_INCIDENTS.filter(e=>(!e.minYear||y>=e.minYear)&&(!e.maxYear||y<=e.maxYear)&&(!e.gauge||low.includes(e.gauge)||Math.random()<.35)); state.currentEvent={kind:'incident',event:pickNoRepeat('p-incidents',pool)}; state.pendingChoice='event'; saveGame(); return; }
  playerSimulatePhase();
}
function playerChooseEvent(i){
  const ce=state.currentEvent, ev=ce.event, ch=ev.choices[i]; if(!ch) return;
  const before=pSnapshot(); const extra=playerApplyEffects(ch.effects);
  log(`${ev.icon} <b>${ev.title}</b> → ${ch.label}. ${ch.result||''}`);
  state.pendingResult={title:`${ev.icon} ${ev.title}`,subtitle:ch.label,narrative:ch.result||'',before,after:pSnapshot(),extra,next:ce.kind==='incident'?'phase':'intersaison'}; state.currentEvent=null; state.pendingChoice='choiceResult'; saveGame(); render();
}
function playerContinueChoiceResult(){ const r=state.pendingResult; state.pendingResult=null; state.pendingChoice=null; if(state.ended){ render(); return; } if(r.next==='phase'){ playerSimulatePhase(); render(); return; } if(r.next==='offers'){ playerOpenOffers(); render(); return; } playerIntersaison(); render(); }
/* ---------- Une phase = des journées jouées une par une ---------- */
function playerSimulatePhase(){ playerBeginPhase(); }
function playerBeginPhase(){
  const comp=state.comp; state.matchday=state.phase===0?0:comp.phaseEnds[state.phase-1]; state.phaseMatches=[];
  if(state.phase>0){ state.fitness=clamp((state.fitness==null?100:state.fitness)+10,0,100); state.squad.forEach(p=>{ p.fitness=clamp(fit(p)+10,0,100); }); }
  playerNextMatch();
}
/* Le coach compose : ta place dépend de ta note, de sa confiance, du rôle promis et de ta fraîcheur */
function playerBuildMatch(fx){
  const comp=state.comp, c=state.club, year=state.year, full=playerFullSquad(), f=FORMATIONS[c.formation]||FORMATIONS['4-4-2'];
  const a=autoLineup(full,f,year,{scoreBonus:p=>p.isMe?p.selBonus:0});
  const me=full.find(p=>p.isMe);
  // Le rôle promis à la signature est tenu au moins un temps : un·e titulaire promis·e démarre les huit premières journées, un·e joueur·euse de rotation est au moins dans le groupe
  if(availableForMatch(me)&&!a.xi.includes(me)){
    if(c.role==='titulaire'&&state.matchday<8&&state.coachTrust>=35){ const same=a.xi.filter(p=>p.pos===me.pos).sort((x,y)=>effRating(x,year)-effRating(y,year)); const out=same[0]||a.xi[a.xi.length-1]; a.xi=a.xi.map(p=>p===out?me:p); a.bench=a.bench.filter(p=>p!==me); if(!a.bench.includes(out)&&a.bench.length<benchSize(year)) a.bench.push(out); }
    else if(c.role!=='remplacant'&&state.coachTrust>=35&&!a.bench.includes(me)&&benchSize(year)>0){ const field=a.bench.filter(p=>p.pos!=='G'); if(a.bench.length>=benchSize(year)&&field.length) a.bench=a.bench.filter(p=>p!==field[field.length-1]); a.bench.push(me); }
  }
  const captain=defaultCaptain(a.xi);
  state.match=newMatch({year,home:fx.isHome,usName:c.name,themName:fx.opp,themStrength:comp.strength[fx.opp]+rand(-1.5,1.5),themStyle:oppStyle(comp,fx.opp,year),themNat:comp.nat,ourStyle:c.styleId,xi:a.xi,bench:a.bench,captain,approach:'equilibre',formation:c.formation,matchday:state.matchday,label:`Journée ${state.matchday+1}`,bonus:(state.gauges.vestiaire-50)*.03+rand(-1,1),decider:'me'});
  state.match.myStatus=a.xi.includes(me)?'xi':a.bench.includes(me)?'bench':me.injury>0?'injured':me.suspended>0?'suspended':'out';
}
/* Pourquoi ce match mérite un arrêt (selon le rythme choisi) ; null = joué en coulisses */
function playerStopReasons(m){
  const comp=state.comp, c=state.club, tempo=TEMPOS[state.tempo]?state.tempo:'temps_forts'; const start=state.phase===0?0:comp.phaseEnds[state.phase-1]; const why=[];
  if(state.matchday===start) why.push(state.phase===0?"Première journée de la saison":"Reprise après la trêve");
  if(tempo==='rapide') return why.length?why:null;
  if(tempo==='complet') return why.length?why:["Rythme complet"];
  const inGroup=m.myStatus==='xi'||m.myStatus==='bench';
  if(inGroup&&state.matchday-start>=2){ const N=comp.teams.length, my=tablePos(comp.table,c.name), op=tablePos(comp.table,m.themName);
    if(op<=3&&my<=3) why.push("Sommet du championnat"); else if(op<=3) why.push(`Choc contre le ${ordinal(op)}`); else if(Math.abs(op-my)<=2) why.push("Concurrent direct au classement");
    if(my>=N-4&&op>=N-4) why.push("Match de la peur"); }
  if(state.matchday===comp.phaseEnds[state.phase]-1&&state.phase===3&&inGroup) why.push("Dernière journée de la saison");
  (state.alerts||[]).forEach(a=>why.push(a));
  return why.length?why:null;
}
/* Ce qui a changé pour toi après un match joué en coulisses */
function playerAlertsAfter(rec){
  const a=[]; const prev=state.lastStatus; const st=rec.status;
  if(rec.inj) a.push(`🩼 Blessé·e : ${state.injury} semaine${state.injury>1?'s':''}`);
  if(rec.red) a.push("🟥 Expulsé·e : suspension");
  if(prev==='xi'&&(st==='bench'||st==='out')) a.push("🪑 Tu as perdu ta place de titulaire");
  if((prev==='bench'||prev==='out')&&st==='xi') a.push("✅ Tu retrouves une place de titulaire");
  if(rec.played&&rec.note>=8) a.push("🔥 Un match énorme : la presse en parle");
  state.lastStatus=st; return a;
}
/* Avance dans le calendrier : s'arrête sur un temps fort ou un penalty, sinon joue en coulisses */
function playerAdvance(){
  const comp=state.comp, c=state.club; let guard=0;
  while(guard++<80){
    if(state.matchday>=comp.phaseEnds[state.phase]){ playerFinishPhase(); return; }
    const fx=ourFixture(comp,state.matchday,c.name);
    if(!fx){ playOthers(comp,state.matchday,c.name); state.matchday++; continue; }
    playerBuildMatch(fx); const why=playerStopReasons(state.match);
    if(why){ state.match.why=why; state.sinceLast=state.skipped||[]; state.skipped=[]; state.alerts=[]; state.pendingChoice='prematch'; saveGame(); return; }
    playerKickoff(false);
    if(state.pendingChoice==='penalty'){ state.match.why=["🎯 Penalty : à toi de décider"]; state.sinceLast=state.skipped||[]; state.skipped=[]; state.alerts=[]; saveGame(); return; }
    const rec=state.lastMatch; (state.skipped=state.skipped||[]).push({home:rec.home,away:rec.away,gh:rec.gh,ga:rec.ga,us:rec.us,res:rec.res,story:rec.story,matchday:rec.matchday,mine:rec.played?`${rec.min}' · note ${rec.note.toFixed(1)}${rec.goals?' · ⚽'+rec.goals:''}${rec.assists?' · 🅰️'+rec.assists:''}`:rec.status==='bench'?'banc':'absent·e'});
    state.alerts=playerAlertsAfter(rec);
    playerWeekPasses();
  }
}
function playerNextMatch(){ playerAdvance(); }
function playerKickoff(auto=false){
  const m=state.match; if(!m||m.done) return; const P=playerSquadMap(); const ctx={injuryMult:1};
  let guard=0;
  while(!m.done&&guard++<8){
    matchPlayHalf(m,P,ctx);
    if(m.pending&&m.pending.type==='penalty'){ if(auto){ playerResolvePenalty(m,P,state.stats.mental>=55); continue; } playerSyncMe(P.me); state.pendingChoice='penalty'; saveGame(); return; }
    if(m.half===1&&!m.done){ matchApplyHalftime(m,P,'keep',{}); }
  }
  playerAfterMatchSim(P);
}
function playerPenaltyChance(){ return clamp(.6+(state.stats.mental-50)*.005+(state.traitId==='glace'?.14:0)+(state.gauges.supporters-50)*.001,.3,.93); }
function playerResolvePenalty(m,P,takeIt){
  const r=matchResolvePenalty(m,P,takeIt,playerPenaltyChance()); if(!r) return;
  const g=state.gauges, s=state.stats;
  if(r.mine){ if(r.ok){ g.supporters=clamp(g.supporters+3); s.mental=clamp(s.mental+1); state.coachTrust=clamp(state.coachTrust+3); m.penNote="Tu l'as mis. Le stade hurle ton nom."; } else { g.supporters=clamp(g.supporters-4); s.mental=clamp(s.mental-1); state.pressure=clamp(state.pressure+4); state.coachTrust=clamp(state.coachTrust-2); m.penNote="Raté. Le silence du stade te suit jusqu'au vestiaire."; } }
  else m.penNote=`Tu laisses ${r.taker.name} tirer : ${r.ok?'transformé':'manqué'}.`;
  return r;
}
function playerPenaltyChoice(takeIt){
  const m=state.match; if(!m||!m.pending) return; const P=playerSquadMap();
  playerResolvePenalty(m,P,takeIt); log(`🎯 Penalty : ${m.penNote}`);
  state.pendingChoice='prematch'; playerKickoff(false); render();
}
function playerAfterMatchSim(P){
  const m=state.match, comp=state.comp, c=state.club, ss=state.seasonStats; const me=P.me;
  const ha=matchHomeAway(m); recordResult(comp,ha.home,ha.away,ha.gh,ha.ga); playOthers(comp,state.matchday,c.name);
  matchApplyToSquad(m,P,state.year); serveSuspensions(playerFullSquad().map(p=>p.isMe?me:p),m); playerSyncMe(me);
  const s=m.played.me; const played=!!(s&&s.min); const note=played?m.ratings.me:null; const res=matchResult(m);
  let dTrust=0;
  if(played){ ss.apps++; ss.goals+=s.goals; ss.assists+=s.assists; ss.notes.push(note); ss.shares.push(s.start?1:.4); if(s.start) ss.starts++; if(m.motm==='me') ss.motm++;
    state.totals.apps++; state.totals.goals+=s.goals; state.totals.assists+=s.assists;
    dTrust=clamp((note-6.2)*2.5,-4,4); state.forme=clamp(state.forme-.9+(note>=7?1.5:0)); state.gauges.corps=clamp(state.gauges.corps-.4*(s.min/90)-(pAge()>=30?.3:0));
    if(s.goals>=2) state.gauges.supporters=clamp(state.gauges.supporters+2); if(note>=7.5) state.gauges.supporters=clamp(state.gauges.supporters+1); if(note<5.5) state.gauges.supporters=clamp(state.gauges.supporters-1);
    if(s.inj){ state.gauges.corps=clamp(state.gauges.corps-s.inj*.6); } }
  else { ss.shares.push(0); if(m.myStatus==='bench'){ dTrust=-.6; state.forme=clamp(state.forme+1); } state.gauges.vestiaire=clamp(state.gauges.vestiaire-(m.myStatus==='out'?.3:0)); }
  state.coachTrust=clamp(state.coachTrust+dTrust+(res==='W'?.3:res==='L'?-.3:0));
  const rec={home:ha.home,away:ha.away,gh:ha.gh,ga:ha.ga,us:m.home?'home':'away',res,matchday:m.matchday,ht:m.ht,story:m.story,scorers:matchScorersText(m,P),events:m.events,ratings:m.ratings,motm:m.motm,xi:m.xi,bench:m.bench,played,start:!!(s&&s.start),min:s?s.min:0,goals:s?s.goals:0,assists:s?s.assists:0,yellow:s?s.yellow:0,red:s?s.red:0,inj:s?s.inj:0,note,dTrust:Math.round(dTrust*10)/10,status:m.myStatus,penNote:m.penNote||'',pos:tablePos(comp.table,c.name),themStrength:Math.round(m.themStrength),themStyle:m.themStyle};
  state.phaseMatches.push(rec); state.lastMatch=rec; state.matchday++;
  log(`${res==='W'?'✅':res==='L'?'❌':'➖'} J${m.matchday+1} : ${ha.home} ${ha.gh}–${ha.ga} ${ha.away}. ${played?`Toi : ${s.min} min, note ${note.toFixed(1)}${s.goals?', '+s.goals+' but'+(s.goals>1?'s':''):''}${s.assists?', '+s.assists+' passe'+(s.assists>1?'s':''):''}.`:m.myStatus==='bench'?'Tu restes sur le banc.':m.myStatus==='injured'?'Blessé·e, tu regardes depuis la tribune.':m.myStatus==='suspended'?'Suspendu·e.':'Pas dans le groupe.'}`);
  state.pendingChoice='matchResult'; saveGame();
}
function playerWeekPasses(){ const me=playerMe(); recoverSquad([...state.squad,me],state.year,{training:'tactique',staff:50}); playerSyncMe(me); }
function playerAfterMatch(){ if(state.lastMatch) state.alerts=playerAlertsAfter(state.lastMatch); playerWeekPasses(); playerAdvance(); render(); }
function playerSimPhase(){
  let guard=0; const keep=state.tempo; state.tempo='rapide'; state.alerts=[];
  while((state.pendingChoice==='prematch'||state.pendingChoice==='matchResult')&&guard++<60){
    if(state.pendingChoice==='prematch'){ if(!state.match||state.match.done) break; playerKickoff(true); }
    else { const rec=state.lastMatch; (state.skipped=state.skipped||[]).push({home:rec.home,away:rec.away,gh:rec.gh,ga:rec.ga,us:rec.us,res:rec.res,story:rec.story,matchday:rec.matchday,mine:rec.played?`${rec.min}' · note ${rec.note.toFixed(1)}`:rec.status==='bench'?'banc':'absent·e'}); state.lastStatus=rec.status; playerWeekPasses(); playerAdvance(); }
  }
  state.tempo=keep; render();
}
function playerFinishPhase(){
  const c=state.club, comp=state.comp, ss=state.seasonStats; const mine=state.phaseMatches||[];
  const played=mine.filter(m=>m.played); const apps=played.length, goals=played.reduce((n,m)=>n+m.goals,0), assists=played.reduce((n,m)=>n+m.assists,0);
  const note=apps?played.reduce((n,m)=>n+m.note,0)/apps:null; const share=mine.length?mine.reduce((n,m)=>n+(m.start?1:m.played?.4:0),0)/mine.length:0;
  const dTrust=mine.reduce((n,m)=>n+m.dTrust,0);
  state.pressure=clamp(state.pressure+(note!=null&&note<5.8?5:-2)+(c.tier==='superclub'?3:0)+(state.gauges.supporters<35?2:0)-2+(share<.3?3:0));
  state.gauges.vestiaire=clamp(state.gauges.vestiaire+(share>=.5?1:-1)+(state.traitId==='leader'?1:0));
  state.gauges.corps=clamp(state.gauges.corps+2); state.forme=clamp(state.forme+4);
  state.totals.earned+=c.salary/4;
  const pos=tablePos(comp.table,c.name);
  const injury=mine.find(m=>m.inj)?`${state.injury} semaine${state.injury>1?'s':''} d'absence`:null;
  const rec={n:state.phase+1,matches:mine.map(m=>({home:m.home,away:m.away,gh:m.gh,ga:m.ga,us:m.us,res:m.res,mine:m.played?`${m.min}' · note ${m.note.toFixed(1)}${m.goals?' · ⚽'+m.goals:''}${m.assists?' · 🅰️'+m.assists:''}`:m.status==='bench'?'banc':'absent·e'})),apps,goals,assists,note:note==null?0:note,share,pos,dTrust:Math.round(dTrust),injury,table:sortTable(comp.table).map(t=>({...t})),motm:played.filter(m=>m.motm==='me').length};
  ss.phases.push(rec); state.lastPhase=rec; state.match=null; state.skipped=[]; state.sinceLast=[]; state.alerts=[];
  log(`📊 Phase ${state.phase+1} : ${apps} matchs, ${goals} but${goals>1?'s':''}, ${assists} passe${assists>1?'s':''}${note!=null?', note '+note.toFixed(1):''}. ${c.name} ${ordinal(pos)}.`);
  state.phase++; state.pendingChoice='phaseResult'; saveGame();
}
function playerAfterPhase(){
  if(state.gauges.corps<=0){ unlockTrophy('p-injury'); playerEnd(`Ton corps ne suit plus : une blessure de trop met fin à ta carrière à ${pAge()} ans.`,'injury'); render(); return; }
  if(state.phase>=4){ playerEndSeason(); render(); return; }
  if(state.pressure>=100){ state.pendingChoice='pressureCrisis'; render(); return; }
  playerPlayPhase(); render();
}
function playerEndSeason(){
  const c=state.club, comp=state.comp, ss=state.seasonStats, year=state.year;
  const table=sortTable(comp.table), pos=tablePos(comp.table,c.name), N=comp.teams.length;
  const champion=pos===1, relegated=pos>N-3;
  const cup=simCup(5,playerClubStrength,shuffledCopy(comp.teams.filter(n=>n!==c.name)).slice(0,5).map(n=>({name:n,strength:comp.strength[n]})));
  let euro=null; if(c.euroQualified){ const dk=decadeKey(year); euro=simCup(5,playerClubStrength,shuffledCopy(EU_CLUBS.filter(x=>x.s[dk]>=3&&x.n!==c.name)).slice(0,5).map(x=>({name:x.n,strength:tierBaseStrength('europe',x.s[dk])}))); euro.name=eraForYear(year).euroCup; }
  c.euroQualified=(c.tier==='ligue1'||c.tier==='europe'||c.tier==='superclub')&&pos<=3;
  const avgNote=ss.notes.length?ss.notes.reduce((n,x)=>n+x,0)/ss.notes.length:5.5, avgShare=ss.shares.reduce((n,x)=>n+x,0)/Math.max(1,ss.shares.length);
  const r=pRating();
  // sélection nationale
  const selChance=clamp((r-62)/40+(avgNote-6.3)*.3+state.selectionBoost*.01+(c.tier==='superclub'||c.tier==='europe'?.15:0),0,.9);
  const selected=pAge()>=18&&pAge()<=34&&avgShare>=.4&&Math.random()<selChance; let caps=0,capGoals=0;
  if(selected){ caps=randInt(2,10); capGoals=state.pos==='A'?poisson(caps*.5):state.pos==='M'?poisson(caps*.2):poisson(caps*.05); state.totals.caps+=caps; state.totals.capGoals+=capGoals; if(!state.selected){ state.selected=true; unlockTrophy('p-selection'); } }
  const ballon=(c.tier==='superclub'||c.tier==='europe'||c.tier==='ligue1')&&avgNote>=7.2&&r>=80&&avgShare>=.6&&(champion||(euro&&euro.won)||ss.goals>=25)&&Math.random()<.55;
  const boot=state.pos==='A'&&ss.goals>=22&&(c.tier==='ligue1'||c.tier==='europe'||c.tier==='superclub');
  if(ballon){ state.totals.ballons++; unlockTrophy('p-ballon'); } if(boot){ state.totals.boots++; unlockTrophy('p-golden-boot'); }
  if(champion){ state.totals.titles++; unlockTrophy('p-title'); } if(cup.won) state.totals.cups++; if(euro&&euro.won){ state.totals.euros++; unlockTrophy('p-euro'); }
  if(state.totals.goals>=100) unlockTrophy('p-100'); if(state.totals.apps>=500) unlockTrophy('p-500'); if(avgShare<.2) unlockTrophy('p-bench'); if(state.history.length===0) unlockTrophy('p-first');
  const bad=pAge()>20&&((ss.notes.length>=5&&avgNote<5.7)||avgShare<.15); state.consecutiveBad=bad?state.consecutiveBad+1:0;
  // développement : progression forte jeune, déclin après 31
  const age=pAge(); const growth=(age<=21?3.2:age<=25?1.8:age<=29?.6:age<=31?-.2:-1.6)*state.growth*(avgShare>=.5?1.1:avgShare>=.2?.85:.7)*(state.potential>r?1:.3);
  const s=state.stats; s.technique=clamp(s.technique+growth*(state.pos==='G'?.8:1)+(age>=32?-.5:0)); s.physique=clamp(s.physique+growth+(age>=30?-1.5:0)+(state.gauges.corps-50)*.02); s.mental=clamp(s.mental+Math.abs(growth)*.6+(selected?1:0)+(champion?1:0));
  state.gauges.corps=clamp(state.gauges.corps+8-(age>=32?4:0)); state.forme=clamp(state.forme+12); state.pressure=clamp(state.pressure-6);
  state.gauges.supporters=clamp(state.gauges.supporters+(champion?8:0)+(bad?-5:2)); state.gauges.entourage=clamp(state.gauges.entourage+(selected?3:0)+(bad?-2:1));
  const season={year,club:c.name,league:c.leagueName,tier:c.tier,role:c.role,pos,teams:N,champion,relegated,cupWon:cup.won,cupRounds:cup.roundsReached,euro:euro?{name:euro.name,won:euro.won,rounds:euro.roundsReached}:null,apps:ss.apps,goals:ss.goals,assists:ss.assists,note:avgNote,share:avgShare,selected,caps,capGoals,ballon,boot,bad,salary:c.salary,table:table.map(t=>({...t})),age};
  state.history.push(season); state.lastSeason=season;
  // développement des coéquipiers et contrats
  developSquad(state.squad,year,{minutes:null,formation:50,staff:50,vestiaire:state.gauges.vestiaire});
  state.squad=state.squad.filter(p=>playerAge(p,year+1)<36||Math.random()<.5);
  if(c.since>=8) unlockTrophy('p-legend');
  const eraBefore=eraForYear(year).id; state.year++; state.age++; if(eraForYear(state.year).id!==eraBefore){ unlockTrophy('p-era-cross'); log(`⏳ Nouvelle époque : <b>${eraForYear(state.year).name}</b>.`); }
  state.comp=null; state.match=null;
  log(`🏁 Saison terminée : ${ss.apps} matchs, ${ss.goals} buts, ${ss.assists} passes, note ${avgNote.toFixed(2)}. ${c.name} ${ordinal(pos)}${champion?' 🏆':''}${cup.won?' 🥇':''}${euro&&euro.won?' ⭐':''}${selected?` · 🇫🇷 ${caps} sélections`:''}${ballon?' · 🏅 Ballon d\'or':''}.`);
  state.pendingChoice='seasonEnd'; saveGame();
}
function playerAfterSeasonEnd(){ playerIntersaison(); render(); }
function playerIntersaison(){
  if(playerCheckEnd()){ render(); return; }
  const n=state.history.length;
  if(n>=3&&n-state.lastRouletteSeason>=5&&state.rouletteCount<2&&Math.random()<.12){ state.currentRoulette={event:pickNoRepeat('p-roulette',PLAYER_ROULETTES),outcomes:shuffledCopy([Math.random()<.5?'end':'malus','jackpot','small','malus'])}; state.rouletteCount++; state.lastRouletteSeason=n; state.pendingChoice='roulette'; return; }
  const g=state.gauges; const low=Object.keys(g).filter(k=>g[k]<40);
  if(low.length&&Math.random()<.5){ const pool=PLAYER_DILEMMAS.filter(d=>low.includes(d.gauge)); if(pool.length){ state.currentEvent={kind:'dilemma',event:pick(pool)}; state.pendingChoice='event'; return; } }
  if(Math.random()<.5){ const pool=PLAYER_HAPPENINGS.filter(e=>(!e.minYear||state.year>=e.minYear)&&(!e.maxYear||state.year<=e.maxYear)); state.currentEvent={kind:'happening',event:pickNoRepeat('p-happenings',pool)}; state.pendingChoice='event'; return; }
  playerOpenOffers();
}
function playerChooseRoulette(i){
  const r=state.currentRoulette, ev=r.event, out=r.outcomes[i];
  if(out==='end'){ unlockTrophy('r-death'); state.currentRoulette=null; playerEnd(`${ev.icon} ${ev.endText}`,'roulette'); render(); return; }
  const before=pSnapshot(); let e,narrative;
  if(out==='jackpot'){ e={technique:8,physique:8,mental:8,forme:20,pressure:-25,corps:15,vestiaire:15,supporters:15,entourage:15,coachTrust:25,money:1.5}; narrative=ev.jackpotText; unlockTrophy('r-jackpot'); }
  else if(out==='malus'){ e={mental:-4,forme:-10,pressure:12,corps:-10,supporters:-8,entourage:-6,coachTrust:-12,money:-.5}; narrative="Un revers sérieux : le corps, le moral et ta place dans le groupe encaissent."; unlockTrophy('r-malus'); }
  else { e={mental:3,forme:5,pressure:-5,vestiaire:4,coachTrust:5}; narrative="Un petit coup de pouce du destin."; unlockTrophy('r-small'); }
  const extra=playerApplyEffects(e); log(`${ev.icon} <b>${ev.title}</b> → ${ev.choices[i]}. ${narrative}`);
  state.pendingResult={title:`${ev.icon} ${ev.title}`,subtitle:ev.choices[i],narrative,before,after:pSnapshot(),extra,next:'offers'}; state.currentRoulette=null; state.pendingChoice='choiceResult'; render();
}
const PLAYER_PRESSURE_CHOICES=[
 {id:'pause',icon:'🛌',label:"Six mois loin des terrains",sub:"Burn-out assumé. Le corps et la tête se réparent, le coach t'oublie un peu.",effects:{pressure:-60,forme:20,corps:10,coachTrust:-15,minutes:-.2}},
 {id:'psy',icon:'🧘',label:"Suivi psychologique intensif",sub:"Tu continues à jouer avec un accompagnement quotidien.",effects:{pressure:-30,mental:3,money:-.1}},
 {id:'push',icon:'💀',label:"Serrer les dents",sub:"Tu joues quand même. 25 % de risque d'effondrement physique (fin de carrière).",deathChance:.25,effects:{pressure:-15,corps:-15,mental:-4}},
];
function playerChoosePressure(i){
  const ch=PLAYER_PRESSURE_CHOICES[i]; if(!ch) return;
  if(ch.deathChance&&Math.random()<ch.deathChance){ unlockTrophy('p-injury'); playerEnd("Tu as serré les dents une fois de trop : ton corps s'effondre en plein match. La carrière s'arrête là.",'injury'); render(); return; }
  const before=pSnapshot(); playerApplyEffects(ch.effects);
  const inSeason=!!state.comp&&state.phase<4;
  state.pendingResult={title:'🌡️ Craquage',subtitle:ch.label,narrative:ch.sub,before,after:pSnapshot(),extra:[],next:inSeason?'phase':'offers'}; state.pendingChoice='choiceResult'; render();
}
function playerSkipYear(){ state.year++; state.age++; state.forme=clamp(state.forme+10); state.gauges.corps=clamp(state.gauges.corps+8); state.gauges.supporters=clamp(state.gauges.supporters-5); state.pressure=clamp(state.pressure-15); state.club=null; state.squad=[]; log(`🛋️ Une année sans club.`); if(playerCheckEnd()){ render(); return; } playerOpenOffers(); render(); }
function playerCheckEnd(){
  if(state.ended) return true;
  if(pAge()>=38){ unlockTrophy('p-retire'); playerEnd(`À ${pAge()} ans, tu raccroches les crampons après une longue carrière.`,'age'); return true; }
  if(state.consecutiveBad>=4){ playerEnd("Quatre saisons ratées d'affilée : plus aucun club ne te fait confiance.",'bad'); return true; }
  if(state.noOfferYears>=2){ playerEnd("Deux années sans proposition. Le téléphone ne sonne plus : fin de carrière.",'noOffers'); return true; }
  return false;
}
function playerScore(){ const t=state.totals; return Math.round(state.history.length*8+t.goals*2+t.assists+t.titles*40+t.cups*20+t.euros*80+t.caps*3+t.ballons*150+t.boots*40); }
function playerEnd(reason,cause){ if(state.ended) return; state.ended=true; state.endingText=reason; state.endingCause=cause; state.pendingChoice='end'; unlockTrophy('p-retire'); saveToHall({kind:'player',name:state.name,mode:state.posName,era:eraForYear(state.year).name,seasons:state.history.length,titles:state.totals.titles+state.totals.euros+state.totals.cups,age:pAge(),cause,score:playerScore(),date:new Date().toISOString().slice(0,10)}); clearSave('player'); }
