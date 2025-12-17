/**
 * Composant NavigationPanel - Panneau de navigation cliquable
 * 
 * Affiche un panneau avec gradient, titre, et contenu personnalisé.
 * Gère automatiquement les états hover et actif avec animations CSS.
 * Utilisé principalement dans la vue d'ensemble (OverviewView) pour créer
 * une grille de panels interactifs.
 * 
 * Fonctionnalités :
 * - Affichage avec gradient personnalisé
 * - Animations au survol (hover)
 * - Indication visuelle de l'état actif
 * - Support du contenu personnalisé (children)
 * - Gestion de la taille (large, medium, wide)
 * 
 * @module components/ui/NavigationPanel
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { visualTheme } from '@shared/theme/globalTheme';

/**
 * Composant panneau de navigation interactif
 * 
 * Crée un panneau cliquable avec des effets visuels au survol et à l'activation.
 * Le panneau peut contenir n'importe quel contenu React (texte, graphiques, stats).
 * 
 * Styling :
 * - Gradient de fond personnalisable via config.gradient
 * - Bordure blanche épaisse quand actif
 * - Effet de zoom (scale 1.02) au survol
 * - Ombre portée au survol
 * - Overlay semi-transparent au survol
 * 
 * @param {Object} props - Props du composant
 * @param {Object} props.config - Configuration du panel contenant :
 *                                - {string} id - Identifiant unique
 *                                - {string} title - Titre principal du panel
 *                                - {string} subtitle - Sous-titre/description
 *                                - {string} color - Couleur principale (hex)
 *                                - {string} gradient - Gradient CSS complet
 *                                - {string} gridArea - Position dans la grille CSS
 *                                - {string} size - Taille ('large'|'medium'|'wide')
 * @param {boolean} props.isActive - Indique si le panel est actuellement actif
 * @param {Function} props.onClick - Handler appelé au clic sur le panel
 * @param {React.ReactNode} props.children - Contenu personnalisé du panel
 * 
 * @returns {React.Component} Panneau de navigation interactif
 * 
 * @example
 * const config = {
 *   id: 'domains',
 *   title: 'Domaines',
 *   subtitle: 'Répartition disciplinaire',
 *   gradient: 'linear-gradient(135deg, #553C9A 0%, #6B46C1 100%)',
 *   gridArea: '1 / 2 / 2 / 3',
 *   size: 'medium'
 * };
 * 
 * <NavigationPanel
 *   config={config}
 *   isActive={activeView === 'domains'}
 *   onClick={() => setActiveView('domains')}
 * >
 *   <p>Contenu personnalisé du panel</p>
 * </NavigationPanel>
 * 
 * @example
 * // Panel large (Vue d'ensemble)
 * <NavigationPanel
 *   config={{ ...config, size: 'large' }}
 *   isActive={false}
 *   onClick={handleClick}
 * >
 *   <StatisticsSummary />
 * </NavigationPanel>
 */
const NavigationPanel = ({ config, isActive, onClick, children, style = {} }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  // Utiliser la couleur de texte personnalisée ou blanc pur par défaut pour meilleur contraste
  const textColor = config.textColor || '#FFFFFF';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
	style={{
	  gridArea: config.gridArea,
	  background: config.gradient,
	  color: textColor,
	  padding: config.size === 'large' ? '3rem' : config.size === 'wide' ? '2rem' : '2rem',
	  cursor: 'pointer',
	  transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms ease',
	  position: 'relative',
	  overflow: 'hidden',
	  border: isActive ? '2px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.2)',
	  transform: isHovered ? 'scale(1.01)' : 'scale(1)',
	  boxShadow: isHovered
	    ? '0 4px 12px rgba(92, 51, 23, 0.2)'
	    : '0 2px 6px rgba(92, 51, 23, 0.12)',
	  zIndex: isHovered ? 10 : 1,
	  borderRadius: '6px',
	  ...style  // Permet d'override les styles par défaut
	}}
    >
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: config.size === 'large' ? 'center' : config.size === 'wide' ? 'center' : 'flex-start'
      }}>
        <div style={{
          fontSize: '1.05rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.95,
          marginBottom: '0.5rem',
          fontFamily: visualTheme.typography.fontFamily.secondary,
          color: textColor
        }}>
          {t(`concordance.panels.${config.id}.subtitle`)}
        </div>

        <h3 style={{
          fontSize: config.size === 'large' ? '2.5rem' : config.size === 'wide' ? '1.9rem' : '1.6rem',
          fontWeight: '500',
          marginBottom: '1rem',
          fontFamily: visualTheme.typography.fontFamily.heading,
          color: textColor
        }}>
          {t(`concordance.panels.${config.id}.title`)}
        </h3>

        {children}
      </div>

      {isHovered && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.05)',  // Overlay très subtil (académique)
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
};

export default NavigationPanel;
