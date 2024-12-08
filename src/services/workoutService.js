import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

export const workoutService = {
  async getWorkouts(params = {}) {
    try {
      const response = await axiosReq.get('api/workouts/', { params });
      return response.data;
    } catch (err) {
      logger.error('Error fetching workouts:', err);
      throw err;
    }
  },

  async getWorkoutStatistics() {
    try {
      const response = await axiosReq.get('api/workouts/statistics/');
      return {
        total_workouts: response.data.total_workouts || 0,
        workouts_this_week: response.data.workouts_this_week || 0,
        current_streak: response.data.current_streak || 0,
        total_duration: response.data.total_duration || 0,
        workout_types: response.data.workout_types || [],
        monthly_trends: response.data.monthly_trends || []
      };
    } catch (err) {
      logger.error('Error fetching workout statistics:', err);
      // Return default values if the endpoint fails
      return {
        total_workouts: 0,
        workouts_this_week: 0,
        current_streak: 0,
        total_duration: 0,
        workout_types: [],
        monthly_trends: []
      };
    }
  },

  async getDashboardData(limit = 5) {
    try {
      const [workoutsResponse, statsResponse] = await Promise.all([
        this.getWorkouts({ limit }),
        this.getWorkoutStatistics()
      ]);

      return {
        workouts: workoutsResponse.results || [],
        stats: {
          totalWorkouts: statsResponse.total_workouts,
          weeklyWorkouts: statsResponse.workouts_this_week,
          currentStreak: statsResponse.current_streak,
          totalMinutes: statsResponse.total_duration,
          workoutTypes: statsResponse.workout_types,
          monthlyStats: statsResponse.monthly_trends
        }
      };
    } catch (err) {
      logger.error('Error fetching dashboard data:', err);
      // Return a safe default state
      return {
        workouts: [],
        stats: {
          totalWorkouts: 0,
          weeklyWorkouts: 0,
          currentStreak: 0,
          totalMinutes: 0,
          workoutTypes: [],
          monthlyStats: []
        }
      };
    }
  }
};

export default workoutService;