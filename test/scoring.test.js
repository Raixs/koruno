import { describe, expect, it } from 'vitest';
import { calculateQuestionScore, getAnswerPatternSymbol } from '../src/scoring.js';

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
});
