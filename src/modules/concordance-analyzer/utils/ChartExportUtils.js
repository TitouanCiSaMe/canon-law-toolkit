/**
 * Utilitaires d'export de graphiques en images
 * 
 * Ce module gère l'export des graphiques Recharts au format PNG.
 * Utilise html2canvas pour capturer le rendu visuel des graphiques
 * et génère des fichiers haute résolution pour publications académiques.
 * 
 * Caractéristiques :
 * - Export PNG haute résolution (2x par défaut)
 * - Nom de fichier automatique avec horodatage
 * - Gestion d'erreurs complète
 * - Console logs pour débogage
 * 
 * @module ChartExportUtils
 */

import html2canvas from 'html2canvas';

// ============================================================================
// EXPORT PNG SCROLLABLE
// ============================================================================

/**
 * Exporte un graphique avec contenu scrollable en format PNG
 * 
 * Fonction spécialisée pour capturer les graphiques qui ont un overflow (scroll).
 * Modifie temporairement les styles pour afficher tout le contenu, puis les restaure.
 * 
 * Processus :
 * 1. Sauvegarde les styles originaux (height, maxHeight, overflow)
 * 2. Modifie temporairement pour afficher tout le contenu
 * 3. Capture avec html2canvas en utilisant scrollHeight complet
 * 4. Restaure les styles originaux
 * 5. Télécharge le PNG
 * 
 * @param {string} elementId - ID du conteneur DOM du graphique
 * @param {string} filename - Nom de base du fichier (sans extension)
 * @param {Object} options - Options de configuration
 * @param {number} [options.scale=2] - Échelle de résolution
 * @param {string} [options.backgroundColor='#ffffff'] - Couleur de fond
 * @param {boolean} [options.transparent=false] - Fond transparent
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * // Export timeline avec scroll complet
 * await exportScrollableChartAsPNG('timeline-gantt-123', 'timeline');
 */
export const exportScrollableChartAsPNG = async (elementId, filename, options = {}) => {
  const {
    scale = 2,
    backgroundColor = '#ffffff',
    transparent = false
  } = options;

  try {
    // ============================================================================
    // ÉTAPE 1 : RÉCUPÉRATION DE L'ÉLÉMENT DOM
    // ============================================================================
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Élément avec l'ID "${elementId}" introuvable dans le DOM`);
    }

    // ============================================================================
    // ÉTAPE 2 : SAUVEGARDE ET MODIFICATION DES STYLES
    // ============================================================================
    
    // Sauvegarder les styles originaux
    const originalStyles = {
      height: element.style.height,
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
      position: element.style.position
    };

    // Modifier temporairement pour afficher tout le contenu
    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';
    
    // Attendre que le DOM se mette à jour
    await new Promise(resolve => setTimeout(resolve, 100));

    // ============================================================================
    // ÉTAPE 3 : CAPTURE DU GRAPHIQUE COMPLET
    // ============================================================================
    const canvas = await html2canvas(element, {
      scale: scale,
      backgroundColor: transparent ? null : backgroundColor,
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowHeight: element.scrollHeight, // CRITIQUE : Hauteur complète
      height: element.scrollHeight        // CRITIQUE : Hauteur complète
    });

    // ============================================================================
    // ÉTAPE 4 : RESTAURATION DES STYLES ORIGINAUX
    // ============================================================================
    element.style.height = originalStyles.height;
    element.style.maxHeight = originalStyles.maxHeight;
    element.style.overflow = originalStyles.overflow;
    element.style.position = originalStyles.position;

    // ============================================================================
    // ÉTAPE 5 : CONVERSION ET TÉLÉCHARGEMENT
    // ============================================================================
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      
      link.href = url;
      link.download = `${filename}_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`✅ Graphique scrollable exporté : ${filename}_${timestamp}.png`);
    }, 'image/png');

  } catch (error) {
    console.error('❌ Erreur lors de l\'export PNG scrollable:', error);
    alert(`Erreur lors de l'export du graphique : ${error.message}`);
    throw error;
  }
};

// ============================================================================
// EXPORT PNG STANDARD
// ============================================================================

/**
 * Exporte un graphique en format PNG haute résolution
 * 
 * Cette fonction capture visuellement un conteneur DOM contenant un graphique
 * Recharts et le télécharge automatiquement en format PNG. La capture préserve
 * tous les éléments visuels (couleurs, polices, axes, légendes).
 * 
 * Processus :
 * 1. Recherche l'élément DOM par son ID
 * 2. Capture l'élément avec html2canvas
 * 3. Convertit le canvas en blob PNG
 * 4. Crée un lien de téléchargement temporaire
 * 5. Déclenche le téléchargement
 * 6. Nettoie les ressources temporaires
 * 
 * @param {string} elementId - ID du conteneur DOM du graphique à exporter
 * @param {string} filename - Nom de base du fichier (sans extension)
 * @param {Object} options - Options de configuration de l'export
 * @param {number} [options.scale=2] - Échelle de résolution (1=standard 72dpi, 2=HD 150dpi, 3=print 300dpi)
 * @param {string} [options.backgroundColor='#ffffff'] - Couleur de fond du PNG
 * @param {boolean} [options.transparent=false] - Active le fond transparent (alpha channel)
 * 
 * @returns {Promise<void>} Promesse résolue quand l'export est terminé
 * 
 * @throws {Error} Si l'élément avec elementId n'existe pas dans le DOM
 * @throws {Error} Si html2canvas échoue à capturer l'élément
 * 
 * @example
 * // Export standard (HD 2x)
 * await exportChartAsPNG('domain-chart-123', 'domaines');
 * // Télécharge : domaines_2025-10-22.png
 * 
 * @example
 * // Export haute résolution pour impression
 * await exportChartAsPNG('temporal-chart', 'chronologie', {
 *   scale: 3,
 *   backgroundColor: '#f8fafc'
 * });
 * 
 * @example
 * // Export avec fond transparent pour intégration
 * await exportChartAsPNG('author-chart', 'auteurs', {
 *   transparent: true,
 *   scale: 2
 * });
 */
