/**
 * Générateurs de variations orthographiques pour le latin médiéval
 * @module query-generator/utils/variationGenerators
 */

import { MEDIEVAL_SUBSTITUTIONS, VOWEL_VARIATIONS } from '../config/constants';

/**
 * Nettoie et valide une entrée utilisateur
 * @param {string} input - Texte à nettoyer
 * @returns {string} Texte nettoyé
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';

  const trimmed = input.trim();
  // Garde lettres (y compris accentuées), chiffres, espaces, tirets, apostrophes
  const cleaned = trimmed.replace(/[^a-zA-ZÀ-ÿ0-9\s\-']/g, '');

  return cleaned;
}

/**
 * Génère des variations simples (1 lettre → [A-z]?)
 * @param {string} mot - Mot à varier
 * @param {string} suffix - Suffixe à ajouter ('' ou '[A-z]*')
 * @returns {string[]} Tableau de patterns
 */
export function generateSimpleVariations(mot, suffix = '') {
  const patterns = [mot + suffix];
  const length = mot.length;

  for (let i = 0; i < length; i++) {
    const before = mot.substring(0, i);
    const after = mot.substring(i + 1);
    patterns.push(before + '[A-z]?' + after + suffix);
  }

  return [...new Set(patterns)]; // Déduplique
}

/**
 * Génère des variations moyennes (1 lettre → [A-z]*)
 * @param {string} mot - Mot à varier
 * @param {string} suffix - Suffixe à ajouter
 * @returns {string[]} Tableau de patterns
 */
export function generateMediumVariations(mot, suffix = '') {
  const patterns = [mot + suffix];
  const length = mot.length;

  for (let i = 0; i < length; i++) {
    const before = mot.substring(0, i);
    const after = mot.substring(i + 1);
    patterns.push(before + '[A-z]*' + after + suffix);
  }

  return [...new Set(patterns)];
}

/**
 * Génère des variations complexes (2 lettres → [A-z]*)
 * @param {string} mot - Mot à varier
 * @param {string} suffix - Suffixe à ajouter
 * @returns {string[]} Tableau de patterns
 */
export function generateComplexVariations(mot, suffix = '') {
  const patterns = [mot + suffix];
  const length = mot.length;

  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      const part1 = mot.substring(0, i);
      const part2 = mot.substring(i + 1, j);
      const part3 = mot.substring(j + 1);
      patterns.push(part1 + '[A-z]*' + part2 + '[A-z]*' + part3 + suffix);
    }
  }

  return [...new Set(patterns)];
}

/**
 * Génère des variations spécifiques au latin médiéval
 * @param {string} mot - Mot à varier
 * @param {string} suffix - Suffixe à ajouter
 * @returns {string[]} Tableau de patterns
 */
export function generateMedievalVariations(mot, suffix = '') {
  const patterns = [mot + suffix];

  // 1. Substitutions consonantiques et digraphes médiévaux
  Object.entries(MEDIEVAL_SUBSTITUTIONS).forEach(([original, replacements]) => {
    if (mot.includes(original)) {
      replacements.forEach(replacement => {
        const variant = mot.replace(original, replacement);
        if (variant !== mot) {
          patterns.push(variant + suffix);
        }
      });
    }
  });

  // 2. Variations de voyelles (gémination)
  Object.entries(VOWEL_VARIATIONS).forEach(([vowel, variants]) => {
    if (mot.includes(vowel)) {
      variants.forEach(variant => {
        if (variant !== vowel) {
          const newPattern = mot.replace(vowel, variant);
          patterns.push(newPattern + suffix);
        }
      });
    }
  });

  return [...new Set(patterns)];
}

/**
 * Génère toutes les variations pour un mot selon le type demandé
 * @param {string} mot - Mot à varier
 * @param {string} variationType - Type de variation (simple, medium, complex, medieval, all)
 * @param {boolean} withSuffix - Ajouter le suffixe [A-z]* ?
 * @returns {string[]} Tableau de patterns
 */
export function generateVariationPatterns(mot, variationType = 'simple', withSuffix = false) {
  const cleanedWord = sanitizeInput(mot);
  if (!cleanedWord) return [];

  const suffix = withSuffix ? '[A-z]*' : '';
  let patterns = [];

  switch (variationType) {
    case 'simple':
      patterns = generateSimpleVariations(cleanedWord, suffix);
      break;
    case 'medium':
      patterns = generateMediumVariations(cleanedWord, suffix);
      break;
    case 'complex':
      patterns = generateComplexVariations(cleanedWord, suffix);
      break;
    case 'medieval':
      patterns = generateMedievalVariations(cleanedWord, suffix);
      break;
    case 'all':
      patterns = [
        ...generateSimpleVariations(cleanedWord, suffix),
        ...generateMediumVariations(cleanedWord, suffix),
        ...generateComplexVariations(cleanedWord, suffix),
        ...generateMedievalVariations(cleanedWord, suffix)
      ];
      break;
    default:
      patterns = [cleanedWord + suffix];
  }

  return [...new Set(patterns)]; // Déduplique les résultats
}

/**
 * Génère les 4 types de requêtes de variations (simple, medium, complex, medieval)
 * @param {string} mot - Mot à rechercher
 * @param {boolean} withSuffix - Avec désinences ?
 * @param {string} attribute - Attribut de recherche ('word' ou 'lemma')
 * @returns {Object} Objet avec les 4 types de requêtes
 */
export function generateAllVariationQueries(mot, withSuffix = true, attribute = 'word') {
  const cleanedWord = sanitizeInput(mot);

  if (!cleanedWord) {
    return { error: 'Le mot doit être renseigné' };
  }

  const suffix = withSuffix ? '[A-z]*' : '';

  const patterns1 = generateSimpleVariations(cleanedWord, suffix);
  const patterns2 = generateMediumVariations(cleanedWord, suffix);
  const patterns3 = generateComplexVariations(cleanedWord, suffix);
  const medievalPatterns = generateMedievalVariations(cleanedWord, suffix);

  return {
    mot: cleanedWord,
    requete1: `[${attribute}="${patterns1.join('|')}"]`,
    requete2: `[${attribute}="${patterns2.join('|')}"]`,
    requete3: `[${attribute}="${patterns3.join('|')}"]`,
    requete_medievale: `[${attribute}="${medievalPatterns.join('|')}"]`,
    desinence: withSuffix ? 'pointetoile' : 'nothing',
    attribute,
    patterns: {
      simple: patterns1,
      medium: patterns2,
      complex: patterns3,
      medieval: medievalPatterns
    }
  };
}
