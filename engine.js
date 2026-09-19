/* ============================== ABSOLUT COACH — MOTEUR ==============================
   État de carrière, génération des projets, jauges du club, résolution d'une saison,
   pression, enveloppe de secours, conditions de fin et badges persistants. */

let state = null;

/* ---------- Utilitaires ---------- */
function clamp(v,min=0,max=100){ return Math.max(min,Math.min(max,v)); }
function rand(min,max){ return Math.random()*(max-min)+min; }
function randInt(min,max){ return Math.floor(rand(min,max+1)); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function shuffledCopy(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const _noRepeatBags={};
function pickNoRepeat(key,arr){
  if(!_noRepeatBags[key]||!_noRepeatBags[key].length) _noRepeatBags[key]=shuffledCopy(arr.map((_,i)=>i));
  return arr[_noRepeatBags[key].pop()];
}
function euros(v){ if(Math.abs(v)>=1000) return (v/1000).toFixed(2)+" Md€"; if(Math.abs(v)<1) return Math.round(v*1000)+" k€"; return v.toFixed(1)+" M€"; }
function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function capitalize(s){ return s?s.charAt(0).toUpperCase()+s.slice(1):s; }
function log(msg){ if(state) state.log.unshift({age:state.age,msg}); }
function snapshot(s){ return {talent:s.talent,technique:s.technique,reseau:s.reseau,repCritique:s.repCritique,repPublic:s.repPublic,moral:s.moral,argent:s.argent}; }
function clampAll(s){ s.talent=clamp(s.talent); s.technique=clamp(s.technique); s.reseau=clamp(s.reseau); s.repCritique=clamp(s.repCritique); s.repPublic=clamp(s.repPublic); s.moral=clamp(s.moral!==undefined?s.moral:65); s.scandalRisk=clamp(s.scandalRisk||0); }
function starRating(v){ const n=clamp(Math.round(v/20),0,5); return '★'.repeat(n)+'☆'.repeat(5-n); }

/* ---------- Persistance locale ---------- */
const SAVE_KEY='ac-save', TROPHY_KEY='ac-trophies', HALL_KEY='ac-hall', PLAYER_SAVE_KEY='ac-player-save';
function lsGet(key,fallback){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; }catch(e){ return fallback; } }
function lsSet(key,value){ try{ localStorage.setItem(key,JSON.stringify(value)); }catch(e){} }
function saveGame(){ if(!state) return; lsSet(SAVE_KEY,state); }
function loadGame(){ const s=lsGet(SAVE_KEY,null); if(s&&!s.ended){ state=s; return true; } return false; }
function clearSave(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} }
let unlockedTrophies=new Set(lsGet(TROPHY_KEY,[]));
function unlockTrophy(id){
  if(!TROPHY_MAP[id]||unlockedTrophies.has(id)) return false;
  unlockedTrophies.add(id); lsSet(TROPHY_KEY,[...unlockedTrophies]);
  if(state&&state.newlyUnlockedTrophies) state.newlyUnlockedTrophies.push(id);
  return true;
}
function hallOfFame(){ return lsGet(HALL_KEY,[]); }
function saveToHallOfFame(entry){ const h=hallOfFame(); h.unshift(entry); lsSet(HALL_KEY,h.slice(0,30)); }

/* ---------- Badges ---------- */
const TROPHIES=[
  { id:'mode-finish-classic', cat:'Campagnes', icon:'⚽', label:"Carrière classique terminée" },
  { id:'mode-finish-auteur', cat:'Campagnes', icon:'🌱', label:"Bâtisseur·euse jusqu'au bout" },
  { id:'mode-finish-studio', cat:'Campagnes', icon:'🏟️', label:"Machine à trophées terminée" },
  { id:'mode-finish-chaos', cat:'Campagnes', icon:'🎲', label:"Survivant·e du football chaos" },
  { id:'mode-finish-iron', cat:'Campagnes', icon:'💀', label:"Dernier contrat honoré" },
  { id:'first-season', cat:'Carrière', icon:'🎬', label:"Première saison bouclée" },
  { id:'ten-seasons', cat:'Carrière', icon:'🔟', label:"Dix saisons sur un banc" },
  { id:'twenty-seasons', cat:'Carrière', icon:'🏛️', label:"Vingt saisons : une institution" },
  { id:'retire-old', cat:'Carrière', icon:'👴', label:"Jusqu'à 75 ans" },
  { id:'fun-carriere-courte', cat:'Carrière', icon:'🚪', label:"Carrière sans aucune saison" },
  { id:'rich', cat:'Carrière', icon:'💰', label:"Capital de 100 M€" },
  { id:'loyal-club', cat:'Carrière', icon:'🏠', label:"Cinq saisons dans le même club" },
  { id:'nomad', cat:'Carrière', icon:'🧳', label:"Dix clubs différents" },
  { id:'international', cat:'Carrière', icon:'🌍', label:"Première aventure à l'étranger" },
  { id:'superclub', cat:'Carrière', icon:'👑', label:"Diriger un super-club" },
  { id:'title-amateur', cat:'Trophées', icon:'⬆️', label:"Montée avec un club amateur" },
  { id:'title-national', cat:'Trophées', icon:'🥈', label:"Champion de Ligue 2 / National" },
  { id:'title-ligue1', cat:'Trophées', icon:'🏆', label:"Champion de France" },
  { id:'title-etranger', cat:'Trophées', icon:'🌎', label:"Champion à l'étranger" },
  { id:'title-europe', cat:'Trophées', icon:'🏆', label:"Champion d'un grand championnat européen" },
  { id:'title-superclub', cat:'Trophées', icon:'👑', label:"Champion avec un super-club" },
  { id:'cup', cat:'Trophées', icon:'🥇', label:"Vainqueur d'une coupe nationale" },
  { id:'euro1', cat:'Trophées', icon:'⭐', label:"Vainqueur de la Coupe d'Europe des clubs" },
  { id:'euro2', cat:'Trophées', icon:'🌍', label:"Vainqueur de la Coupe Continentale" },
  { id:'treble', cat:'Trophées', icon:'👑', label:"Triplé historique" },
  { id:'double', cat:'Trophées', icon:'✌️', label:"Doublé championnat-coupe" },
  { id:'award-coach-year', cat:'Récompenses', icon:'🎖️', label:"Entraîneur·euse de l'année" },
  { id:'award-banc-or', cat:'Récompenses', icon:'🪑', label:"Banc d'or" },
  { id:'award-sifflet-or', cat:'Récompenses', icon:'🥇', label:"Sifflet d'or mondial" },
  { id:'award-tactique', cat:'Récompenses', icon:'🧠', label:"Prix de la tactique" },
  { id:'hit-streak-3', cat:'Saisons', icon:'🔥', label:"Trois saisons réussies d'affilée" },
  { id:'double-flop', cat:'Saisons', icon:'🥶', label:"Saison rejetée par la presse et le public" },
  { id:'relegation', cat:'Saisons', icon:'⬇️', label:"Relégation vécue" },
  { id:'louche-survivor', cat:'Saisons', icon:'🕳️', label:"Survivre à un projet louche" },
  { id:'louche-title', cat:'Saisons', icon:'🎪', label:"Faire monter un club en perdition" },
  { id:'unexpected-flop', cat:'Saisons', icon:'🌩️', label:"Coup de tabac imprévisible" },
  { id:'financial-disaster', cat:'Saisons', icon:'📉', label:"Catastrophe financière malgré une bonne saison" },
  { id:'jackpot-season', cat:'Saisons', icon:'🌠', label:"Jackpot d'une saison à haut risque" },
  { id:'aborted', cat:'Saisons', icon:'🪓', label:"Licencié·e en cours de saison" },
  { id:'delayed', cat:'Saisons', icon:'🐌', label:"Saison qui s'enlise" },
  { id:'objective-5', cat:'Saisons', icon:'🎯', label:"Cinq objectifs de direction atteints" },
  { id:'interim-saved', cat:'Saisons', icon:'🚒', label:"Pompier de service : maintien assuré" },
  { id:'base-system-100-ethics', cat:'Jauges', icon:'⚖️', label:"Autorité morale" },
  { id:'base-system-100-eco', cat:'Jauges', icon:'🌿', label:"Club régénératif" },
  { id:'base-system-100-union', cat:'Jauges', icon:'✊', label:"Vestiaire modèle" },
  { id:'base-system-100-relation', cat:'Jauges', icon:'❤️', label:"Staff indéfectible" },
  { id:'base-system-100-continuity', cat:'Jauges', icon:'🌌', label:"Architecte de projet" },
  { id:'base-system-100-archive', cat:'Jauges', icon:'🎓', label:"École reconnue" },
  { id:'base-crew-departure', cat:'Jauges', icon:'🚪', label:"Un membre du staff claque la porte" },
  { id:'base-crew-retirement', cat:'Jauges', icon:'🎞️', label:"Un membre du staff prend sa retraite" },
  { id:'base-crew-family', cat:'Jauges', icon:'👨‍👩‍👧', label:"Un staff soudé comme une famille" },
  { id:'eco-fine-paid', cat:'Jauges', icon:'💸', label:"Amende écologique payée" },
  { id:'eco-fine-refused', cat:'Jauges', icon:'🙈', label:"Amende écologique refusée" },
  { id:'eco-arrest', cat:'Jauges', icon:'🚔', label:"Arrêté·e pour crimes contre la planète" },
  { id:'recovery-done', cat:'Jauges', icon:'🛠️', label:"Plan de redressement mené" },
  { id:'pressure-crisis', cat:'Pression', icon:'🌡️', label:"Crise de pression traversée" },
  { id:'pressure-pause', cat:'Pression', icon:'🏖️', label:"Trois ans loin des terrains" },
  { id:'pressure-push-survived', cat:'Pression', icon:'🫀', label:"Continuer coûte que coûte… et survivre" },
  { id:'pressure-death', cat:'Pression', icon:'⚰️', label:"Mort sur le banc" },
  { id:'roulette-survivor', cat:'Roulette', icon:'🍀', label:"Petit bonus de la roulette" },
  { id:'roulette-malus', cat:'Roulette', icon:'🌧️', label:"Malus de la roulette" },
  { id:'roulette-jackpot', cat:'Roulette', icon:'🌠', label:"Jackpot de la roulette" },
  { id:'roulette-death', cat:'Roulette', icon:'☠️', label:"Fin brutale à la roulette" },
  { id:'emergency-loan-taken', cat:'Finances', icon:'🏦', label:"Enveloppe de secours acceptée" },
  { id:'emergency-loan-repaid', cat:'Finances', icon:'✅', label:"Enveloppe de secours remboursée" },
  { id:'emergency-loan-judicial', cat:'Finances', icon:'⚖️', label:"Radiation pour dettes" },
  { id:'bankruptcy', cat:'Finances', icon:'🪙', label:"Plus personne ne te confie un budget" },
  { id:'end-flops', cat:'Fins', icon:'📉', label:"Viré·e pour série d'échecs" },
  { id:'end-collapse', cat:'Fins', icon:'🏚️', label:"Effondrement structurel" },
  { id:'end-no-offers', cat:'Fins', icon:'📵', label:"Le téléphone ne sonne plus" },
  { id:'strategy-all', cat:'Carrière', icon:'🧭', label:"Quatre stratégies de carrière différentes" },
  { id:'mastery-5', cat:'Carrière', icon:'🎯', label:"Cinq saisons dans le même style de jeu" },
  { id:'player-first-season', cat:'Joueur·euse', icon:'👟', label:"Première saison pro" },
  { id:'player-ballon', cat:'Joueur·euse', icon:'🏅', label:"Ballon de platine" },
  { id:'player-100-goals', cat:'Joueur·euse', icon:'💯', label:"Cent buts en carrière" },
  { id:'player-selection', cat:'Joueur·euse', icon:'🇫🇷', label:"Première sélection" },
  { id:'player-retire', cat:'Joueur·euse', icon:'🎗️', label:"Carrière de joueur·euse terminée" },
  { id:'player-injury', cat:'Joueur·euse', icon:'🩼', label:"Blessure qui met fin à une carrière" },
  { id:'player-legend', cat:'Joueur·euse', icon:'🗿', label:"Légende du club : huit saisons au même endroit" },
  { id:'player-superclub', cat:'Joueur·euse', icon:'👑', label:"Signer dans un super-club" },
  { id:'player-title', cat:'Joueur·euse', icon:'🏆', label:"Champion·ne en tant que joueur·euse" },
];
const TROPHY_MAP=Object.fromEntries(TROPHIES.map(t=>[t.id,t]));

