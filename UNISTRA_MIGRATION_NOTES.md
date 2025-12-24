# Notes de migration Charte Graphique Unistra

## 🎨 Migration Progressive - CiSaMe Toolkit

Ce document trace les notes techniques et problèmes rencontrés lors de la migration vers la charte graphique Unistra.

---

## ⚠️ Problèmes connus

### Superscript "e" du siècle (XIIe)

**Problème** : Le superscript "e" dans "XIIe siècle" ne se réduit pas correctement malgré les tentatives de styling CSS.

**Tentatives effectuées** :
1. `fontSize: '0.6em', verticalAlign: 'super'` - Pas assez petit
2. `fontSize: '0.45em', verticalAlign: 'super'` - Toujours pas de changement visible
3. `fontSize: '0.35em', position: 'relative', top: '-0.5em'` - Toujours pas de changement

**Localisation** : `src/shared/components/Sidebar.jsx:203`

**Code actuel** :
```jsx
Circulation des savoirs médiévaux au XII<sup style={{ fontSize: '0.35em', position: 'relative', top: '-0.5em' }}>e</sup> siècle
```

**Hypothèses** :
- Possible surcharge CSS globale
- La balise `<sup>` pourrait avoir des styles par défaut qui empêchent les modifications
- Problème de spécificité CSS avec les inline styles dans React

**Solutions possibles à explorer** :
- Utiliser une classe CSS au lieu d'inline styles
- Utiliser `!important` dans le style inline
- Remplacer `<sup>` par un `<span>` avec styling complet
- Utiliser un caractère Unicode exposant : `ᵉ` (U+1D49)
- Créer un composant dédié avec CSS Module

**Impact** : Visuel uniquement, non critique.

**Status** : Non résolu - Noté pour investigation future

---

## ✅ Composants migrés

### Phase 1 - Sidebar (TERMINÉ)
**Commit** : `73bc0a5`, `08e927b`, `b7ef42b`

**Polices appliquées** :
- Logo CiSaMe : `var(--font-display)` (Unistra Encadre) - 2.8rem
- Sous-titre : `var(--font-primary)` (Unistra A) - 1.1rem
- Titres sections : `var(--font-heading)` (Unistra B) - 0.95rem
- Navigation : `var(--font-ui)` (Unistra C) - 1.15rem
- Compteur chiffres : `var(--font-data)` (Unistra D) - 3rem
- Labels compteur : `var(--font-ui)` (Unistra C) - 0.95rem
- Bouton langue : `var(--font-ui)` (Unistra C) - 1.1rem
- Footer : `var(--font-primary)` (Unistra A) - 0.9rem

**Notes** : Tailles augmentées progressivement pour compenser la perte de taille lors du changement de police. Conservation de toutes les couleurs médiévales.

---

### Phase 2 - Page Home (TERMINÉ)
**Commit** : `9adb10b`, `16fd955`

**Polices appliquées** :
- Titre CiSaMe : `var(--font-display)` (Unistra Encadre) - 7rem
- Sous-titre : `var(--font-display)` (Unistra Encadre) - 3.2rem
- Description projet : `var(--font-primary)` (Unistra A) - 1.3rem
- Titres sections : `var(--font-heading)` (Unistra B) - 2.5rem
- Titres outils : `var(--font-heading)` (Unistra B) - 2.2rem
- Sous-titres outils : `var(--font-primary)` (Unistra A) - 1.3rem
- Headers sections : `var(--font-ui)` (Unistra C) - 1.1rem
- Contenu descriptif : `var(--font-primary)` (Unistra A) - 1.15rem
- Boutons CTA : `var(--font-ui)` (Unistra C) - 1.35rem

**Notes** : Tailles augmentées de +21% à +28% (comme la 2ème itération Sidebar) pour compenser la perte de taille lors du changement de police.

---

### Phase 3 - Query Generator (TERMINÉ)
**Commit** : `7016ef9`

**globalTheme.js - Migration complète du système typographique** :

Polices migrées :
- `fontFamily.primary` : Crimson Text → **Unistra A**
- `fontFamily.secondary` : Lato → **Unistra C**
- `fontFamily.heading` : EB Garamond → **Unistra B**
- `fontFamily.display` : Cormorant Garamond → **Unistra Encadre**
- `fontFamily.body` : Lato → **Unistra C**
- Suppression import Google Fonts (polices locales uniquement)

Tailles de police augmentées (+24% à +28%) :
- `size.xs` : 0.75rem → 0.95rem (+27%)
- `size.sm` : 0.85rem → 1.05rem (+24%)
- `size.md` : 0.875rem → 1.1rem (+26%)
- `size.lg` : 1rem → 1.25rem (+25%)
- `size.xl` : 1.25rem → 1.55rem (+24%)
- `size.xxl` : 1.5rem → 1.9rem (+27%)
- `size.xxxl` : 2rem → 2.5rem (+25%)
- `size.display` : 2.5rem → 3.2rem (+28%)

Headings migrés vers Unistra B/C avec augmentation :
- `h1` : Unistra B, 2.5rem → 3.2rem (+28%)
- `h2` : Unistra B, 2rem → 2.5rem (+25%)
- `h3` : Unistra B, 1.5rem → 1.9rem (+27%)
- `h4` : Unistra C, 1.25rem → 1.55rem (+24%)
- `h5` : Unistra C, 1rem → 1.25rem (+25%)
- `h6` : Unistra C, 0.875rem → 1.1rem (+26%)

