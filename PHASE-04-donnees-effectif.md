# PHASE 04 — Données : équipe et effectif

**Objectif :** poser la source de données unique du site. Tous les textes, chiffres et profils
vivent dans `src/data/` — aucun composant ne contient de donnée en dur.

**Durée estimée :** 1 h
**Prérequis :** [PHASE 01](PHASE-01-socle-projet.md)

---

## 1. Fichiers

| Action | Chemin |
|---|---|
| Créer | `src/data/team.js` |
| Créer | `src/data/players.js` |

---

## 2. `src/data/team.js`

```js
export const team = {
  name: 'KARNYX',
  legalName: 'KARNYX ESPORTS',
  tagline: 'eFootball Mobile · Madagascar',
  slogan: 'Précision. Rythme. Domination.',
  motto: 'Strike first. Win always.',
  baseline:
    "Douze joueurs, une seule identité. KARNYX est une structure eFootball Mobile malgache créée en décembre 2025, engagée dès la première saison en CEM Premier League et construite autour d'un jeu collectif, d'une discipline tactique et d'une exigence permanente sur le format mobile.",
  founded: 2025,
  foundedLabel: 'Décembre 2025',
  region: 'Madagascar',
  league: 'CEM — Community eFootball Madagascar',
  competition: 'Premier League',
  division: 'Division 1',
  season: 'Saison 2025 / 2026',
  rank: 3,
}

export const teamStats = {
  season: '2025 / 2026',
  competition: 'CEM Premier League — Division 1',
  matches: 18,
  wins: 11,
  draws: 1,
  losses: 6,
  goalsFor: 39,
  goalsAgainst: 36,
  diff: 3,
  points: 34,
  rank: 3,
  teams: 10,
  winRate: 61,
  goalsPerMatch: 2.17,
  goalsAgainstPerMatch: 2,
  // …
}

export const navLinks = [
  { id: 'effectif', label: 'Effectif' },
  { id: 'statistiques', label: 'Statistiques' },
  { id: 'evenement', label: 'Événement' },
  { id: 'contact', label: 'Contact' },
]
```

### Cohérence arithmétique obligatoire

Les chiffres doivent se recouper, sinon la maquette se contredit :

| Vérification | Calcul | Attendu |
|---|---|---|
| Victoires + nuls + défaites = matchs | 11 + 1 + 6 | 18 ✓ |
| Taux de victoire | 11 / 18 | 61 % ✓ |
| Ratio de buts | 39 / 18 | 2.17 ✓ |
| Buts encaissés / match | 36 / 18 | 2 ✓ |
| Points | 11 × 3 + 1 | 34 ✓ |
| Différence de buts | 39 − 36 | +3 ✓ |

> `navLinks` alimente la navbar **et** la section « Navigation » du footer : une seule source
> pour les libellés et les ancres.

> Les chiffres du classement (`src/data/standings.js`) et ceux de `teamStats` doivent correspondre
> ligne par ligne — `scripts/check-data.mjs` le vérifie automatiquement.

---

## 3. `src/data/players.js`

### 3.1 Schéma

```js
{
  id: 'marco',
  tag: 'KARNYX_MARCO',
  slug: 'marco',
  displayName: 'Marco',
  orgRole: 'Joueur',
  firstName: 'Marco Patani',
  lastName: 'Amestrong',
  nationality: 'Madagascar',
  flag: '🇲🇬',
  number: 9,
  joined: 'Juillet 2026',
  hue: 34,
  bio: "…",
  quote: "…",
  strengths: ['Finition', 'Timing', 'Appels en profondeur'],
  stats: {
    matches: 186, goals: 94, assists: 21, cleanSheets: 0,
    winRate: 64, passAccuracy: 79, duelsWon: 47,
    shotsPerGame: 3.4, goalsPerMatch: 0.51,
  },
}
```

- **`orgRole`** : fonction dans l'association (issue du roster officiel) —
  `Président et Joueur`, `Vice-président et Joueur`, `Trésorier et Joueur`,
  `Conseiller et Joueur`, `Joueur et Secrétaire Général`, `Joueur`.

