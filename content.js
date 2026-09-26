/* ============================== ABSOLUT COACH — CONTENU NARRATIF ==============================
   Incidents de phase, coups du sort d'intersaison, dilemmes par jauge, roulettes, arnaques.
   Effets entraîneur·euse : talent (tactique), technique (management), reseau, reputation, pressure,
   confidence (président), vestiaire, supporters, formation, staff, budget (fraction du budget transferts),
   injure (semaines d'absence du meilleur joueur), form (forme de l'équipe).
   Effets joueur·euse : technique, physique, mental, reputation, coachTrust, pressure, forme, corps,
   vestiaire, supporters, entourage, money, injure, minutes.
   Filtres optionnels : eras:[...ids], minYear, maxYear, tiers:[...], gauge:'vestiaire' (déclenché quand la jauge est basse). */

const COACH_INCIDENTS=[
 {id:'c-blessure',icon:'🩼',title:"Ton meilleur joueur se blesse",text:"Rupture des croisés à l'entraînement. Le staff médical parle de six mois. Tout le plan de jeu reposait sur lui.",choices:[
  {label:"Recruter un joker en urgence",result:"Un remplaçant rouillé arrive, cher et vexé d'être un plan B.",effects:{budget:-.12,injure:24,form:-1,pressure:3}},
  {label:"Changer de système pour compenser",result:"Le nouveau système surprend tout le monde, y compris tes joueurs.",effects:{injure:24,talent:2,form:-3,pressure:2}},
  {label:"Lancer un jeune du centre",result:"Le gamin fait des débuts prometteurs, la presse adore l'histoire.",effects:{injure:24,formation:4,reputation:2,form:-2}}]},
 {id:'c-president-joueur',icon:'🕴️',title:"Le président veut imposer un joueur",text:"Le fils d'un sponsor doit jouer. Il est lent, il est maladroit, et le président assiste à chaque entraînement.",choices:[
  {label:"Refuser catégoriquement",result:"Le président ne te salue plus, mais le vestiaire te respecte.",effects:{confidence:-8,vestiaire:5,pressure:4}},
  {label:"Le faire jouer dix minutes par match",result:"Un compromis qui n'enthousiasme personne mais ne fâche personne.",effects:{confidence:2,form:-1}},
  {label:"En faire un titulaire",result:"Le président est aux anges. Les résultats, un peu moins.",effects:{confidence:8,form:-4,vestiaire:-4,supporters:-3}}]},
 {id:'c-ultras',icon:'🔥',title:"Les ultras réclament ta tête",text:"Trois défaites de suite et une banderole géante à ton nom. Le parcage menace de boycotter.",gauge:'supporters',choices:[
  {label:"Aller discuter au local des ultras",result:"Deux heures de dialogue tendu, une poignée de main à la fin.",effects:{supporters:8,pressure:-2,reputation:1}},
  {label:"Ignorer et travailler",result:"Les banderoles restent, mais l'équipe se resserre.",effects:{form:2,supporters:-3,pressure:3}},
  {label:"Les attaquer en conférence de presse",result:"Le stade se retourne contre toi. Le groupe, lui, adore.",effects:{supporters:-10,vestiaire:4,pressure:5,reputation:-2}}]},
 {id:'c-greve',icon:'✊',title:"Menace de grève des joueurs",text:"Les primes n'ont pas été versées. Le capitaine annonce que l'équipe ne s'entraînera pas lundi.",gauge:'vestiaire',choices:[
  {label:"Soutenir publiquement les joueurs",result:"La direction paie en grognant. Le vestiaire est à toi pour toujours.",effects:{vestiaire:10,confidence:-6,pressure:2}},
  {label:"Négocier un échéancier discret",result:"Personne n'est content, mais tout le monde s'entraîne.",effects:{vestiaire:2,confidence:1,technique:2}},
  {label:"Menacer de sanctions",result:"L'entraînement reprend, l'ambiance est glaciale.",effects:{vestiaire:-8,confidence:3,form:-3}}]},
 {id:'c-offre-buteur',icon:'💸',title:"Une offre folle pour ton buteur",text:"Un super-club propose trois fois sa valeur à la trêve. Le joueur veut partir, la direction veut l'argent.",minYear:1996,choices:[
  {label:"Le vendre et réinvestir",result:"Une plus-value historique, un remplaçant correct.",effects:{sellStar:1.5,confidence:5,supporters:-4,form:-2}},
  {label:"Le retenir jusqu'à la fin de saison",result:"Le joueur boude un mois, puis marque quinze buts.",effects:{form:2,vestiaire:-3,confidence:-4,pressure:3}},
  {label:"Le vendre sans rien réinvestir",result:"Le compte en banque est ravi. Les supporters beaucoup moins.",effects:{sellStar:1.5,noReinvest:true,confidence:8,supporters:-8,form:-5}}]},
 {id:'c-scandale',icon:'📰',title:"Un joueur au cœur d'un scandale",text:"Soirée qui a mal tourné, photos, plainte : la presse nationale campe devant le centre.",choices:[
  {label:"Le protéger publiquement",result:"Le groupe se serre autour de lui. Les éditorialistes te le reprochent.",effects:{vestiaire:5,reputation:-4,pressure:3}},
  {label:"Le sanctionner et l'écarter",result:"Une sanction exemplaire, un vestiaire qui te craint un peu.",effects:{vestiaire:-3,reputation:3,form:-2,confidence:2}},
  {label:"Laisser la direction gérer",result:"Personne ne comprend qui décide. L'affaire traîne des semaines.",effects:{confidence:-3,pressure:4,supporters:-2}}]},
 {id:'c-arbitre',icon:'🟥',title:"Arbitrage catastrophique",text:"Un but valable refusé, deux penalties oubliés : ton club est éliminé de la Coupe dans un scandale arbitral.",choices:[
  {label:"Attaquer l'arbitre en direct",result:"Quatre matchs de suspension, une amende, et un public en fusion.",effects:{supporters:6,reputation:-3,pressure:3,confidence:-2}},
  {label:"Rester digne et parler du jeu",result:"La presse salue ton calme. Le public trouve ça mou.",effects:{reputation:4,supporters:-2}},
  {label:"Monter un dossier vidéo pour la commission",result:"Rien ne change, mais le club a une position.",effects:{technique:1,confidence:2}}]},
 {id:'c-agent',icon:'🕶️',title:"Un agent te propose un arrangement",text:"Un agent influent te promet trois recrues à prix cassé si tu titularises ses joueurs et si une commission « transite ».",minYear:1990,choices:[
  {label:"Refuser et le signaler",result:"L'agent te déclare la guerre. Ta réputation d'intégrité grimpe.",effects:{reseau:-4,reputation:3}},
  {label:"Accepter les recrues, refuser la commission",result:"Une zone grise inconfortable, mais l'effectif s'améliore.",effects:{budget:.1,reseau:2,reputation:-1}},
  {label:"Tout accepter",result:"Trois recrues brillantes et une enveloppe. Il faudra vivre avec.",effects:{budget:.2,form:2,reseau:3,reputation:-8,pressure:4}}]},
 {id:'c-jeune',icon:'🌟',title:"Un gamin de 17 ans explose",text:"Un jeune du centre enchaîne les entrées décisives. Les grands clubs appellent déjà son père.",choices:[
  {label:"Le titulariser immédiatement",result:"Il devient la coqueluche du stade, avec quelques trous d'air.",effects:{promoteYouth:true,supporters:3,formation:4,form:1}},
  {label:"Le protéger, le faire entrer progressivement",result:"Une gestion saluée par les formateurs. Le public s'impatiente.",effects:{formation:6,reputation:2,supporters:-1}},
  {label:"Le vendre au plus offrant",result:"Un chèque énorme. Le centre de formation ne te pardonne pas.",effects:{budget:.25,formation:-10,supporters:-4,confidence:4}}]},
 {id:'c-derby',icon:'🏟️',title:"Le derby de tous les dangers",text:"Le match contre le rival historique tombe en pleine crise. Toute la ville retient son souffle.",choices:[
  {label:"Jouer l'attaque à outrance",result:"Un derby fou, des buts partout, une ville en feu.",effects:{form:3,supporters:4,pressure:2}},
  {label:"Verrouiller et attendre",result:"Un 0-0 verrouillé. Le rival est frustré, le public un peu aussi.",effects:{form:1,supporters:-2,pressure:-1}},
  {label:"Faire jouer les jeunes du cru",result:"Onze enfants de la ville. Quoi qu'il arrive, ils seront aimés.",effects:{supporters:6,formation:3,form:-2}}]},
 {id:'c-clash-adjoint',icon:'💥',title:"Clash avec ton adjoint",text:"Ton adjoint historique conteste ouvertement tes choix devant le groupe. Le vestiaire est coupé en deux.",gauge:'staff',choices:[
  {label:"Le licencier sur-le-champ",result:"Un message clair, un ami perdu.",effects:{staff:-8,vestiaire:-3,confidence:2,pressure:3}},
  {label:"Crever l'abcès en tête-à-tête",result:"Trois heures de discussion. Il reste, avec des limites claires.",effects:{staff:5,technique:2,vestiaire:1}},
  {label:"Lui confier davantage de responsabilités",result:"Il devient ton bras droit. Certains disent que c'est lui qui entraîne.",effects:{staff:8,reputation:-2,form:2}}]},
 {id:'c-sponsor',icon:'💼',title:"Le sponsor exige des changements",text:"Le nouvel équipementier veut un football spectaculaire, des stars mises en avant et un maillot rose.",minYear:1985,choices:[
  {label:"Jouer le jeu marketing",result:"Les maillots se vendent, le foot est un peu moins beau.",effects:{budget:.08,supporters:2,reputation:-3,confidence:3}},
  {label:"Défendre le projet sportif",result:"Le sponsor râle mais reste. Les puristes t'adorent.",effects:{reputation:3,confidence:-3}},
  {label:"Négocier un compromis",result:"Un maillot rose pour les matchs à l'extérieur seulement.",effects:{budget:.03,confidence:1}}]},
 {id:'c-hiver',icon:'🌧️',title:"Hiver catastrophique",text:"Pelouse gelée, matchs reportés, un calendrier démentiel en avril avec trois matchs par semaine.",choices:[
  {label:"Faire tourner massivement",result:"Les remplaçants découvrent le monde. Quelques matchs se perdent bêtement.",effects:{form:-2,vestiaire:4,formation:2}},
  {label:"Aligner toujours les mêmes",result:"Les titulaires tiennent… jusqu'à la vague de blessures de mai.",effects:{form:2,injure:6,vestiaire:-3,pressure:4}},
  {label:"Investir dans la récupération",result:"Kinés en renfort, sommeil surveillé. Le corps tient.",effects:{budget:-.05,staff:3,form:1}}]},
 {id:'c-gros-club',icon:'📞',title:"Un plus gros club t'appelle en pleine saison",text:"Un club d'un niveau supérieur veut te débaucher immédiatement. Ton président l'apprend par la presse.",choices:[
  {label:"Refuser et le dire publiquement",result:"Ton club te vénère. Le gros club retient ton nom.",effects:{confidence:8,supporters:5,reseau:2,vestiaire:3}},
  {label:"Laisser planer le doute",result:"Le doute plane, et le vestiaire aussi.",effects:{reseau:3,vestiaire:-4,confidence:-6,form:-2,pressure:3}},
  {label:"Négocier une revalorisation",result:"Ton salaire double. Ton image de mercenaire aussi.",effects:{reseau:2,reputation:-3,confidence:-3}}]},
 {id:'c-capitaine',icon:'🎖️',title:"Le capitaine veut quitter le navire",text:"Ton capitaine, 33 ans, demande à être libéré pour un dernier contrat au soleil.",choices:[
  {label:"Le libérer avec les honneurs",result:"Un adieu digne, un vestiaire ému.",effects:{releaseCaptain:true,vestiaire:4,supporters:2,form:-2}},
  {label:"Le retenir une saison de plus",result:"Il joue, mais son cœur est ailleurs.",effects:{vestiaire:-3,form:-1,confidence:1}},
  {label:"Le nommer entraîneur adjoint",result:"Il raccroche et rejoint le staff. Une transition réussie.",effects:{releaseCaptain:true,staff:6,vestiaire:2}}]},
 {id:'c-tv',icon:'📹',title:"Une émission veut filmer ton vestiaire",text:"Une chaîne propose un documentaire de saison, caméras dans le vestiaire et sur le banc.",minYear:1995,choices:[
  {label:"Accepter",result:"Ta notoriété explose, quelques joueurs jouent pour la caméra.",effects:{reputation:4,budget:.05,vestiaire:-3,pressure:4}},
  {label:"Refuser pour protéger le groupe",result:"Le vestiaire apprécie. Les sponsors moins.",effects:{vestiaire:4,confidence:-2}},
  {label:"Accepter sans le vestiaire",result:"Ton bureau, pas le groupe. Un compromis élégant.",effects:{reputation:2,budget:.02}}]},
 {id:'c-gardien',icon:'🧤',title:"Ton gardien perd la tête",text:"Trois boulettes en deux matchs. Le stade siffle à chaque relance et le numéro 2 piaffe.",choices:[
  {label:"Maintenir ta confiance",result:"Il sauve un penalty le match suivant. Tu passes pour un génie.",effects:{vestiaire:3,form:1,pressure:2}},
  {label:"Changer de gardien",result:"Le numéro 2 est solide, le numéro 1 dévasté.",effects:{form:1,vestiaire:-2}},
  {label:"Engager un entraîneur des gardiens de renom",result:"Deux semaines de travail spécifique. Le gardien renaît.",effects:{budget:-.03,staff:4,form:2}}]},
 {id:'c-fusee',icon:'🎇',title:"Incidents en tribune",text:"Des fumigènes, une bagarre, un match arrêté vingt minutes. La Ligue menace le club d'un huis clos.",choices:[
  {label:"Condamner fermement les supporters",result:"La Ligue apprécie, le parcage te maudit.",effects:{supporters:-7,confidence:3,reputation:2}},
  {label:"Demander le dialogue avant la sanction",result:"Un huis clos évité de justesse, une trêve fragile.",effects:{supporters:2,pressure:2}},
  {label:"Rappeler que le football est une fête",result:"Les ultras t'applaudissent, la Ligue te sanctionne.",effects:{supporters:6,confidence:-4,reputation:-2}}]},
 {id:'c-data',icon:'📊',title:"L'analyste veut tout changer",text:"Ton analyste data affirme que ton meilleur passeur est le joueur le plus inutile de l'équipe. Les chiffres sont têtus.",minYear:2010,choices:[
  {label:"Suivre les données",result:"Le passeur va sur le banc, l'équipe marque plus. Le vestiaire grince.",effects:{form:3,vestiaire:-4,talent:1}},
  {label:"Faire confiance à ton œil",result:"Tu gardes ton passeur. Les chiffres attendront.",effects:{vestiaire:2,staff:-2}},
  {label:"Mélanger les deux",result:"Un rôle redéfini pour le passeur. Tout le monde y gagne un peu.",effects:{form:1,talent:2,staff:2}}]},
 {id:'c-tacle',icon:'🦵',title:"Le boucher adverse",text:"Un défenseur adverse a blessé deux de tes joueurs en un match, sans carton. L'arbitre n'a rien vu.",maxYear:1998,choices:[
  {label:"Exiger une sanction à la Ligue",result:"Une suspension de trois matchs pour lui. Tes deux joueurs restent blessés.",effects:{injure:4,reputation:2}},
  {label:"Rendre la pareille au match retour",result:"Un match de guerre. Le public en redemande.",effects:{injure:4,supporters:5,reputation:-4,vestiaire:3}},
  {label:"Encaisser en silence",result:"Le football des années dures. Tu serres les dents.",effects:{injure:4,vestiaire:-1}}]},
 {id:'c-var',icon:'📺',title:"La VAR te vole un match",text:"Un hors-jeu de trois centimètres, six minutes d'attente, un but refusé à la 95e.",minYear:2018,choices:[
  {label:"Demander la suppression de la VAR",result:"Une tribune enflammée. Les supporters approuvent.",effects:{supporters:4,reputation:-1,pressure:2}},
  {label:"Accepter la règle",result:"Zen. La presse te trouve mou, le vestiaire apaisé.",effects:{vestiaire:2,reputation:1}},
  {label:"Former l'équipe aux nouveaux hors-jeu",result:"Deux séances vidéo. Les attaquants partent une demi-seconde plus tard.",effects:{talent:2,form:1,staff:1}}]},
 {id:'c-tiktok',icon:'📱',title:"Un joueur star des réseaux",text:"Ton ailier a huit millions d'abonnés et filme tout, y compris ta causerie d'avant-match.",minYear:2019,choices:[
  {label:"Interdire les téléphones au centre",result:"Le vestiaire râle, la concentration revient.",effects:{vestiaire:-3,form:2,supporters:-1}},
  {label:"Le laisser faire, c'est l'époque",result:"Le club gagne en visibilité, tu perds un peu d'autorité.",effects:{budget:.04,supporters:3,vestiaire:-1}},
  {label:"L'utiliser pour la communication du club",result:"Une série documentaire maison. Le sponsor adore.",effects:{budget:.06,reputation:1,pressure:2}}]},
 {id:'c-mecene',icon:'💰',title:"Un mécène veut tout racheter",text:"Un homme d'affaires propose de racheter le club, à condition que tu restes et que tu recrutes une star.",minYear:1990,choices:[
  {label:"Soutenir le rachat",result:"Le club change de mains. L'argent coule, la pression aussi.",effects:{budget:.5,confidence:5,supporters:-3,pressure:6}},
  {label:"Rester neutre",result:"Le rachat se fait sans toi. Le nouveau propriétaire s'en souvient.",effects:{budget:.2,confidence:-4}},
  {label:"Alerter les supporters",result:"Le rachat capote. Tu es un héros du parcage et l'ennemi du conseil.",effects:{supporters:8,confidence:-8}}]},
 {id:'c-doping',icon:'💊',title:"Le préparateur miracle",text:"Un nouveau préparateur promet des joueurs infatigables grâce à des « compléments » non homologués.",choices:[
  {label:"Le renvoyer immédiatement",result:"Le staff médical te remercie.",effects:{staff:4,reputation:2,form:-1}},
  {label:"Demander une analyse indépendante",result:"Les compléments sont légaux mais inutiles. Tu as perdu un mois.",effects:{technique:1,pressure:1}},
  {label:"Tester sur quelques joueurs",result:"Les résultats sont spectaculaires. Jusqu'au contrôle.",effects:{form:5,reputation:-10,confidence:-10,pressure:8}}]},
 {id:'c-blessures-serie',icon:'🏥',title:"Épidémie de blessures",text:"Cinq titulaires à l'infirmerie en deux semaines. Le staff médical est débordé.",gauge:'staff',choices:[
  {label:"Recruter un préparateur physique de pointe",result:"Les corps se remettent, lentement.",effects:{budget:-.04,staff:6,injure:3}},
  {label:"Lancer les jeunes",result:"Le centre se vide, la première fournit.",effects:{formation:4,form:-3,injure:5}},
  {label:"Serrer les dents",result:"Les blessés reviennent trop tôt. Certains rechutent.",effects:{injure:8,form:-2,vestiaire:-2}}]},
 {id:'c-maire',icon:'🏛️',title:"La mairie coupe les subventions",text:"Élections, austérité : le stade municipal devient payant pour le club.",tiers:['amateur','ligue2'],choices:[
  {label:"Mobiliser les supporters",result:"Une pétition, une manifestation, une subvention partiellement rétablie.",effects:{supporters:6,budget:-.05}},
  {label:"Vendre un jeune pour compenser",result:"Le centre pleure, la trésorerie respire.",effects:{formation:-6,budget:.1,confidence:3}},
  {label:"Serrer le budget",result:"Fin des déplacements en avion. Bus et sandwichs.",effects:{budget:-.1,vestiaire:-2,staff:-2}}]},
 {id:'c-legende',icon:'🗿',title:"Une légende du club te critique",text:"L'ancien capitaine emblématique, consultant télé, t'appelle « le fossoyeur du jeu ».",choices:[
  {label:"L'inviter au centre pour discuter",result:"Il repart convaincu à moitié. La polémique s'éteint.",effects:{supporters:3,reputation:2}},
  {label:"Répondre sèchement",result:"La guerre est déclarée. Les tribunes se divisent.",effects:{supporters:-4,pressure:3,vestiaire:2}},
  {label:"Ignorer",result:"Le silence est une réponse. Il continue de parler.",effects:{pressure:2}}]},
 {id:'c-sud-am',icon:'🌎',title:"Le vol de retour de sélection",text:"Tes trois Sud-Américains rentrent de sélection à la veille d'un match décisif, épuisés.",minYear:1994,choices:[
  {label:"Les titulariser quand même",result:"Deux d'entre eux se blessent à l'échauffement.",effects:{injure:3,form:-2}},
  {label:"Les laisser au repos",result:"Le match se joue sans eux. Le président ne comprend pas.",effects:{confidence:-3,vestiaire:3}},
  {label:"Négocier un vol privé avec la fédération",result:"Cher, mais ils arrivent frais.",effects:{budget:-.03,form:1}}]},
 {id:'c-tapis-vert',icon:'📋',title:"Le tapis vert",text:"Un adversaire a aligné un joueur suspendu. Le club peut réclamer la victoire sur tapis vert.",choices:[
  {label:"Réclamer",result:"Trois points gagnés dans un bureau. Le football des juristes.",effects:{points:3,reputation:-2,supporters:-1}},
  {label:"Renoncer par esprit sportif",result:"Le monde du football applaudit. Le président fulmine.",effects:{reputation:4,confidence:-4}},
  {label:"Négocier une contrepartie",result:"Le club adverse te cède un jeune en prêt.",effects:{reseau:2,form:1}}]},
 {id:'c-pere-joueur',icon:'👨‍👦',title:"Le père envahissant",text:"Le père de ton milieu de 19 ans t'envoie des compositions d'équipe par SMS et menace de l'emmener ailleurs.",minYear:2000,choices:[
  {label:"Le recevoir et poser un cadre",result:"Il comprend. Le fils respire.",effects:{formation:3,vestiaire:2}},
  {label:"L'ignorer",result:"Le fils demande à partir en janvier.",effects:{formation:-3,vestiaire:-2}},
  {label:"Prolonger le fils avec une clause en béton",result:"Le père signe, ravi de la prime.",effects:{budget:-.04,formation:4,confidence:1}}]},
 {id:'c-nuit',icon:'🌙',title:"Sortie nocturne avant le derby",text:"Quatre joueurs photographiés en boîte à 4 h, la veille du derby.",choices:[
  {label:"Les écarter du groupe",result:"Le derby se joue sans eux. Le message est passé.",effects:{form:-3,vestiaire:-2,reputation:3,confidence:2}},
  {label:"Amende et titularisation",result:"Ils jouent avec la rage. L'un marque.",effects:{form:2,vestiaire:1,reputation:-1}},
  {label:"Ne rien dire",result:"Le vestiaire retient que tout est permis.",effects:{vestiaire:-4,form:-1}}]},
 {id:'c-chaleur',icon:'🌡️',title:"Canicule",text:"Trois matchs à 38 °C. Les joueurs demandent des pauses fraîcheur, la Ligue refuse de décaler.",minYear:2015,choices:[
  {label:"Adapter la préparation",result:"Séances à l'aube, hydratation surveillée.",effects:{staff:3,form:1}},
  {label:"Protester publiquement",result:"La Ligue décale un match. Tu deviens le porte-parole des coachs.",effects:{reputation:3,confidence:-1}},
  {label:"Ignorer",result:"Deux joueurs frôlent le malaise.",effects:{injure:2,form:-2}}]},
 {id:'c-cosmos',icon:'✈️',title:"Une tournée exotique",text:"Le club est invité à une tournée lointaine très rémunératrice, en pleine saison.",maxYear:1995,choices:[
  {label:"Accepter la tournée",result:"L'argent rentre, les joueurs rentrent fatigués.",effects:{budget:.15,form:-3,confidence:3}},
  {label:"Refuser",result:"Le président regrette l'argent, le vestiaire apprécie.",effects:{vestiaire:2,confidence:-2}},
  {label:"Y envoyer la réserve",result:"Les jeunes découvrent le monde. Tout le monde y gagne.",effects:{budget:.06,formation:3}}]},
 {id:'c-golfe',icon:'🏜️',title:"Le Golfe fait les yeux doux à ton défenseur",text:"Un club saoudien offre à ton défenseur central quatre fois son salaire. Il a 31 ans et une famille.",minYear:2023,choices:[
  {label:"Le laisser partir",result:"Un chèque énorme, une charnière à reconstruire.",effects:{sellStar:2,confidence:4,form:-3}},
  {label:"Le retenir avec une prolongation",result:"Il reste, mais chaque défaite lui fera penser au sable chaud.",effects:{budget:-.08,vestiaire:1,form:1}},
  {label:"Le laisser choisir",result:"Il part en larmes, applaudi par le stade.",effects:{sellStar:2,supporters:3,vestiaire:2,form:-3}}]},
 {id:'c-huis-clos',icon:'🔇',title:"Match à huis clos",text:"Le club est sanctionné : le prochain match décisif se jouera sans public.",choices:[
  {label:"Transformer le silence en force",result:"Une causerie mémorable. Le stade vide devient un avantage.",effects:{form:2,vestiaire:2}},
  {label:"Inviter les familles des joueurs",result:"La Ligue tolère. Le match a une âme.",effects:{vestiaire:3,supporters:2}},
  {label:"Ne rien changer",result:"Le silence pèse. L'équipe joue sans énergie.",effects:{form:-2}}]},
];

