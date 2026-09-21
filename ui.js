/* ============================== ABSOLUT COACH — INTERFACE ============================== */
const app=document.getElementById('app'), filmstripEl=document.getElementById('filmstrip'), homeCreditStripEl=document.getElementById('homeCreditStrip'), gameTopBannerEl=document.getElementById('gameTopBanner'), editionLabelEl=document.getElementById('editionLabel');
let creation=null, marketFilter='all', tacticSel=null;
function applyTheme(){ const player=state&&state.kind==='player'; document.documentElement.setAttribute('data-theme',player?'player':'coach'); const brand=gameTopBannerEl.querySelector('.brand'); if(brand) brand.innerHTML=(player?'ABSOLUT PLAYER':'ABSOLUT COACH')+'<span>.</span>'; document.title=player?'Absolut Player':'Absolut Coach'; editionLabelEl.textContent=state?`${eraForYear(state.year).icon} ${eraForYear(state.year).name} · ${state.year}`:'Une vie de football à travers les époques'; }
function showHomeBanner(){ homeCreditStripEl.style.display=''; gameTopBannerEl.style.display='none'; filmstripEl.style.display='none'; applyTheme(); }
function showGameBanner(){ homeCreditStripEl.style.display='none'; gameTopBannerEl.style.display=''; applyTheme(); }
function goHomeFromGame(){ if(state&&!state.ended) saveGame(); state=null; creation=null; renderStart(); }
function scrollTop(){ window.scrollTo(0,0); }
function $(v){ return money(v,state?state.year:2015); }

/* ---------- Accueil ---------- */
function renderStart(){
  showHomeBanner(); document.documentElement.setAttribute('data-theme','coach'); document.title='Absolut Coach';
  const cs=lsGet(KEYS.coach,null), ps=lsGet(KEYS.player,null);
  app.innerHTML=`<div class="fade-in"><div class="home-hero"><h1 class="display">ABSOLUT <span>COACH</span></h1>
    <div class="tagline narr">Une vie de football, des années Kopa à l'ère Mbappé. Choisis ton époque, tes clubs, tes joueurs. Survis aux présidents.</div>
    <div class="home-pills"><span class="pill">7 époques</span><span class="pill">Vrais clubs, vrais joueurs</span><span class="pill">100 % local</span><span class="pill">Français</span></div></div>
    ${cs&&!cs.ended||ps&&!ps.ended?`<div class="home-resume">
      ${cs&&!cs.ended?`<button class="resume-card" onclick="continueGame('coach')"><span class="ico">💾</span><span class="body"><b>Reprendre ${escapeHtml(cs.name)}</b><small>${escapeHtml(cs.modeName)} · ${cs.year} · ${cs.club?escapeHtml(cs.club.name):'sans club'} · ${cs.history.length} saison${cs.history.length>1?'s':''}</small></span><span class="go">→</span></button>`:''}
      ${ps&&!ps.ended?`<button class="resume-card" onclick="continueGame('player')"><span class="ico">💾</span><span class="body"><b>Reprendre ${escapeHtml(ps.name)}</b><small>Joueur·euse · ${ps.year} · ${ps.club?escapeHtml(ps.club.name):'sans club'} · ${ps.history.length} saison${ps.history.length>1?'s':''}</small></span><span class="go">→</span></button>`:''}
    </div>`:''}
    <div class="home-grid">
      <button class="home-card lead" onclick="startCoachCreation()"><div class="ico">🧢</div><b>Carrière d'entraîneur·euse</b><span>Offres de clubs réels, mercato libre, phases de championnat, coupes, présidents et licenciements.</span></button>
      <button class="home-card lead" onclick="startPlayerCreation()"><div class="ico">👟</div><b>Carrière de joueur·euse</b><span>De 17 à 38 ans : agents, temps de jeu, blessures, sélection nationale, Ballon d'or.</span></button>
    </div>
    <div class="home-links">
      <button onclick="renderBadges()"><span>🏅 Salle des badges</span><small>${unlockedTrophies.size} / ${TROPHIES.length} débloqués</small></button>
      <button onclick="renderHall()"><span>🏛️ Panthéon</span><small>Les carrières terminées ici</small></button>
      <button onclick="renderRules()"><span>📖 Comment ça marche</span><small>Les règles en une page</small></button>
    </div></div>`; scrollTop();
}
function continueGame(kind){ const s=lsGet(kind==='player'?KEYS.player:KEYS.coach,null); if(s&&!s.ended){ state=s; render(); } else renderStart(); }

/* ---------- Création ---------- */
function progressHTML(i,n){ return `<div class="creation-progress"><span>Étape ${i+1}/${n}</span><div class="track"><i style="width:${Math.round((i+1)/n*100)}%"></i></div></div>`; }
function bonusChips(bonus,labels){ return `<div class="chip-row">${Object.entries(bonus||{}).filter(([k,v])=>v).map(([k,v])=>`<span class="chip ${v>0?'good':'bad'}">${labels[k]||k} ${v>0?'+':''}${v}</span>`).join('')}</div>`; }
// Effets mécaniques d'une qualité, d'un défaut ou d'un trait, rendus visibles dès la création
function perkChips(o){
  const chips=[];
  const gaugeLabels={...Object.fromEntries(Object.entries(GAUGE_INFO).map(([k,v])=>[k,v.icon+' '+v.label])),...Object.fromEntries(Object.entries(PGAUGE).map(([k,v])=>[k,v.icon+' '+v.label]))};
  Object.entries(o.gauge||o.gauges||{}).forEach(([k,v])=>chips.push([`${gaugeLabels[k]||k} ${v>0?'+':''}${v}`,v>0]));
  if(o.pressureRes) chips.push([`Pression ${o.pressureRes>0?'−':'+'}${Math.abs(o.pressureRes)}`,o.pressureRes>0]);
  if(o.incidentMult&&o.incidentMult!==1) chips.push([`Incidents ${o.incidentMult>1?'+':'−'}${Math.round(Math.abs(o.incidentMult-1)*100)} %`,o.incidentMult<1]);
  if(o.budgetLeak) chips.push([`Budget −${Math.round(o.budgetLeak*100)} %`,false]);
  if(o.scamRes) chips.push([`Arnaques ${o.scamRes>0?'−':'+'}${Math.round(Math.abs(o.scamRes)*100)} %`,o.scamRes>0]);
  if(o.confidenceRes) chips.push([`Confiance du président ${o.confidenceRes>0?'protégée':'fragile'}`,o.confidenceRes>0]);
  if(o.growth) chips.push([`Progression +${Math.round(o.growth*100)} %`,true]);
  if(o.injury) chips.push([`Blessures +${Math.round(o.injury*100)} %`,false]);
  if(o.scandal) chips.push(['Scandales possibles',false]);
  if(o.youthBonus) chips.push([`🎓 Formation +${o.youthBonus}`,true]);
  return chips.length?`<div class="chip-row">${chips.map(([t,good])=>`<span class="chip ${good?'good':'bad'}">${t}</span>`).join('')}</div>`:'';
}
function eraPickHTML(cb){ return `<div class="era-grid">${ERAS.map((e,i)=>`<button class="era-card" onclick="${cb}(${i})"><div class="ico">${e.icon}</div><span class="years">${e.start} – ${e.end}</span><b>${e.name}</b><p>${e.tagline}</p><ul>${e.rules.map(r=>`<li>${r}</li>`).join('')}</ul></button>`).join('')}</div>`; }
const C_STEPS=['name','era','mode','origin','nationality','style','mentor','quality','flaw','summary'];
function startCoachCreation(){ creation={kind:'coach',step:0,name:''}; state=null; renderCreation(); }
function cPick(k,v){ creation[k]=v; creation.step++; renderCreation(); }
function cBack(){ if(creation.step>0){ creation.step--; renderCreation(); } else renderStart(); }
function renderCreation(){
  showGameBanner(); document.documentElement.setAttribute('data-theme',creation.kind==='player'?'player':'coach'); editionLabelEl.textContent=creation.era?`${creation.era.icon} ${creation.era.name}`:'Nouvelle carrière';
  const steps=creation.kind==='coach'?C_STEPS:P_STEPS, step=steps[creation.step]; const back=`<div class="btn-row"><button class="btn secondary" onclick="cBack()">← Retour</button></div>`; let html='';
  const modeCard=(list,key,labels)=>`<div class="mode-grid">${list.map((m,i)=>`<button class="mode-card" onclick="cPick('${key}',${key==='mode'?'COACH_MODES':key==='origin'?(creation.kind==='coach'?'COACH_ORIGINS':'PLAYER_ORIGINS'):key==='quality'?'COACH_QUALITIES':key==='flaw'?'COACH_FLAWS':key==='trait'?'PLAYER_TRAITS':key==='nationality'?'NATIONALITIES':key==='style'?'STYLES':key==='pos'?'PLAYER_POS':'MENTORS_CUR'}[${i}])"><div class="mode-icon">${m.icon||''}</div><div class="mode-copy">${m.difficulty?`<small>${m.difficulty}</small>`:''}<b>${m.name}</b><span>${m.desc||m.style||''}</span>${m.details?`<span class="mode-rules">${m.details.map(d=>`<i>${d}</i>`).join('')}</span>`:''}${m.bonus?bonusChips(m.bonus,labels):''}${perkChips(m)}${m.favoredStyleIds?`<span class="chip-row">${m.favoredStyleIds.map(id=>`<span class="chip good">${styleById(id).icon} ${styleById(id).name}</span>`).join('')}</span>`:''}${m.styleIds?`<span class="chip-row">${m.styleIds.map(id=>`<span class="chip good">${styleById(id).icon} ${styleById(id).name}</span>`).join('')}</span>`:''}</div></button>`).join('')}</div>`;
  if(step==='name') html=`<div class="card"><h2 class="display">${creation.kind==='coach'?"Ton nom d'entraîneur·euse":"Ton nom de joueur·euse"}</h2><input type="text" id="cName" maxlength="28" placeholder="Ex. Vanessa Le Bris" value="${escapeHtml(creation.name)}"><div class="btn-row"><button class="btn secondary" onclick="renderStart()">Accueil</button><button class="btn" onclick="cPick('name',document.getElementById('cName').value.trim()||'Anonyme')">Continuer →</button></div></div>`;
  else if(step==='era') html=`<div class="card"><h2 class="display">Choisis ton époque</h2><p class="hint">Les joueurs disponibles, les règles du football et l'argent en jeu dépendent de l'époque. Une longue carrière traverse la suivante.</p>${eraPickHTML('cPickEra')}${back}</div>`;
  else if(step==='mode') html=`<div class="card"><h2 class="display">Choisis ta campagne</h2><p class="hint">Elle règle les budgets, la patience des présidents, la variance et la fréquence des incidents.</p>${modeCard(COACH_MODES,'mode',CSTAT)}${back}</div>`;
  else if(step==='origin') html=`<div class="card"><h2 class="display">D'où viens-tu ?</h2>${modeCard(creation.kind==='coach'?COACH_ORIGINS:PLAYER_ORIGINS,'origin',creation.kind==='coach'?CSTAT:PSTAT)}${back}</div>`;
  else if(step==='nationality') html=`<div class="card"><h2 class="display">Ta nationalité</h2><p class="hint">Elle définit tes affinités avec certains styles de jeu.</p>${modeCard(NATIONALITIES.map(n=>({...n,bonus:null})),'nationality',CSTAT)}${back}</div>`;
  else if(step==='style') html=`<div class="card"><h2 class="display">Ton style de jeu favori</h2><p class="hint">Un club qui demande ton style et un plan de jeu cohérent donnent un vrai bonus de force.</p>${modeCard(STYLES,'style',CSTAT)}${back}</div>`;
  else if(step==='mentor'){ window.MENTORS_CUR=COACHES_BY_ERA[creation.era.id]; html=`<div class="card"><h2 class="display">Ton inspiration</h2><p class="hint">Un·e entraîneur·euse réel·le de l'époque ${creation.era.name}. Une orientation de départ, rien de plus.</p>${modeCard(MENTORS_CUR,'mentor',CSTAT)}${back}</div>`; }
  else if(step==='quality') html=`<div class="card"><h2 class="display">Ta grande qualité</h2>${modeCard(COACH_QUALITIES,'quality',CSTAT)}${back}</div>`;
  else if(step==='flaw') html=`<div class="card"><h2 class="display">Ton défaut</h2>${modeCard(COACH_FLAWS,'flaw',CSTAT)}${back}</div>`;
  else if(step==='pos') html=`<div class="card"><h2 class="display">Ton poste</h2>${modeCard(PLAYER_POS,'pos',PSTAT)}${back}</div>`;
  else if(step==='trait') html=`<div class="card"><h2 class="display">Ton trait de caractère</h2>${modeCard(PLAYER_TRAITS,'trait',PSTAT)}${back}</div>`;
  else if(step==='summary'){
    if(creation.kind==='coach'){ const tmp=coachFreshState({...creation,favoriteStyle:creation.style}); html=`<div class="card"><h2 class="display">${escapeHtml(creation.name)}</h2><div class="identity">${creation.era.icon} <b>${creation.era.name}</b> · ${creation.mode.icon} ${creation.mode.name} · ${creation.origin.name} · ${creation.nationality.name} · style <b>${creation.style.icon} ${creation.style.name}</b> · inspiré·e par <b>${creation.mentor.name}</b> · ${creation.quality.name} / ${creation.flaw.name}</div>
      <div class="section-label">Statistiques de départ</div>${Object.keys(CSTAT).map(k=>`<div class="stat-row"><div class="lbl"><span>${CSTAT[k]}</span><b>${Math.round(tmp.stats[k])}</b></div><div class="bar"><i style="width:${tmp.stats[k]}%"></i></div></div>`).join('')}
      <div class="section-label">Jauges de départ</div>${Object.keys(GAUGE_INFO).map(k=>`<div class="stat-row"><div class="lbl"><span>${GAUGE_INFO[k].icon} ${GAUGE_INFO[k].label}</span><b>${Math.round(tmp.gauges[k])}</b></div><div class="bar"><i style="width:${tmp.gauges[k]}%"></i></div></div>`).join('')}
      <div class="btn-row"><button class="btn secondary" onclick="cBack()">← Retour</button><button class="btn" onclick="launchCoach()">Commencer en ${creation.era.start} ⚽</button></div></div>`; }
    else { const tmp=playerFreshState(creation); html=`<div class="card"><h2 class="display">${escapeHtml(creation.name)}</h2><div class="identity">${creation.era.icon} <b>${creation.era.name}</b> · ${creation.pos.icon} ${creation.pos.name} · ${creation.origin.name} · ${creation.trait.name} · ${tmp.age} ans</div>
      ${Object.keys(PSTAT).map(k=>`<div class="stat-row"><div class="lbl"><span>${PSTAT[k]}</span><b>${Math.round(tmp.stats[k])}</b></div><div class="bar"><i style="width:${tmp.stats[k]}%"></i></div></div>`).join('')}
      <div class="section-label">Jauges de départ</div>${Object.keys(PGAUGE).map(k=>`<div class="stat-row"><div class="lbl"><span>${PGAUGE[k].icon} ${PGAUGE[k].label}</span><b>${Math.round(tmp.gauges[k])}</b></div><div class="bar"><i style="width:${tmp.gauges[k]}%"></i></div></div>`).join('')}
      <div class="btn-row"><button class="btn secondary" onclick="cBack()">← Retour</button><button class="btn" onclick="launchPlayer()">Commencer en ${creation.era.start} 👟</button></div></div>`; }
  }
  app.innerHTML=`<div class="fade-in">${progressHTML(creation.step,steps.length)}${html}</div>`; scrollTop();
}
function cPickEra(i){ cPick('era',ERAS[i]); }
function launchCoach(){ state=coachFreshState({...creation,favoriteStyle:creation.style}); log(`🧢 ${state.year} : début de carrière à ${state.age} ans. ${state.originName}, inspiré·e par ${state.mentorName}. Campagne « ${state.modeName} ».`); creation=null; coachOpenOffers(); render(); }
const P_STEPS=['name','era','pos','origin','trait','summary'];
function startPlayerCreation(){ creation={kind:'player',step:0,name:''}; state=null; renderCreation(); }
function launchPlayer(){ state=playerFreshState(creation); log(`👟 ${state.year} : début de carrière à ${state.age} ans, ${state.posName.toLowerCase()}. ${state.originName}.`); creation=null; playerOpenOffers(); render(); }

