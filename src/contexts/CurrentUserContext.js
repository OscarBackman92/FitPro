import {
  React, createContext, useContext, useEffect, useMemo, useState, useCallback
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { axiosReq, axiosRes } from "../services/axiosDefaults";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    removeTokenTimestamp();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) return false;

      const { data } = await axios.post("/dj-rest-auth/token/refresh/", {
        refresh: refresh
      });
      localStorage.setItem('access_token', data.access);
      return true;
    } catch (err) {
      return false;
    }
  }, []);

  const handleMount = useCallback(async () => {
    try {
      let token = localStorage.getItem('access_token');
      
      // If no access token or it needs refresh, try to refresh
      if (!token || shouldRefreshToken()) {
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          handleLogout();
          setInitialized(true);
          return;
        }
        token = localStorage.getItem('access_token');
      }

      // Try to get user data with the token
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      handleLogout();
    } finally {
      setInitialized(true);
    }
  }, [handleLogout, refreshToken]);

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  useEffect(() => {
    if (initialized) {
      const token = localStorage.getItem('access_token');
      const isAuthPage = ['/signin', '/signup'].includes(window.location.pathname);
      
      if (!token && !isAuthPage) {
        navigate("/signin");
      }
    }
  }, [initialized, navigate]);

  useMemo(() => {
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (shouldRefreshToken()) {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            const newToken = localStorage.getItem('access_token');
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            const newToken = localStorage.getItem('access_token');
            err.config.headers.Authorization = `Bearer ${newToken}`;
            return axios(err.config);
          } else {
            handleLogout();
            navigate("/signin");
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, refreshToken, handleLogout]);

  const contextValue = useMemo(() => ({
    currentUser,
    setCurrentUser,
  }), [currentUser]);

  return (
    <CurrentUserContext.Provider value={contextValue}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};