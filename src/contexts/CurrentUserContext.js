// src/contexts/CurrentUserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from '../services/authService';
import { axiosReq } from "../services/axiosDefaults";
import logger from "../services/loggerService";
import toast from 'react-hot-toast';

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
        
        // Transform user data to match Django structure
        const transformedUser = {
          ...userData,
          // Ensure profile data matches Django structure
          profile: {
            ...userData.profile,
            id: userData.profile?.id || userData.id,
            // Added fields from Django profile model
            name: userData.profile?.name || '',
            bio: userData.profile?.bio || '',
            weight: userData.profile?.weight || null,
            height: userData.profile?.height || null,
            date_of_birth: userData.profile?.date_of_birth || null,
            gender: userData.profile?.gender || '',
            profile_image: userData.profile?.profile_image || null,
          },
          // Added fields from Django user model
          is_email_verified: userData.is_email_verified || false,
          last_login: userData.last_login || null,
          date_joined: userData.date_joined || null,
        };

        setCurrentUser(transformedUser);
        logger.debug('Current user fetched successfully');

        // Handle email verification reminder
        if (!transformedUser.is_email_verified) {
          toast.warning('Please verify your email address');
        }
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

  const setContextUser = async (user, token = null) => {
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
  };

  const contextValue = {
    currentUser,
    isLoading,
    error,
    isAuthenticated: !!currentUser,
    profile: currentUser?.profile || null,
    isEmailVerified: currentUser?.is_email_verified || false,
  };

  return (
    <CurrentUserContext.Provider value={contextValue}>
      <SetCurrentUserContext.Provider value={setContextUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};