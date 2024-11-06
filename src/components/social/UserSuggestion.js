import React from 'react';
import { UserPlus } from 'lucide-react';

const UserSuggestions = ({ users, onFollow }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Suggested Users</h3>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.profile_image || '/api/placeholder/40/40'}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">{user.followers_count} followers</p>
              </div>
            </div>
            <button
              onClick={() => onFollow(user.id)}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <UserPlus className="h-4 w-4" />
              <span>Follow</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Post, CommentSection, UserSuggestions };