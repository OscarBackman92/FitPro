import axios from 'axios';

// Base URL for the API
const baseURL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com/api';

// Functions to manage tokens
const getAccessToken = () => localStorage.getItem('token');
const removeTokens = () => {
    localStorage.removeItem('token');
};

// Logging function for debugging
const logDebug = (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[DEBUG] ${message}`, data || '');
    }
};

// Create axios instances
export const axiosReq = axios.create({ baseURL });
export const axiosRes = axios.create({ baseURL });

// Request interceptor
axiosReq.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            // Add "Token" prefix to authentication header
            config.headers.Authorization = `Token ${token}`;
            logDebug('Token added to request:', `Token ${token}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosRes.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error
            logDebug('Unauthorized error detected');
            removeTokens();
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

// Function to clear auth tokens and redirect
export const clearAuthTokens = () => {
    removeTokens();
    window.location.href = '/signin';
};