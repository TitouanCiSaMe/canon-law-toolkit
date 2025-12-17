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
  const [currentLogo, setCurrentLogo] = React.useState(0);

  // Logos pour le carrousel
  const logos = [
    { src: '/Logo/GIS-LOGO-LEM.png', alt: 'LEM - Laboratoire d\'études sur les monothéismes', width: '85%', hasWhiteBg: false },
    { src: '/Logo/Laboratoire_DRES_Etroit_Couleur(.png', alt: 'Laboratoire DRES - Université de Strasbourg', width: '95%', hasWhiteBg: false },
    { src: '/Logo/Logo Polen.png', alt: 'POLEN - Pouvoirs LEttres Normes', width: '95%', hasWhiteBg: true },
    { src: '/Logo/anr.jpg', alt: 'ANR - Agence nationale de la recherche', width: '80%', hasWhiteBg: false }
  ];

  // Rotation automatique du carrousel
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogo(prev => (prev + 1) % logos.length);
    }, 3000); // Change tous les 3 secondes
    return () => clearInterval(interval);
  }, []);

  // Navigation des vues du concordance analyzer (symboles médiévaux)
  const views = [
    { id: 'overview', icon: '◈', label: t('concordance.panels.overview.title') },
    { id: 'concordances', icon: '⊞', label: t('concordance.panels.concordances.title') },
    { id: 'domains', icon: '⚜', label: t('concordance.panels.domains.title') },
    { id: 'temporal', icon: '⧗', label: t('concordance.panels.temporal.title') },
    { id: 'authors', icon: '✒', label: t('concordance.panels.authors.title') },
    { id: 'linguistic', icon: '❦', label: t('concordance.panels.linguistic.title') },
    { id: 'places', icon: '✦', label: t('concordance.panels.places.title') },
    { id: 'data', icon: '⟐', label: t('concordance.panels.data.title') },
    { id: 'corpusComparison', icon: '⚖', label: t('concordance.panels.corpusComparison.title') }
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
        <div>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.02em',
            marginBottom: '0.5rem'
          }}>
            CiSaMe
          </div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: 400,
            fontFamily: 'var(--font-primary)',
            opacity: 0.9,
            letterSpacing: '0.02em',
            lineHeight: 1.3
          }}>
            Circulation des savoirs médiévaux au XII<sup style={{ fontSize: '0.35em', position: 'relative', top: '-0.5em' }}>e</sup> siècle
          </div>
        </div>
      </Link>

      {/* Navigation modules */}
      <nav style={{ padding: '1rem 0' }}>
        <div style={{
          fontSize: '0.95rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.7,
          padding: '0.5rem 1.5rem',
          fontWeight: '600',
          fontFamily: 'var(--font-heading)'
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
            fontSize: '1.15rem',
            fontWeight: location.pathname === '/query-generator' ? '600' : '400',
            fontFamily: 'var(--font-ui)',
            textAlign: 'center'
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
            fontSize: '1.15rem',
            fontWeight: location.pathname === '/concordance-analyzer' ? '600' : '400',
            fontFamily: 'var(--font-ui)',
            textAlign: 'center'
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
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.7,
              padding: '0.5rem 1.5rem',
              fontWeight: '600',
              fontFamily: 'var(--font-heading)',
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
                  justifyContent: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  background: activeView === view.id ? 'rgba(240, 230, 140, 0.15)' : 'transparent',
                  color: activeView === view.id ? '#F0E68C' : '#cbd5e0',
                  borderLeft: activeView === view.id ? '3px solid #D4AF37' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '1.1rem',
                  fontWeight: activeView === view.id ? '600' : '400',
                  fontFamily: 'var(--font-ui)',
                  textAlign: 'center'
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
              fontSize: '1rem',
              fontFamily: 'var(--font-ui)'
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
              fontFamily: 'var(--font-data)',
              lineHeight: '1',
              marginBottom: '0.5rem',
              color: '#F0E68C'
            }}>
              {concordanceCount.toLocaleString()}
            </div>
            <div style={{
              fontSize: '0.95rem',
              fontFamily: 'var(--font-ui)',
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
          fontSize: '1.1rem',
          fontFamily: 'var(--font-ui)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        {i18n.language === 'fr' ? '🇬🇧 English' : '🇫🇷 Français'}
      </button>

      {/* Logos institutionnels - Carrousel */}
      <div style={{
        padding: '1.25rem',
        background: 'rgba(255, 255, 255, 0.08)',
        margin: '0 1rem 1rem 1rem',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {logos[currentLogo].hasWhiteBg ? (
          <div style={{
            background: 'white',
            padding: '0.5rem',
            borderRadius: '6px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            transition: 'all 0.5s ease',
            opacity: 1,
            animation: 'fadeIn 0.5s ease'
          }}>
            <img
              src={logos[currentLogo].src}
              alt={logos[currentLogo].alt}
              style={{
                width: logos[currentLogo].width,
                height: 'auto',
                transition: 'all 0.5s ease'
              }}
            />
          </div>
        ) : (
          <img
            src={logos[currentLogo].src}
            alt={logos[currentLogo].alt}
            style={{
              width: logos[currentLogo].width,
              height: 'auto',
              filter: 'brightness(1.1)',
              transition: 'all 0.5s ease',
              opacity: 1,
              animation: 'fadeIn 0.5s ease'
            }}
          />
        )}

        {/* Indicateurs de position */}
        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem'
        }}>
          {logos.map((_, index) => (
            <div
              key={index}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: currentLogo === index ? '#F0E68C' : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '1.5rem',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-primary)',
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
