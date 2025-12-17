// src/components/charts/WordCloud.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsiveValue } from '../../../../shared/hooks';

/**
 * Composant WordCloud - Nuage de mots simple et efficace
 * 
 * Affiche les termes KWIC les plus fréquents sous forme de "nuage"
 * avec taille et couleur proportionnelles à la fréquence.
 * Approche simple sans dépendances externes problématiques.
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<{text: string, value: number}>} props.words - Données du nuage
 * @param {number} [props.minSize=14] - Taille minimale du texte (px)
 * @param {number} [props.maxSize=80] - Taille maximale du texte (px)
 * @param {Function} [props.onWordClick] - Callback lors du clic sur un mot
 * @param {string} [props.height='400px'] - Hauteur du conteneur
 * 
 * @returns {JSX.Element} Nuage de mots interactif
 */
const WordCloud = ({
  words = [],
  minSize = 14,
  maxSize = 80,
  onWordClick,
  height = '400px',
}) => {
  const { t } = useTranslation();

  // Tailles de police responsives pour le nuage de mots
  const responsiveMinSize = useResponsiveValue({
    xs: minSize * 0.7,   // Mobile: 70% de la taille min
    md: minSize * 0.85,  // Tablet: 85%
    lg: minSize          // Desktop: 100% (taille complète)
  });

  const responsiveMaxSize = useResponsiveValue({
    xs: maxSize * 0.5,   // Mobile: 50% de la taille max
    md: maxSize * 0.7,   // Tablet: 70%
    lg: maxSize          // Desktop: 100% (taille complète)
  });

  // Hauteur responsive
  const responsiveHeight = useResponsiveValue({
    xs: '300px',   // Mobile: hauteur réduite
    md: '350px',   // Tablet: hauteur moyenne
    lg: height     // Desktop: hauteur complète
  });

  // Ne pas rendre si pas de données
  if (!words || words.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: responsiveHeight,
        background: '#f8fafc',
        borderRadius: '8px',
        border: '2px dashed #cbd5e1',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '3.8rem',
          marginBottom: '1rem',
          color: '#94a3b8',
        }}>
          ❦
        </div>
        <h3 style={{
          fontSize: '1.6rem',
          fontWeight: '500',
          color: '#475569',
          marginBottom: '0.5rem',
        }}>
          {t('concordance.messages.noWordsToDisplay')}
        </h3>
        <p style={{
          color: '#64748b',
          fontSize: '1.15rem',
        }}>
          {t('concordance.messages.importForWordCloud')}
        </p>
      </div>
    );
  }

  // Palette de couleurs académiques (bleus/indigo)
  const colors = [
    '#1e3a8a', // Bleu profond
    '#1e40af', // Bleu roi
    '#2563eb', // Bleu primaire
    '#3b82f6', // Bleu clair
    '#60a5fa', // Bleu sky
    '#93c5fd', // Bleu pâle
  ];

  // Trouver les valeurs min/max pour la normalisation
  const values = words.map(w => w.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  /**
   * Calcule la taille de police en fonction de la fréquence
   * Utilise une échelle logarithmique pour meilleure distribution
   * Applique les valeurs responsives pour s'adapter à la taille d'écran
   */
  const getFontSize = (value) => {
    if (maxValue === minValue) return (responsiveMaxSize + responsiveMinSize) / 2;

    // Normalisation logarithmique pour meilleure distribution visuelle
    const normalized = Math.log(value) / Math.log(maxValue);
    return responsiveMinSize + (normalized * (responsiveMaxSize - responsiveMinSize));
  };

  /**
   * Obtient une couleur de la palette en fonction de l'index
   */
  const getColor = (index) => {
    return colors[index % colors.length];
  };

  /**
   * Handler de clic sur un mot
   */
  const handleWordClick = (word) => {
    if (onWordClick) {
      onWordClick(word);
    } else {
      console.log(`Mot cliqué: ${word.text} (${word.value} occurrences)`);
    }
  };

  // Rendu du nuage de mots
  return (
    <div style={{
      width: '100%',
      minHeight: responsiveHeight,
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '2rem',
      overflow: 'auto',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {words.map((word, index) => (
          <span
            key={`${word.text}-${index}`}
            onClick={() => handleWordClick(word)}
            style={{
              fontSize: `${getFontSize(word.value)}px`,
              color: getColor(index),
              fontFamily: 'Georgia, serif',
              fontWeight: word.value > maxValue * 0.7 ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              userSelect: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.background = 'rgba(59, 130, 246, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'transparent';
            }}
            title={`${word.text}: ${word.value} occurrences`}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordCloud;
