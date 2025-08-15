// Valfritt - enkla valideringsfall

// src/lib/validators.test.js
import { describe, it, expect } from 'vitest';
import { isValidQuery } from './validators'; // anpassa export

describe('validators', () => {
  it('tillåter rimlig söktext', () => {
    expect(isValidQuery('iphone 15')).toBe(true);
  });
  it('stoppar farliga taggar', () => {
    expect(isValidQuery('<script>alert(1)</script>')).toBe(false);
  });
});
