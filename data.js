/* ============================== ABSOLUT COACH — DONNÉES ==============================
   Toutes les données statiques de la carrière d'entraîneur·euse. Les valeurs numériques
   (qualityMod, appealMod, feeRate, riskMod…) restent cachées dans l'interface avant validation. */

/* ---------- Styles de jeu (équivalent des genres) ---------- */
const STYLES = [
  { id:'possession',  icon:'🧠', name:"Possession patiente",     prestige:.70, appeal:.50, desc:"Garder le ballon, étouffer l'adversaire, attendre la faille." },
  { id:'pressing',    icon:'🔥', name:"Pressing haut",           prestige:.65, appeal:.62, desc:"Récupérer très haut, jouer vite, courir plus que tout le monde." },
  { id:'contre',      icon:'⚡', name:"Contre-attaque",          prestige:.40, appeal:.60, desc:"Attendre, aspirer, puis frapper en trois passes." },
  { id:'blocbas',     icon:'🧱', name:"Bloc bas",                prestige:.30, appeal:.30, desc:"Deux lignes de quatre, un gardien décisif, un point c'est tout." },
  { id:'direct',      icon:'🚀', name:"Jeu direct",              prestige:.22, appeal:.48, desc:"Longs ballons, seconds ballons, duels aériens et coups de pied arrêtés." },
  { id:'positionnel', icon:'📐', name:"Jeu de position",         prestige:.82, appeal:.42, desc:"Occupation rationnelle des espaces, supériorités et patience infinie." },
  { id:'total',       icon:'🌀', name:"Football total",          prestige:.88, appeal:.58, desc:"Tout le monde attaque, tout le monde défend, personne n'a de poste fixe." },
  { id:'catenaccio',  icon:'🔒', name:"Catenaccio moderne",      prestige:.50, appeal:.28, desc:"Un verrou, un libéro et des victoires 1-0 qui rendent fou." },
  { id:'ailes',       icon:'🪽', name:"Jeu par les ailes",       prestige:.45, appeal:.66, desc:"Débordements, centres et un avant-centre qui plane." },
  { id:'verticalite', icon:'🎯', name:"Verticalité",             prestige:.55, appeal:.60, desc:"Chaque passe doit faire mal. Aucune passe latérale n'est tolérée." },
  { id:'rock',        icon:'🎸', name:"Football rock'n'roll",    prestige:.48, appeal:.78, desc:"Des 4-3, des 5-4, des supporters qui hurlent et des défenseurs en larmes." },
  { id:'formation',   icon:'🌱', name:"Pari sur la formation",   prestige:.75, appeal:.40, desc:"Lancer les jeunes du centre, quitte à perdre quelques matchs." },
  { id:'physique',    icon:'💪', name:"Football athlétique",     prestige:.30, appeal:.50, desc:"Intensité, duels et un bloc qui écrase l'adversaire physiquement." },
  { id:'fantaisie',   icon:'🎩', name:"Fantaisie technique",     prestige:.60, appeal:.70, desc:"Dribbles, sombreros et un meneur qui refuse de défendre." },
];
function styleById(id){ return STYLES.find(s=>s.id===id)||STYLES[0]; }

/* ---------- Paliers de projets (équivalent des tiers de production) ---------- */
const TIERS = {
  louche:   { label:"Projet louche (club en perdition)", min:.01, max:.08, difficulty:0,  international:false, teams:14, req:()=>true },
  amateur:  { label:"Club amateur ambitieux (N3 / N2)",  min:.05, max:.4,  difficulty:0,  international:false, teams:14, req:()=>true },
  interim:  { label:"Intérim de sauvetage (pompier)",     min:.2,  max:2.2, difficulty:4,  international:false, teams:18, req:()=>true },
  national: { label:"National / Ligue 2",                 min:1,   max:8,   difficulty:10, international:false, teams:18, req:(s,n)=>n>=1 },
  ligue1:   { label:"Ligue 1 (club installé)",            min:12,  max:50,  difficulty:25, international:false, teams:18, req:(s,n)=>n>=2&&(s.repPublic>=15||s.repCritique>=15||s.reseau>=30) },
  etranger: { label:"Championnat étranger émergent",      min:4,   max:60,  difficulty:14, international:true,  teams:18, req:(s,n)=>n>=1&&(s.reseau>=12||s.repPublic>=8) },
  europe:   { label:"Club européen (coupe d'Europe)",     min:10,  max:80,  difficulty:30, international:true,  teams:20, req:(s,n)=>{
    const unlocked=typeof state!=='undefined'&&state&&state.internationalUnlocked;
    const classicPath=n>=2&&(s.repPublic>=25||s.repCritique>=25)&&s.reseau>=20;
    const provenPath=unlocked&&n>=1&&(s.repPublic>=15||s.repCritique>=15);
    return classicPath||provenPath; } },
  superclub:{ label:"Super-club mondial",                 min:70,  max:220, difficulty:42, international:true,  teams:20, req:(s,n)=>n>=4&&s.repPublic>=45&&(s.reseau>=45||(typeof state!=='undefined'&&state&&state.internationalUnlocked))&&s.technique>=40 },
};
const TIER_ORDER=['louche','amateur','national','ligue1','etranger','europe','superclub'];
const TIER_SHORT={louche:'Perdition',amateur:'Amateur',interim:'Intérim',national:'L2 / National',ligue1:'Ligue 1',etranger:'Étranger',europe:'Europe',superclub:'Super-club'};

/* Championnats étrangers (équivalent des plateformes SVOD) */
const LEAGUES = [
  { name:"MLS", country:"États-Unis", prestigeMod:-.05, appealBoost:.04, cities:["Austin","Portland","Nashville","Charlotte","Saint-Louis","San José"] },
  { name:"Saudi Pro League", country:"Arabie saoudite", prestigeMod:-.12, appealBoost:.08, cities:["Al-Khobar","Djeddah","Dammam","Riyad","Abha","Buraydah"] },
  { name:"J-League", country:"Japon", prestigeMod:.02, appealBoost:.01, cities:["Sapporo","Sendai","Kobe","Hiroshima","Niigata","Shizuoka"] },
  { name:"Liga MX", country:"Mexique", prestigeMod:-.03, appealBoost:.05, cities:["Puebla","León","Querétaro","Toluca","Tijuana","Monterrey"] },
  { name:"Süper Lig", country:"Turquie", prestigeMod:0, appealBoost:.06, cities:["Trabzon","Adana","Konya","Sivas","Antalya","Bursa"] },
  { name:"Pro League belge", country:"Belgique", prestigeMod:.03, appealBoost:0, cities:["Charleroi","Malines","Courtrai","Louvain","Gand","Ostende"] },
  { name:"Eredivisie", country:"Pays-Bas", prestigeMod:.06, appealBoost:0, cities:["Utrecht","Zwolle","Nimègue","Groningue","Heerenveen","Enschede"] },
  { name:"Brasileirão", country:"Brésil", prestigeMod:.02, appealBoost:.05, cities:["Curitiba","Fortaleza","Goiânia","Recife","Bahia","Belém"] },
];

const FRENCH_CITIES=["Lorient","Vannes","Quimper","Brest","Saint-Malo","Concarneau","Rennes","Angers","Laval","Le Mans","Tours","Orléans","Nancy","Metz","Reims","Troyes","Amiens","Caen","Rouen","Dijon","Besançon","Grenoble","Annecy","Clermont","Limoges","Bordeaux","Pau","Bayonne","Toulouse","Nîmes","Montpellier","Ajaccio","Bastia","Valenciennes","Lens","Sochaux","Guingamp","Auxerre","Niort","Châteauroux","Dunkerque","Boulogne","Red Star","Créteil","Sedan","Istres","Martigues","Cannes","Fréjus","Avranches","Vitré","Cholet","Bourg-en-Bresse","Villefranche","Chambly","Épinal","Colmar","Mulhouse"];
const EURO_CITIES=["Séville","Valence","Bilbao","Naples","Bergame","Turin","Lisbonne","Porto","Braga","Leipzig","Stuttgart","Francfort","Leverkusen","Brighton","Newcastle","Leicester","Glasgow","Édimbourg","Eindhoven","Rotterdam","Bruges","Salzbourg","Prague","Zagreb","Belgrade","Athènes","Copenhague","Bâle","Genève"];
const SUPER_CITIES=["Madrid","Barcelone","Munich","Manchester","Londres","Milan","Paris","Liverpool","Turin","Dortmund","Amsterdam","Lisbonne"];
const CLUB_PREFIXES=["FC","AS","US","Stade","Racing","Olympique","SC","Sporting","Union","Étoile","Athletic","Dynamo","Real","Atlético","Inter","Torpedo","Vitesse","Espérance","Avenir","Jeunesse"];
const CLUB_SUFFIXES=["","","","","Métropole","Sud","Atlantique","Océan","Alpes","Nord","Bretagne","Provence","Lorraine","City","United","Rovers"];
const COLOR_PAIRS=["rouge et noir","bleu et blanc","vert et blanc","jaune et bleu","grenat et or","violet et blanc","orange et noir","ciel et marine","rouge et or","noir et blanc","vert et noir","bleu et jaune"];

