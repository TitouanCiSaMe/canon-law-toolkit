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

import { vi } from 'vitest';

// ============================================================================
// MOCKS - MUST BE BEFORE IMPORTS
// ============================================================================

// Mock du module variationGenerators
vi.mock('../../../utils/variationGenerators', () => ({
  generateAllVariationQueries: vi.fn()
}));

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'queryGenerator.variation.title': 'Variations orthographiques',
        'queryGenerator.variation.description': 'Générez des requêtes pour trouver des variantes orthographiques avec support pour le latin médiéval.',
        'queryGenerator.variation.formTitle': 'Recherche de variations',
        'queryGenerator.variation.word': 'Mot à rechercher',
        'queryGenerator.variation.placeholders.word': 'ex: intentio',
        'queryGenerator.variation.simpleQuery': 'Requête simple',
        'queryGenerator.variation.mediumQuery': 'Requête moyenne',
        'queryGenerator.variation.complexQuery': 'Requête complexe',
        'queryGenerator.proximity.attribute': 'Attribut',
        'queryGenerator.attributes.word': 'Word',
        'queryGenerator.attributes.lemma': 'Lemma',
        'queryGenerator.ui.generate': 'Générer la requête',
        'common.error': 'Erreur'
      };
      return translations[key] || key;
    }
  })
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariationView from '../VariationView';
import { generateAllVariationQueries } from '../../../utils/variationGenerators';

// ============================================================================
// TESTS DE RENDU INITIAL
// ============================================================================

