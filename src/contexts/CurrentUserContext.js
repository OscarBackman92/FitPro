import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const CurrentUserContext = createContext();
const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      // Check if we have a token
      const token = authService.getToken();
      if (!token) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      // Attempt to get current user
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
    } catch (err) {
      console.error('Error fetching current user:', err);
      // Clear token and user data on error
      authService.clearToken();
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoading }}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};