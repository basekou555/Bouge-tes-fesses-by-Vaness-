/* ============================== ABSOLUT PLAYER — CARRIÈRE DE JOUEUR·EUSE ==============================
   Une carrière plus courte et plus physique : de 17 à 38 ans, la forme remplace le capital. */

const PLAYER_POSITIONS=[
  { id:'gardien', name:"Gardien·ne", goalsBase:0, assistsBase:0, icon:'🧤' },
  { id:'defenseur', name:"Défenseur·euse", goalsBase:2, assistsBase:2, icon:'🛡️' },
  { id:'milieu', name:"Milieu de terrain", goalsBase:5, assistsBase:7, icon:'🎯' },
  { id:'ailier', name:"Ailier·ère", goalsBase:9, assistsBase:9, icon:'🪽' },
  { id:'attaquant', name:"Attaquant·e", goalsBase:16, assistsBase:4, icon:'⚽' },
];
const PLAYER_ORIGINS=[
  { id:'centre', name:"Centre de formation d'élite", desc:"Formé·e dans une académie réputée : technique soignée, agent déjà en place.", bonus:{technique:6, mental:2, reseau:6}, forme:0 },
  { id:'quartier', name:"Terrain du quartier", desc:"Repéré·e tard, sur un city-stade. Physique et mental d'acier, technique brute.", bonus:{physique:7, mental:5, technique:-3, reseau:-4}, forme:5 },
  { id:'etranger', name:"Arrivé·e de l'étranger", desc:"Un pari d'un recruteur, une langue nouvelle, une famille loin.", bonus:{technique:4, physique:3, mental:-2, reseau:-2}, forme:0 },
  { id:'tardif', name:"Amateur jusqu'à 20 ans", desc:"Un boulot le jour, le foot le soir. Un mental hors norme, un corps à préparer.", bonus:{mental:8, physique:-2, technique:-1, reseau:-5}, forme:-5, age:20 },
  { id:'fils', name:"Enfant d'ancien·ne pro", desc:"Le nom ouvre les portes du centre, et les comparaisons commencent à 8 ans.", bonus:{technique:3, reseau:8, mental:-4}, forme:0 },
];
const PLAYER_TRAITS=[
  { id:'bosseur', name:"Bosseur·euse", desc:"Premier·ère arrivé·e, dernier·ère parti·e.", bonus:{physique:3, mental:2}, growth:.15 },
  { id:'genie', name:"Génie instinctif", desc:"Des gestes que personne n'apprend.", bonus:{technique:6, mental:-2}, growth:0 },
  { id:'leader', name:"Leader naturel", desc:"Le vestiaire t'écoute déjà à 18 ans.", bonus:{mental:5, reseau:2}, growth:.05 },
  { id:'fragile', name:"Corps fragile", desc:"Talent immense, ischios en papier.", bonus:{technique:5, physique:-3}, injury:.08, growth:.05 },
  { id:'fetard', name:"Fêtard·e", desc:"La nuit, tu marques aussi beaucoup.", bonus:{technique:2, mental:-3, reseau:3}, scandal:6, growth:0 },
  { id:'glace', name:"Sang froid", desc:"Un penalty à la 90e ne te fait rien.", bonus:{mental:6}, growth:.05 },
];
const PLAYER_TIERS={
  amateur:{ label:"Club amateur (N2/N3)", salary:[.01,.04], difficulty:0, teams:14, req:()=>true },
  national:{ label:"Ligue 2 / National", salary:[.05,.3], difficulty:8, teams:18, req:(s)=>s.rating>=38 },
  ligue1:{ label:"Ligue 1", salary:[.3,2.5], difficulty:20, teams:18, req:(s)=>s.rating>=52 },
  etranger:{ label:"Championnat étranger", salary:[.4,6], difficulty:15, teams:18, req:(s)=>s.rating>=48&&s.reseau>=20, international:true },
  europe:{ label:"Grand club européen", salary:[2,10], difficulty:30, teams:20, req:(s)=>s.rating>=64&&s.repPublic>=40, international:true },
  superclub:{ label:"Super-club mondial", salary:[8,30], difficulty:42, teams:20, req:(s)=>s.rating>=76&&s.repPublic>=60, international:true },
};
const PLAYER_TIER_ORDER=['amateur','national','ligue1','etranger','europe','superclub'];
const PLAYER_ROLES=[
  { id:'titulaire', name:"Titulaire indiscutable", matches:[30,38], perf:0, pressure:5, growth:1.1 },
  { id:'rotation', name:"Joueur·euse de rotation", matches:[18,28], perf:-2, pressure:0, growth:.9 },
  { id:'remplacant', name:"Remplaçant·e de luxe", matches:[6,16], perf:-4, pressure:-4, growth:.6 },
];
const PLAYER_PREP=[
  { id:'physique', icon:'🏋️', label:"Préparation physique intensive", sub:"Musculation, sprints, sommeil. Le corps devient une machine.", physique:3, forme:4, injury:-.03 },
  { id:'technique', icon:'🎯', label:"Travail technique individuel", sub:"Mille frappes par jour avec un coach personnel.", technique:3, forme:-1 },
  { id:'mental', icon:'🧘', label:"Préparation mentale", sub:"Psychologue, visualisation, méditation.", mental:3, pressure:-5 },
  { id:'vacances', icon:'🏖️', label:"Vraies vacances", sub:"Trois semaines sans ballon. Le corps et la tête récupèrent.", forme:8, technique:-1, moral:6 },
  { id:'fete', icon:'🎉', label:"Été de fête", sub:"Ibiza, yachts et photos partout.", forme:-6, repPublic:3, scandal:5, moral:4 },
  { id:'stage', icon:'🏔️', label:"Stage avec un club prestigieux", sub:"Ton agent te place dans un stage d'élite. Réseau et technique.", technique:2, reseau:4, forme:-2 },
];
const PLAYER_ATTITUDE=[
  { id:'exemplaire', icon:'📏', label:"Professionnel·le exemplaire", sub:"Aucune vague, tout pour l'équipe.", perf:2, critique:3, appeal:0, moral:1 },
  { id:'leader', icon:'🎖️', label:"Leader du vestiaire", sub:"Tu parles, tu rassembles, tu portes le brassard.", perf:3, critique:2, appeal:.02, pressure:4, mental:1 },
  { id:'individualiste', icon:'🦁', label:"Star individualiste", sub:"Les stats d'abord, les coéquipiers ensuite.", perf:4, critique:-3, appeal:.05, union:-3, scandal:3 },
  { id:'showman', icon:'🎪', label:"Showman·woman", sub:"Célébrations chorégraphiées, réseaux sociaux en feu.", perf:0, critique:-1, appeal:.08, repPublic:3, pressure:3 },
  { id:'discret', icon:'🤫', label:"Discret·ète", sub:"Ni interview, ni polémique. Le jeu et rien d'autre.", perf:1, critique:2, appeal:-.03, pressure:-3 },
];
const PLAYER_INCIDENTS=[
  { icon:'🩼', title:"Blessure sérieuse", text:"Une entorse grave à la 9e journée. Le staff parle de trois mois.", choices:[
    { label:"Respecter le protocole", result:"Tu reviens complet, un peu plus tard.", effects:{forme:-4, matches:-8, mental:2} },
    { label:"Revenir en avance", result:"Tu joues, tu rechutes deux fois.", effects:{forme:-12, matches:-5, perf:-2, repPublic:2} },
    { label:"Se soigner à l'étranger", result:"Une clinique miracle, une facture salée.", effects:{forme:-2, matches:-6, money:-.1} } ] },
  { icon:'📞', title:"Un géant t'appelle en janvier", text:"Un super-club veut te recruter au mercato d'hiver. Ton club refuse de te vendre.", choices:[
    { label:"Forcer le transfert", result:"Tu boudes trois semaines, le transfert capote, les supporters t'en veulent.", effects:{repPublic:-6, reseau:4, perf:-3, pressure:6} },
    { label:"Rester pro et attendre l'été", result:"Une saison exemplaire, et un contact chaud pour l'été.", effects:{critique:3, reseau:3, mental:2} },
    { label:"Prolonger avec ton club", result:"Le club double ton salaire. Le géant passe à autre chose.", effects:{money:.3, repPublic:4, reseau:-2} } ] },
  { icon:'🥊', title:"Clash avec le coach", text:"Remplacé·e à la mi-temps trois fois de suite, tu explose en conférence de presse.", choices:[
    { label:"S'excuser publiquement", result:"Le coach te reprend, l'incident est clos.", effects:{critique:1, mental:1, matches:-2} },
    { label:"Persister", result:"Mise à l'écart d'un mois, mais ton agent s'active.", effects:{matches:-8, reseau:3, perf:-2, repPublic:2, scandal:3} },
    { label:"Régler ça en privé", result:"Une discussion d'adultes. Tu retrouves ta place.", effects:{mental:2, perf:1} } ] },
  { icon:'📱', title:"Vidéo de soirée", text:"Une vidéo de toi dansant sur une table à 4 h du matin, la veille d'un match, fait le tour du monde.", choices:[
    { label:"Assumer avec humour", result:"Les fans adorent, le coach beaucoup moins.", effects:{repPublic:5, critique:-3, scandal:4} },
    { label:"S'excuser et payer l'amende", result:"Sobre et efficace.", effects:{money:-.05, critique:1} },
    { label:"Nier", result:"Personne ne te croit.", effects:{critique:-4, scandal:6, mental:-2} } ] },
  { icon:'🇫🇷', title:"Pré-liste de la sélection", text:"Tu figures sur une pré-liste nationale. Le sélectionneur veut te voir jouer davantage à un autre poste.", choices:[
    { label:"Accepter de changer de poste", result:"Une adaptation difficile, mais des portes s'ouvrent.", effects:{perf:-2, technique:2, selectionBoost:8} },
    { label:"Rester à ton poste", result:"Tu joues ton meilleur football, la sélection attendra.", effects:{perf:2, selectionBoost:-3} },
    { label:"Demander conseil à ton agent", result:"Il négocie un compromis avec ton club.", effects:{reseau:2, selectionBoost:3} } ] },
  { icon:'💰', title:"Contrat publicitaire", text:"Une marque de boisson énergisante te propose une fortune pour des spots ridicules.", choices:[
    { label:"Signer", result:"Le compte en banque explose, la crédibilité un peu moins.", effects:{money:.4, repPublic:3, critique:-2, pressure:2} },
    { label:"Refuser", result:"Ton agent pleure.", effects:{reseau:-2, critique:2} },
    { label:"Signer avec une marque locale à la place", result:"Moins d'argent, plus de sympathie.", effects:{money:.08, repPublic:4, critique:1} } ] },
  { icon:'🧠', title:"Baisse de confiance", text:"Dix matchs sans marquer, sans passe décisive, sans sourire.", choices:[
    { label:"Voir un préparateur mental", result:"Deux séances, et le déclic.", effects:{mental:3, perf:1, money:-.02} },
    { label:"S'entraîner encore plus", result:"Le corps encaisse, la tête un peu moins.", effects:{physique:2, forme:-4, perf:0} },
    { label:"Demander une semaine de repos", result:"Le coach comprend. Tu reviens plus frais·che.", effects:{forme:3, moral:5, matches:-2} } ] },
  { icon:'🤝', title:"Un jeune te demande de l'aide", text:"Un gamin de 17 ans du centre te prend pour modèle.", choices:[
    { label:"Devenir son mentor", result:"Il progresse, et toi aussi : expliquer, c'est comprendre.", effects:{mental:2, critique:2, union:2} },
    { label:"Lui donner quelques conseils", result:"Un geste apprécié.", effects:{repPublic:1} },
    { label:"L'ignorer, la concurrence c'est la concurrence", result:"Il prend ta place deux ans plus tard.", effects:{mental:-1, critique:-2} } ] },
];
const PLAYER_AWARD_NAME="Ballon de platine";

