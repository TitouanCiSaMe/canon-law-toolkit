# Architecture Sidebar - CALKIT v1.1.0

## 🎨 Nouvelle architecture UI avec Sidebar verticale

### Vue d'ensemble

La version 1.1.0 introduit une refonte majeure de l'interface avec une **sidebar verticale fixe** remplaçant l'ancien header horizontal. Cette architecture améliore significativement l'utilisation de l'espace vertical et offre une navigation toujours accessible.

---

## 📐 Layout global

```
┌──────────────┬─────────────────────────────────────────────────┐
│              │  Header: Titre de la vue + Breadcrumb            │
│   SIDEBAR    ├─────────────────────────────────────────────────┤
│   (280px)    │                                                  │
│              │                                                  │
│   Fixed      │        Zone de contenu                           │
│   Left       │      (Vue Overview avec grille                   │
│              │       ou vues détaillées)                        │
│   Always     │                                                  │
│   Visible    │        Scrollable verticalement                  │
│              │                                                  │
│              │                                                  │
└──────────────┴─────────────────────────────────────────────────┘
     280px                    calc(100% - 280px)
```

---

## 🧩 Composants principaux

### 1. GlobalLayout.jsx

**Rôle** : Wrapper principal de l'application

**Responsabilités** :
- Gère l'affichage de la Sidebar
- Calcule le margin-left pour le contenu principal (280px)
- Passe les props à la Sidebar (activeView, callbacks, compteurs, etc.)
- Contrôle l'affichage de la sidebar (showSidebar prop)

**Props** :
```javascript
{
  children: ReactNode,           // Contenu de la page
  activeView: string,            // Vue active
  onViewChange: Function,        // Callback changement de vue
  concordanceCount: number,      // Nombre de concordances
  activeFiltersCount: number,    // Nombre de filtres actifs
  onFiltersClick: Function,      // Callback ouverture filtres
  showSidebar: boolean,          // Afficher sidebar (défaut: true)
  isInConcordanceAnalyzer: boolean  // Si dans le module concordance
}
```

**Structure** :
```jsx
<div style={{ display: 'flex', minHeight: '100vh' }}>
  <Sidebar {...sidebarProps} />
  <main style={{ marginLeft: '280px', flex: '1' }}>
    {children}
  </main>
</div>
```

---

### 2. Sidebar.jsx

**Rôle** : Navigation verticale fixe

