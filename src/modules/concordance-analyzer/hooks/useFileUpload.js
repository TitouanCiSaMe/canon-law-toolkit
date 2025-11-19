/**
 * Hook personnalisé pour gérer l'upload et le parsing des fichiers CSV
 * 
 * Ce hook gère le processus complet d'import de données :
 * - Upload et parsing du fichier de métadonnées (CSV structuré)
 * - Upload et parsing du fichier de concordances NoSketch (CSV export) - Corpus A
 * - Upload et parsing d'un second fichier de concordances NoSketch (CSV export) - Corpus B (NOUVEAU)
 * - Gestion des états de chargement et d'erreur
 * - Calcul et affichage des statistiques de parsing
 * - Validation des formats de fichiers
 * 
 * Le hook utilise Papa Parse pour le parsing CSV et coordonne
 * les parsers spécialisés (metadataParser, concordanceParser).
 * 
 * @module hooks/useFileUpload
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';
import { parseMetadataFile } from '../utils/parsers/metadataParser';
import { parseNoSketchCSV, validateNoSketchFormat } from '../utils/parsers/concordanceParser';

/**
 * Hook pour gérer l'upload et le parsing de fichiers CSV
 * 
 * Fournit des handlers prêts à l'emploi pour les composants d'upload,
 * avec gestion automatique des états de chargement, erreurs et progression.
 * 
 * Workflow typique :
 * MODE SINGLE :
 * 1. Upload métadonnées → création du lookup
 * 2. Upload concordances A → enrichissement avec métadonnées
 * 3. Affichage des statistiques de matching
 * 
 * MODE COMPARISON (NOUVEAU) :
 * 1. Upload métadonnées → création du lookup (commun aux 2 corpus)
 * 2. Upload concordances A → enrichissement avec métadonnées
 * 3. Upload concordances B → enrichissement avec métadonnées
 * 4. Comparaison des 2 corpus
 * 
 * @returns {Object} Handlers et états pour l'upload de fichiers contenant :
 *                   
 *                   **États** :
 *                   - {boolean} loading - true pendant le parsing
 *                   - {string|null} error - Message d'erreur ou null
 *                   - {string} processingStep - Message de progression
 *                   - {Object} parseStats - Statistiques de parsing :
 *                     - {number} totalReferences - Nombre de concordances
 *                     - {number} successfulMatches - Nombre enrichies
 *                     - {number} failedMatches - Nombre en fallback
 *                     - {string} lookupRate - Taux de correspondance (%)
 *                   - {File|null} selectedMetadataFile - Fichier métadonnées
 *                   - {File|null} selectedConcordanceFile - Fichier concordances A
 *                   - {File|null} selectedConcordanceBFile - Fichier concordances B (NOUVEAU)
 *                   
 *                   **Setters** :
 *                   - {Function} setError - Modifier l'état d'erreur
 *                   - {Function} setProcessingStep - Modifier le message de progression
 *                   
 *                   **Handlers** :
 *                   - {Function} handleMetadataFileUpload - Handler upload métadonnées
 *                   - {Function} handleConcordanceFileUpload - Handler upload concordances A
 *                   - {Function} handleConcordanceFileUploadB - Handler upload concordances B (NOUVEAU)
 * 
 * @example
 * const {
 *   loading,
 *   error,
 *   processingStep,
 *   parseStats,
 *   selectedConcordanceBFile,
 *   handleMetadataFileUpload,
 *   handleConcordanceFileUpload,
 *   handleConcordanceFileUploadB
 * } = useFileUpload();
 * 
 * // Dans un composant - Mode comparison
 * <input
 *   type="file"
 *   onChange={(e) => handleConcordanceFileUploadB(
 *     e.target.files[0],
 *     metadataLookup,
 *     (data) => setCorpusComparison(prev => ({
 *       ...prev,
 *       B: { concordanceData: data, ... }
 *     }))
 *   )}
 * />
 */
