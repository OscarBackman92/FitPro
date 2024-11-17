import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Edit2, Save, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workouts, createWorkout, updateWorkout, deleteWorkout } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(!id);
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

  const INTENSITY_LEVELS = [
    { value: 'low', label: 'Low', className: 'bg-green-500/20 text-green-400' },
    { value: 'moderate', label: 'Moderate', className: 'bg-yellow-500/20 text-yellow-400' },
    { value: 'high', label: 'High', className: 'bg-red-500/20 text-red-400' }
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
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

  const validateForm = () => {
    const newErrors = {};
    if (!workoutData.title.trim()) newErrors.title = 'Title is required';
    if (!workoutData.workout_type) newErrors.workout_type = 'Workout type is required';
    if (!workoutData.duration) newErrors.duration = 'Duration is required';
    else if (workoutData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    if (!workoutData.date_logged) newErrors.date_logged = 'Date is required';
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
        setIsEditing(false);
        toast.success('Workout updated');
      } else {
        await createWorkout(workoutData);
        toast.success('Workout created');
        navigate('/workouts');
      }
    } catch (err) {
      setErrors(err.errors || {});
      toast.error('Failed to save workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-4 lg:mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          {id ? (isEditing ? 'Edit Workout' : 'Workout Details') : 'Create Workout'}
        </h2>
        {id && (
          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Cancel editing"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  title="Edit workout"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete workout"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Title</label>
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={workoutData.title}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 
                ${errors.title ? 'border-red-500' : 'border-gray-600'}`}
              placeholder="Give your workout a title"
            />
          ) : (
            <p className="mt-1 p-3 bg-gray-700 rounded-md text-white">{workoutData.title}</p>
          )}
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Workout Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Workout Type</label>
          {isEditing ? (
            <select
              name="workout_type"
              value={workoutData.workout_type}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 
                ${errors.workout_type ? 'border-red-500' : 'border-gray-600'}`}
            >
              <option value="">Select type</option>
              {WORKOUT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          ) : (
            <span className="mt-1 inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
              {WORKOUT_TYPES.find(t => t.value === workoutData.workout_type)?.label || workoutData.workout_type}
            </span>
          )}
          {errors.workout_type && (
            <p className="mt-1 text-sm text-red-500">{errors.workout_type}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Duration (minutes)</label>
          {isEditing ? (
            <input
              type="number"
              name="duration"
              value={workoutData.duration}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 
                ${errors.duration ? 'border-red-500' : 'border-gray-600'}`}
            />
          ) : (
            <p className="mt-1 p-3 bg-gray-700 rounded-md text-white">{workoutData.duration} minutes</p>
          )}
          {errors.duration && (
            <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
          )}
        </div>

        {/* Intensity */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Intensity</label>
          {isEditing ? (
            <select
              name="intensity"
              value={workoutData.intensity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 border-gray-600"
            >
              {INTENSITY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          ) : (
            <span className={`mt-1 inline-block px-3 py-1 rounded-full 
              ${INTENSITY_LEVELS.find(l => l.value === workoutData.intensity)?.className}`}
            >
              {INTENSITY_LEVELS.find(l => l.value === workoutData.intensity)?.label}
            </span>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Date</label>
          {isEditing ? (
            <input
              type="date"
              name="date_logged"
              value={workoutData.date_logged}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 
                ${errors.date_logged ? 'border-red-500' : 'border-gray-600'}`}
            />
          ) : (
            <p className="mt-1 p-3 bg-gray-700 rounded-md text-white">
              {new Date(workoutData.date_logged).toLocaleDateString()}
            </p>
          )}
          {errors.date_logged && (
            <p className="mt-1 text-sm text-red-500">{errors.date_logged}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Notes</label>
          {isEditing ? (
            <textarea
              name="notes"
              value={workoutData.notes}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md p-3 text-sm bg-gray-700 text-white border-2 border-gray-600"
            />
          ) : (
            <p className="mt-1 p-3 bg-gray-700 rounded-md text-white whitespace-pre-wrap">
              {workoutData.notes || 'No notes added'}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-4 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md"
          >
            Back to List
          </button>
          {isEditing && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 hover:bg-green-600 
                rounded-md disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {isSubmitting ? 'Saving...' : (id ? 'Update' : 'Create')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;