import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com';

// Setup axios defaults
const setupAxiosDefaults = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
  setupAxiosDefaults(token);
}

const authService = {
  async register(credentials) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/registration/`, credentials);
      if (response.data?.key) {
        localStorage.setItem('token', response.data.key);
        setupAxiosDefaults(response.data.key);
      }
      return response.data;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/`, credentials);
      if (response.data?.key) {
        localStorage.setItem('token', response.data.key);
        setupAxiosDefaults(response.data.key);
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
      if (!token) {
        throw new Error('No auth token found');
      }
      
      const response = await axios.get(`${API_URL}/api/auth/user/`);
      return response.data;
    } catch (err) {
      console.error('Get current user error:', err);
      throw err;
    }
  },

  async logout() {
    try {
      await axios.post(`${API_URL}/api/auth/logout/`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setupAxiosDefaults(null);
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;