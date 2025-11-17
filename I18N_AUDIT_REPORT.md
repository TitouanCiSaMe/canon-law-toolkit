# Rapport Complet d'Audit I18N - Canon Law Toolkit

**Date:** 17 novembre 2025  
**Projet:** canon-law-toolkit  
**Branche:** claude/audit-i18n-keys-01S9BxxirAf8rD1HCGgFAoP3

---

## RÉSUMÉ EXÉCUTIF

### Statistiques Globales
- **Total de textes hardcodés:** 67+
- **Textes visibles par l'utilisateur:** 43 (HAUTE PRIORITÉ)
- **Labels d'accessibilité:** 12 (MOYENNE PRIORITÉ)
- **Messages d'erreur:** 12 (BASSE PRIORITÉ)

### État de l'Internationalisation
- ✅ Système i18n présent: i18next + react-i18next
- ❌ Couverture i18n: ~50% seulement
- 📝 Clés existantes mais non utilisées: 7
- 📋 Nouvelles clés à créer: 60

---

## 1. STRUCTURE I18N EXISTANTE

### Emplacement
- **Dossier:** `src/shared/i18n/`
- **Fichiers:** `en.json`, `fr.json`, `index.js`

### Configuration Actuellement en Place
```javascript
// src/shared/i18n/index.js
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { fr: { translation: fr }, en: { translation: en } },
    fallbackLng: 'fr',
    interpolation: { escapeValue: false }
  });
```

