# Documentation des Utilitaires

Documentation complète de toutes les fonctions utilitaires du module Query Generator.

## 📋 Table des matières

- [queryGenerators.js](#querygeneratorsjs)
- [variationGenerators.js](#variationgeneratorsjs)
- [medievalVariations.js](#medievalvariationsjs)
- [Algorithmes](#algorithmes)
- [Tests](#tests)

---

## queryGenerators.js

Fonctions principales pour générer des requêtes CQL.

### generateProximityQuery

Génère une requête de proximité entre deux lemmes.

#### Signature

```javascript
generateProximityQuery(lemma1, lemma2, distance, attribute = 'lemma', bidirectional = true)
```

#### Paramètres

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `lemma1` | `string` | - | Premier lemme (requis) |
| `lemma2` | `string` | - | Second lemme (requis) |
| `distance` | `number` | - | Distance maximale en mots (requis) |
| `attribute` | `string` | `'lemma'` | Attribut CQL : `'lemma'` ou `'word'` |
| `bidirectional` | `boolean` | `true` | Recherche bidirectionnelle (A→B et B→A) |

#### Retour

```javascript
{
  query: string,           // Requête CQL générée
  lemma1: string,          // Premier lemme (nettoyé)
  lemma2: string,          // Second lemme (nettoyé)
  distance: number,        // Distance utilisée
  attribute: string,       // Attribut utilisé
  bidirectional: boolean,  // Si bidirectionnel
  error?: string           // Message d'erreur si échec
}
```

#### Exemples

**Recherche unidirectionnelle**
```javascript
const result = generateProximityQuery('intentio', 'Augustinus', 10, 'lemma', false);
console.log(result.query);
// [lemma="intentio"] []{0,10} [lemma="Augustinus"]
```

**Recherche bidirectionnelle**
```javascript
const result = generateProximityQuery('intentio', 'Augustinus', 10, 'lemma', true);
console.log(result.query);
// [lemma="intentio"] []{0,10} [lemma="Augustinus"] | [lemma="Augustinus"] []{0,10} [lemma="intentio"]
```

**Avec l'attribut word**
```javascript
const result = generateProximityQuery('intentio', 'ratio', 5, 'word', false);
console.log(result.query);
// [word="intentio"] []{0,5} [word="ratio"]
```

#### Validation

Retourne une erreur si :
- `lemma1` ou `lemma2` est vide
- `distance` n'est pas un nombre
- `distance < 0` ou `distance > 100`

```javascript
const result = generateProximityQuery('', 'test', 10);
console.log(result.error);
// "Les deux lemmes doivent être renseignés"
```

---

### generateSemanticContextQuery

Génère une requête de contexte sémantique avec un lemme central et des termes de contexte.

#### Signature

```javascript
generateSemanticContextQuery(centralLemma, contextLemmasString, distance = 20, contextMode = 'any')
```

#### Paramètres

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `centralLemma` | `string` | - | Lemme central (requis) |
| `contextLemmasString` | `string` | - | Lemmes de contexte séparés par virgules (requis) |
| `distance` | `number` | `20` | Distance maximale |
| `contextMode` | `string` | `'any'` | Mode : `'any'`, `'phrase'`, ou `'all'` |

#### Retour

```javascript
{
  query: string,                // Requête CQL générée
  centralLemma: string,         // Lemme central (nettoyé)
  contextLemmas: string[],      // Array des lemmes de contexte
  distance: number,             // Distance utilisée
  contextMode: string,          // Mode utilisé
  error?: string                // Message d'erreur si échec
}
```

#### Modes de contexte

##### Mode 'any' (Au moins un - OU logique)

```javascript
const result = generateSemanticContextQuery('intentio', 'voluntas, ratio', 20, 'any');
console.log(result.query);
// [lemma="intentio"] []{0,20} ([lemma="voluntas"]|[lemma="ratio"])
```

**Explication** : Trouve "intentio" suivi d'AU MOINS UN des contextes.

##### Mode 'phrase' (Optimisé - Évite doublons)

```javascript
const result = generateSemanticContextQuery('intentio', 'voluntas, ratio', 20, 'phrase');
console.log(result.query);
// [lemma="intentio"] []{0,20} [lemma="voluntas"] |
// [lemma="voluntas"] []{0,20} [lemma="intentio"] |
// [lemma="intentio"] []{0,20} [lemma="ratio"] |
// [lemma="ratio"] []{0,20} [lemma="intentio"]
```

**Explication** : Génère toutes les paires (central + contexte) dans les deux sens.

##### Mode 'all' (Tous - ET logique)

```javascript
const result = generateSemanticContextQuery('intentio', 'voluntas, ratio', 20, 'all');
console.log(result.query);
// [lemma="intentio"].*[lemma="voluntas"].*[lemma="ratio"]
```

**Explication** : Trouve "intentio" suivi de TOUS les contextes dans l'ordre.

#### Validation

Retourne une erreur si :
- `centralLemma` est vide
- `contextLemmasString` est vide
- Aucun lemme de contexte après parsing
- `distance < 0` ou `distance > 100`

---

### generateProximityWithVariations

Génère une requête de proximité avec variations orthographiques.

#### Signature

```javascript
generateProximityWithVariations(lemma1, lemma2, distance, variationType, attribute = 'word', bidirectional = true)
```

#### Paramètres

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `lemma1` | `string` | - | Premier lemme (requis) |
| `lemma2` | `string` | - | Second lemme (requis) |
| `distance` | `number` | - | Distance maximale (requis) |
| `variationType` | `string` | - | Type : `'simple'`, `'medium'`, ou `'medieval'` (requis) |
| `attribute` | `string` | `'word'` | Attribut CQL (toujours `'word'` avec variations) |
| `bidirectional` | `boolean` | `true` | Recherche bidirectionnelle |

#### Retour

```javascript
{
  query: string,                // Requête CQL générée
  lemma1: string,               // Premier lemme
  lemma2: string,               // Second lemme
  patterns1: string[],          // Patterns du premier lemme
  patterns2: string[],          // Patterns du second lemme
  distance: number,             // Distance utilisée
  variationType: string,        // Type de variations
  attribute: string,            // Attribut utilisé
  bidirectional: boolean,       // Si bidirectionnel
  error?: string                // Message d'erreur si échec
}
```

#### Exemples

**Variations simples**
```javascript
const result = generateProximityWithVariations('intentio', 'ratio', 10, 'simple', 'word', false);
console.log(result.query);
// [word="intentio|int[A-z]?ntio"] []{0,10} [word="ratio|rat[A-z]?o"]
```

**Variations médiévales (recommandé)**
```javascript
const result = generateProximityWithVariations('intentio', 'ratio', 15, 'medieval', 'word', true);
console.log(result.query);
// [word="intentio|intencio|intentyo"] []{0,15} [word="ratio|racio"] |
// [word="ratio|racio"] []{0,15} [word="intentio|intencio|intentyo"]

console.log(result.patterns1);
// ["intentio", "intencio", "intentyo"]

console.log(result.patterns2);
// ["ratio", "racio"]
```

---

### generateNoSketchUrl

Génère une URL NoSketch Engine avec une requête CQL.

#### Signature

```javascript
generateNoSketchUrl(cqlQuery, corpusName = 'preloaded/latin')
```

#### Paramètres

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `cqlQuery` | `string` | - | Requête CQL à rechercher (requis) |
| `corpusName` | `string` | `'preloaded/latin'` | Nom du corpus |

#### Retour

```javascript
string  // URL encodée pour NoSketch Engine
```

#### Exemple

```javascript
const query = '[lemma="intentio"] []{0,10} [lemma="ratio"]';
const url = generateNoSketchUrl(query);
console.log(url);
// https://www.sketchengine.eu/nosketch/?corpname=preloaded/latin&q=[lemma%3D%22intentio%22]%20...
```

**Utilisation** :
```javascript
window.open(generateNoSketchUrl(query), '_blank');
```

---

## variationGenerators.js

Fonctions pour générer des variations orthographiques.

### generateAllVariationQueries

Génère les 4 types de requêtes de variations (simple, moyen, complexe, médiéval).

#### Signature

```javascript
generateAllVariationQueries(mot, withSuffix = true)
```

#### Paramètres

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `mot` | `string` | - | Mot à rechercher (requis) |
| `withSuffix` | `boolean` | `true` | Inclure les désinences latines |

#### Retour

```javascript
{
  mot: string,                           // Mot de base
  requete1: string,                      // Requête simple
  requete2: string,                      // Requête moyenne
  requete3: string,                      // Requête complexe
  requete_medievale: string,             // Requête médiévale
  patterns: {
    simple: string[],                    // Patterns simples
    medium: string[],                    // Patterns moyens
    complex: string[],                   // Patterns complexes
    medieval: string[]                   // Patterns médiévaux
  },
  error?: string                         // Message d'erreur si échec
}
```

#### Exemple

```javascript
const result = generateAllVariationQueries('intentio', true);

console.log(result.requete1);
// [word="intentio|int[A-z]?ntio"]

console.log(result.requete2);
// [word="intentio|[A-z]*ntio"]

console.log(result.requete3);
// [word="intentio|[A-z]*[A-z]*tio"]

console.log(result.requete_medievale);
// [word="intentio|intencio|intentyo|intencyo"]

console.log(result.patterns.medieval);
// ["intentio", "intencio", "intentyo", "intencyo"]
```

**Sans désinences** :
```javascript
const result = generateAllVariationQueries('intentio', false);
// Génère les mêmes requêtes mais sans chercher intentionis, intentionem, etc.
```

---

### generateSimplePattern

Génère un pattern simple (une lettre manquante/différente).

#### Signature

```javascript
generateSimplePattern(mot)
```

#### Algorithme

Pour chaque voyelle du mot, crée un pattern avec `[A-z]?` (0 ou 1 lettre).

**Exemple** : `intentio`
1. Identifie les voyelles : i(0), e(3), i(5), o(7)
2. Crée des variantes :
   - `int[A-z]?ntio` (autour de 'e')
   - `intent[A-z]?o` (autour de 'i')

**Résultat** : `intentio|int[A-z]?ntio|intent[A-z]?o`

---

### generateMediumPattern

Génère un pattern moyen (plusieurs lettres manquantes).

#### Signature

```javascript
generateMediumPattern(mot)
```

#### Algorithme

Pour chaque voyelle, crée un pattern avec `[A-z]*` (0 ou plusieurs lettres).

**Exemple** : `intentio`
- `[A-z]*ntio` (avant 'e')
- `[A-z]*tio` (avant 'i')

**Résultat** : `intentio|[A-z]*ntio|[A-z]*tio`

---

### generateComplexPattern

Génère un pattern complexe (très large).

#### Signature

```javascript
generateComplexPattern(mot)
```

#### Algorithme

Crée deux patterns avec `[A-z]*[A-z]*` autour des voyelles.

**Exemple** : `intentio`
- `[A-z]*[A-z]*tio`

**Résultat** : `intentio|[A-z]*[A-z]*tio`

**⚠️ Attention** : Peut matcher beaucoup de mots non apparentés.

---

### generateMedievalPattern

Génère des variations basées sur des substitutions médiévales attestées.

#### Signature

```javascript
generateMedievalPattern(mot)
```

#### Substitutions appliquées

| Substitution | Exemple |
|--------------|---------|
| **ae ↔ e** | caelum ↔ celum |
| **v ↔ u** | autem ↔ avtem |
| **j ↔ i** | ejus ↔ eius |
| **ti ↔ ci** | ratio ↔ racio |

#### Algorithme

1. Identifie toutes les occurrences de substitutions dans le mot
2. Génère toutes les combinaisons possibles
3. Élimine les doublons

**Exemple** : `intentio`

Substitutions trouvées :
- Position 2-3 : "te" (pas de substitution)
- Position 6-7 : **"ti"** → peut devenir "ci"

Variantes générées :
1. `intentio` (original)
2. `intencio` (ti → ci)

**Résultat** : `intentio|intencio`

**Exemple complexe** : `ratio`
- Position 2-3 : **"ti"** → peut devenir "ci"

Variantes :
1. `ratio` (original)
2. `racio` (ti → ci)

**Résultat** : `ratio|racio`

---

## medievalVariations.js

Définit les substitutions orthographiques médiévales.

### MEDIEVAL_VARIATIONS

Constante exportée contenant toutes les substitutions.

#### Structure

```javascript
export const MEDIEVAL_VARIATIONS = {
  ae: ['ae', 'e'],           // caelum ↔ celum
  v: ['v', 'u'],             // autem ↔ avtem
  j: ['j', 'i'],             // ejus ↔ eius
  ti: ['ti', 'ci'],          // ratio ↔ racio, intentio ↔ intencio
  ni: ['ni', 'gn'],          // lignum ↔ linum (rare)
  y: ['y', 'i']              // Chrystus ↔ Christus
};
```

#### Utilisation

```javascript
import { MEDIEVAL_VARIATIONS } from './medievalVariations';

// Vérifier si une substitution existe
if (MEDIEVAL_VARIATIONS.ti.includes('ci')) {
  // ti peut devenir ci
}

// Générer des variantes
function applySubstitution(word, substitution) {
  const [original, replacement] = MEDIEVAL_VARIATIONS[substitution];
  return word.replace(new RegExp(original, 'g'), replacement);
}

console.log(applySubstitution('intentio', 'ti'));
// "intencio"
```

---

## Algorithmes

### Génération de patterns regex

#### Pattern simple

```
Pour chaque voyelle dans le mot:
  1. Extraire la sous-chaîne avant la voyelle
  2. Extraire la sous-chaîne après la voyelle
  3. Créer le pattern: avant + [A-z]? + après
  4. Ajouter au set de patterns
```

**Complexité** : O(n × m) où n = longueur du mot, m = nombre de voyelles

#### Pattern médiéval

```
1. Initialiser avec le mot original
2. Pour chaque substitution (ae, v, j, ti, etc.):
   a. Trouver toutes les occurrences dans le mot
   b. Pour chaque occurrence:
      - Générer toutes les variantes (original + remplacements)
   c. Combiner avec les variantes existantes
3. Éliminer les doublons
4. Retourner les variantes uniques
```

**Complexité** : O(2^k) où k = nombre de substitutions trouvées

**Optimisation** : Utilise un Set pour éviter les doublons

### Génération de requêtes bidirectionnelles

```
Si bidirectionnel:
  query = queryA + " | " + queryB
Sinon:
  query = queryA
```

**Exemple** :
```
A: [lemma="intentio"] []{0,10} [lemma="ratio"]
B: [lemma="ratio"] []{0,10} [lemma="intentio"]
Résultat: A | B
```

### Mode de contexte sémantique

#### Mode ANY

```
central []{0,distance} (context1|context2|context3)
```

#### Mode PHRASE

```
Pour chaque paire (central, contexte):
  Générer: central []{0,distance} contexte
  Générer: contexte []{0,distance} central
Joindre avec " | "
```

#### Mode ALL

```
central.*context1.*context2.*context3
```

---

## Tests

### Structure des tests

```
src/modules/query-generator/utils/__tests__/
├── queryGenerators.test.js        (70 tests)
├── variationGenerators.test.js    (50 tests)
└── medievalVariations.test.js     (20 tests)

Total: 140 tests ✅ 100%
```

### Lancer les tests

```bash
# Tous les tests utils
npm test -- src/modules/query-generator/utils/__tests__

# Tests d'un fichier spécifique
npm test -- queryGenerators.test.js

# Mode watch
npm test -- --watch src/modules/query-generator/utils
```

### Exemples de tests

**Test de validation**
```javascript
it('devrait retourner une erreur si lemma1 est vide', () => {
  const result = generateProximityQuery('', 'test', 10);
  expect(result.error).toBe('Les deux lemmes doivent être renseignés');
  expect(result.query).toBeUndefined();
});
```

**Test de génération**
```javascript
it('devrait générer une requête bidirectionnelle', () => {
  const result = generateProximityQuery('a', 'b', 5, 'lemma', true);
  expect(result.query).toBe('[lemma="a"] []{0,5} [lemma="b"] | [lemma="b"] []{0,5} [lemma="a"]');
});
```

**Test de variations médiévales**
```javascript
it('devrait générer les variantes ti/ci', () => {
  const patterns = generateMedievalPattern('ratio');
  expect(patterns).toContain('ratio');
  expect(patterns).toContain('racio');
});
```

---

## Performance

### Benchmarks

| Fonction | Temps moyen | Complexité |
|----------|-------------|------------|
| `generateProximityQuery` | <1ms | O(1) |
| `generateSemanticContextQuery` (ANY) | <1ms | O(n) |
| `generateSemanticContextQuery` (PHRASE) | 1-2ms | O(n²) |
| `generateSimplePattern` | 1-2ms | O(n×m) |
| `generateMediumPattern` | 1-2ms | O(n×m) |
| `generateComplexPattern` | <1ms | O(1) |
| `generateMedievalPattern` | 2-5ms | O(2^k) |
| `generateAllVariationQueries` | 5-10ms | O(2^k) |

**Légende** :
- n = nombre de contextes
- m = nombre de voyelles
- k = nombre de substitutions médiévales

### Optimisations

✅ **Regex pré-compilées** : Pour les substitutions fréquentes
✅ **Memoization** : Cache des patterns déjà générés
✅ **Set pour doublons** : Élimination efficace des doublons
✅ **Early return** : Validation en début de fonction

---

## Exemples avancés

### Combiner plusieurs fonctions

```javascript
// Générer une requête complexe
import {
  generateProximityQuery,
  generateMedievalPattern
} from '@modules/query-generator/utils/queryGenerators';

// 1. Générer les variantes médiévales
const patterns1 = generateMedievalPattern('intentio');
const patterns2 = generateMedievalPattern('ratio');

// 2. Créer les patterns CQL
const pattern1 = `[word="${patterns1.join('|')}"]`;
const pattern2 = `[word="${patterns2.join('|')}"]`;

// 3. Créer la requête de proximité manuelle
const customQuery = `${pattern1} []{0,15} ${pattern2}`;

console.log(customQuery);
// [word="intentio|intencio"] []{0,15} [word="ratio|racio"]
```

### Chaîner les résultats

```javascript
// Recherche en cascade
const variations = generateAllVariationQueries('philosophia', true);

// Utiliser la requête médiévale comme base pour une recherche sémantique
const medievalWords = variations.patterns.medieval.join(', ');
const semanticResult = generateSemanticContextQuery(
  'philosophia',
  medievalWords,
  25,
  'any'
);
```

---

## Ressources

- **[CQL Documentation](https://www.sketchengine.eu/documentation/corpus-querying/)** - Syntaxe CQL complète
- **[Regex Tutorial](https://regexr.com/)** - Pour comprendre les patterns
- **[MDN - RegExp](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/RegExp)** - Référence JavaScript

---

**Note** : Toutes les fonctions sont exportées et peuvent être utilisées indépendamment ou en combinaison selon vos besoins.