const COACH_HAPPENINGS=[
 {id:'h-livre',icon:'📚',title:"Un éditeur veut ton livre",text:"« Ma méthode » : trois cents pages sur ta vision du football. Elles s'écriront la nuit.",choices:[
  {label:"Écrire un livre sincère",result:"Un succès d'estime, des passages qui vexent d'anciens présidents, et six mois de nuits courtes.",effects:{reputation:5,talent:1,reseau:-3,proches:-6},
   seed:{in:3,icon:'📚',title:"Ton livre te revient",text:"Un dirigeant que tu égratignais dans « Ma méthode » siège désormais à la commission qui distribue les postes. On se souvient de la page 214.",effects:{reseau:-6,reputation:2}}},
  {label:"Publier un livre de motivation",result:"Vendu en tête de gondole, moqué par les puristes.",effects:{reseau:3,supporters:2,reputation:-3,proches:-3}},
  {label:"Refuser",result:"Tu gardes tes secrets. On te trouve fermé.",effects:{pressure:-2,reputation:-1}}]},
 {id:'h-burnout',icon:'🛌',title:"Le corps dit stop",text:"Malaise au bord du terrain, hospitalisation et un médecin qui exige du repos.",choices:[
  {label:"Prendre deux mois de recul",result:"Ton adjoint assure. Tu reviens avec des idées, le président avec des doutes.",effects:{pressure:-18,staff:3,proches:9,technique:-1,confidence:-6}},
  {label:"Revenir après une semaine",result:"Le public applaudit ton courage. Le médecin soupire.",effects:{pressure:6,reputation:2,proches:-6},
   seed:{in:2,icon:'🫀',title:"La rechute",text:"Le corps n'avait rien oublié. Cette fois, l'arrêt n'est pas négociable.",effects:{pressure:14,technique:-3,proches:-5}}},
  {label:"Changer d'hygiène de vie",result:"Sport, sommeil, moins de dîners tardifs. Une nouvelle personne, et un carnet d'adresses qui refroidit.",effects:{pressure:-10,proches:5,reseau:-4}}]},
 {id:'h-selection',icon:'🇫🇷',title:"La fédération te sonde",text:"Le poste de sélectionneur des espoirs se libère.",choices:[
  {label:"Décliner poliment",result:"On te rappellera. Probablement pas.",effects:{reseau:-4,pressure:-1}},
  {label:"Accepter un rôle de conseiller",result:"Quelques stages, beaucoup de réseau, des week-ends qui sautent.",effects:{reseau:6,technique:2,pressure:4,proches:-7}},
  {label:"Faire campagne pour le poste principal",result:"Tu n'es pas retenu·e, mais tout le monde connaît ton nom. Ton président aussi a lu la presse.",effects:{reputation:3,reseau:3,pressure:3,confidence:-6,proches:-4}}]},
 {id:'h-mentor',icon:'🧓',title:"Ton mentor t'appelle",text:"L'entraîneur qui t'a formé traverse une mauvaise passe et cherche un adjoint pour six mois.",choices:[
  {label:"Prendre une demi-saison pour l'aider",result:"Une leçon d'humilité à ses côtés. Ton club, lui, tourne sans toi.",effects:{talent:5,technique:2,reseau:3,pressure:-4,confidence:-9,proches:-5,skipHalf:true}},
  {label:"Lui envoyer ton adjoint",result:"Ton adjoint part six mois. Le staff encaisse, ton mentor s'en sort.",effects:{staff:-3,reseau:3,form:-1},
   seed:{in:2,icon:'🧓',title:"L'adjoint revient grandi",text:"Six mois auprès d'un maître : ton adjoint rentre avec des idées et un carnet d'adresses.",effects:{staff:8,talent:2}}},
  {label:"Décliner",result:"Il comprend. Vous ne parlerez plus jamais de la même façon.",effects:{reseau:-3,technique:-2,proches:3}}]},
 {id:'h-stage',icon:'🎓',title:"Formation continue",text:"Un stage d'élite réunit les meilleurs techniciens du monde pendant un mois, à l'autre bout de l'Europe.",choices:[
  {label:"Y aller le mois entier",result:"Des idées neuves et un carnet d'adresses doré. Un mois sans voir ni ton groupe ni ta famille.",effects:{talent:5,technique:3,reseau:4,vestiaire:-5,proches:-9,confidence:-3}},
  {label:"Suivre à distance, le soir",result:"Moins immersif, et les soirées y passent quand même.",effects:{talent:2,technique:2,proches:-4}},
  {label:"Rester au club",result:"Tu préfères le terrain. Le football, lui, avance ailleurs.",effects:{vestiaire:3,talent:-2,reseau:-2}}]},
 {id:'h-rival',icon:'😤',title:"Un entraîneur rival te provoque",text:"En conférence de presse, un coach célèbre qualifie ton football de « ennuyeux à mourir ».",choices:[
  {label:"Répondre avec humour",result:"La punchline fait le tour du pays. Et installe un duel dont on te reparlera à chaque match.",effects:{reputation:4,supporters:2,pressure:3}},
  {label:"Ne rien dire",result:"Le silence est classe. Le parcage, lui, attendait une réponse.",effects:{reputation:1,supporters:-3}},
  {label:"Déclencher une guerre médiatique",result:"Six mois de piques, deux amendes et un téléphone qui sonne à toute heure.",effects:{supporters:3,pressure:6,reputation:-2,proches:-5}}]},
 {id:'h-famille',icon:'🏡',title:"La famille craque",text:"Quatre déménagements en cinq ans, des dimanches au stade, des anniversaires manqués. Ta famille veut poser les valises.",choices:[
  {label:"Promettre de rester dans la région",result:"Tu refuseras des projets lointains. Le foyer respire.",effects:{proches:16,pressure:-8,reseau:-4,stayLocal:true}},
  {label:"Négocier une saison de plus",result:"Un compromis fragile, que personne ne croit vraiment.",effects:{proches:-5,pressure:3}},
  {label:"Le football d'abord",result:"Tu le diras autrement, mais c'est ce que tout le monde a entendu.",effects:{talent:2,technique:2,proches:-16,pressure:5},
   seed:{in:2,icon:'📦',title:"L'anniversaire de trop",text:"Un carton dans l'entrée, une lettre sur la table. Tu rentreras dans un appartement vide après les matchs.",effects:{proches:-14,pressure:12,technique:-2}}}]},
 {id:'h-ancien',icon:'🎁',title:"Un ancien joueur te remercie",text:"Un international que tu as lancé il y a dix ans te dédie son trophée.",choices:[
  {label:"L'inviter au centre pour parler aux jeunes",result:"Une journée magique pour le centre, un week-end de plus au club.",effects:{formation:6,supporters:3,proches:-3}},
  {label:"Le remercier discrètement",result:"Un message privé, une amitié préservée, personne n'en saura rien.",effects:{reseau:2,supporters:-2}},
  {label:"Le recruter comme adjoint",result:"Il rejoint ton staff avec fougue et sans diplôme. Le reste du staff grince.",effects:{staff:5,talent:-1,vestiaire:-3,budget:-.02}}]},
 {id:'h-statue',icon:'🏙️',title:"La ville te propose une statue",text:"Le maire veut inaugurer une place à ton nom. Des opposants trouvent ça ridicule.",choices:[
  {label:"Accepter avec émotion",result:"Une cérémonie, des larmes, et une tribune d'opposants dans le journal local.",effects:{supporters:5,pressure:2,reputation:-3}},
  {label:"Proposer un terrain pour les jeunes à la place",result:"Un geste salué par tout le monde, financé en partie par le club.",effects:{reputation:4,formation:5,budget:-.05}},
  {label:"Refuser tout honneur",result:"Modestie exemplaire. La ville se vexe un peu.",effects:{reputation:2,supporters:-5}}]},
 {id:'h-paris',icon:'🎰',title:"Soupçons de paris",text:"Un joueur de ton effectif est cité dans une enquête sur les paris sportifs.",choices:[
  {label:"Collaborer totalement",result:"Le club est blanchi, le joueur suspendu, et le vestiaire te regarde autrement.",effects:{reputation:4,vestiaire:-6,confidence:-2,form:-1}},
  {label:"Protéger le club avant tout",result:"Des avocats, des silences, une image abîmée.",effects:{reputation:-6,confidence:3,vestiaire:4},
   seed:{in:3,icon:'⚖️',title:"L'enquête ressort",text:"Trois ans plus tard, un journaliste publie les écoutes. Ton nom est dans le dossier des silences.",effects:{reputation:-8,confidence:-10,pressure:8}}},
  {label:"Laisser la justice faire son travail",result:"Neutralité prudente, que personne ne trouve courageuse.",effects:{pressure:3,supporters:-4}}]},
 {id:'h-tele',icon:'🎙️',title:"Consultant télé pendant l'été",text:"Une chaîne te propose de commenter la grande compétition internationale. Tout l'été.",minYear:1982,choices:[
  {label:"Accepter tout l'été",result:"Ton visage entre dans tous les salons. Ta préparation, elle, commence sans toi.",effects:{reputation:5,reseau:3,pressure:2,technique:-2,proches:-8}},
  {label:"Refuser pour préparer la saison",result:"Ton président apprécie. Ton été y passe aussi.",effects:{confidence:4,technique:2,reputation:-2,proches:-4}},
  {label:"Accepter une seule émission",result:"Un passage remarqué, un week-end sacrifié.",effects:{reputation:2,reseau:1,proches:-2}}]},
 {id:'h-heritage',icon:'🏚️',title:"Le club de ton enfance coule",text:"Le club amateur où tu as commencé est menacé de dissolution.",choices:[
  {label:"Organiser un match de gala",result:"Tes anciens joueurs viennent. Le club survit, ton mois de juin disparaît.",effects:{reputation:3,reseau:2,supporters:2,proches:-5,pressure:2}},
  {label:"Donner de ta poche",result:"Discret et efficace. L'économie de la maison encaisse.",effects:{pressure:-2,proches:-4,reputation:1}},
  {label:"Ne rien faire",result:"Le club disparaît. Tu y penses souvent.",effects:{pressure:3,reputation:-2}}]},
 {id:'h-diplome',once:true,icon:'📜',title:"Réforme des diplômes",text:"La fédération exige un nouveau diplôme pour entraîner au plus haut niveau.",choices:[
  {label:"Passer le diplôme",result:"Six week-ends de cours. Tu apprends des choses, tu manques six dimanches.",effects:{technique:4,pressure:3,proches:-6}},
  {label:"Demander une dérogation",result:"Accordée, mais la presse en parle et la fédération s'en souvient.",effects:{reputation:-3,reseau:-3}},
  {label:"Contester la réforme",result:"Tu deviens le porte-parole des vieux briscards.",effects:{reseau:3,reputation:-2,confidence:-4}}]},
 {id:'h-ecole',once:true,icon:'🏫',title:"Ouvrir ton académie",text:"Des investisseurs proposent de créer une académie de football à ton nom.",minYear:2000,choices:[
  {label:"Se lancer à fond",result:"Un projet passionnant, chronophage, et qui ne dort jamais.",effects:{formation:8,reseau:3,pressure:6,proches:-10},
   seed:{in:3,icon:'🏫',title:"La première promotion",text:"Trois gamins de ton académie signent pro la même année. On associe ton nom à leur trajectoire.",effects:{formation:7,reputation:5,reseau:3}}},
  {label:"Prêter ton nom seulement",result:"Un chèque, une signature, et une académie que tu ne contrôles pas.",effects:{reseau:3,reputation:-4,formation:1}},
  {label:"Refuser",result:"Le terrain d'abord. L'offre ira à un autre.",effects:{talent:1,reseau:-3}}]},
 {id:'h-docu',icon:'🎥',title:"Des caméras dans le vestiaire",text:"Une plateforme veut filmer ta saison de l'intérieur. Causeries comprises.",minYear:2000,choices:[
  {label:"Tout ouvrir, sans droit de regard",result:"Un document rare, et un vestiaire qui ne parle plus librement.",effects:{reputation:7,supporters:5,reseau:3,vestiaire:-8,confidence:-3}},
  {label:"Filmer, mais valider chaque image",result:"Un objet propre et sans âme. Les deux camps sont à moitié déçus.",effects:{reputation:2,supporters:2,vestiaire:-2,proches:-3}},
  {label:"Refuser l'accès",result:"Le vestiaire respire. La plateforme ira filmer ton concurrent direct.",effects:{vestiaire:5,reputation:-3,reseau:-3}}]},
 {id:'h-fils',icon:'👦',title:"Un enfant de la maison",text:"Un proche te demande de faire entrer son gamin au centre. Il est bon. Pas exceptionnel.",choices:[
  {label:"Le prendre au centre",result:"Il progresse. Les éducateurs, eux, ont compris le message sur les critères.",effects:{proches:10,formation:-7,reputation:-3},
   seed:{in:3,icon:'👦',title:"Le gamin qu'on avait fait entrer",text:"Il n'a pas percé, et tout le centre sait pourquoi il était là. Les formateurs recrutent désormais en te regardant.",effects:{formation:-6,reputation:-4}}},
  {label:"Lui payer un essai ailleurs",result:"Un coup de fil, un club voisin, et une famille à moitié satisfaite.",effects:{reseau:-2,proches:2}},
  {label:"Dire non, franchement",result:"Le centre te respecte davantage. Les repas de famille, moins.",effects:{formation:5,proches:-9}}]},
 {id:'h-maladie',icon:'🏥',title:"Quelqu'un tombe malade",text:"Un proche entre à l'hôpital pour plusieurs mois. Personne d'autre ne peut y aller tous les jours.",choices:[
  {label:"Y être tous les soirs",result:"Tu dors mal, tu arrives tard, tu es là où il faut.",effects:{proches:15,pressure:-4,talent:-3,confidence:-5,staff:-2}},
  {label:"Payer ce qu'il faut et appeler",result:"Le meilleur service, la meilleure chambre, et une chaise vide à côté du lit.",effects:{budget:-.04,proches:-6,pressure:5}},
  {label:"Continuer comme si de rien n'était",result:"Personne au club ne saura. Toi, tu sauras.",effects:{proches:-12,pressure:9,talent:1}}]},
 {id:'h-dirigeant',icon:'💼',title:"On te propose le bureau",text:"Un club t'offre un poste de directeur sportif : plus de pouvoir, plus d'argent, plus jamais de banc.",choices:[
  {label:"Refuser tout net",result:"Le terrain, ou rien. Le club te trouve borné.",effects:{talent:2,reseau:-4,budget:-.02}},
  {label:"Demander à réfléchir un an",result:"Tu gardes la porte ouverte. Ton président l'apprend par la presse.",effects:{reseau:5,confidence:-7,pressure:3}},
  {label:"Négocier un double rôle",result:"Entraîneur et décideur : deux métiers, une seule vie.",effects:{reseau:6,budget:.06,pressure:8,proches:-8,technique:-2}}]},
 {id:'h-politique',icon:'🗳️',title:"Un parti veut ton nom",text:"On te propose une place éligible aux municipales. Ta notoriété vaut des voix.",choices:[
  {label:"Accepter la tête de liste",result:"Des réunions publiques trois soirs par semaine, et la moitié de la ville contre toi.",effects:{reseau:8,reputation:-5,supporters:-6,proches:-8,pressure:5}},
  {label:"Soutenir sans te présenter",result:"Une photo, une phrase, et des supporters partagés.",effects:{reseau:4,supporters:-3}},
  {label:"Rester hors de tout ça",result:"Ni ami ni ennemi. La mairie s'en souviendra au moment du stade.",effects:{reputation:3,reseau:-5,budget:-.03}}]},
 {id:'h-lanceur',icon:'📱',title:"Le dossier anonyme",text:"Une clé USB dans ton casier : des transferts de ton propre club, des commissions qui n'existent pas.",choices:[
  {label:"Tout remettre à la justice",result:"Le club tremble, ton président aussi. Tu deviens intouchable et infréquentable.",effects:{reputation:8,confidence:-14,reseau:-7,pressure:6}},
  {label:"En parler d'abord au président",result:"Le dossier disparaît. Ta position, elle, s'est renforcée.",effects:{confidence:8,reputation:-5,pressure:3},
   seed:{in:3,icon:'🗃️',title:"La clé USB refait surface",text:"Un journaliste publie tout. On te demande pourquoi tu savais et pourquoi tu t'es tu.",effects:{reputation:-9,confidence:-6,pressure:10}}},
  {label:"Tout effacer et oublier",result:"Tu n'as rien vu. Tu y penses au réveil.",effects:{pressure:7,proches:-4}}]},
];

