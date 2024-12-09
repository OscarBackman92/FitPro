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
        const [workoutList, statistics] = await Promise.all([
          workoutService.listWorkouts(),
          workoutService.getStatistics(),
        ]);
        setWorkouts(workoutList.results);
        setStats(statistics);
      } catch (err) {
        toast.error('Failed to load workouts');
        console.error(err);
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
