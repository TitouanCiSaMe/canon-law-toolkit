/**
 * Tests unitaires pour le composant FormField
 *
 * Teste :
 * - Le rendu des différents types de champs
 * - Les états et interactions
 * - La validation et gestion des props
 * - Les cas limites
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormField from '../FormField';

// ============================================================================
// TESTS DE RENDU DE BASE
// ============================================================================

describe('FormField - Rendu de base', () => {

  it('devrait rendre un champ texte par défaut', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Test Label"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('devrait rendre un champ number', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Distance"
        type="number"
        value="10"
        onChange={mockOnChange}
        min={0}
        max={100}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('devrait rendre un select', () => {
    const mockOnChange = jest.fn();
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];

    render(
      <FormField
        label="Select Label"
        type="select"
        value="option1"
        onChange={mockOnChange}
        options={options}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('devrait rendre un textarea', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Description"
        type="textarea"
        value=""
        onChange={mockOnChange}
        rows={5}
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('devrait afficher le placeholder', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Test"
        value=""
        onChange={mockOnChange}
        placeholder="Enter text here"
      />
    );

    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('devrait afficher le texte d\'aide', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Test"
        value=""
        onChange={mockOnChange}
        helpText="This is help text"
      />
    );

    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('devrait afficher l\'indicateur requis', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Required Field"
        value=""
        onChange={mockOnChange}
        required={true}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });
});

// ============================================================================
// TESTS DES INTERACTIONS
// ============================================================================

describe('FormField - Interactions', () => {

  it('devrait appeler onChange quand la valeur change (input text)', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Test"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('devrait appeler onChange quand la valeur change (input number)', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Distance"
        type="number"
        value="10"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '20' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('20');
  });

  it('devrait appeler onChange quand la sélection change (select)', () => {
    const mockOnChange = jest.fn();
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];

    render(
      <FormField
        label="Select"
        type="select"
        value="option1"
        onChange={mockOnChange}
        options={options}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('devrait appeler onChange quand le texte change (textarea)', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Description"
        type="textarea"
        value=""
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'new description' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('new description');
  });

  it('devrait afficher la valeur actuelle', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Test"
        value="current value"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('current value');
  });
});

// ============================================================================
// TESTS DES CAS LIMITES
// ============================================================================

describe('FormField - Cas limites', () => {

  it('devrait gérer une valeur vide', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Test"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('devrait gérer l\'absence de helpText', () => {
    const mockOnChange = jest.fn();

    expect(() => {
      render(
        <FormField
          label="Test"
          value=""
          onChange={mockOnChange}
        />
      );
    }).not.toThrow();
  });

  it('devrait gérer un select sans options', () => {
    const mockOnChange = jest.fn();

    expect(() => {
      render(
        <FormField
          label="Select"
          type="select"
          value=""
          onChange={mockOnChange}
          options={[]}
        />
      );
    }).not.toThrow();
  });

  it('devrait utiliser rows par défaut pour textarea', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Description"
        type="textarea"
        value=""
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '3'); // Valeur par défaut
  });

  it('devrait gérer un type invalide comme texte', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Test"
        type="invalid"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('ne devrait pas afficher l\'indicateur requis si required=false', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Optional Field"
        value=""
        onChange={mockOnChange}
        required={false}
      />
    );

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DE VALIDATION
// ============================================================================

describe('FormField - Validation', () => {

  it('devrait appliquer les contraintes min/max sur number', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Distance"
        type="number"
        value="50"
        onChange={mockOnChange}
        min={0}
        max={100}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('devrait marquer le champ comme requis', () => {
    const mockOnChange = jest.fn();

    render(
      <FormField
        label="Required"
        value=""
        onChange={mockOnChange}
        required={true}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });
});
