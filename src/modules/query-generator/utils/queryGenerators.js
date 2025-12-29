/**
 * Générateurs de requêtes CQL pour NoSketch Engine
 * @module query-generator/utils/queryGenerators
 */

import { sanitizeInput, generateVariationPatterns } from './variationGenerators';
import { DISTANCE_LIMITS, NOSKETCH_BASE_URL } from '../config/constants';

/**
 * Valide et limite une distance
 * @param {number|string} distance - Distance à valider
 * @returns {number} Distance validée entre MIN et MAX
 */
export function validateDistance(distance) {
  const num = parseInt(distance, 10);
  if (isNaN(num)) return DISTANCE_LIMITS.DEFAULT_PROXIMITY;

  return Math.max(
    DISTANCE_LIMITS.MIN,
    Math.min(DISTANCE_LIMITS.MAX, num)
  );
}

/**
 * Génère une requête de proximité simple
 * @param {string} lemma1 - Premier lemme
 * @param {string} lemma2 - Second lemme
 * @param {number} distance - Distance maximale
 * @param {string} attribute - Attribut ('lemma' ou 'word')
 * @param {boolean} bidirectional - Recherche bidirectionnelle ?
 * @returns {Object} Résultat avec query et métadonnées
 */
export function generateProximityQuery(
  lemma1,
  lemma2,
  distance = DISTANCE_LIMITS.DEFAULT_PROXIMITY,
  attribute = 'lemma',
  bidirectional = true
) {
  const clean1 = sanitizeInput(lemma1);
  const clean2 = sanitizeInput(lemma2);
  const validDistance = validateDistance(distance);

  if (!clean1 || !clean2) {
    return { error: 'Les deux lemmes doivent être renseignés' };
  }

  // Crée une contrainte de non-répétition pour éviter les matches multiples
  // dans les phrases avec mots répétés (ex: "ignorantia iuris ... ignorantia iuris")
  const exclusionConstraint = `${attribute}!="${clean1}" & ${attribute}!="${clean2}"`;
  const middlePattern = `[${exclusionConstraint}]{0,${validDistance}}`;

  let finalQuery;

  if (bidirectional) {
    const query1 = `[${attribute}="${clean1}"] ${middlePattern} [${attribute}="${clean2}"]`;
    const query2 = `[${attribute}="${clean2}"] ${middlePattern} [${attribute}="${clean1}"]`;
    finalQuery = `${query1} | ${query2}`;
  } else {
    finalQuery = `[${attribute}="${clean1}"] ${middlePattern} [${attribute}="${clean2}"]`;
  }

  return {
    query: finalQuery,
    lemma1: clean1,
    lemma2: clean2,
    distance: validDistance,
    attribute,
    bidirectional
  };
}

/**
 * Génère une requête de proximité avec variations orthographiques
 * @param {string} lemma1 - Premier lemme
 * @param {string} lemma2 - Second lemme
 * @param {number} distance - Distance maximale
 * @param {string} variationType - Type de variation (simple, medium, complex, medieval, all)
 * @param {string} attribute - Attribut ('lemma' ou 'word')
 * @param {boolean} bidirectional - Recherche bidirectionnelle ?
 * @returns {Object} Résultat avec query et métadonnées
 */
export function generateProximityWithVariations(
  lemma1,
  lemma2,
  distance = DISTANCE_LIMITS.DEFAULT_PROXIMITY,
  variationType = 'simple',
  attribute = 'word',
  bidirectional = true
) {
  const clean1 = sanitizeInput(lemma1);
  const clean2 = sanitizeInput(lemma2);
  const validDistance = validateDistance(distance);

  if (!clean1 || !clean2) {
    return { error: 'Les deux lemmes doivent être renseignés' };
  }

  // Générer les patterns de variations
  const patterns1 = generateVariationPatterns(clean1, variationType, false);
  const patterns2 = generateVariationPatterns(clean2, variationType, false);

  if (patterns1.length === 0 || patterns2.length === 0) {
    return { error: 'Impossible de générer les patterns de variations' };
  }

  const lemma1Pattern = patterns1.join('|');
  const lemma2Pattern = patterns2.join('|');

  // Crée une contrainte de non-répétition pour éviter les matches multiples
  // dans les phrases avec mots répétés (ex: "ignorantia iuris ... ignorantia iuris")
  const exclusionConstraint = `${attribute}!="${lemma1Pattern}" & ${attribute}!="${lemma2Pattern}"`;
  const middlePattern = `[${exclusionConstraint}]{0,${validDistance}}`;

  let finalQuery;

  if (bidirectional) {
    const query1 = `[${attribute}="${lemma1Pattern}"] ${middlePattern} [${attribute}="${lemma2Pattern}"]`;
    const query2 = `[${attribute}="${lemma2Pattern}"] ${middlePattern} [${attribute}="${lemma1Pattern}"]`;
    finalQuery = `${query1} | ${query2}`;
  } else {
    finalQuery = `[${attribute}="${lemma1Pattern}"] ${middlePattern} [${attribute}="${lemma2Pattern}"]`;
  }

  return {
    query: finalQuery,
    lemma1: clean1,
    lemma2: clean2,
    patterns1,
    patterns2,
    distance: validDistance,
    variationType,
    attribute,
    bidirectional
  };
}

