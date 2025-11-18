import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ExportButtons from '../ui/ExportButtons';
import TemporalChart from '../charts/TemporalChart';
import TimelineGantt from '../charts/TimelineGantt';
import { visualTheme } from '@shared/theme/globalTheme';

/**
 * Composant TemporalView - Vue de l'évolution chronologique avancée (v2 avec export PNG)
 * 
 * Affiche un graphique temporel avec contrôles de granularité et mode de comptage.
 * Permet de visualiser l'évolution du corpus selon différentes échelles temporelles
 * et de choisir entre le nombre d'œuvres uniques ou le nombre total de concordances.
 * 
 * NOUVEAU (v2) : Support complet de l'export PNG pour les deux graphiques
 * - Graphique agrégé (TemporalChart)
 * - Timeline Gantt (TimelineGantt)
 * - Sélecteur intégré dans ExportButtons
 * 
 * Fonctionnalités :
 * - Sélecteur de granularité : Années / Décennies / Quart de siècle / Demi-siècle
 * - Toggle mode : Nombre d'œuvres (dédupliqué) / Nombre de concordances (total)
 * - Calcul dynamique des données selon les paramètres
 * - Export des données filtrées (CSV, JSON)
 * - Export graphiques en PNG haute résolution avec sélecteur
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<Object>} props.filteredData - Données de concordances filtrées
 * @param {Object} props.analytics - Statistiques calculées (non utilisé directement)
 * @param {Function} props.onExportConcordances - Handler d'export CSV
 * @param {Function} props.onExportAnalytics - Handler d'export JSON
 * 
 * @returns {JSX.Element} Vue chronologique avec contrôles avancés et export PNG
 * 
 * @example
 * <TemporalView
 *   filteredData={concordances}
 *   analytics={analytics}
 *   onExportConcordances={() => exportConcordancesCSV(filteredData)}
 *   onExportAnalytics={() => exportAnalyticsJSON(analytics)}
 * />
 */
