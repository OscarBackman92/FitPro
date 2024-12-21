import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value by a specified delay.
 *
 * @param {any} value - The value to debounce.
 * @param {number} [delay=500] - The delay in milliseconds to debounce the value. Default is 500ms.
 * @returns {any} - The debounced value.
 *
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};