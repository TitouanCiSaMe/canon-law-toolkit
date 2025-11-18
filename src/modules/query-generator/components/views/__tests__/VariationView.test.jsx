/**
 * Tests unitaires pour VariationView
 *
 * Teste :
 * - Le rendu initial avec valeurs par défaut
 * - Les changements de formulaire
 * - La soumission et génération des 4 types de requêtes
 * - La gestion des erreurs
 * - L'affichage des résultats multiples
 */

// Mock du module variationGenerators AVANT tout import
const mockGenerateAllVariationQueries = jest.fn();
jest.mock('../../../utils/variationGenerators', () => ({
  mockGenerateAllVariationQueries: mockGenerateAllVariationQueries
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariationView from '../VariationView';

// ============================================================================
// MOCKS
// ============================================================================

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'queryGenerator.variation.title': 'Variations orthographiques',
        'queryGenerator.variation.description': 'Générez des requêtes pour trouver des variantes orthographiques avec support pour le latin médiéval.',
        'queryGenerator.variation.formTitle': 'Recherche de variations',
        'queryGenerator.variation.word': 'Mot à rechercher',
        'queryGenerator.variation.desinenceType': 'Type de désinence',
        'queryGenerator.variation.withSuffix': 'Avec désinences',
        'queryGenerator.variation.exactForm': 'Forme exacte',
        'queryGenerator.variation.placeholders.word': 'ex: intentio',
        'queryGenerator.variation.simpleQuery': 'Requête simple',
        'queryGenerator.variation.mediumQuery': 'Requête moyenne',
        'queryGenerator.variation.complexQuery': 'Requête complexe',
        'queryGenerator.variation.medievalQuery': 'Requête médiévale',
        'queryGenerator.variation.medievalHelp': 'Inclut substitutions ae/e, v/u, j/i, ti/ci, etc.',
        'queryGenerator.ui.generate': 'Générer la requête',
        'common.error': 'Erreur'
      };
      return translations[key] || key;
    }
  })
}));

// ============================================================================
// TESTS DE RENDU INITIAL
// ============================================================================

describe('VariationView - Rendu initial', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rendre le composant sans erreur', () => {
    render(<VariationView />);

    expect(screen.getByText('Variations orthographiques')).toBeInTheDocument();
    expect(screen.getByText('Générez des requêtes pour trouver des variantes orthographiques avec support pour le latin médiéval.')).toBeInTheDocument();
  });

  it('devrait afficher le titre et la description', () => {
    render(<VariationView />);

    expect(screen.getByText('Variations orthographiques')).toBeInTheDocument();
    expect(screen.getByText('Recherche de variations')).toBeInTheDocument();
  });

  it('devrait afficher le champ de mot', () => {
    render(<VariationView />);

    expect(screen.getByText('Mot à rechercher')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ex: intentio')).toBeInTheDocument();
  });

  it('devrait afficher les options de désinence', () => {
    render(<VariationView />);

    expect(screen.getByText('Type de désinence')).toBeInTheDocument();
    expect(screen.getByText('Avec désinences')).toBeInTheDocument();
    expect(screen.getByText('Forme exacte')).toBeInTheDocument();
  });

  it('devrait avoir la valeur par défaut "intentio"', () => {
    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    expect(wordInput).toHaveValue('intentio');
  });

  it('devrait avoir "Avec désinences" coché par défaut', () => {
    render(<VariationView />);

    const radios = screen.getAllByRole('radio');
    // Le premier radio devrait être "Avec désinences" (true)
    expect(radios[0]).toBeChecked();
  });

  it('devrait afficher le bouton de génération', () => {
    render(<VariationView />);

    expect(screen.getByText('Générer la requête')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES INTERACTIONS FORMULAIRE
// ============================================================================

describe('VariationView - Interactions formulaire', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait permettre de changer le mot', () => {
    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: 'ratio' } });

    expect(wordInput).toHaveValue('ratio');
  });

  it('devrait permettre de changer le type de désinence', () => {
    render(<VariationView />);

    const radios = screen.getAllByRole('radio');
    const exactFormRadio = radios[1]; // "Forme exacte"

    fireEvent.click(exactFormRadio);

    expect(exactFormRadio).toBeChecked();
    expect(radios[0]).not.toBeChecked();
  });

  it('devrait permettre de basculer entre les types', () => {
    render(<VariationView />);

    const radios = screen.getAllByRole('radio');

    // Initialement "Avec désinences" est coché
    expect(radios[0]).toBeChecked();

    // Passer à "Forme exacte"
    fireEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();
    expect(radios[0]).not.toBeChecked();

    // Revenir à "Avec désinences"
    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });
});