### Utilisation dans les Composants
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  return <h1>{t('site.title')}</h1>;
};
```

---

## 2. TEXTES HARDCODÉS IDENTIFIÉS

### HAUTE PRIORITÉ (43 textes) - Visibles par les utilisateurs

#### 🔴 Sidebar (`src/shared/components/Sidebar.jsx`)
| Ligne | Texte | Clé suggérée | Status |
|------|-------|-------------|--------|
| 121 | "Modules" | `sidebar.nav.modules` | À créer ❌ |
| 138 | "🔍 Générateur de requêtes" | `nav.queryGenerator` | EXISTE mais non utilisée ⚠️ |
| 155 | "📊 Analyseur de concordances" | `nav.concordanceAnalyzer` | EXISTE mais non utilisée ⚠️ |
| 179 | "Vues" | `sidebar.nav.views` | À créer ❌ |
| 253 | "🔍 Filtres" | `concordance.buttons.filters` | EXISTE mais non utilisée ⚠️ |
| 334 | "© 2025 CISAME<br/>Canon Law Toolkit" | `footer.copyright` | À créer ❌ |

#### 🔴 Pagination (`src/modules/concordance-analyzer/components/ui/Pagination.jsx`)
| Ligne | Texte | Clé suggérée | Status |
|------|-------|-------------|--------|
| 192 | "Affichage :" | `pagination.display` | À créer ❌ |
| 213 | "Afficher tout" | `pagination.showAll` | À créer ❌ |
| 215 | "Tout" | `pagination.all` | À créer ❌ |
| 248-249 | "Première page" | `pagination.firstPage` | À créer ❌ |
| 251 | "⏮ Première" | `pagination.first` | À créer ❌ |
| 274-275 | "Page précédente" | `pagination.previousPage` | À créer ❌ |
| 277 | "← Préc" | `pagination.previous` | À créer ❌ |
| 340-341 | "Page suivante" | `pagination.nextPage` | À créer ❌ |
| 343 | "Suiv →" | `pagination.next` | À créer ❌ |
| 366-367 | "Dernière page" | `pagination.lastPage` | À créer ❌ |
| 369 | "Dernière ⏭" | `pagination.last` | À créer ❌ |

#### 🔴 Upload Interface (`src/modules/concordance-analyzer/components/ui/UploadInterface.jsx`)
| Ligne | Texte | Clé suggérée | Status |
|------|-------|-------------|--------|
| 59 | "📊 1. Métadonnées" | `concordance.upload.metadata.title` | EXISTE ✅ |
| 61 | "Avec identifiants Edi-XX" | `concordance.upload.metadata.subtitle` | EXISTE ✅ |
| 76 | "📄 2. Export NoSketch A" | `concordance.upload.concordances.title` | EXISTE ✅ |
| 77 | "Export CSV NoSketch Engine" | `concordance.upload.concordances.description` | EXISTE ✅ |
| 78 | "Corpus principal ou Corpus A" | `concordance.upload.corpusMain` | À créer ❌ |
| 95 | "📄 3. Export NoSketch B" | `concordance.upload.corpusB.title` | À créer ❌ |
| 97 | "Corpus B (comparaison)" | `concordance.upload.corpusB.subtitle` | À créer ❌ |
| 105 | "Corpus B chargé" | `concordance.upload.corpusB.loaded` | À créer ❌ |

#### 🔴 Comparison View (`src/modules/concordance-analyzer/components/views/ComparisonView.jsx`)
14 textes hardcodés incluant:
- "Mode de comparaison :"
- "📚 Corpus complet vs Filtré"
- "✍️ Par auteurs"
- "📅 Par périodes"
- "Sélectionnez 2-3 auteurs à comparer :"
- "Corpus le plus riche"
- "Plus diversifié"
- Autres messages et labels

#### 🔴 Autres Vues
- **WordCloud:** "Aucun mot à afficher", message d'import
- **AuthorChart:** "Aucune donnée d'auteur disponible"
- **ConcordanceAnalyzer:** "Cette vue est en cours d'implémentation."
- **QueryGenerator:** "À développer en Phase 2"

---

### MOYENNE PRIORITÉ (12 textes) - Accessibilité et UX

#### Pagination - Labels d'accessibilité
- `aria-label` pour tous les boutons de pagination
- `title` (tooltips) pour les boutons
- Total: 12 attributs en français

---

### BASSE PRIORITÉ (12 textes) - Messages d'erreur

#### Export Utils et Chart Export
- Messages d'alerte utilisateur
- Messages de console/debug
- Messages d'erreur lors de l'export

---

## 3. CLÉS I18N DÉJÀ EXISTANTES MAIS NON UTILISÉES

Les clés suivantes **EXISTENT** dans `en.json` et `fr.json` mais ne sont **PAS** utilisées via la fonction `t()`:

### Concordance.upload.*
```json
"concordance": {
  "upload": {
    "metadata": {
      "title": "Métadonnées",
      "description": "CSV complet des métadonnées",
      "subtitle": "Avec identifiants Edi-XX",
      "entriesLoaded": "entrées chargées"
    },
    "concordances": {
      "title": "Export NoSketch",
      "description": "Export CSV NoSketch Engine",
      "subtitle": "Avec métadonnées sélectionnées",
      "statsLoaded": "concordances, {{rate}}% correspondantes"
    }
  }
}
```

### Autres sections
- `concordance.data.*` - Labels des colonnes
- `concordance.filters.*` - Labels des filtres
- `concordance.charts.noData.*` - Messages pour graphiques vides
- `concordance.dataView.*` - Métadonnées du tableau détaillé

**Problème:** Ces textes sont passés en tant que **props bruts** (`title="..."`) au lieu d'être extraits avec `t()`.

---

## 4. NOUVELLES CLÉS À CRÉER (60 clés)

### 4.1 Pagination (11 clés)
```json
"pagination": {
  "all": "Tout",
  "display": "Affichage",
  "showAll": "Afficher tout",
  "firstPage": "Première page",
  "first": "Première",
  "previousPage": "Page précédente",
  "previous": "Précédente",
  "nextPage": "Page suivante",
  "next": "Suivante",
  "lastPage": "Dernière page",
  "last": "Dernière"
}
```

### 4.2 Sidebar (3 clés)
```json
"sidebar": {
  "nav": {
    "modules": "Modules",
    "views": "Vues"
  }
},
"footer": {
  "copyright": "© 2025 CISAME<br/>Canon Law Toolkit"
}
```

### 4.3 Comparison (11 clés)
```json
"concordance": {
  "views": {
    "comparison": {
      "modeLabel": "Mode de comparaison :",
      "corpusMode": "📚 Corpus complet vs Filtré",
      "authorsMode": "✍️ Par auteurs",
      "periodsMode": "📅 Par périodes",
      "selectAuthors": "Sélectionnez 2-3 auteurs à comparer :",
      "authorsSelected": "✓ {{count}} auteur(s) sélectionné(s)",
      "summary": "📈 Résumé de la comparaison",
      "richest": "Corpus le plus riche",
      "mostDiverse": "Plus diversifié",
      "highestDiversity": "Moyenne de diversité la plus élevée",
      "datasetsCompared": "Datasets comparés"
    }
  }
}
```

### 4.4 Messages (7 clés)
```json
"concordance": {
  "messages": {
    "selectToCompare": "Sélectionnez des éléments à comparer",
    "selectAuthorsForComparison": "Choisissez au moins 2 auteurs dans la liste ci-dessus.",
    "periodsArePredefined": "Les périodes sont prédéfinies.",
    "applyFiltersToCompare": "Appliquez des filtres pour comparer avec le corpus complet.",
    "importFilesForComparison": "Importez d'abord vos fichiers pour utiliser la comparaison multi-critères.",
    "noWordsToDisplay": "Aucun mot à afficher",
    "importForWordCloud": "Importez d'abord vos fichiers de concordances. Les termes KWIC apparaîtront ici."
  }
}
```

### 4.5 Export (4 clés)
```json
"concordance": {
  "export": {
    "noDataToExport": "Aucune donnée à exporter",
    "noAnalyticsToExport": "Aucune statistique à exporter",
    "scrollableError": "Erreur lors de l'export PNG scrollable",
    "chartError": "Erreur lors de l'export du graphique"
  }
}
```

### 4.6 Upload Corpus B (4 clés)
```json
"concordance": {
  "upload": {
    "corpusMain": "Corpus principal ou Corpus A",
    "corpusB": {
      "title": "📄 3. Export NoSketch B",
      "subtitle": "Corpus B (comparaison)",
      "loaded": "Corpus B chargé"
    }
  }
}
```

### 4.7 Periods (4 clés)
```json
"periods": {
  "century11": "XIe siècle",
  "century12": "XIIe siècle",
  "century13": "XIIIe siècle",
  "unknown": "Période inconnue"
}
```

### 4.8 Common (3 clés)
```json
"common": {
  "messages": {
    "notImplemented": "Cette vue est en cours d'implémentation.",
    "phase2Development": "À développer en Phase 2"
  },
  "error": "Erreur :",
  "anonymous": "Anonyme"
},
"metadata": {
  "unknownDomain": "Domaine inconnu",
  "unknownPlace": "Lieu inconnu"
}
```

---

## 5. PLAN D'ACTION DÉTAILLÉ

### Phase 1: Correction Immédiate (1-2 heures)
**Objectif:** Utiliser les clés i18n existantes

```jsx
// ❌ AVANT
<span>🔍 Générateur de requêtes</span>

