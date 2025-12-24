/**
 * Composant NavigationPanel - Panneau de navigation cliquable
 *
 * Affiche un panneau avec gradient, titre, et contenu personnalisé.
 * Gère automatiquement les états hover et actif avec animations CSS.
 * Utilisé principalement dans la vue d'ensemble (OverviewView) pour créer
 * une grille de panels interactifs.
 *
 * Utilise les variables CSS du thème global (injectées via injectCSSVariables).
 *
 * @module components/ui/NavigationPanel
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { globalTheme } from '@shared/theme/globalTheme';

// Constantes de spacing basées sur le thème
const PANEL_SPACING = {
  large: globalTheme.spacing.lg,    // 1.5rem
  wide: `${globalTheme.spacing.xs} ${globalTheme.spacing.md}`,  // 0.5rem 1rem (compact verticalement)
  medium: globalTheme.spacing.md    // 1rem
};

/**
 * Composant panneau de navigation interactif
 *
 * @param {Object} props - Props du composant
 * @param {Object} props.config - Configuration du panel
 * @param {boolean} props.isActive - Indique si le panel est actuellement actif
 * @param {Function} props.onClick - Handler appelé au clic sur le panel
 * @param {React.ReactNode} props.children - Contenu personnalisé du panel
 * @param {Object} props.style - Styles additionnels à appliquer
 *
 * @returns {React.Component} Panneau de navigation interactif
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
        padding: PANEL_SPACING[config.size] || PANEL_SPACING.medium,
        cursor: 'pointer',
        transition: `transform ${globalTheme.transitions.slow}, box-shadow ${globalTheme.transitions.normal}`,
        position: 'relative',
        overflow: 'hidden',
        border: isActive
          ? `2px solid ${globalTheme.colors.secondary.dark}`
          : '1px solid rgba(212, 175, 55, 0.2)',
        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
        boxShadow: isHovered
          ? globalTheme.shadows.elevated
          : globalTheme.shadows.panel,
        zIndex: isHovered ? globalTheme.zIndex.dropdown : globalTheme.zIndex.base,
        borderRadius: globalTheme.borderRadius.md,
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
          fontSize: globalTheme.typography.size.md,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.95,
          marginBottom: globalTheme.spacing.xs,
          fontFamily: globalTheme.typography.fontFamily.secondary,
          color: textColor
        }}>
          {t(`concordance.panels.${config.id}.subtitle`)}
        </div>

        <h3 style={{
          fontSize: config.size === 'large'
            ? globalTheme.typography.heading.h2.fontSize
            : config.size === 'wide'
              ? globalTheme.typography.heading.h3.fontSize
              : globalTheme.typography.heading.h4.fontSize,
          fontWeight: globalTheme.typography.weight.medium,
          marginBottom: globalTheme.spacing.xs,
          fontFamily: globalTheme.typography.fontFamily.heading,
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
