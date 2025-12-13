# Guide de personnalisation visuelle

Ce guide explique comment personnaliser l'apparence des panels (couleurs, espacements, effets visuels, typographie) sans toucher aux fonctionnalités techniques.

---

## Table des matières

1. [Couleurs et gradients](#couleurs-et-gradients)
2. [Icônes des panels](#icônes-des-panels)
3. [Espacements (gaps, padding, marges)](#espacements-gaps-padding-marges)
4. [Effets visuels (hover, bordures, ombres)](#effets-visuels-hover-bordures-ombres)
5. [Breakpoints responsive](#breakpoints-responsive)
6. [Tailles de police](#tailles-de-police)
7. [Largeurs de colonnes](#largeurs-de-colonnes)
8. [Ordre des panels sur mobile/tablet](#ordre-des-panels-sur-mobiletablet)

---

## Couleurs et gradients

### Fichier à modifier
`src/modules/concordance-analyzer/config/panelConfig.js`

### Palette de couleurs disponibles

Le thème utilise une palette "académique" inspirée des manuscrits médiévaux :

```javascript
// Couleurs principales (bruns encre)
visualTheme.colors.primary.main      // #5C3317 - Brun encre principal
visualTheme.colors.primary.light     // #704214 - Brun encre moyen
visualTheme.colors.primary.dark      // #3E2723 - Brun sépia foncé

// Couleurs d'accent
visualTheme.colors.accent.gold       // #B8860B - Or antique
visualTheme.colors.accent.goldLight  // #D4AF37 - Or clair
visualTheme.colors.accent.green      // #2D5016 - Vert malachite
visualTheme.colors.accent.red        // #B91C1C - Rouge vermillon
visualTheme.colors.primary.blue      // #1e3a8a - Bleu lapis-lazuli
visualTheme.colors.primary.blueHover // #1e40af - Bleu lapis hover
```

### Structure d'un panel

Chaque panel a 3 propriétés de couleur :

```javascript
concordances: {
  color: '#5C3317',                                    // Couleur de base (référence)
  gradient: createGradient('#5C3317', '#704214'),      // Fond en dégradé
  textColor: '#FFFFFF'                                 // Couleur du texte (optionnel, blanc par défaut)
}
```

### Changer la couleur d'un panel

**Exemple : Passer le panel Import en bleu**

```javascript
// AVANT
concordances: {
  color: '#5C3317',
  gradient: createGradient('#5C3317', '#704214'),
  icon: '⊞',
  gridArea: '1 / 1 / 2 / 2',
  size: 'medium'
}

// APRÈS
concordances: {
  color: visualTheme.colors.primary.blue,
  gradient: createGradient(visualTheme.colors.primary.blue, visualTheme.colors.primary.blueHover),
  textColor: '#FFFFFF',  // Blanc pour contraste sur bleu
  icon: '⊞',
  gridArea: '1 / 1 / 2 / 2',
  size: 'medium'
}
```

### Créer un gradient personnalisé

La fonction `createGradient(couleur1, couleur2)` génère un dégradé diagonal (135deg).

**Exemples :**

```javascript
// Dégradé brun → or
gradient: createGradient('#5C3317', '#B8860B')

// Dégradé vert → vert foncé
gradient: createGradient(visualTheme.colors.accent.green, '#1F3510')

// Dégradé bleu → bleu foncé
gradient: createGradient('#1e3a8a', '#1e40af')

// Dégradé rouge (pour erreurs/alertes)
gradient: createGradient('#B91C1C', '#7F1D1D')
```

### Couleur de texte personnalisée

Par défaut, le texte est **blanc (#FFFFFF)**. Pour les fonds clairs (or, jaune), utiliser du texte foncé :

```javascript
temporal: {
  color: visualTheme.colors.accent.gold,
  gradient: createGradient(visualTheme.colors.accent.gold, visualTheme.colors.accent.goldLight),
  textColor: visualTheme.colors.primary.dark,  // ✅ Texte brun sur fond or
  icon: '⧗',
  gridArea: '1 / 4 / 2 / 5',
  size: 'medium'
}
```

### Palette complète `visualTheme.colors`

Localisation : `src/shared/theme/globalTheme.js` (ou équivalent)

```javascript
visualTheme.colors = {
  primary: {
    main: '#5C3317',      // Brun encre
    light: '#704214',     // Brun clair
    dark: '#3E2723',      // Sépia
    blue: '#1e3a8a',      // Bleu lapis
    blueHover: '#1e40af'
  },
  accent: {
    gold: '#B8860B',      // Or antique
    goldLight: '#D4AF37', // Or clair (bordures)
    green: '#2D5016',     // Vert malachite
    red: '#B91C1C'        // Rouge vermillon
  },
  text: {
    dark: '#1e293b'       // Texte général
  }
}
```

---

## Icônes des panels

### Fichier à modifier
`src/modules/concordance-analyzer/config/panelConfig.js`

### Icônes actuelles (Décembre 2025)

| Panel | Icône | Code Unicode | Signification |
|-------|-------|--------------|---------------|
| Vue d'ensemble | ◈ | U+25C8 | Diamant/ornement académique |
| Import | ⊞ | U+229E | Carré plus (ajout/catalogue) |
| Domaines | ⚜ | U+269C | Fleur de lys (académique) |
| Chronologie | ⧗ | U+29D7 | Sablier (temporel) |
| Lieux | ✦ | U+2726 | Étoile (cartographie) |
| Auteurs | ✒ | U+2712 | Plume calligraphique |
| Terminologie | ❦ | U+2766 | Hedera (ornement textuel) |
| Données | ⟐ | U+27D0 | Tablette/manuscrit |
| Comparaison | ⚖ | U+2696 | Balance (justice) |

### Changer une icône

**Simple : Remplacer le caractère Unicode**

```javascript
// AVANT
concordances: {
  icon: '⊞',  // Carré plus
  ...
}

// APRÈS - Utiliser une icône de dossier
concordances: {
  icon: '📁',  // Dossier emoji
  ...
}

// APRÈS - Utiliser une icône de flèche
concordances: {
  icon: '⬆',  // Flèche montante
  ...
}
```

### Ressources pour trouver des icônes

**Unicode uniquement** (pas d'images, pas de Font Awesome) :

1. **Unicode Table** : https://unicode-table.com
   - Sections utiles :
     - Geometric Shapes (▲ ● ◆)
     - Miscellaneous Symbols (☰ ⚙ ⚡)
     - Arrows (→ ⇄ ⬆)
     - Dingbats (✓ ✕ ✦)
     - Mathematical Operators (∑ ∫ ⊕)

2. **Unicode Characters** : https://www.compart.com/en/unicode/
   - Recherche par mots-clés en anglais

3. **Emojis** : https://emojipedia.org
   - ⚠️ Attention : Certains emojis ne s'affichent pas partout
   - Préférer les symboles Unicode classiques

### Contraintes techniques

- ✅ **1 seul caractère** (pas de combinaisons)
- ✅ **Unicode standard** (U+0000 à U+FFFF de préférence)
- ❌ **Pas de Font Awesome** ou icônes externes
- ❌ **Éviter les emojis complexes** (🧑‍💻) qui peuvent mal s'afficher

### Exemples d'icônes utiles

```javascript
// Navigation
icon: '⌂'   // Maison
icon: '☰'   // Menu hamburger
icon: '⚙'   // Engrenage (paramètres)

// Actions
icon: '⊕'   // Plus encerclé
icon: '⊖'   // Moins encerclé
icon: '⇄'   // Flèches échange
icon: '⟳'   // Actualiser

// Données
icon: '📊'  // Graphique
icon: '📈'  // Tendance montante
icon: '⊞'   // Import/catalogue

// Temps
icon: '⧗'   // Sablier
icon: '⌚'   // Montre
icon: '📅'  // Calendrier

// Localisation
icon: '🌍'  // Globe
icon: '📍'  // Pin localisation
icon: '✦'   // Étoile (carte)

// Académique
icon: '⚜'   // Fleur de lys
icon: '✒'   // Plume
icon: '❦'   // Hedera (ornement)
icon: '◈'   // Diamant
```

---

## Espacements (gaps, padding, marges)

### Fichier à modifier
`src/modules/concordance-analyzer/components/views/OverviewView.jsx`

### Gap entre les panels (espacement de la grille)

**Configuration actuelle :**

```javascript
const gridGap = useResponsiveValue({
  xs: '2px',   // Mobile
  md: '2px',   // Tablet
  lg: '2px'    // Desktop
});
```

**Modifier pour plus d'espace entre les panels :**

```javascript
const gridGap = useResponsiveValue({
  xs: '4px',   // Mobile: double espace
  md: '6px',   // Tablet: espace moyen
  lg: '8px'    // Desktop: espace généreux
});
```

**Valeurs recommandées :**
- `'2px'` - Compact, panels très proches (actuel)
- `'4px'` - Espace subtil
- `'8px'` - Espace confortable
- `'12px'` - Espace généreux
- `'16px'` - Beaucoup d'espace (peut réduire taille panels)

### Padding du conteneur (autour de toute la grille)

**Configuration actuelle :**

```javascript
const containerPadding = useResponsiveValue({
  xs: '2px',   // Mobile
  md: '2px',   // Tablet
  lg: '2px'    // Desktop
});
```

**Modifier pour plus de marge autour :**

```javascript
const containerPadding = useResponsiveValue({
  xs: '8px',    // Mobile: petit padding
  md: '12px',   // Tablet: padding moyen
  lg: '16px'    // Desktop: padding généreux
});
```

### Padding interne des panels

**Fichier :** `src/modules/concordance-analyzer/components/ui/NavigationPanel.jsx` (ligne ~95)

**Configuration actuelle :**

```javascript
padding: config.size === 'large' ? '3rem' : config.size === 'wide' ? '2rem' : '2rem'
```

**Modifier :**

```javascript
// Plus d'espace interne
padding: config.size === 'large' ? '4rem' : config.size === 'wide' ? '3rem' : '2.5rem'

// Moins d'espace (plus compact)
padding: config.size === 'large' ? '2rem' : config.size === 'wide' ? '1.5rem' : '1.5rem'
```

**Correspondance tailles :**
- `size: 'medium'` → padding par défaut `2rem` (32px)
- `size: 'wide'` → padding par défaut `2rem` (32px)
- `size: 'large'` → padding par défaut `3rem` (48px)

---

## Effets visuels (hover, bordures, ombres)

### Fichier à modifier
`src/modules/concordance-analyzer/components/ui/NavigationPanel.jsx`

### Bordures

**Configuration actuelle (ligne ~100) :**

```javascript
border: isActive ? '2px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.2)'
```

**Décomposition :**
- Panel actif : bordure **2px or (#D4AF37)**
- Panel inactif : bordure **1px or transparent (20% opacité)**

**Exemples de modifications :**

```javascript
// Bordure plus épaisse
border: isActive ? '3px solid #D4AF37' : '2px solid rgba(212, 175, 55, 0.3)'

// Bordure de couleur différente (bleu)
border: isActive ? '2px solid #1e3a8a' : '1px solid rgba(30, 58, 138, 0.2)'

// Sans bordure pour panels inactifs
border: isActive ? '2px solid #D4AF37' : 'none'

// Bordure arrondie (rayon)
border: isActive ? '2px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.2)',
borderRadius: '12px'  // Au lieu de '6px' (actuel)
```

### Bordure conditionnelle (exemple : panel Import vide)

**Fichier :** `src/modules/concordance-analyzer/components/views/OverviewView.jsx` (ligne ~328)

**Configuration actuelle :**

```javascript
<NavigationPanel
  config={panelConfig.concordances}
  style={
    !parseStats.itemCount || parseStats.itemCount === 0
      ? { border: '2px solid #D4AF37' }  // Or quand vide
      : {}
  }
>
```

**Exemples de modifications :**

```javascript
// Bordure rouge clignotante quand vide (attire l'attention)
style={
  !parseStats.itemCount
    ? {
        border: '3px solid #B91C1C',  // Rouge
        animation: 'pulse 2s infinite'
      }
    : {}
}

// Bordure avec ombre quand vide
style={
  !parseStats.itemCount
    ? {
        border: '2px solid #D4AF37',
        boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)'
      }
    : {}
}
```

### Effets au survol (hover)

**Configuration actuelle (ligne ~101-104) :**

```javascript
transform: isHovered ? 'scale(1.01)' : 'scale(1)',
boxShadow: isHovered
  ? '0 4px 12px rgba(92, 51, 23, 0.2)'
  : '0 2px 6px rgba(92, 51, 23, 0.12)'
```

**Décomposition :**
- Hover : **agrandit de 1%** + **ombre portée 12px**
- Normal : **taille normale** + **ombre portée 6px**

**Exemples de modifications :**

```javascript
// Effet de survol plus prononcé
transform: isHovered ? 'scale(1.03)' : 'scale(1)',  // +3% au lieu de +1%
boxShadow: isHovered
  ? '0 8px 24px rgba(92, 51, 23, 0.3)'  // Ombre plus grande et foncée
  : '0 2px 6px rgba(92, 51, 23, 0.12)'

// Effet subtil (presque invisible)
transform: isHovered ? 'scale(1.005)' : 'scale(1)',  // +0.5%
boxShadow: isHovered
  ? '0 2px 8px rgba(92, 51, 23, 0.15)'
  : '0 1px 3px rgba(92, 51, 23, 0.1)'

// Sans transformation, juste l'ombre
transform: 'scale(1)',  // Pas de zoom
boxShadow: isHovered
  ? '0 6px 16px rgba(92, 51, 23, 0.25)'
  : '0 2px 6px rgba(92, 51, 23, 0.12)'
```

### Overlay au survol

**Configuration actuelle (ligne ~142-151) :**

```javascript
{isHovered && (
  <div style={{
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(255,255,255,0.05)',  // Blanc 5% opacité
    pointerEvents: 'none'
  }} />
)}
```

**Exemples de modifications :**

```javascript
// Overlay plus visible
background: 'rgba(255,255,255,0.1)'  // 10% opacité

// Overlay foncé (assombrit le panel)
background: 'rgba(0,0,0,0.1)'  // Noir 10%

// Overlay doré
background: 'rgba(212, 175, 55, 0.15)'  // Or 15%

// Pas d'overlay
{/* Supprimer complètement le bloc isHovered */}
```

### Transition (vitesse des animations)

**Configuration actuelle (ligne ~97) :**

```javascript
transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms ease'
```

**Exemples de modifications :**

```javascript
// Transitions plus rapides (snappy)
transition: 'transform 150ms ease-out, box-shadow 100ms ease'

// Transitions plus lentes (smooth)
transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 400ms ease'

// Transitions instantanées (pas d'animation)
transition: 'none'
```

---

## Breakpoints responsive

### Fichier de référence
`src/shared/hooks/useBreakpoint.js` (ou équivalent - à vérifier)

### Breakpoints actuels (valeurs estimées)

| Nom | Largeur écran | Appareil typique | Colonnes grille |
|-----|---------------|------------------|-----------------|
| `xs` | 0 - 639px | Mobile portrait | 1 colonne |
| `sm` | 640px - 767px | Mobile paysage | 1 colonne |
| `md` | 768px - 1023px | Tablet | 2 colonnes |
| `lg` | 1024px+ | Desktop | 4 colonnes |

### Tester un breakpoint

**Dans le navigateur :**
1. Ouvrir les DevTools (F12)
2. Activer le mode responsive (Ctrl+Shift+M)
3. Tester les largeurs :
   - **Mobile** : 375px, 414px (iPhone)
   - **Tablet** : 768px, 1024px (iPad)
   - **Desktop** : 1280px, 1440px, 1920px

### Modifier les valeurs responsive

**Exemple :** `gridTemplateColumns` dans `OverviewView.jsx`

```javascript
const gridTemplateColumns = useResponsiveValue({
  xs: '1fr',                    // Mobile: 1 colonne
  sm: '1fr',                    // Phone landscape: 1 colonne
  md: 'repeat(2, 1fr)',         // Tablet: 2 colonnes
  lg: 'minmax(400px, 1.3fr) repeat(3, minmax(200px, 0.6fr))'  // Desktop: 4 colonnes
});
```

**Passer en 3 colonnes sur desktop :**

```javascript
const gridTemplateColumns = useResponsiveValue({
  xs: '1fr',
  sm: '1fr',
  md: 'repeat(2, 1fr)',
  lg: 'repeat(3, 1fr)'  // Desktop: 3 colonnes égales
});
```

**⚠️ Attention :** Changer le nombre de colonnes nécessite de réajuster les `gridArea` dans `panelConfig.js`.

---

## Tailles de police

### Fichier à modifier
`src/modules/concordance-analyzer/components/views/OverviewView.jsx`

### Tailles actuelles

#### 1. Statistiques principales (`mainStatFontSize`)

```javascript
const mainStatFontSize = useResponsiveValue({
  xs: '3rem',      // Mobile: 48px
  sm: '3.5rem',    // Phone landscape: 56px
  md: '4rem',      // Tablet: 64px
  lg: '5rem'       // Desktop: 80px
});
```

**Utilisation :** Nombre principal dans le panel "Vue d'ensemble"

**Modifier :**

```javascript
// Plus grand (pour mettre en valeur)
const mainStatFontSize = useResponsiveValue({
  xs: '3.5rem',
  sm: '4rem',
  md: '5rem',
  lg: '6rem'      // Desktop: 96px
});

// Plus petit (plus discret)
const mainStatFontSize = useResponsiveValue({
  xs: '2.5rem',
  sm: '3rem',
  md: '3.5rem',
  lg: '4rem'      // Desktop: 64px
});
```

#### 2. Statistiques secondaires (`statFontSize`)

```javascript
const statFontSize = useResponsiveValue({
  xs: '2rem',      // Mobile: 32px
  sm: '2.2rem',    // Phone landscape: 35px
  md: '2.3rem',    // Tablet: 37px
  lg: '2.5rem'     // Desktop: 40px
});
```

**Utilisation :** Chiffres dans tous les autres panels (Domaines, Auteurs, etc.)

**Modifier :**

```javascript
// Augmenter uniformément de 20%
const statFontSize = useResponsiveValue({
  xs: '2.4rem',    // +20%
  sm: '2.64rem',
  md: '2.76rem',
  lg: '3rem'       // Desktop: 48px
});
```

### Autres tailles de police

**Titres des panels** (dans `NavigationPanel.jsx` ligne ~129) :

```javascript
fontSize: config.size === 'large' ? '2rem' : config.size === 'wide' ? '1.5rem' : '1.3rem'
```

**Sous-titres des panels** (ligne ~118) :

```javascript
fontSize: '0.85rem'
```

**Modifier les titres :**

```javascript
// Titres plus gros
fontSize: config.size === 'large' ? '2.5rem' : config.size === 'wide' ? '1.8rem' : '1.6rem'

// Titres plus petits
fontSize: config.size === 'large' ? '1.5rem' : config.size === 'wide' ? '1.2rem' : '1rem'
```

---

## Largeurs de colonnes

### Fichier à modifier
`src/modules/concordance-analyzer/components/views/OverviewView.jsx`

### Configuration actuelle (Desktop)

```javascript
const gridTemplateColumns = useResponsiveValue({
  xs: '1fr',                    // Mobile: 1 colonne
  sm: '1fr',                    // Phone landscape: 1 colonne
  md: 'repeat(2, 1fr)',         // Tablet: 2 colonnes égales
  lg: 'minmax(400px, 1.3fr) repeat(3, minmax(200px, 0.6fr))'  // Desktop: 4 colonnes asymétriques
});
```

### Comprendre la syntaxe Desktop

```javascript
lg: 'minmax(400px, 1.3fr) repeat(3, minmax(200px, 0.6fr))'
    └──────┬──────────┘   └────────────┬────────────────┘
           │                           │
    Colonne 1                    Colonnes 2-3-4
    (plus large)              (3x plus étroites)
```

**Décomposition :**
- **Colonne 1** : minimum 400px, proportion 1.3fr (130%)
- **Colonnes 2-3-4** : minimum 200px chacune, proportion 0.6fr (60%) chacune

**Total proportions :** 1.3 + 0.6 + 0.6 + 0.6 = **3.1fr**

### Exemples de modifications

#### Toutes les colonnes égales

```javascript
lg: 'repeat(4, 1fr)'  // 4 colonnes de taille identique
```

#### Colonne 1 beaucoup plus large

```javascript
lg: 'minmax(500px, 2fr) repeat(3, minmax(180px, 0.5fr))'
// Colonne 1: min 500px, proportion 2fr (200%)
// Colonnes 2-3-4: min 180px, proportion 0.5fr (50%)
```

#### 3 colonnes au lieu de 4

```javascript
lg: 'repeat(3, 1fr)'  // 3 colonnes égales
```

**⚠️ Attention :** Changer le nombre de colonnes nécessite de **réorganiser les `gridArea`** dans `panelConfig.js`.

#### Colonnes 1-2 larges, colonnes 3-4 étroites

```javascript
lg: 'repeat(2, minmax(300px, 1fr)) repeat(2, minmax(200px, 0.7fr))'
// Colonnes 1-2: 300px min, 1fr
// Colonnes 3-4: 200px min, 0.7fr
```

### Valeurs recommandées

| Configuration | Cas d'usage |
|--------------|-------------|
| `'repeat(4, 1fr)'` | Toutes colonnes égales, symétrique |
| `'minmax(400px, 1.3fr) repeat(3, minmax(200px, 0.6fr))'` | **ACTUEL** - Colonne 1 plus large |
| `'minmax(500px, 2fr) repeat(3, minmax(150px, 0.5fr))'` | Colonne 1 très large (panel principal) |
| `'repeat(3, 1fr)'` | 3 colonnes égales (nécessite réorganisation) |
| `'1fr 1fr 1fr 0.5fr'` | 3 colonnes normales + 1 sidebar |

---

## Ordre des panels sur mobile/tablet

### Problème

Sur **desktop**, l'ordre est défini par `gridArea` dans `panelConfig.js`.
Sur **mobile/tablet**, l'ordre est défini par l'**ordre JSX** dans `OverviewView.jsx`.

### Fichier à modifier
`src/modules/concordance-analyzer/components/views/OverviewView.jsx`

### Ordre JSX actuel (ligne ~246+)

```jsx
return (
  <div style={{...}}>
    {/* 1. Vue d'ensemble */}
    <NavigationPanel config={panelConfig.overview} ...>

    {/* 2. Import */}
    <NavigationPanel config={panelConfig.concordances} ...>

    {/* 3. Domaines */}
    <NavigationPanel config={panelConfig.domains} ...>

    {/* 4. Chronologie */}
    <NavigationPanel config={panelConfig.temporal} ...>

    {/* 5. Auteurs */}
    <NavigationPanel config={panelConfig.authors} ...>

    {/* 6. Terminologie */}
    <NavigationPanel config={panelConfig.linguistic} ...>

    {/* 7. Comparaison Corpus */}
    <NavigationPanel config={panelConfig.corpusComparison} ...>

    {/* 8. Données */}
    <NavigationPanel config={panelConfig.data} ...>

    {/* 9. Lieux */}
    <NavigationPanel config={panelConfig.places} ...>
  </div>
);
```

### Réorganiser pour mobile

**Exemple :** Mettre Import en premier sur mobile

Il suffit de **couper/coller** le bloc `<NavigationPanel config={panelConfig.concordances}>` en première position :

```jsx
return (
  <div style={{...}}>
    {/* 1. Import - EN PREMIER sur mobile */}
    <NavigationPanel config={panelConfig.concordances} ...>

    {/* 2. Vue d'ensemble */}
    <NavigationPanel config={panelConfig.overview} ...>

    {/* 3. Domaines */}
    <NavigationPanel config={panelConfig.domains} ...>

    {/* ... reste inchangé ... */}
  </div>
);
```

**✅ Résultat :**
- **Desktop** : Import reste en haut à gauche (défini par `gridArea: '1 / 1 / 2 / 2'`)
- **Mobile** : Import devient le premier panel affiché (ordre JSX)

### ⚠️ Important

- L'ordre JSX **n'affecte que mobile/tablet** (xs, sm, md)
- L'ordre desktop est **toujours** défini par `gridArea` dans `panelConfig.js`
- Les deux ordres sont **indépendants**

---

## Checklist de personnalisation visuelle

### Couleurs
- [ ] Ouvrir `src/modules/concordance-analyzer/config/panelConfig.js`
- [ ] Identifier le panel à modifier
- [ ] Changer `color`, `gradient`, et/ou `textColor`
- [ ] Utiliser `visualTheme.colors` ou codes hex personnalisés
- [ ] Tester le contraste texte/fond
- [ ] Commit et push

### Icônes
- [ ] Ouvrir `panelConfig.js`
- [ ] Trouver le panel à modifier
- [ ] Chercher une icône Unicode sur unicode-table.com
- [ ] Remplacer la propriété `icon`
- [ ] Vérifier l'affichage dans le navigateur
- [ ] Commit et push

### Espacements
- [ ] Ouvrir `OverviewView.jsx`
- [ ] Modifier `gridGap` (entre panels) ou `containerPadding` (autour grille)
- [ ] Sauvegarder et tester avec hard refresh
- [ ] Vérifier que les panels ne débordent pas
- [ ] Commit et push

### Effets visuels
- [ ] Ouvrir `NavigationPanel.jsx`
- [ ] Modifier `border`, `boxShadow`, `transform` selon besoin
- [ ] Tester l'effet au survol
- [ ] Vérifier sur mobile (effets hover inexistants)
- [ ] Commit et push

### Tailles de police
- [ ] Ouvrir `OverviewView.jsx`
- [ ] Modifier `statFontSize` ou `mainStatFontSize`
- [ ] Ajuster pour tous breakpoints (xs, sm, md, lg)
- [ ] Vérifier que le texte ne déborde pas des panels
- [ ] Commit et push

### Ordre mobile
- [ ] Ouvrir `OverviewView.jsx`
- [ ] Couper/coller les blocs `<NavigationPanel>` dans l'ordre souhaité
- [ ] Tester sur mobile (DevTools mode responsive)
- [ ] Vérifier que desktop n'est pas affecté
- [ ] Commit et push

---

## Ressources

- [CSS Grid Guide (MDN)](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout)
- [Unicode Table](https://unicode-table.com) - Recherche d'icônes
- [Coolors](https://coolors.co) - Générateur de palettes
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Vérifier contraste texte/fond

---

**Dernière mise à jour :** Décembre 2025
**Auteur :** Claude (CiSaMe Toolkit Team)
