/**
 * Configuration ESLint pour CiSaMe Toolkit
 *
 * Règles adaptées pour React 18 + Vite
 *
 * @see https://eslint.org/docs/latest/use/configure/
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // ===========================================
    // Règles console - IMPORTANT pour la production
    // ===========================================
    'no-console': ['warn', {
      allow: ['warn', 'error']
    }],

    // ===========================================
    // Règles React
    // ===========================================
    'react/prop-types': 'off', // Désactivé car on utilise JSDoc
    'react/display-name': 'off',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-key': 'error',
    'react/no-unescaped-entities': 'warn',

    // ===========================================
    // Règles React Hooks
    // ===========================================
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ===========================================
    // Règles générales
    // ===========================================
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'no-debugger': 'error',
    'no-alert': 'warn',
    'prefer-const': 'warn',
    'no-var': 'error',
    'eqeqeq': ['error', 'always', { null: 'ignore' }],

    // ===========================================
    // Règles de style (gérées par Prettier)
    // ===========================================
    'semi': 'off',
    'quotes': 'off',
    'indent': 'off',
    'comma-dangle': 'off',
  },
  overrides: [
    {
      // Fichiers de test - autoriser console.log
      files: ['**/*.test.js', '**/*.test.jsx', '**/test/**'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      // Fichiers de configuration
      files: ['*.config.js', '*.config.cjs'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    '*.min.js',
  ],
};
