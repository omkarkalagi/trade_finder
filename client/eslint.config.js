import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import path from 'path'; // Add this import

// Resolve tsconfig path dynamically
const resolveTsConfigPath = () => {
  try {
    // Try Vercel's absolute path first
    return path.resolve('/vercel/path0/client/tsconfig.json');
  } catch {
    // Fallback to local development path
    return path.resolve(__dirname, 'tsconfig.json');
  }
};

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    ...js.configs.recommended,
    plugins: {
      'react': reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
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
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: resolveTsConfigPath(), // Use dynamic resolution
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off" // Disable explicit any rule
    }
  }
];
