import { useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook to implement infinite scrolling functionality.
 *
 * @param {Function} callback - The function to call when the last element is intersecting.
 * @param {boolean} hasMore - A flag indicating if there are more items to load.
 * @returns {Function} - A ref callback function to be assigned to the last element.
 */
export const useInfiniteScroll = (callback, hasMore) => {
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (!hasMore) return;
    
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        callback();
      }
    }, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [callback, hasMore]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
};
