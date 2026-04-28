const STORAGE_KEY = 'trivial-koruno.stats.v1';

export const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesCompleted: 0,
  bestScore: 0,
  lastScore: 0,
  totalCorrect: 0,
  totalWrong: 0,
  currentStreak: 0,
  lastPlayedDailyId: null
};

function toSafeNumber(value) {
  return Number.isFinite(value) && value >= 0 ? value : 0;
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
    lastPlayedDailyId: typeof value.lastPlayedDailyId === 'string' ? value.lastPlayedDailyId : null
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

export function recordGameCompleted(stats, { score, correct, wrong }) {
  return normalizeStats({
    ...stats,
    gamesCompleted: stats.gamesCompleted + 1,
    bestScore: Math.max(stats.bestScore, score),
    lastScore: score,
    totalCorrect: stats.totalCorrect + correct,
    totalWrong: stats.totalWrong + wrong
  });
}