/* Dilemmes déclenchés par une jauge basse (entraîneur·euse) */
const COACH_DILEMMAS=[
 {gauge:'vestiaire',icon:'🪑',title:"La révolte des remplaçants",text:"Cinq joueurs qui ne jouent jamais demandent une réunion collective.",choices:[{label:"Leur promettre du temps de jeu",effects:{vestiaire:8,form:-1}},{label:"Leur proposer des prêts",effects:{vestiaire:2,budget:.03}},{label:"Refuser toute réunion",effects:{vestiaire:-6,pressure:3,form:1}}]},
 {gauge:'vestiaire',icon:'💶',title:"La grille des primes",text:"Les cadres veulent des primes individuelles, les jeunes une prime collective.",choices:[{label:"Prime collective",effects:{vestiaire:7,confidence:-2}},{label:"Primes individuelles",effects:{vestiaire:-3,form:2}},{label:"Laisser la direction trancher",effects:{confidence:2}}]},
 {gauge:'vestiaire',icon:'🍻',title:"La soirée d'équipe",text:"Le capitaine propose une soirée pour ressouder le groupe. Ça peut finir dans la presse.",choices:[{label:"Autoriser et y aller",effects:{vestiaire:9,pressure:2,reputation:-1}},{label:"Autoriser sans y aller",effects:{vestiaire:5}},{label:"Interdire",effects:{vestiaire:-4}}]},
 {gauge:'supporters',icon:'🎟️',title:"Le prix des places",text:"La direction veut augmenter les abonnements de 30 %.",choices:[{label:"S'y opposer publiquement",effects:{supporters:8,confidence:-5}},{label:"Négocier une hausse modérée",effects:{supporters:2,confidence:1}},{label:"Ne pas se mêler",effects:{supporters:-4,confidence:2}}]},
 {gauge:'supporters',icon:'🚌',title:"Le déplacement des ultras",text:"Les ultras demandent que le club finance leur déplacement pour le match décisif.",choices:[{label:"Payer de ta poche",effects:{supporters:9,pressure:1}},{label:"Négocier avec le club",effects:{supporters:4,confidence:-1}},{label:"Refuser",effects:{supporters:-5}}]},
 {gauge:'supporters',icon:'🧒',title:"Séance ouverte aux enfants",text:"Un éducateur propose des séances ouvertes aux écoles du quartier.",choices:[{label:"Accepter et animer toi-même",effects:{supporters:7,formation:2,pressure:1}},{label:"Déléguer au staff",effects:{supporters:3}},{label:"Refuser, le centre est un lieu de travail",effects:{supporters:-3,form:1}}]},
 {gauge:'formation',icon:'🏫',title:"Le centre menacé",text:"La direction veut fermer une partie du centre de formation pour financer un transfert.",choices:[{label:"S'y opposer publiquement",effects:{formation:8,confidence:-5}},{label:"Proposer des économies ailleurs",effects:{formation:3,staff:-2}},{label:"Accepter",effects:{formation:-9,budget:.1,confidence:3}}]},
 {gauge:'formation',icon:'🔍',title:"L'œil du recruteur",text:"Un vieux recruteur propose de te suivre partout pour un salaire symbolique.",choices:[{label:"L'embaucher et l'écouter",effects:{formation:6,reseau:3,budget:-.01}},{label:"Le consulter ponctuellement",effects:{formation:2}},{label:"Décliner",effects:{formation:-1}}]},
 {gauge:'formation',icon:'📘',title:"La bible du club",text:"Le directeur sportif propose d'écrire un projet de jeu commun des U8 à l'équipe première.",choices:[{label:"Rédiger la bible avec les formateurs",effects:{formation:7,talent:1,pressure:2}},{label:"Signer un document minimal",effects:{formation:2}},{label:"Refuser toute contrainte",effects:{formation:-3,talent:1}}]},
 {gauge:'staff',icon:'🧑‍🤝‍🧑',title:"Le staff épuisé",text:"Ton préparateur physique et ton analyste enchaînent les nuits blanches et menacent de partir.",choices:[{label:"Recruter du renfort",effects:{staff:7,budget:-.03}},{label:"Leur offrir une semaine de repos",effects:{staff:4,form:-1}},{label:"Leur demander un dernier effort",effects:{staff:-6,pressure:3}}]},
 {gauge:'staff',icon:'🍽️',title:"Le dîner du président",text:"Le président t'invite pour parler « stratégie ». Il veut surtout choisir l'équipe.",choices:[{label:"Écouter et expliquer patiemment",effects:{confidence:6,staff:1,pressure:1}},{label:"Poser une limite claire",effects:{confidence:-2,vestiaire:2,staff:2}},{label:"Annuler le dîner",effects:{confidence:-6}}]},
 {gauge:'staff',icon:'🎓',title:"Le stage du staff",text:"Ton staff demande à partir en observation chez un grand club étranger.",choices:[{label:"Accepter et financer",effects:{staff:8,budget:-.02,talent:1}},{label:"Accepter sans financer",effects:{staff:3,vestiaire:-2}},{label:"Refuser",effects:{staff:-4,technique:1}}]},
 {gauge:'proches',icon:'🏡',title:"Le dimanche de trop",text:"Ton fils joue la finale de son championnat dimanche. Toi aussi.",choices:[
  {label:"Déléguer le match à ton adjoint et aller le voir",effects:{proches:14,confidence:-7,vestiaire:-4,form:-2}},
  {label:"Promettre d'être là la prochaine fois",effects:{proches:-6,pressure:3}},
  {label:"Regarder la vidéo le soir, en boucle",effects:{proches:-2,pressure:4,technique:1}}]},
 {gauge:'proches',icon:'📞',title:"Le téléphone du dimanche soir",text:"Chez toi, on a pris l'habitude de ne plus t'attendre pour dîner. Un proche te le dit franchement.",choices:[
  {label:"Couper le téléphone deux soirs par semaine",effects:{proches:11,reseau:-5,talent:-1}},
  {label:"Emmener toute la famille au stade",effects:{proches:6,supporters:3,pressure:2}},
  {label:"Expliquer que c'est le métier qui veut ça",effects:{proches:-8,technique:2,pressure:3}}]},
 {gauge:'proches',icon:'🧳',title:"Le déménagement de trop",text:"Un club t'attend à 700 km. Les valises de la maison ne sont même pas défaites.",choices:[
  {label:"Refuser tout départ pendant deux ans",effects:{proches:13,reseau:-6,reputation:-3,stayLocal:true}},
  {label:"Partir seul·e, rentrer le week-end",effects:{proches:-10,pressure:6,reseau:3}},
  {label:"Faire suivre tout le monde, encore",effects:{proches:-6,pressure:4,reputation:2}}]},
 {gauge:'vestiaire',icon:'🧊',title:"Le placard du vestiaire",text:"Tes cadres ont décidé qu'un jeune ne parlerait à personne pendant un mois. Ils appellent ça la hiérarchie.",choices:[
  {label:"Convoquer les cadres et trancher",effects:{vestiaire:-5,formation:6,reputation:3,form:-1}},
  {label:"Nommer le jeune vice-capitaine",effects:{vestiaire:-8,formation:8,confidence:-2}},
  {label:"Laisser le groupe se réguler",effects:{vestiaire:6,formation:-7,proches:-2}}]},
 {gauge:'supporters',icon:'🔥',title:"La banderole",text:"Une banderole insultante vise ton meilleur joueur. Le club peut porter plainte.",choices:[
  {label:"Porter plainte avec le joueur",effects:{vestiaire:8,supporters:-9,reputation:4}},
  {label:"Aller parler aux ultras dans leur local",effects:{supporters:7,vestiaire:-4,pressure:4,proches:-3}},
  {label:"Ne pas commenter",effects:{supporters:-2,vestiaire:-5,pressure:2}}]},
 {gauge:'formation',icon:'💰',title:"Vendre la pépite maintenant",text:"Un géant offre une somme indécente pour ton joyau de 17 ans. Le centre a mis dix ans à le produire.",choices:[
  {label:"Vendre et réinvestir dans le centre",effects:{formation:9,budget:.14,supporters:-8,vestiaire:-4}},
  {label:"Vendre et renforcer l'équipe première",effects:{budget:.18,formation:-9,confidence:5,supporters:-4}},
  {label:"Refuser et le lancer cette saison",effects:{formation:7,supporters:6,budget:-.06,confidence:-6}}]},
 {gauge:'staff',icon:'🩺',title:"Le médecin dit non",text:"Ton médecin interdit à ton meilleur joueur de jouer le match décisif. Le joueur, lui, veut jouer.",choices:[
  {label:"Suivre le médecin",effects:{staff:9,form:-2,supporters:-4,confidence:-3}},
  {label:"Le faire jouer quand même",effects:{staff:-10,form:3,injure:4,confidence:3}},
  {label:"Le mettre sur le banc, au cas où",effects:{staff:2,vestiaire:-3,form:-1}}]},
 {gauge:'proches',icon:'🎄',title:"Le stage de Noël",text:"La direction veut un stage au centre technique du 24 au 2. Tout le monde attend ton avis.",choices:[
  {label:"Imposer le stage",effects:{talent:4,form:2,vestiaire:-7,proches:-12}},
  {label:"Deux jours, puis chacun chez soi",effects:{proches:6,vestiaire:4,talent:-2,confidence:-3}},
  {label:"Annuler tout et rentrer",effects:{proches:14,vestiaire:6,form:-3,confidence:-6}}]},
];

