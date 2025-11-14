// src/components/hook/usePagination.test.js

import { renderHook, act } from '@testing-library/react';
import usePagination from '../usePagination';

describe('usePagination', () => {
  // Données de test
  const testData = Array.from({ length: 125 }, (_, i) => ({
    id: i + 1,
    value: `Item ${i + 1}`
  }));

  // Nettoyer localStorage avant chaque test
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initialisation', () => {
    test('doit initialiser avec les valeurs par défaut', () => {
      const { result } = renderHook(() => usePagination(testData));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.itemsPerPage).toBe(50);
      expect(result.current.totalPages).toBe(3); // 125 items / 50 = 3 pages
      expect(result.current.totalItems).toBe(125);
    });

    test('doit initialiser avec itemsPerPage personnalisé', () => {
      const { result } = renderHook(() => usePagination(testData, 25));

      expect(result.current.itemsPerPage).toBe(25);
      expect(result.current.totalPages).toBe(5); // 125 items / 25 = 5 pages
    });

    test('doit retourner les bonnes données paginées pour la première page', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      expect(result.current.paginatedData).toHaveLength(50);
      expect(result.current.paginatedData[0]).toEqual({ id: 1, value: 'Item 1' });
      expect(result.current.paginatedData[49]).toEqual({ id: 50, value: 'Item 50' });
    });

    test('doit calculer correctement startIndex et endIndex', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      expect(result.current.startIndex).toBe(0);
      expect(result.current.endIndex).toBe(49);
    });
  });

  describe('Navigation entre pages', () => {
    test('goToNextPage doit aller à la page suivante', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.paginatedData[0]).toEqual({ id: 51, value: 'Item 51' });
    });

    test('goToPreviousPage doit aller à la page précédente', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.goToPage(2);
      });
      act(() => {
        result.current.goToPreviousPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    test('goToFirstPage doit aller à la première page', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.goToPage(3);
      });
      act(() => {
        result.current.goToFirstPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    test('goToLastPage doit aller à la dernière page', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.goToLastPage();
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.paginatedData).toHaveLength(25); // Dernière page: 125 - 100 = 25 items
    });

    test('goToPage doit aller à une page spécifique', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.goToPage(2);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.startIndex).toBe(50);
      expect(result.current.endIndex).toBe(99);
    });

    test('ne doit pas dépasser la dernière page avec goToNextPage', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.goToLastPage();
      });
      act(() => {
        result.current.goToNextPage();
      });

      expect(result.current.currentPage).toBe(3); // Reste sur la dernière page
    });

    test('ne doit pas descendre en dessous de la page 1 avec goToPreviousPage', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.goToPreviousPage();
      });

      expect(result.current.currentPage).toBe(1); // Reste sur la première page
    });
  });

  describe('Changement du nombre d\'éléments par page', () => {
    test('setItemsPerPage doit changer le nombre d\'éléments et revenir à la page 1', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.goToPage(2);
      });
      act(() => {
        result.current.setItemsPerPage(25);
      });

      expect(result.current.itemsPerPage).toBe(25);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(5);
    });

    test('mode "Tout afficher" (-1) doit retourner toutes les données', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.setItemsPerPage(-1);
      });

      expect(result.current.totalPages).toBe(1);
      expect(result.current.paginatedData).toHaveLength(125);
      expect(result.current.startIndex).toBe(0);
      expect(result.current.endIndex).toBe(124);
    });

    test('doit persister le choix dans localStorage', () => {
      const { result } = renderHook(() => usePagination(testData, 50, 'test-key'));

      act(() => {
        result.current.setItemsPerPage(100);
      });

      expect(localStorage.getItem('test-key')).toBe('100');
    });

    test('doit récupérer la valeur depuis localStorage à l\'initialisation', () => {
      localStorage.setItem('test-key', '75');

      const { result } = renderHook(() => usePagination(testData, 50, 'test-key'));

      expect(result.current.itemsPerPage).toBe(75);
    });
  });

  describe('Cas limites', () => {
    test('doit gérer un tableau vide', () => {
      const { result } = renderHook(() => usePagination([], 50));

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.paginatedData).toEqual([]);
      expect(result.current.totalItems).toBe(0);
    });

    test('doit gérer des données undefined', () => {
      const { result } = renderHook(() => usePagination(undefined, 50));

      expect(result.current.totalPages).toBe(0);
      expect(result.current.paginatedData).toEqual([]);
      expect(result.current.totalItems).toBe(0);
    });

    test('doit réinitialiser à la page 1 quand les données changent', () => {
      const { result, rerender } = renderHook(
        ({ data }) => usePagination(data, 50),
        { initialProps: { data: testData } }
      );

      act(() => {
        result.current.goToPage(3);
      });
      expect(result.current.currentPage).toBe(3);

      const newData = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
      rerender({ data: newData });

      expect(result.current.currentPage).toBe(1);
    });

    test('doit réinitialiser à la page 1 si la page actuelle dépasse le total', () => {
      const { result, rerender } = renderHook(
        ({ data }) => usePagination(data, 50),
        { initialProps: { data: testData } }
      );

      act(() => {
        result.current.goToPage(3);
      });
      expect(result.current.currentPage).toBe(3);

      const smallData = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
      rerender({ data: smallData });

      expect(result.current.currentPage).toBe(1);
    });

    test('goToPage doit limiter aux bornes valides', () => {
      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.goToPage(999);
      });
      expect(result.current.currentPage).toBe(3); // Dernière page

      act(() => {
        result.current.goToPage(-5);
      });
      expect(result.current.currentPage).toBe(1); // Première page
    });
  });

  describe('Gestion des erreurs localStorage', () => {
    test('doit gérer les erreurs de lecture localStorage', () => {
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('localStorage error');
      });

      const { result } = renderHook(() => usePagination(testData, 50));

      expect(result.current.itemsPerPage).toBe(50); // Utilise la valeur par défaut

      Storage.prototype.getItem = originalGetItem;
    });

    test('doit gérer les erreurs d\'écriture localStorage', () => {
      const originalSetItem = Storage.prototype.setItem;
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('localStorage error');
      });

      const { result } = renderHook(() => usePagination(testData, 50));

      act(() => {
        result.current.setItemsPerPage(100);
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(result.current.itemsPerPage).toBe(100); // Valeur quand même mise à jour en mémoire

      Storage.prototype.setItem = originalSetItem;
      consoleWarnSpy.mockRestore();
    });
  });
});
