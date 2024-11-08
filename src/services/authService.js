// src/services/authService.js
import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

export const login = async (credentials) => {
  try {
    logger.debug('Attempting login', { username: credentials.username });
    const response = await axiosReq.post('/api/auth/login/', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      axiosReq.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      logger.info('Login successful');
    }
    
    return response.data;
  } catch (err) {
    throw errorHandler.handleApiError(err, 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    logger.debug('Attempting registration', { username: userData.username });
    const response = await axiosReq.post('/api/auth/registration/', {
      ...userData,
      password1: userData.password,
      password2: userData.password_confirm
    });
    logger.info('Registration successful');
    return response.data;
  } catch (err) {
    throw errorHandler.handleApiError(err, 'Registration failed');
  }
};

export const logout = async () => {
  try {
    await axiosReq.post('/api/auth/logout/');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axiosReq.defaults.headers.common['Authorization'];
    logger.info('Logout successful');
  } catch (err) {
    throw errorHandler.handleApiError(err, 'Logout failed');
  }
};

const getCurrentUser = async () => {
  try {
    const response = await axiosReq.get('/api/auth/user/');
    logger.debug('Current user fetched');
    return response.data;
  } catch (err) {
    throw errorHandler.handleApiError(err, 'Failed to fetch current user');
  }
};

const setAuthHeader = (token) => {
  if (token) {
    axiosReq.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete axiosReq.defaults.headers.common['Authorization'];
  }
};

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axiosReq.post('/api/auth/token/refresh/', {
      refresh: refreshToken
    });

    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      axiosReq.defaults.headers.common['Authorization'] = `Token ${response.data.access}`;
      logger.info('Token refreshed successfully');
    }
    return response.data;
  } catch (err) {
    throw errorHandler.handleApiError(err, 'Token refresh failed');
  }
};

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  setAuthHeader,
  refreshToken,
  isAuthenticated
};

export default authService;