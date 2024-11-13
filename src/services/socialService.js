// src/services/socialService.js
import { axiosReq } from './axiosDefaults';
import errorHandler from './errorHandlerService';
import logger from './loggerService';

class SocialService {
  /**
   * Get the social feed with optional filters
   */
  async getFeed(params = {}) {
    try {
      logger.debug('Fetching social feed', { params });
      const response = await axiosReq.get('api/social/feed/', { params });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch feed:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch feed');
    }
  }

  /**
   * Share a workout to the social feed
   */
  async shareWorkout(workoutId) {
    try {
      logger.debug('Sharing workout', { workoutId });
      const response = await axiosReq.post('api/social/feed/', {
        workout_id: workoutId
      });
      logger.info('Workout shared successfully');
      return response.data;
    } catch (err) {
      logger.error('Failed to share workout:', err);
      throw errorHandler.handleApiError(err, 'Failed to share workout');
    }
  }

  /**
   * Toggle like on a post
   */
  async toggleLike(postId) {
    try {
      logger.debug('Toggling like', { postId });
      const response = await axiosReq.post(`api/social/posts/${postId}/like/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to toggle like:', err);
      throw errorHandler.handleApiError(err, 'Failed to update like');
    }
  }

  /**
   * Add a comment to a post
   */
  async addComment(postId, content) {
    try {
      logger.debug('Adding comment', { postId });
      const response = await axiosReq.post(`api/social/posts/${postId}/comments/`, {
        content
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to add comment:', err);
      throw errorHandler.handleApiError(err, 'Failed to add comment');
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId) {
    try {
      logger.debug('Deleting comment', { commentId });
      await axiosReq.delete(`api/social/comments/${commentId}/`);
    } catch (err) {
      logger.error('Failed to delete comment:', err);
      throw errorHandler.handleApiError(err, 'Failed to delete comment');
    }
  }

  /**
   * Get comments for a post
   */
  async getComments(postId) {
    try {
      logger.debug('Fetching comments', { postId });
      const response = await axiosReq.get(`api/social/posts/${postId}/comments/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch comments:', err);
      throw errorHandler.handleApiError(err, 'Failed to load comments');
    }
  }
}

export const socialService = new SocialService();
export default socialService;