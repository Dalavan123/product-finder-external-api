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
    environment: 'jsdom', // behövs för React-komponenter
    setupFiles: './src/tests/setup.js', // laddas innan tester körs
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    css: true, // låter tester importera CSS utan fel
    globals: true, // för att kunna använda describe/it/test utan att importera dem
  },
});
