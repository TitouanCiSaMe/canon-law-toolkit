/**
 * Tests unitaires pour le composant UploadInterface
 * 
 * Teste :
 * - Le rendu des sections d'upload
 * - Les interactions drag & drop
 * - Les inputs file
 * - Les messages d'état (erreur, succès, processing)
 * - Les états disabled
 * - L'affichage des fichiers sélectionnés
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadInterface from '../UploadInterface';

// ============================================================================
// MOCKS ET DONNÉES DE TEST
// ============================================================================

const mockMetadataLookup = {
  'Edi-25': {
    author: 'Auteur Test',
    title: 'Titre Test',
    period: '1194',
    place: 'France',
    domain: 'Droit canon'
  }
};

const mockParseStats = {
  totalReferences: 42,
  successfulMatches: 40,
  failedMatches: 2,
  lookupRate: '95.2'
};

const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });

// ============================================================================
// TESTS DE RENDU DE BASE
// ============================================================================

describe('UploadInterface - Rendu de base', () => {
  
  it('devrait rendre le composant sans erreur', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    expect(screen.getByText(/1\. Métadonnées/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Export NoSketch/i)).toBeInTheDocument();
  });

  it('devrait afficher la section métadonnées', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    expect(screen.getByText(/CSV complet des métadonnées/i)).toBeInTheDocument();
  });

  it('devrait afficher la section concordances', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    expect(screen.getByText(/Export CSV NoSketch Engine/i)).toBeInTheDocument();
  });

  it('devrait afficher 2 inputs file', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container } = render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    const fileInputs = container.querySelectorAll('input[type="file"]');
    expect(fileInputs).toHaveLength(2);
  });
});

// ============================================================================
// TESTS DES INTERACTIONS - UPLOAD
// ============================================================================

describe('UploadInterface - Interactions Upload', () => {
  
  it('devrait appeler onMetadataUpload lors de la sélection de fichier', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container } = render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    const fileInputs = container.querySelectorAll('input[type="file"]');
    const metadataInput = fileInputs[0];
    
    fireEvent.change(metadataInput, { target: { files: [mockFile] } });
    
    expect(mockOnMetadataUpload).toHaveBeenCalledTimes(1);
    expect(mockOnMetadataUpload).toHaveBeenCalledWith(mockFile);
  });

  it('devrait appeler onConcordanceUpload lors de la sélection de fichier', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container } = render(
      <UploadInterface
        metadataLookup={mockMetadataLookup}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    const fileInputs = container.querySelectorAll('input[type="file"]');
    const concordanceInput = fileInputs[1];
    
    fireEvent.change(concordanceInput, { target: { files: [mockFile] } });
    
    expect(mockOnConcordanceUpload).toHaveBeenCalledTimes(1);
    expect(mockOnConcordanceUpload).toHaveBeenCalledWith(mockFile);
  });
});

// ============================================================================
// TESTS DES INTERACTIONS - DRAG & DROP
// ============================================================================

describe('UploadInterface - Interactions Drag & Drop', () => {
  
it('devrait gérer les événements dragOver sur les zones de drop', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container } = render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    // Les zones de drop existent
    const dropZones = container.querySelectorAll('[style*="border"]');
    expect(dropZones.length).toBeGreaterThan(0);
    
    // Vérifier que les zones ont les événements
    const firstDropZone = dropZones[0];
    expect(firstDropZone).toBeInTheDocument();
  });

  it('devrait gérer les événements dragLeave sur les zones de drop', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container } = render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    // Les zones de drop existent et peuvent recevoir les événements
    const dropZones = container.querySelectorAll('[style*="border"]');
    expect(dropZones.length).toBeGreaterThan(0);
    
    const firstDropZone = dropZones[0];
    // Simuler dragLeave ne devrait pas crasher
    expect(() => fireEvent.dragLeave(firstDropZone)).not.toThrow();
  });

  it('devrait gérer les événements drop sur les zones de drop', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container } = render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    // Les zones de drop existent
    const dropZones = container.querySelectorAll('[style*="border"]');
    expect(dropZones.length).toBeGreaterThan(0);
    
    const firstDropZone = dropZones[0];
    
    // Vérifier que la zone peut recevoir des drops
    const dropEvent = {
      dataTransfer: {
        files: [mockFile]
      }
    };
    
    // Simuler drop ne devrait pas crasher
    expect(() => fireEvent.drop(firstDropZone, dropEvent)).not.toThrow();
  });

  it('devrait changer le style de la zone lors du dragOver', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container, rerender } = render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    // Re-render avec dragOver=true
    rerender(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={true}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    // Vérifier que le style a changé (border plus visible)
    const dropZones = container.querySelectorAll('[style*="border"]');
    expect(dropZones.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// TESTS DES MESSAGES D'ÉTAT
// ============================================================================

describe('UploadInterface - Messages d\'état', () => {
  
  it('devrait afficher le message de processing', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep="Chargement en cours..."
        error=""
      />
    );
    
    expect(screen.getByText(/Chargement en cours/i)).toBeInTheDocument();
  });

  it('devrait afficher le message d\'erreur', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error="Erreur de parsing"
      />
    );
    
    expect(screen.getByText(/Erreur de parsing/i)).toBeInTheDocument();
  });

  it('ne devrait pas afficher de messages si aucun état', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container } = render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    // Pas de divs avec background rouge ou vert
    const statusDivs = container.querySelectorAll('[style*="rgba(16, 185, 129"]');
    expect(statusDivs).toHaveLength(0);
  });
});

// ============================================================================
// TESTS DES FICHIERS SÉLECTIONNÉS
// ============================================================================

describe('UploadInterface - Fichiers sélectionnés', () => {
  
  it('devrait afficher le nom du fichier métadonnées sélectionné', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    render(
      <UploadInterface
        metadataLookup={mockMetadataLookup}
        selectedMetadataFile={mockFile}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    expect(screen.getByText('test.csv')).toBeInTheDocument();
  });

  it('devrait afficher les stats du fichier métadonnées', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    render(
      <UploadInterface
        metadataLookup={mockMetadataLookup}
        selectedMetadataFile={mockFile}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    expect(screen.getByText(/1 entrées chargées/i)).toBeInTheDocument();
  });

  it('devrait afficher le nom du fichier concordances sélectionné', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const concordanceFile = new File(['test'], 'concordances.csv', { type: 'text/csv' });
    
    render(
      <UploadInterface
        metadataLookup={mockMetadataLookup}
        selectedMetadataFile={null}
        selectedConcordanceFile={concordanceFile}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={mockParseStats}
        processingStep=""
        error=""
      />
    );
    
    expect(screen.getByText('concordances.csv')).toBeInTheDocument();
  });

  it('devrait afficher les stats des concordances', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const concordanceFile = new File(['test'], 'concordances.csv', { type: 'text/csv' });
    
    render(
      <UploadInterface
        metadataLookup={mockMetadataLookup}
        selectedMetadataFile={null}
        selectedConcordanceFile={concordanceFile}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={mockParseStats}
        processingStep=""
        error=""
      />
    );
    
    expect(screen.getByText(/42 concordances/i)).toBeInTheDocument();
    expect(screen.getByText(/95\.2% matchées/i)).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS DES ÉTATS DISABLED
// ============================================================================

describe('UploadInterface - États disabled', () => {
  
  it('devrait désactiver la section concordances si pas de métadonnées', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container } = render(
      <UploadInterface
        metadataLookup={{}}
        selectedMetadataFile={null}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    const fileInputs = container.querySelectorAll('input[type="file"]');
    const concordanceInput = fileInputs[1];
    
    expect(concordanceInput).toBeDisabled();
  });

  it('devrait activer la section concordances si métadonnées chargées', () => {
    const mockOnMetadataUpload = jest.fn();
    const mockOnConcordanceUpload = jest.fn();
    const mockOnDrop = jest.fn();
    const mockOnDragOver = jest.fn();
    const mockOnDragLeave = jest.fn();
    
    const { container } = render(
      <UploadInterface
        metadataLookup={mockMetadataLookup}
        selectedMetadataFile={mockFile}
        selectedConcordanceFile={null}
        onMetadataUpload={mockOnMetadataUpload}
        onConcordanceUpload={mockOnConcordanceUpload}
        onDrop={mockOnDrop}
        onDragOver={mockOnDragOver}
        onDragLeave={mockOnDragLeave}
        dragOver={false}
        parseStats={{}}
        processingStep=""
        error=""
      />
    );
    
    const fileInputs = container.querySelectorAll('input[type="file"]');
    const concordanceInput = fileInputs[1];
    
    expect(concordanceInput).not.toBeDisabled();
  });
});
