import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";

const DEBUG = process.env.NODE_ENV === 'development';

const logDebug = (message, data = null) => {
  if (DEBUG) {
    console.log(`[CurrentUserContext] ${message}`, data || '');
  }
};

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        logDebug('Fetching current user...');
        const { data } = await axiosReq.get('/auth/user/');
        if (data) {
          setCurrentUser(data);
          logDebug('Current user fetched:', data);
        } else {
          logDebug('No user data received');
        }
      } catch (err) {
        logDebug('Error fetching current user:', err);
        setAuthError(err.response?.data?.detail || 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      logDebug('No token found, skipping user fetch');
      setIsLoading(false);
    }
  }, []);

  if (DEBUG) {
    window.userContextDebug = {
      getState: () => ({
        currentUser,
        authError,
        isLoading,
      }),
      setTestUser: (testUser) => {
        logDebug('Setting test user:', testUser);
        setCurrentUser(testUser);
      },
      clearUser: () => {
        logDebug('Clearing current user');
        setCurrentUser(null);
      },
      simulateError: (error) => {
        logDebug('Simulating error:', error);
        setAuthError(error);
      },
    };
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {authError && <div className="alert alert-danger">{authError}</div>}
            {children}
          </>
        )}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};