**Dimensions** :
- Largeur : 280px (fixe)
- Hauteur : 100vh (toute la hauteur d'écran)
- Position : fixed, left: 0, top: 0
- Z-index : 1000 (au-dessus du contenu)

**Structure de haut en bas** :

```
┌─────────────────────┐
│ 📚 CALKIT           │ ← Logo + titre (cliquable → home)
│ Canon Law Toolkit   │
├─────────────────────┤
│ MODULES             │ ← Section modules
│ 🔍 Query Generator  │
│ 📊 Concordance (✓)  │ ← Active (fond jaune)
├─────────────────────┤
│ VUES                │ ← Section vues (si dans concordance)
│ 🏠 Overview (✓)     │
│ 📚 Domaines         │
│ ⏰ Chronologie      │
│ ✍️ Auteurs          │
│ 🔤 Terminologie     │
│ 🌍 Lieux            │
│ 📋 Données          │
│ ⚖️ Comparaison      │
│ 📁 Import           │
├─────────────────────┤
│ 🔍 Filtres (3)      │ ← Bouton filtres + badge
├─────────────────────┤
│     342             │ ← Compteur concordances
│ CONCORDANCES        │
├─────────────────────┤
│ 🇫🇷 Français        │ ← Switch langue
├─────────────────────┤
│ © 2025 CISAME       │ ← Footer
└─────────────────────┘
```

**Styles clés** :
```javascript
{
  width: '280px',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  background: 'linear-gradient(180deg, #78350F 0%, #92400E 100%)',
  color: '#F7FAFC',
  overflowY: 'auto',  // Scrollable si contenu déborde
  boxShadow: '4px 0 16px rgba(0, 0, 0, 0.15)'
}
```

**États visuels** :
- Vue active : `background: rgba(252, 211, 77, 0.1)` + `borderLeft: 4px solid #FCD34D`
- Hover : `background: rgba(255, 255, 255, 0.05)`
- Badge filtres : Cercle jaune avec nombre si filtres actifs

---

### 3. ConcordanceAnalyzer.jsx (refactorisé)

**Changements majeurs** :

✅ **Ajouté** :
- Import et utilisation de `GlobalLayout`
- Props passées à GlobalLayout (activeView, callbacks, etc.)
- Header de page simplifié (titre + icône + bouton retour)

❌ **Supprimé** :
- Header horizontal avec 4 modules
- Bouton filtres en haut à droite
- `LanguageSwitcher` autonome
- Compteur concordances en haut
- Navigation breadcrumb complexe

**Structure refactorisée** :
```jsx
<GlobalLayout {...sidebarProps}>
  <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
    {/* Header de page */}
    <header style={{ padding: '1.5rem 2.5rem', flexShrink: 0 }}>
      <h1>{titre de la vue}</h1>
      <button onClick={retourOverview}>← Retour</button>
    </header>
    
    {/* Contenu principal */}
    <main style={{ flex: '1', padding: '2rem', overflowY: 'auto' }}>
      {activeView === 'overview' ? <OverviewView /> : <DetailedView />}
    </main>
  </div>
</GlobalLayout>
```

---

## 🔄 Flux de données

### Navigation entre vues

```
User clicks vue dans Sidebar
         ↓
Sidebar.onClick(viewId)
         ↓
onViewChange(viewId) ← Callback vers ConcordanceAnalyzer
         ↓
setActiveView(viewId) ← Update state
         ↓
Re-render avec nouvelle vue
         ↓
Sidebar reçoit activeView via props
         ↓
Vue marquée comme active (fond jaune)
```

### Gestion des filtres

```
User clicks "🔍 Filtres" dans Sidebar
         ↓
Sidebar.onFiltersClick()
         ↓
setShowFilters(true) ← Update state dans ConcordanceAnalyzer
         ↓
<FilterMenu isOpen={true} />
         ↓
Panneau latéral s'ouvre
```

### Compteur concordances

```
Upload fichier
         ↓
setConcordanceData([...])
         ↓
concordanceData.length passé via props à GlobalLayout
         ↓
GlobalLayout passe à Sidebar
         ↓
Sidebar affiche le compteur mis à jour
```

---

## ⚡ Optimisations

### Performance

✅ **Sidebar séparée du contenu** : Re-renders isolés  
✅ **Scroll optimisé** : Sidebar fixe, seul le contenu scroll  
✅ **CSS transforms** : Animations GPU-accelerated  
✅ **Memoization** : Props stables avec useCallback  

### Responsive (futur)

**Mobile (< 768px)** :
- Sidebar collapsible (toggle button)
- Overlay au-dessus du contenu
- Fermeture automatique après navigation

**Tablet (768px - 1024px)** :
- Sidebar réduite (80px) avec icônes seulement
- Expansion au hover

**Desktop (> 1024px)** :
- Sidebar pleine largeur (280px) - comportement actuel

---

## 📊 Métriques d'amélioration

### Espace gagné

| Élément | Avant (v1.0.0) | Après (v1.1.0) | Gain |
|---------|----------------|----------------|------|
| Header horizontal | 120px | 0px | +120px |
| Breadcrumb | 60px | 0px (intégré) | +60px |
| **Total vertical** | **-180px** | **0px** | **+180px** ✅ |
| Sidebar horizontale | 0px | -280px | -280px |
| **Espace contenu** | 100% largeur | calc(100% - 280px) | -280px largeur |

**Bilan** : +180px vertical vs -280px horizontal = **Excellent** pour analyse de données (scroll vertical > horizontal)

### UX améliorée

✅ Navigation toujours visible (pas de scroll pour accéder aux vues)  
✅ Compteur concordances toujours affiché  
✅ Filtres accessibles en 1 clic  
✅ Switch langue accessible en permanence  
✅ Look "application professionnelle" plutôt que "site web"  

---

## 🔧 Personnalisation

### Changer la largeur de la sidebar

```javascript
// Dans Sidebar.jsx et GlobalLayout.jsx
const SIDEBAR_WIDTH = '280px';  // Modifier ici

// Sidebar
<aside style={{ width: SIDEBAR_WIDTH }}>

// GlobalLayout
<main style={{ marginLeft: SIDEBAR_WIDTH }}>
```

### Changer les couleurs

```javascript
// Dans Sidebar.jsx
background: 'linear-gradient(180deg, #78350F 0%, #92400E 100%)',  // Marron actuel
// Alternatives :
// Bleu foncé : '#1A365D 0%, #2C5282 100%'
// Gris ardoise : '#1E293B 0%, #334155 100%'
// Noir élégant : '#1F2937 0%, #111827 100%'
```

### Ajouter des sections

```jsx
{/* Nouvelle section dans Sidebar après les vues */}
<div style={{ padding: '1rem 0' }}>
  <div style={{ 
    fontSize: '0.7rem', 
    textTransform: 'uppercase',
    padding: '0.5rem 1.5rem',
    opacity: 0.7 
  }}>
    OUTILS
  </div>
  <button>📊 Statistiques avancées</button>
  <button>💾 Sauvegarder session</button>
</div>
```

---

## 🚀 Améliorations futures

### Court terme
- [ ] Animation slide-in au chargement
- [ ] Tooltips sur les icônes de vues
- [ ] Badges de notification (nouvelles données, etc.)

### Moyen terme
- [ ] Sidebar collapsible (toggle button)
- [ ] Thèmes clairs/sombres
- [ ] Raccourcis clavier (Ctrl+1 pour Overview, etc.)

### Long terme
- [ ] Sidebar customisable (réorganiser vues)
- [ ] Mode full-screen (masquer sidebar)
- [ ] Responsive mobile/tablet

---

**Version** : 1.1.0  
**Date** : Novembre 2025  
**Auteur** : CISAME - Titouan
