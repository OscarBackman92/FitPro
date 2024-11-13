import React, { useState } from 'react';
import { Share2, X, Check, Copy } from 'lucide-react';
import { socialService } from '../../services/socialService';
import toast from 'react-hot-toast';

const ShareWorkout = ({ workout, onClose }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await socialService.shareWorkout(workout.id);
      toast.success('Workout shared to your feed!');
      onClose();
    } catch (err) {
      toast.error('Failed to share workout');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = () => {
    const workoutUrl = `${window.location.origin}/workouts/${workout.id}`;
    navigator.clipboard.writeText(workoutUrl)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Share Workout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-2">{workout.workout_type} Workout</h3>
            <p className="text-sm text-gray-600">
              {workout.duration} minutes • {workout.intensity} intensity
            </p>
          </div>

          {/* Share Options */}
          <div className="space-y-4">
            {/* Share to Feed */}
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isSharing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="h-5 w-5" />
                  Share to Feed
                </>
              )}
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Copy className="h-5 w-5" />
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareWorkout;