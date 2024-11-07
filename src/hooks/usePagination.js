import { useState, useEffect } from 'react';
import logger from '../services/loggerService';
import errorHandler from '../services/errorHandlerService';

export const usePagination = (fetchFunction, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchFunction(page);
        setData(prev => (page === 1 ? response.results : [...prev, ...response.results]));
        setHasMore(!!response.next);
        setError(null);
        logger.debug('Pagination data loaded', { 
          page, 
          count: response.results.length,
          hasMore: !!response.next 
        });
      } catch (err) {
        const handledError = errorHandler.handleApiError(err);
        setError(handledError.message);
        logger.error('Pagination error', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, fetchFunction, ...deps]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(p => p + 1);
    }
  };

  return { data, loading, error, hasMore, loadMore };
};