function playerRating(s){ return s.technique*.4+s.physique*.3+s.mental*.3; }
function freshPlayerState(profile,name){
  const st={technique:34,physique:34,mental:34,reseau:15,repCritique:45,repPublic:40,moral:65};
  [profile.origin,profile.trait].forEach(o=>Object.entries(o.bonus||{}).forEach(([k,v])=>st[k]=(st[k]||0)+v));
  Object.keys(st).forEach(k=>st[k]=clamp(st[k]));
  return { kind:'player', name:name||"Anonyme", position:profile.position, originName:profile.origin.name, traitName:profile.trait.name, traitId:profile.trait.id, injuryMod:profile.trait.injury||0, growthMod:profile.trait.growth||0,
    age:profile.origin.age||17, stats:{...st, argent:0, scandalRisk:profile.trait.scandal||0}, forme:clamp(70+(profile.origin.forme||0)), pressure:8,
    seasons:[], club:null, seasonsAtClub:0, clubs:[], totals:{matches:0,goals:0,assists:0,titles:0,cups:0,selections:0,awards:0,earned:0},
    log:[], consecutiveBad:0, consecutiveNoOffers:0, selectionBoost:0, selected:false, ended:false, endingText:'', pendingChoice:null, currentOffers:[], currentSeason:null, lastResult:null, newlyUnlockedTrophies:[] };
}
function savePlayerGame(){ if(state&&state.kind==='player') lsSet(PLAYER_SAVE_KEY,state); }
function continuePlayerGame(){ const s=lsGet(PLAYER_SAVE_KEY,null); if(s&&!s.ended){ state=s; render(); } else renderStart(); }
function plog(msg){ state.log.unshift({age:state.age,msg}); }
function playerApply(effects,ctx={}){
  const s=state.stats;
  Object.entries(effects||{}).forEach(([k,v])=>{
    if(['technique','physique','mental','reseau','repCritique','repPublic','moral'].includes(k)) s[k]=clamp((s[k]||0)+v);
    else if(k==='money'){ s.argent+=v; state.totals.earned+=Math.max(0,v); }
    else if(k==='forme') state.forme=clamp(state.forme+v);
    else if(k==='pressure') state.pressure=clamp(state.pressure+v);
    else if(k==='scandal') s.scandalRisk=clamp((s.scandalRisk||0)+v);
    else if(k==='selectionBoost') state.selectionBoost+=v;
    else if(ctx.season){ ctx.season[k+'Accum']=(ctx.season[k+'Accum']||0)+v; }
  });
}

