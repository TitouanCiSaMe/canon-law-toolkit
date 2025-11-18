/**
 * Tests unitaires pour SemanticView
 *
 * Teste :
 * - Le rendu initial avec valeurs par défaut
 * - Les changements de formulaire
 * - La soumission et génération de requête sémantique
 * - Les différents modes de contexte (any, phrase, all)
 * - La gestion des erreurs
 * - L'affichage des résultats
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SemanticView from '../SemanticView';
import { generateSemanticContextQuery } from '../../../utils/queryGenerators';

// ============================================================================
// MOCKS
// ============================================================================

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'queryGenerator.semantic.title': 'Contexte sémantique',
        'queryGenerator.semantic.description': 'Description du contexte sémantique',
        'queryGenerator.semantic.formTitle': 'Paramètres de recherche',
        'queryGenerator.semantic.centralLemma': 'Lemme central',
        'queryGenerator.semantic.contextLemmas': 'Lemmes de contexte',
        'queryGenerator.semantic.contextMode': 'Mode de contexte',
        'queryGenerator.semantic.contextHelp': 'Séparez les lemmes par des virgules',
        'queryGenerator.semantic.modeAny': 'Au moins un',
        'queryGenerator.semantic.modePhrase': 'Phrase',
        'queryGenerator.semantic.modeAll': 'Tous',
        'queryGenerator.semantic.modeHelp.any': 'Aide any',
        'queryGenerator.semantic.modeHelp.phrase': 'Aide phrase',
        'queryGenerator.semantic.modeHelp.all': 'Aide all',
        'queryGenerator.semantic.placeholders.centralLemma': 'ex: intentio',
        'queryGenerator.semantic.placeholders.contextLemmas': 'ex: voluntas, ratio',
        'queryGenerator.semantic.results.central': 'Lemme central',
        'queryGenerator.semantic.results.contexts': 'Contextes',
        'queryGenerator.proximity.distance': 'Distance maximale',
        'queryGenerator.ui.generate': 'Générer la requête',
        'queryGenerator.ui.queryGenerated': 'Requête CQL générée',
        'common.error': 'Erreur'
      };
      return translations[key] || key;
    }
  })
}));

// Mock du module queryGenerators
jest.mock('../../../utils/queryGenerators', () => ({
  generateSemanticContextQuery: jest.fn()
}));

// ============================================================================
// TESTS DE RENDU INITIAL
// ============================================================================

describe('SemanticView - Rendu initial', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rendre le composant sans erreur', () => {
    render(<SemanticView />);

    expect(screen.getByText('Contexte sémantique')).toBeInTheDocument();
    expect(screen.getByText('Description du contexte sémantique')).toBeInTheDocument();
  });

  it('devrait afficher tous les champs du formulaire', () => {
    render(<SemanticView />);

    expect(screen.getByText('Lemme central')).toBeInTheDocument();
    expect(screen.getByText('Lemmes de contexte')).toBeInTheDocument();
    expect(screen.getByText('Distance maximale')).toBeInTheDocument();
    expect(screen.getByText('Mode de contexte')).toBeInTheDocument();
  });

  it('devrait avoir des valeurs par défaut', () => {
    render(<SemanticView />);

    const centralInput = screen.getByPlaceholderText('ex: intentio');
    const contextInput = screen.getByPlaceholderText('ex: voluntas, ratio');
    const distanceInput = screen.getByRole('spinbutton');

    expect(centralInput).toHaveValue('intentio');
    expect(contextInput).toHaveValue('voluntas, ratio, intellectus');
    expect(distanceInput).toHaveValue(20);
  });

  it('devrait afficher les options de mode de contexte', () => {
    render(<SemanticView />);

    expect(screen.getByText('Au moins un')).toBeInTheDocument();
    expect(screen.getByText('Phrase')).toBeInTheDocument();
    expect(screen.getByText('Tous')).toBeInTheDocument();
  });

  it('devrait avoir "Au moins un" sélectionné par défaut', () => {
    render(<SemanticView />);

    const radios = screen.getAllByRole('radio');
    // Le premier radio devrait être "Au moins un"
    expect(radios[0]).toBeChecked();
  });

  it('devrait afficher le texte d\'aide', () => {
    render(<SemanticView />);

    expect(screen.getByText('Séparez les lemmes par des virgules')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES INTERACTIONS FORMULAIRE
// ============================================================================

describe('SemanticView - Interactions formulaire', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait permettre de changer le lemme central', () => {
    render(<SemanticView />);

    const centralInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(centralInput, { target: { value: 'ratio' } });

    expect(centralInput).toHaveValue('ratio');
  });

  it('devrait permettre de changer les lemmes de contexte', () => {
    render(<SemanticView />);

    const contextInput = screen.getByPlaceholderText('ex: voluntas, ratio');
    fireEvent.change(contextInput, { target: { value: 'amor, caritas' } });

    expect(contextInput).toHaveValue('amor, caritas');
  });

  it('devrait permettre de changer la distance', () => {
    render(<SemanticView />);

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '30' } });

    expect(distanceInput).toHaveValue(30);
  });

  it('devrait permettre de changer le mode de contexte', () => {
    render(<SemanticView />);

    const radios = screen.getAllByRole('radio');
    const phraseRadio = radios[1]; // "Phrase"

    fireEvent.click(phraseRadio);

    expect(phraseRadio).toBeChecked();
    expect(radios[0]).not.toBeChecked();
  });

  it('devrait permettre de basculer entre les modes', () => {
    render(<SemanticView />);

    const radios = screen.getAllByRole('radio');

    // Passer à "Phrase"
    fireEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();

    // Passer à "Tous"
    fireEvent.click(radios[2]);
    expect(radios[2]).toBeChecked();

    // Revenir à "Au moins un"
    fireEvent.click(radios[0]);
    expect(radios[0]).toBeChecked();
  });
});

// ============================================================================
// TESTS DE SOUMISSION
// ============================================================================

describe('SemanticView - Soumission du formulaire', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait appeler generateSemanticContextQuery à la soumission', () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="intentio"] []{0,20} ([lemma="voluntas"]|[lemma="ratio"]|[lemma="intellectus"])',
      centralLemma: 'intentio',
      contextLemmas: ['voluntas', 'ratio', 'intellectus'],
      distance: 20,
      contextMode: 'any'
    });

    render(<SemanticView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateSemanticContextQuery).toHaveBeenCalledWith(
      'intentio',
      'voluntas, ratio, intellectus',
      20,
      'any'
    );
  });

  it('devrait afficher le résultat après soumission réussie', async () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="intentio"] []{0,20} ([lemma="voluntas"]|[lemma="ratio"])',
      centralLemma: 'intentio',
      contextLemmas: ['voluntas', 'ratio'],
      distance: 20,
      contextMode: 'any'
    });

    render(<SemanticView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Requête CQL générée')).toBeInTheDocument();
      expect(screen.getByText(/intentio.*voluntas.*ratio/)).toBeInTheDocument();
    });
  });

  it('devrait afficher une erreur si la génération échoue', async () => {
    generateSemanticContextQuery.mockReturnValue({
      error: 'Le lemme central et au moins un contexte doivent être renseignés'
    });

    render(<SemanticView />);

    const centralInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(centralInput, { target: { value: '' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Le lemme central et au moins un contexte doivent être renseignés')).toBeInTheDocument();
    });
  });

  it('devrait appeler avec le mode "phrase"', () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="intentio"] []{0,20} [lemma="voluntas"] | [lemma="voluntas"] []{0,20} [lemma="intentio"]',
      centralLemma: 'intentio',
      contextLemmas: ['voluntas'],
      distance: 20,
      contextMode: 'phrase'
    });

    render(<SemanticView />);

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]); // "Phrase"

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateSemanticContextQuery).toHaveBeenCalledWith(
      'intentio',
      'voluntas, ratio, intellectus',
      20,
      'phrase'
    );
  });

  it('devrait appeler avec le mode "all"', () => {
    generateSemanticContextQuery.mockReturnValue({
      query: 'complex query with all contexts',
      centralLemma: 'intentio',
      contextLemmas: ['voluntas', 'ratio'],
      distance: 20,
      contextMode: 'all'
    });

    render(<SemanticView />);

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[2]); // "Tous"

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateSemanticContextQuery).toHaveBeenCalledWith(
      'intentio',
      'voluntas, ratio, intellectus',
      20,
      'all'
    );
  });

  it('devrait appeler avec les bonnes valeurs modifiées', () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="ratio"] []{0,30} ([lemma="amor"]|[lemma="caritas"])',
      centralLemma: 'ratio',
      contextLemmas: ['amor', 'caritas'],
      distance: 30,
      contextMode: 'any'
    });

    render(<SemanticView />);

    // Modifier les valeurs
    const centralInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(centralInput, { target: { value: 'ratio' } });

    const contextInput = screen.getByPlaceholderText('ex: voluntas, ratio');
    fireEvent.change(contextInput, { target: { value: 'amor, caritas' } });

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '30' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateSemanticContextQuery).toHaveBeenCalledWith(
      'ratio',
      'amor, caritas',
      30,
      'any'
    );
  });
});

// ============================================================================
// TESTS D'AFFICHAGE DES RÉSULTATS
// ============================================================================

describe('SemanticView - Affichage des résultats', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait afficher les métadonnées dans ResultCard', async () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="intentio"] []{0,20} ([lemma="voluntas"])',
      centralLemma: 'intentio',
      contextLemmas: ['voluntas', 'ratio'],
      distance: 20,
      contextMode: 'any'
    });

    render(<SemanticView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/intentio/)).toBeInTheDocument();
      expect(screen.getByText(/voluntas, ratio/)).toBeInTheDocument();
    });
  });

  it('ne devrait pas afficher de résultat avant soumission', () => {
    render(<SemanticView />);

    expect(screen.queryByText('Requête CQL générée')).not.toBeInTheDocument();
  });

  it('devrait cacher le résultat en cas d\'erreur', async () => {
    // D'abord un succès
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="test"]',
      centralLemma: 'test',
      contextLemmas: ['test2'],
      distance: 20,
      contextMode: 'any'
    });

    const { rerender } = render(<SemanticView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('[lemma="test"]')).toBeInTheDocument();
    });

    // Ensuite une erreur
    generateSemanticContextQuery.mockReturnValue({
      error: 'Erreur de test'
    });

    rerender(<SemanticView />);

    const centralInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(centralInput, { target: { value: '' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('[lemma="test"]')).not.toBeInTheDocument();
      expect(screen.getByText('Erreur de test')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS DE CAS LIMITES
// ============================================================================

describe('SemanticView - Cas limites', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait gérer les valeurs de distance aux limites', () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="test"]',
      centralLemma: 'test',
      contextLemmas: ['test2'],
      distance: 100,
      contextMode: 'any'
    });

    render(<SemanticView />);

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '100' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateSemanticContextQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      100,
      expect.any(String)
    );
  });

  it('devrait gérer les espaces dans les lemmes', () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="test"]',
      centralLemma: 'test',
      contextLemmas: ['test2', 'test3'],
      distance: 20,
      contextMode: 'any'
    });

    render(<SemanticView />);

    const centralInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(centralInput, { target: { value: '  test  ' } });

    const contextInput = screen.getByPlaceholderText('ex: voluntas, ratio');
    fireEvent.change(contextInput, { target: { value: ' test2 , test3 ' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateSemanticContextQuery).toHaveBeenCalled();
  });

  it('devrait gérer un seul lemme de contexte', () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="intentio"] []{0,20} [lemma="voluntas"]',
      centralLemma: 'intentio',
      contextLemmas: ['voluntas'],
      distance: 20,
      contextMode: 'any'
    });

    render(<SemanticView />);

    const contextInput = screen.getByPlaceholderText('ex: voluntas, ratio');
    fireEvent.change(contextInput, { target: { value: 'voluntas' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateSemanticContextQuery).toHaveBeenCalledWith(
      'intentio',
      'voluntas',
      20,
      'any'
    );
  });

  it('devrait gérer plusieurs lemmes de contexte', () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="intentio"]',
      centralLemma: 'intentio',
      contextLemmas: ['voluntas', 'ratio', 'intellectus', 'amor', 'caritas'],
      distance: 20,
      contextMode: 'any'
    });

    render(<SemanticView />);

    const contextInput = screen.getByPlaceholderText('ex: voluntas, ratio');
    fireEvent.change(contextInput, { target: { value: 'voluntas, ratio, intellectus, amor, caritas' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateSemanticContextQuery).toHaveBeenCalled();
  });

  it('devrait gérer plusieurs soumissions successives', async () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="test1"]',
      centralLemma: 'test1',
      contextLemmas: ['test2'],
      distance: 20,
      contextMode: 'any'
    });

    render(<SemanticView />);

    const submitButton = screen.getByText('Générer la requête');

    // Première soumission
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('[lemma="test1"]')).toBeInTheDocument();
    });

    // Deuxième soumission
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="test2"]',
      centralLemma: 'test2',
      contextLemmas: ['test3'],
      distance: 20,
      contextMode: 'any'
    });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('[lemma="test2"]')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS D'INTÉGRATION
// ============================================================================

describe('SemanticView - Intégration', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait permettre un workflow complet', async () => {
    generateSemanticContextQuery.mockReturnValue({
      query: '[lemma="intentio"] []{0,25} [lemma="voluntas"] | [lemma="voluntas"] []{0,25} [lemma="intentio"]',
      centralLemma: 'intentio',
      contextLemmas: ['voluntas', 'amor'],
      distance: 25,
      contextMode: 'phrase'
    });

    render(<SemanticView />);

    // 1. Vérifier le rendu initial
    expect(screen.getByText('Contexte sémantique')).toBeInTheDocument();

    // 2. Modifier les champs
    const contextInput = screen.getByPlaceholderText('ex: voluntas, ratio');
    fireEvent.change(contextInput, { target: { value: 'voluntas, amor' } });

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '25' } });

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]); // "Phrase"

    // 3. Soumettre
    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    // 4. Vérifier le résultat
    await waitFor(() => {
      expect(screen.getByText('Requête CQL générée')).toBeInTheDocument();
      expect(screen.getByText(/intentio.*voluntas/)).toBeInTheDocument();
    });
  });
});
