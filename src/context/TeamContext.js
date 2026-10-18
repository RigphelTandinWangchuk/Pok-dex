import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAX_TEAM_SIZE } from '../config';
import { STAT_ORDER } from '../utils';

const STORAGE_KEY = 'pokedex-02240167:team';

const TeamContext = createContext(null);

/** Keep only what we need in storage (small + works offline). */
const toMember = (p) => ({
  id: p.id,
  name: p.name,
  types: p.types,
  height: p.height,
  weight: p.weight,
  stats: p.stats,
});

const isValidMember = (m) =>
  m && typeof m.id === 'number' && typeof m.name === 'string' && m.stats;

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);
  const [ready, setReady] = useState(false);

  // 1) Load the saved team once when the app starts
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && alive) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const seen = new Set();
            const clean = parsed
              .filter(isValidMember)
              .filter((m) => (seen.has(m.id) ? false : seen.add(m.id)))
              .slice(0, MAX_TEAM_SIZE);
            setTeam(clean);
          }
        }
      } catch (e) {
        // corrupted / unavailable storage -> start with an empty team
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 2) Save every change (only after the first load finished,
  //    otherwise we would overwrite the saved team with [])
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(team)).catch(() => {});
  }, [team, ready]);

  const isInTeam = useCallback((id) => team.some((m) => m.id === id), [team]);
  const isFull = team.length >= MAX_TEAM_SIZE;

  const addToTeam = useCallback((pokemon) => {
    setTeam((prev) => {
      if (prev.length >= MAX_TEAM_SIZE) return prev; // full
      if (prev.some((m) => m.id === pokemon.id)) return prev; // no duplicates
      return [...prev, toMember(pokemon)];
    });
  }, []);

  const removeFromTeam = useCallback((id) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // Sum of every base stat of every member
  const combinedStats = useMemo(() => {
    const totals = {};
    STAT_ORDER.forEach((k) => {
      totals[k] = team.reduce((sum, m) => sum + (m.stats[k] || 0), 0);
    });
    totals.total = STAT_ORDER.reduce((s, k) => s + totals[k], 0);
    return totals;
  }, [team]);

  const value = useMemo(
    () => ({
      team,
      ready,
      isFull,
      isInTeam,
      addToTeam,
      removeFromTeam,
      combinedStats,
    }),
    [team, ready, isFull, isInTeam, addToTeam, removeFromTeam, combinedStats]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export const useTeam = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used inside <TeamProvider>');
  return ctx;
};
