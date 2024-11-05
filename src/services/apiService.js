// apiService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://fitnessapi-d773a1148384.herokuapp.com/api';

// Create axios instance with Heroku backend URL
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor for handling auth tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

const handleApiError = (err) => {
  console.error('API Error Details', {
    environment: process.env.NODE_ENV,
    apiUrl: API_URL,
    message: err.message,
    status: err.response?.status,
    response: err.response?.data,
    stack: err.stack,
  });
};

export const apiService = {
  getProfile: async (userId) => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    try {
      const response = await axiosInstance.get(`/profiles/${userId}/`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch profile');
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login/', credentials);
      if (response.data.key) {
        localStorage.setItem('token', response.data.key);
      }
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error(err.response?.data?.detail || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout/');
      localStorage.removeItem('token');
    } catch (err) {
      handleApiError(err);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/user/');
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch current user');
    }
  },


  updateProfile: async (userId, profileData) => {
    try {
      const response = await axiosInstance.put(`/profiles/${userId}/`, profileData);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to update profile');
    }
  },

  uploadProfileImage: async (userId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profile_image', imageFile);
      const response = await axiosInstance.post(
        `/profiles/${userId}/upload_image/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to upload profile image');
    }
  },

  // Workout endpoints
  getWorkouts: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/workouts/workouts/', { params });
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch workouts');
    }
  },

  getWorkout: async (workoutId) => {
    try {
      const response = await axiosInstance.get(`/workouts/workouts/${workoutId}/`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch workout');
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const response = await axiosInstance.post('/workouts/workouts/', workoutData);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to create workout');
    }
  },

  updateWorkout: async (workoutId, workoutData) => {
    try {
      const response = await axiosInstance.put(
        `/workouts/workouts/${workoutId}/`,
        workoutData
      );
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to update workout');
    }
  },

  deleteWorkout: async (workoutId) => {
    try {
      await axiosInstance.delete(`/workouts/workouts/${workoutId}/`);
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to delete workout');
    }
  },

  getWorkoutSummary: async () => {
    try {
      const response = await axiosInstance.get('/workouts/workouts/summary/');
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch workout summary');
    }
  },

  // Goals endpoints
  getGoals: async () => {
    try {
      const response = await axiosInstance.get('/goals/');
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch goals');
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await axiosInstance.post('/goals/', goalData);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to create goal');
    }
  },

  updateGoal: async (goalId, goalData) => {
    try {
      const response = await axiosInstance.put(`/goals/${goalId}/`, goalData);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to update goal');
    }
  },

  deleteGoal: async (goalId) => {
    try {
      await axiosInstance.delete(`/goals/${goalId}/`);
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to delete goal');
    }
  },

  toggleGoalCompletion: async (goalId) => {
    try {
      const response = await axiosInstance.post(`/goals/${goalId}/toggle_completion/`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to toggle goal completion');
    }
  },

  // Social endpoints
  followUser: async (userId) => {
    try {
      const response = await axiosInstance.post('/follows/follow/', { user_id: userId });
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to follow user');
    }
  },

  unfollowUser: async (userId) => {
    try {
      await axiosInstance.post('/follows/unfollow/', { user_id: userId });
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to unfollow user');
    }
  },

  getFeed: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/feed/', { params });
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch feed');
    }
  },

  likeWorkout: async (workoutId) => {
    try {
      const response = await axiosInstance.post('/likes/', { workout: workoutId });
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to like workout');
    }
  },

  unlikeWorkout: async (likeId) => {
    try {
      await axiosInstance.delete(`/likes/${likeId}/`);
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to unlike workout');
    }
  },

  commentOnWorkout: async (workoutId, content) => {
    try {
      const response = await axiosInstance.post('/comments/', {
        workout: workoutId,
        content
      });
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to post comment');
    }
  },

  deleteComment: async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}/`);
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to delete comment');
    }
  },

  // Stats and analytics
  getProfileStats: async (userId) => {
    try {
      const response = await axiosInstance.get(`/profiles/${userId}/stats/`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch profile stats');
    }
  },

  getGoalsSummary: async () => {
    try {
      const response = await axiosInstance.get('/goals/summary/');
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch goals summary');
    }
  }
};

export default apiService;