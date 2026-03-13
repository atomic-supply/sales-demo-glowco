import { useEffect, useState } from "react";

/**
 * Debounce hook - delays updating a value until after a specified delay.
 * Useful for search inputs to avoid expensive computations on every keystroke.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
