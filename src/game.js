export function shuffle(items, rng = Math.random) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function getPlayableQuestions(words, type = 'definition') {
  return words.filter((word) => word.type === type);
}

export function getQuestionId(question) {
  return String(question.word || '').trim().toLowerCase();
}

function pickQuestion(candidates, usedIds, rng) {
  const available = candidates.filter((question) => !usedIds.has(getQuestionId(question)));
  return shuffle(available, rng)[0] || null;
}

export function selectGameQuestions(words, options = {}) {
  const {
    count = 5,
    difficultyPattern = [],
    recentWordIds = [],
    rng = Math.random
  } = options;
  const playableQuestions = getPlayableQuestions(words);
  const recentIds = new Set(recentWordIds.map((wordId) => String(wordId).trim().toLowerCase()));
  const selected = [];
  const usedIds = new Set();
  const maxQuestions = Math.min(count, playableQuestions.length);

  for (let index = 0; index < maxQuestions; index += 1) {
    const targetDifficulty = difficultyPattern[index];
    const nonRecent = playableQuestions.filter((question) => !recentIds.has(getQuestionId(question)));
    const preferred = targetDifficulty
      ? nonRecent.filter((question) => question.difficulty === targetDifficulty)
      : nonRecent;
    const fallbackNonRecent = nonRecent;
    const fallbackDifficulty = targetDifficulty
      ? playableQuestions.filter((question) => question.difficulty === targetDifficulty)
      : playableQuestions;

    const question = pickQuestion(preferred, usedIds, rng)
      || pickQuestion(fallbackNonRecent, usedIds, rng)
      || pickQuestion(fallbackDifficulty, usedIds, rng)
      || pickQuestion(playableQuestions, usedIds, rng);

    if (!question) break;

    selected.push(question);
    usedIds.add(getQuestionId(question));
  }

  return selected;
}

export function buildDefinitionOptions(question, rng = Math.random) {
  const fakeDefinitions = shuffle(question.fakeDefinitions, rng).slice(0, 3);
  const options = [
    ...fakeDefinitions.map((text) => ({ text, isCorrect: false })),
    { text: question.correctDefinition, isCorrect: true }
  ];

  return shuffle(options, rng);
}
