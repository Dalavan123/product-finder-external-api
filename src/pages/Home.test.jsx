// src/pages/Home.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// *** VIKTIGT: matcha exakt importen i Home.jsx (inkl .js)
vi.mock('../lib/apiClient.js', () => ({
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

import Home from './Home.jsx';

describe('Home', () => {
  it('filtrerar via sökfältet', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // 1) Vänta in att datan hämtas och renderas
    expect(await screen.findByText(/Red Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue Mug/i)).toBeInTheDocument();

    // 2) Skriv i sökfältet
    const input =
      screen.queryByRole('searchbox', { name: /sök produkter/i }) ??
      screen.getByPlaceholderText(/sök produkter/i); // din Controls har den placeholdern

    await userEvent.type(input, 'mug');

    // 3) Vänta tills debouncen (200 ms) och filtrering slagit igenom
    await waitFor(() => {
      expect(screen.queryByText(/Red Shirt/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Blue Mug/i)).toBeInTheDocument();
    });
  });
});
