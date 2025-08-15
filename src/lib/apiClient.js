// src/lib/apiClient.js

/**
 * Samlad modul för externa API-anrop (enklare att testa/byta API).
 * Denna version använder DummyJSON: https://dummyjson.com
 * Normaliserar rating från number -> { rate } så resten av appen slipper ändras.
 */

const BASE_URL = 'https://dummyjson.com';

//enkel cache i minnet
let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minuter i millisekunder

function normalizeProducts(items = []) {
  return items.map(p => ({
    ...p,
    image: p.image ?? p.thumbnail ?? p.images?.[0] ?? '',
    rating: typeof p.rating === 'number' ? { rate: p.rating } : p.rating,
  }));
}

export async function fetchProducts({ signal } = {}) {
  const now = Date.now();

  // Använd cache om den är färsk
  if (cachedProducts && cacheTimestamp && now - cacheTimestamp < CACHE_TTL) {
    return cachedProducts;
  } //returnera direkt från cache

  const res = await fetch(`${BASE_URL}/products?limit=100`, { signal });
  if (!res.ok) {
    throw new Error(`Kunde inte hämta produkter (HTTP ${res.status})`);
  }
  const data = await res.json(); //{products, total, ...}

  cachedProducts = normalizeProducts(data.products);
  cacheTimestamp = now; // spara tidpunkten
  return cachedProducts;
}

export async function fetchCategories({ signal } = {}) {
  const products = await fetchProducts({ signal }); //återanvänder cache
  // Plocka unika kategorier

  return [...new Set(products.map(p => p.category))];
}

// (valfritt om du använder detaljsida via id)
export async function fetchProductById(id, { signal } = {}) {
  const products = await fetchProducts({ signal }); //återanvänder cache
  return products.find(p => p.id === Number(id));
}
