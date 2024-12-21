import { axiosReq } from './axiosDefaults';

// Service object for handling comment-related API requests
export const commentsService = {
  // Fetch comments for a specific post
  async getPostComments(postId) {
    const response = await axiosReq.get(`api/comments/?post=${postId}`);
    return response.data;
  },

  // Create a new comment
  async createComment(data) {
    const response = await axiosReq.post('api/comments/', data);
    return response.data;
  },

  // Delete a comment by ID
  async deleteComment(id) {
    await axiosReq.delete(`api/comments/${id}/`);
  },

  // Update an existing comment by ID
  async updateComment(id, data) {
    const response = await axiosReq.put(`api/comments/${id}/`, data);
    return response.data;
  }
};

export default commentsService;