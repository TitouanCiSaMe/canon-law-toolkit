/**
 * Vue de recherche par proximité
 * @module query-generator/components/views
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { FormField, RadioGroup, Checkbox, InfoBox, ResultCard } from '../ui';
import { generateProximityQuery } from '../../utils/queryGenerators';
import { globalTheme } from '@shared/theme/globalTheme';

const ProximityView = () => {
  const { t } = useTranslation();

  // État du formulaire
  const [formData, setFormData] = useState({
    lemma1: '',
    lemma2: '',
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
      <div style={styles.infoBox}>
        <div style={styles.infoHeader}>
          <Search size={18} style={{ color: '#1e40af' }} />
          <strong>{t('queryGenerator.proximity.title')}</strong>
        </div>
        <p style={styles.infoText}>{t('queryGenerator.proximity.description')}</p>
      </div>

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
          {t('queryGenerator.ui.generate')}
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
    padding: 0
  },

  infoBox: {
    background: 'linear-gradient(135deg, #DEB887 0%, #D2B48C 100%)',
    padding: globalTheme.spacing.md,
    borderRadius: globalTheme.borderRadius.md,
    borderLeft: `4px solid #8B4513`,
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

  form: {
    background: globalTheme.colors.background.card,
    padding: globalTheme.spacing.lg,
    borderRadius: globalTheme.borderRadius.md,
    border: `1px solid ${globalTheme.colors.border.light}`,
    borderLeft: `3px solid #8B4513`,
    marginBottom: globalTheme.spacing.lg,
    boxShadow: globalTheme.shadows.card
  },

  formTitle: {
    fontSize: globalTheme.typography.size.lg,
    fontWeight: globalTheme.typography.weight.semibold,
    color: globalTheme.colors.text.primary,
    marginBottom: globalTheme.spacing.lg,
    paddingBottom: globalTheme.spacing.sm,
    borderBottom: `1px solid ${globalTheme.colors.border.light}`
  },

  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: globalTheme.spacing.lg
  },

  submitButton: {
    padding: `${globalTheme.spacing.md} ${globalTheme.spacing.xl}`,
    borderRadius: globalTheme.borderRadius.md,
    border: 'none',
    background: '#8B4513',
    color: '#FFFFFF',
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.md,
    fontWeight: globalTheme.typography.weight.semibold,
    cursor: 'pointer',
    transition: globalTheme.transitions.fast,
    marginTop: globalTheme.spacing.md
  }
};

export default ProximityView;
