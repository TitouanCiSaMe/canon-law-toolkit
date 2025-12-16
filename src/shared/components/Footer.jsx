import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="toolkit-footer">
      <p dangerouslySetInnerHTML={{ __html: t('footer.copyright') }} />
    </footer>
  );
};

export default Footer;
