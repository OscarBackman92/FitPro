import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { axiosReq, axiosRes } from '../services/axiosDefaults';
import { workoutService } from '../services/workoutService';
import toast from 'react-hot-toast';

const CurrentUserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  isLoading: true,
  isAuthenticated: false,
  workouts: [],
  workoutStats: null,
  fetchWorkouts: () => null,
  fetchWorkoutStats: () => null,
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

  const fetchWorkouts = async () => {
    try {
      const response = await workoutService.getWorkouts();
      setWorkouts(response.results);
    } catch (err) {
      toast.error('Failed to fetch workouts');
    }
  };

  const fetchWorkoutStats = async () => {
    try {
      const stats = await workoutService.getWorkoutStatistics();
      setWorkoutStats(stats);
    } catch (err) {
      toast.error('Failed to fetch workout stats');
    }
  };

  const handleMount = useCallback(async () => {
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
      
      await Promise.all([fetchWorkouts(), fetchWorkoutStats()]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, isLoading, isAuthenticated: !!currentUser, workouts, workoutStats }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
