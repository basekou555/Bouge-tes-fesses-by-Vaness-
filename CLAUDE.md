# Absolut Coach

Jeu de simulation de carrière football, 100 % statique (HTML, CSS, JavaScript sans build), en français, inspiré des mécaniques d'Absolut Director. Deux modes : entraîneur·euse et joueur·euse, à travers sept époques (1958 → aujourd'hui) avec clubs et joueurs réels.

## Fichiers
- `index.html` charge dans l'ordre : `profile.js` (styles de jeu, nationalités), `players.js` (≈400 joueurs réels `[nom, poste, naissance, niveau, nationalité]`), `eras.js` (époques, clubs FR/Europe/monde avec force par décennie, entraîneurs réels), `content.js` (incidents, coups du sort, dilemmes, roulettes, arnaques, présidents), `core.js` (moteur partagé : joueurs, effectifs, marché, championnats, coupes, développement, badges, persistance), `coach.js` (carrière entraîneur·euse), `player.js` (carrière joueur·euse), `ui.js` (tous les écrans).
- Tout l'état d'une carrière est dans l'objet global `state` (sérialisé dans localStorage). `state.pendingChoice` désigne l'écran courant ; `render()` dans `ui.js` dispatche.
- Argent interne en « millions de 2015 », affiché via `money(v, year)` (francs avant 2002, échelle d'époque).

## Conventions
- Pas de dépendance ni d'outil de build : `vercel.json` et `.github/workflows/pages.yml` copient simplement les fichiers.
- Textes en français avec écriture inclusive (entraîneur·euse, joueur·euse).
- Chaque chiffre affiché doit avoir une conséquence visible en jeu (retour du propriétaire après la version 1).

## Vérifier
- Syntaxe : `for f in *.js; do node -e "new Function(require('fs').readFileSync('$f','utf8'))"; done`
- Simulation complète des deux modes : `node tests/simulate.js` (Chromium headless via playwright-core). Doit finir par `ERRORS: none`. Les lignes par carrière servent à juger l'équilibrage (licenciements, titres, arnaques, écart de force `gap`).
