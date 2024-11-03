import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../context/CurrentUserContext';

const PrivateRoute = ({ children }) => {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default PrivateRoute;