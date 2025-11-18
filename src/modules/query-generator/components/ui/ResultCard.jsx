/**
 * Carte de résultat pour afficher les requêtes générées
 * @module query-generator/components/ui
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, ExternalLink } from 'lucide-react';
import { globalTheme } from '@shared/theme/globalTheme';
import { generateNoSketchUrl } from '../../utils/queryGenerators';

/**
 * ResultCard - Affiche une requête générée avec actions
 * @param {Object} props
 * @param {string} props.title - Titre de la carte
 * @param {string} props.query - Requête CQL générée
 * @param {Object} props.metadata - Métadonnées optionnelles
 * @param {string[]} props.patterns - Patterns de variations (optionnel)
 * @param {string} props.variant - Type de carte ('default', 'medieval')
 */
const ResultCard = ({ title, query, metadata = {}, patterns = [], variant = 'default' }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenNoSketch = () => {
    const url = generateNoSketchUrl(query);
    window.open(url, '_blank');
  };

  const isMedieval = variant === 'medieval';

  return (
    <div style={styles.card(isMedieval)}>
      <h4 style={styles.title(isMedieval)}>{title}</h4>

      {/* Requête CQL */}
      <div style={styles.queryDisplay}>
        <code style={styles.queryCode}>{query}</code>
      </div>

      {/* Métadonnées */}
      {Object.keys(metadata).length > 0 && (
        <div style={styles.metadata}>
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} style={styles.metadataItem}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )}

      {/* Preview des patterns (limité aux 8 premiers) */}
      {patterns.length > 0 && (
        <div style={styles.patternsPreview}>
          <strong style={styles.patternsLabel}>{t('queryGenerator.ui.patterns')}:</strong>
          <div style={styles.patternsContent}>
            {patterns.slice(0, 8).join(', ')}
            {patterns.length > 8 && '...'}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={handleOpenNoSketch} style={styles.button('primary')}>
          <ExternalLink size={16} />
          {t('queryGenerator.ui.searchNoSketch')}
        </button>

        <button onClick={handleCopy} style={styles.button('secondary')}>
          <Copy size={16} />
          {copied ? t('queryGenerator.ui.copied') : t('queryGenerator.ui.copy')}
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: (isMedieval) => ({
    background: isMedieval
      ? 'linear-gradient(135deg, #FFE4B5 0%, #FAEBD7 100%)'
      : globalTheme.colors.background.card,
    padding: globalTheme.spacing.xxl,
    borderRadius: globalTheme.borderRadius.lg,
    border: isMedieval
      ? `2px solid ${globalTheme.palettes.concordance.accent.gold}`
      : `1px solid ${globalTheme.colors.border.light}`,
    borderLeft: isMedieval
      ? `5px solid ${globalTheme.palettes.concordance.accent.gold}`
      : `4px solid ${globalTheme.palettes.concordance.primary.main}`,
    boxShadow: globalTheme.shadows.card,
    marginBottom: globalTheme.spacing.lg,
    transition: globalTheme.transitions.normal
  }),

  title: (isMedieval) => ({
    ...globalTheme.typography.heading.h4,
    color: isMedieval
      ? globalTheme.palettes.concordance.accent.gold
      : globalTheme.palettes.concordance.primary.main,
    marginBottom: globalTheme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: globalTheme.spacing.sm
  }),

  queryDisplay: {
    background: '#F5F5DC',
    padding: globalTheme.spacing.lg,
    borderRadius: globalTheme.borderRadius.md,
    border: `1px solid ${globalTheme.colors.border.light}`,
    marginBottom: globalTheme.spacing.lg,
    overflowX: 'auto',
    fontSize: globalTheme.typography.size.sm,
    fontFamily: globalTheme.typography.fontFamily.mono
  },

  queryCode: {
    color: globalTheme.colors.text.dark,
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap'
  },

  metadata: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: globalTheme.spacing.md,
    marginBottom: globalTheme.spacing.lg,
    padding: globalTheme.spacing.md,
    background: globalTheme.colors.background.hover,
    borderRadius: globalTheme.borderRadius.md,
    fontSize: globalTheme.typography.size.sm
  },

  metadataItem: {
    color: globalTheme.colors.text.medium
  },

  patternsPreview: {
    marginBottom: globalTheme.spacing.lg,
    padding: globalTheme.spacing.md,
    background: '#F0F8FF',
    border: '1px dashed #4682B4',
    borderRadius: globalTheme.borderRadius.md,
    fontSize: globalTheme.typography.size.sm
  },

  patternsLabel: {
    color: globalTheme.colors.text.dark,
    marginBottom: globalTheme.spacing.xs,
    display: 'block'
  },

  patternsContent: {
    fontFamily: globalTheme.typography.fontFamily.mono,
    color: globalTheme.colors.text.medium,
    fontSize: '0.8rem'
  },

  actions: {
    display: 'flex',
    gap: globalTheme.spacing.md,
    flexWrap: 'wrap'
  },

  button: (type) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: globalTheme.spacing.sm,
    padding: `${globalTheme.spacing.md} ${globalTheme.spacing.xl}`,
    borderRadius: globalTheme.borderRadius.md,
    border: type === 'primary'
      ? `2px solid ${globalTheme.palettes.concordance.primary.blue}`
      : `2px solid ${globalTheme.colors.border.medium}`,
    background: type === 'primary'
      ? globalTheme.palettes.concordance.primary.blue
      : globalTheme.colors.background.card,
    color: type === 'primary'
      ? '#FFFFFF'
      : globalTheme.palettes.concordance.primary.main,
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.md,
    fontWeight: globalTheme.typography.weight.semibold,
    cursor: 'pointer',
    transition: globalTheme.transitions.normal,
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: globalTheme.shadows.cardHover
    }
  })
};

export default ResultCard;
