# PHASE 06 — Page d'accueil

**Objectif :** construire la page unique `/` — Hero, Effectif (12 cartes cliquables),
Statistiques, Contact — avec l'ordre et la hiérarchie prévus.

**Durée estimée :** 2 h
**Prérequis :** [PHASE 02](PHASE-02-design-system.md), [PHASE 04](PHASE-04-donnees-effectif.md),
[PHASE 05](PHASE-05-navigation-footer.md)

---

## 1. Fichiers

| Action | Chemin |
|---|---|
| Créer | `src/components/Hero.jsx` |
| Créer | `src/components/Roster.jsx` |
| Créer | `src/components/PlayerCard.jsx` |
| Créer | `src/components/TeamStats.jsx` |
| Créer | `src/components/Contact.jsx` |
| Créer | `src/components/Portrait.jsx` |
| Modifier | `src/pages/Home.jsx` |
| Modifier | `src/styles/components.css` (styles des sections) |

---

## 2. Ordre de la page

```
Hero  (#accueil)
  └── DiagonalDivider "Effectif"
Effectif (#effectif)
  └── DiagonalDivider "Statistiques"
Statistiques (#statistiques)
  └── DiagonalDivider "Classement"
Classement (#classement)
  └── DiagonalDivider "Événement"
Prochain événement (#evenement)
  └── DiagonalDivider "Contact"
Contact (#contact)
```

`src/pages/Home.jsx` :

```jsx
import Hero from '@/components/Hero'
import Roster from '@/components/Roster'
import TeamStats from '@/components/TeamStats'
import Standings from '@/components/Standings'
import EventCard from '@/components/EventCard'
import Contact from '@/components/Contact'
import DiagonalDivider from '@/components/ui/DiagonalDivider'
import { useReveal } from '@/hooks/useReveal'

export default function Home() {
  const rootRef = useReveal()

  return (
    <div ref={rootRef}>
      <Hero />
      <div className="container"><DiagonalDivider label="Effectif" /></div>
      <Roster />
      <div className="container"><DiagonalDivider label="Statistiques" /></div>
      <TeamStats />
      <div className="container"><DiagonalDivider label="Classement" /></div>
      <Standings />
      <div className="container"><DiagonalDivider label="Événement" /></div>
      <EventCard />
      <div className="container"><DiagonalDivider label="Contact" /></div>
      <Contact />
    </div>
  )
}
```

> Le `Standings` et l'`EventCard` sont alimentés par `src/data/standings.js` et
> `src/data/event.js` (données de la saison CEM Premier League — Division 1).

Le `ref` racine est indispensable : `useReveal` cherche les `.reveal` dans tout le sous-arbre.

---

## 3. `Hero.jsx`

Grille 2 colonnes : contenu à gauche, emblème à droite.

### 3.1 Contenu

| Bloc | Contenu | Source |
|---|---|---|
| Badge | `Madagascar · CEM Premier League · Division 1` | `team` |
| Titre H1 | `KARNYX` en `.metal-text` | `team.name` |
| Slogan | « Précision. Rythme. Domination. » | `team.slogan` |
| Devise | « Strike first. Win always. » | `team.motto` |
| Paragraphe | baseline de l'org | `team.baseline` |
| CTA | « Découvrir l'effectif » (`/#effectif`) + « Nous contacter » (`/#contact`) | — |
| Bandeau stats | Matchs 18 · Victoires 11 · Taux 61 % · Points 34 | `teamStats` |

```jsx
<dl className="hero__stats">
  {KPIS.map((kpi) => (
    <div className="hero__stat" key={kpi.label}>
      <dt className="visually-hidden">{kpi.label}</dt>
      <dd>
        <b>{kpi.value}</b>
        <span>{kpi.label}</span>
      </dd>
    </div>
  ))}
</dl>
```

> `<dl>` avec `<dt>` masqué visuellement : les quatre chiffres sont des données, pas du texte
> décoratif. Un lecteur d'écran les énumère correctement.

### 3.2 Visuel

Empilement, du fond vers l'avant :

