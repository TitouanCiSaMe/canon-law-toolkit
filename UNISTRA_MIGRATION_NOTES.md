# Notes de migration Charte Graphique Unistra

## 🎨 Migration Progressive - Canon Law Toolkit

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

## 📋 Prochaines étapes

### Phase 2 - Page Home
- [ ] Titres principaux (déjà partiellement en Encadre)
- [ ] Contenu texte
- [ ] Sections about/tools
- [ ] Boutons

### Phase 3 - Header global
- [ ] Si header global existe

### Phase 4 - Query Generator
- [ ] Formulaires
- [ ] Composants UI (FormField, RadioGroup, etc.)
- [ ] ResultCard

### Phase 5 - Concordance Analyzer
- [ ] Panels
- [ ] Graphiques (labels, axes)
- [ ] Tableaux de données

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
