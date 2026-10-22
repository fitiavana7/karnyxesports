# PHASE 07 — Fiche joueur

**Objectif :** construire la page individuelle `/<slug>` — bandeau joueur, biographie, phrase
signature, points forts, statistiques, réseaux, navigation vers le joueur adjacent — et le
traitement du 404 métier.

**Durée estimée :** 1 h 30
**Prérequis :** [PHASE 04](PHASE-04-donnees-effectif.md), [PHASE 06](PHASE-06-page-accueil.md)

---

## 1. Fichiers

| Action | Chemin |
|---|---|
| Créer | `src/pages/PlayerPage.jsx` |
| Modifier | `src/styles/components.css` (styles `.player-*`, `.quote`, `.chip`, `.stat-*`, `.notfound`) |

---

## 2. Route

La route existe déjà depuis la phase 01 : `/:slug` → `PlayerPage`. Le paramètre se lit avec
`useParams()`.

```jsx
const { slug } = useParams()
const player = getPlayerBySlug(slug)
```

---

## 3. Structure de la page

```
┌─ player-hero ────────────────────────────────────────┐
│  [Retour à l'effectif]                                │
│  ┌──────────────┐  KARNYX_DERGROSSE                  │
│  │  silhouette  │  <Prénom> <Nom>                     │
│  │  + n° fantôme│  [Organisation] Joueur              │
│  └──────────────┘  ┌────┬────┬────┐                  │
│                    │nat. │n°  │arriv│ 3 cases         │
│                    └────┴────┴────┘                  │
└──────────────────────────────────────────────────────┘
┌─ player-body (2 colonnes) ────────────────────────────┐
│  BIOGRAPHIE           │  STATISTIQUES                 │
│  · texte              │  · 4 tuiles chiffrées         │
│  · citation           │  · 3 barres                   │
│  · points forts       │  · 4 cellules de détail       │
│  · préc. / suivant    │                               │
└──────────────────────────────────────────────────────┘
```

---

## 4. Bandeau joueur

### 4.1 Colonne visuelle

```jsx
<div className="player-hero__figure reveal">
  <span className="player-hero__ghost" aria-hidden="true">{player.number}</span>
  <Portrait hue={player.hue} label={`Portrait de ${player.displayName}`} />
</div>
```

Seul le numéro fantôme reste dans le cadre : l'overall n'est plus affiché (donnée de jeu
fictive, retirée du même lot que poste, style de jeu, pied, rôle et âge).

### 4.2 Colonne texte

```jsx
<p className="player-hero__tag">{player.tag}</p>
<h1 className="player-hero__name">
  {player.firstName} <span className="metal-text">{player.lastName}</span>
</h1>
<p className="player-hero__org">
  <span className="player-hero__org-label">Organisation</span>
  {player.orgRole}
</p>
```

Le nom de famille est en `.metal-text` : c'est le point focal or de la page.

### 4.3 Table de métadonnées (3 cases)

| Case | Valeur |
|---|---|
| Nation | `🇲🇬 Madagascar` |
| Numéro | `5` |
| Arrivé le | `Octobre 2026` |

Grille `repeat(3, 1fr)` → 1 ligne de 3 cases. Fond `--bg-deep`, séparations en `gap: 1px`
sur un fond `--slate-line` (effet de grille sans bordures doubles).

> Seules les données **officielles** du roster figurent dans la table : nation, numéro de
> maillot et mois d'arrivée. Le rôle associatif est porté par le badge **Organisation** du
> bandeau. Poste, style de jeu, pied, rôle sportif, âge et overall ont été retirés : ils
> ne figuraient pas dans le document officiel.

---

## 5. Colonne biographie

### 5.1 Texte et citation

```jsx
<p className="reveal" style={{ marginTop: 22, fontSize: '1.05rem', lineHeight: 1.85 }}>
  {player.bio}
</p>

<blockquote className="quote reveal">
  <p>{player.quote}</p>
  <footer>{player.displayName} — {player.tag}</footer>
</blockquote>
```

La citation utilise `<blockquote>` + `<footer>` (sémantique correcte) et un guillemet
typographique `“` en `::before`, couleur `--gold-600`, 4.2 rem.

### 5.2 Points forts

```jsx
<div className="chips reveal">
  {player.strengths.map((strength) => (
    <span className="chip" key={strength}>{strength}</span>
  ))}
</div>
```

`.chip` : fond ardoise, `clip-path: var(--clip-notch-xs)`, mono, `letter-spacing: .12em`.

---

## 6. Colonne statistiques

### 6.1 Tuiles chiffrées (4)

Matchs joués · Buts · Passes décisives · Clean sheets — animées via `useCountUp`.

```jsx
function StatTile({ value, label }) {
  const [display, ref] = useCountUp(value, 1100)
  return (
    <div className="stat-tile reveal" ref={ref}>
      <b>{display}</b>
      <span>{label}</span>
    </div>
  )
}
```

### 6.2 Barres (3)

Taux de victoire · Précision des passes · Duels gagnés — valeurs issues de `player.stats`.

