import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Composant UploadInterface - Interface d'upload de fichiers
 *
 * Affiche l'interface d'upload avec drag & drop pour :
 * - Fichier de concordances A (jeu de données principal)
 * - Fichier de concordances B (jeu de données B pour comparaison)
 *
 * @param {Object} metadataLookup - Lookup des métadonnées chargées (conservé pour compatibilité)
 * @param {File|null} selectedMetadataFile - Fichier métadonnées sélectionné (conservé pour compatibilité)
 * @param {File|null} selectedConcordanceFile - Fichier concordances A sélectionné
 * @param {File|null} selectedConcordanceBFile - Fichier concordances B sélectionné
 * @param {Function} onMetadataUpload - Handler pour upload métadonnées (conservé pour compatibilité)
 * @param {Function} onConcordanceUpload - Handler pour upload concordances A
 * @param {Function} onConcordanceBUpload - Handler pour upload concordances B
 * @param {Function} onDrop - Handler pour drag & drop
 * @param {Function} onDragOver - Handler pour drag over
 * @param {Function} onDragLeave - Handler pour drag leave
 * @param {boolean} dragOver - État du drag over
 * @param {Object} parseStats - Statistiques de parsing
 * @param {string} processingStep - Étape de traitement en cours
 * @param {string} error - Message d'erreur
 */
const UploadInterface = ({
  metadataLookup,
  selectedMetadataFile,
  selectedConcordanceFile,
  selectedConcordanceBFile,
  onMetadataUpload,
  onConcordanceUpload,
  onConcordanceBUpload,
  onDrop,
  onDragOver,
  onDragLeave,
  dragOver,
  parseStats,
  processingStep,
  error
}) => {
  const { t } = useTranslation();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
      width: '100%'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedConcordanceFile ? '1fr 1fr' : '1fr', // 2 colonnes si concordances A chargées, 1 sinon
        gap: '2rem',
        width: '100%',
        marginBottom: '2rem'
      }}>
        {/* Upload concordances A (Jeu de données principal) */}
        <FileUploadSection
          title={t('concordance.upload.concordances.title')}
          description={t('concordance.upload.concordances.description')}
          subtitle={t('concordance.upload.corpusMain')}
          onUpload={onConcordanceUpload}
          onDrop={(e) => onDrop(e, 'concordance')}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          dragOver={dragOver}
          selectedFile={selectedConcordanceFile}
          fileInfo={selectedConcordanceFile && parseStats.totalReferences
            ? `${parseStats.totalReferences} ${t('concordance.upload.concordances.statsLoaded', { rate: parseStats.lookupRate })}`
            : null
          }
        />

        {/* Upload concordances B (Jeu de données B pour comparaison) */}
        {selectedConcordanceFile && (
          <FileUploadSection
            title={t('concordance.upload.corpusB.title')}
            description={t('concordance.upload.concordances.description')}
            subtitle={t('concordance.upload.corpusB.subtitle')}
            onUpload={onConcordanceBUpload}
            onDrop={(e) => onDrop(e, 'concordanceB')}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            dragOver={dragOver}
            selectedFile={selectedConcordanceBFile}
            fileInfo={selectedConcordanceBFile
              ? t('concordance.upload.corpusB.loaded')
              : null
            }
            disabled={!selectedConcordanceFile}
          />
        )}
      </div>

      {/* Étape de traitement */}
      {processingStep && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '6px',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          width: '100%'
        }}>
          {processingStep}
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '6px',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#FFFFFF',
          width: '100%'
        }}>
          ⚠ <strong>{t('common.error')}</strong> {error}
        </div>
      )}
    </div>
  );
};

/**
 * Composant FileUploadSection - Section d'upload pour un fichier
 */
const FileUploadSection = ({
  title,
  description,
  subtitle,
  onUpload,
  onDrop,
  onDragOver,
  onDragLeave,
  dragOver,
  selectedFile,
  fileInfo,
  disabled = false
}) => {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      padding: '2rem',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.2)',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }}>
      <h4 style={{
        fontSize: '1.1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {title}
      </h4>

      {/* Zone drag & drop */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          border: dragOver ? '2px dashed rgba(255,255,255,0.8)' : '2px dashed rgba(255,255,255,0.3)',
          backgroundColor: dragOver ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
          borderRadius: '6px',
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '1rem',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', opacity: 0.7 }}>
          {title.includes('Métadonnées') ? '⟐' : '⟐'}
        </div>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          {description}
        </p>
        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          {subtitle}
        </p>
      </div>

      {/* Input file */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => onUpload(e.target.files[0])}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.1)',
          color: '#F7FAFC',
          fontSize: '0.85rem',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      />

      {/* Info fichier sélectionné */}
      {selectedFile && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '4px',
          fontSize: '0.8rem'
        }}>
          ✓ <strong>{selectedFile.name}</strong><br/>
          {fileInfo && <span>{fileInfo}</span>}
        </div>
      )}
    </div>
  );
};

export default UploadInterface;
