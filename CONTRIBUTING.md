# Guide de contribution - CALKIT

Merci de votre intérêt pour contribuer au Canon Law Analysis Toolkit ! Ce document fournit les guidelines pour contribuer au projet.

## 🎯 Code de conduite

En participant à ce projet, vous acceptez de maintenir un environnement respectueux et inclusif. Nous attendons :

- Communication respectueuse et constructive
- Respect des opinions et expériences diverses
- Acceptation des critiques constructives
- Focus sur ce qui est meilleur pour la communauté

## 🚀 Comment contribuer

### Types de contributions

Nous accueillons plusieurs types de contributions :

- 🐛 **Bug fixes** : Correction d'erreurs et dysfonctionnements
- ✨ **Features** : Nouvelles fonctionnalités
- 📚 **Documentation** : Améliorations de la documentation
- 🎨 **UI/UX** : Améliorations de l'interface utilisateur
- ⚡ **Performance** : Optimisations
- 🧪 **Tests** : Ajout ou amélioration de tests
- 🌐 **i18n** : Traductions

### Avant de commencer

1. **Vérifier les issues existantes** : Recherchez si quelqu'un travaille déjà sur le même sujet
2. **Créer une issue** : Pour les features majeures, discutez-en d'abord via une issue
3. **Fork le projet** : Créez votre propre copie du repository

## 🔧 Configuration de l'environnement

### Installation

```bash
# Cloner votre fork
git clone git@gitlab.com:votre-username/canon-law-toolkit.git
cd canon-law-toolkit

# Ajouter le remote upstream
git remote add upstream git@gitlab.com:cisame/canon-law-toolkit.git

# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
```

### Outils recommandés

- **IDE** : VSCode avec extensions React, ESLint
- **Node.js** : Version 18+ (utiliser nvm recommandé)
- **Git** : Version 2.30+
- **Navigateur** : Chrome/Firefox avec DevTools

## 📝 Standards de code

### Style JavaScript/React

Nous suivons les conventions React modernes :

```javascript
// ✅ Bon : Composant fonctionnel avec hooks
import React, { useState, useMemo } from 'react';

const MyComponent = ({ data, onUpdate }) => {
  const [filter, setFilter] = useState('');
  
  const filteredData = useMemo(() => 
    data.filter(item => item.name.includes(filter)),
    [data, filter]
  );

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filteredData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
};

export default MyComponent;
```

### Règles générales

- ✅ Utiliser des **composants fonctionnels** avec hooks
- ✅ Privilégier **useMemo/useCallback** pour optimisations
- ✅ Extraire la logique complexe dans des **custom hooks**
- ✅ Utiliser **PropTypes** ou TypeScript pour typage (futur)
- ❌ Éviter les classes React
- ❌ Éviter les mutations directes de state
- ❌ Éviter les any/unknown types

### Naming conventions

```javascript
// Components : PascalCase
const NavigationPanel = () => { };

// Hooks : camelCase avec préfixe "use"
const useFilteredData = () => { };

// Utils : camelCase
const parseMetadata = () => { };

// Constants : UPPER_SNAKE_CASE
const MAX_ITEMS_PER_PAGE = 50;

// CSS classes : kebab-case
<div className="panel-header" />
```

### Structure des fichiers

```javascript
/**
 * Nom du composant - Description courte
 * 
 * Description détaillée du composant et de ses responsabilités.
 * 
 * @component
 * @param {Object} props - Props du composant
 * @param {Array} props.data - Données à afficher
 * @param {Function} props.onUpdate - Callback de mise à jour
 * 
 * @returns {JSX.Element} Description du rendu
 * 
 * @example
 * <MyComponent data={items} onUpdate={handleUpdate} />
 */

// Imports
import React from 'react';
import { useTranslation } from 'react-i18next';

// Composant
const MyComponent = ({ data, onUpdate }) => {
  // Hooks
  const { t } = useTranslation();
  
  // État local
  const [state, setState] = useState(null);
  
  // Calculs dérivés
  const computed = useMemo(() => { }, []);
  
  // Handlers
  const handleClick = () => { };
  
  // Render
  return <div />;
};

// Export
export default MyComponent;
```

## 🎨 Guidelines UI/UX

### Cohérence visuelle

- Utiliser les couleurs du **visualTheme.js**
- Respecter l'espacement standard (rem units)
- Maintenir le style académique sobre

### Accessibilité

```javascript
// ✅ Bon
<button 
  onClick={handleClick}
  aria-label="Fermer le panel"
  role="button"
>
  ❌
</button>

// ❌ Mauvais
<div onClick={handleClick}>❌</div>
```

### Responsive design

- Tester sur différentes tailles d'écran
- Utiliser des unités flexibles (rem, %, vw/vh)
- Media queries si nécessaire

## 🌐 Internationalisation

### Ajouter une traduction

```javascript
// 1. Ajouter dans src/shared/i18n/fr.json
{
  "concordance": {
    "myNewFeature": {
      "title": "Titre en français",
      "description": "Description en français"
    }
  }
}

// 2. Ajouter dans src/shared/i18n/en.json
{
  "concordance": {
    "myNewFeature": {
      "title": "Title in English",
      "description": "Description in English"
    }
  }
}

// 3. Utiliser dans le composant
const { t } = useTranslation();
<h1>{t('concordance.myNewFeature.title')}</h1>
```

### Règles i18n

- ✅ Toutes les chaînes UI doivent être traduites
- ✅ Utiliser des clés descriptives (pas de traduction inline)
- ✅ Tester dans les 2 langues (FR/EN)
- ❌ Pas de texte en dur dans les composants

## 📚 Documentation

