/**
 * Tests unitaires pour ProximityVariationView
 *
 * Teste :
 * - Le rendu initial avec valeurs par défaut
 * - Les changements de formulaire
 * - La soumission et génération de requête avec variations
 * - La gestion des erreurs
 * - L'affichage des résultats avec patterns
 */

// ============================================================================
// MOCKS - MUST BE BEFORE IMPORTS
// ============================================================================

// Mock du module queryGenerators
const mockGenerateProximityWithVariations = jest.fn();
jest.mock('../../../utils/queryGenerators', () => ({
  generateProximityWithVariations: mockGenerateProximityWithVariations
}));

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'queryGenerator.proximityVariation.title': 'Proximité avec variations',
        'queryGenerator.proximityVariation.description': 'Combinez proximité et variations orthographiques pour une recherche exhaustive.',
        'queryGenerator.proximityVariation.formTitle': 'Recherche avancée',
        'queryGenerator.proximityVariation.variationType': 'Type de variations',
        'queryGenerator.proximityVariation.simple': 'Simple',
        'queryGenerator.proximityVariation.medium': 'Moyen',
        'queryGenerator.proximityVariation.medieval': 'Médiéval',
        'queryGenerator.proximity.lemma1': 'Premier lemme',
        'queryGenerator.proximity.lemma2': 'Second lemme',
        'queryGenerator.proximity.distance': 'Distance maximale',
        'queryGenerator.proximity.attribute': 'Attribut',
        'queryGenerator.proximity.bidirectional': 'Recherche bidirectionnelle',
        'queryGenerator.attributes.word': 'Mot',
        'queryGenerator.attributes.lemma': 'Lemme',
        'queryGenerator.ui.generate': 'Générer la requête',
        'queryGenerator.ui.queryGenerated': 'Requête CQL générée',
        'common.error': 'Erreur'
      };
      return translations[key] || key;
    }
  })
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProximityVariationView from '../ProximityVariationView';

// ============================================================================
// TESTS DE RENDU INITIAL
// ============================================================================