/**
 * Génère une requête avec contexte sémantique avancé
 * @param {string} centralLemma - Lemme central
 * @param {string} contextLemmas - Lemmes de contexte (séparés par virgules)
 * @param {number} distance - Distance maximale
 * @param {string} contextMode - Mode de contexte ('any', 'phrase', 'all')
 * @returns {Object} Résultat avec query et métadonnées
 */
export function generateSemanticContextQuery(
  centralLemma,
  contextLemmas,
  distance = DISTANCE_LIMITS.DEFAULT_SEMANTIC,
  contextMode = 'any'
) {
  const cleanCentral = sanitizeInput(centralLemma);
  const validDistance = validateDistance(distance);

  if (!cleanCentral || !contextLemmas) {
    return { error: 'Le lemme central et au moins un contexte doivent être renseignés' };
  }

  // Parser les lemmes de contexte
  const contextArray = contextLemmas
    .split(',')
    .map(l => sanitizeInput(l))
    .filter(l => l.length > 0);

  if (contextArray.length === 0) {
    return { error: 'Aucun lemme de contexte valide trouvé' };
  }

  const contextPatterns = contextArray.map(lemma => `[lemma="${lemma}"]`);
  let finalQuery = '';

  // Construction selon le mode choisi
  if (contextMode === 'phrase') {
    // MODE PHRASE OPTIMISÉE : évite les doublons
    const subQueries = [];
    contextArray.forEach(contextLemma => {
      subQueries.push(`[lemma="${cleanCentral}"] []{0,${validDistance}} [lemma="${contextLemma}"]`);
      subQueries.push(`[lemma="${contextLemma}"] []{0,${validDistance}} [lemma="${cleanCentral}"]`);
    });
    finalQuery = subQueries.join(' | ');
  } else if (contextMode === 'all') {
    // =========================================================================
    // OPTIMISATION: MODE TOUS avec limitation pour éviter explosion
    // =========================================================================
    // Avant : O(n²) × 6 permutations → avec 10 lemmes = 270 requêtes !
    // Après : Limitation + Set pendant génération → max 50 combinaisons
    const proximitySet = new Set(); // Déduplication pendant génération
    const centralPattern = `[lemma="${cleanCentral}"]`;

    // Limite de sécurité pour éviter URLs trop longues
    const MAX_COMBINATIONS = 50;
    let combinationCount = 0;

    // Génération limitée et optimisée
    for (let i = 0; i < contextPatterns.length && combinationCount < MAX_COMBINATIONS; i++) {
      for (let j = i + 1; j < contextPatterns.length && combinationCount < MAX_COMBINATIONS; j++) {
        const pattern1 = contextPatterns[i];
        const pattern2 = contextPatterns[j];

        // Générer seulement les permutations les plus utiles (central au milieu)
        // Au lieu de 6 permutations, on n'en fait que 2 les plus pertinentes
        proximitySet.add(`${pattern1} []{0,${validDistance}} ${centralPattern} []{0,${validDistance}} ${pattern2}`);
        proximitySet.add(`${pattern2} []{0,${validDistance}} ${centralPattern} []{0,${validDistance}} ${pattern1}`);

        combinationCount += 2;
      }
    }

    finalQuery = Array.from(proximitySet).join(' | ');

    // Avertissement si requête tronquée
    if (combinationCount >= MAX_COMBINATIONS) {
      console.warn(`[QueryGenerator] Requête limitée à ${MAX_COMBINATIONS} combinaisons pour éviter dépassement URL. Lemmes contextes: ${contextArray.length}`);
    }
  } else {
    // MODE AU MOINS UN : recherche souple (comportement original)
    const contextPattern = '(' + contextPatterns.join('|') + ')';
    finalQuery = `[lemma="${cleanCentral}"] []{0,${validDistance}} ${contextPattern} | ` +
                 `${contextPattern} []{0,${validDistance}} [lemma="${cleanCentral}"]`;
  }

  return {
    query: finalQuery,
    centralLemma: cleanCentral,
    contextLemmas: contextArray,
    distance: validDistance,
    contextMode
  };
}

/**
 * Génère l'URL NoSketch Engine complète
 * @param {string} query - Requête CQL
 * @returns {string} URL complète
 */
export function generateNoSketchUrl(query) {
  const encodedQuery = encodeURIComponent(query);
  return NOSKETCH_BASE_URL + encodedQuery;
}
