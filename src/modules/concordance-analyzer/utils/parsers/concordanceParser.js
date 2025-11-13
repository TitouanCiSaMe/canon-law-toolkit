/**
 * Parser pour les exports CSV de NoSketch Engine
 * 
 * Ce module gère :
 * - La détection du format NoSketch (headers spécifiques)
 * - Le parsing de chaque concordance (left, kwic, right)
 * - L'enrichissement avec les métadonnées
 * - Le calcul de statistiques de qualité
 * 
 * @module concordanceParser
 */

import { parseReferenceWithLookup, extractPageFromReference, cleanText } from './referenceParser';

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

/**
 * Parse un export CSV complet de NoSketch Engine
 * 
 * Traite un fichier CSV exporté depuis NoSketch Engine et enrichit chaque
 * concordance avec les métadonnées correspondantes depuis le lookup.
 * 
 * Format attendu du CSV :
 * - Header : Reference,Left,KWIC,Right
 * - Data : "Edi-25, ...",".....","terme","....."
 * 
 * Le parser :
 * 1. Détecte automatiquement le header NoSketch
 * 2. Parse chaque ligne de concordance
 * 3. Enrichit avec métadonnées via lookup
 * 4. Calcule des statistiques de qualité
 * 
 * @param {Array<Array<string>>} csvData - Tableau 2D du CSV (lignes × colonnes)
 * @param {Object} metadataLookup - Lookup des métadonnées (depuis metadataParser)
 *                                  Format : { "Edi-XX": { author, title, ... } }
 * @returns {Object} Objet contenant :
 *                   - {Array} concordances - Liste des concordances enrichies
 *                   - {Object} stats - Statistiques de parsing :
 *                     - {number} totalReferences - Nombre total de concordances
 *                     - {number} successfulMatches - Nombre enrichies via lookup
 *                     - {number} failedMatches - Nombre en mode fallback
 *                     - {string} lookupRate - Pourcentage de succès (ex: "87.3%")
 * 
 * @throws {Error} Si le format NoSketch n'est pas reconnu
 * 
 * @example
 * const csvData = [
 *   ["Reference", "Left", "KWIC", "Right"],
 *   ["Edi-25, Summa, 53", "contexte gauche", "terme", "contexte droit"]
 * ];
 * const lookup = { "Edi-25": { author: "Anonyme", title: "Summa...", ... } };
 * 
 * const result = parseNoSketchCSV(csvData, lookup);
 * console.log(result.concordances.length); // 1
 * console.log(result.stats.lookupRate);    // "100.0%"
 */
export const parseNoSketchCSV = (csvData, metadataLookup) => {
  const concordances = [];
  let startIndex = -1;

  // ============================================================================
  // ÉTAPE 1 : Trouver le début des données
  // ============================================================================
  
  // NoSketch a un header spécifique : Reference,Left,KWIC,Right
  // On cherche cette ligne pour savoir où commencent les données
  csvData.forEach((row, index) => {
    if (row.length >= 4 && 
        row[0] === 'Reference' && 
        row[1] === 'Left' && 
        row[2] === 'KWIC' && 
        row[3] === 'Right') {
      startIndex = index + 1; // Les données commencent à la ligne suivante
    }
  });

  // Si header pas trouvé, erreur explicite
  if (startIndex === -1) {
    throw new Error('Format NoSketch non reconnu : headers "Reference,Left,KWIC,Right" introuvables');
  }

  // ============================================================================
  // ÉTAPE 2 : Parser chaque concordance + compter les succès
  // ============================================================================
  
  let successfulMatches = 0;
  let totalReferences = 0;

  for (let i = startIndex; i < csvData.length; i++) {
    const row = csvData[i];
    
    // Vérifier que la ligne est valide (4 colonnes minimum + référence + KWIC)
    if (row.length >= 4 && row[0] && row[2]) {
      totalReferences++;
      
      try {
        // Parser la référence avec le lookup de métadonnées
        const metadata = parseReferenceWithLookup(row[0], metadataLookup);
        
        // Créer l'objet concordance complet
        concordances.push({
          id: i - startIndex,              // ID unique (position dans le fichier)
          reference: row[0],               // Référence brute
          left: cleanText(row[1] || ''),   // Contexte gauche nettoyé
          kwic: cleanText(row[2] || ''),   // Terme recherché nettoyé
          right: cleanText(row[3] || ''),  // Contexte droit nettoyé
          ...metadata                       // Toutes les métadonnées enrichies
        });
        
        // Compter les succès (données enrichies vs fallback)
        if (metadata.fromLookup) {
          successfulMatches++;
        }
      } catch (err) {
        // Logger l'erreur mais continuer le traitement
        console.warn(`Erreur ligne ${i}: ${err.message}`);
        // Note : on pourrait aussi ajouter la ligne en mode "erreur"
        // pour ne pas perdre de données
      }
    }
  }

  // ============================================================================
  // ÉTAPE 3 : Calculer les statistiques
  // ============================================================================
  
  const stats = {
    totalReferences,                                      // Nombre total de concordances
    successfulMatches,                                    // Nombre enrichies avec lookup
    failedMatches: totalReferences - successfulMatches,   // Nombre en fallback
    lookupRate: ((successfulMatches / totalReferences) * 100).toFixed(1)  // Pourcentage
  };

  return {
    concordances,
    stats
  };
};

// ============================================================================
// FONCTION DE VALIDATION
// ============================================================================

