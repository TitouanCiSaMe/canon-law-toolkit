/**
 * @fileoverview Utilitaires d'export de données
 * @module utils/ExportUtils
 *
 * @description
 * Fournit les fonctions pour exporter les données de concordances :
 * - Export CSV des concordances complètes
 * - Export JSON des analytics
 * - Téléchargement côté client via Blob API
 */

import i18n from '../../../shared/i18n';

/**
 * Déclenche le téléchargement d'un fichier côté client
 * 
 * Utilise l'API Blob pour créer un fichier téléchargeable sans passer par le serveur.
 * Le fichier est créé en mémoire, téléchargé, puis nettoyé automatiquement.
 * 
 * @param {string} content - Contenu du fichier à télécharger
 * @param {string} filename - Nom du fichier (avec extension)
 * @param {string} mimeType - Type MIME du fichier (ex: 'text/csv', 'application/json')
 * 
 * @returns {void}
 * 
 * @example
 * // Export d'un fichier texte simple
 * downloadFile('Hello World', 'test.txt', 'text/plain');
 * 
 * @example
 * // Export d'un CSV
 * const csvContent = 'Name,Age\nJohn,30\nJane,25';
 * downloadFile(csvContent, 'users.csv', 'text/csv;charset=utf-8;');
 * 
 * @example
 * // Export d'un JSON
 * const jsonContent = JSON.stringify({ data: [1, 2, 3] }, null, 2);
 * downloadFile(jsonContent, 'data.json', 'application/json;charset=utf-8;');
 */
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporte les concordances filtrées au format CSV
 * 
 * Génère un fichier CSV avec toutes les métadonnées des concordances :
 * Reference, Author, Title, Period, Domain, Place, Left, KWIC, Right.
 * 
 * Gère automatiquement :
 * - L'échappement des valeurs (guillemets, virgules, sauts de ligne)
 * - Les valeurs null/undefined
 * - L'encodage UTF-8
 * - Le timestamp dans le nom de fichier
 * 
 * @param {Array<Object>} filteredData - Tableau des concordances à exporter
 * @param {string} filteredData[].reference - Référence de la concordance
 * @param {string} filteredData[].author - Auteur de l'œuvre
 * @param {string} filteredData[].title - Titre de l'œuvre
 * @param {string} filteredData[].period - Période de l'œuvre
 * @param {string} filteredData[].domain - Domaine juridique
 * @param {string} filteredData[].place - Lieu de rédaction
 * @param {string} filteredData[].left - Contexte gauche
 * @param {string} filteredData[].kwic - Mot-clé recherché
 * @param {string} filteredData[].right - Contexte droit
 * 
 * @returns {void}
 * 
 * @example
 * // Export de concordances filtrées
 * const concordances = [
 *   {
 *     reference: 'Edi-25, page 42',
 *     author: 'Gratien',
 *     title: 'Decretum',
 *     period: '1140',
 *     domain: 'Droit canonique',
 *     place: 'Bologne',
 *     left: 'in causa',
 *     kwic: 'ecclesia',
 *     right: 'potest iudicare'
 *   }
 * ];
 * 
 * exportConcordancesCSV(concordances);
 * // Télécharge: concordances_export_20251021-143022.csv
 * 
 * @example
 * // Gestion des données vides
 * exportConcordancesCSV([]);
 * // Affiche une alerte: "Aucune donnée à exporter"
 */
export const exportConcordancesCSV = (filteredData) => {
  if (!filteredData || filteredData.length === 0) {
    alert(i18n.t('concordance.export.noDataToExport'));
    return;
  }

  // Header CSV
  const headers = [
    'Reference',
    'Author',
    'Title',
    'Period',
    'Domain',
    'Place',
    'Left',
    'KWIC',
    'Right'
  ];

  // Fonction pour échapper les valeurs CSV (guillemets et virgules)
  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Construction du CSV
  const csvContent = [
    headers.join(','),
    ...filteredData.map(item => [
      escapeCSV(item.reference),
      escapeCSV(item.author),
      escapeCSV(item.title),
      escapeCSV(item.period),
      escapeCSV(item.domain),
      escapeCSV(item.place),
      escapeCSV(item.left),
      escapeCSV(item.kwic),
      escapeCSV(item.right)
    ].join(','))
  ].join('\n');

  // Téléchargement
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `concordances_export_${timestamp}.csv`;
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

/**
 * Exporte les statistiques analytiques au format JSON
 * 
 * Génère un fichier JSON structuré avec :
 * - Métadonnées de l'export (date, version, total)
 * - Répartition par domaines
 * - Répartition par auteurs
 * - Distribution temporelle
 * - Répartition géographique
 * - Termes-clés les plus fréquents
 * 
 * Le JSON est formaté (indentation 2 espaces) pour faciliter la lecture.
 * 
 * @param {Object} analytics - Objet analytics complet
 * @param {number} analytics.total - Nombre total de concordances
 * @param {Array<{name: string, value: number}>} analytics.domains - Répartition par domaines
 * @param {Array<{name: string, value: number}>} analytics.authors - Répartition par auteurs
 * @param {Array<{period: number, count: number}>} analytics.periods - Distribution temporelle
 * @param {Array<{name: string, value: number}>} analytics.places - Répartition géographique
 * @param {Array<{term: string, count: number}>} analytics.keyTerms - Termes-clés fréquents
 * 
 * @returns {void}
 * 
 * @example
 * // Export des analytics
 * const analytics = {
 *   total: 342,
 *   domains: [
 *     { name: 'Droit canonique', value: 150 },
 *     { name: 'Théologie', value: 120 }
 *   ],
 *   authors: [
 *     { name: 'Gratien', value: 100 }
 *   ],
 *   periods: [
 *     { period: 1140, count: 50 }
 *   ],
 *   places: [
 *     { name: 'France', value: 200 }
 *   ],
 *   keyTerms: [
 *     { term: 'ecclesia', count: 45 }
 *   ]
 * };
 * 
 * exportAnalyticsJSON(analytics);
 * // Télécharge: analytics_export_20251021-143022.json
 * 
 * @example
 * // Gestion des analytics vides
 * exportAnalyticsJSON({});
 * // Affiche une alerte: "Aucune statistique à exporter"
 */
export const exportAnalyticsJSON = (analytics) => {
  if (!analytics || !analytics.total) {
    alert(i18n.t('concordance.export.noAnalyticsToExport'));
    return;
  }

  // Préparation des données avec métadonnées
  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalConcordances: analytics.total,
      version: '2.0'
    },
    analytics: {
      domains: analytics.domains,
      authors: analytics.authors,
      periods: analytics.periods,
      places: analytics.places,
      keyTerms: analytics.keyTerms
    }
  };

  // Conversion en JSON formaté
  const jsonContent = JSON.stringify(exportData, null, 2);

  // Téléchargement
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `analytics_export_${timestamp}.json`;
  downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
};
