/* ============================== ABSOLUT COACH — ÉVÉNEMENTS ==============================
   Enchaînement entre deux saisons : amende écologique, roulette du destin, plans de redressement,
   dilemmes structurels, coups du sort, puis nouvelle année et nouvelles offres. */

function continueAfterSeasonResult(){
  if(state.ended){ render(); return; }
  state.pendingChoice=null;
  decideNextStep();
}
function continueAfterChoiceResult(){
  const r=state.pendingResult; state.pendingResult=null; state.pendingChoice=null;
  if(state.ended){ render(); return; }
  const next=r&&r.next;
  if(next==='newYear'){ newYear(); render(); return; }
  if(next==='openProjects'){ openProjects(); render(); return; }
  newYear(); render();
}
function pushChoiceResult(title,subtitle,before,after,narrative,extra={}){
  const systemBefore=extra.systemBefore||null, systemAfter=extra.systemAfter||null;
  state.pendingResult={title,subtitle,before,after,narrative,next:extra.next||'newYear',systemBefore,systemAfter,milestones:extra.milestones||[]};
  state.pendingChoice='choiceResult';
}

/* ---------- Amende écologique ---------- */
function ecologicalFineAmount(){ const cash=Math.max(0,state.stats.argent||0); return Math.max(.02,Math.round(cash*rand(.08,.18)*100)/100); }
function canTriggerEcoFine(){
  const s=ensureBaseCareerSystems();
  return s.eco<10&&state.seasons.length>=1&&state.seasons.length-(state.lastEcoFineSeason??-99)>=2;
}
function triggerEcoFine(){
  const record=Math.random()<1/6;
  const amount=record?Math.max(ecologicalFineAmount()*3,(state.stats.argent||0)*1.15):ecologicalFineAmount();
  state.currentEcoFine={amount,record,text:pick(ECO_FINE_TEXTS)};
  state.lastEcoFineSeason=state.seasons.length;
  state.pendingChoice='ecoFine';
}
function chooseEcoFine(pay){
  const f=state.currentEcoFine; if(!f) return;
  const before={...snapshot(state.stats),pressure:state.pressure};
  let narrative;
  if(pay&&f.amount<=state.stats.argent){
    state.stats.argent-=f.amount; state.careerSystems.eco=Math.max(state.careerSystems.eco,20); unlockTrophy('eco-fine-paid');
    narrative=`Tu paies ${euros(f.amount)}. Le club lance en urgence un plan de sobriété : l'écologie remonte à 20.`;
    log(`💸 Amende écologique payée : ${euros(f.amount)}.`);
  } else {
    state.ecoFineRefusals++; state.ecoArrestRisk=clamp((state.ecoArrestRisk||0)+randInt(8,16),0,90); unlockTrophy('eco-fine-refused');
    state.stats.repCritique-=3; state.stats.scandalRisk=clamp((state.stats.scandalRisk||0)+5);
    narrative=f.record?`L'enquête record dépasse ton capital : impossible de payer. Le dossier grossit et le risque d'arrestation aussi (${state.ecoArrestRisk} %).`:`Tu refuses de payer. Les avocats de la Ligue des défenseurs de la planète constituent un dossier (risque d'arrestation : ${state.ecoArrestRisk} %).`;
    log(`🙈 Amende écologique refusée. Risque d'arrestation : ${state.ecoArrestRisk} %.`);
  }
  clampAll(state.stats);
  state.currentEcoFine=null;
  const after={...snapshot(state.stats),pressure:state.pressure};
  pushChoiceResult('🌍 Ligue des défenseurs de la planète',pay?'Payer l\'amende':'Refuser de payer',before,after,narrative,{next:'openProjects'});
  render();
}
function checkEcoLeagueArrest(){
  if(!(state.ecoArrestRisk>0)||state.ended) return false;
  if(Math.random()*100<state.ecoArrestRisk){
    unlockTrophy('eco-arrest');
    endCareer(`Après ${state.ecoFineRefusals} amende${state.ecoFineRefusals>1?'s':''} écologique${state.ecoFineRefusals>1?'s':''} refusée${state.ecoFineRefusals>1?'s':''}, la justice te rattrape : arrestation en pleine conférence de presse et fin immédiate de la carrière.`,{cause:'ecoArrest',automatic:true});
    return true;
  }
  state.ecoArrestRisk=Math.max(0,state.ecoArrestRisk-5);
  return false;
}

