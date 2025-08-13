import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  cacheDir: '.vite-cache',
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:5174' }, // valfritt men bra för din server
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
});
