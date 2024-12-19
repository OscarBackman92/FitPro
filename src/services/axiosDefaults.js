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
    console.log('axiosDefaults: Request interceptor called', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data instanceof FormData ? '[FormData]' : config.data,
      params: config.params,
      headers: config.headers
    });

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
    console.error('axiosDefaults: Request interceptor error:', err);
    return Promise.reject(err);
  }
);

axiosRes.interceptors.response.use(
  (response) => {
    console.log('axiosDefaults: Response received', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (err) => {
    console.error('axiosDefaults: Response error:', {
      status: err.response?.status,
      url: err.config?.url,
      data: err.response?.data
    });

    // Handle 401 Unauthorized
    if (err.response?.status === 401) {
      // Remove token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }

    return Promise.reject(err);
  }
);