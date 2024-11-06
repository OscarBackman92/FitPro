import React, { useState } from 'react';
import { Send } from 'lucide-react';

const CommentSection = ({ comments, postId, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(postId, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900 mb-4">Comments</h4>
      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <img
              src={comment.user.profile_image || '/api/placeholder/32/32'}
              alt={comment.user.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg px-4 py-2">
                <p className="font-medium text-gray-900">{comment.user.username}</p>
                <p className="text-gray-600">{comment.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}
              </p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};