/**
 * Vue de recherche par variations orthographiques
 * @module query-generator/components/views
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit3 } from 'lucide-react';
import { FormField, RadioGroup, InfoBox, ResultCard } from '../ui';
import { generateAllVariationQueries } from '../../utils/variationGenerators';
import { globalTheme } from '@shared/theme/globalTheme';

const VariationView = () => {
  const { t } = useTranslation();

  const [mot, setMot] = useState('intentio');
  const [attribute, setAttribute] = useState('word');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const queryResult = generateAllVariationQueries(mot, true, attribute);

    if (queryResult.error) {
      setError(queryResult.error);
      setResult(null);
    } else {
      setResult(queryResult);
      setError(null);
    }
  };

  const attributeOptions = [
    { value: 'word', label: t('queryGenerator.attributes.word') },
    { value: 'lemma', label: t('queryGenerator.attributes.lemma') }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.infoBox}>
        <div style={styles.infoHeader}>
          <Edit3 size={18} style={{ color: '#B8860B' }} />
          <strong>{t('queryGenerator.variation.title')}</strong>
        </div>
        <p style={styles.infoText}>{t('queryGenerator.variation.description')}</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>{t('queryGenerator.variation.formTitle')}</h3>

        <FormField
          label={t('queryGenerator.variation.word')}
          type="text"
          value={mot}
          onChange={setMot}
          placeholder={t('queryGenerator.variation.placeholders.word')}
          required
        />

        <RadioGroup
          label={t('queryGenerator.proximity.attribute')}
          value={attribute}
          onChange={setAttribute}
          options={attributeOptions}
          name="attribute"
        />

        <button type="submit" style={styles.submitButton}>
          {t('queryGenerator.ui.generate')}
        </button>
      </form>

      {error && <InfoBox type="error" title={t('common.error')}>{error}</InfoBox>}

      {result && (
        <>
          <ResultCard title={t('queryGenerator.variation.simpleQuery')} query={result.requete1} />
          <ResultCard title={t('queryGenerator.variation.mediumQuery')} query={result.requete2} />
          <ResultCard title={t('queryGenerator.variation.complexQuery')} query={result.requete3} />
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: 0 },

  infoBox: {
    background: 'linear-gradient(135deg, #DEB887 0%, #D2B48C 100%)',
    padding: globalTheme.spacing.md,
    borderRadius: globalTheme.borderRadius.md,
    borderLeft: '4px solid #8B4513',
    marginBottom: globalTheme.spacing.lg
  },

  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: globalTheme.spacing.sm,
    marginBottom: globalTheme.spacing.xs,
    fontSize: globalTheme.typography.size.sm,
    fontWeight: globalTheme.typography.weight.semibold,
    color: '#8B4513'
  },

  infoText: {
    margin: 0,
    fontSize: globalTheme.typography.size.sm,
    color: globalTheme.colors.text.secondary,
    lineHeight: '1.4'
  },

  form: { background: globalTheme.colors.background.card, padding: globalTheme.spacing.lg, borderRadius: globalTheme.borderRadius.md, border: `1px solid ${globalTheme.colors.border.light}`, borderLeft: '3px solid #8B4513', marginBottom: globalTheme.spacing.lg, boxShadow: globalTheme.shadows.card },
  formTitle: { fontSize: globalTheme.typography.size.lg, fontWeight: globalTheme.typography.weight.semibold, color: globalTheme.colors.text.primary, marginBottom: globalTheme.spacing.lg, paddingBottom: globalTheme.spacing.sm, borderBottom: `1px solid ${globalTheme.colors.border.light}` },
  submitButton: { padding: `${globalTheme.spacing.md} ${globalTheme.spacing.xl}`, borderRadius: globalTheme.borderRadius.md, border: 'none', background: '#8B4513', color: '#FFFFFF', fontFamily: globalTheme.typography.fontFamily.secondary, fontSize: globalTheme.typography.size.md, fontWeight: globalTheme.typography.weight.semibold, cursor: 'pointer', transition: globalTheme.transitions.fast, marginTop: globalTheme.spacing.md }
};

export default VariationView;
