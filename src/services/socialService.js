import { axiosReq } from './axiosDefaults';

export const socialService = {
  async getFeed(params = {}) {
    try {
      const response = await axiosReq.get('/api/social/feed/', { params });
      return response.data;
    } catch (err) {
      throw err;
    }
  },

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

  async toggleLike(postId) {
    try {
      const response = await axiosReq.post(`/api/social/feed/${postId}/like/`);
      return response.data;
    } catch (err) {
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
      throw err;
    }
  },

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