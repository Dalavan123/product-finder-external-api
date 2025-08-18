// src/lib/apiClient.js

/**
 * API-klient (DummyJSON)
 * Syfte: all produkthämtning mot DummyJSON,
 * Normalisering av produkter (formar om data till konsekvent format som appen förstår), kategorier och hitta produkt per id.
 * Enkel minnescache (TTL 5 min) ger färre nätanrop, snabbare UI, snällare mot API:et
 * Bypass-stöd (test/QA), dvs bypassa cachen i tester för att tvinga riktiga anrop.
 */

const BASE_URL = 'https://dummyjson.com';

// === Enkel cache i minnet ===
// - cachedProducts: senaste normaliserade listan
// - cacheTimestamp: när cachen sattes (ms)
// - CACHE_TTL: hur länge (ms) cachen ska anses färsk
let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minuter

/**
 * Bestäm om vi ska hoppa över cachen.
 * Användningsfall:
 *  - Cypress: `win.__BYPASS_PRODUCT_CACHE__ = true` i onBeforeLoad
 *  - Manuell test: lägg till `?nocache=1` i URL:en
 */
function bypassProductCache() {
  try {
    if (typeof window !== 'undefined') {
      if (window.__BYPASS_PRODUCT_CACHE__) return true; // sätts i Cypress
      const qs = new URLSearchParams(window.location.search);
      if (qs.has('nocache')) return true; // t.ex. /?nocache=1
    }
  } catch {
    // Om något strular i en miljö utan window – ignorera och använd cache som vanligt
  }
  return false;
}

/**
 * Hjälpmetod: rensa cachen (användbar i tester).
 * Notera: detta är *processminne* – cachen försvinner när sidan laddas om.
 */
export function __clearProductCacheForTests() {
  cachedProducts = null;
  cacheTimestamp = null;
}

// Exponera för Cypress: kan anropas innan appen kör igång
if (typeof window !== 'undefined') {
  window.__clearProductCacheForTests = __clearProductCacheForTests;
}

/**
 * Normalisera en enskild produkt från API-format → app-format.
 * - rating: number | { rate } → { rate }
 * - image: välj första “giltiga” strängen: image → thumbnail → images[0]
 * - behåll originalfält (thumbnail, images) om de behövs senare
 */
function normalizeProduct(p = {}) {
  // Säkerställ konsekvent rating-format
  const rating =
    typeof p.rating === 'number'
      ? { rate: p.rating }
      : p.rating && typeof p.rating.rate === 'number'
      ? { rate: p.rating.rate }
      : { rate: 0 };

  // Välj en bild (tom sträng och whitespace filtreras bort via .trim())
  const image =
    p.image?.trim?.() ||
    p.thumbnail?.trim?.() ||
    p.images?.[0]?.trim?.() ||
    null;

  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    rating,
    image,

    // Originalfälten sparas om vi behöver dem i framtiden
    thumbnail: p.thumbnail,
    images: p.images,
  };
}

/** Normalisera en lista av produkter, tålig mot felaktig input. */
const normalizeProducts = (items = []) => items.map(normalizeProduct);

/**
 * Hämta (och ev. cacha) produktlistan.
 *
 * @param {Object} [opts]
 * @param {AbortSignal} [opts.signal] - för att kunna avbryta nätanrop (bra i React useEffect cleanup)
 * @returns {Promise<Array>} normaliserad produktlista
 * @throws {Error} om HTTP-svar inte är ok
 *
 * Flöde:
 *  1) Om *färsk cache* finns och bypass inte är aktiv → returnera cache
 *  2) Annars hämta från nätet, normalisera, uppdatera cache, returnera
 */
export async function fetchProducts({ signal } = {}) {
  const now = Date.now();

  // Använd cache om:
  // - vi inte har bett om bypass
  // - vi har en lista i cache
  // - den inte har gått ut (TTL)
  if (
    !bypassProductCache() &&
    cachedProducts &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_TTL
  ) {
    return cachedProducts;
  }

  // Hämta från API
  const res = await fetch(`${BASE_URL}/products?limit=100`, { signal });
  if (!res.ok) {
    // Gör felet tydligt för UI:t (Home-sidan visar error-blocket)
    throw new Error(`Kunde inte hämta produkter (HTTP ${res.status})`);
  }
  const data = await res.json();

  // Normalisera och cacha
  cachedProducts = normalizeProducts(
    Array.isArray(data.products) ? data.products : []
  );
  cacheTimestamp = now;
  return cachedProducts;
}

/**
 * Hämta kategorier.
 * Notera: återanvänder `fetchProducts` (→ drar nytta av cache).
 */
export async function fetchCategories({ signal } = {}) {
  const products = await fetchProducts({ signal });
  // Plocka unika kategorier i stabil ordning
  return [...new Set(products.map(p => p.category))];
}

/**
 * Hitta produkt via id.
 * Notera: återanvänder `fetchProducts` (→ drar nytta av cache).
 *
 * @returns {Object | undefined} produkten eller undefined om den inte finns
 */
export async function fetchProductById(id, { signal } = {}) {
  const products = await fetchProducts({ signal });
  return products.find(p => p.id === Number(id));
}
