import axios from 'axios';
import { setTokenTimestamp } from '../utils/utils';

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
      const response = await api.post('dj-rest-auth/registration/', userData);
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setTokenTimestamp(response.data);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(credentials) {
    const response = await api.post('dj-rest-auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setTokenTimestamp(response.data);
    }
    return response.data;
  },

  async logout() {
    await api.post('dj-rest-auth/logout/');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('refreshTokenTimestamp');
  }
};