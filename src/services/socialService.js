// src/services/socialService.js
import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class SocialService {
  async getFeed(page = 1, limit = 10) {
    try {
      logger.debug('Fetching social feed', { page, limit });
      const response = await axiosReq.get('api/social/feed/', {
        params: { page, limit }
      });
      return response.data;
    } catch (err) {
      logger.error('Error fetching social feed:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch social feed');
    }
  }

  async getSocialStats(userId) {
    try {
      logger.debug('Fetching social stats', { userId });
      const response = await axiosReq.get(`api/social/stats/${userId}/`);
      return response.data;
    } catch (err) {
      logger.error('Error fetching social stats:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch social stats');
    }
  }

  async followUser(userId) {
    try {
      logger.debug('Following user', { userId });
      const response = await axiosReq.post('api/social/follow/toggle/', {
        user_id: userId
      });
      return response.data;
    } catch (err) {
      logger.error('Error following user:', err);
      throw errorHandler.handleApiError(err, 'Failed to follow user');
    }
  }

  async getFollowers(userId, page = 1) {
    try {
      logger.debug('Fetching followers', { userId, page });
      const response = await axiosReq.get(`api/social/followers/${userId}/`, {
        params: { page }
      });
      return response.data;
    } catch (err) {
      logger.error('Error fetching followers:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch followers');
    }
  }

  async getFollowing(userId, page = 1) {
    try {
      logger.debug('Fetching following', { userId, page });
      const response = await axiosReq.get(`api/social/following/${userId}/`, {
        params: { page }
      });
      return response.data;
    } catch (err) {
      logger.error('Error fetching following:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch following');
    }
  }

  async toggleLike(workoutId) {
    try {
      logger.debug('Toggling like', { workoutId });
      const response = await axiosReq.post('api/social/likes/toggle/', {
        workout_id: workoutId
      });
      return response.data;
    } catch (err) {
      logger.error('Error toggling like:', err);
      throw errorHandler.handleApiError(err, 'Failed to toggle like');
    }
  }

  async getComments(workoutId, page = 1) {
    try {
      logger.debug('Fetching comments', { workoutId, page });
      const response = await axiosReq.get(`api/social/comments/${workoutId}/`, {
        params: { page }
      });
      return response.data;
    } catch (err) {
      logger.error('Error fetching comments:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch comments');
    }
  }

  async addComment(workoutId, content) {
    try {
      logger.debug('Adding comment', { workoutId, content });
      const response = await axiosReq.post('api/social/comments/', {
        workout_id: workoutId,
        content
      });
      return response.data;
    } catch (err) {
      logger.error('Error adding comment:', err);
      throw errorHandler.handleApiError(err, 'Failed to add comment');
    }
  }

  async deleteComment(commentId) {
    try {
      logger.debug('Deleting comment', { commentId });
      await axiosReq.delete(`api/social/comments/${commentId}/`);
    } catch (err) {
      logger.error('Error deleting comment:', err);
      throw errorHandler.handleApiError(err, 'Failed to delete comment');
    }
  }
}

export const socialService = new SocialService();
export default socialService;