/* Synopsis de projets : {ville} et {couleurs} remplacés au tirage. objective = position visée. */
const PROJECT_CONCEPTS = {
  louche:[
    { t:"Sauver le {club} de la dissolution", s:"Le président a disparu avec la caisse, le stade est fermé pour vétusté et le kiné joue latéral droit. On te promet un salaire « bientôt ».", objective:.75 },
    { t:"Le {club} et son mécène invisible", s:"Un investisseur anonyme finance le club depuis les Îles Caïmans. Les joueurs sont payés en bons d'achat. La DNCG rôde.", objective:.7 },
    { t:"Redresser un club fantôme", s:"Onze licenciés, un terrain en pente et un capitaine de 47 ans. Le maire veut « un projet ambitieux ».", objective:.8 },
    { t:"Le {club} sous tutelle", s:"Interdiction de recruter, points de pénalité et une équipe de pré-retraités. Quelqu'un doit bien s'en occuper.", objective:.8 },
    { t:"Projet {club} : la dernière chance", s:"Trois entraîneur·euses en six mois, un vestiaire en guerre et des ultras qui campent devant le centre d'entraînement.", objective:.75 },
  ],
  amateur:[
    { t:"Faire monter le {club} en National", s:"Un club de village porté par une brasserie locale veut viser plus haut. L'ambition est réelle, les moyens beaucoup moins.", objective:.2 },
    { t:"Structurer le {club}", s:"Une pépinière de jeunes talents et un centre d'entraînement flambant neuf, mais aucune culture de la gagne.", objective:.35 },
    { t:"Le {club}, fierté du quartier", s:"Un club de banlieue populaire rêve de faire tomber un club pro en Coupe. Les moyens sont maigres, la ferveur immense.", objective:.4 },
    { t:"Sauver le {club} de la relégation", s:"Le club a chuté deux fois de suite. Le maintien est l'unique mission, et les bénévoles comptent sur toi.", objective:.7 },
    { t:"Le {club} et son nouveau stade", s:"Une enceinte de 6 000 places toute neuve pour un club de N3 : la mairie veut la remplir tous les quinze jours.", objective:.3 },
    { t:"Renaissance du {club}", s:"Un ancien club pro tombé au 5e échelon. Les anciens veulent revoir les {couleurs} en haut de l'affiche.", objective:.25 },
  ],
  interim:[
    { t:"Pompier de service au {club}", s:"Relégable à la trêve, l'entraîneur viré, le président paniqué : il faut sauver la saison en quelques mois.", objective:.72 },
    { t:"Sauvetage express du {club}", s:"Le vestiaire s'est mutiné contre l'ancien coach. Ta mission tient en deux mots : maintien, vite.", objective:.72 },
  ],
  national:[
    { t:"Le {club} veut retrouver la Ligue 1", s:"Descendu il y a trois ans, le club vit encore avec un budget d'élite et l'impatience d'un public habitué à mieux.", objective:.12 },
    { t:"Stabiliser le {club} en Ligue 2", s:"Un promu sans histoire, une direction prudente et une seule consigne : ne pas redescendre.", objective:.6 },
    { t:"Le projet data du {club}", s:"Un propriétaire américain et un algorithme de recrutement. Il veut du beau jeu, des jeunes à revendre et un coach qui suit le modèle.", objective:.3 },
    { t:"Le {club} des {couleurs}", s:"Un club historique en sommeil, un public fidèle et une équipe vieillissante. Il va falloir choisir entre les anciens et l'avenir.", objective:.4 },
    { t:"Le {club} joue le haut de tableau", s:"Le recrutement a été soigné, la direction rêve de barrages. Le moindre passage à vide sera lu comme une trahison.", objective:.2 },
    { t:"Reconstruire le {club} après le scandale", s:"Match truqué, dirigeants en garde à vue, sponsors envolés. Il reste un centre de formation excellent et une réputation à refaire.", objective:.45 },
  ],
  ligue1:[
    { t:"Le {club} vise l'Europe", s:"Un budget solide, un stade plein et une direction qui n'accepte plus le ventre mou. Objectif : les places européennes.", objective:.25 },
    { t:"Maintenir le {club} dans l'élite", s:"Promu surprise, le club veut simplement rester. Les ultras, eux, attendent déjà des victoires contre les gros.", objective:.68 },
    { t:"Le {club} change de propriétaire", s:"Un fonds d'investissement vient de racheter le club. Il exige du jeu, des plus-values et une image moderne.", objective:.4 },
    { t:"Le {club} et sa légende", s:"Le club a gagné le titre il y a vingt ans et n'a jamais digéré. Chaque saison recommence la comparaison.", objective:.3 },
    { t:"Rajeunir le {club}", s:"Le centre de formation sort une génération dorée. La direction veut la lancer sans exploser en vol.", objective:.45 },
    { t:"Le {club} des ambitions retrouvées", s:"Nouveau stade, nouveau sponsor, nouveau logo. Il ne manque plus qu'une équipe qui gagne.", objective:.35 },
  ],
  etranger:[
    { t:"Bâtir le {club} de zéro", s:"Une franchise créée il y a deux ans, des moyens confortables et un public curieux mais volatil.", objective:.4 },
    { t:"Le {club}, vitrine du championnat", s:"Le club veut attirer des stars et un football spectaculaire. Le classement compte moins que l'image.", objective:.35 },
    { t:"Faire briller le {club} à l'étranger", s:"Une ligue en croissance, des trajets interminables et une pression médiatique inattendue.", objective:.4 },
    { t:"Le {club} et son émir impatient", s:"Un propriétaire richissime qui veut tout, tout de suite, et qui change d'entraîneur comme de voiture.", objective:.2 },
    { t:"Projet {club} : l'aventure", s:"Un club historique d'un championnat émergent, une ville folle de football et une langue que tu ne parles pas.", objective:.45 },
  ],
  europe:[
    { t:"Ramener le {club} en Coupe d'Europe", s:"Un club de tradition européenne, un public exigeant et un effectif bâti pour jouer deux compétitions.", objective:.2 },
    { t:"Le {club} veut son quart de finale", s:"Qualifié pour la Coupe Continentale, le club rêve d'un printemps européen sans sacrifier le championnat.", objective:.25 },
    { t:"Faire du {club} un candidat au titre", s:"Un budget dans le top 5 national, un président ambitieux et un rival historique qui gagne tout depuis dix ans.", objective:.15 },
    { t:"Le {club} et sa reconstruction", s:"Un géant déchu, endetté mais adoré. Les plus-values sont obligatoires, les défaites interdites.", objective:.3 },
    { t:"Le {club} des jeunes loups", s:"Le club vend chaque été ses meilleurs éléments. La direction veut quand même l'Europe, avec des joueurs de 21 ans.", objective:.3 },
  ],
  superclub:[
    { t:"Gagner tout avec le {club}", s:"Un effectif de stars, un budget illimité et une seule issue acceptable : tous les trophées disponibles.", objective:.05 },
    { t:"Le {club} veut la Coupe d'Europe", s:"Le titre national est acquis d'avance aux yeux du public. Seule la grande coupe européenne fera date.", objective:.08 },
    { t:"Le {club} après l'ère de gloire", s:"Le coach précédent a tout gagné pendant huit ans. Tu hérites d'un vestiaire de légendes vieillissantes et d'un public nostalgique.", objective:.1 },
    { t:"Reconstruire le {club} en gagnant", s:"Le propriétaire veut rajeunir, vendre les stars et rester champion. Toutes ces choses en même temps.", objective:.1 },
  ],
};

/* ---------- Profil ---------- */
const BASE_STATS={ talent:32, technique:26, reseau:16, repCritique:50, repPublic:50, moral:65 };
const STAT_LABELS={ talent:"Tactique", technique:"Gestion", reseau:"Réseau", repCritique:"Réputation presse", repPublic:"Cote supporters", moral:"Moral", argent:"Capital" };
const STAT_HELP={ talent:"Lecture du jeu, idées, capacité à transformer un effectif en équipe.", technique:"Gestion d'un groupe, d'un staff, d'un calendrier chargé et de projets complexes.", reseau:"Accès aux clubs, agents, joueurs et opportunités à l'étranger.", repCritique:"Crédit auprès des journalistes, des observateurs et des jurys.", repPublic:"Popularité auprès des supporters, accès aux gros projets.", moral:"Endurance personnelle face aux périodes difficiles." };

const NATIONALITIES=[
  { id:'fr', name:"Française", desc:"École de la formation et du jeu structuré.", favoredStyleIds:['formation','positionnel'], bonus:{talent:4, repCritique:2} },
  { id:'es', name:"Espagnole", desc:"Culture de la possession et du jeu de position.", favoredStyleIds:['possession','positionnel'], bonus:{talent:5, repCritique:1} },
  { id:'de', name:"Allemande", desc:"Gegenpressing, intensité et rigueur analytique.", favoredStyleIds:['pressing','verticalite'], bonus:{technique:4, talent:1} },
  { id:'it', name:"Italienne", desc:"Science défensive et art du résultat.", favoredStyleIds:['catenaccio','blocbas'], bonus:{technique:3, repCritique:2} },
  { id:'nl', name:"Néerlandaise", desc:"Héritière du football total et des académies.", favoredStyleIds:['total','formation'], bonus:{talent:4, repPublic:1} },
  { id:'en', name:"Anglaise", desc:"Intensité, duels et ferveur des tribunes.", favoredStyleIds:['direct','physique'], bonus:{repPublic:3, reseau:2} },
  { id:'pt', name:"Portugaise", desc:"Génération de tacticien·nes formé·es sur les bancs d'école.", favoredStyleIds:['contre','possession'], bonus:{technique:3, talent:2} },
  { id:'ar', name:"Argentine", desc:"Grinta, folie et amour du dribble.", favoredStyleIds:['rock','fantaisie'], bonus:{talent:3, repPublic:2} },
  { id:'br', name:"Brésilienne", desc:"Le joga bonito comme religion.", favoredStyleIds:['fantaisie','ailes'], bonus:{repPublic:4, talent:1} },
  { id:'be', name:"Belge", desc:"Une génération dorée et un goût pour les projets modestes.", favoredStyleIds:['formation','contre'], bonus:{talent:3, reseau:1} },
  { id:'sn', name:"Sénégalaise", desc:"Puissance, discipline et lien fort avec les joueurs.", favoredStyleIds:['physique','pressing'], bonus:{talent:3, moral:3} },
  { id:'ma', name:"Marocaine", desc:"Organisation collective et fierté d'un football en pleine ascension.", favoredStyleIds:['blocbas','contre'], bonus:{technique:3, moral:2} },
  { id:'hr', name:"Croate", desc:"Une petite nation qui produit de grands milieux et de grands tacticiens.", favoredStyleIds:['possession','verticalite'], bonus:{talent:3, technique:1} },
  { id:'jp', name:"Japonaise", desc:"Discipline, technique et respect du plan de jeu.", favoredStyleIds:['positionnel','ailes'], bonus:{technique:4} },
  { id:'us', name:"Américaine", desc:"Formée à la data, au marketing et à l'optimisation.", favoredStyleIds:['direct','pressing'], bonus:{reseau:4, technique:2} },
  { id:'no', name:"Norvégienne", desc:"Pragmatisme scandinave et confiance dans les jeunes.", favoredStyleIds:['direct','formation'], bonus:{technique:3, moral:2} },
];

