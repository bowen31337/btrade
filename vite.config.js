import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/btrade/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});