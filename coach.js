/* ============================== ABSOLUT COACH — CARRIÈRE D'ENTRAÎNEUR·EUSE ============================== */
const COACH_MODES=[
 {id:'classic',icon:'⚽',name:"Carrière classique",difficulty:"★☆☆☆☆",desc:"Des présidents normaux, des budgets normaux, un football imprévisible.",details:["Budgets standards","Présidents patients ou non selon le club"],budgetMult:1,toleranceMult:1,variance:1,incidentMult:1},
 {id:'batisseur',icon:'🌱',name:"Bâtisseur·euse",difficulty:"★★☆☆☆",desc:"Peu de moyens, des présidents patients : le temps est ton allié, l'argent non.",details:["Budgets −40 %","Présidents +30 % de patience","Formation valorisée"],budgetMult:.6,toleranceMult:1.3,variance:1,incidentMult:1,youthBonus:10},
 {id:'machine',icon:'🏟️',name:"Machine à trophées",difficulty:"★★★☆☆",desc:"Gros budgets, présidents impatients : gagner n'est pas une option.",details:["Budgets +60 %","Présidents −40 % de patience","Objectifs relevés"],budgetMult:1.6,toleranceMult:.6,variance:.95,incidentMult:1.1,objMult:.75},
 {id:'chaos',icon:'🎲',name:"Football chaos",difficulty:"★★★★☆",desc:"Blessures, scandales et retournements : aucune saison ne ressemble à la précédente.",details:["Variance +60 %","Incidents +50 %","Pression erratique"],budgetMult:1,toleranceMult:.9,variance:1.6,incidentMult:1.5},
 {id:'brutal',icon:'💀',name:"Dernier contrat",difficulty:"★★★★★",desc:"Budgets réduits, présidents sans pitié, presse féroce.",details:["Budgets −50 %","Présidents −50 % de patience","Pression +50 %"],budgetMult:.5,toleranceMult:.5,variance:1.2,incidentMult:1.2,pressureMult:1.5},
];
const COACH_ORIGINS=[
 {id:'ancienpro',name:"Ancien·ne joueur·euse pro",desc:"Le nom ouvre des portes, le vestiaire t'écoute, mais tout reste à prouver sur le banc.",bonus:{reseau:8,reputation:6,technique:-2}},
 {id:'educateur',name:"Éducateur·rice de quartier",desc:"Vingt ans de U13 sous la pluie. Peu de réseau, une patience infinie.",bonus:{talent:3,technique:3,reseau:-4},pressureRes:5},
 {id:'analyste',name:"Analyste vidéo",desc:"Dix mille matchs découpés en séquences. Reste à parler aux humains.",bonus:{technique:6,talent:4,reseau:-2,reputation:-3}},
 {id:'diplome',name:"Diplômé·e de l'école fédérale",desc:"Formation solide, promo soudée, départ comme tout le monde.",bonus:{technique:5,talent:3,reputation:2}},
 {id:'consultant',name:"Consultant·e télé",desc:"Une notoriété acquise, un franc-parler apprécié, peu de terrain.",bonus:{reputation:10,reseau:4,talent:-2}},
 {id:'nepo',name:"Enfant du président",desc:"Un carnet d'adresses et un nom qu'on te ressortira à chaque défaite.",bonus:{reseau:12,reputation:-4,technique:-1}},
 {id:'adjoint',name:"Adjoint·e de longue date",desc:"Tu connais chaque secret de vestiaire, chaque compromis d'un staff.",bonus:{technique:7,reseau:4,talent:-1}},
 {id:'futsal',name:"Coach de futsal",desc:"Vitesse, technique et une lecture du jeu en espace réduit hors norme.",bonus:{talent:7,technique:-2,reseau:-3}},
 {id:'academie',name:"Formateur·rice en académie",desc:"Tu as lancé des internationaux. Les grands vestiaires sont un autre monde.",bonus:{talent:5,reputation:3,technique:-2},youthBonus:8},
 {id:'gardien',name:"Ancien·ne gardien·ne",desc:"Quinze ans à regarder le jeu de loin. Tu l'as compris mieux que tout le monde.",bonus:{talent:4,technique:2,reputation:1}},
];
const COACH_QUALITIES=[
 {id:'charisme',name:"Charismatique",desc:"Les joueurs te suivent instinctivement.",bonus:{reseau:4},gauge:{vestiaire:8}},{id:'visionnaire',name:"Visionnaire",desc:"Tu vois une équipe là où les autres voient onze joueurs.",bonus:{talent:5}},{id:'rigoureux',name:"Rigoureux·se",desc:"Chaque séance préparée au millimètre.",bonus:{technique:4},gauge:{staff:8}},{id:'diplomate',name:"Diplomate",desc:"Même un président furieux finit par se rasseoir.",bonus:{reseau:3},confidenceRes:.15},{id:'formateur',name:"Formateur·rice",desc:"Les jeunes progressent plus vite avec toi.",bonus:{technique:2},gauge:{formation:10}},{id:'populaire',name:"Populaire",desc:"Les tribunes t'adorent avant même le premier match.",bonus:{reputation:3},gauge:{supporters:10}},{id:'calme',name:"Imperturbable",desc:"La pression glisse sur toi.",bonus:{technique:2},pressureRes:8},{id:'flair',name:"Flair du mercato",desc:"Tu repères les arnaques et les bonnes affaires.",bonus:{reseau:3},scamRes:.1},
];
// Chaque défaut coûte des points de statistiques dès le départ, en plus de son effet mécanique.
const COACH_FLAWS=[
 {id:'impulsif',name:"Impulsif·ve",desc:"Tu changes d'équipe sur un coup de sang.",bonus:{technique:-3,reseau:-1},incidentMult:1.2},
 {id:'arrogant',name:"Arrogant·e",desc:"Ta conférence de presse d'arrivée a déjà fait trois ennemis.",bonus:{reputation:-4,reseau:-2},confidenceRes:-.1},
 {id:'anxieux',name:"Anxieux·se",desc:"Le doute te ronge avant chaque match.",bonus:{talent:-2,technique:-1},pressureRes:-8},
 {id:'depensier',name:"Dépensier·ère",desc:"Il manque toujours un dernier recrutement.",bonus:{technique:-3},budgetLeak:.1},
 {id:'autoritaire',name:"Autoritaire",desc:"Certains joueurs ne te pardonnent jamais.",bonus:{reseau:-5,technique:2},gauge:{vestiaire:-8}},
 {id:'naif',name:"Naïf·ve",desc:"Les agents adorent te rencontrer.",bonus:{reseau:-2,talent:-1},scamRes:-.1},
 {id:'provocateur',name:"Provocateur·rice",desc:"L'arbitre, l'adversaire et la presse : tout le monde y passe.",bonus:{reputation:-4,technique:-1},gauge:{supporters:5},incidentMult:1.15},
 {id:'nostalgique',name:"Nostalgique",desc:"Le football d'avant était mieux, et tu le dis trop souvent.",bonus:{talent:-2,reputation:-3}},
];
const TIER_INFO={amateur:{label:"Monde amateur",icon:'🌾'},ligue2:{label:"Deuxième division",icon:'🥈'},ligue1:{label:"Élite française",icon:'🇫🇷'},etranger:{label:"Aventure lointaine",icon:'🌎'},europe:{label:"Grand club européen",icon:'🇪🇺'},superclub:{label:"Super-club",icon:'👑'}};
const CSTAT={talent:"Tactique",technique:"Management",reseau:"Réseau",reputation:"Réputation"};
const GAUGE_INFO={vestiaire:{icon:'✊',label:"Vestiaire",help:"Cohésion du groupe : force de l'équipe, grèves, ambiance."},supporters:{icon:'📣',label:"Supporters",help:"Ferveur : pression du public, patience en cas de crise, recettes."},formation:{icon:'🎓',label:"Formation",help:"Qualité du centre : progression des jeunes, moins d'arnaques."},staff:{icon:'🧑‍🤝‍🧑',label:"Staff",help:"Qualité du staff : blessures, préparation, développement."}};