const MENTORS=[
  { id:'vanguard', name:"Arsène Vanguard", style:"Bâtisseur patient de clubs et de jeunes talents", bonus:{talent:4, repCritique:2}, styleAuteur:true },
  { id:'guerrero', name:"Diego Guerrero", style:"Motivateur volcanique, roi des vestiaires", bonus:{technique:3, repPublic:3}, styleAuteur:false },
  { id:'meijer', name:"Johan Meijer", style:"Théoricien du jeu de position et de la possession", bonus:{talent:5, repPublic:-1}, styleAuteur:true },
  { id:'schneider', name:"Ralf Schneider", style:"Inventeur du pressing moderne", bonus:{talent:3, technique:3}, styleAuteur:true },
  { id:'moretti', name:"Carlo Moretti", style:"Maître de l'organisation défensive", bonus:{technique:5, repCritique:1}, styleAuteur:false },
  { id:'ferreira', name:"José Ferreira", style:"Pragmatique flamboyant, gagne d'abord, explique après", bonus:{technique:4, repPublic:3, repCritique:-1}, styleAuteur:false },
  { id:'bielsano', name:"Marcelo Bielsano", style:"Obsessionnel du détail, adoré des joueurs et des journalistes", bonus:{talent:5, moral:-2, repCritique:2}, styleAuteur:true },
  { id:'okafor', name:"Grace Okafor", style:"Pionnière de la data appliquée au terrain", bonus:{technique:4, reseau:2}, styleAuteur:false },
  { id:'lindqvist', name:"Ingrid Lindqvist", style:"Formatrice de génies, croit aux jeunes avant tout", bonus:{talent:4, repCritique:2}, styleAuteur:true },
  { id:'rossi', name:"Federica Rossi", style:"Stratège froide des grandes soirées européennes", bonus:{technique:4, talent:2}, styleAuteur:false },
  { id:'dupont', name:"Roger Dupont", style:"Vieux renard des divisions inférieures, sait tout sur le maintien", bonus:{technique:3, moral:4}, styleAuteur:false },
  { id:'sato', name:"Kenji Sato", style:"Perfectionniste discret, aimé pour son calme", bonus:{talent:3, technique:2, moral:2}, styleAuteur:true },
];

const QUALITES=[
  { id:'perseverant', name:"Persévérant·e", desc:"Tu ne lâches rien après une défaite.", bonus:{technique:3}, riskReduction:8 },
  { id:'charisme', name:"Charismatique", desc:"Les joueurs te suivent instinctivement.", bonus:{reseau:4}, appealBoost:6 },
  { id:'visionnaire', name:"Visionnaire", desc:"Tu vois une équipe là où les autres voient onze joueurs.", bonus:{talent:4}, prestigeBoost:6 },
  { id:'rigoureux', name:"Rigoureux·se", desc:"Chaque séance est préparée au millimètre.", bonus:{technique:3, repCritique:2}, riskReduction:5 },
  { id:'empathique', name:"Empathique", desc:"Tu sais écouter un vestiaire et libérer les joueurs.", bonus:{talent:2, moral:5, reseau:1}, riskReduction:3 },
  { id:'audacieux', name:"Audacieux·se", desc:"Tu assumes les choix que d'autres n'oseraient jamais.", bonus:{talent:3}, prestigeBoost:8 },
  { id:'diplomate', name:"Diplomate", desc:"Même un président furieux finit par se rasseoir.", bonus:{reseau:5, moral:2}, riskReduction:5 },
  { id:'travailleur', name:"Infatigable", desc:"Vidéo jusqu'à 3 h du matin, séance à 8 h.", bonus:{technique:4, moral:3}, riskReduction:2 },
  { id:'curieux', name:"Curieux·se", desc:"Chaque style, chaque championnat peut nourrir ton football.", bonus:{talent:3, technique:2}, prestigeBoost:3 },
  { id:'federe', name:"Fédérateur·rice", desc:"Les joueurs veulent revenir jouer pour toi.", bonus:{reseau:4, repPublic:2}, appealBoost:3 },
  { id:'pragmatique', name:"Pragmatique", desc:"Tu sais sauver une saison sans renier tes idées.", bonus:{technique:3, reseau:2}, riskReduction:6 },
  { id:'instinctif', name:"Instinctif·ve", desc:"Tu sens un changement avant qu'il soit évident.", bonus:{talent:4}, appealBoost:3 },
];
const DEFAUTS=[
  { id:'impulsif', name:"Impulsif·ve", desc:"Tu changes d'équipe sur un coup de sang.", bonus:{}, riskBoost:10, scandalStart:5 },
  { id:'perfectionniste', name:"Perfectionniste", desc:"Rien n'est jamais assez bien, le staff s'épuise.", bonus:{talent:2, reseau:-2}, riskBoost:3 },
  { id:'arrogant', name:"Arrogant·e", desc:"Ta conférence de presse d'arrivée a déjà fait trois ennemis.", bonus:{repPublic:-3}, riskBoost:6 },
  { id:'anxieux', name:"Anxieux·se", desc:"Le doute te ronge avant chaque match.", bonus:{reseau:-2}, riskBoost:4 },
  { id:'depensier', name:"Dépensier·ère", desc:"Il manque toujours un dernier recrutement.", bonus:{technique:2}, riskBoost:8 },
  { id:'autoritaire', name:"Autoritaire", desc:"Tu obtiens ce que tu veux, mais certains joueurs ne te pardonnent jamais.", bonus:{technique:3, reseau:-4}, riskBoost:6, scandalStart:3 },
  { id:'disperse', name:"Dispersé·e", desc:"Dix systèmes en dix matchs, et un vestiaire perdu.", bonus:{talent:3, technique:-3}, riskBoost:7 },
  { id:'opportuniste', name:"Opportuniste", desc:"Tu flaires le bon projet, quitte à trahir un club.", bonus:{repPublic:4, repCritique:-3}, riskBoost:4 },
  { id:'provocateur', name:"Provocateur·rice", desc:"L'arbitre, l'adversaire et la presse : tout le monde y passe.", bonus:{repPublic:2}, riskBoost:9, scandalStart:7 },
  { id:'secret', name:"Secret·ète", desc:"Tu protèges ton groupe, mais ton silence agace les dirigeants.", bonus:{repCritique:2, reseau:-3}, riskBoost:3 },
  { id:'nostalgique', name:"Nostalgique", desc:"Le football d'avant était mieux, et tu le dis trop souvent.", bonus:{talent:2, repPublic:-2}, riskBoost:3 },
  { id:'impatient', name:"Impatient·e", desc:"Tu veux les résultats avant même la fin de la préparation.", bonus:{reseau:1, technique:-2}, riskBoost:8 },
];

const ORIGINES=[
  { id:'ancienpro', name:"Ancien·ne joueur·euse pro", desc:"Le nom ouvre des portes, le vestiaire t'écoute, mais tout reste à prouver sur le banc.", bonus:{reseau:6, repPublic:5, technique:-2}, capitalMod:.1, fateBias:0 },
  { id:'educateur', name:"Éducateur·rice de quartier", desc:"Vingt ans de U13 sous la pluie. Peu de réseau, énormément de résilience.", bonus:{talent:2, technique:2, reseau:-4, moral:8}, capitalMod:-.15, riskReduction:6, fateBias:1 },
  { id:'analyste', name:"Analyste vidéo", desc:"Tu as vu dix mille matchs découpés en séquences. Reste à parler aux humains.", bonus:{technique:6, talent:3, reseau:-2, repPublic:-2}, capitalMod:0, fateBias:0 },
  { id:'diplome', name:"Diplômé·e de l'école fédérale", desc:"Formation solide, promo soudée, départ comme tout le monde.", bonus:{technique:6, talent:3, repCritique:2}, capitalMod:0, fateBias:0 },
  { id:'consultant', name:"Consultant·e télé", desc:"Une communauté déjà acquise, un franc-parler apprécié, mais peu de terrain.", bonus:{repPublic:9, reseau:4, talent:-2, moral:5}, capitalMod:.05, fateBias:0 },
  { id:'nepo', name:"Enfant du président", desc:"Papa a un club, un carnet d'adresses et une fortune. On te le rappellera à chaque défaite.", bonus:{reseau:10, repCritique:-4, moral:-5}, capitalMod:.55, scandalStart:8, fateBias:-1 },
  { id:'prof', name:"Professeur·e d'EPS", desc:"Pédagogie, patience et une passion tardive pour les bancs de touche.", bonus:{talent:3, moral:5, technique:1, reseau:-3}, capitalMod:-.06, riskReduction:3, fateBias:1 },
  { id:'prepa', name:"Préparateur·rice physique", desc:"Tu sais tout du corps des joueurs, moins de la tactique.", bonus:{technique:5, talent:-2, reseau:2}, capitalMod:.04, riskReduction:5, fateBias:0 },
  { id:'adjoint', name:"Adjoint·e de longue date", desc:"Tu connais chaque secret de vestiaire, chaque compromis d'un staff.", bonus:{technique:6, reseau:4, talent:-1}, capitalMod:0, riskReduction:5, fateBias:0 },
  { id:'futsal', name:"Coach de futsal", desc:"Vitesse, technique et une lecture du jeu en espace réduit hors norme.", bonus:{talent:6, technique:-1, reseau:-3, moral:3}, capitalMod:-.08, fateBias:1 },
  { id:'academie', name:"Formateur·rice en académie", desc:"Tu as lancé des internationaux. Les grands vestiaires sont un autre monde.", bonus:{talent:5, repCritique:3, technique:-2, reseau:2}, capitalMod:.03, fateBias:0 },
  { id:'gardien', name:"Ancien·ne gardien·ne", desc:"Tu as passé quinze ans à regarder le jeu de loin. Tu l'as compris mieux que tout le monde.", bonus:{talent:4, technique:2, repPublic:1, reseau:-1}, capitalMod:0, riskReduction:2, fateBias:0 },
];

const CAREER_MODES=[
  { id:'classic', icon:'⚽', name:"Carrière classique", difficulty:"★☆☆☆☆ · Équilibré", desc:"L'expérience de base : fragile au départ, imprévisible, mais juste.", details:["Économie neutre","4 saisons ratées tolérées","Sauvetage et enveloppe de secours disponibles"], rules:{capitalMult:1, quality:0, appeal:0, critique:0, variance:1, upkeep:1, incident:0, costBias:0, systemWear:1, pressurePerSeason:0, annualPressure:0, recoveryMult:1, flopLimit:4, rescue:true, emergencyLoan:true} },
  { id:'auteur', icon:'🌱', name:"Bâtisseur·euse incompris·e", difficulty:"★★☆☆☆ · Exigeant", desc:"Moins de moyens, un public impatient, mais une vraie avance tactique et une presse conquise.", details:["35 % de capital en moins","Presse plus réceptive","Supporters et capital plus difficiles"], rules:{capitalMult:.65, quality:5, appeal:-.055, critique:5, variance:1.1, upkeep:1.08, incident:.025, costBias:.05, systemWear:1.06, pressurePerSeason:2, annualPressure:1, recoveryMult:.9, flopLimit:4, rescue:true, emergencyLoan:true} },
  { id:'studio', icon:'🏟️', name:"Machine à trophées", difficulty:"★★★☆☆ · Stratégique", desc:"Du capital et un public acquis, mais chaque saison doit répondre aux attentes des actionnaires.", details:["Capital de départ ×4","Frais fixes et usure élevés","Une saison impopulaire fait exploser la pression"], rules:{capitalMult:4, quality:-2, appeal:.06, critique:-3, variance:.92, upkeep:2.1, incident:.055, costBias:.16, systemWear:1.18, pressurePerSeason:6, annualPressure:3, recoveryMult:.82, flopLimit:4, rescue:true, emergencyLoan:true} },
  { id:'chaos', icon:'🎲', name:"Football chaos", difficulty:"★★★★☆ · Imprévisible", desc:"Résultats extrêmes, blessures et scandales fréquents, pression erratique : aucune saison tiède.", details:["Variance presque doublée","Incidents très fréquents","Pression et coûts instables"], rules:{capitalMult:1.15, quality:0, appeal:0, critique:0, variance:1.85, upkeep:1.3, incident:.18, costBias:.12, systemWear:1.16, pressurePerSeason:2, annualPressure:2, recoveryMult:.72, flopLimit:4, rescue:true, emergencyLoan:true} },
  { id:'iron', icon:'💀', name:"Dernier contrat", difficulty:"★★★★★ · Brutal", desc:"Très peu de capital, trois saisons ratées suffisent et aucun mécène ne viendra te sauver.", details:["55 % de capital en moins","3 saisons ratées mettent fin à la carrière","Ni intérim de sauvetage ni enveloppe de secours"], rules:{capitalMult:.45, quality:1, appeal:-.01, critique:1, variance:1.3, upkeep:1.85, incident:.11, costBias:.24, systemWear:1.3, pressurePerSeason:5, annualPressure:3, recoveryMult:.58, flopLimit:3, rescue:false, emergencyLoan:false} },
];
function careerModeDefinition(id){ return CAREER_MODES.find(m=>m.id===id)||CAREER_MODES[0]; }

