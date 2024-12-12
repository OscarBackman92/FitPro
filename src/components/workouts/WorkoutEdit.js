import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import workoutService from '../../services/workoutService';
import { 
  Save, 
  X, 
  Loader, 
  AlertCircle, 
  DumbbellIcon,
  Trash2 
} from 'lucide-react';
import toast from 'react-hot-toast';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full space-y-4 border border-gray-700">
        <h3 className="text-xl font-semibold text-white">Delete Workout</h3>
        <p className="text-gray-300">
          Are you sure you want to delete this workout? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-300"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const WorkoutEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [workoutData, setWorkoutData] = useState({
    title: '',
    workout_type: '',
    duration: '',
    intensity: 'moderate',
    notes: '',
    date_logged: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const data = await workoutService.getWorkout(id);
        setWorkoutData(data);
      } catch (err) {
        toast.error('Failed to load workout');
        navigate('/workouts');
      }
    };

    loadWorkout();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!workoutData.title) newErrors.title = 'Title is required';
    if (!workoutData.workout_type) newErrors.workout_type = 'Workout type is required';
    if (!workoutData.duration || workoutData.duration <= 0 || workoutData.duration > 1440) {
      newErrors.duration = 'Duration must be between 1 and 1440 minutes';
    }
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
      await workoutService.updateWorkout(id, workoutData);
      toast.success('Workout updated successfully');
      navigate('/workouts');
    } catch (err) {
      toast.error('Failed to update workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await workoutService.deleteWorkout(id);
      toast.success('Workout deleted successfully');
      navigate('/workouts');
    } catch (err) {
      toast.error('Failed to delete workout');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between border-b border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <DumbbellIcon className="h-6 w-6 text-green-500" />
            Edit Workout
          </h2>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-red-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
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
              className={`mt-1 block w-full rounded-md p-2 bg-gray-700 border 
                ${errors.title ? 'border-red-500' : 'border-gray-600'} 
                text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter workout title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Workout Type Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Workout Type</label>
            <select
              name="workout_type"
              value={workoutData.workout_type}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md p-2 bg-gray-700 border 
                ${errors.workout_type ? 'border-red-500' : 'border-gray-600'} 
                text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <option value="">Select type</option>
              <option value="cardio">Cardio</option>
              <option value="strength">Strength Training</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
            {errors.workout_type && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.workout_type}
              </p>
            )}
          </div>

          {/* Duration and Intensity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={workoutData.duration}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md p-2 bg-gray-700 border 
                  ${errors.duration ? 'border-red-500' : 'border-gray-600'} 
                  text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.duration}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Intensity</label>
              <select
                name="intensity"
                value={workoutData.intensity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md p-2 bg-gray-700 border border-gray-600 
                  text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Date</label>
            <input
              type="date"
              name="date_logged"
              value={workoutData.date_logged}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md p-2 bg-gray-700 border 
                ${errors.date_logged ? 'border-red-500' : 'border-gray-600'} 
                text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.date_logged && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.date_logged}
              </p>
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
              className="mt-1 block w-full rounded-md p-2 bg-gray-700 border border-gray-600 
                text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/workouts')}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors 
                flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Update
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default WorkoutEdit;