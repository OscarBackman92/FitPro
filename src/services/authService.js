import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com';

const authService = {
  async register(credentials) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/registration/`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      console.error('Registration API error:', err.response?.data);
      throw err;
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data?.key) {
        localStorage.setItem('token', response.data.key);
      }

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

  async forgotPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/password/reset/`, { email });
      return response.data;
    } catch (err) {
      console.error('Forgot password error:', err);
      throw err;
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/password/reset/confirm/`, {
        token,
        new_password: password,
      });
      return response.data;
    } catch (err) {
      console.error('Reset password error:', err);
      throw err;
    }
  }
};

export default authService;