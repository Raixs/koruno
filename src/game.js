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

export function selectGameQuestions(words, count, rng = Math.random) {
  const playableQuestions = getPlayableQuestions(words);
  return shuffle(playableQuestions, rng).slice(0, Math.min(count, playableQuestions.length));
}

export function buildDefinitionOptions(question, rng = Math.random) {
  const fakeDefinitions = shuffle(question.fakeDefinitions, rng).slice(0, 3);
  const options = [
    ...fakeDefinitions.map((text) => ({ text, isCorrect: false })),
    { text: question.correctDefinition, isCorrect: true }
  ];

  return shuffle(options, rng);
}
