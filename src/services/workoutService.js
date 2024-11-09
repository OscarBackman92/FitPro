import { axiosReq } from './axiosDefaults';
import errorHandler from './errorHandlerService';
import logger from './loggerService';

class WorkoutService {
  // Get workout statistics
  async getWorkoutStatistics() {
    try {
      logger.debug('Fetching workout statistics...');
      const response = await axiosReq.get('/workouts/workouts/statistics/');
      logger.debug('Statistics response:', response.data);
      return response.data;
    } catch (err) {
      logger.error('Error fetching workout statistics:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch workout statistics');
    }
  }

  // Get all workouts with optional filtering
  async getWorkouts(params = {}) {
    try {
      const response = await axiosReq.get('/workouts/workouts/', { params });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workouts');
    }
  }

  // Get a single workout by ID
  async getWorkout(id) {
    try {
      const response = await axiosReq.get(`/workouts/workouts/${id}/`);
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout');
    }
  }

  // Create a new workout
  async createWorkout(workoutData) {
    try {
      const response = await axiosReq.post('/workouts/workouts/', workoutData);
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to create workout');
    }
  }

  // Update an existing workout
  async updateWorkout(id, workoutData) {
    try {
      const response = await axiosReq.put(`/workouts/workouts/${id}/`, workoutData);
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update workout');
    }
  }

  // Delete a workout
  async deleteWorkout(id) {
    try {
      await axiosReq.delete(`/workouts/workouts/${id}/`);
      return true;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to delete workout');
    }
  }

  // Get workout summary
  async getWorkoutSummary() {
    try {
      const response = await axiosReq.get('/workouts/workouts/summary/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout summary');
    }
  }

  // Get workout streaks
  async getWorkoutStreaks() {
    try {
      const response = await axiosReq.get('/workouts/workouts/streaks/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout streaks');
    }
  }

  // Search workouts
  async searchWorkouts(query) {
    try {
      const response = await axiosReq.get('/workouts/workouts/search/', {
        params: { query }
      });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to search workouts');
    }
  }

  // Get workout types
  async getWorkoutTypes() {
    try {
      const response = await axiosReq.get('/workouts/types/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout types');
    }
  }

  // Get workout progress
  async getWorkoutProgress() {
    try {
      const response = await axiosReq.get('/workouts/workouts/progress/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout progress');
    }
  }

  // Get monthly stats
  async getMonthlyStats(month, year) {
    try {
      const response = await axiosReq.get('/workouts/workouts/monthly-stats/', {
        params: { month, year }
      });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch monthly stats');
    }
  }

  // Export workouts
  async exportWorkouts(format = 'csv') {
    try {
      const response = await axiosReq.get(`/workouts/workouts/export/`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to export workouts');
    }
  }

  // Get workout intensity distribution
  async getIntensityDistribution() {
    try {
      const response = await axiosReq.get('/workouts/workouts/intensity-distribution/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch intensity distribution');
    }
  }

  // Get workout count by type
  async getWorkoutCountByType() {
    try {
      const response = await axiosReq.get('/workouts/workouts/count-by-type/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout count by type');
    }
  }

  // Filter workouts by date range
  async filterWorkoutsByDate(startDate, endDate) {
    try {
      const response = await axiosReq.get('/workouts/workouts/', {
        params: {
          date_logged_after: startDate,
          date_logged_before: endDate
        }
      });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to filter workouts by date');
    }
  }

  // Get workouts this week
  async getWorkoutsThisWeek() {
    try {
      const response = await axiosReq.get('/workouts/workouts/this-week/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workouts this week');
    }
  }

  // Calculate workout averages
  async getWorkoutAverages() {
    try {
      const response = await axiosReq.get('/workouts/workouts/averages/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch workout averages');
    }
  }
}

export const workoutService = new WorkoutService();
export default workoutService;