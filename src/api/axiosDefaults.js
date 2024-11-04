import axios from "axios";

const baseURL = "https://fitnessapi-d773a1148384.herokuapp.com/api";

// Create auth-specific instance
export const axiosAuth = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Regular instances
export const axiosReq = axios.create({
  baseURL,
  withCredentials: true
});

export const axiosRes = axios.create({
  baseURL,
  withCredentials: true
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  [axiosReq, axiosAuth].forEach(instance => {
    instance.interceptors.request.use(request => {
      console.log('Request:', {
        url: request.url,
        method: request.method,
        data: request.data,
        headers: request.headers
      });
      return request;
    });

    instance.interceptors.response.use(
      response => {
        console.log('Response:', response);
        return response;
      },
      error => {
        console.log('Error:', error.response || error);
        return Promise.reject(error);
      }
    );
  });
}