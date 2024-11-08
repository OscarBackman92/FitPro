// src/components/common/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';
import logger from '../../services/loggerService';

const PrivateRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/signin',
  requireEmailVerified = false 
}) => {
  const { currentUser, isLoading, error } = useCurrentUser();
  const location = useLocation();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle authentication check
  if (!currentUser) {
    logger.debug('User not authenticated, redirecting to signin');
    
    // Store the attempted URL for redirect after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }}
        replace 
      />
    );
  }

  // Handle email verification requirement
  if (requireEmailVerified && !currentUser.is_email_verified) {
    logger.debug('Email verification required');
    toast.error('Please verify your email address to access this page');
    return (
      <Navigate 
        to="/email-verification" 
        state={{ from: location }}
        replace 
      />
    );
  }

  // Handle role-based access
  if (requiredRole && !currentUser.roles?.includes(requiredRole)) {
    logger.debug('Insufficient permissions', {
      requiredRole,
      userRoles: currentUser.roles
    });
    
    toast.error('You do not have permission to access this page');
    return (
      <Navigate 
        to="/" 
        state={{ from: location }}
        replace 
      />
    );
  }

  // Handle error state
  if (error) {
    logger.error('Authentication error:', error);
    toast.error('Authentication error. Please try signing in again.');
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }}
        replace 
      />
    );
  }

  // Render authorized content
  return (
    <React.Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
};

export const withPrivateRoute = (Component, options = {}) => {
  return function WrappedComponent(props) {
    return (
      <PrivateRoute {...options}>
        <Component {...props} />
      </PrivateRoute>
    );
  };
};

export default PrivateRoute;