/* ---------- Les carrefours : l'arbitrage amené par une situation ----------
   Un par phase. Trois chantiers sur la table, un seul reçoit ton énergie ;
   les deux autres reculent. Les clés renvoient à FOCUS_AREAS (coach.js). */
const COACH_CROSSROADS=[
 {id:'x-reprise',icon:'📋',title:"La reprise",text:"Trois semaines de préparation, un tableau blanc vide, et tout le monde qui attend de savoir par quoi on commence.",phase:0,menu:['terrain','vestiaire','centre']},
 {id:'x-juillet',icon:'☀️',title:"Les quatre semaines de juillet",text:"Pas de match, pas d'urgence, et quatre semaines qui ne reviendront pas.",phase:0,menu:['club','proches','terrain']},
 {id:'x-stage',icon:'🏔️',title:"Le stage de présaison",text:"Dix jours en altitude, sans familles, sans téléphone, sans journalistes. Le club paie ; toi, tu choisis ce que tu en fais.",phase:0,menu:['vestiaire','proches','club']},
 {id:'x-effectif',icon:'🧩',title:"Le groupe n'est pas bouclé",text:"Il manque un joueur, le mercato ferme dans trois semaines, et trois personnes attendent que tu tranches.",phase:0,menu:['centre','club','vestiaire']},
 {id:'x-treve',icon:'❄️',title:"Quinze jours sans match",text:"La trêve. Le groupe part, le centre tourne, la maison est pleine. Tu ne peux être qu'à un endroit.",phase:2,menu:['terrain','proches','vestiaire']},
 {id:'x-agenda',icon:'🗓️',title:"L'agenda du trimestre",text:"Ton assistante pose trois blocs sur le calendrier et te demande lequel elle garde.",menu:['club','proches','centre']},
 {id:'x-apres',icon:'🌧️',title:"La semaine d'après",text:"Trois défaites. Le président veut un plan, le vestiaire une explication, la presse un coupable.",menu:['vestiaire','terrain','club']},
 {id:'x-reserve',icon:'🌱',title:"La réserve joue le samedi",text:"Les matchs de la réserve sont le samedi après-midi. Comme le reste de ta vie.",menu:['centre','terrain','proches']},
 {id:'x-telephone',icon:'📵',title:"Le téléphone ne s'arrête plus",text:"Quarante appels par jour : agents, journalistes, dirigeants, et deux numéros que tu ne rappelles jamais.",menu:['club','proches','vestiaire']},
 {id:'x-sprint',icon:'🏁',title:"Le sprint final",text:"Dix journées, tout se joue. Ce que tu délaisses maintenant, tu le paieras l'an prochain.",phase:3,menu:['terrain','club','proches']},
];

