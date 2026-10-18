// All network calls live in this file (Lab requirement).
// API: https://pokeapi.co/api/v2  (no key needed)
import { PAGE_SIZE, TOTAL_POKEMON, GAME_POOL } from './config';
import { STAT_ORDER } from './utils';

const BASE_URL = 'https://pokeapi.co/api/v2';
const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export const artworkUrl = (id) => `${ARTWORK_URL}/${id}.png`;

/** "https://pokeapi.co/api/v2/pokemon/25/" -> 25 */
export const idFromUrl = (url) => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

async function getJSON(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('The request timed out.');
    throw new Error(
      e.message && e.message.startsWith('Request failed')
        ? e.message
        : 'Could not reach the server. Check your internet connection.'
    );
  } finally {
    clearTimeout(timer);
  }
}

// ------------------------------------------------------------------
//  Simple in-memory caches so we never download the same thing twice
// ------------------------------------------------------------------
const detailCache = new Map(); // id|name -> simplified pokemon
const speciesCache = new Map(); // id -> description text
let allNamesCache = null; // [{ id, name }]
const typeCache = new Map(); // type -> [{ id, name }]

/** Turns the big PokeAPI response into just what the app needs. */
function simplify(raw) {
  const stats = {};
  raw.stats.forEach((s) => {
    stats[s.stat.name] = s.base_stat;
  });
  STAT_ORDER.forEach((k) => {
    if (stats[k] == null) stats[k] = 0;
  });
  return {
    id: raw.id,
    name: raw.name,
    types: raw.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name),
    height: raw.height / 10, // decimetres -> metres
    weight: raw.weight / 10, // hectograms -> kilograms
    stats,
  };
}

/** Details of ONE Pokémon (by id or name). */
export async function fetchPokemon(idOrName) {
  const key = String(idOrName).toLowerCase();
  if (detailCache.has(key)) return detailCache.get(key);
  const data = simplify(await getJSON(`${BASE_URL}/pokemon/${key}`));
  detailCache.set(String(data.id), data);
  detailCache.set(data.name, data);
  return data;
}

/** Details for a list of ids/names, fetched in parallel. */
export function fetchPokemonMany(list) {
  return Promise.all(list.map((x) => fetchPokemon(x)));
}

/**
 * One page of Pokémon: https://pokeapi.co/api/v2/pokemon?offset=..&limit=..
 * Returns { items: [full pokemon details], nextOffset | null }.
 * We stop at TOTAL_POKEMON so alternate forms (#10001+) are not included.
 */
export async function fetchPokemonPage(offset, limit = PAGE_SIZE) {
  const safeLimit = Math.max(0, Math.min(limit, TOTAL_POKEMON - offset));
  if (safeLimit === 0) return { items: [], nextOffset: null };
  const data = await getJSON(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${safeLimit}`
  );
  const items = await fetchPokemonMany(data.results.map((r) => idFromUrl(r.url)));
  const next = offset + data.results.length;
  return { items, nextOffset: next >= TOTAL_POKEMON ? null : next };
}

/** Every Pokémon name (used for search across ALL Pokémon). */
export async function fetchAllNames() {
  if (allNamesCache) return allNamesCache;
  const data = await getJSON(`${BASE_URL}/pokemon?limit=${TOTAL_POKEMON}`);
  allNamesCache = data.results.map((r) => ({
    id: idFromUrl(r.url),
    name: r.name,
  }));
  return allNamesCache;
}

/** Pokémon of one type (optional feature: filter by type). */
export async function fetchPokemonByType(type) {
  if (typeCache.has(type)) return typeCache.get(type);
  const data = await getJSON(`${BASE_URL}/type/${type}`);
  const list = data.pokemon
    .map((p) => ({ id: idFromUrl(p.pokemon.url), name: p.pokemon.name }))
    .filter((p) => p.id <= TOTAL_POKEMON)
    .sort((a, b) => a.id - b.id);
  typeCache.set(type, list);
  return list;
}

/** English Pokédex description for the hero banner. */
export async function fetchDescription(id) {
  if (speciesCache.has(id)) return speciesCache.get(id);
  const data = await getJSON(`${BASE_URL}/pokemon-species/${id}`);
  const entry =
    data.flavor_text_entries.find((e) => e.language.name === 'en') || null;
  const text = entry
    ? entry.flavor_text.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim()
    : 'No description available.';
  speciesCache.set(id, text);
  return text;
}

/** Names of the first generation, used by the "Who's that Pokémon?" game. */
export async function fetchGameNames() {
  const all = await fetchAllNames();
  return all.filter((p) => p.id <= GAME_POOL);
}
