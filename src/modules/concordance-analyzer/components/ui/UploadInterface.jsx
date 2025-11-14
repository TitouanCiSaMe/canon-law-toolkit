import React from 'react';

/**
 * Composant UploadInterface - Interface d'upload de fichiers
 * 
 * Affiche l'interface d'upload avec drag & drop pour :
 * - Fichier de métadonnées (commun)
 * - Fichier de concordances A (corpus principal ou corpus A en mode comparison)
 * - Fichier de concordances B (NOUVEAU - mode comparison uniquement)
 * 
 * @param {Object} metadataLookup - Lookup des métadonnées chargées
 * @param {File|null} selectedMetadataFile - Fichier métadonnées sélectionné
 * @param {File|null} selectedConcordanceFile - Fichier concordances A sélectionné
 * @param {File|null} selectedConcordanceBFile - Fichier concordances B sélectionné (NOUVEAU)
 * @param {Function} onMetadataUpload - Handler pour upload métadonnées
 * @param {Function} onConcordanceUpload - Handler pour upload concordances A
 * @param {Function} onConcordanceBUpload - Handler pour upload concordances B (NOUVEAU)
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
  selectedConcordanceBFile, // ✨ NOUVEAU
  onMetadataUpload,
  onConcordanceUpload,
  onConcordanceBUpload, // ✨ NOUVEAU
  onDrop,
  onDragOver,
  onDragLeave,
  dragOver,
  parseStats,
  processingStep,
  error
}) => {
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
        gridTemplateColumns: selectedConcordanceFile ? '1fr 1fr 1fr' : '1fr 1fr', // ✨ MODIFIÉ : 3 colonnes si concordances A chargées
        gap: '2rem',
        width: '100%',
        marginBottom: '2rem'
      }}>
        {/* Upload métadonnées */}
        <FileUploadSection
          title="📊 1. Métadonnées"
          description="CSV complet des métadonnées"
          subtitle="Avec identifiants Edi-XX"
          onUpload={onMetadataUpload}
          onDrop={(e) => onDrop(e, 'metadata')}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          dragOver={dragOver}
          selectedFile={selectedMetadataFile}
          fileInfo={Object.keys(metadataLookup).length > 0 
            ? `${Object.keys(metadataLookup).length} entrées chargées` 
            : null
          }
        />

        {/* Upload concordances A */}
        <FileUploadSection
          title="📄 2. Export NoSketch A"
          description="Export CSV NoSketch Engine"
          subtitle="Corpus principal ou Corpus A"
          onUpload={onConcordanceUpload}
          onDrop={(e) => onDrop(e, 'concordance')}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          dragOver={dragOver}
          selectedFile={selectedConcordanceFile}
          fileInfo={selectedConcordanceFile && parseStats.totalReferences
            ? `${parseStats.totalReferences} concordances, ${parseStats.lookupRate}% matchées`
            : null
          }
          disabled={Object.keys(metadataLookup).length === 0}
        />

        {/* ✨ NOUVEAU : Upload concordances B (mode comparison) */}
        {selectedConcordanceFile && (
          <FileUploadSection
            title="📄 3. Export NoSketch B"
            description="Export CSV NoSketch Engine"
            subtitle="Corpus B (comparaison)"
            onUpload={onConcordanceBUpload}
            onDrop={(e) => onDrop(e, 'concordanceB')}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            dragOver={dragOver}
            selectedFile={selectedConcordanceBFile}
            fileInfo={selectedConcordanceBFile
              ? `Corpus B chargé`
              : null
            }
            disabled={Object.keys(metadataLookup).length === 0 || !selectedConcordanceFile}
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
          color: '#FECACA',
          width: '100%'
        }}>
          ⚠️ <strong>Erreur :</strong> {error}
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
          {title.includes('Métadonnées') ? '📋' : '📄'}
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
          ✅ <strong>{selectedFile.name}</strong><br/>
          {fileInfo && <span>{fileInfo}</span>}
        </div>
      )}
    </div>
  );
};

export default UploadInterface;
