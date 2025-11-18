// src/components/views/WordCloudView.jsx

import React, { useState } from 'react';
import WordCloud from '../charts/WordCloud';
import useWordFrequency from '../../hooks/useWordFrequency';
import ExportButtons from '../ui/ExportButtons';

/**
 * Composant WordCloudView - Vue du nuage de mots des termes KWIC
 * 
 * Affiche un nuage de mots interactif des termes KWIC les plus fréquents
 * avec statistiques, contrôles de limitation, et possibilité d'export.
 * 
 * @component
 * @param {Object} props - Propriétés du composant
 * @param {Array<Object>} props.filteredData - Données filtrées à analyser
 * @param {string} props.filteredData[].kwic - Terme KWIC
 * @param {Object} props.analytics - Statistiques calculées
 * @param {Function} props.onExportConcordances - Handler pour export CSV
 * @param {Function} props.onExportAnalytics - Handler pour export JSON
 * 
 * @returns {JSX.Element} Vue complète du nuage de mots
 * 
 * @example
 * <WordCloudView
 *   filteredData={filteredData}
 *   analytics={analytics}
 *   onExportConcordances={handleExportCSV}
 *   onExportAnalytics={handleExportJSON}
 * />
 */
const WordCloudView = ({
  filteredData,
  analytics,
  onExportConcordances,
  onExportAnalytics,
}) => {
  // ============================================================================
  // ÉTATS LOCAUX
  // ============================================================================
  
  /**
   * État pour contrôler le nombre de mots affichés dans le nuage
   * Options: 25, 50, 100, -1 (tous)
   */
  const [wordLimit, setWordLimit] = useState(50);

  // ============================================================================
  // HOOKS - Calcul des fréquences
  // ============================================================================
  
  /**
   * Hook pour calculer les fréquences des termes KWIC
   * Retourne les données formatées pour le nuage de mots
   */
  const { wordData, totalWords, uniqueWords, topWord } = useWordFrequency(
    filteredData,
    wordLimit
  );

  // ============================================================================
  // HANDLERS - Interactions
  // ============================================================================

  /**
   * Handler lors du clic sur un mot dans le nuage
   * @param {Object} word - Mot cliqué {text, value}
   */
  const handleWordClick = (word) => {
    console.log(`Mot cliqué: ${word.text} (${word.value} occurrences)`);
    // TODO: Implémenter filtrage des concordances par terme KWIC
    // Pourrait ouvrir un modal ou naviguer vers DataView avec filtre
  };

  /**
   * Handler lors du survol d'un mot
   * @param {Object} word - Mot survolé {text, value}
   */
  const handleWordMouseOver = (word) => {
    // Comportement par défaut géré par le tooltip
  };

  // ============================================================================
  // RENDU
  // ============================================================================

  return (
    <div>
      {/* Cas où des données sont disponibles */}
      {filteredData.length > 0 ? (
        <>
          {/* ========== BOUTONS D'EXPORT ========== */}
          <ExportButtons
            filteredData={filteredData}
            analytics={analytics}
            viewType="wordcloud"
            onExportConcordances={onExportConcordances}
            onExportAnalytics={onExportAnalytics}
          />
          
          {/* ========== CONTENEUR PRINCIPAL ========== */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '2rem',
            border: '1px solid #e2e8f0',
          }}>
            {/* ========== EN-TÊTE : Titre + Sélecteur limite ========== */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '500',
                color: '#1e293b',
                margin: 0,
              }}>
                ❦ Nuage de mots des termes KWIC
              </h4>
              
              {/* Sélecteur du nombre de mots à afficher */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <span style={{
                  fontSize: '0.9rem',
                  color: '#64748b',
                  fontWeight: '500',
                }}>
                  Nombre de mots :
                </span>
                <div style={{
                  display: 'flex',
                  background: '#f1f5f9',
                  borderRadius: '6px',
                  padding: '0.25rem',
                  gap: '0.25rem',
                }}>
                  {/* Bouton 25 mots */}
                  <button
                    onClick={() => setWordLimit(25)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: wordLimit === 25 ? '#1A365D' : 'transparent',
                      color: wordLimit === 25 ? 'white' : '#64748b',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    25
                  </button>
                  {/* Bouton 50 mots */}
                  <button
                    onClick={() => setWordLimit(50)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: wordLimit === 50 ? '#1A365D' : 'transparent',
                      color: wordLimit === 50 ? 'white' : '#64748b',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    50
                  </button>
                  {/* Bouton 100 mots */}
                  <button
                    onClick={() => setWordLimit(100)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: wordLimit === 100 ? '#1A365D' : 'transparent',
                      color: wordLimit === 100 ? 'white' : '#64748b',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    100
                  </button>
                  {/* Bouton Tous les mots */}
                  <button
                    onClick={() => setWordLimit(-1)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      background: wordLimit === -1 ? '#1A365D' : 'transparent',
                      color: wordLimit === -1 ? 'white' : '#64748b',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Tout
                  </button>
                </div>
              </div>
            </div>

            {/* ========== STATISTIQUES ========== */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              {/* Total d'occurrences */}
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '1.5rem',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                }}>
                  Total d'occurrences
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#1e3a8a',
                }}>
                  {totalWords.toLocaleString()}
                </div>
              </div>

              {/* Mots uniques */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '1.5rem',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#15803d',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                }}>
                  Mots uniques
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#166534',
                }}>
                  {uniqueWords.toLocaleString()}
                </div>
              </div>

              {/* Mot le plus fréquent */}
              <div style={{
                background: '#fefce8',
                border: '1px solid #fde047',
                borderRadius: '8px',
                padding: '1.5rem',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#a16207',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                }}>
                  Mot le plus fréquent
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#854d0e',
                }}>
                  {topWord ? topWord.text : '-'}
                </div>
                {topWord && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#a16207',
                    marginTop: '0.25rem',
                  }}>
                    {topWord.value} occurrences
                  </div>
                )}
              </div>
            </div>

            {/* ========== NUAGE DE MOTS ========== */}
            <WordCloud
              words={wordData}
              minSize={14}
              maxSize={80}
              height="500px"
              onWordClick={handleWordClick}
              onWordMouseOver={handleWordMouseOver}
            />

            {/* ========== NOTE D'INFORMATION ========== */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#64748b',
                lineHeight: '1.6',
              }}>
                <strong>Astuce :</strong> Cliquez sur un mot pour voir toutes les concordances
                contenant ce terme. La taille du mot est proportionnelle à sa fréquence d'apparition.
                Les termes de moins de 2 caractères sont exclus de l'analyse.
              </p>
            </div>
          </div>
        </>
      ) : (
        /* ========== CAS VIDE : Aucune donnée ========== */
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          color: '#64748b',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❦</div>
          <h3>Aucune donnée disponible</h3>
          <p>Importez d'abord vos fichiers pour voir le nuage de mots des termes KWIC.</p>
        </div>
      )}
    </div>
  );
};

export default WordCloudView;
