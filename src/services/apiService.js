import { axiosReq } from '../api/axiosDefaults';

export const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const { data } = await axiosReq.post('dj-rest-auth/login/', credentials);
      if (data.key) {
        localStorage.setItem('token', data.key);
      }
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const { data } = await axiosReq.post('dj-rest-auth/registration/', userData);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Registration failed');
    }
  },

  logout: async () => {
    try {
      await axiosReq.post('dj-rest-auth/logout/');
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Logout error:', err);
    }
  },

  // Workouts
  getWorkouts: async (params) => {
    try {
      const { data } = await axiosReq.get('/api/workouts/workouts/', { params });
      return data;
    } catch (err) {
      throw new Error('Failed to fetch workouts');
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const { data } = await axiosReq.post('/api/workouts/workouts/', workoutData);
      return data;
    } catch (err) {
      throw new Error('Failed to create workout');
    }
  },

  updateWorkout: async (id, workoutData) => {
    try {
      const { data } = await axiosReq.put(`/api/workouts/workouts/${id}/`, workoutData);
      return data;
    } catch (err) {
      throw new Error('Failed to update workout');
    }
  },

  deleteWorkout: async (id) => {
    try {
      await axiosReq.delete(`/api/workouts/workouts/${id}/`);
    } catch (err) {
      throw new Error('Failed to delete workout');
    }
  }
};

// Export both default and named export
export default apiService;