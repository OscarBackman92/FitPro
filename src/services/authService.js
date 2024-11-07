// src/services/authService.js
import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

// Auth service functions
const login = async (credentials) => {
  try {
    logger.debug('Attempting login', { username: credentials.username });
    const response = await axiosReq.post('/auth/login/', credentials);
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
    }
    return response.data;
  } catch (err) {
    throw errorHandler.handleApiError(err, 'Login failed');
  }
};

const register = async (userData) => {
  try {
    logger.debug('Attempting registration', { username: userData.username });
    const response = await axiosReq.post('/auth/registration/', userData);
    return response.data;
  } catch (err) {
    throw errorHandler.handleApiError(err, 'Registration failed');
  }
};

const logout = async () => {
  try {
    await axiosReq.post('/auth/logout/');
    localStorage.removeItem('token');
  } catch (err) {
    throw errorHandler.handleApiError(err, 'Logout failed');
  }
};

const getCurrentUser = async () => {
  try {
    const response = await axiosReq.get('/auth/user/');
    return response.data;
  } catch (err) {
    throw errorHandler.handleApiError(err, 'Failed to fetch current user');
  }
};

export const authService = {
  login,
  register,
  logout,
  getCurrentUser
};

// Export both named and default
export { login, register, logout, getCurrentUser };
export default authService;