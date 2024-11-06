// src/components/social/Feed.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Users, AlertCircle, } from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../Avatar';
import CommentSection from './CommentSection';
import socialService from '../../services/socialService';
import { Alert } from '@/components/ui/alert';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [feedData, usersData] = await Promise.all([
          socialService.getFeed(1),
          socialService.getSuggestedUsers()
        ]);
        setPosts(feedData.results);
        setSuggestedUsers(usersData.results);
        setHasMore(!!feedData.next);
        setError(null);
      } catch (err) {
        setError('Failed to load feed');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lastPostRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const loadMore = async () => {
      if (page === 1) return;
      
      try {
        const data = await socialService.getFeed(page);
        setPosts(prev => [...prev, ...data.results]);
        setHasMore(!!data.next);
      } catch (err) {
        setError('Failed to load more posts');
      }
    };

    loadMore();
  }, [page]);

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post.has_liked) {
        await socialService.unlikeWorkout(postId);
      } else {
        await socialService.likeWorkout(postId);
      }

      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              has_liked: !post.has_liked,
              likes_count: post.has_liked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));
    } catch (err) {
      setError('Failed to update like');
    }
  };

  const handleFollow = async (userId) => {
    try {
      await socialService.followUser(userId);
      setSuggestedUsers(suggestedUsers.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to follow user');
    }
  };

  const handleCommentClick = (postId) => {
    setSelectedPost(postId);
    setShowComments(true);
  };

  const WorkoutPost = ({ post, isLast }) => (
    <div
      ref={isLast ? lastPostRef : null}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.user.profile_image}
              text={post.user.username}
              height={40}
            />
            <div>
              <h3 
                className="font-medium text-gray-900 hover:text-green-600 cursor-pointer"
                onClick={() => navigate(`/profiles/${post.user.id}`)}
              >
                {post.user.username}
              </h3>
              <p className="text-sm text-gray-500">
                {format(new Date(post.created_at), 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
          {post.user.id !== currentUser?.id && (
            <button
              onClick={() => handleFollow(post.user.id)}
              className="flex items-center gap-1 px-3 py-1 text-green-600 border border-green-600 rounded-full hover:bg-green-50"
            >
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">Follow</span>
            </button>
          )}
        </div>
      </div>

      {/* Workout Content */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {post.workout_type}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {post.duration} mins
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            {post.calories} calories
          </span>
          {post.intensity && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${post.intensity === 'high' 
                ? 'bg-red-100 text-red-800' 
                : post.intensity === 'moderate'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
              }`}
            >
              {post.intensity}
            </span>
          )}
        </div>
        {post.notes && (
          <p className="text-gray-600">{post.notes}</p>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t flex items-center gap-6">
        <button
          onClick={() => handleLike(post.id)}
          className={`flex items-center gap-2 ${
            post.has_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart className={`h-5 w-5 ${post.has_liked ? 'fill-current' : ''}`} />
          <span>{post.likes_count}</span>
        </button>
        <button
          onClick={() => handleCommentClick(post.id)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{post.comments_count}</span>
        </button>
      </div>

      {/* Comments Section */}
      {selectedPost === post.id && showComments && (
        <div className="border-t">
          <CommentSection
            workoutId={post.id}
            onClose={() => {
              setSelectedPost(null);
              setShowComments(false);
            }}
          />
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Activity Feed</h2>
            <button
              onClick={() => navigate('/workouts/create')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Share Workout
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
              <p className="text-gray-500 mb-4">Follow some users or share your own workout!</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <WorkoutPost
                key={post.id}
                post={post}
                isLast={index === posts.length - 1}
              />
            ))
          )}
        </div>

        {/* Suggested Users Sidebar */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Suggested Users</h3>
            {suggestedUsers.length > 0 ? (
              <div className="space-y-4">
                {suggestedUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.profile_image}
                        text={user.username}
                        height={40}
                      />
                      <div>
                        <p 
                          className="font-medium text-gray-900 hover:text-green-600 cursor-pointer"
                          onClick={() => navigate(`/profiles/${user.id}`)}
                        >
                          {user.username}
                        </p>
                        <p className="text-sm text-gray-500">{user.followers_count} followers</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(user.id)}
                      className="flex items-center gap-1 px-3 py-1 text-green-600 border border-green-600 rounded-full hover:bg-green-50"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="text-sm">Follow</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No suggestions available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;