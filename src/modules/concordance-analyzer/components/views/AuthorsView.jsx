import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ExportButtons from '../ui/ExportButtons';
import AuthorChart from '../charts/AuthorChart';

/**
 * Composant AuthorsView - Vue de la distribution par auteurs
 * 
 * Page complète affichant la distribution des concordances selon les auteurs.
 * Intègre un graphique interactif et des boutons d'export complets.
 * 
 * Structure de la vue :
 * 1. Barre d'export (CSV, JSON, PNG)
 * 2. Titre de section
 * 3. Graphique (barres horizontales)
 * 
 * Fonctionnalités :
 * - Affichage graphique (barres par défaut)
 * - Export données (CSV concordances, JSON analytics)
 * - Export graphique (PNG haute résolution)
 * - Top 15 auteurs par défaut
 * - Responsive design
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<Object>} props.filteredData - Concordances filtrées actives
 * @param {Object} props.analytics - Statistiques calculées avec analytics.authors
 * @param {Function} props.onExportConcordances - Handler pour export CSV des concordances
 * @param {Function} props.onExportAnalytics - Handler pour export JSON des analytics
 * 
 * @returns {JSX.Element} Vue complète de la distribution par auteurs
 * 
 * @example
 * // Usage dans ConcordanceAnalyzer.js
 * <AuthorsView
 *   filteredData={filteredConcordances}
 *   analytics={calculatedAnalytics}
 *   onExportConcordances={() => exportConcordancesCSV(filteredData)}
 *   onExportAnalytics={() => exportAnalyticsJSON(analytics)}
 * />
 * 
 * @example
 * // Données attendues dans analytics.authors
 * {
 *   authors: [
 *     { name: 'Gratien', value: 456 },
 *     { name: 'Raymond de Peñafort', value: 234 },
 *     { name: 'Anonyme', value: 189 }
 *   ]
 * }
 */
