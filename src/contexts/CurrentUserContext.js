// src/contexts/CurrentUserContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosReq, axiosRes } from '../services/axiosDefaults';
import { workoutService } from '../services/workoutService';
import { profileService } from '../services/profileService';
import { socialService } from '../services/socialService';
import toast from 'react-hot-toast';

const CurrentUserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  isLoading: true,
  isAuthenticated: false,
  workouts: [],
  workoutStats: null,
  socialData: { feed: [], followers: [], following: [] },
  // Action methods
  fetchWorkouts: () => null,
  updateWorkout: () => null,
  deleteWorkout: () => null,
  createWorkout: () => null,
  toggleWorkoutLike: () => null,
  toggleFollow: () => null,
});

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [workoutStats, setWorkoutStats] = useState(null);
  const [socialData, setSocialData] = useState({
    feed: [],
    followers: [],
    following: []
  });
  const navigate = useNavigate();

  // Authentication and user data
  const handleMount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      axiosReq.defaults.headers.common["Authorization"] = `Token ${token}`;
      axiosRes.defaults.headers.common["Authorization"] = `Token ${token}`;

      const { data } = await axiosRes.get("api/auth/user/");
      setCurrentUser(data);
      
      // After setting user, fetch related data
      await Promise.all([
        fetchWorkouts(),
        fetchWorkoutStats(),
        fetchSocialData()
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  // Workout related methods
  const fetchWorkouts = async () => {
    try {
      const response = await workoutService.getWorkouts();
      setWorkouts(response.results);
    } catch (err) {
      toast.error('Failed to fetch workouts');
    }
  };

  const createWorkout = async (workoutData) => {
    try {
      const response = await workoutService.createWorkout(workoutData);
      setWorkouts(prev => [response, ...prev]);
      toast.success('Workout created successfully');
      return response;
    } catch (err) {
      toast.error('Failed to create workout');
      throw err;
    }
  };

  const updateWorkout = async (id, workoutData) => {
    try {
      const response = await workoutService.updateWorkout(id, workoutData);
      setWorkouts(prev => prev.map(workout => 
        workout.id === id ? response : workout
      ));
      toast.success('Workout updated successfully');
      return response;
    } catch (err) {
      toast.error('Failed to update workout');
      throw err;
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await workoutService.deleteWorkout(id);
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
      toast.success('Workout deleted successfully');
    } catch (err) {
      toast.error('Failed to delete workout');
      throw err;
    }
  };

  const fetchWorkoutStats = async () => {
    try {
      const stats = await workoutService.getWorkoutStatistics();
      setWorkoutStats(stats);
    } catch (err) {
      console.error('Failed to fetch workout stats:', err);
    }
  };

  // Social related methods
  const fetchSocialData = async () => {
    try {
      const [feed, followers, following] = await Promise.all([
        socialService.getFeed(),
        socialService.getFollowers(),
        socialService.getFollowing()
      ]);
      setSocialData({
        feed: feed.results,
        followers: followers.results,
        following: following.results
      });
    } catch (err) {
      console.error('Failed to fetch social data:', err);
    }
  };

  const toggleWorkoutLike = async (workoutId) => {
    try {
      const response = await socialService.toggleLike(workoutId);
      setWorkouts(prev => prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, has_liked: !workout.has_liked } 
          : workout
      ));
      return response;
    } catch (err) {
      toast.error('Failed to toggle like');
      throw err;
    }
  };

  const toggleFollow = async (userId) => {
    try {
      const response = await socialService.toggleFollow(userId);
      setSocialData(prev => ({
        ...prev,
        following: response.isFollowing
          ? [...prev.following, response.user]
          : prev.following.filter(user => user.id !== userId)
      }));
      return response;
    } catch (err) {
      toast.error('Failed to toggle follow');
      throw err;
    }
  };

  const contextValue = {
    currentUser,
    setCurrentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    workouts,
    workoutStats,
    socialData,
    // Methods
    fetchWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    toggleWorkoutLike,
    toggleFollow
  };

  return (
    <CurrentUserContext.Provider value={contextValue}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;