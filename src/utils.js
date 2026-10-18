/** "mr-mime" -> "Mr Mime" */
export const formatName = (name = '') =>
  name
    .split('-')
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(' ');

/** 7 -> "#007" */
export const formatNumber = (id) => `#${String(id).padStart(3, '0')}`;

/** "special-attack" -> "Sp. Atk" etc. */
export const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};
export const STAT_ORDER = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
];

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