/* ---------- Création ---------- */
let pcreation=null;
function startPlayerCreation(){ pcreation={step:0,name:'',position:null,origin:null,trait:null}; state=null; renderPlayerCreation(); }
function pcreatePick(k,v){ pcreation[k]=v; pcreation.step++; renderPlayerCreation(); }
function renderPlayerCreation(){
  showGameBanner(); document.documentElement.setAttribute('data-theme','player'); document.title='Absolut Player'; filmstripEl.style.display='none';
  const steps=['name','position','origin','trait','summary'], step=steps[pcreation.step];
  const back=`<div class="btn-row"><button class="btn secondary" onclick="if(pcreation.step>0){pcreation.step--;renderPlayerCreation();}else renderStart();">← Retour</button></div>`;
  let html='';
  if(step==='name') html=`<div class="card"><h2 class="display">Ton nom de joueur·euse</h2><input type="text" id="pName" maxlength="28" placeholder="Ex. Malo Kerbrat" value="${escapeHtml(pcreation.name)}"><div class="btn-row"><button class="btn secondary" onclick="renderStart()">Accueil</button><button class="btn" onclick="pcreatePick('name',document.getElementById('pName').value.trim()||'Anonyme')">Continuer →</button></div></div>`;
  else if(step==='position') html=`<div class="card"><h2 class="display">Ton poste</h2><div class="mode-grid">${PLAYER_POSITIONS.map((p,i)=>`<button class="mode-card" onclick="pcreatePick('position',PLAYER_POSITIONS[${i}])"><div class="mode-icon">${p.icon}</div><div class="mode-copy"><b>${p.name}</b><span>${p.goalsBase?`Environ ${p.goalsBase} buts et ${p.assistsBase} passes par saison pleine à bon niveau.`:'Les buts ne sont pas ton affaire, les arrêts si.'}</span></div></button>`).join('')}</div>${back}</div>`;
  else if(step==='origin') html=`<div class="card"><h2 class="display">D'où viens-tu ?</h2><div class="mode-grid">${PLAYER_ORIGINS.map((o,i)=>`<button class="mode-card" onclick="pcreatePick('origin',PLAYER_ORIGINS[${i}])"><div class="mode-copy"><b>${o.name}</b><span>${o.desc}</span><div class="chip-row">${Object.entries(o.bonus).map(([k,v])=>`<span class="chip ${v>0?'good':'bad'}">${k} ${v>0?'+':''}${v}</span>`).join('')}</div></div></button>`).join('')}</div>${back}</div>`;
  else if(step==='trait') html=`<div class="card"><h2 class="display">Ton trait de caractère</h2><div class="mode-grid">${PLAYER_TRAITS.map((t,i)=>`<button class="mode-card" onclick="pcreatePick('trait',PLAYER_TRAITS[${i}])"><div class="mode-copy"><b>${t.name}</b><span>${t.desc}</span><div class="chip-row">${Object.entries(t.bonus).map(([k,v])=>`<span class="chip ${v>0?'good':'bad'}">${k} ${v>0?'+':''}${v}</span>`).join('')}${t.injury?'<span class="chip bad">Blessures +</span>':''}${t.scandal?'<span class="chip bad">Scandale +</span>':''}</div></div></button>`).join('')}</div>${back}</div>`;
  else { const tmp=freshPlayerState(pcreation,pcreation.name); html=`<div class="card"><h2 class="display">${escapeHtml(pcreation.name)}</h2><div class="identity">${pcreation.position.icon} ${pcreation.position.name} · ${pcreation.origin.name} · ${pcreation.trait.name} · ${tmp.age} ans</div>
    ${['technique','physique','mental','reseau','repCritique','repPublic','moral'].map(k=>`<div class="stat-row"><div class="lbl"><span>${capitalize(k==='repCritique'?'réputation presse':k==='repPublic'?'cote supporters':k)}</span><b>${Math.round(tmp.stats[k])}</b></div><div class="bar"><i style="width:${tmp.stats[k]}%"></i></div></div>`).join('')}
    <div class="stat-row"><div class="lbl"><span>Forme physique</span><b>${tmp.forme}</b></div><div class="bar"><i style="width:${tmp.forme}%"></i></div></div>
    <div class="btn-row">${back.replace('<div class="btn-row">','').replace('</div>','')}<button class="btn" onclick="launchPlayerCareer()">Commencer la carrière 👟</button></div></div>`; }
  app.innerHTML=`<div class="fade-in"><div class="creation-progress"><span>Étape ${pcreation.step+1}/${steps.length}</span><div class="track"><i style="width:${Math.round((pcreation.step+1)/steps.length*100)}%"></i></div></div>${html}</div>`; scrollTop();
}
function launchPlayerCareer(){ state=freshPlayerState(pcreation,pcreation.name); plog(`👟 Début de carrière à ${state.age} ans : ${state.originName}, ${state.position.name}.`); pcreation=null; playerOpenOffers(); render(); }