// ============================================================================
// TESTS DE SOUMISSION
// ============================================================================

describe('VariationView - Soumission du formulaire', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait appeler mockGenerateAllVariationQueries à la soumission', () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'intentio',
      requete1: '[word="intentio|int[A-z]?ntio"]',
      requete2: '[word="intentio|[A-z]*ntio"]',
      requete3: '[word="intentio|[A-z]*[A-z]*tio"]',
      requete_medievale: '[word="intentio|intencio"]',
      patterns: {
        simple: ['intentio', 'int[A-z]?ntio'],
        medium: ['intentio', '[A-z]*ntio'],
        complex: ['intentio', '[A-z]*[A-z]*tio'],
        medieval: ['intentio', 'intencio']
      }
    });

    render(<VariationView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(mockGenerateAllVariationQueries).toHaveBeenCalledWith(
      'intentio',
      true
    );
  });

  it('devrait afficher les 4 types de requêtes après soumission réussie', async () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'intentio',
      requete1: '[word="simple"]',
      requete2: '[word="medium"]',
      requete3: '[word="complex"]',
      requete_medievale: '[word="medieval"]',
      patterns: {
        simple: ['intentio'],
        medium: ['intentio'],
        complex: ['intentio'],
        medieval: ['intentio']
      }
    });

    render(<VariationView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Requête simple')).toBeInTheDocument();
      expect(screen.getByText('Requête moyenne')).toBeInTheDocument();
      expect(screen.getByText('Requête complexe')).toBeInTheDocument();
      expect(screen.getByText('Requête médiévale')).toBeInTheDocument();
    });
  });

  it('devrait afficher une erreur si la génération échoue', async () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      error: 'Le mot doit être renseigné'
    });

    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: '' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Le mot doit être renseigné')).toBeInTheDocument();
    });
  });

  it('devrait appeler avec withSuffix=false pour forme exacte', () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'ratio',
      requete1: '[word="ratio"]',
      requete2: '[word="ratio"]',
      requete3: '[word="ratio"]',
      requete_medievale: '[word="ratio|raatio"]',
      patterns: { simple: ['ratio'], medium: ['ratio'], complex: ['ratio'], medieval: ['ratio'] }
    });

    render(<VariationView />);

    // Sélectionner "Forme exacte"
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(mockGenerateAllVariationQueries).toHaveBeenCalledWith(
      'intentio',
      false
    );
  });

  it('devrait appeler avec le mot modifié', () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'ratio',
      requete1: '[word="ratio"]',
      requete2: '[word="ratio"]',
      requete3: '[word="ratio"]',
      requete_medievale: '[word="ratio"]',
      patterns: { simple: [], medium: [], complex: [], medieval: [] }
    });

    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: 'ratio' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(mockGenerateAllVariationQueries).toHaveBeenCalledWith(
      'ratio',
      true
    );
  });
});

// ============================================================================
// TESTS D'AFFICHAGE DES RÉSULTATS
// ============================================================================

