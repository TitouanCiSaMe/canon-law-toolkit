# Guide des Tests - CiSaMe Toolkit

## 📚 Vue d'ensemble

Ce projet utilise **Vitest** comme framework de test avec **@testing-library/react** pour tester les composants React.

## 🗂️ Structure des tests

```
src/
├── modules/
│   └── concordance-analyzer/
│       ├── components/
│       │   ├── charts/
│       │   │   └── __tests__/           # Tests des graphiques
│       │   ├── ui/
│       │   │   └── __tests__/           # Tests des composants UI
│       │   └── views/
│       │       └── __tests__/           # Tests des vues
│       ├── hooks/
│       │   └── __tests__/               # Tests des hooks personnalisés
│       └── utils/
│           └── parsers/
│               └── __tests__/           # Tests des parsers
├── shared/
│   ├── hooks/
│   │   └── __tests__/                   # Tests des hooks partagés
│   └── i18n/
│       └── __tests__/                   # Tests i18n
└── test/
    └── setup.js                          # Configuration globale des tests
```

## 🚀 Commandes de test

### Exécuter tous les tests
```bash
npm test
```

### Mode watch (re-exécute automatiquement)
```bash
npm test
# ou
npm run test
```

### Exécuter les tests une seule fois
```bash
npm run test:run
```

### Interface utilisateur des tests
```bash
npm run test:ui
```

### Couverture de code
```bash
npm run test:coverage
```

### Audit i18n
```bash
npm run audit:i18n
```

## ✍️ Écrire des tests

### Test d'un Hook

```javascript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePagination from '../usePagination';

describe('usePagination', () => {
  const testData = Array.from({ length: 125 }, (_, i) => ({ id: i + 1 }));

  it('devrait initialiser avec les valeurs par défaut', () => {
    const { result } = renderHook(() => usePagination(testData));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.itemsPerPage).toBe(50);
    expect(result.current.totalPages).toBe(3);
  });

  it('devrait changer de page', () => {
    const { result } = renderHook(() => usePagination(testData));

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.currentPage).toBe(2);
  });
});
```

### Test d'un Composant

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyButton from '../MyButton';

describe('MyButton', () => {
  it('devrait afficher le label', () => {
    render(<MyButton label="Click me" />);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('devrait appeler onClick quand cliqué', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<MyButton label="Click" onClick={handleClick} />);

    await user.click(screen.getByText('Click'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test avec i18n

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  const renderWithI18n = (component) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  it('devrait afficher le texte traduit', () => {
    renderWithI18n(<MyComponent />);

    expect(screen.getByText('Analyseur de Concordances')).toBeInTheDocument();
  });
});
```

### Test avec Router

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '../Navigation';

describe('Navigation', () => {
  const renderWithRouter = (component, { route = '/' } = {}) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        {component}
      </MemoryRouter>
    );
  };

  it('devrait afficher les liens de navigation', () => {
    renderWithRouter(<Navigation />);

    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Analyseur de concordances')).toBeInTheDocument();
  });
});
```

### Mock d'un module

```javascript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useResponsiveValue from '../useResponsiveValue';
import useBreakpoint from '../useBreakpoint';

// Mock du hook useBreakpoint
vi.mock('../useBreakpoint');

describe('useResponsiveValue', () => {
  it('devrait retourner la valeur pour mobile', () => {
    useBreakpoint.mockReturnValue({
      breakpoint: 'xs',
      isMobile: true,
    });

    const { result } = renderHook(() =>
      useResponsiveValue({ xs: 10, md: 20, lg: 30 })
    );

    expect(result.current).toBe(10);
  });
});
```

## 🧪 Configuration des tests

### vitest.config.js

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@modules': path.resolve(__dirname, './src/modules')
    }
  },
});
```

### src/test/setup.js

Fichier de configuration globale qui :
- Configure @testing-library/jest-dom matchers
- Mock window.matchMedia pour les tests responsive
- Mock IntersectionObserver et ResizeObserver
- Configure localStorage mock
- Nettoie automatiquement après chaque test

## 📊 Couverture de code

### Générer un rapport de couverture

```bash
npm run test:coverage
```

### Rapport HTML

Après avoir exécuté la commande ci-dessus, ouvrez :
```
coverage/index.html
```

### Objectifs de couverture

- **Hooks personnalisés** : > 90%
- **Parsers et utils** : > 85%
- **Composants critiques** : > 75%
- **Composants UI simples** : > 60%

## 🎯 Bonnes pratiques

### ✅ À faire

1. **Tester le comportement, pas l'implémentation**
   ```javascript
   // ✅ BON
   expect(screen.getByRole('button', { name: /sauvegarder/i }))
     .toBeInTheDocument();

   // ❌ MAUVAIS
   expect(wrapper.find('button').prop('className'))
     .toBe('btn-primary');
   ```

2. **Utiliser des requêtes accessibles**
   ```javascript
   // ✅ BON (par ordre de préférence)
   screen.getByRole('button', { name: /submit/i })
   screen.getByLabelText(/email/i)
   screen.getByPlaceholderText(/enter email/i)
   screen.getByText(/welcome/i)

   // ❌ ÉVITER
   screen.getByTestId('submit-button')
   ```

3. **Tester les cas limites**
   ```javascript
   it('devrait gérer les données vides', () => {
     render(<Table data={[]} />);
     expect(screen.getByText(/aucune donnée/i)).toBeInTheDocument();
   });

   it('devrait gérer les erreurs', () => {
     render(<Form onError={() => {}} />);
     // Simuler une erreur
   });
   ```

4. **Nettoyer les mocks**
   ```javascript
   import { describe, it, beforeEach, vi } from 'vitest';

   describe('MyComponent', () => {
     beforeEach(() => {
       vi.clearAllMocks();
     });

     // tests...
   });
   ```

### ❌ À éviter

1. **Ne pas tester les détails d'implémentation**
2. **Ne pas utiliser snapshot testing excessivement**
3. **Ne pas créer des tests qui dépendent de l'ordre d'exécution**
4. **Ne pas oublier de nettoyer les effets de bord**

## 🐛 Debugging des tests

### Afficher le DOM renderisé

```javascript
import { screen } from '@testing-library/react';

