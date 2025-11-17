# CALKIT - Canon Law Analysis Toolkit

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://gitlab.com/cisame/canon-law-toolkit)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-19.0.0-61dafb.svg)](https://react.dev/)
[![i18n](https://img.shields.io/badge/i18n-FR%20%7C%20EN-orange.svg)](src/shared/i18n)

Plateforme d'outils numériques pour l'analyse du droit canon médiéval, développée par CiSaMe (Circulation des Savoirs médiévaux).

## 🎯 Présentation

CALKIT est une suite d'outils web destinée aux chercheurs en histoire du droit médiéval. Le projet se compose de plusieurs modules spécialisés pour l'analyse lexicométrique et structurelle de corpus juridiques latins.

### Modules disponibles

- **🏠 Home** : Page d'accueil et navigation
- **🔍 Query Generator** : Générateur de requêtes CQL pour NoSketch Engine
- **📊 Concordance Analyzer** : Analyse approfondie de concordances avec enrichissement métadonnées

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

## 📊 Fonctionnalités principales

### Analyse lexicométrique

- **Enrichissement automatique** : Matching des références avec métadonnées Edi-XX
- **Parsing intelligent** : Détection de structure complexe (pipe-separated multiple works)
- **Fallback robuste** : Conservation des données même sans match parfait
- **Taux de correspondance** : Calcul et affichage du taux d'enrichissement

### Visualisations

- **Bar charts** : Domaines juridiques, auteurs, lieux
- **Temporal charts** : Évolution chronologique avec granularités variables (années, décennies, quarts/demi-siècles)
- **Timeline Gantt** : Visualisation des plages temporelles des œuvres
- **Nuage de mots** : Termes KWIC les plus fréquents
- **Charts comparatifs** : Analyse parallèle de 2 corpus

### Interface utilisateur

- **Grille interactive** : Navigation par panels cliquables
- **Filtres en temps réel** : Mise à jour instantanée des visualisations
- **Pagination** : Gestion efficace de gros volumes de données
- **Export flexible** : CSV, JSON, PNG selon les besoins
- **Multilingue** : Interface complète en français et anglais

## 🏗️ Architecture technique

### Stack technologique

- **Frontend** : React 19, Vite 6
- **Routing** : React Router DOM v7
- **Visualisations** : Recharts (charts), D3.js (timeline)
- **i18n** : react-i18next
- **Styling** : CSS-in-JS (inline styles)
- **Build** : Vite avec optimisations production

### Structure modulaire

```
src/
├── modules/
│   └── concordance-analyzer/     # Module principal
│       ├── components/           # Composants UI
│       ├── hooks/                # Logic réutilisable
│       ├── utils/                # Parsers & exports
│       └── config/               # Configuration
└── shared/
    ├── i18n/                     # Traductions
    ├── theme/                    # Thème visuel
    └── components/               # Layout global
```

### Performance

- **Lazy loading** : Chargement différé des composants lourds
- **Memoization** : Optimisation des recalculs (useMemo)
- **Pagination** : Gestion efficace des grandes listes
- **Debouncing** : Optimisation des filtres en temps réel

## 📚 Documentation détaillée

- [ARCHITECTURE.md](ARCHITECTURE.md) - Documentation technique complète
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guide de contribution
- [CHANGELOG.md](CHANGELOG.md) - Historique des versions

## 🧪 Tests

```bash
# Tests unitaires (à venir)
npm test

# Tests de couverture
npm run test:coverage

# Lint du code
npm run lint
```

## 🤝 Contribution

Les contributions sont bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

### Workflow de contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'feat: Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

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

---

**Version** : 1.0.0  
**Dernière mise à jour** : Novembre 2025  
**Status** : Production-ready ✅
