/**
 * Vue de recherche par proximité
 * @module query-generator/components/views
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, RadioGroup, Checkbox, InfoBox, ResultCard } from '../ui';
import { generateProximityQuery } from '../../utils/queryGenerators';
import { globalTheme } from '@shared/theme/globalTheme';

const ProximityView = () => {
  const { t } = useTranslation();

  // État du formulaire
  const [formData, setFormData] = useState({
    lemma1: 'intentio',
    lemma2: 'Augustinus',
    distance: 10,
    attribute: 'lemma',
    bidirectional: true
  });

  // État du résultat
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const queryResult = generateProximityQuery(
      formData.lemma1,
      formData.lemma2,
      formData.distance,
      formData.attribute,
      formData.bidirectional
    );

    if (queryResult.error) {
      setError(queryResult.error);
      setResult(null);
    } else {
      setResult(queryResult);
      setError(null);
    }
  };

  const attributeOptions = [
    { value: 'lemma', label: t('queryGenerator.attributes.lemma') },
    { value: 'word', label: t('queryGenerator.attributes.word') }
  ];

  return (
    <div style={styles.container}>
      <InfoBox type="info" title={t('queryGenerator.proximity.title')}>
        {t('queryGenerator.proximity.description')}
      </InfoBox>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>{t('queryGenerator.proximity.formTitle')}</h3>

        <div style={styles.row}>
          <FormField
            label={t('queryGenerator.proximity.lemma1')}
            type="text"
            value={formData.lemma1}
            onChange={(value) => setFormData({ ...formData, lemma1: value })}
            placeholder={t('queryGenerator.proximity.placeholders.lemma1')}
            required
          />

          <FormField
            label={t('queryGenerator.proximity.lemma2')}
            type="text"
            value={formData.lemma2}
            onChange={(value) => setFormData({ ...formData, lemma2: value })}
            placeholder={t('queryGenerator.proximity.placeholders.lemma2')}
            required
          />
        </div>

        <div style={styles.row}>
          <FormField
            label={t('queryGenerator.proximity.distance')}
            type="number"
            value={formData.distance}
            onChange={(value) => setFormData({ ...formData, distance: value })}
            min={0}
            max={100}
            required
          />

          <FormField
            label={t('queryGenerator.proximity.attribute')}
            type="select"
            value={formData.attribute}
            onChange={(value) => setFormData({ ...formData, attribute: value })}
            options={attributeOptions}
          />
        </div>

        <Checkbox
          label={t('queryGenerator.proximity.bidirectional')}
          checked={formData.bidirectional}
          onChange={(checked) => setFormData({ ...formData, bidirectional: checked })}
        />

        <button type="submit" style={styles.submitButton}>
          🚀 {t('queryGenerator.ui.generate')}
        </button>
      </form>

      {error && (
        <InfoBox type="error" title={t('common.error')}>
          {error}
        </InfoBox>
      )}

      {result && (
        <ResultCard
          title={t('queryGenerator.ui.queryGenerated')}
          query={result.query}
          metadata={{
            [t('queryGenerator.proximity.lemma1')]: result.lemma1,
            [t('queryGenerator.proximity.lemma2')]: result.lemma2,
            [t('queryGenerator.proximity.distance')]: result.distance,
            [t('queryGenerator.proximity.attribute')]: result.attribute,
            [t('queryGenerator.proximity.bidirectional')]: result.bidirectional ? '✓' : '✗'
          }}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${globalTheme.spacing.xxl} ${globalTheme.spacing.lg}`
  },

  form: {
    background: globalTheme.colors.background.card,
    padding: globalTheme.spacing.xxl,
    borderRadius: globalTheme.borderRadius.lg,
    border: `2px solid ${globalTheme.colors.border.light}`,
    marginBottom: globalTheme.spacing.xxl,
    boxShadow: globalTheme.shadows.card
  },

  formTitle: {
    ...globalTheme.typography.heading.h3,
    color: globalTheme.palettes.concordance.primary.main,
    marginBottom: globalTheme.spacing.xl,
    borderBottom: `2px solid ${globalTheme.colors.border.light}`,
    paddingBottom: globalTheme.spacing.md
  },

  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: globalTheme.spacing.lg
  },

  submitButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: globalTheme.spacing.sm,
    padding: `${globalTheme.spacing.lg} ${globalTheme.spacing.xxl}`,
    borderRadius: globalTheme.borderRadius.md,
    border: `2px solid ${globalTheme.palettes.concordance.primary.blue}`,
    background: globalTheme.palettes.concordance.primary.blue,
    color: '#FFFFFF',
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.lg,
    fontWeight: globalTheme.typography.weight.semibold,
    cursor: 'pointer',
    transition: globalTheme.transitions.normal,
    marginTop: globalTheme.spacing.lg,
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: globalTheme.shadows.cardHover
    }
  }
};

export default ProximityView;
