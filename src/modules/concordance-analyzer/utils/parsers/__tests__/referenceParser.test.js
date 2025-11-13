/**
 * Tests unitaires pour referenceParser.js
 * 
 * Teste :
 * - parseReferenceWithLookup() - Parsing avec lookup
 * - parseReferenceByContent() - Parsing sans lookup (fallback)
 * - extractPageFromReference() - Extraction page
 * - cleanText() - Nettoyage texte
 */

import {
  parseReferenceWithLookup,
  parseReferenceByContent,
  extractPageFromReference,
  cleanText
} from '../referenceParser';

describe('referenceParser', () => {
  
  // ============================================================================
  // TESTS : cleanText()
  // ============================================================================
  
  describe('cleanText', () => {
    
    test('devrait supprimer les marqueurs NoSketch', () => {
      expect(cleanText('|| ==> texte ici')).toBe('texte ici');
      expect(cleanText('texte || ==> suite')).toBe('texte suite');
    });
    
    test('devrait normaliser les espaces multiples', () => {
      expect(cleanText('texte    avec     espaces')).toBe('texte avec espaces');
      expect(cleanText('un  deux   trois')).toBe('un deux trois');
    });
    
    test('devrait supprimer les guillemets en début/fin', () => {
      expect(cleanText('"texte"')).toBe('texte');
      expect(cleanText("'texte'")).toBe('texte');
      expect(cleanText('"texte au milieu" reste')).toBe('texte au milieu" reste');
    });
    
    test('devrait nettoyer les espaces en début/fin', () => {
      expect(cleanText('  texte  ')).toBe('texte');
      expect(cleanText('\n\ttexte\t\n')).toBe('texte');
    });
    
    test('devrait gérer les chaînes vides', () => {
      expect(cleanText('')).toBe('');
      expect(cleanText('   ')).toBe('');
    });
    
    test('devrait combiner plusieurs nettoyages', () => {
      // cleanText supprime les guillemets seulement en début/fin après autres nettoyages
      expect(cleanText('  || ==> texte    ici  ')).toBe('texte ici');
      expect(cleanText('"texte    multiple"')).toBe('texte multiple');
    });
    
  });
  
  // ============================================================================
  // TESTS : extractPageFromReference()
  // ============================================================================
  
  describe('extractPageFromReference', () => {
    
    test('devrait extraire la page depuis référence simple', () => {
      expect(extractPageFromReference('Edi-25, Summa, 1194, 53')).toBe(53);
      expect(extractPageFromReference('Edi-30, Decretum, 1140, 42')).toBe(42);
    });
    
    test('devrait extraire la page avec période', () => {
      expect(extractPageFromReference('Edi-25, 1140-1149, 42')).toBe(42);
      expect(extractPageFromReference('Edi-30, 1100-1199, 67')).toBe(67);
    });
    
    test('devrait extraire la page en dernière position', () => {
      expect(extractPageFromReference('Edi-25, Summa, France, 1194, 53')).toBe(53);
      expect(extractPageFromReference('Edi-30, Title, Place, 1140, 99')).toBe(99);
    });
    
    test('devrait ignorer les identifiants Edi-XX', () => {
      expect(extractPageFromReference('Edi-25, 53')).toBe(53);
      expect(extractPageFromReference('Edi-100, 42')).toBe(42);
    });
    
    test('devrait privilégier les nombres < 100', () => {
      // Si plusieurs nombres, privilégier page (< 100) plutôt qu'année
      expect(extractPageFromReference('Edi-25, 1194, 53')).toBe(53);
      expect(extractPageFromReference('Edi-30, 1140, 42')).toBe(42);
    });
    
    test('devrait retourner null si aucun nombre trouvé', () => {
      expect(extractPageFromReference('Edi-25, Summa, France')).toBeNull();
      expect(extractPageFromReference('Texte sans nombre')).toBeNull();
    });
    
    test('devrait gérer les références complexes', () => {
      expect(extractPageFromReference('Edi-25, Summa Induent sancti, 1194, France, 53')).toBe(53);
    });
    
  });
  
  // ============================================================================
  // TESTS : parseReferenceByContent()
  // ============================================================================
  
  describe('parseReferenceByContent', () => {
    
    test('devrait parser une référence simple', () => {
      const result = parseReferenceByContent('Summa, 1194, France, 53');
      
      expect(result.title).toBe('Summa');
      // La fonction ne détecte que les plages (XXXX-YYYY) ou années dans chaîne
      // Une année seule (1194) au milieu n'est pas détectée comme période
      expect(result.period).toBe('Période inconnue');
      expect(result.fromLookup).toBe(false);
    });
    
    test('devrait détecter une période dans la référence', () => {
      const result = parseReferenceByContent('Title, 1140-1149, 42');
      
      expect(result.period).toBe('1140-1149');
      expect(result.fromLookup).toBe(false);
    });
    
    test('devrait utiliser des fallbacks par défaut', () => {
      const result = parseReferenceByContent('SimpleText');
      
      expect(result.author).toBe('Anonyme');
      expect(result.place).toBe('Lieu inconnu');
      expect(result.domain).toBe('Domaine inconnu');
      expect(result.page).toBeNull();
      expect(result.fromLookup).toBe(false);
    });
    
    test('devrait prendre le premier élément comme titre', () => {
      const result = parseReferenceByContent('Premier, 1194, Troisieme');
      
      expect(result.title).toBe('Premier');
    });
    
    test('devrait gérer les références vides', () => {
      const result = parseReferenceByContent('');
      
      expect(result.author).toBe('Anonyme');
      expect(result.title).toBe('Titre inconnu');
      expect(result.period).toBe('Période inconnue');
    });
    
  });
  
  // ============================================================================
  // TESTS : parseReferenceWithLookup()
  // ============================================================================
  
  describe('parseReferenceWithLookup', () => {
    
    // Mock lookup pour les tests
    const mockLookup = {
      'Edi-25': {
        author: 'Anonyme',
        title: 'Summa Induent sancti',
        period: '1194',
        place: 'France',
        domain: 'Droit canonique',
        page: null
      },
      'Edi-30': {
        author: 'Gratien',
        title: 'Decretum',
        period: '1140',
        place: 'Italie',
        domain: 'Droit canonique',
        page: null
      }
    };
    
    test('devrait utiliser le lookup si Edi-XX trouvé', () => {
      const result = parseReferenceWithLookup('Edi-25, Summa, 1194, 53', mockLookup);
      
      expect(result.author).toBe('Anonyme');
      expect(result.title).toBe('Summa Induent sancti');
      expect(result.period).toBe('1194');
      expect(result.place).toBe('France');
      expect(result.domain).toBe('Droit canonique');
      expect(result.page).toBe(53);
      expect(result.fromLookup).toBe(true);
      expect(result.ediId).toBe('Edi-25');
    });
    
    test('devrait extraire la page depuis la référence', () => {
      const result = parseReferenceWithLookup('Edi-30, 1140, 42', mockLookup);
      
      expect(result.author).toBe('Gratien');
      expect(result.title).toBe('Decretum');
      expect(result.page).toBe(42);
      expect(result.fromLookup).toBe(true);
    });
    
    test('devrait utiliser fallback si Edi-XX non trouvé dans lookup', () => {
      const result = parseReferenceWithLookup('Edi-99, Title, 1200, 50', mockLookup);
      
      expect(result.fromLookup).toBe(false);
      expect(result.author).toBe('Anonyme');
      expect(result.title).toBe('Edi-99');
    });
    
    test('devrait utiliser fallback si pas de Edi-XX', () => {
      const result = parseReferenceWithLookup('Summa, 1194, 53', mockLookup);
      
      expect(result.fromLookup).toBe(false);
      expect(result.title).toBe('Summa');
    });
    
    test('devrait gérer lookup vide', () => {
      const result = parseReferenceWithLookup('Edi-25, Title, 1194, 53', {});
      
      expect(result.fromLookup).toBe(false);
      expect(result.author).toBe('Anonyme');
    });
    
    test('devrait préserver toutes les métadonnées du lookup', () => {
      const result = parseReferenceWithLookup('Edi-30, 1140, 67', mockLookup);
      
      expect(result.author).toBe('Gratien');
      expect(result.title).toBe('Decretum');
      expect(result.period).toBe('1140');
      expect(result.place).toBe('Italie');
      expect(result.domain).toBe('Droit canonique');
      expect(result.page).toBe(67);
      expect(result.ediId).toBe('Edi-30');
    });
    
    test('devrait gérer références complexes avec lookup', () => {
      const result = parseReferenceWithLookup('Edi-25, Summa Induent sancti, 1194, France, 53', mockLookup);
      
      expect(result.fromLookup).toBe(true);
      expect(result.page).toBe(53);
    });
    
  });
  
});
