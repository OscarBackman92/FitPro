import { useState, useCallback } from 'react';
import { workoutService } from '../services/workoutService';
import { useWorkout as useWorkoutContext } from '../contexts/WorkoutContext';
import toast from 'react-hot-toast';

export const useWorkout = () => {
  const [loading, setLoading] = useState(false);
  const { workouts, setWorkouts } = useWorkoutContext();

  const createWorkout = useCallback(async (workoutData) => {
    setLoading(true);
    try {
      const response = await workoutService.createWorkout(workoutData);
      setWorkouts((prev) => [response, ...prev]);
      toast.success('Workout created successfully');
      return response;
    } catch (err) {
      toast.error('Failed to create workout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setWorkouts]);

  const updateWorkout = useCallback(async (id, workoutData) => {
    setLoading(true);
    try {
      const response = await workoutService.updateWorkout(id, workoutData);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === id ? response : w))
      ); // Update the workout in the context
      toast.success('Workout updated successfully');
      return response;
    } catch (err) {
      toast.error('Failed to update workout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setWorkouts]);

  const deleteWorkout = useCallback(async (id) => {
    setLoading(true);
    try {
      await workoutService.deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      toast.success('Workout deleted successfully');
    } catch (err) {
      toast.error('Failed to delete workout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setWorkouts]);

  return {
    workouts, // Expose the workouts from the context
    loading,
    createWorkout,
    updateWorkout,
    deleteWorkout,
  };
};
