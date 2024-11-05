import { axiosAuth, axiosReq } from '../api/axiosDefaults';

class ApiError extends Error {
  constructor(message, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }
}

export const apiService = {
  register: async (userData) => {
    try {
      const formData = new FormData();
      formData.append('username', userData.username.trim());
      formData.append('email', userData.email.trim());
      formData.append('password1', userData.password1);
      formData.append('password2', userData.password2);

      console.log('Attempting registration with:', {
        url: '/auth/registration/',
        data: {
          username: userData.username.trim(),
          email: userData.email.trim(),
          password1: '[FILTERED]',
          password2: '[FILTERED]'
        }
      });

      const { data } = await axiosAuth.post('/auth/registration/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return data;
    } catch (err) {
      console.error('Registration error response:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });

      switch (err.response?.status) {
        case 400:
          throw new ApiError('Validation Error', err.response.data);
        case 500:
          throw new ApiError('Server Error', {
            non_field_errors: ['The registration service is temporarily unavailable. Please try again later.']
          });
        default:
          throw new ApiError(
            'Registration Failed',
            { non_field_errors: ['An unexpected error occurred. Please try again.'] }
          );
      }
    }
  },

  login: async (credentials) => {
    try {
      const { data } = await axiosAuth.post('/auth/login/', credentials);
      if (data.key) {
        localStorage.setItem('token', data.key);
        axiosReq.defaults.headers.common['Authorization'] = `Token ${data.key}`;
      }
      return data;
    } catch (err) {
      throw new ApiError('Login failed', err.response?.data);
    }
  },

  logout: async () => {
    try {
      await axiosAuth.post('/auth/logout/');
      localStorage.removeItem('token');
      delete axiosReq.defaults.headers.common['Authorization'];
    } catch (err) {
      throw new ApiError('Logout failed', err.response?.data);
    }
  },

  getCurrentUser: async () => {
    try {
      const { data } = await axiosReq.get('/profiles/me/');
      return data;
    } catch (err) {
      throw new ApiError('Failed to fetch current user', err.response?.data);
    }
  },

  refreshToken: async () => {
    try {
      const { data } = await axiosAuth.post('/auth/token/refresh/');
      if (data.key) {
        localStorage.setItem('token', data.key);
        axiosReq.defaults.headers.common['Authorization'] = `Token ${data.key}`;
      }
      return data;
    } catch (err) {
      throw new ApiError('Failed to refresh token', err.response?.data);
    }
  }
};

export default apiService;