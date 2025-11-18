import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useResponsiveValue, useIsMobile } from '../../../../shared/hooks';
import CustomTooltipChart from './CustomTooltipChart';

/**
 * Composant DomainChart - Graphique de répartition par domaines juridiques
 * 
 * Affiche la distribution des concordances selon les domaines du droit canon.
 * Supporte deux modes de visualisation : barres (BarChart) ou camembert (PieChart).
 * 
 * Ce composant est conçu pour être exportable en image via ExportButtons.
 * L'attribut chartId permet d'identifier le conteneur DOM pour la capture.
 * 
 * Fonctionnalités :
 * - Affichage en barres ou camembert
 * - Hauteur personnalisable
 * - Palette de couleurs configurable
 * - Support export PNG via ID unique
 * - Tooltips informatifs
 * - Style académique cohérent
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<{name: string, value: number}>} props.data - Données des domaines juridiques
 * @param {('bar'|'pie')} [props.type='bar'] - Type de graphique
 * @param {number} [props.height=400] - Hauteur en pixels
 * @param {string} [props.chartId] - ID unique du conteneur pour export (généré auto si absent)
 * @param {Array<string>} [props.colors] - Palette de couleurs pour PieChart
 * 
 * @returns {JSX.Element} Graphique Recharts avec conteneur exportable
 * 
 * @example
 * // Usage basique en mode barres
 * <DomainChart 
 *   data={[
 *     { name: 'Droit pénal', value: 120 },
 *     { name: 'Droit civil', value: 85 }
 *   ]}
 * />
 * 
 * @example
 * // Usage avancé en mode camembert avec export
 * const chartId = useRef(`domains-${Date.now()}`).current;
 * 
 * <DomainChart
 *   data={analytics.domains}
 *   type="pie"
 *   height={500}
 *   chartId={chartId}
 *   colors={['#1e40af', '#7c3aed', '#059669']}
 * />
 * 
 * @example
 * // Cas d'erreur : données vides
 * <DomainChart data={[]} />
 * // Affiche : Message "Aucune donnée disponible"
 */
