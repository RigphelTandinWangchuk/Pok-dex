import { useCallback, useEffect, useState } from 'react';

/**
 * Returns [debouncedValue, flush].
 * `debouncedValue` only changes after `value` has stopped changing for
 * `delay` ms, so we do not hit the search on every keystroke.
 * `flush()` applies the latest value immediately (e.g. search button).
 */
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const flush = useCallback(() => setDebounced(value), [value]);
  return [debounced, flush];
}
