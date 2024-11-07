// src/components/common/PrivateRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import logger from '../../services/loggerService';

export const PrivateRoute = ({ children }) => {
  const currentUser = useCurrentUser();
  const location = useLocation();

  if (!currentUser) {
    logger.debug('Unauthorized access attempt', { path: location.pathname });
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;