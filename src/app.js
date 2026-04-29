import { GAME_CONFIG, WORDS_URL } from './config.js';
import { loadWords } from './data.js';
import { buildDefinitionOptions, getQuestionId, selectGameQuestions } from './game.js';
import { calculateQuestionScore, getAnswerPatternSymbol, getRank } from './scoring.js';
import { buildShareText, copyTextToClipboard } from './share.js';
import { readStats, recordGameCompleted, recordGameStarted, saveStats } from './storage.js';
import {
  bindUIEvents,
  createUI,
  hideFeedback,
  markAnswered,
  renderStartStats,
  renderQuestion,
  setConfigText,
  setShareButtonCopied,
  setStartError,
  setStartLoading,
  setStartReady,
  showEnd,
  showFeedback,
  showScreen,
  updateQuestionCount,
  updateScore,
  updateTimer
} from './ui.js';

const ui = createUI();

const state = {
  words: [],
  currentQuestions: [],
  currentIndex: 0,
  score: 0,
  timeLeftSeconds: GAME_CONFIG.timeLimitSeconds,
  timerInterval: null,
  isAnswering: false,
  correctCount: 0,
  wrongCount: 0,
  resultPattern: [],
  currentRankText: '',
  stats: readStats()
};

bindUIEvents(ui, {
  onStart: startGame,
  onNext: nextQuestion,
  onShare: shareCurrentResult,
  onReset: resetGame
});
setConfigText(ui, GAME_CONFIG);
renderStartStats(ui, state.stats);

init();

async function init() {
  setStartLoading(ui);

  try {
    state.words = await loadWords(WORDS_URL);
    setStartReady(ui);
  } catch (error) {
    console.error(error);
    setStartError(
      ui,
      'Non puidemos cargar as palabras. Revisa data/words.json e abre a app desde un servidor estático.'
    );
  }
}

function startGame() {
  if (state.words.length === 0) return;

  stopTimer();
  state.currentQuestions = selectGameQuestions(state.words, {
    count: GAME_CONFIG.questionsPerGame,
    difficultyPattern: GAME_CONFIG.difficultyPattern,
    recentWordIds: state.stats.recentWords
  });
  state.currentIndex = 0;
  state.score = 0;
  state.correctCount = 0;
  state.wrongCount = 0;
  state.resultPattern = [];
  state.currentRankText = '';
  state.isAnswering = false;
  state.stats = recordGameStarted(state.stats);
  saveStats(state.stats);

  updateScore(ui, state.score);
  showScreen(ui, 'game');
  window.scrollTo(0, 0);
  loadCurrentQuestion();
}

function loadCurrentQuestion() {
  state.isAnswering = false;
  state.timeLeftSeconds = GAME_CONFIG.timeLimitSeconds;

  const question = state.currentQuestions[state.currentIndex];
  const options = buildDefinitionOptions(question);

  window.scrollTo(0, 0);
  updateQuestionCount(ui, state.currentIndex, state.currentQuestions.length);
  renderQuestion(ui, question, options, ({ button, isCorrect }) => {
    handleAnswer({ button, isCorrect, isTimeout: false });
  });
  startTimer();
}

function startTimer() {
  stopTimer();
  updateTimer(ui, GAME_CONFIG.timeLimitSeconds, GAME_CONFIG.timeLimitSeconds);

  const startTime = performance.now();
  state.timerInterval = window.setInterval(() => {
    const elapsedSeconds = (performance.now() - startTime) / 1000;
    state.timeLeftSeconds = GAME_CONFIG.timeLimitSeconds - elapsedSeconds;

    if (state.timeLeftSeconds <= 0) {
      state.timeLeftSeconds = 0;
      updateTimer(ui, state.timeLeftSeconds, GAME_CONFIG.timeLimitSeconds);
      handleAnswer({ button: null, isCorrect: false, isTimeout: true });
      return;
    }

    updateTimer(ui, state.timeLeftSeconds, GAME_CONFIG.timeLimitSeconds);
  }, 50);
}

function stopTimer() {
  if (state.timerInterval) {
    window.clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function handleAnswer({ button, isCorrect, isTimeout }) {
  if (state.isAnswering) return;

  state.isAnswering = true;
  stopTimer();

  const question = state.currentQuestions[state.currentIndex];
  let points = 0;

  if (isCorrect) {
    points = calculateQuestionScore(state.timeLeftSeconds, GAME_CONFIG);
    state.score += points;
    state.correctCount += 1;
    updateScore(ui, state.score);
  } else {
    state.wrongCount += 1;
  }

  state.resultPattern.push(getAnswerPatternSymbol({
    isCorrect,
    isTimeout,
    timeLeftSeconds: state.timeLeftSeconds,
    timeLimitSeconds: GAME_CONFIG.timeLimitSeconds
  }));

  markAnswered(ui, button, isCorrect);

  window.setTimeout(() => {
    showFeedback(ui, { isCorrect, isTimeout, points, question });
  }, 600);
}

function nextQuestion() {
  hideFeedback(ui);
  state.currentIndex += 1;

  if (state.currentIndex < state.currentQuestions.length) {
    loadCurrentQuestion();
  } else {
    endGame();
  }
}

function endGame() {
  stopTimer();
  const result = getRank(state.score, state.currentQuestions.length, GAME_CONFIG.maxPointsPerQuestion);
  state.currentRankText = result.rank;
  state.stats = recordGameCompleted(state.stats, {
    score: state.score,
    correct: state.correctCount,
    wrong: state.wrongCount,
    playedWords: state.currentQuestions.map(getQuestionId),
    recentWordsLimit: GAME_CONFIG.recentWordsLimit
  });
  saveStats(state.stats);
  renderStartStats(ui, state.stats);

  showEnd(ui, {
    score: state.score,
    rank: result.rank,
    message: result.message,
    stats: state.stats
  });
}

async function shareCurrentResult(event) {
  const originalHTML = event.currentTarget.innerHTML;
  const url = window.location.href;
  const text = buildShareText({
    score: state.score,
    rank: state.currentRankText,
    pattern: state.resultPattern
  });
  const textWithUrl = buildShareText({
    score: state.score,
    rank: state.currentRankText,
    pattern: state.resultPattern,
    url
  });

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Trivial Koruño',
        text,
        url
      });
      return;
    }

    await copyTextToClipboard(textWithUrl);
    setShareButtonCopied(ui, originalHTML);
  } catch (error) {
    console.log('Error al compartir', error);
    try {
      await copyTextToClipboard(textWithUrl);
      setShareButtonCopied(ui, originalHTML);
    } catch (copyError) {
      console.warn('No se pudo copiar el resultado', copyError);
    }
  }
}

function resetGame() {
  hideFeedback(ui);
  startGame();
}

window.addEventListener('pagehide', stopTimer);
