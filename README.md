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

Projektet var lärorikt och utmanande för mig på många sätt. Det var roligt att få jobba mot API:n. Jag började faktiskt med FakeStore-API:et då vi i klassrum hade påbörjat på den, men under projektet ändrade jag mig och vill visa upp annat API så det blev DummyJson-API. Då jag hade skapat en Base-URL så var det inte så krävande att byta API mitt i projektets gång. Dock fick jag lära mig att testerna behövdes skriva om för att passa det nya API:ets struktur. När jag kom till e2e-testning via Cypress var det mycket som inte funkade (enhetstest via Vitest gick smidigare) och det krävdes mycket korrigering av kod för att få det att funka. En lärdom här var att tänka ännu mer testdrivet, dvs. att skapa testet först innan utvecklingen vilket jag flertalet gånger missade. Mot slutet av projektet när jag trodde jag var vid mål kraschade appen av någon anledning och jag fick ta extra mycket hjälp av AI att felsöka, plockade bort det mesta av koden och lägga tillbaka lite i taget. Någonstans hade det hängt sig. Ännu närmre målet fick jag GIT-konflikter något jag inte fått tidigare under projektet, så här lärde jag mig att GIT-konfikter kan uppstå även när man jobbar i enmansprojekt och inte bara i grupp.
