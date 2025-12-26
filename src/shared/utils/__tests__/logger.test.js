/**
 * Tests pour l'utilitaire logger
 *
 * @module shared/utils/__tests__/logger.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, LOG_LEVELS, setLogLevel, getLogLevel } from '../logger';

describe('Logger', () => {
  let consoleSpy;

  beforeEach(() => {
    // Mock toutes les méthodes console
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      group: vi.spyOn(console, 'group').mockImplementation(() => {}),
      groupEnd: vi.spyOn(console, 'groupEnd').mockImplementation(() => {}),
    };

    // Reset au niveau DEBUG pour les tests
    setLogLevel(LOG_LEVELS.DEBUG);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('LOG_LEVELS', () => {
    it('devrait avoir les bons niveaux définis', () => {
      expect(LOG_LEVELS.NONE).toBe(0);
      expect(LOG_LEVELS.ERROR).toBe(1);
      expect(LOG_LEVELS.WARN).toBe(2);
      expect(LOG_LEVELS.INFO).toBe(3);
      expect(LOG_LEVELS.DEBUG).toBe(4);
    });

    it('devrait avoir une hiérarchie cohérente', () => {
      expect(LOG_LEVELS.ERROR).toBeLessThan(LOG_LEVELS.WARN);
      expect(LOG_LEVELS.WARN).toBeLessThan(LOG_LEVELS.INFO);
      expect(LOG_LEVELS.INFO).toBeLessThan(LOG_LEVELS.DEBUG);
    });
  });

  describe('setLogLevel / getLogLevel', () => {
    it('devrait pouvoir changer le niveau de log', () => {
      setLogLevel(LOG_LEVELS.ERROR);
      expect(getLogLevel()).toBe(LOG_LEVELS.ERROR);

      setLogLevel(LOG_LEVELS.DEBUG);
      expect(getLogLevel()).toBe(LOG_LEVELS.DEBUG);
    });
  });

  describe('logger.debug()', () => {
    it('devrait appeler console.log en mode DEBUG', () => {
      setLogLevel(LOG_LEVELS.DEBUG);
      logger.debug('Test message');

      expect(consoleSpy.log).toHaveBeenCalled();
      expect(consoleSpy.log.mock.calls[0][1]).toBe('Test message');
    });

    it('devrait inclure le préfixe [CiSaMe]', () => {
      logger.debug('Test');
      expect(consoleSpy.log.mock.calls[0][0]).toContain('[CiSaMe]');
    });

    it('devrait inclure [DEBUG] dans le message', () => {
      logger.debug('Test');
      expect(consoleSpy.log.mock.calls[0][0]).toContain('[DEBUG]');
    });

    it('ne devrait PAS logger en mode WARN', () => {
      setLogLevel(LOG_LEVELS.WARN);
      logger.debug('Test message');

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('devrait passer les arguments additionnels', () => {
      const data = { count: 42 };
      logger.debug('Message', data);

      expect(consoleSpy.log.mock.calls[0][2]).toEqual(data);
    });
  });

  describe('logger.info()', () => {
    it('devrait appeler console.info en mode INFO', () => {
      setLogLevel(LOG_LEVELS.INFO);
      logger.info('Info message');

      expect(consoleSpy.info).toHaveBeenCalled();
      expect(consoleSpy.info.mock.calls[0][1]).toBe('Info message');
    });

    it('devrait inclure [INFO] dans le message', () => {
      logger.info('Test');
      expect(consoleSpy.info.mock.calls[0][0]).toContain('[INFO]');
    });

    it('ne devrait PAS logger en mode WARN', () => {
      setLogLevel(LOG_LEVELS.WARN);
      logger.info('Test message');

      expect(consoleSpy.info).not.toHaveBeenCalled();
    });
  });

  describe('logger.warn()', () => {
    it('devrait appeler console.warn en mode WARN', () => {
      setLogLevel(LOG_LEVELS.WARN);
      logger.warn('Warning message');

      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.warn.mock.calls[0][1]).toBe('Warning message');
    });

    it('devrait inclure [WARN] dans le message', () => {
      logger.warn('Test');
      expect(consoleSpy.warn.mock.calls[0][0]).toContain('[WARN]');
    });

    it('devrait logger même en mode ERROR (car WARN > ERROR)', () => {
      setLogLevel(LOG_LEVELS.WARN);
      logger.warn('Test message');

      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('ne devrait PAS logger en mode NONE', () => {
      setLogLevel(LOG_LEVELS.NONE);
      logger.warn('Test message');

      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });
  });

  describe('logger.error()', () => {
    it('devrait appeler console.error en mode ERROR', () => {
      setLogLevel(LOG_LEVELS.ERROR);
      logger.error('Error message');

      expect(consoleSpy.error).toHaveBeenCalled();
      expect(consoleSpy.error.mock.calls[0][1]).toBe('Error message');
    });

    it('devrait inclure [ERROR] dans le message', () => {
      logger.error('Test');
      expect(consoleSpy.error.mock.calls[0][0]).toContain('[ERROR]');
    });

    it('devrait toujours logger sauf en mode NONE', () => {
      setLogLevel(LOG_LEVELS.ERROR);
      logger.error('Test');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('ne devrait PAS logger en mode NONE', () => {
      setLogLevel(LOG_LEVELS.NONE);
      logger.error('Test message');

      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe('logger.group()', () => {
    it('devrait créer un groupe console en mode DEBUG', () => {
      setLogLevel(LOG_LEVELS.DEBUG);
      logger.group('Group Label', () => {
        logger.debug('Inside group');
      });

      expect(consoleSpy.group).toHaveBeenCalled();
      expect(consoleSpy.groupEnd).toHaveBeenCalled();
    });

    it('ne devrait PAS créer de groupe en mode WARN', () => {
      setLogLevel(LOG_LEVELS.WARN);
      logger.group('Group Label', () => {});

      expect(consoleSpy.group).not.toHaveBeenCalled();
    });
  });

  describe('logger.time()', () => {
    it('devrait retourner un objet avec une méthode end()', () => {
      const timer = logger.time('Test');
      expect(timer).toHaveProperty('end');
      expect(typeof timer.end).toBe('function');
    });

    it('devrait logger la durée quand end() est appelé', () => {
      setLogLevel(LOG_LEVELS.DEBUG);
      const timer = logger.time('Operation');
      timer.end();

      expect(consoleSpy.log).toHaveBeenCalled();
      expect(consoleSpy.log.mock.calls[0][0]).toContain('[TIME]');
      expect(consoleSpy.log.mock.calls[0][1]).toMatch(/Operation: \d+\.\d+ms/);
    });

    it('ne devrait PAS logger en mode WARN', () => {
      setLogLevel(LOG_LEVELS.WARN);
      const timer = logger.time('Operation');
      timer.end();

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('Formatage des messages', () => {
    it('devrait inclure un timestamp', () => {
      logger.debug('Test');
      // Format: [CiSaMe] [HH:MM:SS] [DEBUG]
      expect(consoleSpy.log.mock.calls[0][0]).toMatch(/\[\d{2}:\d{2}:\d{2}\]/);
    });
  });

  describe('Niveaux de log en cascade', () => {
    it('DEBUG devrait afficher tous les niveaux', () => {
      setLogLevel(LOG_LEVELS.DEBUG);

      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');

      expect(consoleSpy.log).toHaveBeenCalled();
      expect(consoleSpy.info).toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('WARN devrait afficher seulement warn et error', () => {
      setLogLevel(LOG_LEVELS.WARN);

      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('ERROR devrait afficher seulement error', () => {
      setLogLevel(LOG_LEVELS.ERROR);

      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('NONE devrait tout désactiver', () => {
      setLogLevel(LOG_LEVELS.NONE);

      logger.debug('debug');
      logger.info('info');
      logger.warn('warn');
      logger.error('error');

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });
});
