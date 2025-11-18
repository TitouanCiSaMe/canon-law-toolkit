/**
 * Tests unitaires pour les générateurs de requêtes CQL
 */

import { describe, it, expect } from 'vitest';
import {
  validateDistance,
  generateProximityQuery,
  generateProximityWithVariations,
  generateSemanticContextQuery,
  generateNoSketchUrl
} from '../queryGenerators';
import { DISTANCE_LIMITS } from '../../config/constants';

describe('queryGenerators', () => {
  describe('validateDistance', () => {
    it('devrait valider une distance normale', () => {
      expect(validateDistance(10)).toBe(10);
      expect(validateDistance('10')).toBe(10);
    });

    it('devrait limiter à MAX si trop grand', () => {
      expect(validateDistance(200)).toBe(DISTANCE_LIMITS.MAX);
    });

    it('devrait limiter à MIN si négatif', () => {
      expect(validateDistance(-5)).toBe(DISTANCE_LIMITS.MIN);
    });

    it('devrait retourner DEFAULT si NaN', () => {
      expect(validateDistance('abc')).toBe(DISTANCE_LIMITS.DEFAULT_PROXIMITY);
      expect(validateDistance(null)).toBe(DISTANCE_LIMITS.DEFAULT_PROXIMITY);
    });
  });

  describe('generateProximityQuery', () => {
    it('devrait générer une requête unidirectionnelle', () => {
      const result = generateProximityQuery('intentio', 'Augustinus', 10, 'lemma', false);

      expect(result.query).toBe('[lemma="intentio"] []{0,10} [lemma="Augustinus"]');
      expect(result.bidirectional).toBe(false);
      expect(result.lemma1).toBe('intentio');
      expect(result.lemma2).toBe('Augustinus');
    });

    it('devrait générer une requête bidirectionnelle', () => {
      const result = generateProximityQuery('intentio', 'Augustinus', 10, 'lemma', true);

      expect(result.query).toContain('[lemma="intentio"] []{0,10} [lemma="Augustinus"]');
      expect(result.query).toContain('|');
      expect(result.query).toContain('[lemma="Augustinus"] []{0,10} [lemma="intentio"]');
      expect(result.bidirectional).toBe(true);
    });

    it('devrait retourner une erreur si lemme manquant', () => {
      const result1 = generateProximityQuery('', 'Augustinus', 10);
      const result2 = generateProximityQuery('intentio', '', 10);

      expect(result1.error).toBeDefined();
      expect(result2.error).toBeDefined();
    });

    it('devrait nettoyer les entrées', () => {
      const result = generateProximityQuery('  intentio  ', ' Augustinus@# ', 10);
      expect(result.lemma1).toBe('intentio');
      expect(result.lemma2).toBe('Augustinus');
    });

    it('devrait utiliser l\'attribut spécifié', () => {
      const result = generateProximityQuery('intentio', 'Augustinus', 10, 'word');
      expect(result.query).toContain('[word=');
      expect(result.attribute).toBe('word');
    });

    it('devrait valider la distance', () => {
      const result = generateProximityQuery('intentio', 'Augustinus', 200);
      expect(result.distance).toBe(DISTANCE_LIMITS.MAX);
    });
  });

  describe('generateProximityWithVariations', () => {
    it('devrait générer une requête avec variations simples', () => {
      const result = generateProximityWithVariations(
        'intentio',
        'ratio',
        10,
        'simple',
        'word',
        true
      );

      expect(result.query).toContain('[word=');
      expect(result.query).toContain('|'); // Plusieurs patterns
      expect(result.patterns1).toBeInstanceOf(Array);
      expect(result.patterns2).toBeInstanceOf(Array);
      expect(result.variationType).toBe('simple');
    });

    it('devrait retourner une erreur si lemme manquant', () => {
      const result = generateProximityWithVariations('', 'ratio', 10);
      expect(result.error).toBeDefined();
    });

    it('devrait être bidirectionnel par défaut', () => {
      const result = generateProximityWithVariations('intentio', 'ratio', 10);
      expect(result.query.split('|').length).toBeGreaterThan(1);
    });

    it('devrait utiliser différents types de variations', () => {
      const simple = generateProximityWithVariations('intentio', 'ratio', 10, 'simple');
      const medieval = generateProximityWithVariations('intentio', 'ratio', 10, 'medieval');

      expect(simple.patterns1).toBeDefined();
      expect(medieval.patterns1).toBeDefined();
      // Medieval pourrait avoir des patterns différents
      expect(medieval.variationType).toBe('medieval');
    });
  });

  describe('generateSemanticContextQuery', () => {
    it('devrait générer une requête "any" (au moins un)', () => {
      const result = generateSemanticContextQuery(
        'intentio',
        'voluntas, ratio',
        20,
        'any'
      );

      expect(result.query).toContain('[lemma="intentio"]');
      expect(result.query).toContain('voluntas');
      expect(result.query).toContain('ratio');
      expect(result.contextMode).toBe('any');
      expect(result.contextLemmas).toEqual(['voluntas', 'ratio']);
    });

    it('devrait générer une requête "phrase" optimisée', () => {
      const result = generateSemanticContextQuery(
        'intentio',
        'voluntas, ratio',
        20,
        'phrase'
      );

      expect(result.query).toContain('[lemma="intentio"]');
      expect(result.query).toContain('voluntas');
      expect(result.query).toContain('ratio');
      expect(result.contextMode).toBe('phrase');

      // Doit avoir des sous-requêtes séparées par |
      const subQueries = result.query.split('|');
      expect(subQueries.length).toBeGreaterThan(1);
    });

    it('devrait générer une requête "all" (tous)', () => {
      const result = generateSemanticContextQuery(
        'intentio',
        'voluntas, ratio',
        20,
        'all'
      );

      expect(result.query).toContain('[lemma="intentio"]');
      expect(result.contextMode).toBe('all');

      // Mode "all" génère de nombreuses permutations
      const subQueries = result.query.split('|');
      expect(subQueries.length).toBeGreaterThan(2);
    });

    it('devrait retourner une erreur si lemme central manquant', () => {
      const result = generateSemanticContextQuery('', 'voluntas');
      expect(result.error).toBeDefined();
    });

    it('devrait retourner une erreur si aucun contexte valide', () => {
      const result = generateSemanticContextQuery('intentio', '  ,,  ');
      expect(result.error).toBeDefined();
    });

    it('devrait nettoyer les espaces dans les lemmes de contexte', () => {
      const result = generateSemanticContextQuery(
        'intentio',
        ' voluntas , ratio ,  intellectus ',
        20,
        'any'
      );

      expect(result.contextLemmas).toEqual(['voluntas', 'ratio', 'intellectus']);
    });

    it('devrait valider la distance', () => {
      const result = generateSemanticContextQuery('intentio', 'voluntas', 200);
      expect(result.distance).toBe(DISTANCE_LIMITS.MAX);
    });
  });

  describe('generateNoSketchUrl', () => {
    it('devrait encoder correctement la requête', () => {
      const query = '[lemma="intentio"] []{0,10} [lemma="Augustinus"]';
      const url = generateNoSketchUrl(query);

      expect(url).toContain('https://fip-185-155-93-80.iaas.unistra.fr/');
      expect(url).toContain('cql=');
      expect(url).toContain(encodeURIComponent(query));
    });

    it('devrait gérer les caractères spéciaux', () => {
      const query = '[word="test|test2"]';
      const url = generateNoSketchUrl(query);

      // Le pipe doit être encodé
      expect(url).toContain('%7C'); // | encodé
    });

    it('devrait gérer les requêtes vides', () => {
      const url = generateNoSketchUrl('');
      expect(url).toContain('cql=');
    });
  });
});
