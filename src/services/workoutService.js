// src/services/workoutService.js
import axiosInstance from './axiosInstance';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class WorkoutService {
  async getWorkouts(params = {}) {
    try {
      logger.debug('Fetching workouts', { params });
      const response = await axiosInstance.get('/workouts/workouts/', { params });
      logger.info('Workouts fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workouts');
    }
  }

  async getWorkout(workoutId) {
    try {
      logger.debug('Fetching workout details', { workoutId });
      const response = await axiosInstance.get(`/workouts/workouts/${workoutId}/`);
      logger.info('Workout fetched successfully', { workoutId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout details');
    }
  }

  async createWorkout(workoutData) {
    try {
      logger.debug('Creating workout', { workoutData });
      const response = await axiosInstance.post('/workouts/workouts/', workoutData);
      logger.info('Workout created successfully', { workoutId: response.data.id });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to create workout');
    }
  }

  async updateWorkout(workoutId, workoutData) {
    try {
      logger.debug('Updating workout', { workoutId, workoutData });
      const response = await axiosInstance.put(`/workouts/workouts/${workoutId}/`, workoutData);
      logger.info('Workout updated successfully', { workoutId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update workout');
    }
  }

  async deleteWorkout(workoutId) {
    try {
      logger.debug('Deleting workout', { workoutId });
      await axiosInstance.delete(`/workouts/workouts/${workoutId}/`);
      logger.info('Workout deleted successfully', { workoutId });
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to delete workout');
    }
  }

  async getWorkoutSummary() {
    try {
      logger.debug('Fetching workout summary');
      const response = await axiosInstance.get('/workouts/workouts/summary/');
      logger.info('Workout summary fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout summary');
    }
  }

  async filterWorkouts(filters) {
    try {
      logger.debug('Filtering workouts', { filters });
      const response = await axiosInstance.get('/workouts/workouts/', {
        params: filters
      });
      logger.info('Filtered workouts fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to filter workouts');
    }
  }

  async searchWorkouts(searchTerm) {
    try {
      logger.debug('Searching workouts', { searchTerm });
      const response = await axiosInstance.get('/workouts/workouts/', {
        params: { search: searchTerm }
      });
      logger.info('Search completed successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to search workouts');
    }
  }

  async orderWorkouts(orderBy) {
    try {
      logger.debug('Ordering workouts', { orderBy });
      const response = await axiosInstance.get('/workouts/workouts/', {
        params: { ordering: orderBy }
      });
      logger.info('Workouts ordered successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to order workouts');
    }
  }
}

export const workoutService = new WorkoutService();
export default workoutService;