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

// Function to get the access token from local storage
const getAccessToken = () => localStorage.getItem('access_token');

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        logDebug('Fetching current user...');
        const token = getAccessToken();
        logDebug('Current token:', token);
        const { data } = await axiosReq.get('/auth/user/');
        setCurrentUser(data);
        logDebug('Current user fetched:', data);
      } catch (err) {
        logDebug('Error fetching current user:', err);
        setAuthError(err.response?.data?.detail || 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    const token = getAccessToken();
    if (token) {
      fetchCurrentUser();
    } else {
      logDebug('No token found, skipping user fetch');
      setIsLoading(false);
    }
  }, []);

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
