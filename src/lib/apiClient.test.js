// src/lib/apiClient.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { dummyJsonPayload } from '../tests/fixtures/dummyjson.products.js';

describe('apiClient (DummyJSON)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules(); // viktig: nollställ modulcache mellan tester
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchProducts returnerar normaliserad lista (rating.number -> { rate })', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => dummyJsonPayload,
    });

    const { fetchProducts } = await import('./apiClient');
    const result = await fetchProducts();

    // URL tillåter ?limit=100
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /^https:\/\/dummyjson\.com\/products(\?limit=100)?$/
      ),
      { signal: undefined }
    );

    // Din funktion returnerar en ARRAY
    expect(Array.isArray(result)).toBe(true);

    // Normalisering
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

  it('fetchCategories använder cache när produkter redan har hämtats', async () => {
    // fyll cache
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => dummyJsonPayload,
    });
    const { fetchProducts, fetchCategories } = await import('./apiClient');
    await fetchProducts();

    // hämta kategorier: ska INTE göra nytt fetch
    vi.clearAllMocks();
    const categories = await fetchCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain('smartphones');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('kastar tydligt fel vid 500-svar', async () => {
    // resetModules i beforeEach har redan stängt av cache
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    });

    const { fetchProducts } = await import('./apiClient');
    await expect(fetchProducts()).rejects.toThrow(/500|Server Error|API/i);
  });
});
