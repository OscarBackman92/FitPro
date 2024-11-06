// src/components/social/CommentSection.js
import React, { useState, useEffect } from 'react';
import { Send, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../Avatar';
import socialService from '../../services/socialService';

export const CommentSection = ({ workoutId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await socialService.getComments(workoutId);
        setComments(data.results);
        setError(null);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [workoutId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await socialService.addComment(workoutId, newComment);
      setComments([...comments, comment]);
      setNewComment('');
      setError(null);
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await socialService.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      setError(null);
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar
              src={comment.user.profile_image}
              text={comment.user.username}
              height={32}
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg px-4 py-2">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-900">
                    {comment.user.username}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                    </span>
                    {currentUser?.username === comment.user.username && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-500 hover:text-red-600"
                        aria-label="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{comment.content}</p>
              </div>
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

export default CommentSection;