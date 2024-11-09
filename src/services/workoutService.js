import { axiosReq } from './axiosDefaults';
import errorHandler from './errorHandlerService';
import logger from './loggerService';

class WorkoutService {
  // Helper function to handle API requests and errors
  async handleRequest(method, url, params = {}, data = null) {
    try {
      logger.debug(`Requesting ${method} ${url}...`, { params, data });
      const response = await axiosReq[method](url, data, { params });
      logger.debug(`Response from ${url}:`, response.data);
      return response.data;
    } catch (err) {
      logger.error(`Error in ${method} ${url}:`, err);
      throw errorHandler.handleApiError(err);
    }
  }

  // Get workout statistics
  async getWorkoutStatistics() {
    return this.handleRequest('get', '/workouts/workouts/statistics/');
  }

  // Get all workouts with optional filtering
  async getWorkouts(params = {}) {
    return this.handleRequest('get', '/workouts/workouts/', params);
  }

  // Get a single workout by ID
  async getWorkout(id) {
    return this.handleRequest('get', `/workouts/workouts/${id}/`);
  }

  // Create a new workout
  async createWorkout(workoutData) {
    return this.handleRequest('post', '/workouts/workouts/', {}, workoutData);
  }

  // Update an existing workout
  async updateWorkout(id, workoutData) {
    return this.handleRequest('put', `/workouts/workouts/${id}/`, {}, workoutData);
  }

  // Delete a workout
  async deleteWorkout(id) {
    return this.handleRequest('delete', `/workouts/workouts/${id}/`);
  }

  // Get workout summary
  async getWorkoutSummary() {
    return this.handleRequest('get', '/workouts/workouts/summary/');
  }

  // Get workout streaks
  async getWorkoutStreaks() {
    return this.handleRequest('get', '/workouts/workouts/streaks/');
  }

  // Search workouts
  async searchWorkouts(query) {
    return this.handleRequest('get', '/workouts/workouts/search/', { query });
  }

  // Get workout types
  async getWorkoutTypes() {
    return this.handleRequest('get', '/workouts/types/');
  }

  // Get workout progress
  async getWorkoutProgress() {
    return this.handleRequest('get', '/workouts/workouts/progress/');
  }

  // Get monthly stats
  async getMonthlyStats(month, year) {
    return this.handleRequest('get', '/workouts/workouts/monthly-stats/', { month, year });
  }

  // Export workouts
  async exportWorkouts(format = 'csv') {
    return this.handleRequest('get', '/workouts/workouts/export/', { format }, null, 'blob');
  }

  // Get workout intensity distribution
  async getIntensityDistribution() {
    return this.handleRequest('get', '/workouts/workouts/intensity-distribution/');
  }

  // Get workout count by type
  async getWorkoutCountByType() {
    return this.handleRequest('get', '/workouts/workouts/count-by-type/');
  }

  // Filter workouts by date range
  async filterWorkoutsByDate(startDate, endDate) {
    return this.handleRequest('get', '/workouts/workouts/', { date_logged_after: startDate, date_logged_before: endDate });
  }

  // Get workouts this week
  async getWorkoutsThisWeek() {
    return this.handleRequest('get', '/workouts/workouts/this-week/');
  }

  // Calculate workout averages
  async getWorkoutAverages() {
    return this.handleRequest('get', '/workouts/workouts/averages/');
  }
}

export const workoutService = new WorkoutService();
export default workoutService;
