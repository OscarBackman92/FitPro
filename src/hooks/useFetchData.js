import { useState, useEffect } from 'react';
import errorHandler from '../services/errorHandlerService';

export const useFetchData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction();
        setData(result);
        setError(null);
      } catch (err) {
        const handledError = errorHandler.handleApiError(err);
        setError(handledError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(result);
      setError(null);
    } catch (err) {
      const handledError = errorHandler.handleApiError(err);
      setError(handledError.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};