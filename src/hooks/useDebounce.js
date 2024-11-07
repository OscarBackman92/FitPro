import { useState, useEffect } from 'react';
import logger from '../services/loggerService';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    logger.debug('Debounce timer started', { value, delay });
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      logger.debug('Debounced value updated', { value });
    }, delay);

    return () => {
      clearTimeout(handler);
      logger.debug('Debounce timer cleared');
    };
  }, [value, delay]);

  return debouncedValue;
};