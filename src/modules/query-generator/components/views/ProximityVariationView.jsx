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

        <button type="submit" style={styles.submitButton}>🚀 {t('queryGenerator.ui.generate')}</button>
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
  container: { maxWidth: '1200px', margin: '0 auto', padding: `${globalTheme.spacing.xxl} ${globalTheme.spacing.lg}` },
  form: { background: globalTheme.colors.background.card, padding: globalTheme.spacing.xxl, borderRadius: globalTheme.borderRadius.lg, border: `2px solid ${globalTheme.colors.border.light}`, marginBottom: globalTheme.spacing.xxl, boxShadow: globalTheme.shadows.card },
  formTitle: { ...globalTheme.typography.heading.h3, color: globalTheme.palettes.concordance.primary.main, marginBottom: globalTheme.spacing.xl, borderBottom: `2px solid ${globalTheme.colors.border.light}`, paddingBottom: globalTheme.spacing.md },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: globalTheme.spacing.lg },
  submitButton: { display: 'inline-flex', alignItems: 'center', gap: globalTheme.spacing.sm, padding: `${globalTheme.spacing.lg} ${globalTheme.spacing.xxl}`, borderRadius: globalTheme.borderRadius.md, border: `2px solid ${globalTheme.palettes.concordance.primary.blue}`, background: globalTheme.palettes.concordance.primary.blue, color: '#FFFFFF', fontFamily: globalTheme.typography.fontFamily.secondary, fontSize: globalTheme.typography.size.lg, fontWeight: globalTheme.typography.weight.semibold, cursor: 'pointer', transition: globalTheme.transitions.normal, marginTop: globalTheme.spacing.lg }
};

export default ProximityVariationView;
