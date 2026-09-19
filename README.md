<div align="center">

# ⚽ ABSOLUT COACH

### Une vie de football, de 30 à 75 ans

**Choisis tes clubs. Dirige tes vestiaires. Survis aux présidents. Construis une œuvre.**

`100 % LOCAL` · `AUCUNE INSTALLATION` · `FRANÇAIS` · `BADGES ET PANTHÉON PERSISTANTS`

> Le jeu ne cherche pas « le bon bouton ». Chaque décision déplace des probabilités, puis le football fait ce qu'il sait faire de mieux : surprendre.

Concept de jeu inspiré d'[Absolut Director](https://github.com/Feuille2Cedric/absolutDirector) (Feuille2Cedric), adapté au football.

</div>

---

## 🚀 Lancer le jeu

Aucune installation et aucune connexion ne sont nécessaires.

1. Ouvre [`index.html`](./index.html) dans Chrome, Edge ou Firefox.
2. Clique sur **Commencer une carrière d'entraîneur·euse** ou **Commencer une carrière de joueur·euse**.
3. Pour conserver correctement badges, sauvegarde et Panthéon, joue toujours depuis le même navigateur.

Le [workflow GitHub Pages](.github/workflows/pages.yml) publie automatiquement le jeu après chaque push sur `main` (à activer dans les réglages du dépôt : Settings → Pages → Source : GitHub Actions).

```text
absolut-coach/
├── index.html   coquille de la page
├── styles.css   thème sombre vert et or (thème bleu pour le mode joueur·euse)
├── data.js      styles de jeu, campagnes, origines, clubs, recrues, tactiques, incidents…
├── engine.js    état, offres, jauges, résolution de saison, pression, enveloppe, fins, badges
├── events.js    intersaison : amende écologique, roulette, plans, dilemmes, coups du sort
├── player.js    carrière de joueur·euse (17 → 38 ans)
└── ui.js        écrans et rendu
```

---

## 🧢 Carrière d'entraîneur·euse

Tu incarnes un·e entraîneur·euse au début de sa carrière (30 ans). Tu choisis une **campagne**, une **origine**, une **nationalité**, un **style de jeu favori**, une **inspiration**, une **qualité** et un **défaut**. Ces éléments façonnent tes statistiques et tes affinités, mais ne garantissent jamais le résultat d'une saison.

À chaque période :

1. tu analyses les projets proposés (club, palier, style demandé, objectif, capital à engager) ;
2. tu choisis une recrue phare (star, valeur sûre, jeune, pari libre ou promotion interne) ;
3. tu décides de la gestion du vestiaire, du système de jeu, du staff et des infrastructures ;
4. la saison peut rencontrer un incident (blessure, président envahissant, ultras, grève, scandale…) ;
5. tu choisis ta communication ;
6. le classement final, la presse, les supporters, les coupes et les récompenses tombent ;
7. ta carrière, ton staff et ton club conservent les conséquences de tes décisions.

### Les paliers de projets

| Palier | Capital engagé | Accès |
|---|---|---|
| Projet louche (club en perdition) | 10 à 80 k€ | toujours, mais handicap énorme |
| Club amateur ambitieux (N3 / N2) | 50 à 400 k€ | dès le début |
| National / Ligue 2 | 1 à 8 M€ | après une saison |
| Ligue 1 | 12 à 50 M€ | deux saisons et une réputation |
| Championnat étranger émergent | 4 à 60 M€ | réseau ou cote suffisants |
| Club européen | 10 à 80 M€ | réputation solide ou expérience internationale |
| Super-club mondial | 70 à 220 M€ | cote, réseau et gestion au sommet |

Un **intérim de sauvetage** (le club paie tout) est proposé après deux saisons ratées d'affilée. **Rester dans le même club** fidélise le public, mais à partir de la 4e saison le discours s'use.

### Les cinq campagnes

| Campagne | Sensation de jeu |
|---|---|
| **★☆☆☆☆ Carrière classique** | Économie neutre, quatre saisons ratées tolérées, intérim et enveloppe disponibles |
| **★★☆☆☆ Bâtisseur·euse incompris·e** | 35 % de capital en moins, supporters plus difficiles, presse plus réceptive |
| **★★★☆☆ Machine à trophées** | Capital ×4, frais fixes et usure renforcés ; une saison impopulaire fait bondir la pression |
| **★★★★☆ Football chaos** | Variance presque doublée, incidents très fréquents, pression erratique |
| **★★★★★ Dernier contrat** | 55 % de capital en moins, trois saisons ratées suffisent, ni intérim ni enveloppe |

Tous les cinq projets, une **stratégie de carrière** oriente trois saisons : philosophie, tribunes, organisation, rupture, style favori, international, noyau dur ou survie.

### Les statistiques