/**
 * Valide qu'un CSV a le bon format NoSketch avant parsing
 * 
 * Utile pour donner un retour rapide à l'utilisateur avant de lancer
 * le parsing complet. Vérifie la présence des headers requis et la
 * présence de données après le header.
 * 
 * @param {Array<Array<string>>} csvData - Données CSV à valider
 * @returns {Object} Résultat de validation contenant :
 *                   - {boolean} valid - true si format valide
 *                   - {string|null} error - Message d'erreur si invalide, null sinon
 * 
 * @example
 * const validation = validateNoSketchFormat(csvData);
 * if (!validation.valid) {
 *   alert(validation.error);
 *   return;
 * }
 * // Continuer avec le parsing...
 */
export const validateNoSketchFormat = (csvData) => {
  // Vérification 1 : Y a-t-il des données ?
  if (!csvData || csvData.length === 0) {
    return {
      valid: false,
      error: 'Fichier vide ou invalide'
    };
  }

  // Vérification 2 : Y a-t-il le header NoSketch ?
  const hasHeader = csvData.some(row => 
    row.length >= 4 && 
    row[0] === 'Reference' && 
    row[1] === 'Left' && 
    row[2] === 'KWIC' && 
    row[3] === 'Right'
  );

  if (!hasHeader) {
    return {
      valid: false,
      error: 'Format NoSketch non détecté. Colonnes attendues : Reference, Left, KWIC, Right'
    };
  }

  // Vérification 3 : Y a-t-il des données après le header ?
  const headerIndex = csvData.findIndex(row => 
    row.length >= 4 && row[0] === 'Reference'
  );

  if (headerIndex === csvData.length - 1) {
    return {
      valid: false,
      error: 'Aucune donnée trouvée après les headers'
    };
  }

  return {
    valid: true,
    error: null
  };
};

// ============================================================================
// FONCTION DE PRÉVISUALISATION
// ============================================================================

/**
 * Extrait un échantillon de concordances pour prévisualisation
 * 
 * Utile pour montrer à l'utilisateur un aperçu avant traitement complet.
 * N'enrichit pas les données avec les métadonnées pour des raisons de performance.
 * 
 * @param {Array<Array<string>>} csvData - Données CSV
 * @param {number} [sampleSize=10] - Nombre de lignes à extraire
 * @returns {Array} Échantillon de concordances (format simplifié) contenant :
 *                  - {string} reference - Référence (tronquée)
 *                  - {string} left - 30 derniers caractères du contexte gauche
 *                  - {string} kwic - Terme recherché
 *                  - {string} right - 30 premiers caractères du contexte droit
 * 
 * @throws {Error} Si le format n'est pas valide
 * 
 * @example
 * const preview = previewConcordances(csvData, 5);
 * preview.forEach(c => console.log(c.kwic)); // Affiche les 5 premiers termes
 */
export const previewConcordances = (csvData, sampleSize = 10) => {
  const validation = validateNoSketchFormat(csvData);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Trouver le début des données
  const startIndex = csvData.findIndex(row => 
    row.length >= 4 && row[0] === 'Reference'
  ) + 1;

  const preview = [];
  const endIndex = Math.min(startIndex + sampleSize, csvData.length);

  for (let i = startIndex; i < endIndex; i++) {
    const row = csvData[i];
    if (row.length >= 4 && row[0] && row[2]) {
      preview.push({
        reference: row[0],
        left: cleanText(row[1] || '').slice(-30), // 30 derniers caractères
        kwic: cleanText(row[2] || ''),
        right: cleanText(row[3] || '').slice(0, 30) // 30 premiers caractères
      });
    }
  }

  return preview;
};

// ============================================================================
// FONCTION D'ANALYSE RAPIDE
// ============================================================================

/**
 * Analyse rapide d'un CSV sans parsing complet
 * 
 * Donne des métriques basiques sans charger toutes les données en mémoire.
 * Utile pour les gros fichiers où un parsing complet serait trop long.
 * 
 * @param {Array<Array<string>>} csvData - Données CSV
 * @returns {Object} Statistiques rapides contenant :
 *                   - {boolean} valid - Format valide ou non
 *                   - {string} [error] - Message d'erreur si invalide
 *                   - {number} [totalLines] - Nombre de lignes de données
 *                   - {number} [hasEdiReferences] - Nombre avec identifiant Edi-XX
 *                   - {string} [potentialMatchRate] - Taux potentiel de matching (%)
 * 
 * @example
 * const info = quickAnalyze(csvData);
 * if (info.valid) {
 *   console.log(`${info.totalLines} concordances trouvées`);
 *   console.log(`${info.potentialMatchRate}% ont un identifiant Edi-XX`);
 * }
 */
export const quickAnalyze = (csvData) => {
  const validation = validateNoSketchFormat(csvData);
  if (!validation.valid) {
    return {
      valid: false,
      error: validation.error
    };
  }

  const startIndex = csvData.findIndex(row => 
    row.length >= 4 && row[0] === 'Reference'
  ) + 1;

  let totalLines = 0;
  let hasEdiReferences = 0;

  for (let i = startIndex; i < csvData.length; i++) {
    const row = csvData[i];
    if (row.length >= 4 && row[0] && row[2]) {
      totalLines++;
      if (/Edi-\d+/.test(row[0])) {
        hasEdiReferences++;
      }
    }
  }

  return {
    valid: true,
    totalLines,
    hasEdiReferences,
    potentialMatchRate: ((hasEdiReferences / totalLines) * 100).toFixed(1)
  };
};
