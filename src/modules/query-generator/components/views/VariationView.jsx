/**
 * Vue de recherche par variations orthographiques
 * @module query-generator/components/views
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, RadioGroup, InfoBox, ResultCard } from '../ui';
import { generateAllVariationQueries } from '../../utils/variationGenerators';
import { globalTheme } from '@shared/theme/globalTheme';

const VariationView = () => {
  const { t } = useTranslation();

  const [mot, setMot] = useState('intentio');
  const [withSuffix, setWithSuffix] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const queryResult = generateAllVariationQueries(mot, withSuffix);

    if (queryResult.error) {
      setError(queryResult.error);
      setResult(null);
    } else {
      setResult(queryResult);
      setError(null);
    }
  };

  const desinenceOptions = [
    { value: true, label: t('queryGenerator.variation.withSuffix') },
    { value: false, label: t('queryGenerator.variation.exactForm') }
  ];

  return (
    <div style={styles.container}>
      <InfoBox type="info" title={t('queryGenerator.variation.title')}>
        {t('queryGenerator.variation.description')}
      </InfoBox>

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
          label={t('queryGenerator.variation.desinenceType')}
          value={withSuffix}
          onChange={(val) => setWithSuffix(val === 'true')}
          options={desinenceOptions.map(opt => ({ ...opt, value: String(opt.value) }))}
          name="desinence"
        />

        <button type="submit" style={styles.submitButton}>
          🔄 {t('queryGenerator.ui.generate')}
        </button>
      </form>

      {error && <InfoBox type="error" title={t('common.error')}>{error}</InfoBox>}

      {result && (
        <>
          <ResultCard title={t('queryGenerator.variation.simpleQuery')} query={result.requete1} />
          <ResultCard title={t('queryGenerator.variation.mediumQuery')} query={result.requete2} />
          <ResultCard title={t('queryGenerator.variation.complexQuery')} query={result.requete3} />
          <ResultCard
            title={t('queryGenerator.variation.medievalQuery')}
            query={result.requete_medievale}
            variant="medieval"
            metadata={{ [t('queryGenerator.variation.medievalHelp')]: '✓' }}
          />
        </>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: `${globalTheme.spacing.xxl} ${globalTheme.spacing.lg}` },
  form: { background: globalTheme.colors.background.card, padding: globalTheme.spacing.xxl, borderRadius: globalTheme.borderRadius.lg, border: `2px solid ${globalTheme.colors.border.light}`, marginBottom: globalTheme.spacing.xxl, boxShadow: globalTheme.shadows.card },
  formTitle: { ...globalTheme.typography.heading.h3, color: globalTheme.palettes.concordance.primary.main, marginBottom: globalTheme.spacing.xl, borderBottom: `2px solid ${globalTheme.colors.border.light}`, paddingBottom: globalTheme.spacing.md },
  submitButton: { display: 'inline-flex', alignItems: 'center', gap: globalTheme.spacing.sm, padding: `${globalTheme.spacing.lg} ${globalTheme.spacing.xxl}`, borderRadius: globalTheme.borderRadius.md, border: `2px solid ${globalTheme.palettes.concordance.primary.blue}`, background: globalTheme.palettes.concordance.primary.blue, color: '#FFFFFF', fontFamily: globalTheme.typography.fontFamily.secondary, fontSize: globalTheme.typography.size.lg, fontWeight: globalTheme.typography.weight.semibold, cursor: 'pointer', transition: globalTheme.transitions.normal, marginTop: globalTheme.spacing.lg }
};

export default VariationView;
