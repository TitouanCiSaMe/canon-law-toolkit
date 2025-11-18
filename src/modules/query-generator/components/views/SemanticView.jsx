/**
 * Vue de recherche par contexte sémantique
 * @module query-generator/components/views
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, RadioGroup, InfoBox, ResultCard } from '../ui';
import { generateSemanticContextQuery } from '../../utils/queryGenerators';
import { globalTheme } from '@shared/theme/globalTheme';

const SemanticView = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    centralLemma: 'intentio',
    contextLemmas: 'voluntas, ratio, intellectus',
    distance: 20,
    contextMode: 'any'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryResult = generateSemanticContextQuery(
      formData.centralLemma,
      formData.contextLemmas,
      formData.distance,
      formData.contextMode
    );

    queryResult.error ? (setError(queryResult.error), setResult(null)) : (setResult(queryResult), setError(null));
  };

  const contextModeOptions = [
    {
      value: 'any',
      label: t('queryGenerator.semantic.modeAny'),
      description: t('queryGenerator.semantic.modeHelp.any')
    },
    {
      value: 'phrase',
      label: t('queryGenerator.semantic.modePhrase'),
      description: t('queryGenerator.semantic.modeHelp.phrase')
    },
    {
      value: 'all',
      label: t('queryGenerator.semantic.modeAll'),
      description: t('queryGenerator.semantic.modeHelp.all')
    }
  ];

  return (
    <div style={styles.container}>
      <InfoBox type="info" title={t('queryGenerator.semantic.title')}>
        {t('queryGenerator.semantic.description')}
      </InfoBox>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>{t('queryGenerator.semantic.formTitle')}</h3>

        <FormField
          label={t('queryGenerator.semantic.centralLemma')}
          value={formData.centralLemma}
          onChange={(v) => setFormData({ ...formData, centralLemma: v })}
          placeholder={t('queryGenerator.semantic.placeholders.centralLemma')}
          required
        />

        <FormField
          label={t('queryGenerator.semantic.contextLemmas')}
          type="textarea"
          value={formData.contextLemmas}
          onChange={(v) => setFormData({ ...formData, contextLemmas: v })}
          placeholder={t('queryGenerator.semantic.placeholders.contextLemmas')}
          helpText={t('queryGenerator.semantic.contextHelp')}
          required
          rows={3}
        />

        <FormField
          label={t('queryGenerator.proximity.distance')}
          type="number"
          value={formData.distance}
          onChange={(v) => setFormData({ ...formData, distance: v })}
          min={5}
          max={100}
          required
        />

        <RadioGroup
          label={t('queryGenerator.semantic.contextMode')}
          value={formData.contextMode}
          onChange={(v) => setFormData({ ...formData, contextMode: v })}
          options={contextModeOptions}
          name="contextMode"
        />

        <button type="submit" style={styles.submitButton}>
          🧠 {t('queryGenerator.ui.generate')}
        </button>
      </form>

      {error && <InfoBox type="error" title={t('common.error')}>{error}</InfoBox>}

      {result && (
        <ResultCard
          title={t('queryGenerator.ui.queryGenerated')}
          query={result.query}
          metadata={{
            [t('queryGenerator.semantic.results.central')]: result.centralLemma,
            [t('queryGenerator.semantic.results.contexts')]: result.contextLemmas.join(', ')
          }}
        />
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

export default SemanticView;
