import axiosInstance from './axiosInstance';
import handleApiError from '../utils/errorHandler';

const workoutService = {
  getWorkouts: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/workouts/workouts/', { params });
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch workouts');
    }
  },

  getWorkout: async (workoutId) => {
    try {
      const response = await axiosInstance.get(`/workouts/workouts/${workoutId}/`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch workout');
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const response = await axiosInstance.post('/workouts/workouts/', workoutData);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to create workout');
    }
  },

  updateWorkout: async (workoutId, workoutData) => {
    try {
      const response = await axiosInstance.put(`/workouts/workouts/${workoutId}/`, workoutData);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to update workout');
    }
  },

  deleteWorkout: async (workoutId) => {
    try {
      await axiosInstance.delete(`/workouts/workouts/${workoutId}/`);
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to delete workout');
    }
  },

  getWorkoutSummary: async () => {
    try {
      const response = await axiosInstance.get('/workouts/workouts/summary/');
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch workout summary');
    }
  },
};

export default workoutService;
