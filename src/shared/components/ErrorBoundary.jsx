/**
 * Composant ErrorBoundary - Capture les erreurs React
 *
 * Empêche qu'une erreur dans un composant enfant ne crash toute l'application.
 * Affiche une UI de fallback avec option de récupération.
 *
 * @module shared/components/ErrorBoundary
 *
 * @example
 * // Wrapper autour d'une section à risque
 * <ErrorBoundary>
 *   <ChartComponent data={data} />
 * </ErrorBoundary>
 *
 * @example
 * // Avec fallback personnalisé
 * <ErrorBoundary fallback={<p>Erreur de chargement</p>}>
 *   <DataView />
 * </ErrorBoundary>
 *
 * @example
 * // Avec callback onError
 * <ErrorBoundary onError={(error, info) => logToService(error)}>
 *   <ComplexComponent />
 * </ErrorBoundary>
 */

import React, { Component } from 'react';
import { logger } from '../utils/logger';

/**
 * Styles inline pour le composant de fallback
 * @type {Object}
 */
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    minHeight: '200px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    textAlign: 'center',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: '0.5rem',
  },
  message: {
    fontSize: '0.95rem',
    color: '#7F1D1D',
    marginBottom: '1rem',
    maxWidth: '400px',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#DC2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: '#B91C1C',
  },
  details: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#FEE2E2',
    borderRadius: '4px',
    fontSize: '0.8rem',
    color: '#7F1D1D',
    fontFamily: 'monospace',
    maxWidth: '100%',
    overflow: 'auto',
    textAlign: 'left',
  },
};

/**
 * Composant de fallback par défaut
 *
 * @param {Object} props
 * @param {Error} props.error - L'erreur capturée
 * @param {Function} props.resetError - Fonction pour reset l'erreur
 * @param {boolean} props.showDetails - Afficher les détails de l'erreur
 */
const DefaultFallback = ({ error, resetError, showDetails = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div style={styles.container} role="alert">
      <div style={styles.icon}>⚠️</div>
      <h3 style={styles.title}>Une erreur est survenue</h3>
      <p style={styles.message}>
        Cette section n&apos;a pas pu être affichée correctement.
        Vous pouvez essayer de recharger ou continuer à utiliser le reste de l&apos;application.
      </p>
      <button
        style={{
          ...styles.button,
          ...(isHovered ? styles.buttonHover : {}),
        }}
        onClick={resetError}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Réessayer
      </button>
      {showDetails && error && (
        <pre style={styles.details}>
          {error.message}
          {error.stack && `\n\n${error.stack.split('\n').slice(0, 5).join('\n')}`}
        </pre>
      )}
    </div>
  );
};

/**
 * Composant ErrorBoundary
 *
 * @class
 * @extends Component
 *
 * @property {React.ReactNode} children - Composants enfants à protéger
 * @property {React.ReactNode} [fallback] - UI de fallback personnalisée
 * @property {Function} [onError] - Callback appelé lors d'une erreur
 * @property {boolean} [showDetails] - Afficher les détails techniques (dev only)
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Met à jour le state quand une erreur est capturée
   * @param {Error} error
   * @returns {Object} Nouveau state
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Appelé après qu'une erreur ait été capturée
   * Permet de logger l'erreur
   *
   * @param {Error} error - L'erreur
   * @param {Object} errorInfo - Info sur le composant qui a crashé
   */
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log l'erreur
    logger.error('ErrorBoundary a capturé une erreur:', error);
    logger.error('Component stack:', errorInfo?.componentStack);

    // Appeler le callback si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset l'état d'erreur pour permettre un nouveau rendu
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, showDetails } = this.props;

    if (hasError) {
      // Si un fallback personnalisé est fourni, l'utiliser
      if (fallback) {
        // Si c'est un élément React, le cloner avec les props nécessaires
        if (React.isValidElement(fallback)) {
          return React.cloneElement(fallback, {
            error,
            resetError: this.resetError,
          });
        }
        // Si c'est une fonction, l'appeler
        if (typeof fallback === 'function') {
          return fallback({ error, resetError: this.resetError });
        }
        // Sinon, le retourner tel quel
        return fallback;
      }

      // Fallback par défaut
      return (
        <DefaultFallback
          error={error}
          resetError={this.resetError}
          showDetails={showDetails}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
