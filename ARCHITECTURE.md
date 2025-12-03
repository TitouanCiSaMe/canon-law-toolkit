# Architecture - Canon Law Toolkit

**Version** : 1.3.0
**Date** : Novembre 2025
**Mainteneur** : Titouan (CiSaMe - Circulation des Savoirs médiévaux)

---

## 📐 Vue d'Ensemble

CiSaMe (Circulation des Savoirs Médiévaux) est une application React modulaire pour l'analyse de concordances de textes canoniques médiévaux et la génération de requêtes CQL. Architecture basée sur des modules autonomes avec système i18n complet.

## 🏗️ Stack Technique

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 18.2.0 | Framework UI |
| **Vite** | 5.0.8 | Build tool & dev server |
| **React Router** | 6.20.0 | Routing SPA |
| **Recharts** | 2.10.3 | Visualisations (bar, line, pie) |
| **D3.js** | Intégré | Timeline Gantt |
| **react-i18next** | 13.5.0 | Internationalisation FR/EN |
| **Vitest** | 1.0.4 | Test runner |
| **React Testing Library** | 14.1.2 | Tests composants |

## 📁 Structure des Dossiers

```
canon-law-toolkit/
├── src/
│   ├── modules/
│   │   ├── query-generator/                # Générateur de requêtes CQL
│   │   │   ├── components/
│   │   │   │   ├── ui/                     # Composants UI (CSS Modules)
│   │   │   │   │   ├── FormField.jsx
│   │   │   │   │   ├── FormField.module.css
│   │   │   │   │   ├── RadioGroup.jsx
│   │   │   │   │   ├── RadioGroup.module.css
│   │   │   │   │   ├── InfoBox.jsx
│   │   │   │   │   ├── InfoBox.module.css
│   │   │   │   │   ├── ResultCard.jsx
│   │   │   │   │   └── ResultCard.module.css
│   │   │   │   └── views/                  # 4 vues principales
│   │   │   │       ├── ProximityView.jsx
│   │   │   │       ├── VariationView.jsx
│   │   │   │       ├── SemanticView.jsx
│   │   │   │       └── ProximityVariationView.jsx
│   │   │   ├── utils/                      # Générateurs de requêtes
│   │   │   │   └── queryGenerators.js
│   │   │   ├── docs/                       # Documentation (2413 lignes)
│   │   │   │   ├── COMPONENTS.md
│   │   │   │   ├── USER_GUIDE.md
│   │   │   │   └── UTILS.md
│   │   │   ├── __tests__/                  # Tests unitaires
│   │   │   └── README.md
│   │   │
│   │   └── concordance-analyzer/           # Analyseur de concordances
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
│   │   ├── QueryGenerator.jsx              # Point d'entrée Query Generator
│   │   ├── ConcordanceAnalyzer.jsx         # Point d'entrée Concordance Analyzer
│   │   └── App.jsx                         # Point d'entrée React Router
│   │
│   └── main.jsx                            # Point d'entrée Vite
│
├── public/                                 # Assets statiques
├── docs/                                   # Documentation projet
├── scripts/                                # Scripts utilitaires
└── vitest.config.js                        # Configuration Vitest
```

## 🎯 Modules

### Query Generator

Module pour générer des requêtes CQL (Corpus Query Language) destinées à NoSketch Engine.

**4 types de recherche** :
1. **Proximité** : Recherche de deux mots à distance configurable
2. **Variations** : Génération de variantes orthographiques médiévales
3. **Sémantique** : Recherche conceptuelle avancée
4. **Proximité + Variations** : Combinaison des approches

**Architecture** :
- **4 composants UI** avec CSS Modules (FormField, RadioGroup, InfoBox, ResultCard)
- **4 vues** (une par type de recherche)
- **1 utilitaire** de génération de requêtes
- **Documentation complète** (2413 lignes)

**Tests** :
- UI Components : 93/93 tests ✅ (100%)
- View Components : 64/91 tests ✅ (70%)

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

## 🎨 Styling

### CSS Modules

Le projet utilise **CSS Modules** pour les nouveaux composants UI du Query Generator.

**Avantages** :
- ✅ Scoped CSS (pas de conflits de noms)
- ✅ Meilleure maintenabilité
- ✅ Optimisation du bundle (tree-shaking)
- ✅ Intégration Vite native