1. `.hero__glow` — halo radial or, `filter: blur(12px)`, 128 % de largeur.
2. `.hero__ring` — cercle ardoise 1 px + anneau pointillé or en `::after`.
3. `.hero__emblem` — `/emblem.jpg`, `width: min(100%, 460px)`, `filter: drop-shadow(...)`,
   animation `float-slow` 7 s.
4. `.hero__ticks` — 4 équerces d'angle or (`.corner-ticks span`), opacité 0.6.

### 3.3 Styles clés

```css
.hero { min-height: 100svh; display: flex; align-items: center;
        padding-top: calc(var(--nav-h) + 40px); padding-bottom: 90px; overflow: hidden; }
.hero__grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 64px; }
.hero__title { margin-block: 26px 18px; line-height: .94; }
.hero__stats { display: grid; grid-template-columns: repeat(4, 1fr);
               margin-top: 62px; border-top: 1px solid var(--slate-line); }
.hero__stat { border-right: 1px solid var(--slate-line); }
.hero__stat:last-child { border-right: 0; }
```

> `100svh` et non `100vh` : sur mobile, `vh` ignore la barre d'adresse et provoque un
> débordement vertical.

---

## 4. `Roster.jsx` + `PlayerCard.jsx`

### 4.1 Roster

```jsx
<section className="section section--deep texture-grid" id="effectif">
  <div className="container">
    <SectionTitle
      eyebrow="L'effectif"
      title="Douze joueurs, une identité"
      lead="Une équipe construite par groupes de fonction, rodée sur les longues sessions mobile et portée par un même exigence de précision."
    />
    <div className="roster">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  </div>
</section>
```

Grille : `repeat(4, 1fr)` → 3 colonnes à 1100 px → 2 à 720 px → 1 à 460 px.

### 4.2 PlayerCard

Structure :

| Zone | Contenu |
|---|---|
| `.player-card__top` | tag `KARNYX_XXX` (or, mono) |
| `.player-card__figure` | `Portrait` SVG (silhouette) |
| `.player-card__body` | nom + lien « Profil → » |

