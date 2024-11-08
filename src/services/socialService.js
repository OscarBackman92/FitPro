// src/services/socialService.js
import axiosInstance from './axiosInstance';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class SocialService {
  // Feed Methods
  async getFeed(page = 1) {
    try {
      logger.debug('Fetching social feed', { page });
      const response = await axiosInstance.get(`/social/feed/?page=${page}`);
      logger.info('Feed fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch feed');
    }
  }

  // Follow Methods
  async followUser(userId) {
    try {
      logger.debug('Following user', { userId });
      const response = await axiosInstance.post('/social/follow/toggle_follow/', {
        user_id: userId
      });
      logger.info('User follow action completed', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to follow user');
    }
  }

  async getFollowers(userId) {
    try {
      logger.debug('Fetching followers', { userId });
      const response = await axiosInstance.get(`/social/follow/?type=followers&user=${userId}`);
      logger.info('Followers fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch followers');
    }
  }

  async getFollowing(userId) {
    try {
      logger.debug('Fetching following', { userId });
      const response = await axiosInstance.get(`/social/follow/?type=following&user=${userId}`);
      logger.info('Following fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch following');
    }
  }

  async getFollowersCount(userId) {
    try {
      logger.debug('Fetching followers count', { userId });
      const response = await axiosInstance.get(`/social/follow/followers_count/`);
      logger.info('Followers count fetched', { count: response.data.followers_count });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch followers count');
    }
  }

  // Like Methods
  async toggleLike(workoutId) {
    try {
      logger.debug('Toggling workout like', { workoutId });
      const response = await axiosInstance.post('/social/likes/', {
        workout: workoutId
      });
      logger.info('Like toggled successfully', { workoutId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to toggle like');
    }
  }

  // Comment Methods
  async getComments(workoutId) {
    try {
      logger.debug('Fetching comments', { workoutId });
      const response = await axiosInstance.get(`/social/comments/?workout_id=${workoutId}`);
      logger.info('Comments fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch comments');
    }
  }

  async addComment(workoutId, content) {
    try {
      logger.debug('Adding comment', { workoutId, content });
      const response = await axiosInstance.post('/social/comments/', {
        workout: workoutId,
        content
      });
      logger.info('Comment added successfully', { workoutId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to add comment');
    }
  }

  async deleteComment(commentId) {
    try {
      logger.debug('Deleting comment', { commentId });
      await axiosInstance.delete(`/social/comments/${commentId}/`);
      logger.info('Comment deleted successfully', { commentId });
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to delete comment');
    }
  }

  async getCommentsCount(workoutId) {
    try {
      logger.debug('Fetching comments count', { workoutId });
      const response = await axiosInstance.get(`/social/comments/comments_count/?workout_id=${workoutId}`);
      logger.info('Comments count fetched', { count: response.data.comments_count });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch comments count');
    }
  }
}

export const socialService = new SocialService();
export default socialService;