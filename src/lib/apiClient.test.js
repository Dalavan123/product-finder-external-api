// testar att fetchProducts hanterar OK/fel.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchProducts, fetchCategories } from './apiClient';

global.fetch = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

describe('apiClient', () => {
  it('fetchProducts returnerar en lista vid 200 OK', async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 })
    );

    const res = await fetchProducts();
    expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products', {
      signal: undefined,
    });
    expect(res).toEqual(mockData);
  });

  it('fetchProducts kastar fel vid 500', async () => {
    fetch.mockResolvedValueOnce(new Response('Server error', { status: 500 }));
    await expect(fetchProducts()).rejects.toThrow(
      /Kunde inte hämta produkter/i
    );
  });

  it('fetchProducts vidarebefordrar AbortController-signal', async () => {
    const controller = new AbortController();
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 })
    );

    await fetchProducts({ signal: controller.signal });
    expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products', {
      signal: controller.signal,
    });
  });

  it('fetchCategories returnerar lista', async () => {
    const mockCats = ['electronics', 'jewelery'];
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockCats), { status: 200 })
    );

    const res = await fetchCategories();
    expect(fetch).toHaveBeenCalledWith(
      'https://fakestoreapi.com/products/categories',
      { signal: undefined }
    );
    expect(res).toEqual(mockCats);
  });

  it('fetchCategories kastar fel vid 400+', async () => {
    fetch.mockResolvedValueOnce(new Response('Bad', { status: 404 }));
    await expect(fetchCategories()).rejects.toThrow(
      /Kunde inte hämta kategorier/i
    );
  });
});
