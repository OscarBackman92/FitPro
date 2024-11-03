import axios from "axios";

// Set up axios defaults
axios.defaults.baseURL = "https://fitnessapi-d773a1148384.herokuapp.com";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Configure request interceptor for authorization
axiosReq.interceptors.request.use(
  async (config) => {
    // Add token for authenticated requests
    const token = localStorage.getItem("token");
    if (token && !config.url.endsWith('login/') && !config.url.endsWith('register/')) {
      config.headers["Authorization"] = `Token ${token}`;
    }

    // Set Content-Type based on the request
    if (config.method === 'post' && config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// Debug interceptors
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