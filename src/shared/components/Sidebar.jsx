/**
 * Sidebar - Navigation verticale fixe à gauche
 * 
 * Contient :
 * - Logo et titre CALKIT
 * - Navigation entre modules
 * - Navigation entre vues (concordance analyzer)
 * - Bouton filtres avec badge
 * - Compteur de concordances
 * - Switch de langue
 * - Footer
 * 
 * @component
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Sidebar component
 * 
 * @param {Object} props
 * @param {string} props.activeView - Vue active dans concordance analyzer
 * @param {Function} props.onViewChange - Callback changement de vue
 * @param {number} props.concordanceCount - Nombre de concordances chargées
 * @param {number} props.activeFiltersCount - Nombre de filtres actifs
 * @param {Function} props.onFiltersClick - Callback ouverture filtres
 * @param {boolean} props.isInConcordanceAnalyzer - Si on est dans le module concordance
 */
const Sidebar = ({ 
  activeView = 'overview',
  onViewChange,
  concordanceCount = 0,
  activeFiltersCount = 0,
  onFiltersClick,
  isInConcordanceAnalyzer = false
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Navigation des vues du concordance analyzer
  const views = [
    { id: 'overview', icon: '🏠', label: t('concordance.panels.overview.title') },
    { id: 'domains', icon: '📚', label: t('concordance.panels.domains.title') },
    { id: 'temporal', icon: '⏰', label: t('concordance.panels.temporal.title') },
    { id: 'authors', icon: '✍️', label: t('concordance.panels.authors.title') },
    { id: 'linguistic', icon: '🔤', label: t('concordance.panels.linguistic.title') },
    { id: 'places', icon: '🌍', label: t('concordance.panels.places.title') },
    { id: 'data', icon: '📋', label: t('concordance.panels.data.title') },
    { id: 'corpusComparison', icon: '⚖️', label: t('concordance.panels.corpusComparison.title') },
    { id: 'concordances', icon: '📁', label: t('concordance.panels.concordances.title') }
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'linear-gradient(180deg, #78350F 0%, #92400E 100%)',
      color: '#F7FAFC',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 16px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      
      {/* Header - Logo CALKIT */}
      <Link to="/" style={{
        padding: '2rem 1.5rem',
        textDecoration: 'none',
        color: '#F7FAFC',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
        transition: 'background 0.2s'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontSize: '2rem' }}>📚</span>
          <div>
            <div style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              fontFamily: '"Crimson Text", serif',
              letterSpacing: '-0.02em'
            }}>
              CALKIT
            </div>
            <div style={{ 
              fontSize: '0.7rem', 
              opacity: 0.9,
              letterSpacing: '0.05em',
              marginTop: '0.25rem'
            }}>
              Canon Law Analysis Toolkit
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation modules */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.7,
          padding: '0.5rem 1.5rem',
          fontWeight: '600'
        }}>
          Modules
        </div>
        
        <Link 
          to="/query-generator"
          style={{
            display: 'block',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            color: location.pathname === '/query-generator' ? '#FCD34D' : '#F7FAFC',
            background: location.pathname === '/query-generator' ? 'rgba(252, 211, 77, 0.1)' : 'transparent',
            borderLeft: location.pathname === '/query-generator' ? '4px solid #FCD34D' : '4px solid transparent',
            transition: 'all 0.2s',
            fontSize: '0.95rem',
            fontWeight: location.pathname === '/query-generator' ? '600' : '400'
          }}
        >
          🔍 Générateur de requêtes
        </Link>

        <Link 
          to="/concordance-analyzer"
          style={{
            display: 'block',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            color: location.pathname === '/concordance-analyzer' ? '#FCD34D' : '#F7FAFC',
            background: location.pathname === '/concordance-analyzer' ? 'rgba(252, 211, 77, 0.1)' : 'transparent',
            borderLeft: location.pathname === '/concordance-analyzer' ? '4px solid #FCD34D' : '4px solid transparent',
            transition: 'all 0.2s',
            fontSize: '0.95rem',
            fontWeight: location.pathname === '/concordance-analyzer' ? '600' : '400'
          }}
        >
          📊 Analyseur de concordances
        </Link>
      </nav>

      {/* Séparateur */}
      <div style={{
        height: '2px',
        background: 'rgba(255, 255, 255, 0.2)',
        margin: '0.5rem 1.5rem'
      }} />

      {/* Navigation vues (seulement si dans concordance analyzer) */}
      {isInConcordanceAnalyzer && (
        <>
          <nav style={{ padding: '1rem 0', flex: '1' }}>
            <div style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.7,
              padding: '0.5rem 1.5rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Vues
            </div>
            
            {views.map(view => (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: activeView === view.id ? 'rgba(252, 211, 77, 0.1)' : 'transparent',
                  color: activeView === view.id ? '#FCD34D' : '#F7FAFC',
                  borderLeft: activeView === view.id ? '4px solid #FCD34D' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                  fontWeight: activeView === view.id ? '600' : '400',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (activeView !== view.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeView !== view.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{view.icon}</span>
                <span>{view.label}</span>
              </button>
            ))}
          </nav>

          {/* Séparateur */}
          <div style={{
            height: '2px',
            background: 'rgba(255, 255, 255, 0.2)',
            margin: '0.5rem 1.5rem'
          }} />

          {/* Bouton Filtres */}
          <button
            onClick={onFiltersClick}
            style={{
              margin: '1rem 1.5rem',
              padding: '1rem',
              background: 'rgba(252, 211, 77, 0.15)',
              border: '2px solid #FCD34D',
              borderRadius: '8px',
              color: '#FCD34D',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: '600',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(252, 211, 77, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(252, 211, 77, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>🔍 Filtres</span>
            {activeFiltersCount > 0 && (
              <span style={{
                background: '#FCD34D',
                color: '#78350F',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Compteur concordances */}
          <div style={{
            padding: '1.5rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            margin: '0 1.5rem 1rem 1.5rem',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: '300',
              lineHeight: '1',
              marginBottom: '0.5rem',
              color: '#FCD34D'
            }}>
              {concordanceCount.toLocaleString()}
            </div>
            <div style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.9
            }}>
              {t('concordance.overview.concordancesAnalyzed')}
            </div>
          </div>
        </>
      )}

      {/* Switch langue */}
      <button
        onClick={toggleLanguage}
        style={{
          margin: '1rem 1.5rem',
          padding: '0.75rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          color: '#F7FAFC',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontWeight: '500',
          fontSize: '0.9rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        {i18n.language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
      </button>

      {/* Footer */}
      <div style={{
        padding: '1.5rem',
        fontSize: '0.7rem',
        textAlign: 'center',
        opacity: 0.7,
        borderTop: '2px solid rgba(255, 255, 255, 0.2)'
      }}>
        © 2025 CISAME<br />
        Canon Law Toolkit
      </div>
    </aside>
  );
};

export default Sidebar;
