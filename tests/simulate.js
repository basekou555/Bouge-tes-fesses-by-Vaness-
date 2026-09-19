/* Simulation automatique : joue 14 carrières d'entraîneur·euse et 8 carrières de joueur·euse dans un Chromium headless.
   Usage : npm i -g playwright-core (ou PLAYWRIGHT_CORE=/chemin/vers/playwright-core) puis node tests/simulate.js
   Sortie : une ligne par carrière, puis 'ERRORS: none' si aucune erreur d'exécution. */
const { chromium } = require(process.env.PLAYWRIGHT_CORE||'playwright-core');
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
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
        launchCoach();
        let steps=0, screens={}, gaps=[], wagesR=[];
        while(!state.ended&&steps<900){
          steps++; const pc=state.pendingChoice; screens[pc]=(screens[pc]||0)+1;
          if(pc==='offers'){ if(state.currentOffers.length){ const stay=state.currentOffers.findIndex(o=>o.stay); coachAcceptOffer(stay>=0&&Math.random()<.7?stay:rnd(state.currentOffers.length)); } else coachSkipYear(); }
          else if(pc==='mercato'){ const m=state.market; let tries=0; while(tries<4){ tries++; const cand=m.targets.map((t,i)=>({t,i})).filter(x=>x.t.access!=='no'&&x.t.price<=m.budgetLeft*.6); if(!cand.length) break; const x=cand[rnd(cand.length)]; coachBuy(x.i); if(state.pendingChoice!=='mercato') break; } if(state.squad.length>25) coachSell(state.squad[state.squad.length-1].id); coachCloseMercato(); }
          else if(pc==='tactic'){ coachSetTactic(pick(Object.keys(FORMATIONS)),Math.random()<.6?state.club.styleWanted:state.favoriteStyleId); }
          else if(pc==='event'){ coachChooseEvent(rnd(state.currentEvent.event.choices.length)); }
          else if(pc==='choiceResult'){ coachContinueChoiceResult(); }
          else if(pc==='phaseResult'){ coachAfterPhase(); }
          else if(pc==='seasonEnd'){ gaps.push(Math.round((state.lastPhase.strength-state.club.strength)*10)/10); wagesR.push(Math.round(state.squad.reduce((n,p)=>n+p.wage,0)/state.club.wageCap*100)/100); coachAfterSeasonEnd(); }
          else if(pc==='sacked'){ coachIntersaison(); }
          else if(pc==='roulette'){ coachChooseRoulette(rnd(4)); }
          else if(pc==='pressureCrisis'){ coachChoosePressure(rnd(3)); }
          else { res.coach.push({run,error:'unknown pc '+pc}); break; }
          render();
        }
        render();
        res.coach.push({run,era:era.id,mode:mode.id,cause:state.endingCause,age:state.age,year:state.year,seasons:state.history.length,sackings:state.sackings,titles:state.titles,awards:state.awards,steps,screens,clubs:state.clubsCoached.length,rep:Math.round(state.stats.reputation),scams:state.scamsSuffered,gap:(gaps.reduce((a,b)=>a+b,0)/Math.max(1,gaps.length)).toFixed(1),gapMax:Math.max(...gaps,0),wr:(wagesR.reduce((a,b)=>a+b,0)/Math.max(1,wagesR.length)).toFixed(2)});
      }catch(e){ res.coach.push({run,error:e.message+' @ '+(e.stack||'').split('\n')[1],pc:state&&state.pendingChoice}); }
    }
    for(let run=0;run<8;run++){
      try{
        localStorage.clear(); const era=ERAS[run%ERAS.length];
        creation={kind:'player',step:0,name:'P'+run,era,pos:PLAYER_POS[run%4],origin:pick(PLAYER_ORIGINS),trait:pick(PLAYER_TRAITS)}; launchPlayer();
        let steps=0;
        while(!state.ended&&steps<600){
          steps++; const pc=state.pendingChoice;
          if(pc==='offers'){ if(state.currentOffers.length) playerAcceptOffer(rnd(state.currentOffers.length)); else playerSkipYear(); }
          else if(pc==='event'){ playerChooseEvent(rnd(state.currentEvent.event.choices.length)); }
          else if(pc==='choiceResult'){ playerContinueChoiceResult(); }
          else if(pc==='phaseResult'){ playerAfterPhase(); }
          else if(pc==='seasonEnd'){ playerAfterSeasonEnd(); }
          else if(pc==='roulette'){ playerChooseRoulette(rnd(4)); }
          else if(pc==='pressureCrisis'){ playerChoosePressure(rnd(3)); }
          else { res.player.push({run,error:'unknown pc '+pc}); break; }
          render();
        }
        render();
        res.player.push({run,era:era.id,pos:state.pos,cause:state.endingCause,age:pAge(),seasons:state.history.length,totals:state.totals,note:Math.round(pRating()),clubs:state.clubs.length,best:state.history.reduce((b,h)=>Math.max(b,h.note||0),0).toFixed(2)});
      }catch(e){ res.player.push({run,error:e.message+' @ '+(e.stack||'').split('\n')[1],pc:state&&state.pendingChoice}); }
    }
    try{ renderBadges(); renderHall(); renderRules(); state=null; renderStart(); startCoachCreation(); cPick('name','X'); cPickEra(2); render; startPlayerCreation(); cPick('name','Y'); cPickEra(5); cPick('pos',PLAYER_POS[3]); cPick('origin',PLAYER_ORIGINS[0]); cPick('trait',PLAYER_TRAITS[0]); }catch(e){ res.ui='UI error: '+e.message+' '+(e.stack||'').split('\n')[1]; }
    return res;
  });
  console.log('COACH'); out.coach.forEach(c=>console.log(c.error?JSON.stringify(c):[c.run,c.era,c.mode,c.cause,'age'+c.age,c.year,'seasons'+c.seasons,'sack'+c.sackings,'L'+c.titles.league+'/P'+c.titles.promo+'/C'+c.titles.cup+'/E'+c.titles.euro,'aw'+c.awards,'clubs'+c.clubs,'rep'+c.rep,'scams'+c.scams,'gap'+c.gap,'gapMax'+c.gapMax,'wages'+c.wr].join(' ')));
  console.log('PLAYER'); out.player.forEach(p=>console.log(p.error?JSON.stringify(p):[p.run,p.era,p.pos,p.cause,'age'+p.age,'seasons'+p.seasons,'apps'+p.totals.apps,'goals'+p.totals.goals,'titles'+p.totals.titles,'caps'+p.totals.caps,'ballons'+p.totals.ballons,'note'+p.note,'best'+p.best,'clubs'+p.clubs].join(' ')));
  console.log('UI',out.ui||'ok'); console.log('ERRORS:',errors.length?errors.slice(0,10).join('\n'):'none');
  await browser.close();
})();
