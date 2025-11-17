# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.2.0] - 2025-11-17

### 🌍 Internationalisation complète

Migration exhaustive de toutes les chaînes de texte hardcodées vers le système i18n (react-i18next).

### ✨ Ajouté

**Nouvelles traductions FR/EN**
- 60+ nouvelles clés i18n ajoutées dans `fr.json` et `en.json`
- Traductions complètes pour tous les composants de l'analyseur de concordances
- Tooltips des graphiques entièrement internationalisés avec formatage intelligent des ordinaux (1er/1st, 2ème/2nd, etc.)
- Labels de graphiques avec interpolation de compteurs (ex: "Corpus A (1,234 concordances)")

**Composants migrés vers i18n**
- `Sidebar.jsx` - Navigation et footer
- `Pagination.jsx` - Contrôles de pagination (11 clés)
- `UploadInterface.jsx` - Interface d'upload
- `ComparisonView.jsx` - Vue de comparaison avec datasets radar
- `OverviewView.jsx` - Messages de comparaison de corpus
- `CorpusComparisonView.jsx` - Vue complète de comparaison
- `ComparisonDomainChart.jsx` - Graphiques de domaines
- `ComparisonAuthorChart.jsx` - Graphiques d'auteurs
- `ComparisonTemporalChart.jsx` - Graphiques temporels (granularité, modes de comptage)
- `ComparisonTermChart.jsx` - Graphiques terminologiques
- `TimelineGantt.jsx` - Timeline avec clés corrigées
- `WordCloud.jsx` - Messages d'état vide
- `AuthorChart.jsx` - Messages "no data"
- `CustomTooltipChart.jsx` - Tooltips enrichis ("Part du total", "Classement")
- `ExportUtils.js` - Messages d'alerte pour exports
- `QueryGenerator.jsx` & `ConcordanceAnalyzer.jsx` - Messages de développement

### 🔧 Modifié

**Corrections de clés**
- Correction des chemins de clés dans TimelineGantt (ajout préfixe `concordance.`)
- Ajout d'interpolation {{count}} aux labels de graphiques
- Correction du chemin de clé `noData` dans ComparisonTermChart

**Améliorations**
- Formatage intelligent des ordinaux selon la langue (FR: 1er, 2ème / EN: 1st, 2nd, 3rd, 11th, 12th, 13th)
- Tooltips adaptatifs avec statistiques localisées
- Support complet de la langue dans tous les exports

### 📦 Structure i18n

**Nouvelles sections dans les fichiers de traduction**
```json
{
  "sidebar": { "nav": {...}, "footer": {...} },
  "pagination": { "all", "display", "first", "previous", "next", "last" },
  "concordance": {
    "charts": {
      "tooltip": { "shareOfTotal", "ranking", "rankOf" },
      "noData": { "domains", "authors", "temporal", "terminology" }
    },
    "views": {
      "corpusComparison": {
        "charts": {
          "domains": {...},
          "authors": {...},
          "temporal": { "granularity", "countMode", ... },
          "terminology": {...}
        }
      }
    }
  }
}
```

### 📊 Statistiques

- **Clés ajoutées** : 65+ paires FR/EN
- **Composants migrés** : 15 fichiers
- **Commits** : 6 commits ciblés
- **Couverture** : 100% des textes visibles par l'utilisateur

**Mainteneur** : Titouan (CiSaMe)

---

## [1.1.0] - 2025-11-16

### 🎨 Refonte majeure de l'interface utilisateur

Refonte complète du layout avec sidebar verticale pour améliorer l'expérience utilisateur et l'utilisation de l'espace vertical.

### ✨ Ajouté

**Nouvelle architecture UI**
- **Sidebar verticale fixe** (280px à gauche)
  - Logo CALKIT cliquable pour retour à l'accueil
  - Navigation entre modules (Query Generator, Concordance Analyzer)
  - Liste complète des 9 vues avec icônes visuelles
  - Vue active marquée visuellement (fond jaune)
  - Bouton filtres avec badge de compteur en temps réel
  - Compteur de concordances toujours visible
  - Switch de langue FR/EN intégré
  - Footer © CISAME en bas de sidebar

**Optimisations layout**
- Layout full-height (100vh) : utilise toute la hauteur d'écran
- Zone de contenu principale responsive
- Header de page simplifié (titre + icône + bouton retour)
- Meilleur contraste et hiérarchie visuelle

**Nouveaux composants**
- `Sidebar.jsx` : Composant de navigation verticale
- `GlobalLayout.jsx` : Wrapper avec sidebar (remplace ancien layout)

