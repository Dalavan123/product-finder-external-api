// testar att fetchProducts hanterar OK/fel.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProducts } from '../src/lib/apiClient';

global.fetch = vi.fn();

describe('apiClient', () => {
  beforeEach(() => fetch.mockReset());

  it('returnerar produkter när API svarar OK', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: 'Test', price: 10 }],
    });
    const data = await fetchProducts();
    expect(fetch).toHaveBeenCalled();
    expect(data).toHaveLength(1);
  });

  it('kastar fel när API svarar fel', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(fetchProducts()).rejects.toThrow();
  });
});
