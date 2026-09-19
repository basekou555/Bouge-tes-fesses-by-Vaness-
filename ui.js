/* ============================== ABSOLUT COACH — INTERFACE ============================== */
const app=document.getElementById('app');
const filmstripEl=document.getElementById('filmstrip');
const homeCreditStripEl=document.getElementById('homeCreditStrip');
const gameTopBannerEl=document.getElementById('gameTopBanner');
const editionLabelEl=document.getElementById('editionLabel');
let creation=null; // profil en cours de création (entraîneur·euse)

function applyTheme(){
  const player=state&&state.kind==='player';
  document.documentElement.setAttribute('data-theme',player?'player':'coach');
  const brand=gameTopBannerEl.querySelector('.brand');
  if(brand) brand.innerHTML=(player?'ABSOLUT PLAYER':'ABSOLUT COACH')+'<span>.</span>';
  document.title=player?'Absolut Player':'Absolut Coach';
  editionLabelEl.textContent=player?'Une vie de joueur·euse, de 17 à 38 ans':'Une vie de football, de 30 à 75 ans';
}
function showHomeBanner(){ homeCreditStripEl.style.display=''; gameTopBannerEl.style.display='none'; filmstripEl.style.display='none'; applyTheme(); }
function showGameBanner(){ homeCreditStripEl.style.display='none'; gameTopBannerEl.style.display=''; applyTheme(); }
function goHomeFromGame(){ if(state&&!state.ended){ if(state.kind==='player') savePlayerGame(); else saveGame(); } state=null; creation=null; renderStart(); }
function scrollTop(){ window.scrollTo(0,0); }

/* ---------- Accueil ---------- */
function renderStart(){
  showHomeBanner(); document.documentElement.setAttribute('data-theme','coach'); document.title='Absolut Coach';
  const save=lsGet(SAVE_KEY,null), psave=lsGet(PLAYER_SAVE_KEY,null);
  app.innerHTML=`<div class="fade-in">
    <div class="home-hero">
      <h1 class="display">ABSOLUT <span>COACH</span></h1>
      <div class="tagline narr">Une vie de football, de 30 à 75 ans. Choisis tes clubs. Dirige tes vestiaires. Survis aux présidents. Construis une œuvre.</div>
      <div class="home-pills"><span class="pill">100 % local</span><span class="pill">Aucune installation</span><span class="pill">Français</span><span class="pill">Badges persistants</span></div>
      <p class="hint narr" style="max-width:640px;margin:0 auto;">Le jeu ne cherche pas « le bon bouton ». Chaque décision déplace des probabilités, puis le football fait ce qu'il sait faire de mieux : surprendre.</p>
    </div>
    <div class="home-grid">
      <button class="home-card" onclick="startCoachCreation()"><div class="ico">🧢</div><b>Commencer une carrière d'entraîneur·euse</b><span>De la N3 aux super-clubs : offres, recrutement, vestiaire, tactique, staff, incidents et bilan de saison.</span></button>
      <button class="home-card" onclick="startPlayerCreation()"><div class="ico">👟</div><b>Commencer une carrière de joueur·euse</b><span>De 17 à 38 ans : agents, temps de jeu, blessures, sélection et Ballon de platine.</span></button>
      ${save&&!save.ended?`<button class="home-card" onclick="continueSavedGame()"><div class="ico">💾</div><b>Reprendre : ${escapeHtml(save.name)}</b><span>${escapeHtml(save.careerModeName)} · ${save.age} ans · ${save.seasons.length} saison${save.seasons.length>1?'s':''} · ${euros(save.stats.argent)}</span></button>`:''}
      ${psave&&!psave.ended?`<button class="home-card" onclick="continuePlayerGame()"><div class="ico">💾</div><b>Reprendre : ${escapeHtml(psave.name)} (joueur·euse)</b><span>${psave.age} ans · ${psave.seasons.length} saison${psave.seasons.length>1?'s':''} · ${escapeHtml(psave.club||'sans club')}</span></button>`:''}
      <button class="home-card" onclick="renderBadges()"><div class="ico">🏅</div><b>Salle des badges</b><span>${unlockedTrophies.size} / ${TROPHIES.length} badges débloqués, toutes carrières confondues.</span></button>
      <button class="home-card" onclick="renderHall()"><div class="ico">🏛️</div><b>Panthéon</b><span>Les carrières terminées sur ce navigateur.</span></button>
      <button class="home-card" onclick="renderRules()"><div class="ico">📖</div><b>Comment ça marche</b><span>Statistiques, jauges du club, pression, roulette, enveloppe de secours et fins de carrière.</span></button>
    </div>
  </div>`;
  scrollTop();
}
function continueSavedGame(){ if(loadGame()){ render(); } else renderStart(); }