/* ---------- Roulette du destin ---------- */
function canTriggerCareerRoulette(){
  return state.seasons.length>=3&&(state.rouletteCount||0)<CAREER_ROULETTE_EVENTS.length&&state.seasons.length-(state.lastRouletteSeason??-99)>=4;
}
function triggerCareerRoulette(){
  const event=pickNoRepeat('career-roulette',CAREER_ROULETTE_EVENTS);
  state.currentRoulette={event,outcomes:shuffledCopy(['end','jackpot','small','malus'])};
  state.rouletteCount=(state.rouletteCount||0)+1; state.lastRouletteSeason=state.seasons.length;
  state.pendingChoice='careerRoulette';
}
function rouletteSmallEffects(){ const e={pressure:-randInt(1,5)}; shuffledCopy(STAT_KEYS).slice(0,3).forEach(k=>e[k]=randInt(2,6)); shuffledCopy(CAREER_SYSTEM_KEYS).slice(0,2).forEach(k=>e[k]=randInt(2,5)); if(Math.random()<.45) e.money=rand(.04,.16); return e; }
function rouletteMalusEffects(){ const e={pressure:randInt(8,16),money:-Math.max(.08,Math.min(.65,Math.max(0,state.stats.argent||0)*rand(.06,.14)))}; shuffledCopy(STAT_KEYS).slice(0,3).forEach(k=>e[k]=-randInt(4,9)); shuffledCopy(CAREER_SYSTEM_KEYS).slice(0,2).forEach(k=>e[k]=-randInt(4,8)); return e; }
function rouletteJackpotEffects(){ const e={pressure:-randInt(18,30),money:Math.max(.8,(state.stats.argent||0)*rand(.45,.9))}; STAT_KEYS.forEach(k=>e[k]=randInt(15,24)); CAREER_SYSTEM_KEYS.forEach(k=>e[k]=randInt(12,22)); return e; }
function chooseCareerRoulette(index){
  const r=state.currentRoulette, event=r&&r.event; if(!event) return;
  const outcome=r.outcomes[index];
  if(outcome==='end'){
    unlockTrophy('roulette-death'); log(`${event.icon} <b>${event.title}</b> → ${event.choices[index]}. ☠️ ${event.endText}`);
    state.currentRoulette=null; endCareer(`${event.icon} ${event.endText}`,{cause:'roulette',automatic:true}); render(); return;
  }
  const before={...snapshot(state.stats),pressure:state.pressure}, systemBefore={...ensureBaseCareerSystems()};
  const jackpot=outcome==='jackpot', malus=outcome==='malus';
  applyGenericEffects(jackpot?rouletteJackpotEffects():malus?rouletteMalusEffects():rouletteSmallEffects(),{absoluteMoney:true});
  const milestones=checkBaseSystemMilestones();
  unlockTrophy(jackpot?'roulette-jackpot':malus?'roulette-malus':'roulette-survivor');
  const narrative=jackpot?event.jackpotText:malus?"Le choix déclenche un revers sérieux sans détruire ta carrière : le capital, le moral et plusieurs fondations du club encaissent le choc.":"Une seule porte s'entrouvre modestement : ton staff et ta carrière gagnent un petit peu d'élan.";
  log(`${event.icon} <b>${event.title}</b> → ${event.choices[index]}. ${jackpot?'🌠':malus?'🌧️':'🍀'} ${narrative}`);
  const after={...snapshot(state.stats),pressure:state.pressure};
  state.currentRoulette=null;
  pushChoiceResult(`${event.icon} ${event.title}`,event.choices[index],before,after,narrative,{systemBefore,systemAfter:{...ensureBaseCareerSystems()},milestones});
  render();
}

