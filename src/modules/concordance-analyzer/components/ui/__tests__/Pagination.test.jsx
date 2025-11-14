// src/components/ui/__tests__/Pagination.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();
  const mockOnItemsPerPageChange = jest.fn();

  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    itemsPerPage: 50,
    startIndex: 0,
    endIndex: 49,
    totalItems: 500,
    onPageChange: mockOnPageChange,
    onItemsPerPageChange: mockOnItemsPerPageChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu de base', () => {
    test('doit afficher le sélecteur d\'items par page', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText('Affichage :')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Tout')).toBeInTheDocument();
    });

    test('doit afficher l\'indicateur de position', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText('Affichage 1–50 sur 500 concordances')).toBeInTheDocument();
    });

    test('doit afficher les boutons de navigation', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByLabelText('Première page')).toBeInTheDocument();
      expect(screen.getByLabelText('Page précédente')).toBeInTheDocument();
      expect(screen.getByLabelText('Page suivante')).toBeInTheDocument();
      expect(screen.getByLabelText('Dernière page')).toBeInTheDocument();
    });

    test('doit afficher les numéros de pages', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
    });

    test('ne doit rien afficher si totalItems est 0', () => {
      const { container } = render(
        <Pagination {...defaultProps} totalItems={0} />
      );

      expect(container.firstChild).toBeNull();
    });

    test('ne doit pas afficher les contrôles de navigation si une seule page', () => {
      render(
        <Pagination
          {...defaultProps}
          totalPages={1}
          totalItems={25}
          endIndex={24}
        />
      );

      expect(screen.queryByLabelText('Première page')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Page suivante')).not.toBeInTheDocument();
    });
  });

  describe('Sélecteur d\'items par page', () => {
    test('doit marquer l\'option active', () => {
      render(<Pagination {...defaultProps} itemsPerPage={50} />);

      const button50 = screen.getByText('50');
      // Vérifier que le style active est appliqué via le style inline
      expect(button50).toHaveStyle({ backgroundColor: '#2c5f7c', color: '#ffffff' });
    });

    test('doit appeler onItemsPerPageChange avec la valeur correcte', () => {
      render(<Pagination {...defaultProps} />);

      const button100 = screen.getByText('100');
      fireEvent.click(button100);

      expect(mockOnItemsPerPageChange).toHaveBeenCalledWith(100);
      expect(mockOnItemsPerPageChange).toHaveBeenCalledTimes(1);
    });

    test('doit gérer le mode "Tout afficher"', () => {
      render(<Pagination {...defaultProps} />);

      const buttonAll = screen.getByText('Tout');
      fireEvent.click(buttonAll);

      expect(mockOnItemsPerPageChange).toHaveBeenCalledWith(-1);
    });

    test('doit utiliser les options personnalisées si fournies', () => {
      render(
        <Pagination
          {...defaultProps}
          itemsPerPageOptions={[10, 20, 30]}
        />
      );

      expect(screen.getByLabelText('Afficher 10 éléments par page')).toBeInTheDocument();
      expect(screen.getByLabelText('Afficher 20 éléments par page')).toBeInTheDocument();
      expect(screen.getByLabelText('Afficher 30 éléments par page')).toBeInTheDocument();
      expect(screen.queryByText('Tout')).not.toBeInTheDocument();
    });
  });

  describe('Navigation entre pages', () => {
    test('doit appeler onPageChange avec le numéro de page correct', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const page7Button = screen.getByLabelText('Page 7');
      fireEvent.click(page7Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(7);
    });

    test('doit aller à la page suivante', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const nextButton = screen.getByLabelText('Page suivante');
      fireEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    test('doit aller à la page précédente', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const prevButton = screen.getByLabelText('Page précédente');
      fireEvent.click(prevButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    test('doit aller à la première page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      const firstButton = screen.getByLabelText('Première page');
      fireEvent.click(firstButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    test('doit aller à la dernière page', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      const lastButton = screen.getByLabelText('Dernière page');
      fireEvent.click(lastButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(10);
    });
  });

  describe('État des boutons', () => {
    test('doit désactiver les boutons Première et Précédente sur la page 1', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);

      const firstButton = screen.getByLabelText('Première page');
      const prevButton = screen.getByLabelText('Page précédente');

      expect(firstButton).toBeDisabled();
      expect(prevButton).toBeDisabled();
    });

    test('doit désactiver les boutons Suivante et Dernière sur la dernière page', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);

      const nextButton = screen.getByLabelText('Page suivante');
      const lastButton = screen.getByLabelText('Dernière page');

      expect(nextButton).toBeDisabled();
      expect(lastButton).toBeDisabled();
    });

    test('doit activer tous les boutons sur une page intermédiaire', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);

      const firstButton = screen.getByLabelText('Première page');
      const prevButton = screen.getByLabelText('Page précédente');
      const nextButton = screen.getByLabelText('Page suivante');
      const lastButton = screen.getByLabelText('Dernière page');

      expect(firstButton).not.toBeDisabled();
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
      expect(lastButton).not.toBeDisabled();
    });
  });

  describe('Affichage des numéros de pages', () => {
    test('doit afficher tous les numéros si peu de pages (3 pages)', () => {
      render(<Pagination {...defaultProps} totalPages={3} />);

      expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
      // Pas d'ellipses avec seulement 3 pages
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    test('doit afficher des ellipses pour beaucoup de pages', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);

      const ellipses = screen.getAllByText('...');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    test('doit toujours afficher la première et dernière page', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={20} />);

      expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 20')).toBeInTheDocument();
    });

    test('doit afficher les pages autour de la page actuelle (delta = 2)', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={20} />);

      // Pages 8, 9, 10, 11, 12 doivent être visibles
      expect(screen.getByLabelText('Page 8')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 9')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 10')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 11')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 12')).toBeInTheDocument();
    });
  });

  describe('Indicateur de position', () => {
    test('doit afficher le singulier pour 1 concordance', () => {
      render(
        <Pagination
          {...defaultProps}
          totalItems={1}
          startIndex={0}
          endIndex={0}
          totalPages={1}
        />
      );

      expect(screen.getByText('Affichage 1–1 sur 1 concordance')).toBeInTheDocument();
    });

    test('doit afficher le pluriel pour plusieurs concordances', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByText('Affichage 1–50 sur 500 concordances')).toBeInTheDocument();
    });

    test('doit afficher les bons index pour une page intermédiaire', () => {
      render(
        <Pagination
          {...defaultProps}
          currentPage={3}
          startIndex={100}
          endIndex={149}
        />
      );

      expect(screen.getByText('Affichage 101–150 sur 500 concordances')).toBeInTheDocument();
    });

    test('doit gérer la dernière page incomplète', () => {
      render(
        <Pagination
          {...defaultProps}
          currentPage={10}
          startIndex={450}
          endIndex={499}
          totalPages={10}
        />
      );

      expect(screen.getByText('Affichage 451–500 sur 500 concordances')).toBeInTheDocument();
    });
  });

  describe('Accessibilité', () => {
    test('doit avoir des aria-labels sur tous les boutons', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByLabelText('Première page')).toBeInTheDocument();
      expect(screen.getByLabelText('Page précédente')).toBeInTheDocument();
      expect(screen.getByLabelText('Page suivante')).toBeInTheDocument();
      expect(screen.getByLabelText('Dernière page')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Afficher 50 éléments par page')).toBeInTheDocument();
    });

    test('doit marquer la page actuelle avec aria-current', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const currentPageButton = screen.getByLabelText('Page 3');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    test('ne doit pas avoir aria-current sur les autres pages', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const page1Button = screen.getByLabelText('Page 1');
      const page2Button = screen.getByLabelText('Page 2');

      expect(page1Button).not.toHaveAttribute('aria-current');
      expect(page2Button).not.toHaveAttribute('aria-current');
    });
  });

  describe('Cas limites', () => {
    test('doit gérer totalPages = 1', () => {
      render(
        <Pagination
          {...defaultProps}
          totalPages={1}
          totalItems={10}
          endIndex={9}
        />
      );

      // Les contrôles de navigation ne doivent pas s'afficher
      expect(screen.queryByLabelText('Première page')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Page suivante')).not.toBeInTheDocument();
    });

    test('doit gérer totalPages = 2', () => {
      render(
        <Pagination
          {...defaultProps}
          totalPages={2}
          totalItems={75}
        />
      );

      expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    test('doit gérer des très grandes valeurs', () => {
      render(
        <Pagination
          {...defaultProps}
          totalPages={1000}
          totalItems={50000}
          currentPage={500}
        />
      );

      expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 1000')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 500')).toBeInTheDocument();
    });
  });
});
