# Guide de modification de la disposition des panels

Ce guide explique comment modifier la position et l'agencement des panels dans la vue d'ensemble de l'analyseur de concordances.

## Architecture du système de grille

La vue d'ensemble utilise **CSS Grid** pour positionner les panels. Chaque panel a une position **exacte** définie par la propriété `gridArea`, **indépendamment de l'ordre dans le code JSX**.

### Fichiers concernés

1. **`src/modules/concordance-analyzer/config/panelConfig.js`** - Configuration principale des panels
2. **`src/modules/concordance-analyzer/components/views/OverviewView.jsx`** - Rendu de la grille
3. **`src/modules/concordance-analyzer/components/ui/NavigationPanel.jsx`** - Composant panel individuel

---

## Comment modifier la position d'un panel

### Étape 1 : Comprendre la propriété `gridArea`

La propriété `gridArea` définit la position d'un panel dans la grille avec la syntaxe :

```
gridArea: 'ligne_début / colonne_début / ligne_fin / colonne_fin'
```

**Exemple :**
```javascript
gridArea: '1 / 2 / 2 / 3'
//         └─┬─┘  └─┬─┘  └─┬─┘  └─┬─┘
//           │      │      │      │
//        ligne   colonne ligne colonne
//        début   début    fin    fin
```

- `'1 / 2 / 2 / 3'` = ligne 1, colonne 2 (panel de taille normale, 1 colonne)
- `'3 / 1 / 4 / 5'` = ligne 3, colonnes 1 à 5 (panel full-width)

### Étape 2 : Ouvrir le fichier de configuration

Ouvrez `src/modules/concordance-analyzer/config/panelConfig.js`

### Étape 3 : Modifier le `gridArea`

**Disposition actuelle (Décembre 2025) :**

```
Ligne 1 : [Import]         [Lieux]   [Domaines] [Chronologie]
          (1/1 → 2/2)      (1/2 →    (1/3 → 2/4) (1/4 → 2/5)
                            2/3)

Ligne 2 : [Vue d'ensemble] [Auteurs] [Terminologie] [Données]
          (2/1 → 3/2)      (2/2 →    (2/3 → 3/4)    (2/4 → 3/5)
                            3/3)

Ligne 3 : [Comparaison de Corpus - Full width]
          (3/1 → 4/5)
```

**Exemple de modification :** Déplacer le panel "Import" en bas

```javascript
// AVANT (position 2)
concordances: {
  id: 'concordances',
  gridArea: '1 / 2 / 2 / 3',  // Ligne 1, colonne 2
  size: 'medium'
}

// APRÈS (dernière ligne, full width)
concordances: {
  id: 'concordances',
  gridArea: '4 / 1 / 5 / 5',  // Ligne 4, full width
  size: 'wide'  // ⚠️ Changer en 'wide' pour full-width
}
```

### Étape 4 : Ajuster les autres panels

Si vous déplacez un panel, **vous devez réorganiser les autres panels** pour éviter les chevauchements.

**Exemple complet :** Remettre Import en bas

```javascript
export const panelConfig = {
  // Ligne 1 : 4 panels normaux
  overview: {
    gridArea: '1 / 1 / 2 / 2',
    size: 'medium'
  },
  domains: {
    gridArea: '1 / 2 / 2 / 3',  // Reprend la place d'Import
    size: 'medium'
  },
  temporal: {
    gridArea: '1 / 3 / 2 / 4',
    size: 'medium'
  },
  places: {
    gridArea: '1 / 4 / 2 / 5',
    size: 'medium'
  },

  // Ligne 2 : 4 panels normaux
  authors: {
    gridArea: '2 / 1 / 3 / 2',
    size: 'medium'
  },
  linguistic: {
    gridArea: '2 / 2 / 3 / 3',
    size: 'medium'
  },
  data: {
    gridArea: '2 / 3 / 3 / 5',  // S'étend sur 2 colonnes
    size: 'medium'
  },

  // Ligne 3 : Full width
  corpusComparison: {
    gridArea: '3 / 1 / 4 / 5',
    size: 'wide'
  },

  // Ligne 4 : Full width
  concordances: {
    gridArea: '4 / 1 / 5 / 5',  // Maintenant en bas
    size: 'wide'
  }
};
```

---

## Tailles de panels disponibles

