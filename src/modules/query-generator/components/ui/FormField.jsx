/**
 * Champ de formulaire réutilisable avec label
 * @module query-generator/components/ui
 */

import React from 'react';
import styles from './FormField.module.css';

/**
 * FormField - Champ de formulaire universel
 * @param {Object} props
 * @param {string} props.label - Label du champ
 * @param {string} props.type - Type d'input ('text', 'number', 'select', 'textarea')
 * @param {string} props.value - Valeur actuelle
 * @param {function} props.onChange - Callback de changement
 * @param {string} props.placeholder - Placeholder
 * @param {Array} props.options - Options pour select (array d'objets {value, label})
 * @param {string} props.helpText - Texte d'aide
 * @param {number} props.min - Min pour number
 * @param {number} props.max - Max pour number
 * @param {boolean} props.required - Champ requis ?
 */
const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  options = [],
  helpText = '',
  min,
  max,
  required = false,
  rows = 3
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={handleChange}
            className={styles.input}
            required={required}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`${styles.input} ${styles.textarea}`}
            required={required}
            rows={rows}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={styles.input}
            min={min}
            max={max}
            required={required}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={styles.input}
            required={required}
          />
        );
    }
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      {renderInput()}
      {helpText && <div className={styles.helpText}>{helpText}</div>}
    </div>
  );
};

export default FormField;