### 6.3 Cellules de détail (4)

Tirs / match · Buts / match · N° de licence · Expérience.

### 6.4 Réseaux du joueur — retirés

Les tuiles `.social` (X, YouTube) et le champ `player.socials` ont été supprimés : aucun compte
par joueur n'existe. La fiche joueur ne propose que des liens internes (joueur précédent /
suivant / retour à l'effectif).

### 6.5 Rappel « données fictives »

Placé sous les statistiques de chaque fiche :

```jsx
<p className="mono" style={{ marginTop: 18, fontSize: '0.66rem', color: 'var(--text-low)' }}>
  Profil de démonstration — données fictives.
</p>
```

---

## 7. Navigation joueur précédent / suivant

```jsx
const { previous, next } = getAdjacentPlayers(slug)
```

```jsx
<div className="player-nav reveal">
  <Link to={`/${previous.slug}`} className="player-nav__link">
    <IconArrowLeft />
    <span>
      <span className="player-nav__label">Joueur précédent</span>
      <span className="player-nav__name">{previous.displayName}</span>
    </span>
  </Link>

  <Link to={`/${next.slug}`} className="player-nav__link player-nav__link--next">
    <span>
      <span className="player-nav__label">Joueur suivant</span>
      <span className="player-nav__name">{next.displayName}</span>
    </span>
    <IconArrowRight />
  </Link>
</div>
```

La navigation boucle : depuis `marco` (premier), « précédent » mène à `dergrosse` (dernier).

---

## 8. 404 métier

Si `getPlayerBySlug(slug)` renvoie `undefined`, on n'affiche pas une page vide :

```jsx
if (!player) {
  return (
    <div className="notfound">
      <div className="container">
        <p className="notfound__code">404</p>
        <h2>Joueur introuvable</h2>
        <p style={{ margin: '18px 0 30px' }}>
          Ce profil n'existe pas ou n'est plus dans l'effectif.
        </p>
        <Link to="/#effectif" className="btn btn--primary">Retour à l'effectif</Link>
      </div>
    </div>
  )
}
```

`.notfound__code` : `font-size: clamp(4rem, 14vw, 9rem)` en texte transparent avec
`-webkit-text-stroke: 1px var(--gold-600)`.

---

## 9. Titre et meta dynamiques

```jsx
useEffect(() => {
  if (!player) return
  document.title = `${player.displayName} — KARNYX`
  const meta = document.querySelector('meta[name="description"]')
  if (meta) {
    meta.setAttribute('content', `${player.displayName} — ${player.orgRole} chez KARNYX.`)
  }
}, [player])
```

> `document.title` est réinitialisé par React Router ? Non — mais il n'est pas restauré
> automatiquement non plus. Sur la home, prévoir un `useEffect` qui remet
> `document.title = 'KARNYX — eFootball Mobile'`.

---

## 10. Styles

```css
.player-hero { padding-top: calc(var(--nav-h) + 46px); padding-bottom: 54px; overflow: hidden; }
.player-hero__grid { display: grid; grid-template-columns: .85fr 1.15fr; gap: 52px; align-items: center; }
.player-hero__figure { position: relative; aspect-ratio: 1/1; display: flex;
  align-items: flex-end; justify-content: center; padding: 26px;
  background: radial-gradient(100% 70% at 50% 110%, rgba(192,144,96,.2), transparent 64%),
              linear-gradient(168deg, var(--bg-panel-2), var(--bg-panel) 70%);
  clip-path: var(--clip-notch); box-shadow: inset 0 0 0 1px var(--slate-line); }
.player-hero__meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: var(--slate-line); border: 1px solid var(--slate-line); }
.player-body { display: grid; grid-template-columns: 1.1fr .9fr; gap: 46px; align-items: start; }
.quote { padding: 26px 28px 26px 62px; background: linear-gradient(150deg, rgba(42,51,61,.6), rgba(27,34,43,.4));
  clip-path: var(--clip-notch-sm); box-shadow: inset 0 0 0 1px var(--slate-line); }
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
  background: var(--slate-line); border: 1px solid var(--slate-line); }
.player-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 26px; }
```

Responsive : `player-hero__grid` et `player-body` passent en 1 colonne à 900 px ;
`stat-grid` en 2 colonnes à 720 px ; `player-nav` en 1 colonne à 720 px.

---

## 11. Critères de validation

| # | Critère | Statut |
|---|---|---|
| 1 | Les 12 slugs affichent une fiche complète | ☐ |
| 2 | `/xyzzy` affiche la page « joueur introuvable » | ☐ |
| 3 | `document.title` suit le joueur affiché | ☐ |
| 4 | « précédent / suivant » boucle sur les 12 joueurs | ☐ |
| 5 | La navigation au clavier fonctionne de bout en bout | ☐ |
| 6 | La silhouette reprend la teinte du joueur (`hue`) | ☐ |
| 7 | Le rappel « données fictives » est présent sur chaque fiche | ☐ |
| 8 | Aucun débordement horizontal de 360 à 1440 px | ☐ |