/* ---------- État initial ---------- */
const STARTING_CAPITAL=.3;
function freshState(profile,name){
  const mode=profile.mode||CAREER_MODES[0];
  const modeRules={...CAREER_MODES[0].rules,...(mode.rules||{})};
  const startCapital=clamp((STARTING_CAPITAL+(profile.origine.capitalMod||0))*modeRules.capitalMult,.04,8);
  return {
    kind:'coach', name:name||"Anonyme",
    origineName:profile.origine.name, origineId:profile.origine.id, fateBias:profile.origine.fateBias||0,
    nationality:profile.nationality, favoriteStyleId:profile.favoriteStyle.id,
    mentorName:profile.mentor.name, mentorId:profile.mentor.id, mentorStyleAuteur:profile.mentor.styleAuteur,
    careerModeId:mode.id, careerModeName:mode.name, careerModeIcon:mode.icon, modeRules,
    qualiteName:profile.qualite.name, defautName:profile.defaut.name, qualiteId:profile.qualite.id, defautId:profile.defaut.id,
    personalRiskMod:(profile.defaut.riskBoost||0)-(profile.qualite.riskReduction||0)-(profile.origine.riskReduction||0),
    appealBoost:(profile.qualite.appealBoost||0), prestigeBoost:(profile.qualite.prestigeBoost||0),
    age:30, stats:{...profile.stats, argent:startCapital, scandalRisk:(profile.defaut.scandalStart||0)+(profile.origine.scandalStart||0)},
    traits:[profile.qualite.name,profile.defaut.name],
    seasons:[], usedTitles:[], clubsCoached:[], currentClub:null, seasonsAtClub:0,
    titles:{champion:0,cup:0,euro1:0,euro2:0,promo:0}, awardsWon:0, objectivesMet:0,
    log:[], consecutiveFlops:0, consecutiveHits:0, consecutiveNoOffers:0, internationalUnlocked:false,
    careerSystems:{ethics:55,eco:15,union:42,relation:52,continuity:0,archive:0}, careerSystemMilestones:{}, systemPerks:{},
    careerCrew:[
      {name:"Camille Dorsay",job:"Adjoint·e",age:34,skill:48,loyalty:58},
      {name:"Nora Benali",job:"Préparation physique",age:41,skill:52,loyalty:56},
      {name:"Léo Varga",job:"Analyse vidéo",age:29,skill:44,loyalty:61},
    ],
    lastCrewTickAge:30, baseIssuesSeen:[], nextSeasonSystemQuality:0,
    rescueOfferGivenForStreak:false,
    ended:false, endingText:"", endingCause:null, endingAutomatic:false,
    pendingChoice:null, pendingResult:null, currentOffers:[], currentProduction:null, currentEvent:null, currentRoulette:null, currentEcoFine:null, lastSeasonResult:null,
    lastRecoverySeason:-99, recoveryCount:0, lastRouletteSeason:-99, rouletteCount:0,
    lastEcoFineSeason:-99, ecoFineRefusals:0, ecoArrestRisk:0,
    criticalStructuralYears:0, lastStructuralRisk:0,
    emergencyLoan:null, emergencyLoanDraft:null, emergencyLoanUsed:false,
    pressure:({classic:5,auteur:8,studio:20,chaos:12,iron:18}[mode.id]||5), pressureCrisisCooldown:0, delegatedNextSeasonPenalty:0, lastPressureFatalityCheckKey:null,
    activeStrategy:null, strategiesUsed:[], lastStrategySeason:-1,
    abortedSeasons:0, delayedSeasons:0, newlyUnlockedTrophies:[], seasonCounter:0,
  };
}

/* ---------- Effets génériques ---------- */
const STAT_KEYS=['talent','technique','reseau','repCritique','repPublic','moral'];
function applyGenericEffects(effects,ctx={}){
  if(!effects||!state) return;
  const systems=ensureBaseCareerSystems();
  Object.entries(effects).forEach(([k,v])=>{
    if(STAT_KEYS.includes(k)) state.stats[k]=(state.stats[k]||0)+v;
    else if(k==='money'){ const base=ctx.moneyBase!=null?ctx.moneyBase:Math.max(.5,state.stats.argent||0); state.stats.argent=(state.stats.argent||0)+(ctx.absoluteMoney?v:v*base); }
    else if(k==='pressure') state.pressure=clamp((state.pressure||0)+v,0,100);
    else if(k==='scandal'||k==='scandalRisk') state.stats.scandalRisk=clamp((state.stats.scandalRisk||0)+v,0,100);
    else if(CAREER_SYSTEM_KEYS.includes(k)) systems[k]=clamp((systems[k]||0)+v,0,100);
    else if(k==='crewLoyalty') (state.careerCrew||[]).forEach(m=>m.loyalty=clamp(m.loyalty+v,0,100));
    else if(k==='nextQuality') state.nextSeasonSystemQuality=(state.nextSeasonSystemQuality||0)+v;
    else if(k==='quality'&&ctx.production) ctx.production.qualityAccum=(ctx.production.qualityAccum||0)+v;
    else if(k==='critique'&&ctx.production) ctx.production.critiqueAccum=(ctx.production.critiqueAccum||0)+v;
    else if(k==='appeal'&&ctx.production) ctx.production.appealAccum=(ctx.production.appealAccum||0)+v;
    else if(k==='risk'&&ctx.production) ctx.production.riskAccum=(ctx.production.riskAccum||0)+v;
  });
  clampAll(state.stats);
}
function applyBaseCareerIssueEffects(effects){ applyGenericEffects(effects,{}); }

