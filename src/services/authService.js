import axiosInstance from './axiosInstance';
import handleApiError from '../utils/errorHandler';

export const register = async (data) => {
  try {
    const response = await axiosInstance.post('/auth/registration/', data);
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw new Error('Registration failed');
  }
};

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login/', credentials);
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
    }
    return response.data;
  } catch (err) {
    handleApiError(err);
    throw new Error('Login failed');
  }
};

const authService = {
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout/');
      localStorage.removeItem('token');
    } catch (err) {
      handleApiError(err);
      throw new Error('Logout failed');
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/user/');
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch current user');
    }
  },
};

export default authService;
