// src/lib/apiClient.test.js
/**
 * Tester: apiClient
 * Syfte: validerar normalisering, cache-beteende och felhantering.
 */

//Vitest-API importeras för att definiera testerna.
//Fixtures: förutsägbar testdata så att testerna inte är beroende av internet.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { dummyJsonPayload } from '../tests/fixtures/dummyjson.products.js';

describe('apiClient (DummyJSON)', () => {
  beforeEach(() => {
    vi.restoreAllMocks(); // ser till att mockar återställs mellan tester
    vi.resetModules(); // viktig: nollställ modulcache mellan tester
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  //Test 1: test av mockad data, ratingnummer till rate i UI
  it('fetchProducts returnerar normaliserad lista (rating.number -> { rate })', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => dummyJsonPayload,
    });

    const { fetchProducts } = await import('./apiClient'); //ny modulinstans
    const result = await fetchProducts();

    // Verifierar att URL är korrekta, tillåter ?limit=100 så testet blir robust mot små förändringar
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /^https:\/\/dummyjson\.com\/products(\?limit=100)?$/
      ),
      { signal: undefined }
    );

    // Din funktion returnerar en ARRAY
    expect(Array.isArray(result)).toBe(true);

    // Testar både rating-normalisering och bildfallback, toMatchObject för att vi bryr oss om att testa vissa nycklar, inte allt
    expect(result[0]).toMatchObject({
      id: 1,
      title: 'Phone X',
      price: 999,
      category: 'smartphones',
      image: 'thumb.jpg',
      rating: { rate: 4.6 },
    });

    // thumbnail saknas -> fallback till images[0]
    expect(result[1]).toMatchObject({
      id: 2,
      image: 'fallback.jpg',
      rating: { rate: 4.0 },
    });
  });

  //Test 2: test återanvändning av cache
  it('fetchCategories använder cache när produkter redan har hämtats', async () => {
    // först fylls chache med normaliserade produkter
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => dummyJsonPayload,
    });
    const { fetchProducts, fetchCategories } = await import('./apiClient');
    await fetchProducts();

    // nollställer spinräknare och kontrollerat att fetchCategories användar cache och inte gör nätanrop
    //sen kontrolleras resultatets form och innehåll, t.ex. att smartphones finns med
    vi.clearAllMocks();
    const categories = await fetchCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain('smartphones');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  //Test 3: test av felhantering, kastar tydligt fel vid HTTP 500
  it('kastar tydligt fel vid 500-svar', async () => {
    // resetModules i beforeEach har redan stängt av cache
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    });
    //Simulerar fel och kontrollerar att fetchProducts kastar ett tydligt fel
    const { fetchProducts } = await import('./apiClient');
    await expect(fetchProducts()).rejects.toThrow(/500|Server Error|API/i);
  });
});
