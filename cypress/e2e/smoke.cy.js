// cypress/e2e/smoke.cy.js
const useReal = Cypress.env('USE_REAL_API') === true;
const PRODUCTS_URL = '**/products?limit=100';

describe('smoke', () => {
  it('detaljvyn laddar och visar titel', () => {
    if (!useReal) {
      cy.fixture('dummyjson.products.json').then(fx => {
        cy.intercept('GET', PRODUCTS_URL, {
          statusCode: 200,
          body: { products: fx.products },
        }).as('getProducts');
      });
    } else {
      cy.intercept('GET', PRODUCTS_URL).as('getProducts'); // spy
    }

    cy.visit('/product/1', {
      onBeforeLoad(win) {
        // Viktigt: gör detta INNAN appkoden körs
        win.__BYPASS_PRODUCT_CACHE__ = true; // tvinga nätanrop
        win.__clearProductCacheForTests?.(); // nollställ in-memory cache
      },
    });

    // nu kommer requesten alltid att ske → det går att vänta på aliaset
    cy.wait('@getProducts', { timeout: 15000 })
      .its('response.statusCode')
      .should('be.oneOf', [200]);

    cy.get('h1,h2,h3,.card-title', { timeout: 15000 }).should('be.visible');
    cy.contains('a', /tillbaka/i).click();
    cy.location('pathname').should('eq', '/');
  });
});
