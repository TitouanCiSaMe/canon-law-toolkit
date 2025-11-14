import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomTooltip from '../CustomTooltipChart';

/**
 * Suite de tests pour CustomTooltip
 * 
 * Tests couverts :
 * - Affichage de base
 * - Calcul du pourcentage
 * - Calcul du rang
 * - Options de personnalisation
 * - Cas limites
 */

describe('CustomTooltip', () => {
  
  // ==========================================================================
  // DONNÉES DE TEST
  // ==========================================================================
  
  /**
   * Jeu de données test : 5 domaines juridiques
   */
  const mockData = [
    { name: 'Droit pénal', value: 100 },
    { name: 'Droit civil', value: 80 },
    { name: 'Droit canon', value: 60 },
    { name: 'Droit commercial', value: 40 },
    { name: 'Droit fiscal', value: 20 }
  ];

  /**
   * Payload mock fourni par Recharts lors du survol
   */
  const createMockPayload = (name, value) => [{
    name,
    value,
    payload: { name, value }
  }];

  // ==========================================================================
  // TESTS : AFFICHAGE DE BASE
  // ==========================================================================
  
  describe('Affichage de base', () => {
    
    test('n\'affiche rien si le tooltip n\'est pas actif', () => {
      const { container } = render(
        <CustomTooltip
          active={false}
          payload={createMockPayload('Droit pénal', 100)}
          label="Droit pénal"
          allData={mockData}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    test('n\'affiche rien si payload est vide', () => {
      const { container } = render(
        <CustomTooltip
          active={true}
          payload={[]}
          label="Test"
          allData={mockData}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    test('n\'affiche rien si allData est vide', () => {
      const { container } = render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Droit pénal', 100)}
          label="Droit pénal"
          allData={[]}
        />
      );
      
      expect(container.firstChild).toBeNull();
    });

    test('affiche le nom de l\'élément', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Droit pénal', 100)}
          label="Droit pénal"
          allData={mockData}
        />
      );
      
      expect(screen.getByText('Droit pénal')).toBeInTheDocument();
    });

    test('affiche la valeur formatée', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Droit pénal', 1234)}
          label="Droit pénal"
          allData={[...mockData, { name: 'Droit pénal', value: 1234 }]}
        />
      );
      
      // Format français : 1 234 (avec espace)
      expect(screen.getByText(/1.*234/)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // TESTS : CALCUL DU POURCENTAGE
  // ==========================================================================
  
  describe('Calcul du pourcentage', () => {
    
    test('calcule correctement le pourcentage', () => {
      // Total = 100 + 80 + 60 + 40 + 20 = 300
      // 100 / 300 = 33.3%
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Droit pénal', 100)}
          label="Droit pénal"
          allData={mockData}
        />
      );
      
      expect(screen.getByText('33.3%')).toBeInTheDocument();
    });

    test('affiche 0% si la valeur est 0', () => {
      const dataWithZero = [
        { name: 'Domaine vide', value: 0 },
        { name: 'Autre', value: 100 }
      ];
      
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Domaine vide', 0)}
          label="Domaine vide"
          allData={dataWithZero}
        />
      );
      
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    test('affiche 100% si c\'est le seul élément', () => {
      const singleItem = [{ name: 'Unique', value: 42 }];
      
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Unique', 42)}
          label="Unique"
          allData={singleItem}
        />
      );
      
      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    test('n\'affiche pas le pourcentage si showPercentage=false', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Droit pénal', 100)}
          label="Droit pénal"
          allData={mockData}
          showPercentage={false}
        />
      );
      
      expect(screen.queryByText(/Part du total/)).not.toBeInTheDocument();
    });
  });

  // ==========================================================================
  // TESTS : CALCUL DU RANG
  // ==========================================================================
  
  describe('Calcul du rang', () => {
    
    test('affiche "1er" pour le premier élément', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Droit pénal', 100)}
          label="Droit pénal"
          allData={mockData}
        />
      );
      
      expect(screen.getByText(/1er sur 5/)).toBeInTheDocument();
    });

    test('affiche "2ème" pour le deuxième élément', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Droit civil', 80)}
          label="Droit civil"
          allData={mockData}
        />
      );
      
      expect(screen.getByText(/2ème sur 5/)).toBeInTheDocument();
    });

    test('affiche "5ème" pour le dernier élément', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Droit fiscal', 20)}
          label="Droit fiscal"
          allData={mockData}
        />
      );
      
      expect(screen.getByText(/5ème sur 5/)).toBeInTheDocument();
    });

    test('n\'affiche pas le rang si showRank=false', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Droit pénal', 100)}
          label="Droit pénal"
          allData={mockData}
          showRank={false}
        />
      );
      
      expect(screen.queryByText(/Classement/)).not.toBeInTheDocument();
    });

    test('gère correctement le classement avec valeurs égales', () => {
      const dataWithTies = [
        { name: 'A', value: 100 },
        { name: 'B', value: 100 },  // Ex-aequo
        { name: 'C', value: 50 }
      ];
      
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('A', 100)}
          label="A"
          allData={dataWithTies}
        />
      );
      
      // Le premier avec 100 devrait être 1er
      expect(screen.getByText(/1er sur 3/)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // TESTS : PERSONNALISATION
  // ==========================================================================
  
  describe('Options de personnalisation', () => {
    
    test('utilise le valueLabel personnalisé', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Test', 42)}
          label="Test"
          allData={[{ name: 'Test', value: 42 }]}
          valueLabel="Nombre de concordances"
        />
      );
      
      expect(screen.getByText(/Nombre de concordances/)).toBeInTheDocument();
    });

    test('utilise "Valeur" par défaut si valueLabel non fourni', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Test', 42)}
          label="Test"
          allData={[{ name: 'Test', value: 42 }]}
        />
      );
      
      expect(screen.getByText(/Valeur :/)).toBeInTheDocument();
    });

    test('peut désactiver à la fois le pourcentage et le rang', () => {
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Test', 42)}
          label="Test"
          allData={[{ name: 'Test', value: 42 }]}
          showPercentage={false}
          showRank={false}
        />
      );
      
      expect(screen.queryByText(/Part du total/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Classement/)).not.toBeInTheDocument();
    });
  });

  // ==========================================================================
  // TESTS : CAS LIMITES
  // ==========================================================================
  
  describe('Cas limites', () => {
    
    test('gère les valeurs très grandes', () => {
      const largeData = [{ name: 'Grand', value: 1234567 }];
      
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Grand', 1234567)}
          label="Grand"
          allData={largeData}
        />
      );
      
      // Format français avec espaces : 1 234 567
      expect(screen.getByText(/1.*234.*567/)).toBeInTheDocument();
    });

    test('gère les données avec propriété "count" au lieu de "value"', () => {
      const dataWithCount = [
        { name: 'Item 1', count: 50 },
        { name: 'Item 2', count: 30 }
      ];
      
      // Le composant doit gérer item.count || item.value
      render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Item 1', 50)}
          label="Item 1"
          allData={dataWithCount}
        />
      );
      
      // Devrait calculer 50/80 = 62.5%
      expect(screen.getByText('62.5%')).toBeInTheDocument();
    });

    test('gère un total de 0 sans crash', () => {
      const zeroData = [
        { name: 'A', value: 0 },
        { name: 'B', value: 0 }
      ];
      
      const { container } = render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('A', 0)}
          label="A"
          allData={zeroData}
        />
      );
      
      // Ne devrait pas crasher
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText(/0%/)).toBeInTheDocument();
    });

    test('utilise le label fourni si name n\'existe pas dans payload', () => {
      const payloadWithoutName = [{
        value: 100,
        payload: { value: 100 }
      }];
      
      render(
        <CustomTooltip
          active={true}
          payload={payloadWithoutName}
          label="Label personnalisé"
          allData={mockData}
        />
      );
      
      expect(screen.getByText('Label personnalisé')).toBeInTheDocument();
    });

    test('affiche "N/A" si ni label ni name ne sont fournis', () => {
      const payloadMinimal = [{
        value: 100,
        payload: { value: 100 }
      }];
      
      render(
        <CustomTooltip
          active={true}
          payload={payloadMinimal}
          label={undefined}
          allData={mockData}
        />
      );
      
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // TESTS : STYLE ET ACCESSIBILITÉ
  // ==========================================================================
  
  describe('Style et accessibilité', () => {
    
    test('applique le style académique', () => {
      const { container } = render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Test', 100)}
          label="Test"
          allData={mockData}
        />
      );
      
      const tooltip = container.firstChild;
      expect(tooltip).toHaveStyle({
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '2px solid #1A365D',
        borderRadius: '8px'
      });
    });

    test('utilise la police Crimson Text', () => {
      const { container } = render(
        <CustomTooltip
          active={true}
          payload={createMockPayload('Test', 100)}
          label="Test"
          allData={mockData}
        />
      );
      
      const tooltip = container.firstChild;
      expect(tooltip).toHaveStyle({
        fontFamily: '"Crimson Text", "Times New Roman", serif'
      });
    });
  });

  // ==========================================================================
  // TESTS : INTÉGRATION AVEC RECHARTS
  // ==========================================================================
  
  describe('Intégration Recharts', () => {
    
    test('accepte le format de données Recharts standard', () => {
      // Format typique fourni par Recharts
      const rechartsPayload = [{
        name: 'Droit pénal',
        value: 100,
        payload: {
          name: 'Droit pénal',
          value: 100,
          fill: '#553C9A'
        },
        dataKey: 'value',
        color: '#553C9A'
      }];
      
      render(
        <CustomTooltip
          active={true}
          payload={rechartsPayload}
          label="Droit pénal"
          allData={mockData}
        />
      );
      
      expect(screen.getByText('Droit pénal')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });
});
