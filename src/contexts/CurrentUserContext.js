import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosReq } from '../services/axiosDefaults';
import { workoutService } from '../services/workoutService';

const CurrentUserContext = createContext();

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [workoutStats, setWorkoutStats] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const { data } = await axiosReq.get('api/auth/user/');
        setCurrentUser(data);
        
        // Load user's workouts and stats
        const [workoutsRes, statsRes] = await Promise.all([
          workoutService.getWorkouts(),
          workoutService.getWorkoutStatistics()
        ]);
        
        setWorkouts(workoutsRes.results);
        setWorkoutStats(statsRes);
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <CurrentUserContext.Provider 
      value={{ 
        currentUser, 
        setCurrentUser, 
        isLoading,
        workouts,
        workoutStats,
        setWorkouts,
        setWorkoutStats
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;