### 🔧 Modifié

**Architecture**
- ConcordanceAnalyzer.jsx : Refactorisé pour utiliser GlobalLayout + Sidebar
- OverviewView.jsx : Grille adaptée pour full-height (gridTemplateRows avec 1fr)
- Suppression du header horizontal (remplacé par sidebar)

**Améliorations UX**
- Navigation toujours accessible (sidebar fixe)
- +180px d'espace vertical gagné (suppression header horizontal)
- Tous les contrôles à portée de main
- Look plus professionnel "application desktop"

### ❌ Retiré

- Header horizontal avec 4 modules
- Bouton filtres en haut à droite (déplacé dans sidebar)
- LanguageSwitcher autonome (intégré dans sidebar)
- Compteur de concordances en haut (déplacé dans sidebar)
- Footer en bas de page (déplacé dans sidebar)

### ⚡ Performance

- Réduction du nombre de re-renders (sidebar séparée du contenu)
- Optimisation du layout avec flexbox
- Meilleure gestion du scroll (sidebar fixe, contenu scrollable)

---

## [1.0.0] - 2025-11-14

### 🎉 Release initiale - Production ready

Première version stable du module Concordance Analyzer avec toutes les fonctionnalités principales implémentées.

### ✨ Ajouté

#### Module Concordance Analyzer

**Upload et parsing**
- Upload de fichiers CSV via drag & drop ou sélection
- Parser pour métadonnées complètes (117 entrées)
- Parser pour exports NoSketch Engine
- Détection automatique des colonnes CSV
- Matching intelligent avec identifiants Edi-XX
- Gestion des œuvres multiples (pipe-separated)
- Fallback robuste en cas de non-match
- Calcul du taux de correspondance

**Vues d'analyse**
- Vue d'ensemble avec grille interactive de panels (3×4)
- Vue domaines : analyse par domaines juridiques
- Vue auteurs : distribution par autorités
- Vue chronologie : évolution temporelle avec granularités variables
- Vue lieux : répartition géographique (4 pays ciblés)
- Vue terminologie : analyse lexicale des termes-clés
- Vue données : table paginée de concordances détaillées
- Vue comparaison de corpus : analyse comparative de 2 corpus distincts

**Visualisations**
- Bar charts (Recharts) : domaines, auteurs, lieux
- Line charts : évolution temporelle
- Timeline Gantt (D3.js) : plages temporelles des œuvres
- Nuage de mots : termes KWIC fréquents
- Charts comparatifs : domaines, auteurs, temporalité, terminologie

**Filtres avancés**
- Recherche textuelle (Left, KWIC, Right, Author, Title)
- Filtres multi-sélection : auteurs, domaines, périodes, lieux
- Application combinée (AND logic)
- Mise à jour temps réel des visualisations
- Compteur de filtres actifs
- Bouton de réinitialisation

**Exports**
- Export CSV : concordances filtrées avec métadonnées
- Export JSON : analytics complètes
- Export PNG : captures de graphiques (html2canvas)
- Exports contextuels par vue

**Interface utilisateur**
- Navigation par panels cliquables
- Indicateurs visuels (gradients, hover effects)
- Headers de sections avec statistiques
- Pagination configurable (10/25/50/100 items)
- Tooltips informatifs sur les charts
- Messages d'état (loading, no data)

**Internationalisation**
- Support complet FR/EN
- Switch de langue en temps réel
- Toutes les chaînes UI traduites
- Format des dates adapté par langue

**Système de thème**
- Palette de couleurs académiques cohérente
- Gradients personnalisés par panel
- Mode sombre pour certains panels
- Ombres et transitions fluides

#### Infrastructure technique

**Architecture**
- React 19 avec hooks modernes
- React Router v7 pour la navigation
- Vite 6 comme bundler
- Structure modulaire componentisée
- Custom hooks pour logique réutilisable
- Utilitaires dédiés (parsers, exports)

**Performance**
- Memoization (useMemo/useCallback) pour calculs coûteux
- Pagination pour grandes listes
- Debouncing pour filtres textuels
- Lazy loading (prévu)
- Code splitting par routes

**Configuration**
- panelConfig.js pour configuration centralisée
- visualTheme.js pour thème global
- i18n avec react-i18next
- Alias de chemins (@shared, @modules)

### 🔧 Configuration

**Dépendances principales**
- react: 19.0.0
- react-router-dom: 7.1.1
- recharts: 2.15.0
- d3: 7.9.0
- react-i18next: 15.1.3
- papaparse: 5.4.1
- html2canvas: 1.4.1

