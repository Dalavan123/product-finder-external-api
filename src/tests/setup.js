// setup för Testing Library

import '@testing-library/jest-dom'; // gör att du kan använda matchers som toBeInTheDocument()
import 'whatwg-fetch'; // fetch-polyfill så det funkar i Vitest-miljö

// (frivilligt) Mock för CSS-moduler om du använder css modules (.module.css)
vi.mock('*.module.css', () => ({}));
