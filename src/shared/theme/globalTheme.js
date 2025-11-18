/**
 * globalTheme.js - Système de design unifié Canon Law Toolkit
 * 
 * Thème global fusionnant :
 * - Le thème médiéval de l'interface principale (marron/or)
 * - Le thème moderne du ConcordanceAnalyzer (violet/bleu)
 * 
 * Fournit :
 * - Palettes de couleurs multiples
 * - Espacements standardisés
 * - Ombres et animations
 * - Typographie complète
 * - Helpers réutilisables
 * 
 * @module globalTheme
 */

// ==========================================================================
// 🎨 PALETTES DE COULEURS
// ==========================================================================

/**
 * Palette MÉDIÉVALE - Pour l'interface principale (Header, Footer, Home)
 * Inspirée des manuscrits enluminés
 */
const medievalPalette = {
  primary: {
    main: '#8B4513',      // Brun encre
    light: '#A0522D',     // Brun clair
    dark: '#654321'       // Brun foncé
  },
  secondary: {
    main: '#DAA520',      // Or enluminure
    light: '#F0E68C',     // Or clair
    dark: '#B8860B'       // Or foncé
  },
  accent: {
    main: '#4169E1',      // Lapis-lazuli
    light: '#6495ED',     // Bleu clair
    dark: '#191970'       // Bleu nuit
  }
};

/**
 * Palette ACADÉMIQUE - Pour le module ConcordanceAnalyzer
 * Palette sobre et institutionnelle (bleu marine/gris)
 */
const concordancePalette = {
  primary: {
    main: '#1e3a5f',      // Bleu marine profond (académique)
    light: '#2c5282',     // Bleu marine moyen
    dark: '#1a2f4a',      // Bleu marine très foncé
    blue: '#1e40af',      // Bleu classique
    blueHover: '#1e3a8a'  // Bleu hover plus foncé
  },
  accent: {
    blue: '#334155',      // Gris ardoise (neutre)
    green: '#059669',     // Vert discret (success)
    orange: '#b8860b',    // Or antique (important) - lien avec médiéval
    red: '#dc2626'        // Rouge sobre (erreur)
  }
};

// ==========================================================================
// 🎨 THÈME GLOBAL UNIFIÉ
// ==========================================================================

