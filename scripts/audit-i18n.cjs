#!/usr/bin/env node

/**
 * Script d'audit i18n - Vérifie que toutes les clés utilisées existent dans fr.json
 *
 * Usage: node scripts/audit-i18n.cjs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// ============================================================================
// FONCTION 1 : Extraire toutes les clés utilisées dans le code
// ============================================================================

function extractUsedKeys() {
  console.log(`${colors.blue}🔍 Extraction des clés i18n utilisées dans le code...${colors.reset}`);

  try {
    // Chercher tous les t('key') et t("key") dans les fichiers .js et .jsx
    const cmd = `grep -rh "t([\\'\\"]" src/ --include="*.jsx" --include="*.js" | grep -o "t([\\'\\"][a-zA-Z0-9._]*[\\'\\"]" | sed "s/t([\\'\\"]//g" | sed "s/[\\'\\"]//g" | grep '\\.' | sort | uniq`;
    const output = execSync(cmd, { encoding: 'utf-8' });
    let keys = output.trim().split('\n').filter(k => k && k !== '.' && k !== '...');

    // Filtrer les clés qui sont dans des tests (noms de fichiers généralement)
    keys = keys.filter(k => !k.endsWith('.csv') && !k.endsWith('.json') && !k.endsWith('.xml'));

    console.log(`${colors.green}✓ ${keys.length} clés i18n trouvées (hors fichiers de tests)${colors.reset}`);
    return keys;
  } catch (error) {
    console.error(`${colors.red}✗ Erreur lors de l'extraction des clés${colors.reset}`, error.message);
    return [];
  }
}

// ============================================================================
// FONCTION 2 : Extraire toutes les clés disponibles dans fr.json
// ============================================================================

function extractAvailableKeys() {
  console.log(`${colors.blue}🔍 Chargement des clés disponibles dans fr.json...${colors.reset}`);

  const frJsonPath = path.join(__dirname, '../src/shared/i18n/fr.json');

  try {
    const frJson = JSON.parse(fs.readFileSync(frJsonPath, 'utf-8'));
    const keys = [];

    // Fonction récursive pour extraire toutes les clés
    function extractKeys(obj, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          extractKeys(value, fullKey);
        } else {
          keys.push(fullKey);
        }
      }
    }

    extractKeys(frJson);
    console.log(`${colors.green}✓ ${keys.length} clés disponibles dans fr.json${colors.reset}`);
    return keys;
  } catch (error) {
    console.error(`${colors.red}✗ Erreur lors du chargement de fr.json${colors.reset}`, error.message);
    return [];
  }
}

// ============================================================================
// FONCTION 3 : Comparer les clés
// ============================================================================

function compareKeys(usedKeys, availableKeys) {
  console.log(`\n${colors.blue}🔍 Analyse des différences...${colors.reset}\n`);

  const availableSet = new Set(availableKeys);
  const usedSet = new Set(usedKeys);

  // Clés manquantes (utilisées mais pas définies)
  const missingKeys = usedKeys.filter(key => !availableSet.has(key));

  // Clés inutilisées (définies mais jamais utilisées)
  const unusedKeys = availableKeys.filter(key => !usedSet.has(key));

  // Résultats
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  RAPPORT D'AUDIT I18N${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`📊 Statistiques:`);
  console.log(`   • Clés utilisées dans le code: ${usedKeys.length}`);
  console.log(`   • Clés définies dans fr.json: ${availableKeys.length}`);
  console.log(`   • Clés manquantes: ${colors.red}${missingKeys.length}${colors.reset}`);
  console.log(`   • Clés inutilisées: ${colors.yellow}${unusedKeys.length}${colors.reset}\n`);

  // Clés manquantes (CRITIQUE)
  if (missingKeys.length > 0) {
    console.log(`${colors.red}❌ CLÉS MANQUANTES (${missingKeys.length})${colors.reset}`);
    console.log(`${colors.red}Ces clés sont utilisées dans le code mais absentes de fr.json:${colors.reset}\n`);
    missingKeys.forEach(key => {
      console.log(`   ${colors.red}✗${colors.reset} ${key}`);
    });
    console.log('');
  } else {
    console.log(`${colors.green}✓ Aucune clé manquante !${colors.reset}\n`);
  }

  // Clés inutilisées (INFO)
  if (unusedKeys.length > 0) {
    console.log(`${colors.yellow}⚠️  CLÉS INUTILISÉES (${unusedKeys.length})${colors.reset}`);
    console.log(`${colors.gray}Ces clés sont définies mais jamais utilisées (peut-être pour usage futur):${colors.reset}\n`);

    // Limiter l'affichage à 20 clés pour ne pas polluer
    const displayCount = Math.min(20, unusedKeys.length);
    unusedKeys.slice(0, displayCount).forEach(key => {
      console.log(`   ${colors.gray}○${colors.reset} ${colors.gray}${key}${colors.reset}`);
    });

    if (unusedKeys.length > displayCount) {
      console.log(`   ${colors.gray}... et ${unusedKeys.length - displayCount} autres${colors.reset}`);
    }
    console.log('');
  }

  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  return {
    missingKeys,
    unusedKeys,
    stats: {
      used: usedKeys.length,
      available: availableKeys.length,
      missing: missingKeys.length,
      unused: unusedKeys.length
    }
  };
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  console.log(`\n${colors.cyan}╔═══════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║         🌐 AUDIT I18N - CANON LAW TOOLKIT           ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════╝${colors.reset}\n`);

  const usedKeys = extractUsedKeys();
  const availableKeys = extractAvailableKeys();

  const result = compareKeys(usedKeys, availableKeys);

  // Code de sortie
  if (result.missingKeys.length > 0) {
    console.log(`${colors.red}❌ ÉCHEC : ${result.missingKeys.length} clé(s) manquante(s)${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✓ SUCCÈS : Toutes les clés utilisées sont définies !${colors.reset}\n`);
    process.exit(0);
  }
}

// Exécution
main();
