import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import OverviewView from '../OverviewView';

// ============================================================================
// DONNÉES MOCK
// ============================================================================

const mockPanelConfig = {
  overview: {
    id: 'overview',
    title: 'Vue d\'ensemble',
    subtitle: 'Analyse globale',
    color: '#1A365D',
    gradient: 'linear-gradient(135deg, #1A365D 0%, #2C5282 100%)',
    icon: '📊',
    gridArea: '1 / 1 / 3 / 2',
    size: 'large'
  },
  domains: {
    id: 'domains',
    title: 'Domaines',
    subtitle: 'Répartition disciplinaire',
    color: '#553C9A',
    gradient: 'linear-gradient(135deg, #553C9A 0%, #6B46C1 100%)',
    icon: '📚',
    gridArea: '1 / 2 / 2 / 3',
    size: 'medium'
  },
  temporal: {
    id: 'temporal',
    title: 'Chronologie',
    subtitle: 'Évolution temporelle',
    color: '#744210',
    gradient: 'linear-gradient(135deg, #744210 0%, #92400E 100%)',
    icon: '⏰',
    gridArea: '1 / 3 / 2 / 4',
    size: 'medium'
  },
  authors: {
    id: 'authors',
    title: 'Auteurs',
    subtitle: 'Autorités principales',
    color: '#4A5568',
    gradient: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
    icon: '✍️',
    gridArea: '2 / 2 / 3 / 3',
    size: 'medium'
  },
  linguistic: {
    id: 'linguistic',
    title: 'Terminologie',
    subtitle: 'Lexique spécialisé',
    color: '#065F46',
    gradient: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
    icon: '🔤',
    gridArea: '2 / 3 / 3 / 4',
    size: 'medium'
  },
  data: {
    id: 'data',
    title: 'Données',
    subtitle: 'Concordances détaillées',
    color: '#7C2D12',
    gradient: 'linear-gradient(135deg, #7C2D12 0%, #92400E 100%)',
    icon: '📋',
    gridArea: '2 / 4 / 3 / 5',
    size: 'medium'
  },
  concordances: {
    id: 'concordances',
    title: 'Import',
    subtitle: 'Chargement des données',
    color: '#7C2D12',
    gradient: 'linear-gradient(135deg, #7C2D12 0%, #92400E 100%)',
    icon: '📁',
    gridArea: '3 / 1 / 4 / 5',
    size: 'wide'
  },
  places: {
    id: 'places',
    title: 'Lieux',
    subtitle: 'Répartition géographique',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    icon: '🌍',
    gridArea: '1 / 4 / 2 / 5',
    size: 'medium'
  },
  corpusComparison: {
    id: 'corpusComparison',
    title: 'Comparaison',
    subtitle: 'Analyse comparative',
    color: '#7C2D12',
    gradient: 'linear-gradient(135deg, #7C2D12 0%, #92400E 100%)',
    icon: '⚖️',
    gridArea: '3 / 1 / 4 / 3',
    size: 'wide'
  }
};

const mockAnalytics = {
  total: 342,
  domains: [
    { name: 'Droit canonique', value: 180 },
    { name: 'Droit romain', value: 120 }
  ],
  authors: [
    { name: 'Gratien', value: 150 },
    { name: 'Anonyme', value: 192 }
  ],
  periods: [
    { period: 1100, count: 50 },
    { period: 1150, count: 120 },
    { period: 1200, count: 172 }
  ],
  places: [
    { name: 'France', value: 200 },
    { name: 'Italie', value: 142 }
  ],
  keyTerms: [
    { term: 'canonicus', count: 89 },
    { term: 'ecclesia', count: 76 }
  ]
};

const mockParseStats = {
  totalReferences: 342,
  successfulMatches: 298,
  failedMatches: 44,
  lookupRate: '87.1'
};

const mockFilteredData = [
  { id: 1, author: 'Gratien', kwic: 'terme1' },
  { id: 2, author: 'Anonyme', kwic: 'terme2' }
];

const mockAcademicColors = {
  primary: '#1A365D',
  text: '#2D3748'
};

