import axios from 'axios';

const API_URL = 'https://fitpro1-bc76e0450a19.herokuapp.com/';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('dj-rest-auth/registration/', {
        username: userData.username,
        email: userData.email,
        password1: userData.password1,
        password2: userData.password2
      });

      // If you need to automatically log in after registration
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('dj-rest-auth/login/', credentials);
      const data = response.data;
      
      // Store the token
      if (data.access) {
        localStorage.setItem('token', data.access);
        // Store refresh token if available
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Login API error:', error.response?.data);
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('dj-rest-auth/logout/');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove the token even if the request fails
      localStorage.removeItem('token');
      throw error;
    }
  }
};