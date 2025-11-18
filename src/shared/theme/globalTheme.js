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
 * Palette MÉDIÉVALE ACADÉMIQUE - Pour le module ConcordanceAnalyzer
 * Inspirée des manuscrits enluminés et bibliothèques médiévales
 */
const concordancePalette = {
  primary: {
    main: '#5C3317',      // Brun encre principal (terre de sienne brûlée)
    light: '#704214',     // Brun encre moyen
    dark: '#3E2723',      // Brun très foncé (sépia profond)
    blue: '#1e40af',      // Bleu lapis-lazuli (enluminure)
    blueHover: '#1e3a8a'  // Bleu lapis foncé
  },
  accent: {
    gold: '#8B4513',      // Brun principal (remplacement de l'or pour meilleur contraste)
    goldLight: '#A0522D', // Brun-rougeâtre clair (sienna)
    green: '#2D5016',     // Vert malachite foncé
    red: '#B91C1C',       // Rouge vermillon (enluminure)
    blue: '#1e40af'       // Bleu lapis-lazuli
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
      default: '#FAF6ED',   // Fond général (parchemin clair)
      paper: '#FFFEF9',     // Fond des cartes (parchemin très clair)
      page: '#F4E8D0',      // Fond général de page (parchemin vieilli)
      card: '#FFFEF9',      // Fond des cards (parchemin très clair)
      hover: '#F0E4CC',     // Hover des options (parchemin moyen)
      active: '#E8DCC6',    // Fond actif (parchemin plus foncé)
      panel: '#FAF6ED'      // Fond panels (parchemin clair)
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
  // Typographie (Hiérarchie médiévale académique)
  // ------------------------------------------------------------------------
  typography: {
    fontFamily: {
      primary: '"Crimson Text", Georgia, serif',    // Titres principaux (médiéval)
      secondary: '"Lato", "Helvetica Neue", sans-serif',    // UI/Corps de texte
      heading: '"EB Garamond", "Crimson Text", Georgia, serif',  // Grands titres (style livre ancien)
      display: '"Cormorant Garamond", "EB Garamond", serif',     // Titres display (enluminure)
      body: '"Lato", "Helvetica Neue", sans-serif', // Corps de texte principal
      mono: '"Courier New", Courier, monospace'     // Code/données
    },
    size: {
      xs: '0.75rem',     // 12px - Métadonnées
      sm: '0.85rem',     // 13.6px - Labels
      md: '0.875rem',    // 14px - Corps de texte
      lg: '1rem',        // 16px - Texte standard
      xl: '1.25rem',     // 20px - Petits titres
      xxl: '1.5rem',     // 24px - Titres moyens
      xxxl: '2rem',      // 32px - Grands titres
      display: '2.5rem'  // 40px - Titres display
    },
    weight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900'
    },
    // Styles de titres hiérarchiques
    heading: {
      h1: {
        fontFamily: '"EB Garamond", "Crimson Text", Georgia, serif',
        fontSize: '2.5rem',     // 40px
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
        color: '#5C3317',       // Brun encre principal
        textTransform: 'none'
      },
      h2: {
        fontFamily: '"Crimson Text", Georgia, serif',
        fontSize: '2rem',       // 32px
        fontWeight: '600',
        lineHeight: '1.3',
        letterSpacing: '-0.01em',
        color: '#5C3317',       // Brun encre principal
        textTransform: 'none'
      },
      h3: {
        fontFamily: '"Crimson Text", Georgia, serif',
        fontSize: '1.5rem',     // 24px
        fontWeight: '600',
        lineHeight: '1.4',
        letterSpacing: '0',
        color: '#704214',       // Brun encre moyen
        textTransform: 'none'
      },
      h4: {
        fontFamily: '"Lato", sans-serif',
        fontSize: '1.25rem',    // 20px
        fontWeight: '600',
        lineHeight: '1.4',
        letterSpacing: '0',
        color: '#704214',       // Brun encre moyen
        textTransform: 'none'
      },
      h5: {
        fontFamily: '"Lato", sans-serif',
        fontSize: '1rem',       // 16px
        fontWeight: '600',
        lineHeight: '1.5',
        letterSpacing: '0.01em',
        color: '#8B4513',       // Brun sépia
        textTransform: 'uppercase'
      },
      h6: {
        fontFamily: '"Lato", sans-serif',
        fontSize: '0.875rem',   // 14px
        fontWeight: '700',
        lineHeight: '1.5',
        letterSpacing: '0.05em',
        color: '#8B4513',       // Brun sépia
        textTransform: 'uppercase'
      }
    }
  },
  
  // ------------------------------------------------------------------------
  // Graphiques (palette médiévale académique)
  // ------------------------------------------------------------------------
  charts: {
    // Palette principale (tons médiévaux cohérents)
    colors: [
      '#8B4513',  // Brun principal (saddle brown)
      '#A0522D',  // Brun-rougeâtre (sienna)
      '#6B4423',  // Brun foncé
      '#C19A6B',  // Beige doré (camel)
      '#8B6914',  // Or sombre (dark goldenrod)
      '#DEB887',  // Burlywood (tan moyen)
      '#D2B48C'   // Tan clair
    ],

    // Couleurs spécifiques
    temporal: '#8B4513',    // Ligne temporelle (brun principal)
    domain: '#8B4513',      // Barres domaines (brun principal)
    grid: '#E8DCC6'         // Grille (parchemin moyen)
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
 * Génère les styles CSS globaux avec hiérarchie typographique
 * @returns {string} CSS string
 */
export const generateGlobalStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Crimson+Text:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${globalTheme.typography.fontFamily.body};
    color: ${globalTheme.colors.text.primary};
    background: ${globalTheme.colors.background.default};
    line-height: 1.6;
    font-size: ${globalTheme.typography.size.md};
  }

  h1 {
    font-family: ${globalTheme.typography.heading.h1.fontFamily};
    font-size: ${globalTheme.typography.heading.h1.fontSize};
    font-weight: ${globalTheme.typography.heading.h1.fontWeight};
    line-height: ${globalTheme.typography.heading.h1.lineHeight};
    letter-spacing: ${globalTheme.typography.heading.h1.letterSpacing};
    color: ${globalTheme.typography.heading.h1.color};
    margin-bottom: 1.5rem;
  }

  h2 {
    font-family: ${globalTheme.typography.heading.h2.fontFamily};
    font-size: ${globalTheme.typography.heading.h2.fontSize};
    font-weight: ${globalTheme.typography.heading.h2.fontWeight};
    line-height: ${globalTheme.typography.heading.h2.lineHeight};
    letter-spacing: ${globalTheme.typography.heading.h2.letterSpacing};
    color: ${globalTheme.typography.heading.h2.color};
    margin-bottom: 1.25rem;
  }

  h3 {
    font-family: ${globalTheme.typography.heading.h3.fontFamily};
    font-size: ${globalTheme.typography.heading.h3.fontSize};
    font-weight: ${globalTheme.typography.heading.h3.fontWeight};
    line-height: ${globalTheme.typography.heading.h3.lineHeight};
    letter-spacing: ${globalTheme.typography.heading.h3.letterSpacing};
    color: ${globalTheme.typography.heading.h3.color};
    margin-bottom: 1rem;
  }

  h4 {
    font-family: ${globalTheme.typography.heading.h4.fontFamily};
    font-size: ${globalTheme.typography.heading.h4.fontSize};
    font-weight: ${globalTheme.typography.heading.h4.fontWeight};
    line-height: ${globalTheme.typography.heading.h4.lineHeight};
    letter-spacing: ${globalTheme.typography.heading.h4.letterSpacing};
    color: ${globalTheme.typography.heading.h4.color};
    margin-bottom: 0.875rem;
  }

  h5 {
    font-family: ${globalTheme.typography.heading.h5.fontFamily};
    font-size: ${globalTheme.typography.heading.h5.fontSize};
    font-weight: ${globalTheme.typography.heading.h5.fontWeight};
    line-height: ${globalTheme.typography.heading.h5.lineHeight};
    letter-spacing: ${globalTheme.typography.heading.h5.letterSpacing};
    color: ${globalTheme.typography.heading.h5.color};
    text-transform: ${globalTheme.typography.heading.h5.textTransform};
    margin-bottom: 0.75rem;
  }

  h6 {
    font-family: ${globalTheme.typography.heading.h6.fontFamily};
    font-size: ${globalTheme.typography.heading.h6.fontSize};
    font-weight: ${globalTheme.typography.heading.h6.fontWeight};
    line-height: ${globalTheme.typography.heading.h6.lineHeight};
    letter-spacing: ${globalTheme.typography.heading.h6.letterSpacing};
    color: ${globalTheme.typography.heading.h6.color};
    text-transform: ${globalTheme.typography.heading.h6.textTransform};
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1rem;
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
