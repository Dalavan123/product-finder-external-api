// src/lib/apiClient.js

const BASE_URL = 'https://dummyjson.com';

// enkel cache i minnet
let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

// Välj första giltiga bildsträng: image -> thumbnail -> images[0]
function pickImage(p) {
  const candidates = [
    typeof p.image === 'string' ? p.image.trim() : '',
    typeof p.thumbnail === 'string' ? p.thumbnail.trim() : '',
    Array.isArray(p.images) && typeof p.images[0] === 'string'
      ? p.images[0].trim()
      : '',
  ];
  for (const c of candidates) {
    if (c) return c;
  }
  return null;
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
    image: pickImage(p),

    // behåll originalfält om du använder dem någon annanstans
    thumbnail: p.thumbnail,
    images: p.images,
  };
}

function normalizeProducts(items = []) {
  return items.map(normalizeProduct);
}

export async function fetchProducts({ signal } = {}) {
  const now = Date.now();

  // cache
  if (cachedProducts && cacheTimestamp && now - cacheTimestamp < CACHE_TTL) {
    return cachedProducts;
  }

  const res = await fetch(`${BASE_URL}/products?limit=100`, { signal });
  if (!res.ok) {
    throw new Error(`Kunde inte hämta produkter (HTTP ${res.status})`);
  }
  const data = await res.json(); // { products, ... }

  cachedProducts = normalizeProducts(
    Array.isArray(data.products) ? data.products : []
  );
  cacheTimestamp = now;
  return cachedProducts;
}

export async function fetchCategories({ signal } = {}) {
  const products = await fetchProducts({ signal }); // återanvänder cache
  return [...new Set(products.map(p => p.category))];
}

export async function fetchProductById(id, { signal } = {}) {
  const products = await fetchProducts({ signal });
  return products.find(p => p.id === Number(id));
}

// (valfritt – praktiskt i tester om du vill forcera tom cache)
// export function __clearCache() { cachedProducts = null; cacheTimestamp = null }
