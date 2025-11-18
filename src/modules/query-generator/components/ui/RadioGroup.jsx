/**
 * Groupe de boutons radio avec styling médiéval
 * @module query-generator/components/ui
 */

import React from 'react';
import styles from './RadioGroup.module.css';

/**
 * RadioGroup - Groupe de boutons radio stylisés
 * @param {Object} props
 * @param {string} props.label - Label du groupe
 * @param {string} props.value - Valeur sélectionnée
 * @param {function} props.onChange - Callback de changement
 * @param {Array} props.options - Options [{value, label, description}]
 * @param {string} props.name - Nom du groupe radio
 * @param {boolean} props.inline - Afficher les options en ligne (par défaut: false)
 */
const RadioGroup = ({ label, value, onChange, options, name, inline = false }) => {
  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}

      <div className={`${styles.optionsContainer} ${inline ? styles.optionsContainerInline : ''}`}>
        {options.map((option) => (
          <label key={option.value} className={`${styles.option} ${inline ? styles.optionInline : ''}`}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className={styles.radio}
            />
            <span className={styles.optionLabel}>
              {option.label}
              {option.description && (
                <span className={styles.description}> - {option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

/**
 * Checkbox - Case à cocher simple
 */
export const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.checkbox}
      />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  );
};

export default RadioGroup;