- **Tactique** : lecture du jeu, idées, capacité à transformer un effectif en équipe.
- **Gestion** : maîtrise d'un groupe, d'un staff et d'un calendrier chargé.
- **Réseau** : accès aux clubs, agents, joueurs et opportunités à l'étranger.
- **Réputation presse** : crédit auprès des journalistes et des jurys.
- **Cote supporters** : popularité, accès aux gros projets.
- **Moral** : endurance personnelle.
- **Capital** : ce que le football accepte de te confier. Chaque projet engage une part du capital, les recettes de saison (primes, billetterie, plus-values) y reviennent. À zéro, plus aucun président ne te fait confiance.
- **Pression** : fatigue industrielle et personnelle. Elle pénalise progressivement les saisons et peut devenir fatale.

### Les six jauges du club

| Jauge | Effet concret |
|---|---|
| ⚖️ **Intégrité** | Une valeur basse nourrit les scandales et le risque de licenciement conflictuel en cours de saison. |
| 🌱 **Écologie** | Surcoûts logistiques, pression et moral. Chaque saison lui retire 2 points. Sous 10, la Ligue des défenseurs de la planète peut infliger une amende. |
| ✊ **Vestiaire** | Loyauté, moral, qualité collective, grèves. Avec l'intégrité, détermine le risque de rupture du groupe. |
| ❤️ **Direction & staff** | Coordination et loyauté du staff. Sous 50, risque croissant que la saison s'enlise (durée et budget doublés). |
| 🌌 **Identité de jeu** | Fidélise les supporters et augmente les recettes, surtout lorsque tu restes au même club. |
| 🎓 **Formation** | Réduit le coût du recrutement, renforce les projets de formation et le regard de la presse. |

Chaque saison use toutes les jauges. Une jauge à 100 débloque un statut permanent (autorité morale, club régénératif, vestiaire modèle, staff indéfectible, architecte de projet, école reconnue). À partir du troisième projet, chaque offre reçoit un **surcoût caché de 5 à 70 %**, tiré vers le haut quand les jauges sont mauvaises.

### Pression, roulette, enveloppe

- Dès 25, la pression réduit la qualité ; à 60 elle dégrade le moral ; entre 90 et 99, **1 % de risque de mort** par période critique ; à 100, une crise impose un choix, et « continuer coûte que coûte » déclenche **50 % de risque de mort**.
- La **roulette du destin** devient éligible après trois saisons (20 % de chance d'apparaître, quatre saisons de délai). Quatre issues cachées : fin, jackpot, petit bonus, malus.
- Quand le capital atteint zéro, un mécène propose une **enveloppe de secours** unique : deux échéances, 10 % d'intérêts avant chacune, radiation si tout n'est pas soldé.

### Comment une carrière peut se terminer

75 ans · capital épuisé · radiation pour dettes · série de saisons ratées · trois périodes en rupture structurelle · plus aucune offre après 55 ans avec une réputation faible · arrestation écologique · roulette · mort par pression · retraite volontaire.

---

## 👟 Carrière de joueur·euse

De 17 à 38 ans. Tu choisis un poste, une origine et un trait de caractère. Ton agent te propose des clubs et des rôles (titulaire, rotation, remplaçant·e) ; tu choisis ta préparation estivale et ton attitude ; un incident peut survenir ; la saison décide de tes matchs, buts, passes, note, sélection nationale, trophées et gains. La **forme physique** remplace le capital : à zéro, le corps lâche. Les qualités progressent vite avant 24 ans, plafonnent, puis déclinent après 31 ans. Le **Ballon de platine** récompense les saisons exceptionnelles dans les grands clubs.

---

## 🏅 Badges et Panthéon

La salle des badges conserve les accomplissements dans le navigateur : campagnes, trophées, récompenses, saisons mémorables, jauges, pression, roulette, finances, fins de carrière et mode joueur·euse. Certains badges récompensent une réussite ; d'autres immortalisent une catastrophe. Le Panthéon garde les carrières terminées avec leur score.

---

## 🧠 Conseils sans révéler les solutions

1. Ne choisis pas automatiquement le plus gros projet : le capital engagé, la difficulté et la durée doivent correspondre à ta situation.
2. Un système de jeu cohérent avec le style demandé par le club vaut plus qu'une star.
3. Regarde les jauges comme des risques futurs, pas comme une note morale.
4. Entretiens une marge d'écologie avant chaque nouvelle saison.
5. Sous 50 en intégrité ou vestiaire, tu peux perdre toute une saison ; sous 50 en direction & staff, la saison peut s'enliser.
6. À 90 de pression, chaque période supplémentaire engage aussi ta survie.
7. Un échec intéressant peut ouvrir davantage de récits et de badges qu'une carrière parfaitement lisse.

---

<div align="center">

### « Un bon choix améliore tes chances. Il ne signe jamais le contrat avec le destin. »

**Bon match. Et garde un œil sur le capital.**

</div>
