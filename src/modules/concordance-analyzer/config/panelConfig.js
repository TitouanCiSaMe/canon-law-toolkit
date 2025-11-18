/**
 * Configuration des panels et constantes de couleurs
 * 
 * Ce module contient :
 * - La configuration complète de tous les panels
 * - Les couleurs académiques du thème
 * - Les couleurs pour les graphiques
 * 
 * Version adaptée pour Canon Law Toolkit
 * Import depuis @shared/theme/globalTheme au lieu de ../theme/visualTheme
 */

import { visualTheme, createGradient } from '@shared/theme/globalTheme';

// ============================================================================
// CONFIGURATION DES PANELS
// ============================================================================

export const panelConfig = {
  overview: {
    id: 'overview',
    title: 'concordance.panels.overview.title',
    subtitle: 'concordance.panels.overview.subtitle',
    color: visualTheme.colors.primary.main,           // Brun encre principal
    gradient: createGradient(visualTheme.colors.primary.main, visualTheme.colors.primary.dark),
    icon: '◈',  // Symbole académique/ornement
    gridArea: '1 / 1 / 2 / 2',
    size: 'medium'
  },
  domains: {
    id: 'domains',
    title: 'concordance.panels.domains.title',
    subtitle: 'concordance.panels.domains.subtitle',
    color: visualTheme.colors.primary.light,          // Brun encre moyen
    gradient: createGradient(visualTheme.colors.primary.light, visualTheme.colors.primary.main),
    icon: '⚜',  // Fleur de lys (académique)
    gridArea: '1 / 2 / 2 / 3',
    size: 'medium'
  },
  temporal: {
    id: 'temporal',
    title: 'concordance.panels.temporal.title',
    subtitle: 'concordance.panels.temporal.subtitle',
    color: visualTheme.colors.accent.gold,            // Brun médiéval
    gradient: createGradient(visualTheme.colors.accent.gold, visualTheme.colors.accent.goldLight),
    textColor: '#FFFFFF',                              // Texte blanc pour contraste sur fond brun
    icon: '⧗',  // Symbole temporel
    gridArea: '1 / 3 / 2 / 4',
    size: 'medium'
  },
  places: {
    id: 'places',
    title: 'concordance.panels.places.title',
    subtitle: 'concordance.panels.places.subtitle',
    color: visualTheme.colors.accent.green,           // Vert malachite
    gradient: createGradient(visualTheme.colors.accent.green, '#1F3510'),
    icon: '✦',  // Étoile ornementale (cartographie médiévale)
    gridArea: '1 / 4 / 2 / 5',
    size: 'medium'
  },
  authors: {
    id: 'authors',
    title: 'concordance.panels.authors.title',
    subtitle: 'concordance.panels.authors.subtitle',
    color: '#704214',                                 // Brun encre moyen
    gradient: createGradient('#704214', visualTheme.colors.primary.main),
    icon: '✒',  // Plume calligraphique
    gridArea: '2 / 1 / 3 / 2',
    size: 'medium'
  },
  linguistic: {
    id: 'linguistic',
    title: 'concordance.panels.linguistic.title',
    subtitle: 'concordance.panels.linguistic.subtitle',
    color: visualTheme.colors.primary.blue,           // Bleu lapis-lazuli
    gradient: createGradient(visualTheme.colors.primary.blue, visualTheme.colors.primary.blueHover),
    icon: '❦',  // Hedera (symbole textuel médiéval)
    gridArea: '2 / 2 / 3 / 3',
    size: 'medium'
  },
  data: {
    id: 'data',
    title: 'concordance.panels.data.title',
    subtitle: 'concordance.panels.data.subtitle',
    color: visualTheme.colors.primary.dark,           // Brun très foncé (sépia)
    gradient: createGradient(visualTheme.colors.primary.dark, visualTheme.colors.primary.main),
    icon: '⟐',  // Symbole manuscrit/tablette
    gridArea: '2 / 3 / 3 / 5',  // S'étend sur 2 colonnes
    size: 'medium'
  },
  corpusComparison: {
    id: 'corpusComparison',
    title: 'concordance.panels.corpusComparison.title',
    subtitle: 'concordance.panels.corpusComparison.subtitle',
    color: visualTheme.colors.accent.gold,            // Brun médiéval (enluminure)
    gradient: createGradient(visualTheme.colors.accent.gold, visualTheme.colors.accent.goldLight),
    textColor: '#FFFFFF',                              // Texte blanc pour contraste sur fond brun
    icon: '⚖',  // Balance (symbole juridique)
    gridArea: '3 / 1 / 4 / 5',  // Full width, ligne 3
    size: 'wide'
  },
  concordances: {
    id: 'concordances',
    title: 'concordance.panels.concordances.title',
    subtitle: 'concordance.panels.concordances.subtitle',
    color: '#5C3317',                                 // Brun encre principal
    gradient: createGradient('#5C3317', '#704214'),
    icon: '⊞',  // Symbole catalogue/archive
    gridArea: '4 / 1 / 5 / 5',  // Full width, ligne 4
    size: 'wide'
  }
};

// ============================================================================
// COULEURS ACADÉMIQUES (Compatibilité avec l'ancien système)
// ============================================================================

/**
 * @deprecated Utilisez visualTheme.colors à la place
 * Conservé pour compatibilité rétroactive
 */
export const academicColors = {
  primary: visualTheme.colors.primary.main,           // #5C3317 (brun encre)
  secondary: visualTheme.colors.primary.light,        // #704214 (brun encre moyen)
  accent: visualTheme.colors.accent.gold,             // #B8860B (or antique)
  warm: visualTheme.colors.accent.gold,               // #B8860B (or antique)
  neutral: visualTheme.colors.primary.dark,           // #3E2723 (brun sépia)
  text: visualTheme.colors.text.dark,                 // #1e293b
  light: '#FAF6ED',
  paper: '#FFFEF9',
  success: visualTheme.colors.accent.green,           // #2D5016 (vert malachite)
  warning: visualTheme.colors.accent.red              // #B91C1C (rouge vermillon)
};

// ============================================================================
// COULEURS POUR LES GRAPHIQUES
// ============================================================================

/**
 * Palette de couleurs pour les graphiques Recharts
 * Utilise la palette du thème visuel pour cohérence
 */
export const COLORS = visualTheme.charts.colors;

// Export alternatif pour compatibilité (palette académique sobre)
export const CHART_COLORS = visualTheme.charts.colors;

// ============================================================================
// EXPORTS PAR DÉFAUT
// ============================================================================

const config = {
  panelConfig,
  academicColors,
  COLORS,
  CHART_COLORS
};

export default config;
