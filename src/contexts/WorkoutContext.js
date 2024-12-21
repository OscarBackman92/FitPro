import React, { createContext, useContext, useState, useEffect } from 'react';
import workoutService from '../services/workoutService';

const WorkoutContext = createContext();
const SetWorkoutContext = createContext();

export const useWorkouts = () => useContext(WorkoutContext);
export const useSetWorkouts = () => useContext(SetWorkoutContext);

/**
 * WorkoutProvider component that provides workout-related context to its children.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @returns {JSX.Element} The provider component that wraps its children with workout context.
 *
 * @example
 * <WorkoutProvider>
 *   <YourComponent />
 * </WorkoutProvider>
 *
 * @context
 * @property {Array} workouts - The list of workouts.
 * @property {Object|null} stats - The workout statistics.
 * @property {boolean} loading - The loading state indicating if workouts are being loaded.
 * @context
 * @property {Function} setWorkouts - Function to update the workouts state.
 * @property {Function} setStats - Function to update the stats state.
 */
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
