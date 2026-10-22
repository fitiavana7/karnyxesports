# PHASE 02 — Design system

**Objectif :** transcrire la palette mesurée sur `logo.jpeg` en tokens CSS, poser les
primitives visuelles (angles coupés, dégradé métallique, séparateurs diagonaux, barres de
progression) et les deux hooks d'animation réutilisables.

**Durée estimée :** 1 h 30
**Prérequis :** [PHASE 01](PHASE-01-socle-projet.md)

---

## 1. Fichiers

| Action | Chemin |
|---|---|
| Créer | `src/styles/tokens.css` |
| Créer | `src/styles/animations.css` |
| Créer | `src/styles/components.css` |
| Créer | `src/hooks/useReveal.js` |
| Créer | `src/hooks/useCountUp.js` |
| Créer | `src/components/ui/NotchCard.jsx` |
| Créer | `src/components/ui/SectionTitle.jsx` |
| Créer | `src/components/ui/DiagonalDivider.jsx` |
| Créer | `src/components/ui/StatBar.jsx` |

---

## 2. Tokens (`src/styles/tokens.css`)

Le fichier contient le reset, les variables, la typographie de base et les utilitaires.

### 2.1 Variables

```css
:root {
  /* Fonds */
  --bg-void:      #0b0f14;
  --bg-deep:      #12181f;
  --bg-panel:     #1b222b;
  --bg-panel-2:   #222a33;
  --bg-elevated:  #2a333d;

  /* Ardoise */
  --slate-200:    #8b98a5;
  --slate-300:    #6e7c8a;
  --slate-400:    #4a5666;
  --slate-500:    #3a4552;
  --slate-line:        rgba(196, 216, 238, 0.10);
  --slate-line-strong: rgba(196, 216, 238, 0.18);

  /* Or */
  --gold-300:  #e4c39b;
  --gold-400:  #d9ae7e;
  --gold-500:  #c09060;
  --gold-600:  #ad8257;
  --bronze-700: #825b30;
  --bronze-800: #5e3f21;

  /* Argent */
  --silver-100: #edf1f5;
  --silver-300: #c0c8d0;
  --silver-500: #94a0ac;

  /* Texte */
  --text-hi:  #e9edf2;
  --text-mid: #a7b2be;
  --text-low: #6b7885;

  /* Dégradé métallique signature */
  --metal: linear-gradient(115deg,
    #e4c39b 0%, #c09060 26%, #825b30 52%, #d9ae7e 74%, #ad8257 100%);
  --metal-soft: linear-gradient(135deg, #e4c39b 0%, #c09060 50%, #ad8257 100%);
  --gold-fade: linear-gradient(90deg, var(--gold-500) 0%, rgba(192,144,96,0) 100%);
  --panel-sheen: linear-gradient(160deg,
    rgba(217,174,126,0.07) 0%, rgba(217,174,126,0) 42%);

  /* Ombres */
  --shadow-sm: 0 2px 10px rgba(0,0,0,.35);
  --shadow-md: 0 12px 34px rgba(0,0,0,.45);
  --shadow-lg: 0 28px 70px rgba(0,0,0,.55);
  --glow-gold: 0 0 0 1px rgba(192,144,96,.4), 0 10px 34px rgba(192,144,96,.18);

  /* Typo */
  --font-display: 'Chakra Petch', 'Segoe UI', system-ui, sans-serif;
  --font-body:    'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', 'Cascadia Mono', Consolas, monospace;

  /* Gabarits */
  --container: 1240px;
  --nav-h: 74px;
  --radius: 2px;

  /* Angles coupés */
  --clip-notch: polygon(0 0, calc(100% - 18px) 0, 100% 18px,
                        100% 100%, 18px 100%, 0 calc(100% - 18px));
  --clip-notch-sm: polygon(0 0, calc(100% - 11px) 0, 100% 11px,
                           100% 100%, 11px 100%, 0 calc(100% - 11px));
  --clip-notch-xs: polygon(0 0, calc(100% - 7px) 0, 100% 7px,
                            100% 100%, 7px 100%, 0 calc(100% - 7px));
  --clip-blade: polygon(0 0, 100% 0, 100% calc(100% - 26px),
                        calc(100% - 26px) 100%, 0 100%);
  --clip-blade-alt: polygon(0 0, 100% 0, 100% 100%, 26px 100%, 0 calc(100% - 26px));

  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
}
```

### 2.2 Points du reset

- `box-sizing: border-box` sur `*`.
- `html { scroll-behavior: smooth; scroll-padding-top: calc(var(--nav-h) + 16px) }`
  → les ancres `#effectif` ne passent pas sous la navbar fixe.
- `body` : fond `--bg-void` + **deux dégradés radiaux** (halo or en haut à droite, halo ardoise
  en haut à gauche) avec `background-attachment: fixed`.
- `h1..h4` : `font-family: var(--font-display)`, `text-transform: uppercase`,
  `letter-spacing: .04em`, `color: var(--text-hi)`.
- `:focus-visible` → `outline: 2px solid var(--gold-400)` (focus clavier visible en or).
- `::selection` → fond or translucide.
- Barres de défilement custom (::-webkit-scrollbar), fond `--bg-void`, pouce `--slate-500`.

### 2.3 Utilitaires

