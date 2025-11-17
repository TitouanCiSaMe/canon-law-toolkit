/**
 * useBreakpoint.js - Hook pour détecter la taille d'écran
 *
 * Permet de réagir aux changements de taille d'écran et d'adapter
 * les composants en fonction des breakpoints définis dans globalTheme
 *
 * @module useBreakpoint
 */

import { useState, useEffect } from 'react';
import { globalTheme } from '../theme/globalTheme';

/**
 * Hook pour détecter la taille d'écran actuelle
 *
 * @returns {Object} Informations sur la taille d'écran
 * @property {string} breakpoint - Breakpoint actuel ('xs', 'sm', 'md', 'lg', 'xl', 'xxl')
 * @property {number} width - Largeur actuelle de la fenêtre
 * @property {boolean} isMobile - true si <= md (mobile/tablet portrait)
 * @property {boolean} isTablet - true si entre md et lg
 * @property {boolean} isDesktop - true si >= lg
 * @property {Function} isUp - Vérifie si >= breakpoint donné
 * @property {Function} isDown - Vérifie si < breakpoint donné
 *
 * @example
 * const { isMobile, isDesktop, breakpoint } = useBreakpoint();
 *
 * return (
 *   <div>
 *     {isMobile && <MobileMenu />}
 *     {isDesktop && <DesktopSidebar />}
 *     <p>Breakpoint actuel: {breakpoint}</p>
 *   </div>
 * );
 */
export const useBreakpoint = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    // Handler pour mettre à jour la taille
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Ajouter le listener
    window.addEventListener('resize', handleResize);

    // Appel initial
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Déterminer le breakpoint actuel
  const getCurrentBreakpoint = () => {
    const { width } = windowSize;
    const { values } = globalTheme.breakpoints;

    if (width >= values.xxl) return 'xxl';
    if (width >= values.xl) return 'xl';
    if (width >= values.lg) return 'lg';
    if (width >= values.md) return 'md';
    if (width >= values.sm) return 'sm';
    return 'xs';
  };

  const breakpoint = getCurrentBreakpoint();
  const { values } = globalTheme.breakpoints;

  // Helpers pour les vérifications courantes
  const isUp = (bp) => windowSize.width >= values[bp];
  const isDown = (bp) => windowSize.width < values[bp];

  return {
    breakpoint,
    width: windowSize.width,
    height: windowSize.height,

    // Helpers de catégorie
    isMobile: windowSize.width < values.md,      // < 768px
    isTablet: windowSize.width >= values.md && windowSize.width < values.lg,  // 768-1023px
    isDesktop: windowSize.width >= values.lg,    // >= 1024px

    // Helpers fonctionnels
    isUp,
    isDown,

    // Accès direct aux valeurs de breakpoints
    values
  };
};

/**
 * Hook pour détecter si on est en mode mobile uniquement
 * Version simplifiée pour les cas d'usage courants
 *
 * @returns {boolean} true si mobile (< 768px)
 *
 * @example
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileView /> : <DesktopView />;
 */
export const useIsMobile = () => {
  const { isMobile } = useBreakpoint();
  return isMobile;
};

/**
 * Hook pour obtenir des valeurs responsives basées sur le breakpoint
 *
 * @param {Object} values - Objet avec valeurs par breakpoint
 * @returns {*} Valeur correspondant au breakpoint actuel
 *
 * @example
 * const columns = useResponsiveValue({
 *   xs: 1,
 *   sm: 2,
 *   md: 3,
 *   lg: 4
 * });
 *
 * // columns sera 1, 2, 3 ou 4 selon la taille d'écran
 */
export const useResponsiveValue = (values) => {
  const { breakpoint } = useBreakpoint();

  // Ordre des breakpoints du plus grand au plus petit
  const breakpoints = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

  // Trouver la valeur la plus proche définie
  const currentIndex = breakpoints.indexOf(breakpoint);

  for (let i = currentIndex; i < breakpoints.length; i++) {
    const bp = breakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  // Fallback sur la première valeur définie
  return values[breakpoints[breakpoints.length - 1]];
};

export default useBreakpoint;
