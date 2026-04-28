import { GAME_CONFIG } from './config.js';

export function calculateQuestionScore(timeLeftSeconds, config = GAME_CONFIG) {
  const safeTimeLeft = Math.max(0, Math.min(config.timeLimitSeconds, timeLeftSeconds));
  const variablePoints = config.maxPointsPerQuestion - config.minPointsForCorrectAnswer;
  return Math.floor((safeTimeLeft / config.timeLimitSeconds) * variablePoints) + config.minPointsForCorrectAnswer;
}

export function getAnswerPatternSymbol({ isCorrect, isTimeout, timeLeftSeconds, timeLimitSeconds }) {
  if (isTimeout) return '⬛';
  if (!isCorrect) return '🟥';

  const timeRatio = timeLeftSeconds / timeLimitSeconds;
  return timeRatio >= 0.4 ? '🟩' : '🟨';
}

export function getRank(score, questionCount, maxPointsPerQuestion = GAME_CONFIG.maxPointsPerQuestion) {
  const maxScore = Math.max(1, questionCount * maxPointsPerQuestion);
  const percentage = score / maxScore;

  if (percentage > 0.8) {
    return {
      rank: 'Alcalde de María Pita 👑',
      message: 'Buah neno, controlas a cidade mellor que Paco Vázquez. Eres lenda viva.'
    };
  }

  if (percentage > 0.6) {
    return {
      rank: 'Neno/a de Riazor 🌊',
      message: 'Aprobado con nota. Sábeste mover polos cantóns sen parecer un guiri.'
    };
  }

  if (percentage > 0.4) {
    return {
      rank: 'Habitual do Orzán 🍻',
      message: 'Non está mal, pero nótase que ás veces pides Estrella Galicia en vaso de tubo.'
    };
  }

  if (percentage > 0.2) {
    return {
      rank: 'Turista Despistado 📸',
      message: 'Cres que a Torre de Hércules é un faro para espantar gaivotas. Toca chapar máis.'
    };
  }

  return {
    rank: 'Fodechinchos Infiltrado 🦀',
    message: 'Tes acento de Madrid e acabas de preguntar onde se colle o Metro. Achanta e marcha.'
  };
}
