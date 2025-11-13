import React from 'react';
import { useTranslation } from 'react-i18next';

const ConcordanceAnalyzer = () => {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>{t('nav.concordanceAnalyzer')}</h1>
      <p>À migrer en Étape 1.2</p>
    </div>
  );
};

export default ConcordanceAnalyzer;
