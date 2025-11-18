import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * CorpusUploader - Interface d'upload pour 2 corpus distincts
 * 
 * Permet d'uploader 2 fichiers XML NoSketch pour comparaison
 * - 2 zones de drop séparées (Corpus A et B)
 * - Validation format
 * - Affichage métadonnées
 * - Bouton "Comparer" actif quand 2 fichiers chargés
 */
const CorpusUploader = ({ onCompare }) => {
  const { t } = useTranslation();
  const [corpusA, setCorpusA] = useState(null);
  const [corpusB, setCorpusB] = useState(null);
  const [dragOverA, setDragOverA] = useState(false);
  const [dragOverB, setDragOverB] = useState(false);

  // Validation basique du format XML
  const validateFile = (file) => {
    if (!file) return { valid: false, error: t('concordance.upload.errors.noFileSelected') };
    
    // Vérifier extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'xml' && extension !== 'csv') {
      return { valid: false, error: 'Format invalide (attendu: .xml ou .csv)' };
    }
    
    // Vérifier taille (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return { valid: false, error: 'Fichier trop volumineux (max 50MB)' };
    }
    
    return { valid: true };
  };

  // Handler upload Corpus A
  const handleFileA = (file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(`Corpus A: ${validation.error}`);
      return;
    }
    
    setCorpusA({
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      uploadDate: new Date().toLocaleString('fr-FR')
    });
  };

  // Handler upload Corpus B
  const handleFileB = (file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(`Corpus B: ${validation.error}`);
      return;
    }
    
    setCorpusB({
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      uploadDate: new Date().toLocaleString('fr-FR')
    });
  };

  // Drag & Drop handlers
  const handleDrop = (e, corpus) => {
    e.preventDefault();
    if (corpus === 'A') {
      setDragOverA(false);
      handleFileA(e.dataTransfer.files[0]);
    } else {
      setDragOverB(false);
      handleFileB(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e, corpus) => {
    e.preventDefault();
    if (corpus === 'A') setDragOverA(true);
    else setDragOverB(true);
  };

  const handleDragLeave = (corpus) => {
    if (corpus === 'A') setDragOverA(false);
    else setDragOverB(false);
  };

  // Input file handlers
  const handleInputChange = (e, corpus) => {
    const file = e.target.files[0];
    if (file) {
      if (corpus === 'A') handleFileA(file);
      else handleFileB(file);
    }
  };

  // Bouton Comparer
  const handleCompare = () => {
    if (corpusA && corpusB) {
      onCompare({
        A: corpusA,
        B: corpusB
      });
    }
  };

  // Styles
  const dropZoneStyle = (isOver, hasFile) => ({
    border: isOver 
      ? '3px dashed #3b82f6' 
      : hasFile 
        ? '2px solid #10b981' 
        : '2px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    background: isOver 
      ? '#eff6ff' 
      : hasFile 
        ? '#f0fdf4' 
        : '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '500',
          color: '#1e293b',
          marginBottom: '0.5rem'
        }}>
          {t('concordance.upload.comparison.title')}
        </h2>
        <p style={{
          fontSize: '0.95rem',
          color: '#64748b'
        }}>
          {t('concordance.upload.comparison.description')}
        </p>
      </div>

      {/* Zones de drop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Corpus A */}
        <div>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: '700'
            }}>A</span>
            Corpus A
          </h3>
          
          <input
            type="file"
            id="fileInputA"
            accept=".xml,.csv"
            onChange={(e) => handleInputChange(e, 'A')}
            style={{ display: 'none' }}
          />
          
          <label
            htmlFor="fileInputA"
            onDrop={(e) => handleDrop(e, 'A')}
            onDragOver={(e) => handleDragOver(e, 'A')}
            onDragLeave={() => handleDragLeave('A')}
            style={dropZoneStyle(dragOverA, corpusA)}
          >
            {!corpusA ? (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⊞</div>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                  Glisser-déposer ou cliquer
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Formats acceptés : .xml, .csv
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
                  {corpusA.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {corpusA.size} • {corpusA.uploadDate}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  Cliquer pour changer
                </div>
              </>
            )}
          </label>
        </div>

        {/* Corpus B */}
        <div>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: '700'
            }}>B</span>
            Corpus B
          </h3>
          
          <input
            type="file"
            id="fileInputB"
            accept=".xml,.csv"
            onChange={(e) => handleInputChange(e, 'B')}
            style={{ display: 'none' }}
          />
          
          <label
            htmlFor="fileInputB"
            onDrop={(e) => handleDrop(e, 'B')}
            onDragOver={(e) => handleDragOver(e, 'B')}
            onDragLeave={() => handleDragLeave('B')}
            style={dropZoneStyle(dragOverB, corpusB)}
          >
            {!corpusB ? (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⊞</div>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                  Glisser-déposer ou cliquer
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Formats acceptés : .xml, .csv
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
                  {corpusB.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {corpusB.size} • {corpusB.uploadDate}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  Cliquer pour changer
                </div>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Bouton Comparer */}
      <div style={{
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <button
          onClick={handleCompare}
          disabled={!corpusA || !corpusB}
          style={{
            background: corpusA && corpusB 
              ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' 
              : '#e2e8f0',
            color: corpusA && corpusB ? 'white' : '#94a3b8',
            border: 'none',
            padding: '1rem 3rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: corpusA && corpusB ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: corpusA && corpusB ? '0 4px 6px rgba(220, 38, 38, 0.2)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (corpusA && corpusB) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (corpusA && corpusB) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(220, 38, 38, 0.2)';
            }
          }}
        >
          ⚖ Comparer les corpus
        </button>
        
        {(!corpusA || !corpusB) && (
          <div style={{
            marginTop: '1rem',
            fontSize: '0.85rem',
            color: '#94a3b8'
          }}>
            {t('concordance.upload.comparison.uploadBothToActivate')}
          </div>
        )}
      </div>

      {/* Info message */}
      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        background: '#f1f5f9',
        borderRadius: '8px',
        border: '1px solid #cbd5e1'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: '#475569',
          lineHeight: '1.6'
        }}>
          <strong>Note :</strong> Les fichiers doivent être au format XML NoSketch ou CSV exporté depuis NoSketch Engine.
          Taille maximum : 50MB par fichier.
        </div>
      </div>
    </div>
  );
};

CorpusUploader.propTypes = {
  onCompare: PropTypes.func.isRequired
};

export default CorpusUploader;
