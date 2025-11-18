/**
 * Boîte d'information avec style médiéval
 * @module query-generator/components/ui
 */

import React from 'react';
import { Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { globalTheme } from '@shared/theme/globalTheme';

/**
 * InfoBox - Affiche un message d'information stylisé
 * @param {Object} props
 * @param {string} props.type - Type de message ('info', 'warning', 'success', 'error')
 * @param {string} props.title - Titre de la boîte
 * @param {string|React.ReactNode} props.children - Contenu
 * @param {string} props.icon - Icône personnalisée (optionnel)
 */
const InfoBox = ({ type = 'info', title, children, icon }) => {
  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #DFF0D8 0%, #D4EDDA 100%)',
          border: '#C3E6CB',
          color: '#155724',
          iconColor: '#28A745'
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #FFF3CD 0%, #FCF8E3 100%)',
          border: '#FFEEBA',
          color: '#856404',
          iconColor: '#FFC107'
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, #F8D7DA 0%, #F5C6CB 100%)',
          border: '#F5C6CB',
          color: '#721C24',
          iconColor: '#DC3545'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #DDD6B8 0%, #E6D7B8 100%)',
          border: globalTheme.colors.border.light,
          color: globalTheme.colors.text.dark,
          iconColor: globalTheme.palettes.concordance.primary.blue
        };
    }
  };

  const colors = getColor();

  return (
    <div style={{
      ...styles.box,
      background: colors.background,
      border: `2px solid ${colors.border}`,
      borderLeft: `5px solid ${colors.iconColor}`
    }}>
      <div style={styles.header}>
        <div style={{ ...styles.icon, color: colors.iconColor }}>
          {getIcon()}
        </div>
        {title && (
          <h4 style={{ ...styles.title, color: colors.color }}>
            {title}
          </h4>
        )}
      </div>

      <div style={{ ...styles.content, color: colors.color }}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  box: {
    padding: globalTheme.spacing.lg,
    borderRadius: globalTheme.borderRadius.md,
    marginBottom: globalTheme.spacing.lg
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: globalTheme.spacing.sm,
    marginBottom: globalTheme.spacing.sm
  },

  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  title: {
    fontSize: globalTheme.typography.size.md,
    fontWeight: globalTheme.typography.weight.semibold,
    marginBottom: 0
  },

  content: {
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.md,
    lineHeight: '1.6',
    paddingLeft: `calc(20px + ${globalTheme.spacing.sm})`
  }
};

export default InfoBox;
