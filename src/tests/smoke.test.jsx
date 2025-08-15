// tests/smoke.test.jsx

/* Denna fil testar snabbt att Vitest fungerar. src/tests/smoke.test.js*/

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import { dummyJsonPayload } from './fixtures/dummyjson.products';

describe('App smoke', () => {
  it('renderar startläget', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => dummyJsonPayload,
    });
    render(<App />);
    expect(await screen.findByPlaceholderText(/sök/i)).toBeInTheDocument();
  });
});
