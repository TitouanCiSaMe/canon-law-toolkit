/**
 * Tests unitaires pour ProximityView
 *
 * Teste :
 * - Le rendu initial avec valeurs par défaut
 * - Les changements de formulaire
 * - La soumission et génération de requête
 * - La gestion des erreurs
 * - L'affichage des résultats
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProximityView from '../ProximityView';
import { generateProximityQuery } from '../../../utils/queryGenerators';

// ============================================================================
// MOCKS
// ============================================================================

// Mock de react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'queryGenerator.proximity.title': 'Recherche de proximité',
        'queryGenerator.proximity.description': 'Description de la proximité',
        'queryGenerator.proximity.formTitle': 'Paramètres de recherche',
        'queryGenerator.proximity.lemma1': 'Premier lemme',
        'queryGenerator.proximity.lemma2': 'Second lemme',
        'queryGenerator.proximity.distance': 'Distance maximale',
        'queryGenerator.proximity.attribute': 'Attribut',
        'queryGenerator.proximity.bidirectional': 'Recherche bidirectionnelle',
        'queryGenerator.proximity.placeholders.lemma1': 'ex: intentio',
        'queryGenerator.proximity.placeholders.lemma2': 'ex: Augustinus',
        'queryGenerator.attributes.lemma': 'Lemme',
        'queryGenerator.attributes.word': 'Mot',
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
  generateProximityQuery: jest.fn()
}));

// ============================================================================
// TESTS DE RENDU INITIAL
// ============================================================================

describe('ProximityView - Rendu initial', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait rendre le composant sans erreur', () => {
    render(<ProximityView />);

    expect(screen.getByText('Recherche de proximité')).toBeInTheDocument();
    expect(screen.getByText('Description de la proximité')).toBeInTheDocument();
  });

  it('devrait afficher le titre et la description', () => {
    render(<ProximityView />);

    expect(screen.getByText('Recherche de proximité')).toBeInTheDocument();
    expect(screen.getByText('Paramètres de recherche')).toBeInTheDocument();
  });

  it('devrait afficher tous les champs du formulaire', () => {
    render(<ProximityView />);

    expect(screen.getByText('Premier lemme')).toBeInTheDocument();
    expect(screen.getByText('Second lemme')).toBeInTheDocument();
    expect(screen.getByText('Distance maximale')).toBeInTheDocument();
    expect(screen.getByText('Attribut')).toBeInTheDocument();
    expect(screen.getByText('Recherche bidirectionnelle')).toBeInTheDocument();
  });

  it('devrait avoir des valeurs par défaut', () => {
    render(<ProximityView />);

    // Récupérer les inputs par leur label
    const lemma1Input = screen.getByPlaceholderText('ex: intentio');
    const lemma2Input = screen.getByPlaceholderText('ex: Augustinus');
    const distanceInput = screen.getByRole('spinbutton');

    expect(lemma1Input).toHaveValue('intentio');
    expect(lemma2Input).toHaveValue('Augustinus');
    expect(distanceInput).toHaveValue(10);
  });

  it('devrait afficher le bouton de génération', () => {
    render(<ProximityView />);

    expect(screen.getByText('Générer la requête')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES INTERACTIONS FORMULAIRE
// ============================================================================

describe('ProximityView - Interactions formulaire', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait permettre de changer lemma1', () => {
    render(<ProximityView />);

    const lemma1Input = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(lemma1Input, { target: { value: 'ratio' } });

    expect(lemma1Input).toHaveValue('ratio');
  });

  it('devrait permettre de changer lemma2', () => {
    render(<ProximityView />);

    const lemma2Input = screen.getByPlaceholderText('ex: Augustinus');
    fireEvent.change(lemma2Input, { target: { value: 'Thomas' } });

    expect(lemma2Input).toHaveValue('Thomas');
  });

  it('devrait permettre de changer la distance', () => {
    render(<ProximityView />);

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '20' } });

    expect(distanceInput).toHaveValue(20);
  });

  it('devrait permettre de changer l\'attribut', () => {
    render(<ProximityView />);

    const attributeSelect = screen.getByRole('combobox');
    fireEvent.change(attributeSelect, { target: { value: 'word' } });

    expect(attributeSelect).toHaveValue('word');
  });

  it('devrait permettre de cocher/décocher bidirectional', () => {
    render(<ProximityView />);

    const bidirectionalCheckbox = screen.getByRole('checkbox');
    expect(bidirectionalCheckbox).toBeChecked();

    fireEvent.click(bidirectionalCheckbox);
    expect(bidirectionalCheckbox).not.toBeChecked();

    fireEvent.click(bidirectionalCheckbox);
    expect(bidirectionalCheckbox).toBeChecked();
  });
});

// ============================================================================
// TESTS DE SOUMISSION
// ============================================================================

describe('ProximityView - Soumission du formulaire', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait appeler generateProximityQuery à la soumission', () => {
    generateProximityQuery.mockReturnValue({
      query: '[lemma="intentio"] []{0,10} [lemma="Augustinus"]',
      lemma1: 'intentio',
      lemma2: 'Augustinus',
      distance: 10,
      attribute: 'lemma',
      bidirectional: true
    });

    render(<ProximityView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateProximityQuery).toHaveBeenCalledWith(
      'intentio',
      'Augustinus',
      10,
      'lemma',
      true
    );
  });

  it('devrait afficher le résultat après soumission réussie', async () => {
    generateProximityQuery.mockReturnValue({
      query: '[lemma="intentio"] []{0,10} [lemma="Augustinus"]',
      lemma1: 'intentio',
      lemma2: 'Augustinus',
      distance: 10,
      attribute: 'lemma',
      bidirectional: true
    });

    render(<ProximityView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Requête CQL générée')).toBeInTheDocument();
      expect(screen.getByText('[lemma="intentio"] []{0,10} [lemma="Augustinus"]')).toBeInTheDocument();
    });
  });

  it('devrait afficher une erreur si la génération échoue', async () => {
    generateProximityQuery.mockReturnValue({
      error: 'Les deux lemmes doivent être renseignés'
    });

    render(<ProximityView />);

    const lemma1Input = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(lemma1Input, { target: { value: '' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur')).toBeInTheDocument();
      expect(screen.getByText('Les deux lemmes doivent être renseignés')).toBeInTheDocument();
    });
  });

  it('devrait appeler avec les bonnes valeurs modifiées', () => {
    generateProximityQuery.mockReturnValue({
      query: '[word="ratio"] []{0,20} [word="Thomas"]',
      lemma1: 'ratio',
      lemma2: 'Thomas',
      distance: 20,
      attribute: 'word',
      bidirectional: false
    });

    render(<ProximityView />);

    // Modifier les valeurs
    const lemma1Input = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(lemma1Input, { target: { value: 'ratio' } });

    const lemma2Input = screen.getByPlaceholderText('ex: Augustinus');
    fireEvent.change(lemma2Input, { target: { value: 'Thomas' } });

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '20' } });

    const attributeSelect = screen.getByRole('combobox');
    fireEvent.change(attributeSelect, { target: { value: 'word' } });

    const bidirectionalCheckbox = screen.getByRole('checkbox');
    fireEvent.click(bidirectionalCheckbox);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateProximityQuery).toHaveBeenCalledWith(
      'ratio',
      'Thomas',
      20,
      'word',
      false
    );
  });
});

// ============================================================================
// TESTS D'AFFICHAGE DES RÉSULTATS
// ============================================================================

describe('ProximityView - Affichage des résultats', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait afficher les métadonnées dans ResultCard', async () => {
    generateProximityQuery.mockReturnValue({
      query: '[lemma="intentio"] []{0,10} [lemma="Augustinus"]',
      lemma1: 'intentio',
      lemma2: 'Augustinus',
      distance: 10,
      attribute: 'lemma',
      bidirectional: true
    });

    render(<ProximityView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/intentio/)).toBeInTheDocument();
      expect(screen.getByText(/Augustinus/)).toBeInTheDocument();
      expect(screen.getByText(/10/)).toBeInTheDocument();
    });
  });

  it('ne devrait pas afficher de résultat avant soumission', () => {
    render(<ProximityView />);

    expect(screen.queryByText('Requête CQL générée')).not.toBeInTheDocument();
  });

  it('devrait cacher le résultat en cas d\'erreur', async () => {
    // D'abord un succès
    generateProximityQuery.mockReturnValue({
      query: '[lemma="test"]',
      lemma1: 'test',
      lemma2: 'test2',
      distance: 10,
      attribute: 'lemma',
      bidirectional: true
    });

    const { rerender } = render(<ProximityView />);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('[lemma="test"]')).toBeInTheDocument();
    });

    // Ensuite une erreur
    generateProximityQuery.mockReturnValue({
      error: 'Erreur de test'
    });

    rerender(<ProximityView />);

    const lemma1Input = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(lemma1Input, { target: { value: '' } });

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

describe('ProximityView - Cas limites', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait gérer les valeurs de distance aux limites', () => {
    generateProximityQuery.mockReturnValue({
      query: '[lemma="test"]',
      lemma1: 'test',
      lemma2: 'test2',
      distance: 100,
      attribute: 'lemma',
      bidirectional: true
    });

    render(<ProximityView />);

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '100' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateProximityQuery).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      100,
      expect.any(String),
      expect.any(Boolean)
    );
  });

  it('devrait gérer les espaces dans les lemmes', () => {
    generateProximityQuery.mockReturnValue({
      query: '[lemma="test"]',
      lemma1: 'test',
      lemma2: 'test2',
      distance: 10,
      attribute: 'lemma',
      bidirectional: true
    });

    render(<ProximityView />);

    const lemma1Input = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(lemma1Input, { target: { value: '  test  ' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateProximityQuery).toHaveBeenCalled();
  });

  it('devrait gérer plusieurs soumissions successives', async () => {
    generateProximityQuery.mockReturnValue({
      query: '[lemma="test1"]',
      lemma1: 'test1',
      lemma2: 'test2',
      distance: 10,
      attribute: 'lemma',
      bidirectional: true
    });

    render(<ProximityView />);

    const submitButton = screen.getByText('Générer la requête');

    // Première soumission
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('[lemma="test1"]')).toBeInTheDocument();
    });

    // Deuxième soumission
    generateProximityQuery.mockReturnValue({
      query: '[lemma="test2"]',
      lemma1: 'test2',
      lemma2: 'test3',
      distance: 10,
      attribute: 'lemma',
      bidirectional: true
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

describe('ProximityView - Intégration', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait permettre un workflow complet', async () => {
    generateProximityQuery.mockReturnValue({
      query: '[lemma="ratio"] []{0,15} [lemma="intellectus"]',
      lemma1: 'ratio',
      lemma2: 'intellectus',
      distance: 15,
      attribute: 'lemma',
      bidirectional: true
    });

    render(<ProximityView />);

    // 1. Vérifier le rendu initial
    expect(screen.getByText('Recherche de proximité')).toBeInTheDocument();

    // 2. Modifier les champs
    const lemma1Input = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(lemma1Input, { target: { value: 'ratio' } });

    const lemma2Input = screen.getByPlaceholderText('ex: Augustinus');
    fireEvent.change(lemma2Input, { target: { value: 'intellectus' } });

    const distanceInput = screen.getByRole('spinbutton');
    fireEvent.change(distanceInput, { target: { value: '15' } });

    // 3. Soumettre
    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    // 4. Vérifier le résultat
    await waitFor(() => {
      expect(screen.getByText('[lemma="ratio"] []{0,15} [lemma="intellectus"]')).toBeInTheDocument();
      expect(screen.getByText('Requête CQL générée')).toBeInTheDocument();
    });
  });
});
