// src/services/socialService.js
import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class SocialService {
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

  async toggleLike(postId) {
    try {
      logger.debug('Toggling like', { postId });
      const response = await axiosReq.post(`api/social/feed/${postId}/like/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to toggle like:', err);
      throw errorHandler.handleApiError(err, 'Failed to update like');
    }
  }

  async addComment(postId, content) {
    try {
      logger.debug('Adding comment', { postId, content });
      const response = await axiosReq.post(`api/social/feed/${postId}/comments/`, {
        content
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to add comment:', err);
      throw errorHandler.handleApiError(err, 'Failed to add comment');
    }
  }

  async getComments(postId) {
    try {
      logger.debug('Fetching comments', { postId });
      const response = await axiosReq.get(`api/social/feed/${postId}/comments/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch comments:', err);
      throw errorHandler.handleApiError(err, 'Failed to load comments');
    }
  }

  async deleteComment(commentId) {
    try {
      logger.debug('Deleting comment', { commentId });
      await axiosReq.delete(`api/social/comments/${commentId}/`);
    } catch (err) {
      logger.error('Failed to delete comment:', err);
      throw errorHandler.handleApiError(err, 'Failed to delete comment');
    }
  }

  async followUser(userId) {
    try {
      logger.debug('Following user', { userId });
      const response = await axiosReq.post(`api/social/follow/${userId}/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to follow user:', err);
      throw errorHandler.handleApiError(err, 'Failed to follow user');
    }
  }

  async unfollowUser(userId) {
    try {
      logger.debug('Unfollowing user', { userId });
      const response = await axiosReq.delete(`api/social/follow/${userId}/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to unfollow user:', err);
      throw errorHandler.handleApiError(err, 'Failed to unfollow user');
    }
  }
}

export const socialService = new SocialService();
export default socialService;