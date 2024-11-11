import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

const Post = ({ post, onLike, onComment }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={post.user.profile_image || '/api/placeholder/40/40'}
          alt={post.user.username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{post.user.username}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(post.created_at), 'MMM d, yyyy • h:mm a')}
          </p>
        </div>
      </div>

      {/* Workout Details */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {post.workout_type}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {post.duration} mins
          </span>
        </div>
        {post.notes && (
          <p className="text-gray-600 mt-2">{post.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 ${
            post.hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart className={`h-5 w-5 ${post.hasLiked ? 'fill-current' : ''}`} />
          <span>{post.likes_count}</span>
        </button>
        <button
          onClick={() => onComment(post.id)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{post.comments_count}</span>
        </button>
      </div>
    </div>
  );
};