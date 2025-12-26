# Guide de démarrage rapide - CiSaMe Concordance Analyzer

Guide pratique pour commencer à utiliser l'analyseur de concordances en 5 minutes. 🚀

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

1. **Fichier de métadonnées** (CSV)
   - Format : Export complet avec identifiants Edi-XX
   - Colonnes requises : `Identifiant interne`, `Title Edition`, `Person Record Title`, `Date`, `Lieu ou aire géographique de rédaction`, `Type de droit`
   - Exemple : `Export_Métadonnées.csv`

2. **Fichier de concordances** (CSV)
   - Format : Export NoSketch Engine
   - Colonnes minimales : `Left`, `KWIC`, `Right`, `Doc.title`
   - Exemple : `Export_NoSketch.csv`

## 🚀 Démarrage en 5 étapes

### Étape 1 : Accéder à l'application

```bash
# Lancer le serveur de développement
npm run dev

# Ou visiter l'URL de production
# https://votre-domaine.fr/concordance-analyzer
```

Cliquez sur **"📊 Analyseur de concordances"** dans la sidebar à gauche.

---

### Étape 2 : Charger les métadonnées

1. Dans la **sidebar à gauche**, cliquez sur **"📁 Import"** en bas de la liste des vues
2. Dans la section **"Métadonnées"** :
   - Cliquez sur la zone de drop ou utilisez le sélecteur de fichier
   - Sélectionnez votre fichier CSV de métadonnées
   - Attendez la confirmation : `"117 entrées chargées"` (exemple)

✅ **Indicateur de succès** : Le badge passe au vert avec le nombre d'entrées

---

### Étape 3 : Charger les concordances

1. Dans la même vue **"Import"**
2. Section **"Export NoSketch"** :
   - Uploadez votre fichier d'export NoSketch
   - Le parsing démarre automatiquement
   - Attendez le message : `"50 concordances, 95% matchées"` (exemple)

✅ **Indicateur de succès** : Le compteur dans la **sidebar (milieu gauche)** affiche le nombre de concordances

⚠️ **Ordre important** : Toujours charger les métadonnées AVANT les concordances pour un enrichissement optimal.

---

### Étape 4 : Explorer les données

Cliquez sur n'importe quelle vue dans la **sidebar à gauche** pour voir l'analyse détaillée :

**📊 Vue d'ensemble** (🏠 Overview)
- Statistiques globales
- Taux de correspondance
- Nombre total de concordances
- Grille de panels cliquables

**📚 Domaines**
- Bar chart des domaines juridiques
- Top domaines avec compteurs

**⏰ Chronologie**
- Évolution temporelle
- Timeline Gantt des œuvres
- Options de granularité (années, décennies, etc.)

**✍️ Auteurs**
- Distribution par auteurs
- Top auteurs référencés

**🌍 Lieux**
- Répartition géographique
- Filtré sur France, Irlande, Angleterre, Allemagne

**🔤 Terminologie**
- Analyse lexicale
- Termes KWIC fréquents

**📋 Données**
- Table complète paginée
- Contexte Left/KWIC/Right
- Métadonnées enrichies

💡 **Astuce** : La vue active est marquée en jaune dans la sidebar

---

### Étape 5 : Utiliser les filtres

1. Cliquez sur le bouton **"🔍 Filtres"** dans la **sidebar à gauche** (au milieu)
2. Le panneau de filtres s'ouvre sur le côté droit :

**🔍 Recherche textuelle**
- Tapez du texte pour filtrer dans Left/KWIC/Right/Author/Title
- Mise à jour instantanée

**Multi-sélection**
- 👤 Auteurs : Cochez les auteurs à inclure
- 📚 Domaines : Sélectionnez les domaines juridiques
- 📅 Périodes : Choisissez les périodes temporelles
- 🌍 Lieux : Filtrez par zone géographique

**Combinaison**
- Tous les filtres s'appliquent en mode AND
- Le badge sur le bouton "Filtres" affiche le nombre de filtres actifs
- Bouton **"Réinitialiser"** pour tout effacer

✅ **Effet immédiat** : Toutes les vues se mettent à jour automatiquement

💡 **Astuce** : Le nombre de filtres actifs apparaît dans un badge jaune à côté du bouton Filtres

---

## 💡 Cas d'usage typiques

### Analyser un auteur spécifique

```
1. Ouvrir les Filtres
2. Section "Auteurs" → Cocher "Gratianus"
3. Naviguer entre les vues pour voir :
   - Domaines privilégiés par cet auteur
   - Période d'activité
   - Lieux associés
   - Terminologie spécifique
```

### Comparer deux périodes

```
1. Vue Chronologie
2. Sélectionner granularité "Décennies"
3. Observer la distribution temporelle
4. Utiliser filtres pour isoler une période
5. Exporter les concordances filtrées
```