/* ---------- Offres ---------- */
function playerGenerateOffers(){
  const s={...state.stats, rating:playerRating(state.stats)};
  const tiers=PLAYER_TIER_ORDER.filter(t=>PLAYER_TIERS[t].req(s));
  let count=2+(state.seasons.length>=2?1:0)+(s.repPublic>=55?1:0); count=Math.min(4,count);
  if(state.age>=33&&s.rating<55) count=Math.max(0,count-1); if(state.age>=35&&s.rating<50) count=Math.max(0,count-1);
  const offers=[];
  if(state.club&&state.seasons.length&&!state.seasons[state.seasons.length-1].bad&&Math.random()<.65){
    const last=state.seasons[state.seasons.length-1]; const tier=PLAYER_TIERS[last.tierId];
    offers.push({club:state.club,tierId:last.tierId,tierLabel:tier.label,role:pick(PLAYER_ROLES.slice(0,2)),salary:clamp(last.salary*rand(1,1.4),tier.salary[0],tier.salary[1]*1.2),duration:clamp(randInt(1,3),1,Math.max(1,38-state.age)),stay:true,teams:tier.teams});
  }
  while(offers.length<count){
    const idx=Math.min(tiers.length-1,Math.max(0,Math.floor(rand(0,tiers.length))+(s.rating>=65?0:-1)));
    const tierId=tiers[clamp(idx,0,tiers.length-1)], tier=PLAYER_TIERS[tierId];
    const rating=s.rating, diffGap=rating-tier.difficulty-40;
    const role=diffGap>=15?pick([PLAYER_ROLES[0],PLAYER_ROLES[0],PLAYER_ROLES[1]]):diffGap>=0?pick([PLAYER_ROLES[0],PLAYER_ROLES[1],PLAYER_ROLES[1]]):pick([PLAYER_ROLES[1],PLAYER_ROLES[2],PLAYER_ROLES[2]]);
    const league=tierId==='etranger'?pick(LEAGUES):null;
    offers.push({club:generateClubName(tierId==='ligue1'?'ligue1':tierId,league),league,tierId,tierLabel:tier.label,role,salary:rand(tier.salary[0],tier.salary[1])*(role.id==='titulaire'?1:role.id==='rotation'?.8:.6),duration:clamp(randInt(1,3),1,Math.max(1,38-state.age)),teams:tier.teams,international:tier.international});
  }
  return offers;
}
function playerOpenOffers(){ state.currentOffers=playerGenerateOffers(); state.consecutiveNoOffers=state.currentOffers.length?0:(state.consecutiveNoOffers||0)+1; state.pendingChoice='offers'; playerCheckEnd(); savePlayerGame(); }
function playerChooseOffer(i){
  const o=state.currentOffers[i]; if(!o) return;
  state.currentSeason={offer:o,prep:null,attitude:null,incident:null,perfAccum:0,critiqueAccum:0,appealAccum:0,matchesAccum:0,unionAccum:0};
  state.currentSeason.prepOptions=shuffledCopy(PLAYER_PREP).slice(0,4);
  state.pendingChoice='prep'; plog(`🖊️ Tu signes à <b>${o.club}</b> (${o.tierLabel}) comme ${o.role.name.toLowerCase()} pour ${euros(o.salary)} par saison.`); savePlayerGame();
}
function playerChoosePrep(i){ const c=state.currentSeason, p=c.prepOptions[i]; if(!p) return; c.prep=p; playerApply({technique:p.technique||0,physique:p.physique||0,mental:p.mental||0,reseau:p.reseau||0,repPublic:p.repPublic||0,forme:p.forme||0,pressure:p.pressure||0,scandal:p.scandal||0,moral:p.moral||0}); c.injuryMod=(p.injury||0); c.attitudeOptions=shuffledCopy(PLAYER_ATTITUDE).slice(0,4); state.pendingChoice='attitude'; savePlayerGame(); }
function playerChooseAttitude(i){ const c=state.currentSeason, a=c.attitudeOptions[i]; if(!a) return; c.attitude=a; playerApply({repPublic:a.repPublic||0,pressure:a.pressure||0,scandal:a.scandal||0,mental:a.mental||0,moral:a.moral||0}); c.perfAccum+=a.perf||0; c.critiqueAccum+=a.critique||0; c.appealAccum+=a.appeal||0; if(Math.random()<.7){ c.incident=pickNoRepeat('pincidents',PLAYER_INCIDENTS); state.pendingChoice='incident'; } else { playerResolveSeason(); } savePlayerGame(); }
function playerChooseIncident(i){ const c=state.currentSeason, inc=c.incident, ch=inc.choices[i]; if(!ch) return; playerApply(ch.effects,{season:c}); c.incidentLabel=`${inc.title} → ${ch.label}`; plog(`${inc.icon} <b>${inc.title}</b> → ${ch.label}. ${ch.result}`); playerResolveSeason(); savePlayerGame(); }

