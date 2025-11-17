# Architecture - Canon Law Toolkit

**Version** : 1.2.0
**Date** : Novembre 2025
**Mainteneur** : Titouan (CiSaMe - Circulation des Savoirs médiévaux)

---

## 📐 Vue d'Ensemble

CALKIT est une application React modulaire pour l'analyse de concordances de textes canoniques médiévaux. Architecture basée sur des modules autonomes avec système i18n complet.

## 🏗️ Stack Technique

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 19.0.0 | Framework UI |
| **Vite** | 6.x | Build tool & dev server |
| **React Router** | 7.x | Routing SPA |
| **Recharts** | 2.x | Visualisations (bar, line, pie) |
| **D3.js** | 7.x | Timeline Gantt |
| **react-i18next** | 15.x | Internationalisation FR/EN |

## 📁 Structure des Dossiers

```
canon-law-toolkit/
├── src/
│   ├── modules/
│   │   └── concordance-analyzer/           # Module principal
│   │       ├── components/
│   │       │   ├── charts/                 # Graphiques réutilisables
│   │       │   ├── comparison/             # Comparaison de corpus
│   │       │   ├── ui/                     # Composants UI (pagination, upload)
│   │       │   └── views/                  # Vues principales (9 vues)
│   │       ├── hooks/
│   │       │   ├── useConcordanceAnalytics.js    # Analytics des concordances
│   │       │   ├── useConcordanceData.js         # Gestion données + filtres
│   │       │   └── useCorpusComparison.js        # Comparaison de 2 corpus
│   │       ├── utils/
│   │       │   ├── parseMetadata.js        # Parser CSV métadonnées
│   │       │   ├── parseNoSketchCSV.js     # Parser export NoSketch
│   │       │   ├── enrichConcordances.js   # Enrichissement métadonnées
│   │       │   └── ExportUtils.js          # Exports CSV/JSON/PNG
│   │       └── config/
│   │           └── constants.js            # Constantes (domaines, périodes)
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx                 # Navigation verticale
│   │   │   ├── GlobalLayout.jsx            # Layout avec sidebar
│   │   │   └── Footer.jsx                  # Footer avec copyright
│   │   ├── i18n/
│   │   │   ├── fr.json                     # Traductions françaises
│   │   │   ├── en.json                     # Traductions anglaises
│   │   │   └── index.js                    # Configuration i18next
│   │   └── theme/
│   │       └── globalTheme.js              # Couleurs et styles
│   │
│   ├── pages/
│   │   ├── Home.jsx                        # Page d'accueil
│   │   ├── QueryGenerator.jsx              # Générateur de requêtes CQL
│   │   └── App.jsx                         # Point d'entrée React Router
│   │
│   └── main.jsx                            # Point d'entrée Vite
│
├── public/                                 # Assets statiques
└── docs/                                   # Documentation
```

## 🎯 Modules

### Concordance Analyzer

Module principal pour l'analyse de concordances enrichies avec métadonnées.

**Flux de données** :
```
1. Upload CSV → 2. Parsing → 3. Enrichissement → 4. Analytics → 5. Visualisation
```

**9 Vues disponibles** :
- 📊 Vue d'ensemble (Overview)
- 📚 Analyse par domaines juridiques
- ✍️ Analyse par auteurs
- ⏰ Analyse temporelle (Timeline Gantt)
- 🗺️ Analyse géographique
- 📖 Analyse terminologique (Word Cloud)
- 🔄 Comparaison de corpus
- 🔍 Exploration de concordances (table)
- 📋 Métadonnées complètes

## 🔧 Composants Clés

### Hooks Personnalisés

#### `useConcordanceData`
Gestion centralisée des données et filtres.

```javascript
const {
  data,                    // Données filtrées
  fullData,               // Données complètes
  filters,                // État des filtres
  updateFilters,          // Mettre à jour filtres
  loadConcordances,       // Charger données
  loadMetadata           // Charger métadonnées
} = useConcordanceData();
```

**Filtres supportés** :
- Recherche textuelle (KWIC, left, right)
- Auteurs multiples
- Domaines juridiques multiples
- Périodes multiples
- Lieux multiples

#### `useConcordanceAnalytics`
Calculs statistiques sur les données filtrées.

```javascript
const analytics = useConcordanceAnalytics(data);
// Returns: { domains, authors, periods, places, keyTerms, timeline }
```

**Métriques calculées** :
- Distribution par domaine (top N)
- Distribution par auteur (top N)
- Distribution par période
- Distribution par lieu
- Termes KWIC les plus fréquents
- Timeline des œuvres

#### `useCorpusComparison`
Comparaison de 2 corpus de concordances.

```javascript
const {
  corpusComparison,      // { A: {...}, B: {...} }
  loadCorpus,            // Charger corpus A ou B
  resetCorpus,           // Réinitialiser
  comparisonStats,       // Stats comparatives
  differences            // Différences détaillées
} = useCorpusComparison();
```

### Graphiques

Tous les graphiques utilisent **Recharts** avec tooltips personnalisés i18n.

| Composant | Type | Usage |
|-----------|------|-------|
| `DomainChart` | BarChart | Top domaines juridiques |
| `AuthorChart` | BarChart | Top auteurs |
| `TemporalChart` | LineChart | Évolution temporelle |
| `PlaceChart` | BarChart | Distribution géographique |
| `WordCloud` | Custom D3 | Termes KWIC fréquents |
| `TimelineGantt` | Custom D3 | Timeline des œuvres |
| `ComparisonDomainChart` | 2x BarChart | Comparaison domaines |
| `ComparisonAuthorChart` | 2x BarChart | Comparaison auteurs |
| `ComparisonTemporalChart` | LineChart overlay | Comparaison temporelle |
| `ComparisonTermChart` | 2x BarChart | Comparaison terminologie |

