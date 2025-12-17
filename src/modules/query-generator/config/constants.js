/**
 * Configuration et constantes du générateur de requêtes
 * @module query-generator/config
 */

/**
 * URL de base NoSketch Engine pour le corpus Allegations
 */
export const NOSKETCH_BASE_URL = 'https://fip-185-155-93-80.iaas.unistra.fr/#concordance?corpname=CiSaMe&tab=advanced&queryselector=cql&attrs=word&viewmode=kwic&attr_allpos=all&refs_up=0&shorten_refs=1&glue=1&gdexcnt=300&show_gdex_scores=0&itemsPerPage=20&structs=s%2Cg&refs=%3Ddoc.id&default_attr=lemma&cql=';

/**
 * Substitutions spécifiques au latin médiéval
 * Format : { original: [variantes] }
 */
export const MEDIEVAL_SUBSTITUTIONS = {
  'ae': ['e', 'ae', 'æ'],
  'oe': ['e', 'oe', 'œ'],
  'ti': ['ci', 'ti'],
  'ci': ['ti', 'ci'],
  'ph': ['f', 'ph'],
  'th': ['t', 'th'],
  'ch': ['c', 'ch', 'k'],
  'y': ['i', 'y'],
  'v': ['u', 'v'],
  'j': ['i', 'j'],
  'qu': ['c', 'qu', 'k'],
  'x': ['cs', 'x', 'ks'],
  'z': ['s', 'z'],
  'gn': ['n', 'gn', 'gm'],
  'mn': ['n', 'mn', 'mm']
};

/**
 * Variations de voyelles pour le latin médiéval
 */
export const VOWEL_VARIATIONS = {
  'a': ['a', 'aa'],
  'e': ['e', 'ee'],
  'i': ['i', 'ii', 'y'],
  'o': ['o', 'oo'],
  'u': ['u', 'uu', 'v']
};

/**
 * Types de variations orthographiques
 */
export const VARIATION_TYPES = {
  SIMPLE: 'simple',
  MEDIUM: 'medium',
  COMPLEX: 'complex',
  MEDIEVAL: 'medieval',
  ALL: 'all'
};

/**
 * Attributs de recherche disponibles
 */
export const SEARCH_ATTRIBUTES = {
  LEMMA: 'lemma',
  WORD: 'word'
};

/**
 * Modes de contexte sémantique
 */
export const CONTEXT_MODES = {
  ANY: 'any',        // Au moins un contexte (OU)
  PHRASE: 'phrase',  // Phrase optimisée (évite doublons)
  ALL: 'all'         // Tous les contextes (ET)
};

/**
 * Limites de distance
 */
export const DISTANCE_LIMITS = {
  MIN: 0,
  MAX: 100,
  DEFAULT_PROXIMITY: 10,
  DEFAULT_SEMANTIC: 20
};

/**
 * Types de désinence
 */
export const DESINENCE_TYPES = {
  WITH_SUFFIX: 'pointetoile',  // Avec désinences [A-z]*
  EXACT: 'nothing'              // Forme exacte
};
