import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

export const socialService = {
  async getFeed(params = {}) {
    try {
      const response = await axiosReq.get('/api/social/feed/', { params });
      logger.debug('Feed fetched:', response.data);
      return response.data;
    } catch (err) {
      logger.error('Error fetching social feed:', err);
      throw err;
    }
  },

  async shareWorkout(workoutId) {
    try {
      logger.debug('Sharing workout:', { workoutId });
      const response = await axiosReq.post('/api/social/feed/', { 
        workout_id: workoutId 
      });
      return response.data;
    } catch (err) {
      logger.error('Error sharing workout:', err);
      throw err;
    }
  },

  async toggleLike(postId) {
    try {
      const response = await axiosReq.post(`/api/social/feed/${postId}/like/`);
      return response.data;
    } catch (err) {
      logger.error('Error toggling like:', err);
      throw err;
    }
  },

  async addComment(postId, content) {
    try {
      const response = await axiosReq.post(`/api/social/feed/${postId}/comments/`, {
        content
      });
      return response.data;
    } catch (err) {
      logger.error('Error adding comment:', err);
      throw err;
    }
  },

  async deleteComment(postId, commentId) {
    try {
      await axiosReq.delete(`/api/social/feed/${postId}/comments/${commentId}/`);
      return true;
    } catch (err) {
      logger.error('Error deleting comment:', err);
      throw err;
    }
  }
};

export default socialService;