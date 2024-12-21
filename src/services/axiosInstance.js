import axios from 'axios';
import errorHandler from './errorHandlerService';

// Set the API URL from environment variable or default to a specific URL
const API_URL = process.env.REACT_APP_API_URL || 'https://fitpro1-bc76e0450a19.herokuapp.com/';

// Create an axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10-second timeout
});

// Request interceptor to add authorization token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration and refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            originalRequest.headers.Authorization = `Token ${response.data.access}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // Remove tokens and redirect to signin page on refresh failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signin';
      }
    }

    // Handle errors using error handler
    return Promise.reject(errorHandler.handleApiError(error));
  }
);

export default axiosInstance;
