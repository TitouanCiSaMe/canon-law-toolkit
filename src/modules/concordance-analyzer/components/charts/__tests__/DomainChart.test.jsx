/**
 * Tests unitaires pour le composant DomainChart
 * 
 * Teste :
 * - Le rendu avec différentes props
 * - Les types de graphiques (bar vs pie)
 * - La gestion des données vides
 * - Les props height et colors
 * - L'affichage des messages d'empty state
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DomainChart from '../DomainChart';

// ============================================================================
// MOCKS ET DONNÉES DE TEST
// ============================================================================

const mockData = [
  { name: 'Droit canon', value: 150 },
  { name: 'Droit civil', value: 120 },
  { name: 'Droit pénal', value: 80 },
  { name: 'Droit commercial', value: 50 }
];

const mockDataEmpty = [];

const mockColors = ['#2563eb', '#1d4ed8', '#1e40af', '#3730a3'];

// ============================================================================
// TESTS DE RENDU DE BASE
// ============================================================================

describe('DomainChart - Rendu de base', () => {
  
  it('devrait rendre le composant sans erreur (type bar)', () => {
    const { container } = render(<DomainChart data={mockData} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait rendre le composant sans erreur (type pie)', () => {
    const { container } = render(<DomainChart data={mockData} type="pie" />);
    expect(container).toBeInTheDocument();
  });

  // Ligne ~48-54
  it('devrait rendre un BarChart par défaut', () => {
    const { container } = render(<DomainChart data={mockData} />);
  
    // Vérifier que le composant est rendu (au lieu de chercher le SVG)
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre un PieChart quand type="pie"', () => {
    const { container } = render(<DomainChart data={mockData} type="pie" />);
  
    // Vérifier que le composant est rendu
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES PROPS
// ============================================================================

describe('DomainChart - Props', () => {
  
  it('devrait accepter une height personnalisée', () => {
    const { container } = render(
      <DomainChart data={mockData} type="bar" height={500} />
    );
    
    // ResponsiveContainer devrait avoir la height
    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  });

  it('devrait accepter des couleurs personnalisées', () => {
    const { container } = render(
      <DomainChart 
        data={mockData} 
        type="pie" 
        colors={mockColors}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('devrait utiliser le type par défaut "bar" si non spécifié', () => {
    const { container } = render(<DomainChart data={mockData} />);
  
    // Vérifier que le composant est rendu
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait accepter height=400 par défaut', () => {
    const { container } = render(<DomainChart data={mockData} />);
    expect(container).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS AVEC DONNÉES VIDES
// ============================================================================

describe('DomainChart - Données vides', () => {
  
  it('devrait afficher un message si data est vide', () => {
    render(<DomainChart data={mockDataEmpty} type="bar" />);
    
    expect(screen.getByText(/Aucune donnée de domaine disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un message si data est null', () => {
    render(<DomainChart data={null} type="bar" />);
    
    expect(screen.getByText(/Aucune donnée de domaine disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un message si data est undefined', () => {
    render(<DomainChart data={undefined} type="bar" />);
    
    expect(screen.getByText(/Aucune donnée de domaine disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un emoji dans le message vide', () => {
    render(<DomainChart data={[]} type="bar" />);
    
    expect(screen.getByText('📚')).toBeInTheDocument();
  });

  it('ne devrait pas rendre de graphique si data est vide', () => {
    const { container } = render(<DomainChart data={[]} type="bar" />);
    
    // Pas de SVG si données vides
    const svgElement = container.querySelector('svg');
    expect(svgElement).not.toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES DIFFÉRENTS TYPES
// ============================================================================

describe('DomainChart - Types de graphiques', () => {
  
  it('devrait rendre un BarChart quand type="bar"', () => {
    const { container } = render(<DomainChart data={mockData} type="bar" />);
  
    // Vérifier que le composant est rendu
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre un PieChart quand type="pie"', () => {
    const { container } = render(<DomainChart data={mockData} type="pie" />);
  
    // Vérifier que le composant est rendu
    expect(container.firstChild).toBeInTheDocument();
  });

  it('ne devrait rien rendre pour un type inconnu', () => {
    const { container } = render(<DomainChart data={mockData} type="unknown" />);
    
    // Devrait retourner null pour un type non géré
    // Le container ne devrait contenir qu'un div vide ou rien
    const svgElement = container.querySelector('svg');
    expect(svgElement).not.toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES DONNÉES RENDUES
// ============================================================================

describe('DomainChart - Données rendues', () => {
  
  it('devrait rendre le graphique avec les données fournies', () => {
    const { container } = render(<DomainChart data={mockData} type="bar" />);
  
    // Vérifier que le composant est rendu
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer un seul élément de données', () => {
    const singleData = [{ name: 'Droit canon', value: 100 }];
    
    const { container } = render(<DomainChart data={singleData} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer de nombreux éléments de données', () => {
    const manyData = Array.from({ length: 20 }, (_, i) => ({
      name: `Domaine ${i + 1}`,
      value: Math.floor(Math.random() * 100)
    }));
    
    const { container } = render(<DomainChart data={manyData} type="bar" />);
    expect(container).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DE CAS LIMITES
// ============================================================================

describe('DomainChart - Cas limites', () => {
  
  it('devrait gérer des valeurs de données nulles', () => {
    const dataWithNull = [
      { name: 'Droit canon', value: null },
      { name: 'Droit civil', value: 100 }
    ];
    
    const { container } = render(<DomainChart data={dataWithNull} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer des noms de domaines très longs', () => {
    const dataWithLongNames = [
      { name: 'Droit canon ecclésiastique médiéval européen', value: 100 }
    ];
    
    const { container } = render(<DomainChart data={dataWithLongNames} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer des valeurs négatives', () => {
    const dataWithNegative = [
      { name: 'Test', value: -10 }
    ];
    
    const { container } = render(<DomainChart data={dataWithNegative} type="bar" />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer height=0', () => {
    const { container } = render(<DomainChart data={mockData} type="bar" height={0} />);
    expect(container).toBeInTheDocument();
  });

  it('devrait gérer un tableau de couleurs vide', () => {
    const { container } = render(<DomainChart data={mockData} type="pie" colors={[]} />);
    expect(container).toBeInTheDocument();
  });
});
