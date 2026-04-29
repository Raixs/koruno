import { describe, expect, it } from 'vitest';
import { getQuestionId, selectGameQuestions } from '../src/game.js';

function makeWord(word, difficulty) {
  return {
    word,
    displayWord: word.toUpperCase(),
    correctDefinition: `${word} definition`,
    fakeDefinitions: ['Fake 1', 'Fake 2', 'Fake 3'],
    example: `${word} example`,
    difficulty,
    tags: [],
    type: 'definition'
  };
}

describe('game question selection', () => {
  it('follows the configured difficulty pattern', () => {
    const words = [
      makeWord('easy-1', 'easy'),
      makeWord('easy-2', 'easy'),
      makeWord('medium-1', 'medium'),
      makeWord('medium-2', 'medium'),
      makeWord('hard-1', 'hard')
    ];

    const questions = selectGameQuestions(words, {
      count: 5,
      difficultyPattern: ['easy', 'easy', 'medium', 'medium', 'hard'],
      rng: () => 0
    });

    expect(questions.map((question) => question.difficulty)).toEqual([
      'easy',
      'easy',
      'medium',
      'medium',
      'hard'
    ]);
  });

  it('avoids recent words when enough alternatives exist', () => {
    const words = [
      makeWord('easy-old-1', 'easy'),
      makeWord('easy-old-2', 'easy'),
      makeWord('easy-new-1', 'easy'),
      makeWord('easy-new-2', 'easy'),
      makeWord('medium-new-1', 'medium')
    ];

    const questions = selectGameQuestions(words, {
      count: 3,
      difficultyPattern: ['easy', 'easy', 'medium'],
      recentWordIds: ['easy-old-1', 'easy-old-2'],
      rng: () => 0
    });

    expect(questions.map((question) => question.difficulty)).toEqual(['easy', 'easy', 'medium']);
    expect(questions.map(getQuestionId)).not.toContain('easy-old-1');
    expect(questions.map(getQuestionId)).not.toContain('easy-old-2');
  });
});
