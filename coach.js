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
const GAUGE_INFO={vestiaire:{icon:'✊',label:"Vestiaire",help:"Cohésion du groupe : force de l'équipe, grèves, ambiance."},supporters:{icon:'📣',label:"Supporters",help:"Ferveur : pression du public, patience en cas de crise, recettes."},formation:{icon:'🎓',label:"Formation",help:"Qualité du centre : progression des jeunes, moins d'arnaques."},staff:{icon:'🧑‍🤝‍🧑',label:"Staff",help:"Qualité du staff : blessures, préparation, développement."},proches:{icon:'🏡',label:"Proches",help:"Ta vie en dehors du terrain : elle amortit la pression, et c'est ce qui reste quand le football s'arrête."}};

/* ---------- Où passe ton année : deux priorités, trois renoncements ----------
   Le temps d'une saison est fini. Tout ce que tu ne choisis pas recule. */
const FOCUS_AREAS={
  terrain:{icon:'⚽',label:"Le terrain",desc:"Vidéo, séances, adversaires décortiqués.",gain:{talent:5,technique:1},loss:{talent:-2}},
  vestiaire:{icon:'🤝',label:"Le vestiaire",desc:"Les entretiens un à un, les cas difficiles, les egos.",gain:{vestiaire:9,technique:3},loss:{vestiaire:-6}},
  centre:{icon:'🎓',label:"Le centre",desc:"Les jeunes, les éducateurs, les matchs de la réserve.",gain:{formation:10},loss:{formation:-6}},
  club:{icon:'📣',label:"Le club et les médias",desc:"Le président, la presse, les sponsors, le carnet d'adresses.",gain:{reseau:5,reputation:4,supporters:5,confidence:4},loss:{reseau:-2,supporters:-4,confidence:-3}},
  proches:{icon:'🏡',label:"Tes proches",desc:"Les dîners, les anniversaires, les gens qui t'attendent.",gain:{proches:16,pressure:-9},loss:{proches:-7,pressure:3}},
};
/* Plus d'écran de priorités en début de saison : ces chantiers sont désormais
   le menu des « carrefours » (COACH_CROSSROADS), un par phase, amenés par une situation. */

function coachFreshState(c){
  const mode=c.mode, era=c.era;
  const st={talent:32,technique:28,reseau:18,reputation:40};
  const alias={repPublic:'reputation',repCritique:'reputation',moral:'technique'};
  [c.origin,c.nationality,c.mentor,c.quality,c.flaw].forEach(o=>Object.entries((o&&o.bonus)||{}).forEach(([k,v])=>{ const key=alias[k]||k; if(key in st) st[key]+=v; }));
  Object.keys(st).forEach(k=>st[k]=clamp(st[k]));
  const gauges={vestiaire:50,supporters:50,formation:40+(mode.youthBonus||0)+(c.origin.youthBonus||0),staff:45,proches:62};
  [c.quality,c.flaw].forEach(o=>Object.entries((o&&o.gauge)||{}).forEach(([k,v])=>gauges[k]=clamp(gauges[k]+v)));
  return { kind:'coach', name:c.name, year:era.start, startYear:era.start, startEra:era.id, age:30, modeId:mode.id, modeName:mode.name, modeIcon:mode.icon, mode:{budgetMult:mode.budgetMult,toleranceMult:mode.toleranceMult,variance:mode.variance,incidentMult:mode.incidentMult*(c.flaw.incidentMult||1),objMult:mode.objMult||1,pressureMult:mode.pressureMult||1},
    originName:c.origin.name, nationality:c.nationality, nationalityStyles:(c.nationality&&c.nationality.favoredStyleIds)||[], favoriteStyleId:c.favoriteStyle.id, mentorName:c.mentor.name, mentorStyles:c.mentor.styleIds||[], qualityName:c.quality.name, flawName:c.flaw.name,
    perks:{pressureRes:(c.origin.pressureRes||0)+(c.quality.pressureRes||0)+(c.flaw.pressureRes||0),confidenceRes:(c.quality.confidenceRes||0)+(c.flaw.confidenceRes||0),scamRes:(c.quality.scamRes||0)+(c.flaw.scamRes||0),budgetLeak:c.flaw.budgetLeak||0},
    stats:st, pressure:8, gauges, cote:clamp(18+(st.reputation-40)*.6+(st.reseau-18)*.2,10,60), coteDelta:0, tempo:'temps_forts', skipped:[], sinceLast:[], alerts:[], club:null, squad:[], usedNames:[], formation:'4-4-2', styleId:c.favoriteStyle.id, approach:'equilibre', training:'tactique', captainId:null, comp:null, phase:0, matchday:0, match:null, phaseMatches:[], seasonStats:null, cup:null, euro:null,
    history:[], sackings:0, consecutiveSackings:0, clubsCoached:[], titles:{league:0,cup:0,euro:0,euro2:0,promo:0}, awards:0, log:[], pendingChoice:null, currentEvent:null, currentRoulette:null, pendingResult:null, market:null, newBadges:[], lastRouletteSeason:-99, rouletteCount:0, rouletteFate:null, rouletteEcho:null, focus:[], lastFocus:null, seeds:[], pressureCrisisCooldown:0, noOfferYears:0, scamsSuffered:0, stayLocal:false, ended:false, endingText:'', endingCause:null };
}
function coachEra(){ return eraForYear(state.year); }
function usedSet(){ return new Set(state.usedNames); }
function addUsed(name){ if(!state.usedNames.includes(name)) state.usedNames.push(name); }

/* ---------- Offres ---------- */
function tierBudget(tier,s){ return {superclub:{5:250,4:160},europe:{5:180,4:100,3:50,2:30,1:20},ligue1:{5:120,4:60,3:30,2:18,1:10},etranger:{2:12,3:25,4:45,5:60},ligue2:{0:4},amateur:{0:.4}}[tier][s]||(tier==='ligue2'?4:tier==='amateur'?.4:20); }
function accessibleTiers(){
  const n=state.history.length;
  if(state.rouletteFate&&state.rouletteFate.kind==='exile') return ['amateur','ligue2'];
  const tiers=['amateur','ligue2','ligue1'];
  if(state.stats.reseau>=25&&n>=1&&!state.stayLocal) tiers.push('etranger'); if(n>=2&&!state.stayLocal) tiers.push('europe'); if(n>=3&&!state.stayLocal) tiers.push('superclub');
  return tiers;
}
/* ---------- Cote : le niveau de club que ta carrière justifie ---------- */
const TEMPOS={
  complet:{icon:'🎬',label:"Complet",desc:"Chaque journée se joue.",about:"34 matchs par saison"},
  temps_forts:{icon:'⚡',label:"Temps forts",desc:"La reprise de chaque phase, plus les deux matchs qui comptent vraiment : sommets, matchs de la peur, dernière journée, ou un effectif qui change.",about:"une dizaine de matchs par saison"},
  rapide:{icon:'⏩',label:"Rapide",desc:"Seule la reprise de chaque phase s'arrête ; tout le reste se joue avec ta compo et tes réglages.",about:"4 matchs par saison"},
};
function setTempo(t){ if(TEMPOS[t]) state.tempo=t; saveGame(); render(); }
function coteToStrength(cote){ return 46+cote*.42; }
function coachTargetStrength(){ return coteToStrength(state.cote==null?30:state.cote); }
function coteLabel(s){ return s<52?"le monde amateur":s<61?"la Ligue 2":s<67?"le bas de la Ligue 1":s<73?"le milieu de la Ligue 1":s<79?"le haut de tableau et l'Europe":s<85?"un grand club européen":"un super-club"; }
function gapLabel(gap){ return gap>=3?"un cran au-dessus de ta cote":gap>=-2?"dans ta cote":gap>=-6?"un cran en dessous":"bien en dessous de ta cote"; }
const TIER_LEVEL={amateur:.75,ligue2:.9,ligue1:1,etranger:.9,europe:1.1,superclub:1.2};
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
function generateCoachOffers(opts={}){
  const offers=[]; const c=state.club; const target=coachTargetStrength();
  const underContract=!!(c&&!c.sacked&&c.contractEnd>state.year&&!opts.broke);
  // rester : le club te garde tant que la confiance tient ; sous contrat, c'est la voie normale
  if(c&&!c.sacked&&c.confidence>=35&&!opts.noStay){ const o=buildCoachOffer(c.tier,{name:c.name,nat:c.nat,league:c.league,s:c.s}); o.stay=true; o.underContract=underContract; o.title=underContract?`Contrat en cours jusqu'en ${c.contractEnd}`:"Poursuivre le projet : le président propose de prolonger"; if(underContract) o.duration=c.contractEnd-state.year; o.budget*=c.confidence>=70?1.15:.9; o.presidentName=c.presidentName; o.presidentDesc=c.presidentDesc; o.president=c.president; o.tolerance=c.tolerance; o.gap=o.strength-target; offers.push(o); }
  // Destin scellé : l'exclusivité à vie interdit tout autre banc, il ne reste que le club
  const fate=state.rouletteFate;
  if(fate&&fate.kind==='exclusive'){
    if(fate.installed){ if(!offers.length) return []; const o=offers[0]; o.underContract=true; o.duration=null; o.title=`${fate.icon} ${fate.label} : tu ne peux signer nulle part ailleurs`; return [o]; }
    const tier=state.stats.reseau>=20?'superclub':'europe';
    const o=buildCoachOffer(tier); o.gap=o.strength-target; o.budget*=1.6; o.duration=null;
    o.title=`${fate.icon} Le projet de l'émir : des moyens sans fin, et plus jamais d'ailleurs`;
    return [o];
  }
  const tiers=accessibleTiers(); const pool=[]; let tries=0;
  while(pool.length<18&&tries<50){ tries++; const o=buildCoachOffer(pick(tiers)); if((c&&o.club===c.name)||pool.some(x=>x.club===o.club)) continue; o.gap=o.strength-target; pool.push(o); }
  if(underContract&&offers.length){
    // Sous contrat : seuls des clubs plus ambitieux viennent te chercher, et surtout quand ta cote grimpe
    const p=clamp(.08+(state.coteDelta||0)*.05,.05,.6); let count=Math.random()<p?1:0; if(count&&Math.random()<.35) count++;
    pool.filter(o=>o.gap>=-1&&o.gap<=6).sort((a,b)=>b.strength-a.strength).slice(0,count).forEach(o=>{ o.poach=true; offers.push(o); });
  } else {
    let count=2+(state.history.length>=2?1:0)+(state.cote>=60?1:0); count=Math.min(4,count);
    if(state.age>=62&&state.cote<40) count--; if(state.age>=68&&state.cote<55) count--;
    let fit=pool.filter(o=>o.gap>=-7&&o.gap<=4); if(fit.length<2) fit=pool.filter(o=>o.gap>=-12&&o.gap<=6); if(fit.length<2) fit=[...pool].sort((a,b)=>Math.abs(a.gap)-Math.abs(b.gap)).slice(0,count+1);
    shuffledCopy(fit).slice(0,Math.max(0,count)).forEach(o=>offers.push(o));
  }
  return offers;
}
/* Rompre son contrat pour écouter le marché : la réputation et la cote en pâtissent */
function coachBreakContract(){
  const c=state.club; if(!c) return;
  state.stats.reputation=clamp(state.stats.reputation-4); state.cote=clamp(state.cote-3); state.coteDelta=-3;
  log(`✂️ Tu romps ton contrat avec ${c.name} pour écouter le marché. La réputation en prend un coup.`);
  state.currentOffers=generateCoachOffers({broke:true,noStay:true}); if(!state.currentOffers.length) state.noOfferYears++; saveGame(); render();
}
function coachOpenOffers(){ state.currentOffers=generateCoachOffers(); state.noOfferYears=state.currentOffers.length?0:state.noOfferYears+1; state.pendingChoice='offers'; coachCheckEnd(); saveGame(); }
function coachSkipYear(){ log(`🛋️ Une année sans banc. Tu observes, tu voyages, tu doutes.`); state.year++; state.age++; state.pressure=clamp(state.pressure-15); state.stats.reputation=clamp(state.stats.reputation-4); state.club=null; state.squad=[]; if(coachCheckEnd()){ render(); return; } coachOpenOffers(); render(); }

