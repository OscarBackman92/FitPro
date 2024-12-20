import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Share2, MessageCircle, Heart, X } from 'lucide-react';
import { socialService } from '../../services/socialService';
import WorkoutShareModal from './WorkoutShareModal';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

const SocialFeed = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentingOnPost, setCommentingOnPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log('Fetching posts...');
    try {
      setLoading(true);
      const data = await socialService.getFeed();
      const firstPost = data.results[0];
      console.log('First post full data:', JSON.stringify(firstPost, null, 2));
      console.log('User object:', JSON.stringify(firstPost.user, null, 2));
      setPosts(data.results);
    } catch (err) {
      console.error('Error fetching feed:', err);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      await socialService.toggleLike(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? {
              ...post,
              likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1,
              has_liked: !isLiked
            }
          : post
      ));
    } catch (err) {
      console.error('Error updating like:', err);
      toast.error('Failed to update like');
    }
  };

  const handleComment = async (postId) => {
    if (!newComment.trim()) return;
    
    try {
      const comment = await socialService.addComment(postId, newComment.trim());
      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments_count: post.comments_count + 1,
              latest_comments: [comment, ...(post.latest_comments || [])]
            }
          : post
      ));
      
      setNewComment('');
      setCommentingOnPost(null);
      toast.success('Comment added');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await socialService.deleteComment(commentId);
      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments_count: post.comments_count - 1,
              latest_comments: post.latest_comments.filter(c => c.id !== commentId)
            }
          : post
      ));
      toast.success('Comment deleted');
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Share a Workout Button */}
      <div className="mb-8 max-w-2xl mx-auto">
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full flex items-center justify-center gap-2 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Share2 className="h-5 w-5" />
          Share a Workout
        </button>
      </div>

      {/* Social Feed */}
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-4">
              <div 
                onClick={() => navigate(`/profiles/${post.user.id}`)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Avatar
                  src={`https://res.cloudinary.com/dufw4ursl/image/upload/${post.user?.profile_image}`}
                  text={post.user?.username}
                  height={40}
                />
              </div>
              <div>
                <h3 className="font-medium text-white">{post.user.username}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Workout Details */}
            {post.workout && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                    {post.workout.workout_type}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                    {post.workout.duration} mins
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-sm">
                    {post.workout.intensity}
                  </span>
                </div>
                {post.workout.notes && (
                  <p className="mt-2 text-gray-300">{post.workout.notes}</p>
                )}
              </div>
            )}

            {/* Like and Comment Section */}
            <div className="flex items-center gap-6 text-gray-400">
              <button
                onClick={() => handleLike(post.id, post.has_liked)}
                className={`flex items-center gap-2 ${
                  post.has_liked ? 'text-red-500' : 'hover:text-red-500'
                } transition-colors`}
              >
                <Heart className={`h-5 w-5 ${post.has_liked ? 'fill-current' : ''}`} />
                <span>{post.likes_count}</span>
              </button>

              <button
                onClick={() => setCommentingOnPost(post.id)}
                className="flex items-center gap-2 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments_count}</span>
              </button>
            </div>

            {/* Comments Section */}
            {post.latest_comments?.length > 0 && (
              <div className="mt-4 space-y-2">
                {post.latest_comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar 
                      src={`https://res.cloudinary.com/dufw4ursl/image/upload/${comment.user?.profile_image}`}
                      text={comment.user?.username}
                      height={32}
                    />
                    <div className="bg-gray-700 rounded-lg p-2 flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-white">
                          {comment.user.username}
                        </span>
                        {comment.user.id === currentUser?.id && (
                          <button
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            {commentingOnPost === post.id && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => handleComment(post.id)}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
                <button
                  onClick={() => {
                    setCommentingOnPost(null);
                    setNewComment('');
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <WorkoutShareModal
          onClose={() => {
            setShowShareModal(false);
            fetchPosts();  // Refresh feed after sharing
          }}
        />
      )}
    </div>
  );
};

export default SocialFeed;