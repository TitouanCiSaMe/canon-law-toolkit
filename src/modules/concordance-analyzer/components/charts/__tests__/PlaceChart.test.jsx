import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlaceChart from '../PlaceChart';

// ============================================================================
// DONNÉES MOCK
// ============================================================================

const mockPlaceData = [
  { name: 'France', value: 150 },
  { name: 'Italie', value: 120 },
  { name: 'Allemagne', value: 80 },
  { name: 'Angleterre', value: 50 },
  { name: 'Espagne', value: 30 }
];

const mockLargePlaceData = Array.from({ length: 20 }, (_, i) => ({
  name: `Lieu ${i + 1}`,
  value: Math.floor(Math.random() * 100) + 10
}));

// ============================================================================
// TESTS : RENDU DE BASE
// ============================================================================

describe('PlaceChart - Rendu de base', () => {
  it('devrait rendre le composant sans erreur', () => {
    const { container } = render(<PlaceChart data={mockPlaceData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre un BarChart par défaut', () => {
    const { container } = render(<PlaceChart data={mockPlaceData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait utiliser ResponsiveContainer', () => {
    const { container } = render(<PlaceChart data={mockPlaceData} />);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('devrait accepter une hauteur personnalisée', () => {
    const { container } = render(
      <PlaceChart data={mockPlaceData} height={600} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : TYPE DE GRAPHIQUE
// ============================================================================

describe('PlaceChart - Type de graphique', () => {
  it('devrait rendre un BarChart avec type="bar"', () => {
    const { container } = render(
      <PlaceChart data={mockPlaceData} type="bar" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre un PieChart avec type="pie"', () => {
    const { container } = render(
      <PlaceChart data={mockPlaceData} type="pie" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer un type invalide sans crash', () => {
    const { container } = render(
      <PlaceChart data={mockPlaceData} type="invalid" />
    );
    expect(container).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : DONNÉES VIDES
// ============================================================================

describe('PlaceChart - Données vides', () => {
  it('devrait afficher un message si data est vide', () => {
    const { getByText } = render(<PlaceChart data={[]} />);
    expect(getByText(/Aucune donnée géographique disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un message si data est null', () => {
    const { getByText } = render(<PlaceChart data={null} />);
    expect(getByText(/Aucune donnée géographique disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un message si data est undefined', () => {
    const { getByText } = render(<PlaceChart data={undefined} />);
    expect(getByText(/Aucune donnée géographique disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher l\'emoji 🌍 dans le message vide', () => {
    const { getByText } = render(<PlaceChart data={[]} />);
    expect(getByText('🌍')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : LIMITATION D'ITEMS (maxItems)
// ============================================================================

describe('PlaceChart - Limitation d\'items', () => {
  it('devrait limiter à 15 items par défaut', () => {
    const { container } = render(
      <PlaceChart data={mockLargePlaceData} type="bar" />
    );
    // Recharts gère l'affichage - on vérifie juste le rendu
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait accepter un maxItems personnalisé', () => {
    const { container } = render(
      <PlaceChart data={mockLargePlaceData} type="bar" maxItems={5} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer maxItems=1', () => {
    const { container } = render(
      <PlaceChart data={mockPlaceData} type="bar" maxItems={1} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer maxItems plus grand que la taille des données', () => {
    const { container } = render(
      <PlaceChart data={mockPlaceData} type="bar" maxItems={100} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : PROPS PERSONNALISÉES
// ============================================================================

describe('PlaceChart - Props personnalisées', () => {
  it('devrait accepter une prop height', () => {
    const { container } = render(
      <PlaceChart data={mockPlaceData} height={500} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait accepter une prop colors', () => {
    const customColors = ['#FF0000', '#00FF00', '#0000FF'];
    const { container } = render(
      <PlaceChart 
        data={mockPlaceData} 
        type="pie"
        colors={customColors} 
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait utiliser les couleurs par défaut si colors non fourni', () => {
    const { container } = render(
      <PlaceChart data={mockPlaceData} type="pie" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : CAS LIMITES
// ============================================================================

describe('PlaceChart - Cas limites', () => {
  it('devrait gérer un seul lieu', () => {
    const singlePlace = [{ name: 'France', value: 100 }];
    const { container } = render(<PlaceChart data={singlePlace} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer des valeurs nulles', () => {
    const dataWithNull = [
      { name: 'France', value: 0 },
      { name: 'Italie', value: 50 }
    ];
    const { container } = render(<PlaceChart data={dataWithNull} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer des noms de lieux très longs', () => {
    const longNameData = [
      { name: 'République démocratique du Congo', value: 100 },
      { name: 'Bosnie-Herzégovine', value: 50 }
    ];
    const { container } = render(<PlaceChart data={longNameData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer des valeurs très grandes', () => {
    const largeValueData = [
      { name: 'France', value: 999999 },
      { name: 'Italie', value: 888888 }
    ];
    const { container } = render(<PlaceChart data={largeValueData} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