const AuthorsView = ({
  filteredData,           // Données filtrées courantes
  analytics,              // Statistiques pré-calculées
  onExportConcordances,   // Handler export CSV
  onExportAnalytics       // Handler export JSON
}) => {
  
  // ============================================================================
  // HOOK DE TRADUCTION
  // ============================================================================
  
  const { t } = useTranslation();
  
  // ============================================================================
  // GÉNÉRATION D'ID UNIQUE POUR LE GRAPHIQUE
  // ============================================================================
  
  /**
   * ID unique et stable pour le conteneur du graphique
   * 
   * Technique :
   * - useRef() : Garantit stabilité entre re-renders
   * - Date.now() : Garantit unicité si plusieurs vues ouvertes
   * - .current : Extrait la valeur du ref
   * 
   * Pourquoi c'est critique :
   * - html2canvas a besoin d'un ID stable pour capturer l'élément
   * - Si l'ID change à chaque render, l'export peut échouer
   * - useRef() évite ce problème en stockant l'ID initial
   * 
   * @type {string}
   */
  const chartId = useRef(`authors-chart-${Date.now()}`).current;

  // ============================================================================
  // RENDU DU COMPOSANT
  // ============================================================================
  
  return (
    <div>
      
      {/* ====================================================================
          SECTION 1 : BARRE D'EXPORT
          ==================================================================== */}
      
      {/**
       * Groupe de boutons d'export centralisé
       * 
       * Props passées :
       * - filteredData : Pour activer/désactiver les boutons selon données
       * - analytics : Pour l'export JSON des statistiques
       * - chartId : CRITIQUE - permet à ExportButtons de savoir quel graphique exporter
       * - chartName : Nom de base du fichier PNG (ex: "graphique_auteurs_2025-10-22.png")
       * - handlers : Fonctions d'export fournies par le parent (ConcordanceAnalyzer)
       */}
      <ExportButtons
        filteredData={filteredData}
        analytics={analytics}
        chartId={chartId}                    // Lien vers le graphique ci-dessous
        chartName="graphique_auteurs"        // Nom du fichier PNG
        onExportConcordances={onExportConcordances}
        onExportAnalytics={onExportAnalytics}
      />
      
      {/* ====================================================================
          SECTION 2 : CONTENU PRINCIPAL
          ==================================================================== */}
      
      <div style={{ marginBottom: '3rem' }}>
        
        {/* ==================================================================
            TITRE DE LA SECTION
            ================================================================== */}
        
        {/**
         * Titre descriptif de la vue
         * Style académique sobre
         */}
        <h4 style={{
          fontSize: '1.25rem',         // Taille légèrement plus grande
          fontWeight: '500',           // Semi-gras (pas trop lourd)
          marginBottom: '2rem',        // Espacement avant graphique
          color: '#1e293b'             // Gris très foncé (presque noir)
        }}>
          {t('concordance.views.authors.sectionTitle')}
        </h4>
        
        {/* ==================================================================
            GRAPHIQUE
            ================================================================== */}
        
        {/**
         * Composant graphique Recharts
         * 
         * Props :
         * - data : Provient de analytics.authors (calculé par useAnalytics)
         * - type : 'bar' pour affichage en barres horizontales
         * - height : 500px (hauteur étendue pour 15 items)
         * - maxItems : 15 auteurs maximum affichés
         * - chartId : ID CRITIQUE passé depuis le useRef ci-dessus
         * 
         * Flux de données :
         * filteredData → useAnalytics → analytics.authors → AuthorChart
         */}
        <AuthorChart 
          data={analytics.authors}     // Données pré-calculées
          type="bar"                   // Mode barres horizontales
          height={500}                 // Hauteur fixe
          maxItems={15}                // Top 15 auteurs
          chartId={chartId}            // ID pour export PNG
        />
      </div>
    </div>
  );
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default AuthorsView;

// ============================================================================
// NOTES D'INTÉGRATION
// ============================================================================

/**
 * UTILISATION DANS ConcordanceAnalyzer.js :
 * 
 * 1. Importer la vue :
 *    import AuthorsView from './views/AuthorsView';
 * 
 * 2. Dans le switch/case des vues :
 *    case 'authors':
 *      return (
 *        <AuthorsView
 *          filteredData={filteredConcordances}
 *          analytics={calculatedAnalytics}
 *          onExportConcordances={() => exportConcordancesCSV(filteredData)}
 *          onExportAnalytics={() => exportAnalyticsJSON(analytics)}
 *        />
 *      );
 * 
 * 3. Données requises :
 *    - analytics.authors doit être un Array<{name: string, value: number}>
 *    - Calculé par useAnalytics(filteredData)
 */

/**
 * FLUX COMPLET DE L'EXPORT PNG :
 * 
 * 1. Utilisateur clique sur "📷 Export graphique PNG"
 *    ↓
 * 2. ExportButtons.handleExportChart() appelé
 *    ↓
 * 3. exportChartAsPNG(chartId, "graphique_auteurs", {scale: 2})
 *    ↓
 * 4. html2canvas capture l'élément avec id="authors-chart-1234567890"
 *    ↓
 * 5. Canvas → Blob PNG
 *    ↓
 * 6. Téléchargement automatique : "graphique_auteurs_2025-10-22.png"
 * 
 * Points critiques :
 * - chartId doit être identique entre AuthorChart et ExportButtons
 * - Le graphique doit être rendu (visible) au moment de l'export
 * - Le conteneur doit avoir un fond blanc explicite
 */

/**
 * PERSONNALISATION :
 * 
 * Pour changer le nombre d'auteurs affichés :
 * <AuthorChart maxItems={20} ... />  // Top 20 au lieu de 15
 * 
 * Pour changer la hauteur :
 * <AuthorChart height={700} ... />  // Plus grand pour plus d'items
 * 
 * Pour changer l'orientation :
 * <AuthorChart layout="vertical" ... />  // Barres verticales
 */
