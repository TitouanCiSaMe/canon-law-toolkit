import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ExportButtons from '../ui/ExportButtons';
import { visualTheme } from '@shared/theme/globalTheme';

/**
 * Composant ComparisonTemporalChart - Comparaison chronologique avancée entre 2 corpus
 */
const ComparisonTemporalChart = ({
  corpusA,
  corpusB,
  height = 400
}) => {
  const { t } = useTranslation();

  // ============================================================================
  // GÉNÉRATION D'ID UNIQUE POUR EXPORT PNG
  // ============================================================================
  
  const aggregatedChartId = useRef(`comparison-temporal-aggregated-${Date.now()}`).current;

  const chartOptions = [
    {
      id: aggregatedChartId,
      name: 'graphique_agrege_comparison',
      label: t('concordance.views.corpusComparison.charts.temporal.aggregatedChart')
    }
  ];

  // ============================================================================
  // ÉTATS LOCAUX
  // ============================================================================
  
  const [granularity, setGranularity] = useState('decade');
  const [countMode, setCountMode] = useState('works');

  // ============================================================================
  // FONCTION DE CALCUL DES DONNÉES TEMPORELLES (useCallback)
  // ============================================================================
  
  const calculateTemporalData = useCallback((filteredData) => {
    if (!filteredData || filteredData.length === 0) {
      return [];
    }

    // Extraction et normalisation des dates
    const itemsWithDates = filteredData
      .map(item => {
        let year = null;
        if (item.period && item.period !== 'Période inconnue') {
          const yearMatch = item.period.match(/(\d{4})/);
          if (yearMatch) {
            year = parseInt(yearMatch[1]);
          }
        }
        return { ...item, extractedYear: year };
      })
      .filter(item => item.extractedYear !== null);

    if (itemsWithDates.length === 0) {
      return [];
    }

    // Choisir les données selon le mode
    let dataToCount = itemsWithDates;
    
    if (countMode === 'works') {
      const uniqueWorks = new Map();
      itemsWithDates.forEach(item => {
        const workKey = `${item.title}|||${item.author}|||${item.period}`;
        if (!uniqueWorks.has(workKey)) {
          uniqueWorks.set(workKey, item);
        }
      });
      dataToCount = Array.from(uniqueWorks.values());
    }

    // Regrouper selon la granularité
    const getPeriodStart = (year) => {
      switch (granularity) {
        case 'year':
          return year;
        case 'decade':
          return Math.floor(year / 10) * 10;
        case 'quarter':
          return Math.floor(year / 25) * 25;
        case 'half':
          return Math.floor(year / 50) * 50;
        default:
          return Math.floor(year / 10) * 10;
      }
    };

    const periodCounts = {};
    dataToCount.forEach(item => {
      const periodStart = getPeriodStart(item.extractedYear);
      periodCounts[periodStart] = (periodCounts[periodStart] || 0) + 1;
    });

    return Object.entries(periodCounts)
      .map(([period, count]) => ({
        period: parseInt(period),
        count: count
      }))
      .sort((a, b) => a.period - b.period);
  }, [granularity, countMode]);

  // ============================================================================
  // CALCUL DES DONNÉES POUR LES 2 CORPUS (HOOKS EN PREMIER)
  // ============================================================================
  
  const temporalDataA = useMemo(
    () => calculateTemporalData(corpusA),
    [corpusA, calculateTemporalData]
  );

  const temporalDataB = useMemo(
    () => calculateTemporalData(corpusB),
    [corpusB, calculateTemporalData]
  );

  // ============================================================================
  // FUSION DES PÉRIODES POUR LE GRAPHIQUE OVERLAY
  // ============================================================================
  
  const mergedData = useMemo(() => {
    if (!temporalDataA || !temporalDataB) {
      return [];
    }

    const allPeriods = new Set([
      ...temporalDataA.map(d => d.period),
      ...temporalDataB.map(d => d.period)
    ]);

    const mapA = new Map(temporalDataA.map(d => [d.period, d.count]));
    const mapB = new Map(temporalDataB.map(d => [d.period, d.count]));

    return Array.from(allPeriods)
      .map(period => ({
        period,
        countA: mapA.get(period) || 0,
        countB: mapB.get(period) || 0
      }))
      .sort((a, b) => a.period - b.period);
  }, [temporalDataA, temporalDataB]);

  // ============================================================================
  // STATISTIQUES COMPARATIVES
  // ============================================================================
  
  const stats = useMemo(() => {
    if (!temporalDataA || !temporalDataB || (temporalDataA.length === 0 && temporalDataB.length === 0)) {
      return null;
    }

    const totalA = temporalDataA.reduce((sum, d) => sum + d.count, 0);
    const totalB = temporalDataB.reduce((sum, d) => sum + d.count, 0);

    const avgA = temporalDataA.length > 0 
      ? Math.round(totalA / temporalDataA.length) 
      : 0;
    const avgB = temporalDataB.length > 0 
      ? Math.round(totalB / temporalDataB.length) 
      : 0;

    const maxA = temporalDataA.length > 0
      ? temporalDataA.reduce((max, d) => d.count > max.count ? d : max, temporalDataA[0])
      : { period: '-', count: 0 };

    const maxB = temporalDataB.length > 0
      ? temporalDataB.reduce((max, d) => d.count > max.count ? d : max, temporalDataB[0])
      : { period: '-', count: 0 };

    return {
      totalA,
      totalB,
      avgA,
      avgB,
      maxA,
      maxB
    };
  }, [temporalDataA, temporalDataB]);

  // ============================================================================
  // VALIDATION DES DONNÉES (APRÈS TOUS LES HOOKS)
  // ============================================================================
  
  if (!corpusA || !corpusB || corpusA.length === 0 || corpusB.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem',
        color: '#64748b'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⧗</div>
        <h3>{t('concordance.charts.noData.temporal')}</h3>
      </div>
    );
  }

  // ============================================================================
  // LABELS ET CONFIGURATIONS
  // ============================================================================
  
  const granularityOptions = [
    { value: 'year', label: t('concordance.views.corpusComparison.charts.temporal.granularity.years'), icon: '⧗' },
    { value: 'decade', label: t('concordance.views.corpusComparison.charts.temporal.granularity.decades'), icon: '◈' },
    { value: 'quarter', label: t('concordance.views.corpusComparison.charts.temporal.granularity.quarters'), icon: '⧗' },
    { value: 'half', label: t('concordance.views.corpusComparison.charts.temporal.granularity.halves'), icon: '⧗' }
  ];

  const countModeOptions = [
    {
      value: 'works',
      label: t('concordance.views.corpusComparison.charts.temporal.countMode.works'),
      description: t('concordance.views.corpusComparison.charts.temporal.countMode.worksDesc'),
      icon: '⚜'
    },
    {
      value: 'concordances',
      label: t('concordance.views.corpusComparison.charts.temporal.countMode.concordances'),
      description: t('concordance.views.corpusComparison.charts.temporal.countMode.concordancesDesc'),
      icon: '⟐'
    }
  ];

  const granularityLabels = {
    year: t('concordance.views.corpusComparison.charts.temporal.granularity.years'),
    decade: t('concordance.views.corpusComparison.charts.temporal.granularity.decades'),
    quarter: t('concordance.views.corpusComparison.charts.temporal.granularity.quarters'),
    half: t('concordance.views.corpusComparison.charts.temporal.granularity.halves')
  };

  const countModeLabel = countMode === 'works' 
    ? t('concordance.views.corpusComparison.charts.temporal.works')
    : t('concordance.views.corpusComparison.charts.temporal.concordances');

  // ============================================================================
  // TOOLTIP PERSONNALISÉ
  // ============================================================================
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '0.75rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <p style={{ 
            fontWeight: '600', 
            marginBottom: '0.5rem',
            color: '#1e293b'
          }}>
            {t('concordance.views.corpusComparison.charts.temporal.period')} : {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              color: entry.color,
              fontSize: '0.9rem',
              margin: '0.25rem 0'
            }}>
              <strong>{entry.name}:</strong> {entry.value} {countModeLabel}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ============================================================================
  // RENDU
  // ============================================================================

  return (
    <div>
      {/* Titre principal */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          color: '#1e293b'
        }}>
          ⧗ {t('concordance.views.corpusComparison.charts.temporal.title')}
        </h3>

        {/* Export buttons */}
        <ExportButtons
          onExportConcordances={() => {}}
          onExportAnalytics={() => {}}
          chartOptions={chartOptions}
        />
      </div>

      {/* Conteneur avec bordure */}
      <div style={{
        background: visualTheme.colors.background.card,
        border: `2px solid ${visualTheme.colors.border.light}`,
        borderRadius: visualTheme.borderRadius.lg,
        padding: visualTheme.spacing.xxl
      }}>
        {/* ==================================================================
            CONTRÔLES DE VISUALISATION
            ================================================================== */}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: visualTheme.spacing.xl,
          marginBottom: visualTheme.spacing.xxl
        }}>
          {/* Sélecteur de granularité */}
          <div>
            <h5 style={{
              fontSize: visualTheme.typography.size.md,
              fontWeight: visualTheme.typography.weight.semibold,
              color: visualTheme.colors.text.primary,
              marginBottom: visualTheme.spacing.md
            }}>
              ◈ {t('concordance.views.corpusComparison.charts.temporal.scaleLabel')}
            </h5>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: visualTheme.spacing.sm
            }}>
              {granularityOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setGranularity(option.value)}
                  style={{
                    padding: visualTheme.spacing.md,
                    background: granularity === option.value
                      ? visualTheme.colors.accent.blue
                      : 'transparent',
                    color: granularity === option.value
                      ? 'white'
                      : visualTheme.colors.text.primary,
                    border: `2px solid ${granularity === option.value 
                      ? visualTheme.colors.accent.blue 
                      : visualTheme.colors.border.light}`,
                    borderRadius: visualTheme.borderRadius.md,
                    cursor: 'pointer',
                    fontSize: visualTheme.typography.size.sm,
                    fontWeight: visualTheme.typography.weight.medium,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: visualTheme.spacing.sm
                  }}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle mode de comptage */}
          <div>
            <h5 style={{
              fontSize: visualTheme.typography.size.md,
              fontWeight: visualTheme.typography.weight.semibold,
              color: visualTheme.colors.text.primary,
              marginBottom: visualTheme.spacing.md
            }}>
              ◈ {t('concordance.views.corpusComparison.charts.temporal.countModeLabel')}
            </h5>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: visualTheme.spacing.sm
            }}>
              {countModeOptions.map(option => (
                <label
                  key={option.value}
                  style={{
                    padding: visualTheme.spacing.md,
                    background: countMode === option.value
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'transparent',
                    cursor: 'pointer',
                    border: `2px solid ${countMode === option.value 
                      ? visualTheme.colors.accent.green 
                      : visualTheme.colors.border.light}`,
                    borderRadius: visualTheme.borderRadius.md,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: visualTheme.spacing.sm
                  }}>
                    <input
                      type="radio"
                      name="countMode"
                      value={option.value}
                      checked={countMode === option.value}
                      onChange={(e) => setCountMode(e.target.value)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{
                      fontSize: visualTheme.typography.size.md,
                      fontWeight: visualTheme.typography.weight.medium,
                      color: visualTheme.colors.text.primary
                    }}>
                      {option.icon} {option.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: visualTheme.typography.size.xs,
                    color: visualTheme.colors.text.muted,
                    marginLeft: '2rem',
                    marginTop: visualTheme.spacing.xs,
                    display: 'block'
                  }}>
                    {option.description}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================================
            STATISTIQUES COMPARATIVES
            ================================================================== */}
        
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: visualTheme.spacing.lg,
            marginBottom: visualTheme.spacing.xxl
          }}>
            {/* Total */}
            <div style={{
              background: visualTheme.colors.background.card,
              border: `2px solid ${visualTheme.colors.border.light}`,
              borderRadius: visualTheme.borderRadius.lg,
              padding: visualTheme.spacing.lg,
              boxShadow: visualTheme.shadows.card
            }}>
              <div style={{
                fontSize: visualTheme.typography.size.xs,
                color: visualTheme.colors.text.muted,
                textTransform: 'uppercase',
                marginBottom: visualTheme.spacing.sm
              }}>
                {t('concordance.views.corpusComparison.stats.total')}
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                <div>
                  <div style={{
                    fontSize: visualTheme.typography.size.xl,
                    fontWeight: visualTheme.typography.weight.semibold,
                    color: '#8B4513'
                  }}>
                    {stats.totalA}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {t('concordance.views.corpusComparison.corpusA')}
                  </div>
                </div>
                <div style={{ color: '#94a3b8' }}>vs</div>
                <div>
                  <div style={{
                    fontSize: visualTheme.typography.size.xl,
                    fontWeight: visualTheme.typography.weight.semibold,
                    color: '#A0522D'
                  }}>
                    {stats.totalB}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {t('concordance.views.corpusComparison.corpusB')}
                  </div>
                </div>
              </div>
            </div>

            {/* Moyenne */}
            <div style={{
              background: visualTheme.colors.background.card,
              border: `2px solid ${visualTheme.colors.border.light}`,
              borderRadius: visualTheme.borderRadius.lg,
              padding: visualTheme.spacing.lg,
              boxShadow: visualTheme.shadows.card
            }}>
              <div style={{
                fontSize: visualTheme.typography.size.xs,
                color: visualTheme.colors.text.muted,
                textTransform: 'uppercase',
                marginBottom: visualTheme.spacing.sm
              }}>
                {t('concordance.views.corpusComparison.stats.averagePerPeriod')}
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                <div>
                  <div style={{
                    fontSize: visualTheme.typography.size.xl,
                    fontWeight: visualTheme.typography.weight.semibold,
                    color: '#8B4513'
                  }}>
                    {stats.avgA}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {t('concordance.views.corpusComparison.corpusA')}
                  </div>
                </div>
                <div style={{ color: '#94a3b8' }}>vs</div>
                <div>
                  <div style={{
                    fontSize: visualTheme.typography.size.xl,
                    fontWeight: visualTheme.typography.weight.semibold,
                    color: '#A0522D'
                  }}>
                    {stats.avgB}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {t('concordance.views.corpusComparison.corpusB')}
                  </div>
                </div>
              </div>
            </div>

            {/* Période la plus riche */}
            <div style={{
              background: visualTheme.colors.background.card,
              border: `2px solid ${visualTheme.colors.border.light}`,
              borderRadius: visualTheme.borderRadius.lg,
              padding: visualTheme.spacing.lg,
              boxShadow: visualTheme.shadows.card
            }}>
              <div style={{
                fontSize: visualTheme.typography.size.xs,
                color: visualTheme.colors.text.muted,
                textTransform: 'uppercase',
                marginBottom: visualTheme.spacing.sm
              }}>
                {t('concordance.views.corpusComparison.stats.richestPeriod')}
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                <div>
                  <div style={{
                    fontSize: visualTheme.typography.size.lg,
                    fontWeight: visualTheme.typography.weight.semibold,
                    color: '#8B4513'
                  }}>
                    {stats.maxA.period}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {stats.maxA.count} (A)
                  </div>
                </div>
                <div style={{ color: '#94a3b8' }}>|</div>
                <div>
                  <div style={{
                    fontSize: visualTheme.typography.size.lg,
                    fontWeight: visualTheme.typography.weight.semibold,
                    color: '#A0522D'
                  }}>
                    {stats.maxB.period}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {stats.maxB.count} (B)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            GRAPHIQUE AGRÉGÉ OVERLAY
            ================================================================== */}
        
        <div 
          id={aggregatedChartId}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}
        >
          <h5 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            ◈ {t('concordance.views.corpusComparison.charts.temporal.distributionBy', { 
              granularity: granularityLabels[granularity].toLowerCase() 
            })}
          </h5>

          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
              <XAxis
                dataKey="period"
                style={{ fontSize: '0.85rem' }}
                label={{
                  value: t('concordance.views.corpusComparison.charts.temporal.period'),
                  position: 'insideBottom',
                  offset: -5,
                  style: { fontSize: '0.9rem', fill: '#64748b' }
                }}
              />
              
              <YAxis
                style={{ fontSize: '0.85rem' }}
                label={{
                  value: countMode === 'works' 
                    ? t('concordance.views.corpusComparison.charts.temporal.numberOfWorks')
                    : t('concordance.views.corpusComparison.charts.temporal.numberOfConcordances'),
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: '0.9rem', fill: '#64748b' }
                }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  paddingBottom: '1rem'
                }}
              />
              
              <Line
                type="monotone"
                dataKey="countA"
                name={t('concordance.views.corpusComparison.charts.legend.corpusA')}
                stroke="#8B4513"
                strokeWidth={3}
                dot={{ fill: '#8B4513', r: 5 }}
                activeDot={{ r: 7 }}
              />
              
              <Line
                type="monotone"
                dataKey="countB"
                name={t('concordance.views.corpusComparison.charts.legend.corpusB')}
                stroke="#A0522D"
                strokeWidth={3}
                dot={{ fill: '#A0522D', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTemporalChart;
