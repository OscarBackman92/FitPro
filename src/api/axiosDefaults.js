import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

// Create axios instances
export const axiosReq = axios.create({
  baseURL: baseURL, // Uses the environment variable for the base URL
});
export const axiosRes = axios.create({
  baseURL: baseURL,
});

const DEBUG = process.env.NODE_ENV === 'development';

const logDebug = (message, data = null) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

// Add request interceptor with debugging
axiosReq.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token'); // Use the correct token key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[DEBUG] Token added to request');
    } else {
      console.log('[DEBUG] No token found, request may fail');
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Add response interceptor with debugging and token refresh
axiosRes.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      logDebug('Attempting token refresh...');
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/token/refresh/`, // Use baseURL for refresh
          {},
          { headers: { 'Content-Type': 'application/json' } }
        );
        const { token } = refreshResponse.data;
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosReq(originalRequest);
      } catch (refreshError) {
        logDebug('Token refresh failed:', refreshError);
        // Clear token and redirect to signin if refresh fails
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

// Export a function to clear the token when signing out
export const clearAuthToken = () => {
  localStorage.removeItem('token');
  window.location.href = '/signin';
  logDebug('Token cleared, redirected to signin');
};
