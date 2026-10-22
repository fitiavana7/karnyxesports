# PHASE 01 — Socle du projet

**Objectif :** obtenir un projet Vite + React qui démarre, avec le routeur en place, l'alias
`@` configuré, les polices chargées et les feuilles de style vides prêtes à recevoir la phase 02.

**Durée estimée :** 20 min
**Prérequis :** Node 18+ (`node -v`), npm.
**Vérifié sur :** Node v22.16.0 / npm 10.9.2

---

## 1. Fichiers

| Action | Chemin |
|---|---|
| Créer | `package.json` |
| Créer | `vite.config.js` |
| Créer | `index.html` |
| Créer | `src/main.jsx` |
| Créer | `src/AppShell.jsx` |
| Créer | `src/lib/assets.js` |
| Créer | `src/styles/tokens.css` (vide) |
| Créer | `src/styles/animations.css` (vide) |
| Créer | `src/styles/components.css` (vide) |
| Créer | `src/pages/Home.jsx` (placeholder) |
| Créer | `src/pages/PlayerPage.jsx` (placeholder) |

---

## 2. Tâches

### 2.1 `package.json`

```json
{
  "name": "karnyx",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.8"
  }
}
```

> `"type": "module"` est obligatoire : `vite.config.js` utilise `import.meta.url`.

### 2.2 `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { port: 5173, open: false },
})
```

L'alias `@` évite les imports relatifs `../../styles/...` dans les composants imbriqués.

### 2.3 `index.html`

Points non négociables :

- `lang="fr"` — le site est en français.
- `viewport` avec `viewport-fit=cover` (encoche mobile).
- `theme-color` = `#0B0F14` (fond de page, cf. phase 02).
- `preconnect` vers Google Fonts + la feuille `Chakra Petch / Inter / JetBrains Mono`
  (poids 500-700, `display=swap`).
- `<link rel="icon" type="image/png" href="/favicon.png" />` (asset produit en phase 03).

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0B0F14" />
    <meta name="description" content="KARNYX — équipe eFootball Mobile. Effectif, statistiques et contact." />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/emblem.jpg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap"
      rel="stylesheet"
    />
    <title>KARNYX — eFootball Mobile</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 2.4 `src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppShell from '@/AppShell'
import './styles/tokens.css'
import './styles/animations.css'
import './styles/components.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </StrictMode>
)
```

Ordre d'import des CSS : `tokens` (variables + reset) → `animations` → `components`.
Les variables doivent exister avant d'être utilisées.

Le routeur est monté dans `main.jsx` et **jamais** dans `AppShell` : c'est ce qui permet de
réutiliser le même arbre de composants avec `BrowserRouter` (site) ou `HashRouter` (version
fichier unique, cf. phase 08).

### 2.5 `src/AppShell.jsx` — routes + gestion du scroll

```jsx
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import PlayerPage from '@/pages/PlayerPage'

export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      requestAnimationFrame(() => {
        const target = document.getElementById(id)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export default function AppShell() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:slug" element={<PlayerPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
```

### 2.6 `src/lib/assets.js` — chemins des images

```js
const base = import.meta.env.BASE_URL ?? '/'

const registry =
  typeof window !== 'undefined' ? window.__KARNYX_ASSET_REGISTRY__ : null

export function asset(name) {
  if (registry && registry[name]) return registry[name]
  return `${base}${name}`.replace(/([^:])\/{2,}/g, '$1/')
}
```

`BASE_URL` vaut `/` en dev et en production, `./` dans la version fichier unique. Le registre
global permet d'injecter les images en `data:` URI quand le site est livré en un seul HTML.
**Aucun composant ne doit écrire `/emblem.jpg` en dur** : toujours passer par `asset()`.


> `ScrollManager` est indispensable : sans lui, un clic sur `/#effectif` depuis une fiche joueur
> ne défile pas, et le retour en haut de page ne se fait pas au changement de route.
>
> `Navbar` et `Footer` sont importés ici dès la phase 01 ; créer des stubs minimaux
> (`export default function Navbar() { return null }`) jusqu'à la phase 05.

### 2.7 Pages placeholder

`src/pages/Home.jsx` et `src/pages/PlayerPage.jsx` : un `<h1>` suffit pour valider le routeur.

### 2.8 `public/_redirects`

```
/*    /index.html   200
```

Nécessaire pour que les routes `/dergrosse` fonctionnent en hébergement statique
(Netlify, Cloudflare Pages). Pour Vercel, préférer un `vercel.json` avec des rewrites
(voir phase 08).

---

## 3. Installation et vérification

```bash
npm install
npm run dev
```

Contrôles :

- [ ] `http://localhost:5173` affiche la page placeholder sans erreur console.
- [ ] `http://localhost:5173/dergrosse` affiche la page joueur (pas de 404 Vite).
- [ ] `http://localhost:5173/xyzzy` affiche la page joueur (le 404 métier est traité
      en phase 07, pas ici).
- [ ] Les polices `Chakra Petch` / `Inter` / `JetBrains Mono` sont chargées
      (DevTools → Network → Fonts).
- [ ] `npm run build` réussit.

---

## 4. Pièges connus

- **Supprimer `logo.jpeg` / `PHASE*.md`** : le dossier de travail contient déjà ces fichiers.
  Ne pas lancer `npm create vite .` à la racine sans `--template`, cela écrase.
- **`behavior: 'instant'`** n'est pas dans toutes les implémentations de `scrollTo` :
  utiliser `'auto'` en fallback si la console signale une valeur invalide.
- **React 18 StrictMode** monte les effets deux fois en dev : c'est normal, mais les
  `IntersectionObserver` doivent être correctement disconnected (voir phase 02).

---

## 5. Critères de validation

| # | Critère | Statut |
|---|---|---|
| 1 | `npm install` sans erreur | ☐ |
| 2 | `npm run dev` sert la page sur `/` | ☐ |
| 3 | `/dergrosse` est routée (pas de 404) | ☐ |
| 4 | Polices Google chargées | ☐ |
| 5 | `npm run build` produit `dist/` | ☐ |
| 6 | Alias `@` importable depuis `src/` | ☐ |
