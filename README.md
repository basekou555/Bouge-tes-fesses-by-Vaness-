<div align="center">

# ⚽ ABSOLUT COACH

### Une vie de football à travers les époques

**Choisis ton époque. Choisis tes clubs et tes joueurs. Survis aux présidents. Construis une œuvre.**

`7 ÉPOQUES` · `VRAIS CLUBS, VRAIS JOUEURS` · `100 % LOCAL` · `FRANÇAIS`

> Le jeu ne cherche pas « le bon bouton ». Chaque décision déplace des probabilités, puis le football fait ce qu'il sait faire de mieux : surprendre.

Les salaires suivent le niveau, l'âge (un jeune du centre gagne peu), le palier du club et l'époque ; le plafond salarial d'un club correspond à un groupe de son niveau, avec un quart de marge.

Concept de jeu inspiré d'[Absolut Director](https://github.com/Feuille2Cedric/absolutDirector) (Feuille2Cedric), adapté au football.

</div>

---

## 🚀 Lancer le jeu

Aucune installation et aucune connexion ne sont nécessaires : ouvre [`index.html`](./index.html) dans Chrome, Edge ou Firefox. Sauvegarde, badges et Panthéon restent dans le navigateur.

**Au téléphone**, l'interface se replie : le bouton principal de l'écran (coup d'envoi, continuer, intersaison) reste collé en bas tant que la page défile, la fiche du club et le journal se dépliant d'une pression, et le tableau de composition ne garde que statut, poste, nom, niveau, fraîcheur et note.

```text
absolut-coach/
├── index.html    coquille de la page
├── styles.css    thème vert et or (bleu pour le mode joueur·euse), mise en page téléphone
├── profile.js    styles de jeu et nationalités
├── players.js    près de 400 joueurs réels, des années 50 à aujourd'hui
├── eras.js       les sept époques et leurs règles, les clubs réels, les entraîneurs réels
├── content.js    incidents, coups du sort, dilemmes, roulettes, arnaques du mercato
├── core.js       moteur partagé : joueurs, effectifs, marché, championnats, coupes
├── match.js      le match : compo, fraîcheur, styles adverses, minute par minute, notes
├── coach.js      carrière d'entraîneur·euse
├── player.js     carrière de joueur·euse
└── ui.js         écrans
```

---

## ⏳ Les sept époques

| Époque | Années | Ce qui change |
|---|---|---|
| 📻 Années 50-60 | 1958-1969 | Aucun remplaçant, 2 étrangers, transferts rares, francs |
| 📺 Années 70 | 1970-1981 | 2 remplaçants, football total, mercato limité |
| 📼 Années 80 | 1982-1993 | 3 étrangers, tacles par derrière, affaires |
| 💿 Années 90 | 1994-2003 | Arrêt Bosman en 1996, Ligue des champions, mercato d'hiver dès 2000 |
| 📱 Années 2000 | 2004-2013 | Agents tout-puissants, premiers fonds étrangers, euros |
| 📊 Années 2010 | 2014-2023 | Fair-play financier, data, VAR, réseaux sociaux |
| 🛰️ Aujourd'hui | 2024- | Golfe, MLS, multipropriété, 5 remplaçants, transferts à 100 M€ |

Les joueurs réels (Kopa, Platini, Zidane, Mbappé, Yamal…) apparaissent selon leur âge dans l'année en cours, avec un niveau proche de leur réalité et une part de hasard. Une longue carrière traverse l'époque suivante.

---

## 🧢 Carrière d'entraîneur·euse (30 → 75 ans)

1. **Les offres, autour de ta cote** : ta cote (0-100) résume ce que ta carrière vaut ; elle monte avec les objectifs tenus, les titres et les coupes, chute avec les échecs, les relégations et les licenciements. Les bancs proposés arrivent autour de ce niveau : un cran au-dessus après une bonne saison, en dessous après un échec. Tant que ton contrat court et que le président te garde, tu restes, sauf si un club plus ambitieux vient te chercher ; rompre coûte de la réputation. Des clubs réels (Reims 1958, Bordeaux 1985, Lyon 2005, Inter Miami 2024…) avec leur championnat, un objectif de classement, un budget de transferts et un président qui a son caractère (patient, impulsif, ambitieux, comptable, romantique, étranger).
2. **Le mercato** : libre, mais cohérent. Vends, recrute des stars si ta crédibilité le permet, des pros, des pépites venues d'une vidéo ou d'un cousin (certaines sont des arnaques : faux âge, blessure cachée, joueur fantôme, commission occulte…), des joueurs libres ou des jeunes du centre. Un « gros coup » coûte cher et exige une place de titulaire. Plafond salarial et quota d'étrangers de l'époque s'appliquent.
3. **Le plan de jeu** : une formation et un style. Suivre le style demandé par le club et jouer ton style favori renforcent l'équipe. Chaque style appartient à une famille : 🧠 contrôle bat 🔥 pression, pression bat 🧱 contre, contre bat contrôle, et le 🚀 jeu direct ouvre le match.
4. **Le rythme** : « Temps forts » (par défaut) ne t'arrête que sur les chocs contre le podium, les concurrents directs, les matchs de la peur, la reprise de chaque phase, et sur une alerte (un blessé ou un suspendu dans ton onze, trois défaites de suite, un président qui s'impatiente). Les autres matchs se jouent en coulisses avec ta compo et tes réglages, et apparaissent en résumé. « Complet » joue tout, « Rapide » ne s'arrête qu'à la reprise. Le réglage se change à tout moment dans la barre latérale.
5. **Le match** : avant chaque match, l'adversaire (classement, force, style, forme), ta formation, ton onze et ton banc (fraîcheur, suspensions, blessures, hors poste), ton capitaine, ton approche (tout devant, équilibré, fermer le jeu) et l'entraînement de la semaine (tactique, physique, jeunes, récupération). Le match se déroule minute par minute : buts et passeurs, penaltys, cartons, blessures, remplacements, avec une décision à la mi-temps (garder le plan, tout devant, fermer, recadrer le vestiaire). À la fin : le film du match, une note par joueur, l'homme du match, et les raisons du résultat. Un bouton simule le reste de la phase avec le onze automatique.
6. **La saison en quatre phases** : un vrai calendrier, tes scores, le classement, une explication du résultat (onze type, vestiaire, style, tactique, blessés, dynamique) et l'évolution de la **confiance du président**. Mercato d'hiver à la trêve quand l'époque le permet.
7. **Le bilan** : classement final, coupe nationale, coupe d'Europe, récompenses, progressions des jeunes, contrats, verdict du président, montée ou descente.

