/* ============================== ABSOLUT COACH — PROFIL (styles de jeu, nationalités) ============================== */
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
const NATIONALITIES=[
  { id:'fr', name:"Française", desc:"École de la formation et du jeu structuré.", favoredStyleIds:['formation','positionnel'], bonus:{talent:4, reputation:2} },
  { id:'es', name:"Espagnole", desc:"Culture de la possession et du jeu de position.", favoredStyleIds:['possession','positionnel'], bonus:{talent:5, reputation:1} },
  { id:'de', name:"Allemande", desc:"Gegenpressing, intensité et rigueur analytique.", favoredStyleIds:['pressing','verticalite'], bonus:{technique:4, talent:1} },
  { id:'it', name:"Italienne", desc:"Science défensive et art du résultat.", favoredStyleIds:['catenaccio','blocbas'], bonus:{technique:3, reputation:2} },
  { id:'nl', name:"Néerlandaise", desc:"Héritière du football total et des académies.", favoredStyleIds:['total','formation'], bonus:{talent:4, reputation:1} },
  { id:'en', name:"Anglaise", desc:"Intensité, duels et ferveur des tribunes.", favoredStyleIds:['direct','physique'], bonus:{reputation:3, reseau:2} },
  { id:'pt', name:"Portugaise", desc:"Génération de tacticien·nes formé·es sur les bancs d'école.", favoredStyleIds:['contre','possession'], bonus:{technique:3, talent:2} },
  { id:'ar', name:"Argentine", desc:"Grinta, folie et amour du dribble.", favoredStyleIds:['rock','fantaisie'], bonus:{talent:3, reputation:2} },
  { id:'br', name:"Brésilienne", desc:"Le joga bonito comme religion.", favoredStyleIds:['fantaisie','ailes'], bonus:{reputation:4, talent:1} },
  { id:'be', name:"Belge", desc:"Une génération dorée et un goût pour les projets modestes.", favoredStyleIds:['formation','contre'], bonus:{talent:3, reseau:1} },
  { id:'sn', name:"Sénégalaise", desc:"Puissance, discipline et lien fort avec les joueurs.", favoredStyleIds:['physique','pressing'], bonus:{talent:3, moral:3} },
  { id:'ma', name:"Marocaine", desc:"Organisation collective et fierté d'un football en pleine ascension.", favoredStyleIds:['blocbas','contre'], bonus:{technique:3, moral:2} },
  { id:'hr', name:"Croate", desc:"Une petite nation qui produit de grands milieux et de grands tacticiens.", favoredStyleIds:['possession','verticalite'], bonus:{talent:3, technique:1} },
  { id:'jp', name:"Japonaise", desc:"Discipline, technique et respect du plan de jeu.", favoredStyleIds:['positionnel','ailes'], bonus:{technique:4} },
  { id:'us', name:"Américaine", desc:"Formée à la data, au marketing et à l'optimisation.", favoredStyleIds:['direct','pressing'], bonus:{reseau:4, technique:2} },
  { id:'no', name:"Norvégienne", desc:"Pragmatisme scandinave et confiance dans les jeunes.", favoredStyleIds:['direct','formation'], bonus:{technique:3, moral:2} },
];

/* ---------- Nationalités des joueurs ----------
   Le quota d'étrangers sanctionne le recrutement : encore faut-il pouvoir
   reconnaître un étranger. Chaque joueur porte un code pays dans `p.nat`. */
const NAT_INFO={
  FR:['🇫🇷',"France"], ES:['🇪🇸',"Espagne"], IT:['🇮🇹',"Italie"], DE:['🇩🇪',"Allemagne"], NL:['🇳🇱',"Pays-Bas"],
  PT:['🇵🇹',"Portugal"], BE:['🇧🇪',"Belgique"], EN:['🏴󠁧󠁢󠁥󠁮󠁧󠁿',"Angleterre"], SC:['🏴󠁧󠁢󠁳󠁣󠁴󠁿',"Écosse"], WA:['🏴󠁧󠁢󠁷󠁬󠁳󠁿',"Pays de Galles"],
  NI:['🇬🇧',"Irlande du Nord"], IE:['🇮🇪',"Irlande"], DK:['🇩🇰',"Danemark"], SE:['🇸🇪',"Suède"], NO:['🇳🇴',"Norvège"],
  PL:['🇵🇱',"Pologne"], CZ:['🇨🇿',"Tchéquie"], HU:['🇭🇺',"Hongrie"], RO:['🇷🇴',"Roumanie"], BG:['🇧🇬',"Bulgarie"],
  RS:['🇷🇸',"Serbie"], HR:['🇭🇷',"Croatie"], YU:['🏳️',"Yougoslavie"], RU:['🇷🇺',"Russie"], UA:['🇺🇦',"Ukraine"], GE:['🇬🇪',"Géorgie"],
  BR:['🇧🇷',"Brésil"], AR:['🇦🇷',"Argentine"], UY:['🇺🇾',"Uruguay"], CL:['🇨🇱',"Chili"], CO:['🇨🇴',"Colombie"], MX:['🇲🇽',"Mexique"],
  CA:['🇨🇦',"Canada"], US:['🇺🇸',"États-Unis"],
  MA:['🇲🇦',"Maroc"], DZ:['🇩🇿',"Algérie"], EG:['🇪🇬',"Égypte"], SN:['🇸🇳',"Sénégal"], CI:['🇨🇮',"Côte d'Ivoire"],
  CM:['🇨🇲',"Cameroun"], GH:['🇬🇭',"Ghana"], NG:['🇳🇬',"Nigeria"], ML:['🇲🇱',"Mali"], GA:['🇬🇦',"Gabon"], LR:['🇱🇷',"Liberia"],
  AF:['🌍',"Afrique"], SA:['🇸🇦',"Arabie saoudite"], QA:['🇶🇦',"Qatar"], CN:['🇨🇳',"Chine"], JP:['🇯🇵',"Japon"],
  KR:['🇰🇷',"Corée du Sud"], AU:['🇦🇺',"Australie"],
};
function natFlag(code){ const n=NAT_INFO[code]; return n?n[0]:'🏳️'; }
function natName(code){ const n=NAT_INFO[code]; return n?n[1]:(code||'?'); }