**Tooltip enrichi** :
- Nom de l'élément
- Valeur avec formatage
- Pourcentage du total
- Classement (1er/1st, 2ème/2nd...)

### Parsers

#### `parseMetadata.js`
Parse le CSV complet des métadonnées (117 entrées Edi-XX).

**Colonnes attendues** :
- `identifiant` (Edi-XX)
- `auteur`, `titre`
- `domaine`, `période`, `lieu`

#### `parseNoSketchCSV.js`
Parse l'export CSV de NoSketch Engine.

**Colonnes attendues** :
- `Left context`, `KWIC`, `Right context`
- `Ref` (références aux œuvres)

**Particularités** :
- Gestion pipe-separated values (œuvres multiples)
- Détection colonnes flexibles
- Fallback robuste

#### `enrichConcordances.js`
Enrichit les concordances avec les métadonnées.

**Stratégie de matching** :
1. Match exact sur identifiant Edi-XX
2. Match partiel sur titre + auteur
3. Fallback : conservation données brutes

## 🌍 Internationalisation

### Configuration

**Fichiers** : `src/shared/i18n/fr.json` et `en.json`

```javascript
// src/shared/i18n/index.js
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en }
    },
    fallbackLng: 'fr',
    interpolation: { escapeValue: false }
  });
```

### Structure des Clés

```json
{
  "sidebar": { "nav": {...}, "footer": {...} },
  "pagination": {...},
  "concordance": {
    "charts": {
      "tooltip": {...},
      "labels": {...},
      "noData": {...}
    },
    "views": {
      "overview": {...},
      "corpusComparison": {
        "charts": {
          "domains": {...},
          "authors": {...},
          "temporal": {...},
          "terminology": {...}
        }
      }
    }
  }
}
```

### Utilisation

```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('concordance.views.overview.title')}</h1>
      <p>{t('pagination.display', { count: 10 })}</p>
    </div>
  );
};
```

## 🎨 UI/UX

### Layout Global

**Sidebar verticale fixe (280px)** :
- Logo cliquable
- Navigation modules
- Liste des 9 vues
- Bouton filtres avec badge
- Compteur de concordances
- Switch langue FR/EN
- Footer © CiSaMe

**Zone de contenu** :
- Full height (100vh - header)
- Scrollable indépendamment
- Header de page avec icône + titre + bouton retour

### Thème Visuel

**Palette de couleurs** :
- **Primaire** : `#553C9A` (violet académique)
- **Secondaire** : `#2C5282` (bleu)
- **Accent** : `#D69E2E` (jaune or)
- **Neutre** : `#64748b` (gris)

**Dégradés** :
- Header : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Cartes : `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`

## ⚡ Performance

### Optimisations

**React** :
- `useMemo` pour calculs coûteux (analytics, tri)
- `useCallback` pour fonctions passées en props
- Lazy loading des vues (React Router)

**Data** :
- Pagination côté client (10/25/50/100/Tout)
- Filtres en temps réel avec debounce
- Calculs incrémentaux quand possible

**Exports** :
- CSV : génération côté client
- PNG : html2canvas pour graphiques
- JSON : stringify optimisé

### Gestion Mémoire

**Grandes listes** :
- Pagination obligatoire
- Slice des données pour l'affichage
- Virtualisation non nécessaire (<10k items)

## 🧪 Tests

### Test Manuel

```bash
npm run dev
# Ouvrir http://localhost:3000
# Tester :
# - Upload CSV métadonnées + concordances
# - Navigation entre vues
# - Filtres (texte, auteurs, domaines)
# - Switch FR ↔ EN
# - Exports CSV/JSON/PNG
# - Comparaison de 2 corpus
```

### Points de Test Clés

- [ ] Upload et parsing CSV
- [ ] Enrichissement métadonnées
- [ ] Filtres multiples combinés
- [ ] Calculs analytics corrects
- [ ] Tous les graphiques s'affichent
- [ ] Tooltips localisés
- [ ] Exports fonctionnels
- [ ] Comparaison de corpus
- [ ] Responsive (desktop uniquement)

## 🚀 Déploiement

### Build Production

```bash
npm run build
# → dist/ folder
```

**Optimisations Vite** :
- Tree-shaking automatique
- Minification (terser)
- Code splitting par route
- Assets hashés pour cache

### Variables d'Environnement

Aucune variable requise pour l'instant.

## 📝 Conventions de Code

### Nommage

- **Composants** : PascalCase (`MyComponent.jsx`)
- **Hooks** : camelCase avec `use` (`useMyHook.js`)
- **Utilitaires** : camelCase (`parseData.js`)
- **Constantes** : UPPER_SNAKE_CASE

### Structure Fichiers

```javascript
// Imports
import React from 'react';
import { useTranslation } from 'react-i18next';

// Types/Constants

// Main Component
const MyComponent = () => {
  // Hooks
  const { t } = useTranslation();

  // State

  // Effects

  // Handlers

  // Render
  return <div>...</div>;
};

// Export
export default MyComponent;
```

### Git Commits

Format : `<type>(<scope>): <message>`

**Types** :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `refactor` : Refactoring
- `docs` : Documentation
- `style` : Formatage
- `perf` : Performance
- `test` : Tests

**Exemples** :
```
feat(i18n): Add German translation
fix(charts): Correct temporal chart data calculation
docs(readme): Update installation instructions
```

## 🔗 Ressources

- [Documentation React 19](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Recharts Examples](https://recharts.org/)
- [react-i18next Guide](https://react.i18next.com/)

---

**Dernière mise à jour** : Novembre 2025
**Contributeurs** : Titouan (CiSaMe)
