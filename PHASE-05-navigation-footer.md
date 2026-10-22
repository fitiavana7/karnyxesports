# PHASE 05 — Navigation et pied de page

**Objectif :** poser le chrome commun à toutes les pages — navbar sticky avec wordmark,
liens d'ancrage, CTA de recrutement, menu mobile, et footer complet.

**Durée estimée :** 1 h
**Prérequis :** [PHASE 02](PHASE-02-design-system.md), [PHASE 04](PHASE-04-donnees-effectif.md)

---

## 1. Fichiers

| Action | Chemin |
|---|---|
| Créer | `src/components/Navbar.jsx` |
| Créer | `src/components/Footer.jsx` |
| Créer | `src/components/Icon.jsx` |
| Modifier | `src/styles/components.css` (styles `.nav*`, `.footer*`) |

---

## 2. `src/components/Icon.jsx`

Toutes les icônes sont des SVG inline dans un seul fichier — aucune dépendance externe, aucune
police d'icônes, contrôle total du `currentColor`.

| Export | Usage |
|---|---|
| `IconArrowLeft` / `IconArrowRight` | navigation entre fiches joueurs |

> Les icônes de réseaux sociaux (Discord, Twitch, YouTube, X, Instagram) ont été supprimées :
> aucun de ces comptes n'existe pour KARNYX. Elles ne doivent être réintroduites qu'en même
> temps qu'un lien réel dans `src/data/team.js`.

Exemple :

```jsx
export function IconArrowLeft(props) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true" {...props}>
      <path d="M6 1L1 6L6 11M1 6H15" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
```

`aria-hidden="true"` systématique : les icônes sont décoratives, le libellé est dans le texte
voisin.

---

## 3. `src/components/Navbar.jsx`

### 3.1 Comportements

| Comportement | Détail |
|---|---|
| Fond translucide | `rgba(11,15,20,.72)` + `backdrop-filter: blur(14px)` ; passe à `.94` après 24 px de scroll |
| Menu mobile | burger visible < 900 px ; panneau déroulant sous la navbar |
| Liens d'ancrage | sur `/` → `#effectif` ; sur une fiche → `/#effectif` (retour accueil + ancre) |
| Lien actif | underscore or sous le libellé quand `location.hash` correspond |
| Fermeture | le menu mobile se ferme au changement de route (`pathname` ou `hash`) |

### 3.2 Implémentation

```jsx
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks, team } from '@/data/team'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  const isHome = location.pathname === '/'
  const activeHash = location.hash.replace('#', '')

  const linkTo = (id) => (isHome ? `#${id}` : `/#${id}`)

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="nav__brand" aria-label="KARNYX — accueil">
            <img src="/emblem.jpg" alt="" className="nav__mark" width="38" height="38" />
            <span className="nav__wordmark">
              KARNYX
              <span>eFootball</span>
            </span>
          </Link>

          <nav className="nav__links" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <Link key={link.id} to={linkTo(link.id)}
                className={`nav__link ${isHome && activeHash === link.id ? 'is-active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav__actions">
            <Link to={linkTo('contact')} className="btn btn--primary nav__cta">
              Rejoindre l'équipe
            </Link>
            <button type="button"
              className={`nav__burger ${open ? 'is-open' : ''}`}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}>
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`nav__mobile ${open ? 'is-open' : ''}`}>
        {navLinks.map((link) => (
          <Link key={link.id} to={linkTo(link.id)}
            className={isHome && activeHash === link.id ? 'is-active' : ''}>
            {link.label}
          </Link>
        ))}
        <Link to={linkTo('contact')}>Rejoindre l'équipe</Link>
        <span className="mono" style={{ color: 'var(--text-low)', fontSize: '0.7rem' }}>
          {team.region} · {team.division}
        </span>
      </div>
    </>
  )
}
```

### 3.3 Points d'attention

- **Utiliser `Link` de react-router, pas `<a href>`** : un `<a href="/#effectif">` provoque un
  rechargement complet de page. `Link` met à jour `location.hash` → le `ScrollManager` de la
  phase 01 déclenche le `scrollIntoView`.
- **`aria-expanded` sur le burger** : l'état du menu doit être exposé au lecteur d'écran.
- **Le burger est un `<span>` unique** dont les pseudo-éléments forment les trois barres ;
  l'état `.is-open` les fait pivoter en croix.

---

## 4. `src/components/Footer.jsx`

Trois colonnes :

1. **Marque** — emblème, wordmark, slogan, ligue et place au classement.
2. **Navigation** — Accueil + les 4 ancres (issues de `navLinks`).
3. **Effectif** — les 6 premiers joueurs en liens directs + un lien « Voir les 12 joueurs → »
   vers `/#effectif` en or.

Barre basse : copyright, région, et le badge obligatoire
`Maquette — données fictives`.

```jsx
<div className="footer__bottom">
  <span>
    © {new Date().getFullYear()} KARNYX — {team.region}. Tous droits réservés.
  </span>
  <span className="footer__fictif">Maquette — données fictives</span>
</div>
```

> **Aucun lien social dans le footer.** Les 5 icônes de réseaux ont été retirées : les comptes
> n'existent pas, et un lien mort se voit immédiatement. Elles reviendront avec de vraies URL.

---

## 5. Styles (`src/styles/components.css`)

Sélecteurs à écrire : `.nav`, `.nav__inner`, `.nav__brand`, `.nav__mark`, `.nav__wordmark`,
`.nav__links`, `.nav__link` (+ `::after` = trait or de 0 → 100 % au survol), `.nav__actions`,
`.nav__cta`, `.nav__burger` (+ `.is-open`), `.nav__mobile` (+ `.is-open`),
`.footer`, `.footer__grid`, `.footer__brand`, `.footer__mark`, `.footer__tagline`,
`.footer__title`, `.footer__links`, `.footer__bottom`, `.footer__fictif`.

Points :

- `.nav` → `position: fixed; inset: 0 0 auto 0; z-index: 90; height: var(--nav-h)`.
- `.nav__mobile` → `position: fixed; inset: var(--nav-h) 0 auto 0; z-index: 89; display: none`
  puis `display: flex` en `.is-open`.
- `.nav__link::after` → `position: absolute; bottom: -8px; height: 1px; width: 0;
  background: var(--gold-500); transition: width .3s var(--ease)` → `width: 100%` au survol.
- `.footer__grid` → `grid-template-columns: 1.4fr 1fr 1fr; gap: 44px`.

### Responsive

```css
@media (max-width: 900px) {
  .nav__links, .nav__cta { display: none; }
  .nav__burger { display: flex; }
}
@media (max-width: 720px) {
  .footer__grid { grid-template-columns: 1fr; gap: 34px; }
}
```

---

## 6. Critères de validation

| # | Critère | Statut |
|---|---|---|
| 1 | La navbar est fixe et floute le contenu au scroll | ☐ |
| 2 | Les ancres `#effectif` / `#statistiques` / `#contact` défilent correctement | ☐ |
| 3 | Depuis `/dergrosse`, un lien de nav ramène à l'accueil **et** à l'ancre | ☐ |
| 4 | Le burger s'ouvre et se ferme, `aria-expanded` suit l'état | ☐ |
| 5 | Le menu mobile se referme au changement de route | ☐ |
| 6 | Le footer liste les 3 ancres et 6 joueurs | ☐ |
| 7 | Le badge « maquette — données fictives » est visible | ☐ |
| 8 | Navigation clavier : focus visible or sur tous les liens | ☐ |
