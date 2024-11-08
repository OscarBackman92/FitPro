import { useCallback, useRef, useEffect } from 'react';
import logger from '../services/loggerService';

export const useInfiniteScroll = (callback, hasMore) => {
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (!hasMore) return;
    
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        logger.debug('Infinite scroll threshold reached');
        callback();
      }
    }, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    });

    if (node) {
      observer.current.observe(node);
      logger.debug('Infinite scroll observer attached to element');
    }
  }, [callback, hasMore]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
        logger.debug('Infinite scroll observer disconnected');
      }
    };
  }, []);

  return lastElementRef;
};
