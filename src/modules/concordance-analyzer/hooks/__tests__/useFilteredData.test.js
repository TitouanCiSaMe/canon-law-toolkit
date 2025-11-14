/**
 * Tests unitaires pour useFilteredData.js
 * 
 * Teste la logique de filtrage multi-critères :
 * - Filtrage par auteurs
 * - Filtrage par domaines
 * - Filtrage par périodes (avec logique complexe)
 * - Filtrage par lieux
 * - Recherche textuelle
 * - Combinaisons de filtres
 */

import { renderHook } from '@testing-library/react';
import { useFilteredData } from '../useFilteredData';

describe('useFilteredData', () => {
  
  // Données de test
  const mockConcordanceData = [
    {
      id: 1,
      author: 'Gratien',
      domain: 'Droit canonique',
      period: '1140',
      place: 'Italie',
      kwic: 'decretum',
      left: 'contexte gauche',
      right: 'contexte droit',
      title: 'Decretum'
    },
    {
      id: 2,
      author: 'Anonyme',
      domain: 'Droit canonique',
      period: '1194',
      place: 'France',
      kwic: 'summa',
      left: 'autre contexte',
      right: 'suite contexte',
      title: 'Summa Induent sancti'
    },
    {
      id: 3,
      author: 'Yves de Chartres',
      domain: 'Droit canonique',
      period: '1100',
      place: 'France',
      kwic: 'panormia',
      left: 'texte avant',
      right: 'texte après',
      title: 'Panormia'
    },
    {
      id: 4,
      author: 'Gratien',
      domain: 'Théologie',
      period: '1145',
      place: 'Rome (Italie)',
      kwic: 'tractatus',
      left: 'début',
      right: 'fin',
      title: 'Tractatus'
    }
  ];
  
  // ============================================================================
  // TESTS : Aucun filtre (retour complet)
  // ============================================================================
  
  describe('Sans filtres', () => {
    
    test('devrait retourner toutes les données si aucun filtre', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(4);
    });
    
    test('devrait retourner tableau vide si données vides', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData([], activeFilters)
      );
      
      expect(result.current).toHaveLength(0);
    });
    
  });
  
  // ============================================================================
  // TESTS : Filtrage par auteur
  // ============================================================================
  
  describe('Filtrage par auteur', () => {
    
    test('devrait filtrer par un seul auteur', () => {
      const activeFilters = {
        authors: ['Gratien'],
        domains: [],
        periods: [],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(2);
      expect(result.current.every(item => item.author === 'Gratien')).toBe(true);
    });
    
    test('devrait filtrer par plusieurs auteurs', () => {
      const activeFilters = {
        authors: ['Gratien', 'Anonyme'],
        domains: [],
        periods: [],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(3);
    });
    
    test('devrait retourner vide si auteur inexistant', () => {
      const activeFilters = {
        authors: ['Auteur Inexistant'],
        domains: [],
        periods: [],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(0);
    });
    
  });
  
  // ============================================================================
  // TESTS : Filtrage par domaine
  // ============================================================================
  
  describe('Filtrage par domaine', () => {
    
    test('devrait filtrer par un seul domaine', () => {
      const activeFilters = {
        authors: [],
        domains: ['Théologie'],
        periods: [],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(1);
      expect(result.current[0].domain).toBe('Théologie');
    });
    
    test('devrait filtrer par plusieurs domaines', () => {
      const activeFilters = {
        authors: [],
        domains: ['Droit canonique', 'Théologie'],
        periods: [],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(4);
    });
    
  });
  
  // ============================================================================
  // TESTS : Filtrage par lieu
  // ============================================================================
  
  describe('Filtrage par lieu', () => {
    
    test('devrait filtrer par un seul lieu', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: ['France'],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(2);
      expect(result.current.every(item => item.place === 'France')).toBe(true);
    });
    
    test('devrait filtrer par plusieurs lieux', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: ['France', 'Italie'],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(3);
    });
    
  });
  
  // ============================================================================
  // TESTS : Filtrage par période (LOGIQUE COMPLEXE)
  // ============================================================================
  
  describe('Filtrage par période', () => {
    
    test('devrait filtrer par plage numérique (1100-1149)', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: ['1100-1149'],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      // Devrait inclure 1100, 1140, 1145
      expect(result.current).toHaveLength(3);
    });
    
    test('devrait filtrer par siècle (XIIe siècle)', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: ['XIIe siècle'],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      // XIIe siècle = 1100-1199
      // Devrait inclure 1100, 1140, 1145, 1194
      expect(result.current).toHaveLength(4);
    });
    
    test('devrait gérer plusieurs périodes', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: ['1100-1149', '1150-1199'],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(4);
    });
    
  });
  
  // ============================================================================
  // TESTS : Recherche textuelle
  // ============================================================================
  
  describe('Recherche textuelle', () => {
    
    test('devrait chercher dans kwic', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: [],
        searchTerm: 'decretum'
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(1);
      expect(result.current[0].kwic).toBe('decretum');
    });
    
    test('devrait chercher dans left', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: [],
        searchTerm: 'autre'
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(1);
    });
    
    test('devrait chercher dans right', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: [],
        searchTerm: 'suite'
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(1);
    });
    
    test('devrait chercher dans author', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: [],
        searchTerm: 'Yves'
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(1);
    });
    
    test('devrait chercher dans title', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: [],
        searchTerm: 'Panormia'
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(1);
    });
    
    test('devrait être insensible à la casse', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: [],
        places: [],
        searchTerm: 'GRATIEN'
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(2);
    });
    
  });
  
  // ============================================================================
  // TESTS : Combinaisons de filtres
  // ============================================================================
  
  describe('Combinaisons de filtres', () => {
    
    test('devrait combiner auteur ET domaine', () => {
      const activeFilters = {
        authors: ['Gratien'],
        domains: ['Droit canonique'],
        periods: [],
        places: [],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe(1);
    });
    
    test('devrait combiner période ET lieu', () => {
      const activeFilters = {
        authors: [],
        domains: [],
        periods: ['1100-1149'],
        places: ['France'],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe(3);
    });
    
    test('devrait combiner tous les filtres', () => {
      const activeFilters = {
        authors: ['Gratien'],
        domains: ['Droit canonique'],
        periods: ['1100-1149'],
        places: ['Italie'],
        searchTerm: 'decretum'
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(1);
      expect(result.current[0].id).toBe(1);
    });
    
    test('devrait retourner vide si combinaison impossible', () => {
      const activeFilters = {
        authors: ['Gratien'],
        domains: ['Théologie'],
        periods: [],
        places: ['France'],
        searchTerm: ''
      };
      
      const { result } = renderHook(() => 
        useFilteredData(mockConcordanceData, activeFilters)
      );
      
      expect(result.current).toHaveLength(0);
    });
    
  });
  
});
