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
      data: config.data,
      params: config.params
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    // Remove default Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
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

    if (err.response?.status === 401) {
      console.log('axiosDefaults: Attempting token refresh');
      try {
        const response = await axios.post(`${BASE_URL}/api/auth/token/refresh/`);
        console.log('axiosDefaults: Token refresh successful');
        
        if (response.data.access) {
          localStorage.setItem('token', response.data.access);
          return axios(err.config);
        }
      } catch (refreshError) {
        console.error('axiosDefaults: Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(err);
  }
);