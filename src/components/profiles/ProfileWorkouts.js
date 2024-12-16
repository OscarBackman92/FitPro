import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { DumbbellIcon, PlusCircle, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import workoutService from '../../services/workoutService';
import toast from 'react-hot-toast';

const WorkoutItem = ({ workout, isOwnProfile, onDelete, onEdit }) => {
  const intensityColors = {
    low: 'bg-green-500/20 text-green-400',
    moderate: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="flex justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">{workout.title}</h3>
          <div className="flex items-center gap-2">
            {isOwnProfile && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(workout.id);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(workout.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            {workout.workout_type}
          </span>
          <span className={`px-2 py-1 rounded-full text-sm ${intensityColors[workout.intensity]}`}>
            {workout.intensity}
          </span>
        </div>
      </div>
      <div className="text-right ml-4">
        <p className="text-gray-300">{workout.duration} mins</p>
        <p className="text-sm text-gray-400">
          {format(parseISO(workout.date_logged), "MMM d, yyyy")}
        </p>
      </div>
    </div>
  );
};

const EmptyState = ({ isOwnProfile, profileUsername, onCreateWorkout }) => (
  <div className="text-center py-8">
    <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
    <p className="text-gray-400">
      {isOwnProfile
        ? "You haven't logged any workouts yet."
        : `${profileUsername} hasn't logged any workouts yet.`}
    </p>
    {isOwnProfile && (
      <button
        onClick={onCreateWorkout}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Log Your First Workout
      </button>
    )}
  </div>
);

const ProfileWorkouts = ({ profileId, isOwnProfile, profileUsername }) => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await workoutService.listWorkouts({ owner: profileId });
      const filteredWorkouts = response.results.filter(
        (workout) => workout.owner === parseInt(profileId)
      );
      setWorkouts(filteredWorkouts);
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setError("Failed to fetch workouts");
      toast.error("Error fetching workouts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDelete = async (workoutId) => {
    if (!isOwnProfile) return;
    
    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    try {
      await workoutService.deleteWorkout(workoutId);
      await fetchWorkouts();
      toast.success("Workout deleted successfully");
    } catch (err) {
      toast.error("Failed to delete workout");
    }
  };

  const handleEdit = (workoutId) => {
    if (!isOwnProfile) return;
    navigate(`/workouts/${workoutId}/edit`);
  };

  const handleViewWorkout = (workoutId) => {
    navigate(`/workouts/${workoutId}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto" />
          <p className="text-gray-400 mt-4">Loading workouts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchWorkouts}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          {isOwnProfile ? "My Workouts" : `${profileUsername}'s Workouts`}
        </h2>
        {isOwnProfile && (
          <button
            onClick={() => navigate("/workouts/create")}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
              onClick={() => handleViewWorkout(workout.id)}
              className="cursor-pointer"
            >
              <WorkoutItem
                workout={workout}
                isOwnProfile={isOwnProfile}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          isOwnProfile={isOwnProfile}
          profileUsername={profileUsername}
          onCreateWorkout={() => navigate("/workouts/create")}
        />
      )}
    </div>
  );
};

export default ProfileWorkouts;