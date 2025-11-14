# Architecture technique - CALKIT Concordance Analyzer

## 📐 Vue d'ensemble

Le module Concordance Analyzer est une application React moderne construite selon une architecture modulaire et componentisée. L'application traite des fichiers CSV de concordances et de métadonnées pour produire des analyses lexicométriques enrichies.

## 🏗️ Architecture globale

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │ Overview │  │  Views   │  │ Filters  │  │ Exports ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  State Management                        │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │ File State │  │ Data State │  │ Filter State     │ │
│  └────────────┘  └────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Custom Hooks                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │useFileUpload │  │ useAnalytics │  │useFilters... │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Utils & Parsers                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │concordParser │  │metadataParser│  │ exportUtils  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 📂 Structure des dossiers

```
src/modules/concordance-analyzer/
│
├── ConcordanceAnalyzer.jsx          # Composant racine
│
├── components/
│   ├── charts/                      # Visualisations
│   │   ├── AuthorChart.jsx         # Bar chart auteurs
│   │   ├── DomainChart.jsx         # Bar chart domaines
│   │   ├── PlaceChart.jsx          # Bar chart lieux
│   │   ├── TemporalChart.jsx       # Évolution temporelle
│   │   ├── TimelineGantt.jsx       # Timeline interactive
│   │   ├── WordCloud.jsx           # Nuage de mots
│   │   ├── RadarChart.jsx          # Chart radar (unused)
│   │   └── CustomTooltipChart.jsx  # Tooltips personnalisés
│   │
│   ├── comparison/                  # Comparaison de corpus
│   │   ├── CorpusUploader.jsx      # Upload 2e corpus
│   │   ├── ComparisonAuthorChart.jsx
│   │   ├── ComparisonDomainChart.jsx
│   │   ├── ComparisonTemporalChart.jsx
│   │   └── ComparisonTermChart.jsx
│   │
│   ├── ui/                          # Composants UI réutilisables
│   │   ├── NavigationPanel.jsx     # Panels cliquables
│   │   ├── FilterMenu.jsx          # Menu de filtres
│   │   ├── ExportButtons.jsx       # Boutons d'export
│   │   ├── UploadInterface.jsx     # Zone de drop files
│   │   ├── Pagination.jsx          # Pagination tables
│   │   ├── PanelHeader.jsx         # Headers de sections
│   │   └── LanguageSwitcher.jsx    # Switch FR/EN
│   │
│   └── views/                       # Vues principales
│       ├── OverviewView.jsx        # Vue d'ensemble (grille)
│       ├── DomainsView.jsx         # Analyse domaines
│       ├── AuthorsView.jsx         # Analyse auteurs
│       ├── TemporalView.jsx        # Analyse temporelle
│       ├── PlacesView.jsx          # Analyse géographique
│       ├── LinguisticView.jsx      # Analyse terminologique
│       ├── DataView.jsx            # Table de concordances
│       └── CorpusComparisonView.jsx # Comparaison 2 corpus
│
├── hooks/                           # Custom hooks
│   ├── useFileUpload.js            # Gestion upload fichiers
│   ├── useAnalytics.js             # Calculs statistiques
│   ├── useFilteredData.js          # Application filtres
│   ├── usePagination.js            # Gestion pagination
│   ├── useWordFrequency.js         # Analyse fréquences
│   └── useCorpusComparison.js      # Logique comparaison
│
├── utils/                           # Utilitaires
│   ├── concordanceParser.js        # Parse CSV NoSketch
│   ├── metadataParser.js           # Parse CSV métadonnées
│   ├── referenceParser.js          # Parse références canon
│   ├── ExportUtils.js              # Exports CSV/JSON
│   └── ChartExportUtils.js         # Exports PNG charts
│
└── config/
    └── panelConfig.js              # Config des panels
```

## 🔄 Flux de données

### 1. Upload et parsing

```
User uploads files
        ↓
┌──────────────────┐
│  File readers    │ FileReader API
└──────────────────┘
        ↓
┌──────────────────┐
│  CSV parsers     │ PapaParse
└──────────────────┘
        ↓
┌──────────────────┐
│ Data enrichment  │ Matching Edi-XX
└──────────────────┘
        ↓
┌──────────────────┐
│   State update   │ React setState
└──────────────────┘
```

**Parsing des concordances** (`concordanceParser.js`) :
- Détection automatique des colonnes (Left, KWIC, Right, Doc.title, etc.)
- Pattern matching pour extraire `[Edi-XX]` des références
- Gestion des références multiples (pipe-separated)
- Fallback sur parsing manuel si pas de match

**Parsing des métadonnées** (`metadataParser.js`) :
- Lecture du CSV complet (117 lignes)
- Indexation par identifiant Edi-XX
- Support des champs multi-valeurs (domaines, lieux)
- Normalisation des dates (ranges et dates précises)