### JSDoc pour fonctions/composants

```javascript
/**
 * Parse un fichier CSV de métadonnées
 * 
 * Extrait les métadonnées depuis un fichier CSV formaté selon
 * le schéma Edi-XX et crée un index pour le matching.
 * 
 * @param {File} file - Fichier CSV à parser
 * @param {Function} callback - Callback appelé avec les données parsées
 * @returns {Promise<void>}
 * 
 * @throws {Error} Si le fichier est invalide ou corrompu
 * 
 * @example
 * await parseMetadata(file, (data) => {
 *   console.log(`${data.length} entrées chargées`);
 * });
 */
export const parseMetadata = async (file, callback) => {
  // Implementation
};
```

### README pour nouveaux modules

Chaque nouveau module/feature doit inclure :

- **Purpose** : Objectif du module
- **Usage** : Comment l'utiliser
- **API** : Props, params, returns
- **Examples** : Exemples d'utilisation

## 🧪 Tests

### Framework de test

Le projet utilise **Vitest** comme test runner (pas Jest).

```bash
# Lancer les tests
npm test

# Tests avec UI interactive
npm run test:ui

# Tests avec couverture
npm run test:coverage
```

### Structure des tests

```javascript
// MyComponent.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render with data', () => {
    const data = [{ id: 1, name: 'Test' }];
    render(<MyComponent data={data} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should call onUpdate when clicked', () => {
    const handleUpdate = vi.fn();
    render(<MyComponent data={[]} onUpdate={handleUpdate} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleUpdate).toHaveBeenCalledTimes(1);
  });
});
```

### Mocking avec Vitest

```javascript
import { vi } from 'vitest';

// Mock d'un module
vi.mock('../utils/myUtil', () => ({
  myFunction: vi.fn(() => 'mocked value')
}));

// Mock d'une fonction
const mockCallback = vi.fn();

// Vérifier les appels
expect(mockCallback).toHaveBeenCalledWith('arg');
expect(mockCallback).toHaveBeenCalledTimes(2);

// Reset mocks
vi.clearAllMocks();
```

### Coverage attendu

- **Unit tests** : Parsers, utils → 80%+
- **Integration tests** : Hooks, composants → 70%+
- **E2E tests** : Flux critiques → 50%+

## 🔀 Workflow Git

### Branches

```bash
# Feature
git checkout -b feature/add-new-chart

# Bug fix
git checkout -b fix/export-csv-encoding

# Documentation
git checkout -b docs/update-readme

# Refactoring
git checkout -b refactor/optimize-analytics
```

### Commits

Nous suivons [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Format
<type>(<scope>): <description>

# Types
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
docs:     # Documentation
style:    # Formatting, missing semi colons, etc
refactor: # Refactoring de code
perf:     # Amélioration de performance
test:     # Ajout de tests
chore:    # Maintenance, dependencies, etc

# Examples
feat(concordance): add radar chart visualization
fix(parser): handle empty CSV cells correctly
docs(readme): add installation instructions
refactor(hooks): extract common filter logic
perf(analytics): memoize expensive calculations
test(parser): add edge cases for date parsing
```

### Pull Requests

#### Checklist avant PR

- [ ] Code testé localement
- [ ] Tests unitaires passent (`npm test`)
- [ ] Lint passe (`npm run lint`)
- [ ] Build de production réussit (`npm run build`)
- [ ] Documentation mise à jour
- [ ] Traductions complètes (FR/EN)
- [ ] Captures d'écran si UI change

#### Template de PR

```markdown
## Description
Brève description du changement

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle feature
- [ ] Breaking change
- [ ] Documentation

## Motivation et contexte
Pourquoi ce changement est nécessaire ?

## Comment a été testé ?
Décrire les tests effectués

## Captures d'écran (si applicable)
[Images]

## Checklist
- [ ] Mon code suit les conventions du projet
- [ ] J'ai commenté le code complexe
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai ajouté des tests
- [ ] Tous les tests passent
```

## 🐛 Rapport de bugs

### Template d'issue

```markdown
## Description du bug
Description claire et concise du bug

## Pour reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Scroll vers '...'
4. Voir l'erreur

## Comportement attendu
Ce qui devrait se passer

## Comportement actuel
Ce qui se passe réellement

## Captures d'écran
[Si applicable]

## Environnement
- OS: [e.g. Windows 10]
- Navigateur: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

## Contexte additionnel
Toute autre information pertinente
```

## ✨ Proposition de feature

### Template d'issue

```markdown
## Feature proposée
Description claire de la feature

## Problème résolu
Quel problème cette feature résout-elle ?

## Solution proposée
Comment devrait fonctionner la feature ?

## Alternatives considérées
Y a-t-il d'autres approches possibles ?

## Contexte additionnel
Mockups, exemples, références
```

## 🎓 Ressources

### Documentation externe

- [React Documentation](https://react.dev/)
- [Recharts Documentation](https://recharts.org/)
- [D3.js Documentation](https://d3js.org/)
- [react-i18next Documentation](https://react.i18next.com/)

### Conventions de code

- [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

### Outils de dev

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## 📞 Contact

### Obtenir de l'aide

- **Issues** : Pour bugs et features requests
- **Discussions** : Pour questions générales
- **Email** : Pour communication privée

### Équipe core

- **Titouan** - Lead Developer - CISAME
- Pour rejoindre l'équipe core, contribuez régulièrement pendant 3+ mois

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet possible !

### Hall of Fame

*Liste des contributeurs majeurs sera ajoutée ici*

---

**En contribuant, vous acceptez que vos contributions soient sous licence MIT.**

**Dernière mise à jour** : Novembre 2025
