import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import AuthorsView from '../AuthorsView';

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
    { name: 'Anonyme', value: 100 },
    { name: 'Yves de Chartres', value: 30 }
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
    { term: 'ecclesia', count: 40 }
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

describe('AuthorsView - Rendu de base', () => {
  it('devrait rendre le composant sans erreur', () => {
    const { container } = render(
      <AuthorsView
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
      <AuthorsView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    expect(screen.getByText(/Distribution par auteurs/i)).toBeInTheDocument();
  });

  it('devrait rendre le graphique', () => {
    const { container } = render(
      <AuthorsView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    // Le chart est rendu (AuthorChart)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : BOUTONS D'EXPORT
// ============================================================================

describe('AuthorsView - Boutons d\'export', () => {
  it('devrait afficher les boutons d\'export', () => {
    render(
      <AuthorsView
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
      <AuthorsView
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
      <AuthorsView
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

describe('AuthorsView - Données vides', () => {
  it('devrait gérer des données filtrées vides', () => {
    const { container } = render(
      <AuthorsView
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
      <AuthorsView
        filteredData={mockFilteredData}
        analytics={mockEmptyAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait désactiver les boutons export si pas de données', () => {
    render(
      <AuthorsView
        filteredData={[]}
        analytics={mockEmptyAnalytics}
        onExportConcordances={jest.fn()}
        onExportAnalytics={jest.fn()}
      />
    );
    
    const exportButtons = screen.getAllByRole('button');
    exportButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});

// ============================================================================
// TESTS : PROPS REQUISES
// ============================================================================

describe('AuthorsView - Props requises', () => {
  it('devrait accepter toutes les props requises', () => {
    const { container } = render(
      <AuthorsView
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
      <AuthorsView
        filteredData={mockFilteredData}
        analytics={mockAnalytics}
        onExportConcordances={() => {}}
        onExportAnalytics={() => {}}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
