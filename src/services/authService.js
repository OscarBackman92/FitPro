// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com';

export const authService = {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      console.error('Login API error:', err.response?.data);
      throw err;
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/auth/user/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      console.error('Get user error:', err.response?.data);
      throw err;
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/auth/logout/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
        withCredentials: true,
      });
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('token');
      throw err;
    }
  },
};

export default authService;