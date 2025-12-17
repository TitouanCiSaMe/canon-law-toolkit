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
      icon: <Search size={16} />,
      component: <ProximityView />
    },
    {
      id: 'variation',
      label: t('queryGenerator.tabs.variation'),
      icon: <Edit3 size={16} />,
      component: <VariationView />
    },
    {
      id: 'proximityVariation',
      label: t('queryGenerator.tabs.proximityVariation'),
      icon: <Layers size={16} />,
      component: <ProximityVariationView />
    },
    {
      id: 'semantic',
      label: t('queryGenerator.tabs.semantic'),
      icon: <Brain size={16} />,
      component: <SemanticView />
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div style={styles.container}>
      {/* En-tête simple et compact */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>
          {t('queryGenerator.app.title')}
        </h1>
        <p style={styles.pageSubtitle}>
          {t('queryGenerator.app.subtitle')}
        </p>
      </div>

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
    background: globalTheme.colors.background.default,
    padding: 0
  },

  // En-tête compact comme Home
  pageHeader: {
    padding: `${globalTheme.spacing.xxl} ${globalTheme.spacing.xl}`,
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  },

  pageTitle: {
    fontFamily: globalTheme.typography.heading.h1.fontFamily,
    fontSize: '2.5rem',
    fontWeight: globalTheme.typography.weight.bold,
    color: globalTheme.palettes.concordance.primary.main,
    marginBottom: globalTheme.spacing.md,
    letterSpacing: '-0.02em'
  },

  pageSubtitle: {
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.lg,
    color: globalTheme.colors.text.secondary,
    lineHeight: 1.6
  },

  // Onglets modernes et épurés
  tabsContainer: {
    display: 'flex',
    background: globalTheme.colors.background.card,
    borderTop: `1px solid ${globalTheme.colors.border.light}`,
    borderBottom: `2px solid ${globalTheme.colors.border.light}`,
    overflow: 'auto',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    maxWidth: '1200px',
    margin: '0 auto',
    marginBottom: globalTheme.spacing.xl
  },

  tab: {
    flex: 1,
    minWidth: '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: globalTheme.spacing.sm,
    padding: `${globalTheme.spacing.md} ${globalTheme.spacing.lg}`,
    background: 'transparent',
    border: 'none',
    borderRight: `1px solid ${globalTheme.colors.border.light}`,
    color: globalTheme.colors.text.secondary,
    fontFamily: globalTheme.typography.fontFamily.secondary,
    fontSize: globalTheme.typography.size.md,
    fontWeight: globalTheme.typography.weight.medium,
    cursor: 'pointer',
    transition: globalTheme.transitions.fast,
    whiteSpace: 'nowrap'
  },

  tabActive: {
    background: globalTheme.colors.background.active,
    color: globalTheme.palettes.concordance.primary.blue,
    fontWeight: globalTheme.typography.weight.semibold,
    borderBottom: `3px solid ${globalTheme.palettes.concordance.primary.blue}`,
    marginBottom: '-2px'
  },

  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${globalTheme.spacing.lg} ${globalTheme.spacing.xxl}`
  }
};

export default QueryGenerator;
