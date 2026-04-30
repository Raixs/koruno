const STORAGE_KEY = 'trivial-koruno.stats.v1';

export const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesCompleted: 0,
  bestScore: 0,
  lastScore: 0,
  totalCorrect: 0,
  totalWrong: 0,
  currentStreak: 0,
  lastPlayedDailyId: null,
  recentWords: [],
  discoveredWords: []
};

function toSafeNumber(value) {
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function normalizeWordIds(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((wordId) => String(wordId || '').trim().toLowerCase())
    .filter(Boolean);
}

function appendUniqueWordIds(previousWords = [], playedWords = []) {
  const wordIds = [];

  normalizeWordIds(previousWords).forEach((wordId) => {
    if (!wordIds.includes(wordId)) {
      wordIds.push(wordId);
    }
  });

  normalizeWordIds(playedWords).forEach((wordId) => {
    if (!wordIds.includes(wordId)) {
      wordIds.push(wordId);
    }
  });

  return wordIds;
}

export function normalizeStats(value = {}) {
  return {
    gamesPlayed: toSafeNumber(value.gamesPlayed),
    gamesCompleted: toSafeNumber(value.gamesCompleted),
    bestScore: toSafeNumber(value.bestScore),
    lastScore: toSafeNumber(value.lastScore),
    totalCorrect: toSafeNumber(value.totalCorrect),
    totalWrong: toSafeNumber(value.totalWrong),
    currentStreak: toSafeNumber(value.currentStreak),
    lastPlayedDailyId: typeof value.lastPlayedDailyId === 'string' ? value.lastPlayedDailyId : null,
    recentWords: normalizeWordIds(value.recentWords),
    discoveredWords: appendUniqueWordIds(
      Array.isArray(value.discoveredWords) ? value.discoveredWords : value.recentWords
    )
  };
}

export function readStats(storage = null) {
  try {
    const targetStorage = storage ?? globalThis.localStorage;
    const stored = targetStorage?.getItem(STORAGE_KEY);
    return normalizeStats(stored ? JSON.parse(stored) : DEFAULT_STATS);
  } catch (error) {
    console.warn('[storage] No se pudieron leer las estadísticas locales.', error);
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats, storage = null) {
  try {
    const targetStorage = storage ?? globalThis.localStorage;
    targetStorage?.setItem(STORAGE_KEY, JSON.stringify(normalizeStats(stats)));
  } catch (error) {
    console.warn('[storage] No se pudieron guardar las estadísticas locales.', error);
  }
}

export function recordGameStarted(stats) {
  return normalizeStats({
    ...stats,
    gamesPlayed: stats.gamesPlayed + 1
  });
}

export function updateRecentWords(previousWords = [], playedWords = [], limit = 20) {
  const recentWords = normalizeWordIds(previousWords);

  normalizeWordIds(playedWords).forEach((wordId) => {
    const existingIndex = recentWords.indexOf(wordId);
    if (existingIndex >= 0) {
      recentWords.splice(existingIndex, 1);
    }
    recentWords.push(wordId);
  });

  return recentWords.slice(-limit);
}

export function updateDiscoveredWords(previousWords = [], playedWords = []) {
  return appendUniqueWordIds(previousWords, playedWords);
}

export function recordGameCompleted(stats, { score, correct, wrong, playedWords = [], recentWordsLimit = 20 }) {
  return normalizeStats({
    ...stats,
    gamesCompleted: stats.gamesCompleted + 1,
    bestScore: Math.max(stats.bestScore, score),
    lastScore: score,
    totalCorrect: stats.totalCorrect + correct,
    totalWrong: stats.totalWrong + wrong,
    recentWords: updateRecentWords(stats.recentWords, playedWords, recentWordsLimit),
    discoveredWords: updateDiscoveredWords(stats.discoveredWords, playedWords)
  });
}