**La confiance du président** remplace le capital : elle monte quand tu dépasses l'objectif, chute quand tu es en dessous ou que la masse salariale explose. À zéro, licenciement immédiat. Sous 35 en fin de saison, pas de prolongation. L'objectif se recalcule chaque saison sur la vraie force de ton effectif : bâtir une armada relève l'attente.

**Cinq jauges** : ✊ Vestiaire (force de l'équipe), 📣 Supporters (pression et patience), 🎓 Formation (jeunes, arnaques), 🧑‍🤝‍🧑 Staff (blessures, progression) et 🏡 Proches (ta vie en dehors du terrain). Une jauge basse déclenche des dilemmes.

**Où passe ton année** : chaque saison commence par un renoncement. Cinq chantiers — le terrain, le vestiaire, le centre, le club et les médias, tes proches — et seulement deux places. Ce que tu choisis avance, les trois autres reculent. Un chantier déjà solide progresse moins qu'un chantier négligé, et un chantier abandonné ne tombe pas à zéro : il s'installe dans la médiocrité. Il n'existe donc pas de saison parfaite, seulement des priorités assumées.

**Tes proches** amortissent la pression quand la jauge est haute (−18 % sur chaque montée) et l'amplifient quand elle est basse (+25 %). Elle s'use toute seule, d'autant plus que la saison a été dure. À la fin de la carrière, le bilan dit ce qu'il en reste : c'est la contrepartie de tous les arbitrages.

**Aucun choix n'est gratuit** : chaque option d'un événement annonce ce qu'elle donne et ce qu'elle coûte avant que tu cliques. Et certains choix ne se paient pas tout de suite — ils reviennent deux ou trois saisons plus tard, en bien ou en mal : le livre qui vexe un futur dirigeant, l'adjoint parti se former qui revient grandi, le silence sur une affaire de paris qui ressort.

**Pression, roulette, fins** : à 100 de pression, une crise impose un choix (dont un à 50 % de risque de mort). La roulette du destin peut apparaître deux fois par carrière, et elle a toujours une suite : un gain ou un revers laisse un écho qui pèse une ou deux saisons (sur la force de l'équipe en mode entraîneur·euse, sur ce que le coach voit de toi en mode joueur·euse), et la mauvaise porte scelle un destin. Deux des quatre roulettes poursuivent alors la carrière sous contrainte — la clause d'exclusivité à vie t'installe dans le club de l'émir et t'y enferme (plus aucune offre, mais plus aucun licenciement possible non plus ; le propriétaire exige la première place chaque saison et la pression monte) ; l'affaire des archives te bannit de l'élite jusqu'à ce qu'un titre gagné loin des projecteurs lave ton nom. Les deux autres (accident, radiation) restent des fins sèches. La carrière s'arrête aussi à 75 ans, après quatre licenciements d'affilée, deux années sans offre, ou par retraite.

### Les cinq campagnes

| Campagne | Effet |
|---|---|
| ⚽ Carrière classique | Budgets et présidents normaux |
| 🌱 Bâtisseur·euse | Budgets −40 %, présidents +30 % de patience, formation valorisée |
| 🏟️ Machine à trophées | Budgets +60 %, présidents −40 % de patience, objectifs relevés |
| 🎲 Football chaos | Variance +60 %, incidents +50 % |
| 💀 Dernier contrat | Budgets −50 %, présidents −50 % de patience, pression +50 % |

---

## 👟 Carrière de joueur·euse (17 → 38 ans)

Tu rejoins des clubs réels avec un rôle promis (titulaire, rotation, remplaçant·e) et un coach, parfois réel. Ton agent vise un niveau de club selon ta note, ta dernière saison, la sélection et ton âge ; les offres arrivent autour de ce niveau. Sous contrat, tu restes, sauf si un club vient te chercher ou si tu demandes ton transfert. Les temps forts sont les chocs où tu es dans le groupe, les penaltys, une blessure, une place perdue ou retrouvée. Chaque journée, le coach compose : ta note face aux concurrents à ton poste, sa **confiance**, le rôle promis et ta fraîcheur décident si tu es titulaire, sur le banc ou en tribune. Tu vis le match minute par minute (buts, passes, cartons, blessures, entrée en jeu) avec une note à la fin, et un penalty à tirer ou à laisser quand il se présente. À chaque phase : un incident possible, puis le bilan de tes matchs, ta note moyenne et la confiance du coach. Quatre jauges : 🩻 Corps (à zéro, fin de carrière), ✊ Vestiaire, 📣 Supporters, 👪 Entourage. Sélection nationale, Ballon d'or, Soulier d'or, coupes d'Europe. Progression forte avant 25 ans, déclin après 31.

---

## 🏅 Badges et Panthéon

Une soixantaine de badges persistants : titres par époque et par pays, mercato (gros coup, arnaques, pépite devenue star), jauges à 100, pression, roulette, mode joueur·euse. Le Panthéon garde les carrières terminées avec leur score.

---

<div align="center">

### « Un bon choix améliore tes chances. Il ne signe jamais le contrat avec le destin. »

</div>
