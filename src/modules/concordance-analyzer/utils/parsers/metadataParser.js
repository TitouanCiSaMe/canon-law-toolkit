/**
 * Parser pour les fichiers CSV de métadonnées
 * 
 * Ce module gère :
 * - Le parsing du CSV complet (avec détection automatique des headers)
 * - L'extraction des périodes depuis différents formats de dates
 * - Le parsing des valeurs multiples (séparées par |)
 * - Le parsing des localisations géographiques
 * 
 * @module metadataParser
 */

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

/**
 * Parse un fichier CSV de métadonnées et crée un lookup par identifiant
 * 
 * Détecte automatiquement les en-têtes du CSV et extrait les informations
 * suivantes pour chaque œuvre : auteur, titre, période, lieu, domaine.
 * Les données sont indexées par identifiant (ex: "Edi-25") pour un accès rapide.
 * 
 * @param {Array<Array<string>>} csvData - Tableau 2D du CSV (lignes × colonnes)
 * @returns {Object} Lookup object où les clés sont les identifiants (ex: "Edi-25")
 *                   et les valeurs sont des objets contenant:
 *                   - {string} author - Auteur(s) de l'œuvre
 *                   - {string} title - Titre de l'œuvre
 *                   - {string} period - Période standardisée (ex: "1140" ou "1100-1149")
 *                   - {string} place - Lieu de rédaction
 *                   - {string} domain - Type de droit
 *                   - {number|null} page - Numéro de page (rempli ultérieurement)
 * 
 * @throws {Error} Si les en-têtes ne sont pas trouvés dans le CSV
 * 
 * @example
 * const csvData = [
 *   ["Identifiant interne", "Person Record Title", "Date", ...],
 *   ["Edi-25", "Gratien", "1140", ...]
 * ];
 * const lookup = parseMetadataFile(csvData);
 * console.log(lookup["Edi-25"]);
 * // { author: "Gratien", title: "Decretum", period: "1140", ... }
 */
export const parseMetadataFile = (csvData) => {
  const lookup = {};
  
  // Étape 1 : Trouver la ligne d'en-têtes
  // On cherche "Identifiant interne" qui est toujours présent
  let headerIndex = -1;
  
  csvData.forEach((row, index) => {
    if (row.some(cell => cell && cell.toString().includes('Identifiant interne'))) {
      headerIndex = index;
    }
  });
  
  // Si pas d'en-têtes trouvés, on lance une erreur explicite
  if (headerIndex === -1) {
    throw new Error('En-têtes non trouvés dans le fichier de métadonnées');
  }
  
  // Étape 2 : Identifier les colonnes importantes
  const headers = csvData[headerIndex];
  const idIndex = headers.findIndex(h => h && h.includes('Identifiant interne'));
  const authorIndex = headers.findIndex(h => h && h.includes('Person Record Title'));
  const titleIndex = headers.findIndex(h => h && h.includes('Has edited (Oeuvre) Record Title'));
  const dateIndex = headers.findIndex(h => h && h.includes('Date'));
  const placeIndex = headers.findIndex(h => h && h.includes('Lieu ou aire'));
  const domainIndex = headers.findIndex(h => h && h.includes('Type de droit'));
  
  // Étape 3 : Parser chaque ligne de données
  for (let i = headerIndex + 1; i < csvData.length; i++) {
    const row = csvData[i];
    
    // Ne traiter que les lignes avec un ID valide
    if (row.length > idIndex && row[idIndex]) {
      const id = row[idIndex].trim();
      
      // Créer l'objet de métadonnées
      lookup[id] = {
        author: parseMultipleValues(row[authorIndex]?.trim() || 'Anonyme'),
        title: row[titleIndex]?.trim() || 'Titre inconnu',
        period: extractPeriodFromDate(row[dateIndex]?.trim() || ''),
        place: parseLocationValues(row[placeIndex]?.trim() || 'Lieu inconnu'),
        domain: row[domainIndex]?.trim() || 'Domaine inconnu',
        page: null // Sera rempli plus tard lors du parsing des concordances
      };
    }
  }
  
  return lookup;
};

// ============================================================================
// FONCTIONS UTILITAIRES - DATES
// ============================================================================

/**
 * Extrait une période standardisée depuis une chaîne de date
 * 
 * Gère plusieurs formats de dates et les normalise en format standardisé.
 * Utilisé pour uniformiser les dates provenant de sources variées.
 * 
 * Formats supportés :
 * - Année seule : "1140" → "1140"
 * - Plage : "1100 to 1149" → "1100-1149"
 * - Dates invalides : "invalid temporal object" → "Période inconnue"
 * 
 * @param {string} dateStr - Chaîne de date brute du CSV
 * @returns {string} Période standardisée (année seule, plage, ou "Période inconnue")
 * 
 * @example
 * extractPeriodFromDate("1140"); // "1140"
 * extractPeriodFromDate("1100 to 1149"); // "1100-1149"
 * extractPeriodFromDate("invalid temporal object"); // "Période inconnue"
 * extractPeriodFromDate(""); // "Période inconnue"
 */
