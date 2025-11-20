import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, BarChart3, Upload, Filter, LineChart, BookOpen } from 'lucide-react';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>{t('home.welcome')}</h1>
        <p className="hero-description">{t('home.description')}</p>
        <p className="hero-tagline">{t('home.tagline')}</p>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>{t('home.about.title')}</h2>
        <p>{t('home.about.description')}</p>
        <div className="features-grid">
          <div className="feature-item">
            <Upload size={24} />
            <h4>{t('home.about.features.upload.title')}</h4>
            <p>{t('home.about.features.upload.description')}</p>
          </div>
          <div className="feature-item">
            <LineChart size={24} />
            <h4>{t('home.about.features.analyze.title')}</h4>
            <p>{t('home.about.features.analyze.description')}</p>
          </div>
          <div className="feature-item">
            <Filter size={24} />
            <h4>{t('home.about.features.filter.title')}</h4>
            <p>{t('home.about.features.filter.description')}</p>
          </div>
          <div className="feature-item">
            <BookOpen size={24} />
            <h4>{t('home.about.features.compare.title')}</h4>
            <p>{t('home.about.features.compare.description')}</p>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="tools-section">
        <h2>{t('home.tools.title')}</h2>

        <div className="tool-detailed-card">
          <div className="tool-header">
            <BarChart3 size={40} />
            <div>
              <h3>{t('nav.concordanceAnalyzer')}</h3>
              <p className="tool-subtitle">{t('home.tools.concordance.subtitle')}</p>
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

        <div className="tool-detailed-card">
          <div className="tool-header">
            <Search size={40} />
            <div>
              <h3>{t('nav.queryGenerator')}</h3>
              <p className="tool-subtitle">{t('home.tools.query.subtitle')}</p>
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
      </section>

      {/* Getting Started Section */}
      <section className="getting-started-section">
        <h2>{t('home.gettingStarted.title')}</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>{t('home.gettingStarted.step1.title')}</h4>
            <p>{t('home.gettingStarted.step1.description')}</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>{t('home.gettingStarted.step2.title')}</h4>
            <p>{t('home.gettingStarted.step2.description')}</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>{t('home.gettingStarted.step3.title')}</h4>
            <p>{t('home.gettingStarted.step3.description')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