it('test', () => {
  render(<MyComponent />);

  // Afficher le DOM complet
  screen.debug();

  // Afficher un élément spécifique
  screen.debug(screen.getByRole('button'));
});
```

### Utiliser l'UI de Vitest

```bash
npm run test:ui
```

Ouvre une interface web interactive pour :
- Voir tous les tests
- Filtrer les tests
- Voir la couverture
- Debugger visuellement

### Logs dans les tests

```javascript
it('test', () => {
  console.log('Debug info:', someValue);
  // Les logs s'affichent dans la console pendant les tests
});
```

## 📈 État actuel des tests

### Statistiques

- **Total de fichiers de test** : 26
- **Hooks testés** : 5/7 (71%)
- **Parsers testés** : 3/3 (100%)
- **Vues testées** : 7/12 (58%)
- **Composants UI testés** : 5/8 (63%)
- **Graphiques testés** : 5/7 (71%)

### Tests existants

#### Hooks
- ✅ useAnalytics
- ✅ useFilteredData
- ✅ useFileUpload
- ✅ usePagination
- ✅ useWordFrequency
- ✅ useBreakpoint (nouveau)
- ✅ useResponsiveValue (nouveau)

#### Parsers
- ✅ concordanceParser
- ✅ metadataParser
- ✅ referenceParser

#### Vues
- ✅ AuthorsView
- ✅ DataView
- ✅ DomainsView
- ✅ LinguisticView
- ✅ OverviewView
- ✅ PlacesView
- ✅ TemporalView

#### Composants UI
- ✅ ExportButtons
- ✅ FilterMenu
- ✅ NavigationPanel
- ✅ Pagination
- ✅ UploadInterface

#### Graphiques
- ✅ AuthorChart
- ✅ CustomTooltipChart
- ✅ DomainChart
- ✅ PlaceChart
- ✅ TemporalChart

#### Autres
- ✅ i18n-keys (validation des traductions)

## 🔄 Intégration CI/CD

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: Run i18n audit
        run: npm run audit:i18n

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 📖 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🆘 Aide

### Erreur : "Cannot find module"

Vérifiez que les alias sont configurés dans `vitest.config.js` :
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@shared': path.resolve(__dirname, './src/shared'),
  }
}
```

### Erreur : "window.matchMedia is not a function"

Le mock est déjà configuré dans `src/test/setup.js`. Si l'erreur persiste, vérifiez que le fichier setup est bien chargé.

### Tests qui "fuient" (affectent d'autres tests)

Utilisez `beforeEach` et `afterEach` pour nettoyer :
```javascript
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});
```
