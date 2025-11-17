import React from 'react';
import PropTypes from 'prop-types';
import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useResponsiveValue } from '../../../../shared/hooks';

/**
 * Composant RadarChart pour visualiser des comparaisons multi-critères
 * 
 * Affiche un graphique radar permettant de comparer de 1 à 3 datasets sur 5 critères :
 * - Volume de concordances
 * - Diversité des domaines canoniques
 * - Diversité des auteurs
 * - Diversité géographique (lieux)
 * - Richesse lexicale (termes KWIC uniques)
 * 
 * Les données sont automatiquement normalisées sur une échelle 0-100 pour permettre
 * des comparaisons visuelles équitables entre critères de différentes magnitudes.
 * 
 * @component
 * @example
 * // Exemple 1 : Comparaison simple (2 datasets)
 * const data = [
 *   {
 *     name: "Corpus complet",
 *     stats: {
 *       totalConcordances: 1234,
 *       uniqueDomains: 15,
 *       uniqueAuthors: 28,
 *       uniquePlaces: 45,
 *       uniqueKWIC: 523
 *     }
 *   },
 *   {
 *     name: "Corpus filtré",
 *     stats: {
 *       totalConcordances: 456,
 *       uniqueDomains: 8,
 *       uniqueAuthors: 12,
 *       uniquePlaces: 18,
 *       uniqueKWIC: 234
 *     }
 *   }
 * ];
 * 
 * <RadarChart datasets={data} />
 * 
 * @example
 * // Exemple 2 : Comparaison triple (3 périodes)
 * const data = [
 *   { name: "1200-1230", stats: {...} },
 *   { name: "1230-1260", stats: {...} },
 *   { name: "1260-1290", stats: {...} }
 * ];
 * 
 * <RadarChart 
 *   datasets={data}
 *   height={500}
 * />
 * 
 * @param {Object} props - Props du composant
 * @param {Array<Object>} props.datasets - Tableau de 1 à 3 datasets à comparer
 * @param {string} props.datasets[].name - Nom du dataset (ex: "Corpus XIIIe")
 * @param {Object} props.datasets[].stats - Statistiques du dataset
 * @param {number} props.datasets[].stats.totalConcordances - Nombre total de concordances
 * @param {number} props.datasets[].stats.uniqueDomains - Nombre de domaines uniques
 * @param {number} props.datasets[].stats.uniqueAuthors - Nombre d'auteurs uniques
 * @param {number} props.datasets[].stats.uniquePlaces - Nombre de lieux uniques
 * @param {number} props.datasets[].stats.uniqueKWIC - Nombre de termes KWIC uniques
 * @param {number} [props.height=400] - Hauteur du graphique en pixels
 * @returns {JSX.Element} Graphique radar avec légende et tooltips
 */
