# Conventions CSS - CiSaMe Toolkit

## Architecture du système de styles

```
src/
├── styles/                    # Styles globaux
│   ├── fonts.css             # @font-face Unistra
│   ├── unistra-theme.css     # Variables CSS de fallback
│   └── unistra-boxes.css     # Composants Unistra réutilisables
│
├── shared/theme/
│   ├── globalTheme.js        # SOURCE DE VÉRITÉ du thème
│   ├── RESPONSIVE_GUIDE.md   # Guide responsive
│   └── CSS_CONVENTIONS.md    # Ce fichier
│
└── modules/*/
    └── styles/
        └── *.module.css      # CSS Modules scopés
```

## Source de vérité

**`globalTheme.js` est la source unique de vérité pour le thème.**

Les variables CSS sont injectées dynamiquement via `injectCSSVariables()` dans `main.jsx`.

## Quand utiliser quoi ?

| Situation | Approche | Exemple |
|-----------|----------|---------|
| Composant React avec états dynamiques | Inline styles + globalTheme | `style={{ color: globalTheme.colors.primary.main }}` |
| Composant UI réutilisable (form, card) | CSS Module | `FormField.module.css` |
| Styles globaux (body, reset, fonts) | CSS global | `fonts.css` |
| Composants génériques Unistra | Classes CSS globales | `.unistra-box`, `.unistra-card` |

## Variables CSS disponibles

Après l'appel de `injectCSSVariables()`, ces variables sont disponibles :

### Couleurs
```css
--color-primary-main, --color-primary-light, --color-primary-dark
--color-secondary-main, --color-secondary-light, --color-secondary-dark
--color-bg-default, --color-bg-paper, --color-bg-card, --color-bg-hover
--color-text-primary, --color-text-secondary, --color-text-muted
--color-border-light, --color-border-medium, --color-border-strong
```

### Couleurs sémantiques
```css
--semantic-info-background, --semantic-info-border, --semantic-info-text, --semantic-info-icon
--semantic-success-background, --semantic-success-border, --semantic-success-text
--semantic-warning-background, --semantic-warning-border, --semantic-warning-text
--semantic-error-background, --semantic-error-border, --semantic-error-text
```

### Spacing
```css
--spacing-xs (8px), --spacing-sm (12px), --spacing-md (16px)
--spacing-lg (24px), --spacing-xl (32px), --spacing-xxl (48px), --spacing-xxxl (64px)
```

### Typographie
```css
--font-primary, --font-secondary, --font-heading, --font-display, --font-mono
--font-size-xs, --font-size-sm, --font-size-md, --font-size-lg, --font-size-xl
--font-weight-light (300), --font-weight-normal (400), --font-weight-semibold (600), --font-weight-bold (700)
```

### Z-Index
```css
--z-base (0), --z-dropdown (100), --z-sticky (200), --z-fixed (300)
--z-modalBackdrop (400), --z-modal (500), --z-popover (600)
--z-tooltip (700), --z-toast (800), --z-header (1000), --z-max (9999)
```

### Autres
```css
--shadow-card, --shadow-cardHover, --shadow-panel, --shadow-elevated
--radius-sm (4px), --radius-md (6px), --radius-lg (8px), --radius-xl (12px)
--transition-fast (150ms), --transition-normal (250ms), --transition-slow (350ms)
```

## Convention de nommage

### Variables CSS
```
--{category}-{element}-{modifier}

Exemples:
--color-primary-main      # Catégorie: color, Element: primary, Modifier: main
--spacing-lg              # Catégorie: spacing, Element: lg
--semantic-info-border    # Catégorie: semantic, Element: info, Modifier: border
```

### Classes CSS Modules
Utiliser camelCase :
```css
.panelGrid { }
.statMain { }
.boxInfo { }
```

### Classes CSS globales
Utiliser kebab-case avec préfixe :
```css
.unistra-box { }
.unistra-card-title { }
```

## Ordre des propriétés CSS

1. **Positionnement** : position, top, right, z-index
2. **Box model** : display, width, margin, padding
3. **Typographie** : font, color, text-align, line-height
4. **Visuel** : background, border, box-shadow
5. **Animations** : transition, animation

```css
.example {
  /* 1. Positionnement */
  position: relative;
  z-index: var(--z-dropdown);

  /* 2. Box model */
  display: flex;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);

  /* 3. Typographie */
  font-family: var(--font-secondary);
  color: var(--color-text-primary);

  /* 4. Visuel */
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);

  /* 5. Animations */
  transition: var(--transition-normal);
}
```

## Responsive Design

### Breakpoints (mobile-first)
```css
/* Mobile (default) */
.element { }

/* Tablet (768px+) */
@media (min-width: 768px) { }

/* Desktop (1024px+) */
@media (min-width: 1024px) { }

/* Large desktop (1280px+) */
@media (min-width: 1280px) { }
```

### En JavaScript
```javascript
import { globalTheme } from '@shared/theme/globalTheme';

// Utiliser les breakpoints
const isTablet = window.innerWidth >= globalTheme.breakpoints.values.md;

// Media query helper
const mediaQuery = globalTheme.breakpoints.up('md'); // "@media (min-width: 768px)"
```

## Fallbacks

Toujours fournir un fallback pour les variables CSS :
```css
/* Bon */
.element {
  padding: var(--spacing-lg, 1.5rem);
  color: var(--color-text-primary, #2C2C2C);
}

/* Éviter */
.element {
  padding: var(--spacing-lg); /* Pas de fallback! */
}
```

## Éviter

- `!important` sauf pour l'accessibilité (prefers-reduced-motion)
- Couleurs hardcodées sans fallback
- z-index arbitraires (utiliser l'échelle)
- Mélanger rem et px dans le même contexte
- Classes trop génériques (.box, .title) en CSS global
