// src/components/ui/Pagination.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Composant de pagination avec contrôles de navigation et sélecteur d'éléments par page
 * 
 * @component
 * @param {Object} props
 * @param {number} props.currentPage - Page actuelle (1-indexed)
 * @param {number} props.totalPages - Nombre total de pages
 * @param {number} props.itemsPerPage - Nombre d'éléments par page
 * @param {number} props.startIndex - Index du premier élément affiché (0-indexed)
 * @param {number} props.endIndex - Index du dernier élément affiché (0-indexed)
 * @param {number} props.totalItems - Nombre total d'éléments
 * @param {Function} props.onPageChange - Callback appelé lors du changement de page
 * @param {Function} props.onItemsPerPageChange - Callback appelé lors du changement d'éléments par page
 * @param {Array<number>} [props.itemsPerPageOptions=[25, 50, 100, -1]] - Options pour le sélecteur
 * 
 * @example
 * <Pagination
 *   currentPage={2}
 *   totalPages={10}
 *   itemsPerPage={50}
 *   startIndex={50}
 *   endIndex={99}
 *   totalItems={500}
 *   onPageChange={(page) => console.log(page)}
 *   onItemsPerPageChange={(items) => console.log(items)}
 * />
 */
const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [25, 50, 100, -1],
}) => {
  const { t } = useTranslation();

  // Ne rien afficher si pas de données
  if (totalItems === 0) {
    return null;
  }

  /**
   * Génère les numéros de pages à afficher
   * Logique : afficher les pages autour de la page actuelle + première et dernière
   */
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Nombre de pages à afficher de chaque côté de la page actuelle

    // Toujours afficher la première page
    pages.push(1);

    // Calculer la plage autour de la page actuelle
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Ajouter "..." si nécessaire avant la plage
    if (rangeStart > 2) {
      pages.push('...');
    }

    // Ajouter les pages de la plage
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Ajouter "..." si nécessaire après la plage
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    // Toujours afficher la dernière page (si plus d'une page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Styles inline
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      margin: '1rem 0',
    },
    itemsSelector: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    label: {
      fontWeight: 600,
      color: '#495057',
      fontSize: '0.9rem',
    },
    itemsOption: {
      padding: '0.4rem 0.8rem',
      backgroundColor: '#ffffff',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: '#495057',
      transition: 'all 0.2s ease',
    },
    itemsOptionActive: {
      backgroundColor: '#2c5f7c',
      color: '#ffffff',
      borderColor: '#2c5f7c',
      fontWeight: 600,
    },
    info: {
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#6c757d',
      fontWeight: 500,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    button: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ffffff',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: '#495057',
      transition: 'all 0.2s ease',
      fontWeight: 500,
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      color: '#adb5bd',
    },
    numbers: {
      display: 'flex',
      gap: '0.25rem',
      alignItems: 'center',
    },
    number: {
      minWidth: '2.5rem',
      padding: '0.5rem 0.75rem',
      backgroundColor: '#ffffff',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: '#495057',
      transition: 'all 0.2s ease',
      fontWeight: 500,
      textAlign: 'center',
    },
    numberActive: {
      backgroundColor: '#2c5f7c',
      color: '#ffffff',
      borderColor: '#2c5f7c',
      fontWeight: 600,
    },
    ellipsis: {
      padding: '0.5rem 0.25rem',
      color: '#6c757d',
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      {/* Sélecteur d'éléments par page */}
      <div style={styles.itemsSelector}>
        <span style={styles.label}>{t('pagination.display')}</span>
        {itemsPerPageOptions.map((option) => (
          <button
            key={option}
            style={{
              ...styles.itemsOption,
              ...(itemsPerPage === option ? styles.itemsOptionActive : {}),
            }}
            onClick={() => onItemsPerPageChange(option)}
            onMouseEnter={(e) => {
              if (itemsPerPage !== option) {
                e.target.style.backgroundColor = '#e9ecef';
                e.target.style.borderColor = '#adb5bd';
              }
            }}
            onMouseLeave={(e) => {
              if (itemsPerPage !== option) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#ced4da';
              }
            }}
            aria-label={option === -1 ? t('pagination.showAll') : `${t('pagination.display')} ${option}`}
          >
            {option === -1 ? t('pagination.all') : option}
          </button>
        ))}
      </div>

      {/* Indicateur de position */}
      <div style={styles.info}>
        Affichage {startIndex + 1}–{endIndex + 1} sur {totalItems} concordance{totalItems > 1 ? 's' : ''}
      </div>

      {/* Navigation par pages (seulement si plus d'une page) */}
      {totalPages > 1 && (
        <div style={styles.controls}>
          {/* Bouton Première page */}
          <button
            style={{
              ...styles.button,
              ...(currentPage === 1 ? styles.buttonDisabled : {}),
            }}
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#e9ecef';
                e.target.style.borderColor = '#adb5bd';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#ced4da';
              }
            }}
            aria-label={t('pagination.firstPage')}
            title={t('pagination.firstPage')}
          >
            {t('pagination.first')}
          </button>

          {/* Bouton Page précédente */}
          <button
            style={{
              ...styles.button,
              ...(currentPage === 1 ? styles.buttonDisabled : {}),
            }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#e9ecef';
                e.target.style.borderColor = '#adb5bd';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#ced4da';
              }
            }}
            aria-label={t('pagination.previousPage')}
            title={t('pagination.previousPage')}
          >
            {t('pagination.previous')}
          </button>

          {/* Numéros de pages */}
          <div style={styles.numbers}>
            {pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} style={styles.ellipsis}>
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  style={{
                    ...styles.number,
                    ...(currentPage === page ? styles.numberActive : {}),
                  }}
                  onClick={() => onPageChange(page)}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.target.style.backgroundColor = '#e9ecef';
                      e.target.style.borderColor = '#adb5bd';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.borderColor = '#ced4da';
                    }
                  }}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Bouton Page suivante */}
          <button
            style={{
              ...styles.button,
              ...(currentPage === totalPages ? styles.buttonDisabled : {}),
            }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = '#e9ecef';
                e.target.style.borderColor = '#adb5bd';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#ced4da';
              }
            }}
            aria-label={t('pagination.nextPage')}
            title={t('pagination.nextPage')}
          >
            {t('pagination.next')}
          </button>

          {/* Bouton Dernière page */}
          <button
            style={{
              ...styles.button,
              ...(currentPage === totalPages ? styles.buttonDisabled : {}),
            }}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = '#e9ecef';
                e.target.style.borderColor = '#adb5bd';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#ced4da';
              }
            }}
            aria-label={t('pagination.lastPage')}
            title={t('pagination.lastPage')}
          >
            {t('pagination.last')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
