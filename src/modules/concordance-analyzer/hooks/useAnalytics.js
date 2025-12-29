/**
 * Hook personnalisé pour calculer les analytics des concordances
 *
 * Ce hook calcule automatiquement toutes les statistiques nécessaires
 * pour l'affichage des graphiques et vues analytiques :
 * - Répartition par domaines (comptage et tri)
 * - Répartition par auteurs (comptage et tri)
 * - Distribution temporelle par périodes (avec déduplication des œuvres)
 * - Répartition géographique PAR PAYS UNIQUEMENT (comptage et tri)
 * - Termes-clés les plus fréquents (extraction et comptage)
 *
 * Le hook utilise useMemo pour optimiser les performances en recalculant
 * les analytics uniquement quand les données filtrées changent.
 *
 * @module hooks/useAnalytics
 */

import { useMemo } from 'react';

// ============================================================================
// CONSTANTES DE PERFORMANCE - Définies une seule fois au niveau module
// ============================================================================
// Set pour lookup O(1) au lieu de array.includes() O(n)
const STOPWORDS = new Set([
  'quod', 'quae', 'esse', 'sunt', 'enim', 'autem', 'vero', 'etiam'
]);

/**
 * Calcule les analytics complètes des concordances filtrées
 * 
 * Traite les données filtrées pour générer des statistiques exploitables
 * par les différents composants de visualisation (charts, views).
 * 
 * Points importants :
 * - **Déduplication des périodes** : Compte chaque œuvre une seule fois
 *   (identifiée par title + author + period) pour éviter de compter plusieurs
 *   fois la même œuvre si elle a plusieurs concordances
 * - **Normalisation des périodes** : Regroupe par tranches de 50 ans
 * - **Extraction des pays** : Extrait uniquement le pays depuis le champ lieu
 *   (ex: "Paris, France" → "France")
 * - **Filtrage des termes-clés** : Exclut les mots trop courts (<4 lettres)
 *   et les mots communs du latin
 * 
 * @param {Array<Object>} filteredData - Données filtrées des concordances
 *                                       Chaque objet doit contenir :
 *                                       - {string} domain - Domaine juridique
 *                                       - {string} author - Auteur de l'œuvre
 *                                       - {string} period - Période
 *                                       - {string} place - Lieu de rédaction (format: "Ville, Pays")
 *                                       - {string} title - Titre de l'œuvre
 *                                       - {string} left - Contexte gauche
 *                                       - {string} kwic - Terme recherché
 *                                       - {string} right - Contexte droit
 * 
 * @returns {Object} Analytics calculées contenant :
 *                   - {number} total - Nombre total de concordances
 *                   - {Array<Object>} domains - Répartition par domaines
 *                     [{name: string, value: number}] triée par value DESC
 *                   - {Array<Object>} authors - Répartition par auteurs
 *                     [{name: string, value: number}] triée par value DESC
 *                   - {Array<Object>} periods - Distribution temporelle
 *                     [{period: number, count: number}] triée par period ASC
 *                     (périodes regroupées par 50 ans, ex: 1100, 1150, 1200)
 *                   - {Array<Object>} places - Répartition géographique PAR PAYS
 *                     [{name: string, value: number}] triée par value DESC
 *                   - {Array<Object>} keyTerms - Termes-clés les plus fréquents (top 15)
 *                     [{term: string, count: number}] triée par count DESC
 * 
 * @example
 * const filteredData = [
 *   { domain: 'Droit canonique', author: 'Gratien', period: '1140', place: 'Bologne, Italie', ... },
 *   { domain: 'Droit canonique', author: 'Gratien', period: '1140', place: 'Paris, France', ... },
 *   { domain: 'Droit romain', author: 'Anonyme', period: '1194', place: 'France', ... }
 * ];
 * 
 * const analytics = useAnalytics(filteredData);
 * console.log(analytics.total); // 3
 * console.log(analytics.domains); // [{ name: 'Droit canonique', value: 2 }, ...]
 * console.log(analytics.places); // [{ name: 'France', value: 2 }, { name: 'Italie', value: 1 }]
 * 
 * @example
 * // Avec données vides
 * const emptyAnalytics = useAnalytics([]);
 * console.log(emptyAnalytics.total); // 0
 * console.log(emptyAnalytics.places); // []
 */
