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
 {id:'bosseur',name:"Bosseur·euse",desc:"Premier·ère arrivé·e, dernier·ère parti·e.",bonus:{physique:3,mental:2},growth:.2},{id:'genie',name:"Génie instinctif",desc:"Des gestes que personne n'apprend.",bonus:{technique:7,mental:-2},growth:0},{id:'leader',name:"Leader naturel",desc:"Le vestiaire t'écoute déjà à 18 ans.",bonus:{mental:5},gauges:{vestiaire:10}},{id:'fragile',name:"Corps fragile",desc:"Talent immense, ischios en papier.",bonus:{technique:5,physique:-3},injury:.1},{id:'fetard',name:"Fêtard·e",desc:"La nuit, tu marques aussi beaucoup.",bonus:{technique:2,mental:-3},gauges:{supporters:5,entourage:-5},scandal:true},{id:'glace',name:"Sang froid",desc:"Un penalty à la 90e ne te fait rien.",bonus:{mental:7}},
];
const PGAUGE={corps:{icon:'🩻',label:"Corps",help:"Santé : blessures, récupération, longévité. À zéro, la carrière s'arrête."},vestiaire:{icon:'✊',label:"Vestiaire",help:"Place dans le groupe : temps de jeu et soutien en cas de crise."},supporters:{icon:'📣',label:"Supporters",help:"Amour du public : pression et récompenses."},entourage:{icon:'👪',label:"Entourage",help:"Agent, famille, amis : qualité des offres et stabilité."}};
const PSTAT={technique:"Technique",physique:"Physique",mental:"Mental"};
const ROLES={titulaire:{name:"Titulaire",share:.9},rotation:{name:"Rotation",share:.55},remplacant:{name:"Remplaçant·e",share:.25}};

