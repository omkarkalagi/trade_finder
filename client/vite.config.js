import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss'; // Add this import
import autoprefixer from 'autoprefixer'; // Add this import

export default defineConfig({
  base: '/',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(), // Use as ES module
        autoprefixer() // Use as ES module
      ]
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    hmr: {
      overlay: false
    }
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
});
