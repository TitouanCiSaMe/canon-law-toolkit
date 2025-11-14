import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import CustomTooltipChart from './CustomTooltipChart';

/**
 * Composant TemporalChart - Graphique d'évolution chronologique
 * 
 * Affiche l'évolution temporelle des concordances par périodes (siècles, 
 * demi-siècles). Supporte la navigation temporelle interactive via brush.
 * 
 * Ce composant est conçu pour être exportable en image via ExportButtons.
 * L'attribut chartId permet d'identifier le conteneur DOM pour la capture.
 * 
 * Fonctionnalités :
 * - Affichage en ligne temporelle
 * - Navigation temporelle (brush) optionnelle
 * - Zoom sur périodes spécifiques
 * - Hauteur personnalisable
 * - Couleur de ligne configurable
 * - Support export PNG via ID unique
 * - Tooltips informatifs avec formatage
 * - Labels d'axes descriptifs
 * - Style académique cohérent
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<{period: string, count: number}>} props.data - Données temporelles
 * @param {number} [props.height=400] - Hauteur en pixels
 * @param {boolean} [props.showBrush=true] - Activer la navigation temporelle
 * @param {string} [props.lineColor='#2563eb'] - Couleur de la ligne principale
 * @param {string} [props.chartId] - ID unique du conteneur pour export (généré auto si absent)
 * 
 * @returns {JSX.Element} Graphique Recharts avec conteneur exportable
 * 
 * @example
 * // Usage basique
 * <TemporalChart 
 *   data={[
 *     { period: '1150-1175', count: 89 },
 *     { period: '1175-1200', count: 156 }
 *   ]}
 * />
 * 
 * @example
 * // Usage avancé avec export PNG
 * const chartId = useRef(`temporal-${Date.now()}`).current;
 * 
 * <TemporalChart
 *   data={analytics.periods}
 *   height={400}
 *   showBrush={true}
 *   lineColor="#7c3aed"
 *   chartId={chartId}
 * />
 * 
 * @example
 * // Sans brush (navigation temporelle désactivée)
 * <TemporalChart 
 *   data={periods}
 *   showBrush={false}
 * />
 * 
 * @example
 * // Cas d'erreur : données vides
 * <TemporalChart data={[]} />
 * // Affiche : Message "Aucune donnée temporelle disponible"
 */