/* ---------- Jauges du club ---------- */
function ensureBaseCareerSystems(){
  state.careerSystems={ethics:55,eco:15,union:42,relation:52,continuity:0,archive:0,...(state.careerSystems||{})};
  state.careerCrew=state.careerCrew||[]; state.careerSystemMilestones=state.careerSystemMilestones||{}; state.systemPerks=state.systemPerks||{}; state.traits=state.traits||[];
  return state.careerSystems;
}
function applyCareerSystemChanges(changes){
  if(!changes||!state) return;
  const systems=ensureBaseCareerSystems();
  Object.entries(changes).forEach(([k,v])=>{ if(Object.prototype.hasOwnProperty.call(systems,k)) systems[k]=clamp((systems[k]||0)+v,0,100); });
}
function applyCareerSystemWearAfterSeason(season){
  const before={...ensureBaseCareerSystems()};
  const longProduction=(season.duration||1)>=3, majorProduction=(season.requiredBudget||season.budget||0)>=10;
  const strained=(state.pressure||0)>=75, critical=(state.pressure||0)>=90;
  const complexContinuity=(season.sagaEpisode||0)>=4;
  const wearMult=(state.modeRules&&state.modeRules.systemWear)||1;
  const requested={ ethics:-(1+(critical?1:0)), eco:-2, union:-(1+(longProduction?1:0)+(strained?1:0)), relation:-(1+(strained?1:0)), continuity:-(1+(complexContinuity?1:0)), archive:-(1+(majorProduction?1:0)) };
  Object.keys(requested).forEach(k=>requested[k]=Math.round(requested[k]*wearMult*10)/10);
  applyCareerSystemChanges(requested);
  const after=ensureBaseCareerSystems(), actual={};
  CAREER_SYSTEM_KEYS.forEach(k=>actual[k]=Math.round(((after[k]||0)-(before[k]||0))*10)/10);
  season.systemWear=actual;
  return actual;
}
function checkBaseSystemMilestones(){
  const systems=ensureBaseCareerSystems(), earned=[];
  Object.entries(BASE_SYSTEM_MILESTONES).forEach(([key,m])=>{
    if((systems[key]||0)<100||state.careerSystemMilestones[key]) return;
    state.careerSystemMilestones[key]=true; state.systemPerks[key]=true;
    applyBaseCareerIssueEffects(m.effects);
    if(!state.traits.includes(m.name)) state.traits.push(m.name);
    unlockTrophy(`base-system-100-${key}`);
    log(`${m.icon} <b>${m.name}</b> : la jauge ${BASE_SYSTEM_DEFINITIONS.find(d=>d.key===key).label} atteint 100 et transforme durablement ta carrière.`);
    earned.push({key,...m});
  });
  return earned;
}
function tickBaseCareerSystems(){
  const systems=ensureBaseCareerSystems(), elapsed=Math.max(0,state.age-(state.lastCrewTickAge==null?state.age:state.lastCrewTickAge));
  if(!elapsed) return;
  state.lastCrewTickAge=state.age;
  state.careerCrew.forEach(m=>{ m.age+=elapsed; m.skill=clamp(m.skill+Math.min(2.2,elapsed*.55),0,100); m.loyalty=clamp(m.loyalty+(systems.union-45)*.045*elapsed+(systems.relation-50)*.035*elapsed-((state.pressure||0)>=75?2.5*elapsed:0),0,100); });
  let leaving=state.careerCrew.find(m=>m.loyalty<18); if(!leaving) leaving=state.careerCrew.find(m=>m.age>=68);
  if(leaving){
    const retired=leaving.age>=68;
    state.careerCrew=state.careerCrew.filter(m=>m!==leaving);
    state.careerCrew.push({name:pick(["Lou Amar","Maya Stern","Tao Belloc","Charlie Novak","Inès Pavel","Sacha Le Roux"]),job:leaving.job,age:randInt(26,38),skill:randInt(34,43),loyalty:52});
    state.stats.technique-=2; state.stats.reseau-=retired?0:2; state.pressure=clamp((state.pressure||0)+(retired?2:7));
    unlockTrophy(retired?'base-crew-retirement':'base-crew-departure');
    log(retired?`🎞️ ${leaving.name} prend sa retraite. Une nouvelle personne reprend le poste ${leaving.job}.`:`🚪 ${leaving.name} quitte ton staff après une longue dégradation de la confiance.`);
  }
  if(systems.ethics<25){ state.stats.scandalRisk=(state.stats.scandalRisk||0)+4; state.stats.moral-=2; }
  if(systems.union<20){ state.stats.moral-=3; state.pressure=clamp((state.pressure||0)+4); }
  clampAll(state.stats);
  const avgLoyalty=state.careerCrew.length?state.careerCrew.reduce((n,m)=>n+m.loyalty,0)/state.careerCrew.length:50;
  if(avgLoyalty>=80) unlockTrophy('base-crew-family');
}
function careerSystemMood(v){ return v>=70?'good':v>=35?'mid':'low'; }
function careerSystemEffectLabel(key,value){
  if(state&&state.systemPerks&&state.systemPerks[key]) return `${BASE_SYSTEM_MILESTONES[key].name} · effet permanent actif`;
  const high=value>=65, low=value<30;
  return {
    ethics:high?'confiance renforcée, conflits contenus':low?'risque élevé de licenciement conflictuel':'risque humain sous surveillance',
    eco:high?'saisons moins chères et moins tendues':low?'surcoûts logistiques importants':'transition encore incomplète',
    union:high?'groupe stable, grèves contenues':low?'risque élevé de rupture du groupe':'vestiaire encore fragile',
    relation:high?'coordination fluide, saison maîtrisée':low?'risque élevé de saison qui s\'enlise':'confiance de la direction à entretenir',
    continuity:high?'public fidèle, recettes renforcées':low?'public peu fidélisé, recettes fragiles':'identité de jeu en construction',
    archive:high?'recrutement moins cher, jeunes bien lancés':low?'formation rare, recrutement panique':'centre encore incomplet',
  }[key];
}
// Modificateurs de saison issus des jauges (valeurs volontairement modestes : les choix dominent)
function careerSystemSeasonModifiers(offer){
  const s=ensureBaseCareerSystems();
  const formationStyle=offer.style&&offer.style.id==='formation';
  const sameClub=(offer.sagaEpisode||0)>=2;
  const quality=(s.union-50)*.06+(s.relation-50)*.04+(s.archive-40)*.03*(formationStyle?2:1)+(s.ethics<30?-2:0);
  const critique=(s.ethics-50)*.04+(s.archive-40)*.03;
  const appeal=s.continuity*.0006*(sameClub?2:1)+(s.ethics-50)*.0004;
  return {quality,critique,appeal};
}

/* ---------- Surcoût structurel des offres ---------- */
const CAREER_OFFER_COST_VERSION=1;
function ensureCareerOfferCostProfile(offer){
  if(!offer) return {base:0,required:0,adjustment:0,rate:0,items:[]};
  if(offer.systemCostProfile&&offer.systemCostProfile.version===CAREER_OFFER_COST_VERSION) return offer.systemCostProfile;
  const base=Math.max(.005,offer.baseBudget!=null?offer.baseBudget:offer.budget), items=[];
  offer.baseBudget=base;
  const s=ensureBaseCareerSystems(), perks=state.systemPerks||{};
  const add=(key,label,rate)=>{ if(Math.abs(rate)>=.005) items.push({key,label,rate}); };
  add('eco','logistique et déplacements',clamp((50-s.eco)*.006,-.2,.28));
  add('union','conditions du vestiaire',clamp((50-s.union)*.0025,-.1,.12));
  add('relation','coordination direction-staff',clamp((50-s.relation)*.002,-.08,.1));
  add('ethics','assurances et conformité',clamp((45-s.ethics)*.0018-(perks.ethics?.015:0),-.045,.08));
  const recurring=!!offer.sagaEpisode;
  add('continuity','réécriture du projet de jeu',recurring?clamp((45-s.continuity)*.0022,-.1,.1):0);
  const researched=offer.style&&['formation','positionnel','total'].includes(offer.style.id);
  add('archive','scouting et formation',researched?clamp((40-s.archive)*.002,-.08,.08):0);
  if(perks.eco) add('eco','méthodes régénératives',-.04);
  if(perks.union) add('union','vestiaire modèle',-.03);
  if(perks.relation) add('relation','staff permanent',-.025);
  const completed=(state.seasons||[]).length, careerScale=completed<2?0:1;
  const relevantKeys=['eco','union','relation','ethics',...(recurring?['continuity']:[]),...(researched?['archive']:[])];
  const gaugeDeficit=relevantKeys.reduce((n,k)=>n+clamp((50-(s[k]||0))/50,0,1),0)/relevantKeys.length;
  const gaugeStrength=relevantKeys.reduce((n,k)=>n+clamp(((s[k]||0)-50)/50,0,1),0)/relevantKeys.length;
  const structuralRate=items.reduce((n,i)=>n+i.rate,0);
  const randomRoll=careerScale?Math.random():0;
  const campaignBias=(state.modeRules&&state.modeRules.costBias)||0;
  const costPressure=clamp(randomRoll*.45+gaugeDeficit*.65-gaugeStrength*.25+clamp(structuralRate,-.25,.45)*.35+campaignBias,0,1);
  const rate=careerScale?clamp(.05+.65*costPressure,.05,.7):0, adjustment=base*rate, required=Math.max(.005,base+adjustment);
  offer.systemCostProfile={version:CAREER_OFFER_COST_VERSION,base,required,adjustment,rate,items,careerScale};
  return offer.systemCostProfile;
}
function productionBudgetRequired(offer){ return ensureCareerOfferCostProfile(offer).required; }
function canAffordCareerOffer(offer){
  if(!offer||!state) return true;
  if(offer.interimBacked) return true;
  return productionBudgetRequired(offer)<=state.stats.argent+.0005;
}

/* ---------- Risque structurel ---------- */
function careerStructuralRisk(){
  if(!state) return {score:0,level:'stable',label:'Structure stable',tone:'good',domains:[],pips:1};
  const s=state.stats||{}, systems=ensureBaseCareerSystems(), n=(state.seasons||[]).length;
  const maturity=clamp(.2+n*.1,.2,1);
  const pressurePart=Math.max(0,(state.pressure||0)-42)*.62;
  const teamAverage=((systems.eco||0)+(systems.union||0)+(systems.relation||0))/3;
  const teamPart=Math.max(0,46-teamAverage)*.58*maturity;
  const trustPart=(Math.max(0,38-(systems.ethics||0))*.42+(s.scandalRisk||0)*.18)*maturity;
  const neededCash=.08+Math.min(1.2,n*.055);
  const cashRatio=neededCash>0?Math.max(0,s.argent||0)/neededCash:1;
  const financePart=cashRatio<1?(1-cashRatio)*26:0;
  const memoryAverage=((systems.continuity||0)+(systems.archive||0))/2;
  const craftPart=n>=5?Math.max(0,32-memoryAverage)*.22:0;
  const flopPart=Math.min(21,(state.consecutiveFlops||0)*7);
  const parts=[{label:'fatigue',value:pressurePart},{label:'vestiaire et staff',value:teamPart},{label:'confiance',value:trustPart},{label:'capital',value:financePart},{label:'projet et formation',value:craftPart},{label:'série d\'échecs',value:flopPart}].sort((a,b)=>b.value-a.value);
  const score=clamp(parts.reduce((x,p)=>x+p.value,0),0,100);
  const domains=parts.filter(p=>p.value>=4).slice(0,2).map(p=>p.label);
  if(score>=70) return {score,level:'critical',label:'Rupture imminente',tone:'bad',domains,pips:4};
  if(score>=52) return {score,level:'danger',label:'Structure sous tension',tone:'bad',domains,pips:3};
  if(score>=30) return {score,level:'watch',label:'Équilibre fragile',tone:'mid',domains,pips:2};
  return {score,level:'stable',label:'Structure stable',tone:'good',domains,pips:1};
}