/* ---------- Résolution ---------- */
function playerResolveSeason(){
  const c=state.currentSeason, o=c.offer, tier=PLAYER_TIERS[o.tierId], s=state.stats, pos=state.position;
  const rating=playerRating(s);
  const ageFactor=state.age<=20?-3:state.age<=23?-1:state.age<=29?2:state.age<=31?0:state.age<=33?-3:-6;
  const formeFactor=(state.forme-60)*.15;
  const level=45+(rating-35)*1.2;
  const diff=Math.max(0,tier.difficulty-(rating-35)*1.2)*.5;
  const pressurePenalty=Math.max(0,state.pressure-30)*.2;
  let perf=clamp(level+ageFactor+formeFactor-diff-pressurePenalty+o.role.perf+(c.perfAccum||0)+rand(-10,10)+(s.moral-60)*.1,0,100);
  const injuryChance=clamp(.12+state.injuryMod+(c.injuryMod||0)+(state.age>=31?.05:0)+(state.forme<40?.1:0),.03,.5);
  let injured=false, injuryWeeks=0;
  if(Math.random()<injuryChance){ injured=true; injuryWeeks=randInt(3,26); state.forme=clamp(state.forme-injuryWeeks*.6); }
  let matches=clamp(randInt(o.role.matches[0],o.role.matches[1])+(c.matchesAccum||0)-Math.round(injuryWeeks*.6)+(perf>=70?4:perf<40?-5:0),0,45);
  const goals=pos.goalsBase?Math.max(0,Math.round(pos.goalsBase*(matches/34)*(perf/65)*rand(.5,1.3))):0;
  const assists=pos.assistsBase?Math.max(0,Math.round(pos.assistsBase*(matches/34)*(perf/65)*rand(.5,1.3))):0;
  const cleanSheets=pos.id==='gardien'?Math.round(matches*clamp(perf/200+.1,.05,.6)):0;
  const note=clamp(5+(perf-40)/20+rand(-.3,.3),4,9.5);
  const critique=clamp(perf*.7+(c.critiqueAccum||0)*2+rand(-8,8)+(o.role.id==='titulaire'?5:0),0,100);
  const publicScore=clamp(perf*.6+goals*1.2+assists*.8+(c.appealAccum||0)*100+rand(-8,8)+(o.stay?5:0),0,100);
  // Résultat collectif
  const teamPerf=clamp(50+(perf-50)*.35+rand(-18,18)+({superclub:22,europe:10,etranger:3,ligue1:0,national:0,amateur:0}[o.tierId]||0),0,100);
  const teamPos=clamp(1+Math.round(clamp(.5-(teamPerf-50)/40,0,1)*(tier.teams-1)),1,tier.teams);
  const champion=teamPos===1, cup=Math.random()<clamp((teamPerf-50)/100*.4,.02,.3), relegated=teamPos>tier.teams-3;
  const selectionChance=clamp((perf-58)/60+(s.repPublic-50)/200+state.selectionBoost*.01+(tier.international?.1:0),0,.85);
  const selected=state.age>=19&&state.age<=34&&Math.random()<selectionChance;
  const award=(o.tierId==='superclub'||o.tierId==='europe')&&perf>=84&&Math.random()<.35;
  const bad=perf<38||(critique<38&&publicScore<38);
  const good=perf>=68;
  const salary=o.salary*(matches/34>1?1:1)+ (champion?o.salary*.2:0)+(selected?o.salary*.1:0)+(award?o.salary*.5:0);
  const before={technique:s.technique,physique:s.physique,mental:s.mental,reseau:s.reseau,repCritique:s.repCritique,repPublic:s.repPublic,moral:s.moral,forme:state.forme,pressure:state.pressure};
  // Progression : forte avant 24, plateau, déclin après 31
  const growthBase=state.age<=23?4.5:state.age<=28?2.2:state.age<=31?.5:-1.8;
  const g=growthBase*o.role.growth*(1+state.growthMod)*(matches/30);
  s.technique=clamp(s.technique+g*(state.age<=31?1:.6)+(c.prep&&c.prep.id==='technique'?.5:0));
  s.physique=clamp(s.physique+g+(state.age>=30?-1.5:0));
  s.mental=clamp(s.mental+Math.abs(g)*.6+(good?1:0));
  s.reseau=clamp(s.reseau+(tier.international?3:1)+(selected?3:0));
  s.repCritique=clamp(s.repCritique+(critique-50)*.16);
  s.repPublic=clamp(s.repPublic+(publicScore-50)*.16+(champion?3:0)+(award?6:0));
  s.moral=clamp(s.moral+(good?6:bad?-8:0)+(champion?4:0)+(relegated?-4:0));
  s.argent+=salary; state.totals.earned+=salary;
  state.pressure=clamp(state.pressure+o.role.pressure+(bad?8:0)-(good?4:0)+(tier.difficulty>=30?4:0)-3);
  state.forme=clamp(state.forme-matches*.12-(state.age>=30?4:0)-(state.age>=34?4:0)+(c.prep&&c.prep.id==='physique'?3:0));
  s.scandalRisk=Math.max(0,(s.scandalRisk||0)-2);
  state.age+=o.duration;
  state.consecutiveBad=bad?state.consecutiveBad+1:0;
  if(state.club===o.club) state.seasonsAtClub++; else { state.club=o.club; state.seasonsAtClub=1; }
  if(!state.clubs.includes(o.club)) state.clubs.push(o.club);
  state.totals.matches+=matches*o.duration; state.totals.goals+=goals*o.duration; state.totals.assists+=assists*o.duration; if(champion) state.totals.titles++; if(cup) state.totals.cups++; if(selected){ state.totals.selections+=randInt(2,9); state.selected=true; } if(award) state.totals.awards++;
  const season={n:state.seasons.length+1,club:o.club,tierId:o.tierId,tierLabel:o.tierLabel,role:o.role.name,salary:o.salary,duration:o.duration,age:state.age-o.duration,perf,note,matches,goals,assists,cleanSheets,critique,publicScore,teamPos,teams:tier.teams,champion,cup,relegated,selected,award,injured,injuryWeeks,bad,good,prep:c.prep?c.prep.label:'',attitude:c.attitude?c.attitude.label:'',incident:c.incidentLabel||null,earned:salary};
  state.seasons.push(season);
  unlockTrophy('player-first-season'); if(champion) unlockTrophy('player-title'); if(award) unlockTrophy('player-ballon'); if(state.totals.goals>=100) unlockTrophy('player-100-goals'); if(selected) unlockTrophy('player-selection'); if(o.tierId==='superclub') unlockTrophy('player-superclub'); if(state.seasonsAtClub>=8) unlockTrophy('player-legend');
  const after={technique:s.technique,physique:s.physique,mental:s.mental,reseau:s.reseau,repCritique:s.repCritique,repPublic:s.repPublic,moral:s.moral,forme:state.forme,pressure:state.pressure};
  state.lastResult={season,before,after};
  state.currentSeason=null; state.pendingChoice='result';
  plog(`📊 Saison à <b>${o.club}</b> : ${matches} matchs, ${goals} buts, ${assists} passes, note ${note.toFixed(1)}. Le club finit ${teamPos}e${champion?' 🏆':relegated?' ⬇️':''}.${selected?' 🇫🇷 Sélectionné·e !':''}${award?` 🏅 ${PLAYER_AWARD_NAME} !`:''}`);
}
function playerContinue(){
  if(state.ended){ render(); return; }
  if(state.forme<=0){ unlockTrophy('player-injury'); playerEnd(`Ton corps ne suit plus : une blessure de trop met fin à ta carrière à ${state.age} ans.`,'injury'); render(); return; }
  if(state.pressure>=100){ state.pressure=70; state.stats.moral-=10; plog(`🌡️ Burn-out : tu prends six mois loin des terrains.`); state.age+=1; state.forme=clamp(state.forme+10); }
  state.forme=clamp(state.forme+6);
  playerOpenOffers(); render();
}
function playerCheckEnd(){
  if(state.ended) return true;
  if(state.age>=38){ unlockTrophy('player-retire'); playerEnd(`À ${state.age} ans, tu raccroches les crampons après une longue carrière.`,'age'); return true; }
  if(state.consecutiveBad>=4){ playerEnd(`Quatre saisons ratées d'affilée : plus aucun club ne te fait confiance.`,'bad'); return true; }
  if(!state.currentOffers.length&&(state.consecutiveNoOffers||0)>=2){ playerEnd(`Deux années sans proposition. Le téléphone ne sonne plus : fin de carrière.`,'noOffers'); return true; }
  return false;
}
function playerSkipYear(){ state.age+=1; state.forme=clamp(state.forme+8); state.stats.repPublic-=3; state.stats.reseau-=2; state.pressure=clamp(state.pressure-10); plog(`🛋️ Une année sans club.`); state.club=null; state.seasonsAtClub=0; playerOpenOffers(); render(); }
function playerScore(){ const t=state.totals; return Math.round(state.seasons.length*8+t.goals*2+t.assists+t.titles*40+t.cups*20+t.selections*3+t.awards*100+t.earned); }
function playerEnd(reason,cause){
  state.ended=true; state.endingText=reason; state.endingCause=cause; state.pendingChoice='end'; unlockTrophy('player-retire');
  saveToHallOfFame({kind:'player',name:state.name,mode:state.position.name,seasons:state.seasons.length,titles:state.totals.titles,age:state.age,cause,score:playerScore(),date:new Date().toISOString().slice(0,10)});
  try{ localStorage.removeItem(PLAYER_SAVE_KEY); }catch(e){}
}

