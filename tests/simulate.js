/* Simulation automatique : joue 14 carrières d'entraîneur·euse et 8 carrières de joueur·euse dans un Chromium headless,
   en passant par tous les écrans (avant-match, mi-temps, résultat, penalty) ; la colonne « goals/m » etc. sert à juger le réalisme du moteur de match.
   Usage : npm i -g playwright-core (ou PLAYWRIGHT_CORE=/chemin/vers/playwright-core) puis node tests/simulate.js
   Sortie : une ligne par carrière, puis 'ERRORS: none' si aucune erreur d'exécution. */
const { chromium } = require(process.env.PLAYWRIGHT_CORE||'playwright-core');
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--js-flags=--max-old-space-size=4096']});
  const page=await browser.newPage();
  const errors=[]; page.on('pageerror',e=>errors.push('PAGEERROR: '+e.message+' '+(e.stack||'').split('\n').slice(0,2).join(' | '))); page.on('console',m=>{ if(m.type()==='error'&&!m.text().includes('CERT')) errors.push('CONSOLE: '+m.text()); });
  await page.goto('file://'+require('path').resolve(__dirname,'..','index.html')+''); await page.waitForTimeout(500);
  const out=await page.evaluate(async()=>{
    const res={coach:[],player:[]}; const rnd=n=>Math.floor(Math.random()*n);
    for(let run=0;run<14;run++){
      try{
        localStorage.clear();
        const era=ERAS[run%ERAS.length], mode=COACH_MODES[run%COACH_MODES.length];
        creation={kind:'coach',step:0,name:'C'+run,era,mode,origin:pick(COACH_ORIGINS),nationality:pick(NATIONALITIES),style:pick(STYLES),mentor:pick(COACHES_BY_ERA[era.id]),quality:pick(COACH_QUALITIES),flaw:pick(COACH_FLAWS)};
        launchCoach(); state.tempo=pick(Object.keys(TEMPOS));
        let steps=0, screens={}, gaps=[], wagesR=[], mstat={n:0,g:0,y:0,r:0,inj:0,pen:0,sub:0,ht:0}, cstat={carrefours:0}, dashSeen=false;
        while(!state.ended&&steps<6000){
          steps++; const pc=state.pendingChoice; screens[pc]=(screens[pc]||0)+1; if(steps%100===0) await new Promise(r=>setTimeout(r,0)); // laisse respirer le moteur de rendu
          if(pc==='offers'){ if(state.currentOffers.length){ const stay=state.currentOffers.findIndex(o=>o.stay); if(stay>=0&&state.currentOffers[stay].underContract&&Math.random()<.1){ coachBreakContract(); if(!state.currentOffers.length){ coachSkipYear(); render(); continue; } } coachAcceptOffer(stay>=0&&Math.random()<.7?stay:rnd(state.currentOffers.length)); } else coachSkipYear(); }
          else if(pc==='mercato'){ const m=state.market; let tries=0; while(tries<4){ tries++; const cand=m.targets.map((t,i)=>({t,i})).filter(x=>x.t.access!=='no'&&x.t.price<=m.budgetLeft*.6); if(!cand.length) break; const x=cand[rnd(cand.length)]; coachBuy(x.i); if(state.pendingChoice!=='mercato') break; } if(state.squad.length>25) coachSell(state.squad[state.squad.length-1].id); coachCloseMercato(); }
          else if(pc==='tactic'){ coachSetTactic(pick(Object.keys(FORMATIONS)),Math.random()<.6?state.club.styleWanted:state.favoriteStyleId); }
          else if(pc==='event'){ const ce=state.currentEvent; if(ce.kind==='carrefour'){ cstat.carrefours++; coachChooseCrossroad(rnd(ce.event.menu.length)); } else { cstat[ce.kind]=(cstat[ce.kind]||0)+1; coachChooseEvent(rnd(ce.event.choices.length)); } }
          else if(pc==='choiceResult'){ coachContinueChoiceResult(); }
          else if(pc==='prematch'){ if(Math.random()<.6) coachSimPhase(); else { if(Math.random()<.5) coachAutoLineup(); else { const p=state.squad[rnd(state.squad.length)]; coachToggleLineup(p.id); } coachSetMatchOption('approach',pick(Object.keys(APPROACHES))); coachSetMatchOption('training',pick(Object.keys(TRAINING))); coachKickoff(); } }
          else if(pc==='halftime'){ mstat.ht++; coachHalftime(pick(HALFTIME_CHOICES).id); }
          else if(pc==='matchResult'){ const m=state.lastMatch; mstat.n++; mstat.g+=m.gh+m.ga; mstat.y+=m.events.filter(e=>e.kind==='yellow').length; mstat.r+=m.events.filter(e=>e.kind==='red'&&e.side==='us').length; mstat.inj+=m.events.filter(e=>e.kind==='injury').length; mstat.pen+=m.events.filter(e=>e.kind==='goal'&&/penalty/.test(e.text)||e.kind==='penmiss').length; mstat.sub+=m.events.filter(e=>e.kind==='sub').length; if(!m.ratings||!Object.keys(m.ratings).length) throw new Error('no ratings'); coachAfterMatch(); }
          else if(pc==='phaseResult'){ if(!dashSeen){ dashSeen=true; const h=renderDashboard(); if(!h||h.length<500) throw new Error('tableau de bord entraîneur vide'); } coachAfterPhase(); }
          else if(pc==='seasonEnd'){ gaps.push(Math.round((state.lastPhase.strength-state.club.strength)*10)/10); wagesR.push(Math.round(state.squad.reduce((n,p)=>n+p.wage,0)/state.club.wageCap*100)/100); coachAfterSeasonEnd();
            // une carrière sur trois force un destin de roulette, pour couvrir les suites (exclusivité, bannissement)
            if(run%3===0&&!state.ended&&!state.rouletteFate&&state.history.length===3){ state.currentRoulette={event:pick(COACH_ROULETTES.filter(r=>r.fate&&r.fate.kind!=='death'&&r.fate.kind!=='banned')),outcomes:['end','jackpot','small','malus']}; state.pendingChoice='roulette'; } }
          else if(pc==='sacked'){ coachIntersaison(); }
          else if(pc==='roulette'){ coachChooseRoulette(rnd(4)); }
          else if(pc==='pressureCrisis'){ coachChoosePressure(rnd(3)); }
          else { res.coach.push({run,error:'unknown pc '+pc}); break; }
          render();
        }
        render();
        res.coach.push({run,era:era.id,mode:mode.id,fate:(state.rouletteFate&&state.rouletteFate.kind)||'-',cause:state.endingCause,age:state.age,year:state.year,seasons:state.history.length,sackings:state.sackings,titles:state.titles,awards:state.awards,steps,screens,clubs:state.clubsCoached.length,rep:Math.round(state.stats.reputation),scams:state.scamsSuffered,gap:(gaps.reduce((a,b)=>a+b,0)/Math.max(1,gaps.length)).toFixed(1),gapMax:Math.max(...gaps,0),wr:(wagesR.reduce((a,b)=>a+b,0)/Math.max(1,wagesR.length)).toFixed(2),m:mstat,ev:cstat,proches:Math.round(state.gauges.proches)});
      }catch(e){ res.coach.push({run,error:e.message+' @ '+(e.stack||'').split('\n')[1],pc:state&&state.pendingChoice}); }
    }
    for(let run=0;run<8;run++){
      try{
        localStorage.clear(); const era=ERAS[run%ERAS.length];
        creation={kind:'player',step:0,name:'P'+run,era,pos:PLAYER_POS[run%4],origin:pick(PLAYER_ORIGINS),trait:pick(PLAYER_TRAITS)}; launchPlayer(); state.tempo=pick(Object.keys(TEMPOS));
        let steps=0, pstat={n:0,played:0,start:0,pen:0,g:0,inj:0}, pcar={carrefours:0}, pdashSeen=false;
        while(!state.ended&&steps<5000){
          steps++; const pc=state.pendingChoice; if(steps%100===0) await new Promise(r=>setTimeout(r,0));
          if(pc==='offers'){ if(state.currentOffers.length){ const stay=state.currentOffers.findIndex(o=>o.stay); if(stay>=0&&state.currentOffers[stay].underContract&&Math.random()<.1){ playerBreakContract(); if(!state.currentOffers.length){ playerSkipYear(); render(); continue; } } playerAcceptOffer(rnd(state.currentOffers.length)); } else playerSkipYear(); }
          else if(pc==='event'){ const ce=state.currentEvent; if(ce.kind==='carrefour'){ pcar.carrefours++; playerChooseCrossroad(rnd(ce.event.menu.length)); } else { pcar[ce.kind]=(pcar[ce.kind]||0)+1; playerChooseEvent(rnd(ce.event.choices.length)); } }
          else if(pc==='choiceResult'){ playerContinueChoiceResult(); }
          else if(pc==='prematch'){ if(Math.random()<.6) playerSimPhase(); else playerKickoff(); }
          else if(pc==='penalty'){ pstat.pen++; playerPenaltyChoice(Math.random()<.7); }
          else if(pc==='matchResult'){ const m=state.lastMatch; pstat.n++; if(m.played) pstat.played++; if(m.start) pstat.start++; pstat.g+=m.gh+m.ga; if(m.inj) pstat.inj++; playerAfterMatch(); }
          else if(pc==='phaseResult'){ if(!pdashSeen){ pdashSeen=true; const h=renderPlayerDashboard(); if(!h||h.length<400) throw new Error('tableau de bord joueur vide'); } playerAfterPhase(); }
          else if(pc==='seasonEnd'){ playerAfterSeasonEnd(); }
          else if(pc==='roulette'){ playerChooseRoulette(rnd(4)); }
          else if(pc==='pressureCrisis'){ playerChoosePressure(rnd(3)); }
          else { res.player.push({run,error:'unknown pc '+pc}); break; }
          render();
        }
        render();
        res.player.push({run,era:era.id,pos:state.pos,cause:state.endingCause,age:pAge(),seasons:state.history.length,totals:state.totals,note:Math.round(pRating()),clubs:state.clubs.length,best:state.history.reduce((b,h)=>Math.max(b,h.note||0),0).toFixed(2),p:pstat,ev:pcar,entourage:Math.round(state.gauges.entourage)});
      }catch(e){ res.player.push({run,error:e.message+' @ '+(e.stack||'').split('\n')[1],pc:state&&state.pendingChoice}); }
    }
    try{ renderBadges(); renderHall(); renderRules(); state=null; renderStart(); startCoachCreation(); cPick('name','X'); cPickEra(2); render; startPlayerCreation(); cPick('name','Y'); cPickEra(5); cPick('pos',PLAYER_POS[3]); cPick('origin',PLAYER_ORIGINS[0]); cPick('trait',PLAYER_TRAITS[0]); }catch(e){ res.ui='UI error: '+e.message+' '+(e.stack||'').split('\n')[1]; }
    return res;
  });
  console.log('COACH'); out.coach.forEach(c=>console.log(c.error?JSON.stringify(c):[c.run,c.era,c.mode,c.cause,'age'+c.age,c.year,'seasons'+c.seasons,'sack'+c.sackings,'L'+c.titles.league+'/P'+c.titles.promo+'/C'+c.titles.cup+'/E'+c.titles.euro,'aw'+c.awards,'clubs'+c.clubs,'rep'+c.rep,'scams'+c.scams,'gap'+c.gap,'gapMax'+c.gapMax,'wages'+c.wr,'matches'+c.m.n,'goals/m'+(c.m.g/Math.max(1,c.m.n)).toFixed(2),'yel/m'+(c.m.y/Math.max(1,c.m.n)).toFixed(2),'red/m'+(c.m.r/Math.max(1,c.m.n)).toFixed(3),'inj/m'+(c.m.inj/Math.max(1,c.m.n)).toFixed(3),'pen/m'+(c.m.pen/Math.max(1,c.m.n)).toFixed(3),'sub/m'+(c.m.sub/Math.max(1,c.m.n)).toFixed(2),'carrefours'+c.ev.carrefours,'dilemmes'+(c.ev.dilemma||0),'vie'+(c.ev.happening||0),'incidents'+(c.ev.incident||0),'proches'+c.proches].join(' ')));
  console.log('PLAYER'); out.player.forEach(p=>console.log(p.error?JSON.stringify(p):[p.run,p.era,p.pos,p.cause,'age'+p.age,'seasons'+p.seasons,'apps'+p.totals.apps,'goals'+p.totals.goals,'titles'+p.totals.titles,'caps'+p.totals.caps,'ballons'+p.totals.ballons,'note'+p.note,'best'+p.best,'clubs'+p.clubs,'m'+p.p.n,'played'+p.p.played,'starts'+p.p.start,'pen'+p.p.pen,'inj'+p.p.inj,'carrefours'+p.ev.carrefours,'dilemmes'+(p.ev.dilemma||0),'vie'+(p.ev.happening||0),'incidents'+(p.ev.incident||0),'entourage'+p.entourage].join(' ')));
  console.log('UI',out.ui||'ok'); console.log('ERRORS:',errors.length?errors.slice(0,10).join('\n'):'none');
  await browser.close();
})();
