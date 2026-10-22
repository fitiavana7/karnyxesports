# PHASE 03 — Assets du logo

**Objectif :** produire à partir de `logo.jpeg` les images utilisées par le site — un emblème
recadré pour la navigation et le hero, une favicon — sans dépendance externe ni retouche
manuelle.

**Durée estimée :** 20 min
**Prérequis :** [PHASE 01](PHASE-01-socle-projet.md). Indépendant de la phase 02.

---

## 1. Analyse de `logo.jpeg`

| Propriété | Valeur |
|---|---|
| Dimensions | 842 × 842 |
| Format | JPEG, 24 bpp, sans couche alpha |
| Emblème central | x ≈ 230 → 700, y ≈ 130 → 600 |
| Tagline (petit texte) | y ≈ 620 → 700, à **exclure** du recadrage |

Recadrage retenu : `Rectangle(230, 130, 470, 470)` → carré 470 × 470 contenant l'emblème
entier, sans la baseline. La diagonale claire du fond est conservée : elle fait partie de la
composition.

---

## 2. Fichiers

| Action | Chemin | Rôle |
|---|---|---|
| Copier | `public/logo.jpeg` | logo complet avec tagline (usage futur, footer, press kit) |
| Générer | `public/emblem.jpg` | emblème 470 × 470 — nav, hero, footer |
| Générer | `public/favicon.png` | 96 × 96 — onglet de navigateur |
| Créer | `public/_redirects` | réécriture SPA (voir phase 01) |

---

## 3. Procédure de génération

PowerShell + `System.Drawing` (disponible sur Windows sans installation) :

```powershell
Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile("D:\ai-code\karnyx\logo.jpeg")
Copy-Item "D:\ai-code\karnyx\logo.jpeg" "D:\ai-code\karnyx\public\logo.jpeg" -Force

$rect = New-Object System.Drawing.Rectangle 230, 130, 470, 470

# Emblème
$crop = New-Object System.Drawing.Bitmap $rect.Width, $rect.Height
$g = [System.Drawing.Graphics]::FromImage($crop)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($src,
  (New-Object System.Drawing.Rectangle 0, 0, $rect.Width, $rect.Height),
  $rect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$crop.Save("D:\ai-code\karnyx\public\emblem.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop.Dispose()

# Favicon
$fav = New-Object System.Drawing.Bitmap 96, 96
$gf = [System.Drawing.Graphics]::FromImage($fav)
$gf.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gf.DrawImage($src,
  (New-Object System.Drawing.Rectangle 0, 0, 96, 96),
  $rect, [System.Drawing.GraphicsUnit]::Pixel)
$gf.Dispose()
$fav.Save("D:\ai-code\karnyx\public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fav.Dispose()

$src.Dispose()
```

### Pourquoi `.jpg` et pas `.png` pour l'emblème

Un PNG 470 × 470 d'une photographie pèse ~500 Ko ; le JPEG qualité 88 pèse **41 Ko**.
Visuellement identique à l'échelle d'affichage (la nav l'affiche à 38 px, le hero à 460 px).
La favicon reste en PNG (96 × 96, 25 Ko) car les onglets ont besoin de la netteté.

### Pourquoi ne pas tenter la transparence

La clé de couleur sur le fond ardoise risquerait de trouer les ombres de l'emblème. Le fond du
logo étant lui-même ardoise, la tuile carrée se fond dans les cartes `--bg-panel` sans
transparence. Ne pas tenter de PNG transparent sur le JPEG d'origine.

---

## 4. Intégration dans le code

```jsx
// Navigation
<img src="/emblem.jpg" alt="" className="nav__mark" width="38" height="38" />

// Hero
<img src="/emblem.jpg" alt="Emblème KARNYX" className="hero__emblem"
     width="460" height="460" />

// Footer
<img src="/emblem.jpg" alt="" className="footer__mark" width="48" height="48" />
```

`alt=""` sur le logo de nav et de footer : le motmark `KARNYX` en texte adjacent porte déjà
l'information. `alt="Emblème KARNYX"` sur le hero, qui est le seul endroit purement décoratif
sans doublon textuel.

Toujours renseigner `width` et `height` : évite le décalage de mise en page (CLS) au chargement.

---

## 5. Wordmark

Le logo ne contient pas de wordmark lisible à cette résolution : **ne pas tenter de le
redessiner en SVG**. Le nom « KARNYX » est rendu en texte avec `Chakra Petch 700` et
`letter-spacing: .22em`, ce qui donne un wordmark net, accessible et traduisible.

```jsx
<span className="nav__wordmark">
  KARNYX
  <span>eFootball</span>
</span>
```

---

## 6. Critères de validation

| # | Critère | Statut |
|---|---|---|
| 1 | `public/emblem.jpg` existe, ≤ 60 Ko | ☐ |
| 2 | `public/favicon.png` existe, ≤ 40 Ko | ☐ |
| 3 | `public/logo.jpeg` est une copie intacte de la source | ☐ |
| 4 | L'emblème ne contient pas la tagline | ☐ |
| 5 | L'emblème est net à 38 px (nav) comme à 460 px (hero) | ☐ |
| 6 | Aucun `alt` manquant sur les `<img>` | ☐ |
| 7 | La favicon reste lisible sur un onglet clair | ☐ |