/* ---------- Rendu ---------- */
function playerSidebar(){
  const s=state.stats, t=state.totals;
  const bar=(l,v,cls='')=>`<div class="stat-row"><div class="lbl"><span>${l}</span><b>${Math.round(v)}</b></div><div class="bar ${cls}"><i style="width:${clamp(v)}%"></i></div></div>`;
  return `<div class="card"><div class="identity"><b>${escapeHtml(state.name)}</b> · ${state.age} ans · ${state.position.icon} ${state.position.name}<br>${state.club?`🏟️ ${escapeHtml(state.club)} (saison ${state.seasonsAtClub})`:'Sans club'}</div>
    <div class="money">${euros(s.argent)}</div><div class="hint">Gains cumulés</div>
    <div class="section-label">Qualités</div>${bar('Technique',s.technique)}${bar('Physique',s.physique)}${bar('Mental',s.mental)}${bar('Note globale',playerRating(s))}
    <div class="section-label">Carrière</div>${bar('Réseau (agent)',s.reseau)}${bar('Réputation presse',s.repCritique)}${bar('Cote supporters',s.repPublic)}${bar('Moral',s.moral)}
    <div class="section-label">Corps</div>${bar('Forme physique',state.forme)}${bar('Pression',state.pressure,'pressure')}
    <div class="section-label">Totaux</div><div class="hint">${t.matches} matchs · ${t.goals} buts · ${t.assists} passes · 🏆 ${t.titles} · 🥇 ${t.cups} · 🇫🇷 ${t.selections} sélections · 🏅 ${t.awards}</div></div>
    <div class="card"><div class="section-label">Journal</div><div class="log">${state.log.slice(0,30).map(l=>`<div><span class="age">${l.age} ans</span>${l.msg}</div>`).join('')}</div></div>
    <div class="card"><div class="btn-row"><button class="btn secondary small" onclick="goHomeFromGame()">Accueil (sauvegarde)</button><button class="btn danger small" onclick="if(confirm('Raccrocher les crampons ?')){playerEnd('Tu décides de raccrocher les crampons.','retire');render();}">Prendre ma retraite</button></div></div>`;
}
function playerDeltaChips(b,a){
  const labels={technique:'Technique',physique:'Physique',mental:'Mental',reseau:'Réseau',repCritique:'Presse',repPublic:'Cote',moral:'Moral',forme:'Forme',pressure:'Pression'};
  const chips=Object.keys(labels).map(k=>{ const d=(a[k]||0)-(b[k]||0); if(Math.abs(d)<.5) return ''; const good=k==='pressure'?d<0:d>0; return `<span class="delta-chip ${good?'up':'down'}">${labels[k]} ${d>0?'+':''}${Math.round(d)}</span>`; }).filter(Boolean);
  return chips.length?`<div class="delta-chips">${chips.join('')}</div>`:'';
}
function renderPlayerScreen(){
  showGameBanner();
  filmstripEl.style.display=''; filmstripEl.innerHTML=state.seasons.map(f=>`<div class="frame ${f.bad?'flop':f.good?'success':'mid'}" title="${escapeHtml(f.club)}">${f.n}. ${f.champion?'🏆':f.note.toFixed(1)}</div>`).join('')||'<div class="frame">Aucune saison</div>';
  if(state.ended){ renderPlayerEnd(); return; }
  let main='';
  const pc=state.pendingChoice, c=state.currentSeason;
  if(pc==='offers'){
    const offers=state.currentOffers;
    main=offers.length?`<div class="card"><h2 class="display">Ton agent a des propositions</h2><p class="hint">${state.age} ans · note globale ${Math.round(playerRating(state.stats))}. Le rôle promis pèse sur le temps de jeu, la progression et la pression.</p>
      <div class="offer-grid">${offers.map((o,i)=>`<div class="offer-card affordable" onclick="playerChooseOffer(${i});render()"><div class="club">${escapeHtml(o.club)}${o.league?` · ${o.league.name}`:''}</div><h3>${o.stay?'Prolonger':'Signer'} — ${o.role.name}</h3><div class="meta"><span class="tag gold">${o.tierLabel}</span><span class="tag">${o.duration} saison${o.duration>1?'s':''}</span>${o.international?'<span class="tag intl">🌍</span>':''}</div><div class="budget">${euros(o.salary)} / saison</div><div class="offer-hint">${o.stay?'🏠 Continuité et affection du public':o.role.id==='titulaire'?'⭐ Temps de jeu garanti, pression maximale':o.role.id==='rotation'?'🔄 Du temps de jeu à gagner':'🪑 Peu de matchs, moins de pression, progression lente'}</div></div>`).join('')}</div>
      <div class="btn-row"><button class="btn secondary" onclick="playerSkipYear()">Refuser tout et attendre une année</button></div></div>`
      :`<div class="card"><h2 class="display">Aucune proposition</h2><p class="narr">Ton agent ne répond plus. Le marché t'a oublié·e cette année.</p><div class="btn-row"><button class="btn" onclick="playerSkipYear()">Attendre une année</button></div></div>`;
  } else if(pc==='prep'){
    main=`<div class="card"><div class="hint">🏟️ ${escapeHtml(c.offer.club)} · ${c.offer.role.name}</div><h2 class="display">Ton été</h2><div class="choice-list">${c.prepOptions.map((p,i)=>`<button class="choice-btn" onclick="playerChoosePrep(${i});render()"><span class="ico">${p.icon}</span><div class="body"><b>${p.label}</b><small>${p.sub}</small></div></button>`).join('')}</div></div>`;
  } else if(pc==='attitude'){
    main=`<div class="card"><div class="hint">🏟️ ${escapeHtml(c.offer.club)} · ${c.offer.role.name}</div><h2 class="display">Ton attitude cette saison</h2><div class="choice-list">${c.attitudeOptions.map((a,i)=>`<button class="choice-btn" onclick="playerChooseAttitude(${i});render()"><span class="ico">${a.icon}</span><div class="body"><b>${a.label}</b><small>${a.sub}</small></div></button>`).join('')}</div></div>`;
  } else if(pc==='incident'){
    const inc=c.incident;
    main=`<div class="card event-card"><div class="ico">${inc.icon}</div><h2 class="display">${escapeHtml(inc.title)}</h2><p class="narr">${escapeHtml(inc.text)}</p><div class="choice-list">${inc.choices.map((ch,i)=>`<button class="choice-btn" onclick="playerChooseIncident(${i});render()"><div class="body"><b>${escapeHtml(ch.label)}</b></div></button>`).join('')}</div></div>`;
  } else if(pc==='result'){
    const r=state.lastResult, f=r.season;
    const lines=[]; if(f.champion) lines.push(`🏆 Champion·ne avec ${escapeHtml(f.club)}`); if(f.cup) lines.push('🥇 Vainqueur de la coupe'); if(f.selected) lines.push('🇫🇷 Appelé·e en sélection nationale'); if(f.award) lines.push(`🏅 ${PLAYER_AWARD_NAME}`); if(f.injured) lines.push(`🩼 Blessure : ${f.injuryWeeks} semaines d'absence`); if(f.relegated) lines.push('⬇️ Le club est relégué');
    main=`<div class="card"><div class="result-hero"><span class="result-hero-icon">${f.award?'🏅':f.champion?'🏆':f.bad?'🥶':f.good?'🔥':'📊'}</span><h2 class="display">${escapeHtml(f.club)}</h2><div class="verdict">${f.role} · note ${f.note.toFixed(1)} · club ${f.teamPos}e sur ${f.teams}</div></div>
      <div class="score-grid"><div class="score-box gold"><div class="v">${f.matches}</div><div class="k">Matchs</div></div>${state.position.id==='gardien'?`<div class="score-box good"><div class="v">${f.cleanSheets}</div><div class="k">Clean sheets</div></div>`:`<div class="score-box good"><div class="v">${f.goals}</div><div class="k">Buts</div></div><div class="score-box good"><div class="v">${f.assists}</div><div class="k">Passes</div></div>`}<div class="score-box ${f.critique>=60?'good':f.critique<40?'bad':''}"><div class="v">${Math.round(f.critique)}</div><div class="k">Presse</div></div><div class="score-box ${f.publicScore>=60?'good':f.publicScore<40?'bad':''}"><div class="v">${Math.round(f.publicScore)}</div><div class="k">Supporters</div></div><div class="score-box gold"><div class="v">${euros(f.earned)}</div><div class="k">Gains</div></div></div>
      ${lines.map(l=>`<div class="trophy-line">${l}</div>`).join('')}<div class="hint">${escapeHtml(f.prep)} · ${escapeHtml(f.attitude)}${f.incident?` · ${escapeHtml(f.incident)}`:''}</div>
      ${playerDeltaChips(r.before,r.after)}<div class="btn-row"><button class="btn" onclick="playerContinue()">Continuer →</button></div></div>`;
  }
  app.innerHTML=`<div class="layout fade-in"><div class="main">${main}</div><div class="sidebar">${playerSidebar()}</div></div>`; scrollTop();
}
function renderPlayerEnd(){
  const t=state.totals, newBadges=[...new Set(state.newlyUnlockedTrophies||[])].map(id=>TROPHY_MAP[id]).filter(Boolean);
  app.innerHTML=`<div class="fade-in"><div class="card"><div class="result-hero"><span class="result-hero-icon">🎗️</span><h2 class="display">${escapeHtml(state.name)}</h2><div class="verdict">${state.position.icon} ${state.position.name} · carrière terminée à ${state.age} ans · score ${playerScore()}</div></div><p class="narr">${escapeHtml(state.endingText)}</p>
    <div class="score-grid"><div class="score-box gold"><div class="v">${state.seasons.length}</div><div class="k">Saisons</div></div><div class="score-box"><div class="v">${t.matches}</div><div class="k">Matchs</div></div><div class="score-box good"><div class="v">${t.goals}</div><div class="k">Buts</div></div><div class="score-box good"><div class="v">${t.assists}</div><div class="k">Passes</div></div><div class="score-box gold"><div class="v">${t.titles+t.cups}</div><div class="k">Trophées</div></div><div class="score-box"><div class="v">${t.selections}</div><div class="k">Sélections</div></div><div class="score-box gold"><div class="v">${t.awards}</div><div class="k">${PLAYER_AWARD_NAME}</div></div><div class="score-box good"><div class="v">${euros(state.stats.argent)}</div><div class="k">Gains</div></div></div>
    ${newBadges.length?`<div class="section-label">Badges débloqués</div><div class="badge-grid">${newBadges.map(b=>`<div class="badge"><span class="ico">${b.icon}</span><div><b>${b.label}</b><small>${b.cat}</small></div></div>`).join('')}</div>`:''}
    <div class="section-label">Saisons</div>${state.seasons.map(f=>`<div class="season-line"><span><span class="pos">${f.champion?'🏆':f.note.toFixed(1)}</span> ${escapeHtml(f.club)} · ${f.role}</span><span>${f.age} ans · ${f.matches} m · ${f.goals} b · ${f.assists} p</span></div>`).join('')}
    <div class="btn-row"><button class="btn" onclick="state=null;startPlayerCreation()">Nouvelle carrière de joueur·euse</button><button class="btn secondary" onclick="state=null;renderStart()">Accueil</button></div></div></div>`; scrollTop();
}
