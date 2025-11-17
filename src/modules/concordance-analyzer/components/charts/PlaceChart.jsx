import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useResponsiveValue, useIsMobile } from '../../../../shared/hooks';
import CustomTooltipChart from './CustomTooltipChart';

/**
 * Composant PlaceChart - Graphique de répartition géographique
 * 
 * Affiche la distribution des concordances selon les lieux de rédaction
 * (villes, pays). Supporte deux modes de visualisation : barres ou camembert.
 * 
 * Ce composant est conçu pour être exportable en image via ExportButtons.
 * L'attribut chartId permet d'identifier le conteneur DOM pour la capture.
 * 
 * Fonctionnalités :
 * - Affichage en barres ou camembert
 * - Hauteur personnalisable
 * - Limite d'items affichés (maxItems)
 * - Palette de couleurs configurable
 * - Support export PNG via ID unique
 * - Tooltips informatifs
 * - Style académique cohérent
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<{name: string, value: number}>} props.data - Données des lieux
 * @param {('bar'|'pie')} [props.type='bar'] - Type de graphique
 * @param {number} [props.height=400] - Hauteur en pixels
 * @param {number} [props.maxItems=15] - Nombre maximum de lieux affichés
 * @param {string} [props.chartId] - ID unique du conteneur pour export (généré auto si absent)
 * @param {Array<string>} [props.colors] - Palette de couleurs pour PieChart
 * 
 * @returns {JSX.Element} Graphique Recharts avec conteneur exportable
 * 
 * @example
 * // Usage basique en mode barres
 * <PlaceChart 
 *   data={[
 *     { name: 'Paris', value: 234 },
 *     { name: 'Bologne', value: 189 }
 *   ]}
 * />
 * 
 * @example
 * // Usage avancé avec export PNG
 * const chartId = useRef(`places-${Date.now()}`).current;
 * 
 * <PlaceChart
 *   data={analytics.places}
 *   type="bar"
 *   height={500}
 *   maxItems={15}
 *   chartId={chartId}
 * />
 * 
 * @example
 * // Cas d'erreur : données vides
 * <PlaceChart data={[]} />
 * // Affiche : Message "Aucune donnée de lieu disponible"
 */
const PlaceChart = ({ 
  data,                    // Données à afficher
  type = 'bar',           // Type par défaut : barres
  height = 400,           // Hauteur par défaut : 400px
  maxItems = 15,          // Limite par défaut : 15 lieux
  chartId = `place-chart-${Date.now()}`,  // ID auto-généré si non fourni
  colors = [              // Palette de verts par défaut (géographie)
    '#059669',  // Vert émeraude
    '#047857',  // Vert foncé
    '#065f46',  // Vert très foncé
    '#10b981',  // Vert clair
    '#34d399',  // Vert vif
    '#6ee7b7',  // Vert pastel
    '#a7f3d0'   // Vert très clair
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
          🗺️
        </div>
        
        {/* Message explicite */}
        <h3>{t('concordance.charts.noData.places')}</h3>
      </div>
    );
  }

  // ============================================================================
  // LIMITATION DU NOMBRE D'ITEMS
  // ============================================================================
  
  /**
   * Limite les données affichées au nombre maximal spécifié
   * Évite la surcharge visuelle et améliore la lisibilité
   * 
   * Exemple : Si 50 lieux mais maxItems=15 → affiche top 15
   */
  const displayData = data.slice(0, maxItems);

  // ============================================================================
  // RENDU MODE BARCHART (BARRES)
  // ============================================================================
  
  /**
   * Mode barres : adapté pour comparer plusieurs lieux
   * Meilleure lisibilité pour 3-15 lieux
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
          <BarChart data={displayData}>

            {/* GRILLE DE FOND */}
            <CartesianGrid
              strokeDasharray="3 3"    // Lignes pointillées
              stroke="#e2e8f0"          // Gris clair
            />

            {/* AXE HORIZONTAL (noms de lieux) */}
            <XAxis
              dataKey="name"            // Clé des données pour les labels
              angle={xAxisAngle}        // Rotation responsive pour éviter chevauchement
              textAnchor="end"          // Ancrage du texte
              height={120}              // Hauteur réservée (pour labels longs)
              style={{
                fontSize: axisFontSize  // Taille de police responsive
              }}
            />

            {/* AXE VERTICAL (valeurs) */}
            <YAxis
              style={{
                fontSize: axisFontSize  // Taille de police responsive
              }}
            />
            
            {/* TOOLTIP AU SURVOL */}
            <Tooltip content={<CustomTooltipChart allData={data} valueLabel={t('concordance.charts.labels.concordances')} />} />
            {/* BARRES */}
            <Bar 
              dataKey="value"           // Clé des données pour les hauteurs
              fill="#065F46"            // Couleur vert foncé (géographie)
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
   * Idéal pour 3-8 lieux maximum
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
              data={displayData}        // Données limitées (top N)
              dataKey="value"           // Clé pour les valeurs (tailles des parts)
              nameKey="name"            // Clé pour les noms (labels)
              cx="50%"                  // Centre X (milieu horizontal)
              cy="50%"                  // Centre Y (milieu vertical)
              outerRadius={pieOuterRadius}  // Rayon externe responsive du camembert

              // Labels personnalisés responsive : affiche "Nom: XX%"
              // Tronque les noms trop longs (>15 caractères)
              label={({ name, percent }) =>
                `${name.length > 15 ? name.substring(0, 15) + '...' : name}: ${(percent * 100).toFixed(0)}%`
              }
              style={{
                fontSize: pieLabelFontSize  // Taille de police responsive
              }}
            >
              {/* ============================================================
                  Génération des cellules colorées
                  Chaque part du camembert a sa propre couleur
                  ============================================================ */}
              {displayData.map((entry, index) => (
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

export default PlaceChart;

// ============================================================================
// NOTES TECHNIQUES
// ============================================================================

/**
 * CHOIX DE TYPE DE GRAPHIQUE :
 * 
 * BarChart (barres) :
 * ✅ Bon pour : Comparaisons précises, nombreux lieux (>5)
 * ✅ Exemple : Top 15 villes avec fréquences variées
 * ❌ Limites : Moins visuel pour proportions relatives
 * 
 * PieChart (camembert) :
 * ✅ Bon pour : Proportions relatives, peu de lieux (<8)
 * ✅ Exemple : 4 pays principaux dominant le corpus
 * ❌ Limites : Difficile à lire si >8 lieux
 * 
 * RECOMMANDATION :
 * - 1-4 lieux → PieChart
 * - 5-15 lieux → BarChart (défaut)
 * - >15 lieux → Ajuster maxItems ou filtrer
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
 * 4. Les labels longs peuvent déborder
 *    → La rotation angle={-45} et la troncature évitent ce problème
 */

/**
 * GESTION DES NOMS DE LIEUX LONGS :
 * 
 * Dans mode PieChart :
 * - Les noms >15 caractères sont tronqués avec "..."
 * - Exemple : "Constantinople..." au lieu du nom complet
 * - Le tooltip affiche toujours le nom complet
 * 
 * Dans mode BarChart :
 * - Les labels sont en rotation -45° pour éviter chevauchements
 * - Hauteur de 120px réservée pour les labels longs
 */

/**
 * PALETTE DE COULEURS :
 * 
 * Choix des verts pour la géographie :
 * - Évoque les cartes, la nature, les territoires
 * - Différenciation claire entre nuances
 * - Dégradé harmonieux du foncé au clair
 * 
 * Personnalisation possible :
 * <PlaceChart colors={['#ef4444', '#f97316', '#eab308']} />
 */
