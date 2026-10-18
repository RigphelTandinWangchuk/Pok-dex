import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchAllNames,
  fetchPokemonByType,
  fetchPokemonMany,
  fetchPokemonPage,
} from '../api';
import { PAGE_SIZE, START_OFFSET } from '../config';

/**
 * Feeds the Pokédex FlatList.
 *
 *  - No search and no type  -> pages come straight from the API
 *    (?offset=..&limit=20), starting at START_OFFSET.
 *  - Search and/or type      -> we take the list of ALL names (or all names
 *    of one type), filter it, and load 20 matches at a time.
 *
 * In both cases scrolling to the end calls loadMore() (infinite scroll)
 * and an id is never added twice (no duplicates).
 */
export default function usePokedexList(query, type) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);

  const cursor = useRef(START_OFFSET); // offset (API mode) or index (filter mode)
  const matches = useRef(null); // filtered [{id,name}] in filter mode
  const requestId = useRef(0); // lets us ignore stale responses
  const busy = useRef(false);
  const itemsRef = useRef([]);

  const q = query.trim().toLowerCase().replace(/^#/, '');
  const filterMode = q.length > 0 || type !== null;

  const append = useCallback((newItems) => {
    const seen = new Set(itemsRef.current.map((p) => p.id));
    const fresh = newItems.filter((p) => !seen.has(p.id));
    itemsRef.current = [...itemsRef.current, ...fresh];
    setItems(itemsRef.current);
  }, []);

  // Loads the next chunk of 20. `reqId` identifies the current "session".
  const loadNext = useCallback(
    async (reqId) => {
      if (filterMode) {
        if (!matches.current) {
          const source = type ? await fetchPokemonByType(type) : await fetchAllNames();
          if (reqId !== requestId.current) return;
          matches.current = source.filter(
            (p) => !q || p.name.includes(q) || String(p.id) === q
          );
          cursor.current = 0;
        }
        const slice = matches.current.slice(cursor.current, cursor.current + PAGE_SIZE);
        const details = await fetchPokemonMany(slice.map((p) => p.id));
        if (reqId !== requestId.current) return;
        append(details);
        cursor.current += slice.length;
        setHasMore(cursor.current < matches.current.length);
      } else {
        const page = await fetchPokemonPage(cursor.current, PAGE_SIZE);
        if (reqId !== requestId.current) return;
        append(page.items);
        cursor.current = page.nextOffset ?? cursor.current;
        setHasMore(page.nextOffset !== null);
      }
    },
    [filterMode, type, q, append]
  );

  const loadFirst = useCallback(async () => {
    const reqId = ++requestId.current;
    busy.current = true;
    itemsRef.current = [];
    matches.current = null;
    cursor.current = START_OFFSET;
    setItems([]);
    setHasMore(true);
    setMoreError(false);
    setLoadingMore(false);
    setError('');
    setStatus('loading');
    try {
      await loadNext(reqId);
      if (reqId !== requestId.current) return;
      setStatus('ready');
    } catch (e) {
      if (reqId !== requestId.current) return;
      setError(e.message || 'Something went wrong.');
      setStatus('error');
    } finally {
      if (reqId === requestId.current) busy.current = false;
    }
  }, [loadNext]);

  // Restart whenever the search text (debounced) or the type changes
  useEffect(() => {
    loadFirst();
    return () => {
      requestId.current++; // cancel whatever is running
    };
  }, [loadFirst]);

  const loadMore = useCallback(async () => {
    if (busy.current || status !== 'ready' || !hasMore) return;
    const reqId = requestId.current;
    busy.current = true;
    setLoadingMore(true);
    setMoreError(false);
    try {
      await loadNext(reqId);
    } catch (e) {
      if (reqId === requestId.current) setMoreError(true);
    } finally {
      if (reqId === requestId.current) {
        busy.current = false;
        setLoadingMore(false);
      }
    }
  }, [status, hasMore, loadNext]);

  return {
    items,
    status,
    error,
    hasMore,
    loadingMore,
    moreError,
    loadMore,
    retry: loadFirst,
    filterMode,
  };
}
