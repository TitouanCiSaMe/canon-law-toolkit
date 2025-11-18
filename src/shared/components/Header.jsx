import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  return (
    <header className="toolkit-header">
      <div className="header-container">
        <Link to="/" className="brand-link">
          <BookOpen size={32} />
          <div>
            <h1 className="brand-title">{t('site.title')}</h1>
            <p className="brand-subtitle">{t('site.subtitle')}</p>
          </div>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            {t('nav.home')}
          </Link>
          <Link to="/query-generator" className={location.pathname === '/query-generator' ? 'active' : ''}>
            {t('nav.queryGenerator')}
          </Link>
          <Link to="/concordance-analyzer" className={location.pathname === '/concordance-analyzer' ? 'active' : ''}>
            {t('nav.concordanceAnalyzer')}
          </Link>
        </nav>
        <button onClick={toggleLanguage} className="language-toggle">
          ◈ {i18n.language.toUpperCase()}
        </button>
      </div>
    </header>
  );
};

export default Header;
