# KARNYX — Roadmap de génération

> Maquette web pour l'équipe **KARNYX** (eFootball Mobile, Madagascar).
> Une page d'accueil + une fiche par joueur (12 fiches, routes `/marco` … `/dergrosse`).

**Ce dossier contient les plans de génération, pas le projet.** Chaque phase est un fichier
`PHASE-XX-*.md` exécutable indépendamment. Une implémentation de référence complète est
disponible dans `_prototype/` (à lire, à adapter, ou à reconstruire phase par phase).

---

## 1. Décisions actées

| Sujet | Décision |
|---|---|
| Langue du site | Français |
| Jeu | eFootball Mobile |
| Stack | React 18 + Vite 5 (JSX, pas TypeScript) |
| Contenu joueurs | Données placeholders réalistes, signalées comme fictives |
| Origine de l'effectif | 12 joueurs, tous malgaches 🇲🇬 |
| Palette | Or / bronze du logo + ardoise bleu-slate |
| Sections accueil | Hero + présentation, Effectif, Statistiques, Contact / réseaux sociaux |
| Visuels joueurs | Silhouette vectorielle anguleuse stylisée (placeholder) |
| Animation | Sobre premium : angles coupés, dégradés or, transitions douces, pas de glitch |
| Hébergement | Statique (SPA) avec réécriture d'URL vers `index.html` |

---

## 2. Analyse du logo (source de vérité du design)

`logo.jpeg` — 842 × 842, JPEG 24 bpp. Palette mesurée par échantillonnage :

| Rôle | Hex | Usage |
|---|---|---|
| Fond ardoise | `#2C343F` / `#303A44` | fond principal des cartes |
| Fond ardoise clair | `#4A5666` | bande diagonale, filets, texte secondaire |
| Or clair | `#C09060` | accent principal, titres, CTA |
| Or moyen | `#AD8257` | dégradés metallic |
| Bronze | `#906030` / `#825B30` | ombres de l'emblème, bordures |
| Argent | `#C0C8D0` | highlights emblème, icônes |
| Fond profond | `#222A33` → `#181818` | vignette / hors-écran |

**Règle de répartition : ~85 % ardoise sombre, ~10 % or, ~5 % argent.** L'or est toujours porté
par un élément unique à l'écran (un titre, un chiffre, un trait actif), jamais en aplat large.

**Motifs déduits du logo, à transposer :**

1. **Anguleux / taillé** — l'emblème est fait de facettes denses → `clip-path` à coins coupés
   (haut-droite et bas-gauche à 45°).
2. **Diagonale** — le fond porte une bande diagonale plus claire en haut à droite → séparateurs
   de section en diagonale, textures de hachures à 45°.
3. **Métal** — l'emblème est un métal (or + argent) → dégradés multi-stops diagonaux sur les
   boutons, jamais des aplats.
4. **Densité** — le logo est un bloc compact → mise en page en grille serrée, pas de grands vides.

**Typographie :**

| Usage | Police | Raison |
|---|---|---|
| Titres / display | **Chakra Petch** 600-700 | angulaire, taillée — même logique que le logo |
| Corps de texte | **Inter** 400-500 | lisibilité mobile |
| Chiffres / stats / tags | **JetBrains Mono** 500-700 | grille de stats alignée, look terminal |

Titres en `uppercase`, `letter-spacing: 0.04em`. `Inter` et `Rajdhani` exclus (templates
esport génériques).

---

## 3. Les 8 phases

| # | Fichier | Contenu | Sortie |
|---|---|---|---|
| 01 | [PHASE-01-socle-projet.md](PHASE-01-socle-projet.md) | Vite + React + router, structure de dossiers | App qui affiche une page vide sur `/` et `/:slug` |
| 02 | [PHASE-02-design-system.md](PHASE-02-design-system.md) | Tokens CSS, animations, primitives UI | Charte typée et appliquable |
| 03 | [PHASE-03-assets-logo.md](PHASE-03-assets-logo.md) | Extraction emblem.jpg + favicon.png | Assets prêts à l'emploi |
| 04 | [PHASE-04-donnees-effectif.md](PHASE-04-donnees-effectif.md) | `team.js` + `players.js` (12 joueurs) | Source de données unique |
| 05 | [PHASE-05-navigation-footer.md](PHASE-05-navigation-footer.md) | Navbar sticky + Footer | Chrome global du site |
| 06 | [PHASE-06-page-accueil.md](PHASE-06-page-accueil.md) | Hero, Effectif, Statistiques, Contact | Page d'accueil complète |
| 07 | [PHASE-07-fiche-joueur.md](PHASE-07-fiche-joueur.md) | Route `/:slug`, profil, stats, navigation | 12 fiches joueurs |
| 08 | [PHASE-08-finition-qualite.md](PHASE-08-finition-qualite.md) | Responsive, accessibilité, build, recette | Maquette livrable |

