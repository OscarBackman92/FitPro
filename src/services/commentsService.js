import { axiosReq } from './axiosDefaults';

export const commentsService = {
  async getPostComments(postId) {
    const response = await axiosReq.get(`api/comments/?post=${postId}`);
    return response.data;
  },

  async createComment(data) {
    const response = await axiosReq.post('api/comments/', data);
    return response.data;
  },

  async deleteComment(id) {
    await axiosReq.delete(`api/comments/${id}/`);
  },

  async updateComment(id, data) {
    const response = await axiosReq.put(`api/comments/${id}/`, data);
    return response.data;
  }
};

export default commentsService;