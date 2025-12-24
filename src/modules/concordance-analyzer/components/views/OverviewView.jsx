/**
 * Composant OverviewView - Vue d'ensemble avec grille interactive de panels
 * 
 * Affiche une grille de panels cliquables permettant de naviguer entre les différentes
 * vues analytiques. Chaque panel présente des statistiques résumées de sa catégorie :
 * - Vue d'ensemble principale : Total concordances + taux de correspondance
 * - Domaines : Nombre de domaines + top 3
 * - Chronologie : Siècles couverts + mini-graphique
 * - Auteurs : Nombre d'auteurs + top 3
 * - Terminologie : Nombre de termes-clés + top 4
 * - Données : Nombre de concordances chargées
 * - Import : Interface d'upload
 * - Lieux : Nombre de lieux + top 3
 * 
 * La grille utilise CSS Grid avec disposition asymétrique pour mettre en valeur
 * la vue d'ensemble principale (panel large).
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.panelConfig - Configuration complète de tous les panels
 * @param {Object} props.panelConfig.overview - Config panel vue d'ensemble
 * @param {Object} props.panelConfig.domains - Config panel domaines
 * @param {Object} props.panelConfig.temporal - Config panel chronologie
 * @param {Object} props.panelConfig.authors - Config panel auteurs
 * @param {Object} props.panelConfig.linguistic - Config panel terminologie
 * @param {Object} props.panelConfig.data - Config panel données
 * @param {Object} props.panelConfig.concordances - Config panel import
 * @param {Object} props.panelConfig.places - Config panel lieux
 * 
 * @param {Object} props.analytics - Statistiques complètes calculées
 * @param {number} props.analytics.total - Nombre total de concordances
 * @param {Array<{name: string, value: number}>} props.analytics.domains - Répartition par domaines
 * @param {Array<{name: string, value: number}>} props.analytics.authors - Répartition par auteurs
 * @param {Array<{period: number, count: number}>} props.analytics.periods - Distribution temporelle
 * @param {Array<{name: string, value: number}>} props.analytics.places - Répartition géographique
 * @param {Array<{term: string, count: number}>} props.analytics.keyTerms - Termes-clés fréquents
 * 
 * @param {Object} props.parseStats - Statistiques de parsing des fichiers
 * @param {string} props.parseStats.lookupRate - Taux de correspondance (ex: "95.5")
 * @param {number} props.parseStats.totalReferences - Nombre total de références
 * @param {number} props.parseStats.successfulMatches - Références enrichies
 * @param {number} props.parseStats.failedMatches - Références en fallback
 * 
 * @param {Array<Object>} props.filteredData - Données de concordances filtrées
 * 
 * @param {Function} props.navigateToView - Fonction de navigation entre vues
 * @param {string} viewId - ID de la vue cible ('domains', 'authors', etc.)
 * 
 * @param {Object} props.academicColors - Palette de couleurs du thème
 * @param {string} props.academicColors.primary - Couleur primaire (#1A365D)
 * @param {string} props.academicColors.secondary - Couleur secondaire
 * @param {string} props.academicColors.accent - Couleur d'accent
 * @param {string} props.academicColors.text - Couleur de texte
 * @param {string} props.academicColors.light - Couleur claire
 * 
 * @returns {JSX.Element} Grille interactive de panels avec statistiques résumées
 * 
 * @example
 * // Utilisation standard avec toutes les données
 * const panelConfig = {
 *   overview: { id: 'overview', title: "Vue d'ensemble", ... },
 *   domains: { id: 'domains', title: 'Domaines', ... },
 *   // ... autres panels
 * };
 * 
 * const analytics = {
 *   total: 342,
 *   domains: [
 *     { name: 'Droit canonique', value: 200 },
 *     { name: 'Droit civil', value: 100 },
 *     { name: 'Droit pénal', value: 42 }
 *   ],
 *   authors: [
 *     { name: 'Gratien', value: 150 },
 *     { name: 'Yves de Chartres', value: 100 }
 *   ],
 *   periods: [
 *     { period: 1100, count: 50 },
 *     { period: 1150, count: 150 },
 *     { period: 1200, count: 142 }
 *   ],
 *   places: [
 *     { name: 'Bologne', value: 150 },
 *     { name: 'Paris', value: 100 }
 *   ],
 *   keyTerms: [
 *     { term: 'ecclesia', count: 245 },
 *     { term: 'canon', count: 189 }
 *   ]
 * };
 * 
 * const parseStats = {
 *   lookupRate: '95.5',
 *   totalReferences: 342,
 *   successfulMatches: 327,
 *   failedMatches: 15
 * };
 * 
 * <OverviewView
 *   panelConfig={panelConfig}
 *   analytics={analytics}
 *   parseStats={parseStats}
 *   filteredData={concordances}
 *   navigateToView={(viewId) => setActiveView(viewId)}
 *   academicColors={{
 *     primary: '#1A365D',
 *     secondary: '#2C5282',
 *     accent: '#553C9A',
 *     text: '#2D3748',
 *     light: '#EDF2F7'
 *   }}
 * />
 * 
 * @example
 * // Avec données vides (au démarrage de l'application)
 * <OverviewView
 *   panelConfig={panelConfig}
 *   analytics={{
 *     total: 0,
 *     domains: [],
 *     authors: [],
 *     periods: [],
 *     places: [],
 *     keyTerms: []
 *   }}
 *   parseStats={{ lookupRate: '0' }}
 *   filteredData={[]}
 *   navigateToView={handleNavigation}
 *   academicColors={colors}
 * />
 * 
 * @example
 * // Avec filtres actifs (données filtrées)
 * const filteredAnalytics = {
 *   total: 50, // Sous-ensemble des 342 totaux
 *   domains: [{ name: 'Droit canonique', value: 50 }],
 *   // ... autres stats filtrées
 * };
 * 
 * <OverviewView
 *   panelConfig={panelConfig}
 *   analytics={filteredAnalytics}
 *   parseStats={parseStats}
 *   filteredData={filteredConcordances}
 *   navigateToView={handleNavigation}
 *   academicColors={colors}
 * />
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../../../shared/hooks';
import NavigationPanel from '../ui/NavigationPanel';
import styles from './OverviewView.module.css';

/**
 * Composant OverviewView - Vue d'ensemble avec grille de panels
 * 
 * Affiche une grille interactive de tous les panels disponibles
 * 
 * @param {Object} panelConfig - Configuration des panels
 * @param {Object} analytics - Statistiques calculées
 * @param {Object} parseStats - Statistiques de parsing
 * @param {Array} filteredData - Données filtrées
 * @param {Function} navigateToView - Fonction de navigation
 * @param {Object} academicColors - Couleurs du thème
 */
