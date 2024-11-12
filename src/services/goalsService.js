import { axiosReq } from './axiosDefaults';
import errorHandler from './errorHandlerService';
import logger from './loggerService';

class GoalService {
  // Get all goals with optional filtering
  async getGoals(params = {}) {
    try {
      logger.debug('Fetching goals', { params });
      const response = await axiosReq.get('api/goals/', { params });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch goals:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch goals');
    }
  }

  // Get a single goal by ID
  async getGoal(id) {
    try {
      logger.debug('Fetching goal', { id });
      const response = await axiosReq.get(`api/goals/${id}/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch goal:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch goal');
    }
  }

  // Create a new goal
  async createGoal(goalData) {
    try {
      logger.debug('Creating goal', { goalData });
      const response = await axiosReq.post('api/goals/', goalData);
      logger.info('Goal created successfully');
      return response.data;
    } catch (err) {
      logger.error('Failed to create goal:', err);
      throw errorHandler.handleApiError(err, 'Failed to create goal');
    }
  }

  // Update an existing goal
  async updateGoal(id, goalData) {
    try {
      logger.debug('Updating goal', { id, goalData });
      const response = await axiosReq.put(`api/goals/${id}/`, goalData);
      logger.info('Goal updated successfully');
      return response.data;
    } catch (err) {
      logger.error('Failed to update goal:', err);
      throw errorHandler.handleApiError(err, 'Failed to update goal');
    }
  }

  // Delete a goal
  async deleteGoal(id) {
    try {
      logger.debug('Deleting goal', { id });
      await axiosReq.delete(`api/goals/${id}/`);
      logger.info('Goal deleted successfully');
      return true;
    } catch (err) {
      logger.error('Failed to delete goal:', err);
      throw errorHandler.handleApiError(err, 'Failed to delete goal');
    }
  }

  // Toggle goal completion status
  async toggleGoalCompletion(id) {
    try {
      logger.debug('Toggling goal completion', { id });
      const response = await axiosReq.post(`api/goals/${id}/toggle_completion/`);
      logger.info('Goal completion toggled successfully');
      return response.data;
    } catch (err) {
      logger.error('Failed to toggle goal completion:', err);
      throw errorHandler.handleApiError(err, 'Failed to toggle goal completion');
    }
  }

  // Get goal summary statistics
  async getGoalSummary() {
    try {
      logger.debug('Fetching goal summary');
      const response = await axiosReq.get('api/goals/summary/');
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch goal summary:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch goal summary');
    }
  }

  // Get goals by type
  async getGoalsByType(type) {
    try {
      logger.debug('Fetching goals by type', { type });
      const response = await axiosReq.get('api/goals/', {
        params: { type }
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch goals by type:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch goals by type');
    }
  }

  // Get active goals only
  async getActiveGoals() {
    try {
      logger.debug('Fetching active goals');
      const response = await axiosReq.get('api/goals/', {
        params: { completed: false }
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch active goals:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch active goals');
    }
  }

  // Get completed goals only
  async getCompletedGoals() {
    try {
      logger.debug('Fetching completed goals');
      const response = await axiosReq.get('api/goals/', {
        params: { completed: true }
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch completed goals:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch completed goals');
    }
  }

  // Get goals by deadline range
  async getGoalsByDeadlineRange(startDate, endDate) {
    try {
      logger.debug('Fetching goals by deadline range', { startDate, endDate });
      const response = await axiosReq.get('api/goals/', {
        params: {
          deadline_after: startDate,
          deadline_before: endDate
        }
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch goals by deadline range:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch goals by deadline range');
    }
  }

  // Get goal progress
  async getGoalProgress(id) {
    try {
      logger.debug('Fetching goal progress', { id });
      const response = await axiosReq.get(`api/goals/${id}/progress/`);
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch goal progress:', err);
      throw errorHandler.handleApiError(err, 'Failed to fetch goal progress');
    }
  }
}

export const goalsService = new GoalService();
export default goalsService;