/**
 * Vue de recherche par proximité avec variations
 * @module query-generator/components/views
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, RadioGroup, Checkbox, InfoBox, ResultCard } from '../ui';
import { generateProximityWithVariations } from '../../utils/queryGenerators';
import { globalTheme } from '@shared/theme/globalTheme';

const ProximityVariationView = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    lemma1: 'intentio',
    lemma2: 'Augustinus',
    distance: 10,
    variationType: 'simple',
    attribute: 'word',
    bidirectional: true
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryResult = generateProximityWithVariations(
      formData.lemma1, formData.lemma2, formData.distance,
      formData.variationType, formData.attribute, formData.bidirectional
    );

    queryResult.error ? (setError(queryResult.error), setResult(null)) : (setResult(queryResult), setError(null));
  };

  const variationOptions = [
    { value: 'simple', label: t('queryGenerator.proximityVariation.simple') },
    { value: 'medium', label: t('queryGenerator.proximityVariation.medium') },
    { value: 'medieval', label: t('queryGenerator.proximityVariation.medieval') }
  ];

  const attributeOptions = [
    { value: 'word', label: t('queryGenerator.attributes.word') },
    { value: 'lemma', label: t('queryGenerator.attributes.lemma') }
  ];

  return (
    <div style={styles.container}>
      <InfoBox type="info" title={t('queryGenerator.proximityVariation.title')}>
        {t('queryGenerator.proximityVariation.description')}
      </InfoBox>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>{t('queryGenerator.proximityVariation.formTitle')}</h3>

        <div style={styles.row}>
          <FormField label={t('queryGenerator.proximity.lemma1')} value={formData.lemma1} onChange={(v) => setFormData({ ...formData, lemma1: v })} required />
          <FormField label={t('queryGenerator.proximity.lemma2')} value={formData.lemma2} onChange={(v) => setFormData({ ...formData, lemma2: v })} required />
        </div>

        <div style={styles.row}>
          <FormField label={t('queryGenerator.proximity.distance')} type="number" value={formData.distance} onChange={(v) => setFormData({ ...formData, distance: v })} min={0} max={100} required />
          <FormField label={t('queryGenerator.proximity.attribute')} type="select" value={formData.attribute} onChange={(v) => setFormData({ ...formData, attribute: v })} options={attributeOptions} />
        </div>

        <RadioGroup label={t('queryGenerator.proximityVariation.variationType')} value={formData.variationType} onChange={(v) => setFormData({ ...formData, variationType: v })} options={variationOptions} name="variation" />
        <Checkbox label={t('queryGenerator.proximity.bidirectional')} checked={formData.bidirectional} onChange={(c) => setFormData({ ...formData, bidirectional: c })} />

        <button type="submit" style={styles.submitButton}>{t('queryGenerator.ui.generate')}</button>
      </form>

      {error && <InfoBox type="error" title={t('common.error')}>{error}</InfoBox>}
      {result && (
        <ResultCard
          title={t('queryGenerator.ui.queryGenerated')}
          query={result.query}
          patterns={result.patterns1}
        />
      )}
    </div>
  );
};

const styles = {
  container: { padding: 0 },
  form: { background: globalTheme.colors.background.card, padding: globalTheme.spacing.xxl, borderRadius: globalTheme.borderRadius.md, border: `1px solid ${globalTheme.colors.border.light}`, marginBottom: globalTheme.spacing.xl, boxShadow: globalTheme.shadows.card },
  formTitle: { fontSize: globalTheme.typography.size.xl, fontWeight: globalTheme.typography.weight.semibold, color: globalTheme.colors.text.primary, marginBottom: globalTheme.spacing.xl, paddingBottom: globalTheme.spacing.md, borderBottom: `1px solid ${globalTheme.colors.border.light}` },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: globalTheme.spacing.lg },
  submitButton: { padding: `${globalTheme.spacing.md} ${globalTheme.spacing.xl}`, borderRadius: globalTheme.borderRadius.md, border: 'none', background: globalTheme.palettes.concordance.primary.blue, color: '#FFFFFF', fontFamily: globalTheme.typography.fontFamily.secondary, fontSize: globalTheme.typography.size.md, fontWeight: globalTheme.typography.weight.semibold, cursor: 'pointer', transition: globalTheme.transitions.fast, marginTop: globalTheme.spacing.lg }
};

export default ProximityVariationView;
