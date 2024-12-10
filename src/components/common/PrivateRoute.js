import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isLoading } = useCurrentUser();

  console.log('PrivateRoute: Rendering', { currentUser, isLoading });

  useEffect(() => {
    // If not loading and no user, redirect to sign in
    if (!isLoading && !currentUser) {
      console.log('PrivateRoute: No authenticated user, redirecting to signin');
      navigate('/signin', { 
        replace: true,
        state: { from: location }
      });
    }
  }, [currentUser, isLoading, navigate, location]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    console.log('PrivateRoute: Showing loading spinner');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" color="green" centered />
      </div>
    );
  }

  console.log('PrivateRoute: Rendering protected content');
  return children;
};

export default PrivateRoute;