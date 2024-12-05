import { axiosReq } from './axiosDefaults';

export const goalsService = {
  async getGoals(params = {}) {
    const response = await axiosReq.get('api/goals/', { params });
    return response.data;
  },

  async getGoal(id) {
    const response = await axiosReq.get(`api/goals/${id}/`);
    return response.data;
  },

  async createGoal(data) {
    const response = await axiosReq.post('api/goals/', data);
    return response.data;
  },

  async updateGoal(id, data) {
    const response = await axiosReq.put(`api/goals/${id}/`, data);
    return response.data;
  },

  async deleteGoal(id) {
    await axiosReq.delete(`api/goals/${id}/`);
  },

  async toggleGoalCompletion(id) {
    const response = await axiosReq.post(`api/goals/${id}/toggle_completion/`);
    return response.data;
  }
};

export default goalsService;