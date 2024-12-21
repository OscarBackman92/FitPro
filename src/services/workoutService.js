// Import required services
import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

const workoutService = {
 // Get list of workouts with optional filters
 async listWorkouts(params = {}) {
   try {
     const response = await axiosReq.get('/api/workouts/', { params });
     return response.data;
   } catch (err) {
     throw err;
   }
 },

 // Get single workout by ID
 async getWorkout(id) {
   try {
     const response = await axiosReq.get(`/api/workouts/${id}/`);
     return response.data;
   } catch (err) {
     throw err;
   }
 },

 // Create new workout
 async createWorkout(data) {
   try {
     const response = await axiosReq.post('/api/workouts/', data);
     return response.data;
   } catch (err) {
     logger.error('Error creating workout:', err);
     throw err;
   }
 },

 // Update existing workout
 async updateWorkout(id, data) {
   try {
     const response = await axiosReq.patch(`/api/workouts/${id}/`, data);
     return response.data;
   } catch (err) {
     throw err;
   }
 },

 // Delete workout by ID
 async deleteWorkout(id) {
   try {
     await axiosReq.delete(`/api/workouts/${id}/`);
     return { success: true };
   } catch (err) {
     throw err;
   }
 },

 // Get workout statistics
 async getStatistics() {
   try {
     const response = await axiosReq.get('/api/workouts/statistics/');
     return response.data;
   } catch (err) {
     throw err;
   }
 },

 // Get combined dashboard data including stats and recent workouts
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

 // Get paginated workouts 
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