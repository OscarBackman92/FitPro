import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import axios from 'axios';

// Create contexts for current user and setter function
const CurrentUserContext = createContext();
const SetCurrentUserContext = createContext();

// Custom hooks to use the contexts
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // State to store current user
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status

  // Function to fetch current user data
  const fetchCurrentUser = useCallback(async () => {
    try {
      if (!authService.isAuthenticated()) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
    } catch (err) {
      console.error('Error fetching current user:', err);
      // Handle token expiration or invalid token
      if (err.response?.status === 401) {
        authService.logout();
        setCurrentUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load of user data
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Set up axios interceptor for token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          setCurrentUser(null);
          authService.logout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    // Provide current user and loading status to children
    <CurrentUserContext.Provider value={{ currentUser, isLoading }}>
      {/* Provide setter function for current user to children */}
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};