const CAREER_STRATEGIES=[
  { id:'auteur', icon:'🖋️', name:"Affirmer une philosophie", desc:"+5 qualité et +4 presse, mais moins de spectacle facile.", quality:5, critique:4, appeal:-.045, variance:1.05 },
  { id:'public', icon:'📣', name:"Reconquérir les tribunes", desc:"Un fort bonus de popularité, au prix d'un léger soupçon de la presse.", quality:-1, critique:-2, appeal:.075, variance:1 },
  { id:'precision', icon:'📐', name:"Verrouiller l'organisation", desc:"Des saisons plus solides et moins variables, sans raccourci.", quality:4, critique:2, appeal:.01, variance:.78 },
  { id:'rupture', icon:'⚡', name:"Tout réinventer", desc:"Variance énorme : révolution tactique ou naufrage spectaculaire.", quality:1, critique:1, appeal:.01, variance:1.55 },
  { id:'favorite', icon:'❤️', name:"Creuser ton style", desc:"Très fort dans ton style favori, légèrement plus faible ailleurs.", quality:0, critique:1, appeal:0, variance:1, favoriteQuality:7, otherQuality:-2 },
  { id:'international', icon:'🌍', name:"Penser à l'international", desc:"Plus d'attrait et de réseau sur les projets à l'étranger et en Europe.", quality:1, critique:0, appeal:.025, variance:1, internationalQuality:4 },
  { id:'actors', icon:'🤝', name:"Bâtir un noyau dur", desc:"Le travail humain améliore la qualité, mais coûte de l'énergie.", quality:3, critique:2, appeal:.015, variance:1.05, pressure:7 },
  { id:'survival', icon:'🛟', name:"Assurer la survie", desc:"Moins flamboyant, beaucoup plus stable, et la pression redescend.", quality:1, critique:0, appeal:.015, variance:.7, pressure:-15 },
];

/* ---------- Jauges du club (équivalent des six jauges du studio) ---------- */
const CAREER_SYSTEM_KEYS=['ethics','eco','union','relation','continuity','archive'];
const BASE_SYSTEM_DEFINITIONS=[
  { key:'ethics', icon:'⚖️', label:'Intégrité', up:'transparence, refus des combines et des agents douteux', down:'arrangements, pressions sur les arbitres et primes occultes', impact:'confiance, scandales et risque de licenciement conflictuel en cours de saison' },
  { key:'eco', icon:'🌱', label:'Écologie', up:'déplacements sobres, stade et centre responsables', down:'jets privés et greenwashing', impact:'surcoûts logistiques, fatigue et pression des saisons' },
  { key:'union', icon:'✊', label:'Vestiaire', up:'accords collectifs, primes partagées et écoute des joueurs', down:'passages en force et mises à l\'écart', impact:'grèves, moral, qualité collective et risque de rupture du groupe' },
  { key:'relation', icon:'❤️', label:'Direction & staff', up:'dialogue avec le président, crédit partagé avec le staff', down:'promesses rompues et guerres d\'ego', impact:'coordination, loyauté du staff et risque de saison qui s\'enlise (durée et budget doublés)' },
  { key:'continuity', icon:'🌌', label:'Identité de jeu', up:'principes stables, projet lisible et fidélité du public', down:'changements de système opportunistes', impact:'fidélité des supporters et recettes de toutes les saisons, plus fortement lorsque tu restes au même club' },
  { key:'archive', icon:'🎓', label:'Formation', up:'centre de formation, scouting et suivi des jeunes', down:'abandon des jeunes et recrutement panique', impact:'coût du recrutement, projets de formation, regard de la presse et chance qu\'un ancien flop devienne une révélation' },
];
const BASE_SYSTEM_MILESTONES={
  ethics:{ icon:'⚖️', name:'Autorité morale', desc:'Ton nom devient un gage de confiance : les scandales s\'éteignent plus vite et les supporters accordent davantage de crédit à tes projets.', effects:{repCritique:4, reseau:3, scandalRisk:-15} },
  eco:{ icon:'🌿', name:'Club régénératif', desc:'Tes méthodes deviennent une référence : chaque saison génère moins de pression et ta gestion progresse.', effects:{technique:4, pressure:-10} },
  union:{ icon:'✊', name:'Vestiaire modèle', desc:'Les joueurs veulent jouer pour toi : stabilité du groupe et transmission deviennent des avantages permanents.', effects:{technique:3, moral:6, crewLoyalty:12} },
  relation:{ icon:'❤️', name:'Staff indéfectible', desc:'Ton staff te suit partout : sa loyauté résiste aux crises et nourrit directement tes idées.', effects:{talent:3, reseau:4, crewLoyalty:15} },
  continuity:{ icon:'🌌', name:'Architecte de projet', desc:'Tu maîtrises les projets au long cours : rester plusieurs saisons dans un club ne subit plus l\'usure aléatoire du discours.', effects:{talent:4, repPublic:3, nextQuality:3} },
  archive:{ icon:'🎓', name:'École reconnue', desc:'Ton travail de formation transforme le regard porté sur toute ta carrière et renforce durablement sa réception.', effects:{repCritique:6, technique:2} },
};

/* ---------- Recrutement (équivalent du casting) ---------- */
const PLAYER_FIRST=["Kévin","Yanis","Théo","Moussa","Pablo","Jonas","Enzo","Ibrahima","Lucas","Mattéo","Rayan","Nolan","Ousmane","Marco","Diego","Luka","Tomas","Ilyes","Bastien","Sofiane","Gaëtan","Amine","Nikola","Jules","Adama","Erwan","Malo","Tiago","Wesley","Kylian","Elias","Noa","Aurélien","Samir","Cheikh","Léo","Mehdi","Ronan","Idriss","Timothée"];
const PLAYER_LAST=["Marchal","Belkacem","Le Goff","Diakité","Ferreira","Lindqvist","Rinaldi","Sarr","Moreau","Costa","Benali","Kowalski","Traoré","Petit","Nguyen","Rousseau","Okonkwo","Da Silva","Guéguen","Lemaire","Popovic","Mendy","Fontaine","Bakker","Haddad","Kerouac","Ricci","Camara","Delacroix","Yilmaz","Kone","Brandão","Meunier","Rahimi","Novak","Diallo","Le Bihan","Schmitt","Vasquez","Kerbrat"];
const POSITIONS=["gardien","défenseur central","latéral","milieu récupérateur","milieu relayeur","meneur de jeu","ailier","avant-centre"];
const RECRUIT_TYPES=[
  { id:'star', icon:'⭐', label:"Star confirmée", sub:"Une signature qui fait la une, un salaire qui fait trembler le comptable.", feeRate:[.24,.45], quality:[6,11], appeal:[.08,.15], risk:6, tiers:[3,4] },
  { id:'sure', icon:'🛡️', label:"Valeur sûre", sub:"Un·e pro fiable qui a déjà tout vu, sans folie mais sans surprise.", feeRate:[.12,.2], quality:[4,7], appeal:[.03,.06], risk:0, tiers:[2,3] },
  { id:'jeune', icon:'🌱', label:"Jeune talent", sub:"Une pépite du centre ou d'un club voisin : grosse marge, grosse variance.", feeRate:[.03,.08], quality:[-2,7], appeal:[.01,.05], risk:2, tiers:[1,2], archive:true },
  { id:'pari', icon:'🎲', label:"Pari libre", sub:"Un·e vétéran sans contrat ou un talent brisé. Presque gratuit, rarement neutre.", feeRate:[.01,.04], quality:[-4,6], appeal:[0,.04], risk:4, tiers:[1,2] },
  { id:'interne', icon:'🏠', label:"Promotion interne", sub:"Aucun recrutement : tu lances les jeunes et tu soudes le groupe existant.", feeRate:[0,0], quality:[-1,4], appeal:[-.01,.02], risk:-2, tiers:[1,1], union:3, continuity:3 },
];
const RECRUIT_STRENGTHS=[["Leader de vestiaire",'union'],["Finisseur·euse clinique",'appeal'],["Moteur infatigable",'quality'],["Idole des tribunes",'appeal'],["Intelligence de jeu rare",'quality'],["Professionnel·le exemplaire",'union'],["Polyvalent·e",'quality'],["Spécialiste des coups de pied arrêtés",'quality'],["Vitesse supersonique",'appeal'],["Mentor des jeunes",'archive']];
const RECRUIT_WEAKNESSES=[["Ego surdimensionné",'union'],["Genoux en verre",'risk'],["Allergique à la défense",'quality'],["Aime trop la nuit",'scandal'],["Agent envahissant",'relation'],["Colérique",'risk'],["Salaire exorbitant",'money'],["Ne parle pas la langue",'quality'],["Nostalgique de son ancien club",'union'],["Blessures fréquentes",'risk']];

