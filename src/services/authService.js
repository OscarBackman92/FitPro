import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com';

const authService = {
  async register(credentials) {
    try {
      console.log('Registration payload:', credentials);
      const response = await axios.post(`${API_URL}/api/auth/registration/`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data?.key) {
        localStorage.setItem('token', response.data.key);
      }

      return response.data;
    } catch (err) {
      console.error('Registration API error:', err.response?.data);
      throw err;
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/`, credentials);
      if (response.data?.key) {
        localStorage.setItem('token', response.data.key);
      }
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/auth/user/`, {
        headers: {
          Authorization: `Token ${token}`,
        }
      });
      return response.data;
    } catch (err) {
      console.error('Get user error:', err);
      throw err;
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/auth/logout/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        }
      });
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('token');
      throw err;
    }
  }
};

export default authService;