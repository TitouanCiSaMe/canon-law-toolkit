/**
 * Sidebar - Navigation verticale fixe à gauche
 * 
 * Contient :
 * - Logo et titre CiSaMe
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
import { useBreakpoint } from '../hooks';

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
 * @param {boolean} props.isOpen - Si le menu mobile est ouvert
 * @param {Function} props.onClose - Callback fermeture menu mobile
 */
const Sidebar = ({
  activeView = 'overview',
  onViewChange,
  concordanceCount = 0,
  activeFiltersCount = 0,
  onFiltersClick,
  isInConcordanceAnalyzer = false,
  isOpen = true,
  onClose
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isDesktop } = useBreakpoint();

  // Navigation des vues du concordance analyzer (symboles médiévaux)
  const views = [
    { id: 'overview', icon: '◈', label: t('concordance.panels.overview.title') },
    { id: 'domains', icon: '⚜', label: t('concordance.panels.domains.title') },
    { id: 'temporal', icon: '⧗', label: t('concordance.panels.temporal.title') },
    { id: 'authors', icon: '✒', label: t('concordance.panels.authors.title') },
    { id: 'linguistic', icon: '❦', label: t('concordance.panels.linguistic.title') },
    { id: 'places', icon: '✦', label: t('concordance.panels.places.title') },
    { id: 'data', icon: '⟐', label: t('concordance.panels.data.title') },
    { id: 'corpusComparison', icon: '⚖', label: t('concordance.panels.corpusComparison.title') },
    { id: 'concordances', icon: '⊞', label: t('concordance.panels.concordances.title') }
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  // Handler pour fermer le menu sur mobile après clic sur un lien
  const handleLinkClick = () => {
    if (!isDesktop && onClose) {
      onClose();
    }
  };

  // Handler pour changement de vue avec fermeture sur mobile
  const handleViewChange = (viewId) => {
    onViewChange(viewId);
    handleLinkClick();
  };

  // Si pas desktop et menu fermé, ne rien afficher
  if (!isDesktop && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop (seulement mobile) */}
      {!isDesktop && isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease'
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '280px',
        height: '100vh',
        position: 'fixed',
        left: isDesktop ? 0 : (isOpen ? 0 : '-280px'),
        top: 0,
        background: 'linear-gradient(180deg, #5C3317 0%, #3E2723 100%)',  // Brun encre médiéval
        color: '#F7FAFC',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 16px rgba(0, 0, 0, 0.25)',
        zIndex: 1000,
        overflowY: 'auto',
        transition: 'left 0.3s ease',
        ...(!isDesktop && {
          animation: isOpen ? 'slideInLeft 0.3s ease' : 'slideOutLeft 0.3s ease'
        })
      }}>

      {/* Bouton fermer (mobile uniquement) */}
      {!isDesktop && (
        <button
          onClick={onClose}
          aria-label="Fermer le menu"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '36px',
            height: '36px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: '#F7FAFC',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          ×
        </button>
      )}

      {/* Header - Logo CiSaMe */}
      <Link
        to="/"
        onClick={handleLinkClick}
        style={{
          padding: '2rem 1.5rem',
          textDecoration: 'none',
          color: '#F7FAFC',
          borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          transition: 'background 0.2s'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontSize: '2rem' }}>⚖</span>
          <div>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              fontFamily: '"Crimson Text", serif',
              letterSpacing: '-0.02em'
            }}>
              CiSaMe
            </div>
            <div style={{
              fontSize: '0.7rem',
              opacity: 0.9,
              letterSpacing: '0.05em',
              marginTop: '0.25rem'
            }}>
              Circulation des Savoirs Médiévaux
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
          {t('sidebar.nav.modules')}
        </div>
        
        <Link
          to="/query-generator"
          onClick={handleLinkClick}
          style={{
            display: 'block',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            color: location.pathname === '/query-generator' ? '#F0E68C' : '#cbd5e0',
            background: location.pathname === '/query-generator' ? 'rgba(240, 230, 140, 0.15)' : 'transparent',
            borderLeft: location.pathname === '/query-generator' ? '3px solid #D4AF37' : '3px solid transparent',
            transition: 'all 0.2s',
            fontSize: '0.95rem',
            fontWeight: location.pathname === '/query-generator' ? '600' : '400'
          }}
        >
          ⟐ {t('nav.queryGenerator')}
        </Link>

        <Link
          to="/concordance-analyzer"
          onClick={handleLinkClick}
          style={{
            display: 'block',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            color: location.pathname === '/concordance-analyzer' ? '#F0E68C' : '#cbd5e0',
            background: location.pathname === '/concordance-analyzer' ? 'rgba(240, 230, 140, 0.15)' : 'transparent',
            borderLeft: location.pathname === '/concordance-analyzer' ? '3px solid #D4AF37' : '3px solid transparent',
            transition: 'all 0.2s',
            fontSize: '0.95rem',
            fontWeight: location.pathname === '/concordance-analyzer' ? '600' : '400'
          }}
        >
          ◈ {t('nav.concordanceAnalyzer')}
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
              {t('sidebar.nav.views')}
            </div>
            
            {views.map(view => (
              <button
                key={view.id}
                onClick={() => handleViewChange(view.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: activeView === view.id ? 'rgba(240, 230, 140, 0.15)' : 'transparent',
                  color: activeView === view.id ? '#F0E68C' : '#cbd5e0',
                  borderLeft: activeView === view.id ? '3px solid #D4AF37' : '3px solid transparent',
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
              background: 'rgba(240, 230, 140, 0.1)',
              border: '2px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '6px',
              color: '#F0E68C',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: '600',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(240, 230, 140, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(240, 230, 140, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
            }}
          >
            <span>⊞ {t('concordance.buttons.filters')}</span>
            {activeFiltersCount > 0 && (
              <span style={{
                background: '#D4AF37',
                color: '#3E2723',
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
            background: 'rgba(212, 175, 55, 0.15)',
            margin: '0 1.5rem 1rem 1.5rem',
            borderRadius: '6px',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: '300',
              lineHeight: '1',
              marginBottom: '0.5rem',
              color: '#F0E68C'
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

      {/* Logos institutionnels */}
      <div style={{
        padding: '1.25rem',
        background: 'rgba(255, 255, 255, 0.08)',
        margin: '0 1rem 1rem 1rem',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <img
          src="/Logo/GIS-LOGO-LEM.png"
          alt="LEM - Laboratoire d'études sur les monothéismes"
          style={{ width: '85%', height: 'auto', filter: 'brightness(1.1)' }}
        />
        <img
          src="/Logo/Laboratoire_DRES_Etroit_Couleur(.png"
          alt="Laboratoire DRES - Université de Strasbourg"
          style={{ width: '95%', height: 'auto', filter: 'brightness(1.1)' }}
        />
        <div style={{
          background: 'white',
          padding: '0.5rem',
          borderRadius: '6px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img
            src="/Logo/Logo Polen.png"
            alt="POLEN - Pouvoirs LEttres Normes"
            style={{ width: '95%', height: 'auto' }}
          />
        </div>
        <img
          src="/Logo/anr.jpg"
          alt="ANR - Agence nationale de la recherche"
          style={{ width: '80%', height: 'auto', filter: 'brightness(1.1)' }}
        />
      </div>

      {/* Footer */}
      <div style={{
        padding: '1.5rem',
        fontSize: '0.7rem',
        textAlign: 'center',
        opacity: 0.7,
        borderTop: '2px solid rgba(255, 255, 255, 0.2)'
      }}
      dangerouslySetInnerHTML={{ __html: t('footer.copyright') }}
      />
    </aside>
    </>
  );
};

export default Sidebar;
