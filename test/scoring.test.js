import { describe, expect, it } from 'vitest';
import { calculateQuestionScore, getAnswerPatternSymbol, getRank, RANK_TIERS } from '../src/scoring.js';

const config = {
  questionsPerGame: 5,
  timeLimitSeconds: 30,
  maxPointsPerQuestion: 1000,
  minPointsForCorrectAnswer: 100
};

describe('scoring', () => {
  it('awards max points for an immediate correct answer', () => {
    expect(calculateQuestionScore(30, config)).toBe(1000);
  });

  it('keeps the minimum points for a correct answer at timeout boundary', () => {
    expect(calculateQuestionScore(0, config)).toBe(100);
  });

  it('builds the expected share pattern symbols', () => {
    expect(getAnswerPatternSymbol({
      isCorrect: true,
      isTimeout: false,
      timeLeftSeconds: 20,
      timeLimitSeconds: 30
    })).toBe('🟩');

    expect(getAnswerPatternSymbol({
      isCorrect: true,
      isTimeout: false,
      timeLeftSeconds: 5,
      timeLimitSeconds: 30
    })).toBe('🟨');

    expect(getAnswerPatternSymbol({
      isCorrect: false,
      isTimeout: false,
      timeLeftSeconds: 12,
      timeLimitSeconds: 30
    })).toBe('🟥');

    expect(getAnswerPatternSymbol({
      isCorrect: false,
      isTimeout: true,
      timeLeftSeconds: 0,
      timeLimitSeconds: 30
    })).toBe('⬛');
  });

  it('returns more granular final ranks', () => {
    expect(getRank(5000, 5, 1000, () => 0).rank).toBe('Lenda de María Pita 👑');
    expect(getRank(4300, 5, 1000, () => 0).rank).toBe('Alcalde de María Pita 🏛️');
    expect(getRank(3700, 5, 1000, () => 0).rank).toBe('Neno/a de Riazor 🌊');
    expect(getRank(3000, 5, 1000, () => 0).rank).toBe('Habitual do Orzán 🍻');
    expect(getRank(2400, 5, 1000, () => 0).rank).toBe('Koruño en Prácticas 🎒');
    expect(getRank(1800, 5, 1000, () => 0).rank).toBe('Aprendiz de Cantóns 🚌');
    expect(getRank(1000, 5, 1000, () => 0).rank).toBe('Turista Despistado 📸');
    expect(getRank(500, 5, 1000, () => 0).rank).toBe('Fodechinchos Infiltrado 🦀');
  });

  it('rotates messages within the selected rank', () => {
    const result = getRank(5000, 5, 1000, () => 0.99);
    const topTier = RANK_TIERS[0];

    expect(result.rank).toBe(topTier.rank);
    expect(result.message).toBe(topTier.messages[topTier.messages.length - 1]);
  });
});
