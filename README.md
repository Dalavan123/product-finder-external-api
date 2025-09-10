# Retail Product Finder

> Minimal e‑shop med React + Vite som hämtar produkter från **DummyJSON**. Inkluderar en **AI‑knapp** (mockad backend) för att generera säljande produkttexter, tillgänglighetsanpassat UI och tester med **Vitest** & **Cypress**.

---

## Innehåll

- [Funktioner](#funktioner)
- [Tekniker](#tekniker)
- [Kom igång](#kom-igång)

  - [Förkrav](#förkrav)
  - [Installation](#installation)
  - [Köra appen](#köra-appen)
  - [Nyttiga NPM‑scripts](#nyttiga-npm-scripts)

- [Testning](#testning)

  - [Enhetstester (Vitest)](#enhetstester-vitest)
  - [E2E (Cypress)](#e2e-cypress)

- [Projektstruktur](#projektstruktur)
- [Arkitektur i korthet](#arkitektur-i-korthet)
- [Tillgänglighet](#tillgänglighet)
- [Förbättringar framåt](#förbättringar-framåt)
- [Reflektion](#reflektion)

---

## Funktioner

- Lista produkter med **sök / filter / sortering**
- **Produktsida** med bild, pris & betyg
- **AI‑knapp** som genererar förbättrad beskrivning (idag mockad endpoint)
- **Tillgänglighetsanpassning**: etiketter, `aria-live`, tangentbordsstöd
- **Responsiv grid**: `repeat(auto-fit, minmax(220px, 1fr))`
- **Tester**: Enhetstester (Vitest) och E2E (Cypress)
- **Inputsanering** via `validators` för sökfält m.m.

## Tekniker

React, Vite, React Router, Express (mockad AI‑endpoint), Vitest, Testing Library, Cypress.

---

## Kom igång

### Förkrav

- Node **18+** (rekommenderat 18/20)
- Internetåtkomst (DummyJSON)

### Installation

```bash
# klona & installera
npm install
```

### Köra appen

#### Alternativ A — Frontend + mock‑API samtidigt

```bash
npm run dev:all
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- API (AI‑endpoint): [http://localhost:5174](http://localhost:5174)
  Endpoint: `POST /api/generate`

Vite **proxar** `/api/*` till 5174 (se `vite.config.js`).

#### Alternativ B — Endast frontend (utan AI‑knappen)

```bash
npm run dev
```

Listan/detaljsidan fungerar, men AI‑knappen ger **404** tills backend är igång.

### Nyttiga NPM‑scripts

| Script                 | Beskrivning                                |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Startar Vite (frontend)                    |
| `npm dev:all`          | Startar **Vite + Express‑API** parallellt  |
| `npm run test`         | Vitest i watch‑läge                        |
| `npm run e2e:dev`      | Startar Vite och öppnar **Cypress UI**     |
| `npm run e2e`          | Kör Cypress headless                       |
| `npm run cy:open:real` | Cypress UI mot **riktigt** API (DummyJSON) |
| `npm e2e:real`         | Cypress headless mot **riktigt** API       |

---

## Testning

### Enhetstester (Vitest)

Snabba och deterministiska tack vare mockad `fetch` i `src/tests/setup.js`.

```bash
npm run test
```

**Exempel på output**

```
Test Files 5 passed
Tests 10 passed
```

### E2E (Cypress)

Kör appen i en riktig browser och klickar runt som en användare.

**Dev + Cypress UI**

```bash
npm run e2e:dev
```

Vite startas och **Cypress GUI** öppnas. Välj `smoke.cy.js` och kör.

**Headless**

```bash
npm run e2e
```

**Mot riktigt API (DummyJSON)**

```bash
# UI
npm run cy:open:real

# headless
npm run e2e:real
```

---

## Projektstruktur

```
ProductFinder/
├─ package.json              # scripts & beroenden
├─ vite.config.js            # Vite + Vitest‑konfig (+ /api‑proxy)
├─ eslint.config.js          # lint‑regler för JS/React
├─ cypress.config.js         # Cypress‑inställningar (baseUrl m.m.)
├─ index.html                # bas‑HTML med #root + <meta viewport>
├─ README.md
├─ public/
│
├─ src/
│  ├─ main.jsx               # React entry (mountar <App/>)
│  ├─ App.jsx                # routing: "/" och "/product/:id"
│  ├─ index.css              # (valfritt) grund‑CSS
│  │
│  ├─ styles/
│  │  └─ global.css          # appens styling (grid, knappar, tema)
│  │
│  ├─ assets/                # UI‑bilder/ikoner
│  │
│  ├─ components/
│  │  ├─ Controls.jsx        # sök / kategori / sortering + Rensa
│  │  ├─ ProductCard.jsx     # produktkort (bild, pris, betyg, länk)
│  │  ├─ ProductCard.test.jsx
│  │  └─ ThemeToggle.jsx     # mörkt/ljust läge
│  │
│  ├─ pages/
│  │  ├─ Home.jsx            # lista över produkter + filter/sort
│  │  ├─ Home.test.jsx
│  │  ├─ ProductDetail.jsx   # detaljsida + AI‑knapp
│  │  └─ ProductDetail.test.jsx
│  │
│  ├─ lib/
│  │  ├─ apiClient.js        # fetch mot DummyJSON + enkel cache (TTL)
│  │  ├─ apiClient.test.js
│  │  ├─ validators.js       # sanering/validering av sök/kategori
│  │  └─ validators.test.js
│  │
│  └─ tests/
│     ├─ setup.js            # Vitest‑setup (jsdom + fetch‑mock)
│     ├─ smoke.test.jsx      # “renderar utan att krascha”
│     └─ fixtures/
│        └─ dummyjson.products.js
│
├─ server/
│  ├─ index.js               # Express @ http://localhost:5174
│  └─ generate.js            # /api/generate (AI‑text, mock/proxy)
│
└─ cypress/
   ├─ e2e/
   │  └─ smoke.cy.js         # E2E‑smoke: öppnar detaljsida, backar
   └─ fixtures/
      └─ dummyjson.products.json
```

---

## Arkitektur i korthet

- **Routing**: React Router (`/` & `/product/:id`)
- **Data**: `apiClient` hämtar från DummyJSON, har enkel **cache (TTL)** och testvänlig design
- **UI**: semantiska element (`<main>`, `<header>`, `<section>`, `<article>`, `<ul>/<li>`, `<figure>`, `<output>`) och ARIA
- **AI**: `POST /api/generate` (mockad i Express‑servern) – lätt att byta till riktig AI‑tjänst

## Tillgänglighet

- Tydliga etiketter för kontroller
- `aria-live` för träffräknare och genererad text
- Tangentbordsnavigering + fokusmarkering
- Alt‑texter / beskrivningar för media

## Förbättringar framåt

- Koppla **riktig AI‑tjänst** för textförbättring
- **Lokal valuta & språk** (t.ex. sv/eng, SEK/USD)
- Bättre felhantering (retry/timeout), loading‑skelett
- Liten bild‑CDN/cache för snabbare listning

## Reflektion i korthet

Projektet demonstrerar API‑integration, tillgänglig semantisk markup och en testbar arkitektur. AI‑delen är medvetet **mockad** för att visa **förbättringspotential** och hålla kostnader nere under utveckling. Bytet från FakeStore till DummyJSON möjliggjordes av en tydlig `apiClient` med bas‑URL, men krävde justeringar i testerna. Cypress‑delen gav viktiga lärdomar kring testdrivet arbetssätt och stabila selektorer. Git‑konflikter uppstod sent i projektet och löstes genom små inkrementella commits och återställning i mindre steg.

## Reflektion i längre version

## Reflektion – längre version

> 🧭 **Kort sammanfattning:** Jag byggde en liten e-shop med fokus på semantik, testbarhet och API-integration. Under resan bytte jag API, brottades med E2E-tester och lärde mig mycket om felsökning och Git-flöden.

### Varför jag bytte API (FakeStore → DummyJSON)

Jag började på FakeStore eftersom vi använt det i klassrummet, men ville visa ett annat API i inlämningen och bytte därför till **DummyJSON**. Tack vare en tydlig **bas-URL/`apiClient`** blev bytet smidigt i själva appen.  
**Lärdom:** Tester behövde uppdateras eftersom datastrukturen skiljde sig. En bra klient-abstraktion sparade tid, men testdatan måste spegla verkligheten.

### Testning: Vitest gick smidigt, Cypress krävde mer jobb

- **Enhetstester (Vitest):** Gick snabbt tack vare mockad `fetch` och tydliga komponentgränser.
- **E2E (Cypress):** Krävde stabila selektorer och mer setup. Jag fick skriva om flera saker för att få flödena att bli robusta.  
  **Lärdom:** Jag borde arbetat mer **testdrivet** (skriva testet först). När jag gjorde det blev utvecklingen lugnare.

### Felsökning mot slutet

Strax före målgång kraschade appen utan tydlig orsak. Jag använde AI-stöd, plockade isär koden och **byggde upp i små steg** tills felet försvann.  
**Lärdom:** Små, inkrementella förändringar och systematisk isolering gör felsökning effektiv.

### Git-konflikter – även i solo-projekt

Jag fick **Git-konflikter** trots att jag jobbade ensam. Det handlade främst om parallella ändringar som krockade.  
**Lärdom:** Små commits, tydliga meddelanden och att rebase/merge ofta minskar friktionen – konflikter kan hända även utan team.

### AI-delen – medvetet mockad

Jag lät AI-delen vara **mockad** för att undvika kostnader och nyckelhantering under inlämningen. Gränssnittet finns (POST `/api/generate`), vilket gör det lätt att koppla på en riktig tjänst senare.  
**Lärdom:** Det är okej att visa **förbättringspotential** om resten av arkitekturen är redo.

### Vad jag tar med mig till nästa projekt

1. **Mer TDD:** skriv testet först (särskilt för kritiska flöden).
2. **CI-kedja:** kör Vitest + Cypress på varje push/PR.
3. **Bättre felhantering:** retry/timeout och tydliga tomlägen/loading-skelett.
4. **Kontrakttester mot API:** fångar tidigt brytande ändringar.
5. **Riktig AI-tjänst** bakom samma endpoint med rate-limit och fallback till mock.

> ✨ **Slutsats:** Projektet gav mig praktisk vana i att byta API, bygga tillgängligt UI och göra appen testbar. Jag ser tydliga vägar framåt och har konkretiserat hur jag jobbar mer testdrivet och robust i nästa iteration.
