// cypress/e2e/smoke.cy.js

/**
 * ✅ Vad är detta?
 * Ett superenkelt “smoke test” som kollar att appen *över huvud taget* fungerar:
 * 1) Vi går direkt till en detaljsida (/product/1).
 * 2) Vi ser till att appen hämtar produktlistan (GET /products?limit=100).
 *    - I MOCK-läge svarar vi själva med testdata (förutsägbart och stabilt).
 *    - I REAL-läge låter vi appen prata med riktiga DummyJSON (bara “spionerar”).
 * 3) Vi verifierar att en rubrik visas (dvs. sidan faktiskt renderas).
 * 4) Vi klickar på “Tillbaka” och ser att vi hamnar på “/”.
 *
 * 💡 Varför detaljsidan först?
 * Din detaljsida använder list-cachen (fetchProductById hämtar från listan under huven),
 * därför räcker det att tvinga fram *ett* list-anrop före detaljvyn för att produkten ska finnas.
 *
 * 🔁 Två testlägen
 * - MOCK (default): stabilt, funkar offline. Vi interceptar och skickar fixtures.
 * - REAL: riktiga nätanrop. Bra för “rökprov” mot verkligheten.
 *   Sätt USE_REAL_API=true när du startar Cypress för detta.
 */

const useReal = Cypress.env('USE_REAL_API') === true; // styr mock vs real med env-var
const PRODUCTS_URL = '**/products?limit=100'; // ** matchar både absoluta/relativa URL:er

describe('smoke', () => {
  it('detaljvyn laddar och visar titel', () => {
    if (!useReal) {
      // MOCK-LÄGE: vi svarar själva på GET /products?limit=100 med fixtures
      // ➜ förutsägbart (samma data varje gång), inget beroende av nätet
      cy.fixture('dummyjson.products.json').then(fx => {
        cy.intercept('GET', PRODUCTS_URL, {
          statusCode: 200,
          body: { products: fx.products }, // samma form som DummyJSONs /products
        }).as('getProducts'); // alias så vi kan cy.wait('@getProducts')
      });
    } else {
      // REAL-LÄGE: “spionera” på nätanropet men *inte* ändra svaret
      // ➜ vi kan fortfarande vänta på att requesten sker med cy.wait('@getProducts')
      cy.intercept('GET', PRODUCTS_URL).as('getProducts');
    }

    // Besök detaljsidan FÖRST. Innan appen hinner köra:
    // - __BYPASS_PRODUCT_CACHE__ = true → tvingar bort in-memory-cachen i apiClient
    // - __clearProductCacheForTests()   → nollställer cachen helt
    // Det gör att appen *måste* hämta listan (bra: vi kan vänta på det).
    cy.visit('/product/1', {
      onBeforeLoad(win) {
        win.__BYPASS_PRODUCT_CACHE__ = true;
        win.__clearProductCacheForTests?.();
      },
    });

    // Vänta tills listan hämtats (mock eller real). Vi accepterar 200-svar.
    cy.wait('@getProducts', { timeout: 15_000 })
      .its('response.statusCode')
      .should('be.oneOf', [200]);

    // Minsta möjliga kontroll av detaljsidan:
    // – vi förväntar oss att någon rubrik syns (h1/h2/h3 eller .card-title)
    cy.get('h1,h2,h3,.card-title', { timeout: 15_000 }).should('be.visible');

    // Klicka på länken “Tillbaka” och kontrollera att vi hamnar på /
    cy.contains('a', /tillbaka/i).click();
    cy.location('pathname').should('eq', '/');
  });
});
