# Documentation CiSaMe Toolkit

Bienvenue dans la documentation du projet CiSaMe (Circulation des savoirs médiévaux au XIIe siècle).

## Guides disponibles

### 📐 [PANEL_LAYOUT_GUIDE.md](PANEL_LAYOUT_GUIDE.md)
**Modifier la disposition et les hauteurs des panels**

Utilisez ce guide pour :
- ✅ Déplacer un panel (changer sa position dans la grille)
- ✅ Modifier les hauteurs des lignes (éviter le scroll)
- ✅ Comprendre le système de grille CSS (`gridArea`)
- ✅ Dépanner les problèmes de positionnement

**Exemples couverts :**
- Mettre le panel Import en haut à gauche
- Ajuster les hauteurs pour tout voir sans scroller
- Réorganiser complètement la grille

---

### 🎨 [VISUAL_CUSTOMIZATION_GUIDE.md](VISUAL_CUSTOMIZATION_GUIDE.md)
**Personnaliser l'apparence visuelle des panels**

Utilisez ce guide pour :
- ✅ Changer les couleurs et gradients des panels
- ✅ Remplacer les icônes (Unicode)
- ✅ Modifier les espacements (gaps, padding)
- ✅ Personnaliser les effets visuels (hover, bordures, ombres)
- ✅ Ajuster les tailles de police
- ✅ Modifier les largeurs de colonnes
- ✅ Réorganiser l'ordre sur mobile/tablet

**Exemples couverts :**
- Changer un panel en bleu
- Trouver et ajouter une nouvelle icône
- Ajouter une bordure dorée quand un panel est vide
- Modifier l'effet au survol
- Augmenter toutes les tailles de police de 20%

---

## Quelle documentation utiliser ?

| Besoin | Guide à consulter |
|--------|-------------------|
| Déplacer un panel dans la grille | [PANEL_LAYOUT_GUIDE.md](PANEL_LAYOUT_GUIDE.md) |
| Ajuster hauteurs (éviter scroll) | [PANEL_LAYOUT_GUIDE.md](PANEL_LAYOUT_GUIDE.md) |
| Changer couleur d'un panel | [VISUAL_CUSTOMIZATION_GUIDE.md](VISUAL_CUSTOMIZATION_GUIDE.md) |
| Remplacer une icône | [VISUAL_CUSTOMIZATION_GUIDE.md](VISUAL_CUSTOMIZATION_GUIDE.md) |
| Modifier espacements entre panels | [VISUAL_CUSTOMIZATION_GUIDE.md](VISUAL_CUSTOMIZATION_GUIDE.md) |
| Personnaliser effet hover | [VISUAL_CUSTOMIZATION_GUIDE.md](VISUAL_CUSTOMIZATION_GUIDE.md) |
| Changer tailles de police | [VISUAL_CUSTOMIZATION_GUIDE.md](VISUAL_CUSTOMIZATION_GUIDE.md) |
| Réorganiser ordre mobile | [VISUAL_CUSTOMIZATION_GUIDE.md](VISUAL_CUSTOMIZATION_GUIDE.md) |

---

## Fichiers clés à modifier

### Pour la disposition (layout)
- **`src/modules/concordance-analyzer/config/panelConfig.js`**
  - Positions des panels (`gridArea`)
  - Tailles des panels (`size`)
  - Couleurs et icônes

- **`src/modules/concordance-analyzer/components/views/OverviewView.jsx`**
  - Hauteurs des lignes (`gridTemplateRows`)
  - Largeurs des colonnes (`gridTemplateColumns`)
  - Espacements (`gridGap`, `containerPadding`)
  - Tailles de police (`statFontSize`, `mainStatFontSize`)
  - Ordre JSX (mobile/tablet)

### Pour l'apparence visuelle
- **`src/modules/concordance-analyzer/components/ui/NavigationPanel.jsx`**
  - Effets hover (`transform`, `boxShadow`)
  - Bordures (`border`)
  - Padding interne
  - Overlay au survol

- **`src/shared/theme/globalTheme.js`**
  - Palette de couleurs globale
  - Fonction `createGradient()`

---

## Workflow recommandé

### Modification simple (1 panel)
1. Identifier le besoin (couleur, position, etc.)
2. Consulter le guide approprié
3. Ouvrir le fichier indiqué
4. Faire la modification
5. Sauvegarder et tester (hard refresh : Ctrl+Shift+R)
6. Commit et push

### Modification complexe (réorganisation complète)
1. Lire les deux guides
2. Planifier les changements (dessiner la nouvelle grille)
3. Modifier `panelConfig.js` (positions et couleurs)
4. Modifier `OverviewView.jsx` (hauteurs et espacements)
5. Tester sur desktop, tablet, mobile
6. Ajuster si nécessaire
7. Commit et push

---

## Aide et dépannage

### Problèmes courants

**"Mes changements ne s'appliquent pas"**
- Vérifier que le fichier est sauvegardé
- Faire un hard refresh (`Ctrl+Shift+R`)
- Vider le cache du navigateur
- Vérifier la console pour erreurs JavaScript

**"Le panel est au mauvais endroit"**
- Sur desktop : vérifier `gridArea` dans `panelConfig.js`
- Sur mobile : vérifier l'ordre JSX dans `OverviewView.jsx`

**"Les panels se chevauchent"**
- Vérifier que chaque panel a un `gridArea` unique
- Consulter [PANEL_LAYOUT_GUIDE.md](PANEL_LAYOUT_GUIDE.md) section "Dépannage"

**"Je dois scroller pour voir tout"**
- Augmenter les hauteurs dans `gridTemplateRows`
- Consulter [PANEL_LAYOUT_GUIDE.md](PANEL_LAYOUT_GUIDE.md) section "Modifier les hauteurs de lignes"

**"Le texte déborde du panel"**
- Réduire les tailles de police (`statFontSize`)
- Augmenter le padding interne du panel
- Consulter [VISUAL_CUSTOMIZATION_GUIDE.md](VISUAL_CUSTOMIZATION_GUIDE.md) section "Tailles de police"

---

## Ressources externes

- [CSS Grid Guide (MDN)](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout)
- [Unicode Table](https://unicode-table.com) - Recherche d'icônes
- [Coolors](https://coolors.co) - Générateur de palettes
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Contribuer à la documentation

Si vous identifiez des points manquants ou des améliorations possibles :
1. Créer une issue sur le dépôt Git
2. Ou proposer directement une modification (PR)
3. Ou contacter l'équipe CiSaMe

---

**Dernière mise à jour :** Décembre 2025
**Équipe :** CiSaMe Toolkit Development Team