Ordre obligatoire : chaque phase dépend de la précédente. Les phases 01→04 sont les fondations,
05→07 construisent les écrans, 08 finalise.

---

## 4. Arborescence cible

```
karnyx/
├── logo.jpeg                    # source, ne pas modifier
├── PHASE.md                     # ce fichier (roadmap)
├── PHASE-01-socle-projet.md
├── PHASE-02-design-system.md
├── PHASE-03-assets-logo.md
├── PHASE-04-donnees-effectif.md
├── PHASE-05-navigation-footer.md
├── PHASE-06-page-accueil.md
├── PHASE-07-fiche-joueur.md
├── PHASE-08-finition-qualite.md
├── _prototype/                  # implémentation de référence (mise de côté)
└── (le projet se construit à la racine, hors _prototype)
```

Une fois la phase 01 exécutée, l'arborescence du projet devient :

```
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── logo.jpeg
│   ├── emblem.jpg
│   ├── favicon.png
│   └── _redirects
└── src/
    ├── main.jsx
    ├── AppShell.jsx
    ├── lib/assets.js
    ├── data/{team.js,players.js}
    ├── hooks/{useReveal.js,useCountUp.js}
    ├── styles/{tokens.css,animations.css,components.css}
    ├── components/
    │   ├── {Navbar,Hero,Roster,PlayerCard,TeamStats,Contact,Footer,Portrait,Icon}.jsx
    │   └── ui/{NotchCard,SectionTitle,DiagonalDivider,StatBar}.jsx
    └── pages/{Home.jsx,PlayerPage.jsx}
```

---

## 5. Conventions de code

- **JSX**, pas de TypeScript. Composants en fonction, hooks standards uniquement.
- Un composant = un fichier. CSS **global** dans `src/styles/` — pas de CSS-in-JS, pas de
  Tailwind : la maquette doit rester lisible et éditable à la main.
- Classes en **BEM-lite** : `.player-card`, `.player-card__tag`, `.player-card--gold`.
- Fichiers : `PascalCase.jsx` (composants), `camelCase.js` (données), `kebab-case.css`.
- **Aucun commentaire superflu** dans le code. Commentaires et documentation en **français**.
- Encodage UTF-8 ; apostrophes typographiques `’` admises.
- Les couleurs ne s'écrivent **jamais** en dur dans un composant : uniquement via `var(--token)`.

---

## 6. Critères d'acceptation globaux

1. `npm install && npm run dev` fonctionne sans erreur.
2. `npm run build` produit `dist/` sans erreur ni avertissement bloquant.
3. `/` affiche : Hero → Effectif (12 cartes cliquables) → Statistiques → Contact → Footer.
4. Les 12 routes `/marco`, `/rok1n`, `/aspl`, `/tj`, `/jss`, `/tupa`, `/leemar`, `/kix30`,
   `/jeamis`, `/letice`, `/rastepha`, `/dergrosse` affichent une fiche complète.
5. Le rendu est cohérent avec `logo.jpeg` : ardoise sombre, or métallique, angles coupés,
   aucun aplat saturé.
6. Les données fictives (statistiques individuelles, bios, citations) sont remplacées par
   des données officielles ou retirées — aucun marqueur « maquette » ne subsiste.
7. Responsive 360 → 1440 px, sans débordement horizontal.
8. Navigation clavier complète, contrastes AA, `prefers-reduced-motion` respecté.

---

## 7. Commandes

```bash
npm install
npm run dev             # http://localhost:5173
npm run build           # dist/  (site vitrine déployable)
npm run preview         # sert dist/ (vérifier les routes /slug)
npm run check           # contrôle des données + garde-fous vie privée
npm run build:standalone # maquette.html (un seul fichier, HashRouter)
```

> `npm run preview` sert `dist/` en statique : le routeur côté client nécessite une
> réécriture d'URL. `public/_redirects` (Netlify / Cloudflare Pages) et `vercel.json`
> couvrent ce cas — voir la phase 08.

---

## 8. Site vitrine — état

Le projet est construit **à la racine** (hors `_prototype/`, qui reste l'implémentation de
référence). Livrables :

| Sortie | Chemin | Contenu |
|---|---|---|
| Site déployable | `dist/` | SPA statique (13 routes) + `_redirects` |
| Version fichier unique | `maquette.html` | tout inliné (CSS, JS, images en `data:`) |
| Hébergement | `vercel.json`, `public/_redirects` | réécriture `/<slug>` → `/index.html` |

Données joueurs : roster officiel (noms, pseudos, fonctions) ; CIN, n° de série d'appareil,
clause salariale et dates de contrat ne quittent jamais `src/data/`. `npm run check` bloque
toute régression (champs sensibles, champs non officiels, liens sociaux).