const RadarChart = ({ datasets, height = 400 }) => {

  // ============================================================================
  // HOOKS RESPONSIVES
  // ============================================================================

  // Hauteur responsive du graphique
  const responsiveHeight = useResponsiveValue({
    xs: height * 0.6,   // Mobile: 60% de la hauteur par défaut
    sm: height * 0.7,   // Phone landscape: 70%
    md: height * 0.85,  // Tablet: 85%
    lg: height          // Desktop: 100% (hauteur complète)
  });

  // Taille de police pour les labels des critères
  const criteriaFontSize = useResponsiveValue({
    xs: 10,     // Mobile: très petit
    md: 11,     // Tablet: petit
    lg: 12      // Desktop: taille normale
  });

  // Taille de police pour les ticks radiaux
  const tickFontSize = useResponsiveValue({
    xs: 8,      // Mobile: très petit
    md: 9,      // Tablet: petit
    lg: 10      // Desktop: taille normale
  });

  /**
   * Palette de couleurs académiques pour les séries
   * Alignée avec la charte graphique du projet
   */
  const COLORS = {
    primary: '#4A90E2',    // Bleu académique
    secondary: '#E27D60',  // Terracotta
    tertiary: '#85DCB0'    // Vert menthe
  };

  /**
   * Normalise une valeur sur une échelle 0-100
   * 
   * Utilise une échelle logarithmique pour les grandes valeurs afin d'éviter
   * que les critères avec de grandes magnitudes écrasent les autres visuellement.
   * 
   * @param {number} value - Valeur à normaliser
   * @param {number} max - Valeur maximale observée
   * @returns {number} Valeur normalisée entre 0 et 100
   */
  const normalize = (value, max) => {
    if (max === 0) return 0;
    
    // Pour les petites valeurs (< 100), normalisation linéaire
    if (max < 100) {
      return Math.round((value / max) * 100);
    }
    
    // Pour les grandes valeurs, utilisation d'une échelle logarithmique
    // pour éviter l'écrasement visuel
    const logValue = Math.log10(value + 1);
    const logMax = Math.log10(max + 1);
    return Math.round((logValue / logMax) * 100);
  };

  /**
   * Calcule les valeurs maximales pour chaque critère
   * parmi tous les datasets pour la normalisation
   * 
   * @param {Array<Object>} datasets - Datasets à analyser
   * @returns {Object} Objet contenant les max pour chaque critère
   */
  const calculateMaxValues = (datasets) => {
    return {
      totalConcordances: Math.max(...datasets.map(d => d.stats.totalConcordances)),
      uniqueDomains: Math.max(...datasets.map(d => d.stats.uniqueDomains)),
      uniqueAuthors: Math.max(...datasets.map(d => d.stats.uniqueAuthors)),
      uniquePlaces: Math.max(...datasets.map(d => d.stats.uniquePlaces)),
      uniqueKWIC: Math.max(...datasets.map(d => d.stats.uniqueKWIC))
    };
  };

  /**
   * Transforme les datasets en format Recharts avec normalisation
   * 
   * Convertit les statistiques brutes en valeurs normalisées 0-100
   * et structure les données pour Recharts RadarChart.
   * 
   * @param {Array<Object>} datasets - Datasets bruts
   * @returns {Array<Object>} Données formatées pour Recharts
   */
  const prepareRadarData = (datasets) => {
    const maxValues = calculateMaxValues(datasets);

    // Définir les 5 critères avec leurs labels et clés
    const criteria = [
      { key: 'totalConcordances', label: 'Volume\nConcordances' },
      { key: 'uniqueDomains', label: 'Diversité\nDomaines' },
      { key: 'uniqueAuthors', label: 'Diversité\nAuteurs' },
      { key: 'uniquePlaces', label: 'Diversité\nLieux' },
      { key: 'uniqueKWIC', label: 'Richesse\nLexicale' }
    ];

    // Créer un objet par critère avec les valeurs normalisées de chaque dataset
    return criteria.map(criterion => {
      const dataPoint = { critere: criterion.label };
      
      datasets.forEach((dataset, index) => {
        const rawValue = dataset.stats[criterion.key];
        const normalizedValue = normalize(rawValue, maxValues[criterion.key]);
        
        // Ajouter la valeur normalisée avec le nom du dataset comme clé
        dataPoint[dataset.name] = normalizedValue;
        
        // Ajouter aussi la valeur brute pour l'affichage dans le tooltip
        dataPoint[`${dataset.name}_raw`] = rawValue;
      });
      
      return dataPoint;
    });
  };

  /**
   * Composant Tooltip personnalisé pour afficher les valeurs détaillées
   * 
   * @param {Object} props - Props du tooltip Recharts
   * @param {boolean} props.active - Tooltip actif ou non
   * @param {Array} props.payload - Données du point survolé
   * @returns {JSX.Element|null} Tooltip formaté ou null
   */
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    const critere = payload[0].payload.critere;

    return (
      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <p style={{
          margin: '0 0 8px 0',
          fontWeight: 'bold',
          color: '#2d3748',
          fontSize: '13px'
        }}>
          {critere.replace('\n', ' ')}
        </p>
        
        {payload.map((entry, index) => {
          const rawValue = entry.payload[`${entry.name}_raw`];
          
          return (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              marginBottom: index < payload.length - 1 ? '6px' : '0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: entry.color
                }} />
                <span style={{ fontSize: '12px', color: '#4a5568' }}>
                  {entry.name}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#2d3748'
                }}>
                  {rawValue.toLocaleString('fr-FR')}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#718096'
                }}>
                  Score: {entry.value}/100
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Préparer les données pour le radar
  const radarData = prepareRadarData(datasets);

  // Sélectionner les couleurs selon le nombre de datasets
  const colors = [COLORS.primary, COLORS.secondary, COLORS.tertiary];

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={responsiveHeight}>
        <RechartsRadar data={radarData}>
          {/* Grille polaire avec style subtil */}
          <PolarGrid
            stroke="#e2e8f0"
            strokeWidth={1}
          />

          {/* Axes angulaires (critères) */}
          <PolarAngleAxis
            dataKey="critere"
            tick={{
              fill: '#4a5568',
              fontSize: criteriaFontSize,
              fontWeight: 500
            }}
          />

          {/* Axe radial (échelle 0-100) */}
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: '#718096',
              fontSize: tickFontSize
            }}
            tickCount={6}
          />

          {/* Générer un Radar par dataset */}
          {datasets.map((dataset, index) => (
            <Radar
              key={dataset.name}
              name={dataset.name}
              dataKey={dataset.name}
              stroke={colors[index]}
              fill={colors[index]}
              fillOpacity={0.5}
              strokeWidth={2}
            />
          ))}

          {/* Légende */}
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '13px'
            }}
            iconType="circle"
          />

          {/* Tooltip personnalisé */}
          <Tooltip content={<CustomTooltip />} />
        </RechartsRadar>
      </ResponsiveContainer>

      {/* Informations complémentaires */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f7fafc',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#718096',
        textAlign: 'center'
      }}>
        💡 Les valeurs sont normalisées sur une échelle 0-100 pour faciliter la comparaison visuelle
      </div>
    </div>
  );
};

RadarChart.propTypes = {
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      stats: PropTypes.shape({
        totalConcordances: PropTypes.number.isRequired,
        uniqueDomains: PropTypes.number.isRequired,
        uniqueAuthors: PropTypes.number.isRequired,
        uniquePlaces: PropTypes.number.isRequired,
        uniqueKWIC: PropTypes.number.isRequired
      }).isRequired
    })
  ).isRequired,
  height: PropTypes.number
};

export default RadarChart;