export const globalTheme = {
  
  // ------------------------------------------------------------------------
  // Palettes disponibles
  // ------------------------------------------------------------------------
  palettes: {
    medieval: medievalPalette,
    concordance: concordancePalette
  },
  
  // ------------------------------------------------------------------------
  // Couleurs par défaut (utilise palette médiévale pour l'interface)
  // ------------------------------------------------------------------------
  colors: {
    // Interface principale
    primary: medievalPalette.primary,
    secondary: medievalPalette.secondary,
    accent: medievalPalette.accent,
    
    // Fond et surfaces
    background: {
      default: '#FFFFFF',   // Fond général (blanc pur - épuré)
      paper: '#FFFFFF',     // Fond des cartes (blanc pur)
      page: '#FAFAFA',      // Fond général de page (gris très clair)
      card: '#FFFFFF',      // Fond des cards (blanc)
      hover: '#f8fafc',     // Hover des options (blanc bleuté très subtil)
      active: '#f1f5f9',    // Fond actif (gris bleuté clair)
      panel: '#FAFAFA'      // Fond panels (gris très clair)
    },
    
    // Texte - Contraste amélioré
    text: {
      primary: '#2C2C2C',     // Titres, texte important (interface)
      secondary: '#5A5A5A',   // Labels, descriptions (interface)
      dark: '#1e293b',        // Texte très foncé (concordance)
      medium: '#334155',      // Texte moyen (concordance)
      muted: '#64748b',       // Métadonnées, infos secondaires
      light: '#F7FAFC',       // Blanc cassé (sur panels foncés)
      link: '#1e40af',        // Liens, actifs
      linkHover: '#1d4ed8'    // Liens au survol
    },
    
    // Bordures
    border: {
      light: '#e2e8f0',       // Bordure standard (gris clair)
      medium: '#cbd5e0',      // Bordure moyenne (gris)
      strong: '#a0aec0',      // Bordure forte (gris foncé)
      active: '#3b82f6',      // Bordure active (bleu vif)
      panel: 'rgba(255,255,255,0.2)'  // Bordure sur panels foncés
    }
  },
  
  // ------------------------------------------------------------------------
  // Espacements standardisés (augmentés pour plus de respiration)
  // ------------------------------------------------------------------------
  spacing: {
    xs: '0.5rem',     // 8px  - Très petit gap
    sm: '0.75rem',    // 12px - Petit gap
    md: '1rem',       // 16px - Gap moyen
    lg: '1.5rem',     // 24px - Gap standard
    xl: '2rem',       // 32px - Grand gap
    xxl: '3rem',      // 48px - Très grand gap
    xxxl: '4rem'      // 64px - Énorme gap
  },
  
  // ------------------------------------------------------------------------
  // Ombres sobres (réduites pour aspect plus plat et académique)
  // ------------------------------------------------------------------------
  shadows: {
    card: '0 1px 3px rgba(0, 0, 0, 0.06)',           // Ombre très subtile (repos)
    cardHover: '0 2px 8px rgba(0, 0, 0, 0.08)',      // Ombre légère au hover
    panel: '0 1px 4px rgba(0, 0, 0, 0.05)',          // Panel très discret
    panelHover: '0 2px 8px rgba(0, 0, 0, 0.08)',     // Panel au hover
    elevated: '0 4px 12px rgba(0, 0, 0, 0.1)',       // Modals, dropdowns
    strong: '0 8px 16px rgba(0, 0, 0, 0.12)'         // Élevé mais sobre
  },
  
  // ------------------------------------------------------------------------
  // Animations unifiées
  // ------------------------------------------------------------------------
  transitions: {
    fast: '150ms ease',                                    // Hover rapide
    normal: '250ms ease',                                  // Standard
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',          // Smooth
    bounce: '400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)' // Bounce effect
  },
  
  // ------------------------------------------------------------------------
  // Bordures - Rayons
  // ------------------------------------------------------------------------
  borderRadius: {
    sm: '4px',       // Petits éléments (badges)
    md: '6px',       // Moyen (options)
    lg: '8px',       // Standard (cards, charts)
    xl: '12px',      // Grand (panels navigation)
    full: '9999px'   // Cercle / pilule
  },
  
  // ------------------------------------------------------------------------
  // Breakpoints Responsive - Mobile First
  // ------------------------------------------------------------------------
  breakpoints: {
    // Valeurs en pixels
    values: {
      xs: 0,        // Extra small devices (phones portrait)
      sm: 480,      // Small devices (phones landscape)
      md: 768,      // Medium devices (tablets)
      lg: 1024,     // Large devices (desktops)
      xl: 1280,     // Extra large devices (large desktops)
      xxl: 1536     // XXL devices (wide screens)
    },

    // Media queries prêtes à l'emploi
    up: (breakpoint) => `@media (min-width: ${globalTheme.breakpoints.values[breakpoint]}px)`,
    down: (breakpoint) => `@media (max-width: ${globalTheme.breakpoints.values[breakpoint] - 1}px)`,
    between: (min, max) => `@media (min-width: ${globalTheme.breakpoints.values[min]}px) and (max-width: ${globalTheme.breakpoints.values[max] - 1}px)`,
    only: (breakpoint) => {
      const keys = Object.keys(globalTheme.breakpoints.values);
      const index = keys.indexOf(breakpoint);
      if (index === keys.length - 1) {
        return `@media (min-width: ${globalTheme.breakpoints.values[breakpoint]}px)`;
      }
      const nextKey = keys[index + 1];
      return `@media (min-width: ${globalTheme.breakpoints.values[breakpoint]}px) and (max-width: ${globalTheme.breakpoints.values[nextKey] - 1}px)`;
    }
  },

  // ------------------------------------------------------------------------
  // Glassmorphism (simplifié pour aspect plus sobre)
  // ------------------------------------------------------------------------
  glassmorphism: {
    background: 'rgba(255, 255, 255, 0.95)',
    blur: 'blur(4px)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
  },
  
  // ------------------------------------------------------------------------
  // Typographie
  // ------------------------------------------------------------------------
  typography: {
    fontFamily: {
      primary: '"Crimson Text", Georgia, serif',    // Titres (médiéval)
      secondary: '"Lato", sans-serif',              // UI (moderne)
      sans: '"Inter", sans-serif',                  // Alternative (concordance)
      serif: '"Crimson Text", serif'                // Alternative (concordance)
    },
    size: {
      xs: '0.75rem',     // 12px - Métadonnées
      sm: '0.85rem',     // 13.6px - Labels
      md: '0.875rem',    // 14px - Corps de texte
      lg: '1rem',        // 16px - Titres secondaires
      xl: '1.25rem',     // 20px - Titres
      xxl: '1.5rem',     // 24px - Grands titres
      xxxl: '2rem'       // 32px - Titres principaux
    },
    weight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  
  // ------------------------------------------------------------------------
  // Graphiques (palette académique sobre)
  // ------------------------------------------------------------------------
  charts: {
    // Palette principale (bleus/gris sobres)
    colors: [
      '#1e3a5f',  // Bleu marine principal
      '#2c5282',  // Bleu marine moyen
      '#1e40af',  // Bleu classique
      '#334155',  // Gris ardoise
      '#475569',  // Gris ardoise moyen
      '#64748b',  // Gris bleuté
      '#b8860b'   // Or antique (accent)
    ],

    // Couleurs spécifiques
    temporal: '#1e40af',    // Ligne temporelle (bleu classique)
    domain: '#1e3a5f',      // Barres domaines (bleu marine)
    grid: '#e5e7eb'         // Grille (gris très clair)
  }
};

// ==========================================================================
// 🛠️ HELPERS - Fonctions utilitaires
// ==========================================================================

/**
 * Génère un style de card standard
 * @returns {Object} Style CSS inline
 */
export const getCardStyle = () => ({
  background: globalTheme.colors.background.card,
  border: `1px solid ${globalTheme.colors.border.light}`,
  borderRadius: globalTheme.borderRadius.lg,
  padding: globalTheme.spacing.xxl,
  boxShadow: globalTheme.shadows.card,
  transition: globalTheme.transitions.normal
});

/**
 * Génère un style de card avec effet hover
 * @param {boolean} isHovered - État hover
 * @returns {Object} Style CSS inline
 */
export const getCardHoverStyle = (isHovered) => ({
  ...getCardStyle(),
  boxShadow: isHovered 
    ? globalTheme.shadows.cardHover 
    : globalTheme.shadows.card,
  transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
});

/**
 * Génère un style de panel navigation avec glassmorphism
 * @param {boolean} isActive - Panel actif
 * @param {boolean} isHovered - État hover
 * @returns {Object} Style CSS inline
 */
export const getPanelStyle = (isActive, isHovered) => ({
  background: globalTheme.glassmorphism.background,
  backdropFilter: globalTheme.glassmorphism.blur,
  border: isActive 
    ? `3px solid ${globalTheme.colors.border.active}`
    : globalTheme.glassmorphism.border,
  borderRadius: globalTheme.borderRadius.xl,
  boxShadow: isHovered 
    ? globalTheme.shadows.panelHover 
    : globalTheme.shadows.panel,
  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
  transition: globalTheme.transitions.slow
});

/**
 * Crée un gradient linéaire diagonal (135deg)
 * @param {string} color1 - Couleur de départ
 * @param {string} color2 - Couleur d'arrivée
 * @returns {string} Gradient CSS
 */
export const createGradient = (color1, color2) => 
  `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;

/**
 * Génère les styles CSS globaux
 * @returns {string} CSS string
 */
export const generateGlobalStyles = () => `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${globalTheme.typography.fontFamily.primary};
    color: ${globalTheme.colors.text.primary};
    background: ${globalTheme.colors.background.default};
    line-height: 1.5;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${globalTheme.typography.weight.bold};
    line-height: 1.2;
  }
  
  a {
    color: inherit;
    text-decoration: none;
    transition: ${globalTheme.transitions.fast};
  }
  
  button {
    font-family: ${globalTheme.typography.fontFamily.secondary};
    cursor: pointer;
    transition: ${globalTheme.transitions.normal};
  }
`;

// Export par défaut
export default globalTheme;

// Exports nommés pour compatibilité avec visualTheme
export const visualTheme = {
  colors: {
    primary: concordancePalette.primary,
    background: globalTheme.colors.background,
    text: globalTheme.colors.text,
    border: globalTheme.colors.border,
    accent: concordancePalette.accent
  },
  spacing: globalTheme.spacing,
  shadows: globalTheme.shadows,
  transitions: globalTheme.transitions,
  borderRadius: globalTheme.borderRadius,
  glassmorphism: globalTheme.glassmorphism,
  typography: globalTheme.typography,
  charts: globalTheme.charts
};