const TemporalChart = ({ 
  data,                    // Données à afficher
  height = 400,           // Hauteur par défaut : 400px
  showBrush = true,       // Brush activé par défaut
  lineColor = '#2563eb',  // Bleu par défaut
  chartId = `temporal-chart-${Date.now()}`  // ID auto-généré si non fourni
}) => {
  
  // ============================================================================
  // HOOK DE TRADUCTION
  // ============================================================================
  
  const { t } = useTranslation();
  
  // ============================================================================
  // VALIDATION DES DONNÉES
  // ============================================================================
  
  /**
   * Vérification de sécurité : données présentes et non vides
   * Si échec → affichage d'un message utilisateur friendly
   */
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center',     // Centrage horizontal
        padding: '4rem',         // Espacement généreux
        color: '#64748b'         // Gris neutre
      }}>
        {/* Icône visuelle */}
        <div style={{ 
          fontSize: '3rem',       // Grande taille
          marginBottom: '1rem'    // Espacement sous l'icône
        }}>
          📅
        </div>
        
        {/* Message explicite */}
        <h3>{t('charts.noData.temporal')}</h3>
      </div>
    );
  }

  // ============================================================================
  // RENDU DU GRAPHIQUE TEMPOREL
  // ============================================================================
  
  return (
    <div 
      id={chartId}  // ID CRITIQUE pour export PNG
      style={{ 
        background: 'white',      // Fond blanc (requis pour export propre)
        padding: '1rem',          // Padding interne
        borderRadius: '8px'       // Coins arrondis
      }}
    >
      {/* ======================================================================
          ResponsiveContainer : Adapte le graphique à son conteneur
          ====================================================================== */}
      <ResponsiveContainer width="100%" height={height}>
        
        {/* ====================================================================
            LineChart : Graphique linéaire Recharts
            ==================================================================== */}
        <LineChart data={data}>
          
          {/* GRILLE DE FOND */}
          <CartesianGrid 
            strokeDasharray="3 3"    // Lignes pointillées
            stroke="#e2e8f0"          // Gris clair
          />
          
          {/* AXE HORIZONTAL (périodes) */}
          <XAxis 
            dataKey="period"          // Clé des données pour les labels
            style={{ 
              fontSize: '0.85rem'     // Taille de police
            }}
            label={{ 
              value: t('charts.labels.period'),  // Label de l'axe traduit
              position: 'insideBottom', 
              offset: -5,
              style: { 
                fontSize: '0.9rem', 
                fill: '#64748b'       // Gris pour le label
              }
            }}
          />
          
          {/* AXE VERTICAL (compteurs) */}
          <YAxis 
            style={{ 
              fontSize: '0.85rem' 
            }}
            label={{ 
              value: t('charts.labels.numberOfWorks'),  // Label de l'axe traduit
              angle: -90,                 // Rotation verticale
              position: 'insideLeft',
              style: { 
                fontSize: '0.9rem', 
                fill: '#64748b' 
              }
            }}
          />
          
          {/* TOOLTIP AU SURVOL */}
          <Tooltip content={<CustomTooltipChart allData={data} valueLabel={t('charts.labels.occurrences')} showRank={false} />} />          
          {/* LIGNE PRINCIPALE */}
          <Line 
            type="monotone"           // Interpolation monotone (courbe douce)
            dataKey="count"           // Clé des données pour les valeurs Y
            stroke={lineColor}        // Couleur de la ligne
            strokeWidth={3}           // Épaisseur de la ligne
            dot={{ 
              fill: lineColor,        // Couleur des points
              r: 5                    // Rayon des points
            }}
            activeDot={{ 
              r: 7                    // Rayon des points au survol (plus grand)
            }}
          />
          
          {/* BRUSH (NAVIGATION TEMPORELLE) - CONDITIONNEL */}
          {/**
           * Brush : Permet de zoomer sur une période spécifique
           * Affiche une miniature de toute la timeline
           * L'utilisateur peut glisser et redimensionner la sélection
           * 
           * Rendu conditionnel : n'apparaît que si showBrush={true}
           */}
          {showBrush && (
            <Brush 
              dataKey="period"            // Clé pour les labels du brush
              height={30}                 // Hauteur du brush
              stroke="#2563eb"            // Couleur de la bordure
              fill="rgba(37, 99, 235, 0.1)"  // Remplissage semi-transparent
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default TemporalChart;

// ============================================================================
// NOTES TECHNIQUES
// ============================================================================

/**
 * NAVIGATION TEMPORELLE (BRUSH) :
 * 
 * Le brush permet :
 * 1. Vue d'ensemble de toute la timeline (miniature en bas)
 * 2. Sélection d'une période à agrandir (glisser-déposer)
 * 3. Redimensionnement de la sélection (ajuster les bords)
 * 4. Mise à jour automatique du graphique principal
 * 
 * Quand l'utiliser :
 * ✅ Bon pour : Longues périodes (>10 points de données)
 * ✅ Exemple : Évolution sur 200 ans avec 20+ périodes
 * ❌ Inutile si : <5 périodes (prend de la place sans bénéfice)
 * 
 * Désactivation :
 * <TemporalChart showBrush={false} />
 */

/**
 * INTERPOLATION MONOTONE :
 * 
 * type="monotone" :
 * - Crée des courbes douces entre les points
 * - Garantit que la courbe ne dépasse pas les valeurs réelles
 * - Plus agréable visuellement que des lignes droites
 * - Convient bien aux évolutions temporelles
 * 
 * Alternatives :
 * - type="linear" : Lignes droites entre points
 * - type="step" : Paliers (pour données discrètes)
 */

/**
 * EXPORT PNG - POINTS D'ATTENTION :
 * 
 * 1. L'ID chartId doit être UNIQUE sur la page
 *    → Utiliser useRef() avec timestamp pour garantir unicité
 * 
 * 2. Le conteneur doit avoir un fond blanc explicite
 *    → Sinon l'export peut avoir un fond transparent
 * 
 * 3. Le brush est inclus dans la capture
 *    → L'image PNG montrera le brush si showBrush={true}
 * 
 * 4. Les labels d'axes sont inclus
 *    → "Période" et "Nombre d'œuvres" apparaîtront dans l'export
 */

/**
 * PERSONNALISATION DES COULEURS :
 * 
 * La couleur de ligne peut être personnalisée :
 * <TemporalChart lineColor="#7c3aed" />  // Violet
 * <TemporalChart lineColor="#059669" />  // Vert
 * 
 * Le brush utilise toujours #2563eb (bleu) pour cohérence
 * avec le design général de l'application.
 */

/**
 * FORMAT DES DONNÉES :
 * 
 * Structure attendue :
 * [
 *   { period: "1150-1175", count: 89 },
 *   { period: "1175-1200", count: 156 },
 *   { period: "1200-1225", count: 234 }
 * ]
 * 
 * Notes :
 * - period : String au format "YYYY-YYYY" (ex: "1150-1175")
 * - count : Number (nombre d'œuvres pour cette période)
 * - Les données doivent être triées chronologiquement
 */

/**
 * ACCESSIBILITÉ :
 * 
 * Le tooltip fournit des informations détaillées au survol :
 * - Label formaté : "Période: 1150-1175"
 * - Valeur formatée : "156 œuvres"
 * 
 * Les labels d'axes sont explicites :
 * - Axe X : "Période"
 * - Axe Y : "Nombre d'œuvres"
 */
