import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ExportButtons from '../ui/ExportButtons';
import DomainChart from '../charts/DomainChart';

/**
 * Composant DomainsView - Vue de répartition par domaines juridiques
 * 
 * Page complète affichant la distribution des concordances selon les domaines
 * du droit canon (pénal, civil, matrimonial, etc.). Intègre un graphique
 * interactif et des boutons d'export complets.
 * 
 * Structure de la vue :
 * 1. Barre d'export (CSV, JSON, PNG)
 * 2. Titre de section
 * 3. Graphique (camembert par défaut)
 * 
 * Fonctionnalités :
 * - Affichage graphique (pie par défaut)
 * - Export données (CSV concordances, JSON analytics)
 * - Export graphique (PNG haute résolution)
 * - Responsive design
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<Object>} props.filteredData - Concordances filtrées actives
 * @param {Object} props.analytics - Statistiques calculées avec analytics.domains
 * @param {Function} props.onExportConcordances - Handler pour export CSV des concordances
 * @param {Function} props.onExportAnalytics - Handler pour export JSON des analytics
 * 
 * @returns {JSX.Element} Vue complète de la répartition par domaines
 * 
 * @example
 * // Usage dans ConcordanceAnalyzer.js
 * <DomainsView
 *   filteredData={filteredConcordances}
 *   analytics={calculatedAnalytics}
 *   onExportConcordances={() => exportConcordancesCSV(filteredData)}
 *   onExportAnalytics={() => exportAnalyticsJSON(analytics)}
 * />
 * 
 * @example
 * // Données attendues dans analytics.domains
 * {
 *   domains: [
 *     { name: 'Droit pénal canon', value: 342 },
 *     { name: 'Droit matrimonial', value: 256 },
 *     { name: 'Droit sacramentel', value: 189 }
 *   ]
 * }
 */
const DomainsView = ({
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
  const chartId = useRef(`domains-chart-${Date.now()}`).current;

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
       * - chartName : Nom de base du fichier PNG (ex: "graphique_domaines_2025-10-22.png")
       * - handlers : Fonctions d'export fournies par le parent (ConcordanceAnalyzer)
       */}
      <ExportButtons
        filteredData={filteredData}
        analytics={analytics}
        chartId={chartId}                    // Lien vers le graphique ci-dessous
        chartName="graphique_domaines"       // Nom du fichier PNG
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
          {t('views.domains.sectionTitle')}
        </h4>
        
        {/* ==================================================================
            GRAPHIQUE
            ================================================================== */}
        
        {/**
         * Composant graphique Recharts
         * 
         * Props :
         * - data : Provient de analytics.domains (calculé par useAnalytics)
         * - type : 'pie' pour affichage en camembert (meilleur pour proportions)
         * - height : 400px (hauteur standard, ajustable si besoin)
         * - chartId : ID CRITIQUE passé depuis le useRef ci-dessus
         * 
         * Flux de données :
         * filteredData → useAnalytics → analytics.domains → DomainChart
         */}
        <DomainChart 
          data={analytics.domains}     // Données pré-calculées
          type="pie"                   // Mode camembert
          height={400}                 // Hauteur fixe
          chartId={chartId}            // ID pour export PNG
        />
      </div>
    </div>
  );
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default DomainsView;

// ============================================================================
// NOTES D'INTÉGRATION
// ============================================================================

/**
 * UTILISATION DANS ConcordanceAnalyzer.js :
 * 
 * 1. Importer la vue :
 *    import DomainsView from './views/DomainsView';
 * 
 * 2. Dans le switch/case des vues :
 *    case 'domains':
 *      return (
 *        <DomainsView
 *          filteredData={filteredConcordances}
 *          analytics={calculatedAnalytics}
 *          onExportConcordances={() => exportConcordancesCSV(filteredData)}
 *          onExportAnalytics={() => exportAnalyticsJSON(analytics)}
 *        />
 *      );
 * 
 * 3. Données requises :
 *    - analytics.domains doit être un Array<{name: string, value: number}>
 *    - Calculé par useAnalytics(filteredData)
 */

/**
 * FLUX COMPLET DE L'EXPORT PNG :
 * 
 * 1. Utilisateur clique sur "📷 Export graphique PNG"
 *    ↓
 * 2. ExportButtons.handleExportChart() appelé
 *    ↓
 * 3. exportChartAsPNG(chartId, "graphique_domaines", {scale: 2})
 *    ↓
 * 4. html2canvas capture l'élément avec id="domains-chart-1234567890"
 *    ↓
 * 5. Canvas → Blob PNG
 *    ↓
 * 6. Téléchargement automatique : "graphique_domaines_2025-10-22.png"
 * 
 * Points critiques :
 * - chartId doit être identique entre DomainChart et ExportButtons
 * - Le graphique doit être rendu (visible) au moment de l'export
 * - Le conteneur doit avoir un fond blanc explicite
 */

/**
 * PERSONNALISATION :
 * 
 * Pour changer le type de graphique :
 * <DomainChart type="bar" ... />  // Barres au lieu de camembert
 * 
 * Pour changer la hauteur :
 * <DomainChart height={600} ... />  // Plus grand
 * 
 * Pour personnaliser les couleurs :
 * <DomainChart colors={['#1e40af', '#7c3aed', '#059669']} ... />
 */