| Classe | Rôle |
|---|---|
| `.container` | largeur max 1240 px, padding-inline 24 px, centré |
| `.metal-text` | `background-clip: text` + dégradé `--metal` (titres dorés) |
| `.eyebrow` | sur-titre mono, `letter-spacing: .26em`, or, précédé d'un filet 26 px |
| `.hairline` | filet horizontal or → transparent |
| `.texture-grid` | hachures à 45° en `::before`, opacité 3.5 % |
| `.visually-hidden` | texte pour lecteurs d'écran uniquement |
| `.btn` / `.btn--primary` / `.btn--ghost` | boutons angulaires (clip-path) |
| `.field` + `.field input/textarea` | champs de formulaire, bordure gauche ardoise → or au focus |
| `.section` / `.section--deep` / `.section--panel` | gabarits de section |

---

## 3. Animations (`src/styles/animations.css`)

Keyframes : `fade-up`, `fade-in`, `float-slow`, `sweep`, `pulse-ring`, `bar-fill`.

Contrat de révélation au scroll :

```css
.reveal {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity .7s var(--ease), transform .7s var(--ease);
  transition-delay: var(--reveal-delay, 0ms);
}
.reveal.is-visible { opacity: 1; transform: none; }

.bar__fill { transform-origin: left center; transform: scaleX(0);
             transition: transform 1.1s var(--ease); }
.is-visible .bar__fill { transform: scaleX(1); }
```

Effet de balayage sur les cartes (`shimmer`) : un `::after` translucide en dégradé qui traverse
la carte au survol.

Bloc final obligatoire :

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1; transform: none; }
  .bar__fill { transform: scaleX(1); }
}
```

---

## 4. Hooks

### 4.1 `useReveal` — révélation au scroll

```js
import { useEffect, useRef } from 'react'

export function useReveal() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll('.reveal'))
      .filter((el) => !el.classList.contains('is-visible'))

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i, 8) * 60}ms`)
      observer.observe(el)
    })

    return () => observer.disconnect()
  })

  return rootRef
}
```

Usage : on place `ref={rootRef}` sur le conteneur racine de la page. Le `querySelectorAll`
est récursif → il trouve les `.reveal` dans les composants enfants. Le filtre `.is-visible`
évite de re-observer les éléments déjà révélés à chaque rendu.

### 4.2 `useCountUp` — compteur animé

```js
import { useEffect, useRef, useState } from 'react'

export function useCountUp(value, duration = 1400) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) { setDisplay(value); return }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        observer.disconnect()

        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(Math.round(value * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }, { threshold: 0.4 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return [display, ref]
}
```

---

## 5. Primitives UI (`src/components/ui/`)

### 5.1 `NotchCard.jsx`

Enveloppe à angles coupés, avec un voile de lumière interne.

```jsx
export default function NotchCard({ as: Tag = 'div', variant = 'panel', className = '', children, ...rest }) {
  return (
    <Tag className={`notch-card notch-card--${variant} ${className}`} {...rest}>
      <span className="notch-card__sheen" aria-hidden="true" />
      {children}
    </Tag>
  )
}
```

CSS associé : fond `linear-gradient(158deg, var(--bg-panel-2), var(--bg-panel) 62%)`,
`clip-path: var(--clip-notch)`, `box-shadow: inset 0 0 0 1px var(--slate-line)`.

### 5.2 `SectionTitle.jsx`

```jsx
export default function SectionTitle({ eyebrow, title, lead, align = 'left', id }) {
  const centered = align === 'center'
  return (
    <header className={`section-title ${centered ? 'section-title--center' : ''}`}>
      {eyebrow && <p className="eyebrow reveal">{eyebrow}</p>}
      <h2 className="section-title__title reveal" id={id}>{title}</h2>
      {lead && <p className="section-title__lead reveal">{lead}</p>}
    </header>
  )
}
```

Le titre est suivi d'un filet `--metal` de 56 px (centré si `align="center"`).

### 5.3 `DiagonalDivider.jsx`

```jsx
export default function DiagonalDivider({ label }) {
  return (
    <div className="diag-divider" aria-hidden={label ? undefined : 'true'}>
      <span className="diag-divider__line" />
      {label && <span className="diag-divider__label mono">{label}</span>}
      <span className="diag-divider__line diag-divider__line--flip" />
    </div>
  )
}
```

Les deux filets sont en miroir : `or → transparent` à gauche, `or → transparent` inversé à
droite. Le label est en mono, `letter-spacing: .3em`.

### 5.4 `StatBar.jsx`

```jsx
export default function StatBar({ label, value, display, suffix = '%', max = 100 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="bar">
      <div className="bar__head">
        <span className="bar__label">{label}</span>
        <span className="bar__value mono">{display}{suffix}</span>
      </div>
      <div className="bar__track" role="progressbar"
           aria-label={label} aria-valuenow={value}
           aria-valuemin={0} aria-valuemax={max}>
        <span className="bar__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
```

`role="progressbar"` + `aria-valuenow` : la barre est lisible par un lecteur d'écran.
`display` est la valeur animée ; `value` la valeur réelle (pour l'accessibilité).

---

## 6. Critères de validation

| # | Critère | Statut |
|---|---|---|
| 1 | Toutes les couleurs des composants passent par `var(--token)` | ☐ |
| 2 | Une carte de test affiche bien les angles coupés | ☐ |
| 3 | `.metal-text` rend un dégradé or lisible | ☐ |
| 4 | `useReveal` révèle les éléments au scroll, une seule fois | ☐ |
| 5 | `useCountUp` anime de 0 à la valeur cible | ☐ |
| 6 | `prefers-reduced-motion` neutralise animations et transitions | ☐ |
| 7 | Le site reste lisible avec le JS désactivé (pas de contenu masqué en `opacity: 0` critique) | ☐ |
