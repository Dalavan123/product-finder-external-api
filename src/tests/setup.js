// src/tests/setup.js
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import 'whatwg-fetch'; // behåll om du vill; ofarligt även på Node 18+, fetch-polyfill så det funkar i Vitest-miljö

// Rensa DOM + timers + återställ alla mocks efter varje test
afterEach(() => {
  cleanup();
  vi.clearAllTimers?.();
  vi.restoreAllMocks(); // <— ersätt vi.clearAllMocks()
});

// (frivilligt) Mocka CSS-moduler om du använder .module.css
vi.mock('*.module.css', () => ({}));
