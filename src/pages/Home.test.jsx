// src/pages/Home.test.jsx
/**
 * Tester: Home
 * Syfte: verifierar att sökfältet renderas och att en mockad produkt listas.
 * Viktigt: wrap i MemoryRouter pga länkar i ProductCard.
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, afterEach, expect } from 'vitest';
import Home from './Home.jsx';
import { dummyJsonPayload } from '../tests/fixtures/dummyjson.products.js';

afterEach(() => vi.restoreAllMocks());

describe('Home', () => {
  it('visar sökfältet och en produkt från mocken', async () => {
    // mocka API-svaret
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => dummyJsonPayload,
    });

    // wrap i router pga <Link> i ProductCard
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    // stabil selektor för input
    const search = await screen.findByRole('searchbox', {
      name: /sök produkter/i,
    });
    expect(search).toBeInTheDocument();

    // bekräfta att en produkt från mocken visas
    expect(await screen.findByText(/phone x/i)).toBeInTheDocument();
  });
});
