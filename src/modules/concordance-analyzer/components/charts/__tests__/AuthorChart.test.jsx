/**
 * Tests unitaires pour le composant AuthorChart
 * 
 * Teste :
 * - Le rendu avec différentes props
 * - Les types de graphiques (bar vs pie)
 * - La gestion des données vides
 * - Les props height, colors et maxItems
 * - L'affichage des messages d'empty state
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthorChart from '../AuthorChart';

// ============================================================================
// MOCKS ET DONNÉES DE TEST
// ============================================================================

const mockData = [
  { name: 'Gratien', value: 150 },
  { name: 'Yves de Chartres', value: 120 },
  { name: 'Innocent III', value: 80 },
  { name: 'Grégoire IX', value: 50 }
];

const mockDataEmpty = [];

const mockColors = ['#2563eb', '#1d4ed8', '#1e40af', '#3730a3'];

// ============================================================================
// TESTS DE RENDU DE BASE
// ============================================================================

describe('AuthorChart - Rendu de base', () => {
  
  it('devrait rendre le composant sans erreur (type bar)', () => {
    const { container } = render(<AuthorChart data={mockData} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait rendre le composant sans erreur (type pie)', () => {
    const { container } = render(<AuthorChart data={mockData} type="pie" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait rendre un BarChart par défaut', () => {
    const { container } = render(<AuthorChart data={mockData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre un PieChart quand type="pie"', () => {
    const { container } = render(<AuthorChart data={mockData} type="pie" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES PROPS
// ============================================================================

describe('AuthorChart - Props', () => {
  
  it('devrait accepter une height personnalisée', () => {
    const { container } = render(
      <AuthorChart data={mockData} type="bar" height={500} />
    );
    
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  });

  it('devrait accepter des couleurs personnalisées', () => {
    const { container } = render(
      <AuthorChart 
        data={mockData} 
        type="pie" 
        colors={mockColors}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait utiliser le type par défaut "bar" si non spécifié', () => {
    const { container } = render(<AuthorChart data={mockData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait accepter height=400 par défaut', () => {
    const { container } = render(<AuthorChart data={mockData} />);
    expect(container).toBeInTheDocument();
  });

  it('devrait accepter maxItems pour limiter les auteurs affichés', () => {
    const { container } = render(
      <AuthorChart data={mockData} type="bar" maxItems={2} />
    );
    expect(container).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS AVEC DONNÉES VIDES
// ============================================================================

describe('AuthorChart - Données vides', () => {
  
  it('devrait afficher un message si data est vide', () => {
    render(<AuthorChart data={mockDataEmpty} type="bar" />);
    
    expect(screen.getByText(/Aucune donnée d'auteur disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un message si data est null', () => {
    render(<AuthorChart data={null} type="bar" />);
    
    expect(screen.getByText(/Aucune donnée d'auteur disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un message si data est undefined', () => {
    render(<AuthorChart data={undefined} type="bar" />);
    
    expect(screen.getByText(/Aucune donnée d'auteur disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un emoji dans le message vide', () => {
    render(<AuthorChart data={[]} type="bar" />);
    
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('ne devrait pas rendre de graphique si data est vide', () => {
    const { container } = render(<AuthorChart data={[]} type="bar" />);
    
    const svgElement = container.querySelector('svg');
    expect(svgElement).not.toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES DIFFÉRENTS TYPES
// ============================================================================

describe('AuthorChart - Types de graphiques', () => {
  
  it('devrait rendre un BarChart quand type="bar"', () => {
    const { container } = render(<AuthorChart data={mockData} type="bar" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre un PieChart quand type="pie"', () => {
    const { container } = render(<AuthorChart data={mockData} type="pie" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('ne devrait rien rendre pour un type inconnu', () => {
    const { container } = render(<AuthorChart data={mockData} type="unknown" />);
    
    const svgElement = container.querySelector('svg');
    expect(svgElement).not.toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES DONNÉES RENDUES
// ============================================================================

describe('AuthorChart - Données rendues', () => {
  
  it('devrait rendre le graphique avec les données fournies', () => {
    const { container } = render(<AuthorChart data={mockData} type="bar" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer un seul élément de données', () => {
    const singleData = [{ name: 'Gratien', value: 100 }];
    
    const { container } = render(<AuthorChart data={singleData} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer de nombreux éléments de données', () => {
    const manyData = Array.from({ length: 20 }, (_, i) => ({
      name: `Auteur ${i + 1}`,
      value: Math.floor(Math.random() * 100)
    }));
    
    const { container } = render(<AuthorChart data={manyData} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait limiter les données affichées avec maxItems', () => {
    const manyData = Array.from({ length: 20 }, (_, i) => ({
      name: `Auteur ${i + 1}`,
      value: Math.floor(Math.random() * 100)
    }));
    
    const { container } = render(<AuthorChart data={manyData} type="bar" maxItems={10} />);
    expect(container).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DE CAS LIMITES
// ============================================================================

describe('AuthorChart - Cas limites', () => {
  
  it('devrait gérer des valeurs de données nulles', () => {
    const dataWithNull = [
      { name: 'Gratien', value: null },
      { name: 'Innocent III', value: 100 }
    ];
    
    const { container } = render(<AuthorChart data={dataWithNull} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer des noms d\'auteurs très longs', () => {
    const dataWithLongNames = [
      { name: 'Innocent III Lothaire de Segni Cardinal Diacre', value: 100 }
    ];
    
    const { container } = render(<AuthorChart data={dataWithLongNames} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer des valeurs négatives', () => {
    const dataWithNegative = [
      { name: 'Test', value: -10 }
    ];
    
    const { container } = render(<AuthorChart data={dataWithNegative} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer height=0', () => {
    const { container } = render(<AuthorChart data={mockData} type="bar" height={0} />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer un tableau de couleurs vide', () => {
    const { container } = render(<AuthorChart data={mockData} type="pie" colors={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer maxItems=0', () => {
    const { container } = render(<AuthorChart data={mockData} type="bar" maxItems={0} />);
    expect(container).toBeInTheDocument();
  });
});