const COACH_ROULETTES=[
 {id:'emir',icon:'👑',title:"L'offre de l'émir",text:"Un propriétaire richissime te propose de diriger un projet inédit, à condition de signer sans lire. Quatre versions du contrat sont posées devant toi.",choices:["Contrat A","Contrat B","Contrat C","Contrat D"],endText:"Le contrat contenait une clause d'exclusivité à vie : tu ne pourras plus jamais signer ailleurs. Ta carrière continue, mais dans un seul club.",jackpotText:"Le contrat était en or massif : budgets illimités, pouvoir total, respect immédiat.",
  fate:{kind:'exclusive',icon:'👑',label:"Lié à vie",text:"La clause d'exclusivité lie les deux parties : aucun autre club ne peut t'appeler, mais celui-ci ne peut plus te licencier. Ta carrière se jouera ici, jusqu'au bout."}},
 {id:'voyant',icon:'🔮',title:"Le voyant du parcage",text:"Un vieux supporter prétend lire l'avenir dans les compositions d'équipe. Il te tend quatre feuilles pliées.",choices:["Feuille du vent","Feuille de terre","Feuille de feu","Feuille d'eau"],endText:"La feuille annonçait une chute brutale. Elle avait raison : un accident sur la route du stade met fin à tout.",jackpotText:"La feuille annonçait une année de grâce. Tout ce que tu touches se transforme en victoire.",
  fate:{kind:'death'}},
 {id:'coffre',icon:'🗝️',title:"L'héritage du fondateur",text:"Dans les archives du club, quatre coffres portent les noms d'anciens entraîneurs légendaires. Un seul peut être ouvert.",choices:["Coffre du bâtisseur","Coffre du stratège","Coffre du rebelle","Coffre du gagnant"],endText:"Le coffre contenait des documents compromettants sur les dirigeants. L'affaire sort dans la presse : plus aucun grand club ne te touchera.",jackpotText:"Le coffre contenait les notes tactiques d'un génie et un réseau d'anciens joueurs prêts à t'aider.",
  fate:{kind:'exile',icon:'🕳️',label:"Mis·e au ban",text:"L'affaire des archives te colle à la peau. Seuls les clubs amateurs et la deuxième division accepteront encore ton nom sur un contrat."}},
 {id:'tirage',icon:'🎟️',title:"Le tirage au sort truqué",text:"Un intermédiaire te propose de choisir toi-même l'adversaire du prochain tour de Coupe. Quatre boules, un choix.",choices:["Boule 1","Boule 2","Boule 3","Boule 4"],endText:"La combine est révélée. Radiation à vie de tout banc de touche.",jackpotText:"Le tirage tombe parfaitement et personne ne saura jamais rien. La saison devient triomphale.",
  fate:{kind:'banned'}},
];

/* Arnaques du mercato (révélées à l'arrivée d'une pépite douteuse) */
const SCAMS=[
 {id:'age',label:"Faux âge",text:"Son passeport disait 18 ans. Son genou en a 27. Le niveau est bien plus bas qu'annoncé.",ratingMult:.82,ageAdd:5},
 {id:'video',label:"Vidéo YouTube montée",text:"Les vingt dribbles de la vidéo venaient de vingt matchs différents. Le reste du temps, il marche.",ratingMult:.78,minYear:2006},
 {id:'blessure',label:"Blessure cachée",text:"La visite médicale expédiée n'a pas vu le ménisque. Six mois d'absence pour commencer.",injure:24},
 {id:'noshow',label:"Il ne s'est jamais présenté",text:"L'agent a encaissé l'acompte. Le joueur, lui, n'a jamais existé sous ce nom.",vanish:true},
 {id:'agent',label:"Commission cachée",text:"L'agent avait négocié une commission équivalente au transfert. Le club l'apprend en recevant la facture.",extraCost:1},
 {id:'mental',label:"Mal du pays",text:"Trois semaines après son arrivée, il ne parle plus à personne et demande à rentrer.",ratingMult:.9,moraleHit:true},
 {id:'cousin',label:"Le cousin",text:"Le joueur filmé était son cousin. Le tien joue au même poste, avec deux fois moins de talent.",ratingMult:.7},
 {id:'doublon',label:"Vendu deux fois",text:"Un autre club possède aussi ses droits. Le tribunal tranchera dans un an ; en attendant, il ne joue pas.",injure:40},
];

/* Personnalités de présidents */
const PRESIDENTS=[
 {id:'patient',name:"le président patient",desc:"Il croit aux projets longs et déteste licencier.",tolerance:1.3,objMult:1},
 {id:'impulsif',name:"le président impulsif",desc:"Trois défaites et il pense déjà à ton successeur.",tolerance:.7,objMult:1},
 {id:'ambitieux',name:"le président ambitieux",desc:"Il veut plus que ce que le club peut, chaque saison.",tolerance:.9,objMult:.8},
 {id:'comptable',name:"le président comptable",desc:"Le bilan financier passe avant le classement.",tolerance:1,objMult:1.1,moneyFocus:true},
 {id:'romantique',name:"le président romantique",desc:"Il veut du beau jeu et des jeunes du cru, quitte à perdre.",tolerance:1.15,objMult:1.1,styleFocus:true},
 {id:'etranger',name:"le propriétaire étranger",desc:"Il regarde les matchs à 6 000 km et licencie par visioconférence.",tolerance:.8,objMult:.9},
];

/* ---------- Mode joueur·euse ---------- */
const PLAYER_INCIDENTS=[
 {id:'p-blessure',icon:'🩼',title:"Blessure sérieuse",text:"Une entorse grave. Le staff parle de trois mois.",choices:[
  {label:"Respecter le protocole",result:"Tu reviens complet, un peu plus tard.",effects:{injure:12,mental:2}},
  {label:"Revenir en avance",result:"Tu joues, tu rechutes deux fois.",effects:{injure:18,corps:-8,supporters:2}},
  {label:"Se soigner à l'étranger",result:"Une clinique miracle, une facture salée.",effects:{injure:8,money:-.15,corps:-2}}]},
 {id:'p-geant',icon:'📞',title:"Un géant t'appelle en janvier",text:"Un super-club veut te recruter au mercato d'hiver. Ton club refuse de te vendre.",minYear:2000,choices:[
  {label:"Forcer le transfert",result:"Tu boudes trois semaines, le transfert capote, les supporters t'en veulent.",effects:{supporters:-8,entourage:3,coachTrust:-8,pressure:6,reputation:2}},
  {label:"Rester pro et attendre l'été",result:"Une saison exemplaire, et un contact chaud pour l'été.",effects:{coachTrust:5,mental:2,reputation:2,bigOfferNext:true}},
  {label:"Prolonger avec ton club",result:"Le club double ton salaire. Le géant passe à autre chose.",effects:{money:.3,supporters:5,vestiaire:2}}]},
 {id:'p-coach',icon:'🥊',title:"Clash avec le coach",text:"Remplacé·e à la mi-temps trois fois de suite, tu exploses en zone mixte.",choices:[
  {label:"S'excuser publiquement",result:"Le coach te reprend, l'incident est clos.",effects:{coachTrust:2,mental:1,reputation:1}},
  {label:"Persister",result:"Mise à l'écart d'un mois, mais ton agent s'active.",effects:{coachTrust:-12,minutes:-.2,entourage:3,supporters:2}},
  {label:"Régler ça en privé",result:"Une discussion d'adultes. Tu retrouves ta place.",effects:{coachTrust:6,mental:2}}]},
 {id:'p-video',icon:'📱',title:"Vidéo de soirée",text:"Une vidéo de toi dansant sur une table à 4 h du matin, la veille d'un match, fait le tour du pays.",minYear:2005,choices:[
  {label:"Assumer avec humour",result:"Les fans adorent, le coach beaucoup moins.",effects:{supporters:5,coachTrust:-5,reputation:-2}},
  {label:"S'excuser et payer l'amende",result:"Sobre et efficace.",effects:{money:-.05,coachTrust:1}},
  {label:"Nier",result:"Personne ne te croit.",effects:{reputation:-5,coachTrust:-4,mental:-2}}]},
 {id:'p-selection',icon:'🇫🇷',title:"Pré-liste de la sélection",text:"Tu figures sur une pré-liste nationale. Le sélectionneur veut te voir à un autre poste.",choices:[
  {label:"Accepter de changer de poste",result:"Une adaptation difficile, mais des portes s'ouvrent.",effects:{minutes:-.05,technique:2,selectionBoost:10}},
  {label:"Rester à ton poste",result:"Tu joues ton meilleur football, la sélection attendra.",effects:{minutes:.05,selectionBoost:-4}},
  {label:"Demander conseil à ton agent",result:"Il négocie un compromis avec ton club.",effects:{entourage:2,selectionBoost:4}}]},
 {id:'p-pub',icon:'💰',title:"Contrat publicitaire",text:"Une marque te propose une fortune pour des spots ridicules.",minYear:1975,choices:[
  {label:"Signer",result:"Le compte en banque explose, la crédibilité un peu moins.",effects:{money:.4,supporters:3,reputation:-2,pressure:2}},
  {label:"Refuser",result:"Ton agent pleure.",effects:{entourage:-3,reputation:2}},
  {label:"Signer avec une marque locale à la place",result:"Moins d'argent, plus de sympathie.",effects:{money:.08,supporters:5}}]},
 {id:'p-confiance',icon:'🧠',title:"Baisse de confiance",text:"Dix matchs sans marquer, sans passe décisive, sans sourire.",choices:[
  {label:"Voir un préparateur mental",result:"Deux séances, et le déclic.",effects:{mental:4,forme:2,money:-.02}},
  {label:"S'entraîner encore plus",result:"Le corps encaisse, la tête un peu moins.",effects:{physique:2,corps:-4}},
  {label:"Demander une semaine de repos",result:"Le coach comprend. Tu reviens plus frais·che.",effects:{forme:5,coachTrust:-2}}]},
 {id:'p-mentor',icon:'🤝',title:"Un jeune te demande de l'aide",text:"Un gamin de 17 ans du centre te prend pour modèle.",choices:[
  {label:"Devenir son mentor",result:"Il progresse, et toi aussi : expliquer, c'est comprendre.",effects:{mental:3,vestiaire:5,reputation:2}},
  {label:"Quelques conseils",result:"Un geste apprécié.",effects:{vestiaire:2}},
  {label:"L'ignorer, la concurrence c'est la concurrence",result:"Il prend ta place deux ans plus tard.",effects:{vestiaire:-3,mental:-1}}]},
 {id:'p-capitaine',icon:'🎖️',title:"Le brassard",text:"Le coach hésite entre toi et le vétéran du vestiaire pour le brassard de capitaine.",choices:[
  {label:"Le demander clairement",result:"Tu l'obtiens. Le vétéran ne te parle plus.",effects:{coachTrust:3,vestiaire:-4,mental:3,pressure:4,reputation:2}},
  {label:"Soutenir le vétéran",result:"Le vestiaire t'adopte. Ton tour viendra.",effects:{vestiaire:7,mental:1}},
  {label:"Laisser le coach décider",result:"Il choisit le vétéran, puis toi six mois plus tard.",effects:{coachTrust:2,vestiaire:2}}]},
 {id:'p-agent-vereux',icon:'🕶️',title:"Ton agent joue double jeu",text:"Tu découvres que ton agent a touché une commission pour t'envoyer dans un club qui ne te voulait pas.",minYear:1990,choices:[
  {label:"Le virer et prendre un grand agent",result:"Un agent de stars te représente. Il demande beaucoup.",effects:{entourage:8,money:-.1,reputation:1}},
  {label:"Le virer et te gérer seul",result:"Personne ne t'appelle plus. Tu apprends le métier.",effects:{entourage:-6,mental:3}},
  {label:"Fermer les yeux",result:"Il continue, toi aussi.",effects:{entourage:-2,money:.05}}]},
 {id:'p-famille',icon:'👶',title:"Naissance",text:"Ton premier enfant naît la nuit précédant un quart de finale.",once:true,kid:true,choices:[
  {label:"Rester à la maternité",result:"Le coach comprend. Ou pas.",effects:{coachTrust:-3,entourage:8,mental:4,pressure:-4}},
  {label:"Jouer et repartir",result:"Un match héroïque et une nuit sans sommeil.",effects:{coachTrust:4,supporters:4,corps:-2,entourage:2}}]},
 {id:'p-rival',icon:'🥊',title:"Ton concurrent au poste te provoque",text:"Le joueur qui joue à ta place te traite de « touriste » devant le groupe.",choices:[
  {label:"Répondre sur le terrain",result:"Trois semaines d'entraînement enragé. Le coach remarque.",effects:{minutes:.1,physique:1,mental:2,vestiaire:-2}},
  {label:"L'ignorer",result:"Le groupe respecte ton calme.",effects:{vestiaire:3,mental:1}},
  {label:"Le remettre à sa place devant tout le monde",result:"Une bagarre évitée de justesse.",effects:{vestiaire:-5,coachTrust:-3,reputation:-1,mental:2}}]},
 {id:'p-dopage',icon:'💊',title:"Le complément miracle",text:"Un préparateur extérieur te propose un produit « légal » pour récupérer plus vite.",choices:[
  {label:"Refuser",result:"Prudence. Le corps suit son rythme.",effects:{reputation:1}},
  {label:"Accepter après vérification",result:"Le produit est bien légal. Il ne sert presque à rien.",effects:{forme:1,money:-.02}},
  {label:"Accepter sans vérifier",result:"Contrôle positif six mois plus tard.",effects:{injure:30,reputation:-15,coachTrust:-10,supporters:-8}}]},
 {id:'p-tribunes',icon:'📣',title:"Sifflé par ton propre public",text:"Après un penalty raté, le stade te siffle pendant vingt minutes.",gauge:'supporters',choices:[
  {label:"Répondre par un geste après le prochain but",result:"Doigt sur la bouche. Le stade se divise.",effects:{supporters:-4,mental:3,reputation:2}},
  {label:"Aller saluer le parcage en fin de match",result:"Un geste d'humilité qui retourne les tribunes.",effects:{supporters:8,mental:1}},
  {label:"Demander un transfert",result:"Ton agent s'active, le club te met en vente.",effects:{supporters:-6,entourage:3,coachTrust:-5}}]},
 {id:'p-journal',icon:'📰',title:"Interview qui dérape",text:"Tu as dit qu'un coéquipier « ne méritait pas sa place ». Le journal titre dessus.",choices:[
  {label:"Assumer",result:"Le vestiaire se fracture. Le coach te soutient en privé.",effects:{vestiaire:-7,coachTrust:2,reputation:1}},
  {label:"Accuser le journaliste",result:"Le journaliste publie l'enregistrement.",effects:{reputation:-5,vestiaire:-3}},
  {label:"S'excuser devant le groupe",result:"Un moment gênant, puis oublié.",effects:{vestiaire:2,mental:1}}]},
 {id:'p-chirurgie',icon:'🏥',title:"L'opération ou pas",text:"Une douleur chronique au genou. Le chirurgien conseille d'opérer, ce qui coûterait quatre mois.",choices:[
  {label:"Opérer maintenant",result:"Quatre mois d'absence, un genou neuf.",effects:{injure:16,corps:12}},
  {label:"Infiltrations et on verra",result:"Tu joues, la douleur revient.",effects:{corps:-6,forme:-2}},
  {label:"Reporter à l'été",result:"Un compromis raisonnable.",effects:{corps:-2,injure:4}}]},
 {id:'p-ballon',icon:'⚽',title:"Le penalty décisif",text:"Dernière minute du derby. Le tireur habituel est sorti. Le coach te regarde.",choices:[
  {label:"Prendre le ballon",result:"Le stade retient son souffle.",effects:{penaltyRoll:true}},
  {label:"Le laisser au capitaine",result:"Le capitaine marque. Tu regrettes un peu.",effects:{vestiaire:2,mental:-1}}]},
 {id:'p-loyer',icon:'🏠',title:"L'appartement de fonction",text:"Le club te loge dans un appartement luxueux. La presse parle de « caprice de star ».",minYear:1990,choices:[
  {label:"Assumer",result:"Tu es une star, après tout.",effects:{reputation:-1,pressure:1}},
  {label:"Déménager dans un quartier populaire",result:"Les supporters t'adoptent définitivement.",effects:{supporters:6,entourage:-2}},
  {label:"Le prêter à un jeune du centre",result:"Un geste qui fait parler.",effects:{vestiaire:5,reputation:2}}]},
 {id:'p-jeu',icon:'🎲',title:"Nuits de poker",text:"Des parties de poker à gros enjeux entre coéquipiers. Tu perds gros.",minYear:1980,choices:[
  {label:"Arrêter net",result:"Tu évites la spirale.",effects:{mental:2,vestiaire:-1}},
  {label:"Continuer pour se refaire",result:"Tu perds davantage.",effects:{money:-.2,mental:-3,pressure:4}},
  {label:"Dénoncer au coach",result:"Les parties s'arrêtent. Tu es le mouchard.",effects:{vestiaire:-8,coachTrust:3}}]},
 {id:'p-froid',icon:'❄️',title:"Match dans la boue",text:"Un match de Coupe sur un terrain gelé, contre un club amateur. Le coach te demande de jouer.",maxYear:1995,choices:[
  {label:"Jouer à fond",result:"Tu marques deux buts dans la boue. Légende locale.",effects:{supporters:4,corps:-3,coachTrust:3}},
  {label:"Te ménager",result:"Le club amateur gagne. Tu es désigné coupable.",effects:{coachTrust:-4,supporters:-3}},
  {label:"Demander à être remplaçant",result:"Le coach accepte. Tu entres et sauves le match.",effects:{coachTrust:1,mental:1}}]},
];