/* ---------- Création du profil entraîneur·euse ---------- */
const CREATION_STEPS=['name','mode','origine','nationality','style','mentor','qualite','defaut','summary'];
function startCoachCreation(){ creation={step:0,name:'',mode:null,origine:null,nationality:null,favoriteStyle:null,mentor:null,qualite:null,defaut:null}; renderCreation(); }
function creationProgressHTML(){ const i=creation.step; return `<div class="creation-progress"><span>Étape ${i+1}/${CREATION_STEPS.length}</span><div class="track"><i style="width:${Math.round((i+1)/CREATION_STEPS.length*100)}%"></i></div></div>`; }
function creationPick(key,value){ creation[key]=value; creation.step++; renderCreation(); }
function creationBack(){ if(creation.step>0){ creation.step--; renderCreation(); } else renderStart(); }
function bonusChips(bonus){ return `<div class="chip-row">${Object.entries(bonus||{}).filter(([k,v])=>v).map(([k,v])=>`<span class="chip ${v>0?'good':'bad'}">${STAT_LABELS[k]||k} ${v>0?'+':''}${v}</span>`).join('')}</div>`; }
function renderCreation(){
  showGameBanner(); state=null; document.documentElement.setAttribute('data-theme','coach');
  const step=CREATION_STEPS[creation.step];
  let html='';
  const back=`<div class="btn-row"><button class="btn secondary" onclick="creationBack()">← Retour</button></div>`;
  if(step==='name'){
    html=`<div class="card"><h2 class="display">Ton nom d'entraîneur·euse</h2><p class="hint">Il apparaîtra sur les bancs, dans la presse et au Panthéon.</p>
      <input type="text" id="coachName" maxlength="28" placeholder="Ex. Vanessa Le Bris" value="${escapeHtml(creation.name)}">
      <div class="btn-row"><button class="btn secondary" onclick="renderStart()">Accueil</button><button class="btn" onclick="creationPick('name',document.getElementById('coachName').value.trim()||'Anonyme')">Continuer →</button></div></div>`;
  } else if(step==='mode'){
    html=`<div class="card"><h2 class="display">Choisis ta campagne</h2><p class="hint">La campagne change l'économie, la variance, les incidents, l'usure des jauges et les conditions de défaite pendant toute la carrière.</p>
      <div class="mode-grid">${CAREER_MODES.map((m,i)=>`<button class="mode-card" onclick="creationPick('mode',CAREER_MODES[${i}])"><div class="mode-icon">${m.icon}</div><div class="mode-copy"><small>${m.difficulty}</small><b>${m.name}</b><span>${m.desc}</span><span class="mode-rules">${m.details.map(d=>`<i>${d}</i>`).join('')}</span></div></button>`).join('')}</div>${back}</div>`;
  } else if(step==='origine'){
    html=`<div class="card"><h2 class="display">D'où viens-tu ?</h2><p class="hint">L'origine fixe ton capital de départ, ton profil initial et ta manière de démarrer.</p>
      <div class="mode-grid">${ORIGINES.map((o,i)=>`<button class="mode-card" onclick="creationPick('origine',ORIGINES[${i}])"><div class="mode-copy"><b>${o.name}</b><span>${o.desc}</span>${bonusChips(o.bonus)}<span class="chip-row"><span class="chip">Capital ${o.capitalMod>0?'+':''}${Math.round(o.capitalMod*100)} %</span>${o.riskReduction?`<span class="chip good">Risque −${o.riskReduction}</span>`:''}${o.scandalStart?`<span class="chip bad">Scandale +${o.scandalStart}</span>`:''}</span></div></button>`).join('')}</div>${back}</div>`;
  } else if(step==='nationality'){
    html=`<div class="card"><h2 class="display">Ta nationalité</h2><p class="hint">Elle définit tes affinités culturelles avec certains styles de jeu.</p>
      <div class="mode-grid">${NATIONALITIES.map((n,i)=>`<button class="mode-card" onclick="creationPick('nationality',NATIONALITIES[${i}])"><div class="mode-copy"><b>${n.name}</b><span>${n.desc}</span><span class="chip-row">${n.favoredStyleIds.map(id=>`<span class="chip good">${styleById(id).icon} ${styleById(id).name}</span>`).join('')}</span>${bonusChips(n.bonus)}</div></button>`).join('')}</div>${back}</div>`;
  } else if(step==='style'){
    html=`<div class="card"><h2 class="display">Ton style de jeu favori</h2><p class="hint">Tu seras meilleur·e dans ce style, et les projets qui le demandent te parleront davantage.</p>
      <div class="mode-grid">${STYLES.map((s,i)=>`<button class="mode-card" onclick="creationPick('favoriteStyle',STYLES[${i}])"><div class="mode-icon">${s.icon}</div><div class="mode-copy"><b>${s.name}</b><span>${s.desc}</span><span class="chip-row"><span class="chip">Prestige ${starRating(s.prestige*100)}</span><span class="chip">Spectacle ${starRating(s.appeal*100)}</span></span></div></button>`).join('')}</div>${back}</div>`;
  } else if(step==='mentor'){
    html=`<div class="card"><h2 class="display">Ton inspiration</h2><p class="hint">Un·e entraîneur·euse dont tu revendiques l'héritage. Une simple orientation de départ.</p>
      <div class="mode-grid">${MENTORS.map((m,i)=>`<button class="mode-card" onclick="creationPick('mentor',MENTORS[${i}])"><div class="mode-copy"><b>${m.name}</b><span>${m.style}</span>${bonusChips(m.bonus)}</div></button>`).join('')}</div>${back}</div>`;
  } else if(step==='qualite'){
    html=`<div class="card"><h2 class="display">Ta grande qualité</h2><div class="mode-grid">${QUALITES.map((q,i)=>`<button class="mode-card" onclick="creationPick('qualite',QUALITES[${i}])"><div class="mode-copy"><b>${q.name}</b><span>${q.desc}</span>${bonusChips(q.bonus)}</div></button>`).join('')}</div>${back}</div>`;
  } else if(step==='defaut'){
    html=`<div class="card"><h2 class="display">Ton défaut</h2><p class="hint">Il augmente les risques d'incident et parfois le scandale. Personne n'est parfait.</p><div class="mode-grid">${DEFAUTS.map((d,i)=>`<button class="mode-card" onclick="creationPick('defaut',DEFAUTS[${i}])"><div class="mode-copy"><b>${d.name}</b><span>${d.desc}</span>${bonusChips(d.bonus)}<span class="chip-row"><span class="chip bad">Risque +${d.riskBoost}</span></span></div></button>`).join('')}</div>${back}</div>`;
  } else {
    const stats=computeCreationStats();
    const startCapital=clamp((STARTING_CAPITAL+(creation.origine.capitalMod||0))*creation.mode.rules.capitalMult,.04,8);
    html=`<div class="card"><h2 class="display">${escapeHtml(creation.name)}</h2>
      <div class="identity">${creation.mode.icon} <b>${creation.mode.name}</b> · ${creation.origine.name} · ${creation.nationality.name} · style favori <b>${creation.favoriteStyle.icon} ${creation.favoriteStyle.name}</b> · inspiré·e par <b>${creation.mentor.name}</b> · ${creation.qualite.name} / ${creation.defaut.name}</div>
      <div class="section-label">Statistiques de départ</div>
      ${STAT_KEYS.map(k=>`<div class="stat-row"><div class="lbl"><span>${STAT_LABELS[k]}</span><b>${Math.round(stats[k])}</b></div><div class="bar"><i style="width:${clamp(stats[k])}%"></i></div></div>`).join('')}
      <div class="stat-row"><div class="lbl"><span>Capital de départ</span><b>${euros(startCapital)}</b></div></div>
      <div class="section-label">Indicateurs de destinée</div>
      <div class="hint">${destinyHints(stats).map(h=>`• ${h}`).join('<br>')}</div>
      <div class="btn-row"><button class="btn secondary" onclick="creationBack()">← Retour</button><button class="btn" onclick="launchCoachCareer()">Commencer la carrière ⚽</button></div></div>`;
  }
  app.innerHTML=`<div class="fade-in">${creationProgressHTML()}${html}</div>`; scrollTop();
}
function computeCreationStats(){
  const st={...BASE_STATS};
  [creation.origine,creation.nationality,creation.mentor,creation.qualite,creation.defaut].forEach(o=>{ Object.entries(o.bonus||{}).forEach(([k,v])=>{ st[k]=(st[k]||0)+v; }); });
  Object.keys(st).forEach(k=>st[k]=clamp(st[k]));
  return st;
}
function destinyHints(stats){
  const h=[];
  h.push(stats.talent>=40?"Un cerveau tactique au-dessus de la moyenne : les grands projets te tendront les bras plus tôt.":"Tactique perfectible : les premières saisons serviront d'apprentissage.");
  h.push(stats.technique>=32?"Une gestion solide : les projets difficiles coûteront moins de qualité.":"Gestion fragile : attention aux clubs trop exigeants au début.");
  h.push(stats.reseau>=22?"Un réseau déjà actif : les portes de l'étranger s'ouvriront vite.":"Réseau limité : il faudra convaincre par les résultats.");
  const risk=(creation.defaut.riskBoost||0)-(creation.qualite.riskReduction||0)-(creation.origine.riskReduction||0);
  h.push(risk>4?"Profil à risques : incidents et scandales seront plus fréquents.":risk<-2?"Profil prudent : les incidents seront plus rares.":"Un équilibre entre prudence et audace.");
  h.push(`Campagne ${creation.mode.name} : ${creation.mode.desc}`);
  return h;
}
function launchCoachCareer(){
  const stats=computeCreationStats();
  state=freshState({...creation,stats},creation.name);
  log(`🧢 Début de carrière à ${state.age} ans : ${state.origineName}, inspiré·e par ${state.mentorName}. Campagne « ${state.careerModeName} ».`);
  creation=null;
  openProjects(); render();
}

