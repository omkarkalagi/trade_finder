import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import path from 'path';

// Resolve absolute path for Vercel environment
const resolveTsConfigPath = () => {
  try {
    // Vercel's absolute path
    return path.resolve('/vercel/path0/client/tsconfig.eslint.json');
  } catch {
    // Local development path
    return path.resolve(__dirname, 'tsconfig.eslint.json');
  }
};

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      'react': reactPlugin,
      '@typescript-eslint': tsPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: resolveTsConfigPath(), // Use resolved path
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  {
    ignores: ['build/*', 'dist/*', 'node_modules/*'],
  }
];