/* ---------- Génération des offres ---------- */
function generateClubName(tierId,league){
  let city;
  if(tierId==='superclub') city=pick(SUPER_CITIES);
  else if(tierId==='europe') city=pick(EURO_CITIES);
  else if(tierId==='etranger'&&league) city=pick(league.cities);
  else city=pick(FRENCH_CITIES);
  const prefix=pick(CLUB_PREFIXES), suffix=pick(CLUB_SUFFIXES);
  if(['Olympique','Stade','Racing','Étoile','Union','Espérance','Avenir','Jeunesse'].includes(prefix)) return `${prefix} ${prefix==='Stade'||prefix==='Racing'?'':'de '}${city}${suffix?' '+suffix:''}`.replace(/\s+/g,' ');
  return `${prefix} ${city}${suffix?' '+suffix:''}`;
}
function availableTiers(){
  const list=TIER_ORDER.filter(t=>TIERS[t].req(state.stats,state.seasons.length)&&TIERS[t].min<=state.stats.argent*.95);
  return list.length?list:['amateur','louche'];
}
function durationYears(tierId,budget){
  if(tierId==='louche'||tierId==='interim') return 1;
  if(tierId==='amateur') return clamp(Math.round(1.2+rand(-.4,.7)),1,2);
  const base=tierId==='national'?1.4:tierId==='etranger'?1.6:tierId==='ligue1'?1.8:tierId==='europe'?2.1:2.4;
  return clamp(Math.round(base+Math.log10(Math.max(.5,budget||5)+1)*.5+rand(-.5,.6)),1,3);
}
function careerMomentum(){
  const bankable=state.stats.repCritique+state.stats.repPublic;
  let m=(bankable-100)/100; m+=(state.consecutiveHits||0)*.12; m-=(state.consecutiveFlops||0)*.15;
  return clamp(m,-1.5,1.5);
}
function loucheChance(){
  const bankable=state.stats.repCritique+state.stats.repPublic, flops=state.consecutiveFlops||0;
  if(bankable>=130&&flops<2) return 0;
  let chance=clamp(.18-careerMomentum()*.14,.01,.45);
  const n=state.seasons.length;
  if(n===0) chance=Math.min(chance,.08); else if(n===1) chance=Math.min(chance,.12);
  return chance;
}
function styleExperienceCount(styleId){ return (state.seasons||[]).filter(f=>f.styleId===styleId&&!f.aborted).length; }
function styleMasteryBonus(styleId){ const c=styleExperienceCount(styleId); return {quality:Math.min(c*1.2,6),appeal:Math.min(c*.012,.05)}; }
function offerHint(offer,tierId){
  if(tierId==='louche') return {label:"⚠️ Projet douteux",cls:'bad'};
  if(offer.interimBacked) return {label:"🚒 Le club paie tout : aucun capital engagé",cls:'good'};
  if(offer.sagaEpisode) return {label:`🏠 Rester au club (saison n°${offer.sagaEpisode}) — continuité et fidélité du public`,cls:'good'};
  const m=careerMomentum(), share=offer.budget/Math.max(.05,state.stats.argent);
  if(offer.style.id===state.favoriteStyleId||state.nationality.favoredStyleIds.includes(offer.style.id)) return {label:"❤️ Projet affinitaire — correspond à ton profil",cls:'good'};
  const c=styleExperienceCount(offer.style.id);
  if(c>=5) return {label:`🎯 Style que tu maîtrises parfaitement (${c} saisons)`,cls:'good'};
  if(c>=3) return {label:`🎯 Style où tu es rodé·e (${c} saisons)`,cls:'good'};
  if(c>=1) return {label:`📈 Style familier (${c} saison${c>1?'s':''})`,cls:''};
  if(share>=.85) return {label:"🔥 Projet ambitieux, tu engages presque tout ton capital",cls:'bad'};
  if(offer.budget>=TIERS.superclub.min*.6) return {label:m>.3?"🚀 Gros pari, tu es en position de force":"🎲 Projet risqué, exposition maximale",cls:''};
  if(tierId==='ligue1'||tierId==='europe') return {label:"✅ Projet valeur sûre pour ta carrière",cls:'good'};
  if(tierId==='etranger') return {label:"🌍 Pari à l'étranger, stable mais moins prestigieux",cls:''};
  if(tierId==='national') return {label:m<-.2?"🌱 Petit projet pour rebondir":"⚽ Projet solide",cls:''};
  if(share<=.15) return {label:"🛡️ Projet peu risqué financièrement",cls:'good'};
  return {label:"⚽ Petit budget, peu de risque financier",cls:''};
}
function buildOffer(tierId,budget,styleOverride){
  const tier=TIERS[tierId];
  const league=tierId==='etranger'?pick(LEAGUES):null;
  const style=styleOverride||pick(STYLES);
  const concept=pick(PROJECT_CONCEPTS[tierId]||PROJECT_CONCEPTS.national);
  const club=generateClubName(tierId,league);
  const title=concept.t.replace('{club}',club).replace('{couleurs}',pick(COLOR_PAIRS));
  const synopsis=concept.s.replace(/\{club\}/g,club).replace('{couleurs}',pick(COLOR_PAIRS));
  const teams=tier.teams;
  const objectivePos=clamp(Math.ceil(concept.objective*teams+rand(-1,1)),1,teams-3);
  return { id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`, tierId, tierLabel:tier.label, style, styleId:style.id, budget, league, duration:durationYears(tierId,budget), title, synopsis, club, teams, objectivePos, international:tier.international, isLouche:tierId==='louche', interimBacked:tierId==='interim' };
}
function generateOffers(){
  const tiers=availableTiers(), n=state.seasons.length;
  let count=2+(n>=2?1:0)+(n>=4?1:0)+((state.stats.reseau>45||state.stats.repPublic>50||state.stats.repCritique>50)?1:0);
  count=Math.min(count,4);
  const bankable=state.stats.repPublic+state.stats.repCritique;
  if(state.age>=58&&bankable<55) count=Math.max(0,count-2);
  if(state.age>=68&&bankable<45) count=0;
  const offers=[], usedStyles=new Set(), momentum=careerMomentum();
  // Rester au club : proposé après une saison non ratée dans un vrai club
  const last=state.seasons.length?state.seasons[state.seasons.length-1]:null;
  if(count>0&&last&&!last.aborted&&!last.isFlop&&!last.isLouche&&!last.interim&&state.currentClub&&Math.random()<.55){
    const stayTier=TIERS[last.tierId];
    const budget=clamp(last.budget*rand(.9,1.35),stayTier.min*.5,Math.max(.01,state.stats.argent*.65));
    const o=buildOffer(last.tierId,budget,styleById(last.styleId));
    o.club=state.currentClub; o.title=`Poursuivre l'aventure à ${o.club}`; o.synopsis=`Le président veut continuer avec toi. Les supporters connaissent ton football, le vestiaire ton exigence. Mais à force, tout discours s'use.`;
    o.sagaEpisode=(state.seasonsAtClub||1)+1; o.objectivePos=clamp(Math.round((last.finalPos||o.objectivePos)*.85),1,o.teams-3);
    o.hint=offerHint(o,last.tierId); offers.push(o); usedStyles.add(o.styleId); count--;
  }
  for(let i=0;i<count;i++){
    const pool=[];
    tiers.forEach((t,idx)=>{ let w=tiers.length-idx; if(momentum>.3) w+=idx; if(momentum<-.3) w=Math.max(1,w-idx); for(let k=0;k<w;k++) pool.push(t); });
    const loucheAlready=offers.some(o=>o.isLouche);
    const tierId=(!loucheAlready&&Math.random()<loucheChance())?'louche':pick(pool);
    const tier=TIERS[tierId];
    const budget=clamp(rand(tier.min,tier.max),.01,Math.max(.01,state.stats.argent*.65));
    let style=pick(STYLES), tries=0; while(usedStyles.has(style.id)&&tries<10){ style=pick(STYLES); tries++; }
    usedStyles.add(style.id);
    const o=buildOffer(tierId,budget,style); o.hint=offerHint(o,tierId); offers.push(o);
  }
  // Intérim de sauvetage après deux saisons ratées d'affilée (une seule fois par série)
  if((state.consecutiveFlops||0)>=2&&state.modeRules.rescue&&!state.rescueOfferGivenForStreak){
    state.rescueOfferGivenForStreak=true;
    const o=buildOffer('interim',rand(TIERS.interim.min,TIERS.interim.max)); o.hint=offerHint(o,'interim'); offers.unshift(o);
  }
  if((state.consecutiveFlops||0)<2) state.rescueOfferGivenForStreak=false;
  offers.forEach(ensureCareerOfferCostProfile);
  return offers;
}

/* ---------- Recrutement ---------- */
function playerName(){ return `${pick(PLAYER_FIRST)} ${pick(PLAYER_LAST)}`; }
function accessiblePlayerTier(s){
  const bonus=state.internationalUnlocked?10:0;
  if((s.repPublic+bonus>=78&&s.reseau+bonus>=78)||s.reseau+bonus>=92) return 4;
  if((s.repPublic+bonus>=55&&s.reseau+bonus>=55)||s.reseau+bonus>=72) return 3;
  if(s.repPublic+bonus>=28||s.reseau+bonus>=35) return 2;
  return 1;
}
function generateRecruitOptions(offer){
  const maxTier=accessiblePlayerTier(state.stats);
  const types=RECRUIT_TYPES.filter(t=>t.tiers[0]<=maxTier||t.id==='interne'||t.id==='pari'||t.id==='jeune');
  const chosen=shuffledCopy(types).slice(0,4);
  if(!chosen.some(t=>t.id==='interne')) chosen[chosen.length-1]=RECRUIT_TYPES.find(t=>t.id==='interne');
  const s=ensureBaseCareerSystems();
  return chosen.map(t=>{
    const feeRate=rand(t.feeRate[0],t.feeRate[1])*(t.archive?clamp(1-(s.archive-40)*.006,.6,1.2):1);
    const opt={ typeId:t.id, icon:t.icon, label:t.label, sub:t.sub, feeRate, qualityMod:rand(t.quality[0],t.quality[1]), appealMod:rand(t.appeal[0],t.appeal[1]), riskMod:t.risk||0, union:t.union||0, continuity:t.continuity||0, archive:t.archive?2:0 };
    if(t.id!=='interne'){
      opt.player={ name:playerName(), position:pick(POSITIONS), age:t.id==='jeune'?randInt(17,20):t.id==='pari'?randInt(31,36):randInt(23,30) };
      const st=pick(RECRUIT_STRENGTHS), wk=pick(RECRUIT_WEAKNESSES);
      opt.strength=st[0]; opt.weakness=wk[0];
      if(st[1]==='quality') opt.qualityMod+=1.5; if(st[1]==='appeal') opt.appealMod+=.015; if(st[1]==='union') opt.union+=2; if(st[1]==='archive') opt.archive+=2;
      if(wk[1]==='quality') opt.qualityMod-=1.5; if(wk[1]==='risk') opt.riskMod+=3; if(wk[1]==='union') opt.union-=2; if(wk[1]==='scandal') opt.scandal=3; if(wk[1]==='relation') opt.relation=-2; if(wk[1]==='money') opt.feeRate*=1.25;
      opt.fee=offer.budget*opt.feeRate;
    } else opt.fee=0;
    return opt;
  });
}

/* ---------- Déroulé d'une saison ---------- */
function startProduction(index){
  const offer=state.currentOffers[index];
  if(!offer||!canAffordCareerOffer(offer)) return;
  const required=offer.interimBacked?0:productionBudgetRequired(offer);
  state.stats.argent-=required;
  state.currentProduction={ offer, required, engaged:required, recruit:null, vestiaire:null, tactic:null, staff:null, incident:null, promo:null, qualityAccum:0, critiqueAccum:0, appealAccum:0, riskAccum:0, moneySpent:required };
  state.currentProduction.recruitOptions=generateRecruitOptions(offer);
  state.currentOffers=[];
  state.pendingChoice='recruit';
  log(`📝 Tu signes à <b>${offer.club}</b> (${TIER_SHORT[offer.tierId]}) : « ${offer.title} ». ${offer.interimBacked?'Le club prend tout en charge.':`Tu engages ${euros(required)} de capital.`}`);
  saveGame();
}
function chooseRecruit(i){
  const p=state.currentProduction, opt=p.recruitOptions[i]; if(!opt) return;
  p.recruit=opt; state.stats.argent-=opt.fee; p.moneySpent+=opt.fee;
  applyCareerSystemChanges({union:opt.union||0,continuity:opt.continuity||0,archive:opt.archive||0,relation:opt.relation||0});
  if(opt.scandal) state.stats.scandalRisk=clamp((state.stats.scandalRisk||0)+opt.scandal);
  if(opt.player) log(`🖊️ Recrue phare : <b>${opt.player.name}</b> (${opt.player.position}, ${opt.player.age} ans) — ${opt.label.toLowerCase()}.`);
  else log(`🏠 Aucun recrutement : tu fais confiance au groupe et aux jeunes du centre.`);
  p.vestiaireOptions=shuffledCopy(VESTIAIRE_OPTIONS.filter(o=>o.id!=='neutral')).slice(0,4).concat([VESTIAIRE_OPTIONS.find(o=>o.id==='neutral')]);
  state.pendingChoice='vestiaire'; saveGame();
}
function chooseVestiaire(i){
  const p=state.currentProduction, opt=p.vestiaireOptions[i]; if(!opt) return;
  p.vestiaire=opt;
  applyGenericEffects({union:opt.union||0,relation:opt.relation||0,archive:opt.archive||0,continuity:opt.continuity||0,pressure:opt.pressure||0,scandal:opt.scandal||0,risk:opt.risk||0},{production:p});
  if(opt.moneyMod){ const c=p.offer.budget*opt.moneyMod; state.stats.argent-=c; p.moneySpent+=c; }
  p.tacticOptions=shuffledCopy(TACTIC_OPTIONS).slice(0,5);
  state.pendingChoice='tactic'; saveGame();
}
function chooseTactic(i){
  const p=state.currentProduction, opt=p.tacticOptions[i]; if(!opt) return;
  p.tactic=opt;
  if(opt.archive) applyCareerSystemChanges({archive:opt.archive});
  p.staffOptions=shuffledCopy(STAFF_OPTIONS.filter(o=>o.id!=='neutral')).slice(0,4).concat([STAFF_OPTIONS.find(o=>o.id==='neutral')]);
  state.pendingChoice='staff'; saveGame();
}
function chooseStaff(i){
  const p=state.currentProduction, opt=p.staffOptions[i]; if(!opt) return;
  p.staff=opt;
  const cost=p.offer.budget*(opt.moneyMod||0); state.stats.argent-=cost; p.moneySpent+=cost;
  applyGenericEffects({union:opt.union||0,eco:opt.eco||0,archive:opt.archive||0,continuity:opt.continuity||0,reseau:opt.reseau||0,pressure:opt.pressure||0},{production:p});
  // Incident de saison : fréquence dépendant de la campagne et du risque personnel
  const incidentChance=clamp(.62+(state.modeRules.incident||0)+(state.personalRiskMod||0)*.01,.3,.95);
  if(Math.random()<incidentChance){ p.incident=pickNoRepeat('incidents',SEASON_INCIDENTS); state.pendingChoice='incident'; }
  else { log(`🍀 Une saison sans incident majeur : le calendrier se déroule presque comme prévu.`); p.promoOptions=shuffledCopy(PROMO_OPTIONS).slice(0,4); state.pendingChoice='promo'; }
  saveGame();
}
function chooseIncident(i){
  const p=state.currentProduction, inc=p.incident, choice=inc&&inc.choices[i]; if(!choice) return;
  const before={...snapshot(state.stats),pressure:state.pressure};
  applyGenericEffects(choice.effects,{production:p,moneyBase:p.offer.budget});
  p.incidentChoice=choice; p.incidentBefore=before;
  log(`${inc.icon} <b>${inc.title}</b> → ${choice.label}. ${choice.result}`);
  p.promoOptions=shuffledCopy(PROMO_OPTIONS).slice(0,4);
  state.pendingChoice='promo'; saveGame();
}
function choosePromo(i){
  const p=state.currentProduction, opt=p.promoOptions[i]; if(!opt) return;
  p.promo=opt;
  const cost=p.offer.budget*(opt.moneyMod||0); state.stats.argent-=cost; p.moneySpent+=cost;
  applyGenericEffects({critique:opt.critique||0,appeal:opt.appeal||0,repPublic:opt.repPublic||0,ethics:opt.ethics||0,eco:opt.eco||0,scandal:opt.scandal||0,pressure:opt.pressure||0},{production:p});
  // Aléas de plateau : un seul jet chacun, juste avant la résolution
  const hazard=rollSeasonHazards(p);
  if(hazard==='conflict'){ abortSeason(p); saveGame(); return; }
  if(hazard==='delay'){
    p.delayed=true; state.delayedSeasons++; unlockTrophy('delayed');
    const extra=p.required; state.stats.argent-=extra; p.moneySpent+=extra; p.offer.duration=Math.min(6,p.offer.duration*2);
    log(`🐌 La saison s'enlise à <b>${p.offer.club}</b> : conflits, blessures et calendrier démentiel. Le projet dure deux fois plus longtemps et coûte ${euros(extra)} de plus.`);
  }
  resolveSeason(p);
  saveGame();
}