export const useFileUpload = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingStep, setProcessingStep] = useState('');
  const [parseStats, setParseStats] = useState({});
  const [selectedMetadataFile, setSelectedMetadataFile] = useState(null);
  const [selectedConcordanceFile, setSelectedConcordanceFile] = useState(null);
  // ✨ NOUVEAU : État pour le fichier concordances B (corpus comparison)
  const [selectedConcordanceBFile, setSelectedConcordanceBFile] = useState(null);

  // ============================================================================
  // HANDLER : CHARGEMENT MÉTADONNÉES PAR DÉFAUT
  // ============================================================================

  /**
   * Charge les métadonnées par défaut depuis le fichier public
   *
   * Cette fonction fetch le fichier de métadonnées par défaut depuis
   * /data/default-metadata.csv et le parse automatiquement au démarrage.
   * L'utilisateur peut toujours remplacer ces métadonnées via l'upload manuel.
   *
   * @param {Function} setMetadataLookup - Setter pour stocker le lookup
   *
   * @example
   * useEffect(() => {
   *   loadDefaultMetadata(setMetadataLookup);
   * }, []);
   */
  const loadDefaultMetadata = (setMetadataLookup) => {
    setLoading(true);
    setProcessingStep(t('concordance.upload.processing.loadingDefaultMetadata'));

    fetch('/data/default-metadata.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Fichier de métadonnées par défaut introuvable');
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: false,
          complete: (results) => {
            try {
              console.log('📊 Chargement métadonnées par défaut...');
              console.log('Lignes CSV:', results.data.length);

              const lookup = parseMetadataFile(results.data);
              const count = Object.keys(lookup).length;

              console.log(`✅ ${count} métadonnées par défaut chargées`);

              setMetadataLookup(lookup);
              setSelectedMetadataFile(null); // Pas de fichier uploadé
              setProcessingStep(`✅ ${count} métadonnées pré-chargées (vous pouvez les remplacer)`);
              setLoading(false);

              // Message reste affiché en permanence (pas de setTimeout)
            } catch (err) {
              console.error('❌ Erreur parsing métadonnées par défaut:', err);
              setError(t('concordance.upload.errors.parsingMetadata', { message: err.message }));
              setLoading(false);
              setProcessingStep('');
            }
          },
          error: (err) => {
            console.error('❌ Erreur parsing CSV:', err);
            setError(t('concordance.upload.errors.parsingMetadata', { message: err.message }));
            setLoading(false);
            setProcessingStep('');
          }
        });
      })
      .catch(err => {
        console.error('❌ Erreur chargement métadonnées par défaut:', err);
        // Ne pas afficher d'erreur si les métadonnées par défaut ne sont pas disponibles
        // L'utilisateur pourra toujours les uploader manuellement
        setLoading(false);
        setProcessingStep('');
      });
  };

  // ============================================================================
  // HANDLER : UPLOAD MÉTADONNÉES
  // ============================================================================

  /**
   * Handler pour l'upload et le parsing du fichier de métadonnées
   *
   * Parse un fichier CSV contenant les métadonnées des œuvres et crée
   * un lookup indexé par identifiant pour un accès rapide lors de
   * l'enrichissement des concordances.
   *
   * Processus :
   * 1. Validation du fichier
   * 2. Parsing CSV avec Papa Parse
   * 3. Création du lookup avec parseMetadataFile
   * 4. Mise à jour des états
   *
   * @param {File} file - Fichier CSV à parser
   * @param {Function} setMetadataLookup - Setter pour stocker le lookup
   *
   * @example
   * handleMetadataFileUpload(file, setMetadataLookup);
   * // Après succès, processingStep affiche "✅ X métadonnées chargées"
   */
  const handleMetadataFileUpload = (file, setMetadataLookup) => {
    if (!file) {
      setError(t('concordance.upload.errors.noFileSelected'));
      return;
    }

    setLoading(true);
    setError(null);
    setProcessingStep(t('concordance.upload.processing.loadingMetadata'));

    Papa.parse(file, {
      header: false,
      complete: (results) => {
        try {
          console.log('📊 Parsing métadonnées...');
          console.log('Lignes CSV:', results.data.length);

          const lookup = parseMetadataFile(results.data);
          const count = Object.keys(lookup).length;

          console.log(`✅ ${count} métadonnées chargées`);

          setMetadataLookup(lookup);
          setSelectedMetadataFile(file);
          setProcessingStep(`✅ ${t('concordance.upload.processing.metadataLoaded', { count })}`);
          setLoading(false);

          // Message reste affiché en permanence (pas de setTimeout)
        } catch (err) {
          console.error('❌ Erreur parsing métadonnées:', err);
          setError(t('concordance.upload.errors.parsingMetadata', { message: err.message }));
          setLoading(false);
          setProcessingStep('');
        }
      },
      error: (err) => {
        console.error('❌ Erreur lecture fichier:', err);
        setError(t('concordance.upload.errors.fileRead', { message: err.message }));
        setLoading(false);
        setProcessingStep('');
      }
    });
  };

  // ============================================================================
  // HANDLER : UPLOAD CONCORDANCES A (Corpus principal)
  // ============================================================================
  
  /**
   * Handler pour l'upload et le parsing du fichier de concordances NoSketch (Corpus A)
   * 
   * Parse un export CSV de NoSketch Engine et enrichit chaque concordance
   * avec les métadonnées correspondantes depuis le lookup.
   * 
   * Processus :
   * 1. Validation du fichier et du lookup
   * 2. Parsing CSV avec Papa Parse
   * 3. Validation du format NoSketch
   * 4. Enrichissement avec parseNoSketchCSV
   * 5. Calcul des statistiques
   * 6. Mise à jour des états
   * 
   * Pré-requis : Le fichier de métadonnées doit avoir été chargé avant
   * (metadataLookup non vide).
   * 
   * @param {File} file - Fichier CSV NoSketch à parser
   * @param {Object} metadataLookup - Lookup des métadonnées (depuis handleMetadataFileUpload)
   * @param {Function} setConcordanceData - Setter pour stocker les concordances
   * 
   * @example
   * handleConcordanceFileUpload(file, metadataLookup, setConcordanceData);
   * // Après succès, parseStats contient les statistiques de matching
   * // processingStep affiche "✅ X concordances analysées"
   */
  const handleConcordanceFileUpload = (file, metadataLookup, setConcordanceData) => {
    if (!file) {
      setError(t('concordance.upload.errors.noFileSelected'));
      return;
    }

    if (Object.keys(metadataLookup).length === 0) {
      setError(t('concordance.upload.errors.loadMetadataFirst'));
      return;
    }

    setLoading(true);
    setProcessingStep(t('concordance.upload.processing.analyzingConcordancesA'));

    Papa.parse(file, {
      header: false,
      complete: (results) => {
        try {
          console.log('🧪 Début parsing concordances A');
          console.log('📊 Lignes CSV:', results.data.length);

          // Validation du format
          console.log('🔍 Validation du format NoSketch...');
          const validation = validateNoSketchFormat(results.data);

          if (!validation.valid) {
            throw new Error(validation.error);
          }
          console.log('✅ Format validé');

          // Parsing avec enrichissement métadonnées
          console.log('⚙️ Parsing en cours...');
          const result = parseNoSketchCSV(results.data, metadataLookup);

          // Mettre à jour les états
          setConcordanceData(result.concordances);
          setParseStats(result.stats);
          setSelectedConcordanceFile(file);
          setProcessingStep(`✅ ${t('concordance.upload.processing.concordancesAnalyzedA', { count: result.concordances.length })}`);

          // Afficher les statistiques
          console.log('\n' + '='.repeat(70));
          console.log('📊 STATISTIQUES CORPUS A');
          console.log('='.repeat(70));
          console.log(`Total : ${result.stats.totalReferences}`);
          console.log(`Enrichies : ${result.stats.successfulMatches} ✅`);
          console.log(`Fallback : ${result.stats.failedMatches} ⚠️`);
          console.log(`Taux : ${result.stats.lookupRate}%`);
          console.log('='.repeat(70));

          // Afficher 3 exemples
          console.log('\n📄 EXEMPLES:');
          result.concordances.slice(0, 3).forEach((c, i) => {
            console.log(`\n${i + 1}. "${c.kwic}"`);
            console.log(`   Auteur: ${c.author}`);
            console.log(`   ${c.fromLookup ? '✅ Enrichi' : '⚠️ Fallback'}`);
          });

          console.log('\n✅ Parsing Corpus A terminé !');

          setLoading(false);
          setTimeout(() => setProcessingStep(''), 5000);
        } catch (err) {
          console.error('❌ Erreur parsing concordances A:', err);
          setError(t('concordance.upload.errors.parsingConcordancesA', { message: err.message }));
          setLoading(false);
          setProcessingStep('');
        }
      },
      error: (err) => {
        console.error('❌ Erreur lecture fichier:', err);
        setError(t('concordance.upload.errors.fileRead', { message: err.message }));
        setLoading(false);
        setProcessingStep('');
      }
    });
  };

  // ============================================================================
  // ✨ NOUVEAU : HANDLER UPLOAD CONCORDANCES B (Corpus comparison)
  // ============================================================================
  
  /**
   * Handler pour l'upload et le parsing du second fichier de concordances NoSketch (Corpus B)
   * 
   * Identique à handleConcordanceFileUpload mais pour le corpus B dans le mode comparison.
   * Utilise le même lookup de métadonnées que le corpus A.
   * 
   * Processus :
   * 1. Validation du fichier et du lookup
   * 2. Parsing CSV avec Papa Parse
   * 3. Validation du format NoSketch
   * 4. Enrichissement avec parseNoSketchCSV
   * 5. Calcul des statistiques
   * 6. Mise à jour des états
   * 
   * Pré-requis : Le fichier de métadonnées doit avoir été chargé avant
   * (metadataLookup non vide).
   * 
   * @param {File} file - Fichier CSV NoSketch à parser (Corpus B)
   * @param {Object} metadataLookup - Lookup des métadonnées (depuis handleMetadataFileUpload)
   * @param {Function} setConcordanceDataB - Setter pour stocker les concordances du corpus B
   * 
   * @example
   * handleConcordanceFileUploadB(file, metadataLookup, (data) => {
   *   setCorpusComparison(prev => ({
   *     ...prev,
   *     B: { concordanceData: data, ... }
   *   }));
   * });
   */
  const handleConcordanceFileUploadB = (file, metadataLookup, setConcordanceDataB) => {
    if (!file) {
      setError(t('concordance.upload.errors.noFileSelected'));
      return;
    }

    if (Object.keys(metadataLookup).length === 0) {
      setError(t('concordance.upload.errors.loadMetadataFirst'));
      return;
    }

    setLoading(true);
    setProcessingStep(t('concordance.upload.processing.analyzingConcordancesB'));

    Papa.parse(file, {
      header: false,
      complete: (results) => {
        try {
          console.log('🧪 Début parsing concordances B');
          console.log('📊 Lignes CSV:', results.data.length);

          // Validation du format
          console.log('🔍 Validation du format NoSketch...');
          const validation = validateNoSketchFormat(results.data);

          if (!validation.valid) {
            throw new Error(validation.error);
          }
          console.log('✅ Format validé');

          // Parsing avec enrichissement métadonnées
          console.log('⚙️ Parsing en cours...');
          const result = parseNoSketchCSV(results.data, metadataLookup);

          // Mettre à jour les états via le setter fourni
          setConcordanceDataB(result.concordances);
          setSelectedConcordanceBFile(file);
          setProcessingStep(`✅ ${t('concordance.upload.processing.concordancesAnalyzedB', { count: result.concordances.length })}`);

          // Afficher les statistiques
          console.log('\n' + '='.repeat(70));
          console.log('📊 STATISTIQUES CORPUS B');
          console.log('='.repeat(70));
          console.log(`Total : ${result.stats.totalReferences}`);
          console.log(`Enrichies : ${result.stats.successfulMatches} ✅`);
          console.log(`Fallback : ${result.stats.failedMatches} ⚠️`);
          console.log(`Taux : ${result.stats.lookupRate}%`);
          console.log('='.repeat(70));

          // Afficher 3 exemples
          console.log('\n📄 EXEMPLES:');
          result.concordances.slice(0, 3).forEach((c, i) => {
            console.log(`\n${i + 1}. "${c.kwic}"`);
            console.log(`   Auteur: ${c.author}`);
            console.log(`   ${c.fromLookup ? '✅ Enrichi' : '⚠️ Fallback'}`);
          });

          console.log('\n✅ Parsing Corpus B terminé !');

          setLoading(false);
          setTimeout(() => setProcessingStep(''), 5000);
        } catch (err) {
          console.error('❌ Erreur parsing concordances B:', err);
          setError(t('concordance.upload.errors.parsingConcordancesB', { message: err.message }));
          setLoading(false);
          setProcessingStep('');
        }
      },
      error: (err) => {
        console.error('❌ Erreur lecture fichier:', err);
        setError(t('concordance.upload.errors.fileRead', { message: err.message }));
        setLoading(false);
        setProcessingStep('');
      }
    });
  };

  // ============================================================================
  // RETOUR DU HOOK
  // ============================================================================
  return {
    // États
    loading,
    error,
    processingStep,
    parseStats,
    selectedMetadataFile,
    selectedConcordanceFile,
    selectedConcordanceBFile, // ✨ NOUVEAU

    // Setters (pour permettre au composant parent de modifier les états si besoin)
    setError,
    setProcessingStep,

    // Handlers
    loadDefaultMetadata, // ✨ NOUVEAU : Chargement automatique des métadonnées
    handleMetadataFileUpload,
    handleConcordanceFileUpload,
    handleConcordanceFileUploadB // ✨ NOUVEAU
  };
};
