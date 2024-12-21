import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { socialService } from '../../services/socialService';

// SocialActions component to handle like, comment, and share actions
const SocialActions = ({ workout, onLikeUpdate }) => {
  // Function to handle like button click
  const handleLike = async () => {
    try {
      // Toggle like status using socialService
      const response = await socialService.toggleLike(workout.id);
      // Update parent component with new like status
      onLikeUpdate(response);
      // Show success toast notification
      toast.success(workout.has_liked ? 'Removed like' : 'Added like');
    } catch (err) {
      // Show error toast notification
      toast.error('Failed to update like');
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Like button */}
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
      
      {/* Comment button */}
      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
        <MessageCircle className="h-5 w-5" />
        <span>{workout.comments_count}</span>
      </button>

      {/* Share button */}
      <button className="text-gray-500 hover:text-green-500 transition-colors">
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SocialActions;