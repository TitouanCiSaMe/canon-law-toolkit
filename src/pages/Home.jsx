import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, BarChart3 } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="home-page">
      <h1>{t('home.welcome')}</h1>
      <p>{t('home.description')}</p>
      <div className="tools-grid">
        <Link to="/query-generator" className="tool-card">
          <Search size={40} />
          <h3>{t('nav.queryGenerator')}</h3>
        </Link>
        <Link to="/concordance-analyzer" className="tool-card">
          <BarChart3 size={40} />
          <h3>{t('nav.concordanceAnalyzer')}</h3>
        </Link>
      </div>
    </div>
  );
};

export default Home;