function coachFreshState(c){
  const mode=c.mode, era=c.era;
  const st={talent:32,technique:28,reseau:18,reputation:40};
  const alias={repPublic:'reputation',repCritique:'reputation',moral:'technique'};
  [c.origin,c.nationality,c.mentor,c.quality,c.flaw].forEach(o=>Object.entries((o&&o.bonus)||{}).forEach(([k,v])=>{ const key=alias[k]||k; if(key in st) st[key]+=v; }));
  Object.keys(st).forEach(k=>st[k]=clamp(st[k]));
  const gauges={vestiaire:50,supporters:50,formation:40+(mode.youthBonus||0)+(c.origin.youthBonus||0),staff:45};
  [c.quality,c.flaw].forEach(o=>Object.entries((o&&o.gauge)||{}).forEach(([k,v])=>gauges[k]=clamp(gauges[k]+v)));
  return { kind:'coach', name:c.name, year:era.start, startEra:era.id, age:30, modeId:mode.id, modeName:mode.name, modeIcon:mode.icon, mode:{budgetMult:mode.budgetMult,toleranceMult:mode.toleranceMult,variance:mode.variance,incidentMult:mode.incidentMult*(c.flaw.incidentMult||1),objMult:mode.objMult||1,pressureMult:mode.pressureMult||1},
    originName:c.origin.name, nationality:c.nationality, nationalityStyles:(c.nationality&&c.nationality.favoredStyleIds)||[], favoriteStyleId:c.favoriteStyle.id, mentorName:c.mentor.name, mentorStyles:c.mentor.styleIds||[], qualityName:c.quality.name, flawName:c.flaw.name,
    perks:{pressureRes:(c.origin.pressureRes||0)+(c.quality.pressureRes||0)+(c.flaw.pressureRes||0),confidenceRes:(c.quality.confidenceRes||0)+(c.flaw.confidenceRes||0),scamRes:(c.quality.scamRes||0)+(c.flaw.scamRes||0),budgetLeak:c.flaw.budgetLeak||0},
    stats:st, pressure:8, gauges, club:null, squad:[], usedNames:[], formation:'4-4-2', styleId:c.favoriteStyle.id, approach:'equilibre', training:'tactique', captainId:null, comp:null, phase:0, matchday:0, match:null, phaseMatches:[], seasonStats:null, cup:null, euro:null,
    history:[], sackings:0, consecutiveSackings:0, clubsCoached:[], titles:{league:0,cup:0,euro:0,euro2:0,promo:0}, awards:0, log:[], pendingChoice:null, currentEvent:null, currentRoulette:null, pendingResult:null, market:null, newBadges:[], lastRouletteSeason:-99, rouletteCount:0, pressureCrisisCooldown:0, noOfferYears:0, scamsSuffered:0, stayLocal:false, ended:false, endingText:'', endingCause:null };
}
function coachEra(){ return eraForYear(state.year); }
function usedSet(){ return new Set(state.usedNames); }
function addUsed(name){ if(!state.usedNames.includes(name)) state.usedNames.push(name); }

/* ---------- Offres ---------- */
function tierBudget(tier,s){ return {superclub:{5:250,4:160},europe:{5:180,4:100,3:50,2:30,1:20},ligue1:{5:120,4:60,3:30,2:18,1:10},etranger:{2:12,3:25,4:45,5:60},ligue2:{0:4},amateur:{0:.4}}[tier][s]||(tier==='ligue2'?4:tier==='amateur'?.4:20); }
function accessibleTiers(){
  const r=state.stats.reputation, n=state.history.length, tiers=['amateur'];
  if(r>=28||n>=1) tiers.push('ligue2'); if(r>=45&&n>=1) tiers.push('ligue1'); if(r>=40&&state.stats.reseau>=25&&n>=1&&!state.stayLocal) tiers.push('etranger'); if(r>=60&&n>=2&&!state.stayLocal) tiers.push('europe'); if(r>=78&&n>=3&&!state.stayLocal) tiers.push('superclub');
  return tiers;
}
function buildCoachOffer(tier,forcedClub){
  const dk=decadeKey(state.year), year=state.year; let club,nat='FR',league=null,s=0;
  if(forcedClub){ club=forcedClub.name; nat=forcedClub.nat; league=forcedClub.league; s=forcedClub.s; }
  else if(tier==='ligue1'){ const c=pick(FR_CLUBS.filter(x=>x.s[dk]>0)); club=c.n; s=c.s[dk]; }
  else if(tier==='ligue2'){ const c=pick(FR_CLUBS.filter(x=>!x.s[dk]).map(x=>x.n).concat(FR_LOWER.slice(0,10))); club=c; s=0; }
  else if(tier==='amateur'){ club=pick(FR_LOWER); s=0; }
  else if(tier==='etranger'){ const c=pick(WORLD_CLUBS.filter(x=>x.s[dk]>0)); club=c.n; nat=c.nat; league=c.league; s=c.s[dk]; }
  else { const pool=EU_CLUBS.filter(x=>x.s[dk]>0&&(tier==='superclub'?x.s[dk]===5:x.s[dk]<=4)); const c=pick(pool.length?pool:EU_CLUBS.filter(x=>x.s[dk]>0)); club=c.n; nat=c.nat; s=c.s[dk]; }
  const strength=tierBaseStrength(tier,s);
  const president=pick(PRESIDENTS);
  const mode=state.mode||{budgetMult:1,toleranceMult:1,objMult:1};
  const budget=tierBudget(tier,s)*mode.budgetMult*rand(.8,1.2);
  const wanted=pick(STYLES);
  const o={club,tier,nat,league,s,strength,president:president.id,presidentName:president.name,presidentDesc:president.desc,tolerance:president.tolerance*mode.toleranceMult,budget,styleWanted:wanted.id,year};
  const lg=buildLeagueTeams(o,year); o.leagueName=lg.name; o.teams=lg.teams.length+1;
  const rank=[...lg.teams.map(t=>t.strength),strength].sort((a,b)=>b-a).indexOf(strength)+1;
  o.objectivePos=clamp(Math.round(rank*president.objMult*mode.objMult+rand(-1,1)),1,o.teams-3);
  o.duration=randInt(1,3);
  const conceptPool={amateur:["Structurer un club de village","Faire monter le club en National","Sauver le club de la dissolution"],ligue2:["Retrouver l'élite","Stabiliser un promu","Reconstruire après le scandale"],ligue1:["Viser l'Europe","Maintenir le club dans l'élite","Rajeunir l'effectif","Le club change de propriétaire"],etranger:["Bâtir un projet de zéro","Être la vitrine du championnat","Une aventure lointaine"],europe:["Ramener le club en Coupe d'Europe","Devenir candidat au titre","Reconstruire un géant déchu"],superclub:["Tout gagner","Gagner la Coupe d'Europe","Succéder à une légende"]};
  o.title=pick(conceptPool[tier]);
  return o;
}
function generateCoachOffers(){
  const offers=[]; const tiers=accessibleTiers();
  // rester au club
  if(state.club&&state.club.confidence>=35&&!state.club.sacked){ const o=buildCoachOffer(state.club.tier,{name:state.club.name,nat:state.club.nat,league:state.club.league,s:state.club.s}); o.stay=true; o.title="Poursuivre le projet"; o.budget*=state.club.confidence>=70?1.15:.9; o.presidentName=state.club.presidentName; o.presidentDesc=state.club.presidentDesc; o.president=state.club.president; o.tolerance=state.club.tolerance; offers.push(o); }
  let count=2+(state.history.length>=2?1:0)+(state.stats.reputation>=55?1:0); count=Math.min(4,count);
  if(state.age>=62&&state.stats.reputation<45) count-=1; if(state.age>=68&&state.stats.reputation<55) count-=1;
  const usedClubs=new Set(offers.map(o=>o.club));
  let tries=0;
  while(offers.length<count&&tries<20){ tries++; const tier=pick(tiers); const o=buildCoachOffer(tier); if(usedClubs.has(o.club)) continue; usedClubs.add(o.club); offers.push(o); }
  return offers;
}
function coachOpenOffers(){ state.currentOffers=generateCoachOffers(); state.noOfferYears=state.currentOffers.length?0:state.noOfferYears+1; state.pendingChoice='offers'; coachCheckEnd(); saveGame(); }
function coachSkipYear(){ log(`🛋️ Une année sans banc. Tu observes, tu voyages, tu doutes.`); state.year++; state.age++; state.pressure=clamp(state.pressure-15); state.stats.reputation=clamp(state.stats.reputation-4); state.club=null; state.squad=[]; if(coachCheckEnd()){ render(); return; } coachOpenOffers(); render(); }

