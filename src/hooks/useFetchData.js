import { useState, useEffect } from 'react';
import errorHandler from '../services/errorHandlerService';

/**
 * Custom hook to fetch data using a provided fetch function.
 *
 * @param {Function} fetchFunction - The function to fetch data. It should return a promise.
 * @param {Array} [dependencies=[]] - The list of dependencies for the useEffect hook.
 * @returns {Object} An object containing the fetched data, loading state, error state, and a refetch function.
 * @returns {any} return.data - The fetched data.
 * @returns {boolean} return.loading - The loading state.
 * @returns {string|null} return.error - The error message, if any.
 * @returns {Function} return.refetch - Function to manually refetch the data.
 */
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