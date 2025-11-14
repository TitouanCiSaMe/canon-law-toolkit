/**
 * Composant LinguisticView - Vue de l'analyse terminologique
 * 
 * Affiche un graphique en barres des termes-clés les plus fréquents dans le corpus,
 * avec options d'export CSV et JSON. Permet d'identifier le vocabulaire spécialisé
 * et les concepts centraux du corpus juridique.
 * 
 * Utilise directement Recharts (BarChart) plutôt qu'un composant Chart dédié.
 * Les termes sont filtrés pour exclure les mots courants et ne garder que
 * le lexique juridique pertinent.
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<Object>} props.filteredData - Données de concordances filtrées
 * @param {Object} props.analytics - Statistiques calculées
 * @param {Array<{term: string, count: number}>} props.analytics.keyTerms - Termes-clés avec fréquences
 * @param {number} props.analytics.total - Nombre total de concordances
 * @param {Function} props.onExportConcordances - Handler pour export CSV des concordances
 * @param {Function} props.onExportAnalytics - Handler pour export JSON des analytics
 * 
 * @returns {JSX.Element} Vue complète avec graphique terminologique et boutons d'export
 * 
 * @example
 * // Utilisation standard avec termes-clés
 * const analytics = {
 *   keyTerms: [
 *     { term: 'ecclesia', count: 245 },
 *     { term: 'canon', count: 189 },
 *     { term: 'decretum', count: 156 },
 *     { term: 'papa', count: 134 },
 *     { term: 'episcopus', count: 98 }
 *   ],
 *   total: 822
 * };
 * 
 * <LinguisticView
 *   filteredData={concordances}
 *   analytics={analytics}
 *   onExportConcordances={() => exportConcordancesCSV(filteredData)}
 *   onExportAnalytics={() => exportAnalyticsJSON(analytics)}
 * />
 * 
 * @example
 * // Avec données vides (affiche message approprié)
 * <LinguisticView
 *   filteredData={[]}
 *   analytics={{ keyTerms: [], total: 0 }}
 *   onExportConcordances={handleExport}
 *   onExportAnalytics={handleExport}
 * />
 * 
 * @example
 * // Avec limitation des termes affichés
 * // Le hook useAnalytics limite déjà à 15 termes par défaut
 * <LinguisticView
 *   filteredData={data}
 *   analytics={{
 *     keyTerms: top15Terms, // Déjà limité par useAnalytics
 *     total: 1500
 *   }}
 *   onExportConcordances={exportCSV}
 *   onExportAnalytics={exportJSON}
 * />
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ExportButtons from '../ui/ExportButtons';

/**
 * Composant LinguisticView - Vue de l'analyse terminologique
 * 
 * Affiche un graphique des termes-clés les plus fréquents
 * 
 * @param {Array} filteredData - Données filtrées
 * @param {Object} analytics - Statistiques calculées
 * @param {Function} onExportConcordances - Handler d'export CSV
 * @param {Function} onExportAnalytics - Handler d'export JSON
 */
const LinguisticView = ({
  filteredData,
  analytics,
  onExportConcordances,
  onExportAnalytics
}) => {
  const { t } = useTranslation();
  
  return (
    <div>
      {analytics.keyTerms.length > 0 ? (
        <>
          <ExportButtons
            filteredData={filteredData}
            analytics={analytics}
            viewType="domains"
            onExportConcordances={onExportConcordances}
            onExportAnalytics={onExportAnalytics}
          />
          
          <div style={{ marginBottom: '3rem' }}>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '500',
              marginBottom: '2rem',
              color: '#1e293b'
            }}>
              {t('views.linguistic.sectionTitle')}
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.keyTerms}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="term" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(0,0,0,0.9)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="count" fill="#065F46" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📤</div>
          <h3>{t('views.linguistic.noData')}</h3>
          <p>{t('views.linguistic.importFirst')}</p>
        </div>
      )}
    </div>
  );
};

export default LinguisticView;