/* ---------- Plans de redressement ---------- */
function canTriggerSystemRecovery(){ return state.seasons.length>=2&&state.seasons.length-(state.lastRecoverySeason??-99)>=3; }
function triggerSystemRecoveryEvent(){
  const systems=ensureBaseCareerSystems();
  const sorted=[...CAREER_SYSTEM_KEYS].sort((a,b)=>(systems[a]||0)-(systems[b]||0));
  const key=Math.random()<.7?sorted[0]:pick(sorted.slice(0,3));
  const ev=SYSTEM_RECOVERY_EVENTS.find(e=>e.system===key)||pick(SYSTEM_RECOVERY_EVENTS);
  state.currentEvent={kind:'recovery',event:ev}; state.lastRecoverySeason=state.seasons.length; state.recoveryCount++;
  state.pendingChoice='event';
}
function triggerBaseCareerIssue(){
  const systems=ensureBaseCareerSystems();
  const pool=BASE_CAREER_ISSUES.filter(i=>!state.baseIssuesSeen.includes(i.id));
  const src=pool.length?pool:BASE_CAREER_ISSUES;
  const weak=[...CAREER_SYSTEM_KEYS].sort((a,b)=>(systems[a]||0)-(systems[b]||0)).slice(0,3);
  const weighted=src.filter(i=>weak.includes(i.system)); const ev=pick(weighted.length&&Math.random()<.65?weighted:src);
  state.baseIssuesSeen.push(ev.id);
  state.currentEvent={kind:'issue',event:ev}; state.pendingChoice='event';
}
function triggerCareerHappening(){
  const ev=pickNoRepeat('happenings',CAREER_HAPPENINGS);
  state.currentEvent={kind:'happening',event:ev}; state.pendingChoice='event';
}
function chooseEvent(i){
  const ce=state.currentEvent, ev=ce&&ce.event, choice=ev&&ev.choices[i]; if(!choice) return;
  const before={...snapshot(state.stats),pressure:state.pressure}, systemBefore={...ensureBaseCareerSystems()};
  let narrative=choice.result||'';
  let effects=choice.effects||{};
  if(ce.kind==='recovery'&&choice.failChance&&Math.random()<choice.failChance){ effects=choice.fail||{}; narrative="Le plan échoue en partie : mauvaise exécution, résistances internes ou argent gaspillé. La situation ne s'améliore pas comme prévu."; }
  else if(ce.kind==='recovery'){ narrative="Le plan porte ses fruits. Certaines fondations du club se renforcent durablement."; unlockTrophy('recovery-done'); }
  else if(ce.kind==='issue'){ narrative="Une décision structurelle de plus : ses effets se lisent dans les jauges du club et dans tes statistiques."; }
  applyGenericEffects(effects,{});
  const milestones=checkBaseSystemMilestones();
  const after={...snapshot(state.stats),pressure:state.pressure};
  log(`${ev.icon} <b>${ev.title}</b> → ${choice.label}. ${narrative}`);
  state.currentEvent=null;
  pushChoiceResult(`${ev.icon} ${ev.title}`,choice.label,before,after,narrative,{systemBefore,systemAfter:{...ensureBaseCareerSystems()},milestones});
  render();
}

/* ---------- Enchaînement ---------- */
function decideNextStep(){
  if(checkEndConditions()){ render(); return; }
  if(canTriggerEcoFine()){ triggerEcoFine(); render(); return; }
  if(canTriggerSystemRecovery()){
    const systems=ensureBaseCareerSystems(), lowest=Math.min(...CAREER_SYSTEM_KEYS.map(k=>systems[k]||0)), eco=systems.eco||0;
    const baseChance=eco<10?.4:eco<20?.3:lowest<20?.34:lowest<40?.25:.14;
    if(Math.random()<baseChance*(state.modeRules.recoveryMult||1)){ triggerSystemRecoveryEvent(); render(); return; }
  }
  if(canTriggerCareerRoulette()&&Math.random()<.2){ triggerCareerRoulette(); render(); return; }
  if(state.seasons.length>=1&&Math.random()<.24){ triggerBaseCareerIssue(); render(); return; }
  if(Math.random()<.3){ triggerCareerHappening(); render(); return; }
  log(`Une intersaison calme, sans grand imprévu : tu avances tranquillement vers ton prochain projet.`);
  newYear(); render();
}
