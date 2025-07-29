import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Ensure assets are in assets directory
    rollupOptions: {
      input: {
        main: './index.html' // Explicitly define entry point
      }
    }
  },
  base: './' // Use relative paths for deployment
});
