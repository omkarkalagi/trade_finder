import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',  // Add this line
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  // Add resolve extensions
  resolve: {
    extensions: ['.jsx', '.js', '.json'],  // JSX first
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