const PLAYER_HAPPENINGS=[
 {id:'ph-vacances',icon:'🏝️',title:"Été de fête",text:"Ibiza, yachts, photos partout. Ton agent te conseille la discrétion.",choices:[
  {label:"Profiter",result:"Une rentrée difficile.",effects:{forme:-8,supporters:2,reputation:-2,mental:2}},
  {label:"Trois jours puis stage",result:"Le compromis du pro : personne n'est tout à fait content.",effects:{forme:-2,mental:1,entourage:-2}},
  {label:"Rester au vert tout l'été",result:"Tu reprends en avance, sans avoir vu personne.",effects:{forme:5,coachTrust:3,entourage:-6}}]},
 {id:'ph-mariage',once:true,icon:'💍',title:"Mariage médiatique",text:"Ton mariage attire les magazines et une chaîne de télé.",minYear:1990,choices:[
  {label:"Vendre l'exclusivité",result:"Un chèque, des photos et quelques moqueries.",effects:{money:.3,reputation:-2,entourage:3}},
  {label:"Mariage privé",result:"Une journée à toi, payée par toi, et des magazines vexés.",effects:{entourage:7,mental:2,money:-.08,supporters:-3}}]},
 {id:'ph-livre',icon:'📚',title:"Autobiographie",text:"Un éditeur veut raconter ta vie, à 26 ans.",choices:[
  {label:"Accepter",result:"Des chapitres sur tes coachs qui ne passent pas.",effects:{money:.1,reputation:2,coachTrust:-3}},
  {label:"Attendre la retraite",result:"Sage. L'éditeur ira voir un autre joueur, et le chèque avec lui.",effects:{mental:1,reputation:-2}}]},
 {id:'ph-fondation',once:true,icon:'🤲',title:"Créer une fondation",text:"Un ami te propose de créer une fondation pour les enfants de ton quartier d'origine.",choices:[
  {label:"Se lancer",result:"Un engagement qui te dépasse.",effects:{reputation:5,supporters:4,money:-.1,pressure:2}},
  {label:"Donner sans s'exposer",result:"Discret.",effects:{money:-.05,mental:2}},
  {label:"Plus tard",result:"Le foot d'abord. Le quartier te l'a entendu dire.",effects:{reputation:-3,entourage:-3}}]},
 {id:'ph-blessure-ete',icon:'🏄',title:"Accident de vacances",text:"Un jet-ski, un rocher, une cheville.",choices:[
  {label:"Le cacher au club",result:"La reprise révèle tout.",effects:{injure:6,coachTrust:-5,corps:-3}},
  {label:"Prévenir immédiatement",result:"Le club gère la rééducation.",effects:{injure:4,coachTrust:2}}]},
 {id:'ph-contrat',icon:'📝',title:"Renégociation de contrat",text:"Ton agent veut renégocier ton contrat un an avant la fin.",choices:[
  {label:"Exiger une grosse hausse",result:"Le club cède, mais te met sur la liste des transferts en cas de baisse.",effects:{money:.25,coachTrust:-3,entourage:3}},
  {label:"Prolonger raisonnablement",result:"Le club est content. Ton agent et tes proches espéraient mieux.",effects:{money:.1,coachTrust:3,supporters:2,entourage:-5}},
  {label:"Attendre d'être libre",result:"L'arrêt Bosman te tend les bras.",minYear:1996,effects:{entourage:4,bigOfferNext:true}}]},
 {id:'ph-jeux',icon:'🎮',title:"Jeu vidéo",text:"Un éditeur veut ton visage sur la jaquette du jeu de l'année.",minYear:1996,choices:[
  {label:"Accepter",result:"Des millions d'enfants jouent avec toi.",effects:{money:.2,supporters:5,reputation:2}},
  {label:"Refuser",result:"Le foot ne se joue pas sur un canapé. Les enfants joueront avec un autre visage.",effects:{reputation:1,supporters:-4,money:-.05}}]},
 {id:'ph-service',icon:'🎖️',title:"Service militaire",text:"L'armée t'appelle pour dix mois. Le bataillon de Joinville accueille les sportifs.",maxYear:1996,choices:[
  {label:"Joinville",result:"Tu t'entraînes avec les meilleurs jeunes du pays, loin de ton club et de chez toi.",effects:{physique:3,mental:2,vestiaire:2,coachTrust:-5,entourage:-4}},
  {label:"Demander un report",result:"Accordé. La presse en parle.",effects:{reputation:-2}}]},
 {id:'ph-transfert-raté',icon:'✈️',title:"Le transfert avorté",text:"Tu étais dans l'avion pour signer ailleurs. Le fax n'est jamais arrivé.",minYear:1990,choices:[
  {label:"Revenir la tête haute",result:"Le vestiaire t'accueille avec des blagues.",effects:{vestiaire:2,mental:2,coachTrust:-2}},
  {label:"Bouder",result:"Six mois de tension.",effects:{coachTrust:-6,minutes:-.1,mental:-2}}]},
 {id:'ph-reconversion',icon:'🎓',title:"Préparer l'après",text:"La fédération propose une formation d'entraîneur en parallèle de ta carrière.",choices:[
  {label:"S'inscrire",result:"Tu regardes le jeu autrement. Tes soirées y passent.",effects:{mental:3,pressure:2,coachTrust:2,entourage:-5,physique:-1}},
  {label:"Plus tard",result:"Il reste du temps. C'est ce que disent tous ceux qui n'en ont plus.",effects:{mental:-2}}]},
 {id:'ph-agent',icon:'🧾',title:"Ton agent te lâche",text:"Celui qui t'a trouvé à 15 ans préfère s'occuper d'un plus jeune. Trois agences t'appellent déjà.",choices:[
  {label:"Signer avec la plus grosse agence",result:"Des portes s'ouvrent, un pourcentage aussi.",effects:{entourage:6,money:-.12,supporters:2}},
  {label:"Confier ça à un proche",result:"Il apprend le métier sur ton dos. Vous y croyez tous les deux.",effects:{entourage:9,money:-.06,mental:-2,coachTrust:-2}},
  {label:"Te débrouiller seul·e",result:"Tu négocies toi-même, entre deux séances.",effects:{money:.08,mental:-3,entourage:-6,forme:-2}}]},
 {id:'ph-quartier',icon:'🏙️',title:"Le quartier t'attend",text:"Le club de ton enfance veut un tournoi à ton nom. Ta rue veut te voir. Tout le monde veut quelque chose.",choices:[
  {label:"Financer et venir tout l'été",result:"Un été entier de photos, d'embrassades et zéro repos.",effects:{supporters:8,entourage:7,money:-.15,forme:-6}},
  {label:"Envoyer un chèque",result:"Le tournoi a lieu. On note que tu n'es pas venu·e.",effects:{money:-.08,entourage:-4,supporters:2}},
  {label:"Ne pas répondre",result:"On te trouve changé·e. Ce n'est peut-être pas faux.",effects:{entourage:-9,supporters:-4,mental:2,forme:3}}]},
 {id:'ph-pari',icon:'🎰',title:"Le pari de l'ami d'enfance",text:"Un ami te demande juste « si tu joues dimanche ». Il a de l'argent en jeu.",choices:[
  {label:"Lui dire et lui demander d'arrêter",result:"Il arrête. Ou il dit qu'il arrête.",effects:{entourage:3,mental:-2},
   seed:{in:2,icon:'⚖️',title:"L'enquête sur les paris",text:"Ton nom apparaît dans les relevés d'un ami. Tu n'as rien touché ; tu passeras quand même devant la commission.",effects:{reputation:-7,mental:-4,coachTrust:-5}}},
  {label:"Couper les ponts net",result:"Tu protèges ta carrière et tu perds vingt ans d'amitié.",effects:{entourage:-10,mental:3,reputation:2}},
  {label:"Faire semblant de ne pas comprendre",result:"Tu changes de sujet. Il rappellera.",effects:{entourage:-2,mental:-3}}]},
 {id:'ph-sponsor',icon:'👟',title:"L'équipementier veut l'exclusivité",text:"Un contrat à sept chiffres, à condition de ne plus jamais être vu avec une autre marque. Ni toi, ni ta famille.",minYear:1990,choices:[
  {label:"Signer l'exclusivité totale",result:"Le chèque de ta vie, et une liste de choses que tu ne peux plus faire.",effects:{money:.4,supporters:4,entourage:-7,mental:-2}},
  {label:"Négocier une clause souple",result:"Moins d'argent, plus d'air.",effects:{money:.15,entourage:2}},
  {label:"Rester libre",result:"Tu portes ce que tu veux. Ton agent ne s'en remet pas.",effects:{entourage:-5,mental:3,money:-.05}}]},
 {id:'ph-langue',icon:'🗣️',title:"La langue du pays",text:"Six mois à l'étranger, et tu commandes toujours ton café en montrant du doigt.",choices:[
  {label:"Cours intensifs tous les soirs",result:"Le vestiaire te voit autrement. Tes soirées disparaissent.",effects:{vestiaire:9,mental:3,coachTrust:4,entourage:-6,forme:-2}},
  {label:"Rester avec les autres expatriés",result:"Confortable, et une bulle dont tu ne sors plus.",effects:{entourage:5,vestiaire:-6,coachTrust:-3}},
  {label:"Un interprète pour tout",result:"Pratique. On finit par te parler à travers quelqu'un d'autre.",effects:{money:-.04,vestiaire:-3,mental:-1}}]},
 {id:'ph-enfant2',icon:'👶',title:"La famille s'agrandit",kid:true,when:()=>(state.kids||0)>=1,
  text:"Un enfant de plus, en plein mois de mars, à quatre jours d'un match décisif. Tu connais déjà les nuits qui suivent.",choices:[
  {label:"Tout arrêter deux semaines",result:"Le club comprend à moitié, le coach retient surtout ton absence.",effects:{entourage:12,coachTrust:-6,forme:-4,mental:3}},
  {label:"Jouer le match, rentrer la nuit",result:"Le compromis de tous les pères du métier. Il coûte des deux côtés.",effects:{entourage:-4,forme:-2,mental:-2}},
  {label:"Faire venir toute la famille près du club",result:"Tout le monde déménage pour toi. Personne ne dit rien.",effects:{entourage:6,money:-.12,mental:2}}]},
 {id:'ph-reseaux',icon:'📱',title:"Ton compte explose",text:"Une vidéo de toi tourne partout. Deux millions d'abonnés en une semaine, et autant d'avis sur ta vie.",minYear:2012,choices:[
  {label:"En faire un vrai métier parallèle",result:"Des revenus, une image, et une notification toutes les six secondes.",effects:{money:.25,supporters:9,mental:-5,forme:-3}},
  {label:"Déléguer les comptes à un community manager",result:"Lisse, efficace, et plus tout à fait toi.",effects:{supporters:4,money:.06,entourage:-3}},
  {label:"Tout couper",result:"Le silence fait du bien. Les sponsors trouvent ça dommage.",effects:{mental:6,supporters:-7,money:-.1}}]},
 {id:'ph-fisc',icon:'⚖️',title:"Le contrôle fiscal",text:"Un montage que ton conseiller t'avait juré « parfaitement légal » intéresse beaucoup l'administration.",minYear:1996,choices:[
  {label:"Tout régulariser immédiatement",result:"Une somme énorme, un dossier clos, un conseiller viré.",effects:{money:-.45,mental:4,reputation:2,entourage:-4}},
  {label:"Te battre devant les tribunaux",result:"Des années de procédure et ton nom dans tous les journaux.",effects:{mental:-7,reputation:-6,supporters:-4,money:-.1}},
  {label:"Laisser ton entourage gérer",result:"On te dit que c'est réglé. On te l'a déjà dit.",effects:{entourage:4,mental:-3},
   seed:{in:3,icon:'📉',title:"Le redressement",text:"Ce n'était pas réglé. La note a triplé, et elle est publique.",effects:{money:-.6,reputation:-8,mental:-6}}}]},
 {id:'ph-academie',icon:'🏫',title:"Une école à ton nom",text:"Des investisseurs veulent ouvrir une académie dans ton pays d'origine.",minYear:2000,choices:[
  {label:"T'impliquer vraiment",result:"Des gamins formés pour de bon, et des allers-retours tout l'été.",effects:{supporters:6,entourage:5,money:-.2,forme:-4,mental:3}},
  {label:"Prêter ton nom seulement",result:"Une signature, un chèque, une académie que tu ne contrôles pas.",effects:{money:.12,reputation:-4}},
  {label:"Refuser tant que tu joues",result:"Plus tard. Les investisseurs trouveront un autre nom d'ici là.",effects:{forme:3,supporters:-3}}]},
 {id:'ph-amical',icon:'✈️',title:"Le match amical à l'autre bout du monde",text:"La sélection t'appelle pour deux amicaux, 22 000 km et un retour la veille du choc.",choices:[
  {label:"Y aller et tout jouer",result:"Deux sélections de plus, et des jambes en coton au retour.",effects:{caps:2,supporters:5,forme:-8,corps:-4,coachTrust:-3}},
  {label:"Y aller et demander à jouer une mi-temps",result:"Le sélectionneur accepte sans enthousiasme.",effects:{caps:1,forme:-4,supporters:2}},
  {label:"Te déclarer forfait",result:"Ton club respire. La sélection note ton nom quelque part.",effects:{coachTrust:6,forme:3,supporters:-5,selectionBoost:-15}}]},
];