describe('VariationView - Affichage des résultats', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait afficher les 4 ResultCard avec les bonnes requêtes', async () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'test',
      requete1: '[word="query1"]',
      requete2: '[word="query2"]',
      requete3: '[word="query3"]',
      requete_medievale: '[word="query4"]',
      patterns: { simple: [], medium: [], complex: [], medieval: [] }
    });

    render(<VariationView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('[word="query1"]')).toBeInTheDocument();
      expect(screen.getByText('[word="query2"]')).toBeInTheDocument();
      expect(screen.getByText('[word="query3"]')).toBeInTheDocument();
      expect(screen.getByText('[word="query4"]')).toBeInTheDocument();
    });
  });

  it('ne devrait pas afficher de résultat avant soumission', () => {
    render(<VariationView />);

    expect(screen.queryByText('Requête simple')).not.toBeInTheDocument();
    expect(screen.queryByText('Requête moyenne')).not.toBeInTheDocument();
    expect(screen.queryByText('Requête complexe')).not.toBeInTheDocument();
    expect(screen.queryByText('Requête médiévale')).not.toBeInTheDocument();
  });

  it('devrait cacher les résultats en cas d\'erreur', async () => {
    // D'abord un succès
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'test',
      requete1: '[word="test1"]',
      requete2: '[word="test2"]',
      requete3: '[word="test3"]',
      requete_medievale: '[word="test4"]',
      patterns: { simple: [], medium: [], complex: [], medieval: [] }
    });

    const { rerender } = render(<VariationView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('[word="test1"]')).toBeInTheDocument();
    });

    // Ensuite une erreur
    mockGenerateAllVariationQueries.mockReturnValue({
      error: 'Erreur de test'
    });

    rerender(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: '' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('[word="test1"]')).not.toBeInTheDocument();
      expect(screen.getByText('Erreur de test')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS DE CAS LIMITES
// ============================================================================

describe('VariationView - Cas limites', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait gérer un mot vide', () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      error: 'Le mot doit être renseigné'
    });

    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: '' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(mockGenerateAllVariationQueries).toHaveBeenCalledWith(
      '',
      true
    );
  });

  it('devrait gérer les espaces dans le mot', () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'test',
      requete1: '[word="test"]',
      requete2: '[word="test"]',
      requete3: '[word="test"]',
      requete_medievale: '[word="test"]',
      patterns: { simple: [], medium: [], complex: [], medieval: [] }
    });

    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: '  test  ' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(mockGenerateAllVariationQueries).toHaveBeenCalled();
  });

  it('devrait gérer plusieurs soumissions successives', async () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'test1',
      requete1: '[word="test1"]',
      requete2: '[word="test1"]',
      requete3: '[word="test1"]',
      requete_medievale: '[word="test1"]',
      patterns: { simple: [], medium: [], complex: [], medieval: [] }
    });

    render(<VariationView />);

    const submitButton = screen.getByText('Générer la requête');

    // Première soumission
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('[word="test1"]')).toBeInTheDocument();
    });

    // Deuxième soumission
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'test2',
      requete1: '[word="test2"]',
      requete2: '[word="test2"]',
      requete3: '[word="test2"]',
      requete_medievale: '[word="test2"]',
      patterns: { simple: [], medium: [], complex: [], medieval: [] }
    });

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: 'test2' } });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('[word="test2"]')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS D'INTÉGRATION
// ============================================================================

describe('VariationView - Intégration', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait permettre un workflow complet', async () => {
    mockGenerateAllVariationQueries.mockReturnValue({
      mot: 'philosophia',
      requete1: '[word="philosophia|phil[A-z]?sophia"]',
      requete2: '[word="philosophia|[A-z]*sophia"]',
      requete3: '[word="philosophia|[A-z]*[A-z]*ia"]',
      requete_medievale: '[word="philosophia|filosofia|phylosophia"]',
      patterns: {
        simple: ['philosophia', 'phil[A-z]?sophia'],
        medium: ['philosophia', '[A-z]*sophia'],
        complex: ['philosophia', '[A-z]*[A-z]*ia'],
        medieval: ['philosophia', 'filosofia', 'phylosophia']
      }
    });

    render(<VariationView />);

    // 1. Vérifier le rendu initial
    expect(screen.getByText('Variations orthographiques')).toBeInTheDocument();

    // 2. Modifier le mot
    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: 'philosophia' } });

    // 3. Soumettre
    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    // 4. Vérifier que les 4 types de requêtes sont affichés
    await waitFor(() => {
      expect(screen.getByText('Requête simple')).toBeInTheDocument();
      expect(screen.getByText('Requête moyenne')).toBeInTheDocument();
      expect(screen.getByText('Requête complexe')).toBeInTheDocument();
      expect(screen.getByText('Requête médiévale')).toBeInTheDocument();
    });

    // 5. Vérifier que les requêtes sont correctes
    expect(screen.getByText('[word="philosophia|phil[A-z]?sophia"]')).toBeInTheDocument();
    expect(screen.getByText('[word="philosophia|[A-z]*sophia"]')).toBeInTheDocument();
  });
});
