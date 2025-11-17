import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Composant CustomTooltip - Tooltip enrichi pour graphiques Recharts
 * 
 * Affiche un tooltip personnalisé avec statistiques avancées :
 * - Nom de l'élément
 * - Valeur numérique
 * - Pourcentage du total
 * - Rang dans la liste
 * 
 * Conçu pour être réutilisé dans tous les graphiques (Bar, Pie, Line).
 * Style académique cohérent avec la charte du projet.
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.active - Indique si le tooltip est actif (fourni par Recharts)
 * @param {Array} props.payload - Données de l'élément survolé (fourni par Recharts)
 * @param {string} props.label - Label de l'élément (fourni par Recharts)
 * @param {Array} props.allData - Toutes les données du graphique pour calculs statistiques
 * @param {string} [props.valueLabel='Valeur'] - Label personnalisé pour la valeur
 * @param {boolean} [props.showPercentage=true] - Afficher ou non le pourcentage
 * @param {boolean} [props.showRank=true] - Afficher ou non le rang
 * 
 * @returns {JSX.Element|null} Tooltip stylisé ou null si inactif
 * 
 * @example
 * // Usage dans un BarChart
 * <BarChart data={data}>
 *   <Tooltip content={<CustomTooltip allData={data} />} />
 * </BarChart>
 * 
 * @example
 * // Usage avec options personnalisées
 * <PieChart>
 *   <Tooltip 
 *     content={
 *       <CustomTooltip 
 *         allData={data}
 *         valueLabel="Nombre de concordances"
 *         showPercentage={true}
 *         showRank={false}
 *       />
 *     } 
 *   />
 * </PieChart>
 * 
 * @example
 * // Usage dans LineChart temporel
 * <LineChart data={temporalData}>
 *   <Tooltip 
 *     content={
 *       <CustomTooltip 
 *         allData={temporalData}
 *         valueLabel="Occurrences"
 *         showRank={false}
 *       />
 *     }
 *   />
 * </LineChart>
 */
