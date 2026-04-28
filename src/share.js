export function buildShareText({ score, rank, pattern, url }) {
  const resultPattern = Array.isArray(pattern) && pattern.length > 0 ? pattern.join('') : '⬜';
  const lines = [
    'Fixen o Koruño 🌊',
    '',
    resultPattern,
    `${score} pts`,
    `Nivel: ${rank}`,
    '',
    '¿Superas isto ou vas achantar?'
  ];

  if (url) lines.push('', url);

  return lines.join('\n');
}

export async function copyTextToClipboard(text) {
  if (globalThis.navigator?.clipboard?.writeText) {
    try {
      await globalThis.navigator.clipboard.writeText(text);
      return;
    } catch {
      // Algunos navegadores exponen clipboard solo en contextos seguros o con permiso.
    }
  }

  const dummy = document.createElement('textarea');
  dummy.value = text;
  dummy.setAttribute('readonly', '');
  dummy.style.position = 'fixed';
  dummy.style.top = '-9999px';
  document.body.appendChild(dummy);
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
}