function playerFreshState(c){
  const st={technique:36,physique:36,mental:36}; [c.origin,c.trait].forEach(o=>Object.entries(o.bonus||{}).forEach(([k,v])=>st[k]=clamp(st[k]+v)));
  const g={corps:75,vestiaire:50,supporters:45,entourage:50}; [c.origin,c.trait].forEach(o=>Object.entries(o.gauges||{}).forEach(([k,v])=>g[k]=clamp(g[k]+v)));
  const nat=c.origin.nat==='AF'?pick(['SN','CI','ML','CM','DZ','MA']):'FR';
  return { kind:'player', name:c.name, year:c.era.start, startEra:c.era.id, age:c.origin.age||17, born:c.era.start-(c.origin.age||17), pos:c.pos.id, posName:c.pos.name, posIcon:c.pos.icon, nat, originName:c.origin.name, traitName:c.trait.name, traitId:c.trait.id, injuryMod:c.trait.injury||0, growth:1+(c.trait.growth||0), potential:randInt(78,96),
    stats:st, gauges:g, pressure:8, coachTrust:50, forme:70, injury:0, club:null, squad:[], usedNames:[], comp:null, phase:0, seasonStats:null, history:[], totals:{apps:0,goals:0,assists:0,titles:0,cups:0,euros:0,caps:0,capGoals:0,ballons:0,boots:0,earned:0}, clubs:[], selected:false, selectionBoost:0, bigOfferNext:false, log:[], pendingChoice:null, currentEvent:null, currentRoulette:null, pendingResult:null, currentOffers:[], newBadges:[], lastRouletteSeason:-99, rouletteCount:0, noOfferYears:0, consecutiveBad:0, ended:false, endingText:'', endingCause:null };
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
/* ---------- Offres ---------- */
function playerTierFor(rating,rep){ const t=['amateur']; if(rating>=44) t.push('ligue2'); if(rating>=55) t.push('ligue1'); if(rating>=52&&state.gauges.entourage>=45) t.push('etranger'); if(rating>=66) t.push('europe'); if(rating>=78&&(state.selected||rep>=60)) t.push('superclub'); return t; }
function playerBuildOffer(tier,forced){
  const o=buildCoachOffer(tier,forced); const r=pRating();
  const gap=r-o.strength; const role=gap>=4?'titulaire':gap>=-4?pick(['titulaire','rotation']):gap>=-10?pick(['rotation','remplacant']):'remplacant';
  const salary=Math.max(.01,valueForRating(r,pAge(),state.year)*.14*(role==='titulaire'?1:role==='rotation'?.75:.55)*rand(.85,1.2));
  o.role=role; o.salary=salary; o.duration=randInt(1,3); const dk=decadeKey(state.year);
  const coaches=COACHES_BY_ERA[eraForYear(state.year).id]; o.coach=Math.random()<.35?pick(coaches).name:fakeName(o.nat==='FR'?'FR':(FAKE_FIRST[o.nat]?o.nat:'FR'));
  return o;
}
function playerGenerateOffers(){
  const r=pRating(), offers=[]; const tiers=playerTierFor(r,state.gauges.supporters);
  if(state.club&&state.coachTrust>=30&&state.consecutiveBad<2){ const o=playerBuildOffer(state.club.tier,{name:state.club.name,nat:state.club.nat,league:state.club.league,s:state.club.s}); o.stay=true; o.coach=state.club.coach; o.salary=Math.max(o.salary,state.club.salary*rand(1,1.3)); offers.push(o); }
  let count=2+(state.history.length>=2?1:0)+(state.gauges.entourage>=60?1:0)+(state.bigOfferNext?1:0); count=Math.min(4,count);
  if(pAge()>=33&&r<60) count--; if(pAge()>=35&&r<66) count--;
  const used=new Set(offers.map(o=>o.club)); let tries=0;
  while(offers.length<count&&tries<20){ tries++; let tier=pick(tiers); if(state.bigOfferNext&&tries===1&&tiers.length>1) tier=tiers[tiers.length-1]; const o=playerBuildOffer(tier); if(used.has(o.club)) continue; used.add(o.club); offers.push(o); }
  state.bigOfferNext=false; return offers;
}
function playerOpenOffers(){ state.currentOffers=playerGenerateOffers(); state.noOfferYears=state.currentOffers.length?0:state.noOfferYears+1; state.pendingChoice='offers'; playerCheckEnd(); saveGame(); }
function playerAcceptOffer(i){
  const o=state.currentOffers[i]; if(!o) return;
  if(o.stay){ state.club.salary=o.salary; state.club.role=o.role; state.club.since++; state.club.contractEnd=state.year+o.duration; }
  else {
    const used=new Set(state.usedNames); const squad=generateSquad(o,state.year,used); squad.forEach(p=>{ if(p.real&&!state.usedNames.includes(p.name)) state.usedNames.push(p.name); });
    state.squad=squad; state.club={name:o.club,tier:o.tier,nat:o.nat,league:o.league,s:o.s,strength:o.strength,leagueName:o.leagueName,coach:o.coach,role:o.role,salary:o.salary,since:1,contractEnd:state.year+o.duration};
    state.coachTrust=o.role==='titulaire'?62:o.role==='rotation'?50:40; state.gauges.vestiaire=clamp(state.gauges.vestiaire*.6+25); state.gauges.supporters=clamp(state.gauges.supporters*.5+22);
    if(!state.clubs.includes(o.club)) state.clubs.push(o.club); if(o.tier==='superclub') unlockTrophy('p-superclub');
  }
  state.currentOffers=[]; log(`🖊️ ${o.stay?'Tu prolonges à':'Tu signes à'} <b>${o.club}</b> (${o.leagueName}) : ${ROLES[o.role].name.toLowerCase()} promis·e, ${money(o.salary,state.year)} par saison, coach ${o.coach}.`);
  playerStartSeason();
}
/* ---------- Saison ---------- */
function playerMe(){ return {id:'me',name:state.name,pos:state.pos,born:state.born,peak:pRating()/ageCurve(pAge()),dev:1,morale:70,form:0,injury:state.injury,real:true,isMe:true}; }
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
  state.comp=createCompetition(lg,c.name); state.phase=0; state.seasonStats={apps:0,goals:0,assists:0,notes:[],phases:[],shares:[]}; state.minutesBonus=0;
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
function playerSimulatePhase(){
  const c=state.club, comp=state.comp, ss=state.seasonStats; const from=state.phase===0?0:comp.phaseEnds[state.phase-1], to=comp.phaseEnds[state.phase];
  const era=eraForYear(state.year);
  // blessure
  let injuryNote=null;
  if(state.injury>0){ state.injury=Math.max(0,state.injury-9); }
  else { const chance=.09*era.injuryMult+state.injuryMod-(state.gauges.corps-50)*.002+(pAge()>=31?.04:0); if(Math.random()<chance){ state.injury=randInt(2,16); state.gauges.corps=clamp(state.gauges.corps-state.injury*.6); injuryNote=`${state.injury} semaines d'absence`; } }
  const share=playerShare(); ss.shares.push(share);
  const mine=playMatchdays(comp,from,to,c.name,playerClubStrength);
  const apps=Math.round(mine.length*share); const teamGoals=mine.reduce((n,m)=>n+(m.us==='home'?m.gh:m.ga),0);
  const r=pRating(); const posW={A:.26,M:.12,D:.035,G:0}[state.pos]; const goals=poisson(teamGoals*posW*share*clamp(r/c.strength,.6,1.5)); const assists=poisson(teamGoals*({A:.12,M:.2,D:.06,G:.005}[state.pos])*share);
  const perf=clamp(r-c.strength+rand(-6,6)+(state.forme-60)*.1+goals*1.5+assists,-15,15);
  const note=clamp(6+perf*.12+rand(-.3,.3),4,9.5);
  ss.apps+=apps; ss.goals+=goals; ss.assists+=assists; ss.notes.push(note);
  state.totals.apps+=apps; state.totals.goals+=goals; state.totals.assists+=assists;
  // confiance du coach, forme, gauges
  const dTrust=clamp((note-6.2)*10,-12,12)+(share<.3?-3:0); state.coachTrust=clamp(state.coachTrust+dTrust);
  state.forme=clamp(state.forme-apps*.9+(share<.4?6:0)+4);
  state.pressure=clamp(state.pressure+(note<5.8?5:-2)+(c.tier==='superclub'?3:0)+(state.gauges.supporters<35?2:0)-2);
  state.gauges.supporters=clamp(state.gauges.supporters+(goals>=3?4:0)+(note>=7?3:note<5.5?-4:0));
  state.gauges.vestiaire=clamp(state.gauges.vestiaire+(share>=.5?1:-1)+(state.traitId==='leader'?1:0));
  state.gauges.corps=clamp(state.gauges.corps-apps*.25+(pAge()>=30?-2:0)+2);
  state.totals.earned+=c.salary/4;
  const pos=tablePos(comp.table,c.name);
  const rec={n:state.phase+1,matches:mine,apps,goals,assists,note,share,pos,dTrust:Math.round(dTrust),injury:injuryNote,table:sortTable(comp.table).map(t=>({...t}))};
  ss.phases.push(rec); state.lastPhase=rec;
  log(`📊 Phase ${state.phase+1} : ${apps} matchs, ${goals} but${goals>1?'s':''}, ${assists} passe${assists>1?'s':''}, note ${note.toFixed(1)}. ${c.name} ${ordinal(pos)}.`);
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
  const avgNote=ss.notes.reduce((n,x)=>n+x,0)/Math.max(1,ss.notes.length), avgShare=ss.shares.reduce((n,x)=>n+x,0)/Math.max(1,ss.shares.length);
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
  const bad=avgNote<5.7||avgShare<.25; state.consecutiveBad=bad?state.consecutiveBad+1:0;
  // développement : progression forte jeune, déclin après 31
  const age=pAge(); const growth=(age<=21?3.2:age<=25?1.8:age<=29?.6:age<=31?-.2:-1.6)*state.growth*(avgShare>=.5?1.1:.7)*(state.potential>r?1:.3);
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
  state.comp=null;
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
