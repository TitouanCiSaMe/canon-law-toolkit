// src/components/views/__tests__/DataView.test.jsx


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataView from '../DataView';
import usePagination from '../../hook/usePagination';

// Mock de scrollIntoView (n'existe pas dans JSDOM)
Element.prototype.scrollIntoView = jest.fn();

// Mock du hook usePagination
jest.mock('../../hook/usePagination');

// Mock des composants enfants
jest.mock('../../ui/ExportButtons', () => {
  return function MockExportButtons() {
    return <div data-testid="export-buttons">Export Buttons</div>;
  };
});

jest.mock('../../ui/Pagination', () => {
  return function MockPagination({ currentPage, totalPages, onPageChange, onItemsPerPageChange }) {
    return (
      <div data-testid="pagination">
        <span>Page {currentPage} sur {totalPages}</span>
        <button onClick={() => onPageChange(2)}>Page 2</button>
        <button onClick={() => onItemsPerPageChange(100)}>100 items</button>
      </div>
    );
  };
});

describe('DataView', () => {
  const mockOnExportConcordances = jest.fn();
  const mockOnExportAnalytics = jest.fn();

  const mockAnalytics = {
    total: 150,
  };

  const sampleData = [
    {
      id: 1,
      reference: 'Edi-25, Summa, 1194, 53',
      author: 'Anonyme',
      title: 'Summa Induent sancti',
      period: '1194',
      domain: 'Droit canonique',
      place: 'France',
      page: 53,
      left: 'in causa ecclesiastica quando',
      kwic: 'ecclesia',
      right: 'potest iudicare laicos de',
      fromLookup: true,
    },
    {
      id: 2,
      reference: 'Edi-30, Decretum, 1140, 142',
      author: 'Gratien',
      title: 'Decretum',
      period: '1140',
      domain: 'Droit canonique',
      place: 'Bologne (Italie)',
      page: 142,
      left: 'secundum canonem de',
      kwic: 'ecclesia',
      right: 'romana que est mater',
      fromLookup: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuration par défaut du mock usePagination
    usePagination.mockReturnValue({
      currentPage: 1,
      totalPages: 3,
      itemsPerPage: 50,
      paginatedData: sampleData,
      goToPage: jest.fn(),
      setItemsPerPage: jest.fn(),
      startIndex: 0,
      endIndex: 1,
      totalItems: 150,
    });
  });

  describe('Rendu avec données', () => {
    test('doit afficher le titre', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      expect(screen.getByText('Données de concordances détaillées')).toBeInTheDocument();
    });

    test('doit afficher les boutons d\'export', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      expect(screen.getByTestId('export-buttons')).toBeInTheDocument();
    });

    test('doit afficher la pagination en haut et en bas', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      const paginationElements = screen.getAllByTestId('pagination');
      expect(paginationElements).toHaveLength(2); // Une en haut, une en bas
    });

    test('doit afficher toutes les concordances paginées', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      // Vérifier que les concordances sont affichées
      expect(screen.getByText('Anonyme')).toBeInTheDocument();
      expect(screen.getByText('Gratien')).toBeInTheDocument();
      expect(screen.getByText('Summa Induent sancti')).toBeInTheDocument();
      expect(screen.getByText('Decretum')).toBeInTheDocument();
    });

    test('doit afficher les badges de statut (Enrichi/Parsé)', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      expect(screen.getByText('✅ Enrichi')).toBeInTheDocument();
      expect(screen.getByText('⚠️ Parsé')).toBeInTheDocument();
    });

    test('doit afficher les mots-clés KWIC surlignés', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      const kwicElements = screen.getAllByText('ecclesia');
      expect(kwicElements.length).toBeGreaterThan(0);
    });
  });

  describe('Rendu sans données', () => {
    test('doit afficher le message "Aucune donnée disponible"', () => {
      usePagination.mockReturnValue({
        currentPage: 1,
        totalPages: 0,
        itemsPerPage: 50,
        paginatedData: [],
        goToPage: jest.fn(),
        setItemsPerPage: jest.fn(),
        startIndex: 0,
        endIndex: 0,
        totalItems: 0,
      });

      render(
        <DataView
          filteredData={[]}
          analytics={{ total: 0 }}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      expect(screen.getByText('Aucune donnée disponible')).toBeInTheDocument();
      expect(screen.getByText('Importez d\'abord vos fichiers pour voir les concordances détaillées.')).toBeInTheDocument();
    });

    test('ne doit pas afficher les boutons d\'export sans données', () => {
      usePagination.mockReturnValue({
        currentPage: 1,
        totalPages: 0,
        itemsPerPage: 50,
        paginatedData: [],
        goToPage: jest.fn(),
        setItemsPerPage: jest.fn(),
        startIndex: 0,
        endIndex: 0,
        totalItems: 0,
      });

      render(
        <DataView
          filteredData={[]}
          analytics={{ total: 0 }}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      expect(screen.queryByTestId('export-buttons')).not.toBeInTheDocument();
    });

    test('ne doit pas afficher la pagination sans données', () => {
      usePagination.mockReturnValue({
        currentPage: 1,
        totalPages: 0,
        itemsPerPage: 50,
        paginatedData: [],
        goToPage: jest.fn(),
        setItemsPerPage: jest.fn(),
        startIndex: 0,
        endIndex: 0,
        totalItems: 0,
      });

      render(
        <DataView
          filteredData={[]}
          analytics={{ total: 0 }}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });
  });

  describe('Sélecteur d\'affichage du contexte', () => {
    test('doit afficher le sélecteur ligne/complet', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      expect(screen.getByText('Affichage du contexte :')).toBeInTheDocument();
      expect(screen.getByText('📏 Une ligne')).toBeInTheDocument();
      expect(screen.getByText('📄 Texte complet')).toBeInTheDocument();
    });

    test('le mode "Une ligne" doit être actif par défaut', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      const lineButton = screen.getByText('📏 Une ligne');
      expect(lineButton).toHaveStyle({ background: '#1A365D', color: 'white' });
    });

    test('doit changer le mode d\'affichage au clic', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      const fullButton = screen.getByText('📄 Texte complet');
      fireEvent.click(fullButton);

      expect(fullButton).toHaveStyle({ background: '#1A365D', color: 'white' });
    });

    test('doit afficher les ellipses en mode "Une ligne"', () => {
      const longContextData = [
        {
          ...sampleData[0],
          left: 'a'.repeat(100), // Plus de 80 caractères
          right: 'b'.repeat(100),
        },
      ];

      usePagination.mockReturnValue({
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 50,
        paginatedData: longContextData,
        goToPage: jest.fn(),
        setItemsPerPage: jest.fn(),
        startIndex: 0,
        endIndex: 0,
        totalItems: 1,
      });

      const { container } = render(
        <DataView
          filteredData={longContextData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      // Vérifier la présence des ellipses dans le rendu
      expect(container.textContent).toContain('...');
    });

        test('ne doit pas afficher les ellipses en mode "Texte complet"', () => {
	  const longContextData = [
	    {
	      ...sampleData[0],
	      left: 'a'.repeat(100),
	      right: 'b'.repeat(100),
	    },
	  ];

	  usePagination.mockReturnValue({
	    currentPage: 1,
	    totalPages: 1,
	    itemsPerPage: 50,
	    paginatedData: longContextData,
	    goToPage: jest.fn(),
	    setItemsPerPage: jest.fn(),
	    startIndex: 0,
	    endIndex: 0,
	    totalItems: 1,
	  });

	  const { container } = render(
	    <DataView
	      filteredData={longContextData}
	      analytics={mockAnalytics}
	      onExportConcordances={mockOnExportConcordances}
	      onExportAnalytics={mockOnExportAnalytics}
	    />
	  );

	  // Passer en mode texte complet
	  const fullButton = screen.getByText('📄 Texte complet');
	  fireEvent.click(fullButton);

	  // En mode texte complet, les contextes longs ne doivent PAS être tronqués
	  // On cherche les divs de concordance (ceux avec le KWIC)
	  const concordanceElements = container.querySelectorAll('[style*="line-height: 1.6"]');
	  expect(concordanceElements.length).toBeGreaterThan(0);
	  
	  // Le texte de la concordance devrait contenir beaucoup de 'a' et 'b'
	  // (bien plus que les 80 caractères du mode ligne)
	  const concordanceText = concordanceElements[0].textContent;
	  const aCount = (concordanceText.match(/a/g) || []).length;
	  expect(aCount).toBeGreaterThan(80); // Beaucoup plus que les 80 du mode ligne
	});
  });

  describe('Intégration avec usePagination', () => {
    test('doit appeler usePagination avec les bons paramètres', () => {
      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      expect(usePagination).toHaveBeenCalledWith(sampleData, 50, 'dataview-pagination');
    });

    test('doit afficher les données paginées retournées par le hook', () => {
      const paginatedData = [sampleData[0]]; // Seulement le premier item
      
      usePagination.mockReturnValue({
        currentPage: 1,
        totalPages: 2,
        itemsPerPage: 1,
        paginatedData: paginatedData,
        goToPage: jest.fn(),
        setItemsPerPage: jest.fn(),
        startIndex: 0,
        endIndex: 0,
        totalItems: 2,
      });

      render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      // Seul le premier item doit être affiché
      expect(screen.getByText('Anonyme')).toBeInTheDocument();
      expect(screen.queryByText('Gratien')).not.toBeInTheDocument();
    });
  });

  describe('Affichage des métadonnées', () => {
       test('doit afficher toutes les métadonnées d\'une concordance', () => {
	  render(
	    <DataView
	      filteredData={sampleData}
	      analytics={mockAnalytics}
	      onExportConcordances={mockOnExportConcordances}
	      onExportAnalytics={mockOnExportAnalytics}
	    />
	  );

	  // Vérifier toutes les métadonnées de la première concordance
	  expect(screen.getByText('Anonyme')).toBeInTheDocument();
	  expect(screen.getByText('Summa Induent sancti')).toBeInTheDocument();
	  expect(screen.getByText('1194')).toBeInTheDocument();
	  expect(screen.getByText('France')).toBeInTheDocument();
	  // "Droit canonique" apparaît 2 fois (les 2 concordances ont ce domaine)
	  expect(screen.getAllByText('Droit canonique').length).toBeGreaterThan(0);
	});

        test('doit afficher la page si disponible', () => {
	  render(
	    <DataView
	      filteredData={sampleData}
	      analytics={mockAnalytics}
	      onExportConcordances={mockOnExportConcordances}
	      onExportAnalytics={mockOnExportAnalytics}
	    />
	  );

	  // Les deux concordances ont des pages (53 et 142)
	  expect(screen.getByText('53')).toBeInTheDocument();
	  expect(screen.getByText('142')).toBeInTheDocument();
	});

    test('ne doit pas afficher la page si non disponible', () => {
      const dataWithoutPage = [
        {
          ...sampleData[0],
          page: null,
        },
      ];

      usePagination.mockReturnValue({
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 50,
        paginatedData: dataWithoutPage,
        goToPage: jest.fn(),
        setItemsPerPage: jest.fn(),
        startIndex: 0,
        endIndex: 0,
        totalItems: 1,
      });

      render(
        <DataView
          filteredData={dataWithoutPage}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      // Ne doit afficher qu'une seule occurrence de "Page:" dans les métadonnées de la concordance qui a une page
      const pageLabels = screen.queryAllByText(/Page:/);
      expect(pageLabels.length).toBe(0);
    });
  });

  describe('Scroll automatique', () => {
    test('doit avoir une ref sur le conteneur principal', () => {
      const { container } = render(
        <DataView
          filteredData={sampleData}
          analytics={mockAnalytics}
          onExportConcordances={mockOnExportConcordances}
          onExportAnalytics={mockOnExportAnalytics}
        />
      );

      // Le conteneur avec la ref doit exister
      const mainContainer = container.querySelector('[style*="background: white"]');
      expect(mainContainer).toBeInTheDocument();
    });
  });
});
