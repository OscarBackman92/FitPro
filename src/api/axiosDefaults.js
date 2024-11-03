import axios from "axios";

// Set up axios defaults
axios.defaults.baseURL = "https://fitnessapi-d773a1148384.herokuapp.com";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Add token from localStorage if it exists
const token = localStorage.getItem("token");
if (token) {
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
}

// Debug interceptor
axios.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.log('Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.log('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Add interceptors to created instances
axiosReq.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Token ${token}`;
      }
      return config;
    } catch (err) {
      return config;
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);