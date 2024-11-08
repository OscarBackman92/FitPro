import { useState, useEffect, useCallback } from 'react';
import logger from '../services/loggerService';

export const usePagination = (fetchFunction, options = {}) => {
  const {
    pageSize = 10,
    initialPage = 1,
    dependencies = []
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchPage = useCallback(async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetchFunction({
        page: pageNumber,
        page_size: pageSize
      });

      logger.debug('Pagination data fetched', {
        page: pageNumber,
        total: response.count,
        results: response.results.length
      });

      if (pageNumber === 1) {
        setData(response.results);
      } else {
        setData(prev => [...prev, ...response.results]);
      }

      setTotal(response.count);
      setHasMore(!!response.next);
    } catch (err) {
      setError(err);
      logger.error('Error fetching paginated data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, pageSize]);

  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage, ...dependencies]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(p => p + 1);
    }
  }, [loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    total,
    page,
    loadMore,
    reset,
    setPage
  };
};