/**
 * Page principale du générateur de requêtes linguistiques
 * @module pages
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Edit3, Layers, Brain } from 'lucide-react';
import { globalTheme } from '@shared/theme/globalTheme';

// Import des vues
import ProximityView from '../modules/query-generator/components/views/ProximityView';
import VariationView from '../modules/query-generator/components/views/VariationView';
import ProximityVariationView from '../modules/query-generator/components/views/ProximityVariationView';
import SemanticView from '../modules/query-generator/components/views/SemanticView';

const QueryGenerator = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('proximity');

  const tabs = [
    {
      id: 'proximity',
      label: t('queryGenerator.tabs.proximity'),
      icon: <Search size={18} />,
      component: <ProximityView />
    },
    {
      id: 'variation',
      label: t('queryGenerator.tabs.variation'),
      icon: <Edit3 size={18} />,
      component: <VariationView />
    },
    {
      id: 'proximityVariation',
      label: t('queryGenerator.tabs.proximityVariation'),
      icon: <Layers size={18} />,
      component: <ProximityVariationView />
    },
    {
      id: 'semantic',
      label: t('queryGenerator.tabs.semantic'),
      icon: <Brain size={18} />,
      component: <SemanticView />
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          📜 {t('queryGenerator.app.title')}
        </h1>
        <p style={styles.subtitle}>
          {t('queryGenerator.app.subtitle')}
        </p>
      </header>

      {/* Navigation par onglets */}
      <div style={styles.tabsContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : {})
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet actif */}
      <div style={styles.content}>
        {activeTabData.component}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: globalTheme.colors.background.default
  },

  header: {
    background: `linear-gradient(135deg, ${globalTheme.palettes.concordance.primary.main} 0%, ${globalTheme.palettes.concordance.primary.light} 100%)`,
    color: globalTheme.colors.text.light,
    padding: `${globalTheme.spacing.xxl} ${globalTheme.spacing.xl}`,
    textAlign: 'center',
    borderBottom: `3px solid ${globalTheme.palettes.concordance.primary.dark}`,
    boxShadow: globalTheme.shadows.card
  },

  title: {
    fontFamily: globalTheme.typography.heading.h1.fontFamily,
    fontSize: '2.5rem',
    fontWeight: globalTheme.typography.weight.bold,
    marginBottom: globalTheme.spacing.md,
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    letterSpacing: '1px'
  },

  subtitle: {
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.xl,
    opacity: 0.95,
    fontStyle: 'italic'
  },

  tabsContainer: {
    display: 'flex',
    background: globalTheme.colors.background.active,
    borderBottom: `2px solid ${globalTheme.colors.border.medium}`,
    overflow: 'x-auto',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },

  tab: {
    flex: 1,
    minWidth: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: globalTheme.spacing.sm,
    padding: `${globalTheme.spacing.lg} ${globalTheme.spacing.md}`,
    background: 'transparent',
    border: 'none',
    borderRight: `1px solid ${globalTheme.colors.border.light}`,
    color: globalTheme.palettes.concordance.primary.dark,
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.md,
    fontWeight: globalTheme.typography.weight.semibold,
    cursor: 'pointer',
    transition: globalTheme.transitions.normal,
    position: 'relative',

    ':hover': {
      background: globalTheme.colors.background.hover,
      color: globalTheme.palettes.concordance.primary.main
    }
  },

  tabActive: {
    background: globalTheme.colors.background.card,
    color: globalTheme.palettes.concordance.primary.main,
    borderBottom: `3px solid ${globalTheme.palettes.concordance.primary.blue}`,
    fontWeight: globalTheme.typography.weight.bold
  },

  content: {
    padding: `${globalTheme.spacing.xxl} 0`
  }
};

export default QueryGenerator;
