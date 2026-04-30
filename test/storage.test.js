import { describe, expect, it } from 'vitest';
import { normalizeStats, recordGameCompleted, updateDiscoveredWords, updateRecentWords } from '../src/storage.js';

describe('storage helpers', () => {
  it('keeps recent words normalized and limited', () => {
    const recentWords = updateRecentWords(['kel', 'neno'], ['Bute', 'kel', 'Fucar'], 3);

    expect(recentWords).toEqual(['bute', 'kel', 'fucar']);
  });

  it('stores played words when recording a completed game', () => {
    const stats = normalizeStats({ gamesCompleted: 2, bestScore: 500, recentWords: ['kel'] });
    const nextStats = recordGameCompleted(stats, {
      score: 800,
      correct: 3,
      wrong: 2,
      playedWords: ['bute', 'fucar'],
      recentWordsLimit: 20
    });

    expect(nextStats.gamesCompleted).toBe(3);
    expect(nextStats.bestScore).toBe(800);
    expect(nextStats.recentWords).toEqual(['kel', 'bute', 'fucar']);
    expect(nextStats.discoveredWords).toEqual(['kel', 'bute', 'fucar']);
  });

  it('keeps discovered words unique and keeps old discoveries', () => {
    const discoveredWords = updateDiscoveredWords(['kel', 'Neno'], ['bute', 'kel', 'Fucar']);

    expect(discoveredWords).toEqual(['kel', 'neno', 'bute', 'fucar']);
  });

  it('deduplicates discovered words while normalizing old stats', () => {
    const stats = normalizeStats({ discoveredWords: ['Kel', 'kel', 'Neno'] });

    expect(stats.discoveredWords).toEqual(['kel', 'neno']);
  });
});
