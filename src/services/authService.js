// src/services/authService.js
import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class AuthService {
  async login(credentials) {
    try {
      logger.debug('Attempting login', { username: credentials.username });
      const response = await axiosReq.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        this.setAuthHeader(response.data.token);
        logger.info('Login successful');
      }
      
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Login failed');
    }
  }

  async register(userData) {
    try {
      logger.debug('Attempting registration', { username: userData.username });
      const response = await axiosReq.post('/auth/registration/', userData);
      logger.info('Registration successful');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Registration failed');
    }
  }

  async logout() {
    try {
      await axiosReq.post('/auth/logout/');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete axiosReq.defaults.headers.common['Authorization'];
      logger.info('Logout successful');
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Logout failed');
    }
  }

  async getCurrentUser() {
    try {
      const response = await axiosReq.get('/auth/user/');
      logger.debug('Current user fetched');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch current user');
    }
  }

  async updatePassword(passwordData) {
    try {
      logger.debug('Attempting password update');
      const response = await axiosReq.post('/auth/password/change/', passwordData);
      logger.info('Password updated successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Password update failed');
    }
  }

  async requestPasswordReset(email) {
    try {
      logger.debug('Requesting password reset', { email });
      const response = await axiosReq.post('/auth/password/reset/', { email });
      logger.info('Password reset requested');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Password reset request failed');
    }
  }

  async resetPassword(resetData) {
    try {
      logger.debug('Resetting password');
      const response = await axiosReq.post('/auth/password/reset/confirm/', resetData);
      logger.info('Password reset successful');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Password reset failed');
    }
  }

  async verifyEmail(key) {
    try {
      logger.debug('Verifying email');
      const response = await axiosReq.post('/auth/registration/verify-email/', { key });
      logger.info('Email verification successful');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Email verification failed');
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axiosReq.post('/auth/token/refresh/', {
        refresh: refreshToken
      });

      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        this.setAuthHeader(response.data.access);
        logger.info('Token refreshed successfully');
      }

      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Token refresh failed');
    }
  }

  setAuthHeader(token) {
    if (token) {
      axiosReq.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      delete axiosReq.defaults.headers.common['Authorization'];
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Token ${token}` } : {};
  }

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axiosReq.defaults.headers.common['Authorization'];
    logger.info('Auth cleared');
  }
}

export const authService = new AuthService();
export const register = authService.register.bind(authService);
export const login = authService.login.bind(authService);
export default authService;