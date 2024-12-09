import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    // If not loading and no user, redirect to sign in
    if (!isLoading && !currentUser) {
      navigate('/signin', { 
        replace: true,
        state: { from: location }
      });
    }
  }, [currentUser, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" color="green" centered />
      </div>
    );
  }

  return children;
};

export default PrivateRoute;