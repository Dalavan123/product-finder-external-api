//src/components/ProductCard.test.jsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ProductCard from './ProductCard'; // justera ev. sökväg

describe('ProductCard', () => {
  const product = {
    id: 1,
    title: 'Phone X',
    price: 999,
    image: 'thumb.jpg',
    rating: { rate: 4.6 },
    category: 'smartphones',
    description: 'Nice phone',
  };

  it('visar titel, pris, bild och rating', () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Phone X/i)).toBeInTheDocument();
    expect(screen.getByText(/999/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /phone x/i })).toBeInTheDocument();
    expect(screen.getByText(/4\.6/)).toBeInTheDocument();
  });
});