| Taille | Description | Utilisation |
|--------|-------------|-------------|
| `'medium'` | Taille normale (1 colonne) | Panels standards |
| `'wide'` | Largeur complète (4 colonnes) | Panels larges (Import, Comparaison) |
| `'large'` | ⚠️ Déprécié | Non utilisé actuellement |

---

## Styles personnalisés

### Ajouter un style conditionnel à un panel

Vous pouvez ajouter des styles personnalisés dans `OverviewView.jsx` via le prop `style` :

```jsx
<NavigationPanel
  config={panelConfig.concordances}
  style={
    parseStats.itemCount === 0
      ? { border: '2px solid #D4AF37' }  // Bordure dorée si vide
      : {}
  }
>
  {/* contenu */}
</NavigationPanel>
```

**Styles disponibles :**
- `border` - Bordure personnalisée
- `background` - Fond (override gradient)
- `opacity` - Transparence
- Tous les styles CSS inline React

---

## Modifier les hauteurs de lignes

### Problème : Les panels sont tronqués ou nécessitent du scroll

**Fichier à modifier :** `src/modules/concordance-analyzer/components/views/OverviewView.jsx`

**Localisation :** Cherchez la variable `gridTemplateRows` (environ ligne 203)

### Syntaxe actuelle

```javascript
const gridTemplateRows = useResponsiveValue({
  xs: 'auto',      // Mobile: hauteur automatique
  sm: 'auto',      // Phone landscape: hauteur automatique
  md: 'auto',      // Tablet: hauteur automatique
  lg: 'repeat(2, minmax(200px, auto)) minmax(160px, auto)'  // Desktop
});
```

### Comprendre la syntaxe

```javascript
lg: 'repeat(2, minmax(200px, auto)) minmax(160px, auto)'
    └───────┬───────────────────┘  └─────────┬──────────┘
            │                                 │
    Lignes 1-2: min 200px,          Ligne 3: min 160px,
    hauteur automatique             hauteur automatique
```

**Décomposition :**
- `repeat(2, minmax(200px, auto))` = Les 2 premières lignes ont une hauteur minimum de 200px
- `minmax(160px, auto)` = La 3ème ligne a une hauteur minimum de 160px
- `auto` = La hauteur s'adapte au contenu (peut être plus grande que le minimum)

### Exemples de modifications

#### Augmenter toutes les hauteurs de 20px

```javascript
lg: 'repeat(2, minmax(220px, auto)) minmax(180px, auto)'
```

#### Réduire la ligne 3 pour gagner de l'espace

```javascript
lg: 'repeat(2, minmax(200px, auto)) minmax(140px, auto)'
```

#### Fixer des hauteurs exactes (non recommandé - risque de débordement)

```javascript
lg: '250px 250px 180px'  // ⚠️ Attention : le contenu peut déborder
```

#### Hauteurs proportionnelles avec fractions

```javascript
lg: '1fr 1fr 0.8fr'  // Ligne 1 et 2 identiques, ligne 3 = 80% de leur hauteur
```

#### Combiner minimum et fractions (RECOMMANDÉ)

```javascript
lg: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(150px, 0.7fr)'
// Ligne 1: min 200px, proportion 1
// Ligne 2: min 200px, proportion 1
// Ligne 3: min 150px, proportion 0.7 (plus compacte)
```

### Valeurs recommandées selon le contenu

| Configuration | Cas d'usage |
|--------------|-------------|
| `repeat(3, minmax(180px, auto))` | Toutes les lignes égales, contenu compact |
| `repeat(2, minmax(220px, auto)) minmax(160px, auto)` | Ligne 3 plus petite (actuel) |
| `minmax(250px, 1fr) minmax(250px, 1fr) minmax(180px, 0.8fr)` | Plus d'espace pour lignes 1-2 |
| `repeat(3, 1fr)` | Hauteurs égales, remplissage vertical complet |

### Procédure de modification

1. Ouvrir `src/modules/concordance-analyzer/components/views/OverviewView.jsx`
2. Chercher `const gridTemplateRows = useResponsiveValue`
3. Modifier UNIQUEMENT la valeur de `lg:` (desktop)
4. Sauvegarder et tester dans le navigateur
5. Ajuster jusqu'à ce que tous les panels soient visibles

### ⚠️ Attention

- Modifier uniquement `lg:` - laisser `xs`, `sm`, `md` en `'auto'`
- Tester avec et sans données importées
- Vérifier que le panel Comparaison Corpus n'est pas tronqué
- Si un panel déborde, augmenter le `minmax()` de sa ligne