### Étudier un domaine juridique

```
1. Ouvrir Filtres → Domaines
2. Sélectionner "Droit canonique"
3. Vue Auteurs : Qui écrit sur ce domaine ?
4. Vue Chronologie : Évolution temporelle ?
5. Vue Terminologie : Termes-clés associés ?
```

---

## 📤 Exporter les résultats

Chaque vue propose des boutons d'export :

**📋 Export concordances CSV**
- Toutes les concordances filtrées
- Avec métadonnées enrichies
- Format compatible Excel/LibreOffice

**📈 Export analytics JSON**
- Statistiques calculées
- Structure complète des données
- Pour traitement ultérieur

**📷 Export graphique PNG**
- Capture du graphique actuel
- Haute résolution
- Pour publications/présentations

---

## 🌐 Changer de langue

Cliquez sur le bouton de langue dans la **sidebar** (en bas, au-dessus du footer) :

- 🇫🇷 **Français** : Interface en français
- 🇬🇧 **English** : Interface en anglais

Le changement est instantané, sans rechargement.

---

## ⚖️ Comparer deux corpus

Pour analyser deux corpus distincts :

1. **Charger le premier corpus** (Métadonnées + Concordances)
2. Cliquer sur le panel **"Comparaison de Corpus"**
3. Uploader un second fichier de concordances
4. L'analyse comparative se génère automatiquement :
   - 📊 Volumes comparés
   - 📚 Domaines communs / exclusifs
   - ✍️ Auteurs : distribution A vs B
   - ⏰ Évolution temporelle parallèle
   - 📖 Terminologie : termes spécifiques à chaque corpus

---

## 🔧 Résolution de problèmes

### "Taux de correspondance faible (< 50%)"

**Causes possibles** :
- Identifiants Edi-XX manquants dans Doc.title
- Format des références non standard
- Fichier de métadonnées incomplet

**Solutions** :
1. Vérifier que Doc.title contient `[Edi-XX]`
2. S'assurer que les métadonnées couvrent toutes les œuvres
3. Utiliser le fallback : données conservées même sans match

---

### "Aucune donnée affichée"

**Vérifications** :
1. Les fichiers sont-ils bien uploadés ? (compteur en haut à droite)
2. Des filtres sont-ils actifs ? (badge "Filtres")
3. La vue sélectionnée a-t-elle des données ? (certaines vues requièrent des champs spécifiques)

**Solution rapide** : Réinitialiser tous les filtres

---

### "Graphiques ne s'affichent pas"

**Causes** :
- Données manquantes pour la vue
- Navigateur non compatible

**Solutions** :
1. Vérifier que les données contiennent les champs nécessaires
2. Utiliser un navigateur moderne (Chrome, Firefox, Edge)
3. Rafraîchir la page (Ctrl+F5)

---

## 📚 Aller plus loin

### Documentation complète

- [README.md](README.md) - Vue d'ensemble du projet
- [ARCHITECTURE.md](ARCHITECTURE.md) - Détails techniques
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribuer au projet

### Exemples de corpus

Des fichiers d'exemple sont disponibles dans le dossier `examples/` :
- `Export_Métadonnées_exemple.csv` : 117 entrées de métadonnées
- `Export_NoSketch_exemple.csv` : 50 concordances

### Support

- **Issues** : [GitLab Issues](https://gitlab.com/cisame/canon-law-toolkit/-/issues)
- **Email** : contact@cisame.fr
- **Documentation** : [Wiki du projet](https://gitlab.com/cisame/canon-law-toolkit/-/wikis)

---

## ✅ Checklist de démarrage

Avant de commencer votre première analyse :

- [ ] J'ai installé l'application (`npm install`)
- [ ] Le serveur tourne (`npm run dev`)
- [ ] J'ai mes fichiers CSV prêts (métadonnées + concordances)
- [ ] J'ai chargé les métadonnées en premier
- [ ] J'ai chargé les concordances ensuite
- [ ] Le taux de correspondance est > 50%
- [ ] J'ai exploré au moins 3 vues différentes
- [ ] J'ai testé les filtres
- [ ] J'ai exporté des résultats

---

## 🎯 Prochaines étapes

Maintenant que vous maîtrisez les bases :

1. **Expérimentez** avec différents corpus
2. **Combinez** plusieurs filtres pour des analyses fines
3. **Exportez** vos résultats pour publications
4. **Comparez** plusieurs corpus pour analyses comparatives
5. **Contribuez** en proposant des améliorations

---

**Besoin d'aide ?** Consultez la [documentation complète](README.md) ou ouvrez une [issue](https://gitlab.com/cisame/canon-law-toolkit/-/issues) !

**Bon courage dans vos recherches ! 🎓**

---

*Guide mis à jour : Novembre 2025*  
*Version de l'application : 1.0.0*