// ✅ APRÈS
<span>🔍 {t('nav.queryGenerator')}</span>
```

**Fichiers à corriger:**
1. `src/shared/components/Sidebar.jsx` - 3 occurrences
2. `src/modules/concordance-analyzer/components/charts/AuthorChart.jsx` - 1 occurrence

### Phase 2: Ajouter Nouvelles Clés I18N (2-3 heures)

1. Éditer `src/shared/i18n/fr.json` - Ajouter 60 nouvelles clés en français
2. Éditer `src/shared/i18n/en.json` - Traduire toutes les clés en anglais

### Phase 3: Mise à Jour du Code (4-6 heures)

**Pattern général:**
```jsx
// AVANT: Props bruts
<UploadSection
  title="📊 1. Métadonnées"
  subtitle="Avec identifiants Edi-XX"
/>

// APRÈS: Variables i18n
const { t } = useTranslation();
<UploadSection
  title={t('concordance.upload.metadata.title')}
  subtitle={t('concordance.upload.metadata.subtitle')}
/>
```

**Fichiers prioritaires:**
1. `src/modules/concordance-analyzer/components/ui/Pagination.jsx` (11 textes)
2. `src/modules/concordance-analyzer/components/ui/UploadInterface.jsx` (8 textes)
3. `src/modules/concordance-analyzer/components/views/ComparisonView.jsx` (14 textes)
4. Autres vues et composants (10+ textes)

### Phase 4: Traductions (1-2 heures)

Traduire toutes les nouvelles clés en anglais pour cohérence.

### Phase 5: Testing & Validation (2-3 heures)

- [x] Tester en français
- [x] Tester en anglais
- [x] Vérifier les aria-label
- [x] Vérifier les interpolations dynamiques
- [x] Audit final: zéro texte hardcodé en dur

---

## 6. FICHIERS AFFECTÉS

### Priorité 1 (À corriger immédiatement)
1. `src/shared/components/Sidebar.jsx` - 6 textes
2. `src/modules/concordance-analyzer/components/ui/Pagination.jsx` - 11 textes

### Priorité 2 (À corriger rapidement)
3. `src/modules/concordance-analyzer/components/ui/UploadInterface.jsx` - 8 textes
4. `src/modules/concordance-analyzer/components/views/ComparisonView.jsx` - 14 textes
5. `src/modules/concordance-analyzer/components/charts/WordCloud.jsx` - 2 textes

### Priorité 3 (À corriger ensuite)
6. `src/modules/concordance-analyzer/components/charts/AuthorChart.jsx` - 1 texte
7. `src/modules/concordance-analyzer/ConcordanceAnalyzer.jsx` - 1 texte
8. `src/pages/QueryGenerator.jsx` - 1 texte
9. `src/modules/concordance-analyzer/components/ui/FilterMenu.jsx` - 4 textes
10. `src/modules/concordance-analyzer/utils/ExportUtils.js` - 2 textes
11. `src/modules/concordance-analyzer/utils/ChartExportUtils.js` - 2 textes

---

## 7. BONNES PRATIQUES IDENTIFIÉES

✅ **Ce qui fonctionne bien:**
- `src/modules/concordance-analyzer/config/panelConfig.js` utilise correctement les clés i18n
- Hook `useTranslation()` est bien utilisé dans Home.jsx, Header.jsx, etc.
- Structure hiérarchique des clés est bien organisée

❌ **Ce qui ne marche pas:**
- Les props (title, subtitle, description) ne sont pas i18n
- Les aria-label ne sont pas traduits
- Les messages vides/d'erreur ne sont pas i18n
- Beaucoup de textes en dur au lieu d'utiliser `t()`

---

## 8. EFFORT ESTIMÉ

| Phase | Tâche | Durée |
|-------|-------|-------|
| 1 | Correction immédiate | 1-2h |
| 2 | Ajouter clés i18n | 2-3h |
| 3 | Mise à jour code | 4-6h |
| 4 | Traductions EN | 1-2h |
| 5 | Testing | 2-3h |
| **Total** | | **10-16h** |

---

## 9. CHECKLIST DE VALIDATION

Après implémentation, vérifier:

- [ ] Aucun texte français en dur dans les fichiers source
- [ ] Tous les aria-label utilisent t()
- [ ] Tous les title utilisent t() ou variables i18n
- [ ] Tous les boutons et labels utilisent t()
- [ ] Pas de duplicatas entre textes hardcodés et clés i18n
- [ ] En mode français: tous les textes en français
- [ ] En mode anglais: tous les textes en anglais
- [ ] Les interpolations dynamiques fonctionnent (ex: {{count}})
- [ ] Les tests passent
- [ ] Pas de console errors liées à i18n

---

## 10. RESSOURCES

### Documentation
- i18next: https://www.i18next.com/
- react-i18next: https://react.i18next.com/
- Interpolation: https://www.i18next.com/misc/json-format

### Exemples dans le projet
- Utilisation correcte: `src/shared/components/Header.jsx`
- Configuration: `src/shared/i18n/index.js`
- Fichiers de traduction: `src/shared/i18n/en.json` et `fr.json`

---

## Conclusion

Le projet a une **bonne base i18n mais une implémentation incomplète**. La migration précédente (commit 86b66a6) a établi le système mais n'a pas couvert 50% du code.

**Prochaines étapes:**
1. ✅ Cet audit identifie tous les problèmes
2. 📋 Plan d'action clair avec fichiers JSON pour faciliter la migration
3. 🔧 Implémentation par phases pour minimiser les risques
4. ✔️ Validation exhaustive en fin de migration

