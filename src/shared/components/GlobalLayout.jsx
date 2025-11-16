/**
 * GlobalLayout - Layout principal avec sidebar verticale
 * 
 * Structure :
 * - Sidebar fixe à gauche (280px)
 * - Zone principale à droite (flex)
 * - Header minimal en haut (optionnel)
 * 
 * @component
 */

import React from 'react';
import Sidebar from './Sidebar';

/**
 * GlobalLayout component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu à afficher
 * @param {string} props.activeView - Vue active (pour sidebar)
 * @param {Function} props.onViewChange - Callback changement de vue
 * @param {number} props.concordanceCount - Nombre de concordances
 * @param {number} props.activeFiltersCount - Nombre de filtres actifs
 * @param {Function} props.onFiltersClick - Callback ouverture filtres
 * @param {boolean} props.showSidebar - Afficher la sidebar (défaut: true)
 * @param {boolean} props.isInConcordanceAnalyzer - Si on est dans concordance analyzer
 */
const GlobalLayout = ({ 
  children,
  activeView,
  onViewChange,
  concordanceCount,
  activeFiltersCount,
  onFiltersClick,
  showSidebar = true,
  isInConcordanceAnalyzer = false
}) => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#EDF2F7'
    }}>
      {/* Sidebar fixe à gauche */}
      {showSidebar && (
        <Sidebar
          activeView={activeView}
          onViewChange={onViewChange}
          concordanceCount={concordanceCount}
          activeFiltersCount={activeFiltersCount}
          onFiltersClick={onFiltersClick}
          isInConcordanceAnalyzer={isInConcordanceAnalyzer}
        />
      )}

      {/* Zone principale */}
      <main style={{
        marginLeft: showSidebar ? '280px' : '0',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: showSidebar ? 'calc(100% - 280px)' : '100%'
      }}>
        {children}
      </main>
    </div>
  );
};

export default GlobalLayout;
