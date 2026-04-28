import { describe, expect, it } from 'vitest';
import { buildShareText } from '../src/share.js';

describe('share text', () => {
  it('includes the viral pattern, score, rank and url', () => {
    const text = buildShareText({
      score: 3420,
      rank: 'Neno/a de Riazor 🌊',
      pattern: ['🟩', '🟨', '🟥', '🟩', '⬛'],
      url: 'https://example.com/koruno/'
    });

    expect(text).toContain('Fixen o Koruño 🌊');
    expect(text).toContain('🟩🟨🟥🟩⬛');
    expect(text).toContain('3420 pts');
    expect(text).toContain('Nivel: Neno/a de Riazor 🌊');
    expect(text).toContain('https://example.com/koruno/');
  });
});
