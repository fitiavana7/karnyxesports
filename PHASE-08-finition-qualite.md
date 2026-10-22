# PHASE 08 — Finition, qualité et livraison

**Objectif :** passer la maquette du statut « ça marche » au statut « livrable » — responsive
complet, accessibilité, robustesse des routes en hébergement statique, build de production,
recette visuelle.

**Durée estimée :** 1 h 30
**Prérequis :** [PHASE 07](PHASE-07-fiche-joueur.md)

---

## 1. Responsive — les 4 breakpoints

Le CSS est mobile-first sur les grilles, mais les sections principales ont besoin d'un
retravail à chaque palier.

| Breakpoint | Ce qui change |
|---|---|
| **1440 px** (référence) | Container 1240 px, roster 4 colonnes, stats 4 colonnes, fiche joueur 2 colonnes |
| **1100 px** | Roster → 3 colonnes, KPI → 2 colonnes, `hero__grid` gap 64 → 40 |
| **900 px** | Nav desktop masquée, burger affiché, `hero__grid` / `player-hero__grid` / `player-body` / `contact` → 1 colonne, visuel du hero au-dessus du texte (`order: -1`) |
| **720 px** | Roster → 2 colonnes, `stat-grid` → 2, `stats__detail` → 2, `contact__row` → 1, `player-nav` → 1, footer → 1 colonne, `hero__stats` → 2×2 |
| **460 px** | Roster → 1 colonne, `player-hero__meta` → 2 colonnes |

### Points à ne pas oublier

- `hero__stat:nth-child(2n) { border-right: 0 }` à 720 px — sinon la grille 2×2 garde une
  bordure verticale au milieu.
- `.hero__visual { order: -1 }` à 900 px : sur mobile, l'emblème doit arriver avant le texte,
  sinon l'écran d'accueil est vide en haut.
- `.player-hero__figure { max-width: 420px }` à 900 px — la silhouette ne doit pas s'étirer.

---

## 2. Accessibilité

### 2.1 Contrôles obligatoires

