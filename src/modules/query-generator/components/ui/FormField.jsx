/**
 * Champ de formulaire réutilisable avec label
 * @module query-generator/components/ui
 */

import React from 'react';
import { globalTheme } from '@shared/theme/globalTheme';

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
            style={styles.input}
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
            style={{ ...styles.input, ...styles.textarea }}
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
            style={styles.input}
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
            style={styles.input}
            required={required}
          />
        );
    }
  };

  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>
      {renderInput()}
      {helpText && <div style={styles.helpText}>{helpText}</div>}
    </div>
  );
};

const styles = {
  field: {
    marginBottom: globalTheme.spacing.lg
  },

  label: {
    display: 'block',
    marginBottom: globalTheme.spacing.sm,
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.md,
    fontWeight: globalTheme.typography.weight.semibold,
    color: globalTheme.palettes.concordance.primary.light,
    letterSpacing: '0.01em'
  },

  required: {
    color: globalTheme.palettes.concordance.accent.red
  },

  input: {
    width: '100%',
    padding: `${globalTheme.spacing.md} ${globalTheme.spacing.lg}`,
    border: `2px solid ${globalTheme.colors.border.light}`,
    borderRadius: globalTheme.borderRadius.md,
    fontSize: globalTheme.typography.size.md,
    fontFamily: globalTheme.typography.fontFamily.secondary,
    background: '#FFFEF7',
    color: globalTheme.colors.text.dark,
    transition: globalTheme.transitions.normal,
    outline: 'none',

    ':focus': {
      borderColor: globalTheme.palettes.concordance.primary.blue,
      background: '#FFFFFF',
      boxShadow: `0 0 0 3px rgba(30, 64, 175, 0.1)`
    }
  },

  textarea: {
    resize: 'vertical',
    minHeight: '60px',
    lineHeight: '1.5'
  },

  helpText: {
    marginTop: globalTheme.spacing.xs,
    fontSize: globalTheme.typography.size.sm,
    color: globalTheme.colors.text.muted,
    fontStyle: 'italic'
  }
};

export default FormField;
