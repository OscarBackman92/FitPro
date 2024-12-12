// src/components/social/WorkoutShareModal.js
import React, { useState, useEffect } from 'react';
import { X, Share2, Loader } from 'lucide-react';
import workoutService from '../../services/workoutService';
import { socialService } from '../../services/socialService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const WorkoutShareModal = ({ onClose }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await workoutService.listWorkouts({ ordering: '-date_logged' });
        setWorkouts(response.results || []);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        toast.error('Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleShare = async (workoutId) => {
    setSharing(true);
    try {
      await socialService.shareWorkout(workoutId);
      toast.success('Workout shared successfully!');
      onClose();
    } catch (err) {
      console.error('Error sharing workout:', err);
      toast.error('Failed to share workout');
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Share Workout</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-300 transition-colors"
            disabled={sharing}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-green-500" />
            </div>
          ) : workouts.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {workouts.map((workout) => (
                <div 
                  key={workout.id} 
                  className="flex items-center justify-between bg-gray-700/50 p-4 rounded-lg border border-gray-600"
                >
                  <div>
                    <h3 className="text-white font-medium">{workout.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-sm text-gray-400">
                        {format(new Date(workout.date_logged), 'MMM d, yyyy')}
                      </span>
                      <span className="text-sm text-gray-400">
                        • {workout.duration} mins
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-sm">
                        {workout.workout_type}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        {workout.intensity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleShare(workout.id)}
                    disabled={sharing}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white 
                      rounded-lg hover:bg-green-600 disabled:opacity-50 
                      disabled:cursor-not-allowed transition-colors"
                  >
                    {sharing ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
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