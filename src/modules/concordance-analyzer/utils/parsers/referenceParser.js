/**
 * Parser pour les références des exports NoSketch
 * 
 * Ce module gère :
 * - L'extraction des numéros de page depuis les références
 * - Le matching avec le lookup de métadonnées
 * - Le parsing de références par contenu (fallback)
 * - Le nettoyage de texte des concordances
 * 
 * @module referenceParser
 */

// ============================================================================
// FONCTION PRINCIPALE : MATCHING AVEC LOOKUP
// ============================================================================

/**
 * Parse une référence en utilisant le lookup de métadonnées
 * 
 * Stratégie en deux temps :
 * 1. Cherche un identifiant Edi-XX dans la référence
 * 2. Si trouvé → utilise le lookup + extrait la page
 * 3. Si pas trouvé → parse par contenu (fallback)
 * 
 * Cette approche maximise l'enrichissement des données en privilégiant
 * les métadonnées structurées du CSV quand disponibles.
 * 
 * @param {string} reference - Référence brute (ex: "Edi-25, Summa, 1194, 53")
 * @param {Object} metadataLookup - Lookup des métadonnées { "Edi-XX": {...} }
 * @returns {Object} Métadonnées enrichies contenant :
 *                   - {string} author - Auteur de l'œuvre
 *                   - {string} title - Titre de l'œuvre
 *                   - {string} period - Période
 *                   - {string} place - Lieu de rédaction
 *                   - {string} domain - Domaine juridique
 *                   - {number|null} page - Numéro de page
 *                   - {boolean} fromLookup - true si enrichi, false si fallback
 *                   - {string} [ediId] - Identifiant Edi-XX (si trouvé)
 * 
 * @example
 * const lookup = { "Edi-25": { author: "Anonyme", title: "Summa...", ... } };
 * const metadata = parseReferenceWithLookup("Edi-25, Summa, 1194, 53", lookup);
 * console.log(metadata);
 * // { author: "Anonyme", title: "Summa...", page: 53, fromLookup: true, ... }
 * 
 * @example
 * // Cas sans Edi-XX (fallback)
 * const metadata = parseReferenceWithLookup("Summa, 1194, France, 53", {});
 * console.log(metadata.fromLookup); // false
 */
export const parseReferenceWithLookup = (reference, metadataLookup) => {
  // Chercher un identifiant Edi-XX
  const ediMatch = reference.match(/Edi-(\d+)/);
  
  if (ediMatch) {
    const ediId = ediMatch[0]; // Ex: "Edi-25"
    
    // Vérifier si on a des métadonnées pour cet ID
    if (metadataLookup[ediId]) {
      // On a trouvé ! Extraire juste la page
      const pageFromExport = extractPageFromReference(reference);
      
      return {
        ...metadataLookup[ediId], // Toutes les métadonnées du CSV
        page: pageFromExport,      // Page extraite de la référence
        fromLookup: true,          // Flag pour tracking
        ediId: ediId               // Garder l'ID pour debug
      };
    }
  }
  
  // Pas d'Edi-XX trouvé ou pas dans le lookup → fallback
  return parseReferenceByContent(reference);
};

// ============================================================================
// EXTRACTION DE PAGE
// ============================================================================

/**
 * Extrait intelligemment le numéro de page d'une référence
 * 
 * Logique complexe car les références peuvent avoir différents formats :
 * - "Edi-25, Summa, 1194, 53" → page = 53
 * - "Edi-25, 1140-1149, 42" → page = 42
 * - "Edi-25, 1194, France, 53" → page = 53
 * 
 * Stratégie :
 * 1. Split par virgule
 * 2. Ignore Edi-XX et les périodes (1140-1149)
 * 3. Prend le dernier nombre restant
 * 4. Si ambiguïté, privilégie les nombres < 100 ou > 2000
 * 
 * @param {string} reference - Référence complète
 * @returns {number|null} Numéro de page ou null si non trouvé
 * 
 * @example
 * extractPageFromReference("Edi-25, Summa, 1194, 53"); // 53
 * extractPageFromReference("Edi-25, 1140-1149, 42"); // 42
 * extractPageFromReference("Edi-30, Title, 1200, France, 67"); // 67
 * extractPageFromReference("No numbers here"); // null
 */