export const useAnalytics = (filteredData) => {
  return useMemo(() => {
    if (!filteredData.length) {
      return {
        total: 0,
        domains: [],
        authors: [],
        periods: [],
        places: [],
        keyTerms: []
      };
    }

    // ============================================================================
    // COMPTAGE PAR DOMAINE
    // ============================================================================
    const domainCounts = {};
    filteredData.forEach(item => {
      const domain = item.domain || 'Domaine inconnu';
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    // ============================================================================
    // COMPTAGE PAR AUTEUR
    // ============================================================================
    const authorCounts = {};
    filteredData.forEach(item => {
      const author = item.author || 'Anonyme';
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });

    // ============================================================================
    // COMPTAGE PAR PÉRIODE (AVEC DÉDUPLICATION PAR ŒUVRE)
    // ============================================================================
    // Étape 1 : Créer un Set d'œuvres uniques (identifiées par title + author + period)
    const uniqueWorks = new Map();

    filteredData.forEach(item => {
      // Créer une clé unique pour identifier l'œuvre
      const workKey = `${item.title}|||${item.author}|||${item.period}`;
  
      // Si l'œuvre n'existe pas encore dans le Map, l'ajouter
      if (!uniqueWorks.has(workKey)) {
        uniqueWorks.set(workKey, {
          title: item.title,
          author: item.author,
          period: item.period
        });
      }
    });

    // Étape 2 : Compter par période depuis les œuvres uniques
    const periodCounts = {};

    uniqueWorks.forEach(work => {
      let period = work.period;
  
      // Normalisation des périodes
      if (period && period !== 'Période inconnue') {
        // Extraire l'année de début pour le regroupement
        const yearMatch = period.match(/(\d{4})/);
        if (yearMatch) {
          const year = parseInt(yearMatch[1]);
          // Regrouper par tranches de 50 ans
          const periodStart = Math.floor(year / 50) * 50;
          period = periodStart.toString();
        }
      } else {
        period = 'Période inconnue';
      }
  
      periodCounts[period] = (periodCounts[period] || 0) + 1;
    });

	// ============================================================================
	// COMPTAGE PAR PAYS (UNIQUEMENT PAYS AUTORISÉS)
	// ============================================================================
	// Liste blanche des pays autorisés
	const PAYS_AUTORISES = ['France', 'Irlande', 'Angleterre', 'Allemagne'];

	const placeCounts = {};
	filteredData.forEach(item => {
	  let place = item.place || null;
	  
	  if (!place) return; // Ignorer si pas de lieu
	  
	  // Extraire le pays (partie après la dernière virgule)
	  // Ex: "Paris, France" → "France"
	  // Ex: "Bologne, Italie" → "Italie"  
	  // Ex: "France" → "France" (reste inchangé si pas de virgule)
	  if (place.includes(',')) {
	    const parts = place.split(',');
	    place = parts[parts.length - 1].trim();
	  }
	  
	  // Filtrer : ne garder QUE les pays autorisés
	  if (PAYS_AUTORISES.includes(place)) {
	    placeCounts[place] = (placeCounts[place] || 0) + 1;
	  }
	  // Tout le reste est ignoré (Bologne, Provence, Italie, etc.)
	});
    // ============================================================================
    // EXTRACTION DES TERMES-CLÉS
    // ============================================================================
    const allText = filteredData
      .map(item => `${item.left} ${item.kwic} ${item.right}`)
      .join(' ')
      .toLowerCase();

    // Tokenisation basique - Utilise Set.has() O(1) au lieu de array.includes() O(n)
    const words = allText
      .replace(/[.,;:!?()[\]{}«»""'']/g, ' ')
      .split(/\s+/)
      .filter(word =>
        word.length > 3 &&
        !STOPWORDS.has(word)
      );
    
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const keyTerms = Object.entries(wordCounts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // ============================================================================
    // FORMATAGE FINAL DES RÉSULTATS
    // ============================================================================
    return {
      total: filteredData.length,
      domains: Object.entries(domainCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      authors: Object.entries(authorCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      // Filtrer "Période inconnue" avant de parser
      periods: Object.entries(periodCounts)
        .filter(([period]) => period !== 'Période inconnue')
        .map(([period, count]) => ({ 
          period: parseInt(period),
          count 
        }))
        .filter(item => !isNaN(item.period))
        .sort((a, b) => a.period - b.period),
      places: Object.entries(placeCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      keyTerms
    };
  }, [filteredData]);
};
