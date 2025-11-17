# Guide du Responsive Design - Canon Law Toolkit

Ce guide explique comment utiliser le système de breakpoints et les hooks responsive pour adapter votre interface à toutes les tailles d'écran.

---

## 📐 Breakpoints Disponibles

```javascript
xs:  0px      // Extra small (phones portrait)
sm:  480px    // Small (phones landscape)
md:  768px    // Medium (tablets)
lg:  1024px   // Large (desktops)
xl:  1280px   // Extra large (large desktops)
xxl: 1536px   // XXL (wide screens)
```

---

## 🎨 Utilisation dans les CSS

### Méthode 1 : Media Queries dans les fichiers CSS

```css
/* Mobile first approach */
.container {
  padding: 1rem;
}

/* Tablet et plus */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop et plus */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

### Méthode 2 : Grilles responsive

```css
.grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: 1 colonne */
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 colonnes */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr); /* Desktop: 4 colonnes */
  }
}
```

---

## ⚛️ Utilisation dans React avec Hooks

### Hook `useBreakpoint()`

Hook complet qui retourne toutes les informations sur la taille d'écran.

```jsx
import { useBreakpoint } from '../../shared/hooks';

function MyComponent() {
  const {
    breakpoint,    // 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'
    width,         // Largeur actuelle
    isMobile,      // true si < 768px
    isTablet,      // true si 768-1023px
    isDesktop,     // true si >= 1024px
    isUp,          // Fonction: isUp('md') → true si >= 768px
    isDown         // Fonction: isDown('lg') → true si < 1024px
  } = useBreakpoint();

  return (
    <div>
      <p>Breakpoint actuel: {breakpoint}</p>
      <p>Largeur: {width}px</p>

      {isMobile && <MobileMenu />}
      {isDesktop && <DesktopSidebar />}
    </div>
  );
}
```

### Hook `useIsMobile()`

Version simplifiée pour détecter uniquement le mode mobile.

```jsx
import { useIsMobile } from '../../shared/hooks';

function NavigationBar() {
  const isMobile = useIsMobile();

  return (
    <nav>
      {isMobile ? (
        <HamburgerMenu />
      ) : (
        <FullNavigation />
      )}
    </nav>
  );
}
```

### Hook `useResponsiveValue()`

Retourne des valeurs différentes selon le breakpoint actuel.

```jsx
import { useResponsiveValue } from '../../shared/hooks';

