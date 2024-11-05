import { axiosAuth, axiosReq } from '../api/axiosDefaults';

class ApiError extends Error {
  constructor(message, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }
}

export const apiService = {
  // Auth endpoints
  register: async (userData) => {
    try {
      const formData = {
        username: userData.username.trim(),
        email: userData.email.trim(),
        password1: userData.password1,
        password2: userData.password2
      };

      const { data } = await axiosAuth.post('/auth/register/', formData);
      return data;
    } catch (err) {
      if (err.response?.status === 500) {
        throw new ApiError('Server Error', {
          non_field_errors: ['An error occurred on the server. Please try again later.']
        });
      }
      throw new ApiError(
        err.response?.data?.detail || 'Registration failed',
        err.response?.data || { non_field_errors: ['An error occurred during registration. Please try again.'] }
      );
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
      throw new ApiError(
        err.response?.data?.detail || 'Login failed',
        err.response?.data
      );
    }
  },

  logout: async () => {
    try {
      await axiosAuth.post('/auth/logout/');
      localStorage.removeItem('token');
      delete axiosReq.defaults.headers.common['Authorization'];
    } catch (err) {
      console.error('Logout error:', err);
      throw new ApiError('Failed to logout', err.response?.data);
    }
  },

  getCurrentUser: async () => {
    try {
      const { data } = await axiosReq.get('/profiles/me/');
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to fetch user',
        err.response?.data
      );
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
      throw new ApiError(
        'Failed to refresh token',
        err.response?.data
      );
    }
  },

  getProfile: async (id) => {
    try {
      const { data } = await axiosReq.get(`/profiles/${id}/`);
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to fetch profile',
        err.response?.data
      );
    }
  },

  updateProfile: async (id, profileData) => {
    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, profileData);
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to update profile',
        err.response?.data
      );
    }
  },

  getWorkouts: async (params = {}) => {
    try {
      const { data } = await axiosReq.get('/workouts/workouts/', { params });
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to fetch workouts',
        err.response?.data
      );
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const { data } = await axiosReq.post('/workouts/workouts/', workoutData);
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to create workout',
        err.response?.data
      );
    }
  },

  updateWorkout: async (id, workoutData) => {
    try {
      const { data } = await axiosReq.put(`/workouts/workouts/${id}/`, workoutData);
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to update workout',
        err.response?.data
      );
    }
  },

  deleteWorkout: async (id) => {
    try {
      await axiosReq.delete(`/workouts/workouts/${id}/`);
    } catch (err) {
      throw new ApiError(
        'Failed to delete workout',
        err.response?.data
      );
    }
  },

  getLikes: async () => {
    try {
      const { data } = await axiosReq.get('/likes/');
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to fetch likes',
        err.response?.data
      );
    }
  },

  createLike: async (workoutId) => {
    try {
      const { data } = await axiosReq.post('/likes/', { workout: workoutId });
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to like workout',
        err.response?.data
      );
    }
  },

  deleteLike: async (likeId) => {
    try {
      await axiosReq.delete(`/likes/${likeId}/`);
    } catch (err) {
      throw new ApiError(
        'Failed to unlike workout',
        err.response?.data
      );
    }
  },

  getComments: async (workoutId) => {
    try {
      const { data } = await axiosReq.get(`/comments/?workout=${workoutId}`);
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to fetch comments',
        err.response?.data
      );
    }
  },

  createComment: async (workoutId, content) => {
    try {
      const { data } = await axiosReq.post('/comments/', {
        workout: workoutId,
        content,
      });
      return data;
    } catch (err) {
      throw new ApiError(
        'Failed to create comment',
        err.response?.data
      );
    }
  },

  deleteComment: async (commentId) => {
    try {
      await axiosReq.delete(`/comments/${commentId}/`);
    } catch (err) {
      throw new ApiError(
        'Failed to delete comment',
        err.response?.data
      );
    }
  }
};

export default apiService;