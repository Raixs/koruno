import { describe, expect, it, vi } from 'vitest';
import { normalizeWord, normalizeWords } from '../src/data.js';

describe('word normalization', () => {
  it('uses word.toUpperCase() when displayWord is missing', () => {
    const word = normalizeWord({
      word: 'achantar',
      correctDefinition: 'Callarse o rendirse.',
      fakeDefinitions: ['Fake 1', 'Fake 2', 'Fake 3'],
      example: 'Tivo que achantar.',
      difficulty: 'easy',
      tags: []
    });

    expect(word.displayWord).toBe('ACHANTAR');
    expect(word.type).toBe('definition');
  });

  it('ignores malformed entries and warns', () => {
    const warn = vi.fn();
    const words = normalizeWords([
      {
        word: 'kel',
        correctDefinition: 'Casa.',
        fakeDefinitions: ['Fake 1', 'Fake 2', 'Fake 3'],
        example: 'Vou para o kel.',
        difficulty: 'easy',
        tags: ['básico']
      },
      {
        word: 'rota',
        correctDefinition: 'Non vale.',
        fakeDefinitions: ['Fake 1'],
        example: 'Isto rompe.',
        difficulty: 'easy',
        tags: []
      }
    ], warn);

    expect(words).toHaveLength(1);
    expect(words[0].word).toBe('kel');
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
