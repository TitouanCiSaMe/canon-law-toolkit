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
    color: '#1A365D',
    gradient: createGradient('#1A365D', '#2C5282'),
    icon: '📊',
    gridArea: '1 / 1 / 2 / 2',  // ✏️ MODIFIÉ : était '1 / 1 / 3 / 2'
    size: 'medium'  // ✏️ MODIFIÉ : était 'large'
  },
  domains: {
    id: 'domains',
    title: 'concordance.panels.domains.title',
    subtitle: 'concordance.panels.domains.subtitle',
    color: visualTheme.colors.primary.main,           // ✅ Utilise le thème
    gradient: createGradient(
      visualTheme.colors.primary.main, 
      visualTheme.colors.primary.light
    ),
    icon: '📚',
    gridArea: '1 / 2 / 2 / 3',
    size: 'medium'
  },
  temporal: {
    id: 'temporal',
    title: 'concordance.panels.temporal.title',
    subtitle: 'concordance.panels.temporal.subtitle',
    color: visualTheme.colors.accent.orange,          // ✅ Utilise le thème
    gradient: createGradient('#744210', '#92400E'),
    icon: '⏰',
    gridArea: '1 / 3 / 2 / 4',
    size: 'medium'
  },
  authors: {
    id: 'authors',
    title: 'concordance.panels.authors.title',
    subtitle: 'concordance.panels.authors.subtitle',
    color: '#4A5568',
    gradient: createGradient('#4A5568', '#2D3748'),
    icon: '✍️',
    gridArea: '2 / 2 / 3 / 3',
    size: 'medium'
  },
  linguistic: {
    id: 'linguistic',
    title: 'concordance.panels.linguistic.title',
    subtitle: 'concordance.panels.linguistic.subtitle',
    color: '#065F46',
    gradient: createGradient('#065F46', '#047857'),
    icon: '🔤',
    gridArea: '2 / 3 / 3 / 4',
    size: 'medium'
  },
  corpusComparison: {
    id: 'corpusComparison',
    title: 'concordance.panels.corpusComparison.title',
    subtitle: 'concordance.panels.corpusComparison.subtitle',
    color: '#dc2626',
    gradient: createGradient('#dc2626', '#ef4444'),
    icon: '⚖️',
    gridArea: '2 / 1 / 3 / 2',  // ✏️ MODIFIÉ : était '3 / 1 / 4 / 2'
    size: 'medium'  // ✏️ MODIFIÉ : était 'large'
  },
  data: {
    id: 'data',
    title: 'concordance.panels.data.title',
    subtitle: 'concordance.panels.data.subtitle',
    color: '#7C2D12',
    gradient: createGradient('#7C2D12', '#92400E'),
    icon: '📋',
    gridArea: '2 / 4 / 3 / 5',
    size: 'medium'
  },
  concordances: {
    id: 'concordances',
    title: 'concordance.panels.concordances.title',
    subtitle: 'concordance.panels.concordances.subtitle',
    color: '#7C2D12',
    gradient: createGradient('#7C2D12', '#92400E'),
    icon: '📁',
    gridArea: '3 / 1 / 4 / 5',  // ✏️ MODIFIÉ : était '4 / 1 / 5 / 5'
    size: 'wide'
  },
  places: {
    id: 'places',
    title: 'concordance.panels.places.title',
    subtitle: 'concordance.panels.places.subtitle',
    color: visualTheme.colors.accent.green,           // ✅ Utilise le thème
    gradient: createGradient(
      '#059669', 
      visualTheme.colors.accent.green
    ),
    icon: '🌍',
    gridArea: '1 / 4 / 2 / 5',
    size: 'medium'
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
  primary: visualTheme.colors.primary.main,           // #553C9A
  secondary: '#2C5282',
  accent: visualTheme.colors.primary.main,            // #553C9A
  warm: visualTheme.colors.accent.orange,             // #f59e0b
  neutral: '#4A5568',
  text: visualTheme.colors.text.dark,                 // #1e293b
  light: '#EDF2F7',
  paper: '#FAFAFA',
  success: visualTheme.colors.accent.green,           // #10b981
  warning: '#7C2D12'
};

// ============================================================================
// COULEURS POUR LES GRAPHIQUES
// ============================================================================

/**
 * Palette de couleurs pour les graphiques Recharts
 * Utilise la palette du thème visuel pour cohérence
 */
export const COLORS = visualTheme.charts.colors;

// Export alternatif pour compatibilité
export const CHART_COLORS = [
  visualTheme.colors.primary.blue,      // #2563eb
  '#1d4ed8', 
  '#1e40af', 
  visualTheme.colors.primary.dark,      // #3730a3
  '#4338ca', 
  '#6366f1', 
  '#8b5cf6'
];

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
