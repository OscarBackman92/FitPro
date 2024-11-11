// src/services/axiosDefaults.js
import axios from 'axios';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

// Updated to use environment variable with new API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:8000/';

// Create axios instances
export const axiosReq = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Added to handle CSRF tokens
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

    // Added CSRF token handling for Django
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    // Added specific handling for multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
          // Updated to use Django REST token refresh endpoint
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

    // Handle Django specific error responses
    if (error.response?.data) {
      // Transform Django REST framework error format
      if (typeof error.response.data === 'object') {
        const djangoErrors = error.response.data;
        const transformedErrors = {};
        
        Object.keys(djangoErrors).forEach(key => {
          if (Array.isArray(djangoErrors[key])) {
            transformedErrors[key] = djangoErrors[key][0];
          } else {
            transformedErrors[key] = djangoErrors[key];
          }
        });
        
        error.response.data = transformedErrors;
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      logger.warn('Rate limit exceeded');
    }

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