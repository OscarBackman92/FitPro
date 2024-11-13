import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Users } from 'lucide-react';
import { socialService } from '../../services/socialService';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    timeframe: 'all',
    workout_type: ''
  });
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await socialService.getFeed(filter);
      setPosts(response.results);
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [filter]); // Include filter as a dependency

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Now fetchPosts is a stable reference

  const handleLike = async (postId) => {
    try {
      await socialService.toggleLike(postId);
      fetchPosts(); // Refresh posts to update likes
    } catch (err) {
      toast.error('Failed to like post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Filter Controls */}
      <div className="mb-6">
        <select
          value={filter.timeframe}
          onChange={(e) => setFilter(prev => ({ ...prev, timeframe: e.target.value }))}
          className="mr-4 bg-gray-800 text-white rounded-lg px-4 py-2"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        
        <select
          value={filter.workout_type}
          onChange={(e) => setFilter(prev => ({ ...prev, workout_type: e.target.value }))}
          className="bg-gray-800 text-white rounded-lg px-4 py-2"
        >
          <option value="">All Types</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
        </select>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={post.user.profile_image}
                  text={post.user.username}
                  height={40}
                />
                <div>
                  <h3 className="font-medium text-white">{post.user.username}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(post.shared_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Workout Details */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                  {post.workout.workout_type}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                  {post.workout.duration} mins
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 text-gray-400">
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 ${
                  post.has_liked ? 'text-red-500' : 'hover:text-red-500'
                } transition-colors`}
              >
                <Heart className={`h-5 w-5 ${post.has_liked ? 'fill-current' : ''}`} />
                <span>{post.likes_count}</span>
              </button>
              
              <button 
                onClick={() => navigate(`/workouts/${post.workout.id}`)}
                className="flex items-center gap-2 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments_count}</span>
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
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