describe('VariationView - Rendu initial', () => {

  beforeEach(() => {
    vi.clearAllMocks();
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

  it('devrait afficher le sélecteur d\'attribut', () => {
    render(<VariationView />);

    expect(screen.getByText('Attribut')).toBeInTheDocument();
    expect(screen.getByText('Word')).toBeInTheDocument();
    expect(screen.getByText('Lemma')).toBeInTheDocument();
  });

  it('devrait avoir la valeur par défaut "intentio"', () => {
    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    expect(wordInput).toHaveValue('intentio');
  });

  it('devrait avoir "word" sélectionné par défaut', () => {
    render(<VariationView />);

    const radios = screen.getAllByRole('radio');
    // Le premier radio devrait être "word"
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
    vi.clearAllMocks();
  });

  it('devrait permettre de changer le mot', () => {
    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: 'ratio' } });

    expect(wordInput).toHaveValue('ratio');
  });

  it('devrait permettre de changer l\'attribut', () => {
    render(<VariationView />);

    const radios = screen.getAllByRole('radio');
    const lemmaRadio = radios[1]; // "lemma"

    fireEvent.click(lemmaRadio);

    expect(lemmaRadio).toBeChecked();
    expect(radios[0]).not.toBeChecked();
  });

  it('devrait permettre de basculer entre word et lemma', () => {
    render(<VariationView />);

    const radios = screen.getAllByRole('radio');

    // Initialement "word" est coché
    expect(radios[0]).toBeChecked();

    // Passer à "lemma"
    fireEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();
    expect(radios[0]).not.toBeChecked();

    // Revenir à "word"
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
    vi.clearAllMocks();
  });

  it('devrait appeler generateAllVariationQueries à la soumission', () => {
    generateAllVariationQueries.mockReturnValue({
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

    expect(generateAllVariationQueries).toHaveBeenCalledWith(
      'intentio',
      true,
      'word'
    );
  });

  it('devrait afficher les 3 types de requêtes après soumission réussie', async () => {
    generateAllVariationQueries.mockReturnValue({
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
      expect(screen.queryByText('Requête médiévale')).not.toBeInTheDocument();
    });
  });

  it('devrait afficher une erreur si la génération échoue', async () => {
    generateAllVariationQueries.mockReturnValue({
      error: 'Erreur de génération'
    });

    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: 'test' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur de génération')).toBeInTheDocument();
    });
  });

  it('devrait appeler avec attribute=lemma quand lemma est sélectionné', () => {
    generateAllVariationQueries.mockReturnValue({
      mot: 'intentio',
      requete1: '[lemma="intentio"]',
      requete2: '[lemma="intentio"]',
      requete3: '[lemma="intentio"]',
      requete_medievale: '[lemma="intentio|intencio"]',
      patterns: { simple: ['intentio'], medium: ['intentio'], complex: ['intentio'], medieval: ['intentio'] }
    });

    render(<VariationView />);

    // Sélectionner "lemma"
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    expect(generateAllVariationQueries).toHaveBeenCalledWith(
      'intentio',
      true,
      'lemma'
    );
  });

  it('devrait appeler avec le mot modifié', () => {
    generateAllVariationQueries.mockReturnValue({
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

    expect(generateAllVariationQueries).toHaveBeenCalledWith(
      'ratio',
      true,
      'word'
    );
  });
});

// ============================================================================
// TESTS D'AFFICHAGE DES RÉSULTATS
// ============================================================================

describe('VariationView - Affichage des résultats', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher les 3 ResultCard avec les bonnes requêtes', async () => {
    generateAllVariationQueries.mockReturnValue({
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
      expect(screen.queryByText('[word="query4"]')).not.toBeInTheDocument();
    });
  });

  it('ne devrait pas afficher de résultat avant soumission', () => {
    render(<VariationView />);

    expect(screen.queryByText('Requête simple')).not.toBeInTheDocument();
    expect(screen.queryByText('Requête moyenne')).not.toBeInTheDocument();
    expect(screen.queryByText('Requête complexe')).not.toBeInTheDocument();
  });

  it('devrait afficher une erreur et masquer les anciens résultats', async () => {
    // Commencer directement avec une erreur
    generateAllVariationQueries.mockReturnValue({
      error: 'Erreur de test'
    });

    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: 'test' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erreur de test')).toBeInTheDocument();
      expect(screen.queryByText('Requête simple')).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS DE CAS LIMITES
// ============================================================================

describe('VariationView - Cas limites', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait empêcher la soumission avec un mot vide (validation HTML5)', () => {
    generateAllVariationQueries.mockReturnValue({
      error: 'Le mot doit être renseigné'
    });

    render(<VariationView />);

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: '' } });

    const submitButton = screen.getByText('Générer la requête');
    fireEvent.click(submitButton);

    // Le formulaire HTML5 empêche la soumission car le champ est required
    expect(generateAllVariationQueries).not.toHaveBeenCalled();
  });

  it('devrait gérer les espaces dans le mot', () => {
    generateAllVariationQueries.mockReturnValue({
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

    expect(generateAllVariationQueries).toHaveBeenCalled();
  });

  it('devrait mettre à jour les résultats à chaque soumission', async () => {
    generateAllVariationQueries.mockReturnValue({
      mot: 'test1',
      requete1: '[word="first-query"]',
      requete2: '[word="first-medium"]',
      requete3: '[word="first-complex"]',
      requete_medievale: '[word="first-medieval"]',
      patterns: { simple: [], medium: [], complex: [], medieval: [] }
    });

    render(<VariationView />);

    const submitButton = screen.getByText('Générer la requête');

    // Première soumission
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('[word="first-query"]')).toBeInTheDocument();
    });

    // Deuxième soumission
    generateAllVariationQueries.mockReturnValue({
      mot: 'test2',
      requete1: '[word="second-query"]',
      requete2: '[word="second-medium"]',
      requete3: '[word="second-complex"]',
      requete_medievale: '[word="second-medieval"]',
      patterns: { simple: [], medium: [], complex: [], medieval: [] }
    });

    const wordInput = screen.getByPlaceholderText('ex: intentio');
    fireEvent.change(wordInput, { target: { value: 'test2' } });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('[word="second-query"]')).toBeInTheDocument();
    });
  });
});

// ============================================================================
// TESTS D'INTÉGRATION
// ============================================================================

describe('VariationView - Intégration', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait permettre un workflow complet', async () => {
    generateAllVariationQueries.mockReturnValue({
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

    // 4. Vérifier que les 3 types de requêtes sont affichés
    await waitFor(() => {
      expect(screen.getByText('Requête simple')).toBeInTheDocument();
      expect(screen.getByText('Requête moyenne')).toBeInTheDocument();
      expect(screen.getByText('Requête complexe')).toBeInTheDocument();
      expect(screen.queryByText('Requête médiévale')).not.toBeInTheDocument();
    });

    // 5. Vérifier que les requêtes sont correctes
    expect(screen.getByText('[word="philosophia|phil[A-z]?sophia"]')).toBeInTheDocument();
    expect(screen.getByText('[word="philosophia|[A-z]*sophia"]')).toBeInTheDocument();
  });
});
