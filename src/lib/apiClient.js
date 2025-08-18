// src/lib/apiClient.js
const BASE_URL = 'https://dummyjson.com';

let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000;

function bypassProductCache() {
  try {
    if (typeof window !== 'undefined') {
      if (window.__BYPASS_PRODUCT_CACHE__) return true; // sätts av Cypress
      const qs = new URLSearchParams(window.location.search);
      if (qs.has('nocache')) return true; // alternativ med ?nocache=1
    }
  } catch {}
  return false;
}

export function __clearProductCacheForTests() {
  cachedProducts = null;
  cacheTimestamp = null;
}

// Exponera så Cypress kan nå den innan appen startar
if (typeof window !== 'undefined') {
  window.__clearProductCacheForTests = __clearProductCacheForTests;
}

function normalizeProduct(p = {}) {
  const rating =
    typeof p.rating === 'number'
      ? { rate: p.rating }
      : p.rating && typeof p.rating.rate === 'number'
      ? { rate: p.rating.rate }
      : { rate: 0 };

  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    rating,
    image:
      p.image?.trim?.() ||
      p.thumbnail?.trim?.() ||
      p.images?.[0]?.trim?.() ||
      null,
    thumbnail: p.thumbnail,
    images: p.images,
  };
}
const normalizeProducts = (items = []) => items.map(normalizeProduct);

export async function fetchProducts({ signal } = {}) {
  const now = Date.now();

  if (
    !bypassProductCache() &&
    cachedProducts &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_TTL
  ) {
    return cachedProducts;
  }

  const res = await fetch(`${BASE_URL}/products?limit=100`, { signal });
  if (!res.ok)
    throw new Error(`Kunde inte hämta produkter (HTTP ${res.status})`);
  const data = await res.json();

  cachedProducts = normalizeProducts(
    Array.isArray(data.products) ? data.products : []
  );
  cacheTimestamp = now;
  return cachedProducts;
}

export async function fetchCategories({ signal } = {}) {
  const products = await fetchProducts({ signal });
  return [...new Set(products.map(p => p.category))];
}

export async function fetchProductById(id, { signal } = {}) {
  const products = await fetchProducts({ signal });
  return products.find(p => p.id === Number(id));
}
