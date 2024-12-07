import { axiosReq } from './axiosDefaults';

export const workoutService = {
  async getWorkouts(params = {}) {
    try {
      // If currentUser is not provided in params, fetch all workouts (for social feed)
      const response = await axiosReq.get('api/workouts/', { params });
      return response.data;
    } catch (err) {
      console.error('Error fetching workouts:', err);
      throw err;
    }
  },

  async getWorkout(id) {
    try {
      const response = await axiosReq.get(`api/workouts/${id}/`);
      return response.data;
    } catch (err) {
      console.error('Error fetching workout:', err);
      throw err;
    }
  },

  async createWorkout(data) {
    try {
      const response = await axiosReq.post('api/workouts/', data);
      return response.data;
    } catch (err) {
      console.error('Error creating workout:', err);
      throw err;
    }
  },

  async updateWorkout(id, data) {
    try {
      const response = await axiosReq.put(`api/workouts/${id}/`, data);
      return response.data;
    } catch (err) {
      console.error('Error updating workout:', err);
      throw err;
    }
  },

  async deleteWorkout(id) {
    try {
      await axiosReq.delete(`api/workouts/${id}/`);
    } catch (err) {
      console.error('Error deleting workout:', err);
      throw err;
    }
  },

  async getUserWorkouts(userId, params = {}) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await axiosReq.get('api/workouts/', {
        params: {
          ...params,
          owner: userId,
          ordering: params.ordering || '-date_logged' // Default to most recent
        }
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching user workouts:', err);
      throw err;
    }
  },

  async getWorkoutStatistics(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await axiosReq.get(`api/workouts/statistics/${userId}/`);
      return response.data;
    } catch (err) {
      console.error('Error fetching workout statistics:', err);
      throw err;
    }
  },

  // Additional helper method for dashboard
  async getDashboardData(userId, limit = 5) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const [workoutsResponse, statsResponse] = await Promise.all([
        this.getUserWorkouts(userId, { limit }),
        this.getWorkoutStatistics(userId)
      ]);

      return {
        workouts: workoutsResponse.results || [],
        stats: {
          totalWorkouts: statsResponse.total_workouts || 0,
          weeklyWorkouts: statsResponse.workouts_this_week || 0,
          currentStreak: statsResponse.current_streak || 0,
          totalMinutes: statsResponse.total_duration || 0,
          workoutTypes: statsResponse.workout_types || [],
          monthlyStats: statsResponse.monthly_trends || []
        }
      };
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      throw err;
    }
  }
};

export default workoutService;