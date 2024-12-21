// Import custom axios instance
import { axiosReq } from './axiosDefaults';

export const socialService = {
 // Get social feed posts with optional filters
 async getFeed(params = {}) {
   try {
     const response = await axiosReq.get('/api/social/feed/', { params });
     return response.data;
   } catch (err) {
     throw err;
   }
 },

 // Share a workout to the social feed
 async shareWorkout(workoutId) {
   try {
     const response = await axiosReq.post('/api/social/feed/', { 
       workout_id: workoutId 
     });
     return response.data;
   } catch (err) {
     throw err;
   }
 },

 // Toggle like status on a post
 async toggleLike(postId) {
   try {
     const response = await axiosReq.post(`/api/social/feed/${postId}/like/`);
     return response.data;
   } catch (err) {
     throw err;
   }
 },

 // Add a comment to a post 
 async addComment(postId, content) {
   try {
     const response = await axiosReq.post(`/api/social/feed/${postId}/comments/`, {
       content
     });
     return response.data;
   } catch (err) {
     throw err;
   }
 },

 // Delete a comment from a post
 async deleteComment(postId, commentId) {
   try {
     await axiosReq.delete(`/api/social/feed/${postId}/comments/${commentId}/`);
     return true;
   } catch (err) {
     throw err;
   }
 }
};

export default socialService;