import { axiosReq, axiosRes } from './axiosDefaults';

export const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const { data } = await axiosRes.post('/api/auth/login/', credentials);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const { data } = await axiosRes.post('/api/auth/register/', userData);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Registration failed');
    }
  },

  logout: async () => {
    try {
      await axiosRes.post('/api/auth/logout/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  },

  // Profile endpoints
  getProfile: async (id) => {
    try {
      const { data } = await axiosReq.get(id ? `/api/profiles/${id}/` : '/api/profiles/me/');
      return data;
    } catch (err) {
      throw new Error('Failed to fetch profile');
    }
  },

  updateProfile: async (id, profileData) => {
    try {
      const { data } = await axiosReq.put(`/api/profiles/${id}/`, profileData);
      return data;
    } catch (err) {
      throw new Error('Failed to update profile');
    }
  },

  // Workout endpoints
  getWorkouts: async (params) => {
    try {
      const { data } = await axiosReq.get('/api/workouts/', { params });
      return data;
    } catch (err) {
      throw new Error('Failed to fetch workouts');
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const { data } = await axiosReq.post('/api/workouts/', workoutData);
      return data;
    } catch (err) {
      throw new Error('Failed to create workout');
    }
  },

  updateWorkout: async (id, workoutData) => {
    try {
      const { data } = await axiosReq.put(`/api/workouts/${id}/`, workoutData);
      return data;
    } catch (err) {
      throw new Error('Failed to update workout');
    }
  },

  deleteWorkout: async (id) => {
    try {
      await axiosReq.delete(`/api/workouts/${id}/`);
    } catch (err) {
      throw new Error('Failed to delete workout');
    }
  },

  // Workout summary
  getWorkoutSummary: async () => {
    try {
      const { data } = await axiosReq.get('/api/workouts/summary/');
      return data;
    } catch (err) {
      throw new Error('Failed to fetch workout summary');
    }
  },

  // Social endpoints
  getLikes: async () => {
    try {
      const { data } = await axiosReq.get('/api/likes/');
      return data;
    } catch (err) {
      throw new Error('Failed to fetch likes');
    }
  },

  createLike: async (workoutId) => {
    try {
      const { data } = await axiosReq.post('/api/likes/', { workout: workoutId });
      return data;
    } catch (err) {
      throw new Error('Failed to like workout');
    }
  },

  deleteLike: async (likeId) => {
    try {
      await axiosReq.delete(`/api/likes/${likeId}/`);
    } catch (err) {
      throw new Error('Failed to unlike workout');
    }
  },

  getComments: async (workoutId) => {
    try {
      const { data } = await axiosReq.get(`/api/comments/?workout=${workoutId}`);
      return data;
    } catch (err) {
      throw new Error('Failed to fetch comments');
    }
  },

  createComment: async (workoutId, content) => {
    try {
      const { data } = await axiosReq.post('/api/comments/', {
        workout: workoutId,
        content,
      });
      return data;
    } catch (err) {
      throw new Error('Failed to create comment');
    }
  }
};

export default apiService;