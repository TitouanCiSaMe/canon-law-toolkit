/**
 * Carte de résultat pour afficher les requêtes générées
 * @module query-generator/components/ui
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, ExternalLink } from 'lucide-react';
import styles from './ResultCard.module.css';
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
    <div className={`${styles.card} ${isMedieval ? styles.cardMedieval : ''}`}>
      <h4 className={`${styles.title} ${isMedieval ? styles.titleMedieval : ''}`}>{title}</h4>

      {/* Requête CQL */}
      <div className={styles.queryDisplay}>
        <code className={styles.queryCode}>{query}</code>
      </div>

      {/* Métadonnées */}
      {Object.keys(metadata).length > 0 && (
        <div className={styles.metadata}>
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className={styles.metadataItem}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )}

      {/* Preview des patterns (limité aux 8 premiers) */}
      {patterns.length > 0 && (
        <div className={styles.patternsPreview}>
          <strong className={styles.patternsLabel}>{t('queryGenerator.ui.patterns')}:</strong>
          <div className={styles.patternsContent}>
            {patterns.slice(0, 8).join(', ')}
            {patterns.length > 8 && '...'}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={handleOpenNoSketch} className={`${styles.button} ${styles.buttonPrimary}`}>
          <ExternalLink size={16} />
          {t('queryGenerator.ui.searchNoSketch')}
        </button>

        <button onClick={handleCopy} className={`${styles.button} ${styles.buttonSecondary}`}>
          <Copy size={16} />
          {copied ? t('queryGenerator.ui.copied') : t('queryGenerator.ui.copy')}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
