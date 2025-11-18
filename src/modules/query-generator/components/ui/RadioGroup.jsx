/**
 * Groupe de boutons radio avec styling médiéval
 * @module query-generator/components/ui
 */

import React from 'react';
import { globalTheme } from '@shared/theme/globalTheme';

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
    <div style={styles.container}>
      {label && <div style={styles.label}>{label}</div>}

      <div style={{
        ...styles.optionsContainer,
        ...(inline && styles.optionsContainerInline)
      }}>
        {options.map((option) => (
          <label key={option.value} style={{
            ...styles.option,
            ...(inline && styles.optionInline)
          }}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              style={styles.radio}
            />
            <span style={styles.optionLabel}>
              {option.label}
              {option.description && (
                <span style={styles.description}> - {option.description}</span>
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
    <label style={styles.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={styles.checkbox}
      />
      <span style={styles.checkboxLabel}>{label}</span>
    </label>
  );
};

const styles = {
  container: {
    marginBottom: globalTheme.spacing.lg
  },

  label: {
    display: 'block',
    marginBottom: globalTheme.spacing.md,
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.md,
    fontWeight: globalTheme.typography.weight.semibold,
    color: globalTheme.palettes.concordance.primary.light,
    letterSpacing: '0.01em'
  },

  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: globalTheme.spacing.md
  },

  optionsContainerInline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: globalTheme.spacing.lg
  },

  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: globalTheme.spacing.sm,
    cursor: 'pointer',
    padding: globalTheme.spacing.md,
    borderRadius: globalTheme.borderRadius.md,
    transition: globalTheme.transitions.fast,
    background: 'transparent',

    ':hover': {
      background: globalTheme.colors.background.hover
    }
  },

  optionInline: {
    padding: `${globalTheme.spacing.sm} ${globalTheme.spacing.md}`,
    alignItems: 'center'
  },

  radio: {
    width: '18px',
    height: '18px',
    marginTop: '2px',
    accentColor: globalTheme.palettes.concordance.primary.blue,
    cursor: 'pointer'
  },

  optionLabel: {
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.md,
    color: globalTheme.colors.text.dark,
    lineHeight: '1.5'
  },

  description: {
    color: globalTheme.colors.text.muted,
    fontSize: globalTheme.typography.size.sm,
    fontStyle: 'italic'
  },

  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: globalTheme.spacing.sm,
    cursor: 'pointer',
    padding: globalTheme.spacing.md,
    borderRadius: globalTheme.borderRadius.md,
    transition: globalTheme.transitions.fast,
    marginBottom: globalTheme.spacing.md,

    ':hover': {
      background: globalTheme.colors.background.hover
    }
  },

  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: globalTheme.palettes.concordance.primary.blue,
    cursor: 'pointer'
  },

  checkboxLabel: {
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.md,
    color: globalTheme.colors.text.dark,
    fontWeight: globalTheme.typography.weight.normal
  }
};

export default RadioGroup;
