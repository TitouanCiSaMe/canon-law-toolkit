# Guide I18n - Canon Law Toolkit

## 📚 Vue d'ensemble

Ce projet utilise **react-i18next** pour l'internationalisation. Toutes les chaînes de caractères affichées à l'utilisateur doivent passer par le système de traduction.

## 🗂️ Structure des fichiers

```
src/
├── shared/
│   └── i18n/
│       ├── fr.json          # Fichier de traductions français (principal)
│       └── __tests__/
│           └── i18n-keys.test.js  # Tests automatisés de validation
scripts/
└── audit-i18n.cjs          # Script d'audit i18n (CLI)
```

## 🔧 Utilisation dans le code

### Import et utilisation basique

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('concordance.app.title')}</h1>
      <p>{t('concordance.app.subtitle')}</p>
    </div>
  );
}
```

### Traductions avec interpolation

```jsx
// Dans fr.json:
{
  "concordance": {
    "upload": {
      "concordances": {
        "statsLoaded": "{{count}} concordances, {{rate}}% correspondantes"
      }
    }
  }
}

// Dans le code:
{t('concordance.upload.concordances.statsLoaded', {
  count: 500,
  rate: 85
})}
// Résultat: "500 concordances, 85% correspondantes"
```

### Traductions avec pluriels

```jsx
{t('concordance.charts.tooltip.rankOf', {
  rank: formatRank(5),
  total: 10
})}
// Résultat: "5ème sur 10"
```

### Traductions de données dynamiques (ex: domaines juridiques)

Pour traduire des données provenant du backend ou de fichiers CSV (comme les noms de domaines juridiques), utilisez un mapping de traduction :

```jsx
// Dans le composant
import { useTranslation } from 'react-i18next';

function DomainChart({ data }) {
  const { t } = useTranslation();

  // Fonction de traduction pour les domaines
  const translateDomain = (domainName) => {
    const translationKey = `metadata.domains.${domainName}`;
    const translated = t(translationKey);
    // Si la clé n'existe pas, retourner le nom original
    return translated !== translationKey ? translated : domainName;
  };

  // Appliquer la traduction aux données
  const translatedData = data.map(item => ({
    ...item,
    name: translateDomain(item.name)
  }));

  return <BarChart data={translatedData} />;
}
```

```json
// Dans fr.json et en.json
{
  "metadata": {
    "domains": {
      "Théologie": "Theology",
      "Droit canonique": "Canon Law",
      "Droit romain": "Roman Law"
    }
  }
}
```

Cette approche permet de :
- ✅ Traduire des données dynamiques provenant de sources externes
- ✅ Gérer gracieusement les valeurs non traduites (fallback au nom original)
- ✅ Centraliser les traductions dans les fichiers i18n
- ✅ Supporter l'ajout de nouvelles valeurs sans modifier le code

## 📋 Structure des clés

Les clés suivent une hiérarchie logique :

```
<module>.<section>.<element>.<détail>
```

### Exemples de conventions

- **Boutons** : `concordance.buttons.back`, `concordance.buttons.filters`
- **Panels** : `concordance.panels.domains.title`, `concordance.panels.temporal.subtitle`
- **Messages** : `concordance.messages.loading`, `concordance.messages.noData`
- **Charts** : `concordance.charts.labels.period`, `concordance.charts.noData.domains`
- **Stats** : `concordance.stats.total`, `concordance.stats.averagePerPeriod`
- **Upload** : `concordance.upload.metadata.title`, `concordance.upload.errors.fileRead`
- **Export** : `concordance.export.chartPNG`, `concordance.export.noDataToExport`

## 🔍 Audit automatique

### Script d'audit

Exécutez le script d'audit pour vérifier que toutes les clés utilisées dans le code existent dans `fr.json` :

```bash
node scripts/audit-i18n.cjs
```

### Sortie du script

✅ **Succès** :
```
╔═══════════════════════════════════════════════════════╗
║         🌐 AUDIT I18N - CANON LAW TOOLKIT           ║
╚═══════════════════════════════════════════════════════╝

🔍 Extraction des clés i18n utilisées dans le code...
✓ 233 clés i18n trouvées (hors fichiers de tests)
🔍 Chargement des clés disponibles dans fr.json...
✓ 287 clés disponibles dans fr.json

═══════════════════════════════════════════════════════
  RAPPORT D'AUDIT I18N
═══════════════════════════════════════════════════════

