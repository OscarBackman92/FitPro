import { useCallback, useRef, useEffect } from 'react';

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
