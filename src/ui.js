const CORRECT_MESSAGES = ['¡Buah Neno!', '¡De locos!', '¡Canela en rama!', '¡Sobradísimo!', '¡Cremita!', '¡Niquelao!'];
const WRONG_MESSAGES = ['Achantaste...', '¡Vaia julay!', 'Manda truco...', '¡Parguelísima!', 'Esvaraches...', 'Vaia trapallada...'];
const TIMEOUT_MESSAGES = ['Moi Lento!', '¡Espabila neno!', 'Perdiches o 11!', 'Tas durmindo?'];

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function createUI() {
  return {
    screenStart: document.getElementById('screen-start'),
    screenGame: document.getElementById('screen-game'),
    screenEnd: document.getElementById('screen-end'),
    startButton: document.getElementById('start-button'),
    startButtonLabel: document.getElementById('start-button-label'),
    startButtonIcon: document.getElementById('start-button-icon'),
    rulesTimeLimit: document.getElementById('rules-time-limit'),
    startStats: document.getElementById('start-stats'),
    loadStatus: document.getElementById('load-status'),
    wordDisplay: document.getElementById('word-display'),
    optionsContainer: document.getElementById('options-container'),
    scoreDisplay: document.getElementById('score-display'),
    questionCountDisplay: document.getElementById('question-count'),
    timerBar: document.getElementById('timer-bar'),
    timerText: document.getElementById('timer-text'),
    feedbackModal: document.getElementById('feedback-modal'),
    feedbackIcon: document.getElementById('feedback-icon'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackPoints: document.getElementById('feedback-points'),
    feedbackMeaning: document.getElementById('feedback-meaning'),
    feedbackExample: document.getElementById('feedback-example'),
    feedbackNoteWrap: document.getElementById('feedback-note-wrap'),
    feedbackNote: document.getElementById('feedback-note'),
    nextButton: document.getElementById('next-button'),
    finalScore: document.getElementById('final-score'),
    finalBestScore: document.getElementById('final-best-score'),
    finalGamesCompleted: document.getElementById('final-games-completed'),
    finalRank: document.getElementById('final-rank'),
    finalMessage: document.getElementById('final-message'),
    shareButton: document.getElementById('share-button'),
    resetButton: document.getElementById('reset-button')
  };
}

export function setConfigText(ui, config) {
  ui.rulesTimeLimit.textContent = String(config.timeLimitSeconds);
  ui.timerText.textContent = String(config.timeLimitSeconds);
}

export function renderStartStats(ui, stats) {
  ui.startStats.replaceChildren();

  if (stats.gamesCompleted > 0) {
    const bestScore = document.createElement('p');
    const gamesPlayed = document.createElement('p');

    bestScore.className = 'font-black';
    bestScore.textContent = `🔥 Mellor marca: ${stats.bestScore} pts`;
    gamesPlayed.className = 'font-black';
    gamesPlayed.textContent = `🎮 Partidas xogadas: ${stats.gamesCompleted}`;
    ui.startStats.append(bestScore, gamesPlayed);
    return;
  }

  ui.startStats.textContent = 'Aínda non tes marca. A primeira vai ser histórica.';
}

export function bindUIEvents(ui, handlers) {
  ui.startButton.addEventListener('click', handlers.onStart);
  ui.nextButton.addEventListener('click', handlers.onNext);
  ui.shareButton.addEventListener('click', handlers.onShare);
  ui.resetButton.addEventListener('click', handlers.onReset);
}

export function setStartLoading(ui) {
  ui.startButton.disabled = true;
  ui.startButtonLabel.textContent = 'Cargando palabras...';
  ui.startButtonIcon.className = 'fa-solid fa-spinner fa-spin ml-2';
  ui.loadStatus.classList.add('hidden');
  ui.loadStatus.textContent = '';
}

export function setStartReady(ui) {
  ui.startButton.disabled = false;
  ui.startButtonLabel.textContent = 'DALLE NENO!';
  ui.startButtonIcon.className = 'fa-solid fa-play ml-2';
  ui.loadStatus.classList.add('hidden');
  ui.loadStatus.textContent = '';
}

export function setStartError(ui, message) {
  ui.startButton.disabled = true;
  ui.startButtonLabel.textContent = 'Non cargaron as palabras';
  ui.startButtonIcon.className = 'fa-solid fa-triangle-exclamation ml-2';
  ui.loadStatus.textContent = message;
  ui.loadStatus.classList.remove('hidden');
}

export function showScreen(ui, screenName) {
  ui.screenStart.classList.toggle('hidden', screenName !== 'start');
  ui.screenGame.classList.toggle('hidden', screenName !== 'game');
  ui.screenEnd.classList.toggle('hidden', screenName !== 'end');
}

export function updateScore(ui, score) {
  ui.scoreDisplay.textContent = String(score);
}

export function updateQuestionCount(ui, currentIndex, totalQuestions) {
  ui.questionCountDisplay.textContent = `${currentIndex + 1}/${totalQuestions}`;
}

export function renderQuestion(ui, question, options, onAnswer) {
  ui.wordDisplay.textContent = question.displayWord;
  ui.optionsContainer.replaceChildren();

  options.forEach((option, index) => {
    const button = document.createElement('button');
    const letter = document.createElement('span');
    const text = document.createElement('span');

    button.type = 'button';
    button.className = 'option-btn answer-option w-full bg-white font-bold border-2 border-transparent text-left flex items-center';
    button.dataset.correct = String(option.isCorrect);

    letter.className = 'answer-letter';
    letter.textContent = String.fromCharCode(65 + index);

    text.className = 'answer-text';
    text.textContent = option.text;

    button.append(letter, text);
    button.addEventListener('click', () => onAnswer({ button, isCorrect: option.isCorrect }));
    ui.optionsContainer.appendChild(button);
  });
}

export function updateTimer(ui, timeLeftSeconds, timeLimitSeconds) {
  const safeTimeLeft = Math.max(0, timeLeftSeconds);
  const percentage = Math.max(0, Math.min(100, (safeTimeLeft / timeLimitSeconds) * 100));

  ui.timerBar.style.width = `${percentage}%`;
  ui.timerText.textContent = String(Math.ceil(safeTimeLeft));
  ui.timerText.classList.remove('text-white', 'text-yellow-400', 'text-red-400', 'animate-pulse');

  if (percentage < 15) {
    ui.timerBar.style.backgroundColor = '#f87171';
    ui.timerText.classList.add('text-red-400', 'animate-pulse');
  } else if (percentage < 40) {
    ui.timerBar.style.backgroundColor = '#facc15';
    ui.timerText.classList.add('text-yellow-400');
  } else {
    ui.timerBar.style.backgroundColor = '#4ade80';
    ui.timerText.classList.add('text-white');
  }
}

export function markAnswered(ui, selectedButton, isCorrect) {
  const buttons = [...ui.optionsContainer.children];
  buttons.forEach((button) => {
    button.disabled = true;
  });

  if (selectedButton && isCorrect) {
    selectedButton.classList.add('correct-answer');
    return;
  }

  if (selectedButton) {
    selectedButton.classList.add('wrong-answer');
  }

  const correctButton = buttons.find((button) => button.dataset.correct === 'true');
  correctButton?.classList.add('border-green-500', 'bg-green-50', 'text-green-800');
}

export function showFeedback(ui, { isCorrect, isTimeout, points, question }) {
  ui.feedbackModal.classList.remove('hidden');
  ui.feedbackModal.classList.add('flex');
  document.body.style.overflow = 'hidden';

  const cardWrapper = ui.feedbackModal.querySelector('.slide-up');
  cardWrapper.classList.remove('slide-up');
  void cardWrapper.offsetWidth;
  cardWrapper.classList.add('slide-up');

  if (isCorrect) {
    ui.feedbackIcon.textContent = '🔥';
    ui.feedbackTitle.textContent = pickRandom(CORRECT_MESSAGES);
    ui.feedbackTitle.className = 'text-3xl sm:text-4xl font-black mb-1 text-green-600 text-center';
    ui.feedbackPoints.textContent = `+${points} pts`;
    ui.feedbackPoints.className = 'font-bold text-green-500 mb-6 text-xl sm:text-2xl';
  } else {
    ui.feedbackIcon.textContent = isTimeout ? '⏱️' : '🤦‍♂️';
    ui.feedbackTitle.textContent = pickRandom(isTimeout ? TIMEOUT_MESSAGES : WRONG_MESSAGES);
    ui.feedbackTitle.className = 'text-3xl sm:text-4xl font-black mb-1 text-red-600 text-center';
    ui.feedbackPoints.textContent = '0 pts';
    ui.feedbackPoints.className = 'font-bold text-red-400 mb-6 text-xl sm:text-2xl';
  }

  ui.feedbackMeaning.textContent = question.correctDefinition;
  ui.feedbackExample.textContent = `"${question.example}"`;

  if (question.note) {
    ui.feedbackNote.textContent = question.note;
    ui.feedbackNoteWrap.classList.remove('hidden');
  } else {
    ui.feedbackNote.textContent = '';
    ui.feedbackNoteWrap.classList.add('hidden');
  }

  try {
    ui.nextButton.focus({ preventScroll: true });
  } catch {
    ui.nextButton.focus();
  }
}

export function hideFeedback(ui) {
  ui.feedbackModal.classList.add('hidden');
  ui.feedbackModal.classList.remove('flex');
  document.body.style.overflow = '';
}

export function showEnd(ui, { score, rank, message, stats }) {
  showScreen(ui, 'end');
  window.scrollTo(0, 0);

  ui.finalScore.textContent = String(score);
  ui.finalBestScore.textContent = String(stats.bestScore);
  ui.finalGamesCompleted.textContent = String(stats.gamesCompleted);
  ui.finalRank.textContent = rank;
  ui.finalMessage.textContent = `"${message}"`;
}

export function setShareButtonCopied(ui, originalHTML) {
  ui.shareButton.classList.remove('btn-share-pulse', 'bg-blue-500', 'hover:bg-blue-400');
  ui.shareButton.classList.add('bg-green-500');
  ui.shareButton.innerHTML = '<i class="fa-solid fa-check mr-2"></i> ¡TEXTO COPIADO!';

  window.setTimeout(() => {
    ui.shareButton.classList.add('bg-blue-500', 'hover:bg-blue-400', 'btn-share-pulse');
    ui.shareButton.classList.remove('bg-green-500');
    ui.shareButton.innerHTML = originalHTML;
  }, 2500);
}
