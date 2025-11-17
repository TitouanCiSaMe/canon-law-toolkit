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

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import HamburgerButton from './HamburgerButton';
import { useBreakpoint } from '../hooks';

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
  const { isDesktop } = useBreakpoint();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#EDF2F7'
    }}>
      {/* Bouton hamburger (mobile uniquement) */}
      {!isDesktop && showSidebar && (
        <HamburgerButton
          isOpen={isMobileMenuOpen}
          onClick={toggleMobileMenu}
          ariaLabel={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          activeView={activeView}
          onViewChange={onViewChange}
          concordanceCount={concordanceCount}
          activeFiltersCount={activeFiltersCount}
          onFiltersClick={onFiltersClick}
          isInConcordanceAnalyzer={isInConcordanceAnalyzer}
          isOpen={isDesktop || isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
      )}

      {/* Zone principale */}
      <main style={{
        marginLeft: showSidebar && isDesktop ? '280px' : '0',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: showSidebar && isDesktop ? 'calc(100% - 280px)' : '100%',
        overflow: 'hidden'
      }}>
        {children}
      </main>
    </div>
  );
};

export default GlobalLayout;
