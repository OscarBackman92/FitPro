import { axiosReq, axiosAuth } from '../api/axiosDefaults';

export const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const { data } = await axiosAuth.post('/auth/login/', credentials);
      // Store the token
      if (data.key) {
        localStorage.setItem('token', data.key);
        axiosReq.defaults.headers.common['Authorization'] = `Token ${data.key}`;
      }
      return data;
    } catch (err) {
      console.error('Login error:', err.response?.data);
      throw err.response?.data || { detail: 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      const registrationData = {
        username: userData.username,
        email: userData.email,
        password1: userData.password1,
        password2: userData.password2
      };

      const { data } = await axiosAuth.post('/auth/registration/', registrationData);
      return data;
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      throw err.response?.data || { detail: 'Registration failed' };
    }
  },

  logout: async () => {
    try {
      await axiosAuth.post('/auth/logout/');
      localStorage.removeItem('token');
      delete axiosReq.defaults.headers.common['Authorization'];
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data } = await axiosReq.get('/profiles/me/');
      return data;
    } catch (err) {
      console.error('Get current user error:', err);
      throw err;
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
      console.error('Token refresh error:', err);
      throw err;
    }
  },

  // Profile endpoints
  getProfile: async (id) => {
    try {
      const { data } = await axiosReq.get(`/profiles/${id}/`);
      return data;
    } catch (err) {
      console.error('Get profile error:', err);
      throw err;
    }
  },

  updateProfile: async (id, profileData) => {
    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, profileData);
      return data;
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  },

  // Workout endpoints
  getWorkouts: async (params) => {
    try {
      const { data } = await axiosReq.get('/workouts/workouts/', { params });
      return data;
    } catch (err) {
      console.error('Get workouts error:', err);
      throw err;
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const { data } = await axiosReq.post('/workouts/workouts/', workoutData);
      return data;
    } catch (err) {
      console.error('Create workout error:', err);
      throw err;
    }
  },

  updateWorkout: async (id, workoutData) => {
    try {
      const { data } = await axiosReq.put(`/workouts/workouts/${id}/`, workoutData);
      return data;
    } catch (err) {
      console.error('Update workout error:', err);
      throw err;
    }
  },

  deleteWorkout: async (id) => {
    try {
      await axiosReq.delete(`/workouts/workouts/${id}/`);
    } catch (err) {
      console.error('Delete workout error:', err);
      throw err;
    }
  },

  // Social features
  getLikes: async () => {
    try {
      const { data } = await axiosReq.get('/likes/');
      return data;
    } catch (err) {
      console.error('Get likes error:', err);
      throw err;
    }
  },

  createLike: async (workoutId) => {
    try {
      const { data } = await axiosReq.post('/likes/', { workout: workoutId });
      return data;
    } catch (err) {
      console.error('Create like error:', err);
      throw err;
    }
  },

  deleteLike: async (likeId) => {
    try {
      await axiosReq.delete(`/likes/${likeId}/`);
    } catch (err) {
      console.error('Delete like error:', err);
      throw err;
    }
  },

  getComments: async (workoutId) => {
    try {
      const { data } = await axiosReq.get(`/comments/?workout=${workoutId}`);
      return data;
    } catch (err) {
      console.error('Get comments error:', err);
      throw err;
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
      console.error('Create comment error:', err);
      throw err;
    }
  },

  deleteComment: async (commentId) => {
    try {
      await axiosReq.delete(`/comments/${commentId}/`);
    } catch (err) {
      console.error('Delete comment error:', err);
      throw err;
    }
  },

  // Utils
  handleError: (error) => {
    console.error('API Error:', error);
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data || 
                        error.message || 
                        'An error occurred';
    return { error: errorMessage };
  }
};

export default apiService;