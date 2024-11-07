// src/components/common/PrivateRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;