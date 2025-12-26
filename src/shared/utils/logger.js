/**
 * Utilitaire de logging pour CiSaMe Toolkit
 *
 * Remplace les console.log directs pour :
 * - Désactiver les logs en production
 * - Formater les messages avec préfixes
 * - Permettre des niveaux de log configurables
 *
 * @module shared/utils/logger
 *
 * @example
 * import { logger } from '@shared/utils/logger';
 *
 * logger.debug('Données chargées', { count: 42 });
 * logger.info('Upload terminé');
 * logger.warn('Fichier volumineux');
 * logger.error('Échec du parsing', error);
 */

/**
 * Niveaux de log disponibles
 * @readonly
 * @enum {number}
 */
export const LOG_LEVELS = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
};

/**
 * Configuration du logger
 * @type {{ level: number, prefix: string }}
 */
const config = {
  // En développement : tous les logs. En production : erreurs et warnings seulement.
  level: import.meta.env?.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN,
  prefix: '[CiSaMe]',
};

/**
 * Vérifie si un niveau de log est actif
 * @param {number} level - Niveau à vérifier
 * @returns {boolean}
 */
const isLevelEnabled = (level) => config.level >= level;

/**
 * Formate le timestamp pour les logs
 * @returns {string}
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Formate le préfixe du message
 * @param {string} level - Nom du niveau
 * @returns {string}
 */
const formatPrefix = (level) => {
  return `${config.prefix} [${getTimestamp()}] [${level}]`;
};

/**
 * Logger principal
 *
 * @example
 * // Mode développement - tous les logs affichés
 * logger.debug('Chargement des données...');
 * logger.info('✓ 342 concordances chargées');
 * logger.warn('Fichier > 10MB, performances réduites');
 * logger.error('Échec parsing CSV', error);
 *
 * // Mode production - seuls warn et error affichés
 */
export const logger = {
  /**
   * Log de debug (développement uniquement)
   * @param {string} message - Message à logger
   * @param {...any} args - Arguments additionnels
   */
  debug: (message, ...args) => {
    if (isLevelEnabled(LOG_LEVELS.DEBUG)) {
      // eslint-disable-next-line no-console
      console.log(formatPrefix('DEBUG'), message, ...args);
    }
  },

  /**
   * Log d'information (développement uniquement)
   * @param {string} message - Message à logger
   * @param {...any} args - Arguments additionnels
   */
  info: (message, ...args) => {
    if (isLevelEnabled(LOG_LEVELS.INFO)) {
      // eslint-disable-next-line no-console
      console.info(formatPrefix('INFO'), message, ...args);
    }
  },

  /**
   * Log d'avertissement (toujours affiché)
   * @param {string} message - Message à logger
   * @param {...any} args - Arguments additionnels
   */
  warn: (message, ...args) => {
    if (isLevelEnabled(LOG_LEVELS.WARN)) {
      console.warn(formatPrefix('WARN'), message, ...args);
    }
  },

  /**
   * Log d'erreur (toujours affiché)
   * @param {string} message - Message à logger
   * @param {...any} args - Arguments additionnels
   */
  error: (message, ...args) => {
    if (isLevelEnabled(LOG_LEVELS.ERROR)) {
      console.error(formatPrefix('ERROR'), message, ...args);
    }
  },

  /**
   * Log groupé (développement uniquement)
   * @param {string} label - Label du groupe
   * @param {Function} callback - Fonction contenant les logs du groupe
   */
  group: (label, callback) => {
    if (isLevelEnabled(LOG_LEVELS.DEBUG)) {
      // eslint-disable-next-line no-console
      console.group(formatPrefix('GROUP'), label);
      callback();
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  },

  /**
   * Log de performance (développement uniquement)
   * @param {string} label - Label de la mesure
   * @returns {{ end: Function }} Objet avec méthode end()
   *
   * @example
   * const timer = logger.time('Parsing CSV');
   * // ... opération longue
   * timer.end(); // Affiche: "[CiSaMe] [TIME] Parsing CSV: 234ms"
   */
  time: (label) => {
    const start = performance.now();
    return {
      end: () => {
        if (isLevelEnabled(LOG_LEVELS.DEBUG)) {
          const duration = (performance.now() - start).toFixed(2);
          // eslint-disable-next-line no-console
          console.log(formatPrefix('TIME'), `${label}: ${duration}ms`);
        }
      },
    };
  },
};

/**
 * Configure le niveau de log
 * @param {number} level - Nouveau niveau (utiliser LOG_LEVELS)
 *
 * @example
 * import { setLogLevel, LOG_LEVELS } from '@shared/utils/logger';
 * setLogLevel(LOG_LEVELS.ERROR); // Seules les erreurs seront affichées
 */
export const setLogLevel = (level) => {
  config.level = level;
};

/**
 * Récupère le niveau de log actuel
 * @returns {number}
 */
export const getLogLevel = () => config.level;

export default logger;
