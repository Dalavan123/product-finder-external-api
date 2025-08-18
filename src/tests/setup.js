// src/tests/setup.js
import '@testing-library/jest-dom/vitest';

// Polyfills som ibland saknas i jsdom
import { TextEncoder, TextDecoder } from 'util';
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

// Gemensam fetch-mock för testerna (offline & deterministiskt)
const realFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input?.url ?? '';

  // Mocka produktlistan (detta används av både Home & ProductDetail)
  if (/dummyjson\.com\/products\?limit=100/.test(url)) {
    return new Response(
      JSON.stringify({
        products: [
          {
            id: 1,
            title: 'Phone X',
            description: 'Nice phone',
            price: 999,
            category: 'smartphones',
            rating: 4.6,
            thumbnail: 'x.jpg',
            images: [],
          },
          {
            id: 2,
            title: 'Backpack',
            description: 'Nice bag',
            price: 59,
            category: 'bags',
            rating: 4.1,
            thumbnail: 'b.jpg',
            images: [],
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Mocka AI-endpointen
  if (typeof url === 'string' && /\/api\/generate$/.test(url)) {
    return new Response(JSON.stringify({ text: '🔧 (mock) AI-text' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Fallback till riktig fetch (lokala filer osv.)
  return realFetch
    ? realFetch(input, init)
    : Promise.reject(new Error('fetch not available'));
};
