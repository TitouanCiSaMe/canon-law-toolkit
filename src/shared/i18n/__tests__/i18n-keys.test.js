/**
 * Test automatisé pour validation i18n
 * Vérifie que toutes les clés utilisées dans le code existent dans fr.json
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('i18n Keys Validation', () => {
  let frTranslations;
  let usedKeys;

  beforeAll(() => {
    // Charger le fichier fr.json
    const frJsonPath = path.join(__dirname, '../fr.json');
    frTranslations = JSON.parse(fs.readFileSync(frJsonPath, 'utf-8'));

    // Extraire toutes les clés utilisées dans le code (hors tests)
    try {
      const cmd = `grep -rh "t([\\'\\"]" src/ --include="*.jsx" --include="*.js" | grep -o "t([\\'\\"][a-zA-Z0-9._]*[\\'\\"]" | sed "s/t([\\'\\"]//g" | sed "s/[\\'\\"]//g" | grep '\\.' | sort | uniq`;
      const output = execSync(cmd, { encoding: 'utf-8', cwd: path.join(__dirname, '../../..') });
      usedKeys = output
        .trim()
        .split('\n')
        .filter(k => k && k !== '.' && k !== '..' && !k.endsWith('.csv') && !k.endsWith('.json') && !k.endsWith('.xml'));
    } catch (error) {
      console.error('Erreur lors de l\'extraction des clés:', error.message);
      usedKeys = [];
    }
  });

  it('devrait avoir un fichier fr.json valide', () => {
    expect(frTranslations).toBeDefined();
    expect(typeof frTranslations).toBe('object');
  });

  it('devrait avoir trouvé des clés utilisées dans le code', () => {
    expect(usedKeys.length).toBeGreaterThan(0);
  });

  it('toutes les clés utilisées doivent exister dans fr.json', () => {
    // Créer un Set de toutes les clés disponibles
    const availableKeys = new Set();

    function extractKeys(obj, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          extractKeys(value, fullKey);
        } else {
          availableKeys.add(fullKey);
        }
      }
    }

    extractKeys(frTranslations);

    // Vérifier que chaque clé utilisée existe
    const missingKeys = usedKeys.filter(key => !availableKeys.has(key));

    if (missingKeys.length > 0) {
      console.error('❌ Clés manquantes dans fr.json:');
      missingKeys.forEach(key => console.error(`   - ${key}`));
    }

    expect(missingKeys).toEqual([]);
  });

  it('ne devrait pas avoir de clés dupliquées dans le code', () => {
    const keySet = new Set(usedKeys);
    expect(keySet.size).toBe(usedKeys.length);
  });

  it('toutes les clés doivent suivre le format correct (avec points)', () => {
    usedKeys.forEach(key => {
      expect(key).toMatch(/^[a-zA-Z0-9._]+$/);
      expect(key).toContain('.');
    });
  });

  it('toutes les clés de fr.json doivent avoir des valeurs non vides', () => {
    function checkValues(obj, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          checkValues(value, fullKey);
        } else if (typeof value === 'string') {
          expect(value.trim()).not.toBe('');
        }
      }
    }

    checkValues(frTranslations);
  });
});