describe('ProximityVariationView - Rendu initial', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rendre le composant sans erreur', () => {
    render(<ProximityVariationView />);

    expect(screen.getByText('Proximité avec variations')).toBeInTheDocument();
    expect(screen.getByText(/Combinez proximité et variations/)).toBeInTheDocument();
  });

  it('devrait afficher tous les champs du formulaire', () => {
    render(<ProximityVariationView />);

    expect(screen.getByText('Premier lemme')).toBeInTheDocument();
    expect(screen.getByText('Second lemme')).toBeInTheDocument();
    expect(screen.getByText('Distance maximale')).toBeInTheDocument();
    expect(screen.getByText('Attribut')).toBeInTheDocument();
    expect(screen.getByText(/Type de variation/)).toBeInTheDocument();
    expect(screen.getByText('Recherche bidirectionnelle')).toBeInTheDocument();
  });

  it('devrait avoir des valeurs par défaut', () => {
    render(<ProximityVariationView />);

    const inputs = screen.getAllByRole('textbox');
    const lemma1Input = inputs[0];
    const lemma2Input = inputs[1];
    const distanceInput = screen.getByRole('spinbutton');

    expect(lemma1Input).toHaveValue('intentio');
    expect(lemma2Input).toHaveValue('Augustinus');
    expect(distanceInput).toHaveValue(10);
  });

  it('devrait avoir "Simple" sélectionné par défaut', () => {
    render(<ProximityVariationView />);

    const radios = screen.getAllByRole('radio');
    // Le premier radio devrait être "Simple"
    expect(radios[0]).toBeChecked();
  });

  it('devrait afficher les options de variation en ligne', () => {
    render(<ProximityVariationView />);

    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(screen.getByText('Moyen')).toBeInTheDocument();
    expect(screen.getByText('Médiéval')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES INTERACTIONS FORMULAIRE
// ============================================================================

describe('ProximityVariationView - Interactions formulaire', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait permettre de changer lemma1', () => {
    render(<ProximityVariationView />);

    const inputs = screen.getAllByRole('textbox');
    const lemma1Input = inputs[0];
    fireEvent.change(lemma1Input, { target: { value: 'ratio' } });

    expect(lemma1Input).toHaveValue('ratio');
  });

  it('devrait permettre de changer lemma2', () => {
    render(<ProximityVariationView />);

    const inputs = screen.getAllByRole('textbox');
    const lemma2Input = inputs[1];
    fireEvent.change(lemma2Input, { target: { value: 'Thomas' } });

    expect(lemma2Input).toHaveValue('Thomas');
  });

  it('devrait permettre de changer la distance', () => {
    render(<ProximityVariationView />);

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '20' } });

    expect(distanceInput).toHaveValue(20);
  });

  it('devrait permettre de changer l\'attribut', () => {
    render(<ProximityVariationView />);

    const attributeSelect = screen.getByRole('combobox');
    fireEvent.change(attributeSelect, { target: { value: 'lemma' } });

    expect(attributeSelect).toHaveValue('lemma');
  });

  it('devrait permettre de changer le type de variation', () => {
    render(<ProximityVariationView />);

    const radios = screen.getAllByRole('radio');
    const mediumRadio = radios[1]; // "Moyenne"

    fireEvent.click(mediumRadio);

    expect(mediumRadio).toBeChecked();
    expect(radios[0]).not.toBeChecked();
  });

  it('devrait permettre de cocher/décocher bidirectional', () => {
    render(<ProximityVariationView />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});

// ============================================================================
// TESTS DE SOUMISSION
// ============================================================================

describe('ProximityVariationView - Soumission du formulaire', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait appeler mockGenerateProximityWithVariations à la soumission', () => {
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[word="intentio|intencio"] []{0,10} [word="Augustinus|Augustus"]',
      lemma1: 'intentio',
      lemma2: 'Augustinus',
      patterns1: ['intentio', 'intencio'],
      patterns2: ['Augustinus', 'Augustus'],
      distance: 10,
      variationType: 'simple',
      attribute: 'word',
      bidirectional: true
    });

    render(<ProximityVariationView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(mockGenerateProximityWithVariations).toHaveBeenCalledWith(
      'intentio',
      'Augustinus',
      10,
      'simple',
      'word',
      true
    );
  });

  it('devrait afficher le résultat après soumission réussie', async () => {
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[word="intentio|intencio"] []{0,10} [word="Augustinus"]',
      lemma1: 'intentio',
      lemma2: 'Augustinus',
      patterns1: ['intentio', 'intencio'],
      patterns2: ['Augustinus'],
      distance: 10,
      variationType: 'simple',
      attribute: 'word',
      bidirectional: true
    });

    render(<ProximityVariationView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Requête CQL générée')).toBeInTheDocument();
      expect(screen.getByText('[word="intentio|intencio"] []{0,10} [word="Augustinus"]')).toBeInTheDocument();
    });
  });

  it('devrait afficher une erreur si la génération échoue', async () => {
    mockGenerateProximityWithVariations.mockReturnValue({
      error: 'Les deux lemmes doivent être renseignés'
    });

    render(<ProximityVariationView />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Les deux lemmes doivent être renseignés')).toBeInTheDocument();
    });
  });

  it('devrait appeler avec le type de variation sélectionné', () => {
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[word="test"]',
      lemma1: 'test',
      lemma2: 'test2',
      patterns1: ['test'],
      patterns2: ['test2'],
      distance: 10,
      variationType: 'medieval',
      attribute: 'word',
      bidirectional: true
    });

    render(<ProximityVariationView />);

    // Sélectionner "Médiévale"
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[2]);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(mockGenerateProximityWithVariations).toHaveBeenCalledWith(
      'intentio',
      'Augustinus',
      10,
      'medieval',
      'word',
      true
    );
  });

  it('devrait appeler avec les bonnes valeurs modifiées', () => {
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[lemma="ratio"] []{0,15} [lemma="intellectus"]',
      lemma1: 'ratio',
      lemma2: 'intellectus',
      patterns1: ['ratio'],
      patterns2: ['intellectus'],
      distance: 15,
      variationType: 'medium',
      attribute: 'lemma',
      bidirectional: false
    });

    render(<ProximityVariationView />);

    // Modifier les valeurs
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'ratio' } });
    fireEvent.change(inputs[1], { target: { value: 'intellectus' } });

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '15' } });

    const attributeSelect = screen.getByRole('combobox');
    fireEvent.change(attributeSelect, { target: { value: 'lemma' } });

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]); // "Moyenne"

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox); // Décocher bidirectional

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(mockGenerateProximityWithVariations).toHaveBeenCalledWith(
      'ratio',
      'intellectus',
      15,
      'medium',
      'lemma',
      false
    );
  });
});

