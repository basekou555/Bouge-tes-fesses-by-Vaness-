/* ============================== ABSOLUT COACH — NOYAU ==============================
   Utilitaires, persistance, badges, modèle des joueurs, effectifs, marché des transferts,
   compétitions (championnat, coupes) et développement des joueurs. Partagé par les deux modes. */

let state=null;
function clamp(v,min=0,max=100){ return Math.max(min,Math.min(max,v)); }
function rand(a,b){ return Math.random()*(b-a)+a; }
function randInt(a,b){ return Math.floor(rand(a,b+1)); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function shuffledCopy(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const _bags={};
function pickNoRepeat(key,arr){ if(!_bags[key]||!_bags[key].length||_bags[key].n!==arr.length){ _bags[key]=shuffledCopy(arr.map((_,i)=>i)); _bags[key].n=arr.length; } return arr[_bags[key].pop()]; }
function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function poisson(lambda){ const L=Math.exp(-lambda); let k=0,p=1; do{ k++; p*=Math.random(); }while(p>L); return k-1; }
function ordinal(n){ return n===1?'1er':n+'e'; }
function stars(v){ const n=clamp(Math.round((v-40)/12),0,5); return '★'.repeat(n)+'☆'.repeat(5-n); }
function log(msg){ if(state) state.log.unshift({year:state.year,msg}); }

/* ---------- Persistance ---------- */
const KEYS={coach:'ac2-coach',player:'ac2-player',trophies:'ac2-trophies',hall:'ac2-hall'};
function lsGet(k,f){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):f; }catch(e){ return f; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
function saveGame(){ if(!state) return; lsSet(state.kind==='player'?KEYS.player:KEYS.coach,state); }
function clearSave(kind){ try{ localStorage.removeItem(kind==='player'?KEYS.player:KEYS.coach); }catch(e){} }
// Migration depuis la première version : le Panthéon est conservé, les anciens badges (identifiants incompatibles) non.
(function migrate(){ try{ if(!localStorage.getItem(KEYS.hall)&&localStorage.getItem('ac-hall')) localStorage.setItem(KEYS.hall,localStorage.getItem('ac-hall')); }catch(e){} })();
let unlockedTrophies=new Set(lsGet(KEYS.trophies,[]));
function unlockTrophy(id){ if(!TROPHY_MAP[id]||unlockedTrophies.has(id)) return false; unlockedTrophies.add(id); lsSet(KEYS.trophies,[...unlockedTrophies]); if(state&&state.newBadges) state.newBadges.push(id); return true; }
function hallOfFame(){ return lsGet(KEYS.hall,[]); }
function saveToHall(e){ const h=hallOfFame(); h.unshift(e); lsSet(KEYS.hall,h.slice(0,40)); }

const TROPHIES=[
 {id:'c-first',cat:'Entraîneur·euse',icon:'🧢',label:"Première saison sur un banc"},{id:'c-ten',cat:'Entraîneur·euse',icon:'🔟',label:"Dix saisons d'entraîneur·euse"},{id:'c-old',cat:'Entraîneur·euse',icon:'👴',label:"Sur le banc jusqu'à 75 ans"},
 {id:'c-title-l1',cat:'Trophées',icon:'🏆',label:"Champion de France"},{id:'c-title-l2',cat:'Trophées',icon:'⬆️',label:"Montée en première division"},{id:'c-title-nat',cat:'Trophées',icon:'🌱',label:"Montée depuis le monde amateur"},{id:'c-title-eu',cat:'Trophées',icon:'🏆',label:"Champion à l'étranger"},{id:'c-cup',cat:'Trophées',icon:'🥇',label:"Coupe nationale"},{id:'c-euro',cat:'Trophées',icon:'⭐',label:"Coupe d'Europe des clubs champions"},{id:'c-euro2',cat:'Trophées',icon:'🌍',label:"Deuxième coupe européenne"},{id:'c-double',cat:'Trophées',icon:'✌️',label:"Doublé championnat-coupe"},{id:'c-treble',cat:'Trophées',icon:'👑',label:"Triplé"},
 {id:'c-coach-year',cat:'Récompenses',icon:'🎖️',label:"Entraîneur·euse de l'année"},{id:'c-sacked',cat:'Carrière',icon:'🪓',label:"Licencié·e en cours de saison"},{id:'c-sacked-3',cat:'Carrière',icon:'💼',label:"Trois licenciements"},{id:'c-loyal',cat:'Carrière',icon:'🏠',label:"Six saisons dans le même club"},{id:'c-nomad',cat:'Carrière',icon:'🧳',label:"Huit clubs différents"},{id:'c-abroad',cat:'Carrière',icon:'🌍',label:"Aventure à l'étranger"},{id:'c-superclub',cat:'Carrière',icon:'👑',label:"Diriger un super-club"},{id:'c-relegated',cat:'Carrière',icon:'⬇️',label:"Relégation vécue"},{id:'c-era-cross',cat:'Carrière',icon:'⏳',label:"Traverser une époque"},
 {id:'m-coup',cat:'Mercato',icon:'💥',label:"Le gros coup : tout le budget sur un joueur"},{id:'m-scam',cat:'Mercato',icon:'🎭',label:"Victime d'une arnaque"},{id:'m-scam-3',cat:'Mercato',icon:'🤡',label:"Trois arnaques dans une carrière"},{id:'m-youth',cat:'Mercato',icon:'🌱',label:"Cinq pépites recrutées en un mercato"},{id:'m-star',cat:'Mercato',icon:'⭐',label:"Recruter une légende (niveau 90+)"},{id:'m-sell',cat:'Mercato',icon:'💰',label:"Vente record"},{id:'m-free',cat:'Mercato',icon:'🆓',label:"Un joueur libre qui devient titulaire"},{id:'m-youth-star',cat:'Mercato',icon:'🚀',label:"Une pépite du centre qui atteint 85"},
 {id:'g-vestiaire',cat:'Jauges',icon:'✊',label:"Vestiaire à 100"},{id:'g-supporters',cat:'Jauges',icon:'📣',label:"Supporters à 100"},{id:'g-formation',cat:'Jauges',icon:'🎓',label:"Formation à 100"},{id:'g-staff',cat:'Jauges',icon:'🧑‍🤝‍🧑',label:"Staff à 100"},{id:'g-confidence',cat:'Jauges',icon:'🤝',label:"Confiance du président à 100"},
 {id:'x-pressure',cat:'Pression',icon:'🌡️',label:"Crise de pression traversée"},{id:'x-pause',cat:'Pression',icon:'🏖️',label:"Trois ans loin des terrains"},{id:'x-push',cat:'Pression',icon:'🫀',label:"Continuer coûte que coûte… et survivre"},{id:'x-death',cat:'Pression',icon:'⚰️',label:"Mort sur le banc"},
 {id:'r-small',cat:'Roulette',icon:'🍀',label:"Petit bonus de la roulette"},{id:'r-malus',cat:'Roulette',icon:'🌧️',label:"Malus de la roulette"},{id:'r-jackpot',cat:'Roulette',icon:'🌠',label:"Jackpot de la roulette"},{id:'r-death',cat:'Roulette',icon:'☠️',label:"Fin brutale à la roulette"},{id:'r-fate',cat:'Roulette',icon:'⛓️',label:"Un destin scellé par la roulette"},{id:'r-redemption',cat:'Roulette',icon:'🕊️',label:"Laver son nom après la roulette"},
 {id:'p-first',cat:'Joueur·euse',icon:'👟',label:"Première saison pro"},{id:'p-title',cat:'Joueur·euse',icon:'🏆',label:"Champion·ne"},{id:'p-euro',cat:'Joueur·euse',icon:'⭐',label:"Vainqueur de la coupe d'Europe"},{id:'p-ballon',cat:'Joueur·euse',icon:'🏅',label:"Ballon d'or"},{id:'p-selection',cat:'Joueur·euse',icon:'🇫🇷',label:"Première sélection"},{id:'p-100',cat:'Joueur·euse',icon:'💯',label:"Cent buts en carrière"},{id:'p-500',cat:'Joueur·euse',icon:'🎯',label:"Cinq cents matchs"},{id:'p-legend',cat:'Joueur·euse',icon:'🗿',label:"Légende d'un club : huit saisons"},{id:'p-superclub',cat:'Joueur·euse',icon:'👑',label:"Signer dans un super-club"},{id:'p-injury',cat:'Joueur·euse',icon:'🩼',label:"Carrière brisée par les blessures"},{id:'p-retire',cat:'Joueur·euse',icon:'🎗️',label:"Carrière de joueur·euse terminée"},{id:'p-golden-boot',cat:'Joueur·euse',icon:'👞',label:"Soulier d'or"},{id:'p-era-cross',cat:'Joueur·euse',icon:'⏳',label:"Une carrière à cheval sur deux époques"},{id:'p-bench',cat:'Joueur·euse',icon:'🪑',label:"Une saison entière sur le banc"},
];
const TROPHY_MAP=Object.fromEntries(TROPHIES.map(t=>[t.id,t]));

/* ---------- Compétitions : noms selon l'année ---------- */
function leagueName(level,nat,year){
  if(nat==='FR'){ if(level===1) return year<2002?"Division 1":"Ligue 1"; if(level===2) return year<2002?"Division 2":"Ligue 2"; return year<1993?"Division 3":"National"; }
  const names={ES:"Liga",IT:"Serie A",DE:"Bundesliga",EN:year<1992?"First Division":"Premier League",NL:"Eredivisie",PT:"Liga portugaise",SC:"Championnat d'Écosse",BE:year<2008?"Division 1 belge":"Pro League",UA:"Championnat d'Ukraine",RS:"Championnat de Yougoslavie",RO:"Championnat de Roumanie",TR:"Süper Lig"};
  return names[nat]||"Championnat national";
}
const FILLERS={
 ES:["Getafe","Osasuna","Deportivo Alavés","Cádiz CF","RCD Mallorca","Celta Vigo","Espanyol","Real Sociedad","Real Betis","Villarreal","Girona","Rayo Vallecano","Real Saragosse","Real Valladolid","Sporting Gijón","Las Palmas"],
 IT:["Torino","Bologna","Genoa","Sampdoria","Udinese","Sassuolo","Lecce","Cagliari","Empoli","Hellas Vérone","Parme","Lazio","Bari","Brescia","Vicenza","Catane"],
 DE:["VfB Stuttgart","VfL Wolfsburg","Eintracht Francfort","Schalke 04","Werder Brême","SC Fribourg","Mayence","Augsbourg","Hoffenheim","FC Cologne","Hertha Berlin","Union Berlin","Kaiserslautern","Bochum","Nuremberg","Hanovre"],
 EN:["Aston Villa","West Ham","Leicester City","Southampton","Crystal Palace","Brighton","Fulham","Wolverhampton","Brentford","Bournemouth","Burnley","Sheffield United","Ipswich Town","Norwich City","Derby County","Coventry City","Sunderland","Middlesbrough"],
 NL:["AZ Alkmaar","FC Utrecht","FC Twente","Vitesse Arnhem","FC Groningue","Heerenveen","Sparta Rotterdam","NEC Nimègue","Willem II","Roda JC","Go Ahead Eagles","Fortuna Sittard"],
 PT:["SC Braga","Vitória Guimarães","Boavista","Belenenses","Rio Ave","Famalicão","Gil Vicente","Marítimo","Estoril","Arouca"],
 SC:["Aberdeen","Hearts","Hibernian","Dundee United","Motherwell","Kilmarnock","St Mirren","Dundee FC"],
 BE:["Standard de Liège","KRC Genk","La Gantoise","Royal Antwerp","KV Malines","Charleroi","Cercle Bruges","Saint-Trond","Westerlo","Courtrai"],
 UA:["Chakhtar Donetsk","Dnipro","Metalist Kharkiv","Vorskla Poltava","Zorya Louhansk","Tchornomorets Odessa"],
 RS:["Partizan Belgrade","Hajduk Split","Dinamo Zagreb","Vojvodina","Sarajevo","Željezničar"],
 RO:["Dinamo Bucarest","Rapid Bucarest","Universitatea Craiova","CFR Cluj","Petrolul Ploiești","FC Argeș"],
 TR:["Beşiktaş","Trabzonspor","Bursaspor","Sivasspor","Antalyaspor","Konyaspor","Kayserispor","Gaziantep"],
 MLS:["Columbus Crew","Portland Timbers","Atlanta United","New York City FC","Philadelphia Union","Sporting Kansas City","FC Dallas","Nashville SC","Charlotte FC","Austin FC","Chicago Fire","Colorado Rapids","Real Salt Lake","Houston Dynamo","DC United","New England Revolution","Minnesota United"],
 NASL:["Tampa Bay Rowdies","Chicago Sting","Fort Lauderdale Strikers","Vancouver Whitecaps","Seattle Sounders","Los Angeles Aztecs","Minnesota Kicks","Washington Diplomats","Toronto Blizzard","Rochester Lancers","Portland Timbers","San Jose Earthquakes"],
 "Saudi Pro League":["Al-Ahli","Al-Shabab","Al-Taawoun","Al-Fateh","Al-Ettifaq","Al-Raed","Damac","Abha","Al-Fayha","Al-Khaleej","Al-Wehda","Al-Hazem","Al-Riyadh","Al-Okhdood"],
 "Qatar Stars League":["Al-Duhail","Al-Rayyan","Al-Gharafa","Al-Arabi","Qatar SC","Al-Wakrah","Umm Salal","Al-Shamal","Al-Markhiya"],
 "J-League":["Gamba Osaka","Kawasaki Frontale","Nagoya Grampus","Sanfrecce Hiroshima","Vissel Kobe","Cerezo Osaka","FC Tokyo","Shimizu S-Pulse","Júbilo Iwata","Consadole Sapporo","Vegalta Sendai","Avispa Fukuoka","Kashiwa Reysol","Sagan Tosu","Albirex Niigata"],
 "Chinese Super League":["Beijing Guoan","Shandong Taishan","Jiangsu Suning","Tianjin Teda","Hebei","Dalian","Chongqing","Henan Jianye","Changchun Yatai","Shenzhen","Wuhan","Guizhou","Tianjin Quanjian","Shanghai Shenhua","Hangzhou"],
 "Liga MX":["Cruz Azul","Tigres UANL","CF Monterrey","Pumas UNAM","Toluca","Santos Laguna","León","Pachuca","Atlas","Puebla","Necaxa","Querétaro","Tijuana","Juárez","Mazatlán","Atlético San Luis"],
 "Primera División":["Racing Club","Independiente","San Lorenzo","Vélez Sarsfield","Estudiantes","Newell's Old Boys","Rosario Central","Lanús","Talleres","Huracán","Gimnasia","Argentinos Juniors","Banfield","Godoy Cruz","Belgrano","Unión"],
 "Brasileirão":["Grêmio","Internacional","Cruzeiro","Atlético Mineiro","Fluminense","Botafogo","Vasco da Gama","Corinthians","Athletico Paranaense","Bahia","Fortaleza","Sport Recife","Goiás","Coritiba","Ceará","Vitória"],
 "A-League":["Sydney FC","Melbourne City","Western Sydney Wanderers","Brisbane Roar","Adelaide United","Perth Glory","Central Coast Mariners","Newcastle Jets","Wellington Phoenix","Macarthur"],
};
function tierBaseStrength(tier,s){
  if(tier==='superclub'||tier==='europe') return {1:66,2:71,3:77,4:82,5:88}[s]||70;
  if(tier==='ligue1') return {1:64,2:69,3:74,4:79,5:85}[s]||68;
  if(tier==='etranger') return {1:60,2:64,3:69,4:74,5:78}[s]||64;
  if(tier==='ligue2') return 58; return 48;
}
/* Construit la liste des équipes du championnat de notre club (notre club exclu, ajouté ensuite) */
function buildLeagueTeams(offer,year){
  const dk=decadeKey(year), teams=[];
  const self=offer.club||offer.name;
  const push=(name,strength)=>{ if(name!==self&&!teams.some(t=>t.name===name)) teams.push({name,strength:Math.round(strength+rand(-2,2))}); };
  if(offer.tier==='ligue1'){ FR_CLUBS.filter(c=>c.s[dk]>0).forEach(c=>push(c.n,tierBaseStrength('ligue1',c.s[dk]))); while(teams.length<17){ const c=pick(FR_CLUBS); push(c.n,62); } return {name:leagueName(1,'FR',year),nat:'FR',level:1,teams:teams.slice(0,17)}; }
  if(offer.tier==='ligue2'){ FR_CLUBS.filter(c=>!c.s[dk]).forEach(c=>push(c.n,rand(56,62))); shuffledCopy(FR_LOWER).slice(0,8).forEach(n=>push(n,rand(53,59))); return {name:leagueName(2,'FR',year),nat:'FR',level:2,teams:shuffledCopy(teams).slice(0,17)}; }
  if(offer.tier==='amateur'){ shuffledCopy(FR_LOWER).slice(0,15).forEach(n=>push(n,rand(44,52))); return {name:leagueName(3,'FR',year),nat:'FR',level:3,teams:teams.slice(0,15)}; }
  if(offer.tier==='etranger'){ const lg=offer.league; WORLD_CLUBS.filter(c=>c.league===lg&&c.s[dk]>0).forEach(c=>push(c.n,tierBaseStrength('etranger',c.s[dk]))); (FILLERS[lg]||[]).forEach(n=>push(n,rand(56,63))); return {name:lg,nat:offer.nat,level:1,teams:shuffledCopy(teams).slice(0,15)}; }
  const nat=offer.nat; EU_CLUBS.filter(c=>c.nat===nat&&c.s[dk]>0).forEach(c=>push(c.n,tierBaseStrength('europe',c.s[dk]))); (FILLERS[nat]||[]).forEach(n=>push(n,rand(60,67)));
  while(teams.length<17){ push(pick(FILLERS.ES),62); }
  return {name:leagueName(1,nat,year),nat,level:1,teams:shuffledCopy(teams).slice(0,17)};
}

/* ---------- Modèle des joueurs ---------- */
const POS_LABEL={G:"Gardien",D:"Défenseur",M:"Milieu",A:"Attaquant"};
const AGE_CURVE={16:.68,17:.72,18:.76,19:.8,20:.84,21:.88,22:.92,23:.95,24:.97,25:.99,26:1,27:1,28:1,29:.99,30:.97,31:.94,32:.9,33:.86,34:.81,35:.76,36:.71,37:.66,38:.6,39:.55,40:.5};
function ageCurve(age){ return AGE_CURVE[clamp(age,16,40)]; }
const TRAITS=[{id:'leader',label:"Leader",v:3},{id:'pro',label:"Professionnel",v:2},{id:'ego',label:"Ego",v:-3},{id:'fetard',label:"Fêtard",v:-2,scandal:true},{id:'fragile',label:"Fragile",injury:.08},{id:'loyal',label:"Loyal",v:2},{id:'mercenaire',label:"Mercenaire",v:-1},{id:'showman',label:"Showman",fans:3},{id:'travailleur',label:"Bosseur",dev:.02},{id:'discret',label:"Discret",v:1}];
let _pid=1;
// Les identifiants sont mémorisés dans la sauvegarde pour ne jamais entrer en collision après un rechargement.
function nextPid(){ if(state){ state.pidCounter=Math.max(state.pidCounter||1000,_pid)+1; _pid=state.pidCounter; return state.pidCounter; } return _pid++; }
function makePlayer(o){
  const p={ id:nextPid(), name:o.name, pos:o.pos, born:o.born, peak:o.peak, nat:o.nat||'FR', real:!!o.real, dev:o.dev!=null?Math.min(o.dev,1.14):clamp(1+rand(-.06,.06)+(Math.random()<.08?rand(.04,.1):0),.8,1.14), trait:o.trait||pick(TRAITS).id, morale:o.morale!=null?o.morale:65, form:0, injury:0, contractEnd:o.contractEnd||0, wage:o.wage||0, apps:0, goals:0, assists:0, seasonsAtClub:0, fanFav:false, scam:o.scam||null, promised:o.promised||false, joinedYear:o.joinedYear||0, fitness:100, yellows:0, suspended:0, sumRating:0, rated:0 };
  return p;
}
function playerAge(p,year){ return year-p.born; }
function playerRating(p,year){ const age=playerAge(p,year); return clamp(Math.round(p.peak*ageCurve(age)*p.dev+(p.form||0)*.3),25,99); }
function valueAgeFactor(age){
  if(age<=22) return 1.30+Math.min(5,22-age)*.03;
  const slow=Math.min(age,28)-22, mid=Math.max(0,Math.min(age,32)-28), late=Math.max(0,age-32);
  return Math.max(.08,1.30*Math.pow(.93,slow)*Math.pow(.85,mid)*Math.pow(.75,late));
}
function valueForRating(r,age,year){
  const base=Math.pow(Math.max(0,r-40)/60,3)*120;
  return Math.max(.01,base*valueAgeFactor(age)*eraForYear(year).marketSize);
}
function playerValue(p,year){
  let v=valueForRating(playerRating(p,year),playerAge(p,year),year);
  if(p.rated>=4) v*=clamp(1+(p.sumRating/p.rated-6.2)*.12,.75,1.4);
  return v;
}
/* Salaire annuel (millions de 2015) : niveau, âge (les jeunes gagnent peu), palier du club, époque.
   Niveau 50 → ≈ 0,05 M, 60 → ≈ 0,4 M, 70 → ≈ 1,3 M, 80 → ≈ 3 M, 90 → ≈ 6 M, avant multiplicateurs (âge, palier, époque). */
const WAGE_TIER_MULT={superclub:1.5,europe:1.2,ligue1:1,etranger:.9,ligue2:.55,amateur:.3};
function playerWage(p,year,tier){
  const r=playerRating(p,year), age=playerAge(p,year);
  const base=Math.pow(Math.max(0,r-40)/60,3)*10;
  const ageF=age<=19?.25:age<=21?.45:age<=23?.7:age<=31?1:age<=33?.85:.7;
  return Math.max(.005,base*ageF*eraForYear(year).marketSize*(WAGE_TIER_MULT[tier]||1));
}
function traitLabel(id){ const t=TRAITS.find(x=>x.id===id); return t?t.label:id; }
function fakeName(nat){ const k=FAKE_FIRST[nat]?nat:(['SN','ML','CI','CM','DZ','MA','GH','NG']).includes(nat)?'AF':'FR'; return `${pick(FAKE_FIRST[k])} ${pick(FAKE_LAST[k])}`; }
function natForClub(nat){ const mix={FR:['FR','FR','FR','FR','FR','AF','AF','BR','ES','PT','BE'],ES:['ES','ES','ES','AR','BR','PT'],IT:['IT','IT','IT','AR','BR','FR'],DE:['DE','DE','DE','NL','FR','AF'],EN:['EN','EN','EN','SC','FR','BR','AF'],NL:['NL','NL','NL','BE','AF'],PT:['PT','PT','BR','BR','AF'],SC:['SC','SC','EN'],BE:['BE','BE','FR','AF','NL'],US:['EN','EN','AR','BR','FR'],SA:['AF','AF','BR','PT','FR'],JP:['DE','BR','ES','NL'],MX:['AR','ES','BR'],AR:['AR','AR','AR'],BR:['BR','BR','BR'],CN:['BR','BR','AR'],QA:['AF','BR','FR'],CA:['EN','FR','AF'],AU:['EN','EN','SC']}; return pick(mix[nat]||['FR','AF','ES','BR']); }
/* Joueurs réels disponibles cette année (hors ceux déjà utilisés dans la carrière) */
function realPool(year,usedNames){ return REAL_PLAYERS.filter(r=>{ const age=year-r[2]; return age>=17&&age<=36&&!usedNames.has(r[0]); }); }
function realToPlayer(r,year,extra={}){ const dev=clamp(1+rand(-.04,.04),.9,1.1); return makePlayer({name:r[0],pos:r[1],born:r[2],peak:r[3],nat:r[4],real:true,dev,...extra}); }
function generatedPlayer(pos,year,targetRating,nat,extra={}){
  const age=extra.age||randInt(19,32), born=year-age;
  const peak=clamp(Math.round(targetRating/ageCurve(age)+rand(-3,3)),35,96);
  return makePlayer({name:fakeName(nat),pos,born,peak,nat,real:false,...extra});
}
/* Génère l'effectif d'un club (force 1-5 selon palier) */
function generateSquad(offer,year,usedNames){
  const target=offer.strength; const squad=[]; const slots=[['G',2],['D',7],['M',7],['A',5]];
  const pool=shuffledCopy(realPool(year,usedNames));
  const foreignersMax=offer.nat==='FR'?eraForeignersMax(year):99; let foreigners=0;
  slots.forEach(([pos,n])=>{
    for(let i=0;i<n;i++){
      const starter=i<(pos==='G'?1:pos==='A'?2:4);
      const want=starter?target-2+rand(-4,4):target-rand(4,11);
      let p=null;
      const realChance=(offer.tier==='superclub'?.7:offer.tier==='europe'?.5:offer.tier==='ligue1'?.4:offer.tier==='etranger'?.25:offer.tier==='ligue2'?.12:.03);
      if(Math.random()<realChance){
        const idx=pool.findIndex(r=>{ const rt=r[3]*ageCurve(year-r[2]); const natOk=r[4]===offer.nat||r[4]===(offer.nat==='FR'?'FR':r[4]); return r[1]===pos&&Math.abs(rt-want)<=6&&(natOk||Math.random()<.5)&&(foreigners<foreignersMax||r[4]===offer.nat); });
        if(idx>=0){ const r=pool.splice(idx,1)[0]; p=realToPlayer(r,year); usedNames.add(r[0]); if(r[4]!==offer.nat) foreigners++; }
      }
      if(!p){ let nat=natForClub(offer.nat); if(nat!==offer.nat&&foreigners>=foreignersMax) nat=offer.nat; else if(nat!==offer.nat) foreigners++; p=generatedPlayer(pos,year,want,nat); }
      p.contractEnd=year+randInt(1,3); p.wage=playerWage(p,year,offer.tier)*rand(.9,1.15); p.seasonsAtClub=randInt(0,5); p.joinedYear=year-p.seasonsAtClub; p.fanFav=p.seasonsAtClub>=3&&Math.random()<.4;
      squad.push(p);
    }
  });
  return squad;
}
function isForeign(p,nat){ return nat==='FR'?p.nat!=='FR':p.nat!==nat; }
function bestXI(squad,formation,year){
  const need={G:1,D:formation[0],M:formation[1],A:formation[2]}; const xi=[];
  const avail=squad.filter(p=>!p.injury);
  ['G','D','M','A'].forEach(pos=>{
    const cands=avail.filter(p=>p.pos===pos&&!xi.includes(p)).sort((a,b)=>playerRating(b,year)-playerRating(a,year));
    for(let i=0;i<need[pos];i++){
      if(cands[i]) xi.push(cands[i]);
      else { const alt=avail.filter(p=>!xi.includes(p)).sort((a,b)=>playerRating(b,year)-playerRating(a,year))[0]; if(alt){ alt._outOfPos=true; xi.push(alt); } }
    }
  });
  return xi;
}
function teamStrength(squad,formation,year,extras={}){
  const xi=bestXI(squad,formation,year);
  if(!xi.length) return 40;
  let sum=0,w=0; xi.forEach(p=>{ const wt=p.pos==='G'?1.2:1; const r=playerRating(p,year)-(p._outOfPos?8:0); p._outOfPos=false; sum+=r*wt; w+=wt; });
  const xiAvg=sum/w;
  const bench=squad.filter(p=>!xi.includes(p)&&!p.injury).sort((a,b)=>playerRating(b,year)-playerRating(a,year)).slice(0,5);
  const benchAvg=bench.length?bench.reduce((n,p)=>n+playerRating(p,year),0)/bench.length:xiAvg-15;
  const morale=squad.reduce((n,p)=>n+p.morale,0)/Math.max(1,squad.length);
  return xiAvg+(benchAvg-xiAvg+12)*.06+(morale-60)*.04+(extras.bonus||0);
}
const FORMATIONS={'4-4-2':[4,4,2],'4-3-3':[4,3,3],'3-5-2':[3,5,2],'5-3-2':[5,3,2],'4-2-3-1':[4,5,1],'3-4-3':[3,4,3]};

/* ---------- Marché des transferts ---------- */
function marketTargets(offer,year,squad,usedNames,ctx){
  const era=eraForYear(year), targets=[], pool=shuffledCopy(realPool(year,usedNames));
  const base=offer.strength, n=Math.round(12*era.marketSize)+(ctx.winter?-4:0);
  const cred=ctx.credibility;
  // stars réelles (parfois hors de portée)
  const stars=pool.filter(r=>r[3]*ageCurve(year-r[2])>=base-2).slice(0,Math.round(n*.45));
  stars.forEach(r=>{ const p=realToPlayer(r,year); targets.push(marketEntry(p,year,offer,cred,'real')); });
  // valeurs sûres générées
  for(let i=0;i<Math.round(n*.3);i++){ const pos=pick(['D','M','A','G','D','M','A']); const p=generatedPlayer(pos,year,base+rand(-6,6),natForClub(offer.nat)); targets.push(marketEntry(p,year,offer,cred,'pro')); }
  // pépites : jeunes générés, potentiel caché, risque d'arnaque
  const youthN=Math.round(n*.4);
  for(let i=0;i<youthN;i++){
    const pos=pick(['D','M','A','A','M']); const age=randInt(16,20);
    const shown=base-rand(4,14); const p=generatedPlayer(pos,year,shown,pick(['FR','FR','AF','BR','AR','ES','PT','BE']),{age});
    p.dev=clamp(1+rand(-.05,.2),.85,1.25);
    const scamChance=clamp(era.scamBase+.12-(ctx.formation-50)*.003-(ctx.reseau-30)*.002,.04,.45);
    if(Math.random()<scamChance){ const s=pick(SCAMS.filter(x=>!x.minYear||year>=x.minYear)); p.scam=s.id; }
    targets.push(marketEntry(p,year,offer,cred,'youth'));
  }
  // joueurs libres (vétérans ou cassés)
  for(let i=0;i<3;i++){ const pos=pick(['D','M','A','G']); const age=randInt(30,35); const p=generatedPlayer(pos,year,base-rand(0,8),natForClub(offer.nat),{age}); targets.push(marketEntry(p,year,offer,cred,'free')); }
  // internes : jeunes du centre
  for(let i=0;i<3;i++){ const pos=pick(['D','M','A','G']); const age=randInt(17,19); const p=generatedPlayer(pos,year,base-rand(8,18)+(ctx.formation-50)*.12,offer.nat==='FR'?'FR':offer.nat,{age}); p.dev=clamp(1+rand(-.04,.16)+(ctx.formation-50)*.001,.85,1.25); targets.push(marketEntry(p,year,offer,cred,'academy')); }
  return targets;
}
function marketEntry(p,year,offer,cred,kind){
  const r=playerRating(p,year), age=playerAge(p,year);
  let price=playerValue(p,year)*(kind==='free'||kind==='academy'?0:rand(.9,1.4)); let wage=playerWage(p,year,offer.tier)*(kind==='free'?1.3:kind==='academy'?.8:1)*rand(.95,1.1);
  const sellers=kind==='real'?pick(["son club","son agent","un intermédiaire","sa direction"]):kind==='youth'?pick(["un agent inconnu","une vidéo virale","un recruteur de passage","un cousin qui connaît quelqu'un","une académie privée","un ancien coéquipier"]):kind==='free'?"sans club":kind==='academy'?"le centre de formation":"un agent classique";
  const gap=r-cred; // > 0 : au-dessus de ta crédibilité
  let access='ok', label='Accessible';
  if(kind==='real'||kind==='pro'){ if(gap>10){ access='no'; label='Hors de portée'; } else if(gap>3){ access='coup'; label='Gros coup possible'; price*=1.6; wage*=1.8; } }
  if(kind==='youth'){ label=pick(["Pépite signalée","Talent brut","Prometteur","Inconnu au bataillon"]); }
  if(kind==='free'){ label='Libre'; } if(kind==='academy'){ label='Jeune du centre'; }
  return {p,kind,price,wage,source:sellers,access,label,shownRating:kind==='youth'?r+randInt(-2,4):r,age};
}
function credibilityFor(offer,reputation,reseau){ return offer.strength+(reputation-50)*.15+(reseau-30)*.08; }

/* ---------- Simulation d'une compétition ---------- */
function roundRobin(teamIds){
  const ids=[...teamIds]; if(ids.length%2) ids.push(null);
  const n=ids.length, rounds=[];
  for(let r=0;r<n-1;r++){ const round=[]; for(let i=0;i<n/2;i++){ const a=ids[i],b=ids[n-1-i]; if(a!=null&&b!=null) round.push(r%2?[a,b]:[b,a]); } rounds.push(round); ids.splice(1,0,ids.pop()); }
  const back=rounds.map(rd=>rd.map(([a,b])=>[b,a]));
  return rounds.concat(back);
}
function simMatch(sH,sA){ const xh=1.35*Math.exp((sH+2-sA)/19), xa=1.05*Math.exp((sA-sH-2)/19); return [poisson(xh),poisson(xa)]; }
function newSeasonTable(teams){ return teams.map(t=>({name:t.name,pts:0,w:0,d:0,l:0,gf:0,ga:0,me:!!t.me})); }
function applyResult(table,h,a,gh,ga){ const H=table.find(t=>t.name===h),A=table.find(t=>t.name===a); H.gf+=gh;H.ga+=ga;A.gf+=ga;A.ga+=gh; if(gh>ga){H.pts+=3;H.w++;A.l++;} else if(gh<ga){A.pts+=3;A.w++;H.l++;} else {H.pts++;A.pts++;H.d++;A.d++;} }
/* Enregistre un résultat dans le classement et la forme récente (cinq derniers matchs) */
function recordResult(comp,h,a,gh,ga){ applyResult(comp.table,h,a,gh,ga); comp.form=comp.form||{}; const push=(n,r)=>{ comp.form[n]=(comp.form[n]||[]).concat(r).slice(-5); }; push(h,gh>ga?'W':gh<ga?'L':'D'); push(a,ga>gh?'W':ga<gh?'L':'D'); }
function sortTable(table){ return [...table].sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf); }
function tablePos(table,name){ return sortTable(table).findIndex(t=>t.name===name)+1; }
/* Joue les autres matchs d'une journée (les nôtres passent par le moteur de match) */
function playOthers(comp,d,ourName){
  (comp.schedule[d]||[]).forEach(([h,a])=>{ if(h===ourName||a===ourName) return; const [gh,ga]=simMatch(comp.strength[h],comp.strength[a]); recordResult(comp,h,a,gh,ga); });
}
/* Notre affiche d'une journée : {home,away,opp,isHome} ou null (journée de repos) */
function ourFixture(comp,d,ourName){ const f=(comp.schedule[d]||[]).find(([h,a])=>h===ourName||a===ourName); if(!f) return null; return {home:f[0],away:f[1],opp:f[0]===ourName?f[1]:f[0],isHome:f[0]===ourName}; }
function createCompetition(league,ourName,year){
  const names=[ourName,...league.teams.map(t=>t.name)];
  // Chaque club adverse a aussi un staff : un bonus de saison de 0 à 4 s'ajoute à sa force nominale
  const strength={}, styles={}; const pool=eraStylePool(year||2015); league.teams.forEach(t=>{ strength[t.name]=Math.round((t.strength+rand(0,4))*10)/10; styles[t.name]=pick(pool).id; });
  const schedule=roundRobin(names);
  return {name:league.name,nat:league.nat,level:league.level,teams:names,strength,styles,form:{},schedule,table:newSeasonTable(names.map(n=>({name:n,me:n===ourName}))),phaseEnds:[Math.round(schedule.length*.25),Math.round(schedule.length*.5),Math.round(schedule.length*.75),schedule.length]};
}
function oppStyle(comp,name,year){ if(!comp.styles) comp.styles={}; if(!comp.styles[name]) comp.styles[name]=pick(eraStylePool(year)).id; return comp.styles[name]; }
/* Coupe à élimination directe : rounds contre des adversaires de force donnée */
function simCup(rounds,ourStrengthFn,opponents){
  const path=[]; let alive=true;
  for(let i=0;i<rounds&&alive;i++){
    const opp=opponents[i]; const [g1,g2]=simMatch(ourStrengthFn(),opp.strength); let gh=g1,ga=g2; if(gh===ga){ const pen=Math.random()<.5; path.push({round:i+1,opp:opp.name,gh,ga,pen:true,win:pen}); alive=pen; } else { path.push({round:i+1,opp:opp.name,gh,ga,win:gh>ga}); alive=gh>ga; }
  }
  return {path,won:alive,roundsReached:path.length};
}

/* ---------- Développement et usure ---------- */
function developSquad(squad,year,ctx){
  const notes=[];
  squad.forEach(p=>{
    const age=playerAge(p,year); const share=ctx.minutes?clamp((ctx.minutes[p.id]||0)/4,0,1):.5;
    let dev=0;
    if(age<=23) dev=(share-.35)*.03+(ctx.formation-50)*.0004+(p.trait==='travailleur'?.006:0)+(ctx.youthWeeks||0)*.0006;
    else if(age>=31) dev=-(.006+(age-30)*.004)+(ctx.staff-50)*.0002;
    // Même en pleine force de l'âge, on progresse en jouant et on s'émousse sur le banc.
    else dev=(share-.5)*.012+(ctx.staff-50)*.0002;
    p.dev=clamp(p.dev+dev,.8,1.14);
    if(age<=21&&share>=.5&&dev>.02) notes.push(`${p.name} a franchi un palier grâce au temps de jeu.`);
    p.seasonsAtClub++; p.form=0; p.morale=clamp(p.morale+(share>=.5?4:-6)+(ctx.vestiaire-50)*.1,20,100); p.yellows=0; p.suspended=0; p.fitness=100;
    if(p.seasonsAtClub>=3&&p.apps>=40&&Math.random()<.35) p.fanFav=true;
    p.injury=Math.max(0,p.injury-30);
  });
  return notes;
}
