// src/lib/apiClient.js

/**
 * Samlad modul för externa API-anrop (enklare att testa/byta API).
 * Denna version använder DummyJSON: https://dummyjson.com
 * Normaliserar rating från number -> { rate } så resten av appen slipper ändras.
 */

const BASE_URL = 'https://dummyjson.com';

function normalizeProducts(items = []) {
  return items.map(p => ({
    ...p,
    image: p.image ?? p.thumbnail, // stöd båda formaten
    rating: typeof p.rating === 'number' ? { rate: p.rating } : p.rating,
  }));
}

export async function fetchProducts({ signal } = {}) {
  const res = await fetch(`${BASE_URL}/products`, { signal });
  if (!res.ok) {
    throw new Error(`Kunde inte hämta produkter (HTTP ${res.status})`);
  }
  const data = await res.json(); // { products: [...], total, skip, limit }
  return normalizeProducts(data.products); // returnera arrayen + normalisera rating
}

export async function fetchCategories({ signal } = {}) {
  const res = await fetch(`${BASE_URL}/products/categories`, { signal });
  if (!res.ok) throw new Error('Kunde inte hämta kategorier');

  const data = await res.json();
  // returnera bara en array av strängar
  return data.map(c => c.slug);
}

// (valfritt om du använder detaljsida via id)
export async function fetchProductById(id, { signal } = {}) {
  const res = await fetch(`${BASE_URL}/products/${id}`, { signal });
  if (!res.ok)
    throw new Error(`Kunde inte hämta produkt ${id} (HTTP ${res.status})`);
  const p = await res.json();
  return normalizeProducts([p])[0];
}
