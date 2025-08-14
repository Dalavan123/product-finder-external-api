// Valfritt - enkla valideringsfall

// src/lib/validators.test.js
import { describe, it, expect } from 'vitest';
import { sanitizeQuery, isValidCategory } from './validators';

describe('validators', () => {
  it('sanitizeQuery trimmar script-taggar', () => {
    expect(sanitizeQuery('  <script>x</script>  ')).toBe('x');
  });
  it('isValidCategory whitelistar korrekt', () => {
    expect(isValidCategory('men')).toBe(true);
    expect(isValidCategory('drop table')).toBe(false);
  });
});
