import { axiosReq } from './axiosDefaults';
import logger from './loggerService';

class WorkoutService {
  async getWorkouts(params = {}) {
    try {
      const response = await axiosReq.get('api/workouts/', { params });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch workouts:', err);
      throw err;
    }
  }

  async getWorkout(id) {
    try {
      const response = await axiosReq.get(`api/workouts/${id}/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch workout:', err);
      throw err;
    }
  }

  async createWorkout(data) {
    try {
      const response = await axiosReq.post('api/workouts/', data);
      return response.data;
    } catch (err) {
      logger.error('Failed to create workout:', err);
      throw err;
    }
  }

  async updateWorkout(id, data) {
    try {
      const response = await axiosReq.put(`api/workouts/${id}/`, data);
      return response.data;
    } catch (err) {
      logger.error('Failed to update workout:', err);
      throw err;
    }
  }

  async deleteWorkout(id) {
    try {
      await axiosReq.delete(`api/workouts/${id}/`);
    } catch (err) {
      logger.error('Failed to delete workout:', err);
      throw err;
    }
  }

  async getWorkoutStatistics() {
    try {
      const response = await this.getWorkouts();
      const workouts = response.results || [];
      
      return {
        total_workouts: workouts.length,
        workouts_this_week: this.#countWorkoutsThisWeek(workouts),
        current_streak: this.#calculateStreak(workouts),
        total_duration: workouts.reduce((sum, w) => sum + w.duration, 0),
        workout_types: this.#getWorkoutTypes(workouts),
        monthly_trends: this.#getMonthlyTrends(workouts)
      };
    } catch (err) {
      logger.error('Failed to calculate statistics:', err);
      return {
        total_workouts: 0,
        workouts_this_week: 0,
        current_streak: 0,
        total_duration: 0,
        workout_types: [],
        monthly_trends: []
      };
    }
  }

  #countWorkoutsThisWeek(workouts) {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date_logged);
      return workoutDate >= weekStart;
    }).length;
  }

  #calculateStreak(workouts) {
    if (!workouts.length) return 0;
    
    const dates = workouts
      .map(w => new Date(w.date_logged).toISOString().split('T')[0])
      .sort()
      .reverse();
    
    let streak = 1;
    let current = new Date(dates[0]);
    
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(current);
      prev.setDate(prev.getDate() - 1);
      const next = new Date(dates[i]);
      
      if (prev.toISOString().split('T')[0] === dates[i]) {
        streak++;
        current = next;
      } else {
        break;
      }
    }
    
    return streak;
  }

  #getWorkoutTypes(workouts) {
    const types = {};
    workouts.forEach(workout => {
      types[workout.workout_type] = (types[workout.workout_type] || 0) + 1;
    });
    return Object.entries(types).map(([type, count]) => ({ type, count }));
  }

  #getMonthlyTrends(workouts) {
    const monthlyData = {};
    
    workouts.forEach(workout => {
      const date = new Date(workout.date_logged);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          total_workouts: 0,
          total_duration: 0,
          by_type: {}
        };
      }
      
      monthlyData[monthKey].total_workouts++;
      monthlyData[monthKey].total_duration += workout.duration;
      monthlyData[monthKey].by_type[workout.workout_type] = 
        (monthlyData[monthKey].by_type[workout.workout_type] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        ...data
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }

  async getWorkoutFilters() {
    return {
      types: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
      intensities: ['low', 'moderate', 'high']
    };
  }
}

export const workoutService = new WorkoutService();