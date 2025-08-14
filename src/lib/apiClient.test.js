import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchProducts, fetchCategories } from './apiClient';

global.fetch = vi.fn();
afterEach(() => vi.clearAllMocks());

describe('apiClient (DummyJSON)', () => {
  it('fetchProducts returnerar normaliserad lista (rating.number -> {rate})', async () => {
    const mock = {
      products: [
        { id: 1, title: 'A', rating: 4.5 },
        { id: 2, title: 'B', rating: 3 },
      ],
    };
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mock), { status: 200 })
    );

    const res = await fetchProducts();
    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/products', {
      signal: undefined,
    });
    expect(res).toHaveLength(2);
    expect(res[0].rating).toEqual({ rate: 4.5 }); // normaliserat
  });

  it('fetchCategories hämtar från DummyJSON', async () => {
    const cats = ['smartphones', 'laptops'];
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify(cats), { status: 200 })
    );
    const res = await fetchCategories();
    expect(fetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products/categories',
      { signal: undefined }
    );
    expect(res).toEqual(cats);
  });
});
