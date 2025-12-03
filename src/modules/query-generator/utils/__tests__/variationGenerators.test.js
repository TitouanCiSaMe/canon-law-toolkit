/**
 * Tests unitaires pour les générateurs de variations orthographiques
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  generateSimpleVariations,
  generateMediumVariations,
  generateComplexVariations,
  generateMedievalVariations,
  generateVariationPatterns,
  generateAllVariationQueries
} from '../variationGenerators';

describe('variationGenerators', () => {
  describe('sanitizeInput', () => {
    it('devrait nettoyer les espaces', () => {
      expect(sanitizeInput('  intentio  ')).toBe('intentio');
    });

    it('devrait supprimer les caractères spéciaux', () => {
      expect(sanitizeInput('intentio@#$%')).toBe('intentio');
    });

    it('devrait conserver les lettres accentuées', () => {
      expect(sanitizeInput('église')).toBe('église');
    });

    it('devrait gérer les entrées vides', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('devrait conserver les tirets et apostrophes', () => {
      expect(sanitizeInput("l'église-mère")).toBe("l'église-mère");
    });
  });

  describe('generateSimpleVariations', () => {
    it('devrait générer des variations simples sans suffixe', () => {
      const result = generateSimpleVariations('abc', '');
      expect(result).toContain('abc');
      expect(result).toContain('[A-z]?bc'); // Variation sur 1ère lettre
      expect(result).toContain('a[A-z]?c'); // Variation sur 2e lettre
      expect(result).toContain('ab[A-z]?'); // Variation sur 3e lettre
    });

    it('devrait générer des variations simples avec suffixe', () => {
      const result = generateSimpleVariations('abc', '[A-z]*');
      expect(result).toContain('abc[A-z]*');
      expect(result).toContain('[A-z]?bc[A-z]*');
    });

    it('devrait dédupliquer les patterns', () => {
      const result = generateSimpleVariations('aa', '');
      const uniqueCount = new Set(result).size;
      expect(result.length).toBe(uniqueCount);
    });
  });

  describe('generateMediumVariations', () => {
    it('devrait générer des variations moyennes', () => {
      const result = generateMediumVariations('abc', '');
      expect(result).toContain('abc');
      expect(result).toContain('[A-z]*bc');
      expect(result).toContain('a[A-z]*c');
      expect(result).toContain('ab[A-z]*');
    });
  });

  describe('generateComplexVariations', () => {
    it('devrait générer des variations complexes', () => {
      const result = generateComplexVariations('abc', '');
      expect(result).toContain('abc');
      // Variation sur 1ère et 2e lettres
      expect(result).toContain('[A-z]*[A-z]*c');
    });

    it('ne devrait pas crasher sur mots courts', () => {
      const result = generateComplexVariations('ab', '');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('generateMedievalVariations', () => {
    it('devrait générer des substitutions ae/e', () => {
      const result = generateMedievalVariations('quaestio', '');
      expect(result).toContain('quaestio');
      expect(result).toContain('questio');  // ae → e
      expect(result).toContain('quæstio');  // ae → æ
    });

    it('devrait générer des substitutions ti/ci', () => {
      const result = generateMedievalVariations('intentio', '');
      expect(result).toContain('intentio');
      expect(result).toContain('intencio'); // ti → ci
    });

    it('devrait gérer les variations de voyelles', () => {
      const result = generateMedievalVariations('ratio', '');
      expect(result).toContain('ratio');
      expect(result).toContain('raatio');  // a → aa
      expect(result).toContain('ratiio'); // i → ii
    });

    it('devrait combiner plusieurs substitutions', () => {
      const result = generateMedievalVariations('philosophia', '');
      expect(result.length).toBeGreaterThan(5); // Plusieurs variations possibles
    });
  });

  describe('generateVariationPatterns', () => {
    it('devrait retourner un tableau vide pour entrée invalide', () => {
      expect(generateVariationPatterns('', 'simple')).toEqual([]);
      expect(generateVariationPatterns(null, 'simple')).toEqual([]);
    });

    it('devrait générer des patterns selon le type demandé', () => {
      const simple = generateVariationPatterns('abc', 'simple', false);
      const medium = generateVariationPatterns('abc', 'medium', false);
      const complex = generateVariationPatterns('abc', 'complex', false);

      expect(simple.length).toBeGreaterThan(0);
      expect(medium.length).toBeGreaterThan(0);
      expect(complex.length).toBeGreaterThan(0);
    });

    it('devrait combiner tous les types pour "all"', () => {
      const all = generateVariationPatterns('intentio', 'all', false);
      const simple = generateVariationPatterns('intentio', 'simple', false);

      // "all" doit contenir au moins autant que "simple"
      expect(all.length).toBeGreaterThanOrEqual(simple.length);
    });

    it('devrait ajouter le suffixe si demandé', () => {
      const withSuffix = generateVariationPatterns('abc', 'simple', true);
      expect(withSuffix[0]).toContain('[A-z]*');
    });
  });

  describe('generateAllVariationQueries', () => {
    it('devrait retourner une erreur si mot vide', () => {
      const result = generateAllVariationQueries('');
      expect(result.error).toBeDefined();
    });

    it('devrait générer les 4 types de requêtes avec attribut word par défaut', () => {
      const result = generateAllVariationQueries('intentio', true);

      expect(result.mot).toBe('intentio');
      expect(result.requete1).toContain('[word=');
      expect(result.requete2).toContain('[word=');
      expect(result.requete3).toContain('[word=');
      expect(result.requete_medievale).toContain('[word=');
      expect(result.desinence).toBe('pointetoile');
      expect(result.attribute).toBe('word');
    });

    it('devrait générer des requêtes avec attribut lemma', () => {
      const result = generateAllVariationQueries('intentio', true, 'lemma');

      expect(result.mot).toBe('intentio');
      expect(result.requete1).toContain('[lemma=');
      expect(result.requete2).toContain('[lemma=');
      expect(result.requete3).toContain('[lemma=');
      expect(result.requete_medievale).toContain('[lemma=');
      expect(result.attribute).toBe('lemma');
    });

    it('devrait avoir des patterns différents pour chaque type', () => {
      const result = generateAllVariationQueries('intentio', true);

      expect(result.patterns.simple).toBeInstanceOf(Array);
      expect(result.patterns.medium).toBeInstanceOf(Array);
      expect(result.patterns.complex).toBeInstanceOf(Array);
      expect(result.patterns.medieval).toBeInstanceOf(Array);

      // Complex devrait avoir plus de patterns que simple
      expect(result.patterns.complex.length).toBeGreaterThanOrEqual(
        result.patterns.simple.length
      );
    });

    it('devrait gérer le mode sans suffixe', () => {
      const result = generateAllVariationQueries('intentio', false);
      expect(result.desinence).toBe('nothing');
      expect(result.requete1).not.toContain('[A-z]*');
    });

    it('devrait combiner suffixe et attribut lemma', () => {
      const result = generateAllVariationQueries('intentio', false, 'lemma');
      expect(result.desinence).toBe('nothing');
      expect(result.attribute).toBe('lemma');
      expect(result.requete1).toContain('[lemma=');
      expect(result.requete1).not.toContain('[A-z]*');
    });
  });
});
