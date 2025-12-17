import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ExportButtons from '../ui/ExportButtons';
import Pagination from '../ui/Pagination';
import usePagination from '../../hooks/usePagination';

/**
 * Composant DataView - Vue des concordances détaillées avec pagination
 * 
 * Affiche les concordances avec leurs métadonnées complètes de manière paginée
 * pour améliorer les performances avec de gros corpus (>1000 concordances).
 * Permet de contrôler l'affichage du contexte (ligne ou complet).
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.filteredData - Données filtrées à afficher
 * @param {Object} props.analytics - Statistiques calculées
 * @param {Function} props.onExportConcordances - Handler d'export CSV
 * @param {Function} props.onExportAnalytics - Handler d'export JSON
 * 
 * @example
 * <DataView
 *   filteredData={filteredData}
 *   analytics={analytics}
 *   onExportConcordances={handleExportCSV}
 *   onExportAnalytics={handleExportJSON}
 * />
 */
const DataView = ({
  filteredData,
  analytics,
  onExportConcordances,
  onExportAnalytics
}) => {
  // ============================================================================
  // HOOK DE TRADUCTION
  // ============================================================================
  
  const { t } = useTranslation();
  
  // ============================================================================
  // ÉTATS LOCAUX
  // ============================================================================
  
  /**
   * État pour contrôler l'affichage du contexte
   * - 'line' : affiche 80 caractères de contexte avec ellipses
   * - 'full' : affiche le contexte complet sans troncature
   */
  const [contextDisplay, setContextDisplay] = useState('line');

  // ============================================================================
  // HOOKS - Pagination et scroll
  // ============================================================================
  
  /**
   * Hook de pagination personnalisé
   * - Gère l'affichage par pages (défaut: 50 items/page)
   * - Persiste le choix dans localStorage avec la clé 'dataview-pagination'
   * - Retourne les données paginées et les fonctions de navigation
   */
  const {
    currentPage,        // Numéro de page actuelle (1-indexed)
    totalPages,         // Nombre total de pages
    itemsPerPage,       // Nombre d'items par page (25/50/100/-1)
    paginatedData,      // Données de la page actuelle uniquement
    goToPage,           // Fonction pour aller à une page spécifique
    setItemsPerPage,    // Fonction pour changer le nombre d'items/page
    startIndex,         // Index du premier item affiché (0-indexed)
    endIndex,           // Index du dernier item affiché (0-indexed)
    totalItems,         // Nombre total d'items
  } = usePagination(filteredData, 50, 'dataview-pagination');

  /**
   * Ref pour le conteneur principal
   * Utilisée pour le scroll automatique en haut lors du changement de page
   */
  const contentRef = useRef(null);

  /**
   * Effect - Scroll automatique en haut de la liste lors du changement de page
   * Améliore l'UX en évitant à l'utilisateur de scroller manuellement
   */
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // ============================================================================
  // FONCTIONS UTILITAIRES - Gestion du contexte
  // ============================================================================

  /**
   * Obtient le texte contextuel selon le mode d'affichage
   * @param {string} text - Texte complet
   * @param {string} position - 'left' ou 'right'
   * @returns {string} Texte formaté (tronqué ou complet)
   */
  const getContextText = (text, position) => {
    if (contextDisplay === 'full') {
      return text;
    }
    // Mode 'line' : limite à 80 caractères
    return position === 'left' ? text.slice(-80) : text.slice(0, 80);
  };

  /**
   * Détermine si on doit afficher les ellipses
   * @param {string} text - Texte complet
   * @param {string} position - 'left' ou 'right'
   * @returns {boolean} true si le texte est tronqué
   */
  const shouldShowEllipsis = (text, position) => {
    if (contextDisplay === 'full') return false;
    return text.length > 80;
  };

  // ============================================================================
  // RENDU
  // ============================================================================

  return (
    <div>
      {/* Cas où des données sont disponibles */}
      {filteredData.length > 0 ? (
        <>
          {/* ========== BOUTONS D'EXPORT ========== */}
          <ExportButtons
            filteredData={filteredData}
            analytics={analytics}
            viewType="domains"
            onExportConcordances={onExportConcordances}
            onExportAnalytics={onExportAnalytics}
          />
          
          {/* ========== CONTENEUR PRINCIPAL ========== */}
          <div 
            ref={contentRef}  // Ref pour le scroll automatique
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '2rem',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* ========== EN-TÊTE : Titre + Sélecteur contexte ========== */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h4 style={{
                fontSize: '1.55rem',
                fontWeight: '500',
                color: '#1e293b',
                margin: 0
              }}>
                {t('concordance.dataView.title')}
              </h4>

              {/* Sélecteur d'affichage du contexte (ligne/complet) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{
                  fontSize: '1.15rem',
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  {t('concordance.dataView.contextDisplay')}
                </span>
                <div style={{
                  display: 'flex',
                  background: '#f1f5f9',
                  borderRadius: '6px',
                  padding: '0.25rem',
                  gap: '0.25rem'
                }}>
                  {/* Bouton "Une ligne" (80 caractères) */}
                  <button
                    onClick={() => setContextDisplay('line')}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: contextDisplay === 'line' ? '#1A365D' : 'transparent',
                      color: contextDisplay === 'line' ? 'white' : '#64748b',
                      fontWeight: '500',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    📝 {t('concordance.dataView.oneLine')}
                  </button>
                  {/* Bouton "Texte complet" */}
                  <button
                    onClick={() => setContextDisplay('full')}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: contextDisplay === 'full' ? '#1A365D' : 'transparent',
                      color: contextDisplay === 'full' ? 'white' : '#64748b',
                      fontWeight: '500',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ⟐ {t('concordance.dataView.fullText')}
                  </button>
                </div>
              </div>
            </div>
            
            {/* ========== PAGINATION SUPÉRIEURE ========== */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              onPageChange={goToPage}
              onItemsPerPageChange={setItemsPerPage}
            />
            
            {/* ========== LISTE DES CONCORDANCES PAGINÉES ========== */}
            <div style={{ marginTop: '1rem' }}>
              {/* 
                IMPORTANT : On utilise paginatedData au lieu de filteredData
                Cela affiche uniquement les items de la page actuelle
              */}
              {paginatedData.map((item) => (
                <div key={item.id} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  // Bordure gauche colorée selon source (enrichi = vert, parsé = rouge)
                  borderLeft: item.fromLookup ? '4px solid #10b981' : '4px solid #ef4444',
                  borderRadius: '0 6px 6px 0',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  transition: 'all 0.2s ease'
                }}>
                  
                  {/* ===== MÉTADONNÉES ===== */}
                  <div style={{
                    fontSize: '1.15rem',
                    color: '#6b7280',
                    marginBottom: '1rem',
                    fontWeight: '500'
                  }}>
                    {/* Grid responsive pour les métadonnées */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.5rem'
                    }}>
                      <div><strong>{t('concordance.dataView.metadata.author')}</strong> {item.author}</div>
                      <div><strong>{t('concordance.dataView.metadata.title')}</strong> {item.title}</div>
                      <div><strong>{t('concordance.dataView.metadata.period')}</strong> {item.period}</div>
                      <div><strong>{t('concordance.dataView.metadata.place')}</strong> {item.place}</div>
                      <div><strong>{t('concordance.dataView.metadata.domain')}</strong> {item.domain}</div>
                      {/* Page optionnelle (si disponible) */}
                      {item.page && <div><strong>{t('concordance.dataView.metadata.page')}</strong> {item.page}</div>}
                    </div>

                    {/* Badge de source et identifiants */}
                    <div style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      {/* Badge coloré selon la source de données */}
                      <span style={{
                        background: item.fromLookup ? '#dcfce7' : '#fef2f2',
                        color: item.fromLookup ? '#166534' : '#dc2626',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>
                        {item.fromLookup ? `✓ ${t('concordance.dataView.badges.enriched')}` : `⚠ ${t('concordance.dataView.badges.parsed')}`}
                      </span>
                      {/* Identifiants techniques (debug/traçabilité) */}
                      <span style={{ fontSize: '1.0rem', color: '#9ca3af' }}>
                        {t('concordance.dataView.metadata.id')} {item.id} • {t('concordance.dataView.metadata.ref')} {item.reference?.substring(0, 50)}...
                      </span>
                    </div>
                  </div>
                  
                  {/* ===== CONCORDANCE (KWIC) ===== */}
                  {/*
                    Format KWIC : Left + KWIC + Right
                    - Left : contexte gauche (80 car. en mode ligne, complet en mode full)
                    - KWIC : mot-clé en contexte (surligné en jaune)
                    - Right : contexte droit (80 car. en mode ligne, complet en mode full)
                  */}
                  <div style={{
                    fontSize: '1.4rem',
                    lineHeight: '1.6',
                    color: '#1f2937'
                  }}>
                    {/* Contexte gauche (grisé) avec ellipses si tronqué */}
                    <span style={{ color: '#6b7280' }}>
                      {shouldShowEllipsis(item.left, 'left') && '...'}
                      {getContextText(item.left, 'left')}
                    </span>
                    {/* Mot-clé en contexte (KWIC) - surligné */}
                    <span style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: '600',
                      margin: '0 0.25rem',
                      border: '1px solid #fcd34d'
                    }}>
                      {item.kwic}
                    </span>
                    {/* Contexte droit (grisé) avec ellipses si tronqué */}
                    <span style={{ color: '#6b7280' }}>
                      {getContextText(item.right, 'right')}
                      {shouldShowEllipsis(item.right, 'right') && '...'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* ========== PAGINATION INFÉRIEURE ========== */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              onPageChange={goToPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
      ) : (
  	<>
    	  {/* ========== CAS VIDE : Aucune donnée ========== */}
    	  <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
      	   <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
      	   <h3>{t('concordance.dataView.noData')}</h3>
      	   <p>{t('concordance.dataView.importFirst')}</p>
    	  </div>
  	</>
      )}
    </div>
  );
};

export default DataView;