/* ---------- Résolution ---------- */
function leagueTable(offer,myPos,myPoints){
  const N=offer.teams, rows=[];
  const names=new Set([offer.club]);
  while(rows.length<N-1){ const n=generateClubName(offer.tierId,offer.league); if(!names.has(n)){ names.add(n); rows.push({club:n}); } }
  const matches=(N-1)*2, top=Math.round(matches*2.35), bottom=Math.round(matches*.75);
  const table=[]; let ri=0;
  for(let p=1;p<=N;p++){
    const base=Math.round(top-(top-bottom)*((p-1)/(N-1)));
    if(p===myPos) table.push({pos:p,club:offer.club,pts:myPoints!=null?myPoints:base,me:true});
    else table.push({pos:p,club:rows[ri++].club,pts:base+randInt(-2,2)});
  }
  // cohérence : points strictement décroissants
  for(let i=1;i<table.length;i++) if(table[i].pts>=table[i-1].pts) table[i].pts=table[i-1].pts-1;
  return table;
}
function resolveSeason(production){
  const s=state.stats, {offer,recruit,vestiaire,tactic,staff,promo}=production;
  const tier=TIERS[offer.tierId], style=offer.style, modeRules=state.modeRules, strategy=state.activeStrategy;
  const isLouche=offer.isLouche, isInterim=!!offer.interimBacked;
  const difficultyPenalty=Math.max(0,tier.difficulty-s.technique)*.55;
  let affinityQuality=(modeRules.quality||0), affinityAppeal=(modeRules.appeal||0);
  if(strategy){ affinityQuality+=strategy.quality||0; affinityAppeal+=strategy.appeal||0; if(strategy.favoriteQuality) affinityQuality+=style.id===state.favoriteStyleId?strategy.favoriteQuality:(strategy.otherQuality||0); if(strategy.internationalQuality&&offer.international) affinityQuality+=strategy.internationalQuality; }
  if(style.id===state.favoriteStyleId){ affinityQuality+=5; affinityAppeal+=.06; }
  if(state.nationality.favoredStyleIds.includes(style.id)){ affinityQuality+=3; affinityAppeal+=.04; }
  const mastery=styleMasteryBonus(style.id); affinityQuality+=mastery.quality; affinityAppeal+=mastery.appeal;
  const tacticFit=tactic.fit.includes(style.id); if(tacticFit){ affinityQuality+=4; affinityAppeal+=.03; } else { affinityQuality-=1.5; }
  affinityAppeal+=(state.appealBoost||0)*.004;
  const stakesAmp=(modeRules.variance||1)*(strategy?strategy.variance||1:1);
  const hiddenContext=rand(-9,9)*stakesAmp, hiddenBuzz=rand(-.1,.14)*stakesAmp;
  const pressurePenalty=Math.max(0,(state.pressure||0)-25)*.22;
  const delegationPenalty=state.delegatedNextSeasonPenalty||0; state.delegatedNextSeasonPenalty=0;
  const crew=state.careerCrew||[];
  const crewSkill=crew.length?crew.reduce((n,m)=>n+(m.skill||40),0)/crew.length:50, crewLoyalty=crew.length?crew.reduce((n,m)=>n+(m.loyalty||50),0)/crew.length:50;
  const crewQuality=(crewSkill-50)*.09+(crewLoyalty-50)*.07;
  const systemMods=careerSystemSeasonModifiers(offer);
  const structuralRisk=careerStructuralRisk();
  const structuralQualityPenalty=Math.max(0,structuralRisk.score-32)*.105;
  const systemQuality=state.nextSeasonSystemQuality||0; state.nextSeasonSystemQuality=0;
  const riskTotal=(state.personalRiskMod||0)+(tactic.riskMod||0)+(staff.riskMod||0)+(recruit.riskMod||0)+(production.riskAccum||0);
  const riskPenalty=Math.max(0,riskTotal)*.25*Math.random();
  let qualityRaw=s.talent*.45+s.technique*.3+s.reseau*.06+(s.moral-60)*.12+rand(-13,13)*stakesAmp-difficultyPenalty-pressurePenalty-delegationPenalty-structuralQualityPenalty-riskPenalty+crewQuality+systemQuality+recruit.qualityMod+vestiaire.qualityMod+(staff.qualityMod||0)+affinityQuality+hiddenContext*.4+(production.qualityAccum||0);
  if(isLouche) qualityRaw-=rand(20,32);
  if(isInterim) qualityRaw-=rand(4,10);
  let quality=clamp(qualityRaw+systemMods.quality,0,100);
  // Fidélité au club (saison n°k au même endroit)
  let sagaFatigue=false;
  if(offer.sagaEpisode){
    affinityAppeal+=Math.min(offer.sagaEpisode-1,4)*.025;
    const continuity=state.careerSystems.continuity||0; affinityAppeal+=Math.min(.04,continuity*.0005);
    if(offer.sagaEpisode>=4&&!(state.systemPerks&&state.systemPerks.continuity)&&Math.random()<Math.max(.12,.35-continuity*.0025)){ sagaFatigue=true; affinityAppeal-=rand(.04,.09); quality=clamp(quality-rand(2,6),0,100); }
  }
  const effectivePrestige=clamp(style.prestige+(offer.league?offer.league.prestigeMod:0)+(state.prestigeBoost||0)*.01,0,1.1);
  const critiqueCommon=effectivePrestige*45+tactic.critiqueMod+(vestiaire.critiqueMod||0)+(staff.critiqueMod||0)+(modeRules.critique||0)+(strategy?strategy.critique||0:0)+(production.critiqueAccum||0);
  let critique=clamp(quality*.55+systemMods.critique+critiqueCommon,0,100);
  const effectiveAppeal=style.appeal+(offer.league?offer.league.appealBoost:0)+affinityAppeal;
  const critiqueBoost=(critique-50)/100*.55;
  let successMultiplier=.6+(s.repPublic/550)+rand(-.34,.38)*stakesAmp+recruit.appealMod*.65+tactic.appealMod*.95+(vestiaire.appealMod||0)*.6+(staff.appealMod||0)*.6+hiddenBuzz+critiqueBoost+(production.appealAccum||0)+(quality/100)*(effectiveAppeal+systemMods.appeal)*2.4;
  successMultiplier=Math.max(.05,successMultiplier);
  let publicScore=clamp(50+(recruit.appealMod||0)*72+tactic.appealMod*95+(vestiaire.appealMod||0)*60+hiddenContext*.6+(successMultiplier-1)*42,0,100);
  let unexpectedFlop=false, jackpot=false, financialDisaster=false;
  const flopChance=clamp(.075+Math.max(0,structuralRisk.score-35)*.00125,.055,.28);
  if(Math.random()<flopChance){ unexpectedFlop=true; const sev=rand(.35,.65)+(s.repPublic>=60?rand(.05,.15):0); successMultiplier*=(1-sev); publicScore=clamp(publicScore-rand(18,34),0,100); }
  else if(offer.budget>=state.stats.argent*.5&&offer.budget>=1&&Math.random()<.12){ jackpot=true; successMultiplier*=rand(1.5,2.3); publicScore=clamp(publicScore+rand(12,24),0,100); }
  if(publicScore<30) successMultiplier=Math.min(successMultiplier,.35+(publicScore/30)*.3);
  if(publicScore>=85&&!unexpectedFlop) successMultiplier=Math.max(successMultiplier,1.4+((publicScore-85)/15)*1.4);
  if(!unexpectedFlop&&Math.random()<clamp(.035+Math.max(0,structuralRisk.score-40)*.0011,.018,.1)){ financialDisaster=true; successMultiplier*=rand(.12,.35); }

  // Classement
  const N=offer.teams;
  const perf=quality*.5+publicScore*.25+critique*.25;
  // Le classement se lit par rapport aux attentes du palier : un club amateur moyen finit au milieu,
  // un super-club exige une performance exceptionnelle pour être champion.
  const tierPar={louche:22,amateur:28,interim:36,national:36,ligue1:46,etranger:41,europe:53,superclub:61}[offer.tierId]||40;
  let posFrac=clamp(.5-(perf-tierPar)/40+rand(-.08,.08),0,1);
  const finalPos=clamp(1+Math.round(posFrac*(N-1)),1,N);
  const objectiveMet=finalPos<=offer.objectivePos;
  const relegated=finalPos>N-3&&!isLouche;
  const champion=finalPos===1;
  const promotion=champion&&(offer.tierId==="amateur"||offer.tierId==="louche"||offer.tierId==="national");
  const cupFactor={superclub:.9,europe:.7,ligue1:.5,etranger:.5,national:.25,amateur:.08,louche:.02,interim:.15}[offer.tierId]||.2;
  const cupWon=Math.random()<clamp(.06+(quality-45)/100*.5,.03,.5)*cupFactor;
  let euroWon=null;
  if((offer.tierId==='europe'||offer.tierId==='superclub')&&finalPos<=3){ const c=clamp((quality-58)/100*.9+(offer.tierId==='superclub'?.12:0),0,.5); if(Math.random()<c) euroWon='euro1'; }
  else if(offer.tierId==='etranger'&&finalPos<=2){ if(Math.random()<clamp((quality-55)/100*.6,0,.35)) euroWon='euro2'; }
  // Recette : primes, billetterie, plus-values
  let recette;
  if(isInterim) recette=offer.budget*clamp(successMultiplier,.3,1.3)*.5+(objectiveMet?offer.budget*.15:0);
  // Les recettes sont proportionnelles au projet réellement engagé (surcoûts compris)
  else recette=Math.max(.005,Math.max(offer.budget,production.required)*successMultiplier);
  if(champion) recette+=offer.budget*.3; if(cupWon) recette+=offer.budget*.15; if(euroWon==='euro1') recette+=offer.budget*.6; if(euroWon==='euro2') recette+=offer.budget*.25;
  if(relegated) recette*=.85; if(objectiveMet&&!isInterim) recette+=offer.budget*.15;
  const isDoubleFlop=critique<40&&publicScore<40;
  const isFlop=isDoubleFlop||(relegated&&publicScore<50&&!isLouche);
  const isHit=publicScore>=70||champion||euroWon!=null;
  const profit=recette-production.moneySpent;
  state.stats.argent+=recette;

  // Récompenses individuelles
  const awards=[];
  AWARDS.forEach(a=>{ if(a.intl&&!offer.international) return; if(critique>=a.minCritique&&finalPos<=Math.max(1,Math.round(a.minPos*N))&&Math.random()<a.chance){ awards.push(a); applyBaseCareerIssueEffects(a.rep); unlockTrophy(`award-${a.id}`); state.awardsWon++; } });

  // Évolution des statistiques
  const before={...snapshot(s),pressure:state.pressure};
  s.talent+=clamp((quality-50)*.05+(tacticFit?.8:0),-3,4);
  s.technique+=1+offer.duration*.4+(tier.difficulty>=25?1:0)-(isFlop?1:0);
  s.reseau+=(isHit?3:1)+(offer.international?2:0);
  s.repCritique+=clamp((critique-50)*.16,-9,9);
  s.repPublic+=clamp((publicScore-50)*.16,-9,9)+(champion?3:0)+(relegated?-4:0);
  s.moral+=(isHit?6:isFlop?-9:0)+(objectiveMet?2:-3);
  const pressureDelta=2*offer.duration+(isFlop?7:0)+(isHit?-5:0)+tier.difficulty*.08+(strategy?strategy.pressure||0:0)+(modeRules.pressurePerSeason||0)+(state.careerModeId==='studio'?(publicScore<55?10:publicScore>=75?-5:0):0)+(state.careerModeId==='chaos'?randInt(-8,14):0)+(relegated?6:0);
  state.pressure=clamp((state.pressure||0)+pressureDelta,0,100);
  if(objectiveMet){ applyCareerSystemChanges({relation:3}); state.objectivesMet++; } else applyCareerSystemChanges({relation:-3});
  if(offer.international) state.internationalUnlocked=true;
  clampAll(s);
  state.consecutiveFlops=isFlop?(state.consecutiveFlops||0)+1:0;
  state.consecutiveHits=isHit?(state.consecutiveHits||0)+1:0;
  if(strategy){ strategy.remaining=(strategy.remaining||3)-1; if(strategy.remaining<=0){ log(`🧭 La stratégie « ${strategy.name} » arrive à son terme.`); state.activeStrategy=null; } }

  // Fiche de saison
  const season={ n:state.seasons.length+1, title:offer.title, club:offer.club, tierId:offer.tierId, tierLabel:offer.tierLabel, styleId:style.id, styleName:style.name, budget:offer.budget, requiredBudget:production.required, duration:offer.duration, ageStart:state.age, ageEnd:state.age+offer.duration, quality, critique, publicScore, successMultiplier, recette, spent:production.moneySpent, profit, finalPos, teams:N, objectivePos:offer.objectivePos, objectiveMet, relegated, champion, promotion, cupWon, euroWon, awards:awards.map(a=>a.name), isFlop, isHit, isDoubleFlop, unexpectedFlop, jackpot, financialDisaster, sagaFatigue, sagaEpisode:offer.sagaEpisode||1, isLouche, interim:isInterim, international:offer.international, league:offer.league?offer.league.name:null, recruit:recruit.player?`${recruit.player.name} (${recruit.player.position})`:'promotion interne', vestiaire:vestiaire.label, tactic:tactic.label, staff:staff.label, promoLabel:promo.label, incident:production.incident?production.incident.title:null, incidentChoice:production.incidentChoice?production.incidentChoice.label:null, table:leagueTable(offer,finalPos) };
  state.seasons.push(season);
  state.seasonCounter=(state.seasonCounter||0)+1;
  if(state.currentClub===offer.club) state.seasonsAtClub=(state.seasonsAtClub||0)+1; else { state.currentClub=offer.club; state.seasonsAtClub=1; }
  if(!state.clubsCoached.includes(offer.club)) state.clubsCoached.push(offer.club);
  state.age+=offer.duration;
  // Titres
  if(champion){ if(promotion){ state.titles.promo++; unlockTrophy(isLouche?'louche-title':offer.tierId==='amateur'?'title-amateur':'title-national'); } else { state.titles.champion++; unlockTrophy(`title-${offer.tierId}`); } }
  if(cupWon){ state.titles.cup++; unlockTrophy('cup'); }
  if(euroWon){ state.titles[euroWon]++; unlockTrophy(euroWon); }
  if(champion&&cupWon&&euroWon==='euro1') unlockTrophy('treble'); else if(champion&&cupWon) unlockTrophy('double');
  if(isDoubleFlop) unlockTrophy('double-flop'); if(relegated) unlockTrophy('relegation'); if(isLouche&&!isFlop) unlockTrophy('louche-survivor');
  if(unexpectedFlop) unlockTrophy('unexpected-flop'); if(financialDisaster) unlockTrophy('financial-disaster'); if(jackpot) unlockTrophy('jackpot-season');
  if(isInterim&&objectiveMet) unlockTrophy('interim-saved');
  if(state.consecutiveHits>=3) unlockTrophy('hit-streak-3'); if(state.objectivesMet>=5) unlockTrophy('objective-5');
  if(state.seasons.length===1) unlockTrophy('first-season'); if(state.seasons.length>=10) unlockTrophy('ten-seasons'); if(state.seasons.length>=20) unlockTrophy('twenty-seasons');
  if(state.stats.argent>=100) unlockTrophy('rich'); if(state.seasonsAtClub>=5) unlockTrophy('loyal-club'); if(state.clubsCoached.length>=10) unlockTrophy('nomad');
  if(offer.international) unlockTrophy('international'); if(offer.tierId==='superclub') unlockTrophy('superclub');
  if(styleExperienceCount(style.id)>=5) unlockTrophy('mastery-5');
  const wear=applyCareerSystemWearAfterSeason(season);
  const milestones=checkBaseSystemMilestones();
  const after={...snapshot(s),pressure:state.pressure};
  state.lastSeasonResult={season,before,after,wear,milestones,awards};
  state.currentProduction=null;
  state.pendingChoice='seasonResult';
  const verdict=champion?'🏆 titre':relegated?'⬇️ relégation':objectiveMet?'✅ objectif atteint':'❌ objectif manqué';
  log(`📊 <b>${offer.club}</b> termine ${finalPos}${finalPos===1?'er':'e'} sur ${N} (${verdict}). Presse ${Math.round(critique)}/100, supporters ${Math.round(publicScore)}/100, bilan ${profit>=0?'+':''}${euros(profit)}.`);
}

