/* Denna fil testar snabbt att Vitest fungerar. src/tests/smoke.test.js*/

import { describe, it, expect } from 'vitest';

describe('Vitest fungerar', () => {
  it('kör ett enkelt test', () => {
    expect(2 + 2).toBe(4);
  });
});
