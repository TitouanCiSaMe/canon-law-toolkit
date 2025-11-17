import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import RadarChart from '../charts/RadarChart';
import ExportButtons from '../ui/ExportButtons';
import { useAnalytics } from '../../hooks/useAnalytics';

/**
 * Composant ComparisonView - Vue de comparaison multi-critères avec graphique radar
 * 
 * Permet de comparer différents sous-ensembles de données sur 5 critères clés
 * 
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.data - Toutes les concordances (non filtrées)
 * @param {Array<Object>} props.filteredData - Concordances filtrées actuelles
 * @param {Object} props.analytics - Analytics des données filtrées
 * @param {Function} props.onExportConcordances - Handler d'export CSV
 * @param {Function} props.onExportAnalytics - Handler d'export JSON
 */
const ComparisonView = ({
  data,
  filteredData,
  analytics,
  onExportConcordances,
  onExportAnalytics
}) => {
  const { t } = useTranslation();

  // ============================================================================
  // ÉTATS LOCAUX
  // ============================================================================

  const [comparisonMode, setComparisonMode] = useState('corpus');
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  // Périodes prédéfinies
  const customPeriods = [
    { name: '1200-1230', startYear: 1200, endYear: 1230 },
    { name: '1230-1260', startYear: 1230, endYear: 1260 },
    { name: '1260-1290', startYear: 1260, endYear: 1290 }
  ];

  // ============================================================================
  // FONCTION UTILITAIRE
  // ============================================================================
  
  const analyticsToRadarStats = (analytics) => {
    return {
      totalConcordances: analytics.total || 0,
      uniqueDomains: analytics.domains?.length || 0,
      uniqueAuthors: analytics.authors?.length || 0,
      uniquePlaces: analytics.places?.length || 0,
      uniqueKWIC: analytics.keyTerms?.length || 0
    };
  };

  // ============================================================================
  // LISTE DES AUTEURS DISPONIBLES
  // ============================================================================
  
  const availableAuthors = useMemo(() => {
    if (!analytics.authors) return [];
    return analytics.authors
      .map(a => a.name)
      .filter(name => name && name !== t('common.anonymous'));
  }, [analytics.authors, t]);

  // ============================================================================
  // FILTRAGE DES DONNÉES (sans appel à useAnalytics)
  // ============================================================================
  
  // Données filtrées pour chaque auteur sélectionné
  const authorsFilteredData = useMemo(() => {
    return selectedAuthors.slice(0, 3).map(authorName => ({
      name: authorName,
      data: filteredData.filter(item => item.author === authorName)
    }));
  }, [selectedAuthors, filteredData]);

  // Données filtrées pour chaque période
  const periodsFilteredData = useMemo(() => {
    return customPeriods.map(period => {
      const periodData = filteredData.filter(item => {
        if (!item.period) return false;
        const yearMatch = item.period.match(/(\d{4})/);
        if (!yearMatch) return false;
        const year = parseInt(yearMatch[1]);
        return year >= period.startYear && year <= period.endYear;
      });
      
      return {
        name: period.name,
        data: periodData
      };
    });
  }, [filteredData]);

  // ============================================================================
  // CALCUL DES ANALYTICS AVEC useAnalytics (niveau supérieur)
  // ============================================================================
  
  // Analytics corpus complet
  const fullCorpusAnalytics = useAnalytics(data);
  
  // Analytics pour chaque auteur (calculés au niveau supérieur)
  const author1Analytics = useAnalytics(authorsFilteredData[0]?.data || []);
  const author2Analytics = useAnalytics(authorsFilteredData[1]?.data || []);
  const author3Analytics = useAnalytics(authorsFilteredData[2]?.data || []);
  
  // Analytics pour chaque période (calculés au niveau supérieur)
  const period1Analytics = useAnalytics(periodsFilteredData[0]?.data || []);
  const period2Analytics = useAnalytics(periodsFilteredData[1]?.data || []);
  const period3Analytics = useAnalytics(periodsFilteredData[2]?.data || []);

  // ============================================================================
  // CONSTRUCTION DES DATASETS
  // ============================================================================
  
  // Datasets pour le mode Corpus
  const corpusDatasets = useMemo(() => {
    if (filteredData.length === data.length) {
      return [{
        name: 'Corpus complet',
        stats: analyticsToRadarStats(fullCorpusAnalytics)
      }];
    }

    return [
      {
        name: 'Corpus complet',
        stats: analyticsToRadarStats(fullCorpusAnalytics)
      },
      {
        name: 'Corpus filtré',
        stats: analyticsToRadarStats(analytics)
      }
    ];
  }, [data.length, filteredData.length, fullCorpusAnalytics, analytics]);

  // Datasets pour le mode Auteurs
  const authorsDatasets = useMemo(() => {
    const datasets = [];
    
    if (authorsFilteredData[0]) {
      datasets.push({
        name: authorsFilteredData[0].name,
        stats: analyticsToRadarStats(author1Analytics)
      });
    }
    
    if (authorsFilteredData[1]) {
      datasets.push({
        name: authorsFilteredData[1].name,
        stats: analyticsToRadarStats(author2Analytics)
      });
    }
    
    if (authorsFilteredData[2]) {
      datasets.push({
        name: authorsFilteredData[2].name,
        stats: analyticsToRadarStats(author3Analytics)
      });
    }
    
    return datasets;
  }, [authorsFilteredData, author1Analytics, author2Analytics, author3Analytics]);

  // Datasets pour le mode Périodes
  const periodsDatasets = useMemo(() => {
    return [
      {
        name: periodsFilteredData[0].name,
        stats: analyticsToRadarStats(period1Analytics)
      },
      {
        name: periodsFilteredData[1].name,
        stats: analyticsToRadarStats(period2Analytics)
      },
      {
        name: periodsFilteredData[2].name,
        stats: analyticsToRadarStats(period3Analytics)
      }
    ];
  }, [periodsFilteredData, period1Analytics, period2Analytics, period3Analytics]);

  // ============================================================================
  // SÉLECTION DES DATASETS SELON LE MODE
  // ============================================================================
  
  const currentDatasets = useMemo(() => {
    switch (comparisonMode) {
      case 'corpus':
        return corpusDatasets;
      case 'authors':
        return authorsDatasets;
      case 'periods':
        return periodsDatasets;
      default:
        return corpusDatasets;
    }
  }, [comparisonMode, corpusDatasets, authorsDatasets, periodsDatasets]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const toggleAuthor = (authorName) => {
    setSelectedAuthors(prev => {
      if (prev.includes(authorName)) {
        return prev.filter(a => a !== authorName);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, authorName];
    });
  };

  // ============================================================================
  // RÉSUMÉ STATISTIQUE
  // ============================================================================
  
  const summary = useMemo(() => {
    if (currentDatasets.length === 0) return null;

    const maxConcordances = Math.max(...currentDatasets.map(d => d.stats.totalConcordances));
    const richestDataset = currentDatasets.find(d => d.stats.totalConcordances === maxConcordances);

    const datasetDiversity = currentDatasets.map(d => {
      const avgDiversity = (
        d.stats.uniqueDomains +
        d.stats.uniqueAuthors +
        d.stats.uniquePlaces +
        d.stats.uniqueKWIC
      ) / 4;
      return { name: d.name, diversity: avgDiversity };
    });
    const mostDiverse = datasetDiversity.sort((a, b) => b.diversity - a.diversity)[0];

    return {
      richest: richestDataset?.name,
      richestCount: maxConcordances,
      mostDiverse: mostDiverse?.name,
      totalDatasets: currentDatasets.length
    };
  }, [currentDatasets]);

  // ============================================================================
  // RENDU
  // ============================================================================

  return (
    <div>
      {filteredData.length > 0 ? (
        <>
          <ExportButtons
            filteredData={filteredData}
            analytics={analytics}
            viewType="comparison"
            onExportConcordances={onExportConcordances}
            onExportAnalytics={onExportAnalytics}
          />

          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '2rem',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '500',
              color: '#1e293b',
              marginBottom: '1.5rem'
            }}>
              📊 Comparaison multi-critères
            </h4>

            {/* Sélecteur de mode */}
            <div style={{
              background: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#475569',
                marginBottom: '0.75rem'
              }}>
                {t('concordance.views.comparison.modeLabel')}
              </label>

              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setComparisonMode('corpus')}
                  style={{
                    padding: '0.75rem 1.25rem',
                    border: comparisonMode === 'corpus' ? '2px solid #4A90E2' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: comparisonMode === 'corpus' ? '#eff6ff' : 'white',
                    color: comparisonMode === 'corpus' ? '#1e40af' : '#64748b',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {t('concordance.views.comparison.corpusMode')}
                </button>

                <button
                  onClick={() => setComparisonMode('authors')}
                  style={{
                    padding: '0.75rem 1.25rem',
                    border: comparisonMode === 'authors' ? '2px solid #4A90E2' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: comparisonMode === 'authors' ? '#eff6ff' : 'white',
                    color: comparisonMode === 'authors' ? '#1e40af' : '#64748b',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {t('concordance.views.comparison.authorsMode')}
                </button>

                <button
                  onClick={() => setComparisonMode('periods')}
                  style={{
                    padding: '0.75rem 1.25rem',
                    border: comparisonMode === 'periods' ? '2px solid #4A90E2' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: comparisonMode === 'periods' ? '#eff6ff' : 'white',
                    color: comparisonMode === 'periods' ? '#1e40af' : '#64748b',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {t('concordance.views.comparison.periodsMode')}
                </button>
              </div>

              {/* Sélecteur d'auteurs */}
              {comparisonMode === 'authors' && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    marginBottom: '0.75rem'
                  }}>
                    {t('concordance.views.comparison.selectAuthors')}
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '0.5rem',
                    background: 'white',
                    borderRadius: '6px'
                  }}>
                    {availableAuthors.map(author => (
                      <button
                        key={author}
                        onClick={() => toggleAuthor(author)}
                        disabled={!selectedAuthors.includes(author) && selectedAuthors.length >= 3}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: selectedAuthors.includes(author) 
                            ? '2px solid #4A90E2' 
                            : '1px solid #cbd5e1',
                          borderRadius: '6px',
                          background: selectedAuthors.includes(author) ? '#eff6ff' : 'white',
                          color: selectedAuthors.includes(author) ? '#1e40af' : '#64748b',
                          fontSize: '0.875rem',
                          cursor: selectedAuthors.includes(author) || selectedAuthors.length < 3 
                            ? 'pointer' 
                            : 'not-allowed',
                          opacity: !selectedAuthors.includes(author) && selectedAuthors.length >= 3 
                            ? 0.5 
                            : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {author}
                      </button>
                    ))}
                  </div>
                  {selectedAuthors.length > 0 && (
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#10b981',
                      marginTop: '0.5rem'
                    }}>
                      {t('concordance.views.comparison.authorsSelected', { count: selectedAuthors.length })}
                    </p>
                  )}
                </div>
              )}

              {/* Info périodes */}
              {comparisonMode === 'periods' && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b'
                  }}>
                    Périodes comparées : <strong>{customPeriods.map(p => p.name).join(' • ')}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Graphique radar */}
            {currentDatasets.length > 0 ? (
              <>
                <RadarChart 
                  datasets={currentDatasets}
                  height={450}
                />

                {/* Résumé statistique */}
                {summary && (
                  <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h5 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '1rem'
                    }}>
                      {t('concordance.views.comparison.summary')}
                    </h5>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '1rem'
                    }}>
                      <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '6px',
                        borderLeft: '4px solid #4A90E2'
                      }}>
                        <div style={{
                          fontSize: '0.8rem',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          marginBottom: '0.25rem'
                        }}>
                          {t('concordance.views.comparison.richest')}
                        </div>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#1e293b'
                        }}>
                          {summary.richest}
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#64748b'
                        }}>
                          {summary.richestCount.toLocaleString('fr-FR')} concordances
                        </div>
                      </div>

                      <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '6px',
                        borderLeft: '4px solid #85DCB0'
                      }}>
                        <div style={{
                          fontSize: '0.8rem',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          marginBottom: '0.25rem'
                        }}>
                          {t('concordance.views.comparison.mostDiverse')}
                        </div>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#1e293b'
                        }}>
                          {summary.mostDiverse}
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#64748b'
                        }}>
                          {t('concordance.views.comparison.highestDiversity')}
                        </div>
                      </div>

                      <div style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '6px',
                        borderLeft: '4px solid #E27D60'
                      }}>
                        <div style={{
                          fontSize: '0.8rem',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          marginBottom: '0.25rem'
                        }}>
                          {t('concordance.views.comparison.datasetsCompared')}
                        </div>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#1e293b'
                        }}>
                          {summary.totalDatasets}
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#64748b'
                        }}>
                          {comparisonMode === 'corpus' && 'Corpus'}
                          {comparisonMode === 'authors' && 'Auteurs'}
                          {comparisonMode === 'periods' && 'Périodes'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#64748b',
                background: '#f8fafc',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                <h3 style={{ marginBottom: '0.5rem' }}>{t('concordance.messages.selectToCompare')}</h3>
                <p style={{ fontSize: '0.9rem' }}>
                  {comparisonMode === 'authors' && t('concordance.messages.selectAuthorsForComparison')}
                  {comparisonMode === 'periods' && t('concordance.messages.periodsArePredefined')}
                  {comparisonMode === 'corpus' && t('concordance.messages.applyFiltersToCompare')}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3>{t('concordance.dataView.noData')}</h3>
          <p>{t('concordance.messages.importFilesForComparison')}</p>
        </div>
      )}
    </div>
  );
};

ComparisonView.propTypes = {
  data: PropTypes.array.isRequired,
  filteredData: PropTypes.array.isRequired,
  analytics: PropTypes.object.isRequired,
  onExportConcordances: PropTypes.func.isRequired,
  onExportAnalytics: PropTypes.func.isRequired
};

export default ComparisonView;
