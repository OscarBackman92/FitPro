import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com';

// Create an axios instance for auth requests
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authService = {
  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
      // Set token for both axios instances
      authAxios.defaults.headers.common['Authorization'] = `Token ${token}`;
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
    }
  },

  clearToken() {
    localStorage.removeItem('token');
    // Clear token from both axios instances
    delete authAxios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
  },

  async login(credentials) {
    try {
      const response = await authAxios.post('/api/auth/login/', credentials);
      
      if (response.data?.key) {
        this.setToken(response.data.key);
        return response.data;
      }
      throw new Error('No authentication token received');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    }
  },

  async getCurrentUser() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await authAxios.get('/api/auth/user/');
      return response.data;
    } catch (err) {
      console.error('Get user error:', err.response?.data || err.message);
      // Clear token on 401 errors
      if (err.response?.status === 401) {
        this.clearToken();
      }
      throw err;
    }
  },

  async logout() {
    const token = this.getToken();
    try {
      if (token) {
        await authAxios.post('/api/auth/logout/');
      }
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
    } finally {
      this.clearToken();
    }
  }
};

// Add request interceptor to automatically add token
authAxios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authService;