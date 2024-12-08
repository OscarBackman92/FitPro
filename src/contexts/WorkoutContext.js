import { createContext, useContext, useState } from 'react';
import { useCurrentUser } from './CurrentUserContext';
import { workoutService } from '../services/workoutService';

export const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const { currentUser } = useCurrentUser();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getWorkouts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const response = await workoutService.getWorkouts();
      setWorkouts(response.results);
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkoutContext.Provider value={{ workouts, setWorkouts, loading, getWorkouts }}>
      {children}
    </WorkoutContext.Provider>
  );
};