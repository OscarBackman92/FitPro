import { axiosReq } from './axiosDefaults';
import errorHandler from './errorHandlerService';

class SocialService {
  async getFeed(params = {}) {
    try {
      const response = await axiosReq.get('api/social/feed/', { params });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch feed');
    }
  }

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

  async toggleLike(postId) {
    try {
      const response = await axiosReq.post(`api/social/feed/${postId}/toggle_like/`);
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to toggle like');
    }
  }

  async getSocialStats() {
    try {
      const response = await axiosReq.get('api/social/follows/stats/');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch stats');
    }
  }

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
}

export const socialService = new SocialService();
export default socialService;