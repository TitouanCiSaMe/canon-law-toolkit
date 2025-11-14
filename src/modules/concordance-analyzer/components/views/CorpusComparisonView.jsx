import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCorpusComparison } from '../../hooks/useCorpusComparison';
import ComparisonDomainChart from '../comparison/ComparisonDomainChart';
import ComparisonAuthorChart from '../comparison/ComparisonAuthorChart';
import ComparisonTemporalChart from '../comparison/ComparisonTemporalChart';
import ComparisonTermChart from '../comparison/ComparisonTermChart';

/**
 * CorpusComparisonView - Vue de comparaison de 2 corpus distincts
 * 
 * Affiche l'analyse comparative de 2 corpus déjà chargés.
 * Reçoit les données depuis corpusComparison (état global).
 * 
 * @param {Object} corpusComparison - État contenant les 2 corpus
 * @param {Object} corpusComparison.A - Données du corpus A
 * @param {Array} corpusComparison.A.concordanceData - Concordances du corpus A
 * @param {Object} corpusComparison.A.metadata - Métadonnées du corpus A
 * @param {Object} corpusComparison.B - Données du corpus B
 * @param {Array} corpusComparison.B.concordanceData - Concordances du corpus B
 * @param {Object} corpusComparison.B.metadata - Métadonnées du corpus B
 */
const CorpusComparisonView = ({ corpusComparison }) => {
  const { t } = useTranslation();
  
  // Hook de comparaison avec les données reçues
  const {
    analyticsA,
    analyticsB,
    differences,
    comparisonStats,
    isReady
  } = useCorpusComparison(
    corpusComparison?.A?.concordanceData,
    corpusComparison?.B?.concordanceData
  );

  // Vérifier que les données sont présentes
  if (!corpusComparison?.A?.concordanceData || !corpusComparison?.B?.concordanceData) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
          {t('views.corpusComparison.noData')}
        </h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          {t('views.corpusComparison.uploadInstructions')}
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '0.75rem 2rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          ← {t('buttons.back')}
        </button>
      </div>
    );
  }

  // Afficher un loader si les analytics ne sont pas prêtes
  if (!isReady) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
          {t('messages.loading')}
        </h2>
        <p style={{ color: '#64748b' }}>
          {comparisonStats?.totalA || 0} vs {comparisonStats?.totalB || 0} {t('views.corpusComparison.concordances')}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header avec stats globales */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '500' }}>
          ⚖️ {t('views.corpusComparison.sectionTitle')}
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '1.5rem',
            borderRadius: '6px'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              {t('views.corpusComparison.corpusA')}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '300' }}>
              {comparisonStats.totalA.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              {corpusComparison.A?.metadata?.filename || 'corpus_a.csv'}
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '1.5rem',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              {t('views.corpusComparison.ratio')}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '300' }}>
              {comparisonStats.ratio}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              {comparisonStats.largerCorpus === 'A' ? t('views.corpusComparison.largerA') : 
               comparisonStats.largerCorpus === 'B' ? t('views.corpusComparison.largerB') : 
               t('views.corpusComparison.equal')}
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '1.5rem',
            borderRadius: '6px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              {t('views.corpusComparison.corpusB')}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '300' }}>
              {comparisonStats.totalB.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              {corpusComparison.B?.metadata?.filename || 'corpus_b.csv'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats des différences */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Domaines */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#553C9A' }}>
            📚 {t('navigation.domains')}
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            {t('views.corpusComparison.common')} : <strong>{differences.domains.totalCommon}</strong>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            {t('views.corpusComparison.onlyA')} : <strong>{differences.domains.totalOnlyA}</strong>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {t('views.corpusComparison.onlyB')} : <strong>{differences.domains.totalOnlyB}</strong>
          </div>
        </div>

        {/* Auteurs */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#4A5568' }}>
            ✍️ {t('navigation.authors')}
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            {t('views.corpusComparison.common')} : <strong>{differences.authors.totalCommon}</strong>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            {t('views.corpusComparison.onlyA')} : <strong>{differences.authors.totalOnlyA}</strong>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {t('views.corpusComparison.onlyB')} : <strong>{differences.authors.totalOnlyB}</strong>
          </div>
        </div>

        {/* Temporal */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#744210' }}>
            ⏰ {t('navigation.temporal')}
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            {t('views.corpusComparison.corpusA')} : <strong>{differences.temporal.rangeA.min}-{differences.temporal.rangeA.max}</strong>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            {t('views.corpusComparison.corpusB')} : <strong>{differences.temporal.rangeB.min}-{differences.temporal.rangeB.max}</strong>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {t('views.corpusComparison.overlap')} : <strong>{differences.temporal.overlapEnd - differences.temporal.overlapStart} {t('views.corpusComparison.years')}</strong>
          </div>
        </div>
      </div>

	{/* Graphique de comparaison des domaines */}
	<div style={{ marginBottom: '2rem' }}>
	  <ComparisonDomainChart
	    dataA={analyticsA.domains}
	    dataB={analyticsB.domains}
	    height={400}
	    maxItems={10}
	  />
	</div>
	
	<div style={{ marginBottom: '2rem' }}>
	  <ComparisonAuthorChart
	    dataA={analyticsA.authors}
	    dataB={analyticsB.authors}
	    height={400}
	    maxItems={10}
	  />
	</div>
	
	{/* ✨ NOUVEAU : Graphique de comparaison chronologique */}
	<div style={{ marginBottom: '2rem' }}>
	  <ComparisonTemporalChart
	    corpusA={corpusComparison.A.concordanceData}
	    corpusB={corpusComparison.B.concordanceData}
	    height={400}
	  />
	</div>
	
	{/* ✨ NOUVEAU : Graphique de comparaison de terminologie */}
	<div style={{ marginBottom: '2rem' }}>
	  <ComparisonTermChart
	    dataA={analyticsA.keyTerms}
	    dataB={analyticsB.keyTerms}
	    height={400}
	    maxItems={10}
	  />
	</div>
    </div>
  );
};

export default CorpusComparisonView;