/* ---------- Gestion du vestiaire (équivalent de la direction d'acteurs) ---------- */
const VESTIAIRE_OPTIONS=[
  { id:'strict', icon:'📏', label:"Discipline de fer", sub:"Amendes, horaires et téléphones interdits. Le groupe marche droit ou ne marche pas.", qualityMod:3, critiqueMod:1, appealMod:-.01, union:-3, pressure:3 },
  { id:'proximite', icon:'🤗', label:"Proximité et confiance", sub:"Tu connais le prénom des enfants de chaque joueur. Le vestiaire est une famille.", qualityMod:2, critiqueMod:0, appealMod:.02, union:4, relation:1, pressure:-2 },
  { id:'capitaine', icon:'🎖️', label:"Conseil des capitaines", sub:"Trois cadres décident avec toi. Moins de contrôle, plus d'adhésion.", qualityMod:2, critiqueMod:1, appealMod:.01, union:3, risk:-2 },
  { id:'rotation', icon:'🔄', label:"Rotation totale", sub:"Personne n'est titulaire indiscutable. Tout le monde joue, tout le monde doute.", qualityMod:1, critiqueMod:2, appealMod:-.02, union:-1, risk:-3, archive:2 },
  { id:'stars', icon:'👑', label:"Priorité aux stars", sub:"Les cadres ont tous les droits, les jeunes cirent les crampons.", qualityMod:4, critiqueMod:-1, appealMod:.04, union:-4, archive:-2, risk:2 },
  { id:'jeunes', icon:'🌱', label:"Confiance aux jeunes", sub:"Les titis du centre jouent, même quand ça coûte des points.", qualityMod:-1, critiqueMod:3, appealMod:.02, archive:4, continuity:2, risk:1 },
  { id:'psy', icon:'🧘', label:"Préparation mentale", sub:"Un psychologue, des séances de respiration et des joueurs qui pleurent moins après les défaites.", qualityMod:2, critiqueMod:1, appealMod:0, moneyMod:.02, pressure:-4, union:1 },
  { id:'guerre', icon:'⚔️', label:"Mentalité de guerre", sub:"Nous contre le monde. Les journalistes sont l'ennemi, les arbitres aussi.", qualityMod:3, critiqueMod:-3, appealMod:.05, scandal:4, pressure:5, union:2 },
  { id:'silence', icon:'🤫', label:"Silence radio", sub:"Aucune fuite, aucune interview. Le vestiaire devient un bunker.", qualityMod:1, critiqueMod:-2, appealMod:-.02, relation:-2, union:2, pressure:-1 },
  { id:'neutral', icon:'📋', label:"Management classique", sub:"Sans parti pris particulier : des séances, des consignes, des remplaçants qui râlent un peu.", qualityMod:0, critiqueMod:0, appealMod:0 },
];

/* ---------- Système de jeu (équivalent de la mise en scène) ---------- */
const TACTIC_OPTIONS=[
  { id:'t_possession', label:"Possession étouffante", sub:"70 % de ballon, mille passes, l'adversaire court derrière un fantôme.", fit:['possession','positionnel','total'], critiqueMod:5, appealMod:-.01, riskMod:1 },
  { id:'t_press', label:"Pressing coordonné", sub:"Récupération en six secondes, blocs compacts et sprints répétés.", fit:['pressing','verticalite','physique'], critiqueMod:4, appealMod:.03, riskMod:3 },
  { id:'t_bloc', label:"Bloc bas et transitions", sub:"On souffre, on récupère, on tue en contre.", fit:['blocbas','contre','catenaccio'], critiqueMod:-1, appealMod:-.02, riskMod:-3 },
  { id:'t_direct', label:"Jeu long et seconds ballons", sub:"Un pivot de 1m92 et des milieux qui ramassent les miettes.", fit:['direct','physique'], critiqueMod:-3, appealMod:0, riskMod:-2 },
  { id:'t_ailes', label:"Largeur maximale", sub:"Deux ailiers pieds inversés, des centres en rafale, un buteur de surface.", fit:['ailes','rock','contre'], critiqueMod:1, appealMod:.05, riskMod:1 },
  { id:'t_libero', label:"Trois centraux et un libéro", sub:"Une relance propre et un verrou : le retour du libéro fait fureur.", fit:['catenaccio','positionnel','possession'], critiqueMod:3, appealMod:-.01, riskMod:0 },
  { id:'t_chaos', label:"Attaque totale", sub:"Cinq attaquants, aucun latéral, des matchs de folie.", fit:['rock','fantaisie','total'], critiqueMod:0, appealMod:.09, riskMod:5 },
  { id:'t_meneur', label:"Tout pour le numéro 10", sub:"Un meneur libre, dispensé de repli, et dix coéquipiers qui compensent.", fit:['fantaisie','ailes'], critiqueMod:2, appealMod:.06, riskMod:3 },
  { id:'t_academie', label:"Onze du centre", sub:"Des jeunes formés au club à chaque ligne, le même football des U15 aux pros.", fit:['formation','positionnel','total'], critiqueMod:4, appealMod:.01, riskMod:2, archive:3 },
  { id:'t_verticale', label:"Verticalité brutale", sub:"Trois passes maximum avant la frappe. Le ballon ne recule jamais.", fit:['verticalite','contre','pressing'], critiqueMod:2, appealMod:.04, riskMod:2 },
  { id:'t_hybride', label:"Système caméléon", sub:"Un plan différent pour chaque adversaire. Génial si le groupe suit, illisible sinon.", fit:['positionnel','total','pressing'], critiqueMod:3, appealMod:0, riskMod:4 },
  { id:'t_classique', label:"4-4-2 des familles", sub:"Deux lignes, deux attaquants, zéro fioriture.", fit:['direct','blocbas','ailes'], critiqueMod:-2, appealMod:.01, riskMod:-2 },
];

/* ---------- Staff et infrastructures (équivalent lieu + direction artistique) ---------- */
const STAFF_OPTIONS=[
  { id:'altitude', icon:'🏔️', label:"Stage en altitude", sub:"Trois semaines dans les Alpes : des poumons de fer et des genoux qui grincent.", moneyMod:.05, qualityMod:3, riskMod:2, appealMod:0 },
  { id:'data', icon:'📊', label:"Cellule data et vidéo", sub:"Cinq analystes, des capteurs GPS et des rapports que personne ne lit sauf toi.", moneyMod:.06, qualityMod:4, critiqueMod:2, riskMod:-1 },
  { id:'medical', icon:'🩺', label:"Pôle médical de pointe", sub:"Cryothérapie, nutritionniste, sommeil surveillé. Les blessures fondent.", moneyMod:.07, qualityMod:2, riskMod:-5 },
  { id:'terrain', icon:'🌾', label:"Terrains rénovés", sub:"Une pelouse hybride et un centre digne de ce nom. Les joueurs arrêtent de se plaindre.", moneyMod:.08, qualityMod:2, union:3, eco:2 },
  { id:'lowcost', icon:'🚌', label:"Économies partout", sub:"Bus au lieu d'avion, hôtels deux étoiles, séances au stade municipal.", moneyMod:-.06, qualityMod:-3, eco:4, union:-2, appealMod:-.01 },
  { id:'jets', icon:'✈️', label:"Jets privés et palaces", sub:"Le confort absolu pour les joueurs. La planète et le comptable pleurent.", moneyMod:.1, qualityMod:2, appealMod:.03, eco:-6, union:2 },
  { id:'academie', icon:'🎓', label:"Investir dans le centre", sub:"Des éducateurs, des bourses et un suivi scolaire : les jeunes arrivent mieux armés.", moneyMod:.05, qualityMod:1, critiqueMod:2, archive:5, continuity:1 },
  { id:'scouting', icon:'🔭', label:"Réseau de recruteurs", sub:"Des yeux partout, de la Bretagne à l'Amérique du Sud.", moneyMod:.04, qualityMod:2, reseau:2, archive:2 },
  { id:'tournee', icon:'🌏', label:"Tournée commerciale en Asie", sub:"Des matchs amicaux à 35 °C pour vendre des maillots. Le sponsor est ravi.", moneyMod:-.04, qualityMod:-2, appealMod:.05, eco:-4, pressure:3 },
  { id:'neutral', icon:'🏟️', label:"Fonctionnement habituel", sub:"Rien de spécial : le club tourne comme d'habitude.", moneyMod:0, qualityMod:0 },
];

