import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { axiosReq, axiosRes } from "../services/axiosDefaults";
import toast from 'react-hot-toast';

const CurrentUserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  isLoading: true,
  isAuthenticated: false
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
  const navigate = useNavigate();

  const handleMount = async () => {
    try {
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Set the token in axios headers
      axiosReq.defaults.headers.common["Authorization"] = `Token ${token}`;
      axiosRes.defaults.headers.common["Authorization"] = `Token ${token}`;

      // Try to get user data
      const { data } = await axiosRes.get("api/auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    // Request interceptor
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Token ${token}`;
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    // Response interceptor
    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        // Handle 401 unauthorized errors
        if (err.response?.status === 401) {
          try {
            // Try to refresh token
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post("/api/auth/token/refresh/", {
              refresh: refreshToken
            });

            if (response.data.access) {
              // Save new token
              localStorage.setItem('token', response.data.access);
              
              // Update axios headers
              axiosReq.defaults.headers.common["Authorization"] = `Token ${response.data.access}`;
              axiosRes.defaults.headers.common["Authorization"] = `Token ${response.data.access}`;

              // Retry the original request
              const originalRequest = err.config;
              originalRequest.headers["Authorization"] = `Token ${response.data.access}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Only clear user and redirect if refresh token is invalid
            if (refreshError.response?.status === 401) {
              // Clear tokens and user data
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              setCurrentUser(null);
              
              // Redirect to login only if user was previously logged in
              if (currentUser) {
                toast.error('Session expired. Please sign in again.');
                navigate('/signin');
              }
            }
          }
        }
        return Promise.reject(err);
      }
    );

    // Cleanup function
    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, currentUser]);

  return (
    <CurrentUserContext.Provider 
      value={{
        currentUser,
        setCurrentUser,
        isLoading,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;