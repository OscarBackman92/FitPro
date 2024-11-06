// src/services/socialService.js
import axiosInstance from './axiosInstance';
import handleApiError from '../utils/errorHandler';

const socialService = {
  // Feed
  getFeed: async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/feed/?page=${page}`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch feed');
    }
  },

  // Following
  followUser: async (userId) => {
    try {
      const response = await axiosInstance.post('/social/follows/follow/', {
        user_id: userId
      });
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to follow user');
    }
  },

  unfollowUser: async (userId) => {
    try {
      await axiosInstance.post('/social/follows/unfollow/', {
        user_id: userId
      });
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to unfollow user');
    }
  },

  getFollowers: async (userId) => {
    try {
      const response = await axiosInstance.get(`/social/follows/?following=${userId}`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to get followers');
    }
  },

  getFollowing: async (userId) => {
    try {
      const response = await axiosInstance.get(`/social/follows/?follower=${userId}`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to get following');
    }
  },

  // Likes
  likeWorkout: async (workoutId) => {
    try {
      const response = await axiosInstance.post('/social/likes/', {
        workout: workoutId
      });
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to like workout');
    }
  },

  unlikeWorkout: async (workoutId) => {
    try {
      await axiosInstance.delete(`/social/likes/${workoutId}/`);
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to unlike workout');
    }
  },

  // Comments
  getComments: async (workoutId) => {
    try {
      const response = await axiosInstance.get(`/social/comments/?workout=${workoutId}`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch comments');
    }
  },

  addComment: async (workoutId, content) => {
    try {
      const response = await axiosInstance.post('/social/comments/', {
        workout: workoutId,
        content
      });
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to add comment');
    }
  },

  deleteComment: async (commentId) => {
    try {
      await axiosInstance.delete(`/social/comments/${commentId}/`);
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to delete comment');
    }
  },

  // Suggested Users
  getSuggestedUsers: async () => {
    try {
      const response = await axiosInstance.get('/profiles/?suggested=true');
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch suggested users');
    }
  },
};

export default socialService;