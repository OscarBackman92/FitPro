import { axiosReq } from './axiosDefaults';

export const socialService = {
  async getFeed(params = {}) {
    const response = await axiosReq.get('api/posts/posts/', { params });
    return response.data;
  },

  async shareWorkout(workoutId) {
    const response = await axiosReq.post('api/posts/posts/', { workout: workoutId });
    return response.data;
  },

  async toggleLike(postId) {
    const response = await axiosReq.post('api/likes/likes/', { post: postId });
    return response.data;
  },

  async followUser(userId) {
    const response = await axiosReq.post('api/followers/followers/', { followed: userId });
    return response.data;
  },

  async unfollowUser(userId) {
    await axiosReq.delete(`api/followers/followers/${userId}/`);
  },

  async getProfile(userId) {
    const response = await axiosReq.get(`api/profiles/${userId}/`);
    return response.data;
  }
};

export default socialService;