export const extractPageFromReference = (reference) => {
  // Split par virgule et nettoyer
  const parts = reference.split(',').map(p => p.trim());
  
  let periodFound = false;
  const remainingNumbers = [];
  
  // Analyser chaque partie
  parts.forEach(part => {
    // Cas 1 : Ignorer les Edi-XX
    if (/^Edi-\d+$/.test(part)) return;
    
    // Cas 2 : Détecter et ignorer les périodes (1140-1149)
    if (/^\d{4}-\d{4}$/.test(part)) {
      periodFound = true;
      return;
    }
    
    // Cas 3 : C'est un nombre pur ? Le garder
    if (/^\d+$/.test(part)) {
      remainingNumbers.push(parseInt(part));
    }
  });
  
  // Stratégie de sélection du bon nombre
  
  // Si on a trouvé une période, le nombre suivant est probablement la page
  for (const num of remainingNumbers) {
    if (periodFound) return num;
    
    // Les pages sont généralement < 100 ou > 2000 (années)
    // Donc si < 100 ou > 2000, c'est probablement une page
    if (num < 100 || num > 2000) return num;
  }
  
  // Par défaut : prendre le dernier nombre
  if (remainingNumbers.length > 0) {
    return remainingNumbers[remainingNumbers.length - 1];
  }
  
  return null;
};

// ============================================================================
// PARSING PAR CONTENU (FALLBACK)
// ============================================================================

/**
 * Parse une référence sans utiliser le lookup (fallback)
 * 
 * Utilisé quand :
 * - Pas d'Edi-XX trouvé dans la référence
 * - Edi-XX trouvé mais pas dans le lookup
 * 
 * Essaie d'extraire ce qu'il peut depuis la référence elle-même,
 * notamment les périodes et le titre, mais les autres informations
 * restent par défaut (Anonyme, Lieu inconnu, etc.).
 * 
 * @param {string} reference - Référence complète
 * @returns {Object} Métadonnées partielles contenant :
 *                   - {string} author - "Anonyme" (par défaut)
 *                   - {string} title - Titre extrait ou "Titre inconnu"
 *                   - {string} period - Période extraite ou "Période inconnue"
 *                   - {string} place - "Lieu inconnu" (par défaut)
 *                   - {string} domain - "Domaine inconnu" (par défaut)
 *                   - {number|null} page - null (non extrait)
 *                   - {boolean} fromLookup - false (indique fallback)
 * 
 * @example
 * parseReferenceByContent("Summa, 1194, France, 53");
 * // { title: "Summa", period: "Période inconnue", fromLookup: false, ... }
 * 
 * @example
 * parseReferenceByContent("Decretum, 1140-1149, Italie");
 * // { title: "Decretum", period: "1140-1149", fromLookup: false, ... }
 */
export const parseReferenceByContent = (reference) => {
  // Split par virgule
  const parts = reference.split(',').map(p => p.trim());
  
  // Initialiser avec valeurs par défaut
  const metadata = {
    author: 'Anonyme',
    title: 'Titre inconnu', 
    period: 'Période inconnue',
    place: 'Lieu inconnu',
    domain: 'Domaine inconnu',
    page: null,
    fromLookup: false // Important : indique que c'est un fallback
  };

  // Essayer d'extraire ce qu'on peut
  parts.forEach((part, index) => {
    if (!part) return;
    
    // Détecter une période (1140-1149 ou 1194)
    if (/^\d{4}-\d{4}$/.test(part.trim())) {
      metadata.period = part;
    } 
    // Premier élément ou si pas encore de titre → c'est probablement le titre
    else if (index === 0 || metadata.title === 'Titre inconnu') {
      metadata.title = part;
    }
  });

  return metadata;
};

// ============================================================================
// FONCTION UTILITAIRE : NETTOYAGE DE TEXTE
// ============================================================================

/**
 * Nettoie le texte des concordances
 * 
 * Supprime les marqueurs spécifiques de NoSketch Engine et normalise
 * les espaces. Utilisé pour rendre le texte des concordances plus lisible
 * en éliminant les artefacts de formatage.
 * 
 * Opérations effectuées :
 * - Suppression des marqueurs NoSketch (| | ==>)
 * - Réduction des espaces multiples en un seul
 * - Suppression des guillemets en début/fin
 * - Trim des espaces
 * 
 * @param {string} text - Texte brut à nettoyer
 * @returns {string} Texte nettoyé et normalisé
 * 
 * @example
 * cleanText("|| ==> text  here "); // "text here"
 * cleanText("  multiple   spaces  "); // "multiple spaces"
 * cleanText('"quoted text"'); // "quoted text"
 * cleanText(""); // ""
 */
export const cleanText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\|\s*\|\s*==>/g, ' ')  // Marqueurs NoSketch
    .replace(/\s+/g, ' ')             // Espaces multiples → 1 espace
    .replace(/^["']|["']$/g, '')      // Guillemets début/fin
    .trim();
};
