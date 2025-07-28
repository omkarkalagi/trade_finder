import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-console': 'off',
    },
    ignores: ['dist/**', 'node_modules/**'],
  },
];
