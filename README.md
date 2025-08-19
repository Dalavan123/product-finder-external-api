# Retail Product Finder – (AI Text Booster för vidare utveckling)

En liten React-app som:

Listar produkter (DummyJSON API) med sök / filtrering / sortering

Visar produktsida med bild, pris & betyg

Har en AI-knapp som genererar förbättrad produkttext (idag lokal mot mockad text, se vidare i förbättring...)

Tillgänglighetsanpassad med etiketter, aria-live bl.a.

Responsiv grid: repeat(auto-fit, minmax(220px, 1fr)), dvs. autoanpassar objekten till skärmens storlek, mobil/minst storlek visar 1 kolumn

Har enhetstester (Vitest) och E2E (Cypress)

Användningsområden:

Prototyp för e-handelns produktlistning och detaljsida

Exempel på mockad testmiljö (snabba, förväntade tester)

Förbättringsmöjligheter:

Kopplad mot riktig AI för att få prova på riktig textförbättring av diverse produkter.

Omvandling till lokal valuta & språk (sv/eng)

```
ProductFinder/
├─ package.json — scripts & beroenden
├─ vite.config.js — Vite + Vitest-konfig (+ /api-proxy)
├─ eslint.config.js — lint-regler för JS/React
├─ cypress.config.js — Cypress-inställningar (baseUrl m.m.)
├─ index.html — bas-HTML med #root + <meta viewport>
├─ README.md
├─ public/ — statiska tillgångar (om du behöver)
│
├─ src/
│ ├─ main.jsx — React entrypoint (mountar <App/>)
│ ├─ App.jsx — routing: "/" och "/product/:id"
│ ├─ index.css — (valfritt) samlar grund-CSS
│ │
│ ├─ styles/
│ │ └─ global.css — appens styling (grid, knappar, tema)
│ │
│ ├─ assets/ — bilder/ikoner för UI
│ │
│ ├─ components/
│ │ ├─ Controls.jsx — sök / kategori / sortering + Rensa
│ │ ├─ ProductCard.jsx — produktkort (bild, pris, betyg, länk)
│ │ ├─ ProductCard.test.jsx — enhetstest för ProductCard
│ │ └─ ThemeToggle.jsx — mörkt/ljust läge
│ │
│ ├─ pages/
│ │ ├─ Home.jsx — lista över produkter + filter/sort
│ │ ├─ Home.test.jsx — test av Home (mockad fetch)
│ │ ├─ ProductDetail.jsx — detaljsida + AI-knapp
│ │ └─ ProductDetail.test.jsx — test av detaljsidan
│ │
│ ├─ lib/
│ │ ├─ apiClient.js — fetch mot DummyJSON, normalisering,
│ │ │ enkel cache (TTL) + bypass för test
│ │ ├─ apiClient.test.js — tester för klienten (mockad payload)
│ │ ├─ validators.js — sanering/validering av sök/kategori
│ │ └─ validators.test.js — enkla valideringstester
│ │
│ └─ tests/
│ ├─ setup.js — Vitest-setup (jsdom + fetch-mock)
│ ├─ smoke.test.jsx — snabb “renderar utan att krascha”
│ └─ fixtures/
│ └─ dummyjson.products.js — deterministisk test-payload
│
├─ server/
│ ├─ index.js — Express på http://localhost:5174
│ └─ generate.js — /api/generate (AI-text, mock/proxy)
│
└─ cypress/
├─ e2e/
│ └─ smoke.cy.js — E2E-smoke: laddar detaljsida, backar
└─ fixtures/
└─ dummyjson.products.json — E2E-fixture för produkter
```

Kom igång:

Förkrav
Node 18+ (rekommenderat 18/20)
Internetåtkomst (DummyJSON nås online)

Installation

# klona & installera

kommando i terminal: npm install

Starta i utvecklingsläge

# startar Vite (5173 för frontend) + Express-API (5174 för backend mockad AI-text) samtidigt

kommando i terminal: npm run dev:all (Om man vill köra i en terminal)

Frontend körs då på: http://localhost:5173

API (AI-endpoint) körs på: http://localhost:5174 (/api/generate)

Vite proxar /api/\* till 5174 (se vite.config.js)

# Endast frontend (om du inte behöver AI-knappen just nu)

kommando i terminal: npm run dev

Då fungerar listan/detaljsidan (DummyJSON), men AI-knappen får 404 tills servern är igång.

# Testning

Testning
Enhetstester (Vitest)

Tester kör snabbt och offline tack vare mockad fetch i src/tests/setup.js.

Kommandon:

# watch-läge (utveckling)

kommando i terminal: npm run test

# Förväntad testoutput (exempel):

Test Files 5 passed
Tests 10 passed

E2E (Cypress)

Cypress kör appen i en riktig browser och klickar runt som en användare.

1. Dev + Cypress UI (test i Cypress UI mot mockat API-lager)
   kommando i terminal: npm run e2e:dev

# startar Vite + öppnar Cypress GUI

# välj "smoke.cy.js" och kör

2. Headless (test i dev terminal mot mockat API-lager)
   kommando i terminal: npm run e2e

3. Cypress mot “riktigt” API (DummyJSON)

# UI

kommando i terminal: npm run cy:open:real

# headless i dev endast

kommando i terminal: npm run e2e:real

# Dokumentation

Vid mottagandet av uppgiften fanns det så många API:er att skapa projektet till och projektidéer.
Jag fastnade för en idé att skapa en produktsida mot ett FakeAPI och kombinera ihop det med AI-textgenereringsidé i hopp om att även få lära mig mer om hur man använder AI i projekt.
Ser detta passa verksamheter som vill AI:s hjälp att generera säljande texter till sina produkter.

Under projektets gång insåg jag att den relativt korta tiden på en vecka inte gav mig möjlighet att
fullborda idén med AI samt att jag lärde mig att de flesta AI-tjänster kostar (finns gratisalternativ för givet antal förfrågningar). Därmed är denna funktion ej färdigutvecklad i appen.
Jag valde att inte plocka bort det jag har gjort hittills på AI-delen från mappstruktur och knapp i UI:et för att visa förbättringspotential om man vill ta projektet vidare.

Projektet var lärorikt och utmanande för mig på många sätt.
Det var roligt att få jobba mot API:n.
Jag började faktiskt med FakeStore-API:et då vi i klassrum hade påbörjat på den, men under projektet ändrade jag mig och vill visa upp annat API så det blev DummyJson-API. Då jag hade skapat en Base-URL så var det inte så krävande att byta API mitt i projektets gång.
Dock fick jag lära mig att testerna behövdes skriva om för att passa det nya API:ets struktur.

Enhetstest gjordes via Vitest och inte Jest då Vitest redan är utvecklat för React-applikationer.

När jag kom till e2e-testning via Cypress var det mycket som inte funkade (enhetstest via Viatest gick smidigare till) och det krävdes mycket korrigering av kod för att få det att funka.

Mot slutet av projektet när jag trodde jag var vid mål kraschade appen av någon anledning och jag fick ta extra mycket hjälp av AI att felsöka, plockade bort det mesta av koden och lägga tillbaka lite i taget. Någonstans hade hängt sig.

Ännu närmre målet fick jag GIT-konflikter något jag inte fått tidigare under projektet, så här lärde jag mig att GIT-konfikter kan uppstå även när man jobbar i enmansprojekt och inte bara i grupp.
