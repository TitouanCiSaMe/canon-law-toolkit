# Guide Utilisateur - Query Generator

Guide complet pour utiliser le générateur de requêtes CQL et rechercher efficacement dans les corpus médiévaux latins.

## 📋 Table des matières

- [Introduction](#introduction)
- [Qu'est-ce que le CQL ?](#quest-ce-que-le-cql-)
- [Types de recherches](#types-de-recherches)
  - [1. Recherche de Proximité](#1-recherche-de-proximité)
  - [2. Variations Orthographiques](#2-variations-orthographiques)
  - [3. Contexte Sémantique](#3-contexte-sémantique)
  - [4. Proximité + Variations](#4-proximité--variations)
- [Exemples pratiques](#exemples-pratiques)
- [Conseils et astuces](#conseils-et-astuces)
- [FAQ](#faq)

---

## Introduction

Le **Query Generator** est un outil qui vous aide à créer des requêtes CQL (Corpus Query Language) pour rechercher dans des corpus de textes latins médiévaux. Il prend en compte les particularités orthographiques du latin médiéval.

### À quoi sert cet outil ?

- Rechercher des cooccurrences de termes
- Trouver toutes les variantes orthographiques d'un mot
- Analyser les contextes sémantiques
- Explorer les relations conceptuelles dans les textes

---

## Qu'est-ce que le CQL ?

Le **CQL (Corpus Query Language)** est un langage de requête qui permet de rechercher des patterns complexes dans des corpus textuels.

### Syntaxe de base

```cql
[lemma="intentio"]           → Recherche le lemme "intentio"
[word="intentio"]            → Recherche le mot exact "intentio"
[]{0,10}                     → Entre 0 et 10 mots
|                            → OU logique
.*                           → N'importe quel nombre de mots
```

### Exemples

```cql
[lemma="voluntas"]                                    → Le lemme "voluntas"
[word="intentio|intencio"]                            → Le mot "intentio" OU "intencio"
[lemma="intentio"] []{0,5} [lemma="ratio"]           → "intentio" suivi de "ratio" (0-5 mots entre)
[lemma="intentio"].*[lemma="voluntas"].*[lemma="ratio"] → Les 3 lemmes dans l'ordre
```

---

## Types de recherches

### 1. Recherche de Proximité

**Objectif** : Trouver deux lemmes qui apparaissent proches l'un de l'autre dans le texte.

#### Quand l'utiliser ?

- Étudier les collocations (mots qui apparaissent souvent ensemble)
- Analyser les associations conceptuelles
- Identifier les contextes d'usage d'un terme

#### Interface

```
┌─────────────────────────────────────┐
│ Premier lemme      : intentio       │
│ Second lemme       : Augustinus     │
│ Distance maximale  : 10             │
│ Attribut           : lemme          │
│ ☑ Bidirectionnel                    │
└─────────────────────────────────────┘
```

#### Paramètres

- **Premier lemme** : Le premier terme à rechercher
- **Second lemme** : Le deuxième terme à rechercher
- **Distance maximale** : Nombre maximum de mots entre les deux lemmes (0-100)
- **Attribut** :
  - `lemma` : Forme canonique (recommandé pour le latin)
  - `word` : Forme exacte du texte
- **Bidirectionnel** : Chercher dans les deux sens (A...B et B...A)

#### Exemple pratique

**Recherche** : Citations d'Augustin près du mot "intentio"

```
Premier lemme     : intentio
Second lemme      : Augustinus
Distance          : 15
Bidirectionnel    : ☑ Oui
```

**Résultat** :
```cql
[lemma="intentio"] []{0,15} [lemma="Augustinus"] | [lemma="Augustinus"] []{0,15} [lemma="intentio"]
```

**Ce que cette requête trouve** :
- "...intentio [0-15 mots] Augustinus..."
- "...Augustinus [0-15 mots] intentio..."

#### Conseils

✅ **Bon** : Distance 10-20 pour les collocations courantes
✅ **Bon** : Bidirectionnel activé pour ne rien manquer
⚠️ **Attention** : Distance trop grande (>50) = trop de résultats non pertinents

---

### 2. Variations Orthographiques

**Objectif** : Générer automatiquement des patterns pour trouver toutes les variantes orthographiques d'un mot latin.

#### Quand l'utiliser ?

- Recherche exhaustive d'un terme
- Textes médiévaux avec orthographe variable
- Analyse diachronique (évolution de l'orthographe)

#### Interface

```
┌─────────────────────────────────────┐
│ Mot à rechercher : intentio         │
│                                      │
│ Type de désinence:                   │
│ ○ Avec désinences                    │
│ ● Forme exacte                       │
└─────────────────────────────────────┘
```

#### Les 4 types de requêtes

Le générateur produit **4 requêtes** de complexité croissante :

##### 1. Requête Simple (Pattern conservateur)

```cql
[word="intentio|int[A-z]?ntio"]
```

**Trouve** :
- intentio (forme de base)
- intntio (une lettre manquante)
- intantio, intbntio, etc. (une lettre différente)

**Variations capturées** : ~26 formes

##### 2. Requête Moyenne (Pattern modéré)

```cql
[word="intentio|[A-z]*ntio"]
```

**Trouve** :
- intentio
- ntio, antio, entio
- inntio, intentntio
- Toutes combinaisons se terminant en "ntio"

**Variations capturées** : ~100 formes

##### 3. Requête Complexe (Pattern large)

```cql
[word="intentio|[A-z]*[A-z]*tio"]
```

**Trouve** :
- Toutes les variations se terminant en "tio"
- intencio, intentyo, intentcio
- Peut inclure des mots non apparentés

**Variations capturées** : ~1000 formes

##### 4. Requête Médiévale (Substitutions spécifiques)

```cql
[word="intentio|intencio|intentyo|intencyo"]
```

**Substitutions médiévales appliquées** :
- **ae ↔ e** : caelum → celum
- **v ↔ u** : autem → avtem
- **j ↔ i** : ejus → eius
- **ti ↔ ci** : ratio → racio, intentio → intencio

**Trouve** : Uniquement les variantes médiévales attestées

**Variations capturées** : 4-10 formes (précis)

#### Exemple pratique

**Recherche** : Toutes les formes de "intentio"

```
Mot              : intentio
Désinences       : Avec désinences
```

**Résultats générés** :

| Type | Requête | Usage recommandé |
|------|---------|------------------|
| Simple | `intentio\|int[A-z]?ntio` | Fautes de frappe |
| Moyenne | `intentio\|[A-z]*ntio` | Variations courantes |
| Complexe | `intentio\|[A-z]*[A-z]*tio` | Recherche large (attention aux faux positifs) |
| **Médiévale** | `intentio\|intencio\|intentyo\|intencyo` | **Recommandé pour textes médiévaux** |

#### Mode "Forme exacte"

Si vous décochez "Avec désinences", le générateur cherche uniquement la forme exacte + les substitutions médiévales :

```
Avec désinences       : intention, intentionis, intentionem, etc.
Forme exacte          : Seulement "intentio" (et variantes médiévales)
```

#### Conseils

✅ **Recommandé** : Commencer par la requête **médiévale** (plus précise)
✅ **Bon** : Requête moyenne si la médiévale ne trouve rien
⚠️ **Attention** : Requête complexe peut donner beaucoup de faux positifs
❌ **À éviter** : Requête complexe sur de très gros corpus (temps de calcul)

---

### 3. Contexte Sémantique

**Objectif** : Rechercher un lemme central entouré de termes de contexte spécifiques pour analyser les relations sémantiques.

#### Quand l'utiliser ?

- Analyse sémantique (champs lexicaux)
- Étude des associations conceptuelles
- Recherche de passages thématiques
- Analyse de la pensée d'un auteur

#### Interface

```
┌─────────────────────────────────────┐
│ Lemme central  : intentio           │
│ Lemmes de contexte (séparés par ,): │
│   voluntas, ratio, intellectus      │
│                                      │
│ Distance maximale : 20               │
│                                      │
│ Mode de contexte:                    │
│ ● Au moins un (OU)                   │
│ ○ Phrase optimisée                   │
│ ○ Tous (ET)                          │
└─────────────────────────────────────┘
```

#### Les 3 modes de contexte

##### Mode ANY (Au moins un - OU logique)

**Plus souple** - Trouve le lemme central + **au moins un** des contextes

```cql
[lemma="intentio"] []{0,20} ([lemma="voluntas"]|[lemma="ratio"]|[lemma="intellectus"])
```

**Trouve** :
- intentio + voluntas
- intentio + ratio
- intentio + intellectus
- intentio + voluntas + ratio
- intentio + tous les contextes

**Avantage** : Maximum de résultats
**Inconvénient** : Peut être trop large

##### Mode PHRASE (Optimisé - Évite doublons)

**Équilibré** - Optimise la requête pour éviter les répétitions

```cql
[lemma="intentio"] []{0,20} [lemma="voluntas"] |
[lemma="voluntas"] []{0,20} [lemma="intentio"] |
[lemma="intentio"] []{0,20} [lemma="ratio"] |
[lemma="ratio"] []{0,20} [lemma="intentio"]
```

**Trouve** : Chaque paire dans les deux sens sans doublons

**Avantage** : Résultats plus pertinents, pas de doublons
**Inconvénient** : Requête plus longue
**Recommandé** : Pour la plupart des cas

##### Mode ALL (Tous - ET logique)

**Plus restrictif** - Trouve **tous les contextes** autour du lemme central

```cql
[lemma="intentio"].*[lemma="voluntas"].*[lemma="ratio"].*[lemma="intellectus"]
```

**Trouve** : Seulement les passages avec intentio + voluntas + ratio + intellectus

**Avantage** : Très précis, contexte riche
**Inconvénient** : Peut ne rien trouver, peut générer des doublons
**Attention** : Peut donner le même passage plusieurs fois (si mots répétés)

#### Exemple pratique

**Recherche** : Passages où "intentio" apparaît avec des termes de volonté/raison

```
Lemme central     : intentio
Contextes         : voluntas, ratio, intellectus
Distance          : 25
Mode              : Phrase optimisée
```

**Résultat** :
```cql
[lemma="intentio"] []{0,25} [lemma="voluntas"] |
[lemma="voluntas"] []{0,25} [lemma="intentio"] |
[lemma="intentio"] []{0,25} [lemma="ratio"] |
[lemma="ratio"] []{0,25} [lemma="intentio"] |
[lemma="intentio"] []{0,25} [lemma="intellectus"] |
[lemma="intellectus"] []{0,25} [lemma="intentio"]
```

**Métadonnées affichées** :
- Central: intentio
- Contextes: voluntas, ratio, intellectus
- Distance: 25

#### Conseils

✅ **Recommandé** : Mode PHRASE pour la plupart des cas
✅ **Bon** : 2-4 lemmes de contexte (pas trop)
✅ **Bon** : Distance 20-30 pour le contexte sémantique
⚠️ **Attention** : Mode ALL peut ne rien trouver si critères trop stricts
⚠️ **Attention** : Trop de contextes (>5) = résultats rares

---

### 4. Proximité + Variations

**Objectif** : Combiner la recherche de proximité avec les variations orthographiques.

#### Quand l'utiliser ?

- Recherche exhaustive de cooccurrences
- Textes avec orthographe très variable
- Analyse diachronique de collocations

#### Interface

```
┌─────────────────────────────────────┐
│ Premier lemme      : intentio       │
│ Second lemme       : ratio          │
│ Distance maximale  : 15             │
│                                      │
│ Type de variations:                  │
│ ● Simple  ○ Moyen  ○ Médiéval       │
│                                      │
│ Attribut           : word           │
│ ☑ Bidirectionnel                    │
└─────────────────────────────────────┘
```

#### Paramètres

- **Premier/Second lemme** : Les deux termes à rechercher
- **Distance** : Mots entre les termes (0-100)
- **Type de variations** :
  - **Simple** : Pattern conservateur
  - **Moyen** : Pattern modéré
  - **Médiéval** : Substitutions médiévales (recommandé)
- **Attribut** : Toujours `word` (car on cherche des patterns)
- **Bidirectionnel** : Dans les deux sens

#### Exemple pratique

**Recherche** : "intentio" près de "ratio" avec variantes médiévales

```
Premier lemme     : intentio
Second lemme      : ratio
Distance          : 15
Variations        : Médiéval
Bidirectionnel    : ☑ Oui
```

**Résultat** :
```cql
[word="intentio|intencio|intentyo"] []{0,15} [word="ratio|racio"] |
[word="ratio|racio"] []{0,15} [word="intentio|intencio|intentyo"]
```

**Trouve** :
- intentio [0-15 mots] ratio
- intencio [0-15 mots] racio
- intentyo [0-15 mots] ratio
- Et toutes les combinaisons bidirectionnelles

#### Conseils

✅ **Recommandé** : Type "Médiéval" pour précision
✅ **Bon** : Distance 10-20 pour collocations
⚠️ **Attention** : Type "Moyen" ou "Complexe" peut ralentir la recherche
⚠️ **Attention** : Toujours utiliser `word` (pas `lemma`) avec variations

---

## Exemples pratiques

### Cas d'usage 1 : Théologie thomiste

**Objectif** : Étudier comment Thomas d'Aquin utilise "intentio" avec "finis"

**Onglet** : Proximité
**Paramètres** :
```
Premier lemme     : intentio
Second lemme      : finis
Distance          : 20
Attribut          : lemma
Bidirectionnel    : ☑ Oui
```

**Résultat** : Passages où "intentio" et "finis" sont proches

---

### Cas d'usage 2 : Philologie

**Objectif** : Trouver toutes les graphies de "philosophia" dans des manuscrits médiévaux

**Onglet** : Variations
**Paramètres** :
```
Mot              : philosophia
Désinences       : ☑ Avec désinences
```

**Utilisez** : Requête **médiévale**

**Résultat** : philosophia, filosofia, phylosophia, phylosofia, etc.

---

### Cas d'usage 3 : Analyse conceptuelle

**Objectif** : Passages sur l'intellect avec "ratio" et "intellectus" ensemble

**Onglet** : Contexte Sémantique
**Paramètres** :
```
Lemme central    : anima
Contextes        : ratio, intellectus, voluntas
Distance         : 30
Mode             : Tous (ET)
```

**Résultat** : Passages avec les 4 concepts ensemble

---

### Cas d'usage 4 : Collocations médiévales

**Objectif** : "peccatum" près de "mortale" avec variantes

**Onglet** : Proximité + Variations
**Paramètres** :
```
Premier lemme    : peccatum
Second lemme     : mortalis
Distance         : 5
Variations       : Médiéval
Bidirectionnel   : ☑ Oui
```

**Résultat** : Toutes les formes de "peccatum mortale"

---

## Conseils et astuces

### Choix de l'attribut

| Attribut | Quand l'utiliser | Exemple |
|----------|------------------|---------|
| `lemma` | Recherche conceptuelle, analyse sémantique | "intentio" trouve intentio, intentionis, intentionem... |
| `word` | Recherche philologique, avec variations | "intentio" trouve uniquement "intentio" |

### Distance optimale

| Contexte | Distance recommandée |
|----------|---------------------|
| Collocations figées | 0-5 |
| Associations courantes | 5-15 |
| Contexte sémantique | 15-30 |
| Analyse thématique large | 30-50 |

### Performance

✅ **Rapide** :
- Proximité avec `lemma`
- Variations médiévales
- Contexte sémantique mode PHRASE (2-3 contextes)

⚠️ **Moyen** :
- Variations moyennes
- Contexte sémantique mode ANY (4-5 contextes)

❌ **Lent** :
- Variations complexes
- Contexte sémantique mode ALL (>3 contextes)
- Proximité + Variations complexes

### Stratégie de recherche

1. **Commencer simple** : Proximité ou Variations médiévales
2. **Affiner** : Ajuster distance/type selon résultats
3. **Élargir si besoin** : Passer à variations moyennes/complexes
4. **Analyser** : Examiner les patterns dans les résultats

---

## FAQ

### Quelle est la différence entre `lemma` et `word` ?

- **`lemma`** : Forme canonique (dictionnaire)
  - Exemple : `lemma="esse"` trouve "sum", "est", "sunt", "fuit", etc.
- **`word`** : Forme exacte dans le texte
  - Exemple : `word="est"` trouve uniquement "est"

**Recommandation** : Utiliser `lemma` pour le latin (sauf avec variations)

### Pourquoi mes résultats sont vides ?

Causes fréquentes :
1. **Distance trop petite** : Essayez d'augmenter
2. **Mode ALL trop restrictif** : Passez à PHRASE ou ANY
3. **Orthographe** : Vérifiez l'orthographe des lemmes
4. **Variations trop simples** : Essayez le pattern médiéval

### Comment éviter les faux positifs ?

1. **Préférer `lemma`** à `word` (sauf variations)
2. **Utiliser variations médiévales** (pas complexes)
3. **Distance raisonnable** (pas >50)
4. **Mode PHRASE** au lieu de ANY pour contexte sémantique

### Puis-je combiner plusieurs types de recherches ?

Oui ! Utilisez les requêtes générées comme base et combinez-les manuellement :

```cql
([lemma="intentio"].*[lemma="voluntas"]) []{0,20} [lemma="Augustinus"]
```

Ceci recherche : (intentio + voluntas) près de Augustinus

### Comment copier la requête ?

1. Cliquez sur le bouton **"Copier"** dans la carte de résultat
2. La requête est copiée dans le presse-papier
3. Collez-la dans NoSketch Engine ou votre outil CQL

### Comment rechercher directement dans NoSketch ?

Cliquez sur le bouton **"Rechercher dans NoSketch"** dans la carte de résultat. Cela ouvre directement NoSketch Engine avec votre requête.

### Les requêtes sont-elles sauvegardées ?

Non, les requêtes ne sont pas sauvegardées. Copiez-les et conservez-les dans un fichier texte si besoin.

### Puis-je modifier les requêtes générées ?

Oui ! Les requêtes sont du CQL standard. Vous pouvez :
- Les copier et les modifier manuellement
- Les combiner
- Les utiliser dans n'importe quel outil CQL

---

## Ressources complémentaires

- **[Documentation CQL](https://www.sketchengine.eu/documentation/corpus-querying/)** - Syntaxe CQL complète
- **[NoSketch Engine](https://www.sketchengine.eu/nosketch/)** - Interface de recherche
- **[COMPONENTS.md](./COMPONENTS.md)** - Documentation technique des composants
- **[UTILS.md](./UTILS.md)** - Documentation des fonctions utilitaires

---

**Besoin d'aide ?** Consultez la documentation technique ou contactez l'équipe du projet.
