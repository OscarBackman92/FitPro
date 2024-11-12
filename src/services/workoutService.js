// src/services/workoutService.js
import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class WorkoutService {
  async handleRequest(method, url, data = null) {
    try {
      logger.debug(`Requesting ${method} ${url}...`, { data });
      const response = await axiosReq[method](url, data);
      logger.debug(`Response from ${url}:`, response.data);
      return response.data;
    } catch (err) {
      logger.error(`Error in ${method} ${url}:`, err);
      throw errorHandler.handleApiError(err);
    }
  }

  async getWorkouts(params = {}) {
    return this.handleRequest('get', 'api/workouts/', { params });
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

  async getWorkoutStatistics() {
    return this.handleRequest('get', 'api/workouts/statistics/');
  }

  async getWorkoutSummary() {
    return this.handleRequest('get', 'api/workouts/summary/');
  }
}

export const workoutService = new WorkoutService();
export default workoutService;