/* ---------- Rendu principal ---------- */
function render(){
  if(!state){ renderStart(); return; }
  showGameBanner(); renderFilmstrip();
  if(state.ended){ state.kind==='player'?renderPlayerEnd():renderCoachEnd(); return; }
  const coach={offers:renderOffers,mercato:renderMercato,tactic:renderTactic,event:renderEvent,choiceResult:renderChoiceResult,prematch:renderPrematch,halftime:renderHalftime,matchResult:renderMatchResult,phaseResult:renderPhaseResult,seasonEnd:renderSeasonEnd,sacked:renderSacked,roulette:renderRoulette,pressureCrisis:renderPressure,priorities:renderPriorities};
  const player={offers:renderPOffers,event:renderEvent,choiceResult:renderChoiceResult,prematch:renderPPrematch,penalty:renderPPenalty,matchResult:renderPMatchResult,phaseResult:renderPPhaseResult,seasonEnd:renderPSeasonEnd,roulette:renderRoulette,pressureCrisis:renderPressure,priorities:renderPriorities};
  const fn=(state.kind==='player'?player:coach)[state.pendingChoice]||(state.kind==='player'?renderPOffers:renderOffers);
  const side=state.kind==='player'?playerSidebar():coachSidebar();
  app.innerHTML=`<div class="layout fade-in"><div class="main">${eraBannerHTML()}${fn()}</div><div class="sidebar"><details class="side-fold" open><summary><span>📋 Ta fiche, le club et le journal</span></summary>${side}</details></div></div>`;
  applySideFold(); scrollTop();
}
/* Au téléphone, la fiche est repliée par défaut : l'écran de jeu passe en premier.
   Le choix du joueur est retenu d'un écran à l'autre. */