/* ---------- Les situations : ce que ta saison rend vrai ----------
   Retour du propriétaire (26/09/2026) : « je fais deux saisons pleines où je joue
   zéro match, c'est quand même peu commun ; ces années-là il faut qu'on arrive à
   faire passer le temps autrement » et « au bout d'un moment le club n'est pas censé
   vouloir le garder, son niveau a diminué, il faut penser aux prochaines générations…
   on ne ressent pas cette continuité dans le jeu ».
   Une situation ne se tire que quand elle est vraie (`when`), et elle passe devant le
   reste du sac : c'est ce qui est en train de t'arriver, pas une anecdote. */
const PLAYER_SITUATIONS=[
 {id:'ps-tribune',icon:'🪑',title:"Des semaines sans une minute",when:()=>pBenchRun()>=5,
  text:()=>`${pBenchRun()} matchs de suite sans entrer. Tu t'entraînes tous les jours pour des journées qui ne t'appartiennent pas.`,choices:[
  {label:"Demander une explication au coach",result:"Il te parle franchement : tu n'es pas dans ses plans du moment, mais il respecte la démarche.",effects:{coachTrust:4,mental:-1,pressure:3}},
  {label:"Rester après chaque séance",result:"Personne ne te voit jouer, mais tout le staff te voit travailler.",effects:{technique:2,physique:1,corps:-3,coachTrust:2}},
  {label:"Faire passer le message par ton agent",result:"Le vestiaire apprend que tu veux partir avant le coach.",effects:{coachTrust:-6,vestiaire:-4,entourage:2,minutes:-.05}},
  {label:"Mettre la tête ailleurs",result:"La famille, la maison, les gens : ces semaines-là servent à autre chose.",effects:{entourage:8,mental:2,coachTrust:-3,forme:-4}}]},
 {id:'ps-tribune-long',icon:'🌫️',title:"Une saison qui passe sans toi",when:()=>pShareSoFar()!=null&&state.seasonStats.shares.length>=8&&pShareSoFar()<.12,
  text:()=>`On est en ${state.year+1} et tu as joué ${state.seasonStats.apps} match${state.seasonStats.apps>1?'s':''}. Une année de ta carrière est en train de disparaître.`,choices:[
  {label:"Prendre le club à la gorge en janvier",result:"Tu exiges de partir. Le club te répond qu'il verra en juin.",effects:{pressure:8,coachTrust:-4,supporters:-3,bigOfferNext:true}},
  {label:"Accepter l'année et bâtir la suivante",result:"Tu passes l'hiver à travailler pour un été où tu seras prêt·e.",effects:{technique:2,physique:2,mental:2,corps:-4,pressure:-4}},
  {label:"Vivre autre chose en attendant",result:"Un enfant qu'on emmène à l'école, des dimanches à la maison. Le foot attendra mai.",effects:{entourage:10,mental:3,physique:-2,coachTrust:-4}},
  {label:"T'enfermer là-dedans",result:"Tu ne parles plus à personne. Le corps tient, la tête non.",effects:{mental:-6,pressure:10,vestiaire:-5,entourage:-5,technique:1}}]},
 {id:'ps-corps',icon:'🦴',title:"Le corps ne suit plus",when:()=>pAge()>=33||(pAge()>=31&&state.gauges.corps<62),
  text:()=>`${pAge()} ans. Le préparateur te le dit sans détour : tu ne récupères plus comme avant, et ça se voit en fin de match.`,choices:[
  {label:"Changer de jeu : moins courir, mieux placer",result:"Tu joues dix mètres plus bas et tu touches plus de ballons.",effects:{technique:3,physique:-2,mental:2,corps:4}},
  {label:"Doubler la salle et les soins",result:"Le corps répond encore, à condition de ne plus jamais lâcher.",effects:{physique:2,corps:6,money:-.12,mental:-1}},
  {label:"Serrer les dents sans rien changer",result:"Tu tiens le rythme trois mois. Après, on verra.",effects:{corps:-8,forme:4,coachTrust:3,injure:2}}]},
 {id:'ps-depart',icon:'🚪',title:"Le club pense à la suite",when:()=>{const c=state.club; if(!c||pAge()<32) return false; const last=state.lastSeason; return pRating()<c.strength-1||pAge()>=34||(last&&last.note<6.4);},
  text:()=>`Le directeur sportif t'invite à déjeuner. « Tu sais où on en est : le club joue à ${state.club.strength} de niveau, et physiquement tu n'es plus au top. On construit pour les prochaines saisons. »`,choices:[
  {label:"Accepter un rôle de cadre qui joue peu",result:"Tu encadres les jeunes, tu joues les fins de match. Le vestiaire t'appelle « le patron ».",effects:{vestiaire:9,mental:2,minutes:-.12,coachTrust:5}},
  {label:"Répondre que tu te bats pour ta place",result:"Le coach n'a rien promis, mais il a noté.",effects:{pressure:8,coachTrust:2,mental:-2,physique:1}},
  {label:"Demander à partir maintenant",result:"Tu préfères choisir ta sortie plutôt qu'on te la donne.",effects:{coachTrust:-8,supporters:-4,entourage:3,bigOfferNext:true}},
  {label:"Parler d'après : le diplôme, le club, la suite",result:"On te propose un rôle au club quand tu raccrocheras. Ça change le regard sur les mois qui restent.",effects:{mental:4,entourage:5,pressure:-8,coachTrust:-2}}]},
 {id:'ps-jeune',icon:'🐣',title:"Le jeune qui prend ta place",when:()=>pAge()>=31&&!!state.club,
  text:"Un gamin de dix-huit ans à ton poste s'entraîne avec le groupe. Tout le monde a compris ce que ça veut dire.",choices:[
  {label:"Le prendre sous ton aile",result:"Tu lui apprends le métier. Il te prendra ta place plus vite, et mieux.",effects:{vestiaire:8,supporters:3,mental:2,minutes:-.08}},
  {label:"Lui montrer qu'il n'est pas prêt",result:"Deux séances où tu le passes en boucle. Le message est reçu.",effects:{coachTrust:4,vestiaire:-4,physique:1,corps:-3}},
  {label:"L'ignorer complètement",result:"Ce n'est pas ton problème. Le staff trouve ça petit.",effects:{coachTrust:-3,vestiaire:-3,mental:-1}}]},
];