/* Aléas de plateau : licenciement conflictuel ou saison qui s'enlise (un seul jet chacun) */
function rollSeasonHazards(production){
  const s=ensureBaseCareerSystems(), offer=production.offer;
  if(offer.interimBacked) return null;
  const conflictChance=clamp(.05+Math.max(0,50-s.ethics)*.002+Math.max(0,50-s.union)*.002,.05,.25);
  if(Math.random()<conflictChance) return 'conflict';
  const delayChance=clamp(.05+Math.max(0,50-s.relation)*.004,.05,.25);
  if(Math.random()<delayChance) return 'delay';
  return null;
}
function abortSeason(production){
  const offer=production.offer;
  state.abortedSeasons++; unlockTrophy('aborted');
  state.consecutiveFlops=(state.consecutiveFlops||0)+1; state.consecutiveHits=0;
  state.pressure=clamp((state.pressure||0)+10); state.stats.repPublic-=3; state.stats.moral-=6;
  applyCareerSystemChanges({relation:-5,union:-3});
  clampAll(state.stats);
  const season={ n:state.seasons.length+1, title:offer.title, club:offer.club, tierId:offer.tierId, tierLabel:offer.tierLabel, styleId:offer.style.id, styleName:offer.style.name, budget:offer.budget, requiredBudget:production.required, duration:1, ageStart:state.age, ageEnd:state.age+1, aborted:true, isFlop:true, spent:production.moneySpent, recette:0, profit:-production.moneySpent, isLouche:offer.isLouche, sagaEpisode:offer.sagaEpisode||1 };
  state.seasons.push(season); state.age+=1;
  state.currentClub=null; state.seasonsAtClub=0;
  state.currentProduction=null; state.lastSeasonResult={season,aborted:true};
  state.pendingChoice='aborted';
  log(`🪓 <b>${offer.club}</b> te licencie en cours de saison après une rupture avec le vestiaire et la direction. ${euros(production.moneySpent)} engagés sont perdus.`);
}