function ChartContainer() {
  // Définir la hauteur selon le breakpoint
  const chartHeight = useResponsiveValue({
    xs: 250,   // Mobile
    sm: 300,   // Phone landscape
    md: 350,   // Tablet
    lg: 400,   // Desktop
    xl: 450    // Large desktop
  });

  // Définir le nombre de colonnes
  const columns = useResponsiveValue({
    xs: 1,
    md: 2,
    lg: 4
  });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    }}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data}>
          {/* ... */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## 🎯 Exemples Pratiques

### 1. Sidebar Responsive

```jsx
import { useBreakpoint } from '../../shared/hooks';
import { globalTheme } from '../../shared/theme/globalTheme';

function Layout() {
  const { isMobile, isDesktop } = useBreakpoint();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      {isMobile ? (
        // Mobile: Menu hamburger + overlay
        <>
          <HamburgerButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          {mobileMenuOpen && (
            <MobileSidebar onClose={() => setMobileMenuOpen(false)} />
          )}
        </>
      ) : (
        // Desktop: Sidebar fixe
        <DesktopSidebar />
      )}

      {/* Contenu principal */}
      <main style={{
        flex: 1,
        marginLeft: isDesktop ? '280px' : '0',
        padding: isMobile ? '1rem' : '2rem'
      }}>
        {children}
      </main>
    </div>
  );
}
```

### 2. Grille Responsive avec OverviewView

```jsx
import { useResponsiveValue } from '../../shared/hooks';

function OverviewView() {
  const gridColumns = useResponsiveValue({
    xs: '1fr',                    // Mobile: 1 colonne
    sm: '1fr',                    // Phone landscape: 1 colonne
    md: 'repeat(2, 1fr)',         // Tablet: 2 colonnes
    lg: 'minmax(400px, 1.3fr) repeat(3, minmax(200px, 0.6fr))'  // Desktop: 4 colonnes
  });

  const gridGap = useResponsiveValue({
    xs: '1rem',
    md: '1.5rem',
    lg: '2rem'
  });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: gridColumns,
      gap: gridGap
    }}>
      <StatsCard />
      <ChartCard />
      <DataCard />
      <SummaryCard />
    </div>
  );
}
```

### 3. Typography Responsive avec clamp()

```jsx
import { globalTheme } from '../../shared/theme/globalTheme';

function PageTitle({ children }) {
  return (
    <h1 style={{
      // Taille fluide: min 1.5rem, préféré 4vw, max 2.5rem
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      fontWeight: globalTheme.typography.weight.bold,
      lineHeight: 1.2
    }}>
      {children}
    </h1>
  );
}
```

### 4. Graphiques Adaptatifs

```jsx
import { useResponsiveValue, useIsMobile } from '../../shared/hooks';

function TemporalChart({ data }) {
  const isMobile = useIsMobile();

  const chartHeight = useResponsiveValue({
    xs: 250,
    sm: 300,
    md: 350,
    lg: 400
  });

  const fontSize = useResponsiveValue({
    xs: 10,
    md: 12,
    lg: 14
  });

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <LineChart data={data}>
        <XAxis
          dataKey="year"
          angle={isMobile ? -45 : 0}
          textAnchor={isMobile ? 'end' : 'middle'}
          style={{ fontSize }}
        />
        <YAxis style={{ fontSize }} />
        <Tooltip contentStyle={{ fontSize }} />
        <Line type="monotone" dataKey="count" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 📱 Bonnes Pratiques

### Mobile First

Commencez toujours par le design mobile, puis ajoutez des media queries pour les écrans plus grands :

```css
/* ✅ BON - Mobile first */
.card {
  padding: 1rem;
}

@media (min-width: 768px) {
  .card {
    padding: 2rem;
  }
}

/* ❌ MAUVAIS - Desktop first */
.card {
  padding: 2rem;
}

@media (max-width: 767px) {
  .card {
    padding: 1rem;
  }
}
```

### Touch Targets

Sur mobile, assurez-vous que les boutons/liens sont assez grands :

```jsx
const buttonStyle = {
  padding: isMobile ? '0.75rem 1.5rem' : '0.5rem 1rem',
  minHeight: isMobile ? '44px' : 'auto', // Taille minimale tactile
  fontSize: isMobile ? '1rem' : '0.875rem'
};
```

### Performance

Utilisez `useResponsiveValue` plutôt que de multiples conditions :

```jsx
// ✅ BON - Un seul hook
const columns = useResponsiveValue({ xs: 1, md: 2, lg: 4 });

// ❌ MAUVAIS - Multiples hooks et conditions
const { isMobile, isTablet, isDesktop } = useBreakpoint();
const columns = isMobile ? 1 : isTablet ? 2 : 4;
```

---

## 🔧 Utilitaires du Thème

Le thème global fournit aussi des helpers pour générer les media queries :

```javascript
import { globalTheme } from '../../shared/theme/globalTheme';

// Dans un fichier JS (ex: styled-components)
const Container = styled.div`
  padding: 1rem;

  ${globalTheme.breakpoints.up('md')} {
    padding: 2rem;
  }

  ${globalTheme.breakpoints.up('lg')} {
    padding: 3rem;
  }
`;
```

---

## 📚 Ressources

- **Breakpoints définis** : `src/shared/theme/globalTheme.js:169-193`
- **Hook useBreakpoint** : `src/shared/hooks/useBreakpoint.js`
- **Exemples** : Voir OverviewView, TemporalChart pour les implémentations

---

## 🎓 Checklist Responsive

Avant de livrer un composant, vérifiez :

- [ ] Testé sur mobile (< 768px)
- [ ] Testé sur tablet (768-1023px)
- [ ] Testé sur desktop (>= 1024px)
- [ ] Touch targets >= 44px sur mobile
- [ ] Typography lisible sur tous les écrans
- [ ] Pas de scroll horizontal
- [ ] Images/graphiques s'adaptent
- [ ] Navigation fonctionnelle sur mobile
- [ ] Performance acceptable (pas de re-renders excessifs)

---

**Bonne chance pour rendre votre interface magnifique sur tous les écrans ! 🚀**
