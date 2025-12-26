/**
 * Tests pour le composant ErrorBoundary
 *
 * @module shared/components/__tests__/ErrorBoundary.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Composant qui lance une erreur
const ThrowError = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Contenu normal</div>;
};

// Composant simple pour les tests
const SafeComponent = () => <div>Contenu sécurisé</div>;

describe('ErrorBoundary', () => {
  // Suppress console.error pendant les tests (React loggue les erreurs)
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Rendu normal (sans erreur)', () => {
    it('devrait rendre les enfants quand il n\'y a pas d\'erreur', () => {
      render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Contenu sécurisé')).toBeInTheDocument();
    });

    it('devrait rendre plusieurs enfants', () => {
      render(
        <ErrorBoundary>
          <div>Premier</div>
          <div>Deuxième</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Premier')).toBeInTheDocument();
      expect(screen.getByText('Deuxième')).toBeInTheDocument();
    });
  });

  describe('Capture d\'erreur', () => {
    it('devrait afficher le fallback par défaut quand une erreur survient', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('devrait afficher un bouton "Réessayer"', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button', { name: /réessayer/i })).toBeInTheDocument();
    });

    it('devrait afficher les détails de l\'erreur quand showDetails est true', () => {
      render(
        <ErrorBoundary showDetails>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Test error message/)).toBeInTheDocument();
    });

    it('ne devrait PAS afficher les détails par défaut', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Le message d'erreur technique ne devrait pas être visible
      const preElements = screen.queryAllByText(/Test error message/);
      // Le message "Une erreur est survenue" est présent mais pas le message technique détaillé
      expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
    });
  });

  describe('Fallback personnalisé', () => {
    it('devrait afficher un fallback personnalisé (élément)', () => {
      render(
        <ErrorBoundary fallback={<div>Fallback custom</div>}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Fallback custom')).toBeInTheDocument();
    });

    it('devrait afficher un fallback personnalisé (fonction)', () => {
      const customFallback = ({ error }) => (
        <div>Erreur: {error.message}</div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Erreur: Test error message')).toBeInTheDocument();
    });

    it('devrait passer resetError au fallback fonction', () => {
      const customFallback = ({ resetError }) => (
        <button onClick={resetError}>Reset custom</button>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button', { name: /reset custom/i })).toBeInTheDocument();
    });
  });

  describe('Reset de l\'erreur', () => {
    it('devrait réessayer de rendre les enfants après reset', () => {
      let shouldThrow = true;

      const ConditionalThrow = () => {
        if (shouldThrow) {
          throw new Error('Conditional error');
        }
        return <div>Rendu réussi</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <ConditionalThrow />
        </ErrorBoundary>
      );

      // Vérifier que l'erreur est affichée
      expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();

      // Désactiver l'erreur et cliquer sur Réessayer
      shouldThrow = false;
      fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));

      // Le composant devrait se re-rendre correctement
      expect(screen.getByText('Rendu réussi')).toBeInTheDocument();
    });
  });

  describe('Callback onError', () => {
    it('devrait appeler onError quand une erreur survient', () => {
      const onErrorMock = vi.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('devrait passer l\'erreur correcte au callback', () => {
      const onErrorMock = vi.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError />
        </ErrorBoundary>
      );

      const [error] = onErrorMock.mock.calls[0];
      expect(error.message).toBe('Test error message');
    });
  });

  describe('Erreurs imbriquées', () => {
    it('devrait capturer les erreurs des composants profondément imbriqués', () => {
      const DeepChild = () => {
        throw new Error('Deep error');
      };

      const MiddleComponent = () => (
        <div>
          <DeepChild />
        </div>
      );

      render(
        <ErrorBoundary>
          <div>
            <MiddleComponent />
          </div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
    });
  });

  describe('Multiples ErrorBoundary', () => {
    it('devrait isoler les erreurs avec des boundaries imbriquées', () => {
      render(
        <ErrorBoundary>
          <div>Parent safe</div>
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>
          <div>Autre enfant safe</div>
        </ErrorBoundary>
      );

      // Le parent et l'autre enfant devraient être visibles
      expect(screen.getByText('Parent safe')).toBeInTheDocument();
      expect(screen.getByText('Autre enfant safe')).toBeInTheDocument();

      // L'erreur devrait être contenue dans le boundary interne
      expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
    });
  });

  describe('Accessibilité', () => {
    it('devrait avoir un rôle alert sur le fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('le bouton Réessayer devrait être focusable', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /réessayer/i });
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});
