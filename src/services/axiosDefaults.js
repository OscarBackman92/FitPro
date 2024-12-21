import axios from 'axios';

// Base URL for the API, can be set via environment variable or default to a specific URL
const BASE_URL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com';

// Create an axios instance for making requests
export const axiosReq = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include credentials (cookies) with requests
});

// Create another axios instance for handling responses
export const axiosRes = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include credentials (cookies) with requests
});

// Request interceptor for axiosReq instance
axiosReq.interceptors.request.use(
  async (config) => {
    // Get token from local storage
    const token = localStorage.getItem('token');
    if (token) {
      // Set Authorization header if token exists
      config.headers.Authorization = `Token ${token}`;
    }

    // Set Content-Type to application/json if data is not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Add CSRF token if available
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (err) => {
    // Handle request error
    return Promise.reject(err);
  }
);

// Response interceptor for axiosRes instance
axiosRes.interceptors.response.use(
  (response) => {
    // Return response if successful
    return response;
  },
  async (err) => {
    // Handle 401 Unauthorized error
    if (err.response?.status === 401) {
      // Remove token from local storage and redirect to login page
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }

    // Reject promise with error
    return Promise.reject(err);
  }
);
