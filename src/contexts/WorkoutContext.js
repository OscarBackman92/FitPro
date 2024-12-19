import React, { createContext, useContext, useState, useEffect } from 'react';
import workoutService from '../services/workoutService';

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
        setWorkouts(workoutList.results || workoutList);
      } catch (err) {
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
