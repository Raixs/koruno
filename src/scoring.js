import { GAME_CONFIG } from './config.js';

export const RANK_TIERS = [
  {
    minPercentage: 0.95,
    rank: 'Lenda de María Pita 👑',
    messages: [
      'Isto non foi unha partida, foi unha exhibición con permiso da Real Akademia do Koruño.',
      'Tes o Koruño tan integrado que xa pensas en subtítulos para a xente da meseta.',
      'Acabas de facer unha partida para enmarcar no Obelisco. Vaia abuso, neno.',
      'Nivel lenda: se dis “buah”, tres persoas responden “neno” por instinto.',
      'A ti non che explican o glosario: o glosario venche pedir consello.'
    ]
  },
  {
    minPercentage: 0.85,
    rank: 'Alcalde de María Pita 🏛️',
    messages: [
      'Buah neno, controlas a cidade mellor que Paco Vázquez en modo campaña.',
      'Podes ir pola rúa Real dando leccións sen que ninguén se atreva a tusirche.',
      'Tes nivel de abrir un bar, poñerlle un nome raro e que funcione igual.',
      'Moi fino. Fallaches pouco e vacilaches moito, como debe ser.',
      'A Coruña recoñece os teus servizos. Non oficialmente, pero case.'
    ]
  },
  {
    minPercentage: 0.72,
    rank: 'Neno/a de Riazor 🌊',
    messages: [
      'Tes calle, tes léxico e aínda che queda tempo para unha garimba. Ben xogao.',
      'Vas forte. Un pouco máis e che deixan entrar no Paseo Marítimo sen supervisión.',
      'Non es lenda aínda, pero xa podes mirar mal aos turistas con certa autoridade.',
      'Bo nivel. Aínda metes algunha trapallada, pero con estilo.',
      'Isto xa cheira a persoa que sabe pedir sen quedar como un julay.'
    ]
  },
  {
    minPercentage: 0.6,
    rank: 'Habitual do Orzán 🍻',
    messages: [
      'Non está mal, pero nótase que aprendiches medio vocabulario ás catro da mañá.',
      'Tes nivel de noite longa e memoria selectiva. O mérito está aí.',
      'Vas ben, pero aínda hai palabras que che miran raro dende a barra.',
      'Acertaches unhas cantas, fallaches outras como quen pide Mahou na Coruña.',
      'Correcto, pero tampouco veñas agora de académico que aínda se che ve o ticket de guiri.'
    ]
  },
  {
    minPercentage: 0.48,
    rank: 'Koruño en Prácticas 🎒',
    messages: [
      'Hai base, pero aínda confundes Koruño con dicir “neno” cada tres palabras.',
      'Xa distingues unha trapallada dun planazo, que non é pouco para empezar.',
      'Vas collendo xeito, pero aínda che falta que unha gaivota che roube algo para madurar.',
      'Non fixeches o ridículo completo. Só unha versión beta bastante visible.',
      'Tes potencial, pero hoxe o glosario colleute polo belfo.'
    ]
  },
  {
    minPercentage: 0.35,
    rank: 'Aprendiz de Cantóns 🚌',
    messages: [
      'Algo che soa, pero tamén lle soa o mar a unha caracola e non por iso chana Koruño.',
      'Tes intención, pero hoxe viñeches cun vocabulario de excursión escolar.',
      'O dicionario fíxoche un trece catorce e ti asinaches conforme.',
      'Non foi desastre: foi unha clase práctica de humildade con vistas ao porto.',
      'Aprobado non, pero polo menos non preguntaches onde está o metro. Creo.'
    ]
  },
  {
    minPercentage: 0.2,
    rank: 'Turista Despistado 📸',
    messages: [
      'Cres que a Torre de Hércules é un sitio para facer stories e marchar. Toca chapar.',
      'O Koruño pasouche por riba en chándal e nin che deu tempo a dicir “buah”.',
      'Tes máis vontade que acertos, que é unha forma elegante de dicir “vaia mangada”.',
      'Viñeches con ilusión e marchas cunha lista de palabras para estudar no bus.',
      'Agora mesmo es capaz de perderte en María Pita mirando Google Maps.'
    ]
  },
  {
    minPercentage: 0,
    rank: 'Fodechinchos Infiltrado 🦀',
    messages: [
      'Tes acento de Madrid e acabas de preguntar onde se colle o Metro. Achanta e marcha.',
      'Isto foi unha visita guiada ao suspenso. Polo menos saíuche gratis.',
      'O teu nivel Koruño está en obras, sen licenza e con previsión de atraso.',
      'Non fallaches preguntas: fixeches unha performance contra o coñecemento.',
      'A Real Akademia do Koruño acaba de bloquear o teu número por precaución.'
    ]
  }
];

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

function pickMessage(messages, rng) {
  const messageIndex = Math.floor(rng() * messages.length);
  return messages[Math.max(0, Math.min(messageIndex, messages.length - 1))];
}

export function getRank(
  score,
  questionCount,
  maxPointsPerQuestion = GAME_CONFIG.maxPointsPerQuestion,
  rng = Math.random
) {
  const maxScore = Math.max(1, questionCount * maxPointsPerQuestion);
  const percentage = score / maxScore;
  const tier = RANK_TIERS.find((candidate) => percentage >= candidate.minPercentage)
    || RANK_TIERS[RANK_TIERS.length - 1];

  return {
    rank: tier.rank,
    message: pickMessage(tier.messages, rng),
    percentage
  };
}
