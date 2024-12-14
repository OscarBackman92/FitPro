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

const DEBUG = process.env.NODE_ENV === 'development';

export const CurrentUserProvider = ({ children }) => {
  if (DEBUG) console.info('CurrentUserProvider: Initializing provider');

  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleMount = useCallback(async () => {
    if (DEBUG) console.group('CurrentUserProvider: Mount Process');
    try {
      const token = localStorage.getItem('token');
      if (DEBUG) console.info('Token check:', { hasToken: !!token });

      if (!token) {
        setCurrentUser(null);
        setProfileData(null);
        setIsLoading(false);
        return;
      }

      axiosReq.defaults.headers.Authorization = `Bearer ${token}`;
      axiosRes.defaults.headers.Authorization = `Bearer ${token}`;

      const { data } = await axiosRes.get("dj-rest-auth/user/");
      if (DEBUG) console.info('User data received:', data);

      if (data?.profile?.id) {
        const profileResponse = await axiosReq.get(`/profiles/${data.profile.id}/`);
        if (DEBUG) console.info('Profile data received:', profileResponse.data);

        setCurrentUser(data);
        setProfileData(profileResponse.data);
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (err) {
      logger.error('Error mounting current user:', err);
      setCurrentUser(null);
      setProfileData(null);
      localStorage.removeItem('token');
      removeTokenTimestamp();
      toast.error('Session expired. Please sign in again.');
    } finally {
      setIsLoading(false);
      if (DEBUG) console.groupEnd();
    }
  }, []);

  useEffect(() => {
    if (DEBUG) console.info('CurrentUserProvider: Mounting');
    handleMount();
  }, [handleMount]);

  useEffect(() => {
    if (DEBUG) console.info('CurrentUserProvider: Setting up interceptors');

    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        if (DEBUG) console.info('Request interceptor:', config);
        if (shouldRefreshToken()) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            logger.error('Token refresh failed:', err);
            setCurrentUser(null);
            setProfileData(null);
            navigate("/signin");
            removeTokenTimestamp();
          }
        }
        return config;
      },
      (err) => {
        logger.error('Request interceptor error:', err);
        return Promise.reject(err);
      }
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (DEBUG) console.info('Response interceptor error:', err);
        if (err.response?.status === 401) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            return axios(err.config);
          } catch (refreshErr) {
            logger.error('Token refresh failed:', refreshErr);
            setCurrentUser(null);
            setProfileData(null);
            navigate("/signin");
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      if (DEBUG) console.info('CurrentUserProvider: Cleaning up interceptors');
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const contextValue = {
    currentUser,
    profileData,
    isLoading
  };

  if (DEBUG) console.info('CurrentUserProvider: Rendering with context', { contextValue });

  return (
    <CurrentUserContext.Provider value={contextValue}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
