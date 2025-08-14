// AI-knapp visar loading och renderar mockad text.

// src/pages/ProductDetail.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProductDetail from './ProductDetail.jsx';

// enkel mock för fetch
global.fetch = vi.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({ id: 2, title: 'Blue Dress', price: 220 }))
  )
);

describe('ProductDetail', () => {
  it('visar produktens titel', async () => {
    render(
      <MemoryRouter initialEntries={['/product/2']}>
        <Routes>
          <Route path='/product/:id' element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/Blue Dress/i)).toBeInTheDocument();
  });
});
