// src/contexts/CurrentUserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from '../services/authService';
import { axiosReq } from "../services/axiosDefaults";
import logger from "../services/loggerService";
import toast from 'react-hot-toast';

// Single context with both value and setter
const CurrentUserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  profile: null,
  isEmailVerified: false,
});

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
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
          setCurrentUser(null); // Explicitly set to null
          setIsLoading(false);
          return;
        }

        logger.debug('Fetching current user');
        const userData = await authService.getCurrentUser();
        
        const transformedUser = {
          ...userData,
          profile: {
            ...userData.profile,
            id: userData.profile?.id || userData.id,
            name: userData.profile?.name || '',
            bio: userData.profile?.bio || '',
            weight: userData.profile?.weight || null,
            height: userData.profile?.height || null,
            date_of_birth: userData.profile?.date_of_birth || null,
            gender: userData.profile?.gender || '',
            profile_image: userData.profile?.profile_image || null,
          },
          is_email_verified: userData.is_email_verified || false,
          last_login: userData.last_login || null,
          date_joined: userData.date_joined || null,
        };

        setCurrentUser(transformedUser);
        logger.debug('Current user fetched successfully');

        if (!transformedUser.is_email_verified) {
          toast.warning('Please verify your email address');
        }
      } catch (err) {
        logger.error('Error fetching current user:', err);
        setError(err.message);
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

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
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
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

  const handleSetCurrentUser = (user) => {
    if (!user) {
      // Clear everything when setting user to null
      setCurrentUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      logger.debug('User state cleared');
    } else {
      setCurrentUser(user);
    }
  };

  const contextValue = {
    currentUser,
    setCurrentUser: handleSetCurrentUser, // Use the wrapped version
    isLoading,
    error,
    isAuthenticated: !!currentUser,
    profile: currentUser?.profile || null,
    isEmailVerified: currentUser?.is_email_verified || false,
  };

  return (
    <CurrentUserContext.Provider value={contextValue}>
      {children}
    </CurrentUserContext.Provider>
  );
};