/* ---------- Pression ---------- */
function checkPressureFatality(){
  if(!state||state.ended||(state.pressure||0)<90||(state.pressure||0)>=100) return false;
  const key=`${state.age}:${state.seasons.length}`;
  if(state.lastPressureFatalityCheckKey===key) return false;
  state.lastPressureFatalityCheckKey=key;
  if(Math.random()>=.01) return false;
  unlockTrophy('pressure-death');
  endCareer(`À ${Math.round(state.pressure)}/100 de pression, ton cœur lâche au bord du terrain. Malgré l'intervention du staff médical, la carrière et la vie s'arrêtent brutalement.`,{cause:'pressureDeath',automatic:true});
  return true;
}
function triggerPressureCrisis(){ state.pendingChoice='pressureCrisis'; unlockTrophy('pressure-crisis'); }
function choosePressureCrisis(i){
  const c=PRESSURE_CRISIS_CHOICES[i]; if(!c) return;
  if(c.deathChance&&Math.random()<c.deathChance){
    unlockTrophy('pressure-death');
    log(`💀 Tu continues coûte que coûte. Ton corps ne suit pas.`);
    endCareer(`Tu as choisi de continuer coûte que coûte à 100/100 de pression. Un malaise en plein match met fin à ta vie et à ta carrière.`,{cause:'pressureDeath',automatic:true});
    render(); return;
  }
  if(c.deathChance) unlockTrophy('pressure-push-survived');
  if(c.id==='pause') unlockTrophy('pressure-pause');
  const before={...snapshot(state.stats),pressure:state.pressure};
  applyBaseCareerIssueEffects(c.effects);
  if(c.years){ state.age+=c.years; log(`🏖️ Trois années loin des bancs. Tu reviens à ${state.age} ans.`); }
  if(c.delegate){ state.delegatedNextSeasonPenalty=8; log(`🪑 Ton adjoint mènera la prochaine saison : la pression retombe, le contrôle aussi.`); }
  state.pressureCrisisCooldown=2;
  const after={...snapshot(state.stats),pressure:state.pressure};
  state.pendingResult={title:'🌡️ Crise de pression',subtitle:c.label,before,after,narrative:c.sub,next:'newYear'};
  state.pendingChoice='choiceResult';
  render();
}

/* ---------- Année ---------- */
function newYear(){
  if((state.pressure||0)>=100){ triggerPressureCrisis(); return; }
  if(checkPressureFatality()) return;
  state.stats.scandalRisk=Math.max(0,(state.stats.scandalRisk||0)-2);
  state.pressure=clamp((state.pressure||0)-4,0,100);
  const annual=(state.modeRules.annualPressure||0)+(state.careerModeId==='chaos'?randInt(-5,9):0); if(annual) state.pressure=clamp(state.pressure+annual,0,100);
  const upkeep=(.006+.003*state.seasons.length)*(state.modeRules.upkeep||1); state.stats.argent-=upkeep;
  tickBaseCareerSystems();
  const crisisOnCooldown=(state.pressureCrisisCooldown||0)>0; if(crisisOnCooldown) state.pressureCrisisCooldown--;
  if((state.pressure||0)>=60){ state.stats.moral-=((state.pressure||0)-50)*.08; if((state.pressure||0)>=90){ state.stats.technique-=1; state.stats.scandalRisk=(state.stats.scandalRisk||0)+3; } }
  if(state.stats.moral<30) state.stats.scandalRisk=(state.stats.scandalRisk||0)+3;
  const structural=careerStructuralRisk(); state.lastStructuralRisk=structural.score;
  if(state.seasons.length>=3&&structural.score>=70){ state.criticalStructuralYears=(state.criticalStructuralYears||0)+1; state.stats.moral-=2; (state.careerCrew||[]).forEach(m=>m.loyalty=clamp(m.loyalty-2,0,100)); }
  else state.criticalStructuralYears=Math.max(0,(state.criticalStructuralYears||0)-1);
  if(structural.score>=52) state.stats.scandalRisk=clamp((state.stats.scandalRisk||0)+1,0,100);
  clampAll(state.stats);
  state.stats.moral+=(60-state.stats.moral)*.15; clampAll(state.stats);
  if(checkEcoLeagueArrest()) return;
  if(state.emergencyLoan&&state.emergencyLoan.balance>0){
    if((state.emergencyLoan.graceCycles||0)>0) state.emergencyLoan.graceCycles--;
    else if((state.emergencyLoan.installments||0)<2){ triggerEmergencyLoanPayment(crisisOnCooldown); return; }
  }
  if(checkEndConditions()) return;
  finishNewYear(crisisOnCooldown);
}
function finishNewYear(crisisOnCooldown=false){
  if(state.ended) return;
  if(canTriggerEcoFine()){ triggerEcoFine(); return; }
  const crisisChance=(state.pressure||0)>=100?1:(state.pressure||0)>=90?.72:(state.pressure||0)>=85?.42:0;
  if(!crisisOnCooldown&&crisisChance>0&&Math.random()<crisisChance){ triggerPressureCrisis(); return; }
  const n=state.seasons.length;
  if(n>0&&n%5===0&&state.lastStrategySeason!==n){ state.lastStrategySeason=n; state.strategyOptions=shuffledCopy(CAREER_STRATEGIES).slice(0,4); state.pendingChoice='strategy'; return; }
  openProjects();
}
function openProjects(){
  state.currentOffers=generateOffers();
  state.consecutiveNoOffers=state.currentOffers.length===0?(state.consecutiveNoOffers||0)+1:0;
  state.pendingChoice='projects';
  checkEndConditions();
  saveGame();
}
function chooseStrategy(i){
  const st=state.strategyOptions[i]; if(!st) return;
  state.activeStrategy={...st,remaining:3};
  if(!state.strategiesUsed.includes(st.id)) state.strategiesUsed.push(st.id);
  if(state.strategiesUsed.length>=4) unlockTrophy('strategy-all');
  log(`🧭 Nouvelle stratégie de carrière pour trois saisons : <b>${st.name}</b>.`);
  openProjects(); render();
}
function skipYear(){
  log(`🛋️ Tu refuses tous les projets et prends une année sabbatique.`);
  state.age+=1; state.pressure=clamp((state.pressure||0)-12,0,100); state.stats.moral+=4; state.stats.reseau-=2; state.stats.repPublic-=2;
  state.currentClub=null; state.seasonsAtClub=0; clampAll(state.stats);
  state.consecutiveNoOffers=(state.consecutiveNoOffers||0); newYear(); render();
}

