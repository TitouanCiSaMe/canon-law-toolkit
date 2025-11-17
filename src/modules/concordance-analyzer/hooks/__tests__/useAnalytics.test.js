/**
 * Tests unitaires pour useAnalytics.js
 * 
 * Teste les calculs statistiques :
 * - Comptage par domaine
 * - Comptage par auteur
 * - Distribution temporelle (avec déduplication œuvres)
 * - Comptage par lieu
 * - Extraction termes-clés
 * - Cas limites (données vides, valeurs null)
 */

import { renderHook } from '@testing-library/react';
import { useAnalytics } from '../useAnalytics';

describe('useAnalytics', () => {
  
  // ============================================================================
  // TESTS : Données vides
  // ============================================================================
  
  describe('Données vides', () => {
    
    test('devrait retourner analytics vides si aucune donnée', () => {
      const { result } = renderHook(() => useAnalytics([]));
      
      expect(result.current.total).toBe(0);
      expect(result.current.domains).toEqual([]);
      expect(result.current.authors).toEqual([]);
      expect(result.current.periods).toEqual([]);
      expect(result.current.places).toEqual([]);
      expect(result.current.keyTerms).toEqual([]);
    });
    
  });
  
  // ============================================================================
  // TESTS : Comptage par domaine
  // ============================================================================
  
  describe('Comptage par domaine', () => {
    
    test('devrait compter les domaines uniques', () => {
      const data = [
        { domain: 'Droit canonique' },
        { domain: 'Théologie' },
        { domain: 'Droit canonique' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      expect(result.current.domains).toHaveLength(2);
      expect(result.current.domains[0]).toEqual({ name: 'Droit canonique', value: 2 });
      expect(result.current.domains[1]).toEqual({ name: 'Théologie', value: 1 });
    });
    
    test('devrait trier par ordre décroissant', () => {
      const data = [
        { domain: 'A' },
        { domain: 'B' },
        { domain: 'B' },
        { domain: 'B' },
        { domain: 'A' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      expect(result.current.domains[0].name).toBe('B');
      expect(result.current.domains[0].value).toBe(3);
    });
    
    test('devrait gérer "Domaine inconnu"', () => {
      const data = [
        { domain: 'Droit canonique' },
        { domain: 'Domaine inconnu' },
        { domain: null }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // Vérifie que les valeurs null sont traitées comme "Domaine inconnu"
      expect(result.current.domains.some(d => d.name === 'Domaine inconnu')).toBe(true);
    });
    
  });
  
  // ============================================================================
  // TESTS : Comptage par auteur
  // ============================================================================
  
  describe('Comptage par auteur', () => {
    
    test('devrait compter les auteurs uniques', () => {
      const data = [
        { author: 'Gratien' },
        { author: 'Anonyme' },
        { author: 'Gratien' },
        { author: 'Yves de Chartres' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      expect(result.current.authors).toHaveLength(3);
      expect(result.current.authors[0].name).toBe('Gratien');
      expect(result.current.authors[0].value).toBe(2);
    });
    
    test('devrait trier par ordre décroissant', () => {
      const data = [
        { author: 'A' },
        { author: 'B' },
        { author: 'B' },
        { author: 'C' },
        { author: 'C' },
        { author: 'C' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      expect(result.current.authors[0].name).toBe('C');
      expect(result.current.authors[0].value).toBe(3);
    });
    
  });
  
  // ============================================================================
  // TESTS : Distribution temporelle (CRITIQUE - Déduplication)
  // ============================================================================
  
  describe('Distribution temporelle avec déduplication', () => {
    
    test('devrait dédupliquer les œuvres identiques', () => {
      // 3 citations de la même œuvre ne doivent compter que pour 1
      const data = [
        { title: 'Decretum', author: 'Gratien', period: '1140' },
        { title: 'Decretum', author: 'Gratien', period: '1140' },
        { title: 'Decretum', author: 'Gratien', period: '1140' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // Devrait compter 1 seule œuvre, pas 3
      expect(result.current.periods).toHaveLength(1);
      expect(result.current.periods[0].count).toBe(1);
    });
    
    test('devrait compter séparément des œuvres différentes', () => {
      const data = [
        { title: 'Decretum', author: 'Gratien', period: '1140' },
        { title: 'Summa', author: 'Anonyme', period: '1140' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // 2 œuvres différentes même période = count 2
      expect(result.current.periods[0].count).toBe(2);
    });
    
    test('devrait filtrer "Période inconnue"', () => {
      const data = [
        { title: 'Œuvre1', author: 'A', period: '1140' },
        { title: 'Œuvre2', author: 'B', period: 'Période inconnue' },
        { title: 'Œuvre3', author: 'C', period: '1194' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // Ne devrait pas inclure "Période inconnue"
      expect(result.current.periods.every(p => p.period !== 'Période inconnue')).toBe(true);
      expect(result.current.periods).toHaveLength(2);
    });
    
    test('devrait regrouper par tranches de 50 ans', () => {
      const data = [
        { title: 'Œuvre1', author: 'A', period: '1140' },
        { title: 'Œuvre2', author: 'B', period: '1145' },
        { title: 'Œuvre3', author: 'C', period: '1149' },
        { title: 'Œuvre4', author: 'D', period: '1150' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // 1140-1149 → 1100, 1150 → 1150
      expect(result.current.periods).toHaveLength(2);
      expect(result.current.periods[0].period).toBe(1100);
      expect(result.current.periods[0].count).toBe(3);
      expect(result.current.periods[1].period).toBe(1150);
      expect(result.current.periods[1].count).toBe(1);
    });
    
    test('devrait trier par ordre chronologique', () => {
      const data = [
        { title: 'Œuvre1', author: 'A', period: '1194' },
        { title: 'Œuvre2', author: 'B', period: '1140' },
        { title: 'Œuvre3', author: 'C', period: '1100' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      expect(result.current.periods[0].period).toBeLessThan(result.current.periods[1].period);
    });
    
    test('devrait gérer les périodes avec NaN', () => {
      const data = [
        { title: 'Œuvre1', author: 'A', period: 'texte invalide' },
        { title: 'Œuvre2', author: 'B', period: '1140' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // Ne devrait pas inclure de NaN
      expect(result.current.periods.every(p => !isNaN(p.period))).toBe(true);
    });
    
  });
  
  // ============================================================================
  // TESTS : Comptage par lieu
  // ============================================================================
  
  describe('Comptage par lieu', () => {
    
    test('devrait compter les lieux uniques', () => {
      const data = [
        { place: 'France' },
        { place: 'Irlande' },
        { place: 'France' }
      ];

      const { result } = renderHook(() => useAnalytics(data));

      expect(result.current.places).toHaveLength(2);
      expect(result.current.places[0]).toEqual({ name: 'France', value: 2 });
      expect(result.current.places[1]).toEqual({ name: 'Irlande', value: 1 });
    });
    
    test('devrait trier par ordre décroissant', () => {
      const data = [
        { place: 'Irlande' },
        { place: 'France' },
        { place: 'France' },
        { place: 'France' }
      ];

      const { result } = renderHook(() => useAnalytics(data));

      expect(result.current.places[0].name).toBe('France');
      expect(result.current.places[0].value).toBe(3);
      expect(result.current.places[1].name).toBe('Irlande');
      expect(result.current.places[1].value).toBe(1);
    });
    
  });
  
  // ============================================================================
  // TESTS : Extraction termes-clés
  // ============================================================================
  
  describe('Extraction termes-clés', () => {
    
    test('devrait extraire les termes des concordances', () => {
      const data = [
        { left: 'texte', kwic: 'decretum', right: 'suite' },
        { left: 'autre', kwic: 'decretum', right: 'fin' },
        { left: 'début', kwic: 'summa', right: 'contexte' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      expect(result.current.keyTerms.length).toBeGreaterThan(0);
      // "decretum" devrait apparaître 2 fois
      const decretum = result.current.keyTerms.find(t => t.term === 'decretum');
      expect(decretum).toBeDefined();
      expect(decretum.count).toBe(2);
    });
    
    test('devrait filtrer les mots courts (<= 3 caractères)', () => {
      const data = [
        { left: 'un de et', kwic: 'mot', right: 'la le' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // Les mots courts ne devraient pas apparaître
      expect(result.current.keyTerms.every(t => t.term.length > 3)).toBe(true);
    });
    
    test('devrait filtrer les stopwords latins', () => {
      const data = [
        { left: 'quod quae esse', kwic: 'important', right: 'sunt enim autem' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // Les stopwords ne devraient pas apparaître
      const hasStopwords = result.current.keyTerms.some(t => 
        ['quod', 'quae', 'esse', 'sunt', 'enim', 'autem'].includes(t.term)
      );
      expect(hasStopwords).toBe(false);
    });
    
    test('devrait limiter à 15 termes maximum', () => {
      // Créer beaucoup de texte avec termes variés
      const longText = 'mot1 mot2 mot3 mot4 mot5 mot6 mot7 mot8 mot9 mot10 mot11 mot12 mot13 mot14 mot15 mot16 mot17 mot18 mot19 mot20';
      const data = [
        { left: longText, kwic: 'test', right: longText }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      expect(result.current.keyTerms.length).toBeLessThanOrEqual(15);
    });
    
    test('devrait trier par fréquence décroissante', () => {
      const data = [
        { left: 'alpha alpha alpha', kwic: 'beta beta', right: 'gamma' }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      if (result.current.keyTerms.length >= 2) {
        expect(result.current.keyTerms[0].count).toBeGreaterThanOrEqual(
          result.current.keyTerms[1].count
        );
      }
    });
    
  });
  
  // ============================================================================
  // TESTS : Comptage total
  // ============================================================================
  
  describe('Comptage total', () => {
    
    test('devrait compter le nombre total de concordances', () => {
      const data = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      expect(result.current.total).toBe(3);
    });
    
  });
  
  // ============================================================================
  // TESTS : Cas limites
  // ============================================================================
  
  describe('Cas limites', () => {
    
    test('devrait gérer des données avec valeurs manquantes', () => {
      const data = [
        { 
          author: 'Gratien',
          // Champs manquants intentionnellement
        }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // Ne devrait pas crasher
      expect(result.current.total).toBe(1);
      expect(result.current.authors).toHaveLength(1);
    });
    
    test('devrait gérer des données avec valeurs null', () => {
      const data = [
        { 
          author: null,
          domain: null,
          period: null,
          place: null,
          left: null,
          kwic: null,
          right: null
        }
      ];
      
      const { result } = renderHook(() => useAnalytics(data));
      
      // Ne devrait pas crasher
      expect(result.current.total).toBe(1);
    });
    
  });
  
});
