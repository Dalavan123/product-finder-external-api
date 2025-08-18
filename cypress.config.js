// cypress.config.js

/*En fil med inställning som Cypress läser innan den kör tester. Här finns adress bl.a. så man slipper skriva det vid varje test*/

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // här kör din dev-server
    supportFile: false, // vi håller det enkelt
  },
  video: false,
});
