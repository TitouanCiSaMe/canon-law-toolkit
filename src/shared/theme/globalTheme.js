export const globalTheme = {
  colors: {
    primary: { main: '#8B4513', light: '#A0522D', dark: '#654321' },
    secondary: { main: '#DAA520', light: '#F0E68C', dark: '#B8860B' },
    accent: { main: '#4169E1', light: '#6495ED', dark: '#191970' },
    background: { default: '#FAFAF8', paper: '#FFFFFF' },
    text: { primary: '#2C2C2C', secondary: '#5A5A5A' }
  },
  typography: {
    fontFamily: {
      primary: '"Crimson Text", Georgia, serif',
      secondary: '"Lato", sans-serif'
    }
  }
};

export const generateGlobalStyles = () => `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: ${globalTheme.typography.fontFamily.primary};
    color: ${globalTheme.colors.text.primary};
    background: ${globalTheme.colors.background.default};
    line-height: 1.5;
  }
  h1, h2, h3 { font-weight: 700; }
  a { color: ${globalTheme.colors.accent.main}; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;