/* ---------- Les profils de jeu ----------
   Demande du propriétaire (23/09/2026) : « plutôt que d'avoir des joueurs qui
   ont des personnalités de fêtard ou d'égo, avoir des joueurs liés à un style
   de jeu qui s'assoit bien ou moins bien au mien ». Un joueur n'a plus un
   caractère, il a une manière de jouer : elle épouse certains styles et en
   contrarie d'autres. Les mécaniques que portaient les anciens traits
   (capitanat, cartons, blessures, récupération, progression, popularité) sont
   reprises ici, mais elles découlent maintenant du football et non de l'humeur. */
const PROFILS=[
  { id:'metronome', icon:'🎼', label:"Métronome", desc:"Il touche tous les ballons, ne perd jamais la tête, et le jeu passe par lui.",
    loves:['possession','positionnel','total'], hates:['direct','blocbas'], lead:.8 },
  { id:'poumon', icon:'🫁', label:"Poumon", desc:"Il court pour deux et recommence la semaine suivante.",
    loves:['pressing','physique','rock'], hates:['possession','catenaccio'], dev:.02, recovery:1 },
  { id:'fleche', icon:'⚡', label:"Flèche", desc:"Trois appuis et il est parti. Tout ce qu'il demande, c'est de l'espace.",
    loves:['contre','verticalite','direct'], hates:['possession','positionnel'], injury:1.4 },
  { id:'roc', icon:'🧱', label:"Roc", desc:"Il gagne ses duels, il l'a toujours fait, et il aime qu'on défende bas.",
    loves:['blocbas','catenaccio','physique'], hates:['total','fantaisie'], lead:.5, aggr:1.35 },
  { id:'dribbleur', icon:'🎩', label:"Dribbleur", desc:"Il prend le ballon, il prend son vis-à-vis, et parfois il prend trop de temps.",
    loves:['fantaisie','ailes','rock'], hates:['blocbas','physique'], fans:3, aggr:.7 },
  { id:'polyvalent', icon:'🧰', label:"Couteau suisse", desc:"Trois postes, aucune plainte. Il comprend vite ce qu'on lui demande.",
    loves:['total','formation','positionnel'], hates:['direct'], dev:.015, lead:.3 },
  { id:'renard', icon:'🦊', label:"Renard des surfaces", desc:"Il ne touche que six ballons et en met deux au fond.",
    loves:['ailes','direct','contre'], hates:['possession','positionnel'], fans:2 },
  { id:'tour', icon:'🗼', label:"Tour de contrôle", desc:"Il règne dans les airs, sur les corners comme sur les longs ballons.",
    loves:['direct','physique','blocbas'], hates:['possession','fantaisie'], aggr:1.2, lead:.4 },
  { id:'cerveau', icon:'🧠', label:"Cerveau", desc:"Il voit la passe deux secondes avant les autres. Défendre l'ennuie.",
    loves:['fantaisie','possession','verticalite'], hates:['physique','blocbas'], lead:.6, fans:2 },
  { id:'soldat', icon:'⚙️', label:"Soldat", desc:"Il fait le travail, dans n'importe quel système, sans qu'on le remarque.",
    loves:[], hates:[], recovery:1 },
];
function profilById(id){ return PROFILS.find(p=>p.id===id)||PROFILS[PROFILS.length-1]; }
/* Les anciennes sauvegardes portent un trait de caractère : on le traduit. */
const TRAIT_TO_PROFIL={leader:'metronome',pro:'polyvalent',ego:'dribbleur',fetard:'dribbleur',fragile:'fleche',
  loyal:'soldat',mercenaire:'renard',showman:'dribbleur',travailleur:'poumon',discret:'soldat'};
function playerProfil(p){ return profilById(p&&(p.profil||TRAIT_TO_PROFIL[p&&p.trait])); }
/* +1 si le style lui va, −1 s'il le contrarie, 0 sinon. */
function styleFit(p,styleId){
  const pr=playerProfil(p); if(!styleId) return 0;
  return pr.loves.includes(styleId)?1:pr.hates.includes(styleId)?-1:0;
}
function fitWord(f){ return f>0?"à l'aise":f<0?"contrarié":"indifférent"; }
