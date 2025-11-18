# CALKIT - Canon Law Analysis Toolkit

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://gitlab.com/cisame/canon-law-toolkit)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)](https://react.dev/)
[![i18n](https://img.shields.io/badge/i18n-FR%20%7C%20EN-orange.svg)](src/shared/i18n)
[![Tests](https://img.shields.io/badge/tests-passing-success.svg)](vitest.config.js)

Plateforme d'outils numériques pour l'analyse du droit canon médiéval, développée par CiSaMe (Circulation des Savoirs médiévaux).

## 🎯 Présentation

CALKIT est une suite d'outils web destinée aux chercheurs en histoire du droit médiéval. Le projet se compose de plusieurs modules spécialisés pour l'analyse lexicométrique et structurelle de corpus juridiques latins.

### Modules disponibles

- **🏠 Home** : Page d'accueil et navigation
- **🔍 Query Generator** : Générateur de requêtes CQL pour NoSketch Engine
  - Recherche de proximité (mots proches)
  - Variations orthographiques médiévales (ae/e, v/u, j/i, ti/ci)
  - Recherche sémantique
  - Combinaisons avancées (proximité + variations)
- **📊 Concordance Analyzer** : Analyse approfondie de concordances avec enrichissement métadonnées
  - 9 vues d'analyse spécialisées
  - Enrichissement automatique avec métadonnées Edi-XX
  - Visualisations interactives (charts, timeline, word cloud)
  - Comparaison de corpus

## 📦 Installation

### Prérequis

- Node.js 18+ et npm
- Git
- Navigateur moderne (Chrome, Firefox, Edge)

### Installation locale

```bash
# Cloner le dépôt
git clone git@gitlab.com:cisame/canon-law-toolkit.git
cd canon-law-toolkit

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

### Build de production

```bash
# Créer le build optimisé
npm run build

# Prévisualiser le build
npm run preview
```

## 🚀 Utilisation rapide

### Query Generator

1. **Sélectionner le type de recherche** :
   - Proximité : Rechercher deux mots à distance configurable
   - Variations : Générer toutes les variantes orthographiques médiévales
   - Sémantique : Recherche conceptuelle avancée
   - Proximité + Variations : Combinaison des deux approches

2. **Configurer les paramètres** :
   - Distance entre mots (1-20 tokens)
   - Types de variations à activer (ae/e, v/u, j/i, ti/ci)
   - Options de lemmatisation

3. **Générer la requête CQL** :
   - Copier la requête générée
   - Coller dans NoSketch Engine
   - Lancer la recherche

📚 **Documentation complète** : [Query Generator README](src/modules/query-generator/README.md)

### Concordance Analyzer

1. **Upload des fichiers** :
   - Métadonnées (CSV complet avec identifiants Edi-XX)
   - Export NoSketch Engine (CSV avec concordances)

2. **Exploration des données** :
   - Vue d'ensemble avec statistiques globales
   - Analyses par domaine juridique, auteur, période, lieu
   - Timeline interactive des œuvres
   - Analyse terminologique

3. **Filtres avancés** :
   - Recherche textuelle
   - Filtres par auteur, domaine, période, lieu
   - Combinaisons multiples

4. **Comparaison de corpus** :
   - Upload de 2 fichiers de concordances
   - Analyse comparative (volumes, auteurs, domaines, temporalité, terminologie)

5. **Exports** :
   - CSV (concordances filtrées)
   - JSON (analytics complètes)
   - PNG (graphiques)

📚 **Guide détaillé** : [QUICKSTART.md](QUICKSTART.md)

## 📊 Fonctionnalités principales

### Query Generator

- **Générateur de proximité** : Recherche de mots à distance configurable (1-20 tokens)
- **Générateur de variations** :
  - Variations ae/e (ex: caelum → celum)
  - Variations v/u (ex: servus → seruus)
  - Variations j/i (ex: justitia → iustitia)
  - Variations ti/ci (ex: gratia → gracia)
  - Combinaisons multiples (jusqu'à 96 variantes par mot)
- **Générateur sémantique** : Recherche conceptuelle avancée
- **Interface intuitive** :
  - 4 composants UI avec CSS Modules
  - Validation en temps réel
  - Prévisualisation de la requête
  - Messages d'aide contextuels

### Concordance Analyzer

#### Analyse lexicométrique

- **Enrichissement automatique** : Matching des références avec métadonnées Edi-XX
- **Parsing intelligent** : Détection de structure complexe (pipe-separated multiple works)
- **Fallback robuste** : Conservation des données même sans match parfait
- **Taux de correspondance** : Calcul et affichage du taux d'enrichissement

#### Visualisations

- **Bar charts** : Domaines juridiques, auteurs, lieux
- **Temporal charts** : Évolution chronologique avec granularités variables (années, décennies, quarts/demi-siècles)
- **Timeline Gantt** : Visualisation des plages temporelles des œuvres
- **Nuage de mots** : Termes KWIC les plus fréquents
- **Charts comparatifs** : Analyse parallèle de 2 corpus

#### Interface utilisateur

- **Grille interactive** : Navigation par panels cliquables
- **Filtres en temps réel** : Mise à jour instantanée des visualisations
- **Pagination** : Gestion efficace de gros volumes de données
- **Export flexible** : CSV, JSON, PNG selon les besoins
- **Multilingue** : Interface complète en français et anglais

## 🏗️ Architecture technique

### Stack technologique

- **Frontend** : React 18.2, Vite 5.0
- **Routing** : React Router DOM v6
- **Visualisations** : Recharts (charts), D3.js (timeline)
- **i18n** : react-i18next
- **Styling** : CSS Modules + inline styles
- **Build** : Vite avec optimisations production
- **Tests** : Vitest + React Testing Library

### Structure modulaire

```
src/
├── modules/
│   ├── query-generator/          # Générateur de requêtes CQL
│   │   ├── components/
│   │   │   ├── ui/               # 4 composants UI (CSS Modules)
│   │   │   └── views/            # 4 vues principales
│   │   ├── utils/                # Générateurs de requêtes
│   │   ├── docs/                 # Documentation complète
│   │   └── __tests__/            # Tests unitaires
│   │
│   └── concordance-analyzer/     # Analyseur de concordances
│       ├── components/           # Composants UI
│       ├── hooks/                # Logic réutilisable
│       ├── utils/                # Parsers & exports
│       └── config/               # Configuration
│
└── shared/
    ├── i18n/                     # Traductions FR/EN
    ├── theme/                    # Thème visuel
    └── components/               # Layout global
```

### Performance

- **Lazy loading** : Chargement différé des composants lourds
- **Memoization** : Optimisation des recalculs (useMemo)
- **Pagination** : Gestion efficace des grandes listes
- **Debouncing** : Optimisation des filtres en temps réel

## 📚 Documentation détaillée

### Documentation projet
- [ARCHITECTURE.md](ARCHITECTURE.md) - Documentation technique complète
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guide de contribution
- [CHANGELOG.md](CHANGELOG.md) - Historique des versions
- [QUICKSTART.md](QUICKSTART.md) - Guide de démarrage rapide

### Documentation modules
- **Query Generator** :
  - [README.md](src/modules/query-generator/README.md) - Vue d'ensemble
  - [COMPONENTS.md](src/modules/query-generator/docs/COMPONENTS.md) - API des composants
  - [USER_GUIDE.md](src/modules/query-generator/docs/USER_GUIDE.md) - Guide utilisateur
  - [UTILS.md](src/modules/query-generator/docs/UTILS.md) - Documentation des utilitaires

## 🧪 Tests

Le projet utilise **Vitest** comme framework de test.

```bash
# Lancer tous les tests
npm test

# Tests avec UI interactive
npm run test:ui

# Tests avec couverture
npm run test:coverage

# Lancer tests une fois (CI)
npm run test:run
```

### Couverture actuelle

- **Query Generator** :
  - UI Components : 93/93 tests ✅ (100%)
  - View Components : 64/91 tests ✅ (70%)

- **Shared Components** : Tests à venir
- **Concordance Analyzer** : Tests à venir

### Outils de test

- **Vitest** : Test runner rapide et moderne
- **React Testing Library** : Tests orientés utilisateur
- **jsdom** : Environnement DOM pour tests

## 🚀 Déploiement

### Options gratuites recommandées

#### 1. Vercel (⭐ Recommandé)
```bash
npm i -g vercel
vercel
```
- ✅ Déploiement automatique depuis GitHub
- ✅ HTTPS automatique
- ✅ CDN global ultra-rapide
- ✅ Preview deployments pour chaque PR
- 🔗 [vercel.com](https://vercel.com)

#### 2. Netlify
- ✅ Interface très intuitive
- ✅ Drag & drop du dossier `dist/`
- ✅ Redirects automatiques pour React Router
- 🔗 [netlify.com](https://netlify.com)

#### 3. Cloudflare Pages
- ✅ Bandwidth illimité
- ✅ CDN Cloudflare ultra-rapide
- ✅ Builds illimités
- 🔗 [pages.cloudflare.com](https://pages.cloudflare.com)

#### 4. GitHub Pages
```bash
npm install --save-dev gh-pages
# Ajouter script: "deploy": "vite build && gh-pages -d dist"
npm run deploy
```
- ✅ Gratuit à vie
- ✅ Intégré à GitHub
- ⚠️ Nécessite configuration pour React Router

### Configuration React Router

Pour Vercel/Netlify, créer `vercel.json` ou `public/_redirects` :

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

## 🤝 Contribution

Les contributions sont bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

### Workflow de contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'feat: Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code

- ✅ Composants fonctionnels React avec hooks
- ✅ Tests unitaires avec Vitest
- ✅ Toutes les chaînes UI traduites (FR/EN)
- ✅ CSS Modules pour les nouveaux composants
- ✅ Documentation JSDoc pour fonctions complexes

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

**CiSaMe** - Circulation des Savoirs médiévaux
Université de Strasbourg

**Développeur principal** : Titouan
**Contact** : [CiSaMe GitLab](https://gitlab.com/cisame)

## 🙏 Remerciements

- NoSketch Engine pour l'infrastructure corpus
- Munich DigitalisierungsZentrum pour les éditions numérisées
- Communauté des médiévistes numériques

## 📖 Références académiques

### Corpus sources

- Gratien, *Decretum* (éditions Munich DigitalisierungsZentrum)
- Collections canoniques médiévales (Edi-XX identifiers)

### Outils utilisés

- **NoSketch Engine** : Plateforme de corpus linguistics
- **TreeTagger** : Lemmatisation du latin médiéval
- **Pyrrha** : Correction manuelle des annotations linguistiques

## 🔗 Liens utiles

- [GitLab CiSaMe](https://gitlab.com/cisame)
- [NoSketch Engine](https://www.sketchengine.eu/)
- [Documentation React](https://react.dev/)
- [Documentation Recharts](https://recharts.org/)
- [Documentation Vitest](https://vitest.dev/)

---

**Version** : 1.3.0
**Dernière mise à jour** : Novembre 2025
**Status** : Production-ready ✅