/* ---------- Prise de fonction ---------- */
function coachAcceptOffer(i){
  const o=state.currentOffers[i]; if(!o) return;
  const used=usedSet();
  if(o.stay){ state.club.objectivePos=o.objectivePos; state.club.budget=o.budget; state.club.styleWanted=o.styleWanted; state.club.since++; state.club.confidence=clamp(state.club.confidence,30,100); }
  else {
    if(state.club&&!state.club.sacked) log(`👋 Tu quittes ${state.club.name}.`);
    const squad=generateSquad(o,state.year,used); squad.forEach(p=>{ if(p.real) addUsed(p.name); });
    state.squad=squad; state.club={name:o.club,tier:o.tier,nat:o.nat,league:o.league,s:o.s,strength:o.strength,leagueName:o.leagueName,president:o.president,presidentName:o.presidentName,presidentDesc:o.presidentDesc,tolerance:o.tolerance,objectivePos:o.objectivePos,budget:o.budget,styleWanted:o.styleWanted,confidence:55,since:1,sacked:false};
    state.gauges.vestiaire=clamp(state.gauges.vestiaire*.6+30); state.gauges.supporters=clamp(state.gauges.supporters*.5+28);
    if(!state.clubsCoached.includes(o.club)) state.clubsCoached.push(o.club);
    if(o.tier==='etranger'||o.tier==='europe'||o.tier==='superclub') unlockTrophy('c-abroad'); if(o.tier==='superclub') unlockTrophy('c-superclub');
  }
  state.club.wageCap=Math.max(squadWages()*1.08,tierBudget(state.club.tier,state.club.s)*state.mode.budgetMult*1.1);
  state.currentOffers=[];
  log(`📝 ${o.stay?'Tu prolonges à':'Tu signes à'} <b>${o.club}</b> (${o.leagueName}). Objectif : ${ordinal(o.objectivePos)}. Budget transferts : ${$(o.budget)}. ${capitalize(o.presidentName)} : ${o.presidentDesc}`);
  coachOpenMercato(false);
}
function capitalize(s){ return s?s.charAt(0).toUpperCase()+s.slice(1):s; }

/* ---------- Mercato ---------- */
function coachCredibility(){ return credibilityFor(state.club,state.stats.reputation,state.stats.reseau); }
function coachOpenMercato(winter){
  const c=state.club; const budgetLeft=winter?state.market&&state.market.budgetLeft!=null?state.market.budgetLeft:c.budget*.3:c.budget*(1-state.perks.budgetLeak);
  const targets=marketTargets(c,state.year,state.squad,usedSet(),{credibility:coachCredibility(),formation:state.gauges.formation,reseau:state.stats.reseau,winter});
  targets.forEach(t=>{ if(t.p.scam&&Math.random()<state.perks.scamRes) t.p.scam=null; });
  state.market={winter,targets,budgetLeft,bought:[],sold:[],youthBought:0};
  state.pendingChoice='mercato';
}
function squadWages(){ return state.squad.reduce((n,p)=>n+p.wage,0); }
function foreignCount(){ return state.squad.filter(p=>isForeign(p,state.club.nat)).length; }
function coachSell(pid){
  const p=state.squad.find(x=>x.id===pid); if(!p) return;
  const justSigned=p.joinedYear===state.year&&p.paid!=null;
  const price=justSigned?p.paid:playerValue(p,state.year)*rand(.8,1.05);
  state.squad=state.squad.filter(x=>x!==p); state.market.budgetLeft+=price; state.market.sold.push({name:p.name,price});
  if(justSigned){ state.market.bought=state.market.bought.filter(b=>b.p!==p); log(`↩️ ${p.name} repart aussitôt : le transfert est annulé.`); render(); return; }
  if(p.fanFav){ state.gauges.supporters=clamp(state.gauges.supporters-7); } if(p.trait==='leader') state.gauges.vestiaire=clamp(state.gauges.vestiaire-4);
  if(price>=state.club.budget*1.2) unlockTrophy('m-sell');
  log(`💸 Vente de ${p.name} pour ${$(price)}.${p.fanFav?' Les supporters grognent.':''}`);
  render();
}
function coachBuy(idx){
  const t=state.market.targets[idx]; if(!t) return; const m=state.market;
  if(t.access==='no'){ m.message=`${t.p.name} ne répond même pas : ${state.club.name} n'est pas à sa hauteur pour l'instant.`; render(); return; }
  if(state.squad.length>=27){ m.message="Effectif complet (27 joueurs maximum)."; render(); return; }
  if(t.price>m.budgetLeft+.0001){ m.message=`Budget insuffisant pour ${t.p.name} (${$(t.price)}).`; render(); return; }
  const fmax=eraForeignersMax(state.year); if(state.club.nat==='FR'&&isForeign(t.p,'FR')&&foreignCount()>=fmax){ m.message=`Quota d'étrangers atteint (${fmax} maximum à cette époque).`; render(); return; }
  if(squadWages()+t.wage>state.club.wageCap){ m.message=`Plafond salarial dépassé (${$(squadWages()+t.wage)} pour ${$(state.club.wageCap)} autorisés). Vends ou libère d'abord.`; render(); return; }
  m.budgetLeft-=t.price; const p=t.p; p.wage=t.wage; p.contractEnd=state.year+randInt(2,4); p.joinedYear=state.year; p.seasonsAtClub=0; p.morale=70; p.paid=t.price;
  if(t.access==='coup'){ p.promised=true; if(t.price>=state.club.budget*.6) unlockTrophy('m-coup'); }
  if(p.real) addUsed(p.name); if(playerRating(p,state.year)>=90) unlockTrophy('m-star');
  state.squad.push(p); m.bought.push({name:p.name,price:t.price,kind:t.kind,p}); if(t.kind==='youth') m.youthBought++;
  m.targets.splice(idx,1); m.message=null;
  log(`🖊️ ${p.name} (${POS_LABEL[p.pos].toLowerCase()}, ${t.age} ans) rejoint le club pour ${$(t.price)}${t.access==='coup'?' — un gros coup, avec une place de titulaire promise':''}.`);
  render();
}
function coachCloseMercato(){
  const m=state.market; const notes=[];
  // Effectif incomplet : le centre de formation fournit des jeunes (modestes) plutôt que de bloquer la saison
  if(state.squad.filter(p=>p.pos==='G').length<1){ const g=generatedPlayer('G',state.year,state.club.strength-12,state.club.nat,{age:randInt(18,20)}); g.wage=.01; g.contractEnd=state.year+2; g.joinedYear=state.year; state.squad.push(g); notes.push(`🧤 Aucun gardien sous contrat : ${g.name} (${playerAge(g,state.year)} ans) monte du centre de formation.`); }
  while(state.squad.length<14){ const p=generatedPlayer(pick(['D','M','A']),state.year,state.club.strength-12,state.club.nat,{age:randInt(17,19)}); p.wage=.01; p.contractEnd=state.year+2; p.joinedYear=state.year; state.squad.push(p); notes.push(`🌱 ${p.name} (${playerAge(p,state.year)} ans) complète l'effectif depuis le centre.`); }
  if(m.youthBought>=5) unlockTrophy('m-youth');
  // révélation des arnaques
  m.bought.forEach(b=>{ const p=b.p; if(p.scam){ const s=SCAMS.find(x=>x.id===p.scam); state.scamsSuffered++; unlockTrophy('m-scam'); if(state.scamsSuffered>=3) unlockTrophy('m-scam-3');
    if(s.vanish){ state.squad=state.squad.filter(x=>x!==p); } if(s.ratingMult) p.peak=Math.round(p.peak*s.ratingMult); if(s.ageAdd) p.born-=s.ageAdd; if(s.injure) p.injury=s.injure; if(s.extraCost){ m.budgetLeft-=b.price*s.extraCost; } if(s.moraleHit) p.morale=25;
    notes.push(`🎭 <b>${s.label}</b> — ${p.name} : ${s.text}`); log(`🎭 Arnaque au mercato : ${p.name}. ${s.label}.`); p.scam=null; } });
  state.market.closingNotes=notes; state.market.budgetLeft=Math.max(0,m.budgetLeft);
  if(m.winter){ state.pendingChoice='tactic'; state.tacticAfterWinter=true; } else { state.pendingChoice='tactic'; }
  saveGame(); render();
}

