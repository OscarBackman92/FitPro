import React, { useState, useEffect } from 'react';
import { X, Share2 } from 'lucide-react';
import workoutService from '../../services/workoutService';
import { socialService } from '../../services/socialService';
import toast from 'react-hot-toast';

const WorkoutShareModal = ({ onClose }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await workoutService.getWorkouts();
        setWorkouts(response.results);
      } catch (err) {
        toast.error('Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const handleShare = async (workoutId) => {
    try {
      await socialService.shareWorkout(workoutId);
      toast.success('Workout shared successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to share workout');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-600">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Share Workout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : workouts.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {workouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div>
                    <h3 className="text-white font-medium">{workout.workout_type} Workout</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(workout.date_logged).toLocaleDateString()} • {workout.duration} mins
                    </p>
                  </div>
                  <button
                    onClick={() => handleShare(workout.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No workouts available to share
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutShareModal;
