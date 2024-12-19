import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com';

export const axiosReq = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosRes = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosReq.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Important: Don't set Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Add CSRF token if needed
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosRes.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    // Handle 401 Unauthorized
    if (err.response?.status === 401) {
      // Remove token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }

    return Promise.reject(err);
  }
);
