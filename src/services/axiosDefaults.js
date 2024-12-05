import axios from 'axios';
import logger from './loggerService';

const baseURL = process.env.REACT_APP_API_URL || 'https://fitpro1-bc76e0450a19.herokuapp.com/';

export const axiosReq = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const axiosRes = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosReq.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
      return config;
    } catch (err) {
      logger.error('Request interceptor error:', err);
      return Promise.reject(err);
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosRes.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshTokenTimestamp');
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);