const PLAYER_DILEMMAS=[
 {gauge:'corps',icon:'🩻',title:"Le corps parle",text:"Douleurs partout, sommeil cassé. Le préparateur propose un programme radical.",choices:[{label:"Suivre le programme",effects:{corps:10,forme:3,money:-.03}},{label:"Le suivre à moitié",effects:{corps:4}},{label:"Ignorer",effects:{corps:-5,injure:3}}]},
 {gauge:'corps',icon:'🥗',title:"Le nutritionniste",text:"Un nutritionniste veut bannir tes plats préférés.",choices:[{label:"Accepter",effects:{corps:8,mental:-1}},{label:"Compromis",effects:{corps:3}},{label:"Refuser",effects:{corps:-3,vestiaire:1}}]},
 {gauge:'vestiaire',icon:'🍻',title:"La soirée d'équipe",text:"Le capitaine organise une soirée pour ressouder le groupe.",choices:[{label:"Y aller et rester tard",effects:{vestiaire:9,forme:-3}},{label:"Passer une heure",effects:{vestiaire:4}},{label:"Ne pas venir",effects:{vestiaire:-5}}]},
 {gauge:'vestiaire',icon:'🎁',title:"Le cadeau du groupe",text:"Le vestiaire te reproche de ne jamais payer ta tournée.",choices:[{label:"Inviter tout le monde au restaurant",effects:{vestiaire:8,money:-.02}},{label:"Offrir des places à leurs familles",effects:{vestiaire:5}},{label:"Ignorer",effects:{vestiaire:-4}}]},
 {gauge:'supporters',icon:'🧒',title:"Séance de dédicaces",text:"Un supporter malade demande à te rencontrer.",choices:[{label:"Aller à l'hôpital",effects:{supporters:8,mental:2}},{label:"Envoyer un maillot",effects:{supporters:3}},{label:"Ignorer",effects:{supporters:-5}}]},
 {gauge:'supporters',icon:'🎤',title:"Le chant des ultras",text:"Les ultras ont composé un chant à ton nom, un peu vulgaire.",choices:[{label:"Le chanter avec eux",effects:{supporters:9,reputation:-2}},{label:"Remercier poliment",effects:{supporters:4}},{label:"Demander de l'arrêter",effects:{supporters:-6,reputation:2}}]},
 {gauge:'entourage',icon:'👪',title:"Les frères",text:"Tes frères veulent gérer tes affaires à la place de ton agent.",choices:[{label:"Leur faire confiance",effects:{entourage:6,money:-.1}},{label:"Un rôle limité",effects:{entourage:3}},{label:"Refuser",effects:{entourage:-5,mental:-1}}]},
 {gauge:'entourage',icon:'🚗',title:"La voiture de sport",text:"Ton entourage te pousse à acheter une voiture à 300 000 €.",choices:[{label:"L'acheter",effects:{entourage:4,money:-.3,reputation:-1}},{label:"Une voiture raisonnable",effects:{entourage:1}},{label:"Le bus",effects:{entourage:-3,supporters:3}}]},

 {gauge:'corps',icon:'💉',title:"L'infiltration",text:"Le genou ne passe pas. Une piqûre et tu joues la finale ; sans elle, tu la regardes.",choices:[
  {label:"Accepter l'infiltration",effects:{corps:-9,coachTrust:7,supporters:5,forme:2}},
  {label:"Refuser et soigner",effects:{corps:8,coachTrust:-7,supporters:-4}},
  {label:"Demander un deuxième avis",effects:{corps:3,coachTrust:-2,mental:-1}}]},
 {gauge:'corps',icon:'😴',title:"Les nuits qui ne comptent pas",text:"Tu dors cinq heures depuis trois mois. Le club a un capteur de sommeil ; tu l'as débranché.",choices:[
  {label:"Tout rebrancher et suivre le protocole",effects:{corps:9,physique:3,entourage:-6,mental:-1}},
  {label:"Voir un spécialiste en secret",effects:{corps:5,money:-.04,coachTrust:-2}},
  {label:"Tenir avec du café",effects:{corps:-7,forme:-3,mental:-3,technique:1}}]},
 {gauge:'corps',icon:'🧊',title:"Le protocole de récupération",text:"Bains glacés, caisson, kiné : deux heures de plus chaque jour, tous les jours.",choices:[
  {label:"Tout faire, sans exception",effects:{corps:11,physique:2,entourage:-7,mental:-2}},
  {label:"Trois fois par semaine",effects:{corps:5,entourage:-2}},
  {label:"Laisser tomber",effects:{corps:-6,entourage:4,mental:2}}]},
 {gauge:'vestiaire',icon:'🎽',title:"Le brassard",text:"Le coach hésite entre toi et un ancien pour le brassard. Il te demande ton avis, sincèrement.",choices:[
  {label:"Le réclamer",effects:{vestiaire:-6,mental:5,coachTrust:5,supporters:3}},
  {label:"Le laisser à l'ancien",effects:{vestiaire:9,mental:-2,coachTrust:-2}},
  {label:"Proposer un brassard tournant",effects:{vestiaire:4,coachTrust:-4,mental:1}}]},
 {gauge:'vestiaire',icon:'🤐',title:"La fuite dans la presse",text:"Une causerie du coach s'est retrouvée mot pour mot dans le journal. Le groupe cherche qui a parlé.",choices:[
  {label:"Dire ce que tu as vu",effects:{coachTrust:8,vestiaire:-11,reputation:2}},
  {label:"Te taire",effects:{vestiaire:7,coachTrust:-6}},
  {label:"Aller voir le coupable en privé",effects:{vestiaire:3,mental:-2,coachTrust:1}}]},
 {gauge:'vestiaire',icon:'🧒',title:"Le bizutage du jeune",text:"Les anciens veulent humilier un gamin de 17 ans « comme on l'a tous été ».",choices:[
  {label:"Y mettre fin devant tout le monde",effects:{vestiaire:-8,mental:5,reputation:4,coachTrust:3}},
  {label:"Participer mollement",effects:{vestiaire:5,mental:-4}},
  {label:"Aller rassurer le jeune après",effects:{vestiaire:-1,mental:2,coachTrust:1}}]},
 {gauge:'supporters',icon:'📸',title:"Le selfie de trop",text:"Après une défaite, un supporter te coince au parking pour une photo. Tu es à bout.",choices:[
  {label:"Prendre la photo et discuter dix minutes",effects:{supporters:8,mental:-4,entourage:-2}},
  {label:"Refuser poliment",effects:{supporters:-5,mental:3}},
  {label:"Passer sans répondre",effects:{supporters:-9,mental:1,reputation:-3}}]},
 {gauge:'supporters',icon:'🧣',title:"Le maillot jeté",text:"Après une élimination, un supporter te rend ton maillot en pleine figure devant les caméras.",choices:[
  {label:"Aller t'excuser devant le parcage",effects:{supporters:10,mental:-3,vestiaire:-4}},
  {label:"Répondre sèchement",effects:{supporters:-9,vestiaire:5,reputation:-2}},
  {label:"Ramasser le maillot et partir",effects:{supporters:-2,mental:-2}}]},
 {gauge:'supporters',icon:'🎪',title:"L'animation d'avant-match",text:"Le club veut que tu animes la rencontre avec les abonnés, deux heures avant le coup d'envoi.",choices:[
  {label:"Accepter à chaque match",effects:{supporters:9,forme:-4,coachTrust:-3}},
  {label:"Une fois par mois",effects:{supporters:4,forme:-1}},
  {label:"Refuser, c'est un jour de match",effects:{supporters:-6,forme:3,coachTrust:2}}]},
 {gauge:'entourage',icon:'💸',title:"Le prêt qu'on ne te rendra pas",text:"Un cousin monte une affaire et te demande de quoi la lancer. Tu sais comment ça finit.",choices:[
  {label:"Donner la somme sans condition",effects:{entourage:9,money:-.22}},
  {label:"Proposer un vrai contrat",effects:{entourage:-4,money:-.08,mental:2}},
  {label:"Refuser",effects:{entourage:-10,money:.02,mental:-2}}]},
 {gauge:'entourage',icon:'🏠',title:"La maison pour tes parents",text:"Ils n'ont jamais rien demandé. C'est bien pour ça que tout le monde attend que tu le fasses.",choices:[
  {label:"Acheter la maison comptant",effects:{entourage:12,money:-.5,mental:3}},
  {label:"Les aider à emprunter",effects:{entourage:4,money:-.1}},
  {label:"Attendre un plus gros contrat",effects:{entourage:-7,money:.05,mental:-3}}]},
 {gauge:'entourage',icon:'📵',title:"Le groupe de la bande",text:"Trente messages par jour, des demandes, des reproches, et ton téléphone qui vibre jusqu'à 2 h du matin.",choices:[
  {label:"Quitter le groupe",effects:{entourage:-9,mental:7,forme:3}},
  {label:"Couper les notifications la nuit",effects:{entourage:-2,mental:4}},
  {label:"Répondre à tout le monde",effects:{entourage:7,mental:-5,forme:-3}}]},
];

/* Carrefours du mode joueur·euse : les clés renvoient à PFOCUS_AREAS (player.js) */
const PLAYER_CROSSROADS=[
 {id:'px-reprise',icon:'📋',title:"La reprise",text:"Premier jour, tests physiques, et un coach qui note tout. Ce que tu travailles maintenant tiendra jusqu'en mai.",phase:0,menu:['technique','physique','tete']},
 {id:'px-agent',icon:'🧾',title:"La réunion avec ton agent",text:"Il pose trois dossiers sur la table : un sponsor, un préparateur, et un billet d'avion pour rentrer chez toi.",menu:['image','proches','technique']},
 {id:'px-concurrent',icon:'🥊',title:"Le recruté à ton poste",text:"Le club a signé quelqu'un dans ton couloir, plus cher que toi. La saison va se jouer entre vous deux.",phase:0,menu:['technique','physique','image']},
 {id:'px-coach',icon:'🧢',title:"Le nouveau coach",text:"Il ne t'a jamais vu jouer et il a trois semaines pour se faire un avis.",phase:0,menu:['tete','technique','proches']},
 {id:'px-treve',icon:'❄️',title:"La trêve",text:"Quinze jours. Le kiné a un programme, ta famille a des projets, et ta tête a besoin de silence.",phase:2,menu:['physique','proches','tete']},
 {id:'px-banc',icon:'🪑',title:"Le banc",text:"Trois matchs sans entrer. Le coach dit qu'il attend « autre chose » de toi, sans préciser quoi.",menu:['technique','tete','physique']},
 {id:'px-ete',icon:'☀️',title:"Les semaines de juillet",text:"Pas de match, pas d'excuse. Trois manières de passer l'été, une seule possible.",phase:0,menu:['proches','image','physique']},
 {id:'px-retour',icon:'🩹',title:"Le retour de blessure",text:"Tu rejoues dans six semaines. Ce que tu fais de ces six semaines décide de la suite.",menu:['physique','tete','proches']},
 {id:'px-sprint',icon:'🏁',title:"Les dix dernières journées",text:"Tout se joue maintenant : le classement, ton contrat, la sélection.",phase:3,menu:['physique','technique','image']},
 {id:'px-soir',icon:'🌙',title:"Les soirs après l'entraînement",text:"Quatre heures libres chaque jour. À la fin de l'année, elles auront fait quelqu'un de toi.",menu:['tete','proches','image']},
];

const PLAYER_ROULETTES=[
 {id:'p-sorcier',icon:'🔮',title:"Le marabout",text:"Un homme t'aborde après l'entraînement : il peut « bénir » ta carrière. Quatre gris-gris sont posés sur la table.",choices:["Gris-gris rouge","Gris-gris noir","Gris-gris blanc","Gris-gris doré"],endText:"Le gris-gris était une escroquerie et l'homme un faux marabout. La police retrouve ta voiture dans un fossé. Fin de carrière.",jackpotText:"Coïncidence ou pas, tout te réussit désormais : buts, sélection, contrats."},
 {id:'p-contrat',icon:'📜',title:"Le contrat en blanc",text:"Un club mystérieux te fait signer un contrat sans montant. Quatre stylos, quatre encres.",choices:["Stylo bleu","Stylo noir","Stylo vert","Stylo rouge"],endText:"Le contrat te liait à vie à un club fantôme. Aucune fédération ne te laissera plus jouer.",jackpotText:"Le contrat était un contrat de star. Salaire triplé, primes et un rôle de titulaire garanti."},
 {id:'p-yacht',icon:'🛥️',title:"La soirée sur le yacht",text:"Un milliardaire t'invite sur son yacht. Quatre cabines, une seule est la bonne.",choices:["Cabine 1","Cabine 2","Cabine 3","Cabine 4"],endText:"La soirée finit dans les journaux, puis au tribunal. Ta carrière est terminée.",jackpotText:"Tu rencontres un propriétaire de club qui décide de bâtir son projet autour de toi."},
 {id:'p-pari',icon:'🎰',title:"La partie de cartes",text:"Une partie de cartes avec des inconnus, dans l'arrière-salle d'un bar. Quatre mains.",choices:["Main 1","Main 2","Main 3","Main 4"],endText:"Les inconnus travaillaient pour un réseau de paris truqués. Radiation à vie.",jackpotText:"Tu gagnes une fortune et l'amitié d'un agent qui change ta carrière."},
];

const PUNCHLINES={
 champion:["« Champion·ne. Les statues se sculptent avec ce genre de saison. »","« Le titre. Ce soir, personne ne dort dans la ville. »"],
 relegated:["« La descente. Le silence dans le vestiaire durera tout l'été. »","« Relégué·e. Le président ne répond plus au téléphone. »"],
 hit:["« Une saison qui donne envie de signer pour dix ans. »","« Les supporters ont retrouvé le sourire. Ça ne dure jamais, mais ça compte. »"],
 flop:["« Une saison à oublier, ce que le public ne fera pas. »","« Le tiroir du bas. Celui qu'on n'ouvre plus. »"],
 mid:["« Ni gloire, ni drame. Le football aussi a ses dimanches pluvieux. »","« Une saison honnête, comme un plat du jour. »"],
};
