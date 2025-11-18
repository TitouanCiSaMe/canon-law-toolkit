/**
 * Tests unitaires pour le composant ResultCard
 *
 * Teste :
 * - Le rendu de la carte de résultat
 * - L'affichage de la requête CQL
 * - Les métadonnées et patterns
 * - Les actions (copier, ouvrir NoSketch)
 * - Les variantes de carte
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultCard from '../ResultCard';

// ============================================================================
// MOCKS
// ============================================================================

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'queryGenerator.ui.patterns': 'Patterns pour',
        'queryGenerator.ui.searchNoSketch': 'Chercher sur NoSketch',
        'queryGenerator.ui.copy': 'Copier',
        'queryGenerator.ui.copied': 'Copié !'
      };
      return translations[key] || key;
    }
  })
}));

// Mock de window.open
global.open = jest.fn();

// Mock de navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve())
  }
});

// ============================================================================
// TESTS DE RENDU DE BASE
// ============================================================================

describe('ResultCard - Rendu de base', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rendre une carte de résultat', () => {
    render(
      <ResultCard
        title="Test Query"
        query='[lemma="test"]'
      />
    );

    expect(screen.getByText('Test Query')).toBeInTheDocument();
    expect(screen.getByText('[lemma="test"]')).toBeInTheDocument();
  });

  it('devrait afficher le titre de la carte', () => {
    render(
      <ResultCard
        title="Proximity Query"
        query='[lemma="intentio"] []{0,10} [lemma="Augustinus"]'
      />
    );

    expect(screen.getByText('Proximity Query')).toBeInTheDocument();
  });

  it('devrait afficher la requête CQL', () => {
    const query = '[lemma="intentio"] []{0,10} [lemma="Augustinus"]';

    render(
      <ResultCard
        title="Test"
        query={query}
      />
    );

    expect(screen.getByText(query)).toBeInTheDocument();
  });

  it('devrait afficher les boutons d\'action', () => {
    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
      />
    );

    expect(screen.getByText('Chercher sur NoSketch')).toBeInTheDocument();
    expect(screen.getByText('Copier')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES MÉTADONNÉES
// ============================================================================

describe('ResultCard - Métadonnées', () => {

  it('devrait afficher les métadonnées si fournies', () => {
    const metadata = {
      lemma1: 'intentio',
      lemma2: 'Augustinus',
      distance: 10
    };

    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
        metadata={metadata}
      />
    );

    expect(screen.getByText(/lemma1:/)).toBeInTheDocument();
    expect(screen.getByText(/intentio/)).toBeInTheDocument();
    expect(screen.getByText(/lemma2:/)).toBeInTheDocument();
    expect(screen.getByText(/Augustinus/)).toBeInTheDocument();
    expect(screen.getByText(/distance:/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('ne devrait pas afficher de section métadonnées si vide', () => {
    const { container } = render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
        metadata={{}}
      />
    );

    // Vérifier qu'il n'y a pas de section avec les métadonnées
    expect(screen.queryByText(/lemma1:/)).not.toBeInTheDocument();
  });

  it('ne devrait pas afficher de section métadonnées si non fourni', () => {
    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
      />
    );

    expect(screen.queryByText(/lemma1:/)).not.toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES PATTERNS
// ============================================================================

describe('ResultCard - Patterns', () => {

  it('devrait afficher les patterns si fournis', () => {
    const patterns = ['intentio', 'intencio', 'intentyo'];

    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
        patterns={patterns}
      />
    );

    expect(screen.getByText(/Patterns pour/)).toBeInTheDocument();
    expect(screen.getByText(/intentio, intencio, intentyo/)).toBeInTheDocument();
  });

  it('devrait limiter l\'affichage à 8 patterns', () => {
    const patterns = Array.from({ length: 12 }, (_, i) => `pattern${i}`);

    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
        patterns={patterns}
      />
    );

    expect(screen.getByText(/pattern0/)).toBeInTheDocument();
    expect(screen.getByText(/pattern7/)).toBeInTheDocument();
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
    expect(screen.queryByText(/pattern11/)).not.toBeInTheDocument();
  });

  it('ne devrait pas afficher de section patterns si vide', () => {
    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
        patterns={[]}
      />
    );

    expect(screen.queryByText(/Patterns pour/)).not.toBeInTheDocument();
  });

  it('ne devrait pas afficher de section patterns si non fourni', () => {
    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
      />
    );

    expect(screen.queryByText(/Patterns pour/)).not.toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES VARIANTES
// ============================================================================

describe('ResultCard - Variantes', () => {

  it('devrait rendre avec la variante default', () => {
    const { container } = render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
        variant="default"
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre avec la variante medieval', () => {
    const { container } = render(
      <ResultCard
        title="Medieval Query"
        query='[lemma="test"]'
        variant="medieval"
      />
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Medieval Query')).toBeInTheDocument();
  });

  it('devrait utiliser la variante default par défaut', () => {
    const { container } = render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES INTERACTIONS
// ============================================================================

describe('ResultCard - Interactions', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait copier la requête dans le presse-papier', async () => {
    const query = '[lemma="intentio"]';

    render(
      <ResultCard
        title="Test"
        query={query}
      />
    );

    const copyButton = screen.getByText('Copier');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(query);
    });
  });

  it('devrait afficher "Copié !" après la copie', async () => {
    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
      />
    );

    const copyButton = screen.getByText('Copier');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Copié !')).toBeInTheDocument();
    });
  });

  it('devrait revenir à "Copier" après 2 secondes', async () => {
    jest.useFakeTimers();

    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
      />
    );

    const copyButton = screen.getByText('Copier');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Copié !')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText('Copier')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('devrait ouvrir NoSketch dans un nouvel onglet', () => {
    const query = '[lemma="intentio"]';

    render(
      <ResultCard
        title="Test"
        query={query}
      />
    );

    const openButton = screen.getByText('Chercher sur NoSketch');
    fireEvent.click(openButton);

    expect(global.open).toHaveBeenCalledTimes(1);
    expect(global.open).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(query)),
      '_blank'
    );
  });

  it('devrait générer l\'URL NoSketch correcte', () => {
    const query = '[lemma="intentio"] []{0,10} [lemma="Augustinus"]';

    render(
      <ResultCard
        title="Test"
        query={query}
      />
    );

    const openButton = screen.getByText('Chercher sur NoSketch');
    fireEvent.click(openButton);

    expect(global.open).toHaveBeenCalledWith(
      expect.stringContaining('fip-185-155-93-80.iaas.unistra.fr'),
      '_blank'
    );
  });

  it('devrait gérer les erreurs de copie', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    navigator.clipboard.writeText = jest.fn(() => Promise.reject(new Error('Copy failed')));

    render(
      <ResultCard
        title="Test"
        query='[lemma="test"]'
      />
    );

    const copyButton = screen.getByText('Copier');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});

// ============================================================================
// TESTS DES CAS LIMITES
// ============================================================================

describe('ResultCard - Cas limites', () => {

  it('devrait gérer une requête vide', () => {
    expect(() => {
      render(
        <ResultCard
          title="Empty Query"
          query=""
        />
      );
    }).not.toThrow();
  });

  it('devrait gérer une requête très longue', () => {
    const longQuery = '[lemma="test"] | '.repeat(100);

    render(
      <ResultCard
        title="Long Query"
        query={longQuery}
      />
    );

    expect(screen.getByText(/\[lemma="test"\]/)).toBeInTheDocument();
  });

  it('devrait gérer des caractères spéciaux dans la requête', () => {
    const query = '[lemma="test|test2"] & [word="a+b*c?"]';

    render(
      <ResultCard
        title="Special Characters"
        query={query}
      />
    );

    expect(screen.getByText(query)).toBeInTheDocument();
  });

  it('devrait gérer un titre très long', () => {
    const longTitle = 'Very Long Title '.repeat(20);

    render(
      <ResultCard
        title={longTitle}
        query='[lemma="test"]'
      />
    );

    expect(screen.getByText(/Very Long Title/)).toBeInTheDocument();
  });

  it('devrait rendre avec toutes les props optionnelles', () => {
    const metadata = { test: 'value' };
    const patterns = ['p1', 'p2'];

    expect(() => {
      render(
        <ResultCard
          title="Complete"
          query='[lemma="test"]'
          metadata={metadata}
          patterns={patterns}
          variant="medieval"
        />
      );
    }).not.toThrow();
  });
});

// ============================================================================
// TESTS D'INTÉGRATION
// ============================================================================

describe('ResultCard - Intégration', () => {

  it('devrait afficher une carte complète avec toutes les sections', () => {
    const metadata = {
      lemma1: 'intentio',
      lemma2: 'Augustinus',
      distance: 10
    };
    const patterns = ['intentio', 'intencio', 'intentyo'];

    render(
      <ResultCard
        title="Complete Query"
        query='[lemma="intentio"] []{0,10} [lemma="Augustinus"]'
        metadata={metadata}
        patterns={patterns}
        variant="default"
      />
    );

    // Vérifier toutes les sections
    expect(screen.getByText('Complete Query')).toBeInTheDocument();
    expect(screen.getByText('[lemma="intentio"] []{0,10} [lemma="Augustinus"]')).toBeInTheDocument();
    expect(screen.getByText(/lemma1:/)).toBeInTheDocument();
    expect(screen.getByText(/Patterns pour/)).toBeInTheDocument();
    expect(screen.getByText('Chercher sur NoSketch')).toBeInTheDocument();
    expect(screen.getByText('Copier')).toBeInTheDocument();
  });

  it('devrait supporter plusieurs ResultCard simultanément', () => {
    render(
      <div>
        <ResultCard
          title="Query 1"
          query='[lemma="test1"]'
        />
        <ResultCard
          title="Query 2"
          query='[lemma="test2"]'
        />
      </div>
    );

    expect(screen.getByText('Query 1')).toBeInTheDocument();
    expect(screen.getByText('Query 2')).toBeInTheDocument();
    expect(screen.getByText('[lemma="test1"]')).toBeInTheDocument();
    expect(screen.getByText('[lemma="test2"]')).toBeInTheDocument();
  });
});