export const extractPeriodFromDate = (dateStr) => {
  // Cas 1 : Pas de date ou date invalide
  if (!dateStr) return 'Période inconnue';
  
  // Nettoyer les pipes et espaces
  const cleaned = dateStr.replace(/[|]/g, '').trim();
  if (cleaned === 'invalid temporal object' || cleaned === '') {
    return 'Période inconnue';
  }
  
  // Cas 2 : Plage de dates (ex: "1100 to 1149")
  const rangeMatch = cleaned.match(/(\d{4})\s+to\s+(\d{4})/);
  if (rangeMatch) {
    return `${rangeMatch[1]}-${rangeMatch[2]}`;
  }
  
  // Cas 3 : Année seule (ex: "1140")
  const yearMatch = cleaned.match(/^(\d{4})$/);
  if (yearMatch) {
    return yearMatch[1];
  }
  
  // Cas 4 : Trouver n'importe quelle année dans la chaîne
  const anyYear = cleaned.match(/(\d{4})/);
  if (anyYear) {
    return anyYear[1];
  }
  
  return 'Période inconnue';
};

// ============================================================================
// FONCTIONS UTILITAIRES - VALEURS MULTIPLES
// ============================================================================

/**
 * Parse des valeurs multiples séparées par pipe (|)
 * 
 * Gère les cas complexes où plusieurs valeurs sont présentes dans une cellule CSV.
 * Déduplique automatiquement les valeurs identiques et joint les valeurs uniques.
 * Utilisé principalement pour les auteurs multiples.
 * 
 * Comportement :
 * - Valeurs dupliquées → déduplique
 * - Valeurs vides → ignore
 * - Plusieurs valeurs uniques → joint avec " / "
 * - Aucune valeur valide → retourne "Anonyme"
 * 
 * @param {string} valueString - Chaîne avec valeurs séparées par pipe (|)
 * @returns {string} Valeur(s) nettoyée(s) et dédupliquée(s)
 * 
 * @example
 * parseMultipleValues("Gratien|Gratien"); // "Gratien"
 * parseMultipleValues("Gratien|Yves de Chartres"); // "Gratien / Yves de Chartres"
 * parseMultipleValues(""); // "Anonyme"
 * parseMultipleValues("Anonyme"); // "Anonyme"
 */
export const parseMultipleValues = (valueString) => {
  if (!valueString || valueString === 'Anonyme') return 'Anonyme';
  
  // Séparer par pipe et nettoyer
  const values = valueString
    .split('|')
    .map(v => v.trim())
    .filter(v => v && v !== 'Anonyme');
  
  // Cas : aucune valeur valide
  if (values.length === 0) return 'Anonyme';
  
  // Cas : une seule valeur
  if (values.length === 1) return values[0];
  
  // Dédupliquer
  const uniqueValues = [...new Set(values)];
  
  // Si déduplication = 1 valeur, la retourner
  if (uniqueValues.length === 1) return uniqueValues[0];
  
  // Sinon, joindre avec " / "
  return uniqueValues.join(' / ');
};

/**
 * Parse des valeurs de localisation avec logique de priorité
 * 
 * Traite les localisations géographiques multiples en appliquant une logique
 * de priorité : privilégie les villes sur les pays, et signale les incertitudes
 * lorsque plusieurs lieux sont mentionnés.
 * 
 * Logique de priorité :
 * - 1 ville + 1 pays → "Ville (Pays)"
 * - Plusieurs villes → "Ville1 / Ville2 (incertain)"
 * - Plusieurs pays → "Pays1 / Pays2 (incertain)"
 * - Aucune valeur → "Lieu inconnu"
 * 
 * @param {string} locationString - Chaîne de lieux séparés par pipe (|)
 * @returns {string} Localisation standardisée avec indication d'incertitude si nécessaire
 * 
 * @example
 * parseLocationValues("Paris|France"); // "Paris (France)"
 * parseLocationValues("Paris|Lyon|France"); // "Paris / Lyon (incertain)"
 * parseLocationValues("France|Italie"); // "France / Italie (incertain)"
 * parseLocationValues(""); // "Lieu inconnu"
 */
export const parseLocationValues = (locationString) => {
  if (!locationString || locationString === 'Lieu inconnu') {
    return 'Lieu inconnu';
  }
  
  // Séparer et nettoyer
  const locations = locationString
    .split('|')
    .map(v => v.trim())
    .filter(v => v && v !== 'Lieu inconnu');
  
  if (locations.length === 0) return 'Lieu inconnu';
  if (locations.length === 1) return locations[0];
  
  // Liste des pays connus (à adapter selon vos données)
  const countries = ['France', 'Angleterre', 'Allemagne', 'Italie', 'Espagne'];
  
  // Séparer villes et pays
  const cities = locations.filter(loc => !countries.includes(loc));
  const countriesList = locations.filter(loc => countries.includes(loc));
  
  // Logique de priorité
  if (cities.length === 1 && countriesList.length >= 1) {
    // Une ville + pays → privilégier la ville
    return `${cities[0]} (${countriesList[0]})`;
  } else if (cities.length > 1) {
    // Plusieurs villes → incertitude
    return cities.join(' / ') + ' (incertain)';
  } else if (countriesList.length > 1) {
    // Plusieurs pays → incertitude
    return countriesList.join(' / ') + ' (incertain)';
  } else if (countriesList.length === 1) {
    return countriesList[0];
  } else {
    // Autres cas
    return [...new Set(locations)].join(' / ');
  }
};
