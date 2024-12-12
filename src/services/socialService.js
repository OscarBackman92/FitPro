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
  }
};

export default socialService;