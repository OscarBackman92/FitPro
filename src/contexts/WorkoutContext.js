import React, { createContext, useContext, useState, useEffect } from 'react';
import workoutService from '../services/workoutService';
import toast from 'react-hot-toast';

const WorkoutContext = createContext();
const SetWorkoutContext = createContext();

export const useWorkouts = () => useContext(WorkoutContext);
export const useSetWorkouts = () => useContext(SetWorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true);
        const workoutList = await workoutService.listWorkouts();
        console.log('Fetched Workouts:', workoutList.results || workoutList); // Debugging fetched workouts
        setWorkouts(workoutList.results || workoutList); // Use `results` if pagination is used
      } catch (err) {
        toast.error('Failed to load workouts');
        console.error('Error loading workouts:', err); // Debugging error
      } finally {
        setLoading(false);
      }
    };
  
    loadWorkouts();
  }, []);

  return (
    <WorkoutContext.Provider value={{ workouts, stats, loading }}>
      <SetWorkoutContext.Provider value={{ setWorkouts, setStats }}>
        {children}
      </SetWorkoutContext.Provider>
    </WorkoutContext.Provider>
  );
};
