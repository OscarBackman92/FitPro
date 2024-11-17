import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import toast from 'react-hot-toast';

const WorkoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workouts, createWorkout, updateWorkout, deleteWorkout } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [workoutData, setWorkoutData] = useState({
    title: '',
    workout_type: '',
    duration: '',
    intensity: 'moderate',
    notes: '',
    date_logged: new Date().toISOString().split('T')[0]
  });

  const WORKOUT_TYPES = [
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (id) {
      const workout = workouts.find(w => w.id === parseInt(id));
      if (workout) {
        setWorkoutData({
          title: workout.title || '',
          workout_type: workout.workout_type || '',
          duration: workout.duration || '',
          intensity: workout.intensity || 'moderate',
          notes: workout.notes || '',
          date_logged: workout.date_logged || new Date().toISOString().split('T')[0]
        });
      } else {
        toast.error('Workout not found');
        navigate('/workouts');
      }
    }
  }, [id, workouts, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any errors when user makes changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!workoutData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!workoutData.workout_type) {
      newErrors.workout_type = 'Workout type is required';
    }
    if (!workoutData.duration) {
      newErrors.duration = 'Duration is required';
    } else if (workoutData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    if (!workoutData.date_logged) {
      newErrors.date_logged = 'Date is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (id) {
        await updateWorkout(id, workoutData);
        toast.success('Workout updated');
      } else {
        await createWorkout(workoutData);
        toast.success('Workout created');
      }
      navigate('/workouts');
    } catch (err) {
      const serverErrors = err.errors || {};
      setErrors(serverErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteWorkout(id);
        toast.success('Workout deleted');
        navigate('/workouts');
      } catch (err) {
        toast.error('Failed to delete workout');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-4 lg:mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {id ? 'Edit Workout' : 'Create Workout'}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            value={workoutData.title}
            onChange={handleChange}
            className={`mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 
              ${errors.title ? 'border-red-500' : 'border-gray-600'}`}
            placeholder="Give your workout a title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Workout Type Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Workout Type</label>
          <select
            name="workout_type"
            value={workoutData.workout_type}
            onChange={handleChange}
            className={`mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 
              ${errors.workout_type ? 'border-red-500' : 'border-gray-600'}`}
          >
            <option value="">Select type</option>
            {WORKOUT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.workout_type && (
            <p className="text-red-500 text-sm mt-1">{errors.workout_type}</p>
          )}
        </div>

        {/* Duration Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={workoutData.duration}
            onChange={handleChange}
            className={`mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 
              ${errors.duration ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        {/* Intensity Field */}
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

        {/* Date Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            name="date_logged"
            value={workoutData.date_logged}
            onChange={handleChange}
            className={`mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 
              ${errors.date_logged ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.date_logged && (
            <p className="text-red-500 text-sm mt-1">{errors.date_logged}</p>
          )}
        </div>

        {/* Notes Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Notes</label>
          <textarea
            name="notes"
            value={workoutData.notes}
            onChange={handleChange}
            rows="3"
            className="mt-2 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 border-gray-600"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          {/* Right side - Cancel and Save buttons */}
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-6 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (id ? 'Update' : 'Create')}
          </button>

          {/* Left side - Delete button (only shows when editing) */}
          {id && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2 text-red-400 hover:text-white hover:bg-red-500 rounded-md border border-red-400 hover:border-red-500"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default WorkoutForm;