/* ---------- Incidents de saison (équivalent des incidents de tournage) ---------- */
const SEASON_INCIDENTS=[
  { id:'blessure', icon:'🩼', title:"Ton meilleur joueur se blesse", text:"Rupture des croisés à la 12e journée. Six mois d'absence, et le plan de jeu tout entier reposait sur lui.", choices:[
    { label:"Recruter un joker médical en urgence", result:"Un joker arrive, cher et rouillé, mais le système survit.", effects:{money:-.05, quality:1, pressure:3} },
    { label:"Changer de système pour compenser", result:"Le nouveau système surprend tout le monde, y compris tes propres joueurs.", effects:{quality:-2, talent:2, critique:2, pressure:2} },
    { label:"Lancer un jeune du centre", result:"Le gamin fait des débuts prometteurs, la presse adore l'histoire.", effects:{quality:-3, archive:4, critique:3, appeal:.02} } ] },
  { id:'president', icon:'🕴️', title:"Le président veut imposer un joueur", text:"Le fils d'un sponsor doit jouer. Il est lent, il est maladroit, et le président assiste à chaque entraînement.", choices:[
    { label:"Refuser catégoriquement", result:"Le président ne te salue plus, mais le vestiaire te respecte.", effects:{relation:-6, union:4, quality:1, pressure:4} },
    { label:"Le faire jouer dix minutes par match", result:"Un compromis qui n'enthousiasme personne mais ne fâche personne.", effects:{relation:1, quality:-1, critique:-1} },
    { label:"En faire un titulaire", result:"Le président est aux anges. Les résultats, un peu moins.", effects:{relation:5, quality:-4, union:-3, appeal:-.02, money:.03} } ] },
  { id:'ultras', icon:'🔥', title:"Les ultras en colère", text:"Trois défaites de suite et une banderole géante réclame ta tête. Le parcage menace de boycotter.", choices:[
    { label:"Aller discuter avec eux au local", result:"Deux heures de dialogue tendu, une poignée de main à la fin.", effects:{repPublic:4, moral:-2, pressure:-2, appeal:.02} },
    { label:"Les ignorer et travailler", result:"Les banderoles restent, mais l'équipe se resserre.", effects:{quality:2, repPublic:-2, pressure:3} },
    { label:"Les attaquer en conférence de presse", result:"Le stade se retourne contre toi. Le groupe, lui, adore.", effects:{repPublic:-6, union:3, scandal:4, pressure:5, appeal:-.03} } ] },
  { id:'greve', icon:'✊', title:"Menace de grève des joueurs", text:"Les primes de la saison passée n'ont pas été versées. Le capitaine annonce que l'équipe ne s'entraînera pas lundi.", choices:[
    { label:"Soutenir publiquement les joueurs", result:"La direction paie en grognant. Le vestiaire est à toi pour toujours.", effects:{union:8, relation:-5, moral:2, pressure:2} },
    { label:"Négocier discrètement un échéancier", result:"Personne n'est content, mais tout le monde s'entraîne.", effects:{union:2, relation:1, technique:2} },
    { label:"Menacer de sanctions", result:"L'entraînement reprend, l'ambiance est glaciale.", effects:{union:-7, relation:3, quality:-3, scandal:2} } ] },
  { id:'transfert', icon:'💸', title:"Une offre folle pour ton buteur", text:"Un super-club propose trois fois sa valeur à la trêve. Le joueur veut partir, la direction veut l'argent.", choices:[
    { label:"Le vendre et réinvestir", result:"Une plus-value historique, un remplaçant correct.", effects:{money:.18, quality:-3, relation:4, appeal:-.03} },
    { label:"Le retenir jusqu'à la fin de saison", result:"Le joueur boude un mois, puis marque quinze buts.", effects:{quality:3, union:-2, relation:-4, pressure:3} },
    { label:"Le vendre sans rien réinvestir", result:"Le compte en banque est ravi. Les supporters beaucoup moins.", effects:{money:.28, quality:-6, repPublic:-4, appeal:-.05} } ] },
  { id:'scandale', icon:'📰', title:"Un joueur au cœur d'un scandale", text:"Vidéo compromettante, soirée qui a mal tourné : la presse nationale campe devant le centre.", choices:[
    { label:"Le protéger publiquement", result:"Le groupe se serre autour de lui. Les éditorialistes te le reprochent.", effects:{union:5, repCritique:-4, scandal:5, ethics:-3} },
    { label:"Le sanctionner et l'écarter", result:"Une sanction exemplaire, un vestiaire qui te craint un peu.", effects:{ethics:5, union:-3, repCritique:3, quality:-2} },
    { label:"Laisser la direction gérer", result:"Personne ne comprend qui décide. L'affaire traîne des semaines.", effects:{relation:-2, pressure:4, repPublic:-2} } ] },
  { id:'arbitre', icon:'🟥', title:"Arbitrage catastrophique", text:"Un but valable refusé, deux penalties oubliés : ton club est sorti de la Coupe dans un scandale arbitral.", choices:[
    { label:"Attaquer l'arbitre en direct", result:"Quatre matchs de suspension, une amende, et un public en fusion.", effects:{repPublic:5, scandal:5, money:-.02, ethics:-2, pressure:3, appeal:.03} },
    { label:"Rester digne et parler du jeu", result:"La presse salue ton calme. Le public trouve ça mou.", effects:{repCritique:4, repPublic:-2, ethics:3} },
    { label:"Demander la vidéo en interne", result:"Un dossier bien ficelé arrive à la commission. Rien ne change, mais le club a une position.", effects:{technique:1, relation:2, ethics:2} } ] },
  { id:'agent', icon:'🕶️', title:"Un agent te propose un arrangement", text:"Un agent influent te promet trois recrues à prix cassé si tu titularises ses joueurs et si une commission « transite ».", choices:[
    { label:"Refuser et le signaler", result:"L'agent te déclare la guerre. Ta réputation d'intégrité, elle, grimpe.", effects:{ethics:8, reseau:-4, repCritique:3, risk:2} },
    { label:"Accepter les recrues, refuser la commission", result:"Une zone grise inconfortable, mais l'effectif s'améliore.", effects:{quality:3, ethics:-3, reseau:2} },
    { label:"Tout accepter", result:"Trois recrues brillantes et une enveloppe. Il faudra vivre avec.", effects:{quality:5, money:.06, ethics:-12, scandal:8, reseau:3} } ] },
  { id:'jeune', icon:'🌟', title:"Un gamin de 17 ans explose", text:"Un jeune du centre enchaîne les entrées décisives. Les grands clubs appellent déjà son père.", choices:[
    { label:"Le titulariser immédiatement", result:"Il devient la coqueluche du stade, avec quelques trous d'air.", effects:{quality:2, appeal:.04, archive:4, risk:2, continuity:2} },
    { label:"Le protéger, le faire entrer progressivement", result:"Une gestion saluée par les formateurs. Le public s'impatiente.", effects:{archive:6, critique:3, appeal:-.01, quality:0} },
    { label:"Le vendre au plus offrant", result:"Un chèque énorme. Le centre de formation ne te pardonne pas.", effects:{money:.15, archive:-8, repPublic:-3, relation:3} } ] },
  { id:'derby', icon:'🏟️', title:"Le derby de tous les dangers", text:"Le match contre le rival historique tombe en pleine crise. Toute la ville retient son souffle.", choices:[
    { label:"Jouer l'attaque à outrance", result:"Un derby fou, des buts partout, une ville en feu.", effects:{appeal:.06, quality:1, risk:4, pressure:2} },
    { label:"Verrouiller et attendre", result:"Un 0-0 verrouillé. Le rival est frustré, le public un peu aussi.", effects:{critique:1, appeal:-.02, risk:-3, pressure:-1} },
    { label:"Faire jouer les jeunes du cru", result:"Onze enfants de la ville. Quoi qu'il arrive, ils seront aimés.", effects:{repPublic:4, archive:3, quality:-2, continuity:3} } ] },
  { id:'clash', icon:'💥', title:"Clash avec ton adjoint", text:"Ton adjoint historique conteste ouvertement tes choix devant le groupe. Le vestiaire est coupé en deux.", choices:[
    { label:"Le licencier sur-le-champ", result:"Un message clair, un ami perdu.", effects:{relation:-5, union:-2, quality:1, technique:-1, pressure:3} },
    { label:"Crever l'abcès en tête-à-tête", result:"Trois heures de discussion. Il reste, avec des limites claires.", effects:{relation:3, technique:2, union:1, pressure:-1} },
    { label:"Lui confier davantage de responsabilités", result:"Il devient ton bras droit. Certains disent que c'est lui qui entraîne.", effects:{relation:5, technique:1, repCritique:-2, quality:2} } ] },
  { id:'sponsor', icon:'💼', title:"Le sponsor exige des changements", text:"Le nouvel équipementier veut un football « instagrammable », des stars sur les réseaux et un maillot rose.", choices:[
    { label:"Jouer le jeu marketing", result:"Les maillots se vendent, le foot est un peu moins beau.", effects:{money:.08, appeal:.03, critique:-3, continuity:-3} },
    { label:"Défendre le projet sportif", result:"Le sponsor râle mais reste. Les puristes t'adorent.", effects:{critique:3, money:-.03, continuity:3, relation:-2} },
    { label:"Négocier un compromis", result:"Un maillot rose pour les matchs à l'extérieur seulement.", effects:{money:.03, relation:2, appeal:.01} } ] },
  { id:'meteo', icon:'🌧️', title:"Hiver catastrophique", text:"Pelouse gelée, matchs reportés, un calendrier démentiel en avril avec trois matchs par semaine.", choices:[
    { label:"Faire tourner massivement", result:"Les remplaçants découvrent le monde. Quelques matchs se perdent bêtement.", effects:{quality:-2, union:3, risk:-2, archive:2} },
    { label:"Aligner toujours les mêmes", result:"Les titulaires tiennent… jusqu'à la vague de blessures de mai.", effects:{quality:2, risk:5, union:-3, pressure:4} },
    { label:"Investir dans la récupération", result:"Cryo, kinés en renfort, sommeil surveillé. Le corps tient.", effects:{money:-.04, quality:1, risk:-3} } ] },
  { id:'offre', icon:'📞', title:"Un plus gros club t'appelle en pleine saison", text:"Un club d'un niveau supérieur veut te débaucher immédiatement. Ton président l'apprend par la presse.", choices:[
    { label:"Refuser et le dire publiquement", result:"Ton club te vénère. Le gros club retient ton nom.", effects:{repPublic:5, relation:6, reseau:2, union:3, pressure:-2} },
    { label:"Laisser planer le doute", result:"Le doute plane, et le vestiaire aussi.", effects:{reseau:3, union:-3, relation:-4, quality:-2, pressure:3} },
    { label:"Négocier une revalorisation", result:"Ton salaire double. Ton image de mercenaire aussi.", effects:{money:.06, repCritique:-3, relation:-3, reseau:2} } ] },
];

/* ---------- Communication (équivalent de la promotion) ---------- */
const PROMO_OPTIONS=[
  { id:'presse', icon:'🎙️', label:"Charme la presse", sub:"Conférences détendues, off-the-record généreux, journalistes invités au centre.", moneyMod:.02, critique:4, appeal:.01, ethics:-1 },
  { id:'supporters', icon:'📣', label:"Proximité supporters", sub:"Séances ouvertes, bières avec les ultras, maillots offerts aux écoles.", moneyMod:.03, appeal:.05, repPublic:2, eco:-1 },
  { id:'reseaux', icon:'📱', label:"Offensive réseaux sociaux", sub:"Documentaire en coulisses, vidéos virales et memes officiels.", moneyMod:.05, appeal:.06, critique:-2, pressure:2 },
  { id:'silence', icon:'🤐', label:"Silence et travail", sub:"Aucune communication. Les résultats parleront.", moneyMod:0, critique:1, appeal:-.03, pressure:-3 },
  { id:'polemique', icon:'🧨', label:"Polémique calculée", sub:"Une phrase choc par semaine contre les rivaux, l'arbitrage ou la Ligue.", moneyMod:0, appeal:.07, critique:-3, scandal:5, pressure:4 },
  { id:'caritatif', icon:'🤲', label:"Engagement local", sub:"Actions dans les hôpitaux, les prisons et les quartiers. Le club redevient une institution.", moneyMod:.03, appeal:.02, critique:2, ethics:4, eco:1 },
];

/* ---------- Trophées de saison (équivalent festivals et récompenses) ---------- */
const COMPETITIONS={
  champion:{ icon:'🏆', label:"Champion" },
  cup:{ icon:'🥇', label:"Coupe nationale" },
  euro1:{ icon:'⭐', label:"Coupe d'Europe des clubs" },
  euro2:{ icon:'🌍', label:"Coupe Continentale" },
  promo:{ icon:'⬆️', label:"Montée" },
};
const AWARDS=[
  { id:'coach-year', icon:'🎖️', name:"Trophée de l'entraîneur·euse de l'année", minCritique:74, minPos:.2, chance:.55, rep:{repCritique:5, repPublic:4, reseau:2} },
  { id:'banc-or', icon:'🪑', name:"Banc d'or (meilleur coach du continent)", minCritique:82, minPos:.1, chance:.3, intl:true, rep:{repCritique:8, repPublic:5, reseau:4} },
  { id:'sifflet-or', icon:'🥇', name:"Sifflet d'or mondial", minCritique:88, minPos:.06, chance:.2, intl:true, rep:{repCritique:10, repPublic:8, reseau:6} },
  { id:'tactique', icon:'🧠', name:"Prix de la tactique", minCritique:78, minPos:.5, chance:.3, rep:{repCritique:6, talent:2} },
];

