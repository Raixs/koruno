import { describe, expect, it } from 'vitest';
import { getDailyId, seededRandom, selectDailyQuestions } from '../src/daily.js';

const words = Array.from({ length: 8 }, (_, index) => ({
  word: `word-${index}`
}));

describe('daily mode helpers', () => {
  it('creates a stable daily id', () => {
    expect(getDailyId(new Date(2026, 3, 29))).toBe('2026-04-29');
  });

  it('creates repeatable random sequences from the same seed', () => {
    const first = seededRandom('koruno:test');
    const second = seededRandom('koruno:test');

    expect([first(), first(), first()]).toEqual([second(), second(), second()]);
  });

  it('selects the same questions for the same day', () => {
    const date = new Date(2026, 3, 29);
    const first = selectDailyQuestions(words, date, 5).map((word) => word.word);
    const second = selectDailyQuestions(words, date, 5).map((word) => word.word);

    expect(first).toEqual(second);
    expect(first).toHaveLength(5);
  });
});
