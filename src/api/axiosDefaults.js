import axios from 'axios';

export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Debug flag based on environment
const DEBUG = process.env.NODE_ENV === 'development';

// Debug logging function
const logDebug = (message, data = null) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

// Add request interceptor with debugging
axiosReq.interceptors.request.use(
  async (config) => {
    logDebug('Request Config:', config);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        logDebug('Token added to request');
      }
    } catch (err) {
      logDebug('Error in request interceptor:', err);
    }
    return config;
  },
  (err) => {
    logDebug('Request interceptor error:', err);
    return Promise.reject(err);
  }
);

// Add response interceptor with debugging
axiosRes.interceptors.response.use(
  (response) => {
    logDebug('Response received:', response);
    return response;
  },
  async (err) => {
    logDebug('Response error:', err);
    const originalRequest = err.config;
    
    if (err.response?.status === 401 && !originalRequest._retry) {
      logDebug('Attempting token refresh...');
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await axios.post('/api/auth/token/refresh/');
        const { token } = refreshResponse.data;
        localStorage.setItem('token', token);
        logDebug('Token refreshed successfully');
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        logDebug('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(err);
  }
);