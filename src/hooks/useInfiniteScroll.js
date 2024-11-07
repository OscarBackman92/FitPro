import { useCallback, useRef } from 'react';
import logger from '../services/loggerService';

export const useInfiniteScroll = (callback) => {
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        logger.debug('Infinite scroll threshold reached');
        callback();
      }
    });

    if (node) {
      observer.current.observe(node);
      logger.debug('Infinite scroll observer attached to element');
    }
  }, [callback]);

  return lastElementRef;