/* ---------- Prise de fonction ---------- */
function coachAcceptOffer(i){
  const o=state.currentOffers[i]; if(!o) return;
  const used=usedSet();
  if(o.stay){ state.club.objectivePos=o.objectivePos; state.club.budget=o.budget; state.club.styleWanted=o.styleWanted; state.club.since++; state.club.confidence=clamp(state.club.confidence,30,100); if(!o.underContract) state.club.contractEnd=state.year+o.duration; }
  else {
    if(state.club&&!state.club.sacked) log(o.poach?`🎯 ${o.club} vient te chercher : tu quittes ${state.club.name} en cours de contrat.`:`👋 Tu quittes ${state.club.name}.`);
    const squad=generateSquad(o,state.year,used); squad.forEach(p=>{ if(p.real) addUsed(p.name); });
    state.squad=squad; state.club={name:o.club,tier:o.tier,nat:o.nat,league:o.league,s:o.s,strength:o.strength,leagueName:o.leagueName,president:o.president,presidentName:o.presidentName,presidentDesc:o.presidentDesc,tolerance:o.tolerance,objectivePos:o.objectivePos,budget:o.budget,styleWanted:o.styleWanted,confidence:55,since:1,sacked:false,contractEnd:state.year+(o.duration||2)};
    state.gauges.vestiaire=clamp(state.gauges.vestiaire*.6+30); state.gauges.supporters=clamp(state.gauges.supporters*.5+28);
    if(!state.clubsCoached.includes(o.club)) state.clubsCoached.push(o.club);
    if(state.rouletteFate&&state.rouletteFate.kind==='exclusive'){ state.rouletteFate.installed=true; state.rouletteFate.club=o.club; state.club.contractEnd=9999; state.club.objectivePos=1; state.club.tolerance=Math.min(state.club.tolerance,.7); log(`${state.rouletteFate.icon} Le propriétaire n'accepte qu'une chose : la première place, chaque saison, pour toujours.`); }
    if(o.tier==='etranger'||o.tier==='europe'||o.tier==='superclub') unlockTrophy('c-abroad'); if(o.tier==='superclub') unlockTrophy('c-superclub');
  }
  state.club.wageCap=clubWageCap(state.club);
  state.currentOffers=[];
  log(`📝 ${o.stay?(o.underContract?'Tu poursuis à':'Tu prolonges à'):'Tu signes à'} <b>${o.club}</b> (${o.leagueName})${o.stay&&o.underContract?'':` jusqu'en ${state.club.contractEnd}`}. Objectif : ${ordinal(o.objectivePos)}. Budget transferts : ${$(o.budget)}. ${capitalize(o.presidentName)} : ${o.presidentDesc}`);
  coachOpenMercato(false);
}
function capitalize(s){ return s?s.charAt(0).toUpperCase()+s.slice(1):s; }

/* ---------- Mercato ---------- */
function coachCredibility(){ return credibilityFor(state.club,state.stats.reputation,state.stats.reseau); }
function marketWindow(){ return state.year+(state.market&&state.market.winter?'-H':'-E'); }
function coachOpenMercato(winter){
  const c=state.club;
  // L'hiver rouvre une enveloppe : les restes de l'été plus un quart du budget du club.
  // Sans ça, un été dépensé rendait le mercato d'hiver vide, donc invisible.
  const leftovers=winter&&state.market&&state.market.budgetLeft!=null?state.market.budgetLeft:0;
  const budgetLeft=winter?leftovers+c.budget*.25*(1-state.perks.budgetLeak):c.budget*(1-state.perks.budgetLeak);
  const targets=marketTargets(c,state.year,state.squad,usedSet(),{credibility:coachCredibility(),formation:state.gauges.formation,reseau:state.stats.reseau,winter});
  targets.forEach(t=>{ if(t.p.scam&&Math.random()<state.perks.scamRes) t.p.scam=null; });
  state.market={winter,targets,budgetLeft,bought:[],sold:[],youthBought:0};
  state.pendingChoice='mercato';
}
function squadWages(){ return state.squad.reduce((n,p)=>n+p.wage,0); }
/* Plafond salarial : ce qu'un club de cette force paie à un groupe de 23 joueurs de son niveau, plus un quart de marge (et le mode de jeu) */
function clubWageCap(c){
  const xi=bestXI(state.squad,FORMATIONS[state.formation]||FORMATIONS['4-4-2'],state.year);
  const xiAvg=xi.length?xi.reduce((n,p)=>n+playerRating(p,state.year),0)/xi.length:c.strength;
  const lvl=Math.max(c.strength,xiAvg-2);
  const ref={born:state.year-27,peak:(lvl-1)/ageCurve(27),dev:1,form:0};
  return 23*playerWage(ref,state.year,c.tier)*1.25*Math.sqrt(state.mode.budgetMult||1); }
function foreignCount(){ return state.squad.filter(p=>isForeign(p,state.club.nat)).length; }
/* Ce qui manque pour boucler un dossier : prix, salaire, place, quota. */
function coachBlockers(t){
  const m=state.market, c=state.club, out=[];
  if(!t) return out;
  if(t.access==='no') out.push({k:'access',txt:`${t.p.name} ne répond pas : le club n'est pas à sa hauteur.`});
  if(state.squad.length>=27) out.push({k:'place',txt:"Effectif complet : 27 joueurs maximum."});
  if(t.price>m.budgetLeft+.0001) out.push({k:'budget',txt:`Il manque ${$(t.price-m.budgetLeft)} sur le transfert.`,need:t.price-m.budgetLeft});
  const fmax=eraForeignersMax(state.year);
  if(c.nat==='FR'&&isForeign(t.p,'FR')&&foreignCount()>=fmax) out.push({k:'quota',txt:`Quota d'étrangers atteint (${fmax}).`});
  if(squadWages()+t.wage>c.wageCap) out.push({k:'salaire',txt:`Plafond salarial dépassé de ${$(squadWages()+t.wage-c.wageCap)}.`,needW:squadWages()+t.wage-c.wageCap});
  return out;
}
/* Qui ce joueur viendrait concurrencer, à son poste. */
function coachRivals(t){
  const y=state.year;
  return state.squad.filter(p=>p.pos===t.p.pos).sort((a,b)=>playerRating(b,y)-playerRating(a,y))
    .map(p=>({p,rating:playerRating(p,y),age:playerAge(p,y),value:playerValue(p,y)}));
}
/* Les ventes qui débloqueraient ce dossier, les plus évidentes d'abord. */
function coachSaleOptions(t){
  const y=state.year, b=coachBlockers(t);
  const needM=(b.find(x=>x.k==='budget')||{}).need||0;
  const needW=(b.find(x=>x.k==='salaire')||{}).needW||0;
  const needPlace=b.some(x=>x.k==='place');
  const needQuota=b.some(x=>x.k==='quota');
  if(!needM&&!needW&&!needPlace&&!needQuota) return [];
  return state.squad
    .filter(p=>!(state.market.bought||[]).some(x=>x.p===p))
    .filter(p=>!needQuota||isForeign(p,state.club.nat))
    .map(p=>({p,rating:playerRating(p,y),age:playerAge(p,y),value:playerValue(p,y)*rand(.9,1),wage:p.wage}))
    .filter(x=>(!needM||x.value>0)&&(!needW||x.wage>0))
    .sort((a,b2)=>{
      const fa=(needM?a.value/Math.max(.01,needM):0)+(needW?a.wage/Math.max(.01,needW):0)-a.rating/40;
      const fb=(needM?b2.value/Math.max(.01,needM):0)+(needW?b2.wage/Math.max(.01,needW):0)-b2.rating/40;
      return fb-fa;
    }).slice(0,4);
}
function coachSell(pid){
  const p=state.squad.find(x=>x.id===pid); if(!p) return;
  const justSigned=p.joinedWindow===marketWindow()&&p.paid!=null;
  const price=justSigned?p.paid:playerValue(p,state.year)*rand(.8,1.05);
  state.squad=state.squad.filter(x=>x!==p); state.market.budgetLeft+=price; state.market.sold.push({name:p.name,price});
  if(justSigned){ state.market.bought=state.market.bought.filter(b=>b.p!==p); log(`↩️ ${p.name} repart aussitôt : le transfert est annulé.`); render(); return; }
  if(p.fanFav){ state.gauges.supporters=clamp(state.gauges.supporters-7); } if((playerProfil(p).lead||0)>=.6) state.gauges.vestiaire=clamp(state.gauges.vestiaire-4);
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
  p.joinedWindow=marketWindow();
  state.squad.push(p); m.bought.push({name:p.name,price:t.price,kind:t.kind,p}); if(t.kind==='youth') m.youthBought++;
  m.targets.splice(idx,1); m.message=null;
  log(`🖊️ ${p.name} (${POS_LABEL[p.pos].toLowerCase()}, ${t.age} ans) rejoint le club pour ${$(t.price)}${t.access==='coup'?' — un gros coup, avec une place de titulaire promise':''}.`);
  render();
}
function marketRank(t){
  const b=coachBlockers(t);
  if(!b.length) return 0;
  if(b.some(x=>x.k==='access')) return 3;
  return coachSaleOptions(t).length&&coachSalesCover(t)?1:2;
}
/* Les ventes proposées ne valent que si elles comblent vraiment l'écart. */
function coachSalesCover(t){
  const b=coachBlockers(t), sales=coachSaleOptions(t);
  const needM=(b.find(x=>x.k==='budget')||{}).need||0;
  const needW=(b.find(x=>x.k==='salaire')||{}).needW||0;
  if(!sales.length) return false;
  return sales.reduce((n,x)=>n+x.value,0)>=needM && sales.reduce((n,x)=>n+x.wage,0)>=needW;
}
function marketDeck(){ const m=state.market;
  return m.targets.map((t,i)=>({t,i}))
    .filter(x=>!x.t.dropped)
    .filter(x=>marketFilter==='all'||x.t.kind===marketFilter)
    .sort((a,b)=>marketRank(a.t)-marketRank(b.t)||b.t.shownRating-a.t.shownRating);
}
function marketCurrent(){ const L=marketDeck(); if(!L.length) return null;
  const m=state.market; let k=L.findIndex(x=>x.i===m.idx); if(k<0) k=0; m.idx=L[k].i; return {...L[k],pos:k+1,total:L.length}; }
function coachMarketGo(d){ const L=marketDeck(); if(!L.length) return; const m=state.market;
  let k=L.findIndex(x=>x.i===m.idx); if(k<0) k=0; k=(k+d+L.length)%L.length; m.idx=L[k].i; m.message=null; render(); }
/* Écarter un dossier : il ne revient plus, et la pile raccourcit. Demande du
   propriétaire (23/09/2026) : « pouvoir retirer les joueurs qui ne
   m'intéressent pas des propositions ». */
function coachDropTarget(i){
  const m=state.market, t=m.targets[i]; if(!t||t.dropped) return;
  // On reste sur la même position de pile : elle porte maintenant le dossier suivant.
  const k=Math.max(0,marketDeck().findIndex(x=>x.i===i));
  t.dropped=true; m.dropped=(m.dropped||0)+1;
  m.message=`${t.p.name} est écarté : son dossier ne reviendra pas ${m.winter?'cet hiver':'cet été'}.`;
  const L=marketDeck(); m.idx=L.length?L[Math.min(k,L.length-1)].i:-1;
  render();
}
/* Tout remettre sur la table si on a écarté trop vite. */
function coachUndropAll(){
  const m=state.market; m.targets.forEach(t=>{ t.dropped=false; }); m.dropped=0;
  m.message="Tous les dossiers écartés sont revenus sur la table.";
  const L=marketDeck(); m.idx=L.length?L[0].i:-1; render();
}
function coachMarketFilter(k){ marketFilter=k; const L=marketDeck(); state.market.idx=L.length?L[0].i:-1; state.market.message=null; render(); }
function coachCloseMercato(){
  const m=state.market; const notes=[];
  // Effectif incomplet : le centre de formation fournit des jeunes (modestes) plutôt que de bloquer la saison
  if(state.squad.filter(p=>p.pos==='G').length<1){ const g=generatedPlayer('G',state.year,state.club.strength-12,state.club.nat,{age:randInt(18,20)}); g.wage=playerWage(g,state.year,state.club.tier); g.contractEnd=state.year+2; g.joinedYear=state.year; state.squad.push(g); notes.push(`🧤 Aucun gardien sous contrat : ${g.name} (${playerAge(g,state.year)} ans) monte du centre de formation.`); }
  while(state.squad.length<14){ const p=generatedPlayer(pick(['D','M','A']),state.year,state.club.strength-12,state.club.nat,{age:randInt(17,19)}); p.wage=playerWage(p,state.year,state.club.tier); p.contractEnd=state.year+2; p.joinedYear=state.year; state.squad.push(p); notes.push(`🌱 ${p.name} (${playerAge(p,state.year)} ans) complète l'effectif depuis le centre.`); }
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
/* Un chantier déjà au point progresse moins ; un chantier au fond ne tombe plus très bas.
   Les deux règles ensemble poussent chaque domaine vers l'équilibre que tes choix lui donnent,
   pas vers 0 ni vers 100. */
function focusScaled(effects,read,mult=1){
  const out={};
  Object.entries(effects).forEach(([k,v])=>{
    const cur=read(k);
    if(cur==null||!v){ out[k]=v*mult; return; }
    if(v>0) out[k]=Math.max(.5,Math.round(v*mult*(1-cur/150)*10)/10);
    else out[k]=Math.min(-.3,Math.round(v*mult*Math.max(.3,Math.min(1.3,.35+cur/110))*10)/10);
  });
  return out;
}
/* Un carrefour : trois chantiers sur la table, un seul reçoit ton énergie.
   Les deux autres reculent — c'est le prix affiché avant le clic. */
function coachChooseCrossroad(i){
  const x=state.currentEvent&&state.currentEvent.event; if(!x) return;
  const key=x.menu[i], a=FOCUS_AREAS[key]; if(!a) return;
  const before=coachSnapshot(), lines=[];
  const read=k=>k in state.stats?state.stats[k]:k in state.gauges?state.gauges[k]:null;
  coachApplyEffects(focusScaled(a.gain,read,.7));
  x.menu.forEach(k=>{ if(k===key) return; const o=FOCUS_AREAS[k];
    coachApplyEffects(focusScaled(o.loss,read,.65)); lines.push(`${o.icon} ${o.label} : ça attendra`); });
  state.lastFocus=key;
  log(`${x.icon} <b>${x.title}</b> → ${a.label.toLowerCase()}. ${x.menu.filter(k=>k!==key).map(k=>FOCUS_AREAS[k].label.toLowerCase()).join(' et ')} : ça attendra.`);
  state.currentEvent=null;
  state.pendingResult={title:`${x.icon} ${x.title}`,subtitle:`${a.icon} ${a.label}`,
    narrative:a.desc+" Le reste du trimestre s'organisera autour de ça.",
    before,after:coachSnapshot(),extra:lines,next:'phase'};
  state.pendingChoice='choiceResult'; render();
}
function coachStartSeason(){
  const c=state.club; const lg=buildLeagueTeams(c,state.year); c.leagueName=lg.name;
  state.comp=createCompetition(lg,c.name,state.year); state.phase=0; state.matchday=0; state.match=null;
  // L'objectif du président se recalcule sur la vraie force de ton effectif : bâtir une armada relève l'attente.
  const xi=bestXI(state.squad,FORMATIONS[state.formation],state.year); const xiAvg=xi.reduce((n,p)=>n+playerRating(p,state.year),0)/Math.max(1,xi.length);
  const rank=[...lg.teams.map(t=>t.strength),xiAvg].sort((a,b)=>b-a).indexOf(xiAvg)+1;
  const pres=PRESIDENTS.find(x=>x.id===c.president)||PRESIDENTS[0];
  // Le président revoit son objectif en voyant l'effectif que tu lui as composé.
  // Il ne peut que durcir — et il doit le dire : l'offre promettait 10e, la
  // saison commençait 6e, et rien nulle part ne l'expliquait.
  const promised=c.objectivePos;
  c.objectivePos=clamp(Math.min(c.objectivePos,Math.round(rank*pres.objMult*state.mode.objMult)),1,state.comp.teams.length-3);
  c.objectivePromised=promised;
  c.objectiveNote=c.objectivePos<promised?`En signant, ${c.presidentName} demandait ${ordinal(promised)}. Ton effectif est jugé ${ordinal(rank)} du championnat : il attend maintenant ${ordinal(c.objectivePos)}.`:'';
  if(c.objectiveNote) log(`🎯 ${capitalize(c.presidentName)} revoit son objectif : ${ordinal(promised)} → <b>${ordinal(c.objectivePos)}</b>. Ton effectif est jugé ${ordinal(rank)} du championnat.`);
  state.phaseMatches=[]; state.seasonStats={scorers:{},minutes:{},goals:0,conceded:0,form:0,phases:[]};
  state.squad.forEach(p=>{ p.apps=0; p.goals=0; p.assists=0; p.sumRating=0; p.rated=0; p.yellows=0; p.suspended=0; p.fitness=100; p.r0=Math.round(playerRating(p,state.year)*10)/10; });
  c.wageCap=clubWageCap(c);
  state.seasonStats.youthWeeks=0; state.seasonStats.injuries=[]; state.seasonStats.trainWeeks={}; state.phaseStops=0;
  state.effort=null; state.metFor=[]; state.matchBoost=null; state.meeting=null; state.meetingRecap=null; state.boostStreak=0;
  state.metHome=0; state.metBoard=0;
  state.seasonStats.g0={...state.gauges,pressure:state.pressure,confidence:c.confidence,cote:state.cote==null?30:state.cote};
  state.seasonStats.meetings=0;
  if(!state.approach) state.approach='equilibre'; if(!state.training) state.training='tactique';
  log(`📅 La saison ${state.year}-${state.year+1} commence en ${c.leagueName} : ${state.comp.teams.length} clubs, ${state.comp.schedule.length} journées.`);
  coachPlayPhase();
}
/* Bonus de l'entraîneur·euse (tactique, vestiaire, staff, cohérence de style, entraînement, dynamique) */
/* Les trois poids qui font la force de l'équipe. Une seule définition, lue par
   le moteur ET par tous les écrans qui expliquent un résultat : sans ça, le
   tableau de bord annonçait 0,05 / 0,03 / 0,015 pendant que le match jouait
   0,055 / 0,042 / 0,022, et aucun des deux ne disait la vérité. */
const STRENGTH_W={talent:.055,vestiaire:.042,staff:.022};
/* Ce que ton onze pense de ton style. Un effectif taillé pour le pressing joue
   mal au jeu de position, et ça doit se payer sur le terrain — c'est ce qui
   fait d'un recrutement un choix de jeu et non un choix de niveau. */
const FIT_WEIGHT=2.2;
function coachStyleFit(styleId){
  const st=styleId||state.styleId;
  const xi=bestXI(state.squad,FORMATIONS[state.formation]||FORMATIONS['4-4-2'],state.year);
  if(!xi.length) return {avg:0,plus:0,minus:0,v:0,names:[]};
  let plus=0,minus=0; const names=[];
  xi.forEach(p=>{ const f=styleFit(p,st); if(f>0){ plus++; names.push(`${p.name} ✅`); } else if(f<0){ minus++; names.push(`${p.name} ⚠️`); } });
  const avg=(plus-minus)/xi.length;
  return {avg,plus,minus,v:avg*FIT_WEIGHT,names};
}
function coachBonus(withNoise=true){
  const c=state.club, g=state.gauges; const style=styleById(state.styleId);
  let bonus=(state.stats.talent-50)*STRENGTH_W.talent+(g.vestiaire-50)*STRENGTH_W.vestiaire+(g.staff-50)*STRENGTH_W.staff+(state.seasonStats?state.seasonStats.form:0);
  if(state.styleId===c.styleWanted) bonus+=1.2; if(state.styleId===state.favoriteStyleId) bonus+=1; if(state.mentorStyles.includes(state.styleId)) bonus+=.3; if((state.nationalityStyles||[]).includes(state.styleId)) bonus+=.3;
  if(state.stats.talent<style.prestige*60) bonus-=(style.prestige*60-state.stats.talent)*.06;
  bonus+=coachStyleFit().v;
  bonus+=(TRAINING[state.training]||TRAINING.tactique).strength;
  if(state.rouletteEcho&&state.rouletteEcho.seasons>0) bonus+=state.rouletteEcho.delta;
  // Porter l'année sur une compétition se paie dans l'autre.
  if(state.effort==='championnat') bonus+=.8; else if(state.effort==='coupe') bonus-=.8;
  if(withNoise) bonus+=rand(-1.5,1.5)*state.mode.variance;
  return bonus;
}
function coachStrength(){ return teamStrength(state.squad,FORMATIONS[state.formation],state.year,{bonus:coachBonus()}); }
/* Décomposition de la force de l'équipe : d'où vient chaque dixième de point.
   C'est la réponse à « je travaille la tactique, mais je ne vois rien ». */
function coachStrengthBreakdown(){
  const c=state.club, g=state.gauges, st=state.stats;
  const style=styleById(state.styleId);
  const base=teamStrength(state.squad,FORMATIONS[state.formation],state.year,{bonus:0});
  let styleSum=0; const styleWhy=[];
  if(c&&state.styleId===c.styleWanted){ styleSum+=1.2; styleWhy.push("le style demandé par le club"); }
  if(state.styleId===state.favoriteStyleId){ styleSum+=1; styleWhy.push("ton style de prédilection"); }
  if((state.mentorStyles||[]).includes(state.styleId)){ styleSum+=.3; styleWhy.push("l'héritage de ton mentor"); }
  if((state.nationalityStyles||[]).includes(state.styleId)){ styleSum+=.3; styleWhy.push("ton école nationale"); }
  if(st.talent<style.prestige*60){ styleSum-=(style.prestige*60-st.talent)*.06; styleWhy.push(`${style.name} exige plus de tactique que tu n'en as`); }
  const tr=TRAINING[state.training]||TRAINING.tactique;
  const rows=[
    {icon:'👥',label:"L'effectif",v:base,abs:true,help:"Onze type, banc et moral du groupe."},
    {icon:'🧠',label:"Ta tactique",v:(st.talent-50)*STRENGTH_W.talent,help:gaugeHelp('Tactique',st.talent,STRENGTH_W.talent)},
    {icon:'✊',label:"Le vestiaire",v:(g.vestiaire-50)*STRENGTH_W.vestiaire,help:gaugeHelp('Vestiaire',g.vestiaire,STRENGTH_W.vestiaire)},
    {icon:'🧑‍🤝‍🧑',label:"Le staff",v:(g.staff-50)*STRENGTH_W.staff,help:gaugeHelp('Staff',g.staff,STRENGTH_W.staff)},
    {icon:'🎨',label:"Le style",v:styleSum,help:styleWhy.length?styleWhy.join(' · '):"Aucun bonus de style : ni celui du club, ni le tien."},
    (fit=>({icon:'🎽',label:"L'effectif et ton style",v:fit.v,
      help:`${fit.plus} joueur${fit.plus>1?'s':''} du onze ${fit.plus>1?'sont taillés':'est taillé'} pour ${style.name.toLowerCase()}, ${fit.minus} y ${fit.minus>1?'sont mal à l\'aise':'est mal à l\'aise'}.`}))(coachStyleFit()),
    {icon:tr.icon,label:"L'entraînement",v:tr.strength,help:`${tr.label} : ${tr.desc}`},
    {icon:'📈',label:"La dynamique",v:(state.seasonStats?state.seasonStats.form:0)||0,help:"Les résultats récents."},
    ...(Math.abs(activeBoost())>=.3?[{icon:'🗣️',label:"Ta dernière décision",v:activeBoost(),help:`Elle porte encore ${boostLeft()} journée${boostLeft()>1?'s':''}.`}]:[]),
  ];
  const e=state.rouletteEcho;
  if(e&&e.seasons>0) rows.push({icon:e.icon,label:e.label,v:e.delta,help:`${e.short} — encore ${e.seasons} saison${e.seasons>1?'s':''}.`});
  // L'effort porté sur une compétition pèse sur l'autre : il manquait ici,
  // et le total du tableau de bord se trompait de 0,8 sans le dire.
  if(state.effort==='championnat') rows.push({icon:'⚖️',label:"Le championnat avant tout",v:.8,help:"Tu as choisi de porter l'année sur le championnat."});
  else if(state.effort==='coupe') rows.push({icon:'⚖️',label:"La coupe avant tout",v:-.8,help:"Tu as choisi de porter l'année sur la coupe : le championnat le paie."});
  const total=rows.reduce((n,r)=>n+r.v,0);
  return {rows,total,base};
}
function fmtW(w){ return w.toFixed(3).replace(/0+$/,'').replace('.',','); }
/* L'explication dit le calcul dans le sens où il se produit : « 10 points sous
   50, à 0,055 le point » se vérifie à l'œil, « 0,055 par point au-dessus de
   50 » pour une jauge à 40 ne veut rien dire. */
function gaugeHelp(nom,v,w){
  const d=Math.round(v)-50;
  if(!d) return `${nom} ${Math.round(v)} : pile la moyenne, ni gain ni perte.`;
  return `${nom} ${Math.round(v)} : ${Math.abs(d)} point${Math.abs(d)>1?'s':''} ${d>0?'au-dessus':'en dessous'} de 50, à ${fmtW(w)} le point.`;
}
/* La force réelle emmenée sur le terrain, sans l'aléa du jour : c'est ce
   chiffre-là qu'on affiche, jamais un tirage au sort déguisé en mesure. */
function coachStrengthShown(){ return coachStrengthBreakdown().total; }
/* La force moyenne des adversaires, pour situer la tienne */
function coachLeagueAverage(){
  const comp=state.comp; if(!comp) return null;
  const others=comp.teams.filter(n=>n!==state.club.name).map(n=>comp.strength[n]);
  return others.length?others.reduce((a,b)=>a+b,0)/others.length:null;
}
/* Lignes explicables du bonus, pour l'écran d'avant-match */
function coachBonusLines(){
  // Exactement les lignes du tableau de bord, moins l'effectif (le match le
  // dit déjà à sa façon : « onze aligné à X contre Y »).
  return coachStrengthBreakdown().rows.filter(r=>!r.abs&&Math.abs(r.v)>=.05)
    .map(r=>({t:`${r.label} — ${r.help}`,d:r.v}));
}
/* Une phase, un carrefour. Dilemme de jauge, incident, événement de vie ou arbitrage
   d'énergie : tout sort du même sac, pour qu'aucun écran n'arrive de nulle part. */
function coachPlayPhase(){
  const ev=coachDrawPhaseEvent();
  if(ev){ state.currentEvent=ev; state.pendingChoice='event'; saveGame(); return; }
  coachSimulatePhase();
}
function eventKey(e){ return e.id||e.title; }
function rememberEvent(e){ const m=(state.recentEvents=state.recentEvents||[]); m.push(eventKey(e)); while(m.length>10) m.shift(); }
function weightedDraw(bag){
  const recent=state.recentEvents||[];
  let pool=bag.filter(b=>!recent.includes(eventKey(b.event)));
  if(!pool.length) pool=bag;
  if(!pool.length) return null;
  const total=pool.reduce((n,b)=>n+b.w,0); let r=Math.random()*total;
  for(const b of pool){ r-=b.w; if(r<=0){ rememberEvent(b.event); return {kind:b.kind,event:b.event}; } }
  const last=pool[pool.length-1]; rememberEvent(last.event); return {kind:last.kind,event:last.event};
}
function coachDrawPhaseEvent(){
  const y=state.year, g=state.gauges, ph=state.phase, bag=[];
  const low=Object.keys(g).filter(k=>g[k]<40);
  // La reprise est toujours un carrefour : c'est le moment où l'on décide de l'année,
  // et il arrive par la préparation, pas par un écran de réglages.
  if(ph===0){ const pre=COACH_CROSSROADS.filter(x=>x.phase===0); return weightedDraw(pre.map(x=>({kind:'carrefour',event:x,w:1}))); }
  // une jauge au fond réclame une réponse : le dilemme passe devant
  COACH_DILEMMAS.filter(d=>low.includes(d.gauge)).forEach(d=>bag.push({kind:'dilemma',event:d,w:g[d.gauge]<25?8:5}));
  COACH_CROSSROADS.filter(x=>x.phase==null||x.phase===ph).forEach(x=>bag.push({kind:'carrefour',event:x,w:x.phase===ph?9:4}));
  COACH_INCIDENTS.filter(e=>(!e.minYear||y>=e.minYear)&&(!e.maxYear||y<=e.maxYear)&&(!e.tiers||e.tiers.includes(state.club.tier))&&(!e.gauge||low.includes(e.gauge)))
    .forEach(e=>bag.push({kind:'incident',event:e,w:1.8*state.mode.incidentMult}));
  COACH_HAPPENINGS.filter(e=>(!e.minYear||y>=e.minYear)&&(!e.maxYear||y<=e.maxYear)).forEach(e=>bag.push({kind:'happening',event:e,w:2}));
  return weightedDraw(bag);
}
/* Où un effet chiffré mènerait, sans rien modifier. coachApplyEffects s'en sert
   pour appliquer : l'écran de choix et le moteur ne peuvent donc pas diverger. */
function coachProject(k,v,base){
  const s=state.stats, g=state.gauges, c=state.club;
  const proches=base&&base.proches!=null?base.proches:g.proches;
  if(k in s) return {cur:s[k],next:clamp(s[k]+v)};
  if(k in g) return {cur:g[k],next:clamp(g[k]+v)};
  if(k==='pressure'){ const home=proches>=65?.82:proches<=30?1.25:1; return {cur:state.pressure,next:clamp(state.pressure+v*(v>0?state.mode.pressureMult*home:1))}; }
  if(k==='confidence'&&c) return {cur:c.confidence,next:clamp(c.confidence+v*(v<0?(1-state.perks.confidenceRes):1))};
  if(k==='form'&&state.seasonStats) return {cur:state.seasonStats.form,next:clamp(state.seasonStats.form+v,-6,6)};
  return null;
}
function coachApplyEffects(effects,ctx={}){
  const s=state.stats, g=state.gauges, c=state.club, out=[];
  const base={proches:g.proches};
  Object.entries(effects||{}).forEach(([k,v])=>{
    const pr=coachProject(k,v,base);
    if(pr){
      if(k in s) s[k]=pr.next;
      else if(k in g) g[k]=pr.next;
      else if(k==='pressure') state.pressure=pr.next;
      else if(k==='confidence') c.confidence=pr.next;
      else if(k==='form') state.seasonStats.form=pr.next;
      return;
    }
    if(k==='budget'&&c){ const amt=c.budget*v; c.budget+=amt; if(state.market) state.market.budgetLeft+=amt; out.push(`${amt>=0?'+':''}${$(amt)} de budget`); }
    else if(k==='injure'){ const best=[...state.squad].filter(p=>!p.injury).sort((a,b)=>playerRating(b,state.year)-playerRating(a,state.year))[0]; if(best){ best.injury=v; out.push(`${best.name} absent ${v} semaines`); } }
    else if(k==='sellStar'){ const best=[...state.squad].sort((a,b)=>playerRating(b,state.year)-playerRating(a,state.year))[0]; if(best){ const price=playerValue(best,state.year)*v; state.squad=state.squad.filter(p=>p!==best); if(!effects.noReinvest){ c.budget+=price; } out.push(`${best.name} vendu ${$(price)}`); log(`💸 ${best.name} part pour ${$(price)}.`); } }
    else if(k==='releaseCaptain'){ const old=[...state.squad].sort((a,b)=>playerAge(b,state.year)-playerAge(a,state.year))[0]; if(old){ state.squad=state.squad.filter(p=>p!==old); out.push(`${old.name} quitte le club`); } }
    else if(k==='promoteYouth'){ const p=generatedPlayer(pick(['M','A','D']),state.year,state.club.strength-6,state.club.nat,{age:17}); p.dev=1.15; p.wage=playerWage(p,state.year,state.club.tier); p.contractEnd=state.year+3; state.squad.push(p); out.push(`${p.name} (17 ans) intègre le groupe pro`); }
    else if(k==='points'&&state.comp){ const me=state.comp.table.find(t=>t.me); me.pts+=v; out.push(`+${v} points sur tapis vert`); }
    else if(k==='skipHalf'){ state.seasonStats.form-=2; }
    else if(k==='stayLocal'){ state.stayLocal=true; }
  });
  return out;
}
function coachChooseEvent(i){
  /* voir plantSeed : un choix peut laisser une trace qui revient plus tard */
  const ce=state.currentEvent, ev=ce.event, ch=ev.choices[i]; if(!ch) return;
  const before=coachSnapshot();
  const extra=coachApplyEffects(ch.effects);
  if(ch.seed){ plantSeed({...ch.seed,from:`${ev.title} → ${ch.label}`}); extra.push('une suite, un jour'); }
  log(`${ev.icon} <b>${ev.title}</b> → ${ch.label}. ${ch.result||''}`);
  state.pendingResult={title:`${ev.icon} ${ev.title}`,subtitle:ch.label,narrative:ch.result||'',before,after:coachSnapshot(),extra,next:'phase'};
  state.currentEvent=null; state.pendingChoice='choiceResult'; saveGame(); render();
}
function coachSnapshot(){ const s=state.stats, g=state.gauges; return {talent:s.talent,technique:s.technique,reseau:s.reseau,reputation:s.reputation,pressure:state.pressure,confidence:state.club?state.club.confidence:0,vestiaire:g.vestiaire,supporters:g.supporters,formation:g.formation,staff:g.staff,proches:g.proches}; }
function coachContinueChoiceResult(){
  const r=state.pendingResult; state.pendingResult=null; state.pendingChoice=null;
  if(state.ended){ render(); return; }
  if(r.next==='phase'){ coachSimulatePhase(); render(); return; }
  if(r.next==='afterPhase'){ coachAfterPhase(); return; }
  if(r.next==='season'){ coachStartSeason(); render(); return; }
  if(r.next==='offers'){ coachOpenOffers(); render(); return; }
  coachIntersaison(); render();
}
/* ---------- Ce que tu as semé ----------
   Certains choix n'ont pas de prix tout de suite : ils reviennent plus tard. */
function plantSeed(seed){ if(!seed) return; (state.seeds=state.seeds||[]).push({...seed,year:state.year+(seed.in||2)}); }
function coachRipeSeed(){
  if(!state.seeds||!state.seeds.length) return null;
  const i=state.seeds.findIndex(sd=>state.year>=sd.year); if(i<0) return null;
  return state.seeds.splice(i,1)[0];
}
/* ---------- Une phase = une suite de journées jouées une par une ---------- */
function coachSimulatePhase(){ coachBeginPhase(); }
function coachBeginPhase(){
  const comp=state.comp; state.matchday=state.phase===0?0:comp.phaseEnds[state.phase-1]; state.phaseMatches=[]; state.phaseNotes=[];
  if(!state.approach) state.approach='equilibre'; if(!state.training) state.training='tactique'; const ss=state.seasonStats; if(ss){ ss.injuries=ss.injuries||[]; ss.youthWeeks=ss.youthWeeks||0; ss.trainWeeks=ss.trainWeeks||{}; }
  if(state.phase>0) state.squad.forEach(p=>{ p.fitness=clamp(fit(p)+10,0,100); });
  coachNextMatch();
}
function coachSquadMap(){ return Object.fromEntries(state.squad.map(p=>[p.id,p])); }
/* Prépare une journée : compo par défaut (celle d'avant si valide, sinon automatique) */
function coachBuildMatch(fx){
  const comp=state.comp, c=state.club, year=state.year, f=FORMATIONS[state.formation];
  const prev=state.match&&state.match.done?state.match:null;
  let xi=[],bench=[];
  if(prev){ xi=prev.xi.map(id=>state.squad.find(p=>p.id===id)).filter(p=>p&&availableForMatch(p)); bench=prev.bench.map(id=>state.squad.find(p=>p.id===id)).filter(p=>p&&availableForMatch(p)&&!xi.includes(p)); }
  if(xi.length<11){ const auto=autoLineup(state.squad,f,year); const add=auto.xi.filter(p=>!xi.includes(p)); while(xi.length<11&&add.length) xi.push(add.shift()); bench=bench.filter(p=>!xi.includes(p)); auto.bench.forEach(p=>{ if(bench.length<benchSize(year)&&!xi.includes(p)&&!bench.includes(p)) bench.push(p); }); }
  bench=bench.slice(0,benchSize(year));
  let captain=state.captainId!=null?xi.find(p=>p.id===state.captainId):null; if(!captain) captain=defaultCaptain(xi);
  state.match=newMatch({year,home:fx.isHome,usName:c.name,themName:fx.opp,themStrength:comp.strength[fx.opp]+rand(-1.5,1.5),themStyle:oppStyle(comp,fx.opp,year),themNat:comp.nat,ourStyle:state.styleId,xi,bench,captain,approach:state.approach,formation:state.formation,matchday:state.matchday,label:`Journée ${state.matchday+1}`});
}
/* Pourquoi ce match mérite un arrêt (selon le rythme choisi) ; null = on le joue en coulisses */
/* L'intérêt d'un match, noté de 0 à 5. Sert à ne garder que les vrais temps forts. */
function coachMatchInterest(m){
  const comp=state.comp, c=state.club;
  const N=comp.teams.length, my=tablePos(comp.table,c.name), op=tablePos(comp.table,m.themName);
  let score=0; const why=[];
  if(op<=3&&my<=3){ score=5; why.push("Sommet du championnat"); }
  else if(my>=N-3&&op>=N-3){ score=4; why.push("Match de la peur"); }
  else if(op<=3){ score=4; why.push(`Choc contre le ${ordinal(op)}`); }
  else if(Math.abs(op-my)<=1&&(my<=6||my>=N-6)){ score=3; why.push("Concurrent direct au classement"); }
  else if(m.themStrength>=c.strength+9){ score=2; why.push("Adversaire nettement plus fort"); }
  if(state.matchday===comp.phaseEnds[3]-1){ score=5; why.length=0; why.push("Dernière journée de la saison"); }
  return {score,why};
}

/* ---------- Les rendez-vous ----------
   Intention : on ne compose pas, on tranche. Le calendrier tourne seul et ne
   s'arrête que quand une décision se présente ; le match qui suit est le
   résultat de cette décision, et on le lit. */
const MEETING_QUOTA={complet:10,temps_forts:8,rapide:4};
const MEETING_WEIGHT=2.2;
/* Combien de temps une décision porte, et comment elle s'éteint. Une phase
   entière rendait la saison trop facile (retour du propriétaire, 22/09/2026 :
   « c'était trop facile au niveau des choix, 1/2 phase ou 1/4 de phase
   suffisent »). Mesuré avant de trancher : raccourcir la portée ne changeait
   presque rien (88 % des matchs portés par une décision à une phase, 92 % à
   une demi-phase), parce que les rendez-vous s'enchaînent assez vite pour
   qu'une décision écrase la précédente avant qu'elle n'expire. Ce qui rendait
   la saison facile, c'est qu'un bonus était presque toujours allumé. Une
   décision frappe donc à plein sur le match qui suit, puis **s'estompe
   linéairement** sur une demi-phase. */
const MEETING_SPAN=.5;
/* Et surtout : le même levier ne paie pas deux fois pareil. Mesuré — avec huit
   rendez-vous par phase, un rendez-vous tombe avant presque chaque match, donc
   un joueur qui prend toujours l'option qui aide le match gardait un bonus
   allumé sur 95 % des matchs, à plein. Raccourcir la portée n'y changeait rien.
   Ce qui rend la saison facile, c'est de pouvoir tirer sur la même corde chaque
   semaine. Chaque gain immédiat consécutif vaut donc moins que le précédent ;
   accepter un choix qui ne sert pas le match suivant fait remonter la corde. */
const MEETING_FATIGUE=.35;
function boostFactor(){ return 1/(1+MEETING_FATIGUE*(state.boostStreak||0)); }
function boostSpan(){
  const comp=state.comp; if(!comp) return 1;
  const start=state.phase===0?0:comp.phaseEnds[state.phase-1];
  const len=Math.max(1,comp.phaseEnds[state.phase]-start);
  return Math.max(1,Math.round(len*MEETING_SPAN));
}

function coachDrawMeeting(fx){
  const comp=state.comp, tempo=TEMPOS[state.tempo]?state.tempo:'temps_forts';
  const start=state.phase===0?0:comp.phaseEnds[state.phase-1];
  if(state.matchday===start){ state.phaseStops=0; state.boostStreak=0; }
  const quota=MEETING_QUOTA[tempo]==null?2:MEETING_QUOTA[tempo];
  if((state.phaseStops||0)>=quota) return null;
  const m=state.match, it=coachMatchInterest(m);
  const left=comp.phaseEnds[state.phase]-state.matchday;
  const cands=[coachMeetingInjured,coachMeetingFronts,coachMeetingCaptain,coachMeetingPresident,coachMeetingReturn,
    coachMeetingBonus,coachMeetingTravel,coachMeetingPress,coachMeetingSquad,coachMeetingOpponent,
    coachMeetingPrep,coachMeetingRecovery,coachMeetingShape,coachMeetingCards,coachMeetingPitch,
    coachMeetingAgent,coachMeetingFans,coachMeetingHome,coachMeetingBoard]
    .map(b=>b(m,it,left)).filter(Boolean);
  if(!cands.length) return null;
  const seen=state.recentMeetings||[];
  // Dix-neuf familles : on écarte les cinq derniers genres, pas trois, sinon les
  // rendez-vous toujours disponibles (la semaine, le symptôme) font le papier peint.
  const fresh=cands.filter(x=>!seen.includes(x.kind));
  let pool=fresh.length?fresh:cands;
  // Le sujet du jeu, c'est l'équilibre entre une vie et un métier : un côté ne
  // peut pas manger l'autre. Le sportif était monté à 84 % des rendez-vous parce
  // que ses familles sont presque toujours applicables. On tire donc du côté qui
  // est en retard sur la saison, quand il a quelque chose à proposer.
  const sd=(state.seasonStats&&(state.seasonStats.sides=state.seasonStats.sides||{terrain:0,vie:0}))||{terrain:0,vie:0};
  // Un écart de deux, pas de un : alterner strictement rendrait la suite
  // prévisible, et deux rendez-vous de terrain d'affilée sont une saison normale.
  const want=sd.terrain-sd.vie>=2?'vie':sd.vie-sd.terrain>=2?'terrain':null;
  if(want){ const p2=pool.filter(x=>x.side===want); if(p2.length) pool=p2; }
  const mt=pick(pool);
  sd[mt.side==='vie'?'vie':'terrain']++;
  state.recentMeetings=[...seen,mt.kind].slice(-5);
  state.phaseStops=(state.phaseStops||0)+1;
  mt.opponent=`${m.themName} · ${m.home?'à domicile':'à l\'extérieur'}`;
  return mt;
}

/* Un cadre est absent : quelqu'un doit prendre sa place, et ce quelqu'un s'en souviendra. */
function coachMeetingInjured(m){
  const y=state.year;
  const out=state.squad.filter(p=>(p.injury>0||p.suspended>0)&&playerRating(p,y)>=state.club.strength-1&&!(state.metFor||[]).includes(p.id))
    .sort((a,b)=>playerRating(b,y)-playerRating(a,y))[0];
  if(!out) return null;
  const pool=state.squad.filter(p=>p!==out&&p.pos===out.pos&&availableForMatch(p));
  const vet=pool.filter(p=>playerAge(p,y)>=23).sort((a,b)=>playerRating(b,y)-playerRating(a,y))[0];
  const kid=pool.filter(p=>playerAge(p,y)<=21).sort((a,b)=>playerRating(b,y)-playerRating(a,y))[0];
  if(!vet&&!kid) return null;
  (state.metFor=state.metFor||[]).push(out.id);
  const why=out.suspended>0?`suspendu`:`blessé ${out.injury} semaine${out.injury>1?'s':''}`;
  const choices=[];
  if(vet) choices.push({label:`Aligner ${vet.name}`,sub:`${playerAge(vet,y)} ans · niveau ${playerRating(vet,y)} · le choix sûr`,
    plan:{forceIn:vet.id},effects:{},
    seed:kid?{in:2,icon:'🌱',title:"Le jeune qu'on n'a pas lancé",text:`${kid.name} attendait cette ouverture. Il l'a attendue toute la saison, puis il a signé ailleurs.`,effects:{formation:-6,vestiaire:-3}}:null});
  if(kid) choices.push({label:`Lancer ${kid.name}`,sub:`${playerAge(kid,y)} ans · niveau ${playerRating(kid,y)} · jamais titularisé`,
    plan:{forceIn:kid.id,bonus:-.8},effects:{formation:4,supporters:2},
    seed:{in:2,icon:'🌟',title:"Celui que tu as lancé",text:`${kid.name} n'a plus jamais quitté le onze. Il raconte partout qui lui a donné sa chance.`,effects:{formation:6,reputation:4,vestiaire:3}}});
  if(out.injury>0&&out.injury<=2) choices.push({label:`Faire jouer ${out.name} quand même`,sub:`La blessure est légère. Le médecin n'est pas d'accord.`,
    plan:{playHurt:out.id,bonus:1},effects:{staff:-5},
    seed:{in:1,icon:'🫀',title:"La rechute annoncée",text:`${out.name} n'a jamais vraiment récupéré de ce match-là. Le staff te l'avait dit.`,effects:{staff:-4,vestiaire:-4}}});
  choices.push({label:"Laisser l'adjoint trancher",sub:"Tu as d'autres soucis. Il décidera bien.",plan:{delegate:true},effects:{staff:3,technique:-1}});
  return {kind:'homme',side:'terrain',icon:'🩼',title:`${out.name} est ${why}`,
    text:`${out.name} (${POS_LABEL[out.pos].toLowerCase()}, niveau ${playerRating(out,y)}) ne jouera pas. Sa place est à prendre, et celui qui la prend prive quelqu'un d'autre.`,
    choices};
}

/* Deux compétitions, un seul effectif : il faut choisir où porter l'année. */
function coachMeetingFronts(m,it,left){
  const c=state.club;
  if(!c.euroQualified||state.phase<1||state.effort) return null;
  const euro=eraForYear(state.year).euroCup;
  return {kind:'fronts',side:'terrain',icon:'⚖️',title:"Deux fronts",
    text:`Tu joues le championnat et la ${euro}. Ton groupe ne tiendra pas les deux à plein régime. Où passe l'année ?`,
    choices:[
      {label:"Le championnat avant tout",sub:"La régularité, la place, la sécurité du club.",plan:{effort:'championnat'},effects:{confidence:4,supporters:-3}},
      {label:`Tout pour la ${euro}`,sub:"Une soirée européenne vaut dix journées.",plan:{effort:'coupe'},effects:{supporters:6,confidence:-5}},
      {label:"Tenir les deux",sub:"Personne n'y arrive vraiment.",plan:{effort:'equilibre'},effects:{staff:-3,vestiaire:-2}},
    ]};
}

/* Un symptôme se voit dans le groupe : on y répond, au prix d'autre chose. */
function coachMeetingSquad(m,it,left){
  const y=state.year, g=state.gauges;
  const fitAvg=state.squad.reduce((n,p)=>n+fit(p),0)/Math.max(1,state.squad.length);
  if(fitAvg<82&&state.training!=='recuperation'){
    return {kind:'symptome',side:'terrain',icon:'🥵',title:"Le groupe est à bout",
      text:`Fraîcheur moyenne ${Math.round(fitAvg)} %. Les jambes sont lourdes, les blessures guettent, et il reste ${left} journée${left>1?'s':''} avant la trêve.`,
      choices:[
        {label:"Semaine de récupération",sub:"Les séances s'allègent. La tactique attendra.",plan:{training:'recuperation'},effects:{staff:2}},
        {label:"Faire tourner",sub:"Les cadres soufflent, les remplaçants jouent — et le niveau baisse le temps que les jambes reviennent.",plan:{rotate:true,bonus:-1.4},effects:{vestiaire:3}},
        {label:"Serrer les dents",sub:"On verra en janvier.",plan:{bonus:.5},effects:{staff:-4,vestiaire:-3}},
      ]};
  }
  if(g.vestiaire<45){
    return {kind:'symptome',side:'terrain',icon:'🧊',title:"Le vestiaire s'est refroidi",
      text:`Vestiaire ${Math.round(g.vestiaire)}/100. Les séances sont silencieuses et personne ne se parle après les matchs.`,
      choices:[
        {label:"Une mise au point collective",sub:"Tout le monde parle, ça pique.",plan:{bonus:-.6},effects:{vestiaire:9,technique:1}},
        {label:"Voir les cadres un par un",sub:"Discret, long, et ça laisse les autres de côté.",effects:{vestiaire:5,proches:-4}},
        {label:"Laisser le terrain répondre",sub:"Une victoire règle tout, dit-on.",plan:{bonus:.6},effects:{vestiaire:-4}},
      ]};
  }
  return null;
}

/* L'adversaire joue de telle manière : comment tu abordes ça. */
function coachMeetingOpponent(m,it,left){
  if(it.score<3) return null;
  const theirs=m.themStyle, tf=styleFamily(theirs), ti=FAMILY_INFO[tf];
  const counter=Object.keys(FAMILY_INFO).find(f=>FAMILY_INFO[f].beats===tf);
  const counterStyle=STYLES.filter(x=>styleFamily(x.id)===counter&&x.prestige*60<=state.stats.talent+10)
    .sort((a,b)=>b.prestige-a.prestige)[0];
  const choices=[
    {label:"Garder ton plan",sub:`Tu joues ${styleById(state.styleId).name.toLowerCase()}, comme toujours. ${matchupText(state.styleId,theirs)}.`,effects:{}},
  ];
  if(counterStyle&&counterStyle.id!==state.styleId) choices.push({
    label:`Passer en ${counterStyle.name.toLowerCase()}`,sub:`${ti.label} se fait punir par ça. Mais tes joueurs perdent leurs repères.`,
    plan:{style:counterStyle.id,bonus:.8},effects:{vestiaire:-4}});
  choices.push({label:"Fermer le jeu",sub:"Un point, c'est un point. Le parcage n'aimera pas.",plan:{approach:'defensif'},effects:{supporters:-3}});
  choices.push({label:"Tout devant",sub:"Les prendre à la gorge. Derrière, on verra.",plan:{approach:'offensif'},effects:{supporters:3,confidence:-1}});
  return {kind:'adversaire',side:'terrain',icon:ti.icon,title:`${m.themName} joue ${styleById(theirs).name.toLowerCase()}`,
    text:`${it.why[0]||'Match important'}. ${ti.label} : ${ti.how}. Leur force est estimée à ${Math.round(m.themStrength)}, la tienne à ${Math.round(coachStrength())}.`,
    choices};
}

/* Le président a un avis, et il ne demande pas vraiment. */
function coachMeetingPresident(m,it,left){
  if(it.score<2) return null;
  const y=state.year, c=state.club;
  const costly=state.squad.filter(p=>p.wage>0).sort((a,b)=>b.wage-a.wage)[0];
  if(!costly) return null;
  const benched=!state.match.xi.includes(costly.id);
  if(!benched) return null;
  return {kind:'president',side:'vie',icon:'🕴️',title:`${capitalize(c.presidentName)} veut voir ${costly.name} jouer`,
    text:`« Je paie ${$(costly.wage)} par an pour qu'il regarde les matchs ? » ${costly.name} (niveau ${playerRating(costly,y)}) est le plus gros salaire du club, et il n'est pas dans ton onze.`,
    choices:[
      {label:"Le titulariser",sub:"Le président se tait. Le vestiaire comprend qui décide.",plan:{forceIn:costly.id},effects:{confidence:6,vestiaire:-5}},
      {label:"Expliquer ton choix sportif",sub:"Argumenter, chiffres à l'appui. Ça passe ou ça casse.",effects:{confidence:-6,technique:2,vestiaire:4}},
      {label:"Le mettre sur la liste des transferts",sub:"Trancher pour de bon, et assumer la masse salariale perdue.",effects:{confidence:-3,vestiaire:2,supporters:-4},
       seed:{in:2,icon:'💸',title:"Celui que tu avais écarté",text:`${costly.name} cartonne ailleurs depuis deux saisons. On te le rappelle à chaque conférence de presse.`,effects:{reputation:-5,confidence:-4}}},
    ]};
}
/* Le capitaine vient te voir : il porte la parole du groupe. */
function coachMeetingCaptain(m,it,left){
  const y=state.year, P=coachSquadMap();
  const cap=state.captainId!=null?P[state.captainId]:null; if(!cap) return null;
  const sad=state.squad.filter(p=>p.morale<50&&p!==cap&&!state.match.xi.includes(p.id)).sort((a,b)=>a.morale-b.morale)[0];
  if(!sad) return null;
  return {kind:'capitaine',side:'vie',icon:'🎽',title:`${cap.name} vient te parler de ${sad.name}`,
    text:`« Il ne dort plus, il ne parle plus à personne. Si tu ne fais rien, on va le perdre — et pas seulement lui. » ${sad.name} n'a plus joué depuis longtemps.`,
    choices:[
      {label:`Le remettre dans le onze`,sub:"Un geste, tout de suite, devant tout le monde.",plan:{forceIn:sad.id,bonus:-.5},effects:{vestiaire:7}},
      {label:"Lui promettre du temps de jeu",sub:"Une promesse coûte peu. Tant qu'on la tient.",effects:{vestiaire:3,technique:1},
       seed:{in:1,icon:'🤥',title:"La promesse non tenue",text:`${sad.name} attend toujours. Le vestiaire a compris ce que valent tes promesses.`,effects:{vestiaire:-8,technique:-2}}},
      {label:"Dire au capitaine que ce n'est pas son rôle",sub:"Remettre la hiérarchie en place.",effects:{vestiaire:-7,confidence:2}},
    ]};
}

/* La presse attend une phrase, et elle la sortira de son contexte. */
function coachMeetingPress(m,it,left){
  if(it.score<2) return null;
  const c=state.club, f=(state.comp.form&&state.comp.form[c.name])||[];
  const bad=f.slice(-3).filter(r=>r==='L').length>=2;
  return {kind:'presse',side:'vie',icon:'🎙️',title:bad?"La conférence d'avant-match":"Le micro tendu",
    text:bad?`Trois questions sur ta série, une sur ton avenir. ${m.themName} arrive, et la salle attend que tu dises quelque chose.`
      :`Avant ${m.themName}, on te demande si ton équipe a le niveau. La réponse fera le titre de demain.`,
    choices:[
      {label:"Protéger tes joueurs",sub:"Tout prendre sur toi, devant tout le monde.",effects:{vestiaire:6,pressure:5,confidence:-2}},
      {label:"Mettre la pression au groupe",sub:"Les nommer, presque. Ça réveille ou ça casse.",plan:{bonus:.7},effects:{vestiaire:-6,supporters:2}},
      {label:"Promettre un résultat",sub:"Annoncer la victoire. On te le rappellera.",plan:{bonus:.5},effects:{supporters:6,pressure:7},
       seed:{in:1,icon:'📰',title:"La phrase qu'on te ressort",text:"On rediffuse ta promesse à chaque contre-performance. Le vestiaire la connaît par cœur.",effects:{supporters:-7,pressure:6}}},
      {label:"Ne rien dire d'intéressant",sub:"Langue de bois. Personne n'est content, personne n'est blessé.",effects:{supporters:-3,reputation:-2}},
    ]};
}
/* Une prime se demande avant, jamais après. */
function coachMeetingBonus(m,it,left){
  if(it.score<4) return null;
  const c=state.club;
  return {kind:'prime',side:'vie',icon:'💰',title:"Les joueurs demandent une prime",
    text:`Le match contre ${m.themName} vaut cher, et le groupe le sait. Les cadres sont venus à deux, poliment.`,
    choices:[
      {label:"Payer la prime sur le budget",sub:"Ils l'auront, et ils le sauront.",plan:{bonus:.9},effects:{budget:-.06,vestiaire:5,confidence:-3}},
      {label:"La promettre en cas de victoire",sub:"Rien ne sort si on perd.",plan:{bonus:.6},effects:{vestiaire:2,pressure:3}},
      {label:"Refuser net",sub:"On est payé pour jouer.",effects:{vestiaire:-8,confidence:4,technique:1}},
      {label:"Renvoyer les cadres vers le président",sub:"Ce n'est pas ton budget. Qu'ils aillent le lui demander.",effects:{confidence:-5,vestiaire:2}},
    ]};
}
/* Un joueur revient de blessure : trop tôt, c'est deux mois de plus. */
function coachMeetingReturn(m,it,left){
  const y=state.year;
  const back=state.squad.filter(p=>p.injury===0&&p.fitness!=null&&p.fitness<62&&playerRating(p,y)>=state.club.strength-2&&!(state.metFor||[]).includes(-p.id))[0];
  if(!back) return null;
  (state.metFor=state.metFor||[]).push(-back.id);
  return {kind:'retour',side:'terrain',icon:'🧑‍⚕️',title:`${back.name} veut rejouer`,
    text:`Il est remis, sur le papier. Fraîcheur ${Math.round(fit(back))} %, et il n'a pas joué depuis longtemps. Le staff propose de le ménager.`,
    choices:[
      {label:"Le titulariser tout de suite",sub:"Il en a besoin, l'équipe aussi.",plan:{forceIn:back.id,bonus:.5},effects:{staff:-4,vestiaire:2},
       seed:{in:1,icon:'🩼',title:"Revenu trop tôt",text:`${back.name} a rechuté. Le staff n'a rien dit, mais il pense très fort.`,effects:{staff:-5,vestiaire:-3}}},
      {label:"Une mi-temps, pas plus",sub:"Le compromis raisonnable.",effects:{staff:2}},
      {label:"Encore deux semaines",sub:"Il va détester, le staff va approuver.",effects:{staff:5,vestiaire:-3}},
    ]};
}
/* Un déplacement lointain se prépare, ou se subit. */
function coachMeetingTravel(m,it,left){
  if(m.home||it.score<3) return null;
  return {kind:'voyage',side:'terrain',icon:'🚌',title:`Le déplacement à ${m.themName}`,
    text:"Six heures de route, ou un vol la veille et une nuit d'hôtel. Le club regarde la facture.",
    choices:[
      {label:"Partir la veille, en avion",sub:"Des jambes fraîches, une note salée.",plan:{bonus:.8},effects:{budget:-.03,confidence:-2}},
      {label:"Le car le matin même",sub:"On économise, on arrive cuits.",plan:{bonus:-.7},effects:{confidence:3,staff:-2}},
      {label:"En car, mais la veille",sub:"Le compromis de tous les clubs modestes.",effects:{budget:-.01}},
    ]};
}

/* ---------- Le terrain, la semaine, les jambes ----------
   Demande du propriétaire (22/09/2026) : « pas assez de problèmes liés au
   football et au sportif, surtout dans la préparation des matchs, la
   récupération ». Cinq familles de plus, toutes sur le métier lui-même. */

/* La semaine d'entraînement : quatre façons d'occuper cinq jours. */
function coachMeetingPrep(m,it,left){
  if(left<2||it.score>=4||Math.random()<.45) return null;
  const tr=TRAINING[state.training]||TRAINING.tactique;
  const fitAvg=state.squad.reduce((n,p)=>n+fit(p),0)/Math.max(1,state.squad.length);
  return {kind:'semaine',side:'terrain',icon:'📋',title:"La semaine d'avant",
    text:`Cinq séances avant ${m.themName}. Ton adjoint attend de savoir sur quoi on travaille. Pour l'instant la semaine type est « ${tr.label.toLowerCase()} », fraîcheur du groupe ${Math.round(fitAvg)} %.`,
    choices:[
      {label:"Tout sur le plan de jeu",sub:"Vidéo, placements, répétitions jusqu'à l'écœurement.",plan:{training:'tactique',bonus:.6},effects:{vestiaire:-2}},
      {label:"Une semaine athlétique",sub:"Du foncier. Ça fait mal maintenant, ça paie en mars.",plan:{training:'physique',bonus:-.3},effects:{staff:3}},
      {label:"Les coups de pied arrêtés",sub:"Trente corners de suite. Personne n'aime ça, tout le monde en vit.",plan:{bonus:.8},effects:{vestiaire:-4,supporters:1}},
      {label:"Deux jours de repos",sub:"Ils rentrent chez eux. On reprend jeudi.",plan:{training:'recuperation',bonus:-.5},effects:{vestiaire:5,proches:3}},
    ]};
}

/* Le calendrier serre : ce qu'on fait des 72 heures entre deux matchs. */
function coachMeetingRecovery(m,it,left){
  const played=(state.phaseMatches||[]).length;
  if(played<2) return null;
  const fitAvg=state.squad.reduce((n,p)=>n+fit(p),0)/Math.max(1,state.squad.length);
  if(fitAvg>=92||fitAvg<82) return null; // sous 82, c'est le rendez-vous « le groupe est à bout »
  const dur=(state.phaseMatches||[]).slice(-1)[0];
  return {kind:'recup',side:'terrain',icon:'🛁',title:"Soixante-douze heures",
    text:`${dur&&dur.res==='L'?'La défaite est encore dans les jambes.':'Le match a laissé des traces.'} Trois jours avant ${m.themName}, fraîcheur ${Math.round(fitAvg)} %. Le préparateur physique et ton adjoint ne sont pas d'accord.`,
    choices:[
      {label:"Récupération et rien d'autre",sub:"Bains froids, sommeil, aucune charge. On ne prépare pas ce match, on répare le groupe.",plan:{training:'recuperation',bonus:-.7},effects:{staff:5}},
      {label:"Décrassage et vidéo",sub:"Une heure de vélo, deux heures de salle de réunion.",effects:{staff:1}},
      {label:"On s'entraîne normalement",sub:"« Ils sont professionnels. » Le préparateur note la phrase.",plan:{bonus:.7},effects:{staff:-5},
       seed:{in:1,icon:'🦵',title:"La blessure qu'on avait vue venir",text:"Le préparateur physique avait prévenu. Deux ischios en quinze jours, et il n'a même pas eu besoin de le dire.",effects:{staff:-5,vestiaire:-3}}},
    ]};
}

/* Un problème de jeu, pas un problème d'humeur : on prend l'eau, ou on ne marque plus. */
function coachMeetingShape(m,it,left){
  const ss=state.seasonStats, played=(ss&&ss.phases?ss.phases.reduce((n,p)=>n+p.W+p.D+p.L,0):0)+(state.phaseMatches||[]).length;
  if(played<4) return null;
  const ga=(ss.conceded||0)/played, gf=(ss.goals||0)/played;
  if(ga>=1.7) return {kind:'forme',side:'terrain',icon:'🥅',title:"On prend l'eau",
    text:`${Math.round(ga*10)/10} but encaissé par match depuis le début de saison. Ce n'est plus une mauvaise passe, c'est une manière de jouer.`,
    choices:[
      {label:"Fermer la boutique",sub:"Bloc bas, deux lignes de quatre, et on verra devant.",plan:{approach:'defensif',bonus:.5},effects:{supporters:-5}},
      {label:"Retravailler la ligne défensive",sub:"Une semaine entière sur le hors-jeu et les couvertures.",plan:{training:'tactique',bonus:.4},effects:{vestiaire:-2,staff:2}},
      {label:"Le problème vient de devant",sub:"« On défend à onze ou on ne défend pas. » Les attaquants vont adorer.",effects:{vestiaire:-6,technique:2}},
      {label:"Ne rien changer",sub:"Tu crois à ce que tu as construit. Ça se saura, dans un sens ou dans l'autre.",effects:{confidence:-2},
       seed:{in:1,icon:'🧱',title:"Tu n'avais rien changé",text:"La défense a fini par tenir, sans que tu touches à rien. Le vestiaire retient que tu n'as pas paniqué.",effects:{vestiaire:6,technique:3}}},
    ]};
  if(gf<=.9) return {kind:'forme',side:'terrain',icon:'🎯',title:"On ne marque plus",
    text:`${Math.round(gf*10)/10} but marqué par match. Les occasions viennent, personne ne les met. Le vestiaire commence à jouer la peur au ventre devant le but.`,
    choices:[
      {label:"Libérer les attaquants",sub:"Plus de monde devant, tant pis pour l'équilibre.",plan:{approach:'offensif',bonus:.4},effects:{staff:-2}},
      {label:"Travailler la finition",sub:"Des frappes, encore des frappes, jusqu'à ce que ça rentre.",plan:{training:'tactique',bonus:.5},effects:{vestiaire:-2}},
      {label:"Lancer un jeune devant",sub:"Il n'a peur de rien parce qu'il n'a rien à perdre.",plan:{training:'jeunes',bonus:-.4},effects:{formation:5,supporters:3}},
      {label:"Dédramatiser publiquement",sub:"« Ça va rentrer. » Le dire, et y croire assez pour qu'ils y croient.",effects:{vestiaire:4,reputation:-2}},
    ]};
  return null;
}

/* Un carton de trop, juste avant le match qu'il ne faut pas manquer. */
function coachMeetingCards(m,it,left){
  const y=state.year;
  const risk=state.squad.filter(p=>(p.yellows||0)>=2&&availableForMatch(p)&&playerRating(p,y)>=state.club.strength-1&&!(state.metFor||[]).includes(1000+p.id))
    .sort((a,b)=>playerRating(b,y)-playerRating(a,y))[0];
  if(!risk||it.score<2) return null;
  (state.metFor=state.metFor||[]).push(1000+risk.id);
  return {kind:'cartons',side:'terrain',icon:'🟨',title:`${risk.name} est à un carton de la suspension`,
    text:`Deux avertissements au compteur, et il joue ${m.themName} ${m.home?'à domicile':'à l\'extérieur'}. Un troisième et il saute le prochain — qui peut compter plus que celui-ci.`,
    choices:[
      {label:"Le laisser au repos ce match",sub:"On purge le risque, on se prive de lui aujourd'hui.",plan:{bonus:-.9},effects:{staff:2}},
      {label:"Lui demander de se contenir",sub:"Un défenseur qui n'ose plus tacler est un défenseur à moitié.",plan:{bonus:-.4},effects:{vestiaire:1}},
      {label:"Le faire jouer normalement",sub:"On joue le match qu'on a, pas celui d'après.",effects:{},
       seed:{in:1,icon:'🟥',title:"Le carton qu'il ne fallait pas",text:`${risk.name} l'a pris, évidemment, et a regardé le match suivant depuis la tribune.`,effects:{vestiaire:-3,confidence:-3}}},
    ]};
}

/* Le terrain et le ciel : le football se joue dehors. */
function coachMeetingPitch(m,it,left){
  if(m.home||state.phase!==1||it.score<2) return null;
  const froid=Math.random()<.5;
  return {kind:'pelouse',side:'terrain',icon:froid?'❄️':'🌧️',title:froid?`Il va geler à ${m.themName}`:`La pelouse de ${m.themName} est un champ`,
    text:froid?"Moins quatre annoncé au coup d'envoi, terrain dur comme du béton. Le jeu au sol va être une loterie."
      :"Trois jours de pluie, un drainage d'avant-guerre. Le ballon s'arrête là où il tombe.",
    choices:[
      {label:"Jouer direct",sub:"Longs ballons, seconds ballons, duels. Ce n'est pas beau, c'est efficace ici.",plan:{style:'direct',bonus:.9},effects:{supporters:-4}},
      {label:"Garder ton jeu",sub:"Tes principes valent mieux qu'un terrain. On va voir.",plan:{bonus:-.6},effects:{supporters:3,vestiaire:2}},
      {label:"Crampons longs et échauffement rallongé",sub:"Le détail qui ne se voit pas, et qui évite trois blessures.",plan:{bonus:.2},effects:{staff:4,budget:-.01}},
    ]};
}

/* ---------- L'autre moitié : les gens, la maison, la maison-club ----------
   Retour du propriétaire (22/09/2026) : « réduis les parties footballistiques,
   le reste compte aussi ». Le sportif était monté à 84 % des rendez-vous parce
   que ses familles sont presque toujours applicables, quand l'humain restait
   verrouillé derrière des conditions étroites. Quatre familles de plus de ce
   côté-là, et un tirage qui alterne (voir coachDrawMeeting). */

/* L'agent d'un joueur : le football est aussi un bureau. */
function coachMeetingAgent(m,it,left){
  const y=state.year, c=state.club;
  const p=state.squad.filter(x=>x.contractEnd&&x.contractEnd<=y+1&&playerRating(x,y)>=c.strength-1&&!(state.metFor||[]).includes(2000+x.id))
    .sort((a,b)=>playerRating(b,y)-playerRating(a,y))[0];
  if(!p) return null;
  (state.metFor=state.metFor||[]).push(2000+p.id);
  return {kind:'agent',side:'vie',icon:'💼',title:`L'agent de ${p.name} s'est invité`,
    text:`Costume clair, café pris au bar du stade. « Mon joueur est bien ici, mais il a ${playerAge(p,y)} ans et son contrat finit en ${p.contractEnd}. Vous comprenez. » ${p.name} vaut ${$(playerValue(p,y))} et touche ${$(p.wage)}.`,
    choices:[
      {label:"Prolonger au prix qu'il demande",sub:"Le garder coûte, le perdre coûterait plus.",effects:{budget:-.04,vestiaire:4,confidence:-3}},
      {label:"Lui promettre une revalorisation en fin de saison",sub:"Gagner six mois. Il faudra tenir parole.",effects:{vestiaire:2},
       seed:{in:1,icon:'🤥',title:"La revalorisation promise",text:`L'agent de ${p.name} n'a rien oublié. Le vestiaire non plus.`,effects:{vestiaire:-7,reputation:-3}}},
      {label:"Refuser et assumer",sub:"Il partira libre. C'est un choix, pas un oubli.",effects:{confidence:3,vestiaire:-5},
       seed:{in:1,icon:'🕊️',title:"Parti pour rien",text:`${p.name} a signé ailleurs sans que le club touche un centime. On te l'a reproché tout l'été.`,effects:{confidence:-5,supporters:-4}}},
      {label:"Le mettre sur le marché tout de suite",sub:"Vendre tant qu'il vaut quelque chose.",effects:{confidence:4,vestiaire:-4,supporters:-3}},
    ]};
}

/* Les supporters ne sont pas un chiffre : ils sonnent à la porte. */
function coachMeetingFans(m,it,left){
  const g=state.gauges, c=state.club;
  const f=(state.comp.form&&state.comp.form[c.name])||[];
  const bad=f.slice(-4).filter(r=>r==='L').length>=2;
  if(g.supporters>=48&&!bad) return null;
  return {kind:'tribune',side:'vie',icon:'📣',title:g.supporters<35?"Une banderole au centre d'entraînement":"Une délégation demande à te voir",
    text:g.supporters<35?`Ils sont venus à l'aube accrocher deux draps sur les grilles. Supporters ${Math.round(g.supporters)}/100, et le message ne parle pas que des joueurs.`
      :`Trois représentants du kop attendent à l'accueil depuis une heure. Ils veulent « comprendre ». Supporters ${Math.round(g.supporters)}/100.`,
    choices:[
      {label:"Les recevoir, longuement",sub:"Leur ouvrir la porte, écouter, expliquer. Ça prend l'après-midi.",plan:{bonus:-.3},effects:{supporters:9,pressure:4}},
      {label:"Leur donner raison en public",sub:"Dire tout haut ce qu'ils pensent. Le président lira.",effects:{supporters:12,confidence:-7,reputation:2}},
      {label:"Renvoyer vers le service communication",sub:"Ce n'est pas ton métier. Ce n'est pas faux.",effects:{supporters:-6,pressure:-2}},
      {label:"Leur demander de soutenir l'équipe",sub:"Retourner la conversation. Courageux, ou maladroit.",effects:{supporters:-3,vestiaire:5,pressure:2}},
    ]};
}

/* Chez toi, on t'attend aussi. C'est la moitié du sujet. */
function coachMeetingHome(m,it,left){
  if((state.metHome||0)>=1+Math.floor(state.phase/2)) return null;
  if(Math.random()<.55) return null;
  state.metHome=(state.metHome||0)+1;
  const g=state.gauges;
  const scenes=[
    {t:"L'anniversaire tombe le jour du match",x:`On souffle les bougies samedi. Le déplacement à ${m.themName} part vendredi soir.`,a:"Y aller, rejoindre le groupe au petit matin"},
    {t:"Le spectacle de fin d'année",x:"Trois minutes sur une scène de gymnase, préparées depuis septembre. Même heure que la mise au vert.",a:"Y aller, arriver en retard à la mise au vert"},
    {t:"Le rendez-vous qu'on a déjà repoussé deux fois",x:"« On en reparle après la saison » — tu as dit ça en août. On est en janvier.",a:"Le prendre, ce week-end, quoi qu'il arrive"},
    {t:"Ton père au téléphone",x:"Il ne demande rien. Il rappelle juste qu'il n'a pas eu de nouvelles depuis six semaines.",a:"Partir le voir deux jours"},
  ];
  const sc=pick(scenes);
  return {kind:'maison',side:'vie',icon:'🏡',title:sc.t,
    text:`${sc.x} Proches ${Math.round(g.proches)}/100 — c'est ce qui reste quand le football s'arrête.`,
    choices:[
      {label:sc.a,sub:"Le groupe comprendra. Ou fera semblant.",plan:{bonus:-.6},effects:{proches:10,staff:-3,pressure:-4}},
      {label:"Rester avec le groupe",sub:"C'est le métier. On te l'a assez dit.",plan:{bonus:.4},effects:{proches:-8,staff:2}},
      {label:"Y passer une heure, puis filer",sub:"Ne satisfaire personne, à commencer par toi.",effects:{proches:3,pressure:3}},
      {label:"Déléguer la mise au vert à ton adjoint",sub:"Il en a vu d'autres. Le président, lui, compte les absences.",effects:{proches:8,staff:4,confidence:-4}},
    ]};
}

/* Le club n'est pas que le terrain : il y a un étage au-dessus. */
function coachMeetingBoard(m,it,left){
  if(state.phase<1||(state.metBoard||0)>=state.phase) return null;
  if(Math.random()<.5) return null;
  state.metBoard=(state.metBoard||0)+1;
  const c=state.club;
  const scenes=[
    {t:"Le sponsor veut sa journée",x:"Une matinée de tournage, un maillot à tenir face caméra, des mains à serrer. La veille de l'entraînement du jeudi."},
    {t:"Le directeur sportif t'apporte un dossier",x:"Un joueur qu'il adore, que tu n'as pas demandé, et qu'il aimerait « que tu valides »."},
    {t:"Le conseil veut un plan à trois ans",x:"Une réunion de quatre heures pour un club qui ne sait pas de quoi sera fait le mois prochain."},
  ];
  const sc=pick(scenes);
  return {kind:'direction',side:'vie',icon:'🏢',title:sc.t,
    text:`${sc.x} ${capitalize(c.presidentName)} n'a pas posé la question, il a simplement transmis la date.`,
    choices:[
      {label:"Y aller et bien le faire",sub:"Une journée perdue pour le terrain, gagnée en haut.",plan:{bonus:-.5},effects:{confidence:6,reseau:4}},
      {label:"Envoyer ton adjoint",sub:"Il représentera très bien le club. Ce n'est pas toi qu'ils voulaient.",effects:{confidence:-3,staff:3}},
      {label:"Refuser, tu prépares un match",sub:"Défendable. Impopulaire.",plan:{bonus:.4},effects:{confidence:-6,vestiaire:3}},
      {label:"Y aller et en profiter pour demander",sub:"Poser ta liste sur la table pendant qu'ils sourient.",plan:{bonus:-.5},effects:{budget:.04,confidence:-2,reseau:3}},
    ]};
}

/* Ce que la décision fait au match qui suit. */
function coachApplyPlan(plan){
  const m=state.match, P=coachSquadMap(), y=state.year, notes=[];
  if(!plan) return notes;
  const fac=boostFactor();
  let pl={...plan};
  if(pl.delegate){
    // L'adjoint choisit à ta place, d'autant mieux que ton staff est bon.
    const kid=state.squad.filter(p=>playerAge(p,y)<=21&&availableForMatch(p)).sort((a,b)=>playerRating(b,y)-playerRating(a,y))[0];
    const good=Math.random()<clamp(state.gauges.staff,0,100)/100;
    if(good||!kid){ notes.push("Ton adjoint a aligné le plus sûr des remplaçants."); }
    else { pl.forceIn=kid.id; pl.bonus=(pl.bonus||0)-.8; notes.push(`Ton adjoint a lancé ${kid.name}, 
      sans te prévenir.`.replace(/\s+/g,' ')); }
  }
  if(pl.forceIn!=null){
    const p=state.squad.find(x=>x.id===pl.forceIn);
    if(p&&!m.xi.includes(p.id)){
      const worst=m.xi.map(id=>P[id]).filter(x=>x&&x.pos===p.pos).sort((a,b)=>playerRating(a,y)-playerRating(b,y))[0];
      const drop=worst||m.xi.map(id=>P[id]).filter(Boolean).sort((a,b)=>playerRating(a,y)-playerRating(b,y))[0];
      if(drop){ m.xi=m.xi.map(id=>id===drop.id?p.id:id); m.bench=m.bench.filter(id=>id!==p.id);
        if(m.bench.length<benchSize(y)&&!m.bench.includes(drop.id)) m.bench.push(drop.id);
        drop.morale=clamp(drop.morale-6); }
      notes.push(`${p.name} est titulaire.`);
    }
  }
  if(pl.playHurt!=null){
    const p=state.squad.find(x=>x.id===pl.playHurt);
    if(p){ state.hurtGamble={id:p.id,weeks:p.injury}; p.injury=0;
      if(!m.xi.includes(p.id)){ const drop=m.xi.map(id=>P[id]).filter(x=>x&&x.pos===p.pos).sort((a,b)=>playerRating(a,y)-playerRating(b,y))[0]; if(drop) m.xi=m.xi.map(id=>id===drop.id?p.id:id); }
      notes.push(`${p.name} joue sur une jambe.`); }
  }
  if(pl.rotate){
    const tired=m.xi.map(id=>P[id]).filter(Boolean).sort((a,b)=>fit(a)-fit(b)).slice(0,3);
    const fresh=state.squad.filter(p=>!m.xi.includes(p.id)&&availableForMatch(p)).sort((a,b)=>fit(b)-fit(a));
    tired.forEach(t=>{ const inP=fresh.find(p=>p.pos===t.pos&&!m.xi.includes(p.id))||fresh.find(p=>!m.xi.includes(p.id));
      if(inP){ m.xi=m.xi.map(id=>id===t.id?inP.id:id); m.bench=m.bench.filter(id=>id!==inP.id); } });
    notes.push("Trois cadres au repos.");
  }
  if(pl.approach){ state.approach=pl.approach; m.approach=pl.approach; notes.push(`Approche : ${APPROACHES[pl.approach].label.toLowerCase()}.`); }
  if(pl.style){ state.styleId=pl.style; m.ourStyle=pl.style; notes.push(`Style : ${styleById(pl.style).name.toLowerCase()}.`); }
  if(pl.training){ state.training=pl.training; notes.push(`Semaine : ${TRAINING[pl.training].label.toLowerCase()}.`); }
  if(pl.bonus>0){ state.boostStreak=(state.boostStreak||0)+1; }
  else if(pl.bonus<0||!pl.bonus){ state.boostStreak=Math.max(0,(state.boostStreak||0)-1); }
  if(pl.bonus){ const b=pl.bonus*MEETING_WEIGHT*(pl.bonus>0?fac:1);
    state.matchBoost={v:b,from:state.matchday,until:state.comp?Math.min(state.comp.phaseEnds[state.phase],state.matchday+boostSpan()):state.matchday+1};
    notes.push(`${b>0?'Ton choix porte l\'équipe':'Ton choix coûte à l\'équipe'} : ${b>0?'+':''}${b.toFixed(1)} de force ${boostLabel()}.`);
    if(b>0&&fac<.95) notes.push(`Amorti à ${Math.round(fac*100)} % : tu tires sur la même corde depuis ${state.boostStreak-1} rendez-vous.`); }
  if(pl.effort){ state.effort=pl.effort; }
  return notes;
}

/* Combien de journées il reste à courir sur la décision en cours */
function boostLeft(){ const b=state.matchBoost; if(!b||!state.comp) return 0; return Math.max(0,b.until-state.matchday); }
function boostLabel(){ const n=boostLeft(); return n<=1?'sur ce match':`à plein sur ce match, puis en s'estompant sur ${n} journées`; }
/* Une décision vaut tout son poids sur le match qui suit, puis s'éteint. */
function activeBoost(){
  const b=state.matchBoost; if(!b||!state.comp) return 0;
  const left=b.until-state.matchday; if(left<=0) return 0;
  const span=Math.max(1,b.until-(b.from==null?b.until-1:b.from));
  return b.v*(left/span);
}
function coachChooseMeeting(i){
  const mt=state.meeting, ch=mt&&mt.choices[i]; if(!ch) return;
  const before=coachSnapshot();
  const extra=coachApplyEffects(ch.effects||{});
  const notes=coachApplyPlan(ch.plan);
  if(ch.seed) plantSeed({...ch.seed,from:`${mt.title} → ${ch.label}`});
  log(`${mt.icon} <b>${mt.title}</b> → ${ch.label}.`);
  state.meetingRecap={title:mt.title,icon:mt.icon,choice:ch.label,notes,before,extra};
  if(state.seasonStats) state.seasonStats.meetings=(state.seasonStats.meetings||0)+1;
  (state.seasonStats.decisions=state.seasonStats.decisions||[]).push({icon:mt.icon,title:mt.title,choice:ch.label});
  state.meeting=null;
  coachKickoff(true);
  // Le pari sur un joueur diminué se paie parfois tout de suite.
  const hg=state.hurtGamble; state.hurtGamble=null;
  if(hg){ const p=state.squad.find(x=>x.id===hg.id);
    if(p){ if(Math.random()<.45){ p.injury=hg.weeks+randInt(2,4); log(`🩼 ${p.name} sort sur blessure : ${p.injury} semaines. Le pari a coûté cher.`); }
      else { p.injury=Math.max(0,hg.weeks-1); log(`💪 ${p.name} a tenu. Le pari est passé.`); } } }
  saveGame(); render();
}

/* Ce qui a changé après un match joué en coulisses et justifie de te redonner la main */

function coachAlertsAfter(rec){
  const a=[], P=coachSquadMap(), c=state.club;
  (rec.xi||[]).forEach(id=>{ const p=P[id]; if(!p) return; if(p.injury>0) a.push(`🩼 ${p.name} est blessé (${p.injury} sem.)`); else if(p.suspended>0) a.push(`🟥 ${p.name} est suspendu`); });
  const f=(state.comp.form&&state.comp.form[c.name])||[]; if(f.length>=3&&f.slice(-3).every(r=>r==='L')) a.push("📉 Trois défaites de suite");
  if(c.confidence<25&&!state.confAlerted){ state.confAlerted=true; a.push("🕴️ Le président s'impatiente"); } if(c.confidence>=35) state.confAlerted=false;
  return a;
}
/* Avance dans le calendrier : s'arrête sur un temps fort, sinon joue avec ta compo jusqu'au prochain */
function coachAdvance(){
  const comp=state.comp, c=state.club; let guard=0;
  while(guard++<80){
    if(state.matchday>=comp.phaseEnds[state.phase]){ coachFinishPhase(); return; }
    const fx=ourFixture(comp,state.matchday,c.name);
    if(!fx){ playOthers(comp,state.matchday,c.name); state.matchday++; continue; }
    coachBuildMatch(fx);
    const mt=coachDrawMeeting(fx);
    if(mt){ state.meeting=mt; state.sinceLast=state.skipped||[]; state.skipped=[]; state.alerts=[]; state.pendingChoice='meeting'; saveGame(); return; }
    coachKickoff(true);
    const rec=state.lastMatch; (state.skipped=state.skipped||[]).push({home:rec.home,away:rec.away,gh:rec.gh,ga:rec.ga,us:rec.us,res:rec.res,story:rec.story,scorers:rec.scorers,matchday:rec.matchday});
    state.alerts=coachAlertsAfter(rec);
    const notes=recoverSquad(state.squad,state.year,{training:state.training,staff:state.gauges.staff}); if(notes.length) state.seasonStats.injuries.push(...notes);
  }
}
function coachNextMatch(){ coachAdvance(); }
/* Modifications de compo depuis l'écran d'avant-match */
function coachKickoff(auto=false){
  const m=state.match; if(!m||m.half!==0) return; const P=coachSquadMap(); const year=state.year;
  // compo incomplète : on complète automatiquement
  m.xi=m.xi.filter(id=>P[id]&&availableForMatch(P[id])); m.bench=m.bench.filter(id=>P[id]&&availableForMatch(P[id])&&!m.xi.includes(id));
  if(m.xi.length<11){ const a=autoLineup(state.squad,FORMATIONS[m.formation],year); a.xi.forEach(p=>{ if(m.xi.length<11&&!m.xi.includes(p.id)){ m.xi.push(p.id); m.bench=m.bench.filter(id=>id!==p.id); } }); }
  if(m.captain==null||!m.xi.includes(m.captain)){ const c=defaultCaptain(m.xi.map(id=>P[id])); m.captain=c?c.id:null; }
  state.captainId=m.captain; m.onPitch=[...m.xi]; m.played={}; m.xi.forEach(id=>{ m.played[id]={min:0,start:true,goals:0,assists:0,yellow:0,red:0,inj:0,sub:false}; });
  if(!state.approach) state.approach='equilibre'; if(!state.training) state.training='tactique';
  const decided=activeBoost();
  m.bonus=coachBonus()+decided; m.approach=state.approach;
  // coachBonusLines() lit la décomposition, qui porte déjà la ligne de la
  // décision en cours : l'ajouter ici la comptait deux fois à l'écran.
  matchFactors(m,P,{extra:coachBonusLines()});
  const ctx={injuryMult:1-(state.gauges.staff-50)*.006};
  matchPlayHalf(m,P,ctx);
  if(auto){ matchApplyHalftime(m,P,'keep',{}); matchPlayHalf(m,P,ctx); coachAfterMatchSim(); return; }
  state.pendingChoice='halftime'; saveGame();
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
  ss.trainWeeks=ss.trainWeeks||{}; ss.trainWeeks[state.training]=(ss.trainWeeks[state.training]||0)+1;
  log(`${res==='W'?'✅':res==='L'?'❌':'➖'} J${m.matchday+1} : ${ha.home} ${ha.gh}–${ha.ga} ${ha.away}. ${m.story}`);
  state.pendingChoice='matchResult'; saveGame();
}
function coachAfterMatch(){
  const notes=recoverSquad(state.squad,state.year,{training:state.training,staff:state.gauges.staff}); if(notes.length) state.seasonStats.injuries.push(...notes);
  if(state.lastMatch) state.alerts=coachAlertsAfter(state.lastMatch);
  coachAdvance(); render();
}
/* Joue toutes les journées restantes de la phase avec la compo automatique */
function coachAutoLineupSilent(){ const m=state.match; const a=autoLineup(state.squad,FORMATIONS[m.formation],state.year); m.xi=a.xi.map(p=>p.id); m.bench=a.bench.map(p=>p.id); m.onPitch=[...m.xi]; if(m.captain==null||!m.xi.includes(m.captain)){ const c=defaultCaptain(a.xi); m.captain=c?c.id:null; } }
/* Bilan de phase : confiance du président, pression, jauges */
function coachFinishPhase(){
  const comp=state.comp, c=state.club, ss=state.seasonStats; const mine=state.phaseMatches||[];
  const goalsFor=mine.reduce((n,m)=>n+(m.us==='home'?m.gh:m.ga),0), goalsAg=mine.reduce((n,m)=>n+(m.us==='home'?m.ga:m.gh),0);
  const W=mine.filter(m=>m.res==='W').length, D=mine.filter(m=>m.res==='D').length, L=mine.filter(m=>m.res==='L').length;
  const pos=tablePos(comp.table,c.name), N=comp.teams.length;
  // La confiance du président est le chiffre qui licencie : elle doit dire d'où
  // elle vient, ligne par ligne, et le total affiché doit être celui qu'on applique.
  const gap=c.objectivePos-pos; const why=[];
  const place=clamp(gap*1.4,-9,9);
  why.push({t:gap>0?`${ordinal(pos)} pour un objectif de ${ordinal(c.objectivePos)} : ${gap} place${gap>1?'s':''} d'avance`:gap===0?`${ordinal(pos)} : l'objectif est tenu`:`${ordinal(pos)} pour un objectif de ${ordinal(c.objectivePos)} : ${-gap} place${gap<-1?'s':''} de retard`,d:place});
  if(W-L) why.push({t:`${W} victoire${W>1?'s':''} pour ${L} défaite${L>1?'s':''} sur la phase`,d:(W-L)*.8});
  let dConf=place+(W-L)*.8;
  if(pos<=3){ dConf+=2; why.push({t:"Sur le podium",d:2}); }
  if(pos>N-3){ dConf-=5; why.push({t:"Dans la zone rouge",d:-5}); }
  if(squadWages()>c.wageCap*1.1){ dConf-=3; why.push({t:`Masse salariale à ${Math.round(squadWages()/c.wageCap*100)} % du plafond : au-delà de 110 %, il le fait payer`,d:-3}); }
  if(dConf<0){ const before=dConf; dConf/=c.tolerance; dConf*=(1-state.perks.confidenceRes);
    if(Math.abs(dConf-before)>=.5) why.push({t:c.tolerance<1?`${capitalize(c.presidentName)} est plus dur que la moyenne : la sanction est amplifiée`:`${capitalize(c.presidentName)} est patient : la sanction est adoucie`,d:dConf-before}); }
  const confBefore=c.confidence; c.confidence=clamp(c.confidence+dConf);
  state.pressure=clamp(state.pressure+(L-W)*1.2*state.mode.pressureMult+(pos>c.objectivePos?3:-2)*state.mode.pressureMult-state.perks.pressureRes*.2+(state.gauges.supporters<35?2:0));
  state.gauges.supporters=clamp(state.gauges.supporters+(W-L)*1.5+(goalsFor>goalsAg*1.5?2:0));
  state.gauges.vestiaire=clamp(state.gauges.vestiaire+(W-L)*.8-(state.squad.filter(p=>p.morale<35).length)*1.5);
  const injuries=(ss.injuries||[]).splice(0);
  const phaseRec={n:state.phase+1,matches:mine.map(m=>({home:m.home,away:m.away,gh:m.gh,ga:m.ga,us:m.us,res:m.res,story:m.story,scorers:m.scorers})),W,D,L,gf:goalsFor,ga:goalsAg,pos,dConf:Math.round(dConf),confBefore,injuries,table:sortTable(comp.table).map(t=>({...t})),strength:Math.round(coachStrengthShown()*10)/10,base:Math.round(coachStrengthBreakdown().base*10)/10,confWhy:why.map(x=>({t:x.t,d:Math.round(x.d*10)/10}))};
  ss.phases.push(phaseRec); state.lastPhase=phaseRec; state.match=null; state.skipped=[]; state.sinceLast=[]; state.alerts=[];
  log(`📊 Phase ${state.phase+1} : ${W} V · ${D} N · ${L} D. ${c.name} est ${ordinal(pos)} en ${c.leagueName}. Confiance du président ${Math.round(confBefore)} → ${Math.round(c.confidence)}.`);
  state.phase++;
  state.pendingChoice='phaseResult'; saveGame();
}
function coachAfterPhase(){
  const c=state.club;
  if(c.confidence<=0){
    if(coachFateProtects()){ c.confidence=25; log(`${state.rouletteFate.icon} ${capitalize(c.presidentName)} voudrait te virer, mais la clause d'exclusivité te protège autant qu'elle t'enferme : tu restes.`); }
    else { coachSacked(); render(); return; } }
  if(state.phase>=4){ coachEndConf(); render(); return; }
  if(state.pressure>=100){ state.pendingChoice='pressureCrisis'; unlockTrophy('x-pressure'); render(); return; }
  if(state.phase===2&&eraHasWinterMercato(state.year)){ coachOpenMercato(true); render(); return; }
  coachPlayPhase(); render();
}
/* La clause d'exclusivité lie les deux parties : le club ne peut pas te lâcher */
function coachFateProtects(){ const f=state.rouletteFate; return !!(f&&f.kind==='exclusive'&&f.installed&&state.club&&!state.club.sacked); }
function coachSacked(){
  const c=state.club; state.sackings++; state.consecutiveSackings++; unlockTrophy('c-sacked'); if(state.sackings>=3) unlockTrophy('c-sacked-3');
  const pos=state.comp?tablePos(state.comp.table,c.name):null;
  state.history.push({year:state.year,club:c.name,league:c.leagueName,tier:c.tier,pos,objective:c.objectivePos,sacked:true,phase:state.phase});
  log(`🪓 <b>${c.name}</b> te licencie après la phase ${state.phase}. ${capitalize(c.presidentName)} a perdu patience.`);
  state.stats.reputation=clamp(state.stats.reputation-6); state.pressure=clamp(state.pressure+8); const dc=-Math.round(8*(.3+(state.cote==null?30:state.cote)/100)); state.cote=clamp((state.cote==null?30:state.cote)+dc); state.coteDelta=dc;
  c.sacked=true; state.comp=null; state.match=null; state.year++; state.age++;
  state.pendingChoice='sacked';
}
function coachEndConf(){
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
  const fx=state.rouletteFate;
  if(fx&&fx.kind==='exclusive'&&fx.installed){ state.pressure=clamp(state.pressure+(champion?4:10)); }
  if(fx&&fx.kind==='exile'&&(champion||cupWon)&&year-fx.year>=2){ log(`🕊️ ${champion?'Un titre':'Une coupe'} loin des projecteurs : l'affaire des archives est oubliée, les grands clubs recommencent à appeler.`); state.cote=clamp(state.cote+10); state.rouletteFate=null; unlockTrophy('r-redemption'); }
  // Une saison de football coûte du temps à ceux qui t'attendent, d'autant plus qu'elle a été dure.
  const wear=(1+Math.round(state.pressure/40))*Math.max(.25,Math.min(1,state.gauges.proches/45));
  state.gauges.proches=clamp(state.gauges.proches-wear);
  if(state.gauges.proches<=18) log(`🏡 Chez toi, on ne t'attend plus vraiment pour dîner. Proches ${Math.round(state.gauges.proches)}/100.`);
  if(state.rouletteEcho&&state.rouletteEcho.seasons>0){ state.rouletteEcho.seasons--; if(!state.rouletteEcho.seasons){ log(`${state.rouletteEcho.icon} ${state.rouletteEcho.label} : c'est fini, la saison prochaine repart sur tes seules forces.`); state.rouletteEcho=null; } }
  const s=state.stats; s.reputation=clamp(s.reputation+clamp(overperf*1,-5,5)+(champion?4:0)+(cupWon?2:0)+(euroWon?6:0)+(relegated?-6:0)+(c.tier==='superclub'?1:0)+(c.tier==='amateur'?-1:0)+(55-s.reputation)*.06);
  // cote : ce que cette saison vaut sur le marché des bancs
  // La cote : on liste les mérites bruts, puis on affiche ce qu'ils valent
  // une fois amortis. Avant, l'écran annonçait « −4 −6 +2 » pour une cote qui
  // ne bougeait que d'un point : le détail ne faisait pas le total.
  const coteBefore=state.cote==null?30:state.cote; const raw=[]; let dCote=0;
  if(objectiveMet){ dCote+=5; raw.push({t:"objectif atteint",v:5}); } else { const m=-Math.min(4,pos-c.objectivePos); dCote+=m; raw.push({t:"objectif manqué",v:m}); }
  if(overperf>=2){ const b=Math.min(8,overperf*1.5); dCote+=b; raw.push({t:`${overperf} places au-dessus de l'objectif`,v:b}); }
  if(champion){ const v=promotion?6:8; dCote+=v; raw.push({t:promotion?"montée":"titre",v}); } if(cupWon){ dCote+=3; raw.push({t:"coupe",v:3}); } if(euroWon){ dCote+=10; raw.push({t:"coupe d'Europe",v:10}); } if(relegated){ dCote-=6; raw.push({t:"relégation",v:-6}); }
  const rawSum=dCote;
  dCote*=(TIER_LEVEL[c.tier]||1); if(dCote>0) dCote=Math.min(12,dCote*(1-coteBefore/130)); else dCote*=(.3+coteBefore/100);
  const scale=rawSum?dCote/rawSum:1;
  const coteWhy=raw.map(r=>{ const v=Math.round(r.v*scale*10)/10; return `${r.t} ${v>0?'+':''}${String(v).replace('.',',')}`; });
  if(rawSum&&Math.abs(scale-1)>=.08) coteWhy.push(rawSum>0?`amorti : à ${Math.round(coteBefore)} de cote et à ce niveau de club, un exploit rapporte moins`:`amorti : à ${Math.round(coteBefore)} de cote, tu n'as pas grand-chose à perdre`);
  dCote+=2; coteWhy.push("une saison de plus au compteur +2"); dCote=Math.round(dCote*10)/10; state.cote=clamp(coteBefore+dCote);
  // Une cote au sommet (ou au plancher) absorbe le reste : il faut le dire,
  // sinon le bilan annonce « +9,5 mérités » pour une cote qui bouge d'un point.
  const coteApplied=Math.round((state.cote-coteBefore)*10)/10;
  if(Math.abs(coteApplied-dCote)>=.3){ const d=Math.round((coteApplied-dCote)*10)/10;
    coteWhy.push(`${d<0?'plafond':'plancher'} de la cote (${Math.round(state.cote)}/100) ${d>0?'+':''}${String(d).replace('.',',')}`); }
  state.coteDelta=state.cote-coteBefore;
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
  const devBefore=new Map(state.squad.map(p=>[p.id,playerRating(p,year+1)]));
  const devNotes=developSquad(state.squad,year,{minutes:ss.minutes,formation:state.gauges.formation,staff:state.gauges.staff,vestiaire:state.gauges.vestiaire,youthWeeks:ss.youthWeeks||0});
  state.squad.forEach(p=>{ const b=devBefore.get(p.id); if(b!=null) p.lastDev=Math.round((playerRating(p,year+1)-b)*10)/10; });
  const contracts=[]; const nextYear=year+1;
  state.squad=state.squad.filter(p=>{ const age=playerAge(p,nextYear); const r=playerRating(p,nextYear);
    if(age>=35&&r<c.strength-12){ contracts.push(`${p.name} prend sa retraite`); return false; }
    if(p.contractEnd<=year){ if(r>=c.strength-8){ p.contractEnd=nextYear+randInt(1,3); const w=playerWage(p,nextYear,c.tier)*rand(1,1.15); contracts.push(`${p.name} prolonge${w>p.wage*1.3?' (grosse revalorisation)':w<p.wage*.8?' (salaire revu à la baisse)':''}`); p.wage=w; return true; } contracts.push(`${p.name} part libre`); return false; }
    return true; });
  state.squad.forEach(p=>{ if(playerAge(p,nextYear)<=21&&playerRating(p,nextYear)>=85&&!p.real) unlockTrophy('m-youth-star'); if(p.joinedYear===year&&p.paid===0&&(ss.minutes[p.id]||0)>=3) unlockTrophy('m-free'); });
  const topScorer=Object.entries(ss.scorers).sort((a,b)=>b[1]-a[1])[0];
  const bestPlayer=[...state.squad].filter(p=>(p.rated||0)>=8).sort((a,b)=>(b.sumRating/b.rated)-(a.sumRating/a.rated))[0];
  const season={year,club:c.name,league:c.leagueName,tier:c.tier,pos,teams:N,objective:c.objectivePos,objectiveMet,champion,promotion,relegated,cupWon,cupRounds:state.cup.roundsReached,cupPath:state.cup.path,euro:euro?{name:euro.name,won:euro.won,rounds:euro.roundsReached,path:euro.path}:null,award,goals:ss.goals,conceded:ss.conceded,topScorer:topScorer?`${topScorer[0]} (${topScorer[1]})`:null,bestPlayer:bestPlayer?`${bestPlayer.name} (${(bestPlayer.sumRating/bestPlayer.rated).toFixed(2)})`:null,table:table.map(t=>({...t})),phases:ss.phases.map(p=>({n:p.n,W:p.W,D:p.D,L:p.L,pos:p.pos})),devNotes,contracts,dConf:Math.round(dConf),confidence:Math.round(c.confidence),formation:state.formation,style:styleById(state.styleId).name,budgetUsed:c.budget-(state.market?state.market.budgetLeft:0),cote:{before:Math.round(coteBefore),after:Math.round(state.cote),why:coteWhy,level:coteLabel(coteToStrength(state.cote))},contractEnd:c.contractEnd};
  // Ce que la saison laisse chez les gens : c'est ça, le bilan.
  const all=(ss.phases||[]).flatMap(ph=>ph.matches||[]);
  const margin=x=>(x.us==='home'?x.gh-x.ga:x.ga-x.gh);
  const best=all.filter(x=>x.res==='W').sort((a,b)=>margin(b)-margin(a))[0]||null;
  const worst=all.filter(x=>x.res==='L').sort((a,b)=>margin(a)-margin(b))[0]||null;
  const wantOut=state.squad.filter(p=>p.morale<42).sort((a,b)=>a.morale-b.morale).slice(0,4)
    .map(p=>({name:p.name,age:playerAge(p,year),morale:Math.round(p.morale),rating:playerRating(p,year)}));
  const loyal=state.squad.filter(p=>p.morale>=72).sort((a,b)=>playerRating(b,year)-playerRating(a,year)).slice(0,3)
    .map(p=>({name:p.name,age:playerAge(p,year),rating:playerRating(p,year)}));
  const risen=state.squad.filter(p=>playerAge(p,year)<=23&&p.lastDev>0).sort((a,b)=>b.lastDev-a.lastDev).slice(0,3)
    .map(p=>({name:p.name,age:playerAge(p,year),gain:p.lastDev,rating:playerRating(p,year)}));
  const g0=ss.g0||{};
  const presLine=dConf>=6?`« Voilà pourquoi je t'ai choisi. »`:dConf>=0?`« C'est correct. Je n'ai pas dit plus. »`:dConf>=-8?`« On va devoir parler, toi et moi. »`:`« Je ne sais pas ce que tu fais encore là. »`;
  season.bilan={best,worst,wantOut,loyal,risen,presLine,
    meetings:ss.meetings||0,decisions:(ss.decisions||[]).slice(-3),
    gauges:Object.keys(GAUGE_INFO).map(k=>({k,icon:GAUGE_INFO[k].icon,label:GAUGE_INFO[k].label,before:Math.round(g0[k]==null?state.gauges[k]:g0[k]),after:Math.round(state.gauges[k])})),
    pressure:{before:Math.round(g0.pressure==null?state.pressure:g0.pressure),after:Math.round(state.pressure)},
    effort:state.effort||null};
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
  if(c.confidence<35&&coachFateProtects()){ c.confidence=Math.max(c.confidence,38); log(`${state.rouletteFate.icon} ${capitalize(c.presidentName)} ne veut plus de toi, mais la clause l'oblige : tu rempiles ici, qu'il le veuille ou non.`); }
  else if(c.confidence<35){ log(`🪓 ${capitalize(c.presidentName)} ne te renouvelle pas sa confiance : tu quittes ${c.name}.`); state.sackings++; unlockTrophy('c-sacked'); c.sacked=true; state.stats.reputation=clamp(state.stats.reputation-3); state.cote=clamp(state.cote-4); state.coteDelta-=4;
    // Le non-renouvellement tombe après le calcul de la cote : sans ces deux
    // lignes, le bilan annonçait un chiffre et en affichait un autre.
    const sn=state.lastSeason; if(sn&&sn.cote){ sn.cote.why.push("non prolongé −4"); sn.cote.after=Math.round(state.cote); sn.cote.level=coteLabel(coteToStrength(state.cote)); } }
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
  const ripe=coachRipeSeed();
  if(ripe){
    const before=coachSnapshot(); const extra=coachApplyEffects(ripe.effects||{});
    log(`${ripe.icon||'🌱'} ${ripe.text}`);
    state.pendingResult={title:`${ripe.icon||'🌱'} ${ripe.title||'Ce que tu avais semé'}`,subtitle:ripe.from||'',narrative:ripe.text,before,after:coachSnapshot(),extra,next:'intersaison'};
    state.pendingChoice='choiceResult'; return;
  }
  const n=state.history.length;
  if(n>=3&&n-state.lastRouletteSeason>=5&&state.rouletteCount<2&&Math.random()<.12){ state.currentRoulette={event:pickNoRepeat('c-roulette',COACH_ROULETTES),outcomes:shuffledCopy([Math.random()<.5?'end':'malus','jackpot','small','malus'])}; state.rouletteCount++; state.lastRouletteSeason=n; state.pendingChoice='roulette'; return; }
  // Les dilemmes et les événements de vie se jouent désormais pendant la saison,
  // une fois par phase, amenés par une situation. L'intersaison garde le destin et les offres.
  coachOpenOffers();
}
function coachChooseRoulette(i){
  const r=state.currentRoulette, ev=r.event, out=r.outcomes[i];
  const before=coachSnapshot(); let effects, narrative, echo=null;
  if(out==='end'){
    const fate=ev.fate||{kind:'death'};
    log(`${ev.icon} ${ev.title} → ${ev.choices[i]}. ☠️ ${ev.endText}`);
    state.currentRoulette=null;
    // Deux destins ferment la carrière, deux la poursuivent sous contrainte : la roulette a une suite.
    if(fate.kind==='death'||fate.kind==='banned'){ unlockTrophy('r-death'); coachEnd(`${ev.icon} ${ev.endText}`,'roulette'); render(); return; }
    unlockTrophy('r-fate');
    state.rouletteFate={kind:fate.kind,icon:fate.icon,label:fate.label,text:fate.text,club:state.club?state.club.name:null,year:state.year};
    // L'émir rachète ton contrat et t'installe dans son projet : le club arrive à l'écran des offres
    if(fate.kind==='exclusive'){ effects={reputation:6,reseau:-12,pressure:10}; if(state.club) state.club.sacked=true; }
    else { effects={reputation:-16,reseau:-10,pressure:8,supporters:-10,confidence:-10}; state.cote=clamp(state.cote-18); state.coteDelta=-18;
      // Banni de l'élite : un club de haut de tableau ne peut pas te garder
      if(state.club&&!state.club.sacked&&!['amateur','ligue2'].includes(state.club.tier)){ log(`🕳️ ${state.club.name} ne peut pas garder un·e entraîneur·euse au cœur d'un scandale : le contrat est rompu.`); state.club.sacked=true; state.sackings++; } }
    narrative=fate.text;
    const extraFate=coachApplyEffects(effects);
    state.pendingResult={title:`${fate.icon} ${fate.label}`,subtitle:ev.title,narrative,before,after:coachSnapshot(),extra:extraFate,next:'offers'};
    state.pendingChoice='choiceResult'; render(); return;
  }
  if(out==='jackpot'){ effects={talent:10,technique:10,reseau:12,reputation:12,pressure:-25,vestiaire:15,supporters:15,formation:10,staff:10,confidence:25,budget:.8}; narrative=ev.jackpotText; echo={icon:'✨',label:"Année de grâce",short:"tout tourne en ta faveur",delta:2.5,seasons:2}; unlockTrophy('r-jackpot'); }
  else if(out==='malus'){ effects={talent:-4,reseau:-5,reputation:-6,pressure:12,vestiaire:-8,supporters:-6,confidence:-15,budget:-.2}; narrative="Un revers sérieux sans détruire ta carrière : ta réputation, ton vestiaire et la patience du président encaissent le choc."; echo={icon:'🌧️',label:"L'affaire te suit",short:"le doute pèse sur le groupe",delta:-2,seasons:2}; unlockTrophy('r-malus'); }
  else { effects={talent:3,technique:3,reputation:3,pressure:-5,vestiaire:4,confidence:5}; narrative="Une seule porte s'entrouvre modestement : un peu d'élan pour la suite."; echo={icon:'🍀',label:"Un peu d'élan",short:"le vent tourne légèrement",delta:1,seasons:1}; unlockTrophy('r-small'); }
  const extra=coachApplyEffects(effects); log(`${ev.icon} <b>${ev.title}</b> → ${ev.choices[i]}. ${narrative}`);
  if(echo){ state.rouletteEcho=echo; log(`${echo.icon} ${echo.label} : ${echo.short}, pour ${echo.seasons} saison${echo.seasons>1?'s':''}.`); }
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
  // Reprendre par la phase sauterait le mercato d'hiver : on repasse par le bilan de phase.
  const next=inSeason?(state.pendingChoice==='pressureCrisis'&&state.phase===2&&eraHasWinterMercato(state.year)?'afterPhase':'phase'):'offers';
  state.pendingResult={title:'🌡️ Crise de pression',subtitle:ch.label,narrative:ch.sub,before,after:coachSnapshot(),extra:[],next}; state.pendingChoice='choiceResult'; render();
}
/* ---------- Fin ---------- */
function coachCheckEnd(){
  if(state.ended) return true;
  const f=state.rouletteFate;
  if(f&&f.kind==='exclusive'&&f.installed&&(!state.club||state.club.sacked)){ coachEnd(`${f.icon} Le club auquel la clause te liait te retire le banc. Lié à vie et sans équipe, tu n'entraîneras plus jamais.`,'roulette'); return true; }
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
