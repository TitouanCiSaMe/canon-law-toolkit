import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useResponsiveValue } from '../../../../shared/hooks';
import { CHART_COLORS } from '../../config/panelConfig';

/**
 * Composant TimelineGantt - Timeline horizontale avec barres de plages temporelles
 * 
 * Affiche les œuvres individuelles sur une timeline avec :
 * - Barres rectangulaires pour les plages (ex: 1191-1198)
 * - Losanges pour les dates précises (ex: 1164)
 * - Tooltips détaillés au survol (titre, auteur, lieu, type)
 * - Gestion des dates invalides
 * 
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.data - Données filtrées avec période, auteur, titre, etc.
 * @param {number} props.height - Hauteur du conteneur (défaut: 600)
 * 
 * @returns {JSX.Element} Timeline Gantt interactive
 */
const TimelineGantt = ({ data, height = 600, chartId }) => {
  // ============================================================================
  // HOOK DE TRADUCTION
  // ============================================================================

  const { t } = useTranslation();

  // ============================================================================
  // DIMENSIONS RESPONSIVES
  // ============================================================================

  // Marges responsives (la marge gauche doit s'adapter pour les noms d'œuvres)
  const leftMargin = useResponsiveValue({
    xs: 120,    // Mobile: marge réduite
    md: 180,    // Tablet: marge moyenne
    lg: 250     // Desktop: marge complète
  });

  const MARGINS = {
    top: 40,
    right: 40,
    bottom: 60,
    left: leftMargin
  };

  // Largeur du graphique responsive
  const chartWidth = useResponsiveValue({
    xs: 600,    // Mobile: largeur réduite
    md: 900,    // Tablet: largeur moyenne
    lg: 1200    // Desktop: largeur complète
  });

  // Hauteur responsive du conteneur
  const responsiveHeight = useResponsiveValue({
    xs: height * 0.6,   // Mobile: 60%
    md: height * 0.8,   // Tablet: 80%
    lg: height          // Desktop: 100%
  });

  // Tailles de police responsives
  const tickFontSize = useResponsiveValue({
    xs: 9,      // Mobile: très petit
    md: 10,     // Tablet: petit
    lg: 11      // Desktop: taille normale
  });

  const labelFontSize = useResponsiveValue({
    xs: 8,      // Mobile: très petit
    md: 9,      // Tablet: petit
    lg: 10      // Desktop: taille normale
  });

  // ============================================================================
  // ÉTATS LOCAUX
  // ============================================================================
  
  const [hoveredWork, setHoveredWork] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // ============================================================================
  // PARSING ET PRÉPARATION DES DONNÉES
  // ============================================================================
  
  /**
   * Parse une période et retourne les informations temporelles
   * @param {string} period - Période au format "1191 to 1198" ou "1164"
   * @returns {Object} Informations temporelles
   */
  const parsePeriod = (period) => {
    // 🔍 DEBUG : Voir le format exact des périodes
    console.log('🔎 Période reçue:', period, '| Type:', typeof period);
    
    if (!period || period === 'Période inconnue' || period.includes('invalid')) {
      return { isValid: false };
    }

    // Cas 1 : Plage (ex: "1191 to 1198")
	const rangeMatch = period.match(/(\d{4})\s*[-–—to]+\s*(\d{4})/);
	if (rangeMatch) {
	  console.log('✅ PLAGE DÉTECTÉE:', rangeMatch[0]);
	  return {
	    isValid: true,
	    isRange: true,
	    startYear: parseInt(rangeMatch[1]),
	    endYear: parseInt(rangeMatch[2]),
	    displayText: `${rangeMatch[1]}-${rangeMatch[2]}`
	  };
	}

    // Cas 2 : Date précise (ex: "1164")
    const singleMatch = period.match(/^(\d{4})$/);
    if (singleMatch) {
      console.log('✅ DATE PRÉCISE DÉTECTÉE:', singleMatch[0]);
      return {
        isValid: true,
        isRange: false,
        startYear: parseInt(singleMatch[1]),
        endYear: parseInt(singleMatch[1]),
        displayText: singleMatch[1]
      };
    }

    // Cas 3 : Extraire au moins une année
    const yearMatch = period.match(/(\d{4})/);
    if (yearMatch) {
      console.log('✅ ANNÉE EXTRAITE (cas 3):', yearMatch[0]);
      return {
        isValid: true,
        isRange: false,
        startYear: parseInt(yearMatch[1]),
        endYear: parseInt(yearMatch[1]),
        displayText: yearMatch[1]
      };
    }

    console.log('❌ PÉRIODE INVALIDE');
    return { isValid: false };
  };

  /**
   * Parse les données et extrait les informations temporelles
   */
  const parsedWorks = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Dédupliquer par œuvre unique
    const uniqueWorks = new Map();
    
    data.forEach(item => {
      const workKey = `${item.title}|||${item.author}|||${item.period}`;
      
      if (!uniqueWorks.has(workKey)) {
        uniqueWorks.set(workKey, {
          title: item.title || t('timeline.defaults.unknownTitle'),
          author: item.author || t('timeline.defaults.anonymous'),
          place: item.place || t('timeline.defaults.unknownPlace'),
          domain: item.domain || t('timeline.defaults.unspecified'),
          period: item.period,
          concordanceCount: 1
        });
      } else {
        // Incrémenter le compte de concordances
        const work = uniqueWorks.get(workKey);
        work.concordanceCount++;
      }
    });

    // Parser les dates
    const works = Array.from(uniqueWorks.values()).map((work, index) => {
      const parsed = parsePeriod(work.period);
      
      return {
        ...work,
        id: index,
        ...parsed
      };
    }).filter(work => work.isValid); // Filtrer les dates invalides

    // 🔍 DEBUG : Compter les plages vs dates précises
    const rangeCount = works.filter(w => w.isRange).length;
    const singleCount = works.filter(w => !w.isRange).length;
    console.log('📊 TimelineGantt - Statistiques parsing:');
    console.log(`   ✅ Plages détectées: ${rangeCount}`);
    console.log(`   ✅ Dates précises: ${singleCount}`);
    console.log(`   ✅ Total œuvres valides: ${works.length}`);

    // Trier par année de début
    return works.sort((a, b) => a.startYear - b.startYear);
  }, [data, t]);

  // ============================================================================
  // CALCUL DE L'ÉCHELLE TEMPORELLE
  // ============================================================================
  
  const timeScale = useMemo(() => {
    if (parsedWorks.length === 0) {
      return { minYear: 1100, maxYear: 1300, range: 200 };
    }

    const allYears = parsedWorks.flatMap(w => [w.startYear, w.endYear]);
    const minYear = Math.floor(Math.min(...allYears) / 10) * 10 - 10;
    const maxYear = Math.ceil(Math.max(...allYears) / 10) * 10 + 10;
    const range = maxYear - minYear;

    return { minYear, maxYear, range };
  }, [parsedWorks]);

  // ============================================================================
  // DIMENSIONS DU SVG
  // ============================================================================

  const rowHeight = 30;
  const rowSpacing = 5;
  const chartHeight = parsedWorks.length * (rowHeight + rowSpacing);

  /**
   * Convertit une année en position X
   */
  const yearToX = (year) => {
    const ratio = (year - timeScale.minYear) / timeScale.range;
    return MARGINS.left + ratio * (chartWidth - MARGINS.left - MARGINS.right);
  };

  // ============================================================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // ============================================================================
  
  const handleMouseEnter = (work, event) => {
    setHoveredWork(work);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleMouseMove = (event) => {
    if (hoveredWork) {
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredWork(null);
  };

  // ============================================================================
  // GÉNÉRATION DE L'AXE TEMPOREL
  // ============================================================================
  
  const timeAxisTicks = useMemo(() => {
    const ticks = [];
    const tickInterval = timeScale.range > 100 ? 20 : 10;
    
    // Recalcul de yearToX inline pour éviter la dépendance
    const calculateX = (year) => {
      const ratio = (year - timeScale.minYear) / timeScale.range;
      return MARGINS.left + ratio * (chartWidth - MARGINS.left - MARGINS.right);
    };
    
    for (let year = timeScale.minYear; year <= timeScale.maxYear; year += tickInterval) {
      ticks.push({
        year,
        x: calculateX(year)
      });
    }
    
    return ticks;
  }, [timeScale, chartWidth]);

  // ============================================================================
  // COULEURS PAR DOMAINE (DYNAMIQUES)
  // ============================================================================

  /**
   * Génère dynamiquement les couleurs pour tous les domaines présents dans les données
   * Utilise CHART_COLORS du thème pour cohérence visuelle
   */
  const domainColors = useMemo(() => {
    // Extraire tous les domaines uniques des données parsées
    const uniqueDomains = [...new Set(parsedWorks.map(work => work.domain || 'Non spécifié'))];

    // Créer un objet couleur pour chaque domaine
    const colors = {};
    uniqueDomains.forEach((domain, index) => {
      // Utiliser la palette de couleurs en rotation si plus de domaines que de couleurs
      colors[domain] = CHART_COLORS[index % CHART_COLORS.length];
    });

    // S'assurer qu'il y a toujours une couleur par défaut pour 'Non spécifié'
    if (!colors['Non spécifié']) {
      colors['Non spécifié'] = '#64748b';
    }

    return colors;
  }, [parsedWorks]);

  const getColor = (domain) => domainColors[domain] || domainColors['Non spécifié'] || '#64748b';

  // ============================================================================
  // RENDER
  // ============================================================================
  
  if (parsedWorks.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem',
        color: '#64748b',
        background: 'white',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
        <h3>{t('concordance.timeline.noData')}</h3>
        <p style={{ fontSize: '0.9rem' }}>
          {t('concordance.timeline.dateFormat')}
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Titre et légende */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h5 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0
        }}>
          {t('timeline.title')} ({parsedWorks.length})
        </h5>

        {/* Légende */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '20px',
              height: '12px',
              background: '#3b82f6',
              borderRadius: '2px'
            }} />
            <span>{t('timeline.legend.timeRange')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#3b82f6',
              transform: 'rotate(45deg)'
            }} />
            <span>{t('timeline.legend.preciseDate')}</span>
          </div>
        </div>
      </div>

      {/* Conteneur scrollable */}
      <div
        id={chartId}
        style={{
          height: `${responsiveHeight}px`,
          overflowY: 'auto',
          overflowX: 'hidden',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          background: 'white'
      }}>
        <svg
          width={chartWidth}
          height={Math.max(chartHeight + MARGINS.top + MARGINS.bottom, height)}
          onMouseMove={handleMouseMove}
          style={{ display: 'block' }}
        >
          {/* Axe temporel (en haut) */}
          <g>
            {/* Ligne de l'axe */}
            <line
              x1={MARGINS.left}
              y1={MARGINS.top}
              x2={chartWidth - MARGINS.right}
              y2={MARGINS.top}
              stroke="#cbd5e1"
              strokeWidth={2}
            />

            {/* Ticks et labels */}
            {timeAxisTicks.map(tick => (
              <g key={tick.year}>
                {/* Tick */}
                <line
                  x1={tick.x}
                  y1={MARGINS.top}
                  x2={tick.x}
                  y2={MARGINS.top + 6}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
                {/* Ligne de grille */}
                <line
                  x1={tick.x}
                  y1={MARGINS.top}
                  x2={tick.x}
                  y2={MARGINS.top + chartHeight}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
                {/* Label */}
                <text
                  x={tick.x}
                  y={MARGINS.top - 10}
                  textAnchor="middle"
                  fontSize={tickFontSize}
                  fill="#64748b"
                >
                  {tick.year}
                </text>
              </g>
            ))}
          </g>

          {/* Œuvres */}
          {parsedWorks.map((work, index) => {
            const y = MARGINS.top + index * (rowHeight + rowSpacing) + 10;
            const color = getColor(work.domain);
            const x1 = yearToX(work.startYear);
            const x2 = yearToX(work.endYear);

            return (
              <g key={work.id}>
                {/* Nom de l'œuvre (à gauche) */}
                <text
                  x={MARGINS.left - 10}
                  y={y + rowHeight / 2}
                  textAnchor="end"
                  fontSize={labelFontSize}
                  fill="#475569"
                  dominantBaseline="middle"
                >
                  {work.title.length > 35 ? work.title.substring(0, 35) + '...' : work.title}
                </text>

                {/* Barre ou losange */}
                {work.isRange ? (
                  // Barre pour les plages
                  <rect
                    x={x1}
                    y={y}
                    width={Math.max(x2 - x1, 2)}
                    height={rowHeight - 10}
                    fill={color}
                    opacity={hoveredWork?.id === work.id ? 1 : 0.7}
                    stroke={hoveredWork?.id === work.id ? '#1e293b' : color}
                    strokeWidth={hoveredWork?.id === work.id ? 2 : 0}
                    rx={3}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => handleMouseEnter(work, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                ) : (
                  // Losange pour les dates précises
                  <rect
                    x={x1 - 6}
                    y={y + 4}
                    width={12}
                    height={12}
                    fill={color}
                    opacity={hoveredWork?.id === work.id ? 1 : 0.8}
                    stroke={hoveredWork?.id === work.id ? '#1e293b' : color}
                    strokeWidth={hoveredWork?.id === work.id ? 2 : 0}
                    transform={`rotate(45 ${x1} ${y + 10})`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => handleMouseEnter(work, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredWork && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x + 15}px`,
            top: `${tooltipPosition.y + 15}px`,
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            maxWidth: '300px',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            {hoveredWork.title}
          </div>
          <div style={{ opacity: 0.9, lineHeight: '1.4' }}>
            <div><strong>{t('timeline.tooltip.author')}</strong> {hoveredWork.author}</div>
            <div><strong>{t('timeline.tooltip.period')}</strong> {hoveredWork.displayText}</div>
            <div><strong>{t('timeline.tooltip.place')}</strong> {hoveredWork.place}</div>
            <div><strong>{t('timeline.tooltip.type')}</strong> {hoveredWork.domain}</div>
            <div><strong>{t('timeline.tooltip.concordances')}</strong> {hoveredWork.concordanceCount}</div>
          </div>
        </div>
      )}

      {/* Légende des domaines */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '6px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.75rem'
      }}>
        {Object.entries(domainColors).map(([domain, color]) => (
          <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: color,
              borderRadius: '3px'
            }} />
            <span style={{ color: '#64748b' }}>{domain}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

TimelineGantt.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number
};

export default TimelineGantt;