const DomainChart = ({ 
  data,                    // Données à afficher
  type = 'bar',           // Type par défaut : barres
  height = 400,           // Hauteur par défaut : 400px
  chartId = `domain-chart-${Date.now()}`,  // ID auto-généré si non fourni
  colors = [              // Palette de bleus par défaut
    '#2563eb',  // Bleu vif
    '#1d4ed8',  // Bleu moyen
    '#1e40af',  // Bleu foncé
    '#3730a3',  // Indigo
    '#4338ca',  // Indigo moyen
    '#6366f1',  // Indigo clair
    '#8b5cf6'   // Violet
  ]
}) => {
  
  // ============================================================================
  // HOOKS
  // ============================================================================

  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Hauteur responsive du graphique
  const responsiveHeight = useResponsiveValue({
    xs: height * 0.6,   // Mobile: 60% de la hauteur par défaut
    sm: height * 0.7,   // Phone landscape: 70%
    md: height * 0.85,  // Tablet: 85%
    lg: height          // Desktop: 100% (hauteur complète)
  });

  // Taille de police responsive
  const axisFontSize = useResponsiveValue({
    xs: '0.7rem',    // Mobile
    md: '0.8rem',    // Tablet
    lg: '0.85rem'    // Desktop
  });

  const labelFontSize = useResponsiveValue({
    xs: '0.75rem',   // Mobile
    md: '0.85rem',   // Tablet
    lg: '0.9rem'     // Desktop
  });

  // Angle de rotation des labels X (pour éviter le chevauchement sur mobile)
  const xAxisAngle = useResponsiveValue({
    xs: -45,    // Mobile: labels inclinés
    md: -30,    // Tablet: moins inclinés
    lg: -45     // Desktop: labels inclinés
  });

  // Rayon du PieChart responsive
  const pieOuterRadius = useResponsiveValue({
    xs: 80,     // Mobile: rayon plus petit
    sm: 100,    // Phone landscape
    md: 110,    // Tablet
    lg: 120     // Desktop: rayon complet
  });

  // Taille de police pour les labels du PieChart
  const pieLabelFontSize = useResponsiveValue({
    xs: '0.65rem',  // Mobile: très petit
    md: '0.75rem',  // Tablet
    lg: '0.85rem'   // Desktop
  });

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
          ⚜
        </div>
        
        {/* Message explicite */}
        <h3>{t('concordance.charts.noData.domains')}</h3>
        
        {/* Message optionnel : pourrait ajouter des instructions */}
      </div>
    );
  }

  // ============================================================================
  // RENDU MODE BARCHART (BARRES)
  // ============================================================================
  
  /**
   * Mode barres : adapté pour comparer plusieurs domaines
   * Meilleure lisibilité pour 3-15 catégories
   */
  if (type === 'bar') {
    return (
      <div 
        id={chartId}  // ID CRITIQUE pour export PNG
        style={{ 
          background: 'white',      // Fond blanc (requis pour export propre)
          padding: '1rem',          // Padding interne
          borderRadius: '8px'       // Coins arrondis
        }}
      >
        {/* ====================================================================
            ResponsiveContainer : Adapte le graphique à son conteneur
            ==================================================================== */}
        <ResponsiveContainer width="100%" height={responsiveHeight}>

          {/* ==================================================================
              BarChart : Graphique en barres Recharts
              ================================================================== */}
          <BarChart data={data}>

            {/* GRILLE DE FOND */}
            <CartesianGrid
              strokeDasharray="3 3"    // Lignes pointillées
              stroke="#e2e8f0"          // Gris clair
            />

            {/* AXE HORIZONTAL (catégories) */}
            <XAxis
              dataKey="name"            // Clé des données pour les labels
              angle={xAxisAngle}        // Rotation responsive
              textAnchor="end"          // Ancrage du texte
              height={100}              // Hauteur réservée (pour labels longs)
              style={{
                fontSize: axisFontSize  // Taille responsive
              }}
            />

            {/* AXE VERTICAL (valeurs) */}
            <YAxis
              style={{
                fontSize: axisFontSize  // Taille responsive
              }}
            />
            
            {/* TOOLTIP AU SURVOL */}
            <Tooltip content={<CustomTooltipChart allData={data} valueLabel={t('concordance.charts.labels.concordances')} />} />
            {/* BARRES */}
            <Bar 
              dataKey="value"           // Clé des données pour les hauteurs
              fill="#553C9A"            // Couleur violet (domaines)
              radius={[8, 8, 0, 0]}     // Coins arrondis en haut uniquement
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ============================================================================
  // RENDU MODE PIECHART (CAMEMBERT)
  // ============================================================================
  
  /**
   * Mode camembert : adapté pour voir proportions relatives
   * Idéal pour 3-8 catégories maximum
   */
  if (type === 'pie') {
    return (
      <div 
        id={chartId}  // ID CRITIQUE pour export PNG
        style={{ 
          background: 'white',      // Fond blanc
          padding: '1rem',          // Padding interne
          borderRadius: '8px'       // Coins arrondis
        }}
      >
        {/* ====================================================================
            ResponsiveContainer : Adapte le graphique à son conteneur
            ==================================================================== */}
        <ResponsiveContainer width="100%" height={responsiveHeight}>
          
          {/* ==================================================================
              PieChart : Graphique en camembert Recharts
              ================================================================== */}
          <PieChart>
            
            {/* ==============================================================
                Pie : Le camembert lui-même
                ============================================================== */}
            <Pie
              data={data}               // Données source
              dataKey="value"           // Clé pour les valeurs (tailles des parts)
              nameKey="name"            // Clé pour les noms (labels)
              cx="50%"                  // Centre X (milieu horizontal)
              cy="50%"                  // Centre Y (milieu vertical)
              outerRadius={pieOuterRadius}  // Rayon externe responsive du camembert

              // Labels personnalisés responsive : affiche "Nom: XX%"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`  // Format : "Droit pénal: 45%"
              }
              style={{
                fontSize: pieLabelFontSize  // Taille de police responsive
              }}
            >
              {/* ============================================================
                  Génération des cellules colorées
                  Chaque part du camembert a sa propre couleur
                  ============================================================ */}
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}                    // Clé unique React
                  fill={colors[index % colors.length]}     // Couleur cyclique
                />
              ))}
            </Pie>
            
            {/* TOOLTIP AU SURVOL */}
           <Tooltip content={<CustomTooltipChart allData={data} valueLabel={t('concordance.charts.labels.concordances')} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ============================================================================
  // FALLBACK (ne devrait jamais arriver)
  // ============================================================================
  
  /**
   * Si type n'est ni 'bar' ni 'pie' → retourne null
   * Évite erreurs d'affichage
   */
  return null;
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default DomainChart;

// ============================================================================
// NOTES TECHNIQUES
// ============================================================================

/**
 * CHOIX DE TYPE DE GRAPHIQUE :
 * 
 * BarChart (barres) :
 * ✅ Bon pour : Comparaisons précises, nombreuses catégories (>5)
 * ✅ Exemple : 10 domaines juridiques avec valeurs variées
 * ❌ Limites : Moins visuel pour proportions relatives
 * 
 * PieChart (camembert) :
 * ✅ Bon pour : Proportions relatives, peu de catégories (<8)
 * ✅ Exemple : 4 grands domaines dominant le corpus
 * ❌ Limites : Difficile à lire si >8 catégories
 * 
 * RECOMMANDATION :
 * - 1-4 catégories → PieChart
 * - 5-15 catégories → BarChart
 * - >15 catégories → Filtrer ou grouper d'abord
 */

/**
 * EXPORT PNG - POINTS D'ATTENTION :
 * 
 * 1. L'ID chartId doit être UNIQUE sur la page
 *    → Utiliser useRef() avec timestamp pour garantir unicité
 * 
 * 2. Le conteneur doit avoir un fond blanc explicite
 *    → Sinon l'export peut avoir un fond transparent involontaire
 * 
 * 3. Le padding est inclus dans la capture
 *    → Ajustez selon vos besoins de marges dans l'image
 * 
 * 4. Les polices doivent être chargées avant export
 *    → html2canvas peut rater les fonts custom si pas chargées
 */