const CustomTooltip = ({
  active,
  payload,
  label,
  allData = [],
  valueLabel = 'Valeur',
  showPercentage = true,
  showRank = true
}) => {
  const { t, i18n } = useTranslation();

  // ============================================================================
  // VALIDATION : Tooltip actif et données présentes
  // ============================================================================
  
  /**
   * Recharts appelle ce composant même quand le tooltip n'est pas visible.
   * On retourne null si :
   * - active est false (pas de survol)
   * - payload est vide (pas de données)
   * - allData est vide (impossible de calculer stats)
   */
  if (!active || !payload || payload.length === 0 || allData.length === 0) {
    return null;
  }

  // ============================================================================
  // EXTRACTION DES DONNÉES
  // ============================================================================
  
  /**
   * Recharts fournit les données dans payload[0]
   * Structure : { name, value, payload: {...} }
   */
  const data = payload[0];
  const name = label || data.name || 'N/A';
  const value = data.value || 0;

  // ============================================================================
  // CALCUL DU POURCENTAGE
  // ============================================================================
  
  /**
   * Calcule le pourcentage de cet élément par rapport au total
   * Formule : (valeur / somme_totale) * 100
   */
  const calculatePercentage = () => {
    const total = allData.reduce((sum, item) => {
      const itemValue = item.value || item.count || 0;
      return sum + itemValue;
    }, 0);
    
    if (total === 0) return 0;
    
    return ((value / total) * 100).toFixed(1);
  };

  const percentage = calculatePercentage();

  // ============================================================================
  // CALCUL DU RANG
  // ============================================================================
  
  /**
   * Détermine la position de cet élément dans le classement
   * Ex: si c'est le 3ème plus grand → "3ème sur 15"
   */
  const calculateRank = () => {
    // Trier les données par valeur décroissante
    const sorted = [...allData].sort((a, b) => {
      const aVal = a.value || a.count || 0;
      const bVal = b.value || b.count || 0;
      return bVal - aVal;
    });
    
    // Trouver l'index de l'élément actuel
    const index = sorted.findIndex(item => {
      const itemName = item.name || item.label || '';
      return itemName === name;
    });
    
    // Rang = index + 1 (car index commence à 0)
    return index !== -1 ? index + 1 : null;
  };

  const rank = calculateRank();
  const totalItems = allData.length;

  // ============================================================================
  // FORMATAGE DU RANG AVEC I18N
  // ============================================================================

  /**
   * Convertit un nombre en forme ordinale localisée
   * FR: 1 → "1er", 2 → "2ème", 3 → "3ème", etc.
   * EN: 1 → "1st", 2 → "2nd", 3 → "3rd", etc.
   */
  const formatRank = (rankNumber) => {
    if (rankNumber === null) return '';

    if (i18n.language === 'fr') {
      return rankNumber === 1 ? `${rankNumber}er` : `${rankNumber}ème`;
    } else {
      // English ordinals
      const lastDigit = rankNumber % 10;
      const lastTwoDigits = rankNumber % 100;

      // Special cases: 11th, 12th, 13th
      if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return `${rankNumber}th`;
      }

      // Regular cases
      if (lastDigit === 1) return `${rankNumber}st`;
      if (lastDigit === 2) return `${rankNumber}nd`;
      if (lastDigit === 3) return `${rankNumber}rd`;
      return `${rankNumber}th`;
    }
  };

  // ============================================================================
  // RENDU DU TOOLTIP
  // ============================================================================
  
  return (
    <div style={{
      // Conteneur principal
      backgroundColor: 'rgba(255, 255, 255, 0.98)',  // Blanc quasi-opaque
      border: '2px solid #1A365D',                   // Bordure bleu académique
      borderRadius: '8px',                           // Coins arrondis
      padding: '0.75rem',                            // Padding généreux
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',  // Ombre portée
      minWidth: '180px',                             // Largeur minimale
      fontFamily: '"Crimson Text", "Times New Roman", serif'  // Police académique
    }}>
      
      {/* ==================================================================
          NOM DE L'ÉLÉMENT
          ================================================================== */}
      <div style={{
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#1A365D',                            // Bleu académique foncé
        marginBottom: '0.5rem',
        borderBottom: '1px solid #e2e8f0',           // Ligne de séparation
        paddingBottom: '0.4rem'
      }}>
        {name}
      </div>
      
      {/* ==================================================================
          VALEUR PRINCIPALE
          ================================================================== */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: showPercentage || showRank ? '0.4rem' : '0'
      }}>
        <span style={{
          fontSize: '0.85rem',
          color: '#64748b',                          // Gris neutre
          fontWeight: '500'
        }}>
          {valueLabel} :
        </span>
        <span style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: '#1A365D',                          // Bleu académique
          marginLeft: '0.5rem'
        }}>
          {value.toLocaleString('fr-FR')}
        </span>
      </div>
      
      {/* ==================================================================
          POURCENTAGE (optionnel)
          ================================================================== */}
      {showPercentage && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: showRank ? '0.4rem' : '0'
        }}>
          <span style={{
            fontSize: '0.85rem',
            color: '#64748b',
            fontWeight: '500'
          }}>
            {t('concordance.charts.tooltip.shareOfTotal')} :
          </span>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#2C5282',                        // Bleu moyen
            marginLeft: '0.5rem'
          }}>
            {percentage}%
          </span>
        </div>
      )}
      
      {/* ==================================================================
          RANG (optionnel)
          ================================================================== */}
      {showRank && rank !== null && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.4rem',
          paddingTop: '0.4rem',
          borderTop: '1px solid #f1f5f9'            // Ligne de séparation légère
        }}>
          <span style={{
            fontSize: '0.8rem',
            color: '#64748b',
            fontStyle: 'italic'
          }}>
            {t('concordance.charts.tooltip.ranking')} :
          </span>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#553C9A',                        // Violet académique
            marginLeft: '0.5rem'
          }}>
            {t('concordance.charts.tooltip.rankOf', { rank: formatRank(rank), total: totalItems })}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default CustomTooltip;

// ============================================================================
// NOTES TECHNIQUES
// ============================================================================

/**
 * INTÉGRATION DANS RECHARTS :
 * 
 * Le composant doit être passé à la prop `content` de <Tooltip />
 * Recharts gère automatiquement les props active, payload, label
 * 
 * Exemple complet :
 * ```jsx
 * import CustomTooltip from './CustomTooltip';
 * 
 * <BarChart data={myData}>
 *   <Tooltip content={<CustomTooltip allData={myData} />} />
 * </BarChart>
 * ```
 */

/**
 * PERSONNALISATION :
 * 
 * Props disponibles pour adapter le comportement :
 * - valueLabel : Change le label "Valeur" (ex: "Occurrences")
 * - showPercentage : true/false pour afficher le pourcentage
 * - showRank : true/false pour afficher le classement
 * 
 * Exemple sans rang :
 * ```jsx
 * <Tooltip content={<CustomTooltip allData={data} showRank={false} />} />
 * ```
 */

/**
 * CALCULS STATISTIQUES :
 * 
 * Pourcentage :
 * - Formule : (valeur / somme_totale) * 100
 * - Arrondi à 1 décimale
 * 
 * Rang :
 * - Tri décroissant par valeur
 * - Position dans le tableau trié
 * - Format français : 1er, 2ème, 3ème, etc.
 */

/**
 * ACCESSIBILITÉ :
 * 
 * Le tooltip est purement visuel (survol souris).
 * Pour une meilleure accessibilité, considérer :
 * - Ajout de aria-label sur les graphiques
 * - Table de données alternative
 * - Navigation clavier
 */

/**
 * PERFORMANCES :
 * 
 * Les calculs (pourcentage, rang) sont effectués à chaque affichage.
 * Pour de très gros datasets (>1000 items), considérer :
 * - Pré-calcul des statistiques en amont
 * - Mémoïsation avec useMemo
 * - Désactivation du rang (calcul le plus coûteux)
 */
