import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { axiosReq, axiosRes } from "../services/axiosDefaults";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";
import toast from "react-hot-toast";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleMount = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('TokenCheck:', { exists: !!token });
  
      if (!token) {
        console.log('No token found in localStorage');
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }
  
      axiosReq.defaults.headers.Authorization = `Bearer ${token}`;
      axiosRes.defaults.headers.Authorization = `Bearer ${token}`;
      
      // Get user data first
      const userResponse = await axiosRes.get("dj-rest-auth/user/");
      const userData = userResponse.data;
      
      // Then get profile using user's ID
      try {
        const profileResponse = await axiosReq.get(`/api/profiles/profiles/${userData.pk}/`);
        userData.profile = profileResponse.data;
      } catch (profileErr) {
        console.warn('Could not load profile:', profileErr);
        // Continue even if profile load fails
      }
      
      setCurrentUser(userData);
    } catch (err) {
      console.error('Error in handleMount:', err);
      setCurrentUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      removeTokenTimestamp();
      toast.error('Session expired. Please sign in again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('CurrentUserProvider mounted');
    handleMount();
  }, [handleMount]);

  useMemo(() => {
    console.log('Setting up interceptors');
    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          console.log('Token refresh needed');
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            console.log('Token refresh successful');
          } catch (err) {
            console.error('Token refresh failed:', err);
            if (currentUser) {
              setCurrentUser(null);
              navigate("/signin");
            }
            removeTokenTimestamp();
          }
        }
        return config;
      },
      (err) => {
        console.error('Request interceptor error:', err);
        return Promise.reject(err);
      }
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        console.log('Response interceptor triggered:', {
          status: err.response?.status,
          url: err.config?.url
        });

        if (err.response?.status === 401) {
          console.log('Handling 401 error');
          try {
            const refreshResponse = await axios.post("/dj-rest-auth/token/refresh/");
            console.log('Token refresh in 401 handler successful');
            if (refreshResponse.data?.access) {
              return axios(err.config);
            }
          } catch (refreshErr) {
            console.error('Token refresh in 401 handler failed:', refreshErr);
            setCurrentUser(null);
            navigate("/signin");
          }
        }
        return Promise.reject(err);
      }
    );
  }, [navigate, currentUser]);

  const contextValue = {
    currentUser,
    isLoading,
  };

  console.log('CurrentUserProvider rendering with:', { currentUser, isLoading });

  return (
    <CurrentUserContext.Provider value={contextValue}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;