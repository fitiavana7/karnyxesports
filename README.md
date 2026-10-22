# karnyx

Site vitrine de **KARNYX**, équipe eFootball Mobile de Madagascar.
React 18 + Vite 5 (JSX), CSS global, site 100 % statique.

- Accueil : hero, effectif (12 joueurs cliquables), classement CEM, affiche de l'événement, formulaire de contact.
- 12 fiches joueur : `/marco`, `/rok1n`, `/aspl`, `/tj`, `/jss`, `/tupa`, `/leemar`, `/kix30`, `/jeamis`, `/letice`, `/rastepha`, `/dergrosse`.

## Commandes

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # dist/ (site deployable)
npm run preview          # sert dist/
npm run check            # controle des donnees + garde-fous vie privee
npm run build:standalone # maquette.html (un seul fichier, ouvrable hors ligne)
```

## Deploiement

Site statique : deployer le contenu de `dist/`.

| Hebergeur | Configuration |
|---|---|
| Netlify / Cloudflare Pages | `public/_redirects` (deja dans `dist/`) |
| Vercel | `vercel.json` (rewrites `/(.*)` vers `/index.html`) |
| Apache / Nginx | `try_files $uri $uri/ /index.html;` |

## Donnees joueurs

L'effectif provient du roster officiel de l'association : nom, pseudonyme, fonction et mois
d'arrivée. Les donnees personnelles et administratives du document source (CIN, numero de
serie d'appareil, clause salariale, dates et duree de contrat) **ne quittent jamais** `src/data/`.

`npm run check` bloque toute regression : champs sensibles, valeurs a 12 chiffres, numeros de
serie, champs non officiels et liens sociaux inexistants.

## Structure

```
index.html            # point d'entree, meta Open Graph
public/               # logo, embleme, favicon, affiche, capture du classement
src/
  components/         # Navbar, Hero, Roster, PlayerCard, TeamStats, Standings, EventCard, Contact, Footer, Portrait
  data/               # team.js, players.js, standings.js, event.js
  hooks/              # useReveal, useCountUp
  lib/assets.js       # resolution des chemins d'images (data: URI en version autonome)
  pages/              # Home.jsx, PlayerPage.jsx
  styles/             # tokens.css, animations.css, components.css
scripts/              # check-data.mjs, build-standalone.mjs
```

## Livrables

| Sortie | Contenu |
|---|---|
| `dist/` | site deployable (SPA + regles de reecriture d'URL) |
| `maquette.html` | version autonome, tout inliné (CSS, JS, images) |