/* ---------- Rendu principal ---------- */
function render(){
  if(!state){ renderStart(); return; }
  if(state.kind==='player'){ renderPlayerScreen(); return; }
  showGameBanner(); renderFilmstrip();
  if(state.ended){ renderEnd(); return; }
  const screens={ projects:renderProjects, strategy:renderStrategy, recruit:renderRecruit, vestiaire:renderVestiaire, tactic:renderTactic, staff:renderStaff, incident:renderIncident, promo:renderPromo, seasonResult:renderSeasonResult, aborted:renderAborted, choiceResult:renderChoiceResult, event:renderEvent, careerRoulette:renderRoulette, ecoFine:renderEcoFine, pressureCrisis:renderPressureCrisis, emergencyLoanOffer:renderLoanOffer, emergencyLoanPayment:renderLoanPayment };
  const fn=screens[state.pendingChoice]||renderProjects;
  app.innerHTML=`<div class="layout fade-in"><div class="main">${fn()}</div><div class="sidebar">${sidebarHTML()}</div></div>`;
  scrollTop();
}
function renderFilmstrip(){
  if(!state||!state.seasons){ filmstripEl.style.display='none'; return; }
  filmstripEl.style.display='';
  const frames=state.seasons.map(f=>{ const cls=f.aborted?'aborted':f.isFlop?'flop':f.isHit?'success':'mid'; const label=f.aborted?'🪓':f.champion?'🏆':f.relegated?'⬇️':`${f.finalPos}e`; return `<div class="frame ${cls}" title="${escapeHtml(f.club)} — ${escapeHtml(f.title)}">${f.n}. ${label}</div>`; });
  if(state.currentProduction) frames.push(`<div class="frame current">${state.seasons.length+1}. en cours</div>`);
  filmstripEl.innerHTML=frames.length?frames.join(''):`<div class="frame">Aucune saison pour l'instant</div>`;
}
function sidebarHTML(){
  const s=state.stats, systems=ensureBaseCareerSystems(), risk=careerStructuralRisk();
  const pressureCls=state.pressure>=85?'bad':state.pressure>=50?'mid':'good';
  return `<div class="card">
    <div class="identity"><b>${escapeHtml(state.name)}</b> · ${state.age} ans<br>${state.careerModeIcon} ${state.careerModeName}<br>${state.currentClub?`🏟️ ${escapeHtml(state.currentClub)} (saison ${state.seasonsAtClub})`:'Sans club'}</div>
    <div class="money ${s.argent<0?'neg':''}">${euros(s.argent)}</div><div class="hint">Capital : ce que le football accepte de te confier.</div>
    ${state.emergencyLoan?`<div class="warn small">🏦 Enveloppe : ${euros(state.emergencyLoan.balance)} dus · échéance ${state.emergencyLoan.installments}/2</div>`:''}
    <div class="section-label">Statistiques</div>
    ${STAT_KEYS.map(k=>`<div class="stat-row"><div class="lbl"><span>${STAT_LABELS[k]}</span><b>${Math.round(s[k])}</b></div><div class="bar"><i style="width:${clamp(s[k])}%"></i></div></div>`).join('')}
    <div class="stat-row"><div class="lbl"><span>Pression</span><b class="pressure-state ${pressureCls}">${Math.round(state.pressure)}</b></div><div class="bar pressure"><i style="width:${clamp(state.pressure)}%"></i></div></div>
    ${s.scandalRisk>0?`<div class="hint">Risque de scandale : ${Math.round(s.scandalRisk)}</div>`:''}
    <div class="structure ${risk.tone}">${risk.label}${risk.domains.length?`<small>Foyers : ${risk.domains.join(', ')}</small>`:''}${state.criticalStructuralYears?`<small>Rupture : ${state.criticalStructuralYears}/3 périodes</small>`:''}</div>
    ${state.activeStrategy?`<div class="active-strategy">${state.activeStrategy.icon} <b>${state.activeStrategy.name}</b> · encore ${state.activeStrategy.remaining} saison${state.activeStrategy.remaining>1?'s':''}</div>`:''}
    <div class="section-label">Jauges du club</div>
    ${BASE_SYSTEM_DEFINITIONS.map(d=>`<div class="gauge-row ${careerSystemMood(systems[d.key])}" title="${escapeHtml(d.impact)}"><span>${d.icon}</span><div><div class="bar"><i style="width:${clamp(systems[d.key])}%"></i></div><div class="hint" style="font-size:10px">${d.label} · ${careerSystemEffectLabel(d.key,systems[d.key])}</div></div><span>${Math.round(systems[d.key])}</span></div>`).join('')}
    <div class="section-label">Staff</div>
    ${state.careerCrew.map(m=>`<div class="hint">${escapeHtml(m.name)} · ${m.job} · ${m.age} ans · compétence ${Math.round(m.skill)} · loyauté ${Math.round(m.loyalty)}</div>`).join('')}
    <div class="section-label">Palmarès</div>
    <div class="hint">🏆 ${state.titles.champion} titre${state.titles.champion>1?'s':''} · ⬆️ ${state.titles.promo} montée${state.titles.promo>1?'s':''} · 🥇 ${state.titles.cup} coupe${state.titles.cup>1?'s':''} · ⭐ ${state.titles.euro1} · 🌍 ${state.titles.euro2} · 🎖️ ${state.awardsWon}</div>
    <div class="section-label">Traits</div><div>${state.traits.map(t=>`<span class="trait-pill">${escapeHtml(t)}</span>`).join('')}</div>
  </div>
  <div class="card"><div class="section-label">Journal</div><div class="log">${state.log.slice(0,40).map(l=>`<div><span class="age">${l.age} ans</span>${l.msg}</div>`).join('')}</div></div>
  <div class="card"><div class="btn-row"><button class="btn secondary small" onclick="goHomeFromGame()">Accueil (sauvegarde)</button><button class="btn danger small" onclick="if(confirm('Abandonner cette carrière ? La sauvegarde sera supprimée.')){ endCareer('Tu raccroches le survêtement de ton plein gré.',{cause:'retire',automatic:false}); render(); }">Prendre ma retraite</button></div></div>`;
}
function deltaChipsHTML(before,after,hideArgent){
  const keys=[...STAT_KEYS,'pressure','argent'].filter(k=>!(hideArgent&&k==='argent'));
  const chips=keys.map(k=>{ const b=before[k]||0,a=after[k]||0,d=a-b; if(Math.abs(d)<.5) return ''; const label=k==='pressure'?'Pression':STAT_LABELS[k]; const good=k==='pressure'?d<0:d>0; return `<span class="delta-chip ${good?'up':'down'}">${label} ${k==='argent'?(d>0?'+':'')+euros(d):(d>0?'+':'')+Math.round(d)}</span>`; }).filter(Boolean);
  return chips.length?`<div class="delta-chips">${chips.join('')}</div>`:`<div class="hint">Aucun changement notable de statistiques.</div>`;
}
function systemDeltaHTML(before,after){
  if(!before||!after) return '';
  const chips=CAREER_SYSTEM_KEYS.map(k=>{ const d=(after[k]||0)-(before[k]||0); if(Math.abs(d)<.5) return ''; const def=BASE_SYSTEM_DEFINITIONS.find(x=>x.key===k); return `<span class="delta-chip ${d>0?'up':'down'}">${def.icon} ${def.label} ${d>0?'▲':'▼'} ${d>0?'+':''}${Math.round(d*10)/10}</span>`; }).filter(Boolean);
  return chips.length?`<div class="delta-chips">${chips.join('')}</div>`:'';
}
function milestonesHTML(items){ return (items||[]).map(m=>`<div class="milestone">${m.icon} <b>Palier 100 — ${escapeHtml(m.name)}</b><br>${escapeHtml(m.desc)}</div>`).join(''); }

