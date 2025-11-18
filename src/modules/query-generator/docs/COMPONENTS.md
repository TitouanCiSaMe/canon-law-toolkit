# Documentation des Composants

Guide complet de tous les composants UI du module Query Generator.

## 📑 Table des matières

- [Composants UI](#composants-ui)
  - [FormField](#formfield)
  - [RadioGroup](#radiogroup)
  - [Checkbox](#checkbox)
  - [InfoBox](#infobox)
  - [ResultCard](#resultcard)
- [Vues](#vues)
  - [ProximityView](#proximityview)
  - [VariationView](#variationview)
  - [SemanticView](#semanticview)
  - [ProximityVariationView](#proximityvariationview)
- [Composant Principal](#composant-principal)
- [CSS Modules](#css-modules)

---

## Composants UI

Les composants UI sont des composants réutilisables qui utilisent **CSS Modules** pour le styling.

### FormField

Champ de formulaire universel avec label et validation.

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `label` | `string` | - | Label du champ (requis) |
| `type` | `string` | `'text'` | Type d'input : `'text'`, `'number'`, `'select'`, `'textarea'` |
| `value` | `string` | - | Valeur actuelle (requis) |
| `onChange` | `function` | - | Callback appelé lors du changement (requis) |
| `placeholder` | `string` | `''` | Placeholder de l'input |
| `options` | `Array<{value, label}>` | `[]` | Options pour le select |
| `helpText` | `string` | `''` | Texte d'aide sous le champ |
| `min` | `number` | - | Valeur minimale (pour `type="number"`) |
| `max` | `number` | - | Valeur maximale (pour `type="number"`) |
| `required` | `boolean` | `false` | Champ requis (affiche un astérisque) |
| `rows` | `number` | `3` | Nombre de lignes (pour `type="textarea"`) |

#### Exemples

**Input texte basique**
```jsx
<FormField
  label="Mot à rechercher"
  type="text"
  value={mot}
  onChange={setMot}
  placeholder="ex: intentio"
  required
/>
```

**Input numérique avec limites**
```jsx
<FormField
  label="Distance maximale"
  type="number"
  value={distance}
  onChange={setDistance}
  min={0}
  max={100}
  helpText="Nombre de mots entre les deux lemmes"
  required
/>
```

**Select avec options**
```jsx
<FormField
  label="Attribut"
  type="select"
  value={attribute}
  onChange={setAttribute}
  options={[
    { value: 'lemma', label: 'Lemme' },
    { value: 'word', label: 'Mot' }
  ]}
/>
```

**Textarea**
```jsx
<FormField
  label="Contexte"
  type="textarea"
  value={context}
  onChange={setContext}
  rows={5}
  placeholder="Entrez le contexte..."
/>
```

#### CSS Module

Fichier : `FormField.module.css`

Classes disponibles :
- `.field` - Container principal
- `.label` - Label du champ
- `.required` - Astérisque rouge pour champs requis
- `.input` - Styles pour tous les inputs
- `.textarea` - Styles additionnels pour textarea
- `.helpText` - Texte d'aide

---

### RadioGroup

Groupe de boutons radio avec support des descriptions et mode inline.

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `label` | `string` | - | Label du groupe |
| `value` | `string` | - | Valeur sélectionnée (requis) |
| `onChange` | `function` | - | Callback appelé lors du changement (requis) |
| `options` | `Array<{value, label, description?}>` | - | Options radio (requis) |
| `name` | `string` | - | Nom du groupe radio (requis) |
| `inline` | `boolean` | `false` | Afficher les options en ligne |

#### Exemples

**Radio group vertical (par défaut)**
```jsx
<RadioGroup
  label="Type de recherche"
  value={searchType}
  onChange={setSearchType}
  name="searchType"
  options={[
    {
      value: 'simple',
      label: 'Simple',
      description: 'Recherche basique'
    },
    {
      value: 'advanced',
      label: 'Avancée',
      description: 'Avec options supplémentaires'
    }
  ]}
/>
```

**Radio group horizontal**
```jsx
<RadioGroup
  label="Mode de contexte"
  value={contextMode}
  onChange={setContextMode}
  name="contextMode"
  options={[
    { value: 'any', label: 'Au moins un (OU)' },
    { value: 'phrase', label: 'Phrase optimisée' },
    { value: 'all', label: 'Tous (ET)' }
  ]}
  inline
/>
```

#### CSS Module

Fichier : `RadioGroup.module.css`

Classes principales :
- `.container` - Container du groupe
- `.label` - Label du groupe
- `.optionsContainer` - Container des options (flex column)
- `.optionsContainerInline` - Variant horizontal (flex row)
- `.option` - Label de chaque option
- `.optionInline` - Variant inline pour option
- `.radio` - Input radio
- `.optionLabel` - Texte de l'option
- `.description` - Description optionnelle

---

### Checkbox

Case à cocher simple (exportée depuis RadioGroup).

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `label` | `string` | - | Label de la checkbox (requis) |
| `checked` | `boolean` | - | État coché (requis) |
| `onChange` | `function` | - | Callback appelé lors du changement (requis) |

#### Exemple

```jsx
import { Checkbox } from '../ui/RadioGroup';

<Checkbox
  label="Recherche bidirectionnelle"
  checked={bidirectional}
  onChange={setBidirectional}
/>
```

#### CSS Module

Utilise le même fichier `RadioGroup.module.css` :
- `.checkboxContainer` - Container de la checkbox
- `.checkbox` - Input checkbox
- `.checkboxLabel` - Label de la checkbox

---

### InfoBox

Boîte d'information avec 4 types : info, success, warning, error.

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `type` | `string` | `'info'` | Type : `'info'`, `'success'`, `'warning'`, `'error'` |
| `title` | `string` | - | Titre de la boîte |
| `children` | `ReactNode` | - | Contenu de la boîte (requis) |
| `icon` | `ReactNode` | - | Icône personnalisée (optionnel) |

#### Exemples

**Information**
```jsx
<InfoBox type="info" title="Recherche de proximité">
  Trouvez deux lemmes qui apparaissent à une distance donnée l'un de l'autre.
</InfoBox>
```

**Succès**
```jsx
<InfoBox type="success" title="Requête générée">
  Votre requête CQL a été générée avec succès !
</InfoBox>
```

**Avertissement**
```jsx
<InfoBox type="warning" title="Attention">
  La recherche peut prendre plusieurs minutes sur de gros corpus.
</InfoBox>
```

**Erreur**
```jsx
{error && (
  <InfoBox type="error" title="Erreur">
    {error}
  </InfoBox>
)}
```

#### CSS Module

Fichier : `InfoBox.module.css`

Classes par type :
- `.box` + `.boxInfo` / `.boxSuccess` / `.boxWarning` / `.boxError`
- `.icon` + `.iconInfo` / `.iconSuccess` / `.iconWarning` / `.iconError`
- `.title` + `.titleInfo` / `.titleSuccess` / `.titleWarning` / `.titleError`
- `.content` + `.contentInfo` / `.contentSuccess` / `.contentWarning` / `.contentError`

---

### ResultCard

Carte de résultat pour afficher les requêtes CQL générées avec actions.

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `title` | `string` | - | Titre de la carte (requis) |
| `query` | `string` | - | Requête CQL générée (requis) |
| `metadata` | `Object` | `{}` | Métadonnées à afficher (clé: valeur) |
| `patterns` | `Array<string>` | `[]` | Patterns de variations à afficher |
| `variant` | `string` | `'default'` | Variant : `'default'` ou `'medieval'` |

#### Exemples

**Carte simple**
```jsx
<ResultCard
  title="Requête CQL générée"
  query='[lemma="intentio"] []{0,10} [lemma="Augustinus"]'
/>
```

**Avec métadonnées**
```jsx
<ResultCard
  title="Requête de proximité"
  query={result.query}
  metadata={{
    'Lemme 1': result.lemma1,
    'Lemme 2': result.lemma2,
    'Distance': result.distance,
    'Bidirectionnel': result.bidirectional ? 'Oui' : 'Non'
  }}
/>
```

**Avec patterns (variations)**
```jsx
<ResultCard
  title="Requête simple"
  query={result.requete1}
  patterns={result.patterns.simple}
/>
```

**Variant médiéval**
```jsx
<ResultCard
  title="Requête médiévale"
  query={result.requete_medievale}
  variant="medieval"
  metadata={{
    'Substitutions': 'ae/e, v/u, j/i, ti/ci'
  }}
/>
```

#### Fonctionnalités

- **Copier** : Copie la requête dans le presse-papier
- **Rechercher** : Ouvre NoSketch Engine avec la requête
- **Patterns** : Affiche les 8 premiers patterns (+ "..." si plus)

#### CSS Module

Fichier : `ResultCard.module.css`

Classes principales :
- `.card` + `.cardMedieval` - Container de la carte
- `.title` + `.titleMedieval` - Titre
- `.queryDisplay` - Zone d'affichage de la requête
- `.queryCode` - Code CQL
- `.metadata` - Zone des métadonnées
- `.metadataItem` - Item de métadonnée
- `.patternsPreview` - Prévisualisation des patterns
- `.actions` - Container des boutons
- `.button` + `.buttonPrimary` / `.buttonSecondary` - Boutons

---

## Vues

Les vues sont des composants complets qui combinent les composants UI pour créer des fonctionnalités.

### ProximityView

Recherche de proximité entre deux lemmes.

#### Fichier
`components/views/ProximityView.jsx`

#### État

```javascript
const [lemma1, setLemma1] = useState('intentio');
const [lemma2, setLemma2] = useState('Augustinus');
const [distance, setDistance] = useState(10);
const [attribute, setAttribute] = useState('lemma');
const [bidirectional, setBidirectional] = useState(true);
const [result, setResult] = useState(null);
const [error, setError] = useState(null);
```

#### Composants utilisés

- `FormField` (x3) : lemma1, lemma2, distance
- `FormField` type="select" : attribute
- `Checkbox` : bidirectional
- `InfoBox` : erreurs
- `ResultCard` : résultat

---

### VariationView

Génération de variations orthographiques.

#### Fichier
`components/views/VariationView.jsx`

#### État

```javascript
const [mot, setMot] = useState('intentio');
const [withSuffix, setWithSuffix] = useState(true);
const [result, setResult] = useState(null);
const [error, setError] = useState(null);
```

#### Résultats

Génère 4 requêtes :
1. **Simple** : `requete1` - Pattern basique
2. **Moyenne** : `requete2` - Pattern moyen
3. **Complexe** : `requete3` - Pattern complexe
4. **Médiévale** : `requete_medievale` - Substitutions ae/e, v/u, j/i, ti/ci

Chaque résultat est affiché dans un `ResultCard` séparé.

---

### SemanticView

Recherche sémantique avec contexte.

#### Fichier
`components/views/SemanticView.jsx`

#### État

```javascript
const [centralLemma, setCentralLemma] = useState('intentio');
const [contextLemmas, setContextLemmas] = useState('voluntas, ratio, intellectus');
const [distance, setDistance] = useState(20);
const [contextMode, setContextMode] = useState('any');
const [result, setResult] = useState(null);
const [error, setError] = useState(null);
```

#### Modes de contexte

- **any** : `(context1|context2|context3)` - Au moins un
- **phrase** : Optimisé, évite doublons
- **all** : `context1.*context2.*context3` - Tous requis

---

### ProximityVariationView

Combine proximité et variations orthographiques.

#### Fichier
`components/views/ProximityVariationView.jsx`

#### État

```javascript
const [lemma1, setLemma1] = useState('intentio');
const [lemma2, setLemma2] = useState('Augustinus');
const [distance, setDistance] = useState(10);
const [variationType, setVariationType] = useState('simple');
const [attribute, setAttribute] = useState('word');
const [bidirectional, setBidirectional] = useState(true);
const [result, setResult] = useState(null);
const [error, setError] = useState(null);
```

#### Types de variations

- **simple** : Pattern basique
- **medium** : Pattern moyen
- **medieval** : Substitutions médiévales

---

## Composant Principal

### QueryGenerator

Composant principal avec navigation par onglets.

#### Fichier
`components/QueryGenerator.jsx`

#### Structure

```jsx
<div className={styles.container}>
  <header className={styles.header}>
    <h1>Générateur de Requêtes CQL</h1>
  </header>

  <nav className={styles.tabs}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={activeTab === tab.id ? styles.tabActive : styles.tab}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </nav>

  <main className={styles.content}>
    {activeTab === 'proximity' && <ProximityView />}
    {activeTab === 'variation' && <VariationView />}
    {activeTab === 'semantic' && <SemanticView />}
    {activeTab === 'proximityVariation' && <ProximityVariationView />}
  </main>
</div>
```

#### Onglets

1. **Proximité** - `ProximityView`
2. **Variations** - `VariationView`
3. **Sémantique** - `SemanticView`
4. **Proximité + Variations** - `ProximityVariationView`

---

## CSS Modules

### Avantages

✅ **Styles scopés** : Pas de conflits de noms
✅ **Maintenabilité** : Styles séparés du JS
✅ **Performance** : Pas de création d'objets à chaque render
✅ **Lisibilité** : CSS pur au lieu d'objets JS

### Convention de nommage

- **camelCase** pour les classes : `.formTitle`, `.submitButton`
- **Variants avec suffixes** : `.buttonPrimary`, `.buttonSecondary`
- **States composés** : `className={`${styles.card} ${variant ? styles.cardVariant : ''}`}`

### Exemple d'utilisation

**Fichier JSX**
```jsx
import styles from './MyComponent.module.css';

function MyComponent() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Titre</h2>
      <button className={`${styles.button} ${styles.buttonPrimary}`}>
        Action
      </button>
    </div>
  );
}
```

**Fichier CSS**
```css
.container {
  padding: 1.5rem;
  background: white;
}

.title {
  font-size: 1.2rem;
  color: #333;
}

.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.buttonPrimary {
  background: #1e40af;
  color: white;
}
```

### Migration depuis inline styles

**Avant** (inline styles)
```jsx
<div style={{ padding: '1.5rem', background: 'white' }}>
  <h2 style={{ fontSize: '1.2rem', color: '#333' }}>Titre</h2>
</div>
```

**Après** (CSS Modules)
```jsx
<div className={styles.container}>
  <h2 className={styles.title}>Titre</h2>
</div>
```

---

## Bonnes pratiques

### Composants UI

1. **Props typées** : Toujours documenter les props avec JSDoc
2. **Valeurs par défaut** : Fournir des défauts sensés
3. **Validation** : Vérifier les props requises
4. **Accessibilité** : Labels, required, aria-*

### Vues

1. **État minimal** : Seulement ce qui est nécessaire
2. **Gestion d'erreurs** : Toujours afficher les erreurs
3. **Loading states** : Feedback pendant les opérations
4. **Reset** : Permettre de réinitialiser le formulaire

### CSS Modules

1. **Un fichier par composant** : `Component.jsx` → `Component.module.css`
2. **Classes sémantiques** : `.submitButton` pas `.btn1`
3. **Variants explicites** : `.buttonPrimary` pas `.primary`
4. **Pas de !important** : Utiliser la spécificité correctement

---

## Tests

Chaque composant dispose de tests unitaires complets.

### Exemple de test

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import FormField from '../FormField';

it('devrait appeler onChange lors de la saisie', () => {
  const handleChange = vi.fn();
  render(
    <FormField
      label="Nom"
      value=""
      onChange={handleChange}
    />
  );

  const input = screen.getByLabelText('Nom');
  fireEvent.change(input, { target: { value: 'test' } });

  expect(handleChange).toHaveBeenCalledWith('test');
});
```

### Lancer les tests

```bash
# Tests UI uniquement
npm test -- src/modules/query-generator/components/ui/__tests__

# Tests des vues
npm test -- src/modules/query-generator/components/views/__tests__
```

---

## Ressources

- [React Documentation](https://react.dev/)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [React Testing Library](https://testing-library.com/react)
- [Lucide Icons](https://lucide.dev/)
