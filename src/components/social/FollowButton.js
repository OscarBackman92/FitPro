import React, { useState } from 'react';
import { socialService } from '../../services/socialService';
import { UserPlus, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const FollowButton = ({ userId, isFollowing, onFollowUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const response = await socialService.followUser(userId);
      onFollowUpdate(response);
      toast.success(isFollowing ? 'Unfollowed user' : 'Following user');
    } catch (err) {
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${isFollowing 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-green-500 text-white hover:bg-green-600'}`}
    >
      {isFollowing ? (
        <UserCheck className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {loading ? 'Loading...' : (isFollowing ? 'Following' : 'Follow')}
    </button>
  );
};

export default FollowButton;