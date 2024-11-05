import axios from "axios";

const BASE_URL = "https://fitnessapi-d773a1148384.herokuapp.com";

// Set up axios defaults
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Create axios instances
export const axiosReq = axios.create();
export const axiosAuth = axios.create();

// Configure request interceptor
axiosReq.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// Debug interceptors for development
if (process.env.NODE_ENV === 'development') {
  axios.interceptors.request.use(
    (config) => {
      console.log('Request:', config.method, config.url);
      return config;
    },
    (error) => {
      console.log('Request Error:', error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      console.log('Response:', response.status);
      return response;
    },
    (error) => {
      console.log('Response Error:', error.response?.status);
      return Promise.reject(error);
    }
  );
}

export default axios;