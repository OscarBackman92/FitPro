import { useState, useEffect } from 'react';

const useFetchData = (fetchFunction, dependencies = []) => {
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
        setError(err.message || 'An error occurred while fetching data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, );

  const refetch = async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export default useFetchData;