### 2. Enrichissement des données

```javascript
// Algorithme de matching
for each concordance:
  1. Extract Edi-XX from reference
  2. Lookup in metadata index
  3. If found:
       - Merge metadata fields
       - Mark as enriched
  4. If not found:
       - Keep original data
       - Mark as fallback
       - Try manual parsing
```

**Taux de correspondance** : `successfulMatches / totalReferences * 100`

### 3. Calcul des analytics

Les analytics sont recalculées à chaque changement de filtre via `useAnalytics` :

```javascript
// useAnalytics.js - Calculs principaux
{
  total: filteredData.length,
  domains: aggregateByField('domain'),
  authors: aggregateByField('author'),
  periods: aggregateByTemporal('period'),
  places: aggregateByField('place'),
  keyTerms: extractKWICTerms(filteredData)
}
```

### 4. Application des filtres

```
User interactions
        ↓
┌──────────────────┐
│  Filter state    │ useState
└──────────────────┘
        ↓
┌──────────────────┐
│useFilteredData   │ Custom hook
└──────────────────┘
        ↓
┌──────────────────┐
│  Filtered array  │ Array.filter()
└──────────────────┘
        ↓
┌──────────────────┐
│  Re-render views │ React reconciliation
└──────────────────┘
```

**Filtres supportés** :
- **Text search** : recherche dans Left, KWIC, Right, Author, Title
- **Multi-select** : authors, domains, periods, places
- **Combinaison AND** : tous les filtres actifs sont appliqués

## 🎨 Système de panels

### Configuration des panels

```javascript
// panelConfig.js
{
  overview: {
    id: 'overview',
    gridArea: '1 / 1 / 2 / 2',  // CSS Grid position
    size: 'medium',
    color: '#1A365D',
    gradient: 'linear-gradient(...)'
  },
  // ... autres panels
}
```

### Grille CSS Grid

```css
display: grid;
grid-template-columns: 1.3fr 0.6fr 0.6fr 0.6fr;
grid-template-rows: 250px 250px 200px;
gap: 2px;
```

**Layout actuel** :
```
┌─────────────┬─────────┬─────────┬─────────┐
│             │ Domaines│Chronol. │ Lieux   │
│  Overview   ├─────────┼─────────┼─────────┤
│  (stats)    │ Auteurs │ Termino.│ Données │
├─────────────┼─────────┴─────────┴─────────┤
│  Corpus     │                             │
│  Comparison │       Import                │
└─────────────┴─────────────────────────────┘
```

## 📊 Visualisations

### Charts Recharts

Tous les charts utilisent Recharts avec configuration cohérente :

```javascript
// Configuration standard
<BarChart 
  data={data}
  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" angle={-45} />
  <YAxis />
  <Tooltip content={<CustomTooltip />} />
  <Bar dataKey="value" fill={visualTheme.colors.primary} />
</BarChart>
```

**Charts disponibles** :
- **BarChart** : Domaines, Auteurs, Lieux
- **LineChart** : Évolution temporelle
- **ComposedChart** : Comparaisons corpus

### Timeline Gantt (D3.js)

Timeline personnalisée construite avec D3.js pour visualiser les plages temporelles :

```javascript
// Échelle temporelle
const xScale = d3.scaleTime()
  .domain([minYear, maxYear])
  .range([0, width]);

// Barres par œuvre
works.forEach(work => {
  svg.append('rect')
    .attr('x', xScale(work.startDate))
    .attr('width', xScale(work.endDate) - xScale(work.startDate))
    .attr('height', barHeight);
});
```

## 🌐 Internationalisation (i18n)

### Structure des traductions

```json
// fr.json
{
  "concordance": {
    "panels": { ... },
    "charts": { ... },
    "views": { ... },
    "filters": { ... },
    "data": { ... }
  }
}
```

### Utilisation

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('concordance.panels.overview.title')}</h1>;
};
```

**Langues supportées** : 🇫🇷 Français (défaut), 🇬🇧 English

## ⚡ Optimisations performance

### Memoization

```javascript
// Évite les recalculs inutiles
const analytics = useMemo(() => 
  calculateAnalytics(filteredData), 
  [filteredData]
);

const sortedData = useMemo(() =>
  [...data].sort(sortFunction),
  [data, sortFunction]
);
```

### Pagination

```javascript
// usePagination.js - Découpe par pages
const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return data.slice(start, end);
}, [data, currentPage, itemsPerPage]);
```

### Debouncing

```javascript
// Filtre textuel avec debounce
const debouncedSearch = useMemo(
  () => debounce((value) => setSearch(value), 300),
  []
);
```

## 🔐 Gestion d'état

### État local (useState)

```javascript
// ConcordanceAnalyzer.jsx - État principal
const [metadataData, setMetadataData] = useState(null);
const [concordanceData, setConcordanceData] = useState([]);
const [activeFilters, setActiveFilters] = useState({
  authors: [], domains: [], periods: [], places: []
});
const [activeView, setActiveView] = useState('overview');
```

### Hooks personnalisés

Les hooks encapsulent la logique métier :

```javascript
// useFileUpload.js
const { handleMetadataUpload, handleConcordanceUpload } = useFileUpload({
  onMetadataLoad: setMetadataData,
  onConcordanceLoad: setConcordanceData,
  onStatsUpdate: setParseStats
});

