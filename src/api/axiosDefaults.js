import axios from "axios";

const baseURL = "https://fitnessapi-d773a1148384.herokuapp.com/api";

// Create instances with default config
const axiosAuth = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

const axiosReq = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000
});

// Request interceptor for API calls
axiosReq.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosReq.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosAuth.post('/auth/token/refresh/');
        if (response.data.key) {
          localStorage.setItem('token', response.data.key);
          axios.defaults.headers.common['Authorization'] = `Token ${response.data.key}`;
          return axiosReq(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  [axiosReq, axiosAuth].forEach(instance => {
    instance.interceptors.request.use(request => {
      console.group(`🌐 API Request: ${request.method.toUpperCase()} ${request.url}`);
      console.log('Headers:', request.headers);
      if (request.data) {
        console.log('Data:', request.data);
      }
      console.groupEnd();
      return request;
    });

    instance.interceptors.response.use(
      response => {
        console.group(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`);
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        console.groupEnd();
        return response;
      },
      error => {
        console.group(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
        console.log('Error:', error.message);
        console.groupEnd();
        return Promise.reject(error);
      }
    );
  });
}

export { axiosAuth, axiosReq };