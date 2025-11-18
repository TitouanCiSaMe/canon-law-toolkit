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
    color: visualTheme.colors.primary.main,           // Bleu marine principal
    gradient: createGradient(visualTheme.colors.primary.main, visualTheme.colors.primary.light),
    icon: '📊',
    gridArea: '1 / 1 / 2 / 2',
    size: 'medium'
  },
  domains: {
    id: 'domains',
    title: 'concordance.panels.domains.title',
    subtitle: 'concordance.panels.domains.subtitle',
    color: visualTheme.colors.primary.light,          // Bleu marine moyen
    gradient: createGradient(visualTheme.colors.primary.light, visualTheme.colors.primary.blue),
    icon: '📚',
    gridArea: '1 / 2 / 2 / 3',
    size: 'medium'
  },
  temporal: {
    id: 'temporal',
    title: 'concordance.panels.temporal.title',
    subtitle: 'concordance.panels.temporal.subtitle',
    color: visualTheme.colors.accent.blue,            // Gris ardoise
    gradient: createGradient(visualTheme.colors.accent.blue, '#475569'),
    icon: '⏰',
    gridArea: '1 / 3 / 2 / 4',
    size: 'medium'
  },
  places: {
    id: 'places',
    title: 'concordance.panels.places.title',
    subtitle: 'concordance.panels.places.subtitle',
    color: visualTheme.colors.accent.green,           // Vert discret
    gradient: createGradient(visualTheme.colors.accent.green, '#047857'),
    icon: '🌍',
    gridArea: '1 / 4 / 2 / 5',
    size: 'medium'
  },
  authors: {
    id: 'authors',
    title: 'concordance.panels.authors.title',
    subtitle: 'concordance.panels.authors.subtitle',
    color: '#475569',                                 // Gris ardoise moyen
    gradient: createGradient('#475569', '#64748b'),
    icon: '✍️',
    gridArea: '2 / 1 / 3 / 2',
    size: 'medium'
  },
  linguistic: {
    id: 'linguistic',
    title: 'concordance.panels.linguistic.title',
    subtitle: 'concordance.panels.linguistic.subtitle',
    color: visualTheme.colors.primary.blue,           // Bleu classique
    gradient: createGradient(visualTheme.colors.primary.blue, '#1e3a8a'),
    icon: '🔤',
    gridArea: '2 / 2 / 3 / 3',
    size: 'medium'
  },
  data: {
    id: 'data',
    title: 'concordance.panels.data.title',
    subtitle: 'concordance.panels.data.subtitle',
    color: visualTheme.colors.primary.dark,           // Bleu marine très foncé
    gradient: createGradient(visualTheme.colors.primary.dark, visualTheme.colors.primary.main),
    icon: '📋',
    gridArea: '2 / 3 / 3 / 5',  // S'étend sur 2 colonnes
    size: 'medium'
  },
  corpusComparison: {
    id: 'corpusComparison',
    title: 'concordance.panels.corpusComparison.title',
    subtitle: 'concordance.panels.corpusComparison.subtitle',
    color: visualTheme.colors.accent.orange,          // Or antique (accent important)
    gradient: createGradient(visualTheme.colors.accent.orange, '#d4af37'),
    icon: '⚖️',
    gridArea: '3 / 1 / 4 / 5',  // Full width, ligne 3
    size: 'wide'
  },
  concordances: {
    id: 'concordances',
    title: 'concordance.panels.concordances.title',
    subtitle: 'concordance.panels.concordances.subtitle',
    color: '#334155',                                 // Gris ardoise principal
    gradient: createGradient('#334155', '#475569'),
    icon: '📁',
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
  primary: visualTheme.colors.primary.main,           // #1e3a5f (bleu marine)
  secondary: visualTheme.colors.primary.light,        // #2c5282 (bleu marine moyen)
  accent: visualTheme.colors.accent.orange,           // #b8860b (or antique)
  warm: visualTheme.colors.accent.orange,             // #b8860b (or antique)
  neutral: visualTheme.colors.accent.blue,            // #334155 (gris ardoise)
  text: visualTheme.colors.text.dark,                 // #1e293b
  light: '#FAFAFA',
  paper: '#FFFFFF',
  success: visualTheme.colors.accent.green,           // #059669 (vert discret)
  warning: visualTheme.colors.accent.red              // #dc2626 (rouge sobre)
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