export const exportChartAsPNG = async (elementId, filename, options = {}) => {
  // ============================================================================
  // EXTRACTION DES OPTIONS AVEC VALEURS PAR DÉFAUT
  // ============================================================================
  const {
    scale = 2,                    // Résolution : 2x = 150 DPI (qualité HD)
    backgroundColor = '#ffffff',  // Fond blanc par défaut
    transparent = false           // Pas de transparence par défaut
  } = options;

  try {
    // ============================================================================
    // ÉTAPE 1 : RÉCUPÉRATION DE L'ÉLÉMENT DOM
    // ============================================================================
    const element = document.getElementById(elementId);
    
    // Validation : l'élément doit exister
    if (!element) {
      throw new Error(`Élément avec l'ID "${elementId}" introuvable dans le DOM`);
    }

    // ============================================================================
    // ÉTAPE 2 : CAPTURE DU GRAPHIQUE AVEC HTML2CANVAS
    // ============================================================================
    const canvas = await html2canvas(element, {
      scale: scale,                           // Facteur de résolution
      backgroundColor: transparent ? null : backgroundColor,  // Gestion transparence
      logging: false,                         // Désactive logs html2canvas
      useCORS: true,                          // Support images cross-origin
      allowTaint: true                        // Permet images externes
    });

    // ============================================================================
    // ÉTAPE 3 : CONVERSION CANVAS → BLOB PNG
    // ============================================================================
    canvas.toBlob((blob) => {
      // Créer une URL temporaire pour le blob
      const url = URL.createObjectURL(blob);
      
      // Créer un élément <a> temporaire pour le téléchargement
      const link = document.createElement('a');
      
      // Générer le nom de fichier avec horodatage (format ISO 8601)
      const timestamp = new Date().toISOString().slice(0, 10);  // YYYY-MM-DD
      
      // ============================================================================
      // ÉTAPE 4 : CONFIGURATION DU TÉLÉCHARGEMENT
      // ============================================================================
      link.href = url;
      link.download = `${filename}_${timestamp}.png`;
      
      // Ajouter temporairement au DOM (requis pour Firefox)
      document.body.appendChild(link);
      
      // ============================================================================
      // ÉTAPE 5 : DÉCLENCHEMENT DU TÉLÉCHARGEMENT
      // ============================================================================
      link.click();
      
      // ============================================================================
      // ÉTAPE 6 : NETTOYAGE DES RESSOURCES
      // ============================================================================
      document.body.removeChild(link);  // Retirer le lien du DOM
      URL.revokeObjectURL(url);         // Libérer la mémoire
      
      // Log de confirmation en console
      console.log(`✅ Graphique exporté : ${filename}_${timestamp}.png`);
    }, 'image/png');  // Type MIME pour PNG

  } catch (error) {
    // ============================================================================
    // GESTION DES ERREURS
    // ============================================================================
    console.error('❌ Erreur lors de l\'export PNG:', error);
    
    // Afficher une alerte utilisateur (optionnel, peut être géré par le composant)
    alert(`Erreur lors de l'export du graphique : ${error.message}`);
    
    // Propager l'erreur pour permettre gestion en amont
    throw error;
  }
};

// ============================================================================
// NOTES TECHNIQUES
// ============================================================================

/**
 * LIMITATIONS CONNUES :
 * 
 * 1. Performances :
 *    - Graphiques très larges (>5000px) peuvent être lents
 *    - Scale 3 génère des fichiers volumineux (2-5 MB)
 * 
 * 2. Compatibilité navigateurs :
 *    - Chrome/Edge : Support complet ✅
 *    - Firefox : Support complet ✅
 *    - Safari : Quelques problèmes avec fonts custom ⚠️
 * 
 * 3. CSS non supportés par html2canvas :
 *    - box-shadow complexes
 *    - backdrop-filter
 *    - Certaines animations CSS
 * 
 * 4. Mémoire :
 *    - Scale 3 peut consommer 100+ MB RAM temporairement
 *    - Nettoyage automatique après export
 */

/**
 * OPTIMISATIONS POSSIBLES :
 * 
 * 1. Compression :
 *    - Ajouter option de compression PNG (pngquant)
 *    - Réduire taille fichier de 40-60%
 * 
 * 2. Formats additionnels :
 *    - JPEG pour graphiques simples (plus léger)
 *    - WebP pour navigateurs modernes (meilleure compression)
 * 
 * 3. Batch export :
 *    - Exporter plusieurs graphiques en une fois
 *    - Générer un ZIP automatique
 * 
 * 4. Watermark :
 *    - Ajouter watermark "Généré par ConcordanceAnalyzer"
 *    - Horodatage visible sur l'image
 */
