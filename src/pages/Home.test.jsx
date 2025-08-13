// listar produkter + filtrering/sök funkar (mocka apiClient).

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('../src/lib/apiClient', () => ({
  fetchProducts: async () => [
    {
      id: 1,
      title: 'Red Shirt',
      price: 10,
      category: 'clothes',
      rating: { rate: 4 },
    },
    {
      id: 2,
      title: 'Blue Mug',
      price: 5,
      category: 'home',
      rating: { rate: 5 },
    },
  ],
  fetchCategories: async () => ['clothes', 'home'],
}));
import Home from '../src/pages/Home.jsx';

describe('Home', () => {
  it('filtrerar via sökfältet', async () => {
    render(<Home />);
    // väntar in listan
    expect(await screen.findByText(/Red Shirt/i)).toBeInTheDocument();
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'mug');
    expect(screen.queryByText(/Red Shirt/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Blue Mug/i)).toBeInTheDocument();
  });
});
