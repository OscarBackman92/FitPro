import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

const workoutService = {
  async listWorkouts(params = {}) {
    try {
      const response = await axiosReq.get('/api/workouts/', { params });
      console.log('API Response for Workouts:', response.data);
      return response.data;
    } catch (err) {
      logger.error('Error listing workouts:', err);
      throw err;
    }
  },

  async getWorkout(id) {
    try {
      const response = await axiosReq.get(`/api/workouts/${id}/`);
      return response.data;
    } catch (err) {
      logger.error(`Error fetching workout with ID ${id}:`, err);
      throw err;
    }
  },

  async createWorkout(data) {
    try {
      const response = await axiosReq.post('/api/workouts/', data);
      return response.data;
    } catch (err) {
      logger.error('Error creating workout:', err);
      throw err;
    }
  },

  async updateWorkout(id, data) {
    try {
      const response = await axiosReq.patch(`/api/workouts/${id}/`, data);
      return response.data;
    } catch (err) {
      logger.error(`Error updating workout with ID ${id}:`, err);
      throw err;
    }
  },

  async deleteWorkout(id) {
    try {
      await axiosReq.delete(`/api/workouts/${id}/`);
      return { success: true };
    } catch (err) {
      logger.error(`Error deleting workout with ID ${id}:`, err);
      throw err;
    }
  },

  async getStatistics() {
    try {
      const response = await axiosReq.get('/api/workouts/statistics/');
      return response.data;
    } catch (err) {
      logger.error('Error fetching workout statistics:', err);
      throw err;
    }
  },

  async getDashboardData() {
    try {
      const response = await axiosReq.get('/api/workouts/dashboard/');
      return response.data;
    } catch (err) {
      logger.error('Error fetching dashboard data:', err);
      throw err;
    }
  },
};

export default workoutService;