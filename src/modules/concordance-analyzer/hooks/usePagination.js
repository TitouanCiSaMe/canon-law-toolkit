// src/components/hook/usePagination.js

import { useState, useMemo, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer la pagination des données
 * 
 * @param {Array} data - Tableau de données à paginer
 * @param {number} defaultItemsPerPage - Nombre d'éléments par page par défaut (défaut: 50)
 * @param {string} storageKey - Clé pour persister le choix dans localStorage (défaut: 'pagination-items-per-page')
 * 
 * @returns {Object} Objet contenant :
 *   - currentPage: numéro de la page actuelle (1-indexed)
 *   - totalPages: nombre total de pages
 *   - itemsPerPage: nombre d'éléments par page
 *   - paginatedData: données de la page actuelle
 *   - goToPage: fonction pour aller à une page spécifique
 *   - goToFirstPage: fonction pour aller à la première page
 *   - goToLastPage: fonction pour aller à la dernière page
 *   - goToPreviousPage: fonction pour aller à la page précédente
 *   - goToNextPage: fonction pour aller à la page suivante
 *   - setItemsPerPage: fonction pour changer le nombre d'éléments par page
 *   - startIndex: index du premier élément affiché (0-indexed)
 *   - endIndex: index du dernier élément affiché (0-indexed)
 *   - totalItems: nombre total d'éléments
 * 
 * @example
 * const {
 *   currentPage,
 *   totalPages,
 *   paginatedData,
 *   goToNextPage,
 *   setItemsPerPage
 * } = usePagination(myData, 50);
 */
const usePagination = (data = [], defaultItemsPerPage = 50, storageKey = 'pagination-items-per-page') => {
  // Récupérer le choix persisté ou utiliser la valeur par défaut
  const getInitialItemsPerPage = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) : defaultItemsPerPage;
    } catch (error) {
      console.warn('Impossible de lire localStorage:', error);
      return defaultItemsPerPage;
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPageState] = useState(getInitialItemsPerPage);

  // Calculer le nombre total de pages
  const totalPages = useMemo(() => {
    if (!data || data.length === 0) return 0;
    if (itemsPerPage === -1) return 1; // Mode "Tout afficher"
    return Math.ceil(data.length / itemsPerPage);
  }, [data, itemsPerPage]);

  // Calculer les données de la page actuelle
  const paginatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (itemsPerPage === -1) return data; // Mode "Tout afficher"
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Calculer les index de début et fin
  const startIndex = useMemo(() => {
    if (!data || data.length === 0) return 0;
    if (itemsPerPage === -1) return 0;
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage, data]);

  const endIndex = useMemo(() => {
    if (!data || data.length === 0) return 0;
    if (itemsPerPage === -1) return data.length - 1;
    return Math.min(startIndex + itemsPerPage - 1, data.length - 1);
  }, [startIndex, itemsPerPage, data]);

  // Réinitialiser à la page 1 si les données changent
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Réinitialiser à la page 1 si on dépasse le nombre total de pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Fonction pour changer le nombre d'éléments par page
  const setItemsPerPage = (newItemsPerPage) => {
    setItemsPerPageState(newItemsPerPage);
    setCurrentPage(1); // Retour à la page 1
    
    // Persister le choix dans localStorage
    try {
      localStorage.setItem(storageKey, newItemsPerPage.toString());
    } catch (error) {
      console.warn('Impossible de sauvegarder dans localStorage:', error);
    }
  };

  // Fonctions de navigation
  const goToPage = (pageNumber) => {
    const page = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(page);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    setItemsPerPage,
    startIndex,
    endIndex,
    totalItems: data ? data.length : 0,
  };
};

export default usePagination;
