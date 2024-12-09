import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

const workoutService = {
  async listWorkouts(params = {}) {
    try {
      const response = await axiosReq.get('/workouts/', { params });
      return response.data;
    } catch (err) {
      logger.error('Error listing workouts:', err);
      throw err;
    }
  },

  async getWorkout(id) {
    try {
      const response = await axiosReq.get(`/workouts/${id}/`);
      return response.data;
    } catch (err) {
      logger.error(`Error fetching workout with ID ${id}:`, err);
      throw err;
    }
  },

  async createWorkout(data) {
    try {
      const response = await axiosReq.post('/workouts/', data);
      return response.data;
    } catch (err) {
      logger.error('Error creating workout:', err);
      throw err;
    }
  },

  async updateWorkout(id, data) {
    try {
      const response = await axiosReq.patch(`/workouts/${id}/`, data);
      return response.data;
    } catch (err) {
      logger.error(`Error updating workout with ID ${id}:`, err);
      throw err;
    }
  },

  async deleteWorkout(id) {
    try {
      const response = await axiosReq.delete(`/workouts/${id}/`);
      return response.data;
    } catch (err) {
      logger.error(`Error deleting workout with ID ${id}:`, err);
      throw err;
    }
  },

  async getStatistics() {
    try {
      const response = await axiosReq.get('/workouts/statistics/');
      return response.data;
    } catch (err) {
      logger.error('Error fetching workout statistics:', err);
      throw err;
    }
  },
};

export default workoutService;