/* ---------- Enveloppe de secours ---------- */
function emergencyLoanPrincipal(){
  const deficit=Math.max(0,-(state.stats.argent||0)), n=state.seasons.length, last=n?state.seasons[n-1]:null;
  const lastScale=last?Math.max(last.requiredBudget||0,last.spent||0,last.budget||0):0;
  return Math.round((deficit+clamp(Math.max(.6,lastScale*.58,n*.16),.6,125))*100)/100;
}
function triggerEmergencyLoanOffer(){
  if(state.emergencyLoan||state.emergencyLoanUsed||state.modeRules.emergencyLoan===false) return false;
  state.emergencyLoanDraft={principal:emergencyLoanPrincipal(),cashBefore:state.stats.argent||0};
  state.pendingChoice='emergencyLoanOffer'; return true;
}
function acceptEmergencyLoan(){
  const d=state.emergencyLoanDraft; if(!d||state.emergencyLoan||state.ended) return;
  const principal=Math.max(.01,d.principal);
  state.stats.argent+=principal;
  state.emergencyLoan={principal,balance:principal,annualRate:.1,installments:0,graceCycles:0,startedAge:state.age,history:[],lastInterest:0};
  state.emergencyLoanUsed=true; state.emergencyLoanDraft=null; unlockTrophy('emergency-loan-taken');
  log(`🏦 Un mécène te confie une enveloppe de secours de <b>${euros(principal)}</b>. Le solde prendra 10 % d'intérêts avant chacune des deux échéances.`);
  openProjects(); render();
}
function refuseEmergencyLoan(){
  const cash=state.stats.argent||0; state.emergencyLoanDraft=null; unlockTrophy('bankruptcy');
  endCareer(`Ton capital est tombé à ${euros(cash)}. Tu refuses l'enveloppe de la dernière chance : plus aucun club ne te confie de budget et la carrière s'arrête.`,{cause:'bankruptcy',automatic:false});
  render();
}
function triggerEmergencyLoanPayment(crisisOnCooldown=false){
  const loan=state.emergencyLoan; if(!loan||loan.balance<=0||loan.installments>=2) return false;
  const interest=Math.round(loan.balance*loan.annualRate*100)/100;
  loan.balance=Math.round((loan.balance+interest)*100)/100; loan.lastInterest=interest; loan.resumeCrisisOnCooldown=!!crisisOnCooldown; loan.installments++;
  state.pendingChoice='emergencyLoanPayment';
  log(`📅 Échéance ${loan.installments}/2 de l'enveloppe : ${euros(interest)} d'intérêts ajoutés au solde.`);
  return true;
}
function emergencyLoanMaxPayment(){ const l=state.emergencyLoan; return l?Math.max(0,Math.min(l.balance,state.stats.argent||0)):0; }
function confirmEmergencyLoanPayment(amountRaw){
  const loan=state.emergencyLoan; if(!loan||state.ended) return;
  const amount=Math.round(clamp(Number(amountRaw)||0,0,emergencyLoanMaxPayment())*100)/100;
  state.stats.argent-=amount; loan.balance=Math.round(Math.max(0,loan.balance-amount)*100)/100;
  loan.history.push({installment:loan.installments,interest:loan.lastInterest,payment:amount,balance:loan.balance,age:state.age});
  const crisisOnCooldown=!!loan.resumeCrisisOnCooldown; loan.resumeCrisisOnCooldown=false;
  log(`💳 Échéance ${loan.installments}/2 : <b>${euros(amount)}</b> remboursés, ${euros(loan.balance)} restent dus.`);
  state.pendingChoice=null;
  if(loan.balance<=.0005){ unlockTrophy('emergency-loan-repaid'); state.emergencyLoan=null; log(`✅ L'enveloppe de secours est intégralement remboursée.`); if(checkEndConditions()){ render(); return; } finishNewYear(crisisOnCooldown); render(); return; }
  if(loan.installments>=2){ unlockTrophy('emergency-loan-judicial'); endCareer(`La seconde échéance est passée, mais ${euros(loan.balance)} restent dus. Le mécène saisit la justice : tu es radié·e de tout banc de touche.`,{cause:'judicialRecovery',automatic:true}); render(); return; }
  if(checkEndConditions()){ render(); return; }
  finishNewYear(crisisOnCooldown); render();
}

/* ---------- Fin de carrière ---------- */
function checkEndConditions(){
  if(state.ended) return true;
  const bankable=state.stats.repCritique+state.stats.repPublic;
  if(state.age>=75){ unlockTrophy('retire-old'); endCareer("Tu atteins 75 ans : après une longue vie de football, le jeu clôt automatiquement cette carrière et ouvre son bilan.",{cause:'age',automatic:true}); }
  else if(state.stats.argent<=0){
    if(state.emergencyLoan&&state.emergencyLoan.balance>0&&(state.emergencyLoan.installments||0)<2) return false;
    if(triggerEmergencyLoanOffer()) return true;
    unlockTrophy('bankruptcy');
    endCareer(`Ton capital est tombé à ${euros(state.stats.argent)}. Plus aucun président n'accepte de te confier un budget : la carrière s'arrête.`,{cause:'bankruptcy',automatic:true});
  }
  else if(state.age>=55&&bankable<40&&(state.consecutiveNoOffers||0)>=2){ unlockTrophy('end-no-offers'); endCareer(`À ${state.age} ans, ta réputation cumulée n'est plus que de ${Math.round(bankable)} et aucun club n'a appelé pendant deux périodes. Le téléphone ne sonnera plus : la carrière s'arrête.`,{cause:'noOffers',automatic:true}); }
  else if((state.consecutiveFlops||0)>=(state.modeRules.flopLimit||4)){ unlockTrophy('end-flops'); endCareer(`Tes ${state.modeRules.flopLimit||4} dernières saisons ont été des échecs. Dans la campagne « ${state.careerModeName} », la confiance des présidents est épuisée : plus personne ne t'engage.`,{cause:'flops',automatic:true}); }
  else if((state.criticalStructuralYears||0)>=3){ const r=careerStructuralRisk(); unlockTrophy('end-collapse'); endCareer(`Ta structure est restée au bord de la rupture pendant trois périodes consécutives.${r.domains.length?` Les foyers les plus graves : ${r.domains.join(' et ')}.`:''} Staff et partenaires se retirent : la carrière s'effondre.`,{cause:'collapse',automatic:true}); }
  return state.ended||state.pendingChoice==='emergencyLoanOffer';
}
function careerScore(){
  const t=state.titles; return Math.round(state.seasons.length*10+t.champion*60+t.promo*25+t.cup*30+t.euro1*120+t.euro2*50+state.awardsWon*40+state.seasons.filter(f=>f.isHit).length*15-state.seasons.filter(f=>f.isFlop).length*10+Math.max(0,state.stats.argent)*2);
}
function endCareer(reason,options={}){
  if(state.ended) return;
  state.ended=true; state.endingText=reason; state.endingCause=options.cause||'other'; state.endingAutomatic=!!options.automatic; state.pendingChoice='end';
  unlockTrophy(`mode-finish-${state.careerModeId}`);
  if(state.seasons.length===0) unlockTrophy('fun-carriere-courte');
  saveToHallOfFame({kind:'coach',name:state.name,mode:state.careerModeName,icon:state.careerModeIcon,seasons:state.seasons.length,titles:state.titles.champion+state.titles.euro1+state.titles.cup+state.titles.euro2+state.titles.promo,age:state.age,cause:state.endingCause,score:careerScore(),date:new Date().toISOString().slice(0,10)});
  clearSave();
}
function computeEpithet(){
  const t=state.titles, n=state.seasons.length, flops=state.seasons.filter(f=>f.isFlop).length;
  if(t.euro1>=2) return "Légende européenne";
  if(t.champion>=3) return "Collectionneur·euse de titres";
  if(t.euro1>=1) return "Conquérant·e de l'Europe";
  if(state.awardsWon>=3) return "Chouchou de la presse";
  if(state.clubsCoached.length>=8) return "Globe-trotteur·euse des bancs";
  if(t.promo>=3) return "Spécialiste des montées";
  if(flops>=n*.5&&n>=4) return "Survivant·e des crises";
  if(state.seasonsAtClub>=5) return "Bâtisseur·euse fidèle";
  if(n>=15) return "Monument de patience";
  if(n<=2) return "Météorite";
  return "Honnête artisan·e du ballon";
}
