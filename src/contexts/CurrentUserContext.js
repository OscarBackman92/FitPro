// src/contexts/CurrentUserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import logger from "../services/loggerService";

const CurrentUserContext = createContext(null);
const SetCurrentUserContext = createContext(() => null);

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          logger.debug('No auth token found, skipping user fetch');
          setIsLoading(false);
          return;
        }

        logger.debug('Fetching current user');
        const userData = await authService.getCurrentUser();
        setCurrentUser(userData);
        logger.debug('Current user fetched successfully');
      } catch (err) {
        logger.error('Error fetching current user:', err);
        setCurrentUser(null);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const contextValue = {
    currentUser,
    setCurrentUser,
    isLoading
  };

  return (
    <CurrentUserContext.Provider value={contextValue}>
      {!isLoading && children}
    </CurrentUserContext.Provider>
  );
};