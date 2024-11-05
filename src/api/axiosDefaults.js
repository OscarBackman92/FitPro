import axios from "axios";

const baseURL = "https://fitnessapi-d773a1148384.herokuapp.com/api";

const axiosAuth = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000
});

const axiosReq = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000
});

// Request interceptor
axiosAuth.interceptors.request.use((config) => {
  // Don't set content type for FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  config.headers['Accept'] = 'application/json';
  return config;
});

// Add token to authenticated requests
axiosReq.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  [axiosReq, axiosAuth].forEach(instance => {
    instance.interceptors.request.use(
      request => {
        const logData = request.data instanceof FormData
          ? Object.fromEntries(request.data)
          : request.data;

        console.group(`🌐 API Request: ${request.method.toUpperCase()} ${request.url}`);
        console.log('Headers:', request.headers);
        if (logData) {
          const safeLogData = { ...logData };
          if (safeLogData.password1) safeLogData.password1 = '[FILTERED]';
          if (safeLogData.password2) safeLogData.password2 = '[FILTERED]';
          if (safeLogData.password) safeLogData.password = '[FILTERED]';
          console.log('Data:', safeLogData);
        }
        console.groupEnd();
        return request;
      },
      error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      response => {
        console.group(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`);
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        console.log('Headers:', response.headers);
        console.groupEnd();
        return response;
      },
      error => {
        console.group(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
        console.log('Error:', error.message);
        console.log('Full error:', {
          config: error.config,
          response: error.response,
          message: error.message
        });
        console.groupEnd();
        return Promise.reject(error);
      }
    );
  });
}

export { axiosAuth, axiosReq };