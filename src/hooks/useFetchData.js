import { useState, useEffect } from 'react';
import logger from '../services/loggerService';
import errorHandler from '../services/errorHandlerService';

export const useFetchData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        logger.debug('Fetching data');
        const result = await fetchFunction();
        setData(result);
        setError(null);
        logger.debug('Data fetched successfully', { dataSize: result?.length });
      } catch (err) {
        const handledError = errorHandler.handleApiError(err);
        setError(handledError.message);
        logger.error('Data fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = async () => {
    try {
      setLoading(true);
      logger.debug('Refetching data');
      const result = await fetchFunction();
      setData(result);
      setError(null);
      logger.debug('Data refetched successfully');
    } catch (err) {
      const handledError = errorHandler.handleApiError(err);
      setError(handledError.message);
      logger.error('Data refetch error', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};