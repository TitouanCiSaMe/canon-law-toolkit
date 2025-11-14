/**
 * Hook personnalisé pour filtrer les concordances
 * 
 * Ce hook gère tous les types de filtres applicables aux concordances :
 * - Auteurs (sélection multiple)
 * - Domaines (sélection multiple)
 * - Périodes (avec logique complexe : plages, siècles, correspondance exacte)
 * - Lieux (sélection multiple)
 * - Recherche textuelle (dans left, kwic, right, author, title)
 * 
 * Le hook utilise useMemo pour optimiser les performances en recalculant
 * les données filtrées uniquement quand les données sources ou les filtres changent.
 * 
 * @module hooks/useFilteredData
 */

import { useMemo } from 'react';

/**
 * Filtre les concordances selon les critères actifs
 * 
 * Applique tous les filtres actifs de manière combinée (AND logique).
 * Une concordance doit satisfaire TOUS les filtres pour être incluse dans le résultat.
 * 
 * Types de filtres supportés :
 * - **Auteurs** : Filtre par correspondance exacte avec activeFilters.authors
 * - **Domaines** : Filtre par correspondance exacte avec activeFilters.domains
 * - **Lieux** : Filtre par correspondance exacte avec activeFilters.places
 * - **Périodes** : Logique complexe supportant :
 *   - Plages numériques (ex: "1100-1149")
 *   - Siècles nommés (ex: "XIIe siècle")
 *   - Correspondance exacte
 * - **Recherche textuelle** : Recherche insensible à la casse dans tous les champs textuels
 * 
 * @param {Array<Object>} concordanceData - Données brutes des concordances
 *                                          Chaque objet doit contenir :
 *                                          - {string} author - Auteur de l'œuvre
 *                                          - {string} domain - Domaine juridique
 *                                          - {string} period - Période (format libre)
 *                                          - {string} place - Lieu de rédaction
 *                                          - {string} left - Contexte gauche
 *                                          - {string} kwic - Terme recherché
 *                                          - {string} right - Contexte droit
 *                                          - {string} title - Titre de l'œuvre
 * 
 * @param {Object} activeFilters - Filtres actifs contenant :
 *                                 - {Array<string>} authors - Liste des auteurs sélectionnés
 *                                 - {Array<string>} domains - Liste des domaines sélectionnés
 *                                 - {Array<string>} periods - Liste des périodes sélectionnées
 *                                 - {Array<string>} places - Liste des lieux sélectionnés
 *                                 - {string} searchTerm - Terme de recherche textuelle
 * 
 * @returns {Array<Object>} Données filtrées (sous-ensemble de concordanceData)
 * 
 * @example
 * const activeFilters = {
 *   authors: ['Gratien'],
 *   domains: [],
 *   periods: ['XIIe siècle'],
 *   places: [],
 *   searchTerm: 'ecclesia'
 * };
 * 
 * const filteredData = useFilteredData(concordanceData, activeFilters);
 * // Retourne uniquement les concordances de Gratien du XIIe siècle
 * // contenant le mot "ecclesia"
 * 
 * @example
 * // Sans filtres actifs
 * const noFilters = {
 *   authors: [],
 *   domains: [],
 *   periods: [],
 *   places: [],
 *   searchTerm: ''
 * };
 * 
 * const allData = useFilteredData(concordanceData, noFilters);
 * // Retourne toutes les concordances (aucun filtre appliqué)
 */
export const useFilteredData = (concordanceData, activeFilters) => {
  return useMemo(() => {
    if (!concordanceData.length) return [];
    
    return concordanceData.filter(item => {
      // ============================================================================
      // FILTRE PAR AUTEURS
      // ============================================================================
      if (activeFilters.authors.length > 0 && !activeFilters.authors.includes(item.author)) {
        return false;
      }
      
      // ============================================================================
      // FILTRE PAR DOMAINES
      // ============================================================================
      if (activeFilters.domains.length > 0 && !activeFilters.domains.includes(item.domain)) {
        return false;
      }
      
      // ============================================================================
      // FILTRE PAR LIEUX
      // ============================================================================
      if (activeFilters.places.length > 0 && !activeFilters.places.includes(item.place)) {
        return false;
      }
      
      // ============================================================================
      // FILTRE PAR PÉRIODE (logique complexe)
      // ============================================================================
      if (activeFilters.periods.length > 0) {
        const itemPeriod = item.period;
        const matchesPeriod = activeFilters.periods.some(filterPeriod => {
          // Gestion des plages numériques (ex: "1100-1149")
          if (/^\d{4}-\d{4}$/.test(filterPeriod)) {
            const [start, end] = filterPeriod.split('-').map(Number);
            const itemYear = parseInt(item.period.match(/\d{4}/)?.[0] || '0');
            return itemYear >= start && itemYear <= end;
          }
          // Gestion des siècles (ex: "XIIe siècle")
          else if (filterPeriod.includes('siècle')) {
            const centuryMap = {
              'XIe siècle': [1000, 1099],
              'XIIe siècle': [1100, 1199], 
              'XIIIe siècle': [1200, 1299]
            };
            
            if (centuryMap[filterPeriod]) {
              const [start, end] = centuryMap[filterPeriod];
              const itemYear = parseInt(item.period.match(/\d{4}/)?.[0] || '0');
              return itemYear >= start && itemYear <= end;
            }
          }
          // Correspondance exacte
          return itemPeriod === filterPeriod;
        });
        
        if (!matchesPeriod) return false;
      }
      
      // ============================================================================
      // FILTRE PAR RECHERCHE TEXTUELLE
      // ============================================================================
      if (activeFilters.searchTerm) {
        const searchLower = activeFilters.searchTerm.toLowerCase();
        const matchesSearch = 
          item.kwic.toLowerCase().includes(searchLower) ||
          item.left.toLowerCase().includes(searchLower) ||
          item.right.toLowerCase().includes(searchLower) ||
          item.author.toLowerCase().includes(searchLower) ||
          item.title.toLowerCase().includes(searchLower);
          
        if (!matchesSearch) return false;
      }
      
      return true;
    });
  }, [concordanceData, activeFilters]);
};