| Contrôle | Mise en œuvre |
|---|---|
| Focus visible | `:focus-visible { outline: 2px solid var(--gold-400); outline-offset: 3px }` — déjà dans `tokens.css` |
| Contraste | `--text-mid` (#a7b2be) sur `--bg-deep` (#12181f) → ratio ≈ 7.5:1 ✓ ; `--text-low` réservé aux métadonnées secondaires |
| Structure | un seul `<h1>` par page, `<h2>` par section, `<h3>` par carte joueur |
| `alt` | `alt=""` sur les images décoratives (nav, footer), `alt="Emblème KARNYX"` sur le hero |
| Formulaire | `<label for>` associé à chaque champ, placeholder ≠ label |
| Menu burger | `aria-expanded` + `aria-label` dynamique |
| Barres | `role="progressbar"` + `aria-valuenow/min/max` |
| Message de confirmation | `role="status"` |
| Icônes | `aria-hidden="true"` sur tous les SVG |
| Chiffres du hero | `<dl>` / `<dt>` masqué visuellement / `<dd>` |

### 2.2 Test clavier

Parcourir la page avec `Tab` uniquement :

1. Logo → lien « KARNYX — accueil » (accessible via `aria-label`).
2. Liens Effectif / Statistiques / Contact.
3. CTA « Rejoindre l'équipe ».
4. Burger (visible < 900 px).
5. Sur la home : CTA du hero, puis les 12 cartes joueur, puis le formulaire.
6. Sur une fiche : lien retour, précédent/suivant, liens sociaux.

Aucun élément ne doit disparaître au focus (pas de `outline: none` sans remplacement).

---

## 3. Contenu fictif — décision

Le badge `Maquette — données fictives` du footer a été **retiré** : le site vitrine présente
l'effectif et ses résultats comme réels.

Conséquence directe : les statistiques individuelles, les biographies, les citations et les
points forts — qui restent des valeurs de maquette — sont désormais affichés eux aussi comme
réels. Pour chaque joueur, ces blocs doivent être remplacés par des données officielles ou
supprimés.

- [x] Aucun badge « données fictives » dans le footer
- [ ] Aucun nom de sponsor, aucun logo de marque réelle dans les maquettes

---

## 4. Hébergement statique

Le routeur est côté client : un hébergeur statique doit renvoyer `index.html` pour toute URL
`/<slug>`.

### 4.1 Netlify / Cloudflare Pages

`public/_redirects` (déjà créé en phase 01) :

```
/*    /index.html   200
```

### 4.2 Vercel

Créer `vercel.json` à la racine :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 4.3 Apache / Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 4.4 Vérification

```bash
npm run build
npm run preview
```

Puis ouvrir `http://localhost:4173/dergrosse` : la fiche doit s'afficher, pas une 404.
Si `npm run preview` renvoie une 404 sur `/dergrosse`, c'est le routeur qui n'est pas en cause
mais bien la réécriture d'URL du serveur de preview.

---

## 5. Build de production

```bash
npm run build
```

Vérifications sur la sortie :

- [ ] `dist/` est généré sans erreur ni avertissement bloquant.
- [ ] `dist/assets/` contient un seul bundle JS et un seul bundle CSS (pas de duplication).
- [ ] `dist/favicon.png`, `dist/emblem.jpg`, `dist/logo.jpeg` sont copiés.
- [ ] `dist/index.html` référence les bundles en hashed (`/assets/index-XXXX.js`).
- [ ] Les polices Google sont chargées via `<link>` (pas de requête bloquante supplémentaire).

### Optimisations optionnelles

- `build.rollupOptions.output.manualChunks` pour isoler `react-router-dom` du bundle
  applicatif — utile seulement si le bundle dépasse ~250 Ko gzip.
- Auto-héberger les polices (`@fontsource/chakra-petch`) si la maquette doit fonctionner
  hors-ligne :Cela ajoute ~180 Ko au dépôt mais supprime la dépendance réseau.

---

## 6. Recette visuelle

Checklist sur la home et une fiche joueur, en 1440 / 768 / 390 px :

**Home**
- [ ] Le hero remplit l'écran sans barre de scroll verticale anormale
- [ ] L'emblème est net et centré, le halo or ne déborde pas
- [ ] Le bandeau de 4 chiffres est aligné verticalement
- [ ] Les 12 cartes roster sont de hauteur identique (grid stretch)
- [ ] Au survol d'une carte : élévation 6 px, liseré or, la flèche « Profil » glisse à droite
- [ ] Les 4 KPI s'animent une seule fois
- [ ] Les séparateurs diagonaux s'alignent sur la largeur du container
- [ ] Le formulaire focus a une bordure gauche or

**Fiche joueur**
- [ ] Le numéro fantôme est lisible derrière la silhouette
- [ ] Le badge « Organisation » est lisible sous le nom
- [ ] La citation est alignée à gauche avec le guillemet or
- [ ] Les 3 métadonnées (nation, numéro, arrivée) forment une grille 3 colonnes sans trou
- [ ] Aucun overall / poste / style de jeu / pied / rôle / âge n'apparaît sur la fiche
- [ ] « précédent » depuis `marco` mène à `dergrosse`
- [ ] Le retour à l'effectif ramène à `/#effectif` et défile jusqu'à la section

**Transitions**
- [ ] Navigation home → fiche → autre fiche : pas de flash blanc
- [ ] Le scroll revient en haut à chaque changement de route sans hash
- [ ] Le menu mobile se referme à la navigation

---

## 7. Pièges récurrents

| Symptôme | Cause probable | Correctif |
|---|---|---|
| Page blanche au build | import d'un composant inexistant | vérifier les chemins d'import `@/` |
| Les polices ne se chargent pas | pas de `preconnect` ou réseau bloqué | vérifier `index.html` |
| La barre de progression ne se remplit pas | `.is-visible` posé sur un parent différent de `.bar__fill` | poser la classe sur le même conteneur |
| Le scroll d'ancre ne fonctionne pas | `Link` vers un hash sans `ScrollManager` | vérifier la phase 01 |
| 404 sur `/dergrosse` en preview | réécriture d'URL absente | `public/_redirects` / `vercel.json` |
| Défilement horizontal sur mobile | largeur fixe (`460px`, `min-width`) | remplacer par `max-width` |
| `useCountUp` recompte à chaque rendu | `started.current` non gardé | vérifier le hook phase 02 |
| Contraste insuffisant sur `--text-low` | usage en texte courant | réserver aux métadonnées |

---

## 8. Critères de validation finale

| # | Critère | Statut |
|---|---|---|
| 1 | `npm install && npm run dev` sans erreur | ☐ |
| 2 | `npm run build` produit `dist/` sans erreur | ☐ |
| 3 | Les 13 routes (`/` + 12 joueurs) fonctionnent en preview | ☐ |
| 4 | Aucune erreur dans la console navigateur | ☐ |
| 5 | Aucune erreur React (key dupliquée, hook conditionnel) | ☐ |
| 6 | Parcours clavier complet sans piège de focus | ☐ |
| 7 | Aucun débordement horizontal de 360 à 1440 px | ☐ |
| 8 | `prefers-reduced-motion` respecté | ☐ |
| 9 | Aucun marqueur « données fictives » ne subsiste | ☐ |
| 10 | Les 12 fiches joueurs sont accessibles depuis l'effectif | ☐ |
