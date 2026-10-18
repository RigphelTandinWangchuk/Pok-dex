// Dark UI taken from the design screenshot: black background,
// type coloured hero + cards, purple accent for actions.
export const colors = {
  bg: '#050505',
  surface: '#0d0f14',
  surfaceAlt: '#161a22',
  border: 'rgba(255,255,255,0.10)',
  text: '#ffffff',
  textMuted: '#9aa3b2',
  accent: '#8a1fd1', // purple search button
  accentDark: '#5b1190',
  buttonDark: '#16231c', // dark "More details" button
  success: '#2e9d57',
  successSoft: '#1f6b3b',
  danger: '#d64545',
  dangerSoft: '#8e2a2a',
};

export const typeColors = {
  normal: '#9aa0a6',
  fire: '#f2762b',
  water: '#2f80ed',
  electric: '#e8b923',
  grass: '#4fb848',
  ice: '#5fc8d6',
  fighting: '#c0392b',
  poison: '#8e44c7',
  ground: '#b08a4a',
  flying: '#6c9ef0',
  psychic: '#e0559a',
  bug: '#8bb02a',
  rock: '#a8985a',
  ghost: '#6a5aa8',
  dragon: '#5b4fe0',
  dark: '#5a4a44',
  steel: '#7f95a8',
  fairy: '#e58fcb',
};

export const typeEmoji = {
  normal: '⚪',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '🥊',
  poison: '☠️',
  ground: '⛰️',
  flying: '🪽',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌑',
  steel: '⚙️',
  fairy: '✨',
};

export const TYPE_LIST = Object.keys(typeColors);

export const colorForType = (type) => typeColors[type] || '#6b7280';

// ---- tiny colour helpers (no libraries) ----
const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const rgbToHex = (rgb) =>
  '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** Mix two hex colours. t = 0 -> a, t = 1 -> b */
export const mix = (a, b, t) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
};
export const lighten = (hex, t) => mix(hex, '#ffffff', t);
export const darken = (hex, t) => mix(hex, '#000000', t);