> **Carte volontairement minimale** : ni poste, ni style de jeu, ni pied, ni rôle, ni numéro,
> ni overall. La fiche joueur (`/#slug`) ne conserve que les données officielles (identité,
> organisation, nation, numéro, mois d'arrivée).
> La carte ne montre que l'identité (tag + pseudonyme) et l'accès au profil.

La carte entière est un `<Link to={`/${player.slug}`}>` : zone cliquable complète, navigation
clavier native.

```jsx
<Link to={`/${player.slug}`} className="player-card shimmer reveal">
  <div className="player-card__top">
    <span className="player-card__tag">{player.tag}</span>
  </div>

  <div className="player-card__figure">
    <Portrait hue={player.hue} label={`Portrait de ${player.displayName}`} />
  </div>

  <div className="player-card__body">
    <h3 className="player-card__name">{player.displayName}</h3>
    <div className="player-card__foot">
      <span className="player-card__cta">Profil <ArrowIcon /></span>
    </div>
  </div>
</Link>
```

> `.player-card__foot` est aligné à droite (`justify-content: flex-end`) : il ne reste que le
> lien « Profil → ».

### 4.3 Numéro fantôme — retiré

Le numéro du joueur en filigrane derrière la silhouette (`9.5rem`, `color: transparent`,
`-webkit-text-stroke`) a été retiré des cartes : la grille a gagné enpureté et le numéro
reste lisible sur la fiche joueur (`/#[slug]`), où il est帮扶` en grand dans le hero.

---

## 5. `Portrait.jsx` — silhouette placeholder

Composant SVG paramétré par `hue`, réutilisé sur les cartes et les fiches joueurs.

Deux silhouettes polygonales dans un `viewBox="0 0 300 300"` :

```
CORPS : M28 292 L50 224 L104 185 L133 170 L150 181 L167 170 L196 185 L250 224 L272 292 Z
TÊTE  : M150 32 L187 57 L197 100 L182 135 L150 154 L118 135 L103 100 L113 57 Z
```

Rendu en 4 couches :

1. **Rim light** : les deux chemins, remplis du dégradé or, décalés de `translate(8 -7)` et
   opacité 0.9 → liseré métallique en haut à droite.
2. **Corps** : les deux chemins par-dessus, remplis du dégradé sombre teinté par `hue`.
3. **Visière** : bande angulaire sur le visage, `fill: url(#visor)` + contour or 1 px.
4. **Détails** : arête du crâne, mâchoire, col, lignes d'épaules, repères horizontaux en bas.

```jsx
<linearGradient id={`body-${uid}`} x1="0" y1="0" x2="0.8" y2="1">
  <stop offset="0%" stopColor={`hsl(${hue} 30% 24%)`} />
  <stop offset="48%" stopColor="#161c24" />
  <stop offset="100%" stopColor="#0d1218" />
</linearGradient>
```

> `useId()` de React génère des identifiants uniques par instance → pas de collision de `id`
> SVG quand plusieurs silhouettes sont sur la même page. Retirer les `:` de l'id : ils sont
> invalides dans une URL de fragment CSS (`url(#...)`).

---

## 6. `TeamStats.jsx`

Trois blocs :

### 6.1 KPI (4 tuiles)

`Matchs joués 214` · `Victoires 132` · `Taux de victoire 62 %` · `Clean sheets 98`.
Chaque tuile porte une variation (`+38 cette saison`, `62 % de réussite`, `46 % des matchs`).

```jsx
function Kpi({ value, label, delta, suffix }) {
  const [display, ref] = useCountUp(value)
  return (
    <div className="kpi reveal" ref={ref}>
      <b className="kpi__value">{display}{suffix && <small>{suffix}</small>}</b>
      <span className="kpi__label">{label}</span>
      {delta && <span className="kpi__delta">{delta}</span>}
    </div>
  )
}
```

### 6.2 Barres (3)

`Ratio de buts 1.88` (max 3) · `Précision des passes 84 %` · `Duels gagnés 59 %`.

```jsx
function Bar({ item }) {
  const [display, ref] = useCountUp(item.value, 1200)
  return (
    <div className="reveal" ref={ref}>
      <StatBar label={item.label} value={item.value} display={display}
               suffix={item.suffix} max={item.max} />
    </div>
  )
}
```

### 6.3 Grille de détail (4)

`Buts marqués 402` · `Buts encaissés 231` · `Ratio de buts 1.88` · `Possession 58 %`.

---

## 7. `Contact.jsx`

**Formulaire seul.** La colonne « réseaux sociaux » a été retirée : aucun compte Discord, X,
YouTube, Instagram ou Twitch n'existe réellement, et un lien mort est pire qu'une absence de lien.
La section ne présente donc qu'un canal de contact : le formulaire.

### 7.1 Formulaire

Champs : pseudo, e-mail, sujet, message. Chaque `<input>` a un `<label for>` associé.

```jsx
function handleSubmit(event) {
  event.preventDefault()
  setSent(true)
  event.target.reset()
}
```

Le message de confirmation utilise `role="status"` pour être annoncé.

> Maquette : aucune requête réseau. Le `preventDefault` suffit.

```css
.contact {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 780px;
  margin-inline: auto;
}
```

> Règle générale : **aucun lien social ne doit être livré tant que le compte n'existe pas.**
> Ajouter un réseau = ajouter la donnée dans `src/data/team.js` *et* le compte réel.

---

## 8. Critères de validation

| # | Critère | Statut |
|---|---|---|
| 1 | La home affiche Hero → Effectif → Stats → Classement → Événement → Contact dans cet ordre | ☐ |
| 2 | 12 cartes, chacune cliquable vers son slug | ☐ |
| 3 | Les 4 KPI s'animent de 0 à leur valeur au scroll | ☐ |
| 4 | Les 3 barres se remplissent au scroll | ☐ |
| 5 | Le formulaire affiche un message de confirmation | ☐ |
| 6 | Aucun lien vers un réseau social inexistant | ☐ |
| 7 | Aucun débordement horizontal de 360 à 1440 px | ☐ |
| 8 | Les ancres `#effectif` / `#statistiques` / `#contact` existent dans le DOM | ☐ |
