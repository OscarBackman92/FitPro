import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { axiosReq, axiosRes } from "../services/axiosDefaults";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";
import { logger } from '../services/loggerService';
import toast from "react-hot-toast";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  console.log('CurrentUserProvider: Initializing provider');
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleMount = useCallback(async () => {
    console.log('CurrentUserProvider: Handling mount');
    try {
      const token = localStorage.getItem('token');
      console.log('CurrentUserProvider: Token check', { hasToken: !!token });
      
      if (!token) {
        console.log('CurrentUserProvider: No token found');
        setCurrentUser(null);
        setProfileData(null);
        setIsLoading(false);
        return;
      }

      axiosReq.defaults.headers.Authorization = `Bearer ${token}`;
      axiosRes.defaults.headers.Authorization = `Bearer ${token}`;
      
      console.log('CurrentUserProvider: Getting user data');
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      console.log('CurrentUserProvider: User data received', { data });

      if (data?.profile?.id) {
        console.log('CurrentUserProvider: Getting profile data');
        const profileResponse = await axiosReq.get(`/profiles/${data.profile.id}/`);
        console.log('CurrentUserProvider: Profile data received', { profileData: profileResponse.data });
        
        setCurrentUser(data);
        setProfileData(profileResponse.data);
      } else {
        console.error('CurrentUserProvider: Invalid user data', { data });
        throw new Error('Invalid user data received');
      }
    } catch (err) {
      console.error('CurrentUserProvider: Mount error', { err });
      setCurrentUser(null);
      setProfileData(null);
      localStorage.removeItem('token');
      removeTokenTimestamp();
      toast.error('Session expired. Please sign in again.');
      logger.error('Error mounting current user:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('CurrentUserProvider: Initial mount effect');
    handleMount();
  }, [handleMount]);

  useEffect(() => {
    console.log('CurrentUserProvider: Setting up interceptors');
    
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        console.log('CurrentUserProvider: Request interceptor', { config });
        if (shouldRefreshToken()) {
          console.log('CurrentUserProvider: Refreshing token');
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            console.error('CurrentUserProvider: Token refresh failed', { err });
            setCurrentUser(null);
            setProfileData(null);
            navigate("/signin");
            removeTokenTimestamp();
          }
        }
        return config;
      },
      (err) => {
        console.error('CurrentUserProvider: Request interceptor error', { err });
        return Promise.reject(err);
      }
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        console.log('CurrentUserProvider: Response interceptor error', { err });
        if (err.response?.status === 401) {
          try {
            console.log('CurrentUserProvider: Attempting token refresh');
            await axios.post("/dj-rest-auth/token/refresh/");
            return axios(err.config);
          } catch (refreshErr) {
            console.error('CurrentUserProvider: Token refresh failed', { refreshErr });
            setCurrentUser(null);
            setProfileData(null);
            navigate("/signin");
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      console.log('CurrentUserProvider: Cleaning up interceptors');
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const contextValue = {
    currentUser,
    profileData,
    isLoading
  };

  console.log('CurrentUserProvider: Rendering with context', { contextValue });

  return (
    <CurrentUserContext.Provider value={contextValue}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;