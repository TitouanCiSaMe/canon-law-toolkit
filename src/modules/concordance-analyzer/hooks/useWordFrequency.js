// src/components/hook/useWordFrequency.js

import { useMemo } from 'react';

/**
 * Hook personnalisé pour calculer la fréquence des termes KWIC
 * 
 * Extrait tous les termes KWIC des données et calcule leur fréquence d'apparition.
 * Retourne un tableau formaté pour react-wordcloud avec possibilité de limiter
 * au top N mots les plus fréquents.
 * 
 * @param {Array<Object>} data - Données contenant les concordances
 * @param {string} data[].kwic - Terme KWIC (mot-clé en contexte)
 * @param {number} [limit=100] - Nombre maximum de mots à retourner (défaut: 100, -1 pour tous)
 * 
 * @returns {Object} Objet contenant les données de fréquence et statistiques
 * @returns {Array<{text: string, value: number}>} returns.wordData - Données formatées pour wordcloud
 * @returns {number} returns.totalWords - Nombre total d'occurrences de mots
 * @returns {number} returns.uniqueWords - Nombre de mots uniques
 * @returns {Object} returns.topWord - Mot le plus fréquent {text, value}
 * @returns {Array<{text: string, value: number}>} returns.allWords - Tous les mots (non limité)
 * 
 * @example
 * // Utilisation basique avec limite au top 50
 * const { wordData, totalWords, uniqueWords } = useWordFrequency(filteredData, 50);
 * 
 * @example
 * // Obtenir tous les mots sans limite
 * const { wordData } = useWordFrequency(filteredData, -1);
 * 
 * @example
 * // Accéder au mot le plus fréquent
 * const { topWord } = useWordFrequency(filteredData);
 * console.log(`Mot le plus fréquent: ${topWord.text} (${topWord.value} fois)`);
 */
const useWordFrequency = (data = [], limit = 100) => {
  /**
   * Calcul des fréquences avec useMemo pour éviter recalculs inutiles
   * Se recalcule uniquement si data ou limit change
   */
  const frequencyData = useMemo(() => {
    // Si pas de données, retourner structure vide
    if (!data || data.length === 0) {
      return {
        wordData: [],
        allWords: [],
        totalWords: 0,
        uniqueWords: 0,
        topWord: null,
      };
    }

    // Map pour compter les fréquences
    const frequencyMap = new Map();
    let totalCount = 0;

    // Parcourir toutes les concordances et compter les KWIC
    data.forEach((item) => {
      if (item.kwic) {
        // Normaliser le terme KWIC (minuscules, trim)
        const term = item.kwic.trim().toLowerCase();
        
        // Ignorer les termes vides ou trop courts (< 2 caractères)
        if (term.length < 2) {
          return;
        }

        // Incrémenter le compteur
        const currentCount = frequencyMap.get(term) || 0;
        frequencyMap.set(term, currentCount + 1);
        totalCount++;
      }
    });

    // Convertir la Map en tableau d'objets {text, value}
    const allWords = Array.from(frequencyMap.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value); // Trier par fréquence décroissante

    // Limiter au top N si demandé
    const wordData = limit === -1 ? allWords : allWords.slice(0, limit);

    // Statistiques
    const uniqueWords = allWords.length;
    const topWord = allWords.length > 0 ? allWords[0] : null;

    return {
      wordData,      // Données limitées (pour affichage)
      allWords,      // Toutes les données (pour stats)
      totalWords: totalCount,
      uniqueWords,
      topWord,
    };
  }, [data, limit]);

  return frequencyData;
};

export default useWordFrequency;