**QueryGenerator.jsx** :
- `pageTitle` : 2rem → 2.5rem (+25%)

**Composants UI modules CSS** :
- `FormField.module.css` : Unistra C, tailles +25-26%
- `ResultCard.module.css` : Unistra C, tailles +25-27%
- `RadioGroup.module.css` : Unistra C, tailles +25-26%
- `InfoBox.module.css` : Unistra C, tailles +26%

**Impact** : Tous les modules du Query Generator (ProximityView, VariationView, ProximityVariationView, SemanticView) utilisent globalTheme → migration automatique complète de tous les composants.

**Notes** : Migration centralisée via globalTheme.js permet une cohérence parfaite dans tout le module Query Generator et facilite les futures migrations.

---

### Phase 4 - Concordance Analyzer (TERMINÉ)
**Commit** : `a0bef52`

**NavigationPanel.jsx** - Migration polices Unistra:
- Subtitle : Inter → Unistra C (visualTheme), 0.85rem → 1.05rem (+24%)
- Title large : Crimson Text → Unistra B (visualTheme), 2rem → 2.5rem (+25%)
- Title wide : 1.5rem → 1.9rem (+27%)
- Title medium : 1.3rem → 1.6rem (+23%)

**Graphiques (Charts) - Augmentation tailles de police** :

DomainChart.jsx, AuthorChart.jsx, PlaceChart.jsx (structure identique):
- axisFontSize : xs 0.7→0.9rem (+29%), md 0.8→1.0rem (+25%), lg 0.85→1.1rem (+29%)
- labelFontSize : xs 0.75→0.95rem (+27%), md 0.85→1.1rem (+29%), lg 0.9→1.15rem (+28%)
- pieLabelFontSize : xs 0.65→0.85rem (+31%), md 0.75→0.95rem (+27%), lg 0.85→1.1rem (+29%)
- Icône vide : 3rem → 3.8rem (+27%)

TemporalChart.jsx:
- axisFontSize : xs 0.7→0.9rem (+29%), md 0.8→1.0rem (+25%), lg 0.85→1.1rem (+29%)
- labelFontSize : xs 0.75→0.95rem (+27%), md 0.85→1.1rem (+29%), lg 0.9→1.15rem (+28%)
- Icône vide : 3rem → 3.8rem (+27%)

TimelineGantt.jsx:
- tickFontSize (px) : xs 9→12px (+33%), md 10→13px (+30%), lg 11→14px (+27%)
- labelFontSize (px) : xs 8→10px (+25%), md 9→11px (+22%), lg 10→13px (+30%)
- Titre : 1rem → 1.25rem (+25%)
- Légende : 0.75rem → 0.95rem (+27%)
- Tooltip : 0.8rem → 1.0rem (+25%)
- Message erreur : 0.9rem → 1.15rem (+28%)
- Domaines : 0.75rem → 0.95rem (+27%)
- Icône vide : 3rem → 3.8rem (+27%)

WordCloud.jsx:
- Icône vide : 3rem → 3.8rem (+27%)
- Titre vide : 1.25rem → 1.6rem (+28%)
- Message : 0.9rem → 1.15rem (+28%)

CustomTooltipChart.jsx:
- Nom élément : 0.95rem → 1.2rem (+26%)
- Label valeur : 0.85rem → 1.1rem (+29%)
- Valeur : 1rem → 1.25rem (+25%)
- Label pourcentage : 0.85rem → 1.1rem (+29%)
- Pourcentage : 0.9rem → 1.15rem (+28%)
- Label rang : 0.8rem → 1.0rem (+25%)
- Rang : 0.85rem → 1.1rem (+29%)

**Impact** : globalTheme.js ayant déjà été migré vers Unistra en Phase 3, tous les autres composants du Concordance Analyzer qui utilisent visualTheme bénéficient automatiquement des nouvelles polices Unistra.

**Notes** : Augmentation généralisée de +22% à +33% sur tous les éléments textuels pour compenser la perte de taille visuelle des polices Unistra. Les graphiques conservent leur lisibilité optimale.

---

## 📋 Prochaines étapes

### Phase 5 - Composants finaux (optionnel)
- [ ] Autres composants UI du Concordance Analyzer si nécessaire
- [ ] Vérification visuelle globale de l'application

---

## 🎨 Système de design créé

### Fichiers
- `src/styles/fonts.css` - Toutes les polices Unistra A, B, C, D, Encadre
- `src/styles/unistra-theme.css` - Variables CSS et système de design
- `src/styles/unistra-boxes.css` - Composants encadrés réutilisables

### Variables CSS disponibles
```css
--font-primary    /* Unistra A - texte courant */
--font-heading    /* Unistra B - titres sections */
--font-ui         /* Unistra C - navigation, boutons */
--font-data       /* Unistra D - chiffres, stats */
--font-display    /* Unistra Encadre - titres principaux */
--font-mono       /* Courier - code CQL uniquement */
```

### Conservation des couleurs
Toutes les couleurs médiévales sont conservées :
- `--color-medieval-brown: #5C3317`
- `--color-medieval-gold: #B8860B`
- `--color-medieval-light: #E8DCC6`
- etc.

---

**Dernière mise à jour** : 17 décembre 2025
**Mainteneur** : Claude (assistance Titouan)
