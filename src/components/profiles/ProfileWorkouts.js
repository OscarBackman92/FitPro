import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { DumbbellIcon, PlusCircle } from 'lucide-react';
import workoutService from '../../services/workoutService';
import toast from 'react-hot-toast';

const ProfileWorkouts = ({ profileId, isOwnProfile, profileUsername }) => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching workouts for Profile ID: ${profileId}`);
        const response = await workoutService.listWorkouts({ owner: profileId });
        console.log('Fetched workouts response:', response);

        // Only keep workouts that belong to this profile ID
        const filteredWorkouts = response.results.filter(
          (workout) => workout.owner === profileId
        );
        console.log('Filtered workouts:', filteredWorkouts);

        setWorkouts(filteredWorkouts);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to fetch workouts');
        toast.error('Error fetching workouts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [profileId]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto" />
        <p className="text-gray-400 mt-4">Loading workouts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          {isOwnProfile ? 'My Workouts' : `${profileUsername}'s Workouts`}
        </h2>
        {isOwnProfile && (
          <button
            onClick={() => navigate('/workouts/create')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 
              text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            Log Workout
          </button>
        )}
      </div>

      {workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex justify-between p-4 bg-gray-700/50 rounded-lg 
                hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => navigate(`/workouts/${workout.id}`)}
            >
              <div>
                <h3 className="font-medium text-white">{workout.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span
                    className="px-2 py-1 bg-green-500/20 text-green-400 
                      rounded-full text-sm"
                  >
                    {workout.workout_type}
                  </span>
                  <span
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 
                      rounded-full text-sm"
                  >
                    {workout.intensity}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300">{workout.duration} mins</p>
                <p className="text-sm text-gray-400">
                  {format(new Date(workout.date_logged), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            {isOwnProfile
              ? 'You haven’t logged any workouts yet.'
              : `${profileUsername} hasn’t logged any workouts yet.`}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => navigate('/workouts/create')}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg 
                hover:bg-green-600 transition-colors"
            >
              Log Your First Workout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileWorkouts;
