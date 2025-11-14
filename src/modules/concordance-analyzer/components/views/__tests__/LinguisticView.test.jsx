import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import LinguisticView from '../LinguisticView';

// ============================================================================
// DONNÉES MOCK
// ============================================================================

const mockFilteredData = [
  {
    id: 1,
    reference: 'Edi-25, Summa, 1194, 53',
    author: 'Anonyme',
    title: 'Summa Induent',
    domain: 'Droit canonique',
    period: '1194',
    place: 'France',
    left: 'contexte gauche',
    kwic: 'terme',
    right: 'contexte droit'
  },
  {
    id: 2,
    reference: 'Edi-26, Decretum, 1140, 42',
    author: 'Gratien',
    title: 'Decretum',
    domain: 'Droit canon',
    period: '1140',
    place: 'Italie',
    left: 'autre contexte',
    kwic: 'mot',
    right: 'suite'
  }
];

const mockAnalytics = {
  total: 150,
  domains: [
    { name: 'Droit canonique', value: 80 },
    { name: 'Droit romain', value: 40 }
  ],
  authors: [
    { name: 'Gratien', value: 50 },
    { name: 'Anonyme', value: 100 }
  ],
  periods: [
    { period: 1100, count: 20 },
    { period: 1150, count: 30 }
  ],
  places: [
    { name: 'France', value: 80 },
    { name: 'Italie', value: 70 }
  ],
  keyTerms: [
    { term: 'canonicus', count: 50 },
    { term: 'ecclesia', count: 40 },
    { term: 'episcopus', count: 30 }
  ]
};

const mockEmptyAnalytics = {
  total: 0,
  domains: [],
  authors: [],
  periods: [],
  places: [],
  keyTerms: []
};

// ============================================================================
// TESTS : RENDU DE BASE
// ============================================================================

describe('LinguisticView - Rendu de base', () => {
  it('devrait rendre le composant sans erreur', () => {
    const { container } = render(
      <LinguisticView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait afficher le titre de la section', () => {
    render(
      <LinguisticView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    expect(screen.getByText(/Analyse terminologique/i)).toBeInTheDocument();
  });

  it('devrait rendre le graphique', () => {
    const { container } = render(
      <LinguisticView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    // Le chart est rendu (BarChart custom)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : BOUTONS D'EXPORT
// ============================================================================

describe('LinguisticView - Boutons d\'export', () => {
  it('devrait afficher les boutons d\'export', () => {
    render(
      <LinguisticView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    expect(screen.getByText(/Export concordances CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/Export analytics JSON/i)).toBeInTheDocument();
  });

  it('devrait appeler onExportConcordances au clic', async () => {
    const mockExport = jest.fn();
    const user = userEvent.setup();
    
    render(
      <LinguisticView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={mockExport}
        onExportAnalytics={jest.fn()}
      />
    );
    
    const exportButton = screen.getByText(/Export concordances CSV/i);
    await user.click(exportButton);
    
    expect(mockExport).toHaveBeenCalledTimes(1);
  });

  it('devrait appeler onExportAnalytics au clic', async () => {
    const mockExport = jest.fn();
    const user = userEvent.setup();
    
    render(
      <LinguisticView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={mockExport}
      />
    );
    
    const exportButton = screen.getByText(/Export analytics JSON/i);
    await user.click(exportButton);
    
    expect(mockExport).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// TESTS : DONNÉES VIDES
// ============================================================================

describe('LinguisticView - Données vides', () => {
  it('devrait afficher un message si pas de termes-clés', () => {
    render(
      <LinguisticView
        filteredData={[]}
        analytics={mockEmptyAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    expect(screen.getByText(/Aucune donnée terminologique disponible/i)).toBeInTheDocument();
  });

  it('devrait gérer des données filtrées vides', () => {
    const { container } = render(
      <LinguisticView
        filteredData={[]}
        analytics={mockEmptyAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer des analytics vides', () => {
    const { container } = render(
      <LinguisticView
        filteredData={mockFilteredData}
        analytics={mockEmptyAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : PROPS REQUISES
// ============================================================================

describe('LinguisticView - Props requises', () => {
  it('devrait accepter toutes les props requises', () => {
    const { container } = render(
      <LinguisticView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait fonctionner avec des callbacks vides', () => {
    const { container } = render(
      <LinguisticView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={() => {}}
        onExportAnalytics={() => {}}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
