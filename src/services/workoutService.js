import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

const workoutService = {
  async listWorkouts(params = {}) {
    try {
      const response = await axiosReq.get('/api/workouts/', { params });
      logger.debug('Workouts fetched:', response.data);
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
      logger.debug('Statistics fetched:', response.data);
      return response.data;
    } catch (err) {
      logger.error('Error fetching workout statistics:', err);
      throw err;
    }
  },

  async getDashboardData() {
    try {
      const [stats, workouts] = await Promise.all([
        this.getStatistics(),
        this.listWorkouts({ limit: 5, ordering: '-date_logged' })
      ]);

      return {
        stats: {
          total_workouts: stats.total_workouts || 0,
          workouts_this_week: stats.workouts_this_week || 0,
          current_streak: stats.current_streak || 0,
          total_duration: stats.total_duration || 0,
          workout_types: stats.workout_types || [],
          intensity_distribution: stats.intensity_distribution || []
        },
        workouts: workouts.results || []
      };
    } catch (err) {
      logger.error('Error fetching dashboard data:', err);
      throw err;
    }
  }
};

export default workoutService;