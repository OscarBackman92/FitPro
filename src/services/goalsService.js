// src/services/goalsService.js
import axiosInstance from './axiosInstance';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class GoalsService {
  async getGoals(params = {}) {
    try {
      logger.debug('Fetching goals', { params });
      const response = await axiosInstance.get('/goals/', { params });
      logger.info('Goals fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch goals');
    }
  }

  async createGoal(goalData) {
    try {
      logger.debug('Creating goal', { goalData });
      const response = await axiosInstance.post('/goals/', goalData);
      logger.info('Goal created successfully', { goalId: response.data.id });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to create goal');
    }
  }

  async updateGoal(goalId, goalData) {
    try {
      logger.debug('Updating goal', { goalId, goalData });
      const response = await axiosInstance.put(`/goals/${goalId}/`, goalData);
      logger.info('Goal updated successfully', { goalId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update goal');
    }
  }

  async deleteGoal(goalId) {
    try {
      logger.debug('Deleting goal', { goalId });
      await axiosInstance.delete(`/goals/${goalId}/`);
      logger.info('Goal deleted successfully', { goalId });
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to delete goal');
    }
  }

  async toggleGoalCompletion(goalId) {
    try {
      logger.debug('Toggling goal completion', { goalId });
      const response = await axiosInstance.post(`/goals/${goalId}/toggle_completion/`);
      logger.info('Goal completion toggled successfully', { goalId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to toggle goal completion');
    }
  }

  async getGoalSummary() {
    try {
      logger.debug('Fetching goal summary');
      const response = await axiosInstance.get('/goals/summary/');
      logger.info('Goal summary fetched successfully');
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch goal summary');
    }
  }
}

export const goalsService = new GoalsService();
export default goalsService;