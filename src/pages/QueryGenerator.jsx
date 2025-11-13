import React from 'react';
import { useTranslation } from 'react-i18next';

const QueryGenerator = () => {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>{t('nav.queryGenerator')}</h1>
      <p>À développer en Phase 2</p>
    </div>
  );
};

export default QueryGenerator;