**Outils de développement**
- vite: 6.0.5
- @vitejs/plugin-react: 4.3.4
- eslint: 9.17.0

### 📝 Documentation

- README.md complet avec guide d'utilisation
- ARCHITECTURE.md avec détails techniques
- CONTRIBUTING.md avec guidelines de contribution
- JSDoc pour composants principaux

### 🎨 Design

**Panels implémentés (8)**
- Overview : statistiques globales
- Domaines : répartition disciplinaire
- Chronologie : évolution temporelle
- Auteurs : autorités principales
- Terminologie : lexique spécialisé
- Lieux : répartition géographique
- Données : concordances détaillées
- Comparaison de corpus : analyse comparative

**Panels retirés (2)**
- Nuage de mots : redondant avec terminologie
- Comparaison multi-critères : non utilisé

**Grille optimisée**
- 3 lignes × 4 colonnes (au lieu de 4×4)
- Overview et Corpus Comparison : demi-hauteur chacun
- Gain d'espace vertical de 25%

### 🐛 Corrections

**Parsing**
- Fix: Gestion des cellules CSV vides
- Fix: Échappement des guillemets dans exports CSV
- Fix: Parsing des dates au format "YYYY to YYYY"
- Fix: Détection robuste des colonnes NoSketch

**UI/UX**
- Fix: Overflow sur noms longs dans charts
- Fix: Z-index panels hover
- Fix: Responsive sur petits écrans
- Fix: Transitions CSS optimisées (GPU)

**i18n**
- Fix: Clés manquantes pour toutes les vues
- Fix: Préfixe 'concordance.' pour namespacing
- Fix: Encodage UTF-8 des fichiers de traduction

### ⚡ Performance

- Optimisation: Memoization des calculs analytics
- Optimisation: Pagination pour 1000+ concordances
- Optimisation: Debounce 300ms sur recherche textuelle
- Optimisation: Utilisation de CSS transforms pour animations

### 🔒 Sécurité

- Sanitization des entrées utilisateur
- Validation des fichiers uploadés (taille, type)
- Pas de eval() ou dangerouslySetInnerHTML
- CSP-ready pour déploiement

---

## [Unreleased]

### 🚧 En développement

**Phase H - Tests et finalisation**
- [ ] Tests unitaires (Jest) pour parsers
- [ ] Tests d'intégration (RTL) pour composants
- [ ] Tests E2E (Playwright) pour flux utilisateur
- [ ] Configuration Jest avec coverage
- [ ] Ajout de tests pour hooks personnalisés

**Améliorations prévues**
- [ ] Mode hors-ligne avec Service Worker
- [ ] Export PDF des rapports
- [ ] Sauvegarde des configurations de filtres
- [ ] Amélioration accessibilité (ARIA, keyboard nav)
- [ ] TypeScript migration (long terme)

---

## Format des entrées

Les entrées du changelog suivent ce format :

### [Version] - YYYY-MM-DD

#### ✨ Ajouté
Nouvelles fonctionnalités

#### 🔧 Modifié
Changements dans fonctionnalités existantes

#### 🐛 Corrigé
Corrections de bugs

#### ❌ Retiré
Fonctionnalités supprimées

#### 🔒 Sécurité
Corrections de vulnérabilités

#### ⚡ Performance
Améliorations de performance

---

## Versioning

Le projet utilise [Semantic Versioning](https://semver.org/) :

- **MAJOR** : Changements incompatibles avec versions précédentes
- **MINOR** : Nouvelles fonctionnalités rétrocompatibles
- **PATCH** : Corrections de bugs rétrocompatibles

**Version actuelle** : 1.0.0 (Production stable)

---

## Tags Git

Les versions sont taguées dans Git :

```bash
# Voir tous les tags
git tag

# Voir les détails d'un tag
git show v1.0.0

# Tags majeurs
v1.0-phase-F-complete    # Traductions i18n complètes
v1.0-architecture-complete # Architecture finalisée (90%)
v1.0.0                   # Release production
```

---

## Maintenance

### Politique de support

- **Version courante (1.x)** : Support complet
- **Versions antérieures** : Corrections sécurité uniquement pendant 6 mois
- **Versions obsolètes** : Plus de support après 1 an

### Cycle de release

- **Patches (1.0.x)** : Au besoin pour bugs critiques
- **Minors (1.x.0)** : Trimestriellement pour nouvelles features
- **Majors (x.0.0)** : Annuellement pour breaking changes

---

**Maintenu par** : Titouan (CISAME)  
**Dernière mise à jour** : 14 novembre 2025
