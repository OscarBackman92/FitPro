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
      console.log('Registration attempt:', userData);
      const response = await api.post('dj-rest-auth/registration/', userData);
      console.log('Registration success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error.response?.data);
      throw error;
    }
  },

  async login(credentials) {
    const response = await api.post('dj-rest-auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
    }
    return response.data;
  },

  async logout() {
    await api.post('dj-rest-auth/logout/');
    localStorage.removeItem('token');
  }
};