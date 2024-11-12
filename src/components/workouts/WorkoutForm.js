import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutService } from '../../services/workoutService';
import { useWorkout } from '../../contexts/WorkoutContext'; 
import errorHandler from '../../services/errorHandlerService';

const WorkoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchWorkouts } = useWorkout(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const WORKOUT_TYPES = [
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' },
  ];

  const [workoutData, setWorkoutData] = useState({
    workout_type: '',
    duration: '',
    intensity: 'moderate',
    notes: '',
    date_logged: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const loadWorkoutData = async () => {
      if (id) {
        setLoading(true);
        try {
          const existingWorkout = await workoutService.getWorkout(id);
          setWorkoutData(existingWorkout);
        } catch (err) {
          const handledError = errorHandler.handleApiError(err);
          setErrors(handledError.errors);
        } finally {
          setLoading(false);
        }
      }
    };

    loadWorkoutData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Basic client-side validation before submitting
    if (!workoutData.workout_type || !workoutData.duration || !workoutData.date_logged) {
      setErrors({
        workout_type: 'Workout type is required',
        duration: 'Duration is required',
        date_logged: 'Date is required',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (id) {
        await workoutService.updateWorkout(id, workoutData);
      } else {
        await workoutService.createWorkout(workoutData);
      }
      fetchWorkouts(); 
      navigate('/workouts');
    } catch (err) {
      const handledError = errorHandler.handleApiError(err);
      setErrors(handledError.errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-center mb-6 text-white">{id ? 'Update Workout' : 'Create Workout'}</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Workout Type</label>
          <select
            name="workout_type"
            value={workoutData.workout_type}
            onChange={handleChange}
            className={`mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 ${errors.workout_type ? 'border-red-500' : 'border-gray-600'}`}
          >
            <option value="">Select type</option>
            {WORKOUT_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.workout_type && (
            <p className="text-red-500 text-sm mt-1">{errors.workout_type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={workoutData.duration}
            onChange={handleChange}
            className={`mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 ${errors.duration ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Intensity</label>
          <select
            name="intensity"
            value={workoutData.intensity}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 border-gray-600"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Date Logged</label>
          <input
            type="date"
            name="date_logged"
            value={workoutData.date_logged}
            onChange={handleChange}
            className={`mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 ${errors.date_logged ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.date_logged && (
            <p className="text-red-500 text-sm mt-1">{errors.date_logged}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Notes</label>
          <textarea
            name="notes"
            value={workoutData.notes}
            onChange={handleChange}
            className="mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 border-gray-600"
            rows="3"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-6">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (id ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkoutForm;