const OverviewView = ({
  panelConfig,
  analytics,
  parseStats,
  filteredData,
  navigateToView,
  academicColors,
  corpusComparison
}) => {

  const { t } = useTranslation();
  const { isMobile, isTablet } = useBreakpoint();

  // Helper: Rendu compact pour mobile (icône + titre seulement)
  const renderCompactPanel = (icon, title, stat) => (
    <div className={styles.compactPanel}>
      <div className={styles.compactIcon}>{icon}</div>
      <div className={styles.compactTitle}>{t(title)}</div>
      <div className={styles.compactStat}>{stat}</div>
    </div>
  );

  // Helper: Rendu semi-compact pour tablet (icône + titre + stat principale)
  const renderSemiCompactPanel = (icon, title, stat, subtitle) => (
    <div className={styles.semiCompactPanel}>
      <div className={styles.semiCompactIcon}>{icon}</div>
      <div className={styles.stat}>{stat}</div>
      <div className={styles.label}>{subtitle}</div>
    </div>
  );

  return (
    <div
      className={styles.panelGrid}
      style={{ '--grid-background': academicColors.text }}
    >
      
      {/* Panel Vue d'ensemble (principal, large) */}
      <NavigationPanel
        config={panelConfig.overview}
        isActive={false}
        onClick={() => {}}
      >
        {isMobile ? (
          // Mobile: Version très compacte
          renderCompactPanel(
            panelConfig.overview.icon,
            panelConfig.overview.title,
            analytics.total.toLocaleString()
          )
        ) : isTablet ? (
          // Tablet: Version semi-compacte
          <div className={styles.semiCompactPanel}>
            <div className={styles.semiCompactIcon}>{panelConfig.overview.icon}</div>
            <div className={styles.statMain}>
              {analytics.total.toLocaleString()}
            </div>
            <div className={styles.label} style={{ marginBottom: '1rem' }}>
              {t('concordance.overview.concordancesAnalyzed')}
            </div>
            <div style={{ fontSize: '1.1rem', opacity: 0.7 }}>
              {parseStats.lookupRate || 0}% {t('concordance.overview.matchRate').toLowerCase()}
            </div>
          </div>
        ) : (
          // Desktop: Version complète
          <div className={styles.overviewPanel}>
            <div className={styles.statMain}>
              {analytics.total.toLocaleString()}
            </div>
            <div className={styles.overviewTitle}>
              {t('concordance.overview.concordancesAnalyzed')}
            </div>

            <div className={styles.overviewProgressBar}>
              <div
                className={styles.overviewProgressFill}
                style={{ width: `${parseStats.lookupRate || 0}%` }}
              />
            </div>

            <div className={styles.overviewStats}>
              <span>{t('concordance.overview.matchRate')}</span>
              <span>{parseStats.lookupRate || 0}%</span>
            </div>
          </div>
        )}
      </NavigationPanel>

      {/* Panel Import de données */}
      <NavigationPanel
        config={panelConfig.concordances}
        isActive={false}
        onClick={() => navigateToView('concordances')}
        style={
          !parseStats.totalReferences || parseStats.totalReferences === 0
            ? { border: '2px solid #D4AF37' }  // Contour doré fin quand vide
            : {}
        }
      >
        {isMobile ? (
          renderCompactPanel(
            panelConfig.concordances.icon,
            panelConfig.concordances.title,
            corpusComparison?.B?.concordanceData ? '2 jeux' : (parseStats.totalReferences ? '1 jeu' : '0')
          )
        ) : isTablet ? (
          renderSemiCompactPanel(
            panelConfig.concordances.icon,
            panelConfig.concordances.title,
            corpusComparison?.B?.concordanceData ? '2 jeux' : (parseStats.totalReferences ? '1 jeu' : '0'),
            parseStats.lookupRate ? `${parseStats.lookupRate}% ${t('concordance.overview.enriched')}` : t('concordance.overview.readyToAnalyze')
          )
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.9rem',
              fontWeight: '500',
              marginBottom: '0.75rem',
              opacity: 0.95
            }}>
              {corpusComparison?.B?.concordanceData
                ? t('concordance.overview.twoDatasetsLoaded')
                : parseStats.totalReferences
                  ? t('concordance.overview.oneDataset')
                  : t('concordance.overview.noDataset')
              }
            </div>
            <div style={{ fontSize: '1.15rem', opacity: 0.8 }}>
              {parseStats.lookupRate ? `${parseStats.lookupRate}% ${t('concordance.overview.enriched')}` : t('concordance.overview.readyToAnalyze')}
            </div>
          </div>
        )}
      </NavigationPanel>

      {/* Panel Domaines */}
      <NavigationPanel
        config={panelConfig.domains}
        isActive={false}
        onClick={() => navigateToView('domains')}
      >
        {isMobile ? (
          renderCompactPanel(panelConfig.domains.icon, panelConfig.domains.title, analytics.domains.length)
        ) : isTablet ? (
          renderSemiCompactPanel(panelConfig.domains.icon, panelConfig.domains.title, analytics.domains.length, analytics.domains.length <= 1 ? t('concordance.overview.legalDomain') : t('concordance.overview.legalDomains'))
        ) : (
          <div className={styles.panelContent}>
            <div className={styles.stat}>
              {analytics.domains.length}
            </div>
            <div className={styles.label}>
              {analytics.domains.length <= 1 ? t('concordance.overview.legalDomain') : t('concordance.overview.legalDomains')}
            </div>
          </div>
        )}
      </NavigationPanel>

      {/* Panel Chronologie */}
      <NavigationPanel
        config={panelConfig.temporal}
        isActive={false}
        onClick={() => navigateToView('temporal')}
      >
        {isMobile ? (
          renderCompactPanel(
            panelConfig.temporal.icon,
            panelConfig.temporal.title,
            analytics.periods.length > 0 ?
              Math.ceil((Math.max(...analytics.periods.map(p => p.period)) -
                        Math.min(...analytics.periods.map(p => p.period))) / 100) : 0
          )
        ) : isTablet ? (
          renderSemiCompactPanel(
            panelConfig.temporal.icon,
            panelConfig.temporal.title,
            analytics.periods.length > 0 ?
              Math.ceil((Math.max(...analytics.periods.map(p => p.period)) -
                        Math.min(...analytics.periods.map(p => p.period))) / 100) : 0,
            t('concordance.overview.centuriesCovered')
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '0.5rem 0.5rem 0.5rem 0.5rem' }}>
            <div className={styles.stat}>
              {analytics.periods.length > 0 ?
                Math.ceil((Math.max(...analytics.periods.map(p => p.period)) -
                          Math.min(...analytics.periods.map(p => p.period))) / 100) : 0}
            </div>
            <div className={styles.label} style={{ marginBottom: '1rem' }}>
              {t('concordance.overview.centuriesCovered')}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2px',
              justifyContent: 'center',
              height: '60px',
              marginTop: '1rem'
            }}>
              {analytics.periods.slice(0, 10).map((period, index) => {
                const maxCount = Math.max(...analytics.periods.slice(0, 10).map(p => p.count));
                const height = (period.count / maxCount) * 100;
                return (
                  <div key={period.period} style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.3)',
                    height: `${height}%`,
                    minHeight: '10%',
                    borderRadius: '2px',
                    transition: 'all 0.3s'
                  }} />
                );
              })}
            </div>
          </div>
        )}
      </NavigationPanel>

      {/* Panel Auteurs */}
      <NavigationPanel
        config={panelConfig.authors}
        isActive={false}
        onClick={() => navigateToView('authors')}
      >
        {isMobile ? (
          renderCompactPanel(panelConfig.authors.icon, panelConfig.authors.title, analytics.authors.length)
        ) : isTablet ? (
          renderSemiCompactPanel(panelConfig.authors.icon, panelConfig.authors.title, analytics.authors.length, t('concordance.overview.referencedAuthors'))
        ) : (
          <div className={styles.panelContent}>
            <div className={styles.stat}>
              {analytics.authors.length}
            </div>
            <div className={styles.label}>
              {t('concordance.overview.referencedAuthors')}
            </div>
          </div>
        )}
      </NavigationPanel>

      {/* Panel Terminologie */}
      <NavigationPanel
        config={panelConfig.linguistic}
        isActive={false}
        onClick={() => navigateToView('linguistic')}
      >
        {isMobile ? (
          renderCompactPanel(panelConfig.linguistic.icon, panelConfig.linguistic.title, analytics.keyTerms.length)
        ) : isTablet ? (
          renderSemiCompactPanel(panelConfig.linguistic.icon, panelConfig.linguistic.title, analytics.keyTerms.length, t('concordance.overview.keyTermsIdentified'))
        ) : (
          <div className={styles.panelContent}>
            <div className={styles.stat}>
              {analytics.keyTerms.length}
            </div>
            <div className={styles.label}>
              {t('concordance.overview.keyTermsIdentified')}
            </div>
          </div>
        )}
      </NavigationPanel>

	{/* Panel Comparaison Corpus (toujours visible, contenu adaptatif) */}
	<NavigationPanel
	  config={panelConfig.corpusComparison}
	  isActive={false}
	  onClick={() => corpusComparison?.B?.concordanceData && navigateToView('corpusComparison')}
	  style={{
	    cursor: corpusComparison?.B?.concordanceData ? 'pointer' : 'default',
	    opacity: corpusComparison?.B?.concordanceData ? 1 : 0.7
	  }}
	>
	  {isMobile ? (
	    renderCompactPanel(
	      panelConfig.corpusComparison.icon,
	      panelConfig.corpusComparison.title,
	      corpusComparison?.B?.concordanceData ? '✓' : '—'
	    )
	  ) : isTablet ? (
	    renderSemiCompactPanel(
	      panelConfig.corpusComparison.icon,
	      panelConfig.corpusComparison.title,
	      corpusComparison?.B?.concordanceData ? '2' : '0',
	      t('concordance.overview.corpusComparison')
	    )
	  ) : (
	  <div style={{ textAlign: 'center', alignSelf: 'flex-start', width: '100%', marginTop: '2rem' }}>
	    {corpusComparison?.B?.concordanceData ? (
	      // Mode ACTIF : 2 jeux de données chargés
	      <>
		{/* Stats des 2 jeux de données */}
		<div style={{
		  display: 'grid',
		  gridTemplateColumns: '1fr auto 1fr',
		  gap: '0.5rem',
		  alignItems: 'center',
		  fontSize: '0.95rem',
		  marginTop: '1rem',
		  opacity: 0.9
		}}>
		  <div style={{
		    background: 'rgba(255,255,255,0.2)',
		    padding: '0.4rem',
		    borderRadius: '4px',
		    textAlign: 'center'
		  }}>
		    <div style={{ fontSize: '1.5rem', fontWeight: '500' }}>
		      {corpusComparison.A?.concordanceData?.length || 0}
		    </div>
		    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t('concordance.views.corpusComparison.charts.legend.corpusA')}</div>
		  </div>

		  <div style={{ fontSize: '1.25rem', opacity: 0.7 }}>vs</div>

		  <div style={{
		    background: 'rgba(255,255,255,0.2)',
		    padding: '0.4rem',
		    borderRadius: '4px',
		    textAlign: 'center'
		  }}>
		    <div style={{ fontSize: '1.5rem', fontWeight: '500' }}>
		      {corpusComparison.B?.concordanceData?.length || 0}
		    </div>
		    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{t('concordance.views.corpusComparison.charts.legend.corpusB')}</div>
		  </div>
		</div>

		<div style={{
		  marginTop: '1rem',
		  fontSize: '0.95rem',
		  opacity: 0.8
		}}>
		  {t('concordance.overview.clickToAnalyze')}
		</div>
	      </>
	    ) : (
	      // Mode EN ATTENTE : Invitation à uploader
	      <>
		<div style={{
		  fontSize: '1.0rem',
		  opacity: 0.7,
		  lineHeight: '1.3',
		  marginBottom: '0.25rem'
		}}>
		  {t('concordance.views.corpusComparison.noData')}
		</div>

		{/* Indicateur visuel d'état */}
		<div style={{
		  display: 'flex',
		  gap: '0.5rem',
		  justifyContent: 'center',
		  alignItems: 'center',
		  fontSize: '0.9rem',
		  opacity: 0.6
		}}>
		  <div style={{
		    width: '8px',
		    height: '8px',
		    borderRadius: '50%',
		    background: corpusComparison?.A?.concordanceData ? '#10b981' : 'rgba(255,255,255,0.3)'
		  }} />
		  <span>{t('concordance.views.corpusComparison.charts.legend.corpusA')}</span>

		  <div style={{ margin: '0 0.5rem' }}>•</div>

		  <div style={{
		    width: '8px',
		    height: '8px',
		    borderRadius: '50%',
		    background: corpusComparison?.B?.concordanceData ? '#10b981' : 'rgba(255,255,255,0.3)'
		  }} />
		  <span>{t('concordance.views.corpusComparison.charts.legend.corpusB')}</span>
		</div>
	      </>
	    )}
	  </div>
	  )}
	</NavigationPanel>
      
      {/* Panel Données */}
      <NavigationPanel
        config={panelConfig.data}
        isActive={false}
        onClick={() => navigateToView('data')}
      >
        {isMobile ? (
          renderCompactPanel(panelConfig.data.icon, panelConfig.data.title, filteredData.length)
        ) : isTablet ? (
          renderSemiCompactPanel(panelConfig.data.icon, panelConfig.data.title, filteredData.length, t('concordance.overview.loadedConcordances'))
        ) : (
          <div style={{ textAlign: 'center', padding: '0.5rem 0.5rem 0.5rem 0.5rem' }}>
            <div className={styles.stat}>
              {filteredData.length}
            </div>
            <div className={styles.label} style={{ marginBottom: '1rem' }}>
              {t('concordance.overview.loadedConcordances')}
            </div>

            <div style={{ fontSize: '1.0rem', opacity: 0.7 }}>
              {parseStats.lookupRate ? `${parseStats.lookupRate}% ${t('concordance.overview.enriched')}` : t('concordance.overview.readyToAnalyze')}
            </div>
          </div>
        )}
      </NavigationPanel>

      {/* Panel Lieux */}
      <NavigationPanel
        config={panelConfig.places}
        isActive={false}
        onClick={() => navigateToView('places')}
      >
        {isMobile ? (
          renderCompactPanel(panelConfig.places.icon, panelConfig.places.title, analytics.places?.length || 0)
        ) : isTablet ? (
          renderSemiCompactPanel(panelConfig.places.icon, panelConfig.places.title, analytics.places?.length || 0, t('concordance.overview.identifiedPlaces'))
        ) : (
          <div className={styles.panelContent}>
            <div className={styles.stat}>
              {analytics.places?.length || 0}
            </div>
            <div className={styles.label}>
              {t('concordance.overview.identifiedPlaces')}
            </div>
          </div>
        )}
      </NavigationPanel>
      
    </div>
  );
};

export default OverviewView;
