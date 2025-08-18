// AI-knapp visar loading och renderar mockad text.

// src/pages/ProductDetail.test.jsx
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProductDetail from './ProductDetail.jsx';

describe('ProductDetail', () => {
  it('renderar titel på detaljsidan', async () => {
    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Routes>
          <Route path='/product/:id' element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      await screen.findByRole('heading', { name: /phone x/i })
    ).toBeInTheDocument();
  });
});
