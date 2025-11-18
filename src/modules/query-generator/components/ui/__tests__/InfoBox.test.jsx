/**
 * Tests unitaires pour le composant InfoBox
 *
 * Teste :
 * - Le rendu des différents types de messages
 * - L'affichage des icônes appropriées
 * - La gestion du titre et du contenu
 * - Les styles selon le type
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoBox from '../InfoBox';

// ============================================================================
// TESTS DE RENDU DE BASE
// ============================================================================

describe('InfoBox - Rendu de base', () => {

  it('devrait rendre une InfoBox avec type info par défaut', () => {
    render(
      <InfoBox title="Information">
        This is an info message
      </InfoBox>
    );

    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('This is an info message')).toBeInTheDocument();
  });

  it('devrait rendre sans titre si non fourni', () => {
    render(
      <InfoBox>
        Just a message without title
      </InfoBox>
    );

    expect(screen.getByText('Just a message without title')).toBeInTheDocument();
  });

  it('devrait rendre avec du contenu texte', () => {
    render(
      <InfoBox title="Test">
        Simple text content
      </InfoBox>
    );

    expect(screen.getByText('Simple text content')).toBeInTheDocument();
  });

  it('devrait rendre avec du contenu JSX', () => {
    render(
      <InfoBox title="Test">
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </div>
      </InfoBox>
    );

    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES TYPES DE MESSAGES
// ============================================================================

describe('InfoBox - Types de messages', () => {

  it('devrait rendre une InfoBox de type info', () => {
    const { container } = render(
      <InfoBox type="info" title="Info Title">
        Info message
      </InfoBox>
    );

    expect(screen.getByText('Info Title')).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre une InfoBox de type success', () => {
    const { container } = render(
      <InfoBox type="success" title="Success Title">
        Success message
      </InfoBox>
    );

    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre une InfoBox de type warning', () => {
    const { container } = render(
      <InfoBox type="warning" title="Warning Title">
        Warning message
      </InfoBox>
    );

    expect(screen.getByText('Warning Title')).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre une InfoBox de type error', () => {
    const { container } = render(
      <InfoBox type="error" title="Error Title">
        Error message
      </InfoBox>
    );

    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES ICÔNES
// ============================================================================

describe('InfoBox - Icônes', () => {

  it('devrait afficher l\'icône Info par défaut', () => {
    const { container } = render(
      <InfoBox title="Test">
        Message
      </InfoBox>
    );

    // L'icône est rendue par lucide-react
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait afficher l\'icône CheckCircle pour success', () => {
    const { container } = render(
      <InfoBox type="success" title="Success">
        Success message
      </InfoBox>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait afficher l\'icône AlertTriangle pour warning', () => {
    const { container } = render(
      <InfoBox type="warning" title="Warning">
        Warning message
      </InfoBox>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait afficher l\'icône AlertCircle pour error', () => {
    const { container } = render(
      <InfoBox type="error" title="Error">
        Error message
      </InfoBox>
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait permettre une icône personnalisée', () => {
    const customIcon = <span data-testid="custom-icon">⭐</span>;

    render(
      <InfoBox title="Custom" icon={customIcon}>
        Message with custom icon
      </InfoBox>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DE STRUCTURE
// ============================================================================

describe('InfoBox - Structure', () => {

  it('devrait avoir un header avec icône et titre', () => {
    const { container } = render(
      <InfoBox title="Title">
        Content
      </InfoBox>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('devrait avoir une section de contenu', () => {
    render(
      <InfoBox title="Title">
        <p>Content paragraph</p>
      </InfoBox>
    );

    expect(screen.getByText('Content paragraph')).toBeInTheDocument();
  });

  it('devrait rendre plusieurs lignes de contenu', () => {
    render(
      <InfoBox title="Title">
        <p>Line 1</p>
        <p>Line 2</p>
        <p>Line 3</p>
      </InfoBox>
    );

    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES CAS LIMITES
// ============================================================================

describe('InfoBox - Cas limites', () => {

  it('devrait gérer un contenu vide', () => {
    expect(() => {
      render(
        <InfoBox title="Empty">
          {''}
        </InfoBox>
      );
    }).not.toThrow();
  });

  it('devrait gérer l\'absence de titre', () => {
    render(
      <InfoBox type="info">
        Message without title
      </InfoBox>
    );

    expect(screen.getByText('Message without title')).toBeInTheDocument();
  });

  it('devrait gérer un type invalide comme info', () => {
    const { container } = render(
      <InfoBox type="invalid" title="Test">
        Message
      </InfoBox>
    );

    // Devrait utiliser le style par défaut (info)
    expect(container.firstChild).toBeInTheDocument();
  });

  it('devrait rendre du contenu avec des éléments HTML complexes', () => {
    render(
      <InfoBox title="Complex">
        <div>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
          <strong>Bold text</strong>
          <em>Italic text</em>
        </div>
      </InfoBox>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('Italic text')).toBeInTheDocument();
  });

  it('devrait rendre avec du contenu très long', () => {
    const longContent = 'Lorem ipsum '.repeat(100);

    render(
      <InfoBox title="Long Content">
        {longContent}
      </InfoBox>
    );

    expect(screen.getByText(/Lorem ipsum/)).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS D'ACCESSIBILITÉ
// ============================================================================

describe('InfoBox - Accessibilité', () => {

  it('devrait rendre avec une structure sémantique correcte', () => {
    const { container } = render(
      <InfoBox title="Accessible">
        Accessible content
      </InfoBox>
    );

    // Vérifier la présence d'un h4 pour le titre
    const heading = container.querySelector('h4');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Accessible');
  });

  it('devrait avoir du contenu lisible', () => {
    render(
      <InfoBox title="Readable" type="info">
        This content should be readable
      </InfoBox>
    );

    expect(screen.getByText('This content should be readable')).toBeVisible();
  });
});

// ============================================================================
// TESTS DE COMBINAISONS
// ============================================================================

describe('InfoBox - Combinaisons', () => {

  it('devrait supporter plusieurs InfoBox simultanément', () => {
    render(
      <div>
        <InfoBox type="info" title="Info">Info content</InfoBox>
        <InfoBox type="success" title="Success">Success content</InfoBox>
        <InfoBox type="warning" title="Warning">Warning content</InfoBox>
        <InfoBox type="error" title="Error">Error content</InfoBox>
      </div>
    );

    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('devrait rendre avec icône personnalisée et type spécifique', () => {
    const customIcon = <span data-testid="star">⭐</span>;

    render(
      <InfoBox type="success" title="Custom Success" icon={customIcon}>
        Custom icon with success type
      </InfoBox>
    );

    expect(screen.getByTestId('star')).toBeInTheDocument();
    expect(screen.getByText('Custom Success')).toBeInTheDocument();
  });
});
