// src/services/socialService.js
import axiosInstance from './axiosInstance';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

export const socialService = {
  // Feed Methods
  async getFeed(params = {}) {
    try {
      logger.debug('Fetching social feed', { params });
      const response = await axiosInstance.get('/api/social/feed/', { params });
      logger.info('Feed fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch feed');
    }
  },

  async getFeedByUser(userId, params = {}) {
    try {
      logger.debug('Fetching user feed', { userId, params });
      const response = await axiosInstance.get(`/api/social/feed/${userId}/`, { params });
      logger.info('User feed fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch user feed');
    }
  },

  // Follow Methods
  async followUser(userId) {
    try {
      logger.debug('Following user', { userId });
      const response = await axiosInstance.post('/api/social/follow/toggle/', {
        user_id: userId
      });
      logger.info('Follow toggled successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to toggle follow');
    }
  },

  async getFollowers(userId, params = {}) {
    try {
      logger.debug('Fetching followers', { userId, params });
      const response = await axiosInstance.get(`/api/social/followers/${userId}/`, { params });
      logger.info('Followers fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch followers');
    }
  },

  async getFollowing(userId, params = {}) {
    try {
      logger.debug('Fetching following', { userId, params });
      const response = await axiosInstance.get(`/api/social/following/${userId}/`, { params });
      logger.info('Following fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch following');
    }
  },

  // Like Methods
  async toggleLike(workoutId) {
    try {
      logger.debug('Toggling workout like', { workoutId });
      const response = await axiosInstance.post('/api/social/likes/toggle/', {
        workout_id: workoutId
      });
      logger.info('Like toggled successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to toggle like');
    }
  },

  async getLikes(workoutId) {
    try {
      logger.debug('Fetching likes', { workoutId });
      const response = await axiosInstance.get(`/api/social/likes/${workoutId}/`);
      logger.info('Likes fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch likes');
    }
  },

  // Comment Methods
  async getComments(workoutId, params = {}) {
    try {
      logger.debug('Fetching comments', { workoutId, params });
      const response = await axiosInstance.get(`/api/social/comments/${workoutId}/`, { params });
      logger.info('Comments fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch comments');
    }
  },

  async addComment(workoutId, content) {
    try {
      logger.debug('Adding comment', { workoutId, content });
      const response = await axiosInstance.post('/api/social/comments/', {
        workout_id: workoutId,
        content
      });
      logger.info('Comment added successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to add comment');
    }
  },

  async updateComment(commentId, content) {
    try {
      logger.debug('Updating comment', { commentId, content });
      const response = await axiosInstance.put(`/api/social/comments/${commentId}/`, {
        content
      });
      logger.info('Comment updated successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update comment');
    }
  },

  async deleteComment(commentId) {
    try {
      logger.debug('Deleting comment', { commentId });
      await axiosInstance.delete(`/api/social/comments/${commentId}/`);
      logger.info('Comment deleted successfully');
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to delete comment');
    }
  },

  // Notifications
  async getNotifications(params = {}) {
    try {
      logger.debug('Fetching notifications', { params });
      const response = await axiosInstance.get('/api/social/notifications/', { params });
      logger.info('Notifications fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch notifications');
    }
  },

  async markNotificationRead(notificationId) {
    try {
      logger.debug('Marking notification as read', { notificationId });
      const response = await axiosInstance.post(`/api/social/notifications/${notificationId}/read/`);
      logger.info('Notification marked as read');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to mark notification as read');
    }
  },

  async markAllNotificationsRead() {
    try {
      logger.debug('Marking all notifications as read');
      const response = await axiosInstance.post('/api/social/notifications/read-all/');
      logger.info('All notifications marked as read');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to mark all notifications as read');
    }
  },

  // Activity Feed
  async getActivityFeed(params = {}) {
    try {
      logger.debug('Fetching activity feed', { params });
      const response = await axiosInstance.get('/api/social/activity/', { params });
      logger.info('Activity feed fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch activity feed');
    }
  },

  // Stats
  async getSocialStats(userId) {
    try {
      logger.debug('Fetching social stats', { userId });
      const response = await axiosInstance.get(`/api/social/stats/${userId}/`);
      logger.info('Social stats fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch social stats');
    }
  }
};

export default socialService;