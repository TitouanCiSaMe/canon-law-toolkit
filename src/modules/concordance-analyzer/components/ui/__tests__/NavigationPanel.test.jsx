/**
 * Tests unitaires pour le composant NavigationPanel
 * 
 * Teste :
 * - Le rendu avec différentes props
 * - Les états hover et actif
 * - Les interactions onClick
 * - L'affichage des children
 * - Les styles appliqués
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationPanel from '../NavigationPanel';

// ============================================================================
// MOCKS ET DONNÉES DE TEST
// ============================================================================

const mockConfig = {
  id: 'test',
  title: 'Test Panel',
  subtitle: 'Test Subtitle',
  color: '#1A365D',
  gradient: 'linear-gradient(135deg, #1A365D 0%, #2C5282 100%)',
  icon: '📊',
  gridArea: '1 / 1 / 2 / 2',
  size: 'medium'
};

const mockConfigLarge = {
  ...mockConfig,
  size: 'large'
};

const mockConfigWide = {
  ...mockConfig,
  size: 'wide'
};

// ============================================================================
// TESTS DE RENDU DE BASE
// ============================================================================

describe('NavigationPanel - Rendu de base', () => {
  
  it('devrait rendre le composant sans erreur', () => {
    const mockOnClick = jest.fn();
    
    render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      >
        <div>Test content</div>
      </NavigationPanel>
    );
    
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
  });

  it('devrait afficher le titre correctement', () => {
    const mockOnClick = jest.fn();
    
    render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
  });

  it('devrait afficher le sous-titre correctement', () => {
    const mockOnClick = jest.fn();
    
    render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('devrait afficher les children fournis', () => {
    const mockOnClick = jest.fn();
    
    render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      >
        <div data-testid="child-content">Child Content</div>
      </NavigationPanel>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES INTERACTIONS
// ============================================================================

describe('NavigationPanel - Interactions', () => {
  
  it('devrait appeler onClick quand le panel est cliqué', () => {
    const mockOnClick = jest.fn();
    
    render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = screen.getByText('Test Panel').closest('div');
    fireEvent.click(panel);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('ne devrait pas crash si onClick n\'est pas fourni', () => {
    render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={undefined}
      />
    );
    
    const panel = screen.getByText('Test Panel').closest('div');
    expect(() => fireEvent.click(panel)).not.toThrow();
  });
});

// ============================================================================
// TESTS DES ÉTATS
// ============================================================================

describe('NavigationPanel - États', () => {
  
  it('devrait appliquer les styles pour l\'état actif', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={true} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    expect(panel).toHaveStyle({ border: '3px solid #F7FAFC' });
  });

  it('devrait appliquer les styles pour l\'état inactif', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    expect(panel).toHaveStyle({ border: '1px solid rgba(255,255,255,0.1)' });
  });

  it('devrait gérer le survol (mouseEnter)', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    
    // Avant hover
    expect(panel).toHaveStyle({ transform: 'scale(1)' });
    
    // Simuler hover
    fireEvent.mouseEnter(panel);
    
    // Après hover
    expect(panel).toHaveStyle({ transform: 'scale(1.02)' });
  });

  it('devrait gérer la sortie du survol (mouseLeave)', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    
    // Simuler hover puis sortie
    fireEvent.mouseEnter(panel);
    fireEvent.mouseLeave(panel);
    
    // Retour à l'état normal
    expect(panel).toHaveStyle({ transform: 'scale(1)' });
  });
});

// ============================================================================
// TESTS DES STYLES ET CONFIGURATION
// ============================================================================

describe('NavigationPanel - Styles et configuration', () => {
  
  it('devrait appliquer le gradient de config', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    expect(panel).toHaveStyle({ 
      background: 'linear-gradient(135deg, #1A365D 0%, #2C5282 100%)' 
    });
  });

  it('devrait appliquer gridArea depuis config', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    expect(panel).toHaveStyle({ gridArea: '1 / 1 / 2 / 2' });
  });

  it('devrait adapter le padding selon size=large', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfigLarge} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    expect(panel).toHaveStyle({ padding: '3rem' });
  });

  it('devrait adapter le padding selon size=wide', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfigWide} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    expect(panel).toHaveStyle({ padding: '2rem' });
  });

  it('devrait utiliser padding par défaut pour size=medium', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    expect(panel).toHaveStyle({ padding: '2rem' });
  });
});

// ============================================================================
// TESTS DE CAS LIMITES
// ============================================================================

describe('NavigationPanel - Cas limites', () => {
  
  it('devrait gérer un config sans subtitle', () => {
    const mockOnClick = jest.fn();
    const configNoSubtitle = { ...mockConfig, subtitle: '' };
    
    render(
      <NavigationPanel 
        config={configNoSubtitle} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
  });

  it('devrait gérer des children vides', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      >
        {null}
      </NavigationPanel>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait gérer le hover et vérifier les changements de style', () => {
    const mockOnClick = jest.fn();
    
    const { container } = render(
      <NavigationPanel 
        config={mockConfig} 
        isActive={false} 
        onClick={mockOnClick}
      />
    );
    
    const panel = container.firstChild;
    
    // Avant hover
    expect(panel).toHaveStyle({ transform: 'scale(1)' });
    
    // Simuler hover
    fireEvent.mouseEnter(panel);
    
    // Après hover - vérifier le changement
    expect(panel).toHaveStyle({ transform: 'scale(1.02)' });
  });
});