---

## Grille responsive

La grille s'adapte automatiquement selon la taille d'écran :

| Breakpoint | Colonnes | Description |
|------------|----------|-------------|
| Desktop (lg) | 4 colonnes | Layout asymétrique avec Vue d'ensemble large |
| Tablet (md) | 2 colonnes | Grille 2x2 |
| Mobile (xs, sm) | 1 colonne | Empilement vertical |

**Configuration dans `OverviewView.jsx` :**

```javascript
const gridTemplateColumns = useResponsiveValue({
  xs: '1fr',                    // Mobile: 1 colonne
  sm: '1fr',                    // Phone landscape: 1 colonne
  md: 'repeat(2, 1fr)',         // Tablet: 2 colonnes
  lg: 'minmax(400px, 1.3fr) repeat(3, minmax(200px, 0.6fr))'  // Desktop: 4 colonnes
});
```

⚠️ **Note :** Les `gridArea` ne s'appliquent que sur **desktop**. Sur mobile/tablet, l'ordre JSX détermine l'affichage.

---

## Checklist de modification

### Pour déplacer un panel

- [ ] Ouvrir `src/modules/concordance-analyzer/config/panelConfig.js`
- [ ] Identifier le panel à déplacer
- [ ] Modifier son `gridArea` avec les nouvelles coordonnées
- [ ] Ajuster la propriété `size` si nécessaire (`medium` ou `wide`)
- [ ] Réorganiser les autres panels pour éviter les chevauchements
- [ ] Tester sur desktop (les `gridArea` s'appliquent uniquement ici)
- [ ] Tester sur mobile/tablet (vérifier l'ordre JSX dans `OverviewView.jsx`)
- [ ] Commit et push les modifications

### Pour ajuster les hauteurs de lignes

- [ ] Ouvrir `src/modules/concordance-analyzer/components/views/OverviewView.jsx`
- [ ] Chercher `const gridTemplateRows = useResponsiveValue`
- [ ] Modifier UNIQUEMENT la valeur `lg:` (ligne ~207)
- [ ] Utiliser `minmax(XXXpx, auto)` pour hauteur minimum
- [ ] Sauvegarder et recharger le navigateur
- [ ] Vérifier que tous les panels sont visibles sans scroll
- [ ] Tester avec et sans données
- [ ] Commit et push si satisfait

---

## Dépannage

### Le panel n'apparaît pas à la bonne position

**Cause :** Le `gridArea` définit la position, pas l'ordre JSX.

**Solution :** Vérifier la valeur `gridArea` dans `panelConfig.js`, pas dans `OverviewView.jsx`.

### Panels qui se chevauchent

**Cause :** Deux panels ont des `gridArea` qui se croisent.

**Solution :** Vérifier que chaque panel occupe une zone unique de la grille.

### Le panel est trop petit/large

**Cause :** La propriété `size` ne correspond pas à la largeur du `gridArea`.

**Solution :**
- Si `gridArea` couvre 1 colonne → `size: 'medium'`
- Si `gridArea` couvre 4 colonnes → `size: 'wide'`

### Les panels sont tronqués / je dois scroller

**Cause :** Les hauteurs de lignes (`gridTemplateRows`) sont trop petites.

**Solution :**
1. Ouvrir `OverviewView.jsx`
2. Trouver `gridTemplateRows` (ligne ~203)
3. Augmenter les valeurs `minmax()` :
   ```javascript
   // Exemple : augmenter de 20px
   lg: 'repeat(2, minmax(220px, auto)) minmax(180px, auto)'
   ```
4. Tester jusqu'à ce que tout soit visible

### Aucun changement visible après modification

**Cause :** Le navigateur a mis en cache l'ancienne version.

**Solution :**
1. Hard refresh : `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)
2. Vider le cache du navigateur
3. Vérifier que le fichier a bien été sauvegardé
4. Vérifier la console pour des erreurs JavaScript

---

## Ressources

- [CSS Grid Guide (MDN)](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout)
- [grid-area property](https://developer.mozilla.org/fr/docs/Web/CSS/grid-area)
- Code source : `src/modules/concordance-analyzer/config/panelConfig.js`

---

**Dernière mise à jour :** Décembre 2025
**Auteur :** Claude (CiSaMe Toolkit Team)
