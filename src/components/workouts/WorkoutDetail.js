import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { axiosReq } from '../../services/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

const WorkoutDetail = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axiosReq.get(`api/workouts/${id}/`);
        setWorkout(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Workout not found');
          toast.error('This workout does not exist');
        } else {
          setError('Failed to load workout details');
          toast.error('Error loading workout');
        }
        console.error('Error fetching workout:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axiosReq.delete(`api/workouts/${id}/`);
        toast.success('Workout deleted successfully');
        navigate('/workouts');
      } catch (err) {
        toast.error('Failed to delete workout');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" aria-live="assertive">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/workouts')}
            className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No workout found</p>
          <button
            onClick={() => navigate('/workouts')}
            className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.profile_id === workout?.profile_id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Workout Header */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-6">
            <Avatar
              src={workout?.profile_image}
              text={workout?.owner}
              height={48}
              className="rounded-full"
            />
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {workout?.workout_type_display} Workout
              </h2>
              <p className="text-gray-400 text-sm">
                by {workout?.owner}
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/workouts/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 
                  rounded-lg hover:bg-green-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 
                  rounded-lg hover:bg-red-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-400">Duration</p>
            <p className="text-3xl font-semibold text-white">{workout?.duration} min</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-400">Date</p>
            <p className="text-3xl font-semibold text-white">
              {workout?.date_logged ? format(new Date(workout.date_logged), 'MMM d') : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-400">Intensity</p>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
              ${workout?.intensity === 'high' 
                ? 'bg-red-600 text-white' 
                : workout?.intensity === 'moderate'
                ? 'bg-yellow-500 text-white'
                : 'bg-green-600 text-white'}`}
            >
              {workout?.intensity}
            </span>
          </div>
        </div>

        {/* Notes Section */}
        {workout?.notes && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Notes</h3>
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-300 whitespace-pre-line">{workout.notes}</p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/workouts')}
            className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;