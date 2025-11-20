import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilteredData } from './hooks/useFilteredData';
import { useAnalytics } from './hooks/useAnalytics';
import { useFileUpload } from './hooks/useFileUpload';
import { useBreakpoint } from '../../shared/hooks';
import { useMobileMenu } from '../../shared/contexts/MobileMenuContext';
import FilterMenu from './components/ui/FilterMenu';
import UploadInterface from './components/ui/UploadInterface';
import { exportConcordancesCSV, exportAnalyticsJSON } from './utils/ExportUtils';
import { panelConfig, academicColors } from './config/panelConfig';
import OverviewView from './components/views/OverviewView';
import DomainsView from './components/views/DomainsView';
import TemporalView from './components/views/TemporalView';
import AuthorsView from './components/views/AuthorsView';
import PlacesView from './components/views/PlacesView';
import LinguisticView from './components/views/LinguisticView';
import DataView from './components/views/DataView';
import WordCloudView from './components/views/WordCloudView';
import ComparisonView from './components/views/ComparisonView';
import CorpusComparisonView from './components/views/CorpusComparisonView';
import HamburgerButton from '../../shared/components/HamburgerButton';

const ConcordanceAnalyzerPanels = () => {
  // Hook de traduction
  const { t } = useTranslation();

  // Hook responsive
  const { isDesktop } = useBreakpoint();

  // Hook menu mobile
  const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();

  // ============================================================================
  // MODE DETECTION : Single corpus vs Comparison
  // ============================================================================
  
  /**
   * Mode de fonctionnement de l'application :
   * - 'single' : Un seul corpus (comportement historique)
   * - 'comparison' : Deux corpus distincts (nouveau)
   * 
   * Le mode bascule automatiquement selon le nombre de fichiers uploadés.
   */
  // eslint-disable-next-line no-unused-vars
  const [mode, setMode] = useState('single');

  // ============================================================================
  // MODE SINGLE : États historiques (CONSERVÉS)
  // ============================================================================
  
  // États principaux
  const [concordanceData, setConcordanceData] = useState([]);
  const [metadataLookup, setMetadataLookup] = useState({});

  // ============================================================================
  // MODE COMPARISON : Nouveaux états (AJOUT)
  // ============================================================================
  
  /**
   * État pour la comparaison de 2 corpus distincts.
   * Chaque corpus (A et B) possède ses propres données et métadonnées.
   * Cet état n'est utilisé QUE quand mode === 'comparison'.
   */
  // eslint-disable-next-line no-unused-vars
  const [corpusComparison, setCorpusComparison] = useState({
    A: { 
      concordanceData: null,
      metadataLookup: null,
      metadata: { 
        filename: '', 
        uploadDate: null,
        itemCount: 0 
      }
    },
    B: { 
      concordanceData: null,
      metadataLookup: null,
      metadata: { 
        filename: '', 
        uploadDate: null,
        itemCount: 0 
      }
    }
  });

  // ============================================================================
  // ÉTATS COMMUNS (mode single ET comparison)
  // ============================================================================
  
  const [activeView, setActiveView] = useState('overview');
  const [dragOver, setDragOver] = useState(false);
  
  // Hook personnalisé pour l'upload de fichiers
  const {
    error,
    processingStep,
    parseStats,
    selectedMetadataFile,
    selectedConcordanceFile,
    selectedConcordanceBFile, // ✨ NOUVEAU
    setProcessingStep, // ✨ Setter pour afficher le statut des métadonnées
    loadDefaultMetadata, // ✨ NOUVEAU : Pré-chargement métadonnées
    handleMetadataFileUpload,
    handleConcordanceFileUpload,
    handleConcordanceFileUploadB // ✨ NOUVEAU
  } = useFileUpload();

  // ============================================================================
  // PERSISTENCE : Restauration depuis sessionStorage au montage
  // ============================================================================

  useEffect(() => {
    let hasRestoredData = false;

    try {
      // Restaurer les métadonnées
      const savedMetadata = sessionStorage.getItem('calkit_metadataLookup');
      if (savedMetadata) {
        const parsed = JSON.parse(savedMetadata);
        if (Object.keys(parsed).length > 0) {
          const count = Object.keys(parsed).length;
          console.log('🔄 Restauration des métadonnées depuis sessionStorage');
          setMetadataLookup(parsed);
          setProcessingStep(`✅ ${count} métadonnées restaurées (vous pouvez les remplacer)`);
          hasRestoredData = true;
        }
      }

      // Restaurer les concordances (mode single)
      const savedConcordances = sessionStorage.getItem('calkit_concordanceData');
      if (savedConcordances) {
        const parsed = JSON.parse(savedConcordances);
        if (parsed.length > 0) {
          console.log('🔄 Restauration des concordances depuis sessionStorage');
          setConcordanceData(parsed);
        }
      }

      // Restaurer le mode comparison
      const savedComparison = sessionStorage.getItem('calkit_corpusComparison');
      if (savedComparison) {
        const parsed = JSON.parse(savedComparison);
        if (parsed.A.concordanceData || parsed.B.concordanceData) {
          console.log('🔄 Restauration de la comparaison de corpus depuis sessionStorage');
          setCorpusComparison(parsed);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la restauration depuis sessionStorage:', error);
      // En cas d'erreur, on nettoie le storage corrompu
      sessionStorage.removeItem('calkit_metadataLookup');
      sessionStorage.removeItem('calkit_concordanceData');
      sessionStorage.removeItem('calkit_corpusComparison');
    }

    // Charger les métadonnées par défaut uniquement si aucune n'a été restaurée
    if (!hasRestoredData) {
      console.log('🚀 Pré-chargement des métadonnées par défaut...');
      loadDefaultMetadata(setMetadataLookup);
    }
  }, []); // Exécuté une seule fois au montage

  // ============================================================================
  // PERSISTENCE : Sauvegarde dans sessionStorage à chaque changement
  // ============================================================================

  // Sauvegarder les métadonnées
  useEffect(() => {
    if (Object.keys(metadataLookup).length > 0) {
      try {
        sessionStorage.setItem('calkit_metadataLookup', JSON.stringify(metadataLookup));
        console.log('💾 Métadonnées sauvegardées dans sessionStorage');
      } catch (error) {
        console.error('❌ Erreur sauvegarde métadonnées:', error);
      }
    }
  }, [metadataLookup]);

  // Sauvegarder les concordances (mode single)
  useEffect(() => {
    if (concordanceData.length > 0) {
      try {
        sessionStorage.setItem('calkit_concordanceData', JSON.stringify(concordanceData));
        console.log('💾 Concordances sauvegardées dans sessionStorage');
      } catch (error) {
        console.error('❌ Erreur sauvegarde concordances:', error);
      }
    }
  }, [concordanceData]);

  // Sauvegarder le mode comparison
  useEffect(() => {
    if (corpusComparison.A.concordanceData || corpusComparison.B.concordanceData) {
      try {
        sessionStorage.setItem('calkit_corpusComparison', JSON.stringify(corpusComparison));
        console.log('💾 Comparaison de corpus sauvegardée dans sessionStorage');
      } catch (error) {
        console.error('❌ Erreur sauvegarde comparaison:', error);
      }
    }
  }, [corpusComparison]);
    
  // États pour le système de filtrage
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    authors: [],
    domains: [],
    periods: [],
    places: [],
    searchTerm: ''
  });

  // ============================================================================
  // NAVIGATION
  // ============================================================================
  
  const navigateToView = (viewId) => {
    setActiveView(viewId);
  };

  // ============================================================================
  // HOOKS : Calculs selon le mode
  // ============================================================================
  
  // Mode SINGLE : Comportement historique (CONSERVÉ)
  const filteredDataSingle = useFilteredData(
    mode === 'single' ? concordanceData : [],
    activeFilters
  );
  const analyticsSingle = useAnalytics(filteredDataSingle);

  // Variables d'interface pour compatibilité avec les vues existantes
  // En mode 'single' → pointe vers les données single
  // En mode 'comparison' → données vides (le nouveau panel gérera ses propres analytics)
  const filteredData = mode === 'single' ? filteredDataSingle : [];
  const analytics = mode === 'single' ? analyticsSingle : { 
    total: 0, 
    domains: [], 
    authors: [], 
    periods: [], 
    places: [], 
    keyTerms: [] 
  };

  const activeFilterCount = Object.values(activeFilters).flat().length + 
    (activeFilters.searchTerm ? 1 : 0);

  // ============================================================================
  // HANDLERS : Drag & Drop
  // ============================================================================
  
  // Gestionnaires drag & drop
  const handleDrop = (event, fileType) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
  
    if (file) {
      if (fileType === 'metadata') {
        handleMetadataFileUpload(file, setMetadataLookup);
      } else if (fileType === 'concordanceB') { // ✨ NOUVEAU
        handleConcordanceBUpload(file);
      } else {
        handleConcordanceFileUpload(file, metadataLookup, setConcordanceData);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  // ============================================================================
  // HANDLERS : Upload Concordances B (Mode Comparison)
  // ============================================================================
  
  /**
   * Handler pour l'upload du fichier concordances B (corpus comparison)
   * 
   * Stocke les données dans corpusComparison.B pour utilisation future.
   * Le mode reste en 'single' pour permettre l'utilisation normale des panels.
   * Le basculement en mode 'comparison' se fera lors de la navigation
   * vers le panel CorpusComparison.
   * 
   * @param {File} file - Fichier concordances B à uploader
   */
  const handleConcordanceBUpload = (file) => {
    handleConcordanceFileUploadB(file, metadataLookup, (concordanceDataB) => {
      // Stocker dans corpusComparison.A (données du corpus principal)
      setCorpusComparison(prev => ({
        ...prev,
        A: {
          concordanceData: concordanceData,
          metadataLookup: metadataLookup,
          metadata: {
            filename: selectedConcordanceFile?.name || 'corpus_a.csv',
            uploadDate: new Date(),
            itemCount: concordanceData.length
          }
        },
        B: {
          concordanceData: concordanceDataB,
          metadataLookup: metadataLookup,
          metadata: {
            filename: file.name,
            uploadDate: new Date(),
            itemCount: concordanceDataB.length
          }
        }
      }));
      
      console.log('✅ Corpus B chargé et stocké');
      console.log('📊 Corpus A:', concordanceData.length, 'concordances');
      console.log('📊 Corpus B:', concordanceDataB.length, 'concordances');
      console.log('💡 Mode reste en "single" - Naviguez vers le panel Comparaison pour l\'analyse comparative');
    });
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${academicColors.light} 0%, #E2E8F0 50%, #CBD5E1 100%)`,
      fontFamily: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '1.5rem 2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          {/* MODULE 1 : Titre et breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Bouton hamburger (mobile uniquement) */}
            {!isDesktop && (
              <HamburgerButton
                isOpen={isMobileMenuOpen}
                onClick={toggleMobileMenu}
                ariaLabel={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              />
            )}

            <div>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: '400',
                color: academicColors.primary,
                marginBottom: '0.25rem'
              }}>
                {t('concordance.app.title')}
              </h1>
              <nav style={{
                fontSize: '0.9rem',
                color: '#718096',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {activeView !== 'overview' && (
                  <>
                    <button
                      onClick={() => navigateToView('overview')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: academicColors.primary,
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#F0F4F8'}
                      onMouseOut={(e) => e.target.style.background = 'none'}
                    >
                      {t('concordance.panels.overview.title')}
                    </button>
                    <span style={{ color: '#CBD5E1' }}>›</span>
		    <span style={{ fontWeight: '500', color: '#2D3748' }}>
		      {t(`concordance.panels.${activeView}.title`)}
		    </span>
                  </>
                )}
                {activeView === 'overview' && (
                  <span style={{ fontWeight: '500', color: '#2D3748' }}>
                    {t('concordance.panels.overview.title')}
                  </span>
                )}
              </nav>
            </div>
          </div>

          {/* MODULE 2 : Actions (filtres + langue) */}
            {concordanceData.length > 0 && activeView !== 'overview' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  background: showFilters 
                    ? `linear-gradient(135deg, ${academicColors.primary} 0%, ${academicColors.secondary} 100%)`
                    : '#FFFFFF',
                  color: showFilters ? '#FFFFFF' : '#4A5568',
                  border: showFilters ? 'none' : '2px solid #E2E8F0',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  boxShadow: showFilters 
                    ? '0 4px 12px rgba(10, 102, 194, 0.2)' 
                    : '0 1px 3px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (!showFilters) {
                    e.currentTarget.style.borderColor = academicColors.primary;
                    e.currentTarget.style.color = academicColors.primary;
                  }
                }}
                onMouseOut={(e) => {
                  if (!showFilters) {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.color = '#4A5568';
                  }
                }}
              >
               ⊞ {t('concordance.buttons.filters')}
                {activeFilterCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: '700'
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

          {/* MODULE 3 : Statistiques */}
          <div style={{
            background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
            color: '#F7FAFC',
            padding: '0.75rem 1.25rem',
            borderRadius: '4px',
            textAlign: 'center',
            minWidth: '140px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              fontSize: '1.3rem', 
              fontWeight: '300',
              lineHeight: '1.2'
            }}>
              {analytics.total.toLocaleString()}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              opacity: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {t('concordance.stats.concordances')}
            </div>
            {parseStats.lookupRate && (
              <div style={{ 
                fontSize: '0.7rem', 
                opacity: 0.8,
                marginTop: '0.25rem'
              }}>
                {parseStats.lookupRate}% {t('concordance.stats.enriched')}
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '2rem'
      }}>
	{activeView === 'overview' ? (
	<OverviewView
	  panelConfig={panelConfig}
	  analytics={analytics}
	  parseStats={parseStats}
	  filteredData={filteredData}
	  navigateToView={navigateToView}
	  academicColors={academicColors}
	  corpusComparison={corpusComparison} // ✨ NOUVEAU
	/>
        ) : (
          // VUES DÉTAILLÉES : Contenu spécifique à chaque panel
          <div style={{
            background: '#FFFFFF',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '3rem',
              paddingBottom: '2rem',
              borderBottom: '2px solid #E2E8F0'
            }}>
              <div style={{
                fontSize: '3rem',
                marginRight: '1.5rem',
                color: panelConfig[activeView]?.color
              }}>
                {panelConfig[activeView]?.icon}
              </div>
              <div>
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: '400',
                  color: '#1A202C',
                  marginBottom: '0.5rem'
                }}>
                  {t(`concordance.panels.${activeView}.title`)}
                </h2>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#4A5568',
                  fontStyle: 'italic'
                }}>
                  {t(`concordance.panels.${activeView}.subtitle`)}
                </p>
              </div>
            </div>

            {activeView === 'concordances' ? (
		<UploadInterface
		  metadataLookup={metadataLookup}
		  selectedMetadataFile={selectedMetadataFile}
		  selectedConcordanceFile={selectedConcordanceFile}
		  selectedConcordanceBFile={selectedConcordanceBFile} // ✨ NOUVEAU
		  onMetadataUpload={(file) => handleMetadataFileUpload(file, setMetadataLookup)}
		  onConcordanceUpload={(file) => handleConcordanceFileUpload(file, metadataLookup, setConcordanceData)}
		  onConcordanceBUpload={handleConcordanceBUpload} // ✨ NOUVEAU
		  onDrop={handleDrop}
		  onDragOver={handleDragOver}
		  onDragLeave={handleDragLeave}
		  dragOver={dragOver}
		  parseStats={parseStats}
		  processingStep={processingStep}
		  error={error}
		/>
            ) : activeView === 'domains' ? (
              <DomainsView
                filteredData={filteredData}
                analytics={analytics}
                onExportConcordances={() => exportConcordancesCSV(filteredData)}
                onExportAnalytics={() => exportAnalyticsJSON(analytics)}
              />
	) : activeView === 'temporal' ? (
              <TemporalView
                filteredData={filteredData}
                analytics={analytics}
                onExportConcordances={() => exportConcordancesCSV(filteredData)}
                onExportAnalytics={() => exportAnalyticsJSON(analytics)}
              />
	) : activeView === 'authors' ? (
              <AuthorsView
                filteredData={filteredData}
                analytics={analytics}
                onExportConcordances={() => exportConcordancesCSV(filteredData)}
                onExportAnalytics={() => exportAnalyticsJSON(analytics)}
              />
           ) : activeView === 'linguistic' ? (
              <LinguisticView
                filteredData={filteredData}
                analytics={analytics}
                onExportConcordances={() => exportConcordancesCSV(filteredData)}
                onExportAnalytics={() => exportAnalyticsJSON(analytics)}
              />
            ) : activeView === 'data' ? (
              <DataView
                filteredData={filteredData}
                analytics={analytics}
                onExportConcordances={() => exportConcordancesCSV(filteredData)}
                onExportAnalytics={() => exportAnalyticsJSON(analytics)}
              />
	      ) : activeView === 'corpusComparison' ? (
	        <CorpusComparisonView corpusComparison={corpusComparison} />
              ) : activeView === 'places' ? (
                <PlacesView
                  filteredData={filteredData}
                  analytics={analytics}
                  onExportConcordances={() => exportConcordancesCSV(filteredData)}
                  onExportAnalytics={() => exportAnalyticsJSON(analytics)}
                />
		) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem',
                color: '#4A5568'
              }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
                  Vue : {panelConfig[activeView]?.title}
                </h3>
                <p>{t('common.messages.notImplemented')}</p>
              </div>
            )}
          </div>
        )}
	{/* Menu de filtres */}
	{showFilters && (
  	  <FilterMenu
    	    concordanceData={concordanceData}
    	    filteredData={filteredData}
    	    activeFilters={activeFilters}
    	    setActiveFilters={setActiveFilters}
    	    onClose={() => setShowFilters(false)}
  	  />
	)}
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ConcordanceAnalyzerPanels;
