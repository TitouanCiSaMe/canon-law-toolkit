import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltipChart from '../charts/CustomTooltipChart';

/**
 * Composant ComparisonTermChart - Comparaison de la terminologie entre 2 corpus
 * 
 * Affiche 2 bar charts côte à côte pour comparer les termes-clés les plus
 * fréquents entre le corpus A et le corpus B.
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<{term: string, count: number}>} props.dataA - Termes du corpus A
 * @param {Array<{term: string, count: number}>} props.dataB - Termes du corpus B
 * @param {number} [props.height=400] - Hauteur en pixels
 * @param {number} [props.maxItems=10] - Nombre maximum de termes affichés
 * @param {string} [props.chartId] - ID unique pour export
 * 
 * @returns {JSX.Element} 2 graphiques côte à côte avec titres
 */
const ComparisonTermChart = ({
  dataA,
  dataB,
  height = 400,
  maxItems = 10,
  chartId = `comparison-terms-${Date.now()}`
}) => {
  const { t } = useTranslation();

  // ============================================================================
  // VALIDATION DES DONNÉES
  // ============================================================================
  
  if (!dataA || !dataB || dataA.length === 0 || dataB.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem',
        color: '#64748b'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❦</div>
        <h3>{t('concordance.charts.noData.terminology')}</h3>
      </div>
    );
  }

  // Limiter aux top N termes
  const displayDataA = dataA.slice(0, maxItems);
  const displayDataB = dataB.slice(0, maxItems);

  // Adapter les données pour Recharts (term -> name, count -> value)
  const chartDataA = displayDataA.map(item => ({
    name: item.term,
    value: item.count
  }));

  const chartDataB = displayDataB.map(item => ({
    name: item.term,
    value: item.count
  }));
  
  // Calculer les totaux pour les labels
  const totalA = dataA.reduce((sum, d) => sum + d.count, 0);
  const totalB = dataB.reduce((sum, d) => sum + d.count, 0);

  // ============================================================================
  // RENDU SIDE-BY-SIDE
  // ============================================================================

  return (
    <div id={chartId}>
      {/* Titre principal */}
      <h3 style={{
        fontSize: '1.3rem',
        marginBottom: '1.5rem',
        color: '#1e293b',
        textAlign: 'center'
      }}>
        ❦ {t('concordance.views.corpusComparison.charts.terminology.title')}
      </h3>

      {/* Conteneur des 2 graphiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        
        {/* ================================================================
            GRAPHIQUE CORPUS A
            ================================================================ */}
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          border: '2px solid #8B4513'
        }}>
          <h4 style={{
            fontSize: '1rem',
            marginBottom: '1rem',
            color: '#8B4513',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {t('concordance.views.corpusComparison.charts.terminology.corpusALabel', { count: totalA })}
          </h4>

          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartDataA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={120}
                style={{ fontSize: '0.75rem' }}
              />
              
              <YAxis style={{ fontSize: '0.85rem' }} />
              
              <Tooltip content={<CustomTooltipChart allData={chartDataA} valueLabel={t('concordance.views.corpusComparison.charts.terminology.occurrences')} />} />
              
              <Bar
                dataKey="value"
                fill="#8B4513"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ================================================================
            GRAPHIQUE CORPUS B
            ================================================================ */}
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          border: '2px solid #A0522D'
        }}>
          <h4 style={{
            fontSize: '1rem',
            marginBottom: '1rem',
            color: '#A0522D',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {t('concordance.views.corpusComparison.charts.terminology.corpusBLabel', { count: totalB })}
          </h4>

          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartDataB}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={120}
                style={{ fontSize: '0.75rem' }}
              />
              
              <YAxis style={{ fontSize: '0.85rem' }} />
              
              <Tooltip content={<CustomTooltipChart allData={chartDataB} valueLabel={t('concordance.views.corpusComparison.charts.terminology.occurrences')} />} />
              
              <Bar
                dataKey="value"
                fill="#A0522D"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Légende des couleurs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        fontSize: '0.9rem',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: '#8B4513',
            borderRadius: '4px'
          }} />
          <span>{t('concordance.views.corpusComparison.charts.legend.corpusA')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: '#A0522D',
            borderRadius: '4px'
          }} />
          <span>{t('concordance.views.corpusComparison.charts.legend.corpusB')}</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTermChart;
