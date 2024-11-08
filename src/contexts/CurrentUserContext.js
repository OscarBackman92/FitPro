// src/contexts/CurrentUserContext.js
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { authService } from "../services/authService";
import logger from "../services/loggerService";
import { axiosReq } from "../services/axiosDefaults";

const CurrentUserContext = createContext(undefined);
const SetCurrentUserContext = createContext(undefined);

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};

export const useSetCurrentUser = () => {
  const context = useContext(SetCurrentUserContext);
  if (context === undefined) {
    throw new Error('useSetCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          logger.debug('No auth token found, skipping user fetch');
          setIsLoading(false);
          return;
        }

        logger.debug('Fetching current user');
        const userData = await authService.getCurrentUser();
        
        // Transform user data to include necessary fields
        const transformedUser = {
          ...userData,
          // Ensure profile data is properly structured
          profile: {
            ...userData.profile,
            id: userData.profile?.id || userData.id,
            // Add any other necessary profile fields
          }
        };

        setCurrentUser(transformedUser);
        logger.debug('Current user fetched successfully');
      } catch (err) {
        logger.error('Error fetching current user:', err);
        setError(err.message);
        setCurrentUser(null);
        // Clear auth data on error
        authService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axiosReq.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && error.config && !error.config._retry) {
          error.config._retry = true;
          try {
            await authService.refreshToken();
            return axiosReq(error.config);
          } catch (refreshError) {
            setCurrentUser(null);
            authService.clearAuth();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosReq.interceptors.response.eject(interceptor);
    };
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    isLoading,
    error,
    isAuthenticated: !!currentUser,
    profile: currentUser?.profile || null,
  }), [currentUser, isLoading, error]);

  const setContextValue = useMemo(() => (
    async (user, token = null) => {
      try {
        if (token) {
          localStorage.setItem('token', token);
          authService.setAuthHeader(token);
        }
        
        if (user) {
          // Transform user data if necessary
          const transformedUser = {
            ...user,
            profile: {
              ...user.profile,
              id: user.profile?.id || user.id,
            }
          };
          setCurrentUser(transformedUser);
        } else {
          setCurrentUser(null);
          authService.clearAuth();
        }
      } catch (err) {
        logger.error('Error setting current user:', err);
        setError(err.message);
      }
    }
  ), []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <CurrentUserContext.Provider value={contextValue}>
      <SetCurrentUserContext.Provider value={setContextValue}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};