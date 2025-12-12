import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, BarChart3 } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* Hero Section - Encadré CiSaMe */}
      <section className="hero-section">
        <div className="cisame-box">
          <div className="cisame-title">CiSaMe</div>
          <div className="cisame-subtitle">
            Circulation des savoirs médiévaux au XII<sup>e</sup> siècle
          </div>
        </div>
      </section>

      {/* Project Description */}
      <section className="project-description">
        <p>
          {t('home.projectDescription.title')}{' '}
          <a href="https://cisame.hypotheses.org" target="_blank" rel="noopener noreferrer">
            {t('home.projectDescription.link')}
          </a>{' '}
          {t('home.projectDescription.text1')}
        </p>
        <p>
          {t('home.projectDescription.text2')}{' '}
          <a href="https://cisame.hypotheses.org" target="_blank" rel="noopener noreferrer">
            {t('home.projectDescription.linkHere')}
          </a>
          {t('home.projectDescription.text3')}
        </p>
        <p>
          {t('home.projectDescription.text4')}{' '}
          <a href="https://cisame.hypotheses.org" target="_blank" rel="noopener noreferrer">
            {t('home.projectDescription.blogLink')}
          </a>.
        </p>
      </section>

      {/* Tools Section - Générateur de requêtes en premier */}
      <section className="tools-section">
        {/* Générateur de requêtes */}
        <div className="tool-detailed-card">
          <div className="tool-header">
            <Search size={40} />
            <div>
              <h3>{t('nav.queryGenerator')}</h3>
            </div>
          </div>
          <div className="tool-content">
            <div className="tool-description">
              <h4>{t('home.tools.query.what.title')}</h4>
              <p>{t('home.tools.query.what.description')}</p>
            </div>
            <div className="tool-howto">
              <h4>{t('home.tools.query.howto.title')}</h4>
              <ol>
                <li>{t('home.tools.query.howto.step1')}</li>
                <li>{t('home.tools.query.howto.step2')}</li>
                <li>{t('home.tools.query.howto.step3')}</li>
                <li>{t('home.tools.query.howto.step4')}</li>
              </ol>
            </div>
            <div className="tool-features">
              <h4>{t('home.tools.query.features.title')}</h4>
              <ul>
                <li>{t('home.tools.query.features.advanced')}</li>
                <li>{t('home.tools.query.features.regex')}</li>
                <li>{t('home.tools.query.features.lemma')}</li>
                <li>{t('home.tools.query.features.copy')}</li>
              </ul>
            </div>
          </div>
          <Link to="/query-generator" className="tool-cta">
            {t('home.tools.startButton')} →
          </Link>
        </div>

        {/* Analyse des résultats */}
        <div className="tool-detailed-card">
          <div className="tool-header">
            <BarChart3 size={40} />
            <div>
              <h3>{t('nav.concordanceAnalyzer')}</h3>
            </div>
          </div>
          <div className="tool-content">
            <div className="tool-description">
              <h4>{t('home.tools.concordance.what.title')}</h4>
              <p>{t('home.tools.concordance.what.description')}</p>
            </div>
            <div className="tool-howto">
              <h4>{t('home.tools.concordance.howto.title')}</h4>
              <ol>
                <li>{t('home.tools.concordance.howto.step1')}</li>
                <li>{t('home.tools.concordance.howto.step2')}</li>
                <li>{t('home.tools.concordance.howto.step3')}</li>
                <li>{t('home.tools.concordance.howto.step4')}</li>
                <li>{t('home.tools.concordance.howto.step5')}</li>
              </ol>
            </div>
            <div className="tool-features">
              <h4>{t('home.tools.concordance.features.title')}</h4>
              <ul>
                <li>{t('home.tools.concordance.features.temporal')}</li>
                <li>{t('home.tools.concordance.features.domains')}</li>
                <li>{t('home.tools.concordance.features.authors')}</li>
                <li>{t('home.tools.concordance.features.comparison')}</li>
                <li>{t('home.tools.concordance.features.export')}</li>
              </ul>
            </div>
          </div>
          <Link to="/concordance-analyzer" className="tool-cta">
            {t('home.tools.startButton')} →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