/* ---------- Tactique et saison ---------- */
function coachSetTactic(formation,styleId){
  state.formation=formation; state.styleId=styleId;
  if(state.tacticAfterWinter){ state.tacticAfterWinter=false; coachPlayPhase(); return; }
  coachStartSeason();
}
function coachStartSeason(){
  const c=state.club; const lg=buildLeagueTeams(c,state.year); c.leagueName=lg.name;
  state.comp=createCompetition(lg,c.name,state.year); state.phase=0; state.matchday=0; state.match=null;
  // L'objectif du président se recalcule sur la vraie force de ton effectif : bâtir une armada relève l'attente.
  const xi=bestXI(state.squad,FORMATIONS[state.formation],state.year); const xiAvg=xi.reduce((n,p)=>n+playerRating(p,state.year),0)/Math.max(1,xi.length);
  const rank=[...lg.teams.map(t=>t.strength),xiAvg].sort((a,b)=>b-a).indexOf(xiAvg)+1;
  const pres=PRESIDENTS.find(x=>x.id===c.president)||PRESIDENTS[0];
  c.objectivePos=clamp(Math.min(c.objectivePos,Math.round(rank*pres.objMult*state.mode.objMult)),1,state.comp.teams.length-3); state.phaseMatches=[]; state.seasonStats={scorers:{},minutes:{},goals:0,conceded:0,form:0,phases:[]};
  state.squad.forEach(p=>{ p.apps=0; p.goals=0; p.assists=0; p.sumRating=0; p.rated=0; p.yellows=0; p.suspended=0; p.fitness=100; });
  state.seasonStats.youthWeeks=0; state.seasonStats.injuries=[];
  if(!state.approach) state.approach='equilibre'; if(!state.training) state.training='tactique';
  log(`📅 La saison ${state.year}-${state.year+1} commence en ${c.leagueName} : ${state.comp.teams.length} clubs, ${state.comp.schedule.length} journées.`);
  coachPlayPhase();
}
/* Bonus de l'entraîneur·euse (tactique, vestiaire, staff, cohérence de style, entraînement, dynamique) */
function coachBonus(withNoise=true){
  const c=state.club, g=state.gauges; const style=styleById(state.styleId);
  let bonus=(state.stats.talent-50)*.06+(g.vestiaire-50)*.04+(g.staff-50)*.015+(state.seasonStats?state.seasonStats.form:0);
  if(state.styleId===c.styleWanted) bonus+=2; if(state.styleId===state.favoriteStyleId) bonus+=1.5; if(state.mentorStyles.includes(state.styleId)) bonus+=.5; if((state.nationalityStyles||[]).includes(state.styleId)) bonus+=.5;
  if(state.stats.talent<style.prestige*60) bonus-=(style.prestige*60-state.stats.talent)*.06;
  bonus+=(TRAINING[state.training]||TRAINING.tactique).strength;
  if(withNoise) bonus+=rand(-1.5,1.5)*state.mode.variance;
  return bonus;
}
function coachStrength(){ return teamStrength(state.squad,FORMATIONS[state.formation],state.year,{bonus:coachBonus()}); }
/* Lignes explicables du bonus, pour l'écran d'avant-match */
function coachBonusLines(){
  const c=state.club, g=state.gauges, lines=[]; const style=styleById(state.styleId);
  lines.push({t:`Tactique ${Math.round(state.stats.talent)} : ${state.stats.talent>=55?'tes idées font gagner des matchs':'tes idées sont encore un peu courtes'}`,d:(state.stats.talent-50)*.06});
  lines.push({t:`Vestiaire ${Math.round(g.vestiaire)} : ${g.vestiaire>=60?'un groupe soudé':g.vestiaire<40?'un groupe fracturé':'un groupe correct'}`,d:(g.vestiaire-50)*.04});
  const st=(state.styleId===c.styleWanted?2:0)+(state.styleId===state.favoriteStyleId?1.5:0)+(state.mentorStyles.includes(state.styleId)?.5:0)+((state.nationalityStyles||[]).includes(state.styleId)?.5:0)-(state.stats.talent<style.prestige*60?(style.prestige*60-state.stats.talent)*.06:0);
  lines.push({t:`Style ${style.name} : ${state.styleId===c.styleWanted?'celui que le club demande':'pas celui que le club demandait'}${state.styleId===state.favoriteStyleId?', et ton style favori':''}${state.stats.talent<style.prestige*60?', trop ambitieux pour ta tactique actuelle':''}`,d:st});
  const tr=TRAINING[state.training]||TRAINING.tactique; lines.push({t:`Entraînement ${tr.label.toLowerCase()} : ${tr.desc}`,d:tr.strength});
  if(state.seasonStats&&Math.abs(state.seasonStats.form)>=.5) lines.push({t:`Dynamique ${state.seasonStats.form>0?'positive':'négative'}`,d:state.seasonStats.form});
  return lines;
}
function coachPlayPhase(){
  // incident éventuel avant la phase
  const inc=coachPickIncident();
  if(inc){ state.currentEvent={kind:'incident',event:inc}; state.pendingChoice='event'; saveGame(); return; }
  coachSimulatePhase();
}
function coachPickIncident(){
  const chance=clamp(.55*state.mode.incidentMult,.2,.95); if(Math.random()>chance) return null;
  const y=state.year, g=state.gauges;
  const lowGauge=Object.keys(g).filter(k=>g[k]<35);
  const pool=COACH_INCIDENTS.filter(e=>(!e.minYear||y>=e.minYear)&&(!e.maxYear||y<=e.maxYear)&&(!e.tiers||e.tiers.includes(state.club.tier))&&(!e.gauge||lowGauge.includes(e.gauge)||Math.random()<.35));
  return pickNoRepeat('coach-incidents',pool.length?pool:COACH_INCIDENTS);
}
function coachApplyEffects(effects,ctx={}){
  const s=state.stats, g=state.gauges, c=state.club, out=[];
  Object.entries(effects||{}).forEach(([k,v])=>{
    if(k in s) s[k]=clamp(s[k]+v);
    else if(k in g) g[k]=clamp(g[k]+v);
    else if(k==='pressure') state.pressure=clamp(state.pressure+v*(v>0?state.mode.pressureMult:1));
    else if(k==='confidence'&&c) c.confidence=clamp(c.confidence+v*(v<0?(1-state.perks.confidenceRes):1));
    else if(k==='budget'&&c){ const amt=c.budget*v; c.budget+=amt; if(state.market) state.market.budgetLeft+=amt; out.push(`${amt>=0?'+':''}${$(amt)} de budget`); }
    else if(k==='form'&&state.seasonStats) state.seasonStats.form=clamp(state.seasonStats.form+v,-6,6);
    else if(k==='injure'){ const best=[...state.squad].filter(p=>!p.injury).sort((a,b)=>playerRating(b,state.year)-playerRating(a,state.year))[0]; if(best){ best.injury=v; out.push(`${best.name} absent ${v} semaines`); } }
    else if(k==='sellStar'){ const best=[...state.squad].sort((a,b)=>playerRating(b,state.year)-playerRating(a,state.year))[0]; if(best){ const price=playerValue(best,state.year)*v; state.squad=state.squad.filter(p=>p!==best); if(!effects.noReinvest){ c.budget+=price; } out.push(`${best.name} vendu ${$(price)}`); log(`💸 ${best.name} part pour ${$(price)}.`); } }
    else if(k==='releaseCaptain'){ const old=[...state.squad].sort((a,b)=>playerAge(b,state.year)-playerAge(a,state.year))[0]; if(old){ state.squad=state.squad.filter(p=>p!==old); out.push(`${old.name} quitte le club`); } }
    else if(k==='promoteYouth'){ const p=generatedPlayer(pick(['M','A','D']),state.year,state.club.strength-6,state.club.nat,{age:17}); p.dev=1.15; p.wage=.02; p.contractEnd=state.year+3; state.squad.push(p); out.push(`${p.name} (17 ans) intègre le groupe pro`); }
    else if(k==='points'&&state.comp){ const me=state.comp.table.find(t=>t.me); me.pts+=v; out.push(`+${v} points sur tapis vert`); }
    else if(k==='skipHalf'){ state.seasonStats.form-=2; }
    else if(k==='stayLocal'){ state.stayLocal=true; }
  });
  return out;
}
function coachChooseEvent(i){
  const ce=state.currentEvent, ev=ce.event, ch=ev.choices[i]; if(!ch) return;
  const before=coachSnapshot();
  const extra=coachApplyEffects(ch.effects);
  log(`${ev.icon} <b>${ev.title}</b> → ${ch.label}. ${ch.result||''}`);
  state.pendingResult={title:`${ev.icon} ${ev.title}`,subtitle:ch.label,narrative:ch.result||'',before,after:coachSnapshot(),extra,next:ce.kind==='incident'?'phase':'intersaison'};
  state.currentEvent=null; state.pendingChoice='choiceResult'; saveGame(); render();
}
function coachSnapshot(){ const s=state.stats, g=state.gauges; return {talent:s.talent,technique:s.technique,reseau:s.reseau,reputation:s.reputation,pressure:state.pressure,confidence:state.club?state.club.confidence:0,vestiaire:g.vestiaire,supporters:g.supporters,formation:g.formation,staff:g.staff}; }
function coachContinueChoiceResult(){
  const r=state.pendingResult; state.pendingResult=null; state.pendingChoice=null;
  if(state.ended){ render(); return; }
  if(r.next==='phase'){ coachSimulatePhase(); render(); return; }
  if(r.next==='offers'){ coachOpenOffers(); render(); return; }
  coachIntersaison(); render();
}
/* ---------- Une phase = une suite de journées jouées une par une ---------- */
function coachSimulatePhase(){ coachBeginPhase(); }
function coachBeginPhase(){
  const comp=state.comp; state.matchday=state.phase===0?0:comp.phaseEnds[state.phase-1]; state.phaseMatches=[]; state.phaseNotes=[];
  if(!state.approach) state.approach='equilibre'; if(!state.training) state.training='tactique'; const ss=state.seasonStats; if(ss){ ss.injuries=ss.injuries||[]; ss.youthWeeks=ss.youthWeeks||0; }
  if(state.phase>0) state.squad.forEach(p=>{ p.fitness=clamp(fit(p)+10,0,100); });
  coachNextMatch();
}
function coachSquadMap(){ return Object.fromEntries(state.squad.map(p=>[p.id,p])); }
/* Prépare la prochaine journée : compo par défaut (celle d'avant si valide, sinon automatique) */
function coachNextMatch(){
  const comp=state.comp, c=state.club;
  if(state.matchday>=comp.phaseEnds[state.phase]){ coachFinishPhase(); return; }
  const fx=ourFixture(comp,state.matchday,c.name);
  if(!fx){ playOthers(comp,state.matchday,c.name); state.matchday++; coachNextMatch(); return; }
  const year=state.year, f=FORMATIONS[state.formation];
  const prev=state.match&&state.match.done?state.match:null;
  let xi=[],bench=[];
  if(prev){ xi=prev.xi.map(id=>state.squad.find(p=>p.id===id)).filter(p=>p&&availableForMatch(p)); bench=prev.bench.map(id=>state.squad.find(p=>p.id===id)).filter(p=>p&&availableForMatch(p)&&!xi.includes(p)); }
  if(xi.length<11){ const auto=autoLineup(state.squad,f,year); const add=auto.xi.filter(p=>!xi.includes(p)); while(xi.length<11&&add.length) xi.push(add.shift()); bench=bench.filter(p=>!xi.includes(p)); auto.bench.forEach(p=>{ if(bench.length<benchSize(year)&&!xi.includes(p)&&!bench.includes(p)) bench.push(p); }); }
  bench=bench.slice(0,benchSize(year));
  let captain=state.captainId!=null?xi.find(p=>p.id===state.captainId):null; if(!captain) captain=defaultCaptain(xi);
  state.match=newMatch({year,home:fx.isHome,usName:c.name,themName:fx.opp,themStrength:comp.strength[fx.opp]+rand(-1.5,1.5),themStyle:oppStyle(comp,fx.opp,year),themNat:comp.nat,ourStyle:state.styleId,xi,bench,captain,approach:state.approach,formation:state.formation,matchday:state.matchday,label:`Journée ${state.matchday+1}`});
  state.pendingChoice='prematch'; saveGame();
}
/* Modifications de compo depuis l'écran d'avant-match */
function coachToggleLineup(pid){
  const m=state.match; if(!m||m.half!==0||m.minute) return; const p=state.squad.find(x=>x.id===pid); if(!p||!availableForMatch(p)) return;
  if(m.xi.includes(pid)){ m.xi=m.xi.filter(id=>id!==pid); if(m.bench.length<benchSize(state.year)) m.bench.push(pid); }
  else if(m.bench.includes(pid)){ m.bench=m.bench.filter(id=>id!==pid); }
  else { if(m.xi.length<11) m.xi.push(pid); else if(m.bench.length<benchSize(state.year)) m.bench.push(pid); }
  m.onPitch=[...m.xi]; if(m.captain!=null&&!m.xi.includes(m.captain)) m.captain=null;
  render();
}
function coachAutoLineup(){ const m=state.match; if(!m) return; const a=autoLineup(state.squad,FORMATIONS[m.formation],state.year); m.xi=a.xi.map(p=>p.id); m.bench=a.bench.map(p=>p.id); m.onPitch=[...m.xi]; if(m.captain==null||!m.xi.includes(m.captain)){ const c=defaultCaptain(a.xi); m.captain=c?c.id:null; } render(); }
function coachSetMatchOption(key,value){ const m=state.match; if(!m) return; if(key==='formation'){ m.formation=value; state.formation=value; } else if(key==='approach'){ m.approach=value; state.approach=value; } else if(key==='training'){ state.training=value; } else if(key==='captain'){ m.captain=Number(value); state.captainId=m.captain; } render(); }
function coachKickoff(auto=false){
  const m=state.match; if(!m||m.half!==0) return; const P=coachSquadMap(); const year=state.year;
  // compo incomplète : on complète automatiquement
  m.xi=m.xi.filter(id=>P[id]&&availableForMatch(P[id])); m.bench=m.bench.filter(id=>P[id]&&availableForMatch(P[id])&&!m.xi.includes(id));
  if(m.xi.length<11){ const a=autoLineup(state.squad,FORMATIONS[m.formation],year); a.xi.forEach(p=>{ if(m.xi.length<11&&!m.xi.includes(p.id)){ m.xi.push(p.id); m.bench=m.bench.filter(id=>id!==p.id); } }); }
  if(m.captain==null||!m.xi.includes(m.captain)){ const c=defaultCaptain(m.xi.map(id=>P[id])); m.captain=c?c.id:null; }
  state.captainId=m.captain; m.onPitch=[...m.xi]; m.played={}; m.xi.forEach(id=>{ m.played[id]={min:0,start:true,goals:0,assists:0,yellow:0,red:0,inj:0,sub:false}; });
  if(!state.approach) state.approach='equilibre'; if(!state.training) state.training='tactique';
  m.bonus=coachBonus(); m.approach=state.approach; matchFactors(m,P,{extra:coachBonusLines()});
  const ctx={injuryMult:1-(state.gauges.staff-50)*.006};
  matchPlayHalf(m,P,ctx);
  if(auto){ matchApplyHalftime(m,P,'keep',{}); matchPlayHalf(m,P,ctx); coachAfterMatchSim(); return; }
  state.pendingChoice='halftime'; saveGame();
}
function coachHalftime(choiceId){
  const m=state.match; if(!m||m.half!==1||m.done) return; const P=coachSquadMap();
  matchApplyHalftime(m,P,choiceId,{management:state.stats.technique,vestiaire:state.gauges.vestiaire});
  if(choiceId==='talk'&&m.talkResult==='ko') state.gauges.vestiaire=clamp(state.gauges.vestiaire-2);
  matchPlayHalf(m,P,{injuryMult:1-(state.gauges.staff-50)*.006});
  coachAfterMatchSim(); render();
}
/* Après le coup de sifflet final : classement, autres matchs, effectif, statistiques */
function coachAfterMatchSim(){
  const m=state.match, comp=state.comp, c=state.club, ss=state.seasonStats, P=coachSquadMap();
  const ha=matchHomeAway(m); recordResult(comp,ha.home,ha.away,ha.gh,ha.ga); playOthers(comp,state.matchday,c.name);
  const susp=matchApplyToSquad(m,P,state.year); serveSuspensions(state.squad,m);
  ss.goals+=m.gu; ss.conceded+=m.gt; ss.injuries=ss.injuries||[]; Object.entries(m.played).forEach(([id,s])=>{ if(s.inj&&P[id]) ss.injuries.push(`${P[id].name} (${s.inj} sem.)`); });
  Object.entries(m.played).forEach(([id,s])=>{ const p=P[id]; if(!p||!s.min) return; if(s.goals) ss.scorers[p.name]=(ss.scorers[p.name]||0)+s.goals; });
  const N=Math.max(1,comp.phaseEnds[state.phase]-(state.phase===0?0:comp.phaseEnds[state.phase-1]));
  state.squad.forEach(p=>{ const s=m.played[p.id]; if(s&&s.min){ ss.minutes[p.id]=(ss.minutes[p.id]||0)+(s.start?1:.4)/N; if(p.promised) p.morale=clamp(p.morale+.3); else p.morale=clamp(p.morale+.15); } else if(!p.injury&&!p.suspended){ ss.minutes[p.id]=(ss.minutes[p.id]||0)+.1/N; if(p.promised) p.morale=clamp(p.morale-1.2); else if(playerRating(p,state.year)>=c.strength-2) p.morale=clamp(p.morale-.4); } });
  const res=matchResult(m); ss.form=clamp(ss.form*.85+(res==='W'?.4:res==='L'?-.4:0),-2.5,2.5);
  ss.injuries=ss.injuries||[];
  const rec={home:ha.home,away:ha.away,gh:ha.gh,ga:ha.ga,us:m.home?'home':'away',res,matchday:m.matchday,ht:m.ht,story:m.story,scorers:matchScorersText(m,P),events:m.events,ratings:m.ratings,motm:m.motm,xi:m.xi,bench:m.bench,factors:m.factors,strength:Math.round(m.strengthUs*10)/10,themStrength:Math.round(m.themStrength),themStyle:m.themStyle,approach:m.approach,htChoice:m.htChoice||null,htNote:m.htNote||'',suspensions:susp,pos:tablePos(comp.table,c.name)};
  state.phaseMatches.push(rec); state.lastMatch=rec; state.matchday++;
  if(state.training==='jeunes') ss.youthWeeks=(ss.youthWeeks||0)+1;
  log(`${res==='W'?'✅':res==='L'?'❌':'➖'} J${m.matchday+1} : ${ha.home} ${ha.gh}–${ha.ga} ${ha.away}. ${m.story}`);
  state.pendingChoice='matchResult'; saveGame();
}
function coachAfterMatch(){
  const notes=recoverSquad(state.squad,state.year,{training:state.training,staff:state.gauges.staff}); if(notes.length) state.seasonStats.injuries.push(...notes);
  coachNextMatch(); render();
}
/* Joue toutes les journées restantes de la phase avec la compo automatique */
function coachSimPhase(){
  let guard=0;
  while((state.pendingChoice==='prematch'||state.pendingChoice==='matchResult')&&guard++<60){
    if(state.pendingChoice==='prematch'){ if(!state.match||state.match.half!==0) break; coachAutoLineupSilent(); coachKickoff(true); }
    else { const notes=recoverSquad(state.squad,state.year,{training:state.training,staff:state.gauges.staff}); if(notes.length) state.seasonStats.injuries.push(...notes); coachNextMatch(); }
  }
  render();
}
function coachAutoLineupSilent(){ const m=state.match; const a=autoLineup(state.squad,FORMATIONS[m.formation],state.year); m.xi=a.xi.map(p=>p.id); m.bench=a.bench.map(p=>p.id); m.onPitch=[...m.xi]; if(m.captain==null||!m.xi.includes(m.captain)){ const c=defaultCaptain(a.xi); m.captain=c?c.id:null; } }
/* Bilan de phase : confiance du président, pression, jauges */
function coachFinishPhase(){
  const comp=state.comp, c=state.club, ss=state.seasonStats; const mine=state.phaseMatches||[];
  const goalsFor=mine.reduce((n,m)=>n+(m.us==='home'?m.gh:m.ga),0), goalsAg=mine.reduce((n,m)=>n+(m.us==='home'?m.ga:m.gh),0);
  const W=mine.filter(m=>m.res==='W').length, D=mine.filter(m=>m.res==='D').length, L=mine.filter(m=>m.res==='L').length;
  const pos=tablePos(comp.table,c.name), N=comp.teams.length;
  const gap=c.objectivePos-pos; let dConf=clamp(gap*1.4,-9,9)+(W-L)*.8; if(pos<=3) dConf+=2; if(pos>N-3) dConf-=5;
  if(squadWages()>c.wageCap*1.1) dConf-=3;
  if(dConf<0){ dConf/=c.tolerance; dConf*=(1-state.perks.confidenceRes); }
  const confBefore=c.confidence; c.confidence=clamp(c.confidence+dConf);
  state.pressure=clamp(state.pressure+(L-W)*1.2*state.mode.pressureMult+(pos>c.objectivePos?3:-2)*state.mode.pressureMult-state.perks.pressureRes*.2+(state.gauges.supporters<35?2:0));
  state.gauges.supporters=clamp(state.gauges.supporters+(W-L)*1.5+(goalsFor>goalsAg*1.5?2:0));
  state.gauges.vestiaire=clamp(state.gauges.vestiaire+(W-L)*.8-(state.squad.filter(p=>p.morale<35).length)*1.5);
  const injuries=(ss.injuries||[]).splice(0);
  const phaseRec={n:state.phase+1,matches:mine.map(m=>({home:m.home,away:m.away,gh:m.gh,ga:m.ga,us:m.us,res:m.res,story:m.story,scorers:m.scorers})),W,D,L,gf:goalsFor,ga:goalsAg,pos,dConf:Math.round(dConf),confBefore,injuries,table:sortTable(comp.table).map(t=>({...t})),strength:Math.round(coachStrength())};
  ss.phases.push(phaseRec); state.lastPhase=phaseRec; state.match=null;
  log(`📊 Phase ${state.phase+1} : ${W} V · ${D} N · ${L} D. ${c.name} est ${ordinal(pos)} en ${c.leagueName}. Confiance du président ${Math.round(confBefore)} → ${Math.round(c.confidence)}.`);
  state.phase++;
  state.pendingChoice='phaseResult'; saveGame();
}
function coachAfterPhase(){
  const c=state.club;
  if(c.confidence<=0){ coachSacked(); render(); return; }
  if(state.phase>=4){ coachEndSeason(); render(); return; }
  if(state.pressure>=100){ state.pendingChoice='pressureCrisis'; unlockTrophy('x-pressure'); render(); return; }
  if(state.phase===2&&eraHasWinterMercato(state.year)){ coachOpenMercato(true); render(); return; }
  coachPlayPhase(); render();
}
function coachSacked(){
  const c=state.club; state.sackings++; state.consecutiveSackings++; unlockTrophy('c-sacked'); if(state.sackings>=3) unlockTrophy('c-sacked-3');
  const pos=state.comp?tablePos(state.comp.table,c.name):null;
  state.history.push({year:state.year,club:c.name,league:c.leagueName,tier:c.tier,pos,objective:c.objectivePos,sacked:true,phase:state.phase});
  log(`🪓 <b>${c.name}</b> te licencie après la phase ${state.phase}. ${capitalize(c.presidentName)} a perdu patience.`);
  state.stats.reputation=clamp(state.stats.reputation-6); state.pressure=clamp(state.pressure+8);
  c.sacked=true; state.comp=null; state.match=null; state.year++; state.age++;
  state.pendingChoice='sacked';
}
function coachEndSeason(){
  const c=state.club, comp=state.comp, ss=state.seasonStats, year=state.year;
  const table=sortTable(comp.table), pos=tablePos(comp.table,c.name), N=comp.teams.length;
  const champion=pos===1, relegated=pos>N-3, objectiveMet=pos<=c.objectivePos;
  const promotion=champion&&(c.tier==='amateur'||c.tier==='ligue2'); const tierBefore=c.tier;
  // coupe nationale
  const cupRounds=c.tier==='amateur'?6:5; const dkc=decadeKey(year);
  const bigPool=c.nat==='FR'?FR_CLUBS.filter(x=>x.s[dkc]>=3).map(x=>({name:x.n,strength:tierBaseStrength('ligue1',x.s[dkc])+2})):comp.teams.filter(n=>n!==c.name).map(n=>({name:n,strength:comp.strength[n]+2})).sort((a,b)=>b.strength-a.strength).slice(0,8);
  const smallPool=c.nat==='FR'?FR_LOWER.map(n=>({name:n,strength:52})).concat(FR_CLUBS.filter(x=>!x.s[dkc]||x.s[dkc]<3).map(x=>({name:x.n,strength:x.s[dkc]?tierBaseStrength('ligue1',x.s[dkc]):58}))):comp.teams.filter(n=>n!==c.name).map(n=>({name:n,strength:comp.strength[n]}));
  const opps=shuffledCopy(smallPool).filter(o=>o.name!==c.name).slice(0,cupRounds-3).concat(shuffledCopy(bigPool).filter(o=>o.name!==c.name).slice(0,3)).sort((a,b)=>a.strength-b.strength);
  state.cup=simCup(cupRounds,coachStrength,opps); const cupWon=state.cup.won;
  // coupe d'Europe (qualification acquise la saison précédente)
  let euro=null;
  if(c.euroQualified){ const dk=decadeKey(year); const euOpps=shuffledCopy(EU_CLUBS.filter(x=>x.s[dk]>=3&&x.n!==c.name)).slice(0,5).map(x=>({name:x.n,strength:tierBaseStrength('europe',x.s[dk])})).sort((a,b)=>a.strength-b.strength); euro=simCup(5,coachStrength,euOpps); euro.name=c.euroKind==='euro'?coachEra().euroCup:coachEra().euroCup2; euro.kind=c.euroKind; state.euro=euro; }
  else state.euro=null;
  const euroWon=euro&&euro.won;
  // qualification pour l'an prochain
  const euroSlots=c.tier==='ligue1'||c.tier==='europe'||c.tier==='superclub'?(pos<=3?'euro':pos<=6?'euro2':null):null;
  c.euroQualified=!!euroSlots; c.euroKind=euroSlots;
  // récompense individuelle
  const overperf=c.objectivePos-pos; let award=null;
  if((champion&&c.tier!=='amateur')||overperf>=6||euroWon){ if(Math.random()<.5){ award="Entraîneur·euse de l'année"; state.awards++; unlockTrophy('c-coach-year'); } }
  // confiance et stats
  let dConf=objectiveMet?12:-(pos-c.objectivePos)*3; if(champion) dConf+=15; if(cupWon) dConf+=8; if(euroWon) dConf+=20; if(relegated) dConf-=25;
  if(dConf<0) dConf/=c.tolerance;
  c.confidence=clamp(c.confidence+dConf);
  const s=state.stats; s.reputation=clamp(s.reputation+clamp(overperf*1,-5,5)+(champion?4:0)+(cupWon?2:0)+(euroWon?6:0)+(relegated?-6:0)+(c.tier==='superclub'?1:0)+(c.tier==='amateur'?-1:0)+(55-s.reputation)*.06);
  s.talent=clamp(s.talent+1+(overperf>0?1:0)); s.technique=clamp(s.technique+1.5+(state.squad.length>22?.5:0)); s.reseau=clamp(s.reseau+1+(c.tier!=='amateur'&&c.tier!=='ligue2'?1.5:0)+(c.nat!=='FR'?1.5:0));
  state.pressure=clamp(state.pressure+(objectiveMet?-8:6)*state.mode.pressureMult-4);
  state.gauges.supporters=clamp(state.gauges.supporters+(champion?12:objectiveMet?5:-4)+(relegated?-12:0));
  if(objectiveMet) state.gauges.vestiaire=clamp(state.gauges.vestiaire+3);
  // titres et badges
  if(champion){ if(promotion){ state.titles.promo++; unlockTrophy(tierBefore==='amateur'?'c-title-nat':'c-title-l2'); } else { state.titles.league++; unlockTrophy(c.nat==='FR'?'c-title-l1':'c-title-eu'); } }
  // Montée et descente changent le palier du club pour la saison suivante
  if(promotion){ c.tier=tierBefore==='amateur'?'ligue2':'ligue1'; c.s=c.tier==='ligue1'?1:0; c.strength=tierBaseStrength(c.tier,c.s); c.euroQualified=false; }
  else if(relegated&&c.nat==='FR'&&(c.tier==='ligue1'||c.tier==='ligue2')){ c.tier=c.tier==='ligue1'?'ligue2':'amateur'; c.s=0; c.strength=tierBaseStrength(c.tier,c.s); c.euroQualified=false; }
  if(cupWon){ state.titles.cup++; unlockTrophy('c-cup'); } if(euroWon){ if(euro.kind==='euro'){ state.titles.euro++; unlockTrophy('c-euro'); } else { state.titles.euro2++; unlockTrophy('c-euro2'); } }
  if(champion&&cupWon&&euroWon&&euro.kind==='euro') unlockTrophy('c-treble'); else if(champion&&cupWon) unlockTrophy('c-double');
  if(relegated) unlockTrophy('c-relegated'); if(state.history.length===0) unlockTrophy('c-first');
  // développement, contrats, retraites
  const devNotes=developSquad(state.squad,year,{minutes:ss.minutes,formation:state.gauges.formation,staff:state.gauges.staff,vestiaire:state.gauges.vestiaire,youthWeeks:ss.youthWeeks||0});
  const contracts=[]; const nextYear=year+1;
  state.squad=state.squad.filter(p=>{ const age=playerAge(p,nextYear); const r=playerRating(p,nextYear);
    if(age>=35&&r<c.strength-12){ contracts.push(`${p.name} prend sa retraite`); return false; }
    if(p.contractEnd<=year){ if(r>=c.strength-8){ p.contractEnd=nextYear+randInt(1,3); p.wage*=1.1; contracts.push(`${p.name} prolonge`); return true; } contracts.push(`${p.name} part libre`); return false; }
    return true; });
  state.squad.forEach(p=>{ if(playerAge(p,nextYear)<=21&&playerRating(p,nextYear)>=85&&!p.real) unlockTrophy('m-youth-star'); if(p.joinedYear===year&&p.wage<=.02&&(ss.minutes[p.id]||0)>=3) unlockTrophy('m-free'); });
  const topScorer=Object.entries(ss.scorers).sort((a,b)=>b[1]-a[1])[0];
  const bestPlayer=[...state.squad].filter(p=>(p.rated||0)>=8).sort((a,b)=>(b.sumRating/b.rated)-(a.sumRating/a.rated))[0];
  const season={year,club:c.name,league:c.leagueName,tier:c.tier,pos,teams:N,objective:c.objectivePos,objectiveMet,champion,promotion,relegated,cupWon,cupRounds:state.cup.roundsReached,cupPath:state.cup.path,euro:euro?{name:euro.name,won:euro.won,rounds:euro.roundsReached,path:euro.path}:null,award,goals:ss.goals,conceded:ss.conceded,topScorer:topScorer?`${topScorer[0]} (${topScorer[1]})`:null,bestPlayer:bestPlayer?`${bestPlayer.name} (${(bestPlayer.sumRating/bestPlayer.rated).toFixed(2)})`:null,table:table.map(t=>({...t})),phases:ss.phases.map(p=>({n:p.n,W:p.W,D:p.D,L:p.L,pos:p.pos})),devNotes,contracts,dConf:Math.round(dConf),confidence:Math.round(c.confidence),formation:state.formation,style:styleById(state.styleId).name,budgetUsed:c.budget-(state.market?state.market.budgetLeft:0)};
  state.history.push(season); state.lastSeason=season;
  c.since=c.since||1;
  if(c.since>=6) unlockTrophy('c-loyal'); if(state.clubsCoached.length>=8) unlockTrophy('c-nomad'); if(state.history.filter(h=>!h.sacked).length>=10) unlockTrophy('c-ten');
  const eraBefore=eraForYear(year).id; state.year++; state.age++; if(eraForYear(state.year).id!==eraBefore){ unlockTrophy('c-era-cross'); log(`⏳ Nouvelle époque : <b>${eraForYear(state.year).name}</b>. ${eraForYear(state.year).tagline}`); }
  state.consecutiveSackings=0; state.comp=null; state.match=null;
  log(`🏁 Saison ${year}-${year+1} terminée : ${c.name} ${ordinal(pos)} sur ${N} en ${c.leagueName}${champion?' — CHAMPION 🏆':''}${cupWon?' — Coupe 🥇':''}${euroWon?` — ${euro.name} ⭐`:''}. ${objectiveMet?'Objectif atteint.':'Objectif manqué.'}`);
  state.pendingChoice='seasonEnd'; saveGame();
}
function coachAfterSeasonEnd(){
  const c=state.club;
  if(c.confidence<35){ log(`🪓 ${capitalize(c.presidentName)} ne te renouvelle pas sa confiance : tu quittes ${c.name}.`); state.sackings++; unlockTrophy('c-sacked'); c.sacked=true; state.stats.reputation=clamp(state.stats.reputation-3); }
  coachIntersaison(); render();
}
/* ---------- Intersaison ---------- */
function coachIntersaison(){
  if(coachCheckEnd()){ render(); return; }
  if(state.pressure>=100){ state.pendingChoice='pressureCrisis'; unlockTrophy('x-pressure'); return; }
  if(state.pressure>=90&&Math.random()<.01){ unlockTrophy('x-death'); coachEnd(`À ${Math.round(state.pressure)}/100 de pression, ton cœur lâche pendant l'intersaison. Le football perd un·e entraîneur·euse.`,'death'); return; }
  if(state.pressure>=85&&!(state.pressureCrisisCooldown>0)&&Math.random()<.5){ state.pendingChoice='pressureCrisis'; unlockTrophy('x-pressure'); return; }
  if(state.pressureCrisisCooldown>0) state.pressureCrisisCooldown--;
  state.pressure=clamp(state.pressure-6);
  const n=state.history.length;
  if(n>=3&&n-state.lastRouletteSeason>=5&&state.rouletteCount<2&&Math.random()<.12){ state.currentRoulette={event:pickNoRepeat('c-roulette',COACH_ROULETTES),outcomes:shuffledCopy([Math.random()<.5?'end':'malus','jackpot','small','malus'])}; state.rouletteCount++; state.lastRouletteSeason=n; state.pendingChoice='roulette'; return; }
  const g=state.gauges; const low=Object.keys(g).filter(k=>g[k]<40);
  if(low.length&&Math.random()<.5){ const pool=COACH_DILEMMAS.filter(d=>low.includes(d.gauge)); state.currentEvent={kind:'dilemma',event:pick(pool)}; state.pendingChoice='event'; return; }
  if(Math.random()<.45){ const pool=COACH_HAPPENINGS.filter(e=>(!e.minYear||state.year>=e.minYear)&&(!e.maxYear||state.year<=e.maxYear)); state.currentEvent={kind:'happening',event:pickNoRepeat('c-happenings',pool)}; state.pendingChoice='event'; return; }
  coachOpenOffers();
}
function coachChooseRoulette(i){
  const r=state.currentRoulette, ev=r.event, out=r.outcomes[i];
  if(out==='end'){ unlockTrophy('r-death'); log(`${ev.icon} ${ev.title} → ${ev.choices[i]}. ☠️ ${ev.endText}`); state.currentRoulette=null; coachEnd(`${ev.icon} ${ev.endText}`,'roulette'); render(); return; }
  const before=coachSnapshot(); let effects, narrative;
  if(out==='jackpot'){ effects={talent:10,technique:10,reseau:12,reputation:12,pressure:-25,vestiaire:15,supporters:15,formation:10,staff:10,confidence:25,budget:.8}; narrative=ev.jackpotText; unlockTrophy('r-jackpot'); }
  else if(out==='malus'){ effects={talent:-4,reseau:-5,reputation:-6,pressure:12,vestiaire:-8,supporters:-6,confidence:-15,budget:-.2}; narrative="Un revers sérieux sans détruire ta carrière : ta réputation, ton vestiaire et la patience du président encaissent le choc."; unlockTrophy('r-malus'); }
  else { effects={talent:3,technique:3,reputation:3,pressure:-5,vestiaire:4,confidence:5}; narrative="Une seule porte s'entrouvre modestement : un peu d'élan pour la suite."; unlockTrophy('r-small'); }
  const extra=coachApplyEffects(effects); log(`${ev.icon} <b>${ev.title}</b> → ${ev.choices[i]}. ${narrative}`);
  state.pendingResult={title:`${ev.icon} ${ev.title}`,subtitle:ev.choices[i],narrative,before,after:coachSnapshot(),extra,next:'offers'}; state.currentRoulette=null; state.pendingChoice='choiceResult'; render();
}
const PRESSURE_CHOICES=[
 {id:'pause',icon:'🏖️',label:"Arrêter trois ans",sub:"Tu quittes tout. Trois saisons blanches, une pression qui retombe, un réseau qui s'érode.",years:3,effects:{pressure:-70,reseau:-8,reputation:-6}},
 {id:'delegate',icon:'🪑',label:"Déléguer une saison à ton adjoint",sub:"Ton nom reste sur la porte, ton adjoint prend le banc. La pression retombe, la réputation s'effrite.",years:1,effects:{pressure:-40,reputation:-3,staff:5}},
 {id:'push',icon:'💀',label:"Continuer coûte que coûte",sub:"Le corps tiendra. Peut-être. 50 % de risque de mort immédiate.",deathChance:.5,effects:{pressure:-15,technique:-4}},
];
function coachChoosePressure(i){
  const ch=PRESSURE_CHOICES[i]; if(!ch) return;
  if(ch.deathChance&&Math.random()<ch.deathChance){ unlockTrophy('x-death'); coachEnd(`Tu as choisi de continuer coûte que coûte à ${Math.round(state.pressure)}/100 de pression. Un malaise en plein match met fin à ta vie et à ta carrière.`,'death'); render(); return; }
  if(ch.deathChance) unlockTrophy('x-push'); if(ch.id==='pause') unlockTrophy('x-pause');
  const before=coachSnapshot(); coachApplyEffects(ch.effects);
  if(ch.years){ state.year+=ch.years; state.age+=ch.years; if(state.club){ state.club.sacked=true; } state.comp=null; log(`${ch.icon} ${ch.label}. Tu reviens en ${state.year}, à ${state.age} ans.`); }
  state.pressureCrisisCooldown=2;
  const inSeason=!!state.comp&&state.phase<4&&!ch.years;
  state.pendingResult={title:'🌡️ Crise de pression',subtitle:ch.label,narrative:ch.sub,before,after:coachSnapshot(),extra:[],next:inSeason?'phase':'offers'}; state.pendingChoice='choiceResult'; render();
}
/* ---------- Fin ---------- */
function coachCheckEnd(){
  if(state.ended) return true;
  if(state.age>=75){ unlockTrophy('c-old'); coachEnd("Tu atteins 75 ans : après une longue vie de football, le jeu clôt cette carrière et ouvre son bilan.",'age'); return true; }
  if(state.consecutiveSackings>=4){ coachEnd("Quatre licenciements d'affilée. Plus aucun président ne veut de toi : la carrière s'arrête.",'sacked'); return true; }
  if(state.noOfferYears>=2){ coachEnd(`Deux années sans proposition. À ${state.age} ans, le téléphone ne sonnera plus.`,'noOffers'); return true; }
  return false;
}
function coachScore(){ const t=state.titles; return Math.round(state.history.filter(h=>!h.sacked).length*10+t.league*60+t.promo*25+t.cup*30+t.euro*120+t.euro2*50+state.awards*40+state.history.filter(h=>h.objectiveMet).length*8-state.sackings*10); }
function coachEnd(reason,cause){
  if(state.ended) return; state.ended=true; state.endingText=reason; state.endingCause=cause; state.pendingChoice='end';
  saveToHall({kind:'coach',name:state.name,mode:state.modeName,era:eraForYear(state.year).name,seasons:state.history.filter(h=>!h.sacked).length,titles:state.titles.league+state.titles.euro+state.titles.cup+state.titles.euro2+state.titles.promo,age:state.age,cause,score:coachScore(),date:new Date().toISOString().slice(0,10)});
  clearSave('coach');
}
function coachEpithet(){ const t=state.titles, n=state.history.length; if(t.euro>=2) return "Légende européenne"; if(t.league>=3) return "Collectionneur·euse de titres"; if(t.euro>=1) return "Conquérant·e de l'Europe"; if(state.sackings>=4) return "Habitué·e des cartons"; if(state.clubsCoached.length>=8) return "Globe-trotteur·euse des bancs"; if(t.promo>=3) return "Spécialiste des montées"; if(state.club&&state.club.since>=6) return "Bâtisseur·euse fidèle"; if(n>=15) return "Monument de patience"; if(n<=2) return "Météorite"; return "Honnête artisan·e du ballon"; }