📊 Statistiques:
   • Clés utilisées dans le code: 233
   • Clés définies dans fr.json: 287
   • Clés manquantes: 0
   • Clés inutilisées: 54

✓ Aucune clé manquante !

✓ SUCCÈS : Toutes les clés utilisées sont définies !
```

❌ **Échec** (clés manquantes) :
```
❌ CLÉS MANQUANTES (3)
Ces clés sont utilisées dans le code mais absentes de fr.json:

   ✗ concordance.buttons.save
   ✗ concordance.messages.error
   ✗ concordance.charts.labels.total

❌ ÉCHEC : 3 clé(s) manquante(s)
```

## ✨ Bonnes pratiques

### ✅ À faire

1. **Toujours utiliser des clés** au lieu de texte en dur
   ```jsx
   // ✅ BON
   <h1>{t('concordance.app.title')}</h1>

   // ❌ MAUVAIS
   <h1>Analyseur de Concordances</h1>
   ```

2. **Nommer les clés de manière descriptive**
   ```jsx
   // ✅ BON
   t('concordance.buttons.back')
   t('concordance.messages.loading')

   // ❌ MAUVAIS
   t('back')
   t('msg1')
   ```

3. **Grouper les clés par contexte**
   ```json
   {
     "concordance": {
       "buttons": {
         "back": "Retour",
         "save": "Sauvegarder",
         "cancel": "Annuler"
       }
     }
   }
   ```

4. **Utiliser l'interpolation pour les valeurs dynamiques**
   ```jsx
   // ✅ BON
   t('stats.showing', { start: 1, end: 50, total: 500 })
   // "Affichage 1-50 sur 500"

   // ❌ MAUVAIS
   `Affichage ${start}-${end} sur ${total}`
   ```

### ❌ À éviter

1. **Ne pas traduire du texte en dur**
2. **Ne pas créer des clés trop génériques** (`error`, `title`, `text`)
3. **Ne pas dupliquer les traductions** (utiliser une seule clé)
4. **Ne pas oublier de traduire les tooltips, placeholders, aria-labels**

## 🛠️ Workflow de développement

### Ajouter une nouvelle fonctionnalité

1. **Identifier les textes à traduire**
   ```jsx
   // Nouveau composant
   function NewFeature() {
     return (
       <div>
         <h2>Mon nouveau titre</h2>
         <button>Sauvegarder</button>
       </div>
     );
   }
   ```

2. **Ajouter les clés dans fr.json**
   ```json
   {
     "concordance": {
       "newFeature": {
         "title": "Mon nouveau titre",
         "buttons": {
           "save": "Sauvegarder"
         }
       }
     }
   }
   ```

3. **Utiliser les clés dans le code**
   ```jsx
   function NewFeature() {
     const { t } = useTranslation();

     return (
       <div>
         <h2>{t('concordance.newFeature.title')}</h2>
         <button>{t('concordance.newFeature.buttons.save')}</button>
       </div>
     );
   }
   ```

4. **Vérifier avec l'audit**
   ```bash
   node scripts/audit-i18n.cjs
   ```

## 📊 Statistiques actuelles

- **Clés utilisées** : 233
- **Clés disponibles** : 287
- **Couverture** : 100% ✅
- **Clés inutilisées** : 54 (réservées pour usage futur)

## 🐛 Dépannage

### Problème : Clé non trouvée

**Symptôme** : La clé brute s'affiche (`concordance.stats.total` au lieu de "Total")

**Solution** :
1. Vérifier que la clé existe dans `fr.json`
2. Vérifier le chemin de la clé (respecter la casse et les points)
3. Exécuter l'audit : `node scripts/audit-i18n.cjs`

### Problème : Interpolation ne fonctionne pas

**Symptôme** : `{{count}}` s'affiche littéralement

**Solution** :
```jsx
// ❌ MAUVAIS
t('stats.total', count)

// ✅ BON
t('stats.total', { count: count })
```

## 🔄 Intégration CI/CD

Pour intégrer l'audit i18n dans votre pipeline CI/CD :

```yaml
# .github/workflows/ci.yml
- name: Audit i18n
  run: node scripts/audit-i18n.cjs
```

Le script retourne :
- **Code 0** : Toutes les clés sont présentes ✅
- **Code 1** : Des clés manquent ❌

## 📖 Ressources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- Fichier de traductions : `/src/shared/i18n/fr.json`
- Script d'audit : `/scripts/audit-i18n.cjs`
- Changelog : `/CHANGELOG.md` (voir v1.5.0 pour les dernières corrections CalKit)