> **Champs retirés** : `age`, `foot`, `role`, `roleLabel`, `playStyle`, `playStyleFr`,
> `overall`, `teamRole`. Ces informations ne figurent pas dans le document officiel ; elles
> ont été supprimées des données **et** de la fiche joueur. `check-data.mjs` bloque toute
> réintroduction de l'un d'eux.

**`hue`** est le paramètre qui fait varier la silhouette placeholder (phase 07) : une teinte
entre 20 et 46 (bande bronze/or), jamais hors de cette plage, pour rester cohérent avec l'or.

### 3.2 Effectif — 12 joueurs

| Tag | Slug | Identité (nom réel) | Organisation | N° |
|---|---|---|---|---|
|---|---|---|---|---|---|---|---|
| KARNYX_MARCO | `/marco` | Marco Patani Amestrong | Joueur | 9 |
| KARNYX_RoK1N | `/rok1n` | Edino Maminirina Emmanuel Rapanoelina | Conseiller et Joueur | 11 |
| KARNYX_ASPL | `/aspl` | Manjato Rakotonirina | Joueur | 8 |
| KARNYX_TJ | `/tj` | Tojoniana Christophe Rakotoarisoa | Joueur et Secrétaire Général | 4 |
| KARNYX_JSS | `/jss` | Hasina Kevin Rasolofomanjato | Joueur | 7 |
| KARNYX_TuPa | `/tupa` | Tojo Fitahiana Ranaivoson | Joueur | 10 |
| KARNYX_Leemar | `/leemar` | Fanomezantsoa Tolojanahary Randriantanenaina | Trésorier et Joueur | 20 |
| KARNYX_Kix30 | `/kix30` | Kiady Nandrandraina Nomemaharavo Rakotoarisoa | Vice-président et Joueur | 17 |
| KARNYX_Jeamis | `/jeamis` | Malalanantenaina Jeamis | Président et Joueur | 3 |
| KARNYX_LETICE | `/letice` | Franticien Rabenarivo | Joueur | 14 |
| KARNYX_Rastepha | `/rastepha` | Maminiaina Stephane Rakotonirina | Joueur | 21 |
| KARNYX_DERGROSSE | `/dergrosse` | Aina Fitiavana Andriaherilanto | Joueur | 5 |

> **Tous les joueurs sont malgaches** 🇲🇬 — `nationality: 'Madagascar'`, `flag: '🇲🇬'`.
> Noms, pseudos et fonctions proviennent du roster officiel de l'association ; les statistiques
> de jeu, elles, restent des valeurs de maquette.

> **Règle de slug :** le tag est mis en minuscules, `1` conservé tel quel.
> `KARNYX_TuPa` → `tupa`. `KARNYX_RoK1N` → `rok1n`. `KARNYX_Kix30` → `kix30`.

### 3.2 bis Confidentialité — ce qui ne doit jamais sortir

Le roster officiel contient des données personnelles et administratives. Elles sont
**hors périmètre du site** et ne doivent jamais être recopiées dans `src/data/` :

