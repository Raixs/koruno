const VALID_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
const PLAYABLE_TYPES = new Set(['definition']);

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeWord(entry, index = 0, warn = console.warn) {
  const reject = (reason) => {
    warn(`[words.json] Entrada ${index} ignorada: ${reason}`, entry);
    return null;
  };

  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return reject('debe ser un objeto');
  }

  const word = cleanText(entry.word);
  if (!word) return reject('word debe ser un texto no vacío');

  const displayWord = entry.displayWord === undefined
    ? word.toUpperCase()
    : cleanText(entry.displayWord);
  if (!displayWord) return reject('displayWord debe ser un texto si se define');

  const correctDefinition = cleanText(entry.correctDefinition);
  if (!correctDefinition) return reject('correctDefinition debe ser un texto no vacío');

  if (!Array.isArray(entry.fakeDefinitions)) {
    return reject('fakeDefinitions debe ser un array');
  }

  const fakeDefinitions = entry.fakeDefinitions.map(cleanText).filter(Boolean);
  if (fakeDefinitions.length < 3) {
    return reject('fakeDefinitions debe tener al menos 3 textos válidos');
  }

  const example = cleanText(entry.example);
  if (!example) return reject('example debe ser un texto no vacío');

  const difficulty = cleanText(entry.difficulty);
  if (!VALID_DIFFICULTIES.has(difficulty)) {
    return reject('difficulty debe ser easy, medium o hard');
  }

  if (!Array.isArray(entry.tags)) {
    return reject('tags debe ser un array');
  }

  const type = cleanText(entry.type) || 'definition';
  if (!PLAYABLE_TYPES.has(type)) {
    return reject(`type "${type}" todavía no está soportado en v0.2`);
  }

  const note = cleanText(entry.note);

  return {
    word,
    displayWord,
    correctDefinition,
    fakeDefinitions,
    example,
    difficulty,
    tags: entry.tags.map(cleanText).filter(Boolean),
    note: note || undefined,
    type
  };
}

export function normalizeWords(rawWords, warn = console.warn) {
  if (!Array.isArray(rawWords)) {
    warn('[words.json] El archivo debe contener un array de palabras.');
    return [];
  }

  return rawWords
    .map((entry, index) => normalizeWord(entry, index, warn))
    .filter(Boolean);
}

export async function loadWords(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudo cargar ${url}: ${response.status}`);
  }

  const rawWords = await response.json();
  const words = normalizeWords(rawWords);

  if (words.length === 0) {
    throw new Error('No hay palabras válidas para jugar.');
  }

  return words;
}
