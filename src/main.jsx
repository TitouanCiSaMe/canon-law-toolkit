import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './shared/i18n';
import './modules/concordance-analyzer/styles/panel-variables.css';
import { generateGlobalStyles } from './shared/theme/globalTheme';

const styleElement = document.createElement('style');
styleElement.textContent = generateGlobalStyles();
document.head.appendChild(styleElement);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