| Donnée | Exemple | Traitement |
|---|---|---|
| Numéro CIN / pièce d'identité | `101231168904` | ❌ jamais |
| Numéro de série de l'appareil utilisé | `L8AIKN06L746G32` | ❌ jamais |
| Clause salariale du contrat | `60 000 Ar` | ❌ jamais |
| Dates et durée du contrat | `1/7/2026 → 31/12/2026` | ❌ jamais (seule la date d'arrivée est affichée) |
| Nom, prénom, pseudonyme, fonction | `KARNYX_Jeamis` | ✅ affiché |
| Date d'arrivée (mois + année) | `Juillet 2026` | ✅ affiché |

`scripts/check-data.mjs` bloque toute régression : détection des clés sensibles
(`cin`, `serial`, `clause`, `salary`, `contract`…), des CIN à 12 chiffres et des numéros de série.

### 3.3 Répartition des postes

4 attaquants / 3 milieux / 4 défenseurs / 1 meneur — cohérent avec un 4-3-3, cohérent avec un
effectif de 12 sur eFootball Mobile.

> Le poste n'est plus stocké en donnée (champ `role` retiré). Il n'est décrit que par les
> statistiques et la biographie, qui restent des valeurs de maquette.

### 3.4 Cohérence des statistiques

| Poste | Tendances attendues |
|---|---|
| CF / AG / AR | `goals` élevé, `cleanSheets: 0`, `goalsPerMatch` > 0.15 |
| AMF / MOC | `assists` élevé, `passAccuracy` ≥ 88, `goals` moyen |
| MC | `goals` faible, `assists` moyen, `passAccuracy` 80-86 |
| MDC / DG | `cleanSheets` élevé, `goals` ≤ 14, `duelsWon` ≥ 58 |

`goalsPerMatch` doit être égal à `goals / matches` (arrondi à 2 décimales). Exemple Marco :
94 / 186 = 0.505 → `0.51`. DerGrosse : 9 / 192 = 0.047 → `0.05`.

### 3.5 Fonctions exportées

```js
export function getPlayerBySlug(slug) {
  return players.find((p) => p.slug === slug)
}

export function getAdjacentPlayers(slug) {
  const index = players.findIndex((p) => p.slug === slug)
  if (index === -1) return { previous: null, next: null }
  return {
    previous: players[(index - 1 + players.length) % players.length],
    next: players[(index + 1) % players.length],
  }
}
```

La navigation « joueur précédent / suivant » boucle en cercle : le dernier joueur renvoie le
premier, et inversement.

---

## 4. Contrôle qualité du texte

Les bios et les quotes sont générés : ils doivent passer une relecture avant livraison.

- Aucun caractère non latin (les accents français sont les seuls autorisés).
- Aucune phrase tronquée ni mot inventé.
- Les apostrophes typographiques `’` sont admises et préférées dans les citations.
- Chaque quote est attributable et cohérente avec le poste du joueur
  (un défenseur central ne dit pas « on me cherche dans la surface »).

### Script de contrôle

```bash
node -e "import('./src/data/players.js').then(m=>{
  console.log('joueurs:', m.players.length);
  m.players.forEach(p=>{
    const bad = /[^\x00-\x7F]/.test(p.bio) && /[^\u00C0-\u024F\u2019\u2026]/.test(p.bio);
    console.log(p.tag, '->', '/'+p.slug, p.nationality, p.orgRole, p.joined, bad ? '  <-- BIO A CORRIGER' : '');
  });
})"
```

---

## 5. Données de jeu — statut

L'identité des joueurs (nom, pseudonyme, fonction) et les résultats de l'équipe sont **réels**.
Les statistiques de jeu individuelles (buts, assists, clean sheets…), les citations et
les biographies restent des valeurs de maquette.

Le badge `Maquette — données fictives` du footer a été retiré : ces valeurs sont désormais
affichées comme réelles. Elles doivent donc être remplacées par des données officielles ou
supprimées — c'est le dernier point de cohérence du site.

Rien ne doit laisser croire que les statistiques individuelles sont vérifiées.

---

## 6. Critères de validation

| # | Critère | Statut |
|---|---|---|
| 1 | 12 joueurs, slugs uniques et sans majuscule | ☐ |
| 2 | Toutes les nationalités = Madagascar, drapeau 🇲🇬 | ☐ |
| 3 | `getPlayerBySlug` et `getAdjacentPlayers` fonctionnent | ☐ |
| 4 | Les totaux de `teamStats` sont arithmétiquement cohérents | ☐ |
| 5 | `goalsPerMatch` = `goals / matches` pour chaque joueur | ☐ |
| 6 | Aucune chaîne corrompue (accents non latins, mots inventés) | ☐ |
| 7 | Aucune couleur ou donnée en dur dans un composant | ☐ |
| 8 | Aucune donnée sensible (CIN, série d'appareil, salaire, contrat) dans `src/data/` | ☐ |
| 9 | `orgRole` renseigné pour chaque joueur | ☐ |
