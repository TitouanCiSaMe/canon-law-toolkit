/**
 * Tests unitaires pour le composant ExportButtons
 * 
 * Teste :
 * - Le rendu des boutons d'export
 * - Les états disabled/enabled
 * - Les callbacks onClick
 * - Les états hover
 * - La gestion des props
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExportButtons from '../ExportButtons';

// ============================================================================
// MOCKS ET DONNÉES DE TEST
// ============================================================================

const mockFilteredData = [
  {
    id: 1,
    reference: 'Edi-25, Test, 1194, 53',
    author: 'Auteur Test',
    title: 'Titre Test',
    period: '1194',
    domain: 'Droit canon',
    place: 'France',
    left: 'contexte gauche',
    kwic: 'terme',
    right: 'contexte droit'
  },
  {
    id: 2,
    reference: 'Edi-26, Test2, 1195, 54',
    author: 'Auteur Test 2',
    title: 'Titre Test 2',
    period: '1195',
    domain: 'Droit civil',
    place: 'Italie',
    left: 'contexte gauche 2',
    kwic: 'terme2',
    right: 'contexte droit 2'
  }
];

const mockAnalytics = {
  total: 2,
  domains: [
    { name: 'Droit canon', value: 1 },
    { name: 'Droit civil', value: 1 }
  ],
  authors: [
    { name: 'Auteur Test', value: 1 },
    { name: 'Auteur Test 2', value: 1 }
  ],
  periods: [
    { period: 1194, count: 1 },
    { period: 1195, count: 1 }
  ],
  places: [
    { name: 'France', value: 1 },
    { name: 'Italie', value: 1 }
  ],
  keyTerms: [
    { term: 'terme', count: 1 },
    { term: 'terme2', count: 1 }
  ]
};

// ============================================================================
// TESTS DE RENDU DE BASE
// ============================================================================

describe('ExportButtons - Rendu de base', () => {
  
  it('devrait rendre le composant sans erreur', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    expect(screen.getByText(/Export concordances CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/Export analytics JSON/i)).toBeInTheDocument();
  });

  it('devrait afficher le bouton Export concordances CSV', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    const button = screen.getByText(/Export concordances CSV/i);
    expect(button).toBeInTheDocument();
  });

  it('devrait afficher le bouton Export analytics JSON', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    const button = screen.getByText(/Export analytics JSON/i);
    expect(button).toBeInTheDocument();
  });

  it('devrait afficher le bouton viewType si fourni', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    const mockOnExportViewCSV = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        viewType="domains"
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
        onExportViewCSV={mockOnExportViewCSV}
      />
    );
    
    expect(screen.getByText(/Export domains CSV/i)).toBeInTheDocument();
  });

  it('ne devrait pas afficher le bouton viewType si non fourni', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    expect(screen.queryByText(/Export domains CSV/i)).not.toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES INTERACTIONS
// ============================================================================

describe('ExportButtons - Interactions', () => {
  
  it('devrait appeler onExportConcordances au clic', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    const button = screen.getByText(/Export concordances CSV/i);
    fireEvent.click(button);
    
    expect(mockOnExportConcordances).toHaveBeenCalledTimes(1);
  });

  it('devrait appeler onExportAnalytics au clic', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    const button = screen.getByText(/Export analytics JSON/i);
    fireEvent.click(button);
    
    expect(mockOnExportAnalytics).toHaveBeenCalledTimes(1);
  });

  it('devrait appeler onExportViewCSV avec viewType au clic', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    const mockOnExportViewCSV = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        viewType="domains"
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
        onExportViewCSV={mockOnExportViewCSV}
      />
    );
    
    const button = screen.getByText(/Export domains CSV/i);
    fireEvent.click(button);
    
    expect(mockOnExportViewCSV).toHaveBeenCalledTimes(1);
    expect(mockOnExportViewCSV).toHaveBeenCalledWith('domains');
  });
});

// ============================================================================
// TESTS DES ÉTATS DISABLED
// ============================================================================

describe('ExportButtons - États disabled', () => {
  
  it('devrait désactiver les boutons si filteredData est vide', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={[]}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    const buttonConcordances = screen.getByText(/Export concordances CSV/i);
    const buttonAnalytics = screen.getByText(/Export analytics JSON/i);
    
    expect(buttonConcordances).toBeDisabled();
    expect(buttonAnalytics).toBeDisabled();
  });

  it('devrait désactiver les boutons si filteredData est null', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={null}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    const buttonConcordances = screen.getByText(/Export concordances CSV/i);
    const buttonAnalytics = screen.getByText(/Export analytics JSON/i);
    
    expect(buttonConcordances).toBeDisabled();
    expect(buttonAnalytics).toBeDisabled();
  });

  it('devrait activer les boutons si filteredData contient des données', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    const buttonConcordances = screen.getByText(/Export concordances CSV/i);
    const buttonAnalytics = screen.getByText(/Export analytics JSON/i);
    
    expect(buttonConcordances).not.toBeDisabled();
    expect(buttonAnalytics).not.toBeDisabled();
  });

  it('ne devrait pas appeler onClick si bouton disabled', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    render(
      <ExportButtons
        filteredData={[]}
        analytics={mockAnalytics}
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
      />
    );
    
    const button = screen.getByText(/Export concordances CSV/i);
    fireEvent.click(button);
    
    expect(mockOnExportConcordances).not.toHaveBeenCalled();
  });
});

// ============================================================================
// TESTS DE CAS LIMITES
// ============================================================================

describe('ExportButtons - Cas limites', () => {
  
  it('devrait gérer l\'absence de viewType gracieusement', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    expect(() => {
      render(
        <ExportButtons
          filteredData={mockFilteredData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
          viewType={undefined}
        />
      );
    }).not.toThrow();
  });

  it('devrait gérer l\'absence de onExportViewCSV gracieusement', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    
    expect(() => {
      render(
        <ExportButtons
          filteredData={mockFilteredData}
          analytics={mockAnalytics}
          viewType="domains"
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
          onExportViewCSV={undefined}
        />
      );
    }).not.toThrow();
  });

  it('devrait afficher plusieurs boutons en même temps', () => {
    const mockOnExportConcordances = jest.fn();
    const mockOnExportAnalytics = jest.fn();
    const mockOnExportViewCSV = jest.fn();
    
    render(
      <ExportButtons
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        viewType="domains"
        onExportConcordances={mockOnExportConcordances}
        onExportAnalytics={mockOnExportAnalytics}
        onExportViewCSV={mockOnExportViewCSV}
      />
    );
    
    expect(screen.getByText(/Export concordances CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/Export analytics JSON/i)).toBeInTheDocument();
    expect(screen.getByText(/Export domains CSV/i)).toBeInTheDocument();
  });
});