/* ---------- Écrans de carrière ---------- */
function renderStrategy(){
  return `<div class="card"><h2 class="display">Stratégie de carrière</h2><p class="hint">Tous les cinq projets, tu choisis un cap pour trois saisons. Il oriente sans remplacer les décisions de terrain.</p>
    <div class="strategy-grid">${state.strategyOptions.map((s,i)=>`<button class="strategy-card" onclick="chooseStrategy(${i})"><span>${s.icon}</span><b>${s.name}</b><small>${s.desc}</small></button>`).join('')}</div></div>`;
}
function renderProjects(){
  const offers=state.currentOffers||[];
  if(!offers.length) return `<div class="card"><h2 class="display">Aucune proposition</h2><p class="narr">Le téléphone reste silencieux cette année. Ta réputation ne suffit plus, ou le marché est saturé.</p><div class="btn-row"><button class="btn" onclick="skipYear()">Attendre une année</button></div></div>`;
  return `<div class="card"><h2 class="display">Les projets sur la table</h2><p class="hint">${state.age} ans · Le budget affiché est le capital que tu engages (surcoûts structurels inclus à partir du 3e projet). Les recettes de fin de saison reviennent dans ton capital.</p>
    <div class="offer-grid">${offers.map((o,i)=>{ const req=o.interimBacked?0:productionBudgetRequired(o), ok=canAffordCareerOffer(o); return `<div class="offer-card ${ok?'affordable':'locked'}" ${ok?`onclick="startProduction(${i});render()"`:''}>
      <div class="club">${escapeHtml(o.club)}${o.league?` · ${o.league.name}`:''}</div><h3>${escapeHtml(o.title)}</h3><div class="syn narr">${escapeHtml(o.synopsis)}</div>
      <div class="meta"><span class="tag gold">${TIER_SHORT[o.tierId]}</span><span class="tag">${o.style.icon} ${o.style.name}</span><span class="tag">${o.duration} saison${o.duration>1?'s':''}</span><span class="tag">Objectif : top ${o.objectivePos} / ${o.teams}</span>${o.international?'<span class="tag intl">🌍 International</span>':''}</div>
      <div class="budget">${o.interimBacked?'Pris en charge par le club':`Capital à engager : ${euros(req)}`}</div>
      <div class="offer-hint ${o.hint?o.hint.cls:''}">${o.hint?o.hint.label:''}${ok?'':' · <b>capital insuffisant</b>'}</div></div>`; }).join('')}</div>
    <div class="btn-row"><button class="btn secondary" onclick="skipYear()">Refuser tout et prendre une année sabbatique</button></div></div>`;
}
function productionHeader(step){
  const o=state.currentProduction.offer;
  return `<div class="hint" style="margin-bottom:8px">🏟️ <b>${escapeHtml(o.club)}</b> · ${escapeHtml(o.title)} · ${o.style.icon} ${o.style.name} · objectif top ${o.objectivePos} · ${step}</div>`;
}
function renderRecruit(){
  const p=state.currentProduction;
  return `<div class="card">${productionHeader('Étape 1/5 · Recrutement')}<h2 class="display">Ta recrue phare</h2><p class="hint">Les effets chiffrés restent cachés. Le cachet est prélevé sur ton capital. Le niveau d'accès aux stars dépend de ta cote et de ton réseau.</p>
    <div class="choice-list">${p.recruitOptions.map((r,i)=>`<button class="choice-btn" onclick="chooseRecruit(${i});render()"><span class="ico">${r.icon}</span><div class="body"><b>${r.label}${r.player?` — ${escapeHtml(r.player.name)}, ${r.player.position}, ${r.player.age} ans`:''}</b><small>${r.sub}</small>${r.player?`<div class="traits"><i class="plus">${r.strength}</i><i class="minus">${r.weakness}</i></div>`:''}<span class="cost">${r.fee>0?`Cachet et indemnité : ${euros(r.fee)}`:'Gratuit'}</span></div></button>`).join('')}</div></div>`;
}
function renderVestiaire(){
  const p=state.currentProduction;
  return `<div class="card">${productionHeader('Étape 2/5 · Vestiaire')}<h2 class="display">Comment gères-tu le groupe ?</h2>
    <div class="choice-list">${p.vestiaireOptions.map((o,i)=>`<button class="choice-btn" onclick="chooseVestiaire(${i});render()"><span class="ico">${o.icon}</span><div class="body"><b>${o.label}</b><small>${o.sub}</small></div></button>`).join('')}</div></div>`;
}
function renderTactic(){
  const p=state.currentProduction;
  return `<div class="card">${productionHeader('Étape 3/5 · Système de jeu')}<h2 class="display">Ton plan de jeu</h2><p class="hint">Un système cohérent avec le style demandé par le club (${p.offer.style.icon} ${p.offer.style.name}) donne un vrai bonus. Le reste dépend de toi.</p>
    <div class="choice-list">${p.tacticOptions.map((o,i)=>`<button class="choice-btn" onclick="chooseTactic(${i});render()"><span class="ico">📋</span><div class="body"><b>${o.label}</b><small>${o.sub}</small></div></button>`).join('')}</div></div>`;
}
function renderStaff(){
  const p=state.currentProduction;
  return `<div class="card">${productionHeader('Étape 4/5 · Staff et infrastructures')}<h2 class="display">Où mets-tu les moyens ?</h2>
    <div class="choice-list">${p.staffOptions.map((o,i)=>`<button class="choice-btn" onclick="chooseStaff(${i});render()"><span class="ico">${o.icon}</span><div class="body"><b>${o.label}</b><small>${o.sub}</small><span class="cost">${o.moneyMod>0?`Coût : ${euros(p.offer.budget*o.moneyMod)}`:o.moneyMod<0?`Économie : ${euros(-p.offer.budget*o.moneyMod)}`:'Sans coût'}</span></div></button>`).join('')}</div></div>`;
}
function renderIncident(){
  const inc=state.currentProduction.incident;
  return `<div class="card event-card">${productionHeader('Incident de saison')}<div class="ico">${inc.icon}</div><h2 class="display">${escapeHtml(inc.title)}</h2><p class="narr">${escapeHtml(inc.text)}</p>
    <div class="choice-list">${inc.choices.map((c,i)=>`<button class="choice-btn" onclick="chooseIncident(${i});render()"><div class="body"><b>${escapeHtml(c.label)}</b></div></button>`).join('')}</div></div>`;
}
function renderPromo(){
  const p=state.currentProduction;
  return `<div class="card">${productionHeader('Étape 5/5 · Communication')}<h2 class="display">Ta communication de saison</h2>
    <div class="choice-list">${p.promoOptions.map((o,i)=>`<button class="choice-btn" onclick="choosePromo(${i});render()"><span class="ico">${o.icon}</span><div class="body"><b>${o.label}</b><small>${o.sub}</small><span class="cost">${o.moneyMod>0?`Coût : ${euros(p.offer.budget*o.moneyMod)}`:'Sans coût'}</span></div></button>`).join('')}</div></div>`;
}
function tableHTML(table){
  if(!table) return '';
  const N=table.length, meIdx=table.findIndex(r=>r.me);
  const keep=new Set([0,1,2,N-1,N-2,N-3,meIdx-1,meIdx,meIdx+1].filter(i=>i>=0&&i<N));
  let rows='', gap=false;
  table.forEach((r,i)=>{ if(keep.has(i)){ rows+=`<tr class="${r.me?'me':''}"><td>${r.pos}</td><td>${escapeHtml(r.club)}</td><td class="r">${r.pts} pts</td></tr>`; gap=false; } else if(!gap){ rows+=`<tr><td colspan="3" style="color:var(--muted)">…</td></tr>`; gap=true; } });
  return `<table class="table"><thead><tr><th>#</th><th>Club</th><th class="r">Points</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function seasonPunchline(f){
  if(f.champion&&f.cupWon) return "« Le doublé. Dans dix ans, on te demandera encore comment tu as fait. »";
  if(f.champion) return "« Champion·ne. Les statues se sculptent avec ce genre de saison. »";
  if(f.euroWon) return "« Une nuit européenne dont la ville parlera pendant des décennies. »";
  if(f.unexpectedFlop) return "« Tout était en place. Puis le football a décidé autrement. »";
  if(f.financialDisaster) return "« Belle saison, comptes catastrophiques : le directeur financier a démissionné. »";
  if(f.relegated) return "« La descente. Le silence dans le vestiaire durera tout l'été. »";
  if(f.isDoubleFlop) return "« La presse t'a démoli, les supporters ont sifflé. Il faudra digérer. »";
  if(f.objectiveMet) return "« Objectif rempli. Le président sourit, ce qui n'arrive jamais. »";
  return "« Une saison à ranger dans le tiroir du milieu : ni gloire, ni drame. »";
}
function renderSeasonResult(){
  const r=state.lastSeasonResult, f=r.season;
  const icon=f.champion?'🏆':f.euroWon?'⭐':f.relegated?'⬇️':f.isFlop?'🥶':f.isHit?'🔥':'📊';
  const verdict=f.champion?(f.promotion?'Montée !':'Champion·ne !'):f.relegated?'Relégation':f.objectiveMet?'Objectif atteint':'Objectif manqué';
  const trophies=[]; if(f.champion) trophies.push(`${f.promotion?'⬆️ Montée':'🏆 Titre de champion'} avec ${escapeHtml(f.club)}`); if(f.cupWon) trophies.push(`🥇 Vainqueur de la coupe nationale`); if(f.euroWon) trophies.push(`${COMPETITIONS[f.euroWon].icon} Vainqueur de la ${COMPETITIONS[f.euroWon].label}`); (f.awards||[]).forEach(a=>trophies.push(`🎖️ ${a}`));
  const notes=[]; if(f.unexpectedFlop) notes.push('🌩️ Coup de tabac imprévisible : la saison s\'est effondrée sans raison claire.'); if(f.jackpot) notes.push('🌠 Jackpot : le gros pari s\'est transformé en phénomène.'); if(f.financialDisaster) notes.push('📉 Catastrophe financière : les recettes ont fondu malgré l\'accueil.'); if(f.sagaFatigue) notes.push('😴 Usure du discours : après plusieurs saisons au même club, le message passe moins.'); if(state.currentProduction&&state.currentProduction.delayed) notes.push('🐌 Saison enlisée.');
  return `<div class="card"><div class="result-hero"><span class="result-hero-icon">${icon}</span><h2 class="display">${escapeHtml(f.club)}</h2><div class="verdict">${verdict} · ${f.finalPos}${f.finalPos===1?'er':'e'} sur ${f.teams} · objectif top ${f.objectivePos}</div><div class="hint">${escapeHtml(f.title)} · ${f.duration} saison${f.duration>1?'s':''} · ${f.ageStart} → ${f.ageEnd} ans</div></div>
    <div class="score-grid"><div class="score-box gold"><div class="v">${f.finalPos}${f.finalPos===1?'er':'e'}</div><div class="k">Classement</div></div><div class="score-box ${f.critique>=60?'good':f.critique<40?'bad':''}"><div class="v">${Math.round(f.critique)}</div><div class="k">Presse ${starRating(f.critique)}</div></div><div class="score-box ${f.publicScore>=60?'good':f.publicScore<40?'bad':''}"><div class="v">${Math.round(f.publicScore)}</div><div class="k">Supporters ${starRating(f.publicScore)}</div></div><div class="score-box ${f.profit>=0?'good':'bad'}"><div class="v">${f.profit>=0?'+':''}${euros(f.profit)}</div><div class="k">Bilan (recettes ${euros(f.recette)})</div></div></div>
    ${trophies.map(t=>`<div class="trophy-line">${t}</div>`).join('')}
    ${notes.map(n=>`<div class="warn">${n}</div>`).join('')}
    <div class="two-cols"><div><div class="section-label">Classement final</div>${tableHTML(f.table)}</div><div><div class="section-label">Tes choix</div><div class="hint">Recrue : ${escapeHtml(f.recruit)}<br>Vestiaire : ${escapeHtml(f.vestiaire)}<br>Système : ${escapeHtml(f.tactic)}<br>Staff : ${escapeHtml(f.staff)}<br>Communication : ${escapeHtml(f.promoLabel)}${f.incident?`<br>Incident : ${escapeHtml(f.incident)} → ${escapeHtml(f.incidentChoice||'')}`:''}</div></div></div>
    <div class="section-label">Évolution</div>${deltaChipsHTML(r.before,r.after)}
    <div class="section-label">Usure du club après la saison</div>${systemDeltaHTML(Object.fromEntries(CAREER_SYSTEM_KEYS.map(k=>[k,0])),r.wear)||'<div class="hint">Aucune usure (jauges déjà à zéro).</div>'}
    ${milestonesHTML(r.milestones)}
    <div class="punchline narr">${seasonPunchline(f)}</div>
    <div class="btn-row"><button class="btn" onclick="continueAfterSeasonResult()">Continuer la carrière →</button></div></div>`;
}
function renderAborted(){
  const f=state.lastSeasonResult.season;
  return `<div class="card"><div class="result-hero"><span class="result-hero-icon">🪓</span><h2 class="display">Licencié·e en cours de saison</h2><div class="verdict">${escapeHtml(f.club)}</div></div><p class="narr">Une rupture avec le vestiaire et la direction rend la saison impossible. Le club te remercie à la trêve : ${euros(f.spent)} engagés sont perdus, et cette saison compte comme un échec.</p><div class="hint">Les jauges Intégrité et Vestiaire déterminent ce risque (5 % minimum, jusqu'à 25 %).</div><div class="btn-row"><button class="btn" onclick="continueAfterSeasonResult()">Continuer →</button></div></div>`;
}
function renderChoiceResult(){
  const r=state.pendingResult;
  return `<div class="card"><h2 class="display">${r.title}</h2><div class="subtitle">${escapeHtml(r.subtitle||'')}</div><p class="narr">${escapeHtml(r.narrative||'')}</p>${deltaChipsHTML(r.before,r.after)}${systemDeltaHTML(r.systemBefore,r.systemAfter)}${milestonesHTML(r.milestones)}<div class="btn-row"><button class="btn" onclick="continueAfterChoiceResult()">Continuer →</button></div></div>`;
}
function renderEvent(){
  const ce=state.currentEvent, ev=ce.event;
  const kindLabel={happening:'Coup du sort',issue:'Dilemme structurel',recovery:'Plan de redressement'}[ce.kind];
  const sys=ev.system?BASE_SYSTEM_DEFINITIONS.find(d=>d.key===ev.system):null;
  return `<div class="card event-card"><div class="hint">${kindLabel}${sys?` · jauge ${sys.icon} ${sys.label}`:''}</div><div class="ico">${ev.icon}</div><h2 class="display">${escapeHtml(ev.title)}</h2><p class="narr">${escapeHtml(ev.text)}</p>
    <div class="choice-list">${ev.choices.map((c,i)=>`<button class="choice-btn" onclick="chooseEvent(${i})"><div class="body"><b>${escapeHtml(c.label)}</b>${ce.kind==='recovery'&&c.failChance?`<small>Peut échouer (${Math.round(c.failChance*100)} %).</small>`:''}</div></button>`).join('')}</div></div>`;
}
function renderRoulette(){
  const ev=state.currentRoulette.event;
  return `<div class="card event-card"><div class="hint">🎲 Roulette du destin · une seule des quatre issues met fin à la carrière</div><div class="ico">${ev.icon}</div><h2 class="display">${escapeHtml(ev.title)}</h2><p class="narr">${escapeHtml(ev.text)}</p>
    <div class="roulette-grid">${ev.choices.map((c,i)=>`<button class="choice-btn" onclick="chooseCareerRoulette(${i})"><div class="body"><b>${escapeHtml(c)}</b></div></button>`).join('')}</div><div class="hint" style="margin-top:10px">Issues cachées : ☠️ fin · 🌠 jackpot · 🍀 petit bonus · 🌧️ malus moyen. Les positions sont remélangées à chaque roulette.</div></div>`;
}
function renderEcoFine(){
  const f=state.currentEcoFine, canPay=f.amount<=state.stats.argent;
  return `<div class="card event-card"><div class="ico">🌍</div><h2 class="display">Ligue des défenseurs de la planète</h2><p class="narr">${escapeHtml(f.text)}${f.record?' L\'enquête est qualifiée de record : le montant réclamé dépasse tout ce que le club a jamais payé.':''}</p>
    <div class="loan-box"><span>Amende réclamée</span><span class="big">${euros(f.amount)}</span><span class="hint">Payer ramène l'écologie à 20. Refuser augmente durablement le risque d'arrestation (actuellement ${state.ecoArrestRisk||0} %).</span></div>
    <div class="btn-row"><button class="btn" ${canPay?'':'disabled'} onclick="chooseEcoFine(true)">Payer ${canPay?'':'(capital insuffisant)'}</button><button class="btn danger" onclick="chooseEcoFine(false)">Refuser de payer</button></div></div>`;
}
function renderPressureCrisis(){
  return `<div class="card event-card"><div class="ico">🌡️</div><h2 class="display">Crise de pression</h2><p class="narr">La pression atteint ${Math.round(state.pressure)}/100. Insomnies, malaise au bord du terrain, une famille inquiète. Il faut décider.</p>
    <div class="choice-list">${PRESSURE_CRISIS_CHOICES.map((c,i)=>`<button class="choice-btn" onclick="choosePressureCrisis(${i})"><span class="ico">${c.icon}</span><div class="body"><b>${c.label}</b><small>${c.sub}</small></div></button>`).join('')}</div></div>`;
}
function renderLoanOffer(){
  const d=state.emergencyLoanDraft;
  return `<div class="card event-card"><div class="ico">🏦</div><h2 class="display">L'enveloppe de la dernière chance</h2><p class="narr">Ton capital est tombé à ${euros(d.cashBefore)}. Un mécène mystérieux te propose une enveloppe unique pour relancer ta carrière.</p>
    <div class="loan-box"><span>Montant proposé</span><span class="big">${euros(d.principal)}</span><span class="hint">Deux échéances, une par période. Avant chacune, le solde prend 10 % d'intérêts. Tu choisis librement combien rembourser ; tout doit être soldé à la seconde échéance, sinon radiation.</span></div>
    <div class="btn-row"><button class="btn" onclick="acceptEmergencyLoan()">Accepter l'enveloppe</button><button class="btn danger" onclick="refuseEmergencyLoan()">Refuser et arrêter la carrière</button></div></div>`;
}
function renderLoanPayment(){
  const l=state.emergencyLoan, max=emergencyLoanMaxPayment();
  return `<div class="card event-card"><div class="ico">📅</div><h2 class="display">Échéance ${l.installments}/2 de l'enveloppe</h2><p class="narr">${euros(l.lastInterest)} d'intérêts viennent d'être ajoutés. Solde dû : <b>${euros(l.balance)}</b>. Capital disponible : ${euros(state.stats.argent)}.</p>
    <div class="loan-box"><label>Montant remboursé : <b id="loanShown">${euros(max)}</b></label><input type="range" id="loanRange" min="0" max="${max.toFixed(3)}" step="0.001" value="${max.toFixed(3)}" oninput="document.getElementById('loanShown').textContent=euros(Number(this.value))"><span class="hint">${l.installments>=2?'Dernière échéance : tout solde restant entraîne la radiation.':'Ce qui reste dû prendra 10 % d\'intérêts avant la dernière échéance.'}</span></div>
    <div class="btn-row"><button class="btn" onclick="confirmEmergencyLoanPayment(document.getElementById('loanRange').value)">Valider le remboursement</button></div></div>`;
}

/* ---------- Fin de carrière ---------- */
function toggleSeasonDetail(i){ const el=document.getElementById('sd-'+i); if(el) el.style.display=el.style.display==='none'?'':'none'; }
function seasonLineHTML(f,i){
  const badge=f.aborted?'🪓':f.champion?'🏆':f.relegated?'⬇️':f.isFlop?'🥶':f.isHit?'🔥':'📊';
  return `<div class="season-line" onclick="toggleSeasonDetail(${i})"><span><span class="pos">${badge} ${f.aborted?'—':f.finalPos+'e'}</span> ${escapeHtml(f.club)} · ${escapeHtml(f.title)}</span><span>${f.ageStart} ans · ${TIER_SHORT[f.tierId]}</span></div>
  <div class="season-detail" id="sd-${i}" style="display:none">${f.aborted?'Licenciement en cours de saison.':`Presse ${Math.round(f.critique)} · Supporters ${Math.round(f.publicScore)} · Bilan ${f.profit>=0?'+':''}${euros(f.profit)} · ${f.styleName}<br>Recrue : ${escapeHtml(f.recruit)} · ${escapeHtml(f.vestiaire)} · ${escapeHtml(f.tactic)} · ${escapeHtml(f.staff)} · ${escapeHtml(f.promoLabel)}${f.cupWon?'<br>🥇 Coupe nationale':''}${f.euroWon?`<br>${COMPETITIONS[f.euroWon].icon} ${COMPETITIONS[f.euroWon].label}`:''}${f.awards&&f.awards.length?`<br>🎖️ ${f.awards.join(', ')}`:''}`}</div>`;
}
function renderEnd(){
  const t=state.titles, hits=state.seasons.filter(f=>f.isHit).length, flops=state.seasons.filter(f=>f.isFlop).length;
  const newBadges=[...new Set(state.newlyUnlockedTrophies||[])].map(id=>TROPHY_MAP[id]).filter(Boolean);
  app.innerHTML=`<div class="fade-in"><div class="card"><div class="result-hero"><span class="result-hero-icon">${state.endingCause==='pressureDeath'||state.endingCause==='roulette'?'⚰️':state.endingCause==='age'?'🎗️':'🏁'}</span><h2 class="display">${escapeHtml(state.name)} — ${computeEpithet()}</h2><div class="verdict">${state.careerModeIcon} ${state.careerModeName} · carrière terminée à ${state.age} ans · score ${careerScore()}</div></div>
    <p class="narr">${escapeHtml(state.endingText)}</p>
    <div class="score-grid"><div class="score-box gold"><div class="v">${state.seasons.length}</div><div class="k">Saisons</div></div><div class="score-box good"><div class="v">${t.champion+t.promo}</div><div class="k">Titres et montées</div></div><div class="score-box good"><div class="v">${t.cup+t.euro1+t.euro2}</div><div class="k">Coupes</div></div><div class="score-box gold"><div class="v">${state.awardsWon}</div><div class="k">Récompenses</div></div><div class="score-box"><div class="v">${state.clubsCoached.length}</div><div class="k">Clubs</div></div><div class="score-box ${hits>=flops?'good':'bad'}"><div class="v">${hits} / ${flops}</div><div class="k">Réussites / échecs</div></div><div class="score-box ${state.stats.argent>=0?'good':'bad'}"><div class="v">${euros(state.stats.argent)}</div><div class="k">Capital final</div></div></div>
    ${newBadges.length?`<div class="section-label">Badges débloqués pendant cette carrière</div><div class="badge-grid">${newBadges.map(b=>`<div class="badge"><span class="ico">${b.icon}</span><div><b>${b.label}</b><small>${b.cat}</small></div></div>`).join('')}</div>`:''}
    <div class="section-label">Toutes les saisons</div>${state.seasons.map((f,i)=>seasonLineHTML(f,i)).join('')||'<div class="hint">Aucune saison.</div>'}
    <div class="section-label">Journal complet</div><div class="log" style="max-height:260px">${state.log.map(l=>`<div><span class="age">${l.age} ans</span>${l.msg}</div>`).join('')}</div>
    <div class="btn-row"><button class="btn" onclick="state=null;startCoachCreation()">Nouvelle carrière</button><button class="btn secondary" onclick="state=null;renderStart()">Accueil</button><button class="btn secondary" onclick="renderBadges()">Salle des badges</button></div></div></div>`;
  scrollTop();
}

/* ---------- Badges, panthéon, règles ---------- */
function renderBadges(){
  showGameBanner(); filmstripEl.style.display='none';
  const cats=[...new Set(TROPHIES.map(t=>t.cat))];
  app.innerHTML=`<div class="fade-in"><div class="card"><h2 class="display">Salle des badges</h2><p class="hint">${unlockedTrophies.size} / ${TROPHIES.length} débloqués. Les badges sont conservés dans ce navigateur, toutes carrières confondues.</p>
    ${cats.map(c=>`<div class="badge-cat">${c}</div><div class="badge-grid">${TROPHIES.filter(t=>t.cat===c).map(t=>`<div class="badge ${unlockedTrophies.has(t.id)?'':'locked'}"><span class="ico">${t.icon}</span><div><b>${t.label}</b><small>${unlockedTrophies.has(t.id)?'Débloqué':'Verrouillé'}</small></div></div>`).join('')}</div>`).join('')}
    <div class="btn-row"><button class="btn secondary" onclick="${state?'render()':'renderStart()'}">Retour</button></div></div></div>`; scrollTop();
}
function renderHall(){
  showGameBanner(); filmstripEl.style.display='none';
  const h=hallOfFame();
  app.innerHTML=`<div class="fade-in"><div class="card"><h2 class="display">Panthéon</h2><div class="hall">${h.length?h.map(e=>`<div><span>${e.kind==='player'?'👟':'🧢'} <b>${escapeHtml(e.name)}</b> · ${escapeHtml(e.mode||'')} · ${e.seasons} saisons · ${e.titles} titre${e.titles>1?'s':''} · fin à ${e.age} ans</span><span>score ${e.score}${e.date?` · ${e.date}`:''}</span></div>`).join(''):'<div class="hint">Aucune carrière terminée pour l\'instant.</div>'}</div>
    <div class="btn-row"><button class="btn secondary" onclick="${state?'render()':'renderStart()'}">Retour</button></div></div></div>`; scrollTop();
}
function renderRules(){
  showGameBanner(); filmstripEl.style.display='none';
  app.innerHTML=`<div class="fade-in"><div class="card rules"><h2 class="display">Comment ça marche</h2>
    <h3>Le capital</h3><ul><li>Le capital (en M€) représente l'argent que le football accepte de te confier. Chaque projet engage une part de ce capital ; les recettes de saison (primes, billetterie, plus-values) reviennent dedans.</li><li>À partir du 3e projet, chaque offre reçoit un surcoût caché de 5 à 70 %, tiré vers le haut quand les jauges du club sont mauvaises.</li><li>À zéro, un mécène propose une enveloppe unique avec deux échéances à 10 % d'intérêts. Sans elle, ou sans remboursement complet, la carrière s'arrête.</li></ul>
    <h3>Les six jauges du club</h3><ul>${BASE_SYSTEM_DEFINITIONS.map(d=>`<li><b>${d.icon} ${d.label}</b> : ${d.impact}.</li>`).join('')}<li>Chaque saison use toutes les jauges (−1 à −3). Une jauge à 100 débloque un statut permanent.</li><li>Intégrité et Vestiaire sous 50 : jusqu'à 25 % de risque de licenciement en cours de saison (capital engagé perdu). Direction & staff sous 50 : jusqu'à 25 % de risque que la saison s'enlise (durée et budget doublés).</li><li>Écologie sous 10 : la Ligue des défenseurs de la planète peut infliger une amende ; refuser augmente un risque persistant d'arrestation.</li></ul>
    <h3>Une saison</h3><ul><li>Choix du projet (club, style demandé, objectif, budget), recrue phare, gestion du vestiaire, système de jeu, staff et infrastructures, incident éventuel, communication.</li><li>Le moteur combine tactique, gestion, difficulté du projet, cohérence système/style, expérience dans le style, tendance cachée, pression, moral, staff, jauges et hasard. Un système cohérent avec le style demandé donne un vrai bonus.</li><li>Une saison est ratée quand presse et supporters sont sous 40 (ou en cas de relégation mal vécue). Quatre échecs d'affilée (trois dans « Dernier contrat ») mettent fin à la carrière.</li><li>Rester dans le même club fidélise le public, mais à partir de la 4e saison, le discours s'use.</li></ul>
    <h3>Pression et mortalité</h3><ul><li>Dès 25, la pression réduit la qualité. À 60, elle dégrade le moral. Entre 90 et 99, 1 % de risque de mort par période critique. À 100, une crise impose un choix ; « continuer coûte que coûte » déclenche 50 % de risque de mort.</li></ul>
    <h3>Roulette du destin</h3><ul><li>Éligible après trois saisons, 20 % de chance d'apparaître quand la chaîne d'événements l'atteint, quatre saisons de délai ensuite. Quatre issues cachées : fin, jackpot, petit bonus, malus.</li></ul>
    <h3>Fins de carrière</h3><ul><li>75 ans · capital épuisé · radiation pour dettes · série d'échecs · trois périodes en rupture structurelle · plus aucune offre après 55 ans avec une réputation faible · arrestation écologique · roulette · pression · retraite volontaire.</li></ul>
    <h3>Mode joueur·euse</h3><ul><li>De 17 à 38 ans : ton agent te propose des clubs et des rôles, tu choisis ta préparation et ton attitude, la saison décide de tes buts, de ta note, de ta sélection et de ta valeur. La forme physique remplace le capital : à zéro, le corps lâche.</li></ul>
    <div class="btn-row"><button class="btn secondary" onclick="${state?'render()':'renderStart()'}">Retour</button></div></div></div>`; scrollTop();
}

/* ---------- Démarrage ---------- */
window.addEventListener('DOMContentLoaded',()=>{ renderStart(); });
