import { axiosReq } from './axiosDefaults';
import errorHandler from './errorHandlerService';

class SocialService {
  // Get social feed with optional filters
  async getFeed(params = {}) {
    try {
      const response = await axiosReq.get('api/social/feed/', { params });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch social feed');
    }
  }

  // Share a workout
  async shareWorkout(workoutId) {
    try {
      const response = await axiosReq.post('api/social/feed/share_workout/', {
        workout_id: workoutId
      });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to share workout');
    }
  }

  // Toggle like on a post
  async toggleLike(postId) {
    try {
      const response = await axiosReq.post(`api/social/feed/${postId}/toggle_like/`);
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to toggle like');
    }
  }

  // Get comments for a workout
  async getComments(workoutId) {
    try {
      const response = await axiosReq.get('api/social/comments/', {
        params: { workout_id: workoutId }
      });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch comments');
    }
  }

  // Add a comment
  async addComment(workoutId, content) {
    try {
      const response = await axiosReq.post('api/social/comments/', {
        workout: workoutId,
        content
      });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to add comment');
    }
  }

  // Toggle follow user
  async toggleFollow(userId) {
    try {
      const response = await axiosReq.post('api/social/follows/toggle_follow/', {
        following_id: userId
      });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to toggle follow');
    }
  }

  // Get user suggestions
  async getSuggestions() {
    try {
      const response = await axiosReq.get('api/social/follows/suggestions/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch suggestions');
    }
  }

  // Get social stats
  async getStats() {
    try {
      const response = await axiosReq.get('api/social/follows/stats/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch social stats');
    }
  }
}

export const socialService = new SocialService();
export default socialService;