/* ---------- Événements de carrière (équivalent des happenings / coups du sort) ---------- */
const CAREER_HAPPENINGS=[
  { id:'fuite', icon:'📄', title:"Ta causerie fuite en ligne", text:"Une vidéo de ton discours d'avant-match, insultes comprises, circule partout.", choices:[
    { label:"Assumer et en rire", result:"La vidéo devient culte. Les joueurs t'adorent encore plus.", effects:{repPublic:5, reseau:2, pressure:4, union:2} },
    { label:"Présenter des excuses publiques", result:"Une sortie sobre, un vestiaire un peu gêné.", effects:{repCritique:2, union:-2, moral:-3} },
    { label:"Chercher la taupe", result:"Trois semaines d'enquête interne, une ambiance de plomb.", effects:{relation:-3, union:-4, scandal:3, pressure:8} } ] },
  { id:'selection', icon:'🇫🇷', title:"La fédération te sonde", text:"Le poste de sélectionneur des espoirs se libère. Une porte vers une autre carrière.", choices:[
    { label:"Décliner poliment", result:"On te rappellera. Peut-être.", effects:{repCritique:1, moral:1} },
    { label:"Accepter un rôle de conseiller", result:"Quelques stages, beaucoup de réseau, un peu de fatigue.", effects:{reseau:6, technique:2, pressure:4} },
    { label:"Faire campagne pour le poste principal", result:"Tu n'es pas retenu·e, mais tout le monde connaît désormais ton nom.", effects:{repPublic:3, reseau:3, moral:-3, pressure:3} } ] },
  { id:'livre', icon:'📚', title:"Un éditeur veut ton livre", text:"« Ma méthode » : trois cents pages sur ta vision du football, avec ghostwriter.", choices:[
    { label:"Écrire un livre sincère", result:"Un succès d'estime, des passages qui vexent d'anciens présidents.", effects:{repCritique:5, relation:-3, money:.04, talent:1} },
    { label:"Publier un livre de motivation", result:"Vendu en tête de gondole, moqué par les puristes.", effects:{repPublic:4, repCritique:-3, money:.09} },
    { label:"Refuser", result:"Tu gardes tes secrets.", effects:{moral:2} } ] },
  { id:'burnout', icon:'🛌', title:"Le corps dit stop", text:"Malaise au bord du terrain, hospitalisation et un médecin qui exige du repos.", choices:[
    { label:"Prendre deux mois de recul", result:"Ton adjoint assure. Tu reviens avec des idées.", effects:{moral:8, pressure:-18, technique:-1, relation:2} },
    { label:"Revenir après une semaine", result:"Le public applaudit ton courage. Le médecin soupire.", effects:{pressure:6, moral:-4, repPublic:3} },
    { label:"Changer complètement d'hygiène de vie", result:"Sport, sommeil, moins de café. Une nouvelle personne.", effects:{moral:10, pressure:-10, talent:1} } ] },
  { id:'docu', icon:'🎥', title:"Une plateforme veut filmer ta saison", text:"Caméras dans le vestiaire, micros sur les bancs, tout le monde suivra ta saison.", choices:[
    { label:"Accepter le documentaire", result:"Ta notoriété explose, quelques joueurs jouent pour la caméra.", effects:{repPublic:8, money:.06, union:-2, pressure:5, ethics:-1} },
    { label:"Refuser pour protéger le groupe", result:"Le vestiaire apprécie. Les sponsors moins.", effects:{union:4, relation:-2, repCritique:2} },
    { label:"Accepter sans le vestiaire", result:"Un compromis élégant : ton bureau, pas le groupe.", effects:{repPublic:4, money:.03, technique:1} } ] },
  { id:'mentor', icon:'🧓', title:"Ton mentor t'appelle", text:"L'entraîneur qui t'a formé traverse une mauvaise passe et cherche un adjoint pour six mois.", choices:[
    { label:"Prendre une pause pour l'aider", result:"Une saison à ses côtés, une leçon d'humilité.", effects:{talent:5, technique:2, reseau:3, money:-.03, pressure:-5} },
    { label:"Lui envoyer ton adjoint", result:"Ton adjoint part et revient plus fort.", effects:{technique:2, relation:2} },
    { label:"Décliner", result:"Il comprend. Vous ne parlerez plus jamais de la même façon.", effects:{moral:-3, reseau:-2} } ] },
  { id:'diplome', icon:'🎓', title:"Formation continue", text:"Un stage d'élite réunit les meilleurs techniciens du monde pendant un mois.", choices:[
    { label:"Y aller à tout prix", result:"Un mois intense, des idées neuves et un carnet d'adresses doré.", effects:{talent:4, technique:3, reseau:4, money:-.05} },
    { label:"Suivre les cours en ligne", result:"Moins immersif, mais efficace.", effects:{talent:2, technique:2} },
    { label:"Rester au club", result:"Tu préfères le terrain.", effects:{moral:2, union:1} } ] },
  { id:'rival', icon:'😤', title:"Un entraîneur rival te provoque", text:"En conférence de presse, un coach célèbre qualifie ton football de « ennuyeux à mourir ».", choices:[
    { label:"Répondre avec humour", result:"La punchline fait le tour des réseaux.", effects:{repPublic:5, moral:2, reseau:1} },
    { label:"Ne rien dire", result:"Le silence est classe, un peu frustrant.", effects:{repCritique:2, moral:-1} },
    { label:"Déclencher une guerre médiatique", result:"Six mois de piques et deux amendes.", effects:{repPublic:3, scandal:5, pressure:6, money:-.02} } ] },
  { id:'famille', icon:'👨‍👩‍👧', title:"La famille craque", text:"Quatre déménagements en cinq ans. Ta famille veut poser les valises.", choices:[
    { label:"Promettre de rester dans la région", result:"Tu refuseras certains projets lointains. Le foyer respire.", effects:{moral:8, reseau:-3, pressure:-6} },
    { label:"Négocier une saison de plus", result:"Un compromis fragile.", effects:{moral:-2, pressure:3} },
    { label:"Le football d'abord", result:"Tu le regretteras peut-être.", effects:{moral:-8, technique:2, pressure:4, scandal:2} } ] },
  { id:'ancien', icon:'🎁', title:"Un ancien joueur te remercie", text:"Un international que tu as lancé il y a dix ans te dédie son trophée.", choices:[
    { label:"L'inviter au centre pour parler aux jeunes", result:"Une journée magique pour le centre de formation.", effects:{archive:5, repPublic:3, moral:4} },
    { label:"Le remercier discrètement", result:"Un message privé, une amitié préservée.", effects:{moral:3, reseau:2} },
    { label:"Le recruter comme adjoint", result:"Il rejoint ton staff avec fougue et sans diplôme.", effects:{technique:2, relation:3, union:3, talent:-1} } ] },
  { id:'ville', icon:'🏙️', title:"La ville te propose une statue", text:"Le maire veut inaugurer une place à ton nom. Des opposants trouvent ça ridicule.", choices:[
    { label:"Accepter avec émotion", result:"Une cérémonie, des larmes et un banc à ton nom.", effects:{repPublic:5, moral:5, pressure:2} },
    { label:"Proposer un terrain pour les jeunes à la place", result:"Un geste salué par tout le monde.", effects:{repCritique:4, archive:4, repPublic:2, ethics:2} },
    { label:"Refuser tout honneur", result:"Modestie exemplaire.", effects:{repCritique:2, ethics:2} } ] },
  { id:'paris', icon:'🎰', title:"Soupçons de paris", text:"Un joueur de ton effectif est cité dans une enquête sur les paris sportifs.", choices:[
    { label:"Collaborer totalement avec l'enquête", result:"Le club est blanchi, le joueur suspendu.", effects:{ethics:6, quality:-2, repCritique:3} },
    { label:"Protéger le club avant tout", result:"Des avocats, des silences, une image abîmée.", effects:{ethics:-6, scandal:6, relation:3} },
    { label:"Laisser la justice faire", result:"Neutralité prudente.", effects:{pressure:3} } ] },
];

const CAREER_ROULETTE_EVENTS=[
  { id:'emir', icon:'👑', title:"L'offre de l'émir", text:"Un propriétaire richissime te propose de diriger un projet inédit, à condition de signer sans lire le contrat. Quatre versions du contrat sont posées devant toi.", choices:["Contrat A","Contrat B","Contrat C","Contrat D"], endText:"Le contrat contenait une clause d'exclusivité à vie. Ta carrière libre s'arrête ici.", jackpotText:"Le contrat était en or massif : budgets illimités, pouvoir total, respect immédiat." },
  { id:'voyant', icon:'🔮', title:"Le voyant du parcage", text:"Un vieux supporter prétend lire l'avenir dans les compositions d'équipe. Il te tend quatre feuilles pliées.", choices:["Feuille du vent","Feuille de terre","Feuille de feu","Feuille d'eau"], endText:"La feuille annonçait une chute brutale. Elle avait raison : un accident sur la route du stade met fin à tout.", jackpotText:"La feuille annonçait une année de grâce. Tout ce que tu touches se transforme en victoire." },
  { id:'heritage', icon:'🗝️', title:"L'héritage du fondateur", text:"Dans les archives du club, quatre coffres portent les noms d'anciens entraîneurs légendaires. Un seul peut être ouvert.", choices:["Coffre du bâtisseur","Coffre du stratège","Coffre du rebelle","Coffre du gagnant"], endText:"Le coffre contenait des documents compromettants sur les dirigeants actuels. Le lendemain, ta carrière est terminée.", jackpotText:"Le coffre contenait les notes tactiques d'un génie et un réseau d'anciens joueurs prêts à t'aider." },
  { id:'tirage', icon:'🎟️', title:"Le tirage au sort truqué", text:"Un intermédiaire te propose de choisir toi-même l'adversaire du prochain tour de Coupe. Quatre boules, un choix.", choices:["Boule 1","Boule 2","Boule 3","Boule 4"], endText:"La combine est révélée. Radiation à vie de tout banc de touche.", jackpotText:"Le tirage tombe parfaitement et personne ne saura jamais rien. La saison devient triomphale." },
];

