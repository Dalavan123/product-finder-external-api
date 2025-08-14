// src/components/ProductCard.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard.jsx';

describe('ProductCard', () => {
  it('renderar titel och pris', () => {
    render(
      <MemoryRouter>
        <ProductCard product={{ id: 1, title: 'Red Shirt', price: 120 }} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Red Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
  });
});
