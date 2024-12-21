import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Send, Trash2 } from 'lucide-react';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { commentsService } from '../../services/commentsService';
import ProfileImageHandler from './ProfileImageHandler';
import toast from 'react-hot-toast';

const Comments = ({ workoutId }) => {
  // State variables to manage comments, new comment input, loading and submitting status
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useCurrentUser();

  // Fetch comments when the component mounts or workoutId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await commentsService.getComments(workoutId);
        setComments(response.results || []);
      } catch (err) {
        toast.error('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [workoutId]);

  // Handle form submission to add a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await commentsService.addComment(workoutId, newComment.trim());
      setComments(prev => [response, ...prev]);
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle comment deletion
  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsService.deleteComment(workoutId, commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  // Show loading spinner while comments are being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
            text-white placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <ProfileImageHandler
              src={comment.user.profile_image}
              alt={comment.user.username}
              size={32}
            />
            <div className="flex-1">
              <div className="bg-gray-700 rounded-lg px-4 py-2">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-white">
                    {comment.user.username}
                  </span>
                  {currentUser?.id === comment.user.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-300 mt-1">{comment.content}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}
              </span>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-gray-400 py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;