// useFilteredData.js
const filteredData = useFilteredData(concordanceData, activeFilters);

// useAnalytics.js
const analytics = useAnalytics(filteredData);
```

## 📤 Système d'export

### Exports disponibles

**CSV (concordances)** :
```javascript
// ExportUtils.js
const csv = [
  headers.join(','),
  ...data.map(row => values.map(quote).join(','))
].join('\n');

const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
download(blob, 'concordances.csv');
```

**JSON (analytics)** :
```javascript
const json = JSON.stringify(analytics, null, 2);
const blob = new Blob([json], { type: 'application/json' });
download(blob, 'analytics.json');
```

**PNG (charts)** :
```javascript
// ChartExportUtils.js via html2canvas
html2canvas(chartElement).then(canvas => {
  canvas.toBlob(blob => {
    download(blob, 'chart.png');
  });
});
```

## 🎨 Système de thème

### visualTheme.js

```javascript
export const visualTheme = {
  colors: {
    primary: {
      main: '#553C9A',    // Violet académique
      blue: '#2563eb',
      dark: '#3730a3',
      light: '#6B46C1'
    },
    accent: {
      orange: '#f59e0b',
      green: '#10b981',
      red: '#dc2626'
    },
    text: {
      dark: '#1e293b',
      light: '#F7FAFC'
    }
  },
  shadows: {
    panel: '0 4px 12px rgba(0, 0, 0, 0.08)',
    panelHover: '0 8px 24px rgba(0, 0, 0, 0.12)'
  },
  borderRadius: {
    md: '8px',
    lg: '12px',
    xl: '16px'
  }
};
```

### Gradients

```javascript
export const createGradient = (from, to, deg = 135) =>
  `linear-gradient(${deg}deg, ${from} 0%, ${to} 100%)`;
```

## 🧪 Tests (à venir)

### Structure de tests prévue

```
tests/
├── unit/
│   ├── parsers/
│   ├── hooks/
│   └── utils/
├── integration/
│   └── components/
└── e2e/
    └── user-flows/
```

### Stratégie de tests

- **Unit** : Parsers, utilitaires, hooks (Jest)
- **Integration** : Composants (React Testing Library)
- **E2E** : Flux utilisateur complets (Playwright)

## 🚀 Déploiement

### Build de production

```bash
npm run build
# → dist/ (optimisé pour production)
```

### Optimisations Vite

- **Code splitting** : Découpage automatique par routes
- **Tree shaking** : Élimination du code mort
- **Minification** : Terser pour JS, cssnano pour CSS
- **Compression** : Gzip des assets

## 📈 Métriques de performance

### Bundle size (estimé)

- **Chunk principal** : ~200 KB (gzipped)
- **Vendors** : ~150 KB (React, Recharts, D3)
- **Total** : ~350 KB (gzipped)

### Performance runtime

- **First Contentful Paint** : < 1s
- **Time to Interactive** : < 2s
- **Large data handling** : 1000+ concordances fluides

## 🔗 Dépendances clés

### Production

```json
{
  "react": "^19.0.0",
  "react-router-dom": "^7.1.1",
  "recharts": "^2.15.0",
  "d3": "^7.9.0",
  "react-i18next": "^15.1.3",
  "papaparse": "^5.4.1",
  "html2canvas": "^1.4.1"
}
```

### Development

```json
{
  "vite": "^6.0.5",
  "@vitejs/plugin-react": "^4.3.4",
  "eslint": "^9.17.0"
}
```

## 🗺️ Roadmap technique

### Court terme (v1.1)

- [ ] Tests Jest/RTL pour parsers et hooks
- [ ] Documentation JSDoc complète
- [ ] Optimisation bundle size (lazy loading)
- [ ] Amélioration accessibilité (ARIA labels)

### Moyen terme (v1.5)

- [ ] Mode hors-ligne (Service Worker)
- [ ] Export PDF des rapports
- [ ] API backend pour persistence
- [ ] Partage de configurations de filtres

### Long terme (v2.0)

- [ ] Analyse syntaxique (TreeTagger integration)
- [ ] Machine Learning pour classification auto
- [ ] Collaboration temps réel
- [ ] Plugin architecture

---

**Dernière mise à jour** : Novembre 2025  
**Mainteneur** : Titouan (CISAME)
