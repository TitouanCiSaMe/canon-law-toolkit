/**
 * Vue de recherche par proximité avec variations
 * @module query-generator/components/views
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';
import { FormField, RadioGroup, Checkbox, InfoBox, ResultCard } from '../ui';
import { generateProximityWithVariations } from '../../utils/queryGenerators';
import { globalTheme } from '@shared/theme/globalTheme';

const ProximityVariationView = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    lemma1: '',
    lemma2: '',
    distance: 10,
    variationType: 'simple',
    attribute: 'word',
    bidirectional: false
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
    { value: 'complex', label: t('queryGenerator.proximityVariation.complex') }
  ];

  const attributeOptions = [
    { value: 'word', label: t('queryGenerator.attributes.word') },
    { value: 'lemma', label: t('queryGenerator.attributes.lemma') }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.infoBox}>
        <div style={styles.infoHeader}>
          <Layers size={18} style={{ color: '#8B4513' }} />
          <strong>{t('queryGenerator.proximityVariation.title')}</strong>
        </div>
        <p style={styles.infoText}>{t('queryGenerator.proximityVariation.description')}</p>
      </div>

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

        <RadioGroup label={t('queryGenerator.proximityVariation.variationType')} value={formData.variationType} onChange={(v) => setFormData({ ...formData, variationType: v })} options={variationOptions} name="variation" inline={true} />
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
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: globalTheme.spacing.lg },
  submitButton: { padding: `${globalTheme.spacing.md} ${globalTheme.spacing.xl}`, borderRadius: globalTheme.borderRadius.md, border: 'none', background: '#8B4513', color: '#FFFFFF', fontFamily: globalTheme.typography.fontFamily.secondary, fontSize: globalTheme.typography.size.md, fontWeight: globalTheme.typography.weight.semibold, cursor: 'pointer', transition: globalTheme.transitions.fast, marginTop: globalTheme.spacing.md }
};

export default ProximityVariationView;
