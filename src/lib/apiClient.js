const BASE_URL = 'https://fakestoreapi.com';

/**
 * Varför här? Vi vill att all kod som pratar med externa API:er ligger samlat. 
 Då blir det lättare att testa, byta API senare och återanvända funktioner
 * Hämtar alla produkter.
 * Separat funktion = lätt att återanvända och testa.
 * Vi kollar alltid res.ok för att få tydliga fel vid nätverks-/API-problem.
 * Vi tar emot en signal (AbortController) så att vi kan avbryta hämtningen
 om användaren lämnar sidan – det minskar ”hängande” requests och varningar i konsolen.
 */
export async function fetchProducts({ signal } = {}) {
  const res = await fetch(`${BASE_URL}/products`, { signal });
  if (!res.ok) {
    throw new Error(`Kunde inte hämta produkter (HTTP ${res.status})`);
  }
  // API:t svarar med JSON-array av produkter
  return res.json();
}
