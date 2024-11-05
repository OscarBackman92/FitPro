import axios from 'axios';

// Base URL for the API
const baseURL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com/api';

// Functions to manage access tokens
const getAccessToken = () => localStorage.getItem('access_token');
const setAccessToken = (token) => localStorage.setItem('access_token', token);
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Logging function for debugging
const logDebug = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

// Create axios instances for requests and responses
export const axiosReq = axios.create({ baseURL });
export const axiosRes = axios.create({ baseURL });

// Request interceptor to include the access token in requests
axiosReq.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      logDebug('Token added to request');
    } else {
      logDebug('No token found, request may fail');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and token refresh
axiosRes.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized responses
    if (error.response?.status === 401 && !originalRequest._retry) {
      logDebug('Attempting token refresh...');
      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token
        const refreshResponse = await axios.post(
          `${baseURL}/auth/token/refresh/`,
          {},
          { headers: { 'Content-Type': 'application/json' } }
        );

        // Update the access token in local storage
        const { access_token } = refreshResponse.data;
        setAccessToken(access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Retry the original request with the new token
        return axiosReq(originalRequest);
      } catch (refreshError) {
        logDebug('Token refresh failed', refreshError);
        clearTokens();
        window.location.href = '/signin'; // Redirect to sign-in on failure
      }
    }

    return Promise.reject(error);
  }
);

// Function to clear authentication tokens
export const clearAuthToken = () => {
  clearTokens();
  window.location.href = '/signin'; // Redirect to sign-in
  logDebug('Tokens cleared, redirected to sign-in');
};
