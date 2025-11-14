/**
 * Hook useCorpusComparison - Comparaison de 2 corpus distincts
 * 
 * Calcule les analytics séparés pour chaque corpus et les différences
 */

import { useMemo } from 'react';
import { useAnalytics } from './useAnalytics';

/**
 * Calcule les différences entre 2 distributions
 * @param {Array} dataA - Distribution corpus A [{name, value}]
 * @param {Array} dataB - Distribution corpus B [{name, value}]
 * @returns {Object} Différences calculées
 */
const calculateDistributionDifferences = (dataA, dataB) => {
  // Créer des maps pour accès rapide
  const mapA = new Map(dataA.map(item => [item.name, item.value]));
  const mapB = new Map(dataB.map(item => [item.name, item.value]));
  
  // Trouver toutes les clés uniques
  const allKeys = new Set([...mapA.keys(), ...mapB.keys()]);
  
  // Calculer les différences
  const differences = [];
  const common = [];
  const onlyA = [];
  const onlyB = [];
  
  allKeys.forEach(key => {
    const valueA = mapA.get(key) || 0;
    const valueB = mapB.get(key) || 0;
    
    if (valueA > 0 && valueB > 0) {
      // Présent dans les 2
      common.push({
        name: key,
        valueA,
        valueB,
        diff: valueB - valueA,
        diffPercent: valueA > 0 ? ((valueB - valueA) / valueA * 100).toFixed(1) : 0
      });
    } else if (valueA > 0) {
      // Uniquement dans A
      onlyA.push({ name: key, value: valueA });
    } else {
      // Uniquement dans B
      onlyB.push({ name: key, value: valueB });
    }
  });
  
  // Trier par différence absolue décroissante
  differences.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  
  return {
    common: common.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)),
    onlyA: onlyA.sort((a, b) => b.value - a.value),
    onlyB: onlyB.sort((a, b) => b.value - a.value),
    totalCommon: common.length,
    totalOnlyA: onlyA.length,
    totalOnlyB: onlyB.length
  };
};

/**
 * Calcule les différences temporelles entre 2 corpus
 * @param {Array} periodsA - Périodes corpus A [{period, count}]
 * @param {Array} periodsB - Périodes corpus B [{period, count}]
 * @returns {Object} Différences temporelles
 */
const calculateTemporalDifferences = (periodsA, periodsB) => {
  // Créer des maps pour accès rapide
  const mapA = new Map(periodsA.map(item => [item.period, item.count]));
  const mapB = new Map(periodsB.map(item => [item.period, item.count]));
  
  // Trouver toutes les périodes
  const allPeriods = new Set([...mapA.keys(), ...mapB.keys()]);
  
  // Calculer les différences par période
  const differences = [];
  
  allPeriods.forEach(period => {
    const countA = mapA.get(period) || 0;
    const countB = mapB.get(period) || 0;
    
    differences.push({
      period,
      countA,
      countB,
      diff: countB - countA,
      diffPercent: countA > 0 ? ((countB - countA) / countA * 100).toFixed(1) : 0
    });
  });
  
  // Trier par période
  differences.sort((a, b) => a.period - b.period);
  
  // Statistiques
  const periodRangeA = periodsA.length > 0 
    ? { min: Math.min(...periodsA.map(p => p.period)), max: Math.max(...periodsA.map(p => p.period)) }
    : { min: 0, max: 0 };
    
  const periodRangeB = periodsB.length > 0
    ? { min: Math.min(...periodsB.map(p => p.period)), max: Math.max(...periodsB.map(p => p.period)) }
    : { min: 0, max: 0 };
  
  return {
    differences,
    rangeA: periodRangeA,
    rangeB: periodRangeB,
    overlapStart: Math.max(periodRangeA.min, periodRangeB.min),
    overlapEnd: Math.min(periodRangeA.max, periodRangeB.max)
  };
};

/**
 * Hook principal pour la comparaison de 2 corpus
 * 
 * @param {Array} dataA - Données concordances corpus A
 * @param {Array} dataB - Données concordances corpus B
 * @returns {Object} Analytics et différences calculées
 */
export const useCorpusComparison = (dataA, dataB) => {
  // Calcul des analytics séparés pour chaque corpus
  const analyticsA = useAnalytics(dataA || []);
  const analyticsB = useAnalytics(dataB || []);
  
  // Calcul des différences (memoized)
  const differences = useMemo(() => {
    if (!dataA?.length || !dataB?.length) {
      return {
        domains: { common: [], onlyA: [], onlyB: [], totalCommon: 0, totalOnlyA: 0, totalOnlyB: 0 },
        authors: { common: [], onlyA: [], onlyB: [], totalCommon: 0, totalOnlyA: 0, totalOnlyB: 0 },
        places: { common: [], onlyA: [], onlyB: [], totalCommon: 0, totalOnlyA: 0, totalOnlyB: 0 },
        temporal: { differences: [], rangeA: { min: 0, max: 0 }, rangeB: { min: 0, max: 0 } }
      };
    }
    
    return {
      domains: calculateDistributionDifferences(analyticsA.domains, analyticsB.domains),
      authors: calculateDistributionDifferences(analyticsA.authors, analyticsB.authors),
      places: calculateDistributionDifferences(analyticsA.places, analyticsB.places),
      temporal: calculateTemporalDifferences(analyticsA.periods, analyticsB.periods)
    };
  }, [analyticsA, analyticsB, dataA, dataB]);
  
  // Statistiques globales de comparaison
  const comparisonStats = useMemo(() => {
    if (!dataA?.length || !dataB?.length) {
      return {
        totalA: 0,
        totalB: 0,
        ratio: 0,
        largerCorpus: null
      };
    }
    
    const totalA = analyticsA.total;
    const totalB = analyticsB.total;
    const ratio = totalB > 0 ? (totalA / totalB).toFixed(2) : 0;
    const largerCorpus = totalA > totalB ? 'A' : totalB > totalA ? 'B' : 'equal';
    
    return {
      totalA,
      totalB,
      ratio,
      largerCorpus,
      percentDiff: totalA > 0 ? (((totalB - totalA) / totalA) * 100).toFixed(1) : 0
    };
  }, [analyticsA, analyticsB, dataA, dataB]);
  
  return {
    // Analytics séparés
    analyticsA,
    analyticsB,
    
    // Différences calculées
    differences,
    
    // Stats globales
    comparisonStats,
    
    // État
    isReady: !!(dataA?.length && dataB?.length)
  };
};
