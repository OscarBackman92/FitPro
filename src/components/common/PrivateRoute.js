// src/components/common/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = ({
  children,
  requireAuth = true,
  requireEmailVerified = false,
  roles = [],
  redirectTo = '/login'
}) => {
  const location = useLocation();
  const { currentUser, isLoading } = useCurrentUser();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return <LoadingSpinner centered />;
  }

  // Handle authentication check
  if (requireAuth && !currentUser) {
    // Save the attempted URL for redirect after login
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
  if (requireEmailVerified && !currentUser?.is_email_verified) {
    return (
      <Navigate 
        to="/verify-email" 
        state={{ from: location }}
        replace 
      />
    );
  }

  // Handle role-based access
  if (roles.length > 0 && !roles.some(role => currentUser?.roles?.includes(role))) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location,
          error: 'Insufficient permissions'
        }}
        replace 
      />
    );
  }

  // Render authorized component
  return (
    <React.Suspense fallback={<LoadingSpinner centered />}>
      {children}
    </React.Suspense>
  );
};

// HOC version for class components
export const withPrivateRoute = (
  WrappedComponent,
  options = { requireAuth: true, requireEmailVerified: false, roles: [] }
) => {
  return function WithPrivateRoute(props) {
    return (
      <PrivateRoute {...options}>
        <WrappedComponent {...props} />
      </PrivateRoute>
    );
  };
};

export default PrivateRoute;
