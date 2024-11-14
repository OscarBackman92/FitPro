// src/services/commentsService.js
import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class CommentsService {
  async getComments(workoutId) {
    try {
      logger.debug('Fetching comments', { workoutId });
      const response = await axiosReq.get(`api/workouts/${workoutId}/comments/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch comments:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch comments');
    }
  }

  async addComment(workoutId, content) {
    try {
      logger.debug('Adding comment', { workoutId, content });
      const response = await axiosReq.post(`api/workouts/${workoutId}/comments/`, {
        content
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to add comment:', err);
      throw errorHandler.handleApiError(err, 'Failed to add comment');
    }
  }

  async deleteComment(workoutId, commentId) {
    try {
      logger.debug('Deleting comment', { workoutId, commentId });
      await axiosReq.delete(`api/workouts/${workoutId}/comments/${commentId}/`);
    } catch (err) {
      logger.error('Failed to delete comment:', err);
      throw errorHandler.handleApiError(err, 'Failed to delete comment');
    }
  }
}

export const commentsService = new CommentsService();
export default commentsService;