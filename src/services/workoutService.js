import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class WorkoutService {
  async handleRequest(method, url, data = null) {
    try {
      logger.debug(`Requesting ${method} ${url}...`, { data });
      const response = await axiosReq[method](url, data);
      logger.debug(`Response from ${url}:`, response.data);  // Logs response data for better debugging
      return response.data;
    } catch (err) {
      logger.error(`Error in ${method} ${url}:`, err);
      throw errorHandler.handleApiError(err);
    }
  }

  async getWorkouts(params = {}) {
    try {
      logger.debug('Fetching workouts', { params });
      const response = await axiosReq.get('api/workouts/', { params });
      return response.data;
    } catch (err) {
      logger.error('Error fetching workouts:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch workouts');
    }
  }

  async getWorkout(id) {
    return this.handleRequest('get', `api/workouts/${id}/`);
  }

  async createWorkout(workoutData) {
    return this.handleRequest('post', 'api/workouts/', workoutData);
  }

  async updateWorkout(id, workoutData) {
    return this.handleRequest('put', `api/workouts/${id}/`, workoutData);
  }

  async deleteWorkout(id) {
    return this.handleRequest('delete', `api/workouts/${id}/`);
  }

  // Get workout statistics and ensure it handles the response correctly
  async getWorkoutStatistics() {
    try {
      logger.debug('Requesting workout statistics...');
      const response = await axiosReq.get('api/workouts/statistics/');
      logger.debug('Workout statistics response:', response.data);

      if (response.data) {
        // Return the data if available
        return response.data;
      } else {
        throw new Error('No statistics data found');
      }
    } catch (err) {
      logger.error('Error fetching workout statistics:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch workout statistics');
    }
  }

  async getWorkoutSummary() {
    return this.handleRequest('get', 'api/workouts/summary/');
  }
}

export const workoutService = new WorkoutService();
export default workoutService;
