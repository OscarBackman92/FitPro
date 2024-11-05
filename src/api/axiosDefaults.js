import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;


const getAccessToken = () => localStorage.getItem('access_token');
const setAccessToken = (token) => localStorage.setItem('access_token', token);
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

const logDebug = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

export const axiosReq = axios.create({ baseURL });
export const axiosRes = axios.create({ baseURL });

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

axiosRes.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      logDebug('Attempting token refresh...');
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/token/refresh/`,
          {},
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { access_token } = refreshResponse.data;
        setAccessToken(access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        return axiosReq(originalRequest);
      } catch (refreshError) {
        logDebug('Token refresh failed', refreshError);
        clearTokens();
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  }
);

export const clearAuthToken = () => {
  clearTokens();
  window.location.href = '/signin';
  logDebug('Tokens cleared, redirected to sign-in');
};
