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
    if (error.response?.status === 401) {
      logger.warn('Unauthorized access detected');
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(errorHandler.handleApiError(error));
  }
);

const axiosDefaults = {
  axiosReq,
  axiosRes
};

export default axiosDefaults;