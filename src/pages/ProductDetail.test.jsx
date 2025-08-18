// AI-knapp visar loading och renderar mockad text.
// src/pages/ProductDetail.test.jsx
/**
 * Tester: ProductDetail
 * Syfte: renderar titel för produkt-id och hanterar laddning/fel.
 * Testar från mockdata i tests/setup, detta är redan konfiguerat i vite.config.js.
 */
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProductDetail from './ProductDetail.jsx';

/*Renderar ProductDetail på den matchande routen (/product/:id).
Väntar asynkront med findByRole('heading', { name: /phone x/i }) tills en rubrik som heter “Phone X” syns.*/
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
