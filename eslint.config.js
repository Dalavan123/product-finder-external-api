//eslint.config.js

// ESLint “flat config” för projektet.
// Körs med: `npm run lint`
// Syfte: Fånga vanliga buggar/stilbrott i JS/JSX, inklusive React-hooks,
// och undvika falsklarm från Vite React Fast Refresh.

import js from '@eslint/js'; // ESLints officiella JS-regler (recommended)
import globals from 'globals'; // Fördefinierade globala variabler (t.ex. window, document)
import reactHooks from 'eslint-plugin-react-hooks'; // Regler för useEffect/useState m.fl.
import reactRefresh from 'eslint-plugin-react-refresh'; // Dämpar varningar kopplade till Vite Fast Refresh
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // 1) Ignorera genererade filer/mappar (filer i dist skapas av Vite vid build, triggar mkt ointressanta varningar)
  globalIgnores(['dist']),

  // 2) Själva regeluppsättningen för våra källfiler
  {
    // Vilka filer som ska omfattas
    files: ['**/*.{js,jsx}'],

    // Basregler att “ärva”
    extends: [
      js.configs.recommended, // ESLint core: säkra standardregler
      reactHooks.configs['recommended-latest'], // Rek. regler för React Hooks (bl.a. deps i useEffect)
      reactRefresh.configs.vite, // Undvik konflikter med Vite React Fast Refresh
    ],

    // Parser/omgivning: berätta för ESLint vilken JS-version, JSX-stöd, och globala namn som finns
    languageOptions: {
      ecmaVersion: 2020, // Minsta nivå vi garanterar; “latest” i parserOptions nedan funkar också
      globals: globals.browser, // Gör t.ex. `window`/`document` giltiga utan att flagga dem
      parserOptions: {
        ecmaVersion: 'latest', // Tillåt modern syntax
        ecmaFeatures: { jsx: true }, // Aktivera JSX-parsning
        sourceType: 'module', // ESM-import/export
      },
    },

    // Egna justeringar
    rules: {
      // Fel om variabler inte används – MEN ignorera namn som börjar med versal/underscore
      // (t.ex. konstantnamn ELLER importer som måste finnas pga tooling).
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Tips: Lägg till fler regler här vid behov
      // ex: 'no-console': ['warn', { allow: ['warn', 'error'] }]
    },
  },
]);
