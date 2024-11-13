import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Users } from 'lucide-react';
import { socialService } from '../../services/socialService';
import Avatar from '../common/Avatar';
import SocialStats from './SocialStats';
import toast from 'react-hot-toast';

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    timeframe: 'all',
    workout_type: ''
  });
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await socialService.getFeed(filter);
      setPosts(response?.results || []);
    } catch (err) {
      setError('Could not load feed. Please try again later.');
      toast.error('Failed to load feed');
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (postId) => {
    try {
      await socialService.toggleLike(postId);
      fetchPosts();
    } catch (err) {
      toast.error('Unable to update like');
    }
  };

  const handleRetry = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Social Stats */}
      <div className="mb-8">
        <SocialStats />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filter.timeframe}
          onChange={(e) => setFilter(prev => ({ ...prev, timeframe: e.target.value }))}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
          disabled={loading}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={filter.workout_type}
          onChange={(e) => setFilter(prev => ({ ...prev, workout_type: e.target.value }))}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700"
          disabled={loading}
        >
          <option value="">All Types</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
        </select>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  src={post?.user?.profile_image}
                  text={post?.user?.username}
                  height={40}
                />
                <div>
                  <h3 className="font-medium text-white">{post?.user?.username}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(post.shared_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {post?.workout && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                    {post.workout.workout_type}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                    {post.workout.duration} mins
                  </span>
                </div>
              )}

              <div className="flex items-center gap-6 text-gray-400">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 ${
                    post.has_liked ? 'text-red-500' : 'hover:text-red-500'
                  } transition-colors`}
                  disabled={loading}
                >
                  <Heart className={`h-5 w-5 ${post.has_liked ? 'fill-current' : ''}`} />
                  <span>{post.likes_count || 0}</span>
                </button>

                <button 
                  onClick={() => navigate(`/workouts/${post.workout?.id}`)}
                  className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                  disabled={loading}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments_count || 0}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No posts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeed;