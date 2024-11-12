import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { socialService } from '../../services/socialService';
import toast from 'react-hot-toast';

const Comments = ({ workoutId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await socialService.getComments(workoutId);
        setComments(response.results);
      } catch (err) {
        toast.error('Failed to load comments');
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
      const response = await socialService.addComment(workoutId, newComment);
      setComments([response, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading comments...</div>;
  }

  return (
    <div className="p-4 space-y-4">
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
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={comment.user.profile_image || '/default-avatar.png'}
              alt={comment.user.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <p className="font-medium">{comment.user.username}</p>
                <p className="text-gray-600">{comment.content}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;