/* Dilemmes structurels : chaque jauge possède ses situations (équivalent des BASE_CAREER_ISSUES) */
const BASE_CAREER_ISSUES=[
  { id:'ethics-arbitre', system:'ethics', icon:'⚖️', title:"Le cadeau de l'arbitre", text:"Un dirigeant propose d'offrir un séjour de luxe à l'arbitre du prochain match décisif.", choices:[
    { label:"Refuser et prévenir la Ligue", effects:{ethics:8, relation:-4, repCritique:2} },
    { label:"Fermer les yeux", effects:{ethics:-6, scandal:4, quality:1} },
    { label:"Faire semblant de ne pas comprendre", effects:{ethics:-1, relation:1} } ] },
  { id:'ethics-dopage', system:'ethics', icon:'💊', title:"Le préparateur miracle", text:"Un nouveau préparateur promet des joueurs infatigables grâce à des « compléments » non homologués.", choices:[
    { label:"Le renvoyer immédiatement", effects:{ethics:7, quality:-1, union:1} },
    { label:"Demander une analyse indépendante", effects:{ethics:2, technique:2, money:-.02} },
    { label:"Tester sur quelques joueurs", effects:{ethics:-10, quality:4, scandal:8, risk:5} } ] },
  { id:'eco-avion', system:'eco', icon:'✈️', title:"Le vol de 45 minutes", text:"Le club prend l'avion pour un déplacement de 300 km. Une association dénonce publiquement le club.", choices:[
    { label:"Passer au train pour tous les déplacements courts", effects:{eco:8, union:-2, money:.01, repCritique:2} },
    { label:"Compenser carbone et communiquer", effects:{eco:3, money:-.02, repPublic:1} },
    { label:"Ignorer la polémique", effects:{eco:-4, repCritique:-2, pressure:2} } ] },
  { id:'eco-stade', system:'eco', icon:'🌞', title:"Le toit solaire", text:"La mairie propose de financer des panneaux solaires sur le stade si le club s'engage sur un plan de sobriété.", choices:[
    { label:"S'engager pleinement", effects:{eco:10, money:-.02, repPublic:2, relation:2} },
    { label:"Accepter les panneaux sans le plan", effects:{eco:4, relation:-2} },
    { label:"Refuser, le stade est un stade", effects:{eco:-3, repCritique:-1} } ] },
  { id:'union-primes', system:'union', icon:'💶', title:"La grille des primes", text:"Les cadres veulent des primes individuelles, les jeunes une prime collective.", choices:[
    { label:"Prime collective pour tous", effects:{union:7, quality:1, relation:-2, money:-.02} },
    { label:"Primes individuelles", effects:{union:-4, quality:2, appeal:.01} },
    { label:"Laisser la direction trancher", effects:{union:-1, relation:2} } ] },
  { id:'union-remplacant', system:'union', icon:'🪑', title:"La révolte des remplaçants", text:"Cinq joueurs qui ne jouent jamais demandent une réunion collective.", choices:[
    { label:"Les recevoir et leur promettre du temps de jeu", effects:{union:6, quality:-1, archive:2} },
    { label:"Leur proposer des prêts", effects:{union:1, money:.02, relation:1} },
    { label:"Refuser toute réunion", effects:{union:-6, pressure:3, quality:1} } ] },
  { id:'relation-president', system:'relation', icon:'🍽️', title:"Le dîner du président", text:"Le président t'invite à dîner pour parler « stratégie ». Il veut surtout choisir l'équipe.", choices:[
    { label:"Écouter et expliquer patiemment", effects:{relation:6, technique:1, pressure:1} },
    { label:"Poser une limite claire", effects:{relation:-2, union:2, repCritique:1} },
    { label:"Annuler le dîner", effects:{relation:-6, pressure:2} } ] },
  { id:'relation-staff', system:'relation', icon:'🧑‍🤝‍🧑', title:"Le staff épuisé", text:"Ton préparateur physique et ton analyste enchaînent les nuits blanches et menacent de partir.", choices:[
    { label:"Recruter du renfort", effects:{relation:5, money:-.03, technique:1} },
    { label:"Leur offrir une semaine de repos", effects:{relation:4, quality:-1, pressure:-2} },
    { label:"Leur demander un dernier effort", effects:{relation:-5, pressure:3} } ] },
  { id:'continuity-systeme', system:'continuity', icon:'📘', title:"La bible du club", text:"Le directeur sportif propose d'écrire un projet de jeu commun des U8 à l'équipe première.", choices:[
    { label:"Rédiger la bible avec les formateurs", effects:{continuity:8, archive:3, technique:1, money:-.01} },
    { label:"Signer un document minimal", effects:{continuity:2} },
    { label:"Refuser toute contrainte", effects:{continuity:-4, talent:1} } ] },
  { id:'continuity-mercato', system:'continuity', icon:'🔁', title:"Le mercato panique", text:"Après deux défaites, la direction veut acheter six joueurs qui n'ont rien à voir avec ton système.", choices:[
    { label:"Défendre la cohérence du projet", effects:{continuity:6, relation:-3, quality:1} },
    { label:"Accepter deux recrues sur six", effects:{continuity:-1, relation:2, quality:1} },
    { label:"Laisser faire", effects:{continuity:-7, relation:3, quality:-2} } ] },
  { id:'archive-centre', system:'archive', icon:'🏫', title:"Le centre menacé", text:"La direction veut fermer une partie du centre de formation pour financer un transfert.", choices:[
    { label:"S'y opposer publiquement", effects:{archive:8, relation:-5, repCritique:3} },
    { label:"Proposer des économies ailleurs", effects:{archive:3, technique:2, money:-.01} },
    { label:"Accepter", effects:{archive:-9, quality:2, money:.03} } ] },
  { id:'archive-scout', system:'archive', icon:'🔍', title:"L'œil du recruteur", text:"Un vieux recruteur propose de te suivre partout pour un salaire symbolique et un peu de reconnaissance.", choices:[
    { label:"L'embaucher et l'écouter", effects:{archive:6, reseau:3, money:-.01} },
    { label:"Le consulter ponctuellement", effects:{archive:2, reseau:1} },
    { label:"Décliner", effects:{archive:-1} } ] },
];

/* Plans de redressement (équivalent des SYSTEM_RECOVERY_EVENTS) */
const SYSTEM_RECOVERY_EVENTS=[
  { id:'rec-ethics', system:'ethics', icon:'⚖️', title:"Charte d'intégrité", text:"Une fédération de supporters propose une charte publique : transparence des commissions, agents agréés, tolérance zéro.", choices:[
    { label:"Signer et appliquer", effects:{ethics:14, reseau:-2, repCritique:3}, failChance:.1, fail:{ethics:-3} },
    { label:"Signer sans rien changer", effects:{ethics:4, scandal:3}, failChance:.35, fail:{ethics:-5, scandal:4} },
    { label:"Refuser", effects:{ethics:-2} } ] },
  { id:'rec-eco', system:'eco', icon:'🌱', title:"Plan sobriété", text:"Un cabinet propose un plan complet : trajets en train, pelouse sans pesticides, énergie renouvelable au centre.", choices:[
    { label:"Plan complet", effects:{eco:18, money:-.04, union:-1}, failChance:.15, fail:{eco:2, money:-.04} },
    { label:"Plan partiel", effects:{eco:9, money:-.02}, failChance:.1, fail:{eco:2} },
    { label:"Simple communication", effects:{eco:2, repCritique:-1}, failChance:.4, fail:{eco:-4, repCritique:-3} } ] },
  { id:'rec-union', system:'union', icon:'✊', title:"Accord de vestiaire", text:"Le capitaine propose une charte de groupe : rotation transparente, primes partagées, réunions hebdomadaires.", choices:[
    { label:"Adopter la charte", effects:{union:15, quality:1, relation:-1}, failChance:.1, fail:{union:3} },
    { label:"Version allégée", effects:{union:7}, failChance:.15, fail:{union:1} },
    { label:"Refuser", effects:{union:-3, pressure:2} } ] },
  { id:'rec-relation', system:'relation', icon:'❤️', title:"Séminaire du club", text:"Trois jours au vert avec le président, le directeur sportif et le staff pour tout mettre à plat.", choices:[
    { label:"Y aller et tout dire", effects:{relation:14, moral:3, pressure:-3}, failChance:.15, fail:{relation:-4, pressure:4} },
    { label:"Y aller poliment", effects:{relation:6}, failChance:.1, fail:{relation:1} },
    { label:"Envoyer l'adjoint", effects:{relation:-3, technique:1} } ] },
  { id:'rec-continuity', system:'continuity', icon:'🌌', title:"Projet de jeu unifié", text:"Une saison entière pour aligner toutes les équipes du club sur les mêmes principes.", choices:[
    { label:"Lancer le chantier", effects:{continuity:16, archive:4, quality:-1, money:-.02}, failChance:.12, fail:{continuity:4, money:-.02} },
    { label:"Un séminaire de formateurs", effects:{continuity:7, archive:2}, failChance:.1, fail:{continuity:2} },
    { label:"Plus tard", effects:{continuity:-2} } ] },
  { id:'rec-archive', system:'archive', icon:'🎓', title:"Refondation du centre", text:"Un plan de dix ans pour le centre de formation : nouveaux terrains, internat, éducateurs diplômés.", choices:[
    { label:"Plan complet", effects:{archive:18, money:-.05, repCritique:3}, failChance:.12, fail:{archive:5, money:-.05} },
    { label:"Plan modeste", effects:{archive:8, money:-.02}, failChance:.1, fail:{archive:2} },
    { label:"Rien pour l'instant", effects:{archive:-2} } ] },
];

/* Crise de pression à 100 */
const PRESSURE_CRISIS_CHOICES=[
  { id:'pause', icon:'🏖️', label:"Arrêter trois ans", sub:"Tu quittes tout. Trois saisons blanches, une pression qui retombe, un réseau qui s'érode.", years:3, effects:{pressure:-70, moral:15, reseau:-8, repPublic:-6, technique:-2} },
  { id:'delegate', icon:'🪑', label:"Déléguer la prochaine saison", sub:"Ton adjoint mène la saison suivante avec ton nom sur la porte. Moins de pression, moins de contrôle.", years:0, effects:{pressure:-35, moral:5}, delegate:true },
  { id:'push', icon:'💀', label:"Continuer coûte que coûte", sub:"Le corps tiendra. Peut-être. 50 % de risque de mort immédiate.", years:0, deathChance:.5, effects:{pressure:-12, moral:-15, technique:-5, scandalRisk:8} },
];

/* Amende écologique */
const ECO_FINE_TEXTS=[
  "La Ligue des défenseurs de la planète épingle les déplacements en jet de ton club.",
  "Une enquête révèle que le centre d'entraînement arrose ses pelouses avec de l'eau potable en pleine sécheresse.",
  "Des activistes bloquent l'entrée du stade : le club est cité parmi les plus polluants du championnat.",
];
