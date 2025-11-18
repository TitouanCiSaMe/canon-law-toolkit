/**
 * Boîte d'information avec style médiéval
 * @module query-generator/components/ui
 */

import React from 'react';
import { Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import styles from './InfoBox.module.css';

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

  const getTypeClasses = () => {
    const typeMap = {
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      info: 'Info'
    };
    const suffix = typeMap[type] || 'Info';
    return {
      box: styles[`box${suffix}`],
      icon: styles[`icon${suffix}`],
      title: styles[`title${suffix}`],
      content: styles[`content${suffix}`]
    };
  };

  const typeClasses = getTypeClasses();

  return (
    <div className={`${styles.box} ${typeClasses.box}`}>
      <div className={styles.header}>
        <div className={`${styles.icon} ${typeClasses.icon}`}>
          {getIcon()}
        </div>
        {title && (
          <h4 className={`${styles.title} ${typeClasses.title}`}>
            {title}
          </h4>
        )}
      </div>

      <div className={`${styles.content} ${typeClasses.content}`}>
        {children}
      </div>
    </div>
  );
};

export default InfoBox;