const TemporalView = ({
  filteredData,
  analytics,
  onExportConcordances,
  onExportAnalytics
}) => {
  // ============================================================================
  // HOOK DE TRADUCTION
  // ============================================================================
  
  const { t } = useTranslation();
  
  // ============================================================================
  // GÉNÉRATION D'IDS UNIQUES POUR LES GRAPHIQUES (NOUVEAU v2)
  // ============================================================================
  
  /**
   * IDs uniques et stables pour les deux graphiques
   * Utilisés par html2canvas pour l'export PNG
   * 
   * Technique :
   * - useRef() : Garantit stabilité entre re-renders
   * - Date.now() : Garantit unicité si plusieurs vues ouvertes
   * - .current : Extrait la valeur du ref
   * 
   * @type {string}
   */
  const temporalChartId = useRef(`temporal-chart-${Date.now()}`).current;
  const timelineGanttId = useRef(`timeline-gantt-${Date.now()}-${Math.random()}`).current;
  
  /**
   * Configuration des options de graphiques pour le sélecteur
   * Structure requise par ExportButtons v2
   * 
   * @type {Array<{id: string, name: string, label: string}>}
   */
  const chartOptions = [
    {
      id: temporalChartId,
      name: 'graphique_agrege',
      label: t('concordance.charts.temporal.aggregatedChart')
    },
    {
      id: timelineGanttId,
      name: 'timeline',
      label: t('concordance.charts.temporal.timeline')
    }
  ];

  // ============================================================================
  // ÉTATS LOCAUX
  // ============================================================================
  
  /**
   * Granularité temporelle sélectionnée
   * @type {('year'|'decade'|'quarter'|'half')}
   */
  const [granularity, setGranularity] = useState('decade');
  
  /**
   * Mode de comptage
   * @type {('works'|'concordances')}
   */
  const [countMode, setCountMode] = useState('works');

  // ============================================================================
  // FONCTION DE CALCUL DES DONNÉES TEMPORELLES
  // ============================================================================
  
  /**
   * Calcule les données temporelles selon la granularité et le mode choisis
   * 
   * @returns {Array<{period: string, count: number}>} Données pour le graphique
   */
  const temporalData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return [];
    }

    // -------------------------------------------------------------------------
    // ÉTAPE 1 : Extraction et normalisation des dates
    // -------------------------------------------------------------------------
    
    const itemsWithDates = filteredData
      .map(item => {
        // Extraire l'année de début de la période
        let year = null;
        
        if (item.period && item.period !== 'Période inconnue') {
          const yearMatch = item.period.match(/(\d{4})/);
          if (yearMatch) {
            year = parseInt(yearMatch[1]);
          }
        }
        
        return {
          ...item,
          extractedYear: year
        };
      })
      .filter(item => item.extractedYear !== null); // Filtrer les dates invalides

    if (itemsWithDates.length === 0) {
      return [];
    }

    // -------------------------------------------------------------------------
    // ÉTAPE 2 : Choisir les données selon le mode
    // -------------------------------------------------------------------------
    
    let dataToCount = itemsWithDates;
    
    if (countMode === 'works') {
      // MODE ŒUVRES : Dédupliquer par œuvre unique
      const uniqueWorks = new Map();
      
      itemsWithDates.forEach(item => {
        const workKey = `${item.title}|||${item.author}|||${item.period}`;
        
        if (!uniqueWorks.has(workKey)) {
          uniqueWorks.set(workKey, item);
        }
      });
      
      dataToCount = Array.from(uniqueWorks.values());
    }
    // Sinon (countMode === 'concordances'), on garde toutes les concordances

    // -------------------------------------------------------------------------
    // ÉTAPE 3 : Regrouper selon la granularité
    // -------------------------------------------------------------------------
    
    /**
     * Calcule le début de période selon la granularité
     * @param {number} year - Année à regrouper
     * @returns {number} Année de début de période
     */
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

    // Compter par période
    const periodCounts = {};
    
    dataToCount.forEach(item => {
      const periodStart = getPeriodStart(item.extractedYear);
      periodCounts[periodStart] = (periodCounts[periodStart] || 0) + 1;
    });

    // -------------------------------------------------------------------------
    // ÉTAPE 4 : Formatter pour le graphique
    // -------------------------------------------------------------------------
    
    const data = Object.entries(periodCounts)
      .map(([period, count]) => ({
        period: parseInt(period),
        count: count
      }))
      .sort((a, b) => a.period - b.period);

    return data;
  }, [filteredData, granularity, countMode]);

  // ============================================================================
  // STATISTIQUES RÉSUMÉES
  // ============================================================================
  
  const stats = useMemo(() => {
    if (temporalData.length === 0) {
      return null;
    }

    const totalCount = temporalData.reduce((sum, item) => sum + item.count, 0);
    const avgCount = (totalCount / temporalData.length).toFixed(1);
    const maxPeriod = temporalData.reduce((max, item) => 
      item.count > max.count ? item : max
    );

    return {
      totalCount,
      avgCount,
      maxPeriod
    };
  }, [temporalData]);

  // ============================================================================
  // LABELS DYNAMIQUES SELON LE MODE
  // ============================================================================
  
  /**
   * Labels des granularités (traduits)
   */
  const granularityLabels = {
    year: t('concordance.charts.temporal.years'),
    decade: t('concordance.charts.temporal.decades'),
    quarter: t('concordance.charts.temporal.quarters'),
    half: t('concordance.charts.temporal.halves')
  };

  /**
   * Label du mode de comptage actuel (traduit)
   */
  const countModeLabel = countMode === 'works' 
    ? t('concordance.charts.temporal.works')
    : t('concordance.charts.temporal.concordances');

  /**
   * Options de granularité pour le sélecteur
   */
  const granularityOptions = [
    {
      value: 'year',
      label: t('concordance.charts.temporal.years'),
      description: t('concordance.charts.temporal.yearlyDetail')
    },
    {
      value: 'decade',
      label: t('concordance.charts.temporal.decades'),
      description: t('concordance.charts.temporal.decadeOverview')
    },
    {
      value: 'quarter',
      label: t('concordance.charts.temporal.quarters'),
      description: t('concordance.charts.temporal.quarterMovements')
    },
    {
      value: 'half',
      label: t('concordance.charts.temporal.halves'),
      description: t('concordance.charts.temporal.halfTrends')
    }
  ];

  /**
   * Options de mode de comptage pour le sélecteur
   */
  const countModeOptions = [
    {
      value: 'works',
      label: t('concordance.charts.temporal.numWorksMode'),
      description: t('concordance.charts.temporal.numWorksDesc')
    },
    {
      value: 'concordances',
      label: t('concordance.charts.temporal.numConcordancesMode'),
      description: t('concordance.charts.temporal.numConcordancesDesc')
    }
  ];

  // ============================================================================
  // RENDU DU COMPOSANT
  // ============================================================================
  
  return (
    <div>
      
      {/* ====================================================================
          SECTION 1 : BARRE D'EXPORT
          ==================================================================== */}
      
      <ExportButtons
        filteredData={filteredData}
        analytics={analytics}
        chartId={chartOptions}               // NOUVEAU v2 : Array d'options
        onExportConcordances={onExportConcordances}
        onExportAnalytics={onExportAnalytics}
      />
      
      {/* ====================================================================
          SECTION 2 : CONTENU PRINCIPAL
          ==================================================================== */}
      
      <div style={{ marginBottom: '3rem' }}>
        
        {/* ==================================================================
            CONTRÔLES DE VISUALISATION
            ================================================================== */}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: visualTheme.spacing.xl,
          marginBottom: visualTheme.spacing.xxl,
          background: visualTheme.colors.background.card,
          border: `2px solid ${visualTheme.colors.border.light}`,
          borderRadius: visualTheme.borderRadius.lg,
          padding: visualTheme.spacing.xl,
          boxShadow: visualTheme.shadows.card
        }}>
          
          {/* SÉLECTEUR DE GRANULARITÉ */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: visualTheme.spacing.md,
              marginBottom: visualTheme.spacing.lg,
              paddingBottom: visualTheme.spacing.md,
              borderBottom: `2px solid ${visualTheme.colors.border.light}`
            }}>
              <span style={{
                fontSize: '1.5rem'
              }}>
                ⧗
              </span>
              <h5 style={{
                fontSize: visualTheme.typography.size.lg,
                fontWeight: visualTheme.typography.weight.semibold,
                color: visualTheme.colors.text.primary,
                margin: 0
              }}>
                {t('concordance.charts.temporal.granularity')}
              </h5>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: visualTheme.spacing.md
            }}>
              {granularityOptions.map(option => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    padding: visualTheme.spacing.md,
                    background: granularity === option.value 
                      ? visualTheme.colors.background.hover 
                      : 'transparent',
                    border: `2px solid ${granularity === option.value 
                      ? visualTheme.colors.primary.blue 
                      : visualTheme.colors.border.light}`,
                    borderRadius: visualTheme.borderRadius.md,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (granularity !== option.value) {
                      e.currentTarget.style.background = visualTheme.colors.background.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (granularity !== option.value) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: visualTheme.spacing.sm
                  }}>
                    <input
                      type="radio"
                      name="granularity"
                      value={option.value}
                      checked={granularity === option.value}
                      onChange={(e) => setGranularity(e.target.value)}
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
                      {option.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: visualTheme.typography.size.xs,
                    color: visualTheme.colors.text.muted,
                    marginLeft: '2rem',
                    marginTop: visualTheme.spacing.xs
                  }}>
                    {option.description}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SÉLECTEUR DE MODE DE COMPTAGE */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: visualTheme.spacing.md,
              marginBottom: visualTheme.spacing.lg,
              paddingBottom: visualTheme.spacing.md,
              borderBottom: `2px solid ${visualTheme.colors.border.light}`
            }}>
              <span style={{
                fontSize: '1.5rem'
              }}>
                🔢
              </span>
              <h5 style={{
                fontSize: visualTheme.typography.size.lg,
                fontWeight: visualTheme.typography.weight.semibold,
                color: visualTheme.colors.text.primary,
                margin: 0
              }}>
                {t('concordance.charts.temporal.countMode')}
              </h5>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: visualTheme.spacing.md
            }}>
              {countModeOptions.map(option => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    padding: visualTheme.spacing.md,
                    background: countMode === option.value 
                      ? visualTheme.colors.background.hover 
                      : 'transparent',
                    border: `2px solid ${countMode === option.value 
                      ? visualTheme.colors.accent.green 
                      : visualTheme.colors.border.light}`,
                    borderRadius: visualTheme.borderRadius.md,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (countMode !== option.value) {
                      e.currentTarget.style.background = visualTheme.colors.background.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (countMode !== option.value) {
                      e.currentTarget.style.background = 'transparent';
                    }
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
                      {option.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: visualTheme.typography.size.xs,
                    color: visualTheme.colors.text.muted,
                    marginLeft: '2rem',
                    marginTop: visualTheme.spacing.xs
                  }}>
                    {option.description}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================================
            STATISTIQUES RÉSUMÉES
            ================================================================== */}
        
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: visualTheme.spacing.lg,
            marginBottom: visualTheme.spacing.xxl
          }}>
            <div style={{
              background: visualTheme.colors.background.card,
              border: `2px solid ${visualTheme.colors.border.light}`,
              borderRadius: visualTheme.borderRadius.lg,
              padding: visualTheme.spacing.lg,
              borderLeft: `4px solid ${visualTheme.colors.accent.blue}`,
              boxShadow: visualTheme.shadows.card
            }}>
              <div style={{
                fontSize: visualTheme.typography.size.xs,
                color: visualTheme.colors.text.muted,
                textTransform: 'uppercase',
                marginBottom: visualTheme.spacing.sm
              }}>
                {t('concordance.stats.total')}
              </div>
              <div style={{
                fontSize: visualTheme.typography.size.xxl,
                fontWeight: visualTheme.typography.weight.semibold,
                color: visualTheme.colors.text.primary
              }}>
                {stats.totalCount}
              </div>
              <div style={{
                fontSize: visualTheme.typography.size.md,
                color: visualTheme.colors.text.muted
              }}>
                {countModeLabel}
              </div>
            </div>

            <div style={{
              background: visualTheme.colors.background.card,
              border: `2px solid ${visualTheme.colors.border.light}`,
              borderRadius: visualTheme.borderRadius.lg,
              padding: visualTheme.spacing.lg,
              borderLeft: `4px solid ${visualTheme.colors.accent.green}`,
              boxShadow: visualTheme.shadows.card
            }}>
              <div style={{
                fontSize: visualTheme.typography.size.xs,
                color: visualTheme.colors.text.muted,
                textTransform: 'uppercase',
                marginBottom: visualTheme.spacing.sm
              }}>
                {t('concordance.stats.averagePerPeriod')}
              </div>
              <div style={{
                fontSize: visualTheme.typography.size.xxl,
                fontWeight: visualTheme.typography.weight.semibold,
                color: visualTheme.colors.text.primary
              }}>
                {stats.avgCount}
              </div>
              <div style={{
                fontSize: visualTheme.typography.size.md,
                color: visualTheme.colors.text.muted
              }}>
                {countModeLabel} / {granularityLabels[granularity].toLowerCase()}
              </div>
            </div>

            <div style={{
              background: visualTheme.colors.background.card,
              border: `2px solid ${visualTheme.colors.border.light}`,
              borderRadius: visualTheme.borderRadius.lg,
              padding: visualTheme.spacing.lg,
              borderLeft: `4px solid ${visualTheme.colors.accent.orange}`,
              boxShadow: visualTheme.shadows.card
            }}>
              <div style={{
                fontSize: visualTheme.typography.size.xs,
                color: visualTheme.colors.text.muted,
                textTransform: 'uppercase',
                marginBottom: visualTheme.spacing.sm
              }}>
                {t('concordance.stats.richestPeriod')}
              </div>
              <div style={{
                fontSize: visualTheme.typography.size.xxl,
                fontWeight: visualTheme.typography.weight.semibold,
                color: visualTheme.colors.text.primary
              }}>
                {stats.maxPeriod.period}
              </div>
              <div style={{
                fontSize: visualTheme.typography.size.md,
                color: visualTheme.colors.text.muted
              }}>
                {stats.maxPeriod.count} {countModeLabel}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            GRAPHIQUE TEMPOREL AGRÉGÉ (AVEC ID POUR EXPORT)
            ================================================================== */}
        
        <div 
          id={temporalChartId}
          style={{
            background: visualTheme.colors.background.card,
            border: `2px solid ${visualTheme.colors.border.light}`,
            borderRadius: visualTheme.borderRadius.lg,
            padding: visualTheme.spacing.xxl,
            marginBottom: visualTheme.spacing.xxl,
            boxShadow: visualTheme.shadows.card
          }}
        >
          <h5 style={{
            fontSize: visualTheme.typography.size.lg,
            fontWeight: visualTheme.typography.weight.semibold,
            color: visualTheme.colors.text.primary,
            marginBottom: visualTheme.spacing.xl
          }}>
            ◈ {t('concordance.views.temporal.aggregatedDistribution')} {granularityLabels[granularity].toLowerCase()}
          </h5>
          <TemporalChart 
            data={temporalData} 
            height={400} 
            showBrush={true}
            lineColor={visualTheme.colors.primary.blue}
          />
        </div>

        {/* ==================================================================
            TIMELINE GANTT DES ŒUVRES (AVEC ID POUR EXPORT)
            ================================================================== */}
        
        <div 
          style={{
            background: visualTheme.colors.background.card,
            border: `2px solid ${visualTheme.colors.border.light}`,
            borderRadius: visualTheme.borderRadius.lg,
            padding: visualTheme.spacing.xxl,
            boxShadow: visualTheme.shadows.card
          }}
        >
          <TimelineGantt 
            data={filteredData}
            height={600}
            chartId={timelineGanttId}
          />
        </div>
      </div>
    </div>
  );
};

export default TemporalView;
