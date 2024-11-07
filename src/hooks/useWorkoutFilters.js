import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { filterUtils } from '../utils/apiUtils';
import logger from '../services/loggerService';

export const useWorkoutFilters = (initialFilters = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    ...filterUtils.parseQueryString(location.search)
  }));

  useEffect(() => {
    logger.debug('Updating workout filters', { filters });
    const queryParams = filterUtils.buildQueryParams(filters);
    navigate(`${location.pathname}?${queryParams}`, { replace: true });
  }, [filters, navigate, location.pathname]);

  return [filters, setFilters];
};