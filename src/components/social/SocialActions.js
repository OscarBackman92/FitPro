import React, { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import ShareWorkout from './ShareWorkout';
import toast from 'react-hot-toast';
import { socialService } from '../../services/socialService';

const SocialActions = ({ workout, onLikeUpdate }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLike = async () => {
    try {
      const response = await socialService.toggleLike(workout.id);
      onLikeUpdate(response);
      toast.success(workout.has_liked ? 'Removed like' : 'Added like');
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors
            ${workout.has_liked 
              ? 'text-red-500' 
              : 'text-gray-500 hover:text-red-500'}`}
        >
          <Heart 
            className={`h-5 w-5 ${workout.has_liked ? 'fill-current' : ''}`} 
          />
          <span>{workout.likes_count}</span>
        </button>
        
        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span>{workout.comments_count}</span>
        </button>

        <button 
          onClick={() => setShowShareModal(true)}
          className="text-gray-500 hover:text-green-500 transition-colors"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {showShareModal && (
        <ShareWorkout
          workout={workout}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};

export default SocialActions;