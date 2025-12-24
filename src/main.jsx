import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './shared/i18n';
import './modules/concordance-analyzer/styles/panel-variables.css';
import { generateGlobalStyles, injectCSSVariables } from './shared/theme/globalTheme';

// Injecte les styles globaux générés
const styleElement = document.createElement('style');
styleElement.textContent = generateGlobalStyles();
document.head.appendChild(styleElement);

// Injecte les variables CSS du thème dans :root
injectCSSVariables();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
