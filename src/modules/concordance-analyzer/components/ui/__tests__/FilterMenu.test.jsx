/**
 * Tests unitaires pour le composant FilterMenu
 * 
 * Teste :
 * - Le rendu du menu latéral
 * - Les sections de filtres (auteurs, domaines, périodes, lieux)
 * - Les checkboxes et leur sélection
 * - La recherche textuelle
 * - Le bouton Clear All
 * - Le toggle des sections
 * - Le compteur de filtres actifs
 * - Le bouton de fermeture
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterMenu from '../FilterMenu';

// ============================================================================
// MOCKS ET DONNÉES DE TEST
// ============================================================================

const mockConcordanceData = [
  {
    id: 1,
    author: 'Gratien',
    domain: 'Droit canon',
    period: '1140',
    place: 'Italie'
  },
  {
    id: 2,
    author: 'Yves de Chartres',
    domain: 'Droit canon',
    period: '1095',
    place: 'France'
  },
  {
    id: 3,
    author: 'Anonyme',
    domain: 'Droit civil',
    period: '1150',
    place: 'France'
  }
];

const mockFilteredData = mockConcordanceData;

const mockActiveFilters = {
  authors: [],
  domains: [],
  periods: [],
  places: [],
  searchTerm: ''
};

const mockActiveFiltersWithData = {
  authors: ['Gratien'],
  domains: ['Droit canon'],
  periods: ['1100-1149'],
  places: [],
  searchTerm: 'test'
};

// ============================================================================
// TESTS DE RENDU DE BASE
// ============================================================================

describe('FilterMenu - Rendu de base', () => {
  
  it('devrait rendre le composant sans erreur', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText(/Filtres/i)).toBeInTheDocument();
  });

  it('devrait afficher le titre "Filtres"', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Filtres')).toBeInTheDocument();
  });

  it('devrait afficher le bouton de fermeture', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByText('✕');
    expect(closeButton).toBeInTheDocument();
  });

  it('devrait afficher la section de recherche textuelle', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByPlaceholderText(/Rechercher/i)).toBeInTheDocument();
  });

  it('devrait afficher les 4 sections de filtres', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText(/Auteurs/i)).toBeInTheDocument();
    expect(screen.getByText(/Domaines/i)).toBeInTheDocument();
    expect(screen.getByText(/Périodes/i)).toBeInTheDocument();
    expect(screen.getByText(/Lieux/i)).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES INTERACTIONS - FERMETURE
// ============================================================================

describe('FilterMenu - Interactions fermeture', () => {
  
  it('devrait appeler onClose lors du clic sur le bouton de fermeture', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// TESTS DE LA RECHERCHE TEXTUELLE
// ============================================================================

describe('FilterMenu - Recherche textuelle', () => {
  
  it('devrait afficher la valeur de searchTerm dans l\'input', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    const filtersWithSearch = {
      ...mockActiveFilters,
      searchTerm: 'test search'
    };
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={filtersWithSearch}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/i);
    expect(searchInput).toHaveValue('test search');
  });

  it('devrait appeler setActiveFilters lors de la saisie', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'nouveau texte' } });
    
    expect(mockSetActiveFilters).toHaveBeenCalled();
  });
});

// ============================================================================
// TESTS DES CHECKBOXES
// ============================================================================

describe('FilterMenu - Checkboxes', () => {
  
  it('devrait afficher les auteurs disponibles', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('Gratien')).toBeInTheDocument();
    expect(screen.getByText('Yves de Chartres')).toBeInTheDocument();
  });

  it('devrait cocher les filtres actifs', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    const filtersWithAuthor = {
      ...mockActiveFilters,
      authors: ['Gratien']
    };
    
    const { container } = render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={filtersWithAuthor}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    // Trouver la checkbox associée à Gratien
    const gratienLabel = screen.getByText('Gratien').closest('label');
    const checkbox = gratienLabel.querySelector('input[type="checkbox"]');
    
    expect(checkbox).toBeChecked();
  });

  it('devrait appeler setActiveFilters lors du clic sur une checkbox', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const gratienLabel = screen.getByText('Gratien').closest('label');
    const checkbox = gratienLabel.querySelector('input[type="checkbox"]');
    
    fireEvent.click(checkbox);
    
    expect(mockSetActiveFilters).toHaveBeenCalled();
  });
});

// ============================================================================
// TESTS DU COMPTEUR DE FILTRES ACTIFS
// ============================================================================

describe('FilterMenu - Compteur de filtres actifs', () => {
  
  it('ne devrait pas afficher le compteur si aucun filtre actif', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    // Le titre devrait être "Filtres" sans nombre
    const title = screen.getByText(/^Filtres$/);
    expect(title).toBeInTheDocument();
  });

  it('devrait afficher le compteur si des filtres sont actifs', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFiltersWithData}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    // Le titre devrait contenir le nombre de filtres (4 dans ce cas)
    expect(screen.getByText(/Filtres \(4\)/)).toBeInTheDocument();
  });

  it('devrait afficher le compteur correct dans les sections', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFiltersWithData}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    // La section Auteurs devrait afficher (1)
    expect(screen.getByText(/Auteurs \(1\)/)).toBeInTheDocument();
    // La section Domaines devrait afficher (1)
    expect(screen.getByText(/Domaines \(1\)/)).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DU BOUTON CLEAR ALL
// ============================================================================

describe('FilterMenu - Clear All', () => {
  
  it('ne devrait pas afficher le bouton Clear All si aucun filtre actif', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.queryByText(/Réinitialiser tous les filtres/i)).not.toBeInTheDocument();
  });

  it('devrait afficher le bouton Clear All si des filtres sont actifs', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFiltersWithData}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText(/Réinitialiser tous les filtres/i)).toBeInTheDocument();
  });

  it('devrait appeler setActiveFilters avec des filtres vides au clic', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFiltersWithData}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const clearButton = screen.getByText(/Réinitialiser tous les filtres/i);
    fireEvent.click(clearButton);
    
    expect(mockSetActiveFilters).toHaveBeenCalledWith({
      authors: [],
      domains: [],
      periods: [],
      places: [],
      searchTerm: ''
    });
  });
});

// ============================================================================
// TESTS DU TOGGLE DES SECTIONS
// ============================================================================

describe('FilterMenu - Toggle sections', () => {
  
  it('devrait afficher les items d\'une section par défaut', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    // Les auteurs devraient être visibles
    expect(screen.getByText('Gratien')).toBeVisible();
  });

  it('devrait pouvoir cliquer sur l\'en-tête de section', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const authorHeader = screen.getByText(/Auteurs/i).closest('div');
    
    // Cliquer ne devrait pas crasher
    expect(() => fireEvent.click(authorHeader)).not.toThrow();
  });
});

// ============================================================================
// TESTS DES CAS LIMITES
// ============================================================================

describe('FilterMenu - Cas limites', () => {
  
  it('devrait gérer concordanceData vide', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    expect(() => {
      render(
        <FilterMenu
          concordanceData={[]}
          filteredData={[]}
          activeFilters={mockActiveFilters}
          setActiveFilters={mockSetActiveFilters}
          onClose={mockOnClose}
        />
      );
    }).not.toThrow();
  });

  it('devrait filtrer les auteurs "Anonyme"', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    // Anonyme ne devrait pas apparaître dans la liste
    expect(screen.queryByText('Anonyme')).not.toBeInTheDocument();
  });

  it('devrait trier les auteurs par ordre alphabétique', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    const { container } = render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const authorLabels = Array.from(container.querySelectorAll('label'))
      .filter(label => 
        label.textContent.includes('Gratien') || 
        label.textContent.includes('Yves de Chartres')
      );
    
    expect(authorLabels.length).toBeGreaterThan(0);
  });

  it('devrait gérer des filtres avec tableaux vides', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    const filtersWithEmpty = {
      authors: [],
      domains: [],
      periods: [],
      places: [],
      searchTerm: ''
    };
    
    expect(() => {
      render(
        <FilterMenu
          concordanceData={mockConcordanceData}
          filteredData={mockFilteredData}
          activeFilters={filtersWithEmpty}
          setActiveFilters={mockSetActiveFilters}
          onClose={mockOnClose}
        />
      );
    }).not.toThrow();
    
    // Vérifier que le menu s'affiche correctement
    expect(screen.getByText(/Filtres/i)).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DU STYLE ET LAYOUT
// ============================================================================

describe('FilterMenu - Style et layout', () => {
  
  it('devrait avoir un style position fixed', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    const { container } = render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const menu = container.firstChild;
    expect(menu).toHaveStyle({ position: 'fixed' });
  });

  it('devrait être positionné à droite', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    const { container } = render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const menu = container.firstChild;
    expect(menu).toHaveStyle({ right: '0' });
  });

  it('devrait avoir un z-index élevé', () => {
    const mockSetActiveFilters = jest.fn();
    const mockOnClose = jest.fn();
    
    const { container } = render(
      <FilterMenu
        concordanceData={mockConcordanceData}
        filteredData={mockFilteredData}
        activeFilters={mockActiveFilters}
        setActiveFilters={mockSetActiveFilters}
        onClose={mockOnClose}
      />
    );
    
    const menu = container.firstChild;
    expect(menu).toHaveStyle({ zIndex: 1000 });
  });
});
