import { axiosReq } from './axiosDefaults';
import logger from './loggerService';

class WorkoutService {
  async getWorkouts(params = {}) {
    try {
      const response = await axiosReq.get('api/workouts/', { params });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch workouts:', err);
      throw err;
    }
  }

  async getWorkout(id) {
    try {
      const response = await axiosReq.get(`api/workouts/${id}/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch workout:', err);
      throw err;
    }
  }

  async createWorkout(data) {
    try {
      const response = await axiosReq.post('api/workouts/', data);
      return response.data;
    } catch (err) {
      logger.error('Failed to create workout:', err);
      throw err;
    }
  }

  async updateWorkout(id, data) {
    try {
      const response = await axiosReq.put(`api/workouts/${id}/`, data);
      return response.data;
    } catch (err) {
      logger.error('Failed to update workout:', err);
      throw err;
    }
  }

  async deleteWorkout(id) {
    try {
      await axiosReq.delete(`api/workouts/${id}/`);
    } catch (err) {
      logger.error('Failed to delete workout:', err);
      throw err;
    }
  }

  async getWorkoutStatistics() {
    try {
      const response = await axiosReq.get('api/workouts/statistics/');
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch workout statistics:', err);
      throw err;
    }
  }
}

export const workoutService = new WorkoutService();