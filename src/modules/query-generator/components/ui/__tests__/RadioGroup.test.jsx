/**
 * Tests unitaires pour les composants RadioGroup et Checkbox
 *
 * Teste :
 * - Le rendu des groupes de radio buttons
 * - Le rendu des checkboxes
 * - Les états checked/unchecked
 * - Les interactions utilisateur
 * - Les modes inline/column
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RadioGroup, { Checkbox } from '../RadioGroup';

// ============================================================================
// TESTS RADIOGROUP - RENDU DE BASE
// ============================================================================

describe('RadioGroup - Rendu de base', () => {

  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2', description: 'Description 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  it('devrait rendre le groupe de radio buttons', () => {
    const mockOnChange = jest.fn();

    render(
      <RadioGroup
        label="Test Group"
        value="option1"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('devrait rendre sans label si non fourni', () => {
    const mockOnChange = jest.fn();

    render(
      <RadioGroup
        value="option1"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    expect(screen.queryByText('Test Group')).not.toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('devrait afficher les descriptions si fournies', () => {
    const mockOnChange = jest.fn();

    render(
      <RadioGroup
        label="Test Group"
        value="option1"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    expect(screen.getByText(/Description 2/)).toBeInTheDocument();
  });

  it('devrait rendre tous les radio buttons', () => {
    const mockOnChange = jest.fn();

    render(
      <RadioGroup
        value="option1"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('devrait cocher le radio button sélectionné', () => {
    const mockOnChange = jest.fn();

    render(
      <RadioGroup
        value="option2"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });
});

// ============================================================================
// TESTS RADIOGROUP - INTERACTIONS
// ============================================================================

describe('RadioGroup - Interactions', () => {

  const mockOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'medium', label: 'Medium' },
    { value: 'complex', label: 'Complex' }
  ];

  it('devrait appeler onChange quand un radio est sélectionné', () => {
    const mockOnChange = jest.fn();

    render(
      <RadioGroup
        value="simple"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    const mediumRadio = screen.getByLabelText(/Medium/);
    fireEvent.click(mediumRadio);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('medium');
  });

  it('devrait passer la nouvelle valeur à onChange', () => {
    const mockOnChange = jest.fn();

    render(
      <RadioGroup
        value="simple"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    const complexRadio = screen.getByLabelText(/Complex/);
    fireEvent.click(complexRadio);

    expect(mockOnChange).toHaveBeenCalledWith('complex');
  });

  it('devrait permettre de changer de sélection', () => {
    const mockOnChange = jest.fn();
    const { rerender } = render(
      <RadioGroup
        value="simple"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    // Sélectionner medium
    const mediumRadio = screen.getByLabelText(/Medium/);
    fireEvent.click(mediumRadio);

    // Rerender avec nouvelle valeur
    rerender(
      <RadioGroup
        value="medium"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });
});

// ============================================================================
// TESTS RADIOGROUP - MODES INLINE/COLUMN
// ============================================================================

describe('RadioGroup - Modes d\'affichage', () => {

  const mockOptions = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
  ];

  it('devrait rendre en mode column par défaut', () => {
    const mockOnChange = jest.fn();

    const { container } = render(
      <RadioGroup
        value="opt1"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
      />
    );

    // Le container devrait utiliser flexDirection: column par défaut
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre en mode inline si spécifié', () => {
    const mockOnChange = jest.fn();

    const { container } = render(
      <RadioGroup
        value="opt1"
        onChange={mockOnChange}
        options={mockOptions}
        name="test-radio"
        inline={true}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS RADIOGROUP - CAS LIMITES
// ============================================================================

describe('RadioGroup - Cas limites', () => {

  it('devrait gérer un tableau d\'options vide', () => {
    const mockOnChange = jest.fn();

    expect(() => {
      render(
        <RadioGroup
          value=""
          onChange={mockOnChange}
          options={[]}
          name="test-radio"
        />
      );
    }).not.toThrow();
  });

  it('devrait gérer une option sans description', () => {
    const mockOnChange = jest.fn();
    const options = [{ value: 'opt1', label: 'Option 1' }];

    expect(() => {
      render(
        <RadioGroup
          value="opt1"
          onChange={mockOnChange}
          options={options}
          name="test-radio"
        />
      );
    }).not.toThrow();
  });

  it('devrait avoir le même attribut name pour tous les radios', () => {
    const mockOnChange = jest.fn();
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' }
    ];

    render(
      <RadioGroup
        value="opt1"
        onChange={mockOnChange}
        options={options}
        name="my-group"
      />
    );

    const radios = screen.getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('name', 'my-group');
    });
  });
});

// ============================================================================
// TESTS CHECKBOX - RENDU DE BASE
// ============================================================================

describe('Checkbox - Rendu de base', () => {

  it('devrait rendre une checkbox', () => {
    const mockOnChange = jest.fn();

    render(
      <Checkbox
        label="Accept terms"
        checked={false}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Accept terms')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('devrait rendre une checkbox cochée', () => {
    const mockOnChange = jest.fn();

    render(
      <Checkbox
        label="Accept terms"
        checked={true}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('devrait rendre une checkbox non cochée', () => {
    const mockOnChange = jest.fn();

    render(
      <Checkbox
        label="Accept terms"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
});

// ============================================================================
// TESTS CHECKBOX - INTERACTIONS
// ============================================================================

describe('Checkbox - Interactions', () => {

  it('devrait appeler onChange avec true quand cochée', () => {
    const mockOnChange = jest.fn();

    render(
      <Checkbox
        label="Bidirectional"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('devrait appeler onChange avec false quand décochée', () => {
    const mockOnChange = jest.fn();

    render(
      <Checkbox
        label="Bidirectional"
        checked={true}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('devrait permettre de cliquer sur le label', () => {
    const mockOnChange = jest.fn();

    render(
      <Checkbox
        label="Click me"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const label = screen.getByText('Click me');
    fireEvent.click(label);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// TESTS CHECKBOX - CAS LIMITES
// ============================================================================

describe('Checkbox - Cas limites', () => {

  it('devrait gérer un label vide', () => {
    const mockOnChange = jest.fn();

    expect(() => {
      render(
        <Checkbox
          label=""
          checked={false}
          onChange={mockOnChange}
        />
      );
    }).not.toThrow();
  });

  it('devrait basculer plusieurs fois', () => {
    const mockOnChange = jest.fn();

    const { rerender } = render(
      <Checkbox
        label="Toggle"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    rerender(
      <Checkbox
        label="Toggle"
        checked={true}
        onChange={mockOnChange}
      />
    );
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    rerender(
      <Checkbox
        label="Toggle"
        checked={false}
        onChange={mockOnChange}
      />
    );
    expect(checkbox).not.toBeChecked();
  });
});
