// src/services/workoutService.js
import axiosInstance from './axiosInstance';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

export const workoutService = {
  // Workouts
  async getWorkouts(params = {}) {
    try {
      logger.debug('Fetching workouts', { params });
      const response = await axiosInstance.get('/workouts/workouts/', { params });
      logger.info('Workouts fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workouts');
    }
  },

  async getWorkout(id) {
    try {
      logger.debug('Fetching workout', { id });
      const response = await axiosInstance.get(`/workouts/workouts/${id}/`);
      logger.info('Workout fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout');
    }
  },

  async createWorkout(workoutData) {
    try {
      logger.debug('Creating workout', { workoutData });
      const response = await axiosInstance.post('/workouts/workouts/', workoutData);
      logger.info('Workout created successfully', { id: response.data.id });
      return response.data;
    } catch (err) {
      logger.error('Error creating workout', { error: err }); // Add error logging
      throw errorHandler.handleApiError(err, 'Failed to create workout');
    }
  },

  async updateWorkout(id, workoutData) {
    try {
      logger.debug('Updating workout', { id, workoutData });
      const response = await axiosInstance.put(`/workouts/workouts/${id}/`, workoutData);
      logger.info('Workout updated successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update workout');
    }
  },

  async deleteWorkout(id) {
    try {
      logger.debug('Deleting workout', { id });
      await axiosInstance.delete(`/workouts/workouts/${id}/`);
      logger.info('Workout deleted successfully');
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to delete workout');
    }
  },

  // Statistics
  async getWorkoutStatistics() {
    try {
      logger.debug('Fetching workout statistics');
      const response = await axiosInstance.get('/workouts/workouts/statistics/');
      logger.info('Statistics fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout statistics');
    }
  },

  async getWorkoutSummary() {
    try {
      logger.debug('Fetching workout summary');
      const response = await axiosInstance.get('/workouts/workouts/summary/');
      logger.info('Summary fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout summary');
    }
  },

  // Streaks & Progress
  async getWorkoutStreaks() {
    try {
      logger.debug('Fetching workout streaks');
      const response = await axiosInstance.get('/workouts/workouts/streaks/');
      logger.info('Streaks fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout streaks');
    }
  },

  async getWorkoutProgress() {
    try {
      logger.debug('Fetching workout progress');
      const response = await axiosInstance.get('/workouts/workouts/progress/');
      logger.info('Progress fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout progress');
    }
  },

  // Types & Categories
  async getWorkoutTypes() {
    try {
      logger.debug('Fetching workout types');
      const response = await axiosInstance.get('/workouts/types/');
      logger.info('Workout types fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout types');
    }
  },

  // Filtering & Search
  async searchWorkouts(query) {
    try {
      logger.debug('Searching workouts', { query });
      const response = await axiosInstance.get('/workouts/workouts/search/', {
        params: { q: query }
      });
      logger.info('Search completed successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to search workouts');
    }
  },

  // Export & Reports
  async exportWorkouts(format = 'csv') {
    try {
      logger.debug('Exporting workouts', { format });
      const response = await axiosInstance.get(`/workouts/workouts/export/`, {
        params: { format },
        responseType: 'blob'
      });
      logger.info('Export completed successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to export workouts');
    }
  },

  async generateReport(params = {}) {
    try {
      logger.debug('Generating workout report', { params });
      const response = await axiosInstance.get('/workouts/workouts/report/', {
        params
      });
      logger.info('Report generated successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to generate report');
    }
  }
};

export default workoutService;