/**
 * Tests unitaires pour metadataParser.js
 * 
 * Tests basés sur la structure réelle du fichier Export_Métadones.csv
 * Headers réels: Identifiant interne, Title Edition, Title Oeuvre, 
 *                Person Record Title, Date, Date (temporal),
 *                Lieu ou aire géographique de rédaction,
 *                Has edited (Oeuvre) Record Title, Type de droit
 */

import {
  parseMetadataFile,
  extractPeriodFromDate,
  parseMultipleValues,
  parseLocationValues
} from '../metadataParser';

describe('metadataParser', () => {
  
  // ============================================================================
  // TESTS : extractPeriodFromDate()
  // ============================================================================
  
  describe('extractPeriodFromDate', () => {
    
    test('devrait extraire une année simple', () => {
      expect(extractPeriodFromDate('1140')).toBe('1140');
      expect(extractPeriodFromDate('1194')).toBe('1194');
      expect(extractPeriodFromDate('1250')).toBe('1250');
    });
    
    test('devrait extraire une plage de dates', () => {
      expect(extractPeriodFromDate('1100 to 1149')).toBe('1100-1149');
      expect(extractPeriodFromDate('1150 to 1199')).toBe('1150-1199');
      expect(extractPeriodFromDate('1200 to 1249')).toBe('1200-1249');
    });
    
    test('devrait gérer les dates invalides', () => {
      expect(extractPeriodFromDate('')).toBe('Période inconnue');
      expect(extractPeriodFromDate('invalid temporal object')).toBe('Période inconnue');
      expect(extractPeriodFromDate('abc')).toBe('Période inconnue');
      expect(extractPeriodFromDate(null)).toBe('Période inconnue');
    });
    
    test('devrait extraire une année depuis une chaîne complexe', () => {
      expect(extractPeriodFromDate('circa 1140')).toBe('1140');
      expect(extractPeriodFromDate('année 1194 environ')).toBe('1194');
      expect(extractPeriodFromDate('vers 1250')).toBe('1250');
    });
    
    test('devrait gérer les pipes et espaces', () => {
      expect(extractPeriodFromDate('| 1140 |')).toBe('1140');
      expect(extractPeriodFromDate('  1194  ')).toBe('1194');
      expect(extractPeriodFromDate('||1250||')).toBe('1250');
    });
    
    test('devrait prendre la première année si plusieurs', () => {
      expect(extractPeriodFromDate('1140 1194')).toBe('1140');
    });
    
  });
  
  // ============================================================================
  // TESTS : parseMultipleValues()
  // ============================================================================
  
  describe('parseMultipleValues', () => {
    
    test('devrait retourner une valeur unique', () => {
      expect(parseMultipleValues('Gratien')).toBe('Gratien');
      expect(parseMultipleValues('Yves de Chartres')).toBe('Yves de Chartres');
      expect(parseMultipleValues('Pierre Lombard')).toBe('Pierre Lombard');
    });
    
    test('devrait dédupliquer les valeurs identiques', () => {
      expect(parseMultipleValues('Gratien|Gratien')).toBe('Gratien');
      expect(parseMultipleValues('Yves|Yves|Yves')).toBe('Yves');
      expect(parseMultipleValues('Pierre|Pierre')).toBe('Pierre');
    });
    
    test('devrait joindre plusieurs valeurs uniques avec /', () => {
      expect(parseMultipleValues('Gratien|Yves de Chartres'))
        .toBe('Gratien / Yves de Chartres');
      expect(parseMultipleValues('Auteur1|Auteur2|Auteur3'))
        .toBe('Auteur1 / Auteur2 / Auteur3');
    });
    
    test('devrait gérer les valeurs vides et retourner Anonyme', () => {
      expect(parseMultipleValues('')).toBe('Anonyme');
      expect(parseMultipleValues('Anonyme')).toBe('Anonyme');
      expect(parseMultipleValues('||')).toBe('Anonyme');
      expect(parseMultipleValues('   ')).toBe('Anonyme');
    });
    
    test('devrait nettoyer les espaces autour des pipes', () => {
      expect(parseMultipleValues('  Gratien  |  Yves  '))
        .toBe('Gratien / Yves');
      expect(parseMultipleValues(' Pierre | Lombard '))
        .toBe('Pierre / Lombard');
    });
    
    test('devrait filtrer les valeurs vides entre pipes', () => {
      expect(parseMultipleValues('Gratien||Yves')).toBe('Gratien / Yves');
      expect(parseMultipleValues('||Pierre||')).toBe('Pierre');
    });
    
  });
  
  // ============================================================================
  // TESTS : parseLocationValues()
  // ============================================================================
  
  describe('parseLocationValues', () => {
    
    test('devrait retourner une valeur unique', () => {
      expect(parseLocationValues('Paris')).toBe('Paris');
      expect(parseLocationValues('France')).toBe('France');
      expect(parseLocationValues('Lyon')).toBe('Lyon');
    });
    
    test('devrait combiner ville et pays avec parenthèses', () => {
      expect(parseLocationValues('Paris|France')).toBe('Paris (France)');
      expect(parseLocationValues('Lyon|France')).toBe('Lyon (France)');
      expect(parseLocationValues('Rome|Italie')).toBe('Rome (Italie)');
    });
    
    test('devrait marquer les villes multiples comme incertaines', () => {
      const result = parseLocationValues('Paris|Lyon|France');
      expect(result).toContain('Paris / Lyon');
      expect(result).toContain('incertain');
    });
    
    test('devrait marquer les pays multiples comme incertains', () => {
      const result = parseLocationValues('France|Angleterre');
      expect(result).toContain('France / Angleterre');
      expect(result).toContain('incertain');
    });
    
    test('devrait gérer les valeurs vides', () => {
      expect(parseLocationValues('')).toBe('Lieu inconnu');
      expect(parseLocationValues('Lieu inconnu')).toBe('Lieu inconnu');
      expect(parseLocationValues('||')).toBe('Lieu inconnu');
    });
    
    test('devrait identifier correctement les pays européens', () => {
      expect(parseLocationValues('Paris|France')).toBe('Paris (France)');
      expect(parseLocationValues('Londres|Angleterre')).toBe('Londres (Angleterre)');
      expect(parseLocationValues('Rome|Italie')).toBe('Rome (Italie)');
      expect(parseLocationValues('Madrid|Espagne')).toBe('Madrid (Espagne)');
    });
    
  });
  
  // ============================================================================
  // TESTS : parseMetadataFile()
  // ============================================================================
  
  describe('parseMetadataFile', () => {
    
    // Headers RÉELS du fichier Export_Métadones.csv
    const realHeaders = [
      'Identifiant interne',
      'Title Edition',
      'Title Oeuvre',
      'Person Record Title',
      'Date',
      'Date (temporal)',
      'Lieu ou aire géographique de rédaction',
      'Has edited (Oeuvre) Record Title',
      'Type de droit'
    ];
    
    test('devrait parser un CSV avec la structure réelle', () => {
      const csvData = [
        realHeaders,
        ['Edi-25', 'Edition Test', 'Oeuvre Test', 'Anonyme', '1194', '1194', 'France', 'Summa Induent sancti', 'Droit canonique']
      ];
      
      const result = parseMetadataFile(csvData);
      
      expect(result['Edi-25']).toBeDefined();
      expect(result['Edi-25'].author).toBe('Anonyme');
      expect(result['Edi-25'].title).toBe('Summa Induent sancti');
      expect(result['Edi-25'].period).toBe('1194');
      expect(result['Edi-25'].place).toBe('France');
      expect(result['Edi-25'].domain).toBe('Droit canonique');
      expect(result['Edi-25'].page).toBeNull();
    });
    
    test('devrait parser plusieurs entrées', () => {
      const csvData = [
        realHeaders,
        ['Edi-25', 'Ed1', 'Oeuvre1', 'Anonyme', '1194', '1194', 'France', 'Summa Induent sancti', 'Droit canonique'],
        ['Edi-30', 'Ed2', 'Oeuvre2', 'Gratien', '1140', '1140', 'Italie', 'Decretum', 'Droit canonique'],
        ['Edi-42', 'Ed3', 'Oeuvre3', 'Yves de Chartres', '1100 to 1149', '1100-1149', 'France', 'Panormia', 'Droit canonique']
      ];
      
      const result = parseMetadataFile(csvData);
      
      expect(Object.keys(result).length).toBe(3);
      expect(result['Edi-25']).toBeDefined();
      expect(result['Edi-30']).toBeDefined();
      expect(result['Edi-42']).toBeDefined();
      
      expect(result['Edi-30'].author).toBe('Gratien');
      expect(result['Edi-30'].title).toBe('Decretum');
      
      expect(result['Edi-42'].period).toBe('1100-1149');
    });
    
    test('devrait gérer les lignes vides ou incomplètes', () => {
      const csvData = [
        realHeaders,
        ['Edi-25', 'Ed1', 'Oeuvre1', 'Anonyme', '1194', '1194', 'France', 'Summa', 'Droit canonique'],
        ['', '', '', '', '', '', '', '', ''],
        ['Edi-30', 'Ed2', 'Oeuvre2', 'Gratien', '1140', '1140', 'Italie', 'Decretum', 'Droit canonique']
      ];
      
      const result = parseMetadataFile(csvData);
      
      // La ligne vide ne devrait pas créer d'entrée
      expect(Object.keys(result).length).toBe(2);
      expect(result['Edi-25']).toBeDefined();
      expect(result['Edi-30']).toBeDefined();
    });
    
    test('devrait appliquer les fallbacks pour valeurs manquantes', () => {
      const csvData = [
        realHeaders,
        ['Edi-25', '', '', '', '', '', '', '', '']
      ];
      
      const result = parseMetadataFile(csvData);
      
      expect(result['Edi-25']).toBeDefined();
      expect(result['Edi-25'].author).toBe('Anonyme');
      expect(result['Edi-25'].title).toBe('Titre inconnu');
      expect(result['Edi-25'].period).toBe('Période inconnue');
      expect(result['Edi-25'].place).toBe('Lieu inconnu');
      expect(result['Edi-25'].domain).toBe('Domaine inconnu');
    });
    
    test('devrait gérer les valeurs multiples avec pipes', () => {
      const csvData = [
        realHeaders,
        ['Edi-25', 'Ed1', 'Oeuvre1', 'Gratien|Yves', '1140', '1140', 'Paris|France', 'Decretum|Panormia', 'Droit canonique']
      ];
      
      const result = parseMetadataFile(csvData);
      
      expect(result['Edi-25'].author).toBe('Gratien / Yves');
      expect(result['Edi-25'].place).toBe('Paris (France)');
    });
    
    test('devrait lever une erreur si headers absents', () => {
      const csvData = [
        ['Edi-25', 'Ed1', 'Oeuvre1', 'Anonyme', '1194', '1194', 'France', 'Summa', 'Droit canonique']
      ];
      
      expect(() => parseMetadataFile(csvData)).toThrow('En-têtes non trouvés');
    });
    
    test('devrait gérer les headers avec espaces et casse différente', () => {
      const csvData = [
        [' Identifiant interne ', 'Title Edition', 'Title Oeuvre', 'Person Record Title', 'Date', 'Date (temporal)', 'Lieu ou aire géographique de rédaction', 'Has edited (Oeuvre) Record Title', 'Type de droit'],
        ['Edi-25', 'Ed1', 'Oeuvre1', 'Anonyme', '1194', '1194', 'France', 'Summa', 'Droit canonique']
      ];
      
      const result = parseMetadataFile(csvData);
      
      expect(result['Edi-25']).toBeDefined();
      expect(result['Edi-25'].author).toBe('Anonyme');
    });
    
  });
  
});