// ============================================================================
// TESTS : RENDU DE BASE
// ============================================================================

describe('OverviewView - Rendu de base', () => {
  it('devrait rendre le composant sans erreur', () => {
    const { container } = render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait afficher la grille de panels', () => {
    const { container } = render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    // La grille existe
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait afficher le total de concordances', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(screen.getByText('342')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : PANELS INDIVIDUELS
// ============================================================================

describe('OverviewView - Panels individuels', () => {
  it('devrait afficher le panel Domaines', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(screen.getByText('Domaines')).toBeInTheDocument();
  });

  it('devrait afficher le panel Chronologie', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(screen.getByText('Chronologie')).toBeInTheDocument();
  });

  it('devrait afficher le panel Auteurs', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(screen.getByText('Auteurs')).toBeInTheDocument();
  });

  it('devrait afficher le panel Terminologie', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(screen.getByText('Terminologie')).toBeInTheDocument();
  });

  it('devrait afficher le panel Données', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(screen.getByText('Données')).toBeInTheDocument();
  });

  it('devrait afficher le panel Lieux', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(screen.getByText('Lieux')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : STATISTIQUES AFFICHÉES
// ============================================================================

describe('OverviewView - Statistiques affichées', () => {
  it('devrait afficher le taux de correspondance', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    // Peut apparaître plusieurs fois
    expect(screen.getAllByText(/87.1%/).length).toBeGreaterThan(0);
  });

  it('devrait afficher le nombre de domaines', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(screen.getAllByText('2').length).toBeGreaterThan(0); // 2 domaines
  });

  it('devrait afficher le nombre d\'auteurs', () => {
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    // 2 auteurs dans les données
    const allTwos = screen.getAllByText('2');
    expect(allTwos.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// TESTS : NAVIGATION
// ============================================================================

describe('OverviewView - Navigation', () => {
  it('devrait appeler navigateToView au clic sur Domaines', async () => {
    const mockNavigate = jest.fn();
    const user = userEvent.setup();
    
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={mockNavigate}
        academicColors={mockAcademicColors}
      />
    );
    
    const domainsPanel = screen.getByText('Domaines');
    await user.click(domainsPanel);
    
    expect(mockNavigate).toHaveBeenCalledWith('domains');
  });

  it('devrait appeler navigateToView au clic sur Auteurs', async () => {
    const mockNavigate = jest.fn();
    const user = userEvent.setup();
    
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={mockNavigate}
        academicColors={mockAcademicColors}
      />
    );
    
    const auteursPanel = screen.getByText('Auteurs');
    await user.click(auteursPanel);
    
    expect(mockNavigate).toHaveBeenCalledWith('authors');
  });

  it('devrait appeler navigateToView au clic sur Lieux', async () => {
    const mockNavigate = jest.fn();
    const user = userEvent.setup();
    
    render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={mockNavigate}
        academicColors={mockAcademicColors}
      />
    );
    
    const lieuxPanel = screen.getByText('Lieux');
    await user.click(lieuxPanel);
    
    expect(mockNavigate).toHaveBeenCalledWith('places');
  });
});

// ============================================================================
// TESTS : PROPS REQUISES
// ============================================================================

describe('OverviewView - Props requises', () => {
  it('devrait accepter toutes les props requises', () => {
    const { container } = render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={mockParseStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer des analytics vides', () => {
    const emptyAnalytics = {
      total: 0,
      domains: [],
      authors: [],
      periods: [],
      places: [],
      keyTerms: []
    };
    
    const { container } = render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={emptyAnalytics}
        parseStats={mockParseStats}
        filteredData={[]}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer des parseStats vides', () => {
    const emptyStats = {
      totalReferences: 0,
      successfulMatches: 0,
      failedMatches: 0,
      lookupRate: '0'
    };
    
    const { container } = render(
      <OverviewView
        panelConfig={mockPanelConfig}
        analytics={mockAnalytics}
        parseStats={emptyStats}
        filteredData={mockFilteredData}
        navigateToView={jest.fn()}
        academicColors={mockAcademicColors}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
