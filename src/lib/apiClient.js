/**
 * Varför här? Vi vill att all kod som pratar med externa API:er ligger samlat. 
 Då blir det lättare att testa, byta API senare och återanvända funktioner
 * Hämtar alla produkter.
 * Separat funktion = lätt att återanvända och testa.
 * Vi kollar alltid res.ok för att få tydliga fel vid nätverks-/API-problem.
 * Vi tar emot en signal (AbortController) så att vi kan avbryta hämtningen
 om användaren lämnar sidan – det minskar ”hängande” requests och varningar i konsolen.
 */

const BASE_URL = 'https://fakestoreapi.com';

export async function fetchProducts({ signal } = {}) {
  const res = await fetch(`${BASE_URL}/products`, { signal });
  if (!res.ok) {
    throw new Error(`Kunde inte hämta produkter (HTTP ${res.status})`);
  }
  // API:t svarar med JSON-array av produkter
  return res.json();
}

export async function fetchCategories({ signal } = {}) {
  const res = await fetch('https://fakestoreapi.com/products/categories', {
    signal,
  });
  if (!res.ok) throw new Error('Kunde inte hämta kategorier');
  return res.json(); // ex: ["electronics","jewelery","men's clothing","women's clothing"]
}
