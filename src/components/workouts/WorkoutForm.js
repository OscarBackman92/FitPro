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
    date_logged: new Date().toISOString().split('T')[0], // Initialize with today's date
  });

  useEffect(() => {
    const loadWorkoutData = async () => {
      if (id) {
        try {
          const existingWorkout = await workoutService.getWorkout(id);
          console.log('Existing Workout:', existingWorkout); // Log for debugging
          setWorkoutData(existingWorkout);
        } catch (err) {
          const handledError = errorHandler.handleApiError(err);
          setErrors(handledError.errors);
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
  
    console.log('Submitting workout data:', workoutData); // Debug log
  
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

  // Add a check to prevent errors accessing properties of undefined
  if (!workoutData) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">{id ? 'Update Workout' : 'Create Workout'}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Workout Type</label>
          <select
            name="workout_type"
            value={workoutData.workout_type}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${errors.workout_type ? 'border-red-500' : ''}`}
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
          <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={workoutData.duration}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${errors.duration ? 'border-red-500' : ''}`}
            required
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Intensity</label>
          <select
            name="intensity"
            value={workoutData.intensity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date Logged</label>
          <input
            type="date"
            name="date_logged"
            value={workoutData.date_logged}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${errors.date_logged ? 'border-red-500' : ''}`}
            required
          />
          {errors.date_logged && (
            <p className="text-red-500 text-sm mt-1">{errors.date_logged}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={workoutData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows="3"
          ></textarea>
        </div>

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