let sideFoldOpen=false;
function applySideFold(){
  const d=app.querySelector('.side-fold'); if(!d||!window.matchMedia) return;
  if(!window.matchMedia('(max-width:900px)').matches) return;
  d.open=sideFoldOpen; d.addEventListener('toggle',()=>{ sideFoldOpen=d.open; });
}
function eraBannerHTML(){ const e=eraForYear(state.year); return `<div class="era-banner">${e.icon} <b>${e.name}</b> · <span class="year-badge">${state.year}</span>${state.club?` · ${escapeHtml(state.club.name)} · <b>${escapeHtml(state.club.leagueName||'')}</b>`:''}<span class="era-rules"> · ${e.rules.slice(0,2).join(' · ')}</span></div>`; }
function renderFilmstrip(){
  filmstripEl.style.display='';
  const h=state.history||[]; const frames=h.map(f=>{ const cls=f.sacked?'aborted':(f.champion?'success':f.relegated||f.bad?'flop':f.objectiveMet||f.note>=6.8?'success':'mid'); const label=f.sacked?'🪓':f.champion?'🏆':f.relegated?'⬇️':state.kind==='player'?(f.note?f.note.toFixed(1):'—'):(f.pos?ordinal(f.pos):'—'); return `<div class="frame ${cls}" title="${f.year} · ${escapeHtml(f.club)}">${f.year} ${label}</div>`; });
  if(state.comp) frames.push(`<div class="frame current">${state.year} · phase ${Math.min(state.phase+1,4)}/4 · J${Math.min((state.matchday||0)+1,state.comp.schedule.length)}/${state.comp.schedule.length}</div>`);
  filmstripEl.innerHTML=frames.length?frames.join(''):'<div class="frame">Aucune saison pour l\'instant</div>';
}
function bar(label,v,cls=''){ return `<div class="stat-row"><div class="lbl"><span>${label}</span><b>${Math.round(v)}</b></div><div class="bar ${cls}"><i style="width:${clamp(v)}%"></i></div></div>`; }
function gaugeRow(info,v){ const mood=v>=65?'':v>=35?'mid':'low'; return `<div class="gauge-row ${mood}" title="${escapeHtml(info.help)}"><span>${info.icon}</span><div><div class="bar"><i style="width:${clamp(v)}%"></i></div><div class="hint" style="font-size:10px">${info.label}</div></div><span>${Math.round(v)}</span></div>`; }
function coachSidebar(){
  const s=state.stats, c=state.club, g=state.gauges; const pcls=state.pressure>=85?'bad':state.pressure>=50?'mid':'good';
  const xi=c?bestXI(state.squad,FORMATIONS[state.formation],state.year):[]; const xiAvg=xi.length?xi.reduce((n,p)=>n+playerRating(p,state.year),0)/xi.length:0;
  return `<div class="card"><div class="identity"><b>${escapeHtml(state.name)}</b> · ${state.age} ans · ${state.modeIcon} ${state.modeName}<br>${c?`🏟️ <b>${escapeHtml(c.name)}</b> · ${escapeHtml(c.leagueName||'')} · saison ${c.since}<br>Objectif : ${ordinal(c.objectivePos)} · ${capitalize(c.presidentName)}`:'Sans club'}</div>
    ${c?`<div class="section-label">Confiance du président</div><div class="conf-big ${c.confidence<25?'pressure-state bad':c.confidence<50?'pressure-state mid':''}">${Math.round(c.confidence)} / 100</div><div class="bar"><i style="width:${c.confidence}%"></i></div><div class="hint">À zéro, tu es licencié·e. Sous 35 en fin de saison, tu n'es pas prolongé·e.</div>`:''}
    ${coteHTML()}
    ${fateHTML()}
    <div class="section-label">Toi</div>${Object.keys(CSTAT).map(k=>bar(CSTAT[k],s[k])).join('')}${bar('Pression',state.pressure,'pressure')}
    ${c?tempoSelectHTML():''}
    <div class="section-label">Le club</div>${Object.keys(GAUGE_INFO).map(k=>gaugeRow(GAUGE_INFO[k],g[k])).join('')}
    ${c?`<div class="section-label">Effectif</div><div class="hint">${state.squad.length} joueurs · onze type ${xiAvg.toFixed(1)} · ${state.formation} · ${styleById(state.styleId).icon} ${styleById(state.styleId).name}<br>Blessés : ${state.squad.filter(p=>p.injury>0).length} · Suspendus : ${state.squad.filter(p=>p.suspended>0).length} · Fraîcheur ${Math.round(state.squad.reduce((n,p)=>n+fit(p),0)/Math.max(1,state.squad.length))} %<br>Masse salariale ${$(state.squad.reduce((n,p)=>n+p.wage,0))} / ${$(c.wageCap||0)}</div>`:''}
    <div class="section-label">Palmarès</div><div class="hint">🏆 ${state.titles.league} · ⬆️ ${state.titles.promo} · 🥇 ${state.titles.cup} · ⭐ ${state.titles.euro} · 🌍 ${state.titles.euro2} · 🎖️ ${state.awards} · 🪓 ${state.sackings}</div></div>
    <div class="card"><div class="section-label">Journal</div><div class="log">${state.log.slice(0,30).map(l=>`<div><span class="age">${l.year}</span>${l.msg}</div>`).join('')}</div></div>
    <div class="card"><div class="btn-row"><button class="btn secondary small" onclick="goHomeFromGame()">Accueil (sauvegarde)</button><button class="btn danger small" onclick="if(confirm('Prendre ta retraite ? La sauvegarde sera supprimée.')){coachEnd('Tu raccroches le survêtement de ton plein gré.','retire');render();}">Retraite</button></div></div>`;
}
const CLABELS={talent:'Tactique',technique:'Management',reseau:'Réseau',reputation:'Réputation',pressure:'Pression',confidence:'Confiance du président',vestiaire:'✊ Vestiaire',supporters:'📣 Supporters',formation:'🎓 Formation',staff:'🧑‍🤝‍🧑 Staff',note:'Note globale',coachTrust:'Confiance du coach',forme:'Forme',corps:'🩻 Corps',entourage:'👪 Entourage',physique:'Physique',mental:'Mental'};
function deltaChips(before,after,extra=[]){
  const chips=Object.keys(after).map(k=>{ const d=(after[k]||0)-(before[k]||0); if(Math.abs(d)<.5) return ''; const good=k==='pressure'?d<0:d>0; return `<span class="delta-chip ${good?'up':'down'}">${CLABELS[k]||k} ${d>0?'+':''}${Math.round(d)}</span>`; }).filter(Boolean).concat(extra.map(e=>`<span class="delta-chip">${escapeHtml(e)}</span>`));
  return chips.length?`<div class="delta-chips">${chips.join('')}</div>`:'<div class="hint">Aucun changement immédiat visible.</div>';
}
function renderChoiceResult(){ const r=state.pendingResult; const cont=state.kind==='player'?'playerContinueChoiceResult()':'coachContinueChoiceResult()'; return `<div class="card"><h2 class="display">${r.title}</h2><div class="subtitle">${escapeHtml(r.subtitle||'')}</div><p class="narr">${escapeHtml(r.narrative||'')}</p>${deltaChips(r.before,r.after,r.extra||[])}<div class="btn-row"><button class="btn" onclick="${cont}">Continuer →</button></div></div>`; }
/* Un arbitrage ne vaut que s'il se voit : chaque option annonce ce qu'elle donne et ce qu'elle coûte. */
const FX_LABEL={talent:'🧠 Tactique',technique:'🗣️ Management',reseau:'🤝 Réseau',reputation:'📰 Réputation',
  vestiaire:'✊ Vestiaire',supporters:'📣 Supporters',formation:'🎓 Formation',staff:'🧑‍🤝‍🧑 Staff',proches:'🏡 Proches',
  pressure:'🌡️ Pression',confidence:'🪑 Président',budget:'💰 Budget',form:'📈 Dynamique',
  physique:'💪 Physique',mental:'🧠 Mental',corps:'🩻 Corps',entourage:'👪 Entourage',coachTrust:'🎽 Confiance du coach',forme:'📈 Forme',money:'💰 Argent'};
const FX_SPECIAL={injure:'🩼 Un blessé',sellStar:'💸 Ta star part',promoteYouth:'🌱 Un jeune monte',skipHalf:'⏭️ Une demi-saison sautée',stayLocal:'🏡 Plus de départ lointain',points:'⚖️ Points au classement',releaseCaptain:'👋 Un cadre s\'en va'};
function effectChips(effects,seed){
  const out=[];
  Object.entries(effects||{}).forEach(([k,v])=>{
    if(k==='noReinvest') return;
    if(FX_SPECIAL[k]){ out.push(`<i class="minus">${FX_SPECIAL[k]}</i>`); return; }
    const lbl=FX_LABEL[k]; if(!lbl||!v) return;
    // Le signe dit le sens du chiffre, la couleur dit si c'est une bonne nouvelle :
    // « Pression −− » en vert se lit tout de suite.
    const good=k==='pressure'?v<0:v>0;
    const big=k==='budget'?Math.abs(v)>=.05:Math.abs(v)>=6;
    const sign=(v>0?'+':'−').repeat(big?2:1);
    out.push(`<i class="${good?'plus':'minus'}">${lbl} ${sign}</i>`);
  });
  if(seed) out.push('<i>🌱 une suite, un jour</i>');
  return out.length?`<div class="traits">${out.join('')}</div>`:'';
}
function renderEvent(){ const ce=state.currentEvent, ev=ce.event; const kind={incident:'Incident de saison',dilemma:'Dilemme',happening:'Intersaison'}[ce.kind]; const fn=state.kind==='player'?'playerChooseEvent':'coachChooseEvent'; return `<div class="card event-card"><div class="hint">${kind}${ev.gauge?` · jauge ${(state.kind==='player'?PGAUGE:GAUGE_INFO)[ev.gauge]?(state.kind==='player'?PGAUGE:GAUGE_INFO)[ev.gauge].label:''}`:''}</div><div class="ico">${ev.icon}</div><h2 class="display">${escapeHtml(ev.title)}</h2><p class="narr">${escapeHtml(ev.text)}</p><div class="choice-list">${ev.choices.filter(c=>!c.minYear||state.year>=c.minYear).map(c=>`<button class="choice-btn" onclick="${fn}(${ev.choices.indexOf(c)})"><div class="body"><b>${escapeHtml(c.label)}</b>${effectChips(c.effects,c.seed)}</div></button>`).join('')}</div><div class="hint">Aucune option n'est gratuite : ce que tu gagnes d'un côté se paie de l'autre.</div></div>`; }
function renderRoulette(){ const ev=state.currentRoulette.event; const fn=state.kind==='player'?'playerChooseRoulette':'coachChooseRoulette';
  const fk=(ev.fate&&ev.fate.kind)||'death'; const sealed=fk!=='death'&&fk!=='banned';
  return `<div class="card event-card"><div class="hint">🎲 Roulette du destin · une seule des quatre issues ${sealed?'scelle le reste de ta carrière':'met fin à la carrière'}</div><div class="ico">${ev.icon}</div><h2 class="display">${escapeHtml(ev.title)}</h2><p class="narr">${escapeHtml(ev.text)}</p><div class="roulette-grid">${ev.choices.map((c,i)=>`<button class="choice-btn" onclick="${fn}(${i})"><div class="body"><b>${escapeHtml(c)}</b></div></button>`).join('')}</div><div class="hint" style="margin-top:10px">Issues cachées : ${sealed?`${ev.fate.icon} ${escapeHtml(ev.fate.label.toLowerCase())}`:'☠️ fin'} · 🌠 jackpot · 🍀 petit bonus · 🌧️ malus. Chaque issue laisse une trace sur les saisons suivantes.</div></div>`; }
/* Deux priorités, trois renoncements : l'arbitrage de la saison. */
function renderPriorities(){
  const player=state.kind==='player';
  const AREAS=player?PFOCUS_AREAS:FOCUS_AREAS, PICKS=player?PFOCUS_PICKS:FOCUS_PICKS;
  const toggle=player?'playerToggleFocus':'coachToggleFocus', confirm=player?'playerConfirmFocus':'coachConfirmFocus';
  const picked=state.focus||[]; const left=PICKS-picked.length;
  return `<div class="card"><h2 class="display">Où passe ton année ?</h2>
    <p class="narr">Une saison ne tient pas tout. Choisis ${PICKS} chantiers : ils avanceront. Les trois autres reculeront, et tu le sentiras.</p>
    <div class="section-label">${picked.length} choisi${picked.length>1?'s':''} sur ${PICKS}${left>0?` · il en reste ${left}`:' · tu peux échanger'}</div>
    <div class="focus-grid">${Object.entries(AREAS).map(([k,a])=>{ const on=picked.includes(k);
      return `<button class="focus-card ${on?'on':''}" onclick="${toggle}('${k}')">
        <span class="ico">${a.icon}</span>
        <span class="body"><b>${escapeHtml(a.label)}</b><small>${escapeHtml(a.desc)}</small>
        ${effectChips(a.gain)}
        <span class="cost">Laissé de côté : ${Object.entries(a.loss).map(([ck,cv])=>`${(FX_LABEL[ck]||ck)} ${cv>0?'+':'−'}`).join(' · ')}</span></span>
        <span class="mark">${on?'✓':''}</span></button>`; }).join('')}</div>
    <div class="btn-row"><button class="btn" ${picked.length<PICKS?'disabled':''} onclick="${confirm}()">${picked.length<PICKS?`Choisis encore ${left} chantier${left>1?'s':''}`:'Lancer la saison →'}</button></div></div>`;
}
function renderPressure(){ const list=state.kind==='player'?PLAYER_PRESSURE_CHOICES:PRESSURE_CHOICES; const fn=state.kind==='player'?'playerChoosePressure':'coachChoosePressure'; return `<div class="card event-card"><div class="ico">🌡️</div><h2 class="display">${state.kind==='player'?'Craquage':'Crise de pression'}</h2><p class="narr">La pression atteint ${Math.round(state.pressure)}/100. Insomnies, malaise, une famille inquiète. Il faut décider.</p><div class="choice-list">${list.map((c,i)=>`<button class="choice-btn" onclick="${fn}(${i})"><span class="ico">${c.icon}</span><div class="body"><b>${c.label}</b><small>${c.sub}</small></div></button>`).join('')}</div></div>`; }
function tableHTML(table,me,full){
  const N=table.length, meIdx=table.findIndex(r=>r.name===me);
  const keep=full?new Set(table.map((_,i)=>i)):new Set([0,1,2,3,N-1,N-2,N-3,meIdx-1,meIdx,meIdx+1].filter(i=>i>=0&&i<N));
  let rows='',gap=false; table.forEach((r,i)=>{ if(keep.has(i)){ rows+=`<tr class="${r.name===me?'me':''}"><td>${i+1}</td><td>${escapeHtml(r.name)}</td><td class="r">${r.w}-${r.d}-${r.l}</td><td class="r">${r.gf-r.ga>0?'+':''}${r.gf-r.ga}</td><td class="r">${r.pts}</td></tr>`; gap=false; } else if(!gap){ rows+='<tr><td colspan="5" style="color:var(--muted)">…</td></tr>'; gap=true; } });
  return `<table class="table"><thead><tr><th>#</th><th>Club</th><th class="r">V-N-D</th><th class="r">Diff</th><th class="r">Pts</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function phaseTrack(){ return `<div class="phase-track">${['Automne','Hiver','Printemps','Sprint final'].map((l,i)=>`<span class="${i<state.phase?'done':i===state.phase?'now':''}">${l}</span>`).join('')}</div>`; }
function matchesHTML(mine,me){ return `<div class="matches">${mine.map(m=>`<div class="match ${m.res}" title="${escapeHtml(m.story||'')}"><div class="line"><span>${m.home===me?'<b>'+escapeHtml(m.home)+'</b>':escapeHtml(m.home)}</span><span class="sc">${m.gh} – ${m.ga}</span><span>${m.away===me?'<b>'+escapeHtml(m.away)+'</b>':escapeHtml(m.away)}</span></div>${m.scorers||m.mine?`<div class="sub">${escapeHtml(m.mine||m.scorers)}</div>`:''}</div>`).join('')}</div>`; }

/* ---------- Écrans entraîneur·euse ---------- */
function renderOffers(){
  const offers=state.currentOffers||[];
  if(!offers.length) return `<div class="card"><h2 class="display">Aucune proposition</h2><p class="narr">Le téléphone reste silencieux cette année. Ta réputation (${Math.round(state.stats.reputation)}) ne suffit plus, ou le marché est saturé.</p><div class="btn-row"><button class="btn" onclick="coachSkipYear()">Attendre une année</button></div></div>`;
  const stay=offers.find(o=>o.stay); const under=stay&&stay.underContract; const cote=Math.round(state.cote==null?30:state.cote);
  const fate=state.rouletteFate;
  if(fate&&fate.kind==='exclusive') return `<div class="card"><h2 class="display">${fate.icon} ${escapeHtml(fate.label)}</h2><p class="narr">${escapeHtml(fate.text)}</p><p class="hint">${state.year} · ${state.age} ans. ${fate.installed?`${escapeHtml(state.club?state.club.name:'')} : aucune autre proposition ne t'atteindra, il ne reste qu'à repartir pour une saison.`:"Le propriétaire a racheté ton contrat. Signe, et ce sera pour toujours."}</p>
    <div class="offer-grid">${offers.map((o,i)=>`<div class="offer-card affordable poach" onclick="coachAcceptOffer(${i});render()"><div class="club">${TIER_INFO[o.tier].icon} ${TIER_INFO[o.tier].label} · lié à vie</div><h3>${escapeHtml(o.club)}</h3><div class="syn narr">${escapeHtml(o.title)}. ${capitalize(o.presidentName)} : ${escapeHtml(o.presidentDesc)}</div>
      <div class="meta"><span class="tag gold">${escapeHtml(o.leagueName)}</span><span class="tag">Objectif : ${ordinal(o.objectivePos)} / ${o.teams}</span><span class="tag">${styleById(o.styleWanted).icon} ${styleById(o.styleWanted).name} demandé</span></div>
      <div class="budget">Budget transferts : ${$(o.budget)}</div><div class="offer-hint good">⛓️ Une saison de plus, au même endroit</div></div>`).join('')}</div></div>`;
  return `<div class="card"><h2 class="display">${under?'Intersaison sous contrat':'Les bancs qui te tendent les bras'}</h2><p class="hint">${state.year} · ${state.age} ans · cote ${cote} : ${coteLabel(coachTargetStrength())}.${fate?` ${fate.icon} ${escapeHtml(fate.label)} : ${escapeHtml(fate.text)}`:''} ${under?`${state.club.contractEnd>=9999?'Ton contrat te lie à vie.':`Ton contrat court jusqu'en ${state.club.contractEnd}.`} ${offers.length>1?'Un club vient te chercher : à toi de voir.':'Personne ne vient te chercher cette année.'}`:'Les offres arrivent autour de ta cote : un cran au-dessus si tu as performé, en dessous après un échec.'}</p>
    <div class="offer-grid">${offers.map((o,i)=>`<div class="offer-card affordable ${o.poach?'poach':''}" onclick="coachAcceptOffer(${i});render()"><div class="club">${TIER_INFO[o.tier].icon} ${TIER_INFO[o.tier].label}${o.stay?(o.underContract?' · sous contrat':' · prolonger'):o.poach?' · vient te chercher':''}</div><h3>${escapeHtml(o.club)}</h3><div class="syn narr">${escapeHtml(o.title)}. ${capitalize(o.presidentName)} : ${escapeHtml(o.presidentDesc)}</div>
      <div class="meta"><span class="tag gold">${escapeHtml(o.leagueName)}</span><span class="tag">Objectif : ${ordinal(o.objectivePos)} / ${o.teams}</span><span class="tag">${styleById(o.styleWanted).icon} ${styleById(o.styleWanted).name} demandé</span><span class="tag">Force ${'★'.repeat(Math.max(1,o.s||1))} · ${gapLabel(o.gap||0)}</span><span class="tag">${o.stay&&o.underContract?`${o.duration} an${o.duration>1?'s':''} restant${o.duration>1?'s':''}`:`contrat ${o.duration} an${o.duration>1?'s':''}`}</span></div>
      <div class="budget">Budget transferts : ${$(o.budget)}</div><div class="offer-hint ${o.stay||o.poach?'good':o.styleWanted===state.favoriteStyleId?'good':''}">${o.stay?(o.underContract?'🏠 Tu honores ton contrat : continuité du projet':'🏠 Le président te garde et prolonge'):o.poach?'🎯 Un projet plus grand qui paie la clause':o.styleWanted===state.favoriteStyleId?'❤️ Le club veut ton style de jeu':o.tier==='amateur'||o.tier==='ligue2'?'🌱 Petit budget, présidents plus patients':'🎯 Objectif exigeant, moyens à la hauteur'}</div></div>`).join('')}</div>
    <div class="btn-row">${under?'<button class="btn secondary" onclick="if(confirm(\'Rompre ton contrat ? Réputation −4, cote −3.\')) coachBreakContract()">Rompre le contrat et écouter le marché</button>':''}<button class="btn secondary" onclick="coachSkipYear()">Refuser tout et prendre une année sabbatique</button></div></div>`;
}
function renderMercato(){
  const m=state.market, c=state.club, y=state.year; const wages=state.squad.reduce((n,p)=>n+p.wage,0); const fmax=eraForeignersMax(y); const xi=bestXI(state.squad,FORMATIONS[state.formation],y);
  const kinds={all:'Tous',real:'Stars',pro:'Pros',youth:'Pépites',free:'Libres',academy:'Centre'};
  const list=m.targets.map((t,i)=>({t,i})).filter(x=>marketFilter==='all'||x.t.kind===marketFilter);
  const rowHTML=(p,inXI)=>`<tr class="${inXI?'xi':''} ${p.injury?'inj':''}"><td><span class="pos-badge pos-${p.pos}">${p.pos}</span></td><td class="${p.real?'real':''}">${escapeHtml(p.name)}${p.fanFav?' ❤️':''}${p.promised?' ⭐':''}${p.injury?` 🩼${p.injury}s`:''}</td><td>${playerAge(p,y)}</td><td><b>${playerRating(p,y)}</b> ${stars(playerRating(p,y))}</td><td>${traitLabel(p.trait)}</td><td>${p.contractEnd}</td><td class="r">${$(p.wage)}</td><td class="r">${$(playerValue(p,y))}</td><td class="r"><button class="btn secondary" onclick="coachSell(${p.id})">Vendre</button></td></tr>`;
  return `<div class="card"><h2 class="display">${m.winter?'Mercato d\'hiver':'Mercato d\'été'} · ${escapeHtml(c.name)}</h2><p class="hint">Vends, recrute, promeus. Les prix dépendent de l'époque (${eraForYear(y).name}). Les pépites viennent parfois d'une vidéo, d'un cousin ou d'un agent inconnu : certaines sont des arnaques. Un joueur hors de portée ne répond pas ; un « gros coup » coûte cher et exige une place de titulaire (⭐).</p>
    <div class="mercato-head"><div>Budget restant<b>${$(m.budgetLeft)}</b></div><div class="${wages>c.wageCap*1.1?'warn-box':''}">Masse salariale<b>${$(wages)}</b>plafond ${$(c.wageCap)}</div><div>Effectif<b>${state.squad.length} / 27</b></div>${c.nat==='FR'&&fmax<99?`<div class="${foreignCount()>=fmax?'warn-box':''}">Étrangers<b>${foreignCount()} / ${fmax}</b></div>`:''}<div>Onze type<b>${(xi.reduce((n,p)=>n+playerRating(p,y),0)/Math.max(1,xi.length)).toFixed(1)}</b>force club ${c.strength}</div><div>Crédibilité<b>${Math.round(coachCredibility())}</b>niveau max accessible</div></div>
    ${m.message?`<div class="msg">${escapeHtml(m.message)}</div>`:''}
    <div class="section-label">Ton effectif (onze type surligné)</div><div style="overflow-x:auto"><table class="squad-table"><thead><tr><th></th><th>Joueur</th><th>Âge</th><th>Niveau</th><th>Caractère</th><th>Fin</th><th class="r">Salaire</th><th class="r">Valeur</th><th></th></tr></thead><tbody>${['G','D','M','A'].map(pos=>state.squad.filter(p=>p.pos===pos).sort((a,b)=>playerRating(b,y)-playerRating(a,y)).map(p=>rowHTML(p,xi.includes(p))).join('')).join('')}</tbody></table></div>
    <div class="section-label">Le marché</div><div class="market-tabs">${Object.entries(kinds).map(([k,l])=>`<button class="${marketFilter===k?'on':''}" onclick="marketFilter='${k}';render()">${l} (${k==='all'?m.targets.length:m.targets.filter(t=>t.kind===k).length})</button>`).join('')}</div>
    <div class="market-list">${list.map(({t,i})=>`<div class="market-row ${t.access} ${t.kind}"><div><span class="lbl">${t.label}</span> · <span class="pos-badge pos-${t.p.pos}">${t.p.pos}</span> <b class="${t.p.real?'real':''}">${escapeHtml(t.p.name)}</b> · ${t.age} ans · niveau ${t.kind==='youth'?'≈ '+t.shownRating+' (potentiel inconnu)':t.shownRating+' '+stars(t.shownRating)} · ${traitLabel(t.p.trait)}<div class="meta">Via ${t.source} · prix ${t.price>0?$(t.price):'libre'} · salaire ${$(t.wage)} / an${t.access==='coup'?' · exige d\'être titulaire':''}${t.access==='no'?' · ne répond pas':''}</div></div><button class="btn ${t.access==='no'?'secondary':''}" ${t.access==='no'?'disabled':''} onclick="coachBuy(${i})">Recruter</button></div>`).join('')||'<div class="hint">Rien dans cette catégorie.</div>'}</div>
    ${m.bought.length||m.sold.length?`<div class="section-label">Bilan du mercato</div><div class="hint">${m.bought.map(b=>`➕ ${escapeHtml(b.name)} (${$(b.price)})`).join(' · ')}${m.bought.length&&m.sold.length?' · ':''}${m.sold.map(s=>`➖ ${escapeHtml(s.name)} (${$(s.price)})`).join(' · ')}</div>`:''}
    <div class="btn-row"><button class="btn" onclick="coachCloseMercato()">Clore le mercato →</button></div></div>`;
}
function renderTactic(){
  if(!tacticSel||tacticSel.year!==state.year||tacticSel.club!==state.club.name) tacticSel={formation:state.formation,style:state.styleId,year:state.year,club:state.club.name};
  const c=state.club, notes=state.market&&state.market.closingNotes||[];
  const y=state.year; const xi=bestXI(state.squad,FORMATIONS[tacticSel.formation],y);
  return `<div class="card">${notes.length?`<div class="section-label">Révélations du mercato</div>${notes.map(n=>`<div class="warn">${n}</div>`).join('')}`:''}<h2 class="display">Plan de jeu</h2><p class="hint">Le club demande <b>${styleById(c.styleWanted).icon} ${styleById(c.styleWanted).name}</b> (+2 de force si tu le suis). Ton style favori (${styleById(state.favoriteStyleId).icon} ${styleById(state.favoriteStyleId).name}) donne +1,5. Un style prestigieux exige de la tactique (${Math.round(state.stats.talent)}).</p>
    <div class="section-label">Formation</div><div class="formation-grid">${Object.keys(FORMATIONS).map(f=>`<button class="${tacticSel.formation===f?'on':''}" onclick="tacticSel.formation='${f}';render()"><b>${f}</b></button>`).join('')}</div>
    <div class="section-label">Style</div><div class="style-grid">${STYLES.map(s=>`<button class="${tacticSel.style===s.id?'on':''}" onclick="tacticSel.style='${s.id}';render()"><b>${s.icon} ${s.name}</b><small>${s.desc}${s.id===c.styleWanted?' · <b>demandé par le club</b>':''}${s.id===state.favoriteStyleId?' · <b>ton style</b>':''}${s.prestige*60>state.stats.talent?` · exige tactique ${Math.round(s.prestige*60)}`:''}</small></button>`).join('')}</div>
    <div class="section-label">Onze type en ${tacticSel.formation}</div><div class="squad">${xi.map(p=>`<div><span class="pos-badge pos-${p.pos}">${p.pos}</span> ${escapeHtml(p.name)} <span>${playerRating(p,y)}</span></div>`).join('')}</div>
    <div class="btn-row"><button class="btn" onclick="coachSetTactic(tacticSel.formation,tacticSel.style);render()">${state.tacticAfterWinter?'Reprendre la saison →':'Lancer la saison →'}</button></div></div>`;
}
function impactLines(){
  const c=state.club, g=state.gauges, lines=[]; const xi=bestXI(state.squad,FORMATIONS[state.formation],state.year); const xiAvg=xi.reduce((n,p)=>n+playerRating(p,state.year),0)/Math.max(1,xi.length);
  lines.push({t:`Onze type à ${xiAvg.toFixed(1)} contre une force de club attendue de ${c.strength}`,d:xiAvg-c.strength});
  lines.push({t:`Vestiaire ${Math.round(g.vestiaire)} : ${g.vestiaire>=60?'un groupe soudé qui tire tout le monde vers le haut':g.vestiaire<40?'un groupe fracturé qui coûte des points':'un groupe correct, sans plus'}`,d:(g.vestiaire-50)*.05});
  lines.push({t:`Style ${styleById(state.styleId).name} : ${state.styleId===c.styleWanted?'exactement ce que le club voulait':'pas celui que le club demandait'}${state.styleId===state.favoriteStyleId?', et ton style favori':''}`,d:(state.styleId===c.styleWanted?2:0)+(state.styleId===state.favoriteStyleId?1.5:0)-(state.styleId!==c.styleWanted?.5:0)});
  lines.push({t:`Tactique ${Math.round(state.stats.talent)} : ${state.stats.talent>=55?'tes idées font gagner des matchs':'tes idées sont encore un peu courtes'}`,d:(state.stats.talent-50)*.08});
  const inj=state.squad.filter(p=>p.injury).length; if(inj) lines.push({t:`${inj} blessé${inj>1?'s':''} (staff ${Math.round(g.staff)})`,d:-inj*.6});
  if(state.seasonStats&&Math.abs(state.seasonStats.form)>=1) lines.push({t:`Dynamique ${state.seasonStats.form>0?'positive':'négative'} (${state.seasonStats.form>0?'+':''}${state.seasonStats.form.toFixed(1)})`,d:state.seasonStats.form});
  return `<div class="impact">${lines.map(l=>`<div class="${l.d>=.5?'up':l.d<=-.5?'down':''}">${l.d>=.5?'▲':l.d<=-.5?'▼':'•'} ${escapeHtml(l.t)}</div>`).join('')}</div>`;
}
function renderPhaseResult(){
  const ph=state.lastPhase, c=state.club, N=state.comp.teams.length;
  const conf=c.confidence; const gap=c.objectivePos-ph.pos;
  return `<div class="card"><h2 class="display">Phase ${ph.n} · ${escapeHtml(c.leagueName)}</h2>${phaseTrack()}
    <div class="score-grid"><div class="score-box gold"><div class="v">${ordinal(ph.pos)}</div><div class="k">sur ${N} · objectif ${ordinal(c.objectivePos)}</div></div><div class="score-box ${ph.W>ph.L?'good':ph.L>ph.W?'bad':''}"><div class="v">${ph.W}-${ph.D}-${ph.L}</div><div class="k">V-N-D · ${ph.gf} buts pour, ${ph.ga} contre</div></div><div class="score-box ${ph.dConf>=0?'good':'bad'}"><div class="v">${ph.dConf>=0?'+':''}${ph.dConf}</div><div class="k">Confiance du président → ${Math.round(conf)}</div></div><div class="score-box"><div class="v">${ph.strength}</div><div class="k">Force de l'équipe</div></div></div>
    <div class="section-label">Tes matchs</div>${matchesHTML(ph.matches,c.name)}
    ${ph.injuries.length?`<div class="warn">🩼 Blessures : ${ph.injuries.map(escapeHtml).join(', ')}</div>`:''}
    <div class="section-label">Pourquoi ce résultat</div>${impactLines()}
    <div class="section-label">Le président</div><div class="hint">${gap>=2?`Tu es ${gap} place${gap>1?'s':''} au-dessus de l'objectif : ${c.presidentName} savoure.`:gap>=0?`Tu tiens l'objectif. ${capitalize(c.presidentName)} reste calme.`:gap>=-3?`Tu es ${-gap} place${gap<-1?'s':''} sous l'objectif. ${capitalize(c.presidentName)} s'impatiente.`:`Tu es loin de l'objectif (${-gap} places). ${capitalize(c.presidentName)} pense à ton successeur.`}${conf<=20?' <b>Le prochain faux pas sera le dernier.</b>':''}</div>
    <div class="section-label">Classement</div>${tableHTML(ph.table,c.name,true)}
    <div class="btn-row"><button class="btn" onclick="coachAfterPhase()">${state.phase>=4?'Bilan de la saison →':state.phase===2&&eraHasWinterMercato(state.year)?'Mercato d\'hiver →':'Phase suivante →'}</button></div></div>`;
}
function cupPathHTML(path,label){ return `<div class="cup-path"><b>${label}</b><br>${path.map(r=>`Tour ${r.round} : ${r.gh}–${r.ga}${r.pen?' (t.a.b.)':''} contre ${escapeHtml(r.opp)} ${r.win?'✅':'❌'}`).join('<br>')}</div>`; }
function renderSeasonEnd(){
  const f=state.lastSeason, c=state.club;
  const icon=f.champion?'🏆':f.euro&&f.euro.won?'⭐':f.relegated?'⬇️':f.objectiveMet?'✅':'❌';
  const verdict=f.champion?(f.promotion?'Montée !':'Champion·ne !'):f.relegated?'Relégation':f.objectiveMet?'Objectif atteint':'Objectif manqué';
  const kept=c.confidence>=35;
  return `<div class="card"><div class="result-hero"><span class="result-hero-icon">${icon}</span><h2 class="display">${escapeHtml(f.club)} · ${f.year}-${f.year+1}</h2><div class="verdict">${verdict} · ${ordinal(f.pos)} sur ${f.teams} en ${escapeHtml(f.league)} · objectif ${ordinal(f.objective)}</div></div>
    <div class="score-grid"><div class="score-box gold"><div class="v">${ordinal(f.pos)}</div><div class="k">Classement</div></div><div class="score-box"><div class="v">${f.goals} / ${f.conceded}</div><div class="k">Buts pour / contre</div></div><div class="score-box ${f.cupWon?'good':''}"><div class="v">${f.cupWon?'🥇':f.cupRounds}</div><div class="k">${f.cupWon?'Coupe gagnée':'Tour atteint en coupe'}</div></div><div class="score-box ${f.dConf>=0?'good':'bad'}"><div class="v">${f.dConf>=0?'+':''}${f.dConf}</div><div class="k">Confiance → ${f.confidence}</div></div></div>
    ${f.award?`<div class="trophy-line">🎖️ ${f.award}</div>`:''}${f.euro?`<div class="trophy-line">${f.euro.won?'⭐ Vainqueur de la '+escapeHtml(f.euro.name):'🌍 '+escapeHtml(f.euro.name)+' : éliminé au tour '+f.euro.rounds}</div>`:''}${f.topScorer?`<div class="hint">Meilleur buteur : ${escapeHtml(f.topScorer)}${f.bestPlayer?` · Joueur de la saison : ${escapeHtml(f.bestPlayer)}`:''} · ${f.formation} · ${escapeHtml(f.style)}</div>`:''}
    <div class="two-cols"><div><div class="section-label">Classement final</div>${tableHTML(f.table,f.club,false)}</div><div><div class="section-label">Parcours en coupe</div>${cupPathHTML(f.cupPath,'Coupe nationale')}${f.euro?cupPathHTML(f.euro.path,f.euro.name):''}</div></div>
    ${f.devNotes.length?`<div class="section-label">Progressions</div><div class="hint">${f.devNotes.map(escapeHtml).join('<br>')}</div>`:''}
    ${f.contracts.length?`<div class="section-label">Contrats</div><div class="hint">${f.contracts.map(escapeHtml).join(' · ')}</div>`:''}
    <div class="punchline narr">${pick(f.champion?PUNCHLINES.champion:f.relegated?PUNCHLINES.relegated:f.objectiveMet?PUNCHLINES.hit:f.pos>f.teams*.7?PUNCHLINES.flop:PUNCHLINES.mid)}</div>
    ${f.cote?`<div class="section-label">Ta cote</div><div class="hint"><b>${f.cote.before} → ${f.cote.after}</b> · ${f.cote.why.map(escapeHtml).join(' · ')||'saison neutre'}. Tu vaux désormais ${escapeHtml(f.cote.level)}.</div>`:''}
    <div class="section-label">Le verdict du président</div><div class="${kept?'milestone':'warn'}">${kept?(c.contractEnd>state.year?`${capitalize(c.presidentName)} te garde (confiance ${Math.round(c.confidence)}/100) : ${c.contractEnd>=9999?'la clause te lie à ce club à vie':`ton contrat court jusqu'en ${c.contractEnd}`}. Seul un club plus ambitieux pourrait venir te chercher.`:`${capitalize(c.presidentName)} te renouvelle sa confiance (${Math.round(c.confidence)}/100) et propose de prolonger. D'autres bancs t'attendront aussi.`):`${capitalize(c.presidentName)} ne te renouvelle pas sa confiance (${Math.round(c.confidence)}/100). Il faudra trouver un autre banc.`}</div>
    <div class="btn-row"><button class="btn" onclick="coachAfterSeasonEnd()">Intersaison →</button></div></div>`;
}
function renderSacked(){ const h=state.history[state.history.length-1]; return `<div class="card"><div class="result-hero"><span class="result-hero-icon">🪓</span><h2 class="display">Licencié·e</h2><div class="verdict">${escapeHtml(h.club)} · après la phase ${h.phase} · ${ordinal(h.pos)} pour un objectif de ${ordinal(h.objective)}</div></div><p class="narr">La confiance du président est tombée à zéro. Le communiqué tient en trois lignes, ton bureau est vidé avant midi. Ta réputation en prend un coup, ton téléphone continuera de sonner… un peu moins fort.</p><div class="btn-row"><button class="btn" onclick="coachIntersaison();render()">Continuer →</button></div></div>`; }
function seasonLine(f,i){ const badge=f.sacked?'🪓':f.champion?'🏆':f.relegated?'⬇️':f.objectiveMet?'✅':'❌'; return `<div class="season-line"><span><span class="pos">${badge} ${f.pos?ordinal(f.pos):'—'}</span> ${f.year} · ${escapeHtml(f.club)} · ${escapeHtml(f.league)}</span><span>${f.sacked?'licencié·e phase '+f.phase:(f.cupWon?'🥇 ':'')+(f.euro&&f.euro.won?'⭐ ':'')+(f.award?'🎖️ ':'')+(f.topScorer?escapeHtml(f.topScorer):'')}</span></div>`; }
/* Ce qu'il reste quand le football s'arrête : la contrepartie de tous les arbitrages. */
function lifeVerdict(v,player){
  if(v>=72) return {cls:'milestone',text:player?"Tu as gardé les tiens à côté de toi. Le vestiaire s'oublie, eux sont restés."
    :"Tu as tenu les deux bouts : une carrière, et des gens qui t'attendaient encore à la maison le soir du dernier match."};
  if(v>=45) return {cls:'punchline',text:player?"Ta vie d'à côté a tenu, sans jamais passer en premier."
    :"Ta vie d'à côté a survécu aux déménagements, un peu abîmée, jamais tout à fait prioritaire."};
  if(v>=22) return {cls:'punchline',text:player?"Beaucoup de monde autour de toi, peu de gens vraiment proches."
    :"Tu as beaucoup donné au football. Ceux qui t'attendaient ont fini par ne plus attendre."};
  return {cls:'warn',text:player?"Personne au bout du couloir après le dernier match. Le football aura tout pris."
    :"Le dernier vestiaire refermé, il n'y a personne au bout du couloir. Le football aura tout pris, et tu l'as laissé faire."};
}
function renderCoachEnd(){
  const t=state.titles, newB=[...new Set(state.newBadges||[])].map(id=>TROPHY_MAP[id]).filter(Boolean);
  const life=lifeVerdict(state.gauges.proches==null?50:state.gauges.proches,false);
  app.innerHTML=`<div class="fade-in"><div class="card"><div class="result-hero"><span class="result-hero-icon">${state.endingCause==='death'||state.endingCause==='roulette'?'⚰️':'🏁'}</span><h2 class="display">${escapeHtml(state.name)} — ${coachEpithet()}</h2><div class="verdict">${state.modeIcon} ${state.modeName} · ${state.startYear||ERAS.find(e=>e.id===state.startEra).name} → ${state.year} · fin à ${state.age} ans · score ${coachScore()}</div></div><p class="narr">${escapeHtml(state.endingText)}</p>
    <div class="score-grid"><div class="score-box gold"><div class="v">${state.history.filter(h=>!h.sacked).length}</div><div class="k">Saisons complètes</div></div><div class="score-box good"><div class="v">${t.league+t.promo}</div><div class="k">Titres et montées</div></div><div class="score-box good"><div class="v">${t.cup+t.euro+t.euro2}</div><div class="k">Coupes</div></div><div class="score-box gold"><div class="v">${state.awards}</div><div class="k">Récompenses</div></div><div class="score-box"><div class="v">${state.clubsCoached.length}</div><div class="k">Clubs</div></div><div class="score-box bad"><div class="v">${state.sackings}</div><div class="k">Licenciements</div></div></div>
    <div class="section-label">Ce qu'il en reste</div><div class="${life.cls}">🏡 ${life.text} <span class="hint">Proches ${Math.round(state.gauges.proches==null?50:state.gauges.proches)}/100.</span></div>
    ${newB.length?`<div class="section-label">Badges débloqués</div><div class="badge-grid">${newB.map(b=>`<div class="badge"><span class="ico">${b.icon}</span><div><b>${b.label}</b><small>${b.cat}</small></div></div>`).join('')}</div>`:''}
    <div class="section-label">Toutes les saisons</div>${state.history.map(seasonLine).join('')||'<div class="hint">Aucune saison.</div>'}
    <div class="btn-row"><button class="btn" onclick="state=null;startCoachCreation()">Nouvelle carrière</button><button class="btn secondary" onclick="state=null;renderStart()">Accueil</button></div></div></div>`; scrollTop();
}

/* ---------- Écrans joueur·euse ---------- */
function playerSidebar(){
  const s=state.stats,g=state.gauges,c=state.club;
  return `<div class="card"><div class="identity"><b>${escapeHtml(state.name)}</b> · ${pAge()} ans · ${state.posIcon} ${state.posName}<br>${c?`🏟️ <b>${escapeHtml(c.name)}</b> · ${escapeHtml(c.leagueName||'')} · ${ROLES[c.role].name} · coach ${escapeHtml(c.coach)}`:'Sans club'}</div>
    ${c?`<div class="section-label">Confiance du coach</div><div class="conf-big ${state.coachTrust<25?'pressure-state bad':state.coachTrust<50?'pressure-state mid':''}">${Math.round(state.coachTrust)} / 100</div><div class="bar"><i style="width:${state.coachTrust}%"></i></div><div class="hint">Décide ton temps de jeu. Concurrents au poste : ${state.squad.filter(p=>p.pos===state.pos).map(p=>`${escapeHtml(p.name)} (${playerRating(p,state.year)})`).join(', ')||'aucun'}</div>`:''}
    <div class="section-label">Toi · note ${pRating().toFixed(1)}</div>${Object.keys(PSTAT).map(k=>bar(PSTAT[k],s[k])).join('')}${bar('Forme',state.forme)}${bar('Pression',state.pressure,'pressure')}
    ${fateHTML()}
    <div class="hint">Ton agent vise ${coteLabel(playerTargetStrength())}${c&&c.contractEnd?` · contrat jusqu'en ${c.contractEnd}`:''}</div>
    ${c?tempoSelectHTML():''}
    <div class="section-label">Ta vie</div>${Object.keys(PGAUGE).map(k=>gaugeRow(PGAUGE[k],g[k])).join('')}
    <div class="section-label">Totaux</div><div class="hint">${state.totals.apps} matchs · ${state.totals.goals} buts · ${state.totals.assists} passes · 🏆 ${state.totals.titles} · 🥇 ${state.totals.cups} · ⭐ ${state.totals.euros} · 🇫🇷 ${state.totals.caps} sél. (${state.totals.capGoals} buts) · 🏅 ${state.totals.ballons} · 👞 ${state.totals.boots}<br>Gains cumulés : ${$(state.totals.earned)}</div></div>
    <div class="card"><div class="section-label">Journal</div><div class="log">${state.log.slice(0,30).map(l=>`<div><span class="age">${l.year}</span>${l.msg}</div>`).join('')}</div></div>
    <div class="card"><div class="btn-row"><button class="btn secondary small" onclick="goHomeFromGame()">Accueil (sauvegarde)</button><button class="btn danger small" onclick="if(confirm('Raccrocher les crampons ?')){playerEnd('Tu décides de raccrocher les crampons.','retire');render();}">Retraite</button></div></div>`;
}
function renderPOffers(){
  const offers=state.currentOffers||[];
  if(!offers.length) return `<div class="card"><h2 class="display">Aucune proposition</h2><p class="narr">Ton agent ne répond plus. Le marché t'a oublié·e cette année.</p><div class="btn-row"><button class="btn" onclick="playerSkipYear()">Attendre une année</button></div></div>`;
  const stay=offers.find(o=>o.stay); const under=stay&&stay.underContract;
  return `<div class="card"><h2 class="display">${under?'Intersaison sous contrat':'Ton agent a des propositions'}</h2><p class="hint">${state.year} · ${pAge()} ans · note ${pRating().toFixed(1)} · ton agent vise ${coteLabel(playerTargetStrength())}. ${under?`Ton contrat court jusqu'en ${state.club.contractEnd}. ${offers.length>1?'Un club vient te chercher.':'Aucun club ne s\'est manifesté cette année.'}`:'Le rôle promis pèse sur ton temps de jeu, ta progression et ta pression.'}</p>
    <div class="offer-grid">${offers.map((o,i)=>`<div class="offer-card affordable ${o.poach?'poach':''}" onclick="playerAcceptOffer(${i});render()"><div class="club">${TIER_INFO[o.tier].icon} ${TIER_INFO[o.tier].label}${o.stay?(o.underContract?' · sous contrat':' · prolonger'):o.poach?' · vient te chercher':''}</div><h3>${escapeHtml(o.club)}</h3><div class="meta"><span class="tag gold">${escapeHtml(o.leagueName)}</span><span class="tag">${ROLES[o.role].name}</span><span class="tag">${o.stay&&o.underContract?`${o.duration} an${o.duration>1?'s':''} restant${o.duration>1?'s':''}`:`${o.duration} an${o.duration>1?'s':''}`}</span><span class="tag">Force ${'★'.repeat(Math.max(1,o.s||1))} · ${gapLabel(o.gap||0)}</span></div><div class="budget">${$(o.salary)} / saison</div><div class="offer-hint">Coach : ${escapeHtml(o.coach)} · ${o.role==='titulaire'?'⭐ Temps de jeu garanti, pression maximale':o.role==='rotation'?'🔄 Du temps de jeu à gagner':'🪑 Peu de matchs, progression lente'}</div></div>`).join('')}</div>
    <div class="btn-row">${under?'<button class="btn secondary" onclick="if(confirm(\'Demander ton transfert ? Supporters −6, entourage −3.\')) playerBreakContract()">Demander un transfert</button>':''}<button class="btn secondary" onclick="playerSkipYear()">Refuser tout et attendre une année</button></div></div>`;
}
function renderPPhaseResult(){
  const ph=state.lastPhase, c=state.club, N=state.comp.teams.length;
  return `<div class="card"><h2 class="display">Phase ${ph.n} · ${escapeHtml(c.leagueName)}</h2>${phaseTrack()}
    <div class="score-grid"><div class="score-box gold"><div class="v">${ph.apps}</div><div class="k">matchs joués (${Math.round(ph.share*100)} % du temps)${ph.motm?` · ⭐ ${ph.motm}`:''}</div></div><div class="score-box good"><div class="v">${ph.goals} / ${ph.assists}</div><div class="k">buts / passes</div></div><div class="score-box ${!ph.apps?'':ph.note>=6.8?'good':ph.note<5.8?'bad':''}"><div class="v">${ph.apps?ph.note.toFixed(1):'—'}</div><div class="k">note moyenne</div></div><div class="score-box ${ph.dTrust>=0?'good':'bad'}"><div class="v">${ph.dTrust>=0?'+':''}${ph.dTrust}</div><div class="k">confiance du coach → ${Math.round(state.coachTrust)}</div></div><div class="score-box"><div class="v">${ordinal(ph.pos)}</div><div class="k">${escapeHtml(c.name)} sur ${N}</div></div></div>
    ${ph.injury?`<div class="warn">🩼 Blessure : ${ph.injury}</div>`:''}
    <div class="section-label">Les matchs de ${escapeHtml(c.name)}</div>${matchesHTML(ph.matches,c.name)}
    <div class="section-label">Classement</div>${tableHTML(ph.table,c.name,false)}
    <div class="btn-row"><button class="btn" onclick="playerAfterPhase()">${state.phase>=4?'Bilan de la saison →':'Phase suivante →'}</button></div></div>`;
}
function renderPSeasonEnd(){
  const f=state.lastSeason;
  const lines=[]; if(f.champion) lines.push(`🏆 Champion·ne avec ${escapeHtml(f.club)}`); if(f.cupWon) lines.push('🥇 Vainqueur de la coupe'); if(f.euro) lines.push(f.euro.won?`⭐ Vainqueur de la ${escapeHtml(f.euro.name)}`:`🌍 ${escapeHtml(f.euro.name)} : tour ${f.euro.rounds}`); if(f.selected) lines.push(`🇫🇷 Sélection nationale : ${f.caps} capes, ${f.capGoals} but${f.capGoals>1?'s':''}`); if(f.ballon) lines.push("🏅 Ballon d'or"); if(f.boot) lines.push('👞 Soulier d\'or'); if(f.relegated) lines.push('⬇️ Le club est relégué');
  return `<div class="card"><div class="result-hero"><span class="result-hero-icon">${f.ballon?'🏅':f.champion?'🏆':f.bad?'🥶':f.note>=6.8?'🔥':'📊'}</span><h2 class="display">${escapeHtml(f.club)} · ${f.year}-${f.year+1}</h2><div class="verdict">${ROLES[f.role].name} · note ${f.note.toFixed(2)} · ${ordinal(f.pos)} sur ${f.teams} en ${escapeHtml(f.league)}</div></div>
    <div class="score-grid"><div class="score-box gold"><div class="v">${f.apps}</div><div class="k">Matchs</div></div><div class="score-box good"><div class="v">${f.goals}</div><div class="k">Buts</div></div><div class="score-box good"><div class="v">${f.assists}</div><div class="k">Passes</div></div><div class="score-box"><div class="v">${Math.round(f.share*100)} %</div><div class="k">Temps de jeu</div></div><div class="score-box gold"><div class="v">${$(f.salary)}</div><div class="k">Salaire</div></div></div>
    ${lines.map(l=>`<div class="trophy-line">${l}</div>`).join('')}
    <div class="section-label">Classement final</div>${tableHTML(f.table,f.club,false)}
    <div class="btn-row"><button class="btn" onclick="playerAfterSeasonEnd()">Intersaison →</button></div></div>`;
}
function renderPlayerEnd(){
  const t=state.totals, newB=[...new Set(state.newBadges||[])].map(id=>TROPHY_MAP[id]).filter(Boolean);
  const life=lifeVerdict(state.gauges.entourage==null?50:state.gauges.entourage,true);
  app.innerHTML=`<div class="fade-in"><div class="card"><div class="result-hero"><span class="result-hero-icon">🎗️</span><h2 class="display">${escapeHtml(state.name)}</h2><div class="verdict">${state.posIcon} ${state.posName} · ${state.startYear||ERAS.find(e=>e.id===state.startEra).name} → ${state.year} · fin à ${pAge()} ans · score ${playerScore()}</div></div><p class="narr">${escapeHtml(state.endingText)}</p>
    <div class="score-grid"><div class="score-box gold"><div class="v">${state.history.length}</div><div class="k">Saisons</div></div><div class="score-box"><div class="v">${t.apps}</div><div class="k">Matchs</div></div><div class="score-box good"><div class="v">${t.goals}</div><div class="k">Buts</div></div><div class="score-box good"><div class="v">${t.assists}</div><div class="k">Passes</div></div><div class="score-box gold"><div class="v">${t.titles+t.cups+t.euros}</div><div class="k">Trophées</div></div><div class="score-box"><div class="v">${t.caps}</div><div class="k">Sélections</div></div><div class="score-box gold"><div class="v">${t.ballons}</div><div class="k">Ballons d'or</div></div><div class="score-box good"><div class="v">${$(t.earned)}</div><div class="k">Gains</div></div></div>
    <div class="section-label">Ce qu'il en reste</div><div class="${life.cls}">🏡 ${life.text} <span class="hint">Entourage ${Math.round(state.gauges.entourage==null?50:state.gauges.entourage)}/100.</span></div>
    ${newB.length?`<div class="section-label">Badges débloqués</div><div class="badge-grid">${newB.map(b=>`<div class="badge"><span class="ico">${b.icon}</span><div><b>${b.label}</b><small>${b.cat}</small></div></div>`).join('')}</div>`:''}
    <div class="section-label">Saisons</div>${state.history.map(f=>`<div class="season-line"><span><span class="pos">${f.ballon?'🏅':f.champion?'🏆':f.note.toFixed(1)}</span> ${f.year} · ${escapeHtml(f.club)} · ${escapeHtml(f.league)}</span><span>${f.apps} m · ${f.goals} b · ${f.assists} p${f.selected?' · 🇫🇷':''}</span></div>`).join('')}
    <div class="btn-row"><button class="btn" onclick="state=null;startPlayerCreation()">Nouvelle carrière</button><button class="btn secondary" onclick="state=null;renderStart()">Accueil</button></div></div></div>`; scrollTop();
}

/* ---------- Badges, panthéon, règles ---------- */
function renderBadges(){ showGameBanner(); filmstripEl.style.display='none'; const cats=[...new Set(TROPHIES.map(t=>t.cat))]; app.innerHTML=`<div class="fade-in"><div class="card"><h2 class="display">Salle des badges</h2><p class="hint">${unlockedTrophies.size} / ${TROPHIES.length} débloqués, toutes carrières confondues.</p>${cats.map(c=>`<div class="badge-cat">${c}</div><div class="badge-grid">${TROPHIES.filter(t=>t.cat===c).map(t=>`<div class="badge ${unlockedTrophies.has(t.id)?'':'locked'}"><span class="ico">${t.icon}</span><div><b>${t.label}</b><small>${unlockedTrophies.has(t.id)?'Débloqué':'Verrouillé'}</small></div></div>`).join('')}</div>`).join('')}<div class="btn-row"><button class="btn secondary" onclick="${state?'render()':'renderStart()'}">Retour</button></div></div></div>`; scrollTop(); }
function renderHall(){ showGameBanner(); filmstripEl.style.display='none'; const h=hallOfFame(); app.innerHTML=`<div class="fade-in"><div class="card"><h2 class="display">Panthéon</h2><div class="hall">${h.length?h.map(e=>`<div><span>${e.kind==='player'?'👟':'🧢'} <b>${escapeHtml(e.name)}</b> · ${escapeHtml(e.mode||'')} · ${escapeHtml(e.era||'')} · ${e.seasons} saisons · ${e.titles} titre${e.titles>1?'s':''} · fin à ${e.age} ans</span><span>score ${e.score}${e.date?` · ${e.date}`:''}</span></div>`).join(''):'<div class="hint">Aucune carrière terminée pour l\'instant.</div>'}</div><div class="btn-row"><button class="btn secondary" onclick="${state?'render()':'renderStart()'}">Retour</button></div></div></div>`; scrollTop(); }
function renderRules(){ showGameBanner(); filmstripEl.style.display='none'; app.innerHTML=`<div class="fade-in"><div class="card rules"><h2 class="display">Comment ça marche</h2>
  <h3>Les époques</h3><ul>${ERAS.map(e=>`<li><b>${e.icon} ${e.name}</b> (${e.start}-${e.end}) : ${e.rules.join(', ')}.</li>`).join('')}<li>Les joueurs réels apparaissent selon leur âge dans l'année en cours. Une carrière longue traverse l'époque suivante.</li></ul>
  <h3>Carrière d'entraîneur·euse</h3><ul><li>Chaque offre fixe un championnat réel, un objectif de classement, un budget de transferts et un président avec son caractère.</li><li>Le mercato est libre : vends, recrute des stars (si ta crédibilité le permet), des pros, des pépites (parfois des arnaques), des joueurs libres ou des jeunes du centre. Un « gros coup » coûte cher et exige une place de titulaire.</li><li>La force de l'équipe vient de ton onze type, du vestiaire, de la cohérence entre ton style et celui que le club demande, de ta tactique et de la dynamique.</li><li><b>Rythme</b> : « Temps forts » (par défaut) ne t'arrête que sur les chocs, les concurrents directs, les matchs de la peur, la reprise de chaque phase, et sur une alerte (blessé ou suspendu dans ton onze, trois défaites de suite, président impatient). Les autres matchs se jouent avec ta compo et apparaissent en résumé. « Complet » joue tout, « Rapide » ne s'arrête qu'à la reprise. Changeable à tout moment dans la barre latérale.</li><li><b>Cote et contrats</b> : ta cote (0-100) résume ce que ta carrière vaut ; les offres arrivent autour d'elle, un cran au-dessus après une bonne saison, en dessous après un échec. Tant que ton contrat court et que le président te garde, tu restes, sauf si un club plus ambitieux vient te chercher. Rompre coûte de la réputation.</li><li>La saison se joue journée par journée, en quatre phases. Avant chaque match : l'adversaire (force, style, forme), ta formation, ton onze, ton banc, ton capitaine, ton approche et l'entraînement de la semaine. Le match se déroule minute par minute (buts, penaltys, cartons, blessures, remplacements), avec une décision à la mi-temps. Chaque joueur reçoit une note. Un bouton simule le reste de la phase avec le onze automatique.</li><li>Fraîcheur : un titulaire perd 10 à 16 points par match selon son âge et en récupère 9 par semaine (plus avec le staff et l'entraînement). Sous 75 %, son niveau baisse et il se blesse plus. Trois avertissements ou un rouge : suspension.</li><li>Styles : contrôle bat pression, pression bat contre, contre bat contrôle, le jeu direct ouvre le match. Le style de l'adversaire est visible avant le coup d'envoi.</li><li><b>Confiance du président</b> : elle monte quand tu dépasses l'objectif, chute quand tu es en dessous ou que la masse salariale explose. À zéro, licenciement immédiat. Sous 35 en fin de saison, pas de prolongation.</li><li>Quatre jauges du club : Vestiaire (force de l'équipe), Supporters (pression et patience), Formation (jeunes, arnaques), Staff (blessures, progression). Une jauge basse déclenche des dilemmes.</li><li>Pression : à 100, une crise impose un choix, dont un à 50 % de risque de mort. Entre 90 et 99, 1 % de risque par intersaison.</li><li>Roulette du destin : après trois saisons, 20 % de chance par intersaison, quatre issues cachées dont une fatale.</li><li>Fin : 75 ans, quatre licenciements d'affilée, deux années sans offre, roulette, pression, retraite.</li></ul>
  <h3>Carrière de joueur·euse</h3><ul><li>Tu rejoins des clubs réels avec un rôle promis. Ton temps de jeu dépend de ta note face aux concurrents à ton poste et de la confiance du coach.</li><li><b>Rythme et contrats</b> : même logique qu'en mode entraîneur·euse. Les temps forts sont les chocs où tu es dans le groupe, les penaltys, une blessure, une place perdue ou retrouvée. Ton agent vise un niveau de club selon ta note, ta dernière saison, la sélection et ton âge ; sous contrat, tu restes sauf si un club vient te chercher ou si tu demandes ton transfert.</li><li>Chaque journée, le coach compose : ta note face aux concurrents, sa confiance, le rôle promis et ta fraîcheur décident si tu es titulaire, sur le banc ou en tribune. Tu vis le match minute par minute avec une note à la fin, et un penalty à tirer ou non quand il se présente.</li><li>Quatre jauges : Corps (à zéro, fin de carrière), Vestiaire, Supporters, Entourage.</li><li>Sélection nationale, Ballon d'or, Soulier d'or, coupes d'Europe. Progression forte avant 25 ans, déclin après 31.</li></ul>
  <div class="btn-row"><button class="btn secondary" onclick="${state?'render()':'renderStart()'}">Retour</button></div></div></div>`; scrollTop(); }

/* ---------- Le match : écrans partagés ---------- */
function formChips(arr){ return `<span class="form-chips">${(arr&&arr.length?arr:[]).map(r=>`<i class="${r}">${r==='W'?'V':r==='D'?'N':'D'}</i>`).join('')||'<i class="none">—</i>'}</span>`; }
function fitBar(v){ const c=v>=75?'ok':v>=55?'mid':'low'; return `<span class="fit ${c}" title="Fraîcheur ${Math.round(v)} %"><i style="width:${clamp(v)}%"></i></span>`; }
function notePill(n){ if(n==null) return ''; return `<span class="note ${n>=7.5?'top':n>=6.5?'good':n<5.5?'bad':''}">${n.toFixed(1)}</span>`; }
function oppCardHTML(m){
  const comp=state.comp, c=state.club; const st=styleById(m.themStyle); const N=comp.teams.length;
  const pos=tablePos(comp.table,m.themName), myPos=tablePos(comp.table,c.name);
  const P=state.kind==='player'?playerSquadMap():coachSquadMap(); const xi=m.xi.map(id=>P[id]).filter(Boolean); const avg=xi.length?xi.reduce((n,p)=>n+effRating(p,m.year),0)/xi.length:0; const d=avg-m.themStrength;
  const level=d>=6?'nettement plus faible que ton onze':d>=2?'un peu plus faible que ton onze':d>-2?'du même niveau que ton onze':d>-6?'un peu plus fort que ton onze':'nettement plus fort que ton onze';
  return `<div class="opp-card"><div class="opp-top"><span class="tag gold">${m.home?'🏟️ Domicile':'🚌 Extérieur'}</span><b class="opp-name">${escapeHtml(m.themName)}</b><span class="tag">${ordinal(pos)} sur ${N}</span><span class="tag">force ${Math.round(m.themStrength)} · ${level}</span></div>
    <div class="opp-meta">${st.icon} <b>${st.name}</b> · ${escapeHtml(matchupText(m.ourStyle,m.themStyle))} · forme ${formChips(comp.form&&comp.form[m.themName])}</div>
    <div class="opp-meta">Toi : ${ordinal(myPos)} sur ${N} · forme ${formChips(comp.form&&comp.form[c.name])} · ${styleById(m.ourStyle).icon} ${styleById(m.ourStyle).name}</div></div>`;
}
function eventsHTML(events){ return `<div class="timeline">${events.map(e=>`<div class="ev ${e.kind} ${e.side}"><span class="ico">${e.icon}</span><span>${e.text}</span></div>`).join('')||'<div class="hint">Rien à signaler.</div>'}</div>`; }
function ratingsHTML(rec,P,meId){
  const rows=[...rec.xi,...Object.keys(rec.ratings).filter(id=>!rec.xi.map(String).includes(String(id)))].map(id=>P[id]).filter(Boolean);
  const played=rows.filter(p=>rec.ratings[p.id]!=null).sort((a,b)=>rec.ratings[b.id]-rec.ratings[a.id]);
  const ev=id=>rec.events.filter(e=>String(e.pid)===String(id));
  return `<table class="squad-table ratings"><thead><tr><th></th><th>Joueur</th><th class="r">Note</th><th>Match</th></tr></thead><tbody>${played.map(p=>{ const e=ev(p.id); const g=e.filter(x=>x.kind==='goal').length, y=e.filter(x=>x.kind==='yellow').length, r=e.filter(x=>x.kind==='red').length, inj=e.some(x=>x.kind==='injury'), sub=e.some(x=>x.kind==='sub'); const assists=rec.events.filter(x=>x.kind==='goal'&&x.side==='us'&&x.text.includes(`passe de ${escapeHtml(p.name)}`)).length;
    return `<tr class="${String(p.id)===String(meId)?'me':''}"><td><span class="pos-badge pos-${p.pos}">${p.pos}</span></td><td class="${p.real?'real':''}">${escapeHtml(p.name)}${String(rec.motm)===String(p.id)?' ⭐':''}${p.isMe?' (toi)':''}</td><td class="r">${notePill(rec.ratings[p.id])}</td><td class="marks">${'⚽'.repeat(g)}${assists?'🅰️'.repeat(assists):''}${'🟨'.repeat(y)}${'🟥'.repeat(r)}${inj?'🩼':''}${sub?'🔁':''}</td></tr>`; }).join('')}</tbody></table>`;
}
function factorsHTML(f){ return `<div class="impact">${(f||[]).map(l=>`<div class="${l.d>=.5?'up':l.d<=-.5?'down':''}">${l.d>=.5?'▲':l.d<=-.5?'▼':'•'} ${escapeHtml(l.t)}</div>`).join('')}</div>`; }
function scoreHero(rec,me){ const W=rec.res==='W'; return `<div class="score-hero ${rec.res}"><div class="teams"><span class="${rec.home===me?'us':''}">${escapeHtml(rec.home)}</span><span class="big">${rec.gh} – ${rec.ga}</span><span class="${rec.away===me?'us':''}">${escapeHtml(rec.away)}</span></div><div class="verdict">${W?'Victoire':rec.res==='D'?'Match nul':'Défaite'}${rec.ht?` · mi-temps ${rec.us==='home'?rec.ht[0]+'–'+rec.ht[1]:rec.ht[1]+'–'+rec.ht[0]}`:''} · journée ${rec.matchday+1}</div></div>`; }
function tempoSelectHTML(){ const t=TEMPOS[state.tempo]?state.tempo:'temps_forts'; return `<div class="section-label">Rythme de la saison</div><select class="select tempo" onchange="setTempo(this.value)" title="${escapeHtml(TEMPOS[t].desc)}">${Object.entries(TEMPOS).map(([k,v])=>`<option value="${k}" ${t===k?'selected':''}>${v.icon} ${v.label}</option>`).join('')}</select><div class="hint">${escapeHtml(TEMPOS[t].desc)}</div>`; }
function whyHTML(why){ return why&&why.length?`<div class="why-row">${why.map(w=>`<span class="why">${escapeHtml(w)}</span>`).join('')}</div>`:''; }
function sinceHTML(list){ if(!list||!list.length) return ''; const W=list.filter(m=>m.res==='W').length, D=list.filter(m=>m.res==='D').length, L=list.filter(m=>m.res==='L').length; return `<div class="section-label">Pendant ce temps · ${list.length} match${list.length>1?'s':''} joué${list.length>1?'s':''} avec ta compo : ${W} V · ${D} N · ${L} D</div>${matchesHTML(list,state.club.name)}`; }
/* La roulette laisse une trace : destin scellé ou écho sur les saisons suivantes */
function fateHTML(){
  const f=state.rouletteFate, e=state.rouletteEcho; if(!f&&!(e&&e.seasons>0)) return '';
  return `<div class="section-label">La roulette</div>${f?`<div class="why-row"><span class="why">${f.icon} ${escapeHtml(f.label)}</span></div><div class="hint">${escapeHtml(f.text)}</div>`:''}${e&&e.seasons>0?`<div class="hint">${e.icon} <b>${escapeHtml(e.label)}</b> : ${escapeHtml(e.short)}. ${e.delta>0?'+':''}${e.delta} ${state.kind==='player'?'sur ce que le coach voit de toi':"sur la force de l'équipe"}, encore ${e.seasons} saison${e.seasons>1?'s':''}.</div>`:''}`;
}
function coteHTML(){ const cote=state.cote==null?30:state.cote; const s=coteToStrength(cote); return `<div class="section-label">Ta cote</div><div class="conf-big">${Math.round(cote)} / 100</div><div class="bar"><i style="width:${clamp(cote)}%"></i></div><div class="hint">Le niveau de banc que ta carrière justifie : ${coteLabel(s)}. Objectifs tenus, titres et coupes la font monter ; échecs, relégations et licenciements la font chuter.${state.club&&state.club.contractEnd?(state.club.contractEnd>=9999?" Contrat à vie : la clause de la roulette t'y oblige.":` Contrat jusqu'en ${state.club.contractEnd}.`):''}</div>`; }
function matchdayLabel(){ const comp=state.comp; return `Journée ${Math.min((state.matchday||0)+1,comp.schedule.length)} / ${comp.schedule.length}`; }

/* ---------- Entraîneur·euse : avant-match, mi-temps, résultat ---------- */
function renderPrematch(){
  const m=state.match, c=state.club, y=state.year, P=coachSquadMap(); const f=FORMATIONS[m.formation]; const need={G:1,D:f[0],M:f[1],A:f[2]};
  const xi=m.xi.map(id=>P[id]).filter(Boolean); const slots=assignSlots(xi,f); const count={G:0,D:0,M:0,A:0}; xi.forEach(p=>count[p.pos]++);
  const bmax=benchSize(y); matchFactors(m,P,{extra:coachBonusLines()});
  const status=p=>m.xi.includes(p.id)?'xi':m.bench.includes(p.id)?'bench':'out';
  const row=p=>{ const st=status(p), av=availableForMatch(p); const flags=`${p.injury>0?` <span class="flag bad">🩼 ${p.injury} sem.</span>`:''}${p.suspended>0?` <span class="flag bad">🟥 ${p.suspended} match${p.suspended>1?'s':''}</span>`:''}${p.promised?' ⭐':''}${p.fanFav?' ❤️':''}${m.captain===p.id?' ©':''}`; const slot=slots.find(s=>s.p===p);
    return `<tr class="${st} ${av?'':'inj'}"><td>${av?`<button class="status-btn ${st}" onclick="coachToggleLineup(${p.id})">${st==='xi'?'Titulaire':st==='bench'?'Banc':'Tribune'}</button>`:'<span class="status-btn off">Indispo</span>'}</td><td><span class="pos-badge pos-${p.pos}">${p.pos}</span>${slot&&slot.pen?` <span class="flag bad" title="Hors poste">→${slot.slot} −${slot.pen}</span>`:''}</td><td class="${p.real?'real':''}">${escapeHtml(p.name)}${flags}</td><td>${playerAge(p,y)}</td><td><b>${Math.round(effRating(p,y))}</b>${fitnessMalus(p)>=1?` <span class="flag bad">−${fitnessMalus(p).toFixed(0)}</span>`:''}</td><td>${fitBar(fit(p))}</td><td class="r">${p.rated?notePill(p.sumRating/p.rated):'<span class="hint">—</span>'}</td><td class="r hint">${p.goals||0} b · ${p.assists||0} p${p.yellows?` · 🟨${p.yellows}`:''}</td></tr>`; };
  const okXI=xi.length===11; const missing=['G','D','M','A'].filter(k=>count[k]<need[k]).map(k=>`${need[k]-count[k]} ${POS_LABEL[k].toLowerCase()}${need[k]-count[k]>1?'s':''}`);
  return `<div class="card"><h2 class="display">${matchdayLabel()} · ${escapeHtml(c.leagueName)}</h2>${phaseTrack()}${whyHTML(m.why)}${sinceHTML(state.sinceLast)}
    ${oppCardHTML(m)}
    <div class="section-label">Formation</div><div class="formation-grid">${Object.keys(FORMATIONS).map(x=>`<button class="${m.formation===x?'on':''}" onclick="coachSetMatchOption('formation','${x}')"><b>${x}</b></button>`).join('')}</div>
    <div class="two-cols"><div><div class="section-label">Approche du match</div><div class="opt-grid">${Object.entries(APPROACHES).map(([k,a])=>`<button class="${m.approach===k?'on':''}" onclick="coachSetMatchOption('approach','${k}')"><b>${a.icon} ${a.label}</b><small>${a.desc}</small></button>`).join('')}</div></div>
    <div><div class="section-label">Semaine d'entraînement</div><div class="opt-grid">${Object.entries(TRAINING).map(([k,t])=>`<button class="${state.training===k?'on':''}" onclick="coachSetMatchOption('training','${k}')"><b>${t.icon} ${t.label}</b><small>${t.desc}</small></button>`).join('')}</div></div></div>
    <div class="section-label">Composition · titulaires ${xi.length}/11 · banc ${m.bench.length}/${bmax}${bmax?'':' (pas de remplaçant à cette époque)'}</div>
    <div class="hint">${m.formation} demande ${need.D} défenseurs, ${need.M} milieux, ${need.A} attaquants.${missing.length?` <b>Il manque ${missing.join(', ')}</b> : un joueur hors poste perd des points.`:' Compo cohérente.'} Clique sur le statut pour passer titulaire → banc → tribune.</div>
    <div style="overflow-x:auto"><table class="squad-table lineup"><thead><tr><th>Statut</th><th></th><th>Joueur</th><th>Âge</th><th>Niveau</th><th>Fraîcheur</th><th class="r">Note</th><th class="r">Saison</th></tr></thead><tbody>${['G','D','M','A'].map(pos=>state.squad.filter(p=>p.pos===pos).sort((a,b)=>effRating(b,y)-effRating(a,y)).map(row).join('')).join('')}</tbody></table></div>
    <div class="btn-row"><label class="hint">Capitaine <select class="select" onchange="coachSetMatchOption('captain',this.value)">${xi.map(p=>`<option value="${p.id}" ${m.captain===p.id?'selected':''}>${escapeHtml(p.name)} (${traitLabel(p.trait)})</option>`).join('')}</select></label><button class="btn secondary small" onclick="coachAutoLineup()">Onze automatique</button></div>
    <div class="section-label">Ce qui pèse sur ce match</div>${factorsHTML(m.factors)}
    <div class="btn-row"><button class="btn" onclick="coachKickoff();render()">${okXI?'Coup d\'envoi ⚽':'Compléter et lancer ⚽'}</button><button class="btn secondary" onclick="coachSimPhase()">Simuler la fin de la phase ⏩</button></div></div>`;
}
function renderHalftime(){
  const m=state.match, c=state.club; const ha=matchHomeAway(m);
  const lead=m.gu>m.gt?'Tu mènes.':m.gu<m.gt?'Tu es mené·e.':'Tout reste à faire.';
  return `<div class="card"><h2 class="display">Mi-temps · ${escapeHtml(ha.home)} ${ha.gh} – ${ha.ga} ${escapeHtml(ha.away)}</h2><p class="narr">${lead} ${m.subsLeft} remplacement${m.subsLeft>1?'s':''} encore possible${m.subsLeft>1?'s':''}. Approche actuelle : ${APPROACHES[m.approach].icon} ${APPROACHES[m.approach].label}.</p>
    ${eventsHTML(m.events)}
    <div class="section-label">Ta décision</div><div class="choice-list">${HALFTIME_CHOICES.map(ch=>`<button class="choice-btn" onclick="coachHalftime('${ch.id}')"><span class="ico">${ch.icon}</span><div class="body"><b>${ch.label}</b><small>${ch.sub}${ch.id==='talk'?` Management ${Math.round(state.stats.technique)}, vestiaire ${Math.round(state.gauges.vestiaire)}.`:''}</small></div></button>`).join('')}</div></div>`;
}
function renderMatchResult(){
  const rec=state.lastMatch, c=state.club, P=coachSquadMap(), comp=state.comp; const N=comp.teams.length; const last=state.matchday>=comp.phaseEnds[state.phase];
  return `<div class="card">${scoreHero(rec,c.name)}<p class="narr story">${escapeHtml(rec.story)}${rec.htNote?` ${escapeHtml(rec.htNote)}`:''}</p>
    <div class="two-cols"><div><div class="section-label">Le film du match</div>${eventsHTML(rec.events)}</div><div><div class="section-label">Les notes${rec.motm&&P[rec.motm]?` · homme du match ${escapeHtml(P[rec.motm].name)}`:''}</div>${ratingsHTML(rec,P)}</div></div>
    ${rec.suspensions&&rec.suspensions.length?`<div class="warn">🟥 Suspension : ${rec.suspensions.map(escapeHtml).join(', ')}</div>`:''}
    <div class="section-label">Pourquoi ce résultat</div>${factorsHTML(rec.factors)}
    <div class="section-label">Classement</div><div class="hint">${escapeHtml(c.name)} ${ordinal(rec.pos)} sur ${N} · objectif ${ordinal(c.objectivePos)} · forme ${formChips(comp.form&&comp.form[c.name])}</div>${tableHTML(sortTable(comp.table),c.name,false)}
    <div class="btn-row"><button class="btn" onclick="coachAfterMatch()">${last?'Bilan de la phase →':'Continuer →'}</button>${last?'':'<button class="btn secondary" onclick="coachAfterMatch();coachSimPhase()">Simuler la fin de la phase ⏩</button>'}</div></div>`;
}

/* ---------- Joueur·euse : avant-match, penalty, résultat ---------- */
function renderPPrematch(){
  const m=state.match, c=state.club, P=playerSquadMap(), me=P.me; const rivals=state.squad.filter(p=>p.pos===state.pos&&availableForMatch(p)).sort((a,b)=>effRating(b,state.year)-effRating(a,state.year));
  const st=m.myStatus; const label={xi:'✅ Titulaire',bench:'🪑 Sur le banc',injured:'🩼 Blessé·e',suspended:'🟥 Suspendu·e',out:'🚫 Hors du groupe'}[st];
  const why=st==='xi'?`Le coach te fait confiance (${Math.round(state.coachTrust)}/100). Ton niveau du jour : ${Math.round(effRating(me,state.year))}${me.selBonus>=0?' +':' −'}${Math.abs(me.selBonus).toFixed(1)} de crédit auprès du coach.`:st==='bench'?`Devant toi au poste : ${rivals.slice(0,state.pos==='G'?1:state.pos==='A'?2:4).map(p=>`${escapeHtml(p.name)} (${Math.round(effRating(p,state.year))})`).join(', ')}. Toi : ${Math.round(effRating(me,state.year))}, confiance du coach ${Math.round(state.coachTrust)}. Une entrée en jeu reste possible.`:st==='injured'?`Encore ${state.injury} semaine${state.injury>1?'s':''} d'absence.`:st==='suspended'?`Encore ${state.suspended} match${state.suspended>1?'s':''} de suspension.`:`Le coach ne t'a pas retenu·e (confiance ${Math.round(state.coachTrust)}).`;
  return `<div class="card"><h2 class="display">${matchdayLabel()} · ${escapeHtml(c.leagueName)}</h2>${phaseTrack()}${whyHTML(m.why)}${sinceHTML(state.sinceLast)}
    ${oppCardHTML(m)}
    <div class="my-status ${st}"><b>${label}</b><div class="hint">${why}</div><div class="hint">Fraîcheur ${fitBar(state.fitness==null?100:state.fitness)} ${Math.round(state.fitness==null?100:state.fitness)} % · forme ${Math.round(state.forme)} · ${'⚽'} ${state.seasonStats.goals} b · 🅰️ ${state.seasonStats.assists} p · ${state.seasonStats.apps} matchs cette saison${state.yellows?` · 🟨 ${state.yellows}`:''}</div></div>
    <div class="section-label">Le onze du coach (${m.formation})</div><div class="squad">${m.xi.map(id=>P[id]).filter(Boolean).map(p=>`<div class="${p.isMe?'me':''}"><span class="pos-badge pos-${p.pos}">${p.pos}</span> ${escapeHtml(p.name)}${p.isMe?' (toi)':''} <span>${Math.round(effRating(p,state.year))}</span></div>`).join('')}</div>
    ${m.bench.length?`<div class="hint">Banc : ${m.bench.map(id=>P[id]).filter(Boolean).map(p=>`${escapeHtml(p.name)}${p.isMe?' (toi)':''}`).join(', ')}</div>`:''}
    <div class="btn-row"><button class="btn" onclick="playerKickoff();render()">Jouer le match ⚽</button><button class="btn secondary" onclick="playerSimPhase()">Simuler la fin de la phase ⏩</button></div></div>`;
}
function renderPPenalty(){
  const m=state.match, pen=m.pending; const chance=Math.round(playerPenaltyChance()*100); const ha=matchHomeAway(m);
  return `<div class="card event-card">${sinceHTML(state.sinceLast)}<div class="ico">🎯</div><h2 class="display">${pen.min}e minute : penalty pour ${escapeHtml(state.club.name)} !</h2><p class="narr">${escapeHtml(ha.home)} ${ha.gh} – ${ha.ga} ${escapeHtml(ha.away)}. Le stade se lève, le capitaine te regarde. Tu prends le ballon ?</p>
    <div class="choice-list"><button class="choice-btn" onclick="playerPenaltyChoice(true)"><span class="ico">⚽</span><div class="body"><b>Le tirer toi-même</b><small>${chance} % de réussite (mental ${Math.round(state.stats.mental)}${state.traitId==='glace'?', sang froid':''}). Marqué : le stade est à toi. Raté : le stade s'en souviendra.</small></div></button>
    <button class="choice-btn" onclick="playerPenaltyChoice(false)"><span class="ico">🤝</span><div class="body"><b>Laisser le tireur attitré</b><small>76 % de réussite, aucun risque pour toi, aucune gloire non plus.</small></div></button></div></div>`;
}
function renderPMatchResult(){
  const rec=state.lastMatch, c=state.club, P=playerSquadMap(), comp=state.comp; const N=comp.teams.length; const last=state.matchday>=comp.phaseEnds[state.phase];
  const mine=rec.played?`<div class="my-line ${rec.note>=7?'good':rec.note<5.5?'bad':''}"><b>Toi</b> · ${rec.start?'titulaire':'entré·e en jeu'} · ${rec.min} min · note ${notePill(rec.note)}${rec.goals?` · ⚽ ${rec.goals}`:''}${rec.assists?` · 🅰️ ${rec.assists}`:''}${rec.yellow?' · 🟨':''}${rec.red?' · 🟥':''}${rec.inj?` · 🩼 ${rec.inj} sem.`:''}${rec.motm==='me'?' · ⭐ joueur·euse du match':''} · confiance du coach ${rec.dTrust>=0?'+':''}${rec.dTrust} → ${Math.round(state.coachTrust)}</div>`:`<div class="my-line"><b>Toi</b> · ${rec.status==='bench'?'resté·e sur le banc · confiance du coach −0,6':rec.status==='injured'?'blessé·e, en tribune':rec.status==='suspended'?'suspendu·e':'hors du groupe'} → ${Math.round(state.coachTrust)}</div>`;
  return `<div class="card">${scoreHero(rec,c.name)}<p class="narr story">${escapeHtml(rec.story)}${rec.penNote?` ${escapeHtml(rec.penNote)}`:''}</p>${mine}
    <div class="two-cols"><div><div class="section-label">Le film du match</div>${eventsHTML(rec.events)}</div><div><div class="section-label">Les notes${rec.motm&&P[rec.motm]?` · ${rec.motm==='me'?'toi':escapeHtml(P[rec.motm].name)} en tête`:''}</div>${ratingsHTML(rec,P,'me')}</div></div>
    <div class="section-label">Classement</div><div class="hint">${escapeHtml(c.name)} ${ordinal(rec.pos)} sur ${N} · forme ${formChips(comp.form&&comp.form[c.name])}</div>${tableHTML(sortTable(comp.table),c.name,false)}
    <div class="btn-row"><button class="btn" onclick="playerAfterMatch()">${last?'Bilan de la phase →':'Continuer →'}</button>${last?'':'<button class="btn secondary" onclick="playerAfterMatch();playerSimPhase()">Simuler la fin de la phase ⏩</button>'}</div></div>`;
}

window.addEventListener('DOMContentLoaded',()=>{ renderStart(); });
