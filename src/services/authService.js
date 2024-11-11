import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

const login = async (credentials) => {
  try {
    logger.debug('Attempting login', { username: credentials.username });
    const response = await axiosReq.post('/auth/login/', credentials);
    
    // Log response for debugging
    logger.debug('Login response:', response.data);
    
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
      // Get user data after successful login
      const userResponse = await axiosReq.get('/auth/user/');
      return {
        token: response.data.key,
        user: userResponse.data
      };
    }
    throw new Error('Invalid response format');
  } catch (err) {
    logger.error('Login failed:', err);
    throw errorHandler.handleApiError(err, 'Login failed');
  }
};

const register = async (userData) => {
  try {
    logger.debug('Attempting registration', { userData }); // Log user data
    const response = await axiosReq.post('api/auth/registration/', userData);
    return response.data;
  } catch (err) {
    console.error('Registration error:', err); // Log the error
    throw errorHandler.handleApiError(err, 'Registration failed');
  }
};
const logout = async () => {
  try {
    await axiosReq.post('/auth/logout/');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
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