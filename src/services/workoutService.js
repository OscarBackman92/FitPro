import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

const workoutService = {
  /**
   * List workouts with optional query parameters
   * @param {Object} params Query parameters for filtering workouts
   * @returns {Promise<Object>} The API response with workouts
   */
  async listWorkouts(params = {}) {
    try {
      const response = await axiosReq.get('/api/workouts/', { params });
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Fetch a single workout by ID
   * @param {number} id The ID of the workout
   * @returns {Promise<Object>} The workout data
   */
  async getWorkout(id) {
    try {
      const response = await axiosReq.get(`/api/workouts/${id}/`);
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Create a new workout
   * @param {Object} data The workout data to create
   * @returns {Promise<Object>} The created workout data
   */
  async createWorkout(data) {
    try {
      const response = await axiosReq.post('/api/workouts/', data);
      return response.data;
    } catch (err) {
      logger.error('Error creating workout:', err);
      throw err;
    }
  },

  /**
   * Update an existing workout by ID
   * @param {number} id The ID of the workout
   * @param {Object} data The workout data to update
   * @returns {Promise<Object>} The updated workout data
   */
  async updateWorkout(id, data) {
    try {
      const response = await axiosReq.patch(`/api/workouts/${id}/`, data);
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Delete a workout by ID
   * @param {number} id The ID of the workout
   * @returns {Promise<Object>} Success response
   */
  async deleteWorkout(id) {
    try {
      await axiosReq.delete(`/api/workouts/${id}/`);
      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  /**
   * Fetch global workout statistics
   * @returns {Promise<Object>} The statistics data
   */
  async getStatistics() {
    try {
      const response = await axiosReq.get('/api/workouts/statistics/');
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Fetch dashboard data including recent workouts and statistics
   * @returns {Promise<Object>} Dashboard data with stats and workouts
   */
  async getDashboardData() {
    try {
      const [stats, workouts] = await Promise.all([
        this.getStatistics(),
        this.listWorkouts({ limit: 5, ordering: '-date_logged' }),
      ]);

      const dashboardData = {
        stats: {
          total_workouts: stats.total_workouts || 0,
          workouts_this_week: stats.workouts_this_week || 0,
          current_streak: stats.current_streak || 0,
          total_duration: stats.total_duration || 0,
          workout_types: stats.workout_types || [],
          intensity_distribution: stats.intensity_distribution || [],
        },
        workouts: workouts.results || [],
      };

      return dashboardData;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Fetch workouts with pagination support
   * @param {string} url URL for the next or previous page
   * @returns {Promise<Object>} Paginated workout data
   */
  async fetchPaginatedWorkouts(url) {
    try {
      const response = await axiosReq.get(url);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
};

export default workoutService;