// ============================================================================
// TESTS D'AFFICHAGE DES RÉSULTATS
// ============================================================================

describe('ProximityVariationView - Affichage des résultats', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait afficher les patterns dans ResultCard', async () => {
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[word="test"]',
      lemma1: 'test',
      lemma2: 'test2',
      patterns1: ['test', 't[A-z]?st', 'te[A-z]?t'],
      patterns2: ['test2'],
      distance: 10,
      variationType: 'simple',
      attribute: 'word',
      bidirectional: true
    });

    render(<ProximityVariationView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Requête CQL générée')).toBeInTheDocument();
    });

    // Les patterns devraient être affichés (les 8 premiers)
    expect(screen.getByText(/test/)).toBeInTheDocument();
  });

  it('ne devrait pas afficher de résultat avant soumission', () => {
    render(<ProximityVariationView />);

    expect(screen.queryByText('Requête CQL générée')).not.toBeInTheDocument();
  });

  it('devrait cacher le résultat en cas d\'erreur', async () => {
    // D'abord un succès
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[word="test"]',
      lemma1: 'test',
      lemma2: 'test2',
      patterns1: ['test'],
      patterns2: ['test2'],
      distance: 10,
      variationType: 'simple',
      attribute: 'word',
      bidirectional: true
    });

    const { rerender } = render(<ProximityVariationView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('[word="test"]')).toBeInTheDocument();
    });

    // Ensuite une erreur
    mockGenerateProximityWithVariations.mockReturnValue({
      error: 'Erreur de test'
    });

    rerender(<ProximityVariationView />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('[word="test"]')).not.toBeInTheDocument();
      expect(screen.getByText('Erreur de test')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS DE CAS LIMITES
// ============================================================================

describe('ProximityVariationView - Cas limites', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait gérer les valeurs de distance aux limites', () => {
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[word="test"]',
      lemma1: 'test',
      lemma2: 'test2',
      patterns1: ['test'],
      patterns2: ['test2'],
      distance: 100,
      variationType: 'simple',
      attribute: 'word',
      bidirectional: true
    });

    render(<ProximityVariationView />);

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '100' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(mockGenerateProximityWithVariations).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      100,
      expect.any(String),
      expect.any(String),
      expect.any(Boolean)
    );
  });

  it('devrait gérer plusieurs soumissions successives', async () => {
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[word="test1"]',
      lemma1: 'test1',
      lemma2: 'test2',
      patterns1: ['test1'],
      patterns2: ['test2'],
      distance: 10,
      variationType: 'simple',
      attribute: 'word',
      bidirectional: true
    });

    render(<ProximityVariationView />);

    const submitButton = screen.getByText('Générer la requête');

    // Première soumission
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('[word="test1"]')).toBeInTheDocument();
    });

    // Deuxième soumission
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[word="test2"]',
      lemma1: 'test2',
      lemma2: 'test3',
      patterns1: ['test2'],
      patterns2: ['test3'],
      distance: 10,
      variationType: 'simple',
      attribute: 'word',
      bidirectional: true
    });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('[word="test2"]')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS D'INTÉGRATION
// ============================================================================

describe('ProximityVariationView - Intégration', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait permettre un workflow complet', async () => {
    mockGenerateProximityWithVariations.mockReturnValue({
      query: '[word="intentio|intencio|intentyo"] []{0,10} [word="ratio|raatio|racio"]',
      lemma1: 'intentio',
      lemma2: 'ratio',
      patterns1: ['intentio', 'intencio', 'intentyo'],
      patterns2: ['ratio', 'raatio', 'racio'],
      distance: 10,
      variationType: 'medieval',
      attribute: 'word',
      bidirectional: true
    });

    render(<ProximityVariationView />);

    // 1. Vérifier le rendu initial
    expect(screen.getByText('Proximité avec variations')).toBeInTheDocument();

    // 2. Modifier les champs
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[1], { target: { value: 'ratio' } });

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[2]); // "Médiévale"

    // 3. Soumettre
    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    // 4. Vérifier le résultat
    await waitFor(() => {
      expect(screen.getByText('Requête CQL générée')).toBeInTheDocument();
      expect(screen.getByText('[word="intentio|intencio|intentyo"] []{0,10} [word="ratio|raatio|racio"]')).toBeInTheDocument();
    });
  });
});
