// ---------------------------------------------------------------
//  PERSONALISATION  (Lab Work #9)
//  Change STUDENT_NAME to your own name - it is shown in the
//  Pokédex header, e.g. "Pema's Pokédex".
// ---------------------------------------------------------------
export const STUDENT_NAME = 'Rigphel';
export const STUDENT_NO = '02240167';

// The list starts from the last three digits of the student number.
// 02240167 -> offset 167 (the first Pokémon shown is #168).
export const START_OFFSET = parseInt(STUDENT_NO.slice(-3), 10);

export const PAGE_SIZE = 20;
export const TOTAL_POKEMON = 1025; // National Pokédex (without alternate forms)
export const MAX_TEAM_SIZE = 6;
export const GAME_POOL = 151; // Game uses the first generation only
