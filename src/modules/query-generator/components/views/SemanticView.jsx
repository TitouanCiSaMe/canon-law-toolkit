/**
 * Vue de recherche par contexte sémantique
 * @module query-generator/components/views
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain } from 'lucide-react';
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
      <div style={styles.infoBox}>
        <div style={styles.infoHeader}>
          <Brain size={18} style={{ color: '#059669' }} />
          <strong>{t('queryGenerator.semantic.title')}</strong>
        </div>
        <p style={styles.infoText}>{t('queryGenerator.semantic.description')}</p>
      </div>

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
          {t('queryGenerator.ui.generate')}
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
  container: { padding: 0 },

  infoBox: {
    background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    padding: globalTheme.spacing.lg,
    borderRadius: globalTheme.borderRadius.md,
    borderLeft: '4px solid #059669',
    marginBottom: globalTheme.spacing.lg
  },

  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: globalTheme.spacing.sm,
    marginBottom: globalTheme.spacing.xs,
    fontSize: globalTheme.typography.size.md,
    fontWeight: globalTheme.typography.weight.semibold,
    color: '#059669'
  },

  infoText: {
    margin: 0,
    fontSize: globalTheme.typography.size.sm,
    color: globalTheme.colors.text.secondary,
    lineHeight: '1.5'
  },

  form: { background: globalTheme.colors.background.card, padding: globalTheme.spacing.lg, borderRadius: globalTheme.borderRadius.md, border: `1px solid ${globalTheme.colors.border.light}`, borderLeft: '3px solid #059669', marginBottom: globalTheme.spacing.lg, boxShadow: globalTheme.shadows.card },
  formTitle: { fontSize: globalTheme.typography.size.lg, fontWeight: globalTheme.typography.weight.semibold, color: globalTheme.colors.text.primary, marginBottom: globalTheme.spacing.lg, paddingBottom: globalTheme.spacing.sm, borderBottom: `1px solid ${globalTheme.colors.border.light}` },
  submitButton: { padding: `${globalTheme.spacing.md} ${globalTheme.spacing.xl}`, borderRadius: globalTheme.borderRadius.md, border: 'none', background: '#059669', color: '#FFFFFF', fontFamily: globalTheme.typography.fontFamily.secondary, fontSize: globalTheme.typography.size.md, fontWeight: globalTheme.typography.weight.semibold, cursor: 'pointer', transition: globalTheme.transitions.fast, marginTop: globalTheme.spacing.md }
};

export default SemanticView;
