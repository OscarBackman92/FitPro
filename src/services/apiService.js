import { axiosReq, axiosAuth } from '../api/axiosDefaults';

export const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const { data } = await axiosAuth.post('/auth/login/', credentials);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const { data } = await axiosAuth.post('/auth/registration/', userData);
      return data;
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      throw err;
    }
  },

  logout: async () => {
    try {
      await axiosAuth.post('/auth/logout/');
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  },

  // Profile endpoints
  getProfile: async (id) => {
    try {
      const endpoint = id ? `/profiles/${id}/` : '/profiles/me/';
      const { data } = await axiosReq.get(endpoint);
      return data;
    } catch (err) {
      console.error('Profile fetch error:', err);
      throw err;
    }
  },

  updateProfile: async (id, profileData) => {
    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, profileData);
      return data;
    } catch (err) {
      console.error('Profile update error:', err);
      throw err;
    }
  },

  // Workout endpoints
  getWorkouts: async (params) => {
    try {
      const { data } = await axiosReq.get('/workouts/workouts/', { params });
      return data;
    } catch (err) {
      console.error('Workouts fetch error:', err);
      throw err;
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const { data } = await axiosReq.post('/workouts/workouts/', workoutData);
      return data;
    } catch (err) {
      console.error('Workout creation error:', err);
      throw err;
    }
  },

  updateWorkout: async (id, workoutData) => {
    try {
      const { data } = await axiosReq.put(`/workouts/workouts/${id}/`, workoutData);
      return data;
    } catch (err) {
      console.error('Workout update error:', err);
      throw err;
    }
  },

  deleteWorkout: async (id) => {
    try {
      await axiosReq.delete(`/workouts/workouts/${id}/`);
    } catch (err) {
      console.error('Workout deletion error:', err);
      throw err;
    }
  },

  // Workout summary
  getWorkoutSummary: async () => {
    try {
      const { data } = await axiosReq.get('/workouts/workouts/summary/');
      return data;
    } catch (err) {
      console.error('Summary fetch error:', err);
      throw err;
    }
  },

  // Social endpoints
  getLikes: async () => {
    try {
      const { data } = await axiosReq.get('/likes/');
      return data;
    } catch (err) {
      console.error('Likes fetch error:', err);
      throw err;
    }
  },

  createLike: async (workoutId) => {
    try {
      const { data } = await axiosReq.post('/likes/', { workout: workoutId });
      return data;
    } catch (err) {
      console.error('Like creation error:', err);
      throw err;
    }
  },

  deleteLike: async (likeId) => {
    try {
      await axiosReq.delete(`/likes/${likeId}/`);
    } catch (err) {
      console.error('Like deletion error:', err);
      throw err;
    }
  },

  getComments: async (workoutId) => {
    try {
      const { data } = await axiosReq.get(`/comments/?workout=${workoutId}`);
      return data;
    } catch (err) {
      console.error('Comments fetch error:', err);
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
      console.error('Comment creation error:', err);
      throw err;
    }
  }
};

export default apiService;