**Composants avec CSS Modules** :
- `FormField` (src/modules/query-generator/components/ui/FormField.module.css)
- `RadioGroup` (src/modules/query-generator/components/ui/RadioGroup.module.css)
- `InfoBox` (src/modules/query-generator/components/ui/InfoBox.module.css)
- `ResultCard` (src/modules/query-generator/components/ui/ResultCard.module.css)

**Utilisation** :
```jsx
import styles from './FormField.module.css';

const FormField = ({ label }) => (
  <div className={styles.field}>
    <label className={styles.label}>{label}</label>
  </div>
);
```

### Inline Styles (Legacy)

Les anciens composants (Concordance Analyzer, Shared) utilisent encore des inline styles avec `globalTheme.js`.

**Migration progressive** : Nouveaux composants utilisent CSS Modules.

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
  "queryGenerator": {
    "ui": {...},
    "views": {...}
  },
  "concordance": {
    "charts": {
      "tooltip": {...},
      "labels": {...},
      "noData": {...}
    },
    "views": {
      "overview": {...},
      "corpusComparison": {...}
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
- Liste des vues (9 pour Concordance Analyzer, 4 pour Query Generator)
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

### Framework : Vitest

Le projet utilise **Vitest** comme test runner moderne et rapide.

**Configuration** : `vitest.config.js`

```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js']
  }
});
```

### Commandes

```bash
# Tests unitaires
npm test

# Tests avec UI interactive
npm run test:ui

# Tests avec couverture
npm run test:coverage

# Lancer tests une fois (CI)
npm run test:run
```

### Couverture Actuelle

**Query Generator** :
- ✅ UI Components : 93/93 tests (100%)
  - FormField.test.jsx
  - RadioGroup.test.jsx
  - InfoBox.test.jsx
  - ResultCard.test.jsx
- ⚠️ View Components : 64/91 tests (70%)
  - ProximityView.test.jsx
  - VariationView.test.jsx
  - SemanticView.test.jsx
  - ProximityVariationView.test.jsx

**Concordance Analyzer** :
- 🚧 Tests à venir

**Shared Components** :
- 🚧 Tests à venir

### Outils de Test

- **Vitest** : Test runner (remplace Jest)
- **React Testing Library** : Tests orientés utilisateur
- **jsdom** : Environnement DOM pour tests
- **@testing-library/user-event** : Simulation d'interactions utilisateur

### Stratégie de Test

**Unit Tests** :
- Composants UI isolés
- Utilitaires (parsers, générateurs de requêtes)
- Hooks personnalisés

**Integration Tests** :
- Vues complètes avec interactions
- Flux de données (upload → parsing → analytics)

**E2E Tests** (à venir) :
- Parcours utilisateur complets
- Tests multi-modules

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

### Plateformes Recommandées

**Vercel** (⭐ Recommandé) :
- Zero-config pour Vite + React
- Déploiement automatique depuis Git
- HTTPS et CDN inclus
- Preview deployments

**Netlify** :
- Interface drag & drop
- Redirects pour React Router
- Formulaires et fonctions serverless

**Cloudflare Pages** :
- Bandwidth illimité
- Builds illimités
- CDN ultra-rapide

**GitHub Pages** :
- Gratuit à vie
- Nécessite configuration base path pour React Router

### Configuration React Router

**vercel.json** :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**public/_redirects** (Netlify) :
```
/*    /index.html   200
```

### Variables d'Environnement

Aucune variable requise actuellement. Le projet fonctionne entièrement côté client.

## 📝 Conventions de Code

### Nommage

- **Composants** : PascalCase (`MyComponent.jsx`)
- **Hooks** : camelCase avec `use` (`useMyHook.js`)
- **Utilitaires** : camelCase (`parseData.js`)
- **Constantes** : UPPER_SNAKE_CASE
- **CSS Modules** : kebab-case (`.module.css`)

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
feat(query-generator): Add CSS Modules to UI components
fix(tests): Convert View tests from Jest to Vitest mocking
docs(query-generator): Add complete documentation
```

## 🔗 Ressources

- [Documentation React 18](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Recharts Examples](https://recharts.org/)
- [react-i18next Guide](https://react.i18next.com/)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)

---

**Dernière mise à jour** : Novembre 2025
**Version** : 1.3.0
**Contributeurs** : Titouan (CiSaMe)
