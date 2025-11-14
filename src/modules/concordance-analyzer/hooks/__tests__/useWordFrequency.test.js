// src/components/hook/__tests__/useWordFrequency.test.js

import { renderHook } from '@testing-library/react';
import useWordFrequency from '../useWordFrequency';

describe('useWordFrequency', () => {
  // Données de test
  const sampleData = [
    { id: 1, kwic: 'ecclesia' },
    { id: 2, kwic: 'ecclesia' },
    { id: 3, kwic: 'ecclesia' },
    { id: 4, kwic: 'iudex' },
    { id: 5, kwic: 'iudex' },
    { id: 6, kwic: 'papa' },
    { id: 7, kwic: 'dominus' },
    { id: 8, kwic: 'rex' },
  ];

  describe('Calcul des fréquences', () => {
    test('doit calculer correctement les fréquences des termes KWIC', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData));

      expect(result.current.wordData).toHaveLength(5);
      expect(result.current.wordData[0]).toEqual({ text: 'ecclesia', value: 3 });
      expect(result.current.wordData[1]).toEqual({ text: 'iudex', value: 2 });
    });

    test('doit trier les mots par fréquence décroissante', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData));

      const frequencies = result.current.wordData.map(w => w.value);
      // Vérifier que les fréquences sont en ordre décroissant
      for (let i = 0; i < frequencies.length - 1; i++) {
        expect(frequencies[i]).toBeGreaterThanOrEqual(frequencies[i + 1]);
      }
    });

    test('doit compter le nombre total d\'occurrences', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData));

      expect(result.current.totalWords).toBe(8);
    });

    test('doit compter le nombre de mots uniques', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData));

      expect(result.current.uniqueWords).toBe(5);
    });

    test('doit identifier le mot le plus fréquent', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData));

      expect(result.current.topWord).toEqual({ text: 'ecclesia', value: 3 });
    });
  });

  describe('Normalisation des termes', () => {
    test('doit normaliser les termes en minuscules', () => {
      const dataWithCaps = [
        { id: 1, kwic: 'ECCLESIA' },
        { id: 2, kwic: 'Ecclesia' },
        { id: 3, kwic: 'ecclesia' },
      ];

      const { result } = renderHook(() => useWordFrequency(dataWithCaps));

      expect(result.current.wordData).toHaveLength(1);
      expect(result.current.wordData[0]).toEqual({ text: 'ecclesia', value: 3 });
    });

    test('doit supprimer les espaces au début et à la fin', () => {
      const dataWithSpaces = [
        { id: 1, kwic: '  ecclesia  ' },
        { id: 2, kwic: 'ecclesia' },
        { id: 3, kwic: '  ecclesia' },
      ];

      const { result } = renderHook(() => useWordFrequency(dataWithSpaces));

      expect(result.current.wordData).toHaveLength(1);
      expect(result.current.wordData[0]).toEqual({ text: 'ecclesia', value: 3 });
    });

    test('doit combiner normalisation minuscules et trim', () => {
      const dataMixed = [
        { id: 1, kwic: '  ECCLESIA  ' },
        { id: 2, kwic: 'Ecclesia' },
        { id: 3, kwic: 'ecclesia  ' },
      ];

      const { result } = renderHook(() => useWordFrequency(dataMixed));

      expect(result.current.wordData).toHaveLength(1);
      expect(result.current.wordData[0].value).toBe(3);
    });
  });

  describe('Filtrage des termes', () => {
    test('doit ignorer les termes vides', () => {
      const dataWithEmpty = [
        { id: 1, kwic: 'ecclesia' },
        { id: 2, kwic: '' },
        { id: 3, kwic: '   ' },
        { id: 4, kwic: 'iudex' },
      ];

      const { result } = renderHook(() => useWordFrequency(dataWithEmpty));

      expect(result.current.wordData).toHaveLength(2);
      expect(result.current.totalWords).toBe(2);
    });

    test('doit ignorer les termes de moins de 2 caractères', () => {
      const dataWithShort = [
        { id: 1, kwic: 'ecclesia' },
        { id: 2, kwic: 'a' },
        { id: 3, kwic: 'ab' },
        { id: 4, kwic: 'x' },
        { id: 5, kwic: 'iudex' },
      ];

      const { result } = renderHook(() => useWordFrequency(dataWithShort));

      // Seuls 'ecclesia', 'ab' et 'iudex' doivent être comptés (>= 2 caractères)
      expect(result.current.wordData).toHaveLength(3);
      expect(result.current.wordData.find(w => w.text === 'a')).toBeUndefined();
      expect(result.current.wordData.find(w => w.text === 'x')).toBeUndefined();
    });

    test('doit ignorer les entrées sans kwic', () => {
      const dataWithoutKwic = [
        { id: 1, kwic: 'ecclesia' },
        { id: 2 }, // Pas de kwic
        { id: 3, kwic: null },
        { id: 4, kwic: 'iudex' },
      ];

      const { result } = renderHook(() => useWordFrequency(dataWithoutKwic));

      expect(result.current.wordData).toHaveLength(2);
      expect(result.current.totalWords).toBe(2);
    });
  });

  describe('Limitation au top N', () => {
    test('doit limiter au top 3 mots par défaut', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData, 3));

      expect(result.current.wordData).toHaveLength(3);
      expect(result.current.wordData[0].text).toBe('ecclesia');
      expect(result.current.wordData[1].text).toBe('iudex');
      expect(result.current.wordData[2].text).toBe('papa');
    });

    test('doit retourner tous les mots si limit = -1', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData, -1));

      expect(result.current.wordData).toHaveLength(5);
      expect(result.current.allWords).toHaveLength(5);
    });

    test('doit retourner tous les mots si limit > nombre de mots uniques', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData, 100));

      expect(result.current.wordData).toHaveLength(5);
    });

    test('doit limiter au top 1 si demandé', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData, 1));

      expect(result.current.wordData).toHaveLength(1);
      expect(result.current.wordData[0]).toEqual({ text: 'ecclesia', value: 3 });
    });

    test('allWords doit contenir tous les mots quelle que soit la limite', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData, 2));

      expect(result.current.wordData).toHaveLength(2); // Limité
      expect(result.current.allWords).toHaveLength(5); // Tous les mots
    });
  });

  describe('Cas limites', () => {
    test('doit gérer un tableau vide', () => {
      const { result } = renderHook(() => useWordFrequency([]));

      expect(result.current.wordData).toEqual([]);
      expect(result.current.allWords).toEqual([]);
      expect(result.current.totalWords).toBe(0);
      expect(result.current.uniqueWords).toBe(0);
      expect(result.current.topWord).toBeNull();
    });

    test('doit gérer des données undefined', () => {
      const { result } = renderHook(() => useWordFrequency(undefined));

      expect(result.current.wordData).toEqual([]);
      expect(result.current.totalWords).toBe(0);
      expect(result.current.uniqueWords).toBe(0);
      expect(result.current.topWord).toBeNull();
    });

    test('doit gérer des données null', () => {
      const { result } = renderHook(() => useWordFrequency(null));

      expect(result.current.wordData).toEqual([]);
      expect(result.current.totalWords).toBe(0);
    });

    test('doit gérer un seul mot', () => {
      const singleWord = [{ id: 1, kwic: 'ecclesia' }];
      const { result } = renderHook(() => useWordFrequency(singleWord));

      expect(result.current.wordData).toHaveLength(1);
      expect(result.current.wordData[0]).toEqual({ text: 'ecclesia', value: 1 });
      expect(result.current.topWord).toEqual({ text: 'ecclesia', value: 1 });
    });

    test('doit gérer des données avec tous les termes filtrés', () => {
      const allFiltered = [
        { id: 1, kwic: 'a' },
        { id: 2, kwic: '' },
        { id: 3, kwic: 'x' },
      ];

      const { result } = renderHook(() => useWordFrequency(allFiltered));

      expect(result.current.wordData).toEqual([]);
      expect(result.current.totalWords).toBe(0);
      expect(result.current.uniqueWords).toBe(0);
      expect(result.current.topWord).toBeNull();
    });
  });

  describe('Format de sortie pour react-wordcloud', () => {
    test('doit retourner le format correct {text, value}', () => {
      const { result } = renderHook(() => useWordFrequency(sampleData));

      result.current.wordData.forEach((word) => {
        expect(word).toHaveProperty('text');
        expect(word).toHaveProperty('value');
        expect(typeof word.text).toBe('string');
        expect(typeof word.value).toBe('number');
        expect(word.value).toBeGreaterThan(0);
      });
    });
  });

  describe('Performance avec useMemo', () => {
    test('ne doit pas recalculer si les données ne changent pas', () => {
      const { result, rerender } = renderHook(
        ({ data, limit }) => useWordFrequency(data, limit),
        { initialProps: { data: sampleData, limit: 100 } }
      );

      const firstResult = result.current;

      // Rerender sans changer les props
      rerender({ data: sampleData, limit: 100 });

      // Le résultat doit être la même référence (useMemo)
      expect(result.current).toBe(firstResult);
    });

    test('doit recalculer si les données changent', () => {
      const { result, rerender } = renderHook(
        ({ data, limit }) => useWordFrequency(data, limit),
        { initialProps: { data: sampleData, limit: 100 } }
      );

      const firstResult = result.current;

      const newData = [{ id: 1, kwic: 'test' }];
      rerender({ data: newData, limit: 100 });

      // Le résultat doit être différent
      expect(result.current).not.toBe(firstResult);
      expect(result.current.wordData[0].text).toBe('test');
    });

    test('doit recalculer si la limite change', () => {
      const { result, rerender } = renderHook(
        ({ data, limit }) => useWordFrequency(data, limit),
        { initialProps: { data: sampleData, limit: 3 } }
      );

      expect(result.current.wordData).toHaveLength(3);

      rerender({ data: sampleData, limit: 5 });

      expect(result.current.wordData).toHaveLength(5);
    });
  });
});
