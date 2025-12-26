# Bonnes Pratiques de Développement - CiSaMe Toolkit

Guide des outils et conventions pour maintenir la qualité du code.

## Table des matières

1. [ESLint & Prettier](#eslint--prettier)
2. [Système de Logging](#système-de-logging)
3. [Gestion des Erreurs](#gestion-des-erreurs)
4. [Tests](#tests)

---

## ESLint & Prettier

### Installation

```bash
npm install
```

Les dépendances sont déjà dans `package.json` :
- `eslint` - Linting du code
- `eslint-plugin-react` - Règles React
- `eslint-plugin-react-hooks` - Règles Hooks
- `prettier` - Formatage du code

### Commandes

```bash
# Vérifier le code (erreurs et warnings)
npm run lint

# Corriger automatiquement les erreurs
npm run lint:fix

# Vérifier le formatage
npm run format:check

# Formater tout le code
npm run format
```

### Règles importantes

| Règle | Niveau | Description |
|-------|--------|-------------|
| `no-console` | ⚠️ warn | Utiliser `logger` au lieu de `console.log` |
| `no-debugger` | ❌ error | Pas de debugger en production |
| `react-hooks/rules-of-hooks` | ❌ error | Règles des Hooks obligatoires |
| `react-hooks/exhaustive-deps` | ⚠️ warn | Dépendances useEffect complètes |
| `no-unused-vars` | ⚠️ warn | Variables préfixées par `_` ignorées |

### Configuration VS Code (recommandée)

Ajouter dans `.vscode/settings.json` :

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Système de Logging

### Pourquoi utiliser `logger` ?

- ✅ Logs désactivés automatiquement en production
- ✅ Formatage cohérent avec timestamps
- ✅ Niveaux de log configurables
- ✅ Mesure de performance intégrée

### Import

```javascript
import { logger } from '@shared/utils/logger';
```

### Niveaux disponibles

```javascript
// DEBUG - Développement uniquement
logger.debug('Données chargées', { count: 42 });

// INFO - Développement uniquement
logger.info('✓ Upload terminé');

// WARN - Toujours affiché (même en prod)
logger.warn('Fichier volumineux (>10MB)');

// ERROR - Toujours affiché (même en prod)
logger.error('Échec du parsing', error);
```

### Fonctionnalités avancées

```javascript
// Grouper des logs
logger.group('Parsing CSV', () => {
  logger.debug('Lecture du fichier...');
  logger.debug('Validation des colonnes...');
  logger.info('342 lignes parsées');
});

// Mesurer le temps d'exécution
const timer = logger.time('Calcul analytics');
// ... opération longue
timer.end(); // Affiche: "[CiSaMe] [TIME] Calcul analytics: 234.56ms"
```

### Configuration du niveau

```javascript
import { setLogLevel, LOG_LEVELS } from '@shared/utils/logger';

// En production (par défaut)
setLogLevel(LOG_LEVELS.WARN); // Seuls warn et error

// Pour déboguer temporairement
setLogLevel(LOG_LEVELS.DEBUG); // Tous les logs
```

### Migration depuis console.log

```javascript
// ❌ Avant
console.log('Données:', data);
console.warn('Attention:', warning);
console.error('Erreur:', error);

// ✅ Après
logger.debug('Données:', data);
logger.warn('Attention:', warning);
logger.error('Erreur:', error);
```

---

## Gestion des Erreurs

### ErrorBoundary

Composant React qui capture les erreurs et empêche le crash de l'application.

### Import

```javascript
import { ErrorBoundary } from '@shared/components';
```

### Utilisation basique

```jsx
// Protéger une section à risque
<ErrorBoundary>
  <ChartComponent data={data} />
</ErrorBoundary>
```

### Avec fallback personnalisé

```jsx
<ErrorBoundary fallback={<p>Erreur de chargement du graphique</p>}>
  <ComplexChart />
</ErrorBoundary>
```

### Avec callback d'erreur

```jsx
<ErrorBoundary
  onError={(error, info) => {
    logger.error('Crash composant:', error);
    // Envoyer à un service de monitoring
  }}
>
  <DataView />
</ErrorBoundary>
```

### Afficher les détails (développement)

```jsx
<ErrorBoundary showDetails>
  <ComponentEnDev />
</ErrorBoundary>
```

### Bonnes pratiques

1. **Placer aux limites logiques** - Un ErrorBoundary par section majeure
2. **Pas trop granulaire** - Éviter d'en mettre autour de chaque composant
3. **Messages utiles** - Utiliser des fallbacks personnalisés pour guider l'utilisateur

```jsx
// ✅ Bon : Par section
<Layout>
  <ErrorBoundary>
    <Header />
  </ErrorBoundary>

  <ErrorBoundary>
    <MainContent />
  </ErrorBoundary>

  <ErrorBoundary>
    <Charts />
  </ErrorBoundary>
</Layout>
```

---

## Tests

### Lancer les tests

```bash
# Mode watch (développement)
npm test

# Interface UI interactive
npm run test:ui

# Une seule exécution (CI)
npm run test:run

# Avec couverture
npm run test:coverage
```

### Structure des tests

```
src/
└── module/
    └── component/
        ├── MyComponent.jsx
        └── __tests__/
            └── MyComponent.test.jsx
```

### Exemple de test

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('devrait afficher le titre', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('devrait appeler onClick au clic', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Tester le logger

```javascript
import { vi, beforeEach, afterEach } from 'vitest';
import { logger, setLogLevel, LOG_LEVELS } from '@shared/utils/logger';

describe('Mon composant avec logs', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    setLogLevel(LOG_LEVELS.DEBUG);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devrait logger le chargement', () => {
    // ... test
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

### Tester les ErrorBoundary

```javascript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@shared/components';

// Composant qui crash
const CrashComponent = () => {
  throw new Error('Test crash');
};

it('devrait afficher le fallback en cas d\'erreur', () => {
  // Supprimer les erreurs console de React
  vi.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <CrashComponent />
    </ErrorBoundary>
  );

  expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
});
```

---

## Checklist avant commit

- [ ] `npm run lint` passe sans erreurs
- [ ] `npm run format:check` passe
- [ ] `npm run test:run` passe
- [ ] Pas de `console.log` (utiliser `logger`)
- [ ] ErrorBoundary autour des sections critiques
- [ ] Tests ajoutés pour les nouvelles fonctionnalités

---

## Ressources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest](https://vitest.dev/)
