import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  base: '/',
  plugins: [
    react({
      include: '**/*.tsx', // Explicitly process TSX files
      babel: {
        presets: ['@babel/preset-typescript'], // Add TypeScript preset
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      }
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 3000,
    hmr: {
      overlay: false
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
    jsxInject: `import React from 'react'` // Ensure React is in scope
  },
  optimizeDeps: {
    include: ['@mui/material']
  }
});
