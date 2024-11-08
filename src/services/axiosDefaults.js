// src/services/axiosDefaults.js
import axios from 'axios';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

const API_URL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com/api';

// Create axios instances
export const axiosReq = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000
});

export const axiosRes = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000
});

// Request interceptor
axiosReq.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
      logger.debug('Added auth token to request', {
        url: config.url,
        method: config.method
      });
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (error) => {
    logger.error('Request interceptor error:', error);
    return Promise.reject(errorHandler.handleApiError(error));
  }
);

// Response interceptor
axiosRes.interceptors.response.use(
  (response) => {
    logger.debug('Response received:', { 
      url: response.config.url,
      status: response.status,
      method: response.config.method
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          logger.debug('Attempting to refresh token');
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            axiosReq.defaults.headers.common['Authorization'] = `Token ${response.data.access}`;
            logger.info('Token refreshed successfully');
            return axiosReq(originalRequest);
          }
        }
      } catch (refreshError) {
        logger.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signin';
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      logger.warn('Rate limit exceeded');
    }

    // Log all API errors
    logger.error('API Error:', {
      url: originalRequest.url,
      method: originalRequest.method,
      status: error.response?.status,
      data: error.response?.data
    });

    return Promise.reject(errorHandler.handleApiError(error));
  }
);

// Add default error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection:', event.reason);
  if (event.reason.isAxiosError) {
    errorHandler.handleApiError(event.reason);
  }
});

const axiosDefaults = {
  axiosReq,
  axiosRes,
  API_URL
};

export default axiosDefaults;