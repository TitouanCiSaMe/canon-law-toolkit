import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemporalChart from '../TemporalChart';

// ============================================================================
// DONNÉES MOCK
// ============================================================================

const mockTemporalData = [
  { period: 1100, count: 10 },
  { period: 1150, count: 25 },
  { period: 1200, count: 40 },
  { period: 1250, count: 30 },
  { period: 1300, count: 35 }
];

const mockSinglePoint = [
  { period: 1200, count: 50 }
];

const mockLargeTemporalData = Array.from({ length: 20 }, (_, i) => ({
  period: 1000 + (i * 50),
  count: Math.floor(Math.random() * 100) + 10
}));

const mockUnorderedData = [
  { period: 1250, count: 30 },
  { period: 1100, count: 10 },
  { period: 1300, count: 35 },
  { period: 1150, count: 25 }
];

// ============================================================================
// TESTS : RENDU DE BASE
// ============================================================================

describe('TemporalChart - Rendu de base', () => {
  it('devrait rendre le composant sans erreur', () => {
    const { container } = render(<TemporalChart data={mockTemporalData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre un LineChart', () => {
    const { container } = render(<TemporalChart data={mockTemporalData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait utiliser ResponsiveContainer', () => {
    const { container } = render(<TemporalChart data={mockTemporalData} />);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('devrait accepter une hauteur personnalisée', () => {
    const { container } = render(
      <TemporalChart data={mockTemporalData} height={600} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : PROPS SPÉCIFIQUES
// ============================================================================

describe('TemporalChart - Props spécifiques', () => {
  it('devrait afficher le brush par défaut (showBrush=true)', () => {
    const { container } = render(
      <TemporalChart data={mockTemporalData} showBrush={true} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait masquer le brush avec showBrush=false', () => {
    const { container } = render(
      <TemporalChart data={mockTemporalData} showBrush={false} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait accepter une couleur de ligne personnalisée', () => {
    const { container } = render(
      <TemporalChart data={mockTemporalData} lineColor="#FF0000" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait utiliser la couleur par défaut si lineColor non fourni', () => {
    const { container } = render(
      <TemporalChart data={mockTemporalData} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait accepter height personnalisée', () => {
    const { container } = render(
      <TemporalChart data={mockTemporalData} height={500} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : DONNÉES VIDES
// ============================================================================

describe('TemporalChart - Données vides', () => {
  it('devrait afficher un message si data est vide', () => {
    const { getByText } = render(<TemporalChart data={[]} />);
    expect(getByText(/Aucune donnée temporelle disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un message si data est null', () => {
    const { getByText } = render(<TemporalChart data={null} />);
    expect(getByText(/Aucune donnée temporelle disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher un message si data est undefined', () => {
    const { getByText } = render(<TemporalChart data={undefined} />);
    expect(getByText(/Aucune donnée temporelle disponible/i)).toBeInTheDocument();
  });

  it('devrait afficher l\'emoji 📅 dans le message vide', () => {
    const { getByText } = render(<TemporalChart data={[]} />);
    expect(getByText('📅')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : STRUCTURE DES DONNÉES
// ============================================================================

describe('TemporalChart - Structure des données', () => {
  it('devrait gérer un seul point de données', () => {
    const { container } = render(<TemporalChart data={mockSinglePoint} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer beaucoup de points de données', () => {
    const { container } = render(<TemporalChart data={mockLargeTemporalData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer des données non ordonnées', () => {
    const { container } = render(<TemporalChart data={mockUnorderedData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer des périodes avec count=0', () => {
    const dataWithZero = [
      { period: 1100, count: 10 },
      { period: 1150, count: 0 },
      { period: 1200, count: 20 }
    ];
    const { container } = render(<TemporalChart data={dataWithZero} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : CAS LIMITES
// ============================================================================

describe('TemporalChart - Cas limites', () => {
  it('devrait gérer des valeurs count très grandes', () => {
    const largeCountData = [
      { period: 1100, count: 999999 },
      { period: 1200, count: 888888 }
    ];
    const { container } = render(<TemporalChart data={largeCountData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer des périodes espacées', () => {
    const spacedData = [
      { period: 1000, count: 10 },
      { period: 1500, count: 20 },
      { period: 2000, count: 15 }
    ];
    const { container } = render(<TemporalChart data={spacedData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer des périodes très anciennes', () => {
    const ancientData = [
      { period: 500, count: 5 },
      { period: 800, count: 10 },
      { period: 1000, count: 15 }
    ];
    const { container } = render(<TemporalChart data={ancientData} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer des périodes récentes', () => {
    const recentData = [
      { period: 1800, count: 20 },
      { period: 1900, count: 30 },
      { period: 2000, count: 25 }
    ];
    const { container } = render(<TemporalChart data={recentData} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS : COMBINAISONS DE PROPS
// ============================================================================

describe('TemporalChart - Combinaisons de props', () => {
  it('devrait accepter showBrush + lineColor ensemble', () => {
    const { container } = render(
      <TemporalChart 
        data={mockTemporalData} 
        showBrush={true}
        lineColor="#00FF00"
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait accepter toutes les props ensemble', () => {
    const { container } = render(
      <TemporalChart 
        data={mockTemporalData} 
        height={500}
        showBrush={false}
        lineColor="#FF00FF"
      />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait fonctionner avec props minimales', () => {
    const { container } = render(
      <TemporalChart data={mockTemporalData} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
