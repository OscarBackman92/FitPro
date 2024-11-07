// src/components/workouts/WorkoutForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchData } from '../../hooks';
import { workoutService } from '../../services/workoutService';
import logger from '../../services/loggerService';
import errorHandler from '../../services/errorHandlerService';

const WorkoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [workoutData, setWorkoutData] = useState({
    workout_type: '',
    duration: '',
    calories: '',
    intensity: 'moderate',
    notes: '',
    date_logged: new Date().toISOString().split('T')[0],
  });

  const { data: existingWorkout, loading, error } = useFetchData(
    async () => id ? workoutService.getWorkout(id) : null,
    [id]
  );

  useEffect(() => {
    if (existingWorkout) {
      logger.debug('Setting form data from existing workout', { workoutId: id });
      setWorkoutData(existingWorkout);
    }
  }, [existingWorkout, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      logger.debug('Submitting workout form', { 
        workoutId: id, 
        isUpdate: !!id 
      });

      if (id) {
        await workoutService.updateWorkout(id, workoutData);
      } else {
        await workoutService.createWorkout(workoutData);
      }
      
      navigate('/workouts');
    } catch (err) {
      const handledError = errorHandler.handleApiError(err);
      setErrors(handledError.errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Workout Type
          </label>
          <select
            name="workout_type"
            value={workoutData.workout_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select type</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="flexibility">Flexibility</option>
          </select>
          {errors.workout_type && (
            <p className="text-red-500 text-sm mt-1">{errors.workout_type}</p>
          )}
        </div>

        {/* Other form fields... */}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-green-500 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (id ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkoutForm;