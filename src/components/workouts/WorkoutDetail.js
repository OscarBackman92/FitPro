import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { axiosReq } from '../../services/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../common/Avatar';

const WorkoutDetail = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const { data } = await axiosReq.get(`api/workouts/workouts/${id}/`);
        setWorkout(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching workout:', err);
        setError('Failed to load workout details. Please try again.');
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axiosReq.delete(`api/workouts/workouts/${id}/`);
        navigate('/workouts');
      } catch (err) {
        setError('Failed to delete workout. Please try again.');
      }
    }
  };

  if (!hasLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen" aria-live="assertive">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 rounded-lg text-red-600">
        {error}
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
              src={workout?.profile_image || '/default-avatar.png'}  // Use default avatar if no image
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
                className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Workout Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-400">Duration</p>
            <p className="text-3xl font-semibold text-white">{workout?.duration} min</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-400">Date</p>
            <p className="text-3xl font-semibold text-white">
              {format(new Date(workout?.date_logged), 'MMM d')}
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

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-6">
          <button
            onClick={() => navigate('/workouts')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Workouts
          </button>
          {isOwner && (
            <button
              onClick={() => navigate('